const path = require('path')

module.exports = {
    src: path.resolve(__dirname, '../src'), // source files
    build: path.resolve(__dirname, '../dist'), // production build files
    app: path.resolve(__dirname, '../src/entry-points'),
    name: 'instagram-api-js-client',
}
