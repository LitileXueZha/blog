/**
 * 水波纹插件 Ripple
 *
 * 在需要的 html 标签上添加 `.tc-ripple`；然后 js 中调用 `Ripple.init()` 即可。
 */
const Ripple = {
  color: 'rgba(0,0,0,0.3)',
  duration: 550,
  quantity: 0,
  max: 4,
  platform: 'pc',

  async init({color, duration} = {}) {
    if (__DEV__) {
      // 等待开发环境下 style-loader 注入 css
      await new Promise((done) => setTimeout(done, 300));
    }
    // 自定义水波纹颜色与扩散时间
    if (color) this.color = color;
    if (duration) this.duration = duration;

    // 查询是否为移动端
    if (/mobile/i.test(navigator.userAgent)) this.platform = 'mobile';

    Array.prototype.slice
      .call(document.getElementsByClassName('tc-ripple'))
      .forEach((val) => this.add(val));
  },

  add(node) {
    const wraper = document.createElement('span');
    const {width, height} = node.getBoundingClientRect();
    const startEventName = this.platform === 'pc' ? 'mousedown' : 'touchstart';
    const leaveEventName = this.platform === 'pc' ? 'mouseup' : 'touchend';

    wraper.className = 'tc-ripple-wraper';
    wraper.style.width = `${width}px`;
    wraper.style.height = `${height}px`;

    node.appendChild(wraper);
    node.addEventListener(startEventName, this.start, false);
    node.addEventListener(leaveEventName, this.leave, false);
    if (this.platform === 'pc') {
      // 修复鼠标拖拽出 dom 区域后 mouseup 未触发，导致 ripple-span 未删除问题
      node.addEventListener('mouseout', this.leave);
    }
  },

  start(event) {
    // ripple达到数量最大时，不再添加
    if (Ripple.quantity === Ripple.max) return;

    const {
      offsetX, offsetY, width, height,
    } = Ripple.enhancedOffset(event, this);
    // const { width, height } = this.getBoundingClientRect();
    const px = offsetX > width / 2 ? offsetX : width - offsetX;
    const py = offsetY > height / 2 ? offsetY : height - offsetY;
    const length = Math.sqrt((px * px) + (py * py));
    const span = document.createElement('span');
    const wraper = this.querySelector('.tc-ripple-wraper');
    const spanBg = document.createElement('span');

    span.className = 'tc-ripple-span';
    span.style.left = `${offsetX - length}px`;
    span.style.top = `${offsetY - length}px`;
    span.style.width = `${length * 2}px`;
    span.style.height = `${length * 2}px`;
    // span.dataset.t = Date.now();
    // span.style.animationDuration = `${Ripple.duration}ms`;
    spanBg.className = 'tc-ripple-span_bg';
    spanBg.style.backgroundColor = Ripple.color;

    wraper.appendChild(span);
    span.appendChild(spanBg);
    Ripple.quantity += 1;
  },

  leave() {
    const wraper = this.querySelector('.tc-ripple-wraper');
    const span = wraper.lastElementChild;
    // const startTime = parseInt(span.dataset.t, 10);
    // const delay = Ripple.duration - (Date.now() - startTime);

    if (!span) return;
    span.classList.add('leave');
    setTimeout(() => {
      if (!span.parentNode) return;

      wraper.removeChild(span);
      Ripple.quantity -= 1;
      // 在动画结束之前删除 dom 节点
    }, Ripple.duration - 50);
  },

  enhancedOffset(event, node) {
    let {offsetX, offsetY} = event;
    const {
      left, top, width, height,
    } = node.getBoundingClientRect();
    // 移动端 touch 事件
    if (this.platform === 'mobile') {
      offsetX = event.targetTouches[0].pageX - left;
      offsetY = event.targetTouches[0].pageY - top;
    }

    return {
      offsetX, offsetY, width, height,
    };
  },
};

export default Ripple;
