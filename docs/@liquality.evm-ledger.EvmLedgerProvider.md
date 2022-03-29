# Class: EvmLedgerProvider

[@liquality/evm-ledger](../wiki/@liquality.evm-ledger).EvmLedgerProvider

## Hierarchy

- `EvmBaseWalletProvider`<`StaticJsonRpcProvider`, [`EvmLedgerSigner`](../wiki/@liquality.evm-ledger.EvmLedgerSigner)\>

  ↳ **`EvmLedgerProvider`**

## Table of contents

### Constructors

- [constructor](../wiki/@liquality.evm-ledger.EvmLedgerProvider#constructor)

### Properties

- [chainProvider](../wiki/@liquality.evm-ledger.EvmLedgerProvider#chainprovider)
- [signer](../wiki/@liquality.evm-ledger.EvmLedgerProvider#signer)

### Methods

- [canUpdateFee](../wiki/@liquality.evm-ledger.EvmLedgerProvider#canupdatefee)
- [exportPrivateKey](../wiki/@liquality.evm-ledger.EvmLedgerProvider#exportprivatekey)
- [getAddress](../wiki/@liquality.evm-ledger.EvmLedgerProvider#getaddress)
- [getAddresses](../wiki/@liquality.evm-ledger.EvmLedgerProvider#getaddresses)
- [getBalance](../wiki/@liquality.evm-ledger.EvmLedgerProvider#getbalance)
- [getChainProvider](../wiki/@liquality.evm-ledger.EvmLedgerProvider#getchainprovider)
- [getConnectedNetwork](../wiki/@liquality.evm-ledger.EvmLedgerProvider#getconnectednetwork)
- [getSigner](../wiki/@liquality.evm-ledger.EvmLedgerProvider#getsigner)
- [getUnusedAddress](../wiki/@liquality.evm-ledger.EvmLedgerProvider#getunusedaddress)
- [getUsedAddresses](../wiki/@liquality.evm-ledger.EvmLedgerProvider#getusedaddresses)
- [isWalletAvailable](../wiki/@liquality.evm-ledger.EvmLedgerProvider#iswalletavailable)
- [sendBatchTransaction](../wiki/@liquality.evm-ledger.EvmLedgerProvider#sendbatchtransaction)
- [sendSweepTransaction](../wiki/@liquality.evm-ledger.EvmLedgerProvider#sendsweeptransaction)
- [sendTransaction](../wiki/@liquality.evm-ledger.EvmLedgerProvider#sendtransaction)
- [setChainProvider](../wiki/@liquality.evm-ledger.EvmLedgerProvider#setchainprovider)
- [setSigner](../wiki/@liquality.evm-ledger.EvmLedgerProvider#setsigner)
- [signMessage](../wiki/@liquality.evm-ledger.EvmLedgerProvider#signmessage)
- [updateTransactionFee](../wiki/@liquality.evm-ledger.EvmLedgerProvider#updatetransactionfee)

## Constructors

### constructor

• **new EvmLedgerProvider**(`walletOptions`, `chainProvider?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `walletOptions` | [`EvmLedgerCreateOptions`](../wiki/@liquality.evm-ledger.EvmLedgerProviderTypes.EvmLedgerCreateOptions) |
| `chainProvider?` | `default`<`StaticJsonRpcProvider`\> |

#### Overrides

EvmBaseWalletProvider&lt;StaticJsonRpcProvider, EvmLedgerSigner\&gt;.constructor

#### Defined in

[evm-ledger/lib/EvmLedgerProvider.ts:18](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm-ledger/lib/EvmLedgerProvider.ts#L18)

## Properties

### chainProvider

• `Protected` **chainProvider**: `default`<`StaticJsonRpcProvider`\>

#### Inherited from

EvmBaseWalletProvider.chainProvider

#### Defined in

client/dist/lib/Wallet.d.ts:4

___

### signer

• `Protected` **signer**: [`EvmLedgerSigner`](../wiki/@liquality.evm-ledger.EvmLedgerSigner)

#### Inherited from

EvmBaseWalletProvider.signer

#### Defined in

evm/dist/lib/wallet/EvmBaseWalletProvider.d.ts:6

## Methods

### canUpdateFee

▸ **canUpdateFee**(): `boolean`

#### Returns

`boolean`

#### Overrides

EvmBaseWalletProvider.canUpdateFee

#### Defined in

[evm-ledger/lib/EvmLedgerProvider.ts:68](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm-ledger/lib/EvmLedgerProvider.ts#L68)

___

### exportPrivateKey

▸ **exportPrivateKey**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Overrides

EvmBaseWalletProvider.exportPrivateKey

#### Defined in

[evm-ledger/lib/EvmLedgerProvider.ts:56](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm-ledger/lib/EvmLedgerProvider.ts#L56)

___

### getAddress

▸ **getAddress**(): `Promise`<`Address`\>

#### Returns

`Promise`<`Address`\>

#### Overrides

EvmBaseWalletProvider.getAddress

#### Defined in

[evm-ledger/lib/EvmLedgerProvider.ts:31](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm-ledger/lib/EvmLedgerProvider.ts#L31)

___

### getAddresses

▸ **getAddresses**(): `Promise`<`Address`[]\>

#### Returns

`Promise`<`Address`[]\>

#### Overrides

EvmBaseWalletProvider.getAddresses

#### Defined in

[evm-ledger/lib/EvmLedgerProvider.ts:44](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm-ledger/lib/EvmLedgerProvider.ts#L44)

___

### getBalance

▸ **getBalance**(`assets`): `Promise`<`BigNumber`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `assets` | `Asset`[] |

#### Returns

`Promise`<`BigNumber`[]\>

#### Inherited from

EvmBaseWalletProvider.getBalance

#### Defined in

evm/dist/lib/wallet/EvmBaseWalletProvider.d.ts:15

___

### getChainProvider

▸ **getChainProvider**(): `default`<`StaticJsonRpcProvider`\>

#### Returns

`default`<`StaticJsonRpcProvider`\>

#### Inherited from

EvmBaseWalletProvider.getChainProvider

#### Defined in

client/dist/lib/Wallet.d.ts:7

___

### getConnectedNetwork

▸ **getConnectedNetwork**(): `Promise`<`Network`\>

#### Returns

`Promise`<`Network`\>

#### Overrides

EvmBaseWalletProvider.getConnectedNetwork

#### Defined in

[evm-ledger/lib/EvmLedgerProvider.ts:64](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm-ledger/lib/EvmLedgerProvider.ts#L64)

___

### getSigner

▸ **getSigner**(): [`EvmLedgerSigner`](../wiki/@liquality.evm-ledger.EvmLedgerSigner)

#### Returns

[`EvmLedgerSigner`](../wiki/@liquality.evm-ledger.EvmLedgerSigner)

#### Inherited from

EvmBaseWalletProvider.getSigner

#### Defined in

evm/dist/lib/wallet/EvmBaseWalletProvider.d.ts:8

___

### getUnusedAddress

▸ **getUnusedAddress**(): `Promise`<`Address`\>

#### Returns

`Promise`<`Address`\>

#### Overrides

EvmBaseWalletProvider.getUnusedAddress

#### Defined in

[evm-ledger/lib/EvmLedgerProvider.ts:36](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm-ledger/lib/EvmLedgerProvider.ts#L36)

___

### getUsedAddresses

▸ **getUsedAddresses**(): `Promise`<`Address`[]\>

#### Returns

`Promise`<`Address`[]\>

#### Overrides

EvmBaseWalletProvider.getUsedAddresses

#### Defined in

[evm-ledger/lib/EvmLedgerProvider.ts:40](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm-ledger/lib/EvmLedgerProvider.ts#L40)

___

### isWalletAvailable

▸ **isWalletAvailable**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Overrides

EvmBaseWalletProvider.isWalletAvailable

#### Defined in

[evm-ledger/lib/EvmLedgerProvider.ts:60](https://github.com/liquality/chainabstractionlayer/blob/9cc13847/packages/evm-ledger/lib/EvmLedgerProvider.ts#L60)

___

### sendBatchTransaction

▸ **sendBatchTransaction**(`txRequests`): `Promise`<`Transaction`<`TransactionResponse`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `txRequests` | `EthereumTransactionRequest`[] |

#### Returns

`Promise`<`Transaction`<`TransactionResponse`\>[]\>

#### Inherited from

EvmBaseWalletProvider.sendBatchTransaction

#### Defined in

evm/dist/lib/wallet/EvmBaseWalletProvider.d.ts:12

___

### sendSweepTransaction

▸ **sendSweepTransaction**(`address`, `asset`, `fee?`): `Promise`<`Transaction`<`any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `AddressType` |
| `asset` | `Asset` |
| `fee?` | `FeeType` |

#### Returns

`Promise`<`Transaction`<`any`\>\>

#### Inherited from

EvmBaseWalletProvider.sendSweepTransaction

#### Defined in

evm/dist/lib/wallet/EvmBaseWalletProvider.d.ts:13

___

### sendTransaction

▸ **sendTransaction**(`txRequest`): `Promise`<`Transaction`<`TransactionResponse`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `txRequest` | `EthereumTransactionRequest` |

#### Returns

`Promise`<`Transaction`<`TransactionResponse`\>\>

#### Inherited from

EvmBaseWalletProvider.sendTransaction

#### Defined in

evm/dist/lib/wallet/EvmBaseWalletProvider.d.ts:11

___

### setChainProvider

▸ **setChainProvider**(`chainProvider`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainProvider` | `default`<`StaticJsonRpcProvider`\> |

#### Returns

`void`

#### Inherited from

EvmBaseWalletProvider.setChainProvider

#### Defined in

client/dist/lib/Wallet.d.ts:6

___

### setSigner

▸ **setSigner**(`signer`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `signer` | [`EvmLedgerSigner`](../wiki/@liquality.evm-ledger.EvmLedgerSigner) |

#### Returns

`void`

#### Inherited from

EvmBaseWalletProvider.setSigner

#### Defined in

evm/dist/lib/wallet/EvmBaseWalletProvider.d.ts:9

___

### signMessage

▸ **signMessage**(`message`, `_from`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |
| `_from` | `AddressType` |

#### Returns

`Promise`<`string`\>

#### Inherited from

EvmBaseWalletProvider.signMessage

#### Defined in

evm/dist/lib/wallet/EvmBaseWalletProvider.d.ts:10

___

### updateTransactionFee

▸ **updateTransactionFee**(`tx`, `newFee`): `Promise`<`Transaction`<`TransactionResponse`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | `string` \| `Transaction`<`TransactionResponse`\> |
| `newFee` | `FeeType` |

#### Returns

`Promise`<`Transaction`<`TransactionResponse`\>\>

#### Inherited from

EvmBaseWalletProvider.updateTransactionFee

#### Defined in

evm/dist/lib/wallet/EvmBaseWalletProvider.d.ts:14
