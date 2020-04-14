import { STATUS_CODES } from 'http'
import BaseError from 'standard-error'

import { version as v } from '../package.json'

function createError (name) {
  class CALError extends BaseError {}
  CALError.prototype.name = name
  return CALError
}

export const StandardError = createError('StandardError')
export const ProviderNotFoundError = createError('ProviderNotFoundError')
export const InvalidProviderError = createError('InvalidProviderError')
export const DuplicateProviderError = createError('DuplicateProviderError')
export const NoProviderError = createError('NoProviderError')
export const UnsupportedMethodError = createError('UnsupportedMethodError')
export const UnimplementedMethodError = createError('UnimplementedMethodError')
export const InvalidProviderResponseError = createError('InvalidProviderResponseError')
export const WalletError = createError('WalletError')

export class RpcError extends StandardError {
  constructor (code, msg, props = {}) {
    if (typeof code !== 'number') {
      throw new TypeError(`Non-numeric HTTP code`)
    }

    if (typeof msg === 'object' && msg !== null) {
      props = msg
      msg = null
    }

    props.code = code

    super(msg || STATUS_CODES[code], props)
  }

  get status () {
    return this.code
  }

  set status (value) {
    Object.defineProperty(this, 'status', {
      configurable: true,
      enumerable: true,
      value,
      writable: true
    })
  }

  toString () {
    return `${this.name}: ${this.code} ${this.message}`
  }
}

RpcError.prototype.name = 'RpcError'

export const version = v
