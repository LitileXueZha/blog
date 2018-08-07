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

    Array.prototype.slice
      .call(document.querySelectorAll('.tc-ripple'))
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


/**
 * 滚动固定组件，Affix
 * 使用：在外面套一层div.tc-affix，设置data-top，距离浏览器顶部的高度；需要在js中Affix.init()初始化
 * @return {Object} Affix，一个普通对象
 */
export const Affix = {
  nodes: [],
  init() {
    Array.prototype.slice
      .call(document.querySelectorAll('.tc-affix'))
      .forEach(val => this.add(val));

    // 监听scroll时间
    window.addEventListener('scroll', () => {
      this.nodes.forEach(val => this.changePos(val));
    });
  },
  add(node) {
    const fixTop = parseInt(node.dataset.top, 10) || 0;
    const { width, height, top } = node.getBoundingClientRect();
    const fixed = top < 0;
    const offsetTop = top + window.scrollY;

    // 保留占位，防止布局错乱
    node.style.width = `${width}px`;
    node.style.height = `${height}px`;

    // 初始化node的状态
    node.firstElementChild.style.top = `${fixTop}px`;
    if (fixed) {
      node.firstElementChild.style.position = 'fixed';
    }
    this.nodes.push({
      node: node.firstElementChild,
      fixed,
      offsetTop,
      fixTop,
    });
  },
  changePos(obj) {
    const { node, fixed, offsetTop, fixTop } = obj;

    if (fixed && window.scrollY <= offsetTop - fixTop) {
      // 回到原来的位置上
      node.style.position = 'static';
      obj.fixed = false;
      return;
    }

    if (!fixed && window.scrollY > offsetTop - fixTop) {
      // 滚动超出，需要fix
      node.style.position = 'fixed';
      obj.fixed = true;
    }
  },
};

/**
 * 漂浮组件，点击浮出一段文字
 * 使用：给标签加上.tc-float-text和data-text，js中FloatText.init()；直接调用action触发也行
 * @return {Object} FloatText，一个普通对象
 */
export const FloatText = {
  map: new Map(),
  init() {
    Array.prototype.slice
      .call(document.querySelectorAll('.tc-float-text'))
      .forEach((val) => {
        val.addEventListener('click', () => this.action(val.dataset.text, val));
      });
  },
  action(text, dom) {
    // 当前dom已有漂浮文本
    if (this.map.has(dom)) return;

    const { left, top, width, height } = dom.getBoundingClientRect();
    const span = document.createElement('span');

    span.className = 'tc-float-text span';
    span.style.left = `${left + window.scrollX + (width / 2)}px`;
    span.style.top = `${top + window.scrollY + (height / 2)}px`;
    span.innerHTML = text;
    document.body.appendChild(span);
    span.classList.add('floating');
    this.map.set(dom, true);

    setTimeout(() => {
      document.body.removeChild(span);
      this.map.delete(dom);
    }, 400);
  },
};
