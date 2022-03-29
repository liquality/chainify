# Class: EvmSwapProvider

[@liquality/evm](../wiki/@liquality.evm).EvmSwapProvider

## Hierarchy

- [`EvmBaseSwapProvider`](../wiki/@liquality.evm.EvmBaseSwapProvider)

  ↳ **`EvmSwapProvider`**

## Table of contents

### Constructors

- [constructor](../wiki/@liquality.evm.EvmSwapProvider#constructor)

### Properties

- [contract](../wiki/@liquality.evm.EvmSwapProvider#contract)
- [swapOptions](../wiki/@liquality.evm.EvmSwapProvider#swapoptions)
- [walletProvider](../wiki/@liquality.evm.EvmSwapProvider#walletprovider)

### Methods

- [canUpdateFee](../wiki/@liquality.evm.EvmSwapProvider#canupdatefee)
- [claimSwap](../wiki/@liquality.evm.EvmSwapProvider#claimswap)
- [doesTransactionMatchInitiation](../wiki/@liquality.evm.EvmSwapProvider#doestransactionmatchinitiation)
- [findClaimSwapTransaction](../wiki/@liquality.evm.EvmSwapProvider#findclaimswaptransaction)
- [findInitiateSwapTransaction](../wiki/@liquality.evm.EvmSwapProvider#findinitiateswaptransaction)
- [findRefundSwapTransaction](../wiki/@liquality.evm.EvmSwapProvider#findrefundswaptransaction)
- [generateSecret](../wiki/@liquality.evm.EvmSwapProvider#generatesecret)
- [getSwapSecret](../wiki/@liquality.evm.EvmSwapProvider#getswapsecret)
- [getWallet](../wiki/@liquality.evm.EvmSwapProvider#getwallet)
- [initiateSwap](../wiki/@liquality.evm.EvmSwapProvider#initiateswap)
- [refundSwap](../wiki/@liquality.evm.EvmSwapProvider#refundswap)
- [setWallet](../wiki/@liquality.evm.EvmSwapProvider#setwallet)
- [tryParseLog](../wiki/@liquality.evm.EvmSwapProvider#tryparselog)
- [updateTransactionFee](../wiki/@liquality.evm.EvmSwapProvider#updatetransactionfee)
- [validateSwapParams](../wiki/@liquality.evm.EvmSwapProvider#validateswapparams)
- [verifyInitiateSwapTransaction](../wiki/@liquality.evm.EvmSwapProvider#verifyinitiateswaptransaction)

## Constructors

### constructor

• **new EvmSwapProvider**(`swapOptions`, `walletProvider`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapOptions` | [`EvmSwapOptions`](../wiki/@liquality.evm.EvmTypes.EvmSwapOptions) |
| `walletProvider` | [`EvmBaseWalletProvider`](../wiki/@liquality.evm.EvmBaseWalletProvider)<`BaseProvider`, `Signer`\> |

#### Overrides

[EvmBaseSwapProvider](../wiki/@liquality.evm.EvmBaseSwapProvider).[constructor](../wiki/@liquality.evm.EvmBaseSwapProvider#constructor)

#### Defined in

[evm/lib/swap/EvmSwapProvider.ts:12](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/swap/EvmSwapProvider.ts#L12)

## Properties

### contract

• `Protected` **contract**: `LiqualityHTLC`

#### Inherited from

[EvmBaseSwapProvider](../wiki/@liquality.evm.EvmBaseSwapProvider).[contract](../wiki/@liquality.evm.EvmBaseSwapProvider#contract)

#### Defined in

[evm/lib/swap/EvmBaseSwapProvider.ts:16](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/swap/EvmBaseSwapProvider.ts#L16)

___

### swapOptions

• `Protected` **swapOptions**: [`EvmSwapOptions`](../wiki/@liquality.evm.EvmTypes.EvmSwapOptions)

#### Inherited from

[EvmBaseSwapProvider](../wiki/@liquality.evm.EvmBaseSwapProvider).[swapOptions](../wiki/@liquality.evm.EvmBaseSwapProvider#swapoptions)

#### Defined in

[evm/lib/swap/EvmBaseSwapProvider.ts:17](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/swap/EvmBaseSwapProvider.ts#L17)

___

### walletProvider

• `Protected` **walletProvider**: [`EvmBaseWalletProvider`](../wiki/@liquality.evm.EvmBaseWalletProvider)<`BaseProvider`, `Signer`\>

#### Overrides

[EvmBaseSwapProvider](../wiki/@liquality.evm.EvmBaseSwapProvider).[walletProvider](../wiki/@liquality.evm.EvmBaseSwapProvider#walletprovider)

#### Defined in

[evm/lib/swap/EvmSwapProvider.ts:10](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/swap/EvmSwapProvider.ts#L10)

## Methods

### canUpdateFee

▸ **canUpdateFee**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[EvmBaseSwapProvider](../wiki/@liquality.evm.EvmBaseSwapProvider).[canUpdateFee](../wiki/@liquality.evm.EvmBaseSwapProvider#canupdatefee)

#### Defined in

[evm/lib/swap/EvmBaseSwapProvider.ts:136](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/swap/EvmBaseSwapProvider.ts#L136)

___

### claimSwap

▸ **claimSwap**(`swapParams`, `initTxHash`, `secret`, `fee`): `Promise`<`Transaction`<`TransactionResponse`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `initTxHash` | `string` |
| `secret` | `string` |
| `fee` | `FeeType` |

#### Returns

`Promise`<`Transaction`<`TransactionResponse`\>\>

#### Inherited from

[EvmBaseSwapProvider](../wiki/@liquality.evm.EvmBaseSwapProvider).[claimSwap](../wiki/@liquality.evm.EvmBaseSwapProvider#claimswap)

#### Defined in

[evm/lib/swap/EvmBaseSwapProvider.ts:50](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/swap/EvmBaseSwapProvider.ts#L50)

___

### doesTransactionMatchInitiation

▸ `Protected` **doesTransactionMatchInitiation**(`swapParams`, `transaction`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `transaction` | `Transaction`<`InitiateEvent`\> |

#### Returns

`boolean`

#### Inherited from

[EvmBaseSwapProvider](../wiki/@liquality.evm.EvmBaseSwapProvider).[doesTransactionMatchInitiation](../wiki/@liquality.evm.EvmBaseSwapProvider#doestransactionmatchinitiation)

#### Defined in

[evm/lib/swap/EvmBaseSwapProvider.ts:93](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/swap/EvmBaseSwapProvider.ts#L93)

___

### findClaimSwapTransaction

▸ **findClaimSwapTransaction**(`swapParams`, `initTxHash`): `Promise`<`Transaction`<`ClaimEvent`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `initTxHash` | `string` |

#### Returns

`Promise`<`Transaction`<`ClaimEvent`\>\>

#### Overrides

[EvmBaseSwapProvider](../wiki/@liquality.evm.EvmBaseSwapProvider).[findClaimSwapTransaction](../wiki/@liquality.evm.EvmBaseSwapProvider#findclaimswaptransaction)

#### Defined in

[evm/lib/swap/EvmSwapProvider.ts:36](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/swap/EvmSwapProvider.ts#L36)

___

### findInitiateSwapTransaction

▸ **findInitiateSwapTransaction**(`swapParams`): `Promise`<`Transaction`<`InitiateEvent`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |

#### Returns

`Promise`<`Transaction`<`InitiateEvent`\>\>

#### Overrides

[EvmBaseSwapProvider](../wiki/@liquality.evm.EvmBaseSwapProvider).[findInitiateSwapTransaction](../wiki/@liquality.evm.EvmBaseSwapProvider#findinitiateswaptransaction)

#### Defined in

[evm/lib/swap/EvmSwapProvider.ts:16](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/swap/EvmSwapProvider.ts#L16)

___

### findRefundSwapTransaction

▸ **findRefundSwapTransaction**(`swapParams`, `initTxHash`): `Promise`<`Transaction`<`RefundEvent`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `initTxHash` | `string` |

#### Returns

`Promise`<`Transaction`<`RefundEvent`\>\>

#### Overrides

[EvmBaseSwapProvider](../wiki/@liquality.evm.EvmBaseSwapProvider).[findRefundSwapTransaction](../wiki/@liquality.evm.EvmBaseSwapProvider#findrefundswaptransaction)

#### Defined in

[evm/lib/swap/EvmSwapProvider.ts:44](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/swap/EvmSwapProvider.ts#L44)

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

[EvmBaseSwapProvider](../wiki/@liquality.evm.EvmBaseSwapProvider).[generateSecret](../wiki/@liquality.evm.EvmBaseSwapProvider#generatesecret)

#### Defined in

client/dist/lib/Swap.d.ts:10

___

### getSwapSecret

▸ **getSwapSecret**(`claimTx`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `claimTx` | `string` |

#### Returns

`Promise`<`string`\>

#### Inherited from

[EvmBaseSwapProvider](../wiki/@liquality.evm.EvmBaseSwapProvider).[getSwapSecret](../wiki/@liquality.evm.EvmBaseSwapProvider#getswapsecret)

#### Defined in

[evm/lib/swap/EvmBaseSwapProvider.ts:119](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/swap/EvmBaseSwapProvider.ts#L119)

___

### getWallet

▸ **getWallet**(): `any`

#### Returns

`any`

#### Inherited from

[EvmBaseSwapProvider](../wiki/@liquality.evm.EvmBaseSwapProvider).[getWallet](../wiki/@liquality.evm.EvmBaseSwapProvider#getwallet)

#### Defined in

client/dist/lib/Swap.d.ts:7

___

### initiateSwap

▸ **initiateSwap**(`swapParams`, `fee`): `Promise`<`Transaction`<`TransactionResponse`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `fee` | `FeeType` |

#### Returns

`Promise`<`Transaction`<`TransactionResponse`\>\>

#### Inherited from

[EvmBaseSwapProvider](../wiki/@liquality.evm.EvmBaseSwapProvider).[initiateSwap](../wiki/@liquality.evm.EvmBaseSwapProvider#initiateswap)

#### Defined in

[evm/lib/swap/EvmBaseSwapProvider.ts:29](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/swap/EvmBaseSwapProvider.ts#L29)

___

### refundSwap

▸ **refundSwap**(`swapParams`, `initTxHash`, `fee`): `Promise`<`Transaction`<`TransactionResponse`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `initTxHash` | `string` |
| `fee` | `FeeType` |

#### Returns

`Promise`<`Transaction`<`TransactionResponse`\>\>

#### Inherited from

[EvmBaseSwapProvider](../wiki/@liquality.evm.EvmBaseSwapProvider).[refundSwap](../wiki/@liquality.evm.EvmBaseSwapProvider#refundswap)

#### Defined in

[evm/lib/swap/EvmBaseSwapProvider.ts:75](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/swap/EvmBaseSwapProvider.ts#L75)

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

[EvmBaseSwapProvider](../wiki/@liquality.evm.EvmBaseSwapProvider).[setWallet](../wiki/@liquality.evm.EvmBaseSwapProvider#setwallet)

#### Defined in

client/dist/lib/Swap.d.ts:6

___

### tryParseLog

▸ `Protected` **tryParseLog**(`log`): `LogDescription`

#### Parameters

| Name | Type |
| :------ | :------ |
| `log` | `Log` |

#### Returns

`LogDescription`

#### Inherited from

[EvmBaseSwapProvider](../wiki/@liquality.evm.EvmBaseSwapProvider).[tryParseLog](../wiki/@liquality.evm.EvmBaseSwapProvider#tryparselog)

#### Defined in

[evm/lib/swap/EvmBaseSwapProvider.ts:144](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/swap/EvmBaseSwapProvider.ts#L144)

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

#### Inherited from

[EvmBaseSwapProvider](../wiki/@liquality.evm.EvmBaseSwapProvider).[updateTransactionFee](../wiki/@liquality.evm.EvmBaseSwapProvider#updatetransactionfee)

#### Defined in

[evm/lib/swap/EvmBaseSwapProvider.ts:140](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/swap/EvmBaseSwapProvider.ts#L140)

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

[EvmBaseSwapProvider](../wiki/@liquality.evm.EvmBaseSwapProvider).[validateSwapParams](../wiki/@liquality.evm.EvmBaseSwapProvider#validateswapparams)

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

[EvmBaseSwapProvider](../wiki/@liquality.evm.EvmBaseSwapProvider).[verifyInitiateSwapTransaction](../wiki/@liquality.evm.EvmBaseSwapProvider#verifyinitiateswaptransaction)

#### Defined in

client/dist/lib/Swap.d.ts:8
