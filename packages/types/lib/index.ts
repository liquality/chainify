import BigNumber from 'bignumber.js'
import { SwapProvider, SwapParams } from './swap'
import { ChainProvider, SendOptions } from './chain'
import { WalletProvider } from './wallet'

import { FeeProvider, FeeDetails, FeeDetail } from './fees'
import { Transaction } from './transaction'
import { Block } from './block'
import { Address } from './address'
import { Network } from './network'

import * as bitcoin from './bitcoin'
import * as ethereum from './ethereum'

export {
  SwapProvider,
  ChainProvider,
  WalletProvider,
  FeeProvider,
  BigNumber,
  Transaction,
  Block,
  FeeDetails,
  FeeDetail,
  Address,
  Network,
  SendOptions,
  SwapParams,
  bitcoin,
  ethereum
}
