const autoprefixer = require('autoprefixer');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


// 定义了一些可复用的东西
const pages = [
  'resume',
  '404',
];
const entry = {};
const plugins = [];

pages.forEach((val) => {
  entry[val] = `./${val}/index.js`;
  plugins.push(new HtmlWebpackPlugin({
    filename: `${val}.html`,
    template: `./${val}/index.pug`,
    chunks: [val],
    inject: 'body',
  }));
});

const output = {
  path: __dirname,
  filename: '.trash/[name].js',
};

const loaders = firstCssLoader => [
  {
    test: /\.pug$/,
    use: 'pug-loader',
  }, {
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env', '@babel/preset-react'],
      },
    },
  }, {
    test: /\.(le|c)ss$/,
    use: [
      firstCssLoader,
      'css-loader',
      {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            plugins: [
              [autoprefixer()],
            ],
          },
        },
      },
      'less-loader',
    ],
  },
];

module.exports = {
  context: __dirname,
  entry,
  plugins,
  output,
  loaders,
};
