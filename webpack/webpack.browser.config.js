const path = require('path')

const pkg = require('../package.json')
const babelRule = require('./babel.rule.js')
const plugins = require('./plugins.js')

module.exports = {
  target: 'web',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    filename: path.basename(pkg.browser),
    library: 'ChainAbstractionLayer',
    libraryTarget: 'umd'
  },
  resolve: {
    alias: {
      '@alias/ledger-transport': '@ledgerhq/hw-transport-u2f'
    }
  },
  module: {
    rules: [ babelRule({ target: 'web' }) ]
  },
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  plugins: plugins({ target: 'web' })
}
