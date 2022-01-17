/* eslint-env mocha */

import { EvmMulticallProvider } from '../../lib'
import { StaticJsonRpcProvider } from '@ethersproject/providers'
import { expect } from 'chai'

const ERC20BalanceABI = [
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
]

describe('EVM Multicall Provider', () => {
  let provider: EvmMulticallProvider

  before(() => {
    provider = new EvmMulticallProvider(
      new StaticJsonRpcProvider('https://ropsten.infura.io/v3/8fe4fc9626494d238879981936dbf144', 'ropsten'),
      3
    )
  })

  describe('aggregates static calls', () => {
    it('should fetch balance of two tokens', async () => {
      const result = await provider.multicall([
        {
          target: '0xc8b23857d66ae204d195968714840a75d28dc217',
          abi: ERC20BalanceABI,
          name: 'balanceOf',
          params: ['0xF180525Ef03D5e5bFd09156823e0eA49da561c5F']
        },
        {
          target: '0x1371597fc11aedbd2446f5390fa1dbf22491752a',
          abi: ERC20BalanceABI,
          name: 'balanceOf',
          params: ['0xF180525Ef03D5e5bFd09156823e0eA49da561c5F']
        }
      ])
      expect(result.length == 2)
    })
  })
})
