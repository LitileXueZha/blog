const path = require('path');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
const { HashedModuleIdsPlugin } = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const { merge } = require('webpack-merge');

const config = require('./webpack');
const InlineHtmlWebpackPlugin = require('./webpack/InlineHtmlWebpackPlugin.js');
const polyfill = require('./webpack/polyfill');

// 路径常量
const PATH_DIST = path.join(__dirname, 'dist');

/**
 * 生产环境增加了 polyfill 打包任务
 */
module.exports = [merge(config, {
  mode: 'production',
  output: {
    // conenthash 可在英文最新版看到，移除了 manifest.json
    filename: 'js/[name].[contenthash].js',
    hashDigestLength: 8,
    // BUG: 貌似只能应用于 .js，其它类型的文件比如 .css 无效
    // devtoolModuleFilenameTemplate: 'webpack://[namespace]/[resource-path]?[loaders]',
    devtoolModuleFilenameTemplate: 'litilexuezha://[namespace]/[resource-path]?[loaders]',
  },
  stats: {
    children: false,
    modules: false,
    builtAt: false,
    colors: true,
    entrypoints: false,
    chunkOrigins: false,
  },
  plugins: [
    // 修复 vendor、runtime 打包后 contenthash 变化。
    // 文档：https://webpack.js.org/guides/caching/
    new HashedModuleIdsPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
      chunkFilename: 'css/[name].[contenthash].css',
    }),
    // 把公共样式直接内联进了 html 中
    new InlineHtmlWebpackPlugin([/main.*\.css/]),
    // 复制静态页面和 favicon
    new CopyWebpackPlugin([
      {
        from: './public/favicon.ico',
        to: path.join(PATH_DIST, '[name].[ext]'),
      }, {
        from: './public/robots.txt',
        to: path.join(PATH_DIST, '[name].[ext]'),
      }, {
        from: './pages.static/*.html',
        to: path.join(PATH_DIST, '[name].html'),
      },
    ]),
    // 打包分析，文件：zzz-analyzer.html
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'static',
    //   reportFilename: '../zzz-analyzer.html',
    //   openAnalyzer: false,
    //   logLevel: 'error',
    // }),
    // Gzip 压缩设置
    // 需对应 nginx.conf 里的配置一同设置
    new CompressionPlugin({
      test: /\.(html|js|css|jpg|jpeg|ico)$/,
      threshold: 1024,
    }),
  ],
  devtool: 'source-map',
  optimization: {
    minimizer: [
      new TerserWebpackPlugin({}),
      new OptimizeCssPlugin({
        cssProcessorOptions: {
          map: {
            annotation: (file) => `/${file}.map`,
          },
        },
      }),
    ],
    // 整合 runtime 到公共模块，可以不用单独打个 runtime.js 增加请求
    runtimeChunk: { name: 'main' },
    splitChunks: {
      cacheGroups: {
        vendors: {
          chunks: 'all',
          // 只提 js 模块到 vendor，样式可以打包到一起
          test(module) {
            return module.type === 'javascript/auto' && /[\\/]node_modules[\\/]/.test(module.resource);
          },
          priority: -10,
          enforce: true,
          reuseExistingChunk: true,
        },
        main: {
          name: 'main',
          chunks: 'initial',
          minChunks: 2,
        },
      },
    },
  },
}), polyfill];
