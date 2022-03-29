# Class: Fee

[@liquality/client](../wiki/@liquality.client).Fee

## Implements

- `FeeProvider`

## Table of contents

### Constructors

- [constructor](../wiki/@liquality.client.Fee#constructor)

### Properties

- [gasUnits](../wiki/@liquality.client.Fee#gasunits)

### Methods

- [getFees](../wiki/@liquality.client.Fee#getfees)

## Constructors

### constructor

• **new Fee**(`gasUnits?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `gasUnits?` | `BigNumber` |

#### Defined in

[client/lib/Fee.ts:6](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/client/lib/Fee.ts#L6)

## Properties

### gasUnits

• **gasUnits**: `BigNumber`

#### Defined in

[client/lib/Fee.ts:4](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/client/lib/Fee.ts#L4)

## Methods

### getFees

▸ `Abstract` **getFees**(): `Promise`<`FeeDetails`\>

#### Returns

`Promise`<`FeeDetails`\>

#### Implementation of

FeeProvider.getFees

#### Defined in

[client/lib/Fee.ts:10](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/client/lib/Fee.ts#L10)
