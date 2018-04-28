const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'none',
    stats: 'minimal',
    entry: {
        index: './js/index.js',
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'js/[name]-[hash].js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/pages/index.html',
            filename: 'index.html',
            header: fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'header.html')),
        }),
    ],
};
