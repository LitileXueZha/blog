const path = require('path');
const {merge} = require('webpack-merge');

const config = require('./webpack');

module.exports = merge(config, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    port: 8001,
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    devMiddleware: {
      stats: 'minimal',
    },
    allowedHosts: 'all',
    hot: true,
    host: '0.0.0.0',
    compress: false,
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
});
