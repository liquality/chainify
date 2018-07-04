'use strict';

var regeneratorRuntime = require('regenerator-runtime');


function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var DNSParser = _interopDefault(require('dsn-parser'));
var BaseError = _interopDefault(require('standard-error'));
var JSONBigInt = _interopDefault(require('json-bigint'));
var _ = require('lodash');
var ___default = _interopDefault(_);
var semver = _interopDefault(require('semver'));
var Promise$1 = _interopDefault(require('bluebird'));

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() { return this })() || Function("return this")()
);

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

      if (this.version && _.includes(this.unsupported, method)) {
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
        throw new RpcError(_.get(body, 'error.code', -32603), _.get(body, 'error.message', 'An error occurred while processing the RPC call'));
      }

      // Defensive measure. This should not happen on a RPC call.
      if (!_.has(body, 'result')) {
        throw new RpcError(-32700, 'Missing `result` on the RPC call result');
      }

      return body.result;
    }
  }]);

  return JsonRpcHelper;
}();

var _createClass$2 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$3(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Provider = function () {
  function Provider() {
    _classCallCheck$3(this, Provider);
  }

  _createClass$2(Provider, [{
    key: 'methods',
    value: function methods() {
      return ['getBlockByNumber'
      // 'getBlockByHash',
      // 'getBlockHeight',
      // 'getBlockHash',
      // 'getAddress',
      // 'signMessage'
      ];
    }
  }]);

  return Provider;
}();

var _createClass$3 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$4(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * BitcoinProvider class
 * with bitcoin related transforms
 */

var BitcoinProvider = function () {
  function BitcoinProvider() {
    _classCallCheck$4(this, BitcoinProvider);
  }

  _createClass$3(BitcoinProvider, [{
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
    parentHash: 'previousblockhash',
    nonce: 'nonce',
    transactions: 'tx',
    exampleComputedValue: function exampleComputedValue(key, result) {
      return result.tx.reduce(function (value, tx) {
        return value + tx.amount;
      }, 0);
    }
  },
  Transaction: {
    confirmations: 'confirmations',
    hash: 'txid',
    value: 'amount',
    blockHash: 'blockHash',
    blockNumber: 'blockNumber'
  }
};

var _createClass$4 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$5(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$2(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$2(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BlockProvider = function (_BitcoinProvider) {
  _inherits$2(BlockProvider, _BitcoinProvider);

  function BlockProvider() {
    _classCallCheck$5(this, BlockProvider);

    return _possibleConstructorReturn$2(this, (BlockProvider.__proto__ || Object.getPrototypeOf(BlockProvider)).apply(this, arguments));
  }

  _createClass$4(BlockProvider, [{
    key: 'methods',
    value: function methods() {
      var client = this.client;


      return {
        getTransactionByHash: {
          version: '>=0.0.0',
          handle: function handle() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            return client.rpc.apply(client, ['gettransaction'].concat(args)).then(function (tx) {
              return client.rpc('decoderawtransaction', tx.hex).then(function (txd) {
                return Object.assign({}, tx, txd);
              });
            });
          },
          mapping: BitcoinProvider.Types.Transaction
        },

        getBlock: {
          version: '>=0.6.0',
          mapping: BitcoinProvider.Types.Block,
          type: 'Block'
        },

        getBlockByNumber: {
          version: '>=0.6.0',
          handle: function handle(number, includeTx) {
            return client.rpc('getblockhash', number).then(function (hash) {
              return client.rpc('getblock', hash);
            });
          },
          transform: function transform(number, includeTx) {
            if (includeTx) {
              return {
                tx: [{
                  handle: 'gettransaction' // populate all tx
                }]
              };
            } else {
              return {};
            }
          },
          mapping: BitcoinProvider.Types.Block,
          type: 'Block'
        },

        getBlockByHash: {
          version: '>=0.6.0',
          alias: 'getBlock', // alias object methods
          mapping: BitcoinProvider.Types.Block,
          type: 'Block'
        },

        getBlockHeight: {
          version: '>=0.1.0',
          handle: 'getblockcount' // custom object method mapped to rpc method
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

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass$5 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck$6(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$3(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$3(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Transport = require('@ledgerhq/hw-transport-node-hid').default;
var LedgerBtc = require('@ledgerhq/hw-app-btc').default;

var LedgerWalletProvider = function (_BitcoinProvider) {
  _inherits$3(LedgerWalletProvider, _BitcoinProvider);

  function LedgerWalletProvider() {
    _classCallCheck$6(this, LedgerWalletProvider);

    return _possibleConstructorReturn$3(this, (LedgerWalletProvider.__proto__ || Object.getPrototypeOf(LedgerWalletProvider)).apply(this, arguments));
  }

  _createClass$5(LedgerWalletProvider, [{
    key: 'methods',
    value: function methods() {
      var _this2 = this;

      var connectToLedger = function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
          var transport;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (ledgerBtc) {
                    _context.next = 5;
                    break;
                  }

                  _context.next = 3;
                  return Transport.create();

                case 3:
                  transport = _context.sent;

                  ledgerBtc = new LedgerBtc(transport);

                case 5:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        return function connectToLedger() {
          return _ref.apply(this, arguments);
        };
      }();

      var ledgerBtc = false;

      return {
        getAddress: {
          handle: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
              return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      _context2.next = 2;
                      return connectToLedger();

                    case 2:
                      return _context2.abrupt('return', ledgerBtc.getWalletPublicKey('44\'/0\'/0\'/0').bitcoinAddress);

                    case 3:
                    case 'end':
                      return _context2.stop();
                  }
                }
              }, _callee2, _this2);
            }));

            function handle() {
              return _ref2.apply(this, arguments);
            }

            return handle;
          }()
        },
        signMessage: {
          handle: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
              for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }

              var _args3, message;

              return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      _context3.next = 2;
                      return connectToLedger();

                    case 2:
                      _args3 = _slicedToArray(args, 1), message = _args3[0];
                      return _context3.abrupt('return', ledgerBtc.signMessageNew('44\'/0\'/0\'/0', Buffer.from(message).toString('hex')));

                    case 4:
                    case 'end':
                      return _context3.stop();
                  }
                }
              }, _callee3, _this2);
            }));

            function handle() {
              return _ref3.apply(this, arguments);
            }

            return handle;
          }()
        }
      };
    }
  }]);

  return LedgerWalletProvider;
}(BitcoinProvider);

var bitcoin = [new BlockProvider(), new LedgerWalletProvider()];

var _createClass$6 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$7(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * BitcoinProvider class
 * with bitcoin related transforms
 */

var BitcoinProvider$1 = function () {
  function BitcoinProvider() {
    _classCallCheck$7(this, BitcoinProvider);
  }

  _createClass$6(BitcoinProvider, [{
    key: 'setClient',
    value: function setClient(client) {
      this.client = client;
    }
  }, {
    key: 'transforms',
    value: function transforms() {
      return {
        methodToRpc: function methodToRpc(method, params) {
          return 'eth_' + method;
        },
        value: function value(val, unit) {
          // convert hex to wei/gwei/eth
          return val;
        }
      };
    }
  }]);

  return BitcoinProvider;
}();


BitcoinProvider$1.Types = {
  Block: {
    number: 'number',
    hash: 'hash',
    timestamp: 'time',
    difficulty: 'difficulty',
    size: 'size',
    parentHash: 'parentHash',
    nonce: 'nonce',
    transactions: 'transactions'
  },
  Transaction: {
    confirmations: function confirmations(key, result, client) {
      return client.rpc('eth_blockNumber').then(function (currentBlock) {
        return Number(currentBlock) - result[key];
      });
    },
    hash: 'hash',
    value: 'value',
    blockHash: 'blockHash',
    blockNumber: 'blockNumber'
  }
};

var _createClass$7 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$8(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$4(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$4(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BlockProvider$1 = function (_EthereumProvider) {
  _inherits$4(BlockProvider, _EthereumProvider);

  function BlockProvider() {
    _classCallCheck$8(this, BlockProvider);

    return _possibleConstructorReturn$4(this, (BlockProvider.__proto__ || Object.getPrototypeOf(BlockProvider)).apply(this, arguments));
  }

  _createClass$7(BlockProvider, [{
    key: 'methods',
    value: function methods() {
      var client = this.client;


      return {
        getBlockByNumber: {
          handle: function handle() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            return client.rpc.apply(client, ['eth_getBlockByNumber'].concat(args));
          },
          mapping: BitcoinProvider$1.Types.Block
        },
        getTransactionByHash: {
          mapping: BitcoinProvider$1.Types.Transaction
          // getBlockByHash: {
          //   version: '>=0.6.0',
          //   alias: 'getBlock', // alias object methods
          //   mapping: EthereumProvider.Types.Block,
          //   type: 'Block'
          // },
          //
          // getBlockHeight: {
          //   version: '>=0.1.0',
          //   handle: 'getblockcount' // custom object method mapped to rpc method
          // },
          //
          // getBlockHash: {
          //   version: '>=0.6.0'
          // },
          //
          // getBlockHeader: {
          //   version: '>=0.12.0'
          // }
        } };
    }
  }]);

  return BlockProvider;
}(BitcoinProvider$1);

var ethereum = [new BlockProvider$1()];

var providers = {
  bitcoin: bitcoin,
  ethereum: ethereum
};

var _slicedToArray$1 = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass$8 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator$1(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise$1(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise$1.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck$9(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// DEV: hack
var request = require('request-promise');

var Client = function () {
  function Client(uri) {
    var _this = this;

    _classCallCheck$9(this, Client);

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

    var provider = new Provider();
    provider.methods().forEach(function (method) {
      if (!___default.isFunction(_this[method])) {
        throw new Error('Implement ' + method + ' method');
      }
    });
  }

  _createClass$8(Client, [{
    key: 'addProvider',
    value: function addProvider(provider) {
      var _this2 = this;

      provider.setClient(this);

      ___default.forOwn(provider.transforms(), function (fn, transform) {
        _this2.transforms[transform] = fn;
      });

      var methods = provider.methods();

      if (this.version) {
        var result = /[0-9]+\.[0-9]+\.[0-9]+/.exec(this.version);

        if (!result) {
          throw new Error('Invalid version "' + this.version + '"', { version: this.version });
        }

        var _result = _slicedToArray$1(result, 1),
            version = _result[0];

        this.unsupportedMethods = ___default.chain(methods).pickBy(function (method) {
          return !semver.satisfies(version, method.version);
        }).keys().value();
      }

      ___default.forOwn(provider.methods(), function (obj, method) {
        _this2.methods[method] = obj;

        if (obj.handle) {
          if (___default.isFunction(obj.handle)) {
            // this[method] = _.partial(obj.handle)
            _this2[method] = ___default.partial(_this2.methodWrapper, method, obj.handle);
          } else {
            _this2[method] = ___default.partial(_this2.rpcWrapper, method, obj.handle);
          }
        } else {
          var rpcMethod = _this2.getRpcMethod(method, obj);

          if (!_this2.rpcMethods[rpcMethod]) _this2.rpcMethods[rpcMethod] = obj;
          _this2[method] = ___default.partial(_this2.rpcWrapper, method, rpcMethod);
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

      if (___default.isFunction(transformation)) {
        return Promise$1.resolve(transformation(result));
      } else if (transformation.handle) {
        return this.rpc(transformation.handle, result);
      } else if (___default.isArray(transformation)) {
        var _transformation = _slicedToArray$1(transformation, 1),
            obj = _transformation[0];

        return Promise$1.map(result, function (param) {
          return _this3.handleTransformation(obj, param);
        });
      } else {
        return Promise$1.reject(new Error('This type of mapping is not implemented yet.'));
      }
    }
  }, {
    key: 'handleResponse',
    value: function handleResponse(response, method, args) {
      var _this4 = this;

      var ref = this;
      return Promise$1.resolve(function () {
        var transform = ref.methods[method].transform;


        if (transform) {
          var tObj = transform.apply(undefined, _toConsumableArray(args));
          return Promise$1.map(Object.keys(tObj), function (field) {
            return ref.handleTransformation(tObj[field], response[field]).then(function (transformedField) {
              response[field] = transformedField;
            });
          }).then(function (__) {
            return response;
          });
        } else {
          return response;
        }
      }()).then(function (result) {
        var _ref$methods$method = ref.methods[method],
            mapping = _ref$methods$method.mapping,
            type = _ref$methods$method.type;


        if (mapping) {
          Object.keys(mapping).forEach(function () {
            var _ref = _asyncToGenerator$1( /*#__PURE__*/regeneratorRuntime.mark(function _callee(key) {
              var t;
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      t = mapping[key];

                      if (!(typeof t === 'string')) {
                        _context.next = 5;
                        break;
                      }

                      result[key] = result[t];
                      _context.next = 12;
                      break;

                    case 5:
                      if (!___default.isFunction(t)) {
                        _context.next = 11;
                        break;
                      }

                      _context.next = 8;
                      return t(key, result, ref);

                    case 8:
                      result[key] = _context.sent;
                      _context.next = 12;
                      break;

                    case 11:
                      throw new Error('This type of mapping is not implemented yet.');

                    case 12:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, _callee, _this4);
            }));

            return function (_x) {
              return _ref.apply(this, arguments);
            };
          }());
        }

        if (type) {
          var _interface = Client.Types[type];

          if (!_interface) {
            throw new Error('Unknown type ' + type);
          }

          Object.keys(_interface).forEach(function (key) {
            if (result[key] === undefined) {
              throw new Error('Method did not return ' + key + '. ' + JSON.stringify(result));
            }
          });
        }

        return result;
      });
    }
  }, {
    key: 'methodWrapper',
    value: function methodWrapper(method, fn) {
      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      var _this5 = this;

      return Promise$1.resolve(fn.apply(undefined, args)).then(function (x) {
        return _this5.handleResponse(x, method, args);
      });
    }
  }, {
    key: 'rpcWrapper',
    value: function rpcWrapper(method, rpcMethod) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      var _this6 = this;

      return this.rpc.apply(this, [rpcMethod].concat(args)).then(function (x) {
        return _this6.handleResponse(x, method, args);
      });
    }
  }, {
    key: 'rpc',
    value: function rpc(_method) {
      var _this7 = this;

      var methods = _method.split('|');

      for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }

      return Promise$1.reduce(methods, function (params, method) {
        if (!___default.isArray(params)) params = [params];

        var requestBody = _this7.jsonRpcHelper.prepareRequest({ method: method, params: params });

        return _this7.request.post({
          auth: ___default.pickBy(_this7.auth, ___default.identity),
          body: requestBody,
          uri: '/'
        }).then(_this7.jsonRpcHelper.parseResponse.bind(_this7.jsonRpcHelper));
      }, args);
    }
  }, {
    key: 'wire',
    value: function wire(_method) {
      throw new Error('Method not implemented yet');
    }
  }]);

  return Client;
}();


Client.providers = providers;
Client.Types = {
  Block: {
    number: 'number',
    hash: 'string',
    timestamp: 'timestamp',
    difficulty: 'number',
    size: 'number',
    parentHash: 'string',
    nonce: 'number'
  }
};

module.exports = Client;
