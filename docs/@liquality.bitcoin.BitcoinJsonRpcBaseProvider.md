# Class: BitcoinJsonRpcBaseProvider

[@liquality/bitcoin](../wiki/@liquality.bitcoin).BitcoinJsonRpcBaseProvider

## Hierarchy

- [`BitcoinBaseChainProvider`](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider)

  ↳ **`BitcoinJsonRpcBaseProvider`**

## Table of contents

### Constructors

- [constructor](../wiki/@liquality.bitcoin.BitcoinJsonRpcBaseProvider#constructor)

### Properties

- [\_options](../wiki/@liquality.bitcoin.BitcoinJsonRpcBaseProvider#_options)
- [jsonRpc](../wiki/@liquality.bitcoin.BitcoinJsonRpcBaseProvider#jsonrpc)

### Methods

- [formatTransaction](../wiki/@liquality.bitcoin.BitcoinJsonRpcBaseProvider#formattransaction)
- [getAddressTransactionCounts](../wiki/@liquality.bitcoin.BitcoinJsonRpcBaseProvider#getaddresstransactioncounts)
- [getFeePerByte](../wiki/@liquality.bitcoin.BitcoinJsonRpcBaseProvider#getfeeperbyte)
- [getMinRelayFee](../wiki/@liquality.bitcoin.BitcoinJsonRpcBaseProvider#getminrelayfee)
- [getRawTransactionByHash](../wiki/@liquality.bitcoin.BitcoinJsonRpcBaseProvider#getrawtransactionbyhash)
- [getTransactionHex](../wiki/@liquality.bitcoin.BitcoinJsonRpcBaseProvider#gettransactionhex)
- [getUnspentTransactions](../wiki/@liquality.bitcoin.BitcoinJsonRpcBaseProvider#getunspenttransactions)

## Constructors

### constructor

• **new BitcoinJsonRpcBaseProvider**(`options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`ProviderOptions`](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.ProviderOptions) |

#### Overrides

[BitcoinBaseChainProvider](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider).[constructor](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider#constructor)

#### Defined in

[bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcBaseProvider.ts:12](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcBaseProvider.ts#L12)

## Properties

### \_options

• `Protected` **\_options**: [`ProviderOptions`](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.ProviderOptions)

#### Defined in

[bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcBaseProvider.ts:10](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcBaseProvider.ts#L10)

___

### jsonRpc

• **jsonRpc**: `default`

#### Defined in

[bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcBaseProvider.ts:9](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcBaseProvider.ts#L9)

## Methods

### formatTransaction

▸ **formatTransaction**(`tx`, `currentHeight`): `Promise`<`Transaction`<`any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | `any` |
| `currentHeight` | `number` |

#### Returns

`Promise`<`Transaction`<`any`\>\>

#### Overrides

[BitcoinBaseChainProvider](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider).[formatTransaction](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider#formattransaction)

#### Defined in

[bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcBaseProvider.ts:22](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcBaseProvider.ts#L22)

___

### getAddressTransactionCounts

▸ **getAddressTransactionCounts**(`_addresses`): `Promise`<[`AddressTxCounts`](../wiki/@liquality.bitcoin.BitcoinTypes#addresstxcounts)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_addresses` | `AddressType`[] |

#### Returns

`Promise`<[`AddressTxCounts`](../wiki/@liquality.bitcoin.BitcoinTypes#addresstxcounts)\>

#### Overrides

[BitcoinBaseChainProvider](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider).[getAddressTransactionCounts](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider#getaddresstransactioncounts)

#### Defined in

[bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcBaseProvider.ts:58](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcBaseProvider.ts#L58)

___

### getFeePerByte

▸ **getFeePerByte**(`numberOfBlocks?`): `Promise`<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `numberOfBlocks?` | `number` |

#### Returns

`Promise`<`number`\>

#### Overrides

[BitcoinBaseChainProvider](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider).[getFeePerByte](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider#getfeeperbyte)

#### Defined in

[bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcBaseProvider.ts:38](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcBaseProvider.ts#L38)

___

### getMinRelayFee

▸ **getMinRelayFee**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Overrides

[BitcoinBaseChainProvider](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider).[getMinRelayFee](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider#getminrelayfee)

#### Defined in

[bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcBaseProvider.ts:69](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcBaseProvider.ts#L69)

___

### getRawTransactionByHash

▸ **getRawTransactionByHash**(`transactionHash`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionHash` | `string` |

#### Returns

`Promise`<`string`\>

#### Overrides

[BitcoinBaseChainProvider](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider).[getRawTransactionByHash](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider#getrawtransactionbyhash)

#### Defined in

[bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcBaseProvider.ts:30](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcBaseProvider.ts#L30)

___

### getTransactionHex

▸ **getTransactionHex**(`transactionHash`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionHash` | `string` |

#### Returns

`Promise`<`string`\>

#### Overrides

[BitcoinBaseChainProvider](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider).[getTransactionHex](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider#gettransactionhex)

#### Defined in

[bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcBaseProvider.ts:34](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcBaseProvider.ts#L34)

___

### getUnspentTransactions

▸ **getUnspentTransactions**(`_addresses`): `Promise`<[`UTXO`](../wiki/@liquality.bitcoin.BitcoinTypes.UTXO)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_addresses` | `AddressType`[] |

#### Returns

`Promise`<[`UTXO`](../wiki/@liquality.bitcoin.BitcoinTypes.UTXO)[]\>

#### Overrides

[BitcoinBaseChainProvider](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider).[getUnspentTransactions](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider#getunspenttransactions)

#### Defined in

[bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcBaseProvider.ts:52](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcBaseProvider.ts#L52)
