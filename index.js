const DSNParser = require('dsn-parser')

const chains = require('./chains')

module.exports = (uri) => {
  const dsn = new DSNParser(uri)

  const opts = dsn.getParts()

  const Chain = chains[opts.driver]

  if (!Chain) {
    throw new Error(`${opts.driver} not supported, yet`)
  }

  return new Chain(opts)
}
