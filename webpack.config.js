const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
const { HashedModuleIdsPlugin } = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const config = require('./webpack');

// 修复 vendor、runtime 打包后 contenthash 变化。
// 文档：https://webpack.js.org/guides/caching/
config.plugins.push(new HashedModuleIdsPlugin());

// 打包分析，文件：zzz-analyzer.html
config.plugins.push(new BundleAnalyzerPlugin({
  analyzerMode: 'static',
  reportFilename: '../zzz-analyzer.html',
  openAnalyzer: false,
  logLevel: 'error',
}));

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
      new TerserWebpackPlugin({}),
      new OptimizeCssPlugin({}),
    ],
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
    },
  },
};
