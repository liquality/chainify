# Module: @liquality/types

## Table of contents

### Enumerations

- [ChainId](../wiki/@liquality.types.ChainId)
- [TxStatus](../wiki/@liquality.types.TxStatus)

### Classes

- [Address](../wiki/@liquality.types.Address)

### Interfaces

- [Asset](../wiki/@liquality.types.Asset)
- [Block](../wiki/@liquality.types.Block)
- [ChainProvider](../wiki/@liquality.types.ChainProvider)
- [EIP1559Fee](../wiki/@liquality.types.EIP1559Fee)
- [FeeDetail](../wiki/@liquality.types.FeeDetail)
- [FeeDetails](../wiki/@liquality.types.FeeDetails)
- [FeeProvider](../wiki/@liquality.types.FeeProvider)
- [Network](../wiki/@liquality.types.Network)
- [SwapParams](../wiki/@liquality.types.SwapParams)
- [SwapProvider](../wiki/@liquality.types.SwapProvider)
- [Transaction](../wiki/@liquality.types.Transaction)
- [WalletOptions](../wiki/@liquality.types.WalletOptions)
- [WalletProvider](../wiki/@liquality.types.WalletProvider)

### Type aliases

- [AddressType](../wiki/@liquality.types#addresstype)
- [AssetType](../wiki/@liquality.types#assettype)
- [BigNumberish](../wiki/@liquality.types#bignumberish)
- [FeeType](../wiki/@liquality.types#feetype)
- [TransactionRequest](../wiki/@liquality.types#transactionrequest)

## Type aliases

### AddressType

Ƭ **AddressType**: [`Address`](../wiki/@liquality.types.Address) \| `string`

#### Defined in

[types/lib/Address.ts:18](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Address.ts#L18)

___

### AssetType

Ƭ **AssetType**: ``"native"`` \| ``"erc20"``

#### Defined in

[types/lib/Asset.ts:15](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Asset.ts#L15)

___

### BigNumberish

Ƭ **BigNumberish**: `string` \| `number` \| `EthersBigNumberish` \| `BigNumber`

#### Defined in

[types/lib/index.ts:15](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/index.ts#L15)

___

### FeeType

Ƭ **FeeType**: [`EIP1559Fee`](../wiki/@liquality.types.EIP1559Fee) \| `number`

#### Defined in

[types/lib/Fees.ts:10](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Fees.ts#L10)

___

### TransactionRequest

Ƭ **TransactionRequest**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `asset?` | [`Asset`](../wiki/@liquality.types.Asset) |
| `data?` | `string` |
| `fee?` | [`FeeType`](../wiki/@liquality.types#feetype) |
| `feeAsset?` | [`Asset`](../wiki/@liquality.types.Asset) |
| `to?` | [`AddressType`](../wiki/@liquality.types#addresstype) |
| `value?` | `BigNumber` |

#### Defined in

[types/lib/Transaction.ts:47](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Transaction.ts#L47)
