[](../README.md) / [Exports](../modules.md) / [@liquality/near](../modules/liquality_near.md) / NearChainProvider

# Class: NearChainProvider

[@liquality/near](../modules/liquality_near.md).NearChainProvider

## Hierarchy

- `default`<`providers.JsonRpcProvider`\>

  ↳ **`NearChainProvider`**

## Table of contents

### Constructors

- [constructor](liquality_near.NearChainProvider.md#constructor)

### Properties

- [feeProvider](liquality_near.NearChainProvider.md#feeprovider)
- [network](liquality_near.NearChainProvider.md#network)
- [provider](liquality_near.NearChainProvider.md#provider)

### Methods

- [\_getBlockById](liquality_near.NearChainProvider.md#_getblockbyid)
- [getAccount](liquality_near.NearChainProvider.md#getaccount)
- [getBalance](liquality_near.NearChainProvider.md#getbalance)
- [getBlockByHash](liquality_near.NearChainProvider.md#getblockbyhash)
- [getBlockByNumber](liquality_near.NearChainProvider.md#getblockbynumber)
- [getBlockHeight](liquality_near.NearChainProvider.md#getblockheight)
- [getFeeProvider](liquality_near.NearChainProvider.md#getfeeprovider)
- [getFees](liquality_near.NearChainProvider.md#getfees)
- [getNetwork](liquality_near.NearChainProvider.md#getnetwork)
- [getProvider](liquality_near.NearChainProvider.md#getprovider)
- [getTransactionByHash](liquality_near.NearChainProvider.md#gettransactionbyhash)
- [sendRawTransaction](liquality_near.NearChainProvider.md#sendrawtransaction)
- [sendRpcRequest](liquality_near.NearChainProvider.md#sendrpcrequest)
- [setFeeProvider](liquality_near.NearChainProvider.md#setfeeprovider)
- [setNetwork](liquality_near.NearChainProvider.md#setnetwork)
- [setProvider](liquality_near.NearChainProvider.md#setprovider)

## Constructors

### constructor

• **new NearChainProvider**(`network`, `provider?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `network` | [`NearNetwork`](../interfaces/liquality_near.NearTypes.NearNetwork.md) |
| `provider?` | `JsonRpcProvider` |

#### Overrides

Chain&lt;providers.JsonRpcProvider\&gt;.constructor

#### Defined in

[near/lib/chain/NearChainProvider.ts:8](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/chain/NearChainProvider.ts#L8)

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

[near/lib/chain/NearChainProvider.ts:73](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/chain/NearChainProvider.ts#L73)

___

### getAccount

▸ `Private` **getAccount**(`accountId`): [`NearAccount`](liquality_near.NearTypes.NearAccount.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `accountId` | `string` |

#### Returns

[`NearAccount`](liquality_near.NearTypes.NearAccount.md)

#### Defined in

[near/lib/chain/NearChainProvider.ts:93](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/chain/NearChainProvider.ts#L93)

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

[near/lib/chain/NearChainProvider.ts:41](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/chain/NearChainProvider.ts#L41)

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

[near/lib/chain/NearChainProvider.ts:16](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/chain/NearChainProvider.ts#L16)

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

[near/lib/chain/NearChainProvider.ts:20](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/chain/NearChainProvider.ts#L20)

___

### getBlockHeight

▸ **getBlockHeight**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Overrides

Chain.getBlockHeight

#### Defined in

[near/lib/chain/NearChainProvider.ts:27](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/chain/NearChainProvider.ts#L27)

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

[near/lib/chain/NearChainProvider.ts:59](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/chain/NearChainProvider.ts#L59)

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

▸ **getTransactionByHash**(`txHash`): `Promise`<`Transaction`<[`NearTxLog`](../interfaces/liquality_near.NearTypes.NearTxLog.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `txHash` | `string` |

#### Returns

`Promise`<`Transaction`<[`NearTxLog`](../interfaces/liquality_near.NearTypes.NearTxLog.md)\>\>

#### Overrides

Chain.getTransactionByHash

#### Defined in

[near/lib/chain/NearChainProvider.ts:32](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/chain/NearChainProvider.ts#L32)

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

[near/lib/chain/NearChainProvider.ts:65](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/chain/NearChainProvider.ts#L65)

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

[near/lib/chain/NearChainProvider.ts:69](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/chain/NearChainProvider.ts#L69)

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
