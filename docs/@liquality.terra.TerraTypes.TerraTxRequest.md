# Interface: TerraTxRequest

[@liquality/terra](../wiki/@liquality.terra).[TerraTypes](../wiki/@liquality.terra.TerraTypes).TerraTxRequest

## Hierarchy

- `TransactionRequest`

  ↳ **`TerraTxRequest`**

## Table of contents

### Properties

- [asset](../wiki/@liquality.terra.TerraTypes.TerraTxRequest#asset)
- [data](../wiki/@liquality.terra.TerraTypes.TerraTxRequest#data)
- [fee](../wiki/@liquality.terra.TerraTypes.TerraTxRequest#fee)
- [feeAsset](../wiki/@liquality.terra.TerraTypes.TerraTxRequest#feeasset)
- [memo](../wiki/@liquality.terra.TerraTypes.TerraTxRequest#memo)
- [msgs](../wiki/@liquality.terra.TerraTypes.TerraTxRequest#msgs)
- [to](../wiki/@liquality.terra.TerraTypes.TerraTxRequest#to)
- [value](../wiki/@liquality.terra.TerraTypes.TerraTxRequest#value)

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

[terra/lib/types/index.ts:18](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/terra/lib/types/index.ts#L18)

___

### msgs

• `Optional` **msgs**: `Msg`[]

#### Defined in

[terra/lib/types/index.ts:17](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/terra/lib/types/index.ts#L17)

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
