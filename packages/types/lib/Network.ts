export interface Network {
    name: string;
    coinType: string;
    isTestnet: boolean;
    chainId?: string | number;
    networkId?: string | number;
    rpcUrl?: string;
    scraperUrl?: string;
    explorerUrl?: string;
    helperUrl?: string;
    batchScraperUrl?: string;
    feeProviderUrl?: string;
}
