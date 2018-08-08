const path = require('path')
const webpack = require('webpack')

const pkg = require('./package.json')

function getExternalDependencies () {
  const externals = {}

  Object
    .keys(pkg.dependencies)
    .forEach(dep => {
      externals[dep] = dep
    })

  externals['@alias/ledger-transport'] = '@ledgerhq/hw-transport-node-hid'

  return externals
}

module.exports = {
  entry: './src/index.js',
  target: 'node',
  externals: getExternalDependencies(),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: path.basename(pkg.main),
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader?cacheDirectory=true',
        options: {
          plugins: [
            '@babel/plugin-transform-runtime'
          ],
          presets: [
            [
              '@babel/preset-env', {
                debug: true,
                modules: false,
                targets: {
                  node: '8'
                }
              }
            ]
          ]
        }
      }
    ]
  },
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ]
}
