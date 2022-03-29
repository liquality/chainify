# Interface: NearTxRequest

[@liquality/near](../wiki/@liquality.near).[NearTypes](../wiki/@liquality.near.NearTypes).NearTxRequest

## Hierarchy

- `TransactionRequest`

  ↳ **`NearTxRequest`**

## Table of contents

### Properties

- [actions](../wiki/@liquality.near.NearTypes.NearTxRequest#actions)
- [asset](../wiki/@liquality.near.NearTypes.NearTxRequest#asset)
- [data](../wiki/@liquality.near.NearTypes.NearTxRequest#data)
- [fee](../wiki/@liquality.near.NearTypes.NearTxRequest#fee)
- [feeAsset](../wiki/@liquality.near.NearTypes.NearTxRequest#feeasset)
- [to](../wiki/@liquality.near.NearTypes.NearTxRequest#to)
- [value](../wiki/@liquality.near.NearTypes.NearTxRequest#value)

## Properties

### actions

• `Optional` **actions**: `Action`[]

#### Defined in

[near/lib/types.ts:46](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/types.ts#L46)

___

### asset

• `Optional` **asset**: `Asset`

#### Inherited from

TransactionRequest.asset

#### Defined in

types/dist/lib/Transaction.d.ts:29

___

### data

• `Optional` **data**: `string`

#### Inherited from

TransactionRequest.data

#### Defined in

types/dist/lib/Transaction.d.ts:32

___

### fee

• `Optional` **fee**: `FeeType`

#### Inherited from

TransactionRequest.fee

#### Defined in

types/dist/lib/Transaction.d.ts:34

___

### feeAsset

• `Optional` **feeAsset**: `Asset`

#### Inherited from

TransactionRequest.feeAsset

#### Defined in

types/dist/lib/Transaction.d.ts:30

___

### to

• `Optional` **to**: `AddressType`

#### Inherited from

TransactionRequest.to

#### Defined in

types/dist/lib/Transaction.d.ts:31

___

### value

• `Optional` **value**: `BigNumber`

#### Inherited from

TransactionRequest.value

#### Defined in

types/dist/lib/Transaction.d.ts:33
