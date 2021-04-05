import BitcoinEsploraBatchApiProvider from '@liquality/bitcoin-esplora-batch-api-provider';
import BitcoinJsWalletProvider from '@liquality/bitcoin-js-wallet-provider';
import BitcoinSwapProvider from '@liquality/bitcoin-swap-provider';
import BitcoinEsploraSwapFindProvider from '@liquality/bitcoin-esplora-swap-find-provider';
import BitcoinRpcFeeProvider from '@liquality/bitcoin-rpc-fee-provider';
declare const _default: ({
    provider: typeof BitcoinEsploraBatchApiProvider;
    optional: string[];
    args: (config: any) => any[];
    onlyIf?: undefined;
} | {
    provider: typeof BitcoinJsWalletProvider;
    onlyIf: string[];
    args: (config: any) => any[];
    optional?: undefined;
} | {
    provider: typeof BitcoinSwapProvider;
    args: import("../../../../bitcoin-networks/dist/lib").BitcoinNetwork[];
    optional?: undefined;
    onlyIf?: undefined;
} | {
    provider: typeof BitcoinEsploraSwapFindProvider;
    args: string[];
    optional?: undefined;
    onlyIf?: undefined;
} | {
    provider: typeof BitcoinRpcFeeProvider;
    optional?: undefined;
    args?: undefined;
    onlyIf?: undefined;
})[];
export default _default;
