const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const { entry, plugins, output, loaders } = require('./webpack.base.js');
const InlineHtmlWebpackPlugin = require('../webpack/InlineHtmlWebpackPlugin.js');

const PATH_DIST = path.join(__dirname, '../dist');

module.exports = {
  context: __dirname,
  mode: 'production',
  entry,
  output,
  module: {
    rules: loaders(MiniCssExtractPlugin.loader),
  },
  plugins: [
    ...plugins,
    new MiniCssExtractPlugin({
      filename: '.trash/[name].css',
    }),
    new InlineHtmlWebpackPlugin(false, { all: true, cleanup: true }),
    // FIXME: copy-webpack-plugin 无法复制构建时生成的文件
    // TODO: 换个插件。比如 https://github.com/gregnb/filemanager-webpack-plugin
    new CopyWebpackPlugin([
      {
        from: './*.html',
        to: path.join(PATH_DIST, '[name].html'),
      },
    ]),
  ],
  stats: {
    children: false,
    modules: false,
    builtAt: false,
    colors: true,
    entrypoints: false,
    chunkOrigins: false,
  },
  optimization: {
    minimizer: [
      new TerserWebpackPlugin({}),
      new OptimizeCssPlugin({}),
    ],
  },
};
