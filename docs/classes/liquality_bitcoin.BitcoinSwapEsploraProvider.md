[](../README.md) / [Exports](../modules.md) / [@liquality/bitcoin](../modules/liquality_bitcoin.md) / BitcoinSwapEsploraProvider

# Class: BitcoinSwapEsploraProvider

[@liquality/bitcoin](../modules/liquality_bitcoin.md).BitcoinSwapEsploraProvider

## Hierarchy

- [`BitcoinSwapBaseProvider`](liquality_bitcoin.BitcoinSwapBaseProvider.md)

  ↳ **`BitcoinSwapEsploraProvider`**

## Table of contents

### Constructors

- [constructor](liquality_bitcoin.BitcoinSwapEsploraProvider.md#constructor)

### Properties

- [\_httpClient](liquality_bitcoin.BitcoinSwapEsploraProvider.md#_httpclient)
- [\_mode](liquality_bitcoin.BitcoinSwapEsploraProvider.md#_mode)
- [\_network](liquality_bitcoin.BitcoinSwapEsploraProvider.md#_network)
- [walletProvider](liquality_bitcoin.BitcoinSwapEsploraProvider.md#walletprovider)

### Methods

- [canUpdateFee](liquality_bitcoin.BitcoinSwapEsploraProvider.md#canupdatefee)
- [claimSwap](liquality_bitcoin.BitcoinSwapEsploraProvider.md#claimswap)
- [doesTransactionMatchInitiation](liquality_bitcoin.BitcoinSwapEsploraProvider.md#doestransactionmatchinitiation)
- [doesTransactionMatchRedeem](liquality_bitcoin.BitcoinSwapEsploraProvider.md#doestransactionmatchredeem)
- [extractSwapParams](liquality_bitcoin.BitcoinSwapEsploraProvider.md#extractswapparams)
- [findAddressTransaction](liquality_bitcoin.BitcoinSwapEsploraProvider.md#findaddresstransaction)
- [findClaimSwapTransaction](liquality_bitcoin.BitcoinSwapEsploraProvider.md#findclaimswaptransaction)
- [findInitiateSwapTransaction](liquality_bitcoin.BitcoinSwapEsploraProvider.md#findinitiateswaptransaction)
- [findRefundSwapTransaction](liquality_bitcoin.BitcoinSwapEsploraProvider.md#findrefundswaptransaction)
- [findSwapTransaction](liquality_bitcoin.BitcoinSwapEsploraProvider.md#findswaptransaction)
- [generateSecret](liquality_bitcoin.BitcoinSwapEsploraProvider.md#generatesecret)
- [getInputScript](liquality_bitcoin.BitcoinSwapEsploraProvider.md#getinputscript)
- [getSwapOutput](liquality_bitcoin.BitcoinSwapEsploraProvider.md#getswapoutput)
- [getSwapPaymentVariants](liquality_bitcoin.BitcoinSwapEsploraProvider.md#getswappaymentvariants)
- [getSwapSecret](liquality_bitcoin.BitcoinSwapEsploraProvider.md#getswapsecret)
- [getWallet](liquality_bitcoin.BitcoinSwapEsploraProvider.md#getwallet)
- [initiateSwap](liquality_bitcoin.BitcoinSwapEsploraProvider.md#initiateswap)
- [refundSwap](liquality_bitcoin.BitcoinSwapEsploraProvider.md#refundswap)
- [setWallet](liquality_bitcoin.BitcoinSwapEsploraProvider.md#setwallet)
- [updateTransactionFee](liquality_bitcoin.BitcoinSwapEsploraProvider.md#updatetransactionfee)
- [validateSwapParams](liquality_bitcoin.BitcoinSwapEsploraProvider.md#validateswapparams)
- [verifyInitiateSwapTransaction](liquality_bitcoin.BitcoinSwapEsploraProvider.md#verifyinitiateswaptransaction)

## Constructors

### constructor

• **new BitcoinSwapEsploraProvider**(`options`, `walletProvider`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`BitcoinSwapProviderOptions`](../interfaces/liquality_bitcoin.BitcoinTypes.BitcoinSwapProviderOptions.md) |
| `walletProvider` | [`BitcoinBaseWalletProvider`](liquality_bitcoin.BitcoinBaseWalletProvider.md)<`any`, `any`\> |

#### Overrides

[BitcoinSwapBaseProvider](liquality_bitcoin.BitcoinSwapBaseProvider.md).[constructor](liquality_bitcoin.BitcoinSwapBaseProvider.md#constructor)

#### Defined in

[bitcoin/lib/swap/BitcoinSwapEsploraProvider.ts:11](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/swap/BitcoinSwapEsploraProvider.ts#L11)

## Properties

### \_httpClient

• `Private` **\_httpClient**: `default`

#### Defined in

[bitcoin/lib/swap/BitcoinSwapEsploraProvider.ts:9](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/swap/BitcoinSwapEsploraProvider.ts#L9)

___

### \_mode

• `Protected` **\_mode**: [`SwapMode`](../enums/liquality_bitcoin.BitcoinTypes.SwapMode.md)

#### Inherited from

[BitcoinSwapBaseProvider](liquality_bitcoin.BitcoinSwapBaseProvider.md).[_mode](liquality_bitcoin.BitcoinSwapBaseProvider.md#_mode)

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:20](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L20)

___

### \_network

• `Protected` **\_network**: [`BitcoinNetwork`](../interfaces/liquality_bitcoin.BitcoinTypes.BitcoinNetwork.md)

#### Inherited from

[BitcoinSwapBaseProvider](liquality_bitcoin.BitcoinSwapBaseProvider.md).[_network](liquality_bitcoin.BitcoinSwapBaseProvider.md#_network)

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:19](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L19)

___

### walletProvider

• `Protected` **walletProvider**: `IBitcoinWallet`<[`BitcoinBaseChainProvider`](liquality_bitcoin.BitcoinBaseChainProvider.md), `any`\>

#### Inherited from

[BitcoinSwapBaseProvider](liquality_bitcoin.BitcoinSwapBaseProvider.md).[walletProvider](liquality_bitcoin.BitcoinSwapBaseProvider.md#walletprovider)

#### Defined in

client/dist/lib/Swap.d.ts:4

## Methods

### canUpdateFee

▸ **canUpdateFee**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[BitcoinSwapBaseProvider](liquality_bitcoin.BitcoinSwapBaseProvider.md).[canUpdateFee](liquality_bitcoin.BitcoinSwapBaseProvider.md#canupdatefee)

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:355](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L355)

___

### claimSwap

▸ **claimSwap**(`swapParams`, `initiationTxHash`, `secret`, `feePerByte`): `Promise`<`Transaction`<[`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `initiationTxHash` | `string` |
| `secret` | `string` |
| `feePerByte` | `number` |

#### Returns

`Promise`<`Transaction`<[`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)\>\>

#### Inherited from

[BitcoinSwapBaseProvider](liquality_bitcoin.BitcoinSwapBaseProvider.md).[claimSwap](liquality_bitcoin.BitcoinSwapBaseProvider.md#claimswap)

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:53](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L53)

___

### doesTransactionMatchInitiation

▸ `Protected` **doesTransactionMatchInitiation**(`swapParams`, `transaction`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `transaction` | `Transaction`<[`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)\> |

#### Returns

`boolean`

#### Inherited from

[BitcoinSwapBaseProvider](liquality_bitcoin.BitcoinSwapBaseProvider.md).[doesTransactionMatchInitiation](liquality_bitcoin.BitcoinSwapBaseProvider.md#doestransactionmatchinitiation)

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:410](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L410)

___

### doesTransactionMatchRedeem

▸ `Protected` **doesTransactionMatchRedeem**(`initiationTxHash`, `tx`, `isRefund`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `initiationTxHash` | `string` |
| `tx` | `Transaction`<[`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)\> |
| `isRefund` | `boolean` |

#### Returns

`boolean`

#### Inherited from

[BitcoinSwapBaseProvider](liquality_bitcoin.BitcoinSwapBaseProvider.md).[doesTransactionMatchRedeem](liquality_bitcoin.BitcoinSwapBaseProvider.md#doestransactionmatchredeem)

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:397](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L397)

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

[BitcoinSwapBaseProvider](liquality_bitcoin.BitcoinSwapBaseProvider.md).[extractSwapParams](liquality_bitcoin.BitcoinSwapBaseProvider.md#extractswapparams)

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:325](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L325)

___

### findAddressTransaction

▸ `Private` **findAddressTransaction**(`address`, `currentHeight`, `predicate`): `Promise`<`Transaction`<[`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `currentHeight` | `number` |
| `predicate` | [`TransactionMatchesFunction`](../modules/liquality_bitcoin.BitcoinTypes.md#transactionmatchesfunction) |

#### Returns

`Promise`<`Transaction`<[`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)\>\>

#### Defined in

[bitcoin/lib/swap/BitcoinSwapEsploraProvider.ts:26](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/swap/BitcoinSwapEsploraProvider.ts#L26)

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

[BitcoinSwapBaseProvider](liquality_bitcoin.BitcoinSwapBaseProvider.md).[findClaimSwapTransaction](liquality_bitcoin.BitcoinSwapBaseProvider.md#findclaimswaptransaction)

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:90](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L90)

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

[BitcoinSwapBaseProvider](liquality_bitcoin.BitcoinSwapBaseProvider.md).[findInitiateSwapTransaction](liquality_bitcoin.BitcoinSwapBaseProvider.md#findinitiateswaptransaction)

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:67](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L67)

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

[BitcoinSwapBaseProvider](liquality_bitcoin.BitcoinSwapBaseProvider.md).[findRefundSwapTransaction](liquality_bitcoin.BitcoinSwapBaseProvider.md#findrefundswaptransaction)

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:111](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L111)

___

### findSwapTransaction

▸ **findSwapTransaction**(`swapParams`, `_blockNumber`, `predicate`): `Promise`<`Transaction`<[`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `_blockNumber` | `number` |
| `predicate` | [`TransactionMatchesFunction`](../modules/liquality_bitcoin.BitcoinTypes.md#transactionmatchesfunction) |

#### Returns

`Promise`<`Transaction`<[`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)\>\>

#### Overrides

[BitcoinSwapBaseProvider](liquality_bitcoin.BitcoinSwapBaseProvider.md).[findSwapTransaction](liquality_bitcoin.BitcoinSwapBaseProvider.md#findswaptransaction)

#### Defined in

[bitcoin/lib/swap/BitcoinSwapEsploraProvider.ts:16](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/swap/BitcoinSwapEsploraProvider.ts#L16)

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

[BitcoinSwapBaseProvider](liquality_bitcoin.BitcoinSwapBaseProvider.md).[generateSecret](liquality_bitcoin.BitcoinSwapBaseProvider.md#generatesecret)

#### Defined in

client/dist/lib/Swap.d.ts:10

___

### getInputScript

▸ `Protected` **getInputScript**(`vin`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `vin` | [`Input`](../interfaces/liquality_bitcoin.BitcoinTypes.Input.md) |

#### Returns

`string`[]

#### Inherited from

[BitcoinSwapBaseProvider](liquality_bitcoin.BitcoinSwapBaseProvider.md).[getInputScript](liquality_bitcoin.BitcoinSwapBaseProvider.md#getinputscript)

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:390](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L390)

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

[BitcoinSwapBaseProvider](liquality_bitcoin.BitcoinSwapBaseProvider.md).[getSwapOutput](liquality_bitcoin.BitcoinSwapBaseProvider.md#getswapoutput)

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:124](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L124)

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

[BitcoinSwapBaseProvider](liquality_bitcoin.BitcoinSwapBaseProvider.md).[getSwapPaymentVariants](liquality_bitcoin.BitcoinSwapBaseProvider.md#getswappaymentvariants)

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:169](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L169)

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

[BitcoinSwapBaseProvider](liquality_bitcoin.BitcoinSwapBaseProvider.md).[getSwapSecret](liquality_bitcoin.BitcoinSwapBaseProvider.md#getswapsecret)

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:74](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L74)

___

### getWallet

▸ **getWallet**(): `IBitcoinWallet`<[`BitcoinBaseChainProvider`](liquality_bitcoin.BitcoinBaseChainProvider.md), `any`\>

#### Returns

`IBitcoinWallet`<[`BitcoinBaseChainProvider`](liquality_bitcoin.BitcoinBaseChainProvider.md), `any`\>

#### Inherited from

[BitcoinSwapBaseProvider](liquality_bitcoin.BitcoinSwapBaseProvider.md).[getWallet](liquality_bitcoin.BitcoinSwapBaseProvider.md#getwallet)

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

[BitcoinSwapBaseProvider](liquality_bitcoin.BitcoinSwapBaseProvider.md).[initiateSwap](liquality_bitcoin.BitcoinSwapBaseProvider.md#initiateswap)

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:41](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L41)

___

### refundSwap

▸ **refundSwap**(`swapParams`, `initiationTxHash`, `feePerByte`): `Promise`<`Transaction`<[`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `initiationTxHash` | `string` |
| `feePerByte` | `number` |

#### Returns

`Promise`<`Transaction`<[`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)\>\>

#### Inherited from

[BitcoinSwapBaseProvider](liquality_bitcoin.BitcoinSwapBaseProvider.md).[refundSwap](liquality_bitcoin.BitcoinSwapBaseProvider.md#refundswap)

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:61](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L61)

___

### setWallet

▸ **setWallet**(`wallet`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `wallet` | `IBitcoinWallet`<[`BitcoinBaseChainProvider`](liquality_bitcoin.BitcoinBaseChainProvider.md), `any`\> |

#### Returns

`void`

#### Inherited from

[BitcoinSwapBaseProvider](liquality_bitcoin.BitcoinSwapBaseProvider.md).[setWallet](liquality_bitcoin.BitcoinSwapBaseProvider.md#setwallet)

#### Defined in

client/dist/lib/Swap.d.ts:6

___

### updateTransactionFee

▸ **updateTransactionFee**(`tx`, `newFeePerByte`): `Promise`<`Transaction`<`any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | `string` \| `Transaction`<[`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)\> |
| `newFeePerByte` | `number` |

#### Returns

`Promise`<`Transaction`<`any`\>\>

#### Inherited from

[BitcoinSwapBaseProvider](liquality_bitcoin.BitcoinSwapBaseProvider.md).[updateTransactionFee](liquality_bitcoin.BitcoinSwapBaseProvider.md#updatetransactionfee)

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:359](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L359)

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

[BitcoinSwapBaseProvider](liquality_bitcoin.BitcoinSwapBaseProvider.md).[validateSwapParams](liquality_bitcoin.BitcoinSwapBaseProvider.md#validateswapparams)

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:33](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L33)

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

[BitcoinSwapBaseProvider](liquality_bitcoin.BitcoinSwapBaseProvider.md).[verifyInitiateSwapTransaction](liquality_bitcoin.BitcoinSwapBaseProvider.md#verifyinitiateswaptransaction)

#### Defined in

client/dist/lib/Swap.d.ts:8
