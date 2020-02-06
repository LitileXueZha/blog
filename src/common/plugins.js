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
    const {
      width, height, top, left,
    } = node.getBoundingClientRect();
    const fixed = top < 0;
    const offsetTop = top + window.scrollY;

    // 保留占位，防止布局错乱
    node.style.width = `${width}px`;
    node.style.height = `${height}px`;

    // 初始化node的状态
    node.firstElementChild.style.top = `${fixTop}px`;
    node.firstElementChild.style.left = `${left}px`;
    node.firstElementChild.style.width = `${width}px`;
    if (fixed) {
      node.firstElementChild.style.position = 'fixed';
      node.firstElementChild.classList.add('affixing');
    }
    this.nodes.push({
      node: node.firstElementChild,
      fixed,
      offsetTop,
      fixTop,
    });
  },
  changePos(obj) {
    const {
      node, fixed, offsetTop, fixTop,
    } = obj;

    if (fixed && window.scrollY <= offsetTop - fixTop) {
      // 回到原来的位置上
      node.style.position = 'static';
      node.classList.remove('affixing');
      obj.fixed = false;
      return;
    }

    if (!fixed && window.scrollY > offsetTop - fixTop) {
      // 滚动超出，需要fix
      node.style.position = 'fixed';
      node.classList.add('affixing');
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

    const {
      left, top, width, height,
    } = dom.getBoundingClientRect();
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

/**
 * 滚动监听
 * 使用：给标签加上.tc-scrollspy，[data-dom写选择符，默认为body，当页面有两个以上时必写]，js中初始化之。init可传入选项
 * 注：data-dom指向的元素应是已定位的！！！
 * @return {Object} Scrollspy，一个普通对象
 */
export const Scrollspy = {
  map: new Map(),
  lineHeight: 10,
  dom: document.body,
  level: 1,
  className: 'active',
  init(options = {}) {
    // 初始化选项
    if (options.lineHeight) this.lineHeight = options.lineHeight;
    if (options.dom) this.dom = options.dom;
    if (options.level) this.level = options.level;
    if (options.className) this.className = options.className;

    const spyArr = Array.prototype.slice.call(document.querySelectorAll('.tc-scrollspy'));

    if (spyArr.length > 1 && (!spyArr[0].dataset.dom && !spyArr[1].dataset.dom)) {
      // 监听元素大于2，都默认到body上，抛出错误
      throw new RangeError('监听的.tc-scrollspy其中之一没有定义data-dom，总不能都看body滚动吧');
    }

    spyArr.forEach((val) => {
      const spy = (val.dataset.dom && document.querySelector(val.dataset.dom)) || this.dom;

      this.add(spy, val);
    });
  },
  add(spy, dom) {
    const isBody = spy === this.dom;
    const $spy = isBody ? window : spy;
    const links = Array.prototype.slice.call(dom.querySelectorAll('a'));
    let i = 0;
    let lastTop = isBody ? document.documentElement.scrollTop : spy.scrollTop;

    // init
    this.change(links, spy, lastTop, dom);
    $spy.addEventListener('scroll', () => {
      const top = isBody ? (window.scrollY || document.documentElement.scrollTop) : spy.scrollTop;
      if (i < this.lineHeight) {
        i += 1;

        // 点击链接跳转时会大于，一般小于为滚动
        if (Math.abs(lastTop - top) < this.lineHeight) return;
      }

      // 重置
      i = 0;
      lastTop = top;

      this.change(links, spy, top, dom);
    });
  },
  change(links, spy, top, dom) {
    let metaObj = null;

    // 如果存了，直接拿
    if (this.map.has(spy)) {
      metaObj = this.map.get(spy);
    } else {
      const hrefStr = links[0].getAttribute('href').substr(1);

      // 初始化一个obj
      metaObj = {
        anchors: [document.getElementById(hrefStr)],
        linksRenfer: {
          [hrefStr]: links[0],
        },
        activeNodes: Array.prototype.slice.call(dom.querySelectorAll('.active')),
      };

      const { anchors, linksRenfer } = metaObj;

      for (let i = 1; i < links.length; i += 1) {
        const href = links[i].getAttribute('href').substr(1);
        const anchor = document.getElementById(href);

        // 没有对应id元素
        if (!anchor) continue;

        // 添加到对象里，可直接访问该link
        linksRenfer[href] = links[i];

        // 如果大于最后一位，直接放到最后面
        if (anchor.offsetTop > anchors[i - 1].offsetTop) {
          anchors[i] = anchor;
          continue;
        }

        // 插排
        for (let j = 0; j < i && anchors[j + 1].offsetTop < anchor.offsetTop; j += 1) {
          anchors.splice(j, 0, anchor);
        }
      }
      // 存储meta信息
      // 由于是引用值，直接存即可
      this.map.set(spy, metaObj);
    }

    // 在anchors中查找此时active的link
    const { anchors, linksRenfer, activeNodes } = metaObj;
    let index = 0;

    do {
      index += 1;
    } while (anchors[index] && anchors[index].offsetTop <= top);

    const activeId = anchors[index - 1].id;
    const $activeLink = linksRenfer[activeId];
    let level = 0;
    let $p = $activeLink.parentNode;

    // 如果已是active，return不做操作
    if (activeNodes.indexOf($p) > -1) return;
    // 删除上次的active link
    activeNodes.forEach(val => val.classList.remove('active'));
    metaObj.activeNodes = [];
    // 只给li加上className
    while (level <= this.level) {
      if ($p === dom) break;
      if ($p.tagName === 'LI') {
        $p.classList.add(this.className);
        metaObj.activeNodes[level] = $p;
        level += 1;
      }
      $p = $p.parentNode;
    }
  },
};
