import { MultiLayerJsonRpcProvider } from '@chainify/types';
import { getContractInterface, predeploys } from '@eth-optimism/contracts';
import { StaticJsonRpcProvider, TransactionRequest } from '@ethersproject/providers';
import { serialize } from '@ethersproject/transactions';
import { BigNumber, Contract } from 'ethers';

export class OptimismJsonRpcProvider extends StaticJsonRpcProvider implements MultiLayerJsonRpcProvider {
    constructor(url: string, network?: number) {
        super(url, network);
    }

    async estimateL1Gas(txRequest: TransactionRequest): Promise<BigNumber> {
        const gpo = this.connectGasPriceOracle();
        return await gpo.getL1GasUsed(await this.serializeTx(txRequest));
    }

    async getL1GasPrice(): Promise<BigNumber> {
        const gpo = this.connectGasPriceOracle();
        return gpo.l1BaseFee();
    }

    private connectGasPriceOracle(): Contract {
        return new Contract(predeploys.OVM_GasPriceOracle, getContractInterface('OVM_GasPriceOracle'), this);
    }

    private async serializeTx(txRequest: TransactionRequest) {
        return serialize({
            data: txRequest.data,
            to: txRequest.to,
            gasPrice: txRequest.gasPrice,
            type: txRequest.type,
            gasLimit: txRequest.gasLimit,
            nonce: await this.getNonce(txRequest),
        });
    }

    private async getNonce(txRequest: TransactionRequest): Promise<number> {
        if (txRequest.nonce !== undefined) {
            return Number(txRequest.nonce);
        } else if (txRequest.from !== undefined) {
            return await this.getTransactionCount(txRequest.from);
        }

        throw new Error('OptimismJsonRpcProvider: failed to get nonce');
    }
}
