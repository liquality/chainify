[](../README.md) / [Exports](../modules.md) / [@liquality/terra](../modules/liquality_terra.md) / TerraChainProvider

# Class: TerraChainProvider

[@liquality/terra](../modules/liquality_terra.md).TerraChainProvider

## Hierarchy

- `default`<`LCDClient`\>

  ↳ **`TerraChainProvider`**

## Table of contents

### Constructors

- [constructor](liquality_terra.TerraChainProvider.md#constructor)

### Properties

- [feeProvider](liquality_terra.TerraChainProvider.md#feeprovider)
- [network](liquality_terra.TerraChainProvider.md#network)
- [provider](liquality_terra.TerraChainProvider.md#provider)

### Methods

- [getBalance](liquality_terra.TerraChainProvider.md#getbalance)
- [getBlockByHash](liquality_terra.TerraChainProvider.md#getblockbyhash)
- [getBlockByNumber](liquality_terra.TerraChainProvider.md#getblockbynumber)
- [getBlockHeight](liquality_terra.TerraChainProvider.md#getblockheight)
- [getFeeProvider](liquality_terra.TerraChainProvider.md#getfeeprovider)
- [getFees](liquality_terra.TerraChainProvider.md#getfees)
- [getNetwork](liquality_terra.TerraChainProvider.md#getnetwork)
- [getProvider](liquality_terra.TerraChainProvider.md#getprovider)
- [getTransactionByHash](liquality_terra.TerraChainProvider.md#gettransactionbyhash)
- [sendRawTransaction](liquality_terra.TerraChainProvider.md#sendrawtransaction)
- [sendRpcRequest](liquality_terra.TerraChainProvider.md#sendrpcrequest)
- [setFeeProvider](liquality_terra.TerraChainProvider.md#setfeeprovider)
- [setNetwork](liquality_terra.TerraChainProvider.md#setnetwork)
- [setProvider](liquality_terra.TerraChainProvider.md#setprovider)

## Constructors

### constructor

• **new TerraChainProvider**(`network`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `network` | [`TerraNetwork`](../interfaces/liquality_terra.TerraTypes.TerraNetwork.md) |

#### Overrides

Chain&lt;LCDClient\&gt;.constructor

#### Defined in

[terra/lib/chain/TerraChainProvider.ts:10](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/chain/TerraChainProvider.ts#L10)

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

[terra/lib/chain/TerraChainProvider.ts:44](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/chain/TerraChainProvider.ts#L44)

___

### getBlockByHash

▸ **getBlockByHash**(`_blockHash`, `_includeTx?`): `Promise`<`Block`<`BlockInfo`, [`TerraTxInfo`](../interfaces/liquality_terra.TerraTypes.TerraTxInfo.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_blockHash` | `string` |
| `_includeTx?` | `boolean` |

#### Returns

`Promise`<`Block`<`BlockInfo`, [`TerraTxInfo`](../interfaces/liquality_terra.TerraTypes.TerraTxInfo.md)\>\>

#### Overrides

Chain.getBlockByHash

#### Defined in

[terra/lib/chain/TerraChainProvider.ts:83](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/chain/TerraChainProvider.ts#L83)

___

### getBlockByNumber

▸ **getBlockByNumber**(`blockNumber?`, `includeTx?`): `Promise`<`Block`<`BlockInfo`, [`TerraTxInfo`](../interfaces/liquality_terra.TerraTypes.TerraTxInfo.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockNumber?` | `number` |
| `includeTx?` | `boolean` |

#### Returns

`Promise`<`Block`<`BlockInfo`, [`TerraTxInfo`](../interfaces/liquality_terra.TerraTypes.TerraTxInfo.md)\>\>

#### Overrides

Chain.getBlockByNumber

#### Defined in

[terra/lib/chain/TerraChainProvider.ts:15](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/chain/TerraChainProvider.ts#L15)

___

### getBlockHeight

▸ **getBlockHeight**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Overrides

Chain.getBlockHeight

#### Defined in

[terra/lib/chain/TerraChainProvider.ts:28](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/chain/TerraChainProvider.ts#L28)

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

[terra/lib/chain/TerraChainProvider.ts:74](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/chain/TerraChainProvider.ts#L74)

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

▸ **getTransactionByHash**(`txHash`): `Promise`<`Transaction`<[`TerraTxInfo`](../interfaces/liquality_terra.TerraTypes.TerraTxInfo.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `txHash` | `string` |

#### Returns

`Promise`<`Transaction`<[`TerraTxInfo`](../interfaces/liquality_terra.TerraTypes.TerraTxInfo.md)\>\>

#### Overrides

Chain.getTransactionByHash

#### Defined in

[terra/lib/chain/TerraChainProvider.ts:33](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/chain/TerraChainProvider.ts#L33)

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

[terra/lib/chain/TerraChainProvider.ts:87](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/chain/TerraChainProvider.ts#L87)

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

[terra/lib/chain/TerraChainProvider.ts:78](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/chain/TerraChainProvider.ts#L78)

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
