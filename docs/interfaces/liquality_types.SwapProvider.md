[](../README.md) / [Exports](../modules.md) / [@liquality/types](../modules/liquality_types.md) / SwapProvider

# Interface: SwapProvider

[@liquality/types](../modules/liquality_types.md).SwapProvider

## Table of contents

### Methods

- [claimSwap](liquality_types.SwapProvider.md#claimswap)
- [findClaimSwapTransaction](liquality_types.SwapProvider.md#findclaimswaptransaction)
- [findInitiateSwapTransaction](liquality_types.SwapProvider.md#findinitiateswaptransaction)
- [findRefundSwapTransaction](liquality_types.SwapProvider.md#findrefundswaptransaction)
- [generateSecret](liquality_types.SwapProvider.md#generatesecret)
- [getSwapSecret](liquality_types.SwapProvider.md#getswapsecret)
- [initiateSwap](liquality_types.SwapProvider.md#initiateswap)
- [refundSwap](liquality_types.SwapProvider.md#refundswap)
- [verifyInitiateSwapTransaction](liquality_types.SwapProvider.md#verifyinitiateswaptransaction)

## Methods

### claimSwap

▸ **claimSwap**(`swapParams`, `initiationTxHash`, `secret`, `fee`): `Promise`<[`Transaction`](liquality_types.Transaction.md)<`any`\>\>

Claim the swap

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapParams` | [`SwapParams`](liquality_types.SwapParams.md) | The parameters of the swap |
| `initiationTxHash` | `string` | The transaction hash of the swap initiation. |
| `secret` | `string` | 32 byte secret for the swap in hex. |
| `fee` | [`FeeType`](../modules/liquality_types.md#feetype) | - |

#### Returns

`Promise`<[`Transaction`](liquality_types.Transaction.md)<`any`\>\>

Resolves with swap claim transaction.
 Rejects with InvalidProviderResponseError if provider's response is invalid.

#### Defined in

[types/lib/Swap.ts:98](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Swap.ts#L98)

___

### findClaimSwapTransaction

▸ **findClaimSwapTransaction**(`swapParams`, `initiationTxHash`, `blockNumber?`): `Promise`<[`Transaction`](liquality_types.Transaction.md)<`any`\>\>

Find swap claim transaction from parameters

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapParams` | [`SwapParams`](liquality_types.SwapParams.md) | The parameters of the swap |
| `initiationTxHash` | `string` | Swap initiation transaction hash/identifier |
| `blockNumber?` | `number` | - |

#### Returns

`Promise`<[`Transaction`](liquality_types.Transaction.md)<`any`\>\>

Resolves with the claim transaction if found, otherwise null.

#### Defined in

[types/lib/Swap.ts:45](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Swap.ts#L45)

___

### findInitiateSwapTransaction

▸ **findInitiateSwapTransaction**(`swapParams`, `blockNumber?`): `Promise`<[`Transaction`](liquality_types.Transaction.md)<`any`\>\>

Find swap transaction from parameters

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapParams` | [`SwapParams`](liquality_types.SwapParams.md) | The parameters of the swap |
| `blockNumber?` | `number` | - |

#### Returns

`Promise`<[`Transaction`](liquality_types.Transaction.md)<`any`\>\>

Resolves with the initiation transaction if found, otherwise null.

#### Defined in

[types/lib/Swap.ts:36](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Swap.ts#L36)

___

### findRefundSwapTransaction

▸ **findRefundSwapTransaction**(`swapParams`, `initiationTxHash`, `blockNumber?`): `Promise`<[`Transaction`](liquality_types.Transaction.md)<`any`\>\>

Refund the swap

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapParams` | [`SwapParams`](liquality_types.SwapParams.md) | The parameters of the swap |
| `initiationTxHash` | `string` | The transaction hash of the swap initiation. |
| `blockNumber?` | `number` | The block number to find the transaction in |

#### Returns

`Promise`<[`Transaction`](liquality_types.Transaction.md)<`any`\>\>

Resolves with the refund transaction if found, otherwise null.
 Rejects with InvalidProviderResponseError if provider's response is invalid.

#### Defined in

[types/lib/Swap.ts:55](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Swap.ts#L55)

___

### generateSecret

▸ **generateSecret**(`message`): `Promise`<`string`\>

Generate a secret.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | Message to be used for generating secret. |

#### Returns

`Promise`<`string`\>

Resolves with a 32 byte secret

#### Defined in

[types/lib/Swap.ts:62](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Swap.ts#L62)

___

### getSwapSecret

▸ **getSwapSecret**(`claimTxHash`, `initTxHash?`): `Promise`<`string`\>

Get secret from claim transaction hash.

#### Parameters

| Name | Type |
| :------ | :------ |
| `claimTxHash` | `string` |
| `initTxHash?` | `string` |

#### Returns

`Promise`<`string`\>

Resolves with secret

#### Defined in

[types/lib/Swap.ts:69](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Swap.ts#L69)

___

### initiateSwap

▸ **initiateSwap**(`swapParams`, `fee`): `Promise`<[`Transaction`](liquality_types.Transaction.md)<`any`\>\>

Initiate a swap

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapParams` | [`SwapParams`](liquality_types.SwapParams.md) | The parameters of the swap |
| `fee` | [`FeeType`](../modules/liquality_types.md#feetype) | - |

#### Returns

`Promise`<[`Transaction`](liquality_types.Transaction.md)<`any`\>\>

Resolves with swap initiation transaction.
Rejects with InvalidProviderResponseError if provider's response is invalid.

#### Defined in

[types/lib/Swap.ts:78](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Swap.ts#L78)

___

### refundSwap

▸ **refundSwap**(`swapParams`, `initiationTxHash`, `fee`): `Promise`<[`Transaction`](liquality_types.Transaction.md)<`any`\>\>

Refund the swap

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapParams` | [`SwapParams`](liquality_types.SwapParams.md) | The parameters of the swap |
| `initiationTxHash` | `string` | The transaction hash of the swap initiation. |
| `fee` | [`FeeType`](../modules/liquality_types.md#feetype) | - |

#### Returns

`Promise`<[`Transaction`](liquality_types.Transaction.md)<`any`\>\>

Resolves with refund swap transaction hash.
 Rejects with InvalidProviderResponseError if provider's response is invalid.

#### Defined in

[types/lib/Swap.ts:108](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Swap.ts#L108)

___

### verifyInitiateSwapTransaction

▸ **verifyInitiateSwapTransaction**(`swapParams`, `initiationTxHash`): `Promise`<`boolean`\>

Verifies that the given initiation transaction matches the given swap params

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapParams` | [`SwapParams`](liquality_types.SwapParams.md) | The parameters of the swap |
| `initiationTxHash` | `string` \| [`Transaction`](liquality_types.Transaction.md)<`any`\> | The transaction hash of the swap initiation. |

#### Returns

`Promise`<`boolean`\>

Resolves with true if verification has passed.
 Rejects with InvalidProviderResponseError if provider's response is invalid.

#### Defined in

[types/lib/Swap.ts:87](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Swap.ts#L87)
