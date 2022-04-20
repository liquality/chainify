import { Fragment, Interface, JsonFragment } from '@ethersproject/abi';
import { BaseProvider } from '@ethersproject/providers';
import { AddressType, Asset, BigNumber } from '@liquality/types';
import { ERC20__factory, Multicall3, Multicall3__factory } from '../typechain';

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

export class EvmMulticallProvider {
    private _multicallAddress: string;
    private _multicall: Multicall3;

    // https://github.com/mds1/multicall
    constructor(chainProvider: BaseProvider, multicallAddress = '0xcA11bde05977b3631167028862bE2a173976CA11') {
        this._multicallAddress = multicallAddress;
        this._multicall = Multicall3__factory.connect(this._multicallAddress, chainProvider);
    }

    public async setMulticallAddress(multicallAddress: string) {
        this._multicall = Multicall3__factory.connect(multicallAddress, this._multicall.provider);
        this._multicallAddress = multicallAddress;
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
                        abi: Multicall3__factory.abi,
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

        return result.map((r) => {
            return r ? new BigNumber(r.toString()) : new BigNumber(0);
        });
    }

    public async multicall<T extends any[] = any[]>(calls: ReadonlyArray<Call>): Promise<T> {
        const aggregatedCallData: ContractCall[] = calls.map((call: Call) => {
            const callData = new Interface(call.abi).encodeFunctionData(call.name, call.params);
            return { target: call.target, callData };
        });

        const result = await this._multicall.callStatic.tryAggregate(false, aggregatedCallData);

        return calls.map((call: Call, index: number) => {
            const [success, returnData] = result[index];

            if (success) {
                const decodedResult = new Interface(call.abi).decodeFunctionResult(call.name, returnData);
                return decodedResult.length === 1 ? decodedResult[0] : decodedResult;
            }

            return null;
        }) as T;
    }
}
