/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Button = __webpack_require__(1);
	var vcomponent = __webpack_require__(3);
	
	var Main = vcomponent.Component.extends(
	    {
	        tpl: __webpack_require__(36),
	        componentClasses: [Button],
	        literalAttrReady: function () {
	            this.setData({
	                click: function () {
	                    alert('click');
	                }
	            });
	        }
	    },
	    {
	        $name: 'Main'
	    }
	);
	
	var main = document.getElementById('main');
	vcomponent.mount(
	    {
	        config: new vcomponent.Config(),
	        startNode: main,
	        endNode: main
	    },
	    [Main]
	);
	


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Control = __webpack_require__(2);
	
	module.exports = Control.extends(
	    {
	        tpl: __webpack_require__(30)
	    },
	    {
	        $name: 'Button',
	
	        getStyle: function () {
	            return __webpack_require__(31)[0][1];
	        }
	    }
	);


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var vcomponent = __webpack_require__(3);
	
	module.exports = vcomponent.Component.extends({}, {$name: 'Control'});


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(34);
	var ComponentTree = __webpack_require__(4);
	var domDataBind = __webpack_require__(17);
	
	module.exports = {
	    Component: __webpack_require__(28),
	    mount: function (options, ComponentClasses) {
	        var tree = new ComponentTree(options);
	        tree.registeComponents(ComponentClasses);
	        tree.traverse();
	        return tree;
	    },
	    Config: domDataBind.Config
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Tree = __webpack_require__(5);
	var ComponentParser = __webpack_require__(14);
	var Event = __webpack_require__(11);
	var utils = __webpack_require__(6);
	var ComponentManager = __webpack_require__(16);
	
	module.exports = Tree.extends({
	
	    initialize: function (options) {
	        Tree.prototype.initialize.apply(this, arguments);
	
	        this.componentEvent = new Event();
	        if (options.componentChildren) {
	            this.setTreeVar('componentChildren', options.componentChildren);
	        }
	
	        var componentManager = new ComponentManager();
	        componentManager.setParent(this.getTreeVar('componentManager'));
	        this.setTreeVar('componentManager', componentManager);
	    },
	
	    createParser: function (ParserClass, options) {
	        var instance = Tree.prototype.createParser.apply(this, arguments);
	
	        if (instance && ParserClass === ComponentParser) {
	            instance.parser.setComponentEvent(this.componentEvent);
	        }
	
	        return instance;
	    },
	
	    /**
	     * 注册组件类
	     * 设置绑定在树上面的额外变量。这些变量有如下特性：
	     * 1、无法覆盖；
	     * 2、在获取treeVars上面某个变量的时候，如果当前树取出来是undefined，那么就会到父级树的treeVars上去找，以此类推。
	     *
	     * @public
	     * @param  {Map.<string, Component>} componentClasses 组件名和组件类的映射
	     * @param {string} name  变量名
	     * @param {*} value 变量值
	     */
	    registeComponents: function (componentClasses) {
	        if (!utils.isArray(componentClasses)) {
	            return;
	        }
	
	        var componentManager = this.getTreeVar('componentManager');
	
	        for (var i = 0, il = componentClasses.length; i < il; ++i) {
	            var componentClass = componentClasses[i];
	            componentManager.registe(componentClass);
	        }
	    }
	}, {
	    $name: 'ComponentTree'
	});


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file 最终的树
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */
	
	var utils = __webpack_require__(6);
	var ExprCalculater = __webpack_require__(7);
	var DomUpdater = __webpack_require__(8);
	var ScopeModel = __webpack_require__(10);
	var Base = __webpack_require__(13);
	
	var ParserClasses = [];
	
	module.exports = Base.extends(
	    {
	        initialize: function (options) {
	            Base.prototype.initialize.apply(this, arguments);
	
	            this.startNode = options.startNode;
	            this.endNode = options.endNode;
	            this.config = options.config;
	
	            this.exprCalculater = options.exprCalculater || new ExprCalculater();
	            this.domUpdater = options.domUpdater || new DomUpdater();
	            this.dirtyChecker = options.dirtyChecker;
	
	            this.tree = [];
	            this.treeVars = {};
	
	            this.rootScope = new ScopeModel();
	        },
	
	        /**
	         * 设置绑定在树上面的额外变量。这些变量有如下特性：
	         * 1、无法覆盖；
	         * 2、在获取treeVars上面某个变量的时候，如果当前树取出来是undefined，那么就会到父级树的treeVars上去找，以此类推。
	         *
	         * @public
	         * @param {string} name  变量名
	         * @param {*} value 变量值
	         * @return {boolean} 是否设置成功
	         */
	        setTreeVar: function (name, value) {
	            if (this.treeVars[name] !== undefined) {
	                return false;
	            }
	            this.treeVars[name] = value;
	            return true;
	        },
	
	        unsetTreeVar: function (name) {
	            this.treeVars[name] = undefined;
	        },
	
	        /**
	         * 获取绑定到树上的额外变量
	         *
	         * @public
	         * @param  {string} name                  变量名
	         * @param  {boolean=} shouldNotFindInParent 如果在当前树中没找到，是否到父级树中去找。
	         *                                         true就代表不去，false就代表要去
	         * @return {*}
	         */
	        getTreeVar: function (name, shouldNotFindInParent) {
	            var val = this.treeVars[name];
	            if (!shouldNotFindInParent
	                && val === undefined
	                && this.$parent !== undefined
	            ) {
	                val = this.$parent.getTreeVar(name);
	            }
	            return val;
	        },
	
	        setParent: function (parent) {
	            this.$parent = parent;
	        },
	
	        getScopeByName: function (name) {
	            var scopes = this.getTreeVar('scopes');
	            if (!scopes) {
	                return;
	            }
	            return scopes[name];
	        },
	
	        traverse: function () {
	            walkDom(this, this.startNode, this.endNode, this.tree, this.rootScope);
	        },
	
	        setData: function (data) {
	            data = data || {};
	            this.rootScope.set(data);
	        },
	
	        goDark: function () {
	            utils.traverseNoChangeNodes(this.startNode, this.endNode, function (curNode) {
	                if (curNode.nodeType === 1 || curNode.nodeType === 3) {
	                    utils.goDark(curNode);
	                }
	            }, this);
	        },
	
	        restoreFromDark: function () {
	            utils.traverseNoChangeNodes(this.startNode, this.endNode, function (curNode) {
	                if (curNode.nodeType === 1 || curNode.nodeType === 3) {
	                    utils.restoreFromDark(curNode);
	                }
	            }, this);
	        },
	
	        setDirtyChecker: function (dirtyChecker) {
	            this.dirtyChecker = dirtyChecker;
	        },
	
	        destroy: function () {
	            walk(this.tree);
	
	            this.startNode = null;
	            this.endNode = null;
	            this.config = null;
	
	            this.exprCalculater.destroy();
	            this.exprCalculater = null;
	
	            this.domUpdater.destroy();
	            this.domUpdater = null;
	
	            this.tree = null;
	            this.treeVars = null;
	
	            if (this.dirtyChecker) {
	                this.dirtyChecker.destroy();
	                this.dirtyChecker = null;
	            }
	
	            function walk(parserObjs) {
	                utils.each(parserObjs, function (curParserObj) {
	                    curParserObj.parser.destroy();
	
	                    if (curParserObj.children && curParserObj.children.length) {
	                        walk(curParserObj.children);
	                    }
	                });
	            }
	        },
	
	        /**
	         * 创建解析器实例，其返回值的结构为：
	         * {
	         *     parser: ...,
	         *     collectResult: ...
	         * }
	         *
	         * 返回值存在如下几种情况：
	         *
	         * 1、如果 parser 属性存在且 collectResult 为 true ，则说明当前解析器解析了所有相应的节点（包括起止节点间的节点、当前节点和子孙节点）；
	         * 2、直接返回假值或者 parser 不存在，说明没有处理任何节点，当前节点不属于当前解析器处理；
	         * 3、parser 存在且 collectResult 为数组，结构如下：
	         *     [
	         *         {
	         *             startNode: Node.<...>,
	         *             endNode: Node.<...>
	         *         }
	         *     ]
	         *
	         *  则说明当前是带有很多分支的节点，要依次解析数组中每个元素指定的节点范围。
	         *  而且，该解析器对应的 setData() 方法将会返回整数，指明使用哪一个分支的节点。
	         *
	         * @inner
	         * @param {Constructor} ParserClass parser 类
	         * @param  {Object} options 初始化参数
	         * @return {Object}         返回值
	         */
	        createParser: function (ParserClass, options) {
	            var startNode = options.startNode || options.node;
	            if (!ParserClass.isProperNode(startNode, options.config)) {
	                return;
	            }
	
	            var endNode;
	            if (ParserClass.findEndNode) {
	                endNode = ParserClass.findEndNode(startNode, options.config);
	
	                if (!endNode) {
	                    throw ParserClass.getNoEndNodeError();
	                }
	                else if (endNode.parentNode !== startNode.parentNode) {
	                    throw new Error('the relationship between start node and end node is not brotherhood!');
	                }
	            }
	
	            var parser = new ParserClass(utils.extend(options, {
	                endNode: endNode
	            }));
	
	            return {
	                parser: parser,
	                endNode: endNode || options.node
	            };
	        }
	    },
	    {
	        /**
	         * 注册一下解析器类。
	         *
	         * @param  {Constructor} ParserClass 解析器类
	         */
	        registeParser: function (ParserClass) {
	            var isExitsChildClass = false;
	            utils.each(ParserClasses, function (PC, index) {
	                if (utils.isSubClassOf(PC, ParserClass)) {
	                    isExitsChildClass = true;
	                }
	                else if (utils.isSubClassOf(ParserClass, PC)) {
	                    ParserClasses[index] = ParserClass;
	                    isExitsChildClass = true;
	                }
	
	                return isExitsChildClass;
	            });
	
	            if (!isExitsChildClass) {
	                ParserClasses.push(ParserClass);
	            }
	        },
	
	        $name: 'Tree'
	    }
	);
	
	
	function walkDom(tree, startNode, endNode, container, scopeModel) {
	    if (startNode === endNode) {
	        add(startNode);
	        return;
	    }
	
	    for (var curNode = startNode; curNode;) {
	        curNode = add(curNode);
	    }
	
	    function add(curNode) {
	        if (!curNode) {
	            return;
	        }
	
	        var options = {
	            startNode: curNode,
	            node: curNode,
	            config: tree.config,
	            exprCalculater: tree.exprCalculater,
	            domUpdater: tree.domUpdater,
	            tree: tree
	        };
	
	        var parserObj;
	
	        utils.each(ParserClasses, function (ParserClass) {
	            parserObj = tree.createParser(ParserClass, options);
	            if (!parserObj || !parserObj.parser) {
	                return;
	            }
	            parserObj.collectResult = parserObj.parser.collectExprs();
	
	            parserObj.parser.setScope(scopeModel);
	
	            if (utils.isArray(parserObj.collectResult)) {
	                var branches = parserObj.collectResult;
	                container.push({parser: parserObj.parser, children: branches});
	                utils.each(branches, function (branch, i) {
	                    if (!branch.startNode || !branch.endNode) {
	                        return;
	                    }
	
	                    var con = [];
	                    walkDom(tree, branch.startNode, branch.endNode, con, parserObj.parser.getScope());
	                    branches[i] = con;
	                }, this);
	
	                if (parserObj.endNode !== endNode) {
	                    curNode = parserObj.parser.getEndNode().nextSibling;
	                }
	                else {
	                    curNode = null;
	                }
	            }
	            else {
	                var con = [];
	                container.push({parser: parserObj.parser, children: con});
	                if (curNode.nodeType === 1 && curNode.childNodes.length) {
	                    walkDom(tree, curNode.firstChild, curNode.lastChild, con, parserObj.parser.getScope());
	                }
	
	                if (curNode !== endNode) {
	                    curNode = parserObj.parser.getEndNode().nextSibling;
	                }
	                else {
	                    curNode = null;
	                }
	            }
	
	            return true;
	        }, this);
	
	        if (!parserObj) {
	            curNode = curNode.nextSibling;
	        }
	
	        return curNode;
	    }
	}
	
	
	
	


/***/ },
/* 6 */
/***/ function(module, exports) {

	/**
	 * @file 一堆项目里面常用的方法
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */
	
	exports.slice = function (arr, start, end) {
	    return Array.prototype.slice.call(arr, start, end);
	};
	
	exports.goDark = function (node) {
	    if (node.nodeType === 1) {
	        node.style.display = 'none';
	    }
	    else if (node.nodeType === 3) {
	        node.__text__ = node.nodeValue;
	        node.nodeValue = '';
	    }
	};
	
	exports.restoreFromDark = function (node) {
	    if (node.nodeType === 1) {
	        node.style.display = null;
	    }
	    else if (node.nodeType === 3) {
	        if (node.__text__ !== undefined) {
	            node.nodeValue = node.__text__;
	            node.__text__ = undefined;
	        }
	    }
	};
	
	exports.createExprFn = function (exprRegExp, expr, exprCalculater) {
	    expr = expr.replace(exprRegExp, function () {
	        return arguments[1];
	    });
	    exprCalculater.createExprFn(expr);
	
	    return function (scopeModel) {
	        return exprCalculater.calculate(expr, false, scopeModel);
	    };
	};
	
	/**
	 * 超级简单的 extend ，因为本库对 extend 没那高的要求，
	 * 等到有要求的时候再完善。
	 *
	 * @inner
	 * @param  {Object} target 目标对象
	 * @return {Object}        最终合并后的对象
	 */
	exports.extend = function (target) {
	    var srcs = exports.slice(arguments, 1);
	    for (var i = 0, il = srcs.length; i < il; i++) {
	        /* eslint-disable guard-for-in */
	        for (var key in srcs[i]) {
	            target[key] = srcs[i][key];
	        }
	        /* eslint-enable guard-for-in */
	    }
	    return target;
	};
	
	exports.traverseNoChangeNodes = function (startNode, endNode, nodeFn, context) {
	    for (var curNode = startNode;
	        curNode && curNode !== endNode;
	        curNode = curNode.nextSibling
	    ) {
	        if (nodeFn.call(context, curNode)) {
	            return;
	        }
	    }
	
	    nodeFn.call(context, endNode);
	};
	
	exports.traverseNodes = function (startNode, endNode, nodeFn, context) {
	    var nodes = [];
	    for (var curNode = startNode;
	        curNode && curNode !== endNode;
	        curNode = curNode.nextSibling
	    ) {
	        nodes.push(curNode);
	    }
	
	    nodes.push(endNode);
	
	    exports.each(nodes, nodeFn, context);
	};
	
	exports.each = function (arr, fn, context) {
	    if (exports.isArray(arr)) {
	        for (var i = 0, il = arr.length; i < il; i++) {
	            if (fn.call(context, arr[i], i, arr)) {
	                break;
	            }
	        }
	    }
	    else if (typeof arr === 'object') {
	        for (var k in arr) {
	            if (fn.call(context, arr[k], k, arr)) {
	                break;
	            }
	        }
	    }
	};
	
	function isClass(obj, clsName) {
	    return Object.prototype.toString.call(obj) === '[object ' + clsName + ']';
	}
	
	exports.isArray = function (arr) {
	    return isClass(arr, 'Array');
	};
	
	exports.isNumber = function (obj) {
	    return isClass(obj, 'Number');
	};
	
	exports.isFunction = function (obj) {
	    return isClass(obj, 'Function');
	};
	
	/**
	 * 是否是一个纯对象，满足如下条件：
	 *
	 * 1、除了内置属性之外，没有其他继承属性；
	 * 2、constructor 是 Object
	 *
	 * @param {Any} obj 待判断的变量
	 * @return {boolean}
	 */
	exports.isPureObject = function (obj) {
	    if (!isClass(obj, 'Object')) {
	        return false;
	    }
	
	    for (var k in obj) {
	        if (!obj.hasOwnProperty(k)) {
	            return false;
	        }
	    }
	
	    return true;
	};
	
	exports.isClass = isClass;
	
	exports.bind = function (fn, thisArg) {
	    if (!exports.isFunction(fn)) {
	        return;
	    }
	
	    var bind = Function.prototype.bind || function () {
	        var args = arguments;
	        var obj = args.length > 0 ? args[0] : undefined;
	        var me = this;
	        return function () {
	            var totalArgs = Array.prototype.concat.apply(Array.prototype.slice.call(args, 1), arguments);
	            return me.apply(obj, totalArgs);
	        };
	    };
	    return bind.apply(fn, [thisArg].concat(Array.prototype.slice.call(arguments, 2)));
	};
	
	exports.isSubClassOf = function (SubClass, SuperClass) {
	    return SubClass.prototype instanceof SuperClass;
	};
	
	/**
	 * 对传入的字符串进行创建正则表达式之前的转义，防止字符串中的一些字符成为关键字。
	 *
	 * @param  {string} str 待转义的字符串
	 * @return {string}     转义之后的字符串
	 */
	exports.regExpEncode = function regExpEncode(str) {
	    return '\\' + str.split('').join('\\');
	};
	
	exports.xhr = function (options, loadFn, errorFn) {
	    options = exports.extend({
	        method: 'GET'
	    }, options);
	
	    var xhr = new XMLHttpRequest();
	    xhr.onerror = errorFn;
	    xhr.onload = loadFn;
	    xhr.open(options.method, options.url, true);
	    setHeaders(options.headers, xhr);
	    xhr.send(options.body);
	};
	
	/**
	 * 将字符串中的驼峰命名方式改为短横线的形式
	 *
	 * @public
	 * @param  {string} str 要转换的字符串
	 * @return {string}
	 */
	exports.camel2line = function (str) {
	    return str.replace(/[A-Z]/g, function (matched, index) {
	        if (index === 0) {
	            return matched.toLowerCase();
	        }
	        return '-' + matched.toLowerCase();
	    });
	};
	
	/**
	 * 将字符串中的短横线命名方式改为驼峰的形式
	 *
	 * @public
	 * @param  {string} str 要转换的字符串
	 * @return {string}
	 */
	exports.line2camel = function (str) {
	    return str.replace(/-[a-z]/g, function (matched) {
	        return matched[1].toUpperCase();
	    });
	};
	
	
	function setHeaders(headers, xhr) {
	    if (!headers) {
	        return;
	    }
	
	    for (var k in headers) {
	        if (!headers.hasOwnProperty(k)) {
	            continue;
	        }
	        xhr.setRequestHeader(k, headers[k]);
	    }
	}
	
	


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var utils = __webpack_require__(6);
	
	function ExprCalculater() {
	    this.fns = {};
	
	    this.exprNameMap = {};
	    this.exprNameRegExp = /\.?\$?([a-z|A-Z]+|([a-z|A-Z]+[0-9]+[a-z|A-Z]*))/g;
	}
	
	ExprCalculater.prototype.createExprFn = function (expr, avoidReturn) {
	    avoidReturn = !!avoidReturn;
	    this.fns[expr] = this.fns[expr] || {};
	    if (this.fns[expr][avoidReturn]) {
	        return;
	    }
	
	    var params = getVariableNamesFromExpr(this, expr);
	    var fn = new Function(params, (avoidReturn ? '' : 'return ') + expr);
	
	    this.fns[expr][avoidReturn] = {
	        paramNames: params,
	        fn: fn
	    };
	};
	
	ExprCalculater.prototype.calculate = function (expr, avoidReturn, scopeModel) {
	    var fnObj = this.fns[expr][avoidReturn];
	    if (!fnObj) {
	        throw new Error('no such expression function created!');
	    }
	
	    var fnArgs = [];
	    for (var i = 0, il = fnObj.paramNames.length; i < il; i++) {
	        var param = fnObj.paramNames[i];
	        var value = scopeModel.get(param);
	        fnArgs.push(value === undefined ? '' : value);
	    }
	
	    var result;
	    try {
	        result = fnObj.fn.apply(null, fnArgs);
	    }
	    catch (e) {
	        result = '';
	    }
	    return result;
	};
	
	ExprCalculater.prototype.destroy = function () {
	    this.fns = null;
	    this.exprNameMap = null;
	    this.exprNameRegExp = null;
	};
	
	module.exports = ExprCalculater;
	
	/**
	 * 从表达式中抽离出变量名
	 *
	 * @inner
	 * @param {ExprCalculater} me 对应实例
	 * @param  {string} expr 表达式字符串，类似于 `${name}` 中的 name
	 * @return {Array.<string>}      变量名数组
	 */
	function getVariableNamesFromExpr(me, expr) {
	    if (me.exprNameMap[expr]) {
	        return me.exprNameMap[expr];
	    }
	
	    var reg = /[\$|_|a-z|A-Z]{1}(?:[a-z|A-Z|0-9|\$|_]*)/g;
	
	    for (var names = {}, name = reg.exec(expr); name; name = reg.exec(expr)) {
	        var restStr = expr.slice(name.index + name[0].length);
	
	        // 是左值
	        if (/^\s*=(?!=)/.test(restStr)) {
	            continue;
	        }
	
	        // 变量名前面是否存在 `.` ，或者变量名是否位于引号内部
	        if (name.index
	            && (expr[name.index - 1] === '.'
	                || isInQuote(
	                        expr.slice(0, name.index),
	                        restStr
	                   )
	            )
	        ) {
	            continue;
	        }
	
	        names[name[0]] = true;
	    }
	
	    var ret = [];
	    utils.each(names, function (isOk, name) {
	        if (isOk) {
	            ret.push(name);
	        }
	    });
	    me.exprNameMap[expr] = ret;
	
	    return ret;
	
	    function isInQuote(preStr, restStr) {
	        if ((preStr.lastIndexOf('\'') + 1 && restStr.indexOf('\'') + 1)
	            || (preStr.lastIndexOf('"') + 1 && restStr.indexOf('"') + 1)
	        ) {
	            return true;
	        }
	    }
	}


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file DOM 更新器
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */
	
	var utils = __webpack_require__(6);
	var log = __webpack_require__(9);
	
	function DomUpdater() {
	    this.tasks = {};
	    this.isExecuting = false;
	    this.doneFns = [];
	}
	
	var counter = 0;
	DomUpdater.prototype.generateTaskId = function () {
	    return counter++;
	};
	
	DomUpdater.prototype.addTaskFn = function (taskId, taskFn) {
	    this.tasks[taskId] = taskFn;
	};
	
	DomUpdater.prototype.destroy = function () {
	    this.tasks = null;
	};
	
	DomUpdater.prototype.execute = function (doneFn) {
	    if (utils.isFunction(doneFn)) {
	        this.doneFns.push(doneFn);
	    }
	
	    var me = this;
	    if (!this.isExecuting) {
	        this.isExecuting = true;
	        requestAnimationFrame(function () {
	            utils.each(me.tasks, function (taskFn) {
	                try {
	                    taskFn();
	                }
	                catch (e) {
	                    log.warn(e);
	                }
	            });
	            me.tasks = {};
	
	            setTimeout(utils.bind(function (doneFns) {
	                utils.each(doneFns, function (doneFn) {
	                    doneFn();
	                });
	            }, null, me.doneFns));
	            me.doneFns = [];
	
	            me.isExecuting = false;
	        });
	    }
	};
	
	/**
	 * 给指定DOM节点的指定属性设置值
	 *
	 * TODO: 完善
	 *
	 * @static
	 * @param {Node} node  DOM节点
	 * @param {string} name  节点属性名
	 * @param {Object} value 节点属性值
	 * @return {*}
	 */
	DomUpdater.setAttr = function (node, name, value) {
	    // 目前仅处理元素节点，以后是否处理其他类型的节点，以后再说
	    if (node.nodeType !== 1) {
	        return;
	    }
	
	    if (name === 'style' && utils.isPureObject(value)) {
	        return DomUpdater.setStyle(node, value);
	    }
	
	    if (name === 'class') {
	        return DomUpdater.setClass(node, value);
	    }
	
	    node.setAttribute(name, value);
	};
	
	DomUpdater.setClass = function (node, klass) {
	    if (!klass) {
	        return;
	    }
	
	    var klasses = [];
	    if (utils.isClass(klass, 'String')) {
	        klasses = klass.split(' ');
	    }
	    else if (utils.isPureObject(klass)) {
	        for (var k in klass) {
	            if (klass[k]) {
	                klasses.push(klass[k]);
	            }
	        }
	    }
	    else if (utils.isArray(klass)) {
	        klasses = klass;
	    }
	
	    node.setAttribute('class', '');
	    node.classList.add.apply(node.classList, klasses);
	};
	
	DomUpdater.setStyle = function (node, styleObj) {
	    for (var k in styleObj) {
	        node.style[k] = styleObj[k];
	    }
	};
	
	module.exports = DomUpdater;


/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = {
	    warn: function () {
	        if (!console || !console.warn) {
	            return;
	        }
	
	        console.warn.apply(console, arguments);
	    }
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var utils = __webpack_require__(6);
	var Event = __webpack_require__(11);
	var inherit = __webpack_require__(12);
	
	function ScopeModel() {
	    Event.call(this);
	
	    this.store = {};
	    this.parent;
	    this.children = [];
	}
	
	ScopeModel.prototype.setParent = function (parent) {
	    this.parent = parent;
	};
	
	ScopeModel.prototype.addChild = function (child) {
	    this.children.push(child);
	};
	
	ScopeModel.prototype.set = function (name, value) {
	    if (utils.isClass(name, 'String')) {
	        this.store[name] = value;
	        change(this);
	    }
	    else if (utils.isPureObject(name)) {
	        utils.extend(this.store, name);
	        change(this);
	    }
	};
	
	ScopeModel.prototype.get = function (name) {
	    if (arguments.length > 1 || name === undefined) {
	        return this.store;
	    }
	
	    if (name in this.store) {
	        return this.store[name];
	    }
	
	    if (this.parent) {
	        return this.parent.get(name);
	    }
	};
	
	module.exports = inherit(ScopeModel, Event);
	
	function change(me) {
	    me.trigger('change', me);
	    utils.each(me.children, function (scope) {
	        scope.trigger('parentchange', me);
	    });
	}


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var utils = __webpack_require__(6);
	
	function Event() {
	    this.evnts = {};
	}
	
	Event.prototype.on = function (eventName, fn, context) {
	    if (!utils.isFunction(fn)) {
	        return;
	    }
	
	    this.evnts[eventName] = this.evnts[eventName] || [];
	
	    this.evnts[eventName].push({
	        fn: fn,
	        context: context
	    });
	};
	
	Event.prototype.trigger = function (eventName) {
	    var fnObjs = this.evnts[eventName];
	    if (fnObjs && fnObjs.length) {
	        var args = utils.slice(arguments, 1);
	        utils.each(fnObjs, function (fnObj) {
	            fnObj.fn.apply(fnObj.context, args);
	        });
	    }
	};
	
	Event.prototype.off = function (eventName, fn) {
	    if (!fn) {
	        this.evnts[eventName] = null;
	        return;
	    }
	
	    var fnObjs = this.evnts[eventName];
	    if (fnObjs && fnObjs.length) {
	        var newFnObjs = [];
	        utils.each(fnObjs, function (fnObj) {
	            if (fn !== fnObj.fn) {
	                newFnObjs.push(fnObj);
	            }
	        });
	        this.evnts[eventName] = newFnObjs;
	    }
	};
	
	module.exports = Event;


/***/ },
/* 12 */
/***/ function(module, exports) {

	/**
	 * @file 继承
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */
	
	function inherit(ChildClass, ParentClass) {
	    function Cls() {}
	
	    Cls.prototype = ParentClass.prototype;
	    var childProto = ChildClass.prototype;
	    ChildClass.prototype = new Cls();
	    ChildClass.prototype.constructor = ChildClass;
	
	    var key;
	    for (key in childProto) {
	        ChildClass.prototype[key] = childProto[key];
	    }
	
	    // 继承静态属性
	    for (key in ParentClass) {
	        if (ParentClass.hasOwnProperty(key)) {
	            if (ChildClass[key] === undefined) {
	                ChildClass[key] = ParentClass[key];
	            }
	        }
	    }
	
	    return ChildClass;
	}
	
	module.exports = inherit;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file 所有类的基类
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */
	
	var inherit = __webpack_require__(12);
	var utils = __webpack_require__(6);
	
	function Base() {
	    this.initialize.apply(this, arguments);
	}
	
	Base.prototype.initialize = function () {};
	
	/**
	 * 继承
	 *
	 * @static
	 * @param  {Object} props       普通属性
	 * @param  {Object} staticProps 静态属性
	 * @return {Class}             子类
	 */
	Base.extends = function (props, staticProps) {
	    // 每个类都必须有一个名字
	    if (!staticProps || !staticProps.$name) {
	        throw new SyntaxError('each class must have a `$name`.');
	    }
	
	    var baseCls = this;
	
	    var cls = function () {
	        baseCls.apply(this, arguments);
	    };
	    utils.extend(cls.prototype, props);
	    utils.extend(cls, staticProps);
	
	    // 记录一下父类
	    cls.$superClass = baseCls;
	
	    return inherit(cls, baseCls);
	};
	
	module.exports = Base;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file 组件解析器
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */
	
	var Parser = __webpack_require__(15);
	var Tree = __webpack_require__(5);
	var utils = __webpack_require__(6);
	
	module.exports = Parser.extends(
	    {
	
	        initialize: function (options) {
	            Parser.prototype.initialize.apply(this, arguments);
	
	            this.componentManager = this.tree.getTreeVar('componentManager');
	
	            this.node = options.node;
	
	            this.exprs = [];
	            this.exprFns = {};
	            this.updateFns = {};
	            this.exprOldValues = {};
	        },
	
	        setComponentEvent: function (event) {
	            this.componentEvent = event;
	        },
	
	        collectExprs: function () {
	            var curNode = this.node;
	
	            var attributes = curNode.attributes;
	            // 搜集不含有表达式的属性，然后在组件类创建好之后设置进组件
	            this.setLiteralAttrsFns = [];
	            for (var i = 0, il = attributes.length; i < il; i++) {
	                var attr = attributes[i];
	                var expr = attr.nodeValue;
	                if (this.config.getExprRegExp().test(expr)) {
	                    this.exprs.push(expr);
	                    if (!this.exprFns[expr]) {
	                        var rawExpr = getRawExpr(expr, this.config);
	                        this.exprCalculater.createExprFn(rawExpr);
	                        this.exprFns[expr] = utils.bind(calculateExpr, null, rawExpr, this.exprCalculater);
	
	                        this.updateFns[expr] = this.updateFns[expr] || [];
	                        this.updateFns[expr].push(utils.bind(setAttrFn, null, attr.nodeName));
	                    }
	                }
	                else {
	                    this.setLiteralAttrsFns.push(
	                        utils.bind(setAttrFn, null, attr.nodeName, attr.nodeValue)
	                    );
	                }
	            }
	
	            var componentName = this.node.tagName.toLowerCase()
	                .replace('ui', '')
	                .replace(/-[a-z]/g, function () {
	                    return arguments[0][1].toUpperCase();
	                });
	
	            var ComponentClass = this.componentManager.getClass(componentName);
	            if (!ComponentClass) {
	                throw new Error('the component `' + componentName + '` is not registed!');
	            }
	
	            this.component = new ComponentClass({
	                componentNode: this.node,
	                tree: this.tree
	            });
	            if (this.componentEvent) {
	                this.componentEvent.trigger('newcomponent', this.component);
	            }
	
	            return true;
	
	            /**
	             * 设置组件属性。
	             * 由于HTML标签中不能写驼峰形式的属性名，
	             * 所以此处会将中横线形式的属性转换成驼峰形式。
	             *
	             * @inner
	             * @param {string} name      属性名
	             * @param {string} value     属性值
	             * @param {Component} component 组件
	             */
	            function setAttrFn(name, value, component) {
	                component.setAttr(utils.line2camel(name), value);
	            }
	
	            function calculateExpr(rawExpr, exprCalculater, scopeModel) {
	                return exprCalculater.calculate(rawExpr, false, scopeModel);
	            }
	
	            function getRawExpr(expr, config) {
	                return expr.replace(config.getExprRegExp(), function () {
	                    return arguments[1];
	                });
	            }
	        },
	
	        /**
	         * 获取开始节点
	         *
	         * @protected
	         * @inheritDoc
	         * @return {Node}
	         */
	        getStartNode: function () {
	            if (!this.component) {
	                return this.node;
	            }
	
	            return this.component.startNode;
	        },
	
	        /**
	         * 获取结束节点
	         *
	         * @protected
	         * @inheritDoc
	         * @return {Node}
	         */
	        getEndNode: function () {
	            if (!this.component) {
	                return this.node;
	            }
	
	            return this.component.endNode;
	        },
	
	        setScope: function (scopeModel) {
	            Parser.prototype.setScope.apply(this, arguments);
	
	            this.component.setOutScope(this.scopeModel);
	
	            this.component.mount();
	
	            for (var i = 0, il = this.setLiteralAttrsFns.length; i < il; i++) {
	                this.setLiteralAttrsFns[i](this.component);
	            }
	
	            this.component.literalAttrReady();
	        },
	
	        onChange: function () {
	            if (this.isGoDark) {
	                return;
	            }
	
	            var exprs = this.exprs;
	            var exprOldValues = this.exprOldValues;
	            for (var i = 0, il = exprs.length; i < il; i++) {
	                var expr = exprs[i];
	                var exprValue = this.exprFns[expr](this.scopeModel);
	
	                if (this.dirtyCheck(expr, exprValue, exprOldValues[expr])) {
	                    var updateFns = this.updateFns[expr];
	                    for (var j = 0, jl = updateFns.length; j < jl; j++) {
	                        updateFns[j](exprValue, this.component);
	                    }
	                }
	
	                exprOldValues[expr] = exprValue;
	            }
	
	            Parser.prototype.onChange.apply(this, arguments);
	        },
	
	        goDark: function () {
	            this.component.goDark();
	            this.isGoDark = true;
	        },
	
	        restoreFromDark: function () {
	            this.component.restoreFromDark();
	            this.isGoDark = false;
	        }
	    },
	    {
	        isProperNode: function (node, config) {
	            return node.nodeType === 1
	                && node.tagName.toLowerCase().indexOf('ui-') === 0;
	        },
	
	        $name: 'ComponentParser'
	    }
	);
	
	Tree.registeParser(module.exports);


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file 解析器的抽象基类
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */
	
	/**
	 * 构造函数
	 *
	 * @constructor
	 * @param {Object} options 配置参数，一般可能会有如下内容：
	 *                         {
	 *                             startNode: ...,
	 *                             endNode: ...,
	 *                             node: ...,
	 *                             config: ...
	 *                         }
	 *                         具体是啥可以参加具体的子类
	 */
	
	var Base = __webpack_require__(13);
	module.exports = Base.extends(
	    {
	
	        /**
	         * 初始化
	         *
	         * @protected
	         * @param {Object} options 来自于构造函数
	         */
	        initialize: function (options) {
	            this.exprCalculater = options.exprCalculater;
	            this.config = options.config;
	            this.domUpdater = options.domUpdater;
	            this.tree = options.tree;
	        },
	
	        /**
	         * 绑定scope model
	         *
	         * @public
	         * @param {ScopeModel} scopeModel scope model
	         */
	        setScope: function (scopeModel) {
	            this.scopeModel = scopeModel;
	
	            this.scopeModel.on('change', this.onChange, this);
	            this.scopeModel.on('parentchange', this.onChange, this);
	        },
	
	        /**
	         * model 发生变化的回调函数
	         *
	         * @protected
	         */
	        onChange: function () {
	            this.domUpdater.execute();
	        },
	
	        /**
	         * 获取scope model
	         *
	         * @public
	         * @return {ScopeModel} scope model对象
	         */
	        getScope: function () {
	            return this.scopeModel;
	        },
	
	        /**
	         * 向scope model里面设置数据
	         *
	         * @public
	         * @param {Object} data 要设置的数据
	         */
	        setData: function (data) {
	            this.scopeModel.set(data);
	        },
	
	        /**
	         * 隐藏当前parser实例相关的节点。具体子类实现
	         *
	         * @public
	         * @abstract
	         */
	        goDark: function () {},
	
	        /**
	         * 显示相关元素
	         *
	         * @public
	         * @abstract
	         */
	        restoreFromDark: function () {},
	
	        /**
	         * 获取解析器当前状态下的开始DOM节点。
	         *
	         * 由于有的解析器会将之前的节点移除掉，那么就会对遍历带来影响了，
	         * 所以此处提供两个获取开始节点和结束节点的方法。
	         *
	         * @public
	         * @return {Node} DOM节点对象
	         */
	        getStartNode: function () {
	            return this.startNode;
	        },
	
	        /**
	         * 获取解析器当前状态下的结束DOM节点
	         *
	         * @public
	         * @return {Node} 节点对象
	         */
	        getEndNode: function () {
	            return this.endNode;
	        },
	
	        /**
	         * 搜集表达式，生成表达式函数和 DOM 更新函数。具体子类实现
	         *
	         * @abstract
	         * @public
	         */
	        collectExprs: function () {},
	
	        /**
	         * 脏检测。默认会使用全等判断。
	         *
	         * @public
	         * @param  {string} expr         要检查的表达式
	         * @param  {*} exprValue    表达式当前计算出来的值
	         * @param  {*} exprOldValue 表达式上一次计算出来的值
	         * @return {boolean}              两次的值是否相同
	         */
	        dirtyCheck: function (expr, exprValue, exprOldValue) {
	            var dirtyCheckerFn = this.dirtyChecker ? this.dirtyChecker.getChecker(expr) : null;
	            return (dirtyCheckerFn && dirtyCheckerFn(expr, exprValue, exprOldValue))
	                    || (!dirtyCheckerFn && exprValue !== exprOldValue);
	        },
	
	        /**
	         * 设置脏检测器
	         *
	         * @public
	         * @param {DirtyChecker} dirtyChecker 脏检测器
	         */
	        setDirtyChecker: function (dirtyChecker) {
	            this.dirtyChecker = dirtyChecker;
	        },
	
	        /**
	         * 销毁解析器，将界面恢复成原样
	         *
	         * @public
	         */
	        destroy: function () {
	            this.exprCalculater = null;
	            this.config = null;
	            this.domUpdater = null;
	            this.tree = null;
	            this.dirtyChecker = null;
	        }
	    },
	    {
	        $name: 'Parser'
	    }
	);


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file 组件管理。ComponentManager也是有层级关系的，
	 *       Tree下面的ComponentManager注册这个Tree实例用到的Component，
	 *       而在Component中也可以注册此Component的tpl中将会使用到的Component。
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */
	
	var utils = __webpack_require__(6);
	
	function ComponentManager() {
	    this.components = {};
	}
	
	/**
	 * 注册组件。
	 *
	 * @public
	 * @param  {Constructor} ComponentClass 组件类
	 * @param  {string=} name           组件名，可选
	 */
	ComponentManager.prototype.registe = function (ComponentClass) {
	    var name = ComponentClass.$name;
	    this.components[name] = ComponentClass;
	    this.mountStyle(ComponentClass);
	};
	
	/**
	 * 根据名字获取组件类。在模板解析的过程中会调用这个方法。
	 *
	 * @public
	 * @param  {string} name 组件名
	 * @return {ComponentClass}  组件类
	 */
	ComponentManager.prototype.getClass = function (name) {
	    var component = this.components[name];
	    if (component) {
	        return component;
	    }
	
	    if (this.parent) {
	        component = this.parent.getClass(name);
	    }
	
	    return component;
	};
	
	/**
	 * 设置父级组件管理器
	 *
	 * @public
	 * @param {ComponentManger} componentManager 组件管理器
	 */
	ComponentManager.prototype.setParent = function (componentManager) {
	    this.parent = componentManager;
	};
	
	/**
	 * 将组件的样式挂载上去
	 *
	 * @private
	 * @param {组件类} ComponentClass 组件类
	 */
	ComponentManager.prototype.mountStyle = function (ComponentClass) {
	    var styleNodeId = 'component-' + ComponentClass.$name;
	
	    // 判断一下，避免重复添加css
	    if (!document.getElementById(styleNodeId)) {
	        var style = ComponentClass.getStyle();
	        if (style) {
	            var styleNode = document.createElement('style');
	            styleNode.setAttribute('id', styleNodeId);
	            styleNode.innerHTML = style.replace(
	                /#root#/g,
	                '.' + ComponentManager.getCssClassName(ComponentClass).join('.')
	            );
	            document.head.appendChild(styleNode);
	        }
	    }
	
	    // 将父类的css样式也加上去。父类很可能没注册，如果此处不加上去，样式可能就会缺一块。
	    if (ComponentClass.$name !== 'Component') {
	        this.mountStyle(ComponentClass.$superClass);
	    }
	};
	
	/**
	 * 获取组件的css类名。规则是根据继承关系，进行类名拼接，从而使子组件类的css具有更高优先级。
	 *
	 * @static
	 * @param {Constructor} ComponentClass 组件类
	 * @return {Array.<string>} 合成类名数组
	 */
	ComponentManager.getCssClassName = function (ComponentClass) {
	    var name = [];
	    for (var curCls = ComponentClass; curCls; curCls = curCls.$superClass) {
	        name.push(utils.camel2line(curCls.$name));
	
	        // 最多到组件基类
	        if (curCls.$name === 'Component') {
	            break;
	        }
	    }
	    return name;
	};
	
	
	module.exports = ComponentManager;
	


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__(18);
	
	var amdExports = {
	    Config: __webpack_require__(20),
	    Tree: __webpack_require__(5),
	    DirtyChecker: __webpack_require__(21),
	    Parser: __webpack_require__(15),
	    ForDirectiveParser: __webpack_require__(22),
	    IfDirectiveParser: __webpack_require__(24),
	    EventExprParser: __webpack_require__(25),
	    ExprParser: __webpack_require__(26),
	    ExprCalculater: __webpack_require__(7),
	    VarDirectiveParser: __webpack_require__(27),
	    inherit: __webpack_require__(12),
	    utils: __webpack_require__(6),
	    DomUpdater: __webpack_require__(8),
	    ScopeModel: __webpack_require__(10)
	};
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {
	    module.exports = amdExports;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file scope directive parser
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */
	
	var DirectiveParser = __webpack_require__(19);
	var ScopeModel = __webpack_require__(10);
	var Tree = __webpack_require__(5);
	
	module.exports = DirectiveParser.extends(
	    {
	        initialize: function (options) {
	            DirectiveParser.prototype.initialize.call(this, options);
	
	            this.startNode = options.startNode;
	            this.endNode = options.endNode;
	
	            if (!this.tree.getTreeVar('scopes')) {
	                this.tree.setTreeVar('scopes', {});
	            }
	        },
	
	        setScope: function (scopeModel) {
	            this.scopeModel.setParent(scopeModel);
	            scopeModel.addChild(this.scopeModel);
	        },
	
	        collectExprs: function () {
	            var scopeName = this.startNode.nodeValue
	                .replace(/\s+/g, '')
	                .replace(this.config.scopeName + ':', '');
	            if (scopeName) {
	                var scopes = this.tree.getTreeVar('scopes');
	                this.scopeModel = new ScopeModel();
	                scopes[scopeName] = scopes[scopeName] || [];
	                scopes[scopeName].push(this.scopeModel);
	            }
	
	            return [
	                {
	                    startNode: this.startNode.nextSibling,
	                    endNode: this.endNode.previousSibling
	                }
	            ];
	        }
	    },
	    {
	        isProperNode: function (node, config) {
	            return DirectiveParser.isProperNode(node, config)
	                && node.nodeValue.replace(/\s+/, '').indexOf(config.scopeName + ':') === 0;
	        },
	
	        findEndNode: function (startNode, config) {
	            var curNode = startNode;
	            while ((curNode = curNode.nextSibling)) {
	                if (isEndNode(curNode, config)) {
	                    return curNode;
	                }
	            }
	        },
	
	        getNoEndNodeError: function () {
	            return new Error('the scope directive is not properly ended!');
	        },
	
	        $name: 'ScopeDirectiveParser'
	    }
	);
	
	Tree.registeParser(module.exports);
	
	function isEndNode(node, config) {
	    return node.nodeType === 8
	        && node.nodeValue.replace(/\s+/g, '') === config.scopeEndName;
	}


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file 指令解析器抽象类。指令节点一定是注释节点
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */
	
	var Parser = __webpack_require__(15);
	
	module.exports = Parser.extends(
	    {},
	    {
	        isProperNode: function (node, config) {
	            return node.nodeType === 8;
	        },
	        $name: 'DirectiveParser'
	    }
	);


/***/ },
/* 20 */
/***/ function(module, exports) {

	/**
	 * @file 配置
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */
	
	function Config() {
	    this.exprPrefix = '${';
	    this.exprSuffix = '}';
	
	    this.ifName = 'if';
	    this.elifName = 'elif';
	    this.elseName = 'else';
	    this.ifEndName = '/if';
	
	    this.ifPrefixRegExp = /^\s*if:\s*/;
	    this.elifPrefixRegExp = /^\s*elif:\s*/;
	    this.elsePrefixRegExp = /^\s*else\s*/;
	    this.ifEndPrefixRegExp = /^\s*\/if\s*/;
	
	    this.forName = 'for';
	    this.forEndName = '/for';
	
	    this.forPrefixRegExp = /^\s*for:\s*/;
	    this.forEndPrefixRegExp = /^\s*\/for\s*/;
	
	    this.eventPrefix = 'event';
	
	    this.varName = 'var';
	
	    this.scopeName = 'scope';
	    this.scopeEndName = '/scope';
	}
	
	Config.prototype.setExprPrefix = function (prefix) {
	    this.exprPrefix = prefix;
	};
	
	Config.prototype.setExprSuffix = function (suffix) {
	    this.exprSuffix = suffix;
	};
	
	Config.prototype.getExprRegExp = function () {
	    if (!this.exprRegExp) {
	        this.exprRegExp = new RegExp(regExpEncode(this.exprPrefix) + '(.+?)' + regExpEncode(this.exprSuffix), 'g');
	    }
	    this.exprRegExp.lastIndex = 0;
	    return this.exprRegExp;
	};
	
	Config.prototype.getAllIfRegExp = function () {
	    if (!this.allIfRegExp) {
	        this.allIfRegExp = new RegExp('\\s*('
	            + this.ifName + '|'
	            + this.elifName + '|'
	            + this.elseName + '|'
	            + this.ifEndName + '):\\s*', 'g');
	    }
	    this.allIfRegExp.lastIndex = 0;
	    return this.allIfRegExp;
	};
	
	Config.prototype.setIfName = function (ifName) {
	    this.ifName = ifName;
	    this.ifPrefixRegExp = new RegExp('^\\s*' + ifName + ':\\s*');
	};
	
	Config.prototype.setElifName = function (elifName) {
	    this.elifName = elifName;
	    this.elifPrefixRegExp = new RegExp('^\\s*' + elifName + ':\\s*');
	};
	
	Config.prototype.setElseName = function (elseName) {
	    this.elseName = elseName;
	    this.elsePrefixRegExp = new RegExp('^\\s*' + elseName + '\\s*');
	};
	
	Config.prototype.setIfEndName = function (ifEndName) {
	    this.ifEndName = ifEndName;
	    this.ifEndPrefixRegExp = new RegExp('^\\s*' + ifEndName + '\\s*');
	};
	
	Config.prototype.setForName = function (forName) {
	    this.forName = forName;
	    this.forPrefixRegExp = new RegExp('^\\s*' + forName + ':\\s*');
	};
	
	Config.prototype.setForEndName = function (forEndName) {
	    this.forEndName = forEndName;
	    this.forEndPrefixRegExp = new RegExp('^\\s*' + forEndName + '\\s*');
	};
	
	Config.prototype.getForExprsRegExp = function () {
	    if (!this.forExprsRegExp) {
	        this.forExprsRegExp = new RegExp('\\s*'
	            + this.forName
	            + ':\\s*'
	            + regExpEncode(this.exprPrefix)
	            + '([^' + regExpEncode(this.exprSuffix)
	            + ']+)' + regExpEncode(this.exprSuffix));
	    }
	    this.forExprsRegExp.lastIndex = 0;
	    return this.forExprsRegExp;
	};
	
	Config.prototype.getForItemValueNameRegExp = function () {
	    if (!this.forItemValueNameRegExp) {
	        this.forItemValueNameRegExp = new RegExp(
	            'as\\s*' + regExpEncode(this.exprPrefix)
	            + '([^' + regExpEncode(this.exprSuffix) + ']+)'
	            + regExpEncode(this.exprSuffix)
	        );
	    }
	    this.forItemValueNameRegExp.lastIndex = 0;
	    return this.forItemValueNameRegExp;
	};
	
	Config.prototype.setEventPrefix = function (prefix) {
	    this.eventPrefix = prefix;
	};
	
	Config.prototype.setVarName = function (name) {
	    this.varName = name;
	};
	
	module.exports = Config;
	
	function regExpEncode(str) {
	    return '\\' + str.split('').join('\\');
	}


/***/ },
/* 21 */
/***/ function(module, exports) {

	/**
	 * @file 脏检测器
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */
	
	function DirtyChecker() {
	    this.checkers = {};
	}
	
	DirtyChecker.prototype.setChecker = function (expr, checkerFn) {
	    this.checkers[expr] = checkerFn;
	};
	
	DirtyChecker.prototype.getChecker = function (expr) {
	    return this.checkers[expr];
	};
	
	DirtyChecker.prototype.destroy = function () {
	    this.checkers = null;
	};
	
	module.exports = DirtyChecker;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file for 指令
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */
	
	var DirectiveParser = __webpack_require__(19);
	var utils = __webpack_require__(6);
	var ForTree = __webpack_require__(23);
	
	module.exports = DirectiveParser.extends(
	    {
	
	        initialize: function (options) {
	            DirectiveParser.prototype.initialize.apply(this, arguments);
	
	            this.startNode = options.startNode;
	            this.endNode = options.endNode;
	        },
	
	        collectExprs: function () {
	            if (this.startNode.nextSibling === this.endNode) {
	                return;
	            }
	
	            var tplSeg = document.createElement('div');
	            utils.traverseNodes(this.startNode, this.endNode, function (curNode) {
	                if (curNode === this.startNode || curNode === this.endNode) {
	                    return;
	                }
	
	                tplSeg.appendChild(curNode);
	            }, this);
	            this.tplSeg = tplSeg;
	
	            this.expr = this.startNode.nodeValue.match(this.config.getForExprsRegExp())[1];
	            this.exprFn = utils.createExprFn(this.config.getExprRegExp(), this.expr, this.exprCalculater);
	            this.updateFn = createUpdateFn(
	                this,
	                this.startNode.nextSibling,
	                this.endNode.previousSibling,
	                this.config,
	                this.startNode.nodeValue
	            );
	
	            return true;
	        },
	
	        onChange: function () {
	            if (!this.expr) {
	                return;
	            }
	
	            var exprValue = this.exprFn(this.scopeModel);
	            if (this.dirtyCheck(this.expr, exprValue, this.exprOldValue)) {
	                this.updateFn(exprValue, this.scopeModel);
	            }
	
	            this.exprOldValue = exprValue;
	
	            DirectiveParser.prototype.onChange.apply(this, arguments);
	        },
	
	        destroy: function () {
	            utils.traverseNodes(this.tplSeg.firstChild, this.tplSeg.lastChild, function (curNode) {
	                this.endNode.parentNode.insertBefore(curNode, this.endNode);
	            }, this);
	
	            utils.each(this.trees, function (tree) {
	                tree.destroy();
	            });
	
	            this.tplSeg = null;
	            this.expr = null;
	            this.exprFn = null;
	            this.updateFn = null;
	            this.startNode = null;
	            this.endNode = null;
	            DirectiveParser.prototype.destroy.apply(this, arguments);
	        }
	    },
	    {
	        isProperNode: function (node, config) {
	            return DirectiveParser.isProperNode(node, config)
	                && config.forPrefixRegExp.test(node.nodeValue);
	        },
	
	        findEndNode: function (forStartNode, config) {
	            var curNode = forStartNode;
	            while ((curNode = curNode.nextSibling)) {
	                if (isForEndNode(curNode, config)) {
	                    return curNode;
	                }
	            }
	        },
	
	        getNoEndNodeError: function () {
	            return new Error('the `for` directive is not properly ended!');
	        },
	
	        $name: 'ForDirectiveParser'
	    }
	);
	
	ForTree.registeParser(module.exports);
	
	function isForEndNode(node, config) {
	    return node.nodeType === 8 && config.forEndPrefixRegExp.test(node.nodeValue);
	}
	
	function createUpdateFn(parser, startNode, endNode, config, fullExpr) {
	    var trees = [];
	    parser.trees = trees;
	    var itemVariableName = fullExpr.match(parser.config.getForItemValueNameRegExp())[1];
	    var taskId = parser.domUpdater.generateTaskId();
	    return function (exprValue, scopeModel) {
	        var index = 0;
	        for (var k in exprValue) {
	            if (!trees[index]) {
	                trees[index] = createTree(parser, config);
	            }
	
	            trees[index].restoreFromDark();
	            trees[index].setDirtyChecker(parser.dirtyChecker);
	
	            var local = {
	                key: k,
	                index: index
	            };
	            local[itemVariableName] = exprValue[k];
	
	            trees[index].rootScope.setParent(scopeModel);
	            scopeModel.addChild(trees[index].rootScope);
	
	            trees[index].setData(local);
	
	            index++;
	        }
	
	        parser.domUpdater.addTaskFn(taskId, utils.bind(function (trees, index) {
	            for (var i = index, il = trees.length; i < il; i++) {
	                trees[i].goDark();
	            }
	        }, null, trees, index));
	    };
	}
	
	function createTree(parser, config) {
	    var copySeg = parser.tplSeg.cloneNode(true);
	    var startNode = copySeg.firstChild;
	    var endNode = copySeg.lastChild;
	    utils.traverseNodes(startNode, endNode, function (curNode) {
	        parser.endNode.parentNode.insertBefore(curNode, parser.endNode);
	    });
	
	    var tree = new ForTree({
	        startNode: startNode,
	        endNode: endNode,
	        config: config,
	        domUpdater: parser.tree.domUpdater,
	        exprCalculater: parser.tree.exprCalculater
	    });
	    tree.setParent(parser.tree);
	    tree.traverse();
	    return tree;
	}


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file for指令中用到的
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */
	
	var Tree = __webpack_require__(5);
	
	module.exports = Tree.extends(
	    {
	        initialize: function (options) {
	            if (!options.config
	                || !options.domUpdater
	                || !options.exprCalculater
	            ) {
	                throw new Error('wrong arguments');
	            }
	
	            Tree.prototype.initialize.apply(this, arguments);
	        }
	    },
	    {
	        $name: 'ForTree'
	    }
	);
	


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file if 指令
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */
	
	var DirectiveParser = __webpack_require__(19);
	var utils = __webpack_require__(6);
	var Tree = __webpack_require__(5);
	
	module.exports = DirectiveParser.extends(
	    {
	        initialize: function (options) {
	            DirectiveParser.prototype.initialize.apply(this, arguments);
	
	            this.startNode = options.startNode;
	            this.endNode = options.endNode;
	            this.config = options.config;
	
	            this.exprs = [];
	            this.exprFns = {};
	
	            this.handleBranchesTaskId = this.domUpdater.generateTaskId();
	        },
	
	        collectExprs: function () {
	            var branches = [];
	            var branchIndex = -1;
	
	            utils.traverseNodes(this.startNode, this.endNode, function (curNode) {
	                var nodeType = getIfNodeType(curNode, this.config);
	
	                if (nodeType) {
	                    setEndNode(curNode, branches, branchIndex);
	
	                    branchIndex++;
	                    branches[branchIndex] = branches[branchIndex] || {};
	
	                    // 是 if 节点或者 elif 节点，搜集表达式
	                    if (nodeType < 3) {
	                        var expr = curNode.nodeValue.replace(this.config.getAllIfRegExp(), '');
	                        this.exprs.push(expr);
	
	                        if (!this.exprFns[expr]) {
	                            this.exprFns[expr] = utils.createExprFn(
	                                this.config.getExprRegExp(),
	                                expr,
	                                this.exprCalculater
	                            );
	                        }
	                    }
	                    else if (nodeType === 3) {
	                        this.hasElseBranch = true;
	                    }
	                }
	                else {
	                    if (!branches[branchIndex].startNode) {
	                        branches[branchIndex].startNode = curNode;
	                    }
	                }
	
	                curNode = curNode.nextSibling;
	                if (!curNode || curNode === this.endNode) {
	                    setEndNode(curNode, branches, branchIndex);
	                    return true;
	                }
	            }, this);
	
	            this.branches = branches;
	            return branches;
	
	            function setEndNode(curNode, branches, branchIndex) {
	                if (branchIndex + 1 && branches[branchIndex].startNode) {
	                    branches[branchIndex].endNode = curNode.previousSibling;
	                }
	            }
	        },
	
	        onChange: function () {
	            var exprs = this.exprs;
	            for (var i = 0, il = exprs.length; i < il; i++) {
	                var expr = exprs[i];
	                var exprValue = this.exprFns[expr](this.scopeModel);
	                if (exprValue) {
	                    this.domUpdater.addTaskFn(
	                        this.handleBranchesTaskId,
	                        utils.bind(handleBranches, null, this.branches, i)
	                    );
	                    return;
	                }
	            }
	
	            if (this.hasElseBranch) {
	                this.domUpdater.addTaskFn(
	                    this.handleBranchesTaskId,
	                    utils.bind(handleBranches, null, this.branches, i)
	                );
	                return;
	            }
	        },
	
	        destroy: function () {
	            this.startNode = null;
	            this.endNode = null;
	            this.config = null;
	            this.exprs = null;
	            this.exprFns = null;
	
	            DirectiveParser.prototype.destroy.call(this);
	        }
	    },
	    {
	        isProperNode: function (node, config) {
	            return getIfNodeType(node, config) === 1;
	        },
	
	        findEndNode: function (ifStartNode, config) {
	            var curNode = ifStartNode;
	            while ((curNode = curNode.nextSibling)) {
	                if (isIfEndNode(curNode, config)) {
	                    return curNode;
	                }
	            }
	        },
	
	        getNoEndNodeError: function () {
	            return new Error('the if directive is not properly ended!');
	        },
	
	        $name: 'IfDirectiveParser'
	    }
	);
	
	Tree.registeParser(module.exports);
	
	function handleBranches(branches, showIndex) {
	    utils.each(branches, function (branch, j) {
	        var fn = j === showIndex ? 'restoreFromDark' : 'goDark';
	        utils.each(branch, function (parserObj) {
	            parserObj.parser[fn]();
	        });
	    });
	}
	
	function isIfEndNode(node, config) {
	    return getIfNodeType(node, config) === 4;
	}
	
	function getIfNodeType(node, config) {
	    if (node.nodeType !== 8) {
	        return;
	    }
	
	    if (config.ifPrefixRegExp.test(node.nodeValue)) {
	        return 1;
	    }
	
	    if (config.elifPrefixRegExp.test(node.nodeValue)) {
	        return 2;
	    }
	
	    if (config.elsePrefixRegExp.test(node.nodeValue)) {
	        return 3;
	    }
	
	    if (config.ifEndPrefixRegExp.test(node.nodeValue)) {
	        return 4;
	    }
	}


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file 处理了事件的 ExprParser
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */
	
	var ExprParser = __webpack_require__(26);
	var utils = __webpack_require__(6);
	var Tree = __webpack_require__(5);
	var ScopeModel = __webpack_require__(10);
	
	module.exports = ExprParser.extends(
	    {
	
	        /**
	         * 初始化
	         *
	         * @protected
	         */
	        initialize: function () {
	            ExprParser.prototype.initialize.apply(this, arguments);
	
	            this.events = {};
	        },
	
	        /**
	         * 添加表达式
	         *
	         * @inherit
	         * @protected
	         * @param {Attr} attr 如果当前是元素节点，则要传入遍历到的属性，
	         *                    所以attr存在与否是判断当前元素是否是文本节点的一个依据
	         * @return {undefined}
	         */
	        addExpr: function (attr) {
	            if (!attr) {
	                return ExprParser.prototype.addExpr.apply(this, arguments);
	            }
	
	            var eventName = getEventName(attr.name, this.config);
	            if (eventName) {
	                if (this.config.getExprRegExp().test(attr.value)) {
	                    this.events[eventName] = attr.value;
	
	                    var expr = attr.value.replace(
	                        this.config.getExprRegExp(),
	                        function () {
	                            return arguments[1];
	                        }
	                    );
	                    this.exprCalculater.createExprFn(expr, true);
	
	                    var me = this;
	                    this.node['on' + eventName] = function (event) {
	                        var localScope = new ScopeModel();
	                        localScope.set('event', event);
	                        localScope.setParent(me.getScope());
	                        me.exprCalculater.calculate(expr, true, localScope);
	                    };
	                }
	            }
	            else {
	                ExprParser.prototype.addExpr.apply(this, arguments);
	            }
	        },
	
	        /**
	         * 销毁
	         *
	         * @inherit
	         * @public
	         */
	        destroy: function () {
	            utils.each(this.events, function (attrValue, eventName) {
	                this.node['on' + eventName] = null;
	            }, this);
	            this.events = null;
	
	            ExprParser.prototype.destroy.apply(this);
	        }
	    },
	    {
	        $name: 'EventExprParser'
	    }
	);
	
	Tree.registeParser(module.exports);
	
	
	function getEventName(attrName, config) {
	    if (attrName.indexOf(config.eventPrefix + '-') === -1) {
	        return;
	    }
	
	    return attrName.replace(config.eventPrefix + '-', '');
	}
	


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file 表达式解析器，一个文本节点或者元素节点对应一个表达式解析器实例
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */
	
	var Parser = __webpack_require__(15);
	var utils = __webpack_require__(6);
	var Tree = __webpack_require__(5);
	var DomUpdater = __webpack_require__(8);
	
	module.exports = Parser.extends(
	    {
	
	        /**
	         * 初始化
	         *
	         * @inheritDoc
	         * @param  {Object} options 参数
	         * @param  {Node} options.node DOM节点
	         */
	        initialize: function (options) {
	            Parser.prototype.initialize.apply(this, arguments);
	
	            this.node = options.node;
	
	            this.exprs = [];
	            this.exprFns = {};
	            this.updateFns = {};
	            // 恢复原貌的函数
	            this.restoreFns = {};
	            this.exprOldValues = {};
	        },
	
	        /**
	         * 搜集过程
	         *
	         * @public
	         * @return {boolean} 返回布尔值
	         */
	        collectExprs: function () {
	            var curNode = this.node;
	
	            // 文本节点
	            if (curNode.nodeType === 3) {
	                this.addExpr();
	                return true;
	            }
	
	            // 元素节点
	            if (curNode.nodeType === 1) {
	                var attributes = curNode.attributes;
	                for (var i = 0, il = attributes.length; i < il; i++) {
	                    this.addExpr(attributes[i]);
	                }
	                return true;
	            }
	
	            return false;
	        },
	
	        /**
	         * 添加表达式
	         *
	         * @protected
	         * @param {Attr} attr 如果当前是元素节点，则要传入遍历到的属性，
	         *                    所以attr存在与否是判断当前元素是否是文本节点的一个依据
	         */
	        addExpr: function (attr) {
	            var expr = attr ? attr.value : this.node.nodeValue;
	            if (!this.config.getExprRegExp().test(expr)) {
	                return;
	            }
	            addExpr(
	                this,
	                expr,
	                attr ? createAttrUpdateFn(this.node, attr.name, this.domUpdater) : (function (me, curNode) {
	                    var taskId = me.domUpdater.generateTaskId();
	                    return function (exprValue) {
	                        me.domUpdater.addTaskFn(
	                            taskId,
	                            utils.bind(function (curNode, exprValue) {
	                                curNode.nodeValue = exprValue;
	                            }, null, curNode, exprValue)
	                        );
	                    };
	                })(this, this.node)
	            );
	
	            this.restoreFns[expr] = this.restoreFns[expr] || [];
	            if (attr) {
	                this.restoreFns[expr].push(utils.bind(function (curNode, attrName, attrValue) {
	                    curNode.setAttribute(attrName, attrValue);
	                }, null, this.node, attr.name, attr.value));
	            }
	            else {
	                this.restoreFns[expr].push(utils.bind(function (curNode, nodeValue) {
	                    curNode.nodeValue = nodeValue;
	                }, null, this.node, this.node.nodeValue));
	            }
	        },
	
	        /**
	         * 获取开始节点
	         *
	         * @protected
	         * @inheritDoc
	         * @return {Node}
	         */
	        getStartNode: function () {
	            return this.node;
	        },
	
	        /**
	         * 获取结束节点
	         *
	         * @protected
	         * @inheritDoc
	         * @return {Node}
	         */
	        getEndNode: function () {
	            return this.node;
	        },
	
	        /**
	         * 销毁
	         *
	         * @inheritDoc
	         */
	        destroy: function () {
	            utils.each(this.exprs, function (expr) {
	                utils.each(this.restoreFns[expr], function (restoreFn) {
	                    restoreFn();
	                }, this);
	            }, this);
	
	            this.node = null;
	            this.exprs = null;
	            this.exprFns = null;
	            this.updateFns = null;
	            this.exprOldValues = null;
	            this.restoreFns = null;
	
	            Parser.prototype.destroy.call(this);
	        },
	
	        /**
	         * 节点“隐藏”起来
	         *
	         * @public
	         */
	        goDark: function () {
	            utils.goDark(this.node);
	            this.isGoDark = true;
	        },
	
	        /**
	         * 在model发生改变的时候计算一下表达式的值->脏检测->更新界面。
	         *
	         * @protected
	         */
	        onChange: function () {
	            if (this.isGoDark) {
	                return;
	            }
	
	            var exprs = this.exprs;
	            var exprOldValues = this.exprOldValues;
	            for (var i = 0, il = exprs.length; i < il; i++) {
	                var expr = exprs[i];
	                var exprValue = this.exprFns[expr](this.scopeModel);
	
	                if (this.dirtyCheck(expr, exprValue, exprOldValues[expr])) {
	                    var updateFns = this.updateFns[expr];
	                    for (var j = 0, jl = updateFns.length; j < jl; j++) {
	                        updateFns[j](exprValue);
	                    }
	                }
	
	                exprOldValues[expr] = exprValue;
	            }
	
	            Parser.prototype.onChange.apply(this, arguments);
	        },
	
	        /**
	         * 节点“显示”出来
	         *
	         * @public
	         */
	        restoreFromDark: function () {
	            utils.restoreFromDark(this.node);
	            this.isGoDark = false;
	        }
	    },
	    {
	
	        /**
	         * 判断节点是否是应该由当前处理器来处理
	         *
	         * @static
	         * @param  {Node}  node 节点
	         * @return {boolean}
	         */
	        isProperNode: function (node) {
	            return node.nodeType === 1 || node.nodeType === 3;
	        },
	
	        $name: 'ExprParser'
	    }
	);
	
	Tree.registeParser(module.exports);
	
	/**
	 * 创建DOM节点属性更新函数
	 *
	 * @inner
	 * @param  {Node} node    DOM中的节点
	 * @param {string} name 要更新的属性名
	 * @param  {DomUpdater} domUpdater DOM更新器
	 * @return {function(Object)}      更新函数
	 */
	function createAttrUpdateFn(node, name, domUpdater) {
	    var taskId = domUpdater.generateTaskId();
	    return function (exprValue) {
	        domUpdater.addTaskFn(
	            taskId,
	            utils.bind(function (node, name, exprValue) {
	                DomUpdater.setAttr(node, name, exprValue);
	            }, null, node, name, exprValue)
	        );
	    };
	}
	
	function addExpr(parser, expr, updateFn) {
	    parser.exprs.push(expr);
	    if (!parser.exprFns[expr]) {
	        parser.exprFns[expr] = createExprFn(parser, expr);
	    }
	    parser.updateFns[expr] = parser.updateFns[expr] || [];
	    parser.updateFns[expr].push(updateFn);
	}
	
	/**
	 * 创建根据scopeModel计算表达式值的函数
	 *
	 * @inner
	 * @param  {Parser} parser 解析器实例
	 * @param  {string} expr   含有表达式的字符串
	 * @return {function(Scope):*}
	 */
	function createExprFn(parser, expr) {
	    return function (scopeModel) {
	        // 此处要分两种情况：
	        // 1、expr并不是纯正的表达式，如`==${name}==`。
	        // 2、expr是纯正的表达式，如`${name}`。
	        // 对于不纯正表达式的情况，此处的返回值肯定是字符串；
	        // 而对于纯正的表达式，此处就不要将其转换成字符串形式了。
	
	        var regExp = parser.config.getExprRegExp();
	
	        var possibleExprCount = expr.match(new RegExp(utils.regExpEncode(parser.config.exprPrefix), 'g'));
	        possibleExprCount = possibleExprCount ? possibleExprCount.length : 0;
	
	        // 不纯正
	        if (possibleExprCount !== 1 || expr.replace(regExp, '')) {
	            return expr.replace(regExp, function () {
	                parser.exprCalculater.createExprFn(arguments[1]);
	                return parser.exprCalculater.calculate(arguments[1], false, scopeModel);
	            });
	        }
	
	        // 纯正
	        var pureExpr = expr.slice(parser.config.exprPrefix.length, -parser.config.exprSuffix.length);
	        parser.exprCalculater.createExprFn(pureExpr);
	        return parser.exprCalculater.calculate(pureExpr, false, scopeModel);
	    };
	}


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file 变量定义指令解析器
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */
	
	var DirectiveParser = __webpack_require__(19);
	var Tree = __webpack_require__(5);
	
	module.exports = DirectiveParser.extends(
	    {
	        initialize: function (options) {
	            DirectiveParser.prototype.initialize.apply(this, arguments);
	
	            this.node = options.node;
	        },
	
	        collectExprs: function () {
	            var expr = this.node.nodeValue.replace(this.config.varName + ':', '');
	            this.exprCalculater.createExprFn(expr);
	
	            var leftValueName = expr.match(/\s*.+(?=\=)/)[0].replace(/\s+/g, '');
	
	            var me = this;
	            this.exprFn = function (scopeModel) {
	                var oldValue = scopeModel.get(leftValueName);
	                var newValue = me.exprCalculater.calculate(expr, false, scopeModel);
	                if (oldValue !== newValue) {
	                    scopeModel.set(leftValueName, newValue);
	                }
	            };
	        },
	
	        setScope: function (scopeModel) {
	            DirectiveParser.prototype.setScope.apply(this, arguments);
	            this.exprFn(this.scopeModel);
	        },
	
	        /**
	         * 获取开始节点
	         *
	         * @protected
	         * @inheritDoc
	         * @return {Node}
	         */
	        getStartNode: function () {
	            return this.node;
	        },
	
	        /**
	         * 获取结束节点
	         *
	         * @protected
	         * @inheritDoc
	         * @return {Node}
	         */
	        getEndNode: function () {
	            return this.node;
	        }
	    },
	    {
	        isProperNode: function (node, config) {
	            return node.nodeType === 8
	                && node.nodeValue.replace(/^\s+/, '').indexOf(config.varName + ':') === 0;
	        },
	
	        $name: 'VarDirectiveParser'
	    }
	);
	
	Tree.registeParser(module.exports);
	


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file 组件基类
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */
	
	var utils = __webpack_require__(6);
	var ComponentTree = __webpack_require__(4);
	var ComponentChildren = __webpack_require__(29);
	var ComponentManager = __webpack_require__(16);
	var Base = __webpack_require__(13);
	
	module.exports = Base.extends(
	    {
	
	        /**
	         * 组件初始化
	         *
	         * @private
	         * @param  {options} options 初始化参数
	         * @param {Node} options.componentNode 组件在DOM树中的占位节点
	         * @param {Tree} options.tree 当前组件父级树
	         * @param {Event} options.event 外部传入的事件对象，主要用于组件内部发生的一些变化可以通知到外面
	         */
	        initialize: function (options) {
	            this.componentNode = options.componentNode;
	            this.tree = options.tree;
	            this.event = options.event;
	            this.childComponents = [];
	        },
	
	        setOutScope: function (outScope) {
	            this.outScope = outScope;
	        },
	
	        beforeMount: function () {},
	
	        afterMount: function () {},
	
	        beforeDestroy: function () {},
	
	        afterDestroy: function () {},
	
	        literalAttrReady: function () {},
	
	        /**
	         * 组件模板。子类可以覆盖这个属性。
	         *
	         * @protected
	         * @type {String}
	         */
	        tpl: '',
	
	        /**
	         * 设置组件属性。假如有如下组件：
	         *
	         * <ui-my-component title="${title}" name="Amy"></ui-my-component>
	         *
	         * 那么属性就有 title 和 name ，其中 name 的属性值不是一个表达式，所以在组件创建完成之后，就会被设置好；
	         * 而 title 属性值是一个表达式，需要监听 ${title} 表达式的值及其变化，然后再设置进来。
	         *
	         * 设置进来的值会被直接放到组件对应的 ComponentTree 实例的 rootScope 上面去。
	         *
	         * 对于ref属性，特殊化，需要用这个属性来查找子组件。
	         *
	         * setAttr和setData的区别在于：
	         * 1、setAttr可以设置一些非常特殊的属性，而这个属性不需要设置到scope中去，比如$$ref；
	         * 2、setAttr用于模板里面组件属性的设置，setData是直接在代码里面设置数据。
	         *
	         * @public
	         * @param {string} name  属性名
	         * @param {*} value 属性值
	         */
	        setAttr: function (name, value) {
	            if (name === 'ref') {
	                this.$$ref = value;
	                return;
	            }
	
	            if (name === 'classList') {
	                var classList = this.getData('classList', []);
	                classList.push.apply(classList, this.getClassList(value));
	                value = classList;
	            }
	
	            this.setData(name, value);
	        },
	
	        /**
	         * 转换一下klass
	         *
	         * @private
	         * @param  {(string|Array|Object)} klass css类
	         * @return {Array.<string>} css类数组
	         */
	        getClassList: function (klass) {
	            if (!klass) {
	                return [];
	            }
	
	            var klasses = [];
	            if (utils.isClass(klass, 'String')) {
	                klasses = klass.split(' ');
	            }
	            else if (utils.isPureObject(klass)) {
	                for (var k in klass) {
	                    if (klass[k]) {
	                        klasses.push(klass[k]);
	                    }
	                }
	            }
	            else if (utils.isArray(klass)) {
	                klasses = klass;
	            }
	
	            return klasses;
	        },
	
	        /**
	         * 给当前组件下的根级节点设置根级css类
	         *
	         * @private
	         * @param {Array.<string>} klasses css类
	         */
	        setClasses: function (klasses) {
	            utils.traverseNoChangeNodes(
	                this.startNode,
	                this.endNode,
	                function (curNode) {
	                    if (curNode.nodeType === 1) {
	                        curNode.classList.add.apply(curNode.classList, klasses);
	                    }
	                },
	                this
	            );
	        },
	
	        /**
	         * 组件挂载到 DOM 树中去。
	         *
	         * @private
	         */
	        mount: function () {
	            this.beforeMount();
	
	            var div = document.createElement('div');
	            div.innerHTML = this.tpl;
	            this.startNode = div.firstChild;
	            this.endNode = div.lastChild;
	
	            // 组件的作用域是和外部的作用域隔开的
	            var previousTree = this.tree;
	            this.tree = new ComponentTree({
	                startNode: this.startNode,
	                endNode: this.endNode,
	                config: previousTree.config,
	                domUpdater: previousTree.domUpdater,
	                exprCalculater: previousTree.exprCalculater,
	                componentChildren: new ComponentChildren(
	                    this.componentNode.firstChild,
	                    this.componentNode.lastChild,
	                    this.outScope,
	                    this
	                )
	            });
	            this.tree.setParent(previousTree);
	
	            var curComponentManager = this.tree.getTreeVar('componentManager', true);
	            curComponentManager.setParent(previousTree.getTreeVar('componentManager'));
	
	            this.tree.registeComponents(this.componentClasses);
	
	            this.tree.componentEvent.on('newcomponent', function (data) {
	                // 监听子组件的创建
	                this.childComponents.push(data);
	            }, this);
	
	            // 把组件节点放到 DOM 树中去
	            insertComponentNodes(this.componentNode, this.startNode, this.endNode);
	
	            this.tree.traverse();
	
	            // 设置组件特有的类
	            this.setData(
	                'classList',
	                ComponentManager.getCssClassName(this.constructor)
	            );
	
	            this.afterMount();
	
	            // 把组件节点放到 DOM 树中去
	            function insertComponentNodes(componentNode, startNode, endNode) {
	                var parentNode = componentNode.parentNode;
	                utils.traverseNodes(
	                    startNode,
	                    endNode,
	                    function (curNode) {
	                        parentNode.insertBefore(curNode, componentNode);
	                    }
	                );
	                parentNode.removeChild(componentNode);
	            }
	        },
	
	        /**
	         * 找到第一个满足条件的子组件
	         *
	         * @protected
	         * @param  {function(Component):boolean} filterFn 过滤函数
	         * @return {(Component|undefined)} 满足条件的组件，如果没有，则返回undefined
	         */
	        findComponent: function (filterFn) {
	            if (!utils.isFunction(filterFn)) {
	                return;
	            }
	
	            for (var i = 0, il = this.childComponents.length; i < il; ++i) {
	                if (filterFn(this.childComponents[i])) {
	                    return this.childComponents[i];
	                }
	            }
	        },
	
	        /**
	         * 找到第所有满足条件的子组件
	         *
	         * @protected
	         * @param  {function(Component):boolean} filterFn 过滤函数
	         * @return {Array.<Component>} 满足条件的所有组件
	         */
	        findComponents: function (filterFn) {
	            if (!utils.isFunction(filterFn)) {
	                return [];
	            }
	
	            var ret = [];
	            for (var i = 0, il = this.childComponents.length; i < il; ++i) {
	                if (filterFn(this.childComponents[i])) {
	                    ret.push(this.childComponents[i]);
	                }
	            }
	        },
	
	        /**
	         * 根据ref查找子组件或者子节点。
	         *
	         * @protected
	         * @param  {string} ref ref值
	         * @return {(Component|Node)} 符合条件的子组件或节点
	         */
	        ref: function (ref) {
	            var ret = this.findComponent(function (component) {
	                return component.$$ref === ref;
	            });
	
	            // 不存在这样的子组件，那么就要去看看是否存在这样的子节点
	            if (!ret) {
	                ret = walk.call(this, this.startNode, this.endNode, function (curNode) {
	                    var attr = curNode.getAttribute('ref');
	                    return attr && attr === ref;
	                });
	            }
	
	            return ret;
	
	            function walk(startNode, endNode, iteraterFn) {
	                if (!startNode || !endNode) {
	                    return;
	                }
	
	                if (startNode === endNode) {
	                    if (iteraterFn(startNode)) {
	                        return startNode;
	                    }
	
	                    return walk.call(this, startNode.firstElementChild, startNode.lastElementChild, iteraterFn);
	                }
	
	                var curNode = startNode;
	
	                iterater:
	                while (curNode) {
	                    for (var i = 0, il = this.childComponents.length; i < il; ++i) {
	                        if (this.childComponents[i].startNode === curNode) {
	                            if (this.childComponents[i].endNode === endNode) {
	                                return;
	                            }
	                            curNode = this.childComponents[i].endNode.nextElementSibling;
	                            break;
	                        }
	                    }
	
	                    if (iteraterFn(curNode)) {
	                        return curNode;
	                    }
	
	                    var result = walk.call(this, curNode.firstElementChild, curNode.lastElementChild, iteraterFn);
	                    if (result) {
	                        return result;
	                    }
	
	                    if (curNode === endNode) {
	                        return;
	                    }
	
	                    curNode = curNode.nextElementSibling;
	                }
	            }
	        },
	
	        /**
	         * 设置数据。
	         *
	         * classList是一个特殊属性，用于设置组件的css类。
	         *
	         * @protected
	         * @param {string|Object} name 如果是字符串，那么第二个就是要设置的值；
	         *                             如果是对象，那么就不管第二个，就认为这个对象就是要设置的键值对。
	         * @param {*=} value 要设置的值
	         */
	        setData: function (name, value) {
	            if (!this.tree || !this.tree.rootScope) {
	                throw new Error('component is not ready');
	            }
	            var scope = this.tree.rootScope;
	            scope.set.call(scope, name, value);
	
	            if (name === 'classList') {
	                this.setClasses(value);
	            }
	        },
	
	        /**
	         * 获取指定键路径的值，如果不存在的话，就返回默认值
	         *
	         * @protected
	         * @param  {string|Array.<string>} names 如果是一个字符串，那么就直接ScopeModel#get了；
	         *                                       如果是一个数组，那么说明需要走一个键的路径了。
	         * @param  {*=} dft   如果没取到的默认值
	         * @return {*}       返回取到的值
	         */
	        getData: function (names, dft) {
	            if (!this.tree || !this.tree.rootScope) {
	                throw new Error('component is not ready');
	            }
	
	            var scope = this.tree.rootScope;
	            if (utils.isClass(names, 'String')) {
	                var ret = scope.get(names);
	                ret === undefined ? dft : ret;
	                return ret;
	            }
	
	            if (utils.isArray(names)) {
	                var curValue;
	                for (var i = 0, il = names.length; i < il; ++i) {
	                    var name = names[i];
	                    if (i === 0) {
	                        curValue = scope.get(name);
	                    }
	                    else {
	                        curValue = curValue[name];
	                    }
	
	                    if (curValue === undefined) {
	                        return dft;
	                    }
	                }
	            }
	
	            return dft;
	        },
	
	        /**
	         * 销毁
	         *
	         * @public
	         */
	        destroy: function () {
	            this.beforeDestroy();
	
	            this.tree.destroy();
	
	            this.componentNode = null;
	            this.tree = null;
	            this.outScope = null;
	            this.startNode = null;
	            this.endNode = null;
	
	            this.afterDestroy();
	        },
	
	        /**
	         * 隐藏模板
	         *
	         * @public
	         */
	        goDark: function () {
	            utils.traverseNoChangeNodes(
	                this.startNode,
	                this.endNode,
	                utils.goDark,
	                this
	            );
	        },
	
	        /**
	         * 显示模板
	         *
	         * @public
	         */
	        restoreFromDark: function () {
	            utils.traverseNoChangeNodes(
	                this.startNode,
	                this.endNode,
	                utils.restoreFromDark,
	                this
	            );
	        }
	    },
	    {
	
	        /**
	         * 获取样式字符串。
	         *
	         * @static
	         * @return {string} 样式字符串
	         */
	        getStyle: function () {
	            return '';
	        },
	
	        $name: 'Component'
	    }
	);
	


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file 组件的 <!-- children --> 实例，记录相关信息，方便后续 ChildrenDirectiveParser 解析
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */
	
	var utils = __webpack_require__(6);
	
	function ComponentChildren(startNode, endNode, scope, component) {
	    this.div = document.createElement('div');
	    if (!startNode || !endNode) {
	        this.div.innerHTML = '';
	    }
	    else {
	        utils.traverseNodes(
	            startNode,
	            endNode,
	            function (curNode) {
	                this.div.appendChild(curNode);
	            },
	            this
	        );
	    }
	
	    this.scope = scope;
	    this.component = component;
	}
	
	ComponentChildren.prototype.getTplHtml = function () {
	    return this.div.innerHTML;
	};
	
	module.exports = ComponentChildren;


/***/ },
/* 30 */
/***/ function(module, exports) {

	module.exports = "<button class=\"${classList}\" event-click=\"${onClick(event)}\">\n    <!-- children -->\n</button>";

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(32)();
	// imports
	
	
	// module
	exports.push([module.id, ".button,\n.button:active {\n  background: #f6f6f6;\n  height: 30px;\n  outline: none;\n  border: none;\n  cursor: pointer;\n}\n.button:hover {\n  opacity: .8;\n}\n.button:active {\n  opacity: 1;\n}\n.button.skin-primary {\n  background: #70ccc0;\n  color: #fff;\n}\n.button.skin-success {\n  background: #80dda1;\n  color: #fff;\n}\n.button.skin-info {\n  background: #6bd5ec;\n  color: #fff;\n}\n.button.skin-warning {\n  background: #f9ad42;\n  color: #fff;\n}\n.button.skin-danger {\n  background: #f16c6c;\n  color: #fff;\n}\n.button.skin-link {\n  color: #70ccc0;\n  background: none;\n}\n", ""]);
	
	// exports


/***/ },
/* 32 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 33 */,
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file children 指令 <!-- children --> ，只有组件中才会存在该指令
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */
	
	var DirectiveParser = __webpack_require__(19);
	var ChildrenTree = __webpack_require__(35);
	
	module.exports = DirectiveParser.extends(
	    {
	        initialize: function (options) {
	            DirectiveParser.prototype.initialize.apply(this, arguments);
	
	            this.node = options.node;
	        },
	
	        collectExprs: function () {
	            var componentChildren = this.tree.getTreeVar('componentChildren', true);
	            if (!componentChildren) {
	                return;
	            }
	
	            var div = document.createElement('div');
	            div.innerHTML = componentChildren.getTplHtml();
	
	            this.childrenTree = new ChildrenTree({
	                startNode: div.firstChild,
	                endNode: div.lastChild,
	                config: this.tree.config,
	                domUpdater: this.tree.domUpdater,
	                exprCalculater: this.tree.exprCalculater
	            });
	            this.childrenTree.setParent(this.tree);
	            this.childrenTree.traverse();
	
	            this.childrenTree.rootScope.setParent(componentChildren.scope);
	            componentChildren.scope.addChild(this.childrenTree.rootScope);
	
	            while (div.childNodes.length) {
	                this.node.parentNode.insertBefore(div.childNodes[0], this.node);
	            }
	
	            return true;
	        },
	
	        /**
	         * 获取开始节点
	         *
	         * @protected
	         * @inheritDoc
	         * @return {Node}
	         */
	        getStartNode: function () {
	            if (!this.childrenTree) {
	                return this.node;
	            }
	            return this.childrenTree.startNode;
	        },
	
	        /**
	         * 获取结束节点
	         *
	         * @protected
	         * @inheritDoc
	         * @return {Node}
	         */
	        getEndNode: function () {
	            return this.node;
	        },
	
	        destroy: function () {
	            this.childrenTree.destroy();
	
	            this.node = null;
	            this.childrenTree = null;
	
	            DirectiveParser.prototype.destroy.apply(this);
	        }
	    },
	    {
	        isProperNode: function (node, config) {
	            return node.nodeType === 8
	                && node.nodeValue.replace(/\s/g, '') === 'children';
	        },
	
	        $name: 'ChildrenDirectiveParser'
	    }
	);
	
	ChildrenTree.registeParser(module.exports);


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file 子树
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */
	
	var Tree = __webpack_require__(5);
	
	module.exports = Tree.extends(
	    {
	        initialize: function (options) {
	            if (!options.config
	                || !options.domUpdater
	                || !options.exprCalculater
	            ) {
	                throw new Error('wrong arguments');
	            }
	
	            options.componentChildren = undefined;
	            delete options.componentChildren;
	
	            Tree.prototype.initialize.apply(this, arguments);
	        }
	    },
	    {
	        $name: 'ChildrenTree'
	    }
	);


/***/ },
/* 36 */
/***/ function(module, exports) {

	module.exports = "<ui-button on-click=\"${click}\">Button</ui-button>\n<ui-button class-list=\"skin-primary\">Primary</ui-button>\n<ui-button class-list=\"skin-success\">Success</ui-button>\n<ui-button class-list=\"skin-info\">Info</ui-button>\n<ui-button class-list=\"skin-warning\">Warning</ui-button>\n<ui-button class-list=\"skin-danger\">Danger</ui-button>\n<ui-button class-list=\"skin-link\">Link</ui-button>\n";

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYjc1MWQwNTRlZmUzOTkxODExNmIiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9CdXR0b24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0J1dHRvbi9CdXR0b24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0NvbnRyb2wuanMiLCJ3ZWJwYWNrOi8vLy4uL3Zjb21wb25lbnQvc3JjL21haW4uanMiLCJ3ZWJwYWNrOi8vLy4uL3Zjb21wb25lbnQvc3JjL0NvbXBvbmVudFRyZWUuanMiLCJ3ZWJwYWNrOi8vLy4uL3Z0cGwvc3JjL3RyZWVzL1RyZWUuanMiLCJ3ZWJwYWNrOi8vLy4uL3Z0cGwvc3JjL3V0aWxzLmpzIiwid2VicGFjazovLy8uLi92dHBsL3NyYy9FeHByQ2FsY3VsYXRlci5qcyIsIndlYnBhY2s6Ly8vLi4vdnRwbC9zcmMvRG9tVXBkYXRlci5qcyIsIndlYnBhY2s6Ly8vLi4vdnRwbC9zcmMvbG9nLmpzIiwid2VicGFjazovLy8uLi92dHBsL3NyYy9TY29wZU1vZGVsLmpzIiwid2VicGFjazovLy8uLi92dHBsL3NyYy9FdmVudC5qcyIsIndlYnBhY2s6Ly8vLi4vdnRwbC9zcmMvaW5oZXJpdC5qcyIsIndlYnBhY2s6Ly8vLi4vdnRwbC9zcmMvQmFzZS5qcyIsIndlYnBhY2s6Ly8vLi4vdmNvbXBvbmVudC9zcmMvQ29tcG9uZW50UGFyc2VyLmpzIiwid2VicGFjazovLy8uLi92dHBsL3NyYy9wYXJzZXJzL1BhcnNlci5qcyIsIndlYnBhY2s6Ly8vLi4vdmNvbXBvbmVudC9zcmMvQ29tcG9uZW50TWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi4vdnRwbC9tYWluLmpzIiwid2VicGFjazovLy8uLi92dHBsL3NyYy9wYXJzZXJzL1Njb3BlRGlyZWN0aXZlUGFyc2VyLmpzIiwid2VicGFjazovLy8uLi92dHBsL3NyYy9wYXJzZXJzL0RpcmVjdGl2ZVBhcnNlci5qcyIsIndlYnBhY2s6Ly8vLi4vdnRwbC9zcmMvQ29uZmlnLmpzIiwid2VicGFjazovLy8uLi92dHBsL3NyYy9EaXJ0eUNoZWNrZXIuanMiLCJ3ZWJwYWNrOi8vLy4uL3Z0cGwvc3JjL3BhcnNlcnMvRm9yRGlyZWN0aXZlUGFyc2VyLmpzIiwid2VicGFjazovLy8uLi92dHBsL3NyYy90cmVlcy9Gb3JUcmVlLmpzIiwid2VicGFjazovLy8uLi92dHBsL3NyYy9wYXJzZXJzL0lmRGlyZWN0aXZlUGFyc2VyLmpzIiwid2VicGFjazovLy8uLi92dHBsL3NyYy9wYXJzZXJzL0V2ZW50RXhwclBhcnNlci5qcyIsIndlYnBhY2s6Ly8vLi4vdnRwbC9zcmMvcGFyc2Vycy9FeHByUGFyc2VyLmpzIiwid2VicGFjazovLy8uLi92dHBsL3NyYy9wYXJzZXJzL1ZhckRpcmVjdGl2ZVBhcnNlci5qcyIsIndlYnBhY2s6Ly8vLi4vdmNvbXBvbmVudC9zcmMvQ29tcG9uZW50LmpzIiwid2VicGFjazovLy8uLi92Y29tcG9uZW50L3NyYy9Db21wb25lbnRDaGlsZHJlbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvQnV0dG9uL2J1dHRvbi50cGwuaHRtbCIsIndlYnBhY2s6Ly8vLi9zcmMvQnV0dG9uL2J1dHRvbi5sZXNzIiwid2VicGFjazovLy8uL34vY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanMiLCJ3ZWJwYWNrOi8vLy4uL3Zjb21wb25lbnQvc3JjL0NoaWxkcmVuRGlyZWN0aXZlUGFyc2VyLmpzIiwid2VicGFjazovLy8uLi92Y29tcG9uZW50L3NyYy9DaGlsZHJlblRyZWUuanMiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9idXR0b24udHBsLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUN0Q0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7Ozs7Ozs7O0FDNUJBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNiQTs7QUFFQSxpREFBZ0QsR0FBRyxpQkFBaUI7Ozs7Ozs7QUNGcEU7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7Ozs7Ozs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBZ0Isd0JBQXdCO0FBQ3hDLGdCQUFlLE9BQU87QUFDdEIsZ0JBQWUsRUFBRTtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLHNEQUFxRCxRQUFRO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQztBQUNEO0FBQ0EsRUFBQzs7Ozs7OztBQ3hERDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW1CLE9BQU87QUFDMUIsb0JBQW1CLEVBQUU7QUFDckIscUJBQW9CLFFBQVE7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQW9CLE9BQU87QUFDM0IscUJBQW9CLFNBQVM7QUFDN0I7QUFDQSxxQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYixVQUFTOztBQUVUO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBbUIsWUFBWTtBQUMvQixxQkFBb0IsT0FBTztBQUMzQixxQkFBb0IsT0FBTztBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBb0IsWUFBWTtB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O0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDcEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEc7Ozs7OztBQ1JBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMOzs7Ozs7O0FDcERBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFD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QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNoSUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDckJBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWE7QUFDYjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQSxjQUFhOztBQUViO0FBQ0E7QUFDQSxjQUFhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUFrRCxRQUFRO0FBQzFEO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3BLQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTs7QUFFYjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQSwrQ0FBOEMsUUFBUTtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1QsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3ZLQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW1CLEtBQUs7QUFDeEI7QUFDQSxxQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjs7QUFFQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7OztBQzlGQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQW9CLE9BQU87QUFDM0IscUJBQW9CLEtBQUs7QUFDekI7QUFDQTtBQUNBOztBQUVBOztB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O0FBQ0EsVUFBUzs7QUFFVDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDekZBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUMxQkEsMkNBQTBDLE1BQU0sbVgiLCJmaWxlIjoiQnV0dG9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCBiNzUxZDA1NGVmZTM5OTE4MTE2YlxuICoqLyIsInZhciBCdXR0b24gPSByZXF1aXJlKCcuLi9zcmMvQnV0dG9uL0J1dHRvbicpO1xudmFyIHZjb21wb25lbnQgPSByZXF1aXJlKCd2Y29tcG9uZW50Jyk7XG5cbnZhciBNYWluID0gdmNvbXBvbmVudC5Db21wb25lbnQuZXh0ZW5kcyhcbiAgICB7XG4gICAgICAgIHRwbDogcmVxdWlyZSgnLi9idXR0b24udHBsLmh0bWwnKSxcbiAgICAgICAgY29tcG9uZW50Q2xhc3NlczogW0J1dHRvbl0sXG4gICAgICAgIGxpdGVyYWxBdHRyUmVhZHk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ2NsaWNrJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgJG5hbWU6ICdNYWluJ1xuICAgIH1cbik7XG5cbnZhciBtYWluID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4nKTtcbnZjb21wb25lbnQubW91bnQoXG4gICAge1xuICAgICAgICBjb25maWc6IG5ldyB2Y29tcG9uZW50LkNvbmZpZygpLFxuICAgICAgICBzdGFydE5vZGU6IG1haW4sXG4gICAgICAgIGVuZE5vZGU6IG1haW5cbiAgICB9LFxuICAgIFtNYWluXVxuKTtcblxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3Rlc3QvQnV0dG9uLmpzXG4gKiogbW9kdWxlIGlkID0gMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIENvbnRyb2wgPSByZXF1aXJlKCcuLi9Db250cm9sJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ29udHJvbC5leHRlbmRzKFxuICAgIHtcbiAgICAgICAgdHBsOiByZXF1aXJlKCcuL2J1dHRvbi50cGwuaHRtbCcpXG4gICAgfSxcbiAgICB7XG4gICAgICAgICRuYW1lOiAnQnV0dG9uJyxcblxuICAgICAgICBnZXRTdHlsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlcXVpcmUoJy4vYnV0dG9uLmxlc3MnKVswXVsxXTtcbiAgICAgICAgfVxuICAgIH1cbik7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL0J1dHRvbi9CdXR0b24uanNcbiAqKiBtb2R1bGUgaWQgPSAxXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMVxuICoqLyIsInZhciB2Y29tcG9uZW50ID0gcmVxdWlyZSgndmNvbXBvbmVudCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHZjb21wb25lbnQuQ29tcG9uZW50LmV4dGVuZHMoe30sIHskbmFtZTogJ0NvbnRyb2wnfSk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL0NvbnRyb2wuanNcbiAqKiBtb2R1bGUgaWQgPSAyXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMVxuICoqLyIsInJlcXVpcmUoJy4vQ2hpbGRyZW5EaXJlY3RpdmVQYXJzZXInKTtcbnZhciBDb21wb25lbnRUcmVlID0gcmVxdWlyZSgnLi9Db21wb25lbnRUcmVlJyk7XG52YXIgZG9tRGF0YUJpbmQgPSByZXF1aXJlKCd2dHBsJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIENvbXBvbmVudDogcmVxdWlyZSgnLi9Db21wb25lbnQnKSxcbiAgICBtb3VudDogZnVuY3Rpb24gKG9wdGlvbnMsIENvbXBvbmVudENsYXNzZXMpIHtcbiAgICAgICAgdmFyIHRyZWUgPSBuZXcgQ29tcG9uZW50VHJlZShvcHRpb25zKTtcbiAgICAgICAgdHJlZS5yZWdpc3RlQ29tcG9uZW50cyhDb21wb25lbnRDbGFzc2VzKTtcbiAgICAgICAgdHJlZS50cmF2ZXJzZSgpO1xuICAgICAgICByZXR1cm4gdHJlZTtcbiAgICB9LFxuICAgIENvbmZpZzogZG9tRGF0YUJpbmQuQ29uZmlnXG59O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92Y29tcG9uZW50L3NyYy9tYWluLmpzXG4gKiogbW9kdWxlIGlkID0gM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwIDFcbiAqKi8iLCJ2YXIgVHJlZSA9IHJlcXVpcmUoJ3Z0cGwvc3JjL3RyZWVzL1RyZWUnKTtcbnZhciBDb21wb25lbnRQYXJzZXIgPSByZXF1aXJlKCcuL0NvbXBvbmVudFBhcnNlcicpO1xudmFyIEV2ZW50ID0gcmVxdWlyZSgndnRwbC9zcmMvRXZlbnQnKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJ3Z0cGwvc3JjL3V0aWxzJyk7XG52YXIgQ29tcG9uZW50TWFuYWdlciA9IHJlcXVpcmUoJy4vQ29tcG9uZW50TWFuYWdlcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRyZWUuZXh0ZW5kcyh7XG5cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICBUcmVlLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgdGhpcy5jb21wb25lbnRFdmVudCA9IG5ldyBFdmVudCgpO1xuICAgICAgICBpZiAob3B0aW9ucy5jb21wb25lbnRDaGlsZHJlbikge1xuICAgICAgICAgICAgdGhpcy5zZXRUcmVlVmFyKCdjb21wb25lbnRDaGlsZHJlbicsIG9wdGlvbnMuY29tcG9uZW50Q2hpbGRyZW4pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNvbXBvbmVudE1hbmFnZXIgPSBuZXcgQ29tcG9uZW50TWFuYWdlcigpO1xuICAgICAgICBjb21wb25lbnRNYW5hZ2VyLnNldFBhcmVudCh0aGlzLmdldFRyZWVWYXIoJ2NvbXBvbmVudE1hbmFnZXInKSk7XG4gICAgICAgIHRoaXMuc2V0VHJlZVZhcignY29tcG9uZW50TWFuYWdlcicsIGNvbXBvbmVudE1hbmFnZXIpO1xuICAgIH0sXG5cbiAgICBjcmVhdGVQYXJzZXI6IGZ1bmN0aW9uIChQYXJzZXJDbGFzcywgb3B0aW9ucykge1xuICAgICAgICB2YXIgaW5zdGFuY2UgPSBUcmVlLnByb3RvdHlwZS5jcmVhdGVQYXJzZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgICAgICBpZiAoaW5zdGFuY2UgJiYgUGFyc2VyQ2xhc3MgPT09IENvbXBvbmVudFBhcnNlcikge1xuICAgICAgICAgICAgaW5zdGFuY2UucGFyc2VyLnNldENvbXBvbmVudEV2ZW50KHRoaXMuY29tcG9uZW50RXZlbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDms6jlhoznu4Tku7bnsbtcbiAgICAgKiDorr7nva7nu5HlrprlnKjmoJHkuIrpnaLnmoTpop3lpJblj5jph4/jgILov5nkupvlj5jph4/mnInlpoLkuIvnibnmgKfvvJpcbiAgICAgKiAx44CB5peg5rOV6KaG55uW77ybXG4gICAgICogMuOAgeWcqOiOt+WPlnRyZWVWYXJz5LiK6Z2i5p+Q5Liq5Y+Y6YeP55qE5pe25YCZ77yM5aaC5p6c5b2T5YmN5qCR5Y+W5Ye65p2l5pivdW5kZWZpbmVk77yM6YKj5LmI5bCx5Lya5Yiw54i257qn5qCR55qEdHJlZVZhcnPkuIrljrvmib7vvIzku6XmraTnsbvmjqjjgIJcbiAgICAgKlxuICAgICAqIEBwdWJsaWNcbiAgICAgKiBAcGFyYW0gIHtNYXAuPHN0cmluZywgQ29tcG9uZW50Pn0gY29tcG9uZW50Q2xhc3NlcyDnu4Tku7blkI3lkoznu4Tku7bnsbvnmoTmmKDlsIRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAg5Y+Y6YeP5ZCNXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSDlj5jph4/lgLxcbiAgICAgKi9cbiAgICByZWdpc3RlQ29tcG9uZW50czogZnVuY3Rpb24gKGNvbXBvbmVudENsYXNzZXMpIHtcbiAgICAgICAgaWYgKCF1dGlscy5pc0FycmF5KGNvbXBvbmVudENsYXNzZXMpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY29tcG9uZW50TWFuYWdlciA9IHRoaXMuZ2V0VHJlZVZhcignY29tcG9uZW50TWFuYWdlcicpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IGNvbXBvbmVudENsYXNzZXMubGVuZ3RoOyBpIDwgaWw7ICsraSkge1xuICAgICAgICAgICAgdmFyIGNvbXBvbmVudENsYXNzID0gY29tcG9uZW50Q2xhc3Nlc1tpXTtcbiAgICAgICAgICAgIGNvbXBvbmVudE1hbmFnZXIucmVnaXN0ZShjb21wb25lbnRDbGFzcyk7XG4gICAgICAgIH1cbiAgICB9XG59LCB7XG4gICAgJG5hbWU6ICdDb21wb25lbnRUcmVlJ1xufSk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Zjb21wb25lbnQvc3JjL0NvbXBvbmVudFRyZWUuanNcbiAqKiBtb2R1bGUgaWQgPSA0XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMVxuICoqLyIsIi8qKlxuICogQGZpbGUg5pyA57uI55qE5qCRXG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20pXG4gKi9cblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcbnZhciBFeHByQ2FsY3VsYXRlciA9IHJlcXVpcmUoJy4uL0V4cHJDYWxjdWxhdGVyJyk7XG52YXIgRG9tVXBkYXRlciA9IHJlcXVpcmUoJy4uL0RvbVVwZGF0ZXInKTtcbnZhciBTY29wZU1vZGVsID0gcmVxdWlyZSgnLi4vU2NvcGVNb2RlbCcpO1xudmFyIEJhc2UgPSByZXF1aXJlKCcuLi9CYXNlJyk7XG5cbnZhciBQYXJzZXJDbGFzc2VzID0gW107XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZS5leHRlbmRzKFxuICAgIHtcbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIEJhc2UucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgICAgICAgICAgdGhpcy5zdGFydE5vZGUgPSBvcHRpb25zLnN0YXJ0Tm9kZTtcbiAgICAgICAgICAgIHRoaXMuZW5kTm9kZSA9IG9wdGlvbnMuZW5kTm9kZTtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnID0gb3B0aW9ucy5jb25maWc7XG5cbiAgICAgICAgICAgIHRoaXMuZXhwckNhbGN1bGF0ZXIgPSBvcHRpb25zLmV4cHJDYWxjdWxhdGVyIHx8IG5ldyBFeHByQ2FsY3VsYXRlcigpO1xuICAgICAgICAgICAgdGhpcy5kb21VcGRhdGVyID0gb3B0aW9ucy5kb21VcGRhdGVyIHx8IG5ldyBEb21VcGRhdGVyKCk7XG4gICAgICAgICAgICB0aGlzLmRpcnR5Q2hlY2tlciA9IG9wdGlvbnMuZGlydHlDaGVja2VyO1xuXG4gICAgICAgICAgICB0aGlzLnRyZWUgPSBbXTtcbiAgICAgICAgICAgIHRoaXMudHJlZVZhcnMgPSB7fTtcblxuICAgICAgICAgICAgdGhpcy5yb290U2NvcGUgPSBuZXcgU2NvcGVNb2RlbCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDorr7nva7nu5HlrprlnKjmoJHkuIrpnaLnmoTpop3lpJblj5jph4/jgILov5nkupvlj5jph4/mnInlpoLkuIvnibnmgKfvvJpcbiAgICAgICAgICogMeOAgeaXoOazleimhueblu+8m1xuICAgICAgICAgKiAy44CB5Zyo6I635Y+WdHJlZVZhcnPkuIrpnaLmn5DkuKrlj5jph4/nmoTml7blgJnvvIzlpoLmnpzlvZPliY3moJHlj5blh7rmnaXmmK91bmRlZmluZWTvvIzpgqPkuYjlsLHkvJrliLDniLbnuqfmoJHnmoR0cmVlVmFyc+S4iuWOu+aJvu+8jOS7peatpOexu+aOqOOAglxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lICDlj5jph4/lkI1cbiAgICAgICAgICogQHBhcmFtIHsqfSB2YWx1ZSDlj5jph4/lgLxcbiAgICAgICAgICogQHJldHVybiB7Ym9vbGVhbn0g5piv5ZCm6K6+572u5oiQ5YqfXG4gICAgICAgICAqL1xuICAgICAgICBzZXRUcmVlVmFyOiBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnRyZWVWYXJzW25hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnRyZWVWYXJzW25hbWVdID0gdmFsdWU7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICB1bnNldFRyZWVWYXI6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICB0aGlzLnRyZWVWYXJzW25hbWVdID0gdW5kZWZpbmVkO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5bnu5HlrprliLDmoJHkuIrnmoTpop3lpJblj5jph49cbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IG5hbWUgICAgICAgICAgICAgICAgICDlj5jph4/lkI1cbiAgICAgICAgICogQHBhcmFtICB7Ym9vbGVhbj19IHNob3VsZE5vdEZpbmRJblBhcmVudCDlpoLmnpzlnKjlvZPliY3moJHkuK3msqHmib7liLDvvIzmmK/lkKbliLDniLbnuqfmoJHkuK3ljrvmib7jgIJcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRydWXlsLHku6PooajkuI3ljrvvvIxmYWxzZeWwseS7o+ihqOimgeWOu1xuICAgICAgICAgKiBAcmV0dXJuIHsqfVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0VHJlZVZhcjogZnVuY3Rpb24gKG5hbWUsIHNob3VsZE5vdEZpbmRJblBhcmVudCkge1xuICAgICAgICAgICAgdmFyIHZhbCA9IHRoaXMudHJlZVZhcnNbbmFtZV07XG4gICAgICAgICAgICBpZiAoIXNob3VsZE5vdEZpbmRJblBhcmVudFxuICAgICAgICAgICAgICAgICYmIHZhbCA9PT0gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgJiYgdGhpcy4kcGFyZW50ICE9PSB1bmRlZmluZWRcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHZhbCA9IHRoaXMuJHBhcmVudC5nZXRUcmVlVmFyKG5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRQYXJlbnQ6IGZ1bmN0aW9uIChwYXJlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuJHBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRTY29wZUJ5TmFtZTogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgIHZhciBzY29wZXMgPSB0aGlzLmdldFRyZWVWYXIoJ3Njb3BlcycpO1xuICAgICAgICAgICAgaWYgKCFzY29wZXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2NvcGVzW25hbWVdO1xuICAgICAgICB9LFxuXG4gICAgICAgIHRyYXZlcnNlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB3YWxrRG9tKHRoaXMsIHRoaXMuc3RhcnROb2RlLCB0aGlzLmVuZE5vZGUsIHRoaXMudHJlZSwgdGhpcy5yb290U2NvcGUpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldERhdGE6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICBkYXRhID0gZGF0YSB8fCB7fTtcbiAgICAgICAgICAgIHRoaXMucm9vdFNjb3BlLnNldChkYXRhKTtcbiAgICAgICAgfSxcblxuICAgICAgICBnb0Rhcms6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHV0aWxzLnRyYXZlcnNlTm9DaGFuZ2VOb2Rlcyh0aGlzLnN0YXJ0Tm9kZSwgdGhpcy5lbmROb2RlLCBmdW5jdGlvbiAoY3VyTm9kZSkge1xuICAgICAgICAgICAgICAgIGlmIChjdXJOb2RlLm5vZGVUeXBlID09PSAxIHx8IGN1ck5vZGUubm9kZVR5cGUgPT09IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgdXRpbHMuZ29EYXJrKGN1ck5vZGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlc3RvcmVGcm9tRGFyazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdXRpbHMudHJhdmVyc2VOb0NoYW5nZU5vZGVzKHRoaXMuc3RhcnROb2RlLCB0aGlzLmVuZE5vZGUsIGZ1bmN0aW9uIChjdXJOb2RlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGN1ck5vZGUubm9kZVR5cGUgPT09IDEgfHwgY3VyTm9kZS5ub2RlVHlwZSA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICB1dGlscy5yZXN0b3JlRnJvbURhcmsoY3VyTm9kZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0RGlydHlDaGVja2VyOiBmdW5jdGlvbiAoZGlydHlDaGVja2VyKSB7XG4gICAgICAgICAgICB0aGlzLmRpcnR5Q2hlY2tlciA9IGRpcnR5Q2hlY2tlcjtcbiAgICAgICAgfSxcblxuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB3YWxrKHRoaXMudHJlZSk7XG5cbiAgICAgICAgICAgIHRoaXMuc3RhcnROb2RlID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuZW5kTm9kZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmNvbmZpZyA9IG51bGw7XG5cbiAgICAgICAgICAgIHRoaXMuZXhwckNhbGN1bGF0ZXIuZGVzdHJveSgpO1xuICAgICAgICAgICAgdGhpcy5leHByQ2FsY3VsYXRlciA9IG51bGw7XG5cbiAgICAgICAgICAgIHRoaXMuZG9tVXBkYXRlci5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLmRvbVVwZGF0ZXIgPSBudWxsO1xuXG4gICAgICAgICAgICB0aGlzLnRyZWUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy50cmVlVmFycyA9IG51bGw7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmRpcnR5Q2hlY2tlcikge1xuICAgICAgICAgICAgICAgIHRoaXMuZGlydHlDaGVja2VyLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRpcnR5Q2hlY2tlciA9IG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHdhbGsocGFyc2VyT2Jqcykge1xuICAgICAgICAgICAgICAgIHV0aWxzLmVhY2gocGFyc2VyT2JqcywgZnVuY3Rpb24gKGN1clBhcnNlck9iaikge1xuICAgICAgICAgICAgICAgICAgICBjdXJQYXJzZXJPYmoucGFyc2VyLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VyUGFyc2VyT2JqLmNoaWxkcmVuICYmIGN1clBhcnNlck9iai5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdhbGsoY3VyUGFyc2VyT2JqLmNoaWxkcmVuKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDliJvlu7rop6PmnpDlmajlrp7kvovvvIzlhbbov5Tlm57lgLznmoTnu5PmnoTkuLrvvJpcbiAgICAgICAgICoge1xuICAgICAgICAgKiAgICAgcGFyc2VyOiAuLi4sXG4gICAgICAgICAqICAgICBjb2xsZWN0UmVzdWx0OiAuLi5cbiAgICAgICAgICogfVxuICAgICAgICAgKlxuICAgICAgICAgKiDov5Tlm57lgLzlrZjlnKjlpoLkuIvlh6Dnp43mg4XlhrXvvJpcbiAgICAgICAgICpcbiAgICAgICAgICogMeOAgeWmguaenCBwYXJzZXIg5bGe5oCn5a2Y5Zyo5LiUIGNvbGxlY3RSZXN1bHQg5Li6IHRydWUg77yM5YiZ6K+05piO5b2T5YmN6Kej5p6Q5Zmo6Kej5p6Q5LqG5omA5pyJ55u45bqU55qE6IqC54K577yI5YyF5ous6LW35q2i6IqC54K56Ze055qE6IqC54K544CB5b2T5YmN6IqC54K55ZKM5a2Q5a2Z6IqC54K577yJ77ybXG4gICAgICAgICAqIDLjgIHnm7TmjqXov5Tlm57lgYflgLzmiJbogIUgcGFyc2VyIOS4jeWtmOWcqO+8jOivtOaYjuayoeacieWkhOeQhuS7u+S9leiKgueCue+8jOW9k+WJjeiKgueCueS4jeWxnuS6juW9k+WJjeino+aekOWZqOWkhOeQhu+8m1xuICAgICAgICAgKiAz44CBcGFyc2VyIOWtmOWcqOS4lCBjb2xsZWN0UmVzdWx0IOS4uuaVsOe7hO+8jOe7k+aehOWmguS4i++8mlxuICAgICAgICAgKiAgICAgW1xuICAgICAgICAgKiAgICAgICAgIHtcbiAgICAgICAgICogICAgICAgICAgICAgc3RhcnROb2RlOiBOb2RlLjwuLi4+LFxuICAgICAgICAgKiAgICAgICAgICAgICBlbmROb2RlOiBOb2RlLjwuLi4+XG4gICAgICAgICAqICAgICAgICAgfVxuICAgICAgICAgKiAgICAgXVxuICAgICAgICAgKlxuICAgICAgICAgKiAg5YiZ6K+05piO5b2T5YmN5piv5bim5pyJ5b6I5aSa5YiG5pSv55qE6IqC54K577yM6KaB5L6d5qyh6Kej5p6Q5pWw57uE5Lit5q+P5Liq5YWD57Sg5oyH5a6a55qE6IqC54K56IyD5Zu044CCXG4gICAgICAgICAqICDogIzkuJTvvIzor6Xop6PmnpDlmajlr7nlupTnmoQgc2V0RGF0YSgpIOaWueazleWwhuS8mui/lOWbnuaVtOaVsO+8jOaMh+aYjuS9v+eUqOWTquS4gOS4quWIhuaUr+eahOiKgueCueOAglxuICAgICAgICAgKlxuICAgICAgICAgKiBAaW5uZXJcbiAgICAgICAgICogQHBhcmFtIHtDb25zdHJ1Y3Rvcn0gUGFyc2VyQ2xhc3MgcGFyc2VyIOexu1xuICAgICAgICAgKiBAcGFyYW0gIHtPYmplY3R9IG9wdGlvbnMg5Yid5aeL5YyW5Y+C5pWwXG4gICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICDov5Tlm57lgLxcbiAgICAgICAgICovXG4gICAgICAgIGNyZWF0ZVBhcnNlcjogZnVuY3Rpb24gKFBhcnNlckNsYXNzLCBvcHRpb25zKSB7XG4gICAgICAgICAgICB2YXIgc3RhcnROb2RlID0gb3B0aW9ucy5zdGFydE5vZGUgfHwgb3B0aW9ucy5ub2RlO1xuICAgICAgICAgICAgaWYgKCFQYXJzZXJDbGFzcy5pc1Byb3Blck5vZGUoc3RhcnROb2RlLCBvcHRpb25zLmNvbmZpZykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBlbmROb2RlO1xuICAgICAgICAgICAgaWYgKFBhcnNlckNsYXNzLmZpbmRFbmROb2RlKSB7XG4gICAgICAgICAgICAgICAgZW5kTm9kZSA9IFBhcnNlckNsYXNzLmZpbmRFbmROb2RlKHN0YXJ0Tm9kZSwgb3B0aW9ucy5jb25maWcpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFlbmROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IFBhcnNlckNsYXNzLmdldE5vRW5kTm9kZUVycm9yKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGVuZE5vZGUucGFyZW50Tm9kZSAhPT0gc3RhcnROb2RlLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd0aGUgcmVsYXRpb25zaGlwIGJldHdlZW4gc3RhcnQgbm9kZSBhbmQgZW5kIG5vZGUgaXMgbm90IGJyb3RoZXJob29kIScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHBhcnNlciA9IG5ldyBQYXJzZXJDbGFzcyh1dGlscy5leHRlbmQob3B0aW9ucywge1xuICAgICAgICAgICAgICAgIGVuZE5vZGU6IGVuZE5vZGVcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBwYXJzZXI6IHBhcnNlcixcbiAgICAgICAgICAgICAgICBlbmROb2RlOiBlbmROb2RlIHx8IG9wdGlvbnMubm9kZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgICAvKipcbiAgICAgICAgICog5rOo5YaM5LiA5LiL6Kej5p6Q5Zmo57G744CCXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSAge0NvbnN0cnVjdG9yfSBQYXJzZXJDbGFzcyDop6PmnpDlmajnsbtcbiAgICAgICAgICovXG4gICAgICAgIHJlZ2lzdGVQYXJzZXI6IGZ1bmN0aW9uIChQYXJzZXJDbGFzcykge1xuICAgICAgICAgICAgdmFyIGlzRXhpdHNDaGlsZENsYXNzID0gZmFsc2U7XG4gICAgICAgICAgICB1dGlscy5lYWNoKFBhcnNlckNsYXNzZXMsIGZ1bmN0aW9uIChQQywgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICBpZiAodXRpbHMuaXNTdWJDbGFzc09mKFBDLCBQYXJzZXJDbGFzcykpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNFeGl0c0NoaWxkQ2xhc3MgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICh1dGlscy5pc1N1YkNsYXNzT2YoUGFyc2VyQ2xhc3MsIFBDKSkge1xuICAgICAgICAgICAgICAgICAgICBQYXJzZXJDbGFzc2VzW2luZGV4XSA9IFBhcnNlckNsYXNzO1xuICAgICAgICAgICAgICAgICAgICBpc0V4aXRzQ2hpbGRDbGFzcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzRXhpdHNDaGlsZENsYXNzO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICghaXNFeGl0c0NoaWxkQ2xhc3MpIHtcbiAgICAgICAgICAgICAgICBQYXJzZXJDbGFzc2VzLnB1c2goUGFyc2VyQ2xhc3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgICRuYW1lOiAnVHJlZSdcbiAgICB9XG4pO1xuXG5cbmZ1bmN0aW9uIHdhbGtEb20odHJlZSwgc3RhcnROb2RlLCBlbmROb2RlLCBjb250YWluZXIsIHNjb3BlTW9kZWwpIHtcbiAgICBpZiAoc3RhcnROb2RlID09PSBlbmROb2RlKSB7XG4gICAgICAgIGFkZChzdGFydE5vZGUpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yICh2YXIgY3VyTm9kZSA9IHN0YXJ0Tm9kZTsgY3VyTm9kZTspIHtcbiAgICAgICAgY3VyTm9kZSA9IGFkZChjdXJOb2RlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGQoY3VyTm9kZSkge1xuICAgICAgICBpZiAoIWN1ck5vZGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICAgICAgc3RhcnROb2RlOiBjdXJOb2RlLFxuICAgICAgICAgICAgbm9kZTogY3VyTm9kZSxcbiAgICAgICAgICAgIGNvbmZpZzogdHJlZS5jb25maWcsXG4gICAgICAgICAgICBleHByQ2FsY3VsYXRlcjogdHJlZS5leHByQ2FsY3VsYXRlcixcbiAgICAgICAgICAgIGRvbVVwZGF0ZXI6IHRyZWUuZG9tVXBkYXRlcixcbiAgICAgICAgICAgIHRyZWU6IHRyZWVcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgcGFyc2VyT2JqO1xuXG4gICAgICAgIHV0aWxzLmVhY2goUGFyc2VyQ2xhc3NlcywgZnVuY3Rpb24gKFBhcnNlckNsYXNzKSB7XG4gICAgICAgICAgICBwYXJzZXJPYmogPSB0cmVlLmNyZWF0ZVBhcnNlcihQYXJzZXJDbGFzcywgb3B0aW9ucyk7XG4gICAgICAgICAgICBpZiAoIXBhcnNlck9iaiB8fCAhcGFyc2VyT2JqLnBhcnNlcikge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBhcnNlck9iai5jb2xsZWN0UmVzdWx0ID0gcGFyc2VyT2JqLnBhcnNlci5jb2xsZWN0RXhwcnMoKTtcblxuICAgICAgICAgICAgcGFyc2VyT2JqLnBhcnNlci5zZXRTY29wZShzY29wZU1vZGVsKTtcblxuICAgICAgICAgICAgaWYgKHV0aWxzLmlzQXJyYXkocGFyc2VyT2JqLmNvbGxlY3RSZXN1bHQpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGJyYW5jaGVzID0gcGFyc2VyT2JqLmNvbGxlY3RSZXN1bHQ7XG4gICAgICAgICAgICAgICAgY29udGFpbmVyLnB1c2goe3BhcnNlcjogcGFyc2VyT2JqLnBhcnNlciwgY2hpbGRyZW46IGJyYW5jaGVzfSk7XG4gICAgICAgICAgICAgICAgdXRpbHMuZWFjaChicmFuY2hlcywgZnVuY3Rpb24gKGJyYW5jaCwgaSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWJyYW5jaC5zdGFydE5vZGUgfHwgIWJyYW5jaC5lbmROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgY29uID0gW107XG4gICAgICAgICAgICAgICAgICAgIHdhbGtEb20odHJlZSwgYnJhbmNoLnN0YXJ0Tm9kZSwgYnJhbmNoLmVuZE5vZGUsIGNvbiwgcGFyc2VyT2JqLnBhcnNlci5nZXRTY29wZSgpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJhbmNoZXNbaV0gPSBjb247XG4gICAgICAgICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICAgICAgICBpZiAocGFyc2VyT2JqLmVuZE5vZGUgIT09IGVuZE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VyTm9kZSA9IHBhcnNlck9iai5wYXJzZXIuZ2V0RW5kTm9kZSgpLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY3VyTm9kZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbiA9IFtdO1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5wdXNoKHtwYXJzZXI6IHBhcnNlck9iai5wYXJzZXIsIGNoaWxkcmVuOiBjb259KTtcbiAgICAgICAgICAgICAgICBpZiAoY3VyTm9kZS5ub2RlVHlwZSA9PT0gMSAmJiBjdXJOb2RlLmNoaWxkTm9kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHdhbGtEb20odHJlZSwgY3VyTm9kZS5maXJzdENoaWxkLCBjdXJOb2RlLmxhc3RDaGlsZCwgY29uLCBwYXJzZXJPYmoucGFyc2VyLmdldFNjb3BlKCkpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChjdXJOb2RlICE9PSBlbmROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIGN1ck5vZGUgPSBwYXJzZXJPYmoucGFyc2VyLmdldEVuZE5vZGUoKS5uZXh0U2libGluZztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGN1ck5vZGUgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIGlmICghcGFyc2VyT2JqKSB7XG4gICAgICAgICAgICBjdXJOb2RlID0gY3VyTm9kZS5uZXh0U2libGluZztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjdXJOb2RlO1xuICAgIH1cbn1cblxuXG5cblxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL3NyYy90cmVlcy9UcmVlLmpzXG4gKiogbW9kdWxlIGlkID0gNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDFcbiAqKi8iLCIvKipcbiAqIEBmaWxlIOS4gOWghumhueebrumHjOmdouW4uOeUqOeahOaWueazlVxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbmV4cG9ydHMuc2xpY2UgPSBmdW5jdGlvbiAoYXJyLCBzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyciwgc3RhcnQsIGVuZCk7XG59O1xuXG5leHBvcnRzLmdvRGFyayA9IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgbm9kZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH1cbiAgICBlbHNlIGlmIChub2RlLm5vZGVUeXBlID09PSAzKSB7XG4gICAgICAgIG5vZGUuX190ZXh0X18gPSBub2RlLm5vZGVWYWx1ZTtcbiAgICAgICAgbm9kZS5ub2RlVmFsdWUgPSAnJztcbiAgICB9XG59O1xuXG5leHBvcnRzLnJlc3RvcmVGcm9tRGFyayA9IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgbm9kZS5zdHlsZS5kaXNwbGF5ID0gbnVsbDtcbiAgICB9XG4gICAgZWxzZSBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMykge1xuICAgICAgICBpZiAobm9kZS5fX3RleHRfXyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBub2RlLm5vZGVWYWx1ZSA9IG5vZGUuX190ZXh0X187XG4gICAgICAgICAgICBub2RlLl9fdGV4dF9fID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuZXhwb3J0cy5jcmVhdGVFeHByRm4gPSBmdW5jdGlvbiAoZXhwclJlZ0V4cCwgZXhwciwgZXhwckNhbGN1bGF0ZXIpIHtcbiAgICBleHByID0gZXhwci5yZXBsYWNlKGV4cHJSZWdFeHAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3VtZW50c1sxXTtcbiAgICB9KTtcbiAgICBleHByQ2FsY3VsYXRlci5jcmVhdGVFeHByRm4oZXhwcik7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKHNjb3BlTW9kZWwpIHtcbiAgICAgICAgcmV0dXJuIGV4cHJDYWxjdWxhdGVyLmNhbGN1bGF0ZShleHByLCBmYWxzZSwgc2NvcGVNb2RlbCk7XG4gICAgfTtcbn07XG5cbi8qKlxuICog6LaF57qn566A5Y2V55qEIGV4dGVuZCDvvIzlm6DkuLrmnKzlupPlr7kgZXh0ZW5kIOayoemCo+mrmOeahOimgeaxgu+8jFxuICog562J5Yiw5pyJ6KaB5rGC55qE5pe25YCZ5YaN5a6M5ZaE44CCXG4gKlxuICogQGlubmVyXG4gKiBAcGFyYW0gIHtPYmplY3R9IHRhcmdldCDnm67moIflr7nosaFcbiAqIEByZXR1cm4ge09iamVjdH0gICAgICAgIOacgOe7iOWQiOW5tuWQjueahOWvueixoVxuICovXG5leHBvcnRzLmV4dGVuZCA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICB2YXIgc3JjcyA9IGV4cG9ydHMuc2xpY2UoYXJndW1lbnRzLCAxKTtcbiAgICBmb3IgKHZhciBpID0gMCwgaWwgPSBzcmNzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgICAgLyogZXNsaW50LWRpc2FibGUgZ3VhcmQtZm9yLWluICovXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBzcmNzW2ldKSB7XG4gICAgICAgICAgICB0YXJnZXRba2V5XSA9IHNyY3NbaV1ba2V5XTtcbiAgICAgICAgfVxuICAgICAgICAvKiBlc2xpbnQtZW5hYmxlIGd1YXJkLWZvci1pbiAqL1xuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0O1xufTtcblxuZXhwb3J0cy50cmF2ZXJzZU5vQ2hhbmdlTm9kZXMgPSBmdW5jdGlvbiAoc3RhcnROb2RlLCBlbmROb2RlLCBub2RlRm4sIGNvbnRleHQpIHtcbiAgICBmb3IgKHZhciBjdXJOb2RlID0gc3RhcnROb2RlO1xuICAgICAgICBjdXJOb2RlICYmIGN1ck5vZGUgIT09IGVuZE5vZGU7XG4gICAgICAgIGN1ck5vZGUgPSBjdXJOb2RlLm5leHRTaWJsaW5nXG4gICAgKSB7XG4gICAgICAgIGlmIChub2RlRm4uY2FsbChjb250ZXh0LCBjdXJOb2RlKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbm9kZUZuLmNhbGwoY29udGV4dCwgZW5kTm9kZSk7XG59O1xuXG5leHBvcnRzLnRyYXZlcnNlTm9kZXMgPSBmdW5jdGlvbiAoc3RhcnROb2RlLCBlbmROb2RlLCBub2RlRm4sIGNvbnRleHQpIHtcbiAgICB2YXIgbm9kZXMgPSBbXTtcbiAgICBmb3IgKHZhciBjdXJOb2RlID0gc3RhcnROb2RlO1xuICAgICAgICBjdXJOb2RlICYmIGN1ck5vZGUgIT09IGVuZE5vZGU7XG4gICAgICAgIGN1ck5vZGUgPSBjdXJOb2RlLm5leHRTaWJsaW5nXG4gICAgKSB7XG4gICAgICAgIG5vZGVzLnB1c2goY3VyTm9kZSk7XG4gICAgfVxuXG4gICAgbm9kZXMucHVzaChlbmROb2RlKTtcblxuICAgIGV4cG9ydHMuZWFjaChub2Rlcywgbm9kZUZuLCBjb250ZXh0KTtcbn07XG5cbmV4cG9ydHMuZWFjaCA9IGZ1bmN0aW9uIChhcnIsIGZuLCBjb250ZXh0KSB7XG4gICAgaWYgKGV4cG9ydHMuaXNBcnJheShhcnIpKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IGFyci5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZm4uY2FsbChjb250ZXh0LCBhcnJbaV0sIGksIGFycikpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgYXJyID09PSAnb2JqZWN0Jykge1xuICAgICAgICBmb3IgKHZhciBrIGluIGFycikge1xuICAgICAgICAgICAgaWYgKGZuLmNhbGwoY29udGV4dCwgYXJyW2tdLCBrLCBhcnIpKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5mdW5jdGlvbiBpc0NsYXNzKG9iaiwgY2xzTmFtZSkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgJyArIGNsc05hbWUgKyAnXSc7XG59XG5cbmV4cG9ydHMuaXNBcnJheSA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgICByZXR1cm4gaXNDbGFzcyhhcnIsICdBcnJheScpO1xufTtcblxuZXhwb3J0cy5pc051bWJlciA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICByZXR1cm4gaXNDbGFzcyhvYmosICdOdW1iZXInKTtcbn07XG5cbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICByZXR1cm4gaXNDbGFzcyhvYmosICdGdW5jdGlvbicpO1xufTtcblxuLyoqXG4gKiDmmK/lkKbmmK/kuIDkuKrnuq/lr7nosaHvvIzmu6HotrPlpoLkuIvmnaHku7bvvJpcbiAqXG4gKiAx44CB6Zmk5LqG5YaF572u5bGe5oCn5LmL5aSW77yM5rKh5pyJ5YW25LuW57un5om/5bGe5oCn77ybXG4gKiAy44CBY29uc3RydWN0b3Ig5pivIE9iamVjdFxuICpcbiAqIEBwYXJhbSB7QW55fSBvYmog5b6F5Yik5pat55qE5Y+Y6YePXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5leHBvcnRzLmlzUHVyZU9iamVjdCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICBpZiAoIWlzQ2xhc3Mob2JqLCAnT2JqZWN0JykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGZvciAodmFyIGsgaW4gb2JqKSB7XG4gICAgICAgIGlmICghb2JqLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn07XG5cbmV4cG9ydHMuaXNDbGFzcyA9IGlzQ2xhc3M7XG5cbmV4cG9ydHMuYmluZCA9IGZ1bmN0aW9uIChmbiwgdGhpc0FyZykge1xuICAgIGlmICghZXhwb3J0cy5pc0Z1bmN0aW9uKGZuKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGJpbmQgPSBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCB8fCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICB2YXIgb2JqID0gYXJncy5sZW5ndGggPiAwID8gYXJnc1swXSA6IHVuZGVmaW5lZDtcbiAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB0b3RhbEFyZ3MgPSBBcnJheS5wcm90b3R5cGUuY29uY2F0LmFwcGx5KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3MsIDEpLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgcmV0dXJuIG1lLmFwcGx5KG9iaiwgdG90YWxBcmdzKTtcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIHJldHVybiBiaW5kLmFwcGx5KGZuLCBbdGhpc0FyZ10uY29uY2F0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMikpKTtcbn07XG5cbmV4cG9ydHMuaXNTdWJDbGFzc09mID0gZnVuY3Rpb24gKFN1YkNsYXNzLCBTdXBlckNsYXNzKSB7XG4gICAgcmV0dXJuIFN1YkNsYXNzLnByb3RvdHlwZSBpbnN0YW5jZW9mIFN1cGVyQ2xhc3M7XG59O1xuXG4vKipcbiAqIOWvueS8oOWFpeeahOWtl+espuS4sui/m+ihjOWIm+W7uuato+WImeihqOi+vuW8j+S5i+WJjeeahOi9rOS5ie+8jOmYsuatouWtl+espuS4suS4reeahOS4gOS6m+Wtl+espuaIkOS4uuWFs+mUruWtl+OAglxuICpcbiAqIEBwYXJhbSAge3N0cmluZ30gc3RyIOW+hei9rOS5ieeahOWtl+espuS4slxuICogQHJldHVybiB7c3RyaW5nfSAgICAg6L2s5LmJ5LmL5ZCO55qE5a2X56ym5LiyXG4gKi9cbmV4cG9ydHMucmVnRXhwRW5jb2RlID0gZnVuY3Rpb24gcmVnRXhwRW5jb2RlKHN0cikge1xuICAgIHJldHVybiAnXFxcXCcgKyBzdHIuc3BsaXQoJycpLmpvaW4oJ1xcXFwnKTtcbn07XG5cbmV4cG9ydHMueGhyID0gZnVuY3Rpb24gKG9wdGlvbnMsIGxvYWRGbiwgZXJyb3JGbikge1xuICAgIG9wdGlvbnMgPSBleHBvcnRzLmV4dGVuZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCdcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICB4aHIub25lcnJvciA9IGVycm9yRm47XG4gICAgeGhyLm9ubG9hZCA9IGxvYWRGbjtcbiAgICB4aHIub3BlbihvcHRpb25zLm1ldGhvZCwgb3B0aW9ucy51cmwsIHRydWUpO1xuICAgIHNldEhlYWRlcnMob3B0aW9ucy5oZWFkZXJzLCB4aHIpO1xuICAgIHhoci5zZW5kKG9wdGlvbnMuYm9keSk7XG59O1xuXG4vKipcbiAqIOWwhuWtl+espuS4suS4reeahOmpvOWzsOWRveWQjeaWueW8j+aUueS4uuefreaoque6v+eahOW9ouW8j1xuICpcbiAqIEBwdWJsaWNcbiAqIEBwYXJhbSAge3N0cmluZ30gc3RyIOimgei9rOaNoueahOWtl+espuS4slxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnRzLmNhbWVsMmxpbmUgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bQS1aXS9nLCBmdW5jdGlvbiAobWF0Y2hlZCwgaW5kZXgpIHtcbiAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gbWF0Y2hlZC50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAnLScgKyBtYXRjaGVkLnRvTG93ZXJDYXNlKCk7XG4gICAgfSk7XG59O1xuXG4vKipcbiAqIOWwhuWtl+espuS4suS4reeahOefreaoque6v+WRveWQjeaWueW8j+aUueS4uumpvOWzsOeahOW9ouW8j1xuICpcbiAqIEBwdWJsaWNcbiAqIEBwYXJhbSAge3N0cmluZ30gc3RyIOimgei9rOaNoueahOWtl+espuS4slxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnRzLmxpbmUyY2FtZWwgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC8tW2Etel0vZywgZnVuY3Rpb24gKG1hdGNoZWQpIHtcbiAgICAgICAgcmV0dXJuIG1hdGNoZWRbMV0udG9VcHBlckNhc2UoKTtcbiAgICB9KTtcbn07XG5cblxuZnVuY3Rpb24gc2V0SGVhZGVycyhoZWFkZXJzLCB4aHIpIHtcbiAgICBpZiAoIWhlYWRlcnMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAodmFyIGsgaW4gaGVhZGVycykge1xuICAgICAgICBpZiAoIWhlYWRlcnMuaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGssIGhlYWRlcnNba10pO1xuICAgIH1cbn1cblxuXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Z0cGwvc3JjL3V0aWxzLmpzXG4gKiogbW9kdWxlIGlkID0gNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDFcbiAqKi8iLCJ2YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIEV4cHJDYWxjdWxhdGVyKCkge1xuICAgIHRoaXMuZm5zID0ge307XG5cbiAgICB0aGlzLmV4cHJOYW1lTWFwID0ge307XG4gICAgdGhpcy5leHByTmFtZVJlZ0V4cCA9IC9cXC4/XFwkPyhbYS16fEEtWl0rfChbYS16fEEtWl0rWzAtOV0rW2EtenxBLVpdKikpL2c7XG59XG5cbkV4cHJDYWxjdWxhdGVyLnByb3RvdHlwZS5jcmVhdGVFeHByRm4gPSBmdW5jdGlvbiAoZXhwciwgYXZvaWRSZXR1cm4pIHtcbiAgICBhdm9pZFJldHVybiA9ICEhYXZvaWRSZXR1cm47XG4gICAgdGhpcy5mbnNbZXhwcl0gPSB0aGlzLmZuc1tleHByXSB8fCB7fTtcbiAgICBpZiAodGhpcy5mbnNbZXhwcl1bYXZvaWRSZXR1cm5dKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgcGFyYW1zID0gZ2V0VmFyaWFibGVOYW1lc0Zyb21FeHByKHRoaXMsIGV4cHIpO1xuICAgIHZhciBmbiA9IG5ldyBGdW5jdGlvbihwYXJhbXMsIChhdm9pZFJldHVybiA/ICcnIDogJ3JldHVybiAnKSArIGV4cHIpO1xuXG4gICAgdGhpcy5mbnNbZXhwcl1bYXZvaWRSZXR1cm5dID0ge1xuICAgICAgICBwYXJhbU5hbWVzOiBwYXJhbXMsXG4gICAgICAgIGZuOiBmblxuICAgIH07XG59O1xuXG5FeHByQ2FsY3VsYXRlci5wcm90b3R5cGUuY2FsY3VsYXRlID0gZnVuY3Rpb24gKGV4cHIsIGF2b2lkUmV0dXJuLCBzY29wZU1vZGVsKSB7XG4gICAgdmFyIGZuT2JqID0gdGhpcy5mbnNbZXhwcl1bYXZvaWRSZXR1cm5dO1xuICAgIGlmICghZm5PYmopIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdubyBzdWNoIGV4cHJlc3Npb24gZnVuY3Rpb24gY3JlYXRlZCEnKTtcbiAgICB9XG5cbiAgICB2YXIgZm5BcmdzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDAsIGlsID0gZm5PYmoucGFyYW1OYW1lcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICAgIHZhciBwYXJhbSA9IGZuT2JqLnBhcmFtTmFtZXNbaV07XG4gICAgICAgIHZhciB2YWx1ZSA9IHNjb3BlTW9kZWwuZ2V0KHBhcmFtKTtcbiAgICAgICAgZm5BcmdzLnB1c2godmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogdmFsdWUpO1xuICAgIH1cblxuICAgIHZhciByZXN1bHQ7XG4gICAgdHJ5IHtcbiAgICAgICAgcmVzdWx0ID0gZm5PYmouZm4uYXBwbHkobnVsbCwgZm5BcmdzKTtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgcmVzdWx0ID0gJyc7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuXG5FeHByQ2FsY3VsYXRlci5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZucyA9IG51bGw7XG4gICAgdGhpcy5leHByTmFtZU1hcCA9IG51bGw7XG4gICAgdGhpcy5leHByTmFtZVJlZ0V4cCA9IG51bGw7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEV4cHJDYWxjdWxhdGVyO1xuXG4vKipcbiAqIOS7juihqOi+vuW8j+S4reaKveemu+WHuuWPmOmHj+WQjVxuICpcbiAqIEBpbm5lclxuICogQHBhcmFtIHtFeHByQ2FsY3VsYXRlcn0gbWUg5a+55bqU5a6e5L6LXG4gKiBAcGFyYW0gIHtzdHJpbmd9IGV4cHIg6KGo6L6+5byP5a2X56ym5Liy77yM57G75Ly85LqOIGAke25hbWV9YCDkuK3nmoQgbmFtZVxuICogQHJldHVybiB7QXJyYXkuPHN0cmluZz59ICAgICAg5Y+Y6YeP5ZCN5pWw57uEXG4gKi9cbmZ1bmN0aW9uIGdldFZhcmlhYmxlTmFtZXNGcm9tRXhwcihtZSwgZXhwcikge1xuICAgIGlmIChtZS5leHByTmFtZU1hcFtleHByXSkge1xuICAgICAgICByZXR1cm4gbWUuZXhwck5hbWVNYXBbZXhwcl07XG4gICAgfVxuXG4gICAgdmFyIHJlZyA9IC9bXFwkfF98YS16fEEtWl17MX0oPzpbYS16fEEtWnwwLTl8XFwkfF9dKikvZztcblxuICAgIGZvciAodmFyIG5hbWVzID0ge30sIG5hbWUgPSByZWcuZXhlYyhleHByKTsgbmFtZTsgbmFtZSA9IHJlZy5leGVjKGV4cHIpKSB7XG4gICAgICAgIHZhciByZXN0U3RyID0gZXhwci5zbGljZShuYW1lLmluZGV4ICsgbmFtZVswXS5sZW5ndGgpO1xuXG4gICAgICAgIC8vIOaYr+W3puWAvFxuICAgICAgICBpZiAoL15cXHMqPSg/IT0pLy50ZXN0KHJlc3RTdHIpKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOWPmOmHj+WQjeWJjemdouaYr+WQpuWtmOWcqCBgLmAg77yM5oiW6ICF5Y+Y6YeP5ZCN5piv5ZCm5L2N5LqO5byV5Y+35YaF6YOoXG4gICAgICAgIGlmIChuYW1lLmluZGV4XG4gICAgICAgICAgICAmJiAoZXhwcltuYW1lLmluZGV4IC0gMV0gPT09ICcuJ1xuICAgICAgICAgICAgICAgIHx8IGlzSW5RdW90ZShcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cHIuc2xpY2UoMCwgbmFtZS5pbmRleCksXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN0U3RyXG4gICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgbmFtZXNbbmFtZVswXV0gPSB0cnVlO1xuICAgIH1cblxuICAgIHZhciByZXQgPSBbXTtcbiAgICB1dGlscy5lYWNoKG5hbWVzLCBmdW5jdGlvbiAoaXNPaywgbmFtZSkge1xuICAgICAgICBpZiAoaXNPaykge1xuICAgICAgICAgICAgcmV0LnB1c2gobmFtZSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBtZS5leHByTmFtZU1hcFtleHByXSA9IHJldDtcblxuICAgIHJldHVybiByZXQ7XG5cbiAgICBmdW5jdGlvbiBpc0luUXVvdGUocHJlU3RyLCByZXN0U3RyKSB7XG4gICAgICAgIGlmICgocHJlU3RyLmxhc3RJbmRleE9mKCdcXCcnKSArIDEgJiYgcmVzdFN0ci5pbmRleE9mKCdcXCcnKSArIDEpXG4gICAgICAgICAgICB8fCAocHJlU3RyLmxhc3RJbmRleE9mKCdcIicpICsgMSAmJiByZXN0U3RyLmluZGV4T2YoJ1wiJykgKyAxKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL3NyYy9FeHByQ2FsY3VsYXRlci5qc1xuICoqIG1vZHVsZSBpZCA9IDdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxXG4gKiovIiwiLyoqXG4gKiBAZmlsZSBET00g5pu05paw5ZmoXG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20pXG4gKi9cblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xudmFyIGxvZyA9IHJlcXVpcmUoJy4vbG9nJyk7XG5cbmZ1bmN0aW9uIERvbVVwZGF0ZXIoKSB7XG4gICAgdGhpcy50YXNrcyA9IHt9O1xuICAgIHRoaXMuaXNFeGVjdXRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLmRvbmVGbnMgPSBbXTtcbn1cblxudmFyIGNvdW50ZXIgPSAwO1xuRG9tVXBkYXRlci5wcm90b3R5cGUuZ2VuZXJhdGVUYXNrSWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGNvdW50ZXIrKztcbn07XG5cbkRvbVVwZGF0ZXIucHJvdG90eXBlLmFkZFRhc2tGbiA9IGZ1bmN0aW9uICh0YXNrSWQsIHRhc2tGbikge1xuICAgIHRoaXMudGFza3NbdGFza0lkXSA9IHRhc2tGbjtcbn07XG5cbkRvbVVwZGF0ZXIucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy50YXNrcyA9IG51bGw7XG59O1xuXG5Eb21VcGRhdGVyLnByb3RvdHlwZS5leGVjdXRlID0gZnVuY3Rpb24gKGRvbmVGbikge1xuICAgIGlmICh1dGlscy5pc0Z1bmN0aW9uKGRvbmVGbikpIHtcbiAgICAgICAgdGhpcy5kb25lRm5zLnB1c2goZG9uZUZuKTtcbiAgICB9XG5cbiAgICB2YXIgbWUgPSB0aGlzO1xuICAgIGlmICghdGhpcy5pc0V4ZWN1dGluZykge1xuICAgICAgICB0aGlzLmlzRXhlY3V0aW5nID0gdHJ1ZTtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHV0aWxzLmVhY2gobWUudGFza3MsIGZ1bmN0aW9uICh0YXNrRm4pIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICB0YXNrRm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nLndhcm4oZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBtZS50YXNrcyA9IHt9O1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KHV0aWxzLmJpbmQoZnVuY3Rpb24gKGRvbmVGbnMpIHtcbiAgICAgICAgICAgICAgICB1dGlscy5lYWNoKGRvbmVGbnMsIGZ1bmN0aW9uIChkb25lRm4pIHtcbiAgICAgICAgICAgICAgICAgICAgZG9uZUZuKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LCBudWxsLCBtZS5kb25lRm5zKSk7XG4gICAgICAgICAgICBtZS5kb25lRm5zID0gW107XG5cbiAgICAgICAgICAgIG1lLmlzRXhlY3V0aW5nID0gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cbi8qKlxuICog57uZ5oyH5a6aRE9N6IqC54K555qE5oyH5a6a5bGe5oCn6K6+572u5YC8XG4gKlxuICogVE9ETzog5a6M5ZaEXG4gKlxuICogQHN0YXRpY1xuICogQHBhcmFtIHtOb2RlfSBub2RlICBET03oioLngrlcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lICDoioLngrnlsZ7mgKflkI1cbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZSDoioLngrnlsZ7mgKflgLxcbiAqIEByZXR1cm4geyp9XG4gKi9cbkRvbVVwZGF0ZXIuc2V0QXR0ciA9IGZ1bmN0aW9uIChub2RlLCBuYW1lLCB2YWx1ZSkge1xuICAgIC8vIOebruWJjeS7heWkhOeQhuWFg+e0oOiKgueCue+8jOS7peWQjuaYr+WQpuWkhOeQhuWFtuS7luexu+Wei+eahOiKgueCue+8jOS7peWQjuWGjeivtFxuICAgIGlmIChub2RlLm5vZGVUeXBlICE9PSAxKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAobmFtZSA9PT0gJ3N0eWxlJyAmJiB1dGlscy5pc1B1cmVPYmplY3QodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBEb21VcGRhdGVyLnNldFN0eWxlKG5vZGUsIHZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAobmFtZSA9PT0gJ2NsYXNzJykge1xuICAgICAgICByZXR1cm4gRG9tVXBkYXRlci5zZXRDbGFzcyhub2RlLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgbm9kZS5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xufTtcblxuRG9tVXBkYXRlci5zZXRDbGFzcyA9IGZ1bmN0aW9uIChub2RlLCBrbGFzcykge1xuICAgIGlmICgha2xhc3MpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBrbGFzc2VzID0gW107XG4gICAgaWYgKHV0aWxzLmlzQ2xhc3Moa2xhc3MsICdTdHJpbmcnKSkge1xuICAgICAgICBrbGFzc2VzID0ga2xhc3Muc3BsaXQoJyAnKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodXRpbHMuaXNQdXJlT2JqZWN0KGtsYXNzKSkge1xuICAgICAgICBmb3IgKHZhciBrIGluIGtsYXNzKSB7XG4gICAgICAgICAgICBpZiAoa2xhc3Nba10pIHtcbiAgICAgICAgICAgICAgICBrbGFzc2VzLnB1c2goa2xhc3Nba10pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKHV0aWxzLmlzQXJyYXkoa2xhc3MpKSB7XG4gICAgICAgIGtsYXNzZXMgPSBrbGFzcztcbiAgICB9XG5cbiAgICBub2RlLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnJyk7XG4gICAgbm9kZS5jbGFzc0xpc3QuYWRkLmFwcGx5KG5vZGUuY2xhc3NMaXN0LCBrbGFzc2VzKTtcbn07XG5cbkRvbVVwZGF0ZXIuc2V0U3R5bGUgPSBmdW5jdGlvbiAobm9kZSwgc3R5bGVPYmopIHtcbiAgICBmb3IgKHZhciBrIGluIHN0eWxlT2JqKSB7XG4gICAgICAgIG5vZGUuc3R5bGVba10gPSBzdHlsZU9ialtrXTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERvbVVwZGF0ZXI7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Z0cGwvc3JjL0RvbVVwZGF0ZXIuanNcbiAqKiBtb2R1bGUgaWQgPSA4XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMVxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHdhcm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCFjb25zb2xlIHx8ICFjb25zb2xlLndhcm4pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUud2Fybi5hcHBseShjb25zb2xlLCBhcmd1bWVudHMpO1xuICAgIH1cbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL3NyYy9sb2cuanNcbiAqKiBtb2R1bGUgaWQgPSA5XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMVxuICoqLyIsInZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbnZhciBFdmVudCA9IHJlcXVpcmUoJy4vRXZlbnQnKTtcbnZhciBpbmhlcml0ID0gcmVxdWlyZSgnLi9pbmhlcml0Jyk7XG5cbmZ1bmN0aW9uIFNjb3BlTW9kZWwoKSB7XG4gICAgRXZlbnQuY2FsbCh0aGlzKTtcblxuICAgIHRoaXMuc3RvcmUgPSB7fTtcbiAgICB0aGlzLnBhcmVudDtcbiAgICB0aGlzLmNoaWxkcmVuID0gW107XG59XG5cblNjb3BlTW9kZWwucHJvdG90eXBlLnNldFBhcmVudCA9IGZ1bmN0aW9uIChwYXJlbnQpIHtcbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbn07XG5cblNjb3BlTW9kZWwucHJvdG90eXBlLmFkZENoaWxkID0gZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgdGhpcy5jaGlsZHJlbi5wdXNoKGNoaWxkKTtcbn07XG5cblNjb3BlTW9kZWwucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgIGlmICh1dGlscy5pc0NsYXNzKG5hbWUsICdTdHJpbmcnKSkge1xuICAgICAgICB0aGlzLnN0b3JlW25hbWVdID0gdmFsdWU7XG4gICAgICAgIGNoYW5nZSh0aGlzKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodXRpbHMuaXNQdXJlT2JqZWN0KG5hbWUpKSB7XG4gICAgICAgIHV0aWxzLmV4dGVuZCh0aGlzLnN0b3JlLCBuYW1lKTtcbiAgICAgICAgY2hhbmdlKHRoaXMpO1xuICAgIH1cbn07XG5cblNjb3BlTW9kZWwucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxIHx8IG5hbWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdG9yZTtcbiAgICB9XG5cbiAgICBpZiAobmFtZSBpbiB0aGlzLnN0b3JlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0b3JlW25hbWVdO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnBhcmVudCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0KG5hbWUpO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaW5oZXJpdChTY29wZU1vZGVsLCBFdmVudCk7XG5cbmZ1bmN0aW9uIGNoYW5nZShtZSkge1xuICAgIG1lLnRyaWdnZXIoJ2NoYW5nZScsIG1lKTtcbiAgICB1dGlscy5lYWNoKG1lLmNoaWxkcmVuLCBmdW5jdGlvbiAoc2NvcGUpIHtcbiAgICAgICAgc2NvcGUudHJpZ2dlcigncGFyZW50Y2hhbmdlJywgbWUpO1xuICAgIH0pO1xufVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL3NyYy9TY29wZU1vZGVsLmpzXG4gKiogbW9kdWxlIGlkID0gMTBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxXG4gKiovIiwidmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG5mdW5jdGlvbiBFdmVudCgpIHtcbiAgICB0aGlzLmV2bnRzID0ge307XG59XG5cbkV2ZW50LnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uIChldmVudE5hbWUsIGZuLCBjb250ZXh0KSB7XG4gICAgaWYgKCF1dGlscy5pc0Z1bmN0aW9uKGZuKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5ldm50c1tldmVudE5hbWVdID0gdGhpcy5ldm50c1tldmVudE5hbWVdIHx8IFtdO1xuXG4gICAgdGhpcy5ldm50c1tldmVudE5hbWVdLnB1c2goe1xuICAgICAgICBmbjogZm4sXG4gICAgICAgIGNvbnRleHQ6IGNvbnRleHRcbiAgICB9KTtcbn07XG5cbkV2ZW50LnByb3RvdHlwZS50cmlnZ2VyID0gZnVuY3Rpb24gKGV2ZW50TmFtZSkge1xuICAgIHZhciBmbk9ianMgPSB0aGlzLmV2bnRzW2V2ZW50TmFtZV07XG4gICAgaWYgKGZuT2JqcyAmJiBmbk9ianMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBhcmdzID0gdXRpbHMuc2xpY2UoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgdXRpbHMuZWFjaChmbk9ianMsIGZ1bmN0aW9uIChmbk9iaikge1xuICAgICAgICAgICAgZm5PYmouZm4uYXBwbHkoZm5PYmouY29udGV4dCwgYXJncyk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cbkV2ZW50LnByb3RvdHlwZS5vZmYgPSBmdW5jdGlvbiAoZXZlbnROYW1lLCBmbikge1xuICAgIGlmICghZm4pIHtcbiAgICAgICAgdGhpcy5ldm50c1tldmVudE5hbWVdID0gbnVsbDtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBmbk9ianMgPSB0aGlzLmV2bnRzW2V2ZW50TmFtZV07XG4gICAgaWYgKGZuT2JqcyAmJiBmbk9ianMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBuZXdGbk9ianMgPSBbXTtcbiAgICAgICAgdXRpbHMuZWFjaChmbk9ianMsIGZ1bmN0aW9uIChmbk9iaikge1xuICAgICAgICAgICAgaWYgKGZuICE9PSBmbk9iai5mbikge1xuICAgICAgICAgICAgICAgIG5ld0ZuT2Jqcy5wdXNoKGZuT2JqKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZXZudHNbZXZlbnROYW1lXSA9IG5ld0ZuT2JqcztcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL3NyYy9FdmVudC5qc1xuICoqIG1vZHVsZSBpZCA9IDExXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMVxuICoqLyIsIi8qKlxuICogQGZpbGUg57un5om/XG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20pXG4gKi9cblxuZnVuY3Rpb24gaW5oZXJpdChDaGlsZENsYXNzLCBQYXJlbnRDbGFzcykge1xuICAgIGZ1bmN0aW9uIENscygpIHt9XG5cbiAgICBDbHMucHJvdG90eXBlID0gUGFyZW50Q2xhc3MucHJvdG90eXBlO1xuICAgIHZhciBjaGlsZFByb3RvID0gQ2hpbGRDbGFzcy5wcm90b3R5cGU7XG4gICAgQ2hpbGRDbGFzcy5wcm90b3R5cGUgPSBuZXcgQ2xzKCk7XG4gICAgQ2hpbGRDbGFzcy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDaGlsZENsYXNzO1xuXG4gICAgdmFyIGtleTtcbiAgICBmb3IgKGtleSBpbiBjaGlsZFByb3RvKSB7XG4gICAgICAgIENoaWxkQ2xhc3MucHJvdG90eXBlW2tleV0gPSBjaGlsZFByb3RvW2tleV07XG4gICAgfVxuXG4gICAgLy8g57un5om/6Z2Z5oCB5bGe5oCnXG4gICAgZm9yIChrZXkgaW4gUGFyZW50Q2xhc3MpIHtcbiAgICAgICAgaWYgKFBhcmVudENsYXNzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIGlmIChDaGlsZENsYXNzW2tleV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIENoaWxkQ2xhc3Nba2V5XSA9IFBhcmVudENsYXNzW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gQ2hpbGRDbGFzcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbmhlcml0O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL3NyYy9pbmhlcml0LmpzXG4gKiogbW9kdWxlIGlkID0gMTJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxXG4gKiovIiwiLyoqXG4gKiBAZmlsZSDmiYDmnInnsbvnmoTln7rnsbtcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG52YXIgaW5oZXJpdCA9IHJlcXVpcmUoJy4vaW5oZXJpdCcpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG5mdW5jdGlvbiBCYXNlKCkge1xuICAgIHRoaXMuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG5CYXNlLnByb3RvdHlwZS5pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge307XG5cbi8qKlxuICog57un5om/XG4gKlxuICogQHN0YXRpY1xuICogQHBhcmFtICB7T2JqZWN0fSBwcm9wcyAgICAgICDmma7pgJrlsZ7mgKdcbiAqIEBwYXJhbSAge09iamVjdH0gc3RhdGljUHJvcHMg6Z2Z5oCB5bGe5oCnXG4gKiBAcmV0dXJuIHtDbGFzc30gICAgICAgICAgICAg5a2Q57G7XG4gKi9cbkJhc2UuZXh0ZW5kcyA9IGZ1bmN0aW9uIChwcm9wcywgc3RhdGljUHJvcHMpIHtcbiAgICAvLyDmr4/kuKrnsbvpg73lv4XpobvmnInkuIDkuKrlkI3lrZdcbiAgICBpZiAoIXN0YXRpY1Byb3BzIHx8ICFzdGF0aWNQcm9wcy4kbmFtZSkge1xuICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoJ2VhY2ggY2xhc3MgbXVzdCBoYXZlIGEgYCRuYW1lYC4nKTtcbiAgICB9XG5cbiAgICB2YXIgYmFzZUNscyA9IHRoaXM7XG5cbiAgICB2YXIgY2xzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBiYXNlQ2xzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgICB1dGlscy5leHRlbmQoY2xzLnByb3RvdHlwZSwgcHJvcHMpO1xuICAgIHV0aWxzLmV4dGVuZChjbHMsIHN0YXRpY1Byb3BzKTtcblxuICAgIC8vIOiusOW9leS4gOS4i+eItuexu1xuICAgIGNscy4kc3VwZXJDbGFzcyA9IGJhc2VDbHM7XG5cbiAgICByZXR1cm4gaW5oZXJpdChjbHMsIGJhc2VDbHMpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYXNlO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL3NyYy9CYXNlLmpzXG4gKiogbW9kdWxlIGlkID0gMTNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxXG4gKiovIiwiLyoqXG4gKiBAZmlsZSDnu4Tku7bop6PmnpDlmahcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG52YXIgUGFyc2VyID0gcmVxdWlyZSgndnRwbC9zcmMvcGFyc2Vycy9QYXJzZXInKTtcbnZhciBUcmVlID0gcmVxdWlyZSgndnRwbC9zcmMvdHJlZXMvVHJlZScpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgndnRwbC9zcmMvdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQYXJzZXIuZXh0ZW5kcyhcbiAgICB7XG5cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIFBhcnNlci5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudE1hbmFnZXIgPSB0aGlzLnRyZWUuZ2V0VHJlZVZhcignY29tcG9uZW50TWFuYWdlcicpO1xuXG4gICAgICAgICAgICB0aGlzLm5vZGUgPSBvcHRpb25zLm5vZGU7XG5cbiAgICAgICAgICAgIHRoaXMuZXhwcnMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuZXhwckZucyA9IHt9O1xuICAgICAgICAgICAgdGhpcy51cGRhdGVGbnMgPSB7fTtcbiAgICAgICAgICAgIHRoaXMuZXhwck9sZFZhbHVlcyA9IHt9O1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldENvbXBvbmVudEV2ZW50OiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50RXZlbnQgPSBldmVudDtcbiAgICAgICAgfSxcblxuICAgICAgICBjb2xsZWN0RXhwcnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjdXJOb2RlID0gdGhpcy5ub2RlO1xuXG4gICAgICAgICAgICB2YXIgYXR0cmlidXRlcyA9IGN1ck5vZGUuYXR0cmlidXRlcztcbiAgICAgICAgICAgIC8vIOaQnOmbhuS4jeWQq+acieihqOi+vuW8j+eahOWxnuaAp++8jOeEtuWQjuWcqOe7hOS7tuexu+WIm+W7uuWlveS5i+WQjuiuvue9rui/m+e7hOS7tlxuICAgICAgICAgICAgdGhpcy5zZXRMaXRlcmFsQXR0cnNGbnMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IGF0dHJpYnV0ZXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBhdHRyID0gYXR0cmlidXRlc1tpXTtcbiAgICAgICAgICAgICAgICB2YXIgZXhwciA9IGF0dHIubm9kZVZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbmZpZy5nZXRFeHByUmVnRXhwKCkudGVzdChleHByKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmV4cHJzLnB1c2goZXhwcik7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5leHByRm5zW2V4cHJdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmF3RXhwciA9IGdldFJhd0V4cHIoZXhwciwgdGhpcy5jb25maWcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5leHByQ2FsY3VsYXRlci5jcmVhdGVFeHByRm4ocmF3RXhwcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmV4cHJGbnNbZXhwcl0gPSB1dGlscy5iaW5kKGNhbGN1bGF0ZUV4cHIsIG51bGwsIHJhd0V4cHIsIHRoaXMuZXhwckNhbGN1bGF0ZXIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUZuc1tleHByXSA9IHRoaXMudXBkYXRlRm5zW2V4cHJdIHx8IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVGbnNbZXhwcl0ucHVzaCh1dGlscy5iaW5kKHNldEF0dHJGbiwgbnVsbCwgYXR0ci5ub2RlTmFtZSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldExpdGVyYWxBdHRyc0Zucy5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgdXRpbHMuYmluZChzZXRBdHRyRm4sIG51bGwsIGF0dHIubm9kZU5hbWUsIGF0dHIubm9kZVZhbHVlKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGNvbXBvbmVudE5hbWUgPSB0aGlzLm5vZGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoJ3VpJywgJycpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoLy1bYS16XS9nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcmd1bWVudHNbMF1bMV0udG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIENvbXBvbmVudENsYXNzID0gdGhpcy5jb21wb25lbnRNYW5hZ2VyLmdldENsYXNzKGNvbXBvbmVudE5hbWUpO1xuICAgICAgICAgICAgaWYgKCFDb21wb25lbnRDbGFzcykge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigndGhlIGNvbXBvbmVudCBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCBpcyBub3QgcmVnaXN0ZWQhJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50ID0gbmV3IENvbXBvbmVudENsYXNzKHtcbiAgICAgICAgICAgICAgICBjb21wb25lbnROb2RlOiB0aGlzLm5vZGUsXG4gICAgICAgICAgICAgICAgdHJlZTogdGhpcy50cmVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbXBvbmVudEV2ZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnRFdmVudC50cmlnZ2VyKCduZXdjb21wb25lbnQnLCB0aGlzLmNvbXBvbmVudCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOiuvue9rue7hOS7tuWxnuaAp+OAglxuICAgICAgICAgICAgICog55Sx5LqOSFRNTOagh+etvuS4reS4jeiDveWGmempvOWzsOW9ouW8j+eahOWxnuaAp+WQje+8jFxuICAgICAgICAgICAgICog5omA5Lul5q2k5aSE5Lya5bCG5Lit5qiq57q/5b2i5byP55qE5bGe5oCn6L2s5o2i5oiQ6am85bOw5b2i5byP44CCXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQGlubmVyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAgICAgIOWxnuaAp+WQjVxuICAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlICAgICDlsZ7mgKflgLxcbiAgICAgICAgICAgICAqIEBwYXJhbSB7Q29tcG9uZW50fSBjb21wb25lbnQg57uE5Lu2XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGZ1bmN0aW9uIHNldEF0dHJGbihuYW1lLCB2YWx1ZSwgY29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LnNldEF0dHIodXRpbHMubGluZTJjYW1lbChuYW1lKSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBjYWxjdWxhdGVFeHByKHJhd0V4cHIsIGV4cHJDYWxjdWxhdGVyLCBzY29wZU1vZGVsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGV4cHJDYWxjdWxhdGVyLmNhbGN1bGF0ZShyYXdFeHByLCBmYWxzZSwgc2NvcGVNb2RlbCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldFJhd0V4cHIoZXhwciwgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGV4cHIucmVwbGFjZShjb25maWcuZ2V0RXhwclJlZ0V4cCgpLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcmd1bWVudHNbMV07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiOt+WPluW8gOWni+iKgueCuVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICAqIEBpbmhlcml0RG9jXG4gICAgICAgICAqIEByZXR1cm4ge05vZGV9XG4gICAgICAgICAqL1xuICAgICAgICBnZXRTdGFydE5vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5jb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5ub2RlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb21wb25lbnQuc3RhcnROb2RlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5bnu5PmnZ/oioLngrlcbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKiBAaW5oZXJpdERvY1xuICAgICAgICAgKiBAcmV0dXJuIHtOb2RlfVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0RW5kTm9kZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmNvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm5vZGU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbXBvbmVudC5lbmROb2RlO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldFNjb3BlOiBmdW5jdGlvbiAoc2NvcGVNb2RlbCkge1xuICAgICAgICAgICAgUGFyc2VyLnByb3RvdHlwZS5zZXRTY29wZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudC5zZXRPdXRTY29wZSh0aGlzLnNjb3BlTW9kZWwpO1xuXG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudC5tb3VudCgpO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaWwgPSB0aGlzLnNldExpdGVyYWxBdHRyc0Zucy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRMaXRlcmFsQXR0cnNGbnNbaV0odGhpcy5jb21wb25lbnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudC5saXRlcmFsQXR0clJlYWR5KCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgb25DaGFuZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzR29EYXJrKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZXhwcnMgPSB0aGlzLmV4cHJzO1xuICAgICAgICAgICAgdmFyIGV4cHJPbGRWYWx1ZXMgPSB0aGlzLmV4cHJPbGRWYWx1ZXM7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaWwgPSBleHBycy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGV4cHIgPSBleHByc1tpXTtcbiAgICAgICAgICAgICAgICB2YXIgZXhwclZhbHVlID0gdGhpcy5leHByRm5zW2V4cHJdKHRoaXMuc2NvcGVNb2RlbCk7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kaXJ0eUNoZWNrKGV4cHIsIGV4cHJWYWx1ZSwgZXhwck9sZFZhbHVlc1tleHByXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHVwZGF0ZUZucyA9IHRoaXMudXBkYXRlRm5zW2V4cHJdO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMCwgamwgPSB1cGRhdGVGbnMubGVuZ3RoOyBqIDwgamw7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlRm5zW2pdKGV4cHJWYWx1ZSwgdGhpcy5jb21wb25lbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZXhwck9sZFZhbHVlc1tleHByXSA9IGV4cHJWYWx1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgUGFyc2VyLnByb3RvdHlwZS5vbkNoYW5nZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdvRGFyazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5jb21wb25lbnQuZ29EYXJrKCk7XG4gICAgICAgICAgICB0aGlzLmlzR29EYXJrID0gdHJ1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICByZXN0b3JlRnJvbURhcms6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50LnJlc3RvcmVGcm9tRGFyaygpO1xuICAgICAgICAgICAgdGhpcy5pc0dvRGFyayA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICAgIGlzUHJvcGVyTm9kZTogZnVuY3Rpb24gKG5vZGUsIGNvbmZpZykge1xuICAgICAgICAgICAgcmV0dXJuIG5vZGUubm9kZVR5cGUgPT09IDFcbiAgICAgICAgICAgICAgICAmJiBub2RlLnRhZ05hbWUudG9Mb3dlckNhc2UoKS5pbmRleE9mKCd1aS0nKSA9PT0gMDtcbiAgICAgICAgfSxcblxuICAgICAgICAkbmFtZTogJ0NvbXBvbmVudFBhcnNlcidcbiAgICB9XG4pO1xuXG5UcmVlLnJlZ2lzdGVQYXJzZXIobW9kdWxlLmV4cG9ydHMpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92Y29tcG9uZW50L3NyYy9Db21wb25lbnRQYXJzZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAxNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDFcbiAqKi8iLCIvKipcbiAqIEBmaWxlIOino+aekOWZqOeahOaKveixoeWfuuexu1xuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbi8qKlxuICog5p6E6YCg5Ye95pWwXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyDphY3nva7lj4LmlbDvvIzkuIDoiKzlj6/og73kvJrmnInlpoLkuIvlhoXlrrnvvJpcbiAqICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydE5vZGU6IC4uLixcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmROb2RlOiAuLi4sXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZTogLi4uLFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzogLi4uXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICDlhbfkvZPmmK/llaXlj6/ku6Xlj4LliqDlhbfkvZPnmoTlrZDnsbtcbiAqL1xuXG52YXIgQmFzZSA9IHJlcXVpcmUoJy4uL0Jhc2UnKTtcbm1vZHVsZS5leHBvcnRzID0gQmFzZS5leHRlbmRzKFxuICAgIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICog5Yid5aeL5YyWXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMg5p2l6Ieq5LqO5p6E6YCg5Ye95pWwXG4gICAgICAgICAqL1xuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgdGhpcy5leHByQ2FsY3VsYXRlciA9IG9wdGlvbnMuZXhwckNhbGN1bGF0ZXI7XG4gICAgICAgICAgICB0aGlzLmNvbmZpZyA9IG9wdGlvbnMuY29uZmlnO1xuICAgICAgICAgICAgdGhpcy5kb21VcGRhdGVyID0gb3B0aW9ucy5kb21VcGRhdGVyO1xuICAgICAgICAgICAgdGhpcy50cmVlID0gb3B0aW9ucy50cmVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDnu5HlrppzY29wZSBtb2RlbFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqIEBwYXJhbSB7U2NvcGVNb2RlbH0gc2NvcGVNb2RlbCBzY29wZSBtb2RlbFxuICAgICAgICAgKi9cbiAgICAgICAgc2V0U2NvcGU6IGZ1bmN0aW9uIChzY29wZU1vZGVsKSB7XG4gICAgICAgICAgICB0aGlzLnNjb3BlTW9kZWwgPSBzY29wZU1vZGVsO1xuXG4gICAgICAgICAgICB0aGlzLnNjb3BlTW9kZWwub24oJ2NoYW5nZScsIHRoaXMub25DaGFuZ2UsIHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5zY29wZU1vZGVsLm9uKCdwYXJlbnRjaGFuZ2UnLCB0aGlzLm9uQ2hhbmdlLCB0aGlzKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogbW9kZWwg5Y+R55Sf5Y+Y5YyW55qE5Zue6LCD5Ye95pWwXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICovXG4gICAgICAgIG9uQ2hhbmdlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmRvbVVwZGF0ZXIuZXhlY3V0ZSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5ZzY29wZSBtb2RlbFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqIEByZXR1cm4ge1Njb3BlTW9kZWx9IHNjb3BlIG1vZGVs5a+56LGhXG4gICAgICAgICAqL1xuICAgICAgICBnZXRTY29wZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2NvcGVNb2RlbDtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog5ZCRc2NvcGUgbW9kZWzph4zpnaLorr7nva7mlbDmja5cbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSDopoHorr7nva7nmoTmlbDmja5cbiAgICAgICAgICovXG4gICAgICAgIHNldERhdGE6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICB0aGlzLnNjb3BlTW9kZWwuc2V0KGRhdGEpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDpmpDol4/lvZPliY1wYXJzZXLlrp7kvovnm7jlhbPnmoToioLngrnjgILlhbfkvZPlrZDnsbvlrp7njrBcbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAYWJzdHJhY3RcbiAgICAgICAgICovXG4gICAgICAgIGdvRGFyazogZnVuY3Rpb24gKCkge30sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOaYvuekuuebuOWFs+WFg+e0oFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqIEBhYnN0cmFjdFxuICAgICAgICAgKi9cbiAgICAgICAgcmVzdG9yZUZyb21EYXJrOiBmdW5jdGlvbiAoKSB7fSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6I635Y+W6Kej5p6Q5Zmo5b2T5YmN54q25oCB5LiL55qE5byA5aeLRE9N6IqC54K544CCXG4gICAgICAgICAqXG4gICAgICAgICAqIOeUseS6juacieeahOino+aekOWZqOS8muWwhuS5i+WJjeeahOiKgueCueenu+mZpOaOie+8jOmCo+S5iOWwseS8muWvuemBjeWOhuW4puadpeW9seWTjeS6hu+8jFxuICAgICAgICAgKiDmiYDku6XmraTlpITmj5DkvpvkuKTkuKrojrflj5blvIDlp4voioLngrnlkoznu5PmnZ/oioLngrnnmoTmlrnms5XjgIJcbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAcmV0dXJuIHtOb2RlfSBET03oioLngrnlr7nosaFcbiAgICAgICAgICovXG4gICAgICAgIGdldFN0YXJ0Tm9kZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RhcnROb2RlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5bop6PmnpDlmajlvZPliY3nirbmgIHkuIvnmoTnu5PmnZ9ET03oioLngrlcbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAcmV0dXJuIHtOb2RlfSDoioLngrnlr7nosaFcbiAgICAgICAgICovXG4gICAgICAgIGdldEVuZE5vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVuZE5vZGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOaQnOmbhuihqOi+vuW8j++8jOeUn+aIkOihqOi+vuW8j+WHveaVsOWSjCBET00g5pu05paw5Ye95pWw44CC5YW35L2T5a2Q57G75a6e546wXG4gICAgICAgICAqXG4gICAgICAgICAqIEBhYnN0cmFjdFxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqL1xuICAgICAgICBjb2xsZWN0RXhwcnM6IGZ1bmN0aW9uICgpIHt9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDohI/mo4DmtYvjgILpu5jorqTkvJrkvb/nlKjlhajnrYnliKTmlq3jgIJcbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IGV4cHIgICAgICAgICDopoHmo4Dmn6XnmoTooajovr7lvI9cbiAgICAgICAgICogQHBhcmFtICB7Kn0gZXhwclZhbHVlICAgIOihqOi+vuW8j+W9k+WJjeiuoeeul+WHuuadpeeahOWAvFxuICAgICAgICAgKiBAcGFyYW0gIHsqfSBleHByT2xkVmFsdWUg6KGo6L6+5byP5LiK5LiA5qyh6K6h566X5Ye65p2l55qE5YC8XG4gICAgICAgICAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgICDkuKTmrKHnmoTlgLzmmK/lkKbnm7jlkIxcbiAgICAgICAgICovXG4gICAgICAgIGRpcnR5Q2hlY2s6IGZ1bmN0aW9uIChleHByLCBleHByVmFsdWUsIGV4cHJPbGRWYWx1ZSkge1xuICAgICAgICAgICAgdmFyIGRpcnR5Q2hlY2tlckZuID0gdGhpcy5kaXJ0eUNoZWNrZXIgPyB0aGlzLmRpcnR5Q2hlY2tlci5nZXRDaGVja2VyKGV4cHIpIDogbnVsbDtcbiAgICAgICAgICAgIHJldHVybiAoZGlydHlDaGVja2VyRm4gJiYgZGlydHlDaGVja2VyRm4oZXhwciwgZXhwclZhbHVlLCBleHByT2xkVmFsdWUpKVxuICAgICAgICAgICAgICAgICAgICB8fCAoIWRpcnR5Q2hlY2tlckZuICYmIGV4cHJWYWx1ZSAhPT0gZXhwck9sZFZhbHVlKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6K6+572u6ISP5qOA5rWL5ZmoXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwdWJsaWNcbiAgICAgICAgICogQHBhcmFtIHtEaXJ0eUNoZWNrZXJ9IGRpcnR5Q2hlY2tlciDohI/mo4DmtYvlmahcbiAgICAgICAgICovXG4gICAgICAgIHNldERpcnR5Q2hlY2tlcjogZnVuY3Rpb24gKGRpcnR5Q2hlY2tlcikge1xuICAgICAgICAgICAgdGhpcy5kaXJ0eUNoZWNrZXIgPSBkaXJ0eUNoZWNrZXI7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOmUgOavgeino+aekOWZqO+8jOWwhueVjOmdouaBouWkjeaIkOWOn+agt1xuICAgICAgICAgKlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqL1xuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmV4cHJDYWxjdWxhdGVyID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuZG9tVXBkYXRlciA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLnRyZWUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5kaXJ0eUNoZWNrZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICAgICRuYW1lOiAnUGFyc2VyJ1xuICAgIH1cbik7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Z0cGwvc3JjL3BhcnNlcnMvUGFyc2VyLmpzXG4gKiogbW9kdWxlIGlkID0gMTVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxXG4gKiovIiwiLyoqXG4gKiBAZmlsZSDnu4Tku7bnrqHnkIbjgIJDb21wb25lbnRNYW5hZ2Vy5Lmf5piv5pyJ5bGC57qn5YWz57O755qE77yMXG4gKiAgICAgICBUcmVl5LiL6Z2i55qEQ29tcG9uZW50TWFuYWdlcuazqOWGjOi/meS4qlRyZWXlrp7kvovnlKjliLDnmoRDb21wb25lbnTvvIxcbiAqICAgICAgIOiAjOWcqENvbXBvbmVudOS4reS5n+WPr+S7peazqOWGjOatpENvbXBvbmVudOeahHRwbOS4reWwhuS8muS9v+eUqOWIsOeahENvbXBvbmVudOOAglxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJ3Z0cGwvc3JjL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIENvbXBvbmVudE1hbmFnZXIoKSB7XG4gICAgdGhpcy5jb21wb25lbnRzID0ge307XG59XG5cbi8qKlxuICog5rOo5YaM57uE5Lu244CCXG4gKlxuICogQHB1YmxpY1xuICogQHBhcmFtICB7Q29uc3RydWN0b3J9IENvbXBvbmVudENsYXNzIOe7hOS7tuexu1xuICogQHBhcmFtICB7c3RyaW5nPX0gbmFtZSAgICAgICAgICAg57uE5Lu25ZCN77yM5Y+v6YCJXG4gKi9cbkNvbXBvbmVudE1hbmFnZXIucHJvdG90eXBlLnJlZ2lzdGUgPSBmdW5jdGlvbiAoQ29tcG9uZW50Q2xhc3MpIHtcbiAgICB2YXIgbmFtZSA9IENvbXBvbmVudENsYXNzLiRuYW1lO1xuICAgIHRoaXMuY29tcG9uZW50c1tuYW1lXSA9IENvbXBvbmVudENsYXNzO1xuICAgIHRoaXMubW91bnRTdHlsZShDb21wb25lbnRDbGFzcyk7XG59O1xuXG4vKipcbiAqIOagueaNruWQjeWtl+iOt+WPlue7hOS7tuexu+OAguWcqOaooeadv+ino+aekOeahOi/h+eoi+S4reS8muiwg+eUqOi/meS4quaWueazleOAglxuICpcbiAqIEBwdWJsaWNcbiAqIEBwYXJhbSAge3N0cmluZ30gbmFtZSDnu4Tku7blkI1cbiAqIEByZXR1cm4ge0NvbXBvbmVudENsYXNzfSAg57uE5Lu257G7XG4gKi9cbkNvbXBvbmVudE1hbmFnZXIucHJvdG90eXBlLmdldENsYXNzID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB2YXIgY29tcG9uZW50ID0gdGhpcy5jb21wb25lbnRzW25hbWVdO1xuICAgIGlmIChjb21wb25lbnQpIHtcbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgICAgY29tcG9uZW50ID0gdGhpcy5wYXJlbnQuZ2V0Q2xhc3MobmFtZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbXBvbmVudDtcbn07XG5cbi8qKlxuICog6K6+572u54i257qn57uE5Lu2566h55CG5ZmoXG4gKlxuICogQHB1YmxpY1xuICogQHBhcmFtIHtDb21wb25lbnRNYW5nZXJ9IGNvbXBvbmVudE1hbmFnZXIg57uE5Lu2566h55CG5ZmoXG4gKi9cbkNvbXBvbmVudE1hbmFnZXIucHJvdG90eXBlLnNldFBhcmVudCA9IGZ1bmN0aW9uIChjb21wb25lbnRNYW5hZ2VyKSB7XG4gICAgdGhpcy5wYXJlbnQgPSBjb21wb25lbnRNYW5hZ2VyO1xufTtcblxuLyoqXG4gKiDlsIbnu4Tku7bnmoTmoLflvI/mjILovb3kuIrljrtcbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHvnu4Tku7bnsbt9IENvbXBvbmVudENsYXNzIOe7hOS7tuexu1xuICovXG5Db21wb25lbnRNYW5hZ2VyLnByb3RvdHlwZS5tb3VudFN0eWxlID0gZnVuY3Rpb24gKENvbXBvbmVudENsYXNzKSB7XG4gICAgdmFyIHN0eWxlTm9kZUlkID0gJ2NvbXBvbmVudC0nICsgQ29tcG9uZW50Q2xhc3MuJG5hbWU7XG5cbiAgICAvLyDliKTmlq3kuIDkuIvvvIzpgb/lhY3ph43lpI3mt7vliqBjc3NcbiAgICBpZiAoIWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHN0eWxlTm9kZUlkKSkge1xuICAgICAgICB2YXIgc3R5bGUgPSBDb21wb25lbnRDbGFzcy5nZXRTdHlsZSgpO1xuICAgICAgICBpZiAoc3R5bGUpIHtcbiAgICAgICAgICAgIHZhciBzdHlsZU5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICAgICAgc3R5bGVOb2RlLnNldEF0dHJpYnV0ZSgnaWQnLCBzdHlsZU5vZGVJZCk7XG4gICAgICAgICAgICBzdHlsZU5vZGUuaW5uZXJIVE1MID0gc3R5bGUucmVwbGFjZShcbiAgICAgICAgICAgICAgICAvI3Jvb3QjL2csXG4gICAgICAgICAgICAgICAgJy4nICsgQ29tcG9uZW50TWFuYWdlci5nZXRDc3NDbGFzc05hbWUoQ29tcG9uZW50Q2xhc3MpLmpvaW4oJy4nKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVOb2RlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIOWwhueItuexu+eahGNzc+agt+W8j+S5n+WKoOS4iuWOu+OAgueItuexu+W+iOWPr+iDveayoeazqOWGjO+8jOWmguaenOatpOWkhOS4jeWKoOS4iuWOu++8jOagt+W8j+WPr+iDveWwseS8mue8uuS4gOWdl+OAglxuICAgIGlmIChDb21wb25lbnRDbGFzcy4kbmFtZSAhPT0gJ0NvbXBvbmVudCcpIHtcbiAgICAgICAgdGhpcy5tb3VudFN0eWxlKENvbXBvbmVudENsYXNzLiRzdXBlckNsYXNzKTtcbiAgICB9XG59O1xuXG4vKipcbiAqIOiOt+WPlue7hOS7tueahGNzc+exu+WQjeOAguinhOWImeaYr+agueaNrue7p+aJv+WFs+ezu++8jOi/m+ihjOexu+WQjeaLvOaOpe+8jOS7juiAjOS9v+WtkOe7hOS7tuexu+eahGNzc+WFt+acieabtOmrmOS8mOWFiOe6p+OAglxuICpcbiAqIEBzdGF0aWNcbiAqIEBwYXJhbSB7Q29uc3RydWN0b3J9IENvbXBvbmVudENsYXNzIOe7hOS7tuexu1xuICogQHJldHVybiB7QXJyYXkuPHN0cmluZz59IOWQiOaIkOexu+WQjeaVsOe7hFxuICovXG5Db21wb25lbnRNYW5hZ2VyLmdldENzc0NsYXNzTmFtZSA9IGZ1bmN0aW9uIChDb21wb25lbnRDbGFzcykge1xuICAgIHZhciBuYW1lID0gW107XG4gICAgZm9yICh2YXIgY3VyQ2xzID0gQ29tcG9uZW50Q2xhc3M7IGN1ckNsczsgY3VyQ2xzID0gY3VyQ2xzLiRzdXBlckNsYXNzKSB7XG4gICAgICAgIG5hbWUucHVzaCh1dGlscy5jYW1lbDJsaW5lKGN1ckNscy4kbmFtZSkpO1xuXG4gICAgICAgIC8vIOacgOWkmuWIsOe7hOS7tuWfuuexu1xuICAgICAgICBpZiAoY3VyQ2xzLiRuYW1lID09PSAnQ29tcG9uZW50Jykge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5hbWU7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gQ29tcG9uZW50TWFuYWdlcjtcblxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92Y29tcG9uZW50L3NyYy9Db21wb25lbnRNYW5hZ2VyLmpzXG4gKiogbW9kdWxlIGlkID0gMTZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxXG4gKiovIiwicmVxdWlyZSgnLi9zcmMvcGFyc2Vycy9TY29wZURpcmVjdGl2ZVBhcnNlcicpO1xuXG52YXIgYW1kRXhwb3J0cyA9IHtcbiAgICBDb25maWc6IHJlcXVpcmUoJy4vc3JjL0NvbmZpZycpLFxuICAgIFRyZWU6IHJlcXVpcmUoJy4vc3JjL3RyZWVzL1RyZWUnKSxcbiAgICBEaXJ0eUNoZWNrZXI6IHJlcXVpcmUoJy4vc3JjL0RpcnR5Q2hlY2tlcicpLFxuICAgIFBhcnNlcjogcmVxdWlyZSgnLi9zcmMvcGFyc2Vycy9QYXJzZXInKSxcbiAgICBGb3JEaXJlY3RpdmVQYXJzZXI6IHJlcXVpcmUoJy4vc3JjL3BhcnNlcnMvRm9yRGlyZWN0aXZlUGFyc2VyJyksXG4gICAgSWZEaXJlY3RpdmVQYXJzZXI6IHJlcXVpcmUoJy4vc3JjL3BhcnNlcnMvSWZEaXJlY3RpdmVQYXJzZXInKSxcbiAgICBFdmVudEV4cHJQYXJzZXI6IHJlcXVpcmUoJy4vc3JjL3BhcnNlcnMvRXZlbnRFeHByUGFyc2VyJyksXG4gICAgRXhwclBhcnNlcjogcmVxdWlyZSgnLi9zcmMvcGFyc2Vycy9FeHByUGFyc2VyJyksXG4gICAgRXhwckNhbGN1bGF0ZXI6IHJlcXVpcmUoJy4vc3JjL0V4cHJDYWxjdWxhdGVyJyksXG4gICAgVmFyRGlyZWN0aXZlUGFyc2VyOiByZXF1aXJlKCcuL3NyYy9wYXJzZXJzL1ZhckRpcmVjdGl2ZVBhcnNlcicpLFxuICAgIGluaGVyaXQ6IHJlcXVpcmUoJy4vc3JjL2luaGVyaXQnKSxcbiAgICB1dGlsczogcmVxdWlyZSgnLi9zcmMvdXRpbHMnKSxcbiAgICBEb21VcGRhdGVyOiByZXF1aXJlKCcuL3NyYy9Eb21VcGRhdGVyJyksXG4gICAgU2NvcGVNb2RlbDogcmVxdWlyZSgnLi9zcmMvU2NvcGVNb2RlbCcpXG59O1xuZGVmaW5lKGZ1bmN0aW9uIChyZXF1aXJlLCBleHBvcnRzLCBtb2R1bGUpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGFtZEV4cG9ydHM7XG59KTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdnRwbC9tYWluLmpzXG4gKiogbW9kdWxlIGlkID0gMTdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxXG4gKiovIiwiLyoqXG4gKiBAZmlsZSBzY29wZSBkaXJlY3RpdmUgcGFyc2VyXG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20pXG4gKi9cblxudmFyIERpcmVjdGl2ZVBhcnNlciA9IHJlcXVpcmUoJy4vRGlyZWN0aXZlUGFyc2VyJyk7XG52YXIgU2NvcGVNb2RlbCA9IHJlcXVpcmUoJy4uL1Njb3BlTW9kZWwnKTtcbnZhciBUcmVlID0gcmVxdWlyZSgnLi4vdHJlZXMvVHJlZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERpcmVjdGl2ZVBhcnNlci5leHRlbmRzKFxuICAgIHtcbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIERpcmVjdGl2ZVBhcnNlci5wcm90b3R5cGUuaW5pdGlhbGl6ZS5jYWxsKHRoaXMsIG9wdGlvbnMpO1xuXG4gICAgICAgICAgICB0aGlzLnN0YXJ0Tm9kZSA9IG9wdGlvbnMuc3RhcnROb2RlO1xuICAgICAgICAgICAgdGhpcy5lbmROb2RlID0gb3B0aW9ucy5lbmROb2RlO1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMudHJlZS5nZXRUcmVlVmFyKCdzY29wZXMnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMudHJlZS5zZXRUcmVlVmFyKCdzY29wZXMnLCB7fSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0U2NvcGU6IGZ1bmN0aW9uIChzY29wZU1vZGVsKSB7XG4gICAgICAgICAgICB0aGlzLnNjb3BlTW9kZWwuc2V0UGFyZW50KHNjb3BlTW9kZWwpO1xuICAgICAgICAgICAgc2NvcGVNb2RlbC5hZGRDaGlsZCh0aGlzLnNjb3BlTW9kZWwpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNvbGxlY3RFeHByczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHNjb3BlTmFtZSA9IHRoaXMuc3RhcnROb2RlLm5vZGVWYWx1ZVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXHMrL2csICcnKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKHRoaXMuY29uZmlnLnNjb3BlTmFtZSArICc6JywgJycpO1xuICAgICAgICAgICAgaWYgKHNjb3BlTmFtZSkge1xuICAgICAgICAgICAgICAgIHZhciBzY29wZXMgPSB0aGlzLnRyZWUuZ2V0VHJlZVZhcignc2NvcGVzJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5zY29wZU1vZGVsID0gbmV3IFNjb3BlTW9kZWwoKTtcbiAgICAgICAgICAgICAgICBzY29wZXNbc2NvcGVOYW1lXSA9IHNjb3Blc1tzY29wZU5hbWVdIHx8IFtdO1xuICAgICAgICAgICAgICAgIHNjb3Blc1tzY29wZU5hbWVdLnB1c2godGhpcy5zY29wZU1vZGVsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0Tm9kZTogdGhpcy5zdGFydE5vZGUubmV4dFNpYmxpbmcsXG4gICAgICAgICAgICAgICAgICAgIGVuZE5vZGU6IHRoaXMuZW5kTm9kZS5wcmV2aW91c1NpYmxpbmdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICAgIGlzUHJvcGVyTm9kZTogZnVuY3Rpb24gKG5vZGUsIGNvbmZpZykge1xuICAgICAgICAgICAgcmV0dXJuIERpcmVjdGl2ZVBhcnNlci5pc1Byb3Blck5vZGUobm9kZSwgY29uZmlnKVxuICAgICAgICAgICAgICAgICYmIG5vZGUubm9kZVZhbHVlLnJlcGxhY2UoL1xccysvLCAnJykuaW5kZXhPZihjb25maWcuc2NvcGVOYW1lICsgJzonKSA9PT0gMDtcbiAgICAgICAgfSxcblxuICAgICAgICBmaW5kRW5kTm9kZTogZnVuY3Rpb24gKHN0YXJ0Tm9kZSwgY29uZmlnKSB7XG4gICAgICAgICAgICB2YXIgY3VyTm9kZSA9IHN0YXJ0Tm9kZTtcbiAgICAgICAgICAgIHdoaWxlICgoY3VyTm9kZSA9IGN1ck5vZGUubmV4dFNpYmxpbmcpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzRW5kTm9kZShjdXJOb2RlLCBjb25maWcpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjdXJOb2RlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBnZXROb0VuZE5vZGVFcnJvcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcigndGhlIHNjb3BlIGRpcmVjdGl2ZSBpcyBub3QgcHJvcGVybHkgZW5kZWQhJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJG5hbWU6ICdTY29wZURpcmVjdGl2ZVBhcnNlcidcbiAgICB9XG4pO1xuXG5UcmVlLnJlZ2lzdGVQYXJzZXIobW9kdWxlLmV4cG9ydHMpO1xuXG5mdW5jdGlvbiBpc0VuZE5vZGUobm9kZSwgY29uZmlnKSB7XG4gICAgcmV0dXJuIG5vZGUubm9kZVR5cGUgPT09IDhcbiAgICAgICAgJiYgbm9kZS5ub2RlVmFsdWUucmVwbGFjZSgvXFxzKy9nLCAnJykgPT09IGNvbmZpZy5zY29wZUVuZE5hbWU7XG59XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Z0cGwvc3JjL3BhcnNlcnMvU2NvcGVEaXJlY3RpdmVQYXJzZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAxOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDFcbiAqKi8iLCIvKipcbiAqIEBmaWxlIOaMh+S7pOino+aekOWZqOaKveixoeexu+OAguaMh+S7pOiKgueCueS4gOWumuaYr+azqOmHiuiKgueCuVxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbnZhciBQYXJzZXIgPSByZXF1aXJlKCcuL1BhcnNlcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBhcnNlci5leHRlbmRzKFxuICAgIHt9LFxuICAgIHtcbiAgICAgICAgaXNQcm9wZXJOb2RlOiBmdW5jdGlvbiAobm9kZSwgY29uZmlnKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5ub2RlVHlwZSA9PT0gODtcbiAgICAgICAgfSxcbiAgICAgICAgJG5hbWU6ICdEaXJlY3RpdmVQYXJzZXInXG4gICAgfVxuKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdnRwbC9zcmMvcGFyc2Vycy9EaXJlY3RpdmVQYXJzZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAxOVxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDFcbiAqKi8iLCIvKipcbiAqIEBmaWxlIOmFjee9rlxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbmZ1bmN0aW9uIENvbmZpZygpIHtcbiAgICB0aGlzLmV4cHJQcmVmaXggPSAnJHsnO1xuICAgIHRoaXMuZXhwclN1ZmZpeCA9ICd9JztcblxuICAgIHRoaXMuaWZOYW1lID0gJ2lmJztcbiAgICB0aGlzLmVsaWZOYW1lID0gJ2VsaWYnO1xuICAgIHRoaXMuZWxzZU5hbWUgPSAnZWxzZSc7XG4gICAgdGhpcy5pZkVuZE5hbWUgPSAnL2lmJztcblxuICAgIHRoaXMuaWZQcmVmaXhSZWdFeHAgPSAvXlxccyppZjpcXHMqLztcbiAgICB0aGlzLmVsaWZQcmVmaXhSZWdFeHAgPSAvXlxccyplbGlmOlxccyovO1xuICAgIHRoaXMuZWxzZVByZWZpeFJlZ0V4cCA9IC9eXFxzKmVsc2VcXHMqLztcbiAgICB0aGlzLmlmRW5kUHJlZml4UmVnRXhwID0gL15cXHMqXFwvaWZcXHMqLztcblxuICAgIHRoaXMuZm9yTmFtZSA9ICdmb3InO1xuICAgIHRoaXMuZm9yRW5kTmFtZSA9ICcvZm9yJztcblxuICAgIHRoaXMuZm9yUHJlZml4UmVnRXhwID0gL15cXHMqZm9yOlxccyovO1xuICAgIHRoaXMuZm9yRW5kUHJlZml4UmVnRXhwID0gL15cXHMqXFwvZm9yXFxzKi87XG5cbiAgICB0aGlzLmV2ZW50UHJlZml4ID0gJ2V2ZW50JztcblxuICAgIHRoaXMudmFyTmFtZSA9ICd2YXInO1xuXG4gICAgdGhpcy5zY29wZU5hbWUgPSAnc2NvcGUnO1xuICAgIHRoaXMuc2NvcGVFbmROYW1lID0gJy9zY29wZSc7XG59XG5cbkNvbmZpZy5wcm90b3R5cGUuc2V0RXhwclByZWZpeCA9IGZ1bmN0aW9uIChwcmVmaXgpIHtcbiAgICB0aGlzLmV4cHJQcmVmaXggPSBwcmVmaXg7XG59O1xuXG5Db25maWcucHJvdG90eXBlLnNldEV4cHJTdWZmaXggPSBmdW5jdGlvbiAoc3VmZml4KSB7XG4gICAgdGhpcy5leHByU3VmZml4ID0gc3VmZml4O1xufTtcblxuQ29uZmlnLnByb3RvdHlwZS5nZXRFeHByUmVnRXhwID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5leHByUmVnRXhwKSB7XG4gICAgICAgIHRoaXMuZXhwclJlZ0V4cCA9IG5ldyBSZWdFeHAocmVnRXhwRW5jb2RlKHRoaXMuZXhwclByZWZpeCkgKyAnKC4rPyknICsgcmVnRXhwRW5jb2RlKHRoaXMuZXhwclN1ZmZpeCksICdnJyk7XG4gICAgfVxuICAgIHRoaXMuZXhwclJlZ0V4cC5sYXN0SW5kZXggPSAwO1xuICAgIHJldHVybiB0aGlzLmV4cHJSZWdFeHA7XG59O1xuXG5Db25maWcucHJvdG90eXBlLmdldEFsbElmUmVnRXhwID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5hbGxJZlJlZ0V4cCkge1xuICAgICAgICB0aGlzLmFsbElmUmVnRXhwID0gbmV3IFJlZ0V4cCgnXFxcXHMqKCdcbiAgICAgICAgICAgICsgdGhpcy5pZk5hbWUgKyAnfCdcbiAgICAgICAgICAgICsgdGhpcy5lbGlmTmFtZSArICd8J1xuICAgICAgICAgICAgKyB0aGlzLmVsc2VOYW1lICsgJ3wnXG4gICAgICAgICAgICArIHRoaXMuaWZFbmROYW1lICsgJyk6XFxcXHMqJywgJ2cnKTtcbiAgICB9XG4gICAgdGhpcy5hbGxJZlJlZ0V4cC5sYXN0SW5kZXggPSAwO1xuICAgIHJldHVybiB0aGlzLmFsbElmUmVnRXhwO1xufTtcblxuQ29uZmlnLnByb3RvdHlwZS5zZXRJZk5hbWUgPSBmdW5jdGlvbiAoaWZOYW1lKSB7XG4gICAgdGhpcy5pZk5hbWUgPSBpZk5hbWU7XG4gICAgdGhpcy5pZlByZWZpeFJlZ0V4cCA9IG5ldyBSZWdFeHAoJ15cXFxccyonICsgaWZOYW1lICsgJzpcXFxccyonKTtcbn07XG5cbkNvbmZpZy5wcm90b3R5cGUuc2V0RWxpZk5hbWUgPSBmdW5jdGlvbiAoZWxpZk5hbWUpIHtcbiAgICB0aGlzLmVsaWZOYW1lID0gZWxpZk5hbWU7XG4gICAgdGhpcy5lbGlmUHJlZml4UmVnRXhwID0gbmV3IFJlZ0V4cCgnXlxcXFxzKicgKyBlbGlmTmFtZSArICc6XFxcXHMqJyk7XG59O1xuXG5Db25maWcucHJvdG90eXBlLnNldEVsc2VOYW1lID0gZnVuY3Rpb24gKGVsc2VOYW1lKSB7XG4gICAgdGhpcy5lbHNlTmFtZSA9IGVsc2VOYW1lO1xuICAgIHRoaXMuZWxzZVByZWZpeFJlZ0V4cCA9IG5ldyBSZWdFeHAoJ15cXFxccyonICsgZWxzZU5hbWUgKyAnXFxcXHMqJyk7XG59O1xuXG5Db25maWcucHJvdG90eXBlLnNldElmRW5kTmFtZSA9IGZ1bmN0aW9uIChpZkVuZE5hbWUpIHtcbiAgICB0aGlzLmlmRW5kTmFtZSA9IGlmRW5kTmFtZTtcbiAgICB0aGlzLmlmRW5kUHJlZml4UmVnRXhwID0gbmV3IFJlZ0V4cCgnXlxcXFxzKicgKyBpZkVuZE5hbWUgKyAnXFxcXHMqJyk7XG59O1xuXG5Db25maWcucHJvdG90eXBlLnNldEZvck5hbWUgPSBmdW5jdGlvbiAoZm9yTmFtZSkge1xuICAgIHRoaXMuZm9yTmFtZSA9IGZvck5hbWU7XG4gICAgdGhpcy5mb3JQcmVmaXhSZWdFeHAgPSBuZXcgUmVnRXhwKCdeXFxcXHMqJyArIGZvck5hbWUgKyAnOlxcXFxzKicpO1xufTtcblxuQ29uZmlnLnByb3RvdHlwZS5zZXRGb3JFbmROYW1lID0gZnVuY3Rpb24gKGZvckVuZE5hbWUpIHtcbiAgICB0aGlzLmZvckVuZE5hbWUgPSBmb3JFbmROYW1lO1xuICAgIHRoaXMuZm9yRW5kUHJlZml4UmVnRXhwID0gbmV3IFJlZ0V4cCgnXlxcXFxzKicgKyBmb3JFbmROYW1lICsgJ1xcXFxzKicpO1xufTtcblxuQ29uZmlnLnByb3RvdHlwZS5nZXRGb3JFeHByc1JlZ0V4cCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuZm9yRXhwcnNSZWdFeHApIHtcbiAgICAgICAgdGhpcy5mb3JFeHByc1JlZ0V4cCA9IG5ldyBSZWdFeHAoJ1xcXFxzKidcbiAgICAgICAgICAgICsgdGhpcy5mb3JOYW1lXG4gICAgICAgICAgICArICc6XFxcXHMqJ1xuICAgICAgICAgICAgKyByZWdFeHBFbmNvZGUodGhpcy5leHByUHJlZml4KVxuICAgICAgICAgICAgKyAnKFteJyArIHJlZ0V4cEVuY29kZSh0aGlzLmV4cHJTdWZmaXgpXG4gICAgICAgICAgICArICddKyknICsgcmVnRXhwRW5jb2RlKHRoaXMuZXhwclN1ZmZpeCkpO1xuICAgIH1cbiAgICB0aGlzLmZvckV4cHJzUmVnRXhwLmxhc3RJbmRleCA9IDA7XG4gICAgcmV0dXJuIHRoaXMuZm9yRXhwcnNSZWdFeHA7XG59O1xuXG5Db25maWcucHJvdG90eXBlLmdldEZvckl0ZW1WYWx1ZU5hbWVSZWdFeHAgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLmZvckl0ZW1WYWx1ZU5hbWVSZWdFeHApIHtcbiAgICAgICAgdGhpcy5mb3JJdGVtVmFsdWVOYW1lUmVnRXhwID0gbmV3IFJlZ0V4cChcbiAgICAgICAgICAgICdhc1xcXFxzKicgKyByZWdFeHBFbmNvZGUodGhpcy5leHByUHJlZml4KVxuICAgICAgICAgICAgKyAnKFteJyArIHJlZ0V4cEVuY29kZSh0aGlzLmV4cHJTdWZmaXgpICsgJ10rKSdcbiAgICAgICAgICAgICsgcmVnRXhwRW5jb2RlKHRoaXMuZXhwclN1ZmZpeClcbiAgICAgICAgKTtcbiAgICB9XG4gICAgdGhpcy5mb3JJdGVtVmFsdWVOYW1lUmVnRXhwLmxhc3RJbmRleCA9IDA7XG4gICAgcmV0dXJuIHRoaXMuZm9ySXRlbVZhbHVlTmFtZVJlZ0V4cDtcbn07XG5cbkNvbmZpZy5wcm90b3R5cGUuc2V0RXZlbnRQcmVmaXggPSBmdW5jdGlvbiAocHJlZml4KSB7XG4gICAgdGhpcy5ldmVudFByZWZpeCA9IHByZWZpeDtcbn07XG5cbkNvbmZpZy5wcm90b3R5cGUuc2V0VmFyTmFtZSA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhpcy52YXJOYW1lID0gbmFtZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ29uZmlnO1xuXG5mdW5jdGlvbiByZWdFeHBFbmNvZGUoc3RyKSB7XG4gICAgcmV0dXJuICdcXFxcJyArIHN0ci5zcGxpdCgnJykuam9pbignXFxcXCcpO1xufVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL3NyYy9Db25maWcuanNcbiAqKiBtb2R1bGUgaWQgPSAyMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDFcbiAqKi8iLCIvKipcbiAqIEBmaWxlIOiEj+ajgOa1i+WZqFxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbmZ1bmN0aW9uIERpcnR5Q2hlY2tlcigpIHtcbiAgICB0aGlzLmNoZWNrZXJzID0ge307XG59XG5cbkRpcnR5Q2hlY2tlci5wcm90b3R5cGUuc2V0Q2hlY2tlciA9IGZ1bmN0aW9uIChleHByLCBjaGVja2VyRm4pIHtcbiAgICB0aGlzLmNoZWNrZXJzW2V4cHJdID0gY2hlY2tlckZuO1xufTtcblxuRGlydHlDaGVja2VyLnByb3RvdHlwZS5nZXRDaGVja2VyID0gZnVuY3Rpb24gKGV4cHIpIHtcbiAgICByZXR1cm4gdGhpcy5jaGVja2Vyc1tleHByXTtcbn07XG5cbkRpcnR5Q2hlY2tlci5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmNoZWNrZXJzID0gbnVsbDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRGlydHlDaGVja2VyO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL3NyYy9EaXJ0eUNoZWNrZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAyMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDFcbiAqKi8iLCIvKipcbiAqIEBmaWxlIGZvciDmjIfku6RcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG52YXIgRGlyZWN0aXZlUGFyc2VyID0gcmVxdWlyZSgnLi9EaXJlY3RpdmVQYXJzZXInKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG52YXIgRm9yVHJlZSA9IHJlcXVpcmUoJy4uL3RyZWVzL0ZvclRyZWUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBEaXJlY3RpdmVQYXJzZXIuZXh0ZW5kcyhcbiAgICB7XG5cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIERpcmVjdGl2ZVBhcnNlci5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgICAgICAgICB0aGlzLnN0YXJ0Tm9kZSA9IG9wdGlvbnMuc3RhcnROb2RlO1xuICAgICAgICAgICAgdGhpcy5lbmROb2RlID0gb3B0aW9ucy5lbmROb2RlO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNvbGxlY3RFeHByczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RhcnROb2RlLm5leHRTaWJsaW5nID09PSB0aGlzLmVuZE5vZGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB0cGxTZWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHV0aWxzLnRyYXZlcnNlTm9kZXModGhpcy5zdGFydE5vZGUsIHRoaXMuZW5kTm9kZSwgZnVuY3Rpb24gKGN1ck5vZGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoY3VyTm9kZSA9PT0gdGhpcy5zdGFydE5vZGUgfHwgY3VyTm9kZSA9PT0gdGhpcy5lbmROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0cGxTZWcuYXBwZW5kQ2hpbGQoY3VyTm9kZSk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgICAgIHRoaXMudHBsU2VnID0gdHBsU2VnO1xuXG4gICAgICAgICAgICB0aGlzLmV4cHIgPSB0aGlzLnN0YXJ0Tm9kZS5ub2RlVmFsdWUubWF0Y2godGhpcy5jb25maWcuZ2V0Rm9yRXhwcnNSZWdFeHAoKSlbMV07XG4gICAgICAgICAgICB0aGlzLmV4cHJGbiA9IHV0aWxzLmNyZWF0ZUV4cHJGbih0aGlzLmNvbmZpZy5nZXRFeHByUmVnRXhwKCksIHRoaXMuZXhwciwgdGhpcy5leHByQ2FsY3VsYXRlcik7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUZuID0gY3JlYXRlVXBkYXRlRm4oXG4gICAgICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0Tm9kZS5uZXh0U2libGluZyxcbiAgICAgICAgICAgICAgICB0aGlzLmVuZE5vZGUucHJldmlvdXNTaWJsaW5nLFxuICAgICAgICAgICAgICAgIHRoaXMuY29uZmlnLFxuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnROb2RlLm5vZGVWYWx1ZVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgb25DaGFuZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5leHByKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZXhwclZhbHVlID0gdGhpcy5leHByRm4odGhpcy5zY29wZU1vZGVsKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmRpcnR5Q2hlY2sodGhpcy5leHByLCBleHByVmFsdWUsIHRoaXMuZXhwck9sZFZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlRm4oZXhwclZhbHVlLCB0aGlzLnNjb3BlTW9kZWwpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmV4cHJPbGRWYWx1ZSA9IGV4cHJWYWx1ZTtcblxuICAgICAgICAgICAgRGlyZWN0aXZlUGFyc2VyLnByb3RvdHlwZS5vbkNoYW5nZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHV0aWxzLnRyYXZlcnNlTm9kZXModGhpcy50cGxTZWcuZmlyc3RDaGlsZCwgdGhpcy50cGxTZWcubGFzdENoaWxkLCBmdW5jdGlvbiAoY3VyTm9kZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZW5kTm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShjdXJOb2RlLCB0aGlzLmVuZE5vZGUpO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICAgIHV0aWxzLmVhY2godGhpcy50cmVlcywgZnVuY3Rpb24gKHRyZWUpIHtcbiAgICAgICAgICAgICAgICB0cmVlLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLnRwbFNlZyA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmV4cHIgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5leHByRm4gPSBudWxsO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVGbiA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0Tm9kZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmVuZE5vZGUgPSBudWxsO1xuICAgICAgICAgICAgRGlyZWN0aXZlUGFyc2VyLnByb3RvdHlwZS5kZXN0cm95LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgaXNQcm9wZXJOb2RlOiBmdW5jdGlvbiAobm9kZSwgY29uZmlnKSB7XG4gICAgICAgICAgICByZXR1cm4gRGlyZWN0aXZlUGFyc2VyLmlzUHJvcGVyTm9kZShub2RlLCBjb25maWcpXG4gICAgICAgICAgICAgICAgJiYgY29uZmlnLmZvclByZWZpeFJlZ0V4cC50ZXN0KG5vZGUubm9kZVZhbHVlKTtcbiAgICAgICAgfSxcblxuICAgICAgICBmaW5kRW5kTm9kZTogZnVuY3Rpb24gKGZvclN0YXJ0Tm9kZSwgY29uZmlnKSB7XG4gICAgICAgICAgICB2YXIgY3VyTm9kZSA9IGZvclN0YXJ0Tm9kZTtcbiAgICAgICAgICAgIHdoaWxlICgoY3VyTm9kZSA9IGN1ck5vZGUubmV4dFNpYmxpbmcpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzRm9yRW5kTm9kZShjdXJOb2RlLCBjb25maWcpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjdXJOb2RlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBnZXROb0VuZE5vZGVFcnJvcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcigndGhlIGBmb3JgIGRpcmVjdGl2ZSBpcyBub3QgcHJvcGVybHkgZW5kZWQhJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJG5hbWU6ICdGb3JEaXJlY3RpdmVQYXJzZXInXG4gICAgfVxuKTtcblxuRm9yVHJlZS5yZWdpc3RlUGFyc2VyKG1vZHVsZS5leHBvcnRzKTtcblxuZnVuY3Rpb24gaXNGb3JFbmROb2RlKG5vZGUsIGNvbmZpZykge1xuICAgIHJldHVybiBub2RlLm5vZGVUeXBlID09PSA4ICYmIGNvbmZpZy5mb3JFbmRQcmVmaXhSZWdFeHAudGVzdChub2RlLm5vZGVWYWx1ZSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVVwZGF0ZUZuKHBhcnNlciwgc3RhcnROb2RlLCBlbmROb2RlLCBjb25maWcsIGZ1bGxFeHByKSB7XG4gICAgdmFyIHRyZWVzID0gW107XG4gICAgcGFyc2VyLnRyZWVzID0gdHJlZXM7XG4gICAgdmFyIGl0ZW1WYXJpYWJsZU5hbWUgPSBmdWxsRXhwci5tYXRjaChwYXJzZXIuY29uZmlnLmdldEZvckl0ZW1WYWx1ZU5hbWVSZWdFeHAoKSlbMV07XG4gICAgdmFyIHRhc2tJZCA9IHBhcnNlci5kb21VcGRhdGVyLmdlbmVyYXRlVGFza0lkKCk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChleHByVmFsdWUsIHNjb3BlTW9kZWwpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gMDtcbiAgICAgICAgZm9yICh2YXIgayBpbiBleHByVmFsdWUpIHtcbiAgICAgICAgICAgIGlmICghdHJlZXNbaW5kZXhdKSB7XG4gICAgICAgICAgICAgICAgdHJlZXNbaW5kZXhdID0gY3JlYXRlVHJlZShwYXJzZXIsIGNvbmZpZyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRyZWVzW2luZGV4XS5yZXN0b3JlRnJvbURhcmsoKTtcbiAgICAgICAgICAgIHRyZWVzW2luZGV4XS5zZXREaXJ0eUNoZWNrZXIocGFyc2VyLmRpcnR5Q2hlY2tlcik7XG5cbiAgICAgICAgICAgIHZhciBsb2NhbCA9IHtcbiAgICAgICAgICAgICAgICBrZXk6IGssXG4gICAgICAgICAgICAgICAgaW5kZXg6IGluZGV4XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbG9jYWxbaXRlbVZhcmlhYmxlTmFtZV0gPSBleHByVmFsdWVba107XG5cbiAgICAgICAgICAgIHRyZWVzW2luZGV4XS5yb290U2NvcGUuc2V0UGFyZW50KHNjb3BlTW9kZWwpO1xuICAgICAgICAgICAgc2NvcGVNb2RlbC5hZGRDaGlsZCh0cmVlc1tpbmRleF0ucm9vdFNjb3BlKTtcblxuICAgICAgICAgICAgdHJlZXNbaW5kZXhdLnNldERhdGEobG9jYWwpO1xuXG4gICAgICAgICAgICBpbmRleCsrO1xuICAgICAgICB9XG5cbiAgICAgICAgcGFyc2VyLmRvbVVwZGF0ZXIuYWRkVGFza0ZuKHRhc2tJZCwgdXRpbHMuYmluZChmdW5jdGlvbiAodHJlZXMsIGluZGV4KSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gaW5kZXgsIGlsID0gdHJlZXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgICAgICAgICAgIHRyZWVzW2ldLmdvRGFyaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCBudWxsLCB0cmVlcywgaW5kZXgpKTtcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVUcmVlKHBhcnNlciwgY29uZmlnKSB7XG4gICAgdmFyIGNvcHlTZWcgPSBwYXJzZXIudHBsU2VnLmNsb25lTm9kZSh0cnVlKTtcbiAgICB2YXIgc3RhcnROb2RlID0gY29weVNlZy5maXJzdENoaWxkO1xuICAgIHZhciBlbmROb2RlID0gY29weVNlZy5sYXN0Q2hpbGQ7XG4gICAgdXRpbHMudHJhdmVyc2VOb2RlcyhzdGFydE5vZGUsIGVuZE5vZGUsIGZ1bmN0aW9uIChjdXJOb2RlKSB7XG4gICAgICAgIHBhcnNlci5lbmROb2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGN1ck5vZGUsIHBhcnNlci5lbmROb2RlKTtcbiAgICB9KTtcblxuICAgIHZhciB0cmVlID0gbmV3IEZvclRyZWUoe1xuICAgICAgICBzdGFydE5vZGU6IHN0YXJ0Tm9kZSxcbiAgICAgICAgZW5kTm9kZTogZW5kTm9kZSxcbiAgICAgICAgY29uZmlnOiBjb25maWcsXG4gICAgICAgIGRvbVVwZGF0ZXI6IHBhcnNlci50cmVlLmRvbVVwZGF0ZXIsXG4gICAgICAgIGV4cHJDYWxjdWxhdGVyOiBwYXJzZXIudHJlZS5leHByQ2FsY3VsYXRlclxuICAgIH0pO1xuICAgIHRyZWUuc2V0UGFyZW50KHBhcnNlci50cmVlKTtcbiAgICB0cmVlLnRyYXZlcnNlKCk7XG4gICAgcmV0dXJuIHRyZWU7XG59XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Z0cGwvc3JjL3BhcnNlcnMvRm9yRGlyZWN0aXZlUGFyc2VyLmpzXG4gKiogbW9kdWxlIGlkID0gMjJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxXG4gKiovIiwiLyoqXG4gKiBAZmlsZSBmb3LmjIfku6TkuK3nlKjliLDnmoRcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG52YXIgVHJlZSA9IHJlcXVpcmUoJy4vVHJlZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRyZWUuZXh0ZW5kcyhcbiAgICB7XG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgICBpZiAoIW9wdGlvbnMuY29uZmlnXG4gICAgICAgICAgICAgICAgfHwgIW9wdGlvbnMuZG9tVXBkYXRlclxuICAgICAgICAgICAgICAgIHx8ICFvcHRpb25zLmV4cHJDYWxjdWxhdGVyXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3dyb25nIGFyZ3VtZW50cycpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBUcmVlLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgJG5hbWU6ICdGb3JUcmVlJ1xuICAgIH1cbik7XG5cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdnRwbC9zcmMvdHJlZXMvRm9yVHJlZS5qc1xuICoqIG1vZHVsZSBpZCA9IDIzXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMVxuICoqLyIsIi8qKlxuICogQGZpbGUgaWYg5oyH5LukXG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20pXG4gKi9cblxudmFyIERpcmVjdGl2ZVBhcnNlciA9IHJlcXVpcmUoJy4vRGlyZWN0aXZlUGFyc2VyJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xudmFyIFRyZWUgPSByZXF1aXJlKCcuLi90cmVlcy9UcmVlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGlyZWN0aXZlUGFyc2VyLmV4dGVuZHMoXG4gICAge1xuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgRGlyZWN0aXZlUGFyc2VyLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgICAgIHRoaXMuc3RhcnROb2RlID0gb3B0aW9ucy5zdGFydE5vZGU7XG4gICAgICAgICAgICB0aGlzLmVuZE5vZGUgPSBvcHRpb25zLmVuZE5vZGU7XG4gICAgICAgICAgICB0aGlzLmNvbmZpZyA9IG9wdGlvbnMuY29uZmlnO1xuXG4gICAgICAgICAgICB0aGlzLmV4cHJzID0gW107XG4gICAgICAgICAgICB0aGlzLmV4cHJGbnMgPSB7fTtcblxuICAgICAgICAgICAgdGhpcy5oYW5kbGVCcmFuY2hlc1Rhc2tJZCA9IHRoaXMuZG9tVXBkYXRlci5nZW5lcmF0ZVRhc2tJZCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNvbGxlY3RFeHByczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGJyYW5jaGVzID0gW107XG4gICAgICAgICAgICB2YXIgYnJhbmNoSW5kZXggPSAtMTtcblxuICAgICAgICAgICAgdXRpbHMudHJhdmVyc2VOb2Rlcyh0aGlzLnN0YXJ0Tm9kZSwgdGhpcy5lbmROb2RlLCBmdW5jdGlvbiAoY3VyTm9kZSkge1xuICAgICAgICAgICAgICAgIHZhciBub2RlVHlwZSA9IGdldElmTm9kZVR5cGUoY3VyTm9kZSwgdGhpcy5jb25maWcpO1xuXG4gICAgICAgICAgICAgICAgaWYgKG5vZGVUeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldEVuZE5vZGUoY3VyTm9kZSwgYnJhbmNoZXMsIGJyYW5jaEluZGV4KTtcblxuICAgICAgICAgICAgICAgICAgICBicmFuY2hJbmRleCsrO1xuICAgICAgICAgICAgICAgICAgICBicmFuY2hlc1ticmFuY2hJbmRleF0gPSBicmFuY2hlc1ticmFuY2hJbmRleF0gfHwge307XG5cbiAgICAgICAgICAgICAgICAgICAgLy8g5pivIGlmIOiKgueCueaIluiAhSBlbGlmIOiKgueCue+8jOaQnOmbhuihqOi+vuW8j1xuICAgICAgICAgICAgICAgICAgICBpZiAobm9kZVR5cGUgPCAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXhwciA9IGN1ck5vZGUubm9kZVZhbHVlLnJlcGxhY2UodGhpcy5jb25maWcuZ2V0QWxsSWZSZWdFeHAoKSwgJycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5leHBycy5wdXNoKGV4cHIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZXhwckZuc1tleHByXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXhwckZuc1tleHByXSA9IHV0aWxzLmNyZWF0ZUV4cHJGbihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25maWcuZ2V0RXhwclJlZ0V4cCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHByLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmV4cHJDYWxjdWxhdGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChub2RlVHlwZSA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oYXNFbHNlQnJhbmNoID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFicmFuY2hlc1ticmFuY2hJbmRleF0uc3RhcnROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmFuY2hlc1ticmFuY2hJbmRleF0uc3RhcnROb2RlID0gY3VyTm9kZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGN1ck5vZGUgPSBjdXJOb2RlLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgIGlmICghY3VyTm9kZSB8fCBjdXJOb2RlID09PSB0aGlzLmVuZE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0RW5kTm9kZShjdXJOb2RlLCBicmFuY2hlcywgYnJhbmNoSW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICAgICAgdGhpcy5icmFuY2hlcyA9IGJyYW5jaGVzO1xuICAgICAgICAgICAgcmV0dXJuIGJyYW5jaGVzO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBzZXRFbmROb2RlKGN1ck5vZGUsIGJyYW5jaGVzLCBicmFuY2hJbmRleCkge1xuICAgICAgICAgICAgICAgIGlmIChicmFuY2hJbmRleCArIDEgJiYgYnJhbmNoZXNbYnJhbmNoSW5kZXhdLnN0YXJ0Tm9kZSkge1xuICAgICAgICAgICAgICAgICAgICBicmFuY2hlc1ticmFuY2hJbmRleF0uZW5kTm9kZSA9IGN1ck5vZGUucHJldmlvdXNTaWJsaW5nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBvbkNoYW5nZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGV4cHJzID0gdGhpcy5leHBycztcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IGV4cHJzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgZXhwciA9IGV4cHJzW2ldO1xuICAgICAgICAgICAgICAgIHZhciBleHByVmFsdWUgPSB0aGlzLmV4cHJGbnNbZXhwcl0odGhpcy5zY29wZU1vZGVsKTtcbiAgICAgICAgICAgICAgICBpZiAoZXhwclZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZG9tVXBkYXRlci5hZGRUYXNrRm4oXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZUJyYW5jaGVzVGFza0lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXRpbHMuYmluZChoYW5kbGVCcmFuY2hlcywgbnVsbCwgdGhpcy5icmFuY2hlcywgaSlcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzRWxzZUJyYW5jaCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZG9tVXBkYXRlci5hZGRUYXNrRm4oXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlQnJhbmNoZXNUYXNrSWQsXG4gICAgICAgICAgICAgICAgICAgIHV0aWxzLmJpbmQoaGFuZGxlQnJhbmNoZXMsIG51bGwsIHRoaXMuYnJhbmNoZXMsIGkpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5zdGFydE5vZGUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5lbmROb2RlID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuZXhwcnMgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5leHByRm5zID0gbnVsbDtcblxuICAgICAgICAgICAgRGlyZWN0aXZlUGFyc2VyLnByb3RvdHlwZS5kZXN0cm95LmNhbGwodGhpcyk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgaXNQcm9wZXJOb2RlOiBmdW5jdGlvbiAobm9kZSwgY29uZmlnKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0SWZOb2RlVHlwZShub2RlLCBjb25maWcpID09PSAxO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZpbmRFbmROb2RlOiBmdW5jdGlvbiAoaWZTdGFydE5vZGUsIGNvbmZpZykge1xuICAgICAgICAgICAgdmFyIGN1ck5vZGUgPSBpZlN0YXJ0Tm9kZTtcbiAgICAgICAgICAgIHdoaWxlICgoY3VyTm9kZSA9IGN1ck5vZGUubmV4dFNpYmxpbmcpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzSWZFbmROb2RlKGN1ck5vZGUsIGNvbmZpZykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN1ck5vZGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGdldE5vRW5kTm9kZUVycm9yOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKCd0aGUgaWYgZGlyZWN0aXZlIGlzIG5vdCBwcm9wZXJseSBlbmRlZCEnKTtcbiAgICAgICAgfSxcblxuICAgICAgICAkbmFtZTogJ0lmRGlyZWN0aXZlUGFyc2VyJ1xuICAgIH1cbik7XG5cblRyZWUucmVnaXN0ZVBhcnNlcihtb2R1bGUuZXhwb3J0cyk7XG5cbmZ1bmN0aW9uIGhhbmRsZUJyYW5jaGVzKGJyYW5jaGVzLCBzaG93SW5kZXgpIHtcbiAgICB1dGlscy5lYWNoKGJyYW5jaGVzLCBmdW5jdGlvbiAoYnJhbmNoLCBqKSB7XG4gICAgICAgIHZhciBmbiA9IGogPT09IHNob3dJbmRleCA/ICdyZXN0b3JlRnJvbURhcmsnIDogJ2dvRGFyayc7XG4gICAgICAgIHV0aWxzLmVhY2goYnJhbmNoLCBmdW5jdGlvbiAocGFyc2VyT2JqKSB7XG4gICAgICAgICAgICBwYXJzZXJPYmoucGFyc2VyW2ZuXSgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gaXNJZkVuZE5vZGUobm9kZSwgY29uZmlnKSB7XG4gICAgcmV0dXJuIGdldElmTm9kZVR5cGUobm9kZSwgY29uZmlnKSA9PT0gNDtcbn1cblxuZnVuY3Rpb24gZ2V0SWZOb2RlVHlwZShub2RlLCBjb25maWcpIHtcbiAgICBpZiAobm9kZS5ub2RlVHlwZSAhPT0gOCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5pZlByZWZpeFJlZ0V4cC50ZXN0KG5vZGUubm9kZVZhbHVlKSkge1xuICAgICAgICByZXR1cm4gMTtcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLmVsaWZQcmVmaXhSZWdFeHAudGVzdChub2RlLm5vZGVWYWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIDI7XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5lbHNlUHJlZml4UmVnRXhwLnRlc3Qobm9kZS5ub2RlVmFsdWUpKSB7XG4gICAgICAgIHJldHVybiAzO1xuICAgIH1cblxuICAgIGlmIChjb25maWcuaWZFbmRQcmVmaXhSZWdFeHAudGVzdChub2RlLm5vZGVWYWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIDQ7XG4gICAgfVxufVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL3NyYy9wYXJzZXJzL0lmRGlyZWN0aXZlUGFyc2VyLmpzXG4gKiogbW9kdWxlIGlkID0gMjRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxXG4gKiovIiwiLyoqXG4gKiBAZmlsZSDlpITnkIbkuobkuovku7bnmoQgRXhwclBhcnNlclxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbnZhciBFeHByUGFyc2VyID0gcmVxdWlyZSgnLi9FeHByUGFyc2VyJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xudmFyIFRyZWUgPSByZXF1aXJlKCcuLi90cmVlcy9UcmVlJyk7XG52YXIgU2NvcGVNb2RlbCA9IHJlcXVpcmUoJy4uL1Njb3BlTW9kZWwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBFeHByUGFyc2VyLmV4dGVuZHMoXG4gICAge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDliJ3lp4vljJZcbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKi9cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgRXhwclBhcnNlci5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgICAgICAgICB0aGlzLmV2ZW50cyA9IHt9O1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmt7vliqDooajovr7lvI9cbiAgICAgICAgICpcbiAgICAgICAgICogQGluaGVyaXRcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKiBAcGFyYW0ge0F0dHJ9IGF0dHIg5aaC5p6c5b2T5YmN5piv5YWD57Sg6IqC54K577yM5YiZ6KaB5Lyg5YWl6YGN5Y6G5Yiw55qE5bGe5oCn77yMXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgICDmiYDku6VhdHRy5a2Y5Zyo5LiO5ZCm5piv5Yik5pat5b2T5YmN5YWD57Sg5piv5ZCm5piv5paH5pys6IqC54K555qE5LiA5Liq5L6d5o2uXG4gICAgICAgICAqIEByZXR1cm4ge3VuZGVmaW5lZH1cbiAgICAgICAgICovXG4gICAgICAgIGFkZEV4cHI6IGZ1bmN0aW9uIChhdHRyKSB7XG4gICAgICAgICAgICBpZiAoIWF0dHIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gRXhwclBhcnNlci5wcm90b3R5cGUuYWRkRXhwci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZXZlbnROYW1lID0gZ2V0RXZlbnROYW1lKGF0dHIubmFtZSwgdGhpcy5jb25maWcpO1xuICAgICAgICAgICAgaWYgKGV2ZW50TmFtZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbmZpZy5nZXRFeHByUmVnRXhwKCkudGVzdChhdHRyLnZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdID0gYXR0ci52YWx1ZTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgZXhwciA9IGF0dHIudmFsdWUucmVwbGFjZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29uZmlnLmdldEV4cHJSZWdFeHAoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXJndW1lbnRzWzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmV4cHJDYWxjdWxhdGVyLmNyZWF0ZUV4cHJGbihleHByLCB0cnVlKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGVbJ29uJyArIGV2ZW50TmFtZV0gPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsb2NhbFNjb3BlID0gbmV3IFNjb3BlTW9kZWwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsU2NvcGUuc2V0KCdldmVudCcsIGV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsU2NvcGUuc2V0UGFyZW50KG1lLmdldFNjb3BlKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWUuZXhwckNhbGN1bGF0ZXIuY2FsY3VsYXRlKGV4cHIsIHRydWUsIGxvY2FsU2NvcGUpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIEV4cHJQYXJzZXIucHJvdG90eXBlLmFkZEV4cHIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6ZSA5q+BXG4gICAgICAgICAqXG4gICAgICAgICAqIEBpbmhlcml0XG4gICAgICAgICAqIEBwdWJsaWNcbiAgICAgICAgICovXG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHV0aWxzLmVhY2godGhpcy5ldmVudHMsIGZ1bmN0aW9uIChhdHRyVmFsdWUsIGV2ZW50TmFtZSkge1xuICAgICAgICAgICAgICAgIHRoaXMubm9kZVsnb24nICsgZXZlbnROYW1lXSA9IG51bGw7XG4gICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzID0gbnVsbDtcblxuICAgICAgICAgICAgRXhwclBhcnNlci5wcm90b3R5cGUuZGVzdHJveS5hcHBseSh0aGlzKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgICAkbmFtZTogJ0V2ZW50RXhwclBhcnNlcidcbiAgICB9XG4pO1xuXG5UcmVlLnJlZ2lzdGVQYXJzZXIobW9kdWxlLmV4cG9ydHMpO1xuXG5cbmZ1bmN0aW9uIGdldEV2ZW50TmFtZShhdHRyTmFtZSwgY29uZmlnKSB7XG4gICAgaWYgKGF0dHJOYW1lLmluZGV4T2YoY29uZmlnLmV2ZW50UHJlZml4ICsgJy0nKSA9PT0gLTEpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJldHVybiBhdHRyTmFtZS5yZXBsYWNlKGNvbmZpZy5ldmVudFByZWZpeCArICctJywgJycpO1xufVxuXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Z0cGwvc3JjL3BhcnNlcnMvRXZlbnRFeHByUGFyc2VyLmpzXG4gKiogbW9kdWxlIGlkID0gMjVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxXG4gKiovIiwiLyoqXG4gKiBAZmlsZSDooajovr7lvI/op6PmnpDlmajvvIzkuIDkuKrmlofmnKzoioLngrnmiJbogIXlhYPntKDoioLngrnlr7nlupTkuIDkuKrooajovr7lvI/op6PmnpDlmajlrp7kvotcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG52YXIgUGFyc2VyID0gcmVxdWlyZSgnLi9QYXJzZXInKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG52YXIgVHJlZSA9IHJlcXVpcmUoJy4uL3RyZWVzL1RyZWUnKTtcbnZhciBEb21VcGRhdGVyID0gcmVxdWlyZSgnLi4vRG9tVXBkYXRlcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBhcnNlci5leHRlbmRzKFxuICAgIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICog5Yid5aeL5YyWXG4gICAgICAgICAqXG4gICAgICAgICAqIEBpbmhlcml0RG9jXG4gICAgICAgICAqIEBwYXJhbSAge09iamVjdH0gb3B0aW9ucyDlj4LmlbBcbiAgICAgICAgICogQHBhcmFtICB7Tm9kZX0gb3B0aW9ucy5ub2RlIERPTeiKgueCuVxuICAgICAgICAgKi9cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIFBhcnNlci5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgICAgICAgICB0aGlzLm5vZGUgPSBvcHRpb25zLm5vZGU7XG5cbiAgICAgICAgICAgIHRoaXMuZXhwcnMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuZXhwckZucyA9IHt9O1xuICAgICAgICAgICAgdGhpcy51cGRhdGVGbnMgPSB7fTtcbiAgICAgICAgICAgIC8vIOaBouWkjeWOn+iyjOeahOWHveaVsFxuICAgICAgICAgICAgdGhpcy5yZXN0b3JlRm5zID0ge307XG4gICAgICAgICAgICB0aGlzLmV4cHJPbGRWYWx1ZXMgPSB7fTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog5pCc6ZuG6L+H56iLXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwdWJsaWNcbiAgICAgICAgICogQHJldHVybiB7Ym9vbGVhbn0g6L+U5Zue5biD5bCU5YC8XG4gICAgICAgICAqL1xuICAgICAgICBjb2xsZWN0RXhwcnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjdXJOb2RlID0gdGhpcy5ub2RlO1xuXG4gICAgICAgICAgICAvLyDmlofmnKzoioLngrlcbiAgICAgICAgICAgIGlmIChjdXJOb2RlLm5vZGVUeXBlID09PSAzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRFeHByKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOWFg+e0oOiKgueCuVxuICAgICAgICAgICAgaWYgKGN1ck5vZGUubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXR0cmlidXRlcyA9IGN1ck5vZGUuYXR0cmlidXRlcztcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaWwgPSBhdHRyaWJ1dGVzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRFeHByKGF0dHJpYnV0ZXNbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmt7vliqDooajovr7lvI9cbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKiBAcGFyYW0ge0F0dHJ9IGF0dHIg5aaC5p6c5b2T5YmN5piv5YWD57Sg6IqC54K577yM5YiZ6KaB5Lyg5YWl6YGN5Y6G5Yiw55qE5bGe5oCn77yMXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgICDmiYDku6VhdHRy5a2Y5Zyo5LiO5ZCm5piv5Yik5pat5b2T5YmN5YWD57Sg5piv5ZCm5piv5paH5pys6IqC54K555qE5LiA5Liq5L6d5o2uXG4gICAgICAgICAqL1xuICAgICAgICBhZGRFeHByOiBmdW5jdGlvbiAoYXR0cikge1xuICAgICAgICAgICAgdmFyIGV4cHIgPSBhdHRyID8gYXR0ci52YWx1ZSA6IHRoaXMubm9kZS5ub2RlVmFsdWU7XG4gICAgICAgICAgICBpZiAoIXRoaXMuY29uZmlnLmdldEV4cHJSZWdFeHAoKS50ZXN0KGV4cHIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYWRkRXhwcihcbiAgICAgICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgICAgIGV4cHIsXG4gICAgICAgICAgICAgICAgYXR0ciA/IGNyZWF0ZUF0dHJVcGRhdGVGbih0aGlzLm5vZGUsIGF0dHIubmFtZSwgdGhpcy5kb21VcGRhdGVyKSA6IChmdW5jdGlvbiAobWUsIGN1ck5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhc2tJZCA9IG1lLmRvbVVwZGF0ZXIuZ2VuZXJhdGVUYXNrSWQoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChleHByVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lLmRvbVVwZGF0ZXIuYWRkVGFza0ZuKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhc2tJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1dGlscy5iaW5kKGZ1bmN0aW9uIChjdXJOb2RlLCBleHByVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyTm9kZS5ub2RlVmFsdWUgPSBleHByVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgbnVsbCwgY3VyTm9kZSwgZXhwclZhbHVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9KSh0aGlzLCB0aGlzLm5vZGUpXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB0aGlzLnJlc3RvcmVGbnNbZXhwcl0gPSB0aGlzLnJlc3RvcmVGbnNbZXhwcl0gfHwgW107XG4gICAgICAgICAgICBpZiAoYXR0cikge1xuICAgICAgICAgICAgICAgIHRoaXMucmVzdG9yZUZuc1tleHByXS5wdXNoKHV0aWxzLmJpbmQoZnVuY3Rpb24gKGN1ck5vZGUsIGF0dHJOYW1lLCBhdHRyVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VyTm9kZS5zZXRBdHRyaWJ1dGUoYXR0ck5hbWUsIGF0dHJWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfSwgbnVsbCwgdGhpcy5ub2RlLCBhdHRyLm5hbWUsIGF0dHIudmFsdWUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMucmVzdG9yZUZuc1tleHByXS5wdXNoKHV0aWxzLmJpbmQoZnVuY3Rpb24gKGN1ck5vZGUsIG5vZGVWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBjdXJOb2RlLm5vZGVWYWx1ZSA9IG5vZGVWYWx1ZTtcbiAgICAgICAgICAgICAgICB9LCBudWxsLCB0aGlzLm5vZGUsIHRoaXMubm9kZS5ub2RlVmFsdWUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6I635Y+W5byA5aeL6IqC54K5XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICogQGluaGVyaXREb2NcbiAgICAgICAgICogQHJldHVybiB7Tm9kZX1cbiAgICAgICAgICovXG4gICAgICAgIGdldFN0YXJ0Tm9kZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubm9kZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6I635Y+W57uT5p2f6IqC54K5XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICogQGluaGVyaXREb2NcbiAgICAgICAgICogQHJldHVybiB7Tm9kZX1cbiAgICAgICAgICovXG4gICAgICAgIGdldEVuZE5vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5vZGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOmUgOavgVxuICAgICAgICAgKlxuICAgICAgICAgKiBAaW5oZXJpdERvY1xuICAgICAgICAgKi9cbiAgICAgICAgZGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdXRpbHMuZWFjaCh0aGlzLmV4cHJzLCBmdW5jdGlvbiAoZXhwcikge1xuICAgICAgICAgICAgICAgIHV0aWxzLmVhY2godGhpcy5yZXN0b3JlRm5zW2V4cHJdLCBmdW5jdGlvbiAocmVzdG9yZUZuKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3RvcmVGbigpO1xuICAgICAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICAgIHRoaXMubm9kZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmV4cHJzID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuZXhwckZucyA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUZucyA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmV4cHJPbGRWYWx1ZXMgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5yZXN0b3JlRm5zID0gbnVsbDtcblxuICAgICAgICAgICAgUGFyc2VyLnByb3RvdHlwZS5kZXN0cm95LmNhbGwodGhpcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiKgueCueKAnOmakOiXj+KAnei1t+adpVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqL1xuICAgICAgICBnb0Rhcms6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHV0aWxzLmdvRGFyayh0aGlzLm5vZGUpO1xuICAgICAgICAgICAgdGhpcy5pc0dvRGFyayA9IHRydWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWcqG1vZGVs5Y+R55Sf5pS55Y+Y55qE5pe25YCZ6K6h566X5LiA5LiL6KGo6L6+5byP55qE5YC8LT7ohI/mo4DmtYstPuabtOaWsOeVjOmdouOAglxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICAqL1xuICAgICAgICBvbkNoYW5nZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNHb0RhcmspIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBleHBycyA9IHRoaXMuZXhwcnM7XG4gICAgICAgICAgICB2YXIgZXhwck9sZFZhbHVlcyA9IHRoaXMuZXhwck9sZFZhbHVlcztcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IGV4cHJzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgZXhwciA9IGV4cHJzW2ldO1xuICAgICAgICAgICAgICAgIHZhciBleHByVmFsdWUgPSB0aGlzLmV4cHJGbnNbZXhwcl0odGhpcy5zY29wZU1vZGVsKTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRpcnR5Q2hlY2soZXhwciwgZXhwclZhbHVlLCBleHByT2xkVmFsdWVzW2V4cHJdKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdXBkYXRlRm5zID0gdGhpcy51cGRhdGVGbnNbZXhwcl07XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwLCBqbCA9IHVwZGF0ZUZucy5sZW5ndGg7IGogPCBqbDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVGbnNbal0oZXhwclZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGV4cHJPbGRWYWx1ZXNbZXhwcl0gPSBleHByVmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIFBhcnNlci5wcm90b3R5cGUub25DaGFuZ2UuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6IqC54K54oCc5pi+56S64oCd5Ye65p2lXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwdWJsaWNcbiAgICAgICAgICovXG4gICAgICAgIHJlc3RvcmVGcm9tRGFyazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdXRpbHMucmVzdG9yZUZyb21EYXJrKHRoaXMubm9kZSk7XG4gICAgICAgICAgICB0aGlzLmlzR29EYXJrID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICog5Yik5pat6IqC54K55piv5ZCm5piv5bqU6K+l55Sx5b2T5YmN5aSE55CG5Zmo5p2l5aSE55CGXG4gICAgICAgICAqXG4gICAgICAgICAqIEBzdGF0aWNcbiAgICAgICAgICogQHBhcmFtICB7Tm9kZX0gIG5vZGUg6IqC54K5XG4gICAgICAgICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAgICAgICAqL1xuICAgICAgICBpc1Byb3Blck5vZGU6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5ub2RlVHlwZSA9PT0gMSB8fCBub2RlLm5vZGVUeXBlID09PSAzO1xuICAgICAgICB9LFxuXG4gICAgICAgICRuYW1lOiAnRXhwclBhcnNlcidcbiAgICB9XG4pO1xuXG5UcmVlLnJlZ2lzdGVQYXJzZXIobW9kdWxlLmV4cG9ydHMpO1xuXG4vKipcbiAqIOWIm+W7ukRPTeiKgueCueWxnuaAp+abtOaWsOWHveaVsFxuICpcbiAqIEBpbm5lclxuICogQHBhcmFtICB7Tm9kZX0gbm9kZSAgICBET03kuK3nmoToioLngrlcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIOimgeabtOaWsOeahOWxnuaAp+WQjVxuICogQHBhcmFtICB7RG9tVXBkYXRlcn0gZG9tVXBkYXRlciBET03mm7TmlrDlmahcbiAqIEByZXR1cm4ge2Z1bmN0aW9uKE9iamVjdCl9ICAgICAg5pu05paw5Ye95pWwXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUF0dHJVcGRhdGVGbihub2RlLCBuYW1lLCBkb21VcGRhdGVyKSB7XG4gICAgdmFyIHRhc2tJZCA9IGRvbVVwZGF0ZXIuZ2VuZXJhdGVUYXNrSWQoKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGV4cHJWYWx1ZSkge1xuICAgICAgICBkb21VcGRhdGVyLmFkZFRhc2tGbihcbiAgICAgICAgICAgIHRhc2tJZCxcbiAgICAgICAgICAgIHV0aWxzLmJpbmQoZnVuY3Rpb24gKG5vZGUsIG5hbWUsIGV4cHJWYWx1ZSkge1xuICAgICAgICAgICAgICAgIERvbVVwZGF0ZXIuc2V0QXR0cihub2RlLCBuYW1lLCBleHByVmFsdWUpO1xuICAgICAgICAgICAgfSwgbnVsbCwgbm9kZSwgbmFtZSwgZXhwclZhbHVlKVxuICAgICAgICApO1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIGFkZEV4cHIocGFyc2VyLCBleHByLCB1cGRhdGVGbikge1xuICAgIHBhcnNlci5leHBycy5wdXNoKGV4cHIpO1xuICAgIGlmICghcGFyc2VyLmV4cHJGbnNbZXhwcl0pIHtcbiAgICAgICAgcGFyc2VyLmV4cHJGbnNbZXhwcl0gPSBjcmVhdGVFeHByRm4ocGFyc2VyLCBleHByKTtcbiAgICB9XG4gICAgcGFyc2VyLnVwZGF0ZUZuc1tleHByXSA9IHBhcnNlci51cGRhdGVGbnNbZXhwcl0gfHwgW107XG4gICAgcGFyc2VyLnVwZGF0ZUZuc1tleHByXS5wdXNoKHVwZGF0ZUZuKTtcbn1cblxuLyoqXG4gKiDliJvlu7rmoLnmja5zY29wZU1vZGVs6K6h566X6KGo6L6+5byP5YC855qE5Ye95pWwXG4gKlxuICogQGlubmVyXG4gKiBAcGFyYW0gIHtQYXJzZXJ9IHBhcnNlciDop6PmnpDlmajlrp7kvotcbiAqIEBwYXJhbSAge3N0cmluZ30gZXhwciAgIOWQq+acieihqOi+vuW8j+eahOWtl+espuS4slxuICogQHJldHVybiB7ZnVuY3Rpb24oU2NvcGUpOip9XG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUV4cHJGbihwYXJzZXIsIGV4cHIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHNjb3BlTW9kZWwpIHtcbiAgICAgICAgLy8g5q2k5aSE6KaB5YiG5Lik56eN5oOF5Ya177yaXG4gICAgICAgIC8vIDHjgIFleHBy5bm25LiN5piv57qv5q2j55qE6KGo6L6+5byP77yM5aaCYD09JHtuYW1lfT09YOOAglxuICAgICAgICAvLyAy44CBZXhwcuaYr+e6r+ato+eahOihqOi+vuW8j++8jOWmgmAke25hbWV9YOOAglxuICAgICAgICAvLyDlr7nkuo7kuI3nuq/mraPooajovr7lvI/nmoTmg4XlhrXvvIzmraTlpITnmoTov5Tlm57lgLzogq/lrprmmK/lrZfnrKbkuLLvvJtcbiAgICAgICAgLy8g6ICM5a+55LqO57qv5q2j55qE6KGo6L6+5byP77yM5q2k5aSE5bCx5LiN6KaB5bCG5YW26L2s5o2i5oiQ5a2X56ym5Liy5b2i5byP5LqG44CCXG5cbiAgICAgICAgdmFyIHJlZ0V4cCA9IHBhcnNlci5jb25maWcuZ2V0RXhwclJlZ0V4cCgpO1xuXG4gICAgICAgIHZhciBwb3NzaWJsZUV4cHJDb3VudCA9IGV4cHIubWF0Y2gobmV3IFJlZ0V4cCh1dGlscy5yZWdFeHBFbmNvZGUocGFyc2VyLmNvbmZpZy5leHByUHJlZml4KSwgJ2cnKSk7XG4gICAgICAgIHBvc3NpYmxlRXhwckNvdW50ID0gcG9zc2libGVFeHByQ291bnQgPyBwb3NzaWJsZUV4cHJDb3VudC5sZW5ndGggOiAwO1xuXG4gICAgICAgIC8vIOS4jee6r+ato1xuICAgICAgICBpZiAocG9zc2libGVFeHByQ291bnQgIT09IDEgfHwgZXhwci5yZXBsYWNlKHJlZ0V4cCwgJycpKSB7XG4gICAgICAgICAgICByZXR1cm4gZXhwci5yZXBsYWNlKHJlZ0V4cCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHBhcnNlci5leHByQ2FsY3VsYXRlci5jcmVhdGVFeHByRm4oYXJndW1lbnRzWzFdKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VyLmV4cHJDYWxjdWxhdGVyLmNhbGN1bGF0ZShhcmd1bWVudHNbMV0sIGZhbHNlLCBzY29wZU1vZGVsKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g57qv5q2jXG4gICAgICAgIHZhciBwdXJlRXhwciA9IGV4cHIuc2xpY2UocGFyc2VyLmNvbmZpZy5leHByUHJlZml4Lmxlbmd0aCwgLXBhcnNlci5jb25maWcuZXhwclN1ZmZpeC5sZW5ndGgpO1xuICAgICAgICBwYXJzZXIuZXhwckNhbGN1bGF0ZXIuY3JlYXRlRXhwckZuKHB1cmVFeHByKTtcbiAgICAgICAgcmV0dXJuIHBhcnNlci5leHByQ2FsY3VsYXRlci5jYWxjdWxhdGUocHVyZUV4cHIsIGZhbHNlLCBzY29wZU1vZGVsKTtcbiAgICB9O1xufVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL3NyYy9wYXJzZXJzL0V4cHJQYXJzZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAyNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDFcbiAqKi8iLCIvKipcbiAqIEBmaWxlIOWPmOmHj+WumuS5ieaMh+S7pOino+aekOWZqFxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbnZhciBEaXJlY3RpdmVQYXJzZXIgPSByZXF1aXJlKCcuL0RpcmVjdGl2ZVBhcnNlcicpO1xudmFyIFRyZWUgPSByZXF1aXJlKCcuLi90cmVlcy9UcmVlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGlyZWN0aXZlUGFyc2VyLmV4dGVuZHMoXG4gICAge1xuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgRGlyZWN0aXZlUGFyc2VyLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgICAgIHRoaXMubm9kZSA9IG9wdGlvbnMubm9kZTtcbiAgICAgICAgfSxcblxuICAgICAgICBjb2xsZWN0RXhwcnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBleHByID0gdGhpcy5ub2RlLm5vZGVWYWx1ZS5yZXBsYWNlKHRoaXMuY29uZmlnLnZhck5hbWUgKyAnOicsICcnKTtcbiAgICAgICAgICAgIHRoaXMuZXhwckNhbGN1bGF0ZXIuY3JlYXRlRXhwckZuKGV4cHIpO1xuXG4gICAgICAgICAgICB2YXIgbGVmdFZhbHVlTmFtZSA9IGV4cHIubWF0Y2goL1xccyouKyg/PVxcPSkvKVswXS5yZXBsYWNlKC9cXHMrL2csICcnKTtcblxuICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMuZXhwckZuID0gZnVuY3Rpb24gKHNjb3BlTW9kZWwpIHtcbiAgICAgICAgICAgICAgICB2YXIgb2xkVmFsdWUgPSBzY29wZU1vZGVsLmdldChsZWZ0VmFsdWVOYW1lKTtcbiAgICAgICAgICAgICAgICB2YXIgbmV3VmFsdWUgPSBtZS5leHByQ2FsY3VsYXRlci5jYWxjdWxhdGUoZXhwciwgZmFsc2UsIHNjb3BlTW9kZWwpO1xuICAgICAgICAgICAgICAgIGlmIChvbGRWYWx1ZSAhPT0gbmV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGVNb2RlbC5zZXQobGVmdFZhbHVlTmFtZSwgbmV3VmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0U2NvcGU6IGZ1bmN0aW9uIChzY29wZU1vZGVsKSB7XG4gICAgICAgICAgICBEaXJlY3RpdmVQYXJzZXIucHJvdG90eXBlLnNldFNjb3BlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB0aGlzLmV4cHJGbih0aGlzLnNjb3BlTW9kZWwpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5blvIDlp4voioLngrlcbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKiBAaW5oZXJpdERvY1xuICAgICAgICAgKiBAcmV0dXJuIHtOb2RlfVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0U3RhcnROb2RlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ub2RlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5bnu5PmnZ/oioLngrlcbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKiBAaW5oZXJpdERvY1xuICAgICAgICAgKiBAcmV0dXJuIHtOb2RlfVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0RW5kTm9kZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubm9kZTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgICBpc1Byb3Blck5vZGU6IGZ1bmN0aW9uIChub2RlLCBjb25maWcpIHtcbiAgICAgICAgICAgIHJldHVybiBub2RlLm5vZGVUeXBlID09PSA4XG4gICAgICAgICAgICAgICAgJiYgbm9kZS5ub2RlVmFsdWUucmVwbGFjZSgvXlxccysvLCAnJykuaW5kZXhPZihjb25maWcudmFyTmFtZSArICc6JykgPT09IDA7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJG5hbWU6ICdWYXJEaXJlY3RpdmVQYXJzZXInXG4gICAgfVxuKTtcblxuVHJlZS5yZWdpc3RlUGFyc2VyKG1vZHVsZS5leHBvcnRzKTtcblxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL3NyYy9wYXJzZXJzL1ZhckRpcmVjdGl2ZVBhcnNlci5qc1xuICoqIG1vZHVsZSBpZCA9IDI3XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMVxuICoqLyIsIi8qKlxuICogQGZpbGUg57uE5Lu25Z+657G7XG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20pXG4gKi9cblxudmFyIHV0aWxzID0gcmVxdWlyZSgndnRwbC9zcmMvdXRpbHMnKTtcbnZhciBDb21wb25lbnRUcmVlID0gcmVxdWlyZSgnLi9Db21wb25lbnRUcmVlJyk7XG52YXIgQ29tcG9uZW50Q2hpbGRyZW4gPSByZXF1aXJlKCcuL0NvbXBvbmVudENoaWxkcmVuJyk7XG52YXIgQ29tcG9uZW50TWFuYWdlciA9IHJlcXVpcmUoJy4vQ29tcG9uZW50TWFuYWdlcicpO1xudmFyIEJhc2UgPSByZXF1aXJlKCd2dHBsL3NyYy9CYXNlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZS5leHRlbmRzKFxuICAgIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICog57uE5Lu25Yid5aeL5YyWXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqIEBwYXJhbSAge29wdGlvbnN9IG9wdGlvbnMg5Yid5aeL5YyW5Y+C5pWwXG4gICAgICAgICAqIEBwYXJhbSB7Tm9kZX0gb3B0aW9ucy5jb21wb25lbnROb2RlIOe7hOS7tuWcqERPTeagkeS4reeahOWNoOS9jeiKgueCuVxuICAgICAgICAgKiBAcGFyYW0ge1RyZWV9IG9wdGlvbnMudHJlZSDlvZPliY3nu4Tku7bniLbnuqfmoJFcbiAgICAgICAgICogQHBhcmFtIHtFdmVudH0gb3B0aW9ucy5ldmVudCDlpJbpg6jkvKDlhaXnmoTkuovku7blr7nosaHvvIzkuLvopoHnlKjkuo7nu4Tku7blhoXpg6jlj5HnlJ/nmoTkuIDkupvlj5jljJblj6/ku6XpgJrnn6XliLDlpJbpnaJcbiAgICAgICAgICovXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudE5vZGUgPSBvcHRpb25zLmNvbXBvbmVudE5vZGU7XG4gICAgICAgICAgICB0aGlzLnRyZWUgPSBvcHRpb25zLnRyZWU7XG4gICAgICAgICAgICB0aGlzLmV2ZW50ID0gb3B0aW9ucy5ldmVudDtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRDb21wb25lbnRzID0gW107XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0T3V0U2NvcGU6IGZ1bmN0aW9uIChvdXRTY29wZSkge1xuICAgICAgICAgICAgdGhpcy5vdXRTY29wZSA9IG91dFNjb3BlO1xuICAgICAgICB9LFxuXG4gICAgICAgIGJlZm9yZU1vdW50OiBmdW5jdGlvbiAoKSB7fSxcblxuICAgICAgICBhZnRlck1vdW50OiBmdW5jdGlvbiAoKSB7fSxcblxuICAgICAgICBiZWZvcmVEZXN0cm95OiBmdW5jdGlvbiAoKSB7fSxcblxuICAgICAgICBhZnRlckRlc3Ryb3k6IGZ1bmN0aW9uICgpIHt9LFxuXG4gICAgICAgIGxpdGVyYWxBdHRyUmVhZHk6IGZ1bmN0aW9uICgpIHt9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDnu4Tku7bmqKHmnb/jgILlrZDnsbvlj6/ku6Xopobnm5bov5nkuKrlsZ7mgKfjgIJcbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgdHBsOiAnJyxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6K6+572u57uE5Lu25bGe5oCn44CC5YGH5aaC5pyJ5aaC5LiL57uE5Lu277yaXG4gICAgICAgICAqXG4gICAgICAgICAqIDx1aS1teS1jb21wb25lbnQgdGl0bGU9XCIke3RpdGxlfVwiIG5hbWU9XCJBbXlcIj48L3VpLW15LWNvbXBvbmVudD5cbiAgICAgICAgICpcbiAgICAgICAgICog6YKj5LmI5bGe5oCn5bCx5pyJIHRpdGxlIOWSjCBuYW1lIO+8jOWFtuS4rSBuYW1lIOeahOWxnuaAp+WAvOS4jeaYr+S4gOS4quihqOi+vuW8j++8jOaJgOS7peWcqOe7hOS7tuWIm+W7uuWujOaIkOS5i+WQju+8jOWwseS8muiiq+iuvue9ruWlve+8m1xuICAgICAgICAgKiDogIwgdGl0bGUg5bGe5oCn5YC85piv5LiA5Liq6KGo6L6+5byP77yM6ZyA6KaB55uR5ZCsICR7dGl0bGV9IOihqOi+vuW8j+eahOWAvOWPiuWFtuWPmOWMlu+8jOeEtuWQjuWGjeiuvue9rui/m+adpeOAglxuICAgICAgICAgKlxuICAgICAgICAgKiDorr7nva7ov5vmnaXnmoTlgLzkvJrooqvnm7TmjqXmlL7liLDnu4Tku7blr7nlupTnmoQgQ29tcG9uZW50VHJlZSDlrp7kvovnmoQgcm9vdFNjb3BlIOS4iumdouWOu+OAglxuICAgICAgICAgKlxuICAgICAgICAgKiDlr7nkuo5yZWblsZ7mgKfvvIznibnmrorljJbvvIzpnIDopoHnlKjov5nkuKrlsZ7mgKfmnaXmn6Xmib7lrZDnu4Tku7bjgIJcbiAgICAgICAgICpcbiAgICAgICAgICogc2V0QXR0cuWSjHNldERhdGHnmoTljLrliKvlnKjkuo7vvJpcbiAgICAgICAgICogMeOAgXNldEF0dHLlj6/ku6Xorr7nva7kuIDkupvpnZ7luLjnibnmrornmoTlsZ7mgKfvvIzogIzov5nkuKrlsZ7mgKfkuI3pnIDopoHorr7nva7liLBzY29wZeS4reWOu++8jOavlOWmgiQkcmVm77ybXG4gICAgICAgICAqIDLjgIFzZXRBdHRy55So5LqO5qih5p2/6YeM6Z2i57uE5Lu25bGe5oCn55qE6K6+572u77yMc2V0RGF0YeaYr+ebtOaOpeWcqOS7o+eggemHjOmdouiuvue9ruaVsOaNruOAglxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lICDlsZ7mgKflkI1cbiAgICAgICAgICogQHBhcmFtIHsqfSB2YWx1ZSDlsZ7mgKflgLxcbiAgICAgICAgICovXG4gICAgICAgIHNldEF0dHI6IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKG5hbWUgPT09ICdyZWYnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kJHJlZiA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG5hbWUgPT09ICdjbGFzc0xpc3QnKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNsYXNzTGlzdCA9IHRoaXMuZ2V0RGF0YSgnY2xhc3NMaXN0JywgW10pO1xuICAgICAgICAgICAgICAgIGNsYXNzTGlzdC5wdXNoLmFwcGx5KGNsYXNzTGlzdCwgdGhpcy5nZXRDbGFzc0xpc3QodmFsdWUpKTtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGNsYXNzTGlzdDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5zZXREYXRhKG5hbWUsIHZhbHVlKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6L2s5o2i5LiA5LiLa2xhc3NcbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogQHBhcmFtICB7KHN0cmluZ3xBcnJheXxPYmplY3QpfSBrbGFzcyBjc3PnsbtcbiAgICAgICAgICogQHJldHVybiB7QXJyYXkuPHN0cmluZz59IGNzc+exu+aVsOe7hFxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0Q2xhc3NMaXN0OiBmdW5jdGlvbiAoa2xhc3MpIHtcbiAgICAgICAgICAgIGlmICgha2xhc3MpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBrbGFzc2VzID0gW107XG4gICAgICAgICAgICBpZiAodXRpbHMuaXNDbGFzcyhrbGFzcywgJ1N0cmluZycpKSB7XG4gICAgICAgICAgICAgICAga2xhc3NlcyA9IGtsYXNzLnNwbGl0KCcgJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh1dGlscy5pc1B1cmVPYmplY3Qoa2xhc3MpKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgayBpbiBrbGFzcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoa2xhc3Nba10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtsYXNzZXMucHVzaChrbGFzc1trXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh1dGlscy5pc0FycmF5KGtsYXNzKSkge1xuICAgICAgICAgICAgICAgIGtsYXNzZXMgPSBrbGFzcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGtsYXNzZXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOe7meW9k+WJjee7hOS7tuS4i+eahOaguee6p+iKgueCueiuvue9ruaguee6p2Nzc+exu1xuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBrbGFzc2VzIGNzc+exu1xuICAgICAgICAgKi9cbiAgICAgICAgc2V0Q2xhc3NlczogZnVuY3Rpb24gKGtsYXNzZXMpIHtcbiAgICAgICAgICAgIHV0aWxzLnRyYXZlcnNlTm9DaGFuZ2VOb2RlcyhcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0Tm9kZSxcbiAgICAgICAgICAgICAgICB0aGlzLmVuZE5vZGUsXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGN1ck5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1ck5vZGUubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1ck5vZGUuY2xhc3NMaXN0LmFkZC5hcHBseShjdXJOb2RlLmNsYXNzTGlzdCwga2xhc3Nlcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHRoaXNcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOe7hOS7tuaMgui9veWIsCBET00g5qCR5Lit5Y6744CCXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBtb3VudDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5iZWZvcmVNb3VudCgpO1xuXG4gICAgICAgICAgICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBkaXYuaW5uZXJIVE1MID0gdGhpcy50cGw7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0Tm9kZSA9IGRpdi5maXJzdENoaWxkO1xuICAgICAgICAgICAgdGhpcy5lbmROb2RlID0gZGl2Lmxhc3RDaGlsZDtcblxuICAgICAgICAgICAgLy8g57uE5Lu255qE5L2c55So5Z+f5piv5ZKM5aSW6YOo55qE5L2c55So5Z+f6ZqU5byA55qEXG4gICAgICAgICAgICB2YXIgcHJldmlvdXNUcmVlID0gdGhpcy50cmVlO1xuICAgICAgICAgICAgdGhpcy50cmVlID0gbmV3IENvbXBvbmVudFRyZWUoe1xuICAgICAgICAgICAgICAgIHN0YXJ0Tm9kZTogdGhpcy5zdGFydE5vZGUsXG4gICAgICAgICAgICAgICAgZW5kTm9kZTogdGhpcy5lbmROb2RlLFxuICAgICAgICAgICAgICAgIGNvbmZpZzogcHJldmlvdXNUcmVlLmNvbmZpZyxcbiAgICAgICAgICAgICAgICBkb21VcGRhdGVyOiBwcmV2aW91c1RyZWUuZG9tVXBkYXRlcixcbiAgICAgICAgICAgICAgICBleHByQ2FsY3VsYXRlcjogcHJldmlvdXNUcmVlLmV4cHJDYWxjdWxhdGVyLFxuICAgICAgICAgICAgICAgIGNvbXBvbmVudENoaWxkcmVuOiBuZXcgQ29tcG9uZW50Q2hpbGRyZW4oXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50Tm9kZS5maXJzdENoaWxkLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudE5vZGUubGFzdENoaWxkLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm91dFNjb3BlLFxuICAgICAgICAgICAgICAgICAgICB0aGlzXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnRyZWUuc2V0UGFyZW50KHByZXZpb3VzVHJlZSk7XG5cbiAgICAgICAgICAgIHZhciBjdXJDb21wb25lbnRNYW5hZ2VyID0gdGhpcy50cmVlLmdldFRyZWVWYXIoJ2NvbXBvbmVudE1hbmFnZXInLCB0cnVlKTtcbiAgICAgICAgICAgIGN1ckNvbXBvbmVudE1hbmFnZXIuc2V0UGFyZW50KHByZXZpb3VzVHJlZS5nZXRUcmVlVmFyKCdjb21wb25lbnRNYW5hZ2VyJykpO1xuXG4gICAgICAgICAgICB0aGlzLnRyZWUucmVnaXN0ZUNvbXBvbmVudHModGhpcy5jb21wb25lbnRDbGFzc2VzKTtcblxuICAgICAgICAgICAgdGhpcy50cmVlLmNvbXBvbmVudEV2ZW50Lm9uKCduZXdjb21wb25lbnQnLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIC8vIOebkeWQrOWtkOe7hOS7tueahOWIm+W7ulxuICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRDb21wb25lbnRzLnB1c2goZGF0YSk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICAgICAgLy8g5oqK57uE5Lu26IqC54K55pS+5YiwIERPTSDmoJHkuK3ljrtcbiAgICAgICAgICAgIGluc2VydENvbXBvbmVudE5vZGVzKHRoaXMuY29tcG9uZW50Tm9kZSwgdGhpcy5zdGFydE5vZGUsIHRoaXMuZW5kTm9kZSk7XG5cbiAgICAgICAgICAgIHRoaXMudHJlZS50cmF2ZXJzZSgpO1xuXG4gICAgICAgICAgICAvLyDorr7nva7nu4Tku7bnibnmnInnmoTnsbtcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YShcbiAgICAgICAgICAgICAgICAnY2xhc3NMaXN0JyxcbiAgICAgICAgICAgICAgICBDb21wb25lbnRNYW5hZ2VyLmdldENzc0NsYXNzTmFtZSh0aGlzLmNvbnN0cnVjdG9yKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgdGhpcy5hZnRlck1vdW50KCk7XG5cbiAgICAgICAgICAgIC8vIOaKiue7hOS7tuiKgueCueaUvuWIsCBET00g5qCR5Lit5Y67XG4gICAgICAgICAgICBmdW5jdGlvbiBpbnNlcnRDb21wb25lbnROb2Rlcyhjb21wb25lbnROb2RlLCBzdGFydE5vZGUsIGVuZE5vZGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFyZW50Tm9kZSA9IGNvbXBvbmVudE5vZGUucGFyZW50Tm9kZTtcbiAgICAgICAgICAgICAgICB1dGlscy50cmF2ZXJzZU5vZGVzKFxuICAgICAgICAgICAgICAgICAgICBzdGFydE5vZGUsXG4gICAgICAgICAgICAgICAgICAgIGVuZE5vZGUsXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChjdXJOb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnROb2RlLmluc2VydEJlZm9yZShjdXJOb2RlLCBjb21wb25lbnROb2RlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5yZW1vdmVDaGlsZChjb21wb25lbnROb2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog5om+5Yiw56ys5LiA5Liq5ruh6Laz5p2h5Lu255qE5a2Q57uE5Lu2XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICogQHBhcmFtICB7ZnVuY3Rpb24oQ29tcG9uZW50KTpib29sZWFufSBmaWx0ZXJGbiDov4fmu6Tlh73mlbBcbiAgICAgICAgICogQHJldHVybiB7KENvbXBvbmVudHx1bmRlZmluZWQpfSDmu6HotrPmnaHku7bnmoTnu4Tku7bvvIzlpoLmnpzmsqHmnInvvIzliJnov5Tlm551bmRlZmluZWRcbiAgICAgICAgICovXG4gICAgICAgIGZpbmRDb21wb25lbnQ6IGZ1bmN0aW9uIChmaWx0ZXJGbikge1xuICAgICAgICAgICAgaWYgKCF1dGlscy5pc0Z1bmN0aW9uKGZpbHRlckZuKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlsID0gdGhpcy5jaGlsZENvbXBvbmVudHMubGVuZ3RoOyBpIDwgaWw7ICsraSkge1xuICAgICAgICAgICAgICAgIGlmIChmaWx0ZXJGbih0aGlzLmNoaWxkQ29tcG9uZW50c1tpXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRDb21wb25lbnRzW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog5om+5Yiw56ys5omA5pyJ5ruh6Laz5p2h5Lu255qE5a2Q57uE5Lu2XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICogQHBhcmFtICB7ZnVuY3Rpb24oQ29tcG9uZW50KTpib29sZWFufSBmaWx0ZXJGbiDov4fmu6Tlh73mlbBcbiAgICAgICAgICogQHJldHVybiB7QXJyYXkuPENvbXBvbmVudD59IOa7oei2s+adoeS7tueahOaJgOaciee7hOS7tlxuICAgICAgICAgKi9cbiAgICAgICAgZmluZENvbXBvbmVudHM6IGZ1bmN0aW9uIChmaWx0ZXJGbikge1xuICAgICAgICAgICAgaWYgKCF1dGlscy5pc0Z1bmN0aW9uKGZpbHRlckZuKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHJldCA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlsID0gdGhpcy5jaGlsZENvbXBvbmVudHMubGVuZ3RoOyBpIDwgaWw7ICsraSkge1xuICAgICAgICAgICAgICAgIGlmIChmaWx0ZXJGbih0aGlzLmNoaWxkQ29tcG9uZW50c1tpXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0LnB1c2godGhpcy5jaGlsZENvbXBvbmVudHNbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog5qC55o2ucmVm5p+l5om+5a2Q57uE5Lu25oiW6ICF5a2Q6IqC54K544CCXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICogQHBhcmFtICB7c3RyaW5nfSByZWYgcmVm5YC8XG4gICAgICAgICAqIEByZXR1cm4geyhDb21wb25lbnR8Tm9kZSl9IOespuWQiOadoeS7tueahOWtkOe7hOS7tuaIluiKgueCuVxuICAgICAgICAgKi9cbiAgICAgICAgcmVmOiBmdW5jdGlvbiAocmVmKSB7XG4gICAgICAgICAgICB2YXIgcmV0ID0gdGhpcy5maW5kQ29tcG9uZW50KGZ1bmN0aW9uIChjb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29tcG9uZW50LiQkcmVmID09PSByZWY7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8g5LiN5a2Y5Zyo6L+Z5qC355qE5a2Q57uE5Lu277yM6YKj5LmI5bCx6KaB5Y6755yL55yL5piv5ZCm5a2Y5Zyo6L+Z5qC355qE5a2Q6IqC54K5XG4gICAgICAgICAgICBpZiAoIXJldCkge1xuICAgICAgICAgICAgICAgIHJldCA9IHdhbGsuY2FsbCh0aGlzLCB0aGlzLnN0YXJ0Tm9kZSwgdGhpcy5lbmROb2RlLCBmdW5jdGlvbiAoY3VyTm9kZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9IGN1ck5vZGUuZ2V0QXR0cmlidXRlKCdyZWYnKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGF0dHIgJiYgYXR0ciA9PT0gcmVmO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuXG4gICAgICAgICAgICBmdW5jdGlvbiB3YWxrKHN0YXJ0Tm9kZSwgZW5kTm9kZSwgaXRlcmF0ZXJGbikge1xuICAgICAgICAgICAgICAgIGlmICghc3RhcnROb2RlIHx8ICFlbmROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoc3RhcnROb2RlID09PSBlbmROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVyYXRlckZuKHN0YXJ0Tm9kZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGFydE5vZGU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gd2Fsay5jYWxsKHRoaXMsIHN0YXJ0Tm9kZS5maXJzdEVsZW1lbnRDaGlsZCwgc3RhcnROb2RlLmxhc3RFbGVtZW50Q2hpbGQsIGl0ZXJhdGVyRm4pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBjdXJOb2RlID0gc3RhcnROb2RlO1xuXG4gICAgICAgICAgICAgICAgaXRlcmF0ZXI6XG4gICAgICAgICAgICAgICAgd2hpbGUgKGN1ck5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlsID0gdGhpcy5jaGlsZENvbXBvbmVudHMubGVuZ3RoOyBpIDwgaWw7ICsraSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hpbGRDb21wb25lbnRzW2ldLnN0YXJ0Tm9kZSA9PT0gY3VyTm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoaWxkQ29tcG9uZW50c1tpXS5lbmROb2RlID09PSBlbmROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyTm9kZSA9IHRoaXMuY2hpbGRDb21wb25lbnRzW2ldLmVuZE5vZGUubmV4dEVsZW1lbnRTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZXJhdGVyRm4oY3VyTm9kZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjdXJOb2RlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHdhbGsuY2FsbCh0aGlzLCBjdXJOb2RlLmZpcnN0RWxlbWVudENoaWxkLCBjdXJOb2RlLmxhc3RFbGVtZW50Q2hpbGQsIGl0ZXJhdGVyRm4pO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1ck5vZGUgPT09IGVuZE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGN1ck5vZGUgPSBjdXJOb2RlLm5leHRFbGVtZW50U2libGluZztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiuvue9ruaVsOaNruOAglxuICAgICAgICAgKlxuICAgICAgICAgKiBjbGFzc0xpc3TmmK/kuIDkuKrnibnmrorlsZ7mgKfvvIznlKjkuo7orr7nva7nu4Tku7bnmoRjc3PnsbvjgIJcbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ3xPYmplY3R9IG5hbWUg5aaC5p6c5piv5a2X56ym5Liy77yM6YKj5LmI56ys5LqM5Liq5bCx5piv6KaB6K6+572u55qE5YC877ybXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICDlpoLmnpzmmK/lr7nosaHvvIzpgqPkuYjlsLHkuI3nrqHnrKzkuozkuKrvvIzlsLHorqTkuLrov5nkuKrlr7nosaHlsLHmmK/opoHorr7nva7nmoTplK7lgLzlr7njgIJcbiAgICAgICAgICogQHBhcmFtIHsqPX0gdmFsdWUg6KaB6K6+572u55qE5YC8XG4gICAgICAgICAqL1xuICAgICAgICBzZXREYXRhOiBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy50cmVlIHx8ICF0aGlzLnRyZWUucm9vdFNjb3BlKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb21wb25lbnQgaXMgbm90IHJlYWR5Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgc2NvcGUgPSB0aGlzLnRyZWUucm9vdFNjb3BlO1xuICAgICAgICAgICAgc2NvcGUuc2V0LmNhbGwoc2NvcGUsIG5hbWUsIHZhbHVlKTtcblxuICAgICAgICAgICAgaWYgKG5hbWUgPT09ICdjbGFzc0xpc3QnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRDbGFzc2VzKHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6I635Y+W5oyH5a6a6ZSu6Lev5b6E55qE5YC877yM5aaC5p6c5LiN5a2Y5Zyo55qE6K+d77yM5bCx6L+U5Zue6buY6K6k5YC8XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICogQHBhcmFtICB7c3RyaW5nfEFycmF5LjxzdHJpbmc+fSBuYW1lcyDlpoLmnpzmmK/kuIDkuKrlrZfnrKbkuLLvvIzpgqPkuYjlsLHnm7TmjqVTY29wZU1vZGVsI2dldOS6hu+8m1xuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIOWmguaenOaYr+S4gOS4quaVsOe7hO+8jOmCo+S5iOivtOaYjumcgOimgei1sOS4gOS4qumUrueahOi3r+W+hOS6huOAglxuICAgICAgICAgKiBAcGFyYW0gIHsqPX0gZGZ0ICAg5aaC5p6c5rKh5Y+W5Yiw55qE6buY6K6k5YC8XG4gICAgICAgICAqIEByZXR1cm4geyp9ICAgICAgIOi/lOWbnuWPluWIsOeahOWAvFxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0RGF0YTogZnVuY3Rpb24gKG5hbWVzLCBkZnQpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy50cmVlIHx8ICF0aGlzLnRyZWUucm9vdFNjb3BlKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb21wb25lbnQgaXMgbm90IHJlYWR5Jyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBzY29wZSA9IHRoaXMudHJlZS5yb290U2NvcGU7XG4gICAgICAgICAgICBpZiAodXRpbHMuaXNDbGFzcyhuYW1lcywgJ1N0cmluZycpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJldCA9IHNjb3BlLmdldChuYW1lcyk7XG4gICAgICAgICAgICAgICAgcmV0ID09PSB1bmRlZmluZWQgPyBkZnQgOiByZXQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHV0aWxzLmlzQXJyYXkobmFtZXMpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGN1clZhbHVlO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IG5hbWVzLmxlbmd0aDsgaSA8IGlsOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5hbWUgPSBuYW1lc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1clZhbHVlID0gc2NvcGUuZ2V0KG5hbWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VyVmFsdWUgPSBjdXJWYWx1ZVtuYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGZ0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZGZ0O1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDplIDmr4FcbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKi9cbiAgICAgICAgZGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5iZWZvcmVEZXN0cm95KCk7XG5cbiAgICAgICAgICAgIHRoaXMudHJlZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50Tm9kZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLnRyZWUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5vdXRTY29wZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0Tm9kZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmVuZE5vZGUgPSBudWxsO1xuXG4gICAgICAgICAgICB0aGlzLmFmdGVyRGVzdHJveSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDpmpDol4/mqKHmnb9cbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKi9cbiAgICAgICAgZ29EYXJrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB1dGlscy50cmF2ZXJzZU5vQ2hhbmdlTm9kZXMoXG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydE5vZGUsXG4gICAgICAgICAgICAgICAgdGhpcy5lbmROb2RlLFxuICAgICAgICAgICAgICAgIHV0aWxzLmdvRGFyayxcbiAgICAgICAgICAgICAgICB0aGlzXG4gICAgICAgICAgICApO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmmL7npLrmqKHmnb9cbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKi9cbiAgICAgICAgcmVzdG9yZUZyb21EYXJrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB1dGlscy50cmF2ZXJzZU5vQ2hhbmdlTm9kZXMoXG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydE5vZGUsXG4gICAgICAgICAgICAgICAgdGhpcy5lbmROb2RlLFxuICAgICAgICAgICAgICAgIHV0aWxzLnJlc3RvcmVGcm9tRGFyayxcbiAgICAgICAgICAgICAgICB0aGlzXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiOt+WPluagt+W8j+Wtl+espuS4suOAglxuICAgICAgICAgKlxuICAgICAgICAgKiBAc3RhdGljXG4gICAgICAgICAqIEByZXR1cm4ge3N0cmluZ30g5qC35byP5a2X56ym5LiyXG4gICAgICAgICAqL1xuICAgICAgICBnZXRTdHlsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9LFxuXG4gICAgICAgICRuYW1lOiAnQ29tcG9uZW50J1xuICAgIH1cbik7XG5cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdmNvbXBvbmVudC9zcmMvQ29tcG9uZW50LmpzXG4gKiogbW9kdWxlIGlkID0gMjhcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxXG4gKiovIiwiLyoqXG4gKiBAZmlsZSDnu4Tku7bnmoQgPCEtLSBjaGlsZHJlbiAtLT4g5a6e5L6L77yM6K6w5b2V55u45YWz5L+h5oGv77yM5pa55L6/5ZCO57utIENoaWxkcmVuRGlyZWN0aXZlUGFyc2VyIOino+aekFxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJ3Z0cGwvc3JjL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIENvbXBvbmVudENoaWxkcmVuKHN0YXJ0Tm9kZSwgZW5kTm9kZSwgc2NvcGUsIGNvbXBvbmVudCkge1xuICAgIHRoaXMuZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaWYgKCFzdGFydE5vZGUgfHwgIWVuZE5vZGUpIHtcbiAgICAgICAgdGhpcy5kaXYuaW5uZXJIVE1MID0gJyc7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB1dGlscy50cmF2ZXJzZU5vZGVzKFxuICAgICAgICAgICAgc3RhcnROb2RlLFxuICAgICAgICAgICAgZW5kTm9kZSxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChjdXJOb2RlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kaXYuYXBwZW5kQ2hpbGQoY3VyTm9kZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGhpc1xuICAgICAgICApO1xuICAgIH1cblxuICAgIHRoaXMuc2NvcGUgPSBzY29wZTtcbiAgICB0aGlzLmNvbXBvbmVudCA9IGNvbXBvbmVudDtcbn1cblxuQ29tcG9uZW50Q2hpbGRyZW4ucHJvdG90eXBlLmdldFRwbEh0bWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGl2LmlubmVySFRNTDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ29tcG9uZW50Q2hpbGRyZW47XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Zjb21wb25lbnQvc3JjL0NvbXBvbmVudENoaWxkcmVuLmpzXG4gKiogbW9kdWxlIGlkID0gMjlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxidXR0b24gY2xhc3M9XFxcIiR7Y2xhc3NMaXN0fVxcXCIgZXZlbnQtY2xpY2s9XFxcIiR7b25DbGljayhldmVudCl9XFxcIj5cXG4gICAgPCEtLSBjaGlsZHJlbiAtLT5cXG48L2J1dHRvbj5cIjtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL0J1dHRvbi9idXR0b24udHBsLmh0bWxcbiAqKiBtb2R1bGUgaWQgPSAzMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDFcbiAqKi8iLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikoKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIi5idXR0b24sXFxuLmJ1dHRvbjphY3RpdmUge1xcbiAgYmFja2dyb3VuZDogI2Y2ZjZmNjtcXG4gIGhlaWdodDogMzBweDtcXG4gIG91dGxpbmU6IG5vbmU7XFxuICBib3JkZXI6IG5vbmU7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcbi5idXR0b246aG92ZXIge1xcbiAgb3BhY2l0eTogLjg7XFxufVxcbi5idXR0b246YWN0aXZlIHtcXG4gIG9wYWNpdHk6IDE7XFxufVxcbi5idXR0b24uc2tpbi1wcmltYXJ5IHtcXG4gIGJhY2tncm91bmQ6ICM3MGNjYzA7XFxuICBjb2xvcjogI2ZmZjtcXG59XFxuLmJ1dHRvbi5za2luLXN1Y2Nlc3Mge1xcbiAgYmFja2dyb3VuZDogIzgwZGRhMTtcXG4gIGNvbG9yOiAjZmZmO1xcbn1cXG4uYnV0dG9uLnNraW4taW5mbyB7XFxuICBiYWNrZ3JvdW5kOiAjNmJkNWVjO1xcbiAgY29sb3I6ICNmZmY7XFxufVxcbi5idXR0b24uc2tpbi13YXJuaW5nIHtcXG4gIGJhY2tncm91bmQ6ICNmOWFkNDI7XFxuICBjb2xvcjogI2ZmZjtcXG59XFxuLmJ1dHRvbi5za2luLWRhbmdlciB7XFxuICBiYWNrZ3JvdW5kOiAjZjE2YzZjO1xcbiAgY29sb3I6ICNmZmY7XFxufVxcbi5idXR0b24uc2tpbi1saW5rIHtcXG4gIGNvbG9yOiAjNzBjY2MwO1xcbiAgYmFja2dyb3VuZDogbm9uZTtcXG59XFxuXCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9CdXR0b24vYnV0dG9uLmxlc3NcbiAqKiBtb2R1bGUgaWQgPSAzMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDFcbiAqKi8iLCIvKlxyXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXHJcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxyXG4qL1xyXG4vLyBjc3MgYmFzZSBjb2RlLCBpbmplY3RlZCBieSB0aGUgY3NzLWxvYWRlclxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciBsaXN0ID0gW107XHJcblxyXG5cdC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcclxuXHRsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XHJcblx0XHR2YXIgcmVzdWx0ID0gW107XHJcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgaXRlbSA9IHRoaXNbaV07XHJcblx0XHRcdGlmKGl0ZW1bMl0pIHtcclxuXHRcdFx0XHRyZXN1bHQucHVzaChcIkBtZWRpYSBcIiArIGl0ZW1bMl0gKyBcIntcIiArIGl0ZW1bMV0gKyBcIn1cIik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmVzdWx0LnB1c2goaXRlbVsxXSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiByZXN1bHQuam9pbihcIlwiKTtcclxuXHR9O1xyXG5cclxuXHQvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxyXG5cdGxpc3QuaSA9IGZ1bmN0aW9uKG1vZHVsZXMsIG1lZGlhUXVlcnkpIHtcclxuXHRcdGlmKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKVxyXG5cdFx0XHRtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCBcIlwiXV07XHJcblx0XHR2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xyXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGlkID0gdGhpc1tpXVswXTtcclxuXHRcdFx0aWYodHlwZW9mIGlkID09PSBcIm51bWJlclwiKVxyXG5cdFx0XHRcdGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGZvcihpID0gMDsgaSA8IG1vZHVsZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGl0ZW0gPSBtb2R1bGVzW2ldO1xyXG5cdFx0XHQvLyBza2lwIGFscmVhZHkgaW1wb3J0ZWQgbW9kdWxlXHJcblx0XHRcdC8vIHRoaXMgaW1wbGVtZW50YXRpb24gaXMgbm90IDEwMCUgcGVyZmVjdCBmb3Igd2VpcmQgbWVkaWEgcXVlcnkgY29tYmluYXRpb25zXHJcblx0XHRcdC8vICB3aGVuIGEgbW9kdWxlIGlzIGltcG9ydGVkIG11bHRpcGxlIHRpbWVzIHdpdGggZGlmZmVyZW50IG1lZGlhIHF1ZXJpZXMuXHJcblx0XHRcdC8vICBJIGhvcGUgdGhpcyB3aWxsIG5ldmVyIG9jY3VyIChIZXkgdGhpcyB3YXkgd2UgaGF2ZSBzbWFsbGVyIGJ1bmRsZXMpXHJcblx0XHRcdGlmKHR5cGVvZiBpdGVtWzBdICE9PSBcIm51bWJlclwiIHx8ICFhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XHJcblx0XHRcdFx0aWYobWVkaWFRdWVyeSAmJiAhaXRlbVsyXSkge1xyXG5cdFx0XHRcdFx0aXRlbVsyXSA9IG1lZGlhUXVlcnk7XHJcblx0XHRcdFx0fSBlbHNlIGlmKG1lZGlhUXVlcnkpIHtcclxuXHRcdFx0XHRcdGl0ZW1bMl0gPSBcIihcIiArIGl0ZW1bMl0gKyBcIikgYW5kIChcIiArIG1lZGlhUXVlcnkgKyBcIilcIjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bGlzdC5wdXNoKGl0ZW0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fTtcclxuXHRyZXR1cm4gbGlzdDtcclxufTtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcbiAqKiBtb2R1bGUgaWQgPSAzMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDFcbiAqKi8iLCIvKipcbiAqIEBmaWxlIGNoaWxkcmVuIOaMh+S7pCA8IS0tIGNoaWxkcmVuIC0tPiDvvIzlj6rmnInnu4Tku7bkuK3miY3kvJrlrZjlnKjor6XmjIfku6RcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG52YXIgRGlyZWN0aXZlUGFyc2VyID0gcmVxdWlyZSgndnRwbC9zcmMvcGFyc2Vycy9EaXJlY3RpdmVQYXJzZXInKTtcbnZhciBDaGlsZHJlblRyZWUgPSByZXF1aXJlKCcuL0NoaWxkcmVuVHJlZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERpcmVjdGl2ZVBhcnNlci5leHRlbmRzKFxuICAgIHtcbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIERpcmVjdGl2ZVBhcnNlci5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgICAgICAgICB0aGlzLm5vZGUgPSBvcHRpb25zLm5vZGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY29sbGVjdEV4cHJzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgY29tcG9uZW50Q2hpbGRyZW4gPSB0aGlzLnRyZWUuZ2V0VHJlZVZhcignY29tcG9uZW50Q2hpbGRyZW4nLCB0cnVlKTtcbiAgICAgICAgICAgIGlmICghY29tcG9uZW50Q2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGRpdi5pbm5lckhUTUwgPSBjb21wb25lbnRDaGlsZHJlbi5nZXRUcGxIdG1sKCk7XG5cbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5UcmVlID0gbmV3IENoaWxkcmVuVHJlZSh7XG4gICAgICAgICAgICAgICAgc3RhcnROb2RlOiBkaXYuZmlyc3RDaGlsZCxcbiAgICAgICAgICAgICAgICBlbmROb2RlOiBkaXYubGFzdENoaWxkLFxuICAgICAgICAgICAgICAgIGNvbmZpZzogdGhpcy50cmVlLmNvbmZpZyxcbiAgICAgICAgICAgICAgICBkb21VcGRhdGVyOiB0aGlzLnRyZWUuZG9tVXBkYXRlcixcbiAgICAgICAgICAgICAgICBleHByQ2FsY3VsYXRlcjogdGhpcy50cmVlLmV4cHJDYWxjdWxhdGVyXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5UcmVlLnNldFBhcmVudCh0aGlzLnRyZWUpO1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlblRyZWUudHJhdmVyc2UoKTtcblxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlblRyZWUucm9vdFNjb3BlLnNldFBhcmVudChjb21wb25lbnRDaGlsZHJlbi5zY29wZSk7XG4gICAgICAgICAgICBjb21wb25lbnRDaGlsZHJlbi5zY29wZS5hZGRDaGlsZCh0aGlzLmNoaWxkcmVuVHJlZS5yb290U2NvcGUpO1xuXG4gICAgICAgICAgICB3aGlsZSAoZGl2LmNoaWxkTm9kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGRpdi5jaGlsZE5vZGVzWzBdLCB0aGlzLm5vZGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6I635Y+W5byA5aeL6IqC54K5XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICogQGluaGVyaXREb2NcbiAgICAgICAgICogQHJldHVybiB7Tm9kZX1cbiAgICAgICAgICovXG4gICAgICAgIGdldFN0YXJ0Tm9kZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmNoaWxkcmVuVHJlZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm5vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlblRyZWUuc3RhcnROb2RlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5bnu5PmnZ/oioLngrlcbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKiBAaW5oZXJpdERvY1xuICAgICAgICAgKiBAcmV0dXJuIHtOb2RlfVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0RW5kTm9kZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubm9kZTtcbiAgICAgICAgfSxcblxuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuVHJlZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgIHRoaXMubm9kZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuVHJlZSA9IG51bGw7XG5cbiAgICAgICAgICAgIERpcmVjdGl2ZVBhcnNlci5wcm90b3R5cGUuZGVzdHJveS5hcHBseSh0aGlzKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgICBpc1Byb3Blck5vZGU6IGZ1bmN0aW9uIChub2RlLCBjb25maWcpIHtcbiAgICAgICAgICAgIHJldHVybiBub2RlLm5vZGVUeXBlID09PSA4XG4gICAgICAgICAgICAgICAgJiYgbm9kZS5ub2RlVmFsdWUucmVwbGFjZSgvXFxzL2csICcnKSA9PT0gJ2NoaWxkcmVuJztcbiAgICAgICAgfSxcblxuICAgICAgICAkbmFtZTogJ0NoaWxkcmVuRGlyZWN0aXZlUGFyc2VyJ1xuICAgIH1cbik7XG5cbkNoaWxkcmVuVHJlZS5yZWdpc3RlUGFyc2VyKG1vZHVsZS5leHBvcnRzKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdmNvbXBvbmVudC9zcmMvQ2hpbGRyZW5EaXJlY3RpdmVQYXJzZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAzNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDFcbiAqKi8iLCIvKipcbiAqIEBmaWxlIOWtkOagkVxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbnZhciBUcmVlID0gcmVxdWlyZSgndnRwbC9zcmMvdHJlZXMvVHJlZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRyZWUuZXh0ZW5kcyhcbiAgICB7XG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgICBpZiAoIW9wdGlvbnMuY29uZmlnXG4gICAgICAgICAgICAgICAgfHwgIW9wdGlvbnMuZG9tVXBkYXRlclxuICAgICAgICAgICAgICAgIHx8ICFvcHRpb25zLmV4cHJDYWxjdWxhdGVyXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3dyb25nIGFyZ3VtZW50cycpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBvcHRpb25zLmNvbXBvbmVudENoaWxkcmVuID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgZGVsZXRlIG9wdGlvbnMuY29tcG9uZW50Q2hpbGRyZW47XG5cbiAgICAgICAgICAgIFRyZWUucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgICAkbmFtZTogJ0NoaWxkcmVuVHJlZSdcbiAgICB9XG4pO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92Y29tcG9uZW50L3NyYy9DaGlsZHJlblRyZWUuanNcbiAqKiBtb2R1bGUgaWQgPSAzNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDFcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IFwiPHVpLWJ1dHRvbiBvbi1jbGljaz1cXFwiJHtjbGlja31cXFwiPkJ1dHRvbjwvdWktYnV0dG9uPlxcbjx1aS1idXR0b24gY2xhc3MtbGlzdD1cXFwic2tpbi1wcmltYXJ5XFxcIj5QcmltYXJ5PC91aS1idXR0b24+XFxuPHVpLWJ1dHRvbiBjbGFzcy1saXN0PVxcXCJza2luLXN1Y2Nlc3NcXFwiPlN1Y2Nlc3M8L3VpLWJ1dHRvbj5cXG48dWktYnV0dG9uIGNsYXNzLWxpc3Q9XFxcInNraW4taW5mb1xcXCI+SW5mbzwvdWktYnV0dG9uPlxcbjx1aS1idXR0b24gY2xhc3MtbGlzdD1cXFwic2tpbi13YXJuaW5nXFxcIj5XYXJuaW5nPC91aS1idXR0b24+XFxuPHVpLWJ1dHRvbiBjbGFzcy1saXN0PVxcXCJza2luLWRhbmdlclxcXCI+RGFuZ2VyPC91aS1idXR0b24+XFxuPHVpLWJ1dHRvbiBjbGFzcy1saXN0PVxcXCJza2luLWxpbmtcXFwiPkxpbms8L3VpLWJ1dHRvbj5cXG5cIjtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vdGVzdC9idXR0b24udHBsLmh0bWxcbiAqKiBtb2R1bGUgaWQgPSAzNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==