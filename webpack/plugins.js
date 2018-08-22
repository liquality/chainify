const path = require('path')
const webpack = require('webpack')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

module.exports = (config = { target: 'web' }) => {
  const plugins = []

  if (process.env.NODE_ENV === 'production') {
    if (config.target === 'web') {
      plugins.push(new LodashModuleReplacementPlugin())
    }

    plugins.push(
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      })
    )

    if (config.target === 'web') {
      plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: path.resolve(__dirname, '..', 'docs', 'bundle', 'index.html'),
          openAnalyzer: false,
          generateStatsFile: true,
          statsFilename: path.resolve(__dirname, '..', 'docs', 'bundle', 'stats.json')
        })
      )
    }
  }

  return plugins
}
