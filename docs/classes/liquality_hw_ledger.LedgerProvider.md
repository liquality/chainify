[](../README.md) / [Exports](../modules.md) / [@liquality/hw-ledger](../modules/liquality_hw_ledger.md) / LedgerProvider

# Class: LedgerProvider<TApp\>

[@liquality/hw-ledger](../modules/liquality_hw_ledger.md).LedgerProvider

## Type parameters

| Name | Type |
| :------ | :------ |
| `TApp` | extends [`IApp`](../interfaces/liquality_hw_ledger.LedgerProviderTypes.IApp.md) |

## Table of contents

### Constructors

- [constructor](liquality_hw_ledger.LedgerProvider.md#constructor)

### Properties

- [\_App](liquality_hw_ledger.LedgerProvider.md#_app)
- [\_Transport](liquality_hw_ledger.LedgerProvider.md#_transport)
- [\_appInstance](liquality_hw_ledger.LedgerProvider.md#_appinstance)
- [\_ledgerScrambleKey](liquality_hw_ledger.LedgerProvider.md#_ledgerscramblekey)
- [\_network](liquality_hw_ledger.LedgerProvider.md#_network)
- [\_transport](liquality_hw_ledger.LedgerProvider.md#_transport)

### Methods

- [createTransport](liquality_hw_ledger.LedgerProvider.md#createtransport)
- [errorProxy](liquality_hw_ledger.LedgerProvider.md#errorproxy)
- [getApp](liquality_hw_ledger.LedgerProvider.md#getapp)
- [getConnectedNetwork](liquality_hw_ledger.LedgerProvider.md#getconnectednetwork)
- [getWalletAddress](liquality_hw_ledger.LedgerProvider.md#getwalletaddress)
- [isWalletAvailable](liquality_hw_ledger.LedgerProvider.md#iswalletavailable)

## Constructors

### constructor

• **new LedgerProvider**<`TApp`\>(`options`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TApp` | extends [`IApp`](../interfaces/liquality_hw_ledger.LedgerProviderTypes.IApp.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`CreateOptions`](../interfaces/liquality_hw_ledger.LedgerProviderTypes.CreateOptions.md)<`TApp`\> |

#### Defined in

[hw-ledger/lib/LedgerProvider.ts:17](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/hw-ledger/lib/LedgerProvider.ts#L17)

## Properties

### \_App

• `Private` **\_App**: `any`

#### Defined in

[hw-ledger/lib/LedgerProvider.ts:8](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/hw-ledger/lib/LedgerProvider.ts#L8)

___

### \_Transport

• `Private` **\_Transport**: [`TransportCreator`](../modules/liquality_hw_ledger.LedgerProviderTypes.md#transportcreator)

#### Defined in

[hw-ledger/lib/LedgerProvider.ts:9](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/hw-ledger/lib/LedgerProvider.ts#L9)

___

### \_appInstance

• `Protected` **\_appInstance**: `TApp`

#### Defined in

[hw-ledger/lib/LedgerProvider.ts:15](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/hw-ledger/lib/LedgerProvider.ts#L15)

___

### \_ledgerScrambleKey

• `Private` **\_ledgerScrambleKey**: `string`

#### Defined in

[hw-ledger/lib/LedgerProvider.ts:12](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/hw-ledger/lib/LedgerProvider.ts#L12)

___

### \_network

• `Private` **\_network**: `Network`

#### Defined in

[hw-ledger/lib/LedgerProvider.ts:11](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/hw-ledger/lib/LedgerProvider.ts#L11)

___

### \_transport

• `Protected` **\_transport**: `default`

#### Defined in

[hw-ledger/lib/LedgerProvider.ts:14](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/hw-ledger/lib/LedgerProvider.ts#L14)

## Methods

### createTransport

▸ `Private` **createTransport**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[hw-ledger/lib/LedgerProvider.ts:111](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/hw-ledger/lib/LedgerProvider.ts#L111)

___

### errorProxy

▸ `Protected` **errorProxy**(`target`, `func`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `any` |
| `func` | `string` |

#### Returns

`any`

#### Defined in

[hw-ledger/lib/LedgerProvider.ts:91](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/hw-ledger/lib/LedgerProvider.ts#L91)

___

### getApp

▸ **getApp**(): `Promise`<`TApp`\>

#### Returns

`Promise`<`TApp`\>

#### Defined in

[hw-ledger/lib/LedgerProvider.ts:77](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/hw-ledger/lib/LedgerProvider.ts#L77)

___

### getConnectedNetwork

▸ **getConnectedNetwork**(): `Promise`<`Network`\>

#### Returns

`Promise`<`Network`\>

#### Defined in

[hw-ledger/lib/LedgerProvider.ts:46](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/hw-ledger/lib/LedgerProvider.ts#L46)

___

### getWalletAddress

▸ **getWalletAddress**(`address`, `getAddresses`): `Promise`<`Address`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `getAddresses` | [`GetAddressesFuncType`](../modules/liquality_hw_ledger.LedgerProviderTypes.md#getaddressesfunctype) |

#### Returns

`Promise`<`Address`\>

#### Defined in

[hw-ledger/lib/LedgerProvider.ts:51](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/hw-ledger/lib/LedgerProvider.ts#L51)

___

### isWalletAvailable

▸ **isWalletAvailable**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Defined in

[hw-ledger/lib/LedgerProvider.ts:27](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/hw-ledger/lib/LedgerProvider.ts#L27)
