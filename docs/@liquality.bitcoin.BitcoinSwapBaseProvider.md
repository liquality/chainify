# Class: BitcoinSwapBaseProvider

[@liquality/bitcoin](../wiki/@liquality.bitcoin).BitcoinSwapBaseProvider

## Hierarchy

- `default`<[`BitcoinBaseChainProvider`](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider), ``null``, `IBitcoinWallet`<[`BitcoinBaseChainProvider`](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider)\>\>

  ↳ **`BitcoinSwapBaseProvider`**

  ↳↳ [`BitcoinSwapEsploraProvider`](../wiki/@liquality.bitcoin.BitcoinSwapEsploraProvider)

  ↳↳ [`BitcoinSwapRpcProvider`](../wiki/@liquality.bitcoin.BitcoinSwapRpcProvider)

## Table of contents

### Constructors

- [constructor](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#constructor)

### Properties

- [\_mode](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#_mode)
- [\_network](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#_network)
- [walletProvider](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#walletprovider)

### Methods

- [canUpdateFee](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#canupdatefee)
- [claimSwap](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#claimswap)
- [doesTransactionMatchInitiation](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#doestransactionmatchinitiation)
- [doesTransactionMatchRedeem](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#doestransactionmatchredeem)
- [extractSwapParams](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#extractswapparams)
- [findClaimSwapTransaction](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#findclaimswaptransaction)
- [findInitiateSwapTransaction](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#findinitiateswaptransaction)
- [findRefundSwapTransaction](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#findrefundswaptransaction)
- [findSwapTransaction](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#findswaptransaction)
- [generateSecret](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#generatesecret)
- [getInputScript](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#getinputscript)
- [getSwapOutput](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#getswapoutput)
- [getSwapPaymentVariants](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#getswappaymentvariants)
- [getSwapSecret](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#getswapsecret)
- [getWallet](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#getwallet)
- [initiateSwap](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#initiateswap)
- [refundSwap](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#refundswap)
- [setWallet](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#setwallet)
- [updateTransactionFee](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#updatetransactionfee)
- [validateSwapParams](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#validateswapparams)
- [verifyInitiateSwapTransaction](../wiki/@liquality.bitcoin.BitcoinSwapBaseProvider#verifyinitiateswaptransaction)

## Constructors

### constructor

• **new BitcoinSwapBaseProvider**(`options`, `walletProvider`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`BitcoinSwapProviderOptions`](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinSwapProviderOptions) |
| `walletProvider` | `IBitcoinWallet`<[`BitcoinBaseChainProvider`](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider), `any`\> |

#### Overrides

Swap&lt;BitcoinBaseChainProvider, null, IBitcoinWallet&lt;BitcoinBaseChainProvider\&gt;\&gt;.constructor

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:22](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L22)

## Properties

### \_mode

• `Protected` **\_mode**: [`SwapMode`](../wiki/@liquality.bitcoin.BitcoinTypes.SwapMode)

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:20](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L20)

___

### \_network

• `Protected` **\_network**: [`BitcoinNetwork`](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinNetwork)

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:19](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L19)

___

### walletProvider

• `Protected` **walletProvider**: `IBitcoinWallet`<[`BitcoinBaseChainProvider`](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider), `any`\>

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

#### Overrides

Swap.claimSwap

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

#### Overrides

Swap.doesTransactionMatchInitiation

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

#### Overrides

Swap.findClaimSwapTransaction

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

#### Overrides

Swap.findInitiateSwapTransaction

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

#### Overrides

Swap.findRefundSwapTransaction

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:111](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L111)

___

### findSwapTransaction

▸ `Protected` `Abstract` **findSwapTransaction**(`swapParams`, `blockNumber`, `predicate`): `Promise`<`Transaction`<[`Transaction`](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `blockNumber` | `number` |
| `predicate` | [`TransactionMatchesFunction`](../wiki/@liquality.bitcoin.BitcoinTypes#transactionmatchesfunction) |

#### Returns

`Promise`<`Transaction`<[`Transaction`](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction)\>\>

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:423](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L423)

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
| `vin` | [`Input`](../wiki/@liquality.bitcoin.BitcoinTypes.Input) |

#### Returns

`string`[]

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

#### Overrides

Swap.getSwapSecret

#### Defined in

[bitcoin/lib/swap/BitcoinSwapBaseProvider.ts:74](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/swap/BitcoinSwapBaseProvider.ts#L74)

___

### getWallet

▸ **getWallet**(): `IBitcoinWallet`<[`BitcoinBaseChainProvider`](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider), `any`\>

#### Returns

`IBitcoinWallet`<[`BitcoinBaseChainProvider`](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider), `any`\>

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

#### Overrides

Swap.refundSwap

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

Swap.setWallet

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

#### Overrides

Swap.updateTransactionFee

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

#### Overrides

Swap.validateSwapParams

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

Swap.verifyInitiateSwapTransaction

#### Defined in

client/dist/lib/Swap.d.ts:8
