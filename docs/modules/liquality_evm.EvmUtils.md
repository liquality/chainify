[](../README.md) / [Exports](../modules.md) / [@liquality/evm](liquality_evm.md) / EvmUtils

# Namespace: EvmUtils

[@liquality/evm](liquality_evm.md).EvmUtils

## Table of contents

### Functions

- [calculateFee](liquality_evm.EvmUtils.md#calculatefee)
- [extractFeeData](liquality_evm.EvmUtils.md#extractfeedata)
- [generateId](liquality_evm.EvmUtils.md#generateid)
- [parseBlockResponse](liquality_evm.EvmUtils.md#parseblockresponse)
- [parseSwapParams](liquality_evm.EvmUtils.md#parseswapparams)
- [parseTxRequest](liquality_evm.EvmUtils.md#parsetxrequest)
- [parseTxResponse](liquality_evm.EvmUtils.md#parsetxresponse)
- [toEthereumTxRequest](liquality_evm.EvmUtils.md#toethereumtxrequest)
- [toGwei](liquality_evm.EvmUtils.md#togwei)

## Functions

### calculateFee

▸ **calculateFee**(`base`, `multiplier`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `base` | `number` |
| `multiplier` | `number` |

#### Returns

`number`

#### Defined in

[evm/lib/utils.ts:128](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/utils.ts#L128)

___

### extractFeeData

▸ **extractFeeData**(`fee`): { `gasPrice`: `number` = fee } \| { `baseFeeTrend?`: `number` ; `currentBaseFeePerGas?`: `number` ; `gasPrice`: `undefined` = fee; `maxFeePerGas`: `number` ; `maxPriorityFeePerGas`: `number` ; `suggestedBaseFeePerGas?`: `number`  }

#### Parameters

| Name | Type |
| :------ | :------ |
| `fee` | `FeeType` |

#### Returns

{ `gasPrice`: `number` = fee } \| { `baseFeeTrend?`: `number` ; `currentBaseFeePerGas?`: `number` ; `gasPrice`: `undefined` = fee; `maxFeePerGas`: `number` ; `maxPriorityFeePerGas`: `number` ; `suggestedBaseFeePerGas?`: `number`  }

#### Defined in

[evm/lib/utils.ts:120](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/utils.ts#L120)

___

### generateId

▸ **generateId**(`htlcData`, `blockTimestamp`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `htlcData` | `HTLCDataStruct` |
| `blockTimestamp` | `number` |

#### Returns

`string`

#### Defined in

[evm/lib/utils.ts:106](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/utils.ts#L106)

___

### parseBlockResponse

▸ **parseBlockResponse**(`block`, `transactions?`): `Block`<`EthersBlock` \| `EthersBlockWithTransactions`, `EthersTransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `block` | `Block` \| `BlockWithTransactions` |
| `transactions?` | `TransactionResponse`[] |

#### Returns

`Block`<`EthersBlock` \| `EthersBlockWithTransactions`, `EthersTransactionResponse`\>

#### Defined in

[evm/lib/utils.ts:90](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/utils.ts#L90)

___

### parseSwapParams

▸ **parseSwapParams**(`tx`): `ILiqualityHTLC.HTLCDataStruct`

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | `SwapParams` |

#### Returns

`ILiqualityHTLC.HTLCDataStruct`

#### Defined in

[evm/lib/utils.ts:28](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/utils.ts#L28)

___

### parseTxRequest

▸ **parseTxRequest**(`request`): `TransactionRequest`

#### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthereumTransactionRequest`](liquality_evm.EvmTypes.md#ethereumtransactionrequest) \| `TransactionRequest` |

#### Returns

`TransactionRequest`

#### Defined in

[evm/lib/utils.ts:39](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/utils.ts#L39)

___

### parseTxResponse

▸ **parseTxResponse**(`response`, `receipt?`): `Transaction`<`EthersTransactionResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `response` | `TransactionResponse` |
| `receipt?` | `TransactionReceipt` |

#### Returns

`Transaction`<`EthersTransactionResponse`\>

#### Defined in

[evm/lib/utils.ts:66](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/utils.ts#L66)

___

### toEthereumTxRequest

▸ **toEthereumTxRequest**(`tx`, `fee`): [`EthereumTransactionRequest`](liquality_evm.EvmTypes.md#ethereumtransactionrequest)

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | `PopulatedTransaction` |
| `fee` | `FeeType` |

#### Returns

[`EthereumTransactionRequest`](liquality_evm.EvmTypes.md#ethereumtransactionrequest)

#### Defined in

[evm/lib/utils.ts:16](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/utils.ts#L16)

___

### toGwei

▸ **toGwei**(`wei`): `BigNumber`

#### Parameters

| Name | Type |
| :------ | :------ |
| `wei` | `string` \| `number` \| `BigNumber` |

#### Returns

`BigNumber`

#### Defined in

[evm/lib/utils.ts:124](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/utils.ts#L124)
