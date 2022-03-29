[](../README.md) / [Exports](../modules.md) / [@liquality/bitcoin](../modules/liquality_bitcoin.md) / BitcoinJsonRpcBaseProvider

# Class: BitcoinJsonRpcBaseProvider

[@liquality/bitcoin](../modules/liquality_bitcoin.md).BitcoinJsonRpcBaseProvider

## Hierarchy

- [`BitcoinBaseChainProvider`](liquality_bitcoin.BitcoinBaseChainProvider.md)

  ↳ **`BitcoinJsonRpcBaseProvider`**

## Table of contents

### Constructors

- [constructor](liquality_bitcoin.BitcoinJsonRpcBaseProvider.md#constructor)

### Properties

- [\_options](liquality_bitcoin.BitcoinJsonRpcBaseProvider.md#_options)
- [jsonRpc](liquality_bitcoin.BitcoinJsonRpcBaseProvider.md#jsonrpc)

### Methods

- [formatTransaction](liquality_bitcoin.BitcoinJsonRpcBaseProvider.md#formattransaction)
- [getAddressTransactionCounts](liquality_bitcoin.BitcoinJsonRpcBaseProvider.md#getaddresstransactioncounts)
- [getFeePerByte](liquality_bitcoin.BitcoinJsonRpcBaseProvider.md#getfeeperbyte)
- [getMinRelayFee](liquality_bitcoin.BitcoinJsonRpcBaseProvider.md#getminrelayfee)
- [getRawTransactionByHash](liquality_bitcoin.BitcoinJsonRpcBaseProvider.md#getrawtransactionbyhash)
- [getTransactionHex](liquality_bitcoin.BitcoinJsonRpcBaseProvider.md#gettransactionhex)
- [getUnspentTransactions](liquality_bitcoin.BitcoinJsonRpcBaseProvider.md#getunspenttransactions)

## Constructors

### constructor

• **new BitcoinJsonRpcBaseProvider**(`options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`ProviderOptions`](../interfaces/liquality_bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.ProviderOptions.md) |

#### Overrides

[BitcoinBaseChainProvider](liquality_bitcoin.BitcoinBaseChainProvider.md).[constructor](liquality_bitcoin.BitcoinBaseChainProvider.md#constructor)

#### Defined in

[bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcBaseProvider.ts:12](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcBaseProvider.ts#L12)

## Properties

### \_options

• `Protected` **\_options**: [`ProviderOptions`](../interfaces/liquality_bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.ProviderOptions.md)

#### Defined in

[bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcBaseProvider.ts:10](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcBaseProvider.ts#L10)

___

### jsonRpc

• **jsonRpc**: `default`

#### Defined in

[bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcBaseProvider.ts:9](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcBaseProvider.ts#L9)

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

[BitcoinBaseChainProvider](liquality_bitcoin.BitcoinBaseChainProvider.md).[formatTransaction](liquality_bitcoin.BitcoinBaseChainProvider.md#formattransaction)

#### Defined in

[bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcBaseProvider.ts:22](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcBaseProvider.ts#L22)

___

### getAddressTransactionCounts

▸ **getAddressTransactionCounts**(`_addresses`): `Promise`<[`AddressTxCounts`](../modules/liquality_bitcoin.BitcoinTypes.md#addresstxcounts)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_addresses` | `AddressType`[] |

#### Returns

`Promise`<[`AddressTxCounts`](../modules/liquality_bitcoin.BitcoinTypes.md#addresstxcounts)\>

#### Overrides

[BitcoinBaseChainProvider](liquality_bitcoin.BitcoinBaseChainProvider.md).[getAddressTransactionCounts](liquality_bitcoin.BitcoinBaseChainProvider.md#getaddresstransactioncounts)

#### Defined in

[bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcBaseProvider.ts:58](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcBaseProvider.ts#L58)

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

[BitcoinBaseChainProvider](liquality_bitcoin.BitcoinBaseChainProvider.md).[getFeePerByte](liquality_bitcoin.BitcoinBaseChainProvider.md#getfeeperbyte)

#### Defined in

[bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcBaseProvider.ts:38](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcBaseProvider.ts#L38)

___

### getMinRelayFee

▸ **getMinRelayFee**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Overrides

[BitcoinBaseChainProvider](liquality_bitcoin.BitcoinBaseChainProvider.md).[getMinRelayFee](liquality_bitcoin.BitcoinBaseChainProvider.md#getminrelayfee)

#### Defined in

[bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcBaseProvider.ts:69](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcBaseProvider.ts#L69)

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

[BitcoinBaseChainProvider](liquality_bitcoin.BitcoinBaseChainProvider.md).[getRawTransactionByHash](liquality_bitcoin.BitcoinBaseChainProvider.md#getrawtransactionbyhash)

#### Defined in

[bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcBaseProvider.ts:30](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcBaseProvider.ts#L30)

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

[BitcoinBaseChainProvider](liquality_bitcoin.BitcoinBaseChainProvider.md).[getTransactionHex](liquality_bitcoin.BitcoinBaseChainProvider.md#gettransactionhex)

#### Defined in

[bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcBaseProvider.ts:34](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcBaseProvider.ts#L34)

___

### getUnspentTransactions

▸ **getUnspentTransactions**(`_addresses`): `Promise`<[`UTXO`](../interfaces/liquality_bitcoin.BitcoinTypes.UTXO.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_addresses` | `AddressType`[] |

#### Returns

`Promise`<[`UTXO`](../interfaces/liquality_bitcoin.BitcoinTypes.UTXO.md)[]\>

#### Overrides

[BitcoinBaseChainProvider](liquality_bitcoin.BitcoinBaseChainProvider.md).[getUnspentTransactions](liquality_bitcoin.BitcoinBaseChainProvider.md#getunspenttransactions)

#### Defined in

[bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcBaseProvider.ts:52](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/jsonRpc/BitcoinJsonRpcBaseProvider.ts#L52)
