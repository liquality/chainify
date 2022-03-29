# Class: BitcoinHDWalletProvider

[@liquality/bitcoin](../wiki/@liquality.bitcoin).BitcoinHDWalletProvider

## Hierarchy

- [`BitcoinBaseWalletProvider`](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider)

  ↳ **`BitcoinHDWalletProvider`**

## Implements

- `IBitcoinWallet`<[`BitcoinBaseChainProvider`](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider)\>

## Table of contents

### Constructors

- [constructor](../wiki/@liquality.bitcoin.BitcoinHDWalletProvider#constructor)

### Properties

- [\_addressType](../wiki/@liquality.bitcoin.BitcoinHDWalletProvider#_addresstype)
- [\_baseDerivationPath](../wiki/@liquality.bitcoin.BitcoinHDWalletProvider#_basederivationpath)
- [\_derivationCache](../wiki/@liquality.bitcoin.BitcoinHDWalletProvider#_derivationcache)
- [\_network](../wiki/@liquality.bitcoin.BitcoinHDWalletProvider#_network)
- [chainProvider](../wiki/@liquality.bitcoin.BitcoinHDWalletProvider#chainprovider)

### Methods

- [\_getUsedUnusedAddresses](../wiki/@liquality.bitcoin.BitcoinHDWalletProvider#_getusedunusedaddresses)
- [\_sendTransaction](../wiki/@liquality.bitcoin.BitcoinHDWalletProvider#_sendtransaction)
- [baseDerivationNode](../wiki/@liquality.bitcoin.BitcoinHDWalletProvider#basederivationnode)
- [buildSweepTransaction](../wiki/@liquality.bitcoin.BitcoinHDWalletProvider#buildsweeptransaction)
- [buildTransaction](../wiki/@liquality.bitcoin.BitcoinHDWalletProvider#buildtransaction)
- [canUpdateFee](../wiki/@liquality.bitcoin.BitcoinHDWalletProvider#canupdatefee)
- [exportPrivateKey](../wiki/@liquality.bitcoin.BitcoinHDWalletProvider#exportprivatekey)
- [findAddress](../wiki/@liquality.bitcoin.BitcoinHDWalletProvider#findaddress)
- [getAddress](../wiki/@liquality.bitcoin.BitcoinHDWalletProvider#getaddress)
- [getAddressFromPublicKey](../wiki/@liquality.bitcoin.BitcoinHDWalletProvider#getaddressfrompublickey)
- [getAddresses](../wiki/@liquality.bitcoin.BitcoinHDWalletProvider#getaddresses)
- [getBalance](../wiki/@liquality.bitcoin.BitcoinHDWalletProvider#getbalance)
- [getChainProvider](../wiki/@liquality.bitcoin.BitcoinHDWalletProvider#getchainprovider)
- [getConnectedNetwork](../wiki/@liquality.bitcoin.BitcoinHDWalletProvider#getconnectednetwork)
- [getDerivationCache](../wiki/@liquality.bitcoin.BitcoinHDWalletProvider#getderivationcache)
- [getDerivationPathAddress](../wiki/@liquality.bitcoin.BitcoinHDWalletProvider#getderivationpathaddress)
- [getInputsForAmount](../wiki/@liquality.bitcoin.BitcoinHDWalletProvider#getinputsforamount)
- [getPaymentVariantFromPublicKey](../wiki/@liquality.bitcoin.BitcoinHDWalletProvider#getpaymentvariantfrompublickey)
- [getSigner](../wiki/@liquality.bitcoin.BitcoinHDWalletProvider#getsigner)
- [getTotalFee](../wiki/@liquality.bitcoin.BitcoinHDWalletProvider#gettotalfee)
- [getTotalFees](../wiki/@liquality.bitcoin.BitcoinHDWalletProvider#gettotalfees)
- [getUnusedAddress](../wiki/@liquality.bitcoin.BitcoinHDWalletProvider#getunusedaddress)
- [getUsedAddresses](../wiki/@liquality.bitcoin.BitcoinHDWalletProvider#getusedaddresses)
- [getWalletAddress](../wiki/@liquality.bitcoin.BitcoinHDWalletProvider#getwalletaddress)
- [isWalletAvailable](../wiki/@liquality.bitcoin.BitcoinHDWalletProvider#iswalletavailable)
- [sendBatchTransaction](../wiki/@liquality.bitcoin.BitcoinHDWalletProvider#sendbatchtransaction)
- [sendOptionsToOutputs](../wiki/@liquality.bitcoin.BitcoinHDWalletProvider#sendoptionstooutputs)
- [sendSweepTransaction](../wiki/@liquality.bitcoin.BitcoinHDWalletProvider#sendsweeptransaction)
- [sendTransaction](../wiki/@liquality.bitcoin.BitcoinHDWalletProvider#sendtransaction)
- [setChainProvider](../wiki/@liquality.bitcoin.BitcoinHDWalletProvider#setchainprovider)
- [signBatchP2SHTransaction](../wiki/@liquality.bitcoin.BitcoinHDWalletProvider#signbatchp2shtransaction)
- [signMessage](../wiki/@liquality.bitcoin.BitcoinHDWalletProvider#signmessage)
- [signPSBT](../wiki/@liquality.bitcoin.BitcoinHDWalletProvider#signpsbt)
- [updateTransactionFee](../wiki/@liquality.bitcoin.BitcoinHDWalletProvider#updatetransactionfee)
- [withCachedUtxos](../wiki/@liquality.bitcoin.BitcoinHDWalletProvider#withcachedutxos)

## Constructors

### constructor

• **new BitcoinHDWalletProvider**(`options`, `chainProvider`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`BitcoinHDWalletProviderOptions`](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinHDWalletProviderOptions) |
| `chainProvider` | `default`<[`BitcoinBaseChainProvider`](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider)\> |

#### Overrides

[BitcoinBaseWalletProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider).[constructor](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#constructor)

#### Defined in

[bitcoin/lib/wallet/BitcoinHDWallet.ts:17](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinHDWallet.ts#L17)

## Properties

### \_addressType

• `Protected` **\_addressType**: [`AddressType`](../wiki/@liquality.bitcoin.BitcoinTypes.AddressType)

#### Inherited from

[BitcoinBaseWalletProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider).[_addressType](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#_addresstype)

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:36](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L36)

___

### \_baseDerivationPath

• `Protected` **\_baseDerivationPath**: `string`

#### Inherited from

[BitcoinBaseWalletProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider).[_baseDerivationPath](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#_basederivationpath)

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:34](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L34)

___

### \_derivationCache

• `Protected` **\_derivationCache**: `DerivationCache`

#### Inherited from

[BitcoinBaseWalletProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider).[_derivationCache](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#_derivationcache)

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:37](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L37)

___

### \_network

• `Protected` **\_network**: [`BitcoinNetwork`](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinNetwork)

#### Inherited from

[BitcoinBaseWalletProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider).[_network](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#_network)

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:35](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L35)

___

### chainProvider

• `Protected` **chainProvider**: `default`<`any`\>

#### Implementation of

IBitcoinWallet.chainProvider

#### Inherited from

[BitcoinBaseWalletProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider).[chainProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#chainprovider)

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

[BitcoinBaseWalletProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider).[_getUsedUnusedAddresses](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#_getusedunusedaddresses)

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:211](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L211)

___

### \_sendTransaction

▸ `Protected` **_sendTransaction**(`transactions`, `feePerByte?`): `Promise`<`Transaction`<[`Transaction`](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactions` | [`OutputTarget`](../wiki/@liquality.bitcoin.BitcoinTypes.OutputTarget)[] |
| `feePerByte?` | `number` |

#### Returns

`Promise`<`Transaction`<[`Transaction`](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction)\>\>

#### Inherited from

[BitcoinBaseWalletProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider).[_sendTransaction](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#_sendtransaction)

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:157](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L157)

___

### baseDerivationNode

▸ `Protected` **baseDerivationNode**(): `Promise`<`BIP32Interface`\>

#### Returns

`Promise`<`BIP32Interface`\>

#### Overrides

[BitcoinBaseWalletProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider).[baseDerivationNode](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#basederivationnode)

#### Defined in

[bitcoin/lib/wallet/BitcoinHDWallet.ts:64](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinHDWallet.ts#L64)

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

[BitcoinBaseWalletProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider).[buildSweepTransaction](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#buildsweeptransaction)

#### Defined in

[bitcoin/lib/wallet/BitcoinHDWallet.ts:144](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinHDWallet.ts#L144)

___

### buildTransaction

▸ `Protected` **buildTransaction**(`targets`, `feePerByte?`, `fixedInputs?`): `Promise`<{ `fee`: `number` ; `hex`: `string`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `targets` | [`OutputTarget`](../wiki/@liquality.bitcoin.BitcoinTypes.OutputTarget)[] |
| `feePerByte?` | `number` |
| `fixedInputs?` | [`Input`](../wiki/@liquality.bitcoin.BitcoinTypes.Input)[] |

#### Returns

`Promise`<{ `fee`: `number` ; `hex`: `string`  }\>

#### Overrides

[BitcoinBaseWalletProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider).[buildTransaction](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#buildtransaction)

#### Defined in

[bitcoin/lib/wallet/BitcoinHDWallet.ts:73](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinHDWallet.ts#L73)

___

### canUpdateFee

▸ **canUpdateFee**(): `boolean`

#### Returns

`boolean`

#### Implementation of

IBitcoinWallet.canUpdateFee

#### Overrides

[BitcoinBaseWalletProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider).[canUpdateFee](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#canupdatefee)

#### Defined in

[bitcoin/lib/wallet/BitcoinHDWallet.ts:27](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinHDWallet.ts#L27)

___

### exportPrivateKey

▸ **exportPrivateKey**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Implementation of

IBitcoinWallet.exportPrivateKey

#### Overrides

[BitcoinBaseWalletProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider).[exportPrivateKey](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#exportprivatekey)

#### Defined in

[bitcoin/lib/wallet/BitcoinHDWallet.ts:52](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinHDWallet.ts#L52)

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

[BitcoinBaseWalletProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider).[findAddress](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#findaddress)

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:163](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L163)

___

### getAddress

▸ **getAddress**(): `Promise`<`AddressType`\>

#### Returns

`Promise`<`AddressType`\>

#### Implementation of

IBitcoinWallet.getAddress

#### Overrides

[BitcoinBaseWalletProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider).[getAddress](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#getaddress)

#### Defined in

[bitcoin/lib/wallet/BitcoinHDWallet.ts:35](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinHDWallet.ts#L35)

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

[BitcoinBaseWalletProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider).[getAddressFromPublicKey](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#getaddressfrompublickey)

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:464](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L464)

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

[BitcoinBaseWalletProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider).[getAddresses](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#getaddresses)

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:86](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L86)

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

[BitcoinBaseWalletProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider).[getBalance](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#getbalance)

#### Defined in

[bitcoin/lib/wallet/BitcoinHDWallet.ts:40](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinHDWallet.ts#L40)

___

### getChainProvider

▸ **getChainProvider**(): `default`<`any`\>

#### Returns

`default`<`any`\>

#### Implementation of

IBitcoinWallet.getChainProvider

#### Inherited from

[BitcoinBaseWalletProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider).[getChainProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#getchainprovider)

#### Defined in

client/dist/lib/Wallet.d.ts:7

___

### getConnectedNetwork

▸ **getConnectedNetwork**(): `Promise`<[`BitcoinNetwork`](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinNetwork)\>

#### Returns

`Promise`<[`BitcoinNetwork`](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinNetwork)\>

#### Implementation of

IBitcoinWallet.getConnectedNetwork

#### Overrides

[BitcoinBaseWalletProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider).[getConnectedNetwork](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#getconnectednetwork)

#### Defined in

[bitcoin/lib/wallet/BitcoinHDWallet.ts:56](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinHDWallet.ts#L56)

___

### getDerivationCache

▸ **getDerivationCache**(): `DerivationCache`

#### Returns

`DerivationCache`

#### Inherited from

[BitcoinBaseWalletProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider).[getDerivationCache](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#getderivationcache)

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:70](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L70)

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

[BitcoinBaseWalletProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider).[getDerivationPathAddress](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#getderivationpathaddress)

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:192](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L192)

___

### getInputsForAmount

▸ `Protected` **getInputsForAmount**(`_targets`, `feePerByte?`, `fixedInputs?`, `numAddressPerCall?`, `sweep?`): `Promise`<{ `change`: [`CoinSelectTarget`](../wiki/@liquality.bitcoin.BitcoinUtils#coinselecttarget) ; `fee`: `number` ; `inputs`: [`UTXO`](../wiki/@liquality.bitcoin.BitcoinTypes.UTXO)[] ; `outputs`: [`CoinSelectTarget`](../wiki/@liquality.bitcoin.BitcoinUtils#coinselecttarget)[]  }\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `_targets` | [`OutputTarget`](../wiki/@liquality.bitcoin.BitcoinTypes.OutputTarget)[] | `undefined` |
| `feePerByte?` | `number` | `undefined` |
| `fixedInputs` | [`Input`](../wiki/@liquality.bitcoin.BitcoinTypes.Input)[] | `[]` |
| `numAddressPerCall` | `number` | `100` |
| `sweep` | `boolean` | `false` |

#### Returns

`Promise`<{ `change`: [`CoinSelectTarget`](../wiki/@liquality.bitcoin.BitcoinUtils#coinselecttarget) ; `fee`: `number` ; `inputs`: [`UTXO`](../wiki/@liquality.bitcoin.BitcoinTypes.UTXO)[] ; `outputs`: [`CoinSelectTarget`](../wiki/@liquality.bitcoin.BitcoinUtils#coinselecttarget)[]  }\>

#### Inherited from

[BitcoinBaseWalletProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider).[getInputsForAmount](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#getinputsforamount)

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:317](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L317)

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

[BitcoinBaseWalletProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider).[getPaymentVariantFromPublicKey](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#getpaymentvariantfrompublickey)

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:468](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L468)

___

### getSigner

▸ **getSigner**(): `Promise`<``null``\>

#### Returns

`Promise`<``null``\>

#### Implementation of

IBitcoinWallet.getSigner

#### Overrides

[BitcoinBaseWalletProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider).[getSigner](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#getsigner)

#### Defined in

[bitcoin/lib/wallet/BitcoinHDWallet.ts:31](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinHDWallet.ts#L31)

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

[BitcoinBaseWalletProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider).[getTotalFee](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#gettotalfee)

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:300](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L300)

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

[BitcoinBaseWalletProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider).[getTotalFees](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#gettotalfees)

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:145](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L145)

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

[BitcoinBaseWalletProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider).[getUnusedAddress](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#getunusedaddress)

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:74](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L74)

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

[BitcoinBaseWalletProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider).[getUsedAddresses](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#getusedaddresses)

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:80](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L80)

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

[BitcoinBaseWalletProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider).[getWalletAddress](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#getwalletaddress)

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:178](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L178)

___

### isWalletAvailable

▸ **isWalletAvailable**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Implementation of

IBitcoinWallet.isWalletAvailable

#### Overrides

[BitcoinBaseWalletProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider).[isWalletAvailable](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#iswalletavailable)

#### Defined in

[bitcoin/lib/wallet/BitcoinHDWallet.ts:60](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinHDWallet.ts#L60)

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

#### Inherited from

[BitcoinBaseWalletProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider).[sendBatchTransaction](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#sendbatchtransaction)

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:111](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L111)

___

### sendOptionsToOutputs

▸ `Protected` **sendOptionsToOutputs**(`transactions`): [`OutputTarget`](../wiki/@liquality.bitcoin.BitcoinTypes.OutputTarget)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactions` | `TransactionRequest`[] |

#### Returns

[`OutputTarget`](../wiki/@liquality.bitcoin.BitcoinTypes.OutputTarget)[]

#### Inherited from

[BitcoinBaseWalletProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider).[sendOptionsToOutputs](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#sendoptionstooutputs)

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:441](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L441)

___

### sendSweepTransaction

▸ **sendSweepTransaction**(`externalChangeAddress`, `_asset`, `feePerByte`): `Promise`<`Transaction`<[`Transaction`](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `externalChangeAddress` | `AddressType` |
| `_asset` | `Asset` |
| `feePerByte` | `number` |

#### Returns

`Promise`<`Transaction`<[`Transaction`](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction)\>\>

#### Implementation of

IBitcoinWallet.sendSweepTransaction

#### Inherited from

[BitcoinBaseWalletProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider).[sendSweepTransaction](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#sendsweeptransaction)

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:115](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L115)

___

### sendTransaction

▸ **sendTransaction**(`options`): `Promise`<`Transaction`<[`Transaction`](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `TransactionRequest` |

#### Returns

`Promise`<`Transaction`<[`Transaction`](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction)\>\>

#### Implementation of

IBitcoinWallet.sendTransaction

#### Inherited from

[BitcoinBaseWalletProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider).[sendTransaction](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#sendtransaction)

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:107](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L107)

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

[BitcoinBaseWalletProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider).[setChainProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#setchainprovider)

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

[BitcoinBaseWalletProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider).[signBatchP2SHTransaction](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#signbatchp2shtransaction)

#### Defined in

[bitcoin/lib/wallet/BitcoinHDWallet.ts:171](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinHDWallet.ts#L171)

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

[BitcoinBaseWalletProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider).[signMessage](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#signmessage)

#### Defined in

[bitcoin/lib/wallet/BitcoinHDWallet.ts:45](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinHDWallet.ts#L45)

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

#### Overrides

[BitcoinBaseWalletProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider).[signPSBT](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#signpsbt)

#### Defined in

[bitcoin/lib/wallet/BitcoinHDWallet.ts:162](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinHDWallet.ts#L162)

___

### updateTransactionFee

▸ **updateTransactionFee**(`tx`, `newFeePerByte`): `Promise`<`Transaction`<[`Transaction`](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | `string` \| `Transaction`<[`Transaction`](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction)\> |
| `newFeePerByte` | `number` |

#### Returns

`Promise`<`Transaction`<[`Transaction`](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction)\>\>

#### Implementation of

IBitcoinWallet.updateTransactionFee

#### Inherited from

[BitcoinBaseWalletProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider).[updateTransactionFee](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#updatetransactionfee)

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:121](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L121)

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

[BitcoinBaseWalletProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider).[withCachedUtxos](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#withcachedutxos)

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:280](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L280)
