const DSNParser = require('dsn-parser')

const chains = require('./chains')

module.exports = (uri) => {
  const dsn = new DSNParser(uri)

  const opts = dsn.getParts()

  let { driver } = opts

  if (driver.endsWith('s')) {
    driver = driver.substring(0, driver.length - 1)
  }

  const Chain = chains[driver]

  if (!Chain) {
    throw new Error(`${driver} is not supported, yet`)
  }

  return new Chain(opts)
}
