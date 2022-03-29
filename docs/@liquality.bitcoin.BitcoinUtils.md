# Namespace: BitcoinUtils

[@liquality/bitcoin](../wiki/@liquality.bitcoin).BitcoinUtils

## Table of contents

### Type aliases

- [CoinSelectTarget](../wiki/@liquality.bitcoin.BitcoinUtils#coinselecttarget)

### Variables

- [AddressTypes](../wiki/@liquality.bitcoin.BitcoinUtils#addresstypes)

### Functions

- [calculateFee](../wiki/@liquality.bitcoin.BitcoinUtils#calculatefee)
- [compressPubKey](../wiki/@liquality.bitcoin.BitcoinUtils#compresspubkey)
- [decodeRawTransaction](../wiki/@liquality.bitcoin.BitcoinUtils#decoderawtransaction)
- [getAddressNetwork](../wiki/@liquality.bitcoin.BitcoinUtils#getaddressnetwork)
- [getPubKeyHash](../wiki/@liquality.bitcoin.BitcoinUtils#getpubkeyhash)
- [normalizeTransactionObject](../wiki/@liquality.bitcoin.BitcoinUtils#normalizetransactionobject)
- [selectCoins](../wiki/@liquality.bitcoin.BitcoinUtils#selectcoins)
- [validateAddress](../wiki/@liquality.bitcoin.BitcoinUtils#validateaddress)
- [witnessStackToScriptWitness](../wiki/@liquality.bitcoin.BitcoinUtils#witnessstacktoscriptwitness)

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

[bitcoin/lib/utils.ts:56](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/utils.ts#L56)

## Variables

### AddressTypes

• `Const` **AddressTypes**: `string`[]

#### Defined in

[bitcoin/lib/utils.ts:14](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/utils.ts#L14)

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

[bitcoin/lib/utils.ts:16](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/utils.ts#L16)

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

[bitcoin/lib/utils.ts:25](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/utils.ts#L25)

___

### decodeRawTransaction

▸ **decodeRawTransaction**(`hex`, `network`): [`Transaction`](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction)

#### Parameters

| Name | Type |
| :------ | :------ |
| `hex` | `string` |
| `network` | [`BitcoinNetwork`](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinNetwork) |

#### Returns

[`Transaction`](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction)

#### Defined in

[bitcoin/lib/utils.ts:100](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/utils.ts#L100)

___

### getAddressNetwork

▸ **getAddressNetwork**(`address`): [`BitcoinNetwork`](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinNetwork)

Get a network object from an address

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | The bitcoin address |

#### Returns

[`BitcoinNetwork`](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinNetwork)

#### Defined in

[bitcoin/lib/utils.ts:39](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/utils.ts#L39)

___

### getPubKeyHash

▸ **getPubKeyHash**(`address`, `network`): `Buffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `network` | [`BitcoinNetwork`](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinNetwork) |

#### Returns

`Buffer`

#### Defined in

[bitcoin/lib/utils.ts:220](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/utils.ts#L220)

___

### normalizeTransactionObject

▸ **normalizeTransactionObject**(`tx`, `fee`, `block?`): `Transaction`<[`Transaction`](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | [`Transaction`](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction) |
| `fee` | `number` |
| `block?` | `Object` |
| `block.hash` | `string` |
| `block.number` | `number` |

#### Returns

`Transaction`<[`Transaction`](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction)\>

#### Defined in

[bitcoin/lib/utils.ts:155](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/utils.ts#L155)

___

### selectCoins

▸ **selectCoins**(`utxos`, `targets`, `feePerByte`, `fixedInputs?`): `Object`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `utxos` | [`UTXO`](../wiki/@liquality.bitcoin.BitcoinTypes.UTXO)[] | `undefined` |
| `targets` | [`CoinSelectTarget`](../wiki/@liquality.bitcoin.BitcoinUtils#coinselecttarget)[] | `undefined` |
| `feePerByte` | `number` | `undefined` |
| `fixedInputs` | [`UTXO`](../wiki/@liquality.bitcoin.BitcoinTypes.UTXO)[] | `[]` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `change` | [`CoinSelectTarget`](../wiki/@liquality.bitcoin.BitcoinUtils#coinselecttarget) |
| `fee` | `number` |
| `inputs` | [`UTXO`](../wiki/@liquality.bitcoin.BitcoinTypes.UTXO)[] |
| `outputs` | [`CoinSelectTarget`](../wiki/@liquality.bitcoin.BitcoinUtils#coinselecttarget)[] |

#### Defined in

[bitcoin/lib/utils.ts:71](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/utils.ts#L71)

___

### validateAddress

▸ **validateAddress**(`_address`, `network`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `_address` | `AddressType` |
| `network` | [`BitcoinNetwork`](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinNetwork) |

#### Returns

`void`

#### Defined in

[bitcoin/lib/utils.ts:236](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/utils.ts#L236)

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

[bitcoin/lib/utils.ts:190](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/utils.ts#L190)
