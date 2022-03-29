[](../README.md) / [Exports](../modules.md) / [@liquality/bitcoin-ledger](../modules/liquality_bitcoin_ledger.md) / BitcoinLedgerProvider

# Class: BitcoinLedgerProvider

[@liquality/bitcoin-ledger](../modules/liquality_bitcoin_ledger.md).BitcoinLedgerProvider

## Hierarchy

- `BitcoinBaseWalletProvider`

  ↳ **`BitcoinLedgerProvider`**

## Table of contents

### Constructors

- [constructor](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#constructor)

### Properties

- [\_addressType](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#_addresstype)
- [\_baseDerivationNode](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#_basederivationnode)
- [\_baseDerivationPath](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#_basederivationpath)
- [\_derivationCache](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#_derivationcache)
- [\_ledgerProvider](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#_ledgerprovider)
- [\_network](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#_network)
- [\_walletPublicKeyCache](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#_walletpublickeycache)
- [chainProvider](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#chainprovider)

### Methods

- [\_getUsedUnusedAddresses](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#_getusedunusedaddresses)
- [\_getWalletPublicKey](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#_getwalletpublickey)
- [\_sendTransaction](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#_sendtransaction)
- [baseDerivationNode](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#basederivationnode)
- [buildSweepTransaction](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#buildsweeptransaction)
- [buildTransaction](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#buildtransaction)
- [canUpdateFee](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#canupdatefee)
- [exportPrivateKey](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#exportprivatekey)
- [findAddress](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#findaddress)
- [getAddress](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#getaddress)
- [getAddressFromPublicKey](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#getaddressfrompublickey)
- [getAddresses](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#getaddresses)
- [getAmountBuffer](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#getamountbuffer)
- [getBalance](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#getbalance)
- [getChainProvider](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#getchainprovider)
- [getConnectedNetwork](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#getconnectednetwork)
- [getDerivationCache](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#getderivationcache)
- [getDerivationPathAddress](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#getderivationpathaddress)
- [getInputsForAmount](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#getinputsforamount)
- [getLedgerInputs](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#getledgerinputs)
- [getPaymentVariantFromPublicKey](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#getpaymentvariantfrompublickey)
- [getSigner](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#getsigner)
- [getTotalFee](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#gettotalfee)
- [getTotalFees](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#gettotalfees)
- [getUnusedAddress](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#getunusedaddress)
- [getUsedAddresses](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#getusedaddresses)
- [getWalletAddress](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#getwalletaddress)
- [getWalletPublicKey](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#getwalletpublickey)
- [isWalletAvailable](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#iswalletavailable)
- [sendBatchTransaction](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#sendbatchtransaction)
- [sendOptionsToOutputs](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#sendoptionstooutputs)
- [sendSweepTransaction](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#sendsweeptransaction)
- [sendTransaction](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#sendtransaction)
- [setChainProvider](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#setchainprovider)
- [signBatchP2SHTransaction](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#signbatchp2shtransaction)
- [signMessage](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#signmessage)
- [signPSBT](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#signpsbt)
- [updateTransactionFee](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#updatetransactionfee)
- [withCachedUtxos](liquality_bitcoin_ledger.BitcoinLedgerProvider.md#withcachedutxos)

## Constructors

### constructor

• **new BitcoinLedgerProvider**(`options`, `chainProvider`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`BitcoinLedgerProviderOptions`](../interfaces/liquality_bitcoin_ledger.BitcoinLedgerProviderTypes.BitcoinLedgerProviderOptions.md) |
| `chainProvider` | `default`<`BitcoinBaseChainProvider`\> |

#### Overrides

BitcoinBaseWalletProvider.constructor

#### Defined in

[bitcoin-ledger/lib/BitcoinLedgerProvider.ts:17](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin-ledger/lib/BitcoinLedgerProvider.ts#L17)

## Properties

### \_addressType

• `Protected` **\_addressType**: `AddressType`

#### Inherited from

BitcoinBaseWalletProvider.\_addressType

#### Defined in

bitcoin/dist/lib/wallet/BitcoinBaseWallet.d.ts:20

___

### \_baseDerivationNode

• `Private` **\_baseDerivationNode**: `BIP32Interface`

#### Defined in

[bitcoin-ledger/lib/BitcoinLedgerProvider.ts:15](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin-ledger/lib/BitcoinLedgerProvider.ts#L15)

___

### \_baseDerivationPath

• `Protected` **\_baseDerivationPath**: `string`

#### Inherited from

BitcoinBaseWalletProvider.\_baseDerivationPath

#### Defined in

bitcoin/dist/lib/wallet/BitcoinBaseWallet.d.ts:18

___

### \_derivationCache

• `Protected` **\_derivationCache**: `DerivationCache`

#### Inherited from

BitcoinBaseWalletProvider.\_derivationCache

#### Defined in

bitcoin/dist/lib/wallet/BitcoinBaseWallet.d.ts:21

___

### \_ledgerProvider

• `Private` **\_ledgerProvider**: `LedgerProvider`<`default`\>

#### Defined in

[bitcoin-ledger/lib/BitcoinLedgerProvider.ts:13](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin-ledger/lib/BitcoinLedgerProvider.ts#L13)

___

### \_network

• `Protected` **\_network**: `BitcoinNetwork`

#### Inherited from

BitcoinBaseWalletProvider.\_network

#### Defined in

bitcoin/dist/lib/wallet/BitcoinBaseWallet.d.ts:19

___

### \_walletPublicKeyCache

• `Private` **\_walletPublicKeyCache**: `Record`<`string`, `any`\>

#### Defined in

[bitcoin-ledger/lib/BitcoinLedgerProvider.ts:14](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin-ledger/lib/BitcoinLedgerProvider.ts#L14)

___

### chainProvider

• `Protected` **chainProvider**: `default`<`any`\>

#### Inherited from

BitcoinBaseWalletProvider.chainProvider

#### Defined in

client/dist/lib/Wallet.d.ts:4

## Methods

### \_getUsedUnusedAddresses

▸ `Protected` **_getUsedUnusedAddresses**(`numAddressPerCall`, `addressType`): `Promise`<{ `unusedAddress`: { `change`: `Address` ; `external`: `Address`  } ; `usedAddresses`: `Address`[]  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `numAddressPerCall` | `number` |
| `addressType` | `AddressSearchType` |

#### Returns

`Promise`<{ `unusedAddress`: { `change`: `Address` ; `external`: `Address`  } ; `usedAddresses`: `Address`[]  }\>

#### Inherited from

BitcoinBaseWalletProvider.\_getUsedUnusedAddresses

#### Defined in

bitcoin/dist/lib/wallet/BitcoinBaseWallet.d.ts:47

___

### \_getWalletPublicKey

▸ `Private` **_getWalletPublicKey**(`path`): `Promise`<{}\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

`Promise`<{}\>

#### Defined in

[bitcoin-ledger/lib/BitcoinLedgerProvider.ts:333](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin-ledger/lib/BitcoinLedgerProvider.ts#L333)

___

### \_sendTransaction

▸ `Protected` **_sendTransaction**(`transactions`, `feePerByte?`): `Promise`<`Transaction`<`Transaction`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactions` | `OutputTarget`[] |
| `feePerByte?` | `number` |

#### Returns

`Promise`<`Transaction`<`Transaction`\>\>

#### Inherited from

BitcoinBaseWalletProvider.\_sendTransaction

#### Defined in

bitcoin/dist/lib/wallet/BitcoinBaseWallet.d.ts:43

___

### baseDerivationNode

▸ `Protected` **baseDerivationNode**(): `Promise`<`BIP32Interface`\>

#### Returns

`Promise`<`BIP32Interface`\>

#### Overrides

BitcoinBaseWalletProvider.baseDerivationNode

#### Defined in

[bitcoin-ledger/lib/BitcoinLedgerProvider.ts:241](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin-ledger/lib/BitcoinLedgerProvider.ts#L241)

___

### buildSweepTransaction

▸ `Protected` **buildSweepTransaction**(`_externalChangeAddress`, `_feePerByte?`): `Promise`<{ `fee`: `number` ; `hex`: `string`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_externalChangeAddress` | `string` |
| `_feePerByte?` | `number` |

#### Returns

`Promise`<{ `fee`: `number` ; `hex`: `string`  }\>

#### Overrides

BitcoinBaseWalletProvider.buildSweepTransaction

#### Defined in

[bitcoin-ledger/lib/BitcoinLedgerProvider.ts:237](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin-ledger/lib/BitcoinLedgerProvider.ts#L237)

___

### buildTransaction

▸ `Protected` **buildTransaction**(`targets`, `feePerByte?`, `fixedInputs?`): `Promise`<{ `fee`: `number` ; `hex`: `string`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `targets` | `OutputTarget`[] |
| `feePerByte?` | `number` |
| `fixedInputs?` | `Input`[] |

#### Returns

`Promise`<{ `fee`: `number` ; `hex`: `string`  }\>

#### Overrides

BitcoinBaseWalletProvider.buildTransaction

#### Defined in

[bitcoin-ledger/lib/BitcoinLedgerProvider.ts:255](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin-ledger/lib/BitcoinLedgerProvider.ts#L255)

___

### canUpdateFee

▸ **canUpdateFee**(): `boolean`

#### Returns

`boolean`

#### Overrides

BitcoinBaseWalletProvider.canUpdateFee

#### Defined in

[bitcoin-ledger/lib/BitcoinLedgerProvider.ts:58](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin-ledger/lib/BitcoinLedgerProvider.ts#L58)

___

### exportPrivateKey

▸ **exportPrivateKey**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Overrides

BitcoinBaseWalletProvider.exportPrivateKey

#### Defined in

[bitcoin-ledger/lib/BitcoinLedgerProvider.ts:50](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin-ledger/lib/BitcoinLedgerProvider.ts#L50)

___

### findAddress

▸ `Protected` **findAddress**(`addresses`, `change?`): `Promise`<`Address`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `addresses` | `string`[] |
| `change?` | `boolean` |

#### Returns

`Promise`<`Address`\>

#### Inherited from

BitcoinBaseWalletProvider.findAddress

#### Defined in

bitcoin/dist/lib/wallet/BitcoinBaseWallet.d.ts:44

___

### getAddress

▸ **getAddress**(): `Promise`<`AddressType`\>

#### Returns

`Promise`<`AddressType`\>

#### Overrides

BitcoinBaseWalletProvider.getAddress

#### Defined in

[bitcoin-ledger/lib/BitcoinLedgerProvider.ts:40](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin-ledger/lib/BitcoinLedgerProvider.ts#L40)

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

BitcoinBaseWalletProvider.getAddressFromPublicKey

#### Defined in

bitcoin/dist/lib/wallet/BitcoinBaseWallet.d.ts:63

___

### getAddresses

▸ **getAddresses**(`startingIndex?`, `numAddresses?`, `change?`): `Promise`<`Address`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `startingIndex?` | `number` |
| `numAddresses?` | `number` |
| `change?` | `boolean` |

#### Returns

`Promise`<`Address`[]\>

#### Inherited from

BitcoinBaseWalletProvider.getAddresses

#### Defined in

bitcoin/dist/lib/wallet/BitcoinBaseWallet.d.ts:37

___

### getAmountBuffer

▸ `Private` **getAmountBuffer**(`amount`): `Buffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `amount` | `number` |

#### Returns

`Buffer`

#### Defined in

[bitcoin-ledger/lib/BitcoinLedgerProvider.ts:304](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin-ledger/lib/BitcoinLedgerProvider.ts#L304)

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

BitcoinBaseWalletProvider.getBalance

#### Defined in

[bitcoin-ledger/lib/BitcoinLedgerProvider.ts:45](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin-ledger/lib/BitcoinLedgerProvider.ts#L45)

___

### getChainProvider

▸ **getChainProvider**(): `default`<`any`\>

#### Returns

`default`<`any`\>

#### Inherited from

BitcoinBaseWalletProvider.getChainProvider

#### Defined in

client/dist/lib/Wallet.d.ts:7

___

### getConnectedNetwork

▸ **getConnectedNetwork**(): `Promise`<`Network`\>

#### Returns

`Promise`<`Network`\>

#### Overrides

BitcoinBaseWalletProvider.getConnectedNetwork

#### Defined in

[bitcoin-ledger/lib/BitcoinLedgerProvider.ts:32](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin-ledger/lib/BitcoinLedgerProvider.ts#L32)

___

### getDerivationCache

▸ **getDerivationCache**(): `DerivationCache`

#### Returns

`DerivationCache`

#### Inherited from

BitcoinBaseWalletProvider.getDerivationCache

#### Defined in

bitcoin/dist/lib/wallet/BitcoinBaseWallet.d.ts:34

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

BitcoinBaseWalletProvider.getDerivationPathAddress

#### Defined in

bitcoin/dist/lib/wallet/BitcoinBaseWallet.d.ts:46

___

### getInputsForAmount

▸ `Protected` **getInputsForAmount**(`_targets`, `feePerByte?`, `fixedInputs?`, `numAddressPerCall?`, `sweep?`): `Promise`<{ `change`: `CoinSelectTarget` ; `fee`: `number` ; `inputs`: `UTXO`[] ; `outputs`: `CoinSelectTarget`[]  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_targets` | `OutputTarget`[] |
| `feePerByte?` | `number` |
| `fixedInputs?` | `Input`[] |
| `numAddressPerCall?` | `number` |
| `sweep?` | `boolean` |

#### Returns

`Promise`<{ `change`: `CoinSelectTarget` ; `fee`: `number` ; `inputs`: `UTXO`[] ; `outputs`: `CoinSelectTarget`[]  }\>

#### Inherited from

BitcoinBaseWalletProvider.getInputsForAmount

#### Defined in

bitcoin/dist/lib/wallet/BitcoinBaseWallet.d.ts:56

___

### getLedgerInputs

▸ `Private` **getLedgerInputs**(`unspentOutputs`): `Promise`<(`number` \| `Transaction`)[][]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `unspentOutputs` | { `txid`: `string` ; `vout`: `number`  }[] |

#### Returns

`Promise`<(`number` \| `Transaction`)[][]\>

#### Defined in

[bitcoin-ledger/lib/BitcoinLedgerProvider.ts:311](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin-ledger/lib/BitcoinLedgerProvider.ts#L311)

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

BitcoinBaseWalletProvider.getPaymentVariantFromPublicKey

#### Defined in

bitcoin/dist/lib/wallet/BitcoinBaseWallet.d.ts:64

___

### getSigner

▸ **getSigner**(): `Promise`<``null``\>

#### Returns

`Promise`<``null``\>

#### Overrides

BitcoinBaseWalletProvider.getSigner

#### Defined in

[bitcoin-ledger/lib/BitcoinLedgerProvider.ts:36](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin-ledger/lib/BitcoinLedgerProvider.ts#L36)

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

BitcoinBaseWalletProvider.getTotalFee

#### Defined in

bitcoin/dist/lib/wallet/BitcoinBaseWallet.d.ts:55

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

BitcoinBaseWalletProvider.getTotalFees

#### Defined in

bitcoin/dist/lib/wallet/BitcoinBaseWallet.d.ts:42

___

### getUnusedAddress

▸ **getUnusedAddress**(`change?`, `numAddressPerCall?`): `Promise`<`Address`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `change?` | `boolean` |
| `numAddressPerCall?` | `number` |

#### Returns

`Promise`<`Address`\>

#### Inherited from

BitcoinBaseWalletProvider.getUnusedAddress

#### Defined in

bitcoin/dist/lib/wallet/BitcoinBaseWallet.d.ts:35

___

### getUsedAddresses

▸ **getUsedAddresses**(`numAddressPerCall?`): `Promise`<`Address`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `numAddressPerCall?` | `number` |

#### Returns

`Promise`<`Address`[]\>

#### Inherited from

BitcoinBaseWalletProvider.getUsedAddresses

#### Defined in

bitcoin/dist/lib/wallet/BitcoinBaseWallet.d.ts:36

___

### getWalletAddress

▸ **getWalletAddress**(`address`): `Promise`<`Address`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`Promise`<`Address`\>

#### Inherited from

BitcoinBaseWalletProvider.getWalletAddress

#### Defined in

bitcoin/dist/lib/wallet/BitcoinBaseWallet.d.ts:45

___

### getWalletPublicKey

▸ `Private` **getWalletPublicKey**(`path`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

`Promise`<`any`\>

#### Defined in

[bitcoin-ledger/lib/BitcoinLedgerProvider.ts:323](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin-ledger/lib/BitcoinLedgerProvider.ts#L323)

___

### isWalletAvailable

▸ **isWalletAvailable**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Overrides

BitcoinBaseWalletProvider.isWalletAvailable

#### Defined in

[bitcoin-ledger/lib/BitcoinLedgerProvider.ts:54](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin-ledger/lib/BitcoinLedgerProvider.ts#L54)

___

### sendBatchTransaction

▸ **sendBatchTransaction**(`transactions`): `Promise`<`Transaction`<`Transaction`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactions` | `TransactionRequest`[] |

#### Returns

`Promise`<`Transaction`<`Transaction`\>[]\>

#### Inherited from

BitcoinBaseWalletProvider.sendBatchTransaction

#### Defined in

bitcoin/dist/lib/wallet/BitcoinBaseWallet.d.ts:39

___

### sendOptionsToOutputs

▸ `Protected` **sendOptionsToOutputs**(`transactions`): `OutputTarget`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactions` | `TransactionRequest`[] |

#### Returns

`OutputTarget`[]

#### Inherited from

BitcoinBaseWalletProvider.sendOptionsToOutputs

#### Defined in

bitcoin/dist/lib/wallet/BitcoinBaseWallet.d.ts:62

___

### sendSweepTransaction

▸ **sendSweepTransaction**(`externalChangeAddress`, `_asset`, `feePerByte`): `Promise`<`Transaction`<`Transaction`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `externalChangeAddress` | `AddressType` |
| `_asset` | `Asset` |
| `feePerByte` | `number` |

#### Returns

`Promise`<`Transaction`<`Transaction`\>\>

#### Inherited from

BitcoinBaseWalletProvider.sendSweepTransaction

#### Defined in

bitcoin/dist/lib/wallet/BitcoinBaseWallet.d.ts:40

___

### sendTransaction

▸ **sendTransaction**(`options`): `Promise`<`Transaction`<`Transaction`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `TransactionRequest` |

#### Returns

`Promise`<`Transaction`<`Transaction`\>\>

#### Inherited from

BitcoinBaseWalletProvider.sendTransaction

#### Defined in

bitcoin/dist/lib/wallet/BitcoinBaseWallet.d.ts:38

___

### setChainProvider

▸ **setChainProvider**(`chainProvider`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainProvider` | `default`<`any`\> |

#### Returns

`void`

#### Inherited from

BitcoinBaseWalletProvider.setChainProvider

#### Defined in

client/dist/lib/Wallet.d.ts:6

___

### signBatchP2SHTransaction

▸ **signBatchP2SHTransaction**(`inputs`, `addresses`, `tx`, `lockTime?`, `segwit?`): `Promise`<`Buffer`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputs` | [{ `index`: `number` ; `inputTxHex`: `string` ; `outputScript`: `Buffer` ; `vout`: `any`  }] |
| `addresses` | `string` |
| `tx` | `any` |
| `lockTime?` | `number` |
| `segwit?` | `boolean` |

#### Returns

`Promise`<`Buffer`[]\>

#### Overrides

BitcoinBaseWalletProvider.signBatchP2SHTransaction

#### Defined in

[bitcoin-ledger/lib/BitcoinLedgerProvider.ts:187](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin-ledger/lib/BitcoinLedgerProvider.ts#L187)

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

#### Overrides

BitcoinBaseWalletProvider.signMessage

#### Defined in

[bitcoin-ledger/lib/BitcoinLedgerProvider.ts:24](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin-ledger/lib/BitcoinLedgerProvider.ts#L24)

___

### signPSBT

▸ **signPSBT**(`data`, `inputs`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `string` |
| `inputs` | `PsbtInputTarget`[] |

#### Returns

`Promise`<`string`\>

#### Overrides

BitcoinBaseWalletProvider.signPSBT

#### Defined in

[bitcoin-ledger/lib/BitcoinLedgerProvider.ts:62](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin-ledger/lib/BitcoinLedgerProvider.ts#L62)

___

### updateTransactionFee

▸ **updateTransactionFee**(`tx`, `newFeePerByte`): `Promise`<`Transaction`<`Transaction`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | `string` \| `Transaction`<`Transaction`\> |
| `newFeePerByte` | `number` |

#### Returns

`Promise`<`Transaction`<`Transaction`\>\>

#### Inherited from

BitcoinBaseWalletProvider.updateTransactionFee

#### Defined in

bitcoin/dist/lib/wallet/BitcoinBaseWallet.d.ts:41

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

BitcoinBaseWalletProvider.withCachedUtxos

#### Defined in

bitcoin/dist/lib/wallet/BitcoinBaseWallet.d.ts:54
