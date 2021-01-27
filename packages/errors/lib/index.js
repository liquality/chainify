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
export const PendingTxError = createError('PendingTxError')
export const TxNotFoundError = createError('TxNotFoundError')
export const TxFailedError = createError('TxFailedError')
export const BlockNotFoundError = createError('BlockNotFoundError')
export const InvalidDestinationAddressError = createError('InvalidDestinationAddressError')
export const WalletError = createError('WalletError')
export const NodeError = createError('NodeError')
export const InvalidSecretError = createError('InvalidSecretError')
export const InvalidAddressError = createError('InvalidAddressError')
export const InvalidExpirationError = createError('InvalidExpirationError')

export const version = v
