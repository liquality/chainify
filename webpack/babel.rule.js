module.exports = (config = { target: 'web' }) => {
  const targets = {}
  const plugins = [ '@babel/plugin-transform-runtime' ]

  if (config.target === 'web') {
    targets.browsers = [ 'last 2 versions', 'safari >= 7' ]

    if (process.env.NODE_ENV === 'production') {
      plugins.push('lodash')
    }
  } else {
    targets.node = '8'
  }

  const conf = {
    test: /\.js$/,
    loader: 'babel-loader?cacheDirectory=true',
    options: {
      plugins,
      presets: [
        [
          '@babel/preset-env', {
            debug: true,
            modules: false,
            targets
          }
        ]
      ]
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    conf.exclude = /node_modules/
  }

  return conf
}
