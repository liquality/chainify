# Class: EvmMulticallProvider

[@liquality/evm](../wiki/@liquality.evm).EvmMulticallProvider

## Table of contents

### Constructors

- [constructor](../wiki/@liquality.evm.EvmMulticallProvider#constructor)

### Methods

- [getEthBalance](../wiki/@liquality.evm.EvmMulticallProvider#getethbalance)
- [getMultipleBalances](../wiki/@liquality.evm.EvmMulticallProvider#getmultiplebalances)
- [multicall](../wiki/@liquality.evm.EvmMulticallProvider#multicall)

## Constructors

### constructor

• **new EvmMulticallProvider**(`chainProvider`, `chainId?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `chainProvider` | `BaseProvider` | `undefined` |
| `chainId` | `number` | `1` |

#### Defined in

[evm/lib/chain/EvmMulticallProvider.ts:37](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/chain/EvmMulticallProvider.ts#L37)

## Methods

### getEthBalance

▸ **getEthBalance**(`address`): `Promise`<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`Promise`<`BigNumber`\>

#### Defined in

[evm/lib/chain/EvmMulticallProvider.ts:46](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/chain/EvmMulticallProvider.ts#L46)

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

[evm/lib/chain/EvmMulticallProvider.ts:50](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/chain/EvmMulticallProvider.ts#L50)

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

[evm/lib/chain/EvmMulticallProvider.ts:74](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/chain/EvmMulticallProvider.ts#L74)
