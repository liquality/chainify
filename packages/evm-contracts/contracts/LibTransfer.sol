// SPDX-License-Identifier: MIT

pragma solidity >=0.8.11;

library LibTransfer {
    function transferEth(address to, uint256 value) internal {
        // solhint-disable-next-line
        (bool success, ) = to.call{ value: value }('');
        require(success, 'transfer failed');
    }
}
