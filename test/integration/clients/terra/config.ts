import { BigNumber, ChainId, Network } from '@liquality/types';
import { IConfig } from '../../types';

export const TerraConfig = (network: Network): IConfig => {
    return {
        network,

        walletOptions: {
            mnemonic: 'diary wolf balcony magnet view mosquito settle gym slim target divert all',
            derivationPath: `m/44'/${network.coinType}'/`,
            index: '0',
        },

        walletExpectedResult: {
            address: 'terra1h5g5ma20tpl828wc2g45pj8x6464cemteqmxl7',
        },

        swapOptions: {
            contractAddress: null,
        },

        swapParams: {
            value: new BigNumber(5000000),
        },

        sendParams: {
            value: new BigNumber(1),
        },

        recipientAddress: null,

        assets: [
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
                code: 'USTTTT',
                chain: ChainId.Terra,
                isNative: true,
                type: 'native',
                decimals: 6,
            },
        ],
    };
};
