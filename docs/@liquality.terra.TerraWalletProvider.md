# Class: TerraWalletProvider

[@liquality/terra](../wiki/@liquality.terra).TerraWalletProvider

## Hierarchy

- `default`<`LCDClient`, `MnemonicKey`\>

  ↳ **`TerraWalletProvider`**

## Table of contents

### Constructors

- [constructor](../wiki/@liquality.terra.TerraWalletProvider#constructor)

### Properties

- [chainProvider](../wiki/@liquality.terra.TerraWalletProvider#chainprovider)
- [signer](../wiki/@liquality.terra.TerraWalletProvider#signer)

### Methods

- [canUpdateFee](../wiki/@liquality.terra.TerraWalletProvider#canupdatefee)
- [exportPrivateKey](../wiki/@liquality.terra.TerraWalletProvider#exportprivatekey)
- [getAddress](../wiki/@liquality.terra.TerraWalletProvider#getaddress)
- [getAddresses](../wiki/@liquality.terra.TerraWalletProvider#getaddresses)
- [getBalance](../wiki/@liquality.terra.TerraWalletProvider#getbalance)
- [getChainProvider](../wiki/@liquality.terra.TerraWalletProvider#getchainprovider)
- [getConnectedNetwork](../wiki/@liquality.terra.TerraWalletProvider#getconnectednetwork)
- [getSigner](../wiki/@liquality.terra.TerraWalletProvider#getsigner)
- [getUnusedAddress](../wiki/@liquality.terra.TerraWalletProvider#getunusedaddress)
- [getUsedAddresses](../wiki/@liquality.terra.TerraWalletProvider#getusedaddresses)
- [isWalletAvailable](../wiki/@liquality.terra.TerraWalletProvider#iswalletavailable)
- [sendBatchTransaction](../wiki/@liquality.terra.TerraWalletProvider#sendbatchtransaction)
- [sendSweepTransaction](../wiki/@liquality.terra.TerraWalletProvider#sendsweeptransaction)
- [sendTransaction](../wiki/@liquality.terra.TerraWalletProvider#sendtransaction)
- [setChainProvider](../wiki/@liquality.terra.TerraWalletProvider#setchainprovider)
- [signMessage](../wiki/@liquality.terra.TerraWalletProvider#signmessage)
- [updateTransactionFee](../wiki/@liquality.terra.TerraWalletProvider#updatetransactionfee)

## Constructors

### constructor

• **new TerraWalletProvider**(`chainProvider`, `options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainProvider` | [`TerraChainProvider`](../wiki/@liquality.terra.TerraChainProvider) |
| `options` | [`TerraWalletProviderOptions`](../wiki/@liquality.terra.TerraTypes.TerraWalletProviderOptions) |

#### Overrides

Wallet&lt;LCDClient, MnemonicKey\&gt;.constructor

#### Defined in

[terra/lib/wallet/TerraWalletProvider.ts:32](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/terra/lib/wallet/TerraWalletProvider.ts#L32)

## Properties

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

[terra/lib/wallet/TerraWalletProvider.ts:24](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/terra/lib/wallet/TerraWalletProvider.ts#L24)

## Methods

### canUpdateFee

▸ **canUpdateFee**(): `boolean`

#### Returns

`boolean`

#### Overrides

Wallet.canUpdateFee

#### Defined in

[terra/lib/wallet/TerraWalletProvider.ts:131](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/terra/lib/wallet/TerraWalletProvider.ts#L131)

___

### exportPrivateKey

▸ **exportPrivateKey**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Overrides

Wallet.exportPrivateKey

#### Defined in

[terra/lib/wallet/TerraWalletProvider.ts:45](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/terra/lib/wallet/TerraWalletProvider.ts#L45)

___

### getAddress

▸ **getAddress**(): `Promise`<`AddressType`\>

#### Returns

`Promise`<`AddressType`\>

#### Overrides

Wallet.getAddress

#### Defined in

[terra/lib/wallet/TerraWalletProvider.ts:54](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/terra/lib/wallet/TerraWalletProvider.ts#L54)

___

### getAddresses

▸ **getAddresses**(): `Promise`<`Address`[]\>

#### Returns

`Promise`<`Address`[]\>

#### Overrides

Wallet.getAddresses

#### Defined in

[terra/lib/wallet/TerraWalletProvider.ts:58](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/terra/lib/wallet/TerraWalletProvider.ts#L58)

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

[terra/lib/wallet/TerraWalletProvider.ts:126](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/terra/lib/wallet/TerraWalletProvider.ts#L126)

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

▸ **getConnectedNetwork**(): `Promise`<[`TerraNetwork`](../wiki/@liquality.terra.TerraTypes.TerraNetwork)\>

#### Returns

`Promise`<[`TerraNetwork`](../wiki/@liquality.terra.TerraTypes.TerraNetwork)\>

#### Overrides

Wallet.getConnectedNetwork

#### Defined in

[terra/lib/wallet/TerraWalletProvider.ts:89](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/terra/lib/wallet/TerraWalletProvider.ts#L89)

___

### getSigner

▸ **getSigner**(): `MnemonicKey`

#### Returns

`MnemonicKey`

#### Overrides

Wallet.getSigner

#### Defined in

[terra/lib/wallet/TerraWalletProvider.ts:113](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/terra/lib/wallet/TerraWalletProvider.ts#L113)

___

### getUnusedAddress

▸ **getUnusedAddress**(): `Promise`<`Address`\>

#### Returns

`Promise`<`Address`\>

#### Overrides

Wallet.getUnusedAddress

#### Defined in

[terra/lib/wallet/TerraWalletProvider.ts:79](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/terra/lib/wallet/TerraWalletProvider.ts#L79)

___

### getUsedAddresses

▸ **getUsedAddresses**(): `Promise`<`Address`[]\>

#### Returns

`Promise`<`Address`[]\>

#### Overrides

Wallet.getUsedAddresses

#### Defined in

[terra/lib/wallet/TerraWalletProvider.ts:75](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/terra/lib/wallet/TerraWalletProvider.ts#L75)

___

### isWalletAvailable

▸ **isWalletAvailable**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Overrides

Wallet.isWalletAvailable

#### Defined in

[terra/lib/wallet/TerraWalletProvider.ts:49](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/terra/lib/wallet/TerraWalletProvider.ts#L49)

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

[terra/lib/wallet/TerraWalletProvider.ts:118](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/terra/lib/wallet/TerraWalletProvider.ts#L118)

___

### sendSweepTransaction

▸ **sendSweepTransaction**(`address`, `asset`): `Promise`<`Transaction`<[`TerraTxInfo`](../wiki/@liquality.terra.TerraTypes.TerraTxInfo)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` \| `Address` |
| `asset` | `Asset` |

#### Returns

`Promise`<`Transaction`<[`TerraTxInfo`](../wiki/@liquality.terra.TerraTypes.TerraTxInfo)\>\>

#### Overrides

Wallet.sendSweepTransaction

#### Defined in

[terra/lib/wallet/TerraWalletProvider.ts:107](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/terra/lib/wallet/TerraWalletProvider.ts#L107)

___

### sendTransaction

▸ **sendTransaction**(`txRequest`): `Promise`<`Transaction`<[`TerraTxInfo`](../wiki/@liquality.terra.TerraTypes.TerraTxInfo)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `txRequest` | [`TerraTxRequest`](../wiki/@liquality.terra.TerraTypes.TerraTxRequest) |

#### Returns

`Promise`<`Transaction`<[`TerraTxInfo`](../wiki/@liquality.terra.TerraTypes.TerraTxInfo)\>\>

#### Overrides

Wallet.sendTransaction

#### Defined in

[terra/lib/wallet/TerraWalletProvider.ts:93](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/terra/lib/wallet/TerraWalletProvider.ts#L93)

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

[terra/lib/wallet/TerraWalletProvider.ts:84](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/terra/lib/wallet/TerraWalletProvider.ts#L84)

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

[terra/lib/wallet/TerraWalletProvider.ts:122](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/terra/lib/wallet/TerraWalletProvider.ts#L122)
