import Provider from '@liquality/provider'
import { padHexStart } from '@liquality/crypto'
import { sleep } from '@liquality/utils'
import { ensure0x, remove0x, ensureBlockFormat } from '@liquality/ethereum-utils'
import { BigNumber } from 'bignumber.js'

import { version } from '../package.json'

export default class EthereumERC20LoanProvider extends Provider {
  /* Source of compiled Bytecode
    import 'openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';
    import 'openzeppelin-solidity/contracts/math/SafeMath.sol';

    pragma solidity ^0.5.2;

    contract AtomicLoan {
      using SafeMath for uint256;

      address payable borrower;
      address payable lender;
      address bidder;
      
      bytes32 secretHashA1;
      bytes32 secretHashA2;
      bytes32 secretHashB1;
      bytes32 secretHashB2;
      bytes32 secretHashC;
      
      bytes32 public secretA1;
      bytes32 public secretA2;
      bytes32 public secretB1;
      bytes32 public secretB2;
      bytes32 public secretC;
      
      uint256 approveExpiration;
      uint256 loanExpiration;
      uint256 acceptExpiration;
      uint256 biddingExpiration;
      
      uint256 biddingTimeout;
      uint256 biddingRefund;
      
      uint256 public principal;
      uint256 public interest;
      uint256 public liquidationFee;
      
      bool public funded = false;
      bool public approved = false;
      bool public withdrawn = false;
      bool public bidding = false;
      bool public repaid = false;
      
      uint256 currentBid = 0;
      uint256 biddingTimeoutExpiration;
      uint256 biddingRefundExpiration;
      
      bytes32[3] public borrowerSignature;
      bytes32[3] public lenderSignature;
      
      bool liquidatedCollateralWidthdrawn = false;

      bytes32 public aCoinPubKeyPrefix;
      bytes32 public aCoinPubKeySuffix;

      ERC20 public token;

      constructor (
        bytes32[2] memory _secretHashesA,
        bytes32[2] memory _secretHashesB,
        uint256[4] memory _expirations,
        address payable _borrower,
        address payable _lender,
        uint256 _principal,
        uint256 _interest,
        uint256 _liquidationFee,
        uint256 _biddingTimeout,
        uint256 _biddingRefund,
        address _tokenAddress
      ) public {
        secretHashA1 = _secretHashesA[0];
        secretHashA2 = _secretHashesA[1];
        secretHashB1 = _secretHashesB[0];
        secretHashB2 = _secretHashesB[1];
        approveExpiration = _expirations[0];
        loanExpiration = _expirations[1];
        acceptExpiration = _expirations[2];
        biddingExpiration = _expirations[3];
        borrower = _borrower;
        lender = _lender;
        principal = _principal;
        interest = _interest;
        liquidationFee = _liquidationFee;
        biddingTimeout = _biddingTimeout;
        biddingRefund = _biddingRefund;
        token = ERC20(_tokenAddress);
      }

      function fund () public {
        require(funded == false);
        token.transferFrom(msg.sender, address(this), principal);
        funded = true;
      }
      
      function approve () public {
        require(funded == true);
        require(now <= approveExpiration);
        require(msg.sender == lender);
        approved = true;
      }
      
      function withdraw (bytes32 _secretA1) public {
        require(funded == true);
        require(approved == true);
        require(sha256(abi.encodePacked(_secretA1)) == secretHashA1);
        token.transfer(borrower, token.balanceOf(address(this)));
        withdrawn = true;
      }

      function acceptOrCancel (bytes32 _secretB1) public {
        require(sha256(abi.encodePacked(_secretB1)) == secretHashB1);
        require(now <= acceptExpiration);
        require(bidding == false);
        token.transfer(lender, token.balanceOf(address(this)));
        selfdestruct(lender);
      }
      
      function payback () public {
        require(withdrawn == true);
        require(now <= loanExpiration);
        require(msg.sender == borrower);
        token.transferFrom(borrower, address(this), principal.add(interest));
        repaid = true;
      }

      function refundPayback () public {
        require(now > acceptExpiration);
        require(repaid == true);
        require(msg.sender == borrower);
        token.transfer(borrower, token.balanceOf(address(this)));
        selfdestruct(borrower);
      }
      
      function startBidding () public {
        require(repaid == false);
        require(withdrawn == true);
        require(now > loanExpiration);
        require(msg.sender == borrower || msg.sender == lender);
        biddingTimeoutExpiration = now.add(biddingTimeout);
        biddingRefundExpiration = biddingTimeoutExpiration.add(biddingRefund);
        bidding = true;
      }
      
      function bid (bytes32 _secretHashC, uint256 _bidValue, bytes32 _aCoinPubKeyPrefix, bytes32 _aCoinPubKeySuffix) public {
        require(bidding == true);
        require(now > loanExpiration);
        require(now <= biddingTimeoutExpiration);
        require(_bidValue > currentBid);
        require(token.balanceOf(msg.sender) >= _bidValue);
        token.transferFrom(msg.sender, address(this), _bidValue);
        if (currentBid > 0) {
            token.transfer(bidder, currentBid);
        }
        bidder = msg.sender;
        currentBid = _bidValue;
        secretHashC = _secretHashC;
        aCoinPubKeyPrefix = _aCoinPubKeyPrefix;
        aCoinPubKeySuffix = _aCoinPubKeySuffix;
      }
      
      function provideSignature (bytes32[3] memory _signature) public {
        require(now > loanExpiration);
        if (msg.sender == borrower) {
          borrowerSignature[0] = _signature[0];
          borrowerSignature[1] = _signature[1];
          borrowerSignature[1] = _signature[1];
        } else if (msg.sender == lender) {
          lenderSignature[0] = _signature[0];
          lenderSignature[1] = _signature[1];
          lenderSignature[1] = _signature[1];
        } else {
          revert();
        }
      }
      
      function provideSecret (bytes32 _secret) public {
        require(now > loanExpiration);
        if (msg.sender == borrower) {
          require(sha256(abi.encodePacked(_secret)) == secretHashA2);
          secretA2 = _secret;
        } else if (msg.sender == lender) {
          require(sha256(abi.encodePacked(_secret)) == secretHashB2);
          secretB2 = _secret;
        } else if (msg.sender == bidder) {
          require(sha256(abi.encodePacked(_secret)) == secretHashC);
          secretC = _secret;
        } else {
          revert();
        }
      }
      
      function withdrawLiquidatedCollateral (bytes32 _secretA2, bytes32 _secretB2, bytes32 _secretC) public {
        require(now > biddingTimeoutExpiration);
        require(sha256(abi.encodePacked(_secretA2)) == secretHashA2);
        require(sha256(abi.encodePacked(_secretB2)) == secretHashB2);
        require(sha256(abi.encodePacked(_secretC)) == secretHashC);
        require(msg.sender == borrower || msg.sender == lender);
        if (currentBid > (principal.add(interest).add(liquidationFee))) {
          token.transfer(lender, (principal.add(interest).add(liquidationFee)));
          token.transfer(borrower, token.balanceOf(address(this)));
        } else {
          token.transfer(lender, currentBid);
        }
        selfdestruct(lender);
      }
      
      function refundBid () public {
        require(now > biddingRefundExpiration);
        require(sha256(abi.encodePacked(secretC)) != secretHashC || sha256(abi.encodePacked(secretA2)) != secretHashA2 || sha256(abi.encodePacked(secretB2)) != secretHashB2);
        require(currentBid > 0);
        token.transfer(bidder, currentBid);
        selfdestruct(lender);
      }
    }
  */

  approveLoan (contractAddress) {
    return this.getMethod('sendTransaction')(contractAddress, 0, '0x12424e3f')
  }

  withdrawLoan (contractAddress, secretA1) {
    return this.getMethod('sendTransaction')(contractAddress, 0, '0x8e19899e' + secretA1)
  }

  acceptOrCancelLoan (contractAddress, secretB1) {
    return this.getMethod('sendTransaction')(contractAddress, 0, '0x1e09d48b' + secretB1)
  }

  paybackLoan (contractAddress) {
    return this.getMethod('sendTransaction')(contractAddress, 0, '0x854bec87')
  }

  refundPaybackLoan (contractAddress) {
    return this.getMethod('sendTransaction')(contractAddress, 0, '0x21c156f9')
  }

  startBiddingLoan (contractAddress) {
    return this.getMethod('sendTransaction')(contractAddress, 0, '0x7d7b39e4')
  }

  bidLoan (contractAddress, secretHashC, bidValue, aCoinAddress) {
    const encodedBidValue = padHexStart(new BigNumber(bidValue).toString(16), 64)
    const encodedACoinAddress = padHexStart(aCoinAddress, 64)

    return this.getMethod('sendTransaction')(contractAddress, 0, '0x92b0c7ab' + secretHashC + encodedBidValue + encodedACoinAddress)
  }

  provideSignatureLoan (contractAddress, signature) {
    const encodedSignature1 = padHexStart(signature.substring(0, 64), 64)
    const encodedSignature2 = padHexStart(signature.substring(64, 128), 64)
    const encodedSignature3 = padHexStart(signature.substring(128), 64)

    return this.getMethod('sendTransaction')(contractAddress, 0, '0x0c57e902' + encodedSignature1 + encodedSignature2 + encodedSignature3)
  }

  provideSecretLoan (contractAddress, secret) {
    return this.getMethod('sendTransaction')(contractAddress, 0, '0x51db70dc' + secret)
  }

  withdrawLiquidatedCollateralLoan (contractAddress, secretA2, secretB2, secretC) {
    return this.getMethod('sendTransaction')(contractAddress, 0, '0xf5003d37' + secretA2 + secretB2 + secretC)
  }

  refundBidLoan (contractAddress) {
    return this.getMethod('sendTransaction')(contractAddress, 0, '0x3aea10a6')
  }

  async getFundedLoan (contractAddress, block) {
    const funded = await this.getMethod('jsonrpc')('eth_call', { data: '0xf3a504f2', to: ensure0x(contractAddress) }, ensureBlockFormat(block))
    return parseInt(funded, 16) === 1 ? true : false
  }

  async getApprovedLoan (contractAddress, block) {
    const approved = await this.getMethod('jsonrpc')('eth_call', { data: '0x19d40b08', to: ensure0x(contractAddress) }, ensureBlockFormat(block))
    return parseInt(approved, 16) === 1 ? true : false
  }

  async getWithdrawnLoan (contractAddress, block) {
    const withdrawn = await this.getMethod('jsonrpc')('eth_call', { data: '0xc80ec522', to: ensure0x(contractAddress) }, ensureBlockFormat(block))
    return parseInt(withdrawn, 16) === 1 ? true : false
  }

  async getBiddingLoan (contractAddress, block) {
    const bidding = await this.getMethod('jsonrpc')('eth_call', { data: '0xdb774c79', to: ensure0x(contractAddress) }, ensureBlockFormat(block))
    return parseInt(bidding, 16) === 1 ? true : false
  }

  async getRepaidLoan (contractAddress, block) {
    const repaid = await this.getMethod('jsonrpc')('eth_call', { data: '0xfbb27dce', to: ensure0x(contractAddress) }, ensureBlockFormat(block))
    return parseInt(repaid, 16) === 1 ? true : false
  }

  async getPrincipalAmount (contractAddress, block) {
    const principal = await this.getMethod('jsonrpc')('eth_call', { data: '0xba5d3078', to: ensure0x(contractAddress) }, ensureBlockFormat(block))
    return parseInt(principal, 16)
  }

  async getInterestAmount (contractAddress, block) {
    const interest = await this.getMethod('jsonrpc')('eth_call', { data: '0xc392f766', to: ensure0x(contractAddress) }, ensureBlockFormat(block))
    return parseInt(interest, 16)
  }

  async getLiquidationFeeAmount (contractAddress, block) {
    const liquidationFee = await this.getMethod('jsonrpc')('eth_call', { data: '0xa36a3630', to: ensure0x(contractAddress) }, ensureBlockFormat(block))
    return parseInt(liquidationFee, 16)
  }

  async getSignatureLoan (contractAddress, type, block) {
    let functionSignature
    if (type === 'borrower') {
      functionSignature = '0xd5f2eef9'
    } else if (type === 'lender') {
      functionSignature = '0xaf0e7458'
    } else {
      functionSignature = '0x9e264051'
    }
    let signature = []
    for (let i = 0; i < 3; i++) {
      const signaturePart = await this.getMethod('jsonrpc')('eth_call', { data: functionSignature + padHexStart(i.toString(16), 64), to: ensure0x(contractAddress) }, ensureBlockFormat(block))
      signature.push(signaturePart)
    }
    signature[2] = padHexStart(parseInt(signature[2], 16).toString(16))
    return signature.join('')
  }

  async getBorrowerPubKey (contractAddress, block) {
    const prefixFunctionSignature = '0xac6bd7e4'
    const suffixFunctionSignature = '0x527a438f'
    const prefixBorrowerPubKey = await this.getMethod('jsonrpc')('eth_call', { data: prefixFunctionSignature, to: ensure0x(contractAddress) }, ensureBlockFormat(block))
    const suffixBorrowerPubKey = await this.getMethod('jsonrpc')('eth_call', { data: suffixFunctionSignature, to: ensure0x(contractAddress) }, ensureBlockFormat(block))
    return padHexStart(parseInt(prefixBorrowerPubKey, 16).toString(16)) + suffixBorrowerPubKey
  }

  async getApproveExpiration (contractAddress, block) {
    const approveExpiration = await this.getMethod('jsonrpc')('eth_call', { data: '0x110bba8d', to: ensure0x(contractAddress) }, ensureBlockFormat(block))
    return parseInt(approveExpiration, 16)
  }

  async getLoanExpiration (contractAddress, block) {
    const loanExpiration = await this.getMethod('jsonrpc')('eth_call', { data: '0xbd2f2882', to: ensure0x(contractAddress) }, ensureBlockFormat(block))
    return parseInt(loanExpiration, 16)
  }

  async getAcceptExpiration (contractAddress, block) {
    const acceptExpiration = await this.getMethod('jsonrpc')('eth_call', { data: '0xdc1b294c', to: ensure0x(contractAddress) }, ensureBlockFormat(block))
    return parseInt(acceptExpiration, 16)
  }

  async getBiddingExpiration (contractAddress, block) {
    const biddingExpiration = await this.getMethod('jsonrpc')('eth_call', { data: '0x9f2fe458', to: ensure0x(contractAddress) }, ensureBlockFormat(block))
    return parseInt(biddingExpiration, 16)
  }

  async getSecretHashA1 (contractAddress, block) {
    return this.getMethod('jsonrpc')('eth_call', { data: '0xa0015613', to: ensure0x(contractAddress) }, ensureBlockFormat(block))
  }

  async getSecretHashA2 (contractAddress, block) {
    return this.getMethod('jsonrpc')('eth_call', { data: '0x5e87bcd9', to: ensure0x(contractAddress) }, ensureBlockFormat(block))
  }

  async getSecretHashB1 (contractAddress, block) {
    return this.getMethod('jsonrpc')('eth_call', { data: '0xd0034030', to: ensure0x(contractAddress) }, ensureBlockFormat(block))
  }

  async getSecretHashB2 (contractAddress, block) {
    return this.getMethod('jsonrpc')('eth_call', { data: '0xa4e10668', to: ensure0x(contractAddress) }, ensureBlockFormat(block))
  }
}

EthereumERC20LoanProvider.version = version
