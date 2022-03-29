[](../README.md) / [Exports](../modules.md) / [@liquality/hw-ledger](liquality_hw_ledger.md) / LedgerProviderTypes

# Namespace: LedgerProviderTypes

[@liquality/hw-ledger](liquality_hw_ledger.md).LedgerProviderTypes

## Table of contents

### Interfaces

- [CreateOptions](../interfaces/liquality_hw_ledger.LedgerProviderTypes.CreateOptions.md)
- [IApp](../interfaces/liquality_hw_ledger.LedgerProviderTypes.IApp.md)

### Type aliases

- [GetAddressesFuncType](liquality_hw_ledger.LedgerProviderTypes.md#getaddressesfunctype)
- [Newable](liquality_hw_ledger.LedgerProviderTypes.md#newable)
- [TransportCreator](liquality_hw_ledger.LedgerProviderTypes.md#transportcreator)

## Type aliases

### GetAddressesFuncType

Ƭ **GetAddressesFuncType**: (`start?`: `number`, `numAddresses?`: `number`, `change?`: `boolean`) => `Promise`<`Address`[]\>

#### Type declaration

▸ (`start?`, `numAddresses?`, `change?`): `Promise`<`Address`[]\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `start?` | `number` |
| `numAddresses?` | `number` |
| `change?` | `boolean` |

##### Returns

`Promise`<`Address`[]\>

#### Defined in

[hw-ledger/lib/types.ts:21](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/hw-ledger/lib/types.ts#L21)

___

### Newable

Ƭ **Newable**<`T`\>: `Object`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[hw-ledger/lib/types.ts:15](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/hw-ledger/lib/types.ts#L15)

___

### TransportCreator

Ƭ **TransportCreator**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | () => `Promise`<`default`\> |

#### Defined in

[hw-ledger/lib/types.ts:17](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/hw-ledger/lib/types.ts#L17)
