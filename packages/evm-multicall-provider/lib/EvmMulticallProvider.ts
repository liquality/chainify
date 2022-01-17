import { Interface } from '@ethersproject/abi'
import { Provider } from '@ethersproject/providers'
import { Contract } from '@ethersproject/contracts'
import { BigNumber } from '@ethersproject/bignumber'

import { Call, ContractCall } from './types'
import multicallAbi from './abi'
import multicallAddresses from './addresses'

export class EvmMulticallProvider {
  private _multicallAddress: string
  private _multicallContract: Contract

  constructor(provider: Provider, chainId = 1 /* Ethereum Mainnet */) {
    this._multicallAddress = this.getAddressForChainId(chainId)
    this._multicallContract = new Contract(this._multicallAddress, multicallAbi, provider)
  }

  private getAddressForChainId(chainId: number) {
    return multicallAddresses[chainId]
  }

  public async getEthBalance(address: string): Promise<BigNumber> {
    return await this._multicallContract.getEthBalance(address)
  }

  public async multicall<T extends any[] = any[]>(calls: ReadonlyArray<Call>): Promise<T> {
    const aggregatedCallData: ContractCall[] = calls.map((call: Call) => {
      const callData = new Interface(call.abi).encodeFunctionData(call.name, call.params)
      return { target: call.target, callData }
    })

    const result = await this._multicallContract.aggregate(aggregatedCallData)
    if (!result.returnData) {
      throw new Error(`Could not make call with data: ${aggregatedCallData}`)
    }

    return calls.map((call: Call, index: number) => {
      const decodedResult = new Interface(call.abi).decodeFunctionResult(call.name, result.returnData[index])
      return decodedResult.length === 1 ? decodedResult[0] : decodedResult
    }) as T
  }
}
