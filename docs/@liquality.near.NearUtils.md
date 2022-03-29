# Namespace: NearUtils

[@liquality/near](../wiki/@liquality.near).NearUtils

## Table of contents

### Functions

- [getClaimActions](../wiki/@liquality.near.NearUtils#getclaimactions)
- [getHtlcActions](../wiki/@liquality.near.NearUtils#gethtlcactions)
- [getRefundActions](../wiki/@liquality.near.NearUtils#getrefundactions)
- [parseBlockResponse](../wiki/@liquality.near.NearUtils#parseblockresponse)
- [parseNearBlockTx](../wiki/@liquality.near.NearUtils#parsenearblocktx)
- [parseScraperTransaction](../wiki/@liquality.near.NearUtils#parsescrapertransaction)
- [parseTxResponse](../wiki/@liquality.near.NearUtils#parsetxresponse)

## Functions

### getClaimActions

▸ **getClaimActions**(`secret`): `Action`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `secret` | `string` |

#### Returns

`Action`[]

#### Defined in

[near/lib/utils.ts:74](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/utils.ts#L74)

___

### getHtlcActions

▸ **getHtlcActions**(`swapParams`): `Action`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |

#### Returns

`Action`[]

#### Defined in

[near/lib/utils.ts:65](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/utils.ts#L65)

___

### getRefundActions

▸ **getRefundActions**(): `Action`[]

#### Returns

`Action`[]

#### Defined in

[near/lib/utils.ts:79](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/utils.ts#L79)

___

### parseBlockResponse

▸ **parseBlockResponse**(`block`, `transactions?`): `Block`<`BlockResult`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `block` | `BlockResult` |
| `transactions?` | `Transaction`<`any`\>[] |

#### Returns

`Block`<`BlockResult`\>

#### Defined in

[near/lib/utils.ts:7](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/utils.ts#L7)

___

### parseNearBlockTx

▸ **parseNearBlockTx**(`tx`, `currentBlock`, `txBlock`): `Transaction`<[`NearTransaction`](../wiki/@liquality.near.NearTypes.NearTransaction)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | [`NearTransaction`](../wiki/@liquality.near.NearTypes.NearTransaction) |
| `currentBlock` | `number` |
| `txBlock` | `number` |

#### Returns

`Transaction`<[`NearTransaction`](../wiki/@liquality.near.NearTypes.NearTransaction)\>

#### Defined in

[near/lib/utils.ts:19](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/utils.ts#L19)

___

### parseScraperTransaction

▸ **parseScraperTransaction**(`tx`): [`NearTxLog`](../wiki/@liquality.near.NearTypes.NearTxLog)

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | [`NearScraperData`](../wiki/@liquality.near.NearTypes.NearScraperData) |

#### Returns

[`NearTxLog`](../wiki/@liquality.near.NearTypes.NearTxLog)

#### Defined in

[near/lib/utils.ts:84](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/utils.ts#L84)

___

### parseTxResponse

▸ **parseTxResponse**(`response`, `blockNumber?`, `latestBlock?`): `Transaction`<[`NearTxLog`](../wiki/@liquality.near.NearTypes.NearTxLog)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `response` | [`NearTxResponse`](../wiki/@liquality.near.NearTypes.NearTxResponse) |
| `blockNumber?` | `number` |
| `latestBlock?` | `number` |

#### Returns

`Transaction`<[`NearTxLog`](../wiki/@liquality.near.NearTypes.NearTxLog)\>

#### Defined in

[near/lib/utils.ts:29](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/utils.ts#L29)
