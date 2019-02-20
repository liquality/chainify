const _ = require('lodash')
const nock = require('nock')

module.exports = (endpoint, mockDataObject, times = 1) => {
  return nock(endpoint)
    .post('/', body => !!mockDataObject[body.method])
    .times(times)
    .reply(200, (uri, requestBody) => {
      const { method, params } = JSON.parse(requestBody)
      const { result } = mockDataObject[method].find(req => _.isEqual(req.params, params))
      return { result }
    })
}
