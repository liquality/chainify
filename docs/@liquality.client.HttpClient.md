# Class: HttpClient

[@liquality/client](../wiki/@liquality.client).HttpClient

## Table of contents

### Constructors

- [constructor](../wiki/@liquality.client.HttpClient#constructor)

### Methods

- [nodeGet](../wiki/@liquality.client.HttpClient#nodeget)
- [nodePost](../wiki/@liquality.client.HttpClient#nodepost)

## Constructors

### constructor

• **new HttpClient**(`config`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | `AxiosRequestConfig`<`any`\> |

#### Defined in

[client/lib/Http.ts:6](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/client/lib/Http.ts#L6)

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

[client/lib/Http.ts:10](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/client/lib/Http.ts#L10)

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

[client/lib/Http.ts:15](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/client/lib/Http.ts#L15)
