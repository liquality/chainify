[](../README.md) / [Exports](../modules.md) / [@liquality/bitcoin](../modules/liquality_bitcoin.md) / BitcoinJsonRpcProvider

# Class: BitcoinJsonRpcProvider

[@liquality/bitcoin](../modules/liquality_bitcoin.md).BitcoinJsonRpcProvider

## Hierarchy

- `default`<[`BitcoinJsonRpcBaseProvider`](liquality_bitcoin.BitcoinJsonRpcBaseProvider.md)\>

  ↳ **`BitcoinJsonRpcProvider`**

## Table of contents

### Constructors

- [constructor](liquality_bitcoin.BitcoinJsonRpcProvider.md#constructor)

### Properties

- [\_feeOptions](liquality_bitcoin.BitcoinJsonRpcProvider.md#_feeoptions)
- [feeProvider](liquality_bitcoin.BitcoinJsonRpcProvider.md#feeprovider)
- [jsonRpc](liquality_bitcoin.BitcoinJsonRpcProvider.md#jsonrpc)
- [network](liquality_bitcoin.BitcoinJsonRpcProvider.md#network)
- [provider](liquality_bitcoin.BitcoinJsonRpcProvider.md#provider)

### Methods

- [\_getFee](liquality_bitcoin.BitcoinJsonRpcProvider.md#_getfee)
- [getBalance](liquality_bitcoin.BitcoinJsonRpcProvider.md#getbalance)
- [getBlockByHash](liquality_bitcoin.BitcoinJsonRpcProvider.md#getblockbyhash)
- [getBlockByNumber](liquality_bitcoin.BitcoinJsonRpcProvider.md#getblockbynumber)
- [getBlockHeight](liquality_bitcoin.BitcoinJsonRpcProvider.md#getblockheight)
- [getFeeProvider](liquality_bitcoin.BitcoinJsonRpcProvider.md#getfeeprovider)
- [getFees](liquality_bitcoin.BitcoinJsonRpcProvider.md#getfees)
- [getNetwork](liquality_bitcoin.BitcoinJsonRpcProvider.md#getnetwork)
- [getParsedTransactionByHash](liquality_bitcoin.BitcoinJsonRpcProvider.md#getparsedtransactionbyhash)
- [getProvider](liquality_bitcoin.BitcoinJsonRpcProvider.md#getprovider)
- [getTransactionByHash](liquality_bitcoin.BitcoinJsonRpcProvider.md#gettransactionbyhash)
- [getTransactionFee](liquality_bitcoin.BitcoinJsonRpcProvider.md#gettransactionfee)
- [sendRawTransaction](liquality_bitcoin.BitcoinJsonRpcProvider.md#sendrawtransaction)
- [sendRpcRequest](liquality_bitcoin.BitcoinJsonRpcProvider.md#sendrpcrequest)
- [setFeeProvider](liquality_bitcoin.BitcoinJsonRpcProvider.md#setfeeprovider)
- [setNetwork](liquality_bitcoin.BitcoinJsonRpcProvider.md#setnetwork)
- [setProvider](liquality_bitcoin.BitcoinJsonRpcProvider.md#setprovider)

## Constructors

### constructor

• **new BitcoinJsonRpcProvider**(`options`, `feeProvider?`, `feeOptions?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`ProviderOptions`](../interfaces/liquality_bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.ProviderOptions.md) |
| `feeProvider?` | `default` |
| `feeOptions?` | [`FeeOptions`](../modules/liquality_bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.md#feeoptions) |

#### Overrides

Chain&lt;BitcoinJsonRpcBaseProvider\&gt;.constructor

#### Defined in

[bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts:14](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts#L14)

## Properties

### \_feeOptions

• `Private` **\_feeOptions**: [`FeeOptions`](../modules/liquality_bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.md#feeoptions)

#### Defined in

[bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts:12](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts#L12)

___

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

[bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts:11](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts#L11)

___

### network

• `Protected` **network**: `Network`

#### Inherited from

Chain.network

#### Defined in

client/dist/lib/Chain.d.ts:5

___

### provider

• `Protected` **provider**: [`BitcoinJsonRpcBaseProvider`](liquality_bitcoin.BitcoinJsonRpcBaseProvider.md)

#### Inherited from

Chain.provider

#### Defined in

client/dist/lib/Chain.d.ts:6

## Methods

### \_getFee

▸ `Private` **_getFee**(`targetBlocks`): `Promise`<`FeeDetail`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetBlocks` | `number` |

#### Returns

`Promise`<`FeeDetail`\>

#### Defined in

[bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts:167](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts#L167)

___

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

[bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts:107](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts#L107)

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

[bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts:20](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts#L20)

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

[bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts:66](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts#L66)

___

### getBlockHeight

▸ **getBlockHeight**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Overrides

Chain.getBlockHeight

#### Defined in

[bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts:88](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts#L88)

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

[bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts:114](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts#L114)

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

### getParsedTransactionByHash

▸ `Private` **getParsedTransactionByHash**(`transactionHash`, `addFees?`): `Promise`<`Transaction`<[`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)\>\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `transactionHash` | `string` | `undefined` |
| `addFees` | `boolean` | `false` |

#### Returns

`Promise`<`Transaction`<[`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)\>\>

#### Defined in

[bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts:140](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts#L140)

___

### getProvider

▸ **getProvider**(): [`BitcoinJsonRpcBaseProvider`](liquality_bitcoin.BitcoinJsonRpcBaseProvider.md)

#### Returns

[`BitcoinJsonRpcBaseProvider`](liquality_bitcoin.BitcoinJsonRpcBaseProvider.md)

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

[bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts:92](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts#L92)

___

### getTransactionFee

▸ `Private` **getTransactionFee**(`tx`): `Promise`<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | [`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md) |

#### Returns

`Promise`<`number`\>

#### Defined in

[bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts:149](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts#L149)

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

[bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts:132](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts#L132)

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

[bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts:136](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcProvider.ts#L136)

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
| `provider` | [`BitcoinJsonRpcBaseProvider`](liquality_bitcoin.BitcoinJsonRpcBaseProvider.md) |

#### Returns

`Promise`<`void`\>

#### Inherited from

Chain.setProvider

#### Defined in

client/dist/lib/Chain.d.ts:11
