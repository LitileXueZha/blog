const path = require('path');
const webpack = require('webpack');
const fs = require('fs');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// 路径常量
const PATH_DIST = path.join(__dirname, 'dist');

// loaders与各页面相关配置
const rules = require('./webpack/loaders');
const { entry, plugins } = require('./webpack/pages');

// 抽离css
const extractLess = new ExtractTextPlugin({ filename: 'css/[name].css' });
rules.push({
  test: /\.less$/,
  use: extractLess.extract({
    use: [
      { loader: 'css-loader' },
      { loader: 'less-loader' },
    ],
    fallback: 'style-loader',
  }),
});

module.exports = {
  context: __dirname,
  mode: 'production',
  // stats: 'minimal',
  devtool: 'eval',

  entry,
  output: {
    path: PATH_DIST,
    filename: 'js/[name].js',
  },
  module: { rules },
  plugins: [
    extractLess,
    ...plugins,
  ],
};
