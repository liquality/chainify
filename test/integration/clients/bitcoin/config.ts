import { BitcoinTypes } from '@liquality/bitcoin';
import { BigNumber, ChainId, Network } from '@liquality/types';
import { IConfig } from '../../types';

export const BtcNodeConfig = (network: Network): IConfig => {
    return {
        ...(CommonBtcConfig(network) as IConfig),

        walletExpectedResult: {
            numberOfUsedAddresses: 2,
        },
    };
};

export const BtcHdWalletConfig = (network: Network): IConfig => {
    return {
        ...(CommonBtcConfig(network) as IConfig),
        walletOptions: {
            mnemonic: 'witch collapse practice feed shame open despair creek road again ice least',
            baseDerivationPath: `m/84'/${network.coinType}'/0'`,
            addressType: BitcoinTypes.AddressType.BECH32,
        },
        walletExpectedResult: {
            numberOfUsedAddresses: 1,
            unusedAddress: 'bcrt1qa558ru7wyls34j6tnedtkmhfjgazwsk4l3sgac',
            address: 'bcrt1qjem0kneyhm9ugh43kw5qxap3h0evneamg0nyxf',
            privateKey: 'cQVnVxxhDDWhGKBahJCKgWtT8qZenkbbGp95v9nPwKjrdJ2WX5uS',
            privateKeyRegex: /^[cLK]\w{51}$/,
            signedMessage:
                '1f1281bcdb0d97ee722634b78bc1c95b336f5cce25e143e95e7c14db2aba565cd549be7e9a3063a30e5edac6f2a7eae17747d5ed0ffb09748dc7e567c45384f9bb',
        },

        recipientAddress: 'bcrt1qa558ru7wyls34j6tnedtkmhfjgazwsk4l3sgac',
    };
};

const CommonBtcConfig = (network: Network): Partial<IConfig> => {
    return {
        network,
        chainOptions: {
            uri: 'http://localhost:18443/',
            username: 'bitcoin',
            password: 'local321',
            network,
        },
        assets: [
            {
                name: 'Bitcoin',
                code: 'BTC',
                chain: ChainId.Bitcoin,
                isNative: true,
                type: 'native',
                decimals: 8,
            },
        ],

        swapParams: {
            value: new BigNumber(1000000),
        },

        sendParams: {
            value: null,
        },
    };
};
