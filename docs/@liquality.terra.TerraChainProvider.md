# Class: TerraChainProvider

[@liquality/terra](../wiki/@liquality.terra).TerraChainProvider

## Hierarchy

- `default`<`LCDClient`\>

  ↳ **`TerraChainProvider`**

## Table of contents

### Constructors

- [constructor](../wiki/@liquality.terra.TerraChainProvider#constructor)

### Properties

- [feeProvider](../wiki/@liquality.terra.TerraChainProvider#feeprovider)
- [network](../wiki/@liquality.terra.TerraChainProvider#network)
- [provider](../wiki/@liquality.terra.TerraChainProvider#provider)

### Methods

- [getBalance](../wiki/@liquality.terra.TerraChainProvider#getbalance)
- [getBlockByHash](../wiki/@liquality.terra.TerraChainProvider#getblockbyhash)
- [getBlockByNumber](../wiki/@liquality.terra.TerraChainProvider#getblockbynumber)
- [getBlockHeight](../wiki/@liquality.terra.TerraChainProvider#getblockheight)
- [getFeeProvider](../wiki/@liquality.terra.TerraChainProvider#getfeeprovider)
- [getFees](../wiki/@liquality.terra.TerraChainProvider#getfees)
- [getNetwork](../wiki/@liquality.terra.TerraChainProvider#getnetwork)
- [getProvider](../wiki/@liquality.terra.TerraChainProvider#getprovider)
- [getTransactionByHash](../wiki/@liquality.terra.TerraChainProvider#gettransactionbyhash)
- [sendRawTransaction](../wiki/@liquality.terra.TerraChainProvider#sendrawtransaction)
- [sendRpcRequest](../wiki/@liquality.terra.TerraChainProvider#sendrpcrequest)
- [setFeeProvider](../wiki/@liquality.terra.TerraChainProvider#setfeeprovider)
- [setNetwork](../wiki/@liquality.terra.TerraChainProvider#setnetwork)
- [setProvider](../wiki/@liquality.terra.TerraChainProvider#setprovider)

## Constructors

### constructor

• **new TerraChainProvider**(`network`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `network` | [`TerraNetwork`](../wiki/@liquality.terra.TerraTypes.TerraNetwork) |

#### Overrides

Chain&lt;LCDClient\&gt;.constructor

#### Defined in

[terra/lib/chain/TerraChainProvider.ts:10](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/terra/lib/chain/TerraChainProvider.ts#L10)

## Properties

### feeProvider

• `Protected` **feeProvider**: `default`

#### Inherited from

Chain.feeProvider

#### Defined in

client/dist/lib/Chain.d.ts:4

___

### network

• `Protected` **network**: `Network`

#### Inherited from

Chain.network

#### Defined in

client/dist/lib/Chain.d.ts:5

___

### provider

• `Protected` **provider**: `LCDClient`

#### Inherited from

Chain.provider

#### Defined in

client/dist/lib/Chain.d.ts:6

## Methods

### getBalance

▸ **getBalance**(`addresses`, `assets`): `Promise`<`BigNumber`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `addresses` | `AddressType`[] |
| `assets` | `Asset`[] |

#### Returns

`Promise`<`BigNumber`[]\>

#### Overrides

Chain.getBalance

#### Defined in

[terra/lib/chain/TerraChainProvider.ts:44](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/terra/lib/chain/TerraChainProvider.ts#L44)

___

### getBlockByHash

▸ **getBlockByHash**(`_blockHash`, `_includeTx?`): `Promise`<`Block`<`BlockInfo`, [`TerraTxInfo`](../wiki/@liquality.terra.TerraTypes.TerraTxInfo)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_blockHash` | `string` |
| `_includeTx?` | `boolean` |

#### Returns

`Promise`<`Block`<`BlockInfo`, [`TerraTxInfo`](../wiki/@liquality.terra.TerraTypes.TerraTxInfo)\>\>

#### Overrides

Chain.getBlockByHash

#### Defined in

[terra/lib/chain/TerraChainProvider.ts:83](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/terra/lib/chain/TerraChainProvider.ts#L83)

___

### getBlockByNumber

▸ **getBlockByNumber**(`blockNumber?`, `includeTx?`): `Promise`<`Block`<`BlockInfo`, [`TerraTxInfo`](../wiki/@liquality.terra.TerraTypes.TerraTxInfo)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockNumber?` | `number` |
| `includeTx?` | `boolean` |

#### Returns

`Promise`<`Block`<`BlockInfo`, [`TerraTxInfo`](../wiki/@liquality.terra.TerraTypes.TerraTxInfo)\>\>

#### Overrides

Chain.getBlockByNumber

#### Defined in

[terra/lib/chain/TerraChainProvider.ts:15](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/terra/lib/chain/TerraChainProvider.ts#L15)

___

### getBlockHeight

▸ **getBlockHeight**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Overrides

Chain.getBlockHeight

#### Defined in

[terra/lib/chain/TerraChainProvider.ts:28](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/terra/lib/chain/TerraChainProvider.ts#L28)

___

### getFeeProvider

▸ **getFeeProvider**(): `Promise`<`default`\>

#### Returns

`Promise`<`default`\>

#### Inherited from

Chain.getFeeProvider

#### Defined in

client/dist/lib/Chain.d.ts:13

___

### getFees

▸ **getFees**(): `Promise`<`FeeDetails`\>

#### Returns

`Promise`<`FeeDetails`\>

#### Overrides

Chain.getFees

#### Defined in

[terra/lib/chain/TerraChainProvider.ts:74](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/terra/lib/chain/TerraChainProvider.ts#L74)

___

### getNetwork

▸ **getNetwork**(): `Network`

#### Returns

`Network`

#### Inherited from

Chain.getNetwork

#### Defined in

client/dist/lib/Chain.d.ts:9

___

### getProvider

▸ **getProvider**(): `LCDClient`

#### Returns

`LCDClient`

#### Inherited from

Chain.getProvider

#### Defined in

client/dist/lib/Chain.d.ts:10

___

### getTransactionByHash

▸ **getTransactionByHash**(`txHash`): `Promise`<`Transaction`<[`TerraTxInfo`](../wiki/@liquality.terra.TerraTypes.TerraTxInfo)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `txHash` | `string` |

#### Returns

`Promise`<`Transaction`<[`TerraTxInfo`](../wiki/@liquality.terra.TerraTypes.TerraTxInfo)\>\>

#### Overrides

Chain.getTransactionByHash

#### Defined in

[terra/lib/chain/TerraChainProvider.ts:33](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/terra/lib/chain/TerraChainProvider.ts#L33)

___

### sendRawTransaction

▸ **sendRawTransaction**(`_rawTransaction`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_rawTransaction` | `string` |

#### Returns

`Promise`<`string`\>

#### Overrides

Chain.sendRawTransaction

#### Defined in

[terra/lib/chain/TerraChainProvider.ts:87](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/terra/lib/chain/TerraChainProvider.ts#L87)

___

### sendRpcRequest

▸ **sendRpcRequest**(`method`, `params`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | keyof `APIRequester` |
| `params` | `any`[] |

#### Returns

`Promise`<`any`\>

#### Overrides

Chain.sendRpcRequest

#### Defined in

[terra/lib/chain/TerraChainProvider.ts:78](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/terra/lib/chain/TerraChainProvider.ts#L78)

___

### setFeeProvider

▸ **setFeeProvider**(`feeProvider`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `feeProvider` | `default` |

#### Returns

`Promise`<`void`\>

#### Inherited from

Chain.setFeeProvider

#### Defined in

client/dist/lib/Chain.d.ts:12

___

### setNetwork

▸ **setNetwork**(`network`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `network` | `Network` |

#### Returns

`void`

#### Inherited from

Chain.setNetwork

#### Defined in

client/dist/lib/Chain.d.ts:8

___

### setProvider

▸ **setProvider**(`provider`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `provider` | `LCDClient` |

#### Returns

`Promise`<`void`\>

#### Inherited from

Chain.setProvider

#### Defined in

client/dist/lib/Chain.d.ts:11
