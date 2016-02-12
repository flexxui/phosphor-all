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
window.phosphor.panel = require("phosphor-panel");
window.phosphor.menus = require("phosphor-menus");
window.phosphor.boxpanel = require("phosphor-boxpanel");
window.phosphor.gridpanel = require("phosphor-gridpanel");
window.phosphor.splitpanel = require("phosphor-splitpanel");
window.phosphor.stackedpanel = require("phosphor-stackedpanel");
window.phosphor.tabs = require("phosphor-tabs");
window.phosphor.dockpanel = require("phosphor-dockpanel");

window.phosphor.createWidget = function (name) {
	var ori = phosphor.widget.Widget.createNode;
	phosphor.widget.Widget.createNode = function() {
		return document.createElement(name);
	};
	var w = new phosphor.widget.Widget();
	phosphor.widget.Widget.createNode = ori;
	return w;
};

},{"phosphor-boxengine":3,"phosphor-boxpanel":4,"phosphor-disposable":11,"phosphor-dockpanel":13,"phosphor-domutil":17,"phosphor-gridpanel":19,"phosphor-menus":22,"phosphor-messaging":27,"phosphor-nodewrapper":29,"phosphor-panel":30,"phosphor-properties":34,"phosphor-signaling":35,"phosphor-splitpanel":37,"phosphor-stackedpanel":41,"phosphor-tabs":45,"phosphor-widget":50}],2:[function(require,module,exports){
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

'use strict';
function __export(m) {
	for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(require('./layout'));
__export(require('./panel'));

},{"./layout":5,"./panel":6}],5:[function(require,module,exports){

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
var phosphor_panel_1 = require('phosphor-panel');
var phosphor_widget_1 = require('phosphor-widget');

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

var BoxLayout = (function (_super) {
	__extends(BoxLayout, _super);
	function BoxLayout() {
		_super.apply(this, arguments);
		this._fixed = 0;
		this._spacing = 8;
		this._box = null;
		this._sizers = [];
		this._direction = Direction.TopToBottom;
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
			BoxLayoutPrivate.toggleDirection(this.parent, value);
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
			value = Math.max(0, value | 0);
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

	BoxLayout.prototype.initialize = function () {
		BoxLayoutPrivate.toggleDirection(this.parent, this.direction);
		_super.prototype.initialize.call(this);
	};

	BoxLayout.prototype.attachChild = function (index, child) {
		arrays.insert(this._sizers, index, new phosphor_boxengine_1.BoxSizer());
		BoxLayoutPrivate.prepareGeometry(child);
		this.parent.node.appendChild(child.node);
		if (this.parent.isAttached)
			phosphor_messaging_1.sendMessage(child, phosphor_widget_1.Widget.MsgAfterAttach);
		this.parent.fit();
	};

	BoxLayout.prototype.moveChild = function (fromIndex, toIndex, child) {
		arrays.move(this._sizers, fromIndex, toIndex);
		this.parent.update();
	};

	BoxLayout.prototype.detachChild = function (index, child) {
		arrays.removeAt(this._sizers, index);
		if (this.parent.isAttached)
			phosphor_messaging_1.sendMessage(child, phosphor_widget_1.Widget.MsgBeforeDetach);
		this.parent.node.removeChild(child.node);
		BoxLayoutPrivate.resetGeometry(child);
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
		if (BoxLayoutPrivate.IsIE) {
			phosphor_messaging_1.sendMessage(this.parent, phosphor_widget_1.Widget.MsgFitRequest);
		}
		else {
			this.parent.fit();
		}
	};

	BoxLayout.prototype.onChildHidden = function (msg) {
		if (BoxLayoutPrivate.IsIE) {
			phosphor_messaging_1.sendMessage(this.parent, phosphor_widget_1.Widget.MsgFitRequest);
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
		for (var i = 0, n = this.childCount(); i < n; ++i) {
			if (!this.childAt(i).isHidden)
				nVisible++;
		}

		this._fixed = this._spacing * Math.max(0, nVisible - 1);

		var minW = 0;
		var minH = 0;
		var maxW = Infinity;
		var maxH = Infinity;
		var horz = BoxLayoutPrivate.isHorizontal(this._direction);
		if (horz) {
			minW = this._fixed;
			maxW = nVisible > 0 ? minW : maxW;
		}
		else {
			minH = this._fixed;
			maxH = nVisible > 0 ? minH : maxH;
		}

		for (var i = 0, n = this.childCount(); i < n; ++i) {
			var child = this.childAt(i);
			var sizer = this._sizers[i];
			if (child.isHidden) {
				sizer.minSize = 0;
				sizer.maxSize = 0;
				continue;
			}
			var limits = phosphor_domutil_1.sizeLimits(child.node);
			sizer.sizeHint = BoxLayout.getSizeBasis(child);
			sizer.stretch = BoxLayout.getStretch(child);
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

		var box = this._box = phosphor_domutil_1.boxSizing(this.parent.node);
		minW += box.horizontalSum;
		minH += box.verticalSum;
		maxW += box.horizontalSum;
		maxH += box.verticalSum;

		var style = this.parent.node.style;
		style.minWidth = minW + "px";
		style.minHeight = minH + "px";
		style.maxWidth = maxW === Infinity ? 'none' : maxW + "px";
		style.maxHeight = maxH === Infinity ? 'none' : maxH + "px";

		var ancestor = this.parent.parent;
		if (ancestor)
			phosphor_messaging_1.sendMessage(ancestor, phosphor_widget_1.Widget.MsgFitRequest);

		phosphor_messaging_1.sendMessage(this.parent, phosphor_widget_1.Widget.MsgUpdateRequest);
	};

	BoxLayout.prototype._update = function (offsetWidth, offsetHeight) {

		if (this.childCount() === 0) {
			return;
		}

		if (offsetWidth < 0) {
			offsetWidth = this.parent.node.offsetWidth;
		}
		if (offsetHeight < 0) {
			offsetHeight = this.parent.node.offsetHeight;
		}

		var box = this._box || (this._box = phosphor_domutil_1.boxSizing(this.parent.node));

		var top = box.paddingTop;
		var left = box.paddingLeft;
		var width = offsetWidth - box.horizontalSum;
		var height = offsetHeight - box.verticalSum;

		switch (this._direction) {
			case Direction.LeftToRight:
				phosphor_boxengine_1.boxCalc(this._sizers, Math.max(0, width - this._fixed));
				break;
			case Direction.TopToBottom:
				phosphor_boxengine_1.boxCalc(this._sizers, Math.max(0, height - this._fixed));
				break;
			case Direction.RightToLeft:
				phosphor_boxengine_1.boxCalc(this._sizers, Math.max(0, width - this._fixed));
				left += width;
				break;
			case Direction.BottomToTop:
				phosphor_boxengine_1.boxCalc(this._sizers, Math.max(0, height - this._fixed));
				top += height;
				break;
		}

		for (var i = 0, n = this.childCount(); i < n; ++i) {
			var child = this.childAt(i);
			if (child.isHidden) {
				continue;
			}
			var size = this._sizers[i].size;
			switch (this._direction) {
				case Direction.LeftToRight:
					BoxLayoutPrivate.setGeometry(child, left, top, size, height);
					left += size + this._spacing;
					break;
				case Direction.TopToBottom:
					BoxLayoutPrivate.setGeometry(child, left, top, width, size);
					top += size + this._spacing;
					break;
				case Direction.RightToLeft:
					BoxLayoutPrivate.setGeometry(child, left - size, top, size, height);
					left -= size + this._spacing;
					break;
				case Direction.BottomToTop:
					BoxLayoutPrivate.setGeometry(child, left, top - size, width, size);
					top -= size + this._spacing;
					break;
			}
		}
	};
	return BoxLayout;
})(phosphor_panel_1.PanelLayout);
exports.BoxLayout = BoxLayout;

var BoxLayout;
(function (BoxLayout) {

	BoxLayout.LeftToRight = Direction.LeftToRight;

	BoxLayout.RightToLeft = Direction.RightToLeft;

	BoxLayout.TopToBottom = Direction.TopToBottom;

	BoxLayout.BottomToTop = Direction.BottomToTop;

	function getStretch(widget) {
		return BoxLayoutPrivate.stretchProperty.get(widget);
	}
	BoxLayout.getStretch = getStretch;

	function setStretch(widget, value) {
		BoxLayoutPrivate.stretchProperty.set(widget, value);
	}
	BoxLayout.setStretch = setStretch;

	function getSizeBasis(widget) {
		return BoxLayoutPrivate.sizeBasisProperty.get(widget);
	}
	BoxLayout.getSizeBasis = getSizeBasis;

	function setSizeBasis(widget, value) {
		BoxLayoutPrivate.sizeBasisProperty.set(widget, value);
	}
	BoxLayout.setSizeBasis = setSizeBasis;
})(BoxLayout = exports.BoxLayout || (exports.BoxLayout = {}));

var BoxLayoutPrivate;
(function (BoxLayoutPrivate) {

	BoxLayoutPrivate.IsIE = /Trident/.test(navigator.userAgent);

	BoxLayoutPrivate.stretchProperty = new phosphor_properties_1.Property({
		name: 'stretch',
		value: 0,
		coerce: function (owner, value) { return Math.max(0, value | 0); },
		changed: onChildPropertyChanged,
	});

	BoxLayoutPrivate.sizeBasisProperty = new phosphor_properties_1.Property({
		name: 'sizeBasis',
		value: 0,
		coerce: function (owner, value) { return Math.max(0, value | 0); },
		changed: onChildPropertyChanged,
	});

	function isHorizontal(dir) {
		return dir === Direction.LeftToRight || dir === Direction.RightToLeft;
	}
	BoxLayoutPrivate.isHorizontal = isHorizontal;

	function toggleDirection(widget, dir) {
		widget.toggleClass(LEFT_TO_RIGHT_CLASS, dir === Direction.LeftToRight);
		widget.toggleClass(RIGHT_TO_LEFT_CLASS, dir === Direction.RightToLeft);
		widget.toggleClass(TOP_TO_BOTTOM_CLASS, dir === Direction.TopToBottom);
		widget.toggleClass(BOTTOM_TO_TOP_CLASS, dir === Direction.BottomToTop);
	}
	BoxLayoutPrivate.toggleDirection = toggleDirection;

	function prepareGeometry(widget) {
		widget.node.style.position = 'absolute';
	}
	BoxLayoutPrivate.prepareGeometry = prepareGeometry;

	function resetGeometry(widget) {
		var rect = rectProperty.get(widget);
		var style = widget.node.style;
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
	BoxLayoutPrivate.resetGeometry = resetGeometry;

	function setGeometry(widget, left, top, width, height) {
		var resized = false;
		var style = widget.node.style;
		var rect = rectProperty.get(widget);
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
			phosphor_messaging_1.sendMessage(widget, new phosphor_widget_1.ResizeMessage(width, height));
		}
	}
	BoxLayoutPrivate.setGeometry = setGeometry;

	var rectProperty = new phosphor_properties_1.Property({
		name: 'rect',
		create: function () { return ({ top: NaN, left: NaN, width: NaN, height: NaN }); },
	});

	function onChildPropertyChanged(child) {
		var parent = child.parent;
		var layout = parent && parent.layout;
		if (layout instanceof BoxLayout)
			parent.fit();
	}
})(BoxLayoutPrivate || (BoxLayoutPrivate = {}));

},{"phosphor-arrays":7,"phosphor-boxengine":3,"phosphor-domutil":17,"phosphor-messaging":27,"phosphor-panel":8,"phosphor-properties":34,"phosphor-widget":50}],6:[function(require,module,exports){

'use strict';
var __extends = (this && this.__extends) || function (d, b) {
	for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	function __() { this.constructor = d; }
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var phosphor_panel_1 = require('phosphor-panel');
var layout_1 = require('./layout');

var BOX_PANEL_CLASS = 'p-BoxPanel';

var CHILD_CLASS = 'p-BoxPanel-child';

var BoxPanel = (function (_super) {
	__extends(BoxPanel, _super);

	function BoxPanel() {
		_super.call(this);
		this.addClass(BOX_PANEL_CLASS);
	}

	BoxPanel.createLayout = function () {
		return new layout_1.BoxLayout();
	};
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
})(phosphor_panel_1.Panel);
exports.BoxPanel = BoxPanel;

var BoxPanel;
(function (BoxPanel) {

	BoxPanel.LeftToRight = layout_1.Direction.LeftToRight;

	BoxPanel.RightToLeft = layout_1.Direction.RightToLeft;

	BoxPanel.TopToBottom = layout_1.Direction.TopToBottom;

	BoxPanel.BottomToTop = layout_1.Direction.BottomToTop;

	function getStretch(widget) {
		return layout_1.BoxLayout.getStretch(widget);
	}
	BoxPanel.getStretch = getStretch;

	function setStretch(widget, value) {
		layout_1.BoxLayout.setStretch(widget, value);
	}
	BoxPanel.setStretch = setStretch;

	function getSizeBasis(widget) {
		return layout_1.BoxLayout.getSizeBasis(widget);
	}
	BoxPanel.getSizeBasis = getSizeBasis;

	function setSizeBasis(widget, value) {
		layout_1.BoxLayout.setSizeBasis(widget, value);
	}
	BoxPanel.setSizeBasis = setSizeBasis;
})(BoxPanel = exports.BoxPanel || (exports.BoxPanel = {}));

},{"./layout":5,"phosphor-panel":8}],7:[function(require,module,exports){

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

},{}],8:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"./layout":9,"./panel":10,"dup":4}],9:[function(require,module,exports){

'use strict';
var __extends = (this && this.__extends) || function (d, b) {
	for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	function __() { this.constructor = d; }
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var arrays = require('phosphor-arrays');
var phosphor_messaging_1 = require('phosphor-messaging');
var phosphor_widget_1 = require('phosphor-widget');

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
		var n = this._children.length;
		var i = this._children.indexOf(child);
		var j = Math.max(0, Math.min(index | 0, n));
		if (i !== -1) {
			if (j === n)
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
			phosphor_messaging_1.sendMessage(child, phosphor_widget_1.Widget.MsgAfterAttach);
	};

	PanelLayout.prototype.moveChild = function (fromIndex, toIndex, child) {
		var ref = this.childAt(toIndex + 1);
		if (this.parent.isAttached)
			phosphor_messaging_1.sendMessage(child, phosphor_widget_1.Widget.MsgBeforeDetach);
		this.parent.node.insertBefore(child.node, ref && ref.node);
		if (this.parent.isAttached)
			phosphor_messaging_1.sendMessage(child, phosphor_widget_1.Widget.MsgAfterAttach);
	};

	PanelLayout.prototype.detachChild = function (index, child) {
		if (this.parent.isAttached)
			phosphor_messaging_1.sendMessage(child, phosphor_widget_1.Widget.MsgBeforeDetach);
		this.parent.node.removeChild(child.node);
	};

	PanelLayout.prototype.onChildRemoved = function (msg) {
		var i = arrays.remove(this._children, msg.child);
		if (i !== -1)
			this.detachChild(i, msg.child);
	};
	return PanelLayout;
})(phosphor_widget_1.AbstractLayout);
exports.PanelLayout = PanelLayout;

},{"phosphor-arrays":7,"phosphor-messaging":27,"phosphor-widget":50}],10:[function(require,module,exports){

'use strict';
var __extends = (this && this.__extends) || function (d, b) {
	for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	function __() { this.constructor = d; }
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var phosphor_widget_1 = require('phosphor-widget');
var layout_1 = require('./layout');

var PANEL_CLASS = 'p-Panel';

var Panel = (function (_super) {
	__extends(Panel, _super);

	function Panel() {
		_super.call(this);
		this.addClass(PANEL_CLASS);
		this.layout = this.constructor.createLayout();
	}

	Panel.createLayout = function () {
		return new layout_1.PanelLayout();
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
})(phosphor_widget_1.Widget);
exports.Panel = Panel;

},{"./layout":9,"phosphor-widget":50}],11:[function(require,module,exports){

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

},{}],12:[function(require,module,exports){
var css = ".p-DockPanel{position:relative;z-index:0}.p-DockPanel>.p-Widget{position:absolute;z-index:0}.p-DockPanel-overlay{box-sizing:border-box;position:absolute;top:0;left:0;width:0;height:0;z-index:1;pointer-events:none}.p-DockPanel-overlay.p-mod-hidden,.p-TabBar-tab.p-mod-hidden{display:none}"; (require("browserify-css").createStyle(css, { "href": "node_modules\\phosphor-dockpanel\\lib\\index.css"})); module.exports = css;
},{"browserify-css":2}],13:[function(require,module,exports){

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

var TAB_PANEL_CLASS = 'p-DockTabPanel';

var SPLIT_PANEL_CLASS = 'p-DockSplitPanel';

var OVERLAY_CLASS = 'p-DockPanel-overlay';

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
		this.layout = new phosphor_stackedpanel_1.StackedLayout();
	}
	Object.defineProperty(DockPanel.prototype, "spacing", {

		get: function () {
			return DockPanelPrivate.spacingProperty.get(this);
		},

		set: function (value) {
			DockPanelPrivate.spacingProperty.set(this, value);
		},
		enumerable: true,
		configurable: true
	});

	DockPanel.prototype.insertTop = function (widget, ref) {
		DockPanelPrivate.insertSplit(this, widget, ref, phosphor_splitpanel_1.Orientation.Vertical, false);
	};

	DockPanel.prototype.insertLeft = function (widget, ref) {
		DockPanelPrivate.insertSplit(this, widget, ref, phosphor_splitpanel_1.Orientation.Horizontal, false);
	};

	DockPanel.prototype.insertRight = function (widget, ref) {
		DockPanelPrivate.insertSplit(this, widget, ref, phosphor_splitpanel_1.Orientation.Horizontal, true);
	};

	DockPanel.prototype.insertBottom = function (widget, ref) {
		DockPanelPrivate.insertSplit(this, widget, ref, phosphor_splitpanel_1.Orientation.Vertical, true);
	};

	DockPanel.prototype.insertTabBefore = function (widget, ref) {
		DockPanelPrivate.insertTab(this, widget, ref, false);
	};

	DockPanel.prototype.insertTabAfter = function (widget, ref) {
		DockPanelPrivate.insertTab(this, widget, ref, true);
	};

	DockPanel.prototype.selectWidget = function (widget) {
		DockPanelPrivate.selectWidget(this, widget);
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
		var node = this.node;
		node.addEventListener('p-dragenter', this);
		node.addEventListener('p-dragleave', this);
		node.addEventListener('p-dragover', this);
		node.addEventListener('p-drop', this);
	};

	DockPanel.prototype.onBeforeDetach = function (msg) {
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
			DockPanelPrivate.hideOverlay(this);
		}
	};

	DockPanel.prototype._evtDragOver = function (event) {
		event.preventDefault();
		event.stopPropagation();
		var x = event.clientX;
		var y = event.clientY;
		var zone = DockPanelPrivate.showOverlay(this, x, y);
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
		DockPanelPrivate.hideOverlay(this);
		if (event.proposedAction === phosphor_dragdrop_1.DropAction.None) {
			event.dropAction = phosphor_dragdrop_1.DropAction.None;
			return;
		}
		var x = event.clientX;
		var y = event.clientY;
		var target = DockPanelPrivate.findDockTarget(this, x, y);
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
		DockPanelPrivate.handleDrop(this, widget, target);
		event.dropAction = event.proposedAction;
	};
	return DockPanel;
})(phosphor_widget_1.Widget);
exports.DockPanel = DockPanel;

var DockTabPanel = (function (_super) {
	__extends(DockTabPanel, _super);

	function DockTabPanel() {
		_super.call(this);
		this.addClass(TAB_PANEL_CLASS);
		this.tabBar.tabsMovable = true;
	}
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

var DockPanelPrivate;
(function (DockPanelPrivate) {

	DockPanelPrivate.spacingProperty = new phosphor_properties_1.Property({
		name: 'spacing',
		value: 3,
		coerce: function (owner, value) { return Math.max(0, value | 0); },
		changed: onSpacingChanged,
	});

	function insertSplit(owner, widget, ref, orientation, after) {

		validateInsertArgs(owner, widget, ref);

		if (widget === ref) {
			return;
		}



		widget.parent = null;

		var tabPanel = createTabPanel();
		tabPanel.addChild(widget);

		if (!getRoot(owner)) {
			setRoot(owner, tabPanel);
			return;
		}

		if (!ref) {
			var root = ensureSplitRoot(owner, orientation);
			var sizes_1 = root.sizes();
			var count = sizes_1.length;
			arrays.insert(sizes_1, after ? count : 0, 0.5);
			root.insertChild(after ? count : 0, tabPanel);
			root.setSizes(sizes_1);
			return;
		}

		var refTabPanel = findTabPanel(ref);

		if (refTabPanel.parent === owner) {
			var root = ensureSplitRoot(owner, orientation);
			root.insertChild(after ? 1 : 0, tabPanel);
			root.setSizes([1, 1]);
			return;
		}

		if (!(refTabPanel.parent instanceof DockSplitPanel)) {
			internalError();
		}

		var splitPanel = refTabPanel.parent;


		if (splitPanel.orientation === orientation) {
			var i_1 = splitPanel.childIndex(refTabPanel);
			var sizes_2 = splitPanel.sizes();
			var size = sizes_2[i_1] = sizes_2[i_1] / 2;
			arrays.insert(sizes_2, after ? i_1 + 1 : i_1, size);
			splitPanel.insertChild(after ? i_1 + 1 : i_1, tabPanel);
			splitPanel.setSizes(sizes_2);
			return;
		}


		if (splitPanel.childCount() === 1) {
			splitPanel.orientation = orientation;
			splitPanel.insertChild(after ? 1 : 0, tabPanel);
			splitPanel.setSizes([1, 1]);
			return;
		}

		if (splitPanel.childCount() === 0) {
			internalError();
		}



		var sizes = splitPanel.sizes();
		var i = splitPanel.childIndex(refTabPanel);
		var childSplit = new DockSplitPanel(orientation, owner.spacing);
		childSplit.addChild(refTabPanel);
		childSplit.insertChild(after ? 1 : 0, tabPanel);
		splitPanel.insertChild(i, childSplit);
		splitPanel.setSizes(sizes);
		childSplit.setSizes([1, 1]);
	}
	DockPanelPrivate.insertSplit = insertSplit;

	function insertTab(owner, widget, ref, after) {

		validateInsertArgs(owner, widget, ref);

		if (widget === ref) {
			return;
		}



		widget.parent = null;

		var index;
		var tabPanel;
		if (ref) {
			tabPanel = findTabPanel(ref);
			index = tabPanel.childIndex(ref) + (after ? 1 : 0);
		}
		else {
			tabPanel = ensureFirstTabPanel(owner);
			index = after ? tabPanel.childCount() : 0;
		}

		tabPanel.insertChild(index, widget);
	}
	DockPanelPrivate.insertTab = insertTab;

	function selectWidget(owner, widget) {
		if (!dockPanelContains(owner, widget))
			return;
		widget.parent.parent.currentWidget = widget;
	}
	DockPanelPrivate.selectWidget = selectWidget;

	function hideOverlay(owner) {
		getOverlay(owner).hide();
	}
	DockPanelPrivate.hideOverlay = hideOverlay;

	function showOverlay(owner, clientX, clientY) {

		var target = findDockTarget(owner, clientX, clientY);

		if (target.zone === 10 ) {
			hideOverlay(owner);
			return target.zone;
		}

		var top;
		var left;
		var width;
		var height;
		var pcr;
		var box = phosphor_domutil_1.boxSizing(owner.node);
		var rect = owner.node.getBoundingClientRect();

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

		getOverlay(owner).show(target.zone, left, top, width, height);
		return target.zone;
	}
	DockPanelPrivate.showOverlay = showOverlay;

	function findDockTarget(owner, clientX, clientY) {
		var root = getRoot(owner);
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
	DockPanelPrivate.findDockTarget = findDockTarget;

	function handleDrop(owner, widget, target) {

		if (target.zone === 10 ) {
			return;
		}

		switch (target.zone) {
			case 0 :
				owner.insertTop(widget);
				return;
			case 1 :
				owner.insertLeft(widget);
				return;
			case 2 :
				owner.insertRight(widget);
				return;
			case 3 :
				owner.insertBottom(widget);
				return;
			case 4 :
				owner.insertLeft(widget);
				return;
		}


		if (target.zone === 9 ) {
			if (target.panel.childIndex(widget) !== -1) {
				return;
			}
		}

		if (target.panel.childCount() === 1) {
			if (target.panel.childAt(0) === widget) {
				return;
			}
		}

		var n = target.panel.childCount();
		var ref = target.panel.childAt(n - 1);
		if (ref === widget) {
			ref = target.panel.childAt(n - 2);
		}

		switch (target.zone) {
			case 5 :
				owner.insertTop(widget, ref);
				return;
			case 6 :
				owner.insertLeft(widget, ref);
				return;
			case 7 :
				owner.insertRight(widget, ref);
				return;
			case 8 :
				owner.insertBottom(widget, ref);
				return;
			case 9 :
				owner.insertTabAfter(widget, ref);
				selectWidget(owner, widget);
				return;
		}
	}
	DockPanelPrivate.handleDrop = handleDrop;

	var rootProperty = new phosphor_properties_1.Property({
		name: 'root',
		value: null,
		changed: onRootChanged,
	});

	var overlayProperty = new phosphor_properties_1.Property({
		name: 'overlay',
		create: createOverlay,
	});

	function getRoot(owner) {
		return rootProperty.get(owner);
	}

	function setRoot(owner, root) {
		rootProperty.set(owner, root);
	}

	function getOverlay(owner) {
		return overlayProperty.get(owner);
	}

	function onRootChanged(owner, old, root) {
		if (!root)
			return;
		var layout = owner.layout;
		layout.addChild(root);
		root.show();
	}

	function createOverlay(owner) {
		var overlay = new DockPanelOverlay();
		owner.node.appendChild(overlay.node);
		return overlay;
	}

	function onSpacingChanged(owner, old, spacing) {
		var root = getRoot(owner);
		if (root instanceof DockSplitPanel) {
			updateSpacing(root, spacing);
		}
	}

	function updateSpacing(panel, spacing) {
		for (var i = 0, n = panel.childCount(); i < n; ++i) {
			var child = panel.childAt(i);
			if (child instanceof DockSplitPanel) {
				updateSpacing(child, spacing);
			}
		}
		panel.spacing = spacing;
	}

	function internalError() {
		throw new Error('Internal DockPanel Error.');
	}

	function dockPanelContains(owner, widget) {
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
			if (parent === owner) {
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

	function findFirstTabPanel(owner) {
		var root = getRoot(owner);
		while (root) {
			if (root instanceof DockTabPanel) {
				return root;
			}
			if (!(root instanceof DockSplitPanel) || root.childCount() === 0) {
				internalError();
			}
			root = root.childAt(0);
		}
		return null;
	}

	function ensureFirstTabPanel(owner) {
		var tabs = findFirstTabPanel(owner);
		if (!tabs) {
			tabs = createTabPanel();
			setRoot(owner, tabs);
		}
		return tabs;
	}

	function ensureSplitRoot(owner, orientation) {
		var oldRoot = getRoot(owner);
		if (!oldRoot) {
			internalError();
		}
		if (oldRoot instanceof DockSplitPanel) {
			if (oldRoot.orientation === orientation) {
				return oldRoot;
			}
			if (oldRoot.childCount() <= 1) {
				oldRoot.orientation = orientation;
				return oldRoot;
			}
		}
		var newRoot = new DockSplitPanel(orientation, owner.spacing);
		newRoot.addChild(oldRoot);
		setRoot(owner, newRoot);
		return newRoot;
	}

	function validateInsertArgs(owner, widget, ref) {
		if (!widget) {
			throw new Error('Target widget is null.');
		}
		if (ref && !dockPanelContains(owner, ref)) {
			throw new Error('Reference widget not contained by the dock panel.');
		}
	}

	function iterTabPanels(root, callback) {
		if (root instanceof DockTabPanel) {
			return callback(root);
		}
		if (!(root instanceof DockSplitPanel)) {
			internalError();
		}
		for (var i = 0; i < root.childCount(); ++i) {
			var child = root.childAt(i);
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

	var currentDrag = null;

	function createTabPanel() {
		var panel = new DockTabPanel();
		panel.tabBar.tabDetachRequested.connect(onTabDetachRequested);
		panel.stackedPanel.widgetRemoved.connect(onWidgetRemoved);
		return panel;
	}

	function removeTabPanel(tabPanel) {

		if (tabPanel.childCount() !== 0) {
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

		if (splitPanel.childCount() < 2) {
			internalError();
		}

		tabPanel.dispose();


		if (splitPanel.childCount() > 1) {
			return;
		}

		var child = splitPanel.childAt(0);

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
			var index_1 = grandPanel.childIndex(splitPanel);
			splitPanel.parent = null;
			grandPanel.insertChild(index_1, child);
			grandPanel.setSizes(sizes);
			splitPanel.dispose();
			return;
		}

		var childSplit = child;


		if (childSplit.orientation !== grandPanel.orientation) {
			internalError();
		}


		var index = grandPanel.childIndex(splitPanel);
		var childSizes = childSplit.sizes();
		var grandSizes = grandPanel.sizes();

		splitPanel.parent = null;
		var sizeShare = arrays.removeAt(grandSizes, index);

		for (var i = 0; childSplit.childCount() !== 0; ++i) {
			grandPanel.insertChild(index + i, childSplit.childAt(0));
			arrays.insert(grandSizes, index + i, sizeShare * childSizes[i]);
		}

		grandPanel.setSizes(grandSizes);
		splitPanel.dispose();
	}

	function onTabDetachRequested(sender, args) {

		if (currentDrag) {
			return;
		}

		sender.releaseMouse();

		var mimeData = new phosphor_dragdrop_1.MimeData();
		var widget = args.item;
		mimeData.setData(FACTORY_MIME, function () { return widget; });

		var tab = sender.tabAt(args.index);
		var dragImage = tab.cloneNode(true);

		currentDrag = new phosphor_dragdrop_1.Drag({
			mimeData: mimeData,
			dragImage: dragImage,
			proposedAction: phosphor_dragdrop_1.DropAction.Move,
			supportedActions: phosphor_dragdrop_1.DropActions.Move,
		});

		tab.classList.add(HIDDEN_CLASS);
		currentDrag.start(args.clientX, args.clientY).then(function () {
			currentDrag = null;
			tab.classList.remove(HIDDEN_CLASS);
		});
	}

	function onWidgetRemoved(sender, widget) {
		if (sender.childCount() === 0) {
			removeTabPanel(sender.parent);
		}
	}
})(DockPanelPrivate || (DockPanelPrivate = {}));

},{"./index.css":12,"phosphor-arrays":14,"phosphor-domutil":17,"phosphor-dragdrop":15,"phosphor-nodewrapper":29,"phosphor-properties":34,"phosphor-splitpanel":37,"phosphor-stackedpanel":41,"phosphor-tabs":45,"phosphor-widget":50}],14:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7}],15:[function(require,module,exports){

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

},{"phosphor-domutil":17}],16:[function(require,module,exports){
var css = "body.p-mod-override-cursor *{cursor:inherit!important}"; (require("browserify-css").createStyle(css, { "href": "node_modules\\phosphor-domutil\\lib\\index.css"})); module.exports = css;
},{"browserify-css":2}],17:[function(require,module,exports){

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

},{"./index.css":16,"phosphor-disposable":11}],18:[function(require,module,exports){
var css = ".p-GridPanel{position:relative}.p-GridPanel>.p-Widget{position:absolute}"; (require("browserify-css").createStyle(css, { "href": "node_modules\\phosphor-gridpanel\\lib\\index.css"})); module.exports = css;
},{"browserify-css":2}],19:[function(require,module,exports){

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

},{"./index.css":18,"phosphor-boxengine":3,"phosphor-domutil":17,"phosphor-messaging":27,"phosphor-properties":34,"phosphor-signaling":35,"phosphor-widget":50}],20:[function(require,module,exports){

'use strict';
var __extends = (this && this.__extends) || function (d, b) {
	for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	function __() { this.constructor = d; }
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var arrays = require('phosphor-arrays');
var phosphor_widget_1 = require('phosphor-widget');

var AbstractMenu = (function (_super) {
	__extends(AbstractMenu, _super);
	function AbstractMenu() {
		_super.apply(this, arguments);
		this._activeIndex = -1;
		this._items = Object.freeze([]);
	}
	Object.defineProperty(AbstractMenu.prototype, "items", {

		get: function () {
			return this._items;
		},

		set: function (value) {
			if (this._items === value) {
				return;
			}
			this._activeIndex = -1;
			var oldItems = this._items;
			this._items = Object.freeze(value.slice());
			this.onItemsChanged(oldItems, this._items);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(AbstractMenu.prototype, "activeIndex", {

		get: function () {
			return this._activeIndex;
		},

		set: function (value) {
			var newIndex = value | 0;
			var item = this._items[newIndex];
			if (!item || !this.isSelectable(item)) {
				newIndex = -1;
			}
			var oldIndex = this._activeIndex;
			if (oldIndex === newIndex) {
				return;
			}
			this._activeIndex = newIndex;
			this.onActiveIndexChanged(oldIndex, newIndex);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(AbstractMenu.prototype, "activeItem", {

		get: function () {
			return this._items[this._activeIndex] || null;
		},

		set: function (value) {
			this.activeIndex = this._items.indexOf(value);
		},
		enumerable: true,
		configurable: true
	});

	AbstractMenu.prototype.activateNextItem = function () {
		var _this = this;
		var k = this.activeIndex + 1;
		var i = k >= this.items.length ? 0 : k;
		var pred = function (item) { return _this.isSelectable(item); };
		this.activeIndex = arrays.findIndex(this.items, pred, i, true);
	};

	AbstractMenu.prototype.activatePreviousItem = function () {
		var _this = this;
		var k = this.activeIndex;
		var i = k <= 0 ? this.items.length - 1 : k - 1;
		var pred = function (item) { return _this.isSelectable(item); };
		this.activeIndex = arrays.rfindIndex(this.items, pred, i, true);
	};

	AbstractMenu.prototype.activateMnemonicItem = function (char) {
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
	return AbstractMenu;
})(phosphor_widget_1.Widget);
exports.AbstractMenu = AbstractMenu;

},{"phosphor-arrays":26,"phosphor-widget":50}],21:[function(require,module,exports){
var css = ".p-MenuBar-content{margin:0;padding:0;display:flex;flex-direction:row;list-style-type:none}.p-MenuBar-item{box-sizing:border-box}.p-MenuBar-item.p-mod-hidden{display:none}.p-Menu{position:absolute;white-space:nowrap;overflow-x:hidden;overflow-y:auto}.p-Menu-content{margin:0;padding:0;display:table;list-style-type:none}.p-Menu-item{display:table-row}.p-Menu-item.p-mod-hidden{display:none}.p-Menu-itemIcon,.p-Menu-itemSubmenuIcon{display:table-cell;text-align:center}.p-Menu-itemText{display:table-cell;text-align:left}.p-Menu-itemShortcut{display:table-cell;text-align:right}"; (require("browserify-css").createStyle(css, { "href": "node_modules\\phosphor-menus\\lib\\index.css"})); module.exports = css;
},{"browserify-css":2}],22:[function(require,module,exports){

'use strict';
function __export(m) {
	for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(require('./base'));
__export(require('./menu'));
__export(require('./menubar'));
__export(require('./menuitem'));
require('./index.css');

},{"./base":20,"./index.css":21,"./menu":23,"./menubar":24,"./menuitem":25}],23:[function(require,module,exports){

'use strict';
var __extends = (this && this.__extends) || function (d, b) {
	for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	function __() { this.constructor = d; }
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var arrays = require('phosphor-arrays');
var phosphor_domutil_1 = require('phosphor-domutil');
var phosphor_messaging_1 = require('phosphor-messaging');
var phosphor_signaling_1 = require('phosphor-signaling');
var phosphor_widget_1 = require('phosphor-widget');
var base_1 = require('./base');
var menuitem_1 = require('./menuitem');

var MENU_CLASS = 'p-Menu';

var CONTENT_CLASS = 'p-Menu-content';

var ITEM_CLASS = 'p-Menu-item';

var ICON_CLASS = 'p-Menu-itemIcon';

var TEXT_CLASS = 'p-Menu-itemText';

var SHORTCUT_CLASS = 'p-Menu-itemShortcut';

var SUBMENU_CLASS = 'p-Menu-itemSubmenuIcon';

var CHECK_TYPE_CLASS = 'p-type-check';

var SEPARATOR_TYPE_CLASS = 'p-type-separator';

var SUBMENU_TYPE_CLASS = 'p-type-submenu';

var ACTIVE_CLASS = 'p-mod-active';

var DISABLED_CLASS = 'p-mod-disabled';

var CHECKED_CLASS = 'p-mod-checked';

var HIDDEN_CLASS = 'p-mod-hidden';

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

	Menu.createItemNode = function () {
		var node = document.createElement('li');
		var icon = document.createElement('span');
		var text = document.createElement('span');
		var shortcut = document.createElement('span');
		var submenu = document.createElement('span');
		node.className = ITEM_CLASS;
		text.className = TEXT_CLASS;
		shortcut.className = SHORTCUT_CLASS;
		submenu.className = SUBMENU_CLASS;
		node.appendChild(icon);
		node.appendChild(text);
		node.appendChild(shortcut);
		node.appendChild(submenu);
		return node;
	};

	Menu.updateItemNode = function (node, item) {
		var sep = item.type === menuitem_1.MenuItem.Separator;
		var sub = item.type === menuitem_1.MenuItem.Submenu;
		var icon = node.firstChild;
		var text = icon.nextSibling;
		var shortcut = text.nextSibling;
		node.className = MenuPrivate.createItemClass(item);
		icon.className = ICON_CLASS + (item.icon ? ' ' + item.icon : '');
		text.textContent = sep ? '' : item.text.replace(/&/g, '');
		shortcut.textContent = (sep || sub) ? '' : item.shortcut;
	};

	Menu.prototype.dispose = function () {
		this.close();
		_super.prototype.dispose.call(this);
	};
	Object.defineProperty(Menu.prototype, "closed", {

		get: function () {
			return MenuPrivate.closedSignal.bind(this);
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

	Menu.prototype.openActiveItem = function () {
		if (!this.isVisible) {
			return;
		}
		var index = this.activeIndex;
		if (index === -1) {
			return;
		}
		var item = this.items[index];
		if (item.disabled || !item.submenu) {
			return;
		}
		this._openChildMenu(item, this._nodes[index], false);
		this._childMenu.activateNextItem();
	};

	Menu.prototype.triggerActiveItem = function () {
		if (!this.isVisible) {
			return;
		}
		var index = this.activeIndex;
		if (index === -1) {
			return;
		}
		var item = this.items[index];
		if (item.disabled) {
			return;
		}
		if (item.submenu) {
			this._openChildMenu(item, this._nodes[index], false);
			this._childMenu.activateNextItem();
			return;
		}
		var handler = item.handler;
		if (!handler) {
			return;
		}
		this.rootMenu.close();
		handler(item);
	};

	Menu.prototype.popup = function (x, y, forceX, forceY) {
		if (forceX === void 0) { forceX = false; }
		if (forceY === void 0) { forceY = false; }
		if (!this.isAttached) {
			document.addEventListener('keydown', this, true);
			document.addEventListener('keypress', this, true);
			document.addEventListener('mousedown', this, true);
			MenuPrivate.openRootMenu(this, x, y, forceX, forceY);
		}
	};

	Menu.prototype.open = function (x, y, forceX, forceY) {
		if (forceX === void 0) { forceX = false; }
		if (forceY === void 0) { forceY = false; }
		if (!this.isAttached) {
			MenuPrivate.openRootMenu(this, x, y, forceX, forceY);
		}
	};

	Menu.prototype.handleEvent = function (event) {
		switch (event.type) {
			case 'mousemove':
				this._evtMouseMove(event);
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
			case 'keydown':
				this._evtKeyDown(event);
				break;
			case 'keypress':
				this._evtKeyPress(event);
				break;
			case 'contextmenu':
				event.preventDefault();
				event.stopPropagation();
				break;
		}
	};

	Menu.prototype.isSelectable = function (item) {
		if (item.disabled || item.type === menuitem_1.MenuItem.Separator) {
			return false;
		}
		if (item.type === menuitem_1.MenuItem.Submenu) {
			return !!item.submenu;
		}
		return !!item.handler;
	};

	Menu.prototype.onItemsChanged = function (oldItems, newItems) {

		this.close();

		var nodes = this._nodes;
		var content = this.contentNode;
		var constructor = this.constructor;

		while (nodes.length > newItems.length) {
			var node = nodes.pop();
			content.removeChild(node);
		}

		while (nodes.length < newItems.length) {
			var node = constructor.createItemNode();
			content.appendChild(node);
			nodes.push(node);
		}


	};

	Menu.prototype.onActiveIndexChanged = function (oldIndex, newIndex) {
		var oldNode = this._nodes[oldIndex];
		var newNode = this._nodes[newIndex];
		if (oldNode)
			oldNode.classList.remove(ACTIVE_CLASS);
		if (newNode)
			newNode.classList.add(ACTIVE_CLASS);
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
			this.parent = null;
			this.closed.emit(void 0);
		}
		else if (this.isAttached) {
			this.detach();
			this.closed.emit(void 0);
		}
	};

	Menu.prototype.onUpdateRequest = function (msg) {

		var items = this.items;
		var nodes = this._nodes;
		var constructor = this.constructor;

		for (var i = 0, n = items.length; i < n; ++i) {
			constructor.updateItemNode(nodes[i], items[i]);
		}

		var active = nodes[this.activeIndex];
		if (active)
			active.classList.add(ACTIVE_CLASS);

		MenuPrivate.hideUselessItems(nodes, items);
	};

	Menu.prototype.onAfterAttach = function (msg) {
		this.node.addEventListener('mouseup', this);
		this.node.addEventListener('mousemove', this);
		this.node.addEventListener('mouseleave', this);
		this.node.addEventListener('contextmenu', this);
	};

	Menu.prototype.onBeforeDetach = function (msg) {
		this.node.removeEventListener('mouseup', this);
		this.node.removeEventListener('mousemove', this);
		this.node.removeEventListener('mouseleave', this);
		this.node.removeEventListener('contextmenu', this);
		document.removeEventListener('keydown', this, true);
		document.removeEventListener('keypress', this, true);
		document.removeEventListener('mousedown', this, true);
	};

	Menu.prototype._evtMouseMove = function (event) {
		var x = event.clientX;
		var y = event.clientY;
		var i = arrays.findIndex(this._nodes, function (node) { return phosphor_domutil_1.hitTest(node, x, y); });
		if (i === this.activeIndex) {
			return;
		}
		this.activeIndex = i;
		this._syncAncestors();
		this._closeChildMenu();
		this._cancelPendingOpen();
		var item = this.activeItem;
		if (item && item.submenu) {
			if (item === this._childItem) {
				this._cancelPendingClose();
			}
			else {
				this._openChildMenu(item, this._nodes[i], true);
			}
		}
	};

	Menu.prototype._evtMouseLeave = function (event) {
		this._cancelPendingOpen();
		var x = event.clientX;
		var y = event.clientY;
		var child = this._childMenu;
		if (!child || !phosphor_domutil_1.hitTest(child.node, x, y)) {
			this.activeIndex = -1;
			this._closeChildMenu();
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

	Menu.prototype._evtMouseUp = function (event) {
		if (event.button !== 0) {
			return;
		}
		event.preventDefault();
		event.stopPropagation();
		var node = this._nodes[this.activeIndex];
		if (node && node.contains(event.target)) {
			this.triggerActiveItem();
		}
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
				MenuPrivate.openSubmenu(menu, node);
			}, OPEN_DELAY);
		}
		else {
			var menu = item.submenu;
			this._childItem = item;
			this._childMenu = menu;
			menu._parentMenu = this;
			MenuPrivate.openSubmenu(menu, node);
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
	return Menu;
})(base_1.AbstractMenu);
exports.Menu = Menu;

var MenuPrivate;
(function (MenuPrivate) {

	MenuPrivate.closedSignal = new phosphor_signaling_1.Signal();

	function createItemClass(item) {
		var name = ITEM_CLASS;
		if (item.className) {
			name += ' ' + item.className;
		}
		if (item.type === menuitem_1.MenuItem.Separator) {
			return name + ' ' + SEPARATOR_TYPE_CLASS;
		}
		if (item.type === menuitem_1.MenuItem.Submenu) {
			name += ' ' + SUBMENU_TYPE_CLASS;
			if (item.disabled || !item.submenu) {
				name += ' ' + DISABLED_CLASS;
			}
			return name;
		}
		if (item.type === menuitem_1.MenuItem.Check) {
			name += ' ' + CHECK_TYPE_CLASS;
			if (item.checked) {
				name += ' ' + CHECKED_CLASS;
			}
		}
		if (item.disabled || !item.handler) {
			name += ' ' + DISABLED_CLASS;
		}
		return name;
	}
	MenuPrivate.createItemClass = createItemClass;

	function hideUselessItems(nodes, items) {

		var k1;
		for (k1 = 0; k1 < items.length; ++k1) {
			if (items[k1].type !== menuitem_1.MenuItem.Separator) {
				break;
			}
			nodes[k1].classList.add(HIDDEN_CLASS);
		}

		var k2;
		for (k2 = items.length - 1; k2 >= 0; --k2) {
			if (items[k2].type !== menuitem_1.MenuItem.Separator) {
				break;
			}
			nodes[k2].classList.add(HIDDEN_CLASS);
		}

		var hide = false;
		while (++k1 < k2) {
			if (items[k1].type !== menuitem_1.MenuItem.Separator) {
				hide = false;
			}
			else if (hide) {
				nodes[k1].classList.add(HIDDEN_CLASS);
			}
			else {
				hide = true;
			}
		}
	}
	MenuPrivate.hideUselessItems = hideUselessItems;

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
	MenuPrivate.openRootMenu = openRootMenu;

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
	MenuPrivate.openSubmenu = openSubmenu;

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
		style.maxHeight = maxHeight + "px";
		menu.attach(document.body);
		if (node.scrollHeight > maxHeight) {
			style.width = (2 * node.offsetWidth - node.clientWidth) + "px";
		}
		var rect = node.getBoundingClientRect();
		return { width: rect.width, height: rect.height };
	}

	function showMenu(menu, x, y) {
		var style = menu.node.style;
		style.top = Math.max(0, y) + "px";
		style.left = Math.max(0, x) + "px";
		style.visibility = '';
	}
})(MenuPrivate || (MenuPrivate = {}));

},{"./base":20,"./menuitem":25,"phosphor-arrays":26,"phosphor-domutil":17,"phosphor-messaging":27,"phosphor-signaling":35,"phosphor-widget":50}],24:[function(require,module,exports){

'use strict';
var __extends = (this && this.__extends) || function (d, b) {
	for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	function __() { this.constructor = d; }
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var arrays = require('phosphor-arrays');
var phosphor_domutil_1 = require('phosphor-domutil');
var base_1 = require('./base');
var menuitem_1 = require('./menuitem');

var MENU_BAR_CLASS = 'p-MenuBar';

var CONTENT_CLASS = 'p-MenuBar-content';

var MENU_CLASS = 'p-MenuBar-menu';

var ITEM_CLASS = 'p-MenuBar-item';

var ICON_CLASS = 'p-MenuBar-itemIcon';

var TEXT_CLASS = 'p-MenuBar-itemText';

var SEPARATOR_TYPE_CLASS = 'p-type-separator';

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

	MenuBar.createItemNode = function () {
		var node = document.createElement('li');
		var icon = document.createElement('span');
		var text = document.createElement('span');
		node.className = ITEM_CLASS;
		icon.className = ICON_CLASS;
		text.className = TEXT_CLASS;
		node.appendChild(icon);
		node.appendChild(text);
		return node;
	};

	MenuBar.updateItemNode = function (node, item) {
		var sep = item.type === menuitem_1.MenuItem.Separator;
		var icon = node.firstChild;
		var text = node.lastChild;
		node.className = MenuBarPrivate.createItemClass(item);
		icon.className = ICON_CLASS + (item.icon ? ' ' + item.icon : '');
		text.textContent = sep ? '' : item.text.replace(/&/g, '');
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

	MenuBar.prototype.openActiveItem = function () {
		if (!this.isVisible) {
			return;
		}
		var index = this.activeIndex;
		if (index === -1) {
			return;
		}
		var item = this.items[index];
		if (item.disabled || !item.submenu) {
			return;
		}
		this._activate();
		this._closeChildMenu();
		this._openChildMenu(item.submenu, this._nodes[index]);
	};

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
			case 'keydown':
				this._evtKeyDown(event);
				break;
			case 'keypress':
				this._evtKeyPress(event);
				break;
			case 'contextmenu':
				event.preventDefault();
				event.stopPropagation();
				break;
		}
	};

	MenuBar.prototype.isSelectable = function (item) {
		return !item.disabled && !!item.submenu;
	};

	MenuBar.prototype.onItemsChanged = function (oldItems, newItems) {

		this._reset();

		for (var _i = 0; _i < oldItems.length; _i++) {
			var item = oldItems[_i];
			if (newItems.indexOf(item) === -1) {
				item.changed.disconnect(this._onItemChanged, this);
			}
		}

		for (var _a = 0; _a < newItems.length; _a++) {
			var item = newItems[_a];
			if (oldItems.indexOf(item) === -1) {
				item.changed.connect(this._onItemChanged, this);
			}
		}

		var nodes = this._nodes;
		var content = this.contentNode;
		var constructor = this.constructor;

		while (nodes.length > newItems.length) {
			var node = nodes.pop();
			content.removeChild(node);
		}

		while (nodes.length < newItems.length) {
			var node = constructor.createItemNode();
			content.appendChild(node);
			nodes.push(node);
		}

		this.update();
	};

	MenuBar.prototype.onActiveIndexChanged = function (oldIndex, newIndex) {
		var oldNode = this._nodes[oldIndex];
		var newNode = this._nodes[newIndex];
		if (oldNode)
			oldNode.classList.remove(ACTIVE_CLASS);
		if (newNode)
			newNode.classList.add(ACTIVE_CLASS);
	};

	MenuBar.prototype.onUpdateRequest = function (msg) {

		var items = this.items;
		var nodes = this._nodes;
		var constructor = this.constructor;

		for (var i = 0, n = items.length; i < n; ++i) {
			constructor.updateItemNode(nodes[i], items[i]);
		}

		var active = nodes[this.activeIndex];
		if (active)
			active.classList.add(ACTIVE_CLASS);

		MenuBarPrivate.hideUselessItems(nodes, items);
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
		this._reset();
	};

	MenuBar.prototype._evtMouseDown = function (event) {



		var x = event.clientX;
		var y = event.clientY;
		if (this._active && MenuBarPrivate.hitTestMenus(this._childMenu, x, y)) {
			return;
		}



		if (phosphor_domutil_1.hitTest(this.node, x, y)) {
			event.preventDefault();
			event.stopPropagation();
		}

		var i = arrays.findIndex(this._nodes, function (node) { return phosphor_domutil_1.hitTest(node, x, y); });

		if (i === -1) {
			this._deactivate();
			this._closeChildMenu();
			this.activeIndex = -1;
			return;
		}

		if (event.button !== 0) {
			return;
		}

		if (this._active) {
			this._deactivate();
			this._closeChildMenu();
			this.activeIndex = i;
			return;
		}

		this._activate();
		this.activeIndex = i;
		this.openActiveItem();
	};

	MenuBar.prototype._evtMouseMove = function (event) {

		var x = event.clientX;
		var y = event.clientY;
		var i = arrays.findIndex(this._nodes, function (node) { return phosphor_domutil_1.hitTest(node, x, y); });

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
				if (leaf && leaf.activeItem && leaf.activeItem.submenu) {
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

	MenuBar.prototype._activate = function () {
		if (this._active) {
			return;
		}
		this._active = true;
		this.addClass(ACTIVE_CLASS);
		document.addEventListener('mousedown', this, true);
		document.addEventListener('keydown', this, true);
		document.addEventListener('keypress', this, true);
	};

	MenuBar.prototype._deactivate = function () {
		if (!this._active) {
			return;
		}
		this._active = false;
		this.removeClass(ACTIVE_CLASS);
		document.removeEventListener('mousedown', this, true);
		document.removeEventListener('keydown', this, true);
		document.removeEventListener('keypress', this, true);
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
		if (!menu) {
			return;
		}
		this._childMenu = null;
		menu.closed.disconnect(this._onMenuClosed, this);
		menu.removeClass(MENU_CLASS);
		menu.close();
	};

	MenuBar.prototype._reset = function () {
		this._deactivate();
		this._closeChildMenu();
		this.activeIndex = -1;
	};

	MenuBar.prototype._onItemChanged = function () {
		this._reset();
		this.update();
	};

	MenuBar.prototype._onMenuClosed = function (sender) {
		sender.closed.disconnect(this._onMenuClosed, this);
		sender.removeClass(MENU_CLASS);
		this._deactivate();
		this._childMenu = null;
		this.activeIndex = -1;
	};
	return MenuBar;
})(base_1.AbstractMenu);
exports.MenuBar = MenuBar;

var MenuBarPrivate;
(function (MenuBarPrivate) {

	function createItemClass(item) {
		var name = ITEM_CLASS;
		if (item.className) {
			name += ' ' + item.className;
		}
		if (item.type === menuitem_1.MenuItem.Separator) {
			return name + ' ' + SEPARATOR_TYPE_CLASS;
		}
		if (item.disabled || (item.type === menuitem_1.MenuItem.Submenu && !item.submenu)) {
			return name + ' ' + DISABLED_CLASS;
		}
		return name;
	}
	MenuBarPrivate.createItemClass = createItemClass;

	function hitTestMenus(menu, x, y) {
		while (menu) {
			if (phosphor_domutil_1.hitTest(menu.node, x, y)) {
				return true;
			}
			menu = menu.childMenu;
		}
		return false;
	}
	MenuBarPrivate.hitTestMenus = hitTestMenus;

	function hideUselessItems(nodes, items) {

		var k1;
		for (k1 = 0; k1 < items.length; ++k1) {
			if (items[k1].type === menuitem_1.MenuItem.Submenu) {
				break;
			}
			nodes[k1].classList.add(HIDDEN_CLASS);
		}

		var k2;
		for (k2 = items.length - 1; k2 >= 0; --k2) {
			if (items[k2].type === menuitem_1.MenuItem.Submenu) {
				break;
			}
			nodes[k2].classList.add(HIDDEN_CLASS);
		}

		var hide = false;
		while (++k1 < k2) {
			if (items[k1].type === menuitem_1.MenuItem.Submenu) {
				hide = false;
			}
			else if (items[k1].type !== menuitem_1.MenuItem.Separator) {
				nodes[k1].classList.add(HIDDEN_CLASS);
			}
			else if (hide) {
				nodes[k1].classList.add(HIDDEN_CLASS);
			}
			else {
				hide = true;
			}
		}
	}
	MenuBarPrivate.hideUselessItems = hideUselessItems;
})(MenuBarPrivate || (MenuBarPrivate = {}));

},{"./base":20,"./menuitem":25,"phosphor-arrays":26,"phosphor-domutil":17}],25:[function(require,module,exports){

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
			MenuItemPrivate.initFrom(this, options);
	}
	Object.defineProperty(MenuItem.prototype, "changed", {

		get: function () {
			return MenuItemPrivate.changedSignal.bind(this);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(MenuItem.prototype, "type", {

		get: function () {
			return MenuItemPrivate.typeProperty.get(this);
		},

		set: function (value) {
			MenuItemPrivate.typeProperty.set(this, value);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(MenuItem.prototype, "text", {

		get: function () {
			return MenuItemPrivate.textProperty.get(this);
		},

		set: function (value) {
			MenuItemPrivate.textProperty.set(this, value);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(MenuItem.prototype, "icon", {

		get: function () {
			return MenuItemPrivate.iconProperty.get(this);
		},

		set: function (value) {
			MenuItemPrivate.iconProperty.set(this, value);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(MenuItem.prototype, "shortcut", {

		get: function () {
			return MenuItemPrivate.shortcutProperty.get(this);
		},

		set: function (value) {
			MenuItemPrivate.shortcutProperty.set(this, value);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(MenuItem.prototype, "checked", {

		get: function () {
			return MenuItemPrivate.checkedProperty.get(this);
		},

		set: function (value) {
			MenuItemPrivate.checkedProperty.set(this, value);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(MenuItem.prototype, "disabled", {

		get: function () {
			return MenuItemPrivate.disabledProperty.get(this);
		},

		set: function (value) {
			MenuItemPrivate.disabledProperty.set(this, value);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(MenuItem.prototype, "className", {

		get: function () {
			return MenuItemPrivate.classNameProperty.get(this);
		},

		set: function (value) {
			MenuItemPrivate.classNameProperty.set(this, value);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(MenuItem.prototype, "handler", {

		get: function () {
			return MenuItemPrivate.handlerProperty.get(this);
		},

		set: function (value) {
			MenuItemPrivate.handlerProperty.set(this, value);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(MenuItem.prototype, "submenu", {

		get: function () {
			return MenuItemPrivate.submenuProperty.get(this);
		},

		set: function (value) {
			MenuItemPrivate.submenuProperty.set(this, value);
		},
		enumerable: true,
		configurable: true
	});
	return MenuItem;
})();
exports.MenuItem = MenuItem;

var MenuItem;
(function (MenuItem) {

	MenuItem.Normal = MenuItemType.Normal;

	MenuItem.Check = MenuItemType.Check;

	MenuItem.Separator = MenuItemType.Separator;

	MenuItem.Submenu = MenuItemType.Submenu;
})(MenuItem = exports.MenuItem || (exports.MenuItem = {}));

var MenuItemPrivate;
(function (MenuItemPrivate) {

	MenuItemPrivate.changedSignal = new phosphor_signaling_1.Signal();

	MenuItemPrivate.typeProperty = new phosphor_properties_1.Property({
		name: 'type',
		value: MenuItemType.Normal,
		coerce: function (owner, value) { return owner.submenu ? MenuItemType.Submenu : value; },
		changed: function (owner) { MenuItemPrivate.checkedProperty.coerce(owner); },
		notify: MenuItemPrivate.changedSignal,
	});

	MenuItemPrivate.textProperty = new phosphor_properties_1.Property({
		name: 'text',
		value: '',
		notify: MenuItemPrivate.changedSignal,
	});

	MenuItemPrivate.iconProperty = new phosphor_properties_1.Property({
		name: 'icon',
		value: '',
		notify: MenuItemPrivate.changedSignal,
	});

	MenuItemPrivate.shortcutProperty = new phosphor_properties_1.Property({
		name: 'shortcut',
		value: '',
		notify: MenuItemPrivate.changedSignal,
	});

	MenuItemPrivate.checkedProperty = new phosphor_properties_1.Property({
		name: 'checked',
		value: false,
		coerce: function (owner, value) { return owner.type === MenuItemType.Check ? value : false; },
		notify: MenuItemPrivate.changedSignal,
	});

	MenuItemPrivate.disabledProperty = new phosphor_properties_1.Property({
		name: 'disabled',
		value: false,
		notify: MenuItemPrivate.changedSignal,
	});

	MenuItemPrivate.classNameProperty = new phosphor_properties_1.Property({
		name: 'className',
		value: '',
		notify: MenuItemPrivate.changedSignal,
	});

	MenuItemPrivate.handlerProperty = new phosphor_properties_1.Property({
		name: 'handler',
		value: null,
		coerce: function (owner, value) { return value || null; },
		notify: MenuItemPrivate.changedSignal,
	});

	MenuItemPrivate.submenuProperty = new phosphor_properties_1.Property({
		name: 'submenu',
		value: null,
		coerce: function (owner, value) { return value || null; },
		changed: function (owner) { MenuItemPrivate.typeProperty.coerce(owner); },
		notify: MenuItemPrivate.changedSignal,
	});

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
		if (options.checked !== void 0) {
			item.checked = options.checked;
		}
		if (options.disabled !== void 0) {
			item.disabled = options.disabled;
		}
		if (options.className !== void 0) {
			item.className = options.className;
		}
		if (options.handler !== void 0) {
			item.handler = options.handler;
		}
		if (options.submenu !== void 0) {
			item.submenu = options.submenu;
		}
	}
	MenuItemPrivate.initFrom = initFrom;
})(MenuItemPrivate || (MenuItemPrivate = {}));

},{"phosphor-properties":34,"phosphor-signaling":35}],26:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7}],27:[function(require,module,exports){

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

},{"phosphor-queue":28}],28:[function(require,module,exports){

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

},{}],29:[function(require,module,exports){

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

},{}],30:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"./layout":31,"./panel":32,"dup":4}],31:[function(require,module,exports){

'use strict';
var __extends = (this && this.__extends) || function (d, b) {
	for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	function __() { this.constructor = d; }
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var arrays = require('phosphor-arrays');
var phosphor_messaging_1 = require('phosphor-messaging');
var phosphor_widget_1 = require('phosphor-widget');

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
		var n = this._children.length;
		var i = this._children.indexOf(child);
		var j = Math.max(0, Math.min(index | 0, n));
		if (i !== -1) {
			if (j === n)
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

	PanelLayout.prototype.removeChild = function (child) {
		var i = arrays.remove(this._children, child);
		if (i !== -1 && this.parent)
			this.detachChild(i, child);
	};

	PanelLayout.prototype.initialize = function () {
		for (var i = 0; i < this.childCount(); ++i) {
			var child = this.childAt(i);
			child.parent = this.parent;
			this.attachChild(i, child);
		}
	};

	PanelLayout.prototype.attachChild = function (index, child) {
		var ref = this.parent.node.children[index];
		this.parent.node.insertBefore(child.node, ref);
		if (this.parent.isAttached)
			phosphor_messaging_1.sendMessage(child, phosphor_widget_1.Widget.MsgAfterAttach);
	};

	PanelLayout.prototype.moveChild = function (fromIndex, toIndex, child) {
		if (this.parent.isAttached)
			phosphor_messaging_1.sendMessage(child, phosphor_widget_1.Widget.MsgBeforeDetach);
		this.parent.node.removeChild(child.node);
		var ref = this.parent.node.children[toIndex];
		this.parent.node.insertBefore(child.node, ref);
		if (this.parent.isAttached)
			phosphor_messaging_1.sendMessage(child, phosphor_widget_1.Widget.MsgAfterAttach);
	};

	PanelLayout.prototype.detachChild = function (index, child) {
		if (this.parent.isAttached)
			phosphor_messaging_1.sendMessage(child, phosphor_widget_1.Widget.MsgBeforeDetach);
		this.parent.node.removeChild(child.node);
	};

	PanelLayout.prototype.onChildRemoved = function (msg) {
		this.removeChild(msg.child);
	};
	return PanelLayout;
})(phosphor_widget_1.AbstractLayout);
exports.PanelLayout = PanelLayout;

},{"phosphor-arrays":33,"phosphor-messaging":27,"phosphor-widget":50}],32:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"./layout":31,"dup":10,"phosphor-widget":50}],33:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7}],34:[function(require,module,exports){

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

},{}],35:[function(require,module,exports){

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

},{}],36:[function(require,module,exports){
var css = ".p-SplitPanel,.p-SplitPanel-child{z-index:0}.p-SplitPanel-handle{z-index:1}.p-SplitPanel-handle.p-mod-hidden{display:none}.p-SplitPanel-handle:after{position:absolute;top:0;left:0;width:100%;height:100%;content:''}.p-SplitPanel.p-mod-horizontal>.p-SplitPanel-handle{cursor:ew-resize}.p-SplitPanel.p-mod-vertical>.p-SplitPanel-handle{cursor:ns-resize}.p-SplitPanel.p-mod-horizontal>.p-SplitPanel-handle:after{left:50%;min-width:7px;transform:translateX(-50%)}.p-SplitPanel.p-mod-vertical>.p-SplitPanel-handle:after{top:50%;min-height:7px;transform:translateY(-50%)}"; (require("browserify-css").createStyle(css, { "href": "node_modules\\phosphor-splitpanel\\lib\\index.css"})); module.exports = css;
},{"browserify-css":2}],37:[function(require,module,exports){

'use strict';
function __export(m) {
	for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(require('./layout'));
__export(require('./panel'));
require('./index.css');

},{"./index.css":36,"./layout":38,"./panel":39}],38:[function(require,module,exports){

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
var phosphor_panel_1 = require('phosphor-panel');
var phosphor_properties_1 = require('phosphor-properties');
var phosphor_widget_1 = require('phosphor-widget');

var HIDDEN_CLASS = 'p-mod-hidden';

var HORIZONTAL_CLASS = 'p-mod-horizontal';

var VERTICAL_CLASS = 'p-mod-vertical';

(function (Orientation) {

	Orientation[Orientation["Horizontal"] = 0] = "Horizontal";

	Orientation[Orientation["Vertical"] = 1] = "Vertical";
})(exports.Orientation || (exports.Orientation = {}));
var Orientation = exports.Orientation;

var SplitLayout = (function (_super) {
	__extends(SplitLayout, _super);

	function SplitLayout(factory) {
		_super.call(this);
		this._fixed = 0;
		this._spacing = 3;
		this._normed = false;
		this._box = null;
		this._sizers = [];
		this._handles = [];
		this._orientation = Orientation.Horizontal;
		this._factory = factory;
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
			SplitLayoutPrivate.toggleOrientation(this.parent, value);
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
			value = Math.max(0, value | 0);
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

	SplitLayout.prototype.sizes = function () {
		return SplitLayoutPrivate.normalize(this._sizers.map(function (s) { return s.size; }));
	};

	SplitLayout.prototype.setSizes = function (sizes) {
		var normed = SplitLayoutPrivate.normalize(sizes);
		for (var i = 0, n = this._sizers.length; i < n; ++i) {
			var hint = Math.max(0, normed[i] || 0);
			var sizer = this._sizers[i];
			sizer.sizeHint = hint;
			sizer.size = hint;
		}
		this._normed = true;
		if (this.parent)
			this.parent.update();
	};

	SplitLayout.prototype.handleAt = function (index) {
		return this._handles[index];
	};

	SplitLayout.prototype.moveHandle = function (index, position) {

		var handle = this._handles[index];
		if (!handle || handle.classList.contains(HIDDEN_CLASS)) {
			return;
		}

		var delta;
		if (this._orientation === Orientation.Horizontal) {
			delta = position - handle.offsetLeft;
		}
		else {
			delta = position - handle.offsetTop;
		}

		if (delta === 0) {
			return;
		}

		for (var _i = 0, _a = this._sizers; _i < _a.length; _i++) {
			var sizer = _a[_i];
			if (sizer.size > 0)
				sizer.sizeHint = sizer.size;
		}

		if (delta > 0) {
			SplitLayoutPrivate.growSizer(this._sizers, index, delta);
		}
		else {
			SplitLayoutPrivate.shrinkSizer(this._sizers, index, -delta);
		}

		if (this.parent)
			this.parent.update();
	};

	SplitLayout.prototype.initialize = function () {
		SplitLayoutPrivate.toggleOrientation(this.parent, this.orientation);
		_super.prototype.initialize.call(this);
	};

	SplitLayout.prototype.attachChild = function (index, child) {
		var handle = SplitLayoutPrivate.createHandle(this._factory);
		var average = SplitLayoutPrivate.averageSize(this._sizers);
		var sizer = SplitLayoutPrivate.createSizer(average);
		arrays.insert(this._sizers, index, sizer);
		arrays.insert(this._handles, index, handle);
		SplitLayoutPrivate.prepareGeometry(child);
		this.parent.node.appendChild(child.node);
		this.parent.node.appendChild(handle);
		if (this.parent.isAttached)
			phosphor_messaging_1.sendMessage(child, phosphor_widget_1.Widget.MsgAfterAttach);
		this.parent.fit();
	};

	SplitLayout.prototype.moveChild = function (fromIndex, toIndex, child) {
		arrays.move(this._sizers, fromIndex, toIndex);
		arrays.move(this._handles, fromIndex, toIndex);
		this.parent.fit();
	};

	SplitLayout.prototype.detachChild = function (index, child) {
		var sizer = arrays.removeAt(this._sizers, index);
		var handle = arrays.removeAt(this._handles, index);
		if (this.parent.isAttached)
			phosphor_messaging_1.sendMessage(child, phosphor_widget_1.Widget.MsgBeforeDetach);
		this.parent.node.removeChild(child.node);
		this.parent.node.removeChild(handle);
		SplitLayoutPrivate.resetGeometry(child);
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
		if (SplitLayoutPrivate.IsIE) {
			phosphor_messaging_1.sendMessage(this.parent, phosphor_widget_1.Widget.MsgFitRequest);
		}
		else {
			this.parent.fit();
		}
	};

	SplitLayout.prototype.onChildHidden = function (msg) {
		if (SplitLayoutPrivate.IsIE) {
			phosphor_messaging_1.sendMessage(this.parent, phosphor_widget_1.Widget.MsgFitRequest);
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
		var lastHandle = null;
		for (var i = 0, n = this.childCount(); i < n; ++i) {
			var handle = this._handles[i];
			if (this.childAt(i).isHidden) {
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
		var horz = this._orientation === Orientation.Horizontal;
		if (horz) {
			minW = this._fixed;
			maxW = nVisible > 0 ? minW : maxW;
		}
		else {
			minH = this._fixed;
			maxH = nVisible > 0 ? minH : maxH;
		}

		for (var i = 0, n = this.childCount(); i < n; ++i) {
			var child = this.childAt(i);
			var sizer = this._sizers[i];
			if (sizer.size > 0) {
				sizer.sizeHint = sizer.size;
			}
			if (child.isHidden) {
				sizer.minSize = 0;
				sizer.maxSize = 0;
				continue;
			}
			var limits = phosphor_domutil_1.sizeLimits(child.node);
			sizer.stretch = SplitLayout.getStretch(child);
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

		var box = this._box = phosphor_domutil_1.boxSizing(this.parent.node);
		minW += box.horizontalSum;
		minH += box.verticalSum;
		maxW += box.horizontalSum;
		maxH += box.verticalSum;

		var style = this.parent.node.style;
		style.minWidth = minW + "px";
		style.minHeight = minH + "px";
		style.maxWidth = maxW === Infinity ? 'none' : maxW + "px";
		style.maxHeight = maxH === Infinity ? 'none' : maxH + "px";

		var ancestor = this.parent.parent;
		if (ancestor)
			phosphor_messaging_1.sendMessage(ancestor, phosphor_widget_1.Widget.MsgFitRequest);

		phosphor_messaging_1.sendMessage(this.parent, phosphor_widget_1.Widget.MsgUpdateRequest);
	};

	SplitLayout.prototype._update = function (offsetWidth, offsetHeight) {

		if (this.childCount() === 0) {
			return;
		}

		if (offsetWidth < 0) {
			offsetWidth = this.parent.node.offsetWidth;
		}
		if (offsetHeight < 0) {
			offsetHeight = this.parent.node.offsetHeight;
		}

		var box = this._box || (this._box = phosphor_domutil_1.boxSizing(this.parent.node));

		var top = box.paddingTop;
		var left = box.paddingLeft;
		var width = offsetWidth - box.horizontalSum;
		var height = offsetHeight - box.verticalSum;

		var space;
		var horz = this._orientation === Orientation.Horizontal;
		if (horz) {
			space = Math.max(0, width - this._fixed);
		}
		else {
			space = Math.max(0, height - this._fixed);
		}

		if (this._normed) {
			for (var _i = 0, _a = this._sizers; _i < _a.length; _i++) {
				var sizer = _a[_i];
				sizer.sizeHint *= space;
			}
			this._normed = false;
		}

		phosphor_boxengine_1.boxCalc(this._sizers, space);

		var spacing = this._spacing;
		for (var i = 0, n = this.childCount(); i < n; ++i) {
			var child = this.childAt(i);
			if (child.isHidden) {
				continue;
			}
			var handle = this._handles[i];
			var size = this._sizers[i].size;
			if (horz) {
				SplitLayoutPrivate.setGeometry(child, left, top, size, height);
				left += size;
				SplitLayoutPrivate.setHandleGeo(handle, left, top, spacing, height);
				left += spacing;
			}
			else {
				SplitLayoutPrivate.setGeometry(child, left, top, width, size);
				top += size;
				SplitLayoutPrivate.setHandleGeo(handle, left, top, width, spacing);
				top += spacing;
			}
		}
	};
	return SplitLayout;
})(phosphor_panel_1.PanelLayout);
exports.SplitLayout = SplitLayout;

var SplitLayout;
(function (SplitLayout) {

	SplitLayout.Horizontal = Orientation.Horizontal;

	SplitLayout.Vertical = Orientation.Vertical;

	function getStretch(widget) {
		return SplitLayoutPrivate.stretchProperty.get(widget);
	}
	SplitLayout.getStretch = getStretch;

	function setStretch(widget, value) {
		SplitLayoutPrivate.stretchProperty.set(widget, value);
	}
	SplitLayout.setStretch = setStretch;
})(SplitLayout = exports.SplitLayout || (exports.SplitLayout = {}));

var SplitLayoutPrivate;
(function (SplitLayoutPrivate) {

	SplitLayoutPrivate.IsIE = /Trident/.test(navigator.userAgent);

	SplitLayoutPrivate.stretchProperty = new phosphor_properties_1.Property({
		name: 'stretch',
		value: 0,
		coerce: function (owner, value) { return Math.max(0, value | 0); },
		changed: onChildPropertyChanged,
	});

	function createSizer(size) {
		var sizer = new phosphor_boxengine_1.BoxSizer();
		sizer.sizeHint = size | 0;
		return sizer;
	}
	SplitLayoutPrivate.createSizer = createSizer;

	function createHandle(factory) {
		var handle = factory.createHandle();
		handle.style.position = 'absolute';
		return handle;
	}
	SplitLayoutPrivate.createHandle = createHandle;

	function toggleOrientation(widget, orient) {
		widget.toggleClass(HORIZONTAL_CLASS, orient === Orientation.Horizontal);
		widget.toggleClass(VERTICAL_CLASS, orient === Orientation.Vertical);
	}
	SplitLayoutPrivate.toggleOrientation = toggleOrientation;

	function prepareGeometry(widget) {
		widget.node.style.position = 'absolute';
	}
	SplitLayoutPrivate.prepareGeometry = prepareGeometry;

	function resetGeometry(widget) {
		var rect = rectProperty.get(widget);
		var style = widget.node.style;
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
	SplitLayoutPrivate.resetGeometry = resetGeometry;

	function setGeometry(widget, left, top, width, height) {
		var resized = false;
		var style = widget.node.style;
		var rect = rectProperty.get(widget);
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
			phosphor_messaging_1.sendMessage(widget, new phosphor_widget_1.ResizeMessage(width, height));
		}
	}
	SplitLayoutPrivate.setGeometry = setGeometry;

	function setHandleGeo(handle, left, top, width, height) {
		var style = handle.style;
		style.top = top + "px";
		style.left = left + "px";
		style.width = width + "px";
		style.height = height + "px";
	}
	SplitLayoutPrivate.setHandleGeo = setHandleGeo;

	function averageSize(sizers) {
		if (sizers.length === 0)
			return 0;
		return sizers.reduce(function (v, s) { return v + s.size; }, 0) / sizers.length;
	}
	SplitLayoutPrivate.averageSize = averageSize;

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
	SplitLayoutPrivate.normalize = normalize;

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
	SplitLayoutPrivate.growSizer = growSizer;

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
	SplitLayoutPrivate.shrinkSizer = shrinkSizer;

	var rectProperty = new phosphor_properties_1.Property({
		name: 'rect',
		create: function () { return ({ top: NaN, left: NaN, width: NaN, height: NaN }); },
	});

	function onChildPropertyChanged(child) {
		var parent = child.parent;
		var layout = parent && parent.layout;
		if (layout instanceof SplitLayout)
			parent.fit();
	}
})(SplitLayoutPrivate || (SplitLayoutPrivate = {}));

},{"phosphor-arrays":40,"phosphor-boxengine":3,"phosphor-domutil":17,"phosphor-messaging":27,"phosphor-panel":30,"phosphor-properties":34,"phosphor-widget":50}],39:[function(require,module,exports){

'use strict';
var __extends = (this && this.__extends) || function (d, b) {
	for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	function __() { this.constructor = d; }
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var phosphor_domutil_1 = require('phosphor-domutil');
var phosphor_panel_1 = require('phosphor-panel');
var layout_1 = require('./layout');

var SPLIT_PANEL_CLASS = 'p-SplitPanel';

var CHILD_CLASS = 'p-SplitPanel-child';

var HANDLE_CLASS = 'p-SplitPanel-handle';

var SplitPanel = (function (_super) {
	__extends(SplitPanel, _super);

	function SplitPanel() {
		_super.call(this);
		this._pressData = null;
		this.addClass(SPLIT_PANEL_CLASS);
	}

	SplitPanel.createLayout = function () {
		return new layout_1.SplitLayout(this);
	};

	SplitPanel.createHandle = function () {
		var handle = document.createElement('div');
		handle.className = HANDLE_CLASS;
		return handle;
	};

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

	SplitPanel.prototype.sizes = function () {
		return this.layout.sizes();
	};

	SplitPanel.prototype.setSizes = function (sizes) {
		this.layout.setSizes(sizes);
	};

	SplitPanel.prototype.handleAt = function (index) {
		return this.layout.handleAt(index);
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
			case 'keyup':
			case 'keypress':
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
		var _a = SplitPanelPrivate.findHandle(layout, target), index = _a.index, handle = _a.handle;
		if (index === -1) {
			return;
		}

		event.preventDefault();
		event.stopPropagation();

		document.addEventListener('mouseup', this, true);
		document.addEventListener('mousemove', this, true);
		document.addEventListener('keydown', this, true);
		document.addEventListener('keyup', this, true);
		document.addEventListener('keypress', this, true);
		document.addEventListener('contextmenu', this, true);

		var delta;
		var rect = handle.getBoundingClientRect();
		if (layout.orientation === layout_1.Orientation.Horizontal) {
			delta = event.clientX - rect.left;
		}
		else {
			delta = event.clientY - rect.top;
		}

		var style = window.getComputedStyle(handle);
		var override = phosphor_domutil_1.overrideCursor(style.cursor);
		this._pressData = { index: index, delta: delta, override: override };
	};

	SplitPanel.prototype._evtMouseMove = function (event) {

		event.preventDefault();
		event.stopPropagation();

		var pos;
		var layout = this.layout;
		var rect = this.node.getBoundingClientRect();
		if (layout.orientation === layout_1.Orientation.Horizontal) {
			pos = event.clientX - rect.left - this._pressData.delta;
		}
		else {
			pos = event.clientY - rect.top - this._pressData.delta;
		}

		layout.moveHandle(this._pressData.index, pos);
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
		document.removeEventListener('keyup', this, true);
		document.removeEventListener('keypress', this, true);
		document.removeEventListener('contextmenu', this, true);
	};
	return SplitPanel;
})(phosphor_panel_1.Panel);
exports.SplitPanel = SplitPanel;

var SplitPanel;
(function (SplitPanel) {

	SplitPanel.Horizontal = layout_1.Orientation.Horizontal;

	SplitPanel.Vertical = layout_1.Orientation.Vertical;

	function getStretch(widget) {
		return layout_1.SplitLayout.getStretch(widget);
	}
	SplitPanel.getStretch = getStretch;

	function setStretch(widget, value) {
		layout_1.SplitLayout.setStretch(widget, value);
	}
	SplitPanel.setStretch = setStretch;
})(SplitPanel = exports.SplitPanel || (exports.SplitPanel = {}));

var SplitPanelPrivate;
(function (SplitPanelPrivate) {

	function findHandle(layout, target) {
		for (var i = 0, n = layout.childCount(); i < n; ++i) {
			var handle = layout.handleAt(i);
			if (handle.contains(target)) {
				return { index: i, handle: handle };
			}
		}
		return { index: -1, handle: null };
	}
	SplitPanelPrivate.findHandle = findHandle;
})(SplitPanelPrivate || (SplitPanelPrivate = {}));

},{"./layout":38,"phosphor-domutil":17,"phosphor-panel":30}],40:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7}],41:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"./layout":42,"./panel":43,"dup":4}],42:[function(require,module,exports){

'use strict';
var __extends = (this && this.__extends) || function (d, b) {
	for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	function __() { this.constructor = d; }
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var phosphor_domutil_1 = require('phosphor-domutil');
var phosphor_messaging_1 = require('phosphor-messaging');
var phosphor_panel_1 = require('phosphor-panel');
var phosphor_properties_1 = require('phosphor-properties');
var phosphor_widget_1 = require('phosphor-widget');

var StackedLayout = (function (_super) {
	__extends(StackedLayout, _super);
	function StackedLayout() {
		_super.apply(this, arguments);
		this._box = null;
	}

	StackedLayout.prototype.attachChild = function (index, child) {
		StackedLayoutPrivate.prepareGeometry(child);
		this.parent.node.appendChild(child.node);
		if (this.parent.isAttached)
			phosphor_messaging_1.sendMessage(child, phosphor_widget_1.Widget.MsgAfterAttach);
		this.parent.fit();
	};

	StackedLayout.prototype.moveChild = function (fromIndex, toIndex, child) {
		this.parent.update();
	};

	StackedLayout.prototype.detachChild = function (index, child) {
		if (this.parent.isAttached)
			phosphor_messaging_1.sendMessage(child, phosphor_widget_1.Widget.MsgBeforeDetach);
		this.parent.node.removeChild(child.node);
		StackedLayoutPrivate.resetGeometry(child);
		child.node.style.zIndex = '';
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
		if (StackedLayoutPrivate.IsIE) {
			phosphor_messaging_1.sendMessage(this.parent, phosphor_widget_1.Widget.MsgFitRequest);
		}
		else {
			this.parent.fit();
		}
	};

	StackedLayout.prototype.onChildHidden = function (msg) {
		if (StackedLayoutPrivate.IsIE) {
			phosphor_messaging_1.sendMessage(this.parent, phosphor_widget_1.Widget.MsgFitRequest);
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

		for (var i = 0, n = this.childCount(); i < n; ++i) {
			var child = this.childAt(i);
			if (child.isHidden) {
				continue;
			}
			var limits = phosphor_domutil_1.sizeLimits(child.node);
			minW = Math.max(minW, limits.minWidth);
			minH = Math.max(minH, limits.minHeight);
			maxW = Math.min(maxW, limits.maxWidth);
			maxH = Math.min(maxH, limits.maxHeight);
		}

		maxW = Math.max(minW, maxW);
		maxH = Math.max(minH, maxH);

		var box = this._box = phosphor_domutil_1.boxSizing(this.parent.node);
		minW += box.horizontalSum;
		minH += box.verticalSum;
		maxW += box.horizontalSum;
		maxH += box.verticalSum;

		var style = this.parent.node.style;
		style.minWidth = minW + "px";
		style.minHeight = minH + "px";
		style.maxWidth = maxW === Infinity ? 'none' : maxW + "px";
		style.maxHeight = maxH === Infinity ? 'none' : maxH + "px";

		var ancestor = this.parent.parent;
		if (ancestor)
			phosphor_messaging_1.sendMessage(ancestor, phosphor_widget_1.Widget.MsgFitRequest);

		phosphor_messaging_1.sendMessage(this.parent, phosphor_widget_1.Widget.MsgUpdateRequest);
	};

	StackedLayout.prototype._update = function (offsetWidth, offsetHeight) {

		if (this.childCount() === 0) {
			return;
		}

		if (offsetWidth < 0) {
			offsetWidth = this.parent.node.offsetWidth;
		}
		if (offsetHeight < 0) {
			offsetHeight = this.parent.node.offsetHeight;
		}

		var box = this._box || (this._box = phosphor_domutil_1.boxSizing(this.parent.node));

		var top = box.paddingTop;
		var left = box.paddingLeft;
		var width = offsetWidth - box.horizontalSum;
		var height = offsetHeight - box.verticalSum;

		for (var i = 0, n = this.childCount(); i < n; ++i) {
			var child = this.childAt(i);
			if (child.isHidden) {
				continue;
			}
			child.node.style.zIndex = "" + i;
			StackedLayoutPrivate.setGeometry(child, left, top, width, height);
		}
	};
	return StackedLayout;
})(phosphor_panel_1.PanelLayout);
exports.StackedLayout = StackedLayout;

var StackedLayoutPrivate;
(function (StackedLayoutPrivate) {

	StackedLayoutPrivate.IsIE = /Trident/.test(navigator.userAgent);

	function prepareGeometry(widget) {
		widget.node.style.position = 'absolute';
	}
	StackedLayoutPrivate.prepareGeometry = prepareGeometry;

	function resetGeometry(widget) {
		var rect = rectProperty.get(widget);
		var style = widget.node.style;
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
	StackedLayoutPrivate.resetGeometry = resetGeometry;

	function setGeometry(widget, left, top, width, height) {
		var resized = false;
		var style = widget.node.style;
		var rect = rectProperty.get(widget);
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
			phosphor_messaging_1.sendMessage(widget, new phosphor_widget_1.ResizeMessage(width, height));
		}
	}
	StackedLayoutPrivate.setGeometry = setGeometry;

	var rectProperty = new phosphor_properties_1.Property({
		name: 'rect',
		create: function () { return ({ top: NaN, left: NaN, width: NaN, height: NaN }); },
	});
})(StackedLayoutPrivate || (StackedLayoutPrivate = {}));

},{"phosphor-domutil":17,"phosphor-messaging":27,"phosphor-panel":30,"phosphor-properties":34,"phosphor-widget":50}],43:[function(require,module,exports){

'use strict';
var __extends = (this && this.__extends) || function (d, b) {
	for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	function __() { this.constructor = d; }
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var phosphor_panel_1 = require('phosphor-panel');
var phosphor_signaling_1 = require('phosphor-signaling');
var layout_1 = require('./layout');

var STACKED_PANEL_CLASS = 'p-StackedPanel';

var CHILD_CLASS = 'p-StackedPanel-child';

var StackedPanel = (function (_super) {
	__extends(StackedPanel, _super);

	function StackedPanel() {
		_super.call(this);
		this.addClass(STACKED_PANEL_CLASS);
	}

	StackedPanel.createLayout = function () {
		return new layout_1.StackedLayout();
	};
	Object.defineProperty(StackedPanel.prototype, "widgetRemoved", {

		get: function () {
			return StackedPanelPrivate.widgetRemovedSignal.bind(this);
		},
		enumerable: true,
		configurable: true
	});

	StackedPanel.prototype.onChildAdded = function (msg) {
		msg.child.addClass(CHILD_CLASS);
	};

	StackedPanel.prototype.onChildRemoved = function (msg) {
		msg.child.removeClass(CHILD_CLASS);
		this.widgetRemoved.emit(msg.child);
	};
	return StackedPanel;
})(phosphor_panel_1.Panel);
exports.StackedPanel = StackedPanel;

var StackedPanelPrivate;
(function (StackedPanelPrivate) {

	StackedPanelPrivate.widgetRemovedSignal = new phosphor_signaling_1.Signal();
})(StackedPanelPrivate || (StackedPanelPrivate = {}));

},{"./layout":42,"phosphor-panel":30,"phosphor-signaling":35}],44:[function(require,module,exports){
var css = ".p-TabBar{display:flex;flex-direction:column}.p-TabBar-footer,.p-TabBar-header{flex:0 0 auto}.p-TabBar-body{display:flex;flex-direction:row;flex:1 1 auto}.p-TabBar-content{display:flex;flex-direction:row;flex:1 1 auto;margin:0;padding:0;list-style-type:none}.p-TabBar-tab{display:flex;flex-direction:row;box-sizing:border-box;overflow:hidden}.p-TabBar-tabCloseIcon,.p-TabBar-tabIcon{flex:0 0 auto}.p-TabBar-tabText{flex:1 1 auto;overflow:hidden;white-space:nowrap}.p-TabBar.p-mod-dragging .p-TabBar-tab{position:relative;left:0;transition:left 150ms ease}.p-TabBar.p-mod-dragging .p-TabBar-tab.p-mod-dragging{transition:none}.p-TabPanel-tabBar{z-index:1}.p-TabPanel-stackedPanel{z-index:0}"; (require("browserify-css").createStyle(css, { "href": "node_modules\\phosphor-tabs\\lib\\index.css"})); module.exports = css;
},{"browserify-css":2}],45:[function(require,module,exports){

'use strict';
function __export(m) {
	for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(require('./tabbar'));
__export(require('./tabpanel'));
require('./index.css');

},{"./index.css":44,"./tabbar":46,"./tabpanel":47}],46:[function(require,module,exports){

'use strict';
var __extends = (this && this.__extends) || function (d, b) {
	for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	function __() { this.constructor = d; }
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var arrays = require('phosphor-arrays');
var phosphor_domutil_1 = require('phosphor-domutil');
var phosphor_signaling_1 = require('phosphor-signaling');
var phosphor_widget_1 = require('phosphor-widget');

var TAB_BAR_CLASS = 'p-TabBar';

var BODY_CLASS = 'p-TabBar-body';

var HEADER_CLASS = 'p-TabBar-header';

var CONTENT_CLASS = 'p-TabBar-content';

var FOOTER_CLASS = 'p-TabBar-footer';

var TAB_CLASS = 'p-TabBar-tab';

var TEXT_CLASS = 'p-TabBar-tabText';

var ICON_CLASS = 'p-TabBar-tabIcon';

var CLOSE_CLASS = 'p-TabBar-tabCloseIcon';

var DRAGGING_CLASS = 'p-mod-dragging';

var CURRENT_CLASS = 'p-mod-current';

var CLOSABLE_CLASS = 'p-mod-closable';

var DRAG_THRESHOLD = 5;

var DETACH_THRESHOLD = 20;

var TRANSITION_DURATION = 150;

var TabBar = (function (_super) {
	__extends(TabBar, _super);

	function TabBar() {
		_super.call(this);
		this._tabsMovable = false;
		this._items = [];
		this._tabs = [];
		this._dirtySet = new Set();
		this._currentItem = null;
		this._dragData = null;
		this.addClass(TAB_BAR_CLASS);
	}

	TabBar.createNode = function () {
		var node = document.createElement('div');
		var header = document.createElement('div');
		var body = document.createElement('div');
		var footer = document.createElement('div');
		var content = document.createElement('ul');
		header.className = HEADER_CLASS;
		body.className = BODY_CLASS;
		footer.className = FOOTER_CLASS;
		content.className = CONTENT_CLASS;
		body.appendChild(content);
		node.appendChild(header);
		node.appendChild(body);
		node.appendChild(footer);
		return node;
	};

	TabBar.createTab = function (title) {
		var node = document.createElement('li');
		var icon = document.createElement('span');
		var text = document.createElement('span');
		var close = document.createElement('span');
		node.className = TAB_CLASS;
		icon.className = ICON_CLASS;
		text.className = TEXT_CLASS;
		close.className = CLOSE_CLASS;
		node.appendChild(icon);
		node.appendChild(text);
		node.appendChild(close);
		this.updateTab(node, title);
		return node;
	};

	TabBar.updateTab = function (tab, title) {
		var tabInfix = title.className ? ' ' + title.className : '';
		var tabSuffix = title.closable ? ' ' + CLOSABLE_CLASS : '';
		var iconSuffix = title.icon ? ' ' + title.icon : '';
		var icon = tab.firstChild;
		var text = icon.nextSibling;
		tab.className = TAB_CLASS + tabInfix + tabSuffix;
		icon.className = ICON_CLASS + iconSuffix;
		text.textContent = title.text;
	};

	TabBar.tabCloseIcon = function (tab) {
		return tab.lastChild;
	};

	TabBar.prototype.dispose = function () {
		this._releaseMouse();
		this._tabs.length = 0;
		this._items.length = 0;
		this._dirtySet.clear();
		this._currentItem = null;
		_super.prototype.dispose.call(this);
	};
	Object.defineProperty(TabBar.prototype, "currentChanged", {

		get: function () {
			return TabBarPrivate.currentChangedSignal.bind(this);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(TabBar.prototype, "tabMoved", {

		get: function () {
			return TabBarPrivate.tabMovedSignal.bind(this);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(TabBar.prototype, "tabCloseRequested", {

		get: function () {
			return TabBarPrivate.tabCloseRequestedSignal.bind(this);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(TabBar.prototype, "tabDetachRequested", {

		get: function () {
			return TabBarPrivate.tabDetachRequestedSignal.bind(this);
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(TabBar.prototype, "currentItem", {

		get: function () {
			return this._currentItem;
		},

		set: function (value) {
			var item = value || null;
			if (this._currentItem === item) {
				return;
			}
			var index = item ? this._items.indexOf(item) : -1;
			if (item && index === -1) {
				console.warn('Tab item not contained in tab bar.');
				return;
			}
			this._currentItem = item;
			this.currentChanged.emit({ index: index, item: item });
			this.update();
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
	Object.defineProperty(TabBar.prototype, "footerNode", {

		get: function () {
			return this.node.getElementsByClassName(FOOTER_CLASS)[0];
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

	TabBar.prototype.itemCount = function () {
		return this._items.length;
	};

	TabBar.prototype.itemAt = function (index) {
		return this._items[index];
	};

	TabBar.prototype.itemIndex = function (item) {
		return this._items.indexOf(item);
	};

	TabBar.prototype.addItem = function (item) {
		this.insertItem(this.itemCount(), item);
	};

	TabBar.prototype.insertItem = function (index, item) {
		this._releaseMouse();
		var n = this._items.length;
		var i = this._items.indexOf(item);
		var j = Math.max(0, Math.min(index | 0, n));
		if (i !== -1) {
			if (j === n)
				j--;
			if (i === j)
				return;
			arrays.move(this._tabs, i, j);
			arrays.move(this._items, i, j);
			this.contentNode.insertBefore(this._tabs[j], this._tabs[j + 1]);
		}
		else {
			var tab = this.constructor.createTab(item.title);
			arrays.insert(this._tabs, j, tab);
			arrays.insert(this._items, j, item);
			this.contentNode.insertBefore(tab, this._tabs[j + 1]);
			item.title.changed.connect(this._onTitleChanged, this);
			if (!this.currentItem)
				this.currentItem = item;
		}
		this.update();
	};

	TabBar.prototype.removeItem = function (item) {
		this._releaseMouse();
		var i = arrays.remove(this._items, item);
		if (i === -1) {
			return;
		}
		this._dirtySet.delete(item.title);
		item.title.changed.disconnect(this._onTitleChanged, this);
		this.contentNode.removeChild(arrays.removeAt(this._tabs, i));
		if (this.currentItem === item) {
			var next = this._items[i];
			var prev = this._items[i - 1];
			this.currentItem = next || prev;
		}
		this.update();
	};

	TabBar.prototype.tabAt = function (index) {
		return this._tabs[index];
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
		var tabs = this._tabs;
		var items = this._items;
		var dirty = this._dirtySet;
		var current = this._currentItem;
		var constructor = this.constructor;
		for (var i = 0, n = tabs.length; i < n; ++i) {
			var tab = tabs[i];
			var item = items[i];
			if (dirty.has(item.title)) {
				constructor.updateTab(tab, item.title);
			}
			if (item === current) {
				tab.classList.add(CURRENT_CLASS);
				tab.style.zIndex = "" + n;
			}
			else {
				tab.classList.remove(CURRENT_CLASS);
				tab.style.zIndex = "" + (n - i - 1);
			}
		}
		dirty.clear();
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

		var x = event.clientX;
		var y = event.clientY;
		var i = arrays.findIndex(this._tabs, function (tab) { return phosphor_domutil_1.hitTest(tab, x, y); });
		if (i < 0) {
			return;
		}

		event.preventDefault();
		event.stopPropagation();

		var item = this._items[i];
		if (!item.title.closable) {
			return;
		}

		var constructor = this.constructor;
		var icon = constructor.tabCloseIcon(this._tabs[i]);
		if (!icon.contains(event.target)) {
			return;
		}

		this.tabCloseRequested.emit({ index: i, item: item });
	};

	TabBar.prototype._evtMouseDown = function (event) {

		if (event.button !== 0) {
			return;
		}

		if (this._dragData) {
			return;
		}

		var x = event.clientX;
		var y = event.clientY;
		var i = arrays.findIndex(this._tabs, function (tab) { return phosphor_domutil_1.hitTest(tab, x, y); });
		if (i < 0) {
			return;
		}

		event.preventDefault();
		event.stopPropagation();

		var constructor = this.constructor;
		var icon = constructor.tabCloseIcon(this._tabs[i]);
		if (icon.contains(event.target)) {
			return;
		}

		if (this._tabsMovable) {
			this._dragData = new TabBarPrivate.DragData();
			this._dragData.index = i;
			this._dragData.tab = this._tabs[i];
			this._dragData.pressX = event.clientX;
			this._dragData.pressY = event.clientY;
			document.addEventListener('mousemove', this, true);
			document.addEventListener('mouseup', this, true);
			document.addEventListener('keydown', this, true);
			document.addEventListener('contextmenu', this, true);
		}

		this.currentItem = this._items[i];
	};

	TabBar.prototype._evtMouseMove = function (event) {

		if (!this._dragData) {
			return;
		}

		event.preventDefault();
		event.stopPropagation();

		var data = this._dragData;
		if (!data.dragActive) {
			var dx = Math.abs(event.clientX - data.pressX);
			var dy = Math.abs(event.clientY - data.pressY);
			if (dx < DRAG_THRESHOLD && dy < DRAG_THRESHOLD) {
				return;
			}

			var tabRect = data.tab.getBoundingClientRect();
			data.tabLeft = data.tab.offsetLeft;
			data.tabWidth = tabRect.width;
			data.tabPressX = data.pressX - tabRect.left;
			data.tabLayout = TabBarPrivate.snapTabLayout(this._tabs);
			data.contentRect = this.contentNode.getBoundingClientRect();
			data.override = phosphor_domutil_1.overrideCursor('default');

			data.tab.classList.add(DRAGGING_CLASS);
			this.addClass(DRAGGING_CLASS);
			data.dragActive = true;
		}

		if (!data.detachRequested && TabBarPrivate.detachExceeded(data, event)) {
			data.detachRequested = true;
			var index = data.index;
			var item = this._items[index];
			var clientX = event.clientX;
			var clientY = event.clientY;
			this.tabDetachRequested.emit({ index: index, item: item, clientX: clientX, clientY: clientY });
			if (data.dragAborted) {
				return;
			}
		}

		TabBarPrivate.layoutTabs(this._tabs, data, event);
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

		TabBarPrivate.finalizeTabPosition(data);

		data.tab.classList.remove(DRAGGING_CLASS);

		setTimeout(function () {

			if (data.dragAborted) {
				return;
			}

			_this._dragData = null;

			TabBarPrivate.resetTabPositions(_this._tabs);

			data.override.dispose();
			_this.removeClass(DRAGGING_CLASS);

			var i = data.index;
			var j = data.targetIndex;
			if (j === -1 || i === j) {
				return;
			}

			arrays.move(_this._tabs, i, j);
			arrays.move(_this._items, i, j);
			_this.contentNode.insertBefore(_this._tabs[j], _this._tabs[j + 1]);

			_this.tabMoved.emit({ fromIndex: i, toIndex: j, item: _this._items[j] });
			_this.update();
		}, TRANSITION_DURATION);
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

		TabBarPrivate.resetTabPositions(this._tabs);

		data.override.dispose();
		data.tab.classList.remove(DRAGGING_CLASS);
		this.removeClass(DRAGGING_CLASS);
	};

	TabBar.prototype._onTitleChanged = function (sender) {
		this._dirtySet.add(sender);
		this.update();
	};
	return TabBar;
})(phosphor_widget_1.Widget);
exports.TabBar = TabBar;

var TabBarPrivate;
(function (TabBarPrivate) {

	TabBarPrivate.currentChangedSignal = new phosphor_signaling_1.Signal();

	TabBarPrivate.tabMovedSignal = new phosphor_signaling_1.Signal();

	TabBarPrivate.tabCloseRequestedSignal = new phosphor_signaling_1.Signal();

	TabBarPrivate.tabDetachRequestedSignal = new phosphor_signaling_1.Signal();

	var DragData = (function () {
		function DragData() {

			this.tab = null;

			this.index = -1;

			this.tabLeft = -1;

			this.tabWidth = -1;

			this.tabPressX = -1;

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
	})();
	TabBarPrivate.DragData = DragData;

	function snapTabLayout(tabs) {
		var layout = new Array(tabs.length);
		for (var i = 0, n = tabs.length; i < n; ++i) {
			var node = tabs[i];
			var left = node.offsetLeft;
			var width = node.offsetWidth;
			var cstyle = window.getComputedStyle(node);
			var margin = parseInt(cstyle.marginLeft, 10) || 0;
			layout[i] = { margin: margin, left: left, width: width };
		}
		return layout;
	}
	TabBarPrivate.snapTabLayout = snapTabLayout;

	function detachExceeded(data, event) {
		var rect = data.contentRect;
		return ((event.clientX < rect.left - DETACH_THRESHOLD) ||
			(event.clientX >= rect.right + DETACH_THRESHOLD) ||
			(event.clientY < rect.top - DETACH_THRESHOLD) ||
			(event.clientY >= rect.bottom + DETACH_THRESHOLD));
	}
	TabBarPrivate.detachExceeded = detachExceeded;

	function layoutTabs(tabs, data, event) {
		var targetIndex = data.index;
		var targetLeft = event.clientX - data.contentRect.left - data.tabPressX;
		var targetRight = targetLeft + data.tabWidth;
		for (var i = 0, n = tabs.length; i < n; ++i) {
			var style = tabs[i].style;
			var layout = data.tabLayout[i];
			var threshold = layout.left + (layout.width >> 1);
			if (i < data.index && targetLeft < threshold) {
				style.left = data.tabWidth + data.tabLayout[i + 1].margin + 'px';
				targetIndex = Math.min(targetIndex, i);
			}
			else if (i > data.index && targetRight > threshold) {
				style.left = -data.tabWidth - layout.margin + 'px';
				targetIndex = Math.max(targetIndex, i);
			}
			else if (i === data.index) {
				var ideal = event.clientX - data.pressX;
				var limit = data.contentRect.width - (data.tabLeft + data.tabWidth);
				style.left = Math.max(-data.tabLeft, Math.min(ideal, limit)) + 'px';
			}
			else {
				style.left = '';
			}
		}
		data.targetIndex = targetIndex;
	}
	TabBarPrivate.layoutTabs = layoutTabs;

	function finalizeTabPosition(data) {
		var ideal;
		if (data.targetIndex === data.index) {
			ideal = 0;
		}
		else if (data.targetIndex > data.index) {
			var tgt = data.tabLayout[data.targetIndex];
			ideal = tgt.left + tgt.width - data.tabWidth - data.tabLeft;
		}
		else {
			var tgt = data.tabLayout[data.targetIndex];
			ideal = tgt.left - data.tabLeft;
		}
		var style = data.tab.style;
		var limit = data.contentRect.width - (data.tabLeft + data.tabWidth);
		style.left = Math.max(-data.tabLeft, Math.min(ideal, limit)) + 'px';
	}
	TabBarPrivate.finalizeTabPosition = finalizeTabPosition;

	function resetTabPositions(tabs) {
		for (var i = 0, n = tabs.length; i < n; ++i) {
			tabs[i].style.left = '';
		}
	}
	TabBarPrivate.resetTabPositions = resetTabPositions;
})(TabBarPrivate || (TabBarPrivate = {}));

},{"phosphor-arrays":48,"phosphor-domutil":17,"phosphor-signaling":35,"phosphor-widget":50}],47:[function(require,module,exports){

'use strict';
var __extends = (this && this.__extends) || function (d, b) {
	for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	function __() { this.constructor = d; }
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var phosphor_boxpanel_1 = require('phosphor-boxpanel');
var phosphor_stackedpanel_1 = require('phosphor-stackedpanel');
var phosphor_widget_1 = require('phosphor-widget');
var tabbar_1 = require('./tabbar');

var TAB_PANEL_CLASS = 'p-TabPanel';

var TAB_BAR_CLASS = 'p-TabPanel-tabBar';

var STACKED_PANEL_CLASS = 'p-TabPanel-stackedPanel';

var TabPanel = (function (_super) {
	__extends(TabPanel, _super);

	function TabPanel() {
		_super.call(this);
		this._currentWidget = null;
		this.addClass(TAB_PANEL_CLASS);
		var constructor = this.constructor;
		this._tabBar = constructor.createTabBar();
		this._stackedPanel = constructor.createStackedPanel();
		this._tabBar.tabMoved.connect(this._onTabMoved, this);
		this._tabBar.currentChanged.connect(this._onCurrentChanged, this);
		this._tabBar.tabCloseRequested.connect(this._onTabCloseRequested, this);
		this._stackedPanel.widgetRemoved.connect(this._onWidgetRemoved, this);
		var layout = new phosphor_boxpanel_1.BoxLayout();
		layout.direction = phosphor_boxpanel_1.BoxLayout.TopToBottom;
		layout.spacing = 0;
		phosphor_boxpanel_1.BoxLayout.setStretch(this._tabBar, 0);
		phosphor_boxpanel_1.BoxLayout.setStretch(this._stackedPanel, 1);
		layout.addChild(this._tabBar);
		layout.addChild(this._stackedPanel);
		this.layout = layout;
	}

	TabPanel.createTabBar = function () {
		var tabBar = new tabbar_1.TabBar();
		tabBar.addClass(TAB_BAR_CLASS);
		return tabBar;
	};

	TabPanel.createStackedPanel = function () {
		var stackedPanel = new phosphor_stackedpanel_1.StackedPanel();
		stackedPanel.addClass(STACKED_PANEL_CLASS);
		return stackedPanel;
	};

	TabPanel.prototype.dispose = function () {
		this._tabBar = null;
		this._stackedPanel = null;
		this._currentWidget = null;
		_super.prototype.dispose.call(this);
	};
	Object.defineProperty(TabPanel.prototype, "currentWidget", {

		get: function () {
			return this._tabBar.currentItem;
		},

		set: function (value) {
			this._tabBar.currentItem = value;
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

	TabPanel.prototype.childCount = function () {
		return this._stackedPanel.childCount();
	};

	TabPanel.prototype.childAt = function (index) {
		return this._stackedPanel.childAt(index);
	};

	TabPanel.prototype.childIndex = function (child) {
		return this._stackedPanel.childIndex(child);
	};

	TabPanel.prototype.addChild = function (child) {
		this.insertChild(this.childCount(), child);
	};

	TabPanel.prototype.insertChild = function (index, child) {
		if (child !== this._currentWidget)
			child.hide();
		this._stackedPanel.insertChild(index, child);
		this._tabBar.insertItem(index, child);
	};

	TabPanel.prototype._onCurrentChanged = function (sender, args) {
		var oldWidget = this._currentWidget;
		var newWidget = args.item;
		if (oldWidget === newWidget)
			return;
		this._currentWidget = newWidget;
		if (oldWidget)
			oldWidget.hide();
		if (newWidget)
			newWidget.show();
	};

	TabPanel.prototype._onTabCloseRequested = function (sender, args) {
		args.item.close();
	};

	TabPanel.prototype._onTabMoved = function (sender, args) {
		this._stackedPanel.insertChild(args.toIndex, args.item);
	};

	TabPanel.prototype._onWidgetRemoved = function (sender, widget) {
		if (this._currentWidget === widget)
			this._currentWidget = null;
		this._tabBar.removeItem(widget);
	};
	return TabPanel;
})(phosphor_widget_1.Widget);
exports.TabPanel = TabPanel;

},{"./tabbar":46,"phosphor-boxpanel":4,"phosphor-stackedpanel":41,"phosphor-widget":50}],48:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7}],49:[function(require,module,exports){
var css = ".p-Widget{box-sizing:border-box;position:relative;overflow:hidden;cursor:default;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.p-Widget.p-mod-hidden{display:none}"; (require("browserify-css").createStyle(css, { "href": "node_modules\\phosphor-widget\\lib\\index.css"})); module.exports = css;
},{"browserify-css":2}],50:[function(require,module,exports){

'use strict';
function __export(m) {
	for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(require('./layout'));
__export(require('./title'));
__export(require('./widget'));
require('./index.css');

},{"./index.css":49,"./layout":51,"./title":52,"./widget":53}],51:[function(require,module,exports){

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

},{"./widget":53,"phosphor-messaging":27,"phosphor-properties":34,"phosphor-signaling":35}],52:[function(require,module,exports){

'use strict';
var phosphor_properties_1 = require('phosphor-properties');
var phosphor_signaling_1 = require('phosphor-signaling');

var Title = (function () {

	function Title(options) {
		if (options)
			TitlePrivate.initFrom(this, options);
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

	function initFrom(title, options) {
		if (options.text !== void 0) {
			title.text = options.text;
		}
		if (options.icon !== void 0) {
			title.icon = options.icon;
		}
		if (options.closable !== void 0) {
			title.closable = options.closable;
		}
		if (options.className !== void 0) {
			title.className = options.className;
		}
	}
	TitlePrivate.initFrom = initFrom;
})(TitlePrivate || (TitlePrivate = {}));

},{"phosphor-properties":34,"phosphor-signaling":35}],53:[function(require,module,exports){

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
			if (this._parent && !this._parent.isDisposed) {
				phosphor_messaging_1.sendMessage(this._parent, new ChildMessage('child-added', this));
			}
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

	Widget.prototype.setHidden = function (hidden) {
		if (hidden) {
			this.hide();
		}
		else {
			this.show();
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

	Widget.prototype.onChildAdded = function (msg) { };

	Widget.prototype.onChildRemoved = function (msg) { };
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

},{"./title":52,"phosphor-messaging":27,"phosphor-nodewrapper":29,"phosphor-properties":34,"phosphor-signaling":35}]},{},[1]);