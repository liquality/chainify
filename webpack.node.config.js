const path = require('path')

const externals = {}

Object
  .keys(require('./package.json').dependencies)
  .forEach(dep => {
    externals[dep] = dep
  })

externals['@alias/ledger-transport'] = '@ledgerhq/hw-transport-node-hid'

module.exports = {
  entry: './src/index.js',
  target: 'node',
  externals,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.cjs.js',
    libraryTarget: 'commonjs2',
    libraryExport: 'default'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development'
}
