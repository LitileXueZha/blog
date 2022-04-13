/** API 接口前缀 */
export const API = 'https://api.ningtaostudy.cn/v1';
// export const API = 'https://php/v1';

/** 忽略鉴权的 API 列表 */
export const API_OMIT_AUTH = ['/oauth'];

/** 默认 `fetch` 配置 */
export const FETCH_DEFAULT_OPTS = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30,
};

/** 项目 `token` 名称 */
export const TOKEN_NAME = 'blog_token';
