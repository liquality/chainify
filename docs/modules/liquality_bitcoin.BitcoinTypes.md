[](../README.md) / [Exports](../modules.md) / [@liquality/bitcoin](liquality_bitcoin.md) / BitcoinTypes

# Namespace: BitcoinTypes

[@liquality/bitcoin](liquality_bitcoin.md).BitcoinTypes

## Table of contents

### Namespaces

- [BitcoinEsploraTypes](liquality_bitcoin.BitcoinTypes.BitcoinEsploraTypes.md)
- [BitcoinJsonRpcTypes](liquality_bitcoin.BitcoinTypes.BitcoinJsonRpcTypes.md)

### Enumerations

- [AddressType](../enums/liquality_bitcoin.BitcoinTypes.AddressType.md)
- [SwapMode](../enums/liquality_bitcoin.BitcoinTypes.SwapMode.md)

### Interfaces

- [BitcoinHDWalletProviderOptions](../interfaces/liquality_bitcoin.BitcoinTypes.BitcoinHDWalletProviderOptions.md)
- [BitcoinNetwork](../interfaces/liquality_bitcoin.BitcoinTypes.BitcoinNetwork.md)
- [BitcoinNodeWalletOptions](../interfaces/liquality_bitcoin.BitcoinTypes.BitcoinNodeWalletOptions.md)
- [BitcoinSwapProviderOptions](../interfaces/liquality_bitcoin.BitcoinTypes.BitcoinSwapProviderOptions.md)
- [BitcoinWalletProviderOptions](../interfaces/liquality_bitcoin.BitcoinTypes.BitcoinWalletProviderOptions.md)
- [Input](../interfaces/liquality_bitcoin.BitcoinTypes.Input.md)
- [Output](../interfaces/liquality_bitcoin.BitcoinTypes.Output.md)
- [OutputTarget](../interfaces/liquality_bitcoin.BitcoinTypes.OutputTarget.md)
- [P2SHInput](../interfaces/liquality_bitcoin.BitcoinTypes.P2SHInput.md)
- [PsbtInputTarget](../interfaces/liquality_bitcoin.BitcoinTypes.PsbtInputTarget.md)
- [ScriptPubKey](../interfaces/liquality_bitcoin.BitcoinTypes.ScriptPubKey.md)
- [Transaction](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)
- [UTXO](../interfaces/liquality_bitcoin.BitcoinTypes.UTXO.md)

### Type aliases

- [AddressTxCounts](liquality_bitcoin.BitcoinTypes.md#addresstxcounts)
- [PaymentVariants](liquality_bitcoin.BitcoinTypes.md#paymentvariants)
- [TransactionMatchesFunction](liquality_bitcoin.BitcoinTypes.md#transactionmatchesfunction)

## Type aliases

### AddressTxCounts

Ƭ **AddressTxCounts**: `Object`

#### Index signature

▪ [index: `string`]: `number`

#### Defined in

[bitcoin/lib/types.ts:87](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/types.ts#L87)

___

### PaymentVariants

Ƭ **PaymentVariants**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `p2sh?` | `payments.Payment` |
| `p2shSegwit?` | `payments.Payment` |
| `p2wsh?` | `payments.Payment` |

#### Defined in

[bitcoin/lib/swap/types.ts:13](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/swap/types.ts#L13)

___

### TransactionMatchesFunction

Ƭ **TransactionMatchesFunction**: (`tx`: `Transaction`<[`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)\>) => `boolean`

#### Type declaration

▸ (`tx`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | `Transaction`<[`Transaction`](../interfaces/liquality_bitcoin.BitcoinTypes.Transaction.md)\> |

##### Returns

`boolean`

#### Defined in

[bitcoin/lib/swap/types.ts:11](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/bitcoin/lib/swap/types.ts#L11)
