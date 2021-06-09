const HtmlWebpackPlugin = require('html-webpack-plugin');

const IS_PROD = process.env.NODE_ENV === 'production';
let _cache;

// SEO 数据
if (IS_PROD) {
  _cache = require('../public/_cache.dist.json');
} else {
  _cache = require('../public/_cache.dev.json');
}

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
const entry = { main: './src/index.js' };
const plugins = [];

for (let i = 0; i < pages.length; i++) {
  const page = pages[i];
  // 删除末尾 /index 免重
  const pageResolved = `pages/${page.replace(/\/index$/, '')}`;
  const plugin = new HtmlWebpackPlugin({
    filename: `${page}.html`,
    template: `./src/${pageResolved}/index.pug`,
    templateParameters: { pathname: page, _cache },
    // NOTE: 必须要手动加上 vendor
    chunks: ['main', `vendors~${page}`, page],
    minify: { removeComments: false },
  });

  entry[page] = `./src/${pageResolved}/index.js`;
  plugins.push(plugin);
}

if (!IS_PROD) {
  // 排版页
  plugins.push(new HtmlWebpackPlugin({
    filename: 'typography.html',
    template: './src/pages/_demos_dev_/typography.html',
    chunks: ['main'],
  }));
  // 图标页
  plugins.push(new HtmlWebpackPlugin({
    filename: 'icon.html',
    template: './src/pages/_demos_dev_/icon.pug',
    chunks: [],
  }));
}

module.exports = {
  entry,
  plugins,
};
