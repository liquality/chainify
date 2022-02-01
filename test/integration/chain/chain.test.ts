import { expect } from 'chai';
import { Client } from '../../../packages/client';

export function shouldBehaveLikeChainProvider(client: Client) {
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

            const blockByNumber = await client.chain.getBlockByNumber(blockHeight, true);
            expect(blockByNumber).to.be.not.undefined;

            const blockByHash = await client.chain.getBlockByHash(blockByNumber.hash, true);
            expect(blockByNumber.hash).to.be.eq(blockByHash.hash);
        });

        it('should fetch transaction data', async () => {
            const blockHeight = await client.chain.getBlockHeight();

            const blockByNumber = await client.chain.getBlockByNumber(blockHeight, true);
            for (const tx of blockByNumber.transactions) {
                const receipt = await client.chain.getTransactionByHash(tx.hash);
                expect(receipt.confirmations).to.be.gte(1);
                expect(receipt.hash).to.be.eq(tx.hash);
                expect(receipt.value).to.be.eq(tx.value);
                expect(receipt.feePrice).to.be.eq(tx.feePrice);
            }
        });
    });
}
