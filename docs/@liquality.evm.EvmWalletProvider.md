# Class: EvmWalletProvider

[@liquality/evm](../wiki/@liquality.evm).EvmWalletProvider

## Hierarchy

- [`EvmBaseWalletProvider`](../wiki/@liquality.evm.EvmBaseWalletProvider)<`StaticJsonRpcProvider`, `EthersWallet`\>

  ↳ **`EvmWalletProvider`**

## Table of contents

### Constructors

- [constructor](../wiki/@liquality.evm.EvmWalletProvider#constructor)

### Properties

- [chainProvider](../wiki/@liquality.evm.EvmWalletProvider#chainprovider)
- [signer](../wiki/@liquality.evm.EvmWalletProvider#signer)

### Methods

- [canUpdateFee](../wiki/@liquality.evm.EvmWalletProvider#canupdatefee)
- [exportPrivateKey](../wiki/@liquality.evm.EvmWalletProvider#exportprivatekey)
- [getAddress](../wiki/@liquality.evm.EvmWalletProvider#getaddress)
- [getAddresses](../wiki/@liquality.evm.EvmWalletProvider#getaddresses)
- [getBalance](../wiki/@liquality.evm.EvmWalletProvider#getbalance)
- [getChainProvider](../wiki/@liquality.evm.EvmWalletProvider#getchainprovider)
- [getConnectedNetwork](../wiki/@liquality.evm.EvmWalletProvider#getconnectednetwork)
- [getSigner](../wiki/@liquality.evm.EvmWalletProvider#getsigner)
- [getUnusedAddress](../wiki/@liquality.evm.EvmWalletProvider#getunusedaddress)
- [getUsedAddresses](../wiki/@liquality.evm.EvmWalletProvider#getusedaddresses)
- [isWalletAvailable](../wiki/@liquality.evm.EvmWalletProvider#iswalletavailable)
- [sendBatchTransaction](../wiki/@liquality.evm.EvmWalletProvider#sendbatchtransaction)
- [sendSweepTransaction](../wiki/@liquality.evm.EvmWalletProvider#sendsweeptransaction)
- [sendTransaction](../wiki/@liquality.evm.EvmWalletProvider#sendtransaction)
- [setChainProvider](../wiki/@liquality.evm.EvmWalletProvider#setchainprovider)
- [setSigner](../wiki/@liquality.evm.EvmWalletProvider#setsigner)
- [setWalletIndex](../wiki/@liquality.evm.EvmWalletProvider#setwalletindex)
- [signMessage](../wiki/@liquality.evm.EvmWalletProvider#signmessage)
- [updateTransactionFee](../wiki/@liquality.evm.EvmWalletProvider#updatetransactionfee)

## Constructors

### constructor

• **new EvmWalletProvider**(`walletOptions`, `chainProvider?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `walletOptions` | `WalletOptions` |
| `chainProvider?` | `default`<`StaticJsonRpcProvider`\> |

#### Overrides

[EvmBaseWalletProvider](../wiki/@liquality.evm.EvmBaseWalletProvider).[constructor](../wiki/@liquality.evm.EvmBaseWalletProvider#constructor)

#### Defined in

[evm/lib/wallet/EvmWalletProvider.ts:12](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/wallet/EvmWalletProvider.ts#L12)

## Properties

### chainProvider

• `Protected` **chainProvider**: `default`<`StaticJsonRpcProvider`\>

#### Inherited from

[EvmBaseWalletProvider](../wiki/@liquality.evm.EvmBaseWalletProvider).[chainProvider](../wiki/@liquality.evm.EvmBaseWalletProvider#chainprovider)

#### Defined in

client/dist/lib/Wallet.d.ts:4

___

### signer

• `Protected` **signer**: `Wallet`

#### Inherited from

[EvmBaseWalletProvider](../wiki/@liquality.evm.EvmBaseWalletProvider).[signer](../wiki/@liquality.evm.EvmBaseWalletProvider#signer)

#### Defined in

[evm/lib/wallet/EvmBaseWalletProvider.ts:11](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/wallet/EvmBaseWalletProvider.ts#L11)

## Methods

### canUpdateFee

▸ **canUpdateFee**(): `boolean`

#### Returns

`boolean`

#### Overrides

[EvmBaseWalletProvider](../wiki/@liquality.evm.EvmBaseWalletProvider).[canUpdateFee](../wiki/@liquality.evm.EvmBaseWalletProvider#canupdatefee)

#### Defined in

[evm/lib/wallet/EvmWalletProvider.ts:68](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/wallet/EvmWalletProvider.ts#L68)

___

### exportPrivateKey

▸ **exportPrivateKey**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Overrides

[EvmBaseWalletProvider](../wiki/@liquality.evm.EvmBaseWalletProvider).[exportPrivateKey](../wiki/@liquality.evm.EvmBaseWalletProvider#exportprivatekey)

#### Defined in

[evm/lib/wallet/EvmWalletProvider.ts:60](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/wallet/EvmWalletProvider.ts#L60)

___

### getAddress

▸ **getAddress**(): `Promise`<`Address`\>

#### Returns

`Promise`<`Address`\>

#### Overrides

[EvmBaseWalletProvider](../wiki/@liquality.evm.EvmBaseWalletProvider).[getAddress](../wiki/@liquality.evm.EvmBaseWalletProvider#getaddress)

#### Defined in

[evm/lib/wallet/EvmWalletProvider.ts:24](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/wallet/EvmWalletProvider.ts#L24)

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

[EvmBaseWalletProvider](../wiki/@liquality.evm.EvmBaseWalletProvider).[getAddresses](../wiki/@liquality.evm.EvmBaseWalletProvider#getaddresses)

#### Defined in

[evm/lib/wallet/EvmWalletProvider.ts:45](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/wallet/EvmWalletProvider.ts#L45)

___

### getBalance

▸ **getBalance**(`assets`): `Promise`<`BigNumber`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `assets` | `Asset`[] |

#### Returns

`Promise`<`BigNumber`[]\>

#### Inherited from

[EvmBaseWalletProvider](../wiki/@liquality.evm.EvmBaseWalletProvider).[getBalance](../wiki/@liquality.evm.EvmBaseWalletProvider#getbalance)

#### Defined in

[evm/lib/wallet/EvmBaseWalletProvider.ts:109](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/wallet/EvmBaseWalletProvider.ts#L109)

___

### getChainProvider

▸ **getChainProvider**(): `default`<`StaticJsonRpcProvider`\>

#### Returns

`default`<`StaticJsonRpcProvider`\>

#### Inherited from

[EvmBaseWalletProvider](../wiki/@liquality.evm.EvmBaseWalletProvider).[getChainProvider](../wiki/@liquality.evm.EvmBaseWalletProvider#getchainprovider)

#### Defined in

client/dist/lib/Wallet.d.ts:7

___

### getConnectedNetwork

▸ **getConnectedNetwork**(): `Promise`<`Network`\>

#### Returns

`Promise`<`Network`\>

#### Inherited from

[EvmBaseWalletProvider](../wiki/@liquality.evm.EvmBaseWalletProvider).[getConnectedNetwork](../wiki/@liquality.evm.EvmBaseWalletProvider#getconnectednetwork)

#### Defined in

[evm/lib/wallet/EvmBaseWalletProvider.ts:114](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/wallet/EvmBaseWalletProvider.ts#L114)

___

### getSigner

▸ **getSigner**(): `Wallet`

#### Returns

`Wallet`

#### Inherited from

[EvmBaseWalletProvider](../wiki/@liquality.evm.EvmBaseWalletProvider).[getSigner](../wiki/@liquality.evm.EvmBaseWalletProvider#getsigner)

#### Defined in

[evm/lib/wallet/EvmBaseWalletProvider.ts:17](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/wallet/EvmBaseWalletProvider.ts#L17)

___

### getUnusedAddress

▸ **getUnusedAddress**(): `Promise`<`Address`\>

#### Returns

`Promise`<`Address`\>

#### Overrides

[EvmBaseWalletProvider](../wiki/@liquality.evm.EvmBaseWalletProvider).[getUnusedAddress](../wiki/@liquality.evm.EvmBaseWalletProvider#getunusedaddress)

#### Defined in

[evm/lib/wallet/EvmWalletProvider.ts:37](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/wallet/EvmWalletProvider.ts#L37)

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

[EvmBaseWalletProvider](../wiki/@liquality.evm.EvmBaseWalletProvider).[getUsedAddresses](../wiki/@liquality.evm.EvmBaseWalletProvider#getusedaddresses)

#### Defined in

[evm/lib/wallet/EvmWalletProvider.ts:41](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/wallet/EvmWalletProvider.ts#L41)

___

### isWalletAvailable

▸ **isWalletAvailable**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Overrides

[EvmBaseWalletProvider](../wiki/@liquality.evm.EvmBaseWalletProvider).[isWalletAvailable](../wiki/@liquality.evm.EvmBaseWalletProvider#iswalletavailable)

#### Defined in

[evm/lib/wallet/EvmWalletProvider.ts:64](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/wallet/EvmWalletProvider.ts#L64)

___

### sendBatchTransaction

▸ **sendBatchTransaction**(`txRequests`): `Promise`<`Transaction`<`TransactionResponse`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `txRequests` | [`EthereumTransactionRequest`](../wiki/@liquality.evm.EvmTypes#ethereumtransactionrequest)[] |

#### Returns

`Promise`<`Transaction`<`TransactionResponse`\>[]\>

#### Inherited from

[EvmBaseWalletProvider](../wiki/@liquality.evm.EvmBaseWalletProvider).[sendBatchTransaction](../wiki/@liquality.evm.EvmBaseWalletProvider#sendbatchtransaction)

#### Defined in

[evm/lib/wallet/EvmBaseWalletProvider.ts:54](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/wallet/EvmBaseWalletProvider.ts#L54)

___

### sendSweepTransaction

▸ **sendSweepTransaction**(`address`, `asset`, `fee?`): `Promise`<`Transaction`<`any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `AddressType` |
| `asset` | `Asset` |
| `fee?` | `FeeType` |

#### Returns

`Promise`<`Transaction`<`any`\>\>

#### Inherited from

[EvmBaseWalletProvider](../wiki/@liquality.evm.EvmBaseWalletProvider).[sendSweepTransaction](../wiki/@liquality.evm.EvmBaseWalletProvider#sendsweeptransaction)

#### Defined in

[evm/lib/wallet/EvmBaseWalletProvider.ts:63](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/wallet/EvmBaseWalletProvider.ts#L63)

___

### sendTransaction

▸ **sendTransaction**(`txRequest`): `Promise`<`Transaction`<`TransactionResponse`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `txRequest` | [`EthereumTransactionRequest`](../wiki/@liquality.evm.EvmTypes#ethereumtransactionrequest) |

#### Returns

`Promise`<`Transaction`<`TransactionResponse`\>\>

#### Inherited from

[EvmBaseWalletProvider](../wiki/@liquality.evm.EvmBaseWalletProvider).[sendTransaction](../wiki/@liquality.evm.EvmBaseWalletProvider#sendtransaction)

#### Defined in

[evm/lib/wallet/EvmBaseWalletProvider.ts:30](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/wallet/EvmBaseWalletProvider.ts#L30)

___

### setChainProvider

▸ **setChainProvider**(`chainProvider`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainProvider` | `default`<`StaticJsonRpcProvider`\> |

#### Returns

`void`

#### Inherited from

[EvmBaseWalletProvider](../wiki/@liquality.evm.EvmBaseWalletProvider).[setChainProvider](../wiki/@liquality.evm.EvmBaseWalletProvider#setchainprovider)

#### Defined in

client/dist/lib/Wallet.d.ts:6

___

### setSigner

▸ **setSigner**(`signer`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `signer` | `Wallet` |

#### Returns

`void`

#### Inherited from

[EvmBaseWalletProvider](../wiki/@liquality.evm.EvmBaseWalletProvider).[setSigner](../wiki/@liquality.evm.EvmBaseWalletProvider#setsigner)

#### Defined in

[evm/lib/wallet/EvmBaseWalletProvider.ts:21](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/wallet/EvmBaseWalletProvider.ts#L21)

___

### setWalletIndex

▸ **setWalletIndex**(`index`): `Promise`<`AddressType`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `index` | `number` |

#### Returns

`Promise`<`AddressType`\>

#### Defined in

[evm/lib/wallet/EvmWalletProvider.ts:32](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/wallet/EvmWalletProvider.ts#L32)

___

### signMessage

▸ **signMessage**(`message`, `_from`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |
| `_from` | `AddressType` |

#### Returns

`Promise`<`string`\>

#### Inherited from

[EvmBaseWalletProvider](../wiki/@liquality.evm.EvmBaseWalletProvider).[signMessage](../wiki/@liquality.evm.EvmBaseWalletProvider#signmessage)

#### Defined in

[evm/lib/wallet/EvmBaseWalletProvider.ts:25](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/wallet/EvmBaseWalletProvider.ts#L25)

___

### updateTransactionFee

▸ **updateTransactionFee**(`tx`, `newFee`): `Promise`<`Transaction`<`TransactionResponse`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | `string` \| `Transaction`<`TransactionResponse`\> |
| `newFee` | `FeeType` |

#### Returns

`Promise`<`Transaction`<`TransactionResponse`\>\>

#### Inherited from

[EvmBaseWalletProvider](../wiki/@liquality.evm.EvmBaseWalletProvider).[updateTransactionFee](../wiki/@liquality.evm.EvmBaseWalletProvider#updatetransactionfee)

#### Defined in

[evm/lib/wallet/EvmBaseWalletProvider.ts:69](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/wallet/EvmBaseWalletProvider.ts#L69)
