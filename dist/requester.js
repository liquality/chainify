"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Export Requester class.
 */
var Requester =
/*#__PURE__*/
function () {
  function Requester() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        driver = _ref.driver,
        _ref$unsupported = _ref.unsupported,
        unsupported = _ref$unsupported === void 0 ? [] : _ref$unsupported,
        version = _ref.version;

    _classCallCheck(this, Requester);

    this.driver = driver;
    this.unsupported = unsupported;
    this.version = version;
  }
  /**
  * Prepare rpc request.
  */


  _createClass(Requester, [{
    key: "prepare",
    value: function prepare(_ref2) {
      var method = _ref2.method,
          _ref2$params = _ref2.params,
          params = _ref2$params === void 0 ? [] : _ref2$params,
          suffix = _ref2.suffix;

      if (this.version && (0, _lodash.includes)(this.unsupported, method)) {
        throw new Error("Method \"".concat(method, "\" is not supported by version \"").concat(this.version, "\""));
      }

      var formatted = this.driver.formatter.request(method, params, suffix);
      return {
        id: "".concat(Date.now()).concat(formatted.suffix !== undefined ? "-".concat(formatted.suffix) : ''),
        method: formatted.method,
        params: formatted.params
      };
    }
  }]);

  return Requester;
}();

exports.default = Requester;