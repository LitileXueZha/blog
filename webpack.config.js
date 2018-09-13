const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// 路径常量
const PATH_DIST = path.join(__dirname, 'dist');

// loaders与各页面相关配置
const rules = require('./webpack/loaders');
const { entry, plugins } = require('./webpack/pages');

// 生产环境判断
const IS_PROD = process.env.NODE_ENV === 'production';

// 导出的配置
const config = {
  context: __dirname,
  entry,
  output: {
    path: PATH_DIST,
    filename: IS_PROD ? 'js/[name]-[hash].js' : 'js/[name].js',
  },
  module: { rules },
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
  ],
};

// 生产环境下的优化
if (IS_PROD) {
  config.mode = 'production';
  config.stats = {
    children: false,
    modules: false,
    builtAt: false,
    colors: true,
    entrypoints: false,
    chunkOrigins: false,
  };
  config.optimization = {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
      }),
      new OptimizeCssPlugin({}),
    ],
  };
} else {
  // 开发环境添加devServer等。
  config.mode = 'development';
  config.devtool = 'eval-source-map';
  config.devServer = {
    stats: 'minimal',
    contentBase: PATH_DIST,
    port: 8001,
    disableHostCheck: true,
    hot: true,
    compress: true,
    // 代理到本地的md文件
    proxy: {
      '/Markdown': 'http://localhost',
    },
  };
  config.plugins = [
    ...config.plugins,
    new CleanWebpackPlugin(['dist']),
    new webpack.HotModuleReplacementPlugin(),
  ];
}

module.exports = config;
