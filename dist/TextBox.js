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

	var TextBox = __webpack_require__(46);
	var vcomponent = __webpack_require__(4);
	
	var Main = vcomponent.Component.extends(
	    {
	        tpl: __webpack_require__(49),
	        componentClasses: [TextBox],
	        componentDidMount: function () {
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
/* 1 */,
/* 2 */,
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
	                for (var j = 0, jl = branch.length; j < jl; ++j) {
	                    branch[j].parser.setAttr('class', classList);
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
/* 35 */,
/* 36 */,
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


/***/ },
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file 文本输入框
	 * @author yibuyisheng(yibuyisheng@163.com)
	 */
	
	var Control = __webpack_require__(3);
	
	module.exports = Control.extends(
	    {
	        tpl: __webpack_require__(47)
	    },
	    {
	        $name: 'TextBox',
	        getStyle: function () {
	            return __webpack_require__(48)[0][1];
	        }
	    }
	);


/***/ },
/* 47 */
/***/ function(module, exports) {

	module.exports = "<!-- if: ${mode} === 'multiple' -->\n    <textarea placeholder=\"${placeholder}\"></textarea>\n<!-- else -->\n    <input placeholder=\"${placeholder}\" />\n<!-- /if -->\n";

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(37)();
	// imports
	
	
	// module
	exports.push([module.id, ".text-box {\n  height: 35px;\n  box-sizing: border-box;\n  padding: 7px;\n  border: 1px solid #dddddd;\n}\n.text-box:focus {\n  outline: none;\n  border-color: #70ccc0;\n}\ntextarea.text-box {\n  resize: none;\n  height: 80px;\n  width: 200px;\n  vertical-align: middle;\n}\n", ""]);
	
	// exports


/***/ },
/* 49 */
/***/ function(module, exports) {

	module.exports = "<ui-text-box placeholder=\"单行\"></ui-text-box>\n<ui-text-box mode=\"multiple\" placeholder=\"多行\"></ui-text-box>";

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYjZhZWJiMDg2NGY2YmM4NWQ1ZGQiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9UZXh0Qm94LmpzIiwid2VicGFjazovLy8uL3NyYy9Db250cm9sLmpzIiwid2VicGFjazovLy8uLi92Y29tcG9uZW50L3NyYy9tYWluLmpzIiwid2VicGFjazovLy8uLi92Y29tcG9uZW50L3NyYy9DaGlsZHJlbkRpcmVjdGl2ZVBhcnNlci5qcyIsIndlYnBhY2s6Ly8vLi4vdnRwbC9zcmMvcGFyc2Vycy9EaXJlY3RpdmVQYXJzZXIuanMiLCJ3ZWJwYWNrOi8vLy4uL3Z0cGwvc3JjL3BhcnNlcnMvUGFyc2VyLmpzIiwid2VicGFjazovLy8uLi92dHBsL3NyYy9CYXNlLmpzIiwid2VicGFjazovLy8uLi92dHBsL3NyYy9pbmhlcml0LmpzIiwid2VicGFjazovLy8uLi92dHBsL3NyYy91dGlscy5qcyIsIndlYnBhY2s6Ly8vLi4vdmNvbXBvbmVudC9zcmMvQ2hpbGRyZW5UcmVlLmpzIiwid2VicGFjazovLy8uLi92dHBsL3NyYy90cmVlcy9UcmVlLmpzIiwid2VicGFjazovLy8uLi92dHBsL3NyYy9FeHByQ2FsY3VsYXRlci5qcyIsIndlYnBhY2s6Ly8vLi4vdnRwbC9zcmMvRG9tVXBkYXRlci5qcyIsIndlYnBhY2s6Ly8vLi4vdnRwbC9zcmMvbG9nLmpzIiwid2VicGFjazovLy8uLi92dHBsL3NyYy9TY29wZU1vZGVsLmpzIiwid2VicGFjazovLy8uLi92dHBsL3NyYy9FdmVudC5qcyIsIndlYnBhY2s6Ly8vLi4vdmNvbXBvbmVudC9zcmMvRm9yRGlyZWN0aXZlUGFyc2VyLmpzIiwid2VicGFjazovLy8uLi92dHBsL3NyYy9wYXJzZXJzL0ZvckRpcmVjdGl2ZVBhcnNlci5qcyIsIndlYnBhY2s6Ly8vLi4vdnRwbC9zcmMvdHJlZXMvRm9yVHJlZS5qcyIsIndlYnBhY2s6Ly8vLi4vdmNvbXBvbmVudC9zcmMvSWZEaXJlY3RpdmVQYXJzZXIuanMiLCJ3ZWJwYWNrOi8vLy4uL3Z0cGwvc3JjL3BhcnNlcnMvSWZEaXJlY3RpdmVQYXJzZXIuanMiLCJ3ZWJwYWNrOi8vLy4uL3Zjb21wb25lbnQvc3JjL0NvbXBvbmVudFBhcnNlci5qcyIsIndlYnBhY2s6Ly8vLi4vdnRwbC9zcmMvcGFyc2Vycy9FdmVudEV4cHJQYXJzZXIuanMiLCJ3ZWJwYWNrOi8vLy4uL3Z0cGwvc3JjL3BhcnNlcnMvRXhwclBhcnNlci5qcyIsIndlYnBhY2s6Ly8vLi4vdmNvbXBvbmVudC9zcmMvQ29tcG9uZW50VHJlZS5qcyIsIndlYnBhY2s6Ly8vLi4vdmNvbXBvbmVudC9zcmMvQ29tcG9uZW50TWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi4vdmNvbXBvbmVudC9zcmMvQ29tcG9uZW50Q2hpbGRyZW4uanMiLCJ3ZWJwYWNrOi8vLy4uL3Z0cGwvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi4vdnRwbC9zcmMvcGFyc2Vycy9TY29wZURpcmVjdGl2ZVBhcnNlci5qcyIsIndlYnBhY2s6Ly8vLi4vdnRwbC9zcmMvQ29uZmlnLmpzIiwid2VicGFjazovLy8uLi92dHBsL3NyYy9EaXJ0eUNoZWNrZXIuanMiLCJ3ZWJwYWNrOi8vLy4uL3Z0cGwvc3JjL3BhcnNlcnMvVmFyRGlyZWN0aXZlUGFyc2VyLmpzIiwid2VicGFjazovLy8uLi92Y29tcG9uZW50L3NyYy9Db21wb25lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvVGV4dEJveC9UZXh0Qm94LmpzIiwid2VicGFjazovLy8uL3NyYy9UZXh0Qm94L1RleHRCb3gudHBsLmh0bWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL1RleHRCb3gvVGV4dEJveC5sZXNzIiwid2VicGFjazovLy8uL3Rlc3QvVGV4dEJveC50cGwuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FB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QSxNQUFLO0FBQ0w7Ozs7Ozs7QUNwREE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQy9DQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0RBQW1ELFFBQVE7QUFDM0Q7QUFDQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDJDQUEwQyxRQUFRO0FBQ2xEO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxjQUFhO0FBQ2I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0EsY0FBYTs7QUFFYjtBQUNBO0FBQ0EsY0FBYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQWtELFFBQVE7QUFDMUQ7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBOzs7Ozs7O0FDcktBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBbUIsZUFBZTtBQUNsQztBQUNBO0FBQ0EsdURBQXNELFFBQVE7QUFDOUQ7QUFDQSxvREFBbUQsUUFBUTtBQUMzRDtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTs7QUFFYjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQSwrQ0FBOEMsUUFBUTtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1QsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3ZLQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNB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QUNqRDtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQzFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDBCQUF5QjtBQUN6Qix5QkFBd0I7O0FBRXhCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7O0FDaElBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBOztBQUVBOzs7Ozs7OztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBa0M7O0FBRWxDLDBDQUF5Qzs7QUFFekMsMkNBQTBDOztBQUUxQyw2Q0FBNEM7O0FBRTVDO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQWtCO0FBQ2xCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFvQixPQUFPO0FBQzNCO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQixpQkFBaUI7QUFDakM7QUFDQTtBQUNBLHlDQUF3QyxnQkFBZ0I7QUFDeEQsS0FBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQixpQkFBaUI7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFZLG9CQUFvQjtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNqQkEsOEJBQTZCLEtBQUssbURBQW1ELFlBQVksMERBQTBELFlBQVksdUI7Ozs7OztBQ0F2SztBQUNBOzs7QUFHQTtBQUNBLHNDQUFxQyxpQkFBaUIsMkJBQTJCLGlCQUFpQiw4QkFBOEIsR0FBRyxtQkFBbUIsa0JBQWtCLDBCQUEwQixHQUFHLHFCQUFxQixpQkFBaUIsaUJBQWlCLGlCQUFpQiwyQkFBMkIsR0FBRzs7QUFFM1M7Ozs7Ozs7QUNQQSxxSSIsImZpbGUiOiJUZXh0Qm94LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCBiNmFlYmIwODY0ZjZiYzg1ZDVkZFxuICoqLyIsInZhciBUZXh0Qm94ID0gcmVxdWlyZSgnLi4vc3JjL1RleHRCb3gvVGV4dEJveCcpO1xudmFyIHZjb21wb25lbnQgPSByZXF1aXJlKCd2Y29tcG9uZW50Jyk7XG5cbnZhciBNYWluID0gdmNvbXBvbmVudC5Db21wb25lbnQuZXh0ZW5kcyhcbiAgICB7XG4gICAgICAgIHRwbDogcmVxdWlyZSgnLi9UZXh0Qm94LnRwbC5odG1sJyksXG4gICAgICAgIGNvbXBvbmVudENsYXNzZXM6IFtUZXh0Qm94XSxcbiAgICAgICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgICAkbmFtZTogJ01haW4nXG4gICAgfVxuKTtcblxudmFyIG1haW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbicpO1xudmNvbXBvbmVudC5tb3VudChcbiAgICB7XG4gICAgICAgIGNvbmZpZzogbmV3IHZjb21wb25lbnQuQ29uZmlnKCksXG4gICAgICAgIHN0YXJ0Tm9kZTogbWFpbixcbiAgICAgICAgZW5kTm9kZTogbWFpblxuICAgIH0sXG4gICAgW01haW5dXG4pO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3Rlc3QvVGV4dEJveC5qc1xuICoqIG1vZHVsZSBpZCA9IDBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMlxuICoqLyIsInZhciB2Y29tcG9uZW50ID0gcmVxdWlyZSgndmNvbXBvbmVudCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHZjb21wb25lbnQuQ29tcG9uZW50LmV4dGVuZHMoe30sIHskbmFtZTogJ0NvbnRyb2wnfSk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL0NvbnRyb2wuanNcbiAqKiBtb2R1bGUgaWQgPSAzXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyIDNcbiAqKi8iLCJyZXF1aXJlKCcuL0NoaWxkcmVuRGlyZWN0aXZlUGFyc2VyJyk7XG5yZXF1aXJlKCcuL0ZvckRpcmVjdGl2ZVBhcnNlcicpO1xucmVxdWlyZSgnLi9JZkRpcmVjdGl2ZVBhcnNlcicpO1xucmVxdWlyZSgnLi9Db21wb25lbnRQYXJzZXInKTtcblxudmFyIENvbXBvbmVudFRyZWUgPSByZXF1aXJlKCcuL0NvbXBvbmVudFRyZWUnKTtcbnZhciBkb21EYXRhQmluZCA9IHJlcXVpcmUoJ3Z0cGwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgQ29tcG9uZW50OiByZXF1aXJlKCcuL0NvbXBvbmVudCcpLFxuICAgIG1vdW50OiBmdW5jdGlvbiAob3B0aW9ucywgQ29tcG9uZW50Q2xhc3Nlcykge1xuICAgICAgICB2YXIgdHJlZSA9IG5ldyBDb21wb25lbnRUcmVlKG9wdGlvbnMpO1xuICAgICAgICB0cmVlLnJlZ2lzdGVDb21wb25lbnRzKENvbXBvbmVudENsYXNzZXMpO1xuICAgICAgICB0cmVlLnRyYXZlcnNlKCk7XG4gICAgICAgIHJldHVybiB0cmVlO1xuICAgIH0sXG4gICAgQ29uZmlnOiBkb21EYXRhQmluZC5Db25maWdcbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Zjb21wb25lbnQvc3JjL21haW4uanNcbiAqKiBtb2R1bGUgaWQgPSA0XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyIDNcbiAqKi8iLCIvKipcbiAqIEBmaWxlIGNoaWxkcmVuIOaMh+S7pCA8IS0tIGNoaWxkcmVuIC0tPiDvvIzlj6rmnInnu4Tku7bkuK3miY3kvJrlrZjlnKjor6XmjIfku6RcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG52YXIgRGlyZWN0aXZlUGFyc2VyID0gcmVxdWlyZSgndnRwbC9zcmMvcGFyc2Vycy9EaXJlY3RpdmVQYXJzZXInKTtcbnZhciBDaGlsZHJlblRyZWUgPSByZXF1aXJlKCcuL0NoaWxkcmVuVHJlZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERpcmVjdGl2ZVBhcnNlci5leHRlbmRzKFxuICAgIHtcbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIERpcmVjdGl2ZVBhcnNlci5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgICAgICAgICB0aGlzLm5vZGUgPSBvcHRpb25zLm5vZGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY29sbGVjdEV4cHJzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgY29tcG9uZW50Q2hpbGRyZW4gPSB0aGlzLnRyZWUuZ2V0VHJlZVZhcignY29tcG9uZW50Q2hpbGRyZW4nLCB0cnVlKTtcbiAgICAgICAgICAgIGlmICghY29tcG9uZW50Q2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGRpdi5pbm5lckhUTUwgPSBjb21wb25lbnRDaGlsZHJlbi5nZXRUcGxIdG1sKCk7XG5cbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5UcmVlID0gbmV3IENoaWxkcmVuVHJlZSh7XG4gICAgICAgICAgICAgICAgc3RhcnROb2RlOiBkaXYuZmlyc3RDaGlsZCxcbiAgICAgICAgICAgICAgICBlbmROb2RlOiBkaXYubGFzdENoaWxkLFxuICAgICAgICAgICAgICAgIGNvbmZpZzogdGhpcy50cmVlLmNvbmZpZyxcbiAgICAgICAgICAgICAgICBkb21VcGRhdGVyOiB0aGlzLnRyZWUuZG9tVXBkYXRlcixcbiAgICAgICAgICAgICAgICBleHByQ2FsY3VsYXRlcjogdGhpcy50cmVlLmV4cHJDYWxjdWxhdGVyXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5UcmVlLnNldFBhcmVudCh0aGlzLnRyZWUpO1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlblRyZWUudHJhdmVyc2UoKTtcblxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlblRyZWUucm9vdFNjb3BlLnNldFBhcmVudChjb21wb25lbnRDaGlsZHJlbi5zY29wZSk7XG4gICAgICAgICAgICBjb21wb25lbnRDaGlsZHJlbi5zY29wZS5hZGRDaGlsZCh0aGlzLmNoaWxkcmVuVHJlZS5yb290U2NvcGUpO1xuXG4gICAgICAgICAgICB3aGlsZSAoZGl2LmNoaWxkTm9kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGRpdi5jaGlsZE5vZGVzWzBdLCB0aGlzLm5vZGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6I635Y+W5byA5aeL6IqC54K5XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICogQGluaGVyaXREb2NcbiAgICAgICAgICogQHJldHVybiB7Tm9kZX1cbiAgICAgICAgICovXG4gICAgICAgIGdldFN0YXJ0Tm9kZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmNoaWxkcmVuVHJlZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm5vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlblRyZWUuc3RhcnROb2RlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5bnu5PmnZ/oioLngrlcbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKiBAaW5oZXJpdERvY1xuICAgICAgICAgKiBAcmV0dXJuIHtOb2RlfVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0RW5kTm9kZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubm9kZTtcbiAgICAgICAgfSxcblxuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuVHJlZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgIHRoaXMubm9kZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuVHJlZSA9IG51bGw7XG5cbiAgICAgICAgICAgIERpcmVjdGl2ZVBhcnNlci5wcm90b3R5cGUuZGVzdHJveS5hcHBseSh0aGlzKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgICBpc1Byb3Blck5vZGU6IGZ1bmN0aW9uIChub2RlLCBjb25maWcpIHtcbiAgICAgICAgICAgIHJldHVybiBub2RlLm5vZGVUeXBlID09PSA4XG4gICAgICAgICAgICAgICAgJiYgbm9kZS5ub2RlVmFsdWUucmVwbGFjZSgvXFxzL2csICcnKSA9PT0gJ2NoaWxkcmVuJztcbiAgICAgICAgfSxcblxuICAgICAgICAkbmFtZTogJ0NoaWxkcmVuRGlyZWN0aXZlUGFyc2VyJ1xuICAgIH1cbik7XG5cbkNoaWxkcmVuVHJlZS5yZWdpc3RlUGFyc2VyKG1vZHVsZS5leHBvcnRzKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdmNvbXBvbmVudC9zcmMvQ2hpbGRyZW5EaXJlY3RpdmVQYXJzZXIuanNcbiAqKiBtb2R1bGUgaWQgPSA1XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyIDNcbiAqKi8iLCIvKipcbiAqIEBmaWxlIOaMh+S7pOino+aekOWZqOaKveixoeexu+OAguaMh+S7pOiKgueCueS4gOWumuaYr+azqOmHiuiKgueCuVxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbnZhciBQYXJzZXIgPSByZXF1aXJlKCcuL1BhcnNlcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBhcnNlci5leHRlbmRzKFxuICAgIHt9LFxuICAgIHtcbiAgICAgICAgaXNQcm9wZXJOb2RlOiBmdW5jdGlvbiAobm9kZSwgY29uZmlnKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5ub2RlVHlwZSA9PT0gODtcbiAgICAgICAgfSxcbiAgICAgICAgJG5hbWU6ICdEaXJlY3RpdmVQYXJzZXInXG4gICAgfVxuKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdnRwbC9zcmMvcGFyc2Vycy9EaXJlY3RpdmVQYXJzZXIuanNcbiAqKiBtb2R1bGUgaWQgPSA2XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyIDNcbiAqKi8iLCIvKipcbiAqIEBmaWxlIOino+aekOWZqOeahOaKveixoeWfuuexu1xuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbi8qKlxuICog5p6E6YCg5Ye95pWwXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyDphY3nva7lj4LmlbDvvIzkuIDoiKzlj6/og73kvJrmnInlpoLkuIvlhoXlrrnvvJpcbiAqICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydE5vZGU6IC4uLixcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmROb2RlOiAuLi4sXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZTogLi4uLFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzogLi4uXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICDlhbfkvZPmmK/llaXlj6/ku6Xlj4LliqDlhbfkvZPnmoTlrZDnsbtcbiAqL1xuXG52YXIgQmFzZSA9IHJlcXVpcmUoJy4uL0Jhc2UnKTtcbm1vZHVsZS5leHBvcnRzID0gQmFzZS5leHRlbmRzKFxuICAgIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICog5Yid5aeL5YyWXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMg5p2l6Ieq5LqO5p6E6YCg5Ye95pWwXG4gICAgICAgICAqL1xuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgdGhpcy5leHByQ2FsY3VsYXRlciA9IG9wdGlvbnMuZXhwckNhbGN1bGF0ZXI7XG4gICAgICAgICAgICB0aGlzLmNvbmZpZyA9IG9wdGlvbnMuY29uZmlnO1xuICAgICAgICAgICAgdGhpcy5kb21VcGRhdGVyID0gb3B0aW9ucy5kb21VcGRhdGVyO1xuICAgICAgICAgICAgdGhpcy50cmVlID0gb3B0aW9ucy50cmVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDnu5HlrppzY29wZSBtb2RlbFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqIEBwYXJhbSB7U2NvcGVNb2RlbH0gc2NvcGVNb2RlbCBzY29wZSBtb2RlbFxuICAgICAgICAgKi9cbiAgICAgICAgc2V0U2NvcGU6IGZ1bmN0aW9uIChzY29wZU1vZGVsKSB7XG4gICAgICAgICAgICB0aGlzLnNjb3BlTW9kZWwgPSBzY29wZU1vZGVsO1xuXG4gICAgICAgICAgICB0aGlzLnNjb3BlTW9kZWwub24oJ2NoYW5nZScsIHRoaXMub25DaGFuZ2UsIHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5zY29wZU1vZGVsLm9uKCdwYXJlbnRjaGFuZ2UnLCB0aGlzLm9uQ2hhbmdlLCB0aGlzKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogbW9kZWwg5Y+R55Sf5Y+Y5YyW55qE5Zue6LCD5Ye95pWwXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICovXG4gICAgICAgIG9uQ2hhbmdlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmRvbVVwZGF0ZXIuZXhlY3V0ZSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5ZzY29wZSBtb2RlbFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqIEByZXR1cm4ge1Njb3BlTW9kZWx9IHNjb3BlIG1vZGVs5a+56LGhXG4gICAgICAgICAqL1xuICAgICAgICBnZXRTY29wZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2NvcGVNb2RlbDtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog5ZCRc2NvcGUgbW9kZWzph4zpnaLorr7nva7mlbDmja5cbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSDopoHorr7nva7nmoTmlbDmja5cbiAgICAgICAgICovXG4gICAgICAgIHNldERhdGE6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICB0aGlzLnNjb3BlTW9kZWwuc2V0KGRhdGEpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDpmpDol4/lvZPliY1wYXJzZXLlrp7kvovnm7jlhbPnmoToioLngrnjgILlhbfkvZPlrZDnsbvlrp7njrBcbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAYWJzdHJhY3RcbiAgICAgICAgICovXG4gICAgICAgIGdvRGFyazogZnVuY3Rpb24gKCkge30sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOaYvuekuuebuOWFs+WFg+e0oFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqIEBhYnN0cmFjdFxuICAgICAgICAgKi9cbiAgICAgICAgcmVzdG9yZUZyb21EYXJrOiBmdW5jdGlvbiAoKSB7fSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6I635Y+W6Kej5p6Q5Zmo5b2T5YmN54q25oCB5LiL55qE5byA5aeLRE9N6IqC54K544CCXG4gICAgICAgICAqXG4gICAgICAgICAqIOeUseS6juacieeahOino+aekOWZqOS8muWwhuS5i+WJjeeahOiKgueCueenu+mZpOaOie+8jOmCo+S5iOWwseS8muWvuemBjeWOhuW4puadpeW9seWTjeS6hu+8jFxuICAgICAgICAgKiDmiYDku6XmraTlpITmj5DkvpvkuKTkuKrojrflj5blvIDlp4voioLngrnlkoznu5PmnZ/oioLngrnnmoTmlrnms5XjgIJcbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAcmV0dXJuIHtOb2RlfSBET03oioLngrnlr7nosaFcbiAgICAgICAgICovXG4gICAgICAgIGdldFN0YXJ0Tm9kZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RhcnROb2RlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5bop6PmnpDlmajlvZPliY3nirbmgIHkuIvnmoTnu5PmnZ9ET03oioLngrlcbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAcmV0dXJuIHtOb2RlfSDoioLngrnlr7nosaFcbiAgICAgICAgICovXG4gICAgICAgIGdldEVuZE5vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVuZE5vZGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOaQnOmbhuihqOi+vuW8j++8jOeUn+aIkOihqOi+vuW8j+WHveaVsOWSjCBET00g5pu05paw5Ye95pWw44CC5YW35L2T5a2Q57G75a6e546wXG4gICAgICAgICAqXG4gICAgICAgICAqIEBhYnN0cmFjdFxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqL1xuICAgICAgICBjb2xsZWN0RXhwcnM6IGZ1bmN0aW9uICgpIHt9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDohI/mo4DmtYvjgILpu5jorqTkvJrkvb/nlKjlhajnrYnliKTmlq3jgIJcbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IGV4cHIgICAgICAgICDopoHmo4Dmn6XnmoTooajovr7lvI9cbiAgICAgICAgICogQHBhcmFtICB7Kn0gZXhwclZhbHVlICAgIOihqOi+vuW8j+W9k+WJjeiuoeeul+WHuuadpeeahOWAvFxuICAgICAgICAgKiBAcGFyYW0gIHsqfSBleHByT2xkVmFsdWUg6KGo6L6+5byP5LiK5LiA5qyh6K6h566X5Ye65p2l55qE5YC8XG4gICAgICAgICAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgICDkuKTmrKHnmoTlgLzmmK/lkKbnm7jlkIxcbiAgICAgICAgICovXG4gICAgICAgIGRpcnR5Q2hlY2s6IGZ1bmN0aW9uIChleHByLCBleHByVmFsdWUsIGV4cHJPbGRWYWx1ZSkge1xuICAgICAgICAgICAgdmFyIGRpcnR5Q2hlY2tlckZuID0gdGhpcy5kaXJ0eUNoZWNrZXIgPyB0aGlzLmRpcnR5Q2hlY2tlci5nZXRDaGVja2VyKGV4cHIpIDogbnVsbDtcbiAgICAgICAgICAgIHJldHVybiAoZGlydHlDaGVja2VyRm4gJiYgZGlydHlDaGVja2VyRm4oZXhwciwgZXhwclZhbHVlLCBleHByT2xkVmFsdWUpKVxuICAgICAgICAgICAgICAgICAgICB8fCAoIWRpcnR5Q2hlY2tlckZuICYmIGV4cHJWYWx1ZSAhPT0gZXhwck9sZFZhbHVlKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6K6+572u6ISP5qOA5rWL5ZmoXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwdWJsaWNcbiAgICAgICAgICogQHBhcmFtIHtEaXJ0eUNoZWNrZXJ9IGRpcnR5Q2hlY2tlciDohI/mo4DmtYvlmahcbiAgICAgICAgICovXG4gICAgICAgIHNldERpcnR5Q2hlY2tlcjogZnVuY3Rpb24gKGRpcnR5Q2hlY2tlcikge1xuICAgICAgICAgICAgdGhpcy5kaXJ0eUNoZWNrZXIgPSBkaXJ0eUNoZWNrZXI7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOmUgOavgeino+aekOWZqO+8jOWwhueVjOmdouaBouWkjeaIkOWOn+agt1xuICAgICAgICAgKlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqL1xuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmV4cHJDYWxjdWxhdGVyID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuZG9tVXBkYXRlciA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLnRyZWUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5kaXJ0eUNoZWNrZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICAgICRuYW1lOiAnUGFyc2VyJ1xuICAgIH1cbik7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Z0cGwvc3JjL3BhcnNlcnMvUGFyc2VyLmpzXG4gKiogbW9kdWxlIGlkID0gN1xuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzXG4gKiovIiwiLyoqXG4gKiBAZmlsZSDmiYDmnInnsbvnmoTln7rnsbtcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG52YXIgaW5oZXJpdCA9IHJlcXVpcmUoJy4vaW5oZXJpdCcpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG5mdW5jdGlvbiBCYXNlKCkge1xuICAgIHRoaXMuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG5CYXNlLnByb3RvdHlwZS5pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge307XG5cbi8qKlxuICog57un5om/XG4gKlxuICogQHN0YXRpY1xuICogQHBhcmFtICB7T2JqZWN0fSBwcm9wcyAgICAgICDmma7pgJrlsZ7mgKdcbiAqIEBwYXJhbSAge09iamVjdH0gc3RhdGljUHJvcHMg6Z2Z5oCB5bGe5oCnXG4gKiBAcmV0dXJuIHtDbGFzc30gICAgICAgICAgICAg5a2Q57G7XG4gKi9cbkJhc2UuZXh0ZW5kcyA9IGZ1bmN0aW9uIChwcm9wcywgc3RhdGljUHJvcHMpIHtcbiAgICAvLyDmr4/kuKrnsbvpg73lv4XpobvmnInkuIDkuKrlkI3lrZdcbiAgICBpZiAoIXN0YXRpY1Byb3BzIHx8ICFzdGF0aWNQcm9wcy4kbmFtZSkge1xuICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoJ2VhY2ggY2xhc3MgbXVzdCBoYXZlIGEgYCRuYW1lYC4nKTtcbiAgICB9XG5cbiAgICB2YXIgYmFzZUNscyA9IHRoaXM7XG5cbiAgICB2YXIgY2xzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBiYXNlQ2xzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgICB1dGlscy5leHRlbmQoY2xzLnByb3RvdHlwZSwgcHJvcHMpO1xuICAgIHV0aWxzLmV4dGVuZChjbHMsIHN0YXRpY1Byb3BzKTtcblxuICAgIC8vIOiusOW9leS4gOS4i+eItuexu1xuICAgIGNscy4kc3VwZXJDbGFzcyA9IGJhc2VDbHM7XG5cbiAgICByZXR1cm4gaW5oZXJpdChjbHMsIGJhc2VDbHMpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYXNlO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL3NyYy9CYXNlLmpzXG4gKiogbW9kdWxlIGlkID0gOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzXG4gKiovIiwiLyoqXG4gKiBAZmlsZSDnu6fmib9cbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG5mdW5jdGlvbiBpbmhlcml0KENoaWxkQ2xhc3MsIFBhcmVudENsYXNzKSB7XG4gICAgZnVuY3Rpb24gQ2xzKCkge31cblxuICAgIENscy5wcm90b3R5cGUgPSBQYXJlbnRDbGFzcy5wcm90b3R5cGU7XG4gICAgdmFyIGNoaWxkUHJvdG8gPSBDaGlsZENsYXNzLnByb3RvdHlwZTtcbiAgICBDaGlsZENsYXNzLnByb3RvdHlwZSA9IG5ldyBDbHMoKTtcbiAgICBDaGlsZENsYXNzLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IENoaWxkQ2xhc3M7XG5cbiAgICB2YXIga2V5O1xuICAgIGZvciAoa2V5IGluIGNoaWxkUHJvdG8pIHtcbiAgICAgICAgQ2hpbGRDbGFzcy5wcm90b3R5cGVba2V5XSA9IGNoaWxkUHJvdG9ba2V5XTtcbiAgICB9XG5cbiAgICAvLyDnu6fmib/pnZnmgIHlsZ7mgKdcbiAgICBmb3IgKGtleSBpbiBQYXJlbnRDbGFzcykge1xuICAgICAgICBpZiAoUGFyZW50Q2xhc3MuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgaWYgKENoaWxkQ2xhc3Nba2V5XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgQ2hpbGRDbGFzc1trZXldID0gUGFyZW50Q2xhc3Nba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBDaGlsZENsYXNzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluaGVyaXQ7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Z0cGwvc3JjL2luaGVyaXQuanNcbiAqKiBtb2R1bGUgaWQgPSA5XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyIDNcbiAqKi8iLCIvKipcbiAqIEBmaWxlIOS4gOWghumhueebrumHjOmdouW4uOeUqOeahOaWueazlVxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbmV4cG9ydHMuc2xpY2UgPSBmdW5jdGlvbiAoYXJyLCBzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyciwgc3RhcnQsIGVuZCk7XG59O1xuXG5leHBvcnRzLmdvRGFyayA9IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgbm9kZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH1cbiAgICBlbHNlIGlmIChub2RlLm5vZGVUeXBlID09PSAzKSB7XG4gICAgICAgIG5vZGUuX190ZXh0X18gPSBub2RlLm5vZGVWYWx1ZTtcbiAgICAgICAgbm9kZS5ub2RlVmFsdWUgPSAnJztcbiAgICB9XG59O1xuXG5leHBvcnRzLnJlc3RvcmVGcm9tRGFyayA9IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgbm9kZS5zdHlsZS5kaXNwbGF5ID0gbnVsbDtcbiAgICB9XG4gICAgZWxzZSBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMykge1xuICAgICAgICBpZiAobm9kZS5fX3RleHRfXyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBub2RlLm5vZGVWYWx1ZSA9IG5vZGUuX190ZXh0X187XG4gICAgICAgICAgICBub2RlLl9fdGV4dF9fID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuZXhwb3J0cy5jcmVhdGVFeHByRm4gPSBmdW5jdGlvbiAoZXhwclJlZ0V4cCwgZXhwciwgZXhwckNhbGN1bGF0ZXIpIHtcbiAgICBleHByID0gZXhwci5yZXBsYWNlKGV4cHJSZWdFeHAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3VtZW50c1sxXTtcbiAgICB9KTtcbiAgICBleHByQ2FsY3VsYXRlci5jcmVhdGVFeHByRm4oZXhwcik7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKHNjb3BlTW9kZWwpIHtcbiAgICAgICAgcmV0dXJuIGV4cHJDYWxjdWxhdGVyLmNhbGN1bGF0ZShleHByLCBmYWxzZSwgc2NvcGVNb2RlbCk7XG4gICAgfTtcbn07XG5cbi8qKlxuICog6LaF57qn566A5Y2V55qEIGV4dGVuZCDvvIzlm6DkuLrmnKzlupPlr7kgZXh0ZW5kIOayoemCo+mrmOeahOimgeaxgu+8jFxuICog562J5Yiw5pyJ6KaB5rGC55qE5pe25YCZ5YaN5a6M5ZaE44CCXG4gKlxuICogQGlubmVyXG4gKiBAcGFyYW0gIHtPYmplY3R9IHRhcmdldCDnm67moIflr7nosaFcbiAqIEByZXR1cm4ge09iamVjdH0gICAgICAgIOacgOe7iOWQiOW5tuWQjueahOWvueixoVxuICovXG5leHBvcnRzLmV4dGVuZCA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICB2YXIgc3JjcyA9IGV4cG9ydHMuc2xpY2UoYXJndW1lbnRzLCAxKTtcbiAgICBmb3IgKHZhciBpID0gMCwgaWwgPSBzcmNzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgICAgLyogZXNsaW50LWRpc2FibGUgZ3VhcmQtZm9yLWluICovXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBzcmNzW2ldKSB7XG4gICAgICAgICAgICB0YXJnZXRba2V5XSA9IHNyY3NbaV1ba2V5XTtcbiAgICAgICAgfVxuICAgICAgICAvKiBlc2xpbnQtZW5hYmxlIGd1YXJkLWZvci1pbiAqL1xuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0O1xufTtcblxuZXhwb3J0cy50cmF2ZXJzZU5vQ2hhbmdlTm9kZXMgPSBmdW5jdGlvbiAoc3RhcnROb2RlLCBlbmROb2RlLCBub2RlRm4sIGNvbnRleHQpIHtcbiAgICBmb3IgKHZhciBjdXJOb2RlID0gc3RhcnROb2RlO1xuICAgICAgICBjdXJOb2RlICYmIGN1ck5vZGUgIT09IGVuZE5vZGU7XG4gICAgICAgIGN1ck5vZGUgPSBjdXJOb2RlLm5leHRTaWJsaW5nXG4gICAgKSB7XG4gICAgICAgIGlmIChub2RlRm4uY2FsbChjb250ZXh0LCBjdXJOb2RlKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbm9kZUZuLmNhbGwoY29udGV4dCwgZW5kTm9kZSk7XG59O1xuXG5leHBvcnRzLnRyYXZlcnNlTm9kZXMgPSBmdW5jdGlvbiAoc3RhcnROb2RlLCBlbmROb2RlLCBub2RlRm4sIGNvbnRleHQpIHtcbiAgICB2YXIgbm9kZXMgPSBbXTtcbiAgICBmb3IgKHZhciBjdXJOb2RlID0gc3RhcnROb2RlO1xuICAgICAgICBjdXJOb2RlICYmIGN1ck5vZGUgIT09IGVuZE5vZGU7XG4gICAgICAgIGN1ck5vZGUgPSBjdXJOb2RlLm5leHRTaWJsaW5nXG4gICAgKSB7XG4gICAgICAgIG5vZGVzLnB1c2goY3VyTm9kZSk7XG4gICAgfVxuXG4gICAgbm9kZXMucHVzaChlbmROb2RlKTtcblxuICAgIGV4cG9ydHMuZWFjaChub2Rlcywgbm9kZUZuLCBjb250ZXh0KTtcbn07XG5cbmV4cG9ydHMuZWFjaCA9IGZ1bmN0aW9uIChhcnIsIGZuLCBjb250ZXh0KSB7XG4gICAgaWYgKGV4cG9ydHMuaXNBcnJheShhcnIpKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IGFyci5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZm4uY2FsbChjb250ZXh0LCBhcnJbaV0sIGksIGFycikpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgYXJyID09PSAnb2JqZWN0Jykge1xuICAgICAgICBmb3IgKHZhciBrIGluIGFycikge1xuICAgICAgICAgICAgaWYgKGZuLmNhbGwoY29udGV4dCwgYXJyW2tdLCBrLCBhcnIpKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5mdW5jdGlvbiBpc0NsYXNzKG9iaiwgY2xzTmFtZSkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgJyArIGNsc05hbWUgKyAnXSc7XG59XG5cbmV4cG9ydHMuaXNBcnJheSA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgICByZXR1cm4gaXNDbGFzcyhhcnIsICdBcnJheScpO1xufTtcblxuZXhwb3J0cy5pc051bWJlciA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICByZXR1cm4gaXNDbGFzcyhvYmosICdOdW1iZXInKTtcbn07XG5cbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICByZXR1cm4gaXNDbGFzcyhvYmosICdGdW5jdGlvbicpO1xufTtcblxuLyoqXG4gKiDmmK/lkKbmmK/kuIDkuKrnuq/lr7nosaHvvIzmu6HotrPlpoLkuIvmnaHku7bvvJpcbiAqXG4gKiAx44CB6Zmk5LqG5YaF572u5bGe5oCn5LmL5aSW77yM5rKh5pyJ5YW25LuW57un5om/5bGe5oCn77ybXG4gKiAy44CBY29uc3RydWN0b3Ig5pivIE9iamVjdFxuICpcbiAqIEBwYXJhbSB7QW55fSBvYmog5b6F5Yik5pat55qE5Y+Y6YePXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5leHBvcnRzLmlzUHVyZU9iamVjdCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICBpZiAoIWlzQ2xhc3Mob2JqLCAnT2JqZWN0JykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGZvciAodmFyIGsgaW4gb2JqKSB7XG4gICAgICAgIGlmICghb2JqLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn07XG5cbmV4cG9ydHMuaXNDbGFzcyA9IGlzQ2xhc3M7XG5cbmV4cG9ydHMuYmluZCA9IGZ1bmN0aW9uIChmbiwgdGhpc0FyZykge1xuICAgIGlmICghZXhwb3J0cy5pc0Z1bmN0aW9uKGZuKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGJpbmQgPSBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCB8fCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICB2YXIgb2JqID0gYXJncy5sZW5ndGggPiAwID8gYXJnc1swXSA6IHVuZGVmaW5lZDtcbiAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB0b3RhbEFyZ3MgPSBBcnJheS5wcm90b3R5cGUuY29uY2F0LmFwcGx5KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3MsIDEpLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgcmV0dXJuIG1lLmFwcGx5KG9iaiwgdG90YWxBcmdzKTtcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIHJldHVybiBiaW5kLmFwcGx5KGZuLCBbdGhpc0FyZ10uY29uY2F0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMikpKTtcbn07XG5cbmV4cG9ydHMuaXNTdWJDbGFzc09mID0gZnVuY3Rpb24gKFN1YkNsYXNzLCBTdXBlckNsYXNzKSB7XG4gICAgcmV0dXJuIFN1YkNsYXNzLnByb3RvdHlwZSBpbnN0YW5jZW9mIFN1cGVyQ2xhc3M7XG59O1xuXG4vKipcbiAqIOWvueS8oOWFpeeahOWtl+espuS4sui/m+ihjOWIm+W7uuato+WImeihqOi+vuW8j+S5i+WJjeeahOi9rOS5ie+8jOmYsuatouWtl+espuS4suS4reeahOS4gOS6m+Wtl+espuaIkOS4uuWFs+mUruWtl+OAglxuICpcbiAqIEBwYXJhbSAge3N0cmluZ30gc3RyIOW+hei9rOS5ieeahOWtl+espuS4slxuICogQHJldHVybiB7c3RyaW5nfSAgICAg6L2s5LmJ5LmL5ZCO55qE5a2X56ym5LiyXG4gKi9cbmV4cG9ydHMucmVnRXhwRW5jb2RlID0gZnVuY3Rpb24gcmVnRXhwRW5jb2RlKHN0cikge1xuICAgIHJldHVybiAnXFxcXCcgKyBzdHIuc3BsaXQoJycpLmpvaW4oJ1xcXFwnKTtcbn07XG5cbmV4cG9ydHMueGhyID0gZnVuY3Rpb24gKG9wdGlvbnMsIGxvYWRGbiwgZXJyb3JGbikge1xuICAgIG9wdGlvbnMgPSBleHBvcnRzLmV4dGVuZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCdcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICB4aHIub25lcnJvciA9IGVycm9yRm47XG4gICAgeGhyLm9ubG9hZCA9IGxvYWRGbjtcbiAgICB4aHIub3BlbihvcHRpb25zLm1ldGhvZCwgb3B0aW9ucy51cmwsIHRydWUpO1xuICAgIHNldEhlYWRlcnMob3B0aW9ucy5oZWFkZXJzLCB4aHIpO1xuICAgIHhoci5zZW5kKG9wdGlvbnMuYm9keSk7XG59O1xuXG4vKipcbiAqIOWwhuWtl+espuS4suS4reeahOmpvOWzsOWRveWQjeaWueW8j+aUueS4uuefreaoque6v+eahOW9ouW8j1xuICpcbiAqIEBwdWJsaWNcbiAqIEBwYXJhbSAge3N0cmluZ30gc3RyIOimgei9rOaNoueahOWtl+espuS4slxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnRzLmNhbWVsMmxpbmUgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bQS1aXS9nLCBmdW5jdGlvbiAobWF0Y2hlZCwgaW5kZXgpIHtcbiAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gbWF0Y2hlZC50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAnLScgKyBtYXRjaGVkLnRvTG93ZXJDYXNlKCk7XG4gICAgfSk7XG59O1xuXG4vKipcbiAqIOWwhuWtl+espuS4suS4reeahOefreaoque6v+WRveWQjeaWueW8j+aUueS4uumpvOWzsOeahOW9ouW8j1xuICpcbiAqIEBwdWJsaWNcbiAqIEBwYXJhbSAge3N0cmluZ30gc3RyIOimgei9rOaNoueahOWtl+espuS4slxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnRzLmxpbmUyY2FtZWwgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC8tW2Etel0vZywgZnVuY3Rpb24gKG1hdGNoZWQpIHtcbiAgICAgICAgcmV0dXJuIG1hdGNoZWRbMV0udG9VcHBlckNhc2UoKTtcbiAgICB9KTtcbn07XG5cbmV4cG9ydHMuZGlzdGluY3RBcnIgPSBmdW5jdGlvbiAoYXJyLCBoYXNoRm4pIHtcbiAgICBoYXNoRm4gPSBleHBvcnRzLmlzRnVuY3Rpb24oaGFzaEZuKSA/IGhhc2hGbiA6IGZ1bmN0aW9uIChlbGVtKSB7XG4gICAgICAgIHJldHVybiBTdHJpbmcoZWxlbSk7XG4gICAgfTtcbiAgICB2YXIgb2JqID0ge307XG4gICAgZm9yICh2YXIgaSA9IDAsIGlsID0gYXJyLmxlbmd0aDsgaSA8IGlsOyArK2kpIHtcbiAgICAgICAgb2JqW2hhc2hGbihhcnJbaV0pXSA9IGFycltpXTtcbiAgICB9XG5cbiAgICB2YXIgcmV0ID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgICBpZiAoIW9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldC5wdXNoKG9ialtrZXldKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xufTtcblxuXG5mdW5jdGlvbiBzZXRIZWFkZXJzKGhlYWRlcnMsIHhocikge1xuICAgIGlmICghaGVhZGVycykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yICh2YXIgayBpbiBoZWFkZXJzKSB7XG4gICAgICAgIGlmICghaGVhZGVycy5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoaywgaGVhZGVyc1trXSk7XG4gICAgfVxufVxuXG5cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdnRwbC9zcmMvdXRpbHMuanNcbiAqKiBtb2R1bGUgaWQgPSAxMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzXG4gKiovIiwiLyoqXG4gKiBAZmlsZSDlrZDmoJFcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG52YXIgVHJlZSA9IHJlcXVpcmUoJ3Z0cGwvc3JjL3RyZWVzL1RyZWUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBUcmVlLmV4dGVuZHMoXG4gICAge1xuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgaWYgKCFvcHRpb25zLmNvbmZpZ1xuICAgICAgICAgICAgICAgIHx8ICFvcHRpb25zLmRvbVVwZGF0ZXJcbiAgICAgICAgICAgICAgICB8fCAhb3B0aW9ucy5leHByQ2FsY3VsYXRlclxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd3cm9uZyBhcmd1bWVudHMnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgb3B0aW9ucy5jb21wb25lbnRDaGlsZHJlbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGRlbGV0ZSBvcHRpb25zLmNvbXBvbmVudENoaWxkcmVuO1xuXG4gICAgICAgICAgICBUcmVlLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgJG5hbWU6ICdDaGlsZHJlblRyZWUnXG4gICAgfVxuKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdmNvbXBvbmVudC9zcmMvQ2hpbGRyZW5UcmVlLmpzXG4gKiogbW9kdWxlIGlkID0gMTFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDIgM1xuICoqLyIsIi8qKlxuICogQGZpbGUg5pyA57uI55qE5qCRXG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20pXG4gKi9cblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcbnZhciBFeHByQ2FsY3VsYXRlciA9IHJlcXVpcmUoJy4uL0V4cHJDYWxjdWxhdGVyJyk7XG52YXIgRG9tVXBkYXRlciA9IHJlcXVpcmUoJy4uL0RvbVVwZGF0ZXInKTtcbnZhciBTY29wZU1vZGVsID0gcmVxdWlyZSgnLi4vU2NvcGVNb2RlbCcpO1xudmFyIEJhc2UgPSByZXF1aXJlKCcuLi9CYXNlJyk7XG5cbnZhciBQYXJzZXJDbGFzc2VzID0gW107XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZS5leHRlbmRzKFxuICAgIHtcbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIEJhc2UucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgICAgICAgICAgdGhpcy5zdGFydE5vZGUgPSBvcHRpb25zLnN0YXJ0Tm9kZTtcbiAgICAgICAgICAgIHRoaXMuZW5kTm9kZSA9IG9wdGlvbnMuZW5kTm9kZTtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnID0gb3B0aW9ucy5jb25maWc7XG5cbiAgICAgICAgICAgIHRoaXMuZXhwckNhbGN1bGF0ZXIgPSBvcHRpb25zLmV4cHJDYWxjdWxhdGVyIHx8IG5ldyBFeHByQ2FsY3VsYXRlcigpO1xuICAgICAgICAgICAgdGhpcy5kb21VcGRhdGVyID0gb3B0aW9ucy5kb21VcGRhdGVyIHx8IG5ldyBEb21VcGRhdGVyKCk7XG4gICAgICAgICAgICB0aGlzLmRpcnR5Q2hlY2tlciA9IG9wdGlvbnMuZGlydHlDaGVja2VyO1xuXG4gICAgICAgICAgICB0aGlzLnRyZWUgPSBbXTtcbiAgICAgICAgICAgIHRoaXMudHJlZVZhcnMgPSB7fTtcblxuICAgICAgICAgICAgdGhpcy5yb290U2NvcGUgPSBuZXcgU2NvcGVNb2RlbCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDorr7nva7nu5HlrprlnKjmoJHkuIrpnaLnmoTpop3lpJblj5jph4/jgILov5nkupvlj5jph4/mnInlpoLkuIvnibnmgKfvvJpcbiAgICAgICAgICogMeOAgeaXoOazleimhueblu+8m1xuICAgICAgICAgKiAy44CB5Zyo6I635Y+WdHJlZVZhcnPkuIrpnaLmn5DkuKrlj5jph4/nmoTml7blgJnvvIzlpoLmnpzlvZPliY3moJHlj5blh7rmnaXmmK91bmRlZmluZWTvvIzpgqPkuYjlsLHkvJrliLDniLbnuqfmoJHnmoR0cmVlVmFyc+S4iuWOu+aJvu+8jOS7peatpOexu+aOqOOAglxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lICDlj5jph4/lkI1cbiAgICAgICAgICogQHBhcmFtIHsqfSB2YWx1ZSDlj5jph4/lgLxcbiAgICAgICAgICogQHJldHVybiB7Ym9vbGVhbn0g5piv5ZCm6K6+572u5oiQ5YqfXG4gICAgICAgICAqL1xuICAgICAgICBzZXRUcmVlVmFyOiBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnRyZWVWYXJzW25hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnRyZWVWYXJzW25hbWVdID0gdmFsdWU7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICB1bnNldFRyZWVWYXI6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICB0aGlzLnRyZWVWYXJzW25hbWVdID0gdW5kZWZpbmVkO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5bnu5HlrprliLDmoJHkuIrnmoTpop3lpJblj5jph49cbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IG5hbWUgICAgICAgICAgICAgICAgICDlj5jph4/lkI1cbiAgICAgICAgICogQHBhcmFtICB7Ym9vbGVhbj19IHNob3VsZE5vdEZpbmRJblBhcmVudCDlpoLmnpzlnKjlvZPliY3moJHkuK3msqHmib7liLDvvIzmmK/lkKbliLDniLbnuqfmoJHkuK3ljrvmib7jgIJcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRydWXlsLHku6PooajkuI3ljrvvvIxmYWxzZeWwseS7o+ihqOimgeWOu1xuICAgICAgICAgKiBAcmV0dXJuIHsqfVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0VHJlZVZhcjogZnVuY3Rpb24gKG5hbWUsIHNob3VsZE5vdEZpbmRJblBhcmVudCkge1xuICAgICAgICAgICAgdmFyIHZhbCA9IHRoaXMudHJlZVZhcnNbbmFtZV07XG4gICAgICAgICAgICBpZiAoIXNob3VsZE5vdEZpbmRJblBhcmVudFxuICAgICAgICAgICAgICAgICYmIHZhbCA9PT0gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgJiYgdGhpcy4kcGFyZW50ICE9PSB1bmRlZmluZWRcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHZhbCA9IHRoaXMuJHBhcmVudC5nZXRUcmVlVmFyKG5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRQYXJlbnQ6IGZ1bmN0aW9uIChwYXJlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuJHBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRTY29wZUJ5TmFtZTogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgIHZhciBzY29wZXMgPSB0aGlzLmdldFRyZWVWYXIoJ3Njb3BlcycpO1xuICAgICAgICAgICAgaWYgKCFzY29wZXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2NvcGVzW25hbWVdO1xuICAgICAgICB9LFxuXG4gICAgICAgIHRyYXZlcnNlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB3YWxrRG9tKHRoaXMsIHRoaXMuc3RhcnROb2RlLCB0aGlzLmVuZE5vZGUsIHRoaXMudHJlZSwgdGhpcy5yb290U2NvcGUpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldERhdGE6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICBkYXRhID0gZGF0YSB8fCB7fTtcbiAgICAgICAgICAgIHRoaXMucm9vdFNjb3BlLnNldChkYXRhKTtcbiAgICAgICAgfSxcblxuICAgICAgICBnb0Rhcms6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHV0aWxzLnRyYXZlcnNlTm9DaGFuZ2VOb2Rlcyh0aGlzLnN0YXJ0Tm9kZSwgdGhpcy5lbmROb2RlLCBmdW5jdGlvbiAoY3VyTm9kZSkge1xuICAgICAgICAgICAgICAgIGlmIChjdXJOb2RlLm5vZGVUeXBlID09PSAxIHx8IGN1ck5vZGUubm9kZVR5cGUgPT09IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgdXRpbHMuZ29EYXJrKGN1ck5vZGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlc3RvcmVGcm9tRGFyazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdXRpbHMudHJhdmVyc2VOb0NoYW5nZU5vZGVzKHRoaXMuc3RhcnROb2RlLCB0aGlzLmVuZE5vZGUsIGZ1bmN0aW9uIChjdXJOb2RlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGN1ck5vZGUubm9kZVR5cGUgPT09IDEgfHwgY3VyTm9kZS5ub2RlVHlwZSA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICB1dGlscy5yZXN0b3JlRnJvbURhcmsoY3VyTm9kZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0RGlydHlDaGVja2VyOiBmdW5jdGlvbiAoZGlydHlDaGVja2VyKSB7XG4gICAgICAgICAgICB0aGlzLmRpcnR5Q2hlY2tlciA9IGRpcnR5Q2hlY2tlcjtcbiAgICAgICAgfSxcblxuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB3YWxrKHRoaXMudHJlZSk7XG5cbiAgICAgICAgICAgIHRoaXMuc3RhcnROb2RlID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuZW5kTm9kZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmNvbmZpZyA9IG51bGw7XG5cbiAgICAgICAgICAgIHRoaXMuZXhwckNhbGN1bGF0ZXIuZGVzdHJveSgpO1xuICAgICAgICAgICAgdGhpcy5leHByQ2FsY3VsYXRlciA9IG51bGw7XG5cbiAgICAgICAgICAgIHRoaXMuZG9tVXBkYXRlci5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLmRvbVVwZGF0ZXIgPSBudWxsO1xuXG4gICAgICAgICAgICB0aGlzLnRyZWUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy50cmVlVmFycyA9IG51bGw7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmRpcnR5Q2hlY2tlcikge1xuICAgICAgICAgICAgICAgIHRoaXMuZGlydHlDaGVja2VyLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRpcnR5Q2hlY2tlciA9IG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHdhbGsocGFyc2VyT2Jqcykge1xuICAgICAgICAgICAgICAgIHV0aWxzLmVhY2gocGFyc2VyT2JqcywgZnVuY3Rpb24gKGN1clBhcnNlck9iaikge1xuICAgICAgICAgICAgICAgICAgICBjdXJQYXJzZXJPYmoucGFyc2VyLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VyUGFyc2VyT2JqLmNoaWxkcmVuICYmIGN1clBhcnNlck9iai5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdhbGsoY3VyUGFyc2VyT2JqLmNoaWxkcmVuKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDliJvlu7rop6PmnpDlmajlrp7kvovvvIzlhbbov5Tlm57lgLznmoTnu5PmnoTkuLrvvJpcbiAgICAgICAgICoge1xuICAgICAgICAgKiAgICAgcGFyc2VyOiAuLi4sXG4gICAgICAgICAqICAgICBjb2xsZWN0UmVzdWx0OiAuLi5cbiAgICAgICAgICogfVxuICAgICAgICAgKlxuICAgICAgICAgKiDov5Tlm57lgLzlrZjlnKjlpoLkuIvlh6Dnp43mg4XlhrXvvJpcbiAgICAgICAgICpcbiAgICAgICAgICogMeOAgeWmguaenCBwYXJzZXIg5bGe5oCn5a2Y5Zyo5LiUIGNvbGxlY3RSZXN1bHQg5Li6IHRydWUg77yM5YiZ6K+05piO5b2T5YmN6Kej5p6Q5Zmo6Kej5p6Q5LqG5omA5pyJ55u45bqU55qE6IqC54K577yI5YyF5ous6LW35q2i6IqC54K56Ze055qE6IqC54K544CB5b2T5YmN6IqC54K55ZKM5a2Q5a2Z6IqC54K577yJ77ybXG4gICAgICAgICAqIDLjgIHnm7TmjqXov5Tlm57lgYflgLzmiJbogIUgcGFyc2VyIOS4jeWtmOWcqO+8jOivtOaYjuayoeacieWkhOeQhuS7u+S9leiKgueCue+8jOW9k+WJjeiKgueCueS4jeWxnuS6juW9k+WJjeino+aekOWZqOWkhOeQhu+8m1xuICAgICAgICAgKiAz44CBcGFyc2VyIOWtmOWcqOS4lCBjb2xsZWN0UmVzdWx0IOS4uuaVsOe7hO+8jOe7k+aehOWmguS4i++8mlxuICAgICAgICAgKiAgICAgW1xuICAgICAgICAgKiAgICAgICAgIHtcbiAgICAgICAgICogICAgICAgICAgICAgc3RhcnROb2RlOiBOb2RlLjwuLi4+LFxuICAgICAgICAgKiAgICAgICAgICAgICBlbmROb2RlOiBOb2RlLjwuLi4+XG4gICAgICAgICAqICAgICAgICAgfVxuICAgICAgICAgKiAgICAgXVxuICAgICAgICAgKlxuICAgICAgICAgKiAg5YiZ6K+05piO5b2T5YmN5piv5bim5pyJ5b6I5aSa5YiG5pSv55qE6IqC54K577yM6KaB5L6d5qyh6Kej5p6Q5pWw57uE5Lit5q+P5Liq5YWD57Sg5oyH5a6a55qE6IqC54K56IyD5Zu044CCXG4gICAgICAgICAqICDogIzkuJTvvIzor6Xop6PmnpDlmajlr7nlupTnmoQgc2V0RGF0YSgpIOaWueazleWwhuS8mui/lOWbnuaVtOaVsO+8jOaMh+aYjuS9v+eUqOWTquS4gOS4quWIhuaUr+eahOiKgueCueOAglxuICAgICAgICAgKlxuICAgICAgICAgKiBAaW5uZXJcbiAgICAgICAgICogQHBhcmFtIHtDb25zdHJ1Y3Rvcn0gUGFyc2VyQ2xhc3MgcGFyc2VyIOexu1xuICAgICAgICAgKiBAcGFyYW0gIHtPYmplY3R9IG9wdGlvbnMg5Yid5aeL5YyW5Y+C5pWwXG4gICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICDov5Tlm57lgLxcbiAgICAgICAgICovXG4gICAgICAgIGNyZWF0ZVBhcnNlcjogZnVuY3Rpb24gKFBhcnNlckNsYXNzLCBvcHRpb25zKSB7XG4gICAgICAgICAgICB2YXIgc3RhcnROb2RlID0gb3B0aW9ucy5zdGFydE5vZGUgfHwgb3B0aW9ucy5ub2RlO1xuICAgICAgICAgICAgaWYgKCFQYXJzZXJDbGFzcy5pc1Byb3Blck5vZGUoc3RhcnROb2RlLCBvcHRpb25zLmNvbmZpZykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBlbmROb2RlO1xuICAgICAgICAgICAgaWYgKFBhcnNlckNsYXNzLmZpbmRFbmROb2RlKSB7XG4gICAgICAgICAgICAgICAgZW5kTm9kZSA9IFBhcnNlckNsYXNzLmZpbmRFbmROb2RlKHN0YXJ0Tm9kZSwgb3B0aW9ucy5jb25maWcpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFlbmROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IFBhcnNlckNsYXNzLmdldE5vRW5kTm9kZUVycm9yKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGVuZE5vZGUucGFyZW50Tm9kZSAhPT0gc3RhcnROb2RlLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd0aGUgcmVsYXRpb25zaGlwIGJldHdlZW4gc3RhcnQgbm9kZSBhbmQgZW5kIG5vZGUgaXMgbm90IGJyb3RoZXJob29kIScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHBhcnNlciA9IG5ldyBQYXJzZXJDbGFzcyh1dGlscy5leHRlbmQob3B0aW9ucywge1xuICAgICAgICAgICAgICAgIGVuZE5vZGU6IGVuZE5vZGVcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBwYXJzZXI6IHBhcnNlcixcbiAgICAgICAgICAgICAgICBlbmROb2RlOiBlbmROb2RlIHx8IG9wdGlvbnMubm9kZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgICAvKipcbiAgICAgICAgICog5rOo5YaM5LiA5LiL6Kej5p6Q5Zmo57G744CCXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSAge0NvbnN0cnVjdG9yfSBQYXJzZXJDbGFzcyDop6PmnpDlmajnsbtcbiAgICAgICAgICovXG4gICAgICAgIHJlZ2lzdGVQYXJzZXI6IGZ1bmN0aW9uIChQYXJzZXJDbGFzcykge1xuICAgICAgICAgICAgdmFyIGlzRXhpdHNDaGlsZENsYXNzID0gZmFsc2U7XG4gICAgICAgICAgICB1dGlscy5lYWNoKFBhcnNlckNsYXNzZXMsIGZ1bmN0aW9uIChQQywgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICBpZiAodXRpbHMuaXNTdWJDbGFzc09mKFBDLCBQYXJzZXJDbGFzcykpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNFeGl0c0NoaWxkQ2xhc3MgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICh1dGlscy5pc1N1YkNsYXNzT2YoUGFyc2VyQ2xhc3MsIFBDKSkge1xuICAgICAgICAgICAgICAgICAgICBQYXJzZXJDbGFzc2VzW2luZGV4XSA9IFBhcnNlckNsYXNzO1xuICAgICAgICAgICAgICAgICAgICBpc0V4aXRzQ2hpbGRDbGFzcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzRXhpdHNDaGlsZENsYXNzO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICghaXNFeGl0c0NoaWxkQ2xhc3MpIHtcbiAgICAgICAgICAgICAgICBQYXJzZXJDbGFzc2VzLnB1c2goUGFyc2VyQ2xhc3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgICRuYW1lOiAnVHJlZSdcbiAgICB9XG4pO1xuXG5cbmZ1bmN0aW9uIHdhbGtEb20odHJlZSwgc3RhcnROb2RlLCBlbmROb2RlLCBjb250YWluZXIsIHNjb3BlTW9kZWwpIHtcbiAgICBpZiAoc3RhcnROb2RlID09PSBlbmROb2RlKSB7XG4gICAgICAgIGFkZChzdGFydE5vZGUpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yICh2YXIgY3VyTm9kZSA9IHN0YXJ0Tm9kZTsgY3VyTm9kZTspIHtcbiAgICAgICAgY3VyTm9kZSA9IGFkZChjdXJOb2RlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGQoY3VyTm9kZSkge1xuICAgICAgICBpZiAoIWN1ck5vZGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICAgICAgc3RhcnROb2RlOiBjdXJOb2RlLFxuICAgICAgICAgICAgbm9kZTogY3VyTm9kZSxcbiAgICAgICAgICAgIGNvbmZpZzogdHJlZS5jb25maWcsXG4gICAgICAgICAgICBleHByQ2FsY3VsYXRlcjogdHJlZS5leHByQ2FsY3VsYXRlcixcbiAgICAgICAgICAgIGRvbVVwZGF0ZXI6IHRyZWUuZG9tVXBkYXRlcixcbiAgICAgICAgICAgIHRyZWU6IHRyZWVcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgcGFyc2VyT2JqO1xuXG4gICAgICAgIHV0aWxzLmVhY2goUGFyc2VyQ2xhc3NlcywgZnVuY3Rpb24gKFBhcnNlckNsYXNzKSB7XG4gICAgICAgICAgICBwYXJzZXJPYmogPSB0cmVlLmNyZWF0ZVBhcnNlcihQYXJzZXJDbGFzcywgb3B0aW9ucyk7XG4gICAgICAgICAgICBpZiAoIXBhcnNlck9iaiB8fCAhcGFyc2VyT2JqLnBhcnNlcikge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBhcnNlck9iai5jb2xsZWN0UmVzdWx0ID0gcGFyc2VyT2JqLnBhcnNlci5jb2xsZWN0RXhwcnMoKTtcblxuICAgICAgICAgICAgcGFyc2VyT2JqLnBhcnNlci5zZXRTY29wZShzY29wZU1vZGVsKTtcblxuICAgICAgICAgICAgaWYgKHV0aWxzLmlzQXJyYXkocGFyc2VyT2JqLmNvbGxlY3RSZXN1bHQpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGJyYW5jaGVzID0gcGFyc2VyT2JqLmNvbGxlY3RSZXN1bHQ7XG4gICAgICAgICAgICAgICAgY29udGFpbmVyLnB1c2goe3BhcnNlcjogcGFyc2VyT2JqLnBhcnNlciwgY2hpbGRyZW46IGJyYW5jaGVzfSk7XG4gICAgICAgICAgICAgICAgdXRpbHMuZWFjaChicmFuY2hlcywgZnVuY3Rpb24gKGJyYW5jaCwgaSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWJyYW5jaC5zdGFydE5vZGUgfHwgIWJyYW5jaC5lbmROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgY29uID0gW107XG4gICAgICAgICAgICAgICAgICAgIHdhbGtEb20odHJlZSwgYnJhbmNoLnN0YXJ0Tm9kZSwgYnJhbmNoLmVuZE5vZGUsIGNvbiwgcGFyc2VyT2JqLnBhcnNlci5nZXRTY29wZSgpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJhbmNoZXNbaV0gPSBjb247XG4gICAgICAgICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICAgICAgICBpZiAocGFyc2VyT2JqLmVuZE5vZGUgIT09IGVuZE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VyTm9kZSA9IHBhcnNlck9iai5wYXJzZXIuZ2V0RW5kTm9kZSgpLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY3VyTm9kZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbiA9IFtdO1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5wdXNoKHtwYXJzZXI6IHBhcnNlck9iai5wYXJzZXIsIGNoaWxkcmVuOiBjb259KTtcbiAgICAgICAgICAgICAgICBpZiAoY3VyTm9kZS5ub2RlVHlwZSA9PT0gMSAmJiBjdXJOb2RlLmNoaWxkTm9kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHdhbGtEb20odHJlZSwgY3VyTm9kZS5maXJzdENoaWxkLCBjdXJOb2RlLmxhc3RDaGlsZCwgY29uLCBwYXJzZXJPYmoucGFyc2VyLmdldFNjb3BlKCkpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChjdXJOb2RlICE9PSBlbmROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIGN1ck5vZGUgPSBwYXJzZXJPYmoucGFyc2VyLmdldEVuZE5vZGUoKS5uZXh0U2libGluZztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGN1ck5vZGUgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIGlmICghcGFyc2VyT2JqKSB7XG4gICAgICAgICAgICBjdXJOb2RlID0gY3VyTm9kZS5uZXh0U2libGluZztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjdXJOb2RlO1xuICAgIH1cbn1cblxuXG5cblxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL3NyYy90cmVlcy9UcmVlLmpzXG4gKiogbW9kdWxlIGlkID0gMTJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDIgM1xuICoqLyIsInZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxuZnVuY3Rpb24gRXhwckNhbGN1bGF0ZXIoKSB7XG4gICAgdGhpcy5mbnMgPSB7fTtcblxuICAgIHRoaXMuZXhwck5hbWVNYXAgPSB7fTtcbiAgICB0aGlzLmV4cHJOYW1lUmVnRXhwID0gL1xcLj9cXCQ/KFthLXp8QS1aXSt8KFthLXp8QS1aXStbMC05XStbYS16fEEtWl0qKSkvZztcbn1cblxuRXhwckNhbGN1bGF0ZXIucHJvdG90eXBlLmNyZWF0ZUV4cHJGbiA9IGZ1bmN0aW9uIChleHByLCBhdm9pZFJldHVybikge1xuICAgIGlmIChleHByID09PSAna2xhc3MnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignYGtsYXNzYCBpcyB0aGUgcHJlc2VydmVkIHdvcmQgZm9yIGBjbGFzc2AnKTtcbiAgICB9XG4gICAgLy8g5a+5ZXhwcj0nY2xhc3Mn6L+b6KGM5LiL6L2s5o2iXG4gICAgaWYgKGV4cHIgPT09ICdjbGFzcycpIHtcbiAgICAgICAgZXhwciA9ICdrbGFzcyc7XG4gICAgfVxuXG4gICAgYXZvaWRSZXR1cm4gPSAhIWF2b2lkUmV0dXJuO1xuICAgIHRoaXMuZm5zW2V4cHJdID0gdGhpcy5mbnNbZXhwcl0gfHwge307XG4gICAgaWYgKHRoaXMuZm5zW2V4cHJdW2F2b2lkUmV0dXJuXSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHBhcmFtcyA9IGdldFZhcmlhYmxlTmFtZXNGcm9tRXhwcih0aGlzLCBleHByKTtcbiAgICB2YXIgZm4gPSBuZXcgRnVuY3Rpb24ocGFyYW1zLCAoYXZvaWRSZXR1cm4gPyAnJyA6ICdyZXR1cm4gJykgKyBleHByKTtcblxuICAgIHRoaXMuZm5zW2V4cHJdW2F2b2lkUmV0dXJuXSA9IHtcbiAgICAgICAgcGFyYW1OYW1lczogcGFyYW1zLFxuICAgICAgICBmbjogZm5cbiAgICB9O1xufTtcblxuRXhwckNhbGN1bGF0ZXIucHJvdG90eXBlLmNhbGN1bGF0ZSA9IGZ1bmN0aW9uIChleHByLCBhdm9pZFJldHVybiwgc2NvcGVNb2RlbCkge1xuICAgIC8vIOWvuWV4cHI9J2NsYXNzJ+i/m+ihjOS4i+i9rOaNolxuICAgIGlmIChleHByID09PSAnY2xhc3MnKSB7XG4gICAgICAgIGV4cHIgPSAna2xhc3MnO1xuICAgIH1cblxuICAgIHZhciBmbk9iaiA9IHRoaXMuZm5zW2V4cHJdW2F2b2lkUmV0dXJuXTtcbiAgICBpZiAoIWZuT2JqKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbm8gc3VjaCBleHByZXNzaW9uIGZ1bmN0aW9uIGNyZWF0ZWQhJyk7XG4gICAgfVxuXG4gICAgdmFyIGZuQXJncyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IGZuT2JqLnBhcmFtTmFtZXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgICB2YXIgcGFyYW0gPSBmbk9iai5wYXJhbU5hbWVzW2ldO1xuICAgICAgICB2YXIgdmFsdWUgPSBzY29wZU1vZGVsLmdldChwYXJhbSk7XG4gICAgICAgIGZuQXJncy5wdXNoKHZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6IHZhbHVlKTtcbiAgICB9XG5cbiAgICB2YXIgcmVzdWx0O1xuICAgIHRyeSB7XG4gICAgICAgIHJlc3VsdCA9IGZuT2JqLmZuLmFwcGx5KG51bGwsIGZuQXJncyk7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIHJlc3VsdCA9ICcnO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufTtcblxuRXhwckNhbGN1bGF0ZXIucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mbnMgPSBudWxsO1xuICAgIHRoaXMuZXhwck5hbWVNYXAgPSBudWxsO1xuICAgIHRoaXMuZXhwck5hbWVSZWdFeHAgPSBudWxsO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFeHByQ2FsY3VsYXRlcjtcblxuLyoqXG4gKiDku47ooajovr7lvI/kuK3mir3nprvlh7rlj5jph4/lkI1cbiAqXG4gKiBAaW5uZXJcbiAqIEBwYXJhbSB7RXhwckNhbGN1bGF0ZXJ9IG1lIOWvueW6lOWunuS+i1xuICogQHBhcmFtICB7c3RyaW5nfSBleHByIOihqOi+vuW8j+Wtl+espuS4su+8jOexu+S8vOS6jiBgJHtuYW1lfWAg5Lit55qEIG5hbWVcbiAqIEByZXR1cm4ge0FycmF5LjxzdHJpbmc+fSAgICAgIOWPmOmHj+WQjeaVsOe7hFxuICovXG5mdW5jdGlvbiBnZXRWYXJpYWJsZU5hbWVzRnJvbUV4cHIobWUsIGV4cHIpIHtcbiAgICBpZiAobWUuZXhwck5hbWVNYXBbZXhwcl0pIHtcbiAgICAgICAgcmV0dXJuIG1lLmV4cHJOYW1lTWFwW2V4cHJdO1xuICAgIH1cblxuICAgIHZhciByZWcgPSAvW1xcJHxffGEtenxBLVpdezF9KD86W2EtenxBLVp8MC05fFxcJHxfXSopL2c7XG5cbiAgICBmb3IgKHZhciBuYW1lcyA9IHt9LCBuYW1lID0gcmVnLmV4ZWMoZXhwcik7IG5hbWU7IG5hbWUgPSByZWcuZXhlYyhleHByKSkge1xuICAgICAgICB2YXIgcmVzdFN0ciA9IGV4cHIuc2xpY2UobmFtZS5pbmRleCArIG5hbWVbMF0ubGVuZ3RoKTtcblxuICAgICAgICAvLyDmmK/lt6blgLxcbiAgICAgICAgaWYgKC9eXFxzKj0oPyE9KS8udGVzdChyZXN0U3RyKSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDlj5jph4/lkI3liY3pnaLmmK/lkKblrZjlnKggYC5gIO+8jOaIluiAheWPmOmHj+WQjeaYr+WQpuS9jeS6juW8leWPt+WGhemDqFxuICAgICAgICBpZiAobmFtZS5pbmRleFxuICAgICAgICAgICAgJiYgKGV4cHJbbmFtZS5pbmRleCAtIDFdID09PSAnLidcbiAgICAgICAgICAgICAgICB8fCBpc0luUXVvdGUoXG4gICAgICAgICAgICAgICAgICAgICAgICBleHByLnNsaWNlKDAsIG5hbWUuaW5kZXgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdFN0clxuICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIG5hbWVzW25hbWVbMF1dID0gdHJ1ZTtcbiAgICB9XG5cbiAgICB2YXIgcmV0ID0gW107XG4gICAgdXRpbHMuZWFjaChuYW1lcywgZnVuY3Rpb24gKGlzT2ssIG5hbWUpIHtcbiAgICAgICAgaWYgKGlzT2spIHtcbiAgICAgICAgICAgIHJldC5wdXNoKG5hbWUpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgbWUuZXhwck5hbWVNYXBbZXhwcl0gPSByZXQ7XG5cbiAgICByZXR1cm4gcmV0O1xuXG4gICAgZnVuY3Rpb24gaXNJblF1b3RlKHByZVN0ciwgcmVzdFN0cikge1xuICAgICAgICBpZiAoKHByZVN0ci5sYXN0SW5kZXhPZignXFwnJykgKyAxICYmIHJlc3RTdHIuaW5kZXhPZignXFwnJykgKyAxKVxuICAgICAgICAgICAgfHwgKHByZVN0ci5sYXN0SW5kZXhPZignXCInKSArIDEgJiYgcmVzdFN0ci5pbmRleE9mKCdcIicpICsgMSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdnRwbC9zcmMvRXhwckNhbGN1bGF0ZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAxM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzXG4gKiovIiwiLyoqXG4gKiBAZmlsZSBET00g5pu05paw5ZmoXG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20pXG4gKi9cblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xudmFyIGxvZyA9IHJlcXVpcmUoJy4vbG9nJyk7XG5cbnZhciBldmVudExpc3QgPSAoJ2JsdXIgZm9jdXMgZm9jdXNpbiBmb2N1c291dCBsb2FkIHJlc2l6ZSBzY3JvbGwgdW5sb2FkIGNsaWNrIGRibGNsaWNrICdcbiAgICArICdtb3VzZWRvd24gbW91c2V1cCBtb3VzZW1vdmUgbW91c2VvdmVyIG1vdXNlb3V0IG1vdXNlZW50ZXIgbW91c2VsZWF2ZSAnXG4gICAgKyAnY2hhbmdlIHNlbGVjdCBzdWJtaXQga2V5ZG93biBrZXlwcmVzcyBrZXl1cCBlcnJvciBjb250ZXh0bWVudScpLnNwbGl0KCcgJyk7XG5cbmZ1bmN0aW9uIERvbVVwZGF0ZXIoKSB7XG4gICAgdGhpcy50YXNrcyA9IHt9O1xuICAgIHRoaXMuaXNFeGVjdXRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLmRvbmVGbnMgPSBbXTtcbn1cblxudmFyIGNvdW50ZXIgPSAwO1xuRG9tVXBkYXRlci5wcm90b3R5cGUuZ2VuZXJhdGVUYXNrSWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGNvdW50ZXIrKztcbn07XG5cbkRvbVVwZGF0ZXIucHJvdG90eXBlLmFkZFRhc2tGbiA9IGZ1bmN0aW9uICh0YXNrSWQsIHRhc2tGbikge1xuICAgIHRoaXMudGFza3NbdGFza0lkXSA9IHRhc2tGbjtcbn07XG5cbkRvbVVwZGF0ZXIucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy50YXNrcyA9IG51bGw7XG59O1xuXG5Eb21VcGRhdGVyLnByb3RvdHlwZS5leGVjdXRlID0gZnVuY3Rpb24gKGRvbmVGbikge1xuICAgIGlmICh1dGlscy5pc0Z1bmN0aW9uKGRvbmVGbikpIHtcbiAgICAgICAgdGhpcy5kb25lRm5zLnB1c2goZG9uZUZuKTtcbiAgICB9XG5cbiAgICB2YXIgbWUgPSB0aGlzO1xuICAgIGlmICghdGhpcy5pc0V4ZWN1dGluZykge1xuICAgICAgICB0aGlzLmlzRXhlY3V0aW5nID0gdHJ1ZTtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHV0aWxzLmVhY2gobWUudGFza3MsIGZ1bmN0aW9uICh0YXNrRm4pIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICB0YXNrRm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nLndhcm4oZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBtZS50YXNrcyA9IHt9O1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KHV0aWxzLmJpbmQoZnVuY3Rpb24gKGRvbmVGbnMpIHtcbiAgICAgICAgICAgICAgICB1dGlscy5lYWNoKGRvbmVGbnMsIGZ1bmN0aW9uIChkb25lRm4pIHtcbiAgICAgICAgICAgICAgICAgICAgZG9uZUZuKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LCBudWxsLCBtZS5kb25lRm5zKSk7XG4gICAgICAgICAgICBtZS5kb25lRm5zID0gW107XG5cbiAgICAgICAgICAgIG1lLmlzRXhlY3V0aW5nID0gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cbi8qKlxuICog57uZ5oyH5a6aRE9N6IqC54K555qE5oyH5a6a5bGe5oCn6K6+572u5YC8XG4gKlxuICogVE9ETzog5a6M5ZaEXG4gKlxuICogQHN0YXRpY1xuICogQHBhcmFtIHtOb2RlfSBub2RlICBET03oioLngrlcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lICDoioLngrnlsZ7mgKflkI1cbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZSDoioLngrnlsZ7mgKflgLxcbiAqIEByZXR1cm4geyp9XG4gKi9cbkRvbVVwZGF0ZXIuc2V0QXR0ciA9IGZ1bmN0aW9uIChub2RlLCBuYW1lLCB2YWx1ZSkge1xuICAgIC8vIOebruWJjeS7heWkhOeQhuWFg+e0oOiKgueCue+8jOS7peWQjuaYr+WQpuWkhOeQhuWFtuS7luexu+Wei+eahOiKgueCue+8jOS7peWQjuWGjeivtFxuICAgIGlmIChub2RlLm5vZGVUeXBlICE9PSAxKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAobmFtZSA9PT0gJ3N0eWxlJyAmJiB1dGlscy5pc1B1cmVPYmplY3QodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBEb21VcGRhdGVyLnNldFN0eWxlKG5vZGUsIHZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAobmFtZSA9PT0gJ2NsYXNzJykge1xuICAgICAgICByZXR1cm4gRG9tVXBkYXRlci5zZXRDbGFzcyhub2RlLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgaWYgKERvbVVwZGF0ZXIuaXNFdmVudE5hbWUobmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIERvbVVwZGF0ZXIuc2V0RXZlbnQobm9kZSwgbmFtZSwgdmFsdWUpO1xuICAgIH1cblxuICAgIC8vIOWklumDqOeCueWHu+S6i+S7tlxuICAgIGlmIChuYW1lID09PSAnb25vdXRjbGljaycpIHtcbiAgICAgICAgcmV0dXJuIERvbVVwZGF0ZXIuc2V0T3V0Q2xpY2sobm9kZSwgdmFsdWUpO1xuICAgIH1cblxuICAgIG5vZGUuc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbn07XG5cbkRvbVVwZGF0ZXIuc2V0T3V0Q2xpY2sgPSBmdW5jdGlvbiAobm9kZSwgY2FsbGJhY2spIHtcbiAgICBpZiAoIXV0aWxzLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50ID0gZXZlbnQgfHwgd2luZG93LmV2ZW50O1xuXG4gICAgICAgIGlmIChub2RlICE9PSBldmVudC50YXJnZXQgJiYgIW5vZGUuY29udGFpbnMoZXZlbnQudGFyZ2V0KSkge1xuICAgICAgICAgICAgY2FsbGJhY2soZXZlbnQpO1xuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG5Eb21VcGRhdGVyLnNldEV2ZW50ID0gZnVuY3Rpb24gKG5vZGUsIG5hbWUsIHZhbHVlKSB7XG4gICAgaWYgKHV0aWxzLmlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICAgIG5vZGVbbmFtZV0gPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50ID0gZXZlbnQgfHwgd2luZG93LmV2ZW50O1xuICAgICAgICAgICAgdmFsdWUoZXZlbnQpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgbm9kZVtuYW1lXSA9IG51bGw7XG4gICAgfVxufTtcblxuRG9tVXBkYXRlci5zZXRDbGFzcyA9IGZ1bmN0aW9uIChub2RlLCBrbGFzcykge1xuICAgIGlmICgha2xhc3MpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG5vZGUuY2xhc3NOYW1lID0gRG9tVXBkYXRlci5nZXRDbGFzc0xpc3Qoa2xhc3MpLmpvaW4oJyAnKTtcbn07XG5cbkRvbVVwZGF0ZXIuc2V0U3R5bGUgPSBmdW5jdGlvbiAobm9kZSwgc3R5bGVPYmopIHtcbiAgICBmb3IgKHZhciBrIGluIHN0eWxlT2JqKSB7XG4gICAgICAgIG5vZGUuc3R5bGVba10gPSBzdHlsZU9ialtrXTtcbiAgICB9XG59O1xuXG4vKipcbiAqIOiOt+WPluWFg+e0oOiKgueCueeahOWxnuaAp+WAvFxuICpcbiAqIEBzdGF0aWNcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSBkb23oioLngrlcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIOWxnuaAp+WQjVxuICogQHJldHVybiB7Kn0g5bGe5oCn5YC8XG4gKi9cbkRvbVVwZGF0ZXIuZ2V0QXR0ciA9IGZ1bmN0aW9uIChub2RlLCBuYW1lKSB7XG4gICAgaWYgKG5hbWUgPT09ICdjbGFzcycpIHtcbiAgICAgICAgcmV0dXJuIERvbVVwZGF0ZXIuZ2V0Q2xhc3NMaXN0KG5vZGUuY2xhc3NOYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGUuZ2V0QXR0cmlidXRlKG5vZGUpO1xufTtcblxuRG9tVXBkYXRlci5nZXRDbGFzc0xpc3QgPSBmdW5jdGlvbiAoa2xhc3MpIHtcbiAgICB2YXIga2xhc3NlcyA9IFtdO1xuICAgIGlmICh1dGlscy5pc0NsYXNzKGtsYXNzLCAnU3RyaW5nJykpIHtcbiAgICAgICAga2xhc3NlcyA9IGtsYXNzLnNwbGl0KCcgJyk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHV0aWxzLmlzUHVyZU9iamVjdChrbGFzcykpIHtcbiAgICAgICAgZm9yICh2YXIgayBpbiBrbGFzcykge1xuICAgICAgICAgICAgaWYgKGtsYXNzW2tdKSB7XG4gICAgICAgICAgICAgICAga2xhc3Nlcy5wdXNoKGtsYXNzW2tdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICh1dGlscy5pc0FycmF5KGtsYXNzKSkge1xuICAgICAgICBrbGFzc2VzID0ga2xhc3M7XG4gICAgfVxuXG4gICAgcmV0dXJuIHV0aWxzLmRpc3RpbmN0QXJyKGtsYXNzZXMpO1xufTtcblxuRG9tVXBkYXRlci5pc0V2ZW50TmFtZSA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICBpZiAoc3RyLmluZGV4T2YoJ29uJykgIT09IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzdHIgPSBzdHIuc2xpY2UoMik7XG4gICAgZm9yICh2YXIgaSA9IDAsIGlsID0gZXZlbnRMaXN0Lmxlbmd0aDsgaSA8IGlsOyArK2kpIHtcbiAgICAgICAgaWYgKHN0ciA9PT0gZXZlbnRMaXN0W2ldKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRG9tVXBkYXRlcjtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdnRwbC9zcmMvRG9tVXBkYXRlci5qc1xuICoqIG1vZHVsZSBpZCA9IDE0XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyIDNcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICB3YXJuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghY29uc29sZSB8fCAhY29uc29sZS53YXJuKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLndhcm4uYXBwbHkoY29uc29sZSwgYXJndW1lbnRzKTtcbiAgICB9XG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdnRwbC9zcmMvbG9nLmpzXG4gKiogbW9kdWxlIGlkID0gMTVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDIgM1xuICoqLyIsInZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbnZhciBFdmVudCA9IHJlcXVpcmUoJy4vRXZlbnQnKTtcbnZhciBpbmhlcml0ID0gcmVxdWlyZSgnLi9pbmhlcml0Jyk7XG5cbmZ1bmN0aW9uIFNjb3BlTW9kZWwoKSB7XG4gICAgRXZlbnQuY2FsbCh0aGlzKTtcblxuICAgIHRoaXMuc3RvcmUgPSB7fTtcbiAgICB0aGlzLnBhcmVudDtcbiAgICB0aGlzLmNoaWxkcmVuID0gW107XG59XG5cblNjb3BlTW9kZWwucHJvdG90eXBlLnNldFBhcmVudCA9IGZ1bmN0aW9uIChwYXJlbnQpIHtcbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbn07XG5cblNjb3BlTW9kZWwucHJvdG90eXBlLmFkZENoaWxkID0gZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgdGhpcy5jaGlsZHJlbi5wdXNoKGNoaWxkKTtcbn07XG5cblNjb3BlTW9kZWwucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgIGlmICh1dGlscy5pc0NsYXNzKG5hbWUsICdTdHJpbmcnKSkge1xuICAgICAgICB0aGlzLnN0b3JlW25hbWVdID0gdmFsdWU7XG4gICAgICAgIGNoYW5nZSh0aGlzKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodXRpbHMuaXNQdXJlT2JqZWN0KG5hbWUpKSB7XG4gICAgICAgIHV0aWxzLmV4dGVuZCh0aGlzLnN0b3JlLCBuYW1lKTtcbiAgICAgICAgY2hhbmdlKHRoaXMpO1xuICAgIH1cbn07XG5cblNjb3BlTW9kZWwucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxIHx8IG5hbWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdG9yZTtcbiAgICB9XG5cbiAgICBpZiAobmFtZSBpbiB0aGlzLnN0b3JlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0b3JlW25hbWVdO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnBhcmVudCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0KG5hbWUpO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaW5oZXJpdChTY29wZU1vZGVsLCBFdmVudCk7XG5cbmZ1bmN0aW9uIGNoYW5nZShtZSkge1xuICAgIG1lLnRyaWdnZXIoJ2NoYW5nZScsIG1lKTtcbiAgICB1dGlscy5lYWNoKG1lLmNoaWxkcmVuLCBmdW5jdGlvbiAoc2NvcGUpIHtcbiAgICAgICAgc2NvcGUudHJpZ2dlcigncGFyZW50Y2hhbmdlJywgbWUpO1xuICAgIH0pO1xufVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL3NyYy9TY29wZU1vZGVsLmpzXG4gKiogbW9kdWxlIGlkID0gMTZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDIgM1xuICoqLyIsInZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxuZnVuY3Rpb24gRXZlbnQoKSB7XG4gICAgdGhpcy5ldm50cyA9IHt9O1xufVxuXG5FdmVudC5wcm90b3R5cGUub24gPSBmdW5jdGlvbiAoZXZlbnROYW1lLCBmbiwgY29udGV4dCkge1xuICAgIGlmICghdXRpbHMuaXNGdW5jdGlvbihmbikpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuZXZudHNbZXZlbnROYW1lXSA9IHRoaXMuZXZudHNbZXZlbnROYW1lXSB8fCBbXTtcblxuICAgIHRoaXMuZXZudHNbZXZlbnROYW1lXS5wdXNoKHtcbiAgICAgICAgZm46IGZuLFxuICAgICAgICBjb250ZXh0OiBjb250ZXh0XG4gICAgfSk7XG59O1xuXG5FdmVudC5wcm90b3R5cGUudHJpZ2dlciA9IGZ1bmN0aW9uIChldmVudE5hbWUpIHtcbiAgICB2YXIgZm5PYmpzID0gdGhpcy5ldm50c1tldmVudE5hbWVdO1xuICAgIGlmIChmbk9ianMgJiYgZm5PYmpzLmxlbmd0aCkge1xuICAgICAgICB2YXIgYXJncyA9IHV0aWxzLnNsaWNlKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIHV0aWxzLmVhY2goZm5PYmpzLCBmdW5jdGlvbiAoZm5PYmopIHtcbiAgICAgICAgICAgIGZuT2JqLmZuLmFwcGx5KGZuT2JqLmNvbnRleHQsIGFyZ3MpO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuXG5FdmVudC5wcm90b3R5cGUub2ZmID0gZnVuY3Rpb24gKGV2ZW50TmFtZSwgZm4pIHtcbiAgICBpZiAoIWZuKSB7XG4gICAgICAgIHRoaXMuZXZudHNbZXZlbnROYW1lXSA9IG51bGw7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgZm5PYmpzID0gdGhpcy5ldm50c1tldmVudE5hbWVdO1xuICAgIGlmIChmbk9ianMgJiYgZm5PYmpzLmxlbmd0aCkge1xuICAgICAgICB2YXIgbmV3Rm5PYmpzID0gW107XG4gICAgICAgIHV0aWxzLmVhY2goZm5PYmpzLCBmdW5jdGlvbiAoZm5PYmopIHtcbiAgICAgICAgICAgIGlmIChmbiAhPT0gZm5PYmouZm4pIHtcbiAgICAgICAgICAgICAgICBuZXdGbk9ianMucHVzaChmbk9iaik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmV2bnRzW2V2ZW50TmFtZV0gPSBuZXdGbk9ianM7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFdmVudDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdnRwbC9zcmMvRXZlbnQuanNcbiAqKiBtb2R1bGUgaWQgPSAxN1xuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzXG4gKiovIiwiLyoqXG4gKiBAZmlsZSDlop7lvLpmb3LmjIfku6RcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG52YXIgRm9yRGlyZWN0aXZlUGFyc2VyID0gcmVxdWlyZSgndnRwbC9zcmMvcGFyc2Vycy9Gb3JEaXJlY3RpdmVQYXJzZXInKTtcbnZhciBGb3JUcmVlID0gcmVxdWlyZSgndnRwbC9zcmMvdHJlZXMvRm9yVHJlZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZvckRpcmVjdGl2ZVBhcnNlci5leHRlbmRzKFxuICAgIHtcbiAgICAgICAgc2V0Q3NzQ2xhc3M6IGZ1bmN0aW9uIChjbGFzc0xpc3QpIHtcbiAgICAgICAgICAgIHRoaXMuJCRjbGFzc0xpc3QgPSBjbGFzc0xpc3Q7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaWwgPSB0aGlzLnRyZWVzLmxlbmd0aDsgaSA8IGlsOyArK2kpIHtcbiAgICAgICAgICAgICAgICB2YXIgdHJlZSA9IHRoaXMudHJlZXNbaV07XG4gICAgICAgICAgICAgICAgc2V0Q2xhc3Nlcyh0cmVlLCBjbGFzc0xpc3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGNyZWF0ZVRyZWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB0cmVlID0gRm9yRGlyZWN0aXZlUGFyc2VyLnByb3RvdHlwZS5jcmVhdGVUcmVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICBzZXRDbGFzc2VzKHRyZWUsIHRoaXMuJCRjbGFzc0xpc3QpO1xuICAgICAgICAgICAgcmV0dXJuIHRyZWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0QXR0cjogZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAobmFtZSA9PT0gJ2NsYXNzJykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0Q3NzQ2xhc3ModmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICAgICRuYW1lOiAnRm9yRGlyZWN0aXZlUGFyc2VyJ1xuICAgIH1cbik7XG5cbmZ1bmN0aW9uIHNldENsYXNzZXModHJlZSwgY2xhc3NMaXN0KSB7XG4gICAgZm9yICh2YXIgaiA9IDAsIGpsID0gdHJlZS50cmVlLmxlbmd0aDsgaiA8IGpsOyArK2opIHtcbiAgICAgICAgdHJlZS50cmVlW2pdLnBhcnNlci5zZXRBdHRyKCdjbGFzcycsIGNsYXNzTGlzdCk7XG4gICAgfVxufVxuXG5Gb3JUcmVlLnJlZ2lzdGVQYXJzZXIobW9kdWxlLmV4cG9ydHMpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92Y29tcG9uZW50L3NyYy9Gb3JEaXJlY3RpdmVQYXJzZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAxOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzXG4gKiovIiwiLyoqXG4gKiBAZmlsZSBmb3Ig5oyH5LukXG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20pXG4gKi9cblxudmFyIERpcmVjdGl2ZVBhcnNlciA9IHJlcXVpcmUoJy4vRGlyZWN0aXZlUGFyc2VyJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xudmFyIEZvclRyZWUgPSByZXF1aXJlKCcuLi90cmVlcy9Gb3JUcmVlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGlyZWN0aXZlUGFyc2VyLmV4dGVuZHMoXG4gICAge1xuXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgICBEaXJlY3RpdmVQYXJzZXIucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgICAgICAgICAgdGhpcy5zdGFydE5vZGUgPSBvcHRpb25zLnN0YXJ0Tm9kZTtcbiAgICAgICAgICAgIHRoaXMuZW5kTm9kZSA9IG9wdGlvbnMuZW5kTm9kZTtcbiAgICAgICAgfSxcblxuICAgICAgICBjb2xsZWN0RXhwcnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXJ0Tm9kZS5uZXh0U2libGluZyA9PT0gdGhpcy5lbmROb2RlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdHBsU2VnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICB1dGlscy50cmF2ZXJzZU5vZGVzKHRoaXMuc3RhcnROb2RlLCB0aGlzLmVuZE5vZGUsIGZ1bmN0aW9uIChjdXJOb2RlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGN1ck5vZGUgPT09IHRoaXMuc3RhcnROb2RlIHx8IGN1ck5vZGUgPT09IHRoaXMuZW5kTm9kZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdHBsU2VnLmFwcGVuZENoaWxkKGN1ck5vZGUpO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgICAgICB0aGlzLnRwbFNlZyA9IHRwbFNlZztcblxuICAgICAgICAgICAgdGhpcy5leHByID0gdGhpcy5zdGFydE5vZGUubm9kZVZhbHVlLm1hdGNoKHRoaXMuY29uZmlnLmdldEZvckV4cHJzUmVnRXhwKCkpWzFdO1xuICAgICAgICAgICAgdGhpcy5leHByRm4gPSB1dGlscy5jcmVhdGVFeHByRm4odGhpcy5jb25maWcuZ2V0RXhwclJlZ0V4cCgpLCB0aGlzLmV4cHIsIHRoaXMuZXhwckNhbGN1bGF0ZXIpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVGbiA9IGNyZWF0ZVVwZGF0ZUZuKFxuICAgICAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydE5vZGUubmV4dFNpYmxpbmcsXG4gICAgICAgICAgICAgICAgdGhpcy5lbmROb2RlLnByZXZpb3VzU2libGluZyxcbiAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZyxcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0Tm9kZS5ub2RlVmFsdWVcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIG9uQ2hhbmdlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuZXhwcikge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGV4cHJWYWx1ZSA9IHRoaXMuZXhwckZuKHRoaXMuc2NvcGVNb2RlbCk7XG4gICAgICAgICAgICBpZiAodGhpcy5kaXJ0eUNoZWNrKHRoaXMuZXhwciwgZXhwclZhbHVlLCB0aGlzLmV4cHJPbGRWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUZuKGV4cHJWYWx1ZSwgdGhpcy5zY29wZU1vZGVsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5leHByT2xkVmFsdWUgPSBleHByVmFsdWU7XG5cbiAgICAgICAgICAgIERpcmVjdGl2ZVBhcnNlci5wcm90b3R5cGUub25DaGFuZ2UuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB1dGlscy50cmF2ZXJzZU5vZGVzKHRoaXMudHBsU2VnLmZpcnN0Q2hpbGQsIHRoaXMudHBsU2VnLmxhc3RDaGlsZCwgZnVuY3Rpb24gKGN1ck5vZGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVuZE5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoY3VyTm9kZSwgdGhpcy5lbmROb2RlKTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgICAgICB1dGlscy5lYWNoKHRoaXMudHJlZXMsIGZ1bmN0aW9uICh0cmVlKSB7XG4gICAgICAgICAgICAgICAgdHJlZS5kZXN0cm95KCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy50cGxTZWcgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5leHByID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuZXhwckZuID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRm4gPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5zdGFydE5vZGUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5lbmROb2RlID0gbnVsbDtcbiAgICAgICAgICAgIERpcmVjdGl2ZVBhcnNlci5wcm90b3R5cGUuZGVzdHJveS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNyZWF0ZVRyZWU6IGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICAgICAgICAgIHZhciBwYXJzZXIgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIGNvcHlTZWcgPSBwYXJzZXIudHBsU2VnLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICAgIHZhciBzdGFydE5vZGUgPSBjb3B5U2VnLmZpcnN0Q2hpbGQ7XG4gICAgICAgICAgICB2YXIgZW5kTm9kZSA9IGNvcHlTZWcubGFzdENoaWxkO1xuICAgICAgICAgICAgdXRpbHMudHJhdmVyc2VOb2RlcyhzdGFydE5vZGUsIGVuZE5vZGUsIGZ1bmN0aW9uIChjdXJOb2RlKSB7XG4gICAgICAgICAgICAgICAgcGFyc2VyLmVuZE5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoY3VyTm9kZSwgcGFyc2VyLmVuZE5vZGUpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciB0cmVlID0gbmV3IEZvclRyZWUoe1xuICAgICAgICAgICAgICAgIHN0YXJ0Tm9kZTogc3RhcnROb2RlLFxuICAgICAgICAgICAgICAgIGVuZE5vZGU6IGVuZE5vZGUsXG4gICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWcsXG4gICAgICAgICAgICAgICAgZG9tVXBkYXRlcjogcGFyc2VyLnRyZWUuZG9tVXBkYXRlcixcbiAgICAgICAgICAgICAgICBleHByQ2FsY3VsYXRlcjogcGFyc2VyLnRyZWUuZXhwckNhbGN1bGF0ZXJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdHJlZS5zZXRQYXJlbnQocGFyc2VyLnRyZWUpO1xuICAgICAgICAgICAgdHJlZS50cmF2ZXJzZSgpO1xuICAgICAgICAgICAgcmV0dXJuIHRyZWU7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgaXNQcm9wZXJOb2RlOiBmdW5jdGlvbiAobm9kZSwgY29uZmlnKSB7XG4gICAgICAgICAgICByZXR1cm4gRGlyZWN0aXZlUGFyc2VyLmlzUHJvcGVyTm9kZShub2RlLCBjb25maWcpXG4gICAgICAgICAgICAgICAgJiYgY29uZmlnLmZvclByZWZpeFJlZ0V4cC50ZXN0KG5vZGUubm9kZVZhbHVlKTtcbiAgICAgICAgfSxcblxuICAgICAgICBmaW5kRW5kTm9kZTogZnVuY3Rpb24gKGZvclN0YXJ0Tm9kZSwgY29uZmlnKSB7XG4gICAgICAgICAgICB2YXIgY3VyTm9kZSA9IGZvclN0YXJ0Tm9kZTtcbiAgICAgICAgICAgIHdoaWxlICgoY3VyTm9kZSA9IGN1ck5vZGUubmV4dFNpYmxpbmcpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzRm9yRW5kTm9kZShjdXJOb2RlLCBjb25maWcpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjdXJOb2RlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBnZXROb0VuZE5vZGVFcnJvcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcigndGhlIGBmb3JgIGRpcmVjdGl2ZSBpcyBub3QgcHJvcGVybHkgZW5kZWQhJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJG5hbWU6ICdGb3JEaXJlY3RpdmVQYXJzZXInXG4gICAgfVxuKTtcblxuRm9yVHJlZS5yZWdpc3RlUGFyc2VyKG1vZHVsZS5leHBvcnRzKTtcblxuZnVuY3Rpb24gaXNGb3JFbmROb2RlKG5vZGUsIGNvbmZpZykge1xuICAgIHJldHVybiBub2RlLm5vZGVUeXBlID09PSA4ICYmIGNvbmZpZy5mb3JFbmRQcmVmaXhSZWdFeHAudGVzdChub2RlLm5vZGVWYWx1ZSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVVwZGF0ZUZuKHBhcnNlciwgc3RhcnROb2RlLCBlbmROb2RlLCBjb25maWcsIGZ1bGxFeHByKSB7XG4gICAgdmFyIHRyZWVzID0gW107XG4gICAgcGFyc2VyLnRyZWVzID0gdHJlZXM7XG4gICAgdmFyIGl0ZW1WYXJpYWJsZU5hbWUgPSBmdWxsRXhwci5tYXRjaChwYXJzZXIuY29uZmlnLmdldEZvckl0ZW1WYWx1ZU5hbWVSZWdFeHAoKSlbMV07XG4gICAgdmFyIHRhc2tJZCA9IHBhcnNlci5kb21VcGRhdGVyLmdlbmVyYXRlVGFza0lkKCk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChleHByVmFsdWUsIHNjb3BlTW9kZWwpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gMDtcbiAgICAgICAgZm9yICh2YXIgayBpbiBleHByVmFsdWUpIHtcbiAgICAgICAgICAgIGlmICghdHJlZXNbaW5kZXhdKSB7XG4gICAgICAgICAgICAgICAgdHJlZXNbaW5kZXhdID0gcGFyc2VyLmNyZWF0ZVRyZWUoY29uZmlnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdHJlZXNbaW5kZXhdLnJlc3RvcmVGcm9tRGFyaygpO1xuICAgICAgICAgICAgdHJlZXNbaW5kZXhdLnNldERpcnR5Q2hlY2tlcihwYXJzZXIuZGlydHlDaGVja2VyKTtcblxuICAgICAgICAgICAgdmFyIGxvY2FsID0ge1xuICAgICAgICAgICAgICAgIGtleTogayxcbiAgICAgICAgICAgICAgICBpbmRleDogaW5kZXhcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBsb2NhbFtpdGVtVmFyaWFibGVOYW1lXSA9IGV4cHJWYWx1ZVtrXTtcblxuICAgICAgICAgICAgdHJlZXNbaW5kZXhdLnJvb3RTY29wZS5zZXRQYXJlbnQoc2NvcGVNb2RlbCk7XG4gICAgICAgICAgICBzY29wZU1vZGVsLmFkZENoaWxkKHRyZWVzW2luZGV4XS5yb290U2NvcGUpO1xuXG4gICAgICAgICAgICB0cmVlc1tpbmRleF0uc2V0RGF0YShsb2NhbCk7XG5cbiAgICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgIH1cblxuICAgICAgICBwYXJzZXIuZG9tVXBkYXRlci5hZGRUYXNrRm4odGFza0lkLCB1dGlscy5iaW5kKGZ1bmN0aW9uICh0cmVlcywgaW5kZXgpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBpbmRleCwgaWwgPSB0cmVlcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdHJlZXNbaV0uZ29EYXJrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIG51bGwsIHRyZWVzLCBpbmRleCkpO1xuICAgIH07XG59XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Z0cGwvc3JjL3BhcnNlcnMvRm9yRGlyZWN0aXZlUGFyc2VyLmpzXG4gKiogbW9kdWxlIGlkID0gMTlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDIgM1xuICoqLyIsIi8qKlxuICogQGZpbGUgZm9y5oyH5Luk5Lit55So5Yiw55qEXG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20pXG4gKi9cblxudmFyIFRyZWUgPSByZXF1aXJlKCcuL1RyZWUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBUcmVlLmV4dGVuZHMoXG4gICAge1xuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgaWYgKCFvcHRpb25zLmNvbmZpZ1xuICAgICAgICAgICAgICAgIHx8ICFvcHRpb25zLmRvbVVwZGF0ZXJcbiAgICAgICAgICAgICAgICB8fCAhb3B0aW9ucy5leHByQ2FsY3VsYXRlclxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd3cm9uZyBhcmd1bWVudHMnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgVHJlZS5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICAgICRuYW1lOiAnRm9yVHJlZSdcbiAgICB9XG4pO1xuXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Z0cGwvc3JjL3RyZWVzL0ZvclRyZWUuanNcbiAqKiBtb2R1bGUgaWQgPSAyMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzXG4gKiovIiwiLyoqXG4gKiBAZmlsZSDlop7lvLrkuIDkuIt2dHBs5Lit55qEaWbmjIfku6RcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG52YXIgSWZEaXJlY3RpdmVQYXJzZXIgPSByZXF1aXJlKCd2dHBsL3NyYy9wYXJzZXJzL0lmRGlyZWN0aXZlUGFyc2VyJyk7XG52YXIgVHJlZSA9IHJlcXVpcmUoJ3Z0cGwvc3JjL3RyZWVzL1RyZWUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBJZkRpcmVjdGl2ZVBhcnNlci5leHRlbmRzKFxuICAgIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICog57uZaWbmjIfku6TmiYDnrqHnkIbnmoTmiYDmnInoioLngrnorr7nva5jc3PnsbtcbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBjbGFzc0xpc3QgY3Nz57G75pWw57uEXG4gICAgICAgICAqL1xuICAgICAgICBzZXRDc3NDbGFzczogZnVuY3Rpb24gKGNsYXNzTGlzdCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlsID0gdGhpcy5icmFuY2hlcy5sZW5ndGg7IGkgPCBpbDsgKytpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGJyYW5jaCA9IHRoaXMuYnJhbmNoZXNbaV07XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGpsID0gYnJhbmNoLmxlbmd0aDsgaiA8IGpsOyArK2opIHtcbiAgICAgICAgICAgICAgICAgICAgYnJhbmNoW2pdLnBhcnNlci5zZXRBdHRyKCdjbGFzcycsIGNsYXNzTGlzdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHNldEF0dHI6IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKG5hbWUgPT09ICdjbGFzcycpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldENzc0NsYXNzKHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgICAkbmFtZTogJ0lmRGlyZWN0aXZlUGFyc2VyJ1xuICAgIH1cbik7XG5cblRyZWUucmVnaXN0ZVBhcnNlcihtb2R1bGUuZXhwb3J0cyk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Zjb21wb25lbnQvc3JjL0lmRGlyZWN0aXZlUGFyc2VyLmpzXG4gKiogbW9kdWxlIGlkID0gMjFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDIgM1xuICoqLyIsIi8qKlxuICogQGZpbGUgaWYg5oyH5LukXG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20pXG4gKi9cblxudmFyIERpcmVjdGl2ZVBhcnNlciA9IHJlcXVpcmUoJy4vRGlyZWN0aXZlUGFyc2VyJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xudmFyIFRyZWUgPSByZXF1aXJlKCcuLi90cmVlcy9UcmVlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGlyZWN0aXZlUGFyc2VyLmV4dGVuZHMoXG4gICAge1xuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgRGlyZWN0aXZlUGFyc2VyLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgICAgIHRoaXMuc3RhcnROb2RlID0gb3B0aW9ucy5zdGFydE5vZGU7XG4gICAgICAgICAgICB0aGlzLmVuZE5vZGUgPSBvcHRpb25zLmVuZE5vZGU7XG4gICAgICAgICAgICB0aGlzLmNvbmZpZyA9IG9wdGlvbnMuY29uZmlnO1xuXG4gICAgICAgICAgICB0aGlzLmV4cHJzID0gW107XG4gICAgICAgICAgICB0aGlzLmV4cHJGbnMgPSB7fTtcblxuICAgICAgICAgICAgdGhpcy5oYW5kbGVCcmFuY2hlc1Rhc2tJZCA9IHRoaXMuZG9tVXBkYXRlci5nZW5lcmF0ZVRhc2tJZCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNvbGxlY3RFeHByczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGJyYW5jaGVzID0gW107XG4gICAgICAgICAgICB2YXIgYnJhbmNoSW5kZXggPSAtMTtcblxuICAgICAgICAgICAgdXRpbHMudHJhdmVyc2VOb2Rlcyh0aGlzLnN0YXJ0Tm9kZSwgdGhpcy5lbmROb2RlLCBmdW5jdGlvbiAoY3VyTm9kZSkge1xuICAgICAgICAgICAgICAgIHZhciBub2RlVHlwZSA9IGdldElmTm9kZVR5cGUoY3VyTm9kZSwgdGhpcy5jb25maWcpO1xuXG4gICAgICAgICAgICAgICAgaWYgKG5vZGVUeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldEVuZE5vZGUoY3VyTm9kZSwgYnJhbmNoZXMsIGJyYW5jaEluZGV4KTtcblxuICAgICAgICAgICAgICAgICAgICBicmFuY2hJbmRleCsrO1xuICAgICAgICAgICAgICAgICAgICBicmFuY2hlc1ticmFuY2hJbmRleF0gPSBicmFuY2hlc1ticmFuY2hJbmRleF0gfHwge307XG5cbiAgICAgICAgICAgICAgICAgICAgLy8g5pivIGlmIOiKgueCueaIluiAhSBlbGlmIOiKgueCue+8jOaQnOmbhuihqOi+vuW8j1xuICAgICAgICAgICAgICAgICAgICBpZiAobm9kZVR5cGUgPCAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXhwciA9IGN1ck5vZGUubm9kZVZhbHVlLnJlcGxhY2UodGhpcy5jb25maWcuZ2V0QWxsSWZSZWdFeHAoKSwgJycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5leHBycy5wdXNoKGV4cHIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZXhwckZuc1tleHByXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXhwckZuc1tleHByXSA9IHV0aWxzLmNyZWF0ZUV4cHJGbihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25maWcuZ2V0RXhwclJlZ0V4cCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHByLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmV4cHJDYWxjdWxhdGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChub2RlVHlwZSA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oYXNFbHNlQnJhbmNoID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFicmFuY2hlc1ticmFuY2hJbmRleF0uc3RhcnROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmFuY2hlc1ticmFuY2hJbmRleF0uc3RhcnROb2RlID0gY3VyTm9kZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGN1ck5vZGUgPSBjdXJOb2RlLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgIGlmICghY3VyTm9kZSB8fCBjdXJOb2RlID09PSB0aGlzLmVuZE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0RW5kTm9kZShjdXJOb2RlLCBicmFuY2hlcywgYnJhbmNoSW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICAgICAgdGhpcy5icmFuY2hlcyA9IGJyYW5jaGVzO1xuICAgICAgICAgICAgcmV0dXJuIGJyYW5jaGVzO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBzZXRFbmROb2RlKGN1ck5vZGUsIGJyYW5jaGVzLCBicmFuY2hJbmRleCkge1xuICAgICAgICAgICAgICAgIGlmIChicmFuY2hJbmRleCArIDEgJiYgYnJhbmNoZXNbYnJhbmNoSW5kZXhdLnN0YXJ0Tm9kZSkge1xuICAgICAgICAgICAgICAgICAgICBicmFuY2hlc1ticmFuY2hJbmRleF0uZW5kTm9kZSA9IGN1ck5vZGUucHJldmlvdXNTaWJsaW5nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBvbkNoYW5nZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGV4cHJzID0gdGhpcy5leHBycztcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IGV4cHJzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgZXhwciA9IGV4cHJzW2ldO1xuICAgICAgICAgICAgICAgIHZhciBleHByVmFsdWUgPSB0aGlzLmV4cHJGbnNbZXhwcl0odGhpcy5zY29wZU1vZGVsKTtcbiAgICAgICAgICAgICAgICBpZiAoZXhwclZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZG9tVXBkYXRlci5hZGRUYXNrRm4oXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZUJyYW5jaGVzVGFza0lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXRpbHMuYmluZChoYW5kbGVCcmFuY2hlcywgbnVsbCwgdGhpcy5icmFuY2hlcywgaSlcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzRWxzZUJyYW5jaCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZG9tVXBkYXRlci5hZGRUYXNrRm4oXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlQnJhbmNoZXNUYXNrSWQsXG4gICAgICAgICAgICAgICAgICAgIHV0aWxzLmJpbmQoaGFuZGxlQnJhbmNoZXMsIG51bGwsIHRoaXMuYnJhbmNoZXMsIGkpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5zdGFydE5vZGUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5lbmROb2RlID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuZXhwcnMgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5leHByRm5zID0gbnVsbDtcblxuICAgICAgICAgICAgRGlyZWN0aXZlUGFyc2VyLnByb3RvdHlwZS5kZXN0cm95LmNhbGwodGhpcyk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgaXNQcm9wZXJOb2RlOiBmdW5jdGlvbiAobm9kZSwgY29uZmlnKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0SWZOb2RlVHlwZShub2RlLCBjb25maWcpID09PSAxO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZpbmRFbmROb2RlOiBmdW5jdGlvbiAoaWZTdGFydE5vZGUsIGNvbmZpZykge1xuICAgICAgICAgICAgdmFyIGN1ck5vZGUgPSBpZlN0YXJ0Tm9kZTtcbiAgICAgICAgICAgIHdoaWxlICgoY3VyTm9kZSA9IGN1ck5vZGUubmV4dFNpYmxpbmcpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzSWZFbmROb2RlKGN1ck5vZGUsIGNvbmZpZykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN1ck5vZGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGdldE5vRW5kTm9kZUVycm9yOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKCd0aGUgaWYgZGlyZWN0aXZlIGlzIG5vdCBwcm9wZXJseSBlbmRlZCEnKTtcbiAgICAgICAgfSxcblxuICAgICAgICAkbmFtZTogJ0lmRGlyZWN0aXZlUGFyc2VyJ1xuICAgIH1cbik7XG5cblRyZWUucmVnaXN0ZVBhcnNlcihtb2R1bGUuZXhwb3J0cyk7XG5cbmZ1bmN0aW9uIGhhbmRsZUJyYW5jaGVzKGJyYW5jaGVzLCBzaG93SW5kZXgpIHtcbiAgICB1dGlscy5lYWNoKGJyYW5jaGVzLCBmdW5jdGlvbiAoYnJhbmNoLCBqKSB7XG4gICAgICAgIHZhciBmbiA9IGogPT09IHNob3dJbmRleCA/ICdyZXN0b3JlRnJvbURhcmsnIDogJ2dvRGFyayc7XG4gICAgICAgIHV0aWxzLmVhY2goYnJhbmNoLCBmdW5jdGlvbiAocGFyc2VyT2JqKSB7XG4gICAgICAgICAgICBwYXJzZXJPYmoucGFyc2VyW2ZuXSgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gaXNJZkVuZE5vZGUobm9kZSwgY29uZmlnKSB7XG4gICAgcmV0dXJuIGdldElmTm9kZVR5cGUobm9kZSwgY29uZmlnKSA9PT0gNDtcbn1cblxuZnVuY3Rpb24gZ2V0SWZOb2RlVHlwZShub2RlLCBjb25maWcpIHtcbiAgICBpZiAobm9kZS5ub2RlVHlwZSAhPT0gOCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5pZlByZWZpeFJlZ0V4cC50ZXN0KG5vZGUubm9kZVZhbHVlKSkge1xuICAgICAgICByZXR1cm4gMTtcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLmVsaWZQcmVmaXhSZWdFeHAudGVzdChub2RlLm5vZGVWYWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIDI7XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5lbHNlUHJlZml4UmVnRXhwLnRlc3Qobm9kZS5ub2RlVmFsdWUpKSB7XG4gICAgICAgIHJldHVybiAzO1xuICAgIH1cblxuICAgIGlmIChjb25maWcuaWZFbmRQcmVmaXhSZWdFeHAudGVzdChub2RlLm5vZGVWYWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIDQ7XG4gICAgfVxufVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL3NyYy9wYXJzZXJzL0lmRGlyZWN0aXZlUGFyc2VyLmpzXG4gKiogbW9kdWxlIGlkID0gMjJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDIgM1xuICoqLyIsIi8qKlxuICogQGZpbGUg57uE5Lu26Kej5p6Q5ZmoXG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20pXG4gKi9cblxudmFyIEV2ZW50RXhwclBhcnNlciA9IHJlcXVpcmUoJ3Z0cGwvc3JjL3BhcnNlcnMvRXZlbnRFeHByUGFyc2VyJyk7XG52YXIgVHJlZSA9IHJlcXVpcmUoJ3Z0cGwvc3JjL3RyZWVzL1RyZWUnKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJ3Z0cGwvc3JjL3V0aWxzJyk7XG52YXIgQ29tcG9uZW50VHJlZSA9IHJlcXVpcmUoJy4vQ29tcG9uZW50VHJlZScpO1xudmFyIENvbXBvbmVudENoaWxkcmVuID0gcmVxdWlyZSgnLi9Db21wb25lbnRDaGlsZHJlbicpO1xudmFyIENvbXBvbmVudE1hbmFnZXIgPSByZXF1aXJlKCcuL0NvbXBvbmVudE1hbmFnZXInKTtcbnZhciBEb21VcGRhdGVyID0gcmVxdWlyZSgndnRwbC9zcmMvRG9tVXBkYXRlcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RXhwclBhcnNlci5leHRlbmRzKFxuICAgIHtcblxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgRXZlbnRFeHByUGFyc2VyLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudE1hbmFnZXIgPSB0aGlzLnRyZWUuZ2V0VHJlZVZhcignY29tcG9uZW50TWFuYWdlcicpO1xuICAgICAgICAgICAgdGhpcy5pc0NvbXBvbmVudCA9IHRoaXMubm9kZS5ub2RlVHlwZSA9PT0gMVxuICAgICAgICAgICAgICAgICYmIHRoaXMubm9kZS50YWdOYW1lLnRvTG93ZXJDYXNlKCkuaW5kZXhPZigndWktJykgPT09IDA7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmlzQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbXBvbmVudE5hbWUgPSB1dGlscy5saW5lMmNhbWVsKHRoaXMubm9kZS50YWdOYW1lLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgndWknLCAnJykpO1xuXG4gICAgICAgICAgICAgICAgdmFyIENvbXBvbmVudENsYXNzID0gdGhpcy5jb21wb25lbnRNYW5hZ2VyLmdldENsYXNzKGNvbXBvbmVudE5hbWUpO1xuICAgICAgICAgICAgICAgIGlmICghQ29tcG9uZW50Q2xhc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd0aGUgY29tcG9uZW50IGAnICsgY29tcG9uZW50TmFtZSArICdgIGlzIG5vdCByZWdpc3RlZCEnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8g57uE5Lu25pys6Lqr5bCx5bqU6K+l5pyJ55qEY3Nz57G75ZCNXG4gICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnRPcmlnaW5Dc3NDbGFzc0xpc3QgPSBDb21wb25lbnRNYW5hZ2VyLmdldENzc0NsYXNzTmFtZShDb21wb25lbnRDbGFzcyk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudCA9IG5ldyBDb21wb25lbnRDbGFzcygpO1xuICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50LnBhcnNlciA9IHRoaXM7XG5cbiAgICAgICAgICAgICAgICB0aGlzLm1vdW50KG9wdGlvbnMudHJlZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgY29sbGVjdEV4cHJzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0NvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY29sbGVjdENvbXBvbmVudEV4cHJzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBFdmVudEV4cHJQYXJzZXIucHJvdG90eXBlLmNvbGxlY3RFeHBycy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIG1vdW50OiBmdW5jdGlvbiAocGFyZW50VHJlZSkge1xuICAgICAgICAgICAgdGhpcy5jb21wb25lbnQuY29tcG9uZW50V2lsbE1vdW50KCk7XG5cbiAgICAgICAgICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGRpdi5pbm5lckhUTUwgPSB0aGlzLmNvbXBvbmVudC50cGw7XG4gICAgICAgICAgICB2YXIgc3RhcnROb2RlID0gZGl2LmZpcnN0Q2hpbGQ7XG4gICAgICAgICAgICB2YXIgZW5kTm9kZSA9IGRpdi5sYXN0Q2hpbGQ7XG5cbiAgICAgICAgICAgIHRoaXMuc3RhcnROb2RlID0gc3RhcnROb2RlO1xuICAgICAgICAgICAgdGhpcy5lbmROb2RlID0gZW5kTm9kZTtcblxuICAgICAgICAgICAgLy8g57uE5Lu255qE5L2c55So5Z+f5piv5ZKM5aSW6YOo55qE5L2c55So5Z+f6ZqU5byA55qEXG4gICAgICAgICAgICB0aGlzLnRyZWUgPSBuZXcgQ29tcG9uZW50VHJlZSh7XG4gICAgICAgICAgICAgICAgc3RhcnROb2RlOiBzdGFydE5vZGUsXG4gICAgICAgICAgICAgICAgZW5kTm9kZTogZW5kTm9kZSxcbiAgICAgICAgICAgICAgICBjb25maWc6IHBhcmVudFRyZWUuY29uZmlnLFxuICAgICAgICAgICAgICAgIGRvbVVwZGF0ZXI6IHBhcmVudFRyZWUuZG9tVXBkYXRlcixcbiAgICAgICAgICAgICAgICBleHByQ2FsY3VsYXRlcjogcGFyZW50VHJlZS5leHByQ2FsY3VsYXRlcixcblxuICAgICAgICAgICAgICAgIC8vIGNvbXBvbmVudENoaWxkcmVu5LiN6IO95Lyg57uZ5a2Q57qn57uE5Lu25qCR77yM5Y+v5Lul5Lyg57uZ5a2Q57qnZm9y5qCR44CCXG4gICAgICAgICAgICAgICAgY29tcG9uZW50Q2hpbGRyZW46IG5ldyBDb21wb25lbnRDaGlsZHJlbihcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLmZpcnN0Q2hpbGQsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS5sYXN0Q2hpbGQsXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudFRyZWUucm9vdFNjb3BlXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMudHJlZS5zZXRQYXJlbnQocGFyZW50VHJlZSk7XG5cbiAgICAgICAgICAgIHRoaXMudHJlZS5yZWdpc3RlQ29tcG9uZW50cyh0aGlzLmNvbXBvbmVudC5jb21wb25lbnRDbGFzc2VzKTtcblxuICAgICAgICAgICAgaW5zZXJ0Q29tcG9uZW50Tm9kZXModGhpcy5ub2RlLCBzdGFydE5vZGUsIGVuZE5vZGUpO1xuXG4gICAgICAgICAgICB0aGlzLnRyZWUudHJhdmVyc2UoKTtcblxuICAgICAgICAgICAgLy8g5oqK57uE5Lu26IqC54K55pS+5YiwIERPTSDmoJHkuK3ljrtcbiAgICAgICAgICAgIGZ1bmN0aW9uIGluc2VydENvbXBvbmVudE5vZGVzKGNvbXBvbmVudE5vZGUsIHN0YXJ0Tm9kZSwgZW5kTm9kZSkge1xuICAgICAgICAgICAgICAgIHZhciBwYXJlbnROb2RlID0gY29tcG9uZW50Tm9kZS5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgIHV0aWxzLnRyYXZlcnNlTm9kZXMoXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0Tm9kZSxcbiAgICAgICAgICAgICAgICAgICAgZW5kTm9kZSxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGN1ck5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGN1ck5vZGUsIGNvbXBvbmVudE5vZGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlLnJlbW92ZUNoaWxkKGNvbXBvbmVudE5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDorr7nva7lvZPliY3oioLngrnmiJbogIXnu4Tku7bnmoTlsZ7mgKdcbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSDlsZ7mgKflkI1cbiAgICAgICAgICogQHBhcmFtIHsqfSB2YWx1ZSDlsZ7mgKflgLxcbiAgICAgICAgICovXG4gICAgICAgIHNldEF0dHI6IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKG5hbWUgPT09ICdyZWYnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kJHJlZiA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuaXNDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAobmFtZSA9PT0gJ2NsYXNzJykge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMuY29tcG9uZW50T3JpZ2luQ3NzQ2xhc3NMaXN0LmNvbmNhdChEb21VcGRhdGVyLmdldENsYXNzTGlzdCh2YWx1ZSkpO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IHRoaXMudHJlZS50cmVlLmxlbmd0aDsgaSA8IGlsOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwYXJzZXJPYmogPSB0aGlzLnRyZWUudHJlZVtpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlck9iai5wYXJzZXIuc2V0QXR0ciAmJiBwYXJzZXJPYmoucGFyc2VyLnNldEF0dHIoJ2NsYXNzJywgRG9tVXBkYXRlci5nZXRDbGFzc0xpc3QodmFsdWUpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBzY29wZSA9IHRoaXMudHJlZS5yb290U2NvcGU7XG4gICAgICAgICAgICAgICAgc2NvcGUuc2V0KG5hbWUsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIEV2ZW50RXhwclBhcnNlci5wcm90b3R5cGUuc2V0QXR0ci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5blsZ7mgKdcbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IG5hbWUg5bGe5oCn5ZCNXG4gICAgICAgICAqIEByZXR1cm4geyp9ICAgICAg5bGe5oCn5YC8XG4gICAgICAgICAqL1xuICAgICAgICBnZXRBdHRyOiBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50cmVlLnJvb3RTY29wZS5nZXQobmFtZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBFdmVudEV4cHJQYXJzZXIucHJvdG90eXBlLmdldEF0dHIodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBjb2xsZWN0Q29tcG9uZW50RXhwcnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjdXJOb2RlID0gdGhpcy5ub2RlO1xuXG4gICAgICAgICAgICB2YXIgYXR0cmlidXRlcyA9IGN1ck5vZGUuYXR0cmlidXRlcztcbiAgICAgICAgICAgIC8vIOaQnOmbhuS4jeWQq+acieihqOi+vuW8j+eahOWxnuaAp++8jOeEtuWQjuWcqOe7hOS7tuexu+WIm+W7uuWlveS5i+WQjuiuvue9rui/m+e7hOS7tlxuICAgICAgICAgICAgdGhpcy5zZXRMaXRlcmFsQXR0cnNGbnMgPSBbXTtcblxuICAgICAgICAgICAgLy8g5piv5ZCm5a2Y5ZyoY3Nz57G75ZCN55qE6K6+572u5Ye95pWwXG4gICAgICAgICAgICB2YXIgaGFzQ2xhc3MgPSBmYWxzZTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IGF0dHJpYnV0ZXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBhdHRyID0gYXR0cmlidXRlc1tpXTtcbiAgICAgICAgICAgICAgICBoYXNDbGFzcyA9IGF0dHIubm9kZU5hbWUgPT09ICdjbGFzcy1saXN0JztcblxuICAgICAgICAgICAgICAgIHZhciBleHByID0gYXR0ci5ub2RlVmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY29uZmlnLmdldEV4cHJSZWdFeHAoKS50ZXN0KGV4cHIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXhwcnMucHVzaChleHByKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmV4cHJGbnNbZXhwcl0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByYXdFeHByID0gZ2V0UmF3RXhwcihleHByLCB0aGlzLmNvbmZpZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmV4cHJDYWxjdWxhdGVyLmNyZWF0ZUV4cHJGbihyYXdFeHByKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXhwckZuc1tleHByXSA9IHV0aWxzLmJpbmQoY2FsY3VsYXRlRXhwciwgbnVsbCwgcmF3RXhwciwgdGhpcy5leHByQ2FsY3VsYXRlcik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlRm5zW2V4cHJdID0gdGhpcy51cGRhdGVGbnNbZXhwcl0gfHwgW107XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUZuc1tleHByXS5wdXNoKHV0aWxzLmJpbmQoc2V0QXR0ckZuLCB0aGlzLCBhdHRyLm5vZGVOYW1lKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0TGl0ZXJhbEF0dHJzRm5zLnB1c2goXG4gICAgICAgICAgICAgICAgICAgICAgICB1dGlscy5iaW5kKHNldEF0dHJGbiwgdGhpcywgYXR0ci5ub2RlTmFtZSwgYXR0ci5ub2RlVmFsdWUsIHRydWUpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWhhc0NsYXNzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRMaXRlcmFsQXR0cnNGbnMucHVzaChcbiAgICAgICAgICAgICAgICAgICAgdXRpbHMuYmluZChzZXRBdHRyRm4sIHRoaXMsICdjbGFzcycsIFtdKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOiuvue9rue7hOS7tuWxnuaAp+OAglxuICAgICAgICAgICAgICog55Sx5LqOSFRNTOagh+etvuS4reS4jeiDveWGmempvOWzsOW9ouW8j+eahOWxnuaAp+WQje+8jFxuICAgICAgICAgICAgICog5omA5Lul5q2k5aSE5Lya5bCG5Lit5qiq57q/5b2i5byP55qE5bGe5oCn6L2s5o2i5oiQ6am85bOw5b2i5byP44CCXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQGlubmVyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAgICAgIOWxnuaAp+WQjVxuICAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlICAgICDlsZ7mgKflgLxcbiAgICAgICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNMaXRlcmFsIOaYr+WQpuaYr+W4uOmHj+WxnuaAp1xuICAgICAgICAgICAgICogQHBhcmFtIHtDb21wb25lbnR9IGNvbXBvbmVudCDnu4Tku7ZcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZnVuY3Rpb24gc2V0QXR0ckZuKG5hbWUsIHZhbHVlLCBpc0xpdGVyYWwpIHtcbiAgICAgICAgICAgICAgICBuYW1lID0gdXRpbHMubGluZTJjYW1lbChuYW1lKTtcbiAgICAgICAgICAgICAgICBpZiAobmFtZSA9PT0gJ2NsYXNzJykge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMuY29tcG9uZW50T3JpZ2luQ3NzQ2xhc3NMaXN0LmNvbmNhdChEb21VcGRhdGVyLmdldENsYXNzTGlzdCh2YWx1ZSkpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNMaXRlcmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudE9yaWdpbkNzc0NsYXNzTGlzdCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuc2V0QXR0cihuYW1lLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZUV4cHIocmF3RXhwciwgZXhwckNhbGN1bGF0ZXIsIHNjb3BlTW9kZWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZXhwckNhbGN1bGF0ZXIuY2FsY3VsYXRlKHJhd0V4cHIsIGZhbHNlLCBzY29wZU1vZGVsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0UmF3RXhwcihleHByLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZXhwci5yZXBsYWNlKGNvbmZpZy5nZXRFeHByUmVnRXhwKCksIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFyZ3VtZW50c1sxXTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6I635Y+W5byA5aeL6IqC54K5XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICogQGluaGVyaXREb2NcbiAgICAgICAgICogQHJldHVybiB7Tm9kZX1cbiAgICAgICAgICovXG4gICAgICAgIGdldFN0YXJ0Tm9kZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zdGFydE5vZGU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBFdmVudEV4cHJQYXJzZXIucHJvdG90eXBlLmdldFN0YXJ0Tm9kZS5jYWxsKHRoaXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5bnu5PmnZ/oioLngrlcbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKiBAaW5oZXJpdERvY1xuICAgICAgICAgKiBAcmV0dXJuIHtOb2RlfVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0RW5kTm9kZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5lbmROb2RlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gRXZlbnRFeHByUGFyc2VyLnByb3RvdHlwZS5nZXRFbmROb2RlLmNhbGwodGhpcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0U2NvcGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuc2NvcGVNb2RlbCA9IHRoaXMudHJlZS5yb290U2NvcGU7XG4gICAgICAgICAgICBFdmVudEV4cHJQYXJzZXIucHJvdG90eXBlLnNldFNjb3BlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmlzQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlsID0gdGhpcy5zZXRMaXRlcmFsQXR0cnNGbnMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldExpdGVyYWxBdHRyc0Zuc1tpXSh0aGlzLmNvbXBvbmVudCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnQuY29tcG9uZW50RGlkTW91bnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBnZXRTY29wZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudHJlZS5yb290U2NvcGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gc2NvcGVNb2RlbOmHjOmdoueahOWAvOWPkeeUn+S6huWPmOWMllxuICAgICAgICBvbkNoYW5nZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNHb0RhcmspIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmlzQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgdmFyIGV4cHJzID0gdGhpcy5leHBycztcbiAgICAgICAgICAgICAgICB2YXIgZXhwck9sZFZhbHVlcyA9IHRoaXMuZXhwck9sZFZhbHVlcztcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaWwgPSBleHBycy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBleHByID0gZXhwcnNbaV07XG4gICAgICAgICAgICAgICAgICAgIHZhciBleHByVmFsdWUgPSB0aGlzLmV4cHJGbnNbZXhwcl0odGhpcy5zY29wZU1vZGVsKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kaXJ0eUNoZWNrKGV4cHIsIGV4cHJWYWx1ZSwgZXhwck9sZFZhbHVlc1tleHByXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB1cGRhdGVGbnMgPSB0aGlzLnVwZGF0ZUZuc1tleHByXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwLCBqbCA9IHVwZGF0ZUZucy5sZW5ndGg7IGogPCBqbDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlRm5zW2pdKGV4cHJWYWx1ZSwgdGhpcy5jb21wb25lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgZXhwck9sZFZhbHVlc1tleHByXSA9IGV4cHJWYWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBFdmVudEV4cHJQYXJzZXIucHJvdG90eXBlLm9uQ2hhbmdlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ29EYXJrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudHMgJiYgdGhpcy5jb21wb25lbnQuZ29EYXJrKCk7XG4gICAgICAgICAgICBFdmVudEV4cHJQYXJzZXIucHJvdG90eXBlLmdvRGFyay5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlc3RvcmVGcm9tRGFyazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzICYmIHRoaXMuY29tcG9uZW50LnJlc3RvcmVGcm9tRGFyaygpO1xuICAgICAgICAgICAgRXZlbnRFeHByUGFyc2VyLnByb3RvdHlwZS5yZXN0b3JlRnJvbURhcmsuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICByZWY6IGZ1bmN0aW9uIChyZWYpIHtcbiAgICAgICAgICAgIHZhciBwYXJzZXJUcmVlID0gdGhpcy50cmVlLnRyZWU7XG5cbiAgICAgICAgICAgIHZhciByZXQ7XG4gICAgICAgICAgICB0aGlzLndhbGsocGFyc2VyVHJlZSwgZnVuY3Rpb24gKHBhcnNlcikge1xuICAgICAgICAgICAgICAgIGlmIChwYXJzZXIuaXNDb21wb25lbnQgJiYgcGFyc2VyLiQkcmVmID09PSByZWYpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcGFyc2VyLmNvbXBvbmVudDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9LFxuXG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50LmNvbXBvbmVudFdpbGxVbm1vdW50KCk7XG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudC5kZXN0cm95KCk7XG4gICAgICAgICAgICBFdmVudEV4cHJQYXJzZXIucHJvdG90eXBlLmRlc3Ryb3kuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6YGN5Y6GcGFyc2VyVHJlZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAcGFyYW0gIHtUcmVlfSBwYXJzZXJUcmVlIOagkVxuICAgICAgICAgKiBAcGFyYW0gIHtmdW5jdGlvbihQYXJzZXIpOmJvb2xlYW59IGl0ZXJhdGVyRm4g6L+t5Luj5Ye95pWwXG4gICAgICAgICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAgICAgICAqL1xuICAgICAgICB3YWxrOiBmdW5jdGlvbiAocGFyc2VyVHJlZSwgaXRlcmF0ZXJGbikge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlsID0gcGFyc2VyVHJlZS5sZW5ndGg7IGkgPCBpbDsgKytpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhcnNlck9iaiA9IHBhcnNlclRyZWVbaV07XG5cbiAgICAgICAgICAgICAgICAvLyDpkojlr7lpZuaMh+S7pOeahOaDheWGtVxuICAgICAgICAgICAgICAgIGlmICh1dGlscy5pc0FycmF5KHBhcnNlck9iaikpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMud2FsayhwYXJzZXJPYmosIGl0ZXJhdGVyRm4pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyDpkojlr7lmb3LmjIfku6TnmoTmg4XlhrVcbiAgICAgICAgICAgICAgICBpZiAodXRpbHMuaXNBcnJheShwYXJzZXJPYmoudHJlZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwLCBqbCA9IHBhcnNlck9iai50cmVlcy5sZW5ndGg7IGogPCBqbDsgKytqKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy53YWxrKHBhcnNlck9iai50cmVlc1tqXS50cmVlLCBpdGVyYXRlckZuKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChpdGVyYXRlckZuKHBhcnNlck9iai5wYXJzZXIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChwYXJzZXJPYmouY2hpbGRyZW4gJiYgcGFyc2VyT2JqLmNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy53YWxrKHBhcnNlck9iai5jaGlsZHJlbiwgaXRlcmF0ZXJGbikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICAgICRuYW1lOiAnQ29tcG9uZW50UGFyc2VyJ1xuICAgIH1cbik7XG5cblRyZWUucmVnaXN0ZVBhcnNlcihtb2R1bGUuZXhwb3J0cyk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Zjb21wb25lbnQvc3JjL0NvbXBvbmVudFBhcnNlci5qc1xuICoqIG1vZHVsZSBpZCA9IDIzXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyIDNcbiAqKi8iLCIvKipcbiAqIEBmaWxlIOWkhOeQhuS6huS6i+S7tueahCBFeHByUGFyc2VyXG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20pXG4gKi9cblxudmFyIEV4cHJQYXJzZXIgPSByZXF1aXJlKCcuL0V4cHJQYXJzZXInKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG52YXIgVHJlZSA9IHJlcXVpcmUoJy4uL3RyZWVzL1RyZWUnKTtcbnZhciBTY29wZU1vZGVsID0gcmVxdWlyZSgnLi4vU2NvcGVNb2RlbCcpO1xudmFyIERvbVVwZGF0ZXIgPSByZXF1aXJlKCcuLi9Eb21VcGRhdGVyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gRXhwclBhcnNlci5leHRlbmRzKFxuICAgIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICog5Yid5aeL5YyWXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICovXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIEV4cHJQYXJzZXIucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgICAgICAgICAgdGhpcy5ldmVudHMgPSB7fTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog5re75Yqg6KGo6L6+5byPXG4gICAgICAgICAqXG4gICAgICAgICAqIEBpbmhlcml0XG4gICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICogQHBhcmFtIHtBdHRyfSBhdHRyIOWmguaenOW9k+WJjeaYr+WFg+e0oOiKgueCue+8jOWImeimgeS8oOWFpemBjeWOhuWIsOeahOWxnuaAp++8jFxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAg5omA5LulYXR0cuWtmOWcqOS4juWQpuaYr+WIpOaWreW9k+WJjeWFg+e0oOaYr+WQpuaYr+aWh+acrOiKgueCueeahOS4gOS4quS+neaNrlxuICAgICAgICAgKiBAcmV0dXJuIHt1bmRlZmluZWR9XG4gICAgICAgICAqL1xuICAgICAgICBhZGRFeHByOiBmdW5jdGlvbiAoYXR0cikge1xuICAgICAgICAgICAgaWYgKCFhdHRyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEV4cHJQYXJzZXIucHJvdG90eXBlLmFkZEV4cHIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGV2ZW50TmFtZSA9IGdldEV2ZW50TmFtZShhdHRyLm5hbWUsIHRoaXMuY29uZmlnKTtcbiAgICAgICAgICAgIGlmICghZXZlbnROYW1lICYmIERvbVVwZGF0ZXIuaXNFdmVudE5hbWUoYXR0ci5uYW1lKSkge1xuICAgICAgICAgICAgICAgIGV2ZW50TmFtZSA9IGF0dHIubmFtZS5yZXBsYWNlKCdvbicsICcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChldmVudE5hbWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25maWcuZ2V0RXhwclJlZ0V4cCgpLnRlc3QoYXR0ci52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudHNbZXZlbnROYW1lXSA9IGF0dHIudmFsdWU7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGV4cHIgPSBhdHRyLnZhbHVlLnJlcGxhY2UoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZy5nZXRFeHByUmVnRXhwKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFyZ3VtZW50c1sxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5leHByQ2FsY3VsYXRlci5jcmVhdGVFeHByRm4oZXhwciwgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcblxuICAgICAgICAgICAgICAgICAgICBEb21VcGRhdGVyLnNldEF0dHIodGhpcy5ub2RlLCAnb24nICsgZXZlbnROYW1lLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsb2NhbFNjb3BlID0gbmV3IFNjb3BlTW9kZWwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsU2NvcGUuc2V0KCdldmVudCcsIGV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsU2NvcGUuc2V0UGFyZW50KG1lLmdldFNjb3BlKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWUuZXhwckNhbGN1bGF0ZXIuY2FsY3VsYXRlKGV4cHIsIHRydWUsIGxvY2FsU2NvcGUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBFeHByUGFyc2VyLnByb3RvdHlwZS5hZGRFeHByLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOmUgOavgVxuICAgICAgICAgKlxuICAgICAgICAgKiBAaW5oZXJpdFxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqL1xuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB1dGlscy5lYWNoKHRoaXMuZXZlbnRzLCBmdW5jdGlvbiAoYXR0clZhbHVlLCBldmVudE5hbWUpIHtcbiAgICAgICAgICAgICAgICBEb21VcGRhdGVyLnNldEF0dHIodGhpcy5ub2RlLCAnb24nICsgZXZlbnROYW1lKTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5ldmVudHMgPSBudWxsO1xuXG4gICAgICAgICAgICBFeHByUGFyc2VyLnByb3RvdHlwZS5kZXN0cm95LmFwcGx5KHRoaXMpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICAgICRuYW1lOiAnRXZlbnRFeHByUGFyc2VyJ1xuICAgIH1cbik7XG5cblRyZWUucmVnaXN0ZVBhcnNlcihtb2R1bGUuZXhwb3J0cyk7XG5cblxuZnVuY3Rpb24gZ2V0RXZlbnROYW1lKGF0dHJOYW1lLCBjb25maWcpIHtcbiAgICBpZiAoYXR0ck5hbWUuaW5kZXhPZihjb25maWcuZXZlbnRQcmVmaXggKyAnLScpID09PSAtMSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcmV0dXJuIGF0dHJOYW1lLnJlcGxhY2UoY29uZmlnLmV2ZW50UHJlZml4ICsgJy0nLCAnJyk7XG59XG5cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdnRwbC9zcmMvcGFyc2Vycy9FdmVudEV4cHJQYXJzZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAyNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzXG4gKiovIiwiLyoqXG4gKiBAZmlsZSDooajovr7lvI/op6PmnpDlmajvvIzkuIDkuKrmlofmnKzoioLngrnmiJbogIXlhYPntKDoioLngrnlr7nlupTkuIDkuKrooajovr7lvI/op6PmnpDlmajlrp7kvotcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG52YXIgUGFyc2VyID0gcmVxdWlyZSgnLi9QYXJzZXInKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG52YXIgVHJlZSA9IHJlcXVpcmUoJy4uL3RyZWVzL1RyZWUnKTtcbnZhciBEb21VcGRhdGVyID0gcmVxdWlyZSgnLi4vRG9tVXBkYXRlcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBhcnNlci5leHRlbmRzKFxuICAgIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICog5Yid5aeL5YyWXG4gICAgICAgICAqXG4gICAgICAgICAqIEBpbmhlcml0RG9jXG4gICAgICAgICAqIEBwYXJhbSAge09iamVjdH0gb3B0aW9ucyDlj4LmlbBcbiAgICAgICAgICogQHBhcmFtICB7Tm9kZX0gb3B0aW9ucy5ub2RlIERPTeiKgueCuVxuICAgICAgICAgKi9cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIFBhcnNlci5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgICAgICAgICB0aGlzLm5vZGUgPSBvcHRpb25zLm5vZGU7XG5cbiAgICAgICAgICAgIHRoaXMuZXhwcnMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuZXhwckZucyA9IHt9O1xuICAgICAgICAgICAgdGhpcy51cGRhdGVGbnMgPSB7fTtcbiAgICAgICAgICAgIC8vIOaBouWkjeWOn+iyjOeahOWHveaVsFxuICAgICAgICAgICAgdGhpcy5yZXN0b3JlRm5zID0ge307XG4gICAgICAgICAgICB0aGlzLmV4cHJPbGRWYWx1ZXMgPSB7fTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBET03oioLngrnlsZ7mgKfkuI7mm7TmlrDlsZ7mgKfnmoTku7vliqFpZOeahOaYoOWwhFxuICAgICAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5hdHRyVG9Eb21UYXNrSWRNYXAgPSB7fTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog5pCc6ZuG6L+H56iLXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwdWJsaWNcbiAgICAgICAgICogQHJldHVybiB7Ym9vbGVhbn0g6L+U5Zue5biD5bCU5YC8XG4gICAgICAgICAqL1xuICAgICAgICBjb2xsZWN0RXhwcnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjdXJOb2RlID0gdGhpcy5ub2RlO1xuXG4gICAgICAgICAgICAvLyDmlofmnKzoioLngrlcbiAgICAgICAgICAgIGlmIChjdXJOb2RlLm5vZGVUeXBlID09PSAzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRFeHByKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOWFg+e0oOiKgueCuVxuICAgICAgICAgICAgaWYgKGN1ck5vZGUubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXR0cmlidXRlcyA9IGN1ck5vZGUuYXR0cmlidXRlcztcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaWwgPSBhdHRyaWJ1dGVzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRFeHByKGF0dHJpYnV0ZXNbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmt7vliqDooajovr7lvI9cbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKiBAcGFyYW0ge0F0dHJ9IGF0dHIg5aaC5p6c5b2T5YmN5piv5YWD57Sg6IqC54K577yM5YiZ6KaB5Lyg5YWl6YGN5Y6G5Yiw55qE5bGe5oCn77yMXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgICDmiYDku6VhdHRy5a2Y5Zyo5LiO5ZCm5piv5Yik5pat5b2T5YmN5YWD57Sg5piv5ZCm5piv5paH5pys6IqC54K555qE5LiA5Liq5L6d5o2uXG4gICAgICAgICAqL1xuICAgICAgICBhZGRFeHByOiBmdW5jdGlvbiAoYXR0cikge1xuICAgICAgICAgICAgdmFyIGV4cHIgPSBhdHRyID8gYXR0ci52YWx1ZSA6IHRoaXMubm9kZS5ub2RlVmFsdWU7XG4gICAgICAgICAgICBpZiAoIXRoaXMuY29uZmlnLmdldEV4cHJSZWdFeHAoKS50ZXN0KGV4cHIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYWRkRXhwcihcbiAgICAgICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgICAgIGV4cHIsXG4gICAgICAgICAgICAgICAgYXR0clxuICAgICAgICAgICAgICAgICAgICA/IGNyZWF0ZUF0dHJVcGRhdGVGbih0aGlzLmdldFRhc2tJZChhdHRyLm5hbWUpLCB0aGlzLm5vZGUsIGF0dHIubmFtZSwgdGhpcy5kb21VcGRhdGVyKVxuICAgICAgICAgICAgICAgICAgICA6IChmdW5jdGlvbiAobWUsIGN1ck5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0YXNrSWQgPSBtZS5kb21VcGRhdGVyLmdlbmVyYXRlVGFza0lkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGV4cHJWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lLmRvbVVwZGF0ZXIuYWRkVGFza0ZuKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXNrSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHV0aWxzLmJpbmQoZnVuY3Rpb24gKGN1ck5vZGUsIGV4cHJWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyTm9kZS5ub2RlVmFsdWUgPSBleHByVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIG51bGwsIGN1ck5vZGUsIGV4cHJWYWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfSkodGhpcywgdGhpcy5ub2RlKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgdGhpcy5yZXN0b3JlRm5zW2V4cHJdID0gdGhpcy5yZXN0b3JlRm5zW2V4cHJdIHx8IFtdO1xuICAgICAgICAgICAgaWYgKGF0dHIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc3RvcmVGbnNbZXhwcl0ucHVzaCh1dGlscy5iaW5kKGZ1bmN0aW9uIChjdXJOb2RlLCBhdHRyTmFtZSwgYXR0clZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGN1ck5vZGUuc2V0QXR0cmlidXRlKGF0dHJOYW1lLCBhdHRyVmFsdWUpO1xuICAgICAgICAgICAgICAgIH0sIG51bGwsIHRoaXMubm9kZSwgYXR0ci5uYW1lLCBhdHRyLnZhbHVlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc3RvcmVGbnNbZXhwcl0ucHVzaCh1dGlscy5iaW5kKGZ1bmN0aW9uIChjdXJOb2RlLCBub2RlVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VyTm9kZS5ub2RlVmFsdWUgPSBub2RlVmFsdWU7XG4gICAgICAgICAgICAgICAgfSwgbnVsbCwgdGhpcy5ub2RlLCB0aGlzLm5vZGUubm9kZVZhbHVlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiOt+WPluW8gOWni+iKgueCuVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICAqIEBpbmhlcml0RG9jXG4gICAgICAgICAqIEByZXR1cm4ge05vZGV9XG4gICAgICAgICAqL1xuICAgICAgICBnZXRTdGFydE5vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5vZGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiOt+WPlue7k+adn+iKgueCuVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICAqIEBpbmhlcml0RG9jXG4gICAgICAgICAqIEByZXR1cm4ge05vZGV9XG4gICAgICAgICAqL1xuICAgICAgICBnZXRFbmROb2RlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ub2RlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDplIDmr4FcbiAgICAgICAgICpcbiAgICAgICAgICogQGluaGVyaXREb2NcbiAgICAgICAgICovXG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHV0aWxzLmVhY2godGhpcy5leHBycywgZnVuY3Rpb24gKGV4cHIpIHtcbiAgICAgICAgICAgICAgICB1dGlscy5lYWNoKHRoaXMucmVzdG9yZUZuc1tleHByXSwgZnVuY3Rpb24gKHJlc3RvcmVGbikge1xuICAgICAgICAgICAgICAgICAgICByZXN0b3JlRm4oKTtcbiAgICAgICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgICAgICB0aGlzLm5vZGUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5leHBycyA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmV4cHJGbnMgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVGbnMgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5leHByT2xkVmFsdWVzID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMucmVzdG9yZUZucyA9IG51bGw7XG5cbiAgICAgICAgICAgIFBhcnNlci5wcm90b3R5cGUuZGVzdHJveS5jYWxsKHRoaXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDoioLngrnigJzpmpDol4/igJ3otbfmnaVcbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKi9cbiAgICAgICAgZ29EYXJrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB1dGlscy5nb0RhcmsodGhpcy5ub2RlKTtcbiAgICAgICAgICAgIHRoaXMuaXNHb0RhcmsgPSB0cnVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDlnKhtb2RlbOWPkeeUn+aUueWPmOeahOaXtuWAmeiuoeeul+S4gOS4i+ihqOi+vuW8j+eahOWAvC0+6ISP5qOA5rWLLT7mm7TmlrDnlYzpnaLjgIJcbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKi9cbiAgICAgICAgb25DaGFuZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzR29EYXJrKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZXhwcnMgPSB0aGlzLmV4cHJzO1xuICAgICAgICAgICAgdmFyIGV4cHJPbGRWYWx1ZXMgPSB0aGlzLmV4cHJPbGRWYWx1ZXM7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaWwgPSBleHBycy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGV4cHIgPSBleHByc1tpXTtcbiAgICAgICAgICAgICAgICB2YXIgZXhwclZhbHVlID0gdGhpcy5leHByRm5zW2V4cHJdKHRoaXMuc2NvcGVNb2RlbCk7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kaXJ0eUNoZWNrKGV4cHIsIGV4cHJWYWx1ZSwgZXhwck9sZFZhbHVlc1tleHByXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHVwZGF0ZUZucyA9IHRoaXMudXBkYXRlRm5zW2V4cHJdO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMCwgamwgPSB1cGRhdGVGbnMubGVuZ3RoOyBqIDwgamw7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlRm5zW2pdKGV4cHJWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBleHByT2xkVmFsdWVzW2V4cHJdID0gZXhwclZhbHVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBQYXJzZXIucHJvdG90eXBlLm9uQ2hhbmdlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiKgueCueKAnOaYvuekuuKAneWHuuadpVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqL1xuICAgICAgICByZXN0b3JlRnJvbURhcms6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHV0aWxzLnJlc3RvcmVGcm9tRGFyayh0aGlzLm5vZGUpO1xuICAgICAgICAgICAgdGhpcy5pc0dvRGFyayA9IGZhbHNlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmoLnmja5ET03oioLngrnnmoTlsZ7mgKflkI3lrZfmi7/liLDkuIDkuKrku7vliqFpZOOAglxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICAqIEBwYXJhbSAge3N0cmluZ30gYXR0ck5hbWUg5bGe5oCn5ZCN5a2XXG4gICAgICAgICAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAg5Lu75YqhaWRcbiAgICAgICAgICovXG4gICAgICAgIGdldFRhc2tJZDogZnVuY3Rpb24gKGF0dHJOYW1lKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuYXR0clRvRG9tVGFza0lkTWFwW2F0dHJOYW1lXSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYXR0clRvRG9tVGFza0lkTWFwW2F0dHJOYW1lXSA9IHRoaXMuZG9tVXBkYXRlci5nZW5lcmF0ZVRhc2tJZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXR0clRvRG9tVGFza0lkTWFwW2F0dHJOYW1lXTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6K6+572u5b2T5YmN6IqC54K555qE5bGe5oCnXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwdWJsaWNcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUg5bGe5oCn5ZCNXG4gICAgICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUg5bGe5oCn5YC8XG4gICAgICAgICAqL1xuICAgICAgICBzZXRBdHRyOiBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIHZhciB0YXNrSWQgPSB0aGlzLmdldFRhc2tJZCgpO1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMuZG9tVXBkYXRlci5hZGRUYXNrRm4odGFza0lkLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgRG9tVXBkYXRlci5zZXRBdHRyKG1lLm5vZGUsIG5hbWUsIHZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5blsZ7mgKdcbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IG5hbWUg5bGe5oCn5ZCNXG4gICAgICAgICAqIEByZXR1cm4geyp9ICAgICAg5bGe5oCn5YC8XG4gICAgICAgICAqL1xuICAgICAgICBnZXRBdHRyOiBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIERvbVVwZGF0ZXIuZ2V0QXR0cih0aGlzLm5vZGUsIG5hbWUpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWIpOaWreiKgueCueaYr+WQpuaYr+W6lOivpeeUseW9k+WJjeWkhOeQhuWZqOadpeWkhOeQhlxuICAgICAgICAgKlxuICAgICAgICAgKiBAc3RhdGljXG4gICAgICAgICAqIEBwYXJhbSAge05vZGV9ICBub2RlIOiKgueCuVxuICAgICAgICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgICAgICAgKi9cbiAgICAgICAgaXNQcm9wZXJOb2RlOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgcmV0dXJuIG5vZGUubm9kZVR5cGUgPT09IDEgfHwgbm9kZS5ub2RlVHlwZSA9PT0gMztcbiAgICAgICAgfSxcblxuICAgICAgICAkbmFtZTogJ0V4cHJQYXJzZXInXG4gICAgfVxuKTtcblxuVHJlZS5yZWdpc3RlUGFyc2VyKG1vZHVsZS5leHBvcnRzKTtcblxuLyoqXG4gKiDliJvlu7pET03oioLngrnlsZ7mgKfmm7TmlrDlh73mlbBcbiAqXG4gKiBAaW5uZXJcbiAqIEBwYXJhbSB7bnVtYmVyfSB0YXNrSWQgZG9t5Lu75YqhaWRcbiAqIEBwYXJhbSAge05vZGV9IG5vZGUgICAgRE9N5Lit55qE6IqC54K5XG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSDopoHmm7TmlrDnmoTlsZ7mgKflkI1cbiAqIEBwYXJhbSAge0RvbVVwZGF0ZXJ9IGRvbVVwZGF0ZXIgRE9N5pu05paw5ZmoXG4gKiBAcmV0dXJuIHtmdW5jdGlvbihPYmplY3QpfSAgICAgIOabtOaWsOWHveaVsFxuICovXG5mdW5jdGlvbiBjcmVhdGVBdHRyVXBkYXRlRm4odGFza0lkLCBub2RlLCBuYW1lLCBkb21VcGRhdGVyKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChleHByVmFsdWUpIHtcbiAgICAgICAgZG9tVXBkYXRlci5hZGRUYXNrRm4oXG4gICAgICAgICAgICB0YXNrSWQsXG4gICAgICAgICAgICB1dGlscy5iaW5kKGZ1bmN0aW9uIChub2RlLCBuYW1lLCBleHByVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBEb21VcGRhdGVyLnNldEF0dHIobm9kZSwgbmFtZSwgZXhwclZhbHVlKTtcbiAgICAgICAgICAgIH0sIG51bGwsIG5vZGUsIG5hbWUsIGV4cHJWYWx1ZSlcbiAgICAgICAgKTtcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBhZGRFeHByKHBhcnNlciwgZXhwciwgdXBkYXRlRm4pIHtcbiAgICBwYXJzZXIuZXhwcnMucHVzaChleHByKTtcbiAgICBpZiAoIXBhcnNlci5leHByRm5zW2V4cHJdKSB7XG4gICAgICAgIHBhcnNlci5leHByRm5zW2V4cHJdID0gY3JlYXRlRXhwckZuKHBhcnNlciwgZXhwcik7XG4gICAgfVxuICAgIHBhcnNlci51cGRhdGVGbnNbZXhwcl0gPSBwYXJzZXIudXBkYXRlRm5zW2V4cHJdIHx8IFtdO1xuICAgIHBhcnNlci51cGRhdGVGbnNbZXhwcl0ucHVzaCh1cGRhdGVGbik7XG59XG5cbi8qKlxuICog5Yib5bu65qC55o2uc2NvcGVNb2RlbOiuoeeul+ihqOi+vuW8j+WAvOeahOWHveaVsFxuICpcbiAqIEBpbm5lclxuICogQHBhcmFtICB7UGFyc2VyfSBwYXJzZXIg6Kej5p6Q5Zmo5a6e5L6LXG4gKiBAcGFyYW0gIHtzdHJpbmd9IGV4cHIgICDlkKvmnInooajovr7lvI/nmoTlrZfnrKbkuLJcbiAqIEByZXR1cm4ge2Z1bmN0aW9uKFNjb3BlKToqfVxuICovXG5mdW5jdGlvbiBjcmVhdGVFeHByRm4ocGFyc2VyLCBleHByKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChzY29wZU1vZGVsKSB7XG4gICAgICAgIC8vIOatpOWkhOimgeWIhuS4pOenjeaDheWGte+8mlxuICAgICAgICAvLyAx44CBZXhwcuW5tuS4jeaYr+e6r+ato+eahOihqOi+vuW8j++8jOWmgmA9PSR7bmFtZX09PWDjgIJcbiAgICAgICAgLy8gMuOAgWV4cHLmmK/nuq/mraPnmoTooajovr7lvI/vvIzlpoJgJHtuYW1lfWDjgIJcbiAgICAgICAgLy8g5a+55LqO5LiN57qv5q2j6KGo6L6+5byP55qE5oOF5Ya177yM5q2k5aSE55qE6L+U5Zue5YC86IKv5a6a5piv5a2X56ym5Liy77ybXG4gICAgICAgIC8vIOiAjOWvueS6jue6r+ato+eahOihqOi+vuW8j++8jOatpOWkhOWwseS4jeimgeWwhuWFtui9rOaNouaIkOWtl+espuS4suW9ouW8j+S6huOAglxuXG4gICAgICAgIHZhciByZWdFeHAgPSBwYXJzZXIuY29uZmlnLmdldEV4cHJSZWdFeHAoKTtcblxuICAgICAgICB2YXIgcG9zc2libGVFeHByQ291bnQgPSBleHByLm1hdGNoKG5ldyBSZWdFeHAodXRpbHMucmVnRXhwRW5jb2RlKHBhcnNlci5jb25maWcuZXhwclByZWZpeCksICdnJykpO1xuICAgICAgICBwb3NzaWJsZUV4cHJDb3VudCA9IHBvc3NpYmxlRXhwckNvdW50ID8gcG9zc2libGVFeHByQ291bnQubGVuZ3RoIDogMDtcblxuICAgICAgICAvLyDkuI3nuq/mraNcbiAgICAgICAgaWYgKHBvc3NpYmxlRXhwckNvdW50ICE9PSAxIHx8IGV4cHIucmVwbGFjZShyZWdFeHAsICcnKSkge1xuICAgICAgICAgICAgcmV0dXJuIGV4cHIucmVwbGFjZShyZWdFeHAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBwYXJzZXIuZXhwckNhbGN1bGF0ZXIuY3JlYXRlRXhwckZuKGFyZ3VtZW50c1sxXSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlci5leHByQ2FsY3VsYXRlci5jYWxjdWxhdGUoYXJndW1lbnRzWzFdLCBmYWxzZSwgc2NvcGVNb2RlbCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOe6r+ato1xuICAgICAgICB2YXIgcHVyZUV4cHIgPSBleHByLnNsaWNlKHBhcnNlci5jb25maWcuZXhwclByZWZpeC5sZW5ndGgsIC1wYXJzZXIuY29uZmlnLmV4cHJTdWZmaXgubGVuZ3RoKTtcbiAgICAgICAgcGFyc2VyLmV4cHJDYWxjdWxhdGVyLmNyZWF0ZUV4cHJGbihwdXJlRXhwcik7XG4gICAgICAgIHJldHVybiBwYXJzZXIuZXhwckNhbGN1bGF0ZXIuY2FsY3VsYXRlKHB1cmVFeHByLCBmYWxzZSwgc2NvcGVNb2RlbCk7XG4gICAgfTtcbn1cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdnRwbC9zcmMvcGFyc2Vycy9FeHByUGFyc2VyLmpzXG4gKiogbW9kdWxlIGlkID0gMjVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDIgM1xuICoqLyIsInZhciBUcmVlID0gcmVxdWlyZSgndnRwbC9zcmMvdHJlZXMvVHJlZScpO1xudmFyIEV2ZW50ID0gcmVxdWlyZSgndnRwbC9zcmMvRXZlbnQnKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJ3Z0cGwvc3JjL3V0aWxzJyk7XG52YXIgQ29tcG9uZW50TWFuYWdlciA9IHJlcXVpcmUoJy4vQ29tcG9uZW50TWFuYWdlcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRyZWUuZXh0ZW5kcyh7XG5cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICBUcmVlLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgdGhpcy5jb21wb25lbnRFdmVudCA9IG5ldyBFdmVudCgpO1xuICAgICAgICBpZiAob3B0aW9ucy5jb21wb25lbnRDaGlsZHJlbikge1xuICAgICAgICAgICAgdGhpcy5zZXRUcmVlVmFyKCdjb21wb25lbnRDaGlsZHJlbicsIG9wdGlvbnMuY29tcG9uZW50Q2hpbGRyZW4pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNvbXBvbmVudE1hbmFnZXIgPSBuZXcgQ29tcG9uZW50TWFuYWdlcigpO1xuICAgICAgICBjb21wb25lbnRNYW5hZ2VyLnNldFBhcmVudCh0aGlzLmdldFRyZWVWYXIoJ2NvbXBvbmVudE1hbmFnZXInKSk7XG4gICAgICAgIHRoaXMuc2V0VHJlZVZhcignY29tcG9uZW50TWFuYWdlcicsIGNvbXBvbmVudE1hbmFnZXIpO1xuICAgIH0sXG5cbiAgICBzZXRQYXJlbnQ6IGZ1bmN0aW9uIChwYXJlbnRUcmVlKSB7XG4gICAgICAgIFRyZWUucHJvdG90eXBlLnNldFBhcmVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgICAgIHBhcmVudFRyZWUucm9vdFNjb3BlLmFkZENoaWxkKHRoaXMucm9vdFNjb3BlKTtcbiAgICAgICAgdGhpcy5yb290U2NvcGUuc2V0UGFyZW50KHBhcmVudFRyZWUucm9vdFNjb3BlKTtcbiAgICB9LFxuXG4gICAgY3JlYXRlUGFyc2VyOiBmdW5jdGlvbiAoUGFyc2VyQ2xhc3MsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIGluc3RhbmNlID0gVHJlZS5wcm90b3R5cGUuY3JlYXRlUGFyc2VyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDms6jlhoznu4Tku7bnsbtcbiAgICAgKiDorr7nva7nu5HlrprlnKjmoJHkuIrpnaLnmoTpop3lpJblj5jph4/jgILov5nkupvlj5jph4/mnInlpoLkuIvnibnmgKfvvJpcbiAgICAgKiAx44CB5peg5rOV6KaG55uW77ybXG4gICAgICogMuOAgeWcqOiOt+WPlnRyZWVWYXJz5LiK6Z2i5p+Q5Liq5Y+Y6YeP55qE5pe25YCZ77yM5aaC5p6c5b2T5YmN5qCR5Y+W5Ye65p2l5pivdW5kZWZpbmVk77yM6YKj5LmI5bCx5Lya5Yiw54i257qn5qCR55qEdHJlZVZhcnPkuIrljrvmib7vvIzku6XmraTnsbvmjqjjgIJcbiAgICAgKlxuICAgICAqIEBwdWJsaWNcbiAgICAgKiBAcGFyYW0gIHtNYXAuPHN0cmluZywgQ29tcG9uZW50Pn0gY29tcG9uZW50Q2xhc3NlcyDnu4Tku7blkI3lkoznu4Tku7bnsbvnmoTmmKDlsIRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAg5Y+Y6YeP5ZCNXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSDlj5jph4/lgLxcbiAgICAgKi9cbiAgICByZWdpc3RlQ29tcG9uZW50czogZnVuY3Rpb24gKGNvbXBvbmVudENsYXNzZXMpIHtcbiAgICAgICAgaWYgKCF1dGlscy5pc0FycmF5KGNvbXBvbmVudENsYXNzZXMpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY29tcG9uZW50TWFuYWdlciA9IHRoaXMuZ2V0VHJlZVZhcignY29tcG9uZW50TWFuYWdlcicpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IGNvbXBvbmVudENsYXNzZXMubGVuZ3RoOyBpIDwgaWw7ICsraSkge1xuICAgICAgICAgICAgdmFyIGNvbXBvbmVudENsYXNzID0gY29tcG9uZW50Q2xhc3Nlc1tpXTtcbiAgICAgICAgICAgIGNvbXBvbmVudE1hbmFnZXIucmVnaXN0ZShjb21wb25lbnRDbGFzcyk7XG4gICAgICAgIH1cbiAgICB9XG59LCB7XG4gICAgJG5hbWU6ICdDb21wb25lbnRUcmVlJ1xufSk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Zjb21wb25lbnQvc3JjL0NvbXBvbmVudFRyZWUuanNcbiAqKiBtb2R1bGUgaWQgPSAyNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzXG4gKiovIiwiLyoqXG4gKiBAZmlsZSDnu4Tku7bnrqHnkIbjgIJDb21wb25lbnRNYW5hZ2Vy5Lmf5piv5pyJ5bGC57qn5YWz57O755qE77yMXG4gKiAgICAgICBUcmVl5LiL6Z2i55qEQ29tcG9uZW50TWFuYWdlcuazqOWGjOi/meS4qlRyZWXlrp7kvovnlKjliLDnmoRDb21wb25lbnTvvIxcbiAqICAgICAgIOiAjOWcqENvbXBvbmVudOS4reS5n+WPr+S7peazqOWGjOatpENvbXBvbmVudOeahHRwbOS4reWwhuS8muS9v+eUqOWIsOeahENvbXBvbmVudOOAglxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJ3Z0cGwvc3JjL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIENvbXBvbmVudE1hbmFnZXIoKSB7XG4gICAgdGhpcy5jb21wb25lbnRzID0ge307XG59XG5cbi8qKlxuICog5rOo5YaM57uE5Lu244CCXG4gKlxuICogQHB1YmxpY1xuICogQHBhcmFtICB7Q29uc3RydWN0b3J9IENvbXBvbmVudENsYXNzIOe7hOS7tuexu1xuICogQHBhcmFtICB7c3RyaW5nPX0gbmFtZSAgICAgICAgICAg57uE5Lu25ZCN77yM5Y+v6YCJXG4gKi9cbkNvbXBvbmVudE1hbmFnZXIucHJvdG90eXBlLnJlZ2lzdGUgPSBmdW5jdGlvbiAoQ29tcG9uZW50Q2xhc3MpIHtcbiAgICB2YXIgbmFtZSA9IENvbXBvbmVudENsYXNzLiRuYW1lO1xuICAgIHRoaXMuY29tcG9uZW50c1tuYW1lXSA9IENvbXBvbmVudENsYXNzO1xuICAgIHRoaXMubW91bnRTdHlsZShDb21wb25lbnRDbGFzcyk7XG59O1xuXG4vKipcbiAqIOagueaNruWQjeWtl+iOt+WPlue7hOS7tuexu+OAguWcqOaooeadv+ino+aekOeahOi/h+eoi+S4reS8muiwg+eUqOi/meS4quaWueazleOAglxuICpcbiAqIEBwdWJsaWNcbiAqIEBwYXJhbSAge3N0cmluZ30gbmFtZSDnu4Tku7blkI1cbiAqIEByZXR1cm4ge0NvbXBvbmVudENsYXNzfSAg57uE5Lu257G7XG4gKi9cbkNvbXBvbmVudE1hbmFnZXIucHJvdG90eXBlLmdldENsYXNzID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB2YXIgY29tcG9uZW50ID0gdGhpcy5jb21wb25lbnRzW25hbWVdO1xuICAgIGlmIChjb21wb25lbnQpIHtcbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgICAgY29tcG9uZW50ID0gdGhpcy5wYXJlbnQuZ2V0Q2xhc3MobmFtZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbXBvbmVudDtcbn07XG5cbi8qKlxuICog6K6+572u54i257qn57uE5Lu2566h55CG5ZmoXG4gKlxuICogQHB1YmxpY1xuICogQHBhcmFtIHtDb21wb25lbnRNYW5nZXJ9IGNvbXBvbmVudE1hbmFnZXIg57uE5Lu2566h55CG5ZmoXG4gKi9cbkNvbXBvbmVudE1hbmFnZXIucHJvdG90eXBlLnNldFBhcmVudCA9IGZ1bmN0aW9uIChjb21wb25lbnRNYW5hZ2VyKSB7XG4gICAgdGhpcy5wYXJlbnQgPSBjb21wb25lbnRNYW5hZ2VyO1xufTtcblxuLyoqXG4gKiDlsIbnu4Tku7bnmoTmoLflvI/mjILovb3kuIrljrtcbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHvnu4Tku7bnsbt9IENvbXBvbmVudENsYXNzIOe7hOS7tuexu1xuICovXG5Db21wb25lbnRNYW5hZ2VyLnByb3RvdHlwZS5tb3VudFN0eWxlID0gZnVuY3Rpb24gKENvbXBvbmVudENsYXNzKSB7XG4gICAgdmFyIHN0eWxlTm9kZUlkID0gJ2NvbXBvbmVudC0nICsgQ29tcG9uZW50Q2xhc3MuJG5hbWU7XG5cbiAgICAvLyDliKTmlq3kuIDkuIvvvIzpgb/lhY3ph43lpI3mt7vliqBjc3NcbiAgICBpZiAoIWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHN0eWxlTm9kZUlkKSkge1xuICAgICAgICB2YXIgc3R5bGUgPSBDb21wb25lbnRDbGFzcy5nZXRTdHlsZSgpO1xuICAgICAgICBpZiAoc3R5bGUpIHtcbiAgICAgICAgICAgIHZhciBzdHlsZU5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICAgICAgc3R5bGVOb2RlLnNldEF0dHJpYnV0ZSgnaWQnLCBzdHlsZU5vZGVJZCk7XG4gICAgICAgICAgICBzdHlsZU5vZGUuaW5uZXJIVE1MID0gc3R5bGUucmVwbGFjZShcbiAgICAgICAgICAgICAgICAvI3Jvb3QjL2csXG4gICAgICAgICAgICAgICAgJy4nICsgQ29tcG9uZW50TWFuYWdlci5nZXRDc3NDbGFzc05hbWUoQ29tcG9uZW50Q2xhc3MpLmpvaW4oJy4nKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVOb2RlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIOWwhueItuexu+eahGNzc+agt+W8j+S5n+WKoOS4iuWOu+OAgueItuexu+W+iOWPr+iDveayoeazqOWGjO+8jOWmguaenOatpOWkhOS4jeWKoOS4iuWOu++8jOagt+W8j+WPr+iDveWwseS8mue8uuS4gOWdl+OAglxuICAgIGlmIChDb21wb25lbnRDbGFzcy4kbmFtZSAhPT0gJ0NvbXBvbmVudCcpIHtcbiAgICAgICAgdGhpcy5tb3VudFN0eWxlKENvbXBvbmVudENsYXNzLiRzdXBlckNsYXNzKTtcbiAgICB9XG59O1xuXG4vKipcbiAqIOiOt+WPlue7hOS7tueahGNzc+exu+WQjeOAguinhOWImeaYr+agueaNrue7p+aJv+WFs+ezu++8jOi/m+ihjOexu+WQjeaLvOaOpe+8jOS7juiAjOS9v+WtkOe7hOS7tuexu+eahGNzc+WFt+acieabtOmrmOS8mOWFiOe6p+OAglxuICpcbiAqIEBzdGF0aWNcbiAqIEBwYXJhbSB7Q29uc3RydWN0b3J9IENvbXBvbmVudENsYXNzIOe7hOS7tuexu1xuICogQHJldHVybiB7QXJyYXkuPHN0cmluZz59IOWQiOaIkOexu+WQjeaVsOe7hFxuICovXG5Db21wb25lbnRNYW5hZ2VyLmdldENzc0NsYXNzTmFtZSA9IGZ1bmN0aW9uIChDb21wb25lbnRDbGFzcykge1xuICAgIHZhciBuYW1lID0gW107XG4gICAgZm9yICh2YXIgY3VyQ2xzID0gQ29tcG9uZW50Q2xhc3M7IGN1ckNsczsgY3VyQ2xzID0gY3VyQ2xzLiRzdXBlckNsYXNzKSB7XG4gICAgICAgIG5hbWUucHVzaCh1dGlscy5jYW1lbDJsaW5lKGN1ckNscy4kbmFtZSkpO1xuXG4gICAgICAgIC8vIOacgOWkmuWIsOe7hOS7tuWfuuexu1xuICAgICAgICBpZiAoY3VyQ2xzLiRuYW1lID09PSAnQ29tcG9uZW50Jykge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5hbWU7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gQ29tcG9uZW50TWFuYWdlcjtcblxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92Y29tcG9uZW50L3NyYy9Db21wb25lbnRNYW5hZ2VyLmpzXG4gKiogbW9kdWxlIGlkID0gMjdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDIgM1xuICoqLyIsIi8qKlxuICogQGZpbGUg57uE5Lu255qEIDwhLS0gY2hpbGRyZW4gLS0+IOWunuS+i++8jOiusOW9leebuOWFs+S/oeaBr++8jOaWueS+v+WQjue7rSBDaGlsZHJlbkRpcmVjdGl2ZVBhcnNlciDop6PmnpBcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCd2dHBsL3NyYy91dGlscycpO1xuXG5mdW5jdGlvbiBDb21wb25lbnRDaGlsZHJlbihzdGFydE5vZGUsIGVuZE5vZGUsIHNjb3BlLCBjb21wb25lbnQpIHtcbiAgICB0aGlzLmRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGlmICghc3RhcnROb2RlIHx8ICFlbmROb2RlKSB7XG4gICAgICAgIHRoaXMuZGl2LmlubmVySFRNTCA9ICcnO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdXRpbHMudHJhdmVyc2VOb2RlcyhcbiAgICAgICAgICAgIHN0YXJ0Tm9kZSxcbiAgICAgICAgICAgIGVuZE5vZGUsXG4gICAgICAgICAgICBmdW5jdGlvbiAoY3VyTm9kZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGl2LmFwcGVuZENoaWxkKGN1ck5vZGUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRoaXNcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICB0aGlzLnNjb3BlID0gc2NvcGU7XG4gICAgdGhpcy5jb21wb25lbnQgPSBjb21wb25lbnQ7XG59XG5cbkNvbXBvbmVudENoaWxkcmVuLnByb3RvdHlwZS5nZXRUcGxIdG1sID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmRpdi5pbm5lckhUTUw7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbXBvbmVudENoaWxkcmVuO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92Y29tcG9uZW50L3NyYy9Db21wb25lbnRDaGlsZHJlbi5qc1xuICoqIG1vZHVsZSBpZCA9IDI4XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyIDNcbiAqKi8iLCJyZXF1aXJlKCcuL3NyYy9wYXJzZXJzL1Njb3BlRGlyZWN0aXZlUGFyc2VyJyk7XG5cbnZhciBhbWRFeHBvcnRzID0ge1xuICAgIENvbmZpZzogcmVxdWlyZSgnLi9zcmMvQ29uZmlnJyksXG4gICAgVHJlZTogcmVxdWlyZSgnLi9zcmMvdHJlZXMvVHJlZScpLFxuICAgIERpcnR5Q2hlY2tlcjogcmVxdWlyZSgnLi9zcmMvRGlydHlDaGVja2VyJyksXG4gICAgUGFyc2VyOiByZXF1aXJlKCcuL3NyYy9wYXJzZXJzL1BhcnNlcicpLFxuICAgIEZvckRpcmVjdGl2ZVBhcnNlcjogcmVxdWlyZSgnLi9zcmMvcGFyc2Vycy9Gb3JEaXJlY3RpdmVQYXJzZXInKSxcbiAgICBJZkRpcmVjdGl2ZVBhcnNlcjogcmVxdWlyZSgnLi9zcmMvcGFyc2Vycy9JZkRpcmVjdGl2ZVBhcnNlcicpLFxuICAgIEV2ZW50RXhwclBhcnNlcjogcmVxdWlyZSgnLi9zcmMvcGFyc2Vycy9FdmVudEV4cHJQYXJzZXInKSxcbiAgICBFeHByUGFyc2VyOiByZXF1aXJlKCcuL3NyYy9wYXJzZXJzL0V4cHJQYXJzZXInKSxcbiAgICBFeHByQ2FsY3VsYXRlcjogcmVxdWlyZSgnLi9zcmMvRXhwckNhbGN1bGF0ZXInKSxcbiAgICBWYXJEaXJlY3RpdmVQYXJzZXI6IHJlcXVpcmUoJy4vc3JjL3BhcnNlcnMvVmFyRGlyZWN0aXZlUGFyc2VyJyksXG4gICAgaW5oZXJpdDogcmVxdWlyZSgnLi9zcmMvaW5oZXJpdCcpLFxuICAgIHV0aWxzOiByZXF1aXJlKCcuL3NyYy91dGlscycpLFxuICAgIERvbVVwZGF0ZXI6IHJlcXVpcmUoJy4vc3JjL0RvbVVwZGF0ZXInKSxcbiAgICBTY29wZU1vZGVsOiByZXF1aXJlKCcuL3NyYy9TY29wZU1vZGVsJylcbn07XG5kZWZpbmUoZnVuY3Rpb24gKHJlcXVpcmUsIGV4cG9ydHMsIG1vZHVsZSkge1xuICAgIG1vZHVsZS5leHBvcnRzID0gYW1kRXhwb3J0cztcbn0pO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL21haW4uanNcbiAqKiBtb2R1bGUgaWQgPSAyOVxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzXG4gKiovIiwiLyoqXG4gKiBAZmlsZSBzY29wZSBkaXJlY3RpdmUgcGFyc2VyXG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20pXG4gKi9cblxudmFyIERpcmVjdGl2ZVBhcnNlciA9IHJlcXVpcmUoJy4vRGlyZWN0aXZlUGFyc2VyJyk7XG52YXIgU2NvcGVNb2RlbCA9IHJlcXVpcmUoJy4uL1Njb3BlTW9kZWwnKTtcbnZhciBUcmVlID0gcmVxdWlyZSgnLi4vdHJlZXMvVHJlZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERpcmVjdGl2ZVBhcnNlci5leHRlbmRzKFxuICAgIHtcbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIERpcmVjdGl2ZVBhcnNlci5wcm90b3R5cGUuaW5pdGlhbGl6ZS5jYWxsKHRoaXMsIG9wdGlvbnMpO1xuXG4gICAgICAgICAgICB0aGlzLnN0YXJ0Tm9kZSA9IG9wdGlvbnMuc3RhcnROb2RlO1xuICAgICAgICAgICAgdGhpcy5lbmROb2RlID0gb3B0aW9ucy5lbmROb2RlO1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMudHJlZS5nZXRUcmVlVmFyKCdzY29wZXMnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMudHJlZS5zZXRUcmVlVmFyKCdzY29wZXMnLCB7fSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0U2NvcGU6IGZ1bmN0aW9uIChzY29wZU1vZGVsKSB7XG4gICAgICAgICAgICB0aGlzLnNjb3BlTW9kZWwuc2V0UGFyZW50KHNjb3BlTW9kZWwpO1xuICAgICAgICAgICAgc2NvcGVNb2RlbC5hZGRDaGlsZCh0aGlzLnNjb3BlTW9kZWwpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNvbGxlY3RFeHByczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHNjb3BlTmFtZSA9IHRoaXMuc3RhcnROb2RlLm5vZGVWYWx1ZVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXHMrL2csICcnKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKHRoaXMuY29uZmlnLnNjb3BlTmFtZSArICc6JywgJycpO1xuICAgICAgICAgICAgaWYgKHNjb3BlTmFtZSkge1xuICAgICAgICAgICAgICAgIHZhciBzY29wZXMgPSB0aGlzLnRyZWUuZ2V0VHJlZVZhcignc2NvcGVzJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5zY29wZU1vZGVsID0gbmV3IFNjb3BlTW9kZWwoKTtcbiAgICAgICAgICAgICAgICBzY29wZXNbc2NvcGVOYW1lXSA9IHNjb3Blc1tzY29wZU5hbWVdIHx8IFtdO1xuICAgICAgICAgICAgICAgIHNjb3Blc1tzY29wZU5hbWVdLnB1c2godGhpcy5zY29wZU1vZGVsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0Tm9kZTogdGhpcy5zdGFydE5vZGUubmV4dFNpYmxpbmcsXG4gICAgICAgICAgICAgICAgICAgIGVuZE5vZGU6IHRoaXMuZW5kTm9kZS5wcmV2aW91c1NpYmxpbmdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICAgIGlzUHJvcGVyTm9kZTogZnVuY3Rpb24gKG5vZGUsIGNvbmZpZykge1xuICAgICAgICAgICAgcmV0dXJuIERpcmVjdGl2ZVBhcnNlci5pc1Byb3Blck5vZGUobm9kZSwgY29uZmlnKVxuICAgICAgICAgICAgICAgICYmIG5vZGUubm9kZVZhbHVlLnJlcGxhY2UoL1xccysvLCAnJykuaW5kZXhPZihjb25maWcuc2NvcGVOYW1lICsgJzonKSA9PT0gMDtcbiAgICAgICAgfSxcblxuICAgICAgICBmaW5kRW5kTm9kZTogZnVuY3Rpb24gKHN0YXJ0Tm9kZSwgY29uZmlnKSB7XG4gICAgICAgICAgICB2YXIgY3VyTm9kZSA9IHN0YXJ0Tm9kZTtcbiAgICAgICAgICAgIHdoaWxlICgoY3VyTm9kZSA9IGN1ck5vZGUubmV4dFNpYmxpbmcpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzRW5kTm9kZShjdXJOb2RlLCBjb25maWcpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjdXJOb2RlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBnZXROb0VuZE5vZGVFcnJvcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcigndGhlIHNjb3BlIGRpcmVjdGl2ZSBpcyBub3QgcHJvcGVybHkgZW5kZWQhJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJG5hbWU6ICdTY29wZURpcmVjdGl2ZVBhcnNlcidcbiAgICB9XG4pO1xuXG5UcmVlLnJlZ2lzdGVQYXJzZXIobW9kdWxlLmV4cG9ydHMpO1xuXG5mdW5jdGlvbiBpc0VuZE5vZGUobm9kZSwgY29uZmlnKSB7XG4gICAgcmV0dXJuIG5vZGUubm9kZVR5cGUgPT09IDhcbiAgICAgICAgJiYgbm9kZS5ub2RlVmFsdWUucmVwbGFjZSgvXFxzKy9nLCAnJykgPT09IGNvbmZpZy5zY29wZUVuZE5hbWU7XG59XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Z0cGwvc3JjL3BhcnNlcnMvU2NvcGVEaXJlY3RpdmVQYXJzZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAzMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzXG4gKiovIiwiLyoqXG4gKiBAZmlsZSDphY3nva5cbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG5mdW5jdGlvbiBDb25maWcoKSB7XG4gICAgdGhpcy5leHByUHJlZml4ID0gJyR7JztcbiAgICB0aGlzLmV4cHJTdWZmaXggPSAnfSc7XG5cbiAgICB0aGlzLmlmTmFtZSA9ICdpZic7XG4gICAgdGhpcy5lbGlmTmFtZSA9ICdlbGlmJztcbiAgICB0aGlzLmVsc2VOYW1lID0gJ2Vsc2UnO1xuICAgIHRoaXMuaWZFbmROYW1lID0gJy9pZic7XG5cbiAgICB0aGlzLmlmUHJlZml4UmVnRXhwID0gL15cXHMqaWY6XFxzKi87XG4gICAgdGhpcy5lbGlmUHJlZml4UmVnRXhwID0gL15cXHMqZWxpZjpcXHMqLztcbiAgICB0aGlzLmVsc2VQcmVmaXhSZWdFeHAgPSAvXlxccyplbHNlXFxzKi87XG4gICAgdGhpcy5pZkVuZFByZWZpeFJlZ0V4cCA9IC9eXFxzKlxcL2lmXFxzKi87XG5cbiAgICB0aGlzLmZvck5hbWUgPSAnZm9yJztcbiAgICB0aGlzLmZvckVuZE5hbWUgPSAnL2Zvcic7XG5cbiAgICB0aGlzLmZvclByZWZpeFJlZ0V4cCA9IC9eXFxzKmZvcjpcXHMqLztcbiAgICB0aGlzLmZvckVuZFByZWZpeFJlZ0V4cCA9IC9eXFxzKlxcL2ZvclxccyovO1xuXG4gICAgdGhpcy5ldmVudFByZWZpeCA9ICdldmVudCc7XG5cbiAgICB0aGlzLnZhck5hbWUgPSAndmFyJztcblxuICAgIHRoaXMuc2NvcGVOYW1lID0gJ3Njb3BlJztcbiAgICB0aGlzLnNjb3BlRW5kTmFtZSA9ICcvc2NvcGUnO1xufVxuXG5Db25maWcucHJvdG90eXBlLnNldEV4cHJQcmVmaXggPSBmdW5jdGlvbiAocHJlZml4KSB7XG4gICAgdGhpcy5leHByUHJlZml4ID0gcHJlZml4O1xufTtcblxuQ29uZmlnLnByb3RvdHlwZS5zZXRFeHByU3VmZml4ID0gZnVuY3Rpb24gKHN1ZmZpeCkge1xuICAgIHRoaXMuZXhwclN1ZmZpeCA9IHN1ZmZpeDtcbn07XG5cbkNvbmZpZy5wcm90b3R5cGUuZ2V0RXhwclJlZ0V4cCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuZXhwclJlZ0V4cCkge1xuICAgICAgICB0aGlzLmV4cHJSZWdFeHAgPSBuZXcgUmVnRXhwKHJlZ0V4cEVuY29kZSh0aGlzLmV4cHJQcmVmaXgpICsgJyguKz8pJyArIHJlZ0V4cEVuY29kZSh0aGlzLmV4cHJTdWZmaXgpLCAnZycpO1xuICAgIH1cbiAgICB0aGlzLmV4cHJSZWdFeHAubGFzdEluZGV4ID0gMDtcbiAgICByZXR1cm4gdGhpcy5leHByUmVnRXhwO1xufTtcblxuQ29uZmlnLnByb3RvdHlwZS5nZXRBbGxJZlJlZ0V4cCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuYWxsSWZSZWdFeHApIHtcbiAgICAgICAgdGhpcy5hbGxJZlJlZ0V4cCA9IG5ldyBSZWdFeHAoJ1xcXFxzKignXG4gICAgICAgICAgICArIHRoaXMuaWZOYW1lICsgJ3wnXG4gICAgICAgICAgICArIHRoaXMuZWxpZk5hbWUgKyAnfCdcbiAgICAgICAgICAgICsgdGhpcy5lbHNlTmFtZSArICd8J1xuICAgICAgICAgICAgKyB0aGlzLmlmRW5kTmFtZSArICcpOlxcXFxzKicsICdnJyk7XG4gICAgfVxuICAgIHRoaXMuYWxsSWZSZWdFeHAubGFzdEluZGV4ID0gMDtcbiAgICByZXR1cm4gdGhpcy5hbGxJZlJlZ0V4cDtcbn07XG5cbkNvbmZpZy5wcm90b3R5cGUuc2V0SWZOYW1lID0gZnVuY3Rpb24gKGlmTmFtZSkge1xuICAgIHRoaXMuaWZOYW1lID0gaWZOYW1lO1xuICAgIHRoaXMuaWZQcmVmaXhSZWdFeHAgPSBuZXcgUmVnRXhwKCdeXFxcXHMqJyArIGlmTmFtZSArICc6XFxcXHMqJyk7XG59O1xuXG5Db25maWcucHJvdG90eXBlLnNldEVsaWZOYW1lID0gZnVuY3Rpb24gKGVsaWZOYW1lKSB7XG4gICAgdGhpcy5lbGlmTmFtZSA9IGVsaWZOYW1lO1xuICAgIHRoaXMuZWxpZlByZWZpeFJlZ0V4cCA9IG5ldyBSZWdFeHAoJ15cXFxccyonICsgZWxpZk5hbWUgKyAnOlxcXFxzKicpO1xufTtcblxuQ29uZmlnLnByb3RvdHlwZS5zZXRFbHNlTmFtZSA9IGZ1bmN0aW9uIChlbHNlTmFtZSkge1xuICAgIHRoaXMuZWxzZU5hbWUgPSBlbHNlTmFtZTtcbiAgICB0aGlzLmVsc2VQcmVmaXhSZWdFeHAgPSBuZXcgUmVnRXhwKCdeXFxcXHMqJyArIGVsc2VOYW1lICsgJ1xcXFxzKicpO1xufTtcblxuQ29uZmlnLnByb3RvdHlwZS5zZXRJZkVuZE5hbWUgPSBmdW5jdGlvbiAoaWZFbmROYW1lKSB7XG4gICAgdGhpcy5pZkVuZE5hbWUgPSBpZkVuZE5hbWU7XG4gICAgdGhpcy5pZkVuZFByZWZpeFJlZ0V4cCA9IG5ldyBSZWdFeHAoJ15cXFxccyonICsgaWZFbmROYW1lICsgJ1xcXFxzKicpO1xufTtcblxuQ29uZmlnLnByb3RvdHlwZS5zZXRGb3JOYW1lID0gZnVuY3Rpb24gKGZvck5hbWUpIHtcbiAgICB0aGlzLmZvck5hbWUgPSBmb3JOYW1lO1xuICAgIHRoaXMuZm9yUHJlZml4UmVnRXhwID0gbmV3IFJlZ0V4cCgnXlxcXFxzKicgKyBmb3JOYW1lICsgJzpcXFxccyonKTtcbn07XG5cbkNvbmZpZy5wcm90b3R5cGUuc2V0Rm9yRW5kTmFtZSA9IGZ1bmN0aW9uIChmb3JFbmROYW1lKSB7XG4gICAgdGhpcy5mb3JFbmROYW1lID0gZm9yRW5kTmFtZTtcbiAgICB0aGlzLmZvckVuZFByZWZpeFJlZ0V4cCA9IG5ldyBSZWdFeHAoJ15cXFxccyonICsgZm9yRW5kTmFtZSArICdcXFxccyonKTtcbn07XG5cbkNvbmZpZy5wcm90b3R5cGUuZ2V0Rm9yRXhwcnNSZWdFeHAgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLmZvckV4cHJzUmVnRXhwKSB7XG4gICAgICAgIHRoaXMuZm9yRXhwcnNSZWdFeHAgPSBuZXcgUmVnRXhwKCdcXFxccyonXG4gICAgICAgICAgICArIHRoaXMuZm9yTmFtZVxuICAgICAgICAgICAgKyAnOlxcXFxzKidcbiAgICAgICAgICAgICsgcmVnRXhwRW5jb2RlKHRoaXMuZXhwclByZWZpeClcbiAgICAgICAgICAgICsgJyhbXicgKyByZWdFeHBFbmNvZGUodGhpcy5leHByU3VmZml4KVxuICAgICAgICAgICAgKyAnXSspJyArIHJlZ0V4cEVuY29kZSh0aGlzLmV4cHJTdWZmaXgpKTtcbiAgICB9XG4gICAgdGhpcy5mb3JFeHByc1JlZ0V4cC5sYXN0SW5kZXggPSAwO1xuICAgIHJldHVybiB0aGlzLmZvckV4cHJzUmVnRXhwO1xufTtcblxuQ29uZmlnLnByb3RvdHlwZS5nZXRGb3JJdGVtVmFsdWVOYW1lUmVnRXhwID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5mb3JJdGVtVmFsdWVOYW1lUmVnRXhwKSB7XG4gICAgICAgIHRoaXMuZm9ySXRlbVZhbHVlTmFtZVJlZ0V4cCA9IG5ldyBSZWdFeHAoXG4gICAgICAgICAgICAnYXNcXFxccyonICsgcmVnRXhwRW5jb2RlKHRoaXMuZXhwclByZWZpeClcbiAgICAgICAgICAgICsgJyhbXicgKyByZWdFeHBFbmNvZGUodGhpcy5leHByU3VmZml4KSArICddKyknXG4gICAgICAgICAgICArIHJlZ0V4cEVuY29kZSh0aGlzLmV4cHJTdWZmaXgpXG4gICAgICAgICk7XG4gICAgfVxuICAgIHRoaXMuZm9ySXRlbVZhbHVlTmFtZVJlZ0V4cC5sYXN0SW5kZXggPSAwO1xuICAgIHJldHVybiB0aGlzLmZvckl0ZW1WYWx1ZU5hbWVSZWdFeHA7XG59O1xuXG5Db25maWcucHJvdG90eXBlLnNldEV2ZW50UHJlZml4ID0gZnVuY3Rpb24gKHByZWZpeCkge1xuICAgIHRoaXMuZXZlbnRQcmVmaXggPSBwcmVmaXg7XG59O1xuXG5Db25maWcucHJvdG90eXBlLnNldFZhck5hbWUgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRoaXMudmFyTmFtZSA9IG5hbWU7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbmZpZztcblxuZnVuY3Rpb24gcmVnRXhwRW5jb2RlKHN0cikge1xuICAgIHJldHVybiAnXFxcXCcgKyBzdHIuc3BsaXQoJycpLmpvaW4oJ1xcXFwnKTtcbn1cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdnRwbC9zcmMvQ29uZmlnLmpzXG4gKiogbW9kdWxlIGlkID0gMzFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDIgM1xuICoqLyIsIi8qKlxuICogQGZpbGUg6ISP5qOA5rWL5ZmoXG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20pXG4gKi9cblxuZnVuY3Rpb24gRGlydHlDaGVja2VyKCkge1xuICAgIHRoaXMuY2hlY2tlcnMgPSB7fTtcbn1cblxuRGlydHlDaGVja2VyLnByb3RvdHlwZS5zZXRDaGVja2VyID0gZnVuY3Rpb24gKGV4cHIsIGNoZWNrZXJGbikge1xuICAgIHRoaXMuY2hlY2tlcnNbZXhwcl0gPSBjaGVja2VyRm47XG59O1xuXG5EaXJ0eUNoZWNrZXIucHJvdG90eXBlLmdldENoZWNrZXIgPSBmdW5jdGlvbiAoZXhwcikge1xuICAgIHJldHVybiB0aGlzLmNoZWNrZXJzW2V4cHJdO1xufTtcblxuRGlydHlDaGVja2VyLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuY2hlY2tlcnMgPSBudWxsO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEaXJ0eUNoZWNrZXI7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Z0cGwvc3JjL0RpcnR5Q2hlY2tlci5qc1xuICoqIG1vZHVsZSBpZCA9IDMyXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyIDNcbiAqKi8iLCIvKipcbiAqIEBmaWxlIOWPmOmHj+WumuS5ieaMh+S7pOino+aekOWZqFxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbnZhciBEaXJlY3RpdmVQYXJzZXIgPSByZXF1aXJlKCcuL0RpcmVjdGl2ZVBhcnNlcicpO1xudmFyIFRyZWUgPSByZXF1aXJlKCcuLi90cmVlcy9UcmVlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGlyZWN0aXZlUGFyc2VyLmV4dGVuZHMoXG4gICAge1xuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgRGlyZWN0aXZlUGFyc2VyLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgICAgIHRoaXMubm9kZSA9IG9wdGlvbnMubm9kZTtcbiAgICAgICAgfSxcblxuICAgICAgICBjb2xsZWN0RXhwcnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBleHByID0gdGhpcy5ub2RlLm5vZGVWYWx1ZS5yZXBsYWNlKHRoaXMuY29uZmlnLnZhck5hbWUgKyAnOicsICcnKTtcbiAgICAgICAgICAgIHRoaXMuZXhwckNhbGN1bGF0ZXIuY3JlYXRlRXhwckZuKGV4cHIpO1xuXG4gICAgICAgICAgICB2YXIgbGVmdFZhbHVlTmFtZSA9IGV4cHIubWF0Y2goL1xccyouKyg/PVxcPSkvKVswXS5yZXBsYWNlKC9cXHMrL2csICcnKTtcblxuICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMuZXhwckZuID0gZnVuY3Rpb24gKHNjb3BlTW9kZWwpIHtcbiAgICAgICAgICAgICAgICB2YXIgb2xkVmFsdWUgPSBzY29wZU1vZGVsLmdldChsZWZ0VmFsdWVOYW1lKTtcbiAgICAgICAgICAgICAgICB2YXIgbmV3VmFsdWUgPSBtZS5leHByQ2FsY3VsYXRlci5jYWxjdWxhdGUoZXhwciwgZmFsc2UsIHNjb3BlTW9kZWwpO1xuICAgICAgICAgICAgICAgIGlmIChvbGRWYWx1ZSAhPT0gbmV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGVNb2RlbC5zZXQobGVmdFZhbHVlTmFtZSwgbmV3VmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0U2NvcGU6IGZ1bmN0aW9uIChzY29wZU1vZGVsKSB7XG4gICAgICAgICAgICBEaXJlY3RpdmVQYXJzZXIucHJvdG90eXBlLnNldFNjb3BlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB0aGlzLmV4cHJGbih0aGlzLnNjb3BlTW9kZWwpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5blvIDlp4voioLngrlcbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKiBAaW5oZXJpdERvY1xuICAgICAgICAgKiBAcmV0dXJuIHtOb2RlfVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0U3RhcnROb2RlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ub2RlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5bnu5PmnZ/oioLngrlcbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKiBAaW5oZXJpdERvY1xuICAgICAgICAgKiBAcmV0dXJuIHtOb2RlfVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0RW5kTm9kZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubm9kZTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgICBpc1Byb3Blck5vZGU6IGZ1bmN0aW9uIChub2RlLCBjb25maWcpIHtcbiAgICAgICAgICAgIHJldHVybiBub2RlLm5vZGVUeXBlID09PSA4XG4gICAgICAgICAgICAgICAgJiYgbm9kZS5ub2RlVmFsdWUucmVwbGFjZSgvXlxccysvLCAnJykuaW5kZXhPZihjb25maWcudmFyTmFtZSArICc6JykgPT09IDA7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJG5hbWU6ICdWYXJEaXJlY3RpdmVQYXJzZXInXG4gICAgfVxuKTtcblxuVHJlZS5yZWdpc3RlUGFyc2VyKG1vZHVsZS5leHBvcnRzKTtcblxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL3NyYy9wYXJzZXJzL1ZhckRpcmVjdGl2ZVBhcnNlci5qc1xuICoqIG1vZHVsZSBpZCA9IDMzXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyIDNcbiAqKi8iLCIvKipcbiAqIEBmaWxlIOe7hOS7tuWfuuexu1xuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbnZhciBCYXNlID0gcmVxdWlyZSgndnRwbC9zcmMvQmFzZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhc2UuZXh0ZW5kcyhcbiAgICB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOe7hOS7tuWIneWni+WMllxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICAqL1xuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7fSxcblxuICAgICAgICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gKCkge30sXG5cbiAgICAgICAgY29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbiAoKSB7fSxcblxuICAgICAgICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24gKCkge30sXG5cbiAgICAgICAgcmVmOiBmdW5jdGlvbiAocmVmKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZXIucmVmKHJlZik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOe7hOS7tuaooeadv+OAguWtkOexu+WPr+S7peimhueblui/meS4quWxnuaAp+OAglxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICB0cGw6ICcnLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDplIDmr4FcbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKi9cbiAgICAgICAgZGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5iZWZvcmVEZXN0cm95KCk7XG5cbiAgICAgICAgICAgIHRoaXMuYWZ0ZXJEZXN0cm95KCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0RGF0YTogZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLnBhcnNlci5zZXRBdHRyKG5hbWUsIHZhbHVlKTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXREYXRhOiBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VyLmdldEF0dHIobmFtZSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICog6I635Y+W5qC35byP5a2X56ym5Liy44CCXG4gICAgICAgICAqXG4gICAgICAgICAqIEBzdGF0aWNcbiAgICAgICAgICogQHJldHVybiB7c3RyaW5nfSDmoLflvI/lrZfnrKbkuLJcbiAgICAgICAgICovXG4gICAgICAgIGdldFN0eWxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJG5hbWU6ICdDb21wb25lbnQnXG4gICAgfVxuKTtcblxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92Y29tcG9uZW50L3NyYy9Db21wb25lbnQuanNcbiAqKiBtb2R1bGUgaWQgPSAzNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzXG4gKiovIiwiLypcclxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxyXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcclxuKi9cclxuLy8gY3NzIGJhc2UgY29kZSwgaW5qZWN0ZWQgYnkgdGhlIGNzcy1sb2FkZXJcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgbGlzdCA9IFtdO1xyXG5cclxuXHQvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXHJcblx0bGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xyXG5cdFx0dmFyIHJlc3VsdCA9IFtdO1xyXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGl0ZW0gPSB0aGlzW2ldO1xyXG5cdFx0XHRpZihpdGVtWzJdKSB7XHJcblx0XHRcdFx0cmVzdWx0LnB1c2goXCJAbWVkaWEgXCIgKyBpdGVtWzJdICsgXCJ7XCIgKyBpdGVtWzFdICsgXCJ9XCIpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJlc3VsdC5wdXNoKGl0ZW1bMV0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0LmpvaW4oXCJcIik7XHJcblx0fTtcclxuXHJcblx0Ly8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcclxuXHRsaXN0LmkgPSBmdW5jdGlvbihtb2R1bGVzLCBtZWRpYVF1ZXJ5KSB7XHJcblx0XHRpZih0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIilcclxuXHRcdFx0bW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgXCJcIl1dO1xyXG5cdFx0dmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcclxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBpZCA9IHRoaXNbaV1bMF07XHJcblx0XHRcdGlmKHR5cGVvZiBpZCA9PT0gXCJudW1iZXJcIilcclxuXHRcdFx0XHRhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XHJcblx0XHR9XHJcblx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBpdGVtID0gbW9kdWxlc1tpXTtcclxuXHRcdFx0Ly8gc2tpcCBhbHJlYWR5IGltcG9ydGVkIG1vZHVsZVxyXG5cdFx0XHQvLyB0aGlzIGltcGxlbWVudGF0aW9uIGlzIG5vdCAxMDAlIHBlcmZlY3QgZm9yIHdlaXJkIG1lZGlhIHF1ZXJ5IGNvbWJpbmF0aW9uc1xyXG5cdFx0XHQvLyAgd2hlbiBhIG1vZHVsZSBpcyBpbXBvcnRlZCBtdWx0aXBsZSB0aW1lcyB3aXRoIGRpZmZlcmVudCBtZWRpYSBxdWVyaWVzLlxyXG5cdFx0XHQvLyAgSSBob3BlIHRoaXMgd2lsbCBuZXZlciBvY2N1ciAoSGV5IHRoaXMgd2F5IHdlIGhhdmUgc21hbGxlciBidW5kbGVzKVxyXG5cdFx0XHRpZih0eXBlb2YgaXRlbVswXSAhPT0gXCJudW1iZXJcIiB8fCAhYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xyXG5cdFx0XHRcdGlmKG1lZGlhUXVlcnkgJiYgIWl0ZW1bMl0pIHtcclxuXHRcdFx0XHRcdGl0ZW1bMl0gPSBtZWRpYVF1ZXJ5O1xyXG5cdFx0XHRcdH0gZWxzZSBpZihtZWRpYVF1ZXJ5KSB7XHJcblx0XHRcdFx0XHRpdGVtWzJdID0gXCIoXCIgKyBpdGVtWzJdICsgXCIpIGFuZCAoXCIgKyBtZWRpYVF1ZXJ5ICsgXCIpXCI7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGxpc3QucHVzaChpdGVtKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH07XHJcblx0cmV0dXJuIGxpc3Q7XHJcbn07XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXG4gKiogbW9kdWxlIGlkID0gMzdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDIgM1xuICoqLyIsIi8qKlxuICogQGZpbGUg5paH5pys6L6T5YWl5qGGXG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20pXG4gKi9cblxudmFyIENvbnRyb2wgPSByZXF1aXJlKCcuLi9Db250cm9sJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ29udHJvbC5leHRlbmRzKFxuICAgIHtcbiAgICAgICAgdHBsOiByZXF1aXJlKCcuL1RleHRCb3gudHBsLmh0bWwnKVxuICAgIH0sXG4gICAge1xuICAgICAgICAkbmFtZTogJ1RleHRCb3gnLFxuICAgICAgICBnZXRTdHlsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlcXVpcmUoJy4vVGV4dEJveC5sZXNzJylbMF1bMV07XG4gICAgICAgIH1cbiAgICB9XG4pO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9UZXh0Qm94L1RleHRCb3guanNcbiAqKiBtb2R1bGUgaWQgPSA0NlxuICoqIG1vZHVsZSBjaHVua3MgPSAyXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBcIjwhLS0gaWY6ICR7bW9kZX0gPT09ICdtdWx0aXBsZScgLS0+XFxuICAgIDx0ZXh0YXJlYSBwbGFjZWhvbGRlcj1cXFwiJHtwbGFjZWhvbGRlcn1cXFwiPjwvdGV4dGFyZWE+XFxuPCEtLSBlbHNlIC0tPlxcbiAgICA8aW5wdXQgcGxhY2Vob2xkZXI9XFxcIiR7cGxhY2Vob2xkZXJ9XFxcIiAvPlxcbjwhLS0gL2lmIC0tPlxcblwiO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvVGV4dEJveC9UZXh0Qm94LnRwbC5odG1sXG4gKiogbW9kdWxlIGlkID0gNDdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMlxuICoqLyIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSgpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLnRleHQtYm94IHtcXG4gIGhlaWdodDogMzVweDtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICBwYWRkaW5nOiA3cHg7XFxuICBib3JkZXI6IDFweCBzb2xpZCAjZGRkZGRkO1xcbn1cXG4udGV4dC1ib3g6Zm9jdXMge1xcbiAgb3V0bGluZTogbm9uZTtcXG4gIGJvcmRlci1jb2xvcjogIzcwY2NjMDtcXG59XFxudGV4dGFyZWEudGV4dC1ib3gge1xcbiAgcmVzaXplOiBub25lO1xcbiAgaGVpZ2h0OiA4MHB4O1xcbiAgd2lkdGg6IDIwMHB4O1xcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcXG59XFxuXCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9UZXh0Qm94L1RleHRCb3gubGVzc1xuICoqIG1vZHVsZSBpZCA9IDQ4XG4gKiogbW9kdWxlIGNodW5rcyA9IDJcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IFwiPHVpLXRleHQtYm94IHBsYWNlaG9sZGVyPVxcXCLljZXooYxcXFwiPjwvdWktdGV4dC1ib3g+XFxuPHVpLXRleHQtYm94IG1vZGU9XFxcIm11bHRpcGxlXFxcIiBwbGFjZWhvbGRlcj1cXFwi5aSa6KGMXFxcIj48L3VpLXRleHQtYm94PlwiO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi90ZXN0L1RleHRCb3gudHBsLmh0bWxcbiAqKiBtb2R1bGUgaWQgPSA0OVxuICoqIG1vZHVsZSBjaHVua3MgPSAyXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==