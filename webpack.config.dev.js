const path = require('path');

const config = require('./webpack');

module.exports = {
  ...config,
  devtool: 'eval-source-map',
  devServer: {
    stats: 'minimal',
    port: 8001,
    contentBase: path.join(__dirname, 'dist'),
    disableHostCheck: true,
    hot: true,
    compress: true,
    // 代理到本地的md文件
    proxy: {
      '/Markdown': 'http://localhost',
    },
  },
};
