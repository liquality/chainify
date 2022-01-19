import { NodeProvider } from '@liquality/node-provider'
import { addressToString } from '@liquality/utils'
import { ensure0x } from '@liquality/ethereum-utils'
import { NftProvider as INftProvider, Address } from '@liquality/types'

import { NftBaseProvider } from '@liquality/nft-base-provider'
import { NftErc721Provider } from '@liquality/nft-erc721-provider'
import { NftErc1155Provider } from '@liquality/nft-erc1155-provider'

import { StaticJsonRpcProvider } from '@ethersproject/providers'
import { Wallet } from '@ethersproject/wallet'

export default class NftProvider extends NodeProvider implements Partial<INftProvider> {
  _wallet: Wallet
  _subProviders: { [type: string]: NftBaseProvider }
  _nftContractsCache: { [address: string]: NftBaseProvider }

  constructor(apiURI: string, options: { uri: string; mnemonic: string; derivationPath: string }) {
    super({
      baseURL: apiURI,
      responseType: 'text',
      transformResponse: undefined
    })

    this._wallet = Wallet.fromMnemonic(options.mnemonic, options.derivationPath)
    this._wallet = this._wallet.connect(new StaticJsonRpcProvider(options.uri))

    this._subProviders = {}
    this._subProviders['ERC721'] = new NftErc721Provider(this._wallet)
    this._subProviders['ERC1155'] = new NftErc1155Provider(this._wallet)

    this._nftContractsCache = {}
  }

  async balance(contract: Address | string, tokenIDs: number | number[]) {
    return (await this._cacheGet(contract)).balance(contract, tokenIDs)
  }

  async transfer(
    contract: Address | string,
    receiver: Address | string,
    tokenIDs: number | number[],
    values: number[],
    data: string
  ) {
    return (await this._cacheGet(contract)).transfer(contract, receiver, tokenIDs, values, data)
  }

  async approve(contract: Address | string, operator: Address | string, tokenID: number) {
    return (await this._cacheGet(contract)).approve(contract, operator, tokenID)
  }

  async isApproved(contract: Address | string, tokenID: number): Promise<Address> {
    return (await this._cacheGet(contract)).isApproved(contract, tokenID)
  }

  async approveAll(contract: Address | string, operator: Address | string, state: boolean) {
    return (await this._cacheGet(contract)).approveAll(contract, operator, state)
  }

  async isApprovedForAll(contract: Address | string, operator: Address | string): Promise<boolean> {
    return (await this._cacheGet(contract)).isApprovedForAll(contract, operator)
  }

  async fetch() {
    const nfts = await this.nodeGet(`assets?owner=${await this._wallet.getAddress()}`)

    // storing cache
    nfts.assets.map((nft: any) => {
      this._cacheAdd(nft.asset_contract.address, nft.asset_contract.schema_name)
    })

    return nfts
  }

  private _cacheAdd(address: Address | string, standard: string) {
    const _address = ensure0x(addressToString(address)).toLowerCase()
    if (!this._nftContractsCache[_address]) {
      this._nftContractsCache[_address] = this._subProviders[standard.toUpperCase()]
    }
  }

  private async _cacheGet(address: Address | string) {
    const _address = ensure0x(addressToString(address)).toLowerCase()

    // add to cache if doesn't exist
    if (!this._nftContractsCache[_address]) {
      const result = await this.nodeGet(`asset_contract/${_address}`)
      this._cacheAdd(result.address, result.schema_name)
    }

    return this._nftContractsCache[_address]
  }
}
