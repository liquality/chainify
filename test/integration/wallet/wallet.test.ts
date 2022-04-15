import { UnimplementedMethodError } from '@liquality/errors';
import { BigNumber, TxStatus } from '@liquality/types';
import { expect } from 'chai';
import { mineBlock } from '../common';
import { Chain } from '../types';

export function shouldBehaveLikeWalletProvider(chain: Chain, isNative = true) {
    const { client, config } = chain;

    xdescribe(`${client.chain.getNetwork().name} Wallet Provider`, function () {
        it('should use the expected address', async () => {
            const address = await client.wallet.getAddress();
            if (config.walletExpectedResult.address) {
                expect(address.toString()).to.be.equal(config.walletExpectedResult.address);
            }
        });

        it('should return first address at index 0 derivationPath from getAddresses', async () => {
            const addresses = await client.wallet.getAddresses();
            if (config.walletExpectedResult.address) {
                expect(addresses[0].toString()).to.be.equal(config.walletExpectedResult.address);
            }
        });

        it('should return first address at index 0 derivationPath from getUnusedAddress', async () => {
            const address = await client.wallet.getUnusedAddress();
            if (config.walletExpectedResult.unusedAddress) {
                expect(address.toString()).to.equal(config.walletExpectedResult.unusedAddress);
            }
        });

        it('should return first used address from getUsedAddresses', async () => {
            const addresses = await client.wallet.getUsedAddresses();
            if (config.walletExpectedResult.address) {
                expect(addresses.length).to.equal(config.walletExpectedResult.numberOfUsedAddresses);
                expect(addresses[0].toString()).to.equal(config.walletExpectedResult.address);
            }
        });

        it('should sign message', async () => {
            const from = await client.wallet.getAddress();
            const signedMessage = await client.wallet.signMessage('secret', from);
            if (config.walletExpectedResult.signedMessage) {
                expect(signedMessage).to.be.equal(config.walletExpectedResult.signedMessage);
            }
        });

        it('should return hex of signed message', async () => {
            const from = await client.wallet.getAddress();
            const signedMessage = await client.wallet.signMessage('secret', from);
            const signedMessageBuffer = Buffer.from(signedMessage, 'hex');
            if (config.walletExpectedResult.signedMessage) {
                expect(signedMessage).to.equal(signedMessageBuffer.toString('hex')).to.be.equal(config.walletExpectedResult.signedMessage);
            } else {
                expect(signedMessage).to.equal(signedMessageBuffer.toString('hex'));
            }
        });

        it('should return the same hex if signed twice', async () => {
            const from = await client.wallet.getAddress();
            const signedMessage1 = await client.wallet.signMessage('secret', from);
            const signedMessage2 = await client.wallet.signMessage('secret', from);
            if (config.walletExpectedResult.signedMessage) {
                expect(signedMessage1).to.be.equal(signedMessage2).to.be.equal(config.walletExpectedResult.signedMessage);
            } else {
                expect(signedMessage1).to.be.equal(signedMessage2);
            }
        });

        it('should return connected networks', async () => {
            const network = await client.wallet.getConnectedNetwork();
            expect(network).to.deep.equal(config.network);
        });

        it('should export private key', async () => {
            try {
                const privateKey = await client.wallet.exportPrivateKey();
                expect(privateKey).to.be.equal(config.walletExpectedResult.privateKey);
            } catch (error) {
                if (!(error instanceof UnimplementedMethodError)) {
                    throw error;
                }
            }
        });

        it(`should send ${isNative ? 'native' : 'ERC20'} asset transaction`, async () => {
            const tx = await client.wallet.sendTransaction({
                to: config.recipientAddress,
                value: config.sendParams.value || new BigNumber(1000000),
                asset: config.assets.find((a) => a.isNative === isNative),
                feeAsset: config.sendParams.feeAsset,
            });

            await mineBlock(chain);

            const txReceipt = await client.chain.getTransactionByHash(tx.hash);

            if (config.sendParams.value) {
                expect(txReceipt.value === config.sendParams.value.toNumber()).to.be.true;
                expect(txReceipt.status).to.equal(TxStatus.Success);
            }
        });
    });
}
