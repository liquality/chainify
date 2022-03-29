# Interface: WalletProvider

[@liquality/types](../wiki/@liquality.types).WalletProvider

## Table of contents

### Properties

- [canUpdateFee](../wiki/@liquality.types.WalletProvider#canupdatefee)

### Methods

- [exportPrivateKey](../wiki/@liquality.types.WalletProvider#exportprivatekey)
- [getAddresses](../wiki/@liquality.types.WalletProvider#getaddresses)
- [getConnectedNetwork](../wiki/@liquality.types.WalletProvider#getconnectednetwork)
- [getUnusedAddress](../wiki/@liquality.types.WalletProvider#getunusedaddress)
- [getUsedAddresses](../wiki/@liquality.types.WalletProvider#getusedaddresses)
- [isWalletAvailable](../wiki/@liquality.types.WalletProvider#iswalletavailable)
- [sendBatchTransaction](../wiki/@liquality.types.WalletProvider#sendbatchtransaction)
- [sendSweepTransaction](../wiki/@liquality.types.WalletProvider#sendsweeptransaction)
- [sendTransaction](../wiki/@liquality.types.WalletProvider#sendtransaction)
- [signMessage](../wiki/@liquality.types.WalletProvider#signmessage)
- [updateTransactionFee](../wiki/@liquality.types.WalletProvider#updatetransactionfee)

## Properties

### canUpdateFee

• `Optional` **canUpdateFee**: `boolean` \| () => `boolean`

Flag indicating if the wallet allows apps to update transaction fees

**`returns`** True if wallet accepts fee updating

#### Defined in

[types/lib/Wallet.ts:101](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Wallet.ts#L101)

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

[types/lib/Wallet.ts:110](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Wallet.ts#L110)

___

### getAddresses

▸ **getAddresses**(`startingIndex?`, `numAddresses?`, `change?`): `Promise`<[`Address`](../wiki/@liquality.types.Address)[]\>

Get addresses/accounts of the user.

#### Parameters

| Name | Type |
| :------ | :------ |
| `startingIndex?` | `number` |
| `numAddresses?` | `number` |
| `change?` | `boolean` |

#### Returns

`Promise`<[`Address`](../wiki/@liquality.types.Address)[]\>

Resolves with a list
 of addresses.
 Rejects with InvalidProviderResponseError if provider's response is invalid.

#### Defined in

[types/lib/Wallet.ts:23](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Wallet.ts#L23)

___

### getConnectedNetwork

▸ **getConnectedNetwork**(): `Promise`<`any`\>

Retrieve the network connected to by the wallet

#### Returns

`Promise`<`any`\>

Resolves with the network object

#### Defined in

[types/lib/Wallet.ts:89](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Wallet.ts#L89)

___

### getUnusedAddress

▸ **getUnusedAddress**(`change?`, `numAddressPerCall?`): `Promise`<[`Address`](../wiki/@liquality.types.Address)\>

Get unused address/account of the user.

#### Parameters

| Name | Type |
| :------ | :------ |
| `change?` | `boolean` |
| `numAddressPerCall?` | `number` |

#### Returns

`Promise`<[`Address`](../wiki/@liquality.types.Address)\>

Resolves with a address
 object.
 Rejects with InvalidProviderResponseError if provider's response is invalid.

#### Defined in

[types/lib/Wallet.ts:75](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Wallet.ts#L75)

___

### getUsedAddresses

▸ **getUsedAddresses**(`numAddressPerCall?`): `Promise`<[`Address`](../wiki/@liquality.types.Address)[]\>

Get used addresses/accounts of the user.

#### Parameters

| Name | Type |
| :------ | :------ |
| `numAddressPerCall?` | `number` |

#### Returns

`Promise`<[`Address`](../wiki/@liquality.types.Address)[]\>

Resolves with a list
 of addresses.
 Rejects with InvalidProviderResponseError if provider's response is invalid.

#### Defined in

[types/lib/Wallet.ts:32](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Wallet.ts#L32)

___

### isWalletAvailable

▸ **isWalletAvailable**(): `Promise`<`boolean`\>

Retrieve the availability status of the wallet

#### Returns

`Promise`<`boolean`\>

True if the wallet is available to use

#### Defined in

[types/lib/Wallet.ts:95](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Wallet.ts#L95)

___

### sendBatchTransaction

▸ **sendBatchTransaction**(`transactions`): `Promise`<[`Transaction`](../wiki/@liquality.types.Transaction)<`any`\>[]\>

Create, sign & broad a transaction with multiple outputs.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transactions` | [`TransactionRequest`](../wiki/@liquality.types#transactionrequest)[] | to, value, data |

#### Returns

`Promise`<[`Transaction`](../wiki/@liquality.types.Transaction)<`any`\>[]\>

Resolves with a signed transaction.

#### Defined in

[types/lib/Wallet.ts:65](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Wallet.ts#L65)

___

### sendSweepTransaction

▸ **sendSweepTransaction**(`address`, `asset`, `fee?`): `Promise`<[`Transaction`](../wiki/@liquality.types.Transaction)<`any`\>\>

Create, sign & broadcast a sweep transaction.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`AddressType`](../wiki/@liquality.types#addresstype) | External address. |
| `asset` | [`Asset`](../wiki/@liquality.types.Asset) | - |
| `fee?` | [`FeeType`](../wiki/@liquality.types#feetype) | - |

#### Returns

`Promise`<[`Transaction`](../wiki/@liquality.types.Transaction)<`any`\>\>

Resolves with a signed transaction.

#### Defined in

[types/lib/Wallet.ts:50](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Wallet.ts#L50)

___

### sendTransaction

▸ **sendTransaction**(`options`): `Promise`<[`Transaction`](../wiki/@liquality.types.Transaction)<`any`\>\>

Create, sign & broadcast a transaction.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`TransactionRequest`](../wiki/@liquality.types#transactionrequest) |

#### Returns

`Promise`<[`Transaction`](../wiki/@liquality.types.Transaction)<`any`\>\>

Resolves with a signed transaction.

#### Defined in

[types/lib/Wallet.ts:42](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Wallet.ts#L42)

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

[types/lib/Wallet.ts:83](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Wallet.ts#L83)

___

### updateTransactionFee

▸ **updateTransactionFee**(`tx`, `newFee`): `Promise`<[`Transaction`](../wiki/@liquality.types.Transaction)<`any`\>\>

Update the fee of a transaction.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tx` | `string` \| [`Transaction`](../wiki/@liquality.types.Transaction)<`any`\> | Transaction object or hash of the transaction to update |
| `newFee` | [`FeeType`](../wiki/@liquality.types#feetype) | New fee price in native unit (e.g. sat/b, wei) |

#### Returns

`Promise`<[`Transaction`](../wiki/@liquality.types.Transaction)<`any`\>\>

Resolves with the new transaction

#### Defined in

[types/lib/Wallet.ts:58](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Wallet.ts#L58)
