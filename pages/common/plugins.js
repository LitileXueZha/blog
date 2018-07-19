/**
 * 水波纹插件
 * 使用：在需要的 html 标签上添加 .tc-ripple；然后 js 中调用 Ripple.init() 即可。
 * @return {object} 一个 Ripple 普通对象
*/

export const Ripple = {
  color: 'rgba(0,0,0,0.3)',
  duration: 550,
  quantity: 0,
  max: 4,
  platform: 'pc',

  init({ color, duration } = {}) {
    // 自定义水波纹颜色与扩散时间
    if (color) this.color = color;
    if (duration) this.duration = duration;

    // 查询是否为移动端
    if (/mobile/i.test(navigator.userAgent)) this.platform = 'mobile';

    Array
      .from(document.querySelectorAll('.tc-ripple'))
      .forEach(val => this.add(val));
  },

  add(node) {
    const wraper = document.createElement('span');
    const { width, height } = node.getBoundingClientRect();
    const startEventName = this.platform === 'pc' ? 'mousedown' : 'touchstart';
    const leaveEventName = this.platform === 'pc' ? 'mouseup' : 'touchend';

    wraper.className = 'tc-ripple-wraper';
    wraper.style.width = `${width}px`;
    wraper.style.height = `${height}px`;

    node.appendChild(wraper);
    node.addEventListener(startEventName, this.start, false);
    node.addEventListener(leaveEventName, this.leave, false);
  },

  start(event) {
    // ripple达到数量最大时，不再添加
    if (Ripple.quantity === Ripple.max) return;

    const { offsetX, offsetY } = event;
    const { width, height } = this.getBoundingClientRect();
    const px = offsetX > width / 2 ? offsetX : width - offsetX;
    const py = offsetY > height / 2 ? offsetY : height - offsetY;
    const length = Math.sqrt((px * px) + (py * py));
    const span = document.createElement('span');
    const wraper = this.querySelector('.tc-ripple-wraper');

    span.className = 'tc-ripple-span';
    span.style.left = `${offsetX - length}px`;
    span.style.top = `${offsetY - length}px`;
    span.style.backgroundColor = Ripple.color;
    span.style.width = `${length * 2}px`;
    span.style.height = `${length * 2}px`;
    span.dataset.t = Date.now();
    span.style.transitionDuration = Ripple.duration;

    wraper.appendChild(span);
    Ripple.quantity += 1;
  },

  leave() {
    const wraper = this.querySelector('.tc-ripple-wraper');
    const span = wraper.lastElementChild;
    const startTime = parseInt(span.dataset.t, 10);
    const delay = Ripple.duration - ((Date.now() - startTime) / 1000);

    setTimeout(() => {
      if (!span.parentNode) return;

      wraper.removeChild(span);
      Ripple.quantity -= 1;
    }, delay > 0 ? delay : 0);
  },
};
