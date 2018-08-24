import BaseError from 'standard-error'

function createError (name) {
  class NewError extends BaseError {}
  NewError.prototype.name = name
  return NewError
}

export const StandardError = createError('StandardError')
export const ProviderNotFoundError = createError('ProviderNotFoundError')
export const InvalidProviderError = createError('InvalidProviderError')
export const DuplicateProviderError = createError('DuplicateProviderError')
export const NoProviderError = createError('NoProviderError')
export const UnsupportedMethodError = createError('UnsupportedMethodError')
export const UnimplementedMethodError = createError('UnimplementedMethodError')
export const InvalidProviderResponseError = createError('InvalidProviderResponseError')
