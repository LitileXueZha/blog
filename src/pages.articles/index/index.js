import './index.less';
import { Ripple } from '../../common';

window.addEventListener('load', () => {
  Ripple.init();

  // 监听筛选关闭
  document.querySelector('.filters').addEventListener('click', (e) => {
    if (e.target.tagName === 'INPUT') return;

    if (e.target.getAttribute('class') === 'icon icon-close') {
      // 这里因为关闭图标放在label里，点击会触发选中，阻止之
      e.stopPropagation();
      e.preventDefault();
      e.target.parentNode.previousElementSibling.checked = false;
      // setTimeout(() => e.target.parentNode.previousElementSibling.checked = false, 0);
    }
  });
});
