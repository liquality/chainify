import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

contract TestERC20 is ERC20 {
    constructor() ERC20('Test', 'TT') {}

    function mint(address account, uint256 amount) external {
        _mint(account, amount);
    }
}
