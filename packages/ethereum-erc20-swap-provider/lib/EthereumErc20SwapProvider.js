import Provider from '@liquality/provider'
import { padHexStart, sha256 } from '@liquality/crypto'
import { addressToString, caseInsensitiveEqual } from '@liquality/utils'
import { remove0x } from '@liquality/ethereum-utils'
import {
  PendingTxError,
  TxNotFoundError,
  TxFailedError,
  BlockNotFoundError,
  InvalidSecretError,
  InvalidAddressError,
  InvalidExpirationError,
  InvalidDestinationAddressError,
  InsufficientBalanceError
} from '@liquality/errors'

import { version } from '../package.json'

const SOL_CLAIM_FUNCTION = '0xbd66528a' // claim(bytes32)
const SOL_REFUND_FUNCTION = '0x590e1ae3' // refund()

export default class EthereumErc20SwapProvider extends Provider {
  createSwapScript (recipientAddress, refundAddress, secretHash, expiration) {
    if (secretHash.length !== 64) throw new InvalidSecretError('Invalid secret size')

    recipientAddress = remove0x(addressToString(recipientAddress))
    refundAddress = remove0x(addressToString(refundAddress))

    if (Buffer.byteLength(recipientAddress, 'hex') !== 20) {
      throw new InvalidAddressError(`Invalid recipient address: ${recipientAddress}`)
    }

    if (Buffer.byteLength(refundAddress, 'hex') !== 20) {
      throw new InvalidAddressError(`Invalid refund address: ${refundAddress}`)
    }

    if (Buffer.byteLength(secretHash, 'hex') !== 32) {
      throw new InvalidSecretError(`Invalid secret hash: ${secretHash}`)
    }

    const expirationEncoded = padHexStart(expiration.toString(16), 32)
    if (Buffer.byteLength(expirationEncoded, 'hex') > 32) {
      throw new InvalidExpirationError(`Invalid expiration: ${expiration}`)
    }

    if (sha256('0000000000000000000000000000000000000000000000000000000000000000') === secretHash) {
      throw new InvalidSecretError(`Invalid secret hash: ${secretHash}. Secret 0 detected.`)
    }

    const tokenAddress = remove0x(this.getMethod('getContractAddress')())

    return [
      '6080604052600080546001600160a01b031990811673',
      recipientAddress,
      '1790915560018054821673',
      refundAddress,
      '17905560028054821673',
      tokenAddress,
      '1790819055600380549092166001600160a01b03919091161790557f',
      secretHash,
      '6004553480156100b157600080fd5b5061045c806100c16000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c8063590e1ae31461003b578063bd66528a14610045575b600080fd5b610043610062565b005b6100436004803603602081101561005b57600080fd5b503561017c565b7f',
      expirationEncoded,
      '421161008e57600080fd5b600154600354604080516370a0823160e01b8152306004820152905161016e9363a9059cbb60e01b936001600160a01b03918216939116916370a0823191602480820192602092909190829003018186803b1580156100ec57600080fd5b505afa158015610100573d6000803e3d6000fd5b505050506040513d602081101561011657600080fd5b5051604080516001600160a01b0390931660248401526044808401929092528051808403909201825260649092019091526020810180516001600160e01b03166001600160e01b031990931692909217909152610314565b6001546001600160a01b0316ff5b600454600282604051602001808281526020019150506040516020818303038152906040526040518082805190602001908083835b602083106101d05780518252601f1990920191602091820191016101b1565b51815160209384036101000a60001901801990921691161790526040519190930194509192505080830381855afa15801561020f573d6000803e3d6000fd5b5050506040513d602081101561022457600080fd5b50511461023057600080fd5b600354604080516370a0823160e01b815230600482015290516000926001600160a01b0316916370a08231916024808301926020929190829003018186803b15801561027b57600080fd5b505afa15801561028f573d6000803e3d6000fd5b505050506040513d60208110156102a557600080fd5b50519050806102b357600080fd5b600054604080516001600160a01b039092166024830152604480830184905281518084039091018152606490920190526020810180516001600160e01b031663a9059cbb60e01b17905261030690610314565b6000546001600160a01b0316ff5b606061031f8261034d565b8051909150156103495780806020019051602081101561033e57600080fd5b505161034957600080fd5b5050565b600254604051825160609260009284926001600160a01b0390921691869190819060208401908083835b602083106103965780518252601f199092019160209182019101610377565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d80600081146103f8576040519150601f19603f3d011682016040523d82523d6000602084013e6103fd565b606091505b509150915081156104115791506104219050565b8051156100365780518082602001fd5b91905056fea264697066735822122050b5f386e31422b38dc8c7ced527086554a1af89418786893a391e07a57802ae64736f6c63430007040033'
    ].join('').toLowerCase()
  }

  async initiateSwap (value, recipientAddress, refundAddress, secretHash, expiration, gasPrice) {
    const addresses = await this.getMethod('getAddresses')()
    const balance = await this.getMethod('getBalance')(addresses)

    if (balance.isLessThan(value)) {
      throw new InsufficientBalanceError(`${addresses[0]} doesn't have enough balance (has: ${balance}, want: ${value})`)
    }

    const bytecode = this.createSwapScript(recipientAddress, refundAddress, secretHash, expiration)
    return this.getMethod('sendTransaction')(null, 0, bytecode, gasPrice)
  }

  async fundSwap (initiationTxHash, value, recipientAddress, refundAddress, secretHash, expiration, gasPrice) {
    const initiationTransaction = await this.getMethod('getTransactionByHash')(initiationTxHash)
    if (!initiationTransaction) throw new TxNotFoundError(`Transaction not found: ${initiationTxHash}`)

    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt) throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)

    const initiationSuccessful = initiationTransactionReceipt.contractAddress && initiationTransactionReceipt.status === '1'
    if (!initiationSuccessful) {
      throw new TxFailedError(`ERC20 swap initiation transaction failed: ${initiationTransactionReceipt.transactionHash}`)
    }

    const transactionMatchesSwapParams = this.doesTransactionMatchInitiation(
      initiationTransaction,
      value,
      recipientAddress,
      refundAddress,
      secretHash,
      expiration
    )

    if (!transactionMatchesSwapParams) {
      throw new InvalidDestinationAddressError(`Contract creation does not match initiation parameters: ${initiationTxHash}`)
    }

    await this.getMethod('assertContractExists')(initiationTransactionReceipt.contractAddress)

    const contractHasZeroBalance = await this.doesBalanceMatchValue(initiationTransactionReceipt.contractAddress, 0)
    if (!contractHasZeroBalance) {
      throw new InvalidDestinationAddressError(`Contract is not empty: ${initiationTransactionReceipt.contractAddress}`)
    }

    return this.getMethod('sendTransaction')(initiationTransactionReceipt.contractAddress, value, undefined, gasPrice)
  }

  async claimSwap (initiationTxHash, recipientAddress, refundAddress, secret, expiration, gasPrice) {
    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt) throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)

    await this.getMethod('assertContractExists')(initiationTransactionReceipt.contractAddress)

    return this.getMethod('sendTransaction')(initiationTransactionReceipt.contractAddress, 0, SOL_CLAIM_FUNCTION + secret, gasPrice)
  }

  async refundSwap (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration, gasPrice) {
    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt) throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)

    await this.getMethod('assertContractExists')(initiationTransactionReceipt.contractAddress)

    return this.getMethod('sendTransaction')(initiationTransactionReceipt.contractAddress, 0, SOL_REFUND_FUNCTION, gasPrice)
  }

  doesTransactionMatchInitiation (transaction, value, recipientAddress, refundAddress, secretHash, expiration) {
    const data = this.createSwapScript(recipientAddress, refundAddress, secretHash, expiration)
    return transaction._raw.to === null && transaction._raw.input === data
  }

  doesTransactionMatchClaim (transaction, initiationTransactionReceipt, recipientAddress, refundAddress, secretHash, expiration) {
    return caseInsensitiveEqual(transaction._raw.to, initiationTransactionReceipt.contractAddress) &&
           transaction._raw.input.startsWith(remove0x(SOL_CLAIM_FUNCTION))
  }

  doesTransactionMatchFunding (transaction, erc20TokenContractAddress, contractData) {
    return caseInsensitiveEqual(transaction._raw.to, erc20TokenContractAddress) &&
           transaction._raw.input === contractData
  }

  async doesBalanceMatchValue (contractAddress, value) {
    const balance = await this.getMethod('getBalance')(contractAddress)
    return balance.isEqualTo(value)
  }

  async getSwapSecret (claimTxHash) {
    const claimTransaction = await this.getMethod('getTransactionByHash')(claimTxHash)
    return claimTransaction._raw.input.substring(8)
  }

  async verifyInitiateSwapTransaction (initiationTxHash, value, recipientAddress, refundAddress, secretHash, expiration) {
    const initiationTransaction = await this.getMethod('getTransactionByHash')(initiationTxHash)
    if (!initiationTransaction) throw new TxNotFoundError(`Transaction not found: ${initiationTxHash}`)

    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt) throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)

    await this.getMethod('assertContractExists')(initiationTransactionReceipt.contractAddress)

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
           initiationTransactionReceipt.contractAddress &&
           initiationTransactionReceipt.status === '1' &&
           balanceMatchValue
  }

  async findInitiateSwapTransaction (value, recipientAddress, refundAddress, secretHash, expiration, blockNumber) {
    const block = await this.getMethod('getBlockByNumber')(blockNumber, true)
    if (!block) throw new BlockNotFoundError(`Block #${blockNumber} is not available`)

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

  async findFundSwapTransaction (initiationTxHash, value, recipientAddress, refundAddress, secretHash, expiration, blockNumber) {
    const block = await this.getMethod('getBlockByNumber')(blockNumber, true)
    if (!block) throw new BlockNotFoundError(`Block #${blockNumber} is not available`)

    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt) throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)

    const erc20TokenContractAddress = await this.getMethod('getContractAddress')()
    const contractData = await this.getMethod('generateErc20Transfer')(initiationTransactionReceipt.contractAddress, value)

    const tx = block.transactions.find(
      transaction => this.doesTransactionMatchFunding(transaction, erc20TokenContractAddress, contractData)
    )

    if (!tx) throw new TxNotFoundError(`Funding transaction is not available: ${initiationTxHash}`)

    return tx
  }

  async findClaimSwapTransaction (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration, blockNumber) {
    const block = await this.getMethod('getBlockByNumber')(blockNumber, true)
    if (!block) throw new BlockNotFoundError(`Block #${blockNumber} is not available`)

    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt) throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)

    const transaction = block.transactions.find(
      transaction => this.doesTransactionMatchClaim(transaction, initiationTransactionReceipt)
    )
    if (!transaction) return

    const transactionReceipt = await this.getMethod('getTransactionReceipt')(transaction.hash)
    if (!transactionReceipt) throw new PendingTxError(`Claim transaction receipt is not available: ${transaction.hash}`)

    if (transactionReceipt.status === '1') {
      transaction.secret = await this.getSwapSecret(transaction.hash)
      return transaction
    }
  }

  async findRefundSwapTransaction (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration, blockNumber) {
    const block = await this.getMethod('getBlockByNumber')(blockNumber, true)
    if (!block) throw new BlockNotFoundError(`Block #${blockNumber} is not available`)

    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt) throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)

    const SOL_REFUND_FUNCTION_WITHOUT0X = remove0x(SOL_REFUND_FUNCTION)
    return block.transactions.find(transaction =>
      caseInsensitiveEqual(transaction._raw.to, initiationTransactionReceipt.contractAddress) &&
      transaction._raw.input === SOL_REFUND_FUNCTION_WITHOUT0X &&
      block.timestamp >= expiration
    )
  }
}

EthereumErc20SwapProvider.SOL_CLAIM_FUNCTION = SOL_CLAIM_FUNCTION
EthereumErc20SwapProvider.SOL_REFUND_FUNCTION = SOL_REFUND_FUNCTION
EthereumErc20SwapProvider.version = version
