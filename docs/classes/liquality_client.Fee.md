[](../README.md) / [Exports](../modules.md) / [@liquality/client](../modules/liquality_client.md) / Fee

# Class: Fee

[@liquality/client](../modules/liquality_client.md).Fee

## Implements

- `FeeProvider`

## Table of contents

### Constructors

- [constructor](liquality_client.Fee.md#constructor)

### Properties

- [gasUnits](liquality_client.Fee.md#gasunits)

### Methods

- [getFees](liquality_client.Fee.md#getfees)

## Constructors

### constructor

• **new Fee**(`gasUnits?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `gasUnits?` | `BigNumber` |

#### Defined in

[client/lib/Fee.ts:6](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Fee.ts#L6)

## Properties

### gasUnits

• **gasUnits**: `BigNumber`

#### Defined in

[client/lib/Fee.ts:4](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Fee.ts#L4)

## Methods

### getFees

▸ `Abstract` **getFees**(): `Promise`<`FeeDetails`\>

#### Returns

`Promise`<`FeeDetails`\>

#### Implementation of

FeeProvider.getFees

#### Defined in

[client/lib/Fee.ts:10](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Fee.ts#L10)
