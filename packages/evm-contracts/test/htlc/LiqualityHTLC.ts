import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { ethers } from 'hardhat';
import { Signers } from '../types';
import { shouldBehaveLikeLiqualityHTLCForERC20 } from './LiqualityHTLCERC20.behavior';
import { shouldBehaveLikeLiqualityHTLCForEther } from './LiqualityHTLCEther.behavior';

describe('Unit tests', function () {
    before(async function () {
        this.signers = {} as Signers;
        const signers: SignerWithAddress[] = await ethers.getSigners();
        this.signers.deployer = signers[0];
        this.signers.sender = signers[1];
        this.signers.recipient = signers[2];
    });

    describe('Liquality Ether HTLC', function () {
        shouldBehaveLikeLiqualityHTLCForEther();
    });

    describe('Liquality ERC20 HTLC', function () {
        shouldBehaveLikeLiqualityHTLCForERC20();
    });
});
