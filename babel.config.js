// for tests

module.exports = function (api) {
  api.cache(true)

  const presets = [
    [
      '@babel/preset-env', {
        targets: {
          node: true
        }
      }
    ]
  ]

  const plugins = [
    'istanbul'
  ]

  return {
    presets,
    plugins
  }
}
