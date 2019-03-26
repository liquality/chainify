/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
// import chai, { expect } from 'chai'
// import chaiAsPromised from 'chai-as-promised'
// import _ from 'lodash'
import { Client, providers } from '../../../src'
import config from './config'

console.log(providers.ethereum.EthereumERC20Provider)

const ethereumWithNode = new Client()
ethereumWithNode.addProvider(new providers.ethereum.EthereumRPCProvider(config.ethereum.rpc.host))
ethereumWithNode.addProvider(new providers.ethereum.EthereumERC20Provider(config.token.address))

console.log('HELLO')
