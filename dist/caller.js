"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Caller =
/*#__PURE__*/
function () {
  function Caller() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        driver = _ref.driver;

    _classCallCheck(this, Caller);

    this.driver = driver;
  }

  _createClass(Caller, [{
    key: "run",
    value: function run(_ref2) {
      var method = _ref2.method,
          _ref2$params = _ref2.params,
          params = _ref2$params === void 0 ? [] : _ref2$params,
          _this = _ref2._this;
      return this.driver.methods[method].function.run(_this, params);
    }
  }]);

  return Caller;
}();

exports.default = Caller;