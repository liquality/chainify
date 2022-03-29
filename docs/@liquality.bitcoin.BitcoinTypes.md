# Namespace: BitcoinTypes

[@liquality/bitcoin](../wiki/@liquality.bitcoin).BitcoinTypes

## Table of contents

### Namespaces

- [BitcoinEsploraTypes](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinEsploraTypes)
- [BitcoinJsonRpcTypes](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinJsonRpcTypes)

### Enumerations

- [AddressType](../wiki/@liquality.bitcoin.BitcoinTypes.AddressType)
- [SwapMode](../wiki/@liquality.bitcoin.BitcoinTypes.SwapMode)

### Interfaces

- [BitcoinHDWalletProviderOptions](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinHDWalletProviderOptions)
- [BitcoinNetwork](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinNetwork)
- [BitcoinNodeWalletOptions](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinNodeWalletOptions)
- [BitcoinSwapProviderOptions](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinSwapProviderOptions)
- [BitcoinWalletProviderOptions](../wiki/@liquality.bitcoin.BitcoinTypes.BitcoinWalletProviderOptions)
- [Input](../wiki/@liquality.bitcoin.BitcoinTypes.Input)
- [Output](../wiki/@liquality.bitcoin.BitcoinTypes.Output)
- [OutputTarget](../wiki/@liquality.bitcoin.BitcoinTypes.OutputTarget)
- [P2SHInput](../wiki/@liquality.bitcoin.BitcoinTypes.P2SHInput)
- [PsbtInputTarget](../wiki/@liquality.bitcoin.BitcoinTypes.PsbtInputTarget)
- [ScriptPubKey](../wiki/@liquality.bitcoin.BitcoinTypes.ScriptPubKey)
- [Transaction](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction)
- [UTXO](../wiki/@liquality.bitcoin.BitcoinTypes.UTXO)

### Type aliases

- [AddressTxCounts](../wiki/@liquality.bitcoin.BitcoinTypes#addresstxcounts)
- [PaymentVariants](../wiki/@liquality.bitcoin.BitcoinTypes#paymentvariants)
- [TransactionMatchesFunction](../wiki/@liquality.bitcoin.BitcoinTypes#transactionmatchesfunction)

## Type aliases

### AddressTxCounts

Ƭ **AddressTxCounts**: `Object`

#### Index signature

▪ [index: `string`]: `number`

#### Defined in

[bitcoin/lib/types.ts:87](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/types.ts#L87)

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

[bitcoin/lib/swap/types.ts:13](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/swap/types.ts#L13)

___

### TransactionMatchesFunction

Ƭ **TransactionMatchesFunction**: (`tx`: `Transaction`<[`Transaction`](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction)\>) => `boolean`

#### Type declaration

▸ (`tx`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | `Transaction`<[`Transaction`](../wiki/@liquality.bitcoin.BitcoinTypes.Transaction)\> |

##### Returns

`boolean`

#### Defined in

[bitcoin/lib/swap/types.ts:11](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/bitcoin/lib/swap/types.ts#L11)
