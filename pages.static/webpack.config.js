const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { pages, output, loaders } = require('./webpack.base');

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
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
      }),
      new OptimizeCssPlugin({}),
    ],
  },
};
