const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer')({ browsers: ['last 15 versions'] });

const IS_PROD = process.env.NODE_ENV === 'production';

module.exports = [
  {
    test: /\.pug$/,
    use: 'pug-loader',
  }, {
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
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
