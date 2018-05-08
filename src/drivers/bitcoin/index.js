import methods from './methods'

export default {
  methods,
  formatter: {
    objMethod (method) {
      return method
    },
    request (method, params, suffix) {
      return {
        method: method.toLowerCase(),
        params,
        suffix
      }
    }
  }
}
