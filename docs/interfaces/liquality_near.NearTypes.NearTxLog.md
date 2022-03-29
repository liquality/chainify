[](../README.md) / [Exports](../modules.md) / [@liquality/near](../modules/liquality_near.md) / [NearTypes](../modules/liquality_near.NearTypes.md) / NearTxLog

# Interface: NearTxLog

[@liquality/near](../modules/liquality_near.md).[NearTypes](../modules/liquality_near.NearTypes.md).NearTxLog

## Table of contents

### Properties

- [blockHash](liquality_near.NearTypes.NearTxLog.md#blockhash)
- [code](liquality_near.NearTypes.NearTxLog.md#code)
- [hash](liquality_near.NearTypes.NearTxLog.md#hash)
- [htlc](liquality_near.NearTypes.NearTxLog.md#htlc)
- [receiver](liquality_near.NearTypes.NearTxLog.md#receiver)
- [sender](liquality_near.NearTypes.NearTxLog.md#sender)
- [value](liquality_near.NearTypes.NearTxLog.md#value)

## Properties

### blockHash

• **blockHash**: `string`

#### Defined in

[near/lib/types.ts:33](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/types.ts#L33)

___

### code

• `Optional` **code**: `string`

#### Defined in

[near/lib/types.ts:34](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/types.ts#L34)

___

### hash

• **hash**: `string`

#### Defined in

[near/lib/types.ts:30](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/types.ts#L30)

___

### htlc

• `Optional` **htlc**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `expiration?` | `number` |
| `method` | `string` |
| `recipient?` | `string` |
| `secret?` | `string` |
| `secretHash?` | `string` |

#### Defined in

[near/lib/types.ts:36](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/types.ts#L36)

___

### receiver

• **receiver**: `string`

#### Defined in

[near/lib/types.ts:32](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/types.ts#L32)

___

### sender

• **sender**: `string`

#### Defined in

[near/lib/types.ts:31](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/types.ts#L31)

___

### value

• `Optional` **value**: `number`

#### Defined in

[near/lib/types.ts:35](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/types.ts#L35)
