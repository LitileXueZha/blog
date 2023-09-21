export const pathname = 'life';

/**
 * 生成四季数据
 *
 * @example
 * ```javascript
 * [
 *      { season, value, text },
 *      {
 *          season: 'spring',
 *          value: 'spring2018',
 *          text: '2018年春'
 *      }
 * ]
 * ```
 *
 * @return {array}
 */
export function genSeasons() {
  const seasonZh = {
    spring: '春', // 2-4
    summer: '夏', // 5-7
    autumn: '秋', // 8-10
    winter: '冬', // 11-1
  };
  const seasons = ['spring', 'summer', 'autumn', 'winter'];
  const d = new Date();
  let year = d.getFullYear();
  const month = d.getMonth();
  // 春季开始为 2 月，代码里实际为 1，再转化成对应 index
  const offsetMon = month - 1;
  let startIndex = parseInt(offsetMon / 3, 10);
  const displayTimes = [];

  if (offsetMon < 0) {
    year -= 1;
    startIndex = 3;
  }
  for (let i = 0; i < 4; i++) {
    const season = seasons[startIndex];

    displayTimes.push({
      season,
      value: `${season}${year}`,
      text: `${year}年${seasonZh[season]}`,
    });

    startIndex -= 1;
    // 重置季节到末尾，年份 -1
    if (startIndex < 0 && i < 3) {
      startIndex = 3;
      year -= 1;
    }
  }

  const earlyMon = (startIndex + 1) * 3 + 2;
  const zeroPrefix = earlyMon < 10 ? '0' : '';

  displayTimes.push({
    value: `earlier${year}-${zeroPrefix}${earlyMon}`, // 更早日期
    text: '更早',
  });

  return displayTimes;
}
