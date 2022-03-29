[](../README.md) / [Exports](../modules.md) / [@liquality/terra](../modules/liquality_terra.md) / TerraSwapProvider

# Class: TerraSwapProvider

[@liquality/terra](../modules/liquality_terra.md).TerraSwapProvider

## Hierarchy

- [`TerraSwapBaseProvider`](liquality_terra.TerraSwapBaseProvider.md)

  ↳ **`TerraSwapProvider`**

## Table of contents

### Constructors

- [constructor](liquality_terra.TerraSwapProvider.md#constructor)

### Properties

- [\_httpClient](liquality_terra.TerraSwapProvider.md#_httpclient)
- [walletProvider](liquality_terra.TerraSwapProvider.md#walletprovider)

### Methods

- [canUpdateFee](liquality_terra.TerraSwapProvider.md#canupdatefee)
- [claimSwap](liquality_terra.TerraSwapProvider.md#claimswap)
- [doesTransactionMatchInitiation](liquality_terra.TerraSwapProvider.md#doestransactionmatchinitiation)
- [findAddressTransaction](liquality_terra.TerraSwapProvider.md#findaddresstransaction)
- [findClaimSwapTransaction](liquality_terra.TerraSwapProvider.md#findclaimswaptransaction)
- [findInitiateSwapTransaction](liquality_terra.TerraSwapProvider.md#findinitiateswaptransaction)
- [findRefundSwapTransaction](liquality_terra.TerraSwapProvider.md#findrefundswaptransaction)
- [generateSecret](liquality_terra.TerraSwapProvider.md#generatesecret)
- [getSwapSecret](liquality_terra.TerraSwapProvider.md#getswapsecret)
- [getWallet](liquality_terra.TerraSwapProvider.md#getwallet)
- [initiateSwap](liquality_terra.TerraSwapProvider.md#initiateswap)
- [parseScraperTransaction](liquality_terra.TerraSwapProvider.md#parsescrapertransaction)
- [refundSwap](liquality_terra.TerraSwapProvider.md#refundswap)
- [setWallet](liquality_terra.TerraSwapProvider.md#setwallet)
- [updateTransactionFee](liquality_terra.TerraSwapProvider.md#updatetransactionfee)
- [validateSwapParams](liquality_terra.TerraSwapProvider.md#validateswapparams)
- [verifyInitiateSwapTransaction](liquality_terra.TerraSwapProvider.md#verifyinitiateswaptransaction)

## Constructors

### constructor

• **new TerraSwapProvider**(`walletProvider`, `helperUrl`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `walletProvider` | [`TerraWalletProvider`](liquality_terra.TerraWalletProvider.md) |
| `helperUrl` | `string` |

#### Overrides

[TerraSwapBaseProvider](liquality_terra.TerraSwapBaseProvider.md).[constructor](liquality_terra.TerraSwapBaseProvider.md#constructor)

#### Defined in

[terra/lib/swap/TerraSwapProvider.ts:19](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/swap/TerraSwapProvider.ts#L19)

## Properties

### \_httpClient

• `Private` **\_httpClient**: `default`

#### Defined in

[terra/lib/swap/TerraSwapProvider.ts:17](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/swap/TerraSwapProvider.ts#L17)

___

### walletProvider

• `Protected` **walletProvider**: [`TerraWalletProvider`](liquality_terra.TerraWalletProvider.md)

#### Inherited from

[TerraSwapBaseProvider](liquality_terra.TerraSwapBaseProvider.md).[walletProvider](liquality_terra.TerraSwapBaseProvider.md#walletprovider)

#### Defined in

client/dist/lib/Swap.d.ts:4

## Methods

### canUpdateFee

▸ **canUpdateFee**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[TerraSwapBaseProvider](liquality_terra.TerraSwapBaseProvider.md).[canUpdateFee](liquality_terra.TerraSwapBaseProvider.md#canupdatefee)

#### Defined in

[terra/lib/swap/TerraSwapBaseProvider.ts:87](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/swap/TerraSwapBaseProvider.ts#L87)

___

### claimSwap

▸ **claimSwap**(`swapParams`, `initiationTxHash`, `secret`, `fee?`): `Promise`<`Transaction`<[`TerraTxInfo`](../interfaces/liquality_terra.TerraTypes.TerraTxInfo.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `initiationTxHash` | `string` |
| `secret` | `string` |
| `fee?` | `FeeType` |

#### Returns

`Promise`<`Transaction`<[`TerraTxInfo`](../interfaces/liquality_terra.TerraTypes.TerraTxInfo.md)\>\>

#### Inherited from

[TerraSwapBaseProvider](liquality_terra.TerraSwapBaseProvider.md).[claimSwap](liquality_terra.TerraSwapBaseProvider.md#claimswap)

#### Defined in

[terra/lib/swap/TerraSwapBaseProvider.ts:42](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/swap/TerraSwapBaseProvider.ts#L42)

___

### doesTransactionMatchInitiation

▸ `Protected` **doesTransactionMatchInitiation**(`swapParams`, `initTx`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `initTx` | `Transaction`<[`TerraTxInfo`](../interfaces/liquality_terra.TerraTypes.TerraTxInfo.md)\> |

#### Returns

`Promise`<`boolean`\>

#### Inherited from

[TerraSwapBaseProvider](liquality_terra.TerraSwapBaseProvider.md).[doesTransactionMatchInitiation](liquality_terra.TerraSwapBaseProvider.md#doestransactionmatchinitiation)

#### Defined in

[terra/lib/swap/TerraSwapBaseProvider.ts:73](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/swap/TerraSwapBaseProvider.ts#L73)

___

### findAddressTransaction

▸ `Private` **findAddressTransaction**(`address`, `predicate`, `limit?`): `Promise`<`Transaction`<[`TerraTxInfo`](../interfaces/liquality_terra.TerraTypes.TerraTxInfo.md)\>\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `address` | `string` | `undefined` |
| `predicate` | (`tx`: `Transaction`<[`TerraTxInfo`](../interfaces/liquality_terra.TerraTypes.TerraTxInfo.md)\>) => `Promise`<`boolean`\> | `undefined` |
| `limit` | `number` | `100` |

#### Returns

`Promise`<`Transaction`<[`TerraTxInfo`](../interfaces/liquality_terra.TerraTypes.TerraTxInfo.md)\>\>

#### Defined in

[terra/lib/swap/TerraSwapProvider.ts:56](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/swap/TerraSwapProvider.ts#L56)

___

### findClaimSwapTransaction

▸ **findClaimSwapTransaction**(`swapParams`, `initTxHash`): `Promise`<`Transaction`<[`TerraTxInfo`](../interfaces/liquality_terra.TerraTypes.TerraTxInfo.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `initTxHash` | `string` |

#### Returns

`Promise`<`Transaction`<[`TerraTxInfo`](../interfaces/liquality_terra.TerraTypes.TerraTxInfo.md)\>\>

#### Overrides

[TerraSwapBaseProvider](liquality_terra.TerraSwapBaseProvider.md).[findClaimSwapTransaction](liquality_terra.TerraSwapBaseProvider.md#findclaimswaptransaction)

#### Defined in

[terra/lib/swap/TerraSwapProvider.ts:33](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/swap/TerraSwapProvider.ts#L33)

___

### findInitiateSwapTransaction

▸ **findInitiateSwapTransaction**(`swapParams`): `Promise`<`Transaction`<[`TerraTxInfo`](../interfaces/liquality_terra.TerraTypes.TerraTxInfo.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |

#### Returns

`Promise`<`Transaction`<[`TerraTxInfo`](../interfaces/liquality_terra.TerraTypes.TerraTxInfo.md)\>\>

#### Overrides

[TerraSwapBaseProvider](liquality_terra.TerraSwapBaseProvider.md).[findInitiateSwapTransaction](liquality_terra.TerraSwapBaseProvider.md#findinitiateswaptransaction)

#### Defined in

[terra/lib/swap/TerraSwapProvider.ts:24](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/swap/TerraSwapProvider.ts#L24)

___

### findRefundSwapTransaction

▸ **findRefundSwapTransaction**(`swapParams`, `initTxHash`): `Promise`<`Transaction`<[`TerraTxInfo`](../interfaces/liquality_terra.TerraTypes.TerraTxInfo.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `initTxHash` | `string` |

#### Returns

`Promise`<`Transaction`<[`TerraTxInfo`](../interfaces/liquality_terra.TerraTypes.TerraTxInfo.md)\>\>

#### Overrides

[TerraSwapBaseProvider](liquality_terra.TerraSwapBaseProvider.md).[findRefundSwapTransaction](liquality_terra.TerraSwapBaseProvider.md#findrefundswaptransaction)

#### Defined in

[terra/lib/swap/TerraSwapProvider.ts:45](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/swap/TerraSwapProvider.ts#L45)

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

[TerraSwapBaseProvider](liquality_terra.TerraSwapBaseProvider.md).[generateSecret](liquality_terra.TerraSwapBaseProvider.md#generatesecret)

#### Defined in

client/dist/lib/Swap.d.ts:10

___

### getSwapSecret

▸ **getSwapSecret**(`claimTxHash`, `_initTxHash?`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `claimTxHash` | `string` |
| `_initTxHash?` | `string` |

#### Returns

`Promise`<`string`\>

#### Inherited from

[TerraSwapBaseProvider](liquality_terra.TerraSwapBaseProvider.md).[getSwapSecret](liquality_terra.TerraSwapBaseProvider.md#getswapsecret)

#### Defined in

[terra/lib/swap/TerraSwapBaseProvider.ts:68](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/swap/TerraSwapBaseProvider.ts#L68)

___

### getWallet

▸ **getWallet**(): [`TerraWalletProvider`](liquality_terra.TerraWalletProvider.md)

#### Returns

[`TerraWalletProvider`](liquality_terra.TerraWalletProvider.md)

#### Inherited from

[TerraSwapBaseProvider](liquality_terra.TerraSwapBaseProvider.md).[getWallet](liquality_terra.TerraSwapBaseProvider.md#getwallet)

#### Defined in

client/dist/lib/Swap.d.ts:7

___

### initiateSwap

▸ **initiateSwap**(`swapParams`, `fee?`): `Promise`<`Transaction`<[`TerraTxInfo`](../interfaces/liquality_terra.TerraTypes.TerraTxInfo.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `fee?` | `FeeType` |

#### Returns

`Promise`<`Transaction`<[`TerraTxInfo`](../interfaces/liquality_terra.TerraTypes.TerraTxInfo.md)\>\>

#### Inherited from

[TerraSwapBaseProvider](liquality_terra.TerraSwapBaseProvider.md).[initiateSwap](liquality_terra.TerraSwapBaseProvider.md#initiateswap)

#### Defined in

[terra/lib/swap/TerraSwapBaseProvider.ts:11](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/swap/TerraSwapBaseProvider.ts#L11)

___

### parseScraperTransaction

▸ `Private` **parseScraperTransaction**(`data`, `currentBlockNumber`): `Promise`<`Transaction`<[`TerraTxInfo`](../interfaces/liquality_terra.TerraTypes.TerraTxInfo.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`LcdTransaction`](../interfaces/liquality_terra.TerraTypes.FCD.LcdTransaction.md) |
| `currentBlockNumber` | `number` |

#### Returns

`Promise`<`Transaction`<[`TerraTxInfo`](../interfaces/liquality_terra.TerraTypes.TerraTxInfo.md)\>\>

#### Defined in

[terra/lib/swap/TerraSwapProvider.ts:85](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/swap/TerraSwapProvider.ts#L85)

___

### refundSwap

▸ **refundSwap**(`swapParams`, `initTx`, `fee?`): `Promise`<`Transaction`<[`TerraTxInfo`](../interfaces/liquality_terra.TerraTypes.TerraTxInfo.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `initTx` | `string` |
| `fee?` | `FeeType` |

#### Returns

`Promise`<`Transaction`<[`TerraTxInfo`](../interfaces/liquality_terra.TerraTypes.TerraTxInfo.md)\>\>

#### Inherited from

[TerraSwapBaseProvider](liquality_terra.TerraSwapBaseProvider.md).[refundSwap](liquality_terra.TerraSwapBaseProvider.md#refundswap)

#### Defined in

[terra/lib/swap/TerraSwapBaseProvider.ts:59](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/swap/TerraSwapBaseProvider.ts#L59)

___

### setWallet

▸ **setWallet**(`wallet`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `wallet` | [`TerraWalletProvider`](liquality_terra.TerraWalletProvider.md) |

#### Returns

`void`

#### Inherited from

[TerraSwapBaseProvider](liquality_terra.TerraSwapBaseProvider.md).[setWallet](liquality_terra.TerraSwapBaseProvider.md#setwallet)

#### Defined in

client/dist/lib/Swap.d.ts:6

___

### updateTransactionFee

▸ **updateTransactionFee**(`_tx`, `_newFee`): `Promise`<`Transaction`<[`TerraTxInfo`](../interfaces/liquality_terra.TerraTypes.TerraTxInfo.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_tx` | `string` \| `Transaction`<[`TerraTxInfo`](../interfaces/liquality_terra.TerraTypes.TerraTxInfo.md)\> |
| `_newFee` | `FeeType` |

#### Returns

`Promise`<`Transaction`<[`TerraTxInfo`](../interfaces/liquality_terra.TerraTypes.TerraTxInfo.md)\>\>

#### Inherited from

[TerraSwapBaseProvider](liquality_terra.TerraSwapBaseProvider.md).[updateTransactionFee](liquality_terra.TerraSwapBaseProvider.md#updatetransactionfee)

#### Defined in

[terra/lib/swap/TerraSwapBaseProvider.ts:91](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/swap/TerraSwapBaseProvider.ts#L91)

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

[TerraSwapBaseProvider](liquality_terra.TerraSwapBaseProvider.md).[validateSwapParams](liquality_terra.TerraSwapBaseProvider.md#validateswapparams)

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

[TerraSwapBaseProvider](liquality_terra.TerraSwapBaseProvider.md).[verifyInitiateSwapTransaction](liquality_terra.TerraSwapBaseProvider.md#verifyinitiateswaptransaction)

#### Defined in

client/dist/lib/Swap.d.ts:8
