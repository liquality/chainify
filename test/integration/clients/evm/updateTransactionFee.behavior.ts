import { assert } from 'chai';

import { EvmTypes } from '@liquality/evm';
import { Math } from '@liquality/utils';

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
                const fees = (await client.chain.getFees()) as EvmTypes.EthereumFeeData;
                const tx = await client.wallet.sendTransaction({ to: config.recipientAddress, value: 1, ...fees });

                await client.wallet.updateTransactionFee(tx.hash, {
                    ...fees,
                    maxFeePerGas: Math.mul(fees.maxFeePerGas, 1.5).toString(),
                    maxPriorityFeePerGas: Math.mul(fees.maxPriorityFeePerGas, 1.5).toString(),
                } as EvmTypes.EthereumFeeData);
            });

            it('should fail if price bump is insufficient', async () => {
                const fees = (await client.chain.getFees()) as EvmTypes.EthereumFeeData;
                const tx = await client.wallet.sendTransaction({ to: config.recipientAddress, value: 1, ...fees });
                await assert.isRejected(client.wallet.updateTransactionFee(tx.hash, { ...fees } as EvmTypes.EthereumFeeData));
            });

            it('should fail if no new fee is provided', async () => {
                const fees = (await client.chain.getFees()) as EvmTypes.EthereumFeeData;
                const tx = await client.wallet.sendTransaction({ to: config.recipientAddress, value: 1, ...fees });
                await assert.isRejected(
                    client.wallet.updateTransactionFee(tx.hash, {} as EvmTypes.EthereumFeeData),
                    'Replace transaction underpriced'
                );
            });
        });

        describe('Legacy', () => {
            it('should update transaction fee', async () => {
                const fees = (await client.chain.getFees()) as EvmTypes.EthereumFeeData;
                const tx = await client.wallet.sendTransaction({
                    to: config.recipientAddress,
                    value: 1,
                    gasPrice: fees.gasPrice.toString(),
                } as EvmTypes.EthereumTransactionRequest);

                await client.wallet.updateTransactionFee(tx.hash, {
                    gasPrice: Math.mul(fees.gasPrice, 1.5).toString(),
                } as EvmTypes.EthereumFeeData);
            });

            it('should fail if price bump is insufficient', async () => {
                const fees = (await client.chain.getFees()) as EvmTypes.EthereumFeeData;
                const tx = await client.wallet.sendTransaction({
                    to: config.recipientAddress,
                    value: 1,
                    gasPrice: fees.gasPrice.toString(),
                } as EvmTypes.EthereumTransactionRequest);

                await assert.isRejected(
                    client.wallet.updateTransactionFee(tx.hash, { gasPrice: fees.gasPrice.toString() } as EvmTypes.EthereumFeeData)
                );
            });

            it('should fail if no new fee is provided', async () => {
                const fees = (await client.chain.getFees()) as EvmTypes.EthereumFeeData;
                const tx = await client.wallet.sendTransaction({
                    to: config.recipientAddress,
                    value: 1,
                    gasPrice: fees.gasPrice.toString(),
                } as EvmTypes.EthereumTransactionRequest);

                await assert.isRejected(
                    client.wallet.updateTransactionFee(tx.hash, {} as EvmTypes.EthereumFeeData),
                    'Replace transaction underpriced'
                );
            });
        });
    });
}
