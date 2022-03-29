[](../README.md) / [Exports](../modules.md) / [@liquality/near](liquality_near.md) / NearUtils

# Namespace: NearUtils

[@liquality/near](liquality_near.md).NearUtils

## Table of contents

### Functions

- [getClaimActions](liquality_near.NearUtils.md#getclaimactions)
- [getHtlcActions](liquality_near.NearUtils.md#gethtlcactions)
- [getRefundActions](liquality_near.NearUtils.md#getrefundactions)
- [parseBlockResponse](liquality_near.NearUtils.md#parseblockresponse)
- [parseNearBlockTx](liquality_near.NearUtils.md#parsenearblocktx)
- [parseScraperTransaction](liquality_near.NearUtils.md#parsescrapertransaction)
- [parseTxResponse](liquality_near.NearUtils.md#parsetxresponse)

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

[near/lib/utils.ts:74](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/utils.ts#L74)

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

[near/lib/utils.ts:65](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/utils.ts#L65)

___

### getRefundActions

▸ **getRefundActions**(): `Action`[]

#### Returns

`Action`[]

#### Defined in

[near/lib/utils.ts:79](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/utils.ts#L79)

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

[near/lib/utils.ts:7](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/utils.ts#L7)

___

### parseNearBlockTx

▸ **parseNearBlockTx**(`tx`, `currentBlock`, `txBlock`): `Transaction`<[`NearTransaction`](../interfaces/liquality_near.NearTypes.NearTransaction.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | [`NearTransaction`](../interfaces/liquality_near.NearTypes.NearTransaction.md) |
| `currentBlock` | `number` |
| `txBlock` | `number` |

#### Returns

`Transaction`<[`NearTransaction`](../interfaces/liquality_near.NearTypes.NearTransaction.md)\>

#### Defined in

[near/lib/utils.ts:19](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/utils.ts#L19)

___

### parseScraperTransaction

▸ **parseScraperTransaction**(`tx`): [`NearTxLog`](../interfaces/liquality_near.NearTypes.NearTxLog.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | [`NearScraperData`](../interfaces/liquality_near.NearTypes.NearScraperData.md) |

#### Returns

[`NearTxLog`](../interfaces/liquality_near.NearTypes.NearTxLog.md)

#### Defined in

[near/lib/utils.ts:84](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/utils.ts#L84)

___

### parseTxResponse

▸ **parseTxResponse**(`response`, `blockNumber?`, `latestBlock?`): `Transaction`<[`NearTxLog`](../interfaces/liquality_near.NearTypes.NearTxLog.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `response` | [`NearTxResponse`](../interfaces/liquality_near.NearTypes.NearTxResponse.md) |
| `blockNumber?` | `number` |
| `latestBlock?` | `number` |

#### Returns

`Transaction`<[`NearTxLog`](../interfaces/liquality_near.NearTypes.NearTxLog.md)\>

#### Defined in

[near/lib/utils.ts:29](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/utils.ts#L29)
