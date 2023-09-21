/**
 * 滚动监听 Scrollspy
 *
 * 给标签加上 `.tc-scrollspy`，[`data-dom` 写选择符，默认为 `body`，当页面有两个以上时必写]；
 * 接着在 js 中初始化 `Scrollspy.init()`，可传入选项
 *
 * 注：`data-dom` 指向的元素应是已定位的！！！
 */
const Scrollspy = {
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

      const {anchors, linksRenfer} = metaObj;

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
    const {anchors, linksRenfer, activeNodes} = metaObj;
    let index = 0;

    do {
      index += 1;
    } while (anchors[index] && anchors[index].offsetTop <= top);

    const activeId = anchors[index - 1].id;
    const $activeLink = linksRenfer[activeId];
    let level = 0;
    let $p = $activeLink.parentNode;

    // 如果已是active，return不做操作
    // if (activeNodes.indexOf($p) > -1) return;
    // 从二级切换到一级时，activeNodes 包含了一级，这里确保能删除二级 .active
    if (activeNodes.indexOf($p) === 0) return;
    // 删除上次的active link
    activeNodes.forEach((val) => val.classList.remove('active'));
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

export default Scrollspy;
