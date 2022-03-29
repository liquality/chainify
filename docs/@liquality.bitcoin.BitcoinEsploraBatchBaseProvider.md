# Class: BitcoinEsploraBatchBaseProvider

[@liquality/bitcoin](../wiki/@liquality.bitcoin).BitcoinEsploraBatchBaseProvider

## Hierarchy

- [`BitcoinEsploraBaseProvider`](../wiki/@liquality.bitcoin.BitcoinEsploraBaseProvider)

  ↳ **`BitcoinEsploraBatchBaseProvider`**

## Table of contents

### Constructors

- [constructor](../wiki/@liquality.bitcoin.BitcoinEsploraBatchBaseProvider#constructor)

### Properties

- [\_options](../wiki/@liquality.bitcoin.BitcoinEsploraBatchBaseProvider#_options)
- [httpClient](../wiki/@liquality.bitcoin.BitcoinEsploraBatchBaseProvider#httpclient)

### Methods

- [formatTransaction](../wiki/@liquality.bitcoin.BitcoinEsploraBatchBaseProvider#formattransaction)
- [getAddressTransactionCounts](../wiki/@liquality.bitcoin.BitcoinEsploraBatchBaseProvider#getaddresstransactioncounts)
- [getFeePerByte](../wiki/@liquality.bitcoin.BitcoinEsploraBatchBaseProvider#getfeeperbyte)
- [getMinRelayFee](../wiki/@liquality.bitcoin.BitcoinEsploraBatchBaseProvider#getminrelayfee)
- [getRawTransactionByHash](../wiki/@liquality.bitcoin.BitcoinEsploraBatchBaseProvider#getrawtransactionbyhash)
- [getTransactionHex](../wiki/@liquality.bitcoin.BitcoinEsploraBatchBaseProvider#gettransactionhex)
- [getUnspentTransactions](../wiki/@liquality.bitcoin.BitcoinEsploraBatchBaseProvider#getunspenttransactions)

## Constructors

### constructor

• **new BitcoinEsploraBatchBaseProvider**(`options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `EsploraBatchApiProviderOptions` |

#### Overrides

[BitcoinEsploraBaseProvider](../wiki/@liquality.bitcoin.BitcoinEsploraBaseProvider).[constructor](../wiki/@liquality.bitcoin.BitcoinEsploraBaseProvider#constructor)

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraBatchBaseProvider.ts:15](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/esplora/BitcoinEsploraBatchBaseProvider.ts#L15)

## Properties

### \_options

• `Protected` **\_options**: [`EsploraApiProviderOptions`](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinEsploraTypes.EsploraApiProviderOptions)

#### Inherited from

[BitcoinEsploraBaseProvider](../wiki/@liquality.bitcoin.BitcoinEsploraBaseProvider).[_options](../wiki/@liquality.bitcoin.BitcoinEsploraBaseProvider#_options)

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts:11](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts#L11)

___

### httpClient

• **httpClient**: `default`

#### Inherited from

[BitcoinEsploraBaseProvider](../wiki/@liquality.bitcoin.BitcoinEsploraBaseProvider).[httpClient](../wiki/@liquality.bitcoin.BitcoinEsploraBaseProvider#httpclient)

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts:10](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts#L10)

## Methods

### formatTransaction

▸ **formatTransaction**(`tx`, `currentHeight`): `Promise`<`Transaction`<[`Transaction`](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | [`Transaction`](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinEsploraTypes#transaction) |
| `currentHeight` | `number` |

#### Returns

`Promise`<`Transaction`<[`Transaction`](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction)\>\>

#### Inherited from

[BitcoinEsploraBaseProvider](../wiki/@liquality.bitcoin.BitcoinEsploraBaseProvider).[formatTransaction](../wiki/@liquality.bitcoin.BitcoinEsploraBaseProvider#formattransaction)

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts:23](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts#L23)

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

[BitcoinEsploraBaseProvider](../wiki/@liquality.bitcoin.BitcoinEsploraBaseProvider).[getAddressTransactionCounts](../wiki/@liquality.bitcoin.BitcoinEsploraBaseProvider#getaddresstransactioncounts)

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraBatchBaseProvider.ts:39](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/esplora/BitcoinEsploraBatchBaseProvider.ts#L39)

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

[BitcoinEsploraBaseProvider](../wiki/@liquality.bitcoin.BitcoinEsploraBaseProvider).[getFeePerByte](../wiki/@liquality.bitcoin.BitcoinEsploraBaseProvider#getfeeperbyte)

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts:39](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts#L39)

___

### getMinRelayFee

▸ **getMinRelayFee**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Inherited from

[BitcoinEsploraBaseProvider](../wiki/@liquality.bitcoin.BitcoinEsploraBaseProvider).[getMinRelayFee](../wiki/@liquality.bitcoin.BitcoinEsploraBaseProvider#getminrelayfee)

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts:72](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts#L72)

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

[BitcoinEsploraBaseProvider](../wiki/@liquality.bitcoin.BitcoinEsploraBaseProvider).[getRawTransactionByHash](../wiki/@liquality.bitcoin.BitcoinEsploraBaseProvider#getrawtransactionbyhash)

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts:31](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts#L31)

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

[BitcoinEsploraBaseProvider](../wiki/@liquality.bitcoin.BitcoinEsploraBaseProvider).[getTransactionHex](../wiki/@liquality.bitcoin.BitcoinEsploraBaseProvider#gettransactionhex)

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts:35](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts#L35)

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

[BitcoinEsploraBaseProvider](../wiki/@liquality.bitcoin.BitcoinEsploraBaseProvider).[getUnspentTransactions](../wiki/@liquality.bitcoin.BitcoinEsploraBaseProvider#getunspenttransactions)

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraBatchBaseProvider.ts:20](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/esplora/BitcoinEsploraBatchBaseProvider.ts#L20)
