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
  // js-base64 v3 开始使用 es6 语法
  'js-base64',
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
    test: /\.m?js$/, // 有的库 es6 module 文件后缀名为 .mjs，醉了
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
    test: /\.css$/,
    use: [
      IS_PROD ? MiniCssExtractPlugin.loader : 'style-loader',
      'css-loader',
    ],
  }, {
    test: /\.less$/,
    use: [
      IS_PROD ? MiniCssExtractPlugin.loader : 'style-loader',
      {
        loader: 'css-loader',
        options: { importLoaders: 2 },
      }, {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            plugins: [autoprefixer],
          },
        },
      }, {
        loader: 'less-loader',
        options: {
          // Less v4 数学运算需要加括号，修改为旧版
          lessOptions: { math: 'always' },
        },
      },
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
