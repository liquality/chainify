import { Math } from '@liquality/utils';
import { expect } from 'chai';

import { Chain } from '../types';

export function shouldBehaveLikeChainProvider(chain: Chain) {
    const { client, config } = chain;

    describe(`${client.chain.getNetwork().name} Chain Provider`, function () {
        it('should return network', async () => {
            const network = client.chain.getNetwork();

            expect(network.name).to.be.not.undefined;
            expect(network.coinType).to.be.not.undefined;
            expect(network.isTestnet).to.be.not.undefined;
        });

        it('should fetch block data', async () => {
            const blockHeight = await client.chain.getBlockHeight();
            expect(blockHeight).to.be.gte(0);

            const blockByNumber = await client.chain.getBlockByNumber(Number(blockHeight) - 5, true);
            expect(blockByNumber).to.be.not.undefined;

            const blockByHash = await client.chain.getBlockByHash(blockByNumber.hash, true);
            expect(blockByNumber.hash).to.be.eq(blockByHash.hash);
        });

        it('should fetch transaction data', async () => {
            const blockHeight = await client.chain.getBlockHeight();

            const blockByNumber = await client.chain.getBlockByNumber(Number(blockHeight) - 5, true);
            for (const tx of blockByNumber.transactions) {
                const receipt = await client.chain.getTransactionByHash(tx.hash);
                expect(Math.gte(receipt.confirmations, 1)).to.be.true;
                expect(receipt.hash).to.be.eq(tx.hash);
                expect(receipt.value).to.be.eq(tx.value);
            }
        });

        it('should fetch multiple balances at once', async () => {
            const balances = await client.chain.getBalance([config.walletExpectedResult.address], config.assets);
            expect(balances.length).to.equal(config.assets.length);
        });
    });
}
