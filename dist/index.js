"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bluebird = _interopRequireDefault(require("bluebird"));

var _lodash = _interopRequireDefault(require("lodash"));

var _semver = _interopRequireDefault(require("semver"));

var _debugnyan = _interopRequireDefault(require("debugnyan"));

require("regenerator-runtime/runtime");

var _parser = _interopRequireDefault(require("./parser"));

var _requester = _interopRequireDefault(require("./requester"));

var _drivers = _interopRequireDefault(require("./drivers"));

var _request = _interopRequireDefault(require("./request"));

var _dsnParser = _interopRequireDefault(require("./dsnParser"));

var _caller = _interopRequireDefault(require("./caller"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Constructor.
 */
var Client =
/*#__PURE__*/
function () {
  function Client(uri) {
    var _this = this;

    _classCallCheck(this, Client);

    var _DNSParser = (0, _dsnParser.default)(uri),
        baseUrl = _DNSParser.baseUrl,
        loggerName = _DNSParser.loggerName,
        driverName = _DNSParser.driverName,
        timeout = _DNSParser.timeout,
        returnHeaders = _DNSParser.returnHeaders,
        strictSSL = _DNSParser.strictSSL,
        auth = _DNSParser.auth,
        version = _DNSParser.version;

    var driver = _drivers.default[driverName];
    if (!driver) throw new Error("".concat(driverName, " is not supported, yet."));
    this.driver = driver;
    this.baseUrl = baseUrl;
    this.timeout = timeout;
    this.returnHeaders = returnHeaders;
    this.strictSSL = strictSSL;
    this.auth = auth;
    this.hasNamedParametersSupport = false; // Find unsupported methods according to version.

    var unsupported = [];

    if (version) {
      // Capture X.Y.Z when X.Y.Z.A is passed to support oddly formatted Bitcoin Core
      // versions such as 0.15.0.1.
      var result = /[0-9]+\.[0-9]+\.[0-9]+/.exec(version);

      if (!result) {
        throw new Error("Invalid Version \"".concat(version, "\""), {
          version: version
        });
      }

      var _result = _slicedToArray(result, 1),
          v = _result[0];

      if (this.driver === 'bitcoin') {
        this.hasNamedParametersSupport = _semver.default.satisfies(v, '>=0.14.0');
      }

      unsupported = _lodash.default.chain(driver.methods).pickBy(function (method) {
        return !_semver.default.satisfies(v, method.version);
      }).keys().value();
    }

    var req = (0, _request.default)(driver, (0, _debugnyan.default)(loggerName));
    this.request = _bluebird.default.promisifyAll(req.defaults({
      baseUrl: this.baseUrl,
      strictSSL: this.strictSSL,
      timeout: this.timeout
    }), {
      multiArgs: true
    });
    this.requester = new _requester.default({
      driver: driver,
      unsupported: unsupported,
      version: version
    });
    this.parser = new _parser.default({
      driver: driver,
      headers: this.returnHeaders
    });
    this.caller = new _caller.default({
      driver: driver
    });
    /**
     * Add all known RPC methods.
     */

    _lodash.default.forOwn(driver.methods, function (range, method) {
      var objMethod = driver.formatter.objMethod(method);
      _this[objMethod] = _lodash.default.partial(_this.command, method);
    });
  }
  /**
   * Execute `rpc` command.
   */


  _createClass(Client, [{
    key: "command",
    value: function command() {
      var _this2 = this;

      var body;
      var callback;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var params = _lodash.default.tail(args);

      var method = _lodash.default.head(args);

      var lastArg = _lodash.default.last(args);

      if (_lodash.default.isFunction(lastArg)) {
        callback = lastArg;
        params = _lodash.default.dropRight(params);
      }

      if (this.hasNamedParametersSupport && params.length === 1 && _lodash.default.isPlainObject(params[0])) {
        params = params[0];
      }

      if (this.driver.methods[method].custom) {
        return this.caller.run({
          method: method,
          params: params,
          _this: this
        });
      } else {
        return _bluebird.default.try(function () {
          if (Array.isArray(method)) {
            body = method.map(function (method, index) {
              return _this2.requester.prepare({
                method: method.method,
                params: method.params,
                suffix: index
              });
            });
          } else {
            body = _this2.requester.prepare({
              method: method,
              params: params
            });
          }

          return _this2.request.postAsync({
            auth: _lodash.default.pickBy(_this2.auth, _lodash.default.identity),
            body: JSON.stringify(body),
            uri: '/'
          }).bind(_this2).then(function () {
            var _this2$parser;

            for (var _len2 = arguments.length, data = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              data[_key2] = arguments[_key2];
            }

            return (_this2$parser = _this2.parser).rpc.apply(_this2$parser, [body].concat(data));
          });
        }).asCallback(callback);
      }
    }
  }]);

  return Client;
}();
/**
 * Export Client class (ESM).
 */


var _default = Client;
/**
 * Export Client class (CJS) for compatibility with require.
 */

exports.default = _default;
module.exports = Client;