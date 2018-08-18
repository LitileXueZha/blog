const HtmlWebpackPlugin = require('html-webpack-plugin');

// 需要打包的页面
const pages = [
  'index', // 首页
  'note', // 笔记
  'about', // 关于此
  'life', // 生活
  'tools', // 工具
  'msg', // 留言板
  'search', // 搜索页
  'articles/index', // 文章列表页
  'articles/detail', // 文章详情页
];

/**
 * 生成插件（用来生成.html文件 ）
 * @param {string} 模板名
 * @param {boolean} 是否为二级目录，二级在pages下而不是page
 * @returns {object} 一个插件对象
 */
function generatePlugin(chunkName, second) {
  return new HtmlWebpackPlugin({
    filename: `${chunkName}.html`,
    template: `./pages/page${second ? 's' : ''}.${chunkName}/index.pug`,
    templateParameters: { pathname: chunkName },
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
    const second = val.indexOf('/') > 0;

    entry[val] = `./pages/page${second ? 's' : ''}.${val}/index.js`;
    plugins.push(generatePlugin(val, second));
  });

  return { entry, plugins };
}

module.exports = generateExports(pages);
