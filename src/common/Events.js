/* eslint-disable no-underscore-dangle */
const DEFAULT_MAX_LISTENERS = 10;

/**
 * 事件（发布/订阅机制）
 * 
 * 主要参考 w3c 规范 `EventTarget`，另外有一些 node 实现
 * 
 * @example
 * ```javascript
 * const ev = new Events();
 * ev.add('evName', fn); // 也可以用 addEventListener
 * ev.dispatch('evName');
 * ev.dispatch(new EventsUnit('evName', data));
 * ev.once(); // 一次性
 * ev.remove(); // 删除
 * ```
 * 
 * @link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
 */
export default function Events() {
  this._listeners = new Map();
  this._once_ = new WeakMap();
  this._maxListeners = DEFAULT_MAX_LISTENERS;
}

/**
 * 触发
 * @param {EventsUnit|string} e 事件类型或事件单元实例
 * @param {any} data 传递数据
 */
Events.prototype.dispatch = function dispatch(e, data) {
  const ev = e instanceof EventsUnit ? e : new EventsUnit(e, data);
  const { type, detail } = ev;
  const evSet = this._get(type, false);

  if (!evSet) {
    return;
  }

  evSet.forEach((listener) => {
    listener(detail);

    // 一次性事件清理
    if (this._once_.has(listener)) {
      evSet.delete(listener);
      this._once_.delete(listener);
    }
  });
};

/**
 * 添加事件监听
 * @param {string} type 事件类型
 * @param {function} listener 监听器
 */
Events.prototype.add = function add(type, listener) {
  const evSet = this._get(type);

  // 达到最大数量
  if (evSet.size >= this._maxListeners) {
    return;
  }
  evSet.add(listener);
};

/**
 * 删除事件监听
 * @param {string} type 事件类型
 * @param {function} listener 监听器
 */
Events.prototype.remove = function remove(type, listener) {
  const evSet = this._get(type, false);

  if (!evSet) {
    return;
  }

  evSet.delete(listener);
};

/**
 * 添加一次性事件监听
 * @param {string} type 事件类型
 * @param {function} listener 监听器
 */
Events.prototype.once = function once(type, listener) {
  this.add(type, listener);
  this._once_.set(listener, type);
};

/**
 * @param {string} type 事件类型
 * @return {Set}
 */
Events.prototype._get = function _get(type, createIfEpmty = true) {
  let evSet = this._listeners.get(type);

  if (!evSet && createIfEpmty) {
    evSet = new Set();
    this._listeners.set(type, evSet);
  }

  return evSet;
};


// W3C 标准事件名
Events.prototype.dispatchEvent = Events.prototype.dispatch;
Events.prototype.addEventListener = Events.prototype.add;
Events.prototype.removeEventListener = Events.prototype.remove;

/**
 * 事件单元（可用于发布）
 * @param {string} type 类型
 * @param {any} data 传递的数据
 */
export function EventsUnit(type, data) {
  this.type = type;
  this.detail = data;
}
