import Provider from '../../Provider'
// import { padHexStart } from '../../crypto'
// import { ensureAddressStandardFormat } from './EthereumUtil'
import solc from 'solc'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

export default class EthereumERC20SwapProvider extends Provider {
  createSwapScript (recipientAddress, refundAddress, secretHash, expiration) {
    const contractCode = `
    pragma solidity ^0.5.1;

    contract ERC20 {
        function balanceOf(address tokenOwner) public view returns (uint balance);
        function transfer(address to, uint tokens) public returns (bool success);
    }
    
    contract HTLC {
            
            address payable recipient = 0xc633C8d9e80a5E10bB939812b548b821554c49A6;
            address payable receiver = 0x06560D4340EAE1d64310144Fe957231843071c63;
            ERC20 token = ERC20(0x13078b88dB1D63Bc7390Ec47642cE8A41CcC126e);
            bytes32 hashedSecret = "0x01";
            
            function claim(bytes32 secret) public {
                require(keccak256(abi.encodePacked(secret)) == hashedSecret);
                token.transfer(recipient, token.balanceOf(address(this)));
                selfdestruct(recipient);
            }
    
            function refund () public {
                require(now > 1);
                token.transfer(receiver, token.balanceOf(address(this)));
                selfdestruct(receiver);
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
    console.log('Will find')
    let tx = await this.findContractDeployTransaction(recipientAddress, refundAddress, secretHash, expiration)
    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(tx.hash)
    return this.getMethod('erc20Transfer')(initiationTransactionReceipt.contractAddress, value)
  }

  async claimSwap (initiationTxHash, recipientAddress, refundAddress, secret, expiration) {
    const initiationTransaction = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    return this.getMethod('sendTransaction')(initiationTransaction.contractAddress, 0, secret)
  }

  async refundSwap (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration) {
    const initiationTransaction = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    return this.getMethod('sendTransaction')(initiationTransaction.contractAddress, 0, '')
  }

  doesTransactionMatchSwapParams (transaction, recipientAddress, refundAddress, secretHash, expiration) {
    const data = this.createSwapScript(recipientAddress, refundAddress, secretHash, expiration)
    return transaction.input === data
  }

  async verifyInitiateSwapTransaction (initiationTxHash, value, recipientAddress, refundAddress, secretHash, expiration) {
    const initiationTransaction = await this.getMethod('getTransactionByHash')(initiationTxHash)
    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    const transactionMatchesSwapParams = this.doesTransactionMatchSwapParams(initiationTransaction, value, recipientAddress, refundAddress, secretHash, expiration)
    return transactionMatchesSwapParams && initiationTransactionReceipt.status === '1'
  }

  async findContractDeployTransaction (recipientAddress, refundAddress, secretHash, expiration) {
    console.log('find it')
    let blockNumber = await this.getMethod('getBlockHeight')()
    let initiateSwapTransaction = null
    console.log(blockNumber)
    while (!initiateSwapTransaction) {
      const block = await this.getMethod('getBlockByNumber')(blockNumber, true)
      console.log(block)
      if (block) {
        initiateSwapTransaction = block.transactions.find(transaction =>
          this.doesTransactionMatchSwapParams(transaction, recipientAddress, refundAddress, secretHash, expiration)
        )
        blockNumber++
      }
      await sleep(5000)
    }
    let contractBalance = 0
    while (contractBalance === 1) {
      contractBalance = 2
      await sleep(5000)
    }
    return initiateSwapTransaction
  }

  async findInitiateSwapTransaction (value, recipientAddress, refundAddress, secretHash, expiration) {
    let tx = await this.findContractDeployTransaction(recipientAddress, refundAddress, secretHash, expiration)
    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(tx.hash)
    let contractBalance = 0
    while (contractBalance === 0) {
      contractBalance = await this.getMethod('erc20Balance')(initiationTransactionReceipt.contractAddress)
      await sleep(5000)
    }
    return initiationTransactionReceipt
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
    return claimTransaction.input
  }
}
