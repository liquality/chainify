[](../README.md) / [Exports](../modules.md) / [@liquality/bitcoin](../modules/liquality_bitcoin.md) / BitcoinHDWalletProvider

# Class: BitcoinHDWalletProvider

[@liquality/bitcoin](../modules/liquality_bitcoin.md).BitcoinHDWalletProvider

## Hierarchy

- [`BitcoinBaseWalletProvider`](liquality_bitcoin.BitcoinBaseWalletProvider.md)

  ↳ **`BitcoinHDWalletProvider`**

## Implements

- `IBitcoinWallet`<[`BitcoinBaseChainProvider`](liquality_bitcoin.BitcoinBaseChainProvider.md)\>

## Table of contents

### Constructors

- [constructor](liquality_bitcoin.BitcoinHDWalletProvider.md#constructor)

### Properties

- [\_addressType](liquality_bitcoin.BitcoinHDWalletProvider.md#_addresstype)
- [\_baseDerivationNode](liquality_bitcoin.BitcoinHDWalletProvider.md#_basederivationnode)
- [\_baseDerivationPath](liquality_bitcoin.BitcoinHDWalletProvider.md#_basederivationpath)
- [\_derivationCache](liquality_bitcoin.BitcoinHDWalletProvider.md#_derivationcache)
- [\_mnemonic](liquality_bitcoin.BitcoinHDWalletProvider.md#_mnemonic)
- [\_network](liquality_bitcoin.BitcoinHDWalletProvider.md#_network)
- [\_seedNode](liquality_bitcoin.BitcoinHDWalletProvider.md#_seednode)
- [chainProvider](liquality_bitcoin.BitcoinHDWalletProvider.md#chainprovider)

### Methods

- [\_getUsedUnusedAddresses](liquality_bitcoin.BitcoinHDWalletProvider.md#_getusedunusedaddresses)
- [\_sendTransaction](liquality_bitcoin.BitcoinHDWalletProvider.md#_sendtransaction)
- [\_toWIF](liquality_bitcoin.BitcoinHDWalletProvider.md#_towif)
- [baseDerivationNode](liquality_bitcoin.BitcoinHDWalletProvider.md#basederivationnode)
- [buildSweepTransaction](liquality_bitcoin.BitcoinHDWalletProvider.md#buildsweeptransaction)
- [buildTransaction](liquality_bitcoin.BitcoinHDWalletProvider.md#buildtransaction)
- [canUpdateFee](liquality_bitcoin.BitcoinHDWalletProvider.md#canupdatefee)
- [exportPrivateKey](liquality_bitcoin.BitcoinHDWalletProvider.md#exportprivatekey)
- [findAddress](liquality_bitcoin.BitcoinHDWalletProvider.md#findaddress)
- [getAddress](liquality_bitcoin.BitcoinHDWalletProvider.md#getaddress)
- [getAddressFromPublicKey](liquality_bitcoin.BitcoinHDWalletProvider.md#getaddressfrompublickey)
- [getAddresses](liquality_bitcoin.BitcoinHDWalletProvider.md#getaddresses)
- [getBalance](liquality_bitcoin.BitcoinHDWalletProvider.md#getbalance)
- [getChainProvider](liquality_bitcoin.BitcoinHDWalletProvider.md#getchainprovider)
- [getConnectedNetwork](liquality_bitcoin.BitcoinHDWalletProvider.md#getconnectednetwork)
- [getDerivationCache](liquality_bitcoin.BitcoinHDWalletProvider.md#getderivationcache)
- [getDerivationPathAddress](liquality_bitcoin.BitcoinHDWalletProvider.md#getderivationpathaddress)
- [getInputsForAmount](liquality_bitcoin.BitcoinHDWalletProvider.md#getinputsforamount)
- [getPaymentVariantFromPublicKey](liquality_bitcoin.BitcoinHDWalletProvider.md#getpaymentvariantfrompublickey)
- [getSigner](liquality_bitcoin.BitcoinHDWalletProvider.md#getsigner)
- [getTotalFee](liquality_bitcoin.BitcoinHDWalletProvider.md#gettotalfee)
- [getTotalFees](liquality_bitcoin.BitcoinHDWalletProvider.md#gettotalfees)
- [getUnusedAddress](liquality_bitcoin.BitcoinHDWalletProvider.md#getunusedaddress)
- [getUsedAddresses](liquality_bitcoin.BitcoinHDWalletProvider.md#getusedaddresses)
- [getWalletAddress](liquality_bitcoin.BitcoinHDWalletProvider.md#getwalletaddress)
- [isWalletAvailable](liquality_bitcoin.BitcoinHDWalletProvider.md#iswalletavailable)
- [keyPair](liquality_bitcoin.BitcoinHDWalletProvider.md#keypair)
- [seedNode](liquality_bitcoin.BitcoinHDWalletProvider.md#seednode)
- [sendBatchTransaction](liquality_bitcoin.BitcoinHDWalletProvider.md#sendbatchtransaction)
- [sendOptionsToOutputs](liquality_bitcoin.BitcoinHDWalletProvider.md#sendoptionstooutputs)
- [sendSweepTransaction](liquality_bitcoin.BitcoinHDWalletProvider.md#sendsweeptransaction)
- [sendTransaction](liquality_bitcoin.BitcoinHDWalletProvider.md#sendtransaction)
- [setChainProvider](liquality_bitcoin.BitcoinHDWalletProvider.md#setchainprovider)
- [signBatchP2SHTransaction](liquality_bitcoin.BitcoinHDWalletProvider.md#signbatchp2shtransaction)
- [signMessage](liquality_bitcoin.BitcoinHDWalletProvider.md#signmessage)
- [signPSBT](liquality_bitcoin.BitcoinHDWalletProvider.md#signpsbt)
- [updateTransactionFee](liquality_bitcoin.BitcoinHDWalletProvider.md#updatetransactionfee)
- [withCachedUtxos](liquality_bitcoin.BitcoinHDWalletProvider.md#withcachedutxos)

## Constructors

### constructor

• **new BitcoinHDWalletProvider**(`options`, `chainProvider`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`BitcoinHDWalletProviderOptions`](../interfaces/liquality_bitcoin.BitcoinTypes.BitcoinHDWalletProviderOptions.md) |
| `chainProvider` | `default`<[`BitcoinBaseChainProvider`](liquality_bitcoin.BitcoinBaseChainProvider.md)\> |

#### Overrides

[BitcoinBaseWalletProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md).[constructor](liquality_bitcoin.BitcoinBaseWalletProvider.md#constructor)

#### Defined in

[bitcoin/lib/wallet/BitcoinHDWallet.ts:17](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinHDWallet.ts#L17)

## Properties

### \_addressType

• `Protected` **\_addressType**: [`AddressType`](../enums/liquality_bitcoin.BitcoinTypes.AddressType.md)

#### Inherited from

[BitcoinBaseWalletProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md).[_addressType](liquality_bitcoin.BitcoinBaseWalletProvider.md#_addresstype)

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:36](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L36)

___

### \_baseDerivationNode

• `Private` **\_baseDerivationNode**: `BIP32Interface`

#### Defined in

[bitcoin/lib/wallet/BitcoinHDWallet.ts:15](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinHDWallet.ts#L15)

___

### \_baseDerivationPath

• `Protected` **\_baseDerivationPath**: `string`

#### Inherited from

[BitcoinBaseWalletProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md).[_baseDerivationPath](liquality_bitcoin.BitcoinBaseWalletProvider.md#_basederivationpath)

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:34](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L34)

___

### \_derivationCache

• `Protected` **\_derivationCache**: `DerivationCache`

#### Inherited from

[BitcoinBaseWalletProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md).[_derivationCache](liquality_bitcoin.BitcoinBaseWalletProvider.md#_derivationcache)

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:37](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L37)

___

### \_mnemonic

• `Private` **\_mnemonic**: `string`

#### Defined in

[bitcoin/lib/wallet/BitcoinHDWallet.ts:13](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinHDWallet.ts#L13)

___

### \_network

• `Protected` **\_network**: [`BitcoinNetwork`](../interfaces/liquality_bitcoin.BitcoinTypes.BitcoinNetwork.md)

#### Inherited from

[BitcoinBaseWalletProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md).[_network](liquality_bitcoin.BitcoinBaseWalletProvider.md#_network)

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:35](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L35)

___

### \_seedNode

• `Private` **\_seedNode**: `BIP32Interface`

#### Defined in

[bitcoin/lib/wallet/BitcoinHDWallet.ts:14](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinHDWallet.ts#L14)

___

### chainProvider

• `Protected` **chainProvider**: `default`<`any`\>

#### Implementation of

IBitcoinWallet.chainProvider

#### Inherited from

[BitcoinBaseWalletProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md).[chainProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md#chainprovider)

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

#### Inherited from

[BitcoinBaseWalletProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md).[_getUsedUnusedAddresses](liquality_bitcoin.BitcoinBaseWalletProvider.md#_getusedunusedaddresses)

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

#### Inherited from

[BitcoinBaseWalletProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md).[_sendTransaction](liquality_bitcoin.BitcoinBaseWalletProvider.md#_sendtransaction)

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:157](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L157)

___

### \_toWIF

▸ `Private` **_toWIF**(`derivationPath`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `derivationPath` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

[bitcoin/lib/wallet/BitcoinHDWallet.ts:207](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinHDWallet.ts#L207)

___

### baseDerivationNode

▸ `Protected` **baseDerivationNode**(): `Promise`<`BIP32Interface`\>

#### Returns

`Promise`<`BIP32Interface`\>

#### Overrides

[BitcoinBaseWalletProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md).[baseDerivationNode](liquality_bitcoin.BitcoinBaseWalletProvider.md#basederivationnode)

#### Defined in

[bitcoin/lib/wallet/BitcoinHDWallet.ts:64](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinHDWallet.ts#L64)

___

### buildSweepTransaction

▸ `Protected` **buildSweepTransaction**(`externalChangeAddress`, `feePerByte`): `Promise`<{ `fee`: `number` ; `hex`: `string`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `externalChangeAddress` | `string` |
| `feePerByte` | `number` |

#### Returns

`Promise`<{ `fee`: `number` ; `hex`: `string`  }\>

#### Overrides

[BitcoinBaseWalletProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md).[buildSweepTransaction](liquality_bitcoin.BitcoinBaseWalletProvider.md#buildsweeptransaction)

#### Defined in

[bitcoin/lib/wallet/BitcoinHDWallet.ts:144](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinHDWallet.ts#L144)

___

### buildTransaction

▸ `Protected` **buildTransaction**(`targets`, `feePerByte?`, `fixedInputs?`): `Promise`<{ `fee`: `number` ; `hex`: `string`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `targets` | [`OutputTarget`](../interfaces/liquality_bitcoin.BitcoinTypes.OutputTarget.md)[] |
| `feePerByte?` | `number` |
| `fixedInputs?` | [`Input`](../interfaces/liquality_bitcoin.BitcoinTypes.Input.md)[] |

#### Returns

`Promise`<{ `fee`: `number` ; `hex`: `string`  }\>

#### Overrides

[BitcoinBaseWalletProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md).[buildTransaction](liquality_bitcoin.BitcoinBaseWalletProvider.md#buildtransaction)

#### Defined in

[bitcoin/lib/wallet/BitcoinHDWallet.ts:73](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinHDWallet.ts#L73)

___

### canUpdateFee

▸ **canUpdateFee**(): `boolean`

#### Returns

`boolean`

#### Implementation of

IBitcoinWallet.canUpdateFee

#### Overrides

[BitcoinBaseWalletProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md).[canUpdateFee](liquality_bitcoin.BitcoinBaseWalletProvider.md#canupdatefee)

#### Defined in

[bitcoin/lib/wallet/BitcoinHDWallet.ts:27](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinHDWallet.ts#L27)

___

### exportPrivateKey

▸ **exportPrivateKey**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Implementation of

IBitcoinWallet.exportPrivateKey

#### Overrides

[BitcoinBaseWalletProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md).[exportPrivateKey](liquality_bitcoin.BitcoinBaseWalletProvider.md#exportprivatekey)

#### Defined in

[bitcoin/lib/wallet/BitcoinHDWallet.ts:52](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinHDWallet.ts#L52)

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

#### Inherited from

[BitcoinBaseWalletProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md).[findAddress](liquality_bitcoin.BitcoinBaseWalletProvider.md#findaddress)

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:163](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L163)

___

### getAddress

▸ **getAddress**(): `Promise`<`AddressType`\>

#### Returns

`Promise`<`AddressType`\>

#### Implementation of

IBitcoinWallet.getAddress

#### Overrides

[BitcoinBaseWalletProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md).[getAddress](liquality_bitcoin.BitcoinBaseWalletProvider.md#getaddress)

#### Defined in

[bitcoin/lib/wallet/BitcoinHDWallet.ts:35](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinHDWallet.ts#L35)

___

### getAddressFromPublicKey

▸ `Protected` **getAddressFromPublicKey**(`publicKey`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `publicKey` | `Buffer` |

#### Returns

`string`

#### Inherited from

[BitcoinBaseWalletProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md).[getAddressFromPublicKey](liquality_bitcoin.BitcoinBaseWalletProvider.md#getaddressfrompublickey)

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

#### Implementation of

IBitcoinWallet.getAddresses

#### Inherited from

[BitcoinBaseWalletProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md).[getAddresses](liquality_bitcoin.BitcoinBaseWalletProvider.md#getaddresses)

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:86](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L86)

___

### getBalance

▸ **getBalance**(`_assets`): `Promise`<`BigNumber`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_assets` | `Asset`[] |

#### Returns

`Promise`<`BigNumber`[]\>

#### Implementation of

IBitcoinWallet.getBalance

#### Overrides

[BitcoinBaseWalletProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md).[getBalance](liquality_bitcoin.BitcoinBaseWalletProvider.md#getbalance)

#### Defined in

[bitcoin/lib/wallet/BitcoinHDWallet.ts:40](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinHDWallet.ts#L40)

___

### getChainProvider

▸ **getChainProvider**(): `default`<`any`\>

#### Returns

`default`<`any`\>

#### Implementation of

IBitcoinWallet.getChainProvider

#### Inherited from

[BitcoinBaseWalletProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md).[getChainProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md#getchainprovider)

#### Defined in

client/dist/lib/Wallet.d.ts:7

___

### getConnectedNetwork

▸ **getConnectedNetwork**(): `Promise`<[`BitcoinNetwork`](../interfaces/liquality_bitcoin.BitcoinTypes.BitcoinNetwork.md)\>

#### Returns

`Promise`<[`BitcoinNetwork`](../interfaces/liquality_bitcoin.BitcoinTypes.BitcoinNetwork.md)\>

#### Implementation of

IBitcoinWallet.getConnectedNetwork

#### Overrides

[BitcoinBaseWalletProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md).[getConnectedNetwork](liquality_bitcoin.BitcoinBaseWalletProvider.md#getconnectednetwork)

#### Defined in

[bitcoin/lib/wallet/BitcoinHDWallet.ts:56](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinHDWallet.ts#L56)

___

### getDerivationCache

▸ **getDerivationCache**(): `DerivationCache`

#### Returns

`DerivationCache`

#### Inherited from

[BitcoinBaseWalletProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md).[getDerivationCache](liquality_bitcoin.BitcoinBaseWalletProvider.md#getderivationcache)

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

#### Inherited from

[BitcoinBaseWalletProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md).[getDerivationPathAddress](liquality_bitcoin.BitcoinBaseWalletProvider.md#getderivationpathaddress)

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

#### Inherited from

[BitcoinBaseWalletProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md).[getInputsForAmount](liquality_bitcoin.BitcoinBaseWalletProvider.md#getinputsforamount)

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

#### Inherited from

[BitcoinBaseWalletProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md).[getPaymentVariantFromPublicKey](liquality_bitcoin.BitcoinBaseWalletProvider.md#getpaymentvariantfrompublickey)

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:468](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L468)

___

### getSigner

▸ **getSigner**(): `Promise`<``null``\>

#### Returns

`Promise`<``null``\>

#### Implementation of

IBitcoinWallet.getSigner

#### Overrides

[BitcoinBaseWalletProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md).[getSigner](liquality_bitcoin.BitcoinBaseWalletProvider.md#getsigner)

#### Defined in

[bitcoin/lib/wallet/BitcoinHDWallet.ts:31](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinHDWallet.ts#L31)

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

#### Inherited from

[BitcoinBaseWalletProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md).[getTotalFee](liquality_bitcoin.BitcoinBaseWalletProvider.md#gettotalfee)

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

#### Inherited from

[BitcoinBaseWalletProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md).[getTotalFees](liquality_bitcoin.BitcoinBaseWalletProvider.md#gettotalfees)

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

#### Implementation of

IBitcoinWallet.getUnusedAddress

#### Inherited from

[BitcoinBaseWalletProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md).[getUnusedAddress](liquality_bitcoin.BitcoinBaseWalletProvider.md#getunusedaddress)

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

#### Implementation of

IBitcoinWallet.getUsedAddresses

#### Inherited from

[BitcoinBaseWalletProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md).[getUsedAddresses](liquality_bitcoin.BitcoinBaseWalletProvider.md#getusedaddresses)

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

#### Implementation of

IBitcoinWallet.getWalletAddress

#### Inherited from

[BitcoinBaseWalletProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md).[getWalletAddress](liquality_bitcoin.BitcoinBaseWalletProvider.md#getwalletaddress)

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:178](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L178)

___

### isWalletAvailable

▸ **isWalletAvailable**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Implementation of

IBitcoinWallet.isWalletAvailable

#### Overrides

[BitcoinBaseWalletProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md).[isWalletAvailable](liquality_bitcoin.BitcoinBaseWalletProvider.md#iswalletavailable)

#### Defined in

[bitcoin/lib/wallet/BitcoinHDWallet.ts:60](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinHDWallet.ts#L60)

___

### keyPair

▸ `Private` **keyPair**(`derivationPath`): `Promise`<`ECPairInterface`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `derivationPath` | `string` |

#### Returns

`Promise`<`ECPairInterface`\>

#### Defined in

[bitcoin/lib/wallet/BitcoinHDWallet.ts:202](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinHDWallet.ts#L202)

___

### seedNode

▸ `Private` **seedNode**(): `Promise`<`BIP32Interface`\>

#### Returns

`Promise`<`BIP32Interface`\>

#### Defined in

[bitcoin/lib/wallet/BitcoinHDWallet.ts:212](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinHDWallet.ts#L212)

___

### sendBatchTransaction

▸ **sendBatchTransaction**(`transactions`): `Promise`<`Transaction`<[`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactions` | `TransactionRequest`[] |

#### Returns

`Promise`<`Transaction`<[`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)\>[]\>

#### Implementation of

IBitcoinWallet.sendBatchTransaction

#### Inherited from

[BitcoinBaseWalletProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md).[sendBatchTransaction](liquality_bitcoin.BitcoinBaseWalletProvider.md#sendbatchtransaction)

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

#### Inherited from

[BitcoinBaseWalletProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md).[sendOptionsToOutputs](liquality_bitcoin.BitcoinBaseWalletProvider.md#sendoptionstooutputs)

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

#### Implementation of

IBitcoinWallet.sendSweepTransaction

#### Inherited from

[BitcoinBaseWalletProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md).[sendSweepTransaction](liquality_bitcoin.BitcoinBaseWalletProvider.md#sendsweeptransaction)

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

#### Implementation of

IBitcoinWallet.sendTransaction

#### Inherited from

[BitcoinBaseWalletProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md).[sendTransaction](liquality_bitcoin.BitcoinBaseWalletProvider.md#sendtransaction)

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:107](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L107)

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

[BitcoinBaseWalletProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md).[setChainProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md#setchainprovider)

#### Defined in

client/dist/lib/Wallet.d.ts:6

___

### signBatchP2SHTransaction

▸ **signBatchP2SHTransaction**(`inputs`, `addresses`, `tx`, `lockTime?`, `segwit?`): `Promise`<`Buffer`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputs` | [{ `index`: `number` ; `inputTxHex`: `string` ; `outputScript`: `Buffer` ; `txInputIndex?`: `number` ; `vout`: `any`  }] |
| `addresses` | `string` |
| `tx` | `any` |
| `lockTime?` | `number` |
| `segwit?` | `boolean` |

#### Returns

`Promise`<`Buffer`[]\>

#### Overrides

[BitcoinBaseWalletProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md).[signBatchP2SHTransaction](liquality_bitcoin.BitcoinBaseWalletProvider.md#signbatchp2shtransaction)

#### Defined in

[bitcoin/lib/wallet/BitcoinHDWallet.ts:171](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinHDWallet.ts#L171)

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

[BitcoinBaseWalletProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md).[signMessage](liquality_bitcoin.BitcoinBaseWalletProvider.md#signmessage)

#### Defined in

[bitcoin/lib/wallet/BitcoinHDWallet.ts:45](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinHDWallet.ts#L45)

___

### signPSBT

▸ **signPSBT**(`data`, `inputs`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `string` |
| `inputs` | [`PsbtInputTarget`](../interfaces/liquality_bitcoin.BitcoinTypes.PsbtInputTarget.md)[] |

#### Returns

`Promise`<`string`\>

#### Implementation of

IBitcoinWallet.signPSBT

#### Overrides

[BitcoinBaseWalletProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md).[signPSBT](liquality_bitcoin.BitcoinBaseWalletProvider.md#signpsbt)

#### Defined in

[bitcoin/lib/wallet/BitcoinHDWallet.ts:162](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinHDWallet.ts#L162)

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

#### Implementation of

IBitcoinWallet.updateTransactionFee

#### Inherited from

[BitcoinBaseWalletProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md).[updateTransactionFee](liquality_bitcoin.BitcoinBaseWalletProvider.md#updatetransactionfee)

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

#### Inherited from

[BitcoinBaseWalletProvider](liquality_bitcoin.BitcoinBaseWalletProvider.md).[withCachedUtxos](liquality_bitcoin.BitcoinBaseWalletProvider.md#withcachedutxos)

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:280](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L280)
