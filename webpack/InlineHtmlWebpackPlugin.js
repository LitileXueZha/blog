/* eslint-disable no-underscore-dangle */
/**
 * 参考：https://github.com/facebook/create-react-app/blob/master/packages/react-dev-utils/InlineChunkHtmlPlugin.js
 *
 * react-dev-utils/InlineChunkHtmlPlugin 仅仅是内联 script 代码。
 * 这里直接复制过来，可以内联 css/js。稍微美化了下代码
 *
 * Create at: 2020-11-15.
 */
// eslint-disable-next-line import/no-extraneous-dependencies
const htmlWebpackPlugin = require('html-webpack-plugin');

/**
 * 第一个入参为正则数组。
 * 配置对象支持：
 * ```
 * {
 *    all: 内联全部 css/js，忽略正则匹配。默认 false
 *    cleanup: 清除已内联的 css/js。默认 false
 * }
 * ```
 */
class InlineHtmlWebpackPlugin {
  constructor(regexps, opts = {}) {
    this.regexps = regexps || [];
    this.all = opts.all;
    this.cleanup = opts.cleanup;
    this._safeCleanBucket = new Set();
  }

  setInlined(publicPath, assets, tag) {
    const {tagName, attributes} = tag;

    // add inline css
    if (tagName === 'link' && attributes && attributes.rel === 'stylesheet') {
      const name = publicPath
        ? attributes.href.replace(publicPath, '')
        : attributes.href;
      const asset = assets[name];

      if (asset && (this.all || this.regexps.some((reg) => name.match(reg)))) {
        this._safeCleanBucket.add(name);
        return {
          tagName: 'style',
          innerHTML: asset.source(),
          closeTag: true,
          // 添加的 type 可能会被 html minify
          attributes: {
            type: 'text/css',
          },
        };
      }
    }
    // add inline javascript
    if (tagName === 'script' && attributes && attributes.src) {
      const name = publicPath
        ? attributes.src.replace(publicPath, '')
        : attributes.src;
      const asset = assets[name];

      if (asset && (this.all || this.regexps.some((reg) => name.match(reg)))) {
        this._safeCleanBucket.add(name);
        return {
          tagName: 'script',
          innerHTML: asset.source(),
          closeTag: true,
          // 添加的 type 可能会被 html minify
          attributes: {
            type: 'application/javascript',
          },
        };
      }
    }

    return tag;
  }

  apply(compiler) {
    let publicPath = compiler.options.output.publicPath || '';
    if (publicPath && !publicPath.endsWith('/')) {
      publicPath += '/';
    }

    compiler.hooks.compilation.tap('InlineHtmlWebpackPlugin', (compilation) => {
      // works on html-webpack-plugin@4
      // INFO: do not work on html-webpack-plugin@<4
      const hooks = htmlWebpackPlugin.getHooks(compilation);
      const inlined = (tag) => this.setInlined(publicPath, compilation.assets, tag);

      hooks.alterAssetTagGroups.tap('InlineHtmlWebpackPlugin', (assets) => {
        assets.headTags = assets.headTags.map(inlined);
        assets.bodyTags = assets.bodyTags.map(inlined);
      });

      if (this.cleanup) {
        hooks.afterEmit.tap('InlineHtmlWebpackPlugin', () => {
          Object.keys(compilation.assets).forEach((name) => {
            if (
              (this.all || this.regexps.some((reg) => name.match(reg)))
              && this._safeCleanBucket.has(name)
            ) {
              delete compilation.assets[name];
            }
          });
        });
      }
    });
  }
}

module.exports = InlineHtmlWebpackPlugin;
