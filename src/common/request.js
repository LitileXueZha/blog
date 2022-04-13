import QueryString from 'query-string';

import { API, FETCH_DEFAULT_OPTS, TOKEN_NAME } from './constants';

/**
 * 通用请求函数封装
 * 
 * @param {string} url 接口地址
 * @param {Object} opts 同原生 `fetch` 配置对象
 */
export default async function request(url, opts = {}) {
  const reqInstance = new Request(url, opts);
  const result = await reqInstance.fetchStart();

  if (result) {
    return result.data;
  }

  return undefined;
}

/**
 * 请求构造函数
 * 
 * @param {string} url 接口地址
 * @param {object} opts 同原生 `fetch` 配置对象
 */
function Request(url, opts = {}) {
  /** 原请求配置 */
  this.request = { url, opts };
  /** 返回处理器 */
  this.handler = responseHandler;

  this.token = localStorage.getItem(TOKEN_NAME);

  this.url = API + url;
  // 合并默认配置
  this.opts = {
    ...FETCH_DEFAULT_OPTS,
    ...opts,
    headers: {
      ...FETCH_DEFAULT_OPTS.headers,
      Authorization: this.token,
      ...opts.headers,
    },
  };

  if (opts.params) {
    // GET 请求的查询参数，不能放到 body
    this.url += '?';
    // php 获取 GET 请求的数组形式只支持 `xxx[]=&xxx[]=` 形式
    this.url += QueryString.stringify(opts.params, {
      arrayFormat: 'bracket',
    });
  }

  if (typeof opts.body === 'object') {
    // 发送数据必须手动转成 json 字符串
    this.opts.body = JSON.stringify(opts.body);
  }
}

/**
 * 支持 Fetch API 超时
 * 
 * @param {RequestInfo} input
 * @param {RequestInit} [init]
 */
Request.prototype._fetch = async function _fetch(input, init) {
  const { timeout } = this.opts;
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), timeout * 1000);
  const response = await window.fetch(input, {
    ...init,
    signal: ac.signal,
  });
  clearTimeout(timer);
  return response;
};

/** 请求 */
Request.prototype.fetchStart = async function fetchStart() {
  await this.auth();

  /** `fetch` 返回对象 */
  this.response = await this._fetch(this.url, this.opts);
  /** 请求成功数据 */
  this.result = await this.handler(this.response);

  return this.result;
};

/** 鉴权 */
Request.prototype.auth = async function auth(refresh = false) {
  // 可以指明需要重新鉴权
  if (!refresh && this.token) {
    return;
  }

  const res = await this._fetch(`${API}/oauth`, {
    headers: {
      Authorization: this.token,
    },
  });
  const { data, code, error } = await res.json();

  // 只在认证成功后，设置 token
  if (code === 1) {
    localStorage.setItem(TOKEN_NAME, data);
    this.token = data;
    this.opts.headers.Authorization = data;
    return;
  }

  // 认证失败。暂时抛出异常
  // throw String(`AuthError: ${error}`);
  throw new Error(error);
};

/**
 * `response` 处理函数
 * 
 * 可以直接用 `this` 访问请求实例，
 * 请求成功时必须返回全部数据
 * 
 * @param {Response} fetchResponse `fetch` 返回对象
 * @return {object} 请求成功返回数据
 */
async function responseHandler(fetchResponse) {
  const response = await fetchResponse.json().catch((e) => {
    // JSON 化失败，返回的数据有问题
    // 如果 HTTP 码不是 204 No Content 的化，抛错
    if (fetchResponse.status !== 204) {
      throw e;
    }
  });

  // JSON 化失败
  if (!response) {
    return undefined;
  }

  const { code, error } = response;

  // token 令牌过期，认证失效
  if (code === 9001) {
    // 更新 localStorage 中的 token
    await this.auth(true);
    // 重新发起请求
    return this.fetchStart();
  }

  if (code !== 1) {
    // 暂只抛出一个错误
    // throw String(`RequestError: ${error}`);
    throw new Error(error);
  }

  return response;
}
