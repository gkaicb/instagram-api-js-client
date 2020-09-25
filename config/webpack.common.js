const paths = require('./paths')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    entry: {
        [paths.name]: [paths.src + '/js/index.js'],
    },
    output: {
        filename: 'js/[name].js',
        path: paths.dist,
        library: '[name]',
        libraryTarget: 'umd',
        libraryExport: '',
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin({
            verbose: true,
        }),
    ],
}
