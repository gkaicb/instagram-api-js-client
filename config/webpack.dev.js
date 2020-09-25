const paths = require('./paths')
const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = merge(common, {
    entry: {
        app: [paths.app + '/app.js'],
    },
    mode: 'development',
    devServer: {
        host: '0.0.0.0',
        hot: false,
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'sass-loader',
                    },
                ],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                loader: 'file-loader',
                options: {
                    outputPath: 'media',
                },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: paths.src + '/index.html',
            chunks: [paths.name, 'app'],
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
})
