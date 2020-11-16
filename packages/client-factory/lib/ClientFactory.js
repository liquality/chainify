import { isArray, isFunction } from 'lodash'
import Client from '@liquality/client'

import * as presets from './presets'

import { version } from '../package.json'

export default class ClientFactory {
  static createFrom (preset, config = {}) {
    if (!preset || !isArray(preset)) throw new Error('Invalid preset')

    const client = new Client()

    preset.forEach(item => {
      const Provider = item.provider

      if (item.requires) {
        item.requires.forEach(cnf => {
          if (config[cnf] === undefined) throw new Error(`Preset requires config.${cnf}`)
        })
      }

      if (item.onlyIf) {
        const skip = item.onlyIf.some(cnf => config[cnf] === undefined)
        if (skip) return
      }

      item.args = item.args || []
      const args = isFunction(item.args) ? item.args(config) : item.args

      client.addProvider(new Provider(...args))
    })

    return client
  }

  static create (network, asset, config = {}) {
    if (!['mainnet', 'testnet'].includes(network)) throw new Error(`Invalid network ${network}`)
    if (!['btc', 'eth', 'erc20'].includes(asset)) throw new Error(`Invalid asset ${asset}`)

    const preset = presets[network][asset]
    if (!preset) throw new Error(`Preset doesn't exist for network:${network} asset:${asset}`)

    return ClientFactory.createFrom(preset, config)
  }
}

ClientFactory.presets = presets
ClientFactory.version = version
