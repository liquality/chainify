[](../README.md) / [Exports](../modules.md) / [@liquality/bitcoin](../modules/liquality_bitcoin.md) / BitcoinEsploraApiProvider

# Class: BitcoinEsploraApiProvider

[@liquality/bitcoin](../modules/liquality_bitcoin.md).BitcoinEsploraApiProvider

## Hierarchy

- `default`<[`BitcoinEsploraBaseProvider`](liquality_bitcoin.BitcoinEsploraBaseProvider.md)\>

  ↳ **`BitcoinEsploraApiProvider`**

## Table of contents

### Constructors

- [constructor](liquality_bitcoin.BitcoinEsploraApiProvider.md#constructor)

### Properties

- [\_feeOptions](liquality_bitcoin.BitcoinEsploraApiProvider.md#_feeoptions)
- [\_httpClient](liquality_bitcoin.BitcoinEsploraApiProvider.md#_httpclient)
- [feeProvider](liquality_bitcoin.BitcoinEsploraApiProvider.md#feeprovider)
- [network](liquality_bitcoin.BitcoinEsploraApiProvider.md#network)
- [provider](liquality_bitcoin.BitcoinEsploraApiProvider.md#provider)

### Methods

- [\_getBlockHash](liquality_bitcoin.BitcoinEsploraApiProvider.md#_getblockhash)
- [\_getFee](liquality_bitcoin.BitcoinEsploraApiProvider.md#_getfee)
- [getBalance](liquality_bitcoin.BitcoinEsploraApiProvider.md#getbalance)
- [getBlockByHash](liquality_bitcoin.BitcoinEsploraApiProvider.md#getblockbyhash)
- [getBlockByNumber](liquality_bitcoin.BitcoinEsploraApiProvider.md#getblockbynumber)
- [getBlockHeight](liquality_bitcoin.BitcoinEsploraApiProvider.md#getblockheight)
- [getFeeProvider](liquality_bitcoin.BitcoinEsploraApiProvider.md#getfeeprovider)
- [getFees](liquality_bitcoin.BitcoinEsploraApiProvider.md#getfees)
- [getNetwork](liquality_bitcoin.BitcoinEsploraApiProvider.md#getnetwork)
- [getProvider](liquality_bitcoin.BitcoinEsploraApiProvider.md#getprovider)
- [getTransaction](liquality_bitcoin.BitcoinEsploraApiProvider.md#gettransaction)
- [getTransactionByHash](liquality_bitcoin.BitcoinEsploraApiProvider.md#gettransactionbyhash)
- [sendRawTransaction](liquality_bitcoin.BitcoinEsploraApiProvider.md#sendrawtransaction)
- [sendRpcRequest](liquality_bitcoin.BitcoinEsploraApiProvider.md#sendrpcrequest)
- [setFeeProvider](liquality_bitcoin.BitcoinEsploraApiProvider.md#setfeeprovider)
- [setNetwork](liquality_bitcoin.BitcoinEsploraApiProvider.md#setnetwork)
- [setProvider](liquality_bitcoin.BitcoinEsploraApiProvider.md#setprovider)

## Constructors

### constructor

• **new BitcoinEsploraApiProvider**(`options`, `feeProvider`, `feeOptions?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`EsploraApiProviderOptions`](../interfaces/liquality_bitcoin.BitcoinTypes.BitcoinEsploraTypes.EsploraApiProviderOptions.md) |
| `feeProvider` | `default` |
| `feeOptions?` | [`FeeOptions`](../modules/liquality_bitcoin.BitcoinTypes.BitcoinEsploraTypes.md#feeoptions) |

#### Overrides

Chain&lt;BitcoinEsploraBaseProvider\&gt;.constructor

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts:12](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts#L12)

## Properties

### \_feeOptions

• `Private` **\_feeOptions**: [`FeeOptions`](../modules/liquality_bitcoin.BitcoinTypes.BitcoinEsploraTypes.md#feeoptions)

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts:10](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts#L10)

___

### \_httpClient

• `Private` **\_httpClient**: `default`

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts:9](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts#L9)

___

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

• `Protected` **provider**: [`BitcoinEsploraBaseProvider`](liquality_bitcoin.BitcoinEsploraBaseProvider.md)

#### Inherited from

Chain.provider

#### Defined in

client/dist/lib/Chain.d.ts:6

## Methods

### \_getBlockHash

▸ `Private` **_getBlockHash**(`blockNumber`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockNumber` | `number` |

#### Returns

`Promise`<`string`\>

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts:96](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts#L96)

___

### \_getFee

▸ `Private` **_getFee**(`targetBlocks`): `Promise`<`FeeDetail`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetBlocks` | `number` |

#### Returns

`Promise`<`FeeDetail`\>

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts:119](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts#L119)

___

### getBalance

▸ **getBalance**(`_addresses`): `Promise`<`BigNumber`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_addresses` | `AddressType`[] |

#### Returns

`Promise`<`BigNumber`[]\>

#### Overrides

Chain.getBalance

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts:63](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts#L63)

___

### getBlockByHash

▸ **getBlockByHash**(`blockHash`): `Promise`<`Block`<`any`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockHash` | `string` |

#### Returns

`Promise`<`Block`<`any`, `any`\>\>

#### Overrides

Chain.getBlockByHash

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts:18](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts#L18)

___

### getBlockByNumber

▸ **getBlockByNumber**(`blockNumber?`): `Promise`<`Block`<`any`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockNumber?` | `number` |

#### Returns

`Promise`<`Block`<`any`, `any`\>\>

#### Overrides

Chain.getBlockByNumber

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts:47](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts#L47)

___

### getBlockHeight

▸ **getBlockHeight**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Overrides

Chain.getBlockHeight

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts:54](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts#L54)

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

[bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts:70](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts#L70)

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

▸ **getProvider**(): [`BitcoinEsploraBaseProvider`](liquality_bitcoin.BitcoinEsploraBaseProvider.md)

#### Returns

[`BitcoinEsploraBaseProvider`](liquality_bitcoin.BitcoinEsploraBaseProvider.md)

#### Inherited from

Chain.getProvider

#### Defined in

client/dist/lib/Chain.d.ts:10

___

### getTransaction

▸ `Private` **getTransaction**(`transactionHash`): `Promise`<`Transaction`<[`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionHash` | `string` |

#### Returns

`Promise`<`Transaction`<[`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)\>\>

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts:100](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts#L100)

___

### getTransactionByHash

▸ **getTransactionByHash**(`txHash`): `Promise`<`Transaction`<`any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `txHash` | `string` |

#### Returns

`Promise`<`Transaction`<`any`\>\>

#### Overrides

Chain.getTransactionByHash

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts:59](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts#L59)

___

### sendRawTransaction

▸ **sendRawTransaction**(`rawTransaction`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `rawTransaction` | `string` |

#### Returns

`Promise`<`string`\>

#### Overrides

Chain.sendRawTransaction

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts:88](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts#L88)

___

### sendRpcRequest

▸ **sendRpcRequest**(`_method`, `_params`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_method` | `string` |
| `_params` | `any`[] |

#### Returns

`Promise`<`any`\>

#### Overrides

Chain.sendRpcRequest

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts:92](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts#L92)

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
| `provider` | [`BitcoinEsploraBaseProvider`](liquality_bitcoin.BitcoinEsploraBaseProvider.md) |

#### Returns

`Promise`<`void`\>

#### Inherited from

Chain.setProvider

#### Defined in

client/dist/lib/Chain.d.ts:11
