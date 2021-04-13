import _ from 'lodash'
import nock from 'nock'

export default (endpoint: string, mockDataObject: any, times = 1) => {
  return nock(endpoint)
    .post('/', (body) => !!mockDataObject[body.method])
    .times(times)
    .reply(200, (uri, requestBody) => {
      const { method, params } = requestBody as any
      const mockData = mockDataObject[method].find((req: any) => _.isEqual(req.params, params))
      const result = mockData ? mockData.result : undefined
      return { result }
    })
}
