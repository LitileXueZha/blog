/**
 * 滚动固定组件 Affix
 *
 * 在外面套一层 `div.tc-affix`，设置 `data-top`，距离浏览器顶部的高度；
 * 接着在 js 中 `Affix.init()` 初始化
 */
const Affix = {
  nodes: [],
  init() {
    Array.prototype.slice
      .call(document.querySelectorAll('.tc-affix'))
      .forEach((val) => this.add(val));

    // 监听scroll时间
    window.addEventListener('scroll', () => {
      this.nodes.forEach((val) => this.changePos(val));
    });
  },
  add(node) {
    const fixTop = parseInt(node.dataset.top, 10) || 0;
    const {
      width, height, top, left,
    } = node.getBoundingClientRect();
    const fixed = top < 0;
    const offsetTop = top + window.pageYOffset;

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

    if (fixed && window.pageYOffset <= offsetTop - fixTop) {
      // 回到原来的位置上
      node.style.position = 'static';
      node.classList.remove('affixing');
      obj.fixed = false;
      return;
    }

    if (!fixed && window.pageYOffset > offsetTop - fixTop) {
      // 滚动超出，需要fix
      node.style.position = 'fixed';
      node.classList.add('affixing');
      obj.fixed = true;
    }
  },
};

export default Affix;
