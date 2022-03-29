[](../README.md) / [Exports](../modules.md) / [@liquality/bitcoin](../modules/liquality_bitcoin.md) / BitcoinEsploraBatchBaseProvider

# Class: BitcoinEsploraBatchBaseProvider

[@liquality/bitcoin](../modules/liquality_bitcoin.md).BitcoinEsploraBatchBaseProvider

## Hierarchy

- [`BitcoinEsploraBaseProvider`](liquality_bitcoin.BitcoinEsploraBaseProvider.md)

  ↳ **`BitcoinEsploraBatchBaseProvider`**

## Table of contents

### Constructors

- [constructor](liquality_bitcoin.BitcoinEsploraBatchBaseProvider.md#constructor)

### Properties

- [\_batchHttpClient](liquality_bitcoin.BitcoinEsploraBatchBaseProvider.md#_batchhttpclient)
- [\_options](liquality_bitcoin.BitcoinEsploraBatchBaseProvider.md#_options)
- [httpClient](liquality_bitcoin.BitcoinEsploraBatchBaseProvider.md#httpclient)

### Methods

- [formatTransaction](liquality_bitcoin.BitcoinEsploraBatchBaseProvider.md#formattransaction)
- [getAddressTransactionCounts](liquality_bitcoin.BitcoinEsploraBatchBaseProvider.md#getaddresstransactioncounts)
- [getFeePerByte](liquality_bitcoin.BitcoinEsploraBatchBaseProvider.md#getfeeperbyte)
- [getMinRelayFee](liquality_bitcoin.BitcoinEsploraBatchBaseProvider.md#getminrelayfee)
- [getRawTransactionByHash](liquality_bitcoin.BitcoinEsploraBatchBaseProvider.md#getrawtransactionbyhash)
- [getTransactionHex](liquality_bitcoin.BitcoinEsploraBatchBaseProvider.md#gettransactionhex)
- [getUnspentTransactions](liquality_bitcoin.BitcoinEsploraBatchBaseProvider.md#getunspenttransactions)

## Constructors

### constructor

• **new BitcoinEsploraBatchBaseProvider**(`options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `EsploraBatchApiProviderOptions` |

#### Overrides

[BitcoinEsploraBaseProvider](liquality_bitcoin.BitcoinEsploraBaseProvider.md).[constructor](liquality_bitcoin.BitcoinEsploraBaseProvider.md#constructor)

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraBatchBaseProvider.ts:15](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/esplora/BitcoinEsploraBatchBaseProvider.ts#L15)

## Properties

### \_batchHttpClient

• `Private` **\_batchHttpClient**: `default`

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraBatchBaseProvider.ts:13](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/esplora/BitcoinEsploraBatchBaseProvider.ts#L13)

___

### \_options

• `Protected` **\_options**: [`EsploraApiProviderOptions`](../interfaces/liquality_bitcoin.BitcoinTypes.BitcoinEsploraTypes.EsploraApiProviderOptions.md)

#### Inherited from

[BitcoinEsploraBaseProvider](liquality_bitcoin.BitcoinEsploraBaseProvider.md).[_options](liquality_bitcoin.BitcoinEsploraBaseProvider.md#_options)

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts:11](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts#L11)

___

### httpClient

• **httpClient**: `default`

#### Inherited from

[BitcoinEsploraBaseProvider](liquality_bitcoin.BitcoinEsploraBaseProvider.md).[httpClient](liquality_bitcoin.BitcoinEsploraBaseProvider.md#httpclient)

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts:10](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts#L10)

## Methods

### formatTransaction

▸ **formatTransaction**(`tx`, `currentHeight`): `Promise`<`Transaction`<[`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | [`Transaction`](../modules/liquality_bitcoin.BitcoinTypes.BitcoinEsploraTypes.md#transaction) |
| `currentHeight` | `number` |

#### Returns

`Promise`<`Transaction`<[`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)\>\>

#### Inherited from

[BitcoinEsploraBaseProvider](liquality_bitcoin.BitcoinEsploraBaseProvider.md).[formatTransaction](liquality_bitcoin.BitcoinEsploraBaseProvider.md#formattransaction)

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts:23](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts#L23)

___

### getAddressTransactionCounts

▸ **getAddressTransactionCounts**(`_addresses`): `Promise`<{ `[index: string]`: `number`;  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_addresses` | `AddressType`[] |

#### Returns

`Promise`<{ `[index: string]`: `number`;  }\>

#### Overrides

[BitcoinEsploraBaseProvider](liquality_bitcoin.BitcoinEsploraBaseProvider.md).[getAddressTransactionCounts](liquality_bitcoin.BitcoinEsploraBaseProvider.md#getaddresstransactioncounts)

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraBatchBaseProvider.ts:39](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/esplora/BitcoinEsploraBatchBaseProvider.ts#L39)

___

### getFeePerByte

▸ **getFeePerByte**(`numberOfBlocks?`): `Promise`<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `numberOfBlocks` | `number` |

#### Returns

`Promise`<`number`\>

#### Inherited from

[BitcoinEsploraBaseProvider](liquality_bitcoin.BitcoinEsploraBaseProvider.md).[getFeePerByte](liquality_bitcoin.BitcoinEsploraBaseProvider.md#getfeeperbyte)

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts:39](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts#L39)

___

### getMinRelayFee

▸ **getMinRelayFee**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Inherited from

[BitcoinEsploraBaseProvider](liquality_bitcoin.BitcoinEsploraBaseProvider.md).[getMinRelayFee](liquality_bitcoin.BitcoinEsploraBaseProvider.md#getminrelayfee)

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts:72](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts#L72)

___

### getRawTransactionByHash

▸ **getRawTransactionByHash**(`transactionHash`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionHash` | `string` |

#### Returns

`Promise`<`string`\>

#### Inherited from

[BitcoinEsploraBaseProvider](liquality_bitcoin.BitcoinEsploraBaseProvider.md).[getRawTransactionByHash](liquality_bitcoin.BitcoinEsploraBaseProvider.md#getrawtransactionbyhash)

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts:31](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts#L31)

___

### getTransactionHex

▸ **getTransactionHex**(`transactionHash`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionHash` | `string` |

#### Returns

`Promise`<`string`\>

#### Inherited from

[BitcoinEsploraBaseProvider](liquality_bitcoin.BitcoinEsploraBaseProvider.md).[getTransactionHex](liquality_bitcoin.BitcoinEsploraBaseProvider.md#gettransactionhex)

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts:35](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts#L35)

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

[BitcoinEsploraBaseProvider](liquality_bitcoin.BitcoinEsploraBaseProvider.md).[getUnspentTransactions](liquality_bitcoin.BitcoinEsploraBaseProvider.md#getunspenttransactions)

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraBatchBaseProvider.ts:20](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/esplora/BitcoinEsploraBatchBaseProvider.ts#L20)
