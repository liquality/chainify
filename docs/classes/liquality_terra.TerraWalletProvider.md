[](../README.md) / [Exports](../modules.md) / [@liquality/terra](../modules/liquality_terra.md) / TerraWalletProvider

# Class: TerraWalletProvider

[@liquality/terra](../modules/liquality_terra.md).TerraWalletProvider

## Hierarchy

- `default`<`LCDClient`, `MnemonicKey`\>

  ↳ **`TerraWalletProvider`**

## Table of contents

### Constructors

- [constructor](liquality_terra.TerraWalletProvider.md#constructor)

### Properties

- [\_addressCache](liquality_terra.TerraWalletProvider.md#_addresscache)
- [\_baseDerivationPath](liquality_terra.TerraWalletProvider.md#_basederivationpath)
- [\_gasAdjustment](liquality_terra.TerraWalletProvider.md#_gasadjustment)
- [\_mnemonic](liquality_terra.TerraWalletProvider.md#_mnemonic)
- [\_wallet](liquality_terra.TerraWalletProvider.md#_wallet)
- [chainProvider](liquality_terra.TerraWalletProvider.md#chainprovider)
- [signer](liquality_terra.TerraWalletProvider.md#signer)

### Methods

- [broadcastTx](liquality_terra.TerraWalletProvider.md#broadcasttx)
- [buildTransaction](liquality_terra.TerraWalletProvider.md#buildtransaction)
- [canUpdateFee](liquality_terra.TerraWalletProvider.md#canupdatefee)
- [createSendMessage](liquality_terra.TerraWalletProvider.md#createsendmessage)
- [exportPrivateKey](liquality_terra.TerraWalletProvider.md#exportprivatekey)
- [getAddress](liquality_terra.TerraWalletProvider.md#getaddress)
- [getAddresses](liquality_terra.TerraWalletProvider.md#getaddresses)
- [getBalance](liquality_terra.TerraWalletProvider.md#getbalance)
- [getChainProvider](liquality_terra.TerraWalletProvider.md#getchainprovider)
- [getConnectedNetwork](liquality_terra.TerraWalletProvider.md#getconnectednetwork)
- [getSigner](liquality_terra.TerraWalletProvider.md#getsigner)
- [getUnusedAddress](liquality_terra.TerraWalletProvider.md#getunusedaddress)
- [getUsedAddresses](liquality_terra.TerraWalletProvider.md#getusedaddresses)
- [isWalletAvailable](liquality_terra.TerraWalletProvider.md#iswalletavailable)
- [sendBatchTransaction](liquality_terra.TerraWalletProvider.md#sendbatchtransaction)
- [sendSweepTransaction](liquality_terra.TerraWalletProvider.md#sendsweeptransaction)
- [sendTransaction](liquality_terra.TerraWalletProvider.md#sendtransaction)
- [setChainProvider](liquality_terra.TerraWalletProvider.md#setchainprovider)
- [signMessage](liquality_terra.TerraWalletProvider.md#signmessage)
- [updateTransactionFee](liquality_terra.TerraWalletProvider.md#updatetransactionfee)

## Constructors

### constructor

• **new TerraWalletProvider**(`chainProvider`, `options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainProvider` | [`TerraChainProvider`](liquality_terra.TerraChainProvider.md) |
| `options` | [`TerraWalletProviderOptions`](../interfaces/liquality_terra.TerraTypes.TerraWalletProviderOptions.md) |

#### Overrides

Wallet&lt;LCDClient, MnemonicKey\&gt;.constructor

#### Defined in

[terra/lib/wallet/TerraWalletProvider.ts:32](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/wallet/TerraWalletProvider.ts#L32)

## Properties

### \_addressCache

• `Private` **\_addressCache**: `Object`

#### Index signature

▪ [key: `string`]: `Address`

#### Defined in

[terra/lib/wallet/TerraWalletProvider.ts:28](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/wallet/TerraWalletProvider.ts#L28)

___

### \_baseDerivationPath

• `Private` **\_baseDerivationPath**: `string`

#### Defined in

[terra/lib/wallet/TerraWalletProvider.ts:26](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/wallet/TerraWalletProvider.ts#L26)

___

### \_gasAdjustment

• `Private` **\_gasAdjustment**: `number`

#### Defined in

[terra/lib/wallet/TerraWalletProvider.ts:30](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/wallet/TerraWalletProvider.ts#L30)

___

### \_mnemonic

• `Private` **\_mnemonic**: `string`

#### Defined in

[terra/lib/wallet/TerraWalletProvider.ts:27](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/wallet/TerraWalletProvider.ts#L27)

___

### \_wallet

• `Private` **\_wallet**: `Wallet`

#### Defined in

[terra/lib/wallet/TerraWalletProvider.ts:29](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/wallet/TerraWalletProvider.ts#L29)

___

### chainProvider

• `Protected` **chainProvider**: `default`<`LCDClient`\>

#### Inherited from

Wallet.chainProvider

#### Defined in

client/dist/lib/Wallet.d.ts:4

___

### signer

• `Protected` **signer**: `MnemonicKey`

#### Defined in

[terra/lib/wallet/TerraWalletProvider.ts:24](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/wallet/TerraWalletProvider.ts#L24)

## Methods

### broadcastTx

▸ `Private` **broadcastTx**(`tx`): `Promise`<`Transaction`<[`TerraTxInfo`](../interfaces/liquality_terra.TerraTypes.TerraTxInfo.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | `Tx` |

#### Returns

`Promise`<`Transaction`<[`TerraTxInfo`](../interfaces/liquality_terra.TerraTypes.TerraTxInfo.md)\>\>

#### Defined in

[terra/lib/wallet/TerraWalletProvider.ts:160](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/wallet/TerraWalletProvider.ts#L160)

___

### buildTransaction

▸ `Private` **buildTransaction**(`txRequest`): `Promise`<`CreateTxOptions`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `txRequest` | [`TerraTxRequest`](../interfaces/liquality_terra.TerraTypes.TerraTxRequest.md) |

#### Returns

`Promise`<`CreateTxOptions`\>

#### Defined in

[terra/lib/wallet/TerraWalletProvider.ts:181](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/wallet/TerraWalletProvider.ts#L181)

___

### canUpdateFee

▸ **canUpdateFee**(): `boolean`

#### Returns

`boolean`

#### Overrides

Wallet.canUpdateFee

#### Defined in

[terra/lib/wallet/TerraWalletProvider.ts:131](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/wallet/TerraWalletProvider.ts#L131)

___

### createSendMessage

▸ `Private` **createSendMessage**(`txRequest`): `Msg`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `txRequest` | `TransactionRequest` |

#### Returns

`Msg`[]

#### Defined in

[terra/lib/wallet/TerraWalletProvider.ts:135](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/wallet/TerraWalletProvider.ts#L135)

___

### exportPrivateKey

▸ **exportPrivateKey**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Overrides

Wallet.exportPrivateKey

#### Defined in

[terra/lib/wallet/TerraWalletProvider.ts:45](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/wallet/TerraWalletProvider.ts#L45)

___

### getAddress

▸ **getAddress**(): `Promise`<`AddressType`\>

#### Returns

`Promise`<`AddressType`\>

#### Overrides

Wallet.getAddress

#### Defined in

[terra/lib/wallet/TerraWalletProvider.ts:54](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/wallet/TerraWalletProvider.ts#L54)

___

### getAddresses

▸ **getAddresses**(): `Promise`<`Address`[]\>

#### Returns

`Promise`<`Address`[]\>

#### Overrides

Wallet.getAddresses

#### Defined in

[terra/lib/wallet/TerraWalletProvider.ts:58](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/wallet/TerraWalletProvider.ts#L58)

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

[terra/lib/wallet/TerraWalletProvider.ts:126](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/wallet/TerraWalletProvider.ts#L126)

___

### getChainProvider

▸ **getChainProvider**(): `default`<`LCDClient`\>

#### Returns

`default`<`LCDClient`\>

#### Inherited from

Wallet.getChainProvider

#### Defined in

client/dist/lib/Wallet.d.ts:7

___

### getConnectedNetwork

▸ **getConnectedNetwork**(): `Promise`<[`TerraNetwork`](../interfaces/liquality_terra.TerraTypes.TerraNetwork.md)\>

#### Returns

`Promise`<[`TerraNetwork`](../interfaces/liquality_terra.TerraTypes.TerraNetwork.md)\>

#### Overrides

Wallet.getConnectedNetwork

#### Defined in

[terra/lib/wallet/TerraWalletProvider.ts:89](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/wallet/TerraWalletProvider.ts#L89)

___

### getSigner

▸ **getSigner**(): `MnemonicKey`

#### Returns

`MnemonicKey`

#### Overrides

Wallet.getSigner

#### Defined in

[terra/lib/wallet/TerraWalletProvider.ts:113](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/wallet/TerraWalletProvider.ts#L113)

___

### getUnusedAddress

▸ **getUnusedAddress**(): `Promise`<`Address`\>

#### Returns

`Promise`<`Address`\>

#### Overrides

Wallet.getUnusedAddress

#### Defined in

[terra/lib/wallet/TerraWalletProvider.ts:79](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/wallet/TerraWalletProvider.ts#L79)

___

### getUsedAddresses

▸ **getUsedAddresses**(): `Promise`<`Address`[]\>

#### Returns

`Promise`<`Address`[]\>

#### Overrides

Wallet.getUsedAddresses

#### Defined in

[terra/lib/wallet/TerraWalletProvider.ts:75](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/wallet/TerraWalletProvider.ts#L75)

___

### isWalletAvailable

▸ **isWalletAvailable**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Overrides

Wallet.isWalletAvailable

#### Defined in

[terra/lib/wallet/TerraWalletProvider.ts:49](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/wallet/TerraWalletProvider.ts#L49)

___

### sendBatchTransaction

▸ **sendBatchTransaction**(`_txRequests`): `Promise`<`Transaction`<`any`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_txRequests` | `TransactionRequest`[] |

#### Returns

`Promise`<`Transaction`<`any`\>[]\>

#### Overrides

Wallet.sendBatchTransaction

#### Defined in

[terra/lib/wallet/TerraWalletProvider.ts:118](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/wallet/TerraWalletProvider.ts#L118)

___

### sendSweepTransaction

▸ **sendSweepTransaction**(`address`, `asset`): `Promise`<`Transaction`<[`TerraTxInfo`](../interfaces/liquality_terra.TerraTypes.TerraTxInfo.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` \| `Address` |
| `asset` | `Asset` |

#### Returns

`Promise`<`Transaction`<[`TerraTxInfo`](../interfaces/liquality_terra.TerraTypes.TerraTxInfo.md)\>\>

#### Overrides

Wallet.sendSweepTransaction

#### Defined in

[terra/lib/wallet/TerraWalletProvider.ts:107](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/wallet/TerraWalletProvider.ts#L107)

___

### sendTransaction

▸ **sendTransaction**(`txRequest`): `Promise`<`Transaction`<[`TerraTxInfo`](../interfaces/liquality_terra.TerraTypes.TerraTxInfo.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `txRequest` | [`TerraTxRequest`](../interfaces/liquality_terra.TerraTypes.TerraTxRequest.md) |

#### Returns

`Promise`<`Transaction`<[`TerraTxInfo`](../interfaces/liquality_terra.TerraTypes.TerraTxInfo.md)\>\>

#### Overrides

Wallet.sendTransaction

#### Defined in

[terra/lib/wallet/TerraWalletProvider.ts:93](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/wallet/TerraWalletProvider.ts#L93)

___

### setChainProvider

▸ **setChainProvider**(`chainProvider`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainProvider` | `default`<`LCDClient`\> |

#### Returns

`void`

#### Inherited from

Wallet.setChainProvider

#### Defined in

client/dist/lib/Wallet.d.ts:6

___

### signMessage

▸ **signMessage**(`message`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |

#### Returns

`Promise`<`string`\>

#### Overrides

Wallet.signMessage

#### Defined in

[terra/lib/wallet/TerraWalletProvider.ts:84](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/wallet/TerraWalletProvider.ts#L84)

___

### updateTransactionFee

▸ **updateTransactionFee**(`_tx`, `_newFee`): `Promise`<`Transaction`<`any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_tx` | `string` \| `Transaction`<`any`\> |
| `_newFee` | `FeeType` |

#### Returns

`Promise`<`Transaction`<`any`\>\>

#### Overrides

Wallet.updateTransactionFee

#### Defined in

[terra/lib/wallet/TerraWalletProvider.ts:122](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/wallet/TerraWalletProvider.ts#L122)
