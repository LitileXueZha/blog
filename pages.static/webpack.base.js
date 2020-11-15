const autoprefixer = require('autoprefixer')({ browsers: ['last 15 versions'] });
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


// 定义了一些可复用的东西
const context = path.join(__dirname, 'pages.static');
const PATH_DIST = path.join(context, 'dist');
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
          ident: 'postcss',
          plugins: [autoprefixer],
        },
      },
      'less-loader',
    ],
  },
];

module.exports = {
  context,
  PATH_DIST,
  entry,
  plugins,
  output,
  loaders,
};
