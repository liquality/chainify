# Interface: ChainProvider

[@liquality/types](../wiki/@liquality.types).ChainProvider

## Table of contents

### Methods

- [getBalance](../wiki/@liquality.types.ChainProvider#getbalance)
- [getBlockByHash](../wiki/@liquality.types.ChainProvider#getblockbyhash)
- [getBlockByNumber](../wiki/@liquality.types.ChainProvider#getblockbynumber)
- [getBlockHeight](../wiki/@liquality.types.ChainProvider#getblockheight)
- [getTransactionByHash](../wiki/@liquality.types.ChainProvider#gettransactionbyhash)

## Methods

### getBalance

▸ **getBalance**(`addresses`, `assets`): `Promise`<`BigNumber`[]\>

Get the balance of an account given its addresses.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `addresses` | [`AddressType`](../wiki/@liquality.types#addresstype)[] | A list of addresses. |
| `assets` | [`Asset`](../wiki/@liquality.types.Asset)[] | - |

#### Returns

`Promise`<`BigNumber`[]\>

If addresses is given,
 returns the cumulative balance of the given addresses. Otherwise returns the balance
 of the addresses that the signing provider controls.
 Rejects with InvalidProviderResponseError if provider's response is invalid.

#### Defined in

[types/lib/Chain.ts:61](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Chain.ts#L61)

___

### getBlockByHash

▸ **getBlockByHash**(`blockHash`, `includeTx?`): `Promise`<[`Block`](../wiki/@liquality.types.Block)<`any`, `any`\>\>

Get a block given its hash.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockHash` | `string` | A hexadecimal string that represents the  *hash* of the desired block. |
| `includeTx?` | `boolean` | - |

#### Returns

`Promise`<[`Block`](../wiki/@liquality.types.Block)<`any`, `any`\>\>

 Resolves with a Block with the same hash as the given input.
 If `includeTx` is true, the transaction property is an array of Transactions;
 otherwise, it is a list of transaction hashes.
 Rejects with TypeError if input is invalid.
 Rejects with InvalidProviderResponseError if provider's response is invalid.

#### Defined in

[types/lib/Chain.ts:19](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Chain.ts#L19)

___

### getBlockByNumber

▸ **getBlockByNumber**(`blockNumber`, `includeTx?`): `Promise`<[`Block`](../wiki/@liquality.types.Block)<`any`, `any`\>\>

Get a block given its number.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockNumber` | `number` | The number of the desired block. |
| `includeTx?` | `boolean` | - |

#### Returns

`Promise`<[`Block`](../wiki/@liquality.types.Block)<`any`, `any`\>\>

 Resolves with a Block with the same number as the given input.
 If `includeTx` is true, the transaction property is an array of Transactions;
 otherwise, it is a list of transaction hashes.
 Rejects with TypeError if input is invalid.
 Rejects with InvalidProviderResponseError if provider's response is invalid.

#### Defined in

[types/lib/Chain.ts:32](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Chain.ts#L32)

___

### getBlockHeight

▸ **getBlockHeight**(): `Promise`<`number`\>

Get current block height of the chain.

#### Returns

`Promise`<`number`\>

Resolves with
 chain height.
 Rejects with InvalidProviderResponseError if provider's response is invalid.

#### Defined in

[types/lib/Chain.ts:40](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Chain.ts#L40)

___

### getTransactionByHash

▸ **getTransactionByHash**(`txHash`): `Promise`<[`Transaction`](../wiki/@liquality.types.Transaction)<`any`\>\>

Get a transaction given its hash.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `txHash` | `string` | A hexadecimal string that represents the *hash* of the  desired transaction. |

#### Returns

`Promise`<[`Transaction`](../wiki/@liquality.types.Transaction)<`any`\>\>

 Resolves with a Transaction with the same hash as the given input.
 Rejects with TypeError if input is invalid.
 Rejects with InvalidProviderResponseError if provider's response is invalid.

#### Defined in

[types/lib/Chain.ts:51](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Chain.ts#L51)
