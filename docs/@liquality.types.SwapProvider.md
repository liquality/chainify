# Interface: SwapProvider

[@liquality/types](../wiki/@liquality.types).SwapProvider

## Table of contents

### Methods

- [claimSwap](../wiki/@liquality.types.SwapProvider#claimswap)
- [findClaimSwapTransaction](../wiki/@liquality.types.SwapProvider#findclaimswaptransaction)
- [findInitiateSwapTransaction](../wiki/@liquality.types.SwapProvider#findinitiateswaptransaction)
- [findRefundSwapTransaction](../wiki/@liquality.types.SwapProvider#findrefundswaptransaction)
- [generateSecret](../wiki/@liquality.types.SwapProvider#generatesecret)
- [getSwapSecret](../wiki/@liquality.types.SwapProvider#getswapsecret)
- [initiateSwap](../wiki/@liquality.types.SwapProvider#initiateswap)
- [refundSwap](../wiki/@liquality.types.SwapProvider#refundswap)
- [verifyInitiateSwapTransaction](../wiki/@liquality.types.SwapProvider#verifyinitiateswaptransaction)

## Methods

### claimSwap

▸ **claimSwap**(`swapParams`, `initiationTxHash`, `secret`, `fee`): `Promise`<[`Transaction`](../wiki/@liquality.types.Transaction)<`any`\>\>

Claim the swap

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapParams` | [`SwapParams`](../wiki/@liquality.types.SwapParams) | The parameters of the swap |
| `initiationTxHash` | `string` | The transaction hash of the swap initiation. |
| `secret` | `string` | 32 byte secret for the swap in hex. |
| `fee` | [`FeeType`](../wiki/@liquality.types#feetype) | - |

#### Returns

`Promise`<[`Transaction`](../wiki/@liquality.types.Transaction)<`any`\>\>

Resolves with swap claim transaction.
 Rejects with InvalidProviderResponseError if provider's response is invalid.

#### Defined in

[types/lib/Swap.ts:98](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Swap.ts#L98)

___

### findClaimSwapTransaction

▸ **findClaimSwapTransaction**(`swapParams`, `initiationTxHash`, `blockNumber?`): `Promise`<[`Transaction`](../wiki/@liquality.types.Transaction)<`any`\>\>

Find swap claim transaction from parameters

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapParams` | [`SwapParams`](../wiki/@liquality.types.SwapParams) | The parameters of the swap |
| `initiationTxHash` | `string` | Swap initiation transaction hash/identifier |
| `blockNumber?` | `number` | - |

#### Returns

`Promise`<[`Transaction`](../wiki/@liquality.types.Transaction)<`any`\>\>

Resolves with the claim transaction if found, otherwise null.

#### Defined in

[types/lib/Swap.ts:45](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Swap.ts#L45)

___

### findInitiateSwapTransaction

▸ **findInitiateSwapTransaction**(`swapParams`, `blockNumber?`): `Promise`<[`Transaction`](../wiki/@liquality.types.Transaction)<`any`\>\>

Find swap transaction from parameters

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapParams` | [`SwapParams`](../wiki/@liquality.types.SwapParams) | The parameters of the swap |
| `blockNumber?` | `number` | - |

#### Returns

`Promise`<[`Transaction`](../wiki/@liquality.types.Transaction)<`any`\>\>

Resolves with the initiation transaction if found, otherwise null.

#### Defined in

[types/lib/Swap.ts:36](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Swap.ts#L36)

___

### findRefundSwapTransaction

▸ **findRefundSwapTransaction**(`swapParams`, `initiationTxHash`, `blockNumber?`): `Promise`<[`Transaction`](../wiki/@liquality.types.Transaction)<`any`\>\>

Refund the swap

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapParams` | [`SwapParams`](../wiki/@liquality.types.SwapParams) | The parameters of the swap |
| `initiationTxHash` | `string` | The transaction hash of the swap initiation. |
| `blockNumber?` | `number` | The block number to find the transaction in |

#### Returns

`Promise`<[`Transaction`](../wiki/@liquality.types.Transaction)<`any`\>\>

Resolves with the refund transaction if found, otherwise null.
 Rejects with InvalidProviderResponseError if provider's response is invalid.

#### Defined in

[types/lib/Swap.ts:55](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Swap.ts#L55)

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

[types/lib/Swap.ts:62](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Swap.ts#L62)

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

[types/lib/Swap.ts:69](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Swap.ts#L69)

___

### initiateSwap

▸ **initiateSwap**(`swapParams`, `fee`): `Promise`<[`Transaction`](../wiki/@liquality.types.Transaction)<`any`\>\>

Initiate a swap

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapParams` | [`SwapParams`](../wiki/@liquality.types.SwapParams) | The parameters of the swap |
| `fee` | [`FeeType`](../wiki/@liquality.types#feetype) | - |

#### Returns

`Promise`<[`Transaction`](../wiki/@liquality.types.Transaction)<`any`\>\>

Resolves with swap initiation transaction.
Rejects with InvalidProviderResponseError if provider's response is invalid.

#### Defined in

[types/lib/Swap.ts:78](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Swap.ts#L78)

___

### refundSwap

▸ **refundSwap**(`swapParams`, `initiationTxHash`, `fee`): `Promise`<[`Transaction`](../wiki/@liquality.types.Transaction)<`any`\>\>

Refund the swap

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapParams` | [`SwapParams`](../wiki/@liquality.types.SwapParams) | The parameters of the swap |
| `initiationTxHash` | `string` | The transaction hash of the swap initiation. |
| `fee` | [`FeeType`](../wiki/@liquality.types#feetype) | - |

#### Returns

`Promise`<[`Transaction`](../wiki/@liquality.types.Transaction)<`any`\>\>

Resolves with refund swap transaction hash.
 Rejects with InvalidProviderResponseError if provider's response is invalid.

#### Defined in

[types/lib/Swap.ts:108](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Swap.ts#L108)

___

### verifyInitiateSwapTransaction

▸ **verifyInitiateSwapTransaction**(`swapParams`, `initiationTxHash`): `Promise`<`boolean`\>

Verifies that the given initiation transaction matches the given swap params

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `swapParams` | [`SwapParams`](../wiki/@liquality.types.SwapParams) | The parameters of the swap |
| `initiationTxHash` | `string` \| [`Transaction`](../wiki/@liquality.types.Transaction)<`any`\> | The transaction hash of the swap initiation. |

#### Returns

`Promise`<`boolean`\>

Resolves with true if verification has passed.
 Rejects with InvalidProviderResponseError if provider's response is invalid.

#### Defined in

[types/lib/Swap.ts:87](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Swap.ts#L87)
