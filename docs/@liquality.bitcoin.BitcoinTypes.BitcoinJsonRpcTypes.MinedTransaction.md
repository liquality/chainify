# Interface: MinedTransaction

[BitcoinTypes](../wiki/@liquality.bitcoin.BitcoinTypes).[BitcoinJsonRpcTypes](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinJsonRpcTypes).MinedTransaction

## Hierarchy

- [`Transaction`](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction)

  ↳ **`MinedTransaction`**

## Table of contents

### Properties

- [blockhash](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.MinedTransaction#blockhash)
- [blocktime](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.MinedTransaction#blocktime)
- [confirmations](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.MinedTransaction#confirmations)
- [hash](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.MinedTransaction#hash)
- [hex](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.MinedTransaction#hex)
- [locktime](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.MinedTransaction#locktime)
- [number](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.MinedTransaction#number)
- [size](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.MinedTransaction#size)
- [txid](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.MinedTransaction#txid)
- [version](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.MinedTransaction#version)
- [vin](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.MinedTransaction#vin)
- [vout](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.MinedTransaction#vout)
- [vsize](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.MinedTransaction#vsize)
- [weight](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.MinedTransaction#weight)

## Properties

### blockhash

• **blockhash**: `string`

#### Defined in

[bitcoin/lib/chain/jsonRpc/types.ts:28](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/jsonRpc/types.ts#L28)

___

### blocktime

• **blocktime**: `number`

#### Defined in

[bitcoin/lib/chain/jsonRpc/types.ts:30](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/jsonRpc/types.ts#L30)

___

### confirmations

• **confirmations**: `number`

#### Overrides

[Transaction](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction).[confirmations](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction#confirmations)

#### Defined in

[bitcoin/lib/chain/jsonRpc/types.ts:29](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/jsonRpc/types.ts#L29)

___

### hash

• **hash**: `string`

#### Inherited from

[Transaction](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction).[hash](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction#hash)

#### Defined in

[bitcoin/lib/types.ts:55](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/types.ts#L55)

___

### hex

• **hex**: `string`

#### Inherited from

[Transaction](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction).[hex](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction#hex)

#### Defined in

[bitcoin/lib/types.ts:64](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/types.ts#L64)

___

### locktime

• **locktime**: `number`

#### Inherited from

[Transaction](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction).[locktime](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction#locktime)

#### Defined in

[bitcoin/lib/types.ts:57](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/types.ts#L57)

___

### number

• **number**: `number`

#### Defined in

[bitcoin/lib/chain/jsonRpc/types.ts:31](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/jsonRpc/types.ts#L31)

___

### size

• **size**: `number`

#### Inherited from

[Transaction](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction).[size](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction#size)

#### Defined in

[bitcoin/lib/types.ts:58](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/types.ts#L58)

___

### txid

• **txid**: `string`

#### Inherited from

[Transaction](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction).[txid](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction#txid)

#### Defined in

[bitcoin/lib/types.ts:54](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/types.ts#L54)

___

### version

• **version**: `number`

#### Inherited from

[Transaction](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction).[version](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction#version)

#### Defined in

[bitcoin/lib/types.ts:56](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/types.ts#L56)

___

### vin

• **vin**: [`Input`](../wiki/@liquality.bitcoin.BitcoinTypes.Input)[]

#### Inherited from

[Transaction](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction).[vin](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction#vin)

#### Defined in

[bitcoin/lib/types.ts:61](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/types.ts#L61)

___

### vout

• **vout**: [`Output`](../wiki/@liquality.bitcoin.BitcoinTypes.Output)[]

#### Inherited from

[Transaction](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction).[vout](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction#vout)

#### Defined in

[bitcoin/lib/types.ts:62](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/types.ts#L62)

___

### vsize

• **vsize**: `number`

#### Inherited from

[Transaction](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction).[vsize](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction#vsize)

#### Defined in

[bitcoin/lib/types.ts:59](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/types.ts#L59)

___

### weight

• **weight**: `number`

#### Inherited from

[Transaction](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction).[weight](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction#weight)

#### Defined in

[bitcoin/lib/types.ts:60](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/types.ts#L60)
