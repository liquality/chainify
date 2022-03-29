# Class: EvmLedgerSigner

[@liquality/evm-ledger](../wiki/@liquality.evm-ledger).EvmLedgerSigner

## Hierarchy

- `Signer`

  ↳ **`EvmLedgerSigner`**

## Table of contents

### Constructors

- [constructor](../wiki/@liquality.evm-ledger.EvmLedgerSigner#constructor)

### Properties

- [provider](../wiki/@liquality.evm-ledger.EvmLedgerSigner#provider)

### Methods

- [connect](../wiki/@liquality.evm-ledger.EvmLedgerSigner#connect)
- [getAddress](../wiki/@liquality.evm-ledger.EvmLedgerSigner#getaddress)
- [signMessage](../wiki/@liquality.evm-ledger.EvmLedgerSigner#signmessage)
- [signTransaction](../wiki/@liquality.evm-ledger.EvmLedgerSigner#signtransaction)

## Constructors

### constructor

• **new EvmLedgerSigner**(`getApp`, `derivationPath?`, `provider?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `getApp` | [`GetAppType`](../wiki/@liquality.evm-ledger.EvmLedgerProviderTypes#getapptype) |
| `derivationPath?` | `string` |
| `provider?` | `Provider` |

#### Overrides

Signer.constructor

#### Defined in

[evm-ledger/lib/EvmLedgerSigner.ts:38](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm-ledger/lib/EvmLedgerSigner.ts#L38)

## Properties

### provider

• **provider**: `Provider`

#### Overrides

Signer.provider

#### Defined in

[evm-ledger/lib/EvmLedgerSigner.ts:32](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm-ledger/lib/EvmLedgerSigner.ts#L32)

## Methods

### connect

▸ **connect**(`provider`): [`EvmLedgerSigner`](../wiki/@liquality.evm-ledger.EvmLedgerSigner)

#### Parameters

| Name | Type |
| :------ | :------ |
| `provider` | `Provider` |

#### Returns

[`EvmLedgerSigner`](../wiki/@liquality.evm-ledger.EvmLedgerSigner)

#### Overrides

Signer.connect

#### Defined in

[evm-ledger/lib/EvmLedgerSigner.ts:93](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm-ledger/lib/EvmLedgerSigner.ts#L93)

___

### getAddress

▸ **getAddress**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Overrides

Signer.getAddress

#### Defined in

[evm-ledger/lib/EvmLedgerSigner.ts:46](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm-ledger/lib/EvmLedgerSigner.ts#L46)

___

### signMessage

▸ **signMessage**(`message`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` \| `Bytes` |

#### Returns

`Promise`<`string`\>

#### Overrides

Signer.signMessage

#### Defined in

[evm-ledger/lib/EvmLedgerSigner.ts:55](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm-ledger/lib/EvmLedgerSigner.ts#L55)

___

### signTransaction

▸ **signTransaction**(`transaction`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `transaction` | `TransactionRequest` |

#### Returns

`Promise`<`string`\>

#### Overrides

Signer.signTransaction

#### Defined in

[evm-ledger/lib/EvmLedgerSigner.ts:68](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm-ledger/lib/EvmLedgerSigner.ts#L68)
