# Class: NearChainProvider

[@liquality/near](../wiki/@liquality.near).NearChainProvider

## Hierarchy

- `default`<`providers.JsonRpcProvider`\>

  ↳ **`NearChainProvider`**

## Table of contents

### Constructors

- [constructor](../wiki/@liquality.near.NearChainProvider#constructor)

### Properties

- [feeProvider](../wiki/@liquality.near.NearChainProvider#feeprovider)
- [network](../wiki/@liquality.near.NearChainProvider#network)
- [provider](../wiki/@liquality.near.NearChainProvider#provider)

### Methods

- [\_getBlockById](../wiki/@liquality.near.NearChainProvider#_getblockbyid)
- [getBalance](../wiki/@liquality.near.NearChainProvider#getbalance)
- [getBlockByHash](../wiki/@liquality.near.NearChainProvider#getblockbyhash)
- [getBlockByNumber](../wiki/@liquality.near.NearChainProvider#getblockbynumber)
- [getBlockHeight](../wiki/@liquality.near.NearChainProvider#getblockheight)
- [getFeeProvider](../wiki/@liquality.near.NearChainProvider#getfeeprovider)
- [getFees](../wiki/@liquality.near.NearChainProvider#getfees)
- [getNetwork](../wiki/@liquality.near.NearChainProvider#getnetwork)
- [getProvider](../wiki/@liquality.near.NearChainProvider#getprovider)
- [getTransactionByHash](../wiki/@liquality.near.NearChainProvider#gettransactionbyhash)
- [sendRawTransaction](../wiki/@liquality.near.NearChainProvider#sendrawtransaction)
- [sendRpcRequest](../wiki/@liquality.near.NearChainProvider#sendrpcrequest)
- [setFeeProvider](../wiki/@liquality.near.NearChainProvider#setfeeprovider)
- [setNetwork](../wiki/@liquality.near.NearChainProvider#setnetwork)
- [setProvider](../wiki/@liquality.near.NearChainProvider#setprovider)

## Constructors

### constructor

• **new NearChainProvider**(`network`, `provider?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `network` | [`NearNetwork`](../wiki/@liquality.near.NearTypes.NearNetwork) |
| `provider?` | `JsonRpcProvider` |

#### Overrides

Chain&lt;providers.JsonRpcProvider\&gt;.constructor

#### Defined in

[near/lib/chain/NearChainProvider.ts:8](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/chain/NearChainProvider.ts#L8)

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

• `Protected` **provider**: `JsonRpcProvider`

#### Inherited from

Chain.provider

#### Defined in

client/dist/lib/Chain.d.ts:6

## Methods

### \_getBlockById

▸ **_getBlockById**(`blockId`, `includeTx`): `Promise`<`Block`<`BlockResult`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockId` | `string` \| `number` |
| `includeTx` | `boolean` |

#### Returns

`Promise`<`Block`<`BlockResult`, `any`\>\>

#### Defined in

[near/lib/chain/NearChainProvider.ts:73](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/chain/NearChainProvider.ts#L73)

___

### getBalance

▸ **getBalance**(`addresses`, `_assets`): `Promise`<`BigNumber`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `addresses` | `AddressType`[] |
| `_assets` | `Asset`[] |

#### Returns

`Promise`<`BigNumber`[]\>

#### Overrides

Chain.getBalance

#### Defined in

[near/lib/chain/NearChainProvider.ts:41](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/chain/NearChainProvider.ts#L41)

___

### getBlockByHash

▸ **getBlockByHash**(`blockHash`, `includeTx?`): `Promise`<`Block`<`BlockResult`, `Transaction`<`any`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockHash` | `string` |
| `includeTx?` | `boolean` |

#### Returns

`Promise`<`Block`<`BlockResult`, `Transaction`<`any`\>\>\>

#### Overrides

Chain.getBlockByHash

#### Defined in

[near/lib/chain/NearChainProvider.ts:16](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/chain/NearChainProvider.ts#L16)

___

### getBlockByNumber

▸ **getBlockByNumber**(`blockNumber?`, `includeTx?`): `Promise`<`Block`<`BlockResult`, `Transaction`<`any`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockNumber?` | `number` |
| `includeTx?` | `boolean` |

#### Returns

`Promise`<`Block`<`BlockResult`, `Transaction`<`any`\>\>\>

#### Overrides

Chain.getBlockByNumber

#### Defined in

[near/lib/chain/NearChainProvider.ts:20](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/chain/NearChainProvider.ts#L20)

___

### getBlockHeight

▸ **getBlockHeight**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Overrides

Chain.getBlockHeight

#### Defined in

[near/lib/chain/NearChainProvider.ts:27](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/chain/NearChainProvider.ts#L27)

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

[near/lib/chain/NearChainProvider.ts:59](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/chain/NearChainProvider.ts#L59)

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

▸ **getProvider**(): `JsonRpcProvider`

#### Returns

`JsonRpcProvider`

#### Inherited from

Chain.getProvider

#### Defined in

client/dist/lib/Chain.d.ts:10

___

### getTransactionByHash

▸ **getTransactionByHash**(`txHash`): `Promise`<`Transaction`<[`NearTxLog`](../wiki/@liquality.near.NearTypes.NearTxLog)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `txHash` | `string` |

#### Returns

`Promise`<`Transaction`<[`NearTxLog`](../wiki/@liquality.near.NearTypes.NearTxLog)\>\>

#### Overrides

Chain.getTransactionByHash

#### Defined in

[near/lib/chain/NearChainProvider.ts:32](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/chain/NearChainProvider.ts#L32)

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

[near/lib/chain/NearChainProvider.ts:65](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/chain/NearChainProvider.ts#L65)

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

[near/lib/chain/NearChainProvider.ts:69](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/chain/NearChainProvider.ts#L69)

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
| `provider` | `JsonRpcProvider` |

#### Returns

`Promise`<`void`\>

#### Inherited from

Chain.setProvider

#### Defined in

client/dist/lib/Chain.d.ts:11
