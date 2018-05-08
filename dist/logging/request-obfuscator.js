"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

/**
 * Module dependencies.
 */
class Obfuscator {
  constructor(driver) {
    this.methods = driver.methods;
  }

  obfuscate(request, instance) {
    this.obfuscateHeaders(request);
    this.obfuscateRequest(request);
    this.obfuscateResponse(request, instance);
  }

  obfuscateHeaders(request) {
    if (request.type !== 'request') {
      return;
    }

    if (!(0, _lodash.has)(request, 'headers.authorization')) {
      return;
    }

    request.headers.authorization = request.headers.authorization.replace(/(Basic )(.*)/, `$1******`);
  }

  obfuscateRequest(request) {
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

  obfuscateResponse(request, instance) {
    if (request.type !== 'response') {
      return;
    }

    if (!(0, _lodash.get)(request, 'response.body')) {
      return;
    }

    if ((0, _lodash.get)(request, `response.headers['content-type']`) === 'application/octet-stream') {
      request.response.body = '******';
      return;
    }

    if (!instance.body) {
      return;
    }

    const requestBody = JSON.parse(instance.body);

    if ((0, _lodash.isArray)(request.response.body)) {
      const methodsById = (0, _lodash.mapKeys)(requestBody, method => method.id);
      request.response.body = (0, _lodash.map)(request.response.body, request => this.obfuscateResponseBody(request, methodsById[request.id].method));
      return;
    }

    request.response.body = this.obfuscateResponseBody(request.response.body, requestBody.method);
  }

  obfuscateResponseBody(body, method) {
    const fn = (0, _lodash.get)(this.methods[method], 'obfuscate.response');

    if (!fn || (0, _lodash.isEmpty)(body.result)) {
      return body;
    }

    return (0, _lodash.defaults)({
      result: fn(body.result)
    }, body);
  }

  obfuscateRequestBody(body) {
    const method = (0, _lodash.get)(this.methods[body.method], 'obfuscate.request');

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

}

exports.default = Obfuscator;