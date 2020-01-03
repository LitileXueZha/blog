const request = require('request');

// 机器人 robot 令牌
const token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.MTU3ODI4MDk1NDpyb2JvdA==.enCpi8Loy+gA/hobLeWp56UfO7aQS/otOXvBm4wRbs0=';

(async function init() {
    const atk = await getToken();

    console.log(atk);
}());

function getToken() {
    return new Promise((resolve) => {
        request.get('https://api.ningtaostudy.cn/v1/oauth', {
            headers: {
                Authorization: token,
            },
        }, (err, resp, body) => {
            const { data } = JSON.parse(body);
            
            resolve(data);
        });
    });
}

function getIndexData() {
    return new Promise((resolve) => {

    });
}
