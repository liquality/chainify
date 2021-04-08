declare module '@ledgerhq/hw-app-btc' {
  export type TransactionInput = {
    prevout: Buffer,
    script: Buffer,
    sequence: Buffer,
    tree?: Buffer,
  }

  export type TransactionOutput = {
    amount: Buffer,
    script: Buffer,
  }

  export type Transaction = {
    version?: Buffer,
    inputs?: TransactionInput[],
    outputs?: TransactionOutput[],
    locktime?: Buffer,
    witness?: Buffer,
    timestamp?: Buffer,
    nVersionGroupId?: Buffer,
    nExpiryHeight?: Buffer,
    extraData?: Buffer,
  }

  export type CreateTransactionArg = {
    inputs: [Transaction, number, ?string, ?number][],
    associatedKeysets: string[],
    changePath?: string,
    outputScriptHex: string,
    lockTime?: number,
    sigHashType?: number,
    segwit?: boolean,
    initialTimestamp?: number,
    additionals: Array<string>,
    expiryHeight?: Buffer,
    useTrustedInputForSegwit?: boolean,
    onDeviceStreaming?: ({
      progress: number,
      total: number,
      index: number,
    }) => void,
    onDeviceSignatureRequested?: () => void,
    onDeviceSignatureGranted?: () => void,
  }

  export type SignP2SHTransactionArg = {
    inputs: Array<[Transaction, number, ?string, ?number]>,
    associatedKeysets: string[],
    outputScriptHex: string,
    lockTime?: number,
    sigHashType?: number,
    segwit?: boolean,
    transactionVersion?: number,
  };

  class HwAppBitcoin {
    getWalletPublicKey (path: strinjg, options: { verify?: boolean, format?: AddressFormat }): Promise<{
      publicKey: string,
      bitcoinAddress: string,
      chainCode: string,
    }>

    signMessageNew(path: string, messageHex: string): Promise<{
    v: number,
      r: string,
      s: string,
    }>

    serializeTransactionOutputs(t: Transaction): Buffer

    createPaymentTransactionNew(arg: CreateTransactionArg): Promise<string>
    
    splitTransaction(transactionHex: string,
      isSegwitSupported: ?boolean = false,
      hasTimestamp?: boolean = false,
      hasExtraData?: boolean = false,
      additionals: Array<string> = []): Promise<Transaction>

    signP2SHTransaction(arg: SignP2SHTransactionArg) : Promise<string[]>

    transport: any
  }
  export = HwAppBitcoin
}