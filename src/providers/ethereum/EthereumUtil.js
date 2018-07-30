import BlockSchema from '../../schema/Block.json'
import TransactionSchema from '../../schema/Transaction.json'

function formatEthHex (match, p1, p2, offset, string) {
  return p2
}

export function formatEthResponse (obj) {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      if (obj[i].startsWith('0x')) {
        obj[i] = obj[i].replace(/(0x)([A-Fa-f0-9]{1,})/, formatEthHex)
      }
    }
  } else {
    for (let key in obj) {
      if (Array.isArray(obj[key])) {
        obj[key] = formatEthResponse(obj[key])
      } else {
        if ((BlockSchema.properties[key] &&
          BlockSchema.properties[key].type === 'number') ||
          (TransactionSchema.properties[key] &&
          TransactionSchema.properties[key].type === 'number')) {
          obj[key] = parseInt(obj[key])
        } else {
          if (obj[key].startsWith('0x')) {
            obj[key] = obj[key].replace(/(0x)([A-Fa-f0-9]{1,})/, formatEthHex)
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
