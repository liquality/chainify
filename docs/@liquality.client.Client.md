# Class: Client<ChainType, WalletType, SwapType\>

[@liquality/client](../wiki/@liquality.client).Client

## Type parameters

| Name | Type |
| :------ | :------ |
| `ChainType` | [`Chain`](../wiki/@liquality.client.Chain)<`any`\> |
| `WalletType` | [`Wallet`](../wiki/@liquality.client.Wallet)<`any`, `any`\> |
| `SwapType` | [`Swap`](../wiki/@liquality.client.Swap)<`any`, `any`\> |

## Table of contents

### Constructors

- [constructor](../wiki/@liquality.client.Client#constructor)

### Accessors

- [chain](../wiki/@liquality.client.Client#chain)
- [swap](../wiki/@liquality.client.Client#swap)
- [wallet](../wiki/@liquality.client.Client#wallet)

## Constructors

### constructor

• **new Client**<`ChainType`, `WalletType`, `SwapType`\>(`chain?`, `wallet?`, `swap?`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ChainType` | [`Chain`](../wiki/@liquality.client.Chain)<`any`, `Network`\> |
| `WalletType` | [`Wallet`](../wiki/@liquality.client.Wallet)<`any`, `any`\> |
| `SwapType` | [`Swap`](../wiki/@liquality.client.Swap)<`any`, `any`, `any`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain?` | `ChainType` |
| `wallet?` | `WalletType` |
| `swap?` | `SwapType` |

#### Defined in

[client/lib/Client.ts:10](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/client/lib/Client.ts#L10)

## Accessors

### chain

• `get` **chain**(): `ChainType`

#### Returns

`ChainType`

#### Defined in

[client/lib/Client.ts:16](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/client/lib/Client.ts#L16)

• `set` **chain**(`chain`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | `ChainType` |

#### Returns

`void`

#### Defined in

[client/lib/Client.ts:20](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/client/lib/Client.ts#L20)

___

### swap

• `get` **swap**(): `SwapType`

#### Returns

`SwapType`

#### Defined in

[client/lib/Client.ts:32](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/client/lib/Client.ts#L32)

• `set` **swap**(`swap`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `swap` | `SwapType` |

#### Returns

`void`

#### Defined in

[client/lib/Client.ts:36](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/client/lib/Client.ts#L36)

___

### wallet

• `get` **wallet**(): `WalletType`

#### Returns

`WalletType`

#### Defined in

[client/lib/Client.ts:24](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/client/lib/Client.ts#L24)

• `set` **wallet**(`wallet`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `wallet` | `WalletType` |

#### Returns

`void`

#### Defined in

[client/lib/Client.ts:28](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/client/lib/Client.ts#L28)
