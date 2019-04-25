const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// 路径常量
const PATH_DIST = path.join(__dirname, '../dist');

// loaders与各页面相关配置
const loaders = require('./loaders');
const { entry, plugins } = require('./pages');

// 生产环境判断
const IS_PROD = process.env.NODE_ENV === 'production';

// 导出的配置
module.exports = {
  mode: 'development',
  context: path.resolve(__dirname, '..'),
  entry,
  output: {
    path: PATH_DIST,
    filename: IS_PROD ? 'js/[name]-[hash].js' : 'js/[name].js',
  },
  module: { rules: loaders },
  plugins: [
    ...plugins,
    new MiniCssExtractPlugin({
      filename: IS_PROD ? 'css/[name]-[hash].css' : 'css/[name].css',
      chunkFilename: IS_PROD ? 'css/[id]-[hash].css' : 'css/[id].css',
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
    new BundleAnalyzerPlugin({
      analyzerMode: IS_PROD ? 'static' : 'disabled',
      reportFilename: '../zzz-analyzer.html',
    }),
  ],
};
