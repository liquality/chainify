# Class: BitcoinEsploraBaseProvider

[@liquality/bitcoin](../wiki/@liquality.bitcoin).BitcoinEsploraBaseProvider

## Hierarchy

- [`BitcoinBaseChainProvider`](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider)

  ↳ **`BitcoinEsploraBaseProvider`**

  ↳↳ [`BitcoinEsploraBatchBaseProvider`](../wiki/@liquality.bitcoin.BitcoinEsploraBatchBaseProvider)

## Table of contents

### Constructors

- [constructor](../wiki/@liquality.bitcoin.BitcoinEsploraBaseProvider#constructor)

### Properties

- [\_options](../wiki/@liquality.bitcoin.BitcoinEsploraBaseProvider#_options)
- [httpClient](../wiki/@liquality.bitcoin.BitcoinEsploraBaseProvider#httpclient)

### Methods

- [formatTransaction](../wiki/@liquality.bitcoin.BitcoinEsploraBaseProvider#formattransaction)
- [getAddressTransactionCounts](../wiki/@liquality.bitcoin.BitcoinEsploraBaseProvider#getaddresstransactioncounts)
- [getFeePerByte](../wiki/@liquality.bitcoin.BitcoinEsploraBaseProvider#getfeeperbyte)
- [getMinRelayFee](../wiki/@liquality.bitcoin.BitcoinEsploraBaseProvider#getminrelayfee)
- [getRawTransactionByHash](../wiki/@liquality.bitcoin.BitcoinEsploraBaseProvider#getrawtransactionbyhash)
- [getTransactionHex](../wiki/@liquality.bitcoin.BitcoinEsploraBaseProvider#gettransactionhex)
- [getUnspentTransactions](../wiki/@liquality.bitcoin.BitcoinEsploraBaseProvider#getunspenttransactions)

## Constructors

### constructor

• **new BitcoinEsploraBaseProvider**(`options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`EsploraApiProviderOptions`](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinEsploraTypes.EsploraApiProviderOptions) |

#### Overrides

[BitcoinBaseChainProvider](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider).[constructor](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider#constructor)

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts:13](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts#L13)

## Properties

### \_options

• `Protected` **\_options**: [`EsploraApiProviderOptions`](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinEsploraTypes.EsploraApiProviderOptions)

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts:11](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts#L11)

___

### httpClient

• **httpClient**: `default`

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

#### Overrides

[BitcoinBaseChainProvider](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider).[formatTransaction](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider#formattransaction)

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts:23](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts#L23)

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

[BitcoinBaseChainProvider](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider).[getAddressTransactionCounts](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider#getaddresstransactioncounts)

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts:60](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts#L60)

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

[BitcoinBaseChainProvider](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider).[getFeePerByte](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider#getfeeperbyte)

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts:39](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts#L39)

___

### getMinRelayFee

▸ **getMinRelayFee**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Overrides

[BitcoinBaseChainProvider](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider).[getMinRelayFee](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider#getminrelayfee)

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

#### Overrides

[BitcoinBaseChainProvider](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider).[getRawTransactionByHash](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider#getrawtransactionbyhash)

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

#### Overrides

[BitcoinBaseChainProvider](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider).[getTransactionHex](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider#gettransactionhex)

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

[BitcoinBaseChainProvider](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider).[getUnspentTransactions](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider#getunspenttransactions)

#### Defined in

[bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts:53](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/esplora/BitcoinEsploraBaseProvider.ts#L53)
