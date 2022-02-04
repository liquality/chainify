import { expect } from 'chai';

import { Chain } from '../types';
import { getSwapParams, mineBlock, increaseTime } from '../common';

export function shouldBehaveLikeSwapProvider(chain: Chain) {
    const { client, config } = chain;

    describe(`${client.chain.getNetwork().name} Swap Provider`, function () {
        it('should generate different secrets', async () => {
            const secret1 = await client.swap.generateSecret('secret1');
            const secret2 = await client.swap.generateSecret('secret2');
            expect(secret1).to.not.equal(secret2);
        });

        it('should initiate and claim - happy route', async () => {
            // Initiate
            const { swapParams, secret } = await getSwapParams(client, config);
            const initTx = await client.swap.initiateSwap(swapParams);
            await mineBlock(chain);

            // Find init tx
            const foundInitiateTx = await client.swap.findInitiateSwapTransaction(swapParams);
            await client.swap.verifyInitiateSwapTransaction(swapParams, foundInitiateTx.hash);
            expect(initTx.hash).to.equal(foundInitiateTx.hash);

            // Claim
            const claimTx = await client.swap.claimSwap(swapParams, foundInitiateTx.hash, secret);
            await mineBlock(chain);

            // Find and verify claim
            const foundClaim = await client.swap.findClaimSwapTransaction(swapParams, foundInitiateTx.hash);
            const foundSecret = await client.swap.getSwapSecret(foundClaim.hash);
            expect(secret).to.equal(foundSecret);
            expect(foundClaim.hash).to.equal(claimTx.hash);
        });

        it('should initiate and refund', async () => {
            // Initiate with short expiration
            const { swapParams } = await getSwapParams(client, config, 5);
            const initTx = await client.swap.initiateSwap(swapParams);
            await mineBlock(chain);

            // Find init tx
            const foundInitiateTx = await client.swap.findInitiateSwapTransaction(swapParams);
            expect(initTx.hash).to.equal(foundInitiateTx.hash);

            // Wait for expiration and refund
            await increaseTime(chain, 5);
            const refundTx = await client.swap.refundSwap(swapParams, foundInitiateTx.hash);
            await mineBlock(chain);

            // Find and verify refund
            const foundRefund = await client.swap.findRefundSwapTransaction(swapParams, foundInitiateTx.hash);
            expect(refundTx.hash).to.equal(foundRefund.hash);
        });
    });
}
