import { BigNumber, cosmos } from '@liquality/types'
import { CosmosNetwork } from '@liquality/cosmos-networks'
import { addressToString } from '@liquality/utils'
import { FeeTable, StdFee, coin, CosmosFeeTable } from '@cosmjs/stargate'
import { EncodeObject } from '@cosmjs/proto-signing'
import { MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx'

export interface TransactionData {
  msg: EncodeObject
  fee: StdFee
}

export class MsgFactory {
  private _feeTable: FeeTable
  private _network: CosmosNetwork
  private _builders: { [key: string]: (options: cosmos.CosmosSendOptions) => TransactionData }

  constructor(network: CosmosNetwork, feeTable: CosmosFeeTable) {
    this._feeTable = feeTable
    this._network = network
    this._builders = {
      SendMsg: this.buildSendMsg
    }
  }

  buildMsg(options: cosmos.CosmosSendOptions): TransactionData {
    return this._builders[options.type](options)
  }

  private buildSendMsg(options: cosmos.CosmosSendOptions): TransactionData {
    const { from, to, value } = options

    const baseMsg = MsgSend.fromJSON({
      fromAddress: addressToString(from),
      toAddress: addressToString(to),
      amount: value
    })

    const msg: EncodeObject = {
      typeUrl: '/cosmos.bank.v1beta1.MsgSend',
      value: baseMsg
    }

    return { msg, fee: this.buildFeeObject(this._feeTable.send.gas) }
  }

  private buildFeeObject(gas: string): StdFee {
    const amount = new BigNumber(gas).multipliedBy(new BigNumber(this._network.minimalGasPrice))

    const fee = {
      amount: [coin(amount.toNumber(), this._network.defaultCurrency.coinMinimalDenom)],
      gas: gas
    }

    return fee
  }
}
