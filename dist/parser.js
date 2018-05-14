"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonBigint = _interopRequireDefault(require("json-bigint"));

var _rpcError = _interopRequireDefault(require("./errors/rpc-error"));

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * JSONBigInt parser.
 */
var _JSONBigInt = (0, _jsonBigint.default)({
  storeAsString: true,
  strict: true
}),
    parse = _JSONBigInt.parse; // eslint-disable-line new-cap

/**
 * Get RPC response body result.
 */

/**
 * Export Parser class.
 */


var Parser =
/*#__PURE__*/
function () {
  function Parser() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        driver = _ref.driver,
        headers = _ref.headers;

    _classCallCheck(this, Parser);

    this.driver = driver;
    this.headers = headers;
  }
  /**
   * Parse rpc response.
   */


  _createClass(Parser, [{
    key: "rpc",
    value: function rpc(request, _ref2) {
      var _this = this;

      var _ref3 = _slicedToArray(_ref2, 2),
          response = _ref3[0],
          body = _ref3[1];

      // The RPC api returns a `text/html; charset=ISO-8859-1` encoded response with an empty string as the body
      // when an error occurs.
      if (typeof body === 'string' && response.headers['content-type'] !== 'application/json' && response.statusCode !== 200) {
        throw new _rpcError.default(response.statusCode, response.statusMessage, {
          body: body
        });
      } // Parsing the body with custom parser to support BigNumbers.


      body = parse(body);

      if (!Array.isArray(body)) {
        return this.getRpcResult(request, body, {
          headers: this.headers,
          response: response
        });
      } // Batch response parsing where each response may or may not be successful.


      var batch = body.map(function (_body) {
        try {
          return _this.getRpcResult(request, _body, {
            headers: false,
            response: response
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
  }, {
    key: "getRpcResult",
    value: function getRpcResult(request, body) {
      var _this2 = this;

      var _ref4 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          _ref4$headers = _ref4.headers,
          headers = _ref4$headers === void 0 ? false : _ref4$headers,
          response = _ref4.response;

      if (body.error) {
        throw new _rpcError.default(_lodash.default.get(body, 'error.code', -32603), _lodash.default.get(body, 'error.message', 'An error occurred while processing the RPC call'));
      } // Defensive measure. This should not happen on a RPC call.


      if (!_lodash.default.has(body, 'result')) {
        throw new _rpcError.default(-32700, 'Missing `result` on the RPC call result');
      }

      var _method;

      _lodash.default.forEach(this.driver.methods, function (value, key) {
        var _m = _this2.driver.formatter.request(key).method;

        if (_m === request.method) {
          _method = key;
        }
      });

      var formatter = this.driver.methods[_method].formatter || {};

      formatter.output = formatter.output || function (x) {
        return x;
      };

      body.result = formatter.output(body.result);

      if (headers) {
        return [body.result, response.headers];
      }

      return body.result;
    }
  }]);

  return Parser;
}();

exports.default = Parser;