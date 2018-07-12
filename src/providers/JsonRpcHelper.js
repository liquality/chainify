import JSONBigInt from 'json-bigint'
import { has } from 'lodash'

const { parse } = JSONBigInt({ storeAsString: true, strict: true })

function prepareRequest ({ method, params }) {
  return JSON.stringify({
    id: Date.now(),
    method: method,
    params: params
  })
}

function praseResponse (body, headers) {
  if (typeof body === 'string' && headers['content-type'] !== 'application/json') {
    throw new Error(body)
  }

  body = parse(body)

  if (body.error) {
    throw new Error(`Error occurred while processing the RPC call: ${body.error}`)
  }

  if (!has(body, 'result')) {
    throw new Error('Missing `result` on the RPC call result')
  }

  return body.result
}

export {
  prepareRequest,
  praseResponse
}
