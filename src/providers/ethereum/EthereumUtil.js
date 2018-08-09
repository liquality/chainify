import { Block, Transaction } from '../../schema'

export function formatEthResponse (obj) {
  if (Array.isArray(obj)) {
    obj = obj.map((elem) => {
      if (elem.startsWith('0x')) {
        elem = elem.replace('0x', '')
      }
      return elem
    })
  } else {
    for (let key in obj) {
      if (Array.isArray(obj[key])) {
        obj[key] = formatEthResponse(obj[key])
      } else {
        if ((Block.properties[key] &&
          Block.properties[key].type === 'number') ||
          (Transaction.properties[key] &&
          Transaction.properties[key].type === 'number')) {
          obj[key] = parseInt(obj[key])
        } else {
          if (obj[key].startsWith('0x')) {
            obj[key] = obj[key].replace('0x', '')
          }
        }
      }
    }
  }
  return obj
}

export function ensureEthFormat (hash) {
  if (!hash.startsWith('0x')) { hash = '0x' + hash }
  return hash
}
