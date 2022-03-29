[](../README.md) / [Exports](../modules.md) / [@liquality/terra](../modules/liquality_terra.md) / [TerraTypes](../modules/liquality_terra.TerraTypes.md) / TerraTxRequest

# Interface: TerraTxRequest

[@liquality/terra](../modules/liquality_terra.md).[TerraTypes](../modules/liquality_terra.TerraTypes.md).TerraTxRequest

## Hierarchy

- `TransactionRequest`

  ↳ **`TerraTxRequest`**

## Table of contents

### Properties

- [asset](liquality_terra.TerraTypes.TerraTxRequest.md#asset)
- [data](liquality_terra.TerraTypes.TerraTxRequest.md#data)
- [fee](liquality_terra.TerraTypes.TerraTxRequest.md#fee)
- [feeAsset](liquality_terra.TerraTypes.TerraTxRequest.md#feeasset)
- [memo](liquality_terra.TerraTypes.TerraTxRequest.md#memo)
- [msgs](liquality_terra.TerraTypes.TerraTxRequest.md#msgs)
- [to](liquality_terra.TerraTypes.TerraTxRequest.md#to)
- [value](liquality_terra.TerraTypes.TerraTxRequest.md#value)

## Properties

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

### memo

• `Optional` **memo**: `string`

#### Defined in

[terra/lib/types/index.ts:18](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/types/index.ts#L18)

___

### msgs

• `Optional` **msgs**: `Msg`[]

#### Defined in

[terra/lib/types/index.ts:17](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/terra/lib/types/index.ts#L17)

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
