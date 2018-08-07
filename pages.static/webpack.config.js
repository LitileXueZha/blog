// const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer')({ browsers: ['last 15 versions'] });

const staticPages = ['resume'];
const entry = {};
const plugins = [];

staticPages.forEach((val) => {
  entry[val] = `./${val}/index.js`;
  plugins.push(new HtmlWebpackPlugin({
    filename: `${val}.html`,
    template: `./${val}/index.html`,
    minify: {
      collapseWhitespace: true,
      removeComments: true,
    },
    inlineSource: '.(js|css)$',
  }));
});

module.exports = {
  context: __dirname,
  mode: 'production',
  entry,
  output: {
    path: __dirname,
    filename: '.trash/_.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: __dirname,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react'],
          },
        },
      }, {
        test: /\.(le|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
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
      },
    ],
  },
  plugins: [
    ...plugins,
    new MiniCssExtractPlugin({
      filename: '.trash/_.css',
    }),
    new HtmlWebpackInlineSourcePlugin(),
  ],
  stats: {
    children: false,
    modules: false,
    builtAt: false,
    colors: true,
    entrypoints: false,
    chunkOrigins: false,
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
      }),
      new OptimizeCssPlugin({}),
    ],
  },
};
