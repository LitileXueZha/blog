const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer')({ browsers: ['last 15 versions'] });

const IS_PROD = process.env.NODE_ENV === 'production';
// 需要被 babel 编译的包。这些包只有 es6+ 的代码，而 loader 里又忽略了
const MODULE_NEED_BABEL = [
  'query-string',
  'strict-uri-encode',
  'split-on-first',
  // highlight.js 升级后，发布的包文件面向 es6，不支持 IE11
  'highlight.js',
];
// 生产环境下编译
// 注意不同系统上的路径分隔符
const EXCLUDE_BABEL = IS_PROD
  ? new RegExp(`node_modules[\\\\/](?!(${MODULE_NEED_BABEL.join('|')}))`)
  : /node_modules/;

module.exports = [
  {
    test: /\.pug$/,
    use: 'pug-loader',
  }, {
    test: /\.js$/,
    // exclude: /node_modules/,
    exclude: EXCLUDE_BABEL,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
        sourceType: 'unambiguous',
        plugins: [
          '@babel/plugin-transform-runtime',
          '@babel/plugin-syntax-dynamic-import',
        ],
      },
    },
  }, {
    test: /\.(le|c)ss$/,
    use: [
      IS_PROD ? MiniCssExtractPlugin.loader : 'style-loader',
      {
        loader: 'css-loader',
        options: { importLoaders: 1 },
      }, {
        loader: 'postcss-loader',
        options: {
          ident: 'postcss',
          plugins: [autoprefixer],
        },
      },
      'less-loader',
    ],
  }, {
    test: /\.(png|jpg|gif)$/,
    use: {
      loader: 'file-loader',
      options: {
        outputPath: 'images/',
        publicPath: '/images/',
        name: '[name].[ext]',
      },
    },
  },
];
