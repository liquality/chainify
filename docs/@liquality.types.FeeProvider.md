# Interface: FeeProvider

[@liquality/types](../wiki/@liquality.types).FeeProvider

## Table of contents

### Methods

- [getFees](../wiki/@liquality.types.FeeProvider#getfees)

## Methods

### getFees

▸ **getFees**(): `Promise`<[`FeeDetails`](../wiki/@liquality.types.FeeDetails)\>

#### Returns

`Promise`<[`FeeDetails`](../wiki/@liquality.types.FeeDetails)\>

Resolves with an
 identifier for the broadcasted transaction.
 Rejects with InvalidProviderResponseError if provider's response is invalid.

#### Defined in

[types/lib/Fees.ts:31](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/types/lib/Fees.ts#L31)
