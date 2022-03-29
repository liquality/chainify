# Class: BitcoinSwapEsploraProvider

[@liquality/bitcoin](../wiki/@liquality.bitcoin).BitcoinSwapEsploraProvider

## Hierarchy

- [`BitcoinSwapBaseProvider`](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider)

  ↳ **`BitcoinSwapEsploraProvider`**

## Table of contents

### Constructors

- [constructor](../wiki/@liquality.bitcoin.BitcoinSwapEsploraProvider#constructor)

### Properties

- [\_mode](../wiki/@liquality.bitcoin.BitcoinSwapEsploraProvider#_mode)
- [\_network](../wiki/@liquality.bitcoin.BitcoinSwapEsploraProvider#_network)
- [walletProvider](../wiki/@liquality.bitcoin.BitcoinSwapEsploraProvider#walletprovider)

### Methods

- [canUpdateFee](../wiki/@liquality.bitcoin.BitcoinSwapEsploraProvider#canupdatefee)
- [claimSwap](../wiki/@liquality.bitcoin.BitcoinSwapEsploraProvider#claimswap)
- [doesTransactionMatchInitiation](../wiki/@liquality.bitcoin.BitcoinSwapEsploraProvider#doestransactionmatchinitiation)
- [doesTransactionMatchRedeem](../wiki/@liquality.bitcoin.BitcoinSwapEsploraProvider#doestransactionmatchredeem)
- [extractSwapParams](../wiki/@liquality.bitcoin.BitcoinSwapEsploraProvider#extractswapparams)
- [findClaimSwapTransaction](../wiki/@liquality.bitcoin.BitcoinSwapEsploraProvider#findclaimswaptransaction)
- [findInitiateSwapTransaction](../wiki/@liquality.bitcoin.BitcoinSwapEsploraProvider#findinitiateswaptransaction)
- [findRefundSwapTransaction](../wiki/@liquality.bitcoin.BitcoinSwapEsploraProvider#findrefundswaptransaction)
- [findSwapTransaction](../wiki/@liquality.bitcoin.BitcoinSwapEsploraProvider#findswaptransaction)
- [generateSecret](../wiki/@liquality.bitcoin.BitcoinSwapEsploraProvider#generatesecret)
- [getInputScript](../wiki/@liquality.bitcoin.BitcoinSwapEsploraProvider#getinputscript)
- [getSwapOutput](../wiki/@liquality.bitcoin.BitcoinSwapEsploraProvider#getswapoutput)
- [getSwapPaymentVariants](../wiki/@liquality.bitcoin.BitcoinSwapEsploraProvider#getswappaymentvariants)
- [getSwapSecret](../wiki/@liquality.bitcoin.BitcoinSwapEsploraProvider#getswapsecret)
- [getWallet](../wiki/@liquality.bitcoin.BitcoinSwapEsploraProvider#getwallet)
- [initiateSwap](../wiki/@liquality.bitcoin.BitcoinSwapEsploraProvider#initiateswap)
- [refundSwap](../wiki/@liquality.bitcoin.BitcoinSwapEsploraProvider#refundswap)
- [setWallet](../wiki/@liquality.bitcoin.BitcoinSwapEsploraProvider#setwallet)
- [updateTransactionFee](../wiki/@liquality.bitcoin.BitcoinSwapEsploraProvider#updatetransactionfee)
- [validateSwapParams](../wiki/@liquality.bitcoin.BitcoinSwapEsploraProvider#validateswapparams)
- [verifyInitiateSwapTransaction](../wiki/@liquality.bitcoin.BitcoinSwapEsploraProvider#verifyinitiateswaptransaction)

## Constructors

### constructor

• **new BitcoinSwapEsploraProvider**(`options`, `walletProvider`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`BitcoinSwapProviderOptions`](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinSwapProviderOptions) |
| `walletProvider` | [`BitcoinBaseWalletProvider`](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider)<`any`, `any`\> |

#### Overrides

[BitcoinSwapBaseProvider](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider).[constructor](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#constructor)

#### Defined in

[bitcoin/lib/swap/BitcoinSwapEsploraProvider.ts:11](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/swap/BitcoinSwapEsploraProvider.ts#L11)

## Properties

### \_mode

• `Protected` **\_mode**: [`SwapMode`](../wiki/@liquality.bitcoin.BitcoinTypes.SwapMode)

#### Inherited from

[BitcoinSwapBaseProvider](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider).[_mode](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#_mode)

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:20](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L20)

___

### \_network

• `Protected` **\_network**: [`BitcoinNetwork`](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinNetwork)

#### Inherited from

[BitcoinSwapBaseProvider](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider).[_network](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#_network)

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:19](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L19)

___

### walletProvider

• `Protected` **walletProvider**: `IBitcoinWallet`<[`BitcoinBaseChainProvider`](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider), `any`\>

#### Inherited from

[BitcoinSwapBaseProvider](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider).[walletProvider](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#walletprovider)

#### Defined in

client/dist/lib/Swap.d.ts:4

## Methods

### canUpdateFee

▸ **canUpdateFee**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[BitcoinSwapBaseProvider](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider).[canUpdateFee](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#canupdatefee)

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:355](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L355)

___

### claimSwap

▸ **claimSwap**(`swapParams`, `initiationTxHash`, `secret`, `feePerByte`): `Promise`<`Transaction`<[`Transaction`](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `initiationTxHash` | `string` |
| `secret` | `string` |
| `feePerByte` | `number` |

#### Returns

`Promise`<`Transaction`<[`Transaction`](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction)\>\>

#### Inherited from

[BitcoinSwapBaseProvider](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider).[claimSwap](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#claimswap)

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:53](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L53)

___

### doesTransactionMatchInitiation

▸ `Protected` **doesTransactionMatchInitiation**(`swapParams`, `transaction`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `transaction` | `Transaction`<[`Transaction`](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction)\> |

#### Returns

`boolean`

#### Inherited from

[BitcoinSwapBaseProvider](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider).[doesTransactionMatchInitiation](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#doestransactionmatchinitiation)

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:410](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L410)

___

### doesTransactionMatchRedeem

▸ `Protected` **doesTransactionMatchRedeem**(`initiationTxHash`, `tx`, `isRefund`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `initiationTxHash` | `string` |
| `tx` | `Transaction`<[`Transaction`](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction)\> |
| `isRefund` | `boolean` |

#### Returns

`boolean`

#### Inherited from

[BitcoinSwapBaseProvider](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider).[doesTransactionMatchRedeem](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#doestransactionmatchredeem)

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:397](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L397)

___

### extractSwapParams

▸ `Protected` **extractSwapParams**(`outputScript`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `outputScript` | `string` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `expiration` | `number` |
| `recipientPublicKey` | `string` |
| `refundPublicKey` | `string` |
| `secretHash` | `string` |

#### Inherited from

[BitcoinSwapBaseProvider](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider).[extractSwapParams](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#extractswapparams)

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:325](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L325)

___

### findClaimSwapTransaction

▸ **findClaimSwapTransaction**(`swapParams`, `initTxHash`, `blockNumber?`): `Promise`<`Transaction`<`any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `initTxHash` | `string` |
| `blockNumber?` | `number` |

#### Returns

`Promise`<`Transaction`<`any`\>\>

#### Inherited from

[BitcoinSwapBaseProvider](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider).[findClaimSwapTransaction](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#findclaimswaptransaction)

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:90](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L90)

___

### findInitiateSwapTransaction

▸ **findInitiateSwapTransaction**(`swapParams`, `blockNumber?`): `Promise`<`Transaction`<`any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `blockNumber?` | `number` |

#### Returns

`Promise`<`Transaction`<`any`\>\>

#### Inherited from

[BitcoinSwapBaseProvider](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider).[findInitiateSwapTransaction](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#findinitiateswaptransaction)

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:67](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L67)

___

### findRefundSwapTransaction

▸ **findRefundSwapTransaction**(`swapParams`, `initiationTxHash`, `blockNumber?`): `Promise`<`Transaction`<`any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `initiationTxHash` | `string` |
| `blockNumber?` | `number` |

#### Returns

`Promise`<`Transaction`<`any`\>\>

#### Inherited from

[BitcoinSwapBaseProvider](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider).[findRefundSwapTransaction](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#findrefundswaptransaction)

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:111](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L111)

___

### findSwapTransaction

▸ **findSwapTransaction**(`swapParams`, `_blockNumber`, `predicate`): `Promise`<`Transaction`<[`Transaction`](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `_blockNumber` | `number` |
| `predicate` | [`TransactionMatchesFunction`](../wiki/@liquality.bitcoin.BitcoinTypes#transactionmatchesfunction) |

#### Returns

`Promise`<`Transaction`<[`Transaction`](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction)\>\>

#### Overrides

[BitcoinSwapBaseProvider](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider).[findSwapTransaction](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#findswaptransaction)

#### Defined in

[bitcoin/lib/swap/BitcoinSwapEsploraProvider.ts:16](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/swap/BitcoinSwapEsploraProvider.ts#L16)

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

[BitcoinSwapBaseProvider](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider).[generateSecret](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#generatesecret)

#### Defined in

client/dist/lib/Swap.d.ts:10

___

### getInputScript

▸ `Protected` **getInputScript**(`vin`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `vin` | [`Input`](../wiki/@liquality.bitcoin.BitcoinTypes.Input) |

#### Returns

`string`[]

#### Inherited from

[BitcoinSwapBaseProvider](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider).[getInputScript](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#getinputscript)

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:390](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L390)

___

### getSwapOutput

▸ `Protected` **getSwapOutput**(`swapParams`): `Buffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |

#### Returns

`Buffer`

#### Inherited from

[BitcoinSwapBaseProvider](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider).[getSwapOutput](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#getswapoutput)

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:124](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L124)

___

### getSwapPaymentVariants

▸ `Protected` **getSwapPaymentVariants**(`swapOutput`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapOutput` | `Buffer` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `p2sh` | `Payment` |
| `p2shSegwit` | `Payment` |
| `p2wsh` | `Payment` |

#### Inherited from

[BitcoinSwapBaseProvider](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider).[getSwapPaymentVariants](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#getswappaymentvariants)

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:169](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L169)

___

### getSwapSecret

▸ **getSwapSecret**(`claimTxHash`, `initTxHash`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `claimTxHash` | `string` |
| `initTxHash` | `string` |

#### Returns

`Promise`<`string`\>

#### Inherited from

[BitcoinSwapBaseProvider](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider).[getSwapSecret](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#getswapsecret)

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:74](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L74)

___

### getWallet

▸ **getWallet**(): `IBitcoinWallet`<[`BitcoinBaseChainProvider`](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider), `any`\>

#### Returns

`IBitcoinWallet`<[`BitcoinBaseChainProvider`](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider), `any`\>

#### Inherited from

[BitcoinSwapBaseProvider](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider).[getWallet](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#getwallet)

#### Defined in

client/dist/lib/Swap.d.ts:7

___

### initiateSwap

▸ **initiateSwap**(`swapParams`, `feePerByte`): `Promise`<`Transaction`<`any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `feePerByte` | `number` |

#### Returns

`Promise`<`Transaction`<`any`\>\>

#### Inherited from

[BitcoinSwapBaseProvider](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider).[initiateSwap](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#initiateswap)

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:41](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L41)

___

### refundSwap

▸ **refundSwap**(`swapParams`, `initiationTxHash`, `feePerByte`): `Promise`<`Transaction`<[`Transaction`](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `initiationTxHash` | `string` |
| `feePerByte` | `number` |

#### Returns

`Promise`<`Transaction`<[`Transaction`](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction)\>\>

#### Inherited from

[BitcoinSwapBaseProvider](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider).[refundSwap](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#refundswap)

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:61](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L61)

___

### setWallet

▸ **setWallet**(`wallet`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `wallet` | `IBitcoinWallet`<[`BitcoinBaseChainProvider`](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider), `any`\> |

#### Returns

`void`

#### Inherited from

[BitcoinSwapBaseProvider](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider).[setWallet](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#setwallet)

#### Defined in

client/dist/lib/Swap.d.ts:6

___

### updateTransactionFee

▸ **updateTransactionFee**(`tx`, `newFeePerByte`): `Promise`<`Transaction`<`any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | `string` \| `Transaction`<[`Transaction`](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction)\> |
| `newFeePerByte` | `number` |

#### Returns

`Promise`<`Transaction`<`any`\>\>

#### Inherited from

[BitcoinSwapBaseProvider](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider).[updateTransactionFee](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#updatetransactionfee)

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:359](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L359)

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

[BitcoinSwapBaseProvider](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider).[validateSwapParams](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#validateswapparams)

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:33](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L33)

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

[BitcoinSwapBaseProvider](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider).[verifyInitiateSwapTransaction](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#verifyinitiateswaptransaction)

#### Defined in

client/dist/lib/Swap.d.ts:8
