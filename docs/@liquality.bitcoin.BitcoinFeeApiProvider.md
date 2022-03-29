# Class: BitcoinFeeApiProvider

[@liquality/bitcoin](../wiki/@liquality.bitcoin).BitcoinFeeApiProvider

## Hierarchy

- `default`

  ↳ **`BitcoinFeeApiProvider`**

## Implements

- `FeeProvider`

## Table of contents

### Constructors

- [constructor](../wiki/@liquality.bitcoin.BitcoinFeeApiProvider#constructor)

### Properties

- [gasUnits](../wiki/@liquality.bitcoin.BitcoinFeeApiProvider#gasunits)

### Methods

- [getFees](../wiki/@liquality.bitcoin.BitcoinFeeApiProvider#getfees)

## Constructors

### constructor

• **new BitcoinFeeApiProvider**(`endpoint?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `endpoint` | `string` | `'https://mempool.space/api/v1/fees/recommended'` |

#### Overrides

Fee.constructor

#### Defined in

[bitcoin/lib/fee/BitcoinFeeApiProvider.ts:7](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/fee/BitcoinFeeApiProvider.ts#L7)

## Properties

### gasUnits

• **gasUnits**: `BigNumber`

#### Inherited from

Fee.gasUnits

#### Defined in

client/dist/lib/Fee.d.ts:3

## Methods

### getFees

▸ **getFees**(): `Promise`<`FeeDetails`\>

#### Returns

`Promise`<`FeeDetails`\>

#### Implementation of

FeeProvider.getFees

#### Overrides

Fee.getFees

#### Defined in

[bitcoin/lib/fee/BitcoinFeeApiProvider.ts:12](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/fee/BitcoinFeeApiProvider.ts#L12)
