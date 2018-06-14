module.exports = [
  {
    test: /\.pug$/,
    use: 'pug-loader',
  },
  {
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['env'],
      },
    },
  },
];