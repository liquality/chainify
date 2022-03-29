# Class: EIP1559FeeProvider

[@liquality/evm](../wiki/@liquality.evm).EIP1559FeeProvider

## Hierarchy

- `default`

  ↳ **`EIP1559FeeProvider`**

## Table of contents

### Constructors

- [constructor](../wiki/@liquality.evm.EIP1559FeeProvider#constructor)

### Properties

- [gasUnits](../wiki/@liquality.evm.EIP1559FeeProvider#gasunits)
- [provider](../wiki/@liquality.evm.EIP1559FeeProvider#provider)

### Methods

- [calculateMaxFeePerGas](../wiki/@liquality.evm.EIP1559FeeProvider#calculatemaxfeepergas)
- [getBaseFeeMultiplier](../wiki/@liquality.evm.EIP1559FeeProvider#getbasefeemultiplier)
- [getFees](../wiki/@liquality.evm.EIP1559FeeProvider#getfees)

## Constructors

### constructor

• **new EIP1559FeeProvider**(`provider`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `provider` | `StaticJsonRpcProvider` |

#### Overrides

Fee.constructor

#### Defined in

[evm/lib/fee/EIP1559FeeProvider.ts:10](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/fee/EIP1559FeeProvider.ts#L10)

## Properties

### gasUnits

• **gasUnits**: `BigNumber`

#### Inherited from

Fee.gasUnits

#### Defined in

client/dist/lib/Fee.d.ts:3

___

### provider

• **provider**: `StaticJsonRpcProvider`

#### Defined in

[evm/lib/fee/EIP1559FeeProvider.ts:8](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/fee/EIP1559FeeProvider.ts#L8)

## Methods

### calculateMaxFeePerGas

▸ **calculateMaxFeePerGas**(`maxPriorityFeePerGas`, `potentialMaxFee`): `BigNumber`

#### Parameters

| Name | Type |
| :------ | :------ |
| `maxPriorityFeePerGas` | `BigNumber` |
| `potentialMaxFee` | `BigNumber` |

#### Returns

`BigNumber`

#### Defined in

[evm/lib/fee/EIP1559FeeProvider.ts:28](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/fee/EIP1559FeeProvider.ts#L28)

___

### getBaseFeeMultiplier

▸ **getBaseFeeMultiplier**(`baseFeeTrend`): ``1.6`` \| ``1.4`` \| ``1.2`` \| ``1.1``

#### Parameters

| Name | Type |
| :------ | :------ |
| `baseFeeTrend` | `number` |

#### Returns

``1.6`` \| ``1.4`` \| ``1.2`` \| ``1.1``

#### Defined in

[evm/lib/fee/EIP1559FeeProvider.ts:15](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/fee/EIP1559FeeProvider.ts#L15)

___

### getFees

▸ **getFees**(): `Promise`<`FeeDetails`\>

#### Returns

`Promise`<`FeeDetails`\>

#### Overrides

Fee.getFees

#### Defined in

[evm/lib/fee/EIP1559FeeProvider.ts:32](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/fee/EIP1559FeeProvider.ts#L32)
