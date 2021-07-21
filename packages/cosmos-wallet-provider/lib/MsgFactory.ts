import { BigNumber, cosmos } from '@liquality/types'
import { CosmosNetwork } from '@liquality/cosmos-networks'
import { addressToString } from '@liquality/utils'
import { StdFee, coin } from '@cosmjs/stargate'
import { EncodeObject } from '@cosmjs/proto-signing'

export interface TransactionData {
  msg: EncodeObject
  fee: StdFee
}

export class MsgFactory {
  private _network: CosmosNetwork
  private _gasFeeTable: { [key: string]: string }
  private _builders: { [key: string]: (options: cosmos.CosmosSendOptions) => TransactionData }

  constructor(network: CosmosNetwork) {
    this._network = network
    this._gasFeeTable = {
      send: '80000',
      delegate: '160000',
      transfer: '160000',
      undelegate: '160000',
      withdraw: '160000'
    }
    this._builders = {
      SendMsg: this.buildSendMsg.bind(this),
      DelegateMsg: this.buildDelegateMsg.bind(this)
    }
  }

  buildMsg(options: cosmos.CosmosSendOptions): TransactionData {
    return this._builders[options.type](options)
  }

  private buildSendMsg(options: cosmos.CosmosSendOptions): TransactionData {
    const { from, to, value } = options

    const msg: EncodeObject = {
      typeUrl: '/cosmos.bank.v1beta1.MsgSend',
      value: {
        fromAddress: addressToString(from),
        toAddress: addressToString(to),
        amount: [coin(value.toNumber(), this._network.defaultCurrency.coinMinimalDenom)]
      }
    }

    return { msg, fee: this.buildFeeObject(this._gasFeeTable['send']) }
  }

  private buildDelegateMsg(options: cosmos.CosmosSendOptions): TransactionData {
    const { from, to, value } = options

    const msg: EncodeObject = {
      typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
      value: {
        delegatorAddress: addressToString(from),
        validatorAddress: addressToString(to),
        amount: coin(
          value.toNumber(),
          this._network.stakingCurrency
            ? this._network.stakingCurrency.coinMinimalDenom
            : this._network.defaultCurrency.coinMinimalDenom
        )
      }
    }

    return { msg, fee: this.buildFeeObject(this._gasFeeTable['delegate']) }
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
