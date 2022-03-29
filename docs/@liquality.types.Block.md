# Interface: Block<BlockType, TransactionType\>

[@liquality/types](../wiki/@liquality.types).Block

## Type parameters

| Name | Type |
| :------ | :------ |
| `BlockType` | `any` |
| `TransactionType` | `any` |

## Table of contents

### Properties

- [\_raw](../wiki/@liquality.types.Block#_raw)
- [difficulty](../wiki/@liquality.types.Block#difficulty)
- [hash](../wiki/@liquality.types.Block#hash)
- [nonce](../wiki/@liquality.types.Block#nonce)
- [number](../wiki/@liquality.types.Block#number)
- [parentHash](../wiki/@liquality.types.Block#parenthash)
- [size](../wiki/@liquality.types.Block#size)
- [timestamp](../wiki/@liquality.types.Block#timestamp)
- [transactions](../wiki/@liquality.types.Block#transactions)

## Properties

### \_raw

• **\_raw**: `BlockType`

#### Defined in

[types/lib/Block.ts:21](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Block.ts#L21)

___

### difficulty

• `Optional` **difficulty**: `number`

#### Defined in

[types/lib/Block.ts:13](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Block.ts#L13)

___

### hash

• **hash**: `string`

#### Defined in

[types/lib/Block.ts:7](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Block.ts#L7)

___

### nonce

• `Optional` **nonce**: `number`

#### Defined in

[types/lib/Block.ts:15](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Block.ts#L15)

___

### number

• **number**: `number`

#### Defined in

[types/lib/Block.ts:5](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Block.ts#L5)

___

### parentHash

• `Optional` **parentHash**: `string`

#### Defined in

[types/lib/Block.ts:11](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Block.ts#L11)

___

### size

• `Optional` **size**: `number`

#### Defined in

[types/lib/Block.ts:17](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Block.ts#L17)

___

### timestamp

• **timestamp**: `number`

#### Defined in

[types/lib/Block.ts:9](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Block.ts#L9)

___

### transactions

• `Optional` **transactions**: [`Transaction`](../wiki/@liquality.types.Transaction)<`TransactionType`\>[]

#### Defined in

[types/lib/Block.ts:19](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Block.ts#L19)
