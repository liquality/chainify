[](../README.md) / [Exports](../modules.md) / [@liquality/evm](../modules/liquality_evm.md) / EvmMulticallProvider

# Class: EvmMulticallProvider

[@liquality/evm](../modules/liquality_evm.md).EvmMulticallProvider

## Table of contents

### Constructors

- [constructor](liquality_evm.EvmMulticallProvider.md#constructor)

### Properties

- [\_multicall](liquality_evm.EvmMulticallProvider.md#_multicall)
- [\_multicallAddress](liquality_evm.EvmMulticallProvider.md#_multicalladdress)

### Methods

- [getAddressForChainId](liquality_evm.EvmMulticallProvider.md#getaddressforchainid)
- [getEthBalance](liquality_evm.EvmMulticallProvider.md#getethbalance)
- [getMultipleBalances](liquality_evm.EvmMulticallProvider.md#getmultiplebalances)
- [multicall](liquality_evm.EvmMulticallProvider.md#multicall)

## Constructors

### constructor

• **new EvmMulticallProvider**(`chainProvider`, `chainId?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `chainProvider` | `BaseProvider` | `undefined` |
| `chainId` | `number` | `1` |

#### Defined in

[evm/lib/chain/EvmMulticallProvider.ts:37](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/chain/EvmMulticallProvider.ts#L37)

## Properties

### \_multicall

• `Private` **\_multicall**: `Multicall`

#### Defined in

[evm/lib/chain/EvmMulticallProvider.ts:35](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/chain/EvmMulticallProvider.ts#L35)

___

### \_multicallAddress

• `Private` **\_multicallAddress**: `string`

#### Defined in

[evm/lib/chain/EvmMulticallProvider.ts:34](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/chain/EvmMulticallProvider.ts#L34)

## Methods

### getAddressForChainId

▸ `Private` **getAddressForChainId**(`chainId`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `number` |

#### Returns

`string`

#### Defined in

[evm/lib/chain/EvmMulticallProvider.ts:42](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/chain/EvmMulticallProvider.ts#L42)

___

### getEthBalance

▸ **getEthBalance**(`address`): `Promise`<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`Promise`<`BigNumber`\>

#### Defined in

[evm/lib/chain/EvmMulticallProvider.ts:46](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/chain/EvmMulticallProvider.ts#L46)

___

### getMultipleBalances

▸ **getMultipleBalances**(`address`, `assets`): `Promise`<`BigNumber`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `AddressType` |
| `assets` | `Asset`[] |

#### Returns

`Promise`<`BigNumber`[]\>

#### Defined in

[evm/lib/chain/EvmMulticallProvider.ts:50](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/chain/EvmMulticallProvider.ts#L50)

___

### multicall

▸ **multicall**<`T`\>(`calls`): `Promise`<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `any`[] = `any`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `calls` | readonly `Call`[] |

#### Returns

`Promise`<`T`\>

#### Defined in

[evm/lib/chain/EvmMulticallProvider.ts:74](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/chain/EvmMulticallProvider.ts#L74)
