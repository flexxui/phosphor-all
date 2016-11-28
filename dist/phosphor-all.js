/*
Copyright (c) 2014-2016, PhosphorJS Contributors
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
(function(modules) {
	var installedModules = {};
	function __webpack_require__(moduleId) {
		if(installedModules[moduleId])
			return installedModules[moduleId].exports;
		var module = installedModules[moduleId] = {
			exports: {},
			id: moduleId,
			loaded: false
		};
		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
		module.loaded = true;
		return module.exports;
	}
	__webpack_require__.m = modules;
	__webpack_require__.c = installedModules;
	__webpack_require__.p = "";
	return __webpack_require__(0);
})
([
function(module, exports, __webpack_require__) {
	var phosphor_version = "0.7.0";
	function require_phosphor (path) {
		if (path.endsWith('.js')) { path = path.slice(0, -3); }
		if (path.startsWith('/')) { path = path.slice(1); }
		if (path.startsWith('phosphor/')) { path = path.slice(9); }
		var mod = modules[path];
		if (typeof mod === 'undefined') {
			throw "Phosphor lib '" + path + "' is not present in Phosphor-all bundle.";
		}
		return mod;
	}
	require_phosphor.phosphor_version = phosphor_version;
	window.require_phosphor = require_phosphor;
	var modules = {};
	modules["lib/core/disposable"] = __webpack_require__(1);
	modules["lib/core/messaging"] = __webpack_require__(3);
	modules["lib/core/mimedata"] = __webpack_require__(7);
	modules["lib/core/properties"] = __webpack_require__(8);
	modules["lib/core/signaling"] = __webpack_require__(9);
	modules["lib/core/token"] = __webpack_require__(10);
	modules["lib/dom/cursor"] = __webpack_require__(11);
	modules["lib/dom/dragdrop"] = __webpack_require__(12);
	modules["lib/dom/platform"] = __webpack_require__(13);
	modules["lib/dom/query"] = __webpack_require__(14);
	modules["lib/dom/selector"] = __webpack_require__(15);
	modules["lib/dom/sizing"] = __webpack_require__(16);
	modules["lib/ui/application"] = __webpack_require__(17);
	modules["lib/ui/boxengine"] = __webpack_require__(27);
	modules["lib/ui/boxpanel"] = __webpack_require__(28);
	modules["lib/ui/commandpalette"] = __webpack_require__(31);
	modules["lib/ui/commandregistry"] = __webpack_require__(18);
	modules["lib/ui/dockpanel"] = __webpack_require__(32);
	modules["lib/ui/focustracker"] = __webpack_require__(33);
	modules["lib/ui/keyboard"] = __webpack_require__(24);
	modules["lib/ui/keymap"] = __webpack_require__(19);
	modules["lib/ui/menu"] = __webpack_require__(36);
	modules["lib/ui/menubar"] = __webpack_require__(37);
	modules["lib/ui/panel"] = __webpack_require__(30);
	modules["lib/ui/scrollbar"] = __webpack_require__(38);
	modules["lib/ui/splitpanel"] = __webpack_require__(39);
	modules["lib/ui/stackedpanel"] = __webpack_require__(40);
	modules["lib/ui/tabbar"] = __webpack_require__(34);
	modules["lib/ui/tabpanel"] = __webpack_require__(41);
	modules["lib/ui/title"] = __webpack_require__(26);
	modules["lib/ui/vdom"] = __webpack_require__(35);
	modules["lib/ui/widget"] = __webpack_require__(25);
	modules["lib/collections/deque"] = __webpack_require__(42);
	modules["lib/collections/queue"] = __webpack_require__(6);
	modules["lib/collections/stack"] = __webpack_require__(43);
	modules["lib/collections/vector"] = __webpack_require__(23);
	modules["lib/algorithm/iteration"] = __webpack_require__(2);
	modules["lib/algorithm/json"] = __webpack_require__(20);
	modules["lib/algorithm/mutation"] = __webpack_require__(29);
	modules["lib/algorithm/range"] = __webpack_require__(44);
	modules["lib/algorithm/searching"] = __webpack_require__(21);
	modules["lib/algorithm/sequence"] = __webpack_require__(22);
	modules["lib/algorithm/sorting"] = __webpack_require__(45);
},
function(module, exports, __webpack_require__) {
	"use strict";
	var iteration_1 = __webpack_require__(2);
	var DisposableDelegate = (function () {
		function DisposableDelegate(callback) {
			this._callback = callback || null;
		}
		Object.defineProperty(DisposableDelegate.prototype, "isDisposed", {
			get: function () {
				return this._callback === null;
			},
			enumerable: true,
			configurable: true
		});
		DisposableDelegate.prototype.dispose = function () {
			if (this._callback === null) {
				return;
			}
			var callback = this._callback;
			this._callback = null;
			callback();
		};
		return DisposableDelegate;
	}());
	exports.DisposableDelegate = DisposableDelegate;
	var DisposableSet = (function () {
		function DisposableSet(items) {
			var _this = this;
			this._set = new Set();
			if (items)
				iteration_1.each(items, function (item) { _this._set.add(item); });
		}
		Object.defineProperty(DisposableSet.prototype, "isDisposed", {
			get: function () {
				return this._set === null;
			},
			enumerable: true,
			configurable: true
		});
		DisposableSet.prototype.dispose = function () {
			if (this._set === null) {
				return;
			}
			var set = this._set;
			this._set = null;
			set.forEach(function (item) { item.dispose(); });
		};
		DisposableSet.prototype.add = function (item) {
			if (this._set === null) {
				throw new Error('Object is disposed');
			}
			this._set.add(item);
		};
		DisposableSet.prototype.remove = function (item) {
			if (this._set === null) {
				throw new Error('Object is disposed');
			}
			this._set.delete(item);
		};
		DisposableSet.prototype.clear = function () {
			if (this._set === null) {
				throw new Error('Object is disposed');
			}
			this._set.clear();
		};
		return DisposableSet;
	}());
	exports.DisposableSet = DisposableSet;
},
function(module, exports) {
	"use strict";
	function iter(object) {
		var it;
		if (typeof object.iter === 'function') {
			it = object.iter();
		}
		else {
			it = new ArrayIterator(object, 0);
		}
		return it;
	}
	exports.iter = iter;
	function toArray(object) {
		var value;
		var result = [];
		var it = iter(object);
		while ((value = it.next()) !== void 0) {
			result[result.length] = value;
		}
		return result;
	}
	exports.toArray = toArray;
	function empty() {
		return new EmptyIterator();
	}
	exports.empty = empty;
	var EmptyIterator = (function () {
		function EmptyIterator() {
		}
		EmptyIterator.prototype.iter = function () {
			return this;
		};
		EmptyIterator.prototype.clone = function () {
			return new EmptyIterator();
		};
		EmptyIterator.prototype.next = function () {
			return void 0;
		};
		return EmptyIterator;
	}());
	exports.EmptyIterator = EmptyIterator;
	var ArrayIterator = (function () {
		function ArrayIterator(source, start) {
			this._source = source;
			this._index = start;
		}
		ArrayIterator.prototype.iter = function () {
			return this;
		};
		ArrayIterator.prototype.clone = function () {
			return new ArrayIterator(this._source, this._index);
		};
		ArrayIterator.prototype.next = function () {
			if (this._index >= this._source.length) {
				return void 0;
			}
			return this._source[this._index++];
		};
		return ArrayIterator;
	}());
	exports.ArrayIterator = ArrayIterator;
	function each(object, fn) {
		var value;
		var it = iter(object);
		while ((value = it.next()) !== void 0) {
			fn(value);
		}
	}
	exports.each = each;
	function every(object, fn) {
		var value;
		var it = iter(object);
		while ((value = it.next()) !== void 0) {
			if (!fn(value)) {
				return false;
			}
		}
		return true;
	}
	exports.every = every;
	function some(object, fn) {
		var value;
		var it = iter(object);
		while ((value = it.next()) !== void 0) {
			if (fn(value)) {
				return true;
			}
		}
		return false;
	}
	exports.some = some;
	function reduce(object, fn, initial) {
		var it = iter(object);
		var first = it.next();
		if (first === void 0 && initial === void 0) {
			throw new TypeError('Reduce of empty iterable with no initial value.');
		}
		if (first === void 0) {
			return initial;
		}
		var second = it.next();
		if (second === void 0 && initial === void 0) {
			return first;
		}
		if (second === void 0) {
			return fn(initial, first);
		}
		var accumulator;
		if (initial === void 0) {
			accumulator = fn(first, second);
		}
		else {
			accumulator = fn(fn(initial, first), second);
		}
		var next;
		while ((next = it.next()) !== void 0) {
			accumulator = fn(accumulator, next);
		}
		return accumulator;
	}
	exports.reduce = reduce;
	function filter(object, fn) {
		return new FilterIterator(iter(object), fn);
	}
	exports.filter = filter;
	var FilterIterator = (function () {
		function FilterIterator(source, fn) {
			this._source = source;
			this._fn = fn;
		}
		FilterIterator.prototype.iter = function () {
			return this;
		};
		FilterIterator.prototype.clone = function () {
			return new FilterIterator(this._source.clone(), this._fn);
		};
		FilterIterator.prototype.next = function () {
			var value;
			var fn = this._fn;
			var it = this._source;
			while ((value = it.next()) !== void 0) {
				if (fn(value)) {
					return value;
				}
			}
			return void 0;
		};
		return FilterIterator;
	}());
	exports.FilterIterator = FilterIterator;
	function map(object, fn) {
		return new MapIterator(iter(object), fn);
	}
	exports.map = map;
	var MapIterator = (function () {
		function MapIterator(source, fn) {
			this._source = source;
			this._fn = fn;
		}
		MapIterator.prototype.iter = function () {
			return this;
		};
		MapIterator.prototype.clone = function () {
			return new MapIterator(this._source.clone(), this._fn);
		};
		MapIterator.prototype.next = function () {
			var value = this._source.next();
			if (value === void 0) {
				return void 0;
			}
			return this._fn.call(void 0, value);
		};
		return MapIterator;
	}());
	exports.MapIterator = MapIterator;
	function enumerate(object, start) {
		if (start === void 0) { start = 0; }
		return new EnumerateIterator(iter(object), start);
	}
	exports.enumerate = enumerate;
	var EnumerateIterator = (function () {
		function EnumerateIterator(source, start) {
			this._source = source;
			this._index = start;
		}
		EnumerateIterator.prototype.iter = function () {
			return this;
		};
		EnumerateIterator.prototype.clone = function () {
			return new EnumerateIterator(this._source.clone(), this._index);
		};
		EnumerateIterator.prototype.next = function () {
			var value = this._source.next();
			if (value === void 0) {
				return void 0;
			}
			return [this._index++, value];
		};
		return EnumerateIterator;
	}());
	exports.EnumerateIterator = EnumerateIterator;
	function once(value) {
		return new RepeatIterator(value, 1);
	}
	exports.once = once;
	function repeat(value, count) {
		return new RepeatIterator(value, count);
	}
	exports.repeat = repeat;
	var RepeatIterator = (function () {
		function RepeatIterator(value, count) {
			this._value = value;
			this._count = count;
		}
		RepeatIterator.prototype.iter = function () {
			return this;
		};
		RepeatIterator.prototype.clone = function () {
			return new RepeatIterator(this._value, this._count);
		};
		RepeatIterator.prototype.next = function () {
			if (this._count <= 0) {
				return void 0;
			}
			this._count--;
			return this._value;
		};
		return RepeatIterator;
	}());
	exports.RepeatIterator = RepeatIterator;
	function chain() {
		var objects = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			objects[_i - 0] = arguments[_i];
		}
		return new ChainIterator(map(objects, iter));
	}
	exports.chain = chain;
	var ChainIterator = (function () {
		function ChainIterator(source) {
			this._cloned = false;
			this._source = source;
			this._active = void 0;
		}
		ChainIterator.prototype.iter = function () {
			return this;
		};
		ChainIterator.prototype.clone = function () {
			var result = new ChainIterator(this._source.clone());
			result._active = this._active && this._active.clone();
			result._cloned = true;
			this._cloned = true;
			return result;
		};
		ChainIterator.prototype.next = function () {
			if (this._active === void 0) {
				this._active = this._source.next();
				if (this._active === void 0) {
					return void 0;
				}
				if (this._cloned) {
					this._active = this._active.clone();
				}
			}
			var value = this._active.next();
			if (value !== void 0) {
				return value;
			}
			this._active = void 0;
			return this.next();
		};
		return ChainIterator;
	}());
	exports.ChainIterator = ChainIterator;
	function zip() {
		var objects = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			objects[_i - 0] = arguments[_i];
		}
		return new ZipIterator(objects.map(iter));
	}
	exports.zip = zip;
	var ZipIterator = (function () {
		function ZipIterator(source) {
			this._source = source;
		}
		ZipIterator.prototype.iter = function () {
			return this;
		};
		ZipIterator.prototype.clone = function () {
			return new ZipIterator(this._source.map(function (it) { return it.clone(); }));
		};
		ZipIterator.prototype.next = function () {
			var iters = this._source;
			var result = new Array(iters.length);
			for (var i = 0, n = iters.length; i < n; ++i) {
				var value = iters[i].next();
				if (value === void 0) {
					return void 0;
				}
				result[i] = value;
			}
			return result;
		};
		return ZipIterator;
	}());
	exports.ZipIterator = ZipIterator;
	function stride(object, step) {
		return new StrideIterator(iter(object), step);
	}
	exports.stride = stride;
	var StrideIterator = (function () {
		function StrideIterator(source, step) {
			this._source = source;
			this._step = step;
		}
		StrideIterator.prototype.iter = function () {
			return this;
		};
		StrideIterator.prototype.clone = function () {
			return new StrideIterator(this._source.clone(), this._step);
		};
		StrideIterator.prototype.next = function () {
			var value = this._source.next();
			if (value === void 0) {
				return void 0;
			}
			var step = this._step;
			while (--step > 0) {
				this._source.next();
			}
			return value;
		};
		return StrideIterator;
	}());
	exports.StrideIterator = StrideIterator;
},
function(module, exports, __webpack_require__) {
	(function(setImmediate) {"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
		for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
		function __() { this.constructor = d; }
		d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var iteration_1 = __webpack_require__(2);
	var queue_1 = __webpack_require__(6);
	var Message = (function () {
		function Message(type) {
			this._type = type;
		}
		Object.defineProperty(Message.prototype, "type", {
			get: function () {
				return this._type;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Message.prototype, "isConflatable", {
			get: function () {
				return false;
			},
			enumerable: true,
			configurable: true
		});
		Message.prototype.conflate = function (other) {
			return false;
		};
		return Message;
	}());
	exports.Message = Message;
	var ConflatableMessage = (function (_super) {
		__extends(ConflatableMessage, _super);
		function ConflatableMessage() {
			_super.apply(this, arguments);
		}
		Object.defineProperty(ConflatableMessage.prototype, "isConflatable", {
			get: function () {
				return true;
			},
			enumerable: true,
			configurable: true
		});
		ConflatableMessage.prototype.conflate = function (other) {
			return true;
		};
		return ConflatableMessage;
	}(Message));
	exports.ConflatableMessage = ConflatableMessage;
	function sendMessage(handler, msg) {
		MessageLoop.sendMessage(handler, msg);
	}
	exports.sendMessage = sendMessage;
	function postMessage(handler, msg) {
		MessageLoop.postMessage(handler, msg);
	}
	exports.postMessage = postMessage;
	function installMessageHook(handler, hook) {
		MessageLoop.installMessageHook(handler, hook);
	}
	exports.installMessageHook = installMessageHook;
	function removeMessageHook(handler, hook) {
		MessageLoop.removeMessageHook(handler, hook);
	}
	exports.removeMessageHook = removeMessageHook;
	function clearMessageData(handler) {
		MessageLoop.clearMessageData(handler);
	}
	exports.clearMessageData = clearMessageData;
	var MessageLoop;
	(function (MessageLoop) {
		function sendMessage(handler, msg) {
			var node = hooks.get(handler);
			if (node === void 0) {
				invokeHandler(handler, msg);
				return;
			}
			for (; node !== null; node = node.next) {
				if (node.hook !== null && !invokeHook(node.hook, handler, msg)) {
					return;
				}
			}
			invokeHandler(handler, msg);
		}
		MessageLoop.sendMessage = sendMessage;
		function postMessage(handler, msg) {
			if (!msg.isConflatable) {
				enqueueMessage(handler, msg);
				return;
			}
			var conflated = iteration_1.some(queue, function (posted) {
				if (posted.handler !== handler) {
					return false;
				}
				if (posted.msg.type !== msg.type) {
					return false;
				}
				if (!posted.msg.isConflatable) {
					return false;
				}
				return posted.msg.conflate(msg);
			});
			if (!conflated)
				enqueueMessage(handler, msg);
		}
		MessageLoop.postMessage = postMessage;
		function installMessageHook(handler, hook) {
			removeMessageHook(handler, hook);
			var next = hooks.get(handler) || null;
			hooks.set(handler, { next: next, hook: hook });
		}
		MessageLoop.installMessageHook = installMessageHook;
		function removeMessageHook(handler, hook) {
			var prev = null;
			var node = hooks.get(handler) || null;
			for (; node !== null; prev = node, node = node.next) {
				if (node.hook === hook) {
					if (prev === null && node.next === null) {
						hooks.delete(handler);
					}
					else if (prev === null) {
						hooks.set(handler, node.next);
					}
					else {
						prev.next = node.next;
					}
					node.hook = null;
					return;
				}
			}
		}
		MessageLoop.removeMessageHook = removeMessageHook;
		function clearMessageData(handler) {
			var node = hooks.get(handler) || null;
			for (; node !== null; node = node.next) {
				node.hook = null;
			}
			hooks.delete(handler);
			iteration_1.each(queue, function (posted) {
				if (posted.handler === handler) {
					posted.handler = null;
				}
			});
		}
		MessageLoop.clearMessageData = clearMessageData;
		var queue = new queue_1.Queue();
		var hooks = new WeakMap();
		var defer = (function () {
			var ok = typeof requestAnimationFrame === 'function';
			return ok ? requestAnimationFrame : setImmediate;
		})();
		var cyclePending = false;
		function invokeHook(hook, handler, msg) {
			var result;
			try {
				result = hook(handler, msg);
			}
			catch (err) {
				result = true;
				console.error(err);
			}
			return result;
		}
		function invokeHandler(handler, msg) {
			try {
				handler.processMessage(msg);
			}
			catch (err) {
				console.error(err);
			}
		}
		function enqueueMessage(handler, msg) {
			queue.pushBack({ handler: handler, msg: msg });
			scheduleMessageLoop();
		}
		function scheduleMessageLoop() {
			if (!cyclePending) {
				defer(runMessageLoop);
				cyclePending = true;
			}
		}
		function runMessageLoop() {
			cyclePending = false;
			if (queue.isEmpty) {
				return;
			}
			var sentinel = { handler: null, msg: null };
			queue.pushBack(sentinel);
			while (!queue.isEmpty) {
				var posted = queue.popFront();
				if (posted === sentinel) {
					return;
				}
				if (posted.handler !== null) {
					sendMessage(posted.handler, posted.msg);
				}
			}
		}
	})(MessageLoop || (MessageLoop = {}));
	}.call(exports, __webpack_require__(4).setImmediate))
},
function(module, exports, __webpack_require__) {
	(function(setImmediate, clearImmediate) {var nextTick = __webpack_require__(5).nextTick;
	var apply = Function.prototype.apply;
	var slice = Array.prototype.slice;
	var immediateIds = {};
	var nextImmediateId = 0;
	exports.setTimeout = function() {
		return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
		return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) { timeout.close(); };
	function Timeout(id, clearFn) {
		this._id = id;
		this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
		this._clearFn.call(window, this._id);
	};
	exports.enroll = function(item, msecs) {
		clearTimeout(item._idleTimeoutId);
		item._idleTimeout = msecs;
	};
	exports.unenroll = function(item) {
		clearTimeout(item._idleTimeoutId);
		item._idleTimeout = -1;
	};
	exports._unrefActive = exports.active = function(item) {
		clearTimeout(item._idleTimeoutId);
		var msecs = item._idleTimeout;
		if (msecs >= 0) {
		item._idleTimeoutId = setTimeout(function onTimeout() {
			if (item._onTimeout)
			item._onTimeout();
		}, msecs);
		}
	};
	exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
		var id = nextImmediateId++;
		var args = arguments.length < 2 ? false : slice.call(arguments, 1);
		immediateIds[id] = true;
		nextTick(function onNextTick() {
		if (immediateIds[id]) {
			if (args) {
			fn.apply(null, args);
			} else {
			fn.call(null);
			}
			exports.clearImmediate(id);
		}
		});
		return id;
	};
	exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
		delete immediateIds[id];
	};
	}.call(exports, __webpack_require__(4).setImmediate, __webpack_require__(4).clearImmediate))
},
function(module, exports) {
	var process = module.exports = {};
	var cachedSetTimeout;
	var cachedClearTimeout;
	function defaultSetTimout() {
		throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
		throw new Error('clearTimeout has not been defined');
	}
	(function () {
		try {
			if (typeof setTimeout === 'function') {
				cachedSetTimeout = setTimeout;
			} else {
				cachedSetTimeout = defaultSetTimout;
			}
		} catch (e) {
			cachedSetTimeout = defaultSetTimout;
		}
		try {
			if (typeof clearTimeout === 'function') {
				cachedClearTimeout = clearTimeout;
			} else {
				cachedClearTimeout = defaultClearTimeout;
			}
		} catch (e) {
			cachedClearTimeout = defaultClearTimeout;
		}
	} ())
	function runTimeout(fun) {
		if (cachedSetTimeout === setTimeout) {
			return setTimeout(fun, 0);
		}
		if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
			cachedSetTimeout = setTimeout;
			return setTimeout(fun, 0);
		}
		try {
			return cachedSetTimeout(fun, 0);
		} catch(e){
			try {
				return cachedSetTimeout.call(null, fun, 0);
			} catch(e){
				return cachedSetTimeout.call(this, fun, 0);
			}
		}
	}
	function runClearTimeout(marker) {
		if (cachedClearTimeout === clearTimeout) {
			return clearTimeout(marker);
		}
		if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
			cachedClearTimeout = clearTimeout;
			return clearTimeout(marker);
		}
		try {
			return cachedClearTimeout(marker);
		} catch (e){
			try {
				return cachedClearTimeout.call(null, marker);
			} catch (e){
				return cachedClearTimeout.call(this, marker);
			}
		}
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	function cleanUpNextTick() {
		if (!draining || !currentQueue) {
			return;
		}
		draining = false;
		if (currentQueue.length) {
			queue = currentQueue.concat(queue);
		} else {
			queueIndex = -1;
		}
		if (queue.length) {
			drainQueue();
		}
	}
	function drainQueue() {
		if (draining) {
			return;
		}
		var timeout = runTimeout(cleanUpNextTick);
		draining = true;
		var len = queue.length;
		while(len) {
			currentQueue = queue;
			queue = [];
			while (++queueIndex < len) {
				if (currentQueue) {
					currentQueue[queueIndex].run();
				}
			}
			queueIndex = -1;
			len = queue.length;
		}
		currentQueue = null;
		draining = false;
		runClearTimeout(timeout);
	}
	process.nextTick = function (fun) {
		var args = new Array(arguments.length - 1);
		if (arguments.length > 1) {
			for (var i = 1; i < arguments.length; i++) {
				args[i - 1] = arguments[i];
			}
		}
		queue.push(new Item(fun, args));
		if (queue.length === 1 && !draining) {
			runTimeout(drainQueue);
		}
	};
	function Item(fun, array) {
		this.fun = fun;
		this.array = array;
	}
	Item.prototype.run = function () {
		this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = '';
	process.versions = {};
	function noop() {}
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	process.binding = function (name) {
		throw new Error('process.binding is not supported');
	};
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
		throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };
},
function(module, exports, __webpack_require__) {
	"use strict";
	var iteration_1 = __webpack_require__(2);
	var Queue = (function () {
		function Queue(values) {
			var _this = this;
			this._length = 0;
			this._front = null;
			this._back = null;
			if (values)
				iteration_1.each(values, function (value) { _this.pushBack(value); });
		}
		Object.defineProperty(Queue.prototype, "isEmpty", {
			get: function () {
				return this._length === 0;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Queue.prototype, "length", {
			get: function () {
				return this._length;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Queue.prototype, "front", {
			get: function () {
				return this._front ? this._front.value : void 0;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Queue.prototype, "back", {
			get: function () {
				return this._back ? this._back.value : void 0;
			},
			enumerable: true,
			configurable: true
		});
		Queue.prototype.iter = function () {
			return new QueueIterator(this._front);
		};
		Queue.prototype.pushBack = function (value) {
			var node = new QueueNode(value);
			if (this._length === 0) {
				this._front = node;
				this._back = node;
			}
			else {
				this._back.next = node;
				this._back = node;
			}
			return ++this._length;
		};
		Queue.prototype.popFront = function () {
			if (this._length === 0) {
				return void 0;
			}
			var node = this._front;
			if (this._length === 1) {
				this._front = null;
				this._back = null;
			}
			else {
				this._front = node.next;
				node.next = null;
			}
			this._length--;
			return node.value;
		};
		Queue.prototype.clear = function () {
			var node = this._front;
			while (node) {
				var next = node.next;
				node.next = null;
				node = next;
			}
			this._length = 0;
			this._front = null;
			this._back = null;
		};
		Queue.prototype.swap = function (other) {
			var length = other._length;
			var front = other._front;
			var back = other._back;
			other._length = this._length;
			other._front = this._front;
			other._back = this._back;
			this._length = length;
			this._front = front;
			this._back = back;
		};
		return Queue;
	}());
	exports.Queue = Queue;
	var QueueIterator = (function () {
		function QueueIterator(node) {
			this._node = node;
		}
		QueueIterator.prototype.iter = function () {
			return this;
		};
		QueueIterator.prototype.clone = function () {
			return new QueueIterator(this._node);
		};
		QueueIterator.prototype.next = function () {
			if (!this._node) {
				return void 0;
			}
			var value = this._node.value;
			this._node = this._node.next;
			return value;
		};
		return QueueIterator;
	}());
	var QueueNode = (function () {
		function QueueNode(value) {
			this.next = null;
			this.value = value;
		}
		return QueueNode;
	}());
},
function(module, exports) {
	"use strict";
	var MimeData = (function () {
		function MimeData() {
			this._types = [];
			this._values = [];
		}
		MimeData.prototype.types = function () {
			return this._types.slice();
		};
		MimeData.prototype.hasData = function (mime) {
			return this._types.indexOf(mime) !== -1;
		};
		MimeData.prototype.getData = function (mime) {
			var i = this._types.indexOf(mime);
			return i !== -1 ? this._values[i] : void 0;
		};
		MimeData.prototype.setData = function (mime, data) {
			this.clearData(mime);
			this._types.push(mime);
			this._values.push(data);
		};
		MimeData.prototype.clearData = function (mime) {
			var i = this._types.indexOf(mime);
			if (i === -1)
				return;
			this._types.splice(i, 1);
			this._values.splice(i, 1);
		};
		MimeData.prototype.clear = function () {
			this._types.length = 0;
			this._values.length = 0;
		};
		return MimeData;
	}());
	exports.MimeData = MimeData;
},
function(module, exports) {
	"use strict";
	var AttachedProperty = (function () {
		function AttachedProperty(options) {
			this._pid = nextPID();
			this._name = options.name;
			this._value = options.value;
			this._create = options.create;
			this._coerce = options.coerce;
			this._compare = options.compare;
			this._changed = options.changed;
		}
		Object.defineProperty(AttachedProperty.prototype, "name", {
			get: function () {
				return this._name;
			},
			enumerable: true,
			configurable: true
		});
		AttachedProperty.prototype.get = function (owner) {
			var value;
			var map = ensureMap(owner);
			if (this._pid in map) {
				value = map[this._pid];
			}
			else {
				value = map[this._pid] = this._createValue(owner);
			}
			return value;
		};
		AttachedProperty.prototype.set = function (owner, value) {
			var oldValue;
			var map = ensureMap(owner);
			if (this._pid in map) {
				oldValue = map[this._pid];
			}
			else {
				oldValue = map[this._pid] = this._createValue(owner);
			}
			var newValue = this._coerceValue(owner, value);
			this._maybeNotify(owner, oldValue, map[this._pid] = newValue);
		};
		AttachedProperty.prototype.coerce = function (owner) {
			var oldValue;
			var map = ensureMap(owner);
			if (this._pid in map) {
				oldValue = map[this._pid];
			}
			else {
				oldValue = map[this._pid] = this._createValue(owner);
			}
			var newValue = this._coerceValue(owner, oldValue);
			this._maybeNotify(owner, oldValue, map[this._pid] = newValue);
		};
		AttachedProperty.prototype._createValue = function (owner) {
			var create = this._create;
			return create ? create(owner) : this._value;
		};
		AttachedProperty.prototype._coerceValue = function (owner, value) {
			var coerce = this._coerce;
			return coerce ? coerce(owner, value) : value;
		};
		AttachedProperty.prototype._compareValue = function (oldValue, newValue) {
			var compare = this._compare;
			return compare ? compare(oldValue, newValue) : oldValue === newValue;
		};
		AttachedProperty.prototype._maybeNotify = function (owner, oldValue, newValue) {
			if (!this._changed || this._compareValue(oldValue, newValue)) {
				return;
			}
			this._changed.call(void 0, owner, oldValue, newValue);
		};
		return AttachedProperty;
	}());
	exports.AttachedProperty = AttachedProperty;
	function clearPropertyData(owner) {
		ownerData.delete(owner);
	}
	exports.clearPropertyData = clearPropertyData;
	var ownerData = new WeakMap();
	var nextPID = (function () {
		var id = 0;
		return function () {
			var rand = Math.random();
			var stem = ("" + rand).slice(2);
			return "pid-" + stem + "-" + id++;
		};
	})();
	function ensureMap(owner) {
		var map = ownerData.get(owner);
		if (map !== void 0)
			return map;
		map = Object.create(null);
		ownerData.set(owner, map);
		return map;
	}
},
function(module, exports, __webpack_require__) {
	(function(setImmediate) {
	"use strict";
	function defineSignal(target, name) {
		var token = Object.freeze({});
		Object.defineProperty(target, name, {
			get: function () { return new Signal(this, token); }
		});
	}
	exports.defineSignal = defineSignal;
	function disconnectSender(sender) {
		var receiverList = senderData.get(sender);
		if (receiverList === void 0) {
			return;
		}
		for (var i = 0, n = receiverList.length; i < n; ++i) {
			var conn = receiverList[i];
			var senderList = receiverData.get(conn.thisArg || conn.slot);
			scheduleCleanup(senderList);
			conn.token = null;
		}
		scheduleCleanup(receiverList);
	}
	exports.disconnectSender = disconnectSender;
	function disconnectReceiver(receiver) {
		var senderList = receiverData.get(receiver);
		if (senderList === void 0) {
			return;
		}
		for (var i = 0, n = senderList.length; i < n; ++i) {
			var conn = senderList[i];
			var receiverList = senderData.get(conn.sender);
			scheduleCleanup(receiverList);
			conn.token = null;
		}
		scheduleCleanup(senderList);
	}
	exports.disconnectReceiver = disconnectReceiver;
	function clearSignalData(obj) {
		disconnectSender(obj);
		disconnectReceiver(obj);
	}
	exports.clearSignalData = clearSignalData;
	var Signal = (function () {
		function Signal(sender, token) {
			this._sender = sender;
			this._token = token;
		}
		Signal.prototype.connect = function (slot, thisArg) {
			return connect(this._sender, this._token, slot, thisArg);
		};
		Signal.prototype.disconnect = function (slot, thisArg) {
			return disconnect(this._sender, this._token, slot, thisArg);
		};
		Signal.prototype.emit = function (args) {
			emit(this._sender, this._token, args);
		};
		return Signal;
	}());
	var senderData = new WeakMap();
	var receiverData = new WeakMap();
	var dirtySet = new Set();
	var defer = (function () {
		var ok = typeof requestAnimationFrame === 'function';
		return ok ? requestAnimationFrame : setImmediate;
	})();
	function connect(sender, token, slot, thisArg) {
		thisArg = thisArg || void 0;
		var receiverList = senderData.get(sender);
		if (receiverList === void 0) {
			receiverList = [];
			senderData.set(sender, receiverList);
		}
		if (findConnection(receiverList, token, slot, thisArg) !== null) {
			return false;
		}
		var receiver = thisArg || slot;
		var senderList = receiverData.get(receiver);
		if (senderList === void 0) {
			senderList = [];
			receiverData.set(receiver, senderList);
		}
		var connection = { sender: sender, token: token, slot: slot, thisArg: thisArg };
		receiverList.push(connection);
		senderList.push(connection);
		return true;
	}
	function disconnect(sender, token, slot, thisArg) {
		thisArg = thisArg || void 0;
		var receiverList = senderData.get(sender);
		if (receiverList === void 0) {
			return false;
		}
		var conn = findConnection(receiverList, token, slot, thisArg);
		if (conn === null) {
			return false;
		}
		var senderList = receiverData.get(thisArg || slot);
		conn.token = null;
		scheduleCleanup(receiverList);
		scheduleCleanup(senderList);
		return true;
	}
	function emit(sender, token, args) {
		var receiverList = senderData.get(sender);
		if (receiverList === void 0) {
			return;
		}
		for (var i = 0, n = receiverList.length; i < n; ++i) {
			var conn = receiverList[i];
			if (conn.token === token) {
				invokeSlot(conn, args);
			}
		}
	}
	function invokeSlot(conn, args) {
		try {
			conn.slot.call(conn.thisArg, conn.sender, args);
		}
		catch (err) {
			console.error(err);
		}
	}
	function findConnection(list, token, slot, thisArg) {
		for (var i = 0, n = list.length; i < n; ++i) {
			var conn = list[i];
			if (conn.token === token &&
				conn.slot === slot &&
				conn.thisArg === thisArg) {
				return conn;
			}
		}
		return null;
	}
	function scheduleCleanup(list) {
		if (dirtySet.size === 0) {
			defer(cleanupDirtySet);
		}
		dirtySet.add(list);
	}
	function cleanupDirtySet() {
		dirtySet.forEach(cleanupList);
		dirtySet.clear();
	}
	function cleanupList(list) {
		var count = 0;
		for (var i = 0, n = list.length; i < n; ++i) {
			var conn = list[i];
			if (conn.token === null) {
				count++;
			}
			else {
				list[i - count] = conn;
			}
		}
		list.length -= count;
	}
	}.call(exports, __webpack_require__(4).setImmediate))
},
function(module, exports) {
	"use strict";
	var Token = (function () {
		function Token(name) {
			this._name = name;
		}
		Object.defineProperty(Token.prototype, "name", {
			get: function () {
				return this._name;
			},
			enumerable: true,
			configurable: true
		});
		return Token;
	}());
	exports.Token = Token;
},
function(module, exports, __webpack_require__) {
	"use strict";
	var disposable_1 = __webpack_require__(1);
	var OVERRIDE_CURSOR_CLASS = 'p-mod-override-cursor';
	function overrideCursor(cursor) {
		var id = ++Private.cursorID;
		var body = document.body;
		body.style.cursor = cursor;
		body.classList.add(OVERRIDE_CURSOR_CLASS);
		return new disposable_1.DisposableDelegate(function () {
			if (id === Private.cursorID) {
				body.style.cursor = '';
				body.classList.remove(OVERRIDE_CURSOR_CLASS);
			}
		});
	}
	exports.overrideCursor = overrideCursor;
	var Private;
	(function (Private) {
		Private.cursorID = 0;
	})(Private || (Private = {}));
},
function(module, exports, __webpack_require__) {
	"use strict";
	var cursor_1 = __webpack_require__(11);
	var DRAG_IMAGE_CLASS = 'p-mod-drag-image';
	var Drag = (function () {
		function Drag(options) {
			this._disposed = false;
			this._source = null;
			this._mimeData = null;
			this._dragImage = null;
			this._dropAction = 'none';
			this._proposedAction = 'copy';
			this._supportedActions = 'all';
			this._override = null;
			this._currentTarget = null;
			this._currentElement = null;
			this._promise = null;
			this._resolve = null;
			this._mimeData = options.mimeData;
			if (options.dragImage !== void 0) {
				this._dragImage = options.dragImage;
			}
			if (options.proposedAction !== void 0) {
				this._proposedAction = options.proposedAction;
			}
			if (options.supportedActions !== void 0) {
				this._supportedActions = options.supportedActions;
			}
			if (options.source !== void 0) {
				this._source = options.source;
			}
		}
		Drag.prototype.dispose = function () {
			if (this._disposed) {
				return;
			}
			this._disposed = true;
			if (this._currentTarget) {
				var event_1 = Private.createMouseEvent('mouseup', -1, -1);
				Private.dispatchDragLeave(this, this._currentTarget, null, event_1);
			}
			this._finalize('none');
		};
		Object.defineProperty(Drag.prototype, "isDisposed", {
			get: function () {
				return this._disposed;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Drag.prototype, "mimeData", {
			get: function () {
				return this._mimeData;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Drag.prototype, "dragImage", {
			get: function () {
				return this._dragImage;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Drag.prototype, "proposedAction", {
			get: function () {
				return this._proposedAction;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Drag.prototype, "supportedActions", {
			get: function () {
				return this._supportedActions;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Drag.prototype, "source", {
			get: function () {
				return this._source;
			},
			enumerable: true,
			configurable: true
		});
		Drag.prototype.start = function (clientX, clientY) {
			var _this = this;
			if (this._disposed) {
				return Promise.resolve('none');
			}
			if (this._promise) {
				return this._promise;
			}
			this._addListeners();
			this._attachDragImage(clientX, clientY);
			this._promise = new Promise(function (resolve, reject) {
				_this._resolve = resolve;
			});
			var event = Private.createMouseEvent('mousemove', clientX, clientY);
			document.dispatchEvent(event);
			return this._promise;
		};
		Drag.prototype.handleEvent = function (event) {
			switch (event.type) {
				case 'mousemove':
					this._evtMouseMove(event);
					break;
				case 'mouseup':
					this._evtMouseUp(event);
					break;
				case 'keydown':
					this._evtKeyDown(event);
					break;
				default:
					event.preventDefault();
					event.stopPropagation();
					break;
			}
		};
		Drag.prototype._evtMouseMove = function (event) {
			event.preventDefault();
			event.stopPropagation();
			this._updateCurrentTarget(event);
			this._moveDragImage(event.clientX, event.clientY);
		};
		Drag.prototype._evtMouseUp = function (event) {
			event.preventDefault();
			event.stopPropagation();
			if (event.button !== 0) {
				return;
			}
			this._updateCurrentTarget(event);
			if (!this._currentTarget) {
				this._finalize('none');
				return;
			}
			if (this._dropAction === 'none') {
				Private.dispatchDragLeave(this, this._currentTarget, null, event);
				this._finalize('none');
				return;
			}
			var action = Private.dispatchDrop(this, this._currentTarget, event);
			this._finalize(action);
		};
		Drag.prototype._evtKeyDown = function (event) {
			event.preventDefault();
			event.stopPropagation();
			if (event.keyCode === 27)
				this.dispose();
		};
		Drag.prototype._addListeners = function () {
			document.addEventListener('mousedown', this, true);
			document.addEventListener('mousemove', this, true);
			document.addEventListener('mouseup', this, true);
			document.addEventListener('mouseenter', this, true);
			document.addEventListener('mouseleave', this, true);
			document.addEventListener('mouseover', this, true);
			document.addEventListener('mouseout', this, true);
			document.addEventListener('keydown', this, true);
			document.addEventListener('keyup', this, true);
			document.addEventListener('keypress', this, true);
			document.addEventListener('contextmenu', this, true);
		};
		Drag.prototype._removeListeners = function () {
			document.removeEventListener('mousedown', this, true);
			document.removeEventListener('mousemove', this, true);
			document.removeEventListener('mouseup', this, true);
			document.removeEventListener('mouseenter', this, true);
			document.removeEventListener('mouseleave', this, true);
			document.removeEventListener('mouseover', this, true);
			document.removeEventListener('mouseout', this, true);
			document.removeEventListener('keydown', this, true);
			document.removeEventListener('keyup', this, true);
			document.removeEventListener('keypress', this, true);
			document.removeEventListener('contextmenu', this, true);
		};
		Drag.prototype._updateCurrentTarget = function (event) {
			var prevTarget = this._currentTarget;
			var currTarget = this._currentTarget;
			var prevElem = this._currentElement;
			var currElem = document.elementFromPoint(event.clientX, event.clientY);
			this._currentElement = currElem;
			if (currElem !== prevElem && currElem !== currTarget) {
				currTarget = Private.dispatchDragEnter(this, currElem, currTarget, event);
			}
			if (currTarget !== prevTarget) {
				this._currentTarget = currTarget;
				Private.dispatchDragLeave(this, prevTarget, currTarget, event);
			}
			var action = Private.dispatchDragOver(this, currTarget, event);
			this._setDropAction(action);
		};
		Drag.prototype._attachDragImage = function (clientX, clientY) {
			if (!this._dragImage) {
				return;
			}
			this._dragImage.classList.add(DRAG_IMAGE_CLASS);
			var style = this._dragImage.style;
			style.pointerEvents = 'none';
			style.position = 'absolute';
			style.top = clientY + "px";
			style.left = clientX + "px";
			document.body.appendChild(this._dragImage);
		};
		Drag.prototype._moveDragImage = function (clientX, clientY) {
			if (!this._dragImage) {
				return;
			}
			var style = this._dragImage.style;
			style.top = clientY + "px";
			style.left = clientX + "px";
		};
		Drag.prototype._detachDragImage = function () {
			if (!this._dragImage) {
				return;
			}
			var parent = this._dragImage.parentNode;
			if (!parent) {
				return;
			}
			parent.removeChild(this._dragImage);
		};
		Drag.prototype._setDropAction = function (action) {
			action = Private.validateAction(action, this._supportedActions);
			if (this._override && this._dropAction === action) {
				return;
			}
			switch (action) {
				case 'none':
					this._dropAction = action;
					this._override = cursor_1.overrideCursor('no-drop');
					break;
				case 'copy':
					this._dropAction = action;
					this._override = cursor_1.overrideCursor('copy');
					break;
				case 'link':
					this._dropAction = action;
					this._override = cursor_1.overrideCursor('alias');
					break;
				case 'move':
					this._dropAction = action;
					this._override = cursor_1.overrideCursor('move');
					break;
			}
		};
		Drag.prototype._finalize = function (action) {
			var resolve = this._resolve;
			this._removeListeners();
			this._detachDragImage();
			if (this._override)
				this._override.dispose();
			if (this._mimeData)
				this._mimeData.clear();
			this._disposed = true;
			this._source = null;
			this._mimeData = null;
			this._dragImage = null;
			this._dropAction = 'none';
			this._proposedAction = 'none';
			this._supportedActions = 'none';
			this._override = null;
			this._currentTarget = null;
			this._currentElement = null;
			this._promise = null;
			this._resolve = null;
			if (resolve)
				resolve(action);
		};
		return Drag;
	}());
	exports.Drag = Drag;
	var Private;
	(function (Private) {
		function validateAction(action, supported) {
			var a = actionTable[action];
			var b = supportedTable[supported];
			return (a & b) ? action : 'none';
		}
		Private.validateAction = validateAction;
		function createMouseEvent(type, clientX, clientY) {
			var event = document.createEvent('MouseEvent');
			event.initMouseEvent(type, true, true, window, 0, 0, 0, clientX, clientY, false, false, false, false, 0, null);
			return event;
		}
		Private.createMouseEvent = createMouseEvent;
		function dispatchDragEnter(drag, currElem, currTarget, event) {
			if (!currElem) {
				return null;
			}
			var dragEvent = createDragEvent('p-dragenter', drag, event, currTarget);
			var canceled = !currElem.dispatchEvent(dragEvent);
			if (canceled) {
				return currElem;
			}
			if (currElem === document.body) {
				return currTarget;
			}
			dragEvent = createDragEvent('p-dragenter', drag, event, currTarget);
			document.body.dispatchEvent(dragEvent);
			return document.body;
		}
		Private.dispatchDragEnter = dispatchDragEnter;
		function dispatchDragLeave(drag, prevTarget, currTarget, event) {
			if (!prevTarget) {
				return;
			}
			var dragEvent = createDragEvent('p-dragleave', drag, event, currTarget);
			prevTarget.dispatchEvent(dragEvent);
		}
		Private.dispatchDragLeave = dispatchDragLeave;
		function dispatchDragOver(drag, currTarget, event) {
			if (!currTarget) {
				return 'none';
			}
			var dragEvent = createDragEvent('p-dragover', drag, event, null);
			var canceled = !currTarget.dispatchEvent(dragEvent);
			if (canceled) {
				return dragEvent.dropAction;
			}
			return 'none';
		}
		Private.dispatchDragOver = dispatchDragOver;
		function dispatchDrop(drag, currTarget, event) {
			if (!currTarget) {
				return 'none';
			}
			var dragEvent = createDragEvent('p-drop', drag, event, null);
			var canceled = !currTarget.dispatchEvent(dragEvent);
			if (canceled) {
				return dragEvent.dropAction;
			}
			return 'none';
		}
		Private.dispatchDrop = dispatchDrop;
		var actionTable = {
			'none': 0x0,
			'copy': 0x1,
			'link': 0x2,
			'move': 0x4
		};
		var supportedTable = {
			'none': actionTable['none'],
			'copy': actionTable['copy'],
			'link': actionTable['link'],
			'move': actionTable['move'],
			'copy-link': actionTable['copy'] | actionTable['link'],
			'copy-move': actionTable['copy'] | actionTable['move'],
			'link-move': actionTable['link'] | actionTable['move'],
			'all': actionTable['copy'] | actionTable['link'] | actionTable['move']
		};
		function createDragEvent(type, drag, event, related) {
			var dragEvent = document.createEvent('MouseEvent');
			dragEvent.initMouseEvent(type, true, true, window, 0, event.screenX, event.screenY, event.clientX, event.clientY, event.ctrlKey, event.altKey, event.shiftKey, event.metaKey, event.button, related);
			dragEvent.dropAction = 'none';
			dragEvent.mimeData = drag.mimeData;
			dragEvent.proposedAction = drag.proposedAction;
			dragEvent.supportedActions = drag.supportedActions;
			dragEvent.source = drag.source;
			return dragEvent;
		}
	})(Private || (Private = {}));
},
function(module, exports) {
	"use strict";
	exports.IS_MAC = !!navigator.platform.match(/Mac/i);
	exports.IS_WIN = !!navigator.platform.match(/Win/i);
	exports.IS_IE = /Trident/.test(navigator.userAgent);
	exports.IS_EDGE = /Edge/.test(navigator.userAgent);
},
function(module, exports) {
	"use strict";
	function hitTest(node, clientX, clientY) {
		var rect = node.getBoundingClientRect();
		return (clientX >= rect.left &&
			clientX < rect.right &&
			clientY >= rect.top &&
			clientY < rect.bottom);
	}
	exports.hitTest = hitTest;
	function scrollIntoViewIfNeeded(area, elem) {
		var ar = area.getBoundingClientRect();
		var er = elem.getBoundingClientRect();
		if (er.top <= ar.top && er.bottom >= ar.bottom) {
			return;
		}
		if (er.top < ar.top && er.height <= ar.height) {
			area.scrollTop -= ar.top - er.top;
			return;
		}
		if (er.bottom > ar.bottom && er.height >= ar.height) {
			area.scrollTop -= ar.top - er.top;
			return;
		}
		if (er.top < ar.top && er.height > ar.height) {
			area.scrollTop -= ar.bottom - er.bottom;
			return;
		}
		if (er.bottom > ar.bottom && er.height < ar.height) {
			area.scrollTop -= ar.bottom - er.bottom;
			return;
		}
	}
	exports.scrollIntoViewIfNeeded = scrollIntoViewIfNeeded;
},
function(module, exports) {
	"use strict";
	function calculateSpecificity(selector) {
		var result = Private.specificityCache[selector];
		if (result === void 0) {
			result = Private.calculateSingle(selector);
			Private.specificityCache[selector] = result;
		}
		return result;
	}
	exports.calculateSpecificity = calculateSpecificity;
	function isValidSelector(selector) {
		var result = Private.validityCache[selector];
		if (result === void 0) {
			try {
				Private.testElem.querySelector(selector);
				result = true;
			}
			catch (err) {
				result = false;
			}
			Private.validityCache[selector] = result;
		}
		return result;
	}
	exports.isValidSelector = isValidSelector;
	function validateSelector(selector) {
		if (!isValidSelector(selector)) {
			throw new Error("Invalid selector: " + selector);
		}
		return selector;
	}
	exports.validateSelector = validateSelector;
	function matchesSelector(elem, selector) {
		return Private.protoMatchFunc.call(elem, selector);
	}
	exports.matchesSelector = matchesSelector;
	var Private;
	(function (Private) {
		var ID_RE = /^#[^\s\+>~#\.\[:]+/;
		var CLASS_RE = /^\.[^\s\+>~#\.\[:]+/;
		var ATTR_RE = /^\[[^\]]+\]/;
		var TYPE_RE = /^[^\s\+>~#\.\[:]+/;
		var PSEUDO_ELEM_RE = /^(::[^\s\+>~#\.\[:]+|:first-line|:first-letter|:before|:after)/;
		var PSEUDO_CLASS_RE = /^:[^\s\+>~#\.\[:]+/;
		var IGNORE_RE = /^[\s\+>~\*]+/;
		var NEGATION_RE = /:not\(([^\)]+)\)/g;
		Private.specificityCache = Object.create(null);
		Private.validityCache = Object.create(null);
		Private.testElem = document.createElement('div');
		Private.protoMatchFunc = (function () {
			var proto = Element.prototype;
			return (proto.matches ||
				proto.matchesSelector ||
				proto.mozMatchesSelector ||
				proto.msMatchesSelector ||
				proto.oMatchesSelector ||
				proto.webkitMatchesSelector ||
				(function (selector) {
					var elem = this;
					var matches = elem.ownerDocument.querySelectorAll(selector);
					return Array.prototype.indexOf.call(matches, elem) !== -1;
				}));
		})();
		function calculateSingle(selector) {
			selector = selector.split(',', 1)[0];
			var a = 0;
			var b = 0;
			var c = 0;
			function match(re) {
				var match = selector.match(re);
				if (match === null) {
					return false;
				}
				selector = selector.slice(match[0].length);
				return true;
			}
			selector = selector.replace(NEGATION_RE, ' $1 ');
			while (selector.length > 0) {
				if (match(ID_RE)) {
					a++;
					continue;
				}
				if (match(CLASS_RE)) {
					b++;
					continue;
				}
				if (match(ATTR_RE)) {
					b++;
					continue;
				}
				if (match(PSEUDO_ELEM_RE)) {
					c++;
					continue;
				}
				if (match(PSEUDO_CLASS_RE)) {
					b++;
					continue;
				}
				if (match(TYPE_RE)) {
					c++;
					continue;
				}
				if (match(IGNORE_RE)) {
					continue;
				}
				return 0;
			}
			a = Math.min(a, 0xFF);
			b = Math.min(b, 0xFF);
			c = Math.min(c, 0xFF);
			return (a << 16) | (b << 8) | c;
		}
		Private.calculateSingle = calculateSingle;
	})(Private || (Private = {}));
},
function(module, exports) {
	"use strict";
	function boxSizing(node) {
		var cstyle = window.getComputedStyle(node);
		var bt = parseInt(cstyle.borderTopWidth, 10) || 0;
		var bl = parseInt(cstyle.borderLeftWidth, 10) || 0;
		var br = parseInt(cstyle.borderRightWidth, 10) || 0;
		var bb = parseInt(cstyle.borderBottomWidth, 10) || 0;
		var pt = parseInt(cstyle.paddingTop, 10) || 0;
		var pl = parseInt(cstyle.paddingLeft, 10) || 0;
		var pr = parseInt(cstyle.paddingRight, 10) || 0;
		var pb = parseInt(cstyle.paddingBottom, 10) || 0;
		var hs = bl + pl + pr + br;
		var vs = bt + pt + pb + bb;
		return {
			borderTop: bt,
			borderLeft: bl,
			borderRight: br,
			borderBottom: bb,
			paddingTop: pt,
			paddingLeft: pl,
			paddingRight: pr,
			paddingBottom: pb,
			horizontalSum: hs,
			verticalSum: vs
		};
	}
	exports.boxSizing = boxSizing;
	function sizeLimits(node) {
		var cstyle = window.getComputedStyle(node);
		return {
			minWidth: parseInt(cstyle.minWidth, 10) || 0,
			minHeight: parseInt(cstyle.minHeight, 10) || 0,
			maxWidth: parseInt(cstyle.maxWidth, 10) || Infinity,
			maxHeight: parseInt(cstyle.maxHeight, 10) || Infinity
		};
	}
	exports.sizeLimits = sizeLimits;
},
function(module, exports, __webpack_require__) {
	"use strict";
	var commandregistry_1 = __webpack_require__(18);
	var keymap_1 = __webpack_require__(19);
	var widget_1 = __webpack_require__(25);
	var Application = (function () {
		function Application() {
			this._started = false;
			this._shell = null;
			this._promise = null;
			this._pluginMap = Private.createPluginMap();
			this._serviceMap = Private.createServiceMap();
			this._commands = new commandregistry_1.CommandRegistry();
			this._keymap = new keymap_1.Keymap({ commands: this._commands });
		}
		Object.defineProperty(Application.prototype, "shell", {
			get: function () {
				return this._shell;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Application.prototype, "commands", {
			get: function () {
				return this._commands;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Application.prototype, "keymap", {
			get: function () {
				return this._keymap;
			},
			enumerable: true,
			configurable: true
		});
		Application.prototype.hasPlugin = function (id) {
			return id in this._pluginMap;
		};
		Application.prototype.listPlugins = function () {
			return Object.keys(this._pluginMap);
		};
		Application.prototype.registerPlugin = function (plugin) {
			if (plugin.id in this._pluginMap) {
				throw new Error("Plugin '" + plugin.id + "' is already registered.");
			}
			var data = Private.createPluginData(plugin);
			Private.ensureNoCycle(data, this._pluginMap, this._serviceMap);
			if (data.provides)
				this._serviceMap.set(data.provides, data.id);
			this._pluginMap[data.id] = data;
		};
		Application.prototype.registerPlugins = function (plugins) {
			for (var _i = 0, plugins_1 = plugins; _i < plugins_1.length; _i++) {
				var plugin = plugins_1[_i];
				this.registerPlugin(plugin);
			}
		};
		Application.prototype.activatePlugin = function (id) {
			var _this = this;
			var data = this._pluginMap[id];
			if (!data) {
				return Promise.reject(new Error("Plugin '" + id + "' is not registered."));
			}
			if (data.activated) {
				return Promise.resolve(void 0);
			}
			if (data.promise) {
				return data.promise;
			}
			var promises = data.requires.map(function (req) { return _this.resolveService(req); });
			data.promise = Promise.all(promises).then(function (deps) {
				return data.activate.apply(void 0, [_this].concat(deps));
			}).then(function (service) {
				data.service = service;
				data.activated = true;
				data.promise = null;
			}).catch(function (error) {
				data.promise = null;
				throw error;
			});
			return data.promise;
		};
		Application.prototype.resolveService = function (token) {
			var id = this._serviceMap.get(token);
			if (!id) {
				return Promise.reject(new Error("No provider for: " + token.name + "."));
			}
			var data = this._pluginMap[id];
			if (data.activated) {
				return Promise.resolve(data.service);
			}
			return this.activatePlugin(id).then(function () { return data.service; });
		};
		Application.prototype.start = function (options) {
			var _this = this;
			if (options === void 0) { options = {}; }
			if (this._started) {
				return Promise.resolve(void 0);
			}
			if (this._promise) {
				return this._promise;
			}
			this._shell = this.createShell();
			var hostID = options.hostID || '';
			var startups = Private.collectStartupPlugins(this._pluginMap, options);
			var promises = startups.map(function (id) { return _this.activatePlugin(id); });
			this._promise = Promise.all(promises).then(function () {
				_this._started = true;
				_this._promise = null;
				_this.attachShell(hostID);
				_this.addEventListeners();
			}).catch(function (error) {
				_this._promise = null;
				throw error;
			});
			return this._promise;
		};
		Application.prototype.handleEvent = function (event) {
			switch (event.type) {
				case 'resize':
					this.evtResize(event);
					break;
				case 'keydown':
					this.evtKeydown(event);
					break;
			}
		};
		Application.prototype.attachShell = function (id) {
			widget_1.Widget.attach(this.shell, document.getElementById(id) || document.body);
		};
		Application.prototype.addEventListeners = function () {
			document.addEventListener('keydown', this);
			window.addEventListener('resize', this);
		};
		Application.prototype.evtKeydown = function (event) {
			this.keymap.processKeydownEvent(event);
		};
		Application.prototype.evtResize = function (event) {
			this.shell.update();
		};
		return Application;
	}());
	exports.Application = Application;
	var Private;
	(function (Private) {
		function createPluginMap() {
			return Object.create(null);
		}
		Private.createPluginMap = createPluginMap;
		function createServiceMap() {
			return new Map();
		}
		Private.createServiceMap = createServiceMap;
		function createPluginData(plugin) {
			return {
				id: plugin.id,
				service: null,
				promise: null,
				activated: false,
				activate: plugin.activate,
				provides: plugin.provides || null,
				autoStart: plugin.autoStart || false,
				requires: plugin.requires ? plugin.requires.slice() : [],
			};
		}
		Private.createPluginData = createPluginData;
		function ensureNoCycle(data, pluginMap, serviceMap) {
			if (!data.provides || data.requires.length === 0) {
				return;
			}
			var trace = [data.id];
			if (data.requires.some(visit)) {
				throw new Error("Cycle detected: " + trace.join(' -> ') + ".");
			}
			function visit(token) {
				if (token === data.provides) {
					return true;
				}
				var id = serviceMap.get(token);
				if (!id) {
					return false;
				}
				var other = pluginMap[id];
				if (other.requires.length === 0) {
					return false;
				}
				trace.push(id);
				if (other.requires.some(visit)) {
					return true;
				}
				trace.pop();
				return false;
			}
		}
		Private.ensureNoCycle = ensureNoCycle;
		function collectStartupPlugins(pluginMap, options) {
			var resultMap = Object.create(null);
			for (var id in pluginMap) {
				if (pluginMap[id].autoStart) {
					resultMap[id] = true;
				}
			}
			if (options.startPlugins) {
				for (var _i = 0, _a = options.startPlugins; _i < _a.length; _i++) {
					var id = _a[_i];
					resultMap[id] = true;
				}
			}
			if (options.ignorePlugins) {
				for (var _b = 0, _c = options.ignorePlugins; _b < _c.length; _b++) {
					var id = _c[_b];
					delete resultMap[id];
				}
			}
			return Object.keys(resultMap);
		}
		Private.collectStartupPlugins = collectStartupPlugins;
	})(Private || (Private = {}));
},
function(module, exports, __webpack_require__) {
	"use strict";
	var disposable_1 = __webpack_require__(1);
	var signaling_1 = __webpack_require__(9);
	var CommandRegistry = (function () {
		function CommandRegistry() {
			this._commands = Object.create(null);
		}
		CommandRegistry.prototype.listCommands = function () {
			return Object.keys(this._commands);
		};
		CommandRegistry.prototype.hasCommand = function (id) {
			return id in this._commands;
		};
		CommandRegistry.prototype.addCommand = function (id, options) {
			var _this = this;
			if (id in this._commands) {
				throw new Error("Command '" + id + "' already registered.");
			}
			this._commands[id] = Private.createCommand(options);
			this.commandChanged.emit({ id: id, type: 'added' });
			return new disposable_1.DisposableDelegate(function () {
				delete _this._commands[id];
				_this.commandChanged.emit({ id: id, type: 'removed' });
			});
		};
		CommandRegistry.prototype.notifyCommandChanged = function (id) {
			if (id in this._commands) {
				this.commandChanged.emit({ id: id, type: 'changed' });
			}
		};
		CommandRegistry.prototype.label = function (id, args) {
			var cmd = this._commands[id];
			return cmd ? cmd.label.call(void 0, args) : '';
		};
		CommandRegistry.prototype.mnemonic = function (id, args) {
			var cmd = this._commands[id];
			return cmd ? cmd.mnemonic.call(void 0, args) : -1;
		};
		CommandRegistry.prototype.icon = function (id, args) {
			var cmd = this._commands[id];
			return cmd ? cmd.icon.call(void 0, args) : '';
		};
		CommandRegistry.prototype.caption = function (id, args) {
			var cmd = this._commands[id];
			return cmd ? cmd.caption.call(void 0, args) : '';
		};
		CommandRegistry.prototype.usage = function (id, args) {
			var cmd = this._commands[id];
			return cmd ? cmd.usage.call(void 0, args) : '';
		};
		CommandRegistry.prototype.className = function (id, args) {
			var cmd = this._commands[id];
			return cmd ? cmd.className.call(void 0, args) : '';
		};
		CommandRegistry.prototype.isEnabled = function (id, args) {
			var cmd = this._commands[id];
			return cmd ? cmd.isEnabled.call(void 0, args) : false;
		};
		CommandRegistry.prototype.isToggled = function (id, args) {
			var cmd = this._commands[id];
			return cmd ? cmd.isToggled.call(void 0, args) : false;
		};
		CommandRegistry.prototype.isVisible = function (id, args) {
			var cmd = this._commands[id];
			return cmd ? cmd.isVisible.call(void 0, args) : false;
		};
		CommandRegistry.prototype.execute = function (id, args) {
			var cmd = this._commands[id];
			if (!cmd) {
				return Promise.reject(new Error("Command '" + id + "' not registered."));
			}
			var result;
			try {
				result = cmd.execute.call(void 0, args);
			}
			catch (err) {
				result = Promise.reject(err);
			}
			var promise = Promise.resolve(result);
			this.commandExecuted.emit({ id: id, args: args });
			return promise;
		};
		return CommandRegistry;
	}());
	exports.CommandRegistry = CommandRegistry;
	signaling_1.defineSignal(CommandRegistry.prototype, 'commandChanged');
	signaling_1.defineSignal(CommandRegistry.prototype, 'commandExecuted');
	var Private;
	(function (Private) {
		function createCommand(options) {
			return {
				execute: options.execute,
				label: asStringFunc(options.label),
				mnemonic: asNumberFunc(options.mnemonic),
				icon: asStringFunc(options.icon),
				caption: asStringFunc(options.caption),
				usage: asStringFunc(options.usage),
				className: asStringFunc(options.className),
				isEnabled: options.isEnabled || trueFunc,
				isToggled: options.isToggled || falseFunc,
				isVisible: options.isVisible || trueFunc
			};
		}
		Private.createCommand = createCommand;
		var emptyStringFunc = function (args) { return ''; };
		var negativeOneFunc = function (args) { return -1; };
		var trueFunc = function (args) { return true; };
		var falseFunc = function (args) { return false; };
		function asStringFunc(value) {
			if (value === void 0) {
				return emptyStringFunc;
			}
			if (typeof value === 'function') {
				return value;
			}
			return function (args) { return value; };
		}
		function asNumberFunc(value) {
			if (value === void 0) {
				return negativeOneFunc;
			}
			if (typeof value === 'function') {
				return value;
			}
			return function (args) { return value; };
		}
	})(Private || (Private = {}));
},
function(module, exports, __webpack_require__) {
	"use strict";
	var json_1 = __webpack_require__(20);
	var searching_1 = __webpack_require__(21);
	var vector_1 = __webpack_require__(23);
	var disposable_1 = __webpack_require__(1);
	var signaling_1 = __webpack_require__(9);
	var platform_1 = __webpack_require__(13);
	var selector_1 = __webpack_require__(15);
	var keyboard_1 = __webpack_require__(24);
	var CHORD_TIMEOUT = 1000;
	var Keymap = (function () {
		function Keymap(options) {
			this._timerID = 0;
			this._replaying = false;
			this._keys = [];
			this._events = [];
			this._exact = null;
			this._bindings = new vector_1.Vector();
			this._commands = options.commands;
			this._layout = options.layout || keyboard_1.EN_US;
		}
		Object.defineProperty(Keymap.prototype, "commands", {
			get: function () {
				return this._commands;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Keymap.prototype, "layout", {
			get: function () {
				return this._layout;
			},
			set: function (value) {
				var oldValue = this._layout;
				var newValue = value || keyboard_1.EN_US;
				if (oldValue === newValue) {
					return;
				}
				this._layout = newValue;
				this.layoutChanged.emit({ oldValue: oldValue, newValue: newValue });
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Keymap.prototype, "bindings", {
			get: function () {
				return this._bindings;
			},
			enumerable: true,
			configurable: true
		});
		Keymap.prototype.findBinding = function (command, args) {
			var i = searching_1.findLastIndex(this._bindings, function (kb) {
				return kb.command === command && json_1.deepEqual(kb.args, args);
			});
			return i !== -1 ? this._bindings.at(i) : null;
		};
		Keymap.prototype.addBinding = function (options) {
			var _this = this;
			var binding = Private.createBinding(options);
			this._bindings.pushBack(binding);
			this.bindingChanged.emit({ binding: binding, type: 'added' });
			return new disposable_1.DisposableDelegate(function () {
				_this._bindings.remove(binding);
				_this.bindingChanged.emit({ binding: binding, type: 'removed' });
			});
		};
		Keymap.prototype.processKeydownEvent = function (event) {
			if (this._replaying) {
				return;
			}
			var keystroke = Keymap.keystrokeForKeydownEvent(event, this._layout);
			if (!keystroke) {
				this._replayEvents();
				this._clearPendingState();
				return;
			}
			this._keys.push(keystroke);
			var _a = Private.match(this._bindings, this._keys, event), exact = _a.exact, partial = _a.partial;
			if (!exact && !partial) {
				this._replayEvents();
				this._clearPendingState();
				return;
			}
			event.preventDefault();
			event.stopPropagation();
			if (!partial) {
				this._execute(exact);
				this._clearPendingState();
				return;
			}
			if (exact)
				this._exact = exact;
			this._events.push(event);
			this._startTimer();
		};
		Keymap.prototype._startTimer = function () {
			var _this = this;
			this._clearTimer();
			this._timerID = setTimeout(function () {
				_this._onPendingTimeout();
			}, CHORD_TIMEOUT);
		};
		Keymap.prototype._clearTimer = function () {
			if (this._timerID !== 0) {
				clearTimeout(this._timerID);
				this._timerID = 0;
			}
		};
		Keymap.prototype._clearPendingState = function () {
			this._clearTimer();
			this._exact = null;
			this._keys.length = 0;
			this._events.length = 0;
		};
		Keymap.prototype._replayEvents = function () {
			if (this._events.length === 0) {
				return;
			}
			this._replaying = true;
			this._events.forEach(Private.replayEvent);
			this._replaying = false;
		};
		Keymap.prototype._execute = function (binding) {
			var command = binding.command, args = binding.args;
			if (this._commands.isEnabled(command, args)) {
				this._commands.execute(command, args);
			}
			else {
				var formatted = binding.keys.map(Keymap.formatKeystroke).join(' ');
				console.log("Command '" + command + "' is disabled (" + formatted + ").");
			}
		};
		Keymap.prototype._onPendingTimeout = function () {
			this._timerID = 0;
			if (this._exact) {
				this._execute(this._exact);
			}
			else {
				this._replayEvents();
			}
			this._clearPendingState();
		};
		return Keymap;
	}());
	exports.Keymap = Keymap;
	signaling_1.defineSignal(Keymap.prototype, 'bindingChanged');
	signaling_1.defineSignal(Keymap.prototype, 'layoutChanged');
	var Keymap;
	(function (Keymap) {
		function parseKeystroke(keystroke) {
			var key = '';
			var alt = false;
			var cmd = false;
			var ctrl = false;
			var shift = false;
			for (var _i = 0, _a = keystroke.split(/\s+/); _i < _a.length; _i++) {
				var token = _a[_i];
				if (token === 'Accel') {
					if (platform_1.IS_MAC) {
						cmd = true;
					}
					else {
						ctrl = true;
					}
				}
				else if (token === 'Alt') {
					alt = true;
				}
				else if (token === 'Cmd') {
					cmd = true;
				}
				else if (token === 'Ctrl') {
					ctrl = true;
				}
				else if (token === 'Shift') {
					shift = true;
				}
				else if (token.length > 0) {
					key = token;
				}
			}
			return { cmd: cmd, ctrl: ctrl, alt: alt, shift: shift, key: key };
		}
		Keymap.parseKeystroke = parseKeystroke;
		function normalizeKeystroke(keystroke) {
			var mods = '';
			var parts = parseKeystroke(keystroke);
			if (parts.ctrl) {
				mods += 'Ctrl ';
			}
			if (parts.alt) {
				mods += 'Alt ';
			}
			if (parts.shift) {
				mods += 'Shift ';
			}
			if (parts.cmd && platform_1.IS_MAC) {
				mods += 'Cmd ';
			}
			return mods + parts.key;
		}
		Keymap.normalizeKeystroke = normalizeKeystroke;
		function formatKeystroke(keystroke) {
			var mods = '';
			var parts = parseKeystroke(keystroke);
			if (platform_1.IS_MAC) {
				if (parts.ctrl) {
					mods += '\u2303';
				}
				if (parts.alt) {
					mods += '\u2325';
				}
				if (parts.shift) {
					mods += '\u21E7';
				}
				if (parts.cmd) {
					mods += '\u2318';
				}
			}
			else {
				if (parts.ctrl) {
					mods += 'Ctrl+';
				}
				if (parts.alt) {
					mods += 'Alt+';
				}
				if (parts.shift) {
					mods += 'Shift+';
				}
			}
			return mods + parts.key;
		}
		Keymap.formatKeystroke = formatKeystroke;
		function keystrokeForKeydownEvent(event, layout) {
			var key = layout.keyForKeydownEvent(event);
			if (!key) {
				return '';
			}
			var mods = '';
			if (event.ctrlKey) {
				mods += 'Ctrl ';
			}
			if (event.altKey) {
				mods += 'Alt ';
			}
			if (event.shiftKey) {
				mods += 'Shift ';
			}
			if (event.metaKey && platform_1.IS_MAC) {
				mods += 'Cmd ';
			}
			return mods + key;
		}
		Keymap.keystrokeForKeydownEvent = keystrokeForKeydownEvent;
	})(Keymap = exports.Keymap || (exports.Keymap = {}));
	var Private;
	(function (Private) {
		function createBinding(options) {
			return new KeyBinding(options);
		}
		Private.createBinding = createBinding;
		function match(bindings, keys, event) {
			var partial = false;
			var exact = null;
			var distance = Infinity;
			var specificity = 0;
			for (var i = 0, n = bindings.length; i < n; ++i) {
				var binding = bindings.at(i);
				var sqm = matchSequence(binding.keys, keys);
				if (sqm === 0 ) {
					continue;
				}
				if (sqm === 2 ) {
					if (!partial && targetDistance(binding.selector, event) !== -1) {
						partial = true;
					}
					continue;
				}
				var td = targetDistance(binding.selector, event);
				if (td === -1 || td > distance) {
					continue;
				}
				var sp = selector_1.calculateSpecificity(binding.selector);
				if (exact === null || td < distance || sp >= specificity) {
					exact = binding;
					distance = td;
					specificity = sp;
				}
			}
			return { exact: exact, partial: partial };
		}
		Private.match = match;
		function replayEvent(event) {
			event.target.dispatchEvent(cloneKeyboardEvent(event));
		}
		Private.replayEvent = replayEvent;
		var KeyBinding = (function () {
			function KeyBinding(options) {
				this._keys = normalizeKeys(options);
				this._selector = normalizeSelector(options);
				this._command = options.command;
				this._args = options.args || null;
			}
			Object.defineProperty(KeyBinding.prototype, "keys", {
				get: function () {
					return this._keys;
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(KeyBinding.prototype, "selector", {
				get: function () {
					return this._selector;
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(KeyBinding.prototype, "command", {
				get: function () {
					return this._command;
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(KeyBinding.prototype, "args", {
				get: function () {
					return this._args;
				},
				enumerable: true,
				configurable: true
			});
			return KeyBinding;
		}());
		function normalizeKeys(options) {
			var keys;
			if (platform_1.IS_WIN) {
				keys = options.winKeys || options.keys;
			}
			else if (platform_1.IS_MAC) {
				keys = options.macKeys || options.keys;
			}
			else {
				keys = options.linuxKeys || options.keys;
			}
			return Object.freeze(keys.map(Keymap.normalizeKeystroke));
		}
		function normalizeSelector(options) {
			return selector_1.validateSelector(options.selector.split(',', 1)[0]);
		}
		;
		function matchSequence(bindKeys, userKeys) {
			if (bindKeys.length < userKeys.length) {
				return 0 ;
			}
			for (var i = 0, n = userKeys.length; i < n; ++i) {
				if (bindKeys[i] !== userKeys[i]) {
					return 0 ;
				}
			}
			if (bindKeys.length > userKeys.length) {
				return 2 ;
			}
			return 1 ;
		}
		function targetDistance(selector, event) {
			var distance = 0;
			var target = event.target;
			var current = event.currentTarget;
			for (; target !== null; target = target.parentElement, ++distance) {
				if (selector_1.matchesSelector(target, selector)) {
					return distance;
				}
				if (target === current) {
					return -1;
				}
			}
			return -1;
		}
		function cloneKeyboardEvent(event) {
			var clone = document.createEvent('Event');
			var bubbles = event.bubbles || true;
			var cancelable = event.cancelable || true;
			clone.initEvent(event.type || 'keydown', bubbles, cancelable);
			clone.key = event.key || '';
			clone.keyCode = event.keyCode || 0;
			clone.which = event.keyCode || 0;
			clone.ctrlKey = event.ctrlKey || false;
			clone.altKey = event.altKey || false;
			clone.shiftKey = event.shiftKey || false;
			clone.metaKey = event.metaKey || false;
			clone.view = event.view || window;
			return clone;
		}
	})(Private || (Private = {}));
},
function(module, exports) {
	"use strict";
	function isPrimitive(value) {
		return (value === null ||
			typeof value === 'boolean' ||
			typeof value === 'number' ||
			typeof value === 'string');
	}
	exports.isPrimitive = isPrimitive;
	function isArray(value) {
		return Array.isArray(value);
	}
	exports.isArray = isArray;
	function isObject(value) {
		return !isPrimitive(value) && !isArray(value);
	}
	exports.isObject = isObject;
	function deepEqual(first, second) {
		if (first === second) {
			return true;
		}
		if (isPrimitive(first) || isPrimitive(second)) {
			return false;
		}
		if (!first || !second) {
			return false;
		}
		var a1 = isArray(first);
		var a2 = isArray(second);
		if (a1 !== a2) {
			return false;
		}
		if (a1 && a2) {
			return Private.arrayEqual(first, second);
		}
		return Private.objectEqual(first, second);
	}
	exports.deepEqual = deepEqual;
	var Private;
	(function (Private) {
		function arrayEqual(first, second) {
			if (first.length !== second.length) {
				return false;
			}
			for (var i = 0, n = first.length; i < n; ++i) {
				if (!deepEqual(first[i], second[i])) {
					return false;
				}
			}
			return true;
		}
		Private.arrayEqual = arrayEqual;
		function objectEqual(first, second) {
			var k1 = Object.keys(first);
			var k2 = Object.keys(second);
			if (k1.length !== k2.length) {
				return false;
			}
			k1.sort();
			k2.sort();
			for (var i = 0, n = k1.length; i < n; ++i) {
				if (k1[i] !== k2[i]) {
					return false;
				}
			}
			for (var i = 0, n = k1.length; i < n; ++i) {
				if (!deepEqual(first[k1[i]], second[k1[i]])) {
					return false;
				}
			}
			return true;
		}
		Private.objectEqual = objectEqual;
	})(Private || (Private = {}));
},
function(module, exports, __webpack_require__) {
	"use strict";
	var iteration_1 = __webpack_require__(2);
	var sequence_1 = __webpack_require__(22);
	function find(object, fn) {
		var value;
		var it = iteration_1.iter(object);
		while ((value = it.next()) !== void 0) {
			if (fn(value)) {
				return value;
			}
		}
		return void 0;
	}
	exports.find = find;
	function contains(object, value) {
		var temp;
		var it = iteration_1.iter(object);
		while ((temp = it.next()) !== void 0) {
			if (temp === value) {
				return true;
			}
		}
		return false;
	}
	exports.contains = contains;
	function min(object, fn) {
		var it = iteration_1.iter(object);
		var result = it.next();
		if (result === void 0) {
			return void 0;
		}
		var value;
		while ((value = it.next()) !== void 0) {
			if (fn(value, result) < 0) {
				result = value;
			}
		}
		return result;
	}
	exports.min = min;
	function max(object, fn) {
		var it = iteration_1.iter(object);
		var result = it.next();
		if (result === void 0) {
			return void 0;
		}
		var value;
		while ((value = it.next()) !== void 0) {
			if (fn(value, result) > 0) {
				result = value;
			}
		}
		return result;
	}
	exports.max = max;
	function indexOf(object, value, fromIndex) {
		var length = object.length;
		if (length === 0) {
			return -1;
		}
		var start;
		if (fromIndex === void 0) {
			start = 0;
		}
		else {
			start = fromIndex;
		}
		var seq = sequence_1.asSequence(object);
		for (var i = start; i < length; ++i) {
			if (seq.at(i) === value) {
				return i;
			}
		}
		return -1;
	}
	exports.indexOf = indexOf;
	function lastIndexOf(object, value, fromIndex) {
		var length = object.length;
		if (length === 0) {
			return -1;
		}
		var start;
		if (fromIndex === void 0) {
			start = length - 1;
		}
		else {
			start = fromIndex;
		}
		var seq = sequence_1.asSequence(object);
		for (var i = start; i >= 0; --i) {
			if (seq.at(i) === value) {
				return i;
			}
		}
		return -1;
	}
	exports.lastIndexOf = lastIndexOf;
	function findIndex(object, fn, fromIndex) {
		var length = object.length;
		if (length === 0) {
			return -1;
		}
		var start;
		if (fromIndex === void 0) {
			start = 0;
		}
		else {
			start = fromIndex;
		}
		var seq = sequence_1.asSequence(object);
		for (var i = start; i < length; ++i) {
			if (fn(seq.at(i), i)) {
				return i;
			}
		}
		return -1;
	}
	exports.findIndex = findIndex;
	function findLastIndex(object, fn, fromIndex) {
		var length = object.length;
		if (length === 0) {
			return -1;
		}
		var start;
		if (fromIndex === void 0) {
			start = length - 1;
		}
		else {
			start = fromIndex;
		}
		var seq = sequence_1.asSequence(object);
		for (var i = start; i >= 0; --i) {
			if (fn(seq.at(i), i)) {
				return i;
			}
		}
		return -1;
	}
	exports.findLastIndex = findLastIndex;
	function lowerBound(object, value, fn) {
		var n = object.length;
		if (n === 0) {
			return 0;
		}
		var begin = 0;
		var half;
		var middle;
		var seq = sequence_1.asSequence(object);
		while (n > 0) {
			half = n / 2 | 0;
			middle = begin + half;
			if (fn(seq.at(middle), value) < 0) {
				begin = middle + 1;
				n -= half + 1;
			}
			else {
				n = half;
			}
		}
		return begin;
	}
	exports.lowerBound = lowerBound;
	function upperBound(object, value, fn) {
		var n = object.length;
		if (n === 0) {
			return 0;
		}
		var begin = 0;
		var half;
		var middle;
		var seq = sequence_1.asSequence(object);
		while (n > 0) {
			half = n / 2 | 0;
			middle = begin + half;
			if (fn(seq.at(middle), value) > 0) {
				n = half;
			}
			else {
				begin = middle + 1;
				n -= half + 1;
			}
		}
		return begin;
	}
	exports.upperBound = upperBound;
	var StringSearch;
	(function (StringSearch) {
		function sumOfSquares(sourceText, queryText) {
			var score = 0;
			var indices = new Array(queryText.length);
			for (var i = 0, j = 0, n = queryText.length; i < n; ++i, ++j) {
				j = sourceText.indexOf(queryText[i], j);
				if (j === -1) {
					return null;
				}
				indices[i] = j;
				score += j * j;
			}
			return { score: score, indices: indices };
		}
		StringSearch.sumOfSquares = sumOfSquares;
		function highlight(sourceText, indices) {
			var k = 0;
			var last = 0;
			var result = '';
			var n = indices.length;
			while (k < n) {
				var i = indices[k];
				var j = indices[k];
				while (++k < n && indices[k] === j + 1) {
					j++;
				}
				var head = sourceText.slice(last, i);
				var chunk = sourceText.slice(i, j + 1);
				result += head + "<mark>" + chunk + "</mark>";
				last = j + 1;
			}
			return result + sourceText.slice(last);
		}
		StringSearch.highlight = highlight;
	})(StringSearch = exports.StringSearch || (exports.StringSearch = {}));
},
function(module, exports, __webpack_require__) {
	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
		for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
		function __() { this.constructor = d; }
		d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var iteration_1 = __webpack_require__(2);
	function asSequence(object) {
		var seq;
		if (typeof object.at === 'function') {
			seq = object;
		}
		else {
			seq = new ArraySequence(object);
		}
		return seq;
	}
	exports.asSequence = asSequence;
	function asMutableSequence(object) {
		var seq;
		if (typeof object.set === 'function') {
			seq = object;
		}
		else {
			seq = new MutableArraySequence(object);
		}
		return seq;
	}
	exports.asMutableSequence = asMutableSequence;
	var ArraySequence = (function () {
		function ArraySequence(source) {
			this._source = source;
		}
		Object.defineProperty(ArraySequence.prototype, "length", {
			get: function () {
				return this._source.length;
			},
			enumerable: true,
			configurable: true
		});
		ArraySequence.prototype.iter = function () {
			return new iteration_1.ArrayIterator(this._source, 0);
		};
		ArraySequence.prototype.at = function (index) {
			return this._source[index];
		};
		return ArraySequence;
	}());
	exports.ArraySequence = ArraySequence;
	var MutableArraySequence = (function (_super) {
		__extends(MutableArraySequence, _super);
		function MutableArraySequence() {
			_super.apply(this, arguments);
		}
		MutableArraySequence.prototype.set = function (index, value) {
			this._source[index] = value;
		};
		return MutableArraySequence;
	}(ArraySequence));
	exports.MutableArraySequence = MutableArraySequence;
},
function(module, exports, __webpack_require__) {
	"use strict";
	var iteration_1 = __webpack_require__(2);
	var Vector = (function () {
		function Vector(values) {
			var _this = this;
			this._array = [];
			if (values)
				iteration_1.each(values, function (value) { _this.pushBack(value); });
		}
		Object.defineProperty(Vector.prototype, "isEmpty", {
			get: function () {
				return this._array.length === 0;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Vector.prototype, "length", {
			get: function () {
				return this._array.length;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Vector.prototype, "front", {
			get: function () {
				return this._array[0];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Vector.prototype, "back", {
			get: function () {
				return this._array[this._array.length - 1];
			},
			enumerable: true,
			configurable: true
		});
		Vector.prototype.iter = function () {
			return new iteration_1.ArrayIterator(this._array, 0);
		};
		Vector.prototype.at = function (index) {
			return this._array[index];
		};
		Vector.prototype.set = function (index, value) {
			this._array[index] = value;
		};
		Vector.prototype.pushBack = function (value) {
			return this._array.push(value);
		};
		Vector.prototype.popBack = function () {
			return this._array.pop();
		};
		Vector.prototype.insert = function (index, value) {
			var array = this._array;
			var n = array.length;
			index = Math.max(0, Math.min(index, n));
			for (var i = n; i > index; --i) {
				array[i] = array[i - 1];
			}
			array[index] = value;
			return n + 1;
		};
		Vector.prototype.remove = function (value) {
			var index = this._array.indexOf(value);
			if (index !== -1)
				this.removeAt(index);
			return index;
		};
		Vector.prototype.removeAt = function (index) {
			var array = this._array;
			var n = array.length;
			if (index < 0 || index >= n) {
				return void 0;
			}
			var value = array[index];
			for (var i = index + 1; i < n; ++i) {
				array[i - 1] = array[i];
			}
			array.length = n - 1;
			return value;
		};
		Vector.prototype.clear = function () {
			this._array.length = 0;
		};
		Vector.prototype.swap = function (other) {
			var array = other._array;
			other._array = this._array;
			this._array = array;
		};
		return Vector;
	}());
	exports.Vector = Vector;
},
function(module, exports) {
	"use strict";
	var KeycodeLayout = (function () {
		function KeycodeLayout(name, codes) {
			this._name = name;
			this._codes = codes;
			this._keys = KeycodeLayout.extractKeys(codes);
		}
		Object.defineProperty(KeycodeLayout.prototype, "name", {
			get: function () {
				return this._name;
			},
			enumerable: true,
			configurable: true
		});
		KeycodeLayout.prototype.keys = function () {
			return Object.keys(this._keys);
		};
		KeycodeLayout.prototype.isValidKey = function (key) {
			return key in this._keys;
		};
		KeycodeLayout.prototype.keyForKeydownEvent = function (event) {
			return this._codes[event.keyCode] || '';
		};
		return KeycodeLayout;
	}());
	exports.KeycodeLayout = KeycodeLayout;
	var KeycodeLayout;
	(function (KeycodeLayout) {
		function extractKeys(codes) {
			var keys = Object.create(null);
			for (var c in codes)
				keys[codes[c]] = true;
			return keys;
		}
		KeycodeLayout.extractKeys = extractKeys;
	})(KeycodeLayout = exports.KeycodeLayout || (exports.KeycodeLayout = {}));
	exports.EN_US = new KeycodeLayout('en-us', {
		8: 'Backspace',
		9: 'Tab',
		13: 'Enter',
		19: 'Pause',
		27: 'Escape',
		32: 'Space',
		33: 'PageUp',
		34: 'PageDown',
		35: 'End',
		36: 'Home',
		37: 'ArrowLeft',
		38: 'ArrowUp',
		39: 'ArrowRight',
		40: 'ArrowDown',
		45: 'Insert',
		46: 'Delete',
		48: '0',
		49: '1',
		50: '2',
		51: '3',
		52: '4',
		53: '5',
		54: '6',
		55: '7',
		56: '8',
		57: '9',
		59: ';',
		61: '=',
		65: 'A',
		66: 'B',
		67: 'C',
		68: 'D',
		69: 'E',
		70: 'F',
		71: 'G',
		72: 'H',
		73: 'I',
		74: 'J',
		75: 'K',
		76: 'L',
		77: 'M',
		78: 'N',
		79: 'O',
		80: 'P',
		81: 'Q',
		82: 'R',
		83: 'S',
		84: 'T',
		85: 'U',
		86: 'V',
		87: 'W',
		88: 'X',
		89: 'Y',
		90: 'Z',
		93: 'ContextMenu',
		96: '0',
		97: '1',
		98: '2',
		99: '3',
		100: '4',
		101: '5',
		102: '6',
		103: '7',
		104: '8',
		105: '9',
		106: '*',
		107: '+',
		109: '-',
		110: '.',
		111: '/',
		112: 'F1',
		113: 'F2',
		114: 'F3',
		115: 'F4',
		116: 'F5',
		117: 'F6',
		118: 'F7',
		119: 'F8',
		120: 'F9',
		121: 'F10',
		122: 'F11',
		123: 'F12',
		173: '-',
		186: ';',
		187: '=',
		188: ',',
		189: '-',
		190: '.',
		191: '/',
		192: '`',
		219: '[',
		220: '\\',
		221: ']',
		222: '\''
	});
},
function(module, exports, __webpack_require__) {
	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
		for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
		function __() { this.constructor = d; }
		d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var iteration_1 = __webpack_require__(2);
	var messaging_1 = __webpack_require__(3);
	var properties_1 = __webpack_require__(8);
	var signaling_1 = __webpack_require__(9);
	var title_1 = __webpack_require__(26);
	var WIDGET_CLASS = 'p-Widget';
	var HIDDEN_CLASS = 'p-mod-hidden';
	var Widget = (function () {
		function Widget(options) {
			if (options === void 0) { options = {}; }
			this._flags = 0;
			this._layout = null;
			this._parent = null;
			this._node = Private.createNode(options);
			this.addClass(WIDGET_CLASS);
		}
		Widget.prototype.dispose = function () {
			if (this.isDisposed) {
				return;
			}
			this.setFlag(WidgetFlag.IsDisposed);
			this.disposed.emit(void 0);
			if (this.parent) {
				this.parent = null;
			}
			else if (this.isAttached) {
				Widget.detach(this);
			}
			if (this._layout) {
				this._layout.dispose();
				this._layout = null;
			}
			signaling_1.clearSignalData(this);
			messaging_1.clearMessageData(this);
			properties_1.clearPropertyData(this);
			this._node = null;
		};
		Object.defineProperty(Widget.prototype, "isDisposed", {
			get: function () {
				return this.testFlag(WidgetFlag.IsDisposed);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Widget.prototype, "isAttached", {
			get: function () {
				return this.testFlag(WidgetFlag.IsAttached);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Widget.prototype, "isHidden", {
			get: function () {
				return this.testFlag(WidgetFlag.IsHidden);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Widget.prototype, "isVisible", {
			get: function () {
				return this.testFlag(WidgetFlag.IsVisible);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Widget.prototype, "node", {
			get: function () {
				return this._node;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Widget.prototype, "id", {
			get: function () {
				return this._node.id;
			},
			set: function (value) {
				this._node.id = value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Widget.prototype, "title", {
			get: function () {
				return Private.titleProperty.get(this);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Widget.prototype, "parent", {
			get: function () {
				return this._parent;
			},
			set: function (value) {
				value = value || null;
				if (this._parent === value) {
					return;
				}
				if (value && this.contains(value)) {
					throw new Error('Invalid parent widget.');
				}
				if (this._parent && !this._parent.isDisposed) {
					messaging_1.sendMessage(this._parent, new ChildMessage('child-removed', this));
				}
				this._parent = value;
				if (this._parent && !this._parent.isDisposed) {
					messaging_1.sendMessage(this._parent, new ChildMessage('child-added', this));
				}
				messaging_1.sendMessage(this, WidgetMessage.ParentChanged);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Widget.prototype, "layout", {
			get: function () {
				return this._layout;
			},
			set: function (value) {
				value = value || null;
				if (this._layout === value) {
					return;
				}
				if (this.testFlag(WidgetFlag.DisallowLayout)) {
					throw new Error('Cannot set widget layout.');
				}
				if (this._layout) {
					throw new Error('Cannot change widget layout.');
				}
				if (value.parent) {
					throw new Error('Cannot change layout parent.');
				}
				this._layout = value;
				value.parent = this;
			},
			enumerable: true,
			configurable: true
		});
		Widget.prototype.children = function () {
			return this._layout ? this._layout.iter() : iteration_1.empty();
		};
		Widget.prototype.contains = function (widget) {
			for (; widget; widget = widget._parent) {
				if (widget === this)
					return true;
			}
			return false;
		};
		Widget.prototype.hasClass = function (name) {
			return this._node.classList.contains(name);
		};
		Widget.prototype.addClass = function (name) {
			this._node.classList.add(name);
		};
		Widget.prototype.removeClass = function (name) {
			this._node.classList.remove(name);
		};
		Widget.prototype.toggleClass = function (name, force) {
			if (force === true) {
				this._node.classList.add(name);
				return true;
			}
			if (force === false) {
				this._node.classList.remove(name);
				return false;
			}
			return this._node.classList.toggle(name);
		};
		Widget.prototype.update = function () {
			messaging_1.postMessage(this, WidgetMessage.UpdateRequest);
		};
		Widget.prototype.fit = function () {
			messaging_1.postMessage(this, WidgetMessage.FitRequest);
		};
		Widget.prototype.activate = function () {
			messaging_1.postMessage(this, WidgetMessage.ActivateRequest);
		};
		Widget.prototype.close = function () {
			messaging_1.sendMessage(this, WidgetMessage.CloseRequest);
		};
		Widget.prototype.show = function () {
			if (!this.testFlag(WidgetFlag.IsHidden)) {
				return;
			}
			this.clearFlag(WidgetFlag.IsHidden);
			this.removeClass(HIDDEN_CLASS);
			if (this.isAttached && (!this.parent || this.parent.isVisible)) {
				messaging_1.sendMessage(this, WidgetMessage.AfterShow);
			}
			if (this.parent) {
				messaging_1.sendMessage(this.parent, new ChildMessage('child-shown', this));
			}
		};
		Widget.prototype.hide = function () {
			if (this.testFlag(WidgetFlag.IsHidden)) {
				return;
			}
			if (this.isAttached && (!this.parent || this.parent.isVisible)) {
				messaging_1.sendMessage(this, WidgetMessage.BeforeHide);
			}
			this.setFlag(WidgetFlag.IsHidden);
			this.addClass(HIDDEN_CLASS);
			if (this.parent) {
				messaging_1.sendMessage(this.parent, new ChildMessage('child-hidden', this));
			}
		};
		Widget.prototype.setHidden = function (hidden) {
			if (hidden) {
				this.hide();
			}
			else {
				this.show();
			}
		};
		Widget.prototype.testFlag = function (flag) {
			return (this._flags & flag) !== 0;
		};
		Widget.prototype.setFlag = function (flag) {
			this._flags |= flag;
		};
		Widget.prototype.clearFlag = function (flag) {
			this._flags &= ~flag;
		};
		Widget.prototype.processMessage = function (msg) {
			switch (msg.type) {
				case 'resize':
					this.notifyLayout(msg);
					this.onResize(msg);
					break;
				case 'update-request':
					this.notifyLayout(msg);
					this.onUpdateRequest(msg);
					break;
				case 'after-show':
					this.setFlag(WidgetFlag.IsVisible);
					this.notifyLayout(msg);
					this.onAfterShow(msg);
					break;
				case 'before-hide':
					this.notifyLayout(msg);
					this.onBeforeHide(msg);
					this.clearFlag(WidgetFlag.IsVisible);
					break;
				case 'after-attach':
					var visible = !this.isHidden && (!this.parent || this.parent.isVisible);
					if (visible)
						this.setFlag(WidgetFlag.IsVisible);
					this.setFlag(WidgetFlag.IsAttached);
					this.notifyLayout(msg);
					this.onAfterAttach(msg);
					break;
				case 'before-detach':
					this.notifyLayout(msg);
					this.onBeforeDetach(msg);
					this.clearFlag(WidgetFlag.IsVisible);
					this.clearFlag(WidgetFlag.IsAttached);
					break;
				case 'activate-request':
					this.notifyLayout(msg);
					this.onActivateRequest(msg);
					break;
				case 'close-request':
					this.notifyLayout(msg);
					this.onCloseRequest(msg);
					break;
				case 'child-added':
					this.notifyLayout(msg);
					this.onChildAdded(msg);
					break;
				case 'child-removed':
					this.notifyLayout(msg);
					this.onChildRemoved(msg);
					break;
				default:
					this.notifyLayout(msg);
					break;
			}
		};
		Widget.prototype.notifyLayout = function (msg) {
			if (this._layout)
				this._layout.processParentMessage(msg);
		};
		Widget.prototype.onCloseRequest = function (msg) {
			if (this.parent) {
				this.parent = null;
			}
			else if (this.isAttached) {
				Widget.detach(this);
			}
		};
		Widget.prototype.onResize = function (msg) { };
		Widget.prototype.onUpdateRequest = function (msg) { };
		Widget.prototype.onActivateRequest = function (msg) { };
		Widget.prototype.onAfterShow = function (msg) { };
		Widget.prototype.onBeforeHide = function (msg) { };
		Widget.prototype.onAfterAttach = function (msg) { };
		Widget.prototype.onBeforeDetach = function (msg) { };
		Widget.prototype.onChildAdded = function (msg) { };
		Widget.prototype.onChildRemoved = function (msg) { };
		return Widget;
	}());
	exports.Widget = Widget;
	signaling_1.defineSignal(Widget.prototype, 'disposed');
	var Widget;
	(function (Widget) {
		function attach(widget, host) {
			if (widget.parent) {
				throw new Error('Cannot attach child widget.');
			}
			if (widget.isAttached || document.body.contains(widget.node)) {
				throw new Error('Widget already attached.');
			}
			if (!document.body.contains(host)) {
				throw new Error('Host not attached.');
			}
			host.appendChild(widget.node);
			messaging_1.sendMessage(widget, WidgetMessage.AfterAttach);
		}
		Widget.attach = attach;
		function detach(widget) {
			if (widget.parent) {
				throw new Error('Cannot detach child widget.');
			}
			if (!widget.isAttached || !document.body.contains(widget.node)) {
				throw new Error('Widget not attached.');
			}
			messaging_1.sendMessage(widget, WidgetMessage.BeforeDetach);
			widget.node.parentNode.removeChild(widget.node);
		}
		Widget.detach = detach;
		function prepareGeometry(widget) {
			widget.node.style.position = 'absolute';
		}
		Widget.prepareGeometry = prepareGeometry;
		function resetGeometry(widget) {
			var style = widget.node.style;
			var rect = Private.rectProperty.get(widget);
			rect.top = NaN;
			rect.left = NaN;
			rect.width = NaN;
			rect.height = NaN;
			style.position = '';
			style.top = '';
			style.left = '';
			style.width = '';
			style.height = '';
		}
		Widget.resetGeometry = resetGeometry;
		function setGeometry(widget, left, top, width, height) {
			var resized = false;
			var style = widget.node.style;
			var rect = Private.rectProperty.get(widget);
			if (rect.top !== top) {
				rect.top = top;
				style.top = top + "px";
			}
			if (rect.left !== left) {
				rect.left = left;
				style.left = left + "px";
			}
			if (rect.width !== width) {
				resized = true;
				rect.width = width;
				style.width = width + "px";
			}
			if (rect.height !== height) {
				resized = true;
				rect.height = height;
				style.height = height + "px";
			}
			if (resized) {
				messaging_1.sendMessage(widget, new ResizeMessage(width, height));
			}
		}
		Widget.setGeometry = setGeometry;
	})(Widget = exports.Widget || (exports.Widget = {}));
	var Layout = (function () {
		function Layout() {
			this._disposed = false;
			this._parent = null;
		}
		Layout.prototype.dispose = function () {
			this._disposed = true;
			this._parent = null;
			signaling_1.clearSignalData(this);
			properties_1.clearPropertyData(this);
		};
		Object.defineProperty(Layout.prototype, "isDisposed", {
			get: function () {
				return this._disposed;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Layout.prototype, "parent", {
			get: function () {
				return this._parent;
			},
			set: function (value) {
				if (!value) {
					throw new Error('Cannot set parent widget to null.');
				}
				if (this._parent === value) {
					return;
				}
				if (this._parent) {
					throw new Error('Cannot change parent widget.');
				}
				if (value.layout !== this) {
					throw new Error('Invalid parent widget.');
				}
				this._parent = value;
				this.init();
			},
			enumerable: true,
			configurable: true
		});
		Layout.prototype.processParentMessage = function (msg) {
			switch (msg.type) {
				case 'resize':
					this.onResize(msg);
					break;
				case 'update-request':
					this.onUpdateRequest(msg);
					break;
				case 'fit-request':
					this.onFitRequest(msg);
					break;
				case 'after-show':
					this.onAfterShow(msg);
					break;
				case 'before-hide':
					this.onBeforeHide(msg);
					break;
				case 'after-attach':
					this.onAfterAttach(msg);
					break;
				case 'before-detach':
					this.onBeforeDetach(msg);
					break;
				case 'child-removed':
					this.onChildRemoved(msg);
					break;
				case 'child-shown':
					this.onChildShown(msg);
					break;
				case 'child-hidden':
					this.onChildHidden(msg);
					break;
			}
		};
		Layout.prototype.init = function () {
			var _this = this;
			iteration_1.each(this, function (widget) { widget.parent = _this.parent; });
		};
		Layout.prototype.onResize = function (msg) {
			iteration_1.each(this, function (widget) { messaging_1.sendMessage(widget, ResizeMessage.UnknownSize); });
		};
		Layout.prototype.onUpdateRequest = function (msg) {
			iteration_1.each(this, function (widget) { messaging_1.sendMessage(widget, ResizeMessage.UnknownSize); });
		};
		Layout.prototype.onAfterAttach = function (msg) {
			iteration_1.each(this, function (widget) { messaging_1.sendMessage(widget, msg); });
		};
		Layout.prototype.onBeforeDetach = function (msg) {
			iteration_1.each(this, function (widget) { messaging_1.sendMessage(widget, msg); });
		};
		Layout.prototype.onAfterShow = function (msg) {
			iteration_1.each(this, function (widget) { if (!widget.isHidden)
				messaging_1.sendMessage(widget, msg); });
		};
		Layout.prototype.onBeforeHide = function (msg) {
			iteration_1.each(this, function (widget) { if (!widget.isHidden)
				messaging_1.sendMessage(widget, msg); });
		};
		Layout.prototype.onChildRemoved = function (msg) {
			this.removeWidget(msg.child);
		};
		Layout.prototype.onFitRequest = function (msg) { };
		Layout.prototype.onChildShown = function (msg) { };
		Layout.prototype.onChildHidden = function (msg) { };
		return Layout;
	}());
	exports.Layout = Layout;
	(function (WidgetFlag) {
		WidgetFlag[WidgetFlag["IsDisposed"] = 1] = "IsDisposed";
		WidgetFlag[WidgetFlag["IsAttached"] = 2] = "IsAttached";
		WidgetFlag[WidgetFlag["IsHidden"] = 4] = "IsHidden";
		WidgetFlag[WidgetFlag["IsVisible"] = 8] = "IsVisible";
		WidgetFlag[WidgetFlag["DisallowLayout"] = 16] = "DisallowLayout";
	})(exports.WidgetFlag || (exports.WidgetFlag = {}));
	var WidgetFlag = exports.WidgetFlag;
	var WidgetMessage;
	(function (WidgetMessage) {
		WidgetMessage.AfterShow = new messaging_1.Message('after-show');
		WidgetMessage.BeforeHide = new messaging_1.Message('before-hide');
		WidgetMessage.AfterAttach = new messaging_1.Message('after-attach');
		WidgetMessage.BeforeDetach = new messaging_1.Message('before-detach');
		WidgetMessage.ParentChanged = new messaging_1.Message('parent-changed');
		WidgetMessage.UpdateRequest = new messaging_1.ConflatableMessage('update-request');
		WidgetMessage.FitRequest = new messaging_1.ConflatableMessage('fit-request');
		WidgetMessage.ActivateRequest = new messaging_1.ConflatableMessage('activate-request');
		WidgetMessage.CloseRequest = new messaging_1.ConflatableMessage('close-request');
	})(WidgetMessage = exports.WidgetMessage || (exports.WidgetMessage = {}));
	var ChildMessage = (function (_super) {
		__extends(ChildMessage, _super);
		function ChildMessage(type, child) {
			_super.call(this, type);
			this._child = child;
		}
		Object.defineProperty(ChildMessage.prototype, "child", {
			get: function () {
				return this._child;
			},
			enumerable: true,
			configurable: true
		});
		return ChildMessage;
	}(messaging_1.Message));
	exports.ChildMessage = ChildMessage;
	var ResizeMessage = (function (_super) {
		__extends(ResizeMessage, _super);
		function ResizeMessage(width, height) {
			_super.call(this, 'resize');
			this._width = width;
			this._height = height;
		}
		Object.defineProperty(ResizeMessage.prototype, "width", {
			get: function () {
				return this._width;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ResizeMessage.prototype, "height", {
			get: function () {
				return this._height;
			},
			enumerable: true,
			configurable: true
		});
		return ResizeMessage;
	}(messaging_1.Message));
	exports.ResizeMessage = ResizeMessage;
	var ResizeMessage;
	(function (ResizeMessage) {
		ResizeMessage.UnknownSize = new ResizeMessage(-1, -1);
	})(ResizeMessage = exports.ResizeMessage || (exports.ResizeMessage = {}));
	var Private;
	(function (Private) {
		Private.rectProperty = new properties_1.AttachedProperty({
			name: 'rect',
			create: function () { return ({ top: NaN, left: NaN, width: NaN, height: NaN }); },
		});
		Private.titleProperty = new properties_1.AttachedProperty({
			name: 'title',
			create: function (owner) { return new title_1.Title({ owner: owner }); },
		});
		function createNode(options) {
			return options.node || document.createElement('div');
		}
		Private.createNode = createNode;
	})(Private || (Private = {}));
},
function(module, exports, __webpack_require__) {
	"use strict";
	var signaling_1 = __webpack_require__(9);
	var Title = (function () {
		function Title(options) {
			if (options === void 0) { options = {}; }
			this._label = '';
			this._icon = '';
			this._caption = '';
			this._mnemonic = -1;
			this._className = '';
			this._closable = false;
			this._owner = null;
			if (options.owner !== void 0) {
				this._owner = options.owner;
			}
			if (options.label !== void 0) {
				this._label = options.label;
			}
			if (options.mnemonic !== void 0) {
				this._mnemonic = options.mnemonic;
			}
			if (options.icon !== void 0) {
				this._icon = options.icon;
			}
			if (options.caption !== void 0) {
				this._caption = options.caption;
			}
			if (options.closable !== void 0) {
				this._closable = options.closable;
			}
			if (options.className !== void 0) {
				this._className = options.className;
			}
		}
		Object.defineProperty(Title.prototype, "owner", {
			get: function () {
				return this._owner;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Title.prototype, "label", {
			get: function () {
				return this._label;
			},
			set: function (value) {
				if (this._label === value) {
					return;
				}
				this._label = value;
				this.changed.emit(void 0);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Title.prototype, "mnemonic", {
			get: function () {
				return this._mnemonic;
			},
			set: function (value) {
				if (this._mnemonic === value) {
					return;
				}
				this._mnemonic = value;
				this.changed.emit(void 0);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Title.prototype, "icon", {
			get: function () {
				return this._icon;
			},
			set: function (value) {
				if (this._icon === value) {
					return;
				}
				this._icon = value;
				this.changed.emit(void 0);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Title.prototype, "caption", {
			get: function () {
				return this._caption;
			},
			set: function (value) {
				if (this._caption === value) {
					return;
				}
				this._caption = value;
				this.changed.emit(void 0);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Title.prototype, "className", {
			get: function () {
				return this._className;
			},
			set: function (value) {
				if (this._className === value) {
					return;
				}
				this._className = value;
				this.changed.emit(void 0);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Title.prototype, "closable", {
			get: function () {
				return this._closable;
			},
			set: function (value) {
				if (this._closable === value) {
					return;
				}
				this._closable = value;
				this.changed.emit(void 0);
			},
			enumerable: true,
			configurable: true
		});
		return Title;
	}());
	exports.Title = Title;
	signaling_1.defineSignal(Title.prototype, 'changed');
},
function(module, exports, __webpack_require__) {
	"use strict";
	var sequence_1 = __webpack_require__(22);
	var BoxSizer = (function () {
		function BoxSizer() {
			this.sizeHint = 0;
			this.minSize = 0;
			this.maxSize = Infinity;
			this.stretch = 1;
			this.size = 0;
			this.done = false;
		}
		return BoxSizer;
	}());
	exports.BoxSizer = BoxSizer;
	function boxCalc(object, space) {
		var count = object.length;
		if (count === 0) {
			return;
		}
		var sizers = sequence_1.asSequence(object);
		var totalMin = 0;
		var totalMax = 0;
		var totalSize = 0;
		var totalStretch = 0;
		var stretchCount = 0;
		for (var i = 0; i < count; ++i) {
			var sizer = sizers.at(i);
			var min = sizer.minSize;
			var max = sizer.maxSize;
			var hint = sizer.sizeHint;
			sizer.done = false;
			sizer.size = Math.max(min, Math.min(hint, max));
			totalSize += sizer.size;
			totalMin += min;
			totalMax += max;
			if (sizer.stretch > 0) {
				totalStretch += sizer.stretch;
				stretchCount++;
			}
		}
		if (space === totalSize) {
			return;
		}
		if (space <= totalMin) {
			for (var i = 0; i < count; ++i) {
				var sizer = sizers.at(i);
				sizer.size = sizer.minSize;
			}
			return;
		}
		if (space >= totalMax) {
			for (var i = 0; i < count; ++i) {
				var sizer = sizers.at(i);
				sizer.size = sizer.maxSize;
			}
			return;
		}
		var nearZero = 0.01;
		var notDoneCount = count;
		if (space < totalSize) {
			var freeSpace = totalSize - space;
			while (stretchCount > 0 && freeSpace > nearZero) {
				var distSpace = freeSpace;
				var distStretch = totalStretch;
				for (var i = 0; i < count; ++i) {
					var sizer = sizers.at(i);
					if (sizer.done || sizer.stretch === 0) {
						continue;
					}
					var amt = sizer.stretch * distSpace / distStretch;
					if (sizer.size - amt <= sizer.minSize) {
						freeSpace -= sizer.size - sizer.minSize;
						totalStretch -= sizer.stretch;
						sizer.size = sizer.minSize;
						sizer.done = true;
						notDoneCount--;
						stretchCount--;
					}
					else {
						freeSpace -= amt;
						sizer.size -= amt;
					}
				}
			}
			while (notDoneCount > 0 && freeSpace > nearZero) {
				var amt = freeSpace / notDoneCount;
				for (var i = 0; i < count; ++i) {
					var sizer = sizers.at(i);
					if (sizer.done) {
						continue;
					}
					if (sizer.size - amt <= sizer.minSize) {
						freeSpace -= sizer.size - sizer.minSize;
						sizer.size = sizer.minSize;
						sizer.done = true;
						notDoneCount--;
					}
					else {
						freeSpace -= amt;
						sizer.size -= amt;
					}
				}
			}
		}
		else {
			var freeSpace = space - totalSize;
			while (stretchCount > 0 && freeSpace > nearZero) {
				var distSpace = freeSpace;
				var distStretch = totalStretch;
				for (var i = 0; i < count; ++i) {
					var sizer = sizers.at(i);
					if (sizer.done || sizer.stretch === 0) {
						continue;
					}
					var amt = sizer.stretch * distSpace / distStretch;
					if (sizer.size + amt >= sizer.maxSize) {
						freeSpace -= sizer.maxSize - sizer.size;
						totalStretch -= sizer.stretch;
						sizer.size = sizer.maxSize;
						sizer.done = true;
						notDoneCount--;
						stretchCount--;
					}
					else {
						freeSpace -= amt;
						sizer.size += amt;
					}
				}
			}
			while (notDoneCount > 0 && freeSpace > nearZero) {
				var amt = freeSpace / notDoneCount;
				for (var i = 0; i < count; ++i) {
					var sizer = sizers.at(i);
					if (sizer.done) {
						continue;
					}
					if (sizer.size + amt >= sizer.maxSize) {
						freeSpace -= sizer.maxSize - sizer.size;
						sizer.size = sizer.maxSize;
						sizer.done = true;
						notDoneCount--;
					}
					else {
						freeSpace -= amt;
						sizer.size += amt;
					}
				}
			}
		}
	}
	exports.boxCalc = boxCalc;
	function adjustSizer(object, index, delta) {
		if (object.length === 0 || delta === 0) {
			return;
		}
		if (delta > 0) {
			Private.growSizer(object, index, delta);
		}
		else {
			Private.shrinkSizer(object, index, -delta);
		}
	}
	exports.adjustSizer = adjustSizer;
	var Private;
	(function (Private) {
		function growSizer(object, index, delta) {
			var sizers = sequence_1.asSequence(object);
			var growLimit = 0;
			for (var i = 0; i <= index; ++i) {
				var sizer = sizers.at(i);
				growLimit += sizer.maxSize - sizer.size;
			}
			var shrinkLimit = 0;
			for (var i = index + 1, n = sizers.length; i < n; ++i) {
				var sizer = sizers.at(i);
				shrinkLimit += sizer.size - sizer.minSize;
			}
			delta = Math.min(delta, growLimit, shrinkLimit);
			var grow = delta;
			for (var i = index; i >= 0 && grow > 0; --i) {
				var sizer = sizers.at(i);
				var limit = sizer.maxSize - sizer.size;
				if (limit >= grow) {
					sizer.sizeHint = sizer.size + grow;
					grow = 0;
				}
				else {
					sizer.sizeHint = sizer.size + limit;
					grow -= limit;
				}
			}
			var shrink = delta;
			for (var i = index + 1, n = sizers.length; i < n && shrink > 0; ++i) {
				var sizer = sizers.at(i);
				var limit = sizer.size - sizer.minSize;
				if (limit >= shrink) {
					sizer.sizeHint = sizer.size - shrink;
					shrink = 0;
				}
				else {
					sizer.sizeHint = sizer.size - limit;
					shrink -= limit;
				}
			}
		}
		Private.growSizer = growSizer;
		function shrinkSizer(object, index, delta) {
			var sizers = sequence_1.asSequence(object);
			var growLimit = 0;
			for (var i = index + 1, n = sizers.length; i < n; ++i) {
				var sizer = sizers.at(i);
				growLimit += sizer.maxSize - sizer.size;
			}
			var shrinkLimit = 0;
			for (var i = 0; i <= index; ++i) {
				var sizer = sizers.at(i);
				shrinkLimit += sizer.size - sizer.minSize;
			}
			delta = Math.min(delta, growLimit, shrinkLimit);
			var grow = delta;
			for (var i = index + 1, n = sizers.length; i < n && grow > 0; ++i) {
				var sizer = sizers.at(i);
				var limit = sizer.maxSize - sizer.size;
				if (limit >= grow) {
					sizer.sizeHint = sizer.size + grow;
					grow = 0;
				}
				else {
					sizer.sizeHint = sizer.size + limit;
					grow -= limit;
				}
			}
			var shrink = delta;
			for (var i = index; i >= 0 && shrink > 0; --i) {
				var sizer = sizers.at(i);
				var limit = sizer.size - sizer.minSize;
				if (limit >= shrink) {
					sizer.sizeHint = sizer.size - shrink;
					shrink = 0;
				}
				else {
					sizer.sizeHint = sizer.size - limit;
					shrink -= limit;
				}
			}
		}
		Private.shrinkSizer = shrinkSizer;
	})(Private || (Private = {}));
},
function(module, exports, __webpack_require__) {
	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
		for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
		function __() { this.constructor = d; }
		d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var mutation_1 = __webpack_require__(29);
	var vector_1 = __webpack_require__(23);
	var messaging_1 = __webpack_require__(3);
	var properties_1 = __webpack_require__(8);
	var platform_1 = __webpack_require__(13);
	var sizing_1 = __webpack_require__(16);
	var boxengine_1 = __webpack_require__(27);
	var panel_1 = __webpack_require__(30);
	var widget_1 = __webpack_require__(25);
	var BOX_PANEL_CLASS = 'p-BoxPanel';
	var CHILD_CLASS = 'p-BoxPanel-child';
	var LEFT_TO_RIGHT_CLASS = 'p-mod-left-to-right';
	var RIGHT_TO_LEFT_CLASS = 'p-mod-right-to-left';
	var TOP_TO_BOTTOM_CLASS = 'p-mod-top-to-bottom';
	var BOTTOM_TO_TOP_CLASS = 'p-mod-bottom-to-top';
	var BoxPanel = (function (_super) {
		__extends(BoxPanel, _super);
		function BoxPanel(options) {
			if (options === void 0) { options = {}; }
			_super.call(this, { layout: Private.createLayout(options) });
			this.addClass(BOX_PANEL_CLASS);
		}
		Object.defineProperty(BoxPanel.prototype, "direction", {
			get: function () {
				return this.layout.direction;
			},
			set: function (value) {
				this.layout.direction = value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(BoxPanel.prototype, "spacing", {
			get: function () {
				return this.layout.spacing;
			},
			set: function (value) {
				this.layout.spacing = value;
			},
			enumerable: true,
			configurable: true
		});
		BoxPanel.prototype.onChildAdded = function (msg) {
			msg.child.addClass(CHILD_CLASS);
		};
		BoxPanel.prototype.onChildRemoved = function (msg) {
			msg.child.removeClass(CHILD_CLASS);
		};
		return BoxPanel;
	}(panel_1.Panel));
	exports.BoxPanel = BoxPanel;
	var BoxPanel;
	(function (BoxPanel) {
		function getStretch(widget) {
			return BoxLayout.getStretch(widget);
		}
		BoxPanel.getStretch = getStretch;
		function setStretch(widget, value) {
			BoxLayout.setStretch(widget, value);
		}
		BoxPanel.setStretch = setStretch;
		function getSizeBasis(widget) {
			return BoxLayout.getSizeBasis(widget);
		}
		BoxPanel.getSizeBasis = getSizeBasis;
		function setSizeBasis(widget, value) {
			BoxLayout.setSizeBasis(widget, value);
		}
		BoxPanel.setSizeBasis = setSizeBasis;
	})(BoxPanel = exports.BoxPanel || (exports.BoxPanel = {}));
	var BoxLayout = (function (_super) {
		__extends(BoxLayout, _super);
		function BoxLayout(options) {
			if (options === void 0) { options = {}; }
			_super.call(this);
			this._fixed = 0;
			this._spacing = 4;
			this._dirty = false;
			this._box = null;
			this._sizers = new vector_1.Vector();
			this._direction = 'top-to-bottom';
			if (options.direction !== void 0) {
				this._direction = options.direction;
			}
			if (options.spacing !== void 0) {
				this._spacing = Private.clampSpacing(options.spacing);
			}
		}
		Object.defineProperty(BoxLayout.prototype, "direction", {
			get: function () {
				return this._direction;
			},
			set: function (value) {
				if (this._direction === value) {
					return;
				}
				this._direction = value;
				if (!this.parent) {
					return;
				}
				Private.toggleDirection(this.parent, value);
				this.parent.fit();
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(BoxLayout.prototype, "spacing", {
			get: function () {
				return this._spacing;
			},
			set: function (value) {
				value = Private.clampSpacing(value);
				if (this._spacing === value) {
					return;
				}
				this._spacing = value;
				if (!this.parent) {
					return;
				}
				this.parent.fit();
			},
			enumerable: true,
			configurable: true
		});
		BoxLayout.prototype.init = function () {
			Private.toggleDirection(this.parent, this.direction);
			_super.prototype.init.call(this);
		};
		BoxLayout.prototype.attachWidget = function (index, widget) {
			this._sizers.insert(index, new boxengine_1.BoxSizer());
			widget_1.Widget.prepareGeometry(widget);
			this.parent.node.appendChild(widget.node);
			if (this.parent.isAttached)
				messaging_1.sendMessage(widget, widget_1.WidgetMessage.AfterAttach);
			this.parent.fit();
		};
		BoxLayout.prototype.moveWidget = function (fromIndex, toIndex, widget) {
			mutation_1.move(this._sizers, fromIndex, toIndex);
			this.parent.update();
		};
		BoxLayout.prototype.detachWidget = function (index, widget) {
			this._sizers.removeAt(index);
			if (this.parent.isAttached)
				messaging_1.sendMessage(widget, widget_1.WidgetMessage.BeforeDetach);
			this.parent.node.removeChild(widget.node);
			widget_1.Widget.resetGeometry(widget);
			this.parent.fit();
		};
		BoxLayout.prototype.onAfterShow = function (msg) {
			_super.prototype.onAfterShow.call(this, msg);
			this.parent.update();
		};
		BoxLayout.prototype.onAfterAttach = function (msg) {
			_super.prototype.onAfterAttach.call(this, msg);
			this.parent.fit();
		};
		BoxLayout.prototype.onChildShown = function (msg) {
			if (platform_1.IS_IE || platform_1.IS_EDGE) {
				messaging_1.sendMessage(this.parent, widget_1.WidgetMessage.FitRequest);
			}
			else {
				this.parent.fit();
			}
		};
		BoxLayout.prototype.onChildHidden = function (msg) {
			if (platform_1.IS_IE || platform_1.IS_EDGE) {
				messaging_1.sendMessage(this.parent, widget_1.WidgetMessage.FitRequest);
			}
			else {
				this.parent.fit();
			}
		};
		BoxLayout.prototype.onResize = function (msg) {
			if (this.parent.isVisible) {
				this._update(msg.width, msg.height);
			}
		};
		BoxLayout.prototype.onUpdateRequest = function (msg) {
			if (this.parent.isVisible) {
				this._update(-1, -1);
			}
		};
		BoxLayout.prototype.onFitRequest = function (msg) {
			if (this.parent.isAttached) {
				this._fit();
			}
		};
		BoxLayout.prototype._fit = function () {
			var nVisible = 0;
			var widgets = this.widgets;
			for (var i = 0, n = widgets.length; i < n; ++i) {
				if (!widgets.at(i).isHidden)
					nVisible++;
			}
			this._fixed = this._spacing * Math.max(0, nVisible - 1);
			var minW = 0;
			var minH = 0;
			var maxW = Infinity;
			var maxH = Infinity;
			var horz = Private.isHorizontal(this._direction);
			if (horz) {
				minW = this._fixed;
				maxW = nVisible > 0 ? minW : maxW;
			}
			else {
				minH = this._fixed;
				maxH = nVisible > 0 ? minH : maxH;
			}
			for (var i = 0, n = widgets.length; i < n; ++i) {
				var widget = widgets.at(i);
				var sizer = this._sizers.at(i);
				if (widget.isHidden) {
					sizer.minSize = 0;
					sizer.maxSize = 0;
					continue;
				}
				var limits = sizing_1.sizeLimits(widget.node);
				sizer.sizeHint = BoxLayout.getSizeBasis(widget);
				sizer.stretch = BoxLayout.getStretch(widget);
				if (horz) {
					sizer.minSize = limits.minWidth;
					sizer.maxSize = limits.maxWidth;
					minW += limits.minWidth;
					maxW += limits.maxWidth;
					minH = Math.max(minH, limits.minHeight);
					maxH = Math.min(maxH, limits.maxHeight);
				}
				else {
					sizer.minSize = limits.minHeight;
					sizer.maxSize = limits.maxHeight;
					minH += limits.minHeight;
					maxH += limits.maxHeight;
					minW = Math.max(minW, limits.minWidth);
					maxW = Math.min(maxW, limits.maxWidth);
				}
			}
			var box = this._box = sizing_1.boxSizing(this.parent.node);
			minW += box.horizontalSum;
			minH += box.verticalSum;
			maxW += box.horizontalSum;
			maxH += box.verticalSum;
			var style = this.parent.node.style;
			style.minWidth = minW + "px";
			style.minHeight = minH + "px";
			style.maxWidth = maxW === Infinity ? 'none' : maxW + "px";
			style.maxHeight = maxH === Infinity ? 'none' : maxH + "px";
			this._dirty = true;
			var ancestor = this.parent.parent;
			if (ancestor)
				messaging_1.sendMessage(ancestor, widget_1.WidgetMessage.FitRequest);
			if (this._dirty)
				messaging_1.sendMessage(this.parent, widget_1.WidgetMessage.UpdateRequest);
		};
		BoxLayout.prototype._update = function (offsetWidth, offsetHeight) {
			this._dirty = false;
			var widgets = this.widgets;
			if (widgets.length === 0) {
				return;
			}
			if (offsetWidth < 0) {
				offsetWidth = this.parent.node.offsetWidth;
			}
			if (offsetHeight < 0) {
				offsetHeight = this.parent.node.offsetHeight;
			}
			var box = this._box || (this._box = sizing_1.boxSizing(this.parent.node));
			var top = box.paddingTop;
			var left = box.paddingLeft;
			var width = offsetWidth - box.horizontalSum;
			var height = offsetHeight - box.verticalSum;
			switch (this._direction) {
				case 'left-to-right':
					boxengine_1.boxCalc(this._sizers, Math.max(0, width - this._fixed));
					break;
				case 'top-to-bottom':
					boxengine_1.boxCalc(this._sizers, Math.max(0, height - this._fixed));
					break;
				case 'right-to-left':
					boxengine_1.boxCalc(this._sizers, Math.max(0, width - this._fixed));
					left += width;
					break;
				case 'bottom-to-top':
					boxengine_1.boxCalc(this._sizers, Math.max(0, height - this._fixed));
					top += height;
					break;
			}
			for (var i = 0, n = widgets.length; i < n; ++i) {
				var widget = widgets.at(i);
				if (widget.isHidden) {
					continue;
				}
				var size = this._sizers.at(i).size;
				switch (this._direction) {
					case 'left-to-right':
						widget_1.Widget.setGeometry(widget, left, top, size, height);
						left += size + this._spacing;
						break;
					case 'top-to-bottom':
						widget_1.Widget.setGeometry(widget, left, top, width, size);
						top += size + this._spacing;
						break;
					case 'right-to-left':
						widget_1.Widget.setGeometry(widget, left - size, top, size, height);
						left -= size + this._spacing;
						break;
					case 'bottom-to-top':
						widget_1.Widget.setGeometry(widget, left, top - size, width, size);
						top -= size + this._spacing;
						break;
				}
			}
		};
		return BoxLayout;
	}(panel_1.PanelLayout));
	exports.BoxLayout = BoxLayout;
	var BoxLayout;
	(function (BoxLayout) {
		function getStretch(widget) {
			return Private.stretchProperty.get(widget);
		}
		BoxLayout.getStretch = getStretch;
		function setStretch(widget, value) {
			Private.stretchProperty.set(widget, value);
		}
		BoxLayout.setStretch = setStretch;
		function getSizeBasis(widget) {
			return Private.sizeBasisProperty.get(widget);
		}
		BoxLayout.getSizeBasis = getSizeBasis;
		function setSizeBasis(widget, value) {
			Private.sizeBasisProperty.set(widget, value);
		}
		BoxLayout.setSizeBasis = setSizeBasis;
	})(BoxLayout = exports.BoxLayout || (exports.BoxLayout = {}));
	var Private;
	(function (Private) {
		Private.stretchProperty = new properties_1.AttachedProperty({
			name: 'stretch',
			value: 0,
			coerce: function (owner, value) { return Math.max(0, Math.floor(value)); },
			changed: onChildPropertyChanged
		});
		Private.sizeBasisProperty = new properties_1.AttachedProperty({
			name: 'sizeBasis',
			value: 0,
			coerce: function (owner, value) { return Math.max(0, Math.floor(value)); },
			changed: onChildPropertyChanged
		});
		function createLayout(options) {
			return options.layout || new BoxLayout(options);
		}
		Private.createLayout = createLayout;
		function isHorizontal(dir) {
			return dir === 'left-to-right' || dir === 'right-to-left';
		}
		Private.isHorizontal = isHorizontal;
		function toggleDirection(widget, dir) {
			widget.toggleClass(LEFT_TO_RIGHT_CLASS, dir === 'left-to-right');
			widget.toggleClass(RIGHT_TO_LEFT_CLASS, dir === 'right-to-left');
			widget.toggleClass(TOP_TO_BOTTOM_CLASS, dir === 'top-to-bottom');
			widget.toggleClass(BOTTOM_TO_TOP_CLASS, dir === 'bottom-to-top');
		}
		Private.toggleDirection = toggleDirection;
		function clampSpacing(value) {
			return Math.max(0, Math.floor(value));
		}
		Private.clampSpacing = clampSpacing;
		function onChildPropertyChanged(child) {
			var parent = child.parent;
			var layout = parent && parent.layout;
			if (layout instanceof BoxLayout)
				parent.fit();
		}
	})(Private || (Private = {}));
},
function(module, exports, __webpack_require__) {
	"use strict";
	var sequence_1 = __webpack_require__(22);
	function move(object, fromIndex, toIndex) {
		if (object.length <= 1 || fromIndex === toIndex) {
			return;
		}
		var d = fromIndex < toIndex ? 1 : -1;
		var seq = sequence_1.asMutableSequence(object);
		var value = seq.at(fromIndex);
		for (var i = fromIndex; i !== toIndex; i += d) {
			seq.set(i, seq.at(i + d));
		}
		seq.set(toIndex, value);
	}
	exports.move = move;
	function reverse(object, first, last) {
		var length = object.length;
		if (length <= 1) {
			return;
		}
		if (first === void 0) {
			first = 0;
		}
		if (last === void 0) {
			last = length - 1;
		}
		if (first >= last) {
			return;
		}
		var seq = sequence_1.asMutableSequence(object);
		while (first < last) {
			var front = seq.at(first);
			var back = seq.at(last);
			seq.set(first++, back);
			seq.set(last--, front);
		}
	}
	exports.reverse = reverse;
	function rotate(object, delta) {
		var length = object.length;
		if (length <= 1) {
			return;
		}
		if (delta > 0) {
			delta = delta % length;
		}
		else if (delta < 0) {
			delta = ((delta % length) + length) % length;
		}
		if (delta === 0) {
			return;
		}
		var seq = sequence_1.asMutableSequence(object);
		reverse(seq, 0, delta - 1);
		reverse(seq, delta, length - 1);
		reverse(seq, 0, length - 1);
	}
	exports.rotate = rotate;
},
function(module, exports, __webpack_require__) {
	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
		for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
		function __() { this.constructor = d; }
		d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var iteration_1 = __webpack_require__(2);
	var mutation_1 = __webpack_require__(29);
	var searching_1 = __webpack_require__(21);
	var vector_1 = __webpack_require__(23);
	var messaging_1 = __webpack_require__(3);
	var widget_1 = __webpack_require__(25);
	var PANEL_CLASS = 'p-Panel';
	var Panel = (function (_super) {
		__extends(Panel, _super);
		function Panel(options) {
			if (options === void 0) { options = {}; }
			_super.call(this);
			this.addClass(PANEL_CLASS);
			this.layout = Private.createLayout(options);
		}
		Object.defineProperty(Panel.prototype, "widgets", {
			get: function () {
				return this.layout.widgets;
			},
			enumerable: true,
			configurable: true
		});
		Panel.prototype.addWidget = function (widget) {
			this.layout.addWidget(widget);
		};
		Panel.prototype.insertWidget = function (index, widget) {
			this.layout.insertWidget(index, widget);
		};
		return Panel;
	}(widget_1.Widget));
	exports.Panel = Panel;
	var PanelLayout = (function (_super) {
		__extends(PanelLayout, _super);
		function PanelLayout() {
			_super.apply(this, arguments);
			this._widgets = new vector_1.Vector();
		}
		PanelLayout.prototype.dispose = function () {
			while (this._widgets.length > 0) {
				this._widgets.popBack().dispose();
			}
			_super.prototype.dispose.call(this);
		};
		Object.defineProperty(PanelLayout.prototype, "widgets", {
			get: function () {
				return this._widgets;
			},
			enumerable: true,
			configurable: true
		});
		PanelLayout.prototype.iter = function () {
			return this._widgets.iter();
		};
		PanelLayout.prototype.addWidget = function (widget) {
			this.insertWidget(this._widgets.length, widget);
		};
		PanelLayout.prototype.insertWidget = function (index, widget) {
			widget.parent = this.parent;
			var i = searching_1.indexOf(this._widgets, widget);
			var j = Math.max(0, Math.min(Math.floor(index), this._widgets.length));
			if (i === -1) {
				this._widgets.insert(j, widget);
				if (this.parent)
					this.attachWidget(j, widget);
				return;
			}
			if (j === this._widgets.length)
				j--;
			if (i === j)
				return;
			mutation_1.move(this._widgets, i, j);
			if (this.parent)
				this.moveWidget(i, j, widget);
		};
		PanelLayout.prototype.removeWidget = function (widget) {
			this.removeWidgetAt(searching_1.indexOf(this._widgets, widget));
		};
		PanelLayout.prototype.removeWidgetAt = function (index) {
			var i = Math.floor(index);
			if (i < 0 || i >= this._widgets.length) {
				return;
			}
			var widget = this._widgets.removeAt(i);
			if (this.parent)
				this.detachWidget(i, widget);
		};
		PanelLayout.prototype.init = function () {
			var _this = this;
			_super.prototype.init.call(this);
			var index = 0;
			iteration_1.each(this, function (widget) { _this.attachWidget(index++, widget); });
		};
		PanelLayout.prototype.attachWidget = function (index, widget) {
			var ref = this.parent.node.children[index];
			this.parent.node.insertBefore(widget.node, ref);
			if (this.parent.isAttached)
				messaging_1.sendMessage(widget, widget_1.WidgetMessage.AfterAttach);
		};
		PanelLayout.prototype.moveWidget = function (fromIndex, toIndex, widget) {
			if (this.parent.isAttached)
				messaging_1.sendMessage(widget, widget_1.WidgetMessage.BeforeDetach);
			this.parent.node.removeChild(widget.node);
			var ref = this.parent.node.children[toIndex];
			this.parent.node.insertBefore(widget.node, ref);
			if (this.parent.isAttached)
				messaging_1.sendMessage(widget, widget_1.WidgetMessage.AfterAttach);
		};
		PanelLayout.prototype.detachWidget = function (index, widget) {
			if (this.parent.isAttached)
				messaging_1.sendMessage(widget, widget_1.WidgetMessage.BeforeDetach);
			this.parent.node.removeChild(widget.node);
		};
		return PanelLayout;
	}(widget_1.Layout));
	exports.PanelLayout = PanelLayout;
	var Private;
	(function (Private) {
		function createLayout(options) {
			return options.layout || new PanelLayout();
		}
		Private.createLayout = createLayout;
	})(Private || (Private = {}));
},
function(module, exports, __webpack_require__) {
	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
		for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
		function __() { this.constructor = d; }
		d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var searching_1 = __webpack_require__(21);
	var vector_1 = __webpack_require__(23);
	var query_1 = __webpack_require__(14);
	var keymap_1 = __webpack_require__(19);
	var widget_1 = __webpack_require__(25);
	var PALETTE_CLASS = 'p-CommandPalette';
	var SEARCH_CLASS = 'p-CommandPalette-search';
	var WRAPPER_CLASS = 'p-CommandPalette-wrapper';
	var INPUT_CLASS = 'p-CommandPalette-input';
	var CONTENT_CLASS = 'p-CommandPalette-content';
	var HEADER_CLASS = 'p-CommandPalette-header';
	var ITEM_CLASS = 'p-CommandPalette-item';
	var LABEL_CLASS = 'p-CommandPalette-itemLabel';
	var SHORTCUT_CLASS = 'p-CommandPalette-itemShortcut';
	var CAPTION_CLASS = 'p-CommandPalette-itemCaption';
	var ACTIVE_CLASS = 'p-mod-active';
	var DISABLED_CLASS = 'p-mod-disabled';
	var TOGGLED_CLASS = 'p-mod-toggled';
	var CommandPalette = (function (_super) {
		__extends(CommandPalette, _super);
		function CommandPalette(options) {
			_super.call(this, { node: Private.createNode() });
			this._activeIndex = 1;
			this._itemNodes = new vector_1.Vector();
			this._headerNodes = new vector_1.Vector();
			this._items = new vector_1.Vector();
			this._result = null;
			this.addClass(PALETTE_CLASS);
			this.setFlag(widget_1.WidgetFlag.DisallowLayout);
			this._keymap = options.keymap;
			this._commands = options.commands;
			this._renderer = options.renderer || CommandPalette.defaultRenderer;
			this._commands.commandChanged.connect(this._onGenericChange, this);
			this._keymap.bindingChanged.connect(this._onGenericChange, this);
		}
		CommandPalette.prototype.dispose = function () {
			this._items.clear();
			this._itemNodes.clear();
			this._headerNodes.clear();
			this._result = null;
			this._keymap = null;
			this._commands = null;
			this._renderer = null;
			_super.prototype.dispose.call(this);
		};
		Object.defineProperty(CommandPalette.prototype, "searchNode", {
			get: function () {
				return this.node.getElementsByClassName(SEARCH_CLASS)[0];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(CommandPalette.prototype, "inputNode", {
			get: function () {
				return this.node.getElementsByClassName(INPUT_CLASS)[0];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(CommandPalette.prototype, "contentNode", {
			get: function () {
				return this.node.getElementsByClassName(CONTENT_CLASS)[0];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(CommandPalette.prototype, "items", {
			get: function () {
				return this._items;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(CommandPalette.prototype, "commands", {
			get: function () {
				return this._commands;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(CommandPalette.prototype, "keymap", {
			get: function () {
				return this._keymap;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(CommandPalette.prototype, "renderer", {
			get: function () {
				return this._renderer;
			},
			enumerable: true,
			configurable: true
		});
		CommandPalette.prototype.addItem = function (options) {
			var item = Private.createItem(this._commands, this._keymap, options);
			this._items.pushBack(item);
			if (this.isAttached)
				this.update();
			return item;
		};
		CommandPalette.prototype.removeItem = function (item) {
			var index = searching_1.indexOf(this._items, item);
			if (index !== -1)
				this.removeItemAt(index);
			return index;
		};
		CommandPalette.prototype.removeItemAt = function (index) {
			var i = Math.floor(index);
			if (i < 0 || i >= this._items.length) {
				return null;
			}
			var item = this._items.removeAt(index);
			if (this.isAttached)
				this.update();
			return item;
		};
		CommandPalette.prototype.clearItems = function () {
			this._items.clear();
			if (this.isAttached)
				this.update();
		};
		CommandPalette.prototype.handleEvent = function (event) {
			switch (event.type) {
				case 'click':
					this._evtClick(event);
					break;
				case 'keydown':
					this._evtKeyDown(event);
					break;
				case 'input':
					this.update();
					break;
			}
		};
		CommandPalette.prototype.onAfterAttach = function (msg) {
			this.node.addEventListener('click', this);
			this.node.addEventListener('keydown', this);
			this.node.addEventListener('input', this);
			this.update();
		};
		CommandPalette.prototype.onBeforeDetach = function (msg) {
			this.node.removeEventListener('click', this);
			this.node.removeEventListener('keydown', this);
			this.node.removeEventListener('input', this);
		};
		CommandPalette.prototype.onActivateRequest = function (msg) {
			if (this.isAttached) {
				var input = this.inputNode;
				input.focus();
				input.select();
			}
		};
		CommandPalette.prototype.onUpdateRequest = function (msg) {
			var _this = this;
			this.contentNode.textContent = '';
			this._activeIndex = -1;
			this._result = null;
			if (this._items.isEmpty) {
				return;
			}
			var _a = CommandPalette.splitQuery(this.inputNode.value), category = _a.category, text = _a.text;
			var result = this._result = Private.search(this._items, category, text);
			if (result.parts.length === 0) {
				return;
			}
			var renderer = this._renderer;
			var itemNodes = this._itemNodes;
			var headerNodes = this._headerNodes;
			while (headerNodes.length < result.headerCount) {
				headerNodes.pushBack(renderer.createHeaderNode());
			}
			while (itemNodes.length < result.itemCount) {
				itemNodes.pushBack(renderer.createItemNode());
			}
			var itemIndex = 0;
			var headerIndex = 0;
			var fragment = document.createDocumentFragment();
			for (var _i = 0, _b = result.parts; _i < _b.length; _i++) {
				var part = _b[_i];
				var node = void 0;
				if (part.item === null) {
					node = headerNodes.at(headerIndex++);
					renderer.updateHeaderNode(node, part.markup);
				}
				else {
					node = itemNodes.at(itemIndex++);
					renderer.updateItemNode(node, part.item, part.markup);
				}
				fragment.appendChild(node);
			}
			this.contentNode.appendChild(fragment);
			if (category || text) {
				this._activateNext('item');
			}
			else {
				requestAnimationFrame(function () { _this.contentNode.scrollTop = 0; });
			}
		};
		CommandPalette.prototype._evtClick = function (event) {
			if (event.button !== 0) {
				return;
			}
			var target = event.target;
			var children = this.contentNode.children;
			var i = searching_1.findIndex(children, function (child) { return child.contains(target); });
			if (i === -1) {
				return;
			}
			event.preventDefault();
			event.stopPropagation();
			if (!this._result) {
				return;
			}
			var part = this._result.parts[i];
			if (!part) {
				return;
			}
			if (part.item && !part.item.isEnabled) {
				return;
			}
			this._activate(i);
			this._triggerActive();
		};
		CommandPalette.prototype._evtKeyDown = function (event) {
			if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
				return;
			}
			switch (event.keyCode) {
				case 13:
					event.preventDefault();
					event.stopPropagation();
					this._triggerActive();
					break;
				case 38:
					event.preventDefault();
					event.stopPropagation();
					this._activatePrev('any');
					break;
				case 40:
					event.preventDefault();
					event.stopPropagation();
					this._activateNext('any');
					break;
			}
		};
		CommandPalette.prototype._activate = function (index) {
			var content = this.contentNode;
			var children = content.children;
			if (index < 0 || index >= children.length) {
				index = -1;
			}
			if (this._activeIndex === index) {
				return;
			}
			var oldNode = children[this._activeIndex];
			var newNode = children[index];
			this._activeIndex = index;
			if (oldNode) {
				oldNode.classList.remove(ACTIVE_CLASS);
			}
			if (newNode) {
				newNode.classList.add(ACTIVE_CLASS);
				requestAnimationFrame(function () {
					query_1.scrollIntoViewIfNeeded(content, newNode);
				});
			}
		};
		CommandPalette.prototype._activateNext = function (kind) {
			if (!this._result) {
				return;
			}
			var parts = this._result.parts;
			if (parts.length === 0) {
				return;
			}
			var start = this._activeIndex + 1;
			for (var i = 0, n = parts.length; i < n; ++i) {
				var k = (start + i) % n;
				var item = parts[k].item;
				if (kind === 'item' && item && item.isEnabled) {
					this._activate(k);
					return;
				}
				if (kind === 'header' && !item) {
					this._activate(k);
					return;
				}
				if (kind === 'any' && (!item || item.isEnabled)) {
					this._activate(k);
					return;
				}
			}
			this._activate(-1);
		};
		CommandPalette.prototype._activatePrev = function (kind) {
			if (!this._result) {
				return;
			}
			var parts = this._result.parts;
			if (parts.length === 0) {
				return;
			}
			var ai = this._activeIndex;
			var start = ai <= 0 ? parts.length - 1 : ai - 1;
			for (var i = 0, n = parts.length; i < n; ++i) {
				var k = (start - i + n) % n;
				var item = parts[k].item;
				if (kind === 'item' && item && item.isEnabled) {
					this._activate(k);
					return;
				}
				if (kind === 'header' && !item) {
					this._activate(k);
					return;
				}
				if (kind === 'any' && (!item || item.isEnabled)) {
					this._activate(k);
					return;
				}
			}
			this._activate(-1);
		};
		CommandPalette.prototype._triggerActive = function () {
			if (!this._result) {
				return;
			}
			var part = this._result.parts[this._activeIndex];
			if (!part) {
				return;
			}
			if (part.item && !part.item.isEnabled) {
				return;
			}
			var input = this.inputNode;
			if (part.item) {
				input.focus();
				input.select();
				this._commands.execute(part.item.command, part.item.args);
				return;
			}
			var _a = CommandPalette.splitQuery(input.value), category = _a.category, text = _a.text;
			var desired = part.markup.replace(/<mark>|<\/mark>/g, '');
			var computed = desired === category ? '' : desired;
			var query = CommandPalette.joinQuery(computed, text);
			input.value = query;
			input.focus();
			this.update();
		};
		CommandPalette.prototype._onGenericChange = function () {
			if (this.isAttached)
				this.update();
		};
		return CommandPalette;
	}(widget_1.Widget));
	exports.CommandPalette = CommandPalette;
	var CommandPalette;
	(function (CommandPalette) {
		var Renderer = (function () {
			function Renderer() {
			}
			Renderer.prototype.createHeaderNode = function () {
				var node = document.createElement('li');
				node.className = HEADER_CLASS;
				return node;
			};
			Renderer.prototype.createItemNode = function () {
				var node = document.createElement('li');
				var label = document.createElement('div');
				var caption = document.createElement('div');
				var shortcut = document.createElement('div');
				node.className = ITEM_CLASS;
				label.className = LABEL_CLASS;
				caption.className = CAPTION_CLASS;
				shortcut.className = SHORTCUT_CLASS;
				node.appendChild(shortcut);
				node.appendChild(label);
				node.appendChild(caption);
				return node;
			};
			Renderer.prototype.updateHeaderNode = function (node, markup) {
				node.className = HEADER_CLASS;
				node.innerHTML = markup;
			};
			Renderer.prototype.updateItemNode = function (node, item, markup) {
				var itemClass = ITEM_CLASS;
				if (!item.isEnabled) {
					itemClass += " " + DISABLED_CLASS;
				}
				if (item.isToggled) {
					itemClass += " " + TOGGLED_CLASS;
				}
				var extraItemClass = item.className;
				if (extraItemClass) {
					itemClass += " " + extraItemClass;
				}
				var shortcutText = this.formatShortcut(item.keyBinding);
				var shortcut = node.firstChild;
				var label = shortcut.nextSibling;
				var caption = label.nextSibling;
				node.dataset['command'] = item.command;
				node.className = itemClass;
				label.innerHTML = markup;
				caption.textContent = item.caption;
				shortcut.textContent = shortcutText;
			};
			Renderer.prototype.formatShortcut = function (binding) {
				return binding ? binding.keys.map(keymap_1.Keymap.formatKeystroke).join(' ') : '';
			};
			return Renderer;
		}());
		CommandPalette.Renderer = Renderer;
		CommandPalette.defaultRenderer = new Renderer();
		function splitQuery(query) {
			query = query.trim();
			var i = query.indexOf(':');
			if (i === -1) {
				return { category: '', text: query };
			}
			var category = query.slice(0, i).trim();
			var text = query.slice(i + 1).trim();
			return { category: category, text: text };
		}
		CommandPalette.splitQuery = splitQuery;
		function joinQuery(category, text) {
			var query;
			if (category && text) {
				query = category.trim() + ": " + text.trim();
			}
			else if (category) {
				query = category.trim() + ": ";
			}
			else if (text) {
				query = text.trim();
			}
			else {
				query = '';
			}
			return query;
		}
		CommandPalette.joinQuery = joinQuery;
	})(CommandPalette = exports.CommandPalette || (exports.CommandPalette = {}));
	var Private;
	(function (Private) {
		function createNode() {
			var node = document.createElement('div');
			var search = document.createElement('div');
			var wrapper = document.createElement('div');
			var input = document.createElement('input');
			var content = document.createElement('ul');
			search.className = SEARCH_CLASS;
			wrapper.className = WRAPPER_CLASS;
			input.className = INPUT_CLASS;
			content.className = CONTENT_CLASS;
			input.spellcheck = false;
			wrapper.appendChild(input);
			search.appendChild(wrapper);
			node.appendChild(search);
			node.appendChild(content);
			return node;
		}
		Private.createNode = createNode;
		function createItem(commands, keymap, options) {
			return new CommandItem(commands, keymap, options);
		}
		Private.createItem = createItem;
		function search(items, category, text) {
			var catmap = matchCategory(items, category);
			var scores = matchLabel(items, text, catmap);
			scores.sort(scoreCmp);
			var groups = groupScores(scores);
			return createSearchResult(groups, catmap);
		}
		Private.search = search;
		var CommandItem = (function () {
			function CommandItem(commands, keymap, options) {
				this._commands = commands;
				this._keymap = keymap;
				this._command = options.command;
				this._args = options.args || null;
				this._category = normalizeCategory(options.category || 'general');
			}
			Object.defineProperty(CommandItem.prototype, "command", {
				get: function () {
					return this._command;
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(CommandItem.prototype, "args", {
				get: function () {
					return this._args;
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(CommandItem.prototype, "category", {
				get: function () {
					return this._category;
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(CommandItem.prototype, "label", {
				get: function () {
					return this._commands.label(this._command, this._args);
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(CommandItem.prototype, "caption", {
				get: function () {
					return this._commands.caption(this._command, this._args);
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(CommandItem.prototype, "className", {
				get: function () {
					return this._commands.className(this._command, this._args);
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(CommandItem.prototype, "isEnabled", {
				get: function () {
					return this._commands.isEnabled(this._command, this._args);
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(CommandItem.prototype, "isToggled", {
				get: function () {
					return this._commands.isToggled(this._command, this._args);
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(CommandItem.prototype, "isVisible", {
				get: function () {
					return this._commands.isVisible(this._command, this._args);
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(CommandItem.prototype, "keyBinding", {
				get: function () {
					return this._keymap.findBinding(this._command, this._args);
				},
				enumerable: true,
				configurable: true
			});
			return CommandItem;
		}());
		function normalizeCategory(category) {
			return category.trim().replace(/\s+/g, ' ').toLowerCase();
		}
		function normalizeQueryText(text) {
			return text.replace(/\s+/g, '').toLowerCase();
		}
		function matchCategory(items, query) {
			query = normalizeQueryText(query);
			var seen = Object.create(null);
			var matched = Object.create(null);
			for (var i = 0, n = items.length; i < n; ++i) {
				var item = items.at(i);
				if (!item.isVisible) {
					continue;
				}
				var category = item.category;
				if (category in seen) {
					continue;
				}
				seen[category] = true;
				if (!query) {
					matched[category] = { score: 0, indices: null };
					continue;
				}
				var match = searching_1.StringSearch.sumOfSquares(category, query);
				if (!match) {
					continue;
				}
				matched[category] = match;
			}
			return matched;
		}
		function matchLabel(items, query, categories) {
			query = normalizeQueryText(query);
			var scores = [];
			for (var i = 0, n = items.length; i < n; ++i) {
				var item = items.at(i);
				if (!item.isVisible) {
					continue;
				}
				var cs = categories[item.category];
				if (!cs) {
					continue;
				}
				if (!query) {
					scores.push({ score: cs.score, indices: null, item: item });
					continue;
				}
				var match = searching_1.StringSearch.sumOfSquares(item.label.toLowerCase(), query);
				if (!match) {
					continue;
				}
				var score = cs.score + match.score;
				scores.push({ score: score, indices: match.indices, item: item });
			}
			return scores;
		}
		function scoreCmp(a, b) {
			var d1 = a.score - b.score;
			if (d1 !== 0) {
				return d1;
			}
			var d2 = a.item.category.localeCompare(b.item.category);
			if (d2 !== 0) {
				return d2;
			}
			return a.item.label.localeCompare(b.item.label);
		}
		function groupScores(scores) {
			var result = Object.create(null);
			for (var _i = 0, scores_1 = scores; _i < scores_1.length; _i++) {
				var score = scores_1[_i];
				var cat = score.item.category;
				(result[cat] || (result[cat] = [])).push(score);
			}
			return result;
		}
		function createSearchResult(groups, categories) {
			var itemCount = 0;
			var headerCount = 0;
			var parts = [];
			for (var cat in groups) {
				headerCount++;
				parts.push(createHeaderPart(cat, categories[cat]));
				for (var _i = 0, _a = groups[cat]; _i < _a.length; _i++) {
					var score = _a[_i];
					itemCount++;
					parts.push(createItemPart(score));
				}
			}
			return { itemCount: itemCount, headerCount: headerCount, parts: parts };
		}
		function createHeaderPart(category, score) {
			var markup = highlightText(category, score.indices);
			return { markup: markup, item: null };
		}
		function createItemPart(score) {
			var markup = highlightText(score.item.label, score.indices);
			return { markup: markup, item: score.item };
		}
		function highlightText(text, indices) {
			return indices ? searching_1.StringSearch.highlight(text, indices) : text;
		}
	})(Private || (Private = {}));
},
function(module, exports, __webpack_require__) {
	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
		for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
		function __() { this.constructor = d; }
		d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var iteration_1 = __webpack_require__(2);
	var searching_1 = __webpack_require__(21);
	var vector_1 = __webpack_require__(23);
	var messaging_1 = __webpack_require__(3);
	var signaling_1 = __webpack_require__(9);
	var mimedata_1 = __webpack_require__(7);
	var cursor_1 = __webpack_require__(11);
	var dragdrop_1 = __webpack_require__(12);
	var platform_1 = __webpack_require__(13);
	var query_1 = __webpack_require__(14);
	var sizing_1 = __webpack_require__(16);
	var boxengine_1 = __webpack_require__(27);
	var focustracker_1 = __webpack_require__(33);
	var tabbar_1 = __webpack_require__(34);
	var widget_1 = __webpack_require__(25);
	var DOCK_PANEL_CLASS = 'p-DockPanel';
	var WIDGET_CLASS = 'p-DockPanel-widget';
	var TAB_BAR_CLASS = 'p-DockPanel-tabBar';
	var HANDLE_CLASS = 'p-DockPanel-handle';
	var OVERLAY_CLASS = 'p-DockPanel-overlay';
	var HIDDEN_CLASS = 'p-mod-hidden';
	var HORIZONTAL_CLASS = 'p-mod-horizontal';
	var VERTICAL_CLASS = 'p-mod-vertical';
	var FACTORY_MIME = 'application/vnd.phosphor.widget-factory';
	var GOLDEN = 0.618;
	var DockPanel = (function (_super) {
		__extends(DockPanel, _super);
		function DockPanel(options) {
			var _this = this;
			if (options === void 0) { options = {}; }
			_super.call(this);
			this._drag = null;
			this._pressData = null;
			this._tracker = new focustracker_1.FocusTracker();
			this.addClass(DOCK_PANEL_CLASS);
			var spacing = options.spacing !== void 0 ? options.spacing : 4;
			this._renderer = options.renderer || DockPanel.defaultRenderer;
			var renderer = {
				createTabBar: function () { return _this._createTabBar(); },
				createHandle: function () { return _this._createHandle(); }
			};
			this.layout = new DockLayout({ renderer: renderer, spacing: spacing });
			this._overlay = options.overlay || new DockPanel.Overlay();
			this._overlay.node.classList.add(OVERLAY_CLASS);
			this.node.appendChild(this._overlay.node);
			this._tracker.currentChanged.connect(this._onCurrentChanged, this);
		}
		DockPanel.prototype.dispose = function () {
			this._releaseMouse();
			this._overlay.hide(0);
			if (this._drag) {
				this._drag.dispose();
			}
			this._tracker.dispose();
			_super.prototype.dispose.call(this);
		};
		Object.defineProperty(DockPanel.prototype, "currentWidget", {
			get: function () {
				return this._tracker.currentWidget;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(DockPanel.prototype, "overlay", {
			get: function () {
				return this._overlay;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(DockPanel.prototype, "spacing", {
			get: function () {
				return this.layout.spacing;
			},
			set: function (value) {
				this.layout.spacing = value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(DockPanel.prototype, "isEmpty", {
			get: function () {
				return this.layout.isEmpty;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(DockPanel.prototype, "renderer", {
			get: function () {
				return this.layout.renderer;
			},
			enumerable: true,
			configurable: true
		});
		DockPanel.prototype.widgets = function () {
			return this.layout.widgets();
		};
		DockPanel.prototype.tabBars = function () {
			return this.layout.tabBars();
		};
		DockPanel.prototype.handles = function () {
			return this.layout.handles();
		};
		DockPanel.prototype.activateWidget = function (widget) {
			var title = widget.title;
			var tabBar = searching_1.find(this.tabBars(), function (bar) { return searching_1.contains(bar.titles, title); });
			if (!tabBar) {
				throw new Error('Widget is not contained in the dock panel.');
			}
			tabBar.currentTitle = title;
			widget.activate();
		};
		DockPanel.prototype.addWidget = function (widget, options) {
			if (options === void 0) { options = {}; }
			this.layout.addWidget(widget, options);
			this._tracker.add(widget);
		};
		DockPanel.prototype.handleEvent = function (event) {
			switch (event.type) {
				case 'p-dragenter':
					this._evtDragEnter(event);
					break;
				case 'p-dragleave':
					this._evtDragLeave(event);
					break;
				case 'p-dragover':
					this._evtDragOver(event);
					break;
				case 'p-drop':
					this._evtDrop(event);
					break;
				case 'mousedown':
					this._evtMouseDown(event);
					break;
				case 'mousemove':
					this._evtMouseMove(event);
					break;
				case 'mouseup':
					this._evtMouseUp(event);
					break;
				case 'keydown':
					this._evtKeyDown(event);
					break;
				case 'contextmenu':
					event.preventDefault();
					event.stopPropagation();
					break;
			}
		};
		DockPanel.prototype.onAfterAttach = function (msg) {
			this.node.addEventListener('p-dragenter', this);
			this.node.addEventListener('p-dragleave', this);
			this.node.addEventListener('p-dragover', this);
			this.node.addEventListener('p-drop', this);
			this.node.addEventListener('mousedown', this);
		};
		DockPanel.prototype.onBeforeDetach = function (msg) {
			this.node.removeEventListener('p-dragenter', this);
			this.node.removeEventListener('p-dragleave', this);
			this.node.removeEventListener('p-dragover', this);
			this.node.removeEventListener('p-drop', this);
			this.node.removeEventListener('mousedown', this);
			this._releaseMouse();
		};
		DockPanel.prototype.onChildAdded = function (msg) {
			if (msg.child.hasClass(TAB_BAR_CLASS)) {
				return;
			}
			msg.child.addClass(WIDGET_CLASS);
		};
		DockPanel.prototype.onChildRemoved = function (msg) {
			if (msg.child.hasClass(TAB_BAR_CLASS)) {
				return;
			}
			msg.child.removeClass(WIDGET_CLASS);
			this._tracker.remove(msg.child);
		};
		DockPanel.prototype._evtDragEnter = function (event) {
			if (event.mimeData.hasData(FACTORY_MIME)) {
				event.preventDefault();
				event.stopPropagation();
			}
		};
		DockPanel.prototype._evtDragLeave = function (event) {
			event.preventDefault();
			event.stopPropagation();
			var related = event.relatedTarget;
			if (!related || !this.node.contains(related)) {
				this._overlay.hide(0);
			}
		};
		DockPanel.prototype._evtDragOver = function (event) {
			event.preventDefault();
			event.stopPropagation();
			var clientX = event.clientX, clientY = event.clientY, shiftKey = event.shiftKey;
			if (this._showOverlay(clientX, clientY, shiftKey) === 'invalid') {
				event.dropAction = 'none';
			}
			else {
				event.dropAction = event.proposedAction;
			}
		};
		DockPanel.prototype._evtDrop = function (event) {
			event.preventDefault();
			event.stopPropagation();
			this._overlay.hide(0);
			if (event.proposedAction === 'none') {
				event.dropAction = 'none';
				return;
			}
			var clientX = event.clientX, clientY = event.clientY, shiftKey = event.shiftKey;
			var _a = this._findDropTarget(clientX, clientY, shiftKey), zone = _a.zone, target = _a.target;
			if (zone === 'invalid') {
				event.dropAction = 'none';
				return;
			}
			var factory = event.mimeData.getData(FACTORY_MIME);
			if (typeof factory !== 'function') {
				event.dropAction = 'none';
				return;
			}
			var widget = factory();
			if (!(widget instanceof widget_1.Widget)) {
				event.dropAction = 'none';
				return;
			}
			switch (zone) {
				case 'root':
					this.addWidget(widget);
					break;
				case 'root-top':
					this.addWidget(widget, { mode: 'split-top' });
					break;
				case 'root-left':
					this.addWidget(widget, { mode: 'split-left' });
					break;
				case 'root-right':
					this.addWidget(widget, { mode: 'split-right' });
					break;
				case 'root-bottom':
					this.addWidget(widget, { mode: 'split-bottom' });
					break;
				case 'widget-top':
					this.addWidget(widget, { mode: 'split-top', ref: target });
					break;
				case 'widget-left':
					this.addWidget(widget, { mode: 'split-left', ref: target });
					break;
				case 'widget-right':
					this.addWidget(widget, { mode: 'split-right', ref: target });
					break;
				case 'widget-bottom':
					this.addWidget(widget, { mode: 'split-bottom', ref: target });
					break;
				case 'tab-bar':
					var ref = Private.tabBarRef(target);
					this.addWidget(widget, { mode: 'tab-after', ref: ref });
					break;
			}
			event.dropAction = event.proposedAction;
			this.activateWidget(widget);
		};
		DockPanel.prototype._evtKeyDown = function (event) {
			event.preventDefault();
			event.stopPropagation();
			if (event.keyCode === 27) {
				this._releaseMouse();
			}
		};
		DockPanel.prototype._evtMouseDown = function (event) {
			if (event.button !== 0) {
				return;
			}
			var layout = this.layout;
			var target = event.target;
			var handle = searching_1.find(layout.handles(), function (handle) { return handle.contains(target); });
			if (!handle) {
				return;
			}
			event.preventDefault();
			event.stopPropagation();
			document.addEventListener('keydown', this, true);
			document.addEventListener('mouseup', this, true);
			document.addEventListener('mousemove', this, true);
			document.addEventListener('contextmenu', this, true);
			var rect = handle.getBoundingClientRect();
			var deltaX = event.clientX - rect.left;
			var deltaY = event.clientY - rect.top;
			var style = window.getComputedStyle(handle);
			var override = cursor_1.overrideCursor(style.cursor);
			this._pressData = { handle: handle, deltaX: deltaX, deltaY: deltaY, override: override };
		};
		DockPanel.prototype._evtMouseMove = function (event) {
			event.preventDefault();
			event.stopPropagation();
			var rect = this.node.getBoundingClientRect();
			var xPos = event.clientX - rect.left - this._pressData.deltaX;
			var yPos = event.clientY - rect.top - this._pressData.deltaY;
			var layout = this.layout;
			layout.moveHandle(this._pressData.handle, xPos, yPos);
		};
		DockPanel.prototype._evtMouseUp = function (event) {
			if (event.button !== 0) {
				return;
			}
			event.preventDefault();
			event.stopPropagation();
			this._releaseMouse();
		};
		DockPanel.prototype._releaseMouse = function () {
			if (!this._pressData) {
				return;
			}
			this._pressData.override.dispose();
			this._pressData = null;
			document.removeEventListener('keydown', this, true);
			document.removeEventListener('mouseup', this, true);
			document.removeEventListener('mousemove', this, true);
			document.removeEventListener('contextmenu', this, true);
		};
		DockPanel.prototype._findDropTarget = function (clientX, clientY, shift) {
			if (!query_1.hitTest(this.node, clientX, clientY)) {
				return { zone: 'invalid', target: null };
			}
			var layout = this.layout;
			if (layout.isEmpty) {
				return { zone: 'root', target: null };
			}
			if (shift) {
				var edge_1 = Private.calcEdge(this.node, clientX, clientY);
				return { zone: ("root-" + edge_1), target: null };
			}
			var widget = searching_1.find(layout, function (widget) {
				return widget.isVisible && query_1.hitTest(widget.node, clientX, clientY);
			});
			if (!widget) {
				return { zone: 'invalid', target: null };
			}
			if (widget.hasClass(TAB_BAR_CLASS)) {
				return { zone: 'tab-bar', target: widget };
			}
			var edge = Private.calcEdge(widget.node, clientX, clientY);
			return { zone: ("widget-" + edge), target: widget };
		};
		DockPanel.prototype._showOverlay = function (clientX, clientY, shift) {
			var _a = this._findDropTarget(clientX, clientY, shift), zone = _a.zone, target = _a.target;
			if (zone === 'invalid') {
				this._overlay.hide(100);
				return zone;
			}
			var top;
			var left;
			var right;
			var bottom;
			var tr;
			var box = sizing_1.boxSizing(this.node);
			var rect = this.node.getBoundingClientRect();
			switch (zone) {
				case 'root':
					top = box.paddingTop;
					left = box.paddingLeft;
					right = box.paddingRight;
					bottom = box.paddingBottom;
					break;
				case 'root-top':
					top = box.paddingTop;
					left = box.paddingLeft;
					right = box.paddingRight;
					bottom = rect.height * GOLDEN;
					break;
				case 'root-left':
					top = box.paddingTop;
					left = box.paddingLeft;
					right = rect.width * GOLDEN;
					bottom = box.paddingBottom;
					break;
				case 'root-right':
					top = box.paddingTop;
					left = rect.width * GOLDEN;
					right = box.paddingRight;
					bottom = box.paddingBottom;
					break;
				case 'root-bottom':
					top = rect.height * GOLDEN;
					left = box.paddingLeft;
					right = box.paddingRight;
					bottom = box.paddingBottom;
					break;
				case 'tab-bar':
					tr = target.node.getBoundingClientRect();
					top = tr.top - rect.top - box.borderTop;
					left = tr.left - rect.left - box.borderLeft;
					right = rect.right - tr.right - box.borderRight;
					bottom = rect.bottom - tr.bottom - box.borderBottom;
					break;
				case 'widget-top':
					tr = target.node.getBoundingClientRect();
					top = tr.top - rect.top - box.borderTop;
					left = tr.left - rect.left - box.borderLeft;
					right = rect.right - tr.right - box.borderRight;
					bottom = rect.bottom - tr.bottom + tr.height / 2 - box.borderBottom;
					break;
				case 'widget-left':
					tr = target.node.getBoundingClientRect();
					top = tr.top - rect.top - box.borderTop;
					left = tr.left - rect.left - box.borderLeft;
					right = rect.right - tr.right + tr.width / 2 - box.borderRight;
					bottom = rect.bottom - tr.bottom - box.borderBottom;
					break;
				case 'widget-right':
					tr = target.node.getBoundingClientRect();
					top = tr.top - rect.top - box.borderTop;
					left = tr.left - rect.left + tr.width / 2 - box.borderLeft;
					right = rect.right - tr.right - box.borderRight;
					bottom = rect.bottom - tr.bottom - box.borderBottom;
					break;
				case 'widget-bottom':
					tr = target.node.getBoundingClientRect();
					top = tr.top - rect.top + tr.height / 2 - box.borderTop;
					left = tr.left - rect.left - box.borderLeft;
					right = rect.right - tr.right - box.borderRight;
					bottom = rect.bottom - tr.bottom - box.borderBottom;
					break;
			}
			var width = rect.width - right - left - box.borderLeft - box.borderRight;
			var height = rect.height - bottom - top - box.borderTop - box.borderBottom;
			this._overlay.show({
				mouseX: clientX,
				mouseY: clientY,
				parentRect: rect,
				top: top, left: left, right: right, bottom: bottom, width: width, height: height
			});
			return zone;
		};
		DockPanel.prototype._createTabBar = function () {
			var tabBar = this._renderer.createTabBar();
			tabBar.addClass(TAB_BAR_CLASS);
			tabBar.tabCloseRequested.connect(this._onTabCloseRequested, this);
			tabBar.tabDetachRequested.connect(this._onTabDetachRequested, this);
			tabBar.tabActivateRequested.connect(this._onTabActivateRequested, this);
			return tabBar;
		};
		DockPanel.prototype._createHandle = function () {
			var handle = this._renderer.createHandle();
			handle.classList.add(HANDLE_CLASS);
			return handle;
		};
		DockPanel.prototype._onTabActivateRequested = function (sender, args) {
			args.title.owner.activate();
		};
		DockPanel.prototype._onTabCloseRequested = function (sender, args) {
			args.title.owner.close();
		};
		DockPanel.prototype._onTabDetachRequested = function (sender, args) {
			var _this = this;
			if (this._drag) {
				return;
			}
			sender.releaseMouse();
			var index = args.index, title = args.title, tab = args.tab, clientX = args.clientX, clientY = args.clientY;
			var mimeData = new mimedata_1.MimeData();
			var widget = title.owner;
			mimeData.setData(FACTORY_MIME, function () { return widget; });
			var dragImage = tab.cloneNode(true);
			this._drag = new dragdrop_1.Drag({
				mimeData: mimeData, dragImage: dragImage,
				proposedAction: 'move',
				supportedActions: 'move',
			});
			tab.classList.add(HIDDEN_CLASS);
			var cleanup = (function () {
				_this._drag = null;
				tab.classList.remove(HIDDEN_CLASS);
			});
			this._drag.start(clientX, clientY).then(cleanup);
		};
		DockPanel.prototype._onCurrentChanged = function (sender, args) {
			this.currentChanged.emit(args);
		};
		return DockPanel;
	}(widget_1.Widget));
	exports.DockPanel = DockPanel;
	signaling_1.defineSignal(DockPanel.prototype, 'currentChanged');
	var DockPanel;
	(function (DockPanel) {
		var Overlay = (function () {
			function Overlay() {
				this._timer = -1;
				this._hidden = true;
				this._node = document.createElement('div');
				this._node.classList.add(HIDDEN_CLASS);
				this._node.style.position = 'absolute';
			}
			Object.defineProperty(Overlay.prototype, "node", {
				get: function () {
					return this._node;
				},
				enumerable: true,
				configurable: true
			});
			Overlay.prototype.show = function (geo) {
				var style = this._node.style;
				style.top = geo.top + "px";
				style.left = geo.left + "px";
				style.right = geo.right + "px";
				style.bottom = geo.bottom + "px";
				clearTimeout(this._timer);
				this._timer = -1;
				if (!this._hidden) {
					return;
				}
				this._hidden = false;
				this._node.classList.remove(HIDDEN_CLASS);
			};
			Overlay.prototype.hide = function (delay) {
				var _this = this;
				if (this._hidden) {
					return;
				}
				if (delay <= 0) {
					clearTimeout(this._timer);
					this._timer = -1;
					this._hidden = true;
					this._node.classList.add(HIDDEN_CLASS);
					return;
				}
				if (this._timer !== -1) {
					return;
				}
				this._timer = setTimeout(function () {
					_this._timer = -1;
					_this._hidden = true;
					_this._node.classList.add(HIDDEN_CLASS);
				}, delay);
			};
			return Overlay;
		}());
		DockPanel.Overlay = Overlay;
		var Renderer = (function () {
			function Renderer() {
			}
			Renderer.prototype.createTabBar = function () {
				return new tabbar_1.TabBar();
			};
			Renderer.prototype.createHandle = function () {
				return document.createElement('div');
			};
			return Renderer;
		}());
		DockPanel.Renderer = Renderer;
		DockPanel.defaultRenderer = new Renderer();
	})(DockPanel = exports.DockPanel || (exports.DockPanel = {}));
	var DockLayout = (function (_super) {
		__extends(DockLayout, _super);
		function DockLayout(options) {
			_super.call(this);
			this._dirty = false;
			this._box = null;
			this._root = null;
			this._renderer = options.renderer;
			this._spacing = Private.clampSpacing(options.spacing);
		}
		DockLayout.prototype.dispose = function () {
			this._renderer = null;
			var widgets = this.iter();
			this._root = null;
			iteration_1.each(widgets, function (widget) { widget.dispose(); });
			_super.prototype.dispose.call(this);
		};
		Object.defineProperty(DockLayout.prototype, "spacing", {
			get: function () {
				return this._spacing;
			},
			set: function (value) {
				value = Private.clampSpacing(value);
				if (this._spacing === value) {
					return;
				}
				this._spacing = value;
				if (!this.parent) {
					return;
				}
				this.parent.fit();
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(DockLayout.prototype, "isEmpty", {
			get: function () {
				return this._root === null;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(DockLayout.prototype, "renderer", {
			get: function () {
				return this._renderer;
			},
			enumerable: true,
			configurable: true
		});
		DockLayout.prototype.iter = function () {
			return this._root ? Private.iterAllWidgets(this._root) : iteration_1.empty();
		};
		DockLayout.prototype.widgets = function () {
			return this._root ? Private.iterUserWidgets(this._root) : iteration_1.empty();
		};
		DockLayout.prototype.tabBars = function () {
			return this._root ? Private.iterTabBars(this._root) : iteration_1.empty();
		};
		DockLayout.prototype.handles = function () {
			return this._root ? Private.iterHandles(this._root) : iteration_1.empty();
		};
		DockLayout.prototype.moveHandle = function (handle, offsetX, offsetY) {
			if (!this._root || handle.classList.contains(HIDDEN_CLASS)) {
				return;
			}
			var data = Private.findSplitNode(this._root, handle);
			if (!data) {
				return;
			}
			var delta;
			if (data.node.orientation === 'horizontal') {
				delta = offsetX - handle.offsetLeft;
			}
			else {
				delta = offsetY - handle.offsetTop;
			}
			if (delta === 0) {
				return;
			}
			Private.holdSizes(data.node.sizers);
			boxengine_1.adjustSizer(data.node.sizers, data.index, delta);
			if (this.parent) {
				this.parent.update();
			}
		};
		DockLayout.prototype.addWidget = function (widget, options) {
			if (options === void 0) { options = {}; }
			var ref = options.ref || null;
			var mode = options.mode || 'tab-after';
			var refNode = null;
			if (this._root && ref) {
				refNode = Private.findTabNode(this._root, ref);
			}
			if (ref && !refNode) {
				throw new Error('Reference widget is not in the layout.');
			}
			widget.parent = this.parent;
			switch (mode) {
				case 'tab-after':
					this._insertTab(widget, ref, refNode, true);
					break;
				case 'tab-before':
					this._insertTab(widget, ref, refNode, false);
					break;
				case 'split-top':
					this._insertSplit(widget, ref, refNode, 'vertical', false);
					break;
				case 'split-left':
					this._insertSplit(widget, ref, refNode, 'horizontal', false);
					break;
				case 'split-right':
					this._insertSplit(widget, ref, refNode, 'horizontal', true);
					break;
				case 'split-bottom':
					this._insertSplit(widget, ref, refNode, 'vertical', true);
					break;
			}
			if (!this.parent) {
				return;
			}
			this.attachWidget(widget);
			this.parent.fit();
		};
		DockLayout.prototype.removeWidget = function (widget) {
			this._removeWidget(widget);
			if (!this.parent) {
				return;
			}
			this.detachWidget(widget);
			this.parent.fit();
		};
		DockLayout.prototype.init = function () {
			var _this = this;
			_super.prototype.init.call(this);
			iteration_1.each(this, function (widget) { _this.attachWidget(widget); });
			iteration_1.each(this.handles(), function (handle) { _this.parent.node.appendChild(handle); });
			this.parent.fit();
		};
		DockLayout.prototype.attachWidget = function (widget) {
			if (this.parent.node === widget.node.parentNode) {
				return;
			}
			widget_1.Widget.prepareGeometry(widget);
			this.parent.node.appendChild(widget.node);
			if (this.parent.isAttached) {
				messaging_1.sendMessage(widget, widget_1.WidgetMessage.AfterAttach);
			}
		};
		DockLayout.prototype.detachWidget = function (widget) {
			if (this.parent.node !== widget.node.parentNode) {
				return;
			}
			if (this.parent.isAttached) {
				messaging_1.sendMessage(widget, widget_1.WidgetMessage.BeforeDetach);
			}
			this.parent.node.removeChild(widget.node);
			widget_1.Widget.resetGeometry(widget);
		};
		DockLayout.prototype.onAfterShow = function (msg) {
			_super.prototype.onAfterShow.call(this, msg);
			this.parent.update();
		};
		DockLayout.prototype.onAfterAttach = function (msg) {
			_super.prototype.onAfterAttach.call(this, msg);
			this.parent.fit();
		};
		DockLayout.prototype.onChildShown = function (msg) {
			if (platform_1.IS_IE || platform_1.IS_EDGE) {
				messaging_1.sendMessage(this.parent, widget_1.WidgetMessage.FitRequest);
			}
			else {
				this.parent.fit();
			}
		};
		DockLayout.prototype.onChildHidden = function (msg) {
			if (platform_1.IS_IE || platform_1.IS_EDGE) {
				messaging_1.sendMessage(this.parent, widget_1.WidgetMessage.FitRequest);
			}
			else {
				this.parent.fit();
			}
		};
		DockLayout.prototype.onResize = function (msg) {
			if (this.parent.isVisible) {
				this._update(msg.width, msg.height);
			}
		};
		DockLayout.prototype.onUpdateRequest = function (msg) {
			if (this.parent.isVisible) {
				this._update(-1, -1);
			}
		};
		DockLayout.prototype.onFitRequest = function (msg) {
			if (this.parent.isAttached) {
				this._fit();
			}
		};
		DockLayout.prototype._removeWidget = function (widget) {
			if (!this._root) {
				return;
			}
			var tabNode = Private.findTabNode(this._root, widget);
			if (!tabNode) {
				return;
			}
			if (tabNode.tabBar.titles.length > 1) {
				tabNode.tabBar.removeTab(widget.title);
				return;
			}
			tabNode.tabBar.dispose();
			if (this._root === tabNode) {
				this._root = null;
				return;
			}
			Private.holdLayoutSizes(this._root);
			var splitNode = tabNode.parent;
			tabNode.parent = null;
			var i = splitNode.children.remove(tabNode);
			var handle = splitNode.handles.removeAt(i);
			splitNode.sizers.removeAt(i);
			if (handle.parentNode) {
				handle.parentNode.removeChild(handle);
			}
			if (splitNode.children.length > 1) {
				Private.syncHandles(splitNode);
				return;
			}
			var parentNode = splitNode.parent;
			splitNode.parent = null;
			var childNode = splitNode.children.front;
			var childHandle = splitNode.handles.front;
			splitNode.children.clear();
			splitNode.handles.clear();
			splitNode.sizers.clear();
			if (childHandle.parentNode) {
				childHandle.parentNode.removeChild(childHandle);
			}
			if (this._root === splitNode) {
				childNode.parent = null;
				this._root = childNode;
				return;
			}
			var j = searching_1.indexOf(parentNode.children, splitNode);
			if (childNode instanceof Private.TabLayoutNode) {
				childNode.parent = parentNode;
				parentNode.children.set(j, childNode);
				return;
			}
			var splitHandle = parentNode.handles.removeAt(j);
			parentNode.children.removeAt(j);
			parentNode.sizers.removeAt(j);
			if (splitHandle.parentNode) {
				splitHandle.parentNode.removeChild(splitHandle);
			}
			for (var i_1 = 0, n = childNode.children.length; i_1 < n; ++i_1) {
				var gChild = childNode.children.at(i_1);
				var gHandle = childNode.handles.at(i_1);
				var gSizer = childNode.sizers.at(i_1);
				parentNode.children.insert(j + i_1, gChild);
				parentNode.handles.insert(j + i_1, gHandle);
				parentNode.sizers.insert(j + i_1, gSizer);
				gChild.parent = parentNode;
			}
			childNode.children.clear();
			childNode.handles.clear();
			childNode.sizers.clear();
			childNode.parent = null;
			Private.syncHandles(parentNode);
		};
		DockLayout.prototype._insertTab = function (widget, ref, refNode, after) {
			if (widget === ref) {
				return;
			}
			if (!this._root) {
				var tabNode = new Private.TabLayoutNode(this._createTabBar());
				tabNode.tabBar.addTab(widget.title);
				this._root = tabNode;
				return;
			}
			if (!refNode) {
				refNode = Private.firstTabNode(this._root);
			}
			if (!searching_1.contains(refNode.tabBar.titles, widget.title)) {
				this._removeWidget(widget);
				widget.hide();
			}
			var index;
			if (ref) {
				index = searching_1.indexOf(refNode.tabBar.titles, ref.title);
			}
			else {
				index = refNode.tabBar.currentIndex;
			}
			refNode.tabBar.insertTab(index + (after ? 1 : 0), widget.title);
		};
		DockLayout.prototype._insertSplit = function (widget, ref, refNode, orientation, after) {
			if (widget === ref && refNode.tabBar.titles.length === 1) {
				return;
			}
			this._removeWidget(widget);
			var tabNode = new Private.TabLayoutNode(this._createTabBar());
			tabNode.tabBar.addTab(widget.title);
			if (!this._root) {
				this._root = tabNode;
				return;
			}
			var splitNode = refNode ? refNode.parent : null;
			if (!splitNode) {
				var root = this._splitRoot(orientation);
				var i_2 = after ? root.children.length : 0;
				Private.normalizeSizes(root);
				root.children.insert(i_2, tabNode);
				root.sizers.insert(i_2, Private.createSizer(GOLDEN));
				root.handles.insert(i_2, this._createHandle());
				tabNode.parent = root;
				Private.normalizeSizes(root);
				Private.syncHandles(root);
				return;
			}
			if (splitNode.orientation === orientation) {
				var i_3 = searching_1.indexOf(splitNode.children, refNode);
				Private.normalizeSizes(splitNode);
				var s = splitNode.sizers.at(i_3).sizeHint /= 2;
				var j_1 = i_3 + (after ? 1 : 0);
				splitNode.children.insert(j_1, tabNode);
				splitNode.sizers.insert(j_1, Private.createSizer(s));
				splitNode.handles.insert(j_1, this._createHandle());
				tabNode.parent = splitNode;
				Private.syncHandles(splitNode);
				return;
			}
			var i = splitNode.children.remove(refNode);
			var childNode = new Private.SplitLayoutNode(orientation);
			childNode.normalized = true;
			childNode.children.pushBack(refNode);
			childNode.sizers.pushBack(Private.createSizer(0.5));
			childNode.handles.pushBack(this._createHandle());
			refNode.parent = childNode;
			var j = after ? 1 : 0;
			childNode.children.insert(j, tabNode);
			childNode.sizers.insert(j, Private.createSizer(0.5));
			childNode.handles.insert(j, this._createHandle());
			tabNode.parent = childNode;
			Private.syncHandles(childNode);
			splitNode.children.insert(i, childNode);
			childNode.parent = splitNode;
		};
		DockLayout.prototype._splitRoot = function (orientation) {
			var root = this._root;
			if (root instanceof Private.SplitLayoutNode) {
				if (root.orientation === orientation) {
					return root;
				}
			}
			var result = this._root = new Private.SplitLayoutNode(orientation);
			result.children.pushBack(root);
			result.sizers.pushBack(Private.createSizer(0));
			result.handles.pushBack(this._createHandle());
			root.parent = result;
			return result;
		};
		DockLayout.prototype._fit = function () {
			var minW = 0;
			var minH = 0;
			var maxW = Infinity;
			var maxH = Infinity;
			if (this._root) {
				var limits = Private.fitLayoutNode(this._root, this._spacing);
				minW = limits.minWidth;
				minH = limits.minHeight;
				maxW = limits.maxWidth;
				maxH = limits.maxHeight;
			}
			var box = this._box = sizing_1.boxSizing(this.parent.node);
			minW += box.horizontalSum;
			minH += box.verticalSum;
			maxW += box.horizontalSum;
			maxH += box.verticalSum;
			var style = this.parent.node.style;
			style.minWidth = minW + "px";
			style.minHeight = minH + "px";
			style.maxWidth = maxW === Infinity ? 'none' : maxW + "px";
			style.maxHeight = maxH === Infinity ? 'none' : maxH + "px";
			this._dirty = true;
			if (this.parent.parent) {
				messaging_1.sendMessage(this.parent.parent, widget_1.WidgetMessage.FitRequest);
			}
			if (this._dirty) {
				messaging_1.sendMessage(this.parent, widget_1.WidgetMessage.UpdateRequest);
			}
		};
		DockLayout.prototype._update = function (offsetWidth, offsetHeight) {
			this._dirty = false;
			if (!this._root) {
				return;
			}
			if (offsetWidth < 0) {
				offsetWidth = this.parent.node.offsetWidth;
			}
			if (offsetHeight < 0) {
				offsetHeight = this.parent.node.offsetHeight;
			}
			var box = this._box || (this._box = sizing_1.boxSizing(this.parent.node));
			var x = box.paddingTop;
			var y = box.paddingLeft;
			var width = offsetWidth - box.horizontalSum;
			var height = offsetHeight - box.verticalSum;
			Private.updateLayoutNode(this._root, x, y, width, height, this._spacing);
		};
		DockLayout.prototype._createTabBar = function () {
			var tabBar = this._renderer.createTabBar();
			tabBar.tabsMovable = true;
			tabBar.allowDeselect = false;
			tabBar.orientation = 'horizontal';
			tabBar.removeBehavior = 'select-previous-tab';
			tabBar.insertBehavior = 'select-tab-if-needed';
			tabBar.currentChanged.connect(this._onCurrentChanged, this);
			if (this.parent) {
				tabBar.parent = this.parent;
				this.attachWidget(tabBar);
			}
			return tabBar;
		};
		DockLayout.prototype._createHandle = function () {
			var handle = this._renderer.createHandle();
			var style = handle.style;
			style.position = 'absolute';
			style.top = '0';
			style.left = '0';
			style.width = '0';
			style.height = '0';
			if (this.parent) {
				this.parent.node.appendChild(handle);
			}
			return handle;
		};
		DockLayout.prototype._onCurrentChanged = function (sender, args) {
			var previousTitle = args.previousTitle, currentTitle = args.currentTitle;
			var previousWidget = previousTitle ? previousTitle.owner : null;
			var currentWidget = currentTitle ? currentTitle.owner : null;
			if (previousWidget) {
				previousWidget.hide();
			}
			if (currentWidget) {
				currentWidget.show();
			}
		};
		return DockLayout;
	}(widget_1.Layout));
	exports.DockLayout = DockLayout;
	var Private;
	(function (Private) {
		var TabLayoutNode = (function () {
			function TabLayoutNode(tabBar) {
				this.parent = null;
				this.sizers = new vector_1.Vector();
				var tabSizer = new boxengine_1.BoxSizer();
				var widgetSizer = new boxengine_1.BoxSizer();
				tabSizer.stretch = 0;
				widgetSizer.stretch = 1;
				this.sizers.pushBack(tabSizer);
				this.sizers.pushBack(widgetSizer);
				this.tabBar = tabBar;
			}
			return TabLayoutNode;
		}());
		Private.TabLayoutNode = TabLayoutNode;
		var SplitLayoutNode = (function () {
			function SplitLayoutNode(orientation) {
				this.parent = null;
				this.normalized = false;
				this.children = new vector_1.Vector();
				this.sizers = new vector_1.Vector();
				this.handles = new vector_1.Vector();
				this.orientation = orientation;
			}
			return SplitLayoutNode;
		}());
		Private.SplitLayoutNode = SplitLayoutNode;
		function clampSpacing(value) {
			return Math.max(0, Math.floor(value));
		}
		Private.clampSpacing = clampSpacing;
		function iterAllWidgets(node) {
			var it;
			if (node instanceof TabLayoutNode) {
				it = iteration_1.chain(iteration_1.once(node.tabBar), iterUserWidgets(node));
			}
			else {
				it = new iteration_1.ChainIterator(iteration_1.map(node.children, iterAllWidgets));
			}
			return it;
		}
		Private.iterAllWidgets = iterAllWidgets;
		function iterUserWidgets(node) {
			var it;
			if (node instanceof TabLayoutNode) {
				it = iteration_1.map(node.tabBar.titles, function (title) { return title.owner; });
			}
			else {
				it = new iteration_1.ChainIterator(iteration_1.map(node.children, iterUserWidgets));
			}
			return it;
		}
		Private.iterUserWidgets = iterUserWidgets;
		function iterTabBars(node) {
			var it;
			if (node instanceof TabLayoutNode) {
				it = iteration_1.once(node.tabBar);
			}
			else {
				it = new iteration_1.ChainIterator(iteration_1.map(node.children, iterTabBars));
			}
			return it;
		}
		Private.iterTabBars = iterTabBars;
		function iterHandles(node) {
			var it;
			if (node instanceof TabLayoutNode) {
				it = iteration_1.empty();
			}
			else {
				var others = iteration_1.map(node.children, iterHandles);
				it = iteration_1.chain(node.handles, new iteration_1.ChainIterator(others));
			}
			return it;
		}
		Private.iterHandles = iterHandles;
		function tabBarRef(tabBar) {
			if (tabBar.currentTitle) {
				return tabBar.currentTitle.owner;
			}
			if (tabBar.titles.length > 0) {
				return tabBar.titles.at(tabBar.titles.length - 1).owner;
			}
			return null;
		}
		Private.tabBarRef = tabBarRef;
		function firstTabNode(node) {
			if (node instanceof TabLayoutNode) {
				return node;
			}
			for (var i = 0, n = node.children.length; i < n; ++i) {
				var result = firstTabNode(node.children.at(i));
				if (result !== null) {
					return result;
				}
			}
			return null;
		}
		Private.firstTabNode = firstTabNode;
		function findTabNode(node, widget) {
			if (node instanceof TabLayoutNode) {
				return searching_1.contains(node.tabBar.titles, widget.title) ? node : null;
			}
			for (var i = 0, n = node.children.length; i < n; ++i) {
				var result = findTabNode(node.children.at(i), widget);
				if (result !== null) {
					return result;
				}
			}
			return null;
		}
		Private.findTabNode = findTabNode;
		function findSplitNode(node, handle) {
			if (node instanceof TabLayoutNode) {
				return null;
			}
			var index = searching_1.indexOf(node.handles, handle);
			if (index !== -1) {
				return { index: index, node: node };
			}
			for (var i = 0, n = node.children.length; i < n; ++i) {
				var result = findSplitNode(node.children.at(i), handle);
				if (result !== null) {
					return result;
				}
			}
			return null;
		}
		Private.findSplitNode = findSplitNode;
		function fitLayoutNode(node, spacing) {
			var limits;
			if (node instanceof TabLayoutNode) {
				limits = fitTabNode(node);
			}
			else {
				limits = fitSplitNode(node, spacing);
			}
			return limits;
		}
		Private.fitLayoutNode = fitLayoutNode;
		function updateLayoutNode(node, x, y, width, height, spacing) {
			if (node instanceof TabLayoutNode) {
				updateTabNode(node, x, y, width, height);
			}
			else {
				updateSplitNode(node, x, y, width, height, spacing);
			}
		}
		Private.updateLayoutNode = updateLayoutNode;
		function syncHandles(splitNode) {
			if (splitNode.handles.isEmpty) {
				return;
			}
			var horizontal = splitNode.orientation === 'horizontal';
			var remClass = horizontal ? VERTICAL_CLASS : HORIZONTAL_CLASS;
			var addClass = horizontal ? HORIZONTAL_CLASS : VERTICAL_CLASS;
			iteration_1.each(splitNode.handles, function (handle) {
				handle.classList.remove(HIDDEN_CLASS);
				handle.classList.remove(remClass);
				handle.classList.add(addClass);
			});
			splitNode.handles.back.classList.add(HIDDEN_CLASS);
		}
		Private.syncHandles = syncHandles;
		function calcEdge(node, x, y) {
			var rect = node.getBoundingClientRect();
			var fracX = (x - rect.left) / rect.width;
			var fracY = (y - rect.top) / rect.height;
			var normX = fracX > 0.5 ? 1 - fracX : fracX;
			var normY = fracY > 0.5 ? 1 - fracY : fracY;
			var result;
			if (normX < normY) {
				result = fracX <= 0.5 ? 'left' : 'right';
			}
			else {
				result = fracY <= 0.5 ? 'top' : 'bottom';
			}
			return result;
		}
		Private.calcEdge = calcEdge;
		function holdSizes(sizers) {
			iteration_1.each(sizers, function (sizer) { sizer.sizeHint = sizer.size; });
		}
		Private.holdSizes = holdSizes;
		function holdLayoutSizes(node) {
			if (node instanceof SplitLayoutNode) {
				iteration_1.each(node.children, holdLayoutSizes);
				holdSizes(node.sizers);
			}
		}
		Private.holdLayoutSizes = holdLayoutSizes;
		function createSizer(hint) {
			var sizer = new boxengine_1.BoxSizer();
			sizer.sizeHint = hint;
			sizer.size = hint;
			return sizer;
		}
		Private.createSizer = createSizer;
		function normalizeSizes(splitNode) {
			var n = splitNode.sizers.length;
			if (n === 0) {
				return;
			}
			holdSizes(splitNode.sizers);
			var sum = iteration_1.reduce(splitNode.sizers, function (v, sizer) { return v + sizer.sizeHint; }, 0);
			if (sum === 0) {
				iteration_1.each(splitNode.sizers, function (sizer) {
					sizer.size = sizer.sizeHint = 1 / n;
				});
			}
			else {
				iteration_1.each(splitNode.sizers, function (sizer) {
					sizer.size = sizer.sizeHint /= sum;
				});
			}
			splitNode.normalized = true;
		}
		Private.normalizeSizes = normalizeSizes;
		function fitTabNode(tabNode) {
			var minWidth = 0;
			var minHeight = 0;
			var maxWidth = Infinity;
			var maxHeight = Infinity;
			var tabBar = tabNode.tabBar;
			var tabSizer = tabNode.sizers.at(0);
			var widgetSizer = tabNode.sizers.at(1);
			var currentTitle = tabBar.currentTitle;
			var widget = currentTitle ? currentTitle.owner : null;
			if (!tabBar.isHidden || (widget && !widget.isHidden)) {
				maxHeight = 0;
			}
			if (!tabBar.isHidden) {
				var limits = sizing_1.sizeLimits(tabBar.node);
				minWidth = Math.max(minWidth, limits.minWidth);
				maxWidth = Math.min(maxWidth, limits.maxWidth);
				minHeight += limits.minHeight;
				maxHeight += limits.maxHeight;
				tabSizer.minSize = limits.minHeight;
				tabSizer.maxSize = limits.maxHeight;
			}
			else {
				tabSizer.minSize = 0;
				tabSizer.maxSize = 0;
			}
			if (widget && !widget.isHidden) {
				var limits = sizing_1.sizeLimits(widget.node);
				minWidth = Math.max(minWidth, limits.minWidth);
				maxWidth = Math.min(maxWidth, limits.maxWidth);
				minHeight += limits.minHeight;
				maxHeight += limits.maxHeight;
				widgetSizer.minSize = limits.minHeight;
				widgetSizer.maxSize = limits.maxHeight;
			}
			else {
				widgetSizer.minSize = 0;
				widgetSizer.maxSize = 0;
			}
			return { minWidth: minWidth, minHeight: minHeight, maxWidth: maxWidth, maxHeight: maxHeight };
		}
		function fitSplitNode(splitNode, spacing) {
			var minWidth = 0;
			var minHeight = 0;
			var maxWidth = Infinity;
			var maxHeight = Infinity;
			var horizontal = splitNode.orientation === 'horizontal';
			var fixed = Math.max(0, splitNode.children.length - 1) * spacing;
			if (horizontal) {
				minWidth = fixed;
				maxWidth = fixed;
			}
			else {
				minHeight = fixed;
				maxHeight = fixed;
			}
			for (var i = 0, n = splitNode.children.length; i < n; ++i) {
				var sizer = splitNode.sizers.at(i);
				var child = splitNode.children.at(i);
				var limits = fitLayoutNode(child, spacing);
				if (horizontal) {
					minHeight = Math.max(minHeight, limits.minHeight);
					maxHeight = Math.min(maxHeight, limits.maxHeight);
					minWidth += limits.minWidth;
					maxWidth += limits.maxWidth;
					sizer.minSize = limits.minWidth;
					sizer.maxSize = limits.maxWidth;
				}
				else {
					minWidth = Math.max(minWidth, limits.minWidth);
					maxWidth = Math.min(maxWidth, limits.maxWidth);
					minHeight += limits.minHeight;
					maxHeight += limits.maxHeight;
					sizer.minSize = limits.minHeight;
					sizer.maxSize = limits.maxHeight;
				}
			}
			return { minWidth: minWidth, minHeight: minHeight, maxWidth: maxWidth, maxHeight: maxHeight };
		}
		function updateTabNode(tabNode, x, y, width, height) {
			var tabBar = tabNode.tabBar;
			var tabSizer = tabNode.sizers.at(0);
			var widgetSizer = tabNode.sizers.at(1);
			var currentTitle = tabBar.currentTitle;
			var widget = currentTitle ? currentTitle.owner : null;
			boxengine_1.boxCalc(tabNode.sizers, height);
			if (!tabBar.isHidden) {
				widget_1.Widget.setGeometry(tabBar, x, y, width, tabSizer.size);
				y += tabSizer.size;
			}
			if (widget && !widget.isHidden) {
				widget_1.Widget.setGeometry(widget, x, y, width, widgetSizer.size);
			}
		}
		function updateSplitNode(splitNode, x, y, width, height, spacing) {
			var horizontal = splitNode.orientation === 'horizontal';
			var fixed = Math.max(0, splitNode.children.length - 1) * spacing;
			var space = Math.max(0, (horizontal ? width : height) - fixed);
			if (splitNode.normalized) {
				iteration_1.each(splitNode.sizers, function (sizer) { sizer.sizeHint *= space; });
				splitNode.normalized = false;
			}
			boxengine_1.boxCalc(splitNode.sizers, space);
			for (var i = 0, n = splitNode.children.length; i < n; ++i) {
				var child = splitNode.children.at(i);
				var size = splitNode.sizers.at(i).size;
				var hStyle = splitNode.handles.at(i).style;
				if (horizontal) {
					updateLayoutNode(child, x, y, size, height, spacing);
					x += size;
					hStyle.top = y + "px";
					hStyle.left = x + "px";
					hStyle.width = spacing + "px";
					hStyle.height = height + "px";
					x += spacing;
				}
				else {
					updateLayoutNode(child, x, y, width, size, spacing);
					y += size;
					hStyle.top = y + "px";
					hStyle.left = x + "px";
					hStyle.width = width + "px";
					hStyle.height = spacing + "px";
					y += spacing;
				}
			}
		}
	})(Private || (Private = {}));
},
function(module, exports, __webpack_require__) {
	"use strict";
	var iteration_1 = __webpack_require__(2);
	var searching_1 = __webpack_require__(21);
	var vector_1 = __webpack_require__(23);
	var signaling_1 = __webpack_require__(9);
	var FocusTracker = (function () {
		function FocusTracker() {
			this._counter = 0;
			this._currentWidget = null;
			this._widgets = new vector_1.Vector();
			this._numbers = new Map();
			this._nodes = new Map();
		}
		FocusTracker.prototype.dispose = function () {
			var _this = this;
			if (this._counter < 0) {
				return;
			}
			this._counter = -1;
			signaling_1.clearSignalData(this);
			iteration_1.each(this._widgets, function (widget) {
				widget.node.removeEventListener('focus', _this, true);
			});
			this._currentWidget = null;
			this._nodes.clear();
			this._numbers.clear();
			this._widgets.clear();
		};
		Object.defineProperty(FocusTracker.prototype, "isDisposed", {
			get: function () {
				return this._counter < 0;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(FocusTracker.prototype, "currentWidget", {
			get: function () {
				return this._currentWidget;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(FocusTracker.prototype, "widgets", {
			get: function () {
				return this._widgets;
			},
			enumerable: true,
			configurable: true
		});
		FocusTracker.prototype.focusNumber = function (widget) {
			return this._numbers.get(widget);
		};
		FocusTracker.prototype.has = function (widget) {
			return this._numbers.has(widget);
		};
		FocusTracker.prototype.add = function (widget) {
			if (this._numbers.has(widget)) {
				return;
			}
			var focused = widget.node.contains(document.activeElement);
			var n = focused ? this._counter++ : -1;
			this._numbers.set(widget, n);
			this._widgets.pushBack(widget);
			this._nodes.set(widget.node, widget);
			widget.node.addEventListener('focus', this, true);
			widget.disposed.connect(this._onWidgetDisposed, this);
			if (focused)
				this._setCurrentWidget(widget);
		};
		FocusTracker.prototype.remove = function (widget) {
			var _this = this;
			if (!this._numbers.has(widget)) {
				return;
			}
			widget.disposed.disconnect(this._onWidgetDisposed, this);
			widget.node.removeEventListener('focus', this, true);
			this._widgets.remove(widget);
			this._nodes.delete(widget.node);
			this._numbers.delete(widget);
			if (this._currentWidget !== widget) {
				return;
			}
			var valid = iteration_1.filter(this._widgets, function (w) { return _this._numbers.get(w) !== -1; });
			var previous = searching_1.max(valid, function (first, second) {
				var a = _this._numbers.get(first);
				var b = _this._numbers.get(second);
				return a - b;
			}) || null;
			this._setCurrentWidget(previous);
		};
		FocusTracker.prototype.handleEvent = function (event) {
			if (event.type === 'focus') {
				this._evtFocus(event);
			}
		};
		FocusTracker.prototype._setCurrentWidget = function (widget) {
			if (this._currentWidget === widget) {
				return;
			}
			var old = this._currentWidget;
			this._currentWidget = widget;
			this.currentChanged.emit({ oldValue: old, newValue: widget });
		};
		FocusTracker.prototype._evtFocus = function (event) {
			var widget = this._nodes.get(event.currentTarget);
			this._numbers.set(widget, this._counter++);
			this._setCurrentWidget(widget);
		};
		FocusTracker.prototype._onWidgetDisposed = function (sender) {
			this.remove(sender);
		};
		return FocusTracker;
	}());
	exports.FocusTracker = FocusTracker;
	signaling_1.defineSignal(FocusTracker.prototype, 'currentChanged');
},
function(module, exports, __webpack_require__) {
	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
		for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
		function __() { this.constructor = d; }
		d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var iteration_1 = __webpack_require__(2);
	var mutation_1 = __webpack_require__(29);
	var searching_1 = __webpack_require__(21);
	var vector_1 = __webpack_require__(23);
	var messaging_1 = __webpack_require__(3);
	var signaling_1 = __webpack_require__(9);
	var cursor_1 = __webpack_require__(11);
	var query_1 = __webpack_require__(14);
	var title_1 = __webpack_require__(26);
	var vdom_1 = __webpack_require__(35);
	var widget_1 = __webpack_require__(25);
	var TAB_BAR_CLASS = 'p-TabBar';
	var CONTENT_CLASS = 'p-TabBar-content';
	var TAB_CLASS = 'p-TabBar-tab';
	var LABEL_CLASS = 'p-TabBar-tabLabel';
	var ICON_CLASS = 'p-TabBar-tabIcon';
	var CLOSE_ICON_CLASS = 'p-TabBar-tabCloseIcon';
	var DRAGGING_CLASS = 'p-mod-dragging';
	var CURRENT_CLASS = 'p-mod-current';
	var CLOSABLE_CLASS = 'p-mod-closable';
	var DRAG_THRESHOLD = 5;
	var DETACH_THRESHOLD = 20;
	var TAB_BAR_NODE = (vdom_1.h.div(vdom_1.h.ul({ className: CONTENT_CLASS })));
	var TabBar = (function (_super) {
		__extends(TabBar, _super);
		function TabBar(options) {
			if (options === void 0) { options = {}; }
			_super.call(this, { node: vdom_1.realize(TAB_BAR_NODE) });
			this._currentIndex = -1;
			this._previousTitle = null;
			this._titles = new vector_1.Vector();
			this._dragData = null;
			this.addClass(TAB_BAR_CLASS);
			this.setFlag(widget_1.WidgetFlag.DisallowLayout);
			this._tabsMovable = options.tabsMovable || false;
			this._allowDeselect = options.allowDeselect || false;
			this._orientation = options.orientation || 'horizontal';
			this._renderer = options.renderer || TabBar.defaultRenderer;
			this._insertBehavior = options.insertBehavior || 'select-tab-if-needed';
			this._removeBehavior = options.removeBehavior || 'select-tab-after';
			this.addClass("p-mod-" + this._orientation);
		}
		TabBar.prototype.dispose = function () {
			this._releaseMouse();
			this._titles.clear();
			this._renderer = null;
			this._previousTitle = null;
			_super.prototype.dispose.call(this);
		};
		Object.defineProperty(TabBar.prototype, "contentNode", {
			get: function () {
				return this.node.getElementsByClassName(CONTENT_CLASS)[0];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TabBar.prototype, "titles", {
			get: function () {
				return this._titles;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TabBar.prototype, "currentTitle", {
			get: function () {
				var i = this._currentIndex;
				return i !== -1 ? this._titles.at(i) : null;
			},
			set: function (value) {
				this.currentIndex = searching_1.indexOf(this._titles, value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TabBar.prototype, "currentIndex", {
			get: function () {
				return this._currentIndex;
			},
			set: function (value) {
				var i = Math.floor(value);
				if (i < 0 || i >= this._titles.length) {
					i = -1;
				}
				if (this._currentIndex === i) {
					return;
				}
				var pi = this._currentIndex;
				var pt = pi === -1 ? null : this._titles.at(pi);
				var ci = i;
				var ct = ci === -1 ? null : this._titles.at(ci);
				this._currentIndex = ci;
				this._previousTitle = pt;
				this.currentChanged.emit({
					previousIndex: pi, previousTitle: pt,
					currentIndex: ci, currentTitle: ct
				});
				this.update();
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TabBar.prototype, "orientation", {
			get: function () {
				return this._orientation;
			},
			set: function (value) {
				if (this._orientation === value) {
					return;
				}
				this._releaseMouse();
				var old = this._orientation;
				this._orientation = value;
				this.removeClass("p-mod-" + old);
				this.addClass("p-mod-" + value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TabBar.prototype, "tabsMovable", {
			get: function () {
				return this._tabsMovable;
			},
			set: function (value) {
				this._tabsMovable = value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TabBar.prototype, "allowDeselect", {
			get: function () {
				return this._allowDeselect;
			},
			set: function (value) {
				this._allowDeselect = value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TabBar.prototype, "insertBehavior", {
			get: function () {
				return this._insertBehavior;
			},
			set: function (value) {
				this._insertBehavior = value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TabBar.prototype, "removeBehavior", {
			get: function () {
				return this._removeBehavior;
			},
			set: function (value) {
				this._removeBehavior = value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TabBar.prototype, "renderer", {
			get: function () {
				return this._renderer;
			},
			enumerable: true,
			configurable: true
		});
		TabBar.prototype.addTab = function (value) {
			return this.insertTab(this._titles.length, value);
		};
		TabBar.prototype.insertTab = function (index, value) {
			this._releaseMouse();
			var title = Private.asTitle(value);
			var i = searching_1.indexOf(this._titles, title);
			var j = Math.max(0, Math.min(Math.floor(index), this._titles.length));
			if (i === -1) {
				this._titles.insert(j, title);
				title.changed.connect(this._onTitleChanged, this);
				this._adjustCurrentForInsert(j, title);
				this.update();
				return title;
			}
			if (j === this._titles.length)
				j--;
			if (i === j)
				return title;
			mutation_1.move(this._titles, i, j);
			this._adjustCurrentForMove(i, j);
			this.update();
			return title;
		};
		TabBar.prototype.removeTab = function (title) {
			var index = searching_1.indexOf(this._titles, title);
			if (index !== -1)
				this.removeTabAt(index);
			return index;
		};
		TabBar.prototype.removeTabAt = function (index) {
			var i = Math.floor(index);
			if (i < 0 || i >= this._titles.length) {
				return null;
			}
			this._releaseMouse();
			var title = this._titles.removeAt(i);
			title.changed.disconnect(this._onTitleChanged, this);
			if (title === this._previousTitle) {
				this._previousTitle = null;
			}
			this._adjustCurrentForRemove(i, title);
			this.update();
			return title;
		};
		TabBar.prototype.clearTabs = function () {
			var _this = this;
			if (this._titles.length === 0) {
				return;
			}
			this._releaseMouse();
			iteration_1.each(this._titles, function (title) {
				title.changed.disconnect(_this._onTitleChanged, _this);
			});
			var pi = this.currentIndex;
			var pt = this.currentTitle;
			this._currentIndex = -1;
			this._previousTitle = null;
			this._titles.clear();
			this.update();
			if (pi === -1) {
				return;
			}
			this.currentChanged.emit({
				previousIndex: pi, previousTitle: pt,
				currentIndex: -1, currentTitle: null
			});
		};
		TabBar.prototype.releaseMouse = function () {
			this._releaseMouse();
		};
		TabBar.prototype.handleEvent = function (event) {
			switch (event.type) {
				case 'click':
					this._evtClick(event);
					break;
				case 'mousedown':
					this._evtMouseDown(event);
					break;
				case 'mousemove':
					this._evtMouseMove(event);
					break;
				case 'mouseup':
					this._evtMouseUp(event);
					break;
				case 'keydown':
					this._evtKeyDown(event);
					break;
				case 'contextmenu':
					event.preventDefault();
					event.stopPropagation();
					break;
			}
		};
		TabBar.prototype.onAfterAttach = function (msg) {
			this.node.addEventListener('click', this);
			this.node.addEventListener('mousedown', this);
		};
		TabBar.prototype.onBeforeDetach = function (msg) {
			this.node.removeEventListener('click', this);
			this.node.removeEventListener('mousedown', this);
			this._releaseMouse();
		};
		TabBar.prototype.onUpdateRequest = function (msg) {
			var content = [];
			var titles = this._titles;
			var renderer = this._renderer;
			var currentTitle = this.currentTitle;
			for (var i = 0, n = titles.length; i < n; ++i) {
				var title = titles.at(i);
				var current = title === currentTitle;
				var zIndex = current ? n : n - i - 1;
				content.push(renderer.renderTab({ title: title, current: current, zIndex: zIndex }));
			}
			vdom_1.render(content, this.contentNode);
		};
		TabBar.prototype._evtKeyDown = function (event) {
			event.preventDefault();
			event.stopPropagation();
			if (event.keyCode === 27)
				this._releaseMouse();
		};
		TabBar.prototype._evtClick = function (event) {
			if (event.button !== 0) {
				return;
			}
			if (this._dragData) {
				return;
			}
			var tabs = this.contentNode.children;
			var x = event.clientX;
			var y = event.clientY;
			var i = searching_1.findIndex(tabs, function (tab) { return query_1.hitTest(tab, x, y); });
			if (i < 0) {
				return;
			}
			event.preventDefault();
			event.stopPropagation();
			var title = this._titles.at(i);
			if (!title.closable) {
				return;
			}
			var icon = tabs[i].querySelector(this._renderer.closeIconSelector);
			if (!icon || !icon.contains(event.target)) {
				return;
			}
			this.tabCloseRequested.emit({ index: i, title: title });
		};
		TabBar.prototype._evtMouseDown = function (event) {
			if (event.button !== 0) {
				return;
			}
			if (this._dragData) {
				return;
			}
			var tabs = this.contentNode.children;
			var x = event.clientX;
			var y = event.clientY;
			var i = searching_1.findIndex(tabs, function (tab) { return query_1.hitTest(tab, x, y); });
			if (i < 0) {
				return;
			}
			event.preventDefault();
			event.stopPropagation();
			var icon = tabs[i].querySelector(this._renderer.closeIconSelector);
			if (icon && icon.contains(event.target)) {
				return;
			}
			if (this._tabsMovable) {
				this._dragData = new Private.DragData();
				this._dragData.index = i;
				this._dragData.tab = tabs[i];
				this._dragData.pressX = event.clientX;
				this._dragData.pressY = event.clientY;
				document.addEventListener('mousemove', this, true);
				document.addEventListener('mouseup', this, true);
				document.addEventListener('keydown', this, true);
				document.addEventListener('contextmenu', this, true);
			}
			if (this._allowDeselect && this._currentIndex === i) {
				this.currentIndex = -1;
			}
			else {
				this.currentIndex = i;
			}
			if (this._currentIndex === -1) {
				return;
			}
			this.tabActivateRequested.emit({
				index: this.currentIndex,
				title: this.currentTitle
			});
		};
		TabBar.prototype._evtMouseMove = function (event) {
			if (!this._dragData) {
				return;
			}
			event.preventDefault();
			event.stopPropagation();
			var tabs = this.contentNode.children;
			var data = this._dragData;
			if (!data.dragActive) {
				var dx = Math.abs(event.clientX - data.pressX);
				var dy = Math.abs(event.clientY - data.pressY);
				if (dx < DRAG_THRESHOLD && dy < DRAG_THRESHOLD) {
					return;
				}
				var tabRect = data.tab.getBoundingClientRect();
				if (this._orientation === 'horizontal') {
					data.tabPos = data.tab.offsetLeft;
					data.tabSize = tabRect.width;
					data.tabPressPos = data.pressX - tabRect.left;
				}
				else {
					data.tabPos = data.tab.offsetTop;
					data.tabSize = tabRect.height;
					data.tabPressPos = data.pressY - tabRect.top;
				}
				data.tabLayout = Private.snapTabLayout(tabs, this._orientation);
				data.contentRect = this.contentNode.getBoundingClientRect();
				data.override = cursor_1.overrideCursor('default');
				data.tab.classList.add(DRAGGING_CLASS);
				this.addClass(DRAGGING_CLASS);
				data.dragActive = true;
			}
			if (!data.detachRequested && Private.detachExceeded(data, event)) {
				data.detachRequested = true;
				var index = data.index;
				var clientX = event.clientX;
				var clientY = event.clientY;
				var tab = tabs[index];
				var title = this._titles.at(index);
				this.tabDetachRequested.emit({ index: index, title: title, tab: tab, clientX: clientX, clientY: clientY });
				if (data.dragAborted) {
					return;
				}
			}
			Private.layoutTabs(tabs, data, event, this._orientation);
		};
		TabBar.prototype._evtMouseUp = function (event) {
			var _this = this;
			if (event.button !== 0) {
				return;
			}
			if (!this._dragData) {
				return;
			}
			event.preventDefault();
			event.stopPropagation();
			document.removeEventListener('mousemove', this, true);
			document.removeEventListener('mouseup', this, true);
			document.removeEventListener('keydown', this, true);
			document.removeEventListener('contextmenu', this, true);
			var data = this._dragData;
			if (!data.dragActive) {
				this._dragData = null;
				return;
			}
			Private.finalizeTabPosition(data, this._orientation);
			data.tab.classList.remove(DRAGGING_CLASS);
			var duration = Private.parseTransitionDuration(data.tab);
			setTimeout(function () {
				if (data.dragAborted) {
					return;
				}
				_this._dragData = null;
				Private.resetTabPositions(_this.contentNode.children, _this._orientation);
				data.override.dispose();
				_this.removeClass(DRAGGING_CLASS);
				var i = data.index;
				var j = data.targetIndex;
				if (j === -1 || i === j) {
					return;
				}
				mutation_1.move(_this._titles, i, j);
				_this._adjustCurrentForMove(i, j);
				_this.tabMoved.emit({
					fromIndex: i, toIndex: j, title: _this._titles.at(j)
				});
				messaging_1.sendMessage(_this, widget_1.WidgetMessage.UpdateRequest);
			}, duration);
		};
		TabBar.prototype._releaseMouse = function () {
			if (!this._dragData) {
				return;
			}
			document.removeEventListener('mousemove', this, true);
			document.removeEventListener('mouseup', this, true);
			document.removeEventListener('keydown', this, true);
			document.removeEventListener('contextmenu', this, true);
			var data = this._dragData;
			this._dragData = null;
			data.dragAborted = true;
			if (!data.dragActive) {
				return;
			}
			Private.resetTabPositions(this.contentNode.children, this._orientation);
			data.override.dispose();
			data.tab.classList.remove(DRAGGING_CLASS);
			this.removeClass(DRAGGING_CLASS);
		};
		TabBar.prototype._adjustCurrentForInsert = function (i, title) {
			var ct = this.currentTitle;
			var ci = this._currentIndex;
			var bh = this._insertBehavior;
			if (bh === 'select-tab' || (bh === 'select-tab-if-needed' && ci === -1)) {
				this._currentIndex = i;
				this._previousTitle = ct;
				this.currentChanged.emit({
					previousIndex: ci, previousTitle: ct,
					currentIndex: i, currentTitle: title
				});
				return;
			}
			if (ci >= i)
				this._currentIndex++;
		};
		TabBar.prototype._adjustCurrentForMove = function (i, j) {
			if (this._currentIndex === i) {
				this._currentIndex = j;
			}
			else if (this._currentIndex < i && this._currentIndex >= j) {
				this._currentIndex++;
			}
			else if (this._currentIndex > i && this._currentIndex <= j) {
				this._currentIndex--;
			}
		};
		TabBar.prototype._adjustCurrentForRemove = function (i, title) {
			var ci = this._currentIndex;
			var bh = this._removeBehavior;
			if (ci !== i) {
				if (ci > i)
					this._currentIndex--;
				return;
			}
			if (this._titles.length === 0) {
				this._currentIndex = -1;
				this.currentChanged.emit({
					previousIndex: i, previousTitle: title,
					currentIndex: -1, currentTitle: null
				});
				return;
			}
			if (bh === 'select-tab-after') {
				this._currentIndex = Math.min(i, this._titles.length - 1);
				this.currentChanged.emit({
					previousIndex: i, previousTitle: title,
					currentIndex: this._currentIndex, currentTitle: this.currentTitle
				});
				return;
			}
			if (bh === 'select-tab-before') {
				this._currentIndex = Math.max(0, i - 1);
				this.currentChanged.emit({
					previousIndex: i, previousTitle: title,
					currentIndex: this._currentIndex, currentTitle: this.currentTitle
				});
				return;
			}
			if (bh === 'select-previous-tab') {
				if (this._previousTitle) {
					this._currentIndex = searching_1.indexOf(this._titles, this._previousTitle);
					this._previousTitle = null;
				}
				else {
					this._currentIndex = Math.min(i, this._titles.length - 1);
				}
				this.currentChanged.emit({
					previousIndex: i, previousTitle: title,
					currentIndex: this._currentIndex, currentTitle: this.currentTitle
				});
				return;
			}
			this._currentIndex = -1;
			this.currentChanged.emit({
				previousIndex: i, previousTitle: title,
				currentIndex: -1, currentTitle: null
			});
		};
		TabBar.prototype._onTitleChanged = function (sender) {
			this.update();
		};
		return TabBar;
	}(widget_1.Widget));
	exports.TabBar = TabBar;
	signaling_1.defineSignal(TabBar.prototype, 'currentChanged');
	signaling_1.defineSignal(TabBar.prototype, 'tabMoved');
	signaling_1.defineSignal(TabBar.prototype, 'tabActivateRequested');
	signaling_1.defineSignal(TabBar.prototype, 'tabCloseRequested');
	signaling_1.defineSignal(TabBar.prototype, 'tabDetachRequested');
	var TabBar;
	(function (TabBar) {
		var Renderer = (function () {
			function Renderer(options) {
				if (options === void 0) { options = {}; }
				this._tabID = 0;
				this._tabKeys = new WeakMap();
				this._extraTabClass = options.extraTabClass || '';
			}
			Object.defineProperty(Renderer.prototype, "closeIconSelector", {
				get: function () {
					return "." + CLOSE_ICON_CLASS;
				},
				enumerable: true,
				configurable: true
			});
			Renderer.prototype.renderTab = function (data) {
				var _a = data.title, label = _a.label, caption = _a.caption;
				var key = this.createTabKey(data);
				var style = this.createTabStyle(data);
				var tabClass = this.createTabClass(data);
				var iconClass = this.createIconClass(data);
				return (vdom_1.h.li({ key: key, className: tabClass, title: caption, style: style }, vdom_1.h.div({ className: iconClass }), vdom_1.h.div({ className: LABEL_CLASS }, label), vdom_1.h.div({ className: CLOSE_ICON_CLASS })));
			};
			Renderer.prototype.createTabKey = function (data) {
				var key = this._tabKeys.get(data.title);
				if (key === void 0) {
					key = "tab-key-" + this._tabID++;
					this._tabKeys.set(data.title, key);
				}
				return key;
			};
			Renderer.prototype.createTabStyle = function (data) {
				return { zIndex: "" + data.zIndex };
			};
			Renderer.prototype.createTabClass = function (data) {
				var title = data.title, current = data.current;
				var name = TAB_CLASS;
				if (title.className) {
					name += " " + title.className;
				}
				if (title.closable) {
					name += " " + CLOSABLE_CLASS;
				}
				if (current) {
					name += " " + CURRENT_CLASS;
				}
				if (this._extraTabClass) {
					name += " " + this._extraTabClass;
				}
				return name;
			};
			Renderer.prototype.createIconClass = function (data) {
				var title = data.title;
				var name = ICON_CLASS;
				if (title.icon) {
					name += " " + title.icon;
				}
				return name;
			};
			return Renderer;
		}());
		TabBar.Renderer = Renderer;
		TabBar.defaultRenderer = new Renderer();
	})(TabBar = exports.TabBar || (exports.TabBar = {}));
	var Private;
	(function (Private) {
		var DragData = (function () {
			function DragData() {
				this.tab = null;
				this.index = -1;
				this.tabPos = -1;
				this.tabSize = -1;
				this.tabPressPos = -1;
				this.targetIndex = -1;
				this.tabLayout = null;
				this.pressX = -1;
				this.pressY = -1;
				this.contentRect = null;
				this.override = null;
				this.dragActive = false;
				this.dragAborted = false;
				this.detachRequested = false;
			}
			return DragData;
		}());
		Private.DragData = DragData;
		function asTitle(value) {
			return value instanceof title_1.Title ? value : new title_1.Title(value);
		}
		Private.asTitle = asTitle;
		function parseTransitionDuration(tab) {
			var style = window.getComputedStyle(tab);
			return 1000 * (parseFloat(style.transitionDuration) || 0);
		}
		Private.parseTransitionDuration = parseTransitionDuration;
		function snapTabLayout(tabs, orientation) {
			var layout = new Array(tabs.length);
			if (orientation === 'horizontal') {
				for (var i = 0, n = tabs.length; i < n; ++i) {
					var node = tabs[i];
					var pos = node.offsetLeft;
					var size = node.offsetWidth;
					var cstyle = window.getComputedStyle(node);
					var margin = parseInt(cstyle.marginLeft, 10) || 0;
					layout[i] = { margin: margin, pos: pos, size: size };
				}
			}
			else {
				for (var i = 0, n = tabs.length; i < n; ++i) {
					var node = tabs[i];
					var pos = node.offsetTop;
					var size = node.offsetHeight;
					var cstyle = window.getComputedStyle(node);
					var margin = parseInt(cstyle.marginTop, 10) || 0;
					layout[i] = { margin: margin, pos: pos, size: size };
				}
			}
			return layout;
		}
		Private.snapTabLayout = snapTabLayout;
		function detachExceeded(data, event) {
			var rect = data.contentRect;
			return ((event.clientX < rect.left - DETACH_THRESHOLD) ||
				(event.clientX >= rect.right + DETACH_THRESHOLD) ||
				(event.clientY < rect.top - DETACH_THRESHOLD) ||
				(event.clientY >= rect.bottom + DETACH_THRESHOLD));
		}
		Private.detachExceeded = detachExceeded;
		function layoutTabs(tabs, data, event, orientation) {
			var pressPos;
			var localPos;
			var clientPos;
			var clientSize;
			if (orientation === 'horizontal') {
				pressPos = data.pressX;
				localPos = event.clientX - data.contentRect.left;
				clientPos = event.clientX;
				clientSize = data.contentRect.width;
			}
			else {
				pressPos = data.pressY;
				localPos = event.clientY - data.contentRect.top;
				clientPos = event.clientY;
				clientSize = data.contentRect.height;
			}
			var targetIndex = data.index;
			var targetPos = localPos - data.tabPressPos;
			var targetEnd = targetPos + data.tabSize;
			for (var i = 0, n = tabs.length; i < n; ++i) {
				var pxPos = void 0;
				var layout = data.tabLayout[i];
				var threshold = layout.pos + (layout.size >> 1);
				if (i < data.index && targetPos < threshold) {
					pxPos = (data.tabSize + data.tabLayout[i + 1].margin) + "px";
					targetIndex = Math.min(targetIndex, i);
				}
				else if (i > data.index && targetEnd > threshold) {
					pxPos = (-data.tabSize - layout.margin) + "px";
					targetIndex = Math.max(targetIndex, i);
				}
				else if (i === data.index) {
					var ideal = clientPos - pressPos;
					var limit = clientSize - (data.tabPos + data.tabSize);
					pxPos = Math.max(-data.tabPos, Math.min(ideal, limit)) + "px";
				}
				else {
					pxPos = '';
				}
				if (orientation === 'horizontal') {
					tabs[i].style.left = pxPos;
				}
				else {
					tabs[i].style.top = pxPos;
				}
			}
			data.targetIndex = targetIndex;
		}
		Private.layoutTabs = layoutTabs;
		function finalizeTabPosition(data, orientation) {
			var clientSize;
			if (orientation === 'horizontal') {
				clientSize = data.contentRect.width;
			}
			else {
				clientSize = data.contentRect.height;
			}
			var ideal;
			if (data.targetIndex === data.index) {
				ideal = 0;
			}
			else if (data.targetIndex > data.index) {
				var tgt = data.tabLayout[data.targetIndex];
				ideal = tgt.pos + tgt.size - data.tabSize - data.tabPos;
			}
			else {
				var tgt = data.tabLayout[data.targetIndex];
				ideal = tgt.pos - data.tabPos;
			}
			var limit = clientSize - (data.tabPos + data.tabSize);
			var final = Math.max(-data.tabPos, Math.min(ideal, limit));
			if (orientation === 'horizontal') {
				data.tab.style.left = final + "px";
			}
			else {
				data.tab.style.top = final + "px";
			}
		}
		Private.finalizeTabPosition = finalizeTabPosition;
		function resetTabPositions(tabs, orientation) {
			if (orientation === 'horizontal') {
				iteration_1.each(tabs, function (tab) { tab.style.left = ''; });
			}
			else {
				iteration_1.each(tabs, function (tab) { tab.style.top = ''; });
			}
		}
		Private.resetTabPositions = resetTabPositions;
	})(Private || (Private = {}));
},
function(module, exports) {
	"use strict";
	var VNode = (function () {
		function VNode(type, tag, attrs, children) {
			this.type = type;
			this.tag = tag;
			this.attrs = attrs;
			this.children = children;
		}
		return VNode;
	}());
	exports.VNode = VNode;
	function h(tag, first) {
		var attrs;
		var children;
		if (first) {
			if (typeof first === 'string') {
				children = [first];
			}
			else if (first instanceof VNode) {
				children = [first];
			}
			else if (first instanceof Array) {
				children = first.slice();
			}
			else {
				attrs = first;
			}
		}
		if (arguments.length > 2) {
			children = children || [];
			for (var i = 2, n = arguments.length; i < n; ++i) {
				var child = arguments[i];
				if (child instanceof Array) {
					for (var j = 0, k = child.length; j < k; ++j) {
						if (child[j])
							children.push(child[j]);
					}
				}
				else if (child) {
					children.push(child);
				}
			}
		}
		if (children) {
			for (var i = 0, n = children.length; i < n; ++i) {
				var child = children[i];
				if (typeof child === 'string') {
					children[i] = Private.createTextVNode(child);
				}
			}
		}
		return Private.createElementVNode(tag, attrs, children);
	}
	exports.h = h;
	var h;
	(function (h) {
		h.a = h.bind(void 0, 'a');
		h.abbr = h.bind(void 0, 'abbr');
		h.address = h.bind(void 0, 'address');
		h.area = h.bind(void 0, 'area');
		h.article = h.bind(void 0, 'article');
		h.aside = h.bind(void 0, 'aside');
		h.audio = h.bind(void 0, 'audio');
		h.b = h.bind(void 0, 'b');
		h.bdi = h.bind(void 0, 'bdi');
		h.bdo = h.bind(void 0, 'bdo');
		h.blockquote = h.bind(void 0, 'blockquote');
		h.br = h.bind(void 0, 'br');
		h.button = h.bind(void 0, 'button');
		h.canvas = h.bind(void 0, 'canvas');
		h.caption = h.bind(void 0, 'caption');
		h.cite = h.bind(void 0, 'cite');
		h.code = h.bind(void 0, 'code');
		h.col = h.bind(void 0, 'col');
		h.colgroup = h.bind(void 0, 'colgroup');
		h.data = h.bind(void 0, 'data');
		h.datalist = h.bind(void 0, 'datalist');
		h.dd = h.bind(void 0, 'dd');
		h.del = h.bind(void 0, 'del');
		h.dfn = h.bind(void 0, 'dfn');
		h.div = h.bind(void 0, 'div');
		h.dl = h.bind(void 0, 'dl');
		h.dt = h.bind(void 0, 'dt');
		h.em = h.bind(void 0, 'em');
		h.embed = h.bind(void 0, 'embed');
		h.fieldset = h.bind(void 0, 'fieldset');
		h.figcaption = h.bind(void 0, 'figcaption');
		h.figure = h.bind(void 0, 'figure');
		h.footer = h.bind(void 0, 'footer');
		h.form = h.bind(void 0, 'form');
		h.h1 = h.bind(void 0, 'h1');
		h.h2 = h.bind(void 0, 'h2');
		h.h3 = h.bind(void 0, 'h3');
		h.h4 = h.bind(void 0, 'h4');
		h.h5 = h.bind(void 0, 'h5');
		h.h6 = h.bind(void 0, 'h6');
		h.header = h.bind(void 0, 'header');
		h.hr = h.bind(void 0, 'hr');
		h.i = h.bind(void 0, 'i');
		h.iframe = h.bind(void 0, 'iframe');
		h.img = h.bind(void 0, 'img');
		h.input = h.bind(void 0, 'input');
		h.ins = h.bind(void 0, 'ins');
		h.kbd = h.bind(void 0, 'kbd');
		h.label = h.bind(void 0, 'label');
		h.legend = h.bind(void 0, 'legend');
		h.li = h.bind(void 0, 'li');
		h.main = h.bind(void 0, 'main');
		h.map = h.bind(void 0, 'map');
		h.mark = h.bind(void 0, 'mark');
		h.meter = h.bind(void 0, 'meter');
		h.nav = h.bind(void 0, 'nav');
		h.noscript = h.bind(void 0, 'noscript');
		h.object = h.bind(void 0, 'object');
		h.ol = h.bind(void 0, 'ol');
		h.optgroup = h.bind(void 0, 'optgroup');
		h.option = h.bind(void 0, 'option');
		h.output = h.bind(void 0, 'output');
		h.p = h.bind(void 0, 'p');
		h.param = h.bind(void 0, 'param');
		h.pre = h.bind(void 0, 'pre');
		h.progress = h.bind(void 0, 'progress');
		h.q = h.bind(void 0, 'q');
		h.rp = h.bind(void 0, 'rp');
		h.rt = h.bind(void 0, 'rt');
		h.ruby = h.bind(void 0, 'ruby');
		h.s = h.bind(void 0, 's');
		h.samp = h.bind(void 0, 'samp');
		h.section = h.bind(void 0, 'section');
		h.select = h.bind(void 0, 'select');
		h.small = h.bind(void 0, 'small');
		h.source = h.bind(void 0, 'source');
		h.span = h.bind(void 0, 'span');
		h.strong = h.bind(void 0, 'strong');
		h.sub = h.bind(void 0, 'sub');
		h.summary = h.bind(void 0, 'summary');
		h.sup = h.bind(void 0, 'sup');
		h.table = h.bind(void 0, 'table');
		h.tbody = h.bind(void 0, 'tbody');
		h.td = h.bind(void 0, 'td');
		h.textarea = h.bind(void 0, 'textarea');
		h.tfoot = h.bind(void 0, 'tfoot');
		h.th = h.bind(void 0, 'th');
		h.thead = h.bind(void 0, 'thead');
		h.time = h.bind(void 0, 'time');
		h.title = h.bind(void 0, 'title');
		h.tr = h.bind(void 0, 'tr');
		h.track = h.bind(void 0, 'track');
		h.u = h.bind(void 0, 'u');
		h.ul = h.bind(void 0, 'ul');
		h.var_ = h.bind(void 0, 'var');
		h.video = h.bind(void 0, 'video');
		h.wbr = h.bind(void 0, 'wbr');
	})(h = exports.h || (exports.h = {}));
	function realize(content) {
		return Private.realizeImpl(content);
	}
	exports.realize = realize;
	function render(content, host) {
		Private.renderImpl(content, host);
	}
	exports.render = render;
	var Private;
	(function (Private) {
		function createTextVNode(text) {
			return new VNode('text', text, emptyObject, emptyArray);
		}
		Private.createTextVNode = createTextVNode;
		function createElementVNode(tag, attrs, children) {
			attrs = attrs || emptyObject;
			children = children || emptyArray;
			return new VNode('element', tag, attrs, children);
		}
		Private.createElementVNode = createElementVNode;
		function realizeImpl(content) {
			return createDOMNode(content);
		}
		Private.realizeImpl = realizeImpl;
		function renderImpl(content, host) {
			var oldContent = hostMap.get(host) || emptyArray;
			var newContent = asVNodeArray(content);
			hostMap.set(host, newContent);
			updateContent(host, oldContent, newContent);
		}
		Private.renderImpl = renderImpl;
		var emptyArray = Object.freeze([]);
		var emptyObject = Object.freeze({});
		var hostMap = new WeakMap();
		function asVNodeArray(content) {
			if (content instanceof Array) {
				return content;
			}
			if (content) {
				return [content];
			}
			return emptyArray;
		}
		function updateContent(host, oldContent, newContent) {
			if (oldContent === newContent) {
				return;
			}
			var oldKeyed = collectKeys(host, oldContent);
			var oldCopy = oldContent.slice();
			var currNode = host.firstChild;
			var newCount = newContent.length;
			for (var i = 0; i < newCount; ++i) {
				if (i >= oldCopy.length) {
					host.appendChild(createDOMNode(newContent[i]));
					continue;
				}
				var oldVNode = oldCopy[i];
				var newVNode = newContent[i];
				var newKey = newVNode.attrs.key;
				if (newKey && newKey in oldKeyed) {
					var pair = oldKeyed[newKey];
					if (pair.vNode !== oldVNode) {
						arrayMove(oldCopy, oldCopy.indexOf(pair.vNode), i);
						host.insertBefore(pair.element, currNode);
						oldVNode = pair.vNode;
						currNode = pair.element;
					}
				}
				if (oldVNode === newVNode) {
					currNode = currNode.nextSibling;
					continue;
				}
				var oldKey = oldVNode.attrs.key;
				if (oldKey && oldKey !== newKey) {
					arrayInsert(oldCopy, i, newVNode);
					host.insertBefore(createDOMNode(newVNode), currNode);
					continue;
				}
				if (oldVNode.type !== newVNode.type) {
					arrayInsert(oldCopy, i, newVNode);
					host.insertBefore(createDOMNode(newVNode), currNode);
					continue;
				}
				if (newVNode.type === 'text') {
					currNode.textContent = newVNode.tag;
					currNode = currNode.nextSibling;
					continue;
				}
				if (oldVNode.tag !== newVNode.tag) {
					arrayInsert(oldCopy, i, newVNode);
					host.insertBefore(createDOMNode(newVNode), currNode);
					continue;
				}
				updateAttrs(currNode, oldVNode.attrs, newVNode.attrs);
				updateContent(currNode, oldVNode.children, newVNode.children);
				currNode = currNode.nextSibling;
			}
			for (var i = oldCopy.length - 1; i >= newCount; --i) {
				host.removeChild(host.lastChild);
			}
		}
		function addAttrs(node, attrs) {
			for (var name_1 in attrs) {
				var mode = attrModeTable[name_1];
				if (mode === 0  || mode === 2 ) {
					node[name_1] = attrs[name_1];
				}
				else if (mode === 1 ) {
					node.setAttribute(name_1.toLowerCase(), attrs[name_1]);
				}
			}
			var dataset = attrs.dataset;
			if (dataset) {
				for (var name_2 in dataset) {
					node.setAttribute("data-" + name_2, dataset[name_2]);
				}
			}
			var styles = attrs.style;
			if (styles) {
				var nodeStyle = node.style;
				for (var name_3 in styles) {
					nodeStyle[name_3] = styles[name_3];
				}
			}
		}
		function updateAttrs(node, oldAttrs, newAttrs) {
			if (oldAttrs === newAttrs) {
				return;
			}
			for (var name_4 in oldAttrs) {
				if (!(name_4 in newAttrs)) {
					var mode = attrModeTable[name_4];
					if (mode === 0 ) {
						node.removeAttribute(name_4);
					}
					else if (mode === 1 ) {
						node.removeAttribute(name_4.toLowerCase());
					}
					else if (mode === 2 ) {
						node[name_4] = null;
					}
				}
			}
			for (var name_5 in newAttrs) {
				var value = newAttrs[name_5];
				if (oldAttrs[name_5] !== value) {
					var mode = attrModeTable[name_5];
					if (mode === 0  || mode === 2 ) {
						node[name_5] = value;
					}
					else if (mode === 1 ) {
						node.setAttribute(name_5.toLowerCase(), value);
					}
				}
			}
			var oldDataset = oldAttrs.dataset || emptyObject;
			var newDataset = newAttrs.dataset || emptyObject;
			if (oldDataset !== newDataset) {
				for (var name_6 in oldDataset) {
					if (!(name_6 in newDataset)) {
						node.removeAttribute('data-' + name_6);
					}
				}
				for (var name_7 in newDataset) {
					var value = newDataset[name_7];
					if (oldDataset[name_7] !== value) {
						node.setAttribute('data-' + name_7, value);
					}
				}
			}
			var oldStyle = oldAttrs.style || emptyObject;
			var newStyle = newAttrs.style || emptyObject;
			if (oldStyle !== newStyle) {
				var nodeStyle = node.style;
				for (var name_8 in oldStyle) {
					if (!(name_8 in newStyle)) {
						nodeStyle[name_8] = '';
					}
				}
				for (var name_9 in newStyle) {
					var value = newStyle[name_9];
					if (oldStyle[name_9] !== value) {
						nodeStyle[name_9] = value;
					}
				}
			}
		}
		function collectKeys(host, content) {
			var node = host.firstChild;
			var keyed = Object.create(null);
			for (var i = 0, n = content.length; i < n; ++i) {
				var vNode = content[i];
				if (vNode.type === 'element') {
					var key = vNode.attrs.key;
					if (key)
						keyed[key] = { vNode: vNode, element: node };
				}
				node = node.nextSibling;
			}
			return keyed;
		}
		function createDOMNode(elem) {
			var node;
			if (elem.type === 'text') {
				node = document.createTextNode(elem.tag);
			}
			else {
				node = document.createElement(elem.tag);
				addAttrs(node, elem.attrs);
				addContent(node, elem.children);
			}
			return node;
		}
		function addContent(node, content) {
			for (var i = 0, n = content.length; i < n; ++i) {
				node.appendChild(createDOMNode(content[i]));
			}
		}
		var attrModeTable = {
			accept: 0 ,
			acceptCharset: 0 ,
			accessKey: 0 ,
			action: 0 ,
			allowFullscreen: 1 ,
			alt: 0 ,
			autocomplete: 0 ,
			autofocus: 0 ,
			autoplay: 0 ,
			checked: 0 ,
			cite: 0 ,
			className: 0 ,
			colSpan: 0 ,
			cols: 0 ,
			contentEditable: 0 ,
			controls: 0 ,
			coords: 0 ,
			crossOrigin: 0 ,
			data: 0 ,
			dateTime: 0 ,
			default: 0 ,
			dir: 0 ,
			dirName: 0 ,
			disabled: 0 ,
			download: 0 ,
			draggable: 0 ,
			enctype: 0 ,
			form: 1 ,
			formAction: 0 ,
			formEnctype: 0 ,
			formMethod: 0 ,
			formNoValidate: 0 ,
			formTarget: 0 ,
			headers: 0 ,
			height: 0 ,
			hidden: 0 ,
			high: 0 ,
			href: 0 ,
			hreflang: 0 ,
			htmlFor: 0 ,
			id: 0 ,
			inputMode: 0 ,
			isMap: 0 ,
			kind: 0 ,
			label: 0 ,
			lang: 0 ,
			list: 1 ,
			loop: 0 ,
			low: 0 ,
			max: 0 ,
			maxLength: 0 ,
			media: 1 ,
			mediaGroup: 0 ,
			method: 0 ,
			min: 0 ,
			minLength: 0 ,
			multiple: 0 ,
			muted: 0 ,
			name: 0 ,
			noValidate: 0 ,
			optimum: 0 ,
			pattern: 0 ,
			placeholder: 0 ,
			poster: 0 ,
			preload: 0 ,
			readOnly: 0 ,
			rel: 0 ,
			required: 0 ,
			reversed: 0 ,
			rowSpan: 0 ,
			rows: 0 ,
			sandbox: 0 ,
			scope: 0 ,
			seamless: 1 ,
			selected: 0 ,
			shape: 0 ,
			size: 0 ,
			sizes: 1 ,
			sorted: 0 ,
			span: 0 ,
			spellcheck: 0 ,
			src: 0 ,
			srcdoc: 0 ,
			srclang: 0 ,
			srcset: 1 ,
			start: 0 ,
			step: 0 ,
			tabIndex: 0 ,
			target: 0 ,
			title: 0 ,
			type: 0 ,
			typeMustMatch: 0 ,
			useMap: 0 ,
			value: 0 ,
			volume: 0 ,
			width: 0 ,
			wrap: 0 ,
			onabort: 2 ,
			onbeforecopy: 2 ,
			onbeforecut: 2 ,
			onbeforepaste: 2 ,
			onblur: 2 ,
			oncanplay: 2 ,
			oncanplaythrough: 2 ,
			onchange: 2 ,
			onclick: 2 ,
			oncontextmenu: 2 ,
			oncopy: 2 ,
			oncuechange: 2 ,
			oncut: 2 ,
			ondblclick: 2 ,
			ondrag: 2 ,
			ondragend: 2 ,
			ondragenter: 2 ,
			ondragleave: 2 ,
			ondragover: 2 ,
			ondragstart: 2 ,
			ondrop: 2 ,
			ondurationchange: 2 ,
			onended: 2 ,
			onemptied: 2 ,
			onerror: 2 ,
			onfocus: 2 ,
			onhelp: 2 ,
			oninput: 2 ,
			onkeydown: 2 ,
			onkeypress: 2 ,
			onkeyup: 2 ,
			onload: 2 ,
			onloadeddata: 2 ,
			onloadedmetadata: 2 ,
			onloadstart: 2 ,
			onmousedown: 2 ,
			onmouseenter: 2 ,
			onmouseleave: 2 ,
			onmousemove: 2 ,
			onmouseout: 2 ,
			onmouseover: 2 ,
			onmouseup: 2 ,
			onmousewheel: 2 ,
			onpaste: 2 ,
			onpause: 2 ,
			onplay: 2 ,
			onplaying: 2 ,
			onprogress: 2 ,
			onratechange: 2 ,
			onreadystatechange: 2 ,
			onreset: 2 ,
			onscroll: 2 ,
			onseeked: 2 ,
			onseeking: 2 ,
			onselect: 2 ,
			onselectstart: 2 ,
			onstalled: 2 ,
			onsubmit: 2 ,
			onsuspend: 2 ,
			ontimeupdate: 2 ,
			onvolumechange: 2 ,
			onwaiting: 2
		};
		function arrayInsert(array, i, value) {
			for (var k = array.length; k > i; --k) {
				array[k] = array[k - 1];
			}
			array[i] = value;
		}
		function arrayMove(array, i, j) {
			if (i === j) {
				return;
			}
			var value = array[i];
			var d = i < j ? 1 : -1;
			for (var k = i; k !== j; k += d) {
				array[k] = array[k + d];
			}
			array[j] = value;
		}
	})(Private || (Private = {}));
},
function(module, exports, __webpack_require__) {
	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
		for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
		function __() { this.constructor = d; }
		d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var searching_1 = __webpack_require__(21);
	var vector_1 = __webpack_require__(23);
	var messaging_1 = __webpack_require__(3);
	var signaling_1 = __webpack_require__(9);
	var query_1 = __webpack_require__(14);
	var sizing_1 = __webpack_require__(16);
	var keymap_1 = __webpack_require__(19);
	var widget_1 = __webpack_require__(25);
	var MENU_CLASS = 'p-Menu';
	var CONTENT_CLASS = 'p-Menu-content';
	var ITEM_CLASS = 'p-Menu-item';
	var ICON_CLASS = 'p-Menu-itemIcon';
	var LABEL_CLASS = 'p-Menu-itemLabel';
	var MNEMONIC_CLASS = 'p-Menu-itemMnemonic';
	var SHORTCUT_CLASS = 'p-Menu-itemShortcut';
	var SUBMENU_ICON_CLASS = 'p-Menu-itemSubmenuIcon';
	var COMMAND_TYPE_CLASS = 'p-type-command';
	var SEPARATOR_TYPE_CLASS = 'p-type-separator';
	var SUBMENU_TYPE_CLASS = 'p-type-submenu';
	var ACTIVE_CLASS = 'p-mod-active';
	var DISABLED_CLASS = 'p-mod-disabled';
	var TOGGLED_CLASS = 'p-mod-toggled';
	var HIDDEN_CLASS = 'p-mod-hidden';
	var TIMER_DELAY = 300;
	var SUBMENU_OVERLAP = 3;
	var Menu = (function (_super) {
		__extends(Menu, _super);
		function Menu(options) {
			_super.call(this, { node: Private.createNode() });
			this._childIndex = -1;
			this._openTimerID = 0;
			this._closeTimerID = 0;
			this._activeIndex = -1;
			this._childMenu = null;
			this._parentMenu = null;
			this._items = new vector_1.Vector();
			this._nodes = new vector_1.Vector();
			this.addClass(MENU_CLASS);
			this.setFlag(widget_1.WidgetFlag.DisallowLayout);
			this._keymap = options.keymap;
			this._commands = options.commands;
			this._renderer = options.renderer || Menu.defaultRenderer;
		}
		Menu.prototype.dispose = function () {
			this.close();
			this._items.clear();
			this._nodes.clear();
			this._keymap = null;
			this._commands = null;
			this._renderer = null;
			_super.prototype.dispose.call(this);
		};
		Object.defineProperty(Menu.prototype, "parentMenu", {
			get: function () {
				return this._parentMenu;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Menu.prototype, "childMenu", {
			get: function () {
				return this._childMenu;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Menu.prototype, "rootMenu", {
			get: function () {
				var menu = this;
				while (menu._parentMenu) {
					menu = menu._parentMenu;
				}
				return menu;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Menu.prototype, "leafMenu", {
			get: function () {
				var menu = this;
				while (menu._childMenu) {
					menu = menu._childMenu;
				}
				return menu;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Menu.prototype, "contentNode", {
			get: function () {
				return this.node.getElementsByClassName(CONTENT_CLASS)[0];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Menu.prototype, "commands", {
			get: function () {
				return this._commands;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Menu.prototype, "keymap", {
			get: function () {
				return this._keymap;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Menu.prototype, "renderer", {
			get: function () {
				return this._renderer;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Menu.prototype, "items", {
			get: function () {
				return this._items;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Menu.prototype, "activeItem", {
			get: function () {
				var i = this._activeIndex;
				return i !== -1 ? this._items.at(i) : null;
			},
			set: function (value) {
				this.activeIndex = searching_1.indexOf(this._items, value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Menu.prototype, "activeIndex", {
			get: function () {
				return this._activeIndex;
			},
			set: function (value) {
				var i = Math.floor(value);
				if (i < 0 || i >= this._items.length) {
					i = -1;
				}
				if (i !== -1) {
					var item = this._items.at(i);
					if (item.type === 'separator' || !item.isEnabled || !item.isVisible) {
						i = -1;
					}
				}
				if (this._activeIndex === i) {
					return;
				}
				if (this._activeIndex !== -1) {
					var node = this._nodes.at(this._activeIndex);
					node.classList.remove(ACTIVE_CLASS);
				}
				if (i !== -1) {
					var node = this._nodes.at(i);
					node.classList.add(ACTIVE_CLASS);
				}
				this._activeIndex = i;
			},
			enumerable: true,
			configurable: true
		});
		Menu.prototype.activateNextItem = function () {
			var n = this._items.length;
			var j = this._activeIndex + 1;
			for (var i = 0; i < n; ++i) {
				var k = (i + j) % n;
				var item = this._items.at(k);
				if (item.type !== 'separator' && item.isEnabled && item.isVisible) {
					this.activeIndex = k;
					return;
				}
			}
			this.activeIndex = -1;
		};
		Menu.prototype.activatePreviousItem = function () {
			var n = this._items.length;
			var ai = this._activeIndex;
			var j = ai <= 0 ? n - 1 : ai - 1;
			for (var i = 0; i < n; ++i) {
				var k = (j - i + n) % n;
				var item = this._items.at(k);
				if (item.type !== 'separator' && item.isEnabled && item.isVisible) {
					this.activeIndex = k;
					return;
				}
			}
			this.activeIndex = -1;
		};
		Menu.prototype.triggerActiveItem = function () {
			if (!this.isAttached) {
				return;
			}
			var item = this.activeItem;
			if (!item) {
				return;
			}
			this._cancelOpenTimer();
			this._cancelCloseTimer();
			if (item.type === 'submenu') {
				this._openChildMenu(true);
				return;
			}
			this.rootMenu.close();
			var command = item.command, args = item.args;
			if (this._commands.isEnabled(command, args)) {
				this._commands.execute(command, args);
			}
			else {
				console.log("Command '" + command + "' is disabled.");
			}
		};
		Menu.prototype.addItem = function (options) {
			return this.insertItem(this._items.length, options);
		};
		Menu.prototype.insertItem = function (index, options) {
			if (this.isAttached) {
				this.close();
			}
			this.activeIndex = -1;
			var i = Math.max(0, Math.min(Math.floor(index), this._items.length));
			var item = Private.createItem(this._commands, this._keymap, options);
			var node = this._renderer.createItemNode();
			this._items.insert(i, item);
			this._nodes.insert(i, node);
			var ref = i + 1 < this._nodes.length ? this._nodes.at(i + 1) : null;
			this.contentNode.insertBefore(node, ref);
			return item;
		};
		Menu.prototype.removeItem = function (item) {
			var index = searching_1.indexOf(this._items, item);
			if (index !== -1)
				this.removeItemAt(index);
			return index;
		};
		Menu.prototype.removeItemAt = function (index) {
			var i = Math.floor(index);
			if (i < 0 || i >= this._items.length) {
				return null;
			}
			if (this.isAttached) {
				this.close();
			}
			this.activeIndex = -1;
			var node = this._nodes.removeAt(i);
			var item = this._items.removeAt(i);
			this.contentNode.removeChild(node);
			return item;
		};
		Menu.prototype.clearItems = function () {
			if (this.isAttached) {
				this.close();
			}
			this.activeIndex = -1;
			this._items.clear();
			this._nodes.clear();
			this.contentNode.textContent = '';
		};
		Menu.prototype.open = function (x, y, options) {
			if (options === void 0) { options = {}; }
			if (this.isAttached) {
				return;
			}
			var forceX = options.forceX || false;
			var forceY = options.forceY || false;
			Private.openRootMenu(this, x, y, forceX, forceY);
			this.activate();
		};
		Menu.prototype.handleEvent = function (event) {
			switch (event.type) {
				case 'keydown':
					this._evtKeyDown(event);
					break;
				case 'mouseup':
					this._evtMouseUp(event);
					break;
				case 'mousemove':
					this._evtMouseMove(event);
					break;
				case 'mouseenter':
					this._evtMouseEnter(event);
					break;
				case 'mouseleave':
					this._evtMouseLeave(event);
					break;
				case 'mousedown':
					this._evtMouseDown(event);
					break;
				case 'contextmenu':
					event.preventDefault();
					event.stopPropagation();
					break;
			}
		};
		Menu.prototype.onAfterAttach = function (msg) {
			this.node.addEventListener('keydown', this);
			this.node.addEventListener('mouseup', this);
			this.node.addEventListener('mousemove', this);
			this.node.addEventListener('mouseenter', this);
			this.node.addEventListener('mouseleave', this);
			this.node.addEventListener('contextmenu', this);
			document.addEventListener('mousedown', this, true);
		};
		Menu.prototype.onBeforeDetach = function (msg) {
			this.node.removeEventListener('keydown', this);
			this.node.removeEventListener('mouseup', this);
			this.node.removeEventListener('mousemove', this);
			this.node.removeEventListener('mouseenter', this);
			this.node.removeEventListener('mouseleave', this);
			this.node.removeEventListener('contextmenu', this);
			document.removeEventListener('mousedown', this, true);
		};
		Menu.prototype.onActivateRequest = function (msg) {
			if (this.isAttached)
				this.node.focus();
		};
		Menu.prototype.onUpdateRequest = function (msg) {
			var items = this._items;
			var nodes = this._nodes;
			var renderer = this._renderer;
			for (var i = 0, n = items.length; i < n; ++i) {
				renderer.updateItemNode(nodes.at(i), items.at(i));
			}
			if (this._activeIndex !== -1) {
				nodes.at(this._activeIndex).classList.add(ACTIVE_CLASS);
			}
			Private.hideExtraSeparators(nodes, items);
		};
		Menu.prototype.onCloseRequest = function (msg) {
			this._cancelOpenTimer();
			this._cancelCloseTimer();
			this.activeIndex = -1;
			var childMenu = this._childMenu;
			if (childMenu) {
				this._childIndex = -1;
				this._childMenu = null;
				childMenu._parentMenu = null;
				childMenu.close();
			}
			var parentMenu = this._parentMenu;
			if (parentMenu) {
				this._parentMenu = null;
				parentMenu._cancelOpenTimer();
				parentMenu._cancelCloseTimer();
				parentMenu._childIndex = -1;
				parentMenu._childMenu = null;
				parentMenu.activate();
			}
			if (this.isAttached) {
				this.aboutToClose.emit(void 0);
			}
			_super.prototype.onCloseRequest.call(this, msg);
		};
		Menu.prototype._evtKeyDown = function (event) {
			event.preventDefault();
			event.stopPropagation();
			var kc = event.keyCode;
			if (kc === 13) {
				this.triggerActiveItem();
				return;
			}
			if (kc === 27) {
				this.close();
				return;
			}
			if (kc === 37) {
				if (this._parentMenu) {
					this.close();
				}
				else {
					this.menuRequested.emit('previous');
				}
				return;
			}
			if (kc === 38) {
				this.activatePreviousItem();
				return;
			}
			if (kc === 39) {
				var item = this.activeItem;
				if (item && item.type === 'submenu') {
					this.triggerActiveItem();
				}
				else {
					this.rootMenu.menuRequested.emit('next');
				}
				return;
			}
			if (kc === 40) {
				this.activateNextItem();
				return;
			}
			var key = this._keymap.layout.keyForKeydownEvent(event);
			if (!key) {
				return;
			}
			key = key.toUpperCase();
			var mnIndex = -1;
			var autoIndex = -1;
			var mnMultiple = false;
			var n = this._items.length;
			var j = this._activeIndex + 1;
			for (var i = 0; i < n; ++i) {
				var k = (i + j) % n;
				var item = this._items.at(k);
				if (item.type === 'separator' || !item.isEnabled || !item.isVisible) {
					continue;
				}
				var label = item.label;
				if (label.length === 0) {
					continue;
				}
				var mn = item.mnemonic;
				if (mn >= 0 && mn < label.length) {
					if (label[mn].toUpperCase() === key) {
						if (mnIndex === -1) {
							mnIndex = k;
						}
						else {
							mnMultiple = true;
						}
					}
				}
				else if (autoIndex === -1) {
					if (label[0].toUpperCase() === key) {
						autoIndex = k;
					}
				}
			}
			if (mnIndex !== -1 && !mnMultiple) {
				this.activeIndex = mnIndex;
				this.triggerActiveItem();
			}
			else if (mnIndex !== -1) {
				this.activeIndex = mnIndex;
			}
			else if (autoIndex !== -1) {
				this.activeIndex = autoIndex;
			}
		};
		Menu.prototype._evtMouseUp = function (event) {
			if (event.button !== 0) {
				return;
			}
			event.preventDefault();
			event.stopPropagation();
			this.triggerActiveItem();
		};
		Menu.prototype._evtMouseMove = function (event) {
			var x = event.clientX;
			var y = event.clientY;
			var i = searching_1.findIndex(this._nodes, function (node) { return query_1.hitTest(node, x, y); });
			if (i === this._activeIndex) {
				return;
			}
			this.activeIndex = i;
			i = this.activeIndex;
			if (i === this._childIndex) {
				this._cancelOpenTimer();
				this._cancelCloseTimer();
				return;
			}
			if (this._childIndex !== -1) {
				this._startCloseTimer();
			}
			this._cancelOpenTimer();
			var item = this.activeItem;
			if (!item || item.type !== 'submenu' || !item.menu) {
				return;
			}
			this._startOpenTimer();
		};
		Menu.prototype._evtMouseEnter = function (event) {
			for (var menu = this._parentMenu; menu; menu = menu._parentMenu) {
				menu._cancelOpenTimer();
				menu._cancelCloseTimer();
				menu.activeIndex = menu._childIndex;
			}
		};
		Menu.prototype._evtMouseLeave = function (event) {
			this._cancelOpenTimer();
			if (!this._childMenu) {
				this.activeIndex = -1;
				return;
			}
			if (query_1.hitTest(this._childMenu.node, event.clientX, event.clientY)) {
				this._cancelCloseTimer();
				return;
			}
			this.activeIndex = -1;
			this._startCloseTimer();
		};
		Menu.prototype._evtMouseDown = function (event) {
			if (this._parentMenu) {
				return;
			}
			if (Private.hitTestMenus(this, event.clientX, event.clientY)) {
				event.preventDefault();
				event.stopPropagation();
			}
			else {
				this.close();
			}
		};
		Menu.prototype._openChildMenu = function (activateFirst) {
			if (activateFirst === void 0) { activateFirst = false; }
			var item = this.activeItem;
			if (!item || item.type !== 'submenu' || !item.menu) {
				this._closeChildMenu();
				return;
			}
			var menu = item.menu;
			if (menu === this._childMenu) {
				return;
			}
			this._closeChildMenu();
			this._childMenu = menu;
			this._childIndex = this._activeIndex;
			menu._parentMenu = this;
			Private.openSubmenu(menu, this._nodes.at(this._activeIndex));
			if (activateFirst) {
				menu.activeIndex = -1;
				menu.activateNextItem();
			}
			menu.activate();
		};
		Menu.prototype._closeChildMenu = function () {
			if (this._childMenu) {
				this._childMenu.close();
			}
		};
		Menu.prototype._startOpenTimer = function () {
			var _this = this;
			if (this._openTimerID === 0) {
				this._openTimerID = setTimeout(function () {
					_this._openTimerID = 0;
					_this._openChildMenu();
				}, TIMER_DELAY);
			}
		};
		Menu.prototype._startCloseTimer = function () {
			var _this = this;
			if (this._closeTimerID === 0) {
				this._closeTimerID = setTimeout(function () {
					_this._closeTimerID = 0;
					_this._closeChildMenu();
				}, TIMER_DELAY);
			}
		};
		Menu.prototype._cancelOpenTimer = function () {
			if (this._openTimerID !== 0) {
				clearTimeout(this._openTimerID);
				this._openTimerID = 0;
			}
		};
		Menu.prototype._cancelCloseTimer = function () {
			if (this._closeTimerID !== 0) {
				clearTimeout(this._closeTimerID);
				this._closeTimerID = 0;
			}
		};
		return Menu;
	}(widget_1.Widget));
	exports.Menu = Menu;
	signaling_1.defineSignal(Menu.prototype, 'aboutToClose');
	signaling_1.defineSignal(Menu.prototype, 'menuRequested');
	var Menu;
	(function (Menu) {
		var Renderer = (function () {
			function Renderer() {
			}
			Renderer.prototype.createItemNode = function () {
				var node = document.createElement('li');
				var icon = document.createElement('div');
				var label = document.createElement('div');
				var shortcut = document.createElement('div');
				var submenu = document.createElement('div');
				node.className = ITEM_CLASS;
				icon.className = ICON_CLASS;
				label.className = LABEL_CLASS;
				shortcut.className = SHORTCUT_CLASS;
				submenu.className = SUBMENU_ICON_CLASS;
				node.appendChild(icon);
				node.appendChild(label);
				node.appendChild(shortcut);
				node.appendChild(submenu);
				return node;
			};
			Renderer.prototype.updateItemNode = function (node, item) {
				var itemClass = ITEM_CLASS;
				switch (item.type) {
					case 'command':
						itemClass += " " + COMMAND_TYPE_CLASS;
						break;
					case 'submenu':
						itemClass += " " + SUBMENU_TYPE_CLASS;
						break;
					case 'separator':
						itemClass += " " + SEPARATOR_TYPE_CLASS;
						break;
				}
				if (!item.isEnabled) {
					itemClass += " " + DISABLED_CLASS;
				}
				if (item.isToggled) {
					itemClass += " " + TOGGLED_CLASS;
				}
				if (!item.isVisible) {
					itemClass += " " + HIDDEN_CLASS;
				}
				var extraItemClass = item.className;
				if (extraItemClass) {
					itemClass += " " + extraItemClass;
				}
				var iconClass = ICON_CLASS;
				var extraIconClass = item.icon;
				if (extraIconClass) {
					iconClass += " " + extraIconClass;
				}
				var labelHTML = this.formatLabel(item.label, item.mnemonic);
				var shortcutText = this.formatShortcut(item.keyBinding);
				var icon = node.firstChild;
				var label = icon.nextSibling;
				var shortcut = label.nextSibling;
				if (item.type === 'command') {
					node.setAttribute('data-command', item.command);
				}
				else {
					node.removeAttribute('data-command');
				}
				node.title = item.caption;
				node.className = itemClass;
				icon.className = iconClass;
				label.innerHTML = labelHTML;
				shortcut.textContent = shortcutText;
			};
			Renderer.prototype.formatLabel = function (label, mnemonic) {
				if (mnemonic < 0 || mnemonic >= label.length) {
					return label;
				}
				var pref = label.slice(0, mnemonic);
				var suff = label.slice(mnemonic + 1);
				var char = label[mnemonic];
				return pref + "<span class=\"" + MNEMONIC_CLASS + "\">" + char + "</span>" + suff;
			};
			Renderer.prototype.formatShortcut = function (binding) {
				return binding ? binding.keys.map(keymap_1.Keymap.formatKeystroke).join(' ') : '';
			};
			return Renderer;
		}());
		Menu.Renderer = Renderer;
		Menu.defaultRenderer = new Renderer();
	})(Menu = exports.Menu || (exports.Menu = {}));
	var Private;
	(function (Private) {
		function createNode() {
			var node = document.createElement('div');
			var content = document.createElement('ul');
			content.className = CONTENT_CLASS;
			node.appendChild(content);
			node.tabIndex = -1;
			return node;
		}
		Private.createNode = createNode;
		function createItem(commands, keymap, options) {
			return new MenuItem(commands, keymap, options);
		}
		Private.createItem = createItem;
		function hitTestMenus(menu, x, y) {
			for (; menu; menu = menu.childMenu) {
				if (query_1.hitTest(menu.node, x, y))
					return true;
			}
			return false;
		}
		Private.hitTestMenus = hitTestMenus;
		function hideExtraSeparators(nodes, items) {
			var k1 = 0;
			var n = items.length;
			for (; k1 < n; ++k1) {
				var item = items.at(k1);
				if (!item.isVisible) {
					continue;
				}
				if (item.type !== 'separator') {
					break;
				}
				nodes.at(k1).classList.add(HIDDEN_CLASS);
			}
			var k2 = n - 1;
			for (; k2 >= 0; --k2) {
				var item = items.at(k2);
				if (!item.isVisible) {
					continue;
				}
				if (item.type !== 'separator') {
					break;
				}
				nodes.at(k2).classList.add(HIDDEN_CLASS);
			}
			var hide = false;
			while (++k1 < k2) {
				var item = items.at(k1);
				if (!item.isVisible) {
					continue;
				}
				if (item.type !== 'separator') {
					hide = false;
				}
				else if (hide) {
					nodes.at(k1).classList.add(HIDDEN_CLASS);
				}
				else {
					hide = true;
				}
			}
		}
		Private.hideExtraSeparators = hideExtraSeparators;
		function openRootMenu(menu, x, y, forceX, forceY) {
			messaging_1.sendMessage(menu, widget_1.WidgetMessage.UpdateRequest);
			var px = window.pageXOffset;
			var py = window.pageYOffset;
			var cw = document.documentElement.clientWidth;
			var ch = document.documentElement.clientHeight;
			var maxHeight = ch - (forceY ? y : 0);
			var node = menu.node;
			var style = node.style;
			style.top = '';
			style.left = '';
			style.width = '';
			style.height = '';
			style.visibility = 'hidden';
			style.maxHeight = maxHeight + "px";
			widget_1.Widget.attach(menu, document.body);
			if (node.scrollHeight > maxHeight) {
				style.width = (2 * node.offsetWidth - node.clientWidth) + "px";
			}
			var _a = node.getBoundingClientRect(), width = _a.width, height = _a.height;
			if (!forceX && (x + width > px + cw)) {
				x = px + cw - width;
			}
			if (!forceY && (y + height > py + ch)) {
				if (y > py + ch) {
					y = py + ch - height;
				}
				else {
					y = y - height;
				}
			}
			style.top = Math.max(0, y) + "px";
			style.left = Math.max(0, x) + "px";
			style.visibility = '';
		}
		Private.openRootMenu = openRootMenu;
		function openSubmenu(menu, itemNode) {
			messaging_1.sendMessage(menu, widget_1.WidgetMessage.UpdateRequest);
			var px = window.pageXOffset;
			var py = window.pageYOffset;
			var cw = document.documentElement.clientWidth;
			var ch = document.documentElement.clientHeight;
			var maxHeight = ch;
			var node = menu.node;
			var style = node.style;
			style.top = '';
			style.left = '';
			style.width = '';
			style.height = '';
			style.visibility = 'hidden';
			style.maxHeight = maxHeight + "px";
			widget_1.Widget.attach(menu, document.body);
			if (node.scrollHeight > maxHeight) {
				style.width = (2 * node.offsetWidth - node.clientWidth) + "px";
			}
			var _a = node.getBoundingClientRect(), width = _a.width, height = _a.height;
			var box = sizing_1.boxSizing(menu.node);
			var itemRect = itemNode.getBoundingClientRect();
			var x = itemRect.right - SUBMENU_OVERLAP;
			if (x + width > px + cw) {
				x = itemRect.left + SUBMENU_OVERLAP - width;
			}
			var y = itemRect.top - box.borderTop - box.paddingTop;
			if (y + height > py + ch) {
				y = itemRect.bottom + box.borderBottom + box.paddingBottom - height;
			}
			style.top = Math.max(0, y) + "px";
			style.left = Math.max(0, x) + "px";
			style.visibility = '';
		}
		Private.openSubmenu = openSubmenu;
		var MenuItem = (function () {
			function MenuItem(commands, keymap, options) {
				this._commands = commands;
				this._keymap = keymap;
				this._type = options.type || 'command';
				this._command = options.command || '';
				this._args = options.args || null;
				this._menu = options.menu || null;
			}
			Object.defineProperty(MenuItem.prototype, "type", {
				get: function () {
					return this._type;
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(MenuItem.prototype, "command", {
				get: function () {
					return this._command;
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(MenuItem.prototype, "args", {
				get: function () {
					return this._args;
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(MenuItem.prototype, "menu", {
				get: function () {
					return this._menu;
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(MenuItem.prototype, "label", {
				get: function () {
					if (this._type === 'command') {
						return this._commands.label(this._command, this._args);
					}
					if (this._type === 'submenu' && this._menu) {
						return this._menu.title.label;
					}
					return '';
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(MenuItem.prototype, "mnemonic", {
				get: function () {
					if (this._type === 'command') {
						return this._commands.mnemonic(this._command, this._args);
					}
					if (this._type === 'submenu' && this._menu) {
						return this._menu.title.mnemonic;
					}
					return -1;
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(MenuItem.prototype, "icon", {
				get: function () {
					if (this._type === 'command') {
						return this._commands.icon(this._command, this._args);
					}
					if (this._type === 'submenu' && this._menu) {
						return this._menu.title.icon;
					}
					return '';
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(MenuItem.prototype, "caption", {
				get: function () {
					if (this._type === 'command') {
						return this._commands.caption(this._command, this._args);
					}
					if (this._type === 'submenu' && this._menu) {
						return this._menu.title.caption;
					}
					return '';
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(MenuItem.prototype, "className", {
				get: function () {
					if (this._type === 'command') {
						return this._commands.className(this._command, this._args);
					}
					if (this._type === 'submenu' && this._menu) {
						return this._menu.title.className;
					}
					return '';
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(MenuItem.prototype, "isEnabled", {
				get: function () {
					if (this._type === 'command') {
						return this._commands.isEnabled(this._command, this._args);
					}
					if (this._type === 'submenu') {
						return this._menu !== null;
					}
					return true;
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(MenuItem.prototype, "isToggled", {
				get: function () {
					if (this._type === 'command') {
						return this._commands.isToggled(this._command, this._args);
					}
					return false;
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(MenuItem.prototype, "isVisible", {
				get: function () {
					if (this._type === 'command') {
						return this._commands.isVisible(this._command, this._args);
					}
					if (this._type === 'submenu') {
						return this._menu !== null;
					}
					return true;
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(MenuItem.prototype, "keyBinding", {
				get: function () {
					if (this._type === 'command') {
						return this._keymap.findBinding(this._command, this._args);
					}
					return null;
				},
				enumerable: true,
				configurable: true
			});
			return MenuItem;
		}());
	})(Private || (Private = {}));
},
function(module, exports, __webpack_require__) {
	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
		for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
		function __() { this.constructor = d; }
		d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var iteration_1 = __webpack_require__(2);
	var mutation_1 = __webpack_require__(29);
	var searching_1 = __webpack_require__(21);
	var vector_1 = __webpack_require__(23);
	var query_1 = __webpack_require__(14);
	var widget_1 = __webpack_require__(25);
	var MENU_BAR_CLASS = 'p-MenuBar';
	var CONTENT_CLASS = 'p-MenuBar-content';
	var MENU_CLASS = 'p-MenuBar-menu';
	var ITEM_CLASS = 'p-MenuBar-item';
	var ICON_CLASS = 'p-MenuBar-itemIcon';
	var LABEL_CLASS = 'p-MenuBar-itemLabel';
	var MNEMONIC_CLASS = 'p-MenuBar-itemMnemonic';
	var ACTIVE_CLASS = 'p-mod-active';
	var MenuBar = (function (_super) {
		__extends(MenuBar, _super);
		function MenuBar(options) {
			_super.call(this, { node: Private.createNode() });
			this._activeIndex = -1;
			this._childMenu = null;
			this._menus = new vector_1.Vector();
			this._nodes = new vector_1.Vector();
			this.addClass(MENU_BAR_CLASS);
			this.setFlag(widget_1.WidgetFlag.DisallowLayout);
			this._keymap = options.keymap;
			this._renderer = options.renderer || MenuBar.defaultRenderer;
		}
		MenuBar.prototype.dispose = function () {
			this._closeChildMenu();
			this._menus.clear();
			this._nodes.clear();
			this._keymap = null;
			this._renderer = null;
			_super.prototype.dispose.call(this);
		};
		Object.defineProperty(MenuBar.prototype, "contentNode", {
			get: function () {
				return this.node.getElementsByClassName(CONTENT_CLASS)[0];
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(MenuBar.prototype, "keymap", {
			get: function () {
				return this._keymap;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(MenuBar.prototype, "renderer", {
			get: function () {
				return this._renderer;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(MenuBar.prototype, "menus", {
			get: function () {
				return this._menus;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(MenuBar.prototype, "childMenu", {
			get: function () {
				return this._childMenu;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(MenuBar.prototype, "activeMenu", {
			get: function () {
				var i = this._activeIndex;
				return i !== -1 ? this._menus.at(i) : null;
			},
			set: function (value) {
				this.activeIndex = searching_1.indexOf(this._menus, value);
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(MenuBar.prototype, "activeIndex", {
			get: function () {
				return this._activeIndex;
			},
			set: function (value) {
				var i = Math.floor(value);
				if (i < 0 || i >= this._menus.length) {
					i = -1;
				}
				if (this._activeIndex === i) {
					return;
				}
				if (this._activeIndex !== -1) {
					var node = this._nodes.at(this._activeIndex);
					node.classList.remove(ACTIVE_CLASS);
				}
				if (i !== -1) {
					var node = this._nodes.at(i);
					node.classList.add(ACTIVE_CLASS);
				}
				this._activeIndex = i;
			},
			enumerable: true,
			configurable: true
		});
		MenuBar.prototype.openActiveMenu = function () {
			if (this._activeIndex === -1) {
				return;
			}
			this._openChildMenu();
			if (this._childMenu) {
				this._childMenu.activeIndex = -1;
				this._childMenu.activateNextItem();
			}
		};
		MenuBar.prototype.addMenu = function (menu) {
			this.insertMenu(this._menus.length, menu);
		};
		MenuBar.prototype.insertMenu = function (index, menu) {
			this._closeChildMenu();
			var i = searching_1.indexOf(this._menus, menu);
			var j = Math.max(0, Math.min(Math.floor(index), this._menus.length));
			if (i === -1) {
				var node = this._renderer.createItemNode();
				this._renderer.updateItemNode(node, menu.title);
				this._nodes.insert(j, node);
				this._menus.insert(j, menu);
				menu.addClass(MENU_CLASS);
				var ref_1 = j + 1 < this._nodes.length ? this._nodes.at(j + 1) : null;
				this.contentNode.insertBefore(node, ref_1);
				menu.aboutToClose.connect(this._onMenuAboutToClose, this);
				menu.menuRequested.connect(this._onMenuMenuRequested, this);
				menu.title.changed.connect(this._onTitleChanged, this);
				return;
			}
			if (j === this._menus.length)
				j--;
			if (i === j)
				return;
			mutation_1.move(this._nodes, i, j);
			mutation_1.move(this._menus, i, j);
			var ref = j + 1 < this._nodes.length ? this._nodes.at(j + 1) : null;
			this.contentNode.insertBefore(this._nodes.at(j), ref);
		};
		MenuBar.prototype.removeMenu = function (menu) {
			var index = searching_1.indexOf(this._menus, menu);
			if (index !== -1)
				this.removeMenuAt(index);
			return index;
		};
		MenuBar.prototype.removeMenuAt = function (index) {
			var i = Math.floor(index);
			if (i < 0 || i >= this._menus.length) {
				return null;
			}
			this._closeChildMenu();
			var node = this._nodes.removeAt(i);
			var menu = this._menus.removeAt(i);
			menu.aboutToClose.disconnect(this._onMenuAboutToClose, this);
			menu.menuRequested.disconnect(this._onMenuMenuRequested, this);
			menu.title.changed.disconnect(this._onTitleChanged, this);
			this.contentNode.removeChild(node);
			menu.removeClass(MENU_CLASS);
			return menu;
		};
		MenuBar.prototype.clearMenus = function () {
			var _this = this;
			if (this._menus.length === 0) {
				return;
			}
			this._closeChildMenu();
			iteration_1.each(this._menus, function (menu) {
				menu.aboutToClose.disconnect(_this._onMenuAboutToClose, _this);
				menu.menuRequested.disconnect(_this._onMenuMenuRequested, _this);
				menu.title.changed.disconnect(_this._onTitleChanged, _this);
				menu.removeClass(MENU_CLASS);
			});
			this._nodes.clear();
			this._menus.clear();
			this.contentNode.textContent = '';
		};
		MenuBar.prototype.handleEvent = function (event) {
			switch (event.type) {
				case 'keydown':
					this._evtKeyDown(event);
					break;
				case 'mousedown':
					this._evtMouseDown(event);
					break;
				case 'mousemove':
					this._evtMouseMove(event);
					break;
				case 'mouseleave':
					this._evtMouseLeave(event);
					break;
				case 'contextmenu':
					event.preventDefault();
					event.stopPropagation();
					break;
			}
		};
		MenuBar.prototype.onAfterAttach = function (msg) {
			this.node.addEventListener('keydown', this);
			this.node.addEventListener('mousedown', this);
			this.node.addEventListener('mousemove', this);
			this.node.addEventListener('mouseleave', this);
			this.node.addEventListener('contextmenu', this);
		};
		MenuBar.prototype.onBeforeDetach = function (msg) {
			this.node.removeEventListener('keydown', this);
			this.node.removeEventListener('mousedown', this);
			this.node.removeEventListener('mousemove', this);
			this.node.removeEventListener('mouseleave', this);
			this.node.removeEventListener('contextmenu', this);
			this._closeChildMenu();
		};
		MenuBar.prototype.onActivateRequest = function (msg) {
			if (this.isAttached)
				this.node.focus();
		};
		MenuBar.prototype.onUpdateRequest = function (msg) {
			var menus = this._menus;
			var nodes = this._nodes;
			var renderer = this._renderer;
			for (var i = 0, n = menus.length; i < n; ++i) {
				renderer.updateItemNode(nodes.at(i), menus.at(i).title);
			}
			if (this._activeIndex !== -1) {
				nodes.at(this._activeIndex).classList.add(ACTIVE_CLASS);
			}
		};
		MenuBar.prototype._evtKeyDown = function (event) {
			event.preventDefault();
			event.stopPropagation();
			var kc = event.keyCode;
			if (kc === 13 || kc === 38 || kc === 40) {
				this.openActiveMenu();
				return;
			}
			if (kc === 27) {
				this._closeChildMenu();
				this.activeIndex = -1;
				this.node.blur();
				return;
			}
			if (kc === 37) {
				var i = this._activeIndex;
				var n_1 = this._menus.length;
				this.activeIndex = i === 0 ? n_1 - 1 : i - 1;
				return;
			}
			if (kc === 39) {
				var i = this._activeIndex;
				var n_2 = this._menus.length;
				this.activeIndex = i === n_2 - 1 ? 0 : i + 1;
				return;
			}
			var key = this._keymap.layout.keyForKeydownEvent(event);
			if (!key) {
				return;
			}
			key = key.toUpperCase();
			var mnIndex = -1;
			var autoIndex = -1;
			var mnMultiple = false;
			var n = this._menus.length;
			var j = this._activeIndex + 1;
			for (var i = 0; i < n; ++i) {
				var k = (i + j) % n;
				var title = this._menus.at(k).title;
				if (title.label.length === 0) {
					continue;
				}
				var mn = title.mnemonic;
				if (mn >= 0 && mn < title.label.length) {
					if (title.label[mn].toUpperCase() === key) {
						if (mnIndex === -1) {
							mnIndex = k;
						}
						else {
							mnMultiple = true;
						}
					}
				}
				else if (autoIndex === -1) {
					if (title.label[0].toUpperCase() === key) {
						autoIndex = k;
					}
				}
			}
			if (mnIndex !== -1 && !mnMultiple) {
				this.activeIndex = mnIndex;
				this.openActiveMenu();
			}
			else if (mnIndex !== -1) {
				this.activeIndex = mnIndex;
			}
			else if (autoIndex !== -1) {
				this.activeIndex = autoIndex;
			}
		};
		MenuBar.prototype._evtMouseDown = function (event) {
			var x = event.clientX;
			var y = event.clientY;
			if (!query_1.hitTest(this.node, x, y)) {
				return;
			}
			event.preventDefault();
			event.stopPropagation();
			event.stopImmediatePropagation();
			var i = searching_1.findIndex(this._nodes, function (node) { return query_1.hitTest(node, x, y); });
			if (i === -1) {
				this._closeChildMenu();
				return;
			}
			if (event.button !== 0) {
				return;
			}
			if (this._childMenu) {
				this._closeChildMenu();
				this.activeIndex = i;
			}
			else {
				this.activeIndex = i;
				this._openChildMenu();
			}
		};
		MenuBar.prototype._evtMouseMove = function (event) {
			var x = event.clientX;
			var y = event.clientY;
			var i = searching_1.findIndex(this._nodes, function (node) { return query_1.hitTest(node, x, y); });
			if (i === this._activeIndex) {
				return;
			}
			if (i === -1 && this._childMenu) {
				return;
			}
			this.activeIndex = i;
			if (this._childMenu) {
				this._openChildMenu();
			}
		};
		MenuBar.prototype._evtMouseLeave = function (event) {
			if (!this._childMenu) {
				this.activeIndex = -1;
			}
		};
		MenuBar.prototype._openChildMenu = function () {
			var newMenu = this.activeMenu;
			if (!newMenu) {
				this._closeChildMenu();
				return;
			}
			var oldMenu = this._childMenu;
			if (oldMenu === newMenu) {
				return;
			}
			this._childMenu = newMenu;
			if (oldMenu) {
				oldMenu.close();
			}
			else {
				this.addClass(ACTIVE_CLASS);
				document.addEventListener('mousedown', this, true);
			}
			var node = this._nodes.at(this._activeIndex);
			var _a = node.getBoundingClientRect(), left = _a.left, bottom = _a.bottom;
			newMenu.open(left, bottom, { forceX: true, forceY: true });
		};
		MenuBar.prototype._closeChildMenu = function () {
			if (!this._childMenu) {
				return;
			}
			this.removeClass(ACTIVE_CLASS);
			document.removeEventListener('mousedown', this, true);
			var menu = this._childMenu;
			this._childMenu = null;
			menu.close();
			this.activeIndex = -1;
		};
		MenuBar.prototype._onMenuAboutToClose = function (sender) {
			if (sender !== this._childMenu) {
				return;
			}
			this.removeClass(ACTIVE_CLASS);
			document.removeEventListener('mousedown', this, true);
			this._childMenu = null;
			this.activeIndex = -1;
		};
		MenuBar.prototype._onMenuMenuRequested = function (sender, args) {
			if (sender !== this._childMenu) {
				return;
			}
			var i = this._activeIndex;
			var n = this._menus.length;
			switch (args) {
				case 'next':
					this.activeIndex = i === n - 1 ? 0 : i + 1;
					break;
				case 'previous':
					this.activeIndex = i === 0 ? n - 1 : i - 1;
					break;
			}
			this.openActiveMenu();
		};
		MenuBar.prototype._onTitleChanged = function (sender) {
			this.update();
		};
		return MenuBar;
	}(widget_1.Widget));
	exports.MenuBar = MenuBar;
	var MenuBar;
	(function (MenuBar) {
		var Renderer = (function () {
			function Renderer() {
			}
			Renderer.prototype.createItemNode = function () {
				var node = document.createElement('li');
				var icon = document.createElement('div');
				var label = document.createElement('div');
				node.className = ITEM_CLASS;
				icon.className = ICON_CLASS;
				label.className = LABEL_CLASS;
				node.appendChild(icon);
				node.appendChild(label);
				return node;
			};
			Renderer.prototype.updateItemNode = function (node, title) {
				var icon = node.firstChild;
				var label = node.lastChild;
				var itemClass = ITEM_CLASS;
				var iconClass = ICON_CLASS;
				if (title.className)
					itemClass += " " + title.className;
				if (title.icon)
					iconClass += " " + title.icon;
				node.className = itemClass;
				icon.className = iconClass;
				label.innerHTML = this.formatLabel(title.label, title.mnemonic);
			};
			Renderer.prototype.formatLabel = function (label, mnemonic) {
				if (mnemonic < 0 || mnemonic >= label.length) {
					return label;
				}
				var pref = label.slice(0, mnemonic);
				var suff = label.slice(mnemonic + 1);
				var char = label[mnemonic];
				return pref + "<span class=\"" + MNEMONIC_CLASS + "\">" + char + "</span>" + suff;
			};
			return Renderer;
		}());
		MenuBar.Renderer = Renderer;
		MenuBar.defaultRenderer = new Renderer();
	})(MenuBar = exports.MenuBar || (exports.MenuBar = {}));
	var Private;
	(function (Private) {
		function createNode() {
			var node = document.createElement('div');
			var content = document.createElement('ul');
			content.className = CONTENT_CLASS;
			node.appendChild(content);
			node.tabIndex = -1;
			return node;
		}
		Private.createNode = createNode;
	})(Private || (Private = {}));
},
function(module, exports) {
},
function(module, exports, __webpack_require__) {
	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
		for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
		function __() { this.constructor = d; }
		d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var iteration_1 = __webpack_require__(2);
	var mutation_1 = __webpack_require__(29);
	var searching_1 = __webpack_require__(21);
	var vector_1 = __webpack_require__(23);
	var messaging_1 = __webpack_require__(3);
	var properties_1 = __webpack_require__(8);
	var cursor_1 = __webpack_require__(11);
	var platform_1 = __webpack_require__(13);
	var sizing_1 = __webpack_require__(16);
	var boxengine_1 = __webpack_require__(27);
	var panel_1 = __webpack_require__(30);
	var widget_1 = __webpack_require__(25);
	var SPLIT_PANEL_CLASS = 'p-SplitPanel';
	var CHILD_CLASS = 'p-SplitPanel-child';
	var HANDLE_CLASS = 'p-SplitPanel-handle';
	var HIDDEN_CLASS = 'p-mod-hidden';
	var HORIZONTAL_CLASS = 'p-mod-horizontal';
	var VERTICAL_CLASS = 'p-mod-vertical';
	var SplitPanel = (function (_super) {
		__extends(SplitPanel, _super);
		function SplitPanel(options) {
			if (options === void 0) { options = {}; }
			_super.call(this, { layout: Private.createLayout(options) });
			this._pressData = null;
			this.addClass(SPLIT_PANEL_CLASS);
		}
		SplitPanel.prototype.dispose = function () {
			this._releaseMouse();
			_super.prototype.dispose.call(this);
		};
		Object.defineProperty(SplitPanel.prototype, "orientation", {
			get: function () {
				return this.layout.orientation;
			},
			set: function (value) {
				this.layout.orientation = value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(SplitPanel.prototype, "spacing", {
			get: function () {
				return this.layout.spacing;
			},
			set: function (value) {
				this.layout.spacing = value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(SplitPanel.prototype, "renderer", {
			get: function () {
				return this.layout.renderer;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(SplitPanel.prototype, "handles", {
			get: function () {
				return this.layout.handles;
			},
			enumerable: true,
			configurable: true
		});
		SplitPanel.prototype.relativeSizes = function () {
			return this.layout.relativeSizes();
		};
		SplitPanel.prototype.setRelativeSizes = function (sizes) {
			this.layout.setRelativeSizes(sizes);
		};
		SplitPanel.prototype.handleEvent = function (event) {
			switch (event.type) {
				case 'mousedown':
					this._evtMouseDown(event);
					break;
				case 'mousemove':
					this._evtMouseMove(event);
					break;
				case 'mouseup':
					this._evtMouseUp(event);
					break;
				case 'keydown':
					this._evtKeyDown(event);
					break;
				case 'contextmenu':
					event.preventDefault();
					event.stopPropagation();
					break;
			}
		};
		SplitPanel.prototype.onAfterAttach = function (msg) {
			this.node.addEventListener('mousedown', this);
		};
		SplitPanel.prototype.onBeforeDetach = function (msg) {
			this.node.removeEventListener('mousedown', this);
			this._releaseMouse();
		};
		SplitPanel.prototype.onChildAdded = function (msg) {
			msg.child.addClass(CHILD_CLASS);
			this._releaseMouse();
		};
		SplitPanel.prototype.onChildRemoved = function (msg) {
			msg.child.removeClass(CHILD_CLASS);
			this._releaseMouse();
		};
		SplitPanel.prototype._evtKeyDown = function (event) {
			event.preventDefault();
			event.stopPropagation();
			if (event.keyCode === 27)
				this._releaseMouse();
		};
		SplitPanel.prototype._evtMouseDown = function (event) {
			if (event.button !== 0) {
				return;
			}
			var layout = this.layout;
			var target = event.target;
			var index = searching_1.findIndex(layout.handles, function (handle) { return handle.contains(target); });
			if (index === -1) {
				return;
			}
			event.preventDefault();
			event.stopPropagation();
			document.addEventListener('mouseup', this, true);
			document.addEventListener('mousemove', this, true);
			document.addEventListener('keydown', this, true);
			document.addEventListener('contextmenu', this, true);
			var delta;
			var handle = layout.handles.at(index);
			var rect = handle.getBoundingClientRect();
			if (layout.orientation === 'horizontal') {
				delta = event.clientX - rect.left;
			}
			else {
				delta = event.clientY - rect.top;
			}
			var style = window.getComputedStyle(handle);
			var override = cursor_1.overrideCursor(style.cursor);
			this._pressData = { index: index, delta: delta, override: override };
		};
		SplitPanel.prototype._evtMouseMove = function (event) {
			event.preventDefault();
			event.stopPropagation();
			var pos;
			var layout = this.layout;
			var rect = this.node.getBoundingClientRect();
			if (layout.orientation === 'horizontal') {
				pos = event.clientX - rect.left - this._pressData.delta;
			}
			else {
				pos = event.clientY - rect.top - this._pressData.delta;
			}
			layout.setHandlePosition(this._pressData.index, pos);
		};
		SplitPanel.prototype._evtMouseUp = function (event) {
			if (event.button !== 0) {
				return;
			}
			event.preventDefault();
			event.stopPropagation();
			this._releaseMouse();
		};
		SplitPanel.prototype._releaseMouse = function () {
			if (!this._pressData) {
				return;
			}
			this._pressData.override.dispose();
			this._pressData = null;
			document.removeEventListener('mouseup', this, true);
			document.removeEventListener('mousemove', this, true);
			document.removeEventListener('keydown', this, true);
			document.removeEventListener('contextmenu', this, true);
		};
		return SplitPanel;
	}(panel_1.Panel));
	exports.SplitPanel = SplitPanel;
	var SplitPanel;
	(function (SplitPanel) {
		var Renderer = (function () {
			function Renderer() {
			}
			Renderer.prototype.createHandleNode = function () {
				var node = document.createElement('div');
				node.className = HANDLE_CLASS;
				return node;
			};
			return Renderer;
		}());
		SplitPanel.Renderer = Renderer;
		SplitPanel.defaultRenderer = new Renderer();
		function getStretch(widget) {
			return SplitLayout.getStretch(widget);
		}
		SplitPanel.getStretch = getStretch;
		function setStretch(widget, value) {
			SplitLayout.setStretch(widget, value);
		}
		SplitPanel.setStretch = setStretch;
	})(SplitPanel = exports.SplitPanel || (exports.SplitPanel = {}));
	var SplitLayout = (function (_super) {
		__extends(SplitLayout, _super);
		function SplitLayout(options) {
			_super.call(this);
			this._fixed = 0;
			this._spacing = 4;
			this._dirty = false;
			this._hasNormedSizes = false;
			this._box = null;
			this._sizers = new vector_1.Vector();
			this._handles = new vector_1.Vector();
			this._orientation = 'horizontal';
			this._renderer = options.renderer;
			if (options.orientation !== void 0) {
				this._orientation = options.orientation;
			}
			if (options.spacing !== void 0) {
				this._spacing = Private.clampSpacing(options.spacing);
			}
		}
		Object.defineProperty(SplitLayout.prototype, "orientation", {
			get: function () {
				return this._orientation;
			},
			set: function (value) {
				if (this._orientation === value) {
					return;
				}
				this._orientation = value;
				if (!this.parent) {
					return;
				}
				Private.toggleOrientation(this.parent, value);
				this.parent.fit();
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(SplitLayout.prototype, "spacing", {
			get: function () {
				return this._spacing;
			},
			set: function (value) {
				value = Private.clampSpacing(value);
				if (this._spacing === value) {
					return;
				}
				this._spacing = value;
				if (!this.parent) {
					return;
				}
				this.parent.fit();
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(SplitLayout.prototype, "renderer", {
			get: function () {
				return this._renderer;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(SplitLayout.prototype, "handles", {
			get: function () {
				return this._handles;
			},
			enumerable: true,
			configurable: true
		});
		SplitLayout.prototype.relativeSizes = function () {
			return Private.normalize(iteration_1.toArray(iteration_1.map(this._sizers, function (sizer) { return sizer.size; })));
		};
		SplitLayout.prototype.setRelativeSizes = function (sizes) {
			var n = this._sizers.length;
			var temp = sizes.slice(0, n);
			while (temp.length < n)
				temp.push(0);
			var normed = Private.normalize(temp);
			for (var i = 0; i < n; ++i) {
				var sizer = this._sizers.at(i);
				sizer.sizeHint = sizer.size = normed[i];
			}
			this._hasNormedSizes = true;
			if (this.parent)
				this.parent.update();
		};
		SplitLayout.prototype.setHandlePosition = function (index, position) {
			var handle = this._handles.at(index);
			if (!handle || handle.classList.contains(HIDDEN_CLASS)) {
				return;
			}
			var delta;
			if (this._orientation === 'horizontal') {
				delta = position - handle.offsetLeft;
			}
			else {
				delta = position - handle.offsetTop;
			}
			if (delta === 0) {
				return;
			}
			iteration_1.each(this._sizers, function (sizer) {
				if (sizer.size > 0)
					sizer.sizeHint = sizer.size;
			});
			boxengine_1.adjustSizer(this._sizers, index, delta);
			if (this.parent)
				this.parent.update();
		};
		SplitLayout.prototype.init = function () {
			Private.toggleOrientation(this.parent, this.orientation);
			_super.prototype.init.call(this);
		};
		SplitLayout.prototype.attachWidget = function (index, widget) {
			var handle = Private.createHandle(this._renderer);
			var average = Private.averageSize(this._sizers);
			var sizer = Private.createSizer(average);
			this._sizers.insert(index, sizer);
			this._handles.insert(index, handle);
			widget_1.Widget.prepareGeometry(widget);
			this.parent.node.appendChild(widget.node);
			this.parent.node.appendChild(handle);
			if (this.parent.isAttached)
				messaging_1.sendMessage(widget, widget_1.WidgetMessage.AfterAttach);
			this.parent.fit();
		};
		SplitLayout.prototype.moveWidget = function (fromIndex, toIndex, widget) {
			mutation_1.move(this._sizers, fromIndex, toIndex);
			mutation_1.move(this._handles, fromIndex, toIndex);
			this.parent.fit();
		};
		SplitLayout.prototype.detachWidget = function (index, widget) {
			var handle = this._handles.removeAt(index);
			this._sizers.removeAt(index);
			if (this.parent.isAttached)
				messaging_1.sendMessage(widget, widget_1.WidgetMessage.BeforeDetach);
			this.parent.node.removeChild(widget.node);
			this.parent.node.removeChild(handle);
			widget_1.Widget.resetGeometry(widget);
			this.parent.fit();
		};
		SplitLayout.prototype.onAfterShow = function (msg) {
			_super.prototype.onAfterShow.call(this, msg);
			this.parent.update();
		};
		SplitLayout.prototype.onAfterAttach = function (msg) {
			_super.prototype.onAfterAttach.call(this, msg);
			this.parent.fit();
		};
		SplitLayout.prototype.onChildShown = function (msg) {
			if (platform_1.IS_IE || platform_1.IS_EDGE) {
				messaging_1.sendMessage(this.parent, widget_1.WidgetMessage.FitRequest);
			}
			else {
				this.parent.fit();
			}
		};
		SplitLayout.prototype.onChildHidden = function (msg) {
			if (platform_1.IS_IE || platform_1.IS_EDGE) {
				messaging_1.sendMessage(this.parent, widget_1.WidgetMessage.FitRequest);
			}
			else {
				this.parent.fit();
			}
		};
		SplitLayout.prototype.onResize = function (msg) {
			if (this.parent.isVisible) {
				this._update(msg.width, msg.height);
			}
		};
		SplitLayout.prototype.onUpdateRequest = function (msg) {
			if (this.parent.isVisible) {
				this._update(-1, -1);
			}
		};
		SplitLayout.prototype.onFitRequest = function (msg) {
			if (this.parent.isAttached) {
				this._fit();
			}
		};
		SplitLayout.prototype._fit = function () {
			var nVisible = 0;
			var widgets = this.widgets;
			var lastHandle = null;
			for (var i = 0, n = widgets.length; i < n; ++i) {
				var handle = this._handles.at(i);
				if (widgets.at(i).isHidden) {
					handle.classList.add(HIDDEN_CLASS);
				}
				else {
					handle.classList.remove(HIDDEN_CLASS);
					lastHandle = handle;
					nVisible++;
				}
			}
			if (lastHandle)
				lastHandle.classList.add(HIDDEN_CLASS);
			this._fixed = this._spacing * Math.max(0, nVisible - 1);
			var minW = 0;
			var minH = 0;
			var maxW = Infinity;
			var maxH = Infinity;
			var horz = this._orientation === 'horizontal';
			if (horz) {
				minW = this._fixed;
				maxW = nVisible > 0 ? minW : maxW;
			}
			else {
				minH = this._fixed;
				maxH = nVisible > 0 ? minH : maxH;
			}
			for (var i = 0, n = widgets.length; i < n; ++i) {
				var widget = widgets.at(i);
				var sizer = this._sizers.at(i);
				if (sizer.size > 0) {
					sizer.sizeHint = sizer.size;
				}
				if (widget.isHidden) {
					sizer.minSize = 0;
					sizer.maxSize = 0;
					continue;
				}
				var limits = sizing_1.sizeLimits(widget.node);
				sizer.stretch = SplitLayout.getStretch(widget);
				if (horz) {
					sizer.minSize = limits.minWidth;
					sizer.maxSize = limits.maxWidth;
					minW += limits.minWidth;
					maxW += limits.maxWidth;
					minH = Math.max(minH, limits.minHeight);
					maxH = Math.min(maxH, limits.maxHeight);
				}
				else {
					sizer.minSize = limits.minHeight;
					sizer.maxSize = limits.maxHeight;
					minH += limits.minHeight;
					maxH += limits.maxHeight;
					minW = Math.max(minW, limits.minWidth);
					maxW = Math.min(maxW, limits.maxWidth);
				}
			}
			var box = this._box = sizing_1.boxSizing(this.parent.node);
			minW += box.horizontalSum;
			minH += box.verticalSum;
			maxW += box.horizontalSum;
			maxH += box.verticalSum;
			var style = this.parent.node.style;
			style.minWidth = minW + "px";
			style.minHeight = minH + "px";
			style.maxWidth = maxW === Infinity ? 'none' : maxW + "px";
			style.maxHeight = maxH === Infinity ? 'none' : maxH + "px";
			this._dirty = true;
			var ancestor = this.parent.parent;
			if (ancestor)
				messaging_1.sendMessage(ancestor, widget_1.WidgetMessage.FitRequest);
			if (this._dirty)
				messaging_1.sendMessage(this.parent, widget_1.WidgetMessage.UpdateRequest);
		};
		SplitLayout.prototype._update = function (offsetWidth, offsetHeight) {
			this._dirty = false;
			var widgets = this.widgets;
			if (widgets.length === 0) {
				return;
			}
			if (offsetWidth < 0) {
				offsetWidth = this.parent.node.offsetWidth;
			}
			if (offsetHeight < 0) {
				offsetHeight = this.parent.node.offsetHeight;
			}
			var box = this._box || (this._box = sizing_1.boxSizing(this.parent.node));
			var top = box.paddingTop;
			var left = box.paddingLeft;
			var width = offsetWidth - box.horizontalSum;
			var height = offsetHeight - box.verticalSum;
			var space;
			var horz = this._orientation === 'horizontal';
			if (horz) {
				space = Math.max(0, width - this._fixed);
			}
			else {
				space = Math.max(0, height - this._fixed);
			}
			if (this._hasNormedSizes) {
				iteration_1.each(this._sizers, function (sizer) { sizer.sizeHint *= space; });
				this._hasNormedSizes = false;
			}
			boxengine_1.boxCalc(this._sizers, space);
			var spacing = this._spacing;
			for (var i = 0, n = widgets.length; i < n; ++i) {
				var widget = widgets.at(i);
				if (widget.isHidden) {
					continue;
				}
				var size = this._sizers.at(i).size;
				var hstyle = this._handles.at(i).style;
				if (horz) {
					widget_1.Widget.setGeometry(widget, left, top, size, height);
					left += size;
					hstyle.top = top + "px";
					hstyle.left = left + "px";
					hstyle.width = spacing + "px";
					hstyle.height = height + "px";
					left += spacing;
				}
				else {
					widget_1.Widget.setGeometry(widget, left, top, width, size);
					top += size;
					hstyle.top = top + "px";
					hstyle.left = left + "px";
					hstyle.width = width + "px";
					hstyle.height = spacing + "px";
					top += spacing;
				}
			}
		};
		return SplitLayout;
	}(panel_1.PanelLayout));
	exports.SplitLayout = SplitLayout;
	var SplitLayout;
	(function (SplitLayout) {
		function getStretch(widget) {
			return Private.stretchProperty.get(widget);
		}
		SplitLayout.getStretch = getStretch;
		function setStretch(widget, value) {
			Private.stretchProperty.set(widget, value);
		}
		SplitLayout.setStretch = setStretch;
	})(SplitLayout = exports.SplitLayout || (exports.SplitLayout = {}));
	var Private;
	(function (Private) {
		Private.stretchProperty = new properties_1.AttachedProperty({
			name: 'stretch',
			value: 0,
			coerce: function (owner, value) { return Math.max(0, Math.floor(value)); },
			changed: onChildPropertyChanged
		});
		function createLayout(options) {
			return options.layout || new SplitLayout({
				renderer: options.renderer || SplitPanel.defaultRenderer,
				orientation: options.orientation,
				spacing: options.spacing
			});
		}
		Private.createLayout = createLayout;
		function createSizer(size) {
			var sizer = new boxengine_1.BoxSizer();
			sizer.sizeHint = Math.floor(size);
			return sizer;
		}
		Private.createSizer = createSizer;
		function createHandle(renderer) {
			var node = renderer.createHandleNode();
			node.style.position = 'absolute';
			return node;
		}
		Private.createHandle = createHandle;
		function toggleOrientation(widget, orient) {
			widget.toggleClass(HORIZONTAL_CLASS, orient === 'horizontal');
			widget.toggleClass(VERTICAL_CLASS, orient === 'vertical');
		}
		Private.toggleOrientation = toggleOrientation;
		function clampSpacing(value) {
			return Math.max(0, Math.floor(value));
		}
		Private.clampSpacing = clampSpacing;
		function averageSize(sizers) {
			return iteration_1.reduce(sizers, function (v, s) { return v + s.size; }, 0) / sizers.length || 0;
		}
		Private.averageSize = averageSize;
		function normalize(values) {
			var n = values.length;
			if (n === 0)
				return [];
			var sum = values.reduce(function (a, b) { return a + Math.abs(b); }, 0);
			return sum === 0 ? values.map(function (v) { return 1 / n; }) : values.map(function (v) { return v / sum; });
		}
		Private.normalize = normalize;
		function onChildPropertyChanged(child) {
			var parent = child.parent;
			var layout = parent && parent.layout;
			if (layout instanceof SplitLayout)
				parent.fit();
		}
	})(Private || (Private = {}));
},
function(module, exports, __webpack_require__) {
	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
		for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
		function __() { this.constructor = d; }
		d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var messaging_1 = __webpack_require__(3);
	var signaling_1 = __webpack_require__(9);
	var platform_1 = __webpack_require__(13);
	var sizing_1 = __webpack_require__(16);
	var panel_1 = __webpack_require__(30);
	var widget_1 = __webpack_require__(25);
	var STACKED_PANEL_CLASS = 'p-StackedPanel';
	var CHILD_CLASS = 'p-StackedPanel-child';
	var StackedPanel = (function (_super) {
		__extends(StackedPanel, _super);
		function StackedPanel(options) {
			if (options === void 0) { options = {}; }
			_super.call(this, { layout: Private.createLayout(options) });
			this.addClass(STACKED_PANEL_CLASS);
		}
		StackedPanel.prototype.onChildAdded = function (msg) {
			msg.child.addClass(CHILD_CLASS);
		};
		StackedPanel.prototype.onChildRemoved = function (msg) {
			msg.child.removeClass(CHILD_CLASS);
			this.widgetRemoved.emit(msg.child);
		};
		return StackedPanel;
	}(panel_1.Panel));
	exports.StackedPanel = StackedPanel;
	signaling_1.defineSignal(StackedPanel.prototype, 'widgetRemoved');
	var StackedLayout = (function (_super) {
		__extends(StackedLayout, _super);
		function StackedLayout() {
			_super.apply(this, arguments);
			this._dirty = false;
			this._box = null;
		}
		StackedLayout.prototype.attachWidget = function (index, widget) {
			widget_1.Widget.prepareGeometry(widget);
			this.parent.node.appendChild(widget.node);
			if (this.parent.isAttached)
				messaging_1.sendMessage(widget, widget_1.WidgetMessage.AfterAttach);
			this.parent.fit();
		};
		StackedLayout.prototype.moveWidget = function (fromIndex, toIndex, widget) {
			this.parent.update();
		};
		StackedLayout.prototype.detachWidget = function (index, widget) {
			if (this.parent.isAttached)
				messaging_1.sendMessage(widget, widget_1.WidgetMessage.BeforeDetach);
			this.parent.node.removeChild(widget.node);
			widget_1.Widget.resetGeometry(widget);
			widget.node.style.zIndex = '';
			this.parent.fit();
		};
		StackedLayout.prototype.onAfterShow = function (msg) {
			_super.prototype.onAfterShow.call(this, msg);
			this.parent.update();
		};
		StackedLayout.prototype.onAfterAttach = function (msg) {
			_super.prototype.onAfterAttach.call(this, msg);
			this.parent.fit();
		};
		StackedLayout.prototype.onChildShown = function (msg) {
			if (platform_1.IS_IE || platform_1.IS_EDGE) {
				messaging_1.sendMessage(this.parent, widget_1.WidgetMessage.FitRequest);
			}
			else {
				this.parent.fit();
			}
		};
		StackedLayout.prototype.onChildHidden = function (msg) {
			if (platform_1.IS_IE || platform_1.IS_EDGE) {
				messaging_1.sendMessage(this.parent, widget_1.WidgetMessage.FitRequest);
			}
			else {
				this.parent.fit();
			}
		};
		StackedLayout.prototype.onResize = function (msg) {
			if (this.parent.isVisible) {
				this._update(msg.width, msg.height);
			}
		};
		StackedLayout.prototype.onUpdateRequest = function (msg) {
			if (this.parent.isVisible) {
				this._update(-1, -1);
			}
		};
		StackedLayout.prototype.onFitRequest = function (msg) {
			if (this.parent.isAttached) {
				this._fit();
			}
		};
		StackedLayout.prototype._fit = function () {
			var minW = 0;
			var minH = 0;
			var maxW = Infinity;
			var maxH = Infinity;
			var widgets = this.widgets;
			for (var i = 0, n = widgets.length; i < n; ++i) {
				var widget = widgets.at(i);
				if (widget.isHidden) {
					continue;
				}
				var limits = sizing_1.sizeLimits(widget.node);
				minW = Math.max(minW, limits.minWidth);
				minH = Math.max(minH, limits.minHeight);
				maxW = Math.min(maxW, limits.maxWidth);
				maxH = Math.min(maxH, limits.maxHeight);
			}
			maxW = Math.max(minW, maxW);
			maxH = Math.max(minH, maxH);
			var box = this._box = sizing_1.boxSizing(this.parent.node);
			minW += box.horizontalSum;
			minH += box.verticalSum;
			maxW += box.horizontalSum;
			maxH += box.verticalSum;
			var style = this.parent.node.style;
			style.minWidth = minW + "px";
			style.minHeight = minH + "px";
			style.maxWidth = maxW === Infinity ? 'none' : maxW + "px";
			style.maxHeight = maxH === Infinity ? 'none' : maxH + "px";
			this._dirty = true;
			var ancestor = this.parent.parent;
			if (ancestor)
				messaging_1.sendMessage(ancestor, widget_1.WidgetMessage.FitRequest);
			if (this._dirty)
				messaging_1.sendMessage(this.parent, widget_1.WidgetMessage.UpdateRequest);
		};
		StackedLayout.prototype._update = function (offsetWidth, offsetHeight) {
			this._dirty = false;
			var widgets = this.widgets;
			if (widgets.length === 0) {
				return;
			}
			if (offsetWidth < 0) {
				offsetWidth = this.parent.node.offsetWidth;
			}
			if (offsetHeight < 0) {
				offsetHeight = this.parent.node.offsetHeight;
			}
			var box = this._box || (this._box = sizing_1.boxSizing(this.parent.node));
			var top = box.paddingTop;
			var left = box.paddingLeft;
			var width = offsetWidth - box.horizontalSum;
			var height = offsetHeight - box.verticalSum;
			for (var i = 0, n = widgets.length; i < n; ++i) {
				var widget = widgets.at(i);
				if (widget.isHidden) {
					continue;
				}
				widget.node.style.zIndex = "" + i;
				widget_1.Widget.setGeometry(widget, left, top, width, height);
			}
		};
		return StackedLayout;
	}(panel_1.PanelLayout));
	exports.StackedLayout = StackedLayout;
	var Private;
	(function (Private) {
		function createLayout(options) {
			return options.layout || new StackedLayout();
		}
		Private.createLayout = createLayout;
	})(Private || (Private = {}));
},
function(module, exports, __webpack_require__) {
	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
		for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
		function __() { this.constructor = d; }
		d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var signaling_1 = __webpack_require__(9);
	var boxpanel_1 = __webpack_require__(28);
	var stackedpanel_1 = __webpack_require__(40);
	var tabbar_1 = __webpack_require__(34);
	var widget_1 = __webpack_require__(25);
	var TAB_PANEL_CLASS = 'p-TabPanel';
	var TAB_BAR_CLASS = 'p-TabPanel-tabBar';
	var STACKED_PANEL_CLASS = 'p-TabPanel-stackedPanel';
	var TabPanel = (function (_super) {
		__extends(TabPanel, _super);
		function TabPanel(options) {
			if (options === void 0) { options = {}; }
			_super.call(this);
			this.addClass(TAB_PANEL_CLASS);
			this._tabBar = new tabbar_1.TabBar(options);
			this._tabBar.addClass(TAB_BAR_CLASS);
			this._stackedPanel = new stackedpanel_1.StackedPanel();
			this._stackedPanel.addClass(STACKED_PANEL_CLASS);
			this._tabBar.tabMoved.connect(this._onTabMoved, this);
			this._tabBar.currentChanged.connect(this._onCurrentChanged, this);
			this._tabBar.tabCloseRequested.connect(this._onTabCloseRequested, this);
			this._stackedPanel.widgetRemoved.connect(this._onWidgetRemoved, this);
			this._tabPlacement = options.tabPlacement || 'top';
			var direction = Private.directionFromPlacement(this._tabPlacement);
			var orientation = Private.orientationFromPlacement(this._tabPlacement);
			this._tabBar.orientation = orientation;
			this._tabBar.addClass("p-mod-" + this._tabPlacement);
			var layout = new boxpanel_1.BoxLayout({ direction: direction, spacing: 0 });
			boxpanel_1.BoxLayout.setStretch(this._tabBar, 0);
			boxpanel_1.BoxLayout.setStretch(this._stackedPanel, 1);
			layout.addWidget(this._tabBar);
			layout.addWidget(this._stackedPanel);
			this.layout = layout;
		}
		TabPanel.prototype.dispose = function () {
			this._tabBar = null;
			this._stackedPanel = null;
			_super.prototype.dispose.call(this);
		};
		Object.defineProperty(TabPanel.prototype, "currentIndex", {
			get: function () {
				return this._tabBar.currentIndex;
			},
			set: function (value) {
				this._tabBar.currentIndex = value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TabPanel.prototype, "currentWidget", {
			get: function () {
				var title = this._tabBar.currentTitle;
				return title ? title.owner : null;
			},
			set: function (value) {
				this._tabBar.currentTitle = value ? value.title : null;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TabPanel.prototype, "tabsMovable", {
			get: function () {
				return this._tabBar.tabsMovable;
			},
			set: function (value) {
				this._tabBar.tabsMovable = value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TabPanel.prototype, "tabPlacement", {
			get: function () {
				return this._tabPlacement;
			},
			set: function (value) {
				if (this._tabPlacement === value) {
					return;
				}
				var old = this._tabPlacement;
				this._tabPlacement = value;
				var direction = Private.directionFromPlacement(value);
				var orientation = Private.orientationFromPlacement(value);
				this._tabBar.orientation = orientation;
				this._tabBar.removeClass("p-mod-" + old);
				this._tabBar.addClass("p-mod-" + value);
				this.layout.direction = direction;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TabPanel.prototype, "tabBar", {
			get: function () {
				return this._tabBar;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TabPanel.prototype, "stackedPanel", {
			get: function () {
				return this._stackedPanel;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(TabPanel.prototype, "widgets", {
			get: function () {
				return this._stackedPanel.widgets;
			},
			enumerable: true,
			configurable: true
		});
		TabPanel.prototype.addWidget = function (widget) {
			this.insertWidget(this.widgets.length, widget);
		};
		TabPanel.prototype.insertWidget = function (index, widget) {
			if (widget !== this.currentWidget)
				widget.hide();
			this._stackedPanel.insertWidget(index, widget);
			this._tabBar.insertTab(index, widget.title);
		};
		TabPanel.prototype._onCurrentChanged = function (sender, args) {
			var previousIndex = args.previousIndex, previousTitle = args.previousTitle, currentIndex = args.currentIndex, currentTitle = args.currentTitle;
			var previousWidget = previousTitle ? previousTitle.owner : null;
			var currentWidget = currentTitle ? currentTitle.owner : null;
			if (previousWidget) {
				previousWidget.hide();
			}
			if (currentWidget) {
				currentWidget.show();
			}
			this.currentChanged.emit({
				previousIndex: previousIndex, previousWidget: previousWidget, currentIndex: currentIndex, currentWidget: currentWidget
			});
		};
		TabPanel.prototype._onTabActivateRequested = function (sender, args) {
			args.title.owner.activate();
		};
		TabPanel.prototype._onTabCloseRequested = function (sender, args) {
			args.title.owner.close();
		};
		TabPanel.prototype._onTabMoved = function (sender, args) {
			this._stackedPanel.insertWidget(args.toIndex, args.title.owner);
		};
		TabPanel.prototype._onWidgetRemoved = function (sender, widget) {
			this._tabBar.removeTab(widget.title);
		};
		return TabPanel;
	}(widget_1.Widget));
	exports.TabPanel = TabPanel;
	signaling_1.defineSignal(TabPanel.prototype, 'currentChanged');
	var Private;
	(function (Private) {
		function orientationFromPlacement(plc) {
			return placementToOrientationMap[plc];
		}
		Private.orientationFromPlacement = orientationFromPlacement;
		function directionFromPlacement(plc) {
			return placementToDirectionMap[plc];
		}
		Private.directionFromPlacement = directionFromPlacement;
		var placementToOrientationMap = {
			'top': 'horizontal',
			'left': 'vertical',
			'right': 'vertical',
			'bottom': 'horizontal'
		};
		var placementToDirectionMap = {
			'top': 'top-to-bottom',
			'left': 'left-to-right',
			'right': 'right-to-left',
			'bottom': 'bottom-to-top'
		};
	})(Private || (Private = {}));
},
function(module, exports, __webpack_require__) {
	"use strict";
	var iteration_1 = __webpack_require__(2);
	var Deque = (function () {
		function Deque(values) {
			var _this = this;
			this._length = 0;
			this._front = null;
			this._back = null;
			if (values)
				iteration_1.each(values, function (value) { _this.pushBack(value); });
		}
		Object.defineProperty(Deque.prototype, "isEmpty", {
			get: function () {
				return this._length === 0;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Deque.prototype, "length", {
			get: function () {
				return this._length;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Deque.prototype, "front", {
			get: function () {
				return this._front ? this._front.value : void 0;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Deque.prototype, "back", {
			get: function () {
				return this._back ? this._back.value : void 0;
			},
			enumerable: true,
			configurable: true
		});
		Deque.prototype.iter = function () {
			return new DequeIterator(this._front);
		};
		Deque.prototype.pushFront = function (value) {
			var node = new DequeNode(value);
			if (this._length === 0) {
				this._front = node;
				this._back = node;
			}
			else {
				node.next = this._front;
				this._front.prev = node;
				this._front = node;
			}
			return ++this._length;
		};
		Deque.prototype.pushBack = function (value) {
			var node = new DequeNode(value);
			if (this._length === 0) {
				this._front = node;
				this._back = node;
			}
			else {
				node.prev = this._back;
				this._back.next = node;
				this._back = node;
			}
			return ++this._length;
		};
		Deque.prototype.popFront = function () {
			if (this._length === 0) {
				return void 0;
			}
			var node = this._front;
			if (this._length === 1) {
				this._front = null;
				this._back = null;
			}
			else {
				this._front = node.next;
				this._front.prev = null;
				node.next = null;
			}
			this._length--;
			return node.value;
		};
		Deque.prototype.popBack = function () {
			if (this._length === 0) {
				return void 0;
			}
			var node = this._back;
			if (this._length === 1) {
				this._front = null;
				this._back = null;
			}
			else {
				this._back = node.prev;
				this._back.next = null;
				node.prev = null;
			}
			this._length--;
			return node.value;
		};
		Deque.prototype.clear = function () {
			var node = this._front;
			while (node) {
				var next = node.next;
				node.prev = null;
				node.next = null;
				node = next;
			}
			this._length = 0;
			this._front = null;
			this._back = null;
		};
		Deque.prototype.swap = function (other) {
			var length = other._length;
			var front = other._front;
			var back = other._back;
			other._length = this._length;
			other._front = this._front;
			other._back = this._back;
			this._length = length;
			this._front = front;
			this._back = back;
		};
		return Deque;
	}());
	exports.Deque = Deque;
	var DequeIterator = (function () {
		function DequeIterator(node) {
			this._node = node;
		}
		DequeIterator.prototype.iter = function () {
			return this;
		};
		DequeIterator.prototype.clone = function () {
			return new DequeIterator(this._node);
		};
		DequeIterator.prototype.next = function () {
			if (!this._node) {
				return void 0;
			}
			var value = this._node.value;
			this._node = this._node.next;
			return value;
		};
		return DequeIterator;
	}());
	var DequeNode = (function () {
		function DequeNode(value) {
			this.next = null;
			this.prev = null;
			this.value = value;
		}
		return DequeNode;
	}());
},
function(module, exports, __webpack_require__) {
	"use strict";
	var iteration_1 = __webpack_require__(2);
	var Stack = (function () {
		function Stack(values) {
			var _this = this;
			this._array = [];
			if (values)
				iteration_1.each(values, function (value) { _this.pushBack(value); });
		}
		Object.defineProperty(Stack.prototype, "isEmpty", {
			get: function () {
				return this._array.length === 0;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Stack.prototype, "length", {
			get: function () {
				return this._array.length;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Stack.prototype, "back", {
			get: function () {
				return this._array[this._array.length - 1];
			},
			enumerable: true,
			configurable: true
		});
		Stack.prototype.iter = function () {
			return new StackIterator(this._array, this._array.length - 1);
		};
		Stack.prototype.pushBack = function (value) {
			return this._array.push(value);
		};
		Stack.prototype.popBack = function () {
			return this._array.pop();
		};
		Stack.prototype.clear = function () {
			this._array.length = 0;
		};
		Stack.prototype.swap = function (other) {
			var array = other._array;
			other._array = this._array;
			this._array = array;
		};
		return Stack;
	}());
	exports.Stack = Stack;
	var StackIterator = (function () {
		function StackIterator(array, index) {
			this._array = array;
			this._index = index;
		}
		StackIterator.prototype.iter = function () {
			return this;
		};
		StackIterator.prototype.clone = function () {
			return new StackIterator(this._array, this._index);
		};
		StackIterator.prototype.next = function () {
			if (this._index < 0 || this._index >= this._array.length) {
				return void 0;
			}
			return this._array[this._index--];
		};
		return StackIterator;
	}());
},
function(module, exports) {
	"use strict";
	function range(start, stop, step) {
		if (stop === void 0) {
			return new Range(0, start, 1);
		}
		if (step === void 0) {
			return new Range(start, stop, 1);
		}
		return new Range(start, stop, step);
	}
	exports.range = range;
	var Range = (function () {
		function Range(start, stop, step) {
			if (step === 0)
				throw new Error('Range(): Step cannot be zero');
			this._start = start;
			this._stop = stop;
			this._step = step;
			this._length = rangeLength(start, stop, step);
		}
		Object.defineProperty(Range.prototype, "start", {
			get: function () {
				return this._start;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "stop", {
			get: function () {
				return this._stop;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "step", {
			get: function () {
				return this._step;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(Range.prototype, "length", {
			get: function () {
				return this._length;
			},
			enumerable: true,
			configurable: true
		});
		Range.prototype.iter = function () {
			return new RangeIterator(this._start, this._stop, this._step);
		};
		Range.prototype.at = function (index) {
			return this._start + this._step * index;
		};
		return Range;
	}());
	exports.Range = Range;
	var RangeIterator = (function () {
		function RangeIterator(start, stop, step) {
			if (step === 0)
				throw new Error('RangeIterator(): Step cannot be zero');
			this._index = 0;
			this._step = step;
			this._start = start;
			this._length = rangeLength(start, stop, step);
		}
		RangeIterator.prototype.iter = function () {
			return this;
		};
		RangeIterator.prototype.clone = function () {
			var start = this._start + this._step * this._index;
			var stop = this._start + this._step * this._length;
			return new RangeIterator(start, stop, this._step);
		};
		RangeIterator.prototype.next = function () {
			if (this._index >= this._length) {
				return void 0;
			}
			return this._start + this._step * this._index++;
		};
		return RangeIterator;
	}());
	exports.RangeIterator = RangeIterator;
	function rangeLength(start, stop, step) {
		if (start > stop && step > 0) {
			return 0;
		}
		if (start < stop && step < 0) {
			return 0;
		}
		return Math.ceil((stop - start) / step);
	}
},
function(module, exports) {
	"use strict";
	function topSort(edges) {
		var sorted = [];
		var graph = Object.create(null);
		var visited = Object.create(null);
		for (var _i = 0, edges_1 = edges; _i < edges_1.length; _i++) {
			var _a = edges_1[_i], fromNode = _a[0], toNode = _a[1];
			addEdge(fromNode, toNode);
		}
		for (var node in graph) {
			visit(node);
		}
		return sorted;
		function addEdge(fromNode, toNode) {
			if (toNode in graph) {
				graph[toNode].push(fromNode);
			}
			else {
				graph[toNode] = [fromNode];
			}
		}
		function visit(node) {
			if (node in visited) {
				return;
			}
			visited[node] = true;
			if (node in graph) {
				for (var _i = 0, _a = graph[node]; _i < _a.length; _i++) {
					var other = _a[_i];
					visit(other);
				}
			}
			sorted.push(node);
		}
	}
	exports.topSort = topSort;
}
]);