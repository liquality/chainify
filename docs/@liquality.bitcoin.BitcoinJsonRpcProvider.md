# Class: BitcoinJsonRpcProvider

[@liquality/bitcoin](../wiki/@liquality.bitcoin).BitcoinJsonRpcProvider

## Hierarchy

- `default`<[`BitcoinJsonRpcBaseProvider`](../wiki/@liquality.bitcoin.BitcoinJsonRpcBaseProvider)\>

  ↳ **`BitcoinJsonRpcProvider`**

## Table of contents

### Constructors

- [constructor](../wiki/@liquality.bitcoin.BitcoinJsonRpcProvider#constructor)

### Properties

- [feeProvider](../wiki/@liquality.bitcoin.BitcoinJsonRpcProvider#feeprovider)
- [jsonRpc](../wiki/@liquality.bitcoin.BitcoinJsonRpcProvider#jsonrpc)
- [network](../wiki/@liquality.bitcoin.BitcoinJsonRpcProvider#network)
- [provider](../wiki/@liquality.bitcoin.BitcoinJsonRpcProvider#provider)

### Methods

- [getBalance](../wiki/@liquality.bitcoin.BitcoinJsonRpcProvider#getbalance)
- [getBlockByHash](../wiki/@liquality.bitcoin.BitcoinJsonRpcProvider#getblockbyhash)
- [getBlockByNumber](../wiki/@liquality.bitcoin.BitcoinJsonRpcProvider#getblockbynumber)
- [getBlockHeight](../wiki/@liquality.bitcoin.BitcoinJsonRpcProvider#getblockheight)
- [getFeeProvider](../wiki/@liquality.bitcoin.BitcoinJsonRpcProvider#getfeeprovider)
- [getFees](../wiki/@liquality.bitcoin.BitcoinJsonRpcProvider#getfees)
- [getNetwork](../wiki/@liquality.bitcoin.BitcoinJsonRpcProvider#getnetwork)
- [getProvider](../wiki/@liquality.bitcoin.BitcoinJsonRpcProvider#getprovider)
- [getTransactionByHash](../wiki/@liquality.bitcoin.BitcoinJsonRpcProvider#gettransactionbyhash)
- [sendRawTransaction](../wiki/@liquality.bitcoin.BitcoinJsonRpcProvider#sendrawtransaction)
- [sendRpcRequest](../wiki/@liquality.bitcoin.BitcoinJsonRpcProvider#sendrpcrequest)
- [setFeeProvider](../wiki/@liquality.bitcoin.BitcoinJsonRpcProvider#setfeeprovider)
- [setNetwork](../wiki/@liquality.bitcoin.BitcoinJsonRpcProvider#setnetwork)
- [setProvider](../wiki/@liquality.bitcoin.BitcoinJsonRpcProvider#setprovider)

## Constructors

### constructor

• **new BitcoinJsonRpcProvider**(`options`, `feeProvider?`, `feeOptions?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`ProviderOptions`](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.ProviderOptions) |
| `feeProvider?` | `default` |
| `feeOptions?` | [`FeeOptions`](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinJsonRpcTypes#feeoptions) |

#### Overrides

Chain&lt;BitcoinJsonRpcBaseProvider\&gt;.constructor

#### Defined in

[bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts:14](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts#L14)

## Properties

### feeProvider

• `Protected` **feeProvider**: `default`

#### Inherited from

Chain.feeProvider

#### Defined in

client/dist/lib/Chain.d.ts:4

___

### jsonRpc

• **jsonRpc**: `default`

#### Defined in

[bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts:11](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts#L11)

___

### network

• `Protected` **network**: `Network`

#### Inherited from

Chain.network

#### Defined in

client/dist/lib/Chain.d.ts:5

___

### provider

• `Protected` **provider**: [`BitcoinJsonRpcBaseProvider`](../wiki/@liquality.bitcoin.BitcoinJsonRpcBaseProvider)

#### Inherited from

Chain.provider

#### Defined in

client/dist/lib/Chain.d.ts:6

## Methods

### getBalance

▸ **getBalance**(`_addresses`, `_assets`): `Promise`<`BigNumber`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_addresses` | `AddressType`[] |
| `_assets` | `Asset`[] |

#### Returns

`Promise`<`BigNumber`[]\>

#### Overrides

Chain.getBalance

#### Defined in

[bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts:107](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts#L107)

___

### getBlockByHash

▸ **getBlockByHash**(`blockHash`, `includeTx?`): `Promise`<`Block`<`any`, `any`\>\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `blockHash` | `string` | `undefined` |
| `includeTx` | `boolean` | `false` |

#### Returns

`Promise`<`Block`<`any`, `any`\>\>

#### Overrides

Chain.getBlockByHash

#### Defined in

[bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts:20](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts#L20)

___

### getBlockByNumber

▸ **getBlockByNumber**(`blockNumber?`, `includeTx?`): `Promise`<`Block`<`any`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockNumber?` | `number` |
| `includeTx?` | `boolean` |

#### Returns

`Promise`<`Block`<`any`, `any`\>\>

#### Overrides

Chain.getBlockByNumber

#### Defined in

[bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts:66](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts#L66)

___

### getBlockHeight

▸ **getBlockHeight**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Overrides

Chain.getBlockHeight

#### Defined in

[bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts:88](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts#L88)

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

[bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts:114](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts#L114)

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

▸ **getProvider**(): [`BitcoinJsonRpcBaseProvider`](../wiki/@liquality.bitcoin.BitcoinJsonRpcBaseProvider)

#### Returns

[`BitcoinJsonRpcBaseProvider`](../wiki/@liquality.bitcoin.BitcoinJsonRpcBaseProvider)

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

[bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts:92](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts#L92)

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

[bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts:132](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts#L132)

___

### sendRpcRequest

▸ **sendRpcRequest**(`method`, `params`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | `string` |
| `params` | `any`[] |

#### Returns

`Promise`<`any`\>

#### Overrides

Chain.sendRpcRequest

#### Defined in

[bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts:136](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts#L136)

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
| `provider` | [`BitcoinJsonRpcBaseProvider`](../wiki/@liquality.bitcoin.BitcoinJsonRpcBaseProvider) |

#### Returns

`Promise`<`void`\>

#### Inherited from

Chain.setProvider

#### Defined in

client/dist/lib/Chain.d.ts:11
