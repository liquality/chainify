# Class: EvmChainProvider

[@liquality/evm](../wiki/@liquality.evm).EvmChainProvider

## Hierarchy

- `default`<`StaticJsonRpcProvider`\>

  ↳ **`EvmChainProvider`**

## Table of contents

### Constructors

- [constructor](../wiki/@liquality.evm.EvmChainProvider#constructor)

### Properties

- [feeProvider](../wiki/@liquality.evm.EvmChainProvider#feeprovider)
- [multicall](../wiki/@liquality.evm.EvmChainProvider#multicall)
- [network](../wiki/@liquality.evm.EvmChainProvider#network)
- [provider](../wiki/@liquality.evm.EvmChainProvider#provider)

### Methods

- [getBalance](../wiki/@liquality.evm.EvmChainProvider#getbalance)
- [getBlockByHash](../wiki/@liquality.evm.EvmChainProvider#getblockbyhash)
- [getBlockByNumber](../wiki/@liquality.evm.EvmChainProvider#getblockbynumber)
- [getBlockHeight](../wiki/@liquality.evm.EvmChainProvider#getblockheight)
- [getFeeProvider](../wiki/@liquality.evm.EvmChainProvider#getfeeprovider)
- [getFees](../wiki/@liquality.evm.EvmChainProvider#getfees)
- [getNetwork](../wiki/@liquality.evm.EvmChainProvider#getnetwork)
- [getProvider](../wiki/@liquality.evm.EvmChainProvider#getprovider)
- [getTransactionByHash](../wiki/@liquality.evm.EvmChainProvider#gettransactionbyhash)
- [sendRawTransaction](../wiki/@liquality.evm.EvmChainProvider#sendrawtransaction)
- [sendRpcRequest](../wiki/@liquality.evm.EvmChainProvider#sendrpcrequest)
- [setFeeProvider](../wiki/@liquality.evm.EvmChainProvider#setfeeprovider)
- [setNetwork](../wiki/@liquality.evm.EvmChainProvider#setnetwork)
- [setProvider](../wiki/@liquality.evm.EvmChainProvider#setprovider)

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

[evm/lib/chain/EvmChainProvider.ts:12](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/chain/EvmChainProvider.ts#L12)

## Properties

### feeProvider

• `Protected` **feeProvider**: `default`

#### Inherited from

Chain.feeProvider

#### Defined in

client/dist/lib/Chain.d.ts:4

___

### multicall

• `Protected` **multicall**: [`EvmMulticallProvider`](../wiki/@liquality.evm.EvmMulticallProvider)

#### Defined in

[evm/lib/chain/EvmChainProvider.ts:10](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/chain/EvmChainProvider.ts#L10)

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

[evm/lib/chain/EvmChainProvider.ts:55](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/chain/EvmChainProvider.ts#L55)

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

[evm/lib/chain/EvmChainProvider.ts:22](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/chain/EvmChainProvider.ts#L22)

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

[evm/lib/chain/EvmChainProvider.ts:29](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/chain/EvmChainProvider.ts#L29)

___

### getBlockHeight

▸ **getBlockHeight**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Overrides

Chain.getBlockHeight

#### Defined in

[evm/lib/chain/EvmChainProvider.ts:39](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/chain/EvmChainProvider.ts#L39)

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

[evm/lib/chain/EvmChainProvider.ts:65](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/chain/EvmChainProvider.ts#L65)

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

[evm/lib/chain/EvmChainProvider.ts:43](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/chain/EvmChainProvider.ts#L43)

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

[evm/lib/chain/EvmChainProvider.ts:60](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/chain/EvmChainProvider.ts#L60)

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

[evm/lib/chain/EvmChainProvider.ts:79](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/chain/EvmChainProvider.ts#L79)

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
