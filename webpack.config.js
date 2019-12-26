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
};
