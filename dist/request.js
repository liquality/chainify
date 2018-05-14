"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _requestObfuscator = _interopRequireDefault(require("./logging/request-obfuscator"));

var _request = _interopRequireDefault(require("request"));

var _requestLogger = _interopRequireDefault(require("@uphold/request-logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Module dependencies.
 */

/**
 * Exports.
 */
var _default = function _default(driver, logger) {
  var obfuscator = new _requestObfuscator.default(driver);
  return (0, _requestLogger.default)(_request.default, function (request, instance) {
    obfuscator.obfuscate(request, instance);

    if (request.type === 'response') {
      return logger.debug({
        request: request
      }, "Received response for request ".concat(request.id));
    }

    return logger.debug({
      request: request
    }, "Making request ".concat(request.id, " to ").concat(request.method, " ").concat(request.uri));
  });
};

exports.default = _default;