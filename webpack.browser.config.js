const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.browser.js',
    library: 'ChainAbstractionLayer'
  },
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development'
}
