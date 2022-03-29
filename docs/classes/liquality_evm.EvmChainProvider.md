[](../README.md) / [Exports](../modules.md) / [@liquality/evm](../modules/liquality_evm.md) / EvmChainProvider

# Class: EvmChainProvider

[@liquality/evm](../modules/liquality_evm.md).EvmChainProvider

## Hierarchy

- `default`<`StaticJsonRpcProvider`\>

  ↳ **`EvmChainProvider`**

## Table of contents

### Constructors

- [constructor](liquality_evm.EvmChainProvider.md#constructor)

### Properties

- [feeProvider](liquality_evm.EvmChainProvider.md#feeprovider)
- [multicall](liquality_evm.EvmChainProvider.md#multicall)
- [network](liquality_evm.EvmChainProvider.md#network)
- [provider](liquality_evm.EvmChainProvider.md#provider)

### Methods

- [\_getBlock](liquality_evm.EvmChainProvider.md#_getblock)
- [getBalance](liquality_evm.EvmChainProvider.md#getbalance)
- [getBlockByHash](liquality_evm.EvmChainProvider.md#getblockbyhash)
- [getBlockByNumber](liquality_evm.EvmChainProvider.md#getblockbynumber)
- [getBlockHeight](liquality_evm.EvmChainProvider.md#getblockheight)
- [getFeeProvider](liquality_evm.EvmChainProvider.md#getfeeprovider)
- [getFees](liquality_evm.EvmChainProvider.md#getfees)
- [getNetwork](liquality_evm.EvmChainProvider.md#getnetwork)
- [getProvider](liquality_evm.EvmChainProvider.md#getprovider)
- [getTransactionByHash](liquality_evm.EvmChainProvider.md#gettransactionbyhash)
- [sendRawTransaction](liquality_evm.EvmChainProvider.md#sendrawtransaction)
- [sendRpcRequest](liquality_evm.EvmChainProvider.md#sendrpcrequest)
- [setFeeProvider](liquality_evm.EvmChainProvider.md#setfeeprovider)
- [setNetwork](liquality_evm.EvmChainProvider.md#setnetwork)
- [setProvider](liquality_evm.EvmChainProvider.md#setprovider)

## Constructors

### constructor

• **new EvmChainProvider**(`network`, `provider?`, `feeProvider?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `network` | `Network` |
| `provider?` | `StaticJsonRpcProvider` |
| `feeProvider?` | `default` |

#### Overrides

Chain&lt;StaticJsonRpcProvider\&gt;.constructor

#### Defined in

[evm/lib/chain/EvmChainProvider.ts:12](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/chain/EvmChainProvider.ts#L12)

## Properties

### feeProvider

• `Protected` **feeProvider**: `default`

#### Inherited from

Chain.feeProvider

#### Defined in

client/dist/lib/Chain.d.ts:4

___

### multicall

• `Protected` **multicall**: [`EvmMulticallProvider`](liquality_evm.EvmMulticallProvider.md)

#### Defined in

[evm/lib/chain/EvmChainProvider.ts:10](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/chain/EvmChainProvider.ts#L10)

___

### network

• `Protected` **network**: `Network`

#### Inherited from

Chain.network

#### Defined in

client/dist/lib/Chain.d.ts:5

___

### provider

• `Protected` **provider**: `StaticJsonRpcProvider`

#### Inherited from

Chain.provider

#### Defined in

client/dist/lib/Chain.d.ts:6

## Methods

### \_getBlock

▸ `Private` **_getBlock**(`blockTag`, `includeTx?`): `Promise`<`Block`<`Block` \| `BlockWithTransactions`, `TransactionResponse`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockTag` | `string` \| `number` |
| `includeTx?` | `boolean` |

#### Returns

`Promise`<`Block`<`Block` \| `BlockWithTransactions`, `TransactionResponse`\>\>

#### Defined in

[evm/lib/chain/EvmChainProvider.ts:86](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/chain/EvmChainProvider.ts#L86)

___

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

[evm/lib/chain/EvmChainProvider.ts:55](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/chain/EvmChainProvider.ts#L55)

___

### getBlockByHash

▸ **getBlockByHash**(`blockHash`, `includeTx?`): `Promise`<`Block`<`Block` \| `BlockWithTransactions`, `TransactionResponse`\>\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `blockHash` | `string` | `undefined` |
| `includeTx` | `boolean` | `false` |

#### Returns

`Promise`<`Block`<`Block` \| `BlockWithTransactions`, `TransactionResponse`\>\>

#### Overrides

Chain.getBlockByHash

#### Defined in

[evm/lib/chain/EvmChainProvider.ts:22](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/chain/EvmChainProvider.ts#L22)

___

### getBlockByNumber

▸ **getBlockByNumber**(`blockNumber?`, `includeTx?`): `Promise`<`Block`<`Block` \| `BlockWithTransactions`, `TransactionResponse`\>\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `blockNumber?` | `number` | `undefined` |
| `includeTx` | `boolean` | `false` |

#### Returns

`Promise`<`Block`<`Block` \| `BlockWithTransactions`, `TransactionResponse`\>\>

#### Overrides

Chain.getBlockByNumber

#### Defined in

[evm/lib/chain/EvmChainProvider.ts:29](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/chain/EvmChainProvider.ts#L29)

___

### getBlockHeight

▸ **getBlockHeight**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Overrides

Chain.getBlockHeight

#### Defined in

[evm/lib/chain/EvmChainProvider.ts:39](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/chain/EvmChainProvider.ts#L39)

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

[evm/lib/chain/EvmChainProvider.ts:65](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/chain/EvmChainProvider.ts#L65)

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

▸ **getProvider**(): `StaticJsonRpcProvider`

#### Returns

`StaticJsonRpcProvider`

#### Inherited from

Chain.getProvider

#### Defined in

client/dist/lib/Chain.d.ts:10

___

### getTransactionByHash

▸ **getTransactionByHash**(`txHash`): `Promise`<`Transaction`<`TransactionResponse`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `txHash` | `string` |

#### Returns

`Promise`<`Transaction`<`TransactionResponse`\>\>

#### Overrides

Chain.getTransactionByHash

#### Defined in

[evm/lib/chain/EvmChainProvider.ts:43](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/chain/EvmChainProvider.ts#L43)

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

[evm/lib/chain/EvmChainProvider.ts:60](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/chain/EvmChainProvider.ts#L60)

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

[evm/lib/chain/EvmChainProvider.ts:79](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/chain/EvmChainProvider.ts#L79)

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
| `provider` | `StaticJsonRpcProvider` |

#### Returns

`Promise`<`void`\>

#### Inherited from

Chain.setProvider

#### Defined in

client/dist/lib/Chain.d.ts:11
