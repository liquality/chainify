[](../README.md) / [Exports](../modules.md) / [@liquality/types](../modules/liquality_types.md) / Transaction

# Interface: Transaction<TransactionType\>

[@liquality/types](../modules/liquality_types.md).Transaction

## Type parameters

| Name | Type |
| :------ | :------ |
| `TransactionType` | `any` |

## Table of contents

### Properties

- [\_raw](liquality_types.Transaction.md#_raw)
- [blockHash](liquality_types.Transaction.md#blockhash)
- [blockNumber](liquality_types.Transaction.md#blocknumber)
- [confirmations](liquality_types.Transaction.md#confirmations)
- [data](liquality_types.Transaction.md#data)
- [fee](liquality_types.Transaction.md#fee)
- [feeAssetCode](liquality_types.Transaction.md#feeassetcode)
- [feePrice](liquality_types.Transaction.md#feeprice)
- [from](liquality_types.Transaction.md#from)
- [hash](liquality_types.Transaction.md#hash)
- [logs](liquality_types.Transaction.md#logs)
- [secret](liquality_types.Transaction.md#secret)
- [status](liquality_types.Transaction.md#status)
- [to](liquality_types.Transaction.md#to)
- [value](liquality_types.Transaction.md#value)
- [valueAsset](liquality_types.Transaction.md#valueasset)

## Properties

### \_raw

• **\_raw**: `TransactionType`

#### Defined in

[types/lib/Transaction.ts:35](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Transaction.ts#L35)

___

### blockHash

• `Optional` **blockHash**: `string`

#### Defined in

[types/lib/Transaction.ts:19](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Transaction.ts#L19)

___

### blockNumber

• `Optional` **blockNumber**: `number`

#### Defined in

[types/lib/Transaction.ts:21](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Transaction.ts#L21)

___

### confirmations

• `Optional` **confirmations**: `number`

#### Defined in

[types/lib/Transaction.ts:23](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Transaction.ts#L23)

___

### data

• `Optional` **data**: `string`

#### Defined in

[types/lib/Transaction.ts:25](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Transaction.ts#L25)

___

### fee

• `Optional` **fee**: `number`

#### Defined in

[types/lib/Transaction.ts:31](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Transaction.ts#L31)

___

### feeAssetCode

• `Optional` **feeAssetCode**: `string`

#### Defined in

[types/lib/Transaction.ts:33](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Transaction.ts#L33)

___

### feePrice

• `Optional` **feePrice**: `number`

#### Defined in

[types/lib/Transaction.ts:29](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Transaction.ts#L29)

___

### from

• `Optional` **from**: [`AddressType`](../modules/liquality_types.md#addresstype)

#### Defined in

[types/lib/Transaction.ts:15](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Transaction.ts#L15)

___

### hash

• **hash**: `string`

#### Defined in

[types/lib/Transaction.ts:7](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Transaction.ts#L7)

___

### logs

• `Optional` **logs**: `any`

#### Defined in

[types/lib/Transaction.ts:37](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Transaction.ts#L37)

___

### secret

• `Optional` **secret**: `string`

#### Defined in

[types/lib/Transaction.ts:27](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Transaction.ts#L27)

___

### status

• `Optional` **status**: [`TxStatus`](../enums/liquality_types.TxStatus.md)

#### Defined in

[types/lib/Transaction.ts:17](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Transaction.ts#L17)

___

### to

• `Optional` **to**: [`AddressType`](../modules/liquality_types.md#addresstype)

#### Defined in

[types/lib/Transaction.ts:13](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Transaction.ts#L13)

___

### value

• **value**: `number`

#### Defined in

[types/lib/Transaction.ts:9](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Transaction.ts#L9)

___

### valueAsset

• `Optional` **valueAsset**: `string`

#### Defined in

[types/lib/Transaction.ts:11](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Transaction.ts#L11)
