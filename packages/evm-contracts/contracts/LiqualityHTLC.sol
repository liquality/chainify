// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

import './ILiqualityHTLC.sol';

/// @title LiqualityHTLC
/// @notice HTLC contract to support Liquality's cross-chain swaps.
contract LiqualityHTLC is ILiqualityHTLC {
    using SafeERC20 for IERC20;

    mapping(bytes32 => HTLCData) public htlcs;

    /// @inheritdoc ILiqualityHTLC
    function initiate(HTLCData calldata htlc) external payable {
        if (htlc.refundAddress != msg.sender) {
            revert LiqualityHTLC__InvalidSender();
        }

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
            IERC20(htlc.tokenAddress).safeTransferFrom(htlc.refundAddress, address(this), htlc.amount);
        }

        bytes32 id = sha256(
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
        // sig(4) + id(32) + secret(32)
        if (msg.data.length != 68) {
            revert LiqualityHTLC__BadSecretLength(msg.data.length);
        }

        HTLCData memory h = htlcs[id];

        if (h.refundAddress == address(0x0)) {
            revert LiqualityHTLC__SwapDoesNotExist();
        }

        if (sha256(abi.encodePacked(secret)) != h.secretHash) {
            revert LiqualityHTLC__WrongSecret();
        }

        // handle Ether claims
        if (h.tokenAddress == address(0x0)) {
            payable(h.recipientAddress).transfer(h.amount);
        }
        // handle ERC20 claims
        else {
            IERC20(h.tokenAddress).safeTransfer(h.recipientAddress, h.amount);
        }

        // free some storage for gas refund
        delete htlcs[id];
        emit Claim(id, secret);
    }

    /// @inheritdoc ILiqualityHTLC
    function refund(bytes32 id) external {
        HTLCData memory h = htlcs[id];

        if (h.refundAddress == address(0x0)) {
            revert LiqualityHTLC__SwapDoesNotExist();
        }

        if (block.timestamp <= h.expiration) {
            revert LiqualityHTLC__SwapNotExpired();
        }

        // handle Ether refunds
        if (h.tokenAddress == address(0x0)) {
            payable(h.refundAddress).transfer(h.amount);
        }
        // handle ERC20 refunds
        else {
            IERC20(h.tokenAddress).safeTransfer(h.refundAddress, h.amount);
        }

        // free some storage for gas refund
        delete htlcs[id];
        emit Refund(id);
    }
}
