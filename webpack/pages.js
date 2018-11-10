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
const entry = { common: './pages/common/common.js' };
const plugins = [];

for (let i = 0; i < pages.length; i++) {
  const page = pages[i];
  // 是否为二级页面
  const hasChild = page.indexOf('/') > 0;
  const plugin = new HtmlWebpackPlugin({
    filename: `${page}.html`,
    template: `./pages/page${hasChild ? 's' : ''}.${page}/index.pug`,
    templateParameters: { pathname: page },
    chunks: ['common', page],
    minify: {
      collapseWhitespace: true,
      removeComments: true,
    },
  });

  entry[page] = `./pages/page${hasChild ? 's' : ''}.${page}/index.js`;
  plugins.push(plugin);
}

module.exports = {
  entry,
  plugins,
};
