const HtmlWebpackPlugin = require('html-webpack-plugin');

const { pages, output, loaders } = require('./webpack.base');

const entry = {};
const plugins = [];

pages.forEach((val) => {
  entry[val] = `./${val}/index.js`;
  plugins.push(new HtmlWebpackPlugin({
    filename: `${val}.html`,
    template: `./${val}/index.pug`,
    chunks: [val],
  }));
});

module.exports = {
  context: __dirname,
  mode: 'development',
  entry,
  output,
  module: {
    rules: loaders('style-loader'),
  },
  plugins,
  devtool: 'eval-source-map',
  devServer: {
    stats: 'minimal',
    port: 8002,
    host: '0.0.0.0',
    hot: true,
  },
};
