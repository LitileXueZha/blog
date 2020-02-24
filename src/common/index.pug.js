
/**
 * 通用 .pug 函数
 */

/**
 * 格式化日期
 * 
 * 分为几个级别：
 * + `刚刚`
 * + 时，例如：`2小时`
 * + 天，例如：`3天`
 * + 月，例如：`4个月`
 * + 日期，例如：`2019.12.31`
 * 
 * @param {String} dateStr 日期字符串
 * @returns {String} 可读性字符串
 */
export function humanDate(dateStr) {
  const date = new Date(dateStr);
  const diffTs = Date.now() - date.getTime();

  if (diffTs > 365 * 24 * 60 * 60 * 1000) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}.${month < 10 ? '0' : ''}${month}.${day < 10 ? '0' : ''}${day}`;
  }
  if (diffTs > 30 * 24 * 60 * 60 * 1000) {
    return `${Math.floor(diffTs / (30 * 24 * 60 * 60 * 1000))}个月`;
  }
  if (diffTs > 24 * 60 * 60 * 1000) {
    return `${Math.floor(diffTs / (24 * 60 * 60 * 1000))}天`;
  }
  if (diffTs > 60 * 60 * 1000) {
    return `${Math.floor(diffTs / (60 * 60 * 1000))}小时`;
  }

  return '刚刚';
}

/**
 * 随机色
 * 
 * 取色地址：http://encycolorpedia.cn/009688
 * 
 * @return {string} 随机色值，例如 `#ff6977`
 */
export function randomColor() {
  const colors = ['#ff6977', '#00bbaa', '#008b8b', '#009688', '#128378', '#4b4b4b', '#007066', '#008080'];
  const max = 7; // colors.length - 1
  const index = Math.round(Math.random() * max);

  return colors[index];
}
