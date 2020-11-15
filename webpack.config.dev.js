const path = require('path');

const config = require('./webpack');

module.exports = {
  ...config,
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    stats: 'minimal',
    port: 8001,
    // contentBase: path.join(__dirname, 'dist'),
    disableHostCheck: true,
    hot: true,
    compress: true,
    historyApiFallback: {
      rewrites: [{
        from: /^\/articles\/\w+/,
        to: '/articles/detail.html',
      }, {
        from: /.*/,
        to(ctx) {
          return `${ctx.parsedUrl.pathname}.html`;
        },
      }],
    },
    // 代理到本地的md文件
    proxy: {
      '/Markdown': 'http://localhost',
    },
  },
};
