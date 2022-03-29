[](../README.md) / [Exports](../modules.md) / [@liquality/bitcoin](liquality_bitcoin.md) / [BitcoinTypes](liquality_bitcoin.BitcoinTypes.md) / BitcoinJsonRpcTypes

# Namespace: BitcoinJsonRpcTypes

[@liquality/bitcoin](liquality_bitcoin.md).[BitcoinTypes](liquality_bitcoin.BitcoinTypes.md).BitcoinJsonRpcTypes

## Table of contents

### Interfaces

- [AddressInfo](../interfaces/liquality_bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.AddressInfo.md)
- [Block](../interfaces/liquality_bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.Block.md)
- [FundRawResponse](../interfaces/liquality_bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.FundRawResponse.md)
- [MinedTransaction](../interfaces/liquality_bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.MinedTransaction.md)
- [ProviderOptions](../interfaces/liquality_bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.ProviderOptions.md)
- [ReceivedByAddress](../interfaces/liquality_bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.ReceivedByAddress.md)
- [UTXO](../interfaces/liquality_bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.UTXO.md)

### Type aliases

- [AddressGrouping](liquality_bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.md#addressgrouping)
- [FeeOptions](liquality_bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.md#feeoptions)

## Type aliases

### AddressGrouping

Ƭ **AddressGrouping**: `string`[][]

#### Defined in

[bitcoin/lib/chain/jsonRpc/types.ts:43](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/jsonRpc/types.ts#L43)

___

### FeeOptions

Ƭ **FeeOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `averageTargetBlocks?` | `number` |
| `fastTargetBlocks?` | `number` |
| `slowTargetBlocks?` | `number` |

#### Defined in

[bitcoin/lib/chain/jsonRpc/types.ts:90](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/chain/jsonRpc/types.ts#L90)
