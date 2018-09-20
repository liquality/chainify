import axios from 'axios'
import JSONBigInt from 'json-bigint'
import Provider from '../Provider'

const { parse } = JSONBigInt({ storeAsString: true, strict: true })

export default class ApiProvider extends Provider {
  constructor (uri, username, password) {
    super()

    this._axios = axios.create({
      baseURL: uri,
      responseType: 'text',
      transformResponse: undefined, // https://github.com/axios/axios/issues/907,
      validateStatus: (status) => true
    })

    if (username || password) {
      this._axios.defaults.auth = { username, password }
    }
  }

  _prepareGetRequest (data) {
    return data
  }

  _preparePostRequest (data) {
    return data
  }

  _parseGetResponse ({ data, status, statusText, headers }) {
    // Attempt to parse response

    try {
      data = parse(data)
    } catch (e) {}

    return data
  }

  _parsePostResponse ({ data, status, statusText, headers }) {
    return this._parseGetResponse({ data, status, statusText, headers })
  }

  apiGet (uri = '/', data) {
    return this._axios.get(
      uri,
      { params: this._prepareGetRequest(data) }
    ).then(this._parseGetResponse.bind(this))
  }

  apiPost (uri = '/', data) {
    return this._axios.post(
      uri,
      this._preparePostRequest(data)
    ).then(this._parsePostResponse.bind(this))
  }
}
