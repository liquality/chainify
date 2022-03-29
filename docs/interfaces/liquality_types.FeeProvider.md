[](../README.md) / [Exports](../modules.md) / [@liquality/types](../modules/liquality_types.md) / FeeProvider

# Interface: FeeProvider

[@liquality/types](../modules/liquality_types.md).FeeProvider

## Table of contents

### Methods

- [getFees](liquality_types.FeeProvider.md#getfees)

## Methods

### getFees

▸ **getFees**(): `Promise`<[`FeeDetails`](liquality_types.FeeDetails.md)\>

#### Returns

`Promise`<[`FeeDetails`](liquality_types.FeeDetails.md)\>

Resolves with an
 identifier for the broadcasted transaction.
 Rejects with InvalidProviderResponseError if provider's response is invalid.

#### Defined in

[types/lib/Fees.ts:31](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/types/lib/Fees.ts#L31)
