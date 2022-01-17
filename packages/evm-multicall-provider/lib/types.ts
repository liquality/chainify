import { JsonFragment, Fragment } from '@ethersproject/abi'

export interface Call {
  target: string
  abi: string | ReadonlyArray<Fragment | JsonFragment | string>
  name: string
  params: ReadonlyArray<Fragment | JsonFragment | string>
}

export interface ContractCall {
  target: string
  callData: string
}
