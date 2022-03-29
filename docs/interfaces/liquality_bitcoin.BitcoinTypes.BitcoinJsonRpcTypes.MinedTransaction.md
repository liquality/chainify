[](../README.md) / [Exports](../modules.md) / [@liquality/bitcoin](../modules/liquality_bitcoin.md) / [BitcoinTypes](../modules/liquality_bitcoin.BitcoinTypes.md) / [BitcoinJsonRpcTypes](../modules/liquality_bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.md) / MinedTransaction

# Interface: MinedTransaction

[BitcoinTypes](../modules/liquality_bitcoin.BitcoinTypes.md).[BitcoinJsonRpcTypes](../modules/liquality_bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.md).MinedTransaction

## Hierarchy

- [`Transaction`](liquality_bitcoin.BitcoinTypes.Transaction.md)

  ↳ **`MinedTransaction`**

## Table of contents

### Properties

- [blockhash](liquality_bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.MinedTransaction.md#blockhash)
- [blocktime](liquality_bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.MinedTransaction.md#blocktime)
- [confirmations](liquality_bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.MinedTransaction.md#confirmations)
- [hash](liquality_bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.MinedTransaction.md#hash)
- [hex](liquality_bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.MinedTransaction.md#hex)
- [locktime](liquality_bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.MinedTransaction.md#locktime)
- [number](liquality_bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.MinedTransaction.md#number)
- [size](liquality_bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.MinedTransaction.md#size)
- [txid](liquality_bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.MinedTransaction.md#txid)
- [version](liquality_bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.MinedTransaction.md#version)
- [vin](liquality_bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.MinedTransaction.md#vin)
- [vout](liquality_bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.MinedTransaction.md#vout)
- [vsize](liquality_bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.MinedTransaction.md#vsize)
- [weight](liquality_bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.MinedTransaction.md#weight)

## Properties

### blockhash

• **blockhash**: `string`

#### Defined in

[bitcoin/lib/chain/jsonRpc/types.ts:28](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/jsonRpc/types.ts#L28)

___

### blocktime

• **blocktime**: `number`

#### Defined in

[bitcoin/lib/chain/jsonRpc/types.ts:30](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/jsonRpc/types.ts#L30)

___

### confirmations

• **confirmations**: `number`

#### Overrides

[Transaction](liquality_bitcoin.BitcoinTypes.Transaction.md).[confirmations](liquality_bitcoin.BitcoinTypes.Transaction.md#confirmations)

#### Defined in

[bitcoin/lib/chain/jsonRpc/types.ts:29](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/jsonRpc/types.ts#L29)

___

### hash

• **hash**: `string`

#### Inherited from

[Transaction](liquality_bitcoin.BitcoinTypes.Transaction.md).[hash](liquality_bitcoin.BitcoinTypes.Transaction.md#hash)

#### Defined in

[bitcoin/lib/types.ts:55](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/types.ts#L55)

___

### hex

• **hex**: `string`

#### Inherited from

[Transaction](liquality_bitcoin.BitcoinTypes.Transaction.md).[hex](liquality_bitcoin.BitcoinTypes.Transaction.md#hex)

#### Defined in

[bitcoin/lib/types.ts:64](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/types.ts#L64)

___

### locktime

• **locktime**: `number`

#### Inherited from

[Transaction](liquality_bitcoin.BitcoinTypes.Transaction.md).[locktime](liquality_bitcoin.BitcoinTypes.Transaction.md#locktime)

#### Defined in

[bitcoin/lib/types.ts:57](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/types.ts#L57)

___

### number

• **number**: `number`

#### Defined in

[bitcoin/lib/chain/jsonRpc/types.ts:31](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/jsonRpc/types.ts#L31)

___

### size

• **size**: `number`

#### Inherited from

[Transaction](liquality_bitcoin.BitcoinTypes.Transaction.md).[size](liquality_bitcoin.BitcoinTypes.Transaction.md#size)

#### Defined in

[bitcoin/lib/types.ts:58](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/types.ts#L58)

___

### txid

• **txid**: `string`

#### Inherited from

[Transaction](liquality_bitcoin.BitcoinTypes.Transaction.md).[txid](liquality_bitcoin.BitcoinTypes.Transaction.md#txid)

#### Defined in

[bitcoin/lib/types.ts:54](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/types.ts#L54)

___

### version

• **version**: `number`

#### Inherited from

[Transaction](liquality_bitcoin.BitcoinTypes.Transaction.md).[version](liquality_bitcoin.BitcoinTypes.Transaction.md#version)

#### Defined in

[bitcoin/lib/types.ts:56](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/types.ts#L56)

___

### vin

• **vin**: [`Input`](liquality_bitcoin.BitcoinTypes.Input.md)[]

#### Inherited from

[Transaction](liquality_bitcoin.BitcoinTypes.Transaction.md).[vin](liquality_bitcoin.BitcoinTypes.Transaction.md#vin)

#### Defined in

[bitcoin/lib/types.ts:61](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/types.ts#L61)

___

### vout

• **vout**: [`Output`](liquality_bitcoin.BitcoinTypes.Output.md)[]

#### Inherited from

[Transaction](liquality_bitcoin.BitcoinTypes.Transaction.md).[vout](liquality_bitcoin.BitcoinTypes.Transaction.md#vout)

#### Defined in

[bitcoin/lib/types.ts:62](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/types.ts#L62)

___

### vsize

• **vsize**: `number`

#### Inherited from

[Transaction](liquality_bitcoin.BitcoinTypes.Transaction.md).[vsize](liquality_bitcoin.BitcoinTypes.Transaction.md#vsize)

#### Defined in

[bitcoin/lib/types.ts:59](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/types.ts#L59)

___

### weight

• **weight**: `number`

#### Inherited from

[Transaction](liquality_bitcoin.BitcoinTypes.Transaction.md).[weight](liquality_bitcoin.BitcoinTypes.Transaction.md#weight)

#### Defined in

[bitcoin/lib/types.ts:60](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/types.ts#L60)
