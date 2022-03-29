# Class: EvmNftProvider

[@liquality/evm](../wiki/@liquality.evm).EvmNftProvider

## Hierarchy

- `default`<`BaseProvider`, `Signer`\>

  ↳ **`EvmNftProvider`**

## Table of contents

### Constructors

- [constructor](../wiki/@liquality.evm.EvmNftProvider#constructor)

### Properties

- [walletProvider](../wiki/@liquality.evm.EvmNftProvider#walletprovider)

### Methods

- [approve](../wiki/@liquality.evm.EvmNftProvider#approve)
- [approveAll](../wiki/@liquality.evm.EvmNftProvider#approveall)
- [balanceOf](../wiki/@liquality.evm.EvmNftProvider#balanceof)
- [fetch](../wiki/@liquality.evm.EvmNftProvider#fetch)
- [getWallet](../wiki/@liquality.evm.EvmNftProvider#getwallet)
- [isApprovedForAll](../wiki/@liquality.evm.EvmNftProvider#isapprovedforall)
- [setWallet](../wiki/@liquality.evm.EvmNftProvider#setwallet)
- [transfer](../wiki/@liquality.evm.EvmNftProvider#transfer)

## Constructors

### constructor

• **new EvmNftProvider**(`walletProvider`, `httpConfig`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `walletProvider` | [`EvmBaseWalletProvider`](../wiki/@liquality.evm.EvmBaseWalletProvider)<`BaseProvider`, `Signer`\> |
| `httpConfig` | `AxiosRequestConfig`<`any`\> |

#### Overrides

Nft&lt;BaseProvider, Signer\&gt;.constructor

#### Defined in

[evm/lib/nft/EvmNftProvider.ts:22](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/nft/EvmNftProvider.ts#L22)

## Properties

### walletProvider

• `Protected` **walletProvider**: `default`<`BaseProvider`, `Signer`\>

#### Inherited from

Nft.walletProvider

#### Defined in

client/dist/lib/Nft.d.ts:4

## Methods

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

[evm/lib/nft/EvmNftProvider.ts:102](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/nft/EvmNftProvider.ts#L102)

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

[evm/lib/nft/EvmNftProvider.ts:138](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/nft/EvmNftProvider.ts#L138)

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

[evm/lib/nft/EvmNftProvider.ts:78](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/nft/EvmNftProvider.ts#L78)

___

### fetch

▸ **fetch**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Overrides

Nft.fetch

#### Defined in

[evm/lib/nft/EvmNftProvider.ts:149](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/nft/EvmNftProvider.ts#L149)

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

[evm/lib/nft/EvmNftProvider.ts:132](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/nft/EvmNftProvider.ts#L132)

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

[evm/lib/nft/EvmNftProvider.ts:32](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm/lib/nft/EvmNftProvider.ts#L32)
