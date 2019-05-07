const path = require('path')

const cwd = process.cwd()
const pkg = require(path.join(cwd, 'package.json'))
const babelRule = require('./babel.rule.js')
const plugins = require('./plugins.js')
const externals = require('./externals.js')

const entry = []

if (pkg.dependencies['@babel/polyfill']) {
  entry.push('@babel/polyfill/noConflict')
}

entry.push('./lib/index.js')

module.exports = {
  stats: process.env.CI === 'true' ? undefined : 'minimal',
  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'eval',
  target: 'node',
  entry,
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
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  plugins: plugins({ target: 'node' }),
  watch: process.env.WEBPACK_WATCH === 'true'
}
