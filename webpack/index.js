const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// loaders与各页面相关配置
const loaders = require('./loaders');
const { entry, plugins } = require('./pages');

// 生产环境判断
const IS_PROD = process.env.NODE_ENV === 'production';
// 路径常量
const PATH_DIST = path.join(__dirname, '../dist');

// 导出的配置
module.exports = {
  context: path.resolve(__dirname, '..'),
  entry,
  output: {
    path: PATH_DIST,
    // conenthash 可在英文最新版看到，移除了 manifest.json
    filename: IS_PROD ? 'js/[name]-[contenthash].js' : 'js/[name].js',
  },
  module: { rules: loaders },
  plugins: [
    ...plugins,
    new MiniCssExtractPlugin({
      filename: IS_PROD ? 'css/[name]-[contenthash].css' : 'css/[name].css',
      chunkFilename: IS_PROD ? 'css/[name]-[contenthash].css' : 'css/[name].css',
    }),
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
