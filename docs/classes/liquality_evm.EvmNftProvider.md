[](../README.md) / [Exports](../modules.md) / [@liquality/evm](../modules/liquality_evm.md) / EvmNftProvider

# Class: EvmNftProvider

[@liquality/evm](../modules/liquality_evm.md).EvmNftProvider

## Hierarchy

- `default`<`BaseProvider`, `Signer`\>

  ↳ **`EvmNftProvider`**

## Table of contents

### Constructors

- [constructor](liquality_evm.EvmNftProvider.md#constructor)

### Properties

- [\_cache](liquality_evm.EvmNftProvider.md#_cache)
- [\_erc1155](liquality_evm.EvmNftProvider.md#_erc1155)
- [\_erc721](liquality_evm.EvmNftProvider.md#_erc721)
- [\_httpClient](liquality_evm.EvmNftProvider.md#_httpclient)
- [\_schemas](liquality_evm.EvmNftProvider.md#_schemas)
- [walletProvider](liquality_evm.EvmNftProvider.md#walletprovider)

### Methods

- [\_cacheGet](liquality_evm.EvmNftProvider.md#_cacheget)
- [approve](liquality_evm.EvmNftProvider.md#approve)
- [approveAll](liquality_evm.EvmNftProvider.md#approveall)
- [balanceOf](liquality_evm.EvmNftProvider.md#balanceof)
- [fetch](liquality_evm.EvmNftProvider.md#fetch)
- [getWallet](liquality_evm.EvmNftProvider.md#getwallet)
- [isApprovedForAll](liquality_evm.EvmNftProvider.md#isapprovedforall)
- [setWallet](liquality_evm.EvmNftProvider.md#setwallet)
- [transfer](liquality_evm.EvmNftProvider.md#transfer)

## Constructors

### constructor

• **new EvmNftProvider**(`walletProvider`, `httpConfig`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `walletProvider` | [`EvmBaseWalletProvider`](liquality_evm.EvmBaseWalletProvider.md)<`BaseProvider`, `Signer`\> |
| `httpConfig` | `AxiosRequestConfig`<`any`\> |

#### Overrides

Nft&lt;BaseProvider, Signer\&gt;.constructor

#### Defined in

[evm/lib/nft/EvmNftProvider.ts:22](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/nft/EvmNftProvider.ts#L22)

## Properties

### \_cache

• `Private` **\_cache**: `Record`<`string`, `NftInfo`\>

#### Defined in

[evm/lib/nft/EvmNftProvider.ts:18](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/nft/EvmNftProvider.ts#L18)

___

### \_erc1155

• `Private` **\_erc1155**: `ERC1155`

#### Defined in

[evm/lib/nft/EvmNftProvider.ts:17](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/nft/EvmNftProvider.ts#L17)

___

### \_erc721

• `Private` **\_erc721**: `ERC721`

#### Defined in

[evm/lib/nft/EvmNftProvider.ts:16](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/nft/EvmNftProvider.ts#L16)

___

### \_httpClient

• `Private` **\_httpClient**: `default`

#### Defined in

[evm/lib/nft/EvmNftProvider.ts:20](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/nft/EvmNftProvider.ts#L20)

___

### \_schemas

• `Private` **\_schemas**: `Record`<`string`, `NftContract`\>

#### Defined in

[evm/lib/nft/EvmNftProvider.ts:19](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/nft/EvmNftProvider.ts#L19)

___

### walletProvider

• `Protected` **walletProvider**: `default`<`BaseProvider`, `Signer`\>

#### Inherited from

Nft.walletProvider

#### Defined in

client/dist/lib/Nft.d.ts:4

## Methods

### \_cacheGet

▸ `Private` **_cacheGet**(`contractAddress`): `Promise`<`NftInfo`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `contractAddress` | `AddressType` |

#### Returns

`Promise`<`NftInfo`\>

#### Defined in

[evm/lib/nft/EvmNftProvider.ts:167](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/nft/EvmNftProvider.ts#L167)

___

### approve

▸ **approve**(`contractAddress`, `operator`, `tokenID`, `fee?`): `Promise`<`Transaction`<`TransactionResponse`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `contractAddress` | `AddressType` |
| `operator` | `AddressType` |
| `tokenID` | `number` |
| `fee?` | `FeeType` |

#### Returns

`Promise`<`Transaction`<`TransactionResponse`\>\>

#### Overrides

Nft.approve

#### Defined in

[evm/lib/nft/EvmNftProvider.ts:102](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/nft/EvmNftProvider.ts#L102)

___

### approveAll

▸ **approveAll**(`contractAddress`, `operator`, `state`, `fee?`): `Promise`<`Transaction`<`TransactionResponse`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `contractAddress` | `AddressType` |
| `operator` | `AddressType` |
| `state` | `boolean` |
| `fee?` | `FeeType` |

#### Returns

`Promise`<`Transaction`<`TransactionResponse`\>\>

#### Overrides

Nft.approveAll

#### Defined in

[evm/lib/nft/EvmNftProvider.ts:138](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/nft/EvmNftProvider.ts#L138)

___

### balanceOf

▸ **balanceOf**(`contractAddress`, `owners`, `tokenIDs`): `Promise`<`BigNumber` \| `BigNumber`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `contractAddress` | `AddressType` |
| `owners` | `AddressType`[] |
| `tokenIDs` | `number`[] |

#### Returns

`Promise`<`BigNumber` \| `BigNumber`[]\>

#### Overrides

Nft.balanceOf

#### Defined in

[evm/lib/nft/EvmNftProvider.ts:78](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/nft/EvmNftProvider.ts#L78)

___

### fetch

▸ **fetch**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Overrides

Nft.fetch

#### Defined in

[evm/lib/nft/EvmNftProvider.ts:149](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/nft/EvmNftProvider.ts#L149)

___

### getWallet

▸ **getWallet**(): `default`<`BaseProvider`, `Signer`\>

#### Returns

`default`<`BaseProvider`, `Signer`\>

#### Inherited from

Nft.getWallet

#### Defined in

client/dist/lib/Nft.d.ts:7

___

### isApprovedForAll

▸ **isApprovedForAll**(`contractAddress`, `operator`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `contractAddress` | `AddressType` |
| `operator` | `AddressType` |

#### Returns

`Promise`<`boolean`\>

#### Overrides

Nft.isApprovedForAll

#### Defined in

[evm/lib/nft/EvmNftProvider.ts:132](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/nft/EvmNftProvider.ts#L132)

___

### setWallet

▸ **setWallet**(`wallet`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `wallet` | `default`<`BaseProvider`, `Signer`\> |

#### Returns

`void`

#### Inherited from

Nft.setWallet

#### Defined in

client/dist/lib/Nft.d.ts:6

___

### transfer

▸ **transfer**(`contractAddress`, `receiver`, `tokenIDs`, `amounts?`, `data?`, `fee?`): `Promise`<`Transaction`<`TransactionResponse`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `contractAddress` | `AddressType` |
| `receiver` | `AddressType` |
| `tokenIDs` | `number`[] |
| `amounts?` | `number`[] |
| `data?` | `string` |
| `fee?` | `FeeType` |

#### Returns

`Promise`<`Transaction`<`TransactionResponse`\>\>

#### Overrides

Nft.transfer

#### Defined in

[evm/lib/nft/EvmNftProvider.ts:32](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm/lib/nft/EvmNftProvider.ts#L32)
