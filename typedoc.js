const fs = require('fs')

const brokenPackages = ['bitcoin-wallet-provider']

const packages = fs
  .readdirSync('./packages/', { withFileTypes: true })
  .filter((dir) => dir.isDirectory())
  .filter((dir) => !brokenPackages.includes(dir.name))
  .map((dir) => dir.name)

module.exports = {
  entryPoints: packages.map((package) => `packages/${package}/lib/index.ts`),
  out: 'docs'
}
