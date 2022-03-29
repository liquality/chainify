[](../README.md) / [Exports](../modules.md) / [@liquality/evm](../modules/liquality_evm.md) / EvmSwapProvider

# Class: EvmSwapProvider

[@liquality/evm](../modules/liquality_evm.md).EvmSwapProvider

## Hierarchy

- [`EvmBaseSwapProvider`](liquality_evm.EvmBaseSwapProvider.md)

  ↳ **`EvmSwapProvider`**

## Table of contents

### Constructors

- [constructor](liquality_evm.EvmSwapProvider.md#constructor)

### Properties

- [contract](liquality_evm.EvmSwapProvider.md#contract)
- [swapOptions](liquality_evm.EvmSwapProvider.md#swapoptions)
- [walletProvider](liquality_evm.EvmSwapProvider.md#walletprovider)

### Methods

- [canUpdateFee](liquality_evm.EvmSwapProvider.md#canupdatefee)
- [claimSwap](liquality_evm.EvmSwapProvider.md#claimswap)
- [doesTransactionMatchInitiation](liquality_evm.EvmSwapProvider.md#doestransactionmatchinitiation)
- [findClaimSwapTransaction](liquality_evm.EvmSwapProvider.md#findclaimswaptransaction)
- [findInitiateSwapTransaction](liquality_evm.EvmSwapProvider.md#findinitiateswaptransaction)
- [findRefundSwapTransaction](liquality_evm.EvmSwapProvider.md#findrefundswaptransaction)
- [findTx](liquality_evm.EvmSwapProvider.md#findtx)
- [generateSecret](liquality_evm.EvmSwapProvider.md#generatesecret)
- [getSwapSecret](liquality_evm.EvmSwapProvider.md#getswapsecret)
- [getWallet](liquality_evm.EvmSwapProvider.md#getwallet)
- [initiateSwap](liquality_evm.EvmSwapProvider.md#initiateswap)
- [refundSwap](liquality_evm.EvmSwapProvider.md#refundswap)
- [searchLogs](liquality_evm.EvmSwapProvider.md#searchlogs)
- [setWallet](liquality_evm.EvmSwapProvider.md#setwallet)
- [tryParseLog](liquality_evm.EvmSwapProvider.md#tryparselog)
- [updateTransactionFee](liquality_evm.EvmSwapProvider.md#updatetransactionfee)
- [validateSwapParams](liquality_evm.EvmSwapProvider.md#validateswapparams)
- [verifyInitiateSwapTransaction](liquality_evm.EvmSwapProvider.md#verifyinitiateswaptransaction)

## Constructors

### constructor

• **new EvmSwapProvider**(`swapOptions`, `walletProvider`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapOptions` | [`EvmSwapOptions`](../interfaces/liquality_evm.EvmTypes.EvmSwapOptions.md) |
| `walletProvider` | [`EvmBaseWalletProvider`](liquality_evm.EvmBaseWalletProvider.md)<`BaseProvider`, `Signer`\> |

#### Overrides

[EvmBaseSwapProvider](liquality_evm.EvmBaseSwapProvider.md).[constructor](liquality_evm.EvmBaseSwapProvider.md#constructor)

#### Defined in

[evm/lib/swap/EvmSwapProvider.ts:12](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/swap/EvmSwapProvider.ts#L12)

## Properties

### contract

• `Protected` **contract**: `LiqualityHTLC`

#### Inherited from

[EvmBaseSwapProvider](liquality_evm.EvmBaseSwapProvider.md).[contract](liquality_evm.EvmBaseSwapProvider.md#contract)

#### Defined in

[evm/lib/swap/EvmBaseSwapProvider.ts:16](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/swap/EvmBaseSwapProvider.ts#L16)

___

### swapOptions

• `Protected` **swapOptions**: [`EvmSwapOptions`](../interfaces/liquality_evm.EvmTypes.EvmSwapOptions.md)

#### Inherited from

[EvmBaseSwapProvider](liquality_evm.EvmBaseSwapProvider.md).[swapOptions](liquality_evm.EvmBaseSwapProvider.md#swapoptions)

#### Defined in

[evm/lib/swap/EvmBaseSwapProvider.ts:17](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/swap/EvmBaseSwapProvider.ts#L17)

___

### walletProvider

• `Protected` **walletProvider**: [`EvmBaseWalletProvider`](liquality_evm.EvmBaseWalletProvider.md)<`BaseProvider`, `Signer`\>

#### Overrides

[EvmBaseSwapProvider](liquality_evm.EvmBaseSwapProvider.md).[walletProvider](liquality_evm.EvmBaseSwapProvider.md#walletprovider)

#### Defined in

[evm/lib/swap/EvmSwapProvider.ts:10](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/swap/EvmSwapProvider.ts#L10)

## Methods

### canUpdateFee

▸ **canUpdateFee**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[EvmBaseSwapProvider](liquality_evm.EvmBaseSwapProvider.md).[canUpdateFee](liquality_evm.EvmBaseSwapProvider.md#canupdatefee)

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

#### Inherited from

[EvmBaseSwapProvider](liquality_evm.EvmBaseSwapProvider.md).[claimSwap](liquality_evm.EvmBaseSwapProvider.md#claimswap)

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

#### Inherited from

[EvmBaseSwapProvider](liquality_evm.EvmBaseSwapProvider.md).[doesTransactionMatchInitiation](liquality_evm.EvmBaseSwapProvider.md#doestransactionmatchinitiation)

#### Defined in

[evm/lib/swap/EvmBaseSwapProvider.ts:93](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/swap/EvmBaseSwapProvider.ts#L93)

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

[EvmBaseSwapProvider](liquality_evm.EvmBaseSwapProvider.md).[findClaimSwapTransaction](liquality_evm.EvmBaseSwapProvider.md#findclaimswaptransaction)

#### Defined in

[evm/lib/swap/EvmSwapProvider.ts:36](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/swap/EvmSwapProvider.ts#L36)

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

[EvmBaseSwapProvider](liquality_evm.EvmBaseSwapProvider.md).[findInitiateSwapTransaction](liquality_evm.EvmBaseSwapProvider.md#findinitiateswaptransaction)

#### Defined in

[evm/lib/swap/EvmSwapProvider.ts:16](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/swap/EvmSwapProvider.ts#L16)

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

[EvmBaseSwapProvider](liquality_evm.EvmBaseSwapProvider.md).[findRefundSwapTransaction](liquality_evm.EvmBaseSwapProvider.md#findrefundswaptransaction)

#### Defined in

[evm/lib/swap/EvmSwapProvider.ts:44](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/swap/EvmSwapProvider.ts#L44)

___

### findTx

▸ `Private` **findTx**<`EventType`\>(`swapParams`, `initTxHash`, `eventFilter`): `Promise`<`Transaction`<`EventType`\>\>

#### Type parameters

| Name |
| :------ |
| `EventType` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `swapParams` | `SwapParams` |
| `initTxHash` | `string` |
| `eventFilter` | `string` |

#### Returns

`Promise`<`Transaction`<`EventType`\>\>

#### Defined in

[evm/lib/swap/EvmSwapProvider.ts:62](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/swap/EvmSwapProvider.ts#L62)

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

[EvmBaseSwapProvider](liquality_evm.EvmBaseSwapProvider.md).[generateSecret](liquality_evm.EvmBaseSwapProvider.md#generatesecret)

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

[EvmBaseSwapProvider](liquality_evm.EvmBaseSwapProvider.md).[getSwapSecret](liquality_evm.EvmBaseSwapProvider.md#getswapsecret)

#### Defined in

[evm/lib/swap/EvmBaseSwapProvider.ts:119](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/swap/EvmBaseSwapProvider.ts#L119)

___

### getWallet

▸ **getWallet**(): `any`

#### Returns

`any`

#### Inherited from

[EvmBaseSwapProvider](liquality_evm.EvmBaseSwapProvider.md).[getWallet](liquality_evm.EvmBaseSwapProvider.md#getwallet)

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

[EvmBaseSwapProvider](liquality_evm.EvmBaseSwapProvider.md).[initiateSwap](liquality_evm.EvmBaseSwapProvider.md#initiateswap)

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

#### Inherited from

[EvmBaseSwapProvider](liquality_evm.EvmBaseSwapProvider.md).[refundSwap](liquality_evm.EvmBaseSwapProvider.md#refundswap)

#### Defined in

[evm/lib/swap/EvmBaseSwapProvider.ts:75](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/swap/EvmBaseSwapProvider.ts#L75)

___

### searchLogs

▸ `Private` **searchLogs**(`callback`, `currentBlock`): `Promise`<`Transaction`<`any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | (`from`: `number`, `to`: `number`) => `Promise`<`Transaction`<`any`\>\> |
| `currentBlock` | `number` |

#### Returns

`Promise`<`Transaction`<`any`\>\>

#### Defined in

[evm/lib/swap/EvmSwapProvider.ts:48](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/swap/EvmSwapProvider.ts#L48)

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

[EvmBaseSwapProvider](liquality_evm.EvmBaseSwapProvider.md).[setWallet](liquality_evm.EvmBaseSwapProvider.md#setwallet)

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

[EvmBaseSwapProvider](liquality_evm.EvmBaseSwapProvider.md).[tryParseLog](liquality_evm.EvmBaseSwapProvider.md#tryparselog)

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

#### Inherited from

[EvmBaseSwapProvider](liquality_evm.EvmBaseSwapProvider.md).[updateTransactionFee](liquality_evm.EvmBaseSwapProvider.md#updatetransactionfee)

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

[EvmBaseSwapProvider](liquality_evm.EvmBaseSwapProvider.md).[validateSwapParams](liquality_evm.EvmBaseSwapProvider.md#validateswapparams)

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

[EvmBaseSwapProvider](liquality_evm.EvmBaseSwapProvider.md).[verifyInitiateSwapTransaction](liquality_evm.EvmBaseSwapProvider.md#verifyinitiateswaptransaction)

#### Defined in

client/dist/lib/Swap.d.ts:8
