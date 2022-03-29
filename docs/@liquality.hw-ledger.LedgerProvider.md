# Class: LedgerProvider<TApp\>

[@liquality/hw-ledger](../wiki/@liquality.hw-ledger).LedgerProvider

## Type parameters

| Name | Type |
| :------ | :------ |
| `TApp` | extends [`IApp`](../wiki/@liquality.hw-ledger.LedgerProviderTypes.IApp) |

## Table of contents

### Constructors

- [constructor](../wiki/@liquality.hw-ledger.LedgerProvider#constructor)

### Properties

- [\_appInstance](../wiki/@liquality.hw-ledger.LedgerProvider#_appinstance)
- [\_transport](../wiki/@liquality.hw-ledger.LedgerProvider#_transport)

### Methods

- [errorProxy](../wiki/@liquality.hw-ledger.LedgerProvider#errorproxy)
- [getApp](../wiki/@liquality.hw-ledger.LedgerProvider#getapp)
- [getConnectedNetwork](../wiki/@liquality.hw-ledger.LedgerProvider#getconnectednetwork)
- [getWalletAddress](../wiki/@liquality.hw-ledger.LedgerProvider#getwalletaddress)
- [isWalletAvailable](../wiki/@liquality.hw-ledger.LedgerProvider#iswalletavailable)

## Constructors

### constructor

• **new LedgerProvider**<`TApp`\>(`options`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TApp` | extends [`IApp`](../wiki/@liquality.hw-ledger.LedgerProviderTypes.IApp) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`CreateOptions`](../wiki/@liquality.hw-ledger.LedgerProviderTypes.CreateOptions)<`TApp`\> |

#### Defined in

[hw-ledger/lib/LedgerProvider.ts:17](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/hw-ledger/lib/LedgerProvider.ts#L17)

## Properties

### \_appInstance

• `Protected` **\_appInstance**: `TApp`

#### Defined in

[hw-ledger/lib/LedgerProvider.ts:15](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/hw-ledger/lib/LedgerProvider.ts#L15)

___

### \_transport

• `Protected` **\_transport**: `default`

#### Defined in

[hw-ledger/lib/LedgerProvider.ts:14](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/hw-ledger/lib/LedgerProvider.ts#L14)

## Methods

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

[hw-ledger/lib/LedgerProvider.ts:91](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/hw-ledger/lib/LedgerProvider.ts#L91)

___

### getApp

▸ **getApp**(): `Promise`<`TApp`\>

#### Returns

`Promise`<`TApp`\>

#### Defined in

[hw-ledger/lib/LedgerProvider.ts:77](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/hw-ledger/lib/LedgerProvider.ts#L77)

___

### getConnectedNetwork

▸ **getConnectedNetwork**(): `Promise`<`Network`\>

#### Returns

`Promise`<`Network`\>

#### Defined in

[hw-ledger/lib/LedgerProvider.ts:46](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/hw-ledger/lib/LedgerProvider.ts#L46)

___

### getWalletAddress

▸ **getWalletAddress**(`address`, `getAddresses`): `Promise`<`Address`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `getAddresses` | [`GetAddressesFuncType`](../wiki/@liquality.hw-ledger.LedgerProviderTypes#getaddressesfunctype) |

#### Returns

`Promise`<`Address`\>

#### Defined in

[hw-ledger/lib/LedgerProvider.ts:51](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/hw-ledger/lib/LedgerProvider.ts#L51)

___

### isWalletAvailable

▸ **isWalletAvailable**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Defined in

[hw-ledger/lib/LedgerProvider.ts:27](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/hw-ledger/lib/LedgerProvider.ts#L27)
