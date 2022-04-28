import { Transaction } from '@chainify/types';
import { payments } from 'bitcoinjs-lib';
import { BitcoinNetwork, SwapMode, Transaction as BitcoinTransaction } from '../types';

export interface BitcoinSwapProviderOptions {
    network: BitcoinNetwork;
    mode?: SwapMode;
    scraperUrl?: string;
}

export type TransactionMatchesFunction = (tx: Transaction<BitcoinTransaction>) => boolean;

export type PaymentVariants = {
    [SwapMode.P2WSH]?: payments.Payment;
    [SwapMode.P2SH_SEGWIT]?: payments.Payment;
    [SwapMode.P2SH]?: payments.Payment;
};
