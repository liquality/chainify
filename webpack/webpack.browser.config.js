const path = require('path')

const babelRule = require('./babel.rule.js')
const plugins = require('./plugins.js')

module.exports = {
  target: 'web',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    filename: 'index.umd.js',
    library: 'ChainAbstractionLayer',
    libraryTarget: 'umd'
  },
  module: {
    rules: [ babelRule({ target: 'web' }) ]
  },
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  plugins: plugins({ target: 'web' }),
  watch: process.env.WEBPACK_WATCH === 'true'
}
