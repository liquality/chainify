[](../README.md) / [Exports](../modules.md) / [@liquality/types](../modules/liquality_types.md) / WalletProvider

# Interface: WalletProvider

[@liquality/types](../modules/liquality_types.md).WalletProvider

## Table of contents

### Properties

- [canUpdateFee](liquality_types.WalletProvider.md#canupdatefee)

### Methods

- [exportPrivateKey](liquality_types.WalletProvider.md#exportprivatekey)
- [getAddresses](liquality_types.WalletProvider.md#getaddresses)
- [getConnectedNetwork](liquality_types.WalletProvider.md#getconnectednetwork)
- [getUnusedAddress](liquality_types.WalletProvider.md#getunusedaddress)
- [getUsedAddresses](liquality_types.WalletProvider.md#getusedaddresses)
- [isWalletAvailable](liquality_types.WalletProvider.md#iswalletavailable)
- [sendBatchTransaction](liquality_types.WalletProvider.md#sendbatchtransaction)
- [sendSweepTransaction](liquality_types.WalletProvider.md#sendsweeptransaction)
- [sendTransaction](liquality_types.WalletProvider.md#sendtransaction)
- [signMessage](liquality_types.WalletProvider.md#signmessage)
- [updateTransactionFee](liquality_types.WalletProvider.md#updatetransactionfee)

## Properties

### canUpdateFee

• `Optional` **canUpdateFee**: `boolean` \| () => `boolean`

Flag indicating if the wallet allows apps to update transaction fees

**`returns`** True if wallet accepts fee updating

#### Defined in

[types/lib/Wallet.ts:101](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Wallet.ts#L101)

## Methods

### exportPrivateKey

▸ `Optional` **exportPrivateKey**(): `Promise`<`string`\>

Exports the private key for the account
for BTC, https://en.bitcoin.it/wiki/Wallet_import_format
for ETH, the privateKey
for NEAR, the secretKey

#### Returns

`Promise`<`string`\>

Resolves with the key as a string

#### Defined in

[types/lib/Wallet.ts:110](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Wallet.ts#L110)

___

### getAddresses

▸ **getAddresses**(`startingIndex?`, `numAddresses?`, `change?`): `Promise`<[`Address`](../classes/liquality_types.Address.md)[]\>

Get addresses/accounts of the user.

#### Parameters

| Name | Type |
| :------ | :------ |
| `startingIndex?` | `number` |
| `numAddresses?` | `number` |
| `change?` | `boolean` |

#### Returns

`Promise`<[`Address`](../classes/liquality_types.Address.md)[]\>

Resolves with a list
 of addresses.
 Rejects with InvalidProviderResponseError if provider's response is invalid.

#### Defined in

[types/lib/Wallet.ts:23](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Wallet.ts#L23)

___

### getConnectedNetwork

▸ **getConnectedNetwork**(): `Promise`<`any`\>

Retrieve the network connected to by the wallet

#### Returns

`Promise`<`any`\>

Resolves with the network object

#### Defined in

[types/lib/Wallet.ts:89](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Wallet.ts#L89)

___

### getUnusedAddress

▸ **getUnusedAddress**(`change?`, `numAddressPerCall?`): `Promise`<[`Address`](../classes/liquality_types.Address.md)\>

Get unused address/account of the user.

#### Parameters

| Name | Type |
| :------ | :------ |
| `change?` | `boolean` |
| `numAddressPerCall?` | `number` |

#### Returns

`Promise`<[`Address`](../classes/liquality_types.Address.md)\>

Resolves with a address
 object.
 Rejects with InvalidProviderResponseError if provider's response is invalid.

#### Defined in

[types/lib/Wallet.ts:75](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Wallet.ts#L75)

___

### getUsedAddresses

▸ **getUsedAddresses**(`numAddressPerCall?`): `Promise`<[`Address`](../classes/liquality_types.Address.md)[]\>

Get used addresses/accounts of the user.

#### Parameters

| Name | Type |
| :------ | :------ |
| `numAddressPerCall?` | `number` |

#### Returns

`Promise`<[`Address`](../classes/liquality_types.Address.md)[]\>

Resolves with a list
 of addresses.
 Rejects with InvalidProviderResponseError if provider's response is invalid.

#### Defined in

[types/lib/Wallet.ts:32](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Wallet.ts#L32)

___

### isWalletAvailable

▸ **isWalletAvailable**(): `Promise`<`boolean`\>

Retrieve the availability status of the wallet

#### Returns

`Promise`<`boolean`\>

True if the wallet is available to use

#### Defined in

[types/lib/Wallet.ts:95](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Wallet.ts#L95)

___

### sendBatchTransaction

▸ **sendBatchTransaction**(`transactions`): `Promise`<[`Transaction`](liquality_types.Transaction.md)<`any`\>[]\>

Create, sign & broad a transaction with multiple outputs.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transactions` | [`TransactionRequest`](../modules/liquality_types.md#transactionrequest)[] | to, value, data |

#### Returns

`Promise`<[`Transaction`](liquality_types.Transaction.md)<`any`\>[]\>

Resolves with a signed transaction.

#### Defined in

[types/lib/Wallet.ts:65](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Wallet.ts#L65)

___

### sendSweepTransaction

▸ **sendSweepTransaction**(`address`, `asset`, `fee?`): `Promise`<[`Transaction`](liquality_types.Transaction.md)<`any`\>\>

Create, sign & broadcast a sweep transaction.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`AddressType`](../modules/liquality_types.md#addresstype) | External address. |
| `asset` | [`Asset`](liquality_types.Asset.md) | - |
| `fee?` | [`FeeType`](../modules/liquality_types.md#feetype) | - |

#### Returns

`Promise`<[`Transaction`](liquality_types.Transaction.md)<`any`\>\>

Resolves with a signed transaction.

#### Defined in

[types/lib/Wallet.ts:50](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Wallet.ts#L50)

___

### sendTransaction

▸ **sendTransaction**(`options`): `Promise`<[`Transaction`](liquality_types.Transaction.md)<`any`\>\>

Create, sign & broadcast a transaction.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`TransactionRequest`](../modules/liquality_types.md#transactionrequest) |

#### Returns

`Promise`<[`Transaction`](liquality_types.Transaction.md)<`any`\>\>

Resolves with a signed transaction.

#### Defined in

[types/lib/Wallet.ts:42](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Wallet.ts#L42)

___

### signMessage

▸ **signMessage**(`message`, `from`): `Promise`<`string`\>

Sign a message.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | Message to be signed. |
| `from` | `string` | The address from which the message is signed. |

#### Returns

`Promise`<`string`\>

Resolves with a signed message.

#### Defined in

[types/lib/Wallet.ts:83](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Wallet.ts#L83)

___

### updateTransactionFee

▸ **updateTransactionFee**(`tx`, `newFee`): `Promise`<[`Transaction`](liquality_types.Transaction.md)<`any`\>\>

Update the fee of a transaction.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tx` | `string` \| [`Transaction`](liquality_types.Transaction.md)<`any`\> | Transaction object or hash of the transaction to update |
| `newFee` | [`FeeType`](../modules/liquality_types.md#feetype) | New fee price in native unit (e.g. sat/b, wei) |

#### Returns

`Promise`<[`Transaction`](liquality_types.Transaction.md)<`any`\>\>

Resolves with the new transaction

#### Defined in

[types/lib/Wallet.ts:58](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Wallet.ts#L58)
