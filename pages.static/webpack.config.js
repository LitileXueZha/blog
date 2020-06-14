const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { pages, output, loaders } = require('./webpack.base');

const PATH_DIST = path.join(__dirname, '../dist');
const entry = {};
const plugins = [];

pages.forEach((val) => {
  entry[val] = `./${val}/index.js`;
  plugins.push(new HtmlWebpackPlugin({
    filename: `${val}.html`,
    template: `./${val}/index.pug`,
    chunks: [val],
    minify: {
      collapseWhitespace: true,
      removeComments: true,
    },
    inlineSource: '.(js|css)$',
  }));
});

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
    new HtmlWebpackInlineSourcePlugin(),
    new CopyWebpackPlugin([
      {
        from: './pages.static/*.html',
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
