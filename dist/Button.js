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

	var Button = __webpack_require__(2);
	var vcomponent = __webpack_require__(4);
	
	var Main = vcomponent.Component.extends(
	    {
	        tpl: __webpack_require__(38),
	        componentClasses: [Button],
	        componentDidMount: function () {
	            this.setData({
	                click: function () {
	                    alert('click');
	                },
	                skinLink: 'skin-link'
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


/***/ },
/* 38 */
/***/ function(module, exports) {

	module.exports = "<ui-button on-click=\"${click}\">Button</ui-button>\n<ui-button class=\"skin-primary\">Primary</ui-button>\n<ui-button class=\"skin-success\">Success</ui-button>\n<ui-button class=\"skin-info\">Info</ui-button>\n<ui-button class=\"skin-warning\">Warning</ui-button>\n<ui-button class=\"skin-danger\">Danger</ui-button>\n<ui-button class=\"${skinLink}\">Link</ui-button>\n";

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgM2FlYmVhM2U5M2Q0OTUxNTNlYjkiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9CdXR0b24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0J1dHRvbi9CdXR0b24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0NvbnRyb2wuanMiLCJ3ZWJwYWNrOi8vLy4uL3Zjb21wb25lbnQvc3JjL21haW4uanMiLCJ3ZWJwYWNrOi8vLy4uL3Zjb21wb25lbnQvc3JjL0NoaWxkcmVuRGlyZWN0aXZlUGFyc2VyLmpzIiwid2VicGFjazovLy8uLi92dHBsL3NyYy9wYXJzZXJzL0RpcmVjdGl2ZVBhcnNlci5qcyIsIndlYnBhY2s6Ly8vLi4vdnRwbC9zcmMvcGFyc2Vycy9QYXJzZXIuanMiLCJ3ZWJwYWNrOi8vLy4uL3Z0cGwvc3JjL0Jhc2UuanMiLCJ3ZWJwYWNrOi8vLy4uL3Z0cGwvc3JjL2luaGVyaXQuanMiLCJ3ZWJwYWNrOi8vLy4uL3Z0cGwvc3JjL3V0aWxzLmpzIiwid2VicGFjazovLy8uLi92Y29tcG9uZW50L3NyYy9DaGlsZHJlblRyZWUuanMiLCJ3ZWJwYWNrOi8vLy4uL3Z0cGwvc3JjL3RyZWVzL1RyZWUuanMiLCJ3ZWJwYWNrOi8vLy4uL3Z0cGwvc3JjL0V4cHJDYWxjdWxhdGVyLmpzIiwid2VicGFjazovLy8uLi92dHBsL3NyYy9Eb21VcGRhdGVyLmpzIiwid2VicGFjazovLy8uLi92dHBsL3NyYy9sb2cuanMiLCJ3ZWJwYWNrOi8vLy4uL3Z0cGwvc3JjL1Njb3BlTW9kZWwuanMiLCJ3ZWJwYWNrOi8vLy4uL3Z0cGwvc3JjL0V2ZW50LmpzIiwid2VicGFjazovLy8uLi92Y29tcG9uZW50L3NyYy9Gb3JEaXJlY3RpdmVQYXJzZXIuanMiLCJ3ZWJwYWNrOi8vLy4uL3Z0cGwvc3JjL3BhcnNlcnMvRm9yRGlyZWN0aXZlUGFyc2VyLmpzIiwid2VicGFjazovLy8uLi92dHBsL3NyYy90cmVlcy9Gb3JUcmVlLmpzIiwid2VicGFjazovLy8uLi92Y29tcG9uZW50L3NyYy9JZkRpcmVjdGl2ZVBhcnNlci5qcyIsIndlYnBhY2s6Ly8vLi4vdnRwbC9zcmMvcGFyc2Vycy9JZkRpcmVjdGl2ZVBhcnNlci5qcyIsIndlYnBhY2s6Ly8vLi4vdmNvbXBvbmVudC9zcmMvQ29tcG9uZW50UGFyc2VyLmpzIiwid2VicGFjazovLy8uLi92dHBsL3NyYy9wYXJzZXJzL0V2ZW50RXhwclBhcnNlci5qcyIsIndlYnBhY2s6Ly8vLi4vdnRwbC9zcmMvcGFyc2Vycy9FeHByUGFyc2VyLmpzIiwid2VicGFjazovLy8uLi92Y29tcG9uZW50L3NyYy9Db21wb25lbnRUcmVlLmpzIiwid2VicGFjazovLy8uLi92Y29tcG9uZW50L3NyYy9Db21wb25lbnRNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uLi92Y29tcG9uZW50L3NyYy9Db21wb25lbnRDaGlsZHJlbi5qcyIsIndlYnBhY2s6Ly8vLi4vdnRwbC9tYWluLmpzIiwid2VicGFjazovLy8uLi92dHBsL3NyYy9wYXJzZXJzL1Njb3BlRGlyZWN0aXZlUGFyc2VyLmpzIiwid2VicGFjazovLy8uLi92dHBsL3NyYy9Db25maWcuanMiLCJ3ZWJwYWNrOi8vLy4uL3Z0cGwvc3JjL0RpcnR5Q2hlY2tlci5qcyIsIndlYnBhY2s6Ly8vLi4vdnRwbC9zcmMvcGFyc2Vycy9WYXJEaXJlY3RpdmVQYXJzZXIuanMiLCJ3ZWJwYWNrOi8vLy4uL3Zjb21wb25lbnQvc3JjL0NvbXBvbmVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvQnV0dG9uL0J1dHRvbi50cGwuaHRtbCIsIndlYnBhY2s6Ly8vLi9zcmMvQnV0dG9uL0J1dHRvbi5sZXNzIiwid2VicGFjazovLy8uL34vY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanMiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9CdXR0b24udHBsLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFl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OztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQzdQQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBbUIsT0FBTztBQUMxQixvQkFBbUIsRUFBRTtBQUNyQixxQkFBb0IsUUFBUTtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBb0IsT0FBTztBQUMzQixxQkFBb0IsU0FBUztBQUM3QjtBQUNBLHFCQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2IsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiLFVBQVM7O0FBRVQ7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMOzs7Ozs7O0FDcERBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9EQUFtRCxRQUFRO0FBQzNEO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyQ0FBMEMsUUFBUTtBQUNsRDtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYTtBQUNiOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBLGNBQWE7O0FBRWI7QUFDQTtBQUNBLGNBQWE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUFrRCxRQUFRO0FBQzFEO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTs7Ozs7OztBQ3JLQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW1CLGVBQWU7QUFDbEM7QUFDQTtBQUNBLHVEQUFzRCxRQUFRO0FBQzlEO0FBQ0Esb0RBQW1ELFFBQVE7QUFDM0Q7QUFDQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDckNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7O0FBRWI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0EsK0NBQThDLFFBQVE7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNULE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUN2S0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7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QUFDQTs7QUFFQTs7Ozs7OztBQy9XQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBbUIsS0FBSztBQUN4QjtBQUNBLHFCQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiOztBQUVBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7O0FDbkdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBb0IsT0FBTztBQUMzQixxQkFBb0IsS0FBSztBQUN6QjtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBc0I7QUFDdEI7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBb0IsUUFBUTtBQUM1QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx3REFBdUQsUUFBUTtBQUMvRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUM7Ozs7Ozs7QUNwQkQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxrREFBaUQ7QUFDakQ7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwwQkFBeUI7QUFDekIseUJBQXdCOztBQUV4QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7OztBQ2hJQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQWtDOztBQUVsQywwQ0FBeUM7O0FBRXpDLDJDQUEwQzs7QUFFMUMsNkNBQTRDOztBQUU1QztBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFrQjtBQUNsQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBb0IsT0FBTztBQUMzQjtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTs7Ozs7Ozs7QUNwRUEscUNBQW9DLE1BQU0sbUJBQW1CLGVBQWUsdUM7Ozs7OztBQ0E1RTtBQUNBOzs7QUFHQTtBQUNBLHFEQUFvRCx3QkFBd0IsaUJBQWlCLGtCQUFrQixpQkFBaUIsb0JBQW9CLEdBQUcsaUJBQWlCLGdCQUFnQixHQUFHLGtCQUFrQixlQUFlLEdBQUcsd0JBQXdCLHdCQUF3QixnQkFBZ0IsR0FBRyx3QkFBd0Isd0JBQXdCLGdCQUFnQixHQUFHLHFCQUFxQix3QkFBd0IsZ0JBQWdCLEdBQUcsd0JBQXdCLHdCQUF3QixnQkFBZ0IsR0FBRyx1QkFBdUIsd0JBQXdCLGdCQUFnQixHQUFHLHFCQUFxQixtQkFBbUIscUJBQXFCLEdBQUc7O0FBRTFtQjs7Ozs7OztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQixpQkFBaUI7QUFDakM7QUFDQTtBQUNBLHlDQUF3QyxnQkFBZ0I7QUFDeEQsS0FBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQixpQkFBaUI7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFZLG9CQUFvQjtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNqREEsMkNBQTBDLE1BQU0sdVRBQXVULFNBQVMsdUIiLCJmaWxlIjoiQnV0dG9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCAzYWViZWEzZTkzZDQ5NTE1M2ViOVxuICoqLyIsInZhciBCdXR0b24gPSByZXF1aXJlKCcuLi9zcmMvQnV0dG9uL0J1dHRvbicpO1xudmFyIHZjb21wb25lbnQgPSByZXF1aXJlKCd2Y29tcG9uZW50Jyk7XG5cbnZhciBNYWluID0gdmNvbXBvbmVudC5Db21wb25lbnQuZXh0ZW5kcyhcbiAgICB7XG4gICAgICAgIHRwbDogcmVxdWlyZSgnLi9CdXR0b24udHBsLmh0bWwnKSxcbiAgICAgICAgY29tcG9uZW50Q2xhc3NlczogW0J1dHRvbl0sXG4gICAgICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdjbGljaycpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2tpbkxpbms6ICdza2luLWxpbmsnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgICAkbmFtZTogJ01haW4nXG4gICAgfVxuKTtcblxudmFyIG1haW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbicpO1xudmNvbXBvbmVudC5tb3VudChcbiAgICB7XG4gICAgICAgIGNvbmZpZzogbmV3IHZjb21wb25lbnQuQ29uZmlnKCksXG4gICAgICAgIHN0YXJ0Tm9kZTogbWFpbixcbiAgICAgICAgZW5kTm9kZTogbWFpblxuICAgIH0sXG4gICAgW01haW5dXG4pO1xuXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vdGVzdC9CdXR0b24uanNcbiAqKiBtb2R1bGUgaWQgPSAwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKipcbiAqIEBmaWxlIOaMiemSruaOp+S7tlxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tLCBodHRwczovL2dpdGh1Yi5jb20veWlidXlpc2hlbmcpXG4gKi9cblxudmFyIENvbnRyb2wgPSByZXF1aXJlKCcuLi9Db250cm9sJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ29udHJvbC5leHRlbmRzKFxuICAgIHtcbiAgICAgICAgdHBsOiByZXF1aXJlKCcuL0J1dHRvbi50cGwuaHRtbCcpXG4gICAgfSxcbiAgICB7XG4gICAgICAgICRuYW1lOiAnQnV0dG9uJyxcblxuICAgICAgICBnZXRTdHlsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlcXVpcmUoJy4vQnV0dG9uLmxlc3MnKVswXVsxXTtcbiAgICAgICAgfVxuICAgIH1cbik7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL0J1dHRvbi9CdXR0b24uanNcbiAqKiBtb2R1bGUgaWQgPSAyXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyXG4gKiovIiwidmFyIHZjb21wb25lbnQgPSByZXF1aXJlKCd2Y29tcG9uZW50Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gdmNvbXBvbmVudC5Db21wb25lbnQuZXh0ZW5kcyh7fSwgeyRuYW1lOiAnQ29udHJvbCd9KTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvQ29udHJvbC5qc1xuICoqIG1vZHVsZSBpZCA9IDNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDJcbiAqKi8iLCJyZXF1aXJlKCcuL0NoaWxkcmVuRGlyZWN0aXZlUGFyc2VyJyk7XG5yZXF1aXJlKCcuL0ZvckRpcmVjdGl2ZVBhcnNlcicpO1xucmVxdWlyZSgnLi9JZkRpcmVjdGl2ZVBhcnNlcicpO1xucmVxdWlyZSgnLi9Db21wb25lbnRQYXJzZXInKTtcblxudmFyIENvbXBvbmVudFRyZWUgPSByZXF1aXJlKCcuL0NvbXBvbmVudFRyZWUnKTtcbnZhciBkb21EYXRhQmluZCA9IHJlcXVpcmUoJ3Z0cGwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgQ29tcG9uZW50OiByZXF1aXJlKCcuL0NvbXBvbmVudCcpLFxuICAgIG1vdW50OiBmdW5jdGlvbiAob3B0aW9ucywgQ29tcG9uZW50Q2xhc3Nlcykge1xuICAgICAgICB2YXIgdHJlZSA9IG5ldyBDb21wb25lbnRUcmVlKG9wdGlvbnMpO1xuICAgICAgICB0cmVlLnJlZ2lzdGVDb21wb25lbnRzKENvbXBvbmVudENsYXNzZXMpO1xuICAgICAgICB0cmVlLnRyYXZlcnNlKCk7XG4gICAgICAgIHJldHVybiB0cmVlO1xuICAgIH0sXG4gICAgQ29uZmlnOiBkb21EYXRhQmluZC5Db25maWdcbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Zjb21wb25lbnQvc3JjL21haW4uanNcbiAqKiBtb2R1bGUgaWQgPSA0XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyXG4gKiovIiwiLyoqXG4gKiBAZmlsZSBjaGlsZHJlbiDmjIfku6QgPCEtLSBjaGlsZHJlbiAtLT4g77yM5Y+q5pyJ57uE5Lu25Lit5omN5Lya5a2Y5Zyo6K+l5oyH5LukXG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20pXG4gKi9cblxudmFyIERpcmVjdGl2ZVBhcnNlciA9IHJlcXVpcmUoJ3Z0cGwvc3JjL3BhcnNlcnMvRGlyZWN0aXZlUGFyc2VyJyk7XG52YXIgQ2hpbGRyZW5UcmVlID0gcmVxdWlyZSgnLi9DaGlsZHJlblRyZWUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBEaXJlY3RpdmVQYXJzZXIuZXh0ZW5kcyhcbiAgICB7XG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgICBEaXJlY3RpdmVQYXJzZXIucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgICAgICAgICAgdGhpcy5ub2RlID0gb3B0aW9ucy5ub2RlO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNvbGxlY3RFeHByczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGNvbXBvbmVudENoaWxkcmVuID0gdGhpcy50cmVlLmdldFRyZWVWYXIoJ2NvbXBvbmVudENoaWxkcmVuJywgdHJ1ZSk7XG4gICAgICAgICAgICBpZiAoIWNvbXBvbmVudENoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBkaXYuaW5uZXJIVE1MID0gY29tcG9uZW50Q2hpbGRyZW4uZ2V0VHBsSHRtbCgpO1xuXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuVHJlZSA9IG5ldyBDaGlsZHJlblRyZWUoe1xuICAgICAgICAgICAgICAgIHN0YXJ0Tm9kZTogZGl2LmZpcnN0Q2hpbGQsXG4gICAgICAgICAgICAgICAgZW5kTm9kZTogZGl2Lmxhc3RDaGlsZCxcbiAgICAgICAgICAgICAgICBjb25maWc6IHRoaXMudHJlZS5jb25maWcsXG4gICAgICAgICAgICAgICAgZG9tVXBkYXRlcjogdGhpcy50cmVlLmRvbVVwZGF0ZXIsXG4gICAgICAgICAgICAgICAgZXhwckNhbGN1bGF0ZXI6IHRoaXMudHJlZS5leHByQ2FsY3VsYXRlclxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuVHJlZS5zZXRQYXJlbnQodGhpcy50cmVlKTtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5UcmVlLnRyYXZlcnNlKCk7XG5cbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5UcmVlLnJvb3RTY29wZS5zZXRQYXJlbnQoY29tcG9uZW50Q2hpbGRyZW4uc2NvcGUpO1xuICAgICAgICAgICAgY29tcG9uZW50Q2hpbGRyZW4uc2NvcGUuYWRkQ2hpbGQodGhpcy5jaGlsZHJlblRyZWUucm9vdFNjb3BlKTtcblxuICAgICAgICAgICAgd2hpbGUgKGRpdi5jaGlsZE5vZGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMubm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShkaXYuY2hpbGROb2Rlc1swXSwgdGhpcy5ub2RlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiOt+WPluW8gOWni+iKgueCuVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICAqIEBpbmhlcml0RG9jXG4gICAgICAgICAqIEByZXR1cm4ge05vZGV9XG4gICAgICAgICAqL1xuICAgICAgICBnZXRTdGFydE5vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5jaGlsZHJlblRyZWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5ub2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5UcmVlLnN0YXJ0Tm9kZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6I635Y+W57uT5p2f6IqC54K5XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICogQGluaGVyaXREb2NcbiAgICAgICAgICogQHJldHVybiB7Tm9kZX1cbiAgICAgICAgICovXG4gICAgICAgIGdldEVuZE5vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5vZGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlblRyZWUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICB0aGlzLm5vZGUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlblRyZWUgPSBudWxsO1xuXG4gICAgICAgICAgICBEaXJlY3RpdmVQYXJzZXIucHJvdG90eXBlLmRlc3Ryb3kuYXBwbHkodGhpcyk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgaXNQcm9wZXJOb2RlOiBmdW5jdGlvbiAobm9kZSwgY29uZmlnKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5ub2RlVHlwZSA9PT0gOFxuICAgICAgICAgICAgICAgICYmIG5vZGUubm9kZVZhbHVlLnJlcGxhY2UoL1xccy9nLCAnJykgPT09ICdjaGlsZHJlbic7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJG5hbWU6ICdDaGlsZHJlbkRpcmVjdGl2ZVBhcnNlcidcbiAgICB9XG4pO1xuXG5DaGlsZHJlblRyZWUucmVnaXN0ZVBhcnNlcihtb2R1bGUuZXhwb3J0cyk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Zjb21wb25lbnQvc3JjL0NoaWxkcmVuRGlyZWN0aXZlUGFyc2VyLmpzXG4gKiogbW9kdWxlIGlkID0gNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMlxuICoqLyIsIi8qKlxuICogQGZpbGUg5oyH5Luk6Kej5p6Q5Zmo5oq96LGh57G744CC5oyH5Luk6IqC54K55LiA5a6a5piv5rOo6YeK6IqC54K5XG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20pXG4gKi9cblxudmFyIFBhcnNlciA9IHJlcXVpcmUoJy4vUGFyc2VyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUGFyc2VyLmV4dGVuZHMoXG4gICAge30sXG4gICAge1xuICAgICAgICBpc1Byb3Blck5vZGU6IGZ1bmN0aW9uIChub2RlLCBjb25maWcpIHtcbiAgICAgICAgICAgIHJldHVybiBub2RlLm5vZGVUeXBlID09PSA4O1xuICAgICAgICB9LFxuICAgICAgICAkbmFtZTogJ0RpcmVjdGl2ZVBhcnNlcidcbiAgICB9XG4pO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL3NyYy9wYXJzZXJzL0RpcmVjdGl2ZVBhcnNlci5qc1xuICoqIG1vZHVsZSBpZCA9IDZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDJcbiAqKi8iLCIvKipcbiAqIEBmaWxlIOino+aekOWZqOeahOaKveixoeWfuuexu1xuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbi8qKlxuICog5p6E6YCg5Ye95pWwXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyDphY3nva7lj4LmlbDvvIzkuIDoiKzlj6/og73kvJrmnInlpoLkuIvlhoXlrrnvvJpcbiAqICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydE5vZGU6IC4uLixcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmROb2RlOiAuLi4sXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZTogLi4uLFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzogLi4uXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICDlhbfkvZPmmK/llaXlj6/ku6Xlj4LliqDlhbfkvZPnmoTlrZDnsbtcbiAqL1xuXG52YXIgQmFzZSA9IHJlcXVpcmUoJy4uL0Jhc2UnKTtcbm1vZHVsZS5leHBvcnRzID0gQmFzZS5leHRlbmRzKFxuICAgIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICog5Yid5aeL5YyWXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMg5p2l6Ieq5LqO5p6E6YCg5Ye95pWwXG4gICAgICAgICAqL1xuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgdGhpcy5leHByQ2FsY3VsYXRlciA9IG9wdGlvbnMuZXhwckNhbGN1bGF0ZXI7XG4gICAgICAgICAgICB0aGlzLmNvbmZpZyA9IG9wdGlvbnMuY29uZmlnO1xuICAgICAgICAgICAgdGhpcy5kb21VcGRhdGVyID0gb3B0aW9ucy5kb21VcGRhdGVyO1xuICAgICAgICAgICAgdGhpcy50cmVlID0gb3B0aW9ucy50cmVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDnu5HlrppzY29wZSBtb2RlbFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqIEBwYXJhbSB7U2NvcGVNb2RlbH0gc2NvcGVNb2RlbCBzY29wZSBtb2RlbFxuICAgICAgICAgKi9cbiAgICAgICAgc2V0U2NvcGU6IGZ1bmN0aW9uIChzY29wZU1vZGVsKSB7XG4gICAgICAgICAgICB0aGlzLnNjb3BlTW9kZWwgPSBzY29wZU1vZGVsO1xuXG4gICAgICAgICAgICB0aGlzLnNjb3BlTW9kZWwub24oJ2NoYW5nZScsIHRoaXMub25DaGFuZ2UsIHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5zY29wZU1vZGVsLm9uKCdwYXJlbnRjaGFuZ2UnLCB0aGlzLm9uQ2hhbmdlLCB0aGlzKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogbW9kZWwg5Y+R55Sf5Y+Y5YyW55qE5Zue6LCD5Ye95pWwXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICovXG4gICAgICAgIG9uQ2hhbmdlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmRvbVVwZGF0ZXIuZXhlY3V0ZSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5ZzY29wZSBtb2RlbFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqIEByZXR1cm4ge1Njb3BlTW9kZWx9IHNjb3BlIG1vZGVs5a+56LGhXG4gICAgICAgICAqL1xuICAgICAgICBnZXRTY29wZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2NvcGVNb2RlbDtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog5ZCRc2NvcGUgbW9kZWzph4zpnaLorr7nva7mlbDmja5cbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSDopoHorr7nva7nmoTmlbDmja5cbiAgICAgICAgICovXG4gICAgICAgIHNldERhdGE6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICB0aGlzLnNjb3BlTW9kZWwuc2V0KGRhdGEpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDpmpDol4/lvZPliY1wYXJzZXLlrp7kvovnm7jlhbPnmoToioLngrnjgILlhbfkvZPlrZDnsbvlrp7njrBcbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAYWJzdHJhY3RcbiAgICAgICAgICovXG4gICAgICAgIGdvRGFyazogZnVuY3Rpb24gKCkge30sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOaYvuekuuebuOWFs+WFg+e0oFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqIEBhYnN0cmFjdFxuICAgICAgICAgKi9cbiAgICAgICAgcmVzdG9yZUZyb21EYXJrOiBmdW5jdGlvbiAoKSB7fSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6I635Y+W6Kej5p6Q5Zmo5b2T5YmN54q25oCB5LiL55qE5byA5aeLRE9N6IqC54K544CCXG4gICAgICAgICAqXG4gICAgICAgICAqIOeUseS6juacieeahOino+aekOWZqOS8muWwhuS5i+WJjeeahOiKgueCueenu+mZpOaOie+8jOmCo+S5iOWwseS8muWvuemBjeWOhuW4puadpeW9seWTjeS6hu+8jFxuICAgICAgICAgKiDmiYDku6XmraTlpITmj5DkvpvkuKTkuKrojrflj5blvIDlp4voioLngrnlkoznu5PmnZ/oioLngrnnmoTmlrnms5XjgIJcbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAcmV0dXJuIHtOb2RlfSBET03oioLngrnlr7nosaFcbiAgICAgICAgICovXG4gICAgICAgIGdldFN0YXJ0Tm9kZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RhcnROb2RlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5bop6PmnpDlmajlvZPliY3nirbmgIHkuIvnmoTnu5PmnZ9ET03oioLngrlcbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAcmV0dXJuIHtOb2RlfSDoioLngrnlr7nosaFcbiAgICAgICAgICovXG4gICAgICAgIGdldEVuZE5vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVuZE5vZGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOaQnOmbhuihqOi+vuW8j++8jOeUn+aIkOihqOi+vuW8j+WHveaVsOWSjCBET00g5pu05paw5Ye95pWw44CC5YW35L2T5a2Q57G75a6e546wXG4gICAgICAgICAqXG4gICAgICAgICAqIEBhYnN0cmFjdFxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqL1xuICAgICAgICBjb2xsZWN0RXhwcnM6IGZ1bmN0aW9uICgpIHt9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDohI/mo4DmtYvjgILpu5jorqTkvJrkvb/nlKjlhajnrYnliKTmlq3jgIJcbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IGV4cHIgICAgICAgICDopoHmo4Dmn6XnmoTooajovr7lvI9cbiAgICAgICAgICogQHBhcmFtICB7Kn0gZXhwclZhbHVlICAgIOihqOi+vuW8j+W9k+WJjeiuoeeul+WHuuadpeeahOWAvFxuICAgICAgICAgKiBAcGFyYW0gIHsqfSBleHByT2xkVmFsdWUg6KGo6L6+5byP5LiK5LiA5qyh6K6h566X5Ye65p2l55qE5YC8XG4gICAgICAgICAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgICDkuKTmrKHnmoTlgLzmmK/lkKbnm7jlkIxcbiAgICAgICAgICovXG4gICAgICAgIGRpcnR5Q2hlY2s6IGZ1bmN0aW9uIChleHByLCBleHByVmFsdWUsIGV4cHJPbGRWYWx1ZSkge1xuICAgICAgICAgICAgdmFyIGRpcnR5Q2hlY2tlckZuID0gdGhpcy5kaXJ0eUNoZWNrZXIgPyB0aGlzLmRpcnR5Q2hlY2tlci5nZXRDaGVja2VyKGV4cHIpIDogbnVsbDtcbiAgICAgICAgICAgIHJldHVybiAoZGlydHlDaGVja2VyRm4gJiYgZGlydHlDaGVja2VyRm4oZXhwciwgZXhwclZhbHVlLCBleHByT2xkVmFsdWUpKVxuICAgICAgICAgICAgICAgICAgICB8fCAoIWRpcnR5Q2hlY2tlckZuICYmIGV4cHJWYWx1ZSAhPT0gZXhwck9sZFZhbHVlKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6K6+572u6ISP5qOA5rWL5ZmoXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwdWJsaWNcbiAgICAgICAgICogQHBhcmFtIHtEaXJ0eUNoZWNrZXJ9IGRpcnR5Q2hlY2tlciDohI/mo4DmtYvlmahcbiAgICAgICAgICovXG4gICAgICAgIHNldERpcnR5Q2hlY2tlcjogZnVuY3Rpb24gKGRpcnR5Q2hlY2tlcikge1xuICAgICAgICAgICAgdGhpcy5kaXJ0eUNoZWNrZXIgPSBkaXJ0eUNoZWNrZXI7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOmUgOavgeino+aekOWZqO+8jOWwhueVjOmdouaBouWkjeaIkOWOn+agt1xuICAgICAgICAgKlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqL1xuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmV4cHJDYWxjdWxhdGVyID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuZG9tVXBkYXRlciA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLnRyZWUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5kaXJ0eUNoZWNrZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICAgICRuYW1lOiAnUGFyc2VyJ1xuICAgIH1cbik7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Z0cGwvc3JjL3BhcnNlcnMvUGFyc2VyLmpzXG4gKiogbW9kdWxlIGlkID0gN1xuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMlxuICoqLyIsIi8qKlxuICogQGZpbGUg5omA5pyJ57G755qE5Z+657G7XG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20pXG4gKi9cblxudmFyIGluaGVyaXQgPSByZXF1aXJlKCcuL2luaGVyaXQnKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxuZnVuY3Rpb24gQmFzZSgpIHtcbiAgICB0aGlzLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn1cblxuQmFzZS5wcm90b3R5cGUuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgpIHt9O1xuXG4vKipcbiAqIOe7p+aJv1xuICpcbiAqIEBzdGF0aWNcbiAqIEBwYXJhbSAge09iamVjdH0gcHJvcHMgICAgICAg5pmu6YCa5bGe5oCnXG4gKiBAcGFyYW0gIHtPYmplY3R9IHN0YXRpY1Byb3BzIOmdmeaAgeWxnuaAp1xuICogQHJldHVybiB7Q2xhc3N9ICAgICAgICAgICAgIOWtkOexu1xuICovXG5CYXNlLmV4dGVuZHMgPSBmdW5jdGlvbiAocHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gICAgLy8g5q+P5Liq57G76YO95b+F6aG75pyJ5LiA5Liq5ZCN5a2XXG4gICAgaWYgKCFzdGF0aWNQcm9wcyB8fCAhc3RhdGljUHJvcHMuJG5hbWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKCdlYWNoIGNsYXNzIG11c3QgaGF2ZSBhIGAkbmFtZWAuJyk7XG4gICAgfVxuXG4gICAgdmFyIGJhc2VDbHMgPSB0aGlzO1xuXG4gICAgdmFyIGNscyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgYmFzZUNscy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gICAgdXRpbHMuZXh0ZW5kKGNscy5wcm90b3R5cGUsIHByb3BzKTtcbiAgICB1dGlscy5leHRlbmQoY2xzLCBzdGF0aWNQcm9wcyk7XG5cbiAgICAvLyDorrDlvZXkuIDkuIvniLbnsbtcbiAgICBjbHMuJHN1cGVyQ2xhc3MgPSBiYXNlQ2xzO1xuXG4gICAgcmV0dXJuIGluaGVyaXQoY2xzLCBiYXNlQ2xzKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdnRwbC9zcmMvQmFzZS5qc1xuICoqIG1vZHVsZSBpZCA9IDhcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDJcbiAqKi8iLCIvKipcbiAqIEBmaWxlIOe7p+aJv1xuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbmZ1bmN0aW9uIGluaGVyaXQoQ2hpbGRDbGFzcywgUGFyZW50Q2xhc3MpIHtcbiAgICBmdW5jdGlvbiBDbHMoKSB7fVxuXG4gICAgQ2xzLnByb3RvdHlwZSA9IFBhcmVudENsYXNzLnByb3RvdHlwZTtcbiAgICB2YXIgY2hpbGRQcm90byA9IENoaWxkQ2xhc3MucHJvdG90eXBlO1xuICAgIENoaWxkQ2xhc3MucHJvdG90eXBlID0gbmV3IENscygpO1xuICAgIENoaWxkQ2xhc3MucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQ2hpbGRDbGFzcztcblxuICAgIHZhciBrZXk7XG4gICAgZm9yIChrZXkgaW4gY2hpbGRQcm90bykge1xuICAgICAgICBDaGlsZENsYXNzLnByb3RvdHlwZVtrZXldID0gY2hpbGRQcm90b1trZXldO1xuICAgIH1cblxuICAgIC8vIOe7p+aJv+mdmeaAgeWxnuaAp1xuICAgIGZvciAoa2V5IGluIFBhcmVudENsYXNzKSB7XG4gICAgICAgIGlmIChQYXJlbnRDbGFzcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICBpZiAoQ2hpbGRDbGFzc1trZXldID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBDaGlsZENsYXNzW2tleV0gPSBQYXJlbnRDbGFzc1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIENoaWxkQ2xhc3M7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5oZXJpdDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdnRwbC9zcmMvaW5oZXJpdC5qc1xuICoqIG1vZHVsZSBpZCA9IDlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDJcbiAqKi8iLCIvKipcbiAqIEBmaWxlIOS4gOWghumhueebrumHjOmdouW4uOeUqOeahOaWueazlVxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbmV4cG9ydHMuc2xpY2UgPSBmdW5jdGlvbiAoYXJyLCBzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyciwgc3RhcnQsIGVuZCk7XG59O1xuXG5leHBvcnRzLmdvRGFyayA9IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgbm9kZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH1cbiAgICBlbHNlIGlmIChub2RlLm5vZGVUeXBlID09PSAzKSB7XG4gICAgICAgIG5vZGUuX190ZXh0X18gPSBub2RlLm5vZGVWYWx1ZTtcbiAgICAgICAgbm9kZS5ub2RlVmFsdWUgPSAnJztcbiAgICB9XG59O1xuXG5leHBvcnRzLnJlc3RvcmVGcm9tRGFyayA9IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgbm9kZS5zdHlsZS5kaXNwbGF5ID0gbnVsbDtcbiAgICB9XG4gICAgZWxzZSBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMykge1xuICAgICAgICBpZiAobm9kZS5fX3RleHRfXyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBub2RlLm5vZGVWYWx1ZSA9IG5vZGUuX190ZXh0X187XG4gICAgICAgICAgICBub2RlLl9fdGV4dF9fID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuZXhwb3J0cy5jcmVhdGVFeHByRm4gPSBmdW5jdGlvbiAoZXhwclJlZ0V4cCwgZXhwciwgZXhwckNhbGN1bGF0ZXIpIHtcbiAgICBleHByID0gZXhwci5yZXBsYWNlKGV4cHJSZWdFeHAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3VtZW50c1sxXTtcbiAgICB9KTtcbiAgICBleHByQ2FsY3VsYXRlci5jcmVhdGVFeHByRm4oZXhwcik7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKHNjb3BlTW9kZWwpIHtcbiAgICAgICAgcmV0dXJuIGV4cHJDYWxjdWxhdGVyLmNhbGN1bGF0ZShleHByLCBmYWxzZSwgc2NvcGVNb2RlbCk7XG4gICAgfTtcbn07XG5cbi8qKlxuICog6LaF57qn566A5Y2V55qEIGV4dGVuZCDvvIzlm6DkuLrmnKzlupPlr7kgZXh0ZW5kIOayoemCo+mrmOeahOimgeaxgu+8jFxuICog562J5Yiw5pyJ6KaB5rGC55qE5pe25YCZ5YaN5a6M5ZaE44CCXG4gKlxuICogQGlubmVyXG4gKiBAcGFyYW0gIHtPYmplY3R9IHRhcmdldCDnm67moIflr7nosaFcbiAqIEByZXR1cm4ge09iamVjdH0gICAgICAgIOacgOe7iOWQiOW5tuWQjueahOWvueixoVxuICovXG5leHBvcnRzLmV4dGVuZCA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICB2YXIgc3JjcyA9IGV4cG9ydHMuc2xpY2UoYXJndW1lbnRzLCAxKTtcbiAgICBmb3IgKHZhciBpID0gMCwgaWwgPSBzcmNzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgICAgLyogZXNsaW50LWRpc2FibGUgZ3VhcmQtZm9yLWluICovXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBzcmNzW2ldKSB7XG4gICAgICAgICAgICB0YXJnZXRba2V5XSA9IHNyY3NbaV1ba2V5XTtcbiAgICAgICAgfVxuICAgICAgICAvKiBlc2xpbnQtZW5hYmxlIGd1YXJkLWZvci1pbiAqL1xuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0O1xufTtcblxuZXhwb3J0cy50cmF2ZXJzZU5vQ2hhbmdlTm9kZXMgPSBmdW5jdGlvbiAoc3RhcnROb2RlLCBlbmROb2RlLCBub2RlRm4sIGNvbnRleHQpIHtcbiAgICBmb3IgKHZhciBjdXJOb2RlID0gc3RhcnROb2RlO1xuICAgICAgICBjdXJOb2RlICYmIGN1ck5vZGUgIT09IGVuZE5vZGU7XG4gICAgICAgIGN1ck5vZGUgPSBjdXJOb2RlLm5leHRTaWJsaW5nXG4gICAgKSB7XG4gICAgICAgIGlmIChub2RlRm4uY2FsbChjb250ZXh0LCBjdXJOb2RlKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbm9kZUZuLmNhbGwoY29udGV4dCwgZW5kTm9kZSk7XG59O1xuXG5leHBvcnRzLnRyYXZlcnNlTm9kZXMgPSBmdW5jdGlvbiAoc3RhcnROb2RlLCBlbmROb2RlLCBub2RlRm4sIGNvbnRleHQpIHtcbiAgICB2YXIgbm9kZXMgPSBbXTtcbiAgICBmb3IgKHZhciBjdXJOb2RlID0gc3RhcnROb2RlO1xuICAgICAgICBjdXJOb2RlICYmIGN1ck5vZGUgIT09IGVuZE5vZGU7XG4gICAgICAgIGN1ck5vZGUgPSBjdXJOb2RlLm5leHRTaWJsaW5nXG4gICAgKSB7XG4gICAgICAgIG5vZGVzLnB1c2goY3VyTm9kZSk7XG4gICAgfVxuXG4gICAgbm9kZXMucHVzaChlbmROb2RlKTtcblxuICAgIGV4cG9ydHMuZWFjaChub2Rlcywgbm9kZUZuLCBjb250ZXh0KTtcbn07XG5cbmV4cG9ydHMuZWFjaCA9IGZ1bmN0aW9uIChhcnIsIGZuLCBjb250ZXh0KSB7XG4gICAgaWYgKGV4cG9ydHMuaXNBcnJheShhcnIpKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IGFyci5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZm4uY2FsbChjb250ZXh0LCBhcnJbaV0sIGksIGFycikpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgYXJyID09PSAnb2JqZWN0Jykge1xuICAgICAgICBmb3IgKHZhciBrIGluIGFycikge1xuICAgICAgICAgICAgaWYgKGZuLmNhbGwoY29udGV4dCwgYXJyW2tdLCBrLCBhcnIpKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5mdW5jdGlvbiBpc0NsYXNzKG9iaiwgY2xzTmFtZSkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgJyArIGNsc05hbWUgKyAnXSc7XG59XG5cbmV4cG9ydHMuaXNBcnJheSA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgICByZXR1cm4gaXNDbGFzcyhhcnIsICdBcnJheScpO1xufTtcblxuZXhwb3J0cy5pc051bWJlciA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICByZXR1cm4gaXNDbGFzcyhvYmosICdOdW1iZXInKTtcbn07XG5cbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICByZXR1cm4gaXNDbGFzcyhvYmosICdGdW5jdGlvbicpO1xufTtcblxuLyoqXG4gKiDmmK/lkKbmmK/kuIDkuKrnuq/lr7nosaHvvIzmu6HotrPlpoLkuIvmnaHku7bvvJpcbiAqXG4gKiAx44CB6Zmk5LqG5YaF572u5bGe5oCn5LmL5aSW77yM5rKh5pyJ5YW25LuW57un5om/5bGe5oCn77ybXG4gKiAy44CBY29uc3RydWN0b3Ig5pivIE9iamVjdFxuICpcbiAqIEBwYXJhbSB7QW55fSBvYmog5b6F5Yik5pat55qE5Y+Y6YePXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5leHBvcnRzLmlzUHVyZU9iamVjdCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICBpZiAoIWlzQ2xhc3Mob2JqLCAnT2JqZWN0JykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGZvciAodmFyIGsgaW4gb2JqKSB7XG4gICAgICAgIGlmICghb2JqLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn07XG5cbmV4cG9ydHMuaXNDbGFzcyA9IGlzQ2xhc3M7XG5cbmV4cG9ydHMuYmluZCA9IGZ1bmN0aW9uIChmbiwgdGhpc0FyZykge1xuICAgIGlmICghZXhwb3J0cy5pc0Z1bmN0aW9uKGZuKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGJpbmQgPSBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCB8fCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICB2YXIgb2JqID0gYXJncy5sZW5ndGggPiAwID8gYXJnc1swXSA6IHVuZGVmaW5lZDtcbiAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB0b3RhbEFyZ3MgPSBBcnJheS5wcm90b3R5cGUuY29uY2F0LmFwcGx5KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3MsIDEpLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgcmV0dXJuIG1lLmFwcGx5KG9iaiwgdG90YWxBcmdzKTtcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIHJldHVybiBiaW5kLmFwcGx5KGZuLCBbdGhpc0FyZ10uY29uY2F0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMikpKTtcbn07XG5cbmV4cG9ydHMuaXNTdWJDbGFzc09mID0gZnVuY3Rpb24gKFN1YkNsYXNzLCBTdXBlckNsYXNzKSB7XG4gICAgcmV0dXJuIFN1YkNsYXNzLnByb3RvdHlwZSBpbnN0YW5jZW9mIFN1cGVyQ2xhc3M7XG59O1xuXG4vKipcbiAqIOWvueS8oOWFpeeahOWtl+espuS4sui/m+ihjOWIm+W7uuato+WImeihqOi+vuW8j+S5i+WJjeeahOi9rOS5ie+8jOmYsuatouWtl+espuS4suS4reeahOS4gOS6m+Wtl+espuaIkOS4uuWFs+mUruWtl+OAglxuICpcbiAqIEBwYXJhbSAge3N0cmluZ30gc3RyIOW+hei9rOS5ieeahOWtl+espuS4slxuICogQHJldHVybiB7c3RyaW5nfSAgICAg6L2s5LmJ5LmL5ZCO55qE5a2X56ym5LiyXG4gKi9cbmV4cG9ydHMucmVnRXhwRW5jb2RlID0gZnVuY3Rpb24gcmVnRXhwRW5jb2RlKHN0cikge1xuICAgIHJldHVybiAnXFxcXCcgKyBzdHIuc3BsaXQoJycpLmpvaW4oJ1xcXFwnKTtcbn07XG5cbmV4cG9ydHMueGhyID0gZnVuY3Rpb24gKG9wdGlvbnMsIGxvYWRGbiwgZXJyb3JGbikge1xuICAgIG9wdGlvbnMgPSBleHBvcnRzLmV4dGVuZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCdcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICB4aHIub25lcnJvciA9IGVycm9yRm47XG4gICAgeGhyLm9ubG9hZCA9IGxvYWRGbjtcbiAgICB4aHIub3BlbihvcHRpb25zLm1ldGhvZCwgb3B0aW9ucy51cmwsIHRydWUpO1xuICAgIHNldEhlYWRlcnMob3B0aW9ucy5oZWFkZXJzLCB4aHIpO1xuICAgIHhoci5zZW5kKG9wdGlvbnMuYm9keSk7XG59O1xuXG4vKipcbiAqIOWwhuWtl+espuS4suS4reeahOmpvOWzsOWRveWQjeaWueW8j+aUueS4uuefreaoque6v+eahOW9ouW8j1xuICpcbiAqIEBwdWJsaWNcbiAqIEBwYXJhbSAge3N0cmluZ30gc3RyIOimgei9rOaNoueahOWtl+espuS4slxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnRzLmNhbWVsMmxpbmUgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bQS1aXS9nLCBmdW5jdGlvbiAobWF0Y2hlZCwgaW5kZXgpIHtcbiAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gbWF0Y2hlZC50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAnLScgKyBtYXRjaGVkLnRvTG93ZXJDYXNlKCk7XG4gICAgfSk7XG59O1xuXG4vKipcbiAqIOWwhuWtl+espuS4suS4reeahOefreaoque6v+WRveWQjeaWueW8j+aUueS4uumpvOWzsOeahOW9ouW8j1xuICpcbiAqIEBwdWJsaWNcbiAqIEBwYXJhbSAge3N0cmluZ30gc3RyIOimgei9rOaNoueahOWtl+espuS4slxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnRzLmxpbmUyY2FtZWwgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC8tW2Etel0vZywgZnVuY3Rpb24gKG1hdGNoZWQpIHtcbiAgICAgICAgcmV0dXJuIG1hdGNoZWRbMV0udG9VcHBlckNhc2UoKTtcbiAgICB9KTtcbn07XG5cbmV4cG9ydHMuZGlzdGluY3RBcnIgPSBmdW5jdGlvbiAoYXJyLCBoYXNoRm4pIHtcbiAgICBoYXNoRm4gPSBleHBvcnRzLmlzRnVuY3Rpb24oaGFzaEZuKSA/IGhhc2hGbiA6IGZ1bmN0aW9uIChlbGVtKSB7XG4gICAgICAgIHJldHVybiBTdHJpbmcoZWxlbSk7XG4gICAgfTtcbiAgICB2YXIgb2JqID0ge307XG4gICAgZm9yICh2YXIgaSA9IDAsIGlsID0gYXJyLmxlbmd0aDsgaSA8IGlsOyArK2kpIHtcbiAgICAgICAgb2JqW2hhc2hGbihhcnJbaV0pXSA9IGFycltpXTtcbiAgICB9XG5cbiAgICB2YXIgcmV0ID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgICBpZiAoIW9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldC5wdXNoKG9ialtrZXldKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xufTtcblxuXG5mdW5jdGlvbiBzZXRIZWFkZXJzKGhlYWRlcnMsIHhocikge1xuICAgIGlmICghaGVhZGVycykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yICh2YXIgayBpbiBoZWFkZXJzKSB7XG4gICAgICAgIGlmICghaGVhZGVycy5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoaywgaGVhZGVyc1trXSk7XG4gICAgfVxufVxuXG5cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdnRwbC9zcmMvdXRpbHMuanNcbiAqKiBtb2R1bGUgaWQgPSAxMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMlxuICoqLyIsIi8qKlxuICogQGZpbGUg5a2Q5qCRXG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20pXG4gKi9cblxudmFyIFRyZWUgPSByZXF1aXJlKCd2dHBsL3NyYy90cmVlcy9UcmVlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVHJlZS5leHRlbmRzKFxuICAgIHtcbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIGlmICghb3B0aW9ucy5jb25maWdcbiAgICAgICAgICAgICAgICB8fCAhb3B0aW9ucy5kb21VcGRhdGVyXG4gICAgICAgICAgICAgICAgfHwgIW9wdGlvbnMuZXhwckNhbGN1bGF0ZXJcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignd3JvbmcgYXJndW1lbnRzJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG9wdGlvbnMuY29tcG9uZW50Q2hpbGRyZW4gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBkZWxldGUgb3B0aW9ucy5jb21wb25lbnRDaGlsZHJlbjtcblxuICAgICAgICAgICAgVHJlZS5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICAgICRuYW1lOiAnQ2hpbGRyZW5UcmVlJ1xuICAgIH1cbik7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Zjb21wb25lbnQvc3JjL0NoaWxkcmVuVHJlZS5qc1xuICoqIG1vZHVsZSBpZCA9IDExXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyXG4gKiovIiwiLyoqXG4gKiBAZmlsZSDmnIDnu4jnmoTmoJFcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xudmFyIEV4cHJDYWxjdWxhdGVyID0gcmVxdWlyZSgnLi4vRXhwckNhbGN1bGF0ZXInKTtcbnZhciBEb21VcGRhdGVyID0gcmVxdWlyZSgnLi4vRG9tVXBkYXRlcicpO1xudmFyIFNjb3BlTW9kZWwgPSByZXF1aXJlKCcuLi9TY29wZU1vZGVsJyk7XG52YXIgQmFzZSA9IHJlcXVpcmUoJy4uL0Jhc2UnKTtcblxudmFyIFBhcnNlckNsYXNzZXMgPSBbXTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYXNlLmV4dGVuZHMoXG4gICAge1xuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgQmFzZS5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgICAgICAgICB0aGlzLnN0YXJ0Tm9kZSA9IG9wdGlvbnMuc3RhcnROb2RlO1xuICAgICAgICAgICAgdGhpcy5lbmROb2RlID0gb3B0aW9ucy5lbmROb2RlO1xuICAgICAgICAgICAgdGhpcy5jb25maWcgPSBvcHRpb25zLmNvbmZpZztcblxuICAgICAgICAgICAgdGhpcy5leHByQ2FsY3VsYXRlciA9IG9wdGlvbnMuZXhwckNhbGN1bGF0ZXIgfHwgbmV3IEV4cHJDYWxjdWxhdGVyKCk7XG4gICAgICAgICAgICB0aGlzLmRvbVVwZGF0ZXIgPSBvcHRpb25zLmRvbVVwZGF0ZXIgfHwgbmV3IERvbVVwZGF0ZXIoKTtcbiAgICAgICAgICAgIHRoaXMuZGlydHlDaGVja2VyID0gb3B0aW9ucy5kaXJ0eUNoZWNrZXI7XG5cbiAgICAgICAgICAgIHRoaXMudHJlZSA9IFtdO1xuICAgICAgICAgICAgdGhpcy50cmVlVmFycyA9IHt9O1xuXG4gICAgICAgICAgICB0aGlzLnJvb3RTY29wZSA9IG5ldyBTY29wZU1vZGVsKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiuvue9rue7keWumuWcqOagkeS4iumdoueahOmineWkluWPmOmHj+OAgui/meS6m+WPmOmHj+acieWmguS4i+eJueaAp++8mlxuICAgICAgICAgKiAx44CB5peg5rOV6KaG55uW77ybXG4gICAgICAgICAqIDLjgIHlnKjojrflj5Z0cmVlVmFyc+S4iumdouafkOS4quWPmOmHj+eahOaXtuWAme+8jOWmguaenOW9k+WJjeagkeWPluWHuuadpeaYr3VuZGVmaW5lZO+8jOmCo+S5iOWwseS8muWIsOeItue6p+agkeeahHRyZWVWYXJz5LiK5Y675om+77yM5Lul5q2k57G75o6o44CCXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwdWJsaWNcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgIOWPmOmHj+WQjVxuICAgICAgICAgKiBAcGFyYW0geyp9IHZhbHVlIOWPmOmHj+WAvFxuICAgICAgICAgKiBAcmV0dXJuIHtib29sZWFufSDmmK/lkKborr7nva7miJDlip9cbiAgICAgICAgICovXG4gICAgICAgIHNldFRyZWVWYXI6IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMudHJlZVZhcnNbbmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMudHJlZVZhcnNbbmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIHVuc2V0VHJlZVZhcjogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgIHRoaXMudHJlZVZhcnNbbmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiOt+WPlue7keWumuWIsOagkeS4iueahOmineWkluWPmOmHj1xuICAgICAgICAgKlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqIEBwYXJhbSAge3N0cmluZ30gbmFtZSAgICAgICAgICAgICAgICAgIOWPmOmHj+WQjVxuICAgICAgICAgKiBAcGFyYW0gIHtib29sZWFuPX0gc2hvdWxkTm90RmluZEluUGFyZW50IOWmguaenOWcqOW9k+WJjeagkeS4reayoeaJvuWIsO+8jOaYr+WQpuWIsOeItue6p+agkeS4reWOu+aJvuOAglxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ1ZeWwseS7o+ihqOS4jeWOu++8jGZhbHNl5bCx5Luj6KGo6KaB5Y67XG4gICAgICAgICAqIEByZXR1cm4geyp9XG4gICAgICAgICAqL1xuICAgICAgICBnZXRUcmVlVmFyOiBmdW5jdGlvbiAobmFtZSwgc2hvdWxkTm90RmluZEluUGFyZW50KSB7XG4gICAgICAgICAgICB2YXIgdmFsID0gdGhpcy50cmVlVmFyc1tuYW1lXTtcbiAgICAgICAgICAgIGlmICghc2hvdWxkTm90RmluZEluUGFyZW50XG4gICAgICAgICAgICAgICAgJiYgdmFsID09PSB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAmJiB0aGlzLiRwYXJlbnQgIT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgdmFsID0gdGhpcy4kcGFyZW50LmdldFRyZWVWYXIobmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldFBhcmVudDogZnVuY3Rpb24gKHBhcmVudCkge1xuICAgICAgICAgICAgdGhpcy4kcGFyZW50ID0gcGFyZW50O1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldFNjb3BlQnlOYW1lOiBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgdmFyIHNjb3BlcyA9IHRoaXMuZ2V0VHJlZVZhcignc2NvcGVzJyk7XG4gICAgICAgICAgICBpZiAoIXNjb3Blcykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzY29wZXNbbmFtZV07XG4gICAgICAgIH0sXG5cbiAgICAgICAgdHJhdmVyc2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHdhbGtEb20odGhpcywgdGhpcy5zdGFydE5vZGUsIHRoaXMuZW5kTm9kZSwgdGhpcy50cmVlLCB0aGlzLnJvb3RTY29wZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0RGF0YTogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIGRhdGEgPSBkYXRhIHx8IHt9O1xuICAgICAgICAgICAgdGhpcy5yb290U2NvcGUuc2V0KGRhdGEpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdvRGFyazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdXRpbHMudHJhdmVyc2VOb0NoYW5nZU5vZGVzKHRoaXMuc3RhcnROb2RlLCB0aGlzLmVuZE5vZGUsIGZ1bmN0aW9uIChjdXJOb2RlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGN1ck5vZGUubm9kZVR5cGUgPT09IDEgfHwgY3VyTm9kZS5ub2RlVHlwZSA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICB1dGlscy5nb0RhcmsoY3VyTm9kZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVzdG9yZUZyb21EYXJrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB1dGlscy50cmF2ZXJzZU5vQ2hhbmdlTm9kZXModGhpcy5zdGFydE5vZGUsIHRoaXMuZW5kTm9kZSwgZnVuY3Rpb24gKGN1ck5vZGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoY3VyTm9kZS5ub2RlVHlwZSA9PT0gMSB8fCBjdXJOb2RlLm5vZGVUeXBlID09PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgIHV0aWxzLnJlc3RvcmVGcm9tRGFyayhjdXJOb2RlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXREaXJ0eUNoZWNrZXI6IGZ1bmN0aW9uIChkaXJ0eUNoZWNrZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZGlydHlDaGVja2VyID0gZGlydHlDaGVja2VyO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHdhbGsodGhpcy50cmVlKTtcblxuICAgICAgICAgICAgdGhpcy5zdGFydE5vZGUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5lbmROb2RlID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnID0gbnVsbDtcblxuICAgICAgICAgICAgdGhpcy5leHByQ2FsY3VsYXRlci5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLmV4cHJDYWxjdWxhdGVyID0gbnVsbDtcblxuICAgICAgICAgICAgdGhpcy5kb21VcGRhdGVyLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRoaXMuZG9tVXBkYXRlciA9IG51bGw7XG5cbiAgICAgICAgICAgIHRoaXMudHJlZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLnRyZWVWYXJzID0gbnVsbDtcblxuICAgICAgICAgICAgaWYgKHRoaXMuZGlydHlDaGVja2VyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kaXJ0eUNoZWNrZXIuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuZGlydHlDaGVja2VyID0gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gd2FsayhwYXJzZXJPYmpzKSB7XG4gICAgICAgICAgICAgICAgdXRpbHMuZWFjaChwYXJzZXJPYmpzLCBmdW5jdGlvbiAoY3VyUGFyc2VyT2JqKSB7XG4gICAgICAgICAgICAgICAgICAgIGN1clBhcnNlck9iai5wYXJzZXIuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJQYXJzZXJPYmouY2hpbGRyZW4gJiYgY3VyUGFyc2VyT2JqLmNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2FsayhjdXJQYXJzZXJPYmouY2hpbGRyZW4pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWIm+W7uuino+aekOWZqOWunuS+i++8jOWFtui/lOWbnuWAvOeahOe7k+aehOS4uu+8mlxuICAgICAgICAgKiB7XG4gICAgICAgICAqICAgICBwYXJzZXI6IC4uLixcbiAgICAgICAgICogICAgIGNvbGxlY3RSZXN1bHQ6IC4uLlxuICAgICAgICAgKiB9XG4gICAgICAgICAqXG4gICAgICAgICAqIOi/lOWbnuWAvOWtmOWcqOWmguS4i+WHoOenjeaDheWGte+8mlxuICAgICAgICAgKlxuICAgICAgICAgKiAx44CB5aaC5p6cIHBhcnNlciDlsZ7mgKflrZjlnKjkuJQgY29sbGVjdFJlc3VsdCDkuLogdHJ1ZSDvvIzliJnor7TmmI7lvZPliY3op6PmnpDlmajop6PmnpDkuobmiYDmnInnm7jlupTnmoToioLngrnvvIjljIXmi6zotbfmraLoioLngrnpl7TnmoToioLngrnjgIHlvZPliY3oioLngrnlkozlrZDlrZnoioLngrnvvInvvJtcbiAgICAgICAgICogMuOAgeebtOaOpei/lOWbnuWBh+WAvOaIluiAhSBwYXJzZXIg5LiN5a2Y5Zyo77yM6K+05piO5rKh5pyJ5aSE55CG5Lu75L2V6IqC54K577yM5b2T5YmN6IqC54K55LiN5bGe5LqO5b2T5YmN6Kej5p6Q5Zmo5aSE55CG77ybXG4gICAgICAgICAqIDPjgIFwYXJzZXIg5a2Y5Zyo5LiUIGNvbGxlY3RSZXN1bHQg5Li65pWw57uE77yM57uT5p6E5aaC5LiL77yaXG4gICAgICAgICAqICAgICBbXG4gICAgICAgICAqICAgICAgICAge1xuICAgICAgICAgKiAgICAgICAgICAgICBzdGFydE5vZGU6IE5vZGUuPC4uLj4sXG4gICAgICAgICAqICAgICAgICAgICAgIGVuZE5vZGU6IE5vZGUuPC4uLj5cbiAgICAgICAgICogICAgICAgICB9XG4gICAgICAgICAqICAgICBdXG4gICAgICAgICAqXG4gICAgICAgICAqICDliJnor7TmmI7lvZPliY3mmK/luKbmnInlvojlpJrliIbmlK/nmoToioLngrnvvIzopoHkvp3mrKHop6PmnpDmlbDnu4TkuK3mr4/kuKrlhYPntKDmjIflrprnmoToioLngrnojIPlm7TjgIJcbiAgICAgICAgICogIOiAjOS4lO+8jOivpeino+aekOWZqOWvueW6lOeahCBzZXREYXRhKCkg5pa55rOV5bCG5Lya6L+U5Zue5pW05pWw77yM5oyH5piO5L2/55So5ZOq5LiA5Liq5YiG5pSv55qE6IqC54K544CCXG4gICAgICAgICAqXG4gICAgICAgICAqIEBpbm5lclxuICAgICAgICAgKiBAcGFyYW0ge0NvbnN0cnVjdG9yfSBQYXJzZXJDbGFzcyBwYXJzZXIg57G7XG4gICAgICAgICAqIEBwYXJhbSAge09iamVjdH0gb3B0aW9ucyDliJ3lp4vljJblj4LmlbBcbiAgICAgICAgICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgIOi/lOWbnuWAvFxuICAgICAgICAgKi9cbiAgICAgICAgY3JlYXRlUGFyc2VyOiBmdW5jdGlvbiAoUGFyc2VyQ2xhc3MsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHZhciBzdGFydE5vZGUgPSBvcHRpb25zLnN0YXJ0Tm9kZSB8fCBvcHRpb25zLm5vZGU7XG4gICAgICAgICAgICBpZiAoIVBhcnNlckNsYXNzLmlzUHJvcGVyTm9kZShzdGFydE5vZGUsIG9wdGlvbnMuY29uZmlnKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGVuZE5vZGU7XG4gICAgICAgICAgICBpZiAoUGFyc2VyQ2xhc3MuZmluZEVuZE5vZGUpIHtcbiAgICAgICAgICAgICAgICBlbmROb2RlID0gUGFyc2VyQ2xhc3MuZmluZEVuZE5vZGUoc3RhcnROb2RlLCBvcHRpb25zLmNvbmZpZyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWVuZE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgUGFyc2VyQ2xhc3MuZ2V0Tm9FbmROb2RlRXJyb3IoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoZW5kTm9kZS5wYXJlbnROb2RlICE9PSBzdGFydE5vZGUucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3RoZSByZWxhdGlvbnNoaXAgYmV0d2VlbiBzdGFydCBub2RlIGFuZCBlbmQgbm9kZSBpcyBub3QgYnJvdGhlcmhvb2QhJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgcGFyc2VyID0gbmV3IFBhcnNlckNsYXNzKHV0aWxzLmV4dGVuZChvcHRpb25zLCB7XG4gICAgICAgICAgICAgICAgZW5kTm9kZTogZW5kTm9kZVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHBhcnNlcjogcGFyc2VyLFxuICAgICAgICAgICAgICAgIGVuZE5vZGU6IGVuZE5vZGUgfHwgb3B0aW9ucy5ub2RlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDms6jlhozkuIDkuIvop6PmnpDlmajnsbvjgIJcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtICB7Q29uc3RydWN0b3J9IFBhcnNlckNsYXNzIOino+aekOWZqOexu1xuICAgICAgICAgKi9cbiAgICAgICAgcmVnaXN0ZVBhcnNlcjogZnVuY3Rpb24gKFBhcnNlckNsYXNzKSB7XG4gICAgICAgICAgICB2YXIgaXNFeGl0c0NoaWxkQ2xhc3MgPSBmYWxzZTtcbiAgICAgICAgICAgIHV0aWxzLmVhY2goUGFyc2VyQ2xhc3NlcywgZnVuY3Rpb24gKFBDLCBpbmRleCkge1xuICAgICAgICAgICAgICAgIGlmICh1dGlscy5pc1N1YkNsYXNzT2YoUEMsIFBhcnNlckNsYXNzKSkge1xuICAgICAgICAgICAgICAgICAgICBpc0V4aXRzQ2hpbGRDbGFzcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHV0aWxzLmlzU3ViQ2xhc3NPZihQYXJzZXJDbGFzcywgUEMpKSB7XG4gICAgICAgICAgICAgICAgICAgIFBhcnNlckNsYXNzZXNbaW5kZXhdID0gUGFyc2VyQ2xhc3M7XG4gICAgICAgICAgICAgICAgICAgIGlzRXhpdHNDaGlsZENsYXNzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gaXNFeGl0c0NoaWxkQ2xhc3M7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKCFpc0V4aXRzQ2hpbGRDbGFzcykge1xuICAgICAgICAgICAgICAgIFBhcnNlckNsYXNzZXMucHVzaChQYXJzZXJDbGFzcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgJG5hbWU6ICdUcmVlJ1xuICAgIH1cbik7XG5cblxuZnVuY3Rpb24gd2Fsa0RvbSh0cmVlLCBzdGFydE5vZGUsIGVuZE5vZGUsIGNvbnRhaW5lciwgc2NvcGVNb2RlbCkge1xuICAgIGlmIChzdGFydE5vZGUgPT09IGVuZE5vZGUpIHtcbiAgICAgICAgYWRkKHN0YXJ0Tm9kZSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBjdXJOb2RlID0gc3RhcnROb2RlOyBjdXJOb2RlOykge1xuICAgICAgICBjdXJOb2RlID0gYWRkKGN1ck5vZGUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZChjdXJOb2RlKSB7XG4gICAgICAgIGlmICghY3VyTm9kZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICBzdGFydE5vZGU6IGN1ck5vZGUsXG4gICAgICAgICAgICBub2RlOiBjdXJOb2RlLFxuICAgICAgICAgICAgY29uZmlnOiB0cmVlLmNvbmZpZyxcbiAgICAgICAgICAgIGV4cHJDYWxjdWxhdGVyOiB0cmVlLmV4cHJDYWxjdWxhdGVyLFxuICAgICAgICAgICAgZG9tVXBkYXRlcjogdHJlZS5kb21VcGRhdGVyLFxuICAgICAgICAgICAgdHJlZTogdHJlZVxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBwYXJzZXJPYmo7XG5cbiAgICAgICAgdXRpbHMuZWFjaChQYXJzZXJDbGFzc2VzLCBmdW5jdGlvbiAoUGFyc2VyQ2xhc3MpIHtcbiAgICAgICAgICAgIHBhcnNlck9iaiA9IHRyZWUuY3JlYXRlUGFyc2VyKFBhcnNlckNsYXNzLCBvcHRpb25zKTtcbiAgICAgICAgICAgIGlmICghcGFyc2VyT2JqIHx8ICFwYXJzZXJPYmoucGFyc2VyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGFyc2VyT2JqLmNvbGxlY3RSZXN1bHQgPSBwYXJzZXJPYmoucGFyc2VyLmNvbGxlY3RFeHBycygpO1xuXG4gICAgICAgICAgICBwYXJzZXJPYmoucGFyc2VyLnNldFNjb3BlKHNjb3BlTW9kZWwpO1xuXG4gICAgICAgICAgICBpZiAodXRpbHMuaXNBcnJheShwYXJzZXJPYmouY29sbGVjdFJlc3VsdCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgYnJhbmNoZXMgPSBwYXJzZXJPYmouY29sbGVjdFJlc3VsdDtcbiAgICAgICAgICAgICAgICBjb250YWluZXIucHVzaCh7cGFyc2VyOiBwYXJzZXJPYmoucGFyc2VyLCBjaGlsZHJlbjogYnJhbmNoZXN9KTtcbiAgICAgICAgICAgICAgICB1dGlscy5lYWNoKGJyYW5jaGVzLCBmdW5jdGlvbiAoYnJhbmNoLCBpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghYnJhbmNoLnN0YXJ0Tm9kZSB8fCAhYnJhbmNoLmVuZE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb24gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgd2Fsa0RvbSh0cmVlLCBicmFuY2guc3RhcnROb2RlLCBicmFuY2guZW5kTm9kZSwgY29uLCBwYXJzZXJPYmoucGFyc2VyLmdldFNjb3BlKCkpO1xuICAgICAgICAgICAgICAgICAgICBicmFuY2hlc1tpXSA9IGNvbjtcbiAgICAgICAgICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICAgICAgICAgIGlmIChwYXJzZXJPYmouZW5kTm9kZSAhPT0gZW5kTm9kZSkge1xuICAgICAgICAgICAgICAgICAgICBjdXJOb2RlID0gcGFyc2VyT2JqLnBhcnNlci5nZXRFbmROb2RlKCkubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjdXJOb2RlID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgY29uID0gW107XG4gICAgICAgICAgICAgICAgY29udGFpbmVyLnB1c2goe3BhcnNlcjogcGFyc2VyT2JqLnBhcnNlciwgY2hpbGRyZW46IGNvbn0pO1xuICAgICAgICAgICAgICAgIGlmIChjdXJOb2RlLm5vZGVUeXBlID09PSAxICYmIGN1ck5vZGUuY2hpbGROb2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgd2Fsa0RvbSh0cmVlLCBjdXJOb2RlLmZpcnN0Q2hpbGQsIGN1ck5vZGUubGFzdENoaWxkLCBjb24sIHBhcnNlck9iai5wYXJzZXIuZ2V0U2NvcGUoKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGN1ck5vZGUgIT09IGVuZE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VyTm9kZSA9IHBhcnNlck9iai5wYXJzZXIuZ2V0RW5kTm9kZSgpLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY3VyTm9kZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgaWYgKCFwYXJzZXJPYmopIHtcbiAgICAgICAgICAgIGN1ck5vZGUgPSBjdXJOb2RlLm5leHRTaWJsaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGN1ck5vZGU7XG4gICAgfVxufVxuXG5cblxuXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Z0cGwvc3JjL3RyZWVzL1RyZWUuanNcbiAqKiBtb2R1bGUgaWQgPSAxMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMlxuICoqLyIsInZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxuZnVuY3Rpb24gRXhwckNhbGN1bGF0ZXIoKSB7XG4gICAgdGhpcy5mbnMgPSB7fTtcblxuICAgIHRoaXMuZXhwck5hbWVNYXAgPSB7fTtcbiAgICB0aGlzLmV4cHJOYW1lUmVnRXhwID0gL1xcLj9cXCQ/KFthLXp8QS1aXSt8KFthLXp8QS1aXStbMC05XStbYS16fEEtWl0qKSkvZztcbn1cblxuRXhwckNhbGN1bGF0ZXIucHJvdG90eXBlLmNyZWF0ZUV4cHJGbiA9IGZ1bmN0aW9uIChleHByLCBhdm9pZFJldHVybikge1xuICAgIGlmIChleHByID09PSAna2xhc3MnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignYGtsYXNzYCBpcyB0aGUgcHJlc2VydmVkIHdvcmQgZm9yIGBjbGFzc2AnKTtcbiAgICB9XG4gICAgLy8g5a+5ZXhwcj0nY2xhc3Mn6L+b6KGM5LiL6L2s5o2iXG4gICAgaWYgKGV4cHIgPT09ICdjbGFzcycpIHtcbiAgICAgICAgZXhwciA9ICdrbGFzcyc7XG4gICAgfVxuXG4gICAgYXZvaWRSZXR1cm4gPSAhIWF2b2lkUmV0dXJuO1xuICAgIHRoaXMuZm5zW2V4cHJdID0gdGhpcy5mbnNbZXhwcl0gfHwge307XG4gICAgaWYgKHRoaXMuZm5zW2V4cHJdW2F2b2lkUmV0dXJuXSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHBhcmFtcyA9IGdldFZhcmlhYmxlTmFtZXNGcm9tRXhwcih0aGlzLCBleHByKTtcbiAgICB2YXIgZm4gPSBuZXcgRnVuY3Rpb24ocGFyYW1zLCAoYXZvaWRSZXR1cm4gPyAnJyA6ICdyZXR1cm4gJykgKyBleHByKTtcblxuICAgIHRoaXMuZm5zW2V4cHJdW2F2b2lkUmV0dXJuXSA9IHtcbiAgICAgICAgcGFyYW1OYW1lczogcGFyYW1zLFxuICAgICAgICBmbjogZm5cbiAgICB9O1xufTtcblxuRXhwckNhbGN1bGF0ZXIucHJvdG90eXBlLmNhbGN1bGF0ZSA9IGZ1bmN0aW9uIChleHByLCBhdm9pZFJldHVybiwgc2NvcGVNb2RlbCkge1xuICAgIC8vIOWvuWV4cHI9J2NsYXNzJ+i/m+ihjOS4i+i9rOaNolxuICAgIGlmIChleHByID09PSAnY2xhc3MnKSB7XG4gICAgICAgIGV4cHIgPSAna2xhc3MnO1xuICAgIH1cblxuICAgIHZhciBmbk9iaiA9IHRoaXMuZm5zW2V4cHJdW2F2b2lkUmV0dXJuXTtcbiAgICBpZiAoIWZuT2JqKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbm8gc3VjaCBleHByZXNzaW9uIGZ1bmN0aW9uIGNyZWF0ZWQhJyk7XG4gICAgfVxuXG4gICAgdmFyIGZuQXJncyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IGZuT2JqLnBhcmFtTmFtZXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgICB2YXIgcGFyYW0gPSBmbk9iai5wYXJhbU5hbWVzW2ldO1xuICAgICAgICB2YXIgdmFsdWUgPSBzY29wZU1vZGVsLmdldChwYXJhbSk7XG4gICAgICAgIGZuQXJncy5wdXNoKHZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6IHZhbHVlKTtcbiAgICB9XG5cbiAgICB2YXIgcmVzdWx0O1xuICAgIHRyeSB7XG4gICAgICAgIHJlc3VsdCA9IGZuT2JqLmZuLmFwcGx5KG51bGwsIGZuQXJncyk7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIHJlc3VsdCA9ICcnO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufTtcblxuRXhwckNhbGN1bGF0ZXIucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mbnMgPSBudWxsO1xuICAgIHRoaXMuZXhwck5hbWVNYXAgPSBudWxsO1xuICAgIHRoaXMuZXhwck5hbWVSZWdFeHAgPSBudWxsO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFeHByQ2FsY3VsYXRlcjtcblxuLyoqXG4gKiDku47ooajovr7lvI/kuK3mir3nprvlh7rlj5jph4/lkI1cbiAqXG4gKiBAaW5uZXJcbiAqIEBwYXJhbSB7RXhwckNhbGN1bGF0ZXJ9IG1lIOWvueW6lOWunuS+i1xuICogQHBhcmFtICB7c3RyaW5nfSBleHByIOihqOi+vuW8j+Wtl+espuS4su+8jOexu+S8vOS6jiBgJHtuYW1lfWAg5Lit55qEIG5hbWVcbiAqIEByZXR1cm4ge0FycmF5LjxzdHJpbmc+fSAgICAgIOWPmOmHj+WQjeaVsOe7hFxuICovXG5mdW5jdGlvbiBnZXRWYXJpYWJsZU5hbWVzRnJvbUV4cHIobWUsIGV4cHIpIHtcbiAgICBpZiAobWUuZXhwck5hbWVNYXBbZXhwcl0pIHtcbiAgICAgICAgcmV0dXJuIG1lLmV4cHJOYW1lTWFwW2V4cHJdO1xuICAgIH1cblxuICAgIHZhciByZWcgPSAvW1xcJHxffGEtenxBLVpdezF9KD86W2EtenxBLVp8MC05fFxcJHxfXSopL2c7XG5cbiAgICBmb3IgKHZhciBuYW1lcyA9IHt9LCBuYW1lID0gcmVnLmV4ZWMoZXhwcik7IG5hbWU7IG5hbWUgPSByZWcuZXhlYyhleHByKSkge1xuICAgICAgICB2YXIgcmVzdFN0ciA9IGV4cHIuc2xpY2UobmFtZS5pbmRleCArIG5hbWVbMF0ubGVuZ3RoKTtcblxuICAgICAgICAvLyDmmK/lt6blgLxcbiAgICAgICAgaWYgKC9eXFxzKj0oPyE9KS8udGVzdChyZXN0U3RyKSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDlj5jph4/lkI3liY3pnaLmmK/lkKblrZjlnKggYC5gIO+8jOaIluiAheWPmOmHj+WQjeaYr+WQpuS9jeS6juW8leWPt+WGhemDqFxuICAgICAgICBpZiAobmFtZS5pbmRleFxuICAgICAgICAgICAgJiYgKGV4cHJbbmFtZS5pbmRleCAtIDFdID09PSAnLidcbiAgICAgICAgICAgICAgICB8fCBpc0luUXVvdGUoXG4gICAgICAgICAgICAgICAgICAgICAgICBleHByLnNsaWNlKDAsIG5hbWUuaW5kZXgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdFN0clxuICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIG5hbWVzW25hbWVbMF1dID0gdHJ1ZTtcbiAgICB9XG5cbiAgICB2YXIgcmV0ID0gW107XG4gICAgdXRpbHMuZWFjaChuYW1lcywgZnVuY3Rpb24gKGlzT2ssIG5hbWUpIHtcbiAgICAgICAgaWYgKGlzT2spIHtcbiAgICAgICAgICAgIHJldC5wdXNoKG5hbWUpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgbWUuZXhwck5hbWVNYXBbZXhwcl0gPSByZXQ7XG5cbiAgICByZXR1cm4gcmV0O1xuXG4gICAgZnVuY3Rpb24gaXNJblF1b3RlKHByZVN0ciwgcmVzdFN0cikge1xuICAgICAgICBpZiAoKHByZVN0ci5sYXN0SW5kZXhPZignXFwnJykgKyAxICYmIHJlc3RTdHIuaW5kZXhPZignXFwnJykgKyAxKVxuICAgICAgICAgICAgfHwgKHByZVN0ci5sYXN0SW5kZXhPZignXCInKSArIDEgJiYgcmVzdFN0ci5pbmRleE9mKCdcIicpICsgMSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdnRwbC9zcmMvRXhwckNhbGN1bGF0ZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAxM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMlxuICoqLyIsIi8qKlxuICogQGZpbGUgRE9NIOabtOaWsOWZqFxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbnZhciBsb2cgPSByZXF1aXJlKCcuL2xvZycpO1xuXG52YXIgZXZlbnRMaXN0ID0gKCdibHVyIGZvY3VzIGZvY3VzaW4gZm9jdXNvdXQgbG9hZCByZXNpemUgc2Nyb2xsIHVubG9hZCBjbGljayBkYmxjbGljayAnXG4gICAgKyAnbW91c2Vkb3duIG1vdXNldXAgbW91c2Vtb3ZlIG1vdXNlb3ZlciBtb3VzZW91dCBtb3VzZWVudGVyIG1vdXNlbGVhdmUgJ1xuICAgICsgJ2NoYW5nZSBzZWxlY3Qgc3VibWl0IGtleWRvd24ga2V5cHJlc3Mga2V5dXAgZXJyb3IgY29udGV4dG1lbnUnKS5zcGxpdCgnICcpO1xuXG5mdW5jdGlvbiBEb21VcGRhdGVyKCkge1xuICAgIHRoaXMudGFza3MgPSB7fTtcbiAgICB0aGlzLmlzRXhlY3V0aW5nID0gZmFsc2U7XG4gICAgdGhpcy5kb25lRm5zID0gW107XG59XG5cbnZhciBjb3VudGVyID0gMDtcbkRvbVVwZGF0ZXIucHJvdG90eXBlLmdlbmVyYXRlVGFza0lkID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBjb3VudGVyKys7XG59O1xuXG5Eb21VcGRhdGVyLnByb3RvdHlwZS5hZGRUYXNrRm4gPSBmdW5jdGlvbiAodGFza0lkLCB0YXNrRm4pIHtcbiAgICB0aGlzLnRhc2tzW3Rhc2tJZF0gPSB0YXNrRm47XG59O1xuXG5Eb21VcGRhdGVyLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMudGFza3MgPSBudWxsO1xufTtcblxuRG9tVXBkYXRlci5wcm90b3R5cGUuZXhlY3V0ZSA9IGZ1bmN0aW9uIChkb25lRm4pIHtcbiAgICBpZiAodXRpbHMuaXNGdW5jdGlvbihkb25lRm4pKSB7XG4gICAgICAgIHRoaXMuZG9uZUZucy5wdXNoKGRvbmVGbik7XG4gICAgfVxuXG4gICAgdmFyIG1lID0gdGhpcztcbiAgICBpZiAoIXRoaXMuaXNFeGVjdXRpbmcpIHtcbiAgICAgICAgdGhpcy5pc0V4ZWN1dGluZyA9IHRydWU7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB1dGlscy5lYWNoKG1lLnRhc2tzLCBmdW5jdGlvbiAodGFza0ZuKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgdGFza0ZuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvZy53YXJuKGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbWUudGFza3MgPSB7fTtcblxuICAgICAgICAgICAgc2V0VGltZW91dCh1dGlscy5iaW5kKGZ1bmN0aW9uIChkb25lRm5zKSB7XG4gICAgICAgICAgICAgICAgdXRpbHMuZWFjaChkb25lRm5zLCBmdW5jdGlvbiAoZG9uZUZuKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvbmVGbigpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSwgbnVsbCwgbWUuZG9uZUZucykpO1xuICAgICAgICAgICAgbWUuZG9uZUZucyA9IFtdO1xuXG4gICAgICAgICAgICBtZS5pc0V4ZWN1dGluZyA9IGZhbHNlO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuXG4vKipcbiAqIOe7meaMh+WumkRPTeiKgueCueeahOaMh+WumuWxnuaAp+iuvue9ruWAvFxuICpcbiAqIFRPRE86IOWujOWWhFxuICpcbiAqIEBzdGF0aWNcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSAgRE9N6IqC54K5XG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAg6IqC54K55bGe5oCn5ZCNXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsdWUg6IqC54K55bGe5oCn5YC8XG4gKiBAcmV0dXJuIHsqfVxuICovXG5Eb21VcGRhdGVyLnNldEF0dHIgPSBmdW5jdGlvbiAobm9kZSwgbmFtZSwgdmFsdWUpIHtcbiAgICAvLyDnm67liY3ku4XlpITnkIblhYPntKDoioLngrnvvIzku6XlkI7mmK/lkKblpITnkIblhbbku5bnsbvlnovnmoToioLngrnvvIzku6XlkI7lho3or7RcbiAgICBpZiAobm9kZS5ub2RlVHlwZSAhPT0gMSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG5hbWUgPT09ICdzdHlsZScgJiYgdXRpbHMuaXNQdXJlT2JqZWN0KHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gRG9tVXBkYXRlci5zZXRTdHlsZShub2RlLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgaWYgKG5hbWUgPT09ICdjbGFzcycpIHtcbiAgICAgICAgcmV0dXJuIERvbVVwZGF0ZXIuc2V0Q2xhc3Mobm9kZSwgdmFsdWUpO1xuICAgIH1cblxuICAgIGlmIChEb21VcGRhdGVyLmlzRXZlbnROYW1lKG5hbWUpKSB7XG4gICAgICAgIHJldHVybiBEb21VcGRhdGVyLnNldEV2ZW50KG5vZGUsIG5hbWUsIHZhbHVlKTtcbiAgICB9XG5cbiAgICAvLyDlpJbpg6jngrnlh7vkuovku7ZcbiAgICBpZiAobmFtZSA9PT0gJ29ub3V0Y2xpY2snKSB7XG4gICAgICAgIHJldHVybiBEb21VcGRhdGVyLnNldE91dENsaWNrKG5vZGUsIHZhbHVlKTtcbiAgICB9XG5cbiAgICBub2RlLnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG59O1xuXG5Eb21VcGRhdGVyLnNldE91dENsaWNrID0gZnVuY3Rpb24gKG5vZGUsIGNhbGxiYWNrKSB7XG4gICAgaWYgKCF1dGlscy5pc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBldmVudCA9IGV2ZW50IHx8IHdpbmRvdy5ldmVudDtcblxuICAgICAgICBpZiAobm9kZSAhPT0gZXZlbnQudGFyZ2V0ICYmICFub2RlLmNvbnRhaW5zKGV2ZW50LnRhcmdldCkpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGV2ZW50KTtcbiAgICAgICAgfVxuICAgIH0pO1xufTtcblxuRG9tVXBkYXRlci5zZXRFdmVudCA9IGZ1bmN0aW9uIChub2RlLCBuYW1lLCB2YWx1ZSkge1xuICAgIGlmICh1dGlscy5pc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgICBub2RlW25hbWVdID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBldmVudCA9IGV2ZW50IHx8IHdpbmRvdy5ldmVudDtcbiAgICAgICAgICAgIHZhbHVlKGV2ZW50KTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIG5vZGVbbmFtZV0gPSBudWxsO1xuICAgIH1cbn07XG5cbkRvbVVwZGF0ZXIuc2V0Q2xhc3MgPSBmdW5jdGlvbiAobm9kZSwga2xhc3MpIHtcbiAgICBpZiAoIWtsYXNzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBub2RlLmNsYXNzTmFtZSA9IERvbVVwZGF0ZXIuZ2V0Q2xhc3NMaXN0KGtsYXNzKS5qb2luKCcgJyk7XG59O1xuXG5Eb21VcGRhdGVyLnNldFN0eWxlID0gZnVuY3Rpb24gKG5vZGUsIHN0eWxlT2JqKSB7XG4gICAgZm9yICh2YXIgayBpbiBzdHlsZU9iaikge1xuICAgICAgICBub2RlLnN0eWxlW2tdID0gc3R5bGVPYmpba107XG4gICAgfVxufTtcblxuLyoqXG4gKiDojrflj5blhYPntKDoioLngrnnmoTlsZ7mgKflgLxcbiAqXG4gKiBAc3RhdGljXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgZG9t6IqC54K5XG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSDlsZ7mgKflkI1cbiAqIEByZXR1cm4geyp9IOWxnuaAp+WAvFxuICovXG5Eb21VcGRhdGVyLmdldEF0dHIgPSBmdW5jdGlvbiAobm9kZSwgbmFtZSkge1xuICAgIGlmIChuYW1lID09PSAnY2xhc3MnKSB7XG4gICAgICAgIHJldHVybiBEb21VcGRhdGVyLmdldENsYXNzTGlzdChub2RlLmNsYXNzTmFtZSk7XG4gICAgfVxuICAgIHJldHVybiBub2RlLmdldEF0dHJpYnV0ZShub2RlKTtcbn07XG5cbkRvbVVwZGF0ZXIuZ2V0Q2xhc3NMaXN0ID0gZnVuY3Rpb24gKGtsYXNzKSB7XG4gICAgdmFyIGtsYXNzZXMgPSBbXTtcbiAgICBpZiAodXRpbHMuaXNDbGFzcyhrbGFzcywgJ1N0cmluZycpKSB7XG4gICAgICAgIGtsYXNzZXMgPSBrbGFzcy5zcGxpdCgnICcpO1xuICAgIH1cbiAgICBlbHNlIGlmICh1dGlscy5pc1B1cmVPYmplY3Qoa2xhc3MpKSB7XG4gICAgICAgIGZvciAodmFyIGsgaW4ga2xhc3MpIHtcbiAgICAgICAgICAgIGlmIChrbGFzc1trXSkge1xuICAgICAgICAgICAgICAgIGtsYXNzZXMucHVzaChrbGFzc1trXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAodXRpbHMuaXNBcnJheShrbGFzcykpIHtcbiAgICAgICAga2xhc3NlcyA9IGtsYXNzO1xuICAgIH1cblxuICAgIHJldHVybiB1dGlscy5kaXN0aW5jdEFycihrbGFzc2VzKTtcbn07XG5cbkRvbVVwZGF0ZXIuaXNFdmVudE5hbWUgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgaWYgKHN0ci5pbmRleE9mKCdvbicpICE9PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc3RyID0gc3RyLnNsaWNlKDIpO1xuICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IGV2ZW50TGlzdC5sZW5ndGg7IGkgPCBpbDsgKytpKSB7XG4gICAgICAgIGlmIChzdHIgPT09IGV2ZW50TGlzdFtpXSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERvbVVwZGF0ZXI7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Z0cGwvc3JjL0RvbVVwZGF0ZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAxNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMlxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHdhcm46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCFjb25zb2xlIHx8ICFjb25zb2xlLndhcm4pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUud2Fybi5hcHBseShjb25zb2xlLCBhcmd1bWVudHMpO1xuICAgIH1cbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL3NyYy9sb2cuanNcbiAqKiBtb2R1bGUgaWQgPSAxNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMlxuICoqLyIsInZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbnZhciBFdmVudCA9IHJlcXVpcmUoJy4vRXZlbnQnKTtcbnZhciBpbmhlcml0ID0gcmVxdWlyZSgnLi9pbmhlcml0Jyk7XG5cbmZ1bmN0aW9uIFNjb3BlTW9kZWwoKSB7XG4gICAgRXZlbnQuY2FsbCh0aGlzKTtcblxuICAgIHRoaXMuc3RvcmUgPSB7fTtcbiAgICB0aGlzLnBhcmVudDtcbiAgICB0aGlzLmNoaWxkcmVuID0gW107XG59XG5cblNjb3BlTW9kZWwucHJvdG90eXBlLnNldFBhcmVudCA9IGZ1bmN0aW9uIChwYXJlbnQpIHtcbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbn07XG5cblNjb3BlTW9kZWwucHJvdG90eXBlLmFkZENoaWxkID0gZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgdGhpcy5jaGlsZHJlbi5wdXNoKGNoaWxkKTtcbn07XG5cblNjb3BlTW9kZWwucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgIGlmICh1dGlscy5pc0NsYXNzKG5hbWUsICdTdHJpbmcnKSkge1xuICAgICAgICB0aGlzLnN0b3JlW25hbWVdID0gdmFsdWU7XG4gICAgICAgIGNoYW5nZSh0aGlzKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodXRpbHMuaXNQdXJlT2JqZWN0KG5hbWUpKSB7XG4gICAgICAgIHV0aWxzLmV4dGVuZCh0aGlzLnN0b3JlLCBuYW1lKTtcbiAgICAgICAgY2hhbmdlKHRoaXMpO1xuICAgIH1cbn07XG5cblNjb3BlTW9kZWwucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxIHx8IG5hbWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdG9yZTtcbiAgICB9XG5cbiAgICBpZiAobmFtZSBpbiB0aGlzLnN0b3JlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0b3JlW25hbWVdO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnBhcmVudCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0KG5hbWUpO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaW5oZXJpdChTY29wZU1vZGVsLCBFdmVudCk7XG5cbmZ1bmN0aW9uIGNoYW5nZShtZSkge1xuICAgIG1lLnRyaWdnZXIoJ2NoYW5nZScsIG1lKTtcbiAgICB1dGlscy5lYWNoKG1lLmNoaWxkcmVuLCBmdW5jdGlvbiAoc2NvcGUpIHtcbiAgICAgICAgc2NvcGUudHJpZ2dlcigncGFyZW50Y2hhbmdlJywgbWUpO1xuICAgIH0pO1xufVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL3NyYy9TY29wZU1vZGVsLmpzXG4gKiogbW9kdWxlIGlkID0gMTZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDJcbiAqKi8iLCJ2YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIEV2ZW50KCkge1xuICAgIHRoaXMuZXZudHMgPSB7fTtcbn1cblxuRXZlbnQucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gKGV2ZW50TmFtZSwgZm4sIGNvbnRleHQpIHtcbiAgICBpZiAoIXV0aWxzLmlzRnVuY3Rpb24oZm4pKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmV2bnRzW2V2ZW50TmFtZV0gPSB0aGlzLmV2bnRzW2V2ZW50TmFtZV0gfHwgW107XG5cbiAgICB0aGlzLmV2bnRzW2V2ZW50TmFtZV0ucHVzaCh7XG4gICAgICAgIGZuOiBmbixcbiAgICAgICAgY29udGV4dDogY29udGV4dFxuICAgIH0pO1xufTtcblxuRXZlbnQucHJvdG90eXBlLnRyaWdnZXIgPSBmdW5jdGlvbiAoZXZlbnROYW1lKSB7XG4gICAgdmFyIGZuT2JqcyA9IHRoaXMuZXZudHNbZXZlbnROYW1lXTtcbiAgICBpZiAoZm5PYmpzICYmIGZuT2Jqcy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSB1dGlscy5zbGljZShhcmd1bWVudHMsIDEpO1xuICAgICAgICB1dGlscy5lYWNoKGZuT2JqcywgZnVuY3Rpb24gKGZuT2JqKSB7XG4gICAgICAgICAgICBmbk9iai5mbi5hcHBseShmbk9iai5jb250ZXh0LCBhcmdzKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxuRXZlbnQucHJvdG90eXBlLm9mZiA9IGZ1bmN0aW9uIChldmVudE5hbWUsIGZuKSB7XG4gICAgaWYgKCFmbikge1xuICAgICAgICB0aGlzLmV2bnRzW2V2ZW50TmFtZV0gPSBudWxsO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGZuT2JqcyA9IHRoaXMuZXZudHNbZXZlbnROYW1lXTtcbiAgICBpZiAoZm5PYmpzICYmIGZuT2Jqcy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIG5ld0ZuT2JqcyA9IFtdO1xuICAgICAgICB1dGlscy5lYWNoKGZuT2JqcywgZnVuY3Rpb24gKGZuT2JqKSB7XG4gICAgICAgICAgICBpZiAoZm4gIT09IGZuT2JqLmZuKSB7XG4gICAgICAgICAgICAgICAgbmV3Rm5PYmpzLnB1c2goZm5PYmopO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5ldm50c1tldmVudE5hbWVdID0gbmV3Rm5PYmpzO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnQ7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Z0cGwvc3JjL0V2ZW50LmpzXG4gKiogbW9kdWxlIGlkID0gMTdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDJcbiAqKi8iLCIvKipcbiAqIEBmaWxlIOWinuW8umZvcuaMh+S7pFxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbnZhciBGb3JEaXJlY3RpdmVQYXJzZXIgPSByZXF1aXJlKCd2dHBsL3NyYy9wYXJzZXJzL0ZvckRpcmVjdGl2ZVBhcnNlcicpO1xudmFyIEZvclRyZWUgPSByZXF1aXJlKCd2dHBsL3NyYy90cmVlcy9Gb3JUcmVlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gRm9yRGlyZWN0aXZlUGFyc2VyLmV4dGVuZHMoXG4gICAge1xuICAgICAgICBzZXRDc3NDbGFzczogZnVuY3Rpb24gKGNsYXNzTGlzdCkge1xuICAgICAgICAgICAgdGhpcy4kJGNsYXNzTGlzdCA9IGNsYXNzTGlzdDtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IHRoaXMudHJlZXMubGVuZ3RoOyBpIDwgaWw7ICsraSkge1xuICAgICAgICAgICAgICAgIHZhciB0cmVlID0gdGhpcy50cmVlc1tpXTtcbiAgICAgICAgICAgICAgICBzZXRDbGFzc2VzKHRyZWUsIGNsYXNzTGlzdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgY3JlYXRlVHJlZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHRyZWUgPSBGb3JEaXJlY3RpdmVQYXJzZXIucHJvdG90eXBlLmNyZWF0ZVRyZWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIHNldENsYXNzZXModHJlZSwgdGhpcy4kJGNsYXNzTGlzdCk7XG4gICAgICAgICAgICByZXR1cm4gdHJlZTtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRBdHRyOiBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmIChuYW1lID09PSAnY2xhc3MnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRDc3NDbGFzcyh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgJG5hbWU6ICdGb3JEaXJlY3RpdmVQYXJzZXInXG4gICAgfVxuKTtcblxuZnVuY3Rpb24gc2V0Q2xhc3Nlcyh0cmVlLCBjbGFzc0xpc3QpIHtcbiAgICBmb3IgKHZhciBqID0gMCwgamwgPSB0cmVlLnRyZWUubGVuZ3RoOyBqIDwgamw7ICsraikge1xuICAgICAgICB0cmVlLnRyZWVbal0ucGFyc2VyLnNldEF0dHIoJ2NsYXNzJywgY2xhc3NMaXN0KTtcbiAgICB9XG59XG5cbkZvclRyZWUucmVnaXN0ZVBhcnNlcihtb2R1bGUuZXhwb3J0cyk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Zjb21wb25lbnQvc3JjL0ZvckRpcmVjdGl2ZVBhcnNlci5qc1xuICoqIG1vZHVsZSBpZCA9IDE4XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyXG4gKiovIiwiLyoqXG4gKiBAZmlsZSBmb3Ig5oyH5LukXG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20pXG4gKi9cblxudmFyIERpcmVjdGl2ZVBhcnNlciA9IHJlcXVpcmUoJy4vRGlyZWN0aXZlUGFyc2VyJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xudmFyIEZvclRyZWUgPSByZXF1aXJlKCcuLi90cmVlcy9Gb3JUcmVlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGlyZWN0aXZlUGFyc2VyLmV4dGVuZHMoXG4gICAge1xuXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgICBEaXJlY3RpdmVQYXJzZXIucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgICAgICAgICAgdGhpcy5zdGFydE5vZGUgPSBvcHRpb25zLnN0YXJ0Tm9kZTtcbiAgICAgICAgICAgIHRoaXMuZW5kTm9kZSA9IG9wdGlvbnMuZW5kTm9kZTtcbiAgICAgICAgfSxcblxuICAgICAgICBjb2xsZWN0RXhwcnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXJ0Tm9kZS5uZXh0U2libGluZyA9PT0gdGhpcy5lbmROb2RlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdHBsU2VnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICB1dGlscy50cmF2ZXJzZU5vZGVzKHRoaXMuc3RhcnROb2RlLCB0aGlzLmVuZE5vZGUsIGZ1bmN0aW9uIChjdXJOb2RlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGN1ck5vZGUgPT09IHRoaXMuc3RhcnROb2RlIHx8IGN1ck5vZGUgPT09IHRoaXMuZW5kTm9kZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdHBsU2VnLmFwcGVuZENoaWxkKGN1ck5vZGUpO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgICAgICB0aGlzLnRwbFNlZyA9IHRwbFNlZztcblxuICAgICAgICAgICAgdGhpcy5leHByID0gdGhpcy5zdGFydE5vZGUubm9kZVZhbHVlLm1hdGNoKHRoaXMuY29uZmlnLmdldEZvckV4cHJzUmVnRXhwKCkpWzFdO1xuICAgICAgICAgICAgdGhpcy5leHByRm4gPSB1dGlscy5jcmVhdGVFeHByRm4odGhpcy5jb25maWcuZ2V0RXhwclJlZ0V4cCgpLCB0aGlzLmV4cHIsIHRoaXMuZXhwckNhbGN1bGF0ZXIpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVGbiA9IGNyZWF0ZVVwZGF0ZUZuKFxuICAgICAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydE5vZGUubmV4dFNpYmxpbmcsXG4gICAgICAgICAgICAgICAgdGhpcy5lbmROb2RlLnByZXZpb3VzU2libGluZyxcbiAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZyxcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0Tm9kZS5ub2RlVmFsdWVcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIG9uQ2hhbmdlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuZXhwcikge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGV4cHJWYWx1ZSA9IHRoaXMuZXhwckZuKHRoaXMuc2NvcGVNb2RlbCk7XG4gICAgICAgICAgICBpZiAodGhpcy5kaXJ0eUNoZWNrKHRoaXMuZXhwciwgZXhwclZhbHVlLCB0aGlzLmV4cHJPbGRWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUZuKGV4cHJWYWx1ZSwgdGhpcy5zY29wZU1vZGVsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5leHByT2xkVmFsdWUgPSBleHByVmFsdWU7XG5cbiAgICAgICAgICAgIERpcmVjdGl2ZVBhcnNlci5wcm90b3R5cGUub25DaGFuZ2UuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB1dGlscy50cmF2ZXJzZU5vZGVzKHRoaXMudHBsU2VnLmZpcnN0Q2hpbGQsIHRoaXMudHBsU2VnLmxhc3RDaGlsZCwgZnVuY3Rpb24gKGN1ck5vZGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVuZE5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoY3VyTm9kZSwgdGhpcy5lbmROb2RlKTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgICAgICB1dGlscy5lYWNoKHRoaXMudHJlZXMsIGZ1bmN0aW9uICh0cmVlKSB7XG4gICAgICAgICAgICAgICAgdHJlZS5kZXN0cm95KCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy50cGxTZWcgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5leHByID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuZXhwckZuID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRm4gPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5zdGFydE5vZGUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5lbmROb2RlID0gbnVsbDtcbiAgICAgICAgICAgIERpcmVjdGl2ZVBhcnNlci5wcm90b3R5cGUuZGVzdHJveS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNyZWF0ZVRyZWU6IGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICAgICAgICAgIHZhciBwYXJzZXIgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIGNvcHlTZWcgPSBwYXJzZXIudHBsU2VnLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICAgIHZhciBzdGFydE5vZGUgPSBjb3B5U2VnLmZpcnN0Q2hpbGQ7XG4gICAgICAgICAgICB2YXIgZW5kTm9kZSA9IGNvcHlTZWcubGFzdENoaWxkO1xuICAgICAgICAgICAgdXRpbHMudHJhdmVyc2VOb2RlcyhzdGFydE5vZGUsIGVuZE5vZGUsIGZ1bmN0aW9uIChjdXJOb2RlKSB7XG4gICAgICAgICAgICAgICAgcGFyc2VyLmVuZE5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoY3VyTm9kZSwgcGFyc2VyLmVuZE5vZGUpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciB0cmVlID0gbmV3IEZvclRyZWUoe1xuICAgICAgICAgICAgICAgIHN0YXJ0Tm9kZTogc3RhcnROb2RlLFxuICAgICAgICAgICAgICAgIGVuZE5vZGU6IGVuZE5vZGUsXG4gICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWcsXG4gICAgICAgICAgICAgICAgZG9tVXBkYXRlcjogcGFyc2VyLnRyZWUuZG9tVXBkYXRlcixcbiAgICAgICAgICAgICAgICBleHByQ2FsY3VsYXRlcjogcGFyc2VyLnRyZWUuZXhwckNhbGN1bGF0ZXJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdHJlZS5zZXRQYXJlbnQocGFyc2VyLnRyZWUpO1xuICAgICAgICAgICAgdHJlZS50cmF2ZXJzZSgpO1xuICAgICAgICAgICAgcmV0dXJuIHRyZWU7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgaXNQcm9wZXJOb2RlOiBmdW5jdGlvbiAobm9kZSwgY29uZmlnKSB7XG4gICAgICAgICAgICByZXR1cm4gRGlyZWN0aXZlUGFyc2VyLmlzUHJvcGVyTm9kZShub2RlLCBjb25maWcpXG4gICAgICAgICAgICAgICAgJiYgY29uZmlnLmZvclByZWZpeFJlZ0V4cC50ZXN0KG5vZGUubm9kZVZhbHVlKTtcbiAgICAgICAgfSxcblxuICAgICAgICBmaW5kRW5kTm9kZTogZnVuY3Rpb24gKGZvclN0YXJ0Tm9kZSwgY29uZmlnKSB7XG4gICAgICAgICAgICB2YXIgY3VyTm9kZSA9IGZvclN0YXJ0Tm9kZTtcbiAgICAgICAgICAgIHdoaWxlICgoY3VyTm9kZSA9IGN1ck5vZGUubmV4dFNpYmxpbmcpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzRm9yRW5kTm9kZShjdXJOb2RlLCBjb25maWcpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjdXJOb2RlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBnZXROb0VuZE5vZGVFcnJvcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcigndGhlIGBmb3JgIGRpcmVjdGl2ZSBpcyBub3QgcHJvcGVybHkgZW5kZWQhJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJG5hbWU6ICdGb3JEaXJlY3RpdmVQYXJzZXInXG4gICAgfVxuKTtcblxuRm9yVHJlZS5yZWdpc3RlUGFyc2VyKG1vZHVsZS5leHBvcnRzKTtcblxuZnVuY3Rpb24gaXNGb3JFbmROb2RlKG5vZGUsIGNvbmZpZykge1xuICAgIHJldHVybiBub2RlLm5vZGVUeXBlID09PSA4ICYmIGNvbmZpZy5mb3JFbmRQcmVmaXhSZWdFeHAudGVzdChub2RlLm5vZGVWYWx1ZSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVVwZGF0ZUZuKHBhcnNlciwgc3RhcnROb2RlLCBlbmROb2RlLCBjb25maWcsIGZ1bGxFeHByKSB7XG4gICAgdmFyIHRyZWVzID0gW107XG4gICAgcGFyc2VyLnRyZWVzID0gdHJlZXM7XG4gICAgdmFyIGl0ZW1WYXJpYWJsZU5hbWUgPSBmdWxsRXhwci5tYXRjaChwYXJzZXIuY29uZmlnLmdldEZvckl0ZW1WYWx1ZU5hbWVSZWdFeHAoKSlbMV07XG4gICAgdmFyIHRhc2tJZCA9IHBhcnNlci5kb21VcGRhdGVyLmdlbmVyYXRlVGFza0lkKCk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChleHByVmFsdWUsIHNjb3BlTW9kZWwpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gMDtcbiAgICAgICAgZm9yICh2YXIgayBpbiBleHByVmFsdWUpIHtcbiAgICAgICAgICAgIGlmICghdHJlZXNbaW5kZXhdKSB7XG4gICAgICAgICAgICAgICAgdHJlZXNbaW5kZXhdID0gcGFyc2VyLmNyZWF0ZVRyZWUoY29uZmlnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdHJlZXNbaW5kZXhdLnJlc3RvcmVGcm9tRGFyaygpO1xuICAgICAgICAgICAgdHJlZXNbaW5kZXhdLnNldERpcnR5Q2hlY2tlcihwYXJzZXIuZGlydHlDaGVja2VyKTtcblxuICAgICAgICAgICAgdmFyIGxvY2FsID0ge1xuICAgICAgICAgICAgICAgIGtleTogayxcbiAgICAgICAgICAgICAgICBpbmRleDogaW5kZXhcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBsb2NhbFtpdGVtVmFyaWFibGVOYW1lXSA9IGV4cHJWYWx1ZVtrXTtcblxuICAgICAgICAgICAgdHJlZXNbaW5kZXhdLnJvb3RTY29wZS5zZXRQYXJlbnQoc2NvcGVNb2RlbCk7XG4gICAgICAgICAgICBzY29wZU1vZGVsLmFkZENoaWxkKHRyZWVzW2luZGV4XS5yb290U2NvcGUpO1xuXG4gICAgICAgICAgICB0cmVlc1tpbmRleF0uc2V0RGF0YShsb2NhbCk7XG5cbiAgICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgIH1cblxuICAgICAgICBwYXJzZXIuZG9tVXBkYXRlci5hZGRUYXNrRm4odGFza0lkLCB1dGlscy5iaW5kKGZ1bmN0aW9uICh0cmVlcywgaW5kZXgpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBpbmRleCwgaWwgPSB0cmVlcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdHJlZXNbaV0uZ29EYXJrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIG51bGwsIHRyZWVzLCBpbmRleCkpO1xuICAgIH07XG59XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Z0cGwvc3JjL3BhcnNlcnMvRm9yRGlyZWN0aXZlUGFyc2VyLmpzXG4gKiogbW9kdWxlIGlkID0gMTlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDJcbiAqKi8iLCIvKipcbiAqIEBmaWxlIGZvcuaMh+S7pOS4reeUqOWIsOeahFxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbnZhciBUcmVlID0gcmVxdWlyZSgnLi9UcmVlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVHJlZS5leHRlbmRzKFxuICAgIHtcbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIGlmICghb3B0aW9ucy5jb25maWdcbiAgICAgICAgICAgICAgICB8fCAhb3B0aW9ucy5kb21VcGRhdGVyXG4gICAgICAgICAgICAgICAgfHwgIW9wdGlvbnMuZXhwckNhbGN1bGF0ZXJcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignd3JvbmcgYXJndW1lbnRzJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIFRyZWUucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgICAkbmFtZTogJ0ZvclRyZWUnXG4gICAgfVxuKTtcblxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL3NyYy90cmVlcy9Gb3JUcmVlLmpzXG4gKiogbW9kdWxlIGlkID0gMjBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDJcbiAqKi8iLCIvKipcbiAqIEBmaWxlIOWinuW8uuS4gOS4i3Z0cGzkuK3nmoRpZuaMh+S7pFxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbnZhciBJZkRpcmVjdGl2ZVBhcnNlciA9IHJlcXVpcmUoJ3Z0cGwvc3JjL3BhcnNlcnMvSWZEaXJlY3RpdmVQYXJzZXInKTtcbnZhciBUcmVlID0gcmVxdWlyZSgndnRwbC9zcmMvdHJlZXMvVHJlZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IElmRGlyZWN0aXZlUGFyc2VyLmV4dGVuZHMoXG4gICAge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDnu5lpZuaMh+S7pOaJgOeuoeeQhueahOaJgOacieiKgueCueiuvue9rmNzc+exu1xuICAgICAgICAgKlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IGNsYXNzTGlzdCBjc3PnsbvmlbDnu4RcbiAgICAgICAgICovXG4gICAgICAgIHNldENzc0NsYXNzOiBmdW5jdGlvbiAoY2xhc3NMaXN0KSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaWwgPSB0aGlzLmJyYW5jaGVzLmxlbmd0aDsgaSA8IGlsOyArK2kpIHtcbiAgICAgICAgICAgICAgICB2YXIgYnJhbmNoID0gdGhpcy5icmFuY2hlc1tpXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMCwgamwgPSBicmFuY2gubGVuZ3RoOyBqID4gamw7ICsraikge1xuICAgICAgICAgICAgICAgICAgICBicmFuY2guc2V0Q3NzQ2xhc3MoY2xhc3NMaXN0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0QXR0cjogZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAobmFtZSA9PT0gJ2NsYXNzJykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0Q3NzQ2xhc3ModmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICAgICRuYW1lOiAnSWZEaXJlY3RpdmVQYXJzZXInXG4gICAgfVxuKTtcblxuVHJlZS5yZWdpc3RlUGFyc2VyKG1vZHVsZS5leHBvcnRzKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdmNvbXBvbmVudC9zcmMvSWZEaXJlY3RpdmVQYXJzZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAyMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMlxuICoqLyIsIi8qKlxuICogQGZpbGUgaWYg5oyH5LukXG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20pXG4gKi9cblxudmFyIERpcmVjdGl2ZVBhcnNlciA9IHJlcXVpcmUoJy4vRGlyZWN0aXZlUGFyc2VyJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xudmFyIFRyZWUgPSByZXF1aXJlKCcuLi90cmVlcy9UcmVlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGlyZWN0aXZlUGFyc2VyLmV4dGVuZHMoXG4gICAge1xuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgRGlyZWN0aXZlUGFyc2VyLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgICAgIHRoaXMuc3RhcnROb2RlID0gb3B0aW9ucy5zdGFydE5vZGU7XG4gICAgICAgICAgICB0aGlzLmVuZE5vZGUgPSBvcHRpb25zLmVuZE5vZGU7XG4gICAgICAgICAgICB0aGlzLmNvbmZpZyA9IG9wdGlvbnMuY29uZmlnO1xuXG4gICAgICAgICAgICB0aGlzLmV4cHJzID0gW107XG4gICAgICAgICAgICB0aGlzLmV4cHJGbnMgPSB7fTtcblxuICAgICAgICAgICAgdGhpcy5oYW5kbGVCcmFuY2hlc1Rhc2tJZCA9IHRoaXMuZG9tVXBkYXRlci5nZW5lcmF0ZVRhc2tJZCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNvbGxlY3RFeHByczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGJyYW5jaGVzID0gW107XG4gICAgICAgICAgICB2YXIgYnJhbmNoSW5kZXggPSAtMTtcblxuICAgICAgICAgICAgdXRpbHMudHJhdmVyc2VOb2Rlcyh0aGlzLnN0YXJ0Tm9kZSwgdGhpcy5lbmROb2RlLCBmdW5jdGlvbiAoY3VyTm9kZSkge1xuICAgICAgICAgICAgICAgIHZhciBub2RlVHlwZSA9IGdldElmTm9kZVR5cGUoY3VyTm9kZSwgdGhpcy5jb25maWcpO1xuXG4gICAgICAgICAgICAgICAgaWYgKG5vZGVUeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldEVuZE5vZGUoY3VyTm9kZSwgYnJhbmNoZXMsIGJyYW5jaEluZGV4KTtcblxuICAgICAgICAgICAgICAgICAgICBicmFuY2hJbmRleCsrO1xuICAgICAgICAgICAgICAgICAgICBicmFuY2hlc1ticmFuY2hJbmRleF0gPSBicmFuY2hlc1ticmFuY2hJbmRleF0gfHwge307XG5cbiAgICAgICAgICAgICAgICAgICAgLy8g5pivIGlmIOiKgueCueaIluiAhSBlbGlmIOiKgueCue+8jOaQnOmbhuihqOi+vuW8j1xuICAgICAgICAgICAgICAgICAgICBpZiAobm9kZVR5cGUgPCAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXhwciA9IGN1ck5vZGUubm9kZVZhbHVlLnJlcGxhY2UodGhpcy5jb25maWcuZ2V0QWxsSWZSZWdFeHAoKSwgJycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5leHBycy5wdXNoKGV4cHIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZXhwckZuc1tleHByXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXhwckZuc1tleHByXSA9IHV0aWxzLmNyZWF0ZUV4cHJGbihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25maWcuZ2V0RXhwclJlZ0V4cCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHByLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmV4cHJDYWxjdWxhdGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChub2RlVHlwZSA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oYXNFbHNlQnJhbmNoID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFicmFuY2hlc1ticmFuY2hJbmRleF0uc3RhcnROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmFuY2hlc1ticmFuY2hJbmRleF0uc3RhcnROb2RlID0gY3VyTm9kZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGN1ck5vZGUgPSBjdXJOb2RlLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgIGlmICghY3VyTm9kZSB8fCBjdXJOb2RlID09PSB0aGlzLmVuZE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0RW5kTm9kZShjdXJOb2RlLCBicmFuY2hlcywgYnJhbmNoSW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICAgICAgdGhpcy5icmFuY2hlcyA9IGJyYW5jaGVzO1xuICAgICAgICAgICAgcmV0dXJuIGJyYW5jaGVzO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBzZXRFbmROb2RlKGN1ck5vZGUsIGJyYW5jaGVzLCBicmFuY2hJbmRleCkge1xuICAgICAgICAgICAgICAgIGlmIChicmFuY2hJbmRleCArIDEgJiYgYnJhbmNoZXNbYnJhbmNoSW5kZXhdLnN0YXJ0Tm9kZSkge1xuICAgICAgICAgICAgICAgICAgICBicmFuY2hlc1ticmFuY2hJbmRleF0uZW5kTm9kZSA9IGN1ck5vZGUucHJldmlvdXNTaWJsaW5nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBvbkNoYW5nZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGV4cHJzID0gdGhpcy5leHBycztcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IGV4cHJzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgZXhwciA9IGV4cHJzW2ldO1xuICAgICAgICAgICAgICAgIHZhciBleHByVmFsdWUgPSB0aGlzLmV4cHJGbnNbZXhwcl0odGhpcy5zY29wZU1vZGVsKTtcbiAgICAgICAgICAgICAgICBpZiAoZXhwclZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZG9tVXBkYXRlci5hZGRUYXNrRm4oXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZUJyYW5jaGVzVGFza0lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXRpbHMuYmluZChoYW5kbGVCcmFuY2hlcywgbnVsbCwgdGhpcy5icmFuY2hlcywgaSlcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzRWxzZUJyYW5jaCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZG9tVXBkYXRlci5hZGRUYXNrRm4oXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlQnJhbmNoZXNUYXNrSWQsXG4gICAgICAgICAgICAgICAgICAgIHV0aWxzLmJpbmQoaGFuZGxlQnJhbmNoZXMsIG51bGwsIHRoaXMuYnJhbmNoZXMsIGkpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5zdGFydE5vZGUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5lbmROb2RlID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuZXhwcnMgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5leHByRm5zID0gbnVsbDtcblxuICAgICAgICAgICAgRGlyZWN0aXZlUGFyc2VyLnByb3RvdHlwZS5kZXN0cm95LmNhbGwodGhpcyk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgaXNQcm9wZXJOb2RlOiBmdW5jdGlvbiAobm9kZSwgY29uZmlnKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0SWZOb2RlVHlwZShub2RlLCBjb25maWcpID09PSAxO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZpbmRFbmROb2RlOiBmdW5jdGlvbiAoaWZTdGFydE5vZGUsIGNvbmZpZykge1xuICAgICAgICAgICAgdmFyIGN1ck5vZGUgPSBpZlN0YXJ0Tm9kZTtcbiAgICAgICAgICAgIHdoaWxlICgoY3VyTm9kZSA9IGN1ck5vZGUubmV4dFNpYmxpbmcpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzSWZFbmROb2RlKGN1ck5vZGUsIGNvbmZpZykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN1ck5vZGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGdldE5vRW5kTm9kZUVycm9yOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKCd0aGUgaWYgZGlyZWN0aXZlIGlzIG5vdCBwcm9wZXJseSBlbmRlZCEnKTtcbiAgICAgICAgfSxcblxuICAgICAgICAkbmFtZTogJ0lmRGlyZWN0aXZlUGFyc2VyJ1xuICAgIH1cbik7XG5cblRyZWUucmVnaXN0ZVBhcnNlcihtb2R1bGUuZXhwb3J0cyk7XG5cbmZ1bmN0aW9uIGhhbmRsZUJyYW5jaGVzKGJyYW5jaGVzLCBzaG93SW5kZXgpIHtcbiAgICB1dGlscy5lYWNoKGJyYW5jaGVzLCBmdW5jdGlvbiAoYnJhbmNoLCBqKSB7XG4gICAgICAgIHZhciBmbiA9IGogPT09IHNob3dJbmRleCA/ICdyZXN0b3JlRnJvbURhcmsnIDogJ2dvRGFyayc7XG4gICAgICAgIHV0aWxzLmVhY2goYnJhbmNoLCBmdW5jdGlvbiAocGFyc2VyT2JqKSB7XG4gICAgICAgICAgICBwYXJzZXJPYmoucGFyc2VyW2ZuXSgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gaXNJZkVuZE5vZGUobm9kZSwgY29uZmlnKSB7XG4gICAgcmV0dXJuIGdldElmTm9kZVR5cGUobm9kZSwgY29uZmlnKSA9PT0gNDtcbn1cblxuZnVuY3Rpb24gZ2V0SWZOb2RlVHlwZShub2RlLCBjb25maWcpIHtcbiAgICBpZiAobm9kZS5ub2RlVHlwZSAhPT0gOCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5pZlByZWZpeFJlZ0V4cC50ZXN0KG5vZGUubm9kZVZhbHVlKSkge1xuICAgICAgICByZXR1cm4gMTtcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLmVsaWZQcmVmaXhSZWdFeHAudGVzdChub2RlLm5vZGVWYWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIDI7XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5lbHNlUHJlZml4UmVnRXhwLnRlc3Qobm9kZS5ub2RlVmFsdWUpKSB7XG4gICAgICAgIHJldHVybiAzO1xuICAgIH1cblxuICAgIGlmIChjb25maWcuaWZFbmRQcmVmaXhSZWdFeHAudGVzdChub2RlLm5vZGVWYWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIDQ7XG4gICAgfVxufVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL3NyYy9wYXJzZXJzL0lmRGlyZWN0aXZlUGFyc2VyLmpzXG4gKiogbW9kdWxlIGlkID0gMjJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDJcbiAqKi8iLCIvKipcbiAqIEBmaWxlIOe7hOS7tuino+aekOWZqFxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbnZhciBFdmVudEV4cHJQYXJzZXIgPSByZXF1aXJlKCd2dHBsL3NyYy9wYXJzZXJzL0V2ZW50RXhwclBhcnNlcicpO1xudmFyIFRyZWUgPSByZXF1aXJlKCd2dHBsL3NyYy90cmVlcy9UcmVlJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCd2dHBsL3NyYy91dGlscycpO1xudmFyIENvbXBvbmVudFRyZWUgPSByZXF1aXJlKCcuL0NvbXBvbmVudFRyZWUnKTtcbnZhciBDb21wb25lbnRDaGlsZHJlbiA9IHJlcXVpcmUoJy4vQ29tcG9uZW50Q2hpbGRyZW4nKTtcbnZhciBDb21wb25lbnRNYW5hZ2VyID0gcmVxdWlyZSgnLi9Db21wb25lbnRNYW5hZ2VyJyk7XG52YXIgRG9tVXBkYXRlciA9IHJlcXVpcmUoJ3Z0cGwvc3JjL0RvbVVwZGF0ZXInKTtcblxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEV4cHJQYXJzZXIuZXh0ZW5kcyhcbiAgICB7XG5cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIEV2ZW50RXhwclBhcnNlci5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRNYW5hZ2VyID0gdGhpcy50cmVlLmdldFRyZWVWYXIoJ2NvbXBvbmVudE1hbmFnZXInKTtcbiAgICAgICAgICAgIHRoaXMuaXNDb21wb25lbnQgPSB0aGlzLm5vZGUubm9kZVR5cGUgPT09IDFcbiAgICAgICAgICAgICAgICAmJiB0aGlzLm5vZGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ3VpLScpID09PSAwO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5pc0NvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIHZhciBjb21wb25lbnROYW1lID0gdXRpbHMubGluZTJjYW1lbCh0aGlzLm5vZGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJ3VpJywgJycpKTtcblxuICAgICAgICAgICAgICAgIHZhciBDb21wb25lbnRDbGFzcyA9IHRoaXMuY29tcG9uZW50TWFuYWdlci5nZXRDbGFzcyhjb21wb25lbnROYW1lKTtcbiAgICAgICAgICAgICAgICBpZiAoIUNvbXBvbmVudENsYXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigndGhlIGNvbXBvbmVudCBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCBpcyBub3QgcmVnaXN0ZWQhJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIOe7hOS7tuacrOi6q+WwseW6lOivpeacieeahGNzc+exu+WQjVxuICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50T3JpZ2luQ3NzQ2xhc3NMaXN0ID0gQ29tcG9uZW50TWFuYWdlci5nZXRDc3NDbGFzc05hbWUoQ29tcG9uZW50Q2xhc3MpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnQgPSBuZXcgQ29tcG9uZW50Q2xhc3MoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudC5wYXJzZXIgPSB0aGlzO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5tb3VudChvcHRpb25zLnRyZWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGNvbGxlY3RFeHByczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbGxlY3RDb21wb25lbnRFeHBycygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgRXZlbnRFeHByUGFyc2VyLnByb3RvdHlwZS5jb2xsZWN0RXhwcnMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBtb3VudDogZnVuY3Rpb24gKHBhcmVudFRyZWUpIHtcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50LmNvbXBvbmVudFdpbGxNb3VudCgpO1xuXG4gICAgICAgICAgICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBkaXYuaW5uZXJIVE1MID0gdGhpcy5jb21wb25lbnQudHBsO1xuICAgICAgICAgICAgdmFyIHN0YXJ0Tm9kZSA9IGRpdi5maXJzdENoaWxkO1xuICAgICAgICAgICAgdmFyIGVuZE5vZGUgPSBkaXYubGFzdENoaWxkO1xuXG4gICAgICAgICAgICB0aGlzLnN0YXJ0Tm9kZSA9IHN0YXJ0Tm9kZTtcbiAgICAgICAgICAgIHRoaXMuZW5kTm9kZSA9IGVuZE5vZGU7XG5cbiAgICAgICAgICAgIC8vIOe7hOS7tueahOS9nOeUqOWfn+aYr+WSjOWklumDqOeahOS9nOeUqOWfn+malOW8gOeahFxuICAgICAgICAgICAgdGhpcy50cmVlID0gbmV3IENvbXBvbmVudFRyZWUoe1xuICAgICAgICAgICAgICAgIHN0YXJ0Tm9kZTogc3RhcnROb2RlLFxuICAgICAgICAgICAgICAgIGVuZE5vZGU6IGVuZE5vZGUsXG4gICAgICAgICAgICAgICAgY29uZmlnOiBwYXJlbnRUcmVlLmNvbmZpZyxcbiAgICAgICAgICAgICAgICBkb21VcGRhdGVyOiBwYXJlbnRUcmVlLmRvbVVwZGF0ZXIsXG4gICAgICAgICAgICAgICAgZXhwckNhbGN1bGF0ZXI6IHBhcmVudFRyZWUuZXhwckNhbGN1bGF0ZXIsXG5cbiAgICAgICAgICAgICAgICAvLyBjb21wb25lbnRDaGlsZHJlbuS4jeiDveS8oOe7meWtkOe6p+e7hOS7tuagke+8jOWPr+S7peS8oOe7meWtkOe6p2ZvcuagkeOAglxuICAgICAgICAgICAgICAgIGNvbXBvbmVudENoaWxkcmVuOiBuZXcgQ29tcG9uZW50Q2hpbGRyZW4oXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS5maXJzdENoaWxkLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUubGFzdENoaWxkLFxuICAgICAgICAgICAgICAgICAgICBwYXJlbnRUcmVlLnJvb3RTY29wZVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLnRyZWUuc2V0UGFyZW50KHBhcmVudFRyZWUpO1xuXG4gICAgICAgICAgICB0aGlzLnRyZWUucmVnaXN0ZUNvbXBvbmVudHModGhpcy5jb21wb25lbnQuY29tcG9uZW50Q2xhc3Nlcyk7XG5cbiAgICAgICAgICAgIGluc2VydENvbXBvbmVudE5vZGVzKHRoaXMubm9kZSwgc3RhcnROb2RlLCBlbmROb2RlKTtcblxuICAgICAgICAgICAgdGhpcy50cmVlLnRyYXZlcnNlKCk7XG5cbiAgICAgICAgICAgIC8vIOaKiue7hOS7tuiKgueCueaUvuWIsCBET00g5qCR5Lit5Y67XG4gICAgICAgICAgICBmdW5jdGlvbiBpbnNlcnRDb21wb25lbnROb2Rlcyhjb21wb25lbnROb2RlLCBzdGFydE5vZGUsIGVuZE5vZGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFyZW50Tm9kZSA9IGNvbXBvbmVudE5vZGUucGFyZW50Tm9kZTtcbiAgICAgICAgICAgICAgICB1dGlscy50cmF2ZXJzZU5vZGVzKFxuICAgICAgICAgICAgICAgICAgICBzdGFydE5vZGUsXG4gICAgICAgICAgICAgICAgICAgIGVuZE5vZGUsXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChjdXJOb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnROb2RlLmluc2VydEJlZm9yZShjdXJOb2RlLCBjb21wb25lbnROb2RlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5yZW1vdmVDaGlsZChjb21wb25lbnROb2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6K6+572u5b2T5YmN6IqC54K55oiW6ICF57uE5Lu255qE5bGe5oCnXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwdWJsaWNcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUg5bGe5oCn5ZCNXG4gICAgICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUg5bGe5oCn5YC8XG4gICAgICAgICAqL1xuICAgICAgICBzZXRBdHRyOiBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmIChuYW1lID09PSAncmVmJykge1xuICAgICAgICAgICAgICAgIHRoaXMuJCRyZWYgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmlzQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKG5hbWUgPT09ICdjbGFzcycpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB0aGlzLmNvbXBvbmVudE9yaWdpbkNzc0NsYXNzTGlzdC5jb25jYXQoRG9tVXBkYXRlci5nZXRDbGFzc0xpc3QodmFsdWUpKTtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaWwgPSB0aGlzLnRyZWUudHJlZS5sZW5ndGg7IGkgPCBpbDsgKytpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGFyc2VyT2JqID0gdGhpcy50cmVlLnRyZWVbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZXJPYmoucGFyc2VyLnNldEF0dHIgJiYgcGFyc2VyT2JqLnBhcnNlci5zZXRBdHRyKCdjbGFzcycsIERvbVVwZGF0ZXIuZ2V0Q2xhc3NMaXN0KHZhbHVlKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgc2NvcGUgPSB0aGlzLnRyZWUucm9vdFNjb3BlO1xuICAgICAgICAgICAgICAgIHNjb3BlLnNldChuYW1lLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBFdmVudEV4cHJQYXJzZXIucHJvdG90eXBlLnNldEF0dHIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6I635Y+W5bGe5oCnXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwdWJsaWNcbiAgICAgICAgICogQHBhcmFtICB7c3RyaW5nfSBuYW1lIOWxnuaAp+WQjVxuICAgICAgICAgKiBAcmV0dXJuIHsqfSAgICAgIOWxnuaAp+WAvFxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0QXR0cjogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudHJlZS5yb290U2NvcGUuZ2V0KG5hbWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gRXZlbnRFeHByUGFyc2VyLnByb3RvdHlwZS5nZXRBdHRyKHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY29sbGVjdENvbXBvbmVudEV4cHJzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgY3VyTm9kZSA9IHRoaXMubm9kZTtcblxuICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSBjdXJOb2RlLmF0dHJpYnV0ZXM7XG4gICAgICAgICAgICAvLyDmkJzpm4bkuI3lkKvmnInooajovr7lvI/nmoTlsZ7mgKfvvIznhLblkI7lnKjnu4Tku7bnsbvliJvlu7rlpb3kuYvlkI7orr7nva7ov5vnu4Tku7ZcbiAgICAgICAgICAgIHRoaXMuc2V0TGl0ZXJhbEF0dHJzRm5zID0gW107XG5cbiAgICAgICAgICAgIC8vIOaYr+WQpuWtmOWcqGNzc+exu+WQjeeahOiuvue9ruWHveaVsFxuICAgICAgICAgICAgdmFyIGhhc0NsYXNzID0gZmFsc2U7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaWwgPSBhdHRyaWJ1dGVzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgYXR0ciA9IGF0dHJpYnV0ZXNbaV07XG4gICAgICAgICAgICAgICAgaGFzQ2xhc3MgPSBhdHRyLm5vZGVOYW1lID09PSAnY2xhc3MtbGlzdCc7XG5cbiAgICAgICAgICAgICAgICB2YXIgZXhwciA9IGF0dHIubm9kZVZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbmZpZy5nZXRFeHByUmVnRXhwKCkudGVzdChleHByKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmV4cHJzLnB1c2goZXhwcik7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5leHByRm5zW2V4cHJdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmF3RXhwciA9IGdldFJhd0V4cHIoZXhwciwgdGhpcy5jb25maWcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5leHByQ2FsY3VsYXRlci5jcmVhdGVFeHByRm4ocmF3RXhwcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmV4cHJGbnNbZXhwcl0gPSB1dGlscy5iaW5kKGNhbGN1bGF0ZUV4cHIsIG51bGwsIHJhd0V4cHIsIHRoaXMuZXhwckNhbGN1bGF0ZXIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUZuc1tleHByXSA9IHRoaXMudXBkYXRlRm5zW2V4cHJdIHx8IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVGbnNbZXhwcl0ucHVzaCh1dGlscy5iaW5kKHNldEF0dHJGbiwgdGhpcywgYXR0ci5ub2RlTmFtZSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldExpdGVyYWxBdHRyc0Zucy5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgdXRpbHMuYmluZChzZXRBdHRyRm4sIHRoaXMsIGF0dHIubm9kZU5hbWUsIGF0dHIubm9kZVZhbHVlLCB0cnVlKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFoYXNDbGFzcykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0TGl0ZXJhbEF0dHJzRm5zLnB1c2goXG4gICAgICAgICAgICAgICAgICAgIHV0aWxzLmJpbmQoc2V0QXR0ckZuLCB0aGlzLCAnY2xhc3MnLCBbXSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDorr7nva7nu4Tku7blsZ7mgKfjgIJcbiAgICAgICAgICAgICAqIOeUseS6jkhUTUzmoIfnrb7kuK3kuI3og73lhpnpqbzls7DlvaLlvI/nmoTlsZ7mgKflkI3vvIxcbiAgICAgICAgICAgICAqIOaJgOS7peatpOWkhOS8muWwhuS4reaoque6v+W9ouW8j+eahOWxnuaAp+i9rOaNouaIkOmpvOWzsOW9ouW8j+OAglxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEBpbm5lclxuICAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgICAgICDlsZ7mgKflkI1cbiAgICAgICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAgICAg5bGe5oCn5YC8XG4gICAgICAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGlzTGl0ZXJhbCDmmK/lkKbmmK/luLjph4/lsZ7mgKdcbiAgICAgICAgICAgICAqIEBwYXJhbSB7Q29tcG9uZW50fSBjb21wb25lbnQg57uE5Lu2XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGZ1bmN0aW9uIHNldEF0dHJGbihuYW1lLCB2YWx1ZSwgaXNMaXRlcmFsKSB7XG4gICAgICAgICAgICAgICAgbmFtZSA9IHV0aWxzLmxpbmUyY2FtZWwobmFtZSk7XG4gICAgICAgICAgICAgICAgaWYgKG5hbWUgPT09ICdjbGFzcycpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB0aGlzLmNvbXBvbmVudE9yaWdpbkNzc0NsYXNzTGlzdC5jb25jYXQoRG9tVXBkYXRlci5nZXRDbGFzc0xpc3QodmFsdWUpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzTGl0ZXJhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnRPcmlnaW5Dc3NDbGFzc0xpc3QgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnNldEF0dHIobmFtZSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBjYWxjdWxhdGVFeHByKHJhd0V4cHIsIGV4cHJDYWxjdWxhdGVyLCBzY29wZU1vZGVsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGV4cHJDYWxjdWxhdGVyLmNhbGN1bGF0ZShyYXdFeHByLCBmYWxzZSwgc2NvcGVNb2RlbCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldFJhd0V4cHIoZXhwciwgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGV4cHIucmVwbGFjZShjb25maWcuZ2V0RXhwclJlZ0V4cCgpLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcmd1bWVudHNbMV07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiOt+WPluW8gOWni+iKgueCuVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICAqIEBpbmhlcml0RG9jXG4gICAgICAgICAqIEByZXR1cm4ge05vZGV9XG4gICAgICAgICAqL1xuICAgICAgICBnZXRTdGFydE5vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RhcnROb2RlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gRXZlbnRFeHByUGFyc2VyLnByb3RvdHlwZS5nZXRTdGFydE5vZGUuY2FsbCh0aGlzKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6I635Y+W57uT5p2f6IqC54K5XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICogQGluaGVyaXREb2NcbiAgICAgICAgICogQHJldHVybiB7Tm9kZX1cbiAgICAgICAgICovXG4gICAgICAgIGdldEVuZE5vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZW5kTm9kZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIEV2ZW50RXhwclBhcnNlci5wcm90b3R5cGUuZ2V0RW5kTm9kZS5jYWxsKHRoaXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldFNjb3BlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnNjb3BlTW9kZWwgPSB0aGlzLnRyZWUucm9vdFNjb3BlO1xuICAgICAgICAgICAgRXZlbnRFeHByUGFyc2VyLnByb3RvdHlwZS5zZXRTY29wZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5pc0NvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IHRoaXMuc2V0TGl0ZXJhbEF0dHJzRm5zLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRMaXRlcmFsQXR0cnNGbnNbaV0odGhpcy5jb21wb25lbnQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50LmNvbXBvbmVudERpZE1vdW50KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0U2NvcGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRyZWUucm9vdFNjb3BlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIHNjb3BlTW9kZWzph4zpnaLnmoTlgLzlj5HnlJ/kuoblj5jljJZcbiAgICAgICAgb25DaGFuZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzR29EYXJrKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5pc0NvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIHZhciBleHBycyA9IHRoaXMuZXhwcnM7XG4gICAgICAgICAgICAgICAgdmFyIGV4cHJPbGRWYWx1ZXMgPSB0aGlzLmV4cHJPbGRWYWx1ZXM7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlsID0gZXhwcnMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZXhwciA9IGV4cHJzW2ldO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZXhwclZhbHVlID0gdGhpcy5leHByRm5zW2V4cHJdKHRoaXMuc2NvcGVNb2RlbCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZGlydHlDaGVjayhleHByLCBleHByVmFsdWUsIGV4cHJPbGRWYWx1ZXNbZXhwcl0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdXBkYXRlRm5zID0gdGhpcy51cGRhdGVGbnNbZXhwcl07XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMCwgamwgPSB1cGRhdGVGbnMubGVuZ3RoOyBqIDwgamw7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZUZuc1tqXShleHByVmFsdWUsIHRoaXMuY29tcG9uZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGV4cHJPbGRWYWx1ZXNbZXhwcl0gPSBleHByVmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgRXZlbnRFeHByUGFyc2VyLnByb3RvdHlwZS5vbkNoYW5nZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGdvRGFyazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzICYmIHRoaXMuY29tcG9uZW50LmdvRGFyaygpO1xuICAgICAgICAgICAgRXZlbnRFeHByUGFyc2VyLnByb3RvdHlwZS5nb0RhcmsuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICByZXN0b3JlRnJvbURhcms6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50cyAmJiB0aGlzLmNvbXBvbmVudC5yZXN0b3JlRnJvbURhcmsoKTtcbiAgICAgICAgICAgIEV2ZW50RXhwclBhcnNlci5wcm90b3R5cGUucmVzdG9yZUZyb21EYXJrLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVmOiBmdW5jdGlvbiAocmVmKSB7XG4gICAgICAgICAgICB2YXIgcGFyc2VyVHJlZSA9IHRoaXMudHJlZS50cmVlO1xuXG4gICAgICAgICAgICB2YXIgcmV0O1xuICAgICAgICAgICAgdGhpcy53YWxrKHBhcnNlclRyZWUsIGZ1bmN0aW9uIChwYXJzZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFyc2VyLmlzQ29tcG9uZW50ICYmIHBhcnNlci4kJHJlZiA9PT0gcmVmKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHBhcnNlci5jb21wb25lbnQ7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfSxcblxuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudC5jb21wb25lbnRXaWxsVW5tb3VudCgpO1xuICAgICAgICAgICAgdGhpcy5jb21wb25lbnQuZGVzdHJveSgpO1xuICAgICAgICAgICAgRXZlbnRFeHByUGFyc2VyLnByb3RvdHlwZS5kZXN0cm95LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOmBjeWOhnBhcnNlclRyZWVcbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogQHBhcmFtICB7VHJlZX0gcGFyc2VyVHJlZSDmoJFcbiAgICAgICAgICogQHBhcmFtICB7ZnVuY3Rpb24oUGFyc2VyKTpib29sZWFufSBpdGVyYXRlckZuIOi/reS7o+WHveaVsFxuICAgICAgICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgICAgICAgKi9cbiAgICAgICAgd2FsazogZnVuY3Rpb24gKHBhcnNlclRyZWUsIGl0ZXJhdGVyRm4pIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IHBhcnNlclRyZWUubGVuZ3RoOyBpIDwgaWw7ICsraSkge1xuICAgICAgICAgICAgICAgIHZhciBwYXJzZXJPYmogPSBwYXJzZXJUcmVlW2ldO1xuXG4gICAgICAgICAgICAgICAgLy8g6ZKI5a+5aWbmjIfku6TnmoTmg4XlhrVcbiAgICAgICAgICAgICAgICBpZiAodXRpbHMuaXNBcnJheShwYXJzZXJPYmopKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLndhbGsocGFyc2VyT2JqLCBpdGVyYXRlckZuKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8g6ZKI5a+5Zm9y5oyH5Luk55qE5oOF5Ya1XG4gICAgICAgICAgICAgICAgaWYgKHV0aWxzLmlzQXJyYXkocGFyc2VyT2JqLnRyZWVzKSkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMCwgamwgPSBwYXJzZXJPYmoudHJlZXMubGVuZ3RoOyBqIDwgamw7ICsraikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMud2FsayhwYXJzZXJPYmoudHJlZXNbal0udHJlZSwgaXRlcmF0ZXJGbikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoaXRlcmF0ZXJGbihwYXJzZXJPYmoucGFyc2VyKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocGFyc2VyT2JqLmNoaWxkcmVuICYmIHBhcnNlck9iai5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMud2FsayhwYXJzZXJPYmouY2hpbGRyZW4sIGl0ZXJhdGVyRm4pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgICAkbmFtZTogJ0NvbXBvbmVudFBhcnNlcidcbiAgICB9XG4pO1xuXG5UcmVlLnJlZ2lzdGVQYXJzZXIobW9kdWxlLmV4cG9ydHMpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92Y29tcG9uZW50L3NyYy9Db21wb25lbnRQYXJzZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAyM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMlxuICoqLyIsIi8qKlxuICogQGZpbGUg5aSE55CG5LqG5LqL5Lu255qEIEV4cHJQYXJzZXJcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG52YXIgRXhwclBhcnNlciA9IHJlcXVpcmUoJy4vRXhwclBhcnNlcicpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcbnZhciBUcmVlID0gcmVxdWlyZSgnLi4vdHJlZXMvVHJlZScpO1xudmFyIFNjb3BlTW9kZWwgPSByZXF1aXJlKCcuLi9TY29wZU1vZGVsJyk7XG52YXIgRG9tVXBkYXRlciA9IHJlcXVpcmUoJy4uL0RvbVVwZGF0ZXInKTtcblxubW9kdWxlLmV4cG9ydHMgPSBFeHByUGFyc2VyLmV4dGVuZHMoXG4gICAge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDliJ3lp4vljJZcbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKi9cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgRXhwclBhcnNlci5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgICAgICAgICB0aGlzLmV2ZW50cyA9IHt9O1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmt7vliqDooajovr7lvI9cbiAgICAgICAgICpcbiAgICAgICAgICogQGluaGVyaXRcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKiBAcGFyYW0ge0F0dHJ9IGF0dHIg5aaC5p6c5b2T5YmN5piv5YWD57Sg6IqC54K577yM5YiZ6KaB5Lyg5YWl6YGN5Y6G5Yiw55qE5bGe5oCn77yMXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgICDmiYDku6VhdHRy5a2Y5Zyo5LiO5ZCm5piv5Yik5pat5b2T5YmN5YWD57Sg5piv5ZCm5piv5paH5pys6IqC54K555qE5LiA5Liq5L6d5o2uXG4gICAgICAgICAqIEByZXR1cm4ge3VuZGVmaW5lZH1cbiAgICAgICAgICovXG4gICAgICAgIGFkZEV4cHI6IGZ1bmN0aW9uIChhdHRyKSB7XG4gICAgICAgICAgICBpZiAoIWF0dHIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gRXhwclBhcnNlci5wcm90b3R5cGUuYWRkRXhwci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZXZlbnROYW1lID0gZ2V0RXZlbnROYW1lKGF0dHIubmFtZSwgdGhpcy5jb25maWcpO1xuICAgICAgICAgICAgaWYgKCFldmVudE5hbWUgJiYgRG9tVXBkYXRlci5pc0V2ZW50TmFtZShhdHRyLm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgZXZlbnROYW1lID0gYXR0ci5uYW1lLnJlcGxhY2UoJ29uJywgJycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGV2ZW50TmFtZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbmZpZy5nZXRFeHByUmVnRXhwKCkudGVzdChhdHRyLnZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdID0gYXR0ci52YWx1ZTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgZXhwciA9IGF0dHIudmFsdWUucmVwbGFjZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29uZmlnLmdldEV4cHJSZWdFeHAoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXJndW1lbnRzWzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmV4cHJDYWxjdWxhdGVyLmNyZWF0ZUV4cHJGbihleHByLCB0cnVlKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuXG4gICAgICAgICAgICAgICAgICAgIERvbVVwZGF0ZXIuc2V0QXR0cih0aGlzLm5vZGUsICdvbicgKyBldmVudE5hbWUsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxvY2FsU2NvcGUgPSBuZXcgU2NvcGVNb2RlbCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxTY29wZS5zZXQoJ2V2ZW50JywgZXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxTY29wZS5zZXRQYXJlbnQobWUuZ2V0U2NvcGUoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZS5leHByQ2FsY3VsYXRlci5jYWxjdWxhdGUoZXhwciwgdHJ1ZSwgbG9jYWxTY29wZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIEV4cHJQYXJzZXIucHJvdG90eXBlLmFkZEV4cHIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6ZSA5q+BXG4gICAgICAgICAqXG4gICAgICAgICAqIEBpbmhlcml0XG4gICAgICAgICAqIEBwdWJsaWNcbiAgICAgICAgICovXG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHV0aWxzLmVhY2godGhpcy5ldmVudHMsIGZ1bmN0aW9uIChhdHRyVmFsdWUsIGV2ZW50TmFtZSkge1xuICAgICAgICAgICAgICAgIERvbVVwZGF0ZXIuc2V0QXR0cih0aGlzLm5vZGUsICdvbicgKyBldmVudE5hbWUpO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgICAgICB0aGlzLmV2ZW50cyA9IG51bGw7XG5cbiAgICAgICAgICAgIEV4cHJQYXJzZXIucHJvdG90eXBlLmRlc3Ryb3kuYXBwbHkodGhpcyk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgJG5hbWU6ICdFdmVudEV4cHJQYXJzZXInXG4gICAgfVxuKTtcblxuVHJlZS5yZWdpc3RlUGFyc2VyKG1vZHVsZS5leHBvcnRzKTtcblxuXG5mdW5jdGlvbiBnZXRFdmVudE5hbWUoYXR0ck5hbWUsIGNvbmZpZykge1xuICAgIGlmIChhdHRyTmFtZS5pbmRleE9mKGNvbmZpZy5ldmVudFByZWZpeCArICctJykgPT09IC0xKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZXR1cm4gYXR0ck5hbWUucmVwbGFjZShjb25maWcuZXZlbnRQcmVmaXggKyAnLScsICcnKTtcbn1cblxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL3NyYy9wYXJzZXJzL0V2ZW50RXhwclBhcnNlci5qc1xuICoqIG1vZHVsZSBpZCA9IDI0XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyXG4gKiovIiwiLyoqXG4gKiBAZmlsZSDooajovr7lvI/op6PmnpDlmajvvIzkuIDkuKrmlofmnKzoioLngrnmiJbogIXlhYPntKDoioLngrnlr7nlupTkuIDkuKrooajovr7lvI/op6PmnpDlmajlrp7kvotcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG52YXIgUGFyc2VyID0gcmVxdWlyZSgnLi9QYXJzZXInKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG52YXIgVHJlZSA9IHJlcXVpcmUoJy4uL3RyZWVzL1RyZWUnKTtcbnZhciBEb21VcGRhdGVyID0gcmVxdWlyZSgnLi4vRG9tVXBkYXRlcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBhcnNlci5leHRlbmRzKFxuICAgIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICog5Yid5aeL5YyWXG4gICAgICAgICAqXG4gICAgICAgICAqIEBpbmhlcml0RG9jXG4gICAgICAgICAqIEBwYXJhbSAge09iamVjdH0gb3B0aW9ucyDlj4LmlbBcbiAgICAgICAgICogQHBhcmFtICB7Tm9kZX0gb3B0aW9ucy5ub2RlIERPTeiKgueCuVxuICAgICAgICAgKi9cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIFBhcnNlci5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgICAgICAgICB0aGlzLm5vZGUgPSBvcHRpb25zLm5vZGU7XG5cbiAgICAgICAgICAgIHRoaXMuZXhwcnMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuZXhwckZucyA9IHt9O1xuICAgICAgICAgICAgdGhpcy51cGRhdGVGbnMgPSB7fTtcbiAgICAgICAgICAgIC8vIOaBouWkjeWOn+iyjOeahOWHveaVsFxuICAgICAgICAgICAgdGhpcy5yZXN0b3JlRm5zID0ge307XG4gICAgICAgICAgICB0aGlzLmV4cHJPbGRWYWx1ZXMgPSB7fTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBET03oioLngrnlsZ7mgKfkuI7mm7TmlrDlsZ7mgKfnmoTku7vliqFpZOeahOaYoOWwhFxuICAgICAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5hdHRyVG9Eb21UYXNrSWRNYXAgPSB7fTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog5pCc6ZuG6L+H56iLXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwdWJsaWNcbiAgICAgICAgICogQHJldHVybiB7Ym9vbGVhbn0g6L+U5Zue5biD5bCU5YC8XG4gICAgICAgICAqL1xuICAgICAgICBjb2xsZWN0RXhwcnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjdXJOb2RlID0gdGhpcy5ub2RlO1xuXG4gICAgICAgICAgICAvLyDmlofmnKzoioLngrlcbiAgICAgICAgICAgIGlmIChjdXJOb2RlLm5vZGVUeXBlID09PSAzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRFeHByKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOWFg+e0oOiKgueCuVxuICAgICAgICAgICAgaWYgKGN1ck5vZGUubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXR0cmlidXRlcyA9IGN1ck5vZGUuYXR0cmlidXRlcztcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaWwgPSBhdHRyaWJ1dGVzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRFeHByKGF0dHJpYnV0ZXNbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmt7vliqDooajovr7lvI9cbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKiBAcGFyYW0ge0F0dHJ9IGF0dHIg5aaC5p6c5b2T5YmN5piv5YWD57Sg6IqC54K577yM5YiZ6KaB5Lyg5YWl6YGN5Y6G5Yiw55qE5bGe5oCn77yMXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgICDmiYDku6VhdHRy5a2Y5Zyo5LiO5ZCm5piv5Yik5pat5b2T5YmN5YWD57Sg5piv5ZCm5piv5paH5pys6IqC54K555qE5LiA5Liq5L6d5o2uXG4gICAgICAgICAqL1xuICAgICAgICBhZGRFeHByOiBmdW5jdGlvbiAoYXR0cikge1xuICAgICAgICAgICAgdmFyIGV4cHIgPSBhdHRyID8gYXR0ci52YWx1ZSA6IHRoaXMubm9kZS5ub2RlVmFsdWU7XG4gICAgICAgICAgICBpZiAoIXRoaXMuY29uZmlnLmdldEV4cHJSZWdFeHAoKS50ZXN0KGV4cHIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYWRkRXhwcihcbiAgICAgICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgICAgIGV4cHIsXG4gICAgICAgICAgICAgICAgYXR0clxuICAgICAgICAgICAgICAgICAgICA/IGNyZWF0ZUF0dHJVcGRhdGVGbih0aGlzLmdldFRhc2tJZChhdHRyLm5hbWUpLCB0aGlzLm5vZGUsIGF0dHIubmFtZSwgdGhpcy5kb21VcGRhdGVyKVxuICAgICAgICAgICAgICAgICAgICA6IChmdW5jdGlvbiAobWUsIGN1ck5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0YXNrSWQgPSBtZS5kb21VcGRhdGVyLmdlbmVyYXRlVGFza0lkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGV4cHJWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lLmRvbVVwZGF0ZXIuYWRkVGFza0ZuKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXNrSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHV0aWxzLmJpbmQoZnVuY3Rpb24gKGN1ck5vZGUsIGV4cHJWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyTm9kZS5ub2RlVmFsdWUgPSBleHByVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIG51bGwsIGN1ck5vZGUsIGV4cHJWYWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfSkodGhpcywgdGhpcy5ub2RlKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgdGhpcy5yZXN0b3JlRm5zW2V4cHJdID0gdGhpcy5yZXN0b3JlRm5zW2V4cHJdIHx8IFtdO1xuICAgICAgICAgICAgaWYgKGF0dHIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc3RvcmVGbnNbZXhwcl0ucHVzaCh1dGlscy5iaW5kKGZ1bmN0aW9uIChjdXJOb2RlLCBhdHRyTmFtZSwgYXR0clZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGN1ck5vZGUuc2V0QXR0cmlidXRlKGF0dHJOYW1lLCBhdHRyVmFsdWUpO1xuICAgICAgICAgICAgICAgIH0sIG51bGwsIHRoaXMubm9kZSwgYXR0ci5uYW1lLCBhdHRyLnZhbHVlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc3RvcmVGbnNbZXhwcl0ucHVzaCh1dGlscy5iaW5kKGZ1bmN0aW9uIChjdXJOb2RlLCBub2RlVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VyTm9kZS5ub2RlVmFsdWUgPSBub2RlVmFsdWU7XG4gICAgICAgICAgICAgICAgfSwgbnVsbCwgdGhpcy5ub2RlLCB0aGlzLm5vZGUubm9kZVZhbHVlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiOt+WPluW8gOWni+iKgueCuVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICAqIEBpbmhlcml0RG9jXG4gICAgICAgICAqIEByZXR1cm4ge05vZGV9XG4gICAgICAgICAqL1xuICAgICAgICBnZXRTdGFydE5vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5vZGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiOt+WPlue7k+adn+iKgueCuVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICAqIEBpbmhlcml0RG9jXG4gICAgICAgICAqIEByZXR1cm4ge05vZGV9XG4gICAgICAgICAqL1xuICAgICAgICBnZXRFbmROb2RlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ub2RlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDplIDmr4FcbiAgICAgICAgICpcbiAgICAgICAgICogQGluaGVyaXREb2NcbiAgICAgICAgICovXG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHV0aWxzLmVhY2godGhpcy5leHBycywgZnVuY3Rpb24gKGV4cHIpIHtcbiAgICAgICAgICAgICAgICB1dGlscy5lYWNoKHRoaXMucmVzdG9yZUZuc1tleHByXSwgZnVuY3Rpb24gKHJlc3RvcmVGbikge1xuICAgICAgICAgICAgICAgICAgICByZXN0b3JlRm4oKTtcbiAgICAgICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgICAgICB0aGlzLm5vZGUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5leHBycyA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmV4cHJGbnMgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVGbnMgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5leHByT2xkVmFsdWVzID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMucmVzdG9yZUZucyA9IG51bGw7XG5cbiAgICAgICAgICAgIFBhcnNlci5wcm90b3R5cGUuZGVzdHJveS5jYWxsKHRoaXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDoioLngrnigJzpmpDol4/igJ3otbfmnaVcbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKi9cbiAgICAgICAgZ29EYXJrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB1dGlscy5nb0RhcmsodGhpcy5ub2RlKTtcbiAgICAgICAgICAgIHRoaXMuaXNHb0RhcmsgPSB0cnVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDlnKhtb2RlbOWPkeeUn+aUueWPmOeahOaXtuWAmeiuoeeul+S4gOS4i+ihqOi+vuW8j+eahOWAvC0+6ISP5qOA5rWLLT7mm7TmlrDnlYzpnaLjgIJcbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKi9cbiAgICAgICAgb25DaGFuZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzR29EYXJrKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZXhwcnMgPSB0aGlzLmV4cHJzO1xuICAgICAgICAgICAgdmFyIGV4cHJPbGRWYWx1ZXMgPSB0aGlzLmV4cHJPbGRWYWx1ZXM7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaWwgPSBleHBycy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGV4cHIgPSBleHByc1tpXTtcbiAgICAgICAgICAgICAgICB2YXIgZXhwclZhbHVlID0gdGhpcy5leHByRm5zW2V4cHJdKHRoaXMuc2NvcGVNb2RlbCk7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kaXJ0eUNoZWNrKGV4cHIsIGV4cHJWYWx1ZSwgZXhwck9sZFZhbHVlc1tleHByXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHVwZGF0ZUZucyA9IHRoaXMudXBkYXRlRm5zW2V4cHJdO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMCwgamwgPSB1cGRhdGVGbnMubGVuZ3RoOyBqIDwgamw7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlRm5zW2pdKGV4cHJWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBleHByT2xkVmFsdWVzW2V4cHJdID0gZXhwclZhbHVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBQYXJzZXIucHJvdG90eXBlLm9uQ2hhbmdlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiKgueCueKAnOaYvuekuuKAneWHuuadpVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqL1xuICAgICAgICByZXN0b3JlRnJvbURhcms6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHV0aWxzLnJlc3RvcmVGcm9tRGFyayh0aGlzLm5vZGUpO1xuICAgICAgICAgICAgdGhpcy5pc0dvRGFyayA9IGZhbHNlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmoLnmja5ET03oioLngrnnmoTlsZ7mgKflkI3lrZfmi7/liLDkuIDkuKrku7vliqFpZOOAglxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICAqIEBwYXJhbSAge3N0cmluZ30gYXR0ck5hbWUg5bGe5oCn5ZCN5a2XXG4gICAgICAgICAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAg5Lu75YqhaWRcbiAgICAgICAgICovXG4gICAgICAgIGdldFRhc2tJZDogZnVuY3Rpb24gKGF0dHJOYW1lKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuYXR0clRvRG9tVGFza0lkTWFwW2F0dHJOYW1lXSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYXR0clRvRG9tVGFza0lkTWFwW2F0dHJOYW1lXSA9IHRoaXMuZG9tVXBkYXRlci5nZW5lcmF0ZVRhc2tJZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXR0clRvRG9tVGFza0lkTWFwW2F0dHJOYW1lXTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6K6+572u5b2T5YmN6IqC54K555qE5bGe5oCnXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwdWJsaWNcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUg5bGe5oCn5ZCNXG4gICAgICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUg5bGe5oCn5YC8XG4gICAgICAgICAqL1xuICAgICAgICBzZXRBdHRyOiBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIHZhciB0YXNrSWQgPSB0aGlzLmdldFRhc2tJZCgpO1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMuZG9tVXBkYXRlci5hZGRUYXNrRm4odGFza0lkLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgRG9tVXBkYXRlci5zZXRBdHRyKG1lLm5vZGUsIG5hbWUsIHZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5blsZ7mgKdcbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IG5hbWUg5bGe5oCn5ZCNXG4gICAgICAgICAqIEByZXR1cm4geyp9ICAgICAg5bGe5oCn5YC8XG4gICAgICAgICAqL1xuICAgICAgICBnZXRBdHRyOiBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIERvbVVwZGF0ZXIuZ2V0QXR0cih0aGlzLm5vZGUsIG5hbWUpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWIpOaWreiKgueCueaYr+WQpuaYr+W6lOivpeeUseW9k+WJjeWkhOeQhuWZqOadpeWkhOeQhlxuICAgICAgICAgKlxuICAgICAgICAgKiBAc3RhdGljXG4gICAgICAgICAqIEBwYXJhbSAge05vZGV9ICBub2RlIOiKgueCuVxuICAgICAgICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgICAgICAgKi9cbiAgICAgICAgaXNQcm9wZXJOb2RlOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgcmV0dXJuIG5vZGUubm9kZVR5cGUgPT09IDEgfHwgbm9kZS5ub2RlVHlwZSA9PT0gMztcbiAgICAgICAgfSxcblxuICAgICAgICAkbmFtZTogJ0V4cHJQYXJzZXInXG4gICAgfVxuKTtcblxuVHJlZS5yZWdpc3RlUGFyc2VyKG1vZHVsZS5leHBvcnRzKTtcblxuLyoqXG4gKiDliJvlu7pET03oioLngrnlsZ7mgKfmm7TmlrDlh73mlbBcbiAqXG4gKiBAaW5uZXJcbiAqIEBwYXJhbSB7bnVtYmVyfSB0YXNrSWQgZG9t5Lu75YqhaWRcbiAqIEBwYXJhbSAge05vZGV9IG5vZGUgICAgRE9N5Lit55qE6IqC54K5XG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSDopoHmm7TmlrDnmoTlsZ7mgKflkI1cbiAqIEBwYXJhbSAge0RvbVVwZGF0ZXJ9IGRvbVVwZGF0ZXIgRE9N5pu05paw5ZmoXG4gKiBAcmV0dXJuIHtmdW5jdGlvbihPYmplY3QpfSAgICAgIOabtOaWsOWHveaVsFxuICovXG5mdW5jdGlvbiBjcmVhdGVBdHRyVXBkYXRlRm4odGFza0lkLCBub2RlLCBuYW1lLCBkb21VcGRhdGVyKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChleHByVmFsdWUpIHtcbiAgICAgICAgZG9tVXBkYXRlci5hZGRUYXNrRm4oXG4gICAgICAgICAgICB0YXNrSWQsXG4gICAgICAgICAgICB1dGlscy5iaW5kKGZ1bmN0aW9uIChub2RlLCBuYW1lLCBleHByVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBEb21VcGRhdGVyLnNldEF0dHIobm9kZSwgbmFtZSwgZXhwclZhbHVlKTtcbiAgICAgICAgICAgIH0sIG51bGwsIG5vZGUsIG5hbWUsIGV4cHJWYWx1ZSlcbiAgICAgICAgKTtcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBhZGRFeHByKHBhcnNlciwgZXhwciwgdXBkYXRlRm4pIHtcbiAgICBwYXJzZXIuZXhwcnMucHVzaChleHByKTtcbiAgICBpZiAoIXBhcnNlci5leHByRm5zW2V4cHJdKSB7XG4gICAgICAgIHBhcnNlci5leHByRm5zW2V4cHJdID0gY3JlYXRlRXhwckZuKHBhcnNlciwgZXhwcik7XG4gICAgfVxuICAgIHBhcnNlci51cGRhdGVGbnNbZXhwcl0gPSBwYXJzZXIudXBkYXRlRm5zW2V4cHJdIHx8IFtdO1xuICAgIHBhcnNlci51cGRhdGVGbnNbZXhwcl0ucHVzaCh1cGRhdGVGbik7XG59XG5cbi8qKlxuICog5Yib5bu65qC55o2uc2NvcGVNb2RlbOiuoeeul+ihqOi+vuW8j+WAvOeahOWHveaVsFxuICpcbiAqIEBpbm5lclxuICogQHBhcmFtICB7UGFyc2VyfSBwYXJzZXIg6Kej5p6Q5Zmo5a6e5L6LXG4gKiBAcGFyYW0gIHtzdHJpbmd9IGV4cHIgICDlkKvmnInooajovr7lvI/nmoTlrZfnrKbkuLJcbiAqIEByZXR1cm4ge2Z1bmN0aW9uKFNjb3BlKToqfVxuICovXG5mdW5jdGlvbiBjcmVhdGVFeHByRm4ocGFyc2VyLCBleHByKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChzY29wZU1vZGVsKSB7XG4gICAgICAgIC8vIOatpOWkhOimgeWIhuS4pOenjeaDheWGte+8mlxuICAgICAgICAvLyAx44CBZXhwcuW5tuS4jeaYr+e6r+ato+eahOihqOi+vuW8j++8jOWmgmA9PSR7bmFtZX09PWDjgIJcbiAgICAgICAgLy8gMuOAgWV4cHLmmK/nuq/mraPnmoTooajovr7lvI/vvIzlpoJgJHtuYW1lfWDjgIJcbiAgICAgICAgLy8g5a+55LqO5LiN57qv5q2j6KGo6L6+5byP55qE5oOF5Ya177yM5q2k5aSE55qE6L+U5Zue5YC86IKv5a6a5piv5a2X56ym5Liy77ybXG4gICAgICAgIC8vIOiAjOWvueS6jue6r+ato+eahOihqOi+vuW8j++8jOatpOWkhOWwseS4jeimgeWwhuWFtui9rOaNouaIkOWtl+espuS4suW9ouW8j+S6huOAglxuXG4gICAgICAgIHZhciByZWdFeHAgPSBwYXJzZXIuY29uZmlnLmdldEV4cHJSZWdFeHAoKTtcblxuICAgICAgICB2YXIgcG9zc2libGVFeHByQ291bnQgPSBleHByLm1hdGNoKG5ldyBSZWdFeHAodXRpbHMucmVnRXhwRW5jb2RlKHBhcnNlci5jb25maWcuZXhwclByZWZpeCksICdnJykpO1xuICAgICAgICBwb3NzaWJsZUV4cHJDb3VudCA9IHBvc3NpYmxlRXhwckNvdW50ID8gcG9zc2libGVFeHByQ291bnQubGVuZ3RoIDogMDtcblxuICAgICAgICAvLyDkuI3nuq/mraNcbiAgICAgICAgaWYgKHBvc3NpYmxlRXhwckNvdW50ICE9PSAxIHx8IGV4cHIucmVwbGFjZShyZWdFeHAsICcnKSkge1xuICAgICAgICAgICAgcmV0dXJuIGV4cHIucmVwbGFjZShyZWdFeHAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBwYXJzZXIuZXhwckNhbGN1bGF0ZXIuY3JlYXRlRXhwckZuKGFyZ3VtZW50c1sxXSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlci5leHByQ2FsY3VsYXRlci5jYWxjdWxhdGUoYXJndW1lbnRzWzFdLCBmYWxzZSwgc2NvcGVNb2RlbCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOe6r+ato1xuICAgICAgICB2YXIgcHVyZUV4cHIgPSBleHByLnNsaWNlKHBhcnNlci5jb25maWcuZXhwclByZWZpeC5sZW5ndGgsIC1wYXJzZXIuY29uZmlnLmV4cHJTdWZmaXgubGVuZ3RoKTtcbiAgICAgICAgcGFyc2VyLmV4cHJDYWxjdWxhdGVyLmNyZWF0ZUV4cHJGbihwdXJlRXhwcik7XG4gICAgICAgIHJldHVybiBwYXJzZXIuZXhwckNhbGN1bGF0ZXIuY2FsY3VsYXRlKHB1cmVFeHByLCBmYWxzZSwgc2NvcGVNb2RlbCk7XG4gICAgfTtcbn1cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdnRwbC9zcmMvcGFyc2Vycy9FeHByUGFyc2VyLmpzXG4gKiogbW9kdWxlIGlkID0gMjVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDJcbiAqKi8iLCJ2YXIgVHJlZSA9IHJlcXVpcmUoJ3Z0cGwvc3JjL3RyZWVzL1RyZWUnKTtcbnZhciBFdmVudCA9IHJlcXVpcmUoJ3Z0cGwvc3JjL0V2ZW50Jyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCd2dHBsL3NyYy91dGlscycpO1xudmFyIENvbXBvbmVudE1hbmFnZXIgPSByZXF1aXJlKCcuL0NvbXBvbmVudE1hbmFnZXInKTtcblxubW9kdWxlLmV4cG9ydHMgPSBUcmVlLmV4dGVuZHMoe1xuXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgVHJlZS5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgICAgIHRoaXMuY29tcG9uZW50RXZlbnQgPSBuZXcgRXZlbnQoKTtcbiAgICAgICAgaWYgKG9wdGlvbnMuY29tcG9uZW50Q2hpbGRyZW4pIHtcbiAgICAgICAgICAgIHRoaXMuc2V0VHJlZVZhcignY29tcG9uZW50Q2hpbGRyZW4nLCBvcHRpb25zLmNvbXBvbmVudENoaWxkcmVuKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjb21wb25lbnRNYW5hZ2VyID0gbmV3IENvbXBvbmVudE1hbmFnZXIoKTtcbiAgICAgICAgY29tcG9uZW50TWFuYWdlci5zZXRQYXJlbnQodGhpcy5nZXRUcmVlVmFyKCdjb21wb25lbnRNYW5hZ2VyJykpO1xuICAgICAgICB0aGlzLnNldFRyZWVWYXIoJ2NvbXBvbmVudE1hbmFnZXInLCBjb21wb25lbnRNYW5hZ2VyKTtcbiAgICB9LFxuXG4gICAgc2V0UGFyZW50OiBmdW5jdGlvbiAocGFyZW50VHJlZSkge1xuICAgICAgICBUcmVlLnByb3RvdHlwZS5zZXRQYXJlbnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgICAgICBwYXJlbnRUcmVlLnJvb3RTY29wZS5hZGRDaGlsZCh0aGlzLnJvb3RTY29wZSk7XG4gICAgICAgIHRoaXMucm9vdFNjb3BlLnNldFBhcmVudChwYXJlbnRUcmVlLnJvb3RTY29wZSk7XG4gICAgfSxcblxuICAgIGNyZWF0ZVBhcnNlcjogZnVuY3Rpb24gKFBhcnNlckNsYXNzLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBpbnN0YW5jZSA9IFRyZWUucHJvdG90eXBlLmNyZWF0ZVBhcnNlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog5rOo5YaM57uE5Lu257G7XG4gICAgICog6K6+572u57uR5a6a5Zyo5qCR5LiK6Z2i55qE6aKd5aSW5Y+Y6YeP44CC6L+Z5Lqb5Y+Y6YeP5pyJ5aaC5LiL54m55oCn77yaXG4gICAgICogMeOAgeaXoOazleimhueblu+8m1xuICAgICAqIDLjgIHlnKjojrflj5Z0cmVlVmFyc+S4iumdouafkOS4quWPmOmHj+eahOaXtuWAme+8jOWmguaenOW9k+WJjeagkeWPluWHuuadpeaYr3VuZGVmaW5lZO+8jOmCo+S5iOWwseS8muWIsOeItue6p+agkeeahHRyZWVWYXJz5LiK5Y675om+77yM5Lul5q2k57G75o6o44CCXG4gICAgICpcbiAgICAgKiBAcHVibGljXG4gICAgICogQHBhcmFtICB7TWFwLjxzdHJpbmcsIENvbXBvbmVudD59IGNvbXBvbmVudENsYXNzZXMg57uE5Lu25ZCN5ZKM57uE5Lu257G755qE5pig5bCEXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgIOWPmOmHj+WQjVxuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUg5Y+Y6YeP5YC8XG4gICAgICovXG4gICAgcmVnaXN0ZUNvbXBvbmVudHM6IGZ1bmN0aW9uIChjb21wb25lbnRDbGFzc2VzKSB7XG4gICAgICAgIGlmICghdXRpbHMuaXNBcnJheShjb21wb25lbnRDbGFzc2VzKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNvbXBvbmVudE1hbmFnZXIgPSB0aGlzLmdldFRyZWVWYXIoJ2NvbXBvbmVudE1hbmFnZXInKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgaWwgPSBjb21wb25lbnRDbGFzc2VzLmxlbmd0aDsgaSA8IGlsOyArK2kpIHtcbiAgICAgICAgICAgIHZhciBjb21wb25lbnRDbGFzcyA9IGNvbXBvbmVudENsYXNzZXNbaV07XG4gICAgICAgICAgICBjb21wb25lbnRNYW5hZ2VyLnJlZ2lzdGUoY29tcG9uZW50Q2xhc3MpO1xuICAgICAgICB9XG4gICAgfVxufSwge1xuICAgICRuYW1lOiAnQ29tcG9uZW50VHJlZSdcbn0pO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92Y29tcG9uZW50L3NyYy9Db21wb25lbnRUcmVlLmpzXG4gKiogbW9kdWxlIGlkID0gMjZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDJcbiAqKi8iLCIvKipcbiAqIEBmaWxlIOe7hOS7tueuoeeQhuOAgkNvbXBvbmVudE1hbmFnZXLkuZ/mmK/mnInlsYLnuqflhbPns7vnmoTvvIxcbiAqICAgICAgIFRyZWXkuIvpnaLnmoRDb21wb25lbnRNYW5hZ2Vy5rOo5YaM6L+Z5LiqVHJlZeWunuS+i+eUqOWIsOeahENvbXBvbmVudO+8jFxuICogICAgICAg6ICM5ZyoQ29tcG9uZW505Lit5Lmf5Y+v5Lul5rOo5YaM5q2kQ29tcG9uZW5055qEdHBs5Lit5bCG5Lya5L2/55So5Yiw55qEQ29tcG9uZW5044CCXG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20pXG4gKi9cblxudmFyIHV0aWxzID0gcmVxdWlyZSgndnRwbC9zcmMvdXRpbHMnKTtcblxuZnVuY3Rpb24gQ29tcG9uZW50TWFuYWdlcigpIHtcbiAgICB0aGlzLmNvbXBvbmVudHMgPSB7fTtcbn1cblxuLyoqXG4gKiDms6jlhoznu4Tku7bjgIJcbiAqXG4gKiBAcHVibGljXG4gKiBAcGFyYW0gIHtDb25zdHJ1Y3Rvcn0gQ29tcG9uZW50Q2xhc3Mg57uE5Lu257G7XG4gKiBAcGFyYW0gIHtzdHJpbmc9fSBuYW1lICAgICAgICAgICDnu4Tku7blkI3vvIzlj6/pgIlcbiAqL1xuQ29tcG9uZW50TWFuYWdlci5wcm90b3R5cGUucmVnaXN0ZSA9IGZ1bmN0aW9uIChDb21wb25lbnRDbGFzcykge1xuICAgIHZhciBuYW1lID0gQ29tcG9uZW50Q2xhc3MuJG5hbWU7XG4gICAgdGhpcy5jb21wb25lbnRzW25hbWVdID0gQ29tcG9uZW50Q2xhc3M7XG4gICAgdGhpcy5tb3VudFN0eWxlKENvbXBvbmVudENsYXNzKTtcbn07XG5cbi8qKlxuICog5qC55o2u5ZCN5a2X6I635Y+W57uE5Lu257G744CC5Zyo5qih5p2/6Kej5p6Q55qE6L+H56iL5Lit5Lya6LCD55So6L+Z5Liq5pa55rOV44CCXG4gKlxuICogQHB1YmxpY1xuICogQHBhcmFtICB7c3RyaW5nfSBuYW1lIOe7hOS7tuWQjVxuICogQHJldHVybiB7Q29tcG9uZW50Q2xhc3N9ICDnu4Tku7bnsbtcbiAqL1xuQ29tcG9uZW50TWFuYWdlci5wcm90b3R5cGUuZ2V0Q2xhc3MgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHZhciBjb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudHNbbmFtZV07XG4gICAgaWYgKGNvbXBvbmVudCkge1xuICAgICAgICByZXR1cm4gY29tcG9uZW50O1xuICAgIH1cblxuICAgIGlmICh0aGlzLnBhcmVudCkge1xuICAgICAgICBjb21wb25lbnQgPSB0aGlzLnBhcmVudC5nZXRDbGFzcyhuYW1lKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29tcG9uZW50O1xufTtcblxuLyoqXG4gKiDorr7nva7niLbnuqfnu4Tku7bnrqHnkIblmahcbiAqXG4gKiBAcHVibGljXG4gKiBAcGFyYW0ge0NvbXBvbmVudE1hbmdlcn0gY29tcG9uZW50TWFuYWdlciDnu4Tku7bnrqHnkIblmahcbiAqL1xuQ29tcG9uZW50TWFuYWdlci5wcm90b3R5cGUuc2V0UGFyZW50ID0gZnVuY3Rpb24gKGNvbXBvbmVudE1hbmFnZXIpIHtcbiAgICB0aGlzLnBhcmVudCA9IGNvbXBvbmVudE1hbmFnZXI7XG59O1xuXG4vKipcbiAqIOWwhue7hOS7tueahOagt+W8j+aMgui9veS4iuWOu1xuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge+e7hOS7tuexu30gQ29tcG9uZW50Q2xhc3Mg57uE5Lu257G7XG4gKi9cbkNvbXBvbmVudE1hbmFnZXIucHJvdG90eXBlLm1vdW50U3R5bGUgPSBmdW5jdGlvbiAoQ29tcG9uZW50Q2xhc3MpIHtcbiAgICB2YXIgc3R5bGVOb2RlSWQgPSAnY29tcG9uZW50LScgKyBDb21wb25lbnRDbGFzcy4kbmFtZTtcblxuICAgIC8vIOWIpOaWreS4gOS4i++8jOmBv+WFjemHjeWkjea3u+WKoGNzc1xuICAgIGlmICghZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc3R5bGVOb2RlSWQpKSB7XG4gICAgICAgIHZhciBzdHlsZSA9IENvbXBvbmVudENsYXNzLmdldFN0eWxlKCk7XG4gICAgICAgIGlmIChzdHlsZSkge1xuICAgICAgICAgICAgdmFyIHN0eWxlTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgICAgICBzdHlsZU5vZGUuc2V0QXR0cmlidXRlKCdpZCcsIHN0eWxlTm9kZUlkKTtcbiAgICAgICAgICAgIHN0eWxlTm9kZS5pbm5lckhUTUwgPSBzdHlsZS5yZXBsYWNlKFxuICAgICAgICAgICAgICAgIC8jcm9vdCMvZyxcbiAgICAgICAgICAgICAgICAnLicgKyBDb21wb25lbnRNYW5hZ2VyLmdldENzc0NsYXNzTmFtZShDb21wb25lbnRDbGFzcykuam9pbignLicpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZU5vZGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8g5bCG54i257G755qEY3Nz5qC35byP5Lmf5Yqg5LiK5Y6744CC54i257G75b6I5Y+v6IO95rKh5rOo5YaM77yM5aaC5p6c5q2k5aSE5LiN5Yqg5LiK5Y6777yM5qC35byP5Y+v6IO95bCx5Lya57y65LiA5Z2X44CCXG4gICAgaWYgKENvbXBvbmVudENsYXNzLiRuYW1lICE9PSAnQ29tcG9uZW50Jykge1xuICAgICAgICB0aGlzLm1vdW50U3R5bGUoQ29tcG9uZW50Q2xhc3MuJHN1cGVyQ2xhc3MpO1xuICAgIH1cbn07XG5cbi8qKlxuICog6I635Y+W57uE5Lu255qEY3Nz57G75ZCN44CC6KeE5YiZ5piv5qC55o2u57un5om/5YWz57O777yM6L+b6KGM57G75ZCN5ou85o6l77yM5LuO6ICM5L2/5a2Q57uE5Lu257G755qEY3Nz5YW35pyJ5pu06auY5LyY5YWI57qn44CCXG4gKlxuICogQHN0YXRpY1xuICogQHBhcmFtIHtDb25zdHJ1Y3Rvcn0gQ29tcG9uZW50Q2xhc3Mg57uE5Lu257G7XG4gKiBAcmV0dXJuIHtBcnJheS48c3RyaW5nPn0g5ZCI5oiQ57G75ZCN5pWw57uEXG4gKi9cbkNvbXBvbmVudE1hbmFnZXIuZ2V0Q3NzQ2xhc3NOYW1lID0gZnVuY3Rpb24gKENvbXBvbmVudENsYXNzKSB7XG4gICAgdmFyIG5hbWUgPSBbXTtcbiAgICBmb3IgKHZhciBjdXJDbHMgPSBDb21wb25lbnRDbGFzczsgY3VyQ2xzOyBjdXJDbHMgPSBjdXJDbHMuJHN1cGVyQ2xhc3MpIHtcbiAgICAgICAgbmFtZS5wdXNoKHV0aWxzLmNhbWVsMmxpbmUoY3VyQ2xzLiRuYW1lKSk7XG5cbiAgICAgICAgLy8g5pyA5aSa5Yiw57uE5Lu25Z+657G7XG4gICAgICAgIGlmIChjdXJDbHMuJG5hbWUgPT09ICdDb21wb25lbnQnKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmFtZTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBDb21wb25lbnRNYW5hZ2VyO1xuXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Zjb21wb25lbnQvc3JjL0NvbXBvbmVudE1hbmFnZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAyN1xuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMlxuICoqLyIsIi8qKlxuICogQGZpbGUg57uE5Lu255qEIDwhLS0gY2hpbGRyZW4gLS0+IOWunuS+i++8jOiusOW9leebuOWFs+S/oeaBr++8jOaWueS+v+WQjue7rSBDaGlsZHJlbkRpcmVjdGl2ZVBhcnNlciDop6PmnpBcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCd2dHBsL3NyYy91dGlscycpO1xuXG5mdW5jdGlvbiBDb21wb25lbnRDaGlsZHJlbihzdGFydE5vZGUsIGVuZE5vZGUsIHNjb3BlLCBjb21wb25lbnQpIHtcbiAgICB0aGlzLmRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGlmICghc3RhcnROb2RlIHx8ICFlbmROb2RlKSB7XG4gICAgICAgIHRoaXMuZGl2LmlubmVySFRNTCA9ICcnO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdXRpbHMudHJhdmVyc2VOb2RlcyhcbiAgICAgICAgICAgIHN0YXJ0Tm9kZSxcbiAgICAgICAgICAgIGVuZE5vZGUsXG4gICAgICAgICAgICBmdW5jdGlvbiAoY3VyTm9kZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGl2LmFwcGVuZENoaWxkKGN1ck5vZGUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRoaXNcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICB0aGlzLnNjb3BlID0gc2NvcGU7XG4gICAgdGhpcy5jb21wb25lbnQgPSBjb21wb25lbnQ7XG59XG5cbkNvbXBvbmVudENoaWxkcmVuLnByb3RvdHlwZS5nZXRUcGxIdG1sID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmRpdi5pbm5lckhUTUw7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbXBvbmVudENoaWxkcmVuO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92Y29tcG9uZW50L3NyYy9Db21wb25lbnRDaGlsZHJlbi5qc1xuICoqIG1vZHVsZSBpZCA9IDI4XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyXG4gKiovIiwicmVxdWlyZSgnLi9zcmMvcGFyc2Vycy9TY29wZURpcmVjdGl2ZVBhcnNlcicpO1xuXG52YXIgYW1kRXhwb3J0cyA9IHtcbiAgICBDb25maWc6IHJlcXVpcmUoJy4vc3JjL0NvbmZpZycpLFxuICAgIFRyZWU6IHJlcXVpcmUoJy4vc3JjL3RyZWVzL1RyZWUnKSxcbiAgICBEaXJ0eUNoZWNrZXI6IHJlcXVpcmUoJy4vc3JjL0RpcnR5Q2hlY2tlcicpLFxuICAgIFBhcnNlcjogcmVxdWlyZSgnLi9zcmMvcGFyc2Vycy9QYXJzZXInKSxcbiAgICBGb3JEaXJlY3RpdmVQYXJzZXI6IHJlcXVpcmUoJy4vc3JjL3BhcnNlcnMvRm9yRGlyZWN0aXZlUGFyc2VyJyksXG4gICAgSWZEaXJlY3RpdmVQYXJzZXI6IHJlcXVpcmUoJy4vc3JjL3BhcnNlcnMvSWZEaXJlY3RpdmVQYXJzZXInKSxcbiAgICBFdmVudEV4cHJQYXJzZXI6IHJlcXVpcmUoJy4vc3JjL3BhcnNlcnMvRXZlbnRFeHByUGFyc2VyJyksXG4gICAgRXhwclBhcnNlcjogcmVxdWlyZSgnLi9zcmMvcGFyc2Vycy9FeHByUGFyc2VyJyksXG4gICAgRXhwckNhbGN1bGF0ZXI6IHJlcXVpcmUoJy4vc3JjL0V4cHJDYWxjdWxhdGVyJyksXG4gICAgVmFyRGlyZWN0aXZlUGFyc2VyOiByZXF1aXJlKCcuL3NyYy9wYXJzZXJzL1ZhckRpcmVjdGl2ZVBhcnNlcicpLFxuICAgIGluaGVyaXQ6IHJlcXVpcmUoJy4vc3JjL2luaGVyaXQnKSxcbiAgICB1dGlsczogcmVxdWlyZSgnLi9zcmMvdXRpbHMnKSxcbiAgICBEb21VcGRhdGVyOiByZXF1aXJlKCcuL3NyYy9Eb21VcGRhdGVyJyksXG4gICAgU2NvcGVNb2RlbDogcmVxdWlyZSgnLi9zcmMvU2NvcGVNb2RlbCcpXG59O1xuZGVmaW5lKGZ1bmN0aW9uIChyZXF1aXJlLCBleHBvcnRzLCBtb2R1bGUpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGFtZEV4cG9ydHM7XG59KTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdnRwbC9tYWluLmpzXG4gKiogbW9kdWxlIGlkID0gMjlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDJcbiAqKi8iLCIvKipcbiAqIEBmaWxlIHNjb3BlIGRpcmVjdGl2ZSBwYXJzZXJcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG52YXIgRGlyZWN0aXZlUGFyc2VyID0gcmVxdWlyZSgnLi9EaXJlY3RpdmVQYXJzZXInKTtcbnZhciBTY29wZU1vZGVsID0gcmVxdWlyZSgnLi4vU2NvcGVNb2RlbCcpO1xudmFyIFRyZWUgPSByZXF1aXJlKCcuLi90cmVlcy9UcmVlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGlyZWN0aXZlUGFyc2VyLmV4dGVuZHMoXG4gICAge1xuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgRGlyZWN0aXZlUGFyc2VyLnByb3RvdHlwZS5pbml0aWFsaXplLmNhbGwodGhpcywgb3B0aW9ucyk7XG5cbiAgICAgICAgICAgIHRoaXMuc3RhcnROb2RlID0gb3B0aW9ucy5zdGFydE5vZGU7XG4gICAgICAgICAgICB0aGlzLmVuZE5vZGUgPSBvcHRpb25zLmVuZE5vZGU7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy50cmVlLmdldFRyZWVWYXIoJ3Njb3BlcycpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50cmVlLnNldFRyZWVWYXIoJ3Njb3BlcycsIHt9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBzZXRTY29wZTogZnVuY3Rpb24gKHNjb3BlTW9kZWwpIHtcbiAgICAgICAgICAgIHRoaXMuc2NvcGVNb2RlbC5zZXRQYXJlbnQoc2NvcGVNb2RlbCk7XG4gICAgICAgICAgICBzY29wZU1vZGVsLmFkZENoaWxkKHRoaXMuc2NvcGVNb2RlbCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY29sbGVjdEV4cHJzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgc2NvcGVOYW1lID0gdGhpcy5zdGFydE5vZGUubm9kZVZhbHVlXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xccysvZywgJycpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UodGhpcy5jb25maWcuc2NvcGVOYW1lICsgJzonLCAnJyk7XG4gICAgICAgICAgICBpZiAoc2NvcGVOYW1lKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNjb3BlcyA9IHRoaXMudHJlZS5nZXRUcmVlVmFyKCdzY29wZXMnKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNjb3BlTW9kZWwgPSBuZXcgU2NvcGVNb2RlbCgpO1xuICAgICAgICAgICAgICAgIHNjb3Blc1tzY29wZU5hbWVdID0gc2NvcGVzW3Njb3BlTmFtZV0gfHwgW107XG4gICAgICAgICAgICAgICAgc2NvcGVzW3Njb3BlTmFtZV0ucHVzaCh0aGlzLnNjb3BlTW9kZWwpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnROb2RlOiB0aGlzLnN0YXJ0Tm9kZS5uZXh0U2libGluZyxcbiAgICAgICAgICAgICAgICAgICAgZW5kTm9kZTogdGhpcy5lbmROb2RlLnByZXZpb3VzU2libGluZ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF07XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgaXNQcm9wZXJOb2RlOiBmdW5jdGlvbiAobm9kZSwgY29uZmlnKSB7XG4gICAgICAgICAgICByZXR1cm4gRGlyZWN0aXZlUGFyc2VyLmlzUHJvcGVyTm9kZShub2RlLCBjb25maWcpXG4gICAgICAgICAgICAgICAgJiYgbm9kZS5ub2RlVmFsdWUucmVwbGFjZSgvXFxzKy8sICcnKS5pbmRleE9mKGNvbmZpZy5zY29wZU5hbWUgKyAnOicpID09PSAwO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZpbmRFbmROb2RlOiBmdW5jdGlvbiAoc3RhcnROb2RlLCBjb25maWcpIHtcbiAgICAgICAgICAgIHZhciBjdXJOb2RlID0gc3RhcnROb2RlO1xuICAgICAgICAgICAgd2hpbGUgKChjdXJOb2RlID0gY3VyTm9kZS5uZXh0U2libGluZykpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNFbmROb2RlKGN1ck5vZGUsIGNvbmZpZykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN1ck5vZGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGdldE5vRW5kTm9kZUVycm9yOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKCd0aGUgc2NvcGUgZGlyZWN0aXZlIGlzIG5vdCBwcm9wZXJseSBlbmRlZCEnKTtcbiAgICAgICAgfSxcblxuICAgICAgICAkbmFtZTogJ1Njb3BlRGlyZWN0aXZlUGFyc2VyJ1xuICAgIH1cbik7XG5cblRyZWUucmVnaXN0ZVBhcnNlcihtb2R1bGUuZXhwb3J0cyk7XG5cbmZ1bmN0aW9uIGlzRW5kTm9kZShub2RlLCBjb25maWcpIHtcbiAgICByZXR1cm4gbm9kZS5ub2RlVHlwZSA9PT0gOFxuICAgICAgICAmJiBub2RlLm5vZGVWYWx1ZS5yZXBsYWNlKC9cXHMrL2csICcnKSA9PT0gY29uZmlnLnNjb3BlRW5kTmFtZTtcbn1cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdnRwbC9zcmMvcGFyc2Vycy9TY29wZURpcmVjdGl2ZVBhcnNlci5qc1xuICoqIG1vZHVsZSBpZCA9IDMwXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyXG4gKiovIiwiLyoqXG4gKiBAZmlsZSDphY3nva5cbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG5mdW5jdGlvbiBDb25maWcoKSB7XG4gICAgdGhpcy5leHByUHJlZml4ID0gJyR7JztcbiAgICB0aGlzLmV4cHJTdWZmaXggPSAnfSc7XG5cbiAgICB0aGlzLmlmTmFtZSA9ICdpZic7XG4gICAgdGhpcy5lbGlmTmFtZSA9ICdlbGlmJztcbiAgICB0aGlzLmVsc2VOYW1lID0gJ2Vsc2UnO1xuICAgIHRoaXMuaWZFbmROYW1lID0gJy9pZic7XG5cbiAgICB0aGlzLmlmUHJlZml4UmVnRXhwID0gL15cXHMqaWY6XFxzKi87XG4gICAgdGhpcy5lbGlmUHJlZml4UmVnRXhwID0gL15cXHMqZWxpZjpcXHMqLztcbiAgICB0aGlzLmVsc2VQcmVmaXhSZWdFeHAgPSAvXlxccyplbHNlXFxzKi87XG4gICAgdGhpcy5pZkVuZFByZWZpeFJlZ0V4cCA9IC9eXFxzKlxcL2lmXFxzKi87XG5cbiAgICB0aGlzLmZvck5hbWUgPSAnZm9yJztcbiAgICB0aGlzLmZvckVuZE5hbWUgPSAnL2Zvcic7XG5cbiAgICB0aGlzLmZvclByZWZpeFJlZ0V4cCA9IC9eXFxzKmZvcjpcXHMqLztcbiAgICB0aGlzLmZvckVuZFByZWZpeFJlZ0V4cCA9IC9eXFxzKlxcL2ZvclxccyovO1xuXG4gICAgdGhpcy5ldmVudFByZWZpeCA9ICdldmVudCc7XG5cbiAgICB0aGlzLnZhck5hbWUgPSAndmFyJztcblxuICAgIHRoaXMuc2NvcGVOYW1lID0gJ3Njb3BlJztcbiAgICB0aGlzLnNjb3BlRW5kTmFtZSA9ICcvc2NvcGUnO1xufVxuXG5Db25maWcucHJvdG90eXBlLnNldEV4cHJQcmVmaXggPSBmdW5jdGlvbiAocHJlZml4KSB7XG4gICAgdGhpcy5leHByUHJlZml4ID0gcHJlZml4O1xufTtcblxuQ29uZmlnLnByb3RvdHlwZS5zZXRFeHByU3VmZml4ID0gZnVuY3Rpb24gKHN1ZmZpeCkge1xuICAgIHRoaXMuZXhwclN1ZmZpeCA9IHN1ZmZpeDtcbn07XG5cbkNvbmZpZy5wcm90b3R5cGUuZ2V0RXhwclJlZ0V4cCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuZXhwclJlZ0V4cCkge1xuICAgICAgICB0aGlzLmV4cHJSZWdFeHAgPSBuZXcgUmVnRXhwKHJlZ0V4cEVuY29kZSh0aGlzLmV4cHJQcmVmaXgpICsgJyguKz8pJyArIHJlZ0V4cEVuY29kZSh0aGlzLmV4cHJTdWZmaXgpLCAnZycpO1xuICAgIH1cbiAgICB0aGlzLmV4cHJSZWdFeHAubGFzdEluZGV4ID0gMDtcbiAgICByZXR1cm4gdGhpcy5leHByUmVnRXhwO1xufTtcblxuQ29uZmlnLnByb3RvdHlwZS5nZXRBbGxJZlJlZ0V4cCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuYWxsSWZSZWdFeHApIHtcbiAgICAgICAgdGhpcy5hbGxJZlJlZ0V4cCA9IG5ldyBSZWdFeHAoJ1xcXFxzKignXG4gICAgICAgICAgICArIHRoaXMuaWZOYW1lICsgJ3wnXG4gICAgICAgICAgICArIHRoaXMuZWxpZk5hbWUgKyAnfCdcbiAgICAgICAgICAgICsgdGhpcy5lbHNlTmFtZSArICd8J1xuICAgICAgICAgICAgKyB0aGlzLmlmRW5kTmFtZSArICcpOlxcXFxzKicsICdnJyk7XG4gICAgfVxuICAgIHRoaXMuYWxsSWZSZWdFeHAubGFzdEluZGV4ID0gMDtcbiAgICByZXR1cm4gdGhpcy5hbGxJZlJlZ0V4cDtcbn07XG5cbkNvbmZpZy5wcm90b3R5cGUuc2V0SWZOYW1lID0gZnVuY3Rpb24gKGlmTmFtZSkge1xuICAgIHRoaXMuaWZOYW1lID0gaWZOYW1lO1xuICAgIHRoaXMuaWZQcmVmaXhSZWdFeHAgPSBuZXcgUmVnRXhwKCdeXFxcXHMqJyArIGlmTmFtZSArICc6XFxcXHMqJyk7XG59O1xuXG5Db25maWcucHJvdG90eXBlLnNldEVsaWZOYW1lID0gZnVuY3Rpb24gKGVsaWZOYW1lKSB7XG4gICAgdGhpcy5lbGlmTmFtZSA9IGVsaWZOYW1lO1xuICAgIHRoaXMuZWxpZlByZWZpeFJlZ0V4cCA9IG5ldyBSZWdFeHAoJ15cXFxccyonICsgZWxpZk5hbWUgKyAnOlxcXFxzKicpO1xufTtcblxuQ29uZmlnLnByb3RvdHlwZS5zZXRFbHNlTmFtZSA9IGZ1bmN0aW9uIChlbHNlTmFtZSkge1xuICAgIHRoaXMuZWxzZU5hbWUgPSBlbHNlTmFtZTtcbiAgICB0aGlzLmVsc2VQcmVmaXhSZWdFeHAgPSBuZXcgUmVnRXhwKCdeXFxcXHMqJyArIGVsc2VOYW1lICsgJ1xcXFxzKicpO1xufTtcblxuQ29uZmlnLnByb3RvdHlwZS5zZXRJZkVuZE5hbWUgPSBmdW5jdGlvbiAoaWZFbmROYW1lKSB7XG4gICAgdGhpcy5pZkVuZE5hbWUgPSBpZkVuZE5hbWU7XG4gICAgdGhpcy5pZkVuZFByZWZpeFJlZ0V4cCA9IG5ldyBSZWdFeHAoJ15cXFxccyonICsgaWZFbmROYW1lICsgJ1xcXFxzKicpO1xufTtcblxuQ29uZmlnLnByb3RvdHlwZS5zZXRGb3JOYW1lID0gZnVuY3Rpb24gKGZvck5hbWUpIHtcbiAgICB0aGlzLmZvck5hbWUgPSBmb3JOYW1lO1xuICAgIHRoaXMuZm9yUHJlZml4UmVnRXhwID0gbmV3IFJlZ0V4cCgnXlxcXFxzKicgKyBmb3JOYW1lICsgJzpcXFxccyonKTtcbn07XG5cbkNvbmZpZy5wcm90b3R5cGUuc2V0Rm9yRW5kTmFtZSA9IGZ1bmN0aW9uIChmb3JFbmROYW1lKSB7XG4gICAgdGhpcy5mb3JFbmROYW1lID0gZm9yRW5kTmFtZTtcbiAgICB0aGlzLmZvckVuZFByZWZpeFJlZ0V4cCA9IG5ldyBSZWdFeHAoJ15cXFxccyonICsgZm9yRW5kTmFtZSArICdcXFxccyonKTtcbn07XG5cbkNvbmZpZy5wcm90b3R5cGUuZ2V0Rm9yRXhwcnNSZWdFeHAgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLmZvckV4cHJzUmVnRXhwKSB7XG4gICAgICAgIHRoaXMuZm9yRXhwcnNSZWdFeHAgPSBuZXcgUmVnRXhwKCdcXFxccyonXG4gICAgICAgICAgICArIHRoaXMuZm9yTmFtZVxuICAgICAgICAgICAgKyAnOlxcXFxzKidcbiAgICAgICAgICAgICsgcmVnRXhwRW5jb2RlKHRoaXMuZXhwclByZWZpeClcbiAgICAgICAgICAgICsgJyhbXicgKyByZWdFeHBFbmNvZGUodGhpcy5leHByU3VmZml4KVxuICAgICAgICAgICAgKyAnXSspJyArIHJlZ0V4cEVuY29kZSh0aGlzLmV4cHJTdWZmaXgpKTtcbiAgICB9XG4gICAgdGhpcy5mb3JFeHByc1JlZ0V4cC5sYXN0SW5kZXggPSAwO1xuICAgIHJldHVybiB0aGlzLmZvckV4cHJzUmVnRXhwO1xufTtcblxuQ29uZmlnLnByb3RvdHlwZS5nZXRGb3JJdGVtVmFsdWVOYW1lUmVnRXhwID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5mb3JJdGVtVmFsdWVOYW1lUmVnRXhwKSB7XG4gICAgICAgIHRoaXMuZm9ySXRlbVZhbHVlTmFtZVJlZ0V4cCA9IG5ldyBSZWdFeHAoXG4gICAgICAgICAgICAnYXNcXFxccyonICsgcmVnRXhwRW5jb2RlKHRoaXMuZXhwclByZWZpeClcbiAgICAgICAgICAgICsgJyhbXicgKyByZWdFeHBFbmNvZGUodGhpcy5leHByU3VmZml4KSArICddKyknXG4gICAgICAgICAgICArIHJlZ0V4cEVuY29kZSh0aGlzLmV4cHJTdWZmaXgpXG4gICAgICAgICk7XG4gICAgfVxuICAgIHRoaXMuZm9ySXRlbVZhbHVlTmFtZVJlZ0V4cC5sYXN0SW5kZXggPSAwO1xuICAgIHJldHVybiB0aGlzLmZvckl0ZW1WYWx1ZU5hbWVSZWdFeHA7XG59O1xuXG5Db25maWcucHJvdG90eXBlLnNldEV2ZW50UHJlZml4ID0gZnVuY3Rpb24gKHByZWZpeCkge1xuICAgIHRoaXMuZXZlbnRQcmVmaXggPSBwcmVmaXg7XG59O1xuXG5Db25maWcucHJvdG90eXBlLnNldFZhck5hbWUgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRoaXMudmFyTmFtZSA9IG5hbWU7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbmZpZztcblxuZnVuY3Rpb24gcmVnRXhwRW5jb2RlKHN0cikge1xuICAgIHJldHVybiAnXFxcXCcgKyBzdHIuc3BsaXQoJycpLmpvaW4oJ1xcXFwnKTtcbn1cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdnRwbC9zcmMvQ29uZmlnLmpzXG4gKiogbW9kdWxlIGlkID0gMzFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDJcbiAqKi8iLCIvKipcbiAqIEBmaWxlIOiEj+ajgOa1i+WZqFxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbmZ1bmN0aW9uIERpcnR5Q2hlY2tlcigpIHtcbiAgICB0aGlzLmNoZWNrZXJzID0ge307XG59XG5cbkRpcnR5Q2hlY2tlci5wcm90b3R5cGUuc2V0Q2hlY2tlciA9IGZ1bmN0aW9uIChleHByLCBjaGVja2VyRm4pIHtcbiAgICB0aGlzLmNoZWNrZXJzW2V4cHJdID0gY2hlY2tlckZuO1xufTtcblxuRGlydHlDaGVja2VyLnByb3RvdHlwZS5nZXRDaGVja2VyID0gZnVuY3Rpb24gKGV4cHIpIHtcbiAgICByZXR1cm4gdGhpcy5jaGVja2Vyc1tleHByXTtcbn07XG5cbkRpcnR5Q2hlY2tlci5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmNoZWNrZXJzID0gbnVsbDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRGlydHlDaGVja2VyO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL3NyYy9EaXJ0eUNoZWNrZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAzMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMlxuICoqLyIsIi8qKlxuICogQGZpbGUg5Y+Y6YeP5a6a5LmJ5oyH5Luk6Kej5p6Q5ZmoXG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20pXG4gKi9cblxudmFyIERpcmVjdGl2ZVBhcnNlciA9IHJlcXVpcmUoJy4vRGlyZWN0aXZlUGFyc2VyJyk7XG52YXIgVHJlZSA9IHJlcXVpcmUoJy4uL3RyZWVzL1RyZWUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBEaXJlY3RpdmVQYXJzZXIuZXh0ZW5kcyhcbiAgICB7XG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgICBEaXJlY3RpdmVQYXJzZXIucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgICAgICAgICAgdGhpcy5ub2RlID0gb3B0aW9ucy5ub2RlO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNvbGxlY3RFeHByczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGV4cHIgPSB0aGlzLm5vZGUubm9kZVZhbHVlLnJlcGxhY2UodGhpcy5jb25maWcudmFyTmFtZSArICc6JywgJycpO1xuICAgICAgICAgICAgdGhpcy5leHByQ2FsY3VsYXRlci5jcmVhdGVFeHByRm4oZXhwcik7XG5cbiAgICAgICAgICAgIHZhciBsZWZ0VmFsdWVOYW1lID0gZXhwci5tYXRjaCgvXFxzKi4rKD89XFw9KS8pWzBdLnJlcGxhY2UoL1xccysvZywgJycpO1xuXG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5leHByRm4gPSBmdW5jdGlvbiAoc2NvcGVNb2RlbCkge1xuICAgICAgICAgICAgICAgIHZhciBvbGRWYWx1ZSA9IHNjb3BlTW9kZWwuZ2V0KGxlZnRWYWx1ZU5hbWUpO1xuICAgICAgICAgICAgICAgIHZhciBuZXdWYWx1ZSA9IG1lLmV4cHJDYWxjdWxhdGVyLmNhbGN1bGF0ZShleHByLCBmYWxzZSwgc2NvcGVNb2RlbCk7XG4gICAgICAgICAgICAgICAgaWYgKG9sZFZhbHVlICE9PSBuZXdWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBzY29wZU1vZGVsLnNldChsZWZ0VmFsdWVOYW1lLCBuZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRTY29wZTogZnVuY3Rpb24gKHNjb3BlTW9kZWwpIHtcbiAgICAgICAgICAgIERpcmVjdGl2ZVBhcnNlci5wcm90b3R5cGUuc2V0U2NvcGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIHRoaXMuZXhwckZuKHRoaXMuc2NvcGVNb2RlbCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiOt+WPluW8gOWni+iKgueCuVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICAqIEBpbmhlcml0RG9jXG4gICAgICAgICAqIEByZXR1cm4ge05vZGV9XG4gICAgICAgICAqL1xuICAgICAgICBnZXRTdGFydE5vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5vZGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiOt+WPlue7k+adn+iKgueCuVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICAqIEBpbmhlcml0RG9jXG4gICAgICAgICAqIEByZXR1cm4ge05vZGV9XG4gICAgICAgICAqL1xuICAgICAgICBnZXRFbmROb2RlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ub2RlO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICAgIGlzUHJvcGVyTm9kZTogZnVuY3Rpb24gKG5vZGUsIGNvbmZpZykge1xuICAgICAgICAgICAgcmV0dXJuIG5vZGUubm9kZVR5cGUgPT09IDhcbiAgICAgICAgICAgICAgICAmJiBub2RlLm5vZGVWYWx1ZS5yZXBsYWNlKC9eXFxzKy8sICcnKS5pbmRleE9mKGNvbmZpZy52YXJOYW1lICsgJzonKSA9PT0gMDtcbiAgICAgICAgfSxcblxuICAgICAgICAkbmFtZTogJ1ZhckRpcmVjdGl2ZVBhcnNlcidcbiAgICB9XG4pO1xuXG5UcmVlLnJlZ2lzdGVQYXJzZXIobW9kdWxlLmV4cG9ydHMpO1xuXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Z0cGwvc3JjL3BhcnNlcnMvVmFyRGlyZWN0aXZlUGFyc2VyLmpzXG4gKiogbW9kdWxlIGlkID0gMzNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDJcbiAqKi8iLCIvKipcbiAqIEBmaWxlIOe7hOS7tuWfuuexu1xuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbnZhciBCYXNlID0gcmVxdWlyZSgndnRwbC9zcmMvQmFzZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhc2UuZXh0ZW5kcyhcbiAgICB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOe7hOS7tuWIneWni+WMllxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICAqL1xuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7fSxcblxuICAgICAgICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gKCkge30sXG5cbiAgICAgICAgY29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbiAoKSB7fSxcblxuICAgICAgICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24gKCkge30sXG5cbiAgICAgICAgcmVmOiBmdW5jdGlvbiAocmVmKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZXIucmVmKHJlZik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOe7hOS7tuaooeadv+OAguWtkOexu+WPr+S7peimhueblui/meS4quWxnuaAp+OAglxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICB0cGw6ICcnLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDplIDmr4FcbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKi9cbiAgICAgICAgZGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5iZWZvcmVEZXN0cm95KCk7XG5cbiAgICAgICAgICAgIHRoaXMuYWZ0ZXJEZXN0cm95KCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0RGF0YTogZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLnBhcnNlci5zZXRBdHRyKG5hbWUsIHZhbHVlKTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXREYXRhOiBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VyLmdldEF0dHIobmFtZSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICog6I635Y+W5qC35byP5a2X56ym5Liy44CCXG4gICAgICAgICAqXG4gICAgICAgICAqIEBzdGF0aWNcbiAgICAgICAgICogQHJldHVybiB7c3RyaW5nfSDmoLflvI/lrZfnrKbkuLJcbiAgICAgICAgICovXG4gICAgICAgIGdldFN0eWxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJG5hbWU6ICdDb21wb25lbnQnXG4gICAgfVxuKTtcblxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92Y29tcG9uZW50L3NyYy9Db21wb25lbnQuanNcbiAqKiBtb2R1bGUgaWQgPSAzNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMlxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCI8YnV0dG9uIGNsYXNzPVxcXCIke2NsYXNzfVxcXCIgZXZlbnQtY2xpY2s9XFxcIiR7b25DbGljayhldmVudCl9XFxcIj5cXG4gICAgPCEtLSBjaGlsZHJlbiAtLT5cXG48L2J1dHRvbj5cIjtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL0J1dHRvbi9CdXR0b24udHBsLmh0bWxcbiAqKiBtb2R1bGUgaWQgPSAzNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMlxuICoqLyIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSgpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLmJ1dHRvbixcXG4uYnV0dG9uOmFjdGl2ZSB7XFxuICBiYWNrZ3JvdW5kOiAjZjZmNmY2O1xcbiAgaGVpZ2h0OiAzMHB4O1xcbiAgb3V0bGluZTogbm9uZTtcXG4gIGJvcmRlcjogbm9uZTtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuLmJ1dHRvbjpob3ZlciB7XFxuICBvcGFjaXR5OiAuODtcXG59XFxuLmJ1dHRvbjphY3RpdmUge1xcbiAgb3BhY2l0eTogMTtcXG59XFxuLmJ1dHRvbi5za2luLXByaW1hcnkge1xcbiAgYmFja2dyb3VuZDogIzcwY2NjMDtcXG4gIGNvbG9yOiAjZmZmO1xcbn1cXG4uYnV0dG9uLnNraW4tc3VjY2VzcyB7XFxuICBiYWNrZ3JvdW5kOiAjODBkZGExO1xcbiAgY29sb3I6ICNmZmY7XFxufVxcbi5idXR0b24uc2tpbi1pbmZvIHtcXG4gIGJhY2tncm91bmQ6ICM2YmQ1ZWM7XFxuICBjb2xvcjogI2ZmZjtcXG59XFxuLmJ1dHRvbi5za2luLXdhcm5pbmcge1xcbiAgYmFja2dyb3VuZDogI2Y5YWQ0MjtcXG4gIGNvbG9yOiAjZmZmO1xcbn1cXG4uYnV0dG9uLnNraW4tZGFuZ2VyIHtcXG4gIGJhY2tncm91bmQ6ICNmMTZjNmM7XFxuICBjb2xvcjogI2ZmZjtcXG59XFxuLmJ1dHRvbi5za2luLWxpbmsge1xcbiAgY29sb3I6ICM3MGNjYzA7XFxuICBiYWNrZ3JvdW5kOiBub25lO1xcbn1cXG5cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL0J1dHRvbi9CdXR0b24ubGVzc1xuICoqIG1vZHVsZSBpZCA9IDM2XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyXG4gKiovIiwiLypcclxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxyXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcclxuKi9cclxuLy8gY3NzIGJhc2UgY29kZSwgaW5qZWN0ZWQgYnkgdGhlIGNzcy1sb2FkZXJcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgbGlzdCA9IFtdO1xyXG5cclxuXHQvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXHJcblx0bGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xyXG5cdFx0dmFyIHJlc3VsdCA9IFtdO1xyXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGl0ZW0gPSB0aGlzW2ldO1xyXG5cdFx0XHRpZihpdGVtWzJdKSB7XHJcblx0XHRcdFx0cmVzdWx0LnB1c2goXCJAbWVkaWEgXCIgKyBpdGVtWzJdICsgXCJ7XCIgKyBpdGVtWzFdICsgXCJ9XCIpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJlc3VsdC5wdXNoKGl0ZW1bMV0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0LmpvaW4oXCJcIik7XHJcblx0fTtcclxuXHJcblx0Ly8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcclxuXHRsaXN0LmkgPSBmdW5jdGlvbihtb2R1bGVzLCBtZWRpYVF1ZXJ5KSB7XHJcblx0XHRpZih0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIilcclxuXHRcdFx0bW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgXCJcIl1dO1xyXG5cdFx0dmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcclxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBpZCA9IHRoaXNbaV1bMF07XHJcblx0XHRcdGlmKHR5cGVvZiBpZCA9PT0gXCJudW1iZXJcIilcclxuXHRcdFx0XHRhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XHJcblx0XHR9XHJcblx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBpdGVtID0gbW9kdWxlc1tpXTtcclxuXHRcdFx0Ly8gc2tpcCBhbHJlYWR5IGltcG9ydGVkIG1vZHVsZVxyXG5cdFx0XHQvLyB0aGlzIGltcGxlbWVudGF0aW9uIGlzIG5vdCAxMDAlIHBlcmZlY3QgZm9yIHdlaXJkIG1lZGlhIHF1ZXJ5IGNvbWJpbmF0aW9uc1xyXG5cdFx0XHQvLyAgd2hlbiBhIG1vZHVsZSBpcyBpbXBvcnRlZCBtdWx0aXBsZSB0aW1lcyB3aXRoIGRpZmZlcmVudCBtZWRpYSBxdWVyaWVzLlxyXG5cdFx0XHQvLyAgSSBob3BlIHRoaXMgd2lsbCBuZXZlciBvY2N1ciAoSGV5IHRoaXMgd2F5IHdlIGhhdmUgc21hbGxlciBidW5kbGVzKVxyXG5cdFx0XHRpZih0eXBlb2YgaXRlbVswXSAhPT0gXCJudW1iZXJcIiB8fCAhYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xyXG5cdFx0XHRcdGlmKG1lZGlhUXVlcnkgJiYgIWl0ZW1bMl0pIHtcclxuXHRcdFx0XHRcdGl0ZW1bMl0gPSBtZWRpYVF1ZXJ5O1xyXG5cdFx0XHRcdH0gZWxzZSBpZihtZWRpYVF1ZXJ5KSB7XHJcblx0XHRcdFx0XHRpdGVtWzJdID0gXCIoXCIgKyBpdGVtWzJdICsgXCIpIGFuZCAoXCIgKyBtZWRpYVF1ZXJ5ICsgXCIpXCI7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGxpc3QucHVzaChpdGVtKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH07XHJcblx0cmV0dXJuIGxpc3Q7XHJcbn07XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXG4gKiogbW9kdWxlIGlkID0gMzdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDJcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IFwiPHVpLWJ1dHRvbiBvbi1jbGljaz1cXFwiJHtjbGlja31cXFwiPkJ1dHRvbjwvdWktYnV0dG9uPlxcbjx1aS1idXR0b24gY2xhc3M9XFxcInNraW4tcHJpbWFyeVxcXCI+UHJpbWFyeTwvdWktYnV0dG9uPlxcbjx1aS1idXR0b24gY2xhc3M9XFxcInNraW4tc3VjY2Vzc1xcXCI+U3VjY2VzczwvdWktYnV0dG9uPlxcbjx1aS1idXR0b24gY2xhc3M9XFxcInNraW4taW5mb1xcXCI+SW5mbzwvdWktYnV0dG9uPlxcbjx1aS1idXR0b24gY2xhc3M9XFxcInNraW4td2FybmluZ1xcXCI+V2FybmluZzwvdWktYnV0dG9uPlxcbjx1aS1idXR0b24gY2xhc3M9XFxcInNraW4tZGFuZ2VyXFxcIj5EYW5nZXI8L3VpLWJ1dHRvbj5cXG48dWktYnV0dG9uIGNsYXNzPVxcXCIke3NraW5MaW5rfVxcXCI+TGluazwvdWktYnV0dG9uPlxcblwiO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi90ZXN0L0J1dHRvbi50cGwuaHRtbFxuICoqIG1vZHVsZSBpZCA9IDM4XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9