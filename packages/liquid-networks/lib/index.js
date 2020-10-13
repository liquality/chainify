import * as liquidjs from 'liquidjs-lib'
import { version } from '../package.json'

export default {
  liquid: {
    name: 'liquid',
    ...liquidjs.networks.liquid,
    coinType: '0',
    isTestnet: false
  },
  liquid_regtest: {
    name: 'liquid_regtest',
    ...liquidjs.networks.regtest,
    coinType: '1',
    isTestnet: true
  },

  version
}
