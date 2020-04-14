const path = require('path')

const cwd = process.cwd()
const pkg = require(path.join(cwd, 'package.json'))
const babelRule = require('./babel.rule.js')
const plugins = require('./webpack.plugins.js')

const libname = pkg.name.split('/')[1]
const isProdEnv = process.env.NODE_ENV === 'production'
const isWatchEnv = process.env.WEBPACK_WATCH === 'true'
const isCIEnv = process.env.CI === 'true'

module.exports = {
  stats: isCIEnv ? undefined : 'minimal',
  devtool: isProdEnv ? 'source-map' : 'eval',
  target: 'web',
  entry: './lib/index.js',
  output: {
    path: path.resolve(cwd, 'dist'),
    filename: `${libname}.min.js`,
    library: pkg.umdName || (function () { throw new Error(`Add "umdName" property to ${pkg.name}'s package.json`) })(),
    libraryTarget: 'umd',
    libraryExport: pkg.umdExport ? pkg.umdExport : undefined
  },
  module: {
    rules: [ babelRule({ target: 'web' }) ]
  },
  mode: isProdEnv ? 'production' : 'development',
  plugins: plugins({ target: 'web' }),
  watch: isWatchEnv
}
