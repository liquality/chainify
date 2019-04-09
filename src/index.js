import '@babel/polyfill' // TODO: remove this when ledgerjs supports babel 7: https://github.com/LedgerHQ/ledgerjs/issues/218
import Client from './Client'
import Provider from './Provider'

import * as providers from './providers'
import * as crypto from './crypto'
import * as errors from './errors'
import * as schema from './schema'
import Debug from './Debug'

import JsonRpcProvider from './providers/JsonRpcProvider'
import LedgerProvider from './providers/LedgerProvider'

import { version } from '../package.json'

export {
  Client,
  Provider,
  providers,
  crypto,
  errors,
  schema,
  JsonRpcProvider,
  LedgerProvider,
  version,
  Debug
}
