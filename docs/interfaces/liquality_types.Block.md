[](../README.md) / [Exports](../modules.md) / [@liquality/types](../modules/liquality_types.md) / Block

# Interface: Block<BlockType, TransactionType\>

[@liquality/types](../modules/liquality_types.md).Block

## Type parameters

| Name | Type |
| :------ | :------ |
| `BlockType` | `any` |
| `TransactionType` | `any` |

## Table of contents

### Properties

- [\_raw](liquality_types.Block.md#_raw)
- [difficulty](liquality_types.Block.md#difficulty)
- [hash](liquality_types.Block.md#hash)
- [nonce](liquality_types.Block.md#nonce)
- [number](liquality_types.Block.md#number)
- [parentHash](liquality_types.Block.md#parenthash)
- [size](liquality_types.Block.md#size)
- [timestamp](liquality_types.Block.md#timestamp)
- [transactions](liquality_types.Block.md#transactions)

## Properties

### \_raw

• **\_raw**: `BlockType`

#### Defined in

[types/lib/Block.ts:21](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Block.ts#L21)

___

### difficulty

• `Optional` **difficulty**: `number`

#### Defined in

[types/lib/Block.ts:13](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Block.ts#L13)

___

### hash

• **hash**: `string`

#### Defined in

[types/lib/Block.ts:7](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Block.ts#L7)

___

### nonce

• `Optional` **nonce**: `number`

#### Defined in

[types/lib/Block.ts:15](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Block.ts#L15)

___

### number

• **number**: `number`

#### Defined in

[types/lib/Block.ts:5](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Block.ts#L5)

___

### parentHash

• `Optional` **parentHash**: `string`

#### Defined in

[types/lib/Block.ts:11](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Block.ts#L11)

___

### size

• `Optional` **size**: `number`

#### Defined in

[types/lib/Block.ts:17](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Block.ts#L17)

___

### timestamp

• **timestamp**: `number`

#### Defined in

[types/lib/Block.ts:9](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Block.ts#L9)

___

### transactions

• `Optional` **transactions**: [`Transaction`](liquality_types.Transaction.md)<`TransactionType`\>[]

#### Defined in

[types/lib/Block.ts:19](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Block.ts#L19)
