# Interface: Transaction<TransactionType\>

[@liquality/types](../wiki/@liquality.types).Transaction

## Type parameters

| Name | Type |
| :------ | :------ |
| `TransactionType` | `any` |

## Table of contents

### Properties

- [\_raw](../wiki/@liquality.types.Transaction#_raw)
- [blockHash](../wiki/@liquality.types.Transaction#blockhash)
- [blockNumber](../wiki/@liquality.types.Transaction#blocknumber)
- [confirmations](../wiki/@liquality.types.Transaction#confirmations)
- [data](../wiki/@liquality.types.Transaction#data)
- [fee](../wiki/@liquality.types.Transaction#fee)
- [feeAssetCode](../wiki/@liquality.types.Transaction#feeassetcode)
- [feePrice](../wiki/@liquality.types.Transaction#feeprice)
- [from](../wiki/@liquality.types.Transaction#from)
- [hash](../wiki/@liquality.types.Transaction#hash)
- [logs](../wiki/@liquality.types.Transaction#logs)
- [secret](../wiki/@liquality.types.Transaction#secret)
- [status](../wiki/@liquality.types.Transaction#status)
- [to](../wiki/@liquality.types.Transaction#to)
- [value](../wiki/@liquality.types.Transaction#value)
- [valueAsset](../wiki/@liquality.types.Transaction#valueasset)

## Properties

### \_raw

• **\_raw**: `TransactionType`

#### Defined in

[types/lib/Transaction.ts:35](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Transaction.ts#L35)

___

### blockHash

• `Optional` **blockHash**: `string`

#### Defined in

[types/lib/Transaction.ts:19](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Transaction.ts#L19)

___

### blockNumber

• `Optional` **blockNumber**: `number`

#### Defined in

[types/lib/Transaction.ts:21](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Transaction.ts#L21)

___

### confirmations

• `Optional` **confirmations**: `number`

#### Defined in

[types/lib/Transaction.ts:23](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Transaction.ts#L23)

___

### data

• `Optional` **data**: `string`

#### Defined in

[types/lib/Transaction.ts:25](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Transaction.ts#L25)

___

### fee

• `Optional` **fee**: `number`

#### Defined in

[types/lib/Transaction.ts:31](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Transaction.ts#L31)

___

### feeAssetCode

• `Optional` **feeAssetCode**: `string`

#### Defined in

[types/lib/Transaction.ts:33](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Transaction.ts#L33)

___

### feePrice

• `Optional` **feePrice**: `number`

#### Defined in

[types/lib/Transaction.ts:29](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Transaction.ts#L29)

___

### from

• `Optional` **from**: [`AddressType`](../wiki/@liquality.types#addresstype)

#### Defined in

[types/lib/Transaction.ts:15](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Transaction.ts#L15)

___

### hash

• **hash**: `string`

#### Defined in

[types/lib/Transaction.ts:7](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Transaction.ts#L7)

___

### logs

• `Optional` **logs**: `any`

#### Defined in

[types/lib/Transaction.ts:37](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Transaction.ts#L37)

___

### secret

• `Optional` **secret**: `string`

#### Defined in

[types/lib/Transaction.ts:27](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Transaction.ts#L27)

___

### status

• `Optional` **status**: [`TxStatus`](../wiki/@liquality.types.TxStatus)

#### Defined in

[types/lib/Transaction.ts:17](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Transaction.ts#L17)

___

### to

• `Optional` **to**: [`AddressType`](../wiki/@liquality.types#addresstype)

#### Defined in

[types/lib/Transaction.ts:13](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Transaction.ts#L13)

___

### value

• **value**: `number`

#### Defined in

[types/lib/Transaction.ts:9](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Transaction.ts#L9)

___

### valueAsset

• `Optional` **valueAsset**: `string`

#### Defined in

[types/lib/Transaction.ts:11](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Transaction.ts#L11)
