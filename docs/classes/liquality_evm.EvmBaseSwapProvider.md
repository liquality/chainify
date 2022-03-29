[](../README.md) / [Exports](../modules.md) / [@liquality/evm](../modules/liquality_evm.md) / EvmBaseSwapProvider

# Class: EvmBaseSwapProvider

[@liquality/evm](../modules/liquality_evm.md).EvmBaseSwapProvider

## Hierarchy

- `default`<`BaseProvider`, `Signer`\>

  ↳ **`EvmBaseSwapProvider`**

  ↳↳ [`EvmSwapProvider`](liquality_evm.EvmSwapProvider.md)

## Table of contents

### Constructors

- [constructor](liquality_evm.EvmBaseSwapProvider.md#constructor)

### Properties

- [contract](liquality_evm.EvmBaseSwapProvider.md#contract)
- [swapOptions](liquality_evm.EvmBaseSwapProvider.md#swapoptions)
- [walletProvider](liquality_evm.EvmBaseSwapProvider.md#walletprovider)

### Methods

- [canUpdateFee](liquality_evm.EvmBaseSwapProvider.md#canupdatefee)
- [claimSwap](liquality_evm.EvmBaseSwapProvider.md#claimswap)
- [doesTransactionMatchInitiation](liquality_evm.EvmBaseSwapProvider.md#doestransactionmatchinitiation)
- [findClaimSwapTransaction](liquality_evm.EvmBaseSwapProvider.md#findclaimswaptransaction)
- [findInitiateSwapTransaction](liquality_evm.EvmBaseSwapProvider.md#findinitiateswaptransaction)
- [findRefundSwapTransaction](liquality_evm.EvmBaseSwapProvider.md#findrefundswaptransaction)
- [generateSecret](liquality_evm.EvmBaseSwapProvider.md#generatesecret)
- [getSwapSecret](liquality_evm.EvmBaseSwapProvider.md#getswapsecret)
- [getWallet](liquality_evm.EvmBaseSwapProvider.md#getwallet)
- [initiateSwap](liquality_evm.EvmBaseSwapProvider.md#initiateswap)
- [refundSwap](liquality_evm.EvmBaseSwapProvider.md#refundswap)
- [setWallet](liquality_evm.EvmBaseSwapProvider.md#setwallet)
- [tryParseLog](liquality_evm.EvmBaseSwapProvider.md#tryparselog)
- [updateTransactionFee](liquality_evm.EvmBaseSwapProvider.md#updatetransactionfee)
- [validateSwapParams](liquality_evm.EvmBaseSwapProvider.md#validateswapparams)
- [verifyInitiateSwapTransaction](liquality_evm.EvmBaseSwapProvider.md#verifyinitiateswaptransaction)

## Constructors

### constructor

• **new EvmBaseSwapProvider**(`swapOptions`, `walletProvider?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapOptions` | [`EvmSwapOptions`](../interfaces/liquality_evm.EvmTypes.EvmSwapOptions.md) |
| `walletProvider?` | [`EvmBaseWalletProvider`](liquality_evm.EvmBaseWalletProvider.md)<`BaseProvider`, `Signer`\> |

#### Overrides

Swap&lt;BaseProvider, Signer\&gt;.constructor

#### Defined in

[evm/lib/swap/EvmBaseSwapProvider.ts:19](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/swap/EvmBaseSwapProvider.ts#L19)

## Properties

### contract

• `Protected` **contract**: `LiqualityHTLC`

#### Defined in

[evm/lib/swap/EvmBaseSwapProvider.ts:16](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/swap/EvmBaseSwapProvider.ts#L16)

___

### swapOptions

• `Protected` **swapOptions**: [`EvmSwapOptions`](../interfaces/liquality_evm.EvmTypes.EvmSwapOptions.md)

#### Defined in

[evm/lib/swap/EvmBaseSwapProvider.ts:17](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/swap/EvmBaseSwapProvider.ts#L17)

___

### walletProvider

• `Protected` **walletProvider**: [`EvmBaseWalletProvider`](liquality_evm.EvmBaseWalletProvider.md)<`BaseProvider`, `Signer`\>

#### Overrides

Swap.walletProvider

#### Defined in

[evm/lib/swap/EvmBaseSwapProvider.ts:15](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/swap/EvmBaseSwapProvider.ts#L15)

## Methods

### canUpdateFee

▸ **canUpdateFee**(): `boolean`

#### Returns

`boolean`

#### Overrides

Swap.canUpdateFee

#### Defined in

[evm/lib/swap/EvmBaseSwapProvider.ts:136](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/swap/EvmBaseSwapProvider.ts#L136)

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

#### Overrides

Swap.claimSwap

#### Defined in

[evm/lib/swap/EvmBaseSwapProvider.ts:50](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/swap/EvmBaseSwapProvider.ts#L50)

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

#### Overrides

Swap.doesTransactionMatchInitiation

#### Defined in

[evm/lib/swap/EvmBaseSwapProvider.ts:93](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/swap/EvmBaseSwapProvider.ts#L93)

___

### findClaimSwapTransaction

▸ `Abstract` **findClaimSwapTransaction**(`swapParams`, `initTxHash`, `_blockNumber?`): `Promise`<`Transaction`<`ClaimEvent`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `initTxHash` | `string` |
| `_blockNumber?` | `number` |

#### Returns

`Promise`<`Transaction`<`ClaimEvent`\>\>

#### Overrides

Swap.findClaimSwapTransaction

#### Defined in

[evm/lib/swap/EvmBaseSwapProvider.ts:160](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/swap/EvmBaseSwapProvider.ts#L160)

___

### findInitiateSwapTransaction

▸ `Abstract` **findInitiateSwapTransaction**(`swapParams`, `_blockNumber?`): `Promise`<`Transaction`<`InitiateEvent`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `_blockNumber?` | `number` |

#### Returns

`Promise`<`Transaction`<`InitiateEvent`\>\>

#### Overrides

Swap.findInitiateSwapTransaction

#### Defined in

[evm/lib/swap/EvmBaseSwapProvider.ts:156](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/swap/EvmBaseSwapProvider.ts#L156)

___

### findRefundSwapTransaction

▸ `Abstract` **findRefundSwapTransaction**(`swapParams`, `initTxHash`, `blockNumber?`): `Promise`<`Transaction`<`RefundEvent`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `initTxHash` | `string` |
| `blockNumber?` | `number` |

#### Returns

`Promise`<`Transaction`<`RefundEvent`\>\>

#### Overrides

Swap.findRefundSwapTransaction

#### Defined in

[evm/lib/swap/EvmBaseSwapProvider.ts:158](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/swap/EvmBaseSwapProvider.ts#L158)

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

▸ **getSwapSecret**(`claimTx`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `claimTx` | `string` |

#### Returns

`Promise`<`string`\>

#### Overrides

Swap.getSwapSecret

#### Defined in

[evm/lib/swap/EvmBaseSwapProvider.ts:119](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/swap/EvmBaseSwapProvider.ts#L119)

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

▸ **initiateSwap**(`swapParams`, `fee`): `Promise`<`Transaction`<`TransactionResponse`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `fee` | `FeeType` |

#### Returns

`Promise`<`Transaction`<`TransactionResponse`\>\>

#### Overrides

Swap.initiateSwap

#### Defined in

[evm/lib/swap/EvmBaseSwapProvider.ts:29](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/swap/EvmBaseSwapProvider.ts#L29)

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

#### Overrides

Swap.refundSwap

#### Defined in

[evm/lib/swap/EvmBaseSwapProvider.ts:75](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/swap/EvmBaseSwapProvider.ts#L75)

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

### tryParseLog

▸ `Protected` **tryParseLog**(`log`): `LogDescription`

#### Parameters

| Name | Type |
| :------ | :------ |
| `log` | `Log` |

#### Returns

`LogDescription`

#### Defined in

[evm/lib/swap/EvmBaseSwapProvider.ts:144](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/swap/EvmBaseSwapProvider.ts#L144)

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

[evm/lib/swap/EvmBaseSwapProvider.ts:140](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/swap/EvmBaseSwapProvider.ts#L140)

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
