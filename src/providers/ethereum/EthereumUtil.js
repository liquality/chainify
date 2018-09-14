import { Block, Transaction } from '../../schema'

/**
 * Converts a hex string to the ethereum format
 * @param {*} hash
 */
function ensureHexEthFormat (hash) {
  return hash.startsWith('0x') ? hash : '0x' + hash
}

/**
 * Converts an ethereum hex string to the standard format
 * @param {*} hash
 */
function ensureHexStandardFormat (hash) {
  return hash.replace('0x', '')
}

function formatEthResponse (obj) {
  if (typeof obj === 'string' || obj instanceof String) {
    obj = ensureHexStandardFormat(obj)
  } else if (Array.isArray(obj) && typeof obj[0] === 'object') {
    for (let i = 0; i < obj.length; i++) {
      obj[i] = formatEthResponse(obj[i])
    }
  } else if (Array.isArray(obj)) {
    obj = obj.map(ensureHexStandardFormat)
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
          if (obj[key]) {
            obj[key] = ensureHexStandardFormat(obj[key])
          }
        }
      }
    }
  }
  return obj
}

export {ensureHexEthFormat, ensureHexStandardFormat, formatEthResponse}
