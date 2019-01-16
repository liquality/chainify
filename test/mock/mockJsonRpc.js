const nock = require('nock')

module.exports = (endpoint, mockDataObject, times = 1) => {
  return nock('http://localhost:8545')
    .post('/', body => !!mockDataObject[body.method])
    .times(times)
    .reply(200, (uri, requestBody) => {
      const body = JSON.parse(requestBody)
      return { result: mockDataObject[body.method] }
    })
}
