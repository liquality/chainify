[](../README.md) / [Exports](../modules.md) / [@liquality/bitcoin](../modules/liquality_bitcoin.md) / BitcoinBaseWalletProvider

# Class: BitcoinBaseWalletProvider<T, S\>

[@liquality/bitcoin](../modules/liquality_bitcoin.md).BitcoinBaseWalletProvider

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`BitcoinBaseChainProvider`](liquality_bitcoin.BitcoinBaseChainProvider.md) = `any` |
| `S` | `any` |

## Hierarchy

- `default`<`T`, `S`\>

  ↳ **`BitcoinBaseWalletProvider`**

  ↳↳ [`BitcoinHDWalletProvider`](liquality_bitcoin.BitcoinHDWalletProvider.md)

## Table of contents

### Constructors

- [constructor](liquality_bitcoin.BitcoinBaseWalletProvider.md#constructor)

### Properties

- [\_addressType](liquality_bitcoin.BitcoinBaseWalletProvider.md#_addresstype)
- [\_baseDerivationPath](liquality_bitcoin.BitcoinBaseWalletProvider.md#_basederivationpath)
- [\_derivationCache](liquality_bitcoin.BitcoinBaseWalletProvider.md#_derivationcache)
- [\_network](liquality_bitcoin.BitcoinBaseWalletProvider.md#_network)
- [chainProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md#chainprovider)

### Methods

- [\_getUsedUnusedAddresses](liquality_bitcoin.BitcoinBaseWalletProvider.md#_getusedunusedaddresses)
- [\_sendTransaction](liquality_bitcoin.BitcoinBaseWalletProvider.md#_sendtransaction)
- [baseDerivationNode](liquality_bitcoin.BitcoinBaseWalletProvider.md#basederivationnode)
- [buildSweepTransaction](liquality_bitcoin.BitcoinBaseWalletProvider.md#buildsweeptransaction)
- [buildTransaction](liquality_bitcoin.BitcoinBaseWalletProvider.md#buildtransaction)
- [canUpdateFee](liquality_bitcoin.BitcoinBaseWalletProvider.md#canupdatefee)
- [exportPrivateKey](liquality_bitcoin.BitcoinBaseWalletProvider.md#exportprivatekey)
- [findAddress](liquality_bitcoin.BitcoinBaseWalletProvider.md#findaddress)
- [getAddress](liquality_bitcoin.BitcoinBaseWalletProvider.md#getaddress)
- [getAddressFromPublicKey](liquality_bitcoin.BitcoinBaseWalletProvider.md#getaddressfrompublickey)
- [getAddresses](liquality_bitcoin.BitcoinBaseWalletProvider.md#getaddresses)
- [getBalance](liquality_bitcoin.BitcoinBaseWalletProvider.md#getbalance)
- [getChainProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md#getchainprovider)
- [getConnectedNetwork](liquality_bitcoin.BitcoinBaseWalletProvider.md#getconnectednetwork)
- [getDerivationCache](liquality_bitcoin.BitcoinBaseWalletProvider.md#getderivationcache)
- [getDerivationPathAddress](liquality_bitcoin.BitcoinBaseWalletProvider.md#getderivationpathaddress)
- [getInputsForAmount](liquality_bitcoin.BitcoinBaseWalletProvider.md#getinputsforamount)
- [getPaymentVariantFromPublicKey](liquality_bitcoin.BitcoinBaseWalletProvider.md#getpaymentvariantfrompublickey)
- [getSigner](liquality_bitcoin.BitcoinBaseWalletProvider.md#getsigner)
- [getTotalFee](liquality_bitcoin.BitcoinBaseWalletProvider.md#gettotalfee)
- [getTotalFees](liquality_bitcoin.BitcoinBaseWalletProvider.md#gettotalfees)
- [getUnusedAddress](liquality_bitcoin.BitcoinBaseWalletProvider.md#getunusedaddress)
- [getUsedAddresses](liquality_bitcoin.BitcoinBaseWalletProvider.md#getusedaddresses)
- [getWalletAddress](liquality_bitcoin.BitcoinBaseWalletProvider.md#getwalletaddress)
- [isWalletAvailable](liquality_bitcoin.BitcoinBaseWalletProvider.md#iswalletavailable)
- [sendBatchTransaction](liquality_bitcoin.BitcoinBaseWalletProvider.md#sendbatchtransaction)
- [sendOptionsToOutputs](liquality_bitcoin.BitcoinBaseWalletProvider.md#sendoptionstooutputs)
- [sendSweepTransaction](liquality_bitcoin.BitcoinBaseWalletProvider.md#sendsweeptransaction)
- [sendTransaction](liquality_bitcoin.BitcoinBaseWalletProvider.md#sendtransaction)
- [setChainProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md#setchainprovider)
- [signBatchP2SHTransaction](liquality_bitcoin.BitcoinBaseWalletProvider.md#signbatchp2shtransaction)
- [signMessage](liquality_bitcoin.BitcoinBaseWalletProvider.md#signmessage)
- [signPSBT](liquality_bitcoin.BitcoinBaseWalletProvider.md#signpsbt)
- [updateTransactionFee](liquality_bitcoin.BitcoinBaseWalletProvider.md#updatetransactionfee)
- [withCachedUtxos](liquality_bitcoin.BitcoinBaseWalletProvider.md#withcachedutxos)

## Constructors

### constructor

• **new BitcoinBaseWalletProvider**<`T`, `S`\>(`options`, `chainProvider`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`BitcoinBaseChainProvider`](liquality_bitcoin.BitcoinBaseChainProvider.md)<`T`\> = `any` |
| `S` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`BitcoinWalletProviderOptions`](../interfaces/liquality_bitcoin.BitcoinTypes.BitcoinWalletProviderOptions.md) |
| `chainProvider` | `default`<`T`\> |

#### Overrides

Wallet&lt;T, S\&gt;.constructor

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:39](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L39)

## Properties

### \_addressType

• `Protected` **\_addressType**: [`AddressType`](../enums/liquality_bitcoin.BitcoinTypes.AddressType.md)

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:36](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L36)

___

### \_baseDerivationPath

• `Protected` **\_baseDerivationPath**: `string`

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:34](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L34)

___

### \_derivationCache

• `Protected` **\_derivationCache**: `DerivationCache`

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:37](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L37)

___

### \_network

• `Protected` **\_network**: [`BitcoinNetwork`](../interfaces/liquality_bitcoin.BitcoinTypes.BitcoinNetwork.md)

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:35](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L35)

___

### chainProvider

• `Protected` **chainProvider**: `default`<`T`\>

#### Inherited from

Wallet.chainProvider

#### Defined in

client/dist/lib/Wallet.d.ts:4

## Methods

### \_getUsedUnusedAddresses

▸ `Protected` **_getUsedUnusedAddresses**(`numAddressPerCall?`, `addressType`): `Promise`<{ `unusedAddress`: { `change`: `Address` ; `external`: `Address`  } = unusedAddressMap; `usedAddresses`: `Address`[]  }\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `numAddressPerCall` | `number` | `100` |
| `addressType` | `AddressSearchType` | `undefined` |

#### Returns

`Promise`<{ `unusedAddress`: { `change`: `Address` ; `external`: `Address`  } = unusedAddressMap; `usedAddresses`: `Address`[]  }\>

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:211](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L211)

___

### \_sendTransaction

▸ `Protected` **_sendTransaction**(`transactions`, `feePerByte?`): `Promise`<`Transaction`<[`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactions` | [`OutputTarget`](../interfaces/liquality_bitcoin.BitcoinTypes.OutputTarget.md)[] |
| `feePerByte?` | `number` |

#### Returns

`Promise`<`Transaction`<[`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)\>\>

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:157](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L157)

___

### baseDerivationNode

▸ `Protected` `Abstract` **baseDerivationNode**(): `Promise`<`BIP32Interface`\>

#### Returns

`Promise`<`BIP32Interface`\>

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:54](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L54)

___

### buildSweepTransaction

▸ `Protected` `Abstract` **buildSweepTransaction**(`externalChangeAddress`, `feePerByte?`): `Promise`<{ `fee`: `number` ; `hex`: `string`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `externalChangeAddress` | `string` |
| `feePerByte?` | `number` |

#### Returns

`Promise`<{ `fee`: `number` ; `hex`: `string`  }\>

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:60](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L60)

___

### buildTransaction

▸ `Protected` `Abstract` **buildTransaction**(`targets`, `feePerByte?`, `fixedInputs?`): `Promise`<{ `fee`: `number` ; `hex`: `string`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `targets` | [`OutputTarget`](../interfaces/liquality_bitcoin.BitcoinTypes.OutputTarget.md)[] |
| `feePerByte?` | `number` |
| `fixedInputs?` | [`Input`](../interfaces/liquality_bitcoin.BitcoinTypes.Input.md)[] |

#### Returns

`Promise`<{ `fee`: `number` ; `hex`: `string`  }\>

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:55](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L55)

___

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

### findAddress

▸ `Protected` **findAddress**(`addresses`, `change?`): `Promise`<`Address`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `addresses` | `string`[] | `undefined` |
| `change` | `boolean` | `false` |

#### Returns

`Promise`<`Address`\>

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:163](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L163)

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

### getAddressFromPublicKey

▸ `Protected` **getAddressFromPublicKey**(`publicKey`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `publicKey` | `Buffer` |

#### Returns

`string`

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:464](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L464)

___

### getAddresses

▸ **getAddresses**(`startingIndex?`, `numAddresses?`, `change?`): `Promise`<`Address`[]\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `startingIndex` | `number` | `0` |
| `numAddresses` | `number` | `1` |
| `change` | `boolean` | `false` |

#### Returns

`Promise`<`Address`[]\>

#### Overrides

Wallet.getAddresses

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:86](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L86)

___

### getBalance

▸ `Abstract` **getBalance**(`assets`): `Promise`<`BigNumber`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `assets` | `Asset`[] |

#### Returns

`Promise`<`BigNumber`[]\>

#### Inherited from

Wallet.getBalance

#### Defined in

client/dist/lib/Wallet.d.ts:19

___

### getChainProvider

▸ **getChainProvider**(): `default`<`T`\>

#### Returns

`default`<`T`\>

#### Inherited from

Wallet.getChainProvider

#### Defined in

client/dist/lib/Wallet.d.ts:7

___

### getConnectedNetwork

▸ `Abstract` **getConnectedNetwork**(): `Promise`<`Network`\>

#### Returns

`Promise`<`Network`\>

#### Inherited from

Wallet.getConnectedNetwork

#### Defined in

client/dist/lib/Wallet.d.ts:8

___

### getDerivationCache

▸ **getDerivationCache**(): `DerivationCache`

#### Returns

`DerivationCache`

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:70](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L70)

___

### getDerivationPathAddress

▸ `Protected` **getDerivationPathAddress**(`path`): `Promise`<`Address`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

`Promise`<`Address`\>

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:192](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L192)

___

### getInputsForAmount

▸ `Protected` **getInputsForAmount**(`_targets`, `feePerByte?`, `fixedInputs?`, `numAddressPerCall?`, `sweep?`): `Promise`<{ `change`: [`CoinSelectTarget`](../modules/liquality_bitcoin.BitcoinUtils.md#coinselecttarget) ; `fee`: `number` ; `inputs`: [`UTXO`](../interfaces/liquality_bitcoin.BitcoinTypes.UTXO.md)[] ; `outputs`: [`CoinSelectTarget`](../modules/liquality_bitcoin.BitcoinUtils.md#coinselecttarget)[]  }\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `_targets` | [`OutputTarget`](../interfaces/liquality_bitcoin.BitcoinTypes.OutputTarget.md)[] | `undefined` |
| `feePerByte?` | `number` | `undefined` |
| `fixedInputs` | [`Input`](../interfaces/liquality_bitcoin.BitcoinTypes.Input.md)[] | `[]` |
| `numAddressPerCall` | `number` | `100` |
| `sweep` | `boolean` | `false` |

#### Returns

`Promise`<{ `change`: [`CoinSelectTarget`](../modules/liquality_bitcoin.BitcoinUtils.md#coinselecttarget) ; `fee`: `number` ; `inputs`: [`UTXO`](../interfaces/liquality_bitcoin.BitcoinTypes.UTXO.md)[] ; `outputs`: [`CoinSelectTarget`](../modules/liquality_bitcoin.BitcoinUtils.md#coinselecttarget)[]  }\>

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:317](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L317)

___

### getPaymentVariantFromPublicKey

▸ `Protected` **getPaymentVariantFromPublicKey**(`publicKey`): `Payment`

#### Parameters

| Name | Type |
| :------ | :------ |
| `publicKey` | `Buffer` |

#### Returns

`Payment`

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:468](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L468)

___

### getSigner

▸ `Abstract` **getSigner**(): `S`

#### Returns

`S`

#### Inherited from

Wallet.getSigner

#### Defined in

client/dist/lib/Wallet.d.ts:9

___

### getTotalFee

▸ `Protected` **getTotalFee**(`opts`, `max`): `Promise`<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | `TransactionRequest` |
| `max` | `boolean` |

#### Returns

`Promise`<`number`\>

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:300](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L300)

___

### getTotalFees

▸ **getTotalFees**(`transactions`, `max`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactions` | `TransactionRequest`[] |
| `max` | `boolean` |

#### Returns

`Promise`<`any`\>

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:145](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L145)

___

### getUnusedAddress

▸ **getUnusedAddress**(`change?`, `numAddressPerCall?`): `Promise`<`Address`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `change` | `boolean` | `false` |
| `numAddressPerCall` | `number` | `100` |

#### Returns

`Promise`<`Address`\>

#### Overrides

Wallet.getUnusedAddress

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:74](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L74)

___

### getUsedAddresses

▸ **getUsedAddresses**(`numAddressPerCall?`): `Promise`<`Address`[]\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `numAddressPerCall` | `number` | `100` |

#### Returns

`Promise`<`Address`[]\>

#### Overrides

Wallet.getUsedAddresses

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:80](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L80)

___

### getWalletAddress

▸ **getWalletAddress**(`address`): `Promise`<`Address`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`Promise`<`Address`\>

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:178](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L178)

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

▸ **sendBatchTransaction**(`transactions`): `Promise`<`Transaction`<[`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactions` | `TransactionRequest`[] |

#### Returns

`Promise`<`Transaction`<[`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)\>[]\>

#### Overrides

Wallet.sendBatchTransaction

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:111](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L111)

___

### sendOptionsToOutputs

▸ `Protected` **sendOptionsToOutputs**(`transactions`): [`OutputTarget`](../interfaces/liquality_bitcoin.BitcoinTypes.OutputTarget.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactions` | `TransactionRequest`[] |

#### Returns

[`OutputTarget`](../interfaces/liquality_bitcoin.BitcoinTypes.OutputTarget.md)[]

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:441](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L441)

___

### sendSweepTransaction

▸ **sendSweepTransaction**(`externalChangeAddress`, `_asset`, `feePerByte`): `Promise`<`Transaction`<[`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `externalChangeAddress` | `AddressType` |
| `_asset` | `Asset` |
| `feePerByte` | `number` |

#### Returns

`Promise`<`Transaction`<[`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)\>\>

#### Overrides

Wallet.sendSweepTransaction

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:115](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L115)

___

### sendTransaction

▸ **sendTransaction**(`options`): `Promise`<`Transaction`<[`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `TransactionRequest` |

#### Returns

`Promise`<`Transaction`<[`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)\>\>

#### Overrides

Wallet.sendTransaction

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:107](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L107)

___

### setChainProvider

▸ **setChainProvider**(`chainProvider`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainProvider` | `default`<`T`\> |

#### Returns

`void`

#### Inherited from

Wallet.setChainProvider

#### Defined in

client/dist/lib/Wallet.d.ts:6

___

### signBatchP2SHTransaction

▸ `Abstract` **signBatchP2SHTransaction**(`inputs`, `addresses`, `tx`, `lockTime?`, `segwit?`): `Promise`<`Buffer`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputs` | [`P2SHInput`](../interfaces/liquality_bitcoin.BitcoinTypes.P2SHInput.md)[] |
| `addresses` | `string` |
| `tx` | `any` |
| `lockTime?` | `number` |
| `segwit?` | `boolean` |

#### Returns

`Promise`<`Buffer`[]\>

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:62](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L62)

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

#### Inherited from

Wallet.signMessage

#### Defined in

client/dist/lib/Wallet.d.ts:14

___

### signPSBT

▸ `Abstract` **signPSBT**(`data`, `inputs`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `string` |
| `inputs` | [`PsbtInputTarget`](../interfaces/liquality_bitcoin.BitcoinTypes.PsbtInputTarget.md)[] |

#### Returns

`Promise`<`string`\>

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:61](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L61)

___

### updateTransactionFee

▸ **updateTransactionFee**(`tx`, `newFeePerByte`): `Promise`<`Transaction`<[`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | `string` \| `Transaction`<[`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)\> |
| `newFeePerByte` | `number` |

#### Returns

`Promise`<`Transaction`<[`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)\>\>

#### Overrides

Wallet.updateTransactionFee

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:121](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L121)

___

### withCachedUtxos

▸ `Protected` **withCachedUtxos**(`func`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `func` | () => `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:280](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L280)
