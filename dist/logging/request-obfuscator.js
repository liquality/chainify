"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Obfuscator =
/*#__PURE__*/
function () {
  function Obfuscator(driver) {
    _classCallCheck(this, Obfuscator);

    this.methods = driver.methods;
  }

  _createClass(Obfuscator, [{
    key: "obfuscate",
    value: function obfuscate(request, instance) {
      this.obfuscateHeaders(request);
      this.obfuscateRequest(request);
      this.obfuscateResponse(request, instance);
    }
  }, {
    key: "obfuscateHeaders",
    value: function obfuscateHeaders(request) {
      if (request.type !== 'request') {
        return;
      }

      if (!(0, _lodash.has)(request, 'headers.authorization')) {
        return;
      }

      request.headers.authorization = request.headers.authorization.replace(/(Basic )(.*)/, "$1******");
    }
  }, {
    key: "obfuscateRequest",
    value: function obfuscateRequest(request) {
      if (request.type !== 'request') {
        return;
      }

      if (!(0, _lodash.isString)(request.body)) {
        return;
      }

      request.body = JSON.parse(request.body);

      if ((0, _lodash.isArray)(request.body)) {
        request.body = (0, _lodash.map)(request.body, this.obfuscateRequestBody);
      } else {
        request.body = this.obfuscateRequestBody(request.body);
      }

      request.body = JSON.stringify(request.body);
    }
  }, {
    key: "obfuscateResponse",
    value: function obfuscateResponse(request, instance) {
      var _this = this;

      if (request.type !== 'response') {
        return;
      }

      if (!(0, _lodash.get)(request, 'response.body')) {
        return;
      }

      if ((0, _lodash.get)(request, "response.headers['content-type']") === 'application/octet-stream') {
        request.response.body = '******';
        return;
      }

      if (!instance.body) {
        return;
      }

      var requestBody = JSON.parse(instance.body);

      if ((0, _lodash.isArray)(request.response.body)) {
        var methodsById = (0, _lodash.mapKeys)(requestBody, function (method) {
          return method.id;
        });
        request.response.body = (0, _lodash.map)(request.response.body, function (request) {
          return _this.obfuscateResponseBody(request, methodsById[request.id].method);
        });
        return;
      }

      request.response.body = this.obfuscateResponseBody(request.response.body, requestBody.method);
    }
  }, {
    key: "obfuscateResponseBody",
    value: function obfuscateResponseBody(body, method) {
      var fn = (0, _lodash.get)(this.methods[method], 'obfuscate.response');

      if (!fn || (0, _lodash.isEmpty)(body.result)) {
        return body;
      }

      return (0, _lodash.defaults)({
        result: fn(body.result)
      }, body);
    }
  }, {
    key: "obfuscateRequestBody",
    value: function obfuscateRequestBody(body) {
      var method = (0, _lodash.get)(this.methods[body.method], 'obfuscate.request');

      if (!method) {
        return body;
      }

      if ((0, _lodash.isPlainObject)(body.params)) {
        return (0, _lodash.assign)(body, {
          params: method.named(body.params)
        });
      }

      return (0, _lodash.assign)(body, {
        params: method.default(body.params)
      });
    }
  }]);

  return Obfuscator;
}();

exports.default = Obfuscator;