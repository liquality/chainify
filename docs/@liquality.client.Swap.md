# Class: Swap<T, S, WalletProvider\>

[@liquality/client](../wiki/@liquality.client).Swap

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `S` | `S` |
| `WalletProvider` | extends [`Wallet`](../wiki/@liquality.client.Wallet)<`T`, `S`\> = `any` |

## Implements

- `SwapProvider`

## Table of contents

### Constructors

- [constructor](../wiki/@liquality.client.Swap#constructor)

### Properties

- [walletProvider](../wiki/@liquality.client.Swap#walletprovider)

### Methods

- [canUpdateFee](../wiki/@liquality.client.Swap#canupdatefee)
- [claimSwap](../wiki/@liquality.client.Swap#claimswap)
- [doesTransactionMatchInitiation](../wiki/@liquality.client.Swap#doestransactionmatchinitiation)
- [findClaimSwapTransaction](../wiki/@liquality.client.Swap#findclaimswaptransaction)
- [findInitiateSwapTransaction](../wiki/@liquality.client.Swap#findinitiateswaptransaction)
- [findRefundSwapTransaction](../wiki/@liquality.client.Swap#findrefundswaptransaction)
- [generateSecret](../wiki/@liquality.client.Swap#generatesecret)
- [getSwapSecret](../wiki/@liquality.client.Swap#getswapsecret)
- [getWallet](../wiki/@liquality.client.Swap#getwallet)
- [initiateSwap](../wiki/@liquality.client.Swap#initiateswap)
- [refundSwap](../wiki/@liquality.client.Swap#refundswap)
- [setWallet](../wiki/@liquality.client.Swap#setwallet)
- [updateTransactionFee](../wiki/@liquality.client.Swap#updatetransactionfee)
- [validateSwapParams](../wiki/@liquality.client.Swap#validateswapparams)
- [verifyInitiateSwapTransaction](../wiki/@liquality.client.Swap#verifyinitiateswaptransaction)

## Constructors

### constructor

• **new Swap**<`T`, `S`, `WalletProvider`\>(`walletProvider?`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `S` | `S` |
| `WalletProvider` | extends [`Wallet`](../wiki/@liquality.client.Wallet)<`T`, `S`, `WalletProvider`\> = `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `walletProvider?` | `WalletProvider` |

#### Defined in

[client/lib/Swap.ts:9](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/client/lib/Swap.ts#L9)

## Properties

### walletProvider

• `Protected` **walletProvider**: `WalletProvider`

#### Defined in

[client/lib/Swap.ts:7](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/client/lib/Swap.ts#L7)

## Methods

### canUpdateFee

▸ `Abstract` **canUpdateFee**(): `boolean`

#### Returns

`boolean`

#### Defined in

[client/lib/Swap.ts:70](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/client/lib/Swap.ts#L70)

___

### claimSwap

▸ `Abstract` **claimSwap**(`swapParams`, `initTx`, `secret`, `fee?`): `Promise`<`Transaction`<`any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `initTx` | `string` |
| `secret` | `string` |
| `fee?` | `FeeType` |

#### Returns

`Promise`<`Transaction`<`any`\>\>

#### Implementation of

SwapProvider.claimSwap

#### Defined in

[client/lib/Swap.ts:62](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/client/lib/Swap.ts#L62)

___

### doesTransactionMatchInitiation

▸ `Protected` `Abstract` **doesTransactionMatchInitiation**(`swapParams`, `transaction`): `boolean` \| `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `transaction` | `Transaction`<`any`\> |

#### Returns

`boolean` \| `Promise`<`boolean`\>

#### Defined in

[client/lib/Swap.ts:73](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/client/lib/Swap.ts#L73)

___

### findClaimSwapTransaction

▸ `Abstract` **findClaimSwapTransaction**(`swapParams`, `initTxHash`, `blockNumber?`): `Promise`<`Transaction`<`any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `initTxHash` | `string` |
| `blockNumber?` | `number` |

#### Returns

`Promise`<`Transaction`<`any`\>\>

#### Implementation of

SwapProvider.findClaimSwapTransaction

#### Defined in

[client/lib/Swap.ts:63](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/client/lib/Swap.ts#L63)

___

### findInitiateSwapTransaction

▸ `Abstract` **findInitiateSwapTransaction**(`swapParams`, `_blockNumber?`): `Promise`<`Transaction`<`any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `_blockNumber?` | `number` |

#### Returns

`Promise`<`Transaction`<`any`\>\>

#### Implementation of

SwapProvider.findInitiateSwapTransaction

#### Defined in

[client/lib/Swap.ts:60](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/client/lib/Swap.ts#L60)

___

### findRefundSwapTransaction

▸ `Abstract` **findRefundSwapTransaction**(`swapParams`, `initiationTxHash`, `blockNumber?`): `Promise`<`Transaction`<`any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `initiationTxHash` | `string` |
| `blockNumber?` | `number` |

#### Returns

`Promise`<`Transaction`<`any`\>\>

#### Implementation of

SwapProvider.findRefundSwapTransaction

#### Defined in

[client/lib/Swap.ts:66](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/client/lib/Swap.ts#L66)

___

### generateSecret

▸ **generateSecret**(`message`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |

#### Returns

`Promise`<`string`\>

#### Implementation of

SwapProvider.generateSecret

#### Defined in

[client/lib/Swap.ts:52](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/client/lib/Swap.ts#L52)

___

### getSwapSecret

▸ `Abstract` **getSwapSecret**(`claimTxHash`, `initTxHash?`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `claimTxHash` | `string` |
| `initTxHash?` | `string` |

#### Returns

`Promise`<`string`\>

#### Implementation of

SwapProvider.getSwapSecret

#### Defined in

[client/lib/Swap.ts:68](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/client/lib/Swap.ts#L68)

___

### getWallet

▸ **getWallet**(): `WalletProvider`

#### Returns

`WalletProvider`

#### Defined in

[client/lib/Swap.ts:17](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/client/lib/Swap.ts#L17)

___

### initiateSwap

▸ `Abstract` **initiateSwap**(`swapParams`, `fee?`): `Promise`<`Transaction`<`any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `fee?` | `FeeType` |

#### Returns

`Promise`<`Transaction`<`any`\>\>

#### Implementation of

SwapProvider.initiateSwap

#### Defined in

[client/lib/Swap.ts:59](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/client/lib/Swap.ts#L59)

___

### refundSwap

▸ `Abstract` **refundSwap**(`swapParams`, `initTx`, `fee?`): `Promise`<`Transaction`<`any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `initTx` | `string` |
| `fee?` | `FeeType` |

#### Returns

`Promise`<`Transaction`<`any`\>\>

#### Implementation of

SwapProvider.refundSwap

#### Defined in

[client/lib/Swap.ts:65](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/client/lib/Swap.ts#L65)

___

### setWallet

▸ **setWallet**(`wallet`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `wallet` | `WalletProvider` |

#### Returns

`void`

#### Defined in

[client/lib/Swap.ts:13](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/client/lib/Swap.ts#L13)

___

### updateTransactionFee

▸ `Abstract` **updateTransactionFee**(`tx`, `newFee`): `Promise`<`Transaction`<`any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | `string` \| `Transaction`<`any`\> |
| `newFee` | `FeeType` |

#### Returns

`Promise`<`Transaction`<`any`\>\>

#### Defined in

[client/lib/Swap.ts:71](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/client/lib/Swap.ts#L71)

___

### validateSwapParams

▸ **validateSwapParams**(`swapParams`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |

#### Returns

`void`

#### Defined in

[client/lib/Swap.ts:46](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/client/lib/Swap.ts#L46)

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

#### Implementation of

SwapProvider.verifyInitiateSwapTransaction

#### Defined in

[client/lib/Swap.ts:21](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/client/lib/Swap.ts#L21)
