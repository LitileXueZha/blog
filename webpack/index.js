const path = require('path');
const { DefinePlugin } = require('webpack');
const { merge } = require('webpack-merge');

// loaders与各页面相关配置
const rules = require('./loaders');
const pages = require('./pages');
// CDN 库链接
const MERMAID = 'https://unpkg.com/mermaid@8.3.1/dist/mermaid.min.js';
const MATHJAX = 'https://unpkg.com/mathjax@3.2.2/es5/tex-chtml.js';
const SOURCEMAP_MAPPINGS = 'https://unpkg.com/source-map@0.7.4/lib/mappings.wasm';

// 导出的配置
module.exports = merge(pages, {
  context: path.resolve(__dirname, '..'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name].js',
    publicPath: '/',
  },
  module: { rules },
  plugins: [
    new DefinePlugin({
      __CDN_LINK_MERMAID__: JSON.stringify(MERMAID),
      __CDN_LINK_MATHJAX__: JSON.stringify(MATHJAX),
      __CDN_LINK_SOURCEMAP_MAPPINGS__: JSON.stringify(SOURCEMAP_MAPPINGS),
      __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
    }),
  ],
  resolve: {
    alias: {
      src: path.resolve(__dirname, '../src'),
    },
    // 本地 npm link 的包查找依赖时，提高当前项目的优先级
    // modules: [path.resolve(__dirname, '../node_modules'), 'node_modules'],
  },
  externals: {
    fs: '__FIX_SOURCE_MAP_NODE_PROBLEM__',
    path: '__FIX_SOURCE_MAP_NODE_PROBLEM__',
  },
});
