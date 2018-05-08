/**
 * Module dependencies.
 */

import { assign, defaults, get, has, isArray, isEmpty, isPlainObject, isString, map, mapKeys } from 'lodash'

export default class Obfuscator {
  constructor (driver) {
    this.methods = driver.methods
  }

  obfuscate (request, instance) {
    this.obfuscateHeaders(request)
    this.obfuscateRequest(request)
    this.obfuscateResponse(request, instance)
  }

  obfuscateHeaders (request) {
    if (request.type !== 'request') {
      return
    }

    if (!has(request, 'headers.authorization')) {
      return
    }

    request.headers.authorization = request.headers.authorization.replace(/(Basic )(.*)/, `$1******`)
  }

  obfuscateRequest (request) {
    if (request.type !== 'request') {
      return
    }

    if (!isString(request.body)) {
      return
    }

    request.body = JSON.parse(request.body)

    if (isArray(request.body)) {
      request.body = map(request.body, this.obfuscateRequestBody)
    } else {
      request.body = this.obfuscateRequestBody(request.body)
    }

    request.body = JSON.stringify(request.body)
  }

  obfuscateResponse (request, instance) {
    if (request.type !== 'response') {
      return
    }

    if (!get(request, 'response.body')) {
      return
    }

    if (get(request, `response.headers['content-type']`) === 'application/octet-stream') {
      request.response.body = '******'

      return
    }

    if (!instance.body) {
      return
    }

    const requestBody = JSON.parse(instance.body)

    if (isArray(request.response.body)) {
      const methodsById = mapKeys(requestBody, method => method.id)

      request.response.body = map(request.response.body, request => this.obfuscateResponseBody(request, methodsById[request.id].method))

      return
    }

    request.response.body = this.obfuscateResponseBody(request.response.body, requestBody.method)
  }

  obfuscateResponseBody (body, method) {
    const fn = get(this.methods[method], 'obfuscate.response')

    if (!fn || isEmpty(body.result)) {
      return body
    }

    return defaults({ result: fn(body.result) }, body)
  }

  obfuscateRequestBody (body) {
    const method = get(this.methods[body.method], 'obfuscate.request')

    if (!method) {
      return body
    }

    if (isPlainObject(body.params)) {
      return assign(body, { params: method.named(body.params) })
    }

    return assign(body, { params: method.default(body.params) })
  }
}
