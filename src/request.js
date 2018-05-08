
/**
 * Module dependencies.
 */

import Obfuscator from './logging/request-obfuscator'
import request from 'request'
import requestLogger from '@uphold/request-logger'

/**
 * Exports.
 */

export default (driver, logger) => {
  const obfuscator = new Obfuscator(driver)

  return requestLogger(request, (request, instance) => {
    obfuscator.obfuscate(request, instance)

    if (request.type === 'response') {
      return logger.debug({ request }, `Received response for request ${request.id}`)
    }

    return logger.debug({ request }, `Making request ${request.id} to ${request.method} ${request.uri}`)
  })
}
