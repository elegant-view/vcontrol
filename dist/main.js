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

	__webpack_require__(2);


/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file 按钮控件
	 * @author yibuyisheng(yibuyisheng@163.com, https://github.com/yibuyisheng)
	 */
	
	var Control = __webpack_require__(3);
	
	module.exports = Control.extends(
	    {
	        tpl: __webpack_require__(35)
	    },
	    {
	        $name: 'Button',
	
	        getStyle: function () {
	            return __webpack_require__(36)[0][1];
	        }
	    }
	);


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var vcomponent = __webpack_require__(4);
	
	module.exports = vcomponent.Component.extends({}, {$name: 'Control'});


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(5);
	__webpack_require__(18);
	__webpack_require__(21);
	__webpack_require__(23);
	
	var ComponentTree = __webpack_require__(26);
	var domDataBind = __webpack_require__(29);
	
	module.exports = {
	    Component: __webpack_require__(34),
	    mount: function (options, ComponentClasses) {
	        var tree = new ComponentTree(options);
	        tree.registeComponents(ComponentClasses);
	        tree.traverse();
	        return tree;
	    },
	    Config: domDataBind.Config
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file children 指令 <!-- children --> ，只有组件中才会存在该指令
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */
	
	var DirectiveParser = __webpack_require__(6);
	var ChildrenTree = __webpack_require__(11);
	
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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file 指令解析器抽象类。指令节点一定是注释节点
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */
	
	var Parser = __webpack_require__(7);
	
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
/* 7 */
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
	
	var Base = __webpack_require__(8);
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
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file 所有类的基类
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */
	
	var inherit = __webpack_require__(9);
	var utils = __webpack_require__(10);
	
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
/* 9 */
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
/* 10 */
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
	
	exports.distinctArr = function (arr, hashFn) {
	    hashFn = exports.isFunction(hashFn) ? hashFn : function (elem) {
	        return String(elem);
	    };
	    var obj = {};
	    for (var i = 0, il = arr.length; i < il; ++i) {
	        obj[hashFn(arr[i])] = arr[i];
	    }
	
	    var ret = [];
	    for (var key in obj) {
	        if (!obj.hasOwnProperty(key)) {
	            continue;
	        }
	
	        ret.push(obj[key]);
	    }
	
	    return ret;
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
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file 子树
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */
	
	var Tree = __webpack_require__(12);
	
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
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file 最终的树
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */
	
	var utils = __webpack_require__(10);
	var ExprCalculater = __webpack_require__(13);
	var DomUpdater = __webpack_require__(14);
	var ScopeModel = __webpack_require__(16);
	var Base = __webpack_require__(8);
	
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
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var utils = __webpack_require__(10);
	
	function ExprCalculater() {
	    this.fns = {};
	
	    this.exprNameMap = {};
	    this.exprNameRegExp = /\.?\$?([a-z|A-Z]+|([a-z|A-Z]+[0-9]+[a-z|A-Z]*))/g;
	}
	
	ExprCalculater.prototype.createExprFn = function (expr, avoidReturn) {
	    if (expr === 'klass') {
	        throw new Error('`klass` is the preserved word for `class`');
	    }
	    // 对expr='class'进行下转换
	    if (expr === 'class') {
	        expr = 'klass';
	    }
	
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
	    // 对expr='class'进行下转换
	    if (expr === 'class') {
	        expr = 'klass';
	    }
	
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
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file DOM 更新器
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */
	
	var utils = __webpack_require__(10);
	var log = __webpack_require__(15);
	
	var eventList = ('blur focus focusin focusout load resize scroll unload click dblclick '
	    + 'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave '
	    + 'change select submit keydown keypress keyup error contextmenu').split(' ');
	
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
	
	    if (DomUpdater.isEventName(name)) {
	        return DomUpdater.setEvent(node, name, value);
	    }
	
	    // 外部点击事件
	    if (name === 'onoutclick') {
	        return DomUpdater.setOutClick(node, value);
	    }
	
	    node.setAttribute(name, value);
	};
	
	DomUpdater.setOutClick = function (node, callback) {
	    if (!utils.isFunction(callback)) {
	        return;
	    }
	    window.addEventListener('click', function (event) {
	        event = event || window.event;
	
	        if (node !== event.target && !node.contains(event.target)) {
	            callback(event);
	        }
	    });
	};
	
	DomUpdater.setEvent = function (node, name, value) {
	    if (utils.isFunction(value)) {
	        node[name] = function (event) {
	            event = event || window.event;
	            value(event);
	        };
	    }
	    else {
	        node[name] = null;
	    }
	};
	
	DomUpdater.setClass = function (node, klass) {
	    if (!klass) {
	        return;
	    }
	
	    node.className = DomUpdater.getClassList(klass).join(' ');
	};
	
	DomUpdater.setStyle = function (node, styleObj) {
	    for (var k in styleObj) {
	        node.style[k] = styleObj[k];
	    }
	};
	
	/**
	 * 获取元素节点的属性值
	 *
	 * @static
	 * @param {Node} node dom节点
	 * @param {string} name 属性名
	 * @return {*} 属性值
	 */
	DomUpdater.getAttr = function (node, name) {
	    if (name === 'class') {
	        return DomUpdater.getClassList(node.className);
	    }
	    return node.getAttribute(node);
	};
	
	DomUpdater.getClassList = function (klass) {
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
	
	    return utils.distinctArr(klasses);
	};
	
	DomUpdater.isEventName = function (str) {
	    if (str.indexOf('on') !== 0) {
	        return;
	    }
	    str = str.slice(2);
	    for (var i = 0, il = eventList.length; i < il; ++i) {
	        if (str === eventList[i]) {
	            return true;
	        }
	    }
	
	    return false;
	};
	
	module.exports = DomUpdater;


/***/ },
/* 15 */
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
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var utils = __webpack_require__(10);
	var Event = __webpack_require__(17);
	var inherit = __webpack_require__(9);
	
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
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var utils = __webpack_require__(10);
	
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
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file 增强for指令
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */
	
	var ForDirectiveParser = __webpack_require__(19);
	var ForTree = __webpack_require__(20);
	
	module.exports = ForDirectiveParser.extends(
	    {
	        setCssClass: function (classList) {
	            this.$$classList = classList;
	            for (var i = 0, il = this.trees.length; i < il; ++i) {
	                var tree = this.trees[i];
	                setClasses(tree, classList);
	            }
	        },
	
	        createTree: function () {
	            var tree = ForDirectiveParser.prototype.createTree.apply(this, arguments);
	            setClasses(tree, this.$$classList);
	            return tree;
	        },
	
	        setAttr: function (name, value) {
	            if (name === 'class') {
	                this.setCssClass(value);
	            }
	        }
	    },
	    {
	        $name: 'ForDirectiveParser'
	    }
	);
	
	function setClasses(tree, classList) {
	    for (var j = 0, jl = tree.tree.length; j < jl; ++j) {
	        tree.tree[j].parser.setAttr('class', classList);
	    }
	}
	
	ForTree.registeParser(module.exports);


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file for 指令
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */
	
	var DirectiveParser = __webpack_require__(6);
	var utils = __webpack_require__(10);
	var ForTree = __webpack_require__(20);
	
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
	        },
	
	        createTree: function (config) {
	            var parser = this;
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
	                trees[index] = parser.createTree(config);
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


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file for指令中用到的
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */
	
	var Tree = __webpack_require__(12);
	
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
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file 增强一下vtpl中的if指令
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */
	
	var IfDirectiveParser = __webpack_require__(22);
	var Tree = __webpack_require__(12);
	
	module.exports = IfDirectiveParser.extends(
	    {
	
	        /**
	         * 给if指令所管理的所有节点设置css类
	         *
	         * @public
	         * @param {Array.<string>} classList css类数组
	         */
	        setCssClass: function (classList) {
	            for (var i = 0, il = this.branches.length; i < il; ++i) {
	                var branch = this.branches[i];
	                for (var j = 0, jl = branch.length; j > jl; ++j) {
	                    branch.setCssClass(classList);
	                }
	            }
	        },
	
	        setAttr: function (name, value) {
	            if (name === 'class') {
	                this.setCssClass(value);
	            }
	        }
	    },
	    {
	        $name: 'IfDirectiveParser'
	    }
	);
	
	Tree.registeParser(module.exports);


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file if 指令
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */
	
	var DirectiveParser = __webpack_require__(6);
	var utils = __webpack_require__(10);
	var Tree = __webpack_require__(12);
	
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
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file 组件解析器
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */
	
	var EventExprParser = __webpack_require__(24);
	var Tree = __webpack_require__(12);
	var utils = __webpack_require__(10);
	var ComponentTree = __webpack_require__(26);
	var ComponentChildren = __webpack_require__(28);
	var ComponentManager = __webpack_require__(27);
	var DomUpdater = __webpack_require__(14);
	
	module.exports = EventExprParser.extends(
	    {
	
	        initialize: function (options) {
	            EventExprParser.prototype.initialize.apply(this, arguments);
	            this.componentManager = this.tree.getTreeVar('componentManager');
	            this.isComponent = this.node.nodeType === 1
	                && this.node.tagName.toLowerCase().indexOf('ui-') === 0;
	
	            if (this.isComponent) {
	                var componentName = utils.line2camel(this.node.tagName.toLowerCase().replace('ui', ''));
	
	                var ComponentClass = this.componentManager.getClass(componentName);
	                if (!ComponentClass) {
	                    throw new Error('the component `' + componentName + '` is not registed!');
	                }
	                // 组件本身就应该有的css类名
	                this.componentOriginCssClassList = ComponentManager.getCssClassName(ComponentClass);
	
	                this.component = new ComponentClass();
	                this.component.parser = this;
	
	                this.mount(options.tree);
	            }
	        },
	
	        collectExprs: function () {
	            if (this.isComponent) {
	                this.collectComponentExprs();
	            }
	            else {
	                EventExprParser.prototype.collectExprs.apply(this, arguments);
	            }
	        },
	
	        mount: function (parentTree) {
	            this.component.componentWillMount();
	
	            var div = document.createElement('div');
	            div.innerHTML = this.component.tpl;
	            var startNode = div.firstChild;
	            var endNode = div.lastChild;
	
	            this.startNode = startNode;
	            this.endNode = endNode;
	
	            // 组件的作用域是和外部的作用域隔开的
	            this.tree = new ComponentTree({
	                startNode: startNode,
	                endNode: endNode,
	                config: parentTree.config,
	                domUpdater: parentTree.domUpdater,
	                exprCalculater: parentTree.exprCalculater,
	
	                // componentChildren不能传给子级组件树，可以传给子级for树。
	                componentChildren: new ComponentChildren(
	                    this.node.firstChild,
	                    this.node.lastChild,
	                    parentTree.rootScope
	                )
	            });
	
	            this.tree.setParent(parentTree);
	
	            this.tree.registeComponents(this.component.componentClasses);
	
	            insertComponentNodes(this.node, startNode, endNode);
	
	            this.tree.traverse();
	
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
	         * 设置当前节点或者组件的属性
	         *
	         * @public
	         * @param {string} name 属性名
	         * @param {*} value 属性值
	         */
	        setAttr: function (name, value) {
	            if (name === 'ref') {
	                this.$$ref = value;
	                return;
	            }
	
	            if (this.isComponent) {
	                if (name === 'class') {
	                    value = this.componentOriginCssClassList.concat(DomUpdater.getClassList(value));
	
	                    for (var i = 0, il = this.tree.tree.length; i < il; ++i) {
	                        var parserObj = this.tree.tree[i];
	                        parserObj.parser.setAttr && parserObj.parser.setAttr('class', DomUpdater.getClassList(value));
	                    }
	                }
	
	                var scope = this.tree.rootScope;
	                scope.set(name, value);
	            }
	            else {
	                EventExprParser.prototype.setAttr.apply(this, arguments);
	            }
	        },
	
	        /**
	         * 获取属性
	         *
	         * @public
	         * @param  {string} name 属性名
	         * @return {*}      属性值
	         */
	        getAttr: function (name) {
	            if (this.isComponent) {
	                return this.tree.rootScope.get(name);
	            }
	
	            return EventExprParser.prototype.getAttr(this, arguments);
	        },
	
	        collectComponentExprs: function () {
	            var curNode = this.node;
	
	            var attributes = curNode.attributes;
	            // 搜集不含有表达式的属性，然后在组件类创建好之后设置进组件
	            this.setLiteralAttrsFns = [];
	
	            // 是否存在css类名的设置函数
	            var hasClass = false;
	            for (var i = 0, il = attributes.length; i < il; i++) {
	                var attr = attributes[i];
	                hasClass = attr.nodeName === 'class-list';
	
	                var expr = attr.nodeValue;
	                if (this.config.getExprRegExp().test(expr)) {
	                    this.exprs.push(expr);
	                    if (!this.exprFns[expr]) {
	                        var rawExpr = getRawExpr(expr, this.config);
	                        this.exprCalculater.createExprFn(rawExpr);
	                        this.exprFns[expr] = utils.bind(calculateExpr, null, rawExpr, this.exprCalculater);
	
	                        this.updateFns[expr] = this.updateFns[expr] || [];
	                        this.updateFns[expr].push(utils.bind(setAttrFn, this, attr.nodeName));
	                    }
	                }
	                else {
	                    this.setLiteralAttrsFns.push(
	                        utils.bind(setAttrFn, this, attr.nodeName, attr.nodeValue, true)
	                    );
	                }
	            }
	
	            if (!hasClass) {
	                this.setLiteralAttrsFns.push(
	                    utils.bind(setAttrFn, this, 'class', [])
	                );
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
	             * @param {boolean} isLiteral 是否是常量属性
	             * @param {Component} component 组件
	             */
	            function setAttrFn(name, value, isLiteral) {
	                name = utils.line2camel(name);
	                if (name === 'class') {
	                    value = this.componentOriginCssClassList.concat(DomUpdater.getClassList(value));
	                    if (isLiteral) {
	                        this.componentOriginCssClassList = value;
	                    }
	                }
	                this.setAttr(name, value);
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
	            if (this.isComponent) {
	                return this.startNode;
	            }
	
	            return EventExprParser.prototype.getStartNode.call(this);
	        },
	
	        /**
	         * 获取结束节点
	         *
	         * @protected
	         * @inheritDoc
	         * @return {Node}
	         */
	        getEndNode: function () {
	            if (this.isComponent) {
	                return this.endNode;
	            }
	
	            return EventExprParser.prototype.getEndNode.call(this);
	        },
	
	        setScope: function () {
	            this.scopeModel = this.tree.rootScope;
	            EventExprParser.prototype.setScope.apply(this, arguments);
	
	            if (this.isComponent) {
	                for (var i = 0, il = this.setLiteralAttrsFns.length; i < il; i++) {
	                    this.setLiteralAttrsFns[i](this.component);
	                }
	
	                this.component.componentDidMount();
	            }
	        },
	
	        getScope: function () {
	            return this.tree.rootScope;
	        },
	
	        // scopeModel里面的值发生了变化
	        onChange: function () {
	            if (this.isGoDark) {
	                return;
	            }
	
	            if (this.isComponent) {
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
	            }
	            else {
	                EventExprParser.prototype.onChange.apply(this, arguments);
	            }
	        },
	
	        goDark: function () {
	            this.components && this.component.goDark();
	            EventExprParser.prototype.goDark.apply(this, arguments);
	        },
	
	        restoreFromDark: function () {
	            this.components && this.component.restoreFromDark();
	            EventExprParser.prototype.restoreFromDark.apply(this, arguments);
	        },
	
	        ref: function (ref) {
	            var parserTree = this.tree.tree;
	
	            var ret;
	            this.walk(parserTree, function (parser) {
	                if (parser.isComponent && parser.$$ref === ref) {
	                    ret = parser.component;
	                    return true;
	                }
	            });
	            return ret;
	        },
	
	        destroy: function () {
	            this.component.componentWillUnmount();
	            this.component.destroy();
	            EventExprParser.prototype.destroy.apply(this, arguments);
	        },
	
	        /**
	         * 遍历parserTree
	         *
	         * @private
	         * @param  {Tree} parserTree 树
	         * @param  {function(Parser):boolean} iteraterFn 迭代函数
	         * @return {boolean}
	         */
	        walk: function (parserTree, iteraterFn) {
	            for (var i = 0, il = parserTree.length; i < il; ++i) {
	                var parserObj = parserTree[i];
	
	                // 针对if指令的情况
	                if (utils.isArray(parserObj)) {
	                    if (this.walk(parserObj, iteraterFn)) {
	                        return true;
	                    }
	                    continue;
	                }
	
	                // 针对for指令的情况
	                if (utils.isArray(parserObj.trees)) {
	                    for (var j = 0, jl = parserObj.trees.length; j < jl; ++j) {
	                        if (this.walk(parserObj.trees[j].tree, iteraterFn)) {
	                            return true;
	                        }
	                    }
	                    continue;
	                }
	
	                if (iteraterFn(parserObj.parser)) {
	                    return true;
	                }
	
	                if (parserObj.children && parserObj.children.length) {
	                    if (this.walk(parserObj.children, iteraterFn)) {
	                        return true;
	                    }
	                }
	            }
	        }
	    },
	    {
	        $name: 'ComponentParser'
	    }
	);
	
	Tree.registeParser(module.exports);


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file 处理了事件的 ExprParser
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */
	
	var ExprParser = __webpack_require__(25);
	var utils = __webpack_require__(10);
	var Tree = __webpack_require__(12);
	var ScopeModel = __webpack_require__(16);
	var DomUpdater = __webpack_require__(14);
	
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
	            if (!eventName && DomUpdater.isEventName(attr.name)) {
	                eventName = attr.name.replace('on', '');
	            }
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
	
	                    DomUpdater.setAttr(this.node, 'on' + eventName, function (event) {
	                        var localScope = new ScopeModel();
	                        localScope.set('event', event);
	                        localScope.setParent(me.getScope());
	                        me.exprCalculater.calculate(expr, true, localScope);
	                    });
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
	                DomUpdater.setAttr(this.node, 'on' + eventName);
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
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file 表达式解析器，一个文本节点或者元素节点对应一个表达式解析器实例
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */
	
	var Parser = __webpack_require__(7);
	var utils = __webpack_require__(10);
	var Tree = __webpack_require__(12);
	var DomUpdater = __webpack_require__(14);
	
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
	
	            /**
	             * DOM节点属性与更新属性的任务id的映射
	             * @type {Object}
	             */
	            this.attrToDomTaskIdMap = {};
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
	                attr
	                    ? createAttrUpdateFn(this.getTaskId(attr.name), this.node, attr.name, this.domUpdater)
	                    : (function (me, curNode) {
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
	        },
	
	        /**
	         * 根据DOM节点的属性名字拿到一个任务id。
	         *
	         * @protected
	         * @param  {string} attrName 属性名字
	         * @return {string}          任务id
	         */
	        getTaskId: function (attrName) {
	            if (!this.attrToDomTaskIdMap[attrName]) {
	                this.attrToDomTaskIdMap[attrName] = this.domUpdater.generateTaskId();
	            }
	            return this.attrToDomTaskIdMap[attrName];
	        },
	
	        /**
	         * 设置当前节点的属性
	         *
	         * @public
	         * @param {string} name 属性名
	         * @param {*} value 属性值
	         */
	        setAttr: function (name, value) {
	            var taskId = this.getTaskId();
	            var me = this;
	            this.domUpdater.addTaskFn(taskId, function () {
	                DomUpdater.setAttr(me.node, name, value);
	            });
	        },
	
	        /**
	         * 获取属性
	         *
	         * @public
	         * @param  {string} name 属性名
	         * @return {*}      属性值
	         */
	        getAttr: function (name) {
	            return DomUpdater.getAttr(this.node, name);
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
	 * @param {number} taskId dom任务id
	 * @param  {Node} node    DOM中的节点
	 * @param {string} name 要更新的属性名
	 * @param  {DomUpdater} domUpdater DOM更新器
	 * @return {function(Object)}      更新函数
	 */
	function createAttrUpdateFn(taskId, node, name, domUpdater) {
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
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var Tree = __webpack_require__(12);
	var Event = __webpack_require__(17);
	var utils = __webpack_require__(10);
	var ComponentManager = __webpack_require__(27);
	
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
	
	    setParent: function (parentTree) {
	        Tree.prototype.setParent.apply(this, arguments);
	
	        parentTree.rootScope.addChild(this.rootScope);
	        this.rootScope.setParent(parentTree.rootScope);
	    },
	
	    createParser: function (ParserClass, options) {
	        var instance = Tree.prototype.createParser.apply(this, arguments);
	
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
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file 组件管理。ComponentManager也是有层级关系的，
	 *       Tree下面的ComponentManager注册这个Tree实例用到的Component，
	 *       而在Component中也可以注册此Component的tpl中将会使用到的Component。
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */
	
	var utils = __webpack_require__(10);
	
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
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file 组件的 <!-- children --> 实例，记录相关信息，方便后续 ChildrenDirectiveParser 解析
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */
	
	var utils = __webpack_require__(10);
	
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
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__(30);
	
	var amdExports = {
	    Config: __webpack_require__(31),
	    Tree: __webpack_require__(12),
	    DirtyChecker: __webpack_require__(32),
	    Parser: __webpack_require__(7),
	    ForDirectiveParser: __webpack_require__(19),
	    IfDirectiveParser: __webpack_require__(22),
	    EventExprParser: __webpack_require__(24),
	    ExprParser: __webpack_require__(25),
	    ExprCalculater: __webpack_require__(13),
	    VarDirectiveParser: __webpack_require__(33),
	    inherit: __webpack_require__(9),
	    utils: __webpack_require__(10),
	    DomUpdater: __webpack_require__(14),
	    ScopeModel: __webpack_require__(16)
	};
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {
	    module.exports = amdExports;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file scope directive parser
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */
	
	var DirectiveParser = __webpack_require__(6);
	var ScopeModel = __webpack_require__(16);
	var Tree = __webpack_require__(12);
	
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
/* 31 */
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
/* 32 */
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
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file 变量定义指令解析器
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */
	
	var DirectiveParser = __webpack_require__(6);
	var Tree = __webpack_require__(12);
	
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
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file 组件基类
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */
	
	var Base = __webpack_require__(8);
	
	module.exports = Base.extends(
	    {
	
	        /**
	         * 组件初始化
	         *
	         * @protected
	         */
	        initialize: function () {},
	
	        componentDidMount: function () {},
	
	        componentWillMount: function () {},
	
	        componentWillUnmount: function () {},
	
	        ref: function (ref) {
	            return this.parser.ref(ref);
	        },
	
	        /**
	         * 组件模板。子类可以覆盖这个属性。
	         *
	         * @protected
	         * @type {String}
	         */
	        tpl: '',
	
	        /**
	         * 销毁
	         *
	         * @public
	         */
	        destroy: function () {
	            this.beforeDestroy();
	
	            this.afterDestroy();
	        },
	
	        setData: function (name, value) {
	            this.parser.setAttr(name, value);
	        },
	
	        getData: function (name) {
	            return this.parser.getAttr(name);
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
/* 35 */
/***/ function(module, exports) {

	module.exports = "<button class=\"${class}\" event-click=\"${onClick(event)}\">\n    <!-- children -->\n</button>";

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(37)();
	// imports
	
	
	// module
	exports.push([module.id, ".button,\n.button:active {\n  background: #f6f6f6;\n  height: 30px;\n  outline: none;\n  border: none;\n  cursor: pointer;\n}\n.button:hover {\n  opacity: .8;\n}\n.button:active {\n  opacity: 1;\n}\n.button.skin-primary {\n  background: #70ccc0;\n  color: #fff;\n}\n.button.skin-success {\n  background: #80dda1;\n  color: #fff;\n}\n.button.skin-info {\n  background: #6bd5ec;\n  color: #fff;\n}\n.button.skin-warning {\n  background: #f9ad42;\n  color: #fff;\n}\n.button.skin-danger {\n  background: #f16c6c;\n  color: #fff;\n}\n.button.skin-link {\n  color: #70ccc0;\n  background: none;\n}\n", ""]);
	
	// exports


/***/ },
/* 37 */
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


/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNDRiNDJkMTA5OTY4NGZmMjMwZmU/ZGFiMCoiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0J1dHRvbi9CdXR0b24uanM/OWRlZSoiLCJ3ZWJwYWNrOi8vLy4vc3JjL0NvbnRyb2wuanM/MmM5ZSoiLCJ3ZWJwYWNrOi8vLy4uL3Zjb21wb25lbnQvc3JjL21haW4uanM/MWMyOSoiLCJ3ZWJwYWNrOi8vLy4uL3Zjb21wb25lbnQvc3JjL0NoaWxkcmVuRGlyZWN0aXZlUGFyc2VyLmpzP2M4MTgqIiwid2VicGFjazovLy8uLi92dHBsL3NyYy9wYXJzZXJzL0RpcmVjdGl2ZVBhcnNlci5qcz8wMDdiKiIsIndlYnBhY2s6Ly8vLi4vdnRwbC9zcmMvcGFyc2Vycy9QYXJzZXIuanM/OWQ2YSoiLCJ3ZWJwYWNrOi8vLy4uL3Z0cGwvc3JjL0Jhc2UuanM/Y2U3ZioiLCJ3ZWJwYWNrOi8vLy4uL3Z0cGwvc3JjL2luaGVyaXQuanM/ZTM3YSoiLCJ3ZWJwYWNrOi8vLy4uL3Z0cGwvc3JjL3V0aWxzLmpzPzkwZDQqIiwid2VicGFjazovLy8uLi92Y29tcG9uZW50L3NyYy9DaGlsZHJlblRyZWUuanM/NWE3OCoiLCJ3ZWJwYWNrOi8vLy4uL3Z0cGwvc3JjL3RyZWVzL1RyZWUuanM/NTVlOSoiLCJ3ZWJwYWNrOi8vLy4uL3Z0cGwvc3JjL0V4cHJDYWxjdWxhdGVyLmpzPzM2NTYqIiwid2VicGFjazovLy8uLi92dHBsL3NyYy9Eb21VcGRhdGVyLmpzP2I1OTcqIiwid2VicGFjazovLy8uLi92dHBsL3NyYy9sb2cuanM/NDg5ZSoiLCJ3ZWJwYWNrOi8vLy4uL3Z0cGwvc3JjL1Njb3BlTW9kZWwuanM/N2RlZCoiLCJ3ZWJwYWNrOi8vLy4uL3Z0cGwvc3JjL0V2ZW50LmpzPzk5ODUqIiwid2VicGFjazovLy8uLi92Y29tcG9uZW50L3NyYy9Gb3JEaXJlY3RpdmVQYXJzZXIuanM/NDJkZioiLCJ3ZWJwYWNrOi8vLy4uL3Z0cGwvc3JjL3BhcnNlcnMvRm9yRGlyZWN0aXZlUGFyc2VyLmpzP2Y1NzQqIiwid2VicGFjazovLy8uLi92dHBsL3NyYy90cmVlcy9Gb3JUcmVlLmpzPzA4Y2EqIiwid2VicGFjazovLy8uLi92Y29tcG9uZW50L3NyYy9JZkRpcmVjdGl2ZVBhcnNlci5qcz8zMDRjKiIsIndlYnBhY2s6Ly8vLi4vdnRwbC9zcmMvcGFyc2Vycy9JZkRpcmVjdGl2ZVBhcnNlci5qcz81NWUzKiIsIndlYnBhY2s6Ly8vLi4vdmNvbXBvbmVudC9zcmMvQ29tcG9uZW50UGFyc2VyLmpzP2I4OTkqIiwid2VicGFjazovLy8uLi92dHBsL3NyYy9wYXJzZXJzL0V2ZW50RXhwclBhcnNlci5qcz84OTliKiIsIndlYnBhY2s6Ly8vLi4vdnRwbC9zcmMvcGFyc2Vycy9FeHByUGFyc2VyLmpzP2ZhYTUqIiwid2VicGFjazovLy8uLi92Y29tcG9uZW50L3NyYy9Db21wb25lbnRUcmVlLmpzPzkzMjUqIiwid2VicGFjazovLy8uLi92Y29tcG9uZW50L3NyYy9Db21wb25lbnRNYW5hZ2VyLmpzPzFkYTIqIiwid2VicGFjazovLy8uLi92Y29tcG9uZW50L3NyYy9Db21wb25lbnRDaGlsZHJlbi5qcz9mZWUyKiIsIndlYnBhY2s6Ly8vLi4vdnRwbC9tYWluLmpzP2ZkMTYqIiwid2VicGFjazovLy8uLi92dHBsL3NyYy9wYXJzZXJzL1Njb3BlRGlyZWN0aXZlUGFyc2VyLmpzPzUzMTUqIiwid2VicGFjazovLy8uLi92dHBsL3NyYy9Db25maWcuanM/NWMxZioiLCJ3ZWJwYWNrOi8vLy4uL3Z0cGwvc3JjL0RpcnR5Q2hlY2tlci5qcz83MjI3KiIsIndlYnBhY2s6Ly8vLi4vdnRwbC9zcmMvcGFyc2Vycy9WYXJEaXJlY3RpdmVQYXJzZXIuanM/YjdhNCoiLCJ3ZWJwYWNrOi8vLy4uL3Zjb21wb25lbnQvc3JjL0NvbXBvbmVudC5qcz83ODMwKiIsIndlYnBhY2s6Ly8vLi9zcmMvQnV0dG9uL0J1dHRvbi50cGwuaHRtbD9mNzU2KiIsIndlYnBhY2s6Ly8vLi9zcmMvQnV0dG9uL0J1dHRvbi5sZXNzP2NkMjUqIiwid2VicGFjazovLy8uL34vY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanM/ZGEwNCoiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUN0Q0E7Ozs7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ2xCQTs7QUFFQSxpREFBZ0QsR0FBRyxpQkFBaUI7Ozs7Ozs7QUNGcEU7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBOzs7Ozs7O0FDakJBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFD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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQzdQQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBbUIsT0FBTztBQUMxQixvQkFBbUIsRUFBRTtBQUNyQixxQkFBb0IsUUFBUTtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBb0IsT0FBTztBQUMzQixxQkFBb0IsU0FBUztBQUM3QjtBQUNBLHFCQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2IsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiLFVBQVM7O0FBRVQ7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTs7QUFFQTtB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QTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMOzs7Ozs7O0FDcERBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9EQUFtRCxRQUFRO0FBQzNEO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyQ0FBMEMsUUFBUTtBQUNsRDtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYTtBQUNiOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBLGNBQWE7O0FBRWI7QUFDQTtBQUNBLGNBQWE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUFrRCxRQUFRO0FBQzFEO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTs7Ozs7OztBQ3JLQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW1CLGVBQWU7QUFDbEM7QUFDQTtBQUNBLHVEQUFzRCxRQUFRO0FBQzlEO0FBQ0Esb0RBQW1ELFFBQVE7QUFDM0Q7QUFDQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDckNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7O0FBRWI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0EsK0NBQThDLFFBQVE7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNULE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUN2S0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7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LE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQy9XQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBbUIsS0FBSztBQUN4QjtBQUNBLHFCQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiOztBQUVBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7O0FDbkdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBb0IsT0FBTztBQUMzQixxQkFBb0IsS0FBSztBQUN6QjtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBc0I7QUFDdEI7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBb0IsUUFBUTtBQUM1QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx3REFBdUQsUUFBUTtBQUMvRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFVBQVM7O0FBRVQ7QUFD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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUM7Ozs7Ozs7QUNwQkQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxrREFBaUQ7QUFDakQ7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwwQkFBeUI7QUFDekIseUJBQXdCOztBQUV4QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7OztBQ2hJQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQWtDOztBQUVsQywwQ0FBeUM7O0FBRXpDLDJDQUEwQzs7QUFFMUMsNkNBQTRDOztBQUU1QztBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFrQjtBQUNsQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBb0IsT0FBTztBQUMzQjtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTs7Ozs7Ozs7QUNwRUEscUNBQW9DLE1BQU0sbUJBQW1CLGVBQWUsdUM7Ozs7OztBQ0E1RTtBQUNBOzs7QUFHQTtBQUNBLHFEQUFvRCx3QkFBd0IsaUJBQWlCLGtCQUFrQixpQkFBaUIsb0JBQW9CLEdBQUcsaUJBQWlCLGdCQUFnQixHQUFHLGtCQUFrQixlQUFlLEdBQUcsd0JBQXdCLHdCQUF3QixnQkFBZ0IsR0FBRyx3QkFBd0Isd0JBQXdCLGdCQUFnQixHQUFHLHFCQUFxQix3QkFBd0IsZ0JBQWdCLEdBQUcsd0JBQXdCLHdCQUF3QixnQkFBZ0IsR0FBRyx1QkFBdUIsd0JBQXdCLGdCQUFnQixHQUFHLHFCQUFxQixtQkFBbUIscUJBQXFCLEdBQUc7O0FBRTFtQjs7Ozs7OztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQixpQkFBaUI7QUFDakM7QUFDQTtBQUNBLHlDQUF3QyxnQkFBZ0I7QUFDeEQsS0FBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQixpQkFBaUI7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFZLG9CQUFvQjtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgNDRiNDJkMTA5OTY4NGZmMjMwZmVcbiAqKi8iLCJyZXF1aXJlKCcuL0J1dHRvbi9CdXR0b24nKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvbWFpbi5qc1xuICoqIG1vZHVsZSBpZCA9IDBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMlxuICoqLyIsIi8qKlxuICogQGZpbGUg5oyJ6ZKu5o6n5Lu2XG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20sIGh0dHBzOi8vZ2l0aHViLmNvbS95aWJ1eWlzaGVuZylcbiAqL1xuXG52YXIgQ29udHJvbCA9IHJlcXVpcmUoJy4uL0NvbnRyb2wnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb250cm9sLmV4dGVuZHMoXG4gICAge1xuICAgICAgICB0cGw6IHJlcXVpcmUoJy4vQnV0dG9uLnRwbC5odG1sJylcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJG5hbWU6ICdCdXR0b24nLFxuXG4gICAgICAgIGdldFN0eWxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVxdWlyZSgnLi9CdXR0b24ubGVzcycpWzBdWzFdO1xuICAgICAgICB9XG4gICAgfVxuKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvQnV0dG9uL0J1dHRvbi5qc1xuICoqIG1vZHVsZSBpZCA9IDJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDJcbiAqKi8iLCJ2YXIgdmNvbXBvbmVudCA9IHJlcXVpcmUoJ3Zjb21wb25lbnQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB2Y29tcG9uZW50LkNvbXBvbmVudC5leHRlbmRzKHt9LCB7JG5hbWU6ICdDb250cm9sJ30pO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9Db250cm9sLmpzXG4gKiogbW9kdWxlIGlkID0gM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMlxuICoqLyIsInJlcXVpcmUoJy4vQ2hpbGRyZW5EaXJlY3RpdmVQYXJzZXInKTtcbnJlcXVpcmUoJy4vRm9yRGlyZWN0aXZlUGFyc2VyJyk7XG5yZXF1aXJlKCcuL0lmRGlyZWN0aXZlUGFyc2VyJyk7XG5yZXF1aXJlKCcuL0NvbXBvbmVudFBhcnNlcicpO1xuXG52YXIgQ29tcG9uZW50VHJlZSA9IHJlcXVpcmUoJy4vQ29tcG9uZW50VHJlZScpO1xudmFyIGRvbURhdGFCaW5kID0gcmVxdWlyZSgndnRwbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBDb21wb25lbnQ6IHJlcXVpcmUoJy4vQ29tcG9uZW50JyksXG4gICAgbW91bnQ6IGZ1bmN0aW9uIChvcHRpb25zLCBDb21wb25lbnRDbGFzc2VzKSB7XG4gICAgICAgIHZhciB0cmVlID0gbmV3IENvbXBvbmVudFRyZWUob3B0aW9ucyk7XG4gICAgICAgIHRyZWUucmVnaXN0ZUNvbXBvbmVudHMoQ29tcG9uZW50Q2xhc3Nlcyk7XG4gICAgICAgIHRyZWUudHJhdmVyc2UoKTtcbiAgICAgICAgcmV0dXJuIHRyZWU7XG4gICAgfSxcbiAgICBDb25maWc6IGRvbURhdGFCaW5kLkNvbmZpZ1xufTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdmNvbXBvbmVudC9zcmMvbWFpbi5qc1xuICoqIG1vZHVsZSBpZCA9IDRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDJcbiAqKi8iLCIvKipcbiAqIEBmaWxlIGNoaWxkcmVuIOaMh+S7pCA8IS0tIGNoaWxkcmVuIC0tPiDvvIzlj6rmnInnu4Tku7bkuK3miY3kvJrlrZjlnKjor6XmjIfku6RcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG52YXIgRGlyZWN0aXZlUGFyc2VyID0gcmVxdWlyZSgndnRwbC9zcmMvcGFyc2Vycy9EaXJlY3RpdmVQYXJzZXInKTtcbnZhciBDaGlsZHJlblRyZWUgPSByZXF1aXJlKCcuL0NoaWxkcmVuVHJlZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERpcmVjdGl2ZVBhcnNlci5leHRlbmRzKFxuICAgIHtcbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIERpcmVjdGl2ZVBhcnNlci5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgICAgICAgICB0aGlzLm5vZGUgPSBvcHRpb25zLm5vZGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY29sbGVjdEV4cHJzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgY29tcG9uZW50Q2hpbGRyZW4gPSB0aGlzLnRyZWUuZ2V0VHJlZVZhcignY29tcG9uZW50Q2hpbGRyZW4nLCB0cnVlKTtcbiAgICAgICAgICAgIGlmICghY29tcG9uZW50Q2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGRpdi5pbm5lckhUTUwgPSBjb21wb25lbnRDaGlsZHJlbi5nZXRUcGxIdG1sKCk7XG5cbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5UcmVlID0gbmV3IENoaWxkcmVuVHJlZSh7XG4gICAgICAgICAgICAgICAgc3RhcnROb2RlOiBkaXYuZmlyc3RDaGlsZCxcbiAgICAgICAgICAgICAgICBlbmROb2RlOiBkaXYubGFzdENoaWxkLFxuICAgICAgICAgICAgICAgIGNvbmZpZzogdGhpcy50cmVlLmNvbmZpZyxcbiAgICAgICAgICAgICAgICBkb21VcGRhdGVyOiB0aGlzLnRyZWUuZG9tVXBkYXRlcixcbiAgICAgICAgICAgICAgICBleHByQ2FsY3VsYXRlcjogdGhpcy50cmVlLmV4cHJDYWxjdWxhdGVyXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5UcmVlLnNldFBhcmVudCh0aGlzLnRyZWUpO1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlblRyZWUudHJhdmVyc2UoKTtcblxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlblRyZWUucm9vdFNjb3BlLnNldFBhcmVudChjb21wb25lbnRDaGlsZHJlbi5zY29wZSk7XG4gICAgICAgICAgICBjb21wb25lbnRDaGlsZHJlbi5zY29wZS5hZGRDaGlsZCh0aGlzLmNoaWxkcmVuVHJlZS5yb290U2NvcGUpO1xuXG4gICAgICAgICAgICB3aGlsZSAoZGl2LmNoaWxkTm9kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGRpdi5jaGlsZE5vZGVzWzBdLCB0aGlzLm5vZGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6I635Y+W5byA5aeL6IqC54K5XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICogQGluaGVyaXREb2NcbiAgICAgICAgICogQHJldHVybiB7Tm9kZX1cbiAgICAgICAgICovXG4gICAgICAgIGdldFN0YXJ0Tm9kZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmNoaWxkcmVuVHJlZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm5vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlblRyZWUuc3RhcnROb2RlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5bnu5PmnZ/oioLngrlcbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKiBAaW5oZXJpdERvY1xuICAgICAgICAgKiBAcmV0dXJuIHtOb2RlfVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0RW5kTm9kZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubm9kZTtcbiAgICAgICAgfSxcblxuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuVHJlZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgIHRoaXMubm9kZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuVHJlZSA9IG51bGw7XG5cbiAgICAgICAgICAgIERpcmVjdGl2ZVBhcnNlci5wcm90b3R5cGUuZGVzdHJveS5hcHBseSh0aGlzKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgICBpc1Byb3Blck5vZGU6IGZ1bmN0aW9uIChub2RlLCBjb25maWcpIHtcbiAgICAgICAgICAgIHJldHVybiBub2RlLm5vZGVUeXBlID09PSA4XG4gICAgICAgICAgICAgICAgJiYgbm9kZS5ub2RlVmFsdWUucmVwbGFjZSgvXFxzL2csICcnKSA9PT0gJ2NoaWxkcmVuJztcbiAgICAgICAgfSxcblxuICAgICAgICAkbmFtZTogJ0NoaWxkcmVuRGlyZWN0aXZlUGFyc2VyJ1xuICAgIH1cbik7XG5cbkNoaWxkcmVuVHJlZS5yZWdpc3RlUGFyc2VyKG1vZHVsZS5leHBvcnRzKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdmNvbXBvbmVudC9zcmMvQ2hpbGRyZW5EaXJlY3RpdmVQYXJzZXIuanNcbiAqKiBtb2R1bGUgaWQgPSA1XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyXG4gKiovIiwiLyoqXG4gKiBAZmlsZSDmjIfku6Top6PmnpDlmajmir3osaHnsbvjgILmjIfku6ToioLngrnkuIDlrprmmK/ms6jph4roioLngrlcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG52YXIgUGFyc2VyID0gcmVxdWlyZSgnLi9QYXJzZXInKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQYXJzZXIuZXh0ZW5kcyhcbiAgICB7fSxcbiAgICB7XG4gICAgICAgIGlzUHJvcGVyTm9kZTogZnVuY3Rpb24gKG5vZGUsIGNvbmZpZykge1xuICAgICAgICAgICAgcmV0dXJuIG5vZGUubm9kZVR5cGUgPT09IDg7XG4gICAgICAgIH0sXG4gICAgICAgICRuYW1lOiAnRGlyZWN0aXZlUGFyc2VyJ1xuICAgIH1cbik7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Z0cGwvc3JjL3BhcnNlcnMvRGlyZWN0aXZlUGFyc2VyLmpzXG4gKiogbW9kdWxlIGlkID0gNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMlxuICoqLyIsIi8qKlxuICogQGZpbGUg6Kej5p6Q5Zmo55qE5oq96LGh5Z+657G7XG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20pXG4gKi9cblxuLyoqXG4gKiDmnoTpgKDlh73mlbBcbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIOmFjee9ruWPguaVsO+8jOS4gOiIrOWPr+iDveS8muacieWmguS4i+WGheWuue+8mlxuICogICAgICAgICAgICAgICAgICAgICAgICAge1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0Tm9kZTogLi4uLFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZE5vZGU6IC4uLixcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlOiAuLi4sXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiAuLi5cbiAqICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAqICAgICAgICAgICAgICAgICAgICAgICAgIOWFt+S9k+aYr+WVpeWPr+S7peWPguWKoOWFt+S9k+eahOWtkOexu1xuICovXG5cbnZhciBCYXNlID0gcmVxdWlyZSgnLi4vQmFzZScpO1xubW9kdWxlLmV4cG9ydHMgPSBCYXNlLmV4dGVuZHMoXG4gICAge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDliJ3lp4vljJZcbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyDmnaXoh6rkuo7mnoTpgKDlh73mlbBcbiAgICAgICAgICovXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgICB0aGlzLmV4cHJDYWxjdWxhdGVyID0gb3B0aW9ucy5leHByQ2FsY3VsYXRlcjtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnID0gb3B0aW9ucy5jb25maWc7XG4gICAgICAgICAgICB0aGlzLmRvbVVwZGF0ZXIgPSBvcHRpb25zLmRvbVVwZGF0ZXI7XG4gICAgICAgICAgICB0aGlzLnRyZWUgPSBvcHRpb25zLnRyZWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOe7keWumnNjb3BlIG1vZGVsXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwdWJsaWNcbiAgICAgICAgICogQHBhcmFtIHtTY29wZU1vZGVsfSBzY29wZU1vZGVsIHNjb3BlIG1vZGVsXG4gICAgICAgICAqL1xuICAgICAgICBzZXRTY29wZTogZnVuY3Rpb24gKHNjb3BlTW9kZWwpIHtcbiAgICAgICAgICAgIHRoaXMuc2NvcGVNb2RlbCA9IHNjb3BlTW9kZWw7XG5cbiAgICAgICAgICAgIHRoaXMuc2NvcGVNb2RlbC5vbignY2hhbmdlJywgdGhpcy5vbkNoYW5nZSwgdGhpcyk7XG4gICAgICAgICAgICB0aGlzLnNjb3BlTW9kZWwub24oJ3BhcmVudGNoYW5nZScsIHRoaXMub25DaGFuZ2UsIHRoaXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBtb2RlbCDlj5HnlJ/lj5jljJbnmoTlm57osIPlh73mlbBcbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKi9cbiAgICAgICAgb25DaGFuZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuZG9tVXBkYXRlci5leGVjdXRlKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiOt+WPlnNjb3BlIG1vZGVsXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwdWJsaWNcbiAgICAgICAgICogQHJldHVybiB7U2NvcGVNb2RlbH0gc2NvcGUgbW9kZWzlr7nosaFcbiAgICAgICAgICovXG4gICAgICAgIGdldFNjb3BlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zY29wZU1vZGVsO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDlkJFzY29wZSBtb2RlbOmHjOmdouiuvue9ruaVsOaNrlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIOimgeiuvue9rueahOaVsOaNrlxuICAgICAgICAgKi9cbiAgICAgICAgc2V0RGF0YTogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIHRoaXMuc2NvcGVNb2RlbC5zZXQoZGF0YSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOmakOiXj+W9k+WJjXBhcnNlcuWunuS+i+ebuOWFs+eahOiKgueCueOAguWFt+S9k+WtkOexu+WunueOsFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqIEBhYnN0cmFjdFxuICAgICAgICAgKi9cbiAgICAgICAgZ29EYXJrOiBmdW5jdGlvbiAoKSB7fSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog5pi+56S655u45YWz5YWD57SgXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwdWJsaWNcbiAgICAgICAgICogQGFic3RyYWN0XG4gICAgICAgICAqL1xuICAgICAgICByZXN0b3JlRnJvbURhcms6IGZ1bmN0aW9uICgpIHt9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5bop6PmnpDlmajlvZPliY3nirbmgIHkuIvnmoTlvIDlp4tET03oioLngrnjgIJcbiAgICAgICAgICpcbiAgICAgICAgICog55Sx5LqO5pyJ55qE6Kej5p6Q5Zmo5Lya5bCG5LmL5YmN55qE6IqC54K556e76Zmk5o6J77yM6YKj5LmI5bCx5Lya5a+56YGN5Y6G5bim5p2l5b2x5ZON5LqG77yMXG4gICAgICAgICAqIOaJgOS7peatpOWkhOaPkOS+m+S4pOS4quiOt+WPluW8gOWni+iKgueCueWSjOe7k+adn+iKgueCueeahOaWueazleOAglxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqIEByZXR1cm4ge05vZGV9IERPTeiKgueCueWvueixoVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0U3RhcnROb2RlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdGFydE5vZGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiOt+WPluino+aekOWZqOW9k+WJjeeKtuaAgeS4i+eahOe7k+adn0RPTeiKgueCuVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqIEByZXR1cm4ge05vZGV9IOiKgueCueWvueixoVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0RW5kTm9kZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZW5kTm9kZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog5pCc6ZuG6KGo6L6+5byP77yM55Sf5oiQ6KGo6L6+5byP5Ye95pWw5ZKMIERPTSDmm7TmlrDlh73mlbDjgILlhbfkvZPlrZDnsbvlrp7njrBcbiAgICAgICAgICpcbiAgICAgICAgICogQGFic3RyYWN0XG4gICAgICAgICAqIEBwdWJsaWNcbiAgICAgICAgICovXG4gICAgICAgIGNvbGxlY3RFeHByczogZnVuY3Rpb24gKCkge30sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiEj+ajgOa1i+OAgum7mOiupOS8muS9v+eUqOWFqOetieWIpOaWreOAglxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqIEBwYXJhbSAge3N0cmluZ30gZXhwciAgICAgICAgIOimgeajgOafpeeahOihqOi+vuW8j1xuICAgICAgICAgKiBAcGFyYW0gIHsqfSBleHByVmFsdWUgICAg6KGo6L6+5byP5b2T5YmN6K6h566X5Ye65p2l55qE5YC8XG4gICAgICAgICAqIEBwYXJhbSAgeyp9IGV4cHJPbGRWYWx1ZSDooajovr7lvI/kuIrkuIDmrKHorqHnrpflh7rmnaXnmoTlgLxcbiAgICAgICAgICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgICAgIOS4pOasoeeahOWAvOaYr+WQpuebuOWQjFxuICAgICAgICAgKi9cbiAgICAgICAgZGlydHlDaGVjazogZnVuY3Rpb24gKGV4cHIsIGV4cHJWYWx1ZSwgZXhwck9sZFZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgZGlydHlDaGVja2VyRm4gPSB0aGlzLmRpcnR5Q2hlY2tlciA/IHRoaXMuZGlydHlDaGVja2VyLmdldENoZWNrZXIoZXhwcikgOiBudWxsO1xuICAgICAgICAgICAgcmV0dXJuIChkaXJ0eUNoZWNrZXJGbiAmJiBkaXJ0eUNoZWNrZXJGbihleHByLCBleHByVmFsdWUsIGV4cHJPbGRWYWx1ZSkpXG4gICAgICAgICAgICAgICAgICAgIHx8ICghZGlydHlDaGVja2VyRm4gJiYgZXhwclZhbHVlICE9PSBleHByT2xkVmFsdWUpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDorr7nva7ohI/mo4DmtYvlmahcbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAcGFyYW0ge0RpcnR5Q2hlY2tlcn0gZGlydHlDaGVja2VyIOiEj+ajgOa1i+WZqFxuICAgICAgICAgKi9cbiAgICAgICAgc2V0RGlydHlDaGVja2VyOiBmdW5jdGlvbiAoZGlydHlDaGVja2VyKSB7XG4gICAgICAgICAgICB0aGlzLmRpcnR5Q2hlY2tlciA9IGRpcnR5Q2hlY2tlcjtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6ZSA5q+B6Kej5p6Q5Zmo77yM5bCG55WM6Z2i5oGi5aSN5oiQ5Y6f5qC3XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwdWJsaWNcbiAgICAgICAgICovXG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuZXhwckNhbGN1bGF0ZXIgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5jb25maWcgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5kb21VcGRhdGVyID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMudHJlZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmRpcnR5Q2hlY2tlciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgJG5hbWU6ICdQYXJzZXInXG4gICAgfVxuKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdnRwbC9zcmMvcGFyc2Vycy9QYXJzZXIuanNcbiAqKiBtb2R1bGUgaWQgPSA3XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyXG4gKiovIiwiLyoqXG4gKiBAZmlsZSDmiYDmnInnsbvnmoTln7rnsbtcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG52YXIgaW5oZXJpdCA9IHJlcXVpcmUoJy4vaW5oZXJpdCcpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG5mdW5jdGlvbiBCYXNlKCkge1xuICAgIHRoaXMuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG5CYXNlLnByb3RvdHlwZS5pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge307XG5cbi8qKlxuICog57un5om/XG4gKlxuICogQHN0YXRpY1xuICogQHBhcmFtICB7T2JqZWN0fSBwcm9wcyAgICAgICDmma7pgJrlsZ7mgKdcbiAqIEBwYXJhbSAge09iamVjdH0gc3RhdGljUHJvcHMg6Z2Z5oCB5bGe5oCnXG4gKiBAcmV0dXJuIHtDbGFzc30gICAgICAgICAgICAg5a2Q57G7XG4gKi9cbkJhc2UuZXh0ZW5kcyA9IGZ1bmN0aW9uIChwcm9wcywgc3RhdGljUHJvcHMpIHtcbiAgICAvLyDmr4/kuKrnsbvpg73lv4XpobvmnInkuIDkuKrlkI3lrZdcbiAgICBpZiAoIXN0YXRpY1Byb3BzIHx8ICFzdGF0aWNQcm9wcy4kbmFtZSkge1xuICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoJ2VhY2ggY2xhc3MgbXVzdCBoYXZlIGEgYCRuYW1lYC4nKTtcbiAgICB9XG5cbiAgICB2YXIgYmFzZUNscyA9IHRoaXM7XG5cbiAgICB2YXIgY2xzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBiYXNlQ2xzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgICB1dGlscy5leHRlbmQoY2xzLnByb3RvdHlwZSwgcHJvcHMpO1xuICAgIHV0aWxzLmV4dGVuZChjbHMsIHN0YXRpY1Byb3BzKTtcblxuICAgIC8vIOiusOW9leS4gOS4i+eItuexu1xuICAgIGNscy4kc3VwZXJDbGFzcyA9IGJhc2VDbHM7XG5cbiAgICByZXR1cm4gaW5oZXJpdChjbHMsIGJhc2VDbHMpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYXNlO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL3NyYy9CYXNlLmpzXG4gKiogbW9kdWxlIGlkID0gOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMlxuICoqLyIsIi8qKlxuICogQGZpbGUg57un5om/XG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20pXG4gKi9cblxuZnVuY3Rpb24gaW5oZXJpdChDaGlsZENsYXNzLCBQYXJlbnRDbGFzcykge1xuICAgIGZ1bmN0aW9uIENscygpIHt9XG5cbiAgICBDbHMucHJvdG90eXBlID0gUGFyZW50Q2xhc3MucHJvdG90eXBlO1xuICAgIHZhciBjaGlsZFByb3RvID0gQ2hpbGRDbGFzcy5wcm90b3R5cGU7XG4gICAgQ2hpbGRDbGFzcy5wcm90b3R5cGUgPSBuZXcgQ2xzKCk7XG4gICAgQ2hpbGRDbGFzcy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDaGlsZENsYXNzO1xuXG4gICAgdmFyIGtleTtcbiAgICBmb3IgKGtleSBpbiBjaGlsZFByb3RvKSB7XG4gICAgICAgIENoaWxkQ2xhc3MucHJvdG90eXBlW2tleV0gPSBjaGlsZFByb3RvW2tleV07XG4gICAgfVxuXG4gICAgLy8g57un5om/6Z2Z5oCB5bGe5oCnXG4gICAgZm9yIChrZXkgaW4gUGFyZW50Q2xhc3MpIHtcbiAgICAgICAgaWYgKFBhcmVudENsYXNzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIGlmIChDaGlsZENsYXNzW2tleV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIENoaWxkQ2xhc3Nba2V5XSA9IFBhcmVudENsYXNzW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gQ2hpbGRDbGFzcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbmhlcml0O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL3NyYy9pbmhlcml0LmpzXG4gKiogbW9kdWxlIGlkID0gOVxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMlxuICoqLyIsIi8qKlxuICogQGZpbGUg5LiA5aCG6aG555uu6YeM6Z2i5bi455So55qE5pa55rOVXG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20pXG4gKi9cblxuZXhwb3J0cy5zbGljZSA9IGZ1bmN0aW9uIChhcnIsIHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJyLCBzdGFydCwgZW5kKTtcbn07XG5cbmV4cG9ydHMuZ29EYXJrID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMSkge1xuICAgICAgICBub2RlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfVxuICAgIGVsc2UgaWYgKG5vZGUubm9kZVR5cGUgPT09IDMpIHtcbiAgICAgICAgbm9kZS5fX3RleHRfXyA9IG5vZGUubm9kZVZhbHVlO1xuICAgICAgICBub2RlLm5vZGVWYWx1ZSA9ICcnO1xuICAgIH1cbn07XG5cbmV4cG9ydHMucmVzdG9yZUZyb21EYXJrID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMSkge1xuICAgICAgICBub2RlLnN0eWxlLmRpc3BsYXkgPSBudWxsO1xuICAgIH1cbiAgICBlbHNlIGlmIChub2RlLm5vZGVUeXBlID09PSAzKSB7XG4gICAgICAgIGlmIChub2RlLl9fdGV4dF9fICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIG5vZGUubm9kZVZhbHVlID0gbm9kZS5fX3RleHRfXztcbiAgICAgICAgICAgIG5vZGUuX190ZXh0X18gPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5leHBvcnRzLmNyZWF0ZUV4cHJGbiA9IGZ1bmN0aW9uIChleHByUmVnRXhwLCBleHByLCBleHByQ2FsY3VsYXRlcikge1xuICAgIGV4cHIgPSBleHByLnJlcGxhY2UoZXhwclJlZ0V4cCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gYXJndW1lbnRzWzFdO1xuICAgIH0pO1xuICAgIGV4cHJDYWxjdWxhdGVyLmNyZWF0ZUV4cHJGbihleHByKTtcblxuICAgIHJldHVybiBmdW5jdGlvbiAoc2NvcGVNb2RlbCkge1xuICAgICAgICByZXR1cm4gZXhwckNhbGN1bGF0ZXIuY2FsY3VsYXRlKGV4cHIsIGZhbHNlLCBzY29wZU1vZGVsKTtcbiAgICB9O1xufTtcblxuLyoqXG4gKiDotoXnuqfnroDljZXnmoQgZXh0ZW5kIO+8jOWboOS4uuacrOW6k+WvuSBleHRlbmQg5rKh6YKj6auY55qE6KaB5rGC77yMXG4gKiDnrYnliLDmnInopoHmsYLnmoTml7blgJnlho3lrozlloTjgIJcbiAqXG4gKiBAaW5uZXJcbiAqIEBwYXJhbSAge09iamVjdH0gdGFyZ2V0IOebruagh+WvueixoVxuICogQHJldHVybiB7T2JqZWN0fSAgICAgICAg5pyA57uI5ZCI5bm25ZCO55qE5a+56LGhXG4gKi9cbmV4cG9ydHMuZXh0ZW5kID0gZnVuY3Rpb24gKHRhcmdldCkge1xuICAgIHZhciBzcmNzID0gZXhwb3J0cy5zbGljZShhcmd1bWVudHMsIDEpO1xuICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IHNyY3MubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZSBndWFyZC1mb3ItaW4gKi9cbiAgICAgICAgZm9yICh2YXIga2V5IGluIHNyY3NbaV0pIHtcbiAgICAgICAgICAgIHRhcmdldFtrZXldID0gc3Jjc1tpXVtrZXldO1xuICAgICAgICB9XG4gICAgICAgIC8qIGVzbGludC1lbmFibGUgZ3VhcmQtZm9yLWluICovXG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQ7XG59O1xuXG5leHBvcnRzLnRyYXZlcnNlTm9DaGFuZ2VOb2RlcyA9IGZ1bmN0aW9uIChzdGFydE5vZGUsIGVuZE5vZGUsIG5vZGVGbiwgY29udGV4dCkge1xuICAgIGZvciAodmFyIGN1ck5vZGUgPSBzdGFydE5vZGU7XG4gICAgICAgIGN1ck5vZGUgJiYgY3VyTm9kZSAhPT0gZW5kTm9kZTtcbiAgICAgICAgY3VyTm9kZSA9IGN1ck5vZGUubmV4dFNpYmxpbmdcbiAgICApIHtcbiAgICAgICAgaWYgKG5vZGVGbi5jYWxsKGNvbnRleHQsIGN1ck5vZGUpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBub2RlRm4uY2FsbChjb250ZXh0LCBlbmROb2RlKTtcbn07XG5cbmV4cG9ydHMudHJhdmVyc2VOb2RlcyA9IGZ1bmN0aW9uIChzdGFydE5vZGUsIGVuZE5vZGUsIG5vZGVGbiwgY29udGV4dCkge1xuICAgIHZhciBub2RlcyA9IFtdO1xuICAgIGZvciAodmFyIGN1ck5vZGUgPSBzdGFydE5vZGU7XG4gICAgICAgIGN1ck5vZGUgJiYgY3VyTm9kZSAhPT0gZW5kTm9kZTtcbiAgICAgICAgY3VyTm9kZSA9IGN1ck5vZGUubmV4dFNpYmxpbmdcbiAgICApIHtcbiAgICAgICAgbm9kZXMucHVzaChjdXJOb2RlKTtcbiAgICB9XG5cbiAgICBub2Rlcy5wdXNoKGVuZE5vZGUpO1xuXG4gICAgZXhwb3J0cy5lYWNoKG5vZGVzLCBub2RlRm4sIGNvbnRleHQpO1xufTtcblxuZXhwb3J0cy5lYWNoID0gZnVuY3Rpb24gKGFyciwgZm4sIGNvbnRleHQpIHtcbiAgICBpZiAoZXhwb3J0cy5pc0FycmF5KGFycikpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlsID0gYXJyLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChmbi5jYWxsKGNvbnRleHQsIGFycltpXSwgaSwgYXJyKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBhcnIgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGZvciAodmFyIGsgaW4gYXJyKSB7XG4gICAgICAgICAgICBpZiAoZm4uY2FsbChjb250ZXh0LCBhcnJba10sIGssIGFycikpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmZ1bmN0aW9uIGlzQ2xhc3Mob2JqLCBjbHNOYW1lKSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCAnICsgY2xzTmFtZSArICddJztcbn1cblxuZXhwb3J0cy5pc0FycmF5ID0gZnVuY3Rpb24gKGFycikge1xuICAgIHJldHVybiBpc0NsYXNzKGFyciwgJ0FycmF5Jyk7XG59O1xuXG5leHBvcnRzLmlzTnVtYmVyID0gZnVuY3Rpb24gKG9iaikge1xuICAgIHJldHVybiBpc0NsYXNzKG9iaiwgJ051bWJlcicpO1xufTtcblxuZXhwb3J0cy5pc0Z1bmN0aW9uID0gZnVuY3Rpb24gKG9iaikge1xuICAgIHJldHVybiBpc0NsYXNzKG9iaiwgJ0Z1bmN0aW9uJyk7XG59O1xuXG4vKipcbiAqIOaYr+WQpuaYr+S4gOS4que6r+Wvueixoe+8jOa7oei2s+WmguS4i+adoeS7tu+8mlxuICpcbiAqIDHjgIHpmaTkuoblhoXnva7lsZ7mgKfkuYvlpJbvvIzmsqHmnInlhbbku5bnu6fmib/lsZ7mgKfvvJtcbiAqIDLjgIFjb25zdHJ1Y3RvciDmmK8gT2JqZWN0XG4gKlxuICogQHBhcmFtIHtBbnl9IG9iaiDlvoXliKTmlq3nmoTlj5jph49cbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmV4cG9ydHMuaXNQdXJlT2JqZWN0ID0gZnVuY3Rpb24gKG9iaikge1xuICAgIGlmICghaXNDbGFzcyhvYmosICdPYmplY3QnKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgayBpbiBvYmopIHtcbiAgICAgICAgaWYgKCFvYmouaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufTtcblxuZXhwb3J0cy5pc0NsYXNzID0gaXNDbGFzcztcblxuZXhwb3J0cy5iaW5kID0gZnVuY3Rpb24gKGZuLCB0aGlzQXJnKSB7XG4gICAgaWYgKCFleHBvcnRzLmlzRnVuY3Rpb24oZm4pKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgYmluZCA9IEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kIHx8IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgIHZhciBvYmogPSBhcmdzLmxlbmd0aCA+IDAgPyBhcmdzWzBdIDogdW5kZWZpbmVkO1xuICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHRvdGFsQXJncyA9IEFycmF5LnByb3RvdHlwZS5jb25jYXQuYXBwbHkoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJncywgMSksIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICByZXR1cm4gbWUuYXBwbHkob2JqLCB0b3RhbEFyZ3MpO1xuICAgICAgICB9O1xuICAgIH07XG4gICAgcmV0dXJuIGJpbmQuYXBwbHkoZm4sIFt0aGlzQXJnXS5jb25jYXQoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKSkpO1xufTtcblxuZXhwb3J0cy5pc1N1YkNsYXNzT2YgPSBmdW5jdGlvbiAoU3ViQ2xhc3MsIFN1cGVyQ2xhc3MpIHtcbiAgICByZXR1cm4gU3ViQ2xhc3MucHJvdG90eXBlIGluc3RhbmNlb2YgU3VwZXJDbGFzcztcbn07XG5cbi8qKlxuICog5a+55Lyg5YWl55qE5a2X56ym5Liy6L+b6KGM5Yib5bu65q2j5YiZ6KGo6L6+5byP5LmL5YmN55qE6L2s5LmJ77yM6Ziy5q2i5a2X56ym5Liy5Lit55qE5LiA5Lqb5a2X56ym5oiQ5Li65YWz6ZSu5a2X44CCXG4gKlxuICogQHBhcmFtICB7c3RyaW5nfSBzdHIg5b6F6L2s5LmJ55qE5a2X56ym5LiyXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICDovazkuYnkuYvlkI7nmoTlrZfnrKbkuLJcbiAqL1xuZXhwb3J0cy5yZWdFeHBFbmNvZGUgPSBmdW5jdGlvbiByZWdFeHBFbmNvZGUoc3RyKSB7XG4gICAgcmV0dXJuICdcXFxcJyArIHN0ci5zcGxpdCgnJykuam9pbignXFxcXCcpO1xufTtcblxuZXhwb3J0cy54aHIgPSBmdW5jdGlvbiAob3B0aW9ucywgbG9hZEZuLCBlcnJvckZuKSB7XG4gICAgb3B0aW9ucyA9IGV4cG9ydHMuZXh0ZW5kKHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJ1xuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHhoci5vbmVycm9yID0gZXJyb3JGbjtcbiAgICB4aHIub25sb2FkID0gbG9hZEZuO1xuICAgIHhoci5vcGVuKG9wdGlvbnMubWV0aG9kLCBvcHRpb25zLnVybCwgdHJ1ZSk7XG4gICAgc2V0SGVhZGVycyhvcHRpb25zLmhlYWRlcnMsIHhocik7XG4gICAgeGhyLnNlbmQob3B0aW9ucy5ib2R5KTtcbn07XG5cbi8qKlxuICog5bCG5a2X56ym5Liy5Lit55qE6am85bOw5ZG95ZCN5pa55byP5pS55Li655+t5qiq57q/55qE5b2i5byPXG4gKlxuICogQHB1YmxpY1xuICogQHBhcmFtICB7c3RyaW5nfSBzdHIg6KaB6L2s5o2i55qE5a2X56ym5LiyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydHMuY2FtZWwybGluZSA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1tBLVpdL2csIGZ1bmN0aW9uIChtYXRjaGVkLCBpbmRleCkge1xuICAgICAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBtYXRjaGVkLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICctJyArIG1hdGNoZWQudG9Mb3dlckNhc2UoKTtcbiAgICB9KTtcbn07XG5cbi8qKlxuICog5bCG5a2X56ym5Liy5Lit55qE55+t5qiq57q/5ZG95ZCN5pa55byP5pS55Li66am85bOw55qE5b2i5byPXG4gKlxuICogQHB1YmxpY1xuICogQHBhcmFtICB7c3RyaW5nfSBzdHIg6KaB6L2s5o2i55qE5a2X56ym5LiyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydHMubGluZTJjYW1lbCA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoLy1bYS16XS9nLCBmdW5jdGlvbiAobWF0Y2hlZCkge1xuICAgICAgICByZXR1cm4gbWF0Y2hlZFsxXS50b1VwcGVyQ2FzZSgpO1xuICAgIH0pO1xufTtcblxuZXhwb3J0cy5kaXN0aW5jdEFyciA9IGZ1bmN0aW9uIChhcnIsIGhhc2hGbikge1xuICAgIGhhc2hGbiA9IGV4cG9ydHMuaXNGdW5jdGlvbihoYXNoRm4pID8gaGFzaEZuIDogZnVuY3Rpb24gKGVsZW0pIHtcbiAgICAgICAgcmV0dXJuIFN0cmluZyhlbGVtKTtcbiAgICB9O1xuICAgIHZhciBvYmogPSB7fTtcbiAgICBmb3IgKHZhciBpID0gMCwgaWwgPSBhcnIubGVuZ3RoOyBpIDwgaWw7ICsraSkge1xuICAgICAgICBvYmpbaGFzaEZuKGFycltpXSldID0gYXJyW2ldO1xuICAgIH1cblxuICAgIHZhciByZXQgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICAgIGlmICghb2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0LnB1c2gob2JqW2tleV0pO1xuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG59O1xuXG5cbmZ1bmN0aW9uIHNldEhlYWRlcnMoaGVhZGVycywgeGhyKSB7XG4gICAgaWYgKCFoZWFkZXJzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBrIGluIGhlYWRlcnMpIHtcbiAgICAgICAgaWYgKCFoZWFkZXJzLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihrLCBoZWFkZXJzW2tdKTtcbiAgICB9XG59XG5cblxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL3NyYy91dGlscy5qc1xuICoqIG1vZHVsZSBpZCA9IDEwXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyXG4gKiovIiwiLyoqXG4gKiBAZmlsZSDlrZDmoJFcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG52YXIgVHJlZSA9IHJlcXVpcmUoJ3Z0cGwvc3JjL3RyZWVzL1RyZWUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBUcmVlLmV4dGVuZHMoXG4gICAge1xuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgaWYgKCFvcHRpb25zLmNvbmZpZ1xuICAgICAgICAgICAgICAgIHx8ICFvcHRpb25zLmRvbVVwZGF0ZXJcbiAgICAgICAgICAgICAgICB8fCAhb3B0aW9ucy5leHByQ2FsY3VsYXRlclxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd3cm9uZyBhcmd1bWVudHMnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgb3B0aW9ucy5jb21wb25lbnRDaGlsZHJlbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGRlbGV0ZSBvcHRpb25zLmNvbXBvbmVudENoaWxkcmVuO1xuXG4gICAgICAgICAgICBUcmVlLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgJG5hbWU6ICdDaGlsZHJlblRyZWUnXG4gICAgfVxuKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdmNvbXBvbmVudC9zcmMvQ2hpbGRyZW5UcmVlLmpzXG4gKiogbW9kdWxlIGlkID0gMTFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDJcbiAqKi8iLCIvKipcbiAqIEBmaWxlIOacgOe7iOeahOagkVxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG52YXIgRXhwckNhbGN1bGF0ZXIgPSByZXF1aXJlKCcuLi9FeHByQ2FsY3VsYXRlcicpO1xudmFyIERvbVVwZGF0ZXIgPSByZXF1aXJlKCcuLi9Eb21VcGRhdGVyJyk7XG52YXIgU2NvcGVNb2RlbCA9IHJlcXVpcmUoJy4uL1Njb3BlTW9kZWwnKTtcbnZhciBCYXNlID0gcmVxdWlyZSgnLi4vQmFzZScpO1xuXG52YXIgUGFyc2VyQ2xhc3NlcyA9IFtdO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhc2UuZXh0ZW5kcyhcbiAgICB7XG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgICBCYXNlLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgICAgIHRoaXMuc3RhcnROb2RlID0gb3B0aW9ucy5zdGFydE5vZGU7XG4gICAgICAgICAgICB0aGlzLmVuZE5vZGUgPSBvcHRpb25zLmVuZE5vZGU7XG4gICAgICAgICAgICB0aGlzLmNvbmZpZyA9IG9wdGlvbnMuY29uZmlnO1xuXG4gICAgICAgICAgICB0aGlzLmV4cHJDYWxjdWxhdGVyID0gb3B0aW9ucy5leHByQ2FsY3VsYXRlciB8fCBuZXcgRXhwckNhbGN1bGF0ZXIoKTtcbiAgICAgICAgICAgIHRoaXMuZG9tVXBkYXRlciA9IG9wdGlvbnMuZG9tVXBkYXRlciB8fCBuZXcgRG9tVXBkYXRlcigpO1xuICAgICAgICAgICAgdGhpcy5kaXJ0eUNoZWNrZXIgPSBvcHRpb25zLmRpcnR5Q2hlY2tlcjtcblxuICAgICAgICAgICAgdGhpcy50cmVlID0gW107XG4gICAgICAgICAgICB0aGlzLnRyZWVWYXJzID0ge307XG5cbiAgICAgICAgICAgIHRoaXMucm9vdFNjb3BlID0gbmV3IFNjb3BlTW9kZWwoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6K6+572u57uR5a6a5Zyo5qCR5LiK6Z2i55qE6aKd5aSW5Y+Y6YeP44CC6L+Z5Lqb5Y+Y6YeP5pyJ5aaC5LiL54m55oCn77yaXG4gICAgICAgICAqIDHjgIHml6Dms5Xopobnm5bvvJtcbiAgICAgICAgICogMuOAgeWcqOiOt+WPlnRyZWVWYXJz5LiK6Z2i5p+Q5Liq5Y+Y6YeP55qE5pe25YCZ77yM5aaC5p6c5b2T5YmN5qCR5Y+W5Ye65p2l5pivdW5kZWZpbmVk77yM6YKj5LmI5bCx5Lya5Yiw54i257qn5qCR55qEdHJlZVZhcnPkuIrljrvmib7vvIzku6XmraTnsbvmjqjjgIJcbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAg5Y+Y6YeP5ZCNXG4gICAgICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUg5Y+Y6YeP5YC8XG4gICAgICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IOaYr+WQpuiuvue9ruaIkOWKn1xuICAgICAgICAgKi9cbiAgICAgICAgc2V0VHJlZVZhcjogZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy50cmVlVmFyc1tuYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy50cmVlVmFyc1tuYW1lXSA9IHZhbHVlO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdW5zZXRUcmVlVmFyOiBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgdGhpcy50cmVlVmFyc1tuYW1lXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6I635Y+W57uR5a6a5Yiw5qCR5LiK55qE6aKd5aSW5Y+Y6YePXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwdWJsaWNcbiAgICAgICAgICogQHBhcmFtICB7c3RyaW5nfSBuYW1lICAgICAgICAgICAgICAgICAg5Y+Y6YeP5ZCNXG4gICAgICAgICAqIEBwYXJhbSAge2Jvb2xlYW49fSBzaG91bGROb3RGaW5kSW5QYXJlbnQg5aaC5p6c5Zyo5b2T5YmN5qCR5Lit5rKh5om+5Yiw77yM5piv5ZCm5Yiw54i257qn5qCR5Lit5Y675om+44CCXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnVl5bCx5Luj6KGo5LiN5Y6777yMZmFsc2XlsLHku6PooajopoHljrtcbiAgICAgICAgICogQHJldHVybiB7Kn1cbiAgICAgICAgICovXG4gICAgICAgIGdldFRyZWVWYXI6IGZ1bmN0aW9uIChuYW1lLCBzaG91bGROb3RGaW5kSW5QYXJlbnQpIHtcbiAgICAgICAgICAgIHZhciB2YWwgPSB0aGlzLnRyZWVWYXJzW25hbWVdO1xuICAgICAgICAgICAgaWYgKCFzaG91bGROb3RGaW5kSW5QYXJlbnRcbiAgICAgICAgICAgICAgICAmJiB2YWwgPT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICYmIHRoaXMuJHBhcmVudCAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB2YWwgPSB0aGlzLiRwYXJlbnQuZ2V0VHJlZVZhcihuYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0UGFyZW50OiBmdW5jdGlvbiAocGFyZW50KSB7XG4gICAgICAgICAgICB0aGlzLiRwYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0U2NvcGVCeU5hbWU6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICB2YXIgc2NvcGVzID0gdGhpcy5nZXRUcmVlVmFyKCdzY29wZXMnKTtcbiAgICAgICAgICAgIGlmICghc2NvcGVzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHNjb3Blc1tuYW1lXTtcbiAgICAgICAgfSxcblxuICAgICAgICB0cmF2ZXJzZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgd2Fsa0RvbSh0aGlzLCB0aGlzLnN0YXJ0Tm9kZSwgdGhpcy5lbmROb2RlLCB0aGlzLnRyZWUsIHRoaXMucm9vdFNjb3BlKTtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXREYXRhOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgZGF0YSA9IGRhdGEgfHwge307XG4gICAgICAgICAgICB0aGlzLnJvb3RTY29wZS5zZXQoZGF0YSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ29EYXJrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB1dGlscy50cmF2ZXJzZU5vQ2hhbmdlTm9kZXModGhpcy5zdGFydE5vZGUsIHRoaXMuZW5kTm9kZSwgZnVuY3Rpb24gKGN1ck5vZGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoY3VyTm9kZS5ub2RlVHlwZSA9PT0gMSB8fCBjdXJOb2RlLm5vZGVUeXBlID09PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgIHV0aWxzLmdvRGFyayhjdXJOb2RlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgfSxcblxuICAgICAgICByZXN0b3JlRnJvbURhcms6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHV0aWxzLnRyYXZlcnNlTm9DaGFuZ2VOb2Rlcyh0aGlzLnN0YXJ0Tm9kZSwgdGhpcy5lbmROb2RlLCBmdW5jdGlvbiAoY3VyTm9kZSkge1xuICAgICAgICAgICAgICAgIGlmIChjdXJOb2RlLm5vZGVUeXBlID09PSAxIHx8IGN1ck5vZGUubm9kZVR5cGUgPT09IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgdXRpbHMucmVzdG9yZUZyb21EYXJrKGN1ck5vZGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldERpcnR5Q2hlY2tlcjogZnVuY3Rpb24gKGRpcnR5Q2hlY2tlcikge1xuICAgICAgICAgICAgdGhpcy5kaXJ0eUNoZWNrZXIgPSBkaXJ0eUNoZWNrZXI7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgd2Fsayh0aGlzLnRyZWUpO1xuXG4gICAgICAgICAgICB0aGlzLnN0YXJ0Tm9kZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmVuZE5vZGUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5jb25maWcgPSBudWxsO1xuXG4gICAgICAgICAgICB0aGlzLmV4cHJDYWxjdWxhdGVyLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRoaXMuZXhwckNhbGN1bGF0ZXIgPSBudWxsO1xuXG4gICAgICAgICAgICB0aGlzLmRvbVVwZGF0ZXIuZGVzdHJveSgpO1xuICAgICAgICAgICAgdGhpcy5kb21VcGRhdGVyID0gbnVsbDtcblxuICAgICAgICAgICAgdGhpcy50cmVlID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMudHJlZVZhcnMgPSBudWxsO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5kaXJ0eUNoZWNrZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRpcnR5Q2hlY2tlci5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5kaXJ0eUNoZWNrZXIgPSBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiB3YWxrKHBhcnNlck9ianMpIHtcbiAgICAgICAgICAgICAgICB1dGlscy5lYWNoKHBhcnNlck9ianMsIGZ1bmN0aW9uIChjdXJQYXJzZXJPYmopIHtcbiAgICAgICAgICAgICAgICAgICAgY3VyUGFyc2VyT2JqLnBhcnNlci5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1clBhcnNlck9iai5jaGlsZHJlbiAmJiBjdXJQYXJzZXJPYmouY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3YWxrKGN1clBhcnNlck9iai5jaGlsZHJlbik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog5Yib5bu66Kej5p6Q5Zmo5a6e5L6L77yM5YW26L+U5Zue5YC855qE57uT5p6E5Li677yaXG4gICAgICAgICAqIHtcbiAgICAgICAgICogICAgIHBhcnNlcjogLi4uLFxuICAgICAgICAgKiAgICAgY29sbGVjdFJlc3VsdDogLi4uXG4gICAgICAgICAqIH1cbiAgICAgICAgICpcbiAgICAgICAgICog6L+U5Zue5YC85a2Y5Zyo5aaC5LiL5Yeg56eN5oOF5Ya177yaXG4gICAgICAgICAqXG4gICAgICAgICAqIDHjgIHlpoLmnpwgcGFyc2VyIOWxnuaAp+WtmOWcqOS4lCBjb2xsZWN0UmVzdWx0IOS4uiB0cnVlIO+8jOWImeivtOaYjuW9k+WJjeino+aekOWZqOino+aekOS6huaJgOacieebuOW6lOeahOiKgueCue+8iOWMheaLrOi1t+atouiKgueCuemXtOeahOiKgueCueOAgeW9k+WJjeiKgueCueWSjOWtkOWtmeiKgueCue+8ie+8m1xuICAgICAgICAgKiAy44CB55u05o6l6L+U5Zue5YGH5YC85oiW6ICFIHBhcnNlciDkuI3lrZjlnKjvvIzor7TmmI7msqHmnInlpITnkIbku7vkvZXoioLngrnvvIzlvZPliY3oioLngrnkuI3lsZ7kuo7lvZPliY3op6PmnpDlmajlpITnkIbvvJtcbiAgICAgICAgICogM+OAgXBhcnNlciDlrZjlnKjkuJQgY29sbGVjdFJlc3VsdCDkuLrmlbDnu4TvvIznu5PmnoTlpoLkuIvvvJpcbiAgICAgICAgICogICAgIFtcbiAgICAgICAgICogICAgICAgICB7XG4gICAgICAgICAqICAgICAgICAgICAgIHN0YXJ0Tm9kZTogTm9kZS48Li4uPixcbiAgICAgICAgICogICAgICAgICAgICAgZW5kTm9kZTogTm9kZS48Li4uPlxuICAgICAgICAgKiAgICAgICAgIH1cbiAgICAgICAgICogICAgIF1cbiAgICAgICAgICpcbiAgICAgICAgICogIOWImeivtOaYjuW9k+WJjeaYr+W4puacieW+iOWkmuWIhuaUr+eahOiKgueCue+8jOimgeS+neasoeino+aekOaVsOe7hOS4reavj+S4quWFg+e0oOaMh+WumueahOiKgueCueiMg+WbtOOAglxuICAgICAgICAgKiAg6ICM5LiU77yM6K+l6Kej5p6Q5Zmo5a+55bqU55qEIHNldERhdGEoKSDmlrnms5XlsIbkvJrov5Tlm57mlbTmlbDvvIzmjIfmmI7kvb/nlKjlk6rkuIDkuKrliIbmlK/nmoToioLngrnjgIJcbiAgICAgICAgICpcbiAgICAgICAgICogQGlubmVyXG4gICAgICAgICAqIEBwYXJhbSB7Q29uc3RydWN0b3J9IFBhcnNlckNsYXNzIHBhcnNlciDnsbtcbiAgICAgICAgICogQHBhcmFtICB7T2JqZWN0fSBvcHRpb25zIOWIneWni+WMluWPguaVsFxuICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgICAg6L+U5Zue5YC8XG4gICAgICAgICAqL1xuICAgICAgICBjcmVhdGVQYXJzZXI6IGZ1bmN0aW9uIChQYXJzZXJDbGFzcywgb3B0aW9ucykge1xuICAgICAgICAgICAgdmFyIHN0YXJ0Tm9kZSA9IG9wdGlvbnMuc3RhcnROb2RlIHx8IG9wdGlvbnMubm9kZTtcbiAgICAgICAgICAgIGlmICghUGFyc2VyQ2xhc3MuaXNQcm9wZXJOb2RlKHN0YXJ0Tm9kZSwgb3B0aW9ucy5jb25maWcpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZW5kTm9kZTtcbiAgICAgICAgICAgIGlmIChQYXJzZXJDbGFzcy5maW5kRW5kTm9kZSkge1xuICAgICAgICAgICAgICAgIGVuZE5vZGUgPSBQYXJzZXJDbGFzcy5maW5kRW5kTm9kZShzdGFydE5vZGUsIG9wdGlvbnMuY29uZmlnKTtcblxuICAgICAgICAgICAgICAgIGlmICghZW5kTm9kZSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBQYXJzZXJDbGFzcy5nZXROb0VuZE5vZGVFcnJvcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChlbmROb2RlLnBhcmVudE5vZGUgIT09IHN0YXJ0Tm9kZS5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigndGhlIHJlbGF0aW9uc2hpcCBiZXR3ZWVuIHN0YXJ0IG5vZGUgYW5kIGVuZCBub2RlIGlzIG5vdCBicm90aGVyaG9vZCEnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBwYXJzZXIgPSBuZXcgUGFyc2VyQ2xhc3ModXRpbHMuZXh0ZW5kKG9wdGlvbnMsIHtcbiAgICAgICAgICAgICAgICBlbmROb2RlOiBlbmROb2RlXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgcGFyc2VyOiBwYXJzZXIsXG4gICAgICAgICAgICAgICAgZW5kTm9kZTogZW5kTm9kZSB8fCBvcHRpb25zLm5vZGVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOazqOWGjOS4gOS4i+ino+aekOWZqOexu+OAglxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gIHtDb25zdHJ1Y3Rvcn0gUGFyc2VyQ2xhc3Mg6Kej5p6Q5Zmo57G7XG4gICAgICAgICAqL1xuICAgICAgICByZWdpc3RlUGFyc2VyOiBmdW5jdGlvbiAoUGFyc2VyQ2xhc3MpIHtcbiAgICAgICAgICAgIHZhciBpc0V4aXRzQ2hpbGRDbGFzcyA9IGZhbHNlO1xuICAgICAgICAgICAgdXRpbHMuZWFjaChQYXJzZXJDbGFzc2VzLCBmdW5jdGlvbiAoUEMsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgaWYgKHV0aWxzLmlzU3ViQ2xhc3NPZihQQywgUGFyc2VyQ2xhc3MpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzRXhpdHNDaGlsZENsYXNzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodXRpbHMuaXNTdWJDbGFzc09mKFBhcnNlckNsYXNzLCBQQykpIHtcbiAgICAgICAgICAgICAgICAgICAgUGFyc2VyQ2xhc3Nlc1tpbmRleF0gPSBQYXJzZXJDbGFzcztcbiAgICAgICAgICAgICAgICAgICAgaXNFeGl0c0NoaWxkQ2xhc3MgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBpc0V4aXRzQ2hpbGRDbGFzcztcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoIWlzRXhpdHNDaGlsZENsYXNzKSB7XG4gICAgICAgICAgICAgICAgUGFyc2VyQ2xhc3Nlcy5wdXNoKFBhcnNlckNsYXNzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAkbmFtZTogJ1RyZWUnXG4gICAgfVxuKTtcblxuXG5mdW5jdGlvbiB3YWxrRG9tKHRyZWUsIHN0YXJ0Tm9kZSwgZW5kTm9kZSwgY29udGFpbmVyLCBzY29wZU1vZGVsKSB7XG4gICAgaWYgKHN0YXJ0Tm9kZSA9PT0gZW5kTm9kZSkge1xuICAgICAgICBhZGQoc3RhcnROb2RlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAodmFyIGN1ck5vZGUgPSBzdGFydE5vZGU7IGN1ck5vZGU7KSB7XG4gICAgICAgIGN1ck5vZGUgPSBhZGQoY3VyTm9kZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkKGN1ck5vZGUpIHtcbiAgICAgICAgaWYgKCFjdXJOb2RlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHN0YXJ0Tm9kZTogY3VyTm9kZSxcbiAgICAgICAgICAgIG5vZGU6IGN1ck5vZGUsXG4gICAgICAgICAgICBjb25maWc6IHRyZWUuY29uZmlnLFxuICAgICAgICAgICAgZXhwckNhbGN1bGF0ZXI6IHRyZWUuZXhwckNhbGN1bGF0ZXIsXG4gICAgICAgICAgICBkb21VcGRhdGVyOiB0cmVlLmRvbVVwZGF0ZXIsXG4gICAgICAgICAgICB0cmVlOiB0cmVlXG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIHBhcnNlck9iajtcblxuICAgICAgICB1dGlscy5lYWNoKFBhcnNlckNsYXNzZXMsIGZ1bmN0aW9uIChQYXJzZXJDbGFzcykge1xuICAgICAgICAgICAgcGFyc2VyT2JqID0gdHJlZS5jcmVhdGVQYXJzZXIoUGFyc2VyQ2xhc3MsIG9wdGlvbnMpO1xuICAgICAgICAgICAgaWYgKCFwYXJzZXJPYmogfHwgIXBhcnNlck9iai5wYXJzZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwYXJzZXJPYmouY29sbGVjdFJlc3VsdCA9IHBhcnNlck9iai5wYXJzZXIuY29sbGVjdEV4cHJzKCk7XG5cbiAgICAgICAgICAgIHBhcnNlck9iai5wYXJzZXIuc2V0U2NvcGUoc2NvcGVNb2RlbCk7XG5cbiAgICAgICAgICAgIGlmICh1dGlscy5pc0FycmF5KHBhcnNlck9iai5jb2xsZWN0UmVzdWx0KSkge1xuICAgICAgICAgICAgICAgIHZhciBicmFuY2hlcyA9IHBhcnNlck9iai5jb2xsZWN0UmVzdWx0O1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5wdXNoKHtwYXJzZXI6IHBhcnNlck9iai5wYXJzZXIsIGNoaWxkcmVuOiBicmFuY2hlc30pO1xuICAgICAgICAgICAgICAgIHV0aWxzLmVhY2goYnJhbmNoZXMsIGZ1bmN0aW9uIChicmFuY2gsIGkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFicmFuY2guc3RhcnROb2RlIHx8ICFicmFuY2guZW5kTm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbiA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB3YWxrRG9tKHRyZWUsIGJyYW5jaC5zdGFydE5vZGUsIGJyYW5jaC5lbmROb2RlLCBjb24sIHBhcnNlck9iai5wYXJzZXIuZ2V0U2NvcGUoKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyYW5jaGVzW2ldID0gY29uO1xuICAgICAgICAgICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHBhcnNlck9iai5lbmROb2RlICE9PSBlbmROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIGN1ck5vZGUgPSBwYXJzZXJPYmoucGFyc2VyLmdldEVuZE5vZGUoKS5uZXh0U2libGluZztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGN1ck5vZGUgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBjb24gPSBbXTtcbiAgICAgICAgICAgICAgICBjb250YWluZXIucHVzaCh7cGFyc2VyOiBwYXJzZXJPYmoucGFyc2VyLCBjaGlsZHJlbjogY29ufSk7XG4gICAgICAgICAgICAgICAgaWYgKGN1ck5vZGUubm9kZVR5cGUgPT09IDEgJiYgY3VyTm9kZS5jaGlsZE5vZGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICB3YWxrRG9tKHRyZWUsIGN1ck5vZGUuZmlyc3RDaGlsZCwgY3VyTm9kZS5sYXN0Q2hpbGQsIGNvbiwgcGFyc2VyT2JqLnBhcnNlci5nZXRTY29wZSgpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoY3VyTm9kZSAhPT0gZW5kTm9kZSkge1xuICAgICAgICAgICAgICAgICAgICBjdXJOb2RlID0gcGFyc2VyT2JqLnBhcnNlci5nZXRFbmROb2RlKCkubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjdXJOb2RlID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICBpZiAoIXBhcnNlck9iaikge1xuICAgICAgICAgICAgY3VyTm9kZSA9IGN1ck5vZGUubmV4dFNpYmxpbmc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY3VyTm9kZTtcbiAgICB9XG59XG5cblxuXG5cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdnRwbC9zcmMvdHJlZXMvVHJlZS5qc1xuICoqIG1vZHVsZSBpZCA9IDEyXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyXG4gKiovIiwidmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG5mdW5jdGlvbiBFeHByQ2FsY3VsYXRlcigpIHtcbiAgICB0aGlzLmZucyA9IHt9O1xuXG4gICAgdGhpcy5leHByTmFtZU1hcCA9IHt9O1xuICAgIHRoaXMuZXhwck5hbWVSZWdFeHAgPSAvXFwuP1xcJD8oW2EtenxBLVpdK3woW2EtenxBLVpdK1swLTldK1thLXp8QS1aXSopKS9nO1xufVxuXG5FeHByQ2FsY3VsYXRlci5wcm90b3R5cGUuY3JlYXRlRXhwckZuID0gZnVuY3Rpb24gKGV4cHIsIGF2b2lkUmV0dXJuKSB7XG4gICAgaWYgKGV4cHIgPT09ICdrbGFzcycpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdga2xhc3NgIGlzIHRoZSBwcmVzZXJ2ZWQgd29yZCBmb3IgYGNsYXNzYCcpO1xuICAgIH1cbiAgICAvLyDlr7lleHByPSdjbGFzcyfov5vooYzkuIvovazmjaJcbiAgICBpZiAoZXhwciA9PT0gJ2NsYXNzJykge1xuICAgICAgICBleHByID0gJ2tsYXNzJztcbiAgICB9XG5cbiAgICBhdm9pZFJldHVybiA9ICEhYXZvaWRSZXR1cm47XG4gICAgdGhpcy5mbnNbZXhwcl0gPSB0aGlzLmZuc1tleHByXSB8fCB7fTtcbiAgICBpZiAodGhpcy5mbnNbZXhwcl1bYXZvaWRSZXR1cm5dKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgcGFyYW1zID0gZ2V0VmFyaWFibGVOYW1lc0Zyb21FeHByKHRoaXMsIGV4cHIpO1xuICAgIHZhciBmbiA9IG5ldyBGdW5jdGlvbihwYXJhbXMsIChhdm9pZFJldHVybiA/ICcnIDogJ3JldHVybiAnKSArIGV4cHIpO1xuXG4gICAgdGhpcy5mbnNbZXhwcl1bYXZvaWRSZXR1cm5dID0ge1xuICAgICAgICBwYXJhbU5hbWVzOiBwYXJhbXMsXG4gICAgICAgIGZuOiBmblxuICAgIH07XG59O1xuXG5FeHByQ2FsY3VsYXRlci5wcm90b3R5cGUuY2FsY3VsYXRlID0gZnVuY3Rpb24gKGV4cHIsIGF2b2lkUmV0dXJuLCBzY29wZU1vZGVsKSB7XG4gICAgLy8g5a+5ZXhwcj0nY2xhc3Mn6L+b6KGM5LiL6L2s5o2iXG4gICAgaWYgKGV4cHIgPT09ICdjbGFzcycpIHtcbiAgICAgICAgZXhwciA9ICdrbGFzcyc7XG4gICAgfVxuXG4gICAgdmFyIGZuT2JqID0gdGhpcy5mbnNbZXhwcl1bYXZvaWRSZXR1cm5dO1xuICAgIGlmICghZm5PYmopIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdubyBzdWNoIGV4cHJlc3Npb24gZnVuY3Rpb24gY3JlYXRlZCEnKTtcbiAgICB9XG5cbiAgICB2YXIgZm5BcmdzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDAsIGlsID0gZm5PYmoucGFyYW1OYW1lcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICAgIHZhciBwYXJhbSA9IGZuT2JqLnBhcmFtTmFtZXNbaV07XG4gICAgICAgIHZhciB2YWx1ZSA9IHNjb3BlTW9kZWwuZ2V0KHBhcmFtKTtcbiAgICAgICAgZm5BcmdzLnB1c2godmFsdWUgPT09IHVuZGVmaW5lZCA/ICcnIDogdmFsdWUpO1xuICAgIH1cblxuICAgIHZhciByZXN1bHQ7XG4gICAgdHJ5IHtcbiAgICAgICAgcmVzdWx0ID0gZm5PYmouZm4uYXBwbHkobnVsbCwgZm5BcmdzKTtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgcmVzdWx0ID0gJyc7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuXG5FeHByQ2FsY3VsYXRlci5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZucyA9IG51bGw7XG4gICAgdGhpcy5leHByTmFtZU1hcCA9IG51bGw7XG4gICAgdGhpcy5leHByTmFtZVJlZ0V4cCA9IG51bGw7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEV4cHJDYWxjdWxhdGVyO1xuXG4vKipcbiAqIOS7juihqOi+vuW8j+S4reaKveemu+WHuuWPmOmHj+WQjVxuICpcbiAqIEBpbm5lclxuICogQHBhcmFtIHtFeHByQ2FsY3VsYXRlcn0gbWUg5a+55bqU5a6e5L6LXG4gKiBAcGFyYW0gIHtzdHJpbmd9IGV4cHIg6KGo6L6+5byP5a2X56ym5Liy77yM57G75Ly85LqOIGAke25hbWV9YCDkuK3nmoQgbmFtZVxuICogQHJldHVybiB7QXJyYXkuPHN0cmluZz59ICAgICAg5Y+Y6YeP5ZCN5pWw57uEXG4gKi9cbmZ1bmN0aW9uIGdldFZhcmlhYmxlTmFtZXNGcm9tRXhwcihtZSwgZXhwcikge1xuICAgIGlmIChtZS5leHByTmFtZU1hcFtleHByXSkge1xuICAgICAgICByZXR1cm4gbWUuZXhwck5hbWVNYXBbZXhwcl07XG4gICAgfVxuXG4gICAgdmFyIHJlZyA9IC9bXFwkfF98YS16fEEtWl17MX0oPzpbYS16fEEtWnwwLTl8XFwkfF9dKikvZztcblxuICAgIGZvciAodmFyIG5hbWVzID0ge30sIG5hbWUgPSByZWcuZXhlYyhleHByKTsgbmFtZTsgbmFtZSA9IHJlZy5leGVjKGV4cHIpKSB7XG4gICAgICAgIHZhciByZXN0U3RyID0gZXhwci5zbGljZShuYW1lLmluZGV4ICsgbmFtZVswXS5sZW5ndGgpO1xuXG4gICAgICAgIC8vIOaYr+W3puWAvFxuICAgICAgICBpZiAoL15cXHMqPSg/IT0pLy50ZXN0KHJlc3RTdHIpKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOWPmOmHj+WQjeWJjemdouaYr+WQpuWtmOWcqCBgLmAg77yM5oiW6ICF5Y+Y6YeP5ZCN5piv5ZCm5L2N5LqO5byV5Y+35YaF6YOoXG4gICAgICAgIGlmIChuYW1lLmluZGV4XG4gICAgICAgICAgICAmJiAoZXhwcltuYW1lLmluZGV4IC0gMV0gPT09ICcuJ1xuICAgICAgICAgICAgICAgIHx8IGlzSW5RdW90ZShcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cHIuc2xpY2UoMCwgbmFtZS5pbmRleCksXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN0U3RyXG4gICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgbmFtZXNbbmFtZVswXV0gPSB0cnVlO1xuICAgIH1cblxuICAgIHZhciByZXQgPSBbXTtcbiAgICB1dGlscy5lYWNoKG5hbWVzLCBmdW5jdGlvbiAoaXNPaywgbmFtZSkge1xuICAgICAgICBpZiAoaXNPaykge1xuICAgICAgICAgICAgcmV0LnB1c2gobmFtZSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBtZS5leHByTmFtZU1hcFtleHByXSA9IHJldDtcblxuICAgIHJldHVybiByZXQ7XG5cbiAgICBmdW5jdGlvbiBpc0luUXVvdGUocHJlU3RyLCByZXN0U3RyKSB7XG4gICAgICAgIGlmICgocHJlU3RyLmxhc3RJbmRleE9mKCdcXCcnKSArIDEgJiYgcmVzdFN0ci5pbmRleE9mKCdcXCcnKSArIDEpXG4gICAgICAgICAgICB8fCAocHJlU3RyLmxhc3RJbmRleE9mKCdcIicpICsgMSAmJiByZXN0U3RyLmluZGV4T2YoJ1wiJykgKyAxKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL3NyYy9FeHByQ2FsY3VsYXRlci5qc1xuICoqIG1vZHVsZSBpZCA9IDEzXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyXG4gKiovIiwiLyoqXG4gKiBAZmlsZSBET00g5pu05paw5ZmoXG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20pXG4gKi9cblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xudmFyIGxvZyA9IHJlcXVpcmUoJy4vbG9nJyk7XG5cbnZhciBldmVudExpc3QgPSAoJ2JsdXIgZm9jdXMgZm9jdXNpbiBmb2N1c291dCBsb2FkIHJlc2l6ZSBzY3JvbGwgdW5sb2FkIGNsaWNrIGRibGNsaWNrICdcbiAgICArICdtb3VzZWRvd24gbW91c2V1cCBtb3VzZW1vdmUgbW91c2VvdmVyIG1vdXNlb3V0IG1vdXNlZW50ZXIgbW91c2VsZWF2ZSAnXG4gICAgKyAnY2hhbmdlIHNlbGVjdCBzdWJtaXQga2V5ZG93biBrZXlwcmVzcyBrZXl1cCBlcnJvciBjb250ZXh0bWVudScpLnNwbGl0KCcgJyk7XG5cbmZ1bmN0aW9uIERvbVVwZGF0ZXIoKSB7XG4gICAgdGhpcy50YXNrcyA9IHt9O1xuICAgIHRoaXMuaXNFeGVjdXRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLmRvbmVGbnMgPSBbXTtcbn1cblxudmFyIGNvdW50ZXIgPSAwO1xuRG9tVXBkYXRlci5wcm90b3R5cGUuZ2VuZXJhdGVUYXNrSWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGNvdW50ZXIrKztcbn07XG5cbkRvbVVwZGF0ZXIucHJvdG90eXBlLmFkZFRhc2tGbiA9IGZ1bmN0aW9uICh0YXNrSWQsIHRhc2tGbikge1xuICAgIHRoaXMudGFza3NbdGFza0lkXSA9IHRhc2tGbjtcbn07XG5cbkRvbVVwZGF0ZXIucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy50YXNrcyA9IG51bGw7XG59O1xuXG5Eb21VcGRhdGVyLnByb3RvdHlwZS5leGVjdXRlID0gZnVuY3Rpb24gKGRvbmVGbikge1xuICAgIGlmICh1dGlscy5pc0Z1bmN0aW9uKGRvbmVGbikpIHtcbiAgICAgICAgdGhpcy5kb25lRm5zLnB1c2goZG9uZUZuKTtcbiAgICB9XG5cbiAgICB2YXIgbWUgPSB0aGlzO1xuICAgIGlmICghdGhpcy5pc0V4ZWN1dGluZykge1xuICAgICAgICB0aGlzLmlzRXhlY3V0aW5nID0gdHJ1ZTtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHV0aWxzLmVhY2gobWUudGFza3MsIGZ1bmN0aW9uICh0YXNrRm4pIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICB0YXNrRm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nLndhcm4oZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBtZS50YXNrcyA9IHt9O1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KHV0aWxzLmJpbmQoZnVuY3Rpb24gKGRvbmVGbnMpIHtcbiAgICAgICAgICAgICAgICB1dGlscy5lYWNoKGRvbmVGbnMsIGZ1bmN0aW9uIChkb25lRm4pIHtcbiAgICAgICAgICAgICAgICAgICAgZG9uZUZuKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LCBudWxsLCBtZS5kb25lRm5zKSk7XG4gICAgICAgICAgICBtZS5kb25lRm5zID0gW107XG5cbiAgICAgICAgICAgIG1lLmlzRXhlY3V0aW5nID0gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cbi8qKlxuICog57uZ5oyH5a6aRE9N6IqC54K555qE5oyH5a6a5bGe5oCn6K6+572u5YC8XG4gKlxuICogVE9ETzog5a6M5ZaEXG4gKlxuICogQHN0YXRpY1xuICogQHBhcmFtIHtOb2RlfSBub2RlICBET03oioLngrlcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lICDoioLngrnlsZ7mgKflkI1cbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZSDoioLngrnlsZ7mgKflgLxcbiAqIEByZXR1cm4geyp9XG4gKi9cbkRvbVVwZGF0ZXIuc2V0QXR0ciA9IGZ1bmN0aW9uIChub2RlLCBuYW1lLCB2YWx1ZSkge1xuICAgIC8vIOebruWJjeS7heWkhOeQhuWFg+e0oOiKgueCue+8jOS7peWQjuaYr+WQpuWkhOeQhuWFtuS7luexu+Wei+eahOiKgueCue+8jOS7peWQjuWGjeivtFxuICAgIGlmIChub2RlLm5vZGVUeXBlICE9PSAxKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAobmFtZSA9PT0gJ3N0eWxlJyAmJiB1dGlscy5pc1B1cmVPYmplY3QodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBEb21VcGRhdGVyLnNldFN0eWxlKG5vZGUsIHZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAobmFtZSA9PT0gJ2NsYXNzJykge1xuICAgICAgICByZXR1cm4gRG9tVXBkYXRlci5zZXRDbGFzcyhub2RlLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgaWYgKERvbVVwZGF0ZXIuaXNFdmVudE5hbWUobmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIERvbVVwZGF0ZXIuc2V0RXZlbnQobm9kZSwgbmFtZSwgdmFsdWUpO1xuICAgIH1cblxuICAgIC8vIOWklumDqOeCueWHu+S6i+S7tlxuICAgIGlmIChuYW1lID09PSAnb25vdXRjbGljaycpIHtcbiAgICAgICAgcmV0dXJuIERvbVVwZGF0ZXIuc2V0T3V0Q2xpY2sobm9kZSwgdmFsdWUpO1xuICAgIH1cblxuICAgIG5vZGUuc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbn07XG5cbkRvbVVwZGF0ZXIuc2V0T3V0Q2xpY2sgPSBmdW5jdGlvbiAobm9kZSwgY2FsbGJhY2spIHtcbiAgICBpZiAoIXV0aWxzLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50ID0gZXZlbnQgfHwgd2luZG93LmV2ZW50O1xuXG4gICAgICAgIGlmIChub2RlICE9PSBldmVudC50YXJnZXQgJiYgIW5vZGUuY29udGFpbnMoZXZlbnQudGFyZ2V0KSkge1xuICAgICAgICAgICAgY2FsbGJhY2soZXZlbnQpO1xuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG5Eb21VcGRhdGVyLnNldEV2ZW50ID0gZnVuY3Rpb24gKG5vZGUsIG5hbWUsIHZhbHVlKSB7XG4gICAgaWYgKHV0aWxzLmlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICAgIG5vZGVbbmFtZV0gPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50ID0gZXZlbnQgfHwgd2luZG93LmV2ZW50O1xuICAgICAgICAgICAgdmFsdWUoZXZlbnQpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgbm9kZVtuYW1lXSA9IG51bGw7XG4gICAgfVxufTtcblxuRG9tVXBkYXRlci5zZXRDbGFzcyA9IGZ1bmN0aW9uIChub2RlLCBrbGFzcykge1xuICAgIGlmICgha2xhc3MpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG5vZGUuY2xhc3NOYW1lID0gRG9tVXBkYXRlci5nZXRDbGFzc0xpc3Qoa2xhc3MpLmpvaW4oJyAnKTtcbn07XG5cbkRvbVVwZGF0ZXIuc2V0U3R5bGUgPSBmdW5jdGlvbiAobm9kZSwgc3R5bGVPYmopIHtcbiAgICBmb3IgKHZhciBrIGluIHN0eWxlT2JqKSB7XG4gICAgICAgIG5vZGUuc3R5bGVba10gPSBzdHlsZU9ialtrXTtcbiAgICB9XG59O1xuXG4vKipcbiAqIOiOt+WPluWFg+e0oOiKgueCueeahOWxnuaAp+WAvFxuICpcbiAqIEBzdGF0aWNcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBkb23oioLngrlcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIOWxnuaAp+WQjVxuICogQHJldHVybiB7Kn0g5bGe5oCn5YC8XG4gKi9cbkRvbVVwZGF0ZXIuZ2V0QXR0ciA9IGZ1bmN0aW9uIChub2RlLCBuYW1lKSB7XG4gICAgaWYgKG5hbWUgPT09ICdjbGFzcycpIHtcbiAgICAgICAgcmV0dXJuIERvbVVwZGF0ZXIuZ2V0Q2xhc3NMaXN0KG5vZGUuY2xhc3NOYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGUuZ2V0QXR0cmlidXRlKG5vZGUpO1xufTtcblxuRG9tVXBkYXRlci5nZXRDbGFzc0xpc3QgPSBmdW5jdGlvbiAoa2xhc3MpIHtcbiAgICB2YXIga2xhc3NlcyA9IFtdO1xuICAgIGlmICh1dGlscy5pc0NsYXNzKGtsYXNzLCAnU3RyaW5nJykpIHtcbiAgICAgICAga2xhc3NlcyA9IGtsYXNzLnNwbGl0KCcgJyk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHV0aWxzLmlzUHVyZU9iamVjdChrbGFzcykpIHtcbiAgICAgICAgZm9yICh2YXIgayBpbiBrbGFzcykge1xuICAgICAgICAgICAgaWYgKGtsYXNzW2tdKSB7XG4gICAgICAgICAgICAgICAga2xhc3Nlcy5wdXNoKGtsYXNzW2tdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICh1dGlscy5pc0FycmF5KGtsYXNzKSkge1xuICAgICAgICBrbGFzc2VzID0ga2xhc3M7XG4gICAgfVxuXG4gICAgcmV0dXJuIHV0aWxzLmRpc3RpbmN0QXJyKGtsYXNzZXMpO1xufTtcblxuRG9tVXBkYXRlci5pc0V2ZW50TmFtZSA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICBpZiAoc3RyLmluZGV4T2YoJ29uJykgIT09IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzdHIgPSBzdHIuc2xpY2UoMik7XG4gICAgZm9yICh2YXIgaSA9IDAsIGlsID0gZXZlbnRMaXN0Lmxlbmd0aDsgaSA8IGlsOyArK2kpIHtcbiAgICAgICAgaWYgKHN0ciA9PT0gZXZlbnRMaXN0W2ldKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRG9tVXBkYXRlcjtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdnRwbC9zcmMvRG9tVXBkYXRlci5qc1xuICoqIG1vZHVsZSBpZCA9IDE0XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgd2FybjogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIWNvbnNvbGUgfHwgIWNvbnNvbGUud2Fybikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS53YXJuLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cyk7XG4gICAgfVxufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Z0cGwvc3JjL2xvZy5qc1xuICoqIG1vZHVsZSBpZCA9IDE1XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyXG4gKiovIiwidmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xudmFyIEV2ZW50ID0gcmVxdWlyZSgnLi9FdmVudCcpO1xudmFyIGluaGVyaXQgPSByZXF1aXJlKCcuL2luaGVyaXQnKTtcblxuZnVuY3Rpb24gU2NvcGVNb2RlbCgpIHtcbiAgICBFdmVudC5jYWxsKHRoaXMpO1xuXG4gICAgdGhpcy5zdG9yZSA9IHt9O1xuICAgIHRoaXMucGFyZW50O1xuICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcbn1cblxuU2NvcGVNb2RlbC5wcm90b3R5cGUuc2V0UGFyZW50ID0gZnVuY3Rpb24gKHBhcmVudCkge1xuICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xufTtcblxuU2NvcGVNb2RlbC5wcm90b3R5cGUuYWRkQ2hpbGQgPSBmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICB0aGlzLmNoaWxkcmVuLnB1c2goY2hpbGQpO1xufTtcblxuU2NvcGVNb2RlbC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgaWYgKHV0aWxzLmlzQ2xhc3MobmFtZSwgJ1N0cmluZycpKSB7XG4gICAgICAgIHRoaXMuc3RvcmVbbmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgY2hhbmdlKHRoaXMpO1xuICAgIH1cbiAgICBlbHNlIGlmICh1dGlscy5pc1B1cmVPYmplY3QobmFtZSkpIHtcbiAgICAgICAgdXRpbHMuZXh0ZW5kKHRoaXMuc3RvcmUsIG5hbWUpO1xuICAgICAgICBjaGFuZ2UodGhpcyk7XG4gICAgfVxufTtcblxuU2NvcGVNb2RlbC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEgfHwgbmFtZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0b3JlO1xuICAgIH1cblxuICAgIGlmIChuYW1lIGluIHRoaXMuc3RvcmUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RvcmVbbmFtZV07XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXQobmFtZSk7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBpbmhlcml0KFNjb3BlTW9kZWwsIEV2ZW50KTtcblxuZnVuY3Rpb24gY2hhbmdlKG1lKSB7XG4gICAgbWUudHJpZ2dlcignY2hhbmdlJywgbWUpO1xuICAgIHV0aWxzLmVhY2gobWUuY2hpbGRyZW4sIGZ1bmN0aW9uIChzY29wZSkge1xuICAgICAgICBzY29wZS50cmlnZ2VyKCdwYXJlbnRjaGFuZ2UnLCBtZSk7XG4gICAgfSk7XG59XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Z0cGwvc3JjL1Njb3BlTW9kZWwuanNcbiAqKiBtb2R1bGUgaWQgPSAxNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMlxuICoqLyIsInZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxuZnVuY3Rpb24gRXZlbnQoKSB7XG4gICAgdGhpcy5ldm50cyA9IHt9O1xufVxuXG5FdmVudC5wcm90b3R5cGUub24gPSBmdW5jdGlvbiAoZXZlbnROYW1lLCBmbiwgY29udGV4dCkge1xuICAgIGlmICghdXRpbHMuaXNGdW5jdGlvbihmbikpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuZXZudHNbZXZlbnROYW1lXSA9IHRoaXMuZXZudHNbZXZlbnROYW1lXSB8fCBbXTtcblxuICAgIHRoaXMuZXZudHNbZXZlbnROYW1lXS5wdXNoKHtcbiAgICAgICAgZm46IGZuLFxuICAgICAgICBjb250ZXh0OiBjb250ZXh0XG4gICAgfSk7XG59O1xuXG5FdmVudC5wcm90b3R5cGUudHJpZ2dlciA9IGZ1bmN0aW9uIChldmVudE5hbWUpIHtcbiAgICB2YXIgZm5PYmpzID0gdGhpcy5ldm50c1tldmVudE5hbWVdO1xuICAgIGlmIChmbk9ianMgJiYgZm5PYmpzLmxlbmd0aCkge1xuICAgICAgICB2YXIgYXJncyA9IHV0aWxzLnNsaWNlKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIHV0aWxzLmVhY2goZm5PYmpzLCBmdW5jdGlvbiAoZm5PYmopIHtcbiAgICAgICAgICAgIGZuT2JqLmZuLmFwcGx5KGZuT2JqLmNvbnRleHQsIGFyZ3MpO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuXG5FdmVudC5wcm90b3R5cGUub2ZmID0gZnVuY3Rpb24gKGV2ZW50TmFtZSwgZm4pIHtcbiAgICBpZiAoIWZuKSB7XG4gICAgICAgIHRoaXMuZXZudHNbZXZlbnROYW1lXSA9IG51bGw7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgZm5PYmpzID0gdGhpcy5ldm50c1tldmVudE5hbWVdO1xuICAgIGlmIChmbk9ianMgJiYgZm5PYmpzLmxlbmd0aCkge1xuICAgICAgICB2YXIgbmV3Rm5PYmpzID0gW107XG4gICAgICAgIHV0aWxzLmVhY2goZm5PYmpzLCBmdW5jdGlvbiAoZm5PYmopIHtcbiAgICAgICAgICAgIGlmIChmbiAhPT0gZm5PYmouZm4pIHtcbiAgICAgICAgICAgICAgICBuZXdGbk9ianMucHVzaChmbk9iaik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmV2bnRzW2V2ZW50TmFtZV0gPSBuZXdGbk9ianM7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFdmVudDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdnRwbC9zcmMvRXZlbnQuanNcbiAqKiBtb2R1bGUgaWQgPSAxN1xuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMlxuICoqLyIsIi8qKlxuICogQGZpbGUg5aKe5by6Zm9y5oyH5LukXG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20pXG4gKi9cblxudmFyIEZvckRpcmVjdGl2ZVBhcnNlciA9IHJlcXVpcmUoJ3Z0cGwvc3JjL3BhcnNlcnMvRm9yRGlyZWN0aXZlUGFyc2VyJyk7XG52YXIgRm9yVHJlZSA9IHJlcXVpcmUoJ3Z0cGwvc3JjL3RyZWVzL0ZvclRyZWUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBGb3JEaXJlY3RpdmVQYXJzZXIuZXh0ZW5kcyhcbiAgICB7XG4gICAgICAgIHNldENzc0NsYXNzOiBmdW5jdGlvbiAoY2xhc3NMaXN0KSB7XG4gICAgICAgICAgICB0aGlzLiQkY2xhc3NMaXN0ID0gY2xhc3NMaXN0O1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlsID0gdGhpcy50cmVlcy5sZW5ndGg7IGkgPCBpbDsgKytpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRyZWUgPSB0aGlzLnRyZWVzW2ldO1xuICAgICAgICAgICAgICAgIHNldENsYXNzZXModHJlZSwgY2xhc3NMaXN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBjcmVhdGVUcmVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgdHJlZSA9IEZvckRpcmVjdGl2ZVBhcnNlci5wcm90b3R5cGUuY3JlYXRlVHJlZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgc2V0Q2xhc3Nlcyh0cmVlLCB0aGlzLiQkY2xhc3NMaXN0KTtcbiAgICAgICAgICAgIHJldHVybiB0cmVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldEF0dHI6IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKG5hbWUgPT09ICdjbGFzcycpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldENzc0NsYXNzKHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgICAkbmFtZTogJ0ZvckRpcmVjdGl2ZVBhcnNlcidcbiAgICB9XG4pO1xuXG5mdW5jdGlvbiBzZXRDbGFzc2VzKHRyZWUsIGNsYXNzTGlzdCkge1xuICAgIGZvciAodmFyIGogPSAwLCBqbCA9IHRyZWUudHJlZS5sZW5ndGg7IGogPCBqbDsgKytqKSB7XG4gICAgICAgIHRyZWUudHJlZVtqXS5wYXJzZXIuc2V0QXR0cignY2xhc3MnLCBjbGFzc0xpc3QpO1xuICAgIH1cbn1cblxuRm9yVHJlZS5yZWdpc3RlUGFyc2VyKG1vZHVsZS5leHBvcnRzKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdmNvbXBvbmVudC9zcmMvRm9yRGlyZWN0aXZlUGFyc2VyLmpzXG4gKiogbW9kdWxlIGlkID0gMThcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDJcbiAqKi8iLCIvKipcbiAqIEBmaWxlIGZvciDmjIfku6RcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG52YXIgRGlyZWN0aXZlUGFyc2VyID0gcmVxdWlyZSgnLi9EaXJlY3RpdmVQYXJzZXInKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG52YXIgRm9yVHJlZSA9IHJlcXVpcmUoJy4uL3RyZWVzL0ZvclRyZWUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBEaXJlY3RpdmVQYXJzZXIuZXh0ZW5kcyhcbiAgICB7XG5cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIERpcmVjdGl2ZVBhcnNlci5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgICAgICAgICB0aGlzLnN0YXJ0Tm9kZSA9IG9wdGlvbnMuc3RhcnROb2RlO1xuICAgICAgICAgICAgdGhpcy5lbmROb2RlID0gb3B0aW9ucy5lbmROb2RlO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNvbGxlY3RFeHByczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RhcnROb2RlLm5leHRTaWJsaW5nID09PSB0aGlzLmVuZE5vZGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB0cGxTZWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHV0aWxzLnRyYXZlcnNlTm9kZXModGhpcy5zdGFydE5vZGUsIHRoaXMuZW5kTm9kZSwgZnVuY3Rpb24gKGN1ck5vZGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoY3VyTm9kZSA9PT0gdGhpcy5zdGFydE5vZGUgfHwgY3VyTm9kZSA9PT0gdGhpcy5lbmROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0cGxTZWcuYXBwZW5kQ2hpbGQoY3VyTm9kZSk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgICAgIHRoaXMudHBsU2VnID0gdHBsU2VnO1xuXG4gICAgICAgICAgICB0aGlzLmV4cHIgPSB0aGlzLnN0YXJ0Tm9kZS5ub2RlVmFsdWUubWF0Y2godGhpcy5jb25maWcuZ2V0Rm9yRXhwcnNSZWdFeHAoKSlbMV07XG4gICAgICAgICAgICB0aGlzLmV4cHJGbiA9IHV0aWxzLmNyZWF0ZUV4cHJGbih0aGlzLmNvbmZpZy5nZXRFeHByUmVnRXhwKCksIHRoaXMuZXhwciwgdGhpcy5leHByQ2FsY3VsYXRlcik7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUZuID0gY3JlYXRlVXBkYXRlRm4oXG4gICAgICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0Tm9kZS5uZXh0U2libGluZyxcbiAgICAgICAgICAgICAgICB0aGlzLmVuZE5vZGUucHJldmlvdXNTaWJsaW5nLFxuICAgICAgICAgICAgICAgIHRoaXMuY29uZmlnLFxuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnROb2RlLm5vZGVWYWx1ZVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgb25DaGFuZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5leHByKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZXhwclZhbHVlID0gdGhpcy5leHByRm4odGhpcy5zY29wZU1vZGVsKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmRpcnR5Q2hlY2sodGhpcy5leHByLCBleHByVmFsdWUsIHRoaXMuZXhwck9sZFZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlRm4oZXhwclZhbHVlLCB0aGlzLnNjb3BlTW9kZWwpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmV4cHJPbGRWYWx1ZSA9IGV4cHJWYWx1ZTtcblxuICAgICAgICAgICAgRGlyZWN0aXZlUGFyc2VyLnByb3RvdHlwZS5vbkNoYW5nZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHV0aWxzLnRyYXZlcnNlTm9kZXModGhpcy50cGxTZWcuZmlyc3RDaGlsZCwgdGhpcy50cGxTZWcubGFzdENoaWxkLCBmdW5jdGlvbiAoY3VyTm9kZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZW5kTm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShjdXJOb2RlLCB0aGlzLmVuZE5vZGUpO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICAgIHV0aWxzLmVhY2godGhpcy50cmVlcywgZnVuY3Rpb24gKHRyZWUpIHtcbiAgICAgICAgICAgICAgICB0cmVlLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLnRwbFNlZyA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmV4cHIgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5leHByRm4gPSBudWxsO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVGbiA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0Tm9kZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmVuZE5vZGUgPSBudWxsO1xuICAgICAgICAgICAgRGlyZWN0aXZlUGFyc2VyLnByb3RvdHlwZS5kZXN0cm95LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY3JlYXRlVHJlZTogZnVuY3Rpb24gKGNvbmZpZykge1xuICAgICAgICAgICAgdmFyIHBhcnNlciA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgY29weVNlZyA9IHBhcnNlci50cGxTZWcuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICAgICAgdmFyIHN0YXJ0Tm9kZSA9IGNvcHlTZWcuZmlyc3RDaGlsZDtcbiAgICAgICAgICAgIHZhciBlbmROb2RlID0gY29weVNlZy5sYXN0Q2hpbGQ7XG4gICAgICAgICAgICB1dGlscy50cmF2ZXJzZU5vZGVzKHN0YXJ0Tm9kZSwgZW5kTm9kZSwgZnVuY3Rpb24gKGN1ck5vZGUpIHtcbiAgICAgICAgICAgICAgICBwYXJzZXIuZW5kTm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShjdXJOb2RlLCBwYXJzZXIuZW5kTm9kZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIHRyZWUgPSBuZXcgRm9yVHJlZSh7XG4gICAgICAgICAgICAgICAgc3RhcnROb2RlOiBzdGFydE5vZGUsXG4gICAgICAgICAgICAgICAgZW5kTm9kZTogZW5kTm9kZSxcbiAgICAgICAgICAgICAgICBjb25maWc6IGNvbmZpZyxcbiAgICAgICAgICAgICAgICBkb21VcGRhdGVyOiBwYXJzZXIudHJlZS5kb21VcGRhdGVyLFxuICAgICAgICAgICAgICAgIGV4cHJDYWxjdWxhdGVyOiBwYXJzZXIudHJlZS5leHByQ2FsY3VsYXRlclxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0cmVlLnNldFBhcmVudChwYXJzZXIudHJlZSk7XG4gICAgICAgICAgICB0cmVlLnRyYXZlcnNlKCk7XG4gICAgICAgICAgICByZXR1cm4gdHJlZTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgICBpc1Byb3Blck5vZGU6IGZ1bmN0aW9uIChub2RlLCBjb25maWcpIHtcbiAgICAgICAgICAgIHJldHVybiBEaXJlY3RpdmVQYXJzZXIuaXNQcm9wZXJOb2RlKG5vZGUsIGNvbmZpZylcbiAgICAgICAgICAgICAgICAmJiBjb25maWcuZm9yUHJlZml4UmVnRXhwLnRlc3Qobm9kZS5ub2RlVmFsdWUpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZpbmRFbmROb2RlOiBmdW5jdGlvbiAoZm9yU3RhcnROb2RlLCBjb25maWcpIHtcbiAgICAgICAgICAgIHZhciBjdXJOb2RlID0gZm9yU3RhcnROb2RlO1xuICAgICAgICAgICAgd2hpbGUgKChjdXJOb2RlID0gY3VyTm9kZS5uZXh0U2libGluZykpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNGb3JFbmROb2RlKGN1ck5vZGUsIGNvbmZpZykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN1ck5vZGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGdldE5vRW5kTm9kZUVycm9yOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKCd0aGUgYGZvcmAgZGlyZWN0aXZlIGlzIG5vdCBwcm9wZXJseSBlbmRlZCEnKTtcbiAgICAgICAgfSxcblxuICAgICAgICAkbmFtZTogJ0ZvckRpcmVjdGl2ZVBhcnNlcidcbiAgICB9XG4pO1xuXG5Gb3JUcmVlLnJlZ2lzdGVQYXJzZXIobW9kdWxlLmV4cG9ydHMpO1xuXG5mdW5jdGlvbiBpc0ZvckVuZE5vZGUobm9kZSwgY29uZmlnKSB7XG4gICAgcmV0dXJuIG5vZGUubm9kZVR5cGUgPT09IDggJiYgY29uZmlnLmZvckVuZFByZWZpeFJlZ0V4cC50ZXN0KG5vZGUubm9kZVZhbHVlKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlVXBkYXRlRm4ocGFyc2VyLCBzdGFydE5vZGUsIGVuZE5vZGUsIGNvbmZpZywgZnVsbEV4cHIpIHtcbiAgICB2YXIgdHJlZXMgPSBbXTtcbiAgICBwYXJzZXIudHJlZXMgPSB0cmVlcztcbiAgICB2YXIgaXRlbVZhcmlhYmxlTmFtZSA9IGZ1bGxFeHByLm1hdGNoKHBhcnNlci5jb25maWcuZ2V0Rm9ySXRlbVZhbHVlTmFtZVJlZ0V4cCgpKVsxXTtcbiAgICB2YXIgdGFza0lkID0gcGFyc2VyLmRvbVVwZGF0ZXIuZ2VuZXJhdGVUYXNrSWQoKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGV4cHJWYWx1ZSwgc2NvcGVNb2RlbCkge1xuICAgICAgICB2YXIgaW5kZXggPSAwO1xuICAgICAgICBmb3IgKHZhciBrIGluIGV4cHJWYWx1ZSkge1xuICAgICAgICAgICAgaWYgKCF0cmVlc1tpbmRleF0pIHtcbiAgICAgICAgICAgICAgICB0cmVlc1tpbmRleF0gPSBwYXJzZXIuY3JlYXRlVHJlZShjb25maWcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0cmVlc1tpbmRleF0ucmVzdG9yZUZyb21EYXJrKCk7XG4gICAgICAgICAgICB0cmVlc1tpbmRleF0uc2V0RGlydHlDaGVja2VyKHBhcnNlci5kaXJ0eUNoZWNrZXIpO1xuXG4gICAgICAgICAgICB2YXIgbG9jYWwgPSB7XG4gICAgICAgICAgICAgICAga2V5OiBrLFxuICAgICAgICAgICAgICAgIGluZGV4OiBpbmRleFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGxvY2FsW2l0ZW1WYXJpYWJsZU5hbWVdID0gZXhwclZhbHVlW2tdO1xuXG4gICAgICAgICAgICB0cmVlc1tpbmRleF0ucm9vdFNjb3BlLnNldFBhcmVudChzY29wZU1vZGVsKTtcbiAgICAgICAgICAgIHNjb3BlTW9kZWwuYWRkQ2hpbGQodHJlZXNbaW5kZXhdLnJvb3RTY29wZSk7XG5cbiAgICAgICAgICAgIHRyZWVzW2luZGV4XS5zZXREYXRhKGxvY2FsKTtcblxuICAgICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgfVxuXG4gICAgICAgIHBhcnNlci5kb21VcGRhdGVyLmFkZFRhc2tGbih0YXNrSWQsIHV0aWxzLmJpbmQoZnVuY3Rpb24gKHRyZWVzLCBpbmRleCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IGluZGV4LCBpbCA9IHRyZWVzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0cmVlc1tpXS5nb0RhcmsoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgbnVsbCwgdHJlZXMsIGluZGV4KSk7XG4gICAgfTtcbn1cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdnRwbC9zcmMvcGFyc2Vycy9Gb3JEaXJlY3RpdmVQYXJzZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAxOVxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMlxuICoqLyIsIi8qKlxuICogQGZpbGUgZm9y5oyH5Luk5Lit55So5Yiw55qEXG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20pXG4gKi9cblxudmFyIFRyZWUgPSByZXF1aXJlKCcuL1RyZWUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBUcmVlLmV4dGVuZHMoXG4gICAge1xuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgaWYgKCFvcHRpb25zLmNvbmZpZ1xuICAgICAgICAgICAgICAgIHx8ICFvcHRpb25zLmRvbVVwZGF0ZXJcbiAgICAgICAgICAgICAgICB8fCAhb3B0aW9ucy5leHByQ2FsY3VsYXRlclxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd3cm9uZyBhcmd1bWVudHMnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgVHJlZS5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICAgICRuYW1lOiAnRm9yVHJlZSdcbiAgICB9XG4pO1xuXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Z0cGwvc3JjL3RyZWVzL0ZvclRyZWUuanNcbiAqKiBtb2R1bGUgaWQgPSAyMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMlxuICoqLyIsIi8qKlxuICogQGZpbGUg5aKe5by65LiA5LiLdnRwbOS4reeahGlm5oyH5LukXG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20pXG4gKi9cblxudmFyIElmRGlyZWN0aXZlUGFyc2VyID0gcmVxdWlyZSgndnRwbC9zcmMvcGFyc2Vycy9JZkRpcmVjdGl2ZVBhcnNlcicpO1xudmFyIFRyZWUgPSByZXF1aXJlKCd2dHBsL3NyYy90cmVlcy9UcmVlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gSWZEaXJlY3RpdmVQYXJzZXIuZXh0ZW5kcyhcbiAgICB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOe7mWlm5oyH5Luk5omA566h55CG55qE5omA5pyJ6IqC54K56K6+572uY3Nz57G7XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwdWJsaWNcbiAgICAgICAgICogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gY2xhc3NMaXN0IGNzc+exu+aVsOe7hFxuICAgICAgICAgKi9cbiAgICAgICAgc2V0Q3NzQ2xhc3M6IGZ1bmN0aW9uIChjbGFzc0xpc3QpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IHRoaXMuYnJhbmNoZXMubGVuZ3RoOyBpIDwgaWw7ICsraSkge1xuICAgICAgICAgICAgICAgIHZhciBicmFuY2ggPSB0aGlzLmJyYW5jaGVzW2ldO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwLCBqbCA9IGJyYW5jaC5sZW5ndGg7IGogPiBqbDsgKytqKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyYW5jaC5zZXRDc3NDbGFzcyhjbGFzc0xpc3QpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBzZXRBdHRyOiBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmIChuYW1lID09PSAnY2xhc3MnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRDc3NDbGFzcyh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgJG5hbWU6ICdJZkRpcmVjdGl2ZVBhcnNlcidcbiAgICB9XG4pO1xuXG5UcmVlLnJlZ2lzdGVQYXJzZXIobW9kdWxlLmV4cG9ydHMpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92Y29tcG9uZW50L3NyYy9JZkRpcmVjdGl2ZVBhcnNlci5qc1xuICoqIG1vZHVsZSBpZCA9IDIxXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyXG4gKiovIiwiLyoqXG4gKiBAZmlsZSBpZiDmjIfku6RcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG52YXIgRGlyZWN0aXZlUGFyc2VyID0gcmVxdWlyZSgnLi9EaXJlY3RpdmVQYXJzZXInKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG52YXIgVHJlZSA9IHJlcXVpcmUoJy4uL3RyZWVzL1RyZWUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBEaXJlY3RpdmVQYXJzZXIuZXh0ZW5kcyhcbiAgICB7XG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgICBEaXJlY3RpdmVQYXJzZXIucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgICAgICAgICAgdGhpcy5zdGFydE5vZGUgPSBvcHRpb25zLnN0YXJ0Tm9kZTtcbiAgICAgICAgICAgIHRoaXMuZW5kTm9kZSA9IG9wdGlvbnMuZW5kTm9kZTtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnID0gb3B0aW9ucy5jb25maWc7XG5cbiAgICAgICAgICAgIHRoaXMuZXhwcnMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuZXhwckZucyA9IHt9O1xuXG4gICAgICAgICAgICB0aGlzLmhhbmRsZUJyYW5jaGVzVGFza0lkID0gdGhpcy5kb21VcGRhdGVyLmdlbmVyYXRlVGFza0lkKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY29sbGVjdEV4cHJzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYnJhbmNoZXMgPSBbXTtcbiAgICAgICAgICAgIHZhciBicmFuY2hJbmRleCA9IC0xO1xuXG4gICAgICAgICAgICB1dGlscy50cmF2ZXJzZU5vZGVzKHRoaXMuc3RhcnROb2RlLCB0aGlzLmVuZE5vZGUsIGZ1bmN0aW9uIChjdXJOb2RlKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5vZGVUeXBlID0gZ2V0SWZOb2RlVHlwZShjdXJOb2RlLCB0aGlzLmNvbmZpZyk7XG5cbiAgICAgICAgICAgICAgICBpZiAobm9kZVR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0RW5kTm9kZShjdXJOb2RlLCBicmFuY2hlcywgYnJhbmNoSW5kZXgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGJyYW5jaEluZGV4Kys7XG4gICAgICAgICAgICAgICAgICAgIGJyYW5jaGVzW2JyYW5jaEluZGV4XSA9IGJyYW5jaGVzW2JyYW5jaEluZGV4XSB8fCB7fTtcblxuICAgICAgICAgICAgICAgICAgICAvLyDmmK8gaWYg6IqC54K55oiW6ICFIGVsaWYg6IqC54K577yM5pCc6ZuG6KGo6L6+5byPXG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlVHlwZSA8IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBleHByID0gY3VyTm9kZS5ub2RlVmFsdWUucmVwbGFjZSh0aGlzLmNvbmZpZy5nZXRBbGxJZlJlZ0V4cCgpLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmV4cHJzLnB1c2goZXhwcik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5leHByRm5zW2V4cHJdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5leHByRm5zW2V4cHJdID0gdXRpbHMuY3JlYXRlRXhwckZuKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZy5nZXRFeHByUmVnRXhwKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cHIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXhwckNhbGN1bGF0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKG5vZGVUeXBlID09PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhc0Vsc2VCcmFuY2ggPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWJyYW5jaGVzW2JyYW5jaEluZGV4XS5zdGFydE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyYW5jaGVzW2JyYW5jaEluZGV4XS5zdGFydE5vZGUgPSBjdXJOb2RlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY3VyTm9kZSA9IGN1ck5vZGUubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgaWYgKCFjdXJOb2RlIHx8IGN1ck5vZGUgPT09IHRoaXMuZW5kTm9kZSkge1xuICAgICAgICAgICAgICAgICAgICBzZXRFbmROb2RlKGN1ck5vZGUsIGJyYW5jaGVzLCBicmFuY2hJbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgICAgICB0aGlzLmJyYW5jaGVzID0gYnJhbmNoZXM7XG4gICAgICAgICAgICByZXR1cm4gYnJhbmNoZXM7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHNldEVuZE5vZGUoY3VyTm9kZSwgYnJhbmNoZXMsIGJyYW5jaEluZGV4KSB7XG4gICAgICAgICAgICAgICAgaWYgKGJyYW5jaEluZGV4ICsgMSAmJiBicmFuY2hlc1ticmFuY2hJbmRleF0uc3RhcnROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyYW5jaGVzW2JyYW5jaEluZGV4XS5lbmROb2RlID0gY3VyTm9kZS5wcmV2aW91c1NpYmxpbmc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIG9uQ2hhbmdlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZXhwcnMgPSB0aGlzLmV4cHJzO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlsID0gZXhwcnMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBleHByID0gZXhwcnNbaV07XG4gICAgICAgICAgICAgICAgdmFyIGV4cHJWYWx1ZSA9IHRoaXMuZXhwckZuc1tleHByXSh0aGlzLnNjb3BlTW9kZWwpO1xuICAgICAgICAgICAgICAgIGlmIChleHByVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kb21VcGRhdGVyLmFkZFRhc2tGbihcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlQnJhbmNoZXNUYXNrSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB1dGlscy5iaW5kKGhhbmRsZUJyYW5jaGVzLCBudWxsLCB0aGlzLmJyYW5jaGVzLCBpKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNFbHNlQnJhbmNoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kb21VcGRhdGVyLmFkZFRhc2tGbihcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVCcmFuY2hlc1Rhc2tJZCxcbiAgICAgICAgICAgICAgICAgICAgdXRpbHMuYmluZChoYW5kbGVCcmFuY2hlcywgbnVsbCwgdGhpcy5icmFuY2hlcywgaSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0Tm9kZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmVuZE5vZGUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5jb25maWcgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5leHBycyA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmV4cHJGbnMgPSBudWxsO1xuXG4gICAgICAgICAgICBEaXJlY3RpdmVQYXJzZXIucHJvdG90eXBlLmRlc3Ryb3kuY2FsbCh0aGlzKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgICBpc1Byb3Blck5vZGU6IGZ1bmN0aW9uIChub2RlLCBjb25maWcpIHtcbiAgICAgICAgICAgIHJldHVybiBnZXRJZk5vZGVUeXBlKG5vZGUsIGNvbmZpZykgPT09IDE7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZmluZEVuZE5vZGU6IGZ1bmN0aW9uIChpZlN0YXJ0Tm9kZSwgY29uZmlnKSB7XG4gICAgICAgICAgICB2YXIgY3VyTm9kZSA9IGlmU3RhcnROb2RlO1xuICAgICAgICAgICAgd2hpbGUgKChjdXJOb2RlID0gY3VyTm9kZS5uZXh0U2libGluZykpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNJZkVuZE5vZGUoY3VyTm9kZSwgY29uZmlnKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3VyTm9kZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0Tm9FbmROb2RlRXJyb3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoJ3RoZSBpZiBkaXJlY3RpdmUgaXMgbm90IHByb3Blcmx5IGVuZGVkIScpO1xuICAgICAgICB9LFxuXG4gICAgICAgICRuYW1lOiAnSWZEaXJlY3RpdmVQYXJzZXInXG4gICAgfVxuKTtcblxuVHJlZS5yZWdpc3RlUGFyc2VyKG1vZHVsZS5leHBvcnRzKTtcblxuZnVuY3Rpb24gaGFuZGxlQnJhbmNoZXMoYnJhbmNoZXMsIHNob3dJbmRleCkge1xuICAgIHV0aWxzLmVhY2goYnJhbmNoZXMsIGZ1bmN0aW9uIChicmFuY2gsIGopIHtcbiAgICAgICAgdmFyIGZuID0gaiA9PT0gc2hvd0luZGV4ID8gJ3Jlc3RvcmVGcm9tRGFyaycgOiAnZ29EYXJrJztcbiAgICAgICAgdXRpbHMuZWFjaChicmFuY2gsIGZ1bmN0aW9uIChwYXJzZXJPYmopIHtcbiAgICAgICAgICAgIHBhcnNlck9iai5wYXJzZXJbZm5dKCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBpc0lmRW5kTm9kZShub2RlLCBjb25maWcpIHtcbiAgICByZXR1cm4gZ2V0SWZOb2RlVHlwZShub2RlLCBjb25maWcpID09PSA0O1xufVxuXG5mdW5jdGlvbiBnZXRJZk5vZGVUeXBlKG5vZGUsIGNvbmZpZykge1xuICAgIGlmIChub2RlLm5vZGVUeXBlICE9PSA4KSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLmlmUHJlZml4UmVnRXhwLnRlc3Qobm9kZS5ub2RlVmFsdWUpKSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgIH1cblxuICAgIGlmIChjb25maWcuZWxpZlByZWZpeFJlZ0V4cC50ZXN0KG5vZGUubm9kZVZhbHVlKSkge1xuICAgICAgICByZXR1cm4gMjtcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLmVsc2VQcmVmaXhSZWdFeHAudGVzdChub2RlLm5vZGVWYWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIDM7XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5pZkVuZFByZWZpeFJlZ0V4cC50ZXN0KG5vZGUubm9kZVZhbHVlKSkge1xuICAgICAgICByZXR1cm4gNDtcbiAgICB9XG59XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Z0cGwvc3JjL3BhcnNlcnMvSWZEaXJlY3RpdmVQYXJzZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAyMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMlxuICoqLyIsIi8qKlxuICogQGZpbGUg57uE5Lu26Kej5p6Q5ZmoXG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20pXG4gKi9cblxudmFyIEV2ZW50RXhwclBhcnNlciA9IHJlcXVpcmUoJ3Z0cGwvc3JjL3BhcnNlcnMvRXZlbnRFeHByUGFyc2VyJyk7XG52YXIgVHJlZSA9IHJlcXVpcmUoJ3Z0cGwvc3JjL3RyZWVzL1RyZWUnKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJ3Z0cGwvc3JjL3V0aWxzJyk7XG52YXIgQ29tcG9uZW50VHJlZSA9IHJlcXVpcmUoJy4vQ29tcG9uZW50VHJlZScpO1xudmFyIENvbXBvbmVudENoaWxkcmVuID0gcmVxdWlyZSgnLi9Db21wb25lbnRDaGlsZHJlbicpO1xudmFyIENvbXBvbmVudE1hbmFnZXIgPSByZXF1aXJlKCcuL0NvbXBvbmVudE1hbmFnZXInKTtcbnZhciBEb21VcGRhdGVyID0gcmVxdWlyZSgndnRwbC9zcmMvRG9tVXBkYXRlcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RXhwclBhcnNlci5leHRlbmRzKFxuICAgIHtcblxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgRXZlbnRFeHByUGFyc2VyLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudE1hbmFnZXIgPSB0aGlzLnRyZWUuZ2V0VHJlZVZhcignY29tcG9uZW50TWFuYWdlcicpO1xuICAgICAgICAgICAgdGhpcy5pc0NvbXBvbmVudCA9IHRoaXMubm9kZS5ub2RlVHlwZSA9PT0gMVxuICAgICAgICAgICAgICAgICYmIHRoaXMubm9kZS50YWdOYW1lLnRvTG93ZXJDYXNlKCkuaW5kZXhPZigndWktJykgPT09IDA7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmlzQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbXBvbmVudE5hbWUgPSB1dGlscy5saW5lMmNhbWVsKHRoaXMubm9kZS50YWdOYW1lLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgndWknLCAnJykpO1xuXG4gICAgICAgICAgICAgICAgdmFyIENvbXBvbmVudENsYXNzID0gdGhpcy5jb21wb25lbnRNYW5hZ2VyLmdldENsYXNzKGNvbXBvbmVudE5hbWUpO1xuICAgICAgICAgICAgICAgIGlmICghQ29tcG9uZW50Q2xhc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd0aGUgY29tcG9uZW50IGAnICsgY29tcG9uZW50TmFtZSArICdgIGlzIG5vdCByZWdpc3RlZCEnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8g57uE5Lu25pys6Lqr5bCx5bqU6K+l5pyJ55qEY3Nz57G75ZCNXG4gICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnRPcmlnaW5Dc3NDbGFzc0xpc3QgPSBDb21wb25lbnRNYW5hZ2VyLmdldENzc0NsYXNzTmFtZShDb21wb25lbnRDbGFzcyk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudCA9IG5ldyBDb21wb25lbnRDbGFzcygpO1xuICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50LnBhcnNlciA9IHRoaXM7XG5cbiAgICAgICAgICAgICAgICB0aGlzLm1vdW50KG9wdGlvbnMudHJlZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgY29sbGVjdEV4cHJzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0NvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY29sbGVjdENvbXBvbmVudEV4cHJzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBFdmVudEV4cHJQYXJzZXIucHJvdG90eXBlLmNvbGxlY3RFeHBycy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIG1vdW50OiBmdW5jdGlvbiAocGFyZW50VHJlZSkge1xuICAgICAgICAgICAgdGhpcy5jb21wb25lbnQuY29tcG9uZW50V2lsbE1vdW50KCk7XG5cbiAgICAgICAgICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGRpdi5pbm5lckhUTUwgPSB0aGlzLmNvbXBvbmVudC50cGw7XG4gICAgICAgICAgICB2YXIgc3RhcnROb2RlID0gZGl2LmZpcnN0Q2hpbGQ7XG4gICAgICAgICAgICB2YXIgZW5kTm9kZSA9IGRpdi5sYXN0Q2hpbGQ7XG5cbiAgICAgICAgICAgIHRoaXMuc3RhcnROb2RlID0gc3RhcnROb2RlO1xuICAgICAgICAgICAgdGhpcy5lbmROb2RlID0gZW5kTm9kZTtcblxuICAgICAgICAgICAgLy8g57uE5Lu255qE5L2c55So5Z+f5piv5ZKM5aSW6YOo55qE5L2c55So5Z+f6ZqU5byA55qEXG4gICAgICAgICAgICB0aGlzLnRyZWUgPSBuZXcgQ29tcG9uZW50VHJlZSh7XG4gICAgICAgICAgICAgICAgc3RhcnROb2RlOiBzdGFydE5vZGUsXG4gICAgICAgICAgICAgICAgZW5kTm9kZTogZW5kTm9kZSxcbiAgICAgICAgICAgICAgICBjb25maWc6IHBhcmVudFRyZWUuY29uZmlnLFxuICAgICAgICAgICAgICAgIGRvbVVwZGF0ZXI6IHBhcmVudFRyZWUuZG9tVXBkYXRlcixcbiAgICAgICAgICAgICAgICBleHByQ2FsY3VsYXRlcjogcGFyZW50VHJlZS5leHByQ2FsY3VsYXRlcixcblxuICAgICAgICAgICAgICAgIC8vIGNvbXBvbmVudENoaWxkcmVu5LiN6IO95Lyg57uZ5a2Q57qn57uE5Lu25qCR77yM5Y+v5Lul5Lyg57uZ5a2Q57qnZm9y5qCR44CCXG4gICAgICAgICAgICAgICAgY29tcG9uZW50Q2hpbGRyZW46IG5ldyBDb21wb25lbnRDaGlsZHJlbihcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLmZpcnN0Q2hpbGQsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS5sYXN0Q2hpbGQsXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudFRyZWUucm9vdFNjb3BlXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMudHJlZS5zZXRQYXJlbnQocGFyZW50VHJlZSk7XG5cbiAgICAgICAgICAgIHRoaXMudHJlZS5yZWdpc3RlQ29tcG9uZW50cyh0aGlzLmNvbXBvbmVudC5jb21wb25lbnRDbGFzc2VzKTtcblxuICAgICAgICAgICAgaW5zZXJ0Q29tcG9uZW50Tm9kZXModGhpcy5ub2RlLCBzdGFydE5vZGUsIGVuZE5vZGUpO1xuXG4gICAgICAgICAgICB0aGlzLnRyZWUudHJhdmVyc2UoKTtcblxuICAgICAgICAgICAgLy8g5oqK57uE5Lu26IqC54K55pS+5YiwIERPTSDmoJHkuK3ljrtcbiAgICAgICAgICAgIGZ1bmN0aW9uIGluc2VydENvbXBvbmVudE5vZGVzKGNvbXBvbmVudE5vZGUsIHN0YXJ0Tm9kZSwgZW5kTm9kZSkge1xuICAgICAgICAgICAgICAgIHZhciBwYXJlbnROb2RlID0gY29tcG9uZW50Tm9kZS5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgIHV0aWxzLnRyYXZlcnNlTm9kZXMoXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0Tm9kZSxcbiAgICAgICAgICAgICAgICAgICAgZW5kTm9kZSxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGN1ck5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGN1ck5vZGUsIGNvbXBvbmVudE5vZGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlLnJlbW92ZUNoaWxkKGNvbXBvbmVudE5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDorr7nva7lvZPliY3oioLngrnmiJbogIXnu4Tku7bnmoTlsZ7mgKdcbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSDlsZ7mgKflkI1cbiAgICAgICAgICogQHBhcmFtIHsqfSB2YWx1ZSDlsZ7mgKflgLxcbiAgICAgICAgICovXG4gICAgICAgIHNldEF0dHI6IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKG5hbWUgPT09ICdyZWYnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kJHJlZiA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuaXNDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAobmFtZSA9PT0gJ2NsYXNzJykge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMuY29tcG9uZW50T3JpZ2luQ3NzQ2xhc3NMaXN0LmNvbmNhdChEb21VcGRhdGVyLmdldENsYXNzTGlzdCh2YWx1ZSkpO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IHRoaXMudHJlZS50cmVlLmxlbmd0aDsgaSA8IGlsOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwYXJzZXJPYmogPSB0aGlzLnRyZWUudHJlZVtpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlck9iai5wYXJzZXIuc2V0QXR0ciAmJiBwYXJzZXJPYmoucGFyc2VyLnNldEF0dHIoJ2NsYXNzJywgRG9tVXBkYXRlci5nZXRDbGFzc0xpc3QodmFsdWUpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBzY29wZSA9IHRoaXMudHJlZS5yb290U2NvcGU7XG4gICAgICAgICAgICAgICAgc2NvcGUuc2V0KG5hbWUsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIEV2ZW50RXhwclBhcnNlci5wcm90b3R5cGUuc2V0QXR0ci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5blsZ7mgKdcbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IG5hbWUg5bGe5oCn5ZCNXG4gICAgICAgICAqIEByZXR1cm4geyp9ICAgICAg5bGe5oCn5YC8XG4gICAgICAgICAqL1xuICAgICAgICBnZXRBdHRyOiBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50cmVlLnJvb3RTY29wZS5nZXQobmFtZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBFdmVudEV4cHJQYXJzZXIucHJvdG90eXBlLmdldEF0dHIodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBjb2xsZWN0Q29tcG9uZW50RXhwcnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjdXJOb2RlID0gdGhpcy5ub2RlO1xuXG4gICAgICAgICAgICB2YXIgYXR0cmlidXRlcyA9IGN1ck5vZGUuYXR0cmlidXRlcztcbiAgICAgICAgICAgIC8vIOaQnOmbhuS4jeWQq+acieihqOi+vuW8j+eahOWxnuaAp++8jOeEtuWQjuWcqOe7hOS7tuexu+WIm+W7uuWlveS5i+WQjuiuvue9rui/m+e7hOS7tlxuICAgICAgICAgICAgdGhpcy5zZXRMaXRlcmFsQXR0cnNGbnMgPSBbXTtcblxuICAgICAgICAgICAgLy8g5piv5ZCm5a2Y5ZyoY3Nz57G75ZCN55qE6K6+572u5Ye95pWwXG4gICAgICAgICAgICB2YXIgaGFzQ2xhc3MgPSBmYWxzZTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IGF0dHJpYnV0ZXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBhdHRyID0gYXR0cmlidXRlc1tpXTtcbiAgICAgICAgICAgICAgICBoYXNDbGFzcyA9IGF0dHIubm9kZU5hbWUgPT09ICdjbGFzcy1saXN0JztcblxuICAgICAgICAgICAgICAgIHZhciBleHByID0gYXR0ci5ub2RlVmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY29uZmlnLmdldEV4cHJSZWdFeHAoKS50ZXN0KGV4cHIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXhwcnMucHVzaChleHByKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmV4cHJGbnNbZXhwcl0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByYXdFeHByID0gZ2V0UmF3RXhwcihleHByLCB0aGlzLmNvbmZpZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmV4cHJDYWxjdWxhdGVyLmNyZWF0ZUV4cHJGbihyYXdFeHByKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXhwckZuc1tleHByXSA9IHV0aWxzLmJpbmQoY2FsY3VsYXRlRXhwciwgbnVsbCwgcmF3RXhwciwgdGhpcy5leHByQ2FsY3VsYXRlcik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlRm5zW2V4cHJdID0gdGhpcy51cGRhdGVGbnNbZXhwcl0gfHwgW107XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUZuc1tleHByXS5wdXNoKHV0aWxzLmJpbmQoc2V0QXR0ckZuLCB0aGlzLCBhdHRyLm5vZGVOYW1lKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0TGl0ZXJhbEF0dHJzRm5zLnB1c2goXG4gICAgICAgICAgICAgICAgICAgICAgICB1dGlscy5iaW5kKHNldEF0dHJGbiwgdGhpcywgYXR0ci5ub2RlTmFtZSwgYXR0ci5ub2RlVmFsdWUsIHRydWUpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWhhc0NsYXNzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRMaXRlcmFsQXR0cnNGbnMucHVzaChcbiAgICAgICAgICAgICAgICAgICAgdXRpbHMuYmluZChzZXRBdHRyRm4sIHRoaXMsICdjbGFzcycsIFtdKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOiuvue9rue7hOS7tuWxnuaAp+OAglxuICAgICAgICAgICAgICog55Sx5LqOSFRNTOagh+etvuS4reS4jeiDveWGmempvOWzsOW9ouW8j+eahOWxnuaAp+WQje+8jFxuICAgICAgICAgICAgICog5omA5Lul5q2k5aSE5Lya5bCG5Lit5qiq57q/5b2i5byP55qE5bGe5oCn6L2s5o2i5oiQ6am85bOw5b2i5byP44CCXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQGlubmVyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAgICAgIOWxnuaAp+WQjVxuICAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlICAgICDlsZ7mgKflgLxcbiAgICAgICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNMaXRlcmFsIOaYr+WQpuaYr+W4uOmHj+WxnuaAp1xuICAgICAgICAgICAgICogQHBhcmFtIHtDb21wb25lbnR9IGNvbXBvbmVudCDnu4Tku7ZcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZnVuY3Rpb24gc2V0QXR0ckZuKG5hbWUsIHZhbHVlLCBpc0xpdGVyYWwpIHtcbiAgICAgICAgICAgICAgICBuYW1lID0gdXRpbHMubGluZTJjYW1lbChuYW1lKTtcbiAgICAgICAgICAgICAgICBpZiAobmFtZSA9PT0gJ2NsYXNzJykge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMuY29tcG9uZW50T3JpZ2luQ3NzQ2xhc3NMaXN0LmNvbmNhdChEb21VcGRhdGVyLmdldENsYXNzTGlzdCh2YWx1ZSkpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNMaXRlcmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudE9yaWdpbkNzc0NsYXNzTGlzdCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuc2V0QXR0cihuYW1lLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZUV4cHIocmF3RXhwciwgZXhwckNhbGN1bGF0ZXIsIHNjb3BlTW9kZWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZXhwckNhbGN1bGF0ZXIuY2FsY3VsYXRlKHJhd0V4cHIsIGZhbHNlLCBzY29wZU1vZGVsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0UmF3RXhwcihleHByLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZXhwci5yZXBsYWNlKGNvbmZpZy5nZXRFeHByUmVnRXhwKCksIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFyZ3VtZW50c1sxXTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6I635Y+W5byA5aeL6IqC54K5XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICogQGluaGVyaXREb2NcbiAgICAgICAgICogQHJldHVybiB7Tm9kZX1cbiAgICAgICAgICovXG4gICAgICAgIGdldFN0YXJ0Tm9kZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zdGFydE5vZGU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBFdmVudEV4cHJQYXJzZXIucHJvdG90eXBlLmdldFN0YXJ0Tm9kZS5jYWxsKHRoaXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5bnu5PmnZ/oioLngrlcbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKiBAaW5oZXJpdERvY1xuICAgICAgICAgKiBAcmV0dXJuIHtOb2RlfVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0RW5kTm9kZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5lbmROb2RlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gRXZlbnRFeHByUGFyc2VyLnByb3RvdHlwZS5nZXRFbmROb2RlLmNhbGwodGhpcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0U2NvcGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuc2NvcGVNb2RlbCA9IHRoaXMudHJlZS5yb290U2NvcGU7XG4gICAgICAgICAgICBFdmVudEV4cHJQYXJzZXIucHJvdG90eXBlLnNldFNjb3BlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmlzQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlsID0gdGhpcy5zZXRMaXRlcmFsQXR0cnNGbnMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldExpdGVyYWxBdHRyc0Zuc1tpXSh0aGlzLmNvbXBvbmVudCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnQuY29tcG9uZW50RGlkTW91bnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBnZXRTY29wZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudHJlZS5yb290U2NvcGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gc2NvcGVNb2RlbOmHjOmdoueahOWAvOWPkeeUn+S6huWPmOWMllxuICAgICAgICBvbkNoYW5nZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNHb0RhcmspIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmlzQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgdmFyIGV4cHJzID0gdGhpcy5leHBycztcbiAgICAgICAgICAgICAgICB2YXIgZXhwck9sZFZhbHVlcyA9IHRoaXMuZXhwck9sZFZhbHVlcztcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaWwgPSBleHBycy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBleHByID0gZXhwcnNbaV07XG4gICAgICAgICAgICAgICAgICAgIHZhciBleHByVmFsdWUgPSB0aGlzLmV4cHJGbnNbZXhwcl0odGhpcy5zY29wZU1vZGVsKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kaXJ0eUNoZWNrKGV4cHIsIGV4cHJWYWx1ZSwgZXhwck9sZFZhbHVlc1tleHByXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB1cGRhdGVGbnMgPSB0aGlzLnVwZGF0ZUZuc1tleHByXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwLCBqbCA9IHVwZGF0ZUZucy5sZW5ndGg7IGogPCBqbDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlRm5zW2pdKGV4cHJWYWx1ZSwgdGhpcy5jb21wb25lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgZXhwck9sZFZhbHVlc1tleHByXSA9IGV4cHJWYWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBFdmVudEV4cHJQYXJzZXIucHJvdG90eXBlLm9uQ2hhbmdlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ29EYXJrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudHMgJiYgdGhpcy5jb21wb25lbnQuZ29EYXJrKCk7XG4gICAgICAgICAgICBFdmVudEV4cHJQYXJzZXIucHJvdG90eXBlLmdvRGFyay5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlc3RvcmVGcm9tRGFyazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzICYmIHRoaXMuY29tcG9uZW50LnJlc3RvcmVGcm9tRGFyaygpO1xuICAgICAgICAgICAgRXZlbnRFeHByUGFyc2VyLnByb3RvdHlwZS5yZXN0b3JlRnJvbURhcmsuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICByZWY6IGZ1bmN0aW9uIChyZWYpIHtcbiAgICAgICAgICAgIHZhciBwYXJzZXJUcmVlID0gdGhpcy50cmVlLnRyZWU7XG5cbiAgICAgICAgICAgIHZhciByZXQ7XG4gICAgICAgICAgICB0aGlzLndhbGsocGFyc2VyVHJlZSwgZnVuY3Rpb24gKHBhcnNlcikge1xuICAgICAgICAgICAgICAgIGlmIChwYXJzZXIuaXNDb21wb25lbnQgJiYgcGFyc2VyLiQkcmVmID09PSByZWYpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcGFyc2VyLmNvbXBvbmVudDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9LFxuXG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50LmNvbXBvbmVudFdpbGxVbm1vdW50KCk7XG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudC5kZXN0cm95KCk7XG4gICAgICAgICAgICBFdmVudEV4cHJQYXJzZXIucHJvdG90eXBlLmRlc3Ryb3kuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6YGN5Y6GcGFyc2VyVHJlZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAcGFyYW0gIHtUcmVlfSBwYXJzZXJUcmVlIOagkVxuICAgICAgICAgKiBAcGFyYW0gIHtmdW5jdGlvbihQYXJzZXIpOmJvb2xlYW59IGl0ZXJhdGVyRm4g6L+t5Luj5Ye95pWwXG4gICAgICAgICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAgICAgICAqL1xuICAgICAgICB3YWxrOiBmdW5jdGlvbiAocGFyc2VyVHJlZSwgaXRlcmF0ZXJGbikge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlsID0gcGFyc2VyVHJlZS5sZW5ndGg7IGkgPCBpbDsgKytpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhcnNlck9iaiA9IHBhcnNlclRyZWVbaV07XG5cbiAgICAgICAgICAgICAgICAvLyDpkojlr7lpZuaMh+S7pOeahOaDheWGtVxuICAgICAgICAgICAgICAgIGlmICh1dGlscy5pc0FycmF5KHBhcnNlck9iaikpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMud2FsayhwYXJzZXJPYmosIGl0ZXJhdGVyRm4pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyDpkojlr7lmb3LmjIfku6TnmoTmg4XlhrVcbiAgICAgICAgICAgICAgICBpZiAodXRpbHMuaXNBcnJheShwYXJzZXJPYmoudHJlZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwLCBqbCA9IHBhcnNlck9iai50cmVlcy5sZW5ndGg7IGogPCBqbDsgKytqKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy53YWxrKHBhcnNlck9iai50cmVlc1tqXS50cmVlLCBpdGVyYXRlckZuKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChpdGVyYXRlckZuKHBhcnNlck9iai5wYXJzZXIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChwYXJzZXJPYmouY2hpbGRyZW4gJiYgcGFyc2VyT2JqLmNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy53YWxrKHBhcnNlck9iai5jaGlsZHJlbiwgaXRlcmF0ZXJGbikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICAgICRuYW1lOiAnQ29tcG9uZW50UGFyc2VyJ1xuICAgIH1cbik7XG5cblRyZWUucmVnaXN0ZVBhcnNlcihtb2R1bGUuZXhwb3J0cyk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Zjb21wb25lbnQvc3JjL0NvbXBvbmVudFBhcnNlci5qc1xuICoqIG1vZHVsZSBpZCA9IDIzXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyXG4gKiovIiwiLyoqXG4gKiBAZmlsZSDlpITnkIbkuobkuovku7bnmoQgRXhwclBhcnNlclxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbnZhciBFeHByUGFyc2VyID0gcmVxdWlyZSgnLi9FeHByUGFyc2VyJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xudmFyIFRyZWUgPSByZXF1aXJlKCcuLi90cmVlcy9UcmVlJyk7XG52YXIgU2NvcGVNb2RlbCA9IHJlcXVpcmUoJy4uL1Njb3BlTW9kZWwnKTtcbnZhciBEb21VcGRhdGVyID0gcmVxdWlyZSgnLi4vRG9tVXBkYXRlcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEV4cHJQYXJzZXIuZXh0ZW5kcyhcbiAgICB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWIneWni+WMllxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICAqL1xuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBFeHByUGFyc2VyLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgICAgIHRoaXMuZXZlbnRzID0ge307XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOa3u+WKoOihqOi+vuW8j1xuICAgICAgICAgKlxuICAgICAgICAgKiBAaW5oZXJpdFxuICAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICAqIEBwYXJhbSB7QXR0cn0gYXR0ciDlpoLmnpzlvZPliY3mmK/lhYPntKDoioLngrnvvIzliJnopoHkvKDlhaXpgY3ljobliLDnmoTlsZ7mgKfvvIxcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgIOaJgOS7pWF0dHLlrZjlnKjkuI7lkKbmmK/liKTmlq3lvZPliY3lhYPntKDmmK/lkKbmmK/mlofmnKzoioLngrnnmoTkuIDkuKrkvp3mja5cbiAgICAgICAgICogQHJldHVybiB7dW5kZWZpbmVkfVxuICAgICAgICAgKi9cbiAgICAgICAgYWRkRXhwcjogZnVuY3Rpb24gKGF0dHIpIHtcbiAgICAgICAgICAgIGlmICghYXR0cikge1xuICAgICAgICAgICAgICAgIHJldHVybiBFeHByUGFyc2VyLnByb3RvdHlwZS5hZGRFeHByLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBldmVudE5hbWUgPSBnZXRFdmVudE5hbWUoYXR0ci5uYW1lLCB0aGlzLmNvbmZpZyk7XG4gICAgICAgICAgICBpZiAoIWV2ZW50TmFtZSAmJiBEb21VcGRhdGVyLmlzRXZlbnROYW1lKGF0dHIubmFtZSkpIHtcbiAgICAgICAgICAgICAgICBldmVudE5hbWUgPSBhdHRyLm5hbWUucmVwbGFjZSgnb24nLCAnJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZXZlbnROYW1lKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY29uZmlnLmdldEV4cHJSZWdFeHAoKS50ZXN0KGF0dHIudmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0gPSBhdHRyLnZhbHVlO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBleHByID0gYXR0ci52YWx1ZS5yZXBsYWNlKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25maWcuZ2V0RXhwclJlZ0V4cCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhcmd1bWVudHNbMV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXhwckNhbGN1bGF0ZXIuY3JlYXRlRXhwckZuKGV4cHIsIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XG5cbiAgICAgICAgICAgICAgICAgICAgRG9tVXBkYXRlci5zZXRBdHRyKHRoaXMubm9kZSwgJ29uJyArIGV2ZW50TmFtZSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbG9jYWxTY29wZSA9IG5ldyBTY29wZU1vZGVsKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhbFNjb3BlLnNldCgnZXZlbnQnLCBldmVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhbFNjb3BlLnNldFBhcmVudChtZS5nZXRTY29wZSgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lLmV4cHJDYWxjdWxhdGVyLmNhbGN1bGF0ZShleHByLCB0cnVlLCBsb2NhbFNjb3BlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgRXhwclBhcnNlci5wcm90b3R5cGUuYWRkRXhwci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDplIDmr4FcbiAgICAgICAgICpcbiAgICAgICAgICogQGluaGVyaXRcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKi9cbiAgICAgICAgZGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdXRpbHMuZWFjaCh0aGlzLmV2ZW50cywgZnVuY3Rpb24gKGF0dHJWYWx1ZSwgZXZlbnROYW1lKSB7XG4gICAgICAgICAgICAgICAgRG9tVXBkYXRlci5zZXRBdHRyKHRoaXMubm9kZSwgJ29uJyArIGV2ZW50TmFtZSk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzID0gbnVsbDtcblxuICAgICAgICAgICAgRXhwclBhcnNlci5wcm90b3R5cGUuZGVzdHJveS5hcHBseSh0aGlzKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgICAkbmFtZTogJ0V2ZW50RXhwclBhcnNlcidcbiAgICB9XG4pO1xuXG5UcmVlLnJlZ2lzdGVQYXJzZXIobW9kdWxlLmV4cG9ydHMpO1xuXG5cbmZ1bmN0aW9uIGdldEV2ZW50TmFtZShhdHRyTmFtZSwgY29uZmlnKSB7XG4gICAgaWYgKGF0dHJOYW1lLmluZGV4T2YoY29uZmlnLmV2ZW50UHJlZml4ICsgJy0nKSA9PT0gLTEpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJldHVybiBhdHRyTmFtZS5yZXBsYWNlKGNvbmZpZy5ldmVudFByZWZpeCArICctJywgJycpO1xufVxuXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Z0cGwvc3JjL3BhcnNlcnMvRXZlbnRFeHByUGFyc2VyLmpzXG4gKiogbW9kdWxlIGlkID0gMjRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDJcbiAqKi8iLCIvKipcbiAqIEBmaWxlIOihqOi+vuW8j+ino+aekOWZqO+8jOS4gOS4quaWh+acrOiKgueCueaIluiAheWFg+e0oOiKgueCueWvueW6lOS4gOS4quihqOi+vuW8j+ino+aekOWZqOWunuS+i1xuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbnZhciBQYXJzZXIgPSByZXF1aXJlKCcuL1BhcnNlcicpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcbnZhciBUcmVlID0gcmVxdWlyZSgnLi4vdHJlZXMvVHJlZScpO1xudmFyIERvbVVwZGF0ZXIgPSByZXF1aXJlKCcuLi9Eb21VcGRhdGVyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUGFyc2VyLmV4dGVuZHMoXG4gICAge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDliJ3lp4vljJZcbiAgICAgICAgICpcbiAgICAgICAgICogQGluaGVyaXREb2NcbiAgICAgICAgICogQHBhcmFtICB7T2JqZWN0fSBvcHRpb25zIOWPguaVsFxuICAgICAgICAgKiBAcGFyYW0gIHtOb2RlfSBvcHRpb25zLm5vZGUgRE9N6IqC54K5XG4gICAgICAgICAqL1xuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgUGFyc2VyLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgICAgIHRoaXMubm9kZSA9IG9wdGlvbnMubm9kZTtcblxuICAgICAgICAgICAgdGhpcy5leHBycyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5leHByRm5zID0ge307XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUZucyA9IHt9O1xuICAgICAgICAgICAgLy8g5oGi5aSN5Y6f6LKM55qE5Ye95pWwXG4gICAgICAgICAgICB0aGlzLnJlc3RvcmVGbnMgPSB7fTtcbiAgICAgICAgICAgIHRoaXMuZXhwck9sZFZhbHVlcyA9IHt9O1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIERPTeiKgueCueWxnuaAp+S4juabtOaWsOWxnuaAp+eahOS7u+WKoWlk55qE5pig5bCEXG4gICAgICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0aGlzLmF0dHJUb0RvbVRhc2tJZE1hcCA9IHt9O1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmkJzpm4bov4fnqItcbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAcmV0dXJuIHtib29sZWFufSDov5Tlm57luIPlsJTlgLxcbiAgICAgICAgICovXG4gICAgICAgIGNvbGxlY3RFeHByczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGN1ck5vZGUgPSB0aGlzLm5vZGU7XG5cbiAgICAgICAgICAgIC8vIOaWh+acrOiKgueCuVxuICAgICAgICAgICAgaWYgKGN1ck5vZGUubm9kZVR5cGUgPT09IDMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEV4cHIoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5YWD57Sg6IqC54K5XG4gICAgICAgICAgICBpZiAoY3VyTm9kZS5ub2RlVHlwZSA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHZhciBhdHRyaWJ1dGVzID0gY3VyTm9kZS5hdHRyaWJ1dGVzO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IGF0dHJpYnV0ZXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZEV4cHIoYXR0cmlidXRlc1tpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOa3u+WKoOihqOi+vuW8j1xuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICAqIEBwYXJhbSB7QXR0cn0gYXR0ciDlpoLmnpzlvZPliY3mmK/lhYPntKDoioLngrnvvIzliJnopoHkvKDlhaXpgY3ljobliLDnmoTlsZ7mgKfvvIxcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgIOaJgOS7pWF0dHLlrZjlnKjkuI7lkKbmmK/liKTmlq3lvZPliY3lhYPntKDmmK/lkKbmmK/mlofmnKzoioLngrnnmoTkuIDkuKrkvp3mja5cbiAgICAgICAgICovXG4gICAgICAgIGFkZEV4cHI6IGZ1bmN0aW9uIChhdHRyKSB7XG4gICAgICAgICAgICB2YXIgZXhwciA9IGF0dHIgPyBhdHRyLnZhbHVlIDogdGhpcy5ub2RlLm5vZGVWYWx1ZTtcbiAgICAgICAgICAgIGlmICghdGhpcy5jb25maWcuZ2V0RXhwclJlZ0V4cCgpLnRlc3QoZXhwcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhZGRFeHByKFxuICAgICAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICAgICAgZXhwcixcbiAgICAgICAgICAgICAgICBhdHRyXG4gICAgICAgICAgICAgICAgICAgID8gY3JlYXRlQXR0clVwZGF0ZUZuKHRoaXMuZ2V0VGFza0lkKGF0dHIubmFtZSksIHRoaXMubm9kZSwgYXR0ci5uYW1lLCB0aGlzLmRvbVVwZGF0ZXIpXG4gICAgICAgICAgICAgICAgICAgIDogKGZ1bmN0aW9uIChtZSwgY3VyTm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRhc2tJZCA9IG1lLmRvbVVwZGF0ZXIuZ2VuZXJhdGVUYXNrSWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoZXhwclZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWUuZG9tVXBkYXRlci5hZGRUYXNrRm4oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhc2tJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXRpbHMuYmluZChmdW5jdGlvbiAoY3VyTm9kZSwgZXhwclZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJOb2RlLm5vZGVWYWx1ZSA9IGV4cHJWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgbnVsbCwgY3VyTm9kZSwgZXhwclZhbHVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9KSh0aGlzLCB0aGlzLm5vZGUpXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB0aGlzLnJlc3RvcmVGbnNbZXhwcl0gPSB0aGlzLnJlc3RvcmVGbnNbZXhwcl0gfHwgW107XG4gICAgICAgICAgICBpZiAoYXR0cikge1xuICAgICAgICAgICAgICAgIHRoaXMucmVzdG9yZUZuc1tleHByXS5wdXNoKHV0aWxzLmJpbmQoZnVuY3Rpb24gKGN1ck5vZGUsIGF0dHJOYW1lLCBhdHRyVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VyTm9kZS5zZXRBdHRyaWJ1dGUoYXR0ck5hbWUsIGF0dHJWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfSwgbnVsbCwgdGhpcy5ub2RlLCBhdHRyLm5hbWUsIGF0dHIudmFsdWUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMucmVzdG9yZUZuc1tleHByXS5wdXNoKHV0aWxzLmJpbmQoZnVuY3Rpb24gKGN1ck5vZGUsIG5vZGVWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBjdXJOb2RlLm5vZGVWYWx1ZSA9IG5vZGVWYWx1ZTtcbiAgICAgICAgICAgICAgICB9LCBudWxsLCB0aGlzLm5vZGUsIHRoaXMubm9kZS5ub2RlVmFsdWUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6I635Y+W5byA5aeL6IqC54K5XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICogQGluaGVyaXREb2NcbiAgICAgICAgICogQHJldHVybiB7Tm9kZX1cbiAgICAgICAgICovXG4gICAgICAgIGdldFN0YXJ0Tm9kZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubm9kZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6I635Y+W57uT5p2f6IqC54K5XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICogQGluaGVyaXREb2NcbiAgICAgICAgICogQHJldHVybiB7Tm9kZX1cbiAgICAgICAgICovXG4gICAgICAgIGdldEVuZE5vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5vZGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOmUgOavgVxuICAgICAgICAgKlxuICAgICAgICAgKiBAaW5oZXJpdERvY1xuICAgICAgICAgKi9cbiAgICAgICAgZGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdXRpbHMuZWFjaCh0aGlzLmV4cHJzLCBmdW5jdGlvbiAoZXhwcikge1xuICAgICAgICAgICAgICAgIHV0aWxzLmVhY2godGhpcy5yZXN0b3JlRm5zW2V4cHJdLCBmdW5jdGlvbiAocmVzdG9yZUZuKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3RvcmVGbigpO1xuICAgICAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICAgIHRoaXMubm9kZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmV4cHJzID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuZXhwckZucyA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUZucyA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmV4cHJPbGRWYWx1ZXMgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5yZXN0b3JlRm5zID0gbnVsbDtcblxuICAgICAgICAgICAgUGFyc2VyLnByb3RvdHlwZS5kZXN0cm95LmNhbGwodGhpcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiKgueCueKAnOmakOiXj+KAnei1t+adpVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqL1xuICAgICAgICBnb0Rhcms6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHV0aWxzLmdvRGFyayh0aGlzLm5vZGUpO1xuICAgICAgICAgICAgdGhpcy5pc0dvRGFyayA9IHRydWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWcqG1vZGVs5Y+R55Sf5pS55Y+Y55qE5pe25YCZ6K6h566X5LiA5LiL6KGo6L6+5byP55qE5YC8LT7ohI/mo4DmtYstPuabtOaWsOeVjOmdouOAglxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICAqL1xuICAgICAgICBvbkNoYW5nZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNHb0RhcmspIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBleHBycyA9IHRoaXMuZXhwcnM7XG4gICAgICAgICAgICB2YXIgZXhwck9sZFZhbHVlcyA9IHRoaXMuZXhwck9sZFZhbHVlcztcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IGV4cHJzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgZXhwciA9IGV4cHJzW2ldO1xuICAgICAgICAgICAgICAgIHZhciBleHByVmFsdWUgPSB0aGlzLmV4cHJGbnNbZXhwcl0odGhpcy5zY29wZU1vZGVsKTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRpcnR5Q2hlY2soZXhwciwgZXhwclZhbHVlLCBleHByT2xkVmFsdWVzW2V4cHJdKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdXBkYXRlRm5zID0gdGhpcy51cGRhdGVGbnNbZXhwcl07XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwLCBqbCA9IHVwZGF0ZUZucy5sZW5ndGg7IGogPCBqbDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVGbnNbal0oZXhwclZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGV4cHJPbGRWYWx1ZXNbZXhwcl0gPSBleHByVmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIFBhcnNlci5wcm90b3R5cGUub25DaGFuZ2UuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6IqC54K54oCc5pi+56S64oCd5Ye65p2lXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwdWJsaWNcbiAgICAgICAgICovXG4gICAgICAgIHJlc3RvcmVGcm9tRGFyazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdXRpbHMucmVzdG9yZUZyb21EYXJrKHRoaXMubm9kZSk7XG4gICAgICAgICAgICB0aGlzLmlzR29EYXJrID0gZmFsc2U7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOagueaNrkRPTeiKgueCueeahOWxnuaAp+WQjeWtl+aLv+WIsOS4gOS4quS7u+WKoWlk44CCXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICogQHBhcmFtICB7c3RyaW5nfSBhdHRyTmFtZSDlsZ7mgKflkI3lrZdcbiAgICAgICAgICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICDku7vliqFpZFxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0VGFza0lkOiBmdW5jdGlvbiAoYXR0ck5hbWUpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5hdHRyVG9Eb21UYXNrSWRNYXBbYXR0ck5hbWVdKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdHRyVG9Eb21UYXNrSWRNYXBbYXR0ck5hbWVdID0gdGhpcy5kb21VcGRhdGVyLmdlbmVyYXRlVGFza0lkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hdHRyVG9Eb21UYXNrSWRNYXBbYXR0ck5hbWVdO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDorr7nva7lvZPliY3oioLngrnnmoTlsZ7mgKdcbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSDlsZ7mgKflkI1cbiAgICAgICAgICogQHBhcmFtIHsqfSB2YWx1ZSDlsZ7mgKflgLxcbiAgICAgICAgICovXG4gICAgICAgIHNldEF0dHI6IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIHRhc2tJZCA9IHRoaXMuZ2V0VGFza0lkKCk7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5kb21VcGRhdGVyLmFkZFRhc2tGbih0YXNrSWQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBEb21VcGRhdGVyLnNldEF0dHIobWUubm9kZSwgbmFtZSwgdmFsdWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiOt+WPluWxnuaAp1xuICAgICAgICAgKlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqIEBwYXJhbSAge3N0cmluZ30gbmFtZSDlsZ7mgKflkI1cbiAgICAgICAgICogQHJldHVybiB7Kn0gICAgICDlsZ7mgKflgLxcbiAgICAgICAgICovXG4gICAgICAgIGdldEF0dHI6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gRG9tVXBkYXRlci5nZXRBdHRyKHRoaXMubm9kZSwgbmFtZSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICog5Yik5pat6IqC54K55piv5ZCm5piv5bqU6K+l55Sx5b2T5YmN5aSE55CG5Zmo5p2l5aSE55CGXG4gICAgICAgICAqXG4gICAgICAgICAqIEBzdGF0aWNcbiAgICAgICAgICogQHBhcmFtICB7Tm9kZX0gIG5vZGUg6IqC54K5XG4gICAgICAgICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAgICAgICAqL1xuICAgICAgICBpc1Byb3Blck5vZGU6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5ub2RlVHlwZSA9PT0gMSB8fCBub2RlLm5vZGVUeXBlID09PSAzO1xuICAgICAgICB9LFxuXG4gICAgICAgICRuYW1lOiAnRXhwclBhcnNlcidcbiAgICB9XG4pO1xuXG5UcmVlLnJlZ2lzdGVQYXJzZXIobW9kdWxlLmV4cG9ydHMpO1xuXG4vKipcbiAqIOWIm+W7ukRPTeiKgueCueWxnuaAp+abtOaWsOWHveaVsFxuICpcbiAqIEBpbm5lclxuICogQHBhcmFtIHtudW1iZXJ9IHRhc2tJZCBkb23ku7vliqFpZFxuICogQHBhcmFtICB7Tm9kZX0gbm9kZSAgICBET03kuK3nmoToioLngrlcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIOimgeabtOaWsOeahOWxnuaAp+WQjVxuICogQHBhcmFtICB7RG9tVXBkYXRlcn0gZG9tVXBkYXRlciBET03mm7TmlrDlmahcbiAqIEByZXR1cm4ge2Z1bmN0aW9uKE9iamVjdCl9ICAgICAg5pu05paw5Ye95pWwXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUF0dHJVcGRhdGVGbih0YXNrSWQsIG5vZGUsIG5hbWUsIGRvbVVwZGF0ZXIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGV4cHJWYWx1ZSkge1xuICAgICAgICBkb21VcGRhdGVyLmFkZFRhc2tGbihcbiAgICAgICAgICAgIHRhc2tJZCxcbiAgICAgICAgICAgIHV0aWxzLmJpbmQoZnVuY3Rpb24gKG5vZGUsIG5hbWUsIGV4cHJWYWx1ZSkge1xuICAgICAgICAgICAgICAgIERvbVVwZGF0ZXIuc2V0QXR0cihub2RlLCBuYW1lLCBleHByVmFsdWUpO1xuICAgICAgICAgICAgfSwgbnVsbCwgbm9kZSwgbmFtZSwgZXhwclZhbHVlKVxuICAgICAgICApO1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIGFkZEV4cHIocGFyc2VyLCBleHByLCB1cGRhdGVGbikge1xuICAgIHBhcnNlci5leHBycy5wdXNoKGV4cHIpO1xuICAgIGlmICghcGFyc2VyLmV4cHJGbnNbZXhwcl0pIHtcbiAgICAgICAgcGFyc2VyLmV4cHJGbnNbZXhwcl0gPSBjcmVhdGVFeHByRm4ocGFyc2VyLCBleHByKTtcbiAgICB9XG4gICAgcGFyc2VyLnVwZGF0ZUZuc1tleHByXSA9IHBhcnNlci51cGRhdGVGbnNbZXhwcl0gfHwgW107XG4gICAgcGFyc2VyLnVwZGF0ZUZuc1tleHByXS5wdXNoKHVwZGF0ZUZuKTtcbn1cblxuLyoqXG4gKiDliJvlu7rmoLnmja5zY29wZU1vZGVs6K6h566X6KGo6L6+5byP5YC855qE5Ye95pWwXG4gKlxuICogQGlubmVyXG4gKiBAcGFyYW0gIHtQYXJzZXJ9IHBhcnNlciDop6PmnpDlmajlrp7kvotcbiAqIEBwYXJhbSAge3N0cmluZ30gZXhwciAgIOWQq+acieihqOi+vuW8j+eahOWtl+espuS4slxuICogQHJldHVybiB7ZnVuY3Rpb24oU2NvcGUpOip9XG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUV4cHJGbihwYXJzZXIsIGV4cHIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHNjb3BlTW9kZWwpIHtcbiAgICAgICAgLy8g5q2k5aSE6KaB5YiG5Lik56eN5oOF5Ya177yaXG4gICAgICAgIC8vIDHjgIFleHBy5bm25LiN5piv57qv5q2j55qE6KGo6L6+5byP77yM5aaCYD09JHtuYW1lfT09YOOAglxuICAgICAgICAvLyAy44CBZXhwcuaYr+e6r+ato+eahOihqOi+vuW8j++8jOWmgmAke25hbWV9YOOAglxuICAgICAgICAvLyDlr7nkuo7kuI3nuq/mraPooajovr7lvI/nmoTmg4XlhrXvvIzmraTlpITnmoTov5Tlm57lgLzogq/lrprmmK/lrZfnrKbkuLLvvJtcbiAgICAgICAgLy8g6ICM5a+55LqO57qv5q2j55qE6KGo6L6+5byP77yM5q2k5aSE5bCx5LiN6KaB5bCG5YW26L2s5o2i5oiQ5a2X56ym5Liy5b2i5byP5LqG44CCXG5cbiAgICAgICAgdmFyIHJlZ0V4cCA9IHBhcnNlci5jb25maWcuZ2V0RXhwclJlZ0V4cCgpO1xuXG4gICAgICAgIHZhciBwb3NzaWJsZUV4cHJDb3VudCA9IGV4cHIubWF0Y2gobmV3IFJlZ0V4cCh1dGlscy5yZWdFeHBFbmNvZGUocGFyc2VyLmNvbmZpZy5leHByUHJlZml4KSwgJ2cnKSk7XG4gICAgICAgIHBvc3NpYmxlRXhwckNvdW50ID0gcG9zc2libGVFeHByQ291bnQgPyBwb3NzaWJsZUV4cHJDb3VudC5sZW5ndGggOiAwO1xuXG4gICAgICAgIC8vIOS4jee6r+ato1xuICAgICAgICBpZiAocG9zc2libGVFeHByQ291bnQgIT09IDEgfHwgZXhwci5yZXBsYWNlKHJlZ0V4cCwgJycpKSB7XG4gICAgICAgICAgICByZXR1cm4gZXhwci5yZXBsYWNlKHJlZ0V4cCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHBhcnNlci5leHByQ2FsY3VsYXRlci5jcmVhdGVFeHByRm4oYXJndW1lbnRzWzFdKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VyLmV4cHJDYWxjdWxhdGVyLmNhbGN1bGF0ZShhcmd1bWVudHNbMV0sIGZhbHNlLCBzY29wZU1vZGVsKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g57qv5q2jXG4gICAgICAgIHZhciBwdXJlRXhwciA9IGV4cHIuc2xpY2UocGFyc2VyLmNvbmZpZy5leHByUHJlZml4Lmxlbmd0aCwgLXBhcnNlci5jb25maWcuZXhwclN1ZmZpeC5sZW5ndGgpO1xuICAgICAgICBwYXJzZXIuZXhwckNhbGN1bGF0ZXIuY3JlYXRlRXhwckZuKHB1cmVFeHByKTtcbiAgICAgICAgcmV0dXJuIHBhcnNlci5leHByQ2FsY3VsYXRlci5jYWxjdWxhdGUocHVyZUV4cHIsIGZhbHNlLCBzY29wZU1vZGVsKTtcbiAgICB9O1xufVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL3NyYy9wYXJzZXJzL0V4cHJQYXJzZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAyNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMlxuICoqLyIsInZhciBUcmVlID0gcmVxdWlyZSgndnRwbC9zcmMvdHJlZXMvVHJlZScpO1xudmFyIEV2ZW50ID0gcmVxdWlyZSgndnRwbC9zcmMvRXZlbnQnKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJ3Z0cGwvc3JjL3V0aWxzJyk7XG52YXIgQ29tcG9uZW50TWFuYWdlciA9IHJlcXVpcmUoJy4vQ29tcG9uZW50TWFuYWdlcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRyZWUuZXh0ZW5kcyh7XG5cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICBUcmVlLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgdGhpcy5jb21wb25lbnRFdmVudCA9IG5ldyBFdmVudCgpO1xuICAgICAgICBpZiAob3B0aW9ucy5jb21wb25lbnRDaGlsZHJlbikge1xuICAgICAgICAgICAgdGhpcy5zZXRUcmVlVmFyKCdjb21wb25lbnRDaGlsZHJlbicsIG9wdGlvbnMuY29tcG9uZW50Q2hpbGRyZW4pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNvbXBvbmVudE1hbmFnZXIgPSBuZXcgQ29tcG9uZW50TWFuYWdlcigpO1xuICAgICAgICBjb21wb25lbnRNYW5hZ2VyLnNldFBhcmVudCh0aGlzLmdldFRyZWVWYXIoJ2NvbXBvbmVudE1hbmFnZXInKSk7XG4gICAgICAgIHRoaXMuc2V0VHJlZVZhcignY29tcG9uZW50TWFuYWdlcicsIGNvbXBvbmVudE1hbmFnZXIpO1xuICAgIH0sXG5cbiAgICBzZXRQYXJlbnQ6IGZ1bmN0aW9uIChwYXJlbnRUcmVlKSB7XG4gICAgICAgIFRyZWUucHJvdG90eXBlLnNldFBhcmVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgICAgIHBhcmVudFRyZWUucm9vdFNjb3BlLmFkZENoaWxkKHRoaXMucm9vdFNjb3BlKTtcbiAgICAgICAgdGhpcy5yb290U2NvcGUuc2V0UGFyZW50KHBhcmVudFRyZWUucm9vdFNjb3BlKTtcbiAgICB9LFxuXG4gICAgY3JlYXRlUGFyc2VyOiBmdW5jdGlvbiAoUGFyc2VyQ2xhc3MsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIGluc3RhbmNlID0gVHJlZS5wcm90b3R5cGUuY3JlYXRlUGFyc2VyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDms6jlhoznu4Tku7bnsbtcbiAgICAgKiDorr7nva7nu5HlrprlnKjmoJHkuIrpnaLnmoTpop3lpJblj5jph4/jgILov5nkupvlj5jph4/mnInlpoLkuIvnibnmgKfvvJpcbiAgICAgKiAx44CB5peg5rOV6KaG55uW77ybXG4gICAgICogMuOAgeWcqOiOt+WPlnRyZWVWYXJz5LiK6Z2i5p+Q5Liq5Y+Y6YeP55qE5pe25YCZ77yM5aaC5p6c5b2T5YmN5qCR5Y+W5Ye65p2l5pivdW5kZWZpbmVk77yM6YKj5LmI5bCx5Lya5Yiw54i257qn5qCR55qEdHJlZVZhcnPkuIrljrvmib7vvIzku6XmraTnsbvmjqjjgIJcbiAgICAgKlxuICAgICAqIEBwdWJsaWNcbiAgICAgKiBAcGFyYW0gIHtNYXAuPHN0cmluZywgQ29tcG9uZW50Pn0gY29tcG9uZW50Q2xhc3NlcyDnu4Tku7blkI3lkoznu4Tku7bnsbvnmoTmmKDlsIRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAg5Y+Y6YeP5ZCNXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSDlj5jph4/lgLxcbiAgICAgKi9cbiAgICByZWdpc3RlQ29tcG9uZW50czogZnVuY3Rpb24gKGNvbXBvbmVudENsYXNzZXMpIHtcbiAgICAgICAgaWYgKCF1dGlscy5pc0FycmF5KGNvbXBvbmVudENsYXNzZXMpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY29tcG9uZW50TWFuYWdlciA9IHRoaXMuZ2V0VHJlZVZhcignY29tcG9uZW50TWFuYWdlcicpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IGNvbXBvbmVudENsYXNzZXMubGVuZ3RoOyBpIDwgaWw7ICsraSkge1xuICAgICAgICAgICAgdmFyIGNvbXBvbmVudENsYXNzID0gY29tcG9uZW50Q2xhc3Nlc1tpXTtcbiAgICAgICAgICAgIGNvbXBvbmVudE1hbmFnZXIucmVnaXN0ZShjb21wb25lbnRDbGFzcyk7XG4gICAgICAgIH1cbiAgICB9XG59LCB7XG4gICAgJG5hbWU6ICdDb21wb25lbnRUcmVlJ1xufSk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Zjb21wb25lbnQvc3JjL0NvbXBvbmVudFRyZWUuanNcbiAqKiBtb2R1bGUgaWQgPSAyNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMlxuICoqLyIsIi8qKlxuICogQGZpbGUg57uE5Lu2566h55CG44CCQ29tcG9uZW50TWFuYWdlcuS5n+aYr+acieWxgue6p+WFs+ezu+eahO+8jFxuICogICAgICAgVHJlZeS4i+mdoueahENvbXBvbmVudE1hbmFnZXLms6jlhozov5nkuKpUcmVl5a6e5L6L55So5Yiw55qEQ29tcG9uZW5077yMXG4gKiAgICAgICDogIzlnKhDb21wb25lbnTkuK3kuZ/lj6/ku6Xms6jlhozmraRDb21wb25lbnTnmoR0cGzkuK3lsIbkvJrkvb/nlKjliLDnmoRDb21wb25lbnTjgIJcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCd2dHBsL3NyYy91dGlscycpO1xuXG5mdW5jdGlvbiBDb21wb25lbnRNYW5hZ2VyKCkge1xuICAgIHRoaXMuY29tcG9uZW50cyA9IHt9O1xufVxuXG4vKipcbiAqIOazqOWGjOe7hOS7tuOAglxuICpcbiAqIEBwdWJsaWNcbiAqIEBwYXJhbSAge0NvbnN0cnVjdG9yfSBDb21wb25lbnRDbGFzcyDnu4Tku7bnsbtcbiAqIEBwYXJhbSAge3N0cmluZz19IG5hbWUgICAgICAgICAgIOe7hOS7tuWQje+8jOWPr+mAiVxuICovXG5Db21wb25lbnRNYW5hZ2VyLnByb3RvdHlwZS5yZWdpc3RlID0gZnVuY3Rpb24gKENvbXBvbmVudENsYXNzKSB7XG4gICAgdmFyIG5hbWUgPSBDb21wb25lbnRDbGFzcy4kbmFtZTtcbiAgICB0aGlzLmNvbXBvbmVudHNbbmFtZV0gPSBDb21wb25lbnRDbGFzcztcbiAgICB0aGlzLm1vdW50U3R5bGUoQ29tcG9uZW50Q2xhc3MpO1xufTtcblxuLyoqXG4gKiDmoLnmja7lkI3lrZfojrflj5bnu4Tku7bnsbvjgILlnKjmqKHmnb/op6PmnpDnmoTov4fnqIvkuK3kvJrosIPnlKjov5nkuKrmlrnms5XjgIJcbiAqXG4gKiBAcHVibGljXG4gKiBAcGFyYW0gIHtzdHJpbmd9IG5hbWUg57uE5Lu25ZCNXG4gKiBAcmV0dXJuIHtDb21wb25lbnRDbGFzc30gIOe7hOS7tuexu1xuICovXG5Db21wb25lbnRNYW5hZ2VyLnByb3RvdHlwZS5nZXRDbGFzcyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdmFyIGNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50c1tuYW1lXTtcbiAgICBpZiAoY29tcG9uZW50KSB7XG4gICAgICAgIHJldHVybiBjb21wb25lbnQ7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICAgIGNvbXBvbmVudCA9IHRoaXMucGFyZW50LmdldENsYXNzKG5hbWUpO1xuICAgIH1cblxuICAgIHJldHVybiBjb21wb25lbnQ7XG59O1xuXG4vKipcbiAqIOiuvue9rueItue6p+e7hOS7tueuoeeQhuWZqFxuICpcbiAqIEBwdWJsaWNcbiAqIEBwYXJhbSB7Q29tcG9uZW50TWFuZ2VyfSBjb21wb25lbnRNYW5hZ2VyIOe7hOS7tueuoeeQhuWZqFxuICovXG5Db21wb25lbnRNYW5hZ2VyLnByb3RvdHlwZS5zZXRQYXJlbnQgPSBmdW5jdGlvbiAoY29tcG9uZW50TWFuYWdlcikge1xuICAgIHRoaXMucGFyZW50ID0gY29tcG9uZW50TWFuYWdlcjtcbn07XG5cbi8qKlxuICog5bCG57uE5Lu255qE5qC35byP5oyC6L295LiK5Y67XG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB757uE5Lu257G7fSBDb21wb25lbnRDbGFzcyDnu4Tku7bnsbtcbiAqL1xuQ29tcG9uZW50TWFuYWdlci5wcm90b3R5cGUubW91bnRTdHlsZSA9IGZ1bmN0aW9uIChDb21wb25lbnRDbGFzcykge1xuICAgIHZhciBzdHlsZU5vZGVJZCA9ICdjb21wb25lbnQtJyArIENvbXBvbmVudENsYXNzLiRuYW1lO1xuXG4gICAgLy8g5Yik5pat5LiA5LiL77yM6YG/5YWN6YeN5aSN5re75YqgY3NzXG4gICAgaWYgKCFkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzdHlsZU5vZGVJZCkpIHtcbiAgICAgICAgdmFyIHN0eWxlID0gQ29tcG9uZW50Q2xhc3MuZ2V0U3R5bGUoKTtcbiAgICAgICAgaWYgKHN0eWxlKSB7XG4gICAgICAgICAgICB2YXIgc3R5bGVOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgICAgICAgIHN0eWxlTm9kZS5zZXRBdHRyaWJ1dGUoJ2lkJywgc3R5bGVOb2RlSWQpO1xuICAgICAgICAgICAgc3R5bGVOb2RlLmlubmVySFRNTCA9IHN0eWxlLnJlcGxhY2UoXG4gICAgICAgICAgICAgICAgLyNyb290Iy9nLFxuICAgICAgICAgICAgICAgICcuJyArIENvbXBvbmVudE1hbmFnZXIuZ2V0Q3NzQ2xhc3NOYW1lKENvbXBvbmVudENsYXNzKS5qb2luKCcuJylcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlTm9kZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyDlsIbniLbnsbvnmoRjc3PmoLflvI/kuZ/liqDkuIrljrvjgILniLbnsbvlvojlj6/og73msqHms6jlhozvvIzlpoLmnpzmraTlpITkuI3liqDkuIrljrvvvIzmoLflvI/lj6/og73lsLHkvJrnvLrkuIDlnZfjgIJcbiAgICBpZiAoQ29tcG9uZW50Q2xhc3MuJG5hbWUgIT09ICdDb21wb25lbnQnKSB7XG4gICAgICAgIHRoaXMubW91bnRTdHlsZShDb21wb25lbnRDbGFzcy4kc3VwZXJDbGFzcyk7XG4gICAgfVxufTtcblxuLyoqXG4gKiDojrflj5bnu4Tku7bnmoRjc3PnsbvlkI3jgILop4TliJnmmK/moLnmja7nu6fmib/lhbPns7vvvIzov5vooYznsbvlkI3mi7zmjqXvvIzku47ogIzkvb/lrZDnu4Tku7bnsbvnmoRjc3PlhbfmnInmm7Tpq5jkvJjlhYjnuqfjgIJcbiAqXG4gKiBAc3RhdGljXG4gKiBAcGFyYW0ge0NvbnN0cnVjdG9yfSBDb21wb25lbnRDbGFzcyDnu4Tku7bnsbtcbiAqIEByZXR1cm4ge0FycmF5LjxzdHJpbmc+fSDlkIjmiJDnsbvlkI3mlbDnu4RcbiAqL1xuQ29tcG9uZW50TWFuYWdlci5nZXRDc3NDbGFzc05hbWUgPSBmdW5jdGlvbiAoQ29tcG9uZW50Q2xhc3MpIHtcbiAgICB2YXIgbmFtZSA9IFtdO1xuICAgIGZvciAodmFyIGN1ckNscyA9IENvbXBvbmVudENsYXNzOyBjdXJDbHM7IGN1ckNscyA9IGN1ckNscy4kc3VwZXJDbGFzcykge1xuICAgICAgICBuYW1lLnB1c2godXRpbHMuY2FtZWwybGluZShjdXJDbHMuJG5hbWUpKTtcblxuICAgICAgICAvLyDmnIDlpJrliLDnu4Tku7bln7rnsbtcbiAgICAgICAgaWYgKGN1ckNscy4kbmFtZSA9PT0gJ0NvbXBvbmVudCcpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuYW1lO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbXBvbmVudE1hbmFnZXI7XG5cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdmNvbXBvbmVudC9zcmMvQ29tcG9uZW50TWFuYWdlci5qc1xuICoqIG1vZHVsZSBpZCA9IDI3XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyXG4gKiovIiwiLyoqXG4gKiBAZmlsZSDnu4Tku7bnmoQgPCEtLSBjaGlsZHJlbiAtLT4g5a6e5L6L77yM6K6w5b2V55u45YWz5L+h5oGv77yM5pa55L6/5ZCO57utIENoaWxkcmVuRGlyZWN0aXZlUGFyc2VyIOino+aekFxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJ3Z0cGwvc3JjL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIENvbXBvbmVudENoaWxkcmVuKHN0YXJ0Tm9kZSwgZW5kTm9kZSwgc2NvcGUsIGNvbXBvbmVudCkge1xuICAgIHRoaXMuZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaWYgKCFzdGFydE5vZGUgfHwgIWVuZE5vZGUpIHtcbiAgICAgICAgdGhpcy5kaXYuaW5uZXJIVE1MID0gJyc7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB1dGlscy50cmF2ZXJzZU5vZGVzKFxuICAgICAgICAgICAgc3RhcnROb2RlLFxuICAgICAgICAgICAgZW5kTm9kZSxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChjdXJOb2RlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kaXYuYXBwZW5kQ2hpbGQoY3VyTm9kZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGhpc1xuICAgICAgICApO1xuICAgIH1cblxuICAgIHRoaXMuc2NvcGUgPSBzY29wZTtcbiAgICB0aGlzLmNvbXBvbmVudCA9IGNvbXBvbmVudDtcbn1cblxuQ29tcG9uZW50Q2hpbGRyZW4ucHJvdG90eXBlLmdldFRwbEh0bWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGl2LmlubmVySFRNTDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ29tcG9uZW50Q2hpbGRyZW47XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Zjb21wb25lbnQvc3JjL0NvbXBvbmVudENoaWxkcmVuLmpzXG4gKiogbW9kdWxlIGlkID0gMjhcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDJcbiAqKi8iLCJyZXF1aXJlKCcuL3NyYy9wYXJzZXJzL1Njb3BlRGlyZWN0aXZlUGFyc2VyJyk7XG5cbnZhciBhbWRFeHBvcnRzID0ge1xuICAgIENvbmZpZzogcmVxdWlyZSgnLi9zcmMvQ29uZmlnJyksXG4gICAgVHJlZTogcmVxdWlyZSgnLi9zcmMvdHJlZXMvVHJlZScpLFxuICAgIERpcnR5Q2hlY2tlcjogcmVxdWlyZSgnLi9zcmMvRGlydHlDaGVja2VyJyksXG4gICAgUGFyc2VyOiByZXF1aXJlKCcuL3NyYy9wYXJzZXJzL1BhcnNlcicpLFxuICAgIEZvckRpcmVjdGl2ZVBhcnNlcjogcmVxdWlyZSgnLi9zcmMvcGFyc2Vycy9Gb3JEaXJlY3RpdmVQYXJzZXInKSxcbiAgICBJZkRpcmVjdGl2ZVBhcnNlcjogcmVxdWlyZSgnLi9zcmMvcGFyc2Vycy9JZkRpcmVjdGl2ZVBhcnNlcicpLFxuICAgIEV2ZW50RXhwclBhcnNlcjogcmVxdWlyZSgnLi9zcmMvcGFyc2Vycy9FdmVudEV4cHJQYXJzZXInKSxcbiAgICBFeHByUGFyc2VyOiByZXF1aXJlKCcuL3NyYy9wYXJzZXJzL0V4cHJQYXJzZXInKSxcbiAgICBFeHByQ2FsY3VsYXRlcjogcmVxdWlyZSgnLi9zcmMvRXhwckNhbGN1bGF0ZXInKSxcbiAgICBWYXJEaXJlY3RpdmVQYXJzZXI6IHJlcXVpcmUoJy4vc3JjL3BhcnNlcnMvVmFyRGlyZWN0aXZlUGFyc2VyJyksXG4gICAgaW5oZXJpdDogcmVxdWlyZSgnLi9zcmMvaW5oZXJpdCcpLFxuICAgIHV0aWxzOiByZXF1aXJlKCcuL3NyYy91dGlscycpLFxuICAgIERvbVVwZGF0ZXI6IHJlcXVpcmUoJy4vc3JjL0RvbVVwZGF0ZXInKSxcbiAgICBTY29wZU1vZGVsOiByZXF1aXJlKCcuL3NyYy9TY29wZU1vZGVsJylcbn07XG5kZWZpbmUoZnVuY3Rpb24gKHJlcXVpcmUsIGV4cG9ydHMsIG1vZHVsZSkge1xuICAgIG1vZHVsZS5leHBvcnRzID0gYW1kRXhwb3J0cztcbn0pO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL21haW4uanNcbiAqKiBtb2R1bGUgaWQgPSAyOVxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMlxuICoqLyIsIi8qKlxuICogQGZpbGUgc2NvcGUgZGlyZWN0aXZlIHBhcnNlclxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbnZhciBEaXJlY3RpdmVQYXJzZXIgPSByZXF1aXJlKCcuL0RpcmVjdGl2ZVBhcnNlcicpO1xudmFyIFNjb3BlTW9kZWwgPSByZXF1aXJlKCcuLi9TY29wZU1vZGVsJyk7XG52YXIgVHJlZSA9IHJlcXVpcmUoJy4uL3RyZWVzL1RyZWUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBEaXJlY3RpdmVQYXJzZXIuZXh0ZW5kcyhcbiAgICB7XG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgICBEaXJlY3RpdmVQYXJzZXIucHJvdG90eXBlLmluaXRpYWxpemUuY2FsbCh0aGlzLCBvcHRpb25zKTtcblxuICAgICAgICAgICAgdGhpcy5zdGFydE5vZGUgPSBvcHRpb25zLnN0YXJ0Tm9kZTtcbiAgICAgICAgICAgIHRoaXMuZW5kTm9kZSA9IG9wdGlvbnMuZW5kTm9kZTtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLnRyZWUuZ2V0VHJlZVZhcignc2NvcGVzJykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRyZWUuc2V0VHJlZVZhcignc2NvcGVzJywge30pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHNldFNjb3BlOiBmdW5jdGlvbiAoc2NvcGVNb2RlbCkge1xuICAgICAgICAgICAgdGhpcy5zY29wZU1vZGVsLnNldFBhcmVudChzY29wZU1vZGVsKTtcbiAgICAgICAgICAgIHNjb3BlTW9kZWwuYWRkQ2hpbGQodGhpcy5zY29wZU1vZGVsKTtcbiAgICAgICAgfSxcblxuICAgICAgICBjb2xsZWN0RXhwcnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBzY29wZU5hbWUgPSB0aGlzLnN0YXJ0Tm9kZS5ub2RlVmFsdWVcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxzKy9nLCAnJylcbiAgICAgICAgICAgICAgICAucmVwbGFjZSh0aGlzLmNvbmZpZy5zY29wZU5hbWUgKyAnOicsICcnKTtcbiAgICAgICAgICAgIGlmIChzY29wZU5hbWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2NvcGVzID0gdGhpcy50cmVlLmdldFRyZWVWYXIoJ3Njb3BlcycpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2NvcGVNb2RlbCA9IG5ldyBTY29wZU1vZGVsKCk7XG4gICAgICAgICAgICAgICAgc2NvcGVzW3Njb3BlTmFtZV0gPSBzY29wZXNbc2NvcGVOYW1lXSB8fCBbXTtcbiAgICAgICAgICAgICAgICBzY29wZXNbc2NvcGVOYW1lXS5wdXNoKHRoaXMuc2NvcGVNb2RlbCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBzdGFydE5vZGU6IHRoaXMuc3RhcnROb2RlLm5leHRTaWJsaW5nLFxuICAgICAgICAgICAgICAgICAgICBlbmROb2RlOiB0aGlzLmVuZE5vZGUucHJldmlvdXNTaWJsaW5nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgICBpc1Byb3Blck5vZGU6IGZ1bmN0aW9uIChub2RlLCBjb25maWcpIHtcbiAgICAgICAgICAgIHJldHVybiBEaXJlY3RpdmVQYXJzZXIuaXNQcm9wZXJOb2RlKG5vZGUsIGNvbmZpZylcbiAgICAgICAgICAgICAgICAmJiBub2RlLm5vZGVWYWx1ZS5yZXBsYWNlKC9cXHMrLywgJycpLmluZGV4T2YoY29uZmlnLnNjb3BlTmFtZSArICc6JykgPT09IDA7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZmluZEVuZE5vZGU6IGZ1bmN0aW9uIChzdGFydE5vZGUsIGNvbmZpZykge1xuICAgICAgICAgICAgdmFyIGN1ck5vZGUgPSBzdGFydE5vZGU7XG4gICAgICAgICAgICB3aGlsZSAoKGN1ck5vZGUgPSBjdXJOb2RlLm5leHRTaWJsaW5nKSkge1xuICAgICAgICAgICAgICAgIGlmIChpc0VuZE5vZGUoY3VyTm9kZSwgY29uZmlnKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3VyTm9kZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0Tm9FbmROb2RlRXJyb3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoJ3RoZSBzY29wZSBkaXJlY3RpdmUgaXMgbm90IHByb3Blcmx5IGVuZGVkIScpO1xuICAgICAgICB9LFxuXG4gICAgICAgICRuYW1lOiAnU2NvcGVEaXJlY3RpdmVQYXJzZXInXG4gICAgfVxuKTtcblxuVHJlZS5yZWdpc3RlUGFyc2VyKG1vZHVsZS5leHBvcnRzKTtcblxuZnVuY3Rpb24gaXNFbmROb2RlKG5vZGUsIGNvbmZpZykge1xuICAgIHJldHVybiBub2RlLm5vZGVUeXBlID09PSA4XG4gICAgICAgICYmIG5vZGUubm9kZVZhbHVlLnJlcGxhY2UoL1xccysvZywgJycpID09PSBjb25maWcuc2NvcGVFbmROYW1lO1xufVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL3NyYy9wYXJzZXJzL1Njb3BlRGlyZWN0aXZlUGFyc2VyLmpzXG4gKiogbW9kdWxlIGlkID0gMzBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDJcbiAqKi8iLCIvKipcbiAqIEBmaWxlIOmFjee9rlxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbmZ1bmN0aW9uIENvbmZpZygpIHtcbiAgICB0aGlzLmV4cHJQcmVmaXggPSAnJHsnO1xuICAgIHRoaXMuZXhwclN1ZmZpeCA9ICd9JztcblxuICAgIHRoaXMuaWZOYW1lID0gJ2lmJztcbiAgICB0aGlzLmVsaWZOYW1lID0gJ2VsaWYnO1xuICAgIHRoaXMuZWxzZU5hbWUgPSAnZWxzZSc7XG4gICAgdGhpcy5pZkVuZE5hbWUgPSAnL2lmJztcblxuICAgIHRoaXMuaWZQcmVmaXhSZWdFeHAgPSAvXlxccyppZjpcXHMqLztcbiAgICB0aGlzLmVsaWZQcmVmaXhSZWdFeHAgPSAvXlxccyplbGlmOlxccyovO1xuICAgIHRoaXMuZWxzZVByZWZpeFJlZ0V4cCA9IC9eXFxzKmVsc2VcXHMqLztcbiAgICB0aGlzLmlmRW5kUHJlZml4UmVnRXhwID0gL15cXHMqXFwvaWZcXHMqLztcblxuICAgIHRoaXMuZm9yTmFtZSA9ICdmb3InO1xuICAgIHRoaXMuZm9yRW5kTmFtZSA9ICcvZm9yJztcblxuICAgIHRoaXMuZm9yUHJlZml4UmVnRXhwID0gL15cXHMqZm9yOlxccyovO1xuICAgIHRoaXMuZm9yRW5kUHJlZml4UmVnRXhwID0gL15cXHMqXFwvZm9yXFxzKi87XG5cbiAgICB0aGlzLmV2ZW50UHJlZml4ID0gJ2V2ZW50JztcblxuICAgIHRoaXMudmFyTmFtZSA9ICd2YXInO1xuXG4gICAgdGhpcy5zY29wZU5hbWUgPSAnc2NvcGUnO1xuICAgIHRoaXMuc2NvcGVFbmROYW1lID0gJy9zY29wZSc7XG59XG5cbkNvbmZpZy5wcm90b3R5cGUuc2V0RXhwclByZWZpeCA9IGZ1bmN0aW9uIChwcmVmaXgpIHtcbiAgICB0aGlzLmV4cHJQcmVmaXggPSBwcmVmaXg7XG59O1xuXG5Db25maWcucHJvdG90eXBlLnNldEV4cHJTdWZmaXggPSBmdW5jdGlvbiAoc3VmZml4KSB7XG4gICAgdGhpcy5leHByU3VmZml4ID0gc3VmZml4O1xufTtcblxuQ29uZmlnLnByb3RvdHlwZS5nZXRFeHByUmVnRXhwID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5leHByUmVnRXhwKSB7XG4gICAgICAgIHRoaXMuZXhwclJlZ0V4cCA9IG5ldyBSZWdFeHAocmVnRXhwRW5jb2RlKHRoaXMuZXhwclByZWZpeCkgKyAnKC4rPyknICsgcmVnRXhwRW5jb2RlKHRoaXMuZXhwclN1ZmZpeCksICdnJyk7XG4gICAgfVxuICAgIHRoaXMuZXhwclJlZ0V4cC5sYXN0SW5kZXggPSAwO1xuICAgIHJldHVybiB0aGlzLmV4cHJSZWdFeHA7XG59O1xuXG5Db25maWcucHJvdG90eXBlLmdldEFsbElmUmVnRXhwID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5hbGxJZlJlZ0V4cCkge1xuICAgICAgICB0aGlzLmFsbElmUmVnRXhwID0gbmV3IFJlZ0V4cCgnXFxcXHMqKCdcbiAgICAgICAgICAgICsgdGhpcy5pZk5hbWUgKyAnfCdcbiAgICAgICAgICAgICsgdGhpcy5lbGlmTmFtZSArICd8J1xuICAgICAgICAgICAgKyB0aGlzLmVsc2VOYW1lICsgJ3wnXG4gICAgICAgICAgICArIHRoaXMuaWZFbmROYW1lICsgJyk6XFxcXHMqJywgJ2cnKTtcbiAgICB9XG4gICAgdGhpcy5hbGxJZlJlZ0V4cC5sYXN0SW5kZXggPSAwO1xuICAgIHJldHVybiB0aGlzLmFsbElmUmVnRXhwO1xufTtcblxuQ29uZmlnLnByb3RvdHlwZS5zZXRJZk5hbWUgPSBmdW5jdGlvbiAoaWZOYW1lKSB7XG4gICAgdGhpcy5pZk5hbWUgPSBpZk5hbWU7XG4gICAgdGhpcy5pZlByZWZpeFJlZ0V4cCA9IG5ldyBSZWdFeHAoJ15cXFxccyonICsgaWZOYW1lICsgJzpcXFxccyonKTtcbn07XG5cbkNvbmZpZy5wcm90b3R5cGUuc2V0RWxpZk5hbWUgPSBmdW5jdGlvbiAoZWxpZk5hbWUpIHtcbiAgICB0aGlzLmVsaWZOYW1lID0gZWxpZk5hbWU7XG4gICAgdGhpcy5lbGlmUHJlZml4UmVnRXhwID0gbmV3IFJlZ0V4cCgnXlxcXFxzKicgKyBlbGlmTmFtZSArICc6XFxcXHMqJyk7XG59O1xuXG5Db25maWcucHJvdG90eXBlLnNldEVsc2VOYW1lID0gZnVuY3Rpb24gKGVsc2VOYW1lKSB7XG4gICAgdGhpcy5lbHNlTmFtZSA9IGVsc2VOYW1lO1xuICAgIHRoaXMuZWxzZVByZWZpeFJlZ0V4cCA9IG5ldyBSZWdFeHAoJ15cXFxccyonICsgZWxzZU5hbWUgKyAnXFxcXHMqJyk7XG59O1xuXG5Db25maWcucHJvdG90eXBlLnNldElmRW5kTmFtZSA9IGZ1bmN0aW9uIChpZkVuZE5hbWUpIHtcbiAgICB0aGlzLmlmRW5kTmFtZSA9IGlmRW5kTmFtZTtcbiAgICB0aGlzLmlmRW5kUHJlZml4UmVnRXhwID0gbmV3IFJlZ0V4cCgnXlxcXFxzKicgKyBpZkVuZE5hbWUgKyAnXFxcXHMqJyk7XG59O1xuXG5Db25maWcucHJvdG90eXBlLnNldEZvck5hbWUgPSBmdW5jdGlvbiAoZm9yTmFtZSkge1xuICAgIHRoaXMuZm9yTmFtZSA9IGZvck5hbWU7XG4gICAgdGhpcy5mb3JQcmVmaXhSZWdFeHAgPSBuZXcgUmVnRXhwKCdeXFxcXHMqJyArIGZvck5hbWUgKyAnOlxcXFxzKicpO1xufTtcblxuQ29uZmlnLnByb3RvdHlwZS5zZXRGb3JFbmROYW1lID0gZnVuY3Rpb24gKGZvckVuZE5hbWUpIHtcbiAgICB0aGlzLmZvckVuZE5hbWUgPSBmb3JFbmROYW1lO1xuICAgIHRoaXMuZm9yRW5kUHJlZml4UmVnRXhwID0gbmV3IFJlZ0V4cCgnXlxcXFxzKicgKyBmb3JFbmROYW1lICsgJ1xcXFxzKicpO1xufTtcblxuQ29uZmlnLnByb3RvdHlwZS5nZXRGb3JFeHByc1JlZ0V4cCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuZm9yRXhwcnNSZWdFeHApIHtcbiAgICAgICAgdGhpcy5mb3JFeHByc1JlZ0V4cCA9IG5ldyBSZWdFeHAoJ1xcXFxzKidcbiAgICAgICAgICAgICsgdGhpcy5mb3JOYW1lXG4gICAgICAgICAgICArICc6XFxcXHMqJ1xuICAgICAgICAgICAgKyByZWdFeHBFbmNvZGUodGhpcy5leHByUHJlZml4KVxuICAgICAgICAgICAgKyAnKFteJyArIHJlZ0V4cEVuY29kZSh0aGlzLmV4cHJTdWZmaXgpXG4gICAgICAgICAgICArICddKyknICsgcmVnRXhwRW5jb2RlKHRoaXMuZXhwclN1ZmZpeCkpO1xuICAgIH1cbiAgICB0aGlzLmZvckV4cHJzUmVnRXhwLmxhc3RJbmRleCA9IDA7XG4gICAgcmV0dXJuIHRoaXMuZm9yRXhwcnNSZWdFeHA7XG59O1xuXG5Db25maWcucHJvdG90eXBlLmdldEZvckl0ZW1WYWx1ZU5hbWVSZWdFeHAgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLmZvckl0ZW1WYWx1ZU5hbWVSZWdFeHApIHtcbiAgICAgICAgdGhpcy5mb3JJdGVtVmFsdWVOYW1lUmVnRXhwID0gbmV3IFJlZ0V4cChcbiAgICAgICAgICAgICdhc1xcXFxzKicgKyByZWdFeHBFbmNvZGUodGhpcy5leHByUHJlZml4KVxuICAgICAgICAgICAgKyAnKFteJyArIHJlZ0V4cEVuY29kZSh0aGlzLmV4cHJTdWZmaXgpICsgJ10rKSdcbiAgICAgICAgICAgICsgcmVnRXhwRW5jb2RlKHRoaXMuZXhwclN1ZmZpeClcbiAgICAgICAgKTtcbiAgICB9XG4gICAgdGhpcy5mb3JJdGVtVmFsdWVOYW1lUmVnRXhwLmxhc3RJbmRleCA9IDA7XG4gICAgcmV0dXJuIHRoaXMuZm9ySXRlbVZhbHVlTmFtZVJlZ0V4cDtcbn07XG5cbkNvbmZpZy5wcm90b3R5cGUuc2V0RXZlbnRQcmVmaXggPSBmdW5jdGlvbiAocHJlZml4KSB7XG4gICAgdGhpcy5ldmVudFByZWZpeCA9IHByZWZpeDtcbn07XG5cbkNvbmZpZy5wcm90b3R5cGUuc2V0VmFyTmFtZSA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhpcy52YXJOYW1lID0gbmFtZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ29uZmlnO1xuXG5mdW5jdGlvbiByZWdFeHBFbmNvZGUoc3RyKSB7XG4gICAgcmV0dXJuICdcXFxcJyArIHN0ci5zcGxpdCgnJykuam9pbignXFxcXCcpO1xufVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL3NyYy9Db25maWcuanNcbiAqKiBtb2R1bGUgaWQgPSAzMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMlxuICoqLyIsIi8qKlxuICogQGZpbGUg6ISP5qOA5rWL5ZmoXG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20pXG4gKi9cblxuZnVuY3Rpb24gRGlydHlDaGVja2VyKCkge1xuICAgIHRoaXMuY2hlY2tlcnMgPSB7fTtcbn1cblxuRGlydHlDaGVja2VyLnByb3RvdHlwZS5zZXRDaGVja2VyID0gZnVuY3Rpb24gKGV4cHIsIGNoZWNrZXJGbikge1xuICAgIHRoaXMuY2hlY2tlcnNbZXhwcl0gPSBjaGVja2VyRm47XG59O1xuXG5EaXJ0eUNoZWNrZXIucHJvdG90eXBlLmdldENoZWNrZXIgPSBmdW5jdGlvbiAoZXhwcikge1xuICAgIHJldHVybiB0aGlzLmNoZWNrZXJzW2V4cHJdO1xufTtcblxuRGlydHlDaGVja2VyLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuY2hlY2tlcnMgPSBudWxsO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEaXJ0eUNoZWNrZXI7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Z0cGwvc3JjL0RpcnR5Q2hlY2tlci5qc1xuICoqIG1vZHVsZSBpZCA9IDMyXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyXG4gKiovIiwiLyoqXG4gKiBAZmlsZSDlj5jph4/lrprkuYnmjIfku6Top6PmnpDlmahcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG52YXIgRGlyZWN0aXZlUGFyc2VyID0gcmVxdWlyZSgnLi9EaXJlY3RpdmVQYXJzZXInKTtcbnZhciBUcmVlID0gcmVxdWlyZSgnLi4vdHJlZXMvVHJlZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERpcmVjdGl2ZVBhcnNlci5leHRlbmRzKFxuICAgIHtcbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIERpcmVjdGl2ZVBhcnNlci5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgICAgICAgICB0aGlzLm5vZGUgPSBvcHRpb25zLm5vZGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY29sbGVjdEV4cHJzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZXhwciA9IHRoaXMubm9kZS5ub2RlVmFsdWUucmVwbGFjZSh0aGlzLmNvbmZpZy52YXJOYW1lICsgJzonLCAnJyk7XG4gICAgICAgICAgICB0aGlzLmV4cHJDYWxjdWxhdGVyLmNyZWF0ZUV4cHJGbihleHByKTtcblxuICAgICAgICAgICAgdmFyIGxlZnRWYWx1ZU5hbWUgPSBleHByLm1hdGNoKC9cXHMqLisoPz1cXD0pLylbMF0ucmVwbGFjZSgvXFxzKy9nLCAnJyk7XG5cbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLmV4cHJGbiA9IGZ1bmN0aW9uIChzY29wZU1vZGVsKSB7XG4gICAgICAgICAgICAgICAgdmFyIG9sZFZhbHVlID0gc2NvcGVNb2RlbC5nZXQobGVmdFZhbHVlTmFtZSk7XG4gICAgICAgICAgICAgICAgdmFyIG5ld1ZhbHVlID0gbWUuZXhwckNhbGN1bGF0ZXIuY2FsY3VsYXRlKGV4cHIsIGZhbHNlLCBzY29wZU1vZGVsKTtcbiAgICAgICAgICAgICAgICBpZiAob2xkVmFsdWUgIT09IG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlTW9kZWwuc2V0KGxlZnRWYWx1ZU5hbWUsIG5ld1ZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldFNjb3BlOiBmdW5jdGlvbiAoc2NvcGVNb2RlbCkge1xuICAgICAgICAgICAgRGlyZWN0aXZlUGFyc2VyLnByb3RvdHlwZS5zZXRTY29wZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgdGhpcy5leHByRm4odGhpcy5zY29wZU1vZGVsKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6I635Y+W5byA5aeL6IqC54K5XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICogQGluaGVyaXREb2NcbiAgICAgICAgICogQHJldHVybiB7Tm9kZX1cbiAgICAgICAgICovXG4gICAgICAgIGdldFN0YXJ0Tm9kZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubm9kZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6I635Y+W57uT5p2f6IqC54K5XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICogQGluaGVyaXREb2NcbiAgICAgICAgICogQHJldHVybiB7Tm9kZX1cbiAgICAgICAgICovXG4gICAgICAgIGdldEVuZE5vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5vZGU7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgaXNQcm9wZXJOb2RlOiBmdW5jdGlvbiAobm9kZSwgY29uZmlnKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5ub2RlVHlwZSA9PT0gOFxuICAgICAgICAgICAgICAgICYmIG5vZGUubm9kZVZhbHVlLnJlcGxhY2UoL15cXHMrLywgJycpLmluZGV4T2YoY29uZmlnLnZhck5hbWUgKyAnOicpID09PSAwO1xuICAgICAgICB9LFxuXG4gICAgICAgICRuYW1lOiAnVmFyRGlyZWN0aXZlUGFyc2VyJ1xuICAgIH1cbik7XG5cblRyZWUucmVnaXN0ZVBhcnNlcihtb2R1bGUuZXhwb3J0cyk7XG5cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdnRwbC9zcmMvcGFyc2Vycy9WYXJEaXJlY3RpdmVQYXJzZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAzM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMlxuICoqLyIsIi8qKlxuICogQGZpbGUg57uE5Lu25Z+657G7XG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20pXG4gKi9cblxudmFyIEJhc2UgPSByZXF1aXJlKCd2dHBsL3NyYy9CYXNlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZS5leHRlbmRzKFxuICAgIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICog57uE5Lu25Yid5aeL5YyWXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICovXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHt9LFxuXG4gICAgICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiAoKSB7fSxcblxuICAgICAgICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uICgpIHt9LFxuXG4gICAgICAgIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiAoKSB7fSxcblxuICAgICAgICByZWY6IGZ1bmN0aW9uIChyZWYpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlci5yZWYocmVmKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog57uE5Lu25qih5p2/44CC5a2Q57G75Y+v5Lul6KaG55uW6L+Z5Liq5bGe5oCn44CCXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIHRwbDogJycsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOmUgOavgVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqL1xuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmJlZm9yZURlc3Ryb3koKTtcblxuICAgICAgICAgICAgdGhpcy5hZnRlckRlc3Ryb3koKTtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXREYXRhOiBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMucGFyc2VyLnNldEF0dHIobmFtZSwgdmFsdWUpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldERhdGE6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZXIuZ2V0QXR0cihuYW1lKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5bmoLflvI/lrZfnrKbkuLLjgIJcbiAgICAgICAgICpcbiAgICAgICAgICogQHN0YXRpY1xuICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IOagt+W8j+Wtl+espuS4slxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0U3R5bGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfSxcblxuICAgICAgICAkbmFtZTogJ0NvbXBvbmVudCdcbiAgICB9XG4pO1xuXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Zjb21wb25lbnQvc3JjL0NvbXBvbmVudC5qc1xuICoqIG1vZHVsZSBpZCA9IDM0XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxidXR0b24gY2xhc3M9XFxcIiR7Y2xhc3N9XFxcIiBldmVudC1jbGljaz1cXFwiJHtvbkNsaWNrKGV2ZW50KX1cXFwiPlxcbiAgICA8IS0tIGNoaWxkcmVuIC0tPlxcbjwvYnV0dG9uPlwiO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvQnV0dG9uL0J1dHRvbi50cGwuaHRtbFxuICoqIG1vZHVsZSBpZCA9IDM1XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyXG4gKiovIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIuYnV0dG9uLFxcbi5idXR0b246YWN0aXZlIHtcXG4gIGJhY2tncm91bmQ6ICNmNmY2ZjY7XFxuICBoZWlnaHQ6IDMwcHg7XFxuICBvdXRsaW5lOiBub25lO1xcbiAgYm9yZGVyOiBub25lO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG4uYnV0dG9uOmhvdmVyIHtcXG4gIG9wYWNpdHk6IC44O1xcbn1cXG4uYnV0dG9uOmFjdGl2ZSB7XFxuICBvcGFjaXR5OiAxO1xcbn1cXG4uYnV0dG9uLnNraW4tcHJpbWFyeSB7XFxuICBiYWNrZ3JvdW5kOiAjNzBjY2MwO1xcbiAgY29sb3I6ICNmZmY7XFxufVxcbi5idXR0b24uc2tpbi1zdWNjZXNzIHtcXG4gIGJhY2tncm91bmQ6ICM4MGRkYTE7XFxuICBjb2xvcjogI2ZmZjtcXG59XFxuLmJ1dHRvbi5za2luLWluZm8ge1xcbiAgYmFja2dyb3VuZDogIzZiZDVlYztcXG4gIGNvbG9yOiAjZmZmO1xcbn1cXG4uYnV0dG9uLnNraW4td2FybmluZyB7XFxuICBiYWNrZ3JvdW5kOiAjZjlhZDQyO1xcbiAgY29sb3I6ICNmZmY7XFxufVxcbi5idXR0b24uc2tpbi1kYW5nZXIge1xcbiAgYmFja2dyb3VuZDogI2YxNmM2YztcXG4gIGNvbG9yOiAjZmZmO1xcbn1cXG4uYnV0dG9uLnNraW4tbGluayB7XFxuICBjb2xvcjogIzcwY2NjMDtcXG4gIGJhY2tncm91bmQ6IG5vbmU7XFxufVxcblwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvQnV0dG9uL0J1dHRvbi5sZXNzXG4gKiogbW9kdWxlIGlkID0gMzZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDJcbiAqKi8iLCIvKlxyXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXHJcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxyXG4qL1xyXG4vLyBjc3MgYmFzZSBjb2RlLCBpbmplY3RlZCBieSB0aGUgY3NzLWxvYWRlclxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciBsaXN0ID0gW107XHJcblxyXG5cdC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcclxuXHRsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XHJcblx0XHR2YXIgcmVzdWx0ID0gW107XHJcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgaXRlbSA9IHRoaXNbaV07XHJcblx0XHRcdGlmKGl0ZW1bMl0pIHtcclxuXHRcdFx0XHRyZXN1bHQucHVzaChcIkBtZWRpYSBcIiArIGl0ZW1bMl0gKyBcIntcIiArIGl0ZW1bMV0gKyBcIn1cIik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmVzdWx0LnB1c2goaXRlbVsxXSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiByZXN1bHQuam9pbihcIlwiKTtcclxuXHR9O1xyXG5cclxuXHQvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxyXG5cdGxpc3QuaSA9IGZ1bmN0aW9uKG1vZHVsZXMsIG1lZGlhUXVlcnkpIHtcclxuXHRcdGlmKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKVxyXG5cdFx0XHRtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCBcIlwiXV07XHJcblx0XHR2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xyXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGlkID0gdGhpc1tpXVswXTtcclxuXHRcdFx0aWYodHlwZW9mIGlkID09PSBcIm51bWJlclwiKVxyXG5cdFx0XHRcdGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGZvcihpID0gMDsgaSA8IG1vZHVsZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGl0ZW0gPSBtb2R1bGVzW2ldO1xyXG5cdFx0XHQvLyBza2lwIGFscmVhZHkgaW1wb3J0ZWQgbW9kdWxlXHJcblx0XHRcdC8vIHRoaXMgaW1wbGVtZW50YXRpb24gaXMgbm90IDEwMCUgcGVyZmVjdCBmb3Igd2VpcmQgbWVkaWEgcXVlcnkgY29tYmluYXRpb25zXHJcblx0XHRcdC8vICB3aGVuIGEgbW9kdWxlIGlzIGltcG9ydGVkIG11bHRpcGxlIHRpbWVzIHdpdGggZGlmZmVyZW50IG1lZGlhIHF1ZXJpZXMuXHJcblx0XHRcdC8vICBJIGhvcGUgdGhpcyB3aWxsIG5ldmVyIG9jY3VyIChIZXkgdGhpcyB3YXkgd2UgaGF2ZSBzbWFsbGVyIGJ1bmRsZXMpXHJcblx0XHRcdGlmKHR5cGVvZiBpdGVtWzBdICE9PSBcIm51bWJlclwiIHx8ICFhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XHJcblx0XHRcdFx0aWYobWVkaWFRdWVyeSAmJiAhaXRlbVsyXSkge1xyXG5cdFx0XHRcdFx0aXRlbVsyXSA9IG1lZGlhUXVlcnk7XHJcblx0XHRcdFx0fSBlbHNlIGlmKG1lZGlhUXVlcnkpIHtcclxuXHRcdFx0XHRcdGl0ZW1bMl0gPSBcIihcIiArIGl0ZW1bMl0gKyBcIikgYW5kIChcIiArIG1lZGlhUXVlcnkgKyBcIilcIjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bGlzdC5wdXNoKGl0ZW0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fTtcclxuXHRyZXR1cm4gbGlzdDtcclxufTtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL34vY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcbiAqKiBtb2R1bGUgaWQgPSAzN1xuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMlxuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=