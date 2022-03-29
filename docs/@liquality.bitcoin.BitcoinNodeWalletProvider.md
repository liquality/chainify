# Class: BitcoinNodeWalletProvider

[@liquality/bitcoin](../wiki/@liquality.bitcoin).BitcoinNodeWalletProvider

## Hierarchy

- `default`<`any`, `any`\>

  ↳ **`BitcoinNodeWalletProvider`**

## Implements

- `IBitcoinWallet`<[`BitcoinBaseChainProvider`](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider)\>

## Table of contents

### Constructors

- [constructor](../wiki/@liquality.bitcoin.BitcoinNodeWalletProvider#constructor)

### Properties

- [chainProvider](../wiki/@liquality.bitcoin.BitcoinNodeWalletProvider#chainprovider)

### Methods

- [canUpdateFee](../wiki/@liquality.bitcoin.BitcoinNodeWalletProvider#canupdatefee)
- [exportPrivateKey](../wiki/@liquality.bitcoin.BitcoinNodeWalletProvider#exportprivatekey)
- [getAddress](../wiki/@liquality.bitcoin.BitcoinNodeWalletProvider#getaddress)
- [getAddresses](../wiki/@liquality.bitcoin.BitcoinNodeWalletProvider#getaddresses)
- [getBalance](../wiki/@liquality.bitcoin.BitcoinNodeWalletProvider#getbalance)
- [getChainProvider](../wiki/@liquality.bitcoin.BitcoinNodeWalletProvider#getchainprovider)
- [getConnectedNetwork](../wiki/@liquality.bitcoin.BitcoinNodeWalletProvider#getconnectednetwork)
- [getSigner](../wiki/@liquality.bitcoin.BitcoinNodeWalletProvider#getsigner)
- [getUnusedAddress](../wiki/@liquality.bitcoin.BitcoinNodeWalletProvider#getunusedaddress)
- [getUsedAddresses](../wiki/@liquality.bitcoin.BitcoinNodeWalletProvider#getusedaddresses)
- [getWalletAddress](../wiki/@liquality.bitcoin.BitcoinNodeWalletProvider#getwalletaddress)
- [isWalletAvailable](../wiki/@liquality.bitcoin.BitcoinNodeWalletProvider#iswalletavailable)
- [sendBatchTransaction](../wiki/@liquality.bitcoin.BitcoinNodeWalletProvider#sendbatchtransaction)
- [sendSweepTransaction](../wiki/@liquality.bitcoin.BitcoinNodeWalletProvider#sendsweeptransaction)
- [sendTransaction](../wiki/@liquality.bitcoin.BitcoinNodeWalletProvider#sendtransaction)
- [setChainProvider](../wiki/@liquality.bitcoin.BitcoinNodeWalletProvider#setchainprovider)
- [signBatchP2SHTransaction](../wiki/@liquality.bitcoin.BitcoinNodeWalletProvider#signbatchp2shtransaction)
- [signMessage](../wiki/@liquality.bitcoin.BitcoinNodeWalletProvider#signmessage)
- [signPSBT](../wiki/@liquality.bitcoin.BitcoinNodeWalletProvider#signpsbt)
- [updateTransactionFee](../wiki/@liquality.bitcoin.BitcoinNodeWalletProvider#updatetransactionfee)

## Constructors

### constructor

• **new BitcoinNodeWalletProvider**(`chainProvider`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainProvider` | `default`<[`BitcoinBaseChainProvider`](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider)\> |
| `options?` | [`BitcoinNodeWalletOptions`](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinNodeWalletOptions) |

#### Overrides

Wallet&lt;any, any\&gt;.constructor

#### Defined in

[bitcoin/lib/wallet/BitcoinNodeWallet.ts:30](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinNodeWallet.ts#L30)

## Properties

### chainProvider

• `Protected` **chainProvider**: `default`<`any`\>

#### Implementation of

IBitcoinWallet.chainProvider

#### Inherited from

Wallet.chainProvider

#### Defined in

client/dist/lib/Wallet.d.ts:4

## Methods

### canUpdateFee

▸ **canUpdateFee**(): `boolean`

#### Returns

`boolean`

#### Implementation of

IBitcoinWallet.canUpdateFee

#### Overrides

Wallet.canUpdateFee

#### Defined in

[bitcoin/lib/wallet/BitcoinNodeWallet.ts:128](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinNodeWallet.ts#L128)

___

### exportPrivateKey

▸ **exportPrivateKey**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Implementation of

IBitcoinWallet.exportPrivateKey

#### Overrides

Wallet.exportPrivateKey

#### Defined in

[bitcoin/lib/wallet/BitcoinNodeWallet.ts:114](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinNodeWallet.ts#L114)

___

### getAddress

▸ **getAddress**(): `Promise`<`AddressType`\>

#### Returns

`Promise`<`AddressType`\>

#### Implementation of

IBitcoinWallet.getAddress

#### Overrides

Wallet.getAddress

#### Defined in

[bitcoin/lib/wallet/BitcoinNodeWallet.ts:98](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinNodeWallet.ts#L98)

___

### getAddresses

▸ **getAddresses**(): `Promise`<`Address`[]\>

#### Returns

`Promise`<`Address`[]\>

#### Implementation of

IBitcoinWallet.getAddresses

#### Overrides

Wallet.getAddresses

#### Defined in

[bitcoin/lib/wallet/BitcoinNodeWallet.ts:50](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinNodeWallet.ts#L50)

___

### getBalance

▸ **getBalance**(`assets`): `Promise`<`BigNumber`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `assets` | `Asset`[] |

#### Returns

`Promise`<`BigNumber`[]\>

#### Implementation of

IBitcoinWallet.getBalance

#### Overrides

Wallet.getBalance

#### Defined in

[bitcoin/lib/wallet/BitcoinNodeWallet.ts:109](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinNodeWallet.ts#L109)

___

### getChainProvider

▸ **getChainProvider**(): `default`<`any`\>

#### Returns

`default`<`any`\>

#### Implementation of

IBitcoinWallet.getChainProvider

#### Inherited from

Wallet.getChainProvider

#### Defined in

client/dist/lib/Wallet.d.ts:7

___

### getConnectedNetwork

▸ **getConnectedNetwork**(): `Promise`<`Network`\>

#### Returns

`Promise`<`Network`\>

#### Implementation of

IBitcoinWallet.getConnectedNetwork

#### Overrides

Wallet.getConnectedNetwork

#### Defined in

[bitcoin/lib/wallet/BitcoinNodeWallet.ts:88](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinNodeWallet.ts#L88)

___

### getSigner

▸ **getSigner**(): `Promise`<``null``\>

#### Returns

`Promise`<``null``\>

#### Implementation of

IBitcoinWallet.getSigner

#### Overrides

Wallet.getSigner

#### Defined in

[bitcoin/lib/wallet/BitcoinNodeWallet.ts:94](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinNodeWallet.ts#L94)

___

### getUnusedAddress

▸ **getUnusedAddress**(): `Promise`<`Address`\>

#### Returns

`Promise`<`Address`\>

#### Implementation of

IBitcoinWallet.getUnusedAddress

#### Overrides

Wallet.getUnusedAddress

#### Defined in

[bitcoin/lib/wallet/BitcoinNodeWallet.ts:38](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinNodeWallet.ts#L38)

___

### getUsedAddresses

▸ **getUsedAddresses**(): `Promise`<`Address`[]\>

#### Returns

`Promise`<`Address`[]\>

#### Implementation of

IBitcoinWallet.getUsedAddresses

#### Overrides

Wallet.getUsedAddresses

#### Defined in

[bitcoin/lib/wallet/BitcoinNodeWallet.ts:42](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinNodeWallet.ts#L42)

___

### getWalletAddress

▸ **getWalletAddress**(`address`): `Promise`<`Address`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`Promise`<`Address`\>

#### Implementation of

IBitcoinWallet.getWalletAddress

#### Defined in

[bitcoin/lib/wallet/BitcoinNodeWallet.ts:181](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinNodeWallet.ts#L181)

___

### isWalletAvailable

▸ **isWalletAvailable**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Implementation of

IBitcoinWallet.isWalletAvailable

#### Overrides

Wallet.isWalletAvailable

#### Defined in

[bitcoin/lib/wallet/BitcoinNodeWallet.ts:119](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinNodeWallet.ts#L119)

___

### sendBatchTransaction

▸ **sendBatchTransaction**(`transactions`): `Promise`<`Transaction`<[`Transaction`](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction)\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactions` | `TransactionRequest`[] |

#### Returns

`Promise`<`Transaction`<[`Transaction`](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction)\>[]\>

#### Implementation of

IBitcoinWallet.sendBatchTransaction

#### Overrides

Wallet.sendBatchTransaction

#### Defined in

[bitcoin/lib/wallet/BitcoinNodeWallet.ts:60](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinNodeWallet.ts#L60)

___

### sendSweepTransaction

▸ **sendSweepTransaction**(`_address`, `_asset`, `_fee?`): `Promise`<`Transaction`<`any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_address` | `AddressType` |
| `_asset` | `Asset` |
| `_fee?` | `FeeType` |

#### Returns

`Promise`<`Transaction`<`any`\>\>

#### Implementation of

IBitcoinWallet.sendSweepTransaction

#### Overrides

Wallet.sendSweepTransaction

#### Defined in

[bitcoin/lib/wallet/BitcoinNodeWallet.ts:74](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinNodeWallet.ts#L74)

___

### sendTransaction

▸ **sendTransaction**(`txRequest`): `Promise`<`Transaction`<[`Transaction`](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `txRequest` | `TransactionRequest` |

#### Returns

`Promise`<`Transaction`<[`Transaction`](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction)\>\>

#### Implementation of

IBitcoinWallet.sendTransaction

#### Overrides

Wallet.sendTransaction

#### Defined in

[bitcoin/lib/wallet/BitcoinNodeWallet.ts:54](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinNodeWallet.ts#L54)

___

### setChainProvider

▸ **setChainProvider**(`chainProvider`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainProvider` | `default`<`any`\> |

#### Returns

`void`

#### Implementation of

IBitcoinWallet.setChainProvider

#### Inherited from

Wallet.setChainProvider

#### Defined in

client/dist/lib/Wallet.d.ts:6

___

### signBatchP2SHTransaction

▸ **signBatchP2SHTransaction**(`inputs`, `addresses`, `tx`, `locktime`, `segwit?`): `Promise`<`Buffer`[]\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `inputs` | [{ `index`: `number` ; `inputTxHex`: `string` ; `outputScript`: `Buffer` ; `vout`: `any`  }] | `undefined` |
| `addresses` | `string` | `undefined` |
| `tx` | `any` | `undefined` |
| `locktime` | `number` | `undefined` |
| `segwit` | `boolean` | `false` |

#### Returns

`Promise`<`Buffer`[]\>

#### Defined in

[bitcoin/lib/wallet/BitcoinNodeWallet.ts:146](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinNodeWallet.ts#L146)

___

### signMessage

▸ **signMessage**(`message`, `from`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |
| `from` | `string` |

#### Returns

`Promise`<`string`\>

#### Implementation of

IBitcoinWallet.signMessage

#### Overrides

Wallet.signMessage

#### Defined in

[bitcoin/lib/wallet/BitcoinNodeWallet.ts:103](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinNodeWallet.ts#L103)

___

### signPSBT

▸ **signPSBT**(`data`, `inputs`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `string` |
| `inputs` | [`PsbtInputTarget`](../wiki/@liquality.bitcoin.BitcoinTypes.PsbtInputTarget)[] |

#### Returns

`Promise`<`string`\>

#### Implementation of

IBitcoinWallet.signPSBT

#### Defined in

[bitcoin/lib/wallet/BitcoinNodeWallet.ts:132](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinNodeWallet.ts#L132)

___

### updateTransactionFee

▸ **updateTransactionFee**(`tx`, `newFee`): `Promise`<`Transaction`<`any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | `string` \| `Transaction`<`any`\> |
| `newFee` | `number` |

#### Returns

`Promise`<`Transaction`<`any`\>\>

#### Implementation of

IBitcoinWallet.updateTransactionFee

#### Overrides

Wallet.updateTransactionFee

#### Defined in

[bitcoin/lib/wallet/BitcoinNodeWallet.ts:78](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinNodeWallet.ts#L78)
