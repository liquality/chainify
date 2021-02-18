import BaseError from 'standard-error';
import { version } from '../package.json';
export declare class StandardError extends BaseError {
}
export declare class ProviderNotFoundError extends BaseError {
}
export declare class InvalidProviderError extends BaseError {
}
export declare class DuplicateProviderError extends BaseError {
}
export declare class NoProviderError extends BaseError {
}
export declare class UnsupportedMethodError extends BaseError {
}
export declare class UnimplementedMethodError extends BaseError {
}
export declare class InvalidProviderResponseError extends BaseError {
}
export declare class PendingTxError extends BaseError {
}
export declare class TxNotFoundError extends BaseError {
}
export declare class TxFailedError extends BaseError {
}
export declare class BlockNotFoundError extends BaseError {
}
export declare class InvalidDestinationAddressError extends BaseError {
}
export declare class WalletError extends BaseError {
}
export declare class NodeError extends BaseError {
}
export declare class InvalidSecretError extends BaseError {
}
export declare class InvalidAddressError extends BaseError {
}
export declare class InvalidExpirationError extends BaseError {
}
export { version };
