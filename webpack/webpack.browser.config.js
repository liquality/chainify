const path = require('path')

const cwd = process.cwd()
const pkg = require(path.join(cwd, 'package.json'))
const babelRule = require('./babel.rule.js')
const plugins = require('./plugins.js')

module.exports = {
  stats: process.env.CI === 'true' ? undefined : 'minimal',
  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'eval',
  target: 'web',
  entry: './lib/index.js',
  output: {
    path: path.resolve(cwd, 'dist'),
    filename: pkg.name.split('/')[1] + '.min.js',
    library: pkg.umdName || (function () { throw new Error(`Add "umdName" property to ${pkg.name}'s package.json`) })(),
    libraryTarget: 'umd',
    libraryExport: pkg.umdExport ? pkg.umdExport : undefined
  },
  module: {
    rules: [ babelRule({ target: 'web' }) ]
  },
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  plugins: plugins({ target: 'web' }),
  watch: process.env.WEBPACK_WATCH === 'true'
}
