import { SwapParams, Transaction } from '@chainify/types';
import { BitcoinBaseChainProvider } from '../chain/BitcoinBaseChainProvider';
import { Transaction as BitcoinTransaction } from '../types';
import { IBitcoinWallet } from '../wallet/IBitcoinWallet';
import { BitcoinSwapBaseProvider } from './BitcoinSwapBaseProvider';
import { BitcoinSwapProviderOptions } from './types';

export class BitcoinSwapRpcProvider extends BitcoinSwapBaseProvider {
    constructor(options: BitcoinSwapProviderOptions, walletProvider?: IBitcoinWallet<BitcoinBaseChainProvider>) {
        super(options, walletProvider);
    }

    public async findSwapTransaction(
        _swapParams: SwapParams,
        blockNumber: number,
        predicate: (tx: Transaction<BitcoinTransaction>) => boolean
    ) {
        // TODO: Are mempool TXs possible?
        const block = await this.walletProvider.getChainProvider().getBlockByNumber(blockNumber, true);
        const swapTransaction = block.transactions.find(predicate);
        return swapTransaction;
    }
}
