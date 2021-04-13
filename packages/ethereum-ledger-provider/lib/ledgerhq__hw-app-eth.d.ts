declare module '@ledgerhq/hw-app-eth' {
  class HwAppEthereum {
    signPersonalMessage(path: string, messageHex: string): Promise<{ v: string; r: string; s: string }>

    getAddress(
      path: string,
      boolDisplay?: boolean,
      boolChaincode?: boolean
    ): Promise<{
      publicKey: string
      address: string
      chainCode?: string
    }>

    signTransaction(path: string, rawTxHex: string): Promise<{ v: string; r: string; s: string }>

    transport: any
  }
  export = HwAppEthereum
}
