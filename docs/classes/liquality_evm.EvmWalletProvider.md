[](../README.md) / [Exports](../modules.md) / [@liquality/evm](../modules/liquality_evm.md) / EvmWalletProvider

# Class: EvmWalletProvider

[@liquality/evm](../modules/liquality_evm.md).EvmWalletProvider

## Hierarchy

- [`EvmBaseWalletProvider`](liquality_evm.EvmBaseWalletProvider.md)<`StaticJsonRpcProvider`, `EthersWallet`\>

  ↳ **`EvmWalletProvider`**

## Table of contents

### Constructors

- [constructor](liquality_evm.EvmWalletProvider.md#constructor)

### Properties

- [\_wallet](liquality_evm.EvmWalletProvider.md#_wallet)
- [\_walletOptions](liquality_evm.EvmWalletProvider.md#_walletoptions)
- [chainProvider](liquality_evm.EvmWalletProvider.md#chainprovider)
- [signer](liquality_evm.EvmWalletProvider.md#signer)

### Methods

- [canUpdateFee](liquality_evm.EvmWalletProvider.md#canupdatefee)
- [exportPrivateKey](liquality_evm.EvmWalletProvider.md#exportprivatekey)
- [getAddress](liquality_evm.EvmWalletProvider.md#getaddress)
- [getAddresses](liquality_evm.EvmWalletProvider.md#getaddresses)
- [getBalance](liquality_evm.EvmWalletProvider.md#getbalance)
- [getChainProvider](liquality_evm.EvmWalletProvider.md#getchainprovider)
- [getConnectedNetwork](liquality_evm.EvmWalletProvider.md#getconnectednetwork)
- [getSigner](liquality_evm.EvmWalletProvider.md#getsigner)
- [getUnusedAddress](liquality_evm.EvmWalletProvider.md#getunusedaddress)
- [getUsedAddresses](liquality_evm.EvmWalletProvider.md#getusedaddresses)
- [isWalletAvailable](liquality_evm.EvmWalletProvider.md#iswalletavailable)
- [sendBatchTransaction](liquality_evm.EvmWalletProvider.md#sendbatchtransaction)
- [sendSweepTransaction](liquality_evm.EvmWalletProvider.md#sendsweeptransaction)
- [sendTransaction](liquality_evm.EvmWalletProvider.md#sendtransaction)
- [setChainProvider](liquality_evm.EvmWalletProvider.md#setchainprovider)
- [setSigner](liquality_evm.EvmWalletProvider.md#setsigner)
- [setWalletIndex](liquality_evm.EvmWalletProvider.md#setwalletindex)
- [signMessage](liquality_evm.EvmWalletProvider.md#signmessage)
- [updateTransactionFee](liquality_evm.EvmWalletProvider.md#updatetransactionfee)

## Constructors

### constructor

• **new EvmWalletProvider**(`walletOptions`, `chainProvider?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `walletOptions` | `WalletOptions` |
| `chainProvider?` | `default`<`StaticJsonRpcProvider`\> |

#### Overrides

[EvmBaseWalletProvider](liquality_evm.EvmBaseWalletProvider.md).[constructor](liquality_evm.EvmBaseWalletProvider.md#constructor)

#### Defined in

[evm/lib/wallet/EvmWalletProvider.ts:12](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/wallet/EvmWalletProvider.ts#L12)

## Properties

### \_wallet

• `Private` **\_wallet**: `Wallet`

#### Defined in

[evm/lib/wallet/EvmWalletProvider.ts:9](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/wallet/EvmWalletProvider.ts#L9)

___

### \_walletOptions

• `Private` **\_walletOptions**: `WalletOptions`

#### Defined in

[evm/lib/wallet/EvmWalletProvider.ts:10](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/wallet/EvmWalletProvider.ts#L10)

___

### chainProvider

• `Protected` **chainProvider**: `default`<`StaticJsonRpcProvider`\>

#### Inherited from

[EvmBaseWalletProvider](liquality_evm.EvmBaseWalletProvider.md).[chainProvider](liquality_evm.EvmBaseWalletProvider.md#chainprovider)

#### Defined in

client/dist/lib/Wallet.d.ts:4

___

### signer

• `Protected` **signer**: `Wallet`

#### Inherited from

[EvmBaseWalletProvider](liquality_evm.EvmBaseWalletProvider.md).[signer](liquality_evm.EvmBaseWalletProvider.md#signer)

#### Defined in

[evm/lib/wallet/EvmBaseWalletProvider.ts:11](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/wallet/EvmBaseWalletProvider.ts#L11)

## Methods

### canUpdateFee

▸ **canUpdateFee**(): `boolean`

#### Returns

`boolean`

#### Overrides

[EvmBaseWalletProvider](liquality_evm.EvmBaseWalletProvider.md).[canUpdateFee](liquality_evm.EvmBaseWalletProvider.md#canupdatefee)

#### Defined in

[evm/lib/wallet/EvmWalletProvider.ts:68](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/wallet/EvmWalletProvider.ts#L68)

___

### exportPrivateKey

▸ **exportPrivateKey**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Overrides

[EvmBaseWalletProvider](liquality_evm.EvmBaseWalletProvider.md).[exportPrivateKey](liquality_evm.EvmBaseWalletProvider.md#exportprivatekey)

#### Defined in

[evm/lib/wallet/EvmWalletProvider.ts:60](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/wallet/EvmWalletProvider.ts#L60)

___

### getAddress

▸ **getAddress**(): `Promise`<`Address`\>

#### Returns

`Promise`<`Address`\>

#### Overrides

[EvmBaseWalletProvider](liquality_evm.EvmBaseWalletProvider.md).[getAddress](liquality_evm.EvmBaseWalletProvider.md#getaddress)

#### Defined in

[evm/lib/wallet/EvmWalletProvider.ts:24](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/wallet/EvmWalletProvider.ts#L24)

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

[EvmBaseWalletProvider](liquality_evm.EvmBaseWalletProvider.md).[getAddresses](liquality_evm.EvmBaseWalletProvider.md#getaddresses)

#### Defined in

[evm/lib/wallet/EvmWalletProvider.ts:45](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/wallet/EvmWalletProvider.ts#L45)

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

[EvmBaseWalletProvider](liquality_evm.EvmBaseWalletProvider.md).[getBalance](liquality_evm.EvmBaseWalletProvider.md#getbalance)

#### Defined in

[evm/lib/wallet/EvmBaseWalletProvider.ts:109](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/wallet/EvmBaseWalletProvider.ts#L109)

___

### getChainProvider

▸ **getChainProvider**(): `default`<`StaticJsonRpcProvider`\>

#### Returns

`default`<`StaticJsonRpcProvider`\>

#### Inherited from

[EvmBaseWalletProvider](liquality_evm.EvmBaseWalletProvider.md).[getChainProvider](liquality_evm.EvmBaseWalletProvider.md#getchainprovider)

#### Defined in

client/dist/lib/Wallet.d.ts:7

___

### getConnectedNetwork

▸ **getConnectedNetwork**(): `Promise`<`Network`\>

#### Returns

`Promise`<`Network`\>

#### Inherited from

[EvmBaseWalletProvider](liquality_evm.EvmBaseWalletProvider.md).[getConnectedNetwork](liquality_evm.EvmBaseWalletProvider.md#getconnectednetwork)

#### Defined in

[evm/lib/wallet/EvmBaseWalletProvider.ts:114](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/wallet/EvmBaseWalletProvider.ts#L114)

___

### getSigner

▸ **getSigner**(): `Wallet`

#### Returns

`Wallet`

#### Inherited from

[EvmBaseWalletProvider](liquality_evm.EvmBaseWalletProvider.md).[getSigner](liquality_evm.EvmBaseWalletProvider.md#getsigner)

#### Defined in

[evm/lib/wallet/EvmBaseWalletProvider.ts:17](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/wallet/EvmBaseWalletProvider.ts#L17)

___

### getUnusedAddress

▸ **getUnusedAddress**(): `Promise`<`Address`\>

#### Returns

`Promise`<`Address`\>

#### Overrides

[EvmBaseWalletProvider](liquality_evm.EvmBaseWalletProvider.md).[getUnusedAddress](liquality_evm.EvmBaseWalletProvider.md#getunusedaddress)

#### Defined in

[evm/lib/wallet/EvmWalletProvider.ts:37](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/wallet/EvmWalletProvider.ts#L37)

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

[EvmBaseWalletProvider](liquality_evm.EvmBaseWalletProvider.md).[getUsedAddresses](liquality_evm.EvmBaseWalletProvider.md#getusedaddresses)

#### Defined in

[evm/lib/wallet/EvmWalletProvider.ts:41](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/wallet/EvmWalletProvider.ts#L41)

___

### isWalletAvailable

▸ **isWalletAvailable**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Overrides

[EvmBaseWalletProvider](liquality_evm.EvmBaseWalletProvider.md).[isWalletAvailable](liquality_evm.EvmBaseWalletProvider.md#iswalletavailable)

#### Defined in

[evm/lib/wallet/EvmWalletProvider.ts:64](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/wallet/EvmWalletProvider.ts#L64)

___

### sendBatchTransaction

▸ **sendBatchTransaction**(`txRequests`): `Promise`<`Transaction`<`TransactionResponse`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `txRequests` | [`EthereumTransactionRequest`](../modules/liquality_evm.EvmTypes.md#ethereumtransactionrequest)[] |

#### Returns

`Promise`<`Transaction`<`TransactionResponse`\>[]\>

#### Inherited from

[EvmBaseWalletProvider](liquality_evm.EvmBaseWalletProvider.md).[sendBatchTransaction](liquality_evm.EvmBaseWalletProvider.md#sendbatchtransaction)

#### Defined in

[evm/lib/wallet/EvmBaseWalletProvider.ts:54](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/wallet/EvmBaseWalletProvider.ts#L54)

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

[EvmBaseWalletProvider](liquality_evm.EvmBaseWalletProvider.md).[sendSweepTransaction](liquality_evm.EvmBaseWalletProvider.md#sendsweeptransaction)

#### Defined in

[evm/lib/wallet/EvmBaseWalletProvider.ts:63](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/wallet/EvmBaseWalletProvider.ts#L63)

___

### sendTransaction

▸ **sendTransaction**(`txRequest`): `Promise`<`Transaction`<`TransactionResponse`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `txRequest` | [`EthereumTransactionRequest`](../modules/liquality_evm.EvmTypes.md#ethereumtransactionrequest) |

#### Returns

`Promise`<`Transaction`<`TransactionResponse`\>\>

#### Inherited from

[EvmBaseWalletProvider](liquality_evm.EvmBaseWalletProvider.md).[sendTransaction](liquality_evm.EvmBaseWalletProvider.md#sendtransaction)

#### Defined in

[evm/lib/wallet/EvmBaseWalletProvider.ts:30](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/wallet/EvmBaseWalletProvider.ts#L30)

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

[EvmBaseWalletProvider](liquality_evm.EvmBaseWalletProvider.md).[setChainProvider](liquality_evm.EvmBaseWalletProvider.md#setchainprovider)

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

[EvmBaseWalletProvider](liquality_evm.EvmBaseWalletProvider.md).[setSigner](liquality_evm.EvmBaseWalletProvider.md#setsigner)

#### Defined in

[evm/lib/wallet/EvmBaseWalletProvider.ts:21](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/wallet/EvmBaseWalletProvider.ts#L21)

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

[evm/lib/wallet/EvmWalletProvider.ts:32](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/wallet/EvmWalletProvider.ts#L32)

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

[EvmBaseWalletProvider](liquality_evm.EvmBaseWalletProvider.md).[signMessage](liquality_evm.EvmBaseWalletProvider.md#signmessage)

#### Defined in

[evm/lib/wallet/EvmBaseWalletProvider.ts:25](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/wallet/EvmBaseWalletProvider.ts#L25)

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

[EvmBaseWalletProvider](liquality_evm.EvmBaseWalletProvider.md).[updateTransactionFee](liquality_evm.EvmBaseWalletProvider.md#updatetransactionfee)

#### Defined in

[evm/lib/wallet/EvmBaseWalletProvider.ts:69](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/wallet/EvmBaseWalletProvider.ts#L69)
