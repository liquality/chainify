import DNSParser from 'dsn-parser';
import BaseError from 'standard-error';
import JSONBigInt from 'json-bigint';
import _, { get, has, includes } from 'lodash';
import semver from 'semver';
import Promise from 'bluebird';

/**
 * Secure driver connection postfix and checker
 * Ref - https://tools.ietf.org/html/rfc3986#section-3.1
 */

var SECURE_DRIVER_POSTFIX = '+s';

var shouldUseHTTPS = function shouldUseHTTPS(driver) {
  return driver.endsWith(SECURE_DRIVER_POSTFIX);
};
var getSecureDriverName = function getSecureDriverName(driver) {
  return driver.substring(0, driver.length - SECURE_DRIVER_POSTFIX.length);
};

var DNSParser$1 = (function (uri) {
  var dsn = new DNSParser(uri);

  var _dsn$getParts = dsn.getParts(),
      driver = _dsn$getParts.driver,
      user = _dsn$getParts.user,
      password = _dsn$getParts.password,
      host = _dsn$getParts.host,
      port = _dsn$getParts.port,
      params = _dsn$getParts.params;

  var timeout = params.timeout,
      returnHeaders = params.returnHeaders,
      strictSSL = params.strictSSL,
      loggerName = params.loggerName,
      version = params.version;


  var defaultProtocol = 'http';
  var defaultPort = 80;
  var driverName = driver;

  timeout = timeout ? Number(timeout) : undefined;
  returnHeaders = returnHeaders === 'true';
  strictSSL = strictSSL === 'true';
  loggerName = loggerName || driver;

  if (shouldUseHTTPS(driver)) {
    defaultProtocol = 'https';
    defaultPort = 443;
    driverName = getSecureDriverName(driver);
  }

  var baseUrl = defaultProtocol + '://' + host + ':' + (port || defaultPort);
  var auth = (password || user) && { pass: password, user: user };

  return {
    baseUrl: baseUrl,
    loggerName: loggerName,
    driverName: driverName,
    timeout: timeout,
    returnHeaders: returnHeaders,
    strictSSL: strictSSL,
    auth: auth,
    version: version
  };
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Export `StandardError` class.
 */

var StandardError = function (_BaseError) {
  _inherits(StandardError, _BaseError);

  function StandardError() {
    _classCallCheck(this, StandardError);

    return _possibleConstructorReturn(this, (StandardError.__proto__ || Object.getPrototypeOf(StandardError)).apply(this, arguments));
  }

  return StandardError;
}(BaseError);

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$1(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$1(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Export `RpcError` class.
 */

var RpcError = function (_StandardError) {
  _inherits$1(RpcError, _StandardError);

  function RpcError(code, msg) {
    var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck$1(this, RpcError);

    if (typeof code !== 'number') {
      throw new TypeError('Non-numeric HTTP code');
    }

    if ((typeof msg === 'undefined' ? 'undefined' : _typeof(msg)) === 'object' && msg !== null) {
      props = msg;
      msg = null;
    }

    props.code = code;

    return _possibleConstructorReturn$1(this, (RpcError.__proto__ || Object.getPrototypeOf(RpcError)).call(this, msg || code, props));
  }

  _createClass(RpcError, [{
    key: 'toString',
    value: function toString() {
      return this.name + ': ' + this.code + ' ' + this.message;
    }
  }, {
    key: 'status',
    get: function get$$1() {
      return this.code;
    },
    set: function set(value) {
      Object.defineProperty(this, 'status', {
        configurable: true,
        enumerable: true,
        value: value,
        writable: true
      });
    }
  }]);

  return RpcError;
}(StandardError);

var _createClass$1 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _JSONBigInt = JSONBigInt({ storeAsString: true, strict: true }),
    parse = _JSONBigInt.parse; // eslint-disable-line new-cap

var JsonRpcHelper = function () {
  function JsonRpcHelper() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$unsupported = _ref.unsupported,
        unsupported = _ref$unsupported === undefined ? [] : _ref$unsupported,
        version = _ref.version;

    _classCallCheck$2(this, JsonRpcHelper);

    this.unsupported = unsupported;
    this.version = version;
  }

  _createClass$1(JsonRpcHelper, [{
    key: 'prepareRequest',
    value: function prepareRequest(_ref2) {
      var method = _ref2.method,
          _ref2$params = _ref2.params,
          params = _ref2$params === undefined ? [] : _ref2$params,
          suffix = _ref2.suffix;

      if (this.version && includes(this.unsupported, method)) {
        throw new Error('Method "' + method + '" is not supported by version "' + this.version + '"');
      }

      return JSON.stringify({
        id: '' + Date.now() + (suffix !== undefined ? '-' + suffix : ''),
        method: method,
        params: params
      });
    }
  }, {
    key: 'parseResponse',
    value: function parseResponse(response) {
      // console.log(response)
      // The RPC api returns a `text/html; charset=ISO-8859-1` encoded response with an empty string as the body
      // when an error occurs.
      if (typeof response.body === 'string' && response.headers['content-type'] !== 'application/json' && response.statusCode !== 200) {
        throw new RpcError(response.statusCode, response.statusMessage, { body: response.body });
      }

      // Parsing the body with custom parser to support BigNumbers.
      response.body = parse(response.body);

      return this.getRpcResult(response);
    }
  }, {
    key: 'getRpcResult',
    value: function getRpcResult(_ref3) {
      var body = _ref3.body;

      if (body.error) {
        throw new RpcError(get(body, 'error.code', -32603), get(body, 'error.message', 'An error occurred while processing the RPC call'));
      }

      // Defensive measure. This should not happen on a RPC call.
      if (!has(body, 'result')) {
        throw new RpcError(-32700, 'Missing `result` on the RPC call result');
      }

      return body.result;
    }
  }]);

  return JsonRpcHelper;
}();

var _createClass$2 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$3(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * BitcoinProvider class
 * with bitcoin related transforms
 */

var BitcoinProvider = function () {
  function BitcoinProvider() {
    _classCallCheck$3(this, BitcoinProvider);
  }

  _createClass$2(BitcoinProvider, [{
    key: 'setClient',
    value: function setClient(client) {
      this.client = client;
    }
  }, {
    key: 'transforms',
    value: function transforms() {
      return {
        methodToRpc: function methodToRpc(method, params) {
          return method.toLowerCase();
        },
        value: function value(val, unit) {
          // convert hex to satoshi/mBTC/BTC
          return val;
        }
      };
    }
  }]);

  return BitcoinProvider;
}();


BitcoinProvider.Types = {
  Block: {
    number: 'height',
    hash: 'hash',
    timestamp: 'time',
    difficulty: 'difficulty',
    size: 'size',
    parentHash: 'parentHash',
    nonce: 'nonce',
    exampleComputedValue: function exampleComputedValue(key, result) {
      return result.tx.reduce(function (value, tx) {
        return value + tx.amount;
      }, 0);
    }
  }
};

var _createClass$3 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$4(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$2(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$2(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BlockProvider = function (_BitcoinProvider) {
  _inherits$2(BlockProvider, _BitcoinProvider);

  function BlockProvider() {
    _classCallCheck$4(this, BlockProvider);

    return _possibleConstructorReturn$2(this, (BlockProvider.__proto__ || Object.getPrototypeOf(BlockProvider)).apply(this, arguments));
  }

  _createClass$3(BlockProvider, [{
    key: 'methods',
    value: function methods() {
      var client = this.client;


      return {
        getCustomMethod: {
          version: '>=0.0.0',
          rpc: function rpc() {
            return client.getBlock.apply(client, arguments); // or Promise.resolve('Custom Response')
          }
        },

        getCustomBlockX: {
          version: '>=0.0.0',
          rpc: 'getblock' // custom object method mapped to rpc method
        },

        getBlock: {
          version: '>=0.6.0',
          transform: {
            confirmations: function confirmations(_confirmations) {
              // transform
              if (_confirmations > 100) return 'Enough';else return 'Wait';
            },
            tx: [function transform(value) {
              return 'Tx<' + value + '>';
            }]
          },
          type: BitcoinProvider.Types.Block
        },

        getBlockByNumber: {
          version: '>=0.6.0',
          rpc: 'getblockhash|getblock', // pipe rpc methods
          transform: {
            confirmations: function confirmations(_confirmations2) {
              // transform
              if (_confirmations2 > 100) return 'Enough';else return 'Wait';
            },
            tx: [{
              rpc: 'gettransaction' // populate all tx
            }]
          },
          type: BitcoinProvider.Types.Block
        },

        getBlockByHash: {
          version: '>=0.6.0',
          alias: 'getBlock', // alias object methods
          type: BitcoinProvider.Types.Block
        },

        getBlockHeight: {
          version: '>=0.1.0',
          rpc: 'getblockcount' // custom object method mapped to rpc method
        },

        getBlockHash: {
          version: '>=0.6.0'
        },

        getBlockHeader: {
          version: '>=0.12.0'
        }
      };
    }
  }]);

  return BlockProvider;
}(BitcoinProvider);

var bitcoin = [new BlockProvider()];

var providers = {
  bitcoin: bitcoin
};

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass$4 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$5(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// DEV: hack
var request = require('request-promise');

var Client = function () {
  function Client(uri) {
    var _this = this;

    _classCallCheck$5(this, Client);

    var _DNSParser = DNSParser$1(uri),
        baseUrl = _DNSParser.baseUrl,
        driverName = _DNSParser.driverName,
        timeout = _DNSParser.timeout,
        returnHeaders = _DNSParser.returnHeaders,
        strictSSL = _DNSParser.strictSSL,
        auth = _DNSParser.auth,
        version = _DNSParser.version;

    this.transforms = {
      methodToRpc: function methodToRpc(method) {
        return method.toLowerCase();
      },
      value: function value(val, unit) {
        return val;
      }
    };

    this.methods = {};

    // unused. remove later
    this.rpcMethods = {};

    this.chainName = driverName;
    this.baseUrl = baseUrl;
    this.timeout = timeout;
    this.returnHeaders = returnHeaders;
    this.strictSSL = strictSSL;
    this.auth = auth;
    this.version = version;

    this.jsonRpcHelper = new JsonRpcHelper({ version: version });
    this.request = request.defaults({
      baseUrl: this.baseUrl,
      strictSSL: this.strictSSL,
      timeout: this.timeout,
      resolveWithFullResponse: true
    });

    // load default providers
    if (providers[driverName]) {
      providers[driverName].forEach(function (provider) {
        return _this.addProvider(provider);
      });
    }
  }

  _createClass$4(Client, [{
    key: 'addProvider',
    value: function addProvider(provider) {
      var _this2 = this;

      provider.setClient(this);

      _.forOwn(provider.transforms(), function (fn, transform) {
        _this2.transforms[transform] = fn;
      });

      var methods = provider.methods();

      if (this.version) {
        var result = /[0-9]+\.[0-9]+\.[0-9]+/.exec(this.version);

        if (!result) {
          throw new Error('Invalid version "' + this.version + '"', { version: this.version });
        }

        var _result = _slicedToArray(result, 1),
            version = _result[0];

        this.unsupportedMethods = _.chain(methods).pickBy(function (method) {
          return !semver.satisfies(version, method.version);
        }).keys().value();
      }

      _.forOwn(provider.methods(), function (obj, method) {
        _this2.methods[method] = obj;

        if (obj.rpc) {
          if (_.isFunction(obj.rpc)) {
            _this2[method] = _.partial(obj.rpc);
          } else {
            _this2[method] = _.partial(_this2.rpcWrapper, method, obj.rpc);
          }
        } else {
          var rpcMethod = _this2.getRpcMethod(method, obj);

          if (!_this2.rpcMethods[rpcMethod]) _this2.rpcMethods[rpcMethod] = obj;
          _this2[method] = _.partial(_this2.rpcWrapper, method, rpcMethod);
        }
      });
    }
  }, {
    key: 'getRpcMethod',
    value: function getRpcMethod(method, obj) {
      if (obj.alias) {
        return this.getRpcMethod(obj.alias, this.methods[obj.alias]);
      } else {
        return this.transforms.methodToRpc(method);
      }
    }
  }, {
    key: 'handleTransformation',
    value: function handleTransformation(transformation, result) {
      var _this3 = this;

      if (_.isFunction(transformation)) {
        return Promise.resolve(transformation(result));
      } else if (transformation.rpc) {
        return this.rpc(transformation.rpc, result);
      } else if (_.isArray(transformation)) {
        var _transformation = _slicedToArray(transformation, 1),
            obj = _transformation[0];

        return Promise.map(result, function (param) {
          return _this3.handleTransformation(obj, param);
        });
      } else {
        return Promise.reject(new Error('This type of mapping is not implemented yet.'));
      }
    }
  }, {
    key: 'rpcWrapper',
    value: function rpcWrapper(method, rpcMethod) {
      var _this4 = this;

      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      return this.rpc.apply(this, [rpcMethod].concat(args)).then(function (result) {
        var transform = _this4.methods[method].transform;


        if (transform) {
          return Promise.map(Object.keys(transform), function (field) {
            return _this4.handleTransformation(transform[field], result[field]).then(function (transformedField) {
              result[field] = transformedField;
            });
          }).then(function (__) {
            return result;
          });
        } else {
          return result;
        }
      }).then(function (result) {
        var type = _this4.methods[method].type;


        if (type) {
          Object.keys(type).forEach(function (key) {
            var t = type[key];

            if (typeof t === 'string') {
              result[key] = result[type[key]];
            } else if (_.isFunction(t)) {
              result[key] = t(key, result);
            } else {
              throw new Error('This type of mapping is not implemented yet.');
            }
          });
        }

        return result;
      });
    }
  }, {
    key: 'rpc',
    value: function rpc(_method) {
      var _this5 = this;

      var methods = _method.split('|');

      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      return Promise.reduce(methods, function (params, method) {
        if (!_.isArray(params)) params = [params];

        var requestBody = _this5.jsonRpcHelper.prepareRequest({ method: method, params: params });

        return _this5.request.post({
          auth: _.pickBy(_this5.auth, _.identity),
          body: requestBody,
          uri: '/'
        }).then(_this5.jsonRpcHelper.parseResponse.bind(_this5.jsonRpcHelper));
      }, args);
    }
  }]);

  return Client;
}();


Client.providers = providers;

export default Client;
