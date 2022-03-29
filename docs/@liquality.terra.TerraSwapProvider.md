# Class: TerraSwapProvider

[@liquality/terra](../wiki/@liquality.terra).TerraSwapProvider

## Hierarchy

- [`TerraSwapBaseProvider`](../wiki/@liquality.terra.TerraSwapBaseProvider)

  ↳ **`TerraSwapProvider`**

## Table of contents

### Constructors

- [constructor](../wiki/@liquality.terra.TerraSwapProvider#constructor)

### Properties

- [walletProvider](../wiki/@liquality.terra.TerraSwapProvider#walletprovider)

### Methods

- [canUpdateFee](../wiki/@liquality.terra.TerraSwapProvider#canupdatefee)
- [claimSwap](../wiki/@liquality.terra.TerraSwapProvider#claimswap)
- [doesTransactionMatchInitiation](../wiki/@liquality.terra.TerraSwapProvider#doestransactionmatchinitiation)
- [findClaimSwapTransaction](../wiki/@liquality.terra.TerraSwapProvider#findclaimswaptransaction)
- [findInitiateSwapTransaction](../wiki/@liquality.terra.TerraSwapProvider#findinitiateswaptransaction)
- [findRefundSwapTransaction](../wiki/@liquality.terra.TerraSwapProvider#findrefundswaptransaction)
- [generateSecret](../wiki/@liquality.terra.TerraSwapProvider#generatesecret)
- [getSwapSecret](../wiki/@liquality.terra.TerraSwapProvider#getswapsecret)
- [getWallet](../wiki/@liquality.terra.TerraSwapProvider#getwallet)
- [initiateSwap](../wiki/@liquality.terra.TerraSwapProvider#initiateswap)
- [refundSwap](../wiki/@liquality.terra.TerraSwapProvider#refundswap)
- [setWallet](../wiki/@liquality.terra.TerraSwapProvider#setwallet)
- [updateTransactionFee](../wiki/@liquality.terra.TerraSwapProvider#updatetransactionfee)
- [validateSwapParams](../wiki/@liquality.terra.TerraSwapProvider#validateswapparams)
- [verifyInitiateSwapTransaction](../wiki/@liquality.terra.TerraSwapProvider#verifyinitiateswaptransaction)

## Constructors

### constructor

• **new TerraSwapProvider**(`walletProvider`, `helperUrl`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `walletProvider` | [`TerraWalletProvider`](../wiki/@liquality.terra.TerraWalletProvider) |
| `helperUrl` | `string` |

#### Overrides

[TerraSwapBaseProvider](../wiki/@liquality.terra.TerraSwapBaseProvider).[constructor](../wiki/@liquality.terra.TerraSwapBaseProvider#constructor)

#### Defined in

[terra/lib/swap/TerraSwapProvider.ts:19](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/terra/lib/swap/TerraSwapProvider.ts#L19)

## Properties

### walletProvider

• `Protected` **walletProvider**: [`TerraWalletProvider`](../wiki/@liquality.terra.TerraWalletProvider)

#### Inherited from

[TerraSwapBaseProvider](../wiki/@liquality.terra.TerraSwapBaseProvider).[walletProvider](../wiki/@liquality.terra.TerraSwapBaseProvider#walletprovider)

#### Defined in

client/dist/lib/Swap.d.ts:4

## Methods

### canUpdateFee

▸ **canUpdateFee**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[TerraSwapBaseProvider](../wiki/@liquality.terra.TerraSwapBaseProvider).[canUpdateFee](../wiki/@liquality.terra.TerraSwapBaseProvider#canupdatefee)

#### Defined in

[terra/lib/swap/TerraSwapBaseProvider.ts:87](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/terra/lib/swap/TerraSwapBaseProvider.ts#L87)

___

### claimSwap

▸ **claimSwap**(`swapParams`, `initiationTxHash`, `secret`, `fee?`): `Promise`<`Transaction`<[`TerraTxInfo`](../wiki/@liquality.terra.TerraTypes.TerraTxInfo)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `initiationTxHash` | `string` |
| `secret` | `string` |
| `fee?` | `FeeType` |

#### Returns

`Promise`<`Transaction`<[`TerraTxInfo`](../wiki/@liquality.terra.TerraTypes.TerraTxInfo)\>\>

#### Inherited from

[TerraSwapBaseProvider](../wiki/@liquality.terra.TerraSwapBaseProvider).[claimSwap](../wiki/@liquality.terra.TerraSwapBaseProvider#claimswap)

#### Defined in

[terra/lib/swap/TerraSwapBaseProvider.ts:42](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/terra/lib/swap/TerraSwapBaseProvider.ts#L42)

___

### doesTransactionMatchInitiation

▸ `Protected` **doesTransactionMatchInitiation**(`swapParams`, `initTx`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `initTx` | `Transaction`<[`TerraTxInfo`](../wiki/@liquality.terra.TerraTypes.TerraTxInfo)\> |

#### Returns

`Promise`<`boolean`\>

#### Inherited from

[TerraSwapBaseProvider](../wiki/@liquality.terra.TerraSwapBaseProvider).[doesTransactionMatchInitiation](../wiki/@liquality.terra.TerraSwapBaseProvider#doestransactionmatchinitiation)

#### Defined in

[terra/lib/swap/TerraSwapBaseProvider.ts:73](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/terra/lib/swap/TerraSwapBaseProvider.ts#L73)

___

### findClaimSwapTransaction

▸ **findClaimSwapTransaction**(`swapParams`, `initTxHash`): `Promise`<`Transaction`<[`TerraTxInfo`](../wiki/@liquality.terra.TerraTypes.TerraTxInfo)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `initTxHash` | `string` |

#### Returns

`Promise`<`Transaction`<[`TerraTxInfo`](../wiki/@liquality.terra.TerraTypes.TerraTxInfo)\>\>

#### Overrides

[TerraSwapBaseProvider](../wiki/@liquality.terra.TerraSwapBaseProvider).[findClaimSwapTransaction](../wiki/@liquality.terra.TerraSwapBaseProvider#findclaimswaptransaction)

#### Defined in

[terra/lib/swap/TerraSwapProvider.ts:33](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/terra/lib/swap/TerraSwapProvider.ts#L33)

___

### findInitiateSwapTransaction

▸ **findInitiateSwapTransaction**(`swapParams`): `Promise`<`Transaction`<[`TerraTxInfo`](../wiki/@liquality.terra.TerraTypes.TerraTxInfo)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |

#### Returns

`Promise`<`Transaction`<[`TerraTxInfo`](../wiki/@liquality.terra.TerraTypes.TerraTxInfo)\>\>

#### Overrides

[TerraSwapBaseProvider](../wiki/@liquality.terra.TerraSwapBaseProvider).[findInitiateSwapTransaction](../wiki/@liquality.terra.TerraSwapBaseProvider#findinitiateswaptransaction)

#### Defined in

[terra/lib/swap/TerraSwapProvider.ts:24](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/terra/lib/swap/TerraSwapProvider.ts#L24)

___

### findRefundSwapTransaction

▸ **findRefundSwapTransaction**(`swapParams`, `initTxHash`): `Promise`<`Transaction`<[`TerraTxInfo`](../wiki/@liquality.terra.TerraTypes.TerraTxInfo)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `initTxHash` | `string` |

#### Returns

`Promise`<`Transaction`<[`TerraTxInfo`](../wiki/@liquality.terra.TerraTypes.TerraTxInfo)\>\>

#### Overrides

[TerraSwapBaseProvider](../wiki/@liquality.terra.TerraSwapBaseProvider).[findRefundSwapTransaction](../wiki/@liquality.terra.TerraSwapBaseProvider#findrefundswaptransaction)

#### Defined in

[terra/lib/swap/TerraSwapProvider.ts:45](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/terra/lib/swap/TerraSwapProvider.ts#L45)

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

[TerraSwapBaseProvider](../wiki/@liquality.terra.TerraSwapBaseProvider).[generateSecret](../wiki/@liquality.terra.TerraSwapBaseProvider#generatesecret)

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

[TerraSwapBaseProvider](../wiki/@liquality.terra.TerraSwapBaseProvider).[getSwapSecret](../wiki/@liquality.terra.TerraSwapBaseProvider#getswapsecret)

#### Defined in

[terra/lib/swap/TerraSwapBaseProvider.ts:68](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/terra/lib/swap/TerraSwapBaseProvider.ts#L68)

___

### getWallet

▸ **getWallet**(): [`TerraWalletProvider`](../wiki/@liquality.terra.TerraWalletProvider)

#### Returns

[`TerraWalletProvider`](../wiki/@liquality.terra.TerraWalletProvider)

#### Inherited from

[TerraSwapBaseProvider](../wiki/@liquality.terra.TerraSwapBaseProvider).[getWallet](../wiki/@liquality.terra.TerraSwapBaseProvider#getwallet)

#### Defined in

client/dist/lib/Swap.d.ts:7

___

### initiateSwap

▸ **initiateSwap**(`swapParams`, `fee?`): `Promise`<`Transaction`<[`TerraTxInfo`](../wiki/@liquality.terra.TerraTypes.TerraTxInfo)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `fee?` | `FeeType` |

#### Returns

`Promise`<`Transaction`<[`TerraTxInfo`](../wiki/@liquality.terra.TerraTypes.TerraTxInfo)\>\>

#### Inherited from

[TerraSwapBaseProvider](../wiki/@liquality.terra.TerraSwapBaseProvider).[initiateSwap](../wiki/@liquality.terra.TerraSwapBaseProvider#initiateswap)

#### Defined in

[terra/lib/swap/TerraSwapBaseProvider.ts:11](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/terra/lib/swap/TerraSwapBaseProvider.ts#L11)

___

### refundSwap

▸ **refundSwap**(`swapParams`, `initTx`, `fee?`): `Promise`<`Transaction`<[`TerraTxInfo`](../wiki/@liquality.terra.TerraTypes.TerraTxInfo)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `initTx` | `string` |
| `fee?` | `FeeType` |

#### Returns

`Promise`<`Transaction`<[`TerraTxInfo`](../wiki/@liquality.terra.TerraTypes.TerraTxInfo)\>\>

#### Inherited from

[TerraSwapBaseProvider](../wiki/@liquality.terra.TerraSwapBaseProvider).[refundSwap](../wiki/@liquality.terra.TerraSwapBaseProvider#refundswap)

#### Defined in

[terra/lib/swap/TerraSwapBaseProvider.ts:59](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/terra/lib/swap/TerraSwapBaseProvider.ts#L59)

___

### setWallet

▸ **setWallet**(`wallet`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `wallet` | [`TerraWalletProvider`](../wiki/@liquality.terra.TerraWalletProvider) |

#### Returns

`void`

#### Inherited from

[TerraSwapBaseProvider](../wiki/@liquality.terra.TerraSwapBaseProvider).[setWallet](../wiki/@liquality.terra.TerraSwapBaseProvider#setwallet)

#### Defined in

client/dist/lib/Swap.d.ts:6

___

### updateTransactionFee

▸ **updateTransactionFee**(`_tx`, `_newFee`): `Promise`<`Transaction`<[`TerraTxInfo`](../wiki/@liquality.terra.TerraTypes.TerraTxInfo)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_tx` | `string` \| `Transaction`<[`TerraTxInfo`](../wiki/@liquality.terra.TerraTypes.TerraTxInfo)\> |
| `_newFee` | `FeeType` |

#### Returns

`Promise`<`Transaction`<[`TerraTxInfo`](../wiki/@liquality.terra.TerraTypes.TerraTxInfo)\>\>

#### Inherited from

[TerraSwapBaseProvider](../wiki/@liquality.terra.TerraSwapBaseProvider).[updateTransactionFee](../wiki/@liquality.terra.TerraSwapBaseProvider#updatetransactionfee)

#### Defined in

[terra/lib/swap/TerraSwapBaseProvider.ts:91](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/terra/lib/swap/TerraSwapBaseProvider.ts#L91)

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

[TerraSwapBaseProvider](../wiki/@liquality.terra.TerraSwapBaseProvider).[validateSwapParams](../wiki/@liquality.terra.TerraSwapBaseProvider#validateswapparams)

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

[TerraSwapBaseProvider](../wiki/@liquality.terra.TerraSwapBaseProvider).[verifyInitiateSwapTransaction](../wiki/@liquality.terra.TerraSwapBaseProvider#verifyinitiateswaptransaction)

#### Defined in

client/dist/lib/Swap.d.ts:8
