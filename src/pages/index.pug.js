export const pathname = 'index';

// 取色地址：https://primer.style/primitives/colors
const colors = ['#24292f', '#0969da', '#1a7f37', '#9a6700', '#bc4c00', '#cf222e', '#8250df', '#C4432B'];

/**
 * 格式化标签
 *
 * 把标签分成了四个级别：
 * + `xl` 加大，数量为 1
 * + `l` 大，数量为 10%
 * + `m` 中，数量为 40%
 * + 默认，数量为 50%
 *
 * @param {Array} tags 标签数组
 * @returns {Array} 格式化好的数组。带有颜色和大小
 */
export function resolveTags(tags) {
  const l = 0 + Math.round(tags.length * 0.1);
  const m = l + Math.round(tags.length * 0.4);
  // 先排序之
  const sortTags = tags.sort((val1, val2) => val2.click - val1.click);
  const resolvedTags = [];

  sortTags.forEach((val, i) => {
    // 随机色
    const color = colors[Math.round(Math.random() * 7)];
    let className = '';

    if (i === 0) className = 'xl';
    else if (i <= l) className = 'l';
    else if (i <= m) className = 'm';

    resolvedTags[i] = {...val, color, className};
  });

  // 随机排列。更好的效果是最大居中
  return resolvedTags.sort(() => Math.random() - 0.5);
}
