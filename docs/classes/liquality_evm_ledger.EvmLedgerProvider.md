[](../README.md) / [Exports](../modules.md) / [@liquality/evm-ledger](../modules/liquality_evm_ledger.md) / EvmLedgerProvider

# Class: EvmLedgerProvider

[@liquality/evm-ledger](../modules/liquality_evm_ledger.md).EvmLedgerProvider

## Hierarchy

- `EvmBaseWalletProvider`<`StaticJsonRpcProvider`, [`EvmLedgerSigner`](liquality_evm_ledger.EvmLedgerSigner.md)\>

  ↳ **`EvmLedgerProvider`**

## Table of contents

### Constructors

- [constructor](liquality_evm_ledger.EvmLedgerProvider.md#constructor)

### Properties

- [\_derivationPath](liquality_evm_ledger.EvmLedgerProvider.md#_derivationpath)
- [\_ledgerProvider](liquality_evm_ledger.EvmLedgerProvider.md#_ledgerprovider)
- [\_ledgerSigner](liquality_evm_ledger.EvmLedgerProvider.md#_ledgersigner)
- [chainProvider](liquality_evm_ledger.EvmLedgerProvider.md#chainprovider)
- [signer](liquality_evm_ledger.EvmLedgerProvider.md#signer)

### Methods

- [canUpdateFee](liquality_evm_ledger.EvmLedgerProvider.md#canupdatefee)
- [exportPrivateKey](liquality_evm_ledger.EvmLedgerProvider.md#exportprivatekey)
- [getAddress](liquality_evm_ledger.EvmLedgerProvider.md#getaddress)
- [getAddresses](liquality_evm_ledger.EvmLedgerProvider.md#getaddresses)
- [getBalance](liquality_evm_ledger.EvmLedgerProvider.md#getbalance)
- [getChainProvider](liquality_evm_ledger.EvmLedgerProvider.md#getchainprovider)
- [getConnectedNetwork](liquality_evm_ledger.EvmLedgerProvider.md#getconnectednetwork)
- [getSigner](liquality_evm_ledger.EvmLedgerProvider.md#getsigner)
- [getUnusedAddress](liquality_evm_ledger.EvmLedgerProvider.md#getunusedaddress)
- [getUsedAddresses](liquality_evm_ledger.EvmLedgerProvider.md#getusedaddresses)
- [isWalletAvailable](liquality_evm_ledger.EvmLedgerProvider.md#iswalletavailable)
- [sendBatchTransaction](liquality_evm_ledger.EvmLedgerProvider.md#sendbatchtransaction)
- [sendSweepTransaction](liquality_evm_ledger.EvmLedgerProvider.md#sendsweeptransaction)
- [sendTransaction](liquality_evm_ledger.EvmLedgerProvider.md#sendtransaction)
- [setChainProvider](liquality_evm_ledger.EvmLedgerProvider.md#setchainprovider)
- [setSigner](liquality_evm_ledger.EvmLedgerProvider.md#setsigner)
- [signMessage](liquality_evm_ledger.EvmLedgerProvider.md#signmessage)
- [updateTransactionFee](liquality_evm_ledger.EvmLedgerProvider.md#updatetransactionfee)

## Constructors

### constructor

• **new EvmLedgerProvider**(`walletOptions`, `chainProvider?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `walletOptions` | [`EvmLedgerCreateOptions`](../interfaces/liquality_evm_ledger.EvmLedgerProviderTypes.EvmLedgerCreateOptions.md) |
| `chainProvider?` | `default`<`StaticJsonRpcProvider`\> |

#### Overrides

EvmBaseWalletProvider&lt;StaticJsonRpcProvider, EvmLedgerSigner\&gt;.constructor

#### Defined in

[evm-ledger/lib/EvmLedgerProvider.ts:18](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm-ledger/lib/EvmLedgerProvider.ts#L18)

## Properties

### \_derivationPath

• `Private` **\_derivationPath**: `string`

#### Defined in

[evm-ledger/lib/EvmLedgerProvider.ts:16](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm-ledger/lib/EvmLedgerProvider.ts#L16)

___

### \_ledgerProvider

• `Private` **\_ledgerProvider**: `LedgerProvider`<`default`\>

#### Defined in

[evm-ledger/lib/EvmLedgerProvider.ts:15](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm-ledger/lib/EvmLedgerProvider.ts#L15)

___

### \_ledgerSigner

• `Private` **\_ledgerSigner**: [`EvmLedgerSigner`](liquality_evm_ledger.EvmLedgerSigner.md)

#### Defined in

[evm-ledger/lib/EvmLedgerProvider.ts:14](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm-ledger/lib/EvmLedgerProvider.ts#L14)

___

### chainProvider

• `Protected` **chainProvider**: `default`<`StaticJsonRpcProvider`\>

#### Inherited from

EvmBaseWalletProvider.chainProvider

#### Defined in

client/dist/lib/Wallet.d.ts:4

___

### signer

• `Protected` **signer**: [`EvmLedgerSigner`](liquality_evm_ledger.EvmLedgerSigner.md)

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

[evm-ledger/lib/EvmLedgerProvider.ts:68](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm-ledger/lib/EvmLedgerProvider.ts#L68)

___

### exportPrivateKey

▸ **exportPrivateKey**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Overrides

EvmBaseWalletProvider.exportPrivateKey

#### Defined in

[evm-ledger/lib/EvmLedgerProvider.ts:56](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm-ledger/lib/EvmLedgerProvider.ts#L56)

___

### getAddress

▸ **getAddress**(): `Promise`<`Address`\>

#### Returns

`Promise`<`Address`\>

#### Overrides

EvmBaseWalletProvider.getAddress

#### Defined in

[evm-ledger/lib/EvmLedgerProvider.ts:31](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm-ledger/lib/EvmLedgerProvider.ts#L31)

___

### getAddresses

▸ **getAddresses**(): `Promise`<`Address`[]\>

#### Returns

`Promise`<`Address`[]\>

#### Overrides

EvmBaseWalletProvider.getAddresses

#### Defined in

[evm-ledger/lib/EvmLedgerProvider.ts:44](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm-ledger/lib/EvmLedgerProvider.ts#L44)

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

[evm-ledger/lib/EvmLedgerProvider.ts:64](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm-ledger/lib/EvmLedgerProvider.ts#L64)

___

### getSigner

▸ **getSigner**(): [`EvmLedgerSigner`](liquality_evm_ledger.EvmLedgerSigner.md)

#### Returns

[`EvmLedgerSigner`](liquality_evm_ledger.EvmLedgerSigner.md)

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

[evm-ledger/lib/EvmLedgerProvider.ts:36](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm-ledger/lib/EvmLedgerProvider.ts#L36)

___

### getUsedAddresses

▸ **getUsedAddresses**(): `Promise`<`Address`[]\>

#### Returns

`Promise`<`Address`[]\>

#### Overrides

EvmBaseWalletProvider.getUsedAddresses

#### Defined in

[evm-ledger/lib/EvmLedgerProvider.ts:40](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm-ledger/lib/EvmLedgerProvider.ts#L40)

___

### isWalletAvailable

▸ **isWalletAvailable**(): `Promise`<`boolean`\>

#### Returns

`Promise`<`boolean`\>

#### Overrides

EvmBaseWalletProvider.isWalletAvailable

#### Defined in

[evm-ledger/lib/EvmLedgerProvider.ts:60](https://github.com/liquality/chainabstractionlayer/blob/c190aa67/packages/evm-ledger/lib/EvmLedgerProvider.ts#L60)

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
| `signer` | [`EvmLedgerSigner`](liquality_evm_ledger.EvmLedgerSigner.md) |

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
