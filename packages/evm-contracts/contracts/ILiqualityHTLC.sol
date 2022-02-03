// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

/// @title ILiqualityHTLC
interface ILiqualityHTLC {
    struct HTLCData {
        uint256 amount;
        uint256 expiration;
        bytes32 secretHash;
        address tokenAddress;
        address refundAddress;
        address recipientAddress;
    }

    /// @notice Emitted when a successful HTLC was created
    event Initiate(bytes32 id, HTLCData htlc);

    /// @notice Emitted when a successful Refund was performed
    event Refund(bytes32 id);

    /// @notice Emitted when a successful Claim was performed
    event Claim(bytes32 id, bytes32 secret);

    /// @notice Initiates a HTLC based on the input parameters.
    function initiate(HTLCData calldata htlc) external payable;

    /// @notice Claims an existing HTLC for the provided `id` using the `secret`.
    /// @param id htlc id
    /// @param secret the secret used to create the `secretHash`
    function claim(bytes32 id, bytes32 secret) external;

    /// @notice Refunds an existing HTLC for the provided `id`. The refunded amount goes to the `refundAddress`
    /// @param id htlc id
    function refund(bytes32 id) external;

    /// @notice Emitted when the sha256 of the provided secret during claim does not match the secret hash
    error LiqualityHTLC__WrongSecret();

    /// @notice Emitted when the provided msg.data lenght is bigger than sig(4) + id(32) + secret(32) = 68
    error LiqualityHTLC__BadSecretLength(uint256 length);

    /// @notice Emitted when the provided expiration is smaller than the current block timestmap
    error LiqualityHTLC__InvalidExpiration();

    /// @notice Emitted when the amount is 0
    error LiqualityHTLC__InvalidSwapAmount();

    /// @notice Emitted when initiating Ether HTLC and the amount does not match the msg.value
    error LiqualityHTLC__InvalidMsgValue();

    /// @notice Emitted when the generated id already exists
    error LiqualityHTLC__SwapAlreadyExists();

    /// @notice Emitted when there is an attempt for refund when the swap is not expired
    error LiqualityHTLC__SwapNotExpired();

    /// @notice Emitted when the msg.sender does not match the provided `refundAddress`
    error LiqualityHTLC__InvalidSender();
}
