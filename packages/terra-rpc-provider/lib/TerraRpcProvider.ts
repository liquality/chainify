import { NodeProvider as NodeProvider } from "@liquality/node-provider";
import { BigNumber, ChainProvider, Address, Block, Transaction, SendOptions } from "@liquality/types";
export default class TerraRpcProvider extends NodeProvider implements Partial<ChainProvider> {
    generateBlock(numberOfBlocks: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getBlockByHash(blockHash: string, includeTx?: boolean): Promise<Block<any>> {
        throw new Error("Method not implemented.");
    }
    getBlockByNumber(blockNumber: number, includeTx?: boolean): Promise<Block<any>> {
        throw new Error("Method not implemented.");
    }
    getBlockHeight(): Promise<number> {
        throw new Error("Method not implemented.");
    }
    getTransactionByHash(txHash: string): Promise<Transaction<any>> {
        throw new Error("Method not implemented.");
    }
    getBalance(addresses: (string | Address)[]): Promise<BigNumber> {
        throw new Error("Method not implemented.");
    }
    sendTransaction(options: SendOptions): Promise<Transaction<any>> {
        throw new Error("Method not implemented.");
    }
    sendSweepTransaction(address: string | Address, fee?: number): Promise<Transaction<any>> {
        throw new Error("Method not implemented.");
    }
    updateTransactionFee(tx: string | Transaction<any>, newFee: number): Promise<Transaction<any>> {
        throw new Error("Method not implemented.");
    }
    sendBatchTransaction(transactions: SendOptions[]): Promise<Transaction<any>> {
        throw new Error("Method not implemented.");
    }
    sendRawTransaction(rawTransaction: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
}
