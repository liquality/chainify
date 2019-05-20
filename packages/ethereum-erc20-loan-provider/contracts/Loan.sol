import 'openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';

pragma solidity ^0.5.2;

contract AtomicLoan {
    using SafeMath for uint256;

    address payable borrower;
    address payable lender;
    address bidder;
    
    bytes32 public secretHashA1;
    bytes32 public secretHashA2;
    bytes32 public secretHashB1;
    bytes32 public secretHashB2;
    bytes32 public secretHashC;
    
    bytes32 public secretA2;
    bytes32 public secretB2;
    bytes32 public secretC;
    
    uint256 public approveExpiration;
    uint256 public loanExpiration;
    uint256 public acceptExpiration;
    uint256 public biddingExpiration;
    
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

    bytes32 public aCoinPubKeyHash;

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
        address _tokenAddress,
        bytes32[2] memory _aCoinPubKey
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
        aCoinPubKeyPrefix = _aCoinPubKey[0];
        aCoinPubKeySuffix = _aCoinPubKey[1];
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
    
    function bid (bytes32 _secretHashC, uint256 _bidValue, bytes32 _aCoinPubKeyHash) public {
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
        aCoinPubKeyHash = _aCoinPubKeyHash;
    }
    
    function provideSignature (bytes32[3] memory _signature) public {
        require(now > loanExpiration); // Is this needed? 
        if (msg.sender == borrower) {
            borrowerSignature[0] = _signature[0];
            borrowerSignature[1] = _signature[1];
            borrowerSignature[2] = _signature[2];
        } else if (msg.sender == lender) {
            lenderSignature[0] = _signature[0];
            lenderSignature[1] = _signature[1];
            lenderSignature[2] = _signature[2];
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