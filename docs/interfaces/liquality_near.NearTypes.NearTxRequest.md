[](../README.md) / [Exports](../modules.md) / [@liquality/near](../modules/liquality_near.md) / [NearTypes](../modules/liquality_near.NearTypes.md) / NearTxRequest

# Interface: NearTxRequest

[@liquality/near](../modules/liquality_near.md).[NearTypes](../modules/liquality_near.NearTypes.md).NearTxRequest

## Hierarchy

- `TransactionRequest`

  ↳ **`NearTxRequest`**

## Table of contents

### Properties

- [actions](liquality_near.NearTypes.NearTxRequest.md#actions)
- [asset](liquality_near.NearTypes.NearTxRequest.md#asset)
- [data](liquality_near.NearTypes.NearTxRequest.md#data)
- [fee](liquality_near.NearTypes.NearTxRequest.md#fee)
- [feeAsset](liquality_near.NearTypes.NearTxRequest.md#feeasset)
- [to](liquality_near.NearTypes.NearTxRequest.md#to)
- [value](liquality_near.NearTypes.NearTxRequest.md#value)

## Properties

### actions

• `Optional` **actions**: `Action`[]

#### Defined in

[near/lib/types.ts:46](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/types.ts#L46)

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
