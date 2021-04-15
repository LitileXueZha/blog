import { encode, decode } from 'js-base64';

import './index.less';
import { Ripple, FloatText } from 'src/index.js';

const { debounce } = window.TC;

window.addEventListener('load', () => {
  Ripple.init();

  // 几个 tab DOM 和容器 DOM
  let tab = 'base64'; // 当前 tab 页
  const tabObj = {
    base64: document.querySelector('.list-tool > .base64'),
    character: document.querySelector('.list-tool > .character'),
    base64_C: document.querySelector('.container-tool > .base64'),
    character_C: document.querySelector('.container-tool > .character'),
  };

  // 初始化以及监听 tab 的点击
  renderTab();
  window.addEventListener('hashchange', renderTab);

  initBase64();

  // 初始化 Base64
  function initBase64() {
    // 1. 文字转化
    const doms = document.querySelectorAll('.text-to-b64 > textarea.input, .b64-to-text > textarea.input');

    Array.prototype.slice
      .call(doms)
      .forEach((dom) => {
        const { pattern } = dom.dataset;
        const $transformed = dom.nextElementSibling.nextElementSibling;

        // 绑定keyup事件，转码
        if (pattern === 'text') {
          dom.addEventListener('keyup', debounce(() => {
            $transformed.value = encode(dom.value);
          }));
        } else if (pattern === 'b64') {
          dom.addEventListener('keyup', debounce(() => {
            let str = '';

            try {
              str = decode(dom.value);
            } catch (e) {
              str = '';
            }
            $transformed.value = str;
          }));
        }

        cp($transformed);
      });

    // 2. 图片转 Base64
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

    // 3. Base64转图片
    const $textarea = document.querySelector('.text-to-img > textarea');
    const img = document.createElement('img');

    $textarea.addEventListener('keyup', () => {
      const src = `data:image/png;base64,${$textarea.value}`;

      img.src = src;
    });
    $textarea.nextElementSibling.nextElementSibling.appendChild(img);

    /**
     * 图片转 Base64 函数
     * 浏览器支持的几种 image 类型：jpeg、gif、x-icon、png
     */
    function handleFile(file) {
      if (!file) return;
      // eslint-disable-next-line no-else-return
      else if (!/\.(ico)|(jpg)|(jpeg)|(gif)|(png)$/i.test(file.name)) {
        // 不是常见图片格式，不转
        $file.value = '';
        $transformed.value = '只支持ico、jpg、.gif、png格式图片，建议小于100Kb';
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
        $transformed.value = reader.result.replace(/^data:image\/[\w-]{3,6};base64,/, '');
      };
      reader.readAsDataURL(file);
    }
  }

  // 快捷复制功能
  function cp($transformed) {
    const cpDom = $transformed.nextElementSibling;

    cpDom.addEventListener('click', () => {
      $transformed.select();
      if (document.execCommand('copy')) {
        $transformed.blur();
        FloatText.action('复制成功', cpDom);
      }
    });
  }

  // 根据 location.hash 控制 tab 选项卡的显示
  function renderTab() {
    let { hash } = window.location;

    hash = hash.replace('#', '');

    // 默认显示第一个 tab，base64 工具
    if (!hash) hash = 'base64';

    // 与当前一致，不做任何操作
    if (hash === tab) return;

    // 取消 active
    tabObj[tab].classList.remove('active');
    tabObj[`${tab}_C`].classList.remove('active');
    // 添加 active
    tabObj[hash].classList.add('active');
    tabObj[`${hash}_C`].classList.add('active');

    // 设置当前 tab 变量
    tab = hash;
  }
});
