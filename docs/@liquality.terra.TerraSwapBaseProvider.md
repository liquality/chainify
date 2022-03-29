# Class: TerraSwapBaseProvider

[@liquality/terra](../wiki/@liquality.terra).TerraSwapBaseProvider

## Hierarchy

- `default`<`LCDClient`, `MnemonicKey`, [`TerraWalletProvider`](../wiki/@liquality.terra.TerraWalletProvider)\>

  ↳ **`TerraSwapBaseProvider`**

  ↳↳ [`TerraSwapProvider`](../wiki/@liquality.terra.TerraSwapProvider)

## Table of contents

### Constructors

- [constructor](../wiki/@liquality.terra.TerraSwapBaseProvider#constructor)

### Properties

- [walletProvider](../wiki/@liquality.terra.TerraSwapBaseProvider#walletprovider)

### Methods

- [canUpdateFee](../wiki/@liquality.terra.TerraSwapBaseProvider#canupdatefee)
- [claimSwap](../wiki/@liquality.terra.TerraSwapBaseProvider#claimswap)
- [doesTransactionMatchInitiation](../wiki/@liquality.terra.TerraSwapBaseProvider#doestransactionmatchinitiation)
- [findClaimSwapTransaction](../wiki/@liquality.terra.TerraSwapBaseProvider#findclaimswaptransaction)
- [findInitiateSwapTransaction](../wiki/@liquality.terra.TerraSwapBaseProvider#findinitiateswaptransaction)
- [findRefundSwapTransaction](../wiki/@liquality.terra.TerraSwapBaseProvider#findrefundswaptransaction)
- [generateSecret](../wiki/@liquality.terra.TerraSwapBaseProvider#generatesecret)
- [getSwapSecret](../wiki/@liquality.terra.TerraSwapBaseProvider#getswapsecret)
- [getWallet](../wiki/@liquality.terra.TerraSwapBaseProvider#getwallet)
- [initiateSwap](../wiki/@liquality.terra.TerraSwapBaseProvider#initiateswap)
- [refundSwap](../wiki/@liquality.terra.TerraSwapBaseProvider#refundswap)
- [setWallet](../wiki/@liquality.terra.TerraSwapBaseProvider#setwallet)
- [updateTransactionFee](../wiki/@liquality.terra.TerraSwapBaseProvider#updatetransactionfee)
- [validateSwapParams](../wiki/@liquality.terra.TerraSwapBaseProvider#validateswapparams)
- [verifyInitiateSwapTransaction](../wiki/@liquality.terra.TerraSwapBaseProvider#verifyinitiateswaptransaction)

## Constructors

### constructor

• **new TerraSwapBaseProvider**(`walletProvider?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `walletProvider?` | [`TerraWalletProvider`](../wiki/@liquality.terra.TerraWalletProvider) |

#### Inherited from

Swap<LCDClient, MnemonicKey, TerraWalletProvider\>.constructor

#### Defined in

client/dist/lib/Swap.d.ts:5

## Properties

### walletProvider

• `Protected` **walletProvider**: [`TerraWalletProvider`](../wiki/@liquality.terra.TerraWalletProvider)

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

#### Overrides

Swap.claimSwap

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

#### Overrides

Swap.doesTransactionMatchInitiation

#### Defined in

[terra/lib/swap/TerraSwapBaseProvider.ts:73](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/terra/lib/swap/TerraSwapBaseProvider.ts#L73)

___

### findClaimSwapTransaction

▸ `Abstract` **findClaimSwapTransaction**(`_swapParams`, `_initTxHash`, `_blockNumber?`): `Promise`<`Transaction`<[`TerraTxInfo`](../wiki/@liquality.terra.TerraTypes.TerraTxInfo)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_swapParams` | `SwapParams` |
| `_initTxHash` | `string` |
| `_blockNumber?` | `number` |

#### Returns

`Promise`<`Transaction`<[`TerraTxInfo`](../wiki/@liquality.terra.TerraTypes.TerraTxInfo)\>\>

#### Overrides

Swap.findClaimSwapTransaction

#### Defined in

[terra/lib/swap/TerraSwapBaseProvider.ts:97](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/terra/lib/swap/TerraSwapBaseProvider.ts#L97)

___

### findInitiateSwapTransaction

▸ `Abstract` **findInitiateSwapTransaction**(`_swapParams`, `_blockNumber?`): `Promise`<`Transaction`<[`TerraTxInfo`](../wiki/@liquality.terra.TerraTypes.TerraTxInfo)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_swapParams` | `SwapParams` |
| `_blockNumber?` | `number` |

#### Returns

`Promise`<`Transaction`<[`TerraTxInfo`](../wiki/@liquality.terra.TerraTypes.TerraTxInfo)\>\>

#### Overrides

Swap.findInitiateSwapTransaction

#### Defined in

[terra/lib/swap/TerraSwapBaseProvider.ts:95](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/terra/lib/swap/TerraSwapBaseProvider.ts#L95)

___

### findRefundSwapTransaction

▸ `Abstract` **findRefundSwapTransaction**(`_swapParams`, `_initiationTxHash`, `_blockNumber?`): `Promise`<`Transaction`<[`TerraTxInfo`](../wiki/@liquality.terra.TerraTypes.TerraTxInfo)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_swapParams` | `SwapParams` |
| `_initiationTxHash` | `string` |
| `_blockNumber?` | `number` |

#### Returns

`Promise`<`Transaction`<[`TerraTxInfo`](../wiki/@liquality.terra.TerraTypes.TerraTxInfo)\>\>

#### Overrides

Swap.findRefundSwapTransaction

#### Defined in

[terra/lib/swap/TerraSwapBaseProvider.ts:103](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/terra/lib/swap/TerraSwapBaseProvider.ts#L103)

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

▸ **getSwapSecret**(`claimTxHash`, `_initTxHash?`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `claimTxHash` | `string` |
| `_initTxHash?` | `string` |

#### Returns

`Promise`<`string`\>

#### Overrides

Swap.getSwapSecret

#### Defined in

[terra/lib/swap/TerraSwapBaseProvider.ts:68](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/terra/lib/swap/TerraSwapBaseProvider.ts#L68)

___

### getWallet

▸ **getWallet**(): [`TerraWalletProvider`](../wiki/@liquality.terra.TerraWalletProvider)

#### Returns

[`TerraWalletProvider`](../wiki/@liquality.terra.TerraWalletProvider)

#### Inherited from

Swap.getWallet

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

#### Overrides

Swap.initiateSwap

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

#### Overrides

Swap.refundSwap

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

Swap.setWallet

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

#### Overrides

Swap.updateTransactionFee

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
