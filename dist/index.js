"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bluebird = _interopRequireDefault(require("bluebird"));

var _lodash = _interopRequireDefault(require("lodash"));

var _semver = _interopRequireDefault(require("semver"));

var _debugnyan = _interopRequireDefault(require("debugnyan"));

var _parser = _interopRequireDefault(require("./parser"));

var _requester = _interopRequireDefault(require("./requester"));

var _drivers = _interopRequireDefault(require("./drivers"));

var _request = _interopRequireDefault(require("./request"));

var _dsnParser = _interopRequireDefault(require("./dsnParser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Module dependencies.
 */

/**
 * Constructor.
 */
class Client {
  constructor(uri) {
    const {
      baseUrl,
      loggerName,
      driverName,
      timeout,
      returnHeaders,
      strictSSL,
      auth,
      version
    } = (0, _dsnParser.default)(uri);
    const driver = _drivers.default[driverName];
    if (!driver) throw new Error(`${driverName} is not supported, yet.`);
    this.driver = driver;
    this.baseUrl = baseUrl;
    this.timeout = timeout;
    this.returnHeaders = returnHeaders;
    this.strictSSL = strictSSL;
    this.auth = auth;
    this.hasNamedParametersSupport = false; // Find unsupported methods according to version.

    let unsupported = [];

    if (version) {
      // Capture X.Y.Z when X.Y.Z.A is passed to support oddly formatted Bitcoin Core
      // versions such as 0.15.0.1.
      const result = /[0-9]+\.[0-9]+\.[0-9]+/.exec(version);

      if (!result) {
        throw new Error(`Invalid Version "${version}"`, {
          version
        });
      }

      const [v] = result;

      if (this.driver === 'bitcoin') {
        this.hasNamedParametersSupport = _semver.default.satisfies(v, '>=0.14.0');
      }

      unsupported = _lodash.default.chain(driver.methods).pickBy(method => !_semver.default.satisfies(v, method.version)).keys().value();
    }

    const req = (0, _request.default)(driver, (0, _debugnyan.default)(loggerName));
    this.request = _bluebird.default.promisifyAll(req.defaults({
      baseUrl: this.baseUrl,
      strictSSL: this.strictSSL,
      timeout: this.timeout
    }), {
      multiArgs: true
    });
    this.requester = new _requester.default({
      driver,
      unsupported,
      version
    });
    this.parser = new _parser.default({
      driver,
      headers: this.returnHeaders
    });
    /**
     * Add all known RPC methods.
     */

    _lodash.default.forOwn(driver.methods, (range, method) => {
      const objMethod = driver.formatter.objMethod(method);
      this[objMethod] = _lodash.default.partial(this.command, method);
    });
  }
  /**
   * Execute `rpc` command.
   */


  command(...args) {
    let body;
    let callback;

    let params = _lodash.default.tail(args);

    const method = _lodash.default.head(args);

    const lastArg = _lodash.default.last(args);

    if (_lodash.default.isFunction(lastArg)) {
      callback = lastArg;
      params = _lodash.default.dropRight(params);
    }

    if (this.hasNamedParametersSupport && params.length === 1 && _lodash.default.isPlainObject(params[0])) {
      params = params[0];
    }

    return _bluebird.default.try(() => {
      if (Array.isArray(method)) {
        body = method.map((method, index) => this.requester.prepare({
          method: method.method,
          params: method.params,
          suffix: index
        }));
      } else {
        body = this.requester.prepare({
          method: method,
          params
        });
      }

      return this.request.postAsync({
        auth: _lodash.default.pickBy(this.auth, _lodash.default.identity),
        body: JSON.stringify(body),
        uri: '/'
      }).bind(this).then((...data) => this.parser.rpc(body, ...data));
    }).asCallback(callback);
  }

}
/**
 * Export Client class (ESM).
 */


var _default = Client;
/**
 * Export Client class (CJS) for compatibility with require.
 */

exports.default = _default;
module.exports = Client;