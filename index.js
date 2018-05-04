const DSNParser = require('dsn-parser')

const chains = require('./chains')

module.exports = (uri) => {
  const dsn = new DSNParser(uri)

  const opts = dsn.getParts()

  let { driver } = opts
  let defaultPort = 80

  if (driver.endsWith('+s')) {
    driver = driver.substring(0, driver.length - 2)
    defaultPort = 443
  }

  opts.port = opts.port || defaultPort

  const Chain = chains[driver]

  if (!Chain) {
    throw new Error(`${driver} is not supported, yet`)
  }

  return new Chain(opts)
}
