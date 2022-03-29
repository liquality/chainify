[](../README.md) / [Exports](../modules.md) / @liquality/types

# Module: @liquality/types

## Table of contents

### Enumerations

- [ChainId](../enums/liquality_types.ChainId.md)
- [TxStatus](../enums/liquality_types.TxStatus.md)

### Classes

- [Address](../classes/liquality_types.Address.md)

### Interfaces

- [Asset](../interfaces/liquality_types.Asset.md)
- [Block](../interfaces/liquality_types.Block.md)
- [ChainProvider](../interfaces/liquality_types.ChainProvider.md)
- [EIP1559Fee](../interfaces/liquality_types.EIP1559Fee.md)
- [FeeDetail](../interfaces/liquality_types.FeeDetail.md)
- [FeeDetails](../interfaces/liquality_types.FeeDetails.md)
- [FeeProvider](../interfaces/liquality_types.FeeProvider.md)
- [Network](../interfaces/liquality_types.Network.md)
- [SwapParams](../interfaces/liquality_types.SwapParams.md)
- [SwapProvider](../interfaces/liquality_types.SwapProvider.md)
- [Transaction](../interfaces/liquality_types.Transaction.md)
- [WalletOptions](../interfaces/liquality_types.WalletOptions.md)
- [WalletProvider](../interfaces/liquality_types.WalletProvider.md)

### Type aliases

- [AddressType](liquality_types.md#addresstype)
- [AssetType](liquality_types.md#assettype)
- [BigNumberish](liquality_types.md#bignumberish)
- [FeeType](liquality_types.md#feetype)
- [TransactionRequest](liquality_types.md#transactionrequest)

## Type aliases

### AddressType

Ƭ **AddressType**: [`Address`](../classes/liquality_types.Address.md) \| `string`

#### Defined in

[types/lib/Address.ts:18](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Address.ts#L18)

___

### AssetType

Ƭ **AssetType**: ``"native"`` \| ``"erc20"``

#### Defined in

[types/lib/Asset.ts:15](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Asset.ts#L15)

___

### BigNumberish

Ƭ **BigNumberish**: `string` \| `number` \| `EthersBigNumberish` \| `BigNumber`

#### Defined in

[types/lib/index.ts:15](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/index.ts#L15)

___

### FeeType

Ƭ **FeeType**: [`EIP1559Fee`](../interfaces/liquality_types.EIP1559Fee.md) \| `number`

#### Defined in

[types/lib/Fees.ts:10](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Fees.ts#L10)

___

### TransactionRequest

Ƭ **TransactionRequest**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `asset?` | [`Asset`](../interfaces/liquality_types.Asset.md) |
| `data?` | `string` |
| `fee?` | [`FeeType`](liquality_types.md#feetype) |
| `feeAsset?` | [`Asset`](../interfaces/liquality_types.Asset.md) |
| `to?` | [`AddressType`](liquality_types.md#addresstype) |
| `value?` | `BigNumber` |

#### Defined in

[types/lib/Transaction.ts:47](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Transaction.ts#L47)
