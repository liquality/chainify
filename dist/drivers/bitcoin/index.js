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
    objMethod: function objMethod(method) {
      return method;
    },
    request: function request(method, params, suffix) {
      return {
        method: method.toLowerCase(),
        params: params,
        suffix: suffix
      };
    }
  }
};
exports.default = _default;