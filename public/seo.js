/* eslint-disable */
const fs = require('fs').promises;
const path = require('path');
// const request = require('request');
const https = require('https');

const API = {
    // 机器人 robot 令牌
    token: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.MTU3ODI4MDk1NDpyb2JvdA==.zzs8nnFLyNb9ft6U2q8N3F13c/v+LzaZkpLtPH/BBaw=',
    prefix: 'https://api.ningtaostudy.cn/v1',
    getToken() {
        return this.token;
    },
};
const _cache = {
    env: 'production',
};

(async function init() {
    try {
        const ts = Date.now();
        // 设置 token
        API.token = await get('/oauth');
    
        // 设置首页数据
        _cache['index'] = await get('/seo/index');
    
        const filePath = path.join(__dirname, '_cache.dist.json');
        const fileData = JSON.stringify(_cache);
        // 写入本地文件
        await fs.writeFile(filePath, fileData);
        console.log('写入成功！共耗时 %dms', Date.now() - ts);    
    } catch (e) {
        console.error(e);
    }
}());

/**
 * 通用 get 请求封装
 *
 * @param {String} url 请求路径
 */
// function get(url) {
//     return new Promise((resolve) => {
//         request.get(API.prefix + url, {
//             headers: {
//                 Authorization: API.getToken(),
//                 'User-Agent': 'Robot by seo.js',
//             },
//             strictSSL: false,
//         }, (err, resp, body) => {
//             if (err) {
//                 console.error(err);
//                 return;
//             }
//             const { data } = JSON.parse(body);

//             resolve(data);
//         });
//     });
// }
function get(url) {
    return new Promise((resolve, reject) => {
        ts = Date.now();
        https.request(API.prefix + url, {
            method: 'GET',
            headers: {
                Authorization: API.getToken(),
                'User-Agent': 'Robot by seo.js',
            },
            rejectUnauthorized: false,
        }, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error('请求失败。状态码为 '+ res.statusCode));
                res.resume();
                return;
            }

            let rawData = '';
            
            res.setEncoding('utf8');
            res.on('data', (chunk) => rawData += chunk);
            res.on('end', () => {
                try {
                    const { code, data, error } = JSON.parse(rawData);

                    if (code !== 1) {
                        reject(new Error(error));
                        return;
                    }
                    resolve(data);
                } catch (e) {
                    reject(e);
                }
            });
        })
        .on('error', reject)
        .end();
    });
}
