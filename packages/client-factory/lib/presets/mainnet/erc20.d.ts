import EthereumRpcProvider from '@liquality/ethereum-rpc-provider';
import EthereumJsWalletProvider from '@liquality/ethereum-js-wallet-provider';
import EthereumGasNowFeeProvider from '@liquality/ethereum-gas-now-fee-provider';
import EthereumErc20Provider from '@liquality/ethereum-erc20-provider';
import EthereumErc20SwapProvider from '@liquality/ethereum-erc20-swap-provider';
import EthereumErc20ScraperSwapFindProvider from '@liquality/ethereum-erc20-scraper-swap-find-provider';
declare const _default: ({
    provider: typeof EthereumRpcProvider;
    optional: string[];
    args: (config: any) => string[];
    onlyIf?: undefined;
    requires?: undefined;
} | {
    provider: typeof EthereumJsWalletProvider;
    onlyIf: string[];
    args: (config: any) => any[];
    optional?: undefined;
    requires?: undefined;
} | {
    provider: typeof EthereumErc20Provider;
    requires: string[];
    args: (config: any) => any[];
    optional?: undefined;
    onlyIf?: undefined;
} | {
    provider: typeof EthereumErc20SwapProvider;
    optional?: undefined;
    args?: undefined;
    onlyIf?: undefined;
    requires?: undefined;
} | {
    provider: typeof EthereumErc20ScraperSwapFindProvider;
    args: string[];
    optional?: undefined;
    onlyIf?: undefined;
    requires?: undefined;
} | {
    provider: typeof EthereumGasNowFeeProvider;
    optional?: undefined;
    args?: undefined;
    onlyIf?: undefined;
    requires?: undefined;
})[];
export default _default;
