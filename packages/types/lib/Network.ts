export interface Network {
    name: string;
    coinType: string;
    isTestnet: boolean;
    chainId?: string | number;
    rpcUrl?: string;
    scraperUrl?: string;
    explorerUrl?: string;
}
