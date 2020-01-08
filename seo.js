const fs = require('fs');
const request = require('request');

const API = {
    // 机器人 robot 令牌
    token: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.MTU3ODI4MDk1NDpyb2JvdA==.enCpi8Loy+gA/hobLeWp56UfO7aQS/otOXvBm4wRbs0=',
    prefix: 'https://api.ningtaostudy.cn/v1',
    getToken() {
        return this.token;
    },
};
const _cache = {
    env: 'production',
};

(async function init() {
    // 设置 token
    API.token= await get('/oauth');

    // 设置首页数据
    _cache['index'] = await get('/seo/index');

    // 写入本地文件
    fs.writeFileSync('./_cache.dist.json', JSON.stringify(_cache));
}());

/**
 * 通用 get 请求封装
 *
 * @param {String} url 请求路径
 */
function get(url) {
    return new Promise((resolve) => {
        request.get(API.prefix + url, {
            headers: {
                Authorization: API.getToken(),
            },
            strictSSL: false,
        }, (err, resp, body) => {
            if (err) {
                console.error(err);
                return;
            }
            const { data } = JSON.parse(body);

            resolve(data);
        });
    });
}
