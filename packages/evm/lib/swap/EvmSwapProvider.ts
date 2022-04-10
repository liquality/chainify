import { BaseProvider, Log } from '@ethersproject/providers';
import { SwapParams, Transaction } from '@liquality/types';
import { Math, remove0x } from '@liquality/utils';
import { ClaimEvent, InitiateEvent, RefundEvent } from '../typechain/LiqualityHTLC';
import { EvmSwapOptions } from '../types';
import { EvmBaseWalletProvider } from '../wallet/EvmBaseWalletProvider';
import { EvmBaseSwapProvider } from './EvmBaseSwapProvider';

export class EvmSwapProvider extends EvmBaseSwapProvider {
    protected walletProvider: EvmBaseWalletProvider<BaseProvider>;

    constructor(swapOptions: EvmSwapOptions, walletProvider?: EvmBaseWalletProvider<BaseProvider>) {
        super(swapOptions, walletProvider);
    }

    async findInitiateSwapTransaction(swapParams: SwapParams): Promise<Transaction<InitiateEvent>> {
        const currentBlock = await this.walletProvider.getChainProvider().getBlockHeight();

        return await this.searchLogs(async (from: number, to: number) => {
            const filter = await this.contract.queryFilter(this.contract.filters.Initiate(), from, to);

            const initiate = filter.find((event) => {
                // no need to call verifyInitiateSwapTransaction because if the transaction is failed, then the event won't be logged
                // the event will only be logged if the tx is successful & confirmed
                const isTrue = this.doesTransactionMatchInitiation(swapParams, { _raw: event } as Transaction<InitiateEvent>);
                return isTrue;
            });

            if (initiate) {
                const tx = await this.walletProvider.getChainProvider().getTransactionByHash(initiate.transactionHash);
                return { ...tx, _raw: initiate };
            }
        }, currentBlock);
    }

    async findClaimSwapTransaction(swapParams: SwapParams, initTxHash: string): Promise<Transaction<ClaimEvent>> {
        const foundTx = await this.findTx<ClaimEvent>(swapParams, initTxHash, 'Claim');
        const secret = foundTx?._raw?.args?.secret;
        if (secret) {
            return { ...foundTx, secret: remove0x(secret) };
        }
    }

    async findRefundSwapTransaction(swapParams: SwapParams, initTxHash: string): Promise<Transaction<RefundEvent>> {
        return this.findTx<RefundEvent>(swapParams, initTxHash, 'Refund');
    }

    private async searchLogs(callback: (from: number, to: number) => Promise<Transaction>, currentBlock: number) {
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
                const initiate = this.tryParseLog(log);

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
