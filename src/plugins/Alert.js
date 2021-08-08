/**
 * 提示栏 Alert
 * 
 * 在导航栏下面的一条信息提示栏，支持 html，直接使用即可 `Alert.info()`。
 * 
 * 目前支持的类型有：
 * + `info` 正常信息
 * + `error` 错误（红色）
 */

function AlertPlugin() {
  this._id = `alert${String(Math.random()).substr(2, 6)}`;
  this.$container = null;
  this.$content = null;
  /** 当前类型 */
  this._type = undefined;
  this._active = false;
}

/** 正常提示栏 */
AlertPlugin.prototype.info = function info(html, opts = {}) {
  this._open({
    ...opts,
    type: 'info',
    html,
  });
};

/** 错误提示栏（红色） */
AlertPlugin.prototype.error = function error(html, opts = {}) {
  this._open({
    ...opts,
    type: 'error',
    html,
  });
};

AlertPlugin.prototype._open = function open(opts) {
  if (!this.$container) {
    this._init(opts);
    return;
  }

  const { type, html, closed } = opts;
  const { $container, $content } = this;

  if (closed) $container.classList.add('closed');
  else $container.classList.remove('closed');
  if (this._type !== type) {
    $container.classList.remove(this._type);
    $container.classList.add(type);
    this._type = type;
  }
  if (!this._active) {
    $container.classList.add('active');
    this._active = true;
  }
  $content.innerHTML = html;
};

/** 初始化（仅在调用之后） */
AlertPlugin.prototype._init = function initialize(opts) {
  const { type, html, closed } = opts;
  const $afterDom = document.querySelector('header');
  const alertHtml = window.TC.minifyHtmlTags(`
    <div id="${this._id}" class="tc-alert ${type} active${closed ? ' closed' : ''}">
      <div class="tc-alert-body tc-container">
        <p class="tc-alert-content">${html}</p>
        <button class="tc-alert-close">${closeIconSVG()}</button>
      </div>
    </div>
  `);

  // 插入到 header 之后
  $afterDom.insertAdjacentHTML('afterend', alertHtml);
  this.$container = $afterDom.nextSibling;
  this.$content = this.$container.querySelector('.tc-alert-content');
  this._type = type;
  this._active = true;

  this.$container
    .querySelector('.tc-alert-close')
    .addEventListener('click', () => this.close());
};

/** 关闭 */
AlertPlugin.prototype.close = function close() {
  if (!(this.$container && this._active)) return;

  this.$container.classList.remove('active');
  this._active = false;
};

function closeIconSVG() {
  return window.TC.minifyHtmlTags(`
    <svg class="icon icon-close" width="12" height="12" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
      <path fill="currentColor" d="M891.264 901.248a30.784 30.784 0 0 1-21.76-9.024L128.256 150.976a30.72 30.72 0 1 1 43.52-43.52l741.312 741.312a30.848 30.848 0 0 1-21.824 52.48"></path>
      <path fill="currentColor" d="M150.016 901.248a30.72 30.72 0 0 1-21.76-52.544l741.312-741.248a30.784 30.784 0 0 1 43.456 43.52L171.776 892.224a30.72 30.72 0 0 1-21.76 9.024"></path>
    </svg>
  `);
}

export default new AlertPlugin();
