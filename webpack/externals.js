const pkg = require('../package.json')

module.exports = (config = { target: 'web' }) => {
  const externals = {}

  Object
    .keys(pkg.dependencies)
    .forEach(dep => {
      externals[dep] = dep
    })

  return externals
}
