# Namespace: EvmTypes

[@liquality/evm](../wiki/@liquality.evm).EvmTypes

## Table of contents

### Enumerations

- [NftTypes](../wiki/@liquality.evm.EvmTypes.NftTypes)

### Interfaces

- [EvmSwapOptions](../wiki/@liquality.evm.EvmTypes.EvmSwapOptions)

### Type aliases

- [EthereumFeeData](../wiki/@liquality.evm.EvmTypes#ethereumfeedata)
- [EthereumTransactionRequest](../wiki/@liquality.evm.EvmTypes#ethereumtransactionrequest)

## Type aliases

### EthereumFeeData

Ƭ **EthereumFeeData**: `FeeType` & { `gasPrice?`: ``null`` \| `number` ; `maxFeePerGas?`: ``null`` \| `number` ; `maxPriorityFeePerGas?`: ``null`` \| `number`  }

#### Defined in

[evm/lib/types.ts:21](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/types.ts#L21)

___

### EthereumTransactionRequest

Ƭ **EthereumTransactionRequest**: `TransactionRequest` & { `chainId?`: `number` ; `from?`: `AddressType` ; `gasLimit?`: `number` ; `gasPrice?`: `number` ; `maxFeePerGas?`: `number` ; `maxPriorityFeePerGas?`: `number` ; `nonce?`: `number` ; `type?`: `number`  }

#### Defined in

[evm/lib/types.ts:10](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/types.ts#L10)
