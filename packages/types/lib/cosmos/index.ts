export interface RpcResponse {
  jsonrpc?: string
  id?: number
  result: any
}

export interface Attribute {
  key: string
  value: string
  index: boolean
}

export interface Event {
  type: string
  attributes: Attribute[]
}

export interface TxResult {
  code: number
  data: string
  log: string
  info: string
  gas_wanted: string
  gas_used: string
  events: Event[]
  codespace: string
}

export interface Tx {
  hash: string
  height: string
  index?: number
  tx_result: TxResult
  tx: string
}
