const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
const { HashedModuleIdsPlugin } = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { merge } = require('webpack-merge');

const config = require('./webpack');
const polyfill = require('./webpack/polyfill');

/**
 * 生产环境增加了 polyfill 打包任务
 */
module.exports = [merge(config, {
  mode: 'production',
  output: {
    // conenthash 可在英文最新版看到，移除了 manifest.json
    filename: 'js/[name]-[contenthash].js',
    hashDigestLength: 16,
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
      filename: 'css/[name]-[contenthash].css',
      chunkFilename: 'css/[name]-[contenthash].css',
    }),
    // 打包分析，文件：zzz-analyzer.html
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: '../zzz-analyzer.html',
      openAnalyzer: false,
      logLevel: 'error',
    }),
  ],
  optimization: {
    minimizer: [
      new TerserWebpackPlugin({}),
      new OptimizeCssPlugin({}),
    ],
    // 整合 runtime 到公共模块，可以不用单独打个 runtime.js 增加请求
    runtimeChunk: { name: 'common' },
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
        common: {
          name: 'common',
          chunks: 'initial',
          minChunks: 2,
        },
      },
    },
  },
}), polyfill];
