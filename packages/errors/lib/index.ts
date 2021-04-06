
import BaseError from 'standard-error'

import { version } from '../package.json'

export class StandardError extends BaseError {}
export class ProviderNotFoundError extends BaseError {}
export class InvalidProviderError extends BaseError {}
export class DuplicateProviderError extends BaseError {}
export class NoProviderError extends BaseError {}
export class UnsupportedMethodError extends BaseError {}
export class UnimplementedMethodError extends BaseError {}
export class InvalidProviderResponseError extends BaseError {}
export class PendingTxError extends BaseError {}
export class TxNotFoundError extends BaseError {}
export class TxFailedError extends BaseError {}
export class BlockNotFoundError extends BaseError {}
export class InvalidDestinationAddressError extends BaseError {}
export class WalletError extends BaseError {}
export class NodeError extends BaseError {}
export class InvalidSecretError extends BaseError {}
export class InvalidAddressError extends BaseError {}
export class InvalidExpirationError extends BaseError {}
export class InsufficientBalanceError extends BaseError {}

export { version }
