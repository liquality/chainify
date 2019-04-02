import Provider from '../../Provider'
// import { padHexStart } from '../../crypto'
import { ensureAddressStandardFormat } from './EthereumUtil'
import solc from 'solc'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

// TODO Get contract address from constructor
export default class EthereumERC20SwapProvider extends Provider {
  createSwapScript (recipientAddress, refundAddress, secretHash, expiration) {
    const contractCode = `
    pragma solidity ^0.5.1;

    contract ERC20 {
        function balanceOf(address tokenOwner) public view returns (uint balance);
        function transfer(address to, uint tokens) public returns (bool success);
    }
    
    contract HTLC {
            
            address payable recipientAddress = address(0x00` + ensureAddressStandardFormat(recipientAddress) + `);
            address payable refundAddress = address(0x00` + ensureAddressStandardFormat(refundAddress) + `);
            ERC20 token = ERC20(0x00` + ensureAddressStandardFormat(this.getMethod('erc20')()) + `);
            bytes32 hashedSecret = 0x` + secretHash + `;
            
            function claim(bytes32 secret) public {
                require(sha256(abi.encodePacked(secret)) == hashedSecret);
                token.transfer(recipientAddress, token.balanceOf(address(this)));
                selfdestruct(recipientAddress);
            }
    
            function refund () public {
                require(now > ` + expiration + `);
                token.transfer(refundAddress, token.balanceOf(address(this)));
                selfdestruct(refundAddress);
            }
    }
    `
    var input = {
      language: 'Solidity',
      sources: {
        'htlc.sol': {
          content: contractCode
        }
      },
      settings: {
        outputSelection: {
          '*': {
            '*': ['*']
          }
        }
      }
    }
    const code = JSON.parse(solc.compile(JSON.stringify(input)))
    return code.contracts['htlc.sol']['HTLC'].evm.bytecode.object
  }

  async initiateSwap (value, recipientAddress, refundAddress, secretHash, expiration) {
    const bytecode = this.createSwapScript(recipientAddress, refundAddress, secretHash, expiration)
    await this.getMethod('sendTransaction')(null, 0, bytecode)
    const tx = await this.findContractDeployTransaction(value, recipientAddress, refundAddress, secretHash, expiration)
    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(tx.hash)
    await this.getMethod('erc20Transfer')(initiationTransactionReceipt.contractAddress, value)
    let contractBalanceMatchesValue = false
    while (!contractBalanceMatchesValue) {
      contractBalanceMatchesValue = await this.doesBalanceMatchValue(initiationTransactionReceipt.contractAddress, value)
      await sleep(5000)
    }
    return tx.hash
  }

  async claimSwap (initiationTxHash, recipientAddress, refundAddress, secret, expiration) {
    const initiationTransaction = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    return this.getMethod('sendTransaction')(initiationTransaction.contractAddress, 0, '0xbd66528a' + secret)
  }

  async refundSwap (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration) {
    const initiationTransaction = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    return this.getMethod('sendTransaction')(initiationTransaction.contractAddress, 0, '0x590e1ae3')
  }

  doesTransactionMatchSwapParams (transaction, recipientAddress, refundAddress, secretHash, expiration) {
    const data = this.createSwapScript(recipientAddress, refundAddress, secretHash, expiration)
    return transaction.input === data
  }

  async doesBalanceMatchValue (contractAddress, value) {
    const balance = await this.getMethod('erc20Balance')([contractAddress])
    return balance === value
  }

  async verifyInitiateSwapTransaction (initiationTxHash, value, recipientAddress, refundAddress, secretHash, expiration) {
    const initiationTransaction = await this.getMethod('getTransactionByHash')(initiationTxHash)
    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    const transactionMatchesSwapParams = this.doesTransactionMatchSwapParams(initiationTransaction, recipientAddress, refundAddress, secretHash, expiration)
    return transactionMatchesSwapParams && initiationTransactionReceipt.status === '1'
  }

  async findContractDeployTransaction (value, recipientAddress, refundAddress, secretHash, expiration) {
    let blockNumber = await this.getMethod('getBlockHeight')()
    let initiateSwapTransaction = null
    while (!initiateSwapTransaction) {
      const block = await this.getMethod('getBlockByNumber')(blockNumber, true)
      if (block) {
        initiateSwapTransaction = block.transactions.find(transaction =>
          this.doesTransactionMatchSwapParams(transaction, recipientAddress, refundAddress, secretHash, expiration)
        )
        blockNumber++
      }
      await sleep(5000)
    }
    return initiateSwapTransaction
  }

  async findInitiateSwapTransaction (value, recipientAddress, refundAddress, secretHash, expiration) {
    let tx = await this.findContractDeployTransaction(value, recipientAddress, refundAddress, secretHash, expiration)
    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(tx.hash)
    let contractBalanceMatchesValue = false
    while (!contractBalanceMatchesValue) {
      contractBalanceMatchesValue = await this.doesBalanceMatchValue(initiationTransactionReceipt.contractAddress, value)
      await sleep(5000)
    }
    return tx
  }

  async findClaimSwapTransaction (initiationTxHash) {
    let blockNumber = await this.getMethod('getBlockHeight')()
    let claimSwapTransaction = null
    while (!claimSwapTransaction) {
      const initiationTransaction = await this.getMethod('getTransactionReceipt')(initiationTxHash)
      const block = await this.getMethod('getBlockByNumber')(blockNumber, true)
      if (block && initiationTransaction) {
        const transaction = block.transactions.find(transaction => transaction.to === initiationTransaction.contractAddress)
        if (transaction) {
          const transactionReceipt = await this.getMethod('getTransactionReceipt')(transaction.hash)
          if (transactionReceipt.status === '1') claimSwapTransaction = transaction
        }
        blockNumber++
      }
      await sleep(5000)
    }
    claimSwapTransaction.secret = await this.getSwapSecret(claimSwapTransaction.hash)
    return claimSwapTransaction
  }

  async getSwapSecret (claimTxHash) {
    const claimTransaction = await this.getMethod('getTransactionByHash')(claimTxHash)
    return claimTransaction.input.substring(8)
  }
}
