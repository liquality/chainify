const browser = require('./webpack.browser.config.js')
const node = require('./webpack.node.config.js')

module.exports = [
  browser,
  node
]
