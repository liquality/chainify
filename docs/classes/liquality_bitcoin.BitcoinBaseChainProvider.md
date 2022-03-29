[](../README.md) / [Exports](../modules.md) / [@liquality/bitcoin](../modules/liquality_bitcoin.md) / BitcoinBaseChainProvider

# Class: BitcoinBaseChainProvider

[@liquality/bitcoin](../modules/liquality_bitcoin.md).BitcoinBaseChainProvider

## Hierarchy

- **`BitcoinBaseChainProvider`**

  ↳ [`BitcoinEsploraBaseProvider`](liquality_bitcoin.BitcoinEsploraBaseProvider.md)

  ↳ [`BitcoinJsonRpcBaseProvider`](liquality_bitcoin.BitcoinJsonRpcBaseProvider.md)

## Table of contents

### Constructors

- [constructor](liquality_bitcoin.BitcoinBaseChainProvider.md#constructor)

### Methods

- [formatTransaction](liquality_bitcoin.BitcoinBaseChainProvider.md#formattransaction)
- [getAddressTransactionCounts](liquality_bitcoin.BitcoinBaseChainProvider.md#getaddresstransactioncounts)
- [getFeePerByte](liquality_bitcoin.BitcoinBaseChainProvider.md#getfeeperbyte)
- [getMinRelayFee](liquality_bitcoin.BitcoinBaseChainProvider.md#getminrelayfee)
- [getRawTransactionByHash](liquality_bitcoin.BitcoinBaseChainProvider.md#getrawtransactionbyhash)
- [getTransactionHex](liquality_bitcoin.BitcoinBaseChainProvider.md#gettransactionhex)
- [getUnspentTransactions](liquality_bitcoin.BitcoinBaseChainProvider.md#getunspenttransactions)

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

[bitcoin/lib/chain/BitcoinBaseChainProvider.ts:5](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/BitcoinBaseChainProvider.ts#L5)

___

### getAddressTransactionCounts

▸ `Abstract` **getAddressTransactionCounts**(`_addresses`): `Promise`<[`AddressTxCounts`](../modules/liquality_bitcoin.BitcoinTypes.md#addresstxcounts)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_addresses` | `AddressType`[] |

#### Returns

`Promise`<[`AddressTxCounts`](../modules/liquality_bitcoin.BitcoinTypes.md#addresstxcounts)\>

#### Defined in

[bitcoin/lib/chain/BitcoinBaseChainProvider.ts:15](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/BitcoinBaseChainProvider.ts#L15)

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

[bitcoin/lib/chain/BitcoinBaseChainProvider.ts:11](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/BitcoinBaseChainProvider.ts#L11)

___

### getMinRelayFee

▸ `Abstract` **getMinRelayFee**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Defined in

[bitcoin/lib/chain/BitcoinBaseChainProvider.ts:17](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/BitcoinBaseChainProvider.ts#L17)

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

[bitcoin/lib/chain/BitcoinBaseChainProvider.ts:7](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/BitcoinBaseChainProvider.ts#L7)

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

[bitcoin/lib/chain/BitcoinBaseChainProvider.ts:9](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/BitcoinBaseChainProvider.ts#L9)

___

### getUnspentTransactions

▸ `Abstract` **getUnspentTransactions**(`addresses`): `Promise`<[`UTXO`](../interfaces/liquality_bitcoin.BitcoinTypes.UTXO.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `addresses` | `AddressType`[] |

#### Returns

`Promise`<[`UTXO`](../interfaces/liquality_bitcoin.BitcoinTypes.UTXO.md)[]\>

#### Defined in

[bitcoin/lib/chain/BitcoinBaseChainProvider.ts:13](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/BitcoinBaseChainProvider.ts#L13)
