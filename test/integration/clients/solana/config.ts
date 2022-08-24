import { Asset, AssetTypes, BigNumber, ChainId, Network } from '@chainify/types';
import { IConfig } from '../../types';

export const SolanaConfig = (network: Network): IConfig => {
    return {
        network,

        walletOptions: {
            mnemonic:
                'thumb proud solar any north rely grow ceiling pattern dress under illegal relief brief flock ensure tumble green million earth lesson absent horse snap',
            derivationPath: `m/44'/${network.coinType}'/0'/0'`,
        },

        walletExpectedResult: {
            address: 'CGP6sKHyrZGPJRoUAy8XbyzmX7YD4tVBQG9SEe9ekZM6',
            numberOfUsedAddresses: 1,
            privateKey: '5xcywSQBBsks8pgWRwRzx6AhZ6cXX2qDtHiFZ8aDZkfiiRA7kTgWvRbgoD1nmTEt8aW1KudN86gPysNXMzuKW6Mr',
        },

        swapOptions: {
            contractAddress: null,
        },

        swapParams: {
            value: new BigNumber(5000000),
        },

        sendParams: {
            value: new BigNumber(5000000),
        },

        recipientAddress: '5r3N8yt7DYgh888Rr7owRoD3Jn6QSNY9sYyisTkT86DU',

        assets: solanaAssets,
    };
};

const solanaAssets = [
    {
        name: 'SOLANA',
        code: 'SOL',
        chain: ChainId.Solana,
        type: AssetTypes.native,
        decimals: 9,
    },
    {
        name: 'SOLANA ERC 20',
        code: 'ERC20',
        chain: ChainId.Solana,
        type: AssetTypes.erc20,
        decimals: 9,
        contractAddress: 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr',
    },
] as Asset[];
