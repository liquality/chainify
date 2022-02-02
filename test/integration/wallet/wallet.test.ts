import { expect } from 'chai';

import { Client } from '@liquality/client';

import { IConfig } from '../types';

export function shouldBehaveLikeWalletProvider(client: Client, config: IConfig) {
    describe(`${client.chain.getNetwork().name} Wallet Provider`, function () {
        it('should use the expected address', async () => {
            const address = await client.wallet.getAddress();
            expect(address.toString()).to.be.equal(config.walletExpectedResult.address);
        });

        it('should return first address at index 0 derivationPath from getAddresses', async () => {
            const addresses = await client.wallet.getAddresses();
            expect(addresses.length).to.equal(1);
            expect(addresses[0].toString()).to.be.equal(config.walletExpectedResult.address);
        });

        it('should return first address at index 0 derivationPath from getUnusedAddress', async () => {
            const address = await client.wallet.getUnusedAddress();
            expect(address.toString()).to.equal(config.walletExpectedResult.address);
        });

        it('should return first address at index 0 derivationPath from getUsedAddresses', async () => {
            const addresses = await client.wallet.getUsedAddresses();
            expect(addresses.length).to.equal(1);
            expect(addresses[0].toString()).to.equal(config.walletExpectedResult.address);
        });

        it('should sign message', async () => {
            const from = await client.wallet.getAddress();
            const signedMessage = await client.wallet.signMessage('secret', from);
            expect(signedMessage).to.be.equal(config.walletExpectedResult.signedMessage);
        });

        it('should return hex of signed message', async () => {
            const from = await client.wallet.getAddress();
            const signedMessage = await client.wallet.signMessage('secret', from);
            const signedMessageBuffer = Buffer.from(signedMessage, 'hex');
            expect(signedMessage).to.equal(signedMessageBuffer.toString('hex')).to.equal(config.walletExpectedResult.signedMessage);
        });

        it('should return the same hex if signed twice', async () => {
            const from = await client.wallet.getAddress();
            const signedMessage1 = await client.wallet.signMessage('secret', from);
            const signedMessage2 = await client.wallet.signMessage('secret', from);
            expect(signedMessage1).to.be.equal(signedMessage2).to.be.equal(config.walletExpectedResult.signedMessage);
        });

        it('should export private key', async () => {
            const privateKey = await client.wallet.exportPrivateKey();
            expect(privateKey).to.be.equal(config.walletExpectedResult.privateKey);
        });

        it('should send transaction', async () => {
            const tx = await client.wallet.sendTransaction({ to: config.recipientAddress, value: 1 });
            const txReceipt = await client.chain.getTransactionByHash(tx.hash);
            expect(txReceipt.value.toString() === '1').to.be.true;
        });
    });
}
