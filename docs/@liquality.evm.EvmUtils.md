# Namespace: EvmUtils

[@liquality/evm](../wiki/@liquality.evm).EvmUtils

## Table of contents

### Functions

- [calculateFee](../wiki/@liquality.evm.EvmUtils#calculatefee)
- [extractFeeData](../wiki/@liquality.evm.EvmUtils#extractfeedata)
- [generateId](../wiki/@liquality.evm.EvmUtils#generateid)
- [parseBlockResponse](../wiki/@liquality.evm.EvmUtils#parseblockresponse)
- [parseSwapParams](../wiki/@liquality.evm.EvmUtils#parseswapparams)
- [parseTxRequest](../wiki/@liquality.evm.EvmUtils#parsetxrequest)
- [parseTxResponse](../wiki/@liquality.evm.EvmUtils#parsetxresponse)
- [toEthereumTxRequest](../wiki/@liquality.evm.EvmUtils#toethereumtxrequest)
- [toGwei](../wiki/@liquality.evm.EvmUtils#togwei)

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

[evm/lib/utils.ts:128](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/utils.ts#L128)

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

[evm/lib/utils.ts:120](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/utils.ts#L120)

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

[evm/lib/utils.ts:106](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/utils.ts#L106)

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

[evm/lib/utils.ts:90](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/utils.ts#L90)

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

[evm/lib/utils.ts:28](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/utils.ts#L28)

___

### parseTxRequest

▸ **parseTxRequest**(`request`): `TransactionRequest`

#### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`EthereumTransactionRequest`](../wiki/@liquality.evm.EvmTypes#ethereumtransactionrequest) \| `TransactionRequest` |

#### Returns

`TransactionRequest`

#### Defined in

[evm/lib/utils.ts:39](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/utils.ts#L39)

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

[evm/lib/utils.ts:66](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/utils.ts#L66)

___

### toEthereumTxRequest

▸ **toEthereumTxRequest**(`tx`, `fee`): [`EthereumTransactionRequest`](../wiki/@liquality.evm.EvmTypes#ethereumtransactionrequest)

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | `PopulatedTransaction` |
| `fee` | `FeeType` |

#### Returns

[`EthereumTransactionRequest`](../wiki/@liquality.evm.EvmTypes#ethereumtransactionrequest)

#### Defined in

[evm/lib/utils.ts:16](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/utils.ts#L16)

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

[evm/lib/utils.ts:124](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/utils.ts#L124)
