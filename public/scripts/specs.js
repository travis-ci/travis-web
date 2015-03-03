/**
 * Sinon.JS 1.3.4, 2012/04/16
 *
 * @author Christian Johansen (christian@cjohansen.no)
 *
 * (The BSD License)
 *
 * Copyright (c) 2010-2011, Christian Johansen, christian@cjohansen.no
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright notice,
 *       this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright notice,
 *       this list of conditions and the following disclaimer in the documentation
 *       and/or other materials provided with the distribution.
 *     * Neither the name of Christian Johansen nor the names of his contributors
 *       may be used to endorse or promote products derived from this software
 *       without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

"use strict";
var sinon = (function () {
var buster = (function (buster, setTimeout) {
    function extend(target) {
        if (!target) {
            return;
        }

        for (var i = 1, l = arguments.length, prop; i < l; ++i) {
            for (prop in arguments[i]) {
                target[prop] = arguments[i][prop];
            }
        }

        return target;
    }

    var div = typeof document != "undefined" && document.createElement("div");

    return extend(buster, {
        bind: function (obj, methOrProp) {
            var method = typeof methOrProp == "string" ? obj[methOrProp] : methOrProp;
            var args = Array.prototype.slice.call(arguments, 2);

            return function () {
                var allArgs = args.concat(Array.prototype.slice.call(arguments));
                return method.apply(obj, allArgs);
            };
        },

        create: (function () {
            function F() {}

            return function create(object) {
                F.prototype = object;
                return new F();
            }
        }()),

        extend: extend,

        nextTick: function (callback) {
            if (typeof process != "undefined" && process.nextTick) {
                return process.nextTick(callback);
            }

            setTimeout(callback, 0);
        },

        functionName: function (func) {
            if (!func) return "";
            if (func.displayName) return func.displayName;
            if (func.name) return func.name;

            var matches = func.toString().match(/function\s+([^\(]+)/m);
            return matches && matches[1] || "";
        },

        isNode: function (obj) {
            if (!div) return false;

            try {
                obj.appendChild(div);
                obj.removeChild(div);
            } catch (e) {
                return false;
            }

            return true;
        },

        isElement: function (obj) {
            return obj && buster.isNode(obj) && obj.nodeType === 1;
        }
    });
}(buster || {}, setTimeout));

if (typeof module == "object" && typeof require == "function") {
    module.exports = buster;
    buster.eventEmitter = require("./buster-event-emitter");

    Object.defineProperty(buster, "defineVersionGetter", {
        get: function () {
            return require("./define-version-getter");
        }
    });
}
if (typeof buster === "undefined") {
    var buster = {};
}

if (typeof module === "object" && typeof require === "function") {
    buster = require("buster-core");
}

buster.format = buster.format || {};
buster.format.excludeConstructors = ["Object", /^.$/];
buster.format.quoteStrings = true;

buster.format.ascii = (function () {

    function keys(object) {
        var k = Object.keys && Object.keys(object) || [];

        if (k.length == 0) {
            for (var prop in object) {
                if (object.hasOwnProperty(prop)) {
                    k.push(prop);
                }
            }
        }

        return k.sort();
    }

    function isCircular(object, objects) {
        if (typeof object != "object") {
            return false;
        }

        for (var i = 0, l = objects.length; i < l; ++i) {
            if (objects[i] === object) {
                return true;
            }
        }

        return false;
    }

    function ascii(object, processed, indent) {
        if (typeof object == "string") {
            var quote = typeof this.quoteStrings != "boolean" || this.quoteStrings;
            return processed || quote ? '"' + object + '"' : object;
        }

        if (typeof object == "function" && !(object instanceof RegExp)) {
            return ascii.func(object);
        }

        processed = processed || [];

        if (isCircular(object, processed)) {
            return "[Circular]";
        }

        if (Object.prototype.toString.call(object) == "[object Array]") {
            return ascii.array.call(this, object);
        }

        if (!object) {
            return "" + object;
        }

        if (buster.isElement(object)) {
            return ascii.element(object);
        }

        if (typeof object.toString == "function" &&
            object.toString !== Object.prototype.toString) {
            return object.toString();
        }

        return ascii.object.call(this, object, processed, indent);
    }

    ascii.func = function (func) {
        return "function " + buster.functionName(func) + "() {}";
    };

    ascii.array = function (array, processed) {
        processed = processed || [];
        processed.push(array);
        var pieces = [];

        for (var i = 0, l = array.length; i < l; ++i) {
            pieces.push(ascii.call(this, array[i], processed));
        }

        return "[" + pieces.join(", ") + "]";
    };

    ascii.object = function (object, processed, indent) {
        processed = processed || [];
        processed.push(object);
        indent = indent || 0;
        var pieces = [], properties = keys(object), prop, str, obj;
        var is = "";
        var length = 3;

        for (var i = 0, l = indent; i < l; ++i) {
            is += " ";
        }

        for (i = 0, l = properties.length; i < l; ++i) {
            prop = properties[i];
            obj = object[prop];

            if (isCircular(obj, processed)) {
                str = "[Circular]";
            } else {
                str = ascii.call(this, obj, processed, indent + 2);
            }

            str = (/\s/.test(prop) ? '"' + prop + '"' : prop) + ": " + str;
            length += str.length;
            pieces.push(str);
        }

        var cons = ascii.constructorName.call(this, object);
        var prefix = cons ? "[" + cons + "] " : ""

        return (length + indent) > 80 ?
            prefix + "{\n  " + is + pieces.join(",\n  " + is) + "\n" + is + "}" :
            prefix + "{ " + pieces.join(", ") + " }";
    };

    ascii.element = function (element) {
        var tagName = element.tagName.toLowerCase();
        var attrs = element.attributes, attribute, pairs = [], attrName;

        for (var i = 0, l = attrs.length; i < l; ++i) {
            attribute = attrs.item(i);
            attrName = attribute.nodeName.toLowerCase().replace("html:", "");

            if (attrName == "contenteditable" && attribute.nodeValue == "inherit") {
                continue;
            }

            if (!!attribute.nodeValue) {
                pairs.push(attrName + "=\"" + attribute.nodeValue + "\"");
            }
        }

        var formatted = "<" + tagName + (pairs.length > 0 ? " " : "");
        var content = element.innerHTML;

        if (content.length > 20) {
            content = content.substr(0, 20) + "[...]";
        }

        var res = formatted + pairs.join(" ") + ">" + content + "</" + tagName + ">";

        return res.replace(/ contentEditable="inherit"/, "");
    };

    ascii.constructorName = function (object) {
        var name = buster.functionName(object && object.constructor);
        var excludes = this.excludeConstructors || buster.format.excludeConstructors || [];

        for (var i = 0, l = excludes.length; i < l; ++i) {
            if (typeof excludes[i] == "string" && excludes[i] == name) {
                return "";
            } else if (excludes[i].test && excludes[i].test(name)) {
                return "";
            }
        }

        return name;
    };

    return ascii;
}());

if (typeof module != "undefined") {
    module.exports = buster.format;
}
/*jslint eqeqeq: false, onevar: false, forin: true, nomen: false, regexp: false, plusplus: false*/
/*global module, require, __dirname, document*/
/**
 * Sinon core utilities. For internal use only.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2011 Christian Johansen
 */

var sinon = (function (buster) {
    var div = typeof document != "undefined" && document.createElement("div");
    var hasOwn = Object.prototype.hasOwnProperty;

    function isDOMNode(obj) {
        var success = false;

        try {
            obj.appendChild(div);
            success = div.parentNode == obj;
        } catch (e) {
            return false;
        } finally {
            try {
                obj.removeChild(div);
            } catch (e) {
                // Remove failed, not much we can do about that
            }
        }

        return success;
    }

    function isElement(obj) {
        return div && obj && obj.nodeType === 1 && isDOMNode(obj);
    }

    function isFunction(obj) {
        return !!(obj && obj.constructor && obj.call && obj.apply);
    }

    function mirrorProperties(target, source) {
        for (var prop in source) {
            if (!hasOwn.call(target, prop)) {
                target[prop] = source[prop];
            }
        }
    }

    var sinon = {
        wrapMethod: function wrapMethod(object, property, method) {
            if (!object) {
                throw new TypeError("Should wrap property of object");
            }

            if (typeof method != "function") {
                throw new TypeError("Method wrapper should be function");
            }

            var wrappedMethod = object[property];

            if (!isFunction(wrappedMethod)) {
                throw new TypeError("Attempted to wrap " + (typeof wrappedMethod) + " property " +
                                    property + " as function");
            }

            if (wrappedMethod.restore && wrappedMethod.restore.sinon) {
                throw new TypeError("Attempted to wrap " + property + " which is already wrapped");
            }

            if (wrappedMethod.calledBefore) {
                var verb = !!wrappedMethod.returns ? "stubbed" : "spied on";
                throw new TypeError("Attempted to wrap " + property + " which is already " + verb);
            }

            // IE 8 does not support hasOwnProperty on the window object.
            var owned = hasOwn.call(object, property);
            object[property] = method;
            method.displayName = property;

            method.restore = function () {
                if(owned) {
                    object[property] = wrappedMethod;
                } else {
                    delete object[property];
                }
            };

            method.restore.sinon = true;
            mirrorProperties(method, wrappedMethod);

            return method;
        },

        extend: function extend(target) {
            for (var i = 1, l = arguments.length; i < l; i += 1) {
                for (var prop in arguments[i]) {
                    if (arguments[i].hasOwnProperty(prop)) {
                        target[prop] = arguments[i][prop];
                    }

                    // DONT ENUM bug, only care about toString
                    if (arguments[i].hasOwnProperty("toString") &&
                        arguments[i].toString != target.toString) {
                        target.toString = arguments[i].toString;
                    }
                }
            }

            return target;
        },

        create: function create(proto) {
            var F = function () {};
            F.prototype = proto;
            return new F();
        },

        deepEqual: function deepEqual(a, b) {
            if (typeof a != "object" || typeof b != "object") {
                return a === b;
            }

            if (isElement(a) || isElement(b)) {
                return a === b;
            }

            if (a === b) {
                return true;
            }

            var aString = Object.prototype.toString.call(a);
            if (aString != Object.prototype.toString.call(b)) {
                return false;
            }

            if (aString == "[object Array]") {
                if (a.length !== b.length) {
                    return false;
                }

                for (var i = 0, l = a.length; i < l; i += 1) {
                    if (!deepEqual(a[i], b[i])) {
                        return false;
                    }
                }

                return true;
            }

            var prop, aLength = 0, bLength = 0;

            for (prop in a) {
                aLength += 1;

                if (!deepEqual(a[prop], b[prop])) {
                    return false;
                }
            }

            for (prop in b) {
                bLength += 1;
            }

            if (aLength != bLength) {
                return false;
            }

            return true;
        },

        functionName: function functionName(func) {
            var name = func.displayName || func.name;

            // Use function decomposition as a last resort to get function
            // name. Does not rely on function decomposition to work - if it
            // doesn't debugging will be slightly less informative
            // (i.e. toString will say 'spy' rather than 'myFunc').
            if (!name) {
                var matches = func.toString().match(/function ([^\s\(]+)/);
                name = matches && matches[1];
            }

            return name;
        },

        functionToString: function toString() {
            if (this.getCall && this.callCount) {
                var thisValue, prop, i = this.callCount;

                while (i--) {
                    thisValue = this.getCall(i).thisValue;

                    for (prop in thisValue) {
                        if (thisValue[prop] === this) {
                            return prop;
                        }
                    }
                }
            }

            return this.displayName || "sinon fake";
        },

        getConfig: function (custom) {
            var config = {};
            custom = custom || {};
            var defaults = sinon.defaultConfig;

            for (var prop in defaults) {
                if (defaults.hasOwnProperty(prop)) {
                    config[prop] = custom.hasOwnProperty(prop) ? custom[prop] : defaults[prop];
                }
            }

            return config;
        },

        format: function (val) {
            return "" + val;
        },

        defaultConfig: {
            injectIntoThis: true,
            injectInto: null,
            properties: ["spy", "stub", "mock", "clock", "server", "requests"],
            useFakeTimers: true,
            useFakeServer: true
        },

        timesInWords: function timesInWords(count) {
            return count == 1 && "once" ||
                count == 2 && "twice" ||
                count == 3 && "thrice" ||
                (count || 0) + " times";
        },

        calledInOrder: function (spies) {
            for (var i = 1, l = spies.length; i < l; i++) {
                if (!spies[i - 1].calledBefore(spies[i])) {
                    return false;
                }
            }

            return true;
        },

        orderByFirstCall: function (spies) {
            return spies.sort(function (a, b) {
                // uuid, won't ever be equal
                var aCall = a.getCall(0);
                var bCall = b.getCall(0);
                var aId = aCall && aCall.callId || -1;
                var bId = bCall && bCall.callId || -1;

                return aId < bId ? -1 : 1;
            });
        },

        log: function () {},

        logError: function (label, err) {
            var msg = label + " threw exception: "
            sinon.log(msg + "[" + err.name + "] " + err.message);
            if (err.stack) { sinon.log(err.stack); }

            setTimeout(function () {
                err.message = msg + err.message;
                throw err;
            }, 0);
        }
    };

    var isNode = typeof module == "object" && typeof require == "function";

    if (isNode) {
        try {
            buster = { format: require("buster-format") };
        } catch (e) {}
        module.exports = sinon;
        module.exports.spy = require("./sinon/spy");
        module.exports.stub = require("./sinon/stub");
        module.exports.mock = require("./sinon/mock");
        module.exports.collection = require("./sinon/collection");
        module.exports.assert = require("./sinon/assert");
        module.exports.sandbox = require("./sinon/sandbox");
        module.exports.test = require("./sinon/test");
        module.exports.testCase = require("./sinon/test_case");
        module.exports.assert = require("./sinon/assert");
    }

    if (buster) {
        var formatter = sinon.create(buster.format);
        formatter.quoteStrings = false;
        sinon.format = function () {
            return formatter.ascii.apply(formatter, arguments);
        };
    } else if (isNode) {
        try {
            var util = require("util");
            sinon.format = function (value) {
                return typeof value == "object" ? util.inspect(value) : value;
            };
        } catch (e) {
            /* Node, but no util module - would be very old, but better safe than
             sorry */
        }
    }

    return sinon;
}(typeof buster == "object" && buster));

/* @depend ../sinon.js */
/*jslint eqeqeq: false, onevar: false, plusplus: false*/
/*global module, require, sinon*/
/**
 * Spy functions
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2011 Christian Johansen
 */

(function (sinon) {
    var commonJSModule = typeof module == "object" && typeof require == "function";
    var spyCall;
    var callId = 0;
    var push = [].push;
    var slice = Array.prototype.slice;

    if (!sinon && commonJSModule) {
        sinon = require("../sinon");
    }

    if (!sinon) {
        return;
    }

    function spy(object, property) {
        if (!property && typeof object == "function") {
            return spy.create(object);
        }

        if (!object || !property) {
            return spy.create(function () {});
        }

        var method = object[property];
        return sinon.wrapMethod(object, property, spy.create(method));
    }

    sinon.extend(spy, (function () {

        function delegateToCalls(api, method, matchAny, actual, notCalled) {
            api[method] = function () {
                if (!this.called) {
                    if (notCalled) {
                        return notCalled.apply(this, arguments);
                    }
                    return false;
                }

                var currentCall;
                var matches = 0;

                for (var i = 0, l = this.callCount; i < l; i += 1) {
                    currentCall = this.getCall(i);

                    if (currentCall[actual || method].apply(currentCall, arguments)) {
                        matches += 1;

                        if (matchAny) {
                            return true;
                        }
                    }
                }

                return matches === this.callCount;
            };
        }

        function matchingFake(fakes, args, strict) {
            if (!fakes) {
                return;
            }

            var alen = args.length;

            for (var i = 0, l = fakes.length; i < l; i++) {
                if (fakes[i].matches(args, strict)) {
                    return fakes[i];
                }
            }
        }

        function incrementCallCount() {
            this.called = true;
            this.callCount += 1;
            this.calledOnce = this.callCount == 1;
            this.calledTwice = this.callCount == 2;
            this.calledThrice = this.callCount == 3;
        }

        function createCallProperties() {
            this.firstCall = this.getCall(0);
            this.secondCall = this.getCall(1);
            this.thirdCall = this.getCall(2);
            this.lastCall = this.getCall(this.callCount - 1);
        }

        var uuid = 0;

        // Public API
        var spyApi = {
            reset: function () {
                this.called = false;
                this.calledOnce = false;
                this.calledTwice = false;
                this.calledThrice = false;
                this.callCount = 0;
                this.firstCall = null;
                this.secondCall = null;
                this.thirdCall = null;
                this.lastCall = null;
                this.args = [];
                this.returnValues = [];
                this.thisValues = [];
                this.exceptions = [];
                this.callIds = [];
            },

            create: function create(func) {
                var name;

                if (typeof func != "function") {
                    func = function () {};
                } else {
                    name = sinon.functionName(func);
                }

                function proxy() {
                    return proxy.invoke(func, this, slice.call(arguments));
                }

                sinon.extend(proxy, spy);
                delete proxy.create;
                sinon.extend(proxy, func);

                proxy.reset();
                proxy.prototype = func.prototype;
                proxy.displayName = name || "spy";
                proxy.toString = sinon.functionToString;
                proxy._create = sinon.spy.create;
                proxy.id = "spy#" + uuid++;

                return proxy;
            },

            invoke: function invoke(func, thisValue, args) {
                var matching = matchingFake(this.fakes, args);
                var exception, returnValue;

                incrementCallCount.call(this);
                push.call(this.thisValues, thisValue);
                push.call(this.args, args);
                push.call(this.callIds, callId++);

                try {
                    if (matching) {
                        returnValue = matching.invoke(func, thisValue, args);
                    } else {
                        returnValue = (this.func || func).apply(thisValue, args);
                    }
                } catch (e) {
                    push.call(this.returnValues, undefined);
                    exception = e;
                    throw e;
                } finally {
                    push.call(this.exceptions, exception);
                }

                push.call(this.returnValues, returnValue);

                createCallProperties.call(this);

                return returnValue;
            },

            getCall: function getCall(i) {
                if (i < 0 || i >= this.callCount) {
                    return null;
                }

                return spyCall.create(this, this.thisValues[i], this.args[i],
                                      this.returnValues[i], this.exceptions[i],
                                      this.callIds[i]);
            },

            calledBefore: function calledBefore(spyFn) {
                if (!this.called) {
                    return false;
                }

                if (!spyFn.called) {
                    return true;
                }

                return this.callIds[0] < spyFn.callIds[spyFn.callIds.length - 1];
            },

            calledAfter: function calledAfter(spyFn) {
                if (!this.called || !spyFn.called) {
                    return false;
                }

                return this.callIds[this.callCount - 1] > spyFn.callIds[spyFn.callCount - 1];
            },

            withArgs: function () {
                var args = slice.call(arguments);

                if (this.fakes) {
                    var match = matchingFake(this.fakes, args, true);

                    if (match) {
                        return match;
                    }
                } else {
                    this.fakes = [];
                }

                var original = this;
                var fake = this._create();
                fake.matchingAguments = args;
                push.call(this.fakes, fake);

                fake.withArgs = function () {
                    return original.withArgs.apply(original, arguments);
                };

                for (var i = 0; i < this.args.length; i++) {
                    if (fake.matches(this.args[i])) {
                        incrementCallCount.call(fake);
                        push.call(fake.thisValues, this.thisValues[i]);
                        push.call(fake.args, this.args[i]);
                        push.call(fake.returnValues, this.returnValues[i]);
                        push.call(fake.exceptions, this.exceptions[i]);
                        push.call(fake.callIds, this.callIds[i]);
                    }
                }
                createCallProperties.call(fake);

                return fake;
            },

            matches: function (args, strict) {
                var margs = this.matchingAguments;

                if (margs.length <= args.length &&
                    sinon.deepEqual(margs, args.slice(0, margs.length))) {
                    return !strict || margs.length == args.length;
                }
            },

            printf: function (format) {
                var spy = this;
                var args = slice.call(arguments, 1);
                var formatter;

                return (format || "").replace(/%(.)/g, function (match, specifyer) {
                    formatter = spyApi.formatters[specifyer];

                    if (typeof formatter == "function") {
                        return formatter.call(null, spy, args);
                    } else if (!isNaN(parseInt(specifyer), 10)) {
                        return sinon.format(args[specifyer - 1]);
                    }

                    return "%" + specifyer;
                });
            }
        };

        delegateToCalls(spyApi, "calledOn", true);
        delegateToCalls(spyApi, "alwaysCalledOn", false, "calledOn");
        delegateToCalls(spyApi, "calledWith", true);
        delegateToCalls(spyApi, "alwaysCalledWith", false, "calledWith");
        delegateToCalls(spyApi, "calledWithExactly", true);
        delegateToCalls(spyApi, "alwaysCalledWithExactly", false, "calledWithExactly");
        delegateToCalls(spyApi, "neverCalledWith", false, "notCalledWith",
            function () { return true; });
        delegateToCalls(spyApi, "threw", true);
        delegateToCalls(spyApi, "alwaysThrew", false, "threw");
        delegateToCalls(spyApi, "returned", true);
        delegateToCalls(spyApi, "alwaysReturned", false, "returned");
        delegateToCalls(spyApi, "calledWithNew", true);
        delegateToCalls(spyApi, "alwaysCalledWithNew", false, "calledWithNew");
        delegateToCalls(spyApi, "callArg", false, "callArgWith", function () {
            throw new Error(this.toString() + " cannot call arg since it was not yet invoked.");
        });
        spyApi.callArgWith = spyApi.callArg;
        delegateToCalls(spyApi, "yield", false, "yield", function () {
            throw new Error(this.toString() + " cannot yield since it was not yet invoked.");
        });
        // "invokeCallback" is an alias for "yield" since "yield" is invalid in strict mode.
        spyApi.invokeCallback = spyApi.yield;
        delegateToCalls(spyApi, "yieldTo", false, "yieldTo", function (property) {
            throw new Error(this.toString() + " cannot yield to '" + property +
                "' since it was not yet invoked.");
        });

        spyApi.formatters = {
            "c": function (spy) {
                return sinon.timesInWords(spy.callCount);
            },

            "n": function (spy) {
                return spy.toString();
            },

            "C": function (spy) {
                var calls = [];

                for (var i = 0, l = spy.callCount; i < l; ++i) {
                    push.call(calls, "    " + spy.getCall(i).toString());
                }

                return calls.length > 0 ? "\n" + calls.join("\n") : "";
            },

            "t": function (spy) {
                var objects = [];

                for (var i = 0, l = spy.callCount; i < l; ++i) {
                    push.call(objects, sinon.format(spy.thisValues[i]));
                }

                return objects.join(", ");
            },

            "*": function (spy, args) {
                return args.join(", ");
            }
        };

        return spyApi;
    }()));

    spyCall = (function () {

        function throwYieldError(proxy, text, args) {
            var msg = sinon.functionName(proxy) + text;
            if (args.length) {
                msg += " Received [" + slice.call(args).join(", ") + "]";
            }
            throw new Error(msg);
        }

        return {
            create: function create(spy, thisValue, args, returnValue, exception, id) {
                var proxyCall = sinon.create(spyCall);
                delete proxyCall.create;
                proxyCall.proxy = spy;
                proxyCall.thisValue = thisValue;
                proxyCall.args = args;
                proxyCall.returnValue = returnValue;
                proxyCall.exception = exception;
                proxyCall.callId = typeof id == "number" && id || callId++;

                return proxyCall;
            },

            calledOn: function calledOn(thisValue) {
                return this.thisValue === thisValue;
            },

            calledWith: function calledWith() {
                for (var i = 0, l = arguments.length; i < l; i += 1) {
                    if (!sinon.deepEqual(arguments[i], this.args[i])) {
                        return false;
                    }
                }

                return true;
            },

            calledWithExactly: function calledWithExactly() {
                return arguments.length == this.args.length &&
                    this.calledWith.apply(this, arguments);
            },

            notCalledWith: function notCalledWith() {
                for (var i = 0, l = arguments.length; i < l; i += 1) {
                    if (!sinon.deepEqual(arguments[i], this.args[i])) {
                        return true;
                    }
                }
                return false;
            },

            returned: function returned(value) {
                return this.returnValue === value;
            },

            threw: function threw(error) {
                if (typeof error == "undefined" || !this.exception) {
                    return !!this.exception;
                }

                if (typeof error == "string") {
                    return this.exception.name == error;
                }

                return this.exception === error;
            },

            calledWithNew: function calledWithNew(thisValue) {
                return this.thisValue instanceof this.proxy;
            },

            calledBefore: function (other) {
                return this.callId < other.callId;
            },

            calledAfter: function (other) {
                return this.callId > other.callId;
            },

            callArg: function (pos) {
                this.args[pos]();
            },

            callArgWith: function (pos) {
                var args = slice.call(arguments, 1);
                this.args[pos].apply(null, args);
            },

            "yield": function () {
                var args = this.args;
                for (var i = 0, l = args.length; i < l; ++i) {
                    if (typeof args[i] === "function") {
                        args[i].apply(null, slice.call(arguments));
                        return;
                    }
                }
                throwYieldError(this.proxy, " cannot yield since no callback was passed.", args);
            },

            yieldTo: function (prop) {
                var args = this.args;
                for (var i = 0, l = args.length; i < l; ++i) {
                    if (args[i] && typeof args[i][prop] === "function") {
                        args[i][prop].apply(null, slice.call(arguments, 1));
                        return;
                    }
                }
                throwYieldError(this.proxy, " cannot yield to '" + prop +
                    "' since no callback was passed.", args);
            },

            toString: function () {
                var callStr = this.proxy.toString() + "(";
                var args = [];

                for (var i = 0, l = this.args.length; i < l; ++i) {
                    push.call(args, sinon.format(this.args[i]));
                }

                callStr = callStr + args.join(", ") + ")";

                if (typeof this.returnValue != "undefined") {
                    callStr += " => " + sinon.format(this.returnValue);
                }

                if (this.exception) {
                    callStr += " !" + this.exception.name;

                    if (this.exception.message) {
                        callStr += "(" + this.exception.message + ")";
                    }
                }

                return callStr;
            }
        };
    }());

    spy.spyCall = spyCall;

    // This steps outside the module sandbox and will be removed
    sinon.spyCall = spyCall;

    if (commonJSModule) {
        module.exports = spy;
    } else {
        sinon.spy = spy;
    }
}(typeof sinon == "object" && sinon || null));

/**
 * @depend ../sinon.js
 * @depend spy.js
 */
/*jslint eqeqeq: false, onevar: false*/
/*global module, require, sinon*/
/**
 * Stub functions
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2011 Christian Johansen
 */

(function (sinon) {
    var commonJSModule = typeof module == "object" && typeof require == "function";

    if (!sinon && commonJSModule) {
        sinon = require("../sinon");
    }

    if (!sinon) {
        return;
    }

    function stub(object, property, func) {
        if (!!func && typeof func != "function") {
            throw new TypeError("Custom stub should be function");
        }

        var wrapper;

        if (func) {
            wrapper = sinon.spy && sinon.spy.create ? sinon.spy.create(func) : func;
        } else {
            wrapper = stub.create();
        }

        if (!object && !property) {
            return sinon.stub.create();
        }

        if (!property && !!object && typeof object == "object") {
            for (var prop in object) {
                if (typeof object[prop] === "function") {
                    stub(object, prop);
                }
            }

            return object;
        }

        return sinon.wrapMethod(object, property, wrapper);
    }

    function getCallback(stub, args) {
        if (stub.callArgAt < 0) {
            for (var i = 0, l = args.length; i < l; ++i) {
                if (!stub.callArgProp && typeof args[i] == "function") {
                    return args[i];
                }

                if (stub.callArgProp && args[i] &&
                    typeof args[i][stub.callArgProp] == "function") {
                    return args[i][stub.callArgProp];
                }
            }

            return null;
        }

        return args[stub.callArgAt];
    }

    var join = Array.prototype.join;

    function getCallbackError(stub, func, args) {
        if (stub.callArgAt < 0) {
            var msg;

            if (stub.callArgProp) {
                msg = sinon.functionName(stub) +
                    " expected to yield to '" + stub.callArgProp +
                    "', but no object with such a property was passed."
            } else {
                msg = sinon.functionName(stub) +
                            " expected to yield, but no callback was passed."
            }

            if (args.length > 0) {
                msg += " Received [" + join.call(args, ", ") + "]";
            }

            return msg;
        }

        return "argument at index " + stub.callArgAt + " is not a function: " + func;
    }

    function callCallback(stub, args) {
        if (typeof stub.callArgAt == "number") {
            var func = getCallback(stub, args);

            if (typeof func != "function") {
                throw new TypeError(getCallbackError(stub, func, args));
            }

            func.apply(stub.callbackContext, stub.callbackArguments);
        }
    }

    var uuid = 0;

    sinon.extend(stub, (function () {
        var slice = Array.prototype.slice;

        function throwsException(error, message) {
            if (typeof error == "string") {
                this.exception = new Error(message || "");
                this.exception.name = error;
            } else if (!error) {
                this.exception = new Error("Error");
            } else {
                this.exception = error;
            }

            return this;
        }

        return {
            create: function create() {
                var functionStub = function () {
                    if (functionStub.exception) {
                        throw functionStub.exception;
                    } else if (typeof functionStub.returnArgAt == 'number') {
                        return arguments[functionStub.returnArgAt];
                    }

                    callCallback(functionStub, arguments);

                    return functionStub.returnValue;
                };

                functionStub.id = "stub#" + uuid++;
                var orig = functionStub;
                functionStub = sinon.spy.create(functionStub);
                functionStub.func = orig;

                sinon.extend(functionStub, stub);
                functionStub._create = sinon.stub.create;
                functionStub.displayName = "stub";
                functionStub.toString = sinon.functionToString;

                return functionStub;
            },

            returns: function returns(value) {
                this.returnValue = value;

                return this;
            },

            returnsArg: function returnsArg(pos) {
                if (typeof pos != "number") {
                    throw new TypeError("argument index is not number");
                }

                this.returnArgAt = pos;

                return this;
            },

            "throws": throwsException,
            throwsException: throwsException,

            callsArg: function callsArg(pos) {
                if (typeof pos != "number") {
                    throw new TypeError("argument index is not number");
                }

                this.callArgAt = pos;
                this.callbackArguments = [];

                return this;
            },

            callsArgOn: function callsArgOn(pos, context) {
                if (typeof pos != "number") {
                    throw new TypeError("argument index is not number");
                }
                if (typeof context != "object") {
                    throw new TypeError("argument context is not an object");
                }

                this.callArgAt = pos;
                this.callbackArguments = [];
                this.callbackContext = context;

                return this;
            },

            callsArgWith: function callsArgWith(pos) {
                if (typeof pos != "number") {
                    throw new TypeError("argument index is not number");
                }

                this.callArgAt = pos;
                this.callbackArguments = slice.call(arguments, 1);

                return this;
            },

            callsArgOnWith: function callsArgWith(pos, context) {
                if (typeof pos != "number") {
                    throw new TypeError("argument index is not number");
                }
                if (typeof context != "object") {
                    throw new TypeError("argument context is not an object");
                }

                this.callArgAt = pos;
                this.callbackArguments = slice.call(arguments, 2);
                this.callbackContext = context;

                return this;
            },

            yields: function () {
                this.callArgAt = -1;
                this.callbackArguments = slice.call(arguments, 0);

                return this;
            },

            yieldsOn: function (context) {
                if (typeof context != "object") {
                    throw new TypeError("argument context is not an object");
                }

                this.callArgAt = -1;
                this.callbackArguments = slice.call(arguments, 1);
                this.callbackContext = context;

                return this;
            },

            yieldsTo: function (prop) {
                this.callArgAt = -1;
                this.callArgProp = prop;
                this.callbackArguments = slice.call(arguments, 1);

                return this;
            },

            yieldsToOn: function (prop, context) {
                if (typeof context != "object") {
                    throw new TypeError("argument context is not an object");
                }

                this.callArgAt = -1;
                this.callArgProp = prop;
                this.callbackArguments = slice.call(arguments, 2);
                this.callbackContext = context;

                return this;
            }
        };
    }()));

    if (commonJSModule) {
        module.exports = stub;
    } else {
        sinon.stub = stub;
    }
}(typeof sinon == "object" && sinon || null));

/**
 * @depend ../sinon.js
 * @depend stub.js
 */
/*jslint eqeqeq: false, onevar: false, nomen: false*/
/*global module, require, sinon*/
/**
 * Mock functions.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2011 Christian Johansen
 */

(function (sinon) {
    var commonJSModule = typeof module == "object" && typeof require == "function";
    var push = [].push;

    if (!sinon && commonJSModule) {
        sinon = require("../sinon");
    }

    if (!sinon) {
        return;
    }

    function mock(object) {
        if (!object) {
            return sinon.expectation.create("Anonymous mock");
        }

        return mock.create(object);
    }

    sinon.mock = mock;

    sinon.extend(mock, (function () {
        function each(collection, callback) {
            if (!collection) {
                return;
            }

            for (var i = 0, l = collection.length; i < l; i += 1) {
                callback(collection[i]);
            }
        }

        return {
            create: function create(object) {
                if (!object) {
                    throw new TypeError("object is null");
                }

                var mockObject = sinon.extend({}, mock);
                mockObject.object = object;
                delete mockObject.create;

                return mockObject;
            },

            expects: function expects(method) {
                if (!method) {
                    throw new TypeError("method is falsy");
                }

                if (!this.expectations) {
                    this.expectations = {};
                    this.proxies = [];
                }

                if (!this.expectations[method]) {
                    this.expectations[method] = [];
                    var mockObject = this;

                    sinon.wrapMethod(this.object, method, function () {
                        return mockObject.invokeMethod(method, this, arguments);
                    });

                    push.call(this.proxies, method);
                }

                var expectation = sinon.expectation.create(method);
                push.call(this.expectations[method], expectation);

                return expectation;
            },

            restore: function restore() {
                var object = this.object;

                each(this.proxies, function (proxy) {
                    if (typeof object[proxy].restore == "function") {
                        object[proxy].restore();
                    }
                });
            },

            verify: function verify() {
                var expectations = this.expectations || {};
                var messages = [], met = [];

                each(this.proxies, function (proxy) {
                    each(expectations[proxy], function (expectation) {
                        if (!expectation.met()) {
                            push.call(messages, expectation.toString());
                        } else {
                            push.call(met, expectation.toString());
                        }
                    });
                });

                this.restore();

                if (messages.length > 0) {
                    sinon.expectation.fail(messages.concat(met).join("\n"));
                }

                return true;
            },

            invokeMethod: function invokeMethod(method, thisValue, args) {
                var expectations = this.expectations && this.expectations[method];
                var length = expectations && expectations.length || 0;

                for (var i = 0; i < length; i += 1) {
                    if (!expectations[i].met() &&
                        expectations[i].allowsCall(thisValue, args)) {
                        return expectations[i].apply(thisValue, args);
                    }
                }

                var messages = [];

                for (i = 0; i < length; i += 1) {
                    push.call(messages, "    " + expectations[i].toString());
                }

                messages.unshift("Unexpected call: " + sinon.spyCall.toString.call({
                    proxy: method,
                    args: args
                }));

                sinon.expectation.fail(messages.join("\n"));
            }
        };
    }()));

    var times = sinon.timesInWords;

    sinon.expectation = (function () {
        var slice = Array.prototype.slice;
        var _invoke = sinon.spy.invoke;

        function callCountInWords(callCount) {
            if (callCount == 0) {
                return "never called";
            } else {
                return "called " + times(callCount);
            }
        }

        function expectedCallCountInWords(expectation) {
            var min = expectation.minCalls;
            var max = expectation.maxCalls;

            if (typeof min == "number" && typeof max == "number") {
                var str = times(min);

                if (min != max) {
                    str = "at least " + str + " and at most " + times(max);
                }

                return str;
            }

            if (typeof min == "number") {
                return "at least " + times(min);
            }

            return "at most " + times(max);
        }

        function receivedMinCalls(expectation) {
            var hasMinLimit = typeof expectation.minCalls == "number";
            return !hasMinLimit || expectation.callCount >= expectation.minCalls;
        }

        function receivedMaxCalls(expectation) {
            if (typeof expectation.maxCalls != "number") {
                return false;
            }

            return expectation.callCount == expectation.maxCalls;
        }

        return {
            minCalls: 1,
            maxCalls: 1,

            create: function create(methodName) {
                var expectation = sinon.extend(sinon.stub.create(), sinon.expectation);
                delete expectation.create;
                expectation.method = methodName;

                return expectation;
            },

            invoke: function invoke(func, thisValue, args) {
                this.verifyCallAllowed(thisValue, args);

                return _invoke.apply(this, arguments);
            },

            atLeast: function atLeast(num) {
                if (typeof num != "number") {
                    throw new TypeError("'" + num + "' is not number");
                }

                if (!this.limitsSet) {
                    this.maxCalls = null;
                    this.limitsSet = true;
                }

                this.minCalls = num;

                return this;
            },

            atMost: function atMost(num) {
                if (typeof num != "number") {
                    throw new TypeError("'" + num + "' is not number");
                }

                if (!this.limitsSet) {
                    this.minCalls = null;
                    this.limitsSet = true;
                }

                this.maxCalls = num;

                return this;
            },

            never: function never() {
                return this.exactly(0);
            },

            once: function once() {
                return this.exactly(1);
            },

            twice: function twice() {
                return this.exactly(2);
            },

            thrice: function thrice() {
                return this.exactly(3);
            },

            exactly: function exactly(num) {
                if (typeof num != "number") {
                    throw new TypeError("'" + num + "' is not a number");
                }

                this.atLeast(num);
                return this.atMost(num);
            },

            met: function met() {
                return !this.failed && receivedMinCalls(this);
            },

            verifyCallAllowed: function verifyCallAllowed(thisValue, args) {
                if (receivedMaxCalls(this)) {
                    this.failed = true;
                    sinon.expectation.fail(this.method + " already called " + times(this.maxCalls));
                }

                if ("expectedThis" in this && this.expectedThis !== thisValue) {
                    sinon.expectation.fail(this.method + " called with " + thisValue + " as thisValue, expected " +
                        this.expectedThis);
                }

                if (!("expectedArguments" in this)) {
                    return;
                }

                if (!args || args.length === 0) {
                    sinon.expectation.fail(this.method + " received no arguments, expected " +
                        this.expectedArguments.join());
                }

                if (args.length < this.expectedArguments.length) {
                    sinon.expectation.fail(this.method + " received too few arguments (" + args.join() +
                        "), expected " + this.expectedArguments.join());
                }

                if (this.expectsExactArgCount &&
                    args.length != this.expectedArguments.length) {
                    sinon.expectation.fail(this.method + " received too many arguments (" + args.join() +
                        "), expected " + this.expectedArguments.join());
                }

                for (var i = 0, l = this.expectedArguments.length; i < l; i += 1) {
                    if (!sinon.deepEqual(this.expectedArguments[i], args[i])) {
                        sinon.expectation.fail(this.method + " received wrong arguments (" + args.join() +
                            "), expected " + this.expectedArguments.join());
                    }
                }
            },

            allowsCall: function allowsCall(thisValue, args) {
                if (this.met()) {
                    return false;
                }

                if ("expectedThis" in this && this.expectedThis !== thisValue) {
                    return false;
                }

                if (!("expectedArguments" in this)) {
                    return true;
                }

                args = args || [];

                if (args.length < this.expectedArguments.length) {
                    return false;
                }

                if (this.expectsExactArgCount &&
                    args.length != this.expectedArguments.length) {
                    return false;
                }

                for (var i = 0, l = this.expectedArguments.length; i < l; i += 1) {
                    if (!sinon.deepEqual(this.expectedArguments[i], args[i])) {
                        return false;
                    }
                }

                return true;
            },

            withArgs: function withArgs() {
                this.expectedArguments = slice.call(arguments);
                return this;
            },

            withExactArgs: function withExactArgs() {
                this.withArgs.apply(this, arguments);
                this.expectsExactArgCount = true;
                return this;
            },

            on: function on(thisValue) {
                this.expectedThis = thisValue;
                return this;
            },

            toString: function () {
                var args = (this.expectedArguments || []).slice();

                if (!this.expectsExactArgCount) {
                    push.call(args, "[...]");
                }

                var callStr = sinon.spyCall.toString.call({
                    proxy: this.method, args: args
                });

                var message = callStr.replace(", [...", "[, ...") + " " +
                    expectedCallCountInWords(this);

                if (this.met()) {
                    return "Expectation met: " + message;
                }

                return "Expected " + message + " (" +
                    callCountInWords(this.callCount) + ")";
            },

            verify: function verify() {
                if (!this.met()) {
                    sinon.expectation.fail(this.toString());
                }

                return true;
            },

            fail: function (message) {
                var exception = new Error(message);
                exception.name = "ExpectationError";

                throw exception;
            }
        };
    }());

    if (commonJSModule) {
        module.exports = mock;
    } else {
        sinon.mock = mock;
    }
}(typeof sinon == "object" && sinon || null));

/**
 * @depend ../sinon.js
 * @depend stub.js
 * @depend mock.js
 */
/*jslint eqeqeq: false, onevar: false, forin: true*/
/*global module, require, sinon*/
/**
 * Collections of stubs, spies and mocks.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2011 Christian Johansen
 */

(function (sinon) {
    var commonJSModule = typeof module == "object" && typeof require == "function";
    var push = [].push;

    if (!sinon && commonJSModule) {
        sinon = require("../sinon");
    }

    if (!sinon) {
        return;
    }

    function getFakes(fakeCollection) {
        if (!fakeCollection.fakes) {
            fakeCollection.fakes = [];
        }

        return fakeCollection.fakes;
    }

    function each(fakeCollection, method) {
        var fakes = getFakes(fakeCollection);

        for (var i = 0, l = fakes.length; i < l; i += 1) {
            if (typeof fakes[i][method] == "function") {
                fakes[i][method]();
            }
        }
    }

    function compact(fakeCollection) {
        var fakes = getFakes(fakeCollection);
        var i = 0;
        while (i < fakes.length) {
          fakes.splice(i, 1);
        }
    }

    var collection = {
        verify: function resolve() {
            each(this, "verify");
        },

        restore: function restore() {
            each(this, "restore");
            compact(this);
        },

        verifyAndRestore: function verifyAndRestore() {
            var exception;

            try {
                this.verify();
            } catch (e) {
                exception = e;
            }

            this.restore();

            if (exception) {
                throw exception;
            }
        },

        add: function add(fake) {
            push.call(getFakes(this), fake);
            return fake;
        },

        spy: function spy() {
            return this.add(sinon.spy.apply(sinon, arguments));
        },

        stub: function stub(object, property, value) {
            if (property) {
                var original = object[property];

                if (typeof original != "function") {
                    if (!object.hasOwnProperty(property)) {
                        throw new TypeError("Cannot stub non-existent own property " + property);
                    }

                    object[property] = value;

                    return this.add({
                        restore: function () {
                            object[property] = original;
                        }
                    });
                }
            }

            return this.add(sinon.stub.apply(sinon, arguments));
        },

        mock: function mock() {
            return this.add(sinon.mock.apply(sinon, arguments));
        },

        inject: function inject(obj) {
            var col = this;

            obj.spy = function () {
                return col.spy.apply(col, arguments);
            };

            obj.stub = function () {
                return col.stub.apply(col, arguments);
            };

            obj.mock = function () {
                return col.mock.apply(col, arguments);
            };

            return obj;
        }
    };

    if (commonJSModule) {
        module.exports = collection;
    } else {
        sinon.collection = collection;
    }
}(typeof sinon == "object" && sinon || null));

/*jslint eqeqeq: false, plusplus: false, evil: true, onevar: false, browser: true, forin: false*/
/*global module, require, window*/
/**
 * Fake timer API
 * setTimeout
 * setInterval
 * clearTimeout
 * clearInterval
 * tick
 * reset
 * Date
 *
 * Inspired by jsUnitMockTimeOut from JsUnit
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2011 Christian Johansen
 */

if (typeof sinon == "undefined") {
    var sinon = {};
}

(function (global) {
    var id = 1;

    function addTimer(args, recurring) {
        if (args.length === 0) {
            throw new Error("Function requires at least 1 parameter");
        }

        var toId = id++;
        var delay = args[1] || 0;

        if (!this.timeouts) {
            this.timeouts = {};
        }

        this.timeouts[toId] = {
            id: toId,
            func: args[0],
            callAt: this.now + delay
        };

        if (recurring === true) {
            this.timeouts[toId].interval = delay;
        }

        return toId;
    }

    function parseTime(str) {
        if (!str) {
            return 0;
        }

        var strings = str.split(":");
        var l = strings.length, i = l;
        var ms = 0, parsed;

        if (l > 3 || !/^(\d\d:){0,2}\d\d?$/.test(str)) {
            throw new Error("tick only understands numbers and 'h:m:s'");
        }

        while (i--) {
            parsed = parseInt(strings[i], 10);

            if (parsed >= 60) {
                throw new Error("Invalid time " + str);
            }

            ms += parsed * Math.pow(60, (l - i - 1));
        }

        return ms * 1000;
    }

    function createObject(object) {
        var newObject;

        if (Object.create) {
            newObject = Object.create(object);
        } else {
            var F = function () {};
            F.prototype = object;
            newObject = new F();
        }

        newObject.Date.clock = newObject;
        return newObject;
    }

    sinon.clock = {
        now: 0,

        create: function create(now) {
            var clock = createObject(this);

            if (typeof now == "number") {
                clock.now = now;
            }

            if (!!now && typeof now == "object") {
                throw new TypeError("now should be milliseconds since UNIX epoch");
            }

            return clock;
        },

        setTimeout: function setTimeout(callback, timeout) {
            return addTimer.call(this, arguments, false);
        },

        clearTimeout: function clearTimeout(timerId) {
            if (!this.timeouts) {
                this.timeouts = [];
            }

            if (timerId in this.timeouts) {
                delete this.timeouts[timerId];
            }
        },

        setInterval: function setInterval(callback, timeout) {
            return addTimer.call(this, arguments, true);
        },

        clearInterval: function clearInterval(timerId) {
            this.clearTimeout(timerId);
        },

        tick: function tick(ms) {
            ms = typeof ms == "number" ? ms : parseTime(ms);
            var tickFrom = this.now, tickTo = this.now + ms, previous = this.now;
            var timer = this.firstTimerInRange(tickFrom, tickTo);

            var firstException;
            while (timer && tickFrom <= tickTo) {
                if (this.timeouts[timer.id]) {
                    tickFrom = this.now = timer.callAt;
                    try {
                      this.callTimer(timer);
                    } catch (e) {
                      firstException = firstException || e;
                    }
                }

                timer = this.firstTimerInRange(previous, tickTo);
                previous = tickFrom;
            }

            this.now = tickTo;

            if (firstException) {
              throw firstException;
            }
        },

        firstTimerInRange: function (from, to) {
            var timer, smallest, originalTimer;

            for (var id in this.timeouts) {
                if (this.timeouts.hasOwnProperty(id)) {
                    if (this.timeouts[id].callAt < from || this.timeouts[id].callAt > to) {
                        continue;
                    }

                    if (!smallest || this.timeouts[id].callAt < smallest) {
                        originalTimer = this.timeouts[id];
                        smallest = this.timeouts[id].callAt;

                        timer = {
                            func: this.timeouts[id].func,
                            callAt: this.timeouts[id].callAt,
                            interval: this.timeouts[id].interval,
                            id: this.timeouts[id].id
                        };
                    }
                }
            }

            return timer || null;
        },

        callTimer: function (timer) {
            try {
                if (typeof timer.func == "function") {
                    timer.func.call(null);
                } else {
                    eval(timer.func);
                }
            } catch (e) {
              var exception = e;
            }

            if (!this.timeouts[timer.id]) {
                if (exception) {
                  throw exception;
                }
                return;
            }

            if (typeof timer.interval == "number") {
                this.timeouts[timer.id].callAt += timer.interval;
            } else {
                delete this.timeouts[timer.id];
            }

            if (exception) {
              throw exception;
            }
        },

        reset: function reset() {
            this.timeouts = {};
        },

        Date: (function () {
            var NativeDate = Date;

            function ClockDate(year, month, date, hour, minute, second, ms) {
                // Defensive and verbose to avoid potential harm in passing
                // explicit undefined when user does not pass argument
                switch (arguments.length) {
                case 0:
                    return new NativeDate(ClockDate.clock.now);
                case 1:
                    return new NativeDate(year);
                case 2:
                    return new NativeDate(year, month);
                case 3:
                    return new NativeDate(year, month, date);
                case 4:
                    return new NativeDate(year, month, date, hour);
                case 5:
                    return new NativeDate(year, month, date, hour, minute);
                case 6:
                    return new NativeDate(year, month, date, hour, minute, second);
                default:
                    return new NativeDate(year, month, date, hour, minute, second, ms);
                }
            }

            return mirrorDateProperties(ClockDate, NativeDate);
        }())
    };

    function mirrorDateProperties(target, source) {
        if (source.now) {
            target.now = function now() {
                return target.clock.now;
            };
        } else {
            delete target.now;
        }

        if (source.toSource) {
            target.toSource = function toSource() {
                return source.toSource();
            };
        } else {
            delete target.toSource;
        }

        target.toString = function toString() {
            return source.toString();
        };

        target.prototype = source.prototype;
        target.parse = source.parse;
        target.UTC = source.UTC;
        target.prototype.toUTCString = source.prototype.toUTCString;
        return target;
    }

    var methods = ["Date", "setTimeout", "setInterval",
                   "clearTimeout", "clearInterval"];

    function restore() {
        var method;

        for (var i = 0, l = this.methods.length; i < l; i++) {
            method = this.methods[i];
            global[method] = this["_" + method];
        }
    }

    function stubGlobal(method, clock) {
        clock["_" + method] = global[method];

        if (method == "Date") {
            var date = mirrorDateProperties(clock[method], global[method]);
            global[method] = date;
        } else {
            global[method] = function () {
                return clock[method].apply(clock, arguments);
            };

            for (var prop in clock[method]) {
                if (clock[method].hasOwnProperty(prop)) {
                    global[method][prop] = clock[method][prop];
                }
            }
        }

        global[method].clock = clock;
    }

    sinon.useFakeTimers = function useFakeTimers(now) {
        var clock = sinon.clock.create(now);
        clock.restore = restore;
        clock.methods = Array.prototype.slice.call(arguments,
                                                   typeof now == "number" ? 1 : 0);

        if (clock.methods.length === 0) {
            clock.methods = methods;
        }

        for (var i = 0, l = clock.methods.length; i < l; i++) {
            stubGlobal(clock.methods[i], clock);
        }

        return clock;
    };
}(typeof global != "undefined" && typeof global !== "function" ? global : this));

sinon.timers = {
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    setInterval: setInterval,
    clearInterval: clearInterval,
    Date: Date
};

if (typeof module == "object" && typeof require == "function") {
    module.exports = sinon;
}

/*jslint eqeqeq: false, onevar: false*/
/*global sinon, module, require, ActiveXObject, XMLHttpRequest, DOMParser*/
/**
 * Minimal Event interface implementation
 *
 * Original implementation by Sven Fuchs: https://gist.github.com/995028
 * Modifications and tests by Christian Johansen.
 *
 * @author Sven Fuchs (svenfuchs@artweb-design.de)
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2011 Sven Fuchs, Christian Johansen
 */

if (typeof sinon == "undefined") {
    this.sinon = {};
}

(function () {
    var push = [].push;

    sinon.Event = function Event(type, bubbles, cancelable) {
        this.initEvent(type, bubbles, cancelable);
    };

    sinon.Event.prototype = {
        initEvent: function(type, bubbles, cancelable) {
            this.type = type;
            this.bubbles = bubbles;
            this.cancelable = cancelable;
        },

        stopPropagation: function () {},

        preventDefault: function () {
            this.defaultPrevented = true;
        }
    };

    sinon.EventTarget = {
        addEventListener: function addEventListener(event, listener, useCapture) {
            this.eventListeners = this.eventListeners || {};
            this.eventListeners[event] = this.eventListeners[event] || [];
            push.call(this.eventListeners[event], listener);
        },

        removeEventListener: function removeEventListener(event, listener, useCapture) {
            var listeners = this.eventListeners && this.eventListeners[event] || [];

            for (var i = 0, l = listeners.length; i < l; ++i) {
                if (listeners[i] == listener) {
                    return listeners.splice(i, 1);
                }
            }
        },

        dispatchEvent: function dispatchEvent(event) {
            var type = event.type;
            var listeners = this.eventListeners && this.eventListeners[type] || [];

            for (var i = 0; i < listeners.length; i++) {
                if (typeof listeners[i] == "function") {
                    listeners[i].call(this, event);
                } else {
                    listeners[i].handleEvent(event);
                }
            }

            return !!event.defaultPrevented;
        }
    };
}());

/**
 * @depend event.js
 */
/*jslint eqeqeq: false, onevar: false*/
/*global sinon, module, require, ActiveXObject, XMLHttpRequest, DOMParser*/
/**
 * Fake XMLHttpRequest object
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2011 Christian Johansen
 */

if (typeof sinon == "undefined") {
    this.sinon = {};
}
sinon.xhr = { XMLHttpRequest: this.XMLHttpRequest };

// wrapper for global
(function(global) {
    var xhr = sinon.xhr;
    xhr.GlobalXMLHttpRequest = global.XMLHttpRequest;
    xhr.GlobalActiveXObject = global.ActiveXObject;
    xhr.supportsActiveX = typeof xhr.GlobalActiveXObject != "undefined";
    xhr.supportsXHR = typeof xhr.GlobalXMLHttpRequest != "undefined";
    xhr.workingXHR = xhr.supportsXHR ? xhr.GlobalXMLHttpRequest : xhr.supportsActiveX
                                     ? function() { return new xhr.GlobalActiveXObject("MSXML2.XMLHTTP.3.0") } : false;

    /*jsl:ignore*/
    var unsafeHeaders = {
        "Accept-Charset": true,
        "Accept-Encoding": true,
        "Connection": true,
        "Content-Length": true,
        "Cookie": true,
        "Cookie2": true,
        "Content-Transfer-Encoding": true,
        "Date": true,
        "Expect": true,
        "Host": true,
        "Keep-Alive": true,
        "Referer": true,
        "TE": true,
        "Trailer": true,
        "Transfer-Encoding": true,
        "Upgrade": true,
        "User-Agent": true,
        "Via": true
    };
    /*jsl:end*/

    function FakeXMLHttpRequest() {
        this.readyState = FakeXMLHttpRequest.UNSENT;
        this.requestHeaders = {};
        this.requestBody = null;
        this.status = 0;
        this.statusText = "";

        if (typeof FakeXMLHttpRequest.onCreate == "function") {
            FakeXMLHttpRequest.onCreate(this);
        }
    }

    function verifyState(xhr) {
        if (xhr.readyState !== FakeXMLHttpRequest.OPENED) {
            throw new Error("INVALID_STATE_ERR");
        }

        if (xhr.sendFlag) {
            throw new Error("INVALID_STATE_ERR");
        }
    }

    // filtering to enable a white-list version of Sinon FakeXhr,
    // where whitelisted requests are passed through to real XHR
    function each(collection, callback) {
        if (!collection) return;
        for (var i = 0, l = collection.length; i < l; i += 1) {
            callback(collection[i]);
        }
    }
    function some(collection, callback) {
        for (var index = 0; index < collection.length; index++) {
            if(callback(collection[index]) === true) return true;
        };
        return false;
    }
    // largest arity in XHR is 5 - XHR#open
    var apply = function(obj,method,args) {
        switch(args.length) {
        case 0: return obj[method]();
        case 1: return obj[method](args[0]);
        case 2: return obj[method](args[0],args[1]);
        case 3: return obj[method](args[0],args[1],args[2]);
        case 4: return obj[method](args[0],args[1],args[2],args[3]);
        case 5: return obj[method](args[0],args[1],args[2],args[3],args[4]);
        };
    };

    FakeXMLHttpRequest.filters = [];
    FakeXMLHttpRequest.addFilter = function(fn) {
        this.filters.push(fn)
    };
    var IE6Re = /MSIE 6/;
    FakeXMLHttpRequest.defake = function(fakeXhr,xhrArgs) {
        var xhr = new sinon.xhr.workingXHR();
        each(["open","setRequestHeader","send","abort","getResponseHeader",
              "getAllResponseHeaders","addEventListener","overrideMimeType","removeEventListener"],
             function(method) {
                 fakeXhr[method] = function() {
                   return apply(xhr,method,arguments);
                 };
             });

        var copyAttrs = function(args) {
            each(args, function(attr) {
              try {
                fakeXhr[attr] = xhr[attr]
              } catch(e) {
                if(!IE6Re.test(navigator.userAgent)) throw e;
              }
            });
        };

        var stateChange = function() {
            fakeXhr.readyState = xhr.readyState;
            if(xhr.readyState >= FakeXMLHttpRequest.HEADERS_RECEIVED) {
                copyAttrs(["status","statusText"]);
            }
            if(xhr.readyState >= FakeXMLHttpRequest.LOADING) {
                copyAttrs(["responseText"]);
            }
            if(xhr.readyState === FakeXMLHttpRequest.DONE) {
                copyAttrs(["responseXML"]);
            }
            if(fakeXhr.onreadystatechange) fakeXhr.onreadystatechange.call(fakeXhr);
        };
        if(xhr.addEventListener) {
          for(var event in fakeXhr.eventListeners) {
              if(fakeXhr.eventListeners.hasOwnProperty(event)) {
                  each(fakeXhr.eventListeners[event],function(handler) {
                      xhr.addEventListener(event, handler);
                  });
              }
          }
          xhr.addEventListener("readystatechange",stateChange);
        } else {
          xhr.onreadystatechange = stateChange;
        }
        apply(xhr,"open",xhrArgs);
    };
    FakeXMLHttpRequest.useFilters = false;

    function verifyRequestSent(xhr) {
        if (xhr.readyState == FakeXMLHttpRequest.DONE) {
            throw new Error("Request done");
        }
    }

    function verifyHeadersReceived(xhr) {
        if (xhr.async && xhr.readyState != FakeXMLHttpRequest.HEADERS_RECEIVED) {
            throw new Error("No headers received");
        }
    }

    function verifyResponseBodyType(body) {
        if (typeof body != "string") {
            var error = new Error("Attempted to respond to fake XMLHttpRequest with " +
                                 body + ", which is not a string.");
            error.name = "InvalidBodyException";
            throw error;
        }
    }

    sinon.extend(FakeXMLHttpRequest.prototype, sinon.EventTarget, {
        async: true,

        open: function open(method, url, async, username, password) {
            this.method = method;
            this.url = url;
            this.async = typeof async == "boolean" ? async : true;
            this.username = username;
            this.password = password;
            this.responseText = null;
            this.responseXML = null;
            this.requestHeaders = {};
            this.sendFlag = false;
            if(sinon.FakeXMLHttpRequest.useFilters === true) {
                var xhrArgs = arguments;
                var defake = some(FakeXMLHttpRequest.filters,function(filter) {
                    return filter.apply(this,xhrArgs)
                });
                if (defake) {
                  return sinon.FakeXMLHttpRequest.defake(this,arguments);
                }
            }
            this.readyStateChange(FakeXMLHttpRequest.OPENED);
        },

        readyStateChange: function readyStateChange(state) {
            this.readyState = state;

            if (typeof this.onreadystatechange == "function") {
                try {
                    this.onreadystatechange();
                } catch (e) {
                    sinon.logError("Fake XHR onreadystatechange handler", e);
                }
            }

            this.dispatchEvent(new sinon.Event("readystatechange"));
        },

        setRequestHeader: function setRequestHeader(header, value) {
            verifyState(this);

            if (unsafeHeaders[header] || /^(Sec-|Proxy-)/.test(header)) {
                throw new Error("Refused to set unsafe header \"" + header + "\"");
            }

            if (this.requestHeaders[header]) {
                this.requestHeaders[header] += "," + value;
            } else {
                this.requestHeaders[header] = value;
            }
        },

        // Helps testing
        setResponseHeaders: function setResponseHeaders(headers) {
            this.responseHeaders = {};

            for (var header in headers) {
                if (headers.hasOwnProperty(header)) {
                    this.responseHeaders[header] = headers[header];
                }
            }

            if (this.async) {
                this.readyStateChange(FakeXMLHttpRequest.HEADERS_RECEIVED);
            }
        },

        // Currently treats ALL data as a DOMString (i.e. no Document)
        send: function send(data) {
            verifyState(this);

            if (!/^(get|head)$/i.test(this.method)) {
                if (this.requestHeaders["Content-Type"]) {
                    var value = this.requestHeaders["Content-Type"].split(";");
                    this.requestHeaders["Content-Type"] = value[0] + ";charset=utf-8";
                } else {
                    this.requestHeaders["Content-Type"] = "text/plain;charset=utf-8";
                }

                this.requestBody = data;
            }

            this.errorFlag = false;
            this.sendFlag = this.async;
            this.readyStateChange(FakeXMLHttpRequest.OPENED);

            if (typeof this.onSend == "function") {
                this.onSend(this);
            }
        },

        abort: function abort() {
            this.aborted = true;
            this.responseText = null;
            this.errorFlag = true;
            this.requestHeaders = {};

            if (this.readyState > sinon.FakeXMLHttpRequest.UNSENT && this.sendFlag) {
                this.readyStateChange(sinon.FakeXMLHttpRequest.DONE);
                this.sendFlag = false;
            }

            this.readyState = sinon.FakeXMLHttpRequest.UNSENT;
        },

        getResponseHeader: function getResponseHeader(header) {
            if (this.readyState < FakeXMLHttpRequest.HEADERS_RECEIVED) {
                return null;
            }

            if (/^Set-Cookie2?$/i.test(header)) {
                return null;
            }

            header = header.toLowerCase();

            for (var h in this.responseHeaders) {
                if (h.toLowerCase() == header) {
                    return this.responseHeaders[h];
                }
            }

            return null;
        },

        getAllResponseHeaders: function getAllResponseHeaders() {
            if (this.readyState < FakeXMLHttpRequest.HEADERS_RECEIVED) {
                return "";
            }

            var headers = "";

            for (var header in this.responseHeaders) {
                if (this.responseHeaders.hasOwnProperty(header) &&
                    !/^Set-Cookie2?$/i.test(header)) {
                    headers += header + ": " + this.responseHeaders[header] + "\r\n";
                }
            }

            return headers;
        },

        setResponseBody: function setResponseBody(body) {
            verifyRequestSent(this);
            verifyHeadersReceived(this);
            verifyResponseBodyType(body);

            var chunkSize = this.chunkSize || 10;
            var index = 0;
            this.responseText = "";

            do {
                if (this.async) {
                    this.readyStateChange(FakeXMLHttpRequest.LOADING);
                }

                this.responseText += body.substring(index, index + chunkSize);
                index += chunkSize;
            } while (index < body.length);

            var type = this.getResponseHeader("Content-Type");

            if (this.responseText &&
                (!type || /(text\/xml)|(application\/xml)|(\+xml)/.test(type))) {
                try {
                    this.responseXML = FakeXMLHttpRequest.parseXML(this.responseText);
                } catch (e) {
                    // Unable to parse XML - no biggie
                }
            }

            if (this.async) {
                this.readyStateChange(FakeXMLHttpRequest.DONE);
            } else {
                this.readyState = FakeXMLHttpRequest.DONE;
            }
        },

        respond: function respond(status, headers, body) {
            this.setResponseHeaders(headers || {});
            this.status = typeof status == "number" ? status : 200;
            this.statusText = FakeXMLHttpRequest.statusCodes[this.status];
            this.setResponseBody(body || "");
        }
    });

    sinon.extend(FakeXMLHttpRequest, {
        UNSENT: 0,
        OPENED: 1,
        HEADERS_RECEIVED: 2,
        LOADING: 3,
        DONE: 4
    });

    // Borrowed from JSpec
    FakeXMLHttpRequest.parseXML = function parseXML(text) {
        var xmlDoc;

        if (typeof DOMParser != "undefined") {
            var parser = new DOMParser();
            xmlDoc = parser.parseFromString(text, "text/xml");
        } else {
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = "false";
            xmlDoc.loadXML(text);
        }

        return xmlDoc;
    };

    FakeXMLHttpRequest.statusCodes = {
        100: "Continue",
        101: "Switching Protocols",
        200: "OK",
        201: "Created",
        202: "Accepted",
        203: "Non-Authoritative Information",
        204: "No Content",
        205: "Reset Content",
        206: "Partial Content",
        300: "Multiple Choice",
        301: "Moved Permanently",
        302: "Found",
        303: "See Other",
        304: "Not Modified",
        305: "Use Proxy",
        307: "Temporary Redirect",
        400: "Bad Request",
        401: "Unauthorized",
        402: "Payment Required",
        403: "Forbidden",
        404: "Not Found",
        405: "Method Not Allowed",
        406: "Not Acceptable",
        407: "Proxy Authentication Required",
        408: "Request Timeout",
        409: "Conflict",
        410: "Gone",
        411: "Length Required",
        412: "Precondition Failed",
        413: "Request Entity Too Large",
        414: "Request-URI Too Long",
        415: "Unsupported Media Type",
        416: "Requested Range Not Satisfiable",
        417: "Expectation Failed",
        422: "Unprocessable Entity",
        500: "Internal Server Error",
        501: "Not Implemented",
        502: "Bad Gateway",
        503: "Service Unavailable",
        504: "Gateway Timeout",
        505: "HTTP Version Not Supported"
    };

    sinon.useFakeXMLHttpRequest = function () {
        sinon.FakeXMLHttpRequest.restore = function restore(keepOnCreate) {
            if (xhr.supportsXHR) {
                global.XMLHttpRequest = xhr.GlobalXMLHttpRequest;
            }

            if (xhr.supportsActiveX) {
                global.ActiveXObject = xhr.GlobalActiveXObject;
            }

            delete sinon.FakeXMLHttpRequest.restore;

            if (keepOnCreate !== true) {
                delete sinon.FakeXMLHttpRequest.onCreate;
            }
        };
        if (xhr.supportsXHR) {
            global.XMLHttpRequest = sinon.FakeXMLHttpRequest;
        }

        if (xhr.supportsActiveX) {
            global.ActiveXObject = function ActiveXObject(objId) {
                if (objId == "Microsoft.XMLHTTP" || /^Msxml2\.XMLHTTP/i.test(objId)) {

                    return new sinon.FakeXMLHttpRequest();
                }

                return new xhr.GlobalActiveXObject(objId);
            };
        }

        return sinon.FakeXMLHttpRequest;
    };

    sinon.FakeXMLHttpRequest = FakeXMLHttpRequest;
})(this);

if (typeof module == "object" && typeof require == "function") {
    module.exports = sinon;
}

/**
 * @depend fake_xml_http_request.js
 */
/*jslint eqeqeq: false, onevar: false, regexp: false, plusplus: false*/
/*global module, require, window*/
/**
 * The Sinon "server" mimics a web server that receives requests from
 * sinon.FakeXMLHttpRequest and provides an API to respond to those requests,
 * both synchronously and asynchronously. To respond synchronuously, canned
 * answers have to be provided upfront.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2011 Christian Johansen
 */

if (typeof sinon == "undefined") {
    var sinon = {};
}

sinon.fakeServer = (function () {
    var push = [].push;
    function F() {}

    function create(proto) {
        F.prototype = proto;
        return new F();
    }

    function responseArray(handler) {
        var response = handler;

        if (Object.prototype.toString.call(handler) != "[object Array]") {
            response = [200, {}, handler];
        }

        if (typeof response[2] != "string") {
            throw new TypeError("Fake server response body should be string, but was " +
                                typeof response[2]);
        }

        return response;
    }

    var wloc = window.location;
    var rCurrLoc = new RegExp("^" + wloc.protocol + "//" + wloc.host);

    function matchOne(response, reqMethod, reqUrl) {
        var rmeth = response.method;
        var matchMethod = !rmeth || rmeth.toLowerCase() == reqMethod.toLowerCase();
        var url = response.url;
        var matchUrl = !url || url == reqUrl || (typeof url.test == "function" && url.test(reqUrl));

        return matchMethod && matchUrl;
    }

    function match(response, request) {
        var requestMethod = this.getHTTPMethod(request);
        var requestUrl = request.url;

        if (!/^https?:\/\//.test(requestUrl) || rCurrLoc.test(requestUrl)) {
            requestUrl = requestUrl.replace(rCurrLoc, "");
        }

        if (matchOne(response, this.getHTTPMethod(request), requestUrl)) {
            if (typeof response.response == "function") {
                var ru = response.url;
                var args = [request].concat(!ru ? [] : requestUrl.match(ru).slice(1));
                return response.response.apply(response, args);
            }

            return true;
        }

        return false;
    }

    return {
        create: function () {
            var server = create(this);
            this.xhr = sinon.useFakeXMLHttpRequest();
            server.requests = [];

            this.xhr.onCreate = function (xhrObj) {
                server.addRequest(xhrObj);
            };

            return server;
        },

        addRequest: function addRequest(xhrObj) {
            var server = this;
            push.call(this.requests, xhrObj);

            xhrObj.onSend = function () {
                server.handleRequest(this);
            };

            if (this.autoRespond && !this.responding) {
                setTimeout(function () {
                    server.responding = false;
                    server.respond();
                }, this.autoRespondAfter || 10);

                this.responding = true;
            }
        },

        getHTTPMethod: function getHTTPMethod(request) {
            if (this.fakeHTTPMethods && /post/i.test(request.method)) {
                var matches = (request.requestBody || "").match(/_method=([^\b;]+)/);
                return !!matches ? matches[1] : request.method;
            }

            return request.method;
        },

        handleRequest: function handleRequest(xhr) {
            if (xhr.async) {
                if (!this.queue) {
                    this.queue = [];
                }

                push.call(this.queue, xhr);
            } else {
                this.processRequest(xhr);
            }
        },

        respondWith: function respondWith(method, url, body) {
            if (arguments.length == 1 && typeof method != "function") {
                this.response = responseArray(method);
                return;
            }

            if (!this.responses) { this.responses = []; }

            if (arguments.length == 1) {
                body = method;
                url = method = null;
            }

            if (arguments.length == 2) {
                body = url;
                url = method;
                method = null;
            }

            push.call(this.responses, {
                method: method,
                url: url,
                response: typeof body == "function" ? body : responseArray(body)
            });
        },

        respond: function respond() {
            if (arguments.length > 0) this.respondWith.apply(this, arguments);
            var queue = this.queue || [];
            var request;

            while(request = queue.shift()) {
                this.processRequest(request);
            }
        },

        processRequest: function processRequest(request) {
            try {
                if (request.aborted) {
                    return;
                }

                var response = this.response || [404, {}, ""];

                if (this.responses) {
                    for (var i = 0, l = this.responses.length; i < l; i++) {
                        if (match.call(this, this.responses[i], request)) {
                            response = this.responses[i].response;
                            break;
                        }
                    }
                }

                if (request.readyState != 4) {
                    request.respond(response[0], response[1], response[2]);
                }
            } catch (e) {
                sinon.logError("Fake server request processing", e);
            }
        },

        restore: function restore() {
            return this.xhr.restore && this.xhr.restore.apply(this.xhr, arguments);
        }
    };
}());

if (typeof module == "object" && typeof require == "function") {
    module.exports = sinon;
}

/**
 * @depend fake_server.js
 * @depend fake_timers.js
 */
/*jslint browser: true, eqeqeq: false, onevar: false*/
/*global sinon*/
/**
 * Add-on for sinon.fakeServer that automatically handles a fake timer along with
 * the FakeXMLHttpRequest. The direct inspiration for this add-on is jQuery
 * 1.3.x, which does not use xhr object's onreadystatehandler at all - instead,
 * it polls the object for completion with setInterval. Dispite the direct
 * motivation, there is nothing jQuery-specific in this file, so it can be used
 * in any environment where the ajax implementation depends on setInterval or
 * setTimeout.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2011 Christian Johansen
 */

(function () {
    function Server() {}
    Server.prototype = sinon.fakeServer;

    sinon.fakeServerWithClock = new Server();

    sinon.fakeServerWithClock.addRequest = function addRequest(xhr) {
        if (xhr.async) {
            if (typeof setTimeout.clock == "object") {
                this.clock = setTimeout.clock;
            } else {
                this.clock = sinon.useFakeTimers();
                this.resetClock = true;
            }

            if (!this.longestTimeout) {
                var clockSetTimeout = this.clock.setTimeout;
                var clockSetInterval = this.clock.setInterval;
                var server = this;

                this.clock.setTimeout = function (fn, timeout) {
                    server.longestTimeout = Math.max(timeout, server.longestTimeout || 0);

                    return clockSetTimeout.apply(this, arguments);
                };

                this.clock.setInterval = function (fn, timeout) {
                    server.longestTimeout = Math.max(timeout, server.longestTimeout || 0);

                    return clockSetInterval.apply(this, arguments);
                };
            }
        }

        return sinon.fakeServer.addRequest.call(this, xhr);
    };

    sinon.fakeServerWithClock.respond = function respond() {
        var returnVal = sinon.fakeServer.respond.apply(this, arguments);

        if (this.clock) {
            this.clock.tick(this.longestTimeout || 0);
            this.longestTimeout = 0;

            if (this.resetClock) {
                this.clock.restore();
                this.resetClock = false;
            }
        }

        return returnVal;
    };

    sinon.fakeServerWithClock.restore = function restore() {
        if (this.clock) {
            this.clock.restore();
        }

        return sinon.fakeServer.restore.apply(this, arguments);
    };
}());

/**
 * @depend ../sinon.js
 * @depend collection.js
 * @depend util/fake_timers.js
 * @depend util/fake_server_with_clock.js
 */
/*jslint eqeqeq: false, onevar: false, plusplus: false*/
/*global require, module*/
/**
 * Manages fake collections as well as fake utilities such as Sinon's
 * timers and fake XHR implementation in one convenient object.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2011 Christian Johansen
 */

if (typeof module == "object" && typeof require == "function") {
    var sinon = require("../sinon");
    sinon.extend(sinon, require("./util/fake_timers"));
}

(function () {
    var push = [].push;

    function exposeValue(sandbox, config, key, value) {
        if (!value) {
            return;
        }

        if (config.injectInto) {
            config.injectInto[key] = value;
        } else {
            push.call(sandbox.args, value);
        }
    }

    function prepareSandboxFromConfig(config) {
        var sandbox = sinon.create(sinon.sandbox);

        if (config.useFakeServer) {
            if (typeof config.useFakeServer == "object") {
                sandbox.serverPrototype = config.useFakeServer;
            }

            sandbox.useFakeServer();
        }

        if (config.useFakeTimers) {
            if (typeof config.useFakeTimers == "object") {
                sandbox.useFakeTimers.apply(sandbox, config.useFakeTimers);
            } else {
                sandbox.useFakeTimers();
            }
        }

        return sandbox;
    }

    sinon.sandbox = sinon.extend(sinon.create(sinon.collection), {
        useFakeTimers: function useFakeTimers() {
            this.clock = sinon.useFakeTimers.apply(sinon, arguments);

            return this.add(this.clock);
        },

        serverPrototype: sinon.fakeServer,

        useFakeServer: function useFakeServer() {
            var proto = this.serverPrototype || sinon.fakeServer;

            if (!proto || !proto.create) {
                return null;
            }

            this.server = proto.create();
            return this.add(this.server);
        },

        inject: function (obj) {
            sinon.collection.inject.call(this, obj);

            if (this.clock) {
                obj.clock = this.clock;
            }

            if (this.server) {
                obj.server = this.server;
                obj.requests = this.server.requests;
            }

            return obj;
        },

        create: function (config) {
            if (!config) {
                return sinon.create(sinon.sandbox);
            }

            var sandbox = prepareSandboxFromConfig(config);
            sandbox.args = sandbox.args || [];
            var prop, value, exposed = sandbox.inject({});

            if (config.properties) {
                for (var i = 0, l = config.properties.length; i < l; i++) {
                    prop = config.properties[i];
                    value = exposed[prop] || prop == "sandbox" && sandbox;
                    exposeValue(sandbox, config, prop, value);
                }
            } else {
                exposeValue(sandbox, config, "sandbox", value);
            }

            return sandbox;
        }
    });

    sinon.sandbox.useFakeXMLHttpRequest = sinon.sandbox.useFakeServer;

    if (typeof module == "object" && typeof require == "function") {
        module.exports = sinon.sandbox;
    }
}());

/**
 * @depend ../sinon.js
 * @depend stub.js
 * @depend mock.js
 * @depend sandbox.js
 */
/*jslint eqeqeq: false, onevar: false, forin: true, plusplus: false*/
/*global module, require, sinon*/
/**
 * Test function, sandboxes fakes
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2011 Christian Johansen
 */

(function (sinon) {
    var commonJSModule = typeof module == "object" && typeof require == "function";

    if (!sinon && commonJSModule) {
        sinon = require("../sinon");
    }

    if (!sinon) {
        return;
    }

    function test(callback) {
        var type = typeof callback;

        if (type != "function") {
            throw new TypeError("sinon.test needs to wrap a test function, got " + type);
        }

        return function () {
            var config = sinon.getConfig(sinon.config);
            config.injectInto = config.injectIntoThis && this || config.injectInto;
            var sandbox = sinon.sandbox.create(config);
            var exception, result;
            var args = Array.prototype.slice.call(arguments).concat(sandbox.args);

            try {
                result = callback.apply(this, args);
            } finally {
                sandbox.verifyAndRestore();
            }

            return result;
        };
    }

    test.config = {
        injectIntoThis: true,
        injectInto: null,
        properties: ["spy", "stub", "mock", "clock", "server", "requests"],
        useFakeTimers: true,
        useFakeServer: true
    };

    if (commonJSModule) {
        module.exports = test;
    } else {
        sinon.test = test;
    }
}(typeof sinon == "object" && sinon || null));

/**
 * @depend ../sinon.js
 * @depend test.js
 */
/*jslint eqeqeq: false, onevar: false, eqeqeq: false*/
/*global module, require, sinon*/
/**
 * Test case, sandboxes all test functions
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2011 Christian Johansen
 */

(function (sinon) {
    var commonJSModule = typeof module == "object" && typeof require == "function";

    if (!sinon && commonJSModule) {
        sinon = require("../sinon");
    }

    if (!sinon || !Object.prototype.hasOwnProperty) {
        return;
    }

    function createTest(property, setUp, tearDown) {
        return function () {
            if (setUp) {
                setUp.apply(this, arguments);
            }

            var exception, result;

            try {
                result = property.apply(this, arguments);
            } catch (e) {
                exception = e;
            }

            if (tearDown) {
                tearDown.apply(this, arguments);
            }

            if (exception) {
                throw exception;
            }

            return result;
        };
    }

    function testCase(tests, prefix) {
        /*jsl:ignore*/
        if (!tests || typeof tests != "object") {
            throw new TypeError("sinon.testCase needs an object with test functions");
        }
        /*jsl:end*/

        prefix = prefix || "test";
        var rPrefix = new RegExp("^" + prefix);
        var methods = {}, testName, property, method;
        var setUp = tests.setUp;
        var tearDown = tests.tearDown;

        for (testName in tests) {
            if (tests.hasOwnProperty(testName)) {
                property = tests[testName];

                if (/^(setUp|tearDown)$/.test(testName)) {
                    continue;
                }

                if (typeof property == "function" && rPrefix.test(testName)) {
                    method = property;

                    if (setUp || tearDown) {
                        method = createTest(property, setUp, tearDown);
                    }

                    methods[testName] = sinon.test(method);
                } else {
                    methods[testName] = tests[testName];
                }
            }
        }

        return methods;
    }

    if (commonJSModule) {
        module.exports = testCase;
    } else {
        sinon.testCase = testCase;
    }
}(typeof sinon == "object" && sinon || null));

/**
 * @depend ../sinon.js
 * @depend stub.js
 */
/*jslint eqeqeq: false, onevar: false, nomen: false, plusplus: false*/
/*global module, require, sinon*/
/**
 * Assertions matching the test spy retrieval interface.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2011 Christian Johansen
 */

(function (sinon, global) {
    var commonJSModule = typeof module == "object" && typeof require == "function";
    var slice = Array.prototype.slice;
    var assert;

    if (!sinon && commonJSModule) {
        sinon = require("../sinon");
    }

    if (!sinon) {
        return;
    }

    function verifyIsStub() {
        var method;

        for (var i = 0, l = arguments.length; i < l; ++i) {
            method = arguments[i];

            if (!method) {
                assert.fail("fake is not a spy");
            }

            if (typeof method != "function") {
                assert.fail(method + " is not a function");
            }

            if (typeof method.getCall != "function") {
                assert.fail(method + " is not stubbed");
            }
        }
    }

    function failAssertion(object, msg) {
        object = object || global;
        var failMethod = object.fail || assert.fail;
        failMethod.call(object, msg);
    }

    function mirrorPropAsAssertion(name, method, message) {
        if (arguments.length == 2) {
            message = method;
            method = name;
        }

        assert[name] = function (fake) {
            verifyIsStub(fake);

            var args = slice.call(arguments, 1);
            var failed = false;

            if (typeof method == "function") {
                failed = !method(fake);
            } else {
                failed = typeof fake[method] == "function" ?
                    !fake[method].apply(fake, args) : !fake[method];
            }

            if (failed) {
                failAssertion(this, fake.printf.apply(fake, [message].concat(args)));
            } else {
                assert.pass(name);
            }
        };
    }

    function exposedName(prefix, prop) {
        return !prefix || /^fail/.test(prop) ? prop :
            prefix + prop.slice(0, 1).toUpperCase() + prop.slice(1);
    };

    assert = {
        failException: "AssertError",

        fail: function fail(message) {
            var error = new Error(message);
            error.name = this.failException || assert.failException;

            throw error;
        },

        pass: function pass(assertion) {},

        callOrder: function assertCallOrder() {
            verifyIsStub.apply(null, arguments);
            var expected = "", actual = "";

            if (!sinon.calledInOrder(arguments)) {
                try {
                    expected = [].join.call(arguments, ", ");
                    actual = sinon.orderByFirstCall(slice.call(arguments)).join(", ");
                } catch (e) {
                    // If this fails, we'll just fall back to the blank string
                }

                failAssertion(this, "expected " + expected + " to be " +
                              "called in order but were called as " + actual);
            } else {
                assert.pass("callOrder");
            }
        },

        callCount: function assertCallCount(method, count) {
            verifyIsStub(method);

            if (method.callCount != count) {
                var msg = "expected %n to be called " + sinon.timesInWords(count) +
                    " but was called %c%C";
                failAssertion(this, method.printf(msg));
            } else {
                assert.pass("callCount");
            }
        },

        expose: function expose(target, options) {
            if (!target) {
                throw new TypeError("target is null or undefined");
            }

            var o = options || {};
            var prefix = typeof o.prefix == "undefined" && "assert" || o.prefix;
            var includeFail = typeof o.includeFail == "undefined" || !!o.includeFail;

            for (var method in this) {
                if (method != "export" && (includeFail || !/^(fail)/.test(method))) {
                    target[exposedName(prefix, method)] = this[method];
                }
            }

            return target;
        }
    };

    mirrorPropAsAssertion("called", "expected %n to have been called at least once but was never called");
    mirrorPropAsAssertion("notCalled", function (spy) { return !spy.called; },
                          "expected %n to not have been called but was called %c%C");
    mirrorPropAsAssertion("calledOnce", "expected %n to be called once but was called %c%C");
    mirrorPropAsAssertion("calledTwice", "expected %n to be called twice but was called %c%C");
    mirrorPropAsAssertion("calledThrice", "expected %n to be called thrice but was called %c%C");
    mirrorPropAsAssertion("calledOn", "expected %n to be called with %1 as this but was called with %t");
    mirrorPropAsAssertion("alwaysCalledOn", "expected %n to always be called with %1 as this but was called with %t");
    mirrorPropAsAssertion("calledWith", "expected %n to be called with arguments %*%C");
    mirrorPropAsAssertion("alwaysCalledWith", "expected %n to always be called with arguments %*%C");
    mirrorPropAsAssertion("calledWithExactly", "expected %n to be called with exact arguments %*%C");
    mirrorPropAsAssertion("alwaysCalledWithExactly", "expected %n to always be called with exact arguments %*%C");
    mirrorPropAsAssertion("neverCalledWith", "expected %n to never be called with arguments %*%C");
    mirrorPropAsAssertion("threw", "%n did not throw exception%C");
    mirrorPropAsAssertion("alwaysThrew", "%n did not always throw exception%C");

    if (commonJSModule) {
        module.exports = assert;
    } else {
        sinon.assert = assert;
    }
}(typeof sinon == "object" && sinon || null, typeof window != "undefined" ? window : global));

return sinon;}.call(typeof window != 'undefined' && window || {}));
/*!
 * MockJax - jQuery Plugin to Mock Ajax requests
 *
 * Version:  1.5.1
 * Released:
 * Home:   http://github.com/appendto/jquery-mockjax
 * Author:   Jonathan Sharp (http://jdsharp.com)
 * License:  MIT,GPL
 *
 * Copyright (c) 2011 appendTo LLC.
 * Dual licensed under the MIT or GPL licenses.
 * http://appendto.com/open-source-licenses
 */
(function($) {
	var _ajax = $.ajax,
		mockHandlers = [],
		CALLBACK_REGEX = /=\?(&|$)/,
		jsc = (new Date()).getTime();


	// Parse the given XML string.
	function parseXML(xml) {
		if ( window['DOMParser'] == undefined && window.ActiveXObject ) {
			DOMParser = function() { };
			DOMParser.prototype.parseFromString = function( xmlString ) {
				var doc = new ActiveXObject('Microsoft.XMLDOM');
				doc.async = 'false';
				doc.loadXML( xmlString );
				return doc;
			};
		}

		try {
			var xmlDoc 	= ( new DOMParser() ).parseFromString( xml, 'text/xml' );
			if ( $.isXMLDoc( xmlDoc ) ) {
				var err = $('parsererror', xmlDoc);
				if ( err.length == 1 ) {
					throw('Error: ' + $(xmlDoc).text() );
				}
			} else {
				throw('Unable to parse XML');
			}
		} catch( e ) {
			var msg = ( e.name == undefined ? e : e.name + ': ' + e.message );
			$(document).trigger('xmlParseError', [ msg ]);
			return undefined;
		}
		return xmlDoc;
	}

	// Trigger a jQuery event
	function trigger(s, type, args) {
		(s.context ? $(s.context) : $.event).trigger(type, args);
	}

	// Check if the data field on the mock handler and the request match. This
	// can be used to restrict a mock handler to being used only when a certain
	// set of data is passed to it.
	function isMockDataEqual( mock, live ) {
		var identical = false;
		// Test for situations where the data is a querystring (not an object)
		if (typeof live === 'string') {
			// Querystring may be a regex
			return $.isFunction( mock.test ) ? mock.test(live) : mock == live;
		}
		$.each(mock, function(k, v) {
			if ( live[k] === undefined ) {
				identical = false;
				return identical;
			} else {
				identical = true;
				if ( typeof live[k] == 'object' ) {
					return isMockDataEqual(mock[k], live[k]);
				} else {
					if ( $.isFunction( mock[k].test ) ) {
						identical = mock[k].test(live[k]);
					} else {
						identical = ( mock[k] == live[k] );
					}
					return identical;
				}
			}
		});

		return identical;
	}

	// Check the given handler should mock the given request
	function getMockForRequest( handler, requestSettings ) {
		// If the mock was registered with a function, let the function decide if we
		// want to mock this request
		if ( $.isFunction(handler) ) {
			return handler( requestSettings );
		}

		// Inspect the URL of the request and check if the mock handler's url
		// matches the url for this ajax request
		if ( $.isFunction(handler.url.test) ) {
			// The user provided a regex for the url, test it
			if ( !handler.url.test( requestSettings.url ) ) {
				return null;
			}
		} else {
			// Look for a simple wildcard '*' or a direct URL match
			var star = handler.url.indexOf('*');
			if (handler.url !== requestSettings.url && star === -1 ||
					!new RegExp(handler.url.replace(/[-[\]{}()+?.,\\^$|#\s]/g, "\\$&").replace('*', '.+')).test(requestSettings.url)) {
				return null;
			}
		}

		// Inspect the data submitted in the request (either POST body or GET query string)
		if ( handler.data && requestSettings.data ) {
			if ( !isMockDataEqual(handler.data, requestSettings.data) ) {
				// They're not identical, do not mock this request
				return null;
			}
		}
		// Inspect the request type
		if ( handler && handler.type &&
				 handler.type.toLowerCase() != requestSettings.type.toLowerCase() ) {
			// The request type doesn't match (GET vs. POST)
			return null;
		}

		return handler;
	}

	// If logging is enabled, log the mock to the console
	function logMock( mockHandler, requestSettings ) {
		var c = $.extend({}, $.mockjaxSettings, mockHandler);
		if ( c.log && $.isFunction(c.log) ) {
			c.log('MOCK ' + requestSettings.type.toUpperCase() + ': ' + requestSettings.url, $.extend({}, requestSettings));
		}
	}

	// Process the xhr objects send operation
	function _xhrSend(mockHandler, requestSettings, origSettings) {

		// This is a substitute for < 1.4 which lacks $.proxy
		var process = (function(that) {
			return function() {
				return (function() {
					// The request has returned
					this.status 		= mockHandler.status;
					this.statusText		= mockHandler.statusText;
					this.readyState 	= 4;

					// We have an executable function, call it to give
					// the mock handler a chance to update it's data
					if ( $.isFunction(mockHandler.response) ) {
						mockHandler.response(origSettings);
					}
					// Copy over our mock to our xhr object before passing control back to
					// jQuery's onreadystatechange callback
					if ( requestSettings.dataType == 'json' && ( typeof mockHandler.responseText == 'object' ) ) {
						this.responseText = JSON.stringify(mockHandler.responseText);
					} else if ( requestSettings.dataType == 'xml' ) {
						if ( typeof mockHandler.responseXML == 'string' ) {
							this.responseXML = parseXML(mockHandler.responseXML);
						} else {
							this.responseXML = mockHandler.responseXML;
						}
					} else {
						this.responseText = mockHandler.responseText;
					}
					if( typeof mockHandler.status == 'number' || typeof mockHandler.status == 'string' ) {
						this.status = mockHandler.status;
					}
					if( typeof mockHandler.statusText === "string") {
						this.statusText = mockHandler.statusText;
					}
					// jQuery < 1.4 doesn't have onreadystate change for xhr
					if ( $.isFunction(this.onreadystatechange) ) {
						if( mockHandler.isTimeout) {
							this.status = -1;
						}
						this.onreadystatechange( mockHandler.isTimeout ? 'timeout' : undefined );
					} else if ( mockHandler.isTimeout ) {
						// Fix for 1.3.2 timeout to keep success from firing.
						this.status = -1;
					}
				}).apply(that);
			};
		})(this);

		if ( mockHandler.proxy ) {
			// We're proxying this request and loading in an external file instead
			_ajax({
				global: false,
				url: mockHandler.proxy,
				type: mockHandler.proxyType,
				data: mockHandler.data,
				dataType: requestSettings.dataType === "script" ? "text/plain" : requestSettings.dataType,
				complete: function(xhr, txt) {
					mockHandler.responseXML = xhr.responseXML;
					mockHandler.responseText = xhr.responseText;
					mockHandler.status = xhr.status;
					mockHandler.statusText = xhr.statusText;
					this.responseTimer = setTimeout(process, mockHandler.responseTime || 0);
				}
			});
		} else {
			// type == 'POST' || 'GET' || 'DELETE'
			if ( requestSettings.async === false ) {
				// TODO: Blocking delay
				process();
			} else {
				this.responseTimer = setTimeout(process, mockHandler.responseTime || 50);
			}
		}
	}

	// Construct a mocked XHR Object
	function xhr(mockHandler, requestSettings, origSettings, origHandler) {
		// Extend with our default mockjax settings
		mockHandler = $.extend({}, $.mockjaxSettings, mockHandler);

		if (typeof mockHandler.headers === 'undefined') {
			mockHandler.headers = {};
		}
		if ( mockHandler.contentType ) {
			mockHandler.headers['content-type'] = mockHandler.contentType;
		}

		return {
			status: mockHandler.status,
			statusText: mockHandler.statusText,
			readyState: 1,
			open: function() { },
			send: function() {
				origHandler.fired = true;
				_xhrSend.call(this, mockHandler, requestSettings, origSettings);
			},
			abort: function() {
				clearTimeout(this.responseTimer);
			},
			setRequestHeader: function(header, value) {
				mockHandler.headers[header] = value;
			},
			getResponseHeader: function(header) {
				// 'Last-modified', 'Etag', 'content-type' are all checked by jQuery
				if ( mockHandler.headers && mockHandler.headers[header] ) {
					// Return arbitrary headers
					return mockHandler.headers[header];
				} else if ( header.toLowerCase() == 'last-modified' ) {
					return mockHandler.lastModified || (new Date()).toString();
				} else if ( header.toLowerCase() == 'etag' ) {
					return mockHandler.etag || '';
				} else if ( header.toLowerCase() == 'content-type' ) {
					return mockHandler.contentType || 'text/plain';
				}
			},
			getAllResponseHeaders: function() {
				var headers = '';
				$.each(mockHandler.headers, function(k, v) {
					headers += k + ': ' + v + "\n";
				});
				return headers;
			}
		};
	}

	// Process a JSONP mock request.
	function processJsonpMock( requestSettings, mockHandler, origSettings ) {
		// Handle JSONP Parameter Callbacks, we need to replicate some of the jQuery core here
		// because there isn't an easy hook for the cross domain script tag of jsonp

		processJsonpUrl( requestSettings );

		requestSettings.dataType = "json";
		if(requestSettings.data && CALLBACK_REGEX.test(requestSettings.data) || CALLBACK_REGEX.test(requestSettings.url)) {
			createJsonpCallback(requestSettings, mockHandler);

			// We need to make sure
			// that a JSONP style response is executed properly

			var rurl = /^(\w+:)?\/\/([^\/?#]+)/,
				parts = rurl.exec( requestSettings.url ),
				remote = parts && (parts[1] && parts[1] !== location.protocol || parts[2] !== location.host);

			requestSettings.dataType = "script";
			if(requestSettings.type.toUpperCase() === "GET" && remote ) {
				var newMockReturn = processJsonpRequest( requestSettings, mockHandler, origSettings );

				// Check if we are supposed to return a Deferred back to the mock call, or just
				// signal success
				if(newMockReturn) {
					return newMockReturn;
				} else {
					return true;
				}
			}
		}
		return null;
	}

	// Append the required callback parameter to the end of the request URL, for a JSONP request
	function processJsonpUrl( requestSettings ) {
		if ( requestSettings.type.toUpperCase() === "GET" ) {
			if ( !CALLBACK_REGEX.test( requestSettings.url ) ) {
				requestSettings.url += (/\?/.test( requestSettings.url ) ? "&" : "?") +
					(requestSettings.jsonp || "callback") + "=?";
			}
		} else if ( !requestSettings.data || !CALLBACK_REGEX.test(requestSettings.data) ) {
			requestSettings.data = (requestSettings.data ? requestSettings.data + "&" : "") + (requestSettings.jsonp || "callback") + "=?";
		}
	}

	// Process a JSONP request by evaluating the mocked response text
	function processJsonpRequest( requestSettings, mockHandler, origSettings ) {
		// Synthesize the mock request for adding a script tag
		var callbackContext = origSettings && origSettings.context || requestSettings,
			newMock = null;


		// If the response handler on the moock is a function, call it
		if ( mockHandler.response && $.isFunction(mockHandler.response) ) {
			mockHandler.response(origSettings);
		} else {

			// Evaluate the responseText javascript in a global context
			if( typeof mockHandler.responseText === 'object' ) {
				$.globalEval( '(' + JSON.stringify( mockHandler.responseText ) + ')');
			} else {
				$.globalEval( '(' + mockHandler.responseText + ')');
			}
		}

		// Successful response
		jsonpSuccess( requestSettings, mockHandler );
		jsonpComplete( requestSettings, mockHandler );

		// If we are running under jQuery 1.5+, return a deferred object
		if($.Deferred){
			newMock = new $.Deferred();
			if(typeof mockHandler.responseText == "object"){
				newMock.resolveWith( callbackContext, [mockHandler.responseText] );
			}
			else{
				newMock.resolveWith( callbackContext, [$.parseJSON( mockHandler.responseText )] );
			}
		}
		return newMock;
	}


	// Create the required JSONP callback function for the request
	function createJsonpCallback( requestSettings, mockHandler ) {
		jsonp = requestSettings.jsonpCallback || ("jsonp" + jsc++);

		// Replace the =? sequence both in the query string and the data
		if ( requestSettings.data ) {
			requestSettings.data = (requestSettings.data + "").replace(CALLBACK_REGEX, "=" + jsonp + "$1");
		}

		requestSettings.url = requestSettings.url.replace(CALLBACK_REGEX, "=" + jsonp + "$1");


		// Handle JSONP-style loading
		window[ jsonp ] = window[ jsonp ] || function( tmp ) {
			data = tmp;
			jsonpSuccess( requestSettings, mockHandler );
			jsonpComplete( requestSettings, mockHandler );
			// Garbage collect
			window[ jsonp ] = undefined;

			try {
				delete window[ jsonp ];
			} catch(e) {}

			if ( head ) {
				head.removeChild( script );
			}
		};
	}

	// The JSONP request was successful
	function jsonpSuccess(requestSettings, mockHandler) {
		// If a local callback was specified, fire it and pass it the data
		if ( requestSettings.success ) {
			requestSettings.success.call( callbackContext, ( mockHandler.response ? mockHandler.response.toString() : mockHandler.responseText || ''), status, {} );
		}

		// Fire the global callback
		if ( requestSettings.global ) {
			trigger(requestSettings, "ajaxSuccess", [{}, requestSettings] );
		}
	}

	// The JSONP request was completed
	function jsonpComplete(requestSettings, mockHandler) {
		// Process result
		if ( requestSettings.complete ) {
			requestSettings.complete.call( callbackContext, {} , status );
		}

		// The request was completed
		if ( requestSettings.global ) {
			trigger( "ajaxComplete", [{}, requestSettings] );
		}

		// Handle the global AJAX counter
		if ( requestSettings.global && ! --$.active ) {
			$.event.trigger( "ajaxStop" );
		}
	}


	// The core $.ajax replacement.
	function handleAjax( url, origSettings ) {
		var mockRequest, requestSettings, mockHandler;

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			origSettings = url;
			url = undefined;
		} else {
			// work around to support 1.5 signature
			origSettings.url = url;
		}

		// Extend the original settings for the request
		requestSettings = $.extend(true, {}, $.ajaxSettings, origSettings);

		// Iterate over our mock handlers (in registration order) until we find
		// one that is willing to intercept the request
		for(var k = 0; k < mockHandlers.length; k++) {
			if ( !mockHandlers[k] ) {
				continue;
			}

			mockHandler = getMockForRequest( mockHandlers[k], requestSettings );
			if(!mockHandler) {
				// No valid mock found for this request
				continue;
			}

			// Handle console logging
			logMock( mockHandler, requestSettings );


			if ( requestSettings.dataType === "jsonp" ) {
				if ((mockRequest = processJsonpMock( requestSettings, mockHandler, origSettings ))) {
					// This mock will handle the JSONP request
					return mockRequest;
				}
			}


			// Removed to fix #54 - keep the mocking data object intact
			//mockHandler.data = requestSettings.data;

			mockHandler.cache = requestSettings.cache;
			mockHandler.timeout = requestSettings.timeout;
			mockHandler.global = requestSettings.global;

			(function(mockHandler, requestSettings, origSettings, origHandler) {
				mockRequest = _ajax.call($, $.extend(true, {}, origSettings, {
					// Mock the XHR object
					xhr: function() { return xhr( mockHandler, requestSettings, origSettings, origHandler ) }
				}));
			})(mockHandler, requestSettings, origSettings, mockHandlers[k]);

			return mockRequest;
		}

		// We don't have a mock request, trigger a normal request
		return _ajax.apply($, [origSettings]);
	}


	// Public

	$.extend({
		ajax: handleAjax
	});

	$.mockjaxSettings = {
		//url:        null,
		//type:       'GET',
		log:          function( msg ) {
			if ( window[ 'console' ] && window.console.log ) {
				window.console.log.apply( console, arguments );
			}
		},
		status:       200,
		statusText:   "OK",
		responseTime: 500,
		isTimeout:    false,
		contentType:  'text/plain',
		response:     '',
		responseText: '',
		responseXML:  '',
		proxy:        '',
		proxyType:    'GET',

		lastModified: null,
		etag:         '',
		headers: {
			etag: 'IJF@H#@923uf8023hFO@I#H#',
			'content-type' : 'text/plain'
		}
	};

	$.mockjax = function(settings) {
		var i = mockHandlers.length;
		mockHandlers[i] = settings;
		return i;
	};
	$.mockjaxClear = function(i) {
		if ( arguments.length == 1 ) {
			mockHandlers[i] = null;
		} else {
			mockHandlers = [];
		}
	};
	$.mockjax.handler = function(i) {
	  if ( arguments.length == 1 ) {
			return mockHandlers[i];
		}
	};
})(jQuery);
/**
 * QUnit v1.12.0 - A JavaScript Unit Testing Framework
 *
 * http://qunitjs.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * https://jquery.org/license/
 */

(function( window ) {

var QUnit,
	assert,
	config,
	onErrorFnPrev,
	testId = 0,
	fileName = (sourceFromStacktrace( 0 ) || "" ).replace(/(:\d+)+\)?/, "").replace(/.+\//, ""),
	toString = Object.prototype.toString,
	hasOwn = Object.prototype.hasOwnProperty,
	// Keep a local reference to Date (GH-283)
	Date = window.Date,
	setTimeout = window.setTimeout,
	defined = {
		setTimeout: typeof window.setTimeout !== "undefined",
		sessionStorage: (function() {
			var x = "qunit-test-string";
			try {
				sessionStorage.setItem( x, x );
				sessionStorage.removeItem( x );
				return true;
			} catch( e ) {
				return false;
			}
		}())
	},
	/**
	 * Provides a normalized error string, correcting an issue
	 * with IE 7 (and prior) where Error.prototype.toString is
	 * not properly implemented
	 *
	 * Based on http://es5.github.com/#x15.11.4.4
	 *
	 * @param {String|Error} error
	 * @return {String} error message
	 */
	errorString = function( error ) {
		var name, message,
			errorString = error.toString();
		if ( errorString.substring( 0, 7 ) === "[object" ) {
			name = error.name ? error.name.toString() : "Error";
			message = error.message ? error.message.toString() : "";
			if ( name && message ) {
				return name + ": " + message;
			} else if ( name ) {
				return name;
			} else if ( message ) {
				return message;
			} else {
				return "Error";
			}
		} else {
			return errorString;
		}
	},
	/**
	 * Makes a clone of an object using only Array or Object as base,
	 * and copies over the own enumerable properties.
	 *
	 * @param {Object} obj
	 * @return {Object} New object with only the own properties (recursively).
	 */
	objectValues = function( obj ) {
		// Grunt 0.3.x uses an older version of jshint that still has jshint/jshint#392.
		/*jshint newcap: false */
		var key, val,
			vals = QUnit.is( "array", obj ) ? [] : {};
		for ( key in obj ) {
			if ( hasOwn.call( obj, key ) ) {
				val = obj[key];
				vals[key] = val === Object(val) ? objectValues(val) : val;
			}
		}
		return vals;
	};

function Test( settings ) {
	extend( this, settings );
	this.assertions = [];
	this.testNumber = ++Test.count;
}

Test.count = 0;

Test.prototype = {
	init: function() {
		var a, b, li,
			tests = id( "qunit-tests" );

		if ( tests ) {
			b = document.createElement( "strong" );
			b.innerHTML = this.nameHtml;

			// `a` initialized at top of scope
			a = document.createElement( "a" );
			a.innerHTML = "Rerun";
			a.href = QUnit.url({ testNumber: this.testNumber });

			li = document.createElement( "li" );
			li.appendChild( b );
			li.appendChild( a );
			li.className = "running";
			li.id = this.id = "qunit-test-output" + testId++;

			tests.appendChild( li );
		}
	},
	setup: function() {
		if (
			// Emit moduleStart when we're switching from one module to another
			this.module !== config.previousModule ||
				// They could be equal (both undefined) but if the previousModule property doesn't
				// yet exist it means this is the first test in a suite that isn't wrapped in a
				// module, in which case we'll just emit a moduleStart event for 'undefined'.
				// Without this, reporters can get testStart before moduleStart  which is a problem.
				!hasOwn.call( config, "previousModule" )
		) {
			if ( hasOwn.call( config, "previousModule" ) ) {
				runLoggingCallbacks( "moduleDone", QUnit, {
					name: config.previousModule,
					failed: config.moduleStats.bad,
					passed: config.moduleStats.all - config.moduleStats.bad,
					total: config.moduleStats.all
				});
			}
			config.previousModule = this.module;
			config.moduleStats = { all: 0, bad: 0 };
			runLoggingCallbacks( "moduleStart", QUnit, {
				name: this.module
			});
		}

		config.current = this;

		this.testEnvironment = extend({
			setup: function() {},
			teardown: function() {}
		}, this.moduleTestEnvironment );

		this.started = +new Date();
		runLoggingCallbacks( "testStart", QUnit, {
			name: this.testName,
			module: this.module
		});

		/*jshint camelcase:false */


		/**
		 * Expose the current test environment.
		 *
		 * @deprecated since 1.12.0: Use QUnit.config.current.testEnvironment instead.
		 */
		QUnit.current_testEnvironment = this.testEnvironment;

		/*jshint camelcase:true */

		if ( !config.pollution ) {
			saveGlobal();
		}
		if ( config.notrycatch ) {
			this.testEnvironment.setup.call( this.testEnvironment, QUnit.assert );
			return;
		}
		try {
			this.testEnvironment.setup.call( this.testEnvironment, QUnit.assert );
		} catch( e ) {
			QUnit.pushFailure( "Setup failed on " + this.testName + ": " + ( e.message || e ), extractStacktrace( e, 1 ) );
		}
	},
	run: function() {
		config.current = this;

		var running = id( "qunit-testresult" );

		if ( running ) {
			running.innerHTML = "Running: <br/>" + this.nameHtml;
		}

		if ( this.async ) {
			QUnit.stop();
		}

		this.callbackStarted = +new Date();

		if ( config.notrycatch ) {
			this.callback.call( this.testEnvironment, QUnit.assert );
			this.callbackRuntime = +new Date() - this.callbackStarted;
			return;
		}

		try {
			this.callback.call( this.testEnvironment, QUnit.assert );
			this.callbackRuntime = +new Date() - this.callbackStarted;
		} catch( e ) {
			this.callbackRuntime = +new Date() - this.callbackStarted;

			QUnit.pushFailure( "Died on test #" + (this.assertions.length + 1) + " " + this.stack + ": " + ( e.message || e ), extractStacktrace( e, 0 ) );
			// else next test will carry the responsibility
			saveGlobal();

			// Restart the tests if they're blocking
			if ( config.blocking ) {
				QUnit.start();
			}
		}
	},
	teardown: function() {
		config.current = this;
		if ( config.notrycatch ) {
			if ( typeof this.callbackRuntime === "undefined" ) {
				this.callbackRuntime = +new Date() - this.callbackStarted;
			}
			this.testEnvironment.teardown.call( this.testEnvironment, QUnit.assert );
			return;
		} else {
			try {
				this.testEnvironment.teardown.call( this.testEnvironment, QUnit.assert );
			} catch( e ) {
				QUnit.pushFailure( "Teardown failed on " + this.testName + ": " + ( e.message || e ), extractStacktrace( e, 1 ) );
			}
		}
		checkPollution();
	},
	finish: function() {
		config.current = this;
		if ( config.requireExpects && this.expected === null ) {
			QUnit.pushFailure( "Expected number of assertions to be defined, but expect() was not called.", this.stack );
		} else if ( this.expected !== null && this.expected !== this.assertions.length ) {
			QUnit.pushFailure( "Expected " + this.expected + " assertions, but " + this.assertions.length + " were run", this.stack );
		} else if ( this.expected === null && !this.assertions.length ) {
			QUnit.pushFailure( "Expected at least one assertion, but none were run - call expect(0) to accept zero assertions.", this.stack );
		}

		var i, assertion, a, b, time, li, ol,
			test = this,
			good = 0,
			bad = 0,
			tests = id( "qunit-tests" );

		this.runtime = +new Date() - this.started;
		config.stats.all += this.assertions.length;
		config.moduleStats.all += this.assertions.length;

		if ( tests ) {
			ol = document.createElement( "ol" );
			ol.className = "qunit-assert-list";

			for ( i = 0; i < this.assertions.length; i++ ) {
				assertion = this.assertions[i];

				li = document.createElement( "li" );
				li.className = assertion.result ? "pass" : "fail";
				li.innerHTML = assertion.message || ( assertion.result ? "okay" : "failed" );
				ol.appendChild( li );

				if ( assertion.result ) {
					good++;
				} else {
					bad++;
					config.stats.bad++;
					config.moduleStats.bad++;
				}
			}

			// store result when possible
			if ( QUnit.config.reorder && defined.sessionStorage ) {
				if ( bad ) {
					sessionStorage.setItem( "qunit-test-" + this.module + "-" + this.testName, bad );
				} else {
					sessionStorage.removeItem( "qunit-test-" + this.module + "-" + this.testName );
				}
			}

			if ( bad === 0 ) {
				addClass( ol, "qunit-collapsed" );
			}

			// `b` initialized at top of scope
			b = document.createElement( "strong" );
			b.innerHTML = this.nameHtml + " <b class='counts'>(<b class='failed'>" + bad + "</b>, <b class='passed'>" + good + "</b>, " + this.assertions.length + ")</b>";

			addEvent(b, "click", function() {
				var next = b.parentNode.lastChild,
					collapsed = hasClass( next, "qunit-collapsed" );
				( collapsed ? removeClass : addClass )( next, "qunit-collapsed" );
			});

			addEvent(b, "dblclick", function( e ) {
				var target = e && e.target ? e.target : window.event.srcElement;
				if ( target.nodeName.toLowerCase() === "span" || target.nodeName.toLowerCase() === "b" ) {
					target = target.parentNode;
				}
				if ( window.location && target.nodeName.toLowerCase() === "strong" ) {
					window.location = QUnit.url({ testNumber: test.testNumber });
				}
			});

			// `time` initialized at top of scope
			time = document.createElement( "span" );
			time.className = "runtime";
			time.innerHTML = this.runtime + " ms";

			// `li` initialized at top of scope
			li = id( this.id );
			li.className = bad ? "fail" : "pass";
			li.removeChild( li.firstChild );
			a = li.firstChild;
			li.appendChild( b );
			li.appendChild( a );
			li.appendChild( time );
			li.appendChild( ol );

		} else {
			for ( i = 0; i < this.assertions.length; i++ ) {
				if ( !this.assertions[i].result ) {
					bad++;
					config.stats.bad++;
					config.moduleStats.bad++;
				}
			}
		}

		runLoggingCallbacks( "testDone", QUnit, {
			name: this.testName,
			module: this.module,
			failed: bad,
			passed: this.assertions.length - bad,
			total: this.assertions.length,
			duration: this.runtime
		});

		QUnit.reset();

		config.current = undefined;
	},

	queue: function() {
		var bad,
			test = this;

		synchronize(function() {
			test.init();
		});
		function run() {
			// each of these can by async
			synchronize(function() {
				test.setup();
			});
			synchronize(function() {
				test.run();
			});
			synchronize(function() {
				test.teardown();
			});
			synchronize(function() {
				test.finish();
			});
		}

		// `bad` initialized at top of scope
		// defer when previous test run passed, if storage is available
		bad = QUnit.config.reorder && defined.sessionStorage &&
						+sessionStorage.getItem( "qunit-test-" + this.module + "-" + this.testName );

		if ( bad ) {
			run();
		} else {
			synchronize( run, true );
		}
	}
};

// Root QUnit object.
// `QUnit` initialized at top of scope
QUnit = {

	// call on start of module test to prepend name to all tests
	module: function( name, testEnvironment ) {
		config.currentModule = name;
		config.currentModuleTestEnvironment = testEnvironment;
		config.modules[name] = true;
	},

	asyncTest: function( testName, expected, callback ) {
		if ( arguments.length === 2 ) {
			callback = expected;
			expected = null;
		}

		QUnit.test( testName, expected, callback, true );
	},

	test: function( testName, expected, callback, async ) {
		var test,
			nameHtml = "<span class='test-name'>" + escapeText( testName ) + "</span>";

		if ( arguments.length === 2 ) {
			callback = expected;
			expected = null;
		}

		if ( config.currentModule ) {
			nameHtml = "<span class='module-name'>" + escapeText( config.currentModule ) + "</span>: " + nameHtml;
		}

		test = new Test({
			nameHtml: nameHtml,
			testName: testName,
			expected: expected,
			async: async,
			callback: callback,
			module: config.currentModule,
			moduleTestEnvironment: config.currentModuleTestEnvironment,
			stack: sourceFromStacktrace( 2 )
		});

		if ( !validTest( test ) ) {
			return;
		}

		test.queue();
	},

	// Specify the number of expected assertions to guarantee that failed test (no assertions are run at all) don't slip through.
	expect: function( asserts ) {
		if (arguments.length === 1) {
			config.current.expected = asserts;
		} else {
			return config.current.expected;
		}
	},

	start: function( count ) {
		// QUnit hasn't been initialized yet.
		// Note: RequireJS (et al) may delay onLoad
		if ( config.semaphore === undefined ) {
			QUnit.begin(function() {
				// This is triggered at the top of QUnit.load, push start() to the event loop, to allow QUnit.load to finish first
				setTimeout(function() {
					QUnit.start( count );
				});
			});
			return;
		}

		config.semaphore -= count || 1;
		// don't start until equal number of stop-calls
		if ( config.semaphore > 0 ) {
			return;
		}
		// ignore if start is called more often then stop
		if ( config.semaphore < 0 ) {
			config.semaphore = 0;
			QUnit.pushFailure( "Called start() while already started (QUnit.config.semaphore was 0 already)", null, sourceFromStacktrace(2) );
			return;
		}
		// A slight delay, to avoid any current callbacks
		if ( defined.setTimeout ) {
			setTimeout(function() {
				if ( config.semaphore > 0 ) {
					return;
				}
				if ( config.timeout ) {
					clearTimeout( config.timeout );
				}

				config.blocking = false;
				process( true );
			}, 13);
		} else {
			config.blocking = false;
			process( true );
		}
	},

	stop: function( count ) {
		config.semaphore += count || 1;
		config.blocking = true;

		if ( config.testTimeout && defined.setTimeout ) {
			clearTimeout( config.timeout );
			config.timeout = setTimeout(function() {
				QUnit.ok( false, "Test timed out" );
				config.semaphore = 1;
				QUnit.start();
			}, config.testTimeout );
		}
	}
};

// `assert` initialized at top of scope
// Assert helpers
// All of these must either call QUnit.push() or manually do:
// - runLoggingCallbacks( "log", .. );
// - config.current.assertions.push({ .. });
// We attach it to the QUnit object *after* we expose the public API,
// otherwise `assert` will become a global variable in browsers (#341).
assert = {
	/**
	 * Asserts rough true-ish result.
	 * @name ok
	 * @function
	 * @example ok( "asdfasdf".length > 5, "There must be at least 5 chars" );
	 */
	ok: function( result, msg ) {
		if ( !config.current ) {
			throw new Error( "ok() assertion outside test context, was " + sourceFromStacktrace(2) );
		}
		result = !!result;
		msg = msg || (result ? "okay" : "failed" );

		var source,
			details = {
				module: config.current.module,
				name: config.current.testName,
				result: result,
				message: msg
			};

		msg = "<span class='test-message'>" + escapeText( msg ) + "</span>";

		if ( !result ) {
			source = sourceFromStacktrace( 2 );
			if ( source ) {
				details.source = source;
				msg += "<table><tr class='test-source'><th>Source: </th><td><pre>" + escapeText( source ) + "</pre></td></tr></table>";
			}
		}
		runLoggingCallbacks( "log", QUnit, details );
		config.current.assertions.push({
			result: result,
			message: msg
		});
	},

	/**
	 * Assert that the first two arguments are equal, with an optional message.
	 * Prints out both actual and expected values.
	 * @name equal
	 * @function
	 * @example equal( format( "Received {0} bytes.", 2), "Received 2 bytes.", "format() replaces {0} with next argument" );
	 */
	equal: function( actual, expected, message ) {
		/*jshint eqeqeq:false */
		QUnit.push( expected == actual, actual, expected, message );
	},

	/**
	 * @name notEqual
	 * @function
	 */
	notEqual: function( actual, expected, message ) {
		/*jshint eqeqeq:false */
		QUnit.push( expected != actual, actual, expected, message );
	},

	/**
	 * @name propEqual
	 * @function
	 */
	propEqual: function( actual, expected, message ) {
		actual = objectValues(actual);
		expected = objectValues(expected);
		QUnit.push( QUnit.equiv(actual, expected), actual, expected, message );
	},

	/**
	 * @name notPropEqual
	 * @function
	 */
	notPropEqual: function( actual, expected, message ) {
		actual = objectValues(actual);
		expected = objectValues(expected);
		QUnit.push( !QUnit.equiv(actual, expected), actual, expected, message );
	},

	/**
	 * @name deepEqual
	 * @function
	 */
	deepEqual: function( actual, expected, message ) {
		QUnit.push( QUnit.equiv(actual, expected), actual, expected, message );
	},

	/**
	 * @name notDeepEqual
	 * @function
	 */
	notDeepEqual: function( actual, expected, message ) {
		QUnit.push( !QUnit.equiv(actual, expected), actual, expected, message );
	},

	/**
	 * @name strictEqual
	 * @function
	 */
	strictEqual: function( actual, expected, message ) {
		QUnit.push( expected === actual, actual, expected, message );
	},

	/**
	 * @name notStrictEqual
	 * @function
	 */
	notStrictEqual: function( actual, expected, message ) {
		QUnit.push( expected !== actual, actual, expected, message );
	},

	"throws": function( block, expected, message ) {
		var actual,
			expectedOutput = expected,
			ok = false;

		// 'expected' is optional
		if ( typeof expected === "string" ) {
			message = expected;
			expected = null;
		}

		config.current.ignoreGlobalErrors = true;
		try {
			block.call( config.current.testEnvironment );
		} catch (e) {
			actual = e;
		}
		config.current.ignoreGlobalErrors = false;

		if ( actual ) {
			// we don't want to validate thrown error
			if ( !expected ) {
				ok = true;
				expectedOutput = null;
			// expected is a regexp
			} else if ( QUnit.objectType( expected ) === "regexp" ) {
				ok = expected.test( errorString( actual ) );
			// expected is a constructor
			} else if ( actual instanceof expected ) {
				ok = true;
			// expected is a validation function which returns true is validation passed
			} else if ( expected.call( {}, actual ) === true ) {
				expectedOutput = null;
				ok = true;
			}

			QUnit.push( ok, actual, expectedOutput, message );
		} else {
			QUnit.pushFailure( message, null, "No exception was thrown." );
		}
	}
};

/**
 * @deprecated since 1.8.0
 * Kept assertion helpers in root for backwards compatibility.
 */
extend( QUnit, assert );

/**
 * @deprecated since 1.9.0
 * Kept root "raises()" for backwards compatibility.
 * (Note that we don't introduce assert.raises).
 */
QUnit.raises = assert[ "throws" ];

/**
 * @deprecated since 1.0.0, replaced with error pushes since 1.3.0
 * Kept to avoid TypeErrors for undefined methods.
 */
QUnit.equals = function() {
	QUnit.push( false, false, false, "QUnit.equals has been deprecated since 2009 (e88049a0), use QUnit.equal instead" );
};
QUnit.same = function() {
	QUnit.push( false, false, false, "QUnit.same has been deprecated since 2009 (e88049a0), use QUnit.deepEqual instead" );
};

// We want access to the constructor's prototype
(function() {
	function F() {}
	F.prototype = QUnit;
	QUnit = new F();
	// Make F QUnit's constructor so that we can add to the prototype later
	QUnit.constructor = F;
}());

/**
 * Config object: Maintain internal state
 * Later exposed as QUnit.config
 * `config` initialized at top of scope
 */
config = {
	// The queue of tests to run
	queue: [],

	// block until document ready
	blocking: true,

	// when enabled, show only failing tests
	// gets persisted through sessionStorage and can be changed in UI via checkbox
	hidepassed: false,

	// by default, run previously failed tests first
	// very useful in combination with "Hide passed tests" checked
	reorder: true,

	// by default, modify document.title when suite is done
	altertitle: true,

	// when enabled, all tests must call expect()
	requireExpects: false,

	// add checkboxes that are persisted in the query-string
	// when enabled, the id is set to `true` as a `QUnit.config` property
	urlConfig: [
		{
			id: "noglobals",
			label: "Check for Globals",
			tooltip: "Enabling this will test if any test introduces new properties on the `window` object. Stored as query-strings."
		},
		{
			id: "notrycatch",
			label: "No try-catch",
			tooltip: "Enabling this will run tests outside of a try-catch block. Makes debugging exceptions in IE reasonable. Stored as query-strings."
		}
	],

	// Set of all modules.
	modules: {},

	// logging callback queues
	begin: [],
	done: [],
	log: [],
	testStart: [],
	testDone: [],
	moduleStart: [],
	moduleDone: []
};

// Export global variables, unless an 'exports' object exists,
// in that case we assume we're in CommonJS (dealt with on the bottom of the script)
if ( typeof exports === "undefined" ) {
	extend( window, QUnit.constructor.prototype );

	// Expose QUnit object
	window.QUnit = QUnit;
}

// Initialize more QUnit.config and QUnit.urlParams
(function() {
	var i,
		location = window.location || { search: "", protocol: "file:" },
		params = location.search.slice( 1 ).split( "&" ),
		length = params.length,
		urlParams = {},
		current;

	if ( params[ 0 ] ) {
		for ( i = 0; i < length; i++ ) {
			current = params[ i ].split( "=" );
			current[ 0 ] = decodeURIComponent( current[ 0 ] );
			// allow just a key to turn on a flag, e.g., test.html?noglobals
			current[ 1 ] = current[ 1 ] ? decodeURIComponent( current[ 1 ] ) : true;
			urlParams[ current[ 0 ] ] = current[ 1 ];
		}
	}

	QUnit.urlParams = urlParams;

	// String search anywhere in moduleName+testName
	config.filter = urlParams.filter;

	// Exact match of the module name
	config.module = urlParams.module;

	config.testNumber = parseInt( urlParams.testNumber, 10 ) || null;

	// Figure out if we're running the tests from a server or not
	QUnit.isLocal = location.protocol === "file:";
}());

// Extend QUnit object,
// these after set here because they should not be exposed as global functions
extend( QUnit, {
	assert: assert,

	config: config,

	// Initialize the configuration options
	init: function() {
		extend( config, {
			stats: { all: 0, bad: 0 },
			moduleStats: { all: 0, bad: 0 },
			started: +new Date(),
			updateRate: 1000,
			blocking: false,
			autostart: true,
			autorun: false,
			filter: "",
			queue: [],
			semaphore: 1
		});

		var tests, banner, result,
			qunit = id( "qunit" );

		if ( qunit ) {
			qunit.innerHTML =
				"<h1 id='qunit-header'>" + escapeText( document.title ) + "</h1>" +
				"<h2 id='qunit-banner'></h2>" +
				"<div id='qunit-testrunner-toolbar'></div>" +
				"<h2 id='qunit-userAgent'></h2>" +
				"<ol id='qunit-tests'></ol>";
		}

		tests = id( "qunit-tests" );
		banner = id( "qunit-banner" );
		result = id( "qunit-testresult" );

		if ( tests ) {
			tests.innerHTML = "";
		}

		if ( banner ) {
			banner.className = "";
		}

		if ( result ) {
			result.parentNode.removeChild( result );
		}

		if ( tests ) {
			result = document.createElement( "p" );
			result.id = "qunit-testresult";
			result.className = "result";
			tests.parentNode.insertBefore( result, tests );
			result.innerHTML = "Running...<br/>&nbsp;";
		}
	},

	// Resets the test setup. Useful for tests that modify the DOM.
	/*
	DEPRECATED: Use multiple tests instead of resetting inside a test.
	Use testStart or testDone for custom cleanup.
	This method will throw an error in 2.0, and will be removed in 2.1
	*/
	reset: function() {
		var fixture = id( "qunit-fixture" );
		if ( fixture ) {
			fixture.innerHTML = config.fixture;
		}
	},

	// Trigger an event on an element.
	// @example triggerEvent( document.body, "click" );
	triggerEvent: function( elem, type, event ) {
		if ( document.createEvent ) {
			event = document.createEvent( "MouseEvents" );
			event.initMouseEvent(type, true, true, elem.ownerDocument.defaultView,
				0, 0, 0, 0, 0, false, false, false, false, 0, null);

			elem.dispatchEvent( event );
		} else if ( elem.fireEvent ) {
			elem.fireEvent( "on" + type );
		}
	},

	// Safe object type checking
	is: function( type, obj ) {
		return QUnit.objectType( obj ) === type;
	},

	objectType: function( obj ) {
		if ( typeof obj === "undefined" ) {
				return "undefined";
		// consider: typeof null === object
		}
		if ( obj === null ) {
				return "null";
		}

		var match = toString.call( obj ).match(/^\[object\s(.*)\]$/),
			type = match && match[1] || "";

		switch ( type ) {
			case "Number":
				if ( isNaN(obj) ) {
					return "nan";
				}
				return "number";
			case "String":
			case "Boolean":
			case "Array":
			case "Date":
			case "RegExp":
			case "Function":
				return type.toLowerCase();
		}
		if ( typeof obj === "object" ) {
			return "object";
		}
		return undefined;
	},

	push: function( result, actual, expected, message ) {
		if ( !config.current ) {
			throw new Error( "assertion outside test context, was " + sourceFromStacktrace() );
		}

		var output, source,
			details = {
				module: config.current.module,
				name: config.current.testName,
				result: result,
				message: message,
				actual: actual,
				expected: expected
			};

		message = escapeText( message ) || ( result ? "okay" : "failed" );
		message = "<span class='test-message'>" + message + "</span>";
		output = message;

		if ( !result ) {
			expected = escapeText( QUnit.jsDump.parse(expected) );
			actual = escapeText( QUnit.jsDump.parse(actual) );
			output += "<table><tr class='test-expected'><th>Expected: </th><td><pre>" + expected + "</pre></td></tr>";

			if ( actual !== expected ) {
				output += "<tr class='test-actual'><th>Result: </th><td><pre>" + actual + "</pre></td></tr>";
				output += "<tr class='test-diff'><th>Diff: </th><td><pre>" + QUnit.diff( expected, actual ) + "</pre></td></tr>";
			}

			source = sourceFromStacktrace();

			if ( source ) {
				details.source = source;
				output += "<tr class='test-source'><th>Source: </th><td><pre>" + escapeText( source ) + "</pre></td></tr>";
			}

			output += "</table>";
		}

		runLoggingCallbacks( "log", QUnit, details );

		config.current.assertions.push({
			result: !!result,
			message: output
		});
	},

	pushFailure: function( message, source, actual ) {
		if ( !config.current ) {
			throw new Error( "pushFailure() assertion outside test context, was " + sourceFromStacktrace(2) );
		}

		var output,
			details = {
				module: config.current.module,
				name: config.current.testName,
				result: false,
				message: message
			};

		message = escapeText( message ) || "error";
		message = "<span class='test-message'>" + message + "</span>";
		output = message;

		output += "<table>";

		if ( actual ) {
			output += "<tr class='test-actual'><th>Result: </th><td><pre>" + escapeText( actual ) + "</pre></td></tr>";
		}

		if ( source ) {
			details.source = source;
			output += "<tr class='test-source'><th>Source: </th><td><pre>" + escapeText( source ) + "</pre></td></tr>";
		}

		output += "</table>";

		runLoggingCallbacks( "log", QUnit, details );

		config.current.assertions.push({
			result: false,
			message: output
		});
	},

	url: function( params ) {
		params = extend( extend( {}, QUnit.urlParams ), params );
		var key,
			querystring = "?";

		for ( key in params ) {
			if ( hasOwn.call( params, key ) ) {
				querystring += encodeURIComponent( key ) + "=" +
					encodeURIComponent( params[ key ] ) + "&";
			}
		}
		return window.location.protocol + "//" + window.location.host +
			window.location.pathname + querystring.slice( 0, -1 );
	},

	extend: extend,
	id: id,
	addEvent: addEvent,
	addClass: addClass,
	hasClass: hasClass,
	removeClass: removeClass
	// load, equiv, jsDump, diff: Attached later
});

/**
 * @deprecated: Created for backwards compatibility with test runner that set the hook function
 * into QUnit.{hook}, instead of invoking it and passing the hook function.
 * QUnit.constructor is set to the empty F() above so that we can add to it's prototype here.
 * Doing this allows us to tell if the following methods have been overwritten on the actual
 * QUnit object.
 */
extend( QUnit.constructor.prototype, {

	// Logging callbacks; all receive a single argument with the listed properties
	// run test/logs.html for any related changes
	begin: registerLoggingCallback( "begin" ),

	// done: { failed, passed, total, runtime }
	done: registerLoggingCallback( "done" ),

	// log: { result, actual, expected, message }
	log: registerLoggingCallback( "log" ),

	// testStart: { name }
	testStart: registerLoggingCallback( "testStart" ),

	// testDone: { name, failed, passed, total, duration }
	testDone: registerLoggingCallback( "testDone" ),

	// moduleStart: { name }
	moduleStart: registerLoggingCallback( "moduleStart" ),

	// moduleDone: { name, failed, passed, total }
	moduleDone: registerLoggingCallback( "moduleDone" )
});

if ( typeof document === "undefined" || document.readyState === "complete" ) {
	config.autorun = true;
}

QUnit.load = function() {
	runLoggingCallbacks( "begin", QUnit, {} );

	// Initialize the config, saving the execution queue
	var banner, filter, i, label, len, main, ol, toolbar, userAgent, val,
		urlConfigCheckboxesContainer, urlConfigCheckboxes, moduleFilter,
		numModules = 0,
		moduleNames = [],
		moduleFilterHtml = "",
		urlConfigHtml = "",
		oldconfig = extend( {}, config );

	QUnit.init();
	extend(config, oldconfig);

	config.blocking = false;

	len = config.urlConfig.length;

	for ( i = 0; i < len; i++ ) {
		val = config.urlConfig[i];
		if ( typeof val === "string" ) {
			val = {
				id: val,
				label: val,
				tooltip: "[no tooltip available]"
			};
		}
		config[ val.id ] = QUnit.urlParams[ val.id ];
		urlConfigHtml += "<input id='qunit-urlconfig-" + escapeText( val.id ) +
			"' name='" + escapeText( val.id ) +
			"' type='checkbox'" + ( config[ val.id ] ? " checked='checked'" : "" ) +
			" title='" + escapeText( val.tooltip ) +
			"'><label for='qunit-urlconfig-" + escapeText( val.id ) +
			"' title='" + escapeText( val.tooltip ) + "'>" + val.label + "</label>";
	}
	for ( i in config.modules ) {
		if ( config.modules.hasOwnProperty( i ) ) {
			moduleNames.push(i);
		}
	}
	numModules = moduleNames.length;
	moduleNames.sort( function( a, b ) {
		return a.localeCompare( b );
	});
	moduleFilterHtml += "<label for='qunit-modulefilter'>Module: </label><select id='qunit-modulefilter' name='modulefilter'><option value='' " +
		( config.module === undefined  ? "selected='selected'" : "" ) +
		">< All Modules ></option>";


	for ( i = 0; i < numModules; i++) {
			moduleFilterHtml += "<option value='" + escapeText( encodeURIComponent(moduleNames[i]) ) + "' " +
				( config.module === moduleNames[i] ? "selected='selected'" : "" ) +
				">" + escapeText(moduleNames[i]) + "</option>";
	}
	moduleFilterHtml += "</select>";

	// `userAgent` initialized at top of scope
	userAgent = id( "qunit-userAgent" );
	if ( userAgent ) {
		userAgent.innerHTML = navigator.userAgent;
	}

	// `banner` initialized at top of scope
	banner = id( "qunit-header" );
	if ( banner ) {
		banner.innerHTML = "<a href='" + QUnit.url({ filter: undefined, module: undefined, testNumber: undefined }) + "'>" + banner.innerHTML + "</a> ";
	}

	// `toolbar` initialized at top of scope
	toolbar = id( "qunit-testrunner-toolbar" );
	if ( toolbar ) {
		// `filter` initialized at top of scope
		filter = document.createElement( "input" );
		filter.type = "checkbox";
		filter.id = "qunit-filter-pass";

		addEvent( filter, "click", function() {
			var tmp,
				ol = document.getElementById( "qunit-tests" );

			if ( filter.checked ) {
				ol.className = ol.className + " hidepass";
			} else {
				tmp = " " + ol.className.replace( /[\n\t\r]/g, " " ) + " ";
				ol.className = tmp.replace( / hidepass /, " " );
			}
			if ( defined.sessionStorage ) {
				if (filter.checked) {
					sessionStorage.setItem( "qunit-filter-passed-tests", "true" );
				} else {
					sessionStorage.removeItem( "qunit-filter-passed-tests" );
				}
			}
		});

		if ( config.hidepassed || defined.sessionStorage && sessionStorage.getItem( "qunit-filter-passed-tests" ) ) {
			filter.checked = true;
			// `ol` initialized at top of scope
			ol = document.getElementById( "qunit-tests" );
			ol.className = ol.className + " hidepass";
		}
		toolbar.appendChild( filter );

		// `label` initialized at top of scope
		label = document.createElement( "label" );
		label.setAttribute( "for", "qunit-filter-pass" );
		label.setAttribute( "title", "Only show tests and assertions that fail. Stored in sessionStorage." );
		label.innerHTML = "Hide passed tests";
		toolbar.appendChild( label );

		urlConfigCheckboxesContainer = document.createElement("span");
		urlConfigCheckboxesContainer.innerHTML = urlConfigHtml;
		urlConfigCheckboxes = urlConfigCheckboxesContainer.getElementsByTagName("input");
		// For oldIE support:
		// * Add handlers to the individual elements instead of the container
		// * Use "click" instead of "change"
		// * Fallback from event.target to event.srcElement
		addEvents( urlConfigCheckboxes, "click", function( event ) {
			var params = {},
				target = event.target || event.srcElement;
			params[ target.name ] = target.checked ? true : undefined;
			window.location = QUnit.url( params );
		});
		toolbar.appendChild( urlConfigCheckboxesContainer );

		if (numModules > 1) {
			moduleFilter = document.createElement( "span" );
			moduleFilter.setAttribute( "id", "qunit-modulefilter-container" );
			moduleFilter.innerHTML = moduleFilterHtml;
			addEvent( moduleFilter.lastChild, "change", function() {
				var selectBox = moduleFilter.getElementsByTagName("select")[0],
					selectedModule = decodeURIComponent(selectBox.options[selectBox.selectedIndex].value);

				window.location = QUnit.url({
					module: ( selectedModule === "" ) ? undefined : selectedModule,
					// Remove any existing filters
					filter: undefined,
					testNumber: undefined
				});
			});
			toolbar.appendChild(moduleFilter);
		}
	}

	// `main` initialized at top of scope
	main = id( "qunit-fixture" );
	if ( main ) {
		config.fixture = main.innerHTML;
	}

	if ( config.autostart ) {
		QUnit.start();
	}
};

addEvent( window, "load", QUnit.load );

// `onErrorFnPrev` initialized at top of scope
// Preserve other handlers
onErrorFnPrev = window.onerror;

// Cover uncaught exceptions
// Returning true will suppress the default browser handler,
// returning false will let it run.
window.onerror = function ( error, filePath, linerNr ) {
	var ret = false;
	if ( onErrorFnPrev ) {
		ret = onErrorFnPrev( error, filePath, linerNr );
	}

	// Treat return value as window.onerror itself does,
	// Only do our handling if not suppressed.
	if ( ret !== true ) {
		if ( QUnit.config.current ) {
			if ( QUnit.config.current.ignoreGlobalErrors ) {
				return true;
			}
			QUnit.pushFailure( error, filePath + ":" + linerNr );
		} else {
			QUnit.test( "global failure", extend( function() {
				QUnit.pushFailure( error, filePath + ":" + linerNr );
			}, { validTest: validTest } ) );
		}
		return false;
	}

	return ret;
};

function done() {
	config.autorun = true;

	// Log the last module results
	if ( config.currentModule ) {
		runLoggingCallbacks( "moduleDone", QUnit, {
			name: config.currentModule,
			failed: config.moduleStats.bad,
			passed: config.moduleStats.all - config.moduleStats.bad,
			total: config.moduleStats.all
		});
	}
	delete config.previousModule;

	var i, key,
		banner = id( "qunit-banner" ),
		tests = id( "qunit-tests" ),
		runtime = +new Date() - config.started,
		passed = config.stats.all - config.stats.bad,
		html = [
			"Tests completed in ",
			runtime,
			" milliseconds.<br/>",
			"<span class='passed'>",
			passed,
			"</span> assertions of <span class='total'>",
			config.stats.all,
			"</span> passed, <span class='failed'>",
			config.stats.bad,
			"</span> failed."
		].join( "" );

	if ( banner ) {
		banner.className = ( config.stats.bad ? "qunit-fail" : "qunit-pass" );
	}

	if ( tests ) {
		id( "qunit-testresult" ).innerHTML = html;
	}

	if ( config.altertitle && typeof document !== "undefined" && document.title ) {
		// show ✖ for good, ✔ for bad suite result in title
		// use escape sequences in case file gets loaded with non-utf-8-charset
		document.title = [
			( config.stats.bad ? "\u2716" : "\u2714" ),
			document.title.replace( /^[\u2714\u2716] /i, "" )
		].join( " " );
	}

	// clear own sessionStorage items if all tests passed
	if ( config.reorder && defined.sessionStorage && config.stats.bad === 0 ) {
		// `key` & `i` initialized at top of scope
		for ( i = 0; i < sessionStorage.length; i++ ) {
			key = sessionStorage.key( i++ );
			if ( key.indexOf( "qunit-test-" ) === 0 ) {
				sessionStorage.removeItem( key );
			}
		}
	}

	// scroll back to top to show results
	if ( window.scrollTo ) {
		window.scrollTo(0, 0);
	}

	runLoggingCallbacks( "done", QUnit, {
		failed: config.stats.bad,
		passed: passed,
		total: config.stats.all,
		runtime: runtime
	});
}

/** @return Boolean: true if this test should be ran */
function validTest( test ) {
	var include,
		filter = config.filter && config.filter.toLowerCase(),
		module = config.module && config.module.toLowerCase(),
		fullName = (test.module + ": " + test.testName).toLowerCase();

	// Internally-generated tests are always valid
	if ( test.callback && test.callback.validTest === validTest ) {
		delete test.callback.validTest;
		return true;
	}

	if ( config.testNumber ) {
		return test.testNumber === config.testNumber;
	}

	if ( module && ( !test.module || test.module.toLowerCase() !== module ) ) {
		return false;
	}

	if ( !filter ) {
		return true;
	}

	include = filter.charAt( 0 ) !== "!";
	if ( !include ) {
		filter = filter.slice( 1 );
	}

	// If the filter matches, we need to honour include
	if ( fullName.indexOf( filter ) !== -1 ) {
		return include;
	}

	// Otherwise, do the opposite
	return !include;
}

// so far supports only Firefox, Chrome and Opera (buggy), Safari (for real exceptions)
// Later Safari and IE10 are supposed to support error.stack as well
// See also https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error/Stack
function extractStacktrace( e, offset ) {
	offset = offset === undefined ? 3 : offset;

	var stack, include, i;

	if ( e.stacktrace ) {
		// Opera
		return e.stacktrace.split( "\n" )[ offset + 3 ];
	} else if ( e.stack ) {
		// Firefox, Chrome
		stack = e.stack.split( "\n" );
		if (/^error$/i.test( stack[0] ) ) {
			stack.shift();
		}
		if ( fileName ) {
			include = [];
			for ( i = offset; i < stack.length; i++ ) {
				if ( stack[ i ].indexOf( fileName ) !== -1 ) {
					break;
				}
				include.push( stack[ i ] );
			}
			if ( include.length ) {
				return include.join( "\n" );
			}
		}
		return stack[ offset ];
	} else if ( e.sourceURL ) {
		// Safari, PhantomJS
		// hopefully one day Safari provides actual stacktraces
		// exclude useless self-reference for generated Error objects
		if ( /qunit.js$/.test( e.sourceURL ) ) {
			return;
		}
		// for actual exceptions, this is useful
		return e.sourceURL + ":" + e.line;
	}
}
function sourceFromStacktrace( offset ) {
	try {
		throw new Error();
	} catch ( e ) {
		return extractStacktrace( e, offset );
	}
}

/**
 * Escape text for attribute or text content.
 */
function escapeText( s ) {
	if ( !s ) {
		return "";
	}
	s = s + "";
	// Both single quotes and double quotes (for attributes)
	return s.replace( /['"<>&]/g, function( s ) {
		switch( s ) {
			case "'":
				return "&#039;";
			case "\"":
				return "&quot;";
			case "<":
				return "&lt;";
			case ">":
				return "&gt;";
			case "&":
				return "&amp;";
		}
	});
}

function synchronize( callback, last ) {
	config.queue.push( callback );

	if ( config.autorun && !config.blocking ) {
		process( last );
	}
}

function process( last ) {
	function next() {
		process( last );
	}
	var start = new Date().getTime();
	config.depth = config.depth ? config.depth + 1 : 1;

	while ( config.queue.length && !config.blocking ) {
		if ( !defined.setTimeout || config.updateRate <= 0 || ( ( new Date().getTime() - start ) < config.updateRate ) ) {
			config.queue.shift()();
		} else {
			setTimeout( next, 13 );
			break;
		}
	}
	config.depth--;
	if ( last && !config.blocking && !config.queue.length && config.depth === 0 ) {
		done();
	}
}

function saveGlobal() {
	config.pollution = [];

	if ( config.noglobals ) {
		for ( var key in window ) {
			if ( hasOwn.call( window, key ) ) {
				// in Opera sometimes DOM element ids show up here, ignore them
				if ( /^qunit-test-output/.test( key ) ) {
					continue;
				}
				config.pollution.push( key );
			}
		}
	}
}

function checkPollution() {
	var newGlobals,
		deletedGlobals,
		old = config.pollution;

	saveGlobal();

	newGlobals = diff( config.pollution, old );
	if ( newGlobals.length > 0 ) {
		QUnit.pushFailure( "Introduced global variable(s): " + newGlobals.join(", ") );
	}

	deletedGlobals = diff( old, config.pollution );
	if ( deletedGlobals.length > 0 ) {
		QUnit.pushFailure( "Deleted global variable(s): " + deletedGlobals.join(", ") );
	}
}

// returns a new Array with the elements that are in a but not in b
function diff( a, b ) {
	var i, j,
		result = a.slice();

	for ( i = 0; i < result.length; i++ ) {
		for ( j = 0; j < b.length; j++ ) {
			if ( result[i] === b[j] ) {
				result.splice( i, 1 );
				i--;
				break;
			}
		}
	}
	return result;
}

function extend( a, b ) {
	for ( var prop in b ) {
		if ( hasOwn.call( b, prop ) ) {
			// Avoid "Member not found" error in IE8 caused by messing with window.constructor
			if ( !( prop === "constructor" && a === window ) ) {
				if ( b[ prop ] === undefined ) {
					delete a[ prop ];
				} else {
					a[ prop ] = b[ prop ];
				}
			}
		}
	}

	return a;
}

/**
 * @param {HTMLElement} elem
 * @param {string} type
 * @param {Function} fn
 */
function addEvent( elem, type, fn ) {
	// Standards-based browsers
	if ( elem.addEventListener ) {
		elem.addEventListener( type, fn, false );
	// IE
	} else {
		elem.attachEvent( "on" + type, fn );
	}
}

/**
 * @param {Array|NodeList} elems
 * @param {string} type
 * @param {Function} fn
 */
function addEvents( elems, type, fn ) {
	var i = elems.length;
	while ( i-- ) {
		addEvent( elems[i], type, fn );
	}
}

function hasClass( elem, name ) {
	return (" " + elem.className + " ").indexOf(" " + name + " ") > -1;
}

function addClass( elem, name ) {
	if ( !hasClass( elem, name ) ) {
		elem.className += (elem.className ? " " : "") + name;
	}
}

function removeClass( elem, name ) {
	var set = " " + elem.className + " ";
	// Class name may appear multiple times
	while ( set.indexOf(" " + name + " ") > -1 ) {
		set = set.replace(" " + name + " " , " ");
	}
	// If possible, trim it for prettiness, but not necessarily
	elem.className = typeof set.trim === "function" ? set.trim() : set.replace(/^\s+|\s+$/g, "");
}

function id( name ) {
	return !!( typeof document !== "undefined" && document && document.getElementById ) &&
		document.getElementById( name );
}

function registerLoggingCallback( key ) {
	return function( callback ) {
		config[key].push( callback );
	};
}

// Supports deprecated method of completely overwriting logging callbacks
function runLoggingCallbacks( key, scope, args ) {
	var i, callbacks;
	if ( QUnit.hasOwnProperty( key ) ) {
		QUnit[ key ].call(scope, args );
	} else {
		callbacks = config[ key ];
		for ( i = 0; i < callbacks.length; i++ ) {
			callbacks[ i ].call( scope, args );
		}
	}
}

// Test for equality any JavaScript type.
// Author: Philippe Rathé <prathe@gmail.com>
QUnit.equiv = (function() {

	// Call the o related callback with the given arguments.
	function bindCallbacks( o, callbacks, args ) {
		var prop = QUnit.objectType( o );
		if ( prop ) {
			if ( QUnit.objectType( callbacks[ prop ] ) === "function" ) {
				return callbacks[ prop ].apply( callbacks, args );
			} else {
				return callbacks[ prop ]; // or undefined
			}
		}
	}

	// the real equiv function
	var innerEquiv,
		// stack to decide between skip/abort functions
		callers = [],
		// stack to avoiding loops from circular referencing
		parents = [],
		parentsB = [],

		getProto = Object.getPrototypeOf || function ( obj ) {
			/*jshint camelcase:false */
			return obj.__proto__;
		},
		callbacks = (function () {

			// for string, boolean, number and null
			function useStrictEquality( b, a ) {
				/*jshint eqeqeq:false */
				if ( b instanceof a.constructor || a instanceof b.constructor ) {
					// to catch short annotation VS 'new' annotation of a
					// declaration
					// e.g. var i = 1;
					// var j = new Number(1);
					return a == b;
				} else {
					return a === b;
				}
			}

			return {
				"string": useStrictEquality,
				"boolean": useStrictEquality,
				"number": useStrictEquality,
				"null": useStrictEquality,
				"undefined": useStrictEquality,

				"nan": function( b ) {
					return isNaN( b );
				},

				"date": function( b, a ) {
					return QUnit.objectType( b ) === "date" && a.valueOf() === b.valueOf();
				},

				"regexp": function( b, a ) {
					return QUnit.objectType( b ) === "regexp" &&
						// the regex itself
						a.source === b.source &&
						// and its modifiers
						a.global === b.global &&
						// (gmi) ...
						a.ignoreCase === b.ignoreCase &&
						a.multiline === b.multiline &&
						a.sticky === b.sticky;
				},

				// - skip when the property is a method of an instance (OOP)
				// - abort otherwise,
				// initial === would have catch identical references anyway
				"function": function() {
					var caller = callers[callers.length - 1];
					return caller !== Object && typeof caller !== "undefined";
				},

				"array": function( b, a ) {
					var i, j, len, loop, aCircular, bCircular;

					// b could be an object literal here
					if ( QUnit.objectType( b ) !== "array" ) {
						return false;
					}

					len = a.length;
					if ( len !== b.length ) {
						// safe and faster
						return false;
					}

					// track reference to avoid circular references
					parents.push( a );
					parentsB.push( b );
					for ( i = 0; i < len; i++ ) {
						loop = false;
						for ( j = 0; j < parents.length; j++ ) {
							aCircular = parents[j] === a[i];
							bCircular = parentsB[j] === b[i];
							if ( aCircular || bCircular ) {
								if ( a[i] === b[i] || aCircular && bCircular ) {
									loop = true;
								} else {
									parents.pop();
									parentsB.pop();
									return false;
								}
							}
						}
						if ( !loop && !innerEquiv(a[i], b[i]) ) {
							parents.pop();
							parentsB.pop();
							return false;
						}
					}
					parents.pop();
					parentsB.pop();
					return true;
				},

				"object": function( b, a ) {
					/*jshint forin:false */
					var i, j, loop, aCircular, bCircular,
						// Default to true
						eq = true,
						aProperties = [],
						bProperties = [];

					// comparing constructors is more strict than using
					// instanceof
					if ( a.constructor !== b.constructor ) {
						// Allow objects with no prototype to be equivalent to
						// objects with Object as their constructor.
						if ( !(( getProto(a) === null && getProto(b) === Object.prototype ) ||
							( getProto(b) === null && getProto(a) === Object.prototype ) ) ) {
								return false;
						}
					}

					// stack constructor before traversing properties
					callers.push( a.constructor );

					// track reference to avoid circular references
					parents.push( a );
					parentsB.push( b );

					// be strict: don't ensure hasOwnProperty and go deep
					for ( i in a ) {
						loop = false;
						for ( j = 0; j < parents.length; j++ ) {
							aCircular = parents[j] === a[i];
							bCircular = parentsB[j] === b[i];
							if ( aCircular || bCircular ) {
								if ( a[i] === b[i] || aCircular && bCircular ) {
									loop = true;
								} else {
									eq = false;
									break;
								}
							}
						}
						aProperties.push(i);
						if ( !loop && !innerEquiv(a[i], b[i]) ) {
							eq = false;
							break;
						}
					}

					parents.pop();
					parentsB.pop();
					callers.pop(); // unstack, we are done

					for ( i in b ) {
						bProperties.push( i ); // collect b's properties
					}

					// Ensures identical properties name
					return eq && innerEquiv( aProperties.sort(), bProperties.sort() );
				}
			};
		}());

	innerEquiv = function() { // can take multiple arguments
		var args = [].slice.apply( arguments );
		if ( args.length < 2 ) {
			return true; // end transition
		}

		return (function( a, b ) {
			if ( a === b ) {
				return true; // catch the most you can
			} else if ( a === null || b === null || typeof a === "undefined" ||
					typeof b === "undefined" ||
					QUnit.objectType(a) !== QUnit.objectType(b) ) {
				return false; // don't lose time with error prone cases
			} else {
				return bindCallbacks(a, callbacks, [ b, a ]);
			}

			// apply transition with (1..n) arguments
		}( args[0], args[1] ) && innerEquiv.apply( this, args.splice(1, args.length - 1 )) );
	};

	return innerEquiv;
}());

/**
 * jsDump Copyright (c) 2008 Ariel Flesler - aflesler(at)gmail(dot)com |
 * http://flesler.blogspot.com Licensed under BSD
 * (http://www.opensource.org/licenses/bsd-license.php) Date: 5/15/2008
 *
 * @projectDescription Advanced and extensible data dumping for Javascript.
 * @version 1.0.0
 * @author Ariel Flesler
 * @link {http://flesler.blogspot.com/2008/05/jsdump-pretty-dump-of-any-javascript.html}
 */
QUnit.jsDump = (function() {
	function quote( str ) {
		return "\"" + str.toString().replace( /"/g, "\\\"" ) + "\"";
	}
	function literal( o ) {
		return o + "";
	}
	function join( pre, arr, post ) {
		var s = jsDump.separator(),
			base = jsDump.indent(),
			inner = jsDump.indent(1);
		if ( arr.join ) {
			arr = arr.join( "," + s + inner );
		}
		if ( !arr ) {
			return pre + post;
		}
		return [ pre, inner + arr, base + post ].join(s);
	}
	function array( arr, stack ) {
		var i = arr.length, ret = new Array(i);
		this.up();
		while ( i-- ) {
			ret[i] = this.parse( arr[i] , undefined , stack);
		}
		this.down();
		return join( "[", ret, "]" );
	}

	var reName = /^function (\w+)/,
		jsDump = {
			// type is used mostly internally, you can fix a (custom)type in advance
			parse: function( obj, type, stack ) {
				stack = stack || [ ];
				var inStack, res,
					parser = this.parsers[ type || this.typeOf(obj) ];

				type = typeof parser;
				inStack = inArray( obj, stack );

				if ( inStack !== -1 ) {
					return "recursion(" + (inStack - stack.length) + ")";
				}
				if ( type === "function" )  {
					stack.push( obj );
					res = parser.call( this, obj, stack );
					stack.pop();
					return res;
				}
				return ( type === "string" ) ? parser : this.parsers.error;
			},
			typeOf: function( obj ) {
				var type;
				if ( obj === null ) {
					type = "null";
				} else if ( typeof obj === "undefined" ) {
					type = "undefined";
				} else if ( QUnit.is( "regexp", obj) ) {
					type = "regexp";
				} else if ( QUnit.is( "date", obj) ) {
					type = "date";
				} else if ( QUnit.is( "function", obj) ) {
					type = "function";
				} else if ( typeof obj.setInterval !== undefined && typeof obj.document !== "undefined" && typeof obj.nodeType === "undefined" ) {
					type = "window";
				} else if ( obj.nodeType === 9 ) {
					type = "document";
				} else if ( obj.nodeType ) {
					type = "node";
				} else if (
					// native arrays
					toString.call( obj ) === "[object Array]" ||
					// NodeList objects
					( typeof obj.length === "number" && typeof obj.item !== "undefined" && ( obj.length ? obj.item(0) === obj[0] : ( obj.item( 0 ) === null && typeof obj[0] === "undefined" ) ) )
				) {
					type = "array";
				} else if ( obj.constructor === Error.prototype.constructor ) {
					type = "error";
				} else {
					type = typeof obj;
				}
				return type;
			},
			separator: function() {
				return this.multiline ?	this.HTML ? "<br />" : "\n" : this.HTML ? "&nbsp;" : " ";
			},
			// extra can be a number, shortcut for increasing-calling-decreasing
			indent: function( extra ) {
				if ( !this.multiline ) {
					return "";
				}
				var chr = this.indentChar;
				if ( this.HTML ) {
					chr = chr.replace( /\t/g, "   " ).replace( / /g, "&nbsp;" );
				}
				return new Array( this.depth + ( extra || 0 ) ).join(chr);
			},
			up: function( a ) {
				this.depth += a || 1;
			},
			down: function( a ) {
				this.depth -= a || 1;
			},
			setParser: function( name, parser ) {
				this.parsers[name] = parser;
			},
			// The next 3 are exposed so you can use them
			quote: quote,
			literal: literal,
			join: join,
			//
			depth: 1,
			// This is the list of parsers, to modify them, use jsDump.setParser
			parsers: {
				window: "[Window]",
				document: "[Document]",
				error: function(error) {
					return "Error(\"" + error.message + "\")";
				},
				unknown: "[Unknown]",
				"null": "null",
				"undefined": "undefined",
				"function": function( fn ) {
					var ret = "function",
						// functions never have name in IE
						name = "name" in fn ? fn.name : (reName.exec(fn) || [])[1];

					if ( name ) {
						ret += " " + name;
					}
					ret += "( ";

					ret = [ ret, QUnit.jsDump.parse( fn, "functionArgs" ), "){" ].join( "" );
					return join( ret, QUnit.jsDump.parse(fn,"functionCode" ), "}" );
				},
				array: array,
				nodelist: array,
				"arguments": array,
				object: function( map, stack ) {
					/*jshint forin:false */
					var ret = [ ], keys, key, val, i;
					QUnit.jsDump.up();
					keys = [];
					for ( key in map ) {
						keys.push( key );
					}
					keys.sort();
					for ( i = 0; i < keys.length; i++ ) {
						key = keys[ i ];
						val = map[ key ];
						ret.push( QUnit.jsDump.parse( key, "key" ) + ": " + QUnit.jsDump.parse( val, undefined, stack ) );
					}
					QUnit.jsDump.down();
					return join( "{", ret, "}" );
				},
				node: function( node ) {
					var len, i, val,
						open = QUnit.jsDump.HTML ? "&lt;" : "<",
						close = QUnit.jsDump.HTML ? "&gt;" : ">",
						tag = node.nodeName.toLowerCase(),
						ret = open + tag,
						attrs = node.attributes;

					if ( attrs ) {
						for ( i = 0, len = attrs.length; i < len; i++ ) {
							val = attrs[i].nodeValue;
							// IE6 includes all attributes in .attributes, even ones not explicitly set.
							// Those have values like undefined, null, 0, false, "" or "inherit".
							if ( val && val !== "inherit" ) {
								ret += " " + attrs[i].nodeName + "=" + QUnit.jsDump.parse( val, "attribute" );
							}
						}
					}
					ret += close;

					// Show content of TextNode or CDATASection
					if ( node.nodeType === 3 || node.nodeType === 4 ) {
						ret += node.nodeValue;
					}

					return ret + open + "/" + tag + close;
				},
				// function calls it internally, it's the arguments part of the function
				functionArgs: function( fn ) {
					var args,
						l = fn.length;

					if ( !l ) {
						return "";
					}

					args = new Array(l);
					while ( l-- ) {
						// 97 is 'a'
						args[l] = String.fromCharCode(97+l);
					}
					return " " + args.join( ", " ) + " ";
				},
				// object calls it internally, the key part of an item in a map
				key: quote,
				// function calls it internally, it's the content of the function
				functionCode: "[code]",
				// node calls it internally, it's an html attribute value
				attribute: quote,
				string: quote,
				date: quote,
				regexp: literal,
				number: literal,
				"boolean": literal
			},
			// if true, entities are escaped ( <, >, \t, space and \n )
			HTML: false,
			// indentation unit
			indentChar: "  ",
			// if true, items in a collection, are separated by a \n, else just a space.
			multiline: true
		};

	return jsDump;
}());

// from jquery.js
function inArray( elem, array ) {
	if ( array.indexOf ) {
		return array.indexOf( elem );
	}

	for ( var i = 0, length = array.length; i < length; i++ ) {
		if ( array[ i ] === elem ) {
			return i;
		}
	}

	return -1;
}

/*
 * Javascript Diff Algorithm
 *  By John Resig (http://ejohn.org/)
 *  Modified by Chu Alan "sprite"
 *
 * Released under the MIT license.
 *
 * More Info:
 *  http://ejohn.org/projects/javascript-diff-algorithm/
 *
 * Usage: QUnit.diff(expected, actual)
 *
 * QUnit.diff( "the quick brown fox jumped over", "the quick fox jumps over" ) == "the  quick <del>brown </del> fox <del>jumped </del><ins>jumps </ins> over"
 */
QUnit.diff = (function() {
	/*jshint eqeqeq:false, eqnull:true */
	function diff( o, n ) {
		var i,
			ns = {},
			os = {};

		for ( i = 0; i < n.length; i++ ) {
			if ( !hasOwn.call( ns, n[i] ) ) {
				ns[ n[i] ] = {
					rows: [],
					o: null
				};
			}
			ns[ n[i] ].rows.push( i );
		}

		for ( i = 0; i < o.length; i++ ) {
			if ( !hasOwn.call( os, o[i] ) ) {
				os[ o[i] ] = {
					rows: [],
					n: null
				};
			}
			os[ o[i] ].rows.push( i );
		}

		for ( i in ns ) {
			if ( hasOwn.call( ns, i ) ) {
				if ( ns[i].rows.length === 1 && hasOwn.call( os, i ) && os[i].rows.length === 1 ) {
					n[ ns[i].rows[0] ] = {
						text: n[ ns[i].rows[0] ],
						row: os[i].rows[0]
					};
					o[ os[i].rows[0] ] = {
						text: o[ os[i].rows[0] ],
						row: ns[i].rows[0]
					};
				}
			}
		}

		for ( i = 0; i < n.length - 1; i++ ) {
			if ( n[i].text != null && n[ i + 1 ].text == null && n[i].row + 1 < o.length && o[ n[i].row + 1 ].text == null &&
						n[ i + 1 ] == o[ n[i].row + 1 ] ) {

				n[ i + 1 ] = {
					text: n[ i + 1 ],
					row: n[i].row + 1
				};
				o[ n[i].row + 1 ] = {
					text: o[ n[i].row + 1 ],
					row: i + 1
				};
			}
		}

		for ( i = n.length - 1; i > 0; i-- ) {
			if ( n[i].text != null && n[ i - 1 ].text == null && n[i].row > 0 && o[ n[i].row - 1 ].text == null &&
						n[ i - 1 ] == o[ n[i].row - 1 ]) {

				n[ i - 1 ] = {
					text: n[ i - 1 ],
					row: n[i].row - 1
				};
				o[ n[i].row - 1 ] = {
					text: o[ n[i].row - 1 ],
					row: i - 1
				};
			}
		}

		return {
			o: o,
			n: n
		};
	}

	return function( o, n ) {
		o = o.replace( /\s+$/, "" );
		n = n.replace( /\s+$/, "" );

		var i, pre,
			str = "",
			out = diff( o === "" ? [] : o.split(/\s+/), n === "" ? [] : n.split(/\s+/) ),
			oSpace = o.match(/\s+/g),
			nSpace = n.match(/\s+/g);

		if ( oSpace == null ) {
			oSpace = [ " " ];
		}
		else {
			oSpace.push( " " );
		}

		if ( nSpace == null ) {
			nSpace = [ " " ];
		}
		else {
			nSpace.push( " " );
		}

		if ( out.n.length === 0 ) {
			for ( i = 0; i < out.o.length; i++ ) {
				str += "<del>" + out.o[i] + oSpace[i] + "</del>";
			}
		}
		else {
			if ( out.n[0].text == null ) {
				for ( n = 0; n < out.o.length && out.o[n].text == null; n++ ) {
					str += "<del>" + out.o[n] + oSpace[n] + "</del>";
				}
			}

			for ( i = 0; i < out.n.length; i++ ) {
				if (out.n[i].text == null) {
					str += "<ins>" + out.n[i] + nSpace[i] + "</ins>";
				}
				else {
					// `pre` initialized at top of scope
					pre = "";

					for ( n = out.n[i].row + 1; n < out.o.length && out.o[n].text == null; n++ ) {
						pre += "<del>" + out.o[n] + oSpace[n] + "</del>";
					}
					str += " " + out.n[i].text + nSpace[i] + pre;
				}
			}
		}

		return str;
	};
}());

// for CommonJS environments, export everything
if ( typeof exports !== "undefined" ) {
	extend( exports, QUnit.constructor.prototype );
}

// get at whatever the global object is, like window in browsers
}( window ));
(function() {
  this.notEmpty = function(selector) {
    return function() {
      return $(selector).text().trim() !== '';
    };
  };

  this.hasText = function(selector, text) {
    return function() {
      return $(selector).text().trim() === text;
    };
  };

  this.reposRendered = notEmpty('#repos li.selected');

  this.myReposRendered = function() {
    return notEmpty('#repos li.selected')() && $('#left #tab_owned').hasClass('active');
  };

  this.buildRendered = notEmpty('#summary .number');

  this.buildsRendered = notEmpty('#builds .number');

  this.jobRendered = notEmpty('#summary .number');

  this.jobsRendered = notEmpty('#jobs .number');

  this.queuesRendered = notEmpty('#queue_linux li');

  this.workersRendered = notEmpty('.worker');

  this.logRendered = notEmpty('#log p');

  this.appRendered = function() {
    return $('.ember-view.application').length;
  };

  this.sidebarTabsRendered = notEmpty('#right #tab_workers a');

}).call(this);
(function() {
  this.displaysRepository = function(repo) {
    equal($('#repo h3 a').attr('href'), repo.href, 'repository title should link to repo page');
    return equal($('#repo .github-icon a').attr('href'), "https://github.com" + repo.href, 'github icon should link to repo on github');
  };

  this.displaysTabs = function(tabs) {
    var name, tab, _results;
    _results = [];
    for (name in tabs) {
      tab = tabs[name];
      if (!tab.hidden) {
        equal($("#tab_" + name + " a").attr('href'), tab.href, "" + name + " tab should link to " + tab.href);
      }
      equal($("#tab_" + name).hasClass('active'), !!tab.active, "" + name + " tab should " + (!tab.active ? 'not' : void 0) + " be active");
      if (name === 'build' || name === 'job') {
        _results.push(equal($("#tab_" + name).hasClass('display-inline'), !tab.hidden, "" + name + " tab should have class display-inline"));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  this.displaysSummaryBuildLink = function(link, number) {
    var element;
    element = $('#new-summary .build-status a');
    equal(element.attr('href'), link);
    return equal(element.text().trim(), "#" + number + " started");
  };

  this.displaysSummary = function(data) {
    var duration_regexp, element;
    element = $('#new-summary .build-status a');
    equal(element.attr('href'), "/" + data.repo + "/" + data.type + "s/" + data.id);
    element = $('#new-summary .finished');
    equal(element.text().trim(), data.finishedAt);
    element = $('#new-summary .runtime');
    duration_regexp = new RegExp("(ran|running) for " + data.duration);
    ok(duration_regexp.test(element.text().trim()));
    element = $('#new-summary .commit-changes a.commit');
    equal(element.attr('href'), "https://github.com/" + data.repo + "/commit/" + data.commit);
    element = $('#new-summary .commit-changes a.commit');
    equal(element.text(), "Commit " + data.commit);
    element = $('#new-summary .branch');
    equal(element.text().trim(), data.branch);
    element = $('#new-summary .commit-changes a.compare');
    equal(element.attr('href'), "https://github.com/compare/" + data.compare);
    element = $('#new-summary .commit-changes a.compare');
    equal(element.text(), "Compare " + data.compare);
    element = $('#new-summary .subject');
    return equal(element.text().trim(), "- " + data.message);
  };

  this.displaysSummaryGravatars = function(data) {
    var element;
    element = $('#new-summary .author .committed img');
    equal(element.attr('src'), Travis.Urls.gravatarImage(data.committerEmail, 40));
    element = $('#new-summary .author .authored img');
    return equal(element.attr('src'), Travis.Urls.gravatarImage(data.authorEmail, 40));
  };

  this.displaysLog = function(lines) {
    var log;
    log = lines.join('');
    return equal($('#log p').text().trim(), log);
  };

  this.listsRepos = function(items) {
    return listsItems('repo', items);
  };

  this.listsRepo = function(data) {
    var repo, row;
    row = $('#repos li')[data.row - 1];
    repo = data.item;
    equal($('a.slug', row).attr('href'), "/" + repo.slug);
    equal($('a.last_build', row).attr('href'), repo.build.url);
    equal($('.duration', row).text().trim(), repo.build.duration);
    return equal($('.finished_at', row).text().trim(), repo.build.finishedAt);
  };

  this.listsBuilds = function(builds) {
    return listsItems('build', builds);
  };

  this.listsBuild = function(data) {
    var build, row;
    row = $('#builds tbody tr')[data.row - 1];
    build = data.item;
    equal($('.number a', row).attr('href'), "/" + build.slug + "/builds/" + build.id);
    equal($('.number a', row).text().trim(), build.number);
    equal($('.message', row).text().trim(), build.message);
    equal($('.duration', row).text().trim(), build.duration);
    equal($('.finished_at', row).text().trim(), build.finishedAt);
    return ok($(row).attr('class').match(build.color));
  };

  this.listsJobs = function(data) {
    var element, headers, table;
    table = $(data.table);
    headers = (function() {
      var _i, _len, _ref, _results;
      _ref = $("thead th", table);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element = _ref[_i];
        _results.push($(element).text());
      }
      return _results;
    })();
    deepEqual(headers, data.headers);
    return $.each(data.jobs, function(row, job) {
      return listsJob({
        table: data.table,
        row: row + 1,
        item: job
      });
    });
  };

  this.listsJob = function(data) {
    var element, job, row;
    row = $('tbody tr', data.table)[data.row - 1];
    job = data.item;
    element = $(row);
    ok(element.attr('class').match(job.color));
    element = $("td.number", row);
    equal(element.text().trim(), job.number);
    element = $("td.number a", row);
    equal(element.attr('href'), "/" + job.repo + "/jobs/" + job.id);
    element = $("td.duration", row);
    equal(element.text().trim(), job.duration);
    element = $("td.finished_at", row);
    equal(element.text().trim(), job.finishedAt);
    element = $("td:nth-child(4)", row);
    return equal(element.text().trim(), job.rvm);
  };

  this.listsQueuedJobs = function(jobs) {
    return listsItems('queuedJob', jobs);
  };

  this.listsQueuedJob = function(data) {
    var job, text;
    job = data.item;
    text = $($("#queue_" + data.name + " li")[data.row - 1]).text();
    ok(text.match(job.repo), "" + text + " should contain " + job.repo);
    return ok(text.match(job.repo), "" + text + " should contain " + job.number);
  };

  this.listsQueue = function(data) {
    var job, name, text;
    name = data.item.name;
    job = data.item.item;
    text = $($("#queue_" + name + " li")[data.row - 1]).text();
    ok(text.match(job.repo), "" + text + " should contain " + job.repo);
    return ok(text.match(job.repo), "" + text + " should contain " + job.number);
  };

  this.listsItems = function(type, items) {
    return $.each(items, (function(_this) {
      return function(row, item) {
        return window["lists" + ($.camelize(type))]({
          item: item,
          row: row + 1
        });
      };
    })(this));
  };

  this.listsQueues = function(queues) {
    return listsItems('queue', queues);
  };

  this.listsWorker = function(data) {
    var element, group, worker;
    group = $("#workers li:contains('" + data.group + "')");
    element = $($('ul li', group)[data.row - 1]);
    worker = data.item;
    ok(element.text().match(worker.name));
    return ok(element.text().match(worker.state));
  };

}).call(this);
(function() {
  var artifact, artifacts, branches, build, builds, commits, data, hooks, id, job, jobs, repos, reposByName, repository, responseTime, workers, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m;

  minispade.require('ext/jquery');

  responseTime = 10;

  repos = [
    {
      id: '1',
      owner: 'travis-ci',
      name: 'travis-core',
      slug: 'travis-ci/travis-core',
      build_ids: [1, 2],
      last_build_id: 1,
      last_build_number: 1,
      last_build_state: 'passed',
      last_build_duration: 30,
      last_build_started_at: '2012-07-02T00:00:00Z',
      last_build_finished_at: '2012-07-02T00:00:30Z',
      description: 'Description of travis-core',
      github_language: 'ruby'
    }, {
      id: '2',
      owner: 'travis-ci',
      name: 'travis-assets',
      slug: 'travis-ci/travis-assets',
      build_ids: [3],
      last_build_id: 3,
      last_build_number: 3,
      last_build_state: 'failed',
      last_build_duration: 30,
      last_build_started_at: '2012-07-02T00:01:00Z',
      last_build_finished_at: '2012-07-01T00:01:30Z',
      description: 'Description of travis-assets',
      github_language: 'ruby'
    }, {
      id: '3',
      owner: 'travis-ci',
      name: 'travis-hub',
      slug: 'travis-ci/travis-hub',
      build_ids: [4],
      last_build_id: 4,
      last_build_number: 4,
      last_build_state: null,
      last_build_duration: null,
      last_build_started_at: '2012-07-02T00:02:00Z',
      last_build_finished_at: null,
      description: 'Description of travis-hub',
      github_language: 'ruby'
    }
  ];

  reposByName = function(name) {
    if (name === 'tyrion') {
      return [repos[0], repos[2]];
    } else {
      return [];
    }
  };

  builds = [
    {
      id: '1',
      repository_id: '1',
      commit_id: 1,
      job_ids: [1, 2, 3],
      number: 1,
      pull_request: false,
      config: {
        rvm: ['rbx', '1.9.3', 'jruby']
      },
      duration: 30,
      started_at: '2012-07-02T00:00:00Z',
      finished_at: '2012-07-02T00:00:30Z',
      state: 'passed'
    }, {
      id: '2',
      repository_id: '1',
      commit_id: 2,
      job_ids: [4],
      number: 2,
      pull_request: false,
      config: {
        rvm: ['rbx']
      },
      duration: null,
      state: 'created',
      finished_at: null
    }, {
      id: '3',
      repository_id: '2',
      commit_id: 3,
      job_ids: [5],
      number: 3,
      pull_request: false,
      config: {
        rvm: ['rbx']
      },
      duration: 30,
      started_at: '2012-07-02T00:01:00Z',
      finished_at: '2012-07-01T00:01:30Z',
      state: 'failed'
    }, {
      id: '4',
      repository_id: '3',
      commit_id: 4,
      job_ids: [6],
      number: 4,
      pull_request: false,
      config: {
        rvm: ['rbx']
      },
      duration: null,
      started_at: '2012-07-02T00:02:00Z',
      state: 'queued',
      finished_at: null
    }
  ];

  commits = [
    {
      id: '1',
      sha: '1234567',
      branch: 'master',
      message: 'commit message 1',
      author_name: 'author name',
      author_email: 'author@email.com',
      committer_name: 'committer name',
      committer_email: 'committer@email.com',
      compare_url: 'https://github.com/compare/0123456..1234567'
    }, {
      id: '2',
      sha: '2345678',
      branch: 'feature',
      message: 'commit message 2',
      author_name: 'author name',
      author_email: 'author@email.com',
      committer_name: 'committer name',
      committer_email: 'committer@email.com',
      compare_url: 'https://github.com/compare/0123456..2345678'
    }, {
      id: '3',
      sha: '3456789',
      branch: 'master',
      message: 'commit message 3',
      author_name: 'author name',
      author_email: 'author@email.com',
      committer_name: 'committer name',
      committer_email: 'committer@email.com',
      compare_url: 'https://github.com/compare/0123456..3456789'
    }, {
      id: '4',
      sha: '4567890',
      branch: 'master',
      message: 'commit message 4',
      author_name: 'author name',
      author_email: 'author@email.com',
      committer_name: 'committer name',
      committer_email: 'committer@email.com',
      compare_url: 'https://github.com/compare/0123456..4567890'
    }
  ];

  jobs = [
    {
      id: '1',
      repository_id: 1,
      repository_slug: 'travis-ci/travis-core',
      build_id: 1,
      commit_id: 1,
      log_id: 1,
      number: '1.1',
      config: {
        rvm: 'rbx'
      },
      duration: 30,
      started_at: '2012-07-02T00:00:00Z',
      finished_at: '2012-07-02T00:00:30Z',
      state: 'passed',
      allow_failure: false
    }, {
      id: '2',
      repository_id: 1,
      repository_slug: 'travis-ci/travis-core',
      build_id: 1,
      commit_id: 1,
      log_id: 2,
      number: '1.2',
      config: {
        rvm: '1.9.3'
      },
      duration: 40,
      started_at: '2012-07-02T00:00:00Z',
      finished_at: '2012-07-02T00:00:40Z',
      state: 'failed',
      allow_failure: false
    }, {
      id: '3',
      repository_id: 1,
      repository_slug: 'travis-ci/travis-core',
      build_id: 1,
      commit_id: 1,
      log_id: 3,
      number: '1.3',
      config: {
        rvm: 'jruby'
      },
      duration: null,
      started_at: null,
      finished_at: null,
      allow_failure: true,
      state: null
    }, {
      id: '4',
      repository_id: 1,
      repository_slug: 'travis-ci/travis-core',
      build_id: 2,
      commit_id: 2,
      log_id: 4,
      number: '2.1',
      config: {
        rvm: 'rbx'
      },
      duration: null,
      started_at: null,
      finished_at: null,
      allow_failure: false,
      state: null
    }, {
      id: '5',
      repository_id: 2,
      repository_slug: 'travis-ci/travis-assets',
      build_id: 3,
      commit_id: 3,
      log_id: 5,
      number: '3.1',
      config: {
        rvm: 'rbx'
      },
      duration: 30,
      started_at: '2012-07-02T00:01:00Z',
      finished_at: '2012-07-02T00:01:30Z',
      state: 'failed',
      allow_failure: false
    }, {
      id: '6',
      repository_id: 3,
      repository_slug: 'travis-ci/travis-hub',
      build_id: 4,
      commit_id: 4,
      log_id: 6,
      number: '4.1',
      config: {
        rvm: 'rbx'
      },
      started_at: '2012-07-02T00:02:00Z',
      allow_failure: false,
      state: null
    }, {
      id: '7',
      repository_id: 1,
      repository_slug: 'travis-ci/travis-core',
      build_id: 5,
      commit_id: 5,
      log_id: 7,
      number: '5.1',
      config: {
        rvm: 'rbx'
      },
      duration: null,
      started_at: null,
      finished_at: null,
      state: 'created',
      queue: 'builds.linux',
      allow_failure: false
    }, {
      id: '8',
      repository_id: 1,
      repository_slug: 'travis-ci/travis-core',
      build_id: 5,
      commit_id: 5,
      log_id: 8,
      number: '5.2',
      config: {
        rvm: 'rbx'
      },
      duration: null,
      started_at: null,
      finished_at: null,
      state: 'created',
      queue: 'builds.linux',
      allow_failure: false
    }
  ];

  artifacts = [
    {
      id: '1',
      body: 'log 1'
    }, {
      id: '2',
      body: 'log 2'
    }, {
      id: '3',
      body: 'log 3'
    }, {
      id: '4',
      body: 'log 4'
    }, {
      id: '5',
      body: 'log 5'
    }, {
      id: '6',
      body: 'log 6'
    }, {
      id: '7',
      body: 'log 7'
    }, {
      id: '8',
      body: 'log 8'
    }
  ];

  branches = [
    {
      branches: [builds[0], builds[1]],
      commits: [commits[0], commits[1]]
    }, {
      branches: [builds[2]],
      commits: [commits[2]]
    }, {
      branches: [builds[3]],
      commits: [commits[3]]
    }
  ];

  workers = [
    {
      id: '1',
      name: 'ruby-1',
      host: 'worker.travis-ci.org',
      state: 'ready'
    }, {
      id: '2',
      name: 'ruby-2',
      host: 'worker.travis-ci.org',
      state: 'ready'
    }
  ];

  hooks = [
    {
      slug: 'travis-ci/travis-core',
      description: 'description of travis-core',
      active: true,
      "private": false
    }, {
      slug: 'travis-ci/travis-assets',
      description: 'description of travis-assets',
      active: false,
      "private": false
    }, {
      slug: 'svenfuchs/minimal',
      description: 'description of minimal',
      active: true,
      "private": false
    }
  ];

  $.mockjax({
    url: '/repos',
    responseTime: responseTime,
    response: function(settings) {
      var reposForResponse, search, slug;
      if (!settings.data) {
        return this.responseText = {
          repos: repos
        };
      } else if (slug = settings.data.slug) {
        reposForResponse = $.select(repos, function(repository) {
          return repository.slug === slug;
        });
        return this.responseText = {
          repos: reposForResponse
        };
      } else if (search = settings.data.search) {
        return this.responseText = {
          repos: $.select(repos, function(repository) {
            return repository.slug.indexOf(search) > -1;
          }).toArray()
        };
      } else if (settings.data.member) {
        return this.responseText = {
          repos: reposByName(settings.data.member)
        };
      } else {
        console.log(settings.data);
        throw 'unknown params for repos';
      }
    }
  });

  for (_i = 0, _len = repos.length; _i < _len; _i++) {
    repository = repos[_i];
    $.mockjax({
      url: '/' + repository.slug,
      responseTime: responseTime,
      responseText: {
        repository: repository
      }
    });
    $.mockjax({
      url: '/repos',
      data: {
        slug: repository.slug
      },
      responseTime: responseTime,
      responseText: {
        repos: [repository]
      }
    });
    $.mockjax({
      url: '/builds',
      data: {
        ids: repository.build_ids
      },
      responseTime: responseTime,
      responseText: {
        builds: $.select(builds, function(build) {
          return repository.build_ids.indexOf(build.id) !== -1;
        })
      }
    });
    $.mockjax({
      url: '/builds',
      data: {
        repository_id: repository.id,
        event_type: 'push'
      },
      responseTime: responseTime,
      responseText: {
        builds: (function() {
          var _j, _len1, _ref, _results;
          _ref = repository.build_ids;
          _results = [];
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            id = _ref[_j];
            _results.push(builds[id - 1]);
          }
          return _results;
        })(),
        commits: (function() {
          var _j, _len1, _ref, _results;
          _ref = repository.build_ids;
          _results = [];
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            id = _ref[_j];
            _results.push(commits[builds[id - 1].commit_id - 1]);
          }
          return _results;
        })()
      }
    });
  }

  for (_j = 0, _len1 = builds.length; _j < _len1; _j++) {
    build = builds[_j];
    $.mockjax({
      url: '/builds/' + build.id,
      responseTime: responseTime,
      responseText: {
        build: build,
        commit: commits[build.commit_id - 1],
        jobs: (function() {
          var _k, _len2, _ref, _results;
          _ref = build.job_ids;
          _results = [];
          for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
            id = _ref[_k];
            _results.push(jobs[id - 1]);
          }
          return _results;
        })()
      }
    });
  }

  for (_k = 0, _len2 = jobs.length; _k < _len2; _k++) {
    job = jobs[_k];
    $.mockjax({
      url: '/jobs/' + job.id,
      responseTime: responseTime,
      responseText: {
        job: job,
        commit: commits[job.commit_id - 1]
      }
    });
  }

  $.mockjax({
    url: '/jobs',
    responseTime: responseTime,
    responseText: {
      jobs: $.select(jobs, function(job) {
        return job.state === 'created';
      })
    }
  });

  $.mockjax({
    url: '/builds*',
    responseTime: responseTime,
    response: function(settings) {
      var ids, match;
      if (match = settings.url.match('/builds\\?(ids.*)')) {
        ids = match[1].split(new RegExp('&?ids\\[\\]=')).filter(function(str) {
          return str !== '';
        });
        return this.responseText = {
          builds: $.select(builds, function(build) {
            return ids.contains(build.id);
          })
        };
      } else {
        throw "can't handle mocked request";
      }
    }
  });

  for (_l = 0, _len3 = branches.length; _l < _len3; _l++) {
    data = branches[_l];
    $.mockjax({
      url: '/branches',
      data: {
        repository_id: data.branches[0].repository_id
      },
      responseTime: responseTime,
      responseText: data
    });
  }

  for (_m = 0, _len4 = artifacts.length; _m < _len4; _m++) {
    artifact = artifacts[_m];
    $.mockjax({
      url: '/artifacts/' + artifact.id,
      responseTime: responseTime,
      responseText: {
        artifact: artifact
      }
    });
  }

  $.mockjax({
    url: '/workers',
    responseTime: responseTime,
    responseText: {
      workers: workers
    }
  });

  $.mockjax({
    url: '/profile/hooks',
    responseTime: responseTime,
    responseText: {
      hooks: hooks
    }
  });

}).call(this);
(function() {
  module("Build page", {
    setup: function() {
      return Ember.run(function() {
        return Travis.advanceReadiness();
      });
    },
    teardown: function() {
      return Ember.run(function() {
        return Travis.reset();
      });
    }
  });

  test("displaying information on build page", function() {
    visit('/travis-ci/travis-core/builds');
    visit('/travis-ci/travis-core/builds/1');
    return andThen(function() {
      listsRepos([
        {
          slug: 'travis-ci/travis-hub',
          build: {
            number: 4,
            url: '/travis-ci/travis-hub/builds/4',
            duration: '1 min',
            finishedAt: '-'
          }
        }, {
          slug: 'travis-ci/travis-core',
          build: {
            number: 1,
            url: '/travis-ci/travis-core/builds/1',
            duration: '30 sec',
            finishedAt: '3 minutes ago'
          }
        }, {
          slug: 'travis-ci/travis-assets',
          build: {
            number: 3,
            url: '/travis-ci/travis-assets/builds/3',
            duration: '30 sec',
            finishedAt: 'a day ago'
          }
        }
      ]);
      displaysRepository({
        href: '/travis-ci/travis-core'
      });
      displaysSummary({
        type: 'build',
        id: 1,
        repo: 'travis-ci/travis-core',
        commit: '1234567',
        branch: 'master',
        compare: '0123456..1234567',
        finishedAt: '3 minutes ago',
        duration: '30 sec',
        message: 'commit message 1'
      });
      displaysSummaryGravatars({
        authorEmail: 'author@email.com',
        committerEmail: 'committer@email.com'
      });
      displaysTabs({
        current: {
          href: '/travis-ci/travis-core'
        },
        builds: {
          href: '/travis-ci/travis-core/builds'
        },
        build: {
          href: '/travis-ci/travis-core/builds/1',
          active: true
        },
        job: {
          hidden: true
        }
      });
      listsJobs({
        table: '#jobs',
        headers: ['Job', 'Duration', 'Finished', 'Ruby'],
        jobs: [
          {
            color: 'green',
            id: 1,
            number: '1.1',
            repo: 'travis-ci/travis-core',
            finishedAt: '3 minutes ago',
            duration: '30 sec',
            rvm: 'rbx'
          }, {
            color: 'red',
            id: 2,
            number: '1.2',
            repo: 'travis-ci/travis-core',
            finishedAt: '2 minutes ago',
            duration: '40 sec',
            rvm: '1.9.3'
          }
        ]
      });
      return listsJobs({
        table: '#allowed_failure_jobs',
        headers: ['Job', 'Duration', 'Finished', 'Ruby'],
        jobs: [
          {
            color: '',
            id: 3,
            number: '1.3',
            repo: 'travis-ci/travis-core',
            finishedAt: '-',
            duration: '-',
            rvm: 'jruby'
          }
        ]
      });
    });
  });

  test("updating current build", function() {
    return visit('/travis-ci/travis-core').then(function() {
      var payload;
      payload = {
        build: {
          id: 11,
          repository_id: 1,
          commit_id: 1,
          number: '3',
          duration: 55,
          started_at: '2012-07-02T00:02:00Z',
          finished_at: '2012-07-02T00:02:55Z',
          event_type: 'push',
          result: 1,
          message: 'commit message 3',
          commit: 'foo1234',
          branch: 'master',
          state: 'started',
          config: {},
          pull_request: false,
          compare_url: 'https://github.com/compare/0123456..1234567'
        },
        repository: {
          id: 1,
          last_build_number: '3',
          last_build_id: 11
        }
      };
      Em.run(function() {
        return Travis.receive('build:started', payload);
      });
      return wait().then(function() {
        displaysSummaryBuildLink('/travis-ci/travis-core/builds/11', '3');
        return displaysSummary({
          type: 'build',
          id: 11,
          repo: 'travis-ci/travis-core',
          commit: 'foo1234',
          branch: 'master',
          compare: '0123456..1234567',
          finishedAt: 'less than a minute ago',
          duration: '55 sec',
          message: 'commit message 3'
        });
      });
    });
  });

}).call(this);
(function() {
  module("Builds page", {
    setup: function() {
      return Ember.run(function() {
        return Travis.advanceReadiness();
      });
    },
    teardown: function() {
      return Ember.run(function() {
        return Travis.reset();
      });
    }
  });

  test("displaying information on builds page", function() {
    return visit('/travis-ci/travis-core/builds').then(function() {
      listsRepos([
        {
          slug: 'travis-ci/travis-hub',
          build: {
            number: 4,
            url: '/travis-ci/travis-hub/builds/4',
            duration: '1 min',
            finishedAt: '-'
          }
        }, {
          slug: 'travis-ci/travis-core',
          build: {
            number: 1,
            url: '/travis-ci/travis-core/builds/1',
            duration: '30 sec',
            finishedAt: '3 minutes ago'
          }
        }, {
          slug: 'travis-ci/travis-assets',
          build: {
            number: 3,
            url: '/travis-ci/travis-assets/builds/3',
            duration: '30 sec',
            finishedAt: 'a day ago'
          }
        }
      ]);
      displaysRepository({
        href: '/travis-ci/travis-core'
      });
      displaysTabs({
        current: {
          href: '/travis-ci/travis-core'
        },
        builds: {
          href: '/travis-ci/travis-core/builds',
          active: true
        },
        build: {
          hidden: true
        },
        job: {
          hidden: true
        }
      });
      return listsBuilds([
        {
          id: 2,
          slug: 'travis-ci/travis-core',
          number: '2',
          sha: '2345678',
          branch: 'feature',
          message: 'commit message 2',
          duration: '-',
          finishedAt: '-',
          color: ''
        }, {
          id: 1,
          slug: 'travis-ci/travis-core',
          number: '1',
          sha: '1234567',
          branch: 'master',
          message: 'commit message 1',
          duration: '30 sec',
          finishedAt: '3 minutes ago',
          color: 'green'
        }
      ]);
    });
  });

}).call(this);
(function() {
  module("Repo page", {
    setup: function() {
      return Ember.run(function() {
        return Travis.advanceReadiness();
      });
    },
    teardown: function() {
      return Ember.run(function() {
        return Travis.reset();
      });
    }
  });

  test("displaying information on repo page", function() {
    return visit('/travis-ci/travis-core').then(function() {
      listsRepos([
        {
          slug: 'travis-ci/travis-hub',
          build: {
            number: 4,
            url: '/travis-ci/travis-hub/builds/4',
            duration: '1 min',
            finishedAt: '-'
          }
        }, {
          slug: 'travis-ci/travis-core',
          build: {
            number: 1,
            url: '/travis-ci/travis-core/builds/1',
            duration: '30 sec',
            finishedAt: '3 minutes ago'
          }
        }, {
          slug: 'travis-ci/travis-assets',
          build: {
            number: 3,
            url: '/travis-ci/travis-assets/builds/3',
            duration: '30 sec',
            finishedAt: 'a day ago'
          }
        }
      ]);
      displaysRepository({
        href: '/travis-ci/travis-core'
      });
      displaysSummary({
        type: 'build',
        id: 1,
        repo: 'travis-ci/travis-core',
        commit: '1234567',
        branch: 'master',
        compare: '0123456..1234567',
        finishedAt: '3 minutes ago',
        duration: '30 sec',
        message: 'commit message 1'
      });
      displaysTabs({
        current: {
          href: '/travis-ci/travis-core',
          active: true
        },
        builds: {
          href: '/travis-ci/travis-core/builds'
        },
        build: {
          hidden: true
        },
        job: {
          hidden: true
        }
      });
      listsJobs({
        table: '#jobs',
        headers: ['Job', 'Duration', 'Finished', 'Ruby'],
        jobs: [
          {
            id: 1,
            color: 'green',
            number: '1.1',
            repo: 'travis-ci/travis-core',
            finishedAt: '3 minutes ago',
            duration: '30 sec',
            rvm: 'rbx'
          }, {
            id: 2,
            color: 'red',
            number: '1.2',
            repo: 'travis-ci/travis-core',
            finishedAt: '2 minutes ago',
            duration: '40 sec',
            rvm: '1.9.3'
          }
        ]
      });
      return listsJobs({
        table: '#allowed_failure_jobs',
        headers: ['Job', 'Duration', 'Finished', 'Ruby'],
        jobs: [
          {
            id: 3,
            color: '',
            number: '1.3',
            repo: 'travis-ci/travis-core',
            finishedAt: '-',
            duration: '-',
            rvm: 'jruby'
          }
        ]
      });
    });
  });

}).call(this);
(function() {
  module("Events", {
    setup: function() {
      return Ember.run(function() {
        return Travis.advanceReadiness();
      });
    },
    teardown: function() {
      return Ember.run(function() {
        return Travis.reset();
      });
    }
  });

  test("event containing a repository, adds repository to repos list", function() {
    return visit('/travis-ci/travis-core').then(function() {
      var payload;
      payload = {
        repository: {
          id: 10
        },
        build: {
          id: 10,
          repository_id: 10
        }
      };
      $.mockjax({
        url: '/builds/10',
        responseTime: 0,
        responseText: payload
      });
      Em.run(function() {
        return Travis.receive('build:started', {
          build: {
            id: 10
          },
          repository: {
            id: 10,
            slug: 'travis-ci/travis-support',
            last_build_id: 10,
            last_build_number: 10,
            last_build_started_at: '2012-07-02T00:01:00Z',
            last_build_finished_at: '2012-07-02T00:02:30Z',
            last_build_state: 'passed',
            last_build_duration: 90
          }
        });
      });
      return wait().then(function() {
        return listsRepo({
          row: 2,
          item: {
            slug: 'travis-ci/travis-support',
            build: {
              number: 4,
              url: '/travis-ci/travis-support/builds/10',
              duration: '1 min 30 sec',
              finishedAt: 'less than a minute ago'
            }
          }
        });
      });
    });
  });

  test("an event containing a created job, clears the job's log", function() {
    var payload;
    payload = {
      job: {
        id: 12,
        repository_id: 1,
        number: '1.4',
        queue: 'build.linux'
      }
    };
    return visit('/travis-ci/travis-core/').then(function() {
      Em.run(function() {
        logRendered();
        return Travis.receive('build:created', payload);
      });
      return wait().then(function() {
        return displaysLog([]);
      });
    });
  });

  test("an event containing a requeued job, clears the job's log", function() {
    var payload;
    payload = {
      job: {
        id: 12,
        repository_id: 1,
        number: '1.4',
        queue: 'build.linux'
      }
    };
    return visit('/travis-ci/travis-core').then(function() {
      Em.run(function() {
        logRendered();
        return Travis.receive('build:requeued', payload);
      });
      return wait().then(function() {
        return displaysLog([]);
      });
    });
  });

  test("an event with a build adds a build to a builds list", function() {
    return visit('/travis-ci/travis-core/builds').then(function() {
      var payload;
      payload = {
        build: {
          id: 11,
          repository_id: 1,
          commit_id: 1,
          number: '3',
          duration: 55,
          started_at: '2012-07-02T00:02:00Z',
          finished_at: '2012-07-02T00:02:55Z',
          event_type: 'push',
          message: 'commit message 3',
          commit: '1234567',
          state: 'failed',
          pull_request: false,
          pull_request_number: null,
          pull_request_title: null
        }
      };
      Em.run(function() {
        return Travis.receive('build:started', payload);
      });
      return wait().then(function() {
        return listsBuild({
          row: 1,
          item: {
            id: 11,
            slug: 'travis-ci/travis-core',
            number: '3',
            sha: '1234567',
            branch: 'master',
            message: 'commit message 3',
            finishedAt: 'less than a minute ago',
            duration: '55 sec',
            color: 'red'
          }
        });
      });
    });
  });

}).call(this);
(function() {
  module("Index page", {
    setup: function() {
      return Ember.run(function() {
        return Travis.advanceReadiness();
      });
    },
    teardown: function() {
      return Ember.run(function() {
        return Travis.reset();
      });
    }
  });

  test("displaying information on index page", function() {
    return visit('/travis-ci/travis-core').then(function() {
      listsRepos([
        {
          slug: 'travis-ci/travis-hub',
          build: {
            number: 4,
            url: '/travis-ci/travis-hub/builds/4',
            duration: '1 min',
            finishedAt: '-'
          }
        }, {
          slug: 'travis-ci/travis-core',
          build: {
            number: 1,
            url: '/travis-ci/travis-core/builds/1',
            duration: '30 sec',
            finishedAt: '3 minutes ago'
          }
        }, {
          slug: 'travis-ci/travis-assets',
          build: {
            number: 3,
            url: '/travis-ci/travis-assets/builds/3',
            duration: '30 sec',
            finishedAt: 'a day ago'
          }
        }
      ]);
      displaysRepository({
        href: '/travis-ci/travis-core'
      });
      displaysSummary({
        type: 'build',
        id: 1,
        repo: 'travis-ci/travis-core',
        commit: '1234567',
        branch: 'master',
        compare: '0123456..1234567',
        finishedAt: '3 minutes ago',
        duration: '30 sec',
        message: 'commit message 1'
      });
      displaysTabs({
        current: {
          href: '/travis-ci/travis-core',
          active: true
        },
        builds: {
          href: '/travis-ci/travis-core/builds'
        },
        build: {
          hidden: true
        },
        job: {
          hidden: true
        }
      });
      listsJobs({
        table: '#jobs',
        headers: ['Job', 'Duration', 'Finished', 'Ruby'],
        jobs: [
          {
            color: 'green',
            id: 1,
            number: '1.1',
            repo: 'travis-ci/travis-core',
            finishedAt: '3 minutes ago',
            duration: '30 sec',
            rvm: 'rbx'
          }, {
            color: 'red',
            id: 2,
            number: '1.2',
            repo: 'travis-ci/travis-core',
            finishedAt: '2 minutes ago',
            duration: '40 sec',
            rvm: '1.9.3'
          }
        ]
      });
      return listsJobs({
        table: '#allowed_failure_jobs',
        headers: ['Job', 'Duration', 'Finished', 'Ruby'],
        jobs: [
          {
            color: '',
            id: 3,
            number: '1.3',
            repo: 'travis-ci/travis-core',
            finishedAt: '-',
            duration: '-',
            rvm: 'jruby'
          }
        ]
      });
    });
  });

}).call(this);
(function() {
  module("Job page", {
    setup: function() {
      return Ember.run(function() {
        return Travis.advanceReadiness();
      });
    },
    teardown: function() {
      return Ember.run(function() {
        return Travis.reset();
      });
    }
  });

  test('displaying information on job page', function() {
    $.mockjax({
      url: '/jobs/1/log?cors_hax=true',
      responseTime: 0,
      responseText: "First line\ncontent:travis_fold:start:install\r$ Install something\nInstalling something\ncontent:travis_fold:end:install\r$ End"
    });
    return visit('/travis-ci/travis-core/jobs/1').then(function() {
      listsRepos([
        {
          slug: 'travis-ci/travis-hub',
          build: {
            number: 4,
            url: '/travis-ci/travis-hub/builds/4',
            duration: '1 min',
            finishedAt: '-'
          }
        }, {
          slug: 'travis-ci/travis-core',
          build: {
            number: 1,
            url: '/travis-ci/travis-core/builds/1',
            duration: '30 sec',
            finishedAt: '3 minutes ago'
          }
        }, {
          slug: 'travis-ci/travis-assets',
          build: {
            number: 3,
            url: '/travis-ci/travis-assets/builds/3',
            duration: '30 sec',
            finishedAt: 'a day ago'
          }
        }
      ]);
      displaysRepository({
        href: '/travis-ci/travis-core'
      });
      displaysSummary({
        id: 1,
        type: 'job',
        repo: 'travis-ci/travis-core',
        commit: '1234567',
        branch: 'master',
        compare: '0123456..1234567',
        finishedAt: '3 minutes ago',
        duration: '30 sec',
        message: 'commit message 1'
      });
      displaysTabs({
        current: {
          href: '/travis-ci/travis-core'
        },
        builds: {
          href: '/travis-ci/travis-core/builds'
        },
        build: {
          href: '/travis-ci/travis-core/builds/1'
        },
        job: {
          href: '/travis-ci/travis-core/jobs/1',
          active: true
        }
      });
      return displaysLog(['First line', '$ Install something', 'Installing something', '$ End']);
    });
  });

}).call(this);
(function() {
  module("Logs", {
    setup: function() {
      Ember.run(function() {
        return Travis.advanceReadiness();
      });
      this.sandbox = sinon.sandbox.create();
      return $.mockjax({
        url: '/jobs/1/log?cors_hax=true',
        responseTime: 0,
        responseText: "First line\ncontent:travis_fold:start:install\r$ Install something\nInstalling something\ncontent:travis_fold:end:install\r$ End"
      });
    },
    teardown: function() {
      Ember.run(function() {
        return Travis.reset();
      });
      return this.sandbox.restore();
    }
  });

  test('displaying the logs initializes the line selector', function() {
    var lineSelector, selector_stub;
    selector_stub = {
      willDestroy: this.sandbox.spy()
    };
    lineSelector = this.sandbox.stub(Travis, "LinesSelector").returns(selector_stub);
    return visit('/travis-ci/travis-core/jobs/1').then(function() {
      return ok(lineSelector.calledWithNew(), 'the lines selector has been initialized');
    });
  });

  test('displaying the log initializes the logger', function() {
    var log, scroll, scroll_stub;
    log = this.sandbox.stub(Log, "create").returns({
      set: this.sandbox.spy()
    });
    scroll_stub = {
      tryScroll: this.sandbox.spy()
    };
    scroll = this.sandbox.stub(Log, "Scroll").returns(scroll_stub);
    return visit('/travis-ci/travis-core/jobs/1').then(function() {
      return ok(log.calledWith({
        limit: Log.LIMIT,
        listeners: [scroll_stub]
      }), 'the logger has been initialized');
    });
  });

  test('displaying the logs initializes the log folder', function() {
    var folder_stub, logFolder;
    folder_stub = {};
    logFolder = this.sandbox.stub(Travis, "LogFolder").returns(folder_stub);
    return visit('/travis-ci/travis-core/jobs/1').then(function() {
      return ok(logFolder.calledWithNew(), 'the logs folder has been initialized');
    });
  });

}).call(this);
(function() {
  module("My repos", {
    setup: function() {
      return Ember.run(function() {
        return Travis.advanceReadiness();
      });
    },
    teardown: function() {
      return Ember.run(function() {
        return Travis.reset();
      });
    }
  });

  test("my repos is active by default when user is signed in", function() {
    Ember.run(function() {
      return signInUser();
    });
    return visit('/').then(function() {
      return wait().then(function() {
        listsRepos([
          {
            slug: 'travis-ci/travis-hub',
            build: {
              number: 4,
              url: '/travis-ci/travis-hub/builds/4',
              duration: '1 min',
              finishedAt: '-'
            }
          }, {
            slug: 'travis-ci/travis-core',
            build: {
              number: 1,
              url: '/travis-ci/travis-core/builds/1',
              duration: '30 sec',
              finishedAt: '3 minutes ago'
            }
          }
        ]);
        displaysRepository({
          href: '/travis-ci/travis-hub'
        });
        return displaysSummary({
          type: 'build',
          id: 4,
          repo: 'travis-ci/travis-hub',
          commit: '4567890',
          branch: 'master',
          compare: '0123456..4567890',
          finishedAt: '-',
          duration: '-',
          message: 'commit message 4'
        });
      });
    });
  });

  test("my repos is activated when user signs in", function() {
    return visit('/').then(function() {
      listsRepos([
        {
          slug: 'travis-ci/travis-hub',
          build: {
            number: 4,
            url: '/travis-ci/travis-hub/builds/4',
            duration: '1 min',
            finishedAt: '-'
          }
        }, {
          slug: 'travis-ci/travis-core',
          build: {
            number: 1,
            url: '/travis-ci/travis-core/builds/1',
            duration: '30 sec',
            finishedAt: '3 minutes ago'
          }
        }, {
          slug: 'travis-ci/travis-assets',
          build: {
            number: 3,
            url: '/travis-ci/travis-assets/builds/3',
            duration: '30 sec',
            finishedAt: 'a day ago'
          }
        }
      ]);
      Ember.run(function() {
        return signInUser();
      });
      return wait().then(function() {
        return listsRepos([
          {
            slug: 'travis-ci/travis-hub',
            build: {
              number: 4,
              url: '/travis-ci/travis-hub/builds/4',
              duration: '1 min',
              finishedAt: '-'
            }
          }, {
            slug: 'travis-ci/travis-core',
            build: {
              number: 1,
              url: '/travis-ci/travis-core/builds/1',
              duration: '30 sec',
              finishedAt: '3 minutes ago'
            }
          }
        ]);
      });
    });
  });

}).call(this);
(function() {
  module("Router", {
    teardown: function() {
      return Ember.run(function() {
        return Travis.reset();
      });
    }
  });

  test('renders notFound template when URL can\t be found', function() {
    return visit('/somehing/something/something/.../dark/side/..../something/something/something/.../complete').then(function() {
      return equal($('#main').text().trim(), 'The requested page was not found.');
    });
  });

  test('renders repo not found information when repo can\'t be found', function() {
    return visit('/what-is-this/i-dont-even').then(function() {
      return equal($('#main').text().trim(), 'The repository at what-is-this/i-dont-even was not found.');
    });
  });

}).call(this);
(function() {


}).call(this);
(function() {
  var now, oldSetup;

  document.write('<div id="ember-testing-container"><div id="ember-testing"></div></div>');

  Travis.rootElement = '#ember-testing';

  Travis.setupForTesting();

  Travis.injectTestHelpers();

  oldSetup = Travis.setup;

  Travis.ready = function() {
    oldSetup.apply(this, arguments);
    return Travis.lookup('auth:main').signOut();
  };

  window.exists = function(selector) {
    return !!find(selector).length;
  };

  Ember.Container.prototype.stub = function(fullName, instance) {
    instance.destroy = instance.destroy || (function() {});
    return this.cache.dict[fullName] = instance;
  };

  window.signInUser = function(data) {
    var userData;
    data || (data = {});
    userData = {
      id: 1,
      email: 'tyrion@example.org',
      login: 'tyrion',
      token: 'abcdef',
      created_at: "2011-05-10T15:43:59Z",
      gravatar_id: "582034b63279abeaa8e76acf12f5ee30",
      is_syncing: false,
      name: "Tyrion",
      synced_at: "2013-12-09T09:41:47Z"
    };
    userData = Ember.merge(userData, data);
    $.mockjax({
      url: '/users/1',
      responseTime: 10,
      responseText: {
        user: userData
      }
    });
    $.mockjax({
      url: '/users',
      responseTime: 10,
      responseText: {
        user: userData
      }
    });
    $.mockjax({
      url: '/users/permissions',
      responseTime: 10,
      responseText: {
        permissions: [],
        admin: [],
        push: [],
        pull: []
      }
    });
    $.mockjax({
      url: '/broadcasts',
      responseTime: 10,
      responseText: {
        broadcasts: []
      }
    });
    $.mockjax({
      url: '/accounts',
      responseTime: 10,
      responseText: {
        accounts: []
      }
    });
    return Travis.lookup('auth:main').signIn({
      user: userData,
      token: 'abcdef'
    });
  };

  now = function() {
    return new Date('2012-07-02T00:03:00Z');
  };

  $.timeago.settings.nowFunction = function() {
    return now().getTime();
  };

  Travis.currentDate = now;

}).call(this);
(function() {
  var record;

  record = null;

  module("Travis.Build", {
    setup: function() {},
    teardown: function() {
      Travis.Build.resetData();
      return Travis.Job.resetData();
    }
  });

  test('it takes into account all the jobs when getting config keys', function() {
    var build, buildConfig, configKeys, rawConfigKeys;
    buildConfig = {
      rvm: ['1.9.3', '2.0.0']
    };
    Travis.Build.load([
      {
        id: '1',
        job_ids: ['1', '2', '3'],
        config: buildConfig
      }
    ]);
    Travis.Job.load([
      {
        id: '1',
        config: {
          rvm: '1.9.3',
          env: 'FOO=foo'
        }
      }
    ]);
    Travis.Job.load([
      {
        id: '2',
        config: {
          rvm: '2.0.0',
          gemfile: 'Gemfile.1'
        }
      }
    ]);
    Travis.Job.load([
      {
        id: '3',
        config: {
          rvm: '1.9.3',
          jdk: 'OpenJDK'
        }
      }
    ]);
    build = null;
    rawConfigKeys = null;
    configKeys = null;
    Ember.run(function() {
      build = Travis.Build.find('1');
      rawConfigKeys = build.get('rawConfigKeys');
      return configKeys = build.get('configKeys');
    });
    deepEqual(rawConfigKeys, ['rvm', 'env', 'gemfile', 'jdk']);
    return deepEqual(configKeys, ['Job', 'Duration', 'Finished', 'Ruby', 'ENV', 'Gemfile', 'JDK']);
  });

}).call(this);
(function() {
  var record;

  record = null;

  module("Travis.Commit", {
    setup: function() {},
    teardown: function() {
      return Travis.Commit.resetData();
    }
  });

  test('it recognizes when author is committer', function() {
    Travis.Commit.load([
      {
        id: 1,
        committer_name: 'Jimmy',
        committer_email: 'jimmy@example.com',
        author_name: 'Jimmy',
        author_email: 'jimmy@example.com'
      }
    ]);
    return Ember.run(function() {
      record = Travis.Commit.find(1);
      console.log(record.get('authorName'));
      return equal(true, record.get('authorIsCommitter'));
    });
  });

  test('it recognizes when author is not committer', function() {
    Travis.Commit.load([
      {
        id: 1,
        committer_name: 'Jimmy',
        committer_email: 'jimmy@example.com',
        author_name: 'John',
        author_email: 'john@example.com'
      }
    ]);
    return Ember.run(function() {
      record = Travis.Commit.find(1);
      console.log(record.get('authorName'));
      return equal(false, record.get('authorIsCommitter'));
    });
  });

}).call(this);
(function() {
  module("Travis.Helpers.githubify");

  test('replaces #Num with github issues link', function() {
    var expected, message, result;
    message = 'Solved #11hey';
    result = Travis.Helpers.githubify(message, 'travis-ci', 'travis-web');
    expected = 'Solved <a href="https://github.com/travis-ci/travis-web/issues/11">#11</a>hey';
    return equal(result, expected, "#num should be converted to a link");
  });

  test('replaces User#Num with github issues link to forked repo', function() {
    var expected, message, result;
    message = 'Solved test#11hey';
    result = Travis.Helpers.githubify(message, 'travis-ci', 'travis-web');
    expected = 'Solved <a href="https://github.com/test/travis-web/issues/11">test#11</a>hey';
    return equal(result, expected, "user#num should be converted to a link");
  });

  test('replaces User/Project#Num with github issues link to another repo', function() {
    var expected, message, result;
    message = 'Solved test_1-a2/test-a_11#11hey';
    result = Travis.Helpers.githubify(message, 'travis-ci', 'travis-web');
    expected = 'Solved <a href="https://github.com/test_1-a2/test-a_11/issues/11">test_1-a2/test-a_11#11</a>hey';
    return equal(result, expected, "owner/repo#num should be converted to a link");
  });

  test('replaces gh-Num with github issues link', function() {
    var expected, message, result;
    message = 'Solved gh-22hey';
    result = Travis.Helpers.githubify(message, 'travis-ci', 'travis-web');
    expected = 'Solved <a href="https://github.com/travis-ci/travis-web/issues/22">gh-22</a>hey';
    return equal(result, expected, "gh-Num should be converted to a link");
  });

  test('replaces multiple references with github issues links', function() {
    var expected, message, result;
    message = 'Try #1 and test#2 and test/testing#3';
    result = Travis.Helpers.githubify(message, 'travis-ci', 'travis-web');
    expected = 'Try <a href="https://github.com/travis-ci/travis-web/issues/1">#1</a> and ';
    expected += '<a href="https://github.com/test/travis-web/issues/2">test#2</a> and ';
    expected += '<a href="https://github.com/test/testing/issues/3">test/testing#3</a>';
    return equal(result, expected, "references should be converted to links");
  });

  test('replaces multiple references with github issues links', function() {
    var expected, message, result;
    message = 'Try #1 and test#2 and test/testing#3';
    result = Travis.Helpers.githubify(message, 'travis-ci', 'travis-web');
    expected = 'Try <a href="https://github.com/travis-ci/travis-web/issues/1">#1</a> and ';
    expected += '<a href="https://github.com/test/travis-web/issues/2">test#2</a> and ';
    expected += '<a href="https://github.com/test/testing/issues/3">test/testing#3</a>';
    return equal(result, expected, "references should be converted to links");
  });

  test('replaces @user with github user link', function() {
    var expected, message, result;
    message = 'It is for you @tender_love1';
    result = Travis.Helpers.githubify(message, 'travis-ci', 'travis-web');
    expected = 'It is for you <a href="https://github.com/tender_love1">@tender_love1</a>';
    return equal(result, expected, "@user should be converted to a link");
  });

  test('does not replace @user if it is a sign-off', function() {
    var message, result;
    message = 'Signed-off-by: GitHub User <user@example.com>';
    result = Travis.Helpers.githubify(message, 'travis-ci', 'travis-web');
    return equal(result, message, "@user should not be converted to a link if it matches an email");
  });

  test('replaces one commit reference with github commit link', function() {
    var expected, message, result;
    message = 'See travis-ci/travis-core@732fe00';
    result = Travis.Helpers.githubify(message, 'travis-ci', 'travis-web');
    expected = 'See <a href="https://github.com/travis-ci/travis-core/commit/732fe00">travis-ci/travis-core@732fe00</a>';
    return equal(result, expected, "Commit reference should be converted to a link");
  });

  test('replaces multiple commit references with github commit links', function() {
    var expected, message, result;
    message = 'See travis-ci/travis-core@732fe00 and travis-ci/travis-web@3b6aa17';
    result = Travis.Helpers.githubify(message, 'travis-ci', 'travis-web');
    expected = 'See <a href="https://github.com/travis-ci/travis-core/commit/732fe00">travis-ci/travis-core@732fe00</a> and <a href="https://github.com/travis-ci/travis-web/commit/3b6aa17">travis-ci/travis-web@3b6aa17</a>';
    return equal(result, expected, "Commit references should be converted to links");
  });

}).call(this);
(function() {
  var record;

  record = null;

  module("Travis.Job", {
    setup: function() {},
    teardown: function() {
      Travis.Job.resetData();
      return Travis.Build.resetData();
    }
  });

  test('configKeys takes into account the keys of other jobs', function() {
    var buildConfig, configValues1, configValues2, configValues3, job1, job2, job3;
    buildConfig = {
      rvm: ['1.9.3', '2.0.0']
    };
    Travis.Build.load([
      {
        id: '1',
        job_ids: ['1', '2', '3'],
        config: buildConfig
      }
    ]);
    Travis.Job.load([
      {
        id: '1',
        config: {
          rvm: '1.9.3',
          env: 'FOO=foo'
        },
        build_id: '1'
      }
    ]);
    Travis.Job.load([
      {
        id: '2',
        config: {
          rvm: '2.0.0',
          gemfile: 'Gemfile.1'
        },
        build_id: '1'
      }
    ]);
    Travis.Job.load([
      {
        id: '3',
        config: {
          rvm: '1.9.3',
          jdk: 'OpenJDK'
        },
        build_id: '1'
      }
    ]);
    configValues1 = null;
    configValues2 = null;
    configValues3 = null;
    job1 = null;
    job2 = null;
    job3 = null;
    Ember.run(function() {
      job1 = Travis.Job.find('1');
      job2 = Travis.Job.find('2');
      return job3 = Travis.Job.find('3');
    });
    return wait().then(function() {
      Ember.run(function() {
        configValues1 = job1.get('configValues');
        configValues2 = job2.get('configValues');
        return configValues3 = job3.get('configValues');
      });
      deepEqual(configValues1, ['1.9.3', 'FOO=foo', void 0, void 0]);
      deepEqual(configValues2, ['2.0.0', void 0, 'Gemfile.1', void 0]);
      return deepEqual(configValues3, ['1.9.3', void 0, void 0, 'OpenJDK']);
    });
  });

  test('returns config values for all keys available on build with different number of config keys in sibling jobs', function() {
    var buildAttrs, configValues1, configValues2, job1, job2, jobAttrs;
    buildAttrs = {
      id: 1,
      job_ids: [1, 2],
      config: {
        jdk: ['oraclejdk7'],
        rvm: ['jruby-head']
      }
    };
    Travis.Build.load([buildAttrs]);
    jobAttrs = {
      id: 1,
      build_id: 1,
      config: {
        jdk: 'oraclejdk7',
        rvm: 'jruby-head'
      }
    };
    Travis.Job.load([jobAttrs]);
    jobAttrs = {
      id: 2,
      build_id: 1,
      config: {
        jdk: null,
        rvm: 'jruby-head'
      }
    };
    Travis.Job.load([jobAttrs]);
    configValues1 = null;
    configValues2 = null;
    job1 = null;
    job2 = null;
    Ember.run(function() {
      job1 = Travis.Job.find(1);
      return job2 = Travis.Job.find(2);
    });
    return wait().then(function() {
      Ember.run(function() {
        configValues1 = job1.get('configValues');
        return configValues2 = job2.get('configValues');
      });
      deepEqual(configValues1, ['oraclejdk7', 'jruby-head']);
      return deepEqual(configValues2, [void 0, 'jruby-head']);
    });
  });

}).call(this);
(function() {
  module('Travis.LimitedArray');

  test('limits given content', function() {
    var array, content;
    content = [1, 2, 3];
    array = Travis.LimitedArray.create({
      content: content,
      limit: 2
    });
    equal(array.get('length'), 2);
    return deepEqual(array.toArray(), [1, 2]);
  });

  test('inserts content at the right place when unshifting', function() {
    var array, content;
    content = [1, 2, 3];
    array = Travis.LimitedArray.create({
      content: content,
      limit: 2
    });
    content.unshiftObject(0);
    equal(array.get('length'), 2);
    return deepEqual(array.toArray(), [0, 1]);
  });

  test('does not insert content when it\'s inserted not in the limited range', function() {
    var array, content;
    content = [1, 2, 3];
    array = Travis.LimitedArray.create({
      content: content,
      limit: 2
    });
    content.pushObject(0);
    equal(array.get('length'), 2);
    return deepEqual(array.toArray(), [1, 2]);
  });

  test('properly removes items', function() {
    var array, content;
    content = [1, 2, 3];
    array = Travis.LimitedArray.create({
      content: content,
      limit: 2
    });
    content.shiftObject();
    equal(array.get('length'), 2);
    deepEqual(array.toArray(), [2, 3]);
    content.shiftObject();
    equal(array.get('length'), 1);
    deepEqual(array.toArray(), [3]);
    content.shiftObject();
    return equal(array.get('length'), 0);
  });

  test('allows to expand array to show all items', function() {
    var array, content;
    content = [1, 2, 3];
    array = Travis.LimitedArray.create({
      content: content,
      limit: 2
    });
    Ember.run(function() {
      return array.showAll();
    });
    equal(array.get('length'), 3);
    return deepEqual(array.toArray(), [1, 2, 3]);
  });

}).call(this);
(function() {
  var element, fakeFolder, fakeLocation, fakeScroll;

  fakeLocation = {
    getHash: function() {
      return this.hash || '';
    },
    setHash: function(hash) {
      return this.hash = hash;
    }
  };

  fakeScroll = {
    tryScroll: sinon.spy()
  };

  fakeFolder = {};

  element = jQuery('<div id="fakeLog"> <p><a></a>first line</p> <p><a></a>second line</p> <p><a></a>third line</p> </div>');

  module("Travis.LinesSelector", {
    setup: function() {
      fakeFolder.unfold = sinon.spy();
      fakeLocation.hash = '';
      return jQuery('body').append(element);
    },
    teardown: function() {
      return element.remove();
    }
  });

  test("defaults to no line selected", function() {
    Ember.run(function() {
      return new Travis.LinesSelector(element, fakeScroll, fakeFolder, fakeLocation);
    });
    return wait().then(function() {
      return equal($('#fakeLog p.highlight').length, 0);
    });
  });

  test("defaults to a single line selected", function() {
    fakeLocation.hash = '#L2';
    Ember.run(function() {
      return new Travis.LinesSelector(element, fakeScroll, fakeFolder, fakeLocation);
    });
    return wait().then(function() {
      equal($('#fakeLog p.highlight').length, 1);
      return equal($('#fakeLog p:nth-child(2)').hasClass('highlight'), true);
    });
  });

  test("defaults to multiple lines selected", function() {
    fakeLocation.hash = '#L2-L3';
    Ember.run(function() {
      return new Travis.LinesSelector(element, fakeScroll, fakeFolder, fakeLocation);
    });
    return wait().then(function() {
      equal($('#fakeLog p.highlight').length, 2);
      equal($('#fakeLog p:nth-child(2)').hasClass('highlight'), true);
      return equal($('#fakeLog p:nth-child(3)').hasClass('highlight'), true);
    });
  });

  test("selects a single line", function() {
    Ember.run(function() {
      return new Travis.LinesSelector(element, fakeScroll, fakeFolder, fakeLocation);
    });
    return wait().then(function() {
      equal($('#fakeLog p.highlight').length, 0);
      $('#fakeLog p:first a').click();
      equal($('#fakeLog p.highlight').length, 1);
      equal($('#fakeLog p:nth-child(1)').hasClass('highlight'), true);
      return equal('#L1', fakeLocation.hash);
    });
  });

  test("selects multiple lines", function() {
    fakeLocation.hash = '#L2';
    Ember.run(function() {
      return new Travis.LinesSelector(element, fakeScroll, fakeFolder, fakeLocation);
    });
    return wait().then(function() {
      var event;
      equal($('#fakeLog p.highlight').length, 1);
      event = jQuery.Event('click');
      event.shiftKey = true;
      $('#fakeLog p:first a').trigger(event);
      equal($('#fakeLog p.highlight').length, 2);
      equal($('#fakeLog p:nth-child(1)').hasClass('highlight'), true);
      equal($('#fakeLog p:nth-child(2)').hasClass('highlight'), true);
      return equal('#L1-L2', fakeLocation.hash);
    });
  });

  test("uses the last selected line as second selection line", function() {
    var selector;
    selector = null;
    Ember.run(function() {
      return selector = new Travis.LinesSelector(element, fakeScroll, fakeFolder, fakeLocation);
    });
    return wait().then(function() {
      var event;
      $('#fakeLog p:last a').click();
      equal($('#fakeLog p.highlight').length, 1);
      equal(3, selector.last_selected_line);
      event = jQuery.Event('click');
      event.shiftKey = true;
      $('#fakeLog p:first a').trigger(event);
      equal($('#fakeLog p.highlight').length, 3);
      equal($('#fakeLog p:nth-child(1)').hasClass('highlight'), true);
      equal($('#fakeLog p:nth-child(2)').hasClass('highlight'), true);
      equal($('#fakeLog p:nth-child(3)').hasClass('highlight'), true);
      equal('#L1-L3', fakeLocation.hash);
      return equal(1, selector.last_selected_line);
    });
  });

  test("unfolds the first and last selected lines", function() {
    fakeLocation.hash = '#L1-L3';
    Ember.run(function() {
      return new Travis.LinesSelector(element, fakeScroll, fakeFolder, fakeLocation);
    });
    return wait().then(function() {
      return ok(fakeFolder.unfold.calledTwice, 'the first and last lines have been unfolded');
    });
  });

}).call(this);
(function() {
  module("Travis.LogChunks");

  test("it doesn't trigger downloading missing parts if they come in timely fashion", function() {
    var callback, chunks;
    expect(2);
    stop();
    callback = function() {
      return ok(false, 'callback should not be called');
    };
    chunks = Travis.LogChunks.create({
      timeout: 20,
      missingPartsCallback: callback,
      content: []
    });
    Ember.run.later((function() {
      return chunks.pushObject({
        number: 1,
        final: false
      });
    }), 10);
    Ember.run.later((function() {
      return chunks.pushObject({
        number: 2,
        final: false
      });
    }), 20);
    return setTimeout(function() {
      ok(true);
      Ember.run(function() {
        return chunks.pushObject({
          number: 3,
          final: true
        });
      });
      start();
      return equal(chunks.get('finalized'), true, 'log should be finalized');
    }, 30);
  });

  test("it triggers downloading missing parts if there is a missing part, even though final part arrived", function() {
    var callback, chunks;
    expect(3);
    stop();
    callback = function(missingNumbers) {
      return deepEqual(missingNumbers, [2, 3], 'callback should be called with missing numbers');
    };
    chunks = Travis.LogChunks.create({
      timeout: 20,
      missingPartsCallback: callback,
      content: []
    });
    Ember.run(function() {
      return chunks.pushObject({
        number: 1,
        final: false
      });
    });
    setTimeout(function() {
      Ember.run(function() {
        return chunks.pushObject({
          number: 4,
          final: true
        });
      });
      return ok(!chunks.get('finalized'), "log shouldn't be finalized");
    }, 10);
    return setTimeout(function() {
      Ember.run(function() {
        return chunks.destroy();
      });
      return start();
    }, 60);
  });

  test("it triggers downloading next parts if there is no final part", function() {
    var callback, chunks;
    expect(4);
    stop();
    callback = function(missingNumbers, after) {
      deepEqual(missingNumbers, [2], 'callback should be called with missing numbers');
      return equal(after, 3, 'callback should be called with "after" argument');
    };
    chunks = Travis.LogChunks.create({
      timeout: 15,
      missingPartsCallback: callback,
      content: []
    });
    Ember.run(function() {
      chunks.pushObject({
        number: 1,
        final: false
      });
      return chunks.pushObject({
        number: 3,
        final: false
      });
    });
    return setTimeout(function() {
      Ember.run(function() {
        return chunks.destroy();
      });
      return start();
    }, 35);
  });

  test("it triggers downloading all available parts if there is no parts yet", function() {
    var callback, chunks;
    expect(2);
    stop();
    callback = function(missingNumbers, after) {
      ok(!missingNumbers, 'there should be no missing parts');
      return ok(!after, 'after should not be specified');
    };
    chunks = Travis.LogChunks.create({
      timeout: 15,
      missingPartsCallback: callback,
      content: []
    });
    return setTimeout(function() {
      Ember.run(function() {
        return chunks.destroy();
      });
      return start();
    }, 25);
  });

}).call(this);
(function() {
  var element, logFolder;

  element = jQuery('<div id="fakeLog"> <p>first line</p> <div class="fold"> <p>second line</p> <p>third line</p> </div> <p>fourth line</p> </div>');

  logFolder = null;

  module("Travis.LogFolder", {
    setup: function() {
      jQuery('body').append(element);
      return logFolder = new Travis.LogFolder(jQuery('#fakeLog'));
    },
    teardown: function() {
      return element.remove();
    }
  });

  test("displays the fold", function() {
    equal($('#fakeLog .fold.open').length, 0);
    $('#fakeLog .fold p:first').click();
    return equal($('#fakeLog .fold.open').length, 1);
  });

  test("hides the fold", function() {
    $('#fakeLog .fold').addClass('open');
    $('#fakeLog .fold p:first').click();
    return equal($('#fakeLog .fold.open').length, 0);
  });

  test("binds new elements", function() {
    var new_element;
    new_element = jQuery('<div class="fold"> <p>fifth line</p> </div>');
    jQuery('#fakeLog').append(new_element);
    equal($('#fakeLog .fold.open').length, 0);
    $('#fakeLog .fold p:first-child').click();
    return equal($('#fakeLog .fold.open').length, 2);
  });

  test("fold", function() {
    var fold, line;
    fold = jQuery('#fakeLog .fold');
    line = fold.find('p:first');
    fold.addClass('open');
    equal(fold.hasClass('open'), true);
    logFolder.fold(line);
    return equal(fold.hasClass('open'), false);
  });

  test("unfold", function() {
    var fold, line;
    fold = jQuery('#fakeLog .fold');
    line = fold.find('p:first');
    equal(fold.hasClass('open'), false);
    logFolder.unfold(line);
    return equal(fold.hasClass('open'), true);
  });

}).call(this);
(function() {
  var Author, Comment, Post, fullPostHash;

  fullPostHash = null;

  Post = null;

  Author = null;

  Comment = null;

  module("Travis.Model", {
    setup: function() {
      fullPostHash = {
        id: '1',
        title: 'foo',
        published_at: 'today',
        author_id: '1',
        comment_ids: ['1', '2']
      };
      Author = Travis.Model.extend({
        name: Ember.attr('string')
      });
      Author.toString = function() {
        return 'Author';
      };
      Comment = Travis.Model.extend({
        body: Ember.attr('string')
      });
      Comment.toString = function() {
        return 'Comment';
      };
      Post = Travis.Model.extend({
        title: Ember.attr('string'),
        publishedAt: Ember.attr('string'),
        author: Ember.belongsTo(Author, {
          key: 'author_id'
        }),
        comments: Ember.hasMany(Comment, {
          key: 'comment_ids'
        })
      });
      Post.toString = function() {
        return 'Post';
      };
      Comment.adapter = Ember.FixtureAdapter.create();
      Author.adapter = Ember.FixtureAdapter.create();
      Post.adapter = Ember.FixtureAdapter.create();
      Author.load([
        {
          id: '1',
          name: 'drogus'
        }
      ]);
      return Comment.load([
        {
          id: '1',
          body: 'comment 1'
        }, {
          id: '2',
          body: 'comment 2'
        }
      ]);
    }
  });

  test("new data can be merged into the record", function() {
    var author, post, title;
    delete fullPostHash.title;
    delete fullPostHash.author_id;
    delete fullPostHash.comment_ids;
    post = Post.findFromCacheOrLoad(fullPostHash);
    post.loadTheRest = (function() {});
    equal(post.get('title'), null, 'title should be null');
    equal(post.get('comments.length'), 0, 'comments should be empty');
    equal(post.get('author'), null, 'author should be null');
    Ember.run(function() {
      return post.merge({
        title: 'teh title',
        comment_ids: ['1', '2'],
        author_id: '1'
      });
    });
    author = null;
    Ember.run(function() {
      return author = Author.find('1').get('name');
    });
    title = null;
    Ember.run(function() {
      return title = post.get('title');
    });
    console.log('title', title);
    equal(post.get('title'), 'teh title', 'title should be updated');
    equal(post.get('comments.length'), 2, 'comments should be updated and have length of 2');
    equal(post.get('comments.firstObject.body'), 'comment 1', 'comment should be loaded');
    equal(author, 'drogus', 'author should be loaded');
    return equal(post.get('publishedAt'), 'today', 'existing attributes are not overwritten');
  });

  module("Travis.Model.loadOrMerge", {
    setup: function() {
      Post = Travis.Model.extend({
        title: Ember.attr('string')
      });
      return Post.toString = function() {
        return 'Post';
      };
    }
  });

  test("it doesn't update record if skipIfExists is passed and record is already in store", function() {
    var post;
    Post.load([
      {
        id: '1',
        title: 'foo'
      }
    ]);
    post = Post.find('1');
    equal(post.get('title'), 'foo', 'precondition - title of the post should be set');
    Ember.run(function() {
      return Travis.loadOrMerge(Post, {
        id: '1',
        title: 'bar'
      }, {
        skipIfExists: true
      });
    });
    return equal(post.get('title'), 'foo', 'title should stay unchanged');
  });

  test("it updates record if record is already in the store", function() {
    var post;
    Post.load([
      {
        id: '1',
        title: 'foo'
      }
    ]);
    post = Post.find('1');
    equal(post.get('title'), 'foo', 'precondition - title of the post should be set');
    Ember.run(function() {
      return Travis.loadOrMerge(Post, {
        id: '1',
        title: 'bar'
      });
    });
    return equal(post.get('title'), 'bar', 'title should be updated');
  });

  test("record is not instantiated by default", function() {
    var post, reference;
    reference = null;
    Ember.run(function() {
      return reference = Travis.loadOrMerge(Post, {
        id: '1',
        title: 'bar'
      });
    });
    equal(reference.id, '1', 'reference should be created');
    ok(Ember.isNone(reference.record), 'record should not be created');
    post = null;
    Ember.run(function() {
      return post = Post.find('1');
    });
    equal(post.get('title'), 'bar', 'record should be loaded from cached data');
    return equal(reference.record, post, 'record should be created');
  });

  test("data is merged to the existing data cache", function() {
    var post;
    Post.load([
      {
        id: '1',
        title: 'foo'
      }
    ]);
    Ember.run(function() {
      return Travis.loadOrMerge(Post, {
        id: '1',
        title: 'bar'
      });
    });
    post = Post.find('1');
    return equal(post.get('title'), 'bar', 'title should be updated');
  });

}).call(this);
(function() {
  var element, fakeWindow, log, tail;

  fakeWindow = {
    scroll: sinon.spy(),
    scrollTop: sinon.stub().returns(0),
    height: sinon.stub().returns(40)
  };

  element = jQuery('<div id="specTail"></div>');

  log = jQuery('<div id="specLog"></div>');

  tail = new Travis.Tailing(fakeWindow, '#specTail', '#specLog');

  tail.tail = function() {
    return element;
  };

  tail.log = function() {
    return log;
  };

  module("Travis.Tailing", {
    setup: function() {
      jQuery('body').append(element);
      return jQuery('body').append(log);
    },
    teardown: function() {
      element.remove();
      log.remove();
      return tail.stop();
    }
  });

}).call(this);
(function() {
  var record;

  record = null;

  module("Travis.User", {
    setup: function() {},
    teardown: function() {
      return Travis.User.resetData();
    }
  });

  test('', function() {
    var adminPermissions, pushPermissions, user, userData;
    userData = {
      id: 1,
      email: 'tyrion@example.org',
      login: 'tyrion',
      token: 'abcdef',
      created_at: "2011-05-10T15:43:59Z",
      gravatar_id: "582034b63279abeaa8e76acf12f5ee30",
      is_syncing: false,
      name: "Tyrion",
      synced_at: "2013-12-09T09:41:47Z"
    };
    $.mockjax({
      url: '/users/1',
      responseTime: 10,
      responseText: {
        user: userData
      }
    });
    Travis.User.load([
      {
        id: '1',
        login: 'test@travis-ci.org'
      }
    ]);
    user = null;
    pushPermissions = null;
    adminPermissions = null;
    Ember.run(function() {
      user = Travis.User.find(1);
      user.set('_rawPermissions', {
        then: function(func) {
          return func({
            permissions: [1],
            admin: [1],
            pull: [2],
            push: [3]
          });
        }
      });
      pushPermissions = user.get('pushPermissions');
      return adminPermissions = user.get('adminPermissions');
    });
    return wait().then(function() {
      deepEqual(adminPermissions.toArray(), [1]);
      return deepEqual(pushPermissions.toArray(), [3]);
    });
  });

}).call(this);
