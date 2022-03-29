# Class: NearSwapProvider

[@liquality/near](../wiki/@liquality.near).NearSwapProvider

## Hierarchy

- `default`<`providers.JsonRpcProvider`, `InMemorySigner`\>

  ↳ **`NearSwapProvider`**

## Table of contents

### Constructors

- [constructor](../wiki/@liquality.near.NearSwapProvider#constructor)

### Properties

- [walletProvider](../wiki/@liquality.near.NearSwapProvider#walletprovider)

### Methods

- [canUpdateFee](../wiki/@liquality.near.NearSwapProvider#canupdatefee)
- [claimSwap](../wiki/@liquality.near.NearSwapProvider#claimswap)
- [doesTransactionMatchInitiation](../wiki/@liquality.near.NearSwapProvider#doestransactionmatchinitiation)
- [findClaimSwapTransaction](../wiki/@liquality.near.NearSwapProvider#findclaimswaptransaction)
- [findInitiateSwapTransaction](../wiki/@liquality.near.NearSwapProvider#findinitiateswaptransaction)
- [findRefundSwapTransaction](../wiki/@liquality.near.NearSwapProvider#findrefundswaptransaction)
- [generateSecret](../wiki/@liquality.near.NearSwapProvider#generatesecret)
- [getSwapSecret](../wiki/@liquality.near.NearSwapProvider#getswapsecret)
- [getWallet](../wiki/@liquality.near.NearSwapProvider#getwallet)
- [initiateSwap](../wiki/@liquality.near.NearSwapProvider#initiateswap)
- [refundSwap](../wiki/@liquality.near.NearSwapProvider#refundswap)
- [setWallet](../wiki/@liquality.near.NearSwapProvider#setwallet)
- [updateTransactionFee](../wiki/@liquality.near.NearSwapProvider#updatetransactionfee)
- [validateSwapParams](../wiki/@liquality.near.NearSwapProvider#validateswapparams)
- [verifyInitiateSwapTransaction](../wiki/@liquality.near.NearSwapProvider#verifyinitiateswaptransaction)

## Constructors

### constructor

• **new NearSwapProvider**(`httpConfig`, `walletProvider`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `httpConfig` | `AxiosRequestConfig`<`any`\> |
| `walletProvider` | `default`<`JsonRpcProvider`, `InMemorySigner`\> |

#### Overrides

Swap&lt;providers.JsonRpcProvider, InMemorySigner\&gt;.constructor

#### Defined in

[near/lib/swap/NearSwapProvider.ts:14](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/swap/NearSwapProvider.ts#L14)

## Properties

### walletProvider

• `Protected` **walletProvider**: `any`

#### Inherited from

Swap.walletProvider

#### Defined in

client/dist/lib/Swap.d.ts:4

## Methods

### canUpdateFee

▸ **canUpdateFee**(): `boolean`

#### Returns

`boolean`

#### Overrides

Swap.canUpdateFee

#### Defined in

[near/lib/swap/NearSwapProvider.ts:147](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/swap/NearSwapProvider.ts#L147)

___

### claimSwap

▸ **claimSwap**(`swapParams`, `initTxHash`, `secret`): `Promise`<`Transaction`<[`NearTxLog`](../wiki/@liquality.near.NearTypes.NearTxLog)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `initTxHash` | `string` |
| `secret` | `string` |

#### Returns

`Promise`<`Transaction`<[`NearTxLog`](../wiki/@liquality.near.NearTypes.NearTxLog)\>\>

#### Overrides

Swap.claimSwap

#### Defined in

[near/lib/swap/NearSwapProvider.ts:34](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/swap/NearSwapProvider.ts#L34)

___

### doesTransactionMatchInitiation

▸ `Protected` **doesTransactionMatchInitiation**(`swapParams`, `transaction`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `transaction` | `Transaction`<[`NearTxLog`](../wiki/@liquality.near.NearTypes.NearTxLog)\> |

#### Returns

`boolean`

#### Overrides

Swap.doesTransactionMatchInitiation

#### Defined in

[near/lib/swap/NearSwapProvider.ts:94](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/swap/NearSwapProvider.ts#L94)

___

### findClaimSwapTransaction

▸ **findClaimSwapTransaction**(`swapParams`, `initTxHash`): `Promise`<`Transaction`<[`NearTxLog`](../wiki/@liquality.near.NearTypes.NearTxLog)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `initTxHash` | `string` |

#### Returns

`Promise`<`Transaction`<[`NearTxLog`](../wiki/@liquality.near.NearTypes.NearTxLog)\>\>

#### Overrides

Swap.findClaimSwapTransaction

#### Defined in

[near/lib/swap/NearSwapProvider.ts:48](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/swap/NearSwapProvider.ts#L48)

___

### findInitiateSwapTransaction

▸ **findInitiateSwapTransaction**(`swapParams`, `_blockNumber?`): `Promise`<`Transaction`<[`NearTxLog`](../wiki/@liquality.near.NearTypes.NearTxLog)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `_blockNumber?` | `number` |

#### Returns

`Promise`<`Transaction`<[`NearTxLog`](../wiki/@liquality.near.NearTypes.NearTxLog)\>\>

#### Overrides

Swap.findInitiateSwapTransaction

#### Defined in

[near/lib/swap/NearSwapProvider.ts:28](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/swap/NearSwapProvider.ts#L28)

___

### findRefundSwapTransaction

▸ **findRefundSwapTransaction**(`swapParams`, `initTxHash`): `Promise`<`Transaction`<[`NearTxLog`](../wiki/@liquality.near.NearTypes.NearTxLog)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `initTxHash` | `string` |

#### Returns

`Promise`<`Transaction`<[`NearTxLog`](../wiki/@liquality.near.NearTypes.NearTxLog)\>\>

#### Overrides

Swap.findRefundSwapTransaction

#### Defined in

[near/lib/swap/NearSwapProvider.ts:76](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/swap/NearSwapProvider.ts#L76)

___

### generateSecret

▸ **generateSecret**(`message`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |

#### Returns

`Promise`<`string`\>

#### Inherited from

Swap.generateSecret

#### Defined in

client/dist/lib/Swap.d.ts:10

___

### getSwapSecret

▸ **getSwapSecret**(`claimTxHash`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `claimTxHash` | `string` |

#### Returns

`Promise`<`string`\>

#### Overrides

Swap.getSwapSecret

#### Defined in

[near/lib/swap/NearSwapProvider.ts:86](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/swap/NearSwapProvider.ts#L86)

___

### getWallet

▸ **getWallet**(): `any`

#### Returns

`any`

#### Inherited from

Swap.getWallet

#### Defined in

client/dist/lib/Swap.d.ts:7

___

### initiateSwap

▸ **initiateSwap**(`swapParams`): `Promise`<`Transaction`<[`NearTxLog`](../wiki/@liquality.near.NearTypes.NearTxLog)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |

#### Returns

`Promise`<`Transaction`<[`NearTxLog`](../wiki/@liquality.near.NearTypes.NearTxLog)\>\>

#### Overrides

Swap.initiateSwap

#### Defined in

[near/lib/swap/NearSwapProvider.ts:19](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/swap/NearSwapProvider.ts#L19)

___

### refundSwap

▸ **refundSwap**(`swapParams`, `initTxHash`): `Promise`<`Transaction`<[`NearTxLog`](../wiki/@liquality.near.NearTypes.NearTxLog)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `initTxHash` | `string` |

#### Returns

`Promise`<`Transaction`<[`NearTxLog`](../wiki/@liquality.near.NearTypes.NearTxLog)\>\>

#### Overrides

Swap.refundSwap

#### Defined in

[near/lib/swap/NearSwapProvider.ts:65](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/swap/NearSwapProvider.ts#L65)

___

### setWallet

▸ **setWallet**(`wallet`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `wallet` | `any` |

#### Returns

`void`

#### Inherited from

Swap.setWallet

#### Defined in

client/dist/lib/Swap.d.ts:6

___

### updateTransactionFee

▸ **updateTransactionFee**(`_tx`, `_newFee`): `Promise`<`Transaction`<`any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_tx` | `string` \| `Transaction`<`any`\> |
| `_newFee` | `FeeType` |

#### Returns

`Promise`<`Transaction`<`any`\>\>

#### Overrides

Swap.updateTransactionFee

#### Defined in

[near/lib/swap/NearSwapProvider.ts:151](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/swap/NearSwapProvider.ts#L151)

___

### validateSwapParams

▸ **validateSwapParams**(`swapParams`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |

#### Returns

`void`

#### Inherited from

Swap.validateSwapParams

#### Defined in

client/dist/lib/Swap.d.ts:9

___

### verifyInitiateSwapTransaction

▸ **verifyInitiateSwapTransaction**(`swapParams`, `initTx`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `initTx` | `string` \| `Transaction`<`any`\> |

#### Returns

`Promise`<`boolean`\>

#### Inherited from

Swap.verifyInitiateSwapTransaction

#### Defined in

client/dist/lib/Swap.d.ts:8
