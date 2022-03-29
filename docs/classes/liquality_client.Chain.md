[](../README.md) / [Exports](../modules.md) / [@liquality/client](../modules/liquality_client.md) / Chain

# Class: Chain<T, N\>

[@liquality/client](../modules/liquality_client.md).Chain

Represents a connection to a specific blockchain.
Used to fetch chain specific data like blocks, transactions, balances and fees.

## Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `T` | `T` | type of the internal provider, e.g. [JsonRpcProvider](https://docs.ethers.io/v5/api/providers/jsonrpc-provider/) for EVM chains |
| `N` | `Network` | type of the network. The default value of the type is [Network](../interfaces/liquality_types.Network.md) |

## Implements

- `ChainProvider`

## Table of contents

### Constructors

- [constructor](liquality_client.Chain.md#constructor)

### Properties

- [feeProvider](liquality_client.Chain.md#feeprovider)
- [network](liquality_client.Chain.md#network)
- [provider](liquality_client.Chain.md#provider)

### Methods

- [getBalance](liquality_client.Chain.md#getbalance)
- [getBlockByHash](liquality_client.Chain.md#getblockbyhash)
- [getBlockByNumber](liquality_client.Chain.md#getblockbynumber)
- [getBlockHeight](liquality_client.Chain.md#getblockheight)
- [getFeeProvider](liquality_client.Chain.md#getfeeprovider)
- [getFees](liquality_client.Chain.md#getfees)
- [getNetwork](liquality_client.Chain.md#getnetwork)
- [getProvider](liquality_client.Chain.md#getprovider)
- [getTransactionByHash](liquality_client.Chain.md#gettransactionbyhash)
- [sendRawTransaction](liquality_client.Chain.md#sendrawtransaction)
- [sendRpcRequest](liquality_client.Chain.md#sendrpcrequest)
- [setFeeProvider](liquality_client.Chain.md#setfeeprovider)
- [setNetwork](liquality_client.Chain.md#setnetwork)
- [setProvider](liquality_client.Chain.md#setprovider)

## Constructors

### constructor

• **new Chain**<`T`, `N`\>(`network`, `provider?`, `feeProvider?`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `N` | `Network` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `network` | `N` |
| `provider?` | `T` |
| `feeProvider?` | [`Fee`](liquality_client.Fee.md) |

#### Defined in

[client/lib/Chain.ts:16](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Chain.ts#L16)

## Properties

### feeProvider

• `Protected` **feeProvider**: [`Fee`](liquality_client.Fee.md)

#### Defined in

[client/lib/Chain.ts:12](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Chain.ts#L12)

___

### network

• `Protected` **network**: `N`

#### Defined in

[client/lib/Chain.ts:13](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Chain.ts#L13)

___

### provider

• `Protected` **provider**: `T`

#### Defined in

[client/lib/Chain.ts:14](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Chain.ts#L14)

## Methods

### getBalance

▸ `Abstract` **getBalance**(`addresses`, `assets`): `Promise`<`BigNumber`[]\>

**`virtual`**
Get the balance for list of accounts and list of assets

#### Parameters

| Name | Type |
| :------ | :------ |
| `addresses` | `AddressType`[] |
| `assets` | `Asset`[] |

#### Returns

`Promise`<`BigNumber`[]\>

#### Implementation of

ChainProvider.getBalance

#### Defined in

[client/lib/Chain.ts:104](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Chain.ts#L104)

___

### getBlockByHash

▸ `Abstract` **getBlockByHash**(`blockHash`, `includeTx?`): `Promise`<`Block`<`any`, `any`\>\>

**`virtual`**
Get a block given its hash.

**`throws`** [UnsupportedMethodError](../modules/liquality_errors.md#unsupportedmethoderror) - Thrown if the chain doesn't support the method

**`throws`** [BlockNotFoundError](../modules/liquality_errors.md#blocknotfounderror) - Thrown if the block doesn't exist

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockHash` | `string` | A string that represents the **hash** of the desired block. |
| `includeTx?` | `boolean` | If true, fetches transactions in the block. |

#### Returns

`Promise`<`Block`<`any`, `any`\>\>

#### Implementation of

ChainProvider.getBlockByHash

#### Defined in

[client/lib/Chain.ts:73](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Chain.ts#L73)

___

### getBlockByNumber

▸ `Abstract` **getBlockByNumber**(`blockNumber?`, `includeTx?`): `Promise`<`Block`<`any`, `any`\>\>

**`virtual`**
Get a block given its number.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockNumber?` | `number` | The number of the desired block. |
| `includeTx?` | `boolean` | - |

#### Returns

`Promise`<`Block`<`any`, `any`\>\>

#### Implementation of

ChainProvider.getBlockByNumber

#### Defined in

[client/lib/Chain.ts:83](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Chain.ts#L83)

___

### getBlockHeight

▸ `Abstract` **getBlockHeight**(): `Promise`<`number`\>

**`virtual`**
Get current block height of the chain.

#### Returns

`Promise`<`number`\>

#### Implementation of

ChainProvider.getBlockHeight

#### Defined in

[client/lib/Chain.ts:89](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Chain.ts#L89)

___

### getFeeProvider

▸ **getFeeProvider**(): `Promise`<[`Fee`](liquality_client.Fee.md)\>

Gets the fee provider

#### Returns

`Promise`<[`Fee`](liquality_client.Fee.md)\>

#### Defined in

[client/lib/Chain.ts:60](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Chain.ts#L60)

___

### getFees

▸ `Abstract` **getFees**(): `Promise`<`FeeDetails`\>

**`virtual`**

#### Returns

`Promise`<`FeeDetails`\>

The fee details - [FeeDetails](../interfaces/liquality_types.FeeDetails.md)

#### Defined in

[client/lib/Chain.ts:110](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Chain.ts#L110)

___

### getNetwork

▸ **getNetwork**(): `N`

Gets the connected network

#### Returns

`N`

#### Defined in

[client/lib/Chain.ts:32](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Chain.ts#L32)

___

### getProvider

▸ **getProvider**(): `T`

Gets the chain specific provider

#### Returns

`T`

#### Defined in

[client/lib/Chain.ts:39](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Chain.ts#L39)

___

### getTransactionByHash

▸ `Abstract` **getTransactionByHash**(`txHash`): `Promise`<`Transaction`<`any`\>\>

**`virtual`**
Get a transaction given its hash.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `txHash` | `string` | A string that represents the **hash** of the  desired transaction.  Resolves with a [Transaction](../modules/liquality_bitcoin.BitcoinTypes.BitcoinEsploraTypes.md#transaction) with the same hash as the given input. |

#### Returns

`Promise`<`Transaction`<`any`\>\>

#### Implementation of

ChainProvider.getTransactionByHash

#### Defined in

[client/lib/Chain.ts:98](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Chain.ts#L98)

___

### sendRawTransaction

▸ `Abstract` **sendRawTransaction**(`rawTransaction`): `Promise`<`string`\>

**`virtual`**
Broadcast a signed transaction to the network.

**`throws`** [UnsupportedMethodError](../modules/liquality_errors.md#unsupportedmethoderror) - Thrown if the chain doesn't support sending of raw transactions

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `rawTransaction` | `string` | A raw transaction usually in the form of a hexadecimal string that represents the serialized transaction. |

#### Returns

`Promise`<`string`\>

the transaction hash

#### Defined in

[client/lib/Chain.ts:119](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Chain.ts#L119)

___

### sendRpcRequest

▸ `Abstract` **sendRpcRequest**(`method`, `params`): `Promise`<`any`\>

**`virtual`**
Used to send supported RPC requests to the RPC node

**`throws`** [UnsupportedMethodError](../modules/liquality_errors.md#unsupportedmethoderror) - Thrown if the chain provider doesn't support RPC requests

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | `string` |
| `params` | `any`[] |

#### Returns

`Promise`<`any`\>

#### Defined in

[client/lib/Chain.ts:126](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Chain.ts#L126)

___

### setFeeProvider

▸ **setFeeProvider**(`feeProvider`): `Promise`<`void`\>

Sets the fee provider

#### Parameters

| Name | Type |
| :------ | :------ |
| `feeProvider` | [`Fee`](liquality_client.Fee.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[client/lib/Chain.ts:53](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Chain.ts#L53)

___

### setNetwork

▸ **setNetwork**(`network`): `void`

Sets the network

#### Parameters

| Name | Type |
| :------ | :------ |
| `network` | `N` |

#### Returns

`void`

#### Defined in

[client/lib/Chain.ts:25](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Chain.ts#L25)

___

### setProvider

▸ **setProvider**(`provider`): `Promise`<`void`\>

Sets the chain specific provider

#### Parameters

| Name | Type |
| :------ | :------ |
| `provider` | `T` |

#### Returns

`Promise`<`void`\>

#### Defined in

[client/lib/Chain.ts:46](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Chain.ts#L46)
