[](../README.md) / [Exports](../modules.md) / [@liquality/client](../modules/liquality_client.md) / HttpClient

# Class: HttpClient

[@liquality/client](../modules/liquality_client.md).HttpClient

## Table of contents

### Constructors

- [constructor](liquality_client.HttpClient.md#constructor)

### Properties

- [\_node](liquality_client.HttpClient.md#_node)

### Methods

- [nodeGet](liquality_client.HttpClient.md#nodeget)
- [nodePost](liquality_client.HttpClient.md#nodepost)

## Constructors

### constructor

• **new HttpClient**(`config`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | `AxiosRequestConfig`<`any`\> |

#### Defined in

[client/lib/Http.ts:6](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Http.ts#L6)

## Properties

### \_node

• `Private` **\_node**: `AxiosInstance`

#### Defined in

[client/lib/Http.ts:4](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Http.ts#L4)

## Methods

### nodeGet

▸ **nodeGet**<`I`, `O`\>(`url`, `params?`): `Promise`<`O`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `I` | `any` |
| `O` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `params` | `I` |

#### Returns

`Promise`<`O`\>

#### Defined in

[client/lib/Http.ts:10](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Http.ts#L10)

___

### nodePost

▸ **nodePost**<`I`, `O`\>(`url`, `data`): `Promise`<`O`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `I` | `any` |
| `O` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `data` | `I` |

#### Returns

`Promise`<`O`\>

#### Defined in

[client/lib/Http.ts:15](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/Http.ts#L15)
