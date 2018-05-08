"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonBigint = _interopRequireDefault(require("json-bigint"));

var _rpcError = _interopRequireDefault(require("./errors/rpc-error"));

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Module dependencies.
 */

/**
 * JSONBigInt parser.
 */
const {
  parse
} = (0, _jsonBigint.default)({
  storeAsString: true,
  strict: true
}); // eslint-disable-line new-cap

/**
 * Get RPC response body result.
 */

/**
 * Export Parser class.
 */

class Parser {
  constructor({
    driver,
    headers
  } = {}) {
    this.driver = driver;
    this.headers = headers;
  }
  /**
   * Parse rpc response.
   */


  rpc(request, [response, body]) {
    // The RPC api returns a `text/html; charset=ISO-8859-1` encoded response with an empty string as the body
    // when an error occurs.
    if (typeof body === 'string' && response.headers['content-type'] !== 'application/json' && response.statusCode !== 200) {
      throw new _rpcError.default(response.statusCode, response.statusMessage, {
        body
      });
    } // Parsing the body with custom parser to support BigNumbers.


    body = parse(body);

    if (!Array.isArray(body)) {
      return this.getRpcResult(request, body, {
        headers: this.headers,
        response
      });
    } // Batch response parsing where each response may or may not be successful.


    const batch = body.map(_body => {
      try {
        return this.getRpcResult(request, _body, {
          headers: false,
          response
        });
      } catch (e) {
        return e;
      }
    });

    if (this.headers) {
      return [batch, response.headers];
    }

    return batch;
  }

  getRpcResult(request, body, {
    headers = false,
    response
  } = {}) {
    if (body.error) {
      throw new _rpcError.default(_lodash.default.get(body, 'error.code', -32603), _lodash.default.get(body, 'error.message', 'An error occurred while processing the RPC call'));
    } // Defensive measure. This should not happen on a RPC call.


    if (!_lodash.default.has(body, 'result')) {
      throw new _rpcError.default(-32700, 'Missing `result` on the RPC call result');
    }

    let _method;

    _lodash.default.forEach(this.driver.methods, (value, key) => {
      const _m = this.driver.formatter.request(key).method;

      if (_m === request.method) {
        _method = key;
      }
    });

    const formatter = this.driver.methods[_method].formatter || {};

    formatter.output = formatter.output || function (x) {
      return x;
    };

    body.result = formatter.output(body.result);

    if (headers) {
      return [body.result, response.headers];
    }

    return body.result;
  }

}

exports.default = Parser;