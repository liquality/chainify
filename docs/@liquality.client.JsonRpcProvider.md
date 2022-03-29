# Class: JsonRpcProvider

[@liquality/client](../wiki/@liquality.client).JsonRpcProvider

## Table of contents

### Constructors

- [constructor](../wiki/@liquality.client.JsonRpcProvider#constructor)

### Methods

- [send](../wiki/@liquality.client.JsonRpcProvider#send)
- [defaultUrl](../wiki/@liquality.client.JsonRpcProvider#defaulturl)

## Constructors

### constructor

• **new JsonRpcProvider**(`url?`, `username?`, `password?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `url?` | `string` |
| `username?` | `string` |
| `password?` | `string` |

#### Defined in

[client/lib/JsonRpc.ts:11](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/client/lib/JsonRpc.ts#L11)

## Methods

### send

▸ **send**(`method`, `params`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | `string` |
| `params` | `any`[] |

#### Returns

`Promise`<`any`\>

#### Defined in

[client/lib/JsonRpc.ts:32](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/client/lib/JsonRpc.ts#L32)

___

### defaultUrl

▸ `Static` **defaultUrl**(): `string`

#### Returns

`string`

#### Defined in

[client/lib/JsonRpc.ts:28](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/client/lib/JsonRpc.ts#L28)
