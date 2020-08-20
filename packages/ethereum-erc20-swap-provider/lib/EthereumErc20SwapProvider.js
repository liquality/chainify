import Provider from '@liquality/provider'
import { padHexStart } from '@liquality/crypto'
import { addressToString, sleep } from '@liquality/utils'
import { remove0x } from '@liquality/ethereum-utils'

import { version } from '../package.json'

const SOL_CLAIM_FUNCTION = '0xbd66528a' // claim(bytes32)
const SOL_REFUND_FUNCTION = '0x590e1ae3' // refund()

export default class EthereumErc20SwapProvider extends Provider {
  createSwapScript (recipientAddress, refundAddress, secretHash, expiration) {
    recipientAddress = remove0x(addressToString(recipientAddress))
    refundAddress = remove0x(addressToString(refundAddress))

    const tokenAddress = remove0x(this.getMethod('getContractAddress')())
    const expirationEncoded = padHexStart(expiration.toString(16), 64)
    const bytecode = `6080604052600080546001600160a01b031990811673\
${recipientAddress}1790915560018054821673\
${refundAddress}17905560028054821673\
${tokenAddress}1790819055600380549092166001600160a01b03919091161790557f\
${secretHash}6004553480156100b157600080fd5b506103e4806100c16000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c8063590e1ae31461003b578063bd66528a14610045575b600080fd5b610043610062565b005b6100436004803603602081101561005b57600080fd5b503561017c565b7f\
${expirationEncoded}421161008e57600080fd5b600154600354604080516370a0823160e01b8152306004820152905161016e9363a9059cbb60e01b936001600160a01b03918216939116916370a0823191602480820192602092909190829003018186803b1580156100ec57600080fd5b505afa158015610100573d6000803e3d6000fd5b505050506040513d602081101561011657600080fd5b5051604080516001600160a01b0390931660248401526044808401929092528051808403909201825260649092019091526020810180516001600160e01b03166001600160e01b03199093169290921790915261029c565b6001546001600160a01b0316ff5b600454600282604051602001808281526020019150506040516020818303038152906040526040518082805190602001908083835b602083106101d05780518252601f1990920191602091820191016101b1565b51815160209384036101000a60001901801990921691161790526040519190930194509192505080830381855afa15801561020f573d6000803e3d6000fd5b5050506040513d602081101561022457600080fd5b50511461023057600080fd5b600054600354604080516370a0823160e01b8152306004820152905161028e9363a9059cbb60e01b936001600160a01b03918216939116916370a0823191602480820192602092909190829003018186803b1580156100ec57600080fd5b6000546001600160a01b0316ff5b60606102a7826102d5565b8051909150156102d1578080602001905160208110156102c657600080fd5b50516102d157600080fd5b5050565b600254604051825160609260009284926001600160a01b0390921691869190819060208401908083835b6020831061031e5780518252601f1990920191602091820191016102ff565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d8060008114610380576040519150601f19603f3d011682016040523d82523d6000602084013e610385565b606091505b509150915081156103995791506103a99050565b8051156100365780518082602001fd5b91905056fea2646970667358221220160723b130690048d6220e7557605adfe6c53698edfa5116bd501c69a2fd0f7764736f6c634300060a0033`
      .toLowerCase()

    return bytecode
  }

  async initiateSwap (value, recipientAddress, refundAddress, secretHash, expiration, gasPrice) {
    const bytecode = this.createSwapScript(recipientAddress, refundAddress, secretHash, expiration)
    const deployTx = await this.getMethod('sendTransaction')(null, 0, bytecode, gasPrice)
    let initiationTransactionReceipt = null

    while (initiationTransactionReceipt === null) {
      initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(deployTx.hash)
      await sleep(5000)
    }

    await this.getMethod('sendTransaction')(initiationTransactionReceipt.contractAddress, value, undefined, gasPrice)
    return deployTx
  }

  async claimSwap (initiationTxHash, recipientAddress, refundAddress, secret, expiration, gasPrice) {
    const initiationTransaction = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransaction) throw new Error('Transaction receipt is not available')

    return this.getMethod('sendTransaction')(initiationTransaction.contractAddress, 0, SOL_CLAIM_FUNCTION + secret, gasPrice)
  }

  async refundSwap (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration, gasPrice) {
    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt) throw new Error('Transaction receipt is not available')

    return this.getMethod('sendTransaction')(initiationTransactionReceipt.contractAddress, 0, SOL_REFUND_FUNCTION, gasPrice)
  }

  doesTransactionMatchInitiation (transaction, value, recipientAddress, refundAddress, secretHash, expiration) {
    const data = this.createSwapScript(recipientAddress, refundAddress, secretHash, expiration)
    return transaction._raw.input === data
  }

  doesTransactionMatchClaim (transaction, initiationTransactionReceipt, recipientAddress, refundAddress, secretHash, expiration) {
    return transaction._raw.to === initiationTransactionReceipt.contractAddress &&
      transaction._raw.input.startsWith(remove0x(SOL_CLAIM_FUNCTION))
  }

  async doesBalanceMatchValue (contractAddress, value) {
    const balance = await this.getMethod('getBalance')(contractAddress)
    return balance.isEqualTo(value)
  }

  async verifyInitiateSwapTransaction (initiationTxHash, value, recipientAddress, refundAddress, secretHash, expiration) {
    const initiationTransaction = await this.getMethod('getTransactionByHash')(initiationTxHash)
    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt) throw new Error('Transaction receipt is not available')

    const transactionMatchesSwapParams = this.doesTransactionMatchInitiation(
      initiationTransaction,
      value,
      recipientAddress,
      refundAddress,
      secretHash,
      expiration
    )
    const balanceMatchValue = await this.doesBalanceMatchValue(initiationTransactionReceipt.contractAddress, value)

    return transactionMatchesSwapParams &&
           initiationTransactionReceipt.status === '1' &&
           balanceMatchValue
  }

  async findInitiateSwapTransaction (value, recipientAddress, refundAddress, secretHash, expiration, blockNumber) {
    const block = await this.getMethod('getBlockByNumber')(blockNumber, true)
    if (block) {
      return block.transactions.find(
        transaction => this.doesTransactionMatchInitiation(
          transaction,
          value,
          recipientAddress,
          refundAddress,
          secretHash,
          expiration
        )
      )
    }
  }

  async findClaimSwapTransaction (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration, blockNumber) {
    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt) throw new Error('Transaction receipt is not available')

    const block = await this.getMethod('getBlockByNumber')(blockNumber, true)
    if (!block) throw new Error('Block is not available')

    const transaction = block.transactions.find(
      transaction => this.doesTransactionMatchClaim(transaction, initiationTransactionReceipt)
    )
    if (!transaction) return

    const transactionReceipt = await this.getMethod('getTransactionReceipt')(transaction.hash)
    if (!transactionReceipt) throw new Error('Transaction receipt is not available')

    if (transactionReceipt.status === '1') {
      transaction.secret = await this.getSwapSecret(transaction.hash)
      return transaction
    }
  }

  async getSwapSecret (claimTxHash) {
    const claimTransaction = await this.getMethod('getTransactionByHash')(claimTxHash)
    return claimTransaction._raw.input.substring(8)
  }

  async findRefundSwapTransaction (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration, blockNumber) {
    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt) throw new Error('Transaction receipt is not available')

    const block = await this.getMethod('getBlockByNumber')(blockNumber, true)
    if (!block) throw new Error('Block is not available')

    const refundSwapTransaction = block.transactions.find(transaction =>
      transaction._raw.to === initiationTransactionReceipt.contractAddress &&
      transaction._raw.input === remove0x(SOL_REFUND_FUNCTION) && // eslint-disable-line
      block.timestamp >= expiration
    )
    return refundSwapTransaction
  }
}

EthereumErc20SwapProvider.SOL_CLAIM_FUNCTION = SOL_CLAIM_FUNCTION
EthereumErc20SwapProvider.SOL_REFUND_FUNCTION = SOL_REFUND_FUNCTION
EthereumErc20SwapProvider.version = version
