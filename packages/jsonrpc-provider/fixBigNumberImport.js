// https://github.com/sidorares/json-bigint/issues/34

const fs = require('fs')

function replaceInFile(path, before, after) {
  const file = fs.readFileSync(path, 'utf8')
  const newFile = file.replace(before, after)
  fs.writeFileSync(path, newFile, 'utf8')
}

replaceInFile('./node_modules/json-bigint/lib/parse.js', `require('bignumber.js');`, `require('bignumber.js').default;`)
replaceInFile(
  './node_modules/json-bigint/lib/stringify.js',
  `require('bignumber.js');`,
  `require('bignumber.js').default;`
)
