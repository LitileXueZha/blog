/**
 * 只在生产环境使用
 * 
 * 额外打包出来一个 `ie11-polyfill.js`，需要在 html 模版里手动添加
 */
const path = require('path');

module.exports = {
  mode: 'production',
  context: path.resolve(__dirname, '..'),
  entry: './src/polyfill.js',
  stats: {
    all: false,
    entrypoints: true,
    errors: true,
    warnings: true,
    errorDetails: true,
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/ie11-polyfill.js',
    publicPath: '/',
  },
};
