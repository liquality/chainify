import { expect } from 'chai';
import hre, { ethers } from 'hardhat';
import { LiqualityHTLC__factory } from '../../src/types/factories/LiqualityHTLC__factory';
import { TestERC20__factory } from '../../src/types/factories/TestERC20__factory';
import { LiqualityHTLC } from '../../src/types/LiqualityHTLC';
import { TestERC20 } from '../../src/types/TestERC20';
import { generateId, getDefaultHtlcData, getDefaultSecret } from '../utils';

export function shouldBehaveLikeLiqualityHTLCForERC20(): void {
    beforeEach(async function () {
        const htlcFactory: LiqualityHTLC__factory = <LiqualityHTLC__factory>await ethers.getContractFactory('LiqualityHTLC');
        this.htlc = <LiqualityHTLC>await htlcFactory.deploy();

        const erc20Factory: TestERC20__factory = <TestERC20__factory>await ethers.getContractFactory('TestERC20');
        this.token = <TestERC20>await erc20Factory.deploy();

        await this.token.mint(this.signers.sender.address, ethers.utils.parseUnits('1000000'));
        await this.token.connect(this.signers.sender).approve(this.htlc.address, ethers.constants.MaxUint256);
    });

    describe('Initiate', function () {
        shouldInitiateERC20();
    });

    describe('Claim', function () {
        shouldClaimERC20();
    });

    describe('Refund', function () {
        shouldRefundERC20();
    });
}

function shouldInitiateERC20(): void {
    it('should initiate', async function () {
        const blockTimestamp = (await ethers.provider.getBlock('latest')).timestamp + 1;
        await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp]);
        const htlcData = await getDefaultHtlcData(this.signers, blockTimestamp + 1, this.token.address);
        const id = generateId(htlcData, blockTimestamp);

        await expect(this.htlc.connect(this.signers.sender).initiate(htlcData))
            .to.emit(this.htlc, 'Initiate')
            .withArgs(id, Object.values(htlcData));
    });

    it("should not fail if sender doesn't match msg.sender", async function () {
        const blockTimestamp = (await ethers.provider.getBlock('latest')).timestamp + 1;
        await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp]);
        const htlcData = await getDefaultHtlcData(this.signers, blockTimestamp + 1, this.token.address);

        await this.htlc.connect(this.signers.deployer).initiate(htlcData);
    });

    it('should fail if amount is 0', async function () {
        const blockTimestamp = (await ethers.provider.getBlock('latest')).timestamp + 1;
        await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp]);
        const htlcData = await getDefaultHtlcData(this.signers, blockTimestamp + 1, this.token.address);

        await expect(this.htlc.connect(this.signers.sender).initiate({ ...htlcData, amount: 0 })).to.be.revertedWith(
            'LiqualityHTLC__InvalidSwapAmount'
        );
    });

    it('should fail if expiration is smaller that block.timestamp', async function () {
        const blockTimestamp = (await ethers.provider.getBlock('latest')).timestamp + 1;
        await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp]);
        const htlcData = await getDefaultHtlcData(this.signers, blockTimestamp + 1, this.token.address);

        await expect(this.htlc.connect(this.signers.sender).initiate({ ...htlcData, expiration: blockTimestamp - 1 })).to.be.revertedWith(
            'LiqualityHTLC__InvalidExpiration'
        );
    });

    it('should fail if swap already exists', async function () {
        const blockTimestamp = (await ethers.provider.getBlock('latest')).timestamp + 1;
        await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp]);
        const htlcData = await getDefaultHtlcData(this.signers, blockTimestamp + 1, this.token.address);

        await hre.network.provider.send('evm_setAutomine', [false]);
        await hre.network.provider.send('evm_mine');
        await this.htlc.connect(this.signers.sender).initiate(htlcData);
        const txHash = await this.htlc.connect(this.signers.sender).initiate(htlcData);
        await hre.network.provider.send('evm_mine');
        await ethers.provider.send('evm_setAutomine', [true]);
        await expect(txHash.wait(1)).to.be.reverted;
    });
}

function shouldClaimERC20(): void {
    it('should claim and emit events', async function () {
        const blockTimestamp = (await ethers.provider.getBlock('latest')).timestamp + 1;
        await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp]);
        const htlcData = await getDefaultHtlcData(this.signers, blockTimestamp + 60, this.token.address);
        const id = generateId(htlcData, blockTimestamp);
        await this.htlc.connect(this.signers.sender).initiate(htlcData);
        await expect(this.htlc.claim(id, getDefaultSecret())).to.emit(this.htlc, 'Claim').withArgs(id, getDefaultSecret());
    });

    it('should succeed if expiration has passed', async function () {
        const blockTimestamp = (await ethers.provider.getBlock('latest')).timestamp + 1;
        await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp]);
        const htlcData = await getDefaultHtlcData(this.signers, blockTimestamp + 60, this.token.address);
        const id = generateId(htlcData, blockTimestamp);
        await this.htlc.connect(this.signers.sender).initiate(htlcData);
        await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp + 5000]);
        await expect(this.htlc.claim(id, getDefaultSecret())).to.emit(this.htlc, 'Claim').withArgs(id, getDefaultSecret());
    });

    it('should send the token to recipient if msg.sender is different', async function () {
        const blockTimestamp = (await ethers.provider.getBlock('latest')).timestamp + 1;
        await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp]);
        const htlcData = await getDefaultHtlcData(this.signers, blockTimestamp + 60, this.token.address);
        const id = generateId(htlcData, blockTimestamp);
        await this.htlc.connect(this.signers.sender).initiate(htlcData);
        await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp + 5000]);

        const tokenBalanceBefore = await this.token.balanceOf(htlcData.recipientAddress);
        await expect(this.htlc.connect(this.signers.deployer).claim(id, getDefaultSecret()))
            .to.emit(this.htlc, 'Claim')
            .withArgs(id, getDefaultSecret());
        const tokenBalanceAfter = await this.token.balanceOf(htlcData.recipientAddress);
        expect(tokenBalanceBefore.add(htlcData.amount)).to.be.equal(tokenBalanceAfter);
    });

    it('should fail if secret is wrong', async function () {
        const blockTimestamp = (await ethers.provider.getBlock('latest')).timestamp + 1;
        await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp]);
        const htlcData = await getDefaultHtlcData(this.signers, blockTimestamp + 60, this.token.address);
        const id = generateId(htlcData, blockTimestamp);
        await this.htlc.connect(this.signers.sender).initiate(htlcData);
        await expect(this.htlc.claim(id, getDefaultSecret('secret1'))).to.be.revertedWith('LiqualityHTLC__WrongSecret');
    });

    it('should fail if swap does not exists', async function () {
        const blockTimestamp = (await ethers.provider.getBlock('latest')).timestamp + 1;
        await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp]);
        const htlcData = await getDefaultHtlcData(this.signers, blockTimestamp + 60, this.token.address);
        await this.htlc.connect(this.signers.sender).initiate(htlcData);
        await expect(this.htlc.claim(ethers.constants.HashZero, getDefaultSecret())).to.be.revertedWith('LiqualityHTLC__SwapDoesNotExist');
    });

    it('should only accept 64 bytes of msg.data', async function () {
        const blockTimestamp = (await ethers.provider.getBlock('latest')).timestamp + 1;
        await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp]);
        const htlcData = await getDefaultHtlcData(this.signers, blockTimestamp + 60);
        const id = generateId(htlcData, blockTimestamp);
        await this.htlc.connect(this.signers.sender).initiate(htlcData, { value: htlcData.amount });

        const tx = await this.htlc.populateTransaction.claim(id, getDefaultSecret());

        await expect(
            this.signers.sender.sendTransaction({
                to: this.htlc.address.toString(),
                data: tx?.data?.concat('eacd71'),
            })
        ).to.be.revertedWith('LiqualityHTLC__BadSecretLength');

        await expect(
            this.signers.sender.sendTransaction({
                to: this.htlc.address.toString(),
                data: tx.data?.substring(0, tx.data.length - 6),
            })
        ).to.be.reverted;
    });
}

function shouldRefundERC20(): void {
    it('should refund and emit events', async function () {
        const blockTimestamp = (await ethers.provider.getBlock('latest')).timestamp + 1;
        await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp]);
        const htlcData = await getDefaultHtlcData(this.signers, blockTimestamp + 60, this.token.address);
        const id = generateId(htlcData, blockTimestamp);
        await this.htlc.connect(this.signers.sender).initiate(htlcData);
        await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp + 1500]);
        await expect(this.htlc.refund(id)).to.emit(this.htlc, 'Refund').withArgs(id);
    });

    it('should refund to the refund address if msg.sender is different', async function () {
        const blockTimestamp = (await ethers.provider.getBlock('latest')).timestamp + 1;
        await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp]);
        const htlcData = await getDefaultHtlcData(this.signers, blockTimestamp + 60, this.token.address);
        const id = generateId(htlcData, blockTimestamp);
        await this.htlc.connect(this.signers.sender).initiate(htlcData);
        await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp + 1500]);
        const tokenBalanceBefore = await this.token.balanceOf(htlcData.refundAddress);
        await expect(this.htlc.refund(id)).to.emit(this.htlc, 'Refund').withArgs(id);
        const tokenBalanceAfter = await this.token.balanceOf(htlcData.refundAddress);
        expect(tokenBalanceBefore.add(htlcData.amount)).to.be.equal(tokenBalanceAfter);
    });

    it('should fail if not expired', async function () {
        const blockTimestamp = (await ethers.provider.getBlock('latest')).timestamp + 1;
        await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp]);
        const htlcData = await getDefaultHtlcData(this.signers, blockTimestamp + 60, this.token.address);
        const id = generateId(htlcData, blockTimestamp);
        await this.htlc.connect(this.signers.sender).initiate(htlcData);
        await expect(this.htlc.refund(id)).to.be.revertedWith('LiqualityHTLC__SwapNotExpired');
    });
}
