pragma solidity ^0.5.1;

contract ERC20 {
  function balanceOf(address tokenOwner) public view returns (uint balance);
  function transfer(address to, uint tokens) public returns (bool success);
}

contract HTLC {
  address payable recipientAddress = 0x0;
  address payable refundAddress = 0x0;
  ERC20 token = ERC20(0x0);
  bytes32 hashedSecret = 0x0;
  function claim(bytes32 secret) public {
    require(sha256(abi.encodePacked(secret)) == hashedSecret);
    token.transfer(recipientAddress, token.balanceOf(address(this)));
    selfdestruct(recipientAddress);
  }
  function refund () public {
    require(now > 0);
    token.transfer(refundAddress, token.balanceOf(address(this)));
    selfdestruct(refundAddress);
  }
}
