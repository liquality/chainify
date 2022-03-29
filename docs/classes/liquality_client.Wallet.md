[](../README.md) / [Exports](../modules.md) / [@liquality/client](../modules/liquality_client.md) / Wallet

# Class: Wallet<T, S\>

[@liquality/client](../modules/liquality_client.md).Wallet

## Type parameters

| Name |
| :------ |
| `T` |
| `S` |

## Implements

- `WalletProvider`

## Table of contents

### Constructors

- [constructor](liquality_client.Wallet.md#constructor)

### Properties

- [chainProvider](liquality_client.Wallet.md#chainprovider)

### Methods

- [canUpdateFee](liquality_client.Wallet.md#canupdatefee)
- [exportPrivateKey](liquality_client.Wallet.md#exportprivatekey)
- [getAddress](liquality_client.Wallet.md#getaddress)
- [getAddresses](liquality_client.Wallet.md#getaddresses)
- [getBalance](liquality_client.Wallet.md#getbalance)
- [getChainProvider](liquality_client.Wallet.md#getchainprovider)
- [getConnectedNetwork](liquality_client.Wallet.md#getconnectednetwork)
- [getSigner](liquality_client.Wallet.md#getsigner)
- [getUnusedAddress](liquality_client.Wallet.md#getunusedaddress)
- [getUsedAddresses](liquality_client.Wallet.md#getusedaddresses)
- [isWalletAvailable](liquality_client.Wallet.md#iswalletavailable)
- [sendBatchTransaction](liquality_client.Wallet.md#sendbatchtransaction)
- [sendSweepTransaction](liquality_client.Wallet.md#sendsweeptransaction)
- [sendTransaction](liquality_client.Wallet.md#sendtransaction)
- [setChainProvider](liquality_client.Wallet.md#setchainprovider)
- [signMessage](liquality_client.Wallet.md#signmessage)
- [updateTransactionFee](liquality_client.Wallet.md#updatetransactionfee)

## Constructors

### constructor

• **new Wallet**<`T`, `S`\>(`chainProvider?`)

#### Type parameters

| Name |
| :------ |
| `T` |
| `S` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainProvider?` | [`Chain`](liquality_client.Chain.md)<`T`, `Network`\> |

#### Defined in

[client/lib/Wallet.ts:17](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Wallet.ts#L17)

## Properties

### chainProvider

• `Protected` **chainProvider**: [`Chain`](liquality_client.Chain.md)<`T`, `Network`\>

#### Defined in

[client/lib/Wallet.ts:15](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Wallet.ts#L15)

## Methods

### canUpdateFee

▸ `Abstract` **canUpdateFee**(): `boolean`

#### Returns

`boolean`

#### Implementation of

WalletProvider.canUpdateFee

#### Defined in

[client/lib/Wallet.ts:57](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Wallet.ts#L57)

___

### exportPrivateKey

▸ `Abstract` **exportPrivateKey**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Implementation of

WalletProvider.exportPrivateKey

#### Defined in

[client/lib/Wallet.ts:53](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Wallet.ts#L53)

___

### getAddress

▸ `Abstract` **getAddress**(): `Promise`<`AddressType`\>

#### Returns

`Promise`<`AddressType`\>

#### Defined in

[client/lib/Wallet.ts:33](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Wallet.ts#L33)

___

### getAddresses

▸ `Abstract` **getAddresses**(`start?`, `numAddresses?`, `change?`): `Promise`<`Address`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `start?` | `number` |
| `numAddresses?` | `number` |
| `change?` | `boolean` |

#### Returns

`Promise`<`Address`[]\>

#### Implementation of

WalletProvider.getAddresses

#### Defined in

[client/lib/Wallet.ts:39](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Wallet.ts#L39)

___

### getBalance

▸ `Abstract` **getBalance**(`assets`): `Promise`<`BigNumber`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `assets` | `Asset`[] |

#### Returns

`Promise`<`BigNumber`[]\>

#### Defined in

[client/lib/Wallet.ts:51](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Wallet.ts#L51)

___

### getChainProvider

▸ **getChainProvider**(): [`Chain`](liquality_client.Chain.md)<`T`, `Network`\>

#### Returns

[`Chain`](liquality_client.Chain.md)<`T`, `Network`\>

#### Defined in

[client/lib/Wallet.ts:25](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Wallet.ts#L25)

___

### getConnectedNetwork

▸ `Abstract` **getConnectedNetwork**(): `Promise`<`Network`\>

#### Returns

`Promise`<`Network`\>

#### Implementation of

WalletProvider.getConnectedNetwork

#### Defined in

[client/lib/Wallet.ts:29](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Wallet.ts#L29)

___

### getSigner

▸ `Abstract` **getSigner**(): `S`

#### Returns

`S`

#### Defined in

[client/lib/Wallet.ts:31](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Wallet.ts#L31)

___

### getUnusedAddress

▸ `Abstract` **getUnusedAddress**(`change?`, `numAddressPerCall?`): `Promise`<`Address`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `change?` | `boolean` |
| `numAddressPerCall?` | `number` |

#### Returns

`Promise`<`Address`\>

#### Implementation of

WalletProvider.getUnusedAddress

#### Defined in

[client/lib/Wallet.ts:35](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Wallet.ts#L35)

___

### getUsedAddresses

▸ `Abstract` **getUsedAddresses**(`numAddressPerCall?`): `Promise`<`Address`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `numAddressPerCall?` | `number` |

#### Returns

`Promise`<`Address`[]\>

#### Implementation of

WalletProvider.getUsedAddresses

#### Defined in

[client/lib/Wallet.ts:37](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Wallet.ts#L37)

___

### isWalletAvailable

▸ `Abstract` **isWalletAvailable**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Implementation of

WalletProvider.isWalletAvailable

#### Defined in

[client/lib/Wallet.ts:55](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Wallet.ts#L55)

___

### sendBatchTransaction

▸ `Abstract` **sendBatchTransaction**(`txRequests`): `Promise`<`Transaction`<`any`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `txRequests` | `TransactionRequest`[] |

#### Returns

`Promise`<`Transaction`<`any`\>[]\>

#### Implementation of

WalletProvider.sendBatchTransaction

#### Defined in

[client/lib/Wallet.ts:45](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Wallet.ts#L45)

___

### sendSweepTransaction

▸ `Abstract` **sendSweepTransaction**(`address`, `asset`, `fee?`): `Promise`<`Transaction`<`any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `AddressType` |
| `asset` | `Asset` |
| `fee?` | `FeeType` |

#### Returns

`Promise`<`Transaction`<`any`\>\>

#### Implementation of

WalletProvider.sendSweepTransaction

#### Defined in

[client/lib/Wallet.ts:47](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Wallet.ts#L47)

___

### sendTransaction

▸ `Abstract` **sendTransaction**(`txRequest`): `Promise`<`Transaction`<`any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `txRequest` | `TransactionRequest` |

#### Returns

`Promise`<`Transaction`<`any`\>\>

#### Implementation of

WalletProvider.sendTransaction

#### Defined in

[client/lib/Wallet.ts:43](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Wallet.ts#L43)

___

### setChainProvider

▸ **setChainProvider**(`chainProvider`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainProvider` | [`Chain`](liquality_client.Chain.md)<`T`, `Network`\> |

#### Returns

`void`

#### Defined in

[client/lib/Wallet.ts:21](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Wallet.ts#L21)

___

### signMessage

▸ `Abstract` **signMessage**(`message`, `from`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |
| `from` | `AddressType` |

#### Returns

`Promise`<`string`\>

#### Implementation of

WalletProvider.signMessage

#### Defined in

[client/lib/Wallet.ts:41](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Wallet.ts#L41)

___

### updateTransactionFee

▸ `Abstract` **updateTransactionFee**(`tx`, `newFee`): `Promise`<`Transaction`<`any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | `string` \| `Transaction`<`any`\> |
| `newFee` | `FeeType` |

#### Returns

`Promise`<`Transaction`<`any`\>\>

#### Implementation of

WalletProvider.updateTransactionFee

#### Defined in

[client/lib/Wallet.ts:49](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Wallet.ts#L49)
