// SPDX-License-Identifier: MIT
// optimize=true&runs=200&evmVersion=null&version=soljson-v0.7.4+commit.3f05b770.js
pragma solidity ^0.7.4;

interface ERC20 {
  function balanceOf(address tokenOwner) external view returns (uint balance);
  function transfer(address to, uint tokens) external returns (bool success);
}

contract HTLC {
  address payable recipientAddress = 0x1111111111111111111111111111111111111111;
  address payable refundAddress = 0x2222222222222222222222222222222222222222;
  address tokenAddress = 0x3333333333333333333333333333333333333333;
  ERC20 token = ERC20(tokenAddress);
  bytes32 hashedSecret = 0x4444444444444444444444444444444444444444444444444444444444444444;

  function claim(bytes32 secret) public {
    require(sha256(abi.encodePacked(secret)) == hashedSecret);
    uint balance = token.balanceOf(address(this));
    require(balance > 0);
    _callOptionalReturn(abi.encodeWithSelector(token.transfer.selector, recipientAddress, balance));
    selfdestruct(recipientAddress);
  }

  function refund () public {
    require(block.timestamp > 0x5555555555555555555555555555555555555555555555555555555555555555);
    _callOptionalReturn(abi.encodeWithSelector(token.transfer.selector, refundAddress, token.balanceOf(address(this))));
    selfdestruct(refundAddress);
  }

  /**
    * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
    * on the return value: the return value is optional (but if data is returned, it must not be false).
    * @param data The call data (encoded using abi.encode or one of its variants).
    */
  function _callOptionalReturn(bytes memory data) private {
      // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
      // we're implementing it ourselves. We use {Address.functionCall} to perform this call, which verifies that
      // the target address contains contract code and also asserts for success in the low-level call.

    bytes memory returndata = _functionCall(data);
    if (returndata.length > 0) { // Return data is optional
        // solhint-disable-next-line max-line-length
      require(abi.decode(returndata, (bool)));
    }
  }

  function _functionCall(bytes memory data) private returns (bytes memory) {
    // solhint-disable-next-line avoid-low-level-calls
    (bool success, bytes memory returndata) = tokenAddress.call(data);
    if (success) {
      return returndata;
    } else {
        // Look for revert reason and bubble it up if present
      if (returndata.length > 0) {
        // The easiest way to bubble the revert reason is using memory via assembly

        // solhint-disable-next-line no-inline-assembly
        assembly {
          let returndata_size := mload(returndata)
          revert(add(32, returndata), returndata_size)
        }
      } else {
        revert();
      }
    }
  }
}
