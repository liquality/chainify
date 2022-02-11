import { StandardError } from '@liquality/errors';
import { BaseProvider } from '@ethersproject/providers';
import { Interface, JsonFragment, Fragment } from '@ethersproject/abi';

import { AddressType, Asset, BigNumber } from '@liquality/types';

import { Multicall__factory, Multicall, ERC20__factory } from '../typechain';

interface Call {
    target: string;
    abi: ReadonlyArray<Fragment | JsonFragment | string>;
    name: string;
    params: ReadonlyArray<Fragment | JsonFragment | string>;
}

interface ContractCall {
    target: string;
    callData: string;
}

const multicallAddresses = {
    1: '0xeefba1e63905ef1d7acba5a8513c70307c1ce441',
    3: '0xF24b01476a55d635118ca848fbc7Dab69d403be3',
    4: '0x42ad527de7d4e9d9d011ac45b31d8551f8fe9821',
    5: '0x77dca2c955b15e9de4dbbcf1246b4b85b651e50e',
    42: '0x2cc8688c5f75e365aaeeb4ea8d6a480405a48d2a',
    56: '0x1Ee38d535d541c55C9dae27B12edf090C608E6Fb',
    100: '0xb5b692a88bdfc81ca69dcb1d924f59f0413a602a',
    137: '0xc4f1501f337079077842343Ce02665D8960150B0',
    1337: '0x08579f8763415cfCEa1B0F0dD583b1A0DEbfBe2b',
    43114: '0xdDCbf776dF3dE60163066A5ddDF2277cB445E0F3',
    80001: '0x5a0439824F4c0275faa88F2a7C5037F9833E29f1',
} as Record<number, string>;

export class EvmMulticallProvider {
    private _multicallAddress: string;
    private _multicall: Multicall;

    constructor(chainProvider: BaseProvider, chainId = 1 /* Ethereum Mainnet */) {
        this._multicallAddress = this.getAddressForChainId(chainId);
        this._multicall = Multicall__factory.connect(this._multicallAddress, chainProvider);
    }

    private getAddressForChainId(chainId: number) {
        return multicallAddresses[chainId];
    }

    public async getEthBalance(address: string): Promise<BigNumber> {
        return new BigNumber((await this._multicall.getEthBalance(address)).toString());
    }

    public async getMultipleBalances(address: AddressType, assets: Asset[]): Promise<BigNumber[]> {
        const result = await this.multicall<BigNumber[]>(
            assets.map((asset: Asset) => {
                if (asset.isNative) {
                    return {
                        target: this._multicallAddress,
                        abi: Multicall__factory.abi,
                        name: 'getEthBalance',
                        params: [address.toString()],
                    };
                } else {
                    return {
                        target: asset.contractAddress,
                        abi: ERC20__factory.abi,
                        name: 'balanceOf',
                        params: [address.toString()],
                    };
                }
            })
        );

        return result.map((r) => new BigNumber(r.toString()));
    }

    public async multicall<T extends any[] = any[]>(calls: ReadonlyArray<Call>): Promise<T> {
        const aggregatedCallData: ContractCall[] = calls.map((call: Call) => {
            const callData = new Interface(call.abi).encodeFunctionData(call.name, call.params);
            return { target: call.target, callData };
        });

        const result = await this._multicall.callStatic.aggregate(aggregatedCallData);
        if (!result.returnData) {
            throw new StandardError(`Could not make call with data: ${aggregatedCallData}`);
        }

        return calls.map((call: Call, index: number) => {
            const decodedResult = new Interface(call.abi).decodeFunctionResult(call.name, result.returnData[index]);
            return decodedResult.length === 1 ? decodedResult[0] : decodedResult;
        }) as T;
    }
}
