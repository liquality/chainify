// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

import './ILiqualityHTLC.sol';
import './LibTransfer.sol';

/// @title LiqualityHTLC
/// @notice HTLC contract to support Liquality's cross-chain swaps.
contract LiqualityHTLC is ILiqualityHTLC {
    using SafeERC20 for IERC20;

    mapping(bytes32 => HTLCData) public htlcs;

    /// @inheritdoc ILiqualityHTLC
    function initiate(HTLCData calldata htlc) external payable returns (bytes32 id) {
        if (htlc.expiration < block.timestamp) {
            revert LiqualityHTLC__InvalidExpiration();
        }

        if (htlc.amount == 0) {
            revert LiqualityHTLC__InvalidSwapAmount();
        }

        // handle Ether swaps
        if (htlc.tokenAddress == address(0x0)) {
            if (htlc.amount != msg.value) {
                revert LiqualityHTLC__InvalidMsgValue();
            }
        }
        // handle ERC20 swaps
        else {
            // protection against permanantly locking ETH when using ERC20 tokens
            if (msg.value > 0) {
                revert LiqualityHTLC__InvalidMsgValue();
            }
            IERC20(htlc.tokenAddress).safeTransferFrom(msg.sender, address(this), htlc.amount);
        }

        id = sha256(
            abi.encodePacked(htlc.refundAddress, block.timestamp, htlc.amount, htlc.expiration, htlc.secretHash, htlc.recipientAddress)
        );

        if (htlcs[id].expiration != 0) {
            revert LiqualityHTLC__SwapAlreadyExists();
        }

        htlcs[id] = htlc;
        emit Initiate(id, htlc);
    }

    /// @inheritdoc ILiqualityHTLC
    function claim(bytes32 id, bytes32 secret) external {
        HTLCData memory h = htlcs[id];

        if (h.expiration == 0) {
            revert LiqualityHTLC__SwapDoesNotExist();
        }

        if (sha256(abi.encodePacked(secret)) != h.secretHash) {
            revert LiqualityHTLC__WrongSecret();
        }

        // free some storage for gas refund
        delete htlcs[id];

        emit Claim(id, secret);

        // handle Ether claims
        if (h.tokenAddress == address(0x0)) {
            LibTransfer.transferEth(h.recipientAddress, h.amount);
        }
        // handle ERC20 claims
        else {
            IERC20(h.tokenAddress).safeTransfer(h.recipientAddress, h.amount);
        }
    }

    /// @inheritdoc ILiqualityHTLC
    function refund(bytes32 id) external {
        HTLCData memory h = htlcs[id];

        if (h.expiration == 0) {
            revert LiqualityHTLC__SwapDoesNotExist();
        }

        if (block.timestamp <= h.expiration) {
            revert LiqualityHTLC__SwapNotExpired();
        }

        // free some storage for gas refund
        delete htlcs[id];

        emit Refund(id);

        // handle Ether refunds
        if (h.tokenAddress == address(0x0)) {
            LibTransfer.transferEth(h.refundAddress, h.amount);
        }
        // handle ERC20 refunds
        else {
            IERC20(h.tokenAddress).safeTransfer(h.refundAddress, h.amount);
        }
    }
}
