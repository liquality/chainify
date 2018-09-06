const path = require('path')

const pkg = require('../package.json')
const babelRule = require('./babel.rule.js')
const plugins = require('./plugins.js')
const externals = require('./externals.js')

module.exports = {
  target: 'node',
  entry: './src/index.js',
  externals: externals({ target: 'node' }),
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    filename: path.basename(pkg.main),
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [ babelRule({ target: 'node' }) ]
  },
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  plugins: plugins({ target: 'node' }),
  watch: process.env.WEBPACK_WATCH === 'true'
}
