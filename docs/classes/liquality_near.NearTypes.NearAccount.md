[](../README.md) / [Exports](../modules.md) / [@liquality/near](../modules/liquality_near.md) / [NearTypes](../modules/liquality_near.NearTypes.md) / NearAccount

# Class: NearAccount

[@liquality/near](../modules/liquality_near.md).[NearTypes](../modules/liquality_near.NearTypes.md).NearAccount

## Hierarchy

- `Account`

  ↳ **`NearAccount`**

## Table of contents

### Constructors

- [constructor](liquality_near.NearTypes.NearAccount.md#constructor)

### Methods

- [signAndSendTransaction](liquality_near.NearTypes.NearAccount.md#signandsendtransaction)

## Constructors

### constructor

• **new NearAccount**(`connection`, `accountId`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `connection` | `Connection` |
| `accountId` | `string` |

#### Overrides

Account.constructor

#### Defined in

[near/lib/types.ts:76](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/types.ts#L76)

## Methods

### signAndSendTransaction

▸ **signAndSendTransaction**(`__namedParameters`): `Promise`<`FinalExecutionOutcome`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `any` |

#### Returns

`Promise`<`FinalExecutionOutcome`\>

#### Overrides

Account.signAndSendTransaction

#### Defined in

[near/lib/types.ts:79](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/near/lib/types.ts#L79)
