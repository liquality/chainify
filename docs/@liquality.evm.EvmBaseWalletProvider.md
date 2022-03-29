# Class: EvmBaseWalletProvider<Provider, S\>

[@liquality/evm](../wiki/@liquality.evm).EvmBaseWalletProvider

## Type parameters

| Name | Type |
| :------ | :------ |
| `Provider` | `Provider` |
| `S` | extends `Signer` = `Signer` |

## Hierarchy

- `default`<`Provider`, `S`\>

  ↳ **`EvmBaseWalletProvider`**

  ↳↳ [`EvmWalletProvider`](../wiki/@liquality.evm.EvmWalletProvider)

## Table of contents

### Constructors

- [constructor](../wiki/@liquality.evm.EvmBaseWalletProvider#constructor)

### Properties

- [chainProvider](../wiki/@liquality.evm.EvmBaseWalletProvider#chainprovider)
- [signer](../wiki/@liquality.evm.EvmBaseWalletProvider#signer)

### Methods

- [canUpdateFee](../wiki/@liquality.evm.EvmBaseWalletProvider#canupdatefee)
- [exportPrivateKey](../wiki/@liquality.evm.EvmBaseWalletProvider#exportprivatekey)
- [getAddress](../wiki/@liquality.evm.EvmBaseWalletProvider#getaddress)
- [getAddresses](../wiki/@liquality.evm.EvmBaseWalletProvider#getaddresses)
- [getBalance](../wiki/@liquality.evm.EvmBaseWalletProvider#getbalance)
- [getChainProvider](../wiki/@liquality.evm.EvmBaseWalletProvider#getchainprovider)
- [getConnectedNetwork](../wiki/@liquality.evm.EvmBaseWalletProvider#getconnectednetwork)
- [getSigner](../wiki/@liquality.evm.EvmBaseWalletProvider#getsigner)
- [getUnusedAddress](../wiki/@liquality.evm.EvmBaseWalletProvider#getunusedaddress)
- [getUsedAddresses](../wiki/@liquality.evm.EvmBaseWalletProvider#getusedaddresses)
- [isWalletAvailable](../wiki/@liquality.evm.EvmBaseWalletProvider#iswalletavailable)
- [sendBatchTransaction](../wiki/@liquality.evm.EvmBaseWalletProvider#sendbatchtransaction)
- [sendSweepTransaction](../wiki/@liquality.evm.EvmBaseWalletProvider#sendsweeptransaction)
- [sendTransaction](../wiki/@liquality.evm.EvmBaseWalletProvider#sendtransaction)
- [setChainProvider](../wiki/@liquality.evm.EvmBaseWalletProvider#setchainprovider)
- [setSigner](../wiki/@liquality.evm.EvmBaseWalletProvider#setsigner)
- [signMessage](../wiki/@liquality.evm.EvmBaseWalletProvider#signmessage)
- [updateTransactionFee](../wiki/@liquality.evm.EvmBaseWalletProvider#updatetransactionfee)

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

[evm/lib/wallet/EvmBaseWalletProvider.ts:13](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/wallet/EvmBaseWalletProvider.ts#L13)

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

[evm/lib/wallet/EvmBaseWalletProvider.ts:11](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/wallet/EvmBaseWalletProvider.ts#L11)

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

[evm/lib/wallet/EvmBaseWalletProvider.ts:109](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/wallet/EvmBaseWalletProvider.ts#L109)

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

[evm/lib/wallet/EvmBaseWalletProvider.ts:114](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/wallet/EvmBaseWalletProvider.ts#L114)

___

### getSigner

▸ **getSigner**(): `S`

#### Returns

`S`

#### Overrides

Wallet.getSigner

#### Defined in

[evm/lib/wallet/EvmBaseWalletProvider.ts:17](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/wallet/EvmBaseWalletProvider.ts#L17)

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
| `txRequests` | [`EthereumTransactionRequest`](../wiki/@liquality.evm.EvmTypes#ethereumtransactionrequest)[] |

#### Returns

`Promise`<`Transaction`<`TransactionResponse`\>[]\>

#### Overrides

Wallet.sendBatchTransaction

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

#### Overrides

Wallet.sendSweepTransaction

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

#### Overrides

Wallet.sendTransaction

#### Defined in

[evm/lib/wallet/EvmBaseWalletProvider.ts:30](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/wallet/EvmBaseWalletProvider.ts#L30)

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

[evm/lib/wallet/EvmBaseWalletProvider.ts:21](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/wallet/EvmBaseWalletProvider.ts#L21)

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

#### Overrides

Wallet.updateTransactionFee

#### Defined in

[evm/lib/wallet/EvmBaseWalletProvider.ts:69](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/wallet/EvmBaseWalletProvider.ts#L69)
