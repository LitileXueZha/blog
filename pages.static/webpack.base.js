const autoprefixer = require('autoprefixer')({ browsers: ['last 15 versions'] });
const path = require('path');


// 定义了一些可复用的东西
const context = path.join(__dirname, 'pages.static');
const PATH_DIST = path.join(context, 'dist');
const pages = [
  'resume',
  '404',
];

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
  pages,
  output,
  loaders,
};
