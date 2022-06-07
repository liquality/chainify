import { expect } from 'chai';
import { claimAndVerify, getSwapParams, increaseTime, initiateAndVerify, refundAndVerify } from '../common';
import { Chain } from '../types';

export function shouldBehaveLikeSwapProvider(chain: Chain, native = true) {
    const { client, config } = chain;

    describe(`${client.chain.getNetwork().name} Swap Provider with ${native ? 'Native' : 'ERC20'} asset`, function () {
        it('should generate different secrets', async () => {
            const secret1 = await client.swap.generateSecret('secret1');
            const secret2 = await client.swap.generateSecret('secret2');
            expect(secret1).to.not.equal(secret2);
        });

        describe(`Initiate`, async () => {
            it('should initiate, verify find the initiate tx', async () => {
                const { swapParams } = await getSwapParams(client, config, 200, native);
                await initiateAndVerify(chain, swapParams);
            });
        });

        describe(`Claim`, async () => {
            it('should claim successfully', async () => {
                // Initiate
                const { swapParams, secret } = await getSwapParams(client, config, 200, native);
                const initTx = await initiateAndVerify(chain, swapParams);

                // Claim and verify
                await claimAndVerify(chain, swapParams, initTx.hash, secret);
            });

            it('should claim only using correct secret', async () => {
                // Initiate and verify
                const { swapParams, secret } = await getSwapParams(client, config, 200, native);
                const initTx = await initiateAndVerify(chain, swapParams);

                // Try claiming using wrong secrets
                const wrongSecret = await client.swap.generateSecret('wrong-secret');
                const emptySecret = '';
                const bigSizedSecret = secret + '0';
                const shortSizedSecret = secret.substring(0, secret.length - 4);
                await expect(claimAndVerify(chain, swapParams, initTx.hash, wrongSecret)).to.be.rejected;
                await expect(claimAndVerify(chain, swapParams, initTx.hash, emptySecret)).to.be.rejected;
                await expect(claimAndVerify(chain, swapParams, initTx.hash, bigSizedSecret)).to.be.rejected;
                await expect(claimAndVerify(chain, swapParams, initTx.hash, shortSizedSecret)).to.be.rejected;

                // Claim successfully using the correct secret
                await claimAndVerify(chain, swapParams, initTx.hash, secret);
            });

            it('should claim after expiration', async () => {
                // Initiate
                const { swapParams, secret } = await getSwapParams(client, config, 10, native);
                const initTx = await initiateAndVerify(chain, swapParams);

                // Claim after expiration
                await increaseTime(chain, swapParams.expiration + 10);
                await claimAndVerify(chain, swapParams, initTx.hash, secret);
            });

            it('should not allow claiming multiple times', async () => {
                // Initiate
                const { swapParams, secret } = await getSwapParams(client, config, 10, native);
                const initTx = await initiateAndVerify(chain, swapParams);

                // Claim after expiration
                await increaseTime(chain, swapParams.expiration + 10);
                await claimAndVerify(chain, swapParams, initTx.hash, secret);
                await expect(claimAndVerify(chain, swapParams, initTx.hash, secret)).to.be.rejected;
            });
        });

        describe(`Refund`, async () => {
            it('should refund successfully', async () => {
                // Initiate
                const { swapParams } = await getSwapParams(client, config, 10, native);
                const initTx = await initiateAndVerify(chain, swapParams);

                // Refund and verify
                await increaseTime(chain, swapParams.expiration + 10);
                await refundAndVerify(chain, swapParams, initTx.hash);
            });

            it('should not allow refund after claim', async () => {
                // Initiate
                const { swapParams, secret } = await getSwapParams(client, config, 10, native);
                const initTx = await initiateAndVerify(chain, swapParams);

                // Claim
                await claimAndVerify(chain, swapParams, initTx.hash, secret);

                // Refund should fail
                await increaseTime(chain, swapParams.expiration + 10);
                await expect(refundAndVerify(chain, swapParams, initTx.hash)).to.be.rejected;
            });

            it('should not allow multiple refunds of the same htlc', async () => {
                // Initiate
                const { swapParams } = await getSwapParams(client, config, 10, native);
                const initTx = await initiateAndVerify(chain, swapParams);

                // Refund and verify
                await increaseTime(chain, swapParams.expiration + 10);
                await refundAndVerify(chain, swapParams, initTx.hash);
                await expect(refundAndVerify(chain, swapParams, initTx.hash)).to.be.rejected;
            });

            it('should not allow refunding before expiration', async () => {
                // Initiate
                const { swapParams } = await getSwapParams(client, config, 1000, native);
                const initTx = await initiateAndVerify(chain, swapParams);

                // Refund and reject
                await expect(refundAndVerify(chain, swapParams, initTx.hash)).to.be.rejected;
            });
        });
    });
}
