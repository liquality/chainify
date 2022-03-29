# Class: BitcoinEsploraApiProvider

[@liquality/bitcoin](../wiki/@liquality.bitcoin).BitcoinEsploraApiProvider

## Hierarchy

- `default`<[`BitcoinEsploraBaseProvider`](../wiki/@liquality.bitcoin.BitcoinEsploraBaseProvider)\>

  ↳ **`BitcoinEsploraApiProvider`**

## Table of contents

### Constructors

- [constructor](../wiki/@liquality.bitcoin.BitcoinEsploraApiProvider#constructor)

### Properties

- [feeProvider](../wiki/@liquality.bitcoin.BitcoinEsploraApiProvider#feeprovider)
- [network](../wiki/@liquality.bitcoin.BitcoinEsploraApiProvider#network)
- [provider](../wiki/@liquality.bitcoin.BitcoinEsploraApiProvider#provider)

### Methods

- [getBalance](../wiki/@liquality.bitcoin.BitcoinEsploraApiProvider#getbalance)
- [getBlockByHash](../wiki/@liquality.bitcoin.BitcoinEsploraApiProvider#getblockbyhash)
- [getBlockByNumber](../wiki/@liquality.bitcoin.BitcoinEsploraApiProvider#getblockbynumber)
- [getBlockHeight](../wiki/@liquality.bitcoin.BitcoinEsploraApiProvider#getblockheight)
- [getFeeProvider](../wiki/@liquality.bitcoin.BitcoinEsploraApiProvider#getfeeprovider)
- [getFees](../wiki/@liquality.bitcoin.BitcoinEsploraApiProvider#getfees)
- [getNetwork](../wiki/@liquality.bitcoin.BitcoinEsploraApiProvider#getnetwork)
- [getProvider](../wiki/@liquality.bitcoin.BitcoinEsploraApiProvider#getprovider)
- [getTransactionByHash](../wiki/@liquality.bitcoin.BitcoinEsploraApiProvider#gettransactionbyhash)
- [sendRawTransaction](../wiki/@liquality.bitcoin.BitcoinEsploraApiProvider#sendrawtransaction)
- [sendRpcRequest](../wiki/@liquality.bitcoin.BitcoinEsploraApiProvider#sendrpcrequest)
- [setFeeProvider](../wiki/@liquality.bitcoin.BitcoinEsploraApiProvider#setfeeprovider)
- [setNetwork](../wiki/@liquality.bitcoin.BitcoinEsploraApiProvider#setnetwork)
- [setProvider](../wiki/@liquality.bitcoin.BitcoinEsploraApiProvider#setprovider)

## Constructors

### constructor

• **new BitcoinEsploraApiProvider**(`options`, `feeProvider`, `feeOptions?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`EsploraApiProviderOptions`](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinEsploraTypes.EsploraApiProviderOptions) |
| `feeProvider` | `default` |
| `feeOptions?` | [`FeeOptions`](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinEsploraTypes#feeoptions) |

#### Overrides

Chain&lt;BitcoinEsploraBaseProvider\&gt;.constructor

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts:12](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts#L12)

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

• `Protected` **provider**: [`BitcoinEsploraBaseProvider`](../wiki/@liquality.bitcoin.BitcoinEsploraBaseProvider)

#### Inherited from

Chain.provider

#### Defined in

client/dist/lib/Chain.d.ts:6

## Methods

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

[bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts:63](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts#L63)

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

[bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts:18](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts#L18)

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

[bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts:47](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts#L47)

___

### getBlockHeight

▸ **getBlockHeight**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Overrides

Chain.getBlockHeight

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts:54](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts#L54)

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

[bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts:70](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts#L70)

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

▸ **getProvider**(): [`BitcoinEsploraBaseProvider`](../wiki/@liquality.bitcoin.BitcoinEsploraBaseProvider)

#### Returns

[`BitcoinEsploraBaseProvider`](../wiki/@liquality.bitcoin.BitcoinEsploraBaseProvider)

#### Inherited from

Chain.getProvider

#### Defined in

client/dist/lib/Chain.d.ts:10

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

[bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts:59](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts#L59)

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

[bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts:88](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts#L88)

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

[bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts:92](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/esplora/BitcoinEsploraApiProvider.ts#L92)

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
| `provider` | [`BitcoinEsploraBaseProvider`](../wiki/@liquality.bitcoin.BitcoinEsploraBaseProvider) |

#### Returns

`Promise`<`void`\>

#### Inherited from

Chain.setProvider

#### Defined in

client/dist/lib/Chain.d.ts:11
