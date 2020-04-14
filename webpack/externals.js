const path = require('path')
const cwd = process.cwd()
const pkg = require(path.join(cwd, 'package.json'))

module.exports = (config = { target: 'web' }) => {
  const externals = {}

  if (!pkg.dependencies) return externals

  Object
    .keys(pkg.dependencies)
    .forEach(dep => {
      externals[dep] = dep
    })

  return externals
}
