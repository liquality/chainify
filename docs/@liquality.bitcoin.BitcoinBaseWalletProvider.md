# Class: BitcoinBaseWalletProvider<T, S\>

[@liquality/bitcoin](../wiki/@liquality.bitcoin).BitcoinBaseWalletProvider

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`BitcoinBaseChainProvider`](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider) = `any` |
| `S` | `any` |

## Hierarchy

- `default`<`T`, `S`\>

  ↳ **`BitcoinBaseWalletProvider`**

  ↳↳ [`BitcoinHDWalletProvider`](../wiki/@liquality.bitcoin.BitcoinHDWalletProvider)

## Table of contents

### Constructors

- [constructor](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#constructor)

### Properties

- [\_addressType](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#_addresstype)
- [\_baseDerivationPath](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#_basederivationpath)
- [\_derivationCache](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#_derivationcache)
- [\_network](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#_network)
- [chainProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#chainprovider)

### Methods

- [\_getUsedUnusedAddresses](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#_getusedunusedaddresses)
- [\_sendTransaction](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#_sendtransaction)
- [baseDerivationNode](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#basederivationnode)
- [buildSweepTransaction](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#buildsweeptransaction)
- [buildTransaction](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#buildtransaction)
- [canUpdateFee](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#canupdatefee)
- [exportPrivateKey](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#exportprivatekey)
- [findAddress](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#findaddress)
- [getAddress](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#getaddress)
- [getAddressFromPublicKey](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#getaddressfrompublickey)
- [getAddresses](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#getaddresses)
- [getBalance](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#getbalance)
- [getChainProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#getchainprovider)
- [getConnectedNetwork](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#getconnectednetwork)
- [getDerivationCache](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#getderivationcache)
- [getDerivationPathAddress](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#getderivationpathaddress)
- [getInputsForAmount](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#getinputsforamount)
- [getPaymentVariantFromPublicKey](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#getpaymentvariantfrompublickey)
- [getSigner](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#getsigner)
- [getTotalFee](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#gettotalfee)
- [getTotalFees](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#gettotalfees)
- [getUnusedAddress](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#getunusedaddress)
- [getUsedAddresses](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#getusedaddresses)
- [getWalletAddress](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#getwalletaddress)
- [isWalletAvailable](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#iswalletavailable)
- [sendBatchTransaction](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#sendbatchtransaction)
- [sendOptionsToOutputs](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#sendoptionstooutputs)
- [sendSweepTransaction](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#sendsweeptransaction)
- [sendTransaction](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#sendtransaction)
- [setChainProvider](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#setchainprovider)
- [signBatchP2SHTransaction](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#signbatchp2shtransaction)
- [signMessage](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#signmessage)
- [signPSBT](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#signpsbt)
- [updateTransactionFee](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#updatetransactionfee)
- [withCachedUtxos](../wiki/@liquality.bitcoin.BitcoinBaseWalletProvider#withcachedutxos)

## Constructors

### constructor

• **new BitcoinBaseWalletProvider**<`T`, `S`\>(`options`, `chainProvider`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`BitcoinBaseChainProvider`](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider)<`T`\> = `any` |
| `S` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`BitcoinWalletProviderOptions`](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinWalletProviderOptions) |
| `chainProvider` | `default`<`T`\> |

#### Overrides

Wallet&lt;T, S\&gt;.constructor

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:39](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L39)

## Properties

### \_addressType

• `Protected` **\_addressType**: [`AddressType`](../wiki/@liquality.bitcoin.BitcoinTypes.AddressType)

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:36](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L36)

___

### \_baseDerivationPath

• `Protected` **\_baseDerivationPath**: `string`

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:34](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L34)

___

### \_derivationCache

• `Protected` **\_derivationCache**: `DerivationCache`

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:37](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L37)

___

### \_network

• `Protected` **\_network**: [`BitcoinNetwork`](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinNetwork)

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:35](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L35)

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

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:157](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L157)

___

### baseDerivationNode

▸ `Protected` `Abstract` **baseDerivationNode**(): `Promise`<`BIP32Interface`\>

#### Returns

`Promise`<`BIP32Interface`\>

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:54](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L54)

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

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:60](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L60)

___

### buildTransaction

▸ `Protected` `Abstract` **buildTransaction**(`targets`, `feePerByte?`, `fixedInputs?`): `Promise`<{ `fee`: `number` ; `hex`: `string`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `targets` | [`OutputTarget`](../wiki/@liquality.bitcoin.BitcoinTypes.OutputTarget)[] |
| `feePerByte?` | `number` |
| `fixedInputs?` | [`Input`](../wiki/@liquality.bitcoin.BitcoinTypes.Input)[] |

#### Returns

`Promise`<{ `fee`: `number` ; `hex`: `string`  }\>

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:55](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L55)

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

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:163](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L163)

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

#### Overrides

Wallet.getAddresses

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:86](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L86)

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

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:468](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L468)

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

#### Overrides

Wallet.getUnusedAddress

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

#### Overrides

Wallet.getUsedAddresses

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

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:178](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L178)

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

▸ **sendBatchTransaction**(`transactions`): `Promise`<`Transaction`<[`Transaction`](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction)\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactions` | `TransactionRequest`[] |

#### Returns

`Promise`<`Transaction`<[`Transaction`](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction)\>[]\>

#### Overrides

Wallet.sendBatchTransaction

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

#### Overrides

Wallet.sendSweepTransaction

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

#### Overrides

Wallet.sendTransaction

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:107](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L107)

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
| `inputs` | [`P2SHInput`](../wiki/@liquality.bitcoin.BitcoinTypes.P2SHInput)[] |
| `addresses` | `string` |
| `tx` | `any` |
| `lockTime?` | `number` |
| `segwit?` | `boolean` |

#### Returns

`Promise`<`Buffer`[]\>

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:62](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L62)

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
| `inputs` | [`PsbtInputTarget`](../wiki/@liquality.bitcoin.BitcoinTypes.PsbtInputTarget)[] |

#### Returns

`Promise`<`string`\>

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:61](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L61)

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

#### Overrides

Wallet.updateTransactionFee

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

#### Defined in

[bitcoin/lib/wallet/BitcoinBaseWallet.ts:280](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/wallet/BitcoinBaseWallet.ts#L280)
