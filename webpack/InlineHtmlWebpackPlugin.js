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

class InlineHtmlWebpackPlugin {
  constructor(regexps = []) {
    this.regexps = regexps;
  }

  setInlined(publicPath, assets, tag) {
    const { tagName, attributes } = tag;

    // add inline css
    if (tagName === 'link' && attributes && attributes.rel === 'stylesheet') {
      const name = publicPath
        ? attributes.href.replace(publicPath, '')
        : attributes.href;
      const asset = assets[name];

      if (asset && this.regexps.some(reg => name.match(reg))) {
        return {
          tagName: 'style',
          innerHTML: asset.source(),
          closeTag: true,
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

      if (asset && this.regexps.some(reg => name.match(reg))) {
        return {
          tagName: 'script',
          innerHTML: asset.source(),
          closeTag: true,
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
      const inlined = tag => this.setInlined(publicPath, compilation.assets, tag);

      hooks.alterAssetTagGroups.tap('InlineHtmlWebpackPlugin', (assets) => {
        assets.headTags = assets.headTags.map(inlined);
        assets.bodyTags = assets.bodyTags.map(inlined);
      });

      // Still emit the runtime chunk for users who do not use our generated
      // index.html file.
      // hooks.afterEmit.tap('InlineHtmlWebpackPlugin', () => {
      //   Object.keys(compilation.assets).forEach(name => {
      //     if (this.regexps.some(reg => name.match(reg))) {
      //       delete compilation.assets[name];
      //     }
      //   });
      // });
    });
  }
}

module.exports = InlineHtmlWebpackPlugin;
