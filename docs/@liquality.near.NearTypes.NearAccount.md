# Class: NearAccount

[@liquality/near](../wiki/@liquality.near).[NearTypes](../wiki/@liquality.near.NearTypes).NearAccount

## Hierarchy

- `Account`

  ↳ **`NearAccount`**

## Table of contents

### Constructors

- [constructor](../wiki/@liquality.near.NearTypes.NearAccount#constructor)

### Methods

- [signAndSendTransaction](../wiki/@liquality.near.NearTypes.NearAccount#signandsendtransaction)

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

[near/lib/types.ts:76](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/types.ts#L76)

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

[near/lib/types.ts:79](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/near/lib/types.ts#L79)
