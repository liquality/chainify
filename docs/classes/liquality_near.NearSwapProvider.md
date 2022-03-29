[](../README.md) / [Exports](../modules.md) / [@liquality/near](../modules/liquality_near.md) / NearSwapProvider

# Class: NearSwapProvider

[@liquality/near](../modules/liquality_near.md).NearSwapProvider

## Hierarchy

- `default`<`providers.JsonRpcProvider`, `InMemorySigner`\>

  ↳ **`NearSwapProvider`**

## Table of contents

### Constructors

- [constructor](liquality_near.NearSwapProvider.md#constructor)

### Properties

- [\_httpClient](liquality_near.NearSwapProvider.md#_httpclient)
- [walletProvider](liquality_near.NearSwapProvider.md#walletprovider)

### Methods

- [canUpdateFee](liquality_near.NearSwapProvider.md#canupdatefee)
- [claimSwap](liquality_near.NearSwapProvider.md#claimswap)
- [doesTransactionMatchInitiation](liquality_near.NearSwapProvider.md#doestransactionmatchinitiation)
- [findAddressTransaction](liquality_near.NearSwapProvider.md#findaddresstransaction)
- [findClaimSwapTransaction](liquality_near.NearSwapProvider.md#findclaimswaptransaction)
- [findInitiateSwapTransaction](liquality_near.NearSwapProvider.md#findinitiateswaptransaction)
- [findRefundSwapTransaction](liquality_near.NearSwapProvider.md#findrefundswaptransaction)
- [generateSecret](liquality_near.NearSwapProvider.md#generatesecret)
- [generateUniqueString](liquality_near.NearSwapProvider.md#generateuniquestring)
- [getSwapSecret](liquality_near.NearSwapProvider.md#getswapsecret)
- [getWallet](liquality_near.NearSwapProvider.md#getwallet)
- [initiateSwap](liquality_near.NearSwapProvider.md#initiateswap)
- [refundSwap](liquality_near.NearSwapProvider.md#refundswap)
- [setWallet](liquality_near.NearSwapProvider.md#setwallet)
- [updateTransactionFee](liquality_near.NearSwapProvider.md#updatetransactionfee)
- [validateSwapParams](liquality_near.NearSwapProvider.md#validateswapparams)
- [verifyInitiateSwapTransaction](liquality_near.NearSwapProvider.md#verifyinitiateswaptransaction)

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

[near/lib/swap/NearSwapProvider.ts:14](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/swap/NearSwapProvider.ts#L14)

## Properties

### \_httpClient

• `Private` **\_httpClient**: `default`

#### Defined in

[near/lib/swap/NearSwapProvider.ts:12](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/swap/NearSwapProvider.ts#L12)

___

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

[near/lib/swap/NearSwapProvider.ts:147](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/swap/NearSwapProvider.ts#L147)

___

### claimSwap

▸ **claimSwap**(`swapParams`, `initTxHash`, `secret`): `Promise`<`Transaction`<[`NearTxLog`](../interfaces/liquality_near.NearTypes.NearTxLog.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `initTxHash` | `string` |
| `secret` | `string` |

#### Returns

`Promise`<`Transaction`<[`NearTxLog`](../interfaces/liquality_near.NearTypes.NearTxLog.md)\>\>

#### Overrides

Swap.claimSwap

#### Defined in

[near/lib/swap/NearSwapProvider.ts:34](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/swap/NearSwapProvider.ts#L34)

___

### doesTransactionMatchInitiation

▸ `Protected` **doesTransactionMatchInitiation**(`swapParams`, `transaction`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `transaction` | `Transaction`<[`NearTxLog`](../interfaces/liquality_near.NearTypes.NearTxLog.md)\> |

#### Returns

`boolean`

#### Overrides

Swap.doesTransactionMatchInitiation

#### Defined in

[near/lib/swap/NearSwapProvider.ts:94](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/swap/NearSwapProvider.ts#L94)

___

### findAddressTransaction

▸ `Private` **findAddressTransaction**(`address`, `predicate`, `limit?`): `Promise`<`Transaction`<[`NearTxLog`](../interfaces/liquality_near.NearTypes.NearTxLog.md)\>\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `address` | `string` | `undefined` |
| `predicate` | (`tx`: `Transaction`<[`NearTxLog`](../interfaces/liquality_near.NearTypes.NearTxLog.md)\>) => `boolean` | `undefined` |
| `limit` | `number` | `1024` |

#### Returns

`Promise`<`Transaction`<[`NearTxLog`](../interfaces/liquality_near.NearTypes.NearTxLog.md)\>\>

#### Defined in

[near/lib/swap/NearSwapProvider.ts:111](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/swap/NearSwapProvider.ts#L111)

___

### findClaimSwapTransaction

▸ **findClaimSwapTransaction**(`swapParams`, `initTxHash`): `Promise`<`Transaction`<[`NearTxLog`](../interfaces/liquality_near.NearTypes.NearTxLog.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `initTxHash` | `string` |

#### Returns

`Promise`<`Transaction`<[`NearTxLog`](../interfaces/liquality_near.NearTypes.NearTxLog.md)\>\>

#### Overrides

Swap.findClaimSwapTransaction

#### Defined in

[near/lib/swap/NearSwapProvider.ts:48](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/swap/NearSwapProvider.ts#L48)

___

### findInitiateSwapTransaction

▸ **findInitiateSwapTransaction**(`swapParams`, `_blockNumber?`): `Promise`<`Transaction`<[`NearTxLog`](../interfaces/liquality_near.NearTypes.NearTxLog.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `_blockNumber?` | `number` |

#### Returns

`Promise`<`Transaction`<[`NearTxLog`](../interfaces/liquality_near.NearTypes.NearTxLog.md)\>\>

#### Overrides

Swap.findInitiateSwapTransaction

#### Defined in

[near/lib/swap/NearSwapProvider.ts:28](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/swap/NearSwapProvider.ts#L28)

___

### findRefundSwapTransaction

▸ **findRefundSwapTransaction**(`swapParams`, `initTxHash`): `Promise`<`Transaction`<[`NearTxLog`](../interfaces/liquality_near.NearTypes.NearTxLog.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `initTxHash` | `string` |

#### Returns

`Promise`<`Transaction`<[`NearTxLog`](../interfaces/liquality_near.NearTypes.NearTxLog.md)\>\>

#### Overrides

Swap.findRefundSwapTransaction

#### Defined in

[near/lib/swap/NearSwapProvider.ts:76](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/swap/NearSwapProvider.ts#L76)

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

### generateUniqueString

▸ `Private` **generateUniqueString**(`name`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`string`

#### Defined in

[near/lib/swap/NearSwapProvider.ts:107](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/swap/NearSwapProvider.ts#L107)

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

[near/lib/swap/NearSwapProvider.ts:86](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/swap/NearSwapProvider.ts#L86)

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

▸ **initiateSwap**(`swapParams`): `Promise`<`Transaction`<[`NearTxLog`](../interfaces/liquality_near.NearTypes.NearTxLog.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |

#### Returns

`Promise`<`Transaction`<[`NearTxLog`](../interfaces/liquality_near.NearTypes.NearTxLog.md)\>\>

#### Overrides

Swap.initiateSwap

#### Defined in

[near/lib/swap/NearSwapProvider.ts:19](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/swap/NearSwapProvider.ts#L19)

___

### refundSwap

▸ **refundSwap**(`swapParams`, `initTxHash`): `Promise`<`Transaction`<[`NearTxLog`](../interfaces/liquality_near.NearTypes.NearTxLog.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `initTxHash` | `string` |

#### Returns

`Promise`<`Transaction`<[`NearTxLog`](../interfaces/liquality_near.NearTypes.NearTxLog.md)\>\>

#### Overrides

Swap.refundSwap

#### Defined in

[near/lib/swap/NearSwapProvider.ts:65](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/swap/NearSwapProvider.ts#L65)

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

[near/lib/swap/NearSwapProvider.ts:151](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/swap/NearSwapProvider.ts#L151)

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
