[](../README.md) / [Exports](../modules.md) / [@liquality/client](../modules/liquality_client.md) / JsonRpcProvider

# Class: JsonRpcProvider

[@liquality/client](../modules/liquality_client.md).JsonRpcProvider

## Table of contents

### Constructors

- [constructor](liquality_client.JsonRpcProvider.md#constructor)

### Properties

- [\_httpClient](liquality_client.JsonRpcProvider.md#_httpclient)
- [\_nextId](liquality_client.JsonRpcProvider.md#_nextid)

### Methods

- [getResult](liquality_client.JsonRpcProvider.md#getresult)
- [send](liquality_client.JsonRpcProvider.md#send)
- [defaultUrl](liquality_client.JsonRpcProvider.md#defaulturl)

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

[client/lib/JsonRpc.ts:11](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/JsonRpc.ts#L11)

## Properties

### \_httpClient

• `Private` `Readonly` **\_httpClient**: [`HttpClient`](liquality_client.HttpClient.md)

#### Defined in

[client/lib/JsonRpc.ts:8](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/JsonRpc.ts#L8)

___

### \_nextId

• `Private` **\_nextId**: `number`

#### Defined in

[client/lib/JsonRpc.ts:9](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/JsonRpc.ts#L9)

## Methods

### getResult

▸ `Private` **getResult**(`payload`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload` | `Object` |
| `payload.error?` | `Object` |
| `payload.error.code?` | `number` |
| `payload.error.data?` | `any` |
| `payload.error.message?` | `string` |
| `payload.result?` | `any` |

#### Returns

`any`

#### Defined in

[client/lib/JsonRpc.ts:65](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/JsonRpc.ts#L65)

___

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

[client/lib/JsonRpc.ts:32](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/JsonRpc.ts#L32)

___

### defaultUrl

▸ `Static` **defaultUrl**(): `string`

#### Returns

`string`

#### Defined in

[client/lib/JsonRpc.ts:28](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/client/lib/JsonRpc.ts#L28)
