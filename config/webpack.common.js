const paths = require('./paths')

module.exports = {
    entry: {
        [paths.name]: [paths.src + '/js/index.js'],
    },
    output: {
        filename: 'js/[name].js',
        path: paths.dist,
        library: {
            name: '[name]',
            type: 'umd',
            // export: '',
        },
        clean: true,
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
    plugins: [],
}
