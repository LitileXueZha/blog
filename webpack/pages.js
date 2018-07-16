const HtmlWebpackPlugin = require('html-webpack-plugin');

const pages = ['index'];

/**
 * 生成插件（用来生成.html文件 ）
 * @param {string} 模板名
 * @returns {object} 一个插件对象
 */
function generatePlugin(chunkName) {
  return new HtmlWebpackPlugin({
    filename: `${chunkName}.html`,
    template: `./pages/page.${chunkName}/index.pug`,
    chunks: ['common', chunkName],
    minify: {
      collapseWhitespace: true,
      removeComments: true,
    },
  });
}
/**
 * 根据页面数组导出到webpack的入口与插件配置
 * @param {array} 页面名字的数据
 * @returns {object} 包含entry与plugins的对象
 */
function generateExports(pagesArr) {
  const entry = { common: './pages/common/common.js' };
  const plugins = [];

  pagesArr.forEach((val) => {
    entry[val] = `./pages/page.${val}/index.js`;
    plugins.push(generatePlugin(val));
  });

  return { entry, plugins };
}

module.exports = generateExports(pages);
