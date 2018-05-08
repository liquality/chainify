
/**
 * Module dependencies.
 */

import { includes } from 'lodash'

/**
 * Export Requester class.
 */

export default class Requester {
  constructor ({ driver, unsupported = [], version } = {}) {
    this.driver = driver
    this.unsupported = unsupported
    this.version = version
  }

  /**
  * Prepare rpc request.
  */

  prepare ({ method, params = [], suffix }) {
    if (this.version && includes(this.unsupported, method)) {
      throw new Error(`Method "${method}" is not supported by version "${this.version}"`)
    }

    const formatted = this.driver.formatter.request(method, params, suffix)

    return {
      id: `${Date.now()}${formatted.suffix !== undefined ? `-${formatted.suffix}` : ''}`,
      method: formatted.method,
      params: formatted.params
    }
  }
}
