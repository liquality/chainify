const path = require('path')
const cwd = process.cwd()
const pkg = require(path.join(cwd, 'package.json'))
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const nodeExternals = require('webpack-node-externals')

const isProdEnv = process.env.NODE_ENV === 'production'
const isWatchEnv = process.env.WEBPACK_WATCH === 'true'

const plugins = []

if (isProdEnv) {
  if (process.env.BUILD_PKG_STATS === 'true') {
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

module.exports = {
  devtool: isProdEnv ? 'source-map' : 'eval',
  entry: './lib/index.ts',
  mode: isProdEnv ? 'production' : 'development',
  watch: isWatchEnv,
  target: 'node',
  externals: [
    nodeExternals({
      allowlist: ['node-fetch']
    })
  ],
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
      buffer: require.resolve('buffer'),
      stream: require.resolve('stream-browserify')
    }
  },
  output: {
    filename: path.basename(pkg.main),
    path: path.resolve(cwd, 'dist'),
    libraryTarget: 'commonjs2'
  },
  plugins,
  optimization: {
    usedExports: true // TODO: how to enable tree shaking on commonjs internal and modules? tsconfig should be esnext?
  }
}
