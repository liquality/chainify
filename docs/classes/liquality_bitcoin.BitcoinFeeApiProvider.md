[](../README.md) / [Exports](../modules.md) / [@liquality/bitcoin](../modules/liquality_bitcoin.md) / BitcoinFeeApiProvider

# Class: BitcoinFeeApiProvider

[@liquality/bitcoin](../modules/liquality_bitcoin.md).BitcoinFeeApiProvider

## Hierarchy

- `default`

  ↳ **`BitcoinFeeApiProvider`**

## Implements

- `FeeProvider`

## Table of contents

### Constructors

- [constructor](liquality_bitcoin.BitcoinFeeApiProvider.md#constructor)

### Properties

- [\_httpClient](liquality_bitcoin.BitcoinFeeApiProvider.md#_httpclient)
- [gasUnits](liquality_bitcoin.BitcoinFeeApiProvider.md#gasunits)

### Methods

- [getFees](liquality_bitcoin.BitcoinFeeApiProvider.md#getfees)

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

[bitcoin/lib/fee/BitcoinFeeApiProvider.ts:7](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/fee/BitcoinFeeApiProvider.ts#L7)

## Properties

### \_httpClient

• `Private` **\_httpClient**: `default`

#### Defined in

[bitcoin/lib/fee/BitcoinFeeApiProvider.ts:5](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/fee/BitcoinFeeApiProvider.ts#L5)

___

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

[bitcoin/lib/fee/BitcoinFeeApiProvider.ts:12](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/fee/BitcoinFeeApiProvider.ts#L12)
