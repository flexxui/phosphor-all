(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.phosphor = {};
window.phosphor.disposable = require("phosphor-disposable");
window.phosphor.messaging = require("phosphor-messaging");
window.phosphor.properties = require("phosphor-properties");
window.phosphor.signaling = require("phosphor-signaling");
window.phosphor.boxengine = require("phosphor-boxengine");
window.phosphor.domutil = require("phosphor-domutil");
window.phosphor.nodewrapper = require("phosphor-nodewrapper");
window.phosphor.widget = require("phosphor-widget");
window.phosphor.menus = require("phosphor-menus");
window.phosphor.boxpanel = require("phosphor-boxpanel");
window.phosphor.gridpanel = require("phosphor-gridpanel");
window.phosphor.splitpanel = require("phosphor-splitpanel");
window.phosphor.stackedpanel = require("phosphor-stackedpanel");
window.phosphor.tabs = require("phosphor-tabs");
window.phosphor.dockpanel = require("phosphor-dockpanel");

window.phosphor.createWidget = function (name) {
	var ori = phosphor.widget.Widget.createNode;
	phosphor.widget.Widget.createNode = function() {return document.createElement(name);};
	var w = new phosphor.widget.Widget();
	phosphor.widget.Widget.createNode = ori;
	return w;
};

},{"phosphor-boxengine":3,"phosphor-boxpanel":5,"phosphor-disposable":7,"phosphor-dockpanel":9,"phosphor-domutil":13,"phosphor-gridpanel":15,"phosphor-menus":17,"phosphor-messaging":23,"phosphor-nodewrapper":25,"phosphor-properties":26,"phosphor-signaling":27,"phosphor-splitpanel":29,"phosphor-stackedpanel":32,"phosphor-tabs":34,"phosphor-widget":40}],2:[function(require,module,exports){
'use strict';


module.exports = {

	createLink: function(href, attributes) {
		var head = document.head || document.getElementsByTagName('head')[0];
		var link = document.createElement('link');

		link.href = href;
		link.rel = 'stylesheet';

		for (var key in attributes) {
			if ( ! attributes.hasOwnProperty(key)) {
				continue;
			}
			var value = attributes[key];
			link.setAttribute('data-' + key, value);
		}

		head.appendChild(link);
	},

	createStyle: function(cssText, attributes) {
		var head = document.head || document.getElementsByTagName('head')[0],
			style = document.createElement('style');

		style.type = 'text/css';

		for (var key in attributes) {
			if ( ! attributes.hasOwnProperty(key)) {
				continue;
			}
			var value = attributes[key];
			style.setAttribute('data-' + key, value);
		}

		if (style.sheet) {
			style.innerHTML = cssText;
			style.sheet.cssText = cssText;
			head.appendChild(style);
		} else if (style.styleSheet) {
			head.appendChild(style);
			style.styleSheet.cssText = cssText;
		} else {
			style.appendChild(document.createTextNode(cssText));
			head.appendChild(style);
		}
	}
};

},{}],3:[function(require,module,exports){

'use strict';

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
})();
exports.BoxSizer = BoxSizer;

function boxCalc(sizers, space) {

	var count = sizers.length;
	if (count === 0) {
		return;
	}

	var totalMin = 0;
	var totalMax = 0;
	var totalSize = 0;
	var totalStretch = 0;
	var stretchCount = 0;

	for (var i = 0; i < count; ++i) {
		var sizer = sizers[i];
		initSizer(sizer);
		totalSize += sizer.size;
		totalMin += sizer.minSize;
		totalMax += sizer.maxSize;
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
			var sizer = sizers[i];
			sizer.size = sizer.minSize;
		}
		return;
	}

	if (space >= totalMax) {
		for (var i = 0; i < count; ++i) {
			var sizer = sizers[i];
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
				var sizer = sizers[i];
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
				var sizer = sizers[i];
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
				var sizer = sizers[i];
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
				var sizer = sizers[i];
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

function initSizer(sizer) {
	sizer.size = Math.max(sizer.minSize, Math.min(sizer.sizeHint, sizer.maxSize));
	sizer.done = false;
}

},{}],4:[function(require,module,exports){
var css = ".p-BoxPanel{position:relative}.p-BoxPanel>.p-Widget{position:absolute}"; (require("browserify-css").createStyle(css, { "href": "node_modules\\phosphor-boxpanel\\lib\\index.css"})); module.exports = css;
},{"browserify-css":2}],5:[function(require,module,exports){

'use strict';
var __extends = (this && this.__extends) || function (d, b) {
	for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	function __() { this.constructor = d; }
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var arrays = require('phosphor-arrays');
var phosphor_boxengine_1 = require('phosphor-boxengine');
var phosphor_domutil_1 = require('phosphor-domutil');
var phosphor_messaging_1 = require('phosphor-messaging');
var phosphor_properties_1 = require('phosphor-properties');
var phosphor_widget_1 = require('phosphor-widget');
require('./index.css');

var BOX_PANEL_CLASS = 'p-BoxPanel';

var LEFT_TO_RIGHT_CLASS = 'p-mod-left-to-right';

var RIGHT_TO_LEFT_CLASS = 'p-mod-right-to-left';

var TOP_TO_BOTTOM_CLASS = 'p-mod-top-to-bottom';

var BOTTOM_TO_TOP_CLASS = 'p-mod-bottom-to-top';

(function (Direction) {

	Direction[Direction["LeftToRight"] = 0] = "LeftToRight";

	Direction[Direction["RightToLeft"] = 1] = "RightToLeft";

	Direction[Direction["TopToBottom"] = 2] = "TopToBottom";

	Direction[Direction["BottomToTop"] = 3] = "BottomToTop";
})(exports.Direction || (exports.Direction = {}));
var Direction = exports.Direction;

var BoxPanel = (function (_super) {
	__extends(BoxPanel, _super);

	function BoxPanel() {
		_super.call(this);
		this._fixedSpace = 0;
		this._box = null;
		this._sizers = [];
		this.addClass(BOX_PANEL_CLASS);
		this.addClass(TOP_TO_BOTTOM_CLASS);
	}

	BoxPanel.getStretch = function (widget) {
		return BoxPanel.stretchProperty.get(widget);
	};

	BoxPanel.setStretch = function (widget, value) {
		BoxPanel.stretchProperty.set(widget, value);
	};

	BoxPanel.getSizeBasis = function (widget) {
		return BoxPanel.sizeBasisProperty.get(widget);
	};

	BoxPanel.setSizeBasis = function (widget, value) {
		BoxPanel.sizeBasisProperty.set(widget, value);
	};

	BoxPanel.prototype.dispose = function () {
		this._sizers.length = 0;
		_super.prototype.dispose.call(this);
	};
	Object.defineProperty(BoxPanel.prototype, "direction", {

		get: function () {
			return BoxPanel.directionProperty.get(this);
		},

		set: function (value) {
			BoxPanel.directionProperty.set(this, value);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(BoxPanel.prototype, "spacing", {

		get: function () {
			return BoxPanel.spacingProperty.get(this);
		},

		set: function (value) {
			BoxPanel.spacingProperty.set(this, value);
		},
		enumerable: true,
		configurable: true
	});

	BoxPanel.prototype.onChildAdded = function (msg) {
		arrays.insert(this._sizers, msg.currentIndex, new phosphor_boxengine_1.BoxSizer());
		this.node.appendChild(msg.child.node);
		if (this.isAttached)
			phosphor_messaging_1.sendMessage(msg.child, phosphor_widget_1.Widget.MsgAfterAttach);
		phosphor_messaging_1.postMessage(this, phosphor_widget_1.Panel.MsgLayoutRequest);
	};

	BoxPanel.prototype.onChildMoved = function (msg) {
		arrays.move(this._sizers, msg.previousIndex, msg.currentIndex);
		phosphor_messaging_1.postMessage(this, phosphor_widget_1.Widget.MsgUpdateRequest);
	};

	BoxPanel.prototype.onChildRemoved = function (msg) {
		arrays.removeAt(this._sizers, msg.previousIndex);
		if (this.isAttached)
			phosphor_messaging_1.sendMessage(msg.child, phosphor_widget_1.Widget.MsgBeforeDetach);
		this.node.removeChild(msg.child.node);
		phosphor_messaging_1.postMessage(this, phosphor_widget_1.Panel.MsgLayoutRequest);
		resetGeometry(msg.child);
	};

	BoxPanel.prototype.onAfterShow = function (msg) {
		_super.prototype.onAfterShow.call(this, msg);
		phosphor_messaging_1.sendMessage(this, phosphor_widget_1.Widget.MsgUpdateRequest);
	};

	BoxPanel.prototype.onAfterAttach = function (msg) {
		_super.prototype.onAfterAttach.call(this, msg);
		phosphor_messaging_1.postMessage(this, phosphor_widget_1.Panel.MsgLayoutRequest);
	};

	BoxPanel.prototype.onChildShown = function (msg) {
		phosphor_messaging_1.postMessage(this, phosphor_widget_1.Panel.MsgLayoutRequest);
	};

	BoxPanel.prototype.onChildHidden = function (msg) {
		phosphor_messaging_1.postMessage(this, phosphor_widget_1.Panel.MsgLayoutRequest);
	};

	BoxPanel.prototype.onResize = function (msg) {
		if (this.isVisible) {
			var width = msg.width < 0 ? this.node.offsetWidth : msg.width;
			var height = msg.height < 0 ? this.node.offsetHeight : msg.height;
			this._layoutChildren(width, height);
		}
	};

	BoxPanel.prototype.onUpdateRequest = function (msg) {
		if (this.isVisible) {
			this._layoutChildren(this.node.offsetWidth, this.node.offsetHeight);
		}
	};

	BoxPanel.prototype.onLayoutRequest = function (msg) {
		if (this.isAttached) {
			this._setupGeometry();
		}
	};

	BoxPanel.prototype._setupGeometry = function () {

		var visibleCount = 0;
		for (var i = 0, n = this.childCount(); i < n; ++i) {
			if (!this.childAt(i).hidden)
				visibleCount++;
		}

		this._fixedSpace = this.spacing * Math.max(0, visibleCount - 1);

		var minW = 0;
		var minH = 0;
		var maxW = Infinity;
		var maxH = Infinity;
		var dir = this.direction;
		if (dir === Direction.LeftToRight || dir === Direction.RightToLeft) {
			minW = this._fixedSpace;
			maxW = visibleCount > 0 ? minW : maxW;
			for (var i = 0, n = this.childCount(); i < n; ++i) {
				var widget = this.childAt(i);
				var sizer = this._sizers[i];
				if (widget.hidden) {
					sizer.minSize = 0;
					sizer.maxSize = 0;
					continue;
				}
				var limits = phosphor_domutil_1.sizeLimits(widget.node);
				sizer.sizeHint = BoxPanel.getSizeBasis(widget);
				sizer.stretch = BoxPanel.getStretch(widget);
				sizer.minSize = limits.minWidth;
				sizer.maxSize = limits.maxWidth;
				minW += limits.minWidth;
				maxW += limits.maxWidth;
				minH = Math.max(minH, limits.minHeight);
				maxH = Math.min(maxH, limits.maxHeight);
			}
		}
		else {
			minH = this._fixedSpace;
			maxH = visibleCount > 0 ? minH : maxH;
			for (var i = 0, n = this.childCount(); i < n; ++i) {
				var widget = this.childAt(i);
				var sizer = this._sizers[i];
				if (widget.hidden) {
					sizer.minSize = 0;
					sizer.maxSize = 0;
					continue;
				}
				var limits = phosphor_domutil_1.sizeLimits(widget.node);
				sizer.sizeHint = BoxPanel.getSizeBasis(widget);
				sizer.stretch = BoxPanel.getStretch(widget);
				sizer.minSize = limits.minHeight;
				sizer.maxSize = limits.maxHeight;
				minH += limits.minHeight;
				maxH += limits.maxHeight;
				minW = Math.max(minW, limits.minWidth);
				maxW = Math.min(maxW, limits.maxWidth);
			}
		}

		this._box = phosphor_domutil_1.boxSizing(this.node);
		minW += this._box.horizontalSum;
		minH += this._box.verticalSum;
		maxW += this._box.horizontalSum;
		maxH += this._box.verticalSum;

		var style = this.node.style;
		style.minWidth = minW + 'px';
		style.minHeight = minH + 'px';
		style.maxWidth = maxW === Infinity ? 'none' : maxW + 'px';
		style.maxHeight = maxH === Infinity ? 'none' : maxH + 'px';

		if (this.parent)
			phosphor_messaging_1.sendMessage(this.parent, phosphor_widget_1.Panel.MsgLayoutRequest);

		phosphor_messaging_1.sendMessage(this, phosphor_widget_1.Widget.MsgUpdateRequest);
	};

	BoxPanel.prototype._layoutChildren = function (offsetWidth, offsetHeight) {

		if (this.childCount() === 0) {
			return;
		}

		var box = this._box || (this._box = phosphor_domutil_1.boxSizing(this.node));

		var top = box.paddingTop;
		var left = box.paddingLeft;
		var width = offsetWidth - box.horizontalSum;
		var height = offsetHeight - box.verticalSum;

		var dir = this.direction;
		var spacing = this.spacing;
		if (dir === Direction.LeftToRight) {
			phosphor_boxengine_1.boxCalc(this._sizers, Math.max(0, width - this._fixedSpace));
			for (var i = 0, n = this.childCount(); i < n; ++i) {
				var widget = this.childAt(i);
				if (widget.hidden) {
					continue;
				}
				var size = this._sizers[i].size;
				setGeometry(widget, left, top, size, height);
				left += size + spacing;
			}
		}
		else if (dir === Direction.TopToBottom) {
			phosphor_boxengine_1.boxCalc(this._sizers, Math.max(0, height - this._fixedSpace));
			for (var i = 0, n = this.childCount(); i < n; ++i) {
				var widget = this.childAt(i);
				if (widget.hidden) {
					continue;
				}
				var size = this._sizers[i].size;
				setGeometry(widget, left, top, width, size);
				top += size + spacing;
			}
		}
		else if (dir === Direction.RightToLeft) {
			left += width;
			phosphor_boxengine_1.boxCalc(this._sizers, Math.max(0, width - this._fixedSpace));
			for (var i = 0, n = this.childCount(); i < n; ++i) {
				var widget = this.childAt(i);
				if (widget.hidden) {
					continue;
				}
				var size = this._sizers[i].size;
				setGeometry(widget, left - size, top, size, height);
				left -= size + spacing;
			}
		}
		else {
			top += height;
			phosphor_boxengine_1.boxCalc(this._sizers, Math.max(0, height - this._fixedSpace));
			for (var i = 0, n = this.childCount(); i < n; ++i) {
				var widget = this.childAt(i);
				if (widget.hidden) {
					continue;
				}
				var size = this._sizers[i].size;
				setGeometry(widget, left, top - size, width, size);
				top -= size + spacing;
			}
		}
	};

	BoxPanel.prototype._onDirectionChanged = function (old, value) {
		this.toggleClass(LEFT_TO_RIGHT_CLASS, value === Direction.LeftToRight);
		this.toggleClass(RIGHT_TO_LEFT_CLASS, value === Direction.RightToLeft);
		this.toggleClass(TOP_TO_BOTTOM_CLASS, value === Direction.TopToBottom);
		this.toggleClass(BOTTOM_TO_TOP_CLASS, value === Direction.BottomToTop);
		phosphor_messaging_1.postMessage(this, phosphor_widget_1.Panel.MsgLayoutRequest);
	};

	BoxPanel.LeftToRight = Direction.LeftToRight;

	BoxPanel.RightToLeft = Direction.RightToLeft;

	BoxPanel.TopToBottom = Direction.TopToBottom;

	BoxPanel.BottomToTop = Direction.BottomToTop;

	BoxPanel.directionProperty = new phosphor_properties_1.Property({
		name: 'direction',
		value: Direction.TopToBottom,
		changed: function (owner, old, value) { return owner._onDirectionChanged(old, value); },
	});

	BoxPanel.spacingProperty = new phosphor_properties_1.Property({
		name: 'spacing',
		value: 8,
		coerce: function (owner, value) { return Math.max(0, value | 0); },
		changed: function (owner) { return phosphor_messaging_1.postMessage(owner, phosphor_widget_1.Panel.MsgLayoutRequest); },
	});

	BoxPanel.stretchProperty = new phosphor_properties_1.Property({
		name: 'stretch',
		value: 0,
		coerce: function (owner, value) { return Math.max(0, value | 0); },
		changed: onChildPropertyChanged,
	});

	BoxPanel.sizeBasisProperty = new phosphor_properties_1.Property({
		name: 'sizeBasis',
		value: 0,
		coerce: function (owner, value) { return Math.max(0, value | 0); },
		changed: onChildPropertyChanged,
	});
	return BoxPanel;
})(phosphor_widget_1.Panel);
exports.BoxPanel = BoxPanel;

var rectProperty = new phosphor_properties_1.Property({
	name: 'rect',
	create: createRect,
});

function createRect() {
	return { top: NaN, left: NaN, width: NaN, height: NaN };
}

function getRect(widget) {
	return rectProperty.get(widget);
}

function setGeometry(widget, left, top, width, height) {
	var resized = false;
	var rect = getRect(widget);
	var style = widget.node.style;
	if (rect.top !== top) {
		rect.top = top;
		style.top = top + 'px';
	}
	if (rect.left !== left) {
		rect.left = left;
		style.left = left + 'px';
	}
	if (rect.width !== width) {
		resized = true;
		rect.width = width;
		style.width = width + 'px';
	}
	if (rect.height !== height) {
		resized = true;
		rect.height = height;
		style.height = height + 'px';
	}
	if (resized) {
		phosphor_messaging_1.sendMessage(widget, new phosphor_widget_1.ResizeMessage(width, height));
	}
}

function resetGeometry(widget) {
	var rect = getRect(widget);
	var style = widget.node.style;
	rect.top = NaN;
	rect.left = NaN;
	rect.width = NaN;
	rect.height = NaN;
	style.top = '';
	style.left = '';
	style.width = '';
	style.height = '';
}

function onChildPropertyChanged(child) {
	if (child.parent instanceof BoxPanel) {
		phosphor_messaging_1.postMessage(child.parent, phosphor_widget_1.Panel.MsgLayoutRequest);
	}
}

},{"./index.css":4,"phosphor-arrays":6,"phosphor-boxengine":3,"phosphor-domutil":13,"phosphor-messaging":23,"phosphor-properties":26,"phosphor-widget":40}],6:[function(require,module,exports){

'use strict';

function forEach(array, callback, fromIndex, wrap) {
	if (fromIndex === void 0) { fromIndex = 0; }
	if (wrap === void 0) { wrap = false; }
	var start = fromIndex | 0;
	if (start < 0 || start >= array.length) {
		return void 0;
	}
	if (wrap) {
		for (var i = 0, n = array.length; i < n; ++i) {
			var j = (start + i) % n;
			var result = callback(array[j], j);
			if (result !== void 0)
				return result;
		}
	}
	else {
		for (var i = start, n = array.length; i < n; ++i) {
			var result = callback(array[i], i);
			if (result !== void 0)
				return result;
		}
	}
	return void 0;
}
exports.forEach = forEach;

function rforEach(array, callback, fromIndex, wrap) {
	if (fromIndex === void 0) { fromIndex = array.length - 1; }
	if (wrap === void 0) { wrap = false; }
	var start = fromIndex | 0;
	if (start < 0 || start >= array.length) {
		return void 0;
	}
	if (wrap) {
		for (var i = 0, n = array.length; i < n; ++i) {
			var j = (start - i + n) % n;
			var result = callback(array[j], j);
			if (result !== void 0)
				return result;
		}
	}
	else {
		for (var i = start; i >= 0; --i) {
			var result = callback(array[i], i);
			if (result !== void 0)
				return result;
		}
	}
	return void 0;
}
exports.rforEach = rforEach;

function findIndex(array, pred, fromIndex, wrap) {
	if (fromIndex === void 0) { fromIndex = 0; }
	if (wrap === void 0) { wrap = false; }
	var start = fromIndex | 0;
	if (start < 0 || start >= array.length) {
		return -1;
	}
	if (wrap) {
		for (var i = 0, n = array.length; i < n; ++i) {
			var j = (start + i) % n;
			if (pred(array[j], j))
				return j;
		}
	}
	else {
		for (var i = start, n = array.length; i < n; ++i) {
			if (pred(array[i], i))
				return i;
		}
	}
	return -1;
}
exports.findIndex = findIndex;

function rfindIndex(array, pred, fromIndex, wrap) {
	if (fromIndex === void 0) { fromIndex = array.length - 1; }
	if (wrap === void 0) { wrap = false; }
	var start = fromIndex | 0;
	if (start < 0 || start >= array.length) {
		return -1;
	}
	if (wrap) {
		for (var i = 0, n = array.length; i < n; ++i) {
			var j = (start - i + n) % n;
			if (pred(array[j], j))
				return j;
		}
	}
	else {
		for (var i = start; i >= 0; --i) {
			if (pred(array[i], i))
				return i;
		}
	}
	return -1;
}
exports.rfindIndex = rfindIndex;

function find(array, pred, fromIndex, wrap) {
	var i = findIndex(array, pred, fromIndex, wrap);
	return i !== -1 ? array[i] : void 0;
}
exports.find = find;

function rfind(array, pred, fromIndex, wrap) {
	var i = rfindIndex(array, pred, fromIndex, wrap);
	return i !== -1 ? array[i] : void 0;
}
exports.rfind = rfind;

function insert(array, index, value) {
	var j = Math.max(0, Math.min(index | 0, array.length));
	for (var i = array.length; i > j; --i) {
		array[i] = array[i - 1];
	}
	array[j] = value;
	return j;
}
exports.insert = insert;

function move(array, fromIndex, toIndex) {
	var j = fromIndex | 0;
	if (j < 0 || j >= array.length) {
		return false;
	}
	var k = toIndex | 0;
	if (k < 0 || k >= array.length) {
		return false;
	}
	var value = array[j];
	if (j > k) {
		for (var i = j; i > k; --i) {
			array[i] = array[i - 1];
		}
	}
	else if (j < k) {
		for (var i = j; i < k; ++i) {
			array[i] = array[i + 1];
		}
	}
	array[k] = value;
	return true;
}
exports.move = move;

function removeAt(array, index) {
	var j = index | 0;
	if (j < 0 || j >= array.length) {
		return void 0;
	}
	var value = array[j];
	for (var i = j + 1, n = array.length; i < n; ++i) {
		array[i - 1] = array[i];
	}
	array.length -= 1;
	return value;
}
exports.removeAt = removeAt;

function remove(array, value) {
	var j = -1;
	for (var i = 0, n = array.length; i < n; ++i) {
		if (array[i] === value) {
			j = i;
			break;
		}
	}
	if (j === -1) {
		return -1;
	}
	for (var i = j + 1, n = array.length; i < n; ++i) {
		array[i - 1] = array[i];
	}
	array.length -= 1;
	return j;
}
exports.remove = remove;

function reverse(array, fromIndex, toIndex) {
	if (fromIndex === void 0) { fromIndex = 0; }
	if (toIndex === void 0) { toIndex = array.length; }
	var i = Math.max(0, Math.min(fromIndex | 0, array.length - 1));
	var j = Math.max(0, Math.min(toIndex | 0, array.length - 1));
	if (j < i)
		i = j + (j = i, 0);
	while (i < j) {
		var tmpval = array[i];
		array[i++] = array[j];
		array[j--] = tmpval;
	}
	return array;
}
exports.reverse = reverse;

function rotate(array, delta) {
	var n = array.length;
	if (n <= 1) {
		return array;
	}
	var d = delta | 0;
	if (d > 0) {
		d = d % n;
	}
	else if (d < 0) {
		d = ((d % n) + n) % n;
	}
	if (d === 0) {
		return array;
	}
	reverse(array, 0, d - 1);
	reverse(array, d, n - 1);
	reverse(array, 0, n - 1);
	return array;
}
exports.rotate = rotate;

function lowerBound(array, value, cmp) {
	var begin = 0;
	var half;
	var middle;
	var n = array.length;
	while (n > 0) {
		half = n >> 1;
		middle = begin + half;
		if (cmp(array[middle], value)) {
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

function upperBound(array, value, cmp) {
	var begin = 0;
	var half;
	var middle;
	var n = array.length;
	while (n > 0) {
		half = n >> 1;
		middle = begin + half;
		if (cmp(value, array[middle])) {
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

},{}],7:[function(require,module,exports){

'use strict';

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
})();
exports.DisposableDelegate = DisposableDelegate;

var DisposableSet = (function () {

	function DisposableSet(items) {
		var _this = this;
		this._set = new Set();
		if (items)
			items.forEach(function (item) { _this._set.add(item); });
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
			throw new Error('object is disposed');
		}
		this._set.add(item);
	};

	DisposableSet.prototype.remove = function (item) {
		if (this._set === null) {
			throw new Error('object is disposed');
		}
		this._set.delete(item);
	};

	DisposableSet.prototype.clear = function () {
		if (this._set === null) {
			throw new Error('object is disposed');
		}
		this._set.clear();
	};
	return DisposableSet;
})();
exports.DisposableSet = DisposableSet;

},{}],8:[function(require,module,exports){
var css = ".p-DockPanel,.p-DockPanel>.p-DockSplitPanel,.p-DockPanel>.p-DockTabPanel{z-index:0}.p-DockPanelOverlay{box-sizing:border-box;position:absolute;top:0;left:0;width:0;height:0;z-index:1;pointer-events:none}.p-DockPanelOverlay.p-mod-hidden,.p-Tab.p-mod-hidden{display:none}"; (require("browserify-css").createStyle(css, { "href": "node_modules\\phosphor-dockpanel\\lib\\index.css"})); module.exports = css;
},{"browserify-css":2}],9:[function(require,module,exports){

'use strict';
var __extends = (this && this.__extends) || function (d, b) {
	for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	function __() { this.constructor = d; }
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var arrays = require('phosphor-arrays');
var phosphor_domutil_1 = require('phosphor-domutil');
var phosphor_dragdrop_1 = require('phosphor-dragdrop');
var phosphor_nodewrapper_1 = require('phosphor-nodewrapper');
var phosphor_properties_1 = require('phosphor-properties');
var phosphor_splitpanel_1 = require('phosphor-splitpanel');
var phosphor_stackedpanel_1 = require('phosphor-stackedpanel');
var phosphor_tabs_1 = require('phosphor-tabs');
var phosphor_widget_1 = require('phosphor-widget');
require('./index.css');

var DOCK_PANEL_CLASS = 'p-DockPanel';

var TAB_BAR_CLASS = 'p-DockTabBar';

var TAB_PANEL_CLASS = 'p-DockTabPanel';

var SPLIT_PANEL_CLASS = 'p-DockSplitPanel';

var OVERLAY_CLASS = 'p-DockPanelOverlay';

var HIDDEN_CLASS = 'p-mod-hidden';

var ROOT_TOP_CLASS = 'p-mod-root-top';

var ROOT_LEFT_CLASS = 'p-mod-root-left';

var ROOT_RIGHT_CLASS = 'p-mod-root-right';

var ROOT_BOTTOM_CLASS = 'p-mod-root-bottom';

var ROOT_CENTER_CLASS = 'p-mod-root-center';

var PANEL_TOP_CLASS = 'p-mod-panel-top';

var PANEL_LEFT_CLASS = 'p-mod-panel-left';

var PANEL_RIGHT_CLASS = 'p-mod-panel-right';

var PANEL_BOTTOM_CLASS = 'p-mod-panel-bottom';

var PANEL_CENTER_CLASS = 'p-mod-panel-center';

var FACTORY_MIME = 'application/x-phosphor-widget-factory';

var EDGE_SIZE = 30;

var DockPanel = (function (_super) {
	__extends(DockPanel, _super);

	function DockPanel() {
		_super.call(this);
		this.addClass(DOCK_PANEL_CLASS);
	}

	DockPanel.select = function (widget) {
		selectWidget(widget);
	};
	Object.defineProperty(DockPanel.prototype, "spacing", {

		get: function () {
			return DockPanel.spacingProperty.get(this);
		},

		set: function (value) {
			DockPanel.spacingProperty.set(this, value);
		},
		enumerable: true,
		configurable: true
	});

	DockPanel.prototype.insertTop = function (widget, ref) {
		insertSplit(this, widget, ref, phosphor_splitpanel_1.Orientation.Vertical, false);
	};

	DockPanel.prototype.insertLeft = function (widget, ref) {
		insertSplit(this, widget, ref, phosphor_splitpanel_1.Orientation.Horizontal, false);
	};

	DockPanel.prototype.insertRight = function (widget, ref) {
		insertSplit(this, widget, ref, phosphor_splitpanel_1.Orientation.Horizontal, true);
	};

	DockPanel.prototype.insertBottom = function (widget, ref) {
		insertSplit(this, widget, ref, phosphor_splitpanel_1.Orientation.Vertical, true);
	};

	DockPanel.prototype.insertTabBefore = function (widget, ref) {
		insertTab(this, widget, ref, false);
	};

	DockPanel.prototype.insertTabAfter = function (widget, ref) {
		insertTab(this, widget, ref, true);
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
		}
	};

	DockPanel.prototype.onAfterAttach = function (msg) {
		_super.prototype.onAfterAttach.call(this, msg);
		var node = this.node;
		node.addEventListener('p-dragenter', this);
		node.addEventListener('p-dragleave', this);
		node.addEventListener('p-dragover', this);
		node.addEventListener('p-drop', this);
	};

	DockPanel.prototype.onBeforeDetach = function (msg) {
		_super.prototype.onBeforeDetach.call(this, msg);
		var node = this.node;
		node.removeEventListener('p-dragenter', this);
		node.removeEventListener('p-dragleave', this);
		node.removeEventListener('p-dragover', this);
		node.removeEventListener('p-drop', this);
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
			hideOverlay(this);
		}
	};

	DockPanel.prototype._evtDragOver = function (event) {
		event.preventDefault();
		event.stopPropagation();
		var zone = showOverlay(this, event.clientX, event.clientY);
		if (zone === 10 ) {
			event.dropAction = phosphor_dragdrop_1.DropAction.None;
		}
		else {
			event.dropAction = event.proposedAction;
		}
	};

	DockPanel.prototype._evtDrop = function (event) {
		event.preventDefault();
		event.stopPropagation();
		hideOverlay(this);
		if (event.proposedAction === phosphor_dragdrop_1.DropAction.None) {
			event.dropAction = phosphor_dragdrop_1.DropAction.None;
			return;
		}
		var target = findDockTarget(this, event.clientX, event.clientY);
		if (target.zone === 10 ) {
			event.dropAction = phosphor_dragdrop_1.DropAction.None;
			return;
		}
		var factory = event.mimeData.getData(FACTORY_MIME);
		if (typeof factory !== 'function') {
			event.dropAction = phosphor_dragdrop_1.DropAction.None;
			return;
		}
		var widget = factory();
		if (!(widget instanceof phosphor_widget_1.Widget)) {
			event.dropAction = phosphor_dragdrop_1.DropAction.None;
			return;
		}
		handleDrop(this, widget, target);
		event.dropAction = event.proposedAction;
	};

	DockPanel.spacingProperty = new phosphor_properties_1.Property({
		name: 'spacing',
		value: 3,
		coerce: function (owner, value) { return Math.max(0, value | 0); },
		changed: onSpacingChanged,
	});
	return DockPanel;
})(phosphor_stackedpanel_1.StackedPanel);
exports.DockPanel = DockPanel;

var DockTabBar = (function (_super) {
	__extends(DockTabBar, _super);

	function DockTabBar() {
		_super.call(this);
		this._drag = null;
		this.addClass(TAB_BAR_CLASS);
		this.tabsMovable = true;
	}

	DockTabBar.prototype.dispose = function () {
		if (this._drag) {
			this._drag.dispose();
			this._drag = null;
		}
		_super.prototype.dispose.call(this);
	};

	DockTabBar.prototype.onTearOffRequest = function (msg) {
		var _this = this;

		if (this._drag) {
			return;
		}

		this.releaseMouse();

		var widget = msg.item;
		var mimeData = new phosphor_dragdrop_1.MimeData();
		mimeData.setData(FACTORY_MIME, function () { return widget; });

		var tabNode = msg.node;
		var dragImage = tabNode.cloneNode(true);

		this._drag = new phosphor_dragdrop_1.Drag({
			mimeData: mimeData,
			dragImage: dragImage,
			proposedAction: phosphor_dragdrop_1.DropAction.Move,
			supportedActions: phosphor_dragdrop_1.DropActions.Move,
		});

		tabNode.classList.add(HIDDEN_CLASS);
		this._drag.start(msg.clientX, msg.clientY).then(function () {
			_this._drag = null;
			tabNode.classList.remove(HIDDEN_CLASS);
		});
	};
	return DockTabBar;
})(phosphor_tabs_1.TabBar);

var DockTabPanel = (function (_super) {
	__extends(DockTabPanel, _super);

	function DockTabPanel() {
		_super.call(this);
		this.addClass(TAB_PANEL_CLASS);
		this.widgets.changed.connect(this._onWidgetsChanged, this);
	}

	DockTabPanel.createTabBar = function () {
		return new DockTabBar();
	};

	DockTabPanel.prototype._onWidgetsChanged = function () {
		if (this.widgets.length === 0)
			removeTabPanel(this);
	};
	return DockTabPanel;
})(phosphor_tabs_1.TabPanel);

var DockSplitPanel = (function (_super) {
	__extends(DockSplitPanel, _super);

	function DockSplitPanel(orientation, spacing) {
		_super.call(this);
		this.addClass(SPLIT_PANEL_CLASS);
		this.orientation = orientation;
		this.spacing = spacing;
	}
	return DockSplitPanel;
})(phosphor_splitpanel_1.SplitPanel);

var DockPanelOverlay = (function (_super) {
	__extends(DockPanelOverlay, _super);

	function DockPanelOverlay() {
		_super.call(this);
		this._zone = 10 ;
		this.addClass(OVERLAY_CLASS);
		this.addClass(HIDDEN_CLASS);
	}

	DockPanelOverlay.prototype.show = function (zone, left, top, width, height) {
		var style = this.node.style;
		style.top = top + 'px';
		style.left = left + 'px';
		style.width = width + 'px';
		style.height = height + 'px';
		this.removeClass(HIDDEN_CLASS);
		this._setZone(zone);
	};

	DockPanelOverlay.prototype.hide = function () {
		this.addClass(HIDDEN_CLASS);
		this._setZone(10 );
	};

	DockPanelOverlay.prototype._setZone = function (zone) {
		if (zone === this._zone) {
			return;
		}
		var oldClass = DockPanelOverlay.zoneMap[this._zone];
		var newClass = DockPanelOverlay.zoneMap[zone];
		if (oldClass)
			this.removeClass(oldClass);
		if (newClass)
			this.addClass(newClass);
		this._zone = zone;
	};

	DockPanelOverlay.zoneMap = [
		ROOT_TOP_CLASS,
		ROOT_LEFT_CLASS,
		ROOT_RIGHT_CLASS,
		ROOT_BOTTOM_CLASS,
		ROOT_CENTER_CLASS,
		PANEL_TOP_CLASS,
		PANEL_LEFT_CLASS,
		PANEL_RIGHT_CLASS,
		PANEL_BOTTOM_CLASS,
		PANEL_CENTER_CLASS
	];
	return DockPanelOverlay;
})(phosphor_nodewrapper_1.NodeWrapper);

var rootProperty = new phosphor_properties_1.Property({
	name: 'root',
	value: null,
	changed: onRootChanged,
});

var overlayProperty = new phosphor_properties_1.Property({
	name: 'overlay',
	create: createOverlay,
});

function getRoot(panel) {
	return rootProperty.get(panel);
}

function setRoot(panel, root) {
	rootProperty.set(panel, root);
}

function onRootChanged(panel, old, root) {
	if (!root)
		return;
	root.parent = panel;
	panel.currentWidget = root;
}

function getOverlay(panel) {
	return overlayProperty.get(panel);
}

function createOverlay(panel) {
	var overlay = new DockPanelOverlay();
	panel.node.appendChild(overlay.node);
	return overlay;
}

function onSpacingChanged(panel, old, spacing) {
	var root = getRoot(panel);
	if (root instanceof DockSplitPanel) {
		updateSpacing(root, spacing);
	}
}

function updateSpacing(panel, spacing) {
	var children = panel.children;
	for (var i = 0, n = children.length; i < n; ++i) {
		var child = children.get(i);
		if (child instanceof DockSplitPanel) {
			updateSpacing(child, spacing);
		}
	}
	panel.spacing = spacing;
}

function internalError() {
	throw new Error('Internal DockPanel Error.');
}

function dockPanelContains(panel, widget) {
	var stack = widget.parent;
	if (!stack) {
		return false;
	}
	var tabs = stack.parent;
	if (!(tabs instanceof DockTabPanel)) {
		return false;
	}
	var parent = tabs.parent;
	while (parent) {
		if (parent === panel) {
			return true;
		}
		if (!(parent instanceof DockSplitPanel)) {
			return false;
		}
		parent = parent.parent;
	}
	return false;
}

function findTabPanel(widget) {
	var stack = widget.parent;
	if (!stack) {
		internalError();
	}
	var tabs = stack.parent;
	if (!(tabs instanceof DockTabPanel)) {
		internalError();
	}
	return tabs;
}

function findFirstTabPanel(panel) {
	var root = getRoot(panel);
	while (root) {
		if (root instanceof DockTabPanel) {
			return root;
		}
		if (!(root instanceof DockSplitPanel) || root.children.length === 0) {
			internalError();
		}
		root = root.children.get(0);
	}
	return null;
}

function ensureFirstTabPanel(panel) {
	var tabs = findFirstTabPanel(panel);
	if (!tabs) {
		tabs = new DockTabPanel();
		setRoot(panel, tabs);
	}
	return tabs;
}

function ensureSplitRoot(panel, orientation) {
	var oldRoot = getRoot(panel);
	if (!oldRoot) {
		internalError();
	}
	if (oldRoot instanceof DockSplitPanel) {
		if (oldRoot.orientation === orientation) {
			return oldRoot;
		}
		if (oldRoot.children.length <= 1) {
			oldRoot.orientation = orientation;
			return oldRoot;
		}
	}
	var newRoot = new DockSplitPanel(orientation, panel.spacing);
	newRoot.children.add(oldRoot);
	setRoot(panel, newRoot);
	oldRoot.hidden = false;
	return newRoot;
}

function selectWidget(widget) {
	var stack = widget.parent;
	if (!stack) {
		return;
	}
	var tabs = stack.parent;
	if (!(tabs instanceof DockTabPanel)) {
		return;
	}
	tabs.currentWidget = widget;
}

function validateInsertArgs(panel, widget, ref) {
	if (!widget) {
		throw new Error('Target widget is null.');
	}
	if (ref && !dockPanelContains(panel, ref)) {
		throw new Error('Reference widget not contained by the dock panel.');
	}
}

function insertSplit(panel, widget, ref, orientation, after) {

	validateInsertArgs(panel, widget, ref);

	if (widget === ref) {
		return;
	}



	widget.parent = null;

	var tabPanel = new DockTabPanel();
	tabPanel.widgets.add(widget);

	if (!getRoot(panel)) {
		setRoot(panel, tabPanel);
		return;
	}

	if (!ref) {
		var root = ensureSplitRoot(panel, orientation);
		var sizes_1 = root.sizes();
		var count = sizes_1.length;
		arrays.insert(sizes_1, after ? count : 0, 0.5);
		root.children.insert(after ? count : 0, tabPanel);
		root.setSizes(sizes_1);
		return;
	}

	var refTabPanel = findTabPanel(ref);

	if (refTabPanel.parent === panel) {
		var root = ensureSplitRoot(panel, orientation);
		root.children.insert(after ? 1 : 0, tabPanel);
		root.setSizes([1, 1]);
		return;
	}

	if (!(refTabPanel.parent instanceof DockSplitPanel)) {
		internalError();
	}

	var splitPanel = refTabPanel.parent;


	if (splitPanel.orientation === orientation) {
		var i_1 = splitPanel.children.indexOf(refTabPanel);
		var sizes_2 = splitPanel.sizes();
		var size = sizes_2[i_1] = sizes_2[i_1] / 2;
		arrays.insert(sizes_2, after ? i_1 + 1 : i_1, size);
		splitPanel.children.insert(after ? i_1 + 1 : i_1, tabPanel);
		splitPanel.setSizes(sizes_2);
		return;
	}


	if (splitPanel.children.length === 1) {
		splitPanel.orientation = orientation;
		splitPanel.children.insert(after ? 1 : 0, tabPanel);
		splitPanel.setSizes([1, 1]);
		return;
	}

	if (splitPanel.children.length === 0) {
		internalError();
	}



	var sizes = splitPanel.sizes();
	var i = splitPanel.children.indexOf(refTabPanel);
	var childSplit = new DockSplitPanel(orientation, panel.spacing);
	childSplit.children.add(refTabPanel);
	childSplit.children.insert(after ? 1 : 0, tabPanel);
	splitPanel.children.insert(i, childSplit);
	splitPanel.setSizes(sizes);
	childSplit.setSizes([1, 1]);
}

function insertTab(panel, widget, ref, after) {

	validateInsertArgs(panel, widget, ref);

	if (widget === ref) {
		return;
	}



	widget.parent = null;

	var index;
	var tabPanel;
	if (ref) {
		tabPanel = findTabPanel(ref);
		index = tabPanel.widgets.indexOf(ref) + (after ? 1 : 0);
	}
	else {
		tabPanel = ensureFirstTabPanel(panel);
		index = after ? tabPanel.widgets.length : 0;
	}

	tabPanel.widgets.insert(index, widget);
}

function removeTabPanel(tabPanel) {

	if (tabPanel.widgets.length !== 0) {
		internalError();
	}

	if (tabPanel.parent instanceof DockPanel) {
		setRoot(tabPanel.parent, null);
		tabPanel.dispose();
		return;
	}

	if (!(tabPanel.parent instanceof DockSplitPanel)) {
		internalError();
	}

	var splitPanel = tabPanel.parent;

	if (splitPanel.children.length < 2) {
		internalError();
	}

	tabPanel.dispose();


	if (splitPanel.children.length > 1) {
		return;
	}

	var child = splitPanel.children.get(0);

	if (!(child instanceof DockTabPanel) && !(child instanceof DockSplitPanel)) {
		internalError();
	}

	if (splitPanel.parent instanceof DockPanel) {
		setRoot(splitPanel.parent, child);
		splitPanel.dispose();
		return;
	}

	if (!(splitPanel.parent instanceof DockSplitPanel)) {
		internalError();
	}

	var grandPanel = splitPanel.parent;

	if (child instanceof DockTabPanel) {
		var sizes = grandPanel.sizes();
		var index_1 = grandPanel.children.indexOf(splitPanel);
		grandPanel.children.set(index_1, child);
		grandPanel.setSizes(sizes);
		splitPanel.dispose();
		return;
	}

	var childSplit = child;


	if (childSplit.orientation !== grandPanel.orientation) {
		internalError();
	}


	var childSizes = childSplit.sizes();
	var grandSizes = grandPanel.sizes();
	var childChildren = childSplit.children;
	var grandChildren = grandPanel.children;

	var index = grandChildren.indexOf(splitPanel);
	var sizeShare = arrays.removeAt(grandSizes, index);
	splitPanel.parent = null;

	for (var i = 0; childChildren.length !== 0; ++i) {
		grandChildren.insert(index + i, childChildren.get(0));
		arrays.insert(grandSizes, index + i, sizeShare * childSizes[i]);
	}

	grandPanel.setSizes(grandSizes);
	splitPanel.dispose();
}

function iterTabPanels(root, callback) {
	if (root instanceof DockTabPanel) {
		return callback(root);
	}
	if (!(root instanceof DockSplitPanel)) {
		internalError();
	}
	var children = root.children;
	for (var i = 0; i < children.length; ++i) {
		var child = children.get(i);
		var result = iterTabPanels(child, callback);
		if (result !== void 0)
			return result;
	}
	return void 0;
}

function getEdgeZone(node, x, y) {
	var zone;
	var rect = node.getBoundingClientRect();
	if (x < rect.left + EDGE_SIZE) {
		if (y - rect.top < x - rect.left) {
			zone = 0 ;
		}
		else if (rect.bottom - y < x - rect.left) {
			zone = 3 ;
		}
		else {
			zone = 1 ;
		}
	}
	else if (x >= rect.right - EDGE_SIZE) {
		if (y - rect.top < rect.right - x) {
			zone = 0 ;
		}
		else if (rect.bottom - y < rect.right - x) {
			zone = 3 ;
		}
		else {
			zone = 2 ;
		}
	}
	else if (y < rect.top + EDGE_SIZE) {
		zone = 0 ;
	}
	else if (y >= rect.bottom - EDGE_SIZE) {
		zone = 3 ;
	}
	else {
		zone = 10 ;
	}
	return zone;
}

function getPanelZone(node, x, y) {
	var zone;
	var rect = node.getBoundingClientRect();
	var fracX = (x - rect.left) / rect.width;
	var fracY = (y - rect.top) / rect.height;
	if (fracX < 1 / 3) {
		if (fracY < fracX) {
			zone = 5 ;
		}
		else if (1 - fracY < fracX) {
			zone = 8 ;
		}
		else {
			zone = 6 ;
		}
	}
	else if (fracX < 2 / 3) {
		if (fracY < 1 / 3) {
			zone = 5 ;
		}
		else if (fracY < 2 / 3) {
			zone = 9 ;
		}
		else {
			zone = 8 ;
		}
	}
	else {
		if (fracY < 1 - fracX) {
			zone = 5 ;
		}
		else if (fracY > fracX) {
			zone = 8 ;
		}
		else {
			zone = 7 ;
		}
	}
	return zone;
}

function findDockTarget(panel, clientX, clientY) {
	var root = getRoot(panel);
	if (!root) {
		return { zone: 4 , panel: null };
	}
	if (!phosphor_domutil_1.hitTest(root.node, clientX, clientY)) {
		return { zone: 10 , panel: null };
	}
	var edgeZone = getEdgeZone(root.node, clientX, clientY);
	if (edgeZone !== 10 ) {
		return { zone: edgeZone, panel: null };
	}
	var hitPanel = iterTabPanels(root, function (tabs) {
		return phosphor_domutil_1.hitTest(tabs.node, clientX, clientY) ? tabs : void 0;
	});
	if (!hitPanel) {
		return { zone: 10 , panel: null };
	}
	var panelZone = getPanelZone(hitPanel.node, clientX, clientY);
	return { zone: panelZone, panel: hitPanel };
}

function hideOverlay(panel) {
	getOverlay(panel).hide();
}

function showOverlay(panel, clientX, clientY) {

	var target = findDockTarget(panel, clientX, clientY);

	if (target.zone === 10 ) {
		getOverlay(panel).hide();
		return target.zone;
	}

	var top;
	var left;
	var width;
	var height;
	var pcr;
	var box = phosphor_domutil_1.boxSizing(panel.node);
	var rect = panel.node.getBoundingClientRect();

	switch (target.zone) {
		case 0 :
			top = box.paddingTop;
			left = box.paddingLeft;
			width = rect.width - box.horizontalSum;
			height = (rect.height - box.verticalSum) / 3;
			break;
		case 1 :
			top = box.paddingTop;
			left = box.paddingLeft;
			width = (rect.width - box.horizontalSum) / 3;
			height = rect.height - box.verticalSum;
			break;
		case 2 :
			top = box.paddingTop;
			width = (rect.width - box.horizontalSum) / 3;
			left = box.paddingLeft + 2 * width;
			height = rect.height - box.verticalSum;
			break;
		case 3 :
			height = (rect.height - box.verticalSum) / 3;
			top = box.paddingTop + 2 * height;
			left = box.paddingLeft;
			width = rect.width - box.horizontalSum;
			break;
		case 4 :
			top = box.paddingTop;
			left = box.paddingLeft;
			width = rect.width - box.horizontalSum;
			height = rect.height - box.verticalSum;
			break;
		case 5 :
			pcr = target.panel.node.getBoundingClientRect();
			top = pcr.top - rect.top - box.borderTop;
			left = pcr.left - rect.left - box.borderLeft;
			width = pcr.width;
			height = pcr.height / 2;
			break;
		case 6 :
			pcr = target.panel.node.getBoundingClientRect();
			top = pcr.top - rect.top - box.borderTop;
			left = pcr.left - rect.left - box.borderLeft;
			width = pcr.width / 2;
			height = pcr.height;
			break;
		case 7 :
			pcr = target.panel.node.getBoundingClientRect();
			top = pcr.top - rect.top - box.borderTop;
			left = pcr.left - rect.left - box.borderLeft + pcr.width / 2;
			width = pcr.width / 2;
			height = pcr.height;
			break;
		case 8 :
			pcr = target.panel.node.getBoundingClientRect();
			top = pcr.top - rect.top - box.borderTop + pcr.height / 2;
			left = pcr.left - rect.left - box.borderLeft;
			width = pcr.width;
			height = pcr.height / 2;
			break;
		case 9 :
			pcr = target.panel.node.getBoundingClientRect();
			top = pcr.top - rect.top - box.borderTop;
			left = pcr.left - rect.left - box.borderLeft;
			width = pcr.width;
			height = pcr.height;
			break;
	}

	getOverlay(panel).show(target.zone, left, top, width, height);
	return target.zone;
}

function handleDrop(panel, widget, target) {

	if (target.zone === 10 ) {
		return;
	}

	switch (target.zone) {
		case 0 :
			panel.insertTop(widget);
			return;
		case 1 :
			panel.insertLeft(widget);
			return;
		case 2 :
			panel.insertRight(widget);
			return;
		case 3 :
			panel.insertBottom(widget);
			return;
		case 4 :
			panel.insertLeft(widget);
			return;
	}


	if (target.zone === 9 ) {
		if (target.panel.widgets.contains(widget)) {
			return;
		}
	}

	if (target.panel.widgets.length === 1) {
		if (target.panel.widgets.get(0) === widget) {
			return;
		}
	}

	var ref = target.panel.widgets.get(-1);
	if (ref === widget) {
		ref = target.panel.widgets.get(-2);
	}

	switch (target.zone) {
		case 5 :
			panel.insertTop(widget, ref);
			return;
		case 6 :
			panel.insertLeft(widget, ref);
			return;
		case 7 :
			panel.insertRight(widget, ref);
			return;
		case 8 :
			panel.insertBottom(widget, ref);
			return;
		case 9 :
			panel.insertTabAfter(widget, ref);
			selectWidget(widget);
			return;
	}
}

},{"./index.css":8,"phosphor-arrays":10,"phosphor-domutil":13,"phosphor-dragdrop":11,"phosphor-nodewrapper":25,"phosphor-properties":26,"phosphor-splitpanel":29,"phosphor-stackedpanel":32,"phosphor-tabs":34,"phosphor-widget":40}],10:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],11:[function(require,module,exports){

'use strict';
var phosphor_domutil_1 = require('phosphor-domutil');

var DRAG_IMAGE_CLASS = 'p-mod-drag-image';

(function (DropAction) {

	DropAction[DropAction["None"] = 0] = "None";

	DropAction[DropAction["Copy"] = 1] = "Copy";

	DropAction[DropAction["Link"] = 2] = "Link";

	DropAction[DropAction["Move"] = 4] = "Move";
})(exports.DropAction || (exports.DropAction = {}));
var DropAction = exports.DropAction;

(function (DropActions) {

	DropActions[DropActions["None"] = 0] = "None";

	DropActions[DropActions["Copy"] = 1] = "Copy";

	DropActions[DropActions["Link"] = 2] = "Link";

	DropActions[DropActions["Move"] = 4] = "Move";

	DropActions[DropActions["CopyLink"] = 3] = "CopyLink";

	DropActions[DropActions["CopyMove"] = 5] = "CopyMove";

	DropActions[DropActions["LinkMove"] = 6] = "LinkMove";

	DropActions[DropActions["All"] = 7] = "All";
})(exports.DropActions || (exports.DropActions = {}));
var DropActions = exports.DropActions;

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
})();
exports.MimeData = MimeData;

var Drag = (function () {

	function Drag(options) {
		this._disposed = false;
		this._source = null;
		this._mimeData = null;
		this._dragImage = null;
		this._dropAction = DropAction.None;
		this._proposedAction = DropAction.Copy;
		this._supportedActions = DropActions.Copy;
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
			var event_1 = createMouseEvent('mouseup', -1, -1);
			dispatchDragLeave(this, this._currentTarget, null, event_1);
		}

		this._finalize(DropAction.None);
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
			return Promise.resolve(DropAction.None);
		}

		if (this._promise) {
			return this._promise;
		}

		this._addListeners();

		this._attachDragImage(clientX, clientY);

		this._promise = new Promise(function (resolve, reject) {
			_this._resolve = resolve;
		});

		var event = createMouseEvent('mousemove', clientX, clientY);
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
			case 'keyup':
			case 'keypress':
			case 'mousedown':
			case 'contextmenu':

				event.preventDefault();
				event.stopPropagation();
				break;
		}
	};

	Drag.prototype._evtMouseMove = function (event) {

		event.preventDefault();
		event.stopPropagation();

		var prevTarget = this._currentTarget;

		var currTarget = this._currentTarget;

		var prevElem = this._currentElement;

		var currElem = document.elementFromPoint(event.clientX, event.clientY);

		this._currentElement = currElem;





		if (currElem !== prevElem && currElem !== currTarget) {
			currTarget = dispatchDragEnter(this, currElem, currTarget, event);
		}


		if (currTarget !== prevTarget) {
			this._currentTarget = currTarget;
			dispatchDragLeave(this, prevTarget, currTarget, event);
		}

		var action = dispatchDragOver(this, currTarget, event);
		this._setDropAction(action);


		this._moveDragImage(event.clientX, event.clientY);
	};

	Drag.prototype._evtMouseUp = function (event) {

		event.preventDefault();
		event.stopPropagation();

		if (event.button !== 0) {
			return;
		}

		if (!this._currentTarget) {
			this._finalize(DropAction.None);
			return;
		}


		if (this._dropAction === DropAction.None) {
			dispatchDragLeave(this, this._currentTarget, null, event);
			this._finalize(DropAction.None);
			return;
		}


		var action = dispatchDrop(this, this._currentTarget, event);
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
		document.addEventListener('keydown', this, true);
		document.addEventListener('keyup', this, true);
		document.addEventListener('keypress', this, true);
		document.addEventListener('contextmenu', this, true);
	};

	Drag.prototype._removeListeners = function () {
		document.removeEventListener('mousedown', this, true);
		document.removeEventListener('mousemove', this, true);
		document.removeEventListener('mouseup', this, true);
		document.removeEventListener('keydown', this, true);
		document.removeEventListener('keyup', this, true);
		document.removeEventListener('keypress', this, true);
		document.removeEventListener('contextmenu', this, true);
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
		if ((action & this._supportedActions) === 0) {
			action = DropAction.None;
		}
		if (this._override && this._dropAction === action) {
			return;
		}
		switch (action) {
			case DropAction.None:
				this._dropAction = action;
				this._override = phosphor_domutil_1.overrideCursor('no-drop');
				break;
			case DropAction.Copy:
				this._dropAction = action;
				this._override = phosphor_domutil_1.overrideCursor('copy');
				break;
			case DropAction.Link:
				this._dropAction = action;
				this._override = phosphor_domutil_1.overrideCursor('alias');
				break;
			case DropAction.Move:
				this._dropAction = action;
				this._override = phosphor_domutil_1.overrideCursor('move');
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
		this._dropAction = DropAction.None;
		this._proposedAction = DropAction.None;
		this._supportedActions = DropActions.None;
		this._override = null;
		this._currentTarget = null;
		this._currentElement = null;
		this._promise = null;
		this._resolve = null;

		if (resolve)
			resolve(action);
	};
	return Drag;
})();
exports.Drag = Drag;

function createMouseEvent(type, clientX, clientY) {
	var event = document.createEvent('MouseEvent');
	event.initMouseEvent(type, true, true, window, 0, 0, 0, clientX, clientY, false, false, false, false, 0, null);
	return event;
}

function createDragEvent(type, drag, event, related) {

	var dragEvent = document.createEvent('MouseEvent');

	dragEvent.initMouseEvent(type, true, true, window, 0, event.screenX, event.screenY, event.clientX, event.clientY, event.ctrlKey, event.altKey, event.shiftKey, event.metaKey, event.button, related);

	dragEvent.mimeData = drag.mimeData;
	dragEvent.dropAction = DropAction.None;
	dragEvent.proposedAction = drag.proposedAction;
	dragEvent.supportedActions = drag.supportedActions;
	dragEvent.source = drag.source;

	return dragEvent;
}

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

function dispatchDragLeave(drag, prevTarget, currTarget, event) {

	if (!prevTarget) {
		return;
	}

	var dragEvent = createDragEvent('p-dragleave', drag, event, currTarget);
	prevTarget.dispatchEvent(dragEvent);
}

function dispatchDragOver(drag, currTarget, event) {

	if (!currTarget) {
		return DropAction.None;
	}

	var dragEvent = createDragEvent('p-dragover', drag, event, null);
	var canceled = !currTarget.dispatchEvent(dragEvent);

	if (canceled) {
		return dragEvent.dropAction;
	}

	return DropAction.None;
}

function dispatchDrop(drag, currTarget, event) {

	if (!currTarget) {
		return DropAction.None;
	}

	var dragEvent = createDragEvent('p-drop', drag, event, null);
	var canceled = !currTarget.dispatchEvent(dragEvent);

	if (canceled) {
		return dragEvent.dropAction;
	}

	return DropAction.None;
}

},{"phosphor-domutil":13}],12:[function(require,module,exports){
var css = "body.p-mod-override-cursor *{cursor:inherit!important}"; (require("browserify-css").createStyle(css, { "href": "node_modules\\phosphor-domutil\\lib\\index.css"})); module.exports = css;
},{"browserify-css":2}],13:[function(require,module,exports){

'use strict';
var phosphor_disposable_1 = require('phosphor-disposable');
require('./index.css');

var OVERRIDE_CURSOR_CLASS = 'p-mod-override-cursor';

var overrideID = 0;

function overrideCursor(cursor) {
	var id = ++overrideID;
	var body = document.body;
	body.style.cursor = cursor;
	body.classList.add(OVERRIDE_CURSOR_CLASS);
	return new phosphor_disposable_1.DisposableDelegate(function () {
		if (id === overrideID) {
			body.style.cursor = '';
			body.classList.remove(OVERRIDE_CURSOR_CLASS);
		}
	});
}
exports.overrideCursor = overrideCursor;

function hitTest(node, clientX, clientY) {
	var rect = node.getBoundingClientRect();
	return (clientX >= rect.left &&
		clientX < rect.right &&
		clientY >= rect.top &&
		clientY < rect.bottom);
}
exports.hitTest = hitTest;

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
		verticalSum: vs,
	};
}
exports.boxSizing = boxSizing;

function sizeLimits(node) {
	var cstyle = window.getComputedStyle(node);
	return {
		minWidth: parseInt(cstyle.minWidth, 10) || 0,
		minHeight: parseInt(cstyle.minHeight, 10) || 0,
		maxWidth: parseInt(cstyle.maxWidth, 10) || Infinity,
		maxHeight: parseInt(cstyle.maxHeight, 10) || Infinity,
	};
}
exports.sizeLimits = sizeLimits;

},{"./index.css":12,"phosphor-disposable":7}],14:[function(require,module,exports){
var css = ".p-GridPanel{position:relative}.p-GridPanel>.p-Widget{position:absolute}"; (require("browserify-css").createStyle(css, { "href": "node_modules\\phosphor-gridpanel\\lib\\index.css"})); module.exports = css;
},{"browserify-css":2}],15:[function(require,module,exports){

'use strict';
var __extends = (this && this.__extends) || function (d, b) {
	for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	function __() { this.constructor = d; }
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var phosphor_boxengine_1 = require('phosphor-boxengine');
var phosphor_domutil_1 = require('phosphor-domutil');
var phosphor_messaging_1 = require('phosphor-messaging');
var phosphor_properties_1 = require('phosphor-properties');
var phosphor_signaling_1 = require('phosphor-signaling');
var phosphor_widget_1 = require('phosphor-widget');
require('./index.css');

var GRID_PANEL_CLASS = 'p-GridPanel';

var GridPanel = (function (_super) {
	__extends(GridPanel, _super);

	function GridPanel() {
		_super.call(this);
		this._box = null;
		this._rowStarts = [];
		this._colStarts = [];
		this._rowSizers = [];
		this._colSizers = [];
		this.addClass(GRID_PANEL_CLASS);
	}

	GridPanel.getRow = function (widget) {
		return GridPanel.rowProperty.get(widget);
	};

	GridPanel.setRow = function (widget, value) {
		GridPanel.rowProperty.set(widget, value);
	};

	GridPanel.getColumn = function (widget) {
		return GridPanel.columnProperty.get(widget);
	};

	GridPanel.setColumn = function (widget, value) {
		GridPanel.columnProperty.set(widget, value);
	};

	GridPanel.getRowSpan = function (widget) {
		return GridPanel.rowSpanProperty.get(widget);
	};

	GridPanel.setRowSpan = function (widget, value) {
		GridPanel.rowSpanProperty.set(widget, value);
	};

	GridPanel.getColumnSpan = function (widget) {
		return GridPanel.columnSpanProperty.get(widget);
	};

	GridPanel.setColumnSpan = function (widget, value) {
		GridPanel.columnSpanProperty.set(widget, value);
	};

	GridPanel.prototype.dispose = function () {
		this._rowStarts.length = 0;
		this._colStarts.length = 0;
		this._rowSizers.length = 0;
		this._colSizers.length = 0;
		_super.prototype.dispose.call(this);
	};
	Object.defineProperty(GridPanel.prototype, "rowSpecs", {

		get: function () {
			return GridPanel.rowSpecsProperty.get(this);
		},

		set: function (value) {
			GridPanel.rowSpecsProperty.set(this, value);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(GridPanel.prototype, "columnSpecs", {

		get: function () {
			return GridPanel.columnSpecsProperty.get(this);
		},

		set: function (value) {
			GridPanel.columnSpecsProperty.set(this, value);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(GridPanel.prototype, "rowSpacing", {

		get: function () {
			return GridPanel.rowSpacingProperty.get(this);
		},

		set: function (value) {
			GridPanel.rowSpacingProperty.set(this, value);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(GridPanel.prototype, "columnSpacing", {

		get: function () {
			return GridPanel.columnSpacingProperty.get(this);
		},

		set: function (value) {
			GridPanel.columnSpacingProperty.set(this, value);
		},
		enumerable: true,
		configurable: true
	});

	GridPanel.prototype.onChildAdded = function (msg) {
		this.node.appendChild(msg.child.node);
		if (this.isAttached)
			phosphor_messaging_1.sendMessage(msg.child, phosphor_widget_1.Widget.MsgAfterAttach);
		phosphor_messaging_1.postMessage(this, phosphor_widget_1.Widget.MsgUpdateRequest);
	};

	GridPanel.prototype.onChildMoved = function (msg) { };

	GridPanel.prototype.onChildRemoved = function (msg) {
		if (this.isAttached)
			phosphor_messaging_1.sendMessage(msg.child, phosphor_widget_1.Widget.MsgBeforeDetach);
		this.node.removeChild(msg.child.node);
		resetGeometry(msg.child);
	};

	GridPanel.prototype.onAfterShow = function (msg) {
		_super.prototype.onAfterShow.call(this, msg);
		phosphor_messaging_1.sendMessage(this, phosphor_widget_1.Widget.MsgUpdateRequest);
	};

	GridPanel.prototype.onAfterAttach = function (msg) {
		_super.prototype.onAfterAttach.call(this, msg);
		phosphor_messaging_1.postMessage(this, phosphor_widget_1.Panel.MsgLayoutRequest);
	};

	GridPanel.prototype.onChildShown = function (msg) {
		phosphor_messaging_1.postMessage(this, phosphor_widget_1.Widget.MsgUpdateRequest);
	};

	GridPanel.prototype.onResize = function (msg) {
		if (this.isVisible) {
			var width = msg.width < 0 ? this.node.offsetWidth : msg.width;
			var height = msg.height < 0 ? this.node.offsetHeight : msg.height;
			this._layoutChildren(width, height);
		}
	};

	GridPanel.prototype.onUpdateRequest = function (msg) {
		if (this.isVisible) {
			this._layoutChildren(this.node.offsetWidth, this.node.offsetHeight);
		}
	};

	GridPanel.prototype.onLayoutRequest = function (msg) {
		if (this.isAttached) {
			this._setupGeometry();
		}
	};

	GridPanel.prototype._setupGeometry = function () {

		var minW = 0;
		var minH = 0;
		var maxW = Infinity;
		var maxH = Infinity;

		var rowSpecs = this.rowSpecs;
		if (rowSpecs.length > 0) {
			var fixed = this.rowSpacing * (rowSpecs.length - 1);
			minH = rowSpecs.reduce(function (s, spec) { return s + spec.minSize; }, 0) + fixed;
			maxH = rowSpecs.reduce(function (s, spec) { return s + spec.maxSize; }, 0) + fixed;
		}

		var colSpecs = this.columnSpecs;
		if (colSpecs.length > 0) {
			var fixed = this.columnSpacing * (colSpecs.length - 1);
			minW = colSpecs.reduce(function (s, spec) { return s + spec.minSize; }, 0) + fixed;
			maxW = colSpecs.reduce(function (s, spec) { return s + spec.maxSize; }, 0) + fixed;
		}

		for (var i = 0, n = this.childCount(); i < n; ++i) {
			var widget = this.childAt(i);
			setLimits(widget, phosphor_domutil_1.sizeLimits(widget.node));
		}

		this._rowStarts = zeros(rowSpecs.length);
		this._colStarts = zeros(colSpecs.length);
		this._rowSizers = rowSpecs.map(makeSizer);
		this._colSizers = colSpecs.map(makeSizer);

		this._box = phosphor_domutil_1.boxSizing(this.node);
		minW += this._box.horizontalSum;
		minH += this._box.verticalSum;
		maxW += this._box.horizontalSum;
		maxH += this._box.verticalSum;

		var style = this.node.style;
		style.minWidth = minW + 'px';
		style.minHeight = minH + 'px';
		style.maxWidth = maxW === Infinity ? 'none' : maxW + 'px';
		style.maxHeight = maxH === Infinity ? 'none' : maxH + 'px';

		if (this.parent)
			phosphor_messaging_1.sendMessage(this.parent, phosphor_widget_1.Panel.MsgLayoutRequest);

		phosphor_messaging_1.sendMessage(this, phosphor_widget_1.Widget.MsgUpdateRequest);
	};

	GridPanel.prototype._layoutChildren = function (offsetWidth, offsetHeight) {

		if (this.childCount() === 0) {
			return;
		}

		var box = this._box || (this._box = phosphor_domutil_1.boxSizing(this.node));

		var top = box.paddingTop;
		var left = box.paddingLeft;
		var width = offsetWidth - box.horizontalSum;
		var height = offsetHeight - box.verticalSum;

		if (this._rowSizers.length === 0 || this._colSizers.length === 0) {
			for (var i = 0, n = this.childCount(); i < n; ++i) {
				var widget = this.childAt(i);
				var limits = getLimits(widget);
				var w = Math.max(limits.minWidth, Math.min(width, limits.maxWidth));
				var h = Math.max(limits.minHeight, Math.min(height, limits.maxHeight));
				setGeometry(widget, left, top, w, h);
			}
			return;
		}

		var rowPos = top;
		var rowStarts = this._rowStarts;
		var rowSizers = this._rowSizers;
		var rowSpacing = this.rowSpacing;
		phosphor_boxengine_1.boxCalc(rowSizers, height - rowSpacing * (rowSizers.length - 1));
		for (var i = 0, n = rowSizers.length; i < n; ++i) {
			rowStarts[i] = rowPos;
			rowPos += rowSizers[i].size + rowSpacing;
		}

		var colPos = left;
		var colStarts = this._colStarts;
		var colSizers = this._colSizers;
		var colSpacing = this.columnSpacing;
		phosphor_boxengine_1.boxCalc(colSizers, width - colSpacing * (colSizers.length - 1));
		for (var i = 0, n = colSizers.length; i < n; ++i) {
			colStarts[i] = colPos;
			colPos += colSizers[i].size + colSpacing;
		}

		var maxRow = rowSizers.length - 1;
		var maxCol = colSizers.length - 1;
		for (var i = 0, n = this.childCount(); i < n; ++i) {

			var widget = this.childAt(i);

			var r1 = Math.max(0, Math.min(GridPanel.getRow(widget), maxRow));
			var r2 = Math.min(r1 + GridPanel.getRowSpan(widget) - 1, maxRow);
			var y = rowStarts[r1];
			var h = rowStarts[r2] + rowSizers[r2].size - y;

			var c1 = Math.max(0, Math.min(GridPanel.getColumn(widget), maxCol));
			var c2 = Math.min(c1 + GridPanel.getColumnSpan(widget) - 1, maxCol);
			var x = colStarts[c1];
			var w = colStarts[c2] + colSizers[c2].size - x;

			var limits = getLimits(widget);
			w = Math.max(limits.minWidth, Math.min(w, limits.maxWidth));
			h = Math.max(limits.minHeight, Math.min(h, limits.maxHeight));
			setGeometry(widget, x, y, w, h);
		}
	};

	GridPanel.prototype._onRowSpecsChanged = function (old, specs) {
		for (var i = 0, n = old.length; i < n; ++i) {
			if (specs.indexOf(old[i]) === -1) {
				old[i].changed.disconnect(this._onRowSpecChanged, this);
			}
		}
		for (var i = 0, n = specs.length; i < n; ++i) {
			if (old.indexOf(specs[i]) === -1) {
				specs[i].changed.connect(this._onRowSpecChanged, this);
			}
		}
		phosphor_messaging_1.postMessage(this, phosphor_widget_1.Panel.MsgLayoutRequest);
	};

	GridPanel.prototype._onColSpecsChanged = function (old, specs) {
		for (var i = 0, n = old.length; i < n; ++i) {
			if (specs.indexOf(old[i]) === -1) {
				old[i].changed.disconnect(this._onColSpecChanged, this);
			}
		}
		for (var i = 0, n = specs.length; i < n; ++i) {
			if (old.indexOf(specs[i]) === -1) {
				specs[i].changed.connect(this._onColSpecChanged, this);
			}
		}
		phosphor_messaging_1.postMessage(this, phosphor_widget_1.Panel.MsgLayoutRequest);
	};

	GridPanel.prototype._onRowSpecChanged = function (sender, args) {
		phosphor_messaging_1.postMessage(this, phosphor_widget_1.Panel.MsgLayoutRequest);
	};

	GridPanel.prototype._onColSpecChanged = function (sender, args) {
		phosphor_messaging_1.postMessage(this, phosphor_widget_1.Panel.MsgLayoutRequest);
	};

	GridPanel.rowSpecsProperty = new phosphor_properties_1.Property({
		name: 'rowSpecs',
		value: Object.freeze([]),
		coerce: function (owner, value) { return Object.freeze(value ? value.slice() : []); },
		changed: function (owner, old, value) { owner._onRowSpecsChanged(old, value); },
	});

	GridPanel.columnSpecsProperty = new phosphor_properties_1.Property({
		name: 'columnSpecs',
		value: Object.freeze([]),
		coerce: function (owner, value) { return Object.freeze(value ? value.slice() : []); },
		changed: function (owner, old, value) { owner._onColSpecsChanged(old, value); },
	});

	GridPanel.rowSpacingProperty = new phosphor_properties_1.Property({
		name: 'rowSpacing',
		value: 8,
		coerce: function (owner, value) { return Math.max(0, value | 0); },
		changed: function (owner) { phosphor_messaging_1.postMessage(owner, phosphor_widget_1.Panel.MsgLayoutRequest); },
	});

	GridPanel.columnSpacingProperty = new phosphor_properties_1.Property({
		name: 'columnSpacing',
		value: 8,
		coerce: function (owner, value) { return Math.max(0, value | 0); },
		changed: function (owner) { phosphor_messaging_1.postMessage(owner, phosphor_widget_1.Panel.MsgLayoutRequest); },
	});

	GridPanel.rowProperty = new phosphor_properties_1.Property({
		name: 'row',
		value: 0,
		coerce: function (owner, value) { return Math.max(0, value | 0); },
		changed: onChildPropertyChanged,
	});

	GridPanel.columnProperty = new phosphor_properties_1.Property({
		name: 'column',
		value: 0,
		coerce: function (owner, value) { return Math.max(0, value | 0); },
		changed: onChildPropertyChanged,
	});

	GridPanel.rowSpanProperty = new phosphor_properties_1.Property({
		name: 'rowSpan',
		value: 1,
		coerce: function (owner, value) { return Math.max(1, value | 0); },
		changed: onChildPropertyChanged,
	});

	GridPanel.columnSpanProperty = new phosphor_properties_1.Property({
		name: 'columnSpan',
		value: 1,
		coerce: function (owner, value) { return Math.max(1, value | 0); },
		changed: onChildPropertyChanged,
	});
	return GridPanel;
})(phosphor_widget_1.Panel);
exports.GridPanel = GridPanel;

var Spec = (function () {

	function Spec(options) {
		if (options === void 0) { options = {}; }
		if (options.sizeBasis !== void 0) {
			this.sizeBasis = options.sizeBasis;
		}
		if (options.minSize !== void 0) {
			this.minSize = options.minSize;
		}
		if (options.maxSize !== void 0) {
			this.maxSize = options.maxSize;
		}
		if (options.stretch !== void 0) {
			this.stretch = options.stretch;
		}
	}
	Object.defineProperty(Spec.prototype, "changed", {

		get: function () {
			return Spec.changedSignal.bind(this);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(Spec.prototype, "sizeBasis", {

		get: function () {
			return Spec.sizeBasisProperty.get(this);
		},

		set: function (value) {
			Spec.sizeBasisProperty.set(this, value);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(Spec.prototype, "minSize", {

		get: function () {
			return Spec.minSizeProperty.get(this);
		},

		set: function (value) {
			Spec.minSizeProperty.set(this, value);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(Spec.prototype, "maxSize", {

		get: function () {
			return Spec.maxSizeProperty.get(this);
		},

		set: function (value) {
			Spec.maxSizeProperty.set(this, value);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(Spec.prototype, "stretch", {

		get: function () {
			return Spec.stretchProperty.get(this);
		},

		set: function (value) {
			Spec.stretchProperty.set(this, value);
		},
		enumerable: true,
		configurable: true
	});

	Spec.changedSignal = new phosphor_signaling_1.Signal();

	Spec.sizeBasisProperty = new phosphor_properties_1.Property({
		name: 'sizeBasis',
		value: 0,
		notify: Spec.changedSignal,
	});

	Spec.minSizeProperty = new phosphor_properties_1.Property({
		name: 'minSize',
		value: 0,
		coerce: function (owner, value) { return Math.max(0, value); },
		notify: Spec.changedSignal,
	});

	Spec.maxSizeProperty = new phosphor_properties_1.Property({
		name: 'maxSize',
		value: Infinity,
		coerce: function (owner, value) { return Math.max(0, value); },
		notify: Spec.changedSignal,
	});

	Spec.stretchProperty = new phosphor_properties_1.Property({
		name: 'stretch',
		value: 1,
		coerce: function (owner, value) { return Math.max(0, value | 0); },
		notify: Spec.changedSignal,
	});
	return Spec;
})();
exports.Spec = Spec;

var rectProperty = new phosphor_properties_1.Property({
	name: 'rect',
	create: createRect,
});

var limitsProperty = new phosphor_properties_1.Property({
	name: 'limits',
	create: function (owner) { return phosphor_domutil_1.sizeLimits(owner.node); },
});

function createRect() {
	return { top: NaN, left: NaN, width: NaN, height: NaN };
}

function getRect(widget) {
	return rectProperty.get(widget);
}

function getLimits(widget) {
	return limitsProperty.get(widget);
}

function setLimits(widget, value) {
	return limitsProperty.set(widget, value);
}

function setGeometry(widget, left, top, width, height) {
	var resized = false;
	var rect = getRect(widget);
	var style = widget.node.style;
	if (rect.top !== top) {
		rect.top = top;
		style.top = top + 'px';
	}
	if (rect.left !== left) {
		rect.left = left;
		style.left = left + 'px';
	}
	if (rect.width !== width) {
		resized = true;
		rect.width = width;
		style.width = width + 'px';
	}
	if (rect.height !== height) {
		resized = true;
		rect.height = height;
		style.height = height + 'px';
	}
	if (resized) {
		phosphor_messaging_1.sendMessage(widget, new phosphor_widget_1.ResizeMessage(width, height));
	}
}

function resetGeometry(widget) {
	var rect = getRect(widget);
	var style = widget.node.style;
	rect.top = NaN;
	rect.left = NaN;
	rect.width = NaN;
	rect.height = NaN;
	style.top = '';
	style.left = '';
	style.width = '';
	style.height = '';
}

function onChildPropertyChanged(child) {
	if (child.parent instanceof GridPanel) {
		phosphor_messaging_1.postMessage(child.parent, phosphor_widget_1.Widget.MsgUpdateRequest);
	}
}

function zeros(n) {
	var arr = new Array(n);
	for (var i = 0; i < n; ++i)
		arr[i] = 0;
	return arr;
}

function makeSizer(spec) {
	var sizer = new phosphor_boxengine_1.BoxSizer();
	sizer.sizeHint = spec.sizeBasis;
	sizer.minSize = spec.minSize;
	sizer.maxSize = spec.maxSize;
	sizer.stretch = spec.stretch;
	sizer.maxSize = Math.max(sizer.minSize, sizer.maxSize);
	return sizer;
}

},{"./index.css":14,"phosphor-boxengine":3,"phosphor-domutil":13,"phosphor-messaging":23,"phosphor-properties":26,"phosphor-signaling":27,"phosphor-widget":40}],16:[function(require,module,exports){
var css = ".p-MenuBar-content{margin:0;padding:0;display:flex;flex-direction:row;list-style-type:none}.p-MenuBar-item{box-sizing:border-box}.p-MenuBar-item.p-mod-collapsed,.p-MenuBar-item.p-mod-hidden{display:none}.p-Menu{position:absolute;top:0;left:0;padding:3px 0;white-space:nowrap;overflow-x:hidden;overflow-y:auto;z-index:100000}.p-Menu-content{display:table;width:100%;margin:0;padding:0;border-spacing:0;list-style-type:none}.p-Menu-item{display:table-row}.p-Menu-item.p-mod-collapsed{display:none}.p-Menu-item>span{display:table-cell;padding-top:4px;padding-bottom:4px}.p-Menu-item-icon{width:21px;padding-left:2px;padding-right:2px;text-align:center}.p-Menu-item-text{padding-left:2px;padding-right:35px}.p-Menu-item-shortcut{text-align:right}.p-Menu-item-submenu{width:16px;text-align:center}.p-Menu-item.p-mod-separator-type>span{padding:0;height:9px;line-height:0;text-indent:100%;overflow:hidden;whitespace:nowrap;vertical-align:top}.p-Menu-item.p-mod-separator-type>span::after{content:'';display:block;position:relative;top:4px}"; (require("browserify-css").createStyle(css, { "href": "node_modules\\phosphor-menus\\lib\\index.css"})); module.exports = css;
},{"browserify-css":2}],17:[function(require,module,exports){

'use strict';
function __export(m) {
	for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(require('./menu'));
__export(require('./menubar'));
__export(require('./menubase'));
__export(require('./menuitem'));
require('./index.css');

},{"./index.css":16,"./menu":18,"./menubar":19,"./menubase":20,"./menuitem":21}],18:[function(require,module,exports){

'use strict';
var __extends = (this && this.__extends) || function (d, b) {
	for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	function __() { this.constructor = d; }
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var phosphor_domutil_1 = require('phosphor-domutil');
var phosphor_messaging_1 = require('phosphor-messaging');
var phosphor_signaling_1 = require('phosphor-signaling');
var phosphor_widget_1 = require('phosphor-widget');
var menubase_1 = require('./menubase');
var menuitem_1 = require('./menuitem');

var MENU_CLASS = 'p-Menu';

var CONTENT_CLASS = 'p-Menu-content';

var ITEM_CLASS = 'p-Menu-item';

var ICON_CLASS = 'p-Menu-item-icon';

var TEXT_CLASS = 'p-Menu-item-text';

var SHORTCUT_CLASS = 'p-Menu-item-shortcut';

var SUBMENU_CLASS = 'p-Menu-item-submenu';

var CHECK_TYPE_CLASS = 'p-mod-check-type';

var SEPARATOR_TYPE_CLASS = 'p-mod-separator-type';

var SUBMENU_TYPE_CLASS = 'p-mod-submenu-type';

var ACTIVE_CLASS = 'p-mod-active';

var DISABLED_CLASS = 'p-mod-disabled';

var CHECKED_CLASS = 'p-mod-checked';

var OPEN_DELAY = 300;

var CLOSE_DELAY = 300;

var SUBMENU_OVERLAP = 3;

var Menu = (function (_super) {
	__extends(Menu, _super);

	function Menu(items) {
		_super.call(this);
		this._openTimerId = 0;
		this._closeTimerId = 0;
		this._parentMenu = null;
		this._childMenu = null;
		this._childItem = null;
		this._nodes = [];
		this.addClass(MENU_CLASS);
		if (items)
			this.items = items;
	}

	Menu.createNode = function () {
		var node = document.createElement('div');
		var content = document.createElement('ul');
		content.className = CONTENT_CLASS;
		node.appendChild(content);
		return node;
	};

	Menu.prototype.dispose = function () {
		this.close();
		_super.prototype.dispose.call(this);
	};
	Object.defineProperty(Menu.prototype, "closed", {

		get: function () {
			return Menu.closedSignal.bind(this);
		},
		enumerable: true,
		configurable: true
	});
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

	Menu.prototype.popup = function (x, y, forceX, forceY) {
		if (forceX === void 0) { forceX = false; }
		if (forceY === void 0) { forceY = false; }
		if (!this.isAttached) {
			document.addEventListener('keydown', this, true);
			document.addEventListener('keypress', this, true);
			document.addEventListener('mousedown', this, true);
			openRootMenu(this, x, y, forceX, forceY);
		}
	};

	Menu.prototype.open = function (x, y, forceX, forceY) {
		if (forceX === void 0) { forceX = false; }
		if (forceY === void 0) { forceY = false; }
		if (!this.isAttached) {
			openRootMenu(this, x, y, forceX, forceY);
		}
	};

	Menu.prototype.handleEvent = function (event) {
		switch (event.type) {
			case 'mouseenter':
				this._evtMouseEnter(event);
				break;
			case 'mouseleave':
				this._evtMouseLeave(event);
				break;
			case 'mousedown':
				this._evtMouseDown(event);
				break;
			case 'mouseup':
				this._evtMouseUp(event);
				break;
			case 'contextmenu':
				event.preventDefault();
				event.stopPropagation();
				break;
			case 'keydown':
				this._evtKeyDown(event);
				break;
			case 'keypress':
				this._evtKeyPress(event);
				break;
		}
	};

	Menu.prototype.isSelectable = function (item) {
		if (item.type === menuitem_1.MenuItem.Separator) {
			return false;
		}
		if (item.type === menuitem_1.MenuItem.Submenu) {
			return true;
		}
		return item.command ? item.command.isEnabled() : false;
	};

	Menu.prototype.onItemsChanged = function (old, items) {
		this.close();
	};

	Menu.prototype.onActiveIndexChanged = function (old, index) {
		var oldNode = this._nodes[old];
		var newNode = this._nodes[index];
		if (oldNode)
			oldNode.classList.remove(ACTIVE_CLASS);
		if (newNode)
			newNode.classList.add(ACTIVE_CLASS);
	};

	Menu.prototype.onOpenItem = function (index, item) {
		if (this.isAttached && item.submenu) {
			var ref = this._nodes[index] || this.node;
			this._openChildMenu(item, ref, false);
			this._childMenu.activateNextItem();
		}
	};

	Menu.prototype.onTriggerItem = function (index, item) {
		this.rootMenu.close();
		var cmd = item.command;
		var args = item.commandArgs;
		if (cmd && cmd.isEnabled())
			cmd.execute(args);
	};

	Menu.prototype.onAfterAttach = function (msg) {
		this.node.addEventListener('mouseup', this);
		this.node.addEventListener('mouseleave', this);
		this.node.addEventListener('contextmenu', this);
	};

	Menu.prototype.onBeforeDetach = function (msg) {
		this.node.removeEventListener('mouseup', this);
		this.node.removeEventListener('mouseleave', this);
		this.node.removeEventListener('contextmenu', this);
		document.removeEventListener('keydown', this, true);
		document.removeEventListener('keypress', this, true);
		document.removeEventListener('mousedown', this, true);
	};

	Menu.prototype.onUpdateRequest = function (msg) {

		var items = this.items;
		var nodes = this._nodes;
		var content = this.contentNode;

		while (nodes.length > items.length) {
			var node = nodes.pop();
			content.removeChild(node);
		}

		while (nodes.length < items.length) {
			var node = createItemNode();
			nodes.push(node);
			content.appendChild(node);
			node.addEventListener('mouseenter', this);
		}

		for (var i = 0, n = items.length; i < n; ++i) {
			updateItemNode(items[i], nodes[i]);
		}

		var active = nodes[this.activeIndex];
		if (active)
			active.classList.add(ACTIVE_CLASS);

		menubase_1.collapseSeparators(items, nodes);
	};

	Menu.prototype.onCloseRequest = function (msg) {

		this._cancelPendingOpen();
		this._cancelPendingClose();
		this.activeIndex = -1;

		var childMenu = this._childMenu;
		if (childMenu) {
			this._childMenu = null;
			this._childItem = null;
			childMenu._parentMenu = null;
			childMenu.close();
		}

		var parentMenu = this._parentMenu;
		if (parentMenu) {
			this._parentMenu = null;
			parentMenu._cancelPendingOpen();
			parentMenu._cancelPendingClose();
			parentMenu._childMenu = null;
			parentMenu._childItem = null;
		}

		if (this.parent) {
			this.remove();
			this.closed.emit(void 0);
		}
		else if (this.isAttached) {
			this.detach();
			this.closed.emit(void 0);
		}
	};

	Menu.prototype._evtMouseEnter = function (event) {
		this._syncAncestors();
		this._closeChildMenu();
		this._cancelPendingOpen();
		var node = event.currentTarget;
		this.activeIndex = this._nodes.indexOf(node);
		var item = this.items[this.activeIndex];
		if (item && item.submenu) {
			if (item === this._childItem) {
				this._cancelPendingClose();
			}
			else {
				this._openChildMenu(item, node, true);
			}
		}
	};

	Menu.prototype._evtMouseLeave = function (event) {
		this._cancelPendingOpen();
		var child = this._childMenu;
		if (!child || !phosphor_domutil_1.hitTest(child.node, event.clientX, event.clientY)) {
			this.activeIndex = -1;
			this._closeChildMenu();
		}
	};

	Menu.prototype._evtMouseUp = function (event) {
		event.preventDefault();
		event.stopPropagation();
		if (event.button !== 0) {
			return;
		}
		var node = this._nodes[this.activeIndex];
		if (node && node.contains(event.target)) {
			this.triggerActiveItem();
		}
	};

	Menu.prototype._evtMouseDown = function (event) {
		var menu = this;
		var hit = false;
		var x = event.clientX;
		var y = event.clientY;
		while (!hit && menu) {
			hit = phosphor_domutil_1.hitTest(menu.node, x, y);
			menu = menu._childMenu;
		}
		if (!hit)
			this.close();
	};

	Menu.prototype._evtKeyDown = function (event) {
		event.stopPropagation();
		var leaf = this.leafMenu;
		switch (event.keyCode) {
			case 13:
				event.preventDefault();
				leaf.triggerActiveItem();
				break;
			case 27:
				event.preventDefault();
				leaf.close();
				break;
			case 37:
				event.preventDefault();
				if (leaf !== this)
					leaf.close();
				break;
			case 38:
				event.preventDefault();
				leaf.activatePreviousItem();
				break;
			case 39:
				event.preventDefault();
				leaf.openActiveItem();
				break;
			case 40:
				event.preventDefault();
				leaf.activateNextItem();
				break;
		}
	};

	Menu.prototype._evtKeyPress = function (event) {
		event.preventDefault();
		event.stopPropagation();
		var key = String.fromCharCode(event.charCode);
		this.leafMenu.activateMnemonicItem(key);
	};

	Menu.prototype._syncAncestors = function () {
		var menu = this._parentMenu;
		while (menu) {
			menu._syncChildItem();
			menu = menu._parentMenu;
		}
	};

	Menu.prototype._syncChildItem = function () {
		this._cancelPendingOpen();
		this._cancelPendingClose();
		this.activeIndex = this.items.indexOf(this._childItem);
	};

	Menu.prototype._openChildMenu = function (item, node, delayed) {
		var _this = this;
		if (item === this._childItem) {
			return;
		}
		this._cancelPendingOpen();
		if (delayed) {
			this._openTimerId = setTimeout(function () {
				var menu = item.submenu;
				_this._openTimerId = 0;
				_this._childItem = item;
				_this._childMenu = menu;
				menu._parentMenu = _this;
				openSubmenu(menu, node);
			}, OPEN_DELAY);
		}
		else {
			var menu = item.submenu;
			this._childItem = item;
			this._childMenu = menu;
			menu._parentMenu = this;
			openSubmenu(menu, node);
		}
	};

	Menu.prototype._closeChildMenu = function () {
		var _this = this;
		if (this._closeTimerId || !this._childMenu) {
			return;
		}
		this._closeTimerId = setTimeout(function () {
			_this._closeTimerId = 0;
			var childMenu = _this._childMenu;
			if (childMenu) {
				_this._childMenu = null;
				_this._childItem = null;
				childMenu._parentMenu = null;
				childMenu.close();
			}
		}, CLOSE_DELAY);
	};

	Menu.prototype._cancelPendingOpen = function () {
		if (this._openTimerId) {
			clearTimeout(this._openTimerId);
			this._openTimerId = 0;
		}
	};

	Menu.prototype._cancelPendingClose = function () {
		if (this._closeTimerId) {
			clearTimeout(this._closeTimerId);
			this._closeTimerId = 0;
		}
	};

	Menu.closedSignal = new phosphor_signaling_1.Signal();
	return Menu;
})(menubase_1.MenuBase);
exports.Menu = Menu;

function createItemNode() {
	var node = document.createElement('li');
	var icon = document.createElement('span');
	var text = document.createElement('span');
	var shortcut = document.createElement('span');
	var submenu = document.createElement('span');
	text.className = TEXT_CLASS;
	shortcut.className = SHORTCUT_CLASS;
	submenu.className = SUBMENU_CLASS;
	node.appendChild(icon);
	node.appendChild(text);
	node.appendChild(shortcut);
	node.appendChild(submenu);
	return node;
}

function createItemClass(item) {
	var parts = [ITEM_CLASS];
	if (item.className) {
		parts.push(item.className);
	}
	if (item.type === menuitem_1.MenuItem.Separator) {
		parts.push(SEPARATOR_TYPE_CLASS);
		return parts.join(' ');
	}
	if (item.type === menuitem_1.MenuItem.Submenu) {
		parts.push(SUBMENU_TYPE_CLASS);
		return parts.join(' ');
	}
	if (item.type === menuitem_1.MenuItem.Check) {
		parts.push(CHECK_TYPE_CLASS);
		if (item.command && item.command.isChecked()) {
			parts.push(CHECKED_CLASS);
		}
	}
	if (!item.command || !item.command.isEnabled()) {
		parts.push(DISABLED_CLASS);
	}
	return parts.join(' ');
}

function createIconClass(item) {
	return item.icon ? (ICON_CLASS + ' ' + item.icon) : ICON_CLASS;
}

function createTextContent(item) {
	if (item.type === menuitem_1.MenuItem.Separator) {
		return '';
	}
	return item.text.replace(/&/g, '');
}

function createShortcutText(item) {
	if (item.type === menuitem_1.MenuItem.Separator || item.type === menuitem_1.MenuItem.Submenu) {
		return '';
	}
	return item.shortcut;
}

function updateItemNode(item, node) {
	var icon = node.children[0];
	var text = node.children[1];
	var shortcut = node.children[2];
	node.className = createItemClass(item);
	icon.className = createIconClass(item);
	text.textContent = createTextContent(item);
	shortcut.textContent = createShortcutText(item);
}

function clientViewportRect() {
	var elem = document.documentElement;
	var x = window.pageXOffset;
	var y = window.pageYOffset;
	var width = elem.clientWidth;
	var height = elem.clientHeight;
	return { x: x, y: y, width: width, height: height };
}

function mountAndMeasure(menu, maxHeight) {
	var node = menu.node;
	var style = node.style;
	style.top = '';
	style.left = '';
	style.width = '';
	style.height = '';
	style.visibility = 'hidden';
	style.maxHeight = maxHeight + 'px';
	menu.attach(document.body);
	if (node.scrollHeight > maxHeight) {
		style.width = 2 * node.offsetWidth - node.clientWidth + 'px';
	}
	var rect = node.getBoundingClientRect();
	return { width: rect.width, height: rect.height };
}

function showMenu(menu, x, y) {
	var style = menu.node.style;
	style.top = Math.max(0, y) + 'px';
	style.left = Math.max(0, x) + 'px';
	style.visibility = '';
}

function openRootMenu(menu, x, y, forceX, forceY) {
	phosphor_messaging_1.sendMessage(menu, phosphor_widget_1.Widget.MsgUpdateRequest);
	var rect = clientViewportRect();
	var size = mountAndMeasure(menu, rect.height - (forceY ? y : 0));
	if (!forceX && (x + size.width > rect.x + rect.width)) {
		x = rect.x + rect.width - size.width;
	}
	if (!forceY && (y + size.height > rect.y + rect.height)) {
		if (y > rect.y + rect.height) {
			y = rect.y + rect.height - size.height;
		}
		else {
			y = y - size.height;
		}
	}
	showMenu(menu, x, y);
}

function openSubmenu(menu, item) {
	phosphor_messaging_1.sendMessage(menu, phosphor_widget_1.Widget.MsgUpdateRequest);
	var rect = clientViewportRect();
	var size = mountAndMeasure(menu, rect.height);
	var box = phosphor_domutil_1.boxSizing(menu.node);
	var itemRect = item.getBoundingClientRect();
	var x = itemRect.right - SUBMENU_OVERLAP;
	var y = itemRect.top - box.borderTop - box.paddingTop;
	if (x + size.width > rect.x + rect.width) {
		x = itemRect.left + SUBMENU_OVERLAP - size.width;
	}
	if (y + size.height > rect.y + rect.height) {
		y = itemRect.bottom + box.borderBottom + box.paddingBottom - size.height;
	}
	showMenu(menu, x, y);
}

},{"./menubase":20,"./menuitem":21,"phosphor-domutil":13,"phosphor-messaging":23,"phosphor-signaling":27,"phosphor-widget":40}],19:[function(require,module,exports){

'use strict';
var __extends = (this && this.__extends) || function (d, b) {
	for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	function __() { this.constructor = d; }
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var phosphor_domutil_1 = require('phosphor-domutil');
var menubase_1 = require('./menubase');
var menuitem_1 = require('./menuitem');

var MENU_BAR_CLASS = 'p-MenuBar';

var CONTENT_CLASS = 'p-MenuBar-content';

var MENU_CLASS = 'p-MenuBar-menu';

var ITEM_CLASS = 'p-MenuBar-item';

var ICON_CLASS = 'p-MenuBar-item-icon';

var TEXT_CLASS = 'p-MenuBar-item-text';

var SEPARATOR_TYPE_CLASS = 'p-mod-separator-type';

var ACTIVE_CLASS = 'p-mod-active';

var DISABLED_CLASS = 'p-mod-disabled';

var HIDDEN_CLASS = 'p-mod-hidden';

var MenuBar = (function (_super) {
	__extends(MenuBar, _super);

	function MenuBar(items) {
		_super.call(this);
		this._active = false;
		this._childMenu = null;
		this._nodes = [];
		this.addClass(MENU_BAR_CLASS);
		if (items)
			this.items = items;
	}

	MenuBar.createNode = function () {
		var node = document.createElement('div');
		var content = document.createElement('ul');
		content.className = CONTENT_CLASS;
		node.appendChild(content);
		return node;
	};

	MenuBar.prototype.dispose = function () {
		this._reset();
		_super.prototype.dispose.call(this);
	};
	Object.defineProperty(MenuBar.prototype, "childMenu", {

		get: function () {
			return this._childMenu;
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(MenuBar.prototype, "contentNode", {

		get: function () {
			return this.node.getElementsByClassName(CONTENT_CLASS)[0];
		},
		enumerable: true,
		configurable: true
	});

	MenuBar.prototype.handleEvent = function (event) {
		switch (event.type) {
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
			case 'keydown':
				this._evtKeyDown(event);
				break;
			case 'keypress':
				this._evtKeyPress(event);
				break;
		}
	};

	MenuBar.prototype.isSelectable = function (item) {
		return !!item.submenu;
	};

	MenuBar.prototype.onItemsChanged = function (old, items) {

		this._reset();

		for (var i = 0, n = old.length; i < n; ++i) {
			if (items.indexOf(old[i]) === -1) {
				old[i].changed.disconnect(this._onItemChanged, this);
			}
		}

		for (var i = 0, n = items.length; i < n; ++i) {
			if (old.indexOf(items[i]) === -1) {
				items[i].changed.connect(this._onItemChanged, this);
			}
		}

		this.update();
	};

	MenuBar.prototype.onActiveIndexChanged = function (old, index) {
		var oldNode = this._nodes[old];
		var newNode = this._nodes[index];
		if (oldNode)
			oldNode.classList.remove(ACTIVE_CLASS);
		if (newNode)
			newNode.classList.add(ACTIVE_CLASS);
	};

	MenuBar.prototype.onOpenItem = function (index, item) {
		if (this.isAttached && item.submenu) {
			var ref = this._nodes[index] || this.node;
			this._activate();
			this._closeChildMenu();
			this._openChildMenu(item.submenu, ref);
		}
	};

	MenuBar.prototype.onCloseRequest = function (msg) {
		this._reset();
		_super.prototype.onCloseRequest.call(this, msg);
	};

	MenuBar.prototype.onAfterAttach = function (msg) {
		this.node.addEventListener('mousedown', this);
		this.node.addEventListener('mousemove', this);
		this.node.addEventListener('mouseleave', this);
		this.node.addEventListener('contextmenu', this);
	};

	MenuBar.prototype.onBeforeDetach = function (msg) {
		this.node.removeEventListener('mousedown', this);
		this.node.removeEventListener('mousemove', this);
		this.node.removeEventListener('mouseleave', this);
		this.node.removeEventListener('contextmenu', this);
	};

	MenuBar.prototype.onUpdateRequest = function (msg) {

		var items = this.items;
		var nodes = this._nodes;
		var content = this.contentNode;

		while (nodes.length > items.length) {
			var node = nodes.pop();
			content.removeChild(node);
		}

		while (nodes.length < items.length) {
			var node = createItemNode();
			nodes.push(node);
			content.appendChild(node);
		}

		for (var i = 0, n = items.length; i < n; ++i) {
			updateItemNode(items[i], nodes[i]);
		}

		var active = nodes[this.activeIndex];
		if (active)
			active.classList.add(ACTIVE_CLASS);

		menubase_1.collapseSeparators(items, nodes);
	};

	MenuBar.prototype._evtMouseDown = function (event) {
		var x = event.clientX;
		var y = event.clientY;



		if (this._active && hitTestMenus(this._childMenu, x, y)) {
			return;
		}

		var i = hitTestNodes(this._nodes, x, y);



		if (this._active) {
			this._deactivate();
			this._closeChildMenu();
			this.activeIndex = i;
			return;
		}


		if (i === -1) {
			this.activeIndex = -1;
			return;
		}


		this._activate();
		this.activeIndex = i;
		this.openActiveItem();
	};

	MenuBar.prototype._evtMouseMove = function (event) {
		var x = event.clientX;
		var y = event.clientY;

		var i = hitTestNodes(this._nodes, x, y);

		if (i === this.activeIndex) {
			return;
		}



		if (i === -1 && this._active) {
			return;
		}

		this.activeIndex = i;

		if (!this._active) {
			return;
		}

		this._closeChildMenu();
		this.openActiveItem();
	};

	MenuBar.prototype._evtMouseLeave = function (event) {
		if (!this._active)
			this.activeIndex = -1;
	};

	MenuBar.prototype._evtKeyDown = function (event) {
		event.stopPropagation();
		var menu = this._childMenu;
		var leaf = menu && menu.leafMenu;
		switch (event.keyCode) {
			case 13:
				event.preventDefault();
				if (leaf)
					leaf.triggerActiveItem();
				break;
			case 27:
				event.preventDefault();
				if (leaf)
					leaf.close();
				break;
			case 37:
				event.preventDefault();
				if (leaf && leaf !== menu) {
					leaf.close();
				}
				else {
					this._closeChildMenu();
					this.activatePreviousItem();
					this.openActiveItem();
				}
				break;
			case 38:
				event.preventDefault();
				if (leaf)
					leaf.activatePreviousItem();
				break;
			case 39:
				event.preventDefault();
				if (leaf && activeHasMenu(leaf)) {
					leaf.openActiveItem();
				}
				else {
					this._closeChildMenu();
					this.activateNextItem();
					this.openActiveItem();
				}
				break;
			case 40:
				event.preventDefault();
				if (leaf)
					leaf.activateNextItem();
				break;
		}
	};

	MenuBar.prototype._evtKeyPress = function (event) {
		event.preventDefault();
		event.stopPropagation();
		var menu = this._childMenu;
		var leaf = menu && menu.leafMenu;
		var key = String.fromCharCode(event.charCode);
		(leaf || this).activateMnemonicItem(key);
	};

	MenuBar.prototype._openChildMenu = function (menu, node) {
		var rect = node.getBoundingClientRect();
		this._childMenu = menu;
		menu.addClass(MENU_CLASS);
		menu.open(rect.left, rect.bottom, false, true);
		menu.closed.connect(this._onMenuClosed, this);
	};

	MenuBar.prototype._closeChildMenu = function () {
		var menu = this._childMenu;
		if (menu) {
			this._childMenu = null;
			menu.closed.disconnect(this._onMenuClosed, this);
			menu.removeClass(MENU_CLASS);
			menu.close();
		}
	};

	MenuBar.prototype._activate = function () {
		var _this = this;
		if (this._active) {
			return;
		}
		this._active = true;
		this.addClass(ACTIVE_CLASS);
		setTimeout(function () {
			_this.node.removeEventListener('mousedown', _this);
			document.addEventListener('mousedown', _this, true);
			document.addEventListener('keydown', _this, true);
			document.addEventListener('keypress', _this, true);
		}, 0);
	};

	MenuBar.prototype._deactivate = function () {
		var _this = this;
		if (!this._active) {
			return;
		}
		this._active = false;
		this.removeClass(ACTIVE_CLASS);
		setTimeout(function () {
			_this.node.addEventListener('mousedown', _this);
			document.removeEventListener('mousedown', _this, true);
			document.removeEventListener('keydown', _this, true);
			document.removeEventListener('keypress', _this, true);
		}, 0);
	};

	MenuBar.prototype._reset = function () {
		this._deactivate();
		this._closeChildMenu();
		this.activeIndex = -1;
	};

	MenuBar.prototype._onItemChanged = function (sender, args) {
		this._reset();
		this.update();
	};

	MenuBar.prototype._onMenuClosed = function (sender) {
		sender.closed.disconnect(this._onMenuClosed, this);
		sender.removeClass(MENU_CLASS);
		this._childMenu = null;
		this._reset();
	};
	return MenuBar;
})(menubase_1.MenuBase);
exports.MenuBar = MenuBar;

function createItemNode() {
	var node = document.createElement('li');
	var icon = document.createElement('span');
	var text = document.createElement('span');
	text.className = TEXT_CLASS;
	node.appendChild(icon);
	node.appendChild(text);
	return node;
}

function createItemClass(item) {
	var parts = [ITEM_CLASS];
	if (item.className) {
		parts.push(item.className);
	}
	if (item.type === menuitem_1.MenuItem.Separator) {
		parts.push(SEPARATOR_TYPE_CLASS);
	}
	else if (item.type !== menuitem_1.MenuItem.Submenu) {
		parts.push(HIDDEN_CLASS);
	}
	else if (!item.submenu) {
		parts.push(DISABLED_CLASS);
	}
	return parts.join(' ');
}

function createIconClass(item) {
	return item.icon ? (ICON_CLASS + ' ' + item.icon) : ICON_CLASS;
}

function createTextContent(item) {
	var sep = item.type === menuitem_1.MenuItem.Separator;
	return sep ? '' : item.text.replace(/&/g, '');
}

function updateItemNode(item, node) {
	var icon = node.firstChild;
	var text = node.lastChild;
	node.className = createItemClass(item);
	icon.className = createIconClass(item);
	text.textContent = createTextContent(item);
}

function activeHasMenu(menu) {
	var item = menu.items[menu.activeIndex];
	return !!(item && item.submenu);
}

function hitTestNodes(nodes, x, y) {
	for (var i = 0, n = nodes.length; i < n; ++i) {
		if (phosphor_domutil_1.hitTest(nodes[i], x, y))
			return i;
	}
	return -1;
}

function hitTestMenus(menu, x, y) {
	while (menu) {
		if (phosphor_domutil_1.hitTest(menu.node, x, y)) {
			return true;
		}
		menu = menu.childMenu;
	}
	return false;
}

},{"./menubase":20,"./menuitem":21,"phosphor-domutil":13}],20:[function(require,module,exports){

'use strict';
var __extends = (this && this.__extends) || function (d, b) {
	for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	function __() { this.constructor = d; }
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var arrays = require('phosphor-arrays');
var phosphor_properties_1 = require('phosphor-properties');
var phosphor_widget_1 = require('phosphor-widget');
var menuitem_1 = require('./menuitem');

var COLLAPSED_CLASS = 'p-mod-collapsed';

var MenuBase = (function (_super) {
	__extends(MenuBase, _super);
	function MenuBase() {
		_super.apply(this, arguments);
	}
	Object.defineProperty(MenuBase.prototype, "items", {

		get: function () {
			return MenuBase.itemsProperty.get(this);
		},

		set: function (value) {
			MenuBase.itemsProperty.set(this, value);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(MenuBase.prototype, "activeIndex", {

		get: function () {
			return MenuBase.activeIndexProperty.get(this);
		},

		set: function (value) {
			MenuBase.activeIndexProperty.set(this, value);
		},
		enumerable: true,
		configurable: true
	});

	MenuBase.prototype.activateNextItem = function () {
		var _this = this;
		var k = this.activeIndex + 1;
		var i = k >= this.items.length ? 0 : k;
		var pred = function (item) { return _this.isSelectable(item); };
		this.activeIndex = arrays.findIndex(this.items, pred, i, true);
	};

	MenuBase.prototype.activatePreviousItem = function () {
		var _this = this;
		var k = this.activeIndex;
		var i = k <= 0 ? this.items.length - 1 : k - 1;
		var pred = function (item) { return _this.isSelectable(item); };
		this.activeIndex = arrays.rfindIndex(this.items, pred, i, true);
	};

	MenuBase.prototype.activateMnemonicItem = function (char) {
		var _this = this;
		var c = char.toUpperCase();
		var k = this.activeIndex + 1;
		var i = k >= this.items.length ? 0 : k;
		this.activeIndex = arrays.findIndex(this.items, function (item) {
			if (!_this.isSelectable(item)) {
				return false;
			}
			var match = item.text.match(/&\w/);
			if (!match) {
				return false;
			}
			return match[0][1].toUpperCase() === c;
		}, i, true);
	};

	MenuBase.prototype.openActiveItem = function () {
		var i = this.activeIndex;
		var item = this.items[i];
		if (item && item.type === menuitem_1.MenuItem.Submenu) {
			this.onOpenItem(i, item);
		}
	};

	MenuBase.prototype.triggerActiveItem = function () {
		var i = this.activeIndex;
		var item = this.items[i];
		if (item && item.type === menuitem_1.MenuItem.Submenu) {
			this.onOpenItem(i, item);
		}
		else if (item && item.type !== menuitem_1.MenuItem.Separator) {
			this.onTriggerItem(i, item);
		}
	};

	MenuBase.prototype.isSelectable = function (item) {
		return item.type !== menuitem_1.MenuItem.Separator;
	};

	MenuBase.prototype.coerceActiveIndex = function (index) {
		var i = index | 0;
		var item = this.items[i];
		return (item && this.isSelectable(item)) ? i : -1;
	};

	MenuBase.prototype.onItemsChanged = function (old, items) { };

	MenuBase.prototype.onActiveIndexChanged = function (old, index) { };

	MenuBase.prototype.onOpenItem = function (index, item) { };

	MenuBase.prototype.onTriggerItem = function (index, item) { };

	MenuBase.itemsProperty = new phosphor_properties_1.Property({
		name: 'items',
		value: Object.freeze([]),
		coerce: function (owner, value) { return Object.freeze(value ? value.slice() : []); },
		changed: function (owner, old, value) { return owner.onItemsChanged(old, value); },
	});

	MenuBase.activeIndexProperty = new phosphor_properties_1.Property({
		name: 'activeIndex',
		value: -1,
		coerce: function (owner, index) { return owner.coerceActiveIndex(index); },
		changed: function (owner, old, index) { return owner.onActiveIndexChanged(old, index); },
	});
	return MenuBase;
})(phosphor_widget_1.Widget);
exports.MenuBase = MenuBase;

function collapseSeparators(items, nodes) {

	var k1;
	for (k1 = 0; k1 < items.length; ++k1) {
		var item = items[k1];
		var node = nodes[k1];
		if (item.type !== menuitem_1.MenuItem.Separator) {
			node.classList.remove(COLLAPSED_CLASS);
			break;
		}
		node.classList.add(COLLAPSED_CLASS);
	}

	var k2;
	for (k2 = items.length - 1; k2 >= 0; --k2) {
		var item = items[k2];
		var node = nodes[k2];
		if (item.type !== menuitem_1.MenuItem.Separator) {
			node.classList.remove(COLLAPSED_CLASS);
			break;
		}
		node.classList.add(COLLAPSED_CLASS);
	}

	var collapse = false;
	while (++k1 < k2) {
		var item = items[k1];
		var node = nodes[k1];
		if (collapse && item.type === menuitem_1.MenuItem.Separator) {
			node.classList.add(COLLAPSED_CLASS);
		}
		else {
			node.classList.remove(COLLAPSED_CLASS);
			collapse = item.type === menuitem_1.MenuItem.Separator;
		}
	}
}
exports.collapseSeparators = collapseSeparators;

},{"./menuitem":21,"phosphor-arrays":22,"phosphor-properties":26,"phosphor-widget":40}],21:[function(require,module,exports){

'use strict';
var phosphor_properties_1 = require('phosphor-properties');
var phosphor_signaling_1 = require('phosphor-signaling');

(function (MenuItemType) {

	MenuItemType[MenuItemType["Normal"] = 0] = "Normal";

	MenuItemType[MenuItemType["Check"] = 1] = "Check";

	MenuItemType[MenuItemType["Separator"] = 2] = "Separator";

	MenuItemType[MenuItemType["Submenu"] = 3] = "Submenu";
})(exports.MenuItemType || (exports.MenuItemType = {}));
var MenuItemType = exports.MenuItemType;

var MenuItem = (function () {

	function MenuItem(options) {
		if (options)
			initFrom(this, options);
	}
	Object.defineProperty(MenuItem.prototype, "changed", {

		get: function () {
			return MenuItem.changedSignal.bind(this);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(MenuItem.prototype, "type", {

		get: function () {
			return MenuItem.typeProperty.get(this);
		},

		set: function (value) {
			MenuItem.typeProperty.set(this, value);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(MenuItem.prototype, "text", {

		get: function () {
			return MenuItem.textProperty.get(this);
		},

		set: function (value) {
			MenuItem.textProperty.set(this, value);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(MenuItem.prototype, "icon", {

		get: function () {
			return MenuItem.iconProperty.get(this);
		},

		set: function (value) {
			MenuItem.iconProperty.set(this, value);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(MenuItem.prototype, "shortcut", {

		get: function () {
			return MenuItem.shortcutProperty.get(this);
		},

		set: function (value) {
			MenuItem.shortcutProperty.set(this, value);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(MenuItem.prototype, "className", {

		get: function () {
			return MenuItem.classNameProperty.get(this);
		},

		set: function (value) {
			MenuItem.classNameProperty.set(this, value);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(MenuItem.prototype, "command", {

		get: function () {
			return MenuItem.commandProperty.get(this);
		},

		set: function (value) {
			MenuItem.commandProperty.set(this, value);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(MenuItem.prototype, "commandArgs", {

		get: function () {
			return MenuItem.commandArgsProperty.get(this);
		},

		set: function (value) {
			MenuItem.commandArgsProperty.set(this, value);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(MenuItem.prototype, "submenu", {

		get: function () {
			return MenuItem.submenuProperty.get(this);
		},

		set: function (value) {
			MenuItem.submenuProperty.set(this, value);
		},
		enumerable: true,
		configurable: true
	});

	MenuItem.Normal = MenuItemType.Normal;

	MenuItem.Check = MenuItemType.Check;

	MenuItem.Separator = MenuItemType.Separator;

	MenuItem.Submenu = MenuItemType.Submenu;

	MenuItem.changedSignal = new phosphor_signaling_1.Signal();

	MenuItem.typeProperty = new phosphor_properties_1.Property({
		name: 'type',
		value: MenuItemType.Normal,
		coerce: function (owner, value) { return owner.submenu ? MenuItemType.Submenu : value; },
		notify: MenuItem.changedSignal,
	});

	MenuItem.textProperty = new phosphor_properties_1.Property({
		name: 'text',
		value: '',
		notify: MenuItem.changedSignal,
	});

	MenuItem.iconProperty = new phosphor_properties_1.Property({
		name: 'icon',
		value: '',
		notify: MenuItem.changedSignal,
	});

	MenuItem.shortcutProperty = new phosphor_properties_1.Property({
		name: 'shortcut',
		value: '',
		notify: MenuItem.changedSignal,
	});

	MenuItem.classNameProperty = new phosphor_properties_1.Property({
		name: 'className',
		value: '',
		notify: MenuItem.changedSignal,
	});

	MenuItem.commandProperty = new phosphor_properties_1.Property({
		name: 'command',
		value: null,
		coerce: function (owner, value) { return value || null; },
		notify: MenuItem.changedSignal,
	});

	MenuItem.commandArgsProperty = new phosphor_properties_1.Property({
		name: 'commandArgs',
		value: null,
		coerce: function (owner, value) { return value || null; },
		notify: MenuItem.changedSignal,
	});

	MenuItem.submenuProperty = new phosphor_properties_1.Property({
		name: 'submenu',
		value: null,
		coerce: function (owner, value) { return value || null; },
		changed: function (owner) { MenuItem.typeProperty.coerce(owner); },
		notify: MenuItem.changedSignal,
	});
	return MenuItem;
})();
exports.MenuItem = MenuItem;

function initFrom(item, options) {
	if (options.type !== void 0) {
		item.type = options.type;
	}
	if (options.text !== void 0) {
		item.text = options.text;
	}
	if (options.icon !== void 0) {
		item.icon = options.icon;
	}
	if (options.shortcut !== void 0) {
		item.shortcut = options.shortcut;
	}
	if (options.className !== void 0) {
		item.className = options.className;
	}
	if (options.command !== void 0) {
		item.command = options.command;
	}
	if (options.commandArgs !== void 0) {
		item.commandArgs = options.commandArgs;
	}
	if (options.submenu !== void 0) {
		item.submenu = options.submenu;
	}
}

},{"phosphor-properties":26,"phosphor-signaling":27}],22:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],23:[function(require,module,exports){

'use strict';
var phosphor_queue_1 = require('phosphor-queue');

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
	return Message;
})();
exports.Message = Message;

function sendMessage(handler, msg) {
	getDispatcher(handler).sendMessage(handler, msg);
}
exports.sendMessage = sendMessage;

function postMessage(handler, msg) {
	getDispatcher(handler).postMessage(handler, msg);
}
exports.postMessage = postMessage;

function hasPendingMessages(handler) {
	return getDispatcher(handler).hasPendingMessages();
}
exports.hasPendingMessages = hasPendingMessages;

function sendPendingMessage(handler) {
	getDispatcher(handler).sendPendingMessage(handler);
}
exports.sendPendingMessage = sendPendingMessage;

function installMessageFilter(handler, filter) {
	getDispatcher(handler).installMessageFilter(filter);
}
exports.installMessageFilter = installMessageFilter;

function removeMessageFilter(handler, filter) {
	getDispatcher(handler).removeMessageFilter(filter);
}
exports.removeMessageFilter = removeMessageFilter;

function clearMessageData(handler) {
	var dispatcher = dispatcherMap.get(handler);
	if (dispatcher)
		dispatcher.clear();
	dispatchQueue.removeAll(handler);
}
exports.clearMessageData = clearMessageData;

var dispatcherMap = new WeakMap();

var dispatchQueue = new phosphor_queue_1.Queue();

var frameId = void 0;

var raf;
if (typeof requestAnimationFrame === 'function') {
	raf = requestAnimationFrame;
}
else {
	raf = setImmediate;
}

function getDispatcher(handler) {
	var dispatcher = dispatcherMap.get(handler);
	if (dispatcher)
		return dispatcher;
	dispatcher = new MessageDispatcher();
	dispatcherMap.set(handler, dispatcher);
	return dispatcher;
}

function wakeUpMessageLoop() {
	if (frameId === void 0 && !dispatchQueue.empty) {
		frameId = raf(runMessageLoop);
	}
}

function runMessageLoop() {

	frameId = void 0;

	if (dispatchQueue.empty) {
		return;
	}




	dispatchQueue.push(null);




	while (!dispatchQueue.empty) {
		var handler = dispatchQueue.pop();
		if (handler === null) {
			wakeUpMessageLoop();
			return;
		}
		getDispatcher(handler).sendPendingMessage(handler);
	}
}

function safeProcess(handler, msg) {
	try {
		handler.processMessage(msg);
	}
	catch (err) {
		console.error(err);
	}
}

function safeCompress(handler, msg, queue) {
	var result = false;
	try {
		result = handler.compressMessage(msg, queue);
	}
	catch (err) {
		console.error(err);
	}
	return result;
}

function safeFilter(filter, handler, msg) {
	var result = false;
	try {
		result = filter.filterMessage(handler, msg);
	}
	catch (err) {
		console.error(err);
	}
	return result;
}

var MessageDispatcher = (function () {
	function MessageDispatcher() {
		this._filters = null;
		this._messages = null;
	}

	MessageDispatcher.prototype.sendMessage = function (handler, msg) {
		if (!this._filterMessage(handler, msg)) {
			safeProcess(handler, msg);
		}
	};

	MessageDispatcher.prototype.postMessage = function (handler, msg) {
		if (!this._compressMessage(handler, msg)) {
			this._enqueueMessage(handler, msg);
		}
	};

	MessageDispatcher.prototype.hasPendingMessages = function () {
		return !!(this._messages && !this._messages.empty);
	};

	MessageDispatcher.prototype.sendPendingMessage = function (handler) {
		if (this._messages && !this._messages.empty) {
			this.sendMessage(handler, this._messages.pop());
		}
	};

	MessageDispatcher.prototype.installMessageFilter = function (filter) {
		this._filters = { next: this._filters, filter: filter };
	};

	MessageDispatcher.prototype.removeMessageFilter = function (filter) {
		var link = this._filters;
		var prev = null;
		while (link !== null) {
			if (link.filter === filter) {
				link.filter = null;
			}
			else if (prev === null) {
				this._filters = link;
				prev = link;
			}
			else {
				prev.next = link;
				prev = link;
			}
			link = link.next;
		}
		if (!prev) {
			this._filters = null;
		}
		else {
			prev.next = null;
		}
	};

	MessageDispatcher.prototype.clear = function () {
		if (this._messages) {
			this._messages.clear();
		}
		for (var link = this._filters; link !== null; link = link.next) {
			link.filter = null;
		}
		this._filters = null;
	};

	MessageDispatcher.prototype._filterMessage = function (handler, msg) {
		for (var link = this._filters; link !== null; link = link.next) {
			if (link.filter && safeFilter(link.filter, handler, msg)) {
				return true;
			}
		}
		return false;
	};

	MessageDispatcher.prototype._compressMessage = function (handler, msg) {
		if (!handler.compressMessage) {
			return false;
		}
		if (!this._messages || this._messages.empty) {
			return false;
		}
		return safeCompress(handler, msg, this._messages);
	};

	MessageDispatcher.prototype._enqueueMessage = function (handler, msg) {
		this._ensureMessages().push(msg);
		dispatchQueue.push(handler);
		wakeUpMessageLoop();
	};

	MessageDispatcher.prototype._ensureMessages = function () {
		return this._messages || (this._messages = new phosphor_queue_1.Queue());
	};
	return MessageDispatcher;
})();

},{"phosphor-queue":24}],24:[function(require,module,exports){

'use strict';

var Queue = (function () {

	function Queue(items) {
		var _this = this;
		this._size = 0;
		this._front = null;
		this._back = null;
		if (items)
			items.forEach(function (item) { return _this.push(item); });
	}
	Object.defineProperty(Queue.prototype, "size", {

		get: function () {
			return this._size;
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(Queue.prototype, "empty", {

		get: function () {
			return this._size === 0;
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(Queue.prototype, "front", {

		get: function () {
			return this._front !== null ? this._front.value : void 0;
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(Queue.prototype, "back", {

		get: function () {
			return this._back !== null ? this._back.value : void 0;
		},
		enumerable: true,
		configurable: true
	});

	Queue.prototype.push = function (value) {
		var link = { next: null, value: value };
		if (this._back === null) {
			this._front = link;
			this._back = link;
		}
		else {
			this._back.next = link;
			this._back = link;
		}
		this._size++;
	};

	Queue.prototype.pop = function () {
		var link = this._front;
		if (link === null) {
			return void 0;
		}
		if (link.next === null) {
			this._front = null;
			this._back = null;
		}
		else {
			this._front = link.next;
		}
		this._size--;
		return link.value;
	};

	Queue.prototype.remove = function (value) {
		var link = this._front;
		var prev = null;
		while (link !== null) {
			if (link.value === value) {
				if (prev === null) {
					this._front = link.next;
				}
				else {
					prev.next = link.next;
				}
				if (link.next === null) {
					this._back = prev;
				}
				this._size--;
				return true;
			}
			prev = link;
			link = link.next;
		}
		return false;
	};

	Queue.prototype.removeAll = function (value) {
		var count = 0;
		var link = this._front;
		var prev = null;
		while (link !== null) {
			if (link.value === value) {
				count++;
				this._size--;
			}
			else if (prev === null) {
				this._front = link;
				prev = link;
			}
			else {
				prev.next = link;
				prev = link;
			}
			link = link.next;
		}
		if (!prev) {
			this._front = null;
			this._back = null;
		}
		else {
			prev.next = null;
			this._back = prev;
		}
		return count;
	};

	Queue.prototype.clear = function () {
		this._size = 0;
		this._front = null;
		this._back = null;
	};

	Queue.prototype.toArray = function () {
		var result = new Array(this._size);
		for (var i = 0, link = this._front; link !== null; link = link.next, ++i) {
			result[i] = link.value;
		}
		return result;
	};

	Queue.prototype.some = function (pred) {
		for (var i = 0, link = this._front; link !== null; link = link.next, ++i) {
			if (pred(link.value, i))
				return true;
		}
		return false;
	};

	Queue.prototype.every = function (pred) {
		for (var i = 0, link = this._front; link !== null; link = link.next, ++i) {
			if (!pred(link.value, i))
				return false;
		}
		return true;
	};

	Queue.prototype.filter = function (pred) {
		var result = [];
		for (var i = 0, link = this._front; link !== null; link = link.next, ++i) {
			if (pred(link.value, i))
				result.push(link.value);
		}
		return result;
	};

	Queue.prototype.map = function (callback) {
		var result = new Array(this._size);
		for (var i = 0, link = this._front; link !== null; link = link.next, ++i) {
			result[i] = callback(link.value, i);
		}
		return result;
	};

	Queue.prototype.forEach = function (callback) {
		for (var i = 0, link = this._front; link !== null; link = link.next, ++i) {
			var result = callback(link.value, i);
			if (result !== void 0)
				return result;
		}
		return void 0;
	};
	return Queue;
})();
exports.Queue = Queue;

},{}],25:[function(require,module,exports){

'use strict';

var NodeWrapper = (function () {
	function NodeWrapper() {
		this._node = this.constructor.createNode();
	}

	NodeWrapper.createNode = function () {
		return document.createElement('div');
	};
	Object.defineProperty(NodeWrapper.prototype, "node", {

		get: function () {
			return this._node;
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(NodeWrapper.prototype, "id", {

		get: function () {
			return this._node.id;
		},

		set: function (value) {
			this._node.id = value;
		},
		enumerable: true,
		configurable: true
	});

	NodeWrapper.prototype.hasClass = function (name) {
		return this._node.classList.contains(name);
	};

	NodeWrapper.prototype.addClass = function (name) {
		this._node.classList.add(name);
	};

	NodeWrapper.prototype.removeClass = function (name) {
		this._node.classList.remove(name);
	};

	NodeWrapper.prototype.toggleClass = function (name, force) {
		var present;
		if (force === true) {
			this.addClass(name);
			present = true;
		}
		else if (force === false) {
			this.removeClass(name);
			present = false;
		}
		else if (this.hasClass(name)) {
			this.removeClass(name);
			present = false;
		}
		else {
			this.addClass(name);
			present = true;
		}
		return present;
	};
	return NodeWrapper;
})();
exports.NodeWrapper = NodeWrapper;

},{}],26:[function(require,module,exports){

'use strict';

var Property = (function () {

	function Property(options) {
		this._pid = nextPID();
		this._name = options.name;
		this._value = options.value;
		this._create = options.create;
		this._coerce = options.coerce;
		this._compare = options.compare;
		this._changed = options.changed;
		this._notify = options.notify;
	}
	Object.defineProperty(Property.prototype, "name", {

		get: function () {
			return this._name;
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(Property.prototype, "notify", {

		get: function () {
			return this._notify;
		},
		enumerable: true,
		configurable: true
	});

	Property.prototype.get = function (owner) {
		var value;
		var hash = lookupHash(owner);
		if (this._pid in hash) {
			value = hash[this._pid];
		}
		else {
			value = hash[this._pid] = this._createValue(owner);
		}
		return value;
	};

	Property.prototype.set = function (owner, value) {
		var oldValue;
		var hash = lookupHash(owner);
		if (this._pid in hash) {
			oldValue = hash[this._pid];
		}
		else {
			oldValue = hash[this._pid] = this._createValue(owner);
		}
		var newValue = this._coerceValue(owner, value);
		this._maybeNotify(owner, oldValue, hash[this._pid] = newValue);
	};

	Property.prototype.coerce = function (owner) {
		var oldValue;
		var hash = lookupHash(owner);
		if (this._pid in hash) {
			oldValue = hash[this._pid];
		}
		else {
			oldValue = hash[this._pid] = this._createValue(owner);
		}
		var newValue = this._coerceValue(owner, oldValue);
		this._maybeNotify(owner, oldValue, hash[this._pid] = newValue);
	};

	Property.prototype._createValue = function (owner) {
		var create = this._create;
		return create ? create(owner) : this._value;
	};

	Property.prototype._coerceValue = function (owner, value) {
		var coerce = this._coerce;
		return coerce ? coerce(owner, value) : value;
	};

	Property.prototype._compareValue = function (oldValue, newValue) {
		var compare = this._compare;
		return compare ? compare(oldValue, newValue) : oldValue === newValue;
	};

	Property.prototype._maybeNotify = function (owner, oldValue, newValue) {
		var changed = this._changed;
		var notify = this._notify;
		if (!changed && !notify) {
			return;
		}
		if (this._compareValue(oldValue, newValue)) {
			return;
		}
		if (changed) {
			changed(owner, oldValue, newValue);
		}
		if (notify) {
			notify.bind(owner).emit({ name: this._name, oldValue: oldValue, newValue: newValue });
		}
	};
	return Property;
})();
exports.Property = Property;

function clearPropertyData(owner) {
	ownerData.delete(owner);
}
exports.clearPropertyData = clearPropertyData;

var ownerData = new WeakMap();

var nextPID = (function () { var id = 0; return function () { return 'pid-' + id++; }; })();

function lookupHash(owner) {
	var hash = ownerData.get(owner);
	if (hash !== void 0)
		return hash;
	hash = Object.create(null);
	ownerData.set(owner, hash);
	return hash;
}

},{}],27:[function(require,module,exports){

'use strict';

var Signal = (function () {
	function Signal() {
	}

	Signal.prototype.bind = function (sender) {
		return new BoundSignal(this, sender);
	};
	return Signal;
})();
exports.Signal = Signal;

function disconnectSender(sender) {
	var list = senderMap.get(sender);
	if (!list) {
		return;
	}
	var conn = list.first;
	while (conn !== null) {
		removeFromSendersList(conn);
		conn.callback = null;
		conn.thisArg = null;
		conn = conn.nextReceiver;
	}
	senderMap.delete(sender);
}
exports.disconnectSender = disconnectSender;

function disconnectReceiver(receiver) {
	var conn = receiverMap.get(receiver);
	if (!conn) {
		return;
	}
	while (conn !== null) {
		var next = conn.nextSender;
		conn.callback = null;
		conn.thisArg = null;
		conn.prevSender = null;
		conn.nextSender = null;
		conn = next;
	}
	receiverMap.delete(receiver);
}
exports.disconnectReceiver = disconnectReceiver;

function clearSignalData(obj) {
	disconnectSender(obj);
	disconnectReceiver(obj);
}
exports.clearSignalData = clearSignalData;

var BoundSignal = (function () {

	function BoundSignal(signal, sender) {
		this._signal = signal;
		this._sender = sender;
	}

	BoundSignal.prototype.connect = function (callback, thisArg) {
		return connect(this._sender, this._signal, callback, thisArg);
	};

	BoundSignal.prototype.disconnect = function (callback, thisArg) {
		return disconnect(this._sender, this._signal, callback, thisArg);
	};

	BoundSignal.prototype.emit = function (args) {
		emit(this._sender, this._signal, args);
	};
	return BoundSignal;
})();

var Connection = (function () {
	function Connection() {

		this.signal = null;

		this.callback = null;

		this.thisArg = null;

		this.nextReceiver = null;

		this.nextSender = null;

		this.prevSender = null;
	}
	return Connection;
})();

var ConnectionList = (function () {
	function ConnectionList() {

		this.refs = 0;

		this.first = null;

		this.last = null;
	}
	return ConnectionList;
})();

var senderMap = new WeakMap();

var receiverMap = new WeakMap();

function connect(sender, signal, callback, thisArg) {

	thisArg = thisArg || void 0;

	var list = senderMap.get(sender);
	if (list && findConnection(list, signal, callback, thisArg)) {
		return false;
	}

	var conn = new Connection();
	conn.signal = signal;
	conn.callback = callback;
	conn.thisArg = thisArg;

	if (!list) {
		list = new ConnectionList();
		list.first = conn;
		list.last = conn;
		senderMap.set(sender, list);
	}
	else if (list.last === null) {
		list.first = conn;
		list.last = conn;
	}
	else {
		list.last.nextReceiver = conn;
		list.last = conn;
	}

	var receiver = thisArg || callback;
	var head = receiverMap.get(receiver);
	if (head) {
		head.prevSender = conn;
		conn.nextSender = head;
	}
	receiverMap.set(receiver, conn);
	return true;
}

function disconnect(sender, signal, callback, thisArg) {

	thisArg = thisArg || void 0;

	var list = senderMap.get(sender);
	if (!list) {
		return false;
	}
	var conn = findConnection(list, signal, callback, thisArg);
	if (!conn) {
		return false;
	}


	removeFromSendersList(conn);

	conn.callback = null;
	conn.thisArg = null;
	return true;
}

function emit(sender, signal, args) {

	var list = senderMap.get(sender);
	if (!list) {
		return;
	}



	list.refs++;
	var dirty = false;
	var last = list.last;
	var conn = list.first;




	while (conn !== null) {
		if (!conn.callback) {
			dirty = true;
		}
		else if (conn.signal === signal) {
			safeInvoke(conn, sender, args);
		}
		if (conn === last) {
			break;
		}
		conn = conn.nextReceiver;
	}

	list.refs--;

	if (dirty && list.refs === 0) {
		cleanList(list);
	}
}

function safeInvoke(conn, sender, args) {
	try {
		conn.callback.call(conn.thisArg, sender, args);
	}
	catch (err) {
		console.error('Exception in signal handler:', err);
	}
}

function findConnection(list, signal, callback, thisArg) {
	var conn = list.first;
	while (conn !== null) {
		if (conn.signal === signal &&
			conn.callback === callback &&
			conn.thisArg === thisArg) {
			return conn;
		}
		conn = conn.nextReceiver;
	}
	return null;
}

function cleanList(list) {
	var prev;
	var conn = list.first;
	while (conn !== null) {
		var next = conn.nextReceiver;
		if (!conn.callback) {
			conn.nextReceiver = null;
		}
		else if (!prev) {
			list.first = conn;
			prev = conn;
		}
		else {
			prev.nextReceiver = conn;
			prev = conn;
		}
		conn = next;
	}
	if (!prev) {
		list.first = null;
		list.last = null;
	}
	else {
		prev.nextReceiver = null;
		list.last = prev;
	}
}

function removeFromSendersList(conn) {
	var receiver = conn.thisArg || conn.callback;
	if (!receiver) {
		return;
	}
	var prev = conn.prevSender;
	var next = conn.nextSender;
	if (prev === null && next === null) {
		receiverMap.delete(receiver);
	}
	else if (prev === null) {
		receiverMap.set(receiver, next);
		next.prevSender = null;
	}
	else if (next === null) {
		prev.nextSender = null;
	}
	else {
		prev.nextSender = next;
		next.prevSender = prev;
	}
	conn.prevSender = null;
	conn.nextSender = null;
}

},{}],28:[function(require,module,exports){
var css = ".p-SplitPanel{position:relative;z-index:0}.p-SplitPanel>.p-Widget{position:absolute;z-index:0}.p-SplitHandle{box-sizing:border-box;position:absolute;z-index:1}.p-SplitHandle.p-mod-hidden{display:none}.p-SplitHandle.p-mod-horizontal{cursor:ew-resize}.p-SplitHandle.p-mod-vertical{cursor:ns-resize}.p-SplitHandle-overlay{box-sizing:border-box;position:absolute;top:0;left:0;width:100%;height:100%}.p-SplitHandle.p-mod-horizontal>.p-SplitHandle-overlay{min-width:7px;left:50%;transform:translateX(-50%)}.p-SplitHandle.p-mod-vertical>.p-SplitHandle-overlay{min-height:7px;top:50%;transform:translateY(-50%)}"; (require("browserify-css").createStyle(css, { "href": "node_modules\\phosphor-splitpanel\\lib\\index.css"})); module.exports = css;
},{"browserify-css":2}],29:[function(require,module,exports){

'use strict';
var __extends = (this && this.__extends) || function (d, b) {
	for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	function __() { this.constructor = d; }
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var arrays = require('phosphor-arrays');
var phosphor_boxengine_1 = require('phosphor-boxengine');
var phosphor_domutil_1 = require('phosphor-domutil');
var phosphor_messaging_1 = require('phosphor-messaging');
var phosphor_nodewrapper_1 = require('phosphor-nodewrapper');
var phosphor_properties_1 = require('phosphor-properties');
var phosphor_widget_1 = require('phosphor-widget');
require('./index.css');

var SPLIT_PANEL_CLASS = 'p-SplitPanel';

var SPLIT_HANDLE_CLASS = 'p-SplitHandle';

var OVERLAY_CLASS = 'p-SplitHandle-overlay';

var HORIZONTAL_CLASS = 'p-mod-horizontal';

var VERTICAL_CLASS = 'p-mod-vertical';

var HIDDEN_CLASS = 'p-mod-hidden';

(function (Orientation) {

	Orientation[Orientation["Horizontal"] = 0] = "Horizontal";

	Orientation[Orientation["Vertical"] = 1] = "Vertical";
})(exports.Orientation || (exports.Orientation = {}));
var Orientation = exports.Orientation;

var SplitPanel = (function (_super) {
	__extends(SplitPanel, _super);

	function SplitPanel() {
		_super.call(this);
		this._fixedSpace = 0;
		this._pendingSizes = false;
		this._box = null;
		this._sizers = [];
		this._pressData = null;
		this.addClass(SPLIT_PANEL_CLASS);
		this.addClass(HORIZONTAL_CLASS);
	}

	SplitPanel.getStretch = function (widget) {
		return SplitPanel.stretchProperty.get(widget);
	};

	SplitPanel.setStretch = function (widget, value) {
		SplitPanel.stretchProperty.set(widget, value);
	};

	SplitPanel.prototype.dispose = function () {
		this._releaseMouse();
		this._sizers.length = 0;
		_super.prototype.dispose.call(this);
	};
	Object.defineProperty(SplitPanel.prototype, "orientation", {

		get: function () {
			return SplitPanel.orientationProperty.get(this);
		},

		set: function (value) {
			SplitPanel.orientationProperty.set(this, value);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(SplitPanel.prototype, "spacing", {

		get: function () {
			return SplitPanel.spacingProperty.get(this);
		},

		set: function (value) {
			SplitPanel.spacingProperty.set(this, value);
		},
		enumerable: true,
		configurable: true
	});

	SplitPanel.prototype.sizes = function () {
		return normalize(this._sizers.map(function (sizer) { return sizer.size; }));
	};

	SplitPanel.prototype.setSizes = function (sizes) {
		var normed = normalize(sizes);
		for (var i = 0, n = this._sizers.length; i < n; ++i) {
			var hint = Math.max(0, normed[i] || 0);
			var sizer = this._sizers[i];
			sizer.sizeHint = hint;
			sizer.size = hint;
		}
		this._pendingSizes = true;
		phosphor_messaging_1.postMessage(this, phosphor_widget_1.Widget.MsgUpdateRequest);
	};

	SplitPanel.prototype.handleEvent = function (event) {
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
			case 'mouseup':
				this._evtMouseUp(event);
				break;
			case 'keyup':
			case 'keypress':
			case 'contextmenu':

				event.preventDefault();
				event.stopPropagation();
				break;
		}
	};

	SplitPanel.prototype.onChildAdded = function (msg) {
		var sizer = createSizer(averageSize(this._sizers));
		arrays.insert(this._sizers, msg.currentIndex, sizer);
		this.node.appendChild(msg.child.node);
		this.node.appendChild(getHandle(msg.child).node);
		if (this.isAttached)
			phosphor_messaging_1.sendMessage(msg.child, phosphor_widget_1.Widget.MsgAfterAttach);
		phosphor_messaging_1.postMessage(this, phosphor_widget_1.Panel.MsgLayoutRequest);
	};

	SplitPanel.prototype.onChildMoved = function (msg) {
		arrays.move(this._sizers, msg.previousIndex, msg.currentIndex);
		phosphor_messaging_1.postMessage(this, phosphor_widget_1.Panel.MsgLayoutRequest);
	};

	SplitPanel.prototype.onChildRemoved = function (msg) {
		arrays.removeAt(this._sizers, msg.previousIndex);
		if (this.isAttached)
			phosphor_messaging_1.sendMessage(msg.child, phosphor_widget_1.Widget.MsgBeforeDetach);
		this.node.removeChild(msg.child.node);
		this.node.removeChild(getHandle(msg.child).node);
		phosphor_messaging_1.postMessage(this, phosphor_widget_1.Panel.MsgLayoutRequest);
		resetGeometry(msg.child);
	};

	SplitPanel.prototype.onAfterShow = function (msg) {
		_super.prototype.onAfterShow.call(this, msg);
		phosphor_messaging_1.sendMessage(this, phosphor_widget_1.Widget.MsgUpdateRequest);
	};

	SplitPanel.prototype.onAfterAttach = function (msg) {
		_super.prototype.onAfterAttach.call(this, msg);
		this.node.addEventListener('mousedown', this);
		phosphor_messaging_1.postMessage(this, phosphor_widget_1.Panel.MsgLayoutRequest);
	};

	SplitPanel.prototype.onBeforeDetach = function (msg) {
		_super.prototype.onBeforeDetach.call(this, msg);
		this.node.removeEventListener('mousedown', this);
	};

	SplitPanel.prototype.onChildShown = function (msg) {
		phosphor_messaging_1.postMessage(this, phosphor_widget_1.Panel.MsgLayoutRequest);
	};

	SplitPanel.prototype.onChildHidden = function (msg) {
		phosphor_messaging_1.postMessage(this, phosphor_widget_1.Panel.MsgLayoutRequest);
	};

	SplitPanel.prototype.onResize = function (msg) {
		if (this.isVisible) {
			var width = msg.width < 0 ? this.node.offsetWidth : msg.width;
			var height = msg.height < 0 ? this.node.offsetHeight : msg.height;
			this._layoutChildren(width, height);
		}
	};

	SplitPanel.prototype.onUpdateRequest = function (msg) {
		if (this.isVisible) {
			this._layoutChildren(this.node.offsetWidth, this.node.offsetHeight);
		}
	};

	SplitPanel.prototype.onLayoutRequest = function (msg) {
		if (this.isAttached) {
			this._setupGeometry();
		}
	};

	SplitPanel.prototype._setupGeometry = function () {

		var visibleCount = 0;
		var orientation = this.orientation;
		var lastVisibleHandle = null;
		for (var i = 0, n = this.childCount(); i < n; ++i) {
			var widget = this.childAt(i);
			var handle = getHandle(widget);
			handle.hidden = widget.hidden;
			handle.orientation = orientation;
			if (!handle.hidden) {
				lastVisibleHandle = handle;
				visibleCount++;
			}
		}

		if (lastVisibleHandle)
			lastVisibleHandle.hidden = true;
		this._fixedSpace = this.spacing * Math.max(0, visibleCount - 1);

		var minW = 0;
		var minH = 0;
		var maxW = Infinity;
		var maxH = Infinity;
		if (orientation === Orientation.Horizontal) {
			minW = this._fixedSpace;
			maxW = visibleCount > 0 ? minW : maxW;
			for (var i = 0, n = this.childCount(); i < n; ++i) {
				var widget = this.childAt(i);
				var sizer = this._sizers[i];
				if (sizer.size > 0) {
					sizer.sizeHint = sizer.size;
				}
				if (widget.hidden) {
					sizer.minSize = 0;
					sizer.maxSize = 0;
					continue;
				}
				var limits = phosphor_domutil_1.sizeLimits(widget.node);
				sizer.stretch = SplitPanel.getStretch(widget);
				sizer.minSize = limits.minWidth;
				sizer.maxSize = limits.maxWidth;
				minW += limits.minWidth;
				maxW += limits.maxWidth;
				minH = Math.max(minH, limits.minHeight);
				maxH = Math.min(maxH, limits.maxHeight);
			}
		}
		else {
			minH = this._fixedSpace;
			maxH = visibleCount > 0 ? minH : maxH;
			for (var i = 0, n = this.childCount(); i < n; ++i) {
				var widget = this.childAt(i);
				var sizer = this._sizers[i];
				if (sizer.size > 0) {
					sizer.sizeHint = sizer.size;
				}
				if (widget.hidden) {
					sizer.minSize = 0;
					sizer.maxSize = 0;
					continue;
				}
				var limits = phosphor_domutil_1.sizeLimits(widget.node);
				sizer.stretch = SplitPanel.getStretch(widget);
				sizer.minSize = limits.minHeight;
				sizer.maxSize = limits.maxHeight;
				minH += limits.minHeight;
				maxH += limits.maxHeight;
				minW = Math.max(minW, limits.minWidth);
				maxW = Math.min(maxW, limits.maxWidth);
			}
		}

		this._box = phosphor_domutil_1.boxSizing(this.node);
		minW += this._box.horizontalSum;
		minH += this._box.verticalSum;
		maxW += this._box.horizontalSum;
		maxH += this._box.verticalSum;

		var style = this.node.style;
		style.minWidth = minW + 'px';
		style.minHeight = minH + 'px';
		style.maxWidth = maxW === Infinity ? 'none' : maxW + 'px';
		style.maxHeight = maxH === Infinity ? 'none' : maxH + 'px';

		if (this.parent)
			phosphor_messaging_1.sendMessage(this.parent, phosphor_widget_1.Panel.MsgLayoutRequest);

		phosphor_messaging_1.sendMessage(this, phosphor_widget_1.Widget.MsgUpdateRequest);
	};

	SplitPanel.prototype._layoutChildren = function (offsetWidth, offsetHeight) {

		if (this.childCount() === 0) {
			return;
		}

		var box = this._box || (this._box = phosphor_domutil_1.boxSizing(this.node));

		var top = box.paddingTop;
		var left = box.paddingLeft;
		var width = offsetWidth - box.horizontalSum;
		var height = offsetHeight - box.verticalSum;

		var horizontal = this.orientation === Orientation.Horizontal;

		if (this._pendingSizes) {
			var space = horizontal ? width : height;
			var adjusted = Math.max(0, space - this._fixedSpace);
			for (var i = 0, n = this._sizers.length; i < n; ++i) {
				this._sizers[i].sizeHint *= adjusted;
			}
			this._pendingSizes = false;
		}

		var spacing = this.spacing;
		if (horizontal) {
			phosphor_boxengine_1.boxCalc(this._sizers, Math.max(0, width - this._fixedSpace));
			for (var i = 0, n = this.childCount(); i < n; ++i) {
				var widget = this.childAt(i);
				if (widget.hidden) {
					continue;
				}
				var size = this._sizers[i].size;
				setGeometry(widget, left, top, size, height);
				getHandle(widget).setGeometry(left + size, top, spacing, height);
				left += size + spacing;
			}
		}
		else {
			phosphor_boxengine_1.boxCalc(this._sizers, Math.max(0, height - this._fixedSpace));
			for (var i = 0, n = this.childCount(); i < n; ++i) {
				var widget = this.childAt(i);
				if (widget.hidden) {
					continue;
				}
				var size = this._sizers[i].size;
				setGeometry(widget, left, top, width, size);
				getHandle(widget).setGeometry(left, top + size, width, spacing);
				top += size + spacing;
			}
		}
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
		var index = findHandleIndex(this, event.target);
		if (index === -1) {
			return;
		}
		event.preventDefault();
		event.stopPropagation();
		document.addEventListener('keydown', this, true);
		document.addEventListener('keyup', this, true);
		document.addEventListener('keypress', this, true);
		document.addEventListener('contextmenu', this, true);
		document.addEventListener('mouseup', this, true);
		document.addEventListener('mousemove', this, true);
		var delta;
		var node = getHandle(this.childAt(index)).node;
		if (this.orientation === Orientation.Horizontal) {
			delta = event.clientX - node.getBoundingClientRect().left;
		}
		else {
			delta = event.clientY - node.getBoundingClientRect().top;
		}
		var override = phosphor_domutil_1.overrideCursor(window.getComputedStyle(node).cursor);
		this._pressData = { index: index, delta: delta, override: override };
	};

	SplitPanel.prototype._evtMouseMove = function (event) {
		event.preventDefault();
		event.stopPropagation();
		var pos;
		var data = this._pressData;
		var rect = this.node.getBoundingClientRect();
		if (this.orientation === Orientation.Horizontal) {
			pos = event.clientX - data.delta - rect.left;
		}
		else {
			pos = event.clientY - data.delta - rect.top;
		}
		this._moveHandle(data.index, pos);
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
		document.removeEventListener('keydown', this, true);
		document.removeEventListener('keyup', this, true);
		document.removeEventListener('keypress', this, true);
		document.removeEventListener('contextmenu', this, true);
		document.removeEventListener('mouseup', this, true);
		document.removeEventListener('mousemove', this, true);
	};

	SplitPanel.prototype._moveHandle = function (index, pos) {

		var widget = this.childAt(index);
		if (!widget) {
			return;
		}

		var handle = getHandle(widget);
		if (handle.hidden) {
			return;
		}

		var delta;
		if (this.orientation === Orientation.Horizontal) {
			delta = pos - handle.node.offsetLeft;
		}
		else {
			delta = pos - handle.node.offsetTop;
		}

		if (delta === 0) {
			return;
		}

		for (var i = 0, n = this._sizers.length; i < n; ++i) {
			var sizer = this._sizers[i];
			if (sizer.size > 0)
				sizer.sizeHint = sizer.size;
		}

		if (delta > 0) {
			growSizer(this._sizers, index, delta);
		}
		else {
			shrinkSizer(this._sizers, index, -delta);
		}





		phosphor_messaging_1.postMessage(this, phosphor_widget_1.Widget.MsgUpdateRequest);
	};

	SplitPanel.prototype._onOrientationChanged = function (old, value) {
		this.toggleClass(HORIZONTAL_CLASS, value === Orientation.Horizontal);
		this.toggleClass(VERTICAL_CLASS, value === Orientation.Vertical);
		phosphor_messaging_1.postMessage(this, phosphor_widget_1.Panel.MsgLayoutRequest);
	};

	SplitPanel.Horizontal = Orientation.Horizontal;

	SplitPanel.Vertical = Orientation.Vertical;

	SplitPanel.orientationProperty = new phosphor_properties_1.Property({
		name: 'orientation',
		value: Orientation.Horizontal,
		changed: function (owner, old, value) { return owner._onOrientationChanged(old, value); },
	});

	SplitPanel.spacingProperty = new phosphor_properties_1.Property({
		name: 'spacing',
		value: 3,
		coerce: function (owner, value) { return Math.max(0, value | 0); },
		changed: function (owner) { return phosphor_messaging_1.postMessage(owner, phosphor_widget_1.Panel.MsgLayoutRequest); },
	});

	SplitPanel.stretchProperty = new phosphor_properties_1.Property({
		name: 'stretch',
		value: 0,
		coerce: function (owner, value) { return Math.max(0, value | 0); },
		changed: onChildPropertyChanged,
	});
	return SplitPanel;
})(phosphor_widget_1.Panel);
exports.SplitPanel = SplitPanel;

var SplitHandle = (function (_super) {
	__extends(SplitHandle, _super);

	function SplitHandle() {
		_super.call(this);
		this._hidden = false;
		this._orientation = Orientation.Horizontal;
		this.addClass(SPLIT_HANDLE_CLASS);
		this.addClass(HORIZONTAL_CLASS);
	}

	SplitHandle.createNode = function () {
		var node = document.createElement('div');
		var overlay = document.createElement('div');
		overlay.className = OVERLAY_CLASS;
		node.appendChild(overlay);
		return node;
	};
	Object.defineProperty(SplitHandle.prototype, "hidden", {

		get: function () {
			return this._hidden;
		},

		set: function (hidden) {
			if (hidden === this._hidden) {
				return;
			}
			this._hidden = hidden;
			this.toggleClass(HIDDEN_CLASS, hidden);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(SplitHandle.prototype, "orientation", {

		get: function () {
			return this._orientation;
		},

		set: function (value) {
			if (value === this._orientation) {
				return;
			}
			this._orientation = value;
			this.toggleClass(HORIZONTAL_CLASS, value === Orientation.Horizontal);
			this.toggleClass(VERTICAL_CLASS, value === Orientation.Vertical);
		},
		enumerable: true,
		configurable: true
	});

	SplitHandle.prototype.setGeometry = function (left, top, width, height) {
		var style = this.node.style;
		style.top = top + 'px';
		style.left = left + 'px';
		style.width = width + 'px';
		style.height = height + 'px';
	};
	return SplitHandle;
})(phosphor_nodewrapper_1.NodeWrapper);

var splitHandleProperty = new phosphor_properties_1.Property({
	name: 'splitHandle',
	create: function (owner) { return new SplitHandle(); },
});

var rectProperty = new phosphor_properties_1.Property({
	name: 'rect',
	create: createRect,
});

function getHandle(widget) {
	return splitHandleProperty.get(widget);
}

function createRect() {
	return { top: NaN, left: NaN, width: NaN, height: NaN };
}

function getRect(widget) {
	return rectProperty.get(widget);
}

function findHandleIndex(panel, target) {
	for (var i = 0, n = panel.childCount(); i < n; ++i) {
		var handle = getHandle(panel.childAt(i));
		if (handle.node.contains(target))
			return i;
	}
	return -1;
}

function setGeometry(widget, left, top, width, height) {
	var resized = false;
	var rect = getRect(widget);
	var style = widget.node.style;
	if (rect.top !== top) {
		rect.top = top;
		style.top = top + 'px';
	}
	if (rect.left !== left) {
		rect.left = left;
		style.left = left + 'px';
	}
	if (rect.width !== width) {
		resized = true;
		rect.width = width;
		style.width = width + 'px';
	}
	if (rect.height !== height) {
		resized = true;
		rect.height = height;
		style.height = height + 'px';
	}
	if (resized) {
		phosphor_messaging_1.sendMessage(widget, new phosphor_widget_1.ResizeMessage(width, height));
	}
}

function resetGeometry(widget) {
	var rect = getRect(widget);
	var style = widget.node.style;
	rect.top = NaN;
	rect.left = NaN;
	rect.width = NaN;
	rect.height = NaN;
	style.top = '';
	style.left = '';
	style.width = '';
	style.height = '';
}

function onChildPropertyChanged(child) {
	if (child.parent instanceof SplitPanel) {
		phosphor_messaging_1.postMessage(child.parent, phosphor_widget_1.Panel.MsgLayoutRequest);
	}
}

function createSizer(size) {
	var sizer = new phosphor_boxengine_1.BoxSizer();
	sizer.sizeHint = size | 0;
	return sizer;
}

function averageSize(sizers) {
	var sum = sizers.reduce(function (v, s) { return v + s.size; }, 0);
	return sum > 0 ? sum / sizers.length : 0;
}

function growSizer(sizers, index, delta) {
	var growLimit = 0;
	for (var i = 0; i <= index; ++i) {
		var sizer = sizers[i];
		growLimit += sizer.maxSize - sizer.size;
	}
	var shrinkLimit = 0;
	for (var i = index + 1, n = sizers.length; i < n; ++i) {
		var sizer = sizers[i];
		shrinkLimit += sizer.size - sizer.minSize;
	}
	delta = Math.min(delta, growLimit, shrinkLimit);
	var grow = delta;
	for (var i = index; i >= 0 && grow > 0; --i) {
		var sizer = sizers[i];
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
		var sizer = sizers[i];
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

function shrinkSizer(sizers, index, delta) {
	var growLimit = 0;
	for (var i = index + 1, n = sizers.length; i < n; ++i) {
		var sizer = sizers[i];
		growLimit += sizer.maxSize - sizer.size;
	}
	var shrinkLimit = 0;
	for (var i = 0; i <= index; ++i) {
		var sizer = sizers[i];
		shrinkLimit += sizer.size - sizer.minSize;
	}
	delta = Math.min(delta, growLimit, shrinkLimit);
	var grow = delta;
	for (var i = index + 1, n = sizers.length; i < n && grow > 0; ++i) {
		var sizer = sizers[i];
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
		var sizer = sizers[i];
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

function normalize(values) {
	var n = values.length;
	if (n === 0) {
		return [];
	}
	var sum = 0;
	for (var i = 0; i < n; ++i) {
		sum += values[i];
	}
	var result = new Array(n);
	if (sum === 0) {
		for (var i = 0; i < n; ++i) {
			result[i] = 1 / n;
		}
	}
	else {
		for (var i = 0; i < n; ++i) {
			result[i] = values[i] / sum;
		}
	}
	return result;
}

},{"./index.css":28,"phosphor-arrays":30,"phosphor-boxengine":3,"phosphor-domutil":13,"phosphor-messaging":23,"phosphor-nodewrapper":25,"phosphor-properties":26,"phosphor-widget":40}],30:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],31:[function(require,module,exports){
var css = ".p-StackedPanel{position:relative}.p-StackedPanel>.p-Widget{position:absolute}"; (require("browserify-css").createStyle(css, { "href": "node_modules\\phosphor-stackedpanel\\lib\\index.css"})); module.exports = css;
},{"browserify-css":2}],32:[function(require,module,exports){

'use strict';
var __extends = (this && this.__extends) || function (d, b) {
	for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	function __() { this.constructor = d; }
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var phosphor_domutil_1 = require('phosphor-domutil');
var phosphor_messaging_1 = require('phosphor-messaging');
var phosphor_properties_1 = require('phosphor-properties');
var phosphor_signaling_1 = require('phosphor-signaling');
var phosphor_widget_1 = require('phosphor-widget');
require('./index.css');

var STACKED_PANEL_CLASS = 'p-StackedPanel';

var StackedPanel = (function (_super) {
	__extends(StackedPanel, _super);

	function StackedPanel() {
		_super.call(this);
		this._box = null;
		this.addClass(STACKED_PANEL_CLASS);
	}
	Object.defineProperty(StackedPanel.prototype, "currentWidget", {

		get: function () {
			return StackedPanel.currentWidgetProperty.get(this);
		},

		set: function (widget) {
			StackedPanel.currentWidgetProperty.set(this, widget);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(StackedPanel.prototype, "currentWidgetChanged", {

		get: function () {
			return StackedPanel.currentWidgetProperty.notify.bind(this);
		},
		enumerable: true,
		configurable: true
	});

	StackedPanel.prototype.onChildAdded = function (msg) {
		msg.child.hidden = true;
		this.node.appendChild(msg.child.node);
		if (this.isAttached)
			phosphor_messaging_1.sendMessage(msg.child, phosphor_widget_1.Widget.MsgAfterAttach);
	};

	StackedPanel.prototype.onChildMoved = function (msg) { };

	StackedPanel.prototype.onChildRemoved = function (msg) {
		if (msg.child === this.currentWidget)
			this.currentWidget = null;
		if (this.isAttached)
			phosphor_messaging_1.sendMessage(msg.child, phosphor_widget_1.Widget.MsgBeforeDetach);
		this.node.removeChild(msg.child.node);
		resetGeometry(msg.child);
	};

	StackedPanel.prototype.onAfterShow = function (msg) {
		_super.prototype.onAfterShow.call(this, msg);
		phosphor_messaging_1.sendMessage(this, phosphor_widget_1.Widget.MsgUpdateRequest);
	};

	StackedPanel.prototype.onAfterAttach = function (msg) {
		_super.prototype.onAfterAttach.call(this, msg);
		phosphor_messaging_1.postMessage(this, phosphor_widget_1.Panel.MsgLayoutRequest);
	};

	StackedPanel.prototype.onResize = function (msg) {
		if (this.isVisible) {
			var width = msg.width < 0 ? this.node.offsetWidth : msg.width;
			var height = msg.height < 0 ? this.node.offsetHeight : msg.height;
			this._layoutChildren(width, height);
		}
	};

	StackedPanel.prototype.onUpdateRequest = function (msg) {
		if (this.isVisible) {
			this._layoutChildren(this.node.offsetWidth, this.node.offsetHeight);
		}
	};

	StackedPanel.prototype.onLayoutRequest = function (msg) {
		if (this.isAttached) {
			this._setupGeometry();
		}
	};

	StackedPanel.prototype._setupGeometry = function () {

		var minW = 0;
		var minH = 0;
		var maxW = Infinity;
		var maxH = Infinity;
		var widget = this.currentWidget;
		if (widget) {
			var limits = phosphor_domutil_1.sizeLimits(widget.node);
			minW = limits.minWidth;
			minH = limits.minHeight;
			maxW = limits.maxWidth;
			maxH = limits.maxHeight;
		}

		this._box = phosphor_domutil_1.boxSizing(this.node);
		minW += this._box.horizontalSum;
		minH += this._box.verticalSum;
		maxW += this._box.horizontalSum;
		maxH += this._box.verticalSum;

		var style = this.node.style;
		style.minWidth = minW + 'px';
		style.minHeight = minH + 'px';
		style.maxWidth = maxW === Infinity ? 'none' : maxW + 'px';
		style.maxHeight = maxH === Infinity ? 'none' : maxH + 'px';

		if (this.parent)
			phosphor_messaging_1.sendMessage(this.parent, phosphor_widget_1.Panel.MsgLayoutRequest);

		phosphor_messaging_1.sendMessage(this, phosphor_widget_1.Widget.MsgUpdateRequest);
	};

	StackedPanel.prototype._layoutChildren = function (offsetWidth, offsetHeight) {

		var widget = this.currentWidget;
		if (!widget) {
			return;
		}

		var box = this._box || (this._box = phosphor_domutil_1.boxSizing(this.node));

		var top = box.paddingTop;
		var left = box.paddingLeft;
		var width = offsetWidth - box.horizontalSum;
		var height = offsetHeight - box.verticalSum;

		setGeometry(widget, left, top, width, height);
	};

	StackedPanel.prototype._onCurrentWidgetChanged = function (old, val) {
		if (old)
			old.hidden = true;
		if (val)
			val.hidden = false;




		phosphor_messaging_1.sendMessage(this, phosphor_widget_1.Panel.MsgLayoutRequest);
	};

	StackedPanel.currentWidgetProperty = new phosphor_properties_1.Property({
		name: 'currentWidget',
		value: null,
		coerce: function (owner, val) { return (val && val.parent === owner) ? val : null; },
		changed: function (owner, old, val) { return owner._onCurrentWidgetChanged(old, val); },
		notify: new phosphor_signaling_1.Signal(),
	});
	return StackedPanel;
})(phosphor_widget_1.Panel);
exports.StackedPanel = StackedPanel;

var rectProperty = new phosphor_properties_1.Property({
	name: 'rect',
	create: createRect,
});

function createRect() {
	return { top: NaN, left: NaN, width: NaN, height: NaN };
}

function getRect(widget) {
	return rectProperty.get(widget);
}

function setGeometry(widget, left, top, width, height) {
	var resized = false;
	var rect = getRect(widget);
	var style = widget.node.style;
	if (rect.top !== top) {
		rect.top = top;
		style.top = top + 'px';
	}
	if (rect.left !== left) {
		rect.left = left;
		style.left = left + 'px';
	}
	if (rect.width !== width) {
		resized = true;
		rect.width = width;
		style.width = width + 'px';
	}
	if (rect.height !== height) {
		resized = true;
		rect.height = height;
		style.height = height + 'px';
	}
	if (resized) {
		phosphor_messaging_1.sendMessage(widget, new phosphor_widget_1.ResizeMessage(width, height));
	}
}

function resetGeometry(widget) {
	var rect = getRect(widget);
	var style = widget.node.style;
	rect.top = NaN;
	rect.left = NaN;
	rect.width = NaN;
	rect.height = NaN;
	style.top = '';
	style.left = '';
	style.width = '';
	style.height = '';
}

},{"./index.css":31,"phosphor-domutil":13,"phosphor-messaging":23,"phosphor-properties":26,"phosphor-signaling":27,"phosphor-widget":40}],33:[function(require,module,exports){
var css = ".p-TabBar{position:relative;z-index:0}.p-TabBar-header{display:none;position:absolute;top:0;left:0;right:0;z-index:0}.p-TabBar-body{position:absolute;top:0;left:0;right:0;bottom:0;z-index:2}.p-TabBar-footer{display:none;position:absolute;left:0;right:0;bottom:0;z-index:1}.p-TabBar-content{margin:0;padding:0;height:100%;display:flex;flex-direction:row;list-style-type:none}.p-Tab{display:flex;flex-direction:row;box-sizing:border-box;overflow:hidden}.p-Tab-close,.p-Tab-icon{flex:0 0 auto}.p-Tab-text{flex:1 1 auto;overflow:hidden;white-space:nowrap}.p-TabBar.p-mod-dragging .p-Tab{position:relative;left:0;transition:left 150ms ease}.p-TabBar.p-mod-dragging .p-Tab.p-mod-dragging{transition:none}.p-TabPanel{z-index:0}.p-TabPanel>.p-TabBar{z-index:1}.p-TabPanel>.p-StackedPanel{z-index:0}"; (require("browserify-css").createStyle(css, { "href": "node_modules\\phosphor-tabs\\lib\\index.css"})); module.exports = css;
},{"browserify-css":2}],34:[function(require,module,exports){

'use strict';
function __export(m) {
	for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(require('./tabbar'));
__export(require('./tabpanel'));
require('./index.css');

},{"./index.css":33,"./tabbar":35,"./tabpanel":36}],35:[function(require,module,exports){

'use strict';
var __extends = (this && this.__extends) || function (d, b) {
	for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	function __() { this.constructor = d; }
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var arrays = require('phosphor-arrays');
var phosphor_domutil_1 = require('phosphor-domutil');
var phosphor_messaging_1 = require('phosphor-messaging');
var phosphor_nodewrapper_1 = require('phosphor-nodewrapper');
var phosphor_observablelist_1 = require('phosphor-observablelist');
var phosphor_properties_1 = require('phosphor-properties');
var phosphor_signaling_1 = require('phosphor-signaling');
var phosphor_widget_1 = require('phosphor-widget');

var TAB_BAR_CLASS = 'p-TabBar';

var HEADER_CLASS = 'p-TabBar-header';

var BODY_CLASS = 'p-TabBar-body';

var CONTENT_CLASS = 'p-TabBar-content';

var FOOTER_CLASS = 'p-TabBar-footer';

var TAB_CLASS = 'p-Tab';

var TEXT_CLASS = 'p-Tab-text';

var ICON_CLASS = 'p-Tab-icon';

var CLOSE_CLASS = 'p-Tab-close';

var DRAGGING_CLASS = 'p-mod-dragging';

var CURRENT_CLASS = 'p-mod-current';

var CLOSABLE_CLASS = 'p-mod-closable';

var FIRST_CLASS = 'p-mod-first';

var LAST_CLASS = 'p-mod-last';

var DRAG_THRESHOLD = 5;

var TEAR_OFF_THRESHOLD = 20;

var TRANSITION_DURATION = 150;

var TabBar = (function (_super) {
	__extends(TabBar, _super);

	function TabBar() {
		_super.call(this);
		this._tabs = [];
		this._dragData = null;
		this.addClass(TAB_BAR_CLASS);
	}

	TabBar.createNode = function () {
		var node = document.createElement('div');
		var header = document.createElement('div');
		var body = document.createElement('div');
		var content = document.createElement('ul');
		var footer = document.createElement('div');
		header.className = HEADER_CLASS;
		body.className = BODY_CLASS;
		content.className = CONTENT_CLASS;
		footer.className = FOOTER_CLASS;
		body.appendChild(content);
		node.appendChild(header);
		node.appendChild(body);
		node.appendChild(footer);
		return node;
	};

	TabBar.prototype.dispose = function () {
		this._releaseMouse();
		this._tabs.forEach(function (tab) { tab.dispose(); });
		this._tabs.length = 0;
		_super.prototype.dispose.call(this);
	};
	Object.defineProperty(TabBar.prototype, "itemCloseRequested", {

		get: function () {
			return TabBar.itemCloseRequestedSignal.bind(this);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(TabBar.prototype, "currentItem", {

		get: function () {
			return TabBar.currentItemProperty.get(this);
		},

		set: function (value) {
			TabBar.currentItemProperty.set(this, value);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(TabBar.prototype, "currentItemChanged", {

		get: function () {
			return TabBar.currentItemProperty.notify.bind(this);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(TabBar.prototype, "items", {

		get: function () {
			return TabBar.itemsProperty.get(this);
		},

		set: function (value) {
			TabBar.itemsProperty.set(this, value);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(TabBar.prototype, "tabsMovable", {

		get: function () {
			return TabBar.tabsMovableProperty.get(this);
		},

		set: function (value) {
			TabBar.tabsMovableProperty.set(this, value);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(TabBar.prototype, "headerNode", {

		get: function () {
			return this.node.getElementsByClassName(HEADER_CLASS)[0];
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(TabBar.prototype, "bodyNode", {

		get: function () {
			return this.node.getElementsByClassName(BODY_CLASS)[0];
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(TabBar.prototype, "contentNode", {

		get: function () {
			return this.node.getElementsByClassName(CONTENT_CLASS)[0];
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(TabBar.prototype, "footerNode", {

		get: function () {
			return this.node.getElementsByClassName(FOOTER_CLASS)[0];
		},
		enumerable: true,
		configurable: true
	});

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
		}
	};

	TabBar.prototype.processMessage = function (msg) {
		if (msg.type === 'tear-off-request') {
			this.onTearOffRequest(msg);
		}
		else {
			_super.prototype.processMessage.call(this, msg);
		}
	};

	TabBar.prototype.onTearOffRequest = function (msg) { };

	TabBar.prototype.onAfterAttach = function (msg) {
		this.node.addEventListener('click', this);
		this.node.addEventListener('mousedown', this);
	};

	TabBar.prototype.onBeforeDetach = function (msg) {
		this.node.removeEventListener('click', this);
		this.node.removeEventListener('mousedown', this);
	};

	TabBar.prototype.onUpdateRequest = function (msg) {
		for (var i = 0, n = this._tabs.length, k = n - 1; i < n; ++i) {
			var tab = this._tabs[i];
			var style = tab.node.style;
			if (tab.hasClass(CURRENT_CLASS)) {
				style.zIndex = n + '';
			}
			else {
				style.zIndex = k-- + '';
			}
			style.order = i + '';
			tab.toggleClass(FIRST_CLASS, i === 0);
			tab.toggleClass(LAST_CLASS, i === n - 1);
		}
	};

	TabBar.prototype._evtClick = function (event) {

		if (event.button !== 0) {
			return;
		}

		var index = hitTestTabs(this._tabs, event.clientX, event.clientY);
		if (index < 0) {
			return;
		}

		event.preventDefault();
		event.stopPropagation();

		var tab = this._tabs[index];
		if (tab.closeNode.contains(event.target)) {
			this.itemCloseRequested.emit(tab.item);
		}
	};

	TabBar.prototype._evtMouseDown = function (event) {

		if (event.button !== 0) {
			return;
		}

		if (this._dragData) {
			return;
		}

		var index = hitTestTabs(this._tabs, event.clientX, event.clientY);
		if (index < 0) {
			return;
		}

		event.preventDefault();
		event.stopPropagation();

		var tab = this._tabs[index];
		if (tab.closeNode.contains(event.target)) {
			return;
		}

		if (this.tabsMovable) {
			var tabRect = tab.node.getBoundingClientRect();
			var data = this._dragData = new DragData();
			data.tab = tab;
			data.tabIndex = index;
			data.tabLeft = tab.node.offsetLeft;
			data.tabWidth = tabRect.width;
			data.pressX = event.clientX;
			data.pressY = event.clientY;
			data.tabPressX = event.clientX - tabRect.left;
			document.addEventListener('mouseup', this, true);
			document.addEventListener('mousemove', this, true);
		}

		this.currentItem = tab.item;
	};

	TabBar.prototype._evtMouseMove = function (event) {


		event.preventDefault();
		event.stopPropagation();

		var data = this._dragData;
		if (!data) {
			return;
		}


		if (!data.dragActive) {
			var dx = Math.abs(event.clientX - data.pressX);
			var dy = Math.abs(event.clientY - data.pressY);
			if (dx < DRAG_THRESHOLD && dy < DRAG_THRESHOLD) {
				return;
			}

			data.contentRect = this.contentNode.getBoundingClientRect();
			data.tabLayout = snapTabLayout(this._tabs);
			data.cursorGrab = phosphor_domutil_1.overrideCursor('default');
			data.dragActive = true;

			data.tab.addClass(DRAGGING_CLASS);
			this.addClass(DRAGGING_CLASS);
		}

		if (!data.tearOffRequested && tearOffExceeded(data.contentRect, event)) {

			data.tearOffRequested = true;

			var item = data.tab.item;
			var node = data.tab.node;
			var clientX = event.clientX;
			var clientY = event.clientY;
			phosphor_messaging_1.sendMessage(this, new TearOffMessage(item, node, clientX, clientY));

			if (!this._dragData) {
				return;
			}
		}

		var offsetLeft = event.clientX - data.contentRect.left;
		var targetLeft = offsetLeft - data.tabPressX;
		var targetRight = targetLeft + data.tabWidth;

		data.tabTargetIndex = data.tabIndex;

		var tabs = this._tabs;
		for (var i = 0, n = tabs.length; i < n; ++i) {
			var style = tabs[i].node.style;
			var layout = data.tabLayout[i];
			var threshold = layout.left + (layout.width >> 1);
			if (i < data.tabIndex && targetLeft < threshold) {
				style.left = data.tabWidth + data.tabLayout[i + 1].margin + 'px';
				data.tabTargetIndex = Math.min(data.tabTargetIndex, i);
			}
			else if (i > data.tabIndex && targetRight > threshold) {
				style.left = -data.tabWidth - layout.margin + 'px';
				data.tabTargetIndex = i;
			}
			else if (i !== data.tabIndex) {
				style.left = '';
			}
		}

		var idealLeft = event.clientX - data.pressX;
		var maxLeft = data.contentRect.width - (data.tabLeft + data.tabWidth);
		var adjustedLeft = Math.max(-data.tabLeft, Math.min(idealLeft, maxLeft));
		data.tab.node.style.left = adjustedLeft + 'px';
	};

	TabBar.prototype._evtMouseUp = function (event) {
		var _this = this;

		if (event.button !== 0) {
			return;
		}


		event.preventDefault();
		event.stopPropagation();

		var data = this._dragData;
		if (!data) {
			return;
		}

		document.removeEventListener('mouseup', this, true);
		document.removeEventListener('mousemove', this, true);

		if (!data.dragActive) {
			this._dragData = null;
			return;
		}

		var idealLeft;
		if (data.tabTargetIndex === data.tabIndex) {
			idealLeft = 0;
		}
		else if (data.tabTargetIndex > data.tabIndex) {
			var tl = data.tabLayout[data.tabTargetIndex];
			idealLeft = tl.left + tl.width - data.tabWidth - data.tabLeft;
		}
		else {
			var tl = data.tabLayout[data.tabTargetIndex];
			idealLeft = tl.left - data.tabLeft;
		}

		var maxLeft = data.contentRect.width - (data.tabLeft + data.tabWidth);
		var adjustedLeft = Math.max(-data.tabLeft, Math.min(idealLeft, maxLeft));
		data.tab.node.style.left = adjustedLeft + 'px';

		data.tab.removeClass(DRAGGING_CLASS);

		setTimeout(function () {

			if (_this._dragData !== data) {
				return;
			}

			_this._dragData = null;

			for (var i = 0, n = _this._tabs.length; i < n; ++i) {
				_this._tabs[i].node.style.left = '';
			}

			data.cursorGrab.dispose();
			_this.removeClass(DRAGGING_CLASS);

			var fromIndex = data.tabIndex;
			var toIndex = data.tabTargetIndex;
			if (toIndex !== -1 && fromIndex !== toIndex) {
				_this.items.move(fromIndex, toIndex);

				phosphor_messaging_1.sendMessage(_this, phosphor_widget_1.Widget.MsgUpdateRequest);
			}
		}, TRANSITION_DURATION);
	};

	TabBar.prototype._releaseMouse = function () {

		var data = this._dragData;
		if (!data) {
			return;
		}

		this._dragData = null;

		document.removeEventListener('mouseup', this, true);
		document.removeEventListener('mousemove', this, true);

		if (!data.dragActive) {
			return;
		}

		for (var i = 0, n = this._tabs.length; i < n; ++i) {
			this._tabs[i].node.style.left = '';
		}

		data.cursorGrab.dispose();
		data.tab.removeClass(DRAGGING_CLASS);
		this.removeClass(DRAGGING_CLASS);
	};

	TabBar.prototype._coerceCurrentItem = function (item) {
		var list = this.items;
		return (item && list && list.contains(item)) ? item : null;
	};

	TabBar.prototype._onCurrentItemChanged = function (oldItem, newItem) {
		var oldTab = arrays.find(this._tabs, function (tab) { return tab.item === oldItem; });
		var newTab = arrays.find(this._tabs, function (tab) { return tab.item === newItem; });
		if (oldTab)
			oldTab.removeClass(CURRENT_CLASS);
		if (newTab)
			newTab.addClass(CURRENT_CLASS);
		this.update();
	};

	TabBar.prototype._onItemsChanged = function (oldList, newList) {

		this._releaseMouse();

		if (oldList) {
			oldList.changed.disconnect(this._onItemsListChanged, this);
			var content = this.contentNode;
			while (this._tabs.length) {
				var tab = this._tabs.pop();
				content.removeChild(tab.node);
				tab.dispose();
			}
		}

		if (newList) {
			var content = this.contentNode;
			for (var i = 0, n = newList.length; i < n; ++i) {
				var tab = new Tab(newList.get(i));
				content.appendChild(tab.node);
				this._tabs.push(tab);
			}
			newList.changed.connect(this._onItemsListChanged, this);
		}

		this.currentItem = newList && newList.get(0);

		this.update();
	};

	TabBar.prototype._onItemsListChanged = function (sender, args) {
		switch (args.type) {
			case phosphor_observablelist_1.ListChangeType.Add:
				this._onItemsListAdd(args);
				break;
			case phosphor_observablelist_1.ListChangeType.Move:
				this._onItemsListMove(args);
				break;
			case phosphor_observablelist_1.ListChangeType.Remove:
				this._onItemsListRemove(args);
				break;
			case phosphor_observablelist_1.ListChangeType.Replace:
				this._onItemsListReplace(args);
				break;
			case phosphor_observablelist_1.ListChangeType.Set:
				this._onItemsListSet(args);
				break;
		}
	};

	TabBar.prototype._onItemsListAdd = function (args) {

		this._releaseMouse();

		var tab = new Tab(args.newValue);

		arrays.insert(this._tabs, args.newIndex, tab);

		this.contentNode.appendChild(tab.node);

		if (!this.currentItem)
			this.currentItem = tab.item;

		this.update();
	};

	TabBar.prototype._onItemsListMove = function (args) {

		this._releaseMouse();

		arrays.move(this._tabs, args.oldIndex, args.newIndex);

		this.update();
	};

	TabBar.prototype._onItemsListRemove = function (args) {

		this._releaseMouse();

		var tab = arrays.removeAt(this._tabs, args.oldIndex);

		this.contentNode.removeChild(tab.node);

		if (this.currentItem === tab.item) {
			var list = this.items;
			this.currentItem = list.get(args.oldIndex) || list.get(-1);
		}

		tab.dispose();

		this.update();
	};

	TabBar.prototype._onItemsListReplace = function (args) {

		this._releaseMouse();

		var newItems = args.newValue;
		var newTabs = newItems.map(function (item) { return new Tab(item); });

		var oldItems = args.oldValue;
		var oldTabs = (_a = this._tabs).splice.apply(_a, [args.newIndex, oldItems.length].concat(newTabs));

		var content = this.contentNode;
		oldTabs.forEach(function (tab) { content.removeChild(tab.node); });

		newTabs.forEach(function (tab) { content.appendChild(tab.node); });

		var curr = this.currentItem;
		if (oldItems.indexOf(curr) !== -1) {
			this.currentItem = null;
			if (newItems.indexOf(curr) !== -1) {
				this.currentItem = curr;
			}
			else {
				var list = this.items;
				this.currentItem = list.get(args.newIndex) || list.get(-1);
			}
		}

		oldTabs.forEach(function (tab) { tab.dispose(); });

		this.update();
		var _a;
	};

	TabBar.prototype._onItemsListSet = function (args) {

		if (args.oldValue === args.newValue) {
			return;
		}

		this._releaseMouse();

		var newTab = new Tab(args.newValue);

		var oldTab = this._tabs[args.newIndex];
		this._tabs[args.newIndex] = newTab;

		this.contentNode.replaceChild(newTab.node, oldTab.node);

		if (this.currentItem === oldTab.item) {
			this.currentItem = newTab.item;
		}

		oldTab.dispose();

		this.update();
	};

	TabBar.itemCloseRequestedSignal = new phosphor_signaling_1.Signal();

	TabBar.currentItemProperty = new phosphor_properties_1.Property({
		name: 'currentItem',
		value: null,
		coerce: function (owner, value) { return owner._coerceCurrentItem(value); },
		changed: function (owner, old, value) { owner._onCurrentItemChanged(old, value); },
		notify: new phosphor_signaling_1.Signal(),
	});

	TabBar.itemsProperty = new phosphor_properties_1.Property({
		name: 'items',
		value: null,
		coerce: function (owner, value) { return value || null; },
		changed: function (owner, old, value) { owner._onItemsChanged(old, value); },
	});

	TabBar.tabsMovableProperty = new phosphor_properties_1.Property({
		name: 'tabsMovable',
		value: false,
		changed: function (owner) { owner._releaseMouse(); },
	});
	return TabBar;
})(phosphor_widget_1.Widget);
exports.TabBar = TabBar;

var TearOffMessage = (function (_super) {
	__extends(TearOffMessage, _super);

	function TearOffMessage(item, node, clientX, clientY) {
		_super.call(this, 'tear-off-request');
		this._item = item;
		this._node = node;
		this._clientX = clientX;
		this._clientY = clientY;
	}
	Object.defineProperty(TearOffMessage.prototype, "item", {

		get: function () {
			return this._item;
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(TearOffMessage.prototype, "node", {

		get: function () {
			return this._node;
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(TearOffMessage.prototype, "clientX", {

		get: function () {
			return this._clientX;
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(TearOffMessage.prototype, "clientY", {

		get: function () {
			return this._clientY;
		},
		enumerable: true,
		configurable: true
	});
	return TearOffMessage;
})(phosphor_messaging_1.Message);
exports.TearOffMessage = TearOffMessage;

var Tab = (function (_super) {
	__extends(Tab, _super);

	function Tab(item) {
		_super.call(this);
		this.addClass(TAB_CLASS);
		this._item = item;
		var title = item.title;
		this.textNode.textContent = title.text;
		this.toggleClass(CLOSABLE_CLASS, title.closable);
		if (title.icon)
			exAddClass(this.iconNode, title.icon);
		if (title.className)
			exAddClass(this.node, title.className);
		title.changed.connect(this._onTitleChanged, this);
	}

	Tab.createNode = function () {
		var node = document.createElement('li');
		var icon = document.createElement('span');
		var text = document.createElement('span');
		var close = document.createElement('span');
		icon.className = ICON_CLASS;
		text.className = TEXT_CLASS;
		close.className = CLOSE_CLASS;
		node.appendChild(icon);
		node.appendChild(text);
		node.appendChild(close);
		return node;
	};

	Tab.prototype.dispose = function () {
		this._item = null;
		phosphor_signaling_1.clearSignalData(this);
	};
	Object.defineProperty(Tab.prototype, "isDisposed", {

		get: function () {
			return this._item === null;
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(Tab.prototype, "iconNode", {

		get: function () {
			return this.node.childNodes[0];
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(Tab.prototype, "textNode", {

		get: function () {
			return this.node.childNodes[1];
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(Tab.prototype, "closeNode", {

		get: function () {
			return this.node.childNodes[2];
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(Tab.prototype, "item", {

		get: function () {
			return this._item;
		},
		enumerable: true,
		configurable: true
	});

	Tab.prototype._onTitleChanged = function (sender, args) {
		switch (args.name) {
			case 'text':
				this._onTitleTextChanged(args);
				break;
			case 'icon':
				this._onTitleIconChanged(args);
				break;
			case 'closable':
				this._onTitleClosableChanged(args);
				break;
			case 'className':
				this._onTitleClassNameChanged(args);
				break;
		}
	};

	Tab.prototype._onTitleTextChanged = function (args) {
		this.textNode.textContent = args.newValue;
	};

	Tab.prototype._onTitleIconChanged = function (args) {
		var node = this.iconNode;
		if (args.oldValue)
			exRemClass(node, args.oldValue);
		if (args.newValue)
			exAddClass(node, args.newValue);
	};

	Tab.prototype._onTitleClosableChanged = function (args) {
		this.toggleClass(CLOSABLE_CLASS, args.newValue);
	};

	Tab.prototype._onTitleClassNameChanged = function (args) {
		var node = this.node;
		if (args.oldValue)
			exRemClass(node, args.oldValue);
		if (args.newValue)
			exAddClass(node, args.newValue);
	};
	return Tab;
})(phosphor_nodewrapper_1.NodeWrapper);

var DragData = (function () {
	function DragData() {

		this.tab = null;

		this.tabIndex = -1;

		this.tabLeft = -1;

		this.tabWidth = -1;

		this.tabPressX = -1;

		this.tabTargetIndex = -1;

		this.tabLayout = null;

		this.pressX = -1;

		this.pressY = -1;

		this.contentRect = null;

		this.cursorGrab = null;

		this.dragActive = false;

		this.tearOffRequested = false;
	}
	return DragData;
})();

function exAddClass(node, name) {
	var list = node.classList;
	var parts = name.split(/\s+/);
	for (var i = 0, n = parts.length; i < n; ++i) {
		if (parts[i])
			list.add(parts[i]);
	}
}

function exRemClass(node, name) {
	var list = node.classList;
	var parts = name.split(/\s+/);
	for (var i = 0, n = parts.length; i < n; ++i) {
		if (parts[i])
			list.remove(parts[i]);
	}
}

function hitTestTabs(tabs, clientX, clientY) {
	for (var i = 0, n = tabs.length; i < n; ++i) {
		if (phosphor_domutil_1.hitTest(tabs[i].node, clientX, clientY))
			return i;
	}
	return -1;
}

function snapTabLayout(tabs) {
	var layout = new Array(tabs.length);
	for (var i = 0, n = tabs.length; i < n; ++i) {
		var node = tabs[i].node;
		var left = node.offsetLeft;
		var width = node.offsetWidth;
		var cstyle = window.getComputedStyle(node);
		var margin = parseInt(cstyle.marginLeft, 10) || 0;
		layout[i] = { margin: margin, left: left, width: width };
	}
	return layout;
}

function tearOffExceeded(rect, event) {
	return ((event.clientX < rect.left - TEAR_OFF_THRESHOLD) ||
		(event.clientX >= rect.right + TEAR_OFF_THRESHOLD) ||
		(event.clientY < rect.top - TEAR_OFF_THRESHOLD) ||
		(event.clientY >= rect.bottom + TEAR_OFF_THRESHOLD));
}

},{"phosphor-arrays":37,"phosphor-domutil":13,"phosphor-messaging":23,"phosphor-nodewrapper":25,"phosphor-observablelist":38,"phosphor-properties":26,"phosphor-signaling":27,"phosphor-widget":40}],36:[function(require,module,exports){

'use strict';
var __extends = (this && this.__extends) || function (d, b) {
	for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	function __() { this.constructor = d; }
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var phosphor_boxpanel_1 = require('phosphor-boxpanel');
var phosphor_stackedpanel_1 = require('phosphor-stackedpanel');
var tabbar_1 = require('./tabbar');

var TAB_PANEL_CLASS = 'p-TabPanel';

var TabPanel = (function (_super) {
	__extends(TabPanel, _super);

	function TabPanel() {
		_super.call(this);
		this.addClass(TAB_PANEL_CLASS);
		var ctor = this.constructor;
		this._tabs = ctor.createTabBar();
		this._stack = ctor.createStackedPanel();
		this._tabs.items = this._stack.children;
		this._tabs.currentItemChanged.connect(this.onCurrentItemChanged, this);
		this._tabs.itemCloseRequested.connect(this.onItemCloseRequested, this);
		phosphor_boxpanel_1.BoxPanel.setStretch(this._tabs, 0);
		phosphor_boxpanel_1.BoxPanel.setStretch(this._stack, 1);
		this.direction = phosphor_boxpanel_1.BoxPanel.TopToBottom;
		this.spacing = 0;
		this.children.add(this._tabs);
		this.children.add(this._stack);
	}

	TabPanel.createTabBar = function () {
		return new tabbar_1.TabBar();
	};

	TabPanel.createStackedPanel = function () {
		return new phosphor_stackedpanel_1.StackedPanel();
	};

	TabPanel.prototype.dispose = function () {
		this._tabs = null;
		this._stack = null;
		_super.prototype.dispose.call(this);
	};
	Object.defineProperty(TabPanel.prototype, "currentWidget", {

		get: function () {
			return this._tabs.currentItem;
		},

		set: function (widget) {
			this._tabs.currentItem = widget;
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(TabPanel.prototype, "tabsMovable", {

		get: function () {
			return this._tabs.tabsMovable;
		},

		set: function (movable) {
			this._tabs.tabsMovable = movable;
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(TabPanel.prototype, "widgets", {

		get: function () {
			return this._stack.children;
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(TabPanel.prototype, "tabs", {

		get: function () {
			return this._tabs;
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(TabPanel.prototype, "stack", {

		get: function () {
			return this._stack;
		},
		enumerable: true,
		configurable: true
	});

	TabPanel.prototype.onCurrentItemChanged = function (sender, args) {
		this._stack.currentWidget = args.newValue;
	};

	TabPanel.prototype.onItemCloseRequested = function (sender, args) {
		if (args.title.closable)
			args.close();
	};
	return TabPanel;
})(phosphor_boxpanel_1.BoxPanel);
exports.TabPanel = TabPanel;

},{"./tabbar":35,"phosphor-boxpanel":5,"phosphor-stackedpanel":32}],37:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],38:[function(require,module,exports){

'use strict';
var arrays = require('phosphor-arrays');
var phosphor_signaling_1 = require('phosphor-signaling');

(function (ListChangeType) {

	ListChangeType[ListChangeType["Add"] = 0] = "Add";

	ListChangeType[ListChangeType["Move"] = 1] = "Move";

	ListChangeType[ListChangeType["Remove"] = 2] = "Remove";

	ListChangeType[ListChangeType["Replace"] = 3] = "Replace";

	ListChangeType[ListChangeType["Set"] = 4] = "Set";
})(exports.ListChangeType || (exports.ListChangeType = {}));
var ListChangeType = exports.ListChangeType;

var ObservableList = (function () {

	function ObservableList(items) {
		this.internal = items ? items.slice() : [];
	}
	Object.defineProperty(ObservableList.prototype, "changed", {

		get: function () {
			return ObservableList.changedSignal.bind(this);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(ObservableList.prototype, "length", {

		get: function () {
			return this.internal.length;
		},
		enumerable: true,
		configurable: true
	});

	ObservableList.prototype.get = function (index) {
		return this.internal[this._norm(index)];
	};

	ObservableList.prototype.contains = function (item) {
		return this.internal.indexOf(item) !== -1;
	};

	ObservableList.prototype.indexOf = function (item) {
		return this.internal.indexOf(item);
	};

	ObservableList.prototype.slice = function (start, end) {
		return this.internal.slice(start, end);
	};

	ObservableList.prototype.set = function (index, item) {
		var i = this._norm(index);
		if (!this._check(i))
			return void 0;
		return this.setItem(i, item);
	};

	ObservableList.prototype.assign = function (items) {
		return this.replaceItems(0, this.internal.length, items);
	};

	ObservableList.prototype.add = function (item) {
		return this.addItem(this.internal.length, item);
	};

	ObservableList.prototype.insert = function (index, item) {
		return this.addItem(this._clamp(index), item);
	};

	ObservableList.prototype.move = function (fromIndex, toIndex) {
		var i = this._norm(fromIndex);
		if (!this._check(i))
			return false;
		var j = this._norm(toIndex);
		if (!this._check(j))
			return false;
		return this.moveItem(i, j);
	};

	ObservableList.prototype.remove = function (item) {
		var i = this.internal.indexOf(item);
		if (i !== -1)
			this.removeItem(i);
		return i;
	};

	ObservableList.prototype.removeAt = function (index) {
		var i = this._norm(index);
		if (!this._check(i))
			return void 0;
		return this.removeItem(i);
	};

	ObservableList.prototype.replace = function (index, count, items) {
		return this.replaceItems(this._norm(index), this._limit(count), items);
	};

	ObservableList.prototype.clear = function () {
		return this.replaceItems(0, this.internal.length, []);
	};

	ObservableList.prototype.addItem = function (index, item) {
		var i = arrays.insert(this.internal, index, item);
		this.changed.emit({
			type: ListChangeType.Add,
			newIndex: i,
			newValue: item,
			oldIndex: -1,
			oldValue: void 0,
		});
		return i;
	};

	ObservableList.prototype.moveItem = function (fromIndex, toIndex) {
		if (!arrays.move(this.internal, fromIndex, toIndex)) {
			return false;
		}
		var item = this.internal[toIndex];
		this.changed.emit({
			type: ListChangeType.Move,
			newIndex: toIndex,
			newValue: item,
			oldIndex: fromIndex,
			oldValue: item,
		});
		return true;
	};

	ObservableList.prototype.removeItem = function (index) {
		var item = arrays.removeAt(this.internal, index);
		this.changed.emit({
			type: ListChangeType.Remove,
			newIndex: -1,
			newValue: void 0,
			oldIndex: index,
			oldValue: item,
		});
		return item;
	};

	ObservableList.prototype.replaceItems = function (index, count, items) {
		var old = (_a = this.internal).splice.apply(_a, [index, count].concat(items));
		this.changed.emit({
			type: ListChangeType.Replace,
			newIndex: index,
			newValue: items,
			oldIndex: index,
			oldValue: old,
		});
		return old;
		var _a;
	};

	ObservableList.prototype.setItem = function (index, item) {
		var old = this.internal[index];
		this.internal[index] = item;
		this.changed.emit({
			type: ListChangeType.Set,
			newIndex: index,
			newValue: item,
			oldIndex: index,
			oldValue: old,
		});
		return old;
	};

	ObservableList.prototype._norm = function (i) {
		return i < 0 ? Math.floor(i) + this.internal.length : Math.floor(i);
	};

	ObservableList.prototype._check = function (i) {
		return i >= 0 && i < this.internal.length;
	};

	ObservableList.prototype._clamp = function (i) {
		return Math.max(0, Math.min(this._norm(i), this.internal.length));
	};

	ObservableList.prototype._limit = function (c) {
		return Math.max(0, Math.min(Math.floor(c), this.internal.length));
	};

	ObservableList.changedSignal = new phosphor_signaling_1.Signal();
	return ObservableList;
})();
exports.ObservableList = ObservableList;

},{"phosphor-arrays":37,"phosphor-signaling":27}],39:[function(require,module,exports){
var css = ".p-Widget{box-sizing:border-box;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;overflow:hidden;cursor:default}.p-Widget.p-mod-hidden{display:none}"; (require("browserify-css").createStyle(css, { "href": "node_modules\\phosphor-widget\\lib\\index.css"})); module.exports = css;
},{"browserify-css":2}],40:[function(require,module,exports){

'use strict';
function __export(m) {
	for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(require('./layout'));
__export(require('./panel'));
__export(require('./title'));
__export(require('./widget'));
require('./index.css');

},{"./index.css":39,"./layout":41,"./panel":42,"./title":43,"./widget":44}],41:[function(require,module,exports){

'use strict';
var __extends = (this && this.__extends) || function (d, b) {
	for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	function __() { this.constructor = d; }
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var phosphor_messaging_1 = require('phosphor-messaging');
var phosphor_properties_1 = require('phosphor-properties');
var phosphor_signaling_1 = require('phosphor-signaling');
var widget_1 = require('./widget');

var Layout = (function () {
	function Layout() {
		this._disposed = false;
		this._parent = null;
	}

	Layout.prototype.dispose = function () {
		this._disposed = true;
		this._parent = null;
		phosphor_signaling_1.clearSignalData(this);
		phosphor_properties_1.clearPropertyData(this);
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
				throw new Error('Cannot set layout parent to null.');
			}
			if (this._parent === value) {
				return;
			}
			if (this._parent) {
				throw new Error('Cannot change layout parent.');
			}
			if (value.layout !== this) {
				throw new Error('Invalid layout parent.');
			}
			this._parent = value;
			this.initialize();
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
			case 'after-attach':
				this.onAfterAttach(msg);
				break;
			case 'before-detach':
				this.onBeforeDetach(msg);
				break;
			case 'after-show':
				this.onAfterShow(msg);
				break;
			case 'before-hide':
				this.onBeforeHide(msg);
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

	Layout.prototype.onFitRequest = function (msg) { };

	Layout.prototype.onChildShown = function (msg) { };

	Layout.prototype.onChildHidden = function (msg) { };
	return Layout;
})();
exports.Layout = Layout;

var AbstractLayout = (function (_super) {
	__extends(AbstractLayout, _super);
	function AbstractLayout() {
		_super.apply(this, arguments);
	}

	AbstractLayout.prototype.childIndex = function (child) {
		for (var i = 0; i < this.childCount(); ++i) {
			if (this.childAt(i) === child)
				return i;
		}
		return -1;
	};

	AbstractLayout.prototype.onResize = function (msg) {
		for (var i = 0; i < this.childCount(); ++i) {
			phosphor_messaging_1.sendMessage(this.childAt(i), widget_1.ResizeMessage.UnknownSize);
		}
	};

	AbstractLayout.prototype.onUpdateRequest = function (msg) {
		for (var i = 0; i < this.childCount(); ++i) {
			phosphor_messaging_1.sendMessage(this.childAt(i), widget_1.ResizeMessage.UnknownSize);
		}
	};

	AbstractLayout.prototype.onAfterAttach = function (msg) {
		for (var i = 0; i < this.childCount(); ++i) {
			phosphor_messaging_1.sendMessage(this.childAt(i), msg);
		}
	};

	AbstractLayout.prototype.onBeforeDetach = function (msg) {
		for (var i = 0; i < this.childCount(); ++i) {
			phosphor_messaging_1.sendMessage(this.childAt(i), msg);
		}
	};

	AbstractLayout.prototype.onAfterShow = function (msg) {
		for (var i = 0; i < this.childCount(); ++i) {
			var child = this.childAt(i);
			if (!child.isHidden)
				phosphor_messaging_1.sendMessage(child, msg);
		}
	};

	AbstractLayout.prototype.onBeforeHide = function (msg) {
		for (var i = 0; i < this.childCount(); ++i) {
			var child = this.childAt(i);
			if (!child.isHidden)
				phosphor_messaging_1.sendMessage(child, msg);
		}
	};
	return AbstractLayout;
})(Layout);
exports.AbstractLayout = AbstractLayout;

},{"./widget":44,"phosphor-messaging":23,"phosphor-properties":26,"phosphor-signaling":27}],42:[function(require,module,exports){

'use strict';
var __extends = (this && this.__extends) || function (d, b) {
	for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	function __() { this.constructor = d; }
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var arrays = require('phosphor-arrays');
var phosphor_messaging_1 = require('phosphor-messaging');
var layout_1 = require('./layout');
var widget_1 = require('./widget');


var PANEL_CLASS = 'p-Panel';

var Panel = (function (_super) {
	__extends(Panel, _super);

	function Panel() {
		_super.call(this);
		this.addClass(PANEL_CLASS);
		this.layout = this.constructor.createLayout();
	}

	Panel.createLayout = function () {
		return new PanelLayout();
	};

	Panel.prototype.childCount = function () {
		return this.layout.childCount();
	};

	Panel.prototype.childAt = function (index) {
		return this.layout.childAt(index);
	};

	Panel.prototype.childIndex = function (child) {
		return this.layout.childIndex(child);
	};

	Panel.prototype.addChild = function (child) {
		this.layout.addChild(child);
	};

	Panel.prototype.insertChild = function (index, child) {
		this.layout.insertChild(index, child);
	};
	return Panel;
})(widget_1.Widget);
exports.Panel = Panel;

var PanelLayout = (function (_super) {
	__extends(PanelLayout, _super);
	function PanelLayout() {
		_super.apply(this, arguments);
		this._children = [];
	}

	PanelLayout.prototype.dispose = function () {
		while (this._children.length > 0) {
			this._children.pop().dispose();
		}
		_super.prototype.dispose.call(this);
	};

	PanelLayout.prototype.childCount = function () {
		return this._children.length;
	};

	PanelLayout.prototype.childAt = function (index) {
		return this._children[index];
	};

	PanelLayout.prototype.addChild = function (child) {
		this.insertChild(this.childCount(), child);
	};

	PanelLayout.prototype.insertChild = function (index, child) {
		child.parent = this.parent;
		var i = this.childIndex(child);
		var j = Math.max(0, Math.min(index | 0, this.childCount()));
		if (i !== -1) {
			if (i < j)
				j--;
			if (i === j)
				return;
			arrays.move(this._children, i, j);
			if (this.parent)
				this.moveChild(i, j, child);
		}
		else {
			arrays.insert(this._children, j, child);
			if (this.parent)
				this.attachChild(j, child);
		}
	};

	PanelLayout.prototype.initialize = function () {
		for (var i = 0; i < this.childCount(); ++i) {
			var child = this.childAt(i);
			child.parent = this.parent;
			this.attachChild(i, child);
		}
	};

	PanelLayout.prototype.attachChild = function (index, child) {
		var ref = this.childAt(index + 1);
		this.parent.node.insertBefore(child.node, ref && ref.node);
		if (this.parent.isAttached)
			phosphor_messaging_1.sendMessage(child, widget_1.Widget.MsgAfterAttach);
	};

	PanelLayout.prototype.moveChild = function (fromIndex, toIndex, child) {
		var ref = this.childAt(toIndex + 1);
		if (this.parent.isAttached)
			phosphor_messaging_1.sendMessage(child, widget_1.Widget.MsgBeforeDetach);
		this.parent.node.insertBefore(child.node, ref && ref.node);
		if (this.parent.isAttached)
			phosphor_messaging_1.sendMessage(child, widget_1.Widget.MsgAfterAttach);
	};

	PanelLayout.prototype.detachChild = function (index, child) {
		if (this.parent.isAttached)
			phosphor_messaging_1.sendMessage(child, widget_1.Widget.MsgBeforeDetach);
		this.parent.node.removeChild(child.node);
	};

	PanelLayout.prototype.onChildRemoved = function (msg) {
		var i = arrays.remove(this._children, msg.child);
		if (i !== -1)
			this.detachChild(i, msg.child);
	};
	return PanelLayout;
})(layout_1.AbstractLayout);
exports.PanelLayout = PanelLayout;

},{"./layout":41,"./widget":44,"phosphor-arrays":45,"phosphor-messaging":23}],43:[function(require,module,exports){

'use strict';
var phosphor_properties_1 = require('phosphor-properties');
var phosphor_signaling_1 = require('phosphor-signaling');

var Title = (function () {
	function Title() {
	}
	Object.defineProperty(Title.prototype, "changed", {

		get: function () {
			return TitlePrivate.changedSignal.bind(this);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(Title.prototype, "text", {

		get: function () {
			return TitlePrivate.textProperty.get(this);
		},

		set: function (value) {
			TitlePrivate.textProperty.set(this, value);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(Title.prototype, "icon", {

		get: function () {
			return TitlePrivate.iconProperty.get(this);
		},

		set: function (value) {
			TitlePrivate.iconProperty.set(this, value);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(Title.prototype, "closable", {

		get: function () {
			return TitlePrivate.closableProperty.get(this);
		},

		set: function (value) {
			TitlePrivate.closableProperty.set(this, value);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(Title.prototype, "className", {

		get: function () {
			return TitlePrivate.classNameProperty.get(this);
		},

		set: function (value) {
			TitlePrivate.classNameProperty.set(this, value);
		},
		enumerable: true,
		configurable: true
	});
	return Title;
})();
exports.Title = Title;

var TitlePrivate;
(function (TitlePrivate) {

	TitlePrivate.changedSignal = new phosphor_signaling_1.Signal();

	TitlePrivate.textProperty = new phosphor_properties_1.Property({
		name: 'text',
		value: '',
		notify: TitlePrivate.changedSignal,
	});

	TitlePrivate.iconProperty = new phosphor_properties_1.Property({
		name: 'icon',
		value: '',
		notify: TitlePrivate.changedSignal,
	});

	TitlePrivate.closableProperty = new phosphor_properties_1.Property({
		name: 'closable',
		value: false,
		notify: TitlePrivate.changedSignal,
	});

	TitlePrivate.classNameProperty = new phosphor_properties_1.Property({
		name: 'className',
		value: '',
		notify: TitlePrivate.changedSignal,
	});
})(TitlePrivate || (TitlePrivate = {}));

},{"phosphor-properties":26,"phosphor-signaling":27}],44:[function(require,module,exports){

'use strict';
var __extends = (this && this.__extends) || function (d, b) {
	for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	function __() { this.constructor = d; }
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var phosphor_messaging_1 = require('phosphor-messaging');
var phosphor_nodewrapper_1 = require('phosphor-nodewrapper');
var phosphor_properties_1 = require('phosphor-properties');
var phosphor_signaling_1 = require('phosphor-signaling');
var title_1 = require('./title');


var WIDGET_CLASS = 'p-Widget';

var HIDDEN_CLASS = 'p-mod-hidden';

var Widget = (function (_super) {
	__extends(Widget, _super);

	function Widget() {
		_super.call(this);
		this._flags = 0;
		this._layout = null;
		this._parent = null;
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
			this.detach();
		}

		if (this._layout) {
			this._layout.dispose();
			this._layout = null;
		}

		phosphor_signaling_1.clearSignalData(this);
		phosphor_messaging_1.clearMessageData(this);
		phosphor_properties_1.clearPropertyData(this);
	};
	Object.defineProperty(Widget.prototype, "disposed", {

		get: function () {
			return WidgetPrivate.disposedSignal.bind(this);
		},
		enumerable: true,
		configurable: true
	});
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
	Object.defineProperty(Widget.prototype, "title", {

		get: function () {
			return WidgetPrivate.titleProperty.get(this);
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
				phosphor_messaging_1.sendMessage(this._parent, new ChildMessage('child-removed', this));
			}
			this._parent = value;
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(Widget.prototype, "layout", {

		get: function () {
			return this._layout;
		},

		set: function (value) {
			if (!value) {
				throw new Error('Cannot set widget layout to null.');
			}
			if (this._layout === value) {
				return;
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

	Widget.prototype.contains = function (widget) {
		while (widget) {
			if (widget === this) {
				return true;
			}
			widget = widget._parent;
		}
		return false;
	};

	Widget.prototype.update = function () {
		phosphor_messaging_1.postMessage(this, Widget.MsgUpdateRequest);
	};

	Widget.prototype.fit = function () {
		phosphor_messaging_1.postMessage(this, Widget.MsgFitRequest);
	};

	Widget.prototype.close = function () {
		phosphor_messaging_1.sendMessage(this, Widget.MsgCloseRequest);
	};

	Widget.prototype.show = function () {
		if (!this.testFlag(WidgetFlag.IsHidden)) {
			return;
		}
		this.clearFlag(WidgetFlag.IsHidden);
		this.removeClass(HIDDEN_CLASS);
		if (this.isAttached && (!this.parent || this.parent.isVisible)) {
			phosphor_messaging_1.sendMessage(this, Widget.MsgAfterShow);
		}
		if (this.parent) {
			phosphor_messaging_1.sendMessage(this.parent, new ChildMessage('child-shown', this));
		}
	};

	Widget.prototype.hide = function () {
		if (this.testFlag(WidgetFlag.IsHidden)) {
			return;
		}
		this.setFlag(WidgetFlag.IsHidden);
		if (this.isAttached && (!this.parent || this.parent.isVisible)) {
			phosphor_messaging_1.sendMessage(this, Widget.MsgBeforeHide);
		}
		this.addClass(HIDDEN_CLASS);
		if (this.parent) {
			phosphor_messaging_1.sendMessage(this.parent, new ChildMessage('child-hidden', this));
		}
	};

	Widget.prototype.attach = function (host) {
		if (this.parent) {
			throw new Error('Cannot attach child widget.');
		}
		if (this.isAttached || document.body.contains(this.node)) {
			throw new Error('Widget already attached.');
		}
		if (!document.body.contains(host)) {
			throw new Error('Host not attached.');
		}
		host.appendChild(this.node);
		phosphor_messaging_1.sendMessage(this, Widget.MsgAfterAttach);
	};

	Widget.prototype.detach = function () {
		if (this.parent) {
			throw new Error('Cannot detach child widget.');
		}
		if (!this.isAttached || !document.body.contains(this.node)) {
			throw new Error('Widget not attached.');
		}
		phosphor_messaging_1.sendMessage(this, Widget.MsgBeforeDetach);
		this.node.parentNode.removeChild(this.node);
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

	Widget.prototype.compressMessage = function (msg, pending) {
		if (msg.type === 'update-request') {
			return pending.some(function (other) { return other.type === 'update-request'; });
		}
		if (msg.type === 'fit-request') {
			return pending.some(function (other) { return other.type === 'fit-request'; });
		}
		return false;
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
			case 'close-request':
				this.notifyLayout(msg);
				this.onCloseRequest(msg);
				break;
			default:
				this.notifyLayout(msg);
				break;
		}
	};

	Widget.prototype.notifyLayout = function (msg) {
		if (this.layout)
			this.layout.processParentMessage(msg);
	};

	Widget.prototype.onCloseRequest = function (msg) {
		if (this.parent) {
			this.parent = null;
		}
		else if (this.isAttached) {
			this.detach();
		}
	};

	Widget.prototype.onResize = function (msg) { };

	Widget.prototype.onUpdateRequest = function (msg) { };

	Widget.prototype.onAfterShow = function (msg) { };

	Widget.prototype.onBeforeHide = function (msg) { };

	Widget.prototype.onAfterAttach = function (msg) { };

	Widget.prototype.onBeforeDetach = function (msg) { };
	return Widget;
})(phosphor_nodewrapper_1.NodeWrapper);
exports.Widget = Widget;

var Widget;
(function (Widget) {

	Widget.MsgUpdateRequest = new phosphor_messaging_1.Message('update-request');

	Widget.MsgFitRequest = new phosphor_messaging_1.Message('fit-request');

	Widget.MsgCloseRequest = new phosphor_messaging_1.Message('close-request');

	Widget.MsgAfterShow = new phosphor_messaging_1.Message('after-show');

	Widget.MsgBeforeHide = new phosphor_messaging_1.Message('before-hide');

	Widget.MsgAfterAttach = new phosphor_messaging_1.Message('after-attach');

	Widget.MsgBeforeDetach = new phosphor_messaging_1.Message('before-detach');
})(Widget = exports.Widget || (exports.Widget = {}));

(function (WidgetFlag) {

	WidgetFlag[WidgetFlag["IsDisposed"] = 1] = "IsDisposed";

	WidgetFlag[WidgetFlag["IsAttached"] = 2] = "IsAttached";

	WidgetFlag[WidgetFlag["IsHidden"] = 4] = "IsHidden";

	WidgetFlag[WidgetFlag["IsVisible"] = 8] = "IsVisible";
})(exports.WidgetFlag || (exports.WidgetFlag = {}));
var WidgetFlag = exports.WidgetFlag;

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
})(phosphor_messaging_1.Message);
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
})(phosphor_messaging_1.Message);
exports.ResizeMessage = ResizeMessage;

var ResizeMessage;
(function (ResizeMessage) {

	ResizeMessage.UnknownSize = new ResizeMessage(-1, -1);
})(ResizeMessage = exports.ResizeMessage || (exports.ResizeMessage = {}));

var WidgetPrivate;
(function (WidgetPrivate) {

	WidgetPrivate.disposedSignal = new phosphor_signaling_1.Signal();

	WidgetPrivate.titleProperty = new phosphor_properties_1.Property({
		name: 'title',
		create: function () { return new title_1.Title(); },
	});
})(WidgetPrivate || (WidgetPrivate = {}));

},{"./title":43,"phosphor-messaging":23,"phosphor-nodewrapper":25,"phosphor-properties":26,"phosphor-signaling":27}],45:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}]},{},[1]);