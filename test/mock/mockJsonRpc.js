const _ = require('lodash')
const nock = require('nock')

module.exports = (endpoint, mockDataObject, times = 1) => {
  return nock(endpoint)
    .post('/', body => !!mockDataObject[body.method])
    .times(times)
    .reply(200, (uri, requestBody) => {
      const { method, params } = requestBody
      const mockData = mockDataObject[method].find(req => _.isEqual(req.params, params))
      const result = mockData ? mockData.result : undefined
      return { result }
    })
}
