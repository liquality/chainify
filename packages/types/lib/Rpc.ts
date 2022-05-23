import { StaticJsonRpcProvider, TransactionRequest } from '@ethersproject/providers';
import { BigNumber } from 'ethers';

export interface MultiLayerJsonRpcProvider extends StaticJsonRpcProvider {
    estimateL1Gas(txRequest: TransactionRequest): Promise<BigNumber>;
    getL1GasPrice(): Promise<BigNumber>;
}
