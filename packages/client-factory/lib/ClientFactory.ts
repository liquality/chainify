import { isArray, isFunction } from 'lodash'
import { Client } from '@liquality/client'

import * as presets from './presets'

interface ProviderOption {
  provider: any
  optional: string[]
  args: any[] | ((config: any) => any[])
  requires: string[]
  onlyIf: string[]
}

export default class ClientFactory {
  static createFrom(preset: ProviderOption[], config: any = {}) {
    if (!preset || !isArray(preset)) throw new Error('Invalid preset')

    const client = new Client()

    preset.forEach((item) => {
      const Provider = item.provider

      if (item.requires) {
        item.requires.forEach((cnf) => {
          if (config[cnf] === undefined) throw new Error(`Preset requires config.${cnf}`)
        })
      }

      if (item.onlyIf) {
        const skip = item.onlyIf.some((cnf) => config[cnf] === undefined)
        if (skip) return
      }

      item.args = item.args || []
      const args = isFunction(item.args) ? item.args(config) : item.args

      client.addProvider(new Provider(...args))
    })

    return client
  }

  static create(network: string, asset: string, config = {}) {
    if (!['mainnet', 'testnet'].includes(network)) throw new Error(`Invalid network ${network}`)
    if (!['btc', 'eth', 'erc20'].includes(asset)) throw new Error(`Invalid asset ${asset}`)

    const preset = (presets as { [index: string]: any })[network][asset]
    if (!preset) throw new Error(`Preset doesn't exist for network:${network} asset:${asset}`)

    return ClientFactory.createFrom(preset, config)
  }

  static presets = presets
}
