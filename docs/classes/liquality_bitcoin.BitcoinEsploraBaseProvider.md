[](../README.md) / [Exports](../modules.md) / [@liquality/bitcoin](../modules/liquality_bitcoin.md) / BitcoinEsploraBaseProvider

# Class: BitcoinEsploraBaseProvider

[@liquality/bitcoin](../modules/liquality_bitcoin.md).BitcoinEsploraBaseProvider

## Hierarchy

- [`BitcoinBaseChainProvider`](liquality_bitcoin.BitcoinBaseChainProvider.md)

  ↳ **`BitcoinEsploraBaseProvider`**

  ↳↳ [`BitcoinEsploraBatchBaseProvider`](liquality_bitcoin.BitcoinEsploraBatchBaseProvider.md)

## Table of contents

### Constructors

- [constructor](liquality_bitcoin.BitcoinEsploraBaseProvider.md#constructor)

### Properties

- [\_options](liquality_bitcoin.BitcoinEsploraBaseProvider.md#_options)
- [httpClient](liquality_bitcoin.BitcoinEsploraBaseProvider.md#httpclient)

### Methods

- [\_getAddressTransactionCount](liquality_bitcoin.BitcoinEsploraBaseProvider.md#_getaddresstransactioncount)
- [\_getUnspentTransactions](liquality_bitcoin.BitcoinEsploraBaseProvider.md#_getunspenttransactions)
- [formatTransaction](liquality_bitcoin.BitcoinEsploraBaseProvider.md#formattransaction)
- [getAddressTransactionCounts](liquality_bitcoin.BitcoinEsploraBaseProvider.md#getaddresstransactioncounts)
- [getFeePerByte](liquality_bitcoin.BitcoinEsploraBaseProvider.md#getfeeperbyte)
- [getMinRelayFee](liquality_bitcoin.BitcoinEsploraBaseProvider.md#getminrelayfee)
- [getRawTransactionByHash](liquality_bitcoin.BitcoinEsploraBaseProvider.md#getrawtransactionbyhash)
- [getTransactionHex](liquality_bitcoin.BitcoinEsploraBaseProvider.md#gettransactionhex)
- [getUnspentTransactions](liquality_bitcoin.BitcoinEsploraBaseProvider.md#getunspenttransactions)

## Constructors

### constructor

• **new BitcoinEsploraBaseProvider**(`options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`EsploraApiProviderOptions`](../interfaces/liquality_bitcoin.BitcoinTypes.BitcoinEsploraTypes.EsploraApiProviderOptions.md) |

#### Overrides

[BitcoinBaseChainProvider](liquality_bitcoin.BitcoinBaseChainProvider.md).[constructor](liquality_bitcoin.BitcoinBaseChainProvider.md#constructor)

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts:13](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts#L13)

## Properties

### \_options

• `Protected` **\_options**: [`EsploraApiProviderOptions`](../interfaces/liquality_bitcoin.BitcoinTypes.BitcoinEsploraTypes.EsploraApiProviderOptions.md)

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts:11](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts#L11)

___

### httpClient

• **httpClient**: `default`

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts:10](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts#L10)

## Methods

### \_getAddressTransactionCount

▸ `Private` **_getAddressTransactionCount**(`address`): `Promise`<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`Promise`<`number`\>

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts:86](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts#L86)

___

### \_getUnspentTransactions

▸ `Private` **_getUnspentTransactions**(`address`): `Promise`<[`UTXO`](../interfaces/liquality_bitcoin.BitcoinTypes.UTXO.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`Promise`<[`UTXO`](../interfaces/liquality_bitcoin.BitcoinTypes.UTXO.md)[]\>

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts:76](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts#L76)

___

### formatTransaction

▸ **formatTransaction**(`tx`, `currentHeight`): `Promise`<`Transaction`<[`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | [`Transaction`](../modules/liquality_bitcoin.BitcoinTypes.BitcoinEsploraTypes.md#transaction) |
| `currentHeight` | `number` |

#### Returns

`Promise`<`Transaction`<[`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)\>\>

#### Overrides

[BitcoinBaseChainProvider](liquality_bitcoin.BitcoinBaseChainProvider.md).[formatTransaction](liquality_bitcoin.BitcoinBaseChainProvider.md#formattransaction)

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts:23](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts#L23)

___

### getAddressTransactionCounts

▸ **getAddressTransactionCounts**(`_addresses`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_addresses` | `AddressType`[] |

#### Returns

`Promise`<`any`\>

#### Overrides

[BitcoinBaseChainProvider](liquality_bitcoin.BitcoinBaseChainProvider.md).[getAddressTransactionCounts](liquality_bitcoin.BitcoinBaseChainProvider.md#getaddresstransactioncounts)

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts:60](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts#L60)

___

### getFeePerByte

▸ **getFeePerByte**(`numberOfBlocks?`): `Promise`<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `numberOfBlocks` | `number` |

#### Returns

`Promise`<`number`\>

#### Overrides

[BitcoinBaseChainProvider](liquality_bitcoin.BitcoinBaseChainProvider.md).[getFeePerByte](liquality_bitcoin.BitcoinBaseChainProvider.md#getfeeperbyte)

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts:39](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts#L39)

___

### getMinRelayFee

▸ **getMinRelayFee**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Overrides

[BitcoinBaseChainProvider](liquality_bitcoin.BitcoinBaseChainProvider.md).[getMinRelayFee](liquality_bitcoin.BitcoinBaseChainProvider.md#getminrelayfee)

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

#### Overrides

[BitcoinBaseChainProvider](liquality_bitcoin.BitcoinBaseChainProvider.md).[getRawTransactionByHash](liquality_bitcoin.BitcoinBaseChainProvider.md#getrawtransactionbyhash)

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

#### Overrides

[BitcoinBaseChainProvider](liquality_bitcoin.BitcoinBaseChainProvider.md).[getTransactionHex](liquality_bitcoin.BitcoinBaseChainProvider.md#gettransactionhex)

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

[BitcoinBaseChainProvider](liquality_bitcoin.BitcoinBaseChainProvider.md).[getUnspentTransactions](liquality_bitcoin.BitcoinBaseChainProvider.md#getunspenttransactions)

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts:53](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts#L53)
