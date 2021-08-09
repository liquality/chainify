import { BigNumber, cosmos } from '@liquality/types'
import { CosmosNetwork } from '@liquality/cosmos-networks'
import { addressToString } from '@liquality/utils'
import { StdFee, coin } from '@cosmjs/stargate'
import { EncodeObject } from '@cosmjs/proto-signing'
import Long from 'long'

export interface TransactionData {
  msgs: EncodeObject[]
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
      transfer: '100000',
      undelegate: '180000',
      withdraw: '120000'
    }
    this._builders = {
      MsgSend: this.buildSendMsg.bind(this),
      MsgDelegate: this.buildDelegateMsg.bind(this),
      MsgUndelegate: this.buildUndelegateMsg.bind(this),
      MsgWithdraw: this.buildWithdrawMsg.bind(this),
      MsgTransfer: this.buildTransferMsg.bind(this)
    }
  }

  buildMsg(options: cosmos.CosmosSendOptions): TransactionData {
    return this._builders[options.type ? options.type : cosmos.MsgType.MsgSend](options)
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

    return { msgs: [msg], fee: this.buildFeeObject(this._gasFeeTable['send']) }
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

    return { msgs: [msg], fee: this.buildFeeObject(this._gasFeeTable['delegate']) }
  }

  private buildUndelegateMsg(options: cosmos.CosmosSendOptions): TransactionData {
    const { from, to, value } = options

    const msg: EncodeObject = {
      typeUrl: '/cosmos.staking.v1beta1.MsgUndelegate',
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

    return { msgs: [msg], fee: this.buildFeeObject(this._gasFeeTable['undelegate']) }
  }

  private buildWithdrawMsg(options: cosmos.CosmosSendOptions): TransactionData {
    const { from, to } = options

    const msg: EncodeObject = {
      typeUrl: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
      value: {
        delegatorAddress: addressToString(from),
        validatorAddress: addressToString(to)
      }
    }

    return { msgs: [msg], fee: this.buildFeeObject(this._gasFeeTable['withdraw']) }
  }

  // IBC Transfer Msg
  private buildTransferMsg(options: cosmos.CosmosSendOptions): TransactionData {
    const { from, to, value, sourcePort, sourceChannel } = options

    const msg: EncodeObject = {
      typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
      value: {
        sourcePort,
        sourceChannel,
        token: coin(value.toNumber(), this._network.defaultCurrency.coinMinimalDenom),
        sender: addressToString(from),
        receiver: addressToString(to),
        timeoutHeight: undefined,
        // covert to nanoseconds and add one second on top of the Unix timestamp
        timeoutTimestamp: Long.fromNumber(Date.now() * Math.pow(10, 6) + Math.pow(10, 9))
      }
    }

    return { msgs: [msg], fee: this.buildFeeObject(this._gasFeeTable['transfer']) }
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
