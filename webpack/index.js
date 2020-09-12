const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// loaders与各页面相关配置
const loaders = require('./loaders');
const { entry, plugins } = require('./pages');

// 路径常量
const PATH_DIST = path.join(__dirname, '../dist');

// 导出的配置
module.exports = {
  context: path.resolve(__dirname, '..'),
  entry,
  output: {
    path: PATH_DIST,
    filename: 'js/[name].js',
    publicPath: '/',
  },
  module: { rules: loaders },
  plugins: [
    ...plugins,
    new CopyWebpackPlugin([
      {
        from: './favicon.ico',
        to: path.join(PATH_DIST, '[name].[ext]'),
      }, {
        from: './pages.static/*.html',
        to: path.join(PATH_DIST, '[name].html'),
      },
    ]),
  ],
};
