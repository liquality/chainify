"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _http = require("http");

var _standardError = _interopRequireDefault(require("./standard-error"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } _setPrototypeOf(subClass.prototype, superClass && superClass.prototype); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) { return o.__proto__; }; return _getPrototypeOf(o); }

/**
 * Export `RpcError` class.
 */
var RpcError =
/*#__PURE__*/
function (_StandardError) {
  function RpcError(code, msg) {
    var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, RpcError);

    if (typeof code !== 'number') {
      throw new TypeError("Non-numeric HTTP code");
    }

    if (_typeof(msg) === 'object' && msg !== null) {
      props = msg;
      msg = null;
    }

    props.code = code;
    return _possibleConstructorReturn(this, _getPrototypeOf(RpcError).call(this, msg || _http.STATUS_CODES[code], props));
  }

  _createClass(RpcError, [{
    key: "toString",
    value: function toString() {
      return "".concat(this.name, ": ").concat(this.code, " ").concat(this.message);
    }
  }, {
    key: "status",
    get: function get() {
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

  _inherits(RpcError, _StandardError);

  return RpcError;
}(_standardError.default);

exports.default = RpcError;