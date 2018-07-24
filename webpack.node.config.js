const path = require('path')

const externals = Object
  .keys(require('./package.json').dependencies)

module.exports = {
  entry: './src/index.js',
  target: 'node',
  externals,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.node.js'
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
