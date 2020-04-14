const cwd = process.cwd()
const path = require('path')
const webpack = require('webpack')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const { DuplicatesPlugin } = require('inspectpack/plugin')

module.exports = (config = { target: 'web' }) => {
  const plugins = [
    new DuplicatesPlugin({
      emitErrors: false,
      verbose: false
    })
  ]

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

    if (process.env.BUILD_PKG_STATS === 'true' &&
        config.target === 'web') {
      const base = path.join(__dirname, '..', 'doc', 'pkg-stats', path.basename(cwd))

      plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: path.join(base, 'index.html'),
          openAnalyzer: false,
          generateStatsFile: true,
          statsFilename: path.join(base, 'stats.json')
        })
      )
    }
  }

  return plugins
}
