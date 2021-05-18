import { encode, decode } from 'js-base64';

const { debounce } = window.TC;

/**
 * 初始化 base64 转码
 */
export default function initBase64() {
  // 1. 文字转化
  const $doms = document.querySelectorAll('.text-to-b64 > textarea.input, .b64-to-text > textarea.input');

  Array.prototype.slice
    .call($doms)
    .forEach(($dom) => {
      const { pattern } = $dom.dataset;
      const $transformed = $dom.nextElementSibling.nextElementSibling;
      // 编码
      const evEncode = debounce(() => {
        $transformed.value = encode($dom.value);
      });
      // 解码
      const evDecode = debounce(() => {
        let str = '';

        try {
          str = decode($dom.value);
        } catch (e) {
          str = '';
        }
        $transformed.value = str;
      });

      // 绑定keyup事件，转码
      if (pattern === 'text') {
        $dom.addEventListener('keyup', evEncode);
        $dom.addEventListener('mouseup', evEncode);
      } else if (pattern === 'b64') {
        $dom.addEventListener('keyup', evDecode);
        $dom.addEventListener('mouseup', evDecode);
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
  const $img = document.createElement('img');
  const evImgsrc = () => {
    $img.src = $textarea.value;
  };

  $textarea.addEventListener('keyup', evImgsrc);
  $textarea.addEventListener('mouseup', evImgsrc);
  $textarea.nextElementSibling.nextElementSibling.appendChild($img);

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
      $transformed.value = reader.result;
    };
    reader.readAsDataURL(file);
  }
}

// 快捷复制功能
function cp($transformed) {
  const $cpDom = $transformed.nextElementSibling;
  let timer = null;

  $cpDom.addEventListener('click', () => {
    $transformed.select();
    clearTimeout(timer);
    if (document.execCommand('copy')) {
      $transformed.blur();
      $cpDom.classList.add('copied');
      timer = setTimeout(() => {
        $cpDom.classList.remove('copied');
      }, 1500);
    }
  });
}
