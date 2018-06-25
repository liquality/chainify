/* eslint-disable no-inline-comments */

/**
 * Module dependencies.
 */

// import { map, set } from 'lodash'
import BigNumber from 'bignumber.js'
import { renameKey } from '../util'

const isBigNumber = function (object) {
  return object instanceof BigNumber ||
      (object && object.constructor && object.constructor.name === 'BigNumber')
}

const isString = function (object) {
  return typeof object === 'string' ||
        (object && object.constructor && object.constructor.name === 'String')
}

/**
 * Export available rpc methods.
 */

export default {
  eth_getBalance: {
    formatter: {
      output (number) {
        number = number || 0
        if (isBigNumber(number)) {
          return number
        }

        if (isString(number) && (number.indexOf('0x') === 0 || number.indexOf('-0x') === 0)) {
          return new BigNumber(number.replace('0x', ''), 16)
        }

        return new BigNumber(number.toString(10), 10)
      }
    }
  },
  eth_getBlockByNumber: {
    formatter: {
      output (object) {
        object = renameKey(object, 'number', 'height')
        return object
      }
    }
  },
  eth_getBlockByHash: {
    formatter: {
      output (object) {
        object = renameKey(object, 'number', 'height')
        return object
      }
    }
  }
}
