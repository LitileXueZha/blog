/**
 * 漂浮组件 FloatText，点击浮出一段文字
 *
 * 给标签加上 `.tc-float-text` 和 `data-text`，js 中 `FloatText.init()`；
 * 直接调用 `action` 触发也行
 */
const FloatText = {
  map: new Map(),
  init() {
    Array.prototype.slice
      .call(document.querySelectorAll('.tc-float-text'))
      .forEach((val) => {
        val.addEventListener('click', () => this.action(val.dataset.text, val));
      });
  },

  /**
   * 触发漂浮操作
   *
   * @param {string} text 要漂浮的文本
   * @param {HTMLElement} dom 绑定的元素
   */
  action(text, dom) {
    // 当前dom已有漂浮文本
    if (this.map.has(dom)) return;

    const {
      left, top, width, height,
    } = dom.getBoundingClientRect();
    const span = document.createElement('span');

    span.className = 'tc-float-text span';
    span.style.left = `${left + window.pageXOffset + (width / 2)}px`;
    span.style.top = `${top + window.pageYOffset + (height / 2)}px`;
    span.innerHTML = text;
    document.body.appendChild(span);
    span.classList.add('floating');
    this.map.set(dom, true);

    setTimeout(() => {
      document.body.removeChild(span);
      this.map.delete(dom);
    }, 400 + 250);
  },
};

export default FloatText;
