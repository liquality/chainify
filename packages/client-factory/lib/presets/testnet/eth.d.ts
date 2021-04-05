import EthereumRpcProvider from '@liquality/ethereum-rpc-provider';
import EthereumJsWalletProvider from '@liquality/ethereum-js-wallet-provider';
import EthereumSwapProvider from '@liquality/ethereum-swap-provider';
import EthereumScraperSwapFindProvider from '@liquality/ethereum-scraper-swap-find-provider';
import EthereumRpcFeeProvider from '@liquality/ethereum-rpc-fee-provider';
declare const _default: ({
    provider: typeof EthereumRpcProvider;
    optional: string[];
    args: (config: any) => string[];
    onlyIf?: undefined;
} | {
    provider: typeof EthereumJsWalletProvider;
    onlyIf: string[];
    args: (config: any) => any[];
    optional?: undefined;
} | {
    provider: typeof EthereumSwapProvider;
    optional?: undefined;
    args?: undefined;
    onlyIf?: undefined;
} | {
    provider: typeof EthereumScraperSwapFindProvider;
    args: string[];
    optional?: undefined;
    onlyIf?: undefined;
} | {
    provider: typeof EthereumRpcFeeProvider;
    optional?: undefined;
    args?: undefined;
    onlyIf?: undefined;
})[];
export default _default;
