import { AddressType, Asset, BigNumber } from '@chainify/types';
import { Interface } from '@ethersproject/abi';
import { BaseProvider } from '@ethersproject/providers';
import { ERC20__factory, Multicall3, Multicall3__factory } from '../typechain';
import { MulticallData } from '../types';

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

    public getMulticallAddress(): string {
        return this._multicallAddress;
    }

    public buildBalanceCallData(asset: Asset, user: AddressType) {
        if (asset.isNative) {
            return {
                target: this._multicallAddress,
                abi: Multicall3__factory.abi,
                name: 'getEthBalance',
                params: [user],
            };
        } else {
            return {
                target: asset.contractAddress,
                abi: ERC20__factory.abi,
                name: 'balanceOf',
                params: [user],
            };
        }
    }

    public setMulticallAddress(multicallAddress: string) {
        this._multicall = Multicall3__factory.connect(multicallAddress, this._multicall.provider);
        this._multicallAddress = multicallAddress;
    }

    public async getEthBalance(address: string): Promise<BigNumber> {
        return new BigNumber((await this._multicall.getEthBalance(address)).toString());
    }

    public async getMultipleBalances(address: AddressType, assets: Asset[]): Promise<BigNumber[]> {
        const user = address.toString();
        const result = await this.multicall<BigNumber[]>(assets.map((asset: Asset) => this.buildBalanceCallData(asset, user)));
        return result.map((r) => (r ? new BigNumber(r.toString()) : null));
    }

    public async multicall<T extends any[] = any[]>(calls: ReadonlyArray<MulticallData>): Promise<T> {
        const aggregatedCallData: ContractCall[] = calls.map((call: MulticallData) => {
            const callData = new Interface(call.abi).encodeFunctionData(call.name, call.params);
            return { target: call.target, callData };
        });

        const result = await this._multicall.callStatic.tryAggregate(false, aggregatedCallData);

        return calls.map((call: MulticallData, index: number) => {
            const [success, returnData] = result[index];

            if (success) {
                const decodedResult = new Interface(call.abi).decodeFunctionResult(call.name, returnData);
                return decodedResult.length === 1 ? decodedResult[0] : decodedResult;
            }

            return null;
        }) as T;
    }
}
