[](../README.md) / [Exports](../modules.md) / [@liquality/evm-ledger](../modules/liquality_evm_ledger.md) / EvmLedgerSigner

# Class: EvmLedgerSigner

[@liquality/evm-ledger](../modules/liquality_evm_ledger.md).EvmLedgerSigner

## Hierarchy

- `Signer`

  ↳ **`EvmLedgerSigner`**

## Table of contents

### Constructors

- [constructor](liquality_evm_ledger.EvmLedgerSigner.md#constructor)

### Properties

- [addressCache](liquality_evm_ledger.EvmLedgerSigner.md#addresscache)
- [derivationPath](liquality_evm_ledger.EvmLedgerSigner.md#derivationpath)
- [getApp](liquality_evm_ledger.EvmLedgerSigner.md#getapp)
- [provider](liquality_evm_ledger.EvmLedgerSigner.md#provider)

### Methods

- [\_retry](liquality_evm_ledger.EvmLedgerSigner.md#_retry)
- [connect](liquality_evm_ledger.EvmLedgerSigner.md#connect)
- [getAddress](liquality_evm_ledger.EvmLedgerSigner.md#getaddress)
- [signMessage](liquality_evm_ledger.EvmLedgerSigner.md#signmessage)
- [signTransaction](liquality_evm_ledger.EvmLedgerSigner.md#signtransaction)

## Constructors

### constructor

• **new EvmLedgerSigner**(`getApp`, `derivationPath?`, `provider?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `getApp` | [`GetAppType`](../modules/liquality_evm_ledger.EvmLedgerProviderTypes.md#getapptype) |
| `derivationPath?` | `string` |
| `provider?` | `Provider` |

#### Overrides

Signer.constructor

#### Defined in

[evm-ledger/lib/EvmLedgerSigner.ts:38](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm-ledger/lib/EvmLedgerSigner.ts#L38)

## Properties

### addressCache

• `Private` **addressCache**: `Record`<`string`, [`LedgerAddressType`](../interfaces/liquality_evm_ledger.EvmLedgerProviderTypes.LedgerAddressType.md)\>

#### Defined in

[evm-ledger/lib/EvmLedgerSigner.ts:34](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm-ledger/lib/EvmLedgerSigner.ts#L34)

___

### derivationPath

• `Private` `Readonly` **derivationPath**: `string`

#### Defined in

[evm-ledger/lib/EvmLedgerSigner.ts:36](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm-ledger/lib/EvmLedgerSigner.ts#L36)

___

### getApp

• `Private` `Readonly` **getApp**: [`GetAppType`](../modules/liquality_evm_ledger.EvmLedgerProviderTypes.md#getapptype)

#### Defined in

[evm-ledger/lib/EvmLedgerSigner.ts:35](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm-ledger/lib/EvmLedgerSigner.ts#L35)

___

### provider

• **provider**: `Provider`

#### Overrides

Signer.provider

#### Defined in

[evm-ledger/lib/EvmLedgerSigner.ts:32](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm-ledger/lib/EvmLedgerSigner.ts#L32)

## Methods

### \_retry

▸ `Private` **_retry**<`T`\>(`callback`): `Promise`<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | (`eth`: `default`) => `Promise`<`T`\> |

#### Returns

`Promise`<`T`\>

#### Defined in

[evm-ledger/lib/EvmLedgerSigner.ts:97](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm-ledger/lib/EvmLedgerSigner.ts#L97)

___

### connect

▸ **connect**(`provider`): [`EvmLedgerSigner`](liquality_evm_ledger.EvmLedgerSigner.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `provider` | `Provider` |

#### Returns

[`EvmLedgerSigner`](liquality_evm_ledger.EvmLedgerSigner.md)

#### Overrides

Signer.connect

#### Defined in

[evm-ledger/lib/EvmLedgerSigner.ts:93](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm-ledger/lib/EvmLedgerSigner.ts#L93)

___

### getAddress

▸ **getAddress**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Overrides

Signer.getAddress

#### Defined in

[evm-ledger/lib/EvmLedgerSigner.ts:46](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm-ledger/lib/EvmLedgerSigner.ts#L46)

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

[evm-ledger/lib/EvmLedgerSigner.ts:55](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm-ledger/lib/EvmLedgerSigner.ts#L55)

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

[evm-ledger/lib/EvmLedgerSigner.ts:68](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm-ledger/lib/EvmLedgerSigner.ts#L68)
