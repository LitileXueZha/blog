/* eslint-disable import/prefer-default-export */

/**
 * 插件列表：
 * + `Ripple` 水波纹。
 * + `Affix` 滚动固定。滚动到某个位置时元素固定
 * + `Scrollspy` 滚动监听。
 * + `FloatText` 漂浮文本。点击时一段文本向上浮动，然后消失
 * 
 * @example 一般都是给标签加 class，然后 js 中初始化
 * 
 * ```html
 * <div class="tc-ripple"></div>
 * ```
 * 
 * ```javascript
 * Ripple.init();
 * Ripple.init({}); // 可传入配置对象
 * ```
 */

export { default as Ripple } from './Ripple.js';
export { default as Affix } from './Affix.js';
export { default as Scrollspy } from './Scrollspy.js';
export { default as FloatText } from './FloatText.js';
export { default as PaginationBase } from './PaginationBase.js';
