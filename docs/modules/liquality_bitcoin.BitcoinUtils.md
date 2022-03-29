[](../README.md) / [Exports](../modules.md) / [@liquality/bitcoin](liquality_bitcoin.md) / BitcoinUtils

# Namespace: BitcoinUtils

[@liquality/bitcoin](liquality_bitcoin.md).BitcoinUtils

## Table of contents

### Type aliases

- [CoinSelectTarget](liquality_bitcoin.BitcoinUtils.md#coinselecttarget)

### Variables

- [AddressTypes](liquality_bitcoin.BitcoinUtils.md#addresstypes)

### Functions

- [calculateFee](liquality_bitcoin.BitcoinUtils.md#calculatefee)
- [compressPubKey](liquality_bitcoin.BitcoinUtils.md#compresspubkey)
- [decodeRawTransaction](liquality_bitcoin.BitcoinUtils.md#decoderawtransaction)
- [getAddressNetwork](liquality_bitcoin.BitcoinUtils.md#getaddressnetwork)
- [getPubKeyHash](liquality_bitcoin.BitcoinUtils.md#getpubkeyhash)
- [normalizeTransactionObject](liquality_bitcoin.BitcoinUtils.md#normalizetransactionobject)
- [selectCoins](liquality_bitcoin.BitcoinUtils.md#selectcoins)
- [validateAddress](liquality_bitcoin.BitcoinUtils.md#validateaddress)
- [witnessStackToScriptWitness](liquality_bitcoin.BitcoinUtils.md#witnessstacktoscriptwitness)

## Type aliases

### CoinSelectTarget

Ƭ **CoinSelectTarget**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `id?` | `string` |
| `script?` | `Buffer` |
| `value` | `number` |

#### Defined in

[bitcoin/lib/utils.ts:56](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/utils.ts#L56)

## Variables

### AddressTypes

• `Const` **AddressTypes**: `string`[]

#### Defined in

[bitcoin/lib/utils.ts:14](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/utils.ts#L14)

## Functions

### calculateFee

▸ **calculateFee**(`numInputs`, `numOutputs`, `feePerByte`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `numInputs` | `number` |
| `numOutputs` | `number` |
| `feePerByte` | `number` |

#### Returns

`number`

#### Defined in

[bitcoin/lib/utils.ts:16](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/utils.ts#L16)

___

### compressPubKey

▸ **compressPubKey**(`pubKey`): `string`

Get compressed pubKey from pubKey.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pubKey` | `string` | 65 byte string with prefix, x, y. |

#### Returns

`string`

Returns the compressed pubKey of uncompressed pubKey.

#### Defined in

[bitcoin/lib/utils.ts:25](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/utils.ts#L25)

___

### decodeRawTransaction

▸ **decodeRawTransaction**(`hex`, `network`): [`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `hex` | `string` |
| `network` | [`BitcoinNetwork`](../interfaces/liquality_bitcoin.BitcoinTypes.BitcoinNetwork.md) |

#### Returns

[`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)

#### Defined in

[bitcoin/lib/utils.ts:100](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/utils.ts#L100)

___

### getAddressNetwork

▸ **getAddressNetwork**(`address`): [`BitcoinNetwork`](../interfaces/liquality_bitcoin.BitcoinTypes.BitcoinNetwork.md)

Get a network object from an address

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | The bitcoin address |

#### Returns

[`BitcoinNetwork`](../interfaces/liquality_bitcoin.BitcoinTypes.BitcoinNetwork.md)

#### Defined in

[bitcoin/lib/utils.ts:39](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/utils.ts#L39)

___

### getPubKeyHash

▸ **getPubKeyHash**(`address`, `network`): `Buffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `network` | [`BitcoinNetwork`](../interfaces/liquality_bitcoin.BitcoinTypes.BitcoinNetwork.md) |

#### Returns

`Buffer`

#### Defined in

[bitcoin/lib/utils.ts:220](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/utils.ts#L220)

___

### normalizeTransactionObject

▸ **normalizeTransactionObject**(`tx`, `fee`, `block?`): `Transaction`<[`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | [`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md) |
| `fee` | `number` |
| `block?` | `Object` |
| `block.hash` | `string` |
| `block.number` | `number` |

#### Returns

`Transaction`<[`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)\>

#### Defined in

[bitcoin/lib/utils.ts:155](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/utils.ts#L155)

___

### selectCoins

▸ **selectCoins**(`utxos`, `targets`, `feePerByte`, `fixedInputs?`): `Object`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `utxos` | [`UTXO`](../interfaces/liquality_bitcoin.BitcoinTypes.UTXO.md)[] | `undefined` |
| `targets` | [`CoinSelectTarget`](liquality_bitcoin.BitcoinUtils.md#coinselecttarget)[] | `undefined` |
| `feePerByte` | `number` | `undefined` |
| `fixedInputs` | [`UTXO`](../interfaces/liquality_bitcoin.BitcoinTypes.UTXO.md)[] | `[]` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `change` | [`CoinSelectTarget`](liquality_bitcoin.BitcoinUtils.md#coinselecttarget) |
| `fee` | `number` |
| `inputs` | [`UTXO`](../interfaces/liquality_bitcoin.BitcoinTypes.UTXO.md)[] |
| `outputs` | [`CoinSelectTarget`](liquality_bitcoin.BitcoinUtils.md#coinselecttarget)[] |

#### Defined in

[bitcoin/lib/utils.ts:71](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/utils.ts#L71)

___

### validateAddress

▸ **validateAddress**(`_address`, `network`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `_address` | `AddressType` |
| `network` | [`BitcoinNetwork`](../interfaces/liquality_bitcoin.BitcoinTypes.BitcoinNetwork.md) |

#### Returns

`void`

#### Defined in

[bitcoin/lib/utils.ts:236](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/utils.ts#L236)

___

### witnessStackToScriptWitness

▸ **witnessStackToScriptWitness**(`witness`): `Buffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `witness` | `Buffer`[] |

#### Returns

`Buffer`

#### Defined in

[bitcoin/lib/utils.ts:190](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/utils.ts#L190)
