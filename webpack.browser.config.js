const path = require('path')
const webpack = require('webpack')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

const plugins = []

if (process.env.NODE_ENV === 'production') {
  plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new LodashModuleReplacementPlugin()
  )
}

plugins.push(
  new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    reportFilename: path.resolve(__dirname, 'docs', 'bundle', 'index.html'),
    openAnalyzer: false,
    generateStatsFile: true,
    statsFilename: path.resolve(__dirname, 'docs', 'bundle', 'stats.json')
  })
)

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.umd.js',
    library: 'ChainAbstractionLayer',
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
  resolve: {
    alias: {
      '@alias/ledger-transport': path.resolve(__dirname, 'node_modules', '@ledgerhq', 'hw-transport-u2f')
    }
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
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  plugins
}
