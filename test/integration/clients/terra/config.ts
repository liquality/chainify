import { Asset, BigNumber, ChainId, Network } from '@liquality/types';
import { IConfig } from '../../types';

export const TerraConfig = (network: Network): IConfig => {
    return {
        network,

        walletOptions: {
            mnemonic:
                'fury motion step civil horn snake engine wage honey already interest fall property nephew jeans true moment weasel village then upset avocado wheat write',
            derivationPath: `m/44'/${network.coinType}'/0'/0/`,
            index: '0',
        },

        walletExpectedResult: {
            address: 'terra156c6y66lqp7xe9x3hvl3uf0szl7ek44ferg4sg',
            numberOfUsedAddresses: 1,
            privateKey: '9977cb9d096ad0287d36bf00a67293ac4cf0dc7b9633837ca6383575f93fd888',
        },

        swapOptions: {
            contractAddress: null,
        },

        swapParams: {
            value: new BigNumber(5000000),
        },

        sendParams: {
            value: new BigNumber(5000000),
            feeAsset: terraAssets[0],
        },

        recipientAddress: 'terra10c9wv2symnwq72yh8v9xg7ddkcugxq08nhskx9',

        assets: terraAssets,
    };
};

const terraAssets = [
    {
        name: 'Luna',
        code: 'LUNA',
        chain: ChainId.Terra,
        isNative: true,
        type: 'native',
        decimals: 6,
    },
    {
        name: 'TerraUSD',
        code: 'UST',
        chain: ChainId.Terra,
        isNative: true,
        type: 'native',
        decimals: 6,
    },
] as Asset[];
