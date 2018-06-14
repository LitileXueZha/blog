const path = require('path');
const webpack = require('webpack');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

// 路径常量
const PATH_DIST = path.join(__dirname, 'dist');

// loaders与各页面相关配置
const rules = require('./webpack/loaders');
const { entry, plugins } = require('./webpack/pages');

module.exports = {
  context: __dirname,
  mode: 'none',
  stats: {
    assets: true
  },
  devtool: 'source-map',
  devServer: {
    stats: 'minimal',
    contentBase: PATH_DIST,
    port: 8001,
    disableHostCheck: true,
    hot: true,
    compress: true,
  },

  entry,
  output: {
    path: PATH_DIST,
    filename: 'js/[name].js',
  },
  module: { rules },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new webpack.HotModuleReplacementPlugin(),
    ...plugins,
  ],
};
