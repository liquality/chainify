const path = require('path')
const cwd = process.cwd()
const pkg = require(path.join(cwd, 'package.json'))

const isProdEnv = process.env.NODE_ENV === 'production'
const isWatchEnv = process.env.WEBPACK_WATCH === 'true'
// const isCIEnv = process.env.CI === 'true'

module.exports = {
  entry: './lib/index.ts',
  mode: isProdEnv ? 'production' : 'development',
  watch: isWatchEnv,
  target: 'node',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      'buffer': require.resolve('buffer'),
      'stream': require.resolve('stream-browserify')
    }
  },
  output: {
    filename: path.basename(pkg.main),
    path: path.resolve(cwd, 'dist'),
    libraryTarget: 'commonjs2'
  },
  optimization: {
    usedExports: true // TODO: how to enable tree shaking on commonjs internal and modules? tsconfig should be esnext?
  }
}
