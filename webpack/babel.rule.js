module.exports = (config = { target: 'web' }) => {
  const targets = {}
  const plugins = [
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: false,
        helpers: false,
        regenerator: true,
        useESModules: true,
        absoluteRuntime: true
      }
    ]
  ]

  if (config.target === 'web') {
    targets.browsers = [ 'last 2 versions', 'safari >= 7' ]

    if (process.env.NODE_ENV === 'production') {
      plugins.push('lodash')
    }
  } else {
    targets.node = 'current'
  }

  return {
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel-loader?cacheDirectory=true',
    options: {
      plugins,
      presets: [
        [
          '@babel/preset-env', {
            debug: process.env.CI === 'true',
            exclude: ['transform-typeof-symbol'],
            modules: false,
            targets
          }
        ]
      ]
    }
  }
}
