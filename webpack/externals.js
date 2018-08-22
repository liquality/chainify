const pkg = require('../package.json')

module.exports = (config = { target: 'web' }) => {
  const externals = {}

  Object
    .keys(pkg.dependencies)
    .forEach(dep => {
      externals[dep] = dep
    })

  externals['@alias/ledger-transport'] = '@ledgerhq/hw-transport-node-hid'

  return externals
}
