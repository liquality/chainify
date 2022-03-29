[](../README.md) / [Exports](../modules.md) / [@liquality/types](../modules/liquality_types.md) / SwapParams

# Interface: SwapParams

[@liquality/types](../modules/liquality_types.md).SwapParams

## Table of contents

### Properties

- [asset](liquality_types.SwapParams.md#asset)
- [expiration](liquality_types.SwapParams.md#expiration)
- [recipientAddress](liquality_types.SwapParams.md#recipientaddress)
- [refundAddress](liquality_types.SwapParams.md#refundaddress)
- [secretHash](liquality_types.SwapParams.md#secrethash)
- [value](liquality_types.SwapParams.md#value)

## Properties

### asset

• **asset**: [`Asset`](liquality_types.Asset.md)

#### Defined in

[types/lib/Swap.ts:6](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Swap.ts#L6)

___

### expiration

• **expiration**: `number`

Expiration of the swap

#### Defined in

[types/lib/Swap.ts:26](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Swap.ts#L26)

___

### recipientAddress

• **recipientAddress**: [`AddressType`](../modules/liquality_types.md#addresstype)

Recepient address of the swap

#### Defined in

[types/lib/Swap.ts:14](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Swap.ts#L14)

___

### refundAddress

• **refundAddress**: [`AddressType`](../modules/liquality_types.md#addresstype)

Refund address of the swap

#### Defined in

[types/lib/Swap.ts:18](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Swap.ts#L18)

___

### secretHash

• **secretHash**: `string`

Secret Hash

#### Defined in

[types/lib/Swap.ts:22](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Swap.ts#L22)

___

### value

• **value**: `BigNumber`

The amount of native value locked in the swap

#### Defined in

[types/lib/Swap.ts:10](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Swap.ts#L10)
