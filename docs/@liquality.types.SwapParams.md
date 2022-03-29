# Interface: SwapParams

[@liquality/types](../wiki/@liquality.types).SwapParams

## Table of contents

### Properties

- [asset](../wiki/@liquality.types.SwapParams#asset)
- [expiration](../wiki/@liquality.types.SwapParams#expiration)
- [recipientAddress](../wiki/@liquality.types.SwapParams#recipientaddress)
- [refundAddress](../wiki/@liquality.types.SwapParams#refundaddress)
- [secretHash](../wiki/@liquality.types.SwapParams#secrethash)
- [value](../wiki/@liquality.types.SwapParams#value)

## Properties

### asset

• **asset**: [`Asset`](../wiki/@liquality.types.Asset)

#### Defined in

[types/lib/Swap.ts:6](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Swap.ts#L6)

___

### expiration

• **expiration**: `number`

Expiration of the swap

#### Defined in

[types/lib/Swap.ts:26](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Swap.ts#L26)

___

### recipientAddress

• **recipientAddress**: [`AddressType`](../wiki/@liquality.types#addresstype)

Recepient address of the swap

#### Defined in

[types/lib/Swap.ts:14](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Swap.ts#L14)

___

### refundAddress

• **refundAddress**: [`AddressType`](../wiki/@liquality.types#addresstype)

Refund address of the swap

#### Defined in

[types/lib/Swap.ts:18](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Swap.ts#L18)

___

### secretHash

• **secretHash**: `string`

Secret Hash

#### Defined in

[types/lib/Swap.ts:22](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Swap.ts#L22)

___

### value

• **value**: `BigNumber`

The amount of native value locked in the swap

#### Defined in

[types/lib/Swap.ts:10](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Swap.ts#L10)
