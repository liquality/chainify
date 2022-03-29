[](../README.md) / [Exports](../modules.md) / [@liquality/bitcoin](../modules/liquality_bitcoin.md) / BitcoinSwapBaseProvider

# Class: BitcoinSwapBaseProvider

[@liquality/bitcoin](../modules/liquality_bitcoin.md).BitcoinSwapBaseProvider

## Hierarchy

- `default`<[`BitcoinBaseChainProvider`](liquality_bitcoin.BitcoinBaseChainProvider.md), ``null``, `IBitcoinWallet`<[`BitcoinBaseChainProvider`](liquality_bitcoin.BitcoinBaseChainProvider.md)\>\>

  ↳ **`BitcoinSwapBaseProvider`**

  ↳↳ [`BitcoinSwapEsploraProvider`](liquality_bitcoin.BitcoinSwapEsploraProvider.md)

  ↳↳ [`BitcoinSwapRpcProvider`](liquality_bitcoin.BitcoinSwapRpcProvider.md)

## Table of contents

### Constructors

- [constructor](liquality_bitcoin.BitcoinSwapBaseProvider.md#constructor)

### Properties

- [\_mode](liquality_bitcoin.BitcoinSwapBaseProvider.md#_mode)
- [\_network](liquality_bitcoin.BitcoinSwapBaseProvider.md#_network)
- [walletProvider](liquality_bitcoin.BitcoinSwapBaseProvider.md#walletprovider)

### Methods

- [UNSAFE\_isSwapRedeemTransaction](liquality_bitcoin.BitcoinSwapBaseProvider.md#unsafe_isswapredeemtransaction)
- [\_redeemSwap](liquality_bitcoin.BitcoinSwapBaseProvider.md#_redeemswap)
- [\_redeemSwapOutput](liquality_bitcoin.BitcoinSwapBaseProvider.md#_redeemswapoutput)
- [canUpdateFee](liquality_bitcoin.BitcoinSwapBaseProvider.md#canupdatefee)
- [claimSwap](liquality_bitcoin.BitcoinSwapBaseProvider.md#claimswap)
- [doesTransactionMatchInitiation](liquality_bitcoin.BitcoinSwapBaseProvider.md#doestransactionmatchinitiation)
- [doesTransactionMatchRedeem](liquality_bitcoin.BitcoinSwapBaseProvider.md#doestransactionmatchredeem)
- [extractSwapParams](liquality_bitcoin.BitcoinSwapBaseProvider.md#extractswapparams)
- [findClaimSwapTransaction](liquality_bitcoin.BitcoinSwapBaseProvider.md#findclaimswaptransaction)
- [findInitiateSwapTransaction](liquality_bitcoin.BitcoinSwapBaseProvider.md#findinitiateswaptransaction)
- [findRefundSwapTransaction](liquality_bitcoin.BitcoinSwapBaseProvider.md#findrefundswaptransaction)
- [findSwapTransaction](liquality_bitcoin.BitcoinSwapBaseProvider.md#findswaptransaction)
- [generateSecret](liquality_bitcoin.BitcoinSwapBaseProvider.md#generatesecret)
- [getInputScript](liquality_bitcoin.BitcoinSwapBaseProvider.md#getinputscript)
- [getSwapInput](liquality_bitcoin.BitcoinSwapBaseProvider.md#getswapinput)
- [getSwapOutput](liquality_bitcoin.BitcoinSwapBaseProvider.md#getswapoutput)
- [getSwapPaymentVariants](liquality_bitcoin.BitcoinSwapBaseProvider.md#getswappaymentvariants)
- [getSwapSecret](liquality_bitcoin.BitcoinSwapBaseProvider.md#getswapsecret)
- [getWallet](liquality_bitcoin.BitcoinSwapBaseProvider.md#getwallet)
- [initiateSwap](liquality_bitcoin.BitcoinSwapBaseProvider.md#initiateswap)
- [refundSwap](liquality_bitcoin.BitcoinSwapBaseProvider.md#refundswap)
- [setWallet](liquality_bitcoin.BitcoinSwapBaseProvider.md#setwallet)
- [updateTransactionFee](liquality_bitcoin.BitcoinSwapBaseProvider.md#updatetransactionfee)
- [validateSwapParams](liquality_bitcoin.BitcoinSwapBaseProvider.md#validateswapparams)
- [verifyInitiateSwapTransaction](liquality_bitcoin.BitcoinSwapBaseProvider.md#verifyinitiateswaptransaction)

## Constructors

### constructor

• **new BitcoinSwapBaseProvider**(`options`, `walletProvider`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`BitcoinSwapProviderOptions`](../interfaces/liquality_bitcoin.BitcoinTypes.BitcoinSwapProviderOptions.md) |
| `walletProvider` | `IBitcoinWallet`<[`BitcoinBaseChainProvider`](liquality_bitcoin.BitcoinBaseChainProvider.md), `any`\> |

#### Overrides

Swap&lt;BitcoinBaseChainProvider, null, IBitcoinWallet&lt;BitcoinBaseChainProvider\&gt;\&gt;.constructor

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:22](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L22)

## Properties

### \_mode

• `Protected` **\_mode**: [`SwapMode`](../enums/liquality_bitcoin.BitcoinTypes.SwapMode.md)

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:20](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L20)

___

### \_network

• `Protected` **\_network**: [`BitcoinNetwork`](../interfaces/liquality_bitcoin.BitcoinTypes.BitcoinNetwork.md)

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:19](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L19)

___

### walletProvider

• `Protected` **walletProvider**: `IBitcoinWallet`<[`BitcoinBaseChainProvider`](liquality_bitcoin.BitcoinBaseChainProvider.md), `any`\>

#### Inherited from

Swap.walletProvider

#### Defined in

client/dist/lib/Swap.d.ts:4

## Methods

### UNSAFE\_isSwapRedeemTransaction

▸ `Private` **UNSAFE_isSwapRedeemTransaction**(`transaction`): `Promise`<`boolean`\>

Only to be used for situations where transaction is trusted. e.g to bump fee
DO NOT USE THIS TO VERIFY THE REDEEM

#### Parameters

| Name | Type |
| :------ | :------ |
| `transaction` | `Transaction`<[`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)\> |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:341](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L341)

___

### \_redeemSwap

▸ `Private` **_redeemSwap**(`swapParams`, `initiationTxHash`, `isClaim`, `secret`, `feePerByte`): `Promise`<`Transaction`<[`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `initiationTxHash` | `string` |
| `isClaim` | `boolean` |
| `secret` | `string` |
| `feePerByte` | `number` |

#### Returns

`Promise`<`Transaction`<[`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)\>\>

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:190](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L190)

___

### \_redeemSwapOutput

▸ `Private` **_redeemSwapOutput**(`initiationTxHash`, `value`, `address`, `swapOutput`, `expiration`, `isClaim`, `secret`, `_feePerByte`): `Promise`<`Transaction`<[`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `initiationTxHash` | `string` |
| `value` | `BigNumber` |
| `address` | `string` |
| `swapOutput` | `Buffer` |
| `expiration` | `number` |
| `isClaim` | `boolean` |
| `secret` | `string` |
| `_feePerByte` | `number` |

#### Returns

`Promise`<`Transaction`<[`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)\>\>

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:205](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L205)

___

### canUpdateFee

▸ **canUpdateFee**(): `boolean`

#### Returns

`boolean`

#### Overrides

Swap.canUpdateFee

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

#### Overrides

Swap.claimSwap

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

#### Overrides

Swap.doesTransactionMatchInitiation

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

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:325](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L325)

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

#### Overrides

Swap.findClaimSwapTransaction

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

#### Overrides

Swap.findInitiateSwapTransaction

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

#### Overrides

Swap.findRefundSwapTransaction

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:111](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L111)

___

### findSwapTransaction

▸ `Protected` `Abstract` **findSwapTransaction**(`swapParams`, `blockNumber`, `predicate`): `Promise`<`Transaction`<[`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `blockNumber` | `number` |
| `predicate` | [`TransactionMatchesFunction`](../modules/liquality_bitcoin.BitcoinTypes.md#transactionmatchesfunction) |

#### Returns

`Promise`<`Transaction`<[`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)\>\>

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:423](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L423)

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

### getInputScript

▸ `Protected` **getInputScript**(`vin`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `vin` | [`Input`](../interfaces/liquality_bitcoin.BitcoinTypes.Input.md) |

#### Returns

`string`[]

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:390](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L390)

___

### getSwapInput

▸ `Private` **getSwapInput**(`sig`, `pubKey`, `isClaim`, `secret?`): `Buffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `sig` | `Buffer` |
| `pubKey` | `Buffer` |
| `isClaim` | `boolean` |
| `secret?` | `string` |

#### Returns

`Buffer`

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:162](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L162)

___

### getSwapOutput

▸ `Protected` **getSwapOutput**(`swapParams`): `Buffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |

#### Returns

`Buffer`

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

#### Overrides

Swap.getSwapSecret

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:74](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L74)

___

### getWallet

▸ **getWallet**(): `IBitcoinWallet`<[`BitcoinBaseChainProvider`](liquality_bitcoin.BitcoinBaseChainProvider.md), `any`\>

#### Returns

`IBitcoinWallet`<[`BitcoinBaseChainProvider`](liquality_bitcoin.BitcoinBaseChainProvider.md), `any`\>

#### Inherited from

Swap.getWallet

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

#### Overrides

Swap.initiateSwap

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

#### Overrides

Swap.refundSwap

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

Swap.setWallet

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

#### Overrides

Swap.updateTransactionFee

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

#### Overrides

Swap.validateSwapParams

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

Swap.verifyInitiateSwapTransaction

#### Defined in

client/dist/lib/Swap.d.ts:8
