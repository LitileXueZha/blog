import { Base64 } from 'js-base64';

import './index.less';
import { Ripple, FloatText } from '../common/plugins';

const { debounce } = window.TC;

window.addEventListener('load', () => {
  Ripple.init();

  // IIFE，执行文字转化
  (function text() {
    const doms = document.querySelectorAll('.text-to-b64 > textarea.input, .b64-to-text > textarea.input');

    Array.prototype.slice
      .call(doms)
      .forEach((dom) => {
        const { pattern } = dom.dataset;
        const $transformed = dom.nextElementSibling.nextElementSibling;

        // 绑定keyup事件，转码
        if (pattern === 'text') {
          dom.addEventListener('keyup', debounce(() => {
            $transformed.value = Base64.encode(dom.value);
          }));
        } else if (pattern === 'b64') {
          dom.addEventListener('keyup', debounce(() => {
            let str = '';

            try {
              str = Base64.decode(dom.value);
            } catch (e) {
              str = '';
            }
            $transformed.value = str;
          }));
        }

        cp($transformed);
      });
  }());

  // IIFE，执行图片转Base64
  (function imgToBase64() {
    const $file = document.getElementById('img');
    const $transformed = $file.parentNode.nextElementSibling.nextElementSibling;
    const $preview = $file.previousElementSibling;
    const $info = $preview.previousElementSibling;

    $file.addEventListener('change', () => handleFile($file.files[0]));
    cp($transformed);

    // 拖拽事件
    $file.addEventListener('dragover', e => e.preventDefault());
    $file.addEventListener('dragenter', e => e.preventDefault());
    $file.addEventListener('drop', (e) => {
      handleFile(e.dataTransfer.files[0]);
      e.preventDefault();
      e.stopPropagation();
      return false;
    });

    function handleFile(file) {
      if (!file) return;
      else if (!/\.(bmp)|(jpg)|(jpeg)|(gif)|(png)$/i.test(file.name)) {
        // 不是常见图片格式，不转
        $file.value = '';
        $transformed.value = '只支持bmp、jpg、.gif、png格式图片，建议小于100Kb';
        $info.classList.remove('hidden');
        $preview.classList.add('hidden');
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        // 隐藏提示信息，显示预览图。把结果输出到textarea
        $info.classList.add('hidden');
        $preview.classList.remove('hidden');
        $preview.firstElementChild.src = reader.result;
        $transformed.value = reader.result.replace(/^data:image\/\w{3,4};base64,/, '');
      };
      reader.readAsDataURL(file);
    }
  }());

  // IIFE，Base64转图片
  (function base64ToImg() {
    const $textarea = document.querySelector('.text-to-img > textarea');
    const $downloadLink = $textarea.nextElementSibling.nextElementSibling.nextElementSibling;
    const img = document.createElement('img');

    $textarea.addEventListener('keyup', () => {
      const url = `data:image/png;base64,${$textarea.value}`;

      $downloadLink.href = url;
      $downloadLink.download = `${Date.now()}`;
      img.src = url;
    });
    $textarea.nextElementSibling.nextElementSibling.appendChild(img);
  }());

  function cp($transformed) {
    // 快捷复制功能
    const cpDom = $transformed.nextElementSibling;

    cpDom.addEventListener('click', () => {
      $transformed.select();
      if (document.execCommand('copy')) {
        $transformed.blur();
        FloatText.action('复制成功', cpDom);
      }
    });
  }
});
