import { ethers } from 'hardhat';
import { Signers } from './types';

export function generateId(htlcData: any, blockTimestamp: number) {
    const abiCoder = ethers.utils.defaultAbiCoder;

    const data = abiCoder.encode(
        ['address', 'uint256', 'uint256', 'uint256', 'bytes32', 'address'],
        [
            htlcData.refundAddress,
            blockTimestamp,
            htlcData.amount.toString(),
            htlcData.expiration,
            htlcData.secretHash,
            htlcData.recipientAddress,
        ]
    );

    return ethers.utils.sha256(data);
}

export async function getDefaultHtlcData(signers: Signers, expiration: number, tokenAddress = ethers.constants.AddressZero) {
    const secretHash = ethers.utils.sha256(getDefaultSecret());

    return {
        amount: ethers.utils.parseEther('0.1'),
        expiration,
        secretHash: secretHash,
        tokenAddress: tokenAddress,
        refundAddress: signers.sender.address,
        recipientAddress: signers.recipient.address,
    };
}

export function getDefaultSecret(secret = 'secret') {
    return ethers.utils.sha256(Buffer.from(secret));
}
