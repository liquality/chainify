# Class: BitcoinBaseChainProvider

[@liquality/bitcoin](../wiki/@liquality.bitcoin).BitcoinBaseChainProvider

## Hierarchy

- **`BitcoinBaseChainProvider`**

  ↳ [`BitcoinEsploraBaseProvider`](../wiki/@liquality.bitcoin.BitcoinEsploraBaseProvider)

  ↳ [`BitcoinJsonRpcBaseProvider`](../wiki/@liquality.bitcoin.BitcoinJsonRpcBaseProvider)

## Table of contents

### Constructors

- [constructor](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider#constructor)

### Methods

- [formatTransaction](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider#formattransaction)
- [getAddressTransactionCounts](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider#getaddresstransactioncounts)
- [getFeePerByte](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider#getfeeperbyte)
- [getMinRelayFee](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider#getminrelayfee)
- [getRawTransactionByHash](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider#getrawtransactionbyhash)
- [getTransactionHex](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider#gettransactionhex)
- [getUnspentTransactions](../wiki/@liquality.bitcoin.BitcoinBaseChainProvider#getunspenttransactions)

## Constructors

### constructor

• **new BitcoinBaseChainProvider**()

## Methods

### formatTransaction

▸ `Abstract` **formatTransaction**(`tx`, `currentHeight`): `Promise`<`Transaction`<`any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | `any` |
| `currentHeight` | `number` |

#### Returns

`Promise`<`Transaction`<`any`\>\>

#### Defined in

[bitcoin/lib/chain/BitcoinBaseChainProvider.ts:5](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/BitcoinBaseChainProvider.ts#L5)

___

### getAddressTransactionCounts

▸ `Abstract` **getAddressTransactionCounts**(`_addresses`): `Promise`<[`AddressTxCounts`](../wiki/@liquality.bitcoin.BitcoinTypes#addresstxcounts)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_addresses` | `AddressType`[] |

#### Returns

`Promise`<[`AddressTxCounts`](../wiki/@liquality.bitcoin.BitcoinTypes#addresstxcounts)\>

#### Defined in

[bitcoin/lib/chain/BitcoinBaseChainProvider.ts:15](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/BitcoinBaseChainProvider.ts#L15)

___

### getFeePerByte

▸ `Abstract` **getFeePerByte**(`numberOfBlocks?`): `Promise`<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `numberOfBlocks?` | `number` |

#### Returns

`Promise`<`number`\>

#### Defined in

[bitcoin/lib/chain/BitcoinBaseChainProvider.ts:11](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/BitcoinBaseChainProvider.ts#L11)

___

### getMinRelayFee

▸ `Abstract` **getMinRelayFee**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Defined in

[bitcoin/lib/chain/BitcoinBaseChainProvider.ts:17](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/BitcoinBaseChainProvider.ts#L17)

___

### getRawTransactionByHash

▸ `Abstract` **getRawTransactionByHash**(`transactionHash`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionHash` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

[bitcoin/lib/chain/BitcoinBaseChainProvider.ts:7](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/BitcoinBaseChainProvider.ts#L7)

___

### getTransactionHex

▸ `Abstract` **getTransactionHex**(`transactionHash`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionHash` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

[bitcoin/lib/chain/BitcoinBaseChainProvider.ts:9](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/BitcoinBaseChainProvider.ts#L9)

___

### getUnspentTransactions

▸ `Abstract` **getUnspentTransactions**(`addresses`): `Promise`<[`UTXO`](../wiki/@liquality.bitcoin.BitcoinTypes.UTXO)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `addresses` | `AddressType`[] |

#### Returns

`Promise`<[`UTXO`](../wiki/@liquality.bitcoin.BitcoinTypes.UTXO)[]\>

#### Defined in

[bitcoin/lib/chain/BitcoinBaseChainProvider.ts:13](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/BitcoinBaseChainProvider.ts#L13)
