# Class: Nft<T, S\>

[@liquality/client](../wiki/@liquality.client).Nft

## Type parameters

| Name |
| :------ |
| `T` |
| `S` |

## Table of contents

### Constructors

- [constructor](../wiki/@liquality.client.Nft#constructor)

### Properties

- [walletProvider](../wiki/@liquality.client.Nft#walletprovider)

### Methods

- [approve](../wiki/@liquality.client.Nft#approve)
- [approveAll](../wiki/@liquality.client.Nft#approveall)
- [balanceOf](../wiki/@liquality.client.Nft#balanceof)
- [fetch](../wiki/@liquality.client.Nft#fetch)
- [getWallet](../wiki/@liquality.client.Nft#getwallet)
- [isApprovedForAll](../wiki/@liquality.client.Nft#isapprovedforall)
- [setWallet](../wiki/@liquality.client.Nft#setwallet)
- [transfer](../wiki/@liquality.client.Nft#transfer)

## Constructors

### constructor

• **new Nft**<`T`, `S`\>(`walletProvider?`)

#### Type parameters

| Name |
| :------ |
| `T` |
| `S` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `walletProvider?` | [`Wallet`](../wiki/@liquality.client.Wallet)<`T`, `S`\> |

#### Defined in

[client/lib/Nft.ts:7](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/client/lib/Nft.ts#L7)

## Properties

### walletProvider

• `Protected` **walletProvider**: [`Wallet`](../wiki/@liquality.client.Wallet)<`T`, `S`\>

#### Defined in

[client/lib/Nft.ts:5](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/client/lib/Nft.ts#L5)

## Methods

### approve

▸ `Abstract` **approve**(`contract`, `operator`, `tokenID`): `Promise`<`Transaction`<`any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `contract` | `AddressType` |
| `operator` | `AddressType` |
| `tokenID` | `number` |

#### Returns

`Promise`<`Transaction`<`any`\>\>

#### Defined in

[client/lib/Nft.ts:30](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/client/lib/Nft.ts#L30)

___

### approveAll

▸ `Abstract` **approveAll**(`contract`, `operator`, `state`): `Promise`<`Transaction`<`any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `contract` | `AddressType` |
| `operator` | `AddressType` |
| `state` | `boolean` |

#### Returns

`Promise`<`Transaction`<`any`\>\>

#### Defined in

[client/lib/Nft.ts:32](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/client/lib/Nft.ts#L32)

___

### balanceOf

▸ `Abstract` **balanceOf**(`contractAddress`, `owners`, `tokenIDs`): `Promise`<`BigNumber` \| `BigNumber`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `contractAddress` | `AddressType` |
| `owners` | `AddressType`[] |
| `tokenIDs` | `number`[] |

#### Returns

`Promise`<`BigNumber` \| `BigNumber`[]\>

#### Defined in

[client/lib/Nft.ts:28](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/client/lib/Nft.ts#L28)

___

### fetch

▸ `Abstract` **fetch**(): `void`

#### Returns

`void`

#### Defined in

[client/lib/Nft.ts:36](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/client/lib/Nft.ts#L36)

___

### getWallet

▸ **getWallet**(): [`Wallet`](../wiki/@liquality.client.Wallet)<`T`, `S`\>

#### Returns

[`Wallet`](../wiki/@liquality.client.Wallet)<`T`, `S`\>

#### Defined in

[client/lib/Nft.ts:15](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/client/lib/Nft.ts#L15)

___

### isApprovedForAll

▸ `Abstract` **isApprovedForAll**(`contract`, `operator`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `contract` | `AddressType` |
| `operator` | `AddressType` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[client/lib/Nft.ts:34](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/client/lib/Nft.ts#L34)

___

### setWallet

▸ **setWallet**(`wallet`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `wallet` | [`Wallet`](../wiki/@liquality.client.Wallet)<`T`, `S`\> |

#### Returns

`void`

#### Defined in

[client/lib/Nft.ts:11](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/client/lib/Nft.ts#L11)

___

### transfer

▸ `Abstract` **transfer**(`contract`, `receiver`, `tokenIDs`, `values?`, `data?`, `fee?`): `Promise`<`Transaction`<`any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `contract` | `AddressType` |
| `receiver` | `AddressType` |
| `tokenIDs` | `number`[] |
| `values?` | `number`[] |
| `data?` | `string` |
| `fee?` | `FeeType` |

#### Returns

`Promise`<`Transaction`<`any`\>\>

#### Defined in

[client/lib/Nft.ts:19](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/client/lib/Nft.ts#L19)
