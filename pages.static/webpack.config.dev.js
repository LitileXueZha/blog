const {
  entry, output, loaders, plugins,
} = require('./webpack.base.js');

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
    devMiddleware: {
      stats: 'minimal',
    },
    port: 8002,
    host: '0.0.0.0',
    hot: true,
  },
};
