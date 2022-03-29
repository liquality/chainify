# Class: NearWalletProvider

[@liquality/near](../wiki/@liquality.near).NearWalletProvider

## Hierarchy

- `default`<`providers.JsonRpcProvider`, `InMemorySigner`\>

  ↳ **`NearWalletProvider`**

## Table of contents

### Constructors

- [constructor](../wiki/@liquality.near.NearWalletProvider#constructor)

### Properties

- [chainProvider](../wiki/@liquality.near.NearWalletProvider#chainprovider)

### Methods

- [canUpdateFee](../wiki/@liquality.near.NearWalletProvider#canupdatefee)
- [exportPrivateKey](../wiki/@liquality.near.NearWalletProvider#exportprivatekey)
- [getAddress](../wiki/@liquality.near.NearWalletProvider#getaddress)
- [getAddresses](../wiki/@liquality.near.NearWalletProvider#getaddresses)
- [getBalance](../wiki/@liquality.near.NearWalletProvider#getbalance)
- [getChainProvider](../wiki/@liquality.near.NearWalletProvider#getchainprovider)
- [getConnectedNetwork](../wiki/@liquality.near.NearWalletProvider#getconnectednetwork)
- [getSigner](../wiki/@liquality.near.NearWalletProvider#getsigner)
- [getUnusedAddress](../wiki/@liquality.near.NearWalletProvider#getunusedaddress)
- [getUsedAddresses](../wiki/@liquality.near.NearWalletProvider#getusedaddresses)
- [isWalletAvailable](../wiki/@liquality.near.NearWalletProvider#iswalletavailable)
- [sendBatchTransaction](../wiki/@liquality.near.NearWalletProvider#sendbatchtransaction)
- [sendSweepTransaction](../wiki/@liquality.near.NearWalletProvider#sendsweeptransaction)
- [sendTransaction](../wiki/@liquality.near.NearWalletProvider#sendtransaction)
- [setChainProvider](../wiki/@liquality.near.NearWalletProvider#setchainprovider)
- [signMessage](../wiki/@liquality.near.NearWalletProvider#signmessage)
- [updateTransactionFee](../wiki/@liquality.near.NearWalletProvider#updatetransactionfee)

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

[near/lib/wallet/NearWalletProvider.ts:28](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/wallet/NearWalletProvider.ts#L28)

## Properties

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

[near/lib/wallet/NearWalletProvider.ts:158](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/wallet/NearWalletProvider.ts#L158)

___

### exportPrivateKey

▸ **exportPrivateKey**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Overrides

Wallet.exportPrivateKey

#### Defined in

[near/lib/wallet/NearWalletProvider.ts:150](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/wallet/NearWalletProvider.ts#L150)

___

### getAddress

▸ **getAddress**(): `Promise`<`Address`\>

#### Returns

`Promise`<`Address`\>

#### Overrides

Wallet.getAddress

#### Defined in

[near/lib/wallet/NearWalletProvider.ts:44](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/wallet/NearWalletProvider.ts#L44)

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

[near/lib/wallet/NearWalletProvider.ts:75](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/wallet/NearWalletProvider.ts#L75)

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

[near/lib/wallet/NearWalletProvider.ts:145](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/wallet/NearWalletProvider.ts#L145)

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

▸ **getConnectedNetwork**(): `Promise`<[`NearNetwork`](../wiki/@liquality.near.NearTypes.NearNetwork)\>

#### Returns

`Promise`<[`NearNetwork`](../wiki/@liquality.near.NearTypes.NearNetwork)\>

#### Overrides

Wallet.getConnectedNetwork

#### Defined in

[near/lib/wallet/NearWalletProvider.ts:166](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/wallet/NearWalletProvider.ts#L166)

___

### getSigner

▸ **getSigner**(): `InMemorySigner`

#### Returns

`InMemorySigner`

#### Overrides

Wallet.getSigner

#### Defined in

[near/lib/wallet/NearWalletProvider.ts:40](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/wallet/NearWalletProvider.ts#L40)

___

### getUnusedAddress

▸ **getUnusedAddress**(): `Promise`<`Address`\>

#### Returns

`Promise`<`Address`\>

#### Overrides

Wallet.getUnusedAddress

#### Defined in

[near/lib/wallet/NearWalletProvider.ts:67](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/wallet/NearWalletProvider.ts#L67)

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

[near/lib/wallet/NearWalletProvider.ts:71](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/wallet/NearWalletProvider.ts#L71)

___

### isWalletAvailable

▸ **isWalletAvailable**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Overrides

Wallet.isWalletAvailable

#### Defined in

[near/lib/wallet/NearWalletProvider.ts:154](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/wallet/NearWalletProvider.ts#L154)

___

### sendBatchTransaction

▸ **sendBatchTransaction**(`txRequests`): `Promise`<`Transaction`<[`NearTxLog`](../wiki/@liquality.near.NearTypes.NearTxLog)\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `txRequests` | [`NearTxRequest`](../wiki/@liquality.near.NearTypes.NearTxRequest)[] |

#### Returns

`Promise`<`Transaction`<[`NearTxLog`](../wiki/@liquality.near.NearTypes.NearTxLog)\>[]\>

#### Overrides

Wallet.sendBatchTransaction

#### Defined in

[near/lib/wallet/NearWalletProvider.ts:129](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/wallet/NearWalletProvider.ts#L129)

___

### sendSweepTransaction

▸ **sendSweepTransaction**(`to`, `_asset`): `Promise`<`Transaction`<[`NearTxLog`](../wiki/@liquality.near.NearTypes.NearTxLog)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `to` | `AddressType` |
| `_asset` | `Asset` |

#### Returns

`Promise`<`Transaction`<[`NearTxLog`](../wiki/@liquality.near.NearTypes.NearTxLog)\>\>

#### Overrides

Wallet.sendSweepTransaction

#### Defined in

[near/lib/wallet/NearWalletProvider.ts:138](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/wallet/NearWalletProvider.ts#L138)

___

### sendTransaction

▸ **sendTransaction**(`txRequest`): `Promise`<`Transaction`<[`NearTxLog`](../wiki/@liquality.near.NearTypes.NearTxLog)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `txRequest` | [`NearTxRequest`](../wiki/@liquality.near.NearTypes.NearTxRequest) |

#### Returns

`Promise`<`Transaction`<[`NearTxLog`](../wiki/@liquality.near.NearTypes.NearTxLog)\>\>

#### Overrides

Wallet.sendTransaction

#### Defined in

[near/lib/wallet/NearWalletProvider.ts:111](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/wallet/NearWalletProvider.ts#L111)

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

[near/lib/wallet/NearWalletProvider.ts:99](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/wallet/NearWalletProvider.ts#L99)

___

### updateTransactionFee

▸ **updateTransactionFee**(`_tx`): `Promise`<`Transaction`<[`NearTxResponse`](../wiki/@liquality.near.NearTypes.NearTxResponse)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_tx` | `string` \| `Transaction`<`any`\> |

#### Returns

`Promise`<`Transaction`<[`NearTxResponse`](../wiki/@liquality.near.NearTypes.NearTxResponse)\>\>

#### Overrides

Wallet.updateTransactionFee

#### Defined in

[near/lib/wallet/NearWalletProvider.ts:162](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/wallet/NearWalletProvider.ts#L162)
