import { BitcoinEsploraSwapFindProvider } from '@liquality/bitcoin-esplora-swap-find-provider'
import { Transaction, bitcoin } from '@liquality/types'

type TransactionMatchesFunction = (tx: Transaction<bitcoin.Transaction>) => boolean

export default class BitcoinCashRestSwapFindProvider extends BitcoinEsploraSwapFindProvider {
  constructor(baseUrl: string) {
    super(baseUrl)
  }

  async findAddressTransaction(address: string, currentHeight: number, predicate: TransactionMatchesFunction) {
    const transactions = (await this.nodeGet('electrumx/transactions/' + address))['transactions']
    const rawTx = await this.nodePost('rawtransactions/getRawTransaction', {
      txids: transactions.map((obj: any) => obj['tx_hash']),
      verbose: true
    })

    for (let i = 0; i < transactions.length; i++) {
      const transactionObj: any = {}
      transactionObj.status = { confirmed: transactions[i]['height'] > 0 }
      if (transactionObj.status.confirmed) {
        transactionObj.status.block_height = transactions[i]['height']
        transactionObj.status.block_hash = rawTx[i]['blockhash']
      }
      // Not needed
      transactionObj.fee = 0
      transactionObj.txid = transactions[i]['tx_hash']
      const formattedTransaction: Transaction<bitcoin.Transaction> = await this.getMethod('formatTransaction')(
        transactionObj,
        currentHeight,
        rawTx[i]['hex']
      )
      if (predicate(formattedTransaction)) {
        return formattedTransaction
      }
    }
  }
}
