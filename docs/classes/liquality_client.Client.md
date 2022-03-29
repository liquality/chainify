[](../README.md) / [Exports](../modules.md) / [@liquality/client](../modules/liquality_client.md) / Client

# Class: Client<ChainType, WalletType, SwapType\>

[@liquality/client](../modules/liquality_client.md).Client

## Type parameters

| Name | Type |
| :------ | :------ |
| `ChainType` | [`Chain`](liquality_client.Chain.md)<`any`\> |
| `WalletType` | [`Wallet`](liquality_client.Wallet.md)<`any`, `any`\> |
| `SwapType` | [`Swap`](liquality_client.Swap.md)<`any`, `any`\> |

## Table of contents

### Constructors

- [constructor](liquality_client.Client.md#constructor)

### Properties

- [\_chain](liquality_client.Client.md#_chain)
- [\_swap](liquality_client.Client.md#_swap)
- [\_wallet](liquality_client.Client.md#_wallet)

### Accessors

- [chain](liquality_client.Client.md#chain)
- [swap](liquality_client.Client.md#swap)
- [wallet](liquality_client.Client.md#wallet)

## Constructors

### constructor

• **new Client**<`ChainType`, `WalletType`, `SwapType`\>(`chain?`, `wallet?`, `swap?`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ChainType` | [`Chain`](liquality_client.Chain.md)<`any`, `Network`\> |
| `WalletType` | [`Wallet`](liquality_client.Wallet.md)<`any`, `any`\> |
| `SwapType` | [`Swap`](liquality_client.Swap.md)<`any`, `any`, `any`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain?` | `ChainType` |
| `wallet?` | `WalletType` |
| `swap?` | `SwapType` |

#### Defined in

[client/lib/Client.ts:10](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Client.ts#L10)

## Properties

### \_chain

• `Private` **\_chain**: `ChainType`

#### Defined in

[client/lib/Client.ts:6](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Client.ts#L6)

___

### \_swap

• `Private` **\_swap**: `SwapType`

#### Defined in

[client/lib/Client.ts:8](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Client.ts#L8)

___

### \_wallet

• `Private` **\_wallet**: `WalletType`

#### Defined in

[client/lib/Client.ts:7](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Client.ts#L7)

## Accessors

### chain

• `get` **chain**(): `ChainType`

#### Returns

`ChainType`

#### Defined in

[client/lib/Client.ts:16](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Client.ts#L16)

• `set` **chain**(`chain`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | `ChainType` |

#### Returns

`void`

#### Defined in

[client/lib/Client.ts:20](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Client.ts#L20)

___

### swap

• `get` **swap**(): `SwapType`

#### Returns

`SwapType`

#### Defined in

[client/lib/Client.ts:32](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Client.ts#L32)

• `set` **swap**(`swap`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `swap` | `SwapType` |

#### Returns

`void`

#### Defined in

[client/lib/Client.ts:36](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Client.ts#L36)

___

### wallet

• `get` **wallet**(): `WalletType`

#### Returns

`WalletType`

#### Defined in

[client/lib/Client.ts:24](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Client.ts#L24)

• `set` **wallet**(`wallet`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `wallet` | `WalletType` |

#### Returns

`void`

#### Defined in

[client/lib/Client.ts:28](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Client.ts#L28)
