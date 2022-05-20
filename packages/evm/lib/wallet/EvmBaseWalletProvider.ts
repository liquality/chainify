import { Chain, Wallet } from '@chainify/client';
import { ReplaceFeeInsufficientError } from '@chainify/errors';
import { AddressType, Asset, BigNumber, FeeType, Network, Transaction } from '@chainify/types';
import { ensure0x, remove0x } from '@chainify/utils';
import { Signer } from '@ethersproject/abstract-signer';
import { ERC20__factory } from '../typechain';
import { EthereumTransactionRequest, EthersTransactionResponse } from '../types';
import { extractFeeData, fromGwei, parseTxRequest, parseTxResponse } from '../utils';

export abstract class EvmBaseWalletProvider<Provider, S extends Signer = Signer> extends Wallet<Provider, S> {
    protected signer: S;

    constructor(chainProvider?: Chain<Provider>) {
        super(chainProvider);
    }

    public getSigner() {
        return this.signer;
    }

    public setSigner(signer: S) {
        this.signer = signer;
    }

    public async signMessage(message: string, _from: AddressType): Promise<string> {
        const signedMessage = await this.signer.signMessage(message);
        return remove0x(signedMessage);
    }

    public async sendTransaction(txRequest: EthereumTransactionRequest): Promise<Transaction<EthersTransactionResponse>> {
        const chainId = Number(this.chainProvider.getNetwork().chainId);

        // default to average fee
        if (!txRequest.fee) {
            txRequest.fee = (await this.chainProvider.getFees()).average.fee;
        }

        // Handle ERC20 transfers
        if (txRequest.asset && !txRequest.asset.isNative) {
            const transferErc20Tx = await ERC20__factory.connect(txRequest.asset.contractAddress, this.signer).populateTransaction.transfer(
                ensure0x(txRequest.to.toString()),
                txRequest.value.toString()
            );
            const result = await this.signer.sendTransaction(
                parseTxRequest({ chainId, ...transferErc20Tx, ...extractFeeData(txRequest.fee) })
            );
            return parseTxResponse(result);
        }
        // Handle ETH transfers
        else {
            const result = await this.signer.sendTransaction(parseTxRequest({ chainId, ...txRequest, ...extractFeeData(txRequest.fee) }));
            return parseTxResponse(result);
        }
    }

    public async sendBatchTransaction(txRequests: EthereumTransactionRequest[]): Promise<Transaction<EthersTransactionResponse>[]> {
        const result: Transaction<EthersTransactionResponse>[] = [];
        for (const txRequest of txRequests) {
            const tx = await this.sendTransaction(txRequest);
            result.push(tx);
        }
        return result;
    }

    public async sendSweepTransaction(address: AddressType, asset: Asset, fee?: FeeType): Promise<Transaction<any>> {
        const balance = (await this.getBalance([asset]))[0];
        const tx: EthereumTransactionRequest = { to: address, value: balance, fee };
        return await this.sendTransaction(tx);
    }

    public async updateTransactionFee(
        tx: string | Transaction<EthersTransactionResponse>,
        newFee: FeeType
    ): Promise<Transaction<EthersTransactionResponse>> {
        const transaction: Transaction<EthersTransactionResponse> =
            typeof tx === 'string' ? await this.chainProvider.getTransactionByHash(tx) : tx;

        const { gasPrice, maxPriorityFeePerGas, maxFeePerGas } = transaction._raw;

        // EIP1559
        if (typeof newFee !== 'number') {
            if (maxPriorityFeePerGas && newFee.maxPriorityFeePerGas && maxFeePerGas && newFee.maxFeePerGas) {
                if (maxPriorityFeePerGas.gte(fromGwei(newFee.maxPriorityFeePerGas).toNumber())) {
                    throw new ReplaceFeeInsufficientError('Replace transaction underpriced: provide more maxPriorityFeePerGas');
                }
                if (maxFeePerGas.gte(fromGwei(newFee.maxFeePerGas).toNumber())) {
                    throw new ReplaceFeeInsufficientError('Replace transaction underpriced: provide more maxFeePerGas');
                }
            } else {
                throw new ReplaceFeeInsufficientError('No replacement fee is provided');
            }
        }
        // Legacy
        else if (gasPrice && newFee) {
            if (gasPrice.gte(fromGwei(newFee).toNumber())) {
                throw new ReplaceFeeInsufficientError('Replace transaction underpriced: provide more gasPrice');
            }
        } else {
            throw new ReplaceFeeInsufficientError('Replace transaction underpriced');
        }

        const newTransaction = {
            ...transaction,
            value: new BigNumber(transaction.value),
            nonce: transaction._raw.nonce,
            fee: newFee,
        };
        return this.sendTransaction(newTransaction);
    }

    public async getBalance(assets: Asset[]): Promise<BigNumber[]> {
        const user = await this.getAddress();
        return await this.chainProvider.getBalance([user], assets);
    }

    public async getConnectedNetwork(): Promise<Network> {
        return this.chainProvider.getNetwork();
    }
}
