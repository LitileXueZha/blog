import QueryString from 'query-string';

import { API, API_OMIT_AUTH } from './constants';

const defaultOpts = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * 通用请求函数封装
 * 
 * @param {string} url 接口地址
 * @param {Object} opts 同原生 `fetch` 配置对象
 */
export default async function request(url, opts = {}) {
  const fetch = await fetchPolyfill();
  let apiUrl = API + url;
  let token = localStorage.getItem('token');

  if (!token) {
    // 不存在 token，未认证
    token = await auth();
  }

  if (opts.params) {
    // GET 请求的查询参数，不能放到 body
    apiUrl += '?';
    // php 获取 GET 请求的数组形式只支持 `xxx[]=&xxx[]=` 形式
    apiUrl += QueryString.stringify(opts.params, {
      arrayFormat: 'bracket',
    });
  }

  if (typeof opts.body === 'object') {
    // 发送数据必须手动转成 json 字符串
    opts.body = JSON.stringify(opts.body);
  }

  const options = {
    ...defaultOpts,
    ...opts,
    headers: {
      ...defaultOpts.headers,
      Authorization: token,
      ...opts.headers,
    },
  };
  const res = await fetch(apiUrl, options);
  const response = await res.json();
  const { code, data, error } = response;

  // token 令牌过期，认证失效
  if (code === 9001) {
    // 更新 localStorage 中的 token
    await auth();
    // 重新发起请求
    return request(url, opts);
  }

  if (code !== 1) {
    // 暂只抛出一个错误
    // throw String(`RequestError: ${error}`);
    throw new Error(error);
  }

  return data;
}

/** 接口鉴权 */
async function auth() {
  const fetch = await fetchPolyfill();
  const res = await fetch(`${API}/oauth`, {
    headers: {
      Authorization: localStorage.getItem('token'),
    },
  });
  const { data, code, error } = await res.json();

  // 只在认证成功后，返回 token
  if (code === 1) {
    localStorage.setItem('token', data);
    return data;
  }

  // 认证失败。暂时抛出异常
  // throw String(`AuthError: ${error}`);
  throw new Error(error);
}

/**
 * 简单的 fetch 兼容
 * 
 * @returns {Promise<fetch>} 可使用的 `fetch` 方法
 */
async function fetchPolyfill() {
  if (window.fetch) {
    return window.fetch;
  }

  const res = await import(/* webpackChunkName: "whatwg-fetch" */ 'whatwg-fetch');

  window.fetch = res.fetch;
  return window.fetch;
}
