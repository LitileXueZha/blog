const path = require('path');

// loaders与各页面相关配置
const loaders = require('./loaders');
const { entry, plugins } = require('./pages');

// 导出的配置
module.exports = {
  context: path.resolve(__dirname, '..'),
  entry,
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name].js',
    publicPath: '/',
  },
  module: { rules: loaders },
  plugins,
  resolve: {
    alias: {
      src: path.resolve(__dirname, '../src'),
    },
  },
};
