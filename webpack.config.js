const path = require('path');
const webpack = require('webpack');
const fs = require('fs');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const PagesIndex = require('./webpack/pages.index');
// 打包多个文件
const config = [PagesIndex];

// 取消mode，自己配
config.mode = 'none';
config.stats = 'minimal';

// 详细显示错误信息，设为eval可加快构建速度
config.devtool = 'source-map';

// webpack-dev-server，本地起服务器。热更新
config.devServer = {
    stats: 'minimal',
    contentBase: path.join(__dirname, 'dist'),
    port: 8001,
    disableHostCheck: true,
    hot: true,
    compress: true,
};

config.plugins = [
    new CleanWebpackPlugin(['dist']),
    new webpack.HotModuleReplacementPlugin(),
];


module.exports = config;
