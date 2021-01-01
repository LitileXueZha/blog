/* eslint-disable no-underscore-dangle */

const DEFAULT_PAGE = 1;
const DEFAULT_SIZE = 10;

/**
 * 基础分页控制器 PaginationBase
 */
export default function PaginationBase(opts = {}) {
  /** 加载状态 */
  this.loading = false;
  /** 页数变化时，被执行的加载函数 */
  this._onChange = opts.onChange;
  /** 页码 */
  this._page = opts.page || DEFAULT_PAGE;
  /** 单页数量 */
  this._size = opts.size || DEFAULT_SIZE;
}

/** 下一页 */
PaginationBase.prototype.next = async function next() {
  if (this.loading) {
    return;
  }

  this._page += 1;
  await this.load();
};

/** 上一页 */
PaginationBase.prototype.previous = async function previous() {
  if (this.loading) {
    return;
  }
  // 已是第一页，没有前一页了
  if (this._page <= 1) {
    return;
  }

  this._page -= 1;
  await this.load();
};

/**
 * 转到指定页
 * @param {number} pageNum 页码
 */
PaginationBase.prototype.goto = async function goto(pageNum) {
  if (this.loading) {
    return;
  }
  // 不合法页
  if (pageNum < 1) {
    return;
  }

  this._page = pageNum;
  await this.load();
};

/** 加载数据 */
PaginationBase.prototype.load = async function load() {
  if (!this._onChange || this.loading) {
    return;
  }

  this.loading = true;
  // 执行分页函数
  await this._onChange({
    page: this._page,
    size: this._size,
  });
  this.loading = false;
};

/**
 * 检查是否加载完成
 * @param {number} total 列表总数量
 * @return {boolean|undefined} 传入的值非数字将返回 undefined
 */
PaginationBase.prototype.isComplete = function isComplete(total) {
  if (Number.isNaN(total)) {
    return;
  }

  // eslint-disable-next-line
  return total <= this._page * this._size;
};
