import { Provider } from '@liquality/provider'
import { padHexStart } from '@liquality/crypto'
import {
  addressToString,
  caseInsensitiveEqual,
  validateValue,
  validateSecret,
  validateSecretHash,
  validateSecretAndHash
} from '@liquality/utils'
import { remove0x, ensure0x, validateAddress, validateExpiration } from '@liquality/ethereum-utils'
import {
  SwapProvider,
  SwapParams,
  Block,
  Transaction,
  BigNumber,
  Address,
  ethereum,
  EIP1559Fee
} from '@liquality/types'
import {
  PendingTxError,
  TxNotFoundError,
  TxFailedError,
  BlockNotFoundError,
  InvalidDestinationAddressError,
  InsufficientBalanceError
} from '@liquality/errors'

const SOL_CLAIM_FUNCTION = '0xbd66528a' // claim(bytes32)
const SOL_REFUND_FUNCTION = '0x590e1ae3' // refund()

export default class EthereumErc20SwapProvider extends Provider implements Partial<SwapProvider> {
  static SOL_CLAIM_FUNCTION = SOL_CLAIM_FUNCTION
  static SOL_REFUND_FUNCTION = SOL_REFUND_FUNCTION

  createSwapScript(swapParams: SwapParams) {
    this.validateSwapParams(swapParams)

    const recipientAddress = remove0x(addressToString(swapParams.recipientAddress))
    const refundAddress = remove0x(addressToString(swapParams.refundAddress))
    const expirationEncoded = padHexStart(swapParams.expiration.toString(16), 32)
    const tokenAddress = remove0x(this.getMethod('getContractAddress')())

    const bytecode = [
      '6080604052600080546001600160a01b031990811673',
      recipientAddress,
      '1790915560018054821673',
      refundAddress,
      '17905560028054821673',
      tokenAddress,
      '1790819055600380549092166001600160a01b03919091161790557f',
      swapParams.secretHash,
      '6004553480156100b157600080fd5b50610555806100c16000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c8063590e1ae31461003b578063bd66528a14610045575b600080fd5b610043610062565b005b6100436004803603602081101561005b57600080fd5b5035610235565b6004361461006f57600080fd5b7f',
      expirationEncoded,
      '421161009b57600080fd5b600354604080516370a0823160e01b815230600482015290516000926001600160a01b0316916370a08231916024808301926020929190829003018186803b1580156100e657600080fd5b505afa1580156100fa573d6000803e3d6000fd5b505050506040513d602081101561011057600080fd5b505190508061011e57600080fd5b600154600354604080516370a0823160e01b815230600482015290516101fe9363a9059cbb60e01b936001600160a01b03918216939116916370a0823191602480820192602092909190829003018186803b15801561017c57600080fd5b505afa158015610190573d6000803e3d6000fd5b505050506040513d60208110156101a657600080fd5b5051604080516001600160a01b0390931660248401526044808401929092528051808403909201825260649092019091526020810180516001600160e01b03166001600160e01b03199093169290921790915261040d565b6040517f5d26862916391bf49478b2f5103b0720a842b45ef145a268f2cd1fb2aed5517890600090a16001546001600160a01b0316ff5b6024361461024257600080fd5b600454600282604051602001808281526020019150506040516020818303038152906040526040518082805190602001908083835b602083106102965780518252601f199092019160209182019101610277565b51815160209384036101000a60001901801990921691161790526040519190930194509192505080830381855afa1580156102d5573d6000803e3d6000fd5b5050506040513d60208110156102ea57600080fd5b5051146102f657600080fd5b600354604080516370a0823160e01b815230600482015290516000926001600160a01b0316916370a08231916024808301926020929190829003018186803b15801561034157600080fd5b505afa158015610355573d6000803e3d6000fd5b505050506040513d602081101561036b57600080fd5b505190508061037957600080fd5b600054604080516001600160a01b039092166024830152604480830184905281518084039091018152606490920190526020810180516001600160e01b031663a9059cbb60e01b1790526103cc9061040d565b6040805183815290517f8c1d64e3bd87387709175b9ef4e7a1d7a8364559fc0e2ad9d77953909a0d1eb39181900360200190a16000546001600160a01b0316ff5b600061041882610446565b8051909150156104425780806020019051602081101561043757600080fd5b505161044257600080fd5b5050565b600254604051825160609260009283926001600160a01b0390921691869190819060208401908083835b6020831061048f5780518252601f199092019160209182019101610470565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d80600081146104f1576040519150601f19603f3d011682016040523d82523d6000602084013e6104f6565b606091505b5091509150811561050a57915061051a9050565b8051156100365780518082602001fd5b91905056fea2646970667358221220439a725cbd518d89b852af5b7e1c335cc4ba64e029f96f6c702b2e60fb985ba564736f6c63430007060033'
    ]
      .join('')
      .toLowerCase()

    if (Buffer.byteLength(bytecode) !== 3116) {
      throw new Error('Invalid swap script. Bytecode length incorrect.')
    }

    return bytecode
  }

  validateSwapParams(swapParams: SwapParams) {
    validateValue(swapParams.value)
    validateAddress(swapParams.recipientAddress)
    validateAddress(swapParams.refundAddress)
    validateSecretHash(swapParams.secretHash)
    validateExpiration(swapParams.expiration)
  }

  async initiateSwap(swapParams: SwapParams, gasPrice: EIP1559Fee | number) {
    this.validateSwapParams(swapParams)

    const addresses: Address[] = await this.getMethod('getAddresses')()
    const balance = await this.client.chain.getBalance(addresses)

    if (balance.isLessThan(swapParams.value)) {
      throw new InsufficientBalanceError(
        `${addresses[0]} doesn't have enough balance (has: ${balance}, want: ${swapParams.value})`
      )
    }

    const bytecode = this.createSwapScript(swapParams)
    return this.client.chain.sendTransaction({
      to: null,
      value: new BigNumber(0),
      data: bytecode,
      fee: gasPrice
    })
  }

  async fundSwap(swapParams: SwapParams, initiationTxHash: string, gasPrice: EIP1559Fee | number) {
    this.validateSwapParams(swapParams)

    const initiationTransaction = await this.getMethod('getTransactionByHash')(initiationTxHash)
    if (!initiationTransaction) throw new TxNotFoundError(`Transaction not found: ${initiationTxHash}`)

    const initiationTransactionReceipt: ethereum.TransactionReceipt = await this.getMethod('getTransactionReceipt')(
      initiationTxHash
    )
    if (!initiationTransactionReceipt)
      throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)

    const initiationSuccessful =
      initiationTransactionReceipt.contractAddress && initiationTransactionReceipt.status === '0x1'
    if (!initiationSuccessful) {
      throw new TxFailedError(
        `ERC20 swap initiation transaction failed: ${initiationTransactionReceipt.transactionHash}`
      )
    }

    const transactionMatchesSwapParams = this.doesTransactionMatchInitiation(swapParams, initiationTransaction)

    if (!transactionMatchesSwapParams) {
      throw new InvalidDestinationAddressError(
        `Contract creation does not match initiation parameters: ${initiationTxHash}`
      )
    }

    await this.getMethod('assertContractExists')(initiationTransactionReceipt.contractAddress)

    const contractHasZeroBalance = await this.doesBalanceMatchValue(
      initiationTransactionReceipt.contractAddress,
      new BigNumber(0)
    )
    if (!contractHasZeroBalance) {
      throw new InvalidDestinationAddressError(`Contract is not empty: ${initiationTransactionReceipt.contractAddress}`)
    }

    return this.client.chain.sendTransaction({
      to: initiationTransactionReceipt.contractAddress,
      value: swapParams.value,
      fee: gasPrice
    })
  }

  async claimSwap(swapParams: SwapParams, initiationTxHash: string, secret: string, gasPrice: EIP1559Fee | number) {
    this.validateSwapParams(swapParams)
    validateSecret(secret)
    validateSecretAndHash(secret, swapParams.secretHash)
    await this.verifyInitiateSwapTransaction(swapParams, initiationTxHash)

    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt)
      throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)

    await this.getMethod('assertContractExists')(initiationTransactionReceipt.contractAddress)

    return this.client.chain.sendTransaction({
      to: initiationTransactionReceipt.contractAddress,
      value: new BigNumber(0),
      data: SOL_CLAIM_FUNCTION + secret,
      fee: gasPrice
    })
  }

  async refundSwap(swapParams: SwapParams, initiationTxHash: string, gasPrice: EIP1559Fee | number) {
    this.validateSwapParams(swapParams)
    await this.verifyInitiateSwapTransaction(swapParams, initiationTxHash)

    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt)
      throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)

    await this.getMethod('assertContractExists')(initiationTransactionReceipt.contractAddress)

    return this.client.chain.sendTransaction({
      to: initiationTransactionReceipt.contractAddress,
      value: new BigNumber(0),
      data: SOL_REFUND_FUNCTION,
      fee: gasPrice
    })
  }

  doesTransactionMatchInitiation(swapParams: SwapParams, transaction: Transaction<ethereum.Transaction>) {
    const data = this.createSwapScript(swapParams)
    return transaction._raw.to === null && transaction._raw.input === ensure0x(data)
  }

  doesTransactionMatchClaim(
    swapParams: SwapParams,
    transaction: Transaction<ethereum.Transaction>,
    initiationTransactionReceipt: ethereum.TransactionReceipt
  ) {
    return (
      caseInsensitiveEqual(transaction._raw.to, initiationTransactionReceipt.contractAddress) &&
      transaction._raw.input.startsWith(SOL_CLAIM_FUNCTION)
    )
  }

  doesTransactionMatchFunding(
    transaction: Transaction<ethereum.Transaction>,
    erc20TokenContractAddress: string,
    contractData: string
  ) {
    return (
      caseInsensitiveEqual(transaction._raw.to, erc20TokenContractAddress) &&
      transaction._raw.input === ensure0x(contractData)
    )
  }

  async doesBalanceMatchValue(contractAddress: string, value: BigNumber) {
    const balance = await this.client.chain.getBalance([contractAddress])
    return balance.isEqualTo(value)
  }

  async getSwapSecret(claimTxHash: string) {
    const claimTransaction = await this.getMethod('getTransactionByHash')(claimTxHash)
    return remove0x(claimTransaction._raw.input).substring(8)
  }

  async verifyInitiateSwapTransaction(swapParams: SwapParams, initiationTxHash: string) {
    this.validateSwapParams(swapParams)

    const initiationTransaction = await this.getMethod('getTransactionByHash')(initiationTxHash)
    if (!initiationTransaction) throw new TxNotFoundError(`Transaction not found: ${initiationTxHash}`)

    const initiationTransactionReceipt: ethereum.TransactionReceipt = await this.getMethod('getTransactionReceipt')(
      initiationTxHash
    )
    if (!initiationTransactionReceipt)
      throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)

    await this.getMethod('assertContractExists')(initiationTransactionReceipt.contractAddress)

    const transactionMatchesSwapParams = this.doesTransactionMatchInitiation(swapParams, initiationTransaction)

    const balanceMatchValue = await this.doesBalanceMatchValue(
      initiationTransactionReceipt.contractAddress,
      swapParams.value
    )

    return (
      transactionMatchesSwapParams &&
      initiationTransactionReceipt.contractAddress &&
      initiationTransactionReceipt.status === '0x1' &&
      balanceMatchValue
    )
  }

  async findInitiateSwapTransaction(swapParams: SwapParams, blockNumber: number) {
    this.validateSwapParams(swapParams)

    const block: Block<Transaction<ethereum.Transaction>> = await this.getMethod('getBlockByNumber')(blockNumber, true)
    if (!block) throw new BlockNotFoundError(`Block #${blockNumber} is not available`)

    return block.transactions.find((transaction) => this.doesTransactionMatchInitiation(swapParams, transaction))
  }

  async findFundSwapTransaction(swapParams: SwapParams, initiationTxHash: string, blockNumber: number) {
    this.validateSwapParams(swapParams)

    const block: Block<Transaction<ethereum.Transaction>> = await this.getMethod('getBlockByNumber')(blockNumber, true)
    if (!block) throw new BlockNotFoundError(`Block #${blockNumber} is not available`)

    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt)
      throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)

    const erc20TokenContractAddress = await this.getMethod('getContractAddress')()
    const contractData = await this.getMethod('generateErc20Transfer')(
      initiationTransactionReceipt.contractAddress,
      swapParams.value
    )

    const tx = block.transactions.find((transaction) =>
      this.doesTransactionMatchFunding(transaction, erc20TokenContractAddress, contractData)
    )

    if (!tx) throw new TxNotFoundError(`Funding transaction is not available: ${initiationTxHash}`)

    return tx
  }

  async findClaimSwapTransaction(swapParams: SwapParams, initiationTxHash: string, blockNumber: number) {
    this.validateSwapParams(swapParams)

    const block: Block<Transaction<ethereum.Transaction>> = await this.getMethod('getBlockByNumber')(blockNumber, true)
    if (!block) throw new BlockNotFoundError(`Block #${blockNumber} is not available`)

    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt)
      throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)

    const transaction = block.transactions.find((transaction) =>
      this.doesTransactionMatchClaim(swapParams, transaction, initiationTransactionReceipt)
    )
    if (!transaction) return

    const transactionReceipt: ethereum.TransactionReceipt = await this.getMethod('getTransactionReceipt')(
      transaction.hash
    )
    if (!transactionReceipt) throw new PendingTxError(`Claim transaction receipt is not available: ${transaction.hash}`)

    if (transactionReceipt.status === '0x1') {
      const secret = await this.getSwapSecret(transaction.hash)
      validateSecretAndHash(secret, swapParams.secretHash)
      transaction.secret = secret
      return transaction
    }
  }

  async findRefundSwapTransaction(swapParams: SwapParams, initiationTxHash: string, blockNumber: number) {
    this.validateSwapParams(swapParams)

    const block: Block<Transaction<ethereum.Transaction>> = await this.getMethod('getBlockByNumber')(blockNumber, true)
    if (!block) throw new BlockNotFoundError(`Block #${blockNumber} is not available`)

    const initiationTransactionReceipt: ethereum.TransactionReceipt = await this.getMethod('getTransactionReceipt')(
      initiationTxHash
    )
    if (!initiationTransactionReceipt)
      throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)

    return block.transactions.find(
      (transaction) =>
        caseInsensitiveEqual(transaction._raw.to, initiationTransactionReceipt.contractAddress) &&
        transaction._raw.input === SOL_REFUND_FUNCTION &&
        block.timestamp >= swapParams.expiration
    )
  }
}
