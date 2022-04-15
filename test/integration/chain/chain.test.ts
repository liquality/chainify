import { UnsupportedMethodError } from '@liquality/errors';
import { Math, sleep } from '@liquality/utils';
import { expect } from 'chai';
import { Chain } from '../types';

export function shouldBehaveLikeChainProvider(chain: Chain) {
    const { client, config } = chain;

    describe(`${client.chain.getNetwork().name} Chain Provider`, function () {
        xit('should return network', async () => {
            const network = client.chain.getNetwork();

            expect(network.name).to.be.not.undefined;
            expect(network.coinType).to.be.not.undefined;
            expect(network.isTestnet).to.be.not.undefined;
        });

        xit('should fetch fees', async () => {
            const fee = await client.chain.getFees();
            expect(fee.slow.fee).to.not.be.undefined;
            expect(fee.average.fee).to.not.be.undefined;
            expect(fee.fast.fee).to.not.be.undefined;
        });

        xit('should fetch block data', async () => {
            const blockHeight = await client.chain.getBlockHeight();
            expect(blockHeight).to.be.gte(0);

            // let the chain indexer to fetch the data
            await sleep(1000);

            const blockByNumber = await client.chain.getBlockByNumber(Number(blockHeight) - 10, true);
            expect(blockByNumber).to.be.not.undefined;

            try {
                const blockByHash = await client.chain.getBlockByHash(blockByNumber.hash, true);
                expect(blockByNumber.hash).to.be.eq(blockByHash.hash);
            } catch (error) {
                if (!(error instanceof UnsupportedMethodError)) {
                    throw error;
                }
            }
        });

        it('should fetch transaction data', async () => {
            const blockHeight = await client.chain.getBlockHeight();

            // let the chain indexer to fetch the data
            await sleep(1000);

            const blockByNumber = await client.chain.getBlockByNumber(Number(blockHeight) - 10, true);
            for (const tx of blockByNumber.transactions) {
                const receipt = await client.chain.getTransactionByHash(tx.hash);
                expect(Math.gte(receipt.confirmations, 1)).to.be.true;
                expect(receipt.hash).to.be.eq(tx.hash);
                expect(receipt.value).to.be.eq(tx.value);
            }
        });

        xit('should fetch multiple balances at once', async () => {
            if (config.walletExpectedResult.address) {
                const balances = await client.chain.getBalance([config.walletExpectedResult.address], config.assets);
                expect(balances.length).to.equal(config.assets.length);
            }
        });
    });
}
