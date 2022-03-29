# Namespace: BitcoinJsonRpcTypes

[@liquality/bitcoin](../wiki/@liquality.bitcoin).[BitcoinTypes](../wiki/@liquality.bitcoin.BitcoinTypes).BitcoinJsonRpcTypes

## Table of contents

### Interfaces

- [AddressInfo](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.AddressInfo)
- [Block](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.Block)
- [FundRawResponse](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.FundRawResponse)
- [MinedTransaction](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.MinedTransaction)
- [ProviderOptions](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.ProviderOptions)
- [ReceivedByAddress](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.ReceivedByAddress)
- [UTXO](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.UTXO)

### Type aliases

- [AddressGrouping](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinJsonRpcTypes#addressgrouping)
- [FeeOptions](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinJsonRpcTypes#feeoptions)

## Type aliases

### AddressGrouping

Ƭ **AddressGrouping**: `string`[][]

#### Defined in

[bitcoin/lib/chain/jsonRpc/types.ts:43](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/jsonRpc/types.ts#L43)

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

[bitcoin/lib/chain/jsonRpc/types.ts:90](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/chain/jsonRpc/types.ts#L90)
