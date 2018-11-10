const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');

const config = require('./webpack');

module.exports = {
  ...config,
  mode: 'production',
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
