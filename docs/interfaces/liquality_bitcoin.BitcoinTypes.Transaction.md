[](../README.md) / [Exports](../modules.md) / [@liquality/bitcoin](../modules/liquality_bitcoin.md) / [BitcoinTypes](../modules/liquality_bitcoin.BitcoinTypes.md) / Transaction

# Interface: Transaction

[@liquality/bitcoin](../modules/liquality_bitcoin.md).[BitcoinTypes](../modules/liquality_bitcoin.BitcoinTypes.md).Transaction

## Hierarchy

- **`Transaction`**

  ↳ [`MinedTransaction`](liquality_bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.MinedTransaction.md)

## Table of contents

### Properties

- [confirmations](liquality_bitcoin.BitcoinTypes.Transaction.md#confirmations)
- [hash](liquality_bitcoin.BitcoinTypes.Transaction.md#hash)
- [hex](liquality_bitcoin.BitcoinTypes.Transaction.md#hex)
- [locktime](liquality_bitcoin.BitcoinTypes.Transaction.md#locktime)
- [size](liquality_bitcoin.BitcoinTypes.Transaction.md#size)
- [txid](liquality_bitcoin.BitcoinTypes.Transaction.md#txid)
- [version](liquality_bitcoin.BitcoinTypes.Transaction.md#version)
- [vin](liquality_bitcoin.BitcoinTypes.Transaction.md#vin)
- [vout](liquality_bitcoin.BitcoinTypes.Transaction.md#vout)
- [vsize](liquality_bitcoin.BitcoinTypes.Transaction.md#vsize)
- [weight](liquality_bitcoin.BitcoinTypes.Transaction.md#weight)

## Properties

### confirmations

• `Optional` **confirmations**: `number`

#### Defined in

[bitcoin/lib/types.ts:63](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/types.ts#L63)

___

### hash

• **hash**: `string`

#### Defined in

[bitcoin/lib/types.ts:55](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/types.ts#L55)

___

### hex

• **hex**: `string`

#### Defined in

[bitcoin/lib/types.ts:64](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/types.ts#L64)

___

### locktime

• **locktime**: `number`

#### Defined in

[bitcoin/lib/types.ts:57](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/types.ts#L57)

___

### size

• **size**: `number`

#### Defined in

[bitcoin/lib/types.ts:58](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/types.ts#L58)

___

### txid

• **txid**: `string`

#### Defined in

[bitcoin/lib/types.ts:54](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/types.ts#L54)

___

### version

• **version**: `number`

#### Defined in

[bitcoin/lib/types.ts:56](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/types.ts#L56)

___

### vin

• **vin**: [`Input`](liquality_bitcoin.BitcoinTypes.Input.md)[]

#### Defined in

[bitcoin/lib/types.ts:61](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/types.ts#L61)

___

### vout

• **vout**: [`Output`](liquality_bitcoin.BitcoinTypes.Output.md)[]

#### Defined in

[bitcoin/lib/types.ts:62](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/types.ts#L62)

___

### vsize

• **vsize**: `number`

#### Defined in

[bitcoin/lib/types.ts:59](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/types.ts#L59)

___

### weight

• **weight**: `number`

#### Defined in

[bitcoin/lib/types.ts:60](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/types.ts#L60)
