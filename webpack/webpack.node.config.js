const path = require('path')

const cwd = process.cwd()
const pkg = require(path.join(cwd, 'package.json'))
const babelRule = require('./babel.rule.js')
const plugins = require('./webpack.plugins.js')
const externals = require('./externals.js')

const isProdEnv = process.env.NODE_ENV === 'production'
const isWatchEnv = process.env.WEBPACK_WATCH === 'true'
const isCIEnv = process.env.CI === 'true'

module.exports = {
  stats: isCIEnv ? undefined : 'minimal',
  devtool: isProdEnv ? 'source-map' : 'eval',
  target: 'node',
  entry: './lib/index.js',
  externals: externals({ target: 'node' }),
  output: {
    path: path.resolve(cwd, 'dist'),
    filename: path.basename(pkg.main),
    libraryTarget: 'commonjs2',
    libraryExport: pkg.umdExport ? pkg.umdExport : undefined
  },
  module: {
    rules: [ babelRule({ target: 'node' }) ]
  },
  mode: isProdEnv ? 'production' : 'development',
  plugins: plugins({ target: 'node' }),
  watch: isWatchEnv
}
