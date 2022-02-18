import { expect } from 'chai';
import hre, { ethers } from 'hardhat';
import { LiqualityHTLC__factory } from '../../src/types/factories/LiqualityHTLC__factory';
import { LiqualityHTLC } from '../../src/types/LiqualityHTLC';
import { generateId, getDefaultHtlcData, getDefaultSecret } from '../utils';

export function shouldBehaveLikeLiqualityHTLCForEther(): void {
    beforeEach(async function () {
        const htlcFactory: LiqualityHTLC__factory = <LiqualityHTLC__factory>await ethers.getContractFactory('LiqualityHTLC');
        this.htlc = <LiqualityHTLC>await htlcFactory.deploy();
    });

    describe('Initiate', () => {
        shouldInitiateEther();
    });

    describe('Claim', () => {
        shouldClaimEther();
    });

    describe('Refund', () => {
        shouldRefundEther();
    });
}

function shouldInitiateEther(): void {
    it('should initiate', async function () {
        const blockTimestamp = (await ethers.provider.getBlock('latest')).timestamp + 1;
        await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp]);
        const htlcData = await getDefaultHtlcData(this.signers, blockTimestamp + 1);
        const id = generateId(htlcData, blockTimestamp);

        await expect(this.htlc.connect(this.signers.sender).initiate(htlcData, { value: htlcData.amount }))
            .to.emit(this.htlc, 'Initiate')
            .withArgs(id, Object.values(htlcData));
    });

    it("should not fail if refund address doesn't match msg.sender", async function () {
        const blockTimestamp = (await ethers.provider.getBlock('latest')).timestamp + 1;
        await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp]);
        const htlcData = await getDefaultHtlcData(this.signers, blockTimestamp + 1);

        await this.htlc.connect(this.signers.deployer).initiate(htlcData, { value: htlcData.amount });
    });

    it("should fail if amount doesn't match msg.value", async function () {
        const blockTimestamp = (await ethers.provider.getBlock('latest')).timestamp + 1;
        await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp]);
        const htlcData = await getDefaultHtlcData(this.signers, blockTimestamp + 1);

        await expect(this.htlc.connect(this.signers.sender).initiate(htlcData)).to.be.revertedWith('LiqualityHTLC__InvalidMsgValue');
    });

    it('should fail if amount is 0', async function () {
        const blockTimestamp = (await ethers.provider.getBlock('latest')).timestamp + 1;
        await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp]);
        const htlcData = await getDefaultHtlcData(this.signers, blockTimestamp + 1);

        await expect(this.htlc.connect(this.signers.sender).initiate({ ...htlcData, amount: 0 })).to.be.revertedWith(
            'LiqualityHTLC__InvalidSwapAmount'
        );
    });

    it('should fail if expiration is smaller that block.timestamp', async function () {
        const blockTimestamp = (await ethers.provider.getBlock('latest')).timestamp + 1;
        await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp]);
        const htlcData = await getDefaultHtlcData(this.signers, blockTimestamp + 1);

        await expect(this.htlc.connect(this.signers.sender).initiate({ ...htlcData, expiration: blockTimestamp - 1 })).to.be.revertedWith(
            'LiqualityHTLC__InvalidExpiration'
        );
    });

    it('should fail if swap already exists', async function () {
        const blockTimestamp = (await ethers.provider.getBlock('latest')).timestamp + 1;
        await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp]);
        const htlcData = await getDefaultHtlcData(this.signers, blockTimestamp + 1);

        await hre.network.provider.send('evm_setAutomine', [false]);
        await hre.network.provider.send('evm_mine');
        await this.htlc.connect(this.signers.sender).initiate(htlcData, { value: htlcData.amount });
        const txHash = await this.htlc.connect(this.signers.sender).initiate(htlcData, { value: htlcData.amount });
        await hre.network.provider.send('evm_mine');
        await ethers.provider.send('evm_setAutomine', [true]);
        await expect(txHash.wait(1)).to.be.reverted;
    });
}

function shouldClaimEther(): void {
    it('should claim and emit events', async function () {
        const blockTimestamp = (await ethers.provider.getBlock('latest')).timestamp + 1;
        await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp]);
        const htlcData = await getDefaultHtlcData(this.signers, blockTimestamp + 60);
        const id = generateId(htlcData, blockTimestamp);
        await this.htlc.connect(this.signers.sender).initiate(htlcData, { value: htlcData.amount });
        await expect(this.htlc.claim(id, getDefaultSecret())).to.emit(this.htlc, 'Claim').withArgs(id, getDefaultSecret());
    });

    it('should succeed if expiration has passed', async function () {
        const blockTimestamp = (await ethers.provider.getBlock('latest')).timestamp + 1;
        await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp]);
        const htlcData = await getDefaultHtlcData(this.signers, blockTimestamp + 60);
        const id = generateId(htlcData, blockTimestamp);
        await this.htlc.connect(this.signers.sender).initiate(htlcData, { value: htlcData.amount });
        await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp + 5000]);
        await expect(this.htlc.claim(id, getDefaultSecret())).to.emit(this.htlc, 'Claim').withArgs(id, getDefaultSecret());
    });

    it('should send ether to recipient if msg.sender is different', async function () {
        const blockTimestamp = (await ethers.provider.getBlock('latest')).timestamp + 1;
        await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp]);
        const htlcData = await getDefaultHtlcData(this.signers, blockTimestamp + 60);
        const id = generateId(htlcData, blockTimestamp);
        await this.htlc.connect(this.signers.sender).initiate(htlcData, { value: htlcData.amount });
        await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp + 5000]);

        const etherBalanceBefore = await ethers.provider.getBalance(htlcData.recipientAddress);
        await expect(this.htlc.connect(this.signers.deployer).claim(id, getDefaultSecret()))
            .to.emit(this.htlc, 'Claim')
            .withArgs(id, getDefaultSecret());
        const etherBalanceAfter = await ethers.provider.getBalance(htlcData.recipientAddress);
        expect(etherBalanceBefore.add(htlcData.amount)).to.be.equal(etherBalanceAfter);
    });

    it('should fail if secret is wrong', async function () {
        const blockTimestamp = (await ethers.provider.getBlock('latest')).timestamp + 1;
        await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp]);
        const htlcData = await getDefaultHtlcData(this.signers, blockTimestamp + 60);
        const id = generateId(htlcData, blockTimestamp);
        await this.htlc.connect(this.signers.sender).initiate(htlcData, { value: htlcData.amount });
        await expect(this.htlc.claim(id, getDefaultSecret('secret1'))).to.be.revertedWith('LiqualityHTLC__WrongSecret');
    });

    it('should fail if swap does not exists', async function () {
        const blockTimestamp = (await ethers.provider.getBlock('latest')).timestamp + 1;
        await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp]);
        const htlcData = await getDefaultHtlcData(this.signers, blockTimestamp + 60);
        await this.htlc.connect(this.signers.sender).initiate(htlcData, { value: htlcData.amount });
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

function shouldRefundEther(): void {
    it('should refund and emit events', async function () {
        const blockTimestamp = (await ethers.provider.getBlock('latest')).timestamp + 1;
        await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp]);
        const htlcData = await getDefaultHtlcData(this.signers, blockTimestamp + 60);
        const id = generateId(htlcData, blockTimestamp);
        await this.htlc.connect(this.signers.sender).initiate(htlcData, { value: htlcData.amount });
        await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp + 1500]);
        await expect(this.htlc.refund(id)).to.emit(this.htlc, 'Refund').withArgs(id);
    });

    it('should refund to the refund address if msg.sender is different', async function () {
        const blockTimestamp = (await ethers.provider.getBlock('latest')).timestamp + 1;
        await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp]);
        const htlcData = await getDefaultHtlcData(this.signers, blockTimestamp + 60);
        const id = generateId(htlcData, blockTimestamp);
        await this.htlc.connect(this.signers.sender).initiate(htlcData, { value: htlcData.amount });
        await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp + 1500]);
        const etherBalanceBefore = await ethers.provider.getBalance(htlcData.refundAddress);
        await expect(this.htlc.refund(id)).to.emit(this.htlc, 'Refund').withArgs(id);
        const etherBalanceAfter = await ethers.provider.getBalance(htlcData.refundAddress);
        expect(etherBalanceBefore.add(htlcData.amount)).to.be.equal(etherBalanceAfter);
    });

    it('should fail if not expired', async function () {
        const blockTimestamp = (await ethers.provider.getBlock('latest')).timestamp + 1;
        await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp]);
        const htlcData = await getDefaultHtlcData(this.signers, blockTimestamp + 60);
        const id = generateId(htlcData, blockTimestamp);
        await this.htlc.connect(this.signers.sender).initiate(htlcData, { value: htlcData.amount });
        await expect(this.htlc.refund(id)).to.be.revertedWith('LiqualityHTLC__SwapNotExpired');
    });
}
