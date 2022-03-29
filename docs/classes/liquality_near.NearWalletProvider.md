[](../README.md) / [Exports](../modules.md) / [@liquality/near](../modules/liquality_near.md) / NearWalletProvider

# Class: NearWalletProvider

[@liquality/near](../modules/liquality_near.md).NearWalletProvider

## Hierarchy

- `default`<`providers.JsonRpcProvider`, `InMemorySigner`\>

  ↳ **`NearWalletProvider`**

## Table of contents

### Constructors

- [constructor](liquality_near.NearWalletProvider.md#constructor)

### Properties

- [\_addressCache](liquality_near.NearWalletProvider.md#_addresscache)
- [\_derivationPath](liquality_near.NearWalletProvider.md#_derivationpath)
- [\_helper](liquality_near.NearWalletProvider.md#_helper)
- [\_keyStore](liquality_near.NearWalletProvider.md#_keystore)
- [\_wallet](liquality_near.NearWalletProvider.md#_wallet)
- [\_walletOptions](liquality_near.NearWalletProvider.md#_walletoptions)
- [chainProvider](liquality_near.NearWalletProvider.md#chainprovider)

### Methods

- [canUpdateFee](liquality_near.NearWalletProvider.md#canupdatefee)
- [exportPrivateKey](liquality_near.NearWalletProvider.md#exportprivatekey)
- [getAccount](liquality_near.NearWalletProvider.md#getaccount)
- [getAddress](liquality_near.NearWalletProvider.md#getaddress)
- [getAddresses](liquality_near.NearWalletProvider.md#getaddresses)
- [getBalance](liquality_near.NearWalletProvider.md#getbalance)
- [getChainProvider](liquality_near.NearWalletProvider.md#getchainprovider)
- [getConnectedNetwork](liquality_near.NearWalletProvider.md#getconnectednetwork)
- [getImplicitAccount](liquality_near.NearWalletProvider.md#getimplicitaccount)
- [getSigner](liquality_near.NearWalletProvider.md#getsigner)
- [getUnusedAddress](liquality_near.NearWalletProvider.md#getunusedaddress)
- [getUsedAddresses](liquality_near.NearWalletProvider.md#getusedaddresses)
- [isWalletAvailable](liquality_near.NearWalletProvider.md#iswalletavailable)
- [sendBatchTransaction](liquality_near.NearWalletProvider.md#sendbatchtransaction)
- [sendSweepTransaction](liquality_near.NearWalletProvider.md#sendsweeptransaction)
- [sendTransaction](liquality_near.NearWalletProvider.md#sendtransaction)
- [setChainProvider](liquality_near.NearWalletProvider.md#setchainprovider)
- [signMessage](liquality_near.NearWalletProvider.md#signmessage)
- [updateTransactionFee](liquality_near.NearWalletProvider.md#updatetransactionfee)

## Constructors

### constructor

• **new NearWalletProvider**(`walletOptions`, `chainProvider`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `walletOptions` | `WalletOptions` |
| `chainProvider` | `default`<`JsonRpcProvider`\> |

#### Overrides

Wallet&lt;providers.JsonRpcProvider, InMemorySigner\&gt;.constructor

#### Defined in

[near/lib/wallet/NearWalletProvider.ts:28](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/wallet/NearWalletProvider.ts#L28)

## Properties

### \_addressCache

• `Private` **\_addressCache**: `Object`

#### Index signature

▪ [key: `string`]: `Address`

#### Defined in

[near/lib/wallet/NearWalletProvider.ts:25](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/wallet/NearWalletProvider.ts#L25)

___

### \_derivationPath

• `Private` **\_derivationPath**: `string`

#### Defined in

[near/lib/wallet/NearWalletProvider.ts:22](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/wallet/NearWalletProvider.ts#L22)

___

### \_helper

• `Private` **\_helper**: `default`

#### Defined in

[near/lib/wallet/NearWalletProvider.ts:26](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/wallet/NearWalletProvider.ts#L26)

___

### \_keyStore

• `Private` **\_keyStore**: `InMemoryKeyStore`

#### Defined in

[near/lib/wallet/NearWalletProvider.ts:24](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/wallet/NearWalletProvider.ts#L24)

___

### \_wallet

• `Private` **\_wallet**: [`NearWallet`](../interfaces/liquality_near.NearTypes.NearWallet.md)

#### Defined in

[near/lib/wallet/NearWalletProvider.ts:23](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/wallet/NearWalletProvider.ts#L23)

___

### \_walletOptions

• `Private` **\_walletOptions**: `WalletOptions`

#### Defined in

[near/lib/wallet/NearWalletProvider.ts:21](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/wallet/NearWalletProvider.ts#L21)

___

### chainProvider

• `Protected` **chainProvider**: `default`<`JsonRpcProvider`\>

#### Inherited from

Wallet.chainProvider

#### Defined in

client/dist/lib/Wallet.d.ts:4

## Methods

### canUpdateFee

▸ **canUpdateFee**(): `boolean`

#### Returns

`boolean`

#### Overrides

Wallet.canUpdateFee

#### Defined in

[near/lib/wallet/NearWalletProvider.ts:158](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/wallet/NearWalletProvider.ts#L158)

___

### exportPrivateKey

▸ **exportPrivateKey**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Overrides

Wallet.exportPrivateKey

#### Defined in

[near/lib/wallet/NearWalletProvider.ts:150](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/wallet/NearWalletProvider.ts#L150)

___

### getAccount

▸ `Private` **getAccount**(`accountId`): [`NearAccount`](liquality_near.NearTypes.NearAccount.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `accountId` | `string` |

#### Returns

[`NearAccount`](liquality_near.NearTypes.NearAccount.md)

#### Defined in

[near/lib/wallet/NearWalletProvider.ts:170](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/wallet/NearWalletProvider.ts#L170)

___

### getAddress

▸ **getAddress**(): `Promise`<`Address`\>

#### Returns

`Promise`<`Address`\>

#### Overrides

Wallet.getAddress

#### Defined in

[near/lib/wallet/NearWalletProvider.ts:44](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/wallet/NearWalletProvider.ts#L44)

___

### getAddresses

▸ **getAddresses**(`start?`, `numAddresses?`): `Promise`<`Address`[]\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `start` | `number` | `0` |
| `numAddresses` | `number` | `1` |

#### Returns

`Promise`<`Address`[]\>

#### Overrides

Wallet.getAddresses

#### Defined in

[near/lib/wallet/NearWalletProvider.ts:75](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/wallet/NearWalletProvider.ts#L75)

___

### getBalance

▸ **getBalance**(`_assets`): `Promise`<`BigNumber`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_assets` | `Asset`[] |

#### Returns

`Promise`<`BigNumber`[]\>

#### Overrides

Wallet.getBalance

#### Defined in

[near/lib/wallet/NearWalletProvider.ts:145](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/wallet/NearWalletProvider.ts#L145)

___

### getChainProvider

▸ **getChainProvider**(): `default`<`JsonRpcProvider`\>

#### Returns

`default`<`JsonRpcProvider`\>

#### Inherited from

Wallet.getChainProvider

#### Defined in

client/dist/lib/Wallet.d.ts:7

___

### getConnectedNetwork

▸ **getConnectedNetwork**(): `Promise`<[`NearNetwork`](../interfaces/liquality_near.NearTypes.NearNetwork.md)\>

#### Returns

`Promise`<[`NearNetwork`](../interfaces/liquality_near.NearTypes.NearNetwork.md)\>

#### Overrides

Wallet.getConnectedNetwork

#### Defined in

[near/lib/wallet/NearWalletProvider.ts:166](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/wallet/NearWalletProvider.ts#L166)

___

### getImplicitAccount

▸ `Private` **getImplicitAccount**(`publicKey`, `index`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `publicKey` | `string` |
| `index` | `number` |

#### Returns

`Promise`<`any`\>

#### Defined in

[near/lib/wallet/NearWalletProvider.ts:181](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/wallet/NearWalletProvider.ts#L181)

___

### getSigner

▸ **getSigner**(): `InMemorySigner`

#### Returns

`InMemorySigner`

#### Overrides

Wallet.getSigner

#### Defined in

[near/lib/wallet/NearWalletProvider.ts:40](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/wallet/NearWalletProvider.ts#L40)

___

### getUnusedAddress

▸ **getUnusedAddress**(): `Promise`<`Address`\>

#### Returns

`Promise`<`Address`\>

#### Overrides

Wallet.getUnusedAddress

#### Defined in

[near/lib/wallet/NearWalletProvider.ts:67](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/wallet/NearWalletProvider.ts#L67)

___

### getUsedAddresses

▸ **getUsedAddresses**(`numAddresses?`): `Promise`<`Address`[]\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `numAddresses` | `number` | `1` |

#### Returns

`Promise`<`Address`[]\>

#### Overrides

Wallet.getUsedAddresses

#### Defined in

[near/lib/wallet/NearWalletProvider.ts:71](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/wallet/NearWalletProvider.ts#L71)

___

### isWalletAvailable

▸ **isWalletAvailable**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Overrides

Wallet.isWalletAvailable

#### Defined in

[near/lib/wallet/NearWalletProvider.ts:154](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/wallet/NearWalletProvider.ts#L154)

___

### sendBatchTransaction

▸ **sendBatchTransaction**(`txRequests`): `Promise`<`Transaction`<[`NearTxLog`](../interfaces/liquality_near.NearTypes.NearTxLog.md)\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `txRequests` | [`NearTxRequest`](../interfaces/liquality_near.NearTypes.NearTxRequest.md)[] |

#### Returns

`Promise`<`Transaction`<[`NearTxLog`](../interfaces/liquality_near.NearTypes.NearTxLog.md)\>[]\>

#### Overrides

Wallet.sendBatchTransaction

#### Defined in

[near/lib/wallet/NearWalletProvider.ts:129](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/wallet/NearWalletProvider.ts#L129)

___

### sendSweepTransaction

▸ **sendSweepTransaction**(`to`, `_asset`): `Promise`<`Transaction`<[`NearTxLog`](../interfaces/liquality_near.NearTypes.NearTxLog.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `to` | `AddressType` |
| `_asset` | `Asset` |

#### Returns

`Promise`<`Transaction`<[`NearTxLog`](../interfaces/liquality_near.NearTypes.NearTxLog.md)\>\>

#### Overrides

Wallet.sendSweepTransaction

#### Defined in

[near/lib/wallet/NearWalletProvider.ts:138](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/wallet/NearWalletProvider.ts#L138)

___

### sendTransaction

▸ **sendTransaction**(`txRequest`): `Promise`<`Transaction`<[`NearTxLog`](../interfaces/liquality_near.NearTypes.NearTxLog.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `txRequest` | [`NearTxRequest`](../interfaces/liquality_near.NearTypes.NearTxRequest.md) |

#### Returns

`Promise`<`Transaction`<[`NearTxLog`](../interfaces/liquality_near.NearTypes.NearTxLog.md)\>\>

#### Overrides

Wallet.sendTransaction

#### Defined in

[near/lib/wallet/NearWalletProvider.ts:111](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/wallet/NearWalletProvider.ts#L111)

___

### setChainProvider

▸ **setChainProvider**(`chainProvider`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainProvider` | `default`<`JsonRpcProvider`\> |

#### Returns

`void`

#### Inherited from

Wallet.setChainProvider

#### Defined in

client/dist/lib/Wallet.d.ts:6

___

### signMessage

▸ **signMessage**(`message`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |

#### Returns

`Promise`<`string`\>

#### Overrides

Wallet.signMessage

#### Defined in

[near/lib/wallet/NearWalletProvider.ts:99](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/wallet/NearWalletProvider.ts#L99)

___

### updateTransactionFee

▸ **updateTransactionFee**(`_tx`): `Promise`<`Transaction`<[`NearTxResponse`](../interfaces/liquality_near.NearTypes.NearTxResponse.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_tx` | `string` \| `Transaction`<`any`\> |

#### Returns

`Promise`<`Transaction`<[`NearTxResponse`](../interfaces/liquality_near.NearTypes.NearTxResponse.md)\>\>

#### Overrides

Wallet.updateTransactionFee

#### Defined in

[near/lib/wallet/NearWalletProvider.ts:162](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/wallet/NearWalletProvider.ts#L162)
