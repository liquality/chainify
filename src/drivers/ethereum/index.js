import methods from './methods'

export default {
  methods,
  formatter: {
    objMethod (method) {
      if (method.startsWith('eth_')) {
        return method.substring('eth_'.length)
      }

      return method
    },
    request (method, params, suffix) {
      return {
        method,
        params,
        suffix
      }
    }
  }
}
