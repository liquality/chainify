[](../README.md) / [Exports](../modules.md) / [@liquality/evm](../modules/liquality_evm.md) / EvmBaseWalletProvider

# Class: EvmBaseWalletProvider<Provider, S\>

[@liquality/evm](../modules/liquality_evm.md).EvmBaseWalletProvider

## Type parameters

| Name | Type |
| :------ | :------ |
| `Provider` | `Provider` |
| `S` | extends `Signer` = `Signer` |

## Hierarchy

- `default`<`Provider`, `S`\>

  ↳ **`EvmBaseWalletProvider`**

  ↳↳ [`EvmWalletProvider`](liquality_evm.EvmWalletProvider.md)

## Table of contents

### Constructors

- [constructor](liquality_evm.EvmBaseWalletProvider.md#constructor)

### Properties

- [chainProvider](liquality_evm.EvmBaseWalletProvider.md#chainprovider)
- [signer](liquality_evm.EvmBaseWalletProvider.md#signer)

### Methods

- [canUpdateFee](liquality_evm.EvmBaseWalletProvider.md#canupdatefee)
- [exportPrivateKey](liquality_evm.EvmBaseWalletProvider.md#exportprivatekey)
- [getAddress](liquality_evm.EvmBaseWalletProvider.md#getaddress)
- [getAddresses](liquality_evm.EvmBaseWalletProvider.md#getaddresses)
- [getBalance](liquality_evm.EvmBaseWalletProvider.md#getbalance)
- [getChainProvider](liquality_evm.EvmBaseWalletProvider.md#getchainprovider)
- [getConnectedNetwork](liquality_evm.EvmBaseWalletProvider.md#getconnectednetwork)
- [getSigner](liquality_evm.EvmBaseWalletProvider.md#getsigner)
- [getUnusedAddress](liquality_evm.EvmBaseWalletProvider.md#getunusedaddress)
- [getUsedAddresses](liquality_evm.EvmBaseWalletProvider.md#getusedaddresses)
- [isWalletAvailable](liquality_evm.EvmBaseWalletProvider.md#iswalletavailable)
- [sendBatchTransaction](liquality_evm.EvmBaseWalletProvider.md#sendbatchtransaction)
- [sendSweepTransaction](liquality_evm.EvmBaseWalletProvider.md#sendsweeptransaction)
- [sendTransaction](liquality_evm.EvmBaseWalletProvider.md#sendtransaction)
- [setChainProvider](liquality_evm.EvmBaseWalletProvider.md#setchainprovider)
- [setSigner](liquality_evm.EvmBaseWalletProvider.md#setsigner)
- [signMessage](liquality_evm.EvmBaseWalletProvider.md#signmessage)
- [updateTransactionFee](liquality_evm.EvmBaseWalletProvider.md#updatetransactionfee)

## Constructors

### constructor

• **new EvmBaseWalletProvider**<`Provider`, `S`\>(`chainProvider?`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Provider` | `Provider` |
| `S` | extends `Signer`<`S`\> = `Signer` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainProvider?` | `default`<`Provider`\> |

#### Overrides

Wallet&lt;Provider, S\&gt;.constructor

#### Defined in

[evm/lib/wallet/EvmBaseWalletProvider.ts:13](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/wallet/EvmBaseWalletProvider.ts#L13)

## Properties

### chainProvider

• `Protected` **chainProvider**: `default`<`Provider`\>

#### Inherited from

Wallet.chainProvider

#### Defined in

client/dist/lib/Wallet.d.ts:4

___

### signer

• `Protected` **signer**: `S`

#### Defined in

[evm/lib/wallet/EvmBaseWalletProvider.ts:11](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/wallet/EvmBaseWalletProvider.ts#L11)

## Methods

### canUpdateFee

▸ `Abstract` **canUpdateFee**(): `boolean`

#### Returns

`boolean`

#### Inherited from

Wallet.canUpdateFee

#### Defined in

client/dist/lib/Wallet.d.ts:22

___

### exportPrivateKey

▸ `Abstract` **exportPrivateKey**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Inherited from

Wallet.exportPrivateKey

#### Defined in

client/dist/lib/Wallet.d.ts:20

___

### getAddress

▸ `Abstract` **getAddress**(): `Promise`<`AddressType`\>

#### Returns

`Promise`<`AddressType`\>

#### Inherited from

Wallet.getAddress

#### Defined in

client/dist/lib/Wallet.d.ts:10

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

#### Inherited from

Wallet.getAddresses

#### Defined in

client/dist/lib/Wallet.d.ts:13

___

### getBalance

▸ **getBalance**(`assets`): `Promise`<`BigNumber`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `assets` | `Asset`[] |

#### Returns

`Promise`<`BigNumber`[]\>

#### Overrides

Wallet.getBalance

#### Defined in

[evm/lib/wallet/EvmBaseWalletProvider.ts:109](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/wallet/EvmBaseWalletProvider.ts#L109)

___

### getChainProvider

▸ **getChainProvider**(): `default`<`Provider`\>

#### Returns

`default`<`Provider`\>

#### Inherited from

Wallet.getChainProvider

#### Defined in

client/dist/lib/Wallet.d.ts:7

___

### getConnectedNetwork

▸ **getConnectedNetwork**(): `Promise`<`Network`\>

#### Returns

`Promise`<`Network`\>

#### Overrides

Wallet.getConnectedNetwork

#### Defined in

[evm/lib/wallet/EvmBaseWalletProvider.ts:114](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/wallet/EvmBaseWalletProvider.ts#L114)

___

### getSigner

▸ **getSigner**(): `S`

#### Returns

`S`

#### Overrides

Wallet.getSigner

#### Defined in

[evm/lib/wallet/EvmBaseWalletProvider.ts:17](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/wallet/EvmBaseWalletProvider.ts#L17)

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

#### Inherited from

Wallet.getUnusedAddress

#### Defined in

client/dist/lib/Wallet.d.ts:11

___

### getUsedAddresses

▸ `Abstract` **getUsedAddresses**(`numAddressPerCall?`): `Promise`<`Address`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `numAddressPerCall?` | `number` |

#### Returns

`Promise`<`Address`[]\>

#### Inherited from

Wallet.getUsedAddresses

#### Defined in

client/dist/lib/Wallet.d.ts:12

___

### isWalletAvailable

▸ `Abstract` **isWalletAvailable**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Inherited from

Wallet.isWalletAvailable

#### Defined in

client/dist/lib/Wallet.d.ts:21

___

### sendBatchTransaction

▸ **sendBatchTransaction**(`txRequests`): `Promise`<`Transaction`<`TransactionResponse`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `txRequests` | [`EthereumTransactionRequest`](../modules/liquality_evm.EvmTypes.md#ethereumtransactionrequest)[] |

#### Returns

`Promise`<`Transaction`<`TransactionResponse`\>[]\>

#### Overrides

Wallet.sendBatchTransaction

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

#### Overrides

Wallet.sendSweepTransaction

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

#### Overrides

Wallet.sendTransaction

#### Defined in

[evm/lib/wallet/EvmBaseWalletProvider.ts:30](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/wallet/EvmBaseWalletProvider.ts#L30)

___

### setChainProvider

▸ **setChainProvider**(`chainProvider`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainProvider` | `default`<`Provider`\> |

#### Returns

`void`

#### Inherited from

Wallet.setChainProvider

#### Defined in

client/dist/lib/Wallet.d.ts:6

___

### setSigner

▸ **setSigner**(`signer`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `signer` | `S` |

#### Returns

`void`

#### Defined in

[evm/lib/wallet/EvmBaseWalletProvider.ts:21](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/wallet/EvmBaseWalletProvider.ts#L21)

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

#### Overrides

Wallet.signMessage

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

#### Overrides

Wallet.updateTransactionFee

#### Defined in

[evm/lib/wallet/EvmBaseWalletProvider.ts:69](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/wallet/EvmBaseWalletProvider.ts#L69)
