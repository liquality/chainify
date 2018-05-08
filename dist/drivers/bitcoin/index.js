"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _methods = _interopRequireDefault(require("./methods"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  methods: _methods.default,
  formatter: {
    objMethod(method) {
      return method;
    },

    request(method, params, suffix) {
      return {
        method: method.toLowerCase(),
        params,
        suffix
      };
    }

  }
};
exports.default = _default;