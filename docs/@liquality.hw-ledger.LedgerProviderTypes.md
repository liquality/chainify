# Namespace: LedgerProviderTypes

[@liquality/hw-ledger](../wiki/@liquality.hw-ledger).LedgerProviderTypes

## Table of contents

### Interfaces

- [CreateOptions](../wiki/@liquality.hw-ledger.LedgerProviderTypes.CreateOptions)
- [IApp](../wiki/@liquality.hw-ledger.LedgerProviderTypes.IApp)

### Type aliases

- [GetAddressesFuncType](../wiki/@liquality.hw-ledger.LedgerProviderTypes#getaddressesfunctype)
- [Newable](../wiki/@liquality.hw-ledger.LedgerProviderTypes#newable)
- [TransportCreator](../wiki/@liquality.hw-ledger.LedgerProviderTypes#transportcreator)

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

[hw-ledger/lib/types.ts:21](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/hw-ledger/lib/types.ts#L21)

___

### Newable

Ƭ **Newable**<`T`\>: `Object`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[hw-ledger/lib/types.ts:15](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/hw-ledger/lib/types.ts#L15)

___

### TransportCreator

Ƭ **TransportCreator**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `create` | () => `Promise`<`default`\> |

#### Defined in

[hw-ledger/lib/types.ts:17](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/hw-ledger/lib/types.ts#L17)
