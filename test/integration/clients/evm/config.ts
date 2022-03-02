import { BigNumber, ChainId, Network } from '@liquality/types';
import { IConfig } from '../../types';

export const EVMConfig = (network: Network): IConfig => {
    return {
        network,

        walletOptions: {
            mnemonic: 'diary wolf balcony magnet view mosquito settle gym slim target divert all',
            derivationPath: `m/44'/${network.coinType}'/0'/0/`,
            index: '0',
        },

        walletExpectedResult: {
            address: '0x70B2d0adf991a69FC65eC510A05EC1f7392B6E05',
            numberOfUsedAddresses: 1,
            unusedAddress: '0x70B2d0adf991a69FC65eC510A05EC1f7392B6E05',
            privateKey: 'b2b630d7354d5ffa273b10153c3dade56bc8587d66331c2aaae447eb4daa2065',
            signedMessage:
                '926abeac6b5698f182d31d2b657f8c3352aa0f92337128fac1741960844c2aa25a7ba8c27112ec2e7c960505edbc9508816f03088d7947f754795b92ba8e8b2e1b',
        },

        swapOptions: {
            contractAddress: '0x91441284dfAc14425c9Bf7b3f159CE480d0dd018',
        },

        swapParams: {
            value: new BigNumber(1),
        },

        sendParams: {
            value: new BigNumber(1),
        },

        recipientAddress: '0xe862a41cef3bbcc6d85bff8b9c36801a6bc4453e',
        multicallAddress: '0x08579f8763415cfCEa1B0F0dD583b1A0DEbfBe2b',

        assets: [
            {
                name: 'Ethereum',
                code: 'ETH',
                chain: ChainId.Ethereum,
                isNative: true,
                type: 'native',
                decimals: 18,
            },
            {
                name: 'TestToken',
                code: 'TT',
                chain: ChainId.Ethereum,
                isNative: false,
                type: 'erc20',
                decimals: 18,
                contractAddress: '0x6ACbD54254da14Db970c7eDE7cFD90784dBeFb6C',
            },
        ],
    };
};
