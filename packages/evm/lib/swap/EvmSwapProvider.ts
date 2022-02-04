import { BaseProvider, Log } from '@ethersproject/providers';

import { Math } from '@liquality/utils';
import { BigNumberish, SwapParams, Transaction } from '@liquality/types';

import { EvmBaseSwapProvider } from './EvmBaseSwapProvider';
import { EvmBaseWalletProvider } from '../wallet/EvmBaseWalletProvider';
import { ClaimEvent, InitiateEvent, RefundEvent } from '../typechain/LiqualityHTLC';

export class EvmSwapProvider extends EvmBaseSwapProvider {
    protected walletProvider: EvmBaseWalletProvider<BaseProvider>;

    constructor(swapOptions: any, walletProvider: EvmBaseWalletProvider<BaseProvider>) {
        super(swapOptions, walletProvider);
    }

    async findInitiateSwapTransaction(swapParams: SwapParams, _blockNumber?: number): Promise<Transaction<InitiateEvent>> {
        const currentBlock = await this.walletProvider.getChainProvider().getBlockHeight();

        return await this.searchLogs(async (from: BigNumberish, to: BigNumberish) => {
            const filter = await this.contract.queryFilter(this.contract.filters.Initiate(), Number(from), Number(to));

            const initiate = filter.find((event) => {
                const isTrue = this.doesTransactionMatchInitiation(swapParams, { _raw: event } as Transaction<InitiateEvent>);
                return isTrue;
            });

            if (initiate) {
                const tx = await this.walletProvider.getChainProvider().getTransactionByHash(initiate.transactionHash);
                return { ...tx, _raw: initiate };
            }
        }, currentBlock);
    }

    async findClaimSwapTransaction(swapParams: SwapParams, initTxHash: string, _blockNumber?: number): Promise<Transaction<ClaimEvent>> {
        return this.findTx<ClaimEvent>(swapParams, initTxHash, 'Claim');
    }

    async findRefundSwapTransaction(swapParams: SwapParams, initTxHash: string, _blockNumber?: number): Promise<Transaction<RefundEvent>> {
        return this.findTx<RefundEvent>(swapParams, initTxHash, 'Refund');
    }

    private async searchLogs(callback: (from: number, to: number) => Promise<Transaction>, currentBlock: BigNumberish) {
        let from = Math.sub(currentBlock, 5000).toString();
        let to = currentBlock.toString();

        while (Math.gte(from, Math.sub(currentBlock, 100000))) {
            const result = await callback(Number(from), Number(to));
            if (result) {
                return result;
            }
            from = Math.sub(from, 5000).toString();
            to = Math.sub(to, 5000).toString();
        }
    }

    private async findTx<EventType>(swapParams: SwapParams, initTxHash: string, eventFilter: string): Promise<Transaction<EventType>> {
        const txReceipt = await this.walletProvider.getChainProvider().getTransactionByHash(initTxHash);

        if (txReceipt?.logs) {
            for (const log of txReceipt.logs as Log[]) {
                const initiate = this.contract.interface.parseLog(log);

                if (initiate?.args?.id && initiate.args.htlc) {
                    await this.verifyInitiateSwapTransaction(swapParams, { ...txReceipt, _raw: initiate });
                    const currentBlock = await this.walletProvider.getChainProvider().getBlockHeight();
                    return await this.searchLogs(async (from: number, to: number) => {
                        const event = await this.contract.queryFilter(this.contract.filters[eventFilter](initiate.args.id), from, to);
                        if (event.length > 1) {
                            throw Error(`This should never happen. Found more than one ${eventFilter} TX`);
                        } else {
                            if (event[0]) {
                                const tx = await this.walletProvider.getChainProvider().getTransactionByHash(event[0].transactionHash);
                                return { ...tx, _raw: event[0] };
                            }
                        }
                    }, currentBlock);
                }
            }
        }
        return null;
    }
}
