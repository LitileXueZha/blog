import './index.less';

// 便于打包优化，别直接 `import` 对应的文件
export * from './plugins/index.js';
export * from './common/index.pug.js';
export * from './common/constants.js';
export { default as fetch } from './common/request.js';

// 通用库的封装
window.TC = {
  /**
   * 防抖
   *
   * @param {Function} fn 执行函数
   * @param {Number} duration 延迟时间
   * @returns {Function}
   */
  debounce(fn, duration = 400) {
    let timer = null;

    return () => {
      clearTimeout(timer);

      timer = setTimeout(fn, duration);
    };
  },

  /**
   * 节流
   * 
   * @param {function} fn 执行函数
   * @param {number} minUnit 默认间隔为 `10`
   * @return {function} 参数为节流单位。可以是像素、时间等
   */
  throttle(fn, minUnit = 10) {
    let lastUnit = 0;

    return (unit) => {
      if (Math.abs(lastUnit - unit) < minUnit) {
        return;
      }

      lastUnit = unit;
      fn();
    };
  },

  /**
   * 转义 html 标签
   *
   * @param {String} str html 字符串
   * @return {String} 字符串
   */
  escapeHtml(str) {
    const match = /["&'<>]/.exec(str);

    if (!match) {
      return str;
    }

    const characters = {
      '"': '&quot;',
      '&': '&amp;',
      '\'': '&#x27;',
      '<': '&lt;',
      '>': '&gt;',
    };
    const arrEscape = [];
    let lastIndex = 0;
    const endIndex = str.length - 1;

    for (let i = match.index; i <= endIndex; i++) {
      const escapeStr = characters[str[i]];

      if (escapeStr) {
        arrEscape.push(str.substring(lastIndex, i));
        arrEscape.push(escapeStr);
        lastIndex = i + 1;
      } else if (i === endIndex) {
        // 拼接上最后一段字符
        arrEscape.push(str.substring(lastIndex));
      }
    }

    return arrEscape.join('');
  },
};

// 常用变量定义
window.REG_QUERY = /^\?(\w+)$/;
