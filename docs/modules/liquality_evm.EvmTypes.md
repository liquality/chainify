[](../README.md) / [Exports](../modules.md) / [@liquality/evm](liquality_evm.md) / EvmTypes

# Namespace: EvmTypes

[@liquality/evm](liquality_evm.md).EvmTypes

## Table of contents

### Enumerations

- [NftTypes](../enums/liquality_evm.EvmTypes.NftTypes.md)

### Interfaces

- [EvmSwapOptions](../interfaces/liquality_evm.EvmTypes.EvmSwapOptions.md)

### Type aliases

- [EthereumFeeData](liquality_evm.EvmTypes.md#ethereumfeedata)
- [EthereumTransactionRequest](liquality_evm.EvmTypes.md#ethereumtransactionrequest)

## Type aliases

### EthereumFeeData

Ƭ **EthereumFeeData**: `FeeType` & { `gasPrice?`: ``null`` \| `number` ; `maxFeePerGas?`: ``null`` \| `number` ; `maxPriorityFeePerGas?`: ``null`` \| `number`  }

#### Defined in

[evm/lib/types.ts:21](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/types.ts#L21)

___

### EthereumTransactionRequest

Ƭ **EthereumTransactionRequest**: `TransactionRequest` & { `chainId?`: `number` ; `from?`: `AddressType` ; `gasLimit?`: `number` ; `gasPrice?`: `number` ; `maxFeePerGas?`: `number` ; `maxPriorityFeePerGas?`: `number` ; `nonce?`: `number` ; `type?`: `number`  }

#### Defined in

[evm/lib/types.ts:10](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/types.ts#L10)
