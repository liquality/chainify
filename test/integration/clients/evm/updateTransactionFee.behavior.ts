import { FeeType } from '@liquality/types';
import { assert } from 'chai';
import { Chain } from '../../types';

export function shouldUpdateTransactionFee(chain: Chain) {
    const { client, config } = chain;

    describe('EVM Update Transaction Fee', () => {
        beforeEach(async () => {
            await client.chain.sendRpcRequest('miner_stop', []);
        });

        afterEach(async () => {
            await client.chain.sendRpcRequest('miner_start', []);
        });

        describe('EIP1559', () => {
            it('should update transaction fee', async () => {
                const fees = await client.chain.getFees();
                const slowEIP1559Fee = fees.slow.fee;
                const averageEIP1559Fee = fees.average.fee;

                // send tx with slow
                const tx = await client.wallet.sendTransaction({
                    to: config.recipientAddress,
                    value: config.sendParams.value,
                    fee: slowEIP1559Fee,
                });

                // send replace tx with average
                await client.wallet.updateTransactionFee(tx.hash, averageEIP1559Fee);
            });

            it('should fail if price bump is insufficient', async () => {
                const fees = await client.chain.getFees();
                const eip1559Fee = fees.slow.fee;

                // send tx with slow
                const tx = await client.wallet.sendTransaction({
                    to: config.recipientAddress,
                    value: config.sendParams.value,
                    fee: eip1559Fee,
                });

                // send tx with the same amount of gas
                await assert.isRejected(client.wallet.updateTransactionFee(tx.hash, eip1559Fee));
            });

            it('should fail if no new fee is provided', async () => {
                const fees = await client.chain.getFees();
                const eip1559Fee = fees.fast.fee;
                const tx = await client.wallet.sendTransaction({
                    to: config.recipientAddress,
                    value: config.sendParams.value,
                    fee: eip1559Fee,
                });
                await assert.isRejected(client.wallet.updateTransactionFee(tx.hash, {} as FeeType), 'No replacement fee is provided');
            });
        });

        describe('Legacy', () => {
            before(async () => {
                await client.chain.setFeeProvider(null);
            });

            it('should update transaction fee', async () => {
                const fees = await client.chain.getFees();

                const tx = await client.wallet.sendTransaction({
                    to: config.recipientAddress,
                    value: config.sendParams.value,
                    fee: fees.slow.fee,
                });

                await client.wallet.updateTransactionFee(tx.hash, fees.average.fee);
            });

            it('should fail if price bump is insufficient', async () => {
                const fees = await client.chain.getFees();
                const tx = await client.wallet.sendTransaction({
                    to: config.recipientAddress,
                    value: config.sendParams.value,
                    fee: fees.slow.fee,
                });

                await assert.isRejected(client.wallet.updateTransactionFee(tx.hash, fees.slow.fee));
            });

            it('should fail if no new fee is provided', async () => {
                const fees = await client.chain.getFees();
                const tx = await client.wallet.sendTransaction({
                    to: config.recipientAddress,
                    value: config.sendParams.value,
                    fee: fees.slow.fee,
                });

                await assert.isRejected(client.wallet.updateTransactionFee(tx.hash, {} as FeeType), 'No replacement fee is provided');
            });
        });
    });
}
