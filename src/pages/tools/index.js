import {encode, decode} from 'js-base64';

import './index.less';
import {Ripple, FloatText} from 'src/index.js';
import initBase64 from './Base64.js';
import initSourceMap from './SourceMap.js';

const {debounce} = window.TC;

document.addEventListener('DOMContentLoaded', () => {
  Ripple.init();

  // 几个 tab DOM 和容器 DOM
  let tab = 'base64'; // 当前 tab 页
  const $tabObj = {
    base64: document.querySelector('.list-tool > .base64'),
    character: document.querySelector('.list-tool > .character'),
    sourcemap: document.querySelector('.list-tool > .sourcemap'),
    base64_C: document.querySelector('.container-tool > .base64'),
    character_C: document.querySelector('.container-tool > .character'),
    sourcemap_C: document.querySelector('.container-tool > .sourcemap'),
  };

  // 初始化以及监听 tab 的点击
  renderTab();
  window.addEventListener('hashchange', renderTab);

  initBase64();
  initSourceMap();

  // 根据 location.hash 控制 tab 选项卡的显示
  function renderTab() {
    let {hash} = window.location;

    hash = hash.replace('#', '');

    // 默认显示第一个 tab，base64 工具
    if (!hash) hash = 'base64';

    // 与当前一致，不做任何操作
    if (hash === tab) return;

    // 取消 active
    $tabObj[tab].classList.remove('active');
    $tabObj[`${tab}_C`].classList.remove('active');
    // 添加 active
    $tabObj[hash].classList.add('active');
    $tabObj[`${hash}_C`].classList.add('active');

    // 设置当前 tab 变量
    tab = hash;
  }
});
