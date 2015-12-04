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

	var CommandMenu = __webpack_require__(39);
	var vcomponent = __webpack_require__(4);
	
	var Main = vcomponent.Component.extends(
	    {
	        tpl: __webpack_require__(45),
	        componentClasses: [CommandMenu],
	        componentDidMount: function () {
	            var me = this;
	            this.setData({
	                title: '请选择',
	                onItemSelected: function (event, item) {
	                    me.setData({title: item.label});
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
	
	DomUpdater.outerHtml = function (node) {
	    var div = document.createElement('div');
	    div.appendChild(node);
	    return div.innerHTML;
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
	            div.innerHTML = '<!-- ' + this.node.tagName + ' -->'
	                + this.component.tpl
	                + '<!-- /' + this.node.tagName + ' -->';
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
	            this.tree.getTreeVar('componentManager', true)
	                .setParent(parentTree.getTreeVar('componentManager'));
	
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
/* 38 */,
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file 下拉命令菜单
	 * @author yibuyisheng(yibuyisheng@163.com, https://github.com/yibuyisheng)
	 */
	
	var Control = __webpack_require__(3);
	var Button = __webpack_require__(2);
	var Layer = __webpack_require__(40);
	
	module.exports = Control.extends(
	    {
	        tpl: __webpack_require__(43),
	        componentClasses: [Button, Layer],
	
	        componentDidMount: function () {
	            var me = this;
	            var layer = me.ref('layer');
	            this.setData({
	                toggleLayer: function () {
	                    if (layer.isShow()) {
	                        layer.hide();
	                    }
	                    else {
	                        layer.show();
	                    }
	                },
	                onOutClick: function (event) {
	                    layer.hide();
	                },
	                onItemClick: function () {
	                    layer.hide();
	                    var onItemSelected = me.getData('onItemSelected');
	                    if (onItemSelected instanceof Function) {
	                        onItemSelected.apply(null, arguments);
	                    }
	                }
	            });
	        }
	    },
	    {
	        $name: 'CommandMenu',
	        getStyle: function () {
	            return __webpack_require__(44)[0][1];
	        }
	    }
	);


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @file 弹层
	 * @author yibuyisheng(yibuyisheng@163.com, https://github.com/yibuyisheng)
	 */
	
	var Control = __webpack_require__(3);
	
	module.exports = Control.extends(
	    {
	        tpl: __webpack_require__(41),
	
	        show: function () {
	            var classList = this.getData('class', []);
	            classList.push('show');
	            this.setData('class', classList);
	        },
	
	        hide: function () {
	            this.setData(
	                'class',
	                this.getData('class', []).filter(function (klass) {
	                    return klass !== 'show';
	                })
	            );
	        },
	
	        isShow: function () {
	            var classList = this.getData('class', []);
	            for (var i = 0, il = classList.length; i < il; ++i) {
	                if (classList[i] === 'show') {
	                    return true;
	                }
	            }
	            return false;
	        }
	    },
	    {
	        $name: 'Layer',
	        getStyle: function () {
	            return __webpack_require__(42)[0][1];
	        }
	    }
	);


/***/ },
/* 41 */
/***/ function(module, exports) {

	module.exports = "<div onclick=\"${onClick(event)}\"><!-- children --></div>\n";

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(37)();
	// imports
	
	
	// module
	exports.push([module.id, ".layer {\n  position: absolute;\n  display: none;\n}\n.layer.show {\n  display: block;\n}\n", ""]);
	
	// exports


/***/ },
/* 43 */
/***/ function(module, exports) {

	module.exports = "<div event-outclick=\"${onOutClick(event)}\">\n    <ui-button class=\"skin-primary\"\n        on-click=\"${toggleLayer}\">\n        ${title}\n        <span class=\"triangle-down\"></span>\n    </ui-button>\n    <ui-layer ref=\"layer\" on-out-click=\"${outClick}\">\n        <!-- for: ${items} as ${item} -->\n            <p onclick=\"${onItemClick(event, item)}\">${item.label}</p>\n        <!-- /for -->\n    </ui-layer>\n</div>\n";

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(37)();
	// imports
	
	
	// module
	exports.push([module.id, ".command-menu {\n  position: relative;\n}\n.command-menu .triangle-down {\n  border: 0 solid transparent;\n  border-top-width: 6px;\n  border-left-width: 5px;\n  border-right-width: 5px;\n  border-top-color: #fff;\n  width: 0;\n  height: 0;\n  display: inline-block;\n  position: relative;\n  top: -1px;\n}\n.command-menu .layer {\n  background: #ebebeb;\n}\n.command-menu .layer p {\n  width: 100px;\n  padding: 5px;\n  line-height: 1.5;\n  margin: 0;\n  cursor: pointer;\n}\n.command-menu .layer p:hover {\n  background: #fef8e9;\n}\n", ""]);
	
	// exports


/***/ },
/* 45 */
/***/ function(module, exports) {

	module.exports = "<!-- var: items = [{label: '张三'}, {label: '李四'}, {label: '王五'}] -->\n<ui-command-menu title=\"${title}\" items=\"${items}\" on-item-selected=\"${onItemSelected}\"></ui-command-menu>\n";

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOWE4NTgyNTNiNWZiZTZjY2Q1NDE/MDU2MyIsIndlYnBhY2s6Ly8vLi90ZXN0L0NvbW1hbmRNZW51LmpzIiwid2VicGFjazovLy8uL3NyYy9CdXR0b24vQnV0dG9uLmpzPzlkZWUiLCJ3ZWJwYWNrOi8vLy4vc3JjL0NvbnRyb2wuanM/MmM5ZSIsIndlYnBhY2s6Ly8vLi4vdmNvbXBvbmVudC9zcmMvbWFpbi5qcz8xYzI5Iiwid2VicGFjazovLy8uLi92Y29tcG9uZW50L3NyYy9DaGlsZHJlbkRpcmVjdGl2ZVBhcnNlci5qcz9jODE4Iiwid2VicGFjazovLy8uLi92dHBsL3NyYy9wYXJzZXJzL0RpcmVjdGl2ZVBhcnNlci5qcz8wMDdiIiwid2VicGFjazovLy8uLi92dHBsL3NyYy9wYXJzZXJzL1BhcnNlci5qcz85ZDZhIiwid2VicGFjazovLy8uLi92dHBsL3NyYy9CYXNlLmpzP2NlN2YiLCJ3ZWJwYWNrOi8vLy4uL3Z0cGwvc3JjL2luaGVyaXQuanM/ZTM3YSIsIndlYnBhY2s6Ly8vLi4vdnRwbC9zcmMvdXRpbHMuanM/OTBkNCIsIndlYnBhY2s6Ly8vLi4vdmNvbXBvbmVudC9zcmMvQ2hpbGRyZW5UcmVlLmpzPzVhNzgiLCJ3ZWJwYWNrOi8vLy4uL3Z0cGwvc3JjL3RyZWVzL1RyZWUuanM/NTVlOSIsIndlYnBhY2s6Ly8vLi4vdnRwbC9zcmMvRXhwckNhbGN1bGF0ZXIuanM/MzY1NiIsIndlYnBhY2s6Ly8vLi4vdnRwbC9zcmMvRG9tVXBkYXRlci5qcz9iNTk3Iiwid2VicGFjazovLy8uLi92dHBsL3NyYy9sb2cuanM/NDg5ZSIsIndlYnBhY2s6Ly8vLi4vdnRwbC9zcmMvU2NvcGVNb2RlbC5qcz83ZGVkIiwid2VicGFjazovLy8uLi92dHBsL3NyYy9FdmVudC5qcz85OTg1Iiwid2VicGFjazovLy8uLi92Y29tcG9uZW50L3NyYy9Gb3JEaXJlY3RpdmVQYXJzZXIuanM/NDJkZiIsIndlYnBhY2s6Ly8vLi4vdnRwbC9zcmMvcGFyc2Vycy9Gb3JEaXJlY3RpdmVQYXJzZXIuanM/ZjU3NCIsIndlYnBhY2s6Ly8vLi4vdnRwbC9zcmMvdHJlZXMvRm9yVHJlZS5qcz8wOGNhIiwid2VicGFjazovLy8uLi92Y29tcG9uZW50L3NyYy9JZkRpcmVjdGl2ZVBhcnNlci5qcz8zMDRjIiwid2VicGFjazovLy8uLi92dHBsL3NyYy9wYXJzZXJzL0lmRGlyZWN0aXZlUGFyc2VyLmpzPzU1ZTMiLCJ3ZWJwYWNrOi8vLy4uL3Zjb21wb25lbnQvc3JjL0NvbXBvbmVudFBhcnNlci5qcz9iODk5Iiwid2VicGFjazovLy8uLi92dHBsL3NyYy9wYXJzZXJzL0V2ZW50RXhwclBhcnNlci5qcz84OTliIiwid2VicGFjazovLy8uLi92dHBsL3NyYy9wYXJzZXJzL0V4cHJQYXJzZXIuanM/ZmFhNSIsIndlYnBhY2s6Ly8vLi4vdmNvbXBvbmVudC9zcmMvQ29tcG9uZW50VHJlZS5qcz85MzI1Iiwid2VicGFjazovLy8uLi92Y29tcG9uZW50L3NyYy9Db21wb25lbnRNYW5hZ2VyLmpzPzFkYTIiLCJ3ZWJwYWNrOi8vLy4uL3Zjb21wb25lbnQvc3JjL0NvbXBvbmVudENoaWxkcmVuLmpzP2ZlZTIiLCJ3ZWJwYWNrOi8vLy4uL3Z0cGwvbWFpbi5qcz9mZDE2Iiwid2VicGFjazovLy8uLi92dHBsL3NyYy9wYXJzZXJzL1Njb3BlRGlyZWN0aXZlUGFyc2VyLmpzPzUzMTUiLCJ3ZWJwYWNrOi8vLy4uL3Z0cGwvc3JjL0NvbmZpZy5qcz81YzFmIiwid2VicGFjazovLy8uLi92dHBsL3NyYy9EaXJ0eUNoZWNrZXIuanM/NzIyNyIsIndlYnBhY2s6Ly8vLi4vdnRwbC9zcmMvcGFyc2Vycy9WYXJEaXJlY3RpdmVQYXJzZXIuanM/YjdhNCIsIndlYnBhY2s6Ly8vLi4vdmNvbXBvbmVudC9zcmMvQ29tcG9uZW50LmpzPzc4MzAiLCJ3ZWJwYWNrOi8vLy4vc3JjL0J1dHRvbi9CdXR0b24udHBsLmh0bWw/Zjc1NiIsIndlYnBhY2s6Ly8vLi9zcmMvQnV0dG9uL0J1dHRvbi5sZXNzP2NkMjUiLCJ3ZWJwYWNrOi8vLy4vfi9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qcz9kYTA0Iiwid2VicGFjazovLy8uL3NyYy9Db21tYW5kTWVudS9Db21tYW5kTWVudS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvTGF5ZXIvTGF5ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0xheWVyL0xheWVyLnRwbC5odG1sIiwid2VicGFjazovLy8uL3NyYy9MYXllci9MYXllci5sZXNzIiwid2VicGFjazovLy8uL3NyYy9Db21tYW5kTWVudS9Db21tYW5kTWVudS50cGwuaHRtbCIsIndlYnBhY2s6Ly8vLi9zcmMvQ29tbWFuZE1lbnUvQ29tbWFuZE1lbnUubGVzcyIsIndlYnBhY2s6Ly8vLi90ZXN0L0NvbW1hbmRNZW51LnRwbC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDdENBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWdDLGtCQUFrQjtBQUNsRDtBQUNBLGNBQWE7QUFDYjtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTs7Ozs7Ozs7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNsQkE7O0FBRUEsaURBQWdELEdBQUcsaUJBQWlCOzs7Ozs7O0FDRnBFO0FBQ0E7QUFDQTtBQUNBOztBQUVB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QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQW9CLE9BQU87QUFDM0IscUJBQW9CLFNBQVM7QUFDN0I7QUFDQSxxQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYixVQUFTOztBQUVUO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBbUIsWUFBWTtBQUMvQixxQkFBb0IsT0FBTztBQUMzQixxQkFBb0IsT0FBTztBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxx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QTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVyxLQUFLO0FBQ2hCLFlBQVcsT0FBTztBQUNsQixhQUFZLEVBQUU7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTBDLFFBQVE7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDaE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEc7Ozs7OztBQ1JBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMOzs7Ozs7O0FDcERBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9EQUFtRCxRQUFRO0FBQzNEO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyQ0FBMEMsUUFBUTtBQUNsRDtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYTtBQUNiOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBLGNBQWE7O0FBRWI7QUFDQTtBQUNBLGNBQWE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUFrRCxRQUFRO0FBQzFEO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTs7Ozs7OztBQ3JLQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW1CLGVBQWU7QUFDbEM7QUFDQTtBQUNBLHVEQUFzRCxRQUFRO0FBQzlEO0FBQ0Esb0RBQW1ELFFBQVE7QUFDM0Q7QUFDQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDckNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7O0FBRWI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0EsK0NBQThDLFFBQVE7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNULE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUN2S0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTs7QUFFYjtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFtQixPQUFPO0FBQzFCLG9CQUFtQixFQUFFO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEs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QTtBQUNBO0FBQ0E7Ozs7Ozs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwwQkFBeUI7QUFDekIseUJBQXdCOztBQUV4QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7OztBQ2hJQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFvQjtBQUNwQjtB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eUJBQXlCLE1BQU0sTUFBTSxLQUFLLGlDQUFpQyx5QkFBeUIsS0FBSyxXQUFXLHdEOzs7Ozs7QUNBM1k7QUFDQTs7O0FBR0E7QUFDQSwwQ0FBeUMsdUJBQXVCLEdBQUcsZ0NBQWdDLGdDQUFnQywwQkFBMEIsMkJBQTJCLDRCQUE0QiwyQkFBMkIsYUFBYSxjQUFjLDBCQUEwQix1QkFBdUIsY0FBYyxHQUFHLHdCQUF3Qix3QkFBd0IsR0FBRywwQkFBMEIsaUJBQWlCLGlCQUFpQixxQkFBcUIsY0FBYyxvQkFBb0IsR0FBRyxnQ0FBZ0Msd0JBQXdCLEdBQUc7O0FBRWhqQjs7Ozs7OztBQ1BBLHVDQUFzQyxZQUFZLEdBQUcsWUFBWSxHQUFHLFlBQVksa0NBQWtDLE1BQU0sYUFBYSxNQUFNLHdCQUF3QixlQUFlLHlCIiwiZmlsZSI6IkNvbW1hbmRNZW51LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCA5YTg1ODI1M2I1ZmJlNmNjZDU0MVxuICoqLyIsInZhciBDb21tYW5kTWVudSA9IHJlcXVpcmUoJy4uL3NyYy9Db21tYW5kTWVudS9Db21tYW5kTWVudScpO1xudmFyIHZjb21wb25lbnQgPSByZXF1aXJlKCd2Y29tcG9uZW50Jyk7XG5cbnZhciBNYWluID0gdmNvbXBvbmVudC5Db21wb25lbnQuZXh0ZW5kcyhcbiAgICB7XG4gICAgICAgIHRwbDogcmVxdWlyZSgnLi9Db21tYW5kTWVudS50cGwuaHRtbCcpLFxuICAgICAgICBjb21wb25lbnRDbGFzc2VzOiBbQ29tbWFuZE1lbnVdLFxuICAgICAgICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICfor7fpgInmi6knLFxuICAgICAgICAgICAgICAgIG9uSXRlbVNlbGVjdGVkOiBmdW5jdGlvbiAoZXZlbnQsIGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgbWUuc2V0RGF0YSh7dGl0bGU6IGl0ZW0ubGFiZWx9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgICAkbmFtZTogJ01haW4nXG4gICAgfVxuKTtcblxudmFyIG1haW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbicpO1xudmNvbXBvbmVudC5tb3VudChcbiAgICB7XG4gICAgICAgIGNvbmZpZzogbmV3IHZjb21wb25lbnQuQ29uZmlnKCksXG4gICAgICAgIHN0YXJ0Tm9kZTogbWFpbixcbiAgICAgICAgZW5kTm9kZTogbWFpblxuICAgIH0sXG4gICAgW01haW5dXG4pO1xuXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vdGVzdC9Db21tYW5kTWVudS5qc1xuICoqIG1vZHVsZSBpZCA9IDBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMVxuICoqLyIsIi8qKlxuICogQGZpbGUg5oyJ6ZKu5o6n5Lu2XG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20sIGh0dHBzOi8vZ2l0aHViLmNvbS95aWJ1eWlzaGVuZylcbiAqL1xuXG52YXIgQ29udHJvbCA9IHJlcXVpcmUoJy4uL0NvbnRyb2wnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb250cm9sLmV4dGVuZHMoXG4gICAge1xuICAgICAgICB0cGw6IHJlcXVpcmUoJy4vQnV0dG9uLnRwbC5odG1sJylcbiAgICB9LFxuICAgIHtcbiAgICAgICAgJG5hbWU6ICdCdXR0b24nLFxuXG4gICAgICAgIGdldFN0eWxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVxdWlyZSgnLi9CdXR0b24ubGVzcycpWzBdWzFdO1xuICAgICAgICB9XG4gICAgfVxuKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvQnV0dG9uL0J1dHRvbi5qc1xuICoqIG1vZHVsZSBpZCA9IDJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDRcbiAqKi8iLCJ2YXIgdmNvbXBvbmVudCA9IHJlcXVpcmUoJ3Zjb21wb25lbnQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB2Y29tcG9uZW50LkNvbXBvbmVudC5leHRlbmRzKHt9LCB7JG5hbWU6ICdDb250cm9sJ30pO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9Db250cm9sLmpzXG4gKiogbW9kdWxlIGlkID0gM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDRcbiAqKi8iLCJyZXF1aXJlKCcuL0NoaWxkcmVuRGlyZWN0aXZlUGFyc2VyJyk7XG5yZXF1aXJlKCcuL0ZvckRpcmVjdGl2ZVBhcnNlcicpO1xucmVxdWlyZSgnLi9JZkRpcmVjdGl2ZVBhcnNlcicpO1xucmVxdWlyZSgnLi9Db21wb25lbnRQYXJzZXInKTtcblxudmFyIENvbXBvbmVudFRyZWUgPSByZXF1aXJlKCcuL0NvbXBvbmVudFRyZWUnKTtcbnZhciBkb21EYXRhQmluZCA9IHJlcXVpcmUoJ3Z0cGwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgQ29tcG9uZW50OiByZXF1aXJlKCcuL0NvbXBvbmVudCcpLFxuICAgIG1vdW50OiBmdW5jdGlvbiAob3B0aW9ucywgQ29tcG9uZW50Q2xhc3Nlcykge1xuICAgICAgICB2YXIgdHJlZSA9IG5ldyBDb21wb25lbnRUcmVlKG9wdGlvbnMpO1xuICAgICAgICB0cmVlLnJlZ2lzdGVDb21wb25lbnRzKENvbXBvbmVudENsYXNzZXMpO1xuICAgICAgICB0cmVlLnRyYXZlcnNlKCk7XG4gICAgICAgIHJldHVybiB0cmVlO1xuICAgIH0sXG4gICAgQ29uZmlnOiBkb21EYXRhQmluZC5Db25maWdcbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Zjb21wb25lbnQvc3JjL21haW4uanNcbiAqKiBtb2R1bGUgaWQgPSA0XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNFxuICoqLyIsIi8qKlxuICogQGZpbGUgY2hpbGRyZW4g5oyH5LukIDwhLS0gY2hpbGRyZW4gLS0+IO+8jOWPquaciee7hOS7tuS4reaJjeS8muWtmOWcqOivpeaMh+S7pFxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbnZhciBEaXJlY3RpdmVQYXJzZXIgPSByZXF1aXJlKCd2dHBsL3NyYy9wYXJzZXJzL0RpcmVjdGl2ZVBhcnNlcicpO1xudmFyIENoaWxkcmVuVHJlZSA9IHJlcXVpcmUoJy4vQ2hpbGRyZW5UcmVlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGlyZWN0aXZlUGFyc2VyLmV4dGVuZHMoXG4gICAge1xuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgRGlyZWN0aXZlUGFyc2VyLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgICAgIHRoaXMubm9kZSA9IG9wdGlvbnMubm9kZTtcbiAgICAgICAgfSxcblxuICAgICAgICBjb2xsZWN0RXhwcnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjb21wb25lbnRDaGlsZHJlbiA9IHRoaXMudHJlZS5nZXRUcmVlVmFyKCdjb21wb25lbnRDaGlsZHJlbicsIHRydWUpO1xuICAgICAgICAgICAgaWYgKCFjb21wb25lbnRDaGlsZHJlbikge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgZGl2LmlubmVySFRNTCA9IGNvbXBvbmVudENoaWxkcmVuLmdldFRwbEh0bWwoKTtcblxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlblRyZWUgPSBuZXcgQ2hpbGRyZW5UcmVlKHtcbiAgICAgICAgICAgICAgICBzdGFydE5vZGU6IGRpdi5maXJzdENoaWxkLFxuICAgICAgICAgICAgICAgIGVuZE5vZGU6IGRpdi5sYXN0Q2hpbGQsXG4gICAgICAgICAgICAgICAgY29uZmlnOiB0aGlzLnRyZWUuY29uZmlnLFxuICAgICAgICAgICAgICAgIGRvbVVwZGF0ZXI6IHRoaXMudHJlZS5kb21VcGRhdGVyLFxuICAgICAgICAgICAgICAgIGV4cHJDYWxjdWxhdGVyOiB0aGlzLnRyZWUuZXhwckNhbGN1bGF0ZXJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlblRyZWUuc2V0UGFyZW50KHRoaXMudHJlZSk7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuVHJlZS50cmF2ZXJzZSgpO1xuXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuVHJlZS5yb290U2NvcGUuc2V0UGFyZW50KGNvbXBvbmVudENoaWxkcmVuLnNjb3BlKTtcbiAgICAgICAgICAgIGNvbXBvbmVudENoaWxkcmVuLnNjb3BlLmFkZENoaWxkKHRoaXMuY2hpbGRyZW5UcmVlLnJvb3RTY29wZSk7XG5cbiAgICAgICAgICAgIHdoaWxlIChkaXYuY2hpbGROb2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZGl2LmNoaWxkTm9kZXNbMF0sIHRoaXMubm9kZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5blvIDlp4voioLngrlcbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKiBAaW5oZXJpdERvY1xuICAgICAgICAgKiBAcmV0dXJuIHtOb2RlfVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0U3RhcnROb2RlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuY2hpbGRyZW5UcmVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubm9kZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuVHJlZS5zdGFydE5vZGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiOt+WPlue7k+adn+iKgueCuVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICAqIEBpbmhlcml0RG9jXG4gICAgICAgICAqIEByZXR1cm4ge05vZGV9XG4gICAgICAgICAqL1xuICAgICAgICBnZXRFbmROb2RlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ub2RlO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5UcmVlLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgdGhpcy5ub2RlID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5UcmVlID0gbnVsbDtcblxuICAgICAgICAgICAgRGlyZWN0aXZlUGFyc2VyLnByb3RvdHlwZS5kZXN0cm95LmFwcGx5KHRoaXMpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICAgIGlzUHJvcGVyTm9kZTogZnVuY3Rpb24gKG5vZGUsIGNvbmZpZykge1xuICAgICAgICAgICAgcmV0dXJuIG5vZGUubm9kZVR5cGUgPT09IDhcbiAgICAgICAgICAgICAgICAmJiBub2RlLm5vZGVWYWx1ZS5yZXBsYWNlKC9cXHMvZywgJycpID09PSAnY2hpbGRyZW4nO1xuICAgICAgICB9LFxuXG4gICAgICAgICRuYW1lOiAnQ2hpbGRyZW5EaXJlY3RpdmVQYXJzZXInXG4gICAgfVxuKTtcblxuQ2hpbGRyZW5UcmVlLnJlZ2lzdGVQYXJzZXIobW9kdWxlLmV4cG9ydHMpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92Y29tcG9uZW50L3NyYy9DaGlsZHJlbkRpcmVjdGl2ZVBhcnNlci5qc1xuICoqIG1vZHVsZSBpZCA9IDVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0XG4gKiovIiwiLyoqXG4gKiBAZmlsZSDmjIfku6Top6PmnpDlmajmir3osaHnsbvjgILmjIfku6ToioLngrnkuIDlrprmmK/ms6jph4roioLngrlcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG52YXIgUGFyc2VyID0gcmVxdWlyZSgnLi9QYXJzZXInKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQYXJzZXIuZXh0ZW5kcyhcbiAgICB7fSxcbiAgICB7XG4gICAgICAgIGlzUHJvcGVyTm9kZTogZnVuY3Rpb24gKG5vZGUsIGNvbmZpZykge1xuICAgICAgICAgICAgcmV0dXJuIG5vZGUubm9kZVR5cGUgPT09IDg7XG4gICAgICAgIH0sXG4gICAgICAgICRuYW1lOiAnRGlyZWN0aXZlUGFyc2VyJ1xuICAgIH1cbik7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Z0cGwvc3JjL3BhcnNlcnMvRGlyZWN0aXZlUGFyc2VyLmpzXG4gKiogbW9kdWxlIGlkID0gNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDRcbiAqKi8iLCIvKipcbiAqIEBmaWxlIOino+aekOWZqOeahOaKveixoeWfuuexu1xuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbi8qKlxuICog5p6E6YCg5Ye95pWwXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyDphY3nva7lj4LmlbDvvIzkuIDoiKzlj6/og73kvJrmnInlpoLkuIvlhoXlrrnvvJpcbiAqICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydE5vZGU6IC4uLixcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmROb2RlOiAuLi4sXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZTogLi4uLFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzogLi4uXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICDlhbfkvZPmmK/llaXlj6/ku6Xlj4LliqDlhbfkvZPnmoTlrZDnsbtcbiAqL1xuXG52YXIgQmFzZSA9IHJlcXVpcmUoJy4uL0Jhc2UnKTtcbm1vZHVsZS5leHBvcnRzID0gQmFzZS5leHRlbmRzKFxuICAgIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICog5Yid5aeL5YyWXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMg5p2l6Ieq5LqO5p6E6YCg5Ye95pWwXG4gICAgICAgICAqL1xuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgdGhpcy5leHByQ2FsY3VsYXRlciA9IG9wdGlvbnMuZXhwckNhbGN1bGF0ZXI7XG4gICAgICAgICAgICB0aGlzLmNvbmZpZyA9IG9wdGlvbnMuY29uZmlnO1xuICAgICAgICAgICAgdGhpcy5kb21VcGRhdGVyID0gb3B0aW9ucy5kb21VcGRhdGVyO1xuICAgICAgICAgICAgdGhpcy50cmVlID0gb3B0aW9ucy50cmVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDnu5HlrppzY29wZSBtb2RlbFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqIEBwYXJhbSB7U2NvcGVNb2RlbH0gc2NvcGVNb2RlbCBzY29wZSBtb2RlbFxuICAgICAgICAgKi9cbiAgICAgICAgc2V0U2NvcGU6IGZ1bmN0aW9uIChzY29wZU1vZGVsKSB7XG4gICAgICAgICAgICB0aGlzLnNjb3BlTW9kZWwgPSBzY29wZU1vZGVsO1xuXG4gICAgICAgICAgICB0aGlzLnNjb3BlTW9kZWwub24oJ2NoYW5nZScsIHRoaXMub25DaGFuZ2UsIHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5zY29wZU1vZGVsLm9uKCdwYXJlbnRjaGFuZ2UnLCB0aGlzLm9uQ2hhbmdlLCB0aGlzKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogbW9kZWwg5Y+R55Sf5Y+Y5YyW55qE5Zue6LCD5Ye95pWwXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICovXG4gICAgICAgIG9uQ2hhbmdlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmRvbVVwZGF0ZXIuZXhlY3V0ZSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5ZzY29wZSBtb2RlbFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqIEByZXR1cm4ge1Njb3BlTW9kZWx9IHNjb3BlIG1vZGVs5a+56LGhXG4gICAgICAgICAqL1xuICAgICAgICBnZXRTY29wZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2NvcGVNb2RlbDtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog5ZCRc2NvcGUgbW9kZWzph4zpnaLorr7nva7mlbDmja5cbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSDopoHorr7nva7nmoTmlbDmja5cbiAgICAgICAgICovXG4gICAgICAgIHNldERhdGE6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICB0aGlzLnNjb3BlTW9kZWwuc2V0KGRhdGEpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDpmpDol4/lvZPliY1wYXJzZXLlrp7kvovnm7jlhbPnmoToioLngrnjgILlhbfkvZPlrZDnsbvlrp7njrBcbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAYWJzdHJhY3RcbiAgICAgICAgICovXG4gICAgICAgIGdvRGFyazogZnVuY3Rpb24gKCkge30sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOaYvuekuuebuOWFs+WFg+e0oFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqIEBhYnN0cmFjdFxuICAgICAgICAgKi9cbiAgICAgICAgcmVzdG9yZUZyb21EYXJrOiBmdW5jdGlvbiAoKSB7fSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6I635Y+W6Kej5p6Q5Zmo5b2T5YmN54q25oCB5LiL55qE5byA5aeLRE9N6IqC54K544CCXG4gICAgICAgICAqXG4gICAgICAgICAqIOeUseS6juacieeahOino+aekOWZqOS8muWwhuS5i+WJjeeahOiKgueCueenu+mZpOaOie+8jOmCo+S5iOWwseS8muWvuemBjeWOhuW4puadpeW9seWTjeS6hu+8jFxuICAgICAgICAgKiDmiYDku6XmraTlpITmj5DkvpvkuKTkuKrojrflj5blvIDlp4voioLngrnlkoznu5PmnZ/oioLngrnnmoTmlrnms5XjgIJcbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAcmV0dXJuIHtOb2RlfSBET03oioLngrnlr7nosaFcbiAgICAgICAgICovXG4gICAgICAgIGdldFN0YXJ0Tm9kZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RhcnROb2RlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5bop6PmnpDlmajlvZPliY3nirbmgIHkuIvnmoTnu5PmnZ9ET03oioLngrlcbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAcmV0dXJuIHtOb2RlfSDoioLngrnlr7nosaFcbiAgICAgICAgICovXG4gICAgICAgIGdldEVuZE5vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVuZE5vZGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOaQnOmbhuihqOi+vuW8j++8jOeUn+aIkOihqOi+vuW8j+WHveaVsOWSjCBET00g5pu05paw5Ye95pWw44CC5YW35L2T5a2Q57G75a6e546wXG4gICAgICAgICAqXG4gICAgICAgICAqIEBhYnN0cmFjdFxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqL1xuICAgICAgICBjb2xsZWN0RXhwcnM6IGZ1bmN0aW9uICgpIHt9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDohI/mo4DmtYvjgILpu5jorqTkvJrkvb/nlKjlhajnrYnliKTmlq3jgIJcbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IGV4cHIgICAgICAgICDopoHmo4Dmn6XnmoTooajovr7lvI9cbiAgICAgICAgICogQHBhcmFtICB7Kn0gZXhwclZhbHVlICAgIOihqOi+vuW8j+W9k+WJjeiuoeeul+WHuuadpeeahOWAvFxuICAgICAgICAgKiBAcGFyYW0gIHsqfSBleHByT2xkVmFsdWUg6KGo6L6+5byP5LiK5LiA5qyh6K6h566X5Ye65p2l55qE5YC8XG4gICAgICAgICAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgICDkuKTmrKHnmoTlgLzmmK/lkKbnm7jlkIxcbiAgICAgICAgICovXG4gICAgICAgIGRpcnR5Q2hlY2s6IGZ1bmN0aW9uIChleHByLCBleHByVmFsdWUsIGV4cHJPbGRWYWx1ZSkge1xuICAgICAgICAgICAgdmFyIGRpcnR5Q2hlY2tlckZuID0gdGhpcy5kaXJ0eUNoZWNrZXIgPyB0aGlzLmRpcnR5Q2hlY2tlci5nZXRDaGVja2VyKGV4cHIpIDogbnVsbDtcbiAgICAgICAgICAgIHJldHVybiAoZGlydHlDaGVja2VyRm4gJiYgZGlydHlDaGVja2VyRm4oZXhwciwgZXhwclZhbHVlLCBleHByT2xkVmFsdWUpKVxuICAgICAgICAgICAgICAgICAgICB8fCAoIWRpcnR5Q2hlY2tlckZuICYmIGV4cHJWYWx1ZSAhPT0gZXhwck9sZFZhbHVlKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6K6+572u6ISP5qOA5rWL5ZmoXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwdWJsaWNcbiAgICAgICAgICogQHBhcmFtIHtEaXJ0eUNoZWNrZXJ9IGRpcnR5Q2hlY2tlciDohI/mo4DmtYvlmahcbiAgICAgICAgICovXG4gICAgICAgIHNldERpcnR5Q2hlY2tlcjogZnVuY3Rpb24gKGRpcnR5Q2hlY2tlcikge1xuICAgICAgICAgICAgdGhpcy5kaXJ0eUNoZWNrZXIgPSBkaXJ0eUNoZWNrZXI7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOmUgOavgeino+aekOWZqO+8jOWwhueVjOmdouaBouWkjeaIkOWOn+agt1xuICAgICAgICAgKlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqL1xuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmV4cHJDYWxjdWxhdGVyID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuZG9tVXBkYXRlciA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLnRyZWUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5kaXJ0eUNoZWNrZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICAgICRuYW1lOiAnUGFyc2VyJ1xuICAgIH1cbik7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Z0cGwvc3JjL3BhcnNlcnMvUGFyc2VyLmpzXG4gKiogbW9kdWxlIGlkID0gN1xuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDRcbiAqKi8iLCIvKipcbiAqIEBmaWxlIOaJgOacieexu+eahOWfuuexu1xuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbnZhciBpbmhlcml0ID0gcmVxdWlyZSgnLi9pbmhlcml0Jyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIEJhc2UoKSB7XG4gICAgdGhpcy5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59XG5cbkJhc2UucHJvdG90eXBlLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoKSB7fTtcblxuLyoqXG4gKiDnu6fmib9cbiAqXG4gKiBAc3RhdGljXG4gKiBAcGFyYW0gIHtPYmplY3R9IHByb3BzICAgICAgIOaZrumAmuWxnuaAp1xuICogQHBhcmFtICB7T2JqZWN0fSBzdGF0aWNQcm9wcyDpnZnmgIHlsZ7mgKdcbiAqIEByZXR1cm4ge0NsYXNzfSAgICAgICAgICAgICDlrZDnsbtcbiAqL1xuQmFzZS5leHRlbmRzID0gZnVuY3Rpb24gKHByb3BzLCBzdGF0aWNQcm9wcykge1xuICAgIC8vIOavj+S4quexu+mDveW/hemhu+acieS4gOS4quWQjeWtl1xuICAgIGlmICghc3RhdGljUHJvcHMgfHwgIXN0YXRpY1Byb3BzLiRuYW1lKSB7XG4gICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcignZWFjaCBjbGFzcyBtdXN0IGhhdmUgYSBgJG5hbWVgLicpO1xuICAgIH1cblxuICAgIHZhciBiYXNlQ2xzID0gdGhpcztcblxuICAgIHZhciBjbHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGJhc2VDbHMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICAgIHV0aWxzLmV4dGVuZChjbHMucHJvdG90eXBlLCBwcm9wcyk7XG4gICAgdXRpbHMuZXh0ZW5kKGNscywgc3RhdGljUHJvcHMpO1xuXG4gICAgLy8g6K6w5b2V5LiA5LiL54i257G7XG4gICAgY2xzLiRzdXBlckNsYXNzID0gYmFzZUNscztcblxuICAgIHJldHVybiBpbmhlcml0KGNscywgYmFzZUNscyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhc2U7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Z0cGwvc3JjL0Jhc2UuanNcbiAqKiBtb2R1bGUgaWQgPSA4XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNFxuICoqLyIsIi8qKlxuICogQGZpbGUg57un5om/XG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20pXG4gKi9cblxuZnVuY3Rpb24gaW5oZXJpdChDaGlsZENsYXNzLCBQYXJlbnRDbGFzcykge1xuICAgIGZ1bmN0aW9uIENscygpIHt9XG5cbiAgICBDbHMucHJvdG90eXBlID0gUGFyZW50Q2xhc3MucHJvdG90eXBlO1xuICAgIHZhciBjaGlsZFByb3RvID0gQ2hpbGRDbGFzcy5wcm90b3R5cGU7XG4gICAgQ2hpbGRDbGFzcy5wcm90b3R5cGUgPSBuZXcgQ2xzKCk7XG4gICAgQ2hpbGRDbGFzcy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDaGlsZENsYXNzO1xuXG4gICAgdmFyIGtleTtcbiAgICBmb3IgKGtleSBpbiBjaGlsZFByb3RvKSB7XG4gICAgICAgIENoaWxkQ2xhc3MucHJvdG90eXBlW2tleV0gPSBjaGlsZFByb3RvW2tleV07XG4gICAgfVxuXG4gICAgLy8g57un5om/6Z2Z5oCB5bGe5oCnXG4gICAgZm9yIChrZXkgaW4gUGFyZW50Q2xhc3MpIHtcbiAgICAgICAgaWYgKFBhcmVudENsYXNzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIGlmIChDaGlsZENsYXNzW2tleV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIENoaWxkQ2xhc3Nba2V5XSA9IFBhcmVudENsYXNzW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gQ2hpbGRDbGFzcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbmhlcml0O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL3NyYy9pbmhlcml0LmpzXG4gKiogbW9kdWxlIGlkID0gOVxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDRcbiAqKi8iLCIvKipcbiAqIEBmaWxlIOS4gOWghumhueebrumHjOmdouW4uOeUqOeahOaWueazlVxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbmV4cG9ydHMuc2xpY2UgPSBmdW5jdGlvbiAoYXJyLCBzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyciwgc3RhcnQsIGVuZCk7XG59O1xuXG5leHBvcnRzLmdvRGFyayA9IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgbm9kZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH1cbiAgICBlbHNlIGlmIChub2RlLm5vZGVUeXBlID09PSAzKSB7XG4gICAgICAgIG5vZGUuX190ZXh0X18gPSBub2RlLm5vZGVWYWx1ZTtcbiAgICAgICAgbm9kZS5ub2RlVmFsdWUgPSAnJztcbiAgICB9XG59O1xuXG5leHBvcnRzLnJlc3RvcmVGcm9tRGFyayA9IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgbm9kZS5zdHlsZS5kaXNwbGF5ID0gbnVsbDtcbiAgICB9XG4gICAgZWxzZSBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMykge1xuICAgICAgICBpZiAobm9kZS5fX3RleHRfXyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBub2RlLm5vZGVWYWx1ZSA9IG5vZGUuX190ZXh0X187XG4gICAgICAgICAgICBub2RlLl9fdGV4dF9fID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuZXhwb3J0cy5jcmVhdGVFeHByRm4gPSBmdW5jdGlvbiAoZXhwclJlZ0V4cCwgZXhwciwgZXhwckNhbGN1bGF0ZXIpIHtcbiAgICBleHByID0gZXhwci5yZXBsYWNlKGV4cHJSZWdFeHAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3VtZW50c1sxXTtcbiAgICB9KTtcbiAgICBleHByQ2FsY3VsYXRlci5jcmVhdGVFeHByRm4oZXhwcik7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKHNjb3BlTW9kZWwpIHtcbiAgICAgICAgcmV0dXJuIGV4cHJDYWxjdWxhdGVyLmNhbGN1bGF0ZShleHByLCBmYWxzZSwgc2NvcGVNb2RlbCk7XG4gICAgfTtcbn07XG5cbi8qKlxuICog6LaF57qn566A5Y2V55qEIGV4dGVuZCDvvIzlm6DkuLrmnKzlupPlr7kgZXh0ZW5kIOayoemCo+mrmOeahOimgeaxgu+8jFxuICog562J5Yiw5pyJ6KaB5rGC55qE5pe25YCZ5YaN5a6M5ZaE44CCXG4gKlxuICogQGlubmVyXG4gKiBAcGFyYW0gIHtPYmplY3R9IHRhcmdldCDnm67moIflr7nosaFcbiAqIEByZXR1cm4ge09iamVjdH0gICAgICAgIOacgOe7iOWQiOW5tuWQjueahOWvueixoVxuICovXG5leHBvcnRzLmV4dGVuZCA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICB2YXIgc3JjcyA9IGV4cG9ydHMuc2xpY2UoYXJndW1lbnRzLCAxKTtcbiAgICBmb3IgKHZhciBpID0gMCwgaWwgPSBzcmNzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgICAgLyogZXNsaW50LWRpc2FibGUgZ3VhcmQtZm9yLWluICovXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBzcmNzW2ldKSB7XG4gICAgICAgICAgICB0YXJnZXRba2V5XSA9IHNyY3NbaV1ba2V5XTtcbiAgICAgICAgfVxuICAgICAgICAvKiBlc2xpbnQtZW5hYmxlIGd1YXJkLWZvci1pbiAqL1xuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0O1xufTtcblxuZXhwb3J0cy50cmF2ZXJzZU5vQ2hhbmdlTm9kZXMgPSBmdW5jdGlvbiAoc3RhcnROb2RlLCBlbmROb2RlLCBub2RlRm4sIGNvbnRleHQpIHtcbiAgICBmb3IgKHZhciBjdXJOb2RlID0gc3RhcnROb2RlO1xuICAgICAgICBjdXJOb2RlICYmIGN1ck5vZGUgIT09IGVuZE5vZGU7XG4gICAgICAgIGN1ck5vZGUgPSBjdXJOb2RlLm5leHRTaWJsaW5nXG4gICAgKSB7XG4gICAgICAgIGlmIChub2RlRm4uY2FsbChjb250ZXh0LCBjdXJOb2RlKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbm9kZUZuLmNhbGwoY29udGV4dCwgZW5kTm9kZSk7XG59O1xuXG5leHBvcnRzLnRyYXZlcnNlTm9kZXMgPSBmdW5jdGlvbiAoc3RhcnROb2RlLCBlbmROb2RlLCBub2RlRm4sIGNvbnRleHQpIHtcbiAgICB2YXIgbm9kZXMgPSBbXTtcbiAgICBmb3IgKHZhciBjdXJOb2RlID0gc3RhcnROb2RlO1xuICAgICAgICBjdXJOb2RlICYmIGN1ck5vZGUgIT09IGVuZE5vZGU7XG4gICAgICAgIGN1ck5vZGUgPSBjdXJOb2RlLm5leHRTaWJsaW5nXG4gICAgKSB7XG4gICAgICAgIG5vZGVzLnB1c2goY3VyTm9kZSk7XG4gICAgfVxuXG4gICAgbm9kZXMucHVzaChlbmROb2RlKTtcblxuICAgIGV4cG9ydHMuZWFjaChub2Rlcywgbm9kZUZuLCBjb250ZXh0KTtcbn07XG5cbmV4cG9ydHMuZWFjaCA9IGZ1bmN0aW9uIChhcnIsIGZuLCBjb250ZXh0KSB7XG4gICAgaWYgKGV4cG9ydHMuaXNBcnJheShhcnIpKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IGFyci5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZm4uY2FsbChjb250ZXh0LCBhcnJbaV0sIGksIGFycikpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgYXJyID09PSAnb2JqZWN0Jykge1xuICAgICAgICBmb3IgKHZhciBrIGluIGFycikge1xuICAgICAgICAgICAgaWYgKGZuLmNhbGwoY29udGV4dCwgYXJyW2tdLCBrLCBhcnIpKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5mdW5jdGlvbiBpc0NsYXNzKG9iaiwgY2xzTmFtZSkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgJyArIGNsc05hbWUgKyAnXSc7XG59XG5cbmV4cG9ydHMuaXNBcnJheSA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgICByZXR1cm4gaXNDbGFzcyhhcnIsICdBcnJheScpO1xufTtcblxuZXhwb3J0cy5pc051bWJlciA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICByZXR1cm4gaXNDbGFzcyhvYmosICdOdW1iZXInKTtcbn07XG5cbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICByZXR1cm4gaXNDbGFzcyhvYmosICdGdW5jdGlvbicpO1xufTtcblxuLyoqXG4gKiDmmK/lkKbmmK/kuIDkuKrnuq/lr7nosaHvvIzmu6HotrPlpoLkuIvmnaHku7bvvJpcbiAqXG4gKiAx44CB6Zmk5LqG5YaF572u5bGe5oCn5LmL5aSW77yM5rKh5pyJ5YW25LuW57un5om/5bGe5oCn77ybXG4gKiAy44CBY29uc3RydWN0b3Ig5pivIE9iamVjdFxuICpcbiAqIEBwYXJhbSB7QW55fSBvYmog5b6F5Yik5pat55qE5Y+Y6YePXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5leHBvcnRzLmlzUHVyZU9iamVjdCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICBpZiAoIWlzQ2xhc3Mob2JqLCAnT2JqZWN0JykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGZvciAodmFyIGsgaW4gb2JqKSB7XG4gICAgICAgIGlmICghb2JqLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn07XG5cbmV4cG9ydHMuaXNDbGFzcyA9IGlzQ2xhc3M7XG5cbmV4cG9ydHMuYmluZCA9IGZ1bmN0aW9uIChmbiwgdGhpc0FyZykge1xuICAgIGlmICghZXhwb3J0cy5pc0Z1bmN0aW9uKGZuKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGJpbmQgPSBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCB8fCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICB2YXIgb2JqID0gYXJncy5sZW5ndGggPiAwID8gYXJnc1swXSA6IHVuZGVmaW5lZDtcbiAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB0b3RhbEFyZ3MgPSBBcnJheS5wcm90b3R5cGUuY29uY2F0LmFwcGx5KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3MsIDEpLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgcmV0dXJuIG1lLmFwcGx5KG9iaiwgdG90YWxBcmdzKTtcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIHJldHVybiBiaW5kLmFwcGx5KGZuLCBbdGhpc0FyZ10uY29uY2F0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMikpKTtcbn07XG5cbmV4cG9ydHMuaXNTdWJDbGFzc09mID0gZnVuY3Rpb24gKFN1YkNsYXNzLCBTdXBlckNsYXNzKSB7XG4gICAgcmV0dXJuIFN1YkNsYXNzLnByb3RvdHlwZSBpbnN0YW5jZW9mIFN1cGVyQ2xhc3M7XG59O1xuXG4vKipcbiAqIOWvueS8oOWFpeeahOWtl+espuS4sui/m+ihjOWIm+W7uuato+WImeihqOi+vuW8j+S5i+WJjeeahOi9rOS5ie+8jOmYsuatouWtl+espuS4suS4reeahOS4gOS6m+Wtl+espuaIkOS4uuWFs+mUruWtl+OAglxuICpcbiAqIEBwYXJhbSAge3N0cmluZ30gc3RyIOW+hei9rOS5ieeahOWtl+espuS4slxuICogQHJldHVybiB7c3RyaW5nfSAgICAg6L2s5LmJ5LmL5ZCO55qE5a2X56ym5LiyXG4gKi9cbmV4cG9ydHMucmVnRXhwRW5jb2RlID0gZnVuY3Rpb24gcmVnRXhwRW5jb2RlKHN0cikge1xuICAgIHJldHVybiAnXFxcXCcgKyBzdHIuc3BsaXQoJycpLmpvaW4oJ1xcXFwnKTtcbn07XG5cbmV4cG9ydHMueGhyID0gZnVuY3Rpb24gKG9wdGlvbnMsIGxvYWRGbiwgZXJyb3JGbikge1xuICAgIG9wdGlvbnMgPSBleHBvcnRzLmV4dGVuZCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCdcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICB4aHIub25lcnJvciA9IGVycm9yRm47XG4gICAgeGhyLm9ubG9hZCA9IGxvYWRGbjtcbiAgICB4aHIub3BlbihvcHRpb25zLm1ldGhvZCwgb3B0aW9ucy51cmwsIHRydWUpO1xuICAgIHNldEhlYWRlcnMob3B0aW9ucy5oZWFkZXJzLCB4aHIpO1xuICAgIHhoci5zZW5kKG9wdGlvbnMuYm9keSk7XG59O1xuXG4vKipcbiAqIOWwhuWtl+espuS4suS4reeahOmpvOWzsOWRveWQjeaWueW8j+aUueS4uuefreaoque6v+eahOW9ouW8j1xuICpcbiAqIEBwdWJsaWNcbiAqIEBwYXJhbSAge3N0cmluZ30gc3RyIOimgei9rOaNoueahOWtl+espuS4slxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnRzLmNhbWVsMmxpbmUgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bQS1aXS9nLCBmdW5jdGlvbiAobWF0Y2hlZCwgaW5kZXgpIHtcbiAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gbWF0Y2hlZC50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAnLScgKyBtYXRjaGVkLnRvTG93ZXJDYXNlKCk7XG4gICAgfSk7XG59O1xuXG4vKipcbiAqIOWwhuWtl+espuS4suS4reeahOefreaoque6v+WRveWQjeaWueW8j+aUueS4uumpvOWzsOeahOW9ouW8j1xuICpcbiAqIEBwdWJsaWNcbiAqIEBwYXJhbSAge3N0cmluZ30gc3RyIOimgei9rOaNoueahOWtl+espuS4slxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnRzLmxpbmUyY2FtZWwgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC8tW2Etel0vZywgZnVuY3Rpb24gKG1hdGNoZWQpIHtcbiAgICAgICAgcmV0dXJuIG1hdGNoZWRbMV0udG9VcHBlckNhc2UoKTtcbiAgICB9KTtcbn07XG5cbmV4cG9ydHMuZGlzdGluY3RBcnIgPSBmdW5jdGlvbiAoYXJyLCBoYXNoRm4pIHtcbiAgICBoYXNoRm4gPSBleHBvcnRzLmlzRnVuY3Rpb24oaGFzaEZuKSA/IGhhc2hGbiA6IGZ1bmN0aW9uIChlbGVtKSB7XG4gICAgICAgIHJldHVybiBTdHJpbmcoZWxlbSk7XG4gICAgfTtcbiAgICB2YXIgb2JqID0ge307XG4gICAgZm9yICh2YXIgaSA9IDAsIGlsID0gYXJyLmxlbmd0aDsgaSA8IGlsOyArK2kpIHtcbiAgICAgICAgb2JqW2hhc2hGbihhcnJbaV0pXSA9IGFycltpXTtcbiAgICB9XG5cbiAgICB2YXIgcmV0ID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgICBpZiAoIW9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldC5wdXNoKG9ialtrZXldKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xufTtcblxuXG5mdW5jdGlvbiBzZXRIZWFkZXJzKGhlYWRlcnMsIHhocikge1xuICAgIGlmICghaGVhZGVycykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yICh2YXIgayBpbiBoZWFkZXJzKSB7XG4gICAgICAgIGlmICghaGVhZGVycy5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoaywgaGVhZGVyc1trXSk7XG4gICAgfVxufVxuXG5cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdnRwbC9zcmMvdXRpbHMuanNcbiAqKiBtb2R1bGUgaWQgPSAxMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDRcbiAqKi8iLCIvKipcbiAqIEBmaWxlIOWtkOagkVxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbnZhciBUcmVlID0gcmVxdWlyZSgndnRwbC9zcmMvdHJlZXMvVHJlZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRyZWUuZXh0ZW5kcyhcbiAgICB7XG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgICBpZiAoIW9wdGlvbnMuY29uZmlnXG4gICAgICAgICAgICAgICAgfHwgIW9wdGlvbnMuZG9tVXBkYXRlclxuICAgICAgICAgICAgICAgIHx8ICFvcHRpb25zLmV4cHJDYWxjdWxhdGVyXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3dyb25nIGFyZ3VtZW50cycpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBvcHRpb25zLmNvbXBvbmVudENoaWxkcmVuID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgZGVsZXRlIG9wdGlvbnMuY29tcG9uZW50Q2hpbGRyZW47XG5cbiAgICAgICAgICAgIFRyZWUucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgICAkbmFtZTogJ0NoaWxkcmVuVHJlZSdcbiAgICB9XG4pO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92Y29tcG9uZW50L3NyYy9DaGlsZHJlblRyZWUuanNcbiAqKiBtb2R1bGUgaWQgPSAxMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDRcbiAqKi8iLCIvKipcbiAqIEBmaWxlIOacgOe7iOeahOagkVxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG52YXIgRXhwckNhbGN1bGF0ZXIgPSByZXF1aXJlKCcuLi9FeHByQ2FsY3VsYXRlcicpO1xudmFyIERvbVVwZGF0ZXIgPSByZXF1aXJlKCcuLi9Eb21VcGRhdGVyJyk7XG52YXIgU2NvcGVNb2RlbCA9IHJlcXVpcmUoJy4uL1Njb3BlTW9kZWwnKTtcbnZhciBCYXNlID0gcmVxdWlyZSgnLi4vQmFzZScpO1xuXG52YXIgUGFyc2VyQ2xhc3NlcyA9IFtdO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhc2UuZXh0ZW5kcyhcbiAgICB7XG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgICBCYXNlLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgICAgIHRoaXMuc3RhcnROb2RlID0gb3B0aW9ucy5zdGFydE5vZGU7XG4gICAgICAgICAgICB0aGlzLmVuZE5vZGUgPSBvcHRpb25zLmVuZE5vZGU7XG4gICAgICAgICAgICB0aGlzLmNvbmZpZyA9IG9wdGlvbnMuY29uZmlnO1xuXG4gICAgICAgICAgICB0aGlzLmV4cHJDYWxjdWxhdGVyID0gb3B0aW9ucy5leHByQ2FsY3VsYXRlciB8fCBuZXcgRXhwckNhbGN1bGF0ZXIoKTtcbiAgICAgICAgICAgIHRoaXMuZG9tVXBkYXRlciA9IG9wdGlvbnMuZG9tVXBkYXRlciB8fCBuZXcgRG9tVXBkYXRlcigpO1xuICAgICAgICAgICAgdGhpcy5kaXJ0eUNoZWNrZXIgPSBvcHRpb25zLmRpcnR5Q2hlY2tlcjtcblxuICAgICAgICAgICAgdGhpcy50cmVlID0gW107XG4gICAgICAgICAgICB0aGlzLnRyZWVWYXJzID0ge307XG5cbiAgICAgICAgICAgIHRoaXMucm9vdFNjb3BlID0gbmV3IFNjb3BlTW9kZWwoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6K6+572u57uR5a6a5Zyo5qCR5LiK6Z2i55qE6aKd5aSW5Y+Y6YeP44CC6L+Z5Lqb5Y+Y6YeP5pyJ5aaC5LiL54m55oCn77yaXG4gICAgICAgICAqIDHjgIHml6Dms5Xopobnm5bvvJtcbiAgICAgICAgICogMuOAgeWcqOiOt+WPlnRyZWVWYXJz5LiK6Z2i5p+Q5Liq5Y+Y6YeP55qE5pe25YCZ77yM5aaC5p6c5b2T5YmN5qCR5Y+W5Ye65p2l5pivdW5kZWZpbmVk77yM6YKj5LmI5bCx5Lya5Yiw54i257qn5qCR55qEdHJlZVZhcnPkuIrljrvmib7vvIzku6XmraTnsbvmjqjjgIJcbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAg5Y+Y6YeP5ZCNXG4gICAgICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUg5Y+Y6YeP5YC8XG4gICAgICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IOaYr+WQpuiuvue9ruaIkOWKn1xuICAgICAgICAgKi9cbiAgICAgICAgc2V0VHJlZVZhcjogZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy50cmVlVmFyc1tuYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy50cmVlVmFyc1tuYW1lXSA9IHZhbHVlO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdW5zZXRUcmVlVmFyOiBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgdGhpcy50cmVlVmFyc1tuYW1lXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6I635Y+W57uR5a6a5Yiw5qCR5LiK55qE6aKd5aSW5Y+Y6YePXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwdWJsaWNcbiAgICAgICAgICogQHBhcmFtICB7c3RyaW5nfSBuYW1lICAgICAgICAgICAgICAgICAg5Y+Y6YeP5ZCNXG4gICAgICAgICAqIEBwYXJhbSAge2Jvb2xlYW49fSBzaG91bGROb3RGaW5kSW5QYXJlbnQg5aaC5p6c5Zyo5b2T5YmN5qCR5Lit5rKh5om+5Yiw77yM5piv5ZCm5Yiw54i257qn5qCR5Lit5Y675om+44CCXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnVl5bCx5Luj6KGo5LiN5Y6777yMZmFsc2XlsLHku6PooajopoHljrtcbiAgICAgICAgICogQHJldHVybiB7Kn1cbiAgICAgICAgICovXG4gICAgICAgIGdldFRyZWVWYXI6IGZ1bmN0aW9uIChuYW1lLCBzaG91bGROb3RGaW5kSW5QYXJlbnQpIHtcbiAgICAgICAgICAgIHZhciB2YWwgPSB0aGlzLnRyZWVWYXJzW25hbWVdO1xuICAgICAgICAgICAgaWYgKCFzaG91bGROb3RGaW5kSW5QYXJlbnRcbiAgICAgICAgICAgICAgICAmJiB2YWwgPT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICYmIHRoaXMuJHBhcmVudCAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB2YWwgPSB0aGlzLiRwYXJlbnQuZ2V0VHJlZVZhcihuYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0UGFyZW50OiBmdW5jdGlvbiAocGFyZW50KSB7XG4gICAgICAgICAgICB0aGlzLiRwYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0U2NvcGVCeU5hbWU6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICB2YXIgc2NvcGVzID0gdGhpcy5nZXRUcmVlVmFyKCdzY29wZXMnKTtcbiAgICAgICAgICAgIGlmICghc2NvcGVzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHNjb3Blc1tuYW1lXTtcbiAgICAgICAgfSxcblxuICAgICAgICB0cmF2ZXJzZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgd2Fsa0RvbSh0aGlzLCB0aGlzLnN0YXJ0Tm9kZSwgdGhpcy5lbmROb2RlLCB0aGlzLnRyZWUsIHRoaXMucm9vdFNjb3BlKTtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXREYXRhOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgZGF0YSA9IGRhdGEgfHwge307XG4gICAgICAgICAgICB0aGlzLnJvb3RTY29wZS5zZXQoZGF0YSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ29EYXJrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB1dGlscy50cmF2ZXJzZU5vQ2hhbmdlTm9kZXModGhpcy5zdGFydE5vZGUsIHRoaXMuZW5kTm9kZSwgZnVuY3Rpb24gKGN1ck5vZGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoY3VyTm9kZS5ub2RlVHlwZSA9PT0gMSB8fCBjdXJOb2RlLm5vZGVUeXBlID09PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgIHV0aWxzLmdvRGFyayhjdXJOb2RlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgfSxcblxuICAgICAgICByZXN0b3JlRnJvbURhcms6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHV0aWxzLnRyYXZlcnNlTm9DaGFuZ2VOb2Rlcyh0aGlzLnN0YXJ0Tm9kZSwgdGhpcy5lbmROb2RlLCBmdW5jdGlvbiAoY3VyTm9kZSkge1xuICAgICAgICAgICAgICAgIGlmIChjdXJOb2RlLm5vZGVUeXBlID09PSAxIHx8IGN1ck5vZGUubm9kZVR5cGUgPT09IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgdXRpbHMucmVzdG9yZUZyb21EYXJrKGN1ck5vZGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldERpcnR5Q2hlY2tlcjogZnVuY3Rpb24gKGRpcnR5Q2hlY2tlcikge1xuICAgICAgICAgICAgdGhpcy5kaXJ0eUNoZWNrZXIgPSBkaXJ0eUNoZWNrZXI7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgd2Fsayh0aGlzLnRyZWUpO1xuXG4gICAgICAgICAgICB0aGlzLnN0YXJ0Tm9kZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmVuZE5vZGUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5jb25maWcgPSBudWxsO1xuXG4gICAgICAgICAgICB0aGlzLmV4cHJDYWxjdWxhdGVyLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRoaXMuZXhwckNhbGN1bGF0ZXIgPSBudWxsO1xuXG4gICAgICAgICAgICB0aGlzLmRvbVVwZGF0ZXIuZGVzdHJveSgpO1xuICAgICAgICAgICAgdGhpcy5kb21VcGRhdGVyID0gbnVsbDtcblxuICAgICAgICAgICAgdGhpcy50cmVlID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMudHJlZVZhcnMgPSBudWxsO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5kaXJ0eUNoZWNrZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRpcnR5Q2hlY2tlci5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5kaXJ0eUNoZWNrZXIgPSBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiB3YWxrKHBhcnNlck9ianMpIHtcbiAgICAgICAgICAgICAgICB1dGlscy5lYWNoKHBhcnNlck9ianMsIGZ1bmN0aW9uIChjdXJQYXJzZXJPYmopIHtcbiAgICAgICAgICAgICAgICAgICAgY3VyUGFyc2VyT2JqLnBhcnNlci5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1clBhcnNlck9iai5jaGlsZHJlbiAmJiBjdXJQYXJzZXJPYmouY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3YWxrKGN1clBhcnNlck9iai5jaGlsZHJlbik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog5Yib5bu66Kej5p6Q5Zmo5a6e5L6L77yM5YW26L+U5Zue5YC855qE57uT5p6E5Li677yaXG4gICAgICAgICAqIHtcbiAgICAgICAgICogICAgIHBhcnNlcjogLi4uLFxuICAgICAgICAgKiAgICAgY29sbGVjdFJlc3VsdDogLi4uXG4gICAgICAgICAqIH1cbiAgICAgICAgICpcbiAgICAgICAgICog6L+U5Zue5YC85a2Y5Zyo5aaC5LiL5Yeg56eN5oOF5Ya177yaXG4gICAgICAgICAqXG4gICAgICAgICAqIDHjgIHlpoLmnpwgcGFyc2VyIOWxnuaAp+WtmOWcqOS4lCBjb2xsZWN0UmVzdWx0IOS4uiB0cnVlIO+8jOWImeivtOaYjuW9k+WJjeino+aekOWZqOino+aekOS6huaJgOacieebuOW6lOeahOiKgueCue+8iOWMheaLrOi1t+atouiKgueCuemXtOeahOiKgueCueOAgeW9k+WJjeiKgueCueWSjOWtkOWtmeiKgueCue+8ie+8m1xuICAgICAgICAgKiAy44CB55u05o6l6L+U5Zue5YGH5YC85oiW6ICFIHBhcnNlciDkuI3lrZjlnKjvvIzor7TmmI7msqHmnInlpITnkIbku7vkvZXoioLngrnvvIzlvZPliY3oioLngrnkuI3lsZ7kuo7lvZPliY3op6PmnpDlmajlpITnkIbvvJtcbiAgICAgICAgICogM+OAgXBhcnNlciDlrZjlnKjkuJQgY29sbGVjdFJlc3VsdCDkuLrmlbDnu4TvvIznu5PmnoTlpoLkuIvvvJpcbiAgICAgICAgICogICAgIFtcbiAgICAgICAgICogICAgICAgICB7XG4gICAgICAgICAqICAgICAgICAgICAgIHN0YXJ0Tm9kZTogTm9kZS48Li4uPixcbiAgICAgICAgICogICAgICAgICAgICAgZW5kTm9kZTogTm9kZS48Li4uPlxuICAgICAgICAgKiAgICAgICAgIH1cbiAgICAgICAgICogICAgIF1cbiAgICAgICAgICpcbiAgICAgICAgICogIOWImeivtOaYjuW9k+WJjeaYr+W4puacieW+iOWkmuWIhuaUr+eahOiKgueCue+8jOimgeS+neasoeino+aekOaVsOe7hOS4reavj+S4quWFg+e0oOaMh+WumueahOiKgueCueiMg+WbtOOAglxuICAgICAgICAgKiAg6ICM5LiU77yM6K+l6Kej5p6Q5Zmo5a+55bqU55qEIHNldERhdGEoKSDmlrnms5XlsIbkvJrov5Tlm57mlbTmlbDvvIzmjIfmmI7kvb/nlKjlk6rkuIDkuKrliIbmlK/nmoToioLngrnjgIJcbiAgICAgICAgICpcbiAgICAgICAgICogQGlubmVyXG4gICAgICAgICAqIEBwYXJhbSB7Q29uc3RydWN0b3J9IFBhcnNlckNsYXNzIHBhcnNlciDnsbtcbiAgICAgICAgICogQHBhcmFtICB7T2JqZWN0fSBvcHRpb25zIOWIneWni+WMluWPguaVsFxuICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgICAg6L+U5Zue5YC8XG4gICAgICAgICAqL1xuICAgICAgICBjcmVhdGVQYXJzZXI6IGZ1bmN0aW9uIChQYXJzZXJDbGFzcywgb3B0aW9ucykge1xuICAgICAgICAgICAgdmFyIHN0YXJ0Tm9kZSA9IG9wdGlvbnMuc3RhcnROb2RlIHx8IG9wdGlvbnMubm9kZTtcbiAgICAgICAgICAgIGlmICghUGFyc2VyQ2xhc3MuaXNQcm9wZXJOb2RlKHN0YXJ0Tm9kZSwgb3B0aW9ucy5jb25maWcpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZW5kTm9kZTtcbiAgICAgICAgICAgIGlmIChQYXJzZXJDbGFzcy5maW5kRW5kTm9kZSkge1xuICAgICAgICAgICAgICAgIGVuZE5vZGUgPSBQYXJzZXJDbGFzcy5maW5kRW5kTm9kZShzdGFydE5vZGUsIG9wdGlvbnMuY29uZmlnKTtcblxuICAgICAgICAgICAgICAgIGlmICghZW5kTm9kZSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBQYXJzZXJDbGFzcy5nZXROb0VuZE5vZGVFcnJvcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChlbmROb2RlLnBhcmVudE5vZGUgIT09IHN0YXJ0Tm9kZS5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigndGhlIHJlbGF0aW9uc2hpcCBiZXR3ZWVuIHN0YXJ0IG5vZGUgYW5kIGVuZCBub2RlIGlzIG5vdCBicm90aGVyaG9vZCEnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBwYXJzZXIgPSBuZXcgUGFyc2VyQ2xhc3ModXRpbHMuZXh0ZW5kKG9wdGlvbnMsIHtcbiAgICAgICAgICAgICAgICBlbmROb2RlOiBlbmROb2RlXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgcGFyc2VyOiBwYXJzZXIsXG4gICAgICAgICAgICAgICAgZW5kTm9kZTogZW5kTm9kZSB8fCBvcHRpb25zLm5vZGVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOazqOWGjOS4gOS4i+ino+aekOWZqOexu+OAglxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gIHtDb25zdHJ1Y3Rvcn0gUGFyc2VyQ2xhc3Mg6Kej5p6Q5Zmo57G7XG4gICAgICAgICAqL1xuICAgICAgICByZWdpc3RlUGFyc2VyOiBmdW5jdGlvbiAoUGFyc2VyQ2xhc3MpIHtcbiAgICAgICAgICAgIHZhciBpc0V4aXRzQ2hpbGRDbGFzcyA9IGZhbHNlO1xuICAgICAgICAgICAgdXRpbHMuZWFjaChQYXJzZXJDbGFzc2VzLCBmdW5jdGlvbiAoUEMsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgaWYgKHV0aWxzLmlzU3ViQ2xhc3NPZihQQywgUGFyc2VyQ2xhc3MpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzRXhpdHNDaGlsZENsYXNzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodXRpbHMuaXNTdWJDbGFzc09mKFBhcnNlckNsYXNzLCBQQykpIHtcbiAgICAgICAgICAgICAgICAgICAgUGFyc2VyQ2xhc3Nlc1tpbmRleF0gPSBQYXJzZXJDbGFzcztcbiAgICAgICAgICAgICAgICAgICAgaXNFeGl0c0NoaWxkQ2xhc3MgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBpc0V4aXRzQ2hpbGRDbGFzcztcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoIWlzRXhpdHNDaGlsZENsYXNzKSB7XG4gICAgICAgICAgICAgICAgUGFyc2VyQ2xhc3Nlcy5wdXNoKFBhcnNlckNsYXNzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAkbmFtZTogJ1RyZWUnXG4gICAgfVxuKTtcblxuXG5mdW5jdGlvbiB3YWxrRG9tKHRyZWUsIHN0YXJ0Tm9kZSwgZW5kTm9kZSwgY29udGFpbmVyLCBzY29wZU1vZGVsKSB7XG4gICAgaWYgKHN0YXJ0Tm9kZSA9PT0gZW5kTm9kZSkge1xuICAgICAgICBhZGQoc3RhcnROb2RlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAodmFyIGN1ck5vZGUgPSBzdGFydE5vZGU7IGN1ck5vZGU7KSB7XG4gICAgICAgIGN1ck5vZGUgPSBhZGQoY3VyTm9kZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkKGN1ck5vZGUpIHtcbiAgICAgICAgaWYgKCFjdXJOb2RlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHN0YXJ0Tm9kZTogY3VyTm9kZSxcbiAgICAgICAgICAgIG5vZGU6IGN1ck5vZGUsXG4gICAgICAgICAgICBjb25maWc6IHRyZWUuY29uZmlnLFxuICAgICAgICAgICAgZXhwckNhbGN1bGF0ZXI6IHRyZWUuZXhwckNhbGN1bGF0ZXIsXG4gICAgICAgICAgICBkb21VcGRhdGVyOiB0cmVlLmRvbVVwZGF0ZXIsXG4gICAgICAgICAgICB0cmVlOiB0cmVlXG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIHBhcnNlck9iajtcblxuICAgICAgICB1dGlscy5lYWNoKFBhcnNlckNsYXNzZXMsIGZ1bmN0aW9uIChQYXJzZXJDbGFzcykge1xuICAgICAgICAgICAgcGFyc2VyT2JqID0gdHJlZS5jcmVhdGVQYXJzZXIoUGFyc2VyQ2xhc3MsIG9wdGlvbnMpO1xuICAgICAgICAgICAgaWYgKCFwYXJzZXJPYmogfHwgIXBhcnNlck9iai5wYXJzZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwYXJzZXJPYmouY29sbGVjdFJlc3VsdCA9IHBhcnNlck9iai5wYXJzZXIuY29sbGVjdEV4cHJzKCk7XG5cbiAgICAgICAgICAgIHBhcnNlck9iai5wYXJzZXIuc2V0U2NvcGUoc2NvcGVNb2RlbCk7XG5cbiAgICAgICAgICAgIGlmICh1dGlscy5pc0FycmF5KHBhcnNlck9iai5jb2xsZWN0UmVzdWx0KSkge1xuICAgICAgICAgICAgICAgIHZhciBicmFuY2hlcyA9IHBhcnNlck9iai5jb2xsZWN0UmVzdWx0O1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5wdXNoKHtwYXJzZXI6IHBhcnNlck9iai5wYXJzZXIsIGNoaWxkcmVuOiBicmFuY2hlc30pO1xuICAgICAgICAgICAgICAgIHV0aWxzLmVhY2goYnJhbmNoZXMsIGZ1bmN0aW9uIChicmFuY2gsIGkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFicmFuY2guc3RhcnROb2RlIHx8ICFicmFuY2guZW5kTm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbiA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB3YWxrRG9tKHRyZWUsIGJyYW5jaC5zdGFydE5vZGUsIGJyYW5jaC5lbmROb2RlLCBjb24sIHBhcnNlck9iai5wYXJzZXIuZ2V0U2NvcGUoKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyYW5jaGVzW2ldID0gY29uO1xuICAgICAgICAgICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHBhcnNlck9iai5lbmROb2RlICE9PSBlbmROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIGN1ck5vZGUgPSBwYXJzZXJPYmoucGFyc2VyLmdldEVuZE5vZGUoKS5uZXh0U2libGluZztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGN1ck5vZGUgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBjb24gPSBbXTtcbiAgICAgICAgICAgICAgICBjb250YWluZXIucHVzaCh7cGFyc2VyOiBwYXJzZXJPYmoucGFyc2VyLCBjaGlsZHJlbjogY29ufSk7XG4gICAgICAgICAgICAgICAgaWYgKGN1ck5vZGUubm9kZVR5cGUgPT09IDEgJiYgY3VyTm9kZS5jaGlsZE5vZGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICB3YWxrRG9tKHRyZWUsIGN1ck5vZGUuZmlyc3RDaGlsZCwgY3VyTm9kZS5sYXN0Q2hpbGQsIGNvbiwgcGFyc2VyT2JqLnBhcnNlci5nZXRTY29wZSgpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoY3VyTm9kZSAhPT0gZW5kTm9kZSkge1xuICAgICAgICAgICAgICAgICAgICBjdXJOb2RlID0gcGFyc2VyT2JqLnBhcnNlci5nZXRFbmROb2RlKCkubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjdXJOb2RlID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICBpZiAoIXBhcnNlck9iaikge1xuICAgICAgICAgICAgY3VyTm9kZSA9IGN1ck5vZGUubmV4dFNpYmxpbmc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY3VyTm9kZTtcbiAgICB9XG59XG5cblxuXG5cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdnRwbC9zcmMvdHJlZXMvVHJlZS5qc1xuICoqIG1vZHVsZSBpZCA9IDEyXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNFxuICoqLyIsInZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxuZnVuY3Rpb24gRXhwckNhbGN1bGF0ZXIoKSB7XG4gICAgdGhpcy5mbnMgPSB7fTtcblxuICAgIHRoaXMuZXhwck5hbWVNYXAgPSB7fTtcbiAgICB0aGlzLmV4cHJOYW1lUmVnRXhwID0gL1xcLj9cXCQ/KFthLXp8QS1aXSt8KFthLXp8QS1aXStbMC05XStbYS16fEEtWl0qKSkvZztcbn1cblxuRXhwckNhbGN1bGF0ZXIucHJvdG90eXBlLmNyZWF0ZUV4cHJGbiA9IGZ1bmN0aW9uIChleHByLCBhdm9pZFJldHVybikge1xuICAgIGlmIChleHByID09PSAna2xhc3MnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignYGtsYXNzYCBpcyB0aGUgcHJlc2VydmVkIHdvcmQgZm9yIGBjbGFzc2AnKTtcbiAgICB9XG4gICAgLy8g5a+5ZXhwcj0nY2xhc3Mn6L+b6KGM5LiL6L2s5o2iXG4gICAgaWYgKGV4cHIgPT09ICdjbGFzcycpIHtcbiAgICAgICAgZXhwciA9ICdrbGFzcyc7XG4gICAgfVxuXG4gICAgYXZvaWRSZXR1cm4gPSAhIWF2b2lkUmV0dXJuO1xuICAgIHRoaXMuZm5zW2V4cHJdID0gdGhpcy5mbnNbZXhwcl0gfHwge307XG4gICAgaWYgKHRoaXMuZm5zW2V4cHJdW2F2b2lkUmV0dXJuXSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHBhcmFtcyA9IGdldFZhcmlhYmxlTmFtZXNGcm9tRXhwcih0aGlzLCBleHByKTtcbiAgICB2YXIgZm4gPSBuZXcgRnVuY3Rpb24ocGFyYW1zLCAoYXZvaWRSZXR1cm4gPyAnJyA6ICdyZXR1cm4gJykgKyBleHByKTtcblxuICAgIHRoaXMuZm5zW2V4cHJdW2F2b2lkUmV0dXJuXSA9IHtcbiAgICAgICAgcGFyYW1OYW1lczogcGFyYW1zLFxuICAgICAgICBmbjogZm5cbiAgICB9O1xufTtcblxuRXhwckNhbGN1bGF0ZXIucHJvdG90eXBlLmNhbGN1bGF0ZSA9IGZ1bmN0aW9uIChleHByLCBhdm9pZFJldHVybiwgc2NvcGVNb2RlbCkge1xuICAgIC8vIOWvuWV4cHI9J2NsYXNzJ+i/m+ihjOS4i+i9rOaNolxuICAgIGlmIChleHByID09PSAnY2xhc3MnKSB7XG4gICAgICAgIGV4cHIgPSAna2xhc3MnO1xuICAgIH1cblxuICAgIHZhciBmbk9iaiA9IHRoaXMuZm5zW2V4cHJdW2F2b2lkUmV0dXJuXTtcbiAgICBpZiAoIWZuT2JqKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbm8gc3VjaCBleHByZXNzaW9uIGZ1bmN0aW9uIGNyZWF0ZWQhJyk7XG4gICAgfVxuXG4gICAgdmFyIGZuQXJncyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IGZuT2JqLnBhcmFtTmFtZXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgICB2YXIgcGFyYW0gPSBmbk9iai5wYXJhbU5hbWVzW2ldO1xuICAgICAgICB2YXIgdmFsdWUgPSBzY29wZU1vZGVsLmdldChwYXJhbSk7XG4gICAgICAgIGZuQXJncy5wdXNoKHZhbHVlID09PSB1bmRlZmluZWQgPyAnJyA6IHZhbHVlKTtcbiAgICB9XG5cbiAgICB2YXIgcmVzdWx0O1xuICAgIHRyeSB7XG4gICAgICAgIHJlc3VsdCA9IGZuT2JqLmZuLmFwcGx5KG51bGwsIGZuQXJncyk7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIHJlc3VsdCA9ICcnO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufTtcblxuRXhwckNhbGN1bGF0ZXIucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mbnMgPSBudWxsO1xuICAgIHRoaXMuZXhwck5hbWVNYXAgPSBudWxsO1xuICAgIHRoaXMuZXhwck5hbWVSZWdFeHAgPSBudWxsO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFeHByQ2FsY3VsYXRlcjtcblxuLyoqXG4gKiDku47ooajovr7lvI/kuK3mir3nprvlh7rlj5jph4/lkI1cbiAqXG4gKiBAaW5uZXJcbiAqIEBwYXJhbSB7RXhwckNhbGN1bGF0ZXJ9IG1lIOWvueW6lOWunuS+i1xuICogQHBhcmFtICB7c3RyaW5nfSBleHByIOihqOi+vuW8j+Wtl+espuS4su+8jOexu+S8vOS6jiBgJHtuYW1lfWAg5Lit55qEIG5hbWVcbiAqIEByZXR1cm4ge0FycmF5LjxzdHJpbmc+fSAgICAgIOWPmOmHj+WQjeaVsOe7hFxuICovXG5mdW5jdGlvbiBnZXRWYXJpYWJsZU5hbWVzRnJvbUV4cHIobWUsIGV4cHIpIHtcbiAgICBpZiAobWUuZXhwck5hbWVNYXBbZXhwcl0pIHtcbiAgICAgICAgcmV0dXJuIG1lLmV4cHJOYW1lTWFwW2V4cHJdO1xuICAgIH1cblxuICAgIHZhciByZWcgPSAvW1xcJHxffGEtenxBLVpdezF9KD86W2EtenxBLVp8MC05fFxcJHxfXSopL2c7XG5cbiAgICBmb3IgKHZhciBuYW1lcyA9IHt9LCBuYW1lID0gcmVnLmV4ZWMoZXhwcik7IG5hbWU7IG5hbWUgPSByZWcuZXhlYyhleHByKSkge1xuICAgICAgICB2YXIgcmVzdFN0ciA9IGV4cHIuc2xpY2UobmFtZS5pbmRleCArIG5hbWVbMF0ubGVuZ3RoKTtcblxuICAgICAgICAvLyDmmK/lt6blgLxcbiAgICAgICAgaWYgKC9eXFxzKj0oPyE9KS8udGVzdChyZXN0U3RyKSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDlj5jph4/lkI3liY3pnaLmmK/lkKblrZjlnKggYC5gIO+8jOaIluiAheWPmOmHj+WQjeaYr+WQpuS9jeS6juW8leWPt+WGhemDqFxuICAgICAgICBpZiAobmFtZS5pbmRleFxuICAgICAgICAgICAgJiYgKGV4cHJbbmFtZS5pbmRleCAtIDFdID09PSAnLidcbiAgICAgICAgICAgICAgICB8fCBpc0luUXVvdGUoXG4gICAgICAgICAgICAgICAgICAgICAgICBleHByLnNsaWNlKDAsIG5hbWUuaW5kZXgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdFN0clxuICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIG5hbWVzW25hbWVbMF1dID0gdHJ1ZTtcbiAgICB9XG5cbiAgICB2YXIgcmV0ID0gW107XG4gICAgdXRpbHMuZWFjaChuYW1lcywgZnVuY3Rpb24gKGlzT2ssIG5hbWUpIHtcbiAgICAgICAgaWYgKGlzT2spIHtcbiAgICAgICAgICAgIHJldC5wdXNoKG5hbWUpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgbWUuZXhwck5hbWVNYXBbZXhwcl0gPSByZXQ7XG5cbiAgICByZXR1cm4gcmV0O1xuXG4gICAgZnVuY3Rpb24gaXNJblF1b3RlKHByZVN0ciwgcmVzdFN0cikge1xuICAgICAgICBpZiAoKHByZVN0ci5sYXN0SW5kZXhPZignXFwnJykgKyAxICYmIHJlc3RTdHIuaW5kZXhPZignXFwnJykgKyAxKVxuICAgICAgICAgICAgfHwgKHByZVN0ci5sYXN0SW5kZXhPZignXCInKSArIDEgJiYgcmVzdFN0ci5pbmRleE9mKCdcIicpICsgMSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdnRwbC9zcmMvRXhwckNhbGN1bGF0ZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAxM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDRcbiAqKi8iLCIvKipcbiAqIEBmaWxlIERPTSDmm7TmlrDlmahcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG52YXIgbG9nID0gcmVxdWlyZSgnLi9sb2cnKTtcblxudmFyIGV2ZW50TGlzdCA9ICgnYmx1ciBmb2N1cyBmb2N1c2luIGZvY3Vzb3V0IGxvYWQgcmVzaXplIHNjcm9sbCB1bmxvYWQgY2xpY2sgZGJsY2xpY2sgJ1xuICAgICsgJ21vdXNlZG93biBtb3VzZXVwIG1vdXNlbW92ZSBtb3VzZW92ZXIgbW91c2VvdXQgbW91c2VlbnRlciBtb3VzZWxlYXZlICdcbiAgICArICdjaGFuZ2Ugc2VsZWN0IHN1Ym1pdCBrZXlkb3duIGtleXByZXNzIGtleXVwIGVycm9yIGNvbnRleHRtZW51Jykuc3BsaXQoJyAnKTtcblxuZnVuY3Rpb24gRG9tVXBkYXRlcigpIHtcbiAgICB0aGlzLnRhc2tzID0ge307XG4gICAgdGhpcy5pc0V4ZWN1dGluZyA9IGZhbHNlO1xuICAgIHRoaXMuZG9uZUZucyA9IFtdO1xufVxuXG52YXIgY291bnRlciA9IDA7XG5Eb21VcGRhdGVyLnByb3RvdHlwZS5nZW5lcmF0ZVRhc2tJZCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gY291bnRlcisrO1xufTtcblxuRG9tVXBkYXRlci5wcm90b3R5cGUuYWRkVGFza0ZuID0gZnVuY3Rpb24gKHRhc2tJZCwgdGFza0ZuKSB7XG4gICAgdGhpcy50YXNrc1t0YXNrSWRdID0gdGFza0ZuO1xufTtcblxuRG9tVXBkYXRlci5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnRhc2tzID0gbnVsbDtcbn07XG5cbkRvbVVwZGF0ZXIucHJvdG90eXBlLmV4ZWN1dGUgPSBmdW5jdGlvbiAoZG9uZUZuKSB7XG4gICAgaWYgKHV0aWxzLmlzRnVuY3Rpb24oZG9uZUZuKSkge1xuICAgICAgICB0aGlzLmRvbmVGbnMucHVzaChkb25lRm4pO1xuICAgIH1cblxuICAgIHZhciBtZSA9IHRoaXM7XG4gICAgaWYgKCF0aGlzLmlzRXhlY3V0aW5nKSB7XG4gICAgICAgIHRoaXMuaXNFeGVjdXRpbmcgPSB0cnVlO1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdXRpbHMuZWFjaChtZS50YXNrcywgZnVuY3Rpb24gKHRhc2tGbikge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHRhc2tGbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICBsb2cud2FybihlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIG1lLnRhc2tzID0ge307XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQodXRpbHMuYmluZChmdW5jdGlvbiAoZG9uZUZucykge1xuICAgICAgICAgICAgICAgIHV0aWxzLmVhY2goZG9uZUZucywgZnVuY3Rpb24gKGRvbmVGbikge1xuICAgICAgICAgICAgICAgICAgICBkb25lRm4oKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sIG51bGwsIG1lLmRvbmVGbnMpKTtcbiAgICAgICAgICAgIG1lLmRvbmVGbnMgPSBbXTtcblxuICAgICAgICAgICAgbWUuaXNFeGVjdXRpbmcgPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxuLyoqXG4gKiDnu5nmjIflrppET03oioLngrnnmoTmjIflrprlsZ7mgKforr7nva7lgLxcbiAqXG4gKiBUT0RPOiDlrozlloRcbiAqXG4gKiBAc3RhdGljXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgIERPTeiKgueCuVxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgIOiKgueCueWxnuaAp+WQjVxuICogQHBhcmFtIHtPYmplY3R9IHZhbHVlIOiKgueCueWxnuaAp+WAvFxuICogQHJldHVybiB7Kn1cbiAqL1xuRG9tVXBkYXRlci5zZXRBdHRyID0gZnVuY3Rpb24gKG5vZGUsIG5hbWUsIHZhbHVlKSB7XG4gICAgLy8g55uu5YmN5LuF5aSE55CG5YWD57Sg6IqC54K577yM5Lul5ZCO5piv5ZCm5aSE55CG5YW25LuW57G75Z6L55qE6IqC54K577yM5Lul5ZCO5YaN6K+0XG4gICAgaWYgKG5vZGUubm9kZVR5cGUgIT09IDEpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChuYW1lID09PSAnc3R5bGUnICYmIHV0aWxzLmlzUHVyZU9iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIERvbVVwZGF0ZXIuc2V0U3R5bGUobm9kZSwgdmFsdWUpO1xuICAgIH1cblxuICAgIGlmIChuYW1lID09PSAnY2xhc3MnKSB7XG4gICAgICAgIHJldHVybiBEb21VcGRhdGVyLnNldENsYXNzKG5vZGUsIHZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAoRG9tVXBkYXRlci5pc0V2ZW50TmFtZShuYW1lKSkge1xuICAgICAgICByZXR1cm4gRG9tVXBkYXRlci5zZXRFdmVudChub2RlLCBuYW1lLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgLy8g5aSW6YOo54K55Ye75LqL5Lu2XG4gICAgaWYgKG5hbWUgPT09ICdvbm91dGNsaWNrJykge1xuICAgICAgICByZXR1cm4gRG9tVXBkYXRlci5zZXRPdXRDbGljayhub2RlLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgbm9kZS5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xufTtcblxuRG9tVXBkYXRlci5zZXRPdXRDbGljayA9IGZ1bmN0aW9uIChub2RlLCBjYWxsYmFjaykge1xuICAgIGlmICghdXRpbHMuaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQgPSBldmVudCB8fCB3aW5kb3cuZXZlbnQ7XG5cbiAgICAgICAgaWYgKG5vZGUgIT09IGV2ZW50LnRhcmdldCAmJiAhbm9kZS5jb250YWlucyhldmVudC50YXJnZXQpKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhldmVudCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cbkRvbVVwZGF0ZXIuc2V0RXZlbnQgPSBmdW5jdGlvbiAobm9kZSwgbmFtZSwgdmFsdWUpIHtcbiAgICBpZiAodXRpbHMuaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgICAgbm9kZVtuYW1lXSA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgZXZlbnQgPSBldmVudCB8fCB3aW5kb3cuZXZlbnQ7XG4gICAgICAgICAgICB2YWx1ZShldmVudCk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBub2RlW25hbWVdID0gbnVsbDtcbiAgICB9XG59O1xuXG5Eb21VcGRhdGVyLnNldENsYXNzID0gZnVuY3Rpb24gKG5vZGUsIGtsYXNzKSB7XG4gICAgaWYgKCFrbGFzcykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbm9kZS5jbGFzc05hbWUgPSBEb21VcGRhdGVyLmdldENsYXNzTGlzdChrbGFzcykuam9pbignICcpO1xufTtcblxuRG9tVXBkYXRlci5zZXRTdHlsZSA9IGZ1bmN0aW9uIChub2RlLCBzdHlsZU9iaikge1xuICAgIGZvciAodmFyIGsgaW4gc3R5bGVPYmopIHtcbiAgICAgICAgbm9kZS5zdHlsZVtrXSA9IHN0eWxlT2JqW2tdO1xuICAgIH1cbn07XG5cbi8qKlxuICog6I635Y+W5YWD57Sg6IqC54K555qE5bGe5oCn5YC8XG4gKlxuICogQHN0YXRpY1xuICogQHBhcmFtIHtOb2RlfSBub2RlIGRvbeiKgueCuVxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUg5bGe5oCn5ZCNXG4gKiBAcmV0dXJuIHsqfSDlsZ7mgKflgLxcbiAqL1xuRG9tVXBkYXRlci5nZXRBdHRyID0gZnVuY3Rpb24gKG5vZGUsIG5hbWUpIHtcbiAgICBpZiAobmFtZSA9PT0gJ2NsYXNzJykge1xuICAgICAgICByZXR1cm4gRG9tVXBkYXRlci5nZXRDbGFzc0xpc3Qobm9kZS5jbGFzc05hbWUpO1xuICAgIH1cbiAgICByZXR1cm4gbm9kZS5nZXRBdHRyaWJ1dGUobm9kZSk7XG59O1xuXG5Eb21VcGRhdGVyLmdldENsYXNzTGlzdCA9IGZ1bmN0aW9uIChrbGFzcykge1xuICAgIHZhciBrbGFzc2VzID0gW107XG4gICAgaWYgKHV0aWxzLmlzQ2xhc3Moa2xhc3MsICdTdHJpbmcnKSkge1xuICAgICAgICBrbGFzc2VzID0ga2xhc3Muc3BsaXQoJyAnKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodXRpbHMuaXNQdXJlT2JqZWN0KGtsYXNzKSkge1xuICAgICAgICBmb3IgKHZhciBrIGluIGtsYXNzKSB7XG4gICAgICAgICAgICBpZiAoa2xhc3Nba10pIHtcbiAgICAgICAgICAgICAgICBrbGFzc2VzLnB1c2goa2xhc3Nba10pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKHV0aWxzLmlzQXJyYXkoa2xhc3MpKSB7XG4gICAgICAgIGtsYXNzZXMgPSBrbGFzcztcbiAgICB9XG5cbiAgICByZXR1cm4gdXRpbHMuZGlzdGluY3RBcnIoa2xhc3Nlcyk7XG59O1xuXG5Eb21VcGRhdGVyLmlzRXZlbnROYW1lID0gZnVuY3Rpb24gKHN0cikge1xuICAgIGlmIChzdHIuaW5kZXhPZignb24nKSAhPT0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHN0ciA9IHN0ci5zbGljZSgyKTtcbiAgICBmb3IgKHZhciBpID0gMCwgaWwgPSBldmVudExpc3QubGVuZ3RoOyBpIDwgaWw7ICsraSkge1xuICAgICAgICBpZiAoc3RyID09PSBldmVudExpc3RbaV0pIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xufTtcblxuRG9tVXBkYXRlci5vdXRlckh0bWwgPSBmdW5jdGlvbiAobm9kZSkge1xuICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXYuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgcmV0dXJuIGRpdi5pbm5lckhUTUw7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERvbVVwZGF0ZXI7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Z0cGwvc3JjL0RvbVVwZGF0ZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAxNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDRcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICB3YXJuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghY29uc29sZSB8fCAhY29uc29sZS53YXJuKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLndhcm4uYXBwbHkoY29uc29sZSwgYXJndW1lbnRzKTtcbiAgICB9XG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdnRwbC9zcmMvbG9nLmpzXG4gKiogbW9kdWxlIGlkID0gMTVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0XG4gKiovIiwidmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xudmFyIEV2ZW50ID0gcmVxdWlyZSgnLi9FdmVudCcpO1xudmFyIGluaGVyaXQgPSByZXF1aXJlKCcuL2luaGVyaXQnKTtcblxuZnVuY3Rpb24gU2NvcGVNb2RlbCgpIHtcbiAgICBFdmVudC5jYWxsKHRoaXMpO1xuXG4gICAgdGhpcy5zdG9yZSA9IHt9O1xuICAgIHRoaXMucGFyZW50O1xuICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcbn1cblxuU2NvcGVNb2RlbC5wcm90b3R5cGUuc2V0UGFyZW50ID0gZnVuY3Rpb24gKHBhcmVudCkge1xuICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xufTtcblxuU2NvcGVNb2RlbC5wcm90b3R5cGUuYWRkQ2hpbGQgPSBmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICB0aGlzLmNoaWxkcmVuLnB1c2goY2hpbGQpO1xufTtcblxuU2NvcGVNb2RlbC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgaWYgKHV0aWxzLmlzQ2xhc3MobmFtZSwgJ1N0cmluZycpKSB7XG4gICAgICAgIHRoaXMuc3RvcmVbbmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgY2hhbmdlKHRoaXMpO1xuICAgIH1cbiAgICBlbHNlIGlmICh1dGlscy5pc1B1cmVPYmplY3QobmFtZSkpIHtcbiAgICAgICAgdXRpbHMuZXh0ZW5kKHRoaXMuc3RvcmUsIG5hbWUpO1xuICAgICAgICBjaGFuZ2UodGhpcyk7XG4gICAgfVxufTtcblxuU2NvcGVNb2RlbC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEgfHwgbmFtZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0b3JlO1xuICAgIH1cblxuICAgIGlmIChuYW1lIGluIHRoaXMuc3RvcmUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RvcmVbbmFtZV07XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXQobmFtZSk7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBpbmhlcml0KFNjb3BlTW9kZWwsIEV2ZW50KTtcblxuZnVuY3Rpb24gY2hhbmdlKG1lKSB7XG4gICAgbWUudHJpZ2dlcignY2hhbmdlJywgbWUpO1xuICAgIHV0aWxzLmVhY2gobWUuY2hpbGRyZW4sIGZ1bmN0aW9uIChzY29wZSkge1xuICAgICAgICBzY29wZS50cmlnZ2VyKCdwYXJlbnRjaGFuZ2UnLCBtZSk7XG4gICAgfSk7XG59XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Z0cGwvc3JjL1Njb3BlTW9kZWwuanNcbiAqKiBtb2R1bGUgaWQgPSAxNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDRcbiAqKi8iLCJ2YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIEV2ZW50KCkge1xuICAgIHRoaXMuZXZudHMgPSB7fTtcbn1cblxuRXZlbnQucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gKGV2ZW50TmFtZSwgZm4sIGNvbnRleHQpIHtcbiAgICBpZiAoIXV0aWxzLmlzRnVuY3Rpb24oZm4pKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmV2bnRzW2V2ZW50TmFtZV0gPSB0aGlzLmV2bnRzW2V2ZW50TmFtZV0gfHwgW107XG5cbiAgICB0aGlzLmV2bnRzW2V2ZW50TmFtZV0ucHVzaCh7XG4gICAgICAgIGZuOiBmbixcbiAgICAgICAgY29udGV4dDogY29udGV4dFxuICAgIH0pO1xufTtcblxuRXZlbnQucHJvdG90eXBlLnRyaWdnZXIgPSBmdW5jdGlvbiAoZXZlbnROYW1lKSB7XG4gICAgdmFyIGZuT2JqcyA9IHRoaXMuZXZudHNbZXZlbnROYW1lXTtcbiAgICBpZiAoZm5PYmpzICYmIGZuT2Jqcy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSB1dGlscy5zbGljZShhcmd1bWVudHMsIDEpO1xuICAgICAgICB1dGlscy5lYWNoKGZuT2JqcywgZnVuY3Rpb24gKGZuT2JqKSB7XG4gICAgICAgICAgICBmbk9iai5mbi5hcHBseShmbk9iai5jb250ZXh0LCBhcmdzKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxuRXZlbnQucHJvdG90eXBlLm9mZiA9IGZ1bmN0aW9uIChldmVudE5hbWUsIGZuKSB7XG4gICAgaWYgKCFmbikge1xuICAgICAgICB0aGlzLmV2bnRzW2V2ZW50TmFtZV0gPSBudWxsO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGZuT2JqcyA9IHRoaXMuZXZudHNbZXZlbnROYW1lXTtcbiAgICBpZiAoZm5PYmpzICYmIGZuT2Jqcy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIG5ld0ZuT2JqcyA9IFtdO1xuICAgICAgICB1dGlscy5lYWNoKGZuT2JqcywgZnVuY3Rpb24gKGZuT2JqKSB7XG4gICAgICAgICAgICBpZiAoZm4gIT09IGZuT2JqLmZuKSB7XG4gICAgICAgICAgICAgICAgbmV3Rm5PYmpzLnB1c2goZm5PYmopO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5ldm50c1tldmVudE5hbWVdID0gbmV3Rm5PYmpzO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnQ7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Z0cGwvc3JjL0V2ZW50LmpzXG4gKiogbW9kdWxlIGlkID0gMTdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0XG4gKiovIiwiLyoqXG4gKiBAZmlsZSDlop7lvLpmb3LmjIfku6RcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG52YXIgRm9yRGlyZWN0aXZlUGFyc2VyID0gcmVxdWlyZSgndnRwbC9zcmMvcGFyc2Vycy9Gb3JEaXJlY3RpdmVQYXJzZXInKTtcbnZhciBGb3JUcmVlID0gcmVxdWlyZSgndnRwbC9zcmMvdHJlZXMvRm9yVHJlZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZvckRpcmVjdGl2ZVBhcnNlci5leHRlbmRzKFxuICAgIHtcbiAgICAgICAgc2V0Q3NzQ2xhc3M6IGZ1bmN0aW9uIChjbGFzc0xpc3QpIHtcbiAgICAgICAgICAgIHRoaXMuJCRjbGFzc0xpc3QgPSBjbGFzc0xpc3Q7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaWwgPSB0aGlzLnRyZWVzLmxlbmd0aDsgaSA8IGlsOyArK2kpIHtcbiAgICAgICAgICAgICAgICB2YXIgdHJlZSA9IHRoaXMudHJlZXNbaV07XG4gICAgICAgICAgICAgICAgc2V0Q2xhc3Nlcyh0cmVlLCBjbGFzc0xpc3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGNyZWF0ZVRyZWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB0cmVlID0gRm9yRGlyZWN0aXZlUGFyc2VyLnByb3RvdHlwZS5jcmVhdGVUcmVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICBzZXRDbGFzc2VzKHRyZWUsIHRoaXMuJCRjbGFzc0xpc3QpO1xuICAgICAgICAgICAgcmV0dXJuIHRyZWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0QXR0cjogZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAobmFtZSA9PT0gJ2NsYXNzJykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0Q3NzQ2xhc3ModmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICAgICRuYW1lOiAnRm9yRGlyZWN0aXZlUGFyc2VyJ1xuICAgIH1cbik7XG5cbmZ1bmN0aW9uIHNldENsYXNzZXModHJlZSwgY2xhc3NMaXN0KSB7XG4gICAgZm9yICh2YXIgaiA9IDAsIGpsID0gdHJlZS50cmVlLmxlbmd0aDsgaiA8IGpsOyArK2opIHtcbiAgICAgICAgdHJlZS50cmVlW2pdLnBhcnNlci5zZXRBdHRyKCdjbGFzcycsIGNsYXNzTGlzdCk7XG4gICAgfVxufVxuXG5Gb3JUcmVlLnJlZ2lzdGVQYXJzZXIobW9kdWxlLmV4cG9ydHMpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92Y29tcG9uZW50L3NyYy9Gb3JEaXJlY3RpdmVQYXJzZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAxOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDRcbiAqKi8iLCIvKipcbiAqIEBmaWxlIGZvciDmjIfku6RcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG52YXIgRGlyZWN0aXZlUGFyc2VyID0gcmVxdWlyZSgnLi9EaXJlY3RpdmVQYXJzZXInKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG52YXIgRm9yVHJlZSA9IHJlcXVpcmUoJy4uL3RyZWVzL0ZvclRyZWUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBEaXJlY3RpdmVQYXJzZXIuZXh0ZW5kcyhcbiAgICB7XG5cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIERpcmVjdGl2ZVBhcnNlci5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgICAgICAgICB0aGlzLnN0YXJ0Tm9kZSA9IG9wdGlvbnMuc3RhcnROb2RlO1xuICAgICAgICAgICAgdGhpcy5lbmROb2RlID0gb3B0aW9ucy5lbmROb2RlO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNvbGxlY3RFeHByczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RhcnROb2RlLm5leHRTaWJsaW5nID09PSB0aGlzLmVuZE5vZGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB0cGxTZWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHV0aWxzLnRyYXZlcnNlTm9kZXModGhpcy5zdGFydE5vZGUsIHRoaXMuZW5kTm9kZSwgZnVuY3Rpb24gKGN1ck5vZGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoY3VyTm9kZSA9PT0gdGhpcy5zdGFydE5vZGUgfHwgY3VyTm9kZSA9PT0gdGhpcy5lbmROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0cGxTZWcuYXBwZW5kQ2hpbGQoY3VyTm9kZSk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgICAgIHRoaXMudHBsU2VnID0gdHBsU2VnO1xuXG4gICAgICAgICAgICB0aGlzLmV4cHIgPSB0aGlzLnN0YXJ0Tm9kZS5ub2RlVmFsdWUubWF0Y2godGhpcy5jb25maWcuZ2V0Rm9yRXhwcnNSZWdFeHAoKSlbMV07XG4gICAgICAgICAgICB0aGlzLmV4cHJGbiA9IHV0aWxzLmNyZWF0ZUV4cHJGbih0aGlzLmNvbmZpZy5nZXRFeHByUmVnRXhwKCksIHRoaXMuZXhwciwgdGhpcy5leHByQ2FsY3VsYXRlcik7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUZuID0gY3JlYXRlVXBkYXRlRm4oXG4gICAgICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0Tm9kZS5uZXh0U2libGluZyxcbiAgICAgICAgICAgICAgICB0aGlzLmVuZE5vZGUucHJldmlvdXNTaWJsaW5nLFxuICAgICAgICAgICAgICAgIHRoaXMuY29uZmlnLFxuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnROb2RlLm5vZGVWYWx1ZVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgb25DaGFuZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5leHByKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZXhwclZhbHVlID0gdGhpcy5leHByRm4odGhpcy5zY29wZU1vZGVsKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmRpcnR5Q2hlY2sodGhpcy5leHByLCBleHByVmFsdWUsIHRoaXMuZXhwck9sZFZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlRm4oZXhwclZhbHVlLCB0aGlzLnNjb3BlTW9kZWwpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmV4cHJPbGRWYWx1ZSA9IGV4cHJWYWx1ZTtcblxuICAgICAgICAgICAgRGlyZWN0aXZlUGFyc2VyLnByb3RvdHlwZS5vbkNoYW5nZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHV0aWxzLnRyYXZlcnNlTm9kZXModGhpcy50cGxTZWcuZmlyc3RDaGlsZCwgdGhpcy50cGxTZWcubGFzdENoaWxkLCBmdW5jdGlvbiAoY3VyTm9kZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZW5kTm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShjdXJOb2RlLCB0aGlzLmVuZE5vZGUpO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICAgIHV0aWxzLmVhY2godGhpcy50cmVlcywgZnVuY3Rpb24gKHRyZWUpIHtcbiAgICAgICAgICAgICAgICB0cmVlLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLnRwbFNlZyA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmV4cHIgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5leHByRm4gPSBudWxsO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVGbiA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0Tm9kZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmVuZE5vZGUgPSBudWxsO1xuICAgICAgICAgICAgRGlyZWN0aXZlUGFyc2VyLnByb3RvdHlwZS5kZXN0cm95LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY3JlYXRlVHJlZTogZnVuY3Rpb24gKGNvbmZpZykge1xuICAgICAgICAgICAgdmFyIHBhcnNlciA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgY29weVNlZyA9IHBhcnNlci50cGxTZWcuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICAgICAgdmFyIHN0YXJ0Tm9kZSA9IGNvcHlTZWcuZmlyc3RDaGlsZDtcbiAgICAgICAgICAgIHZhciBlbmROb2RlID0gY29weVNlZy5sYXN0Q2hpbGQ7XG4gICAgICAgICAgICB1dGlscy50cmF2ZXJzZU5vZGVzKHN0YXJ0Tm9kZSwgZW5kTm9kZSwgZnVuY3Rpb24gKGN1ck5vZGUpIHtcbiAgICAgICAgICAgICAgICBwYXJzZXIuZW5kTm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShjdXJOb2RlLCBwYXJzZXIuZW5kTm9kZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIHRyZWUgPSBuZXcgRm9yVHJlZSh7XG4gICAgICAgICAgICAgICAgc3RhcnROb2RlOiBzdGFydE5vZGUsXG4gICAgICAgICAgICAgICAgZW5kTm9kZTogZW5kTm9kZSxcbiAgICAgICAgICAgICAgICBjb25maWc6IGNvbmZpZyxcbiAgICAgICAgICAgICAgICBkb21VcGRhdGVyOiBwYXJzZXIudHJlZS5kb21VcGRhdGVyLFxuICAgICAgICAgICAgICAgIGV4cHJDYWxjdWxhdGVyOiBwYXJzZXIudHJlZS5leHByQ2FsY3VsYXRlclxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0cmVlLnNldFBhcmVudChwYXJzZXIudHJlZSk7XG4gICAgICAgICAgICB0cmVlLnRyYXZlcnNlKCk7XG4gICAgICAgICAgICByZXR1cm4gdHJlZTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgICBpc1Byb3Blck5vZGU6IGZ1bmN0aW9uIChub2RlLCBjb25maWcpIHtcbiAgICAgICAgICAgIHJldHVybiBEaXJlY3RpdmVQYXJzZXIuaXNQcm9wZXJOb2RlKG5vZGUsIGNvbmZpZylcbiAgICAgICAgICAgICAgICAmJiBjb25maWcuZm9yUHJlZml4UmVnRXhwLnRlc3Qobm9kZS5ub2RlVmFsdWUpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZpbmRFbmROb2RlOiBmdW5jdGlvbiAoZm9yU3RhcnROb2RlLCBjb25maWcpIHtcbiAgICAgICAgICAgIHZhciBjdXJOb2RlID0gZm9yU3RhcnROb2RlO1xuICAgICAgICAgICAgd2hpbGUgKChjdXJOb2RlID0gY3VyTm9kZS5uZXh0U2libGluZykpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNGb3JFbmROb2RlKGN1ck5vZGUsIGNvbmZpZykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN1ck5vZGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGdldE5vRW5kTm9kZUVycm9yOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKCd0aGUgYGZvcmAgZGlyZWN0aXZlIGlzIG5vdCBwcm9wZXJseSBlbmRlZCEnKTtcbiAgICAgICAgfSxcblxuICAgICAgICAkbmFtZTogJ0ZvckRpcmVjdGl2ZVBhcnNlcidcbiAgICB9XG4pO1xuXG5Gb3JUcmVlLnJlZ2lzdGVQYXJzZXIobW9kdWxlLmV4cG9ydHMpO1xuXG5mdW5jdGlvbiBpc0ZvckVuZE5vZGUobm9kZSwgY29uZmlnKSB7XG4gICAgcmV0dXJuIG5vZGUubm9kZVR5cGUgPT09IDggJiYgY29uZmlnLmZvckVuZFByZWZpeFJlZ0V4cC50ZXN0KG5vZGUubm9kZVZhbHVlKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlVXBkYXRlRm4ocGFyc2VyLCBzdGFydE5vZGUsIGVuZE5vZGUsIGNvbmZpZywgZnVsbEV4cHIpIHtcbiAgICB2YXIgdHJlZXMgPSBbXTtcbiAgICBwYXJzZXIudHJlZXMgPSB0cmVlcztcbiAgICB2YXIgaXRlbVZhcmlhYmxlTmFtZSA9IGZ1bGxFeHByLm1hdGNoKHBhcnNlci5jb25maWcuZ2V0Rm9ySXRlbVZhbHVlTmFtZVJlZ0V4cCgpKVsxXTtcbiAgICB2YXIgdGFza0lkID0gcGFyc2VyLmRvbVVwZGF0ZXIuZ2VuZXJhdGVUYXNrSWQoKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGV4cHJWYWx1ZSwgc2NvcGVNb2RlbCkge1xuICAgICAgICB2YXIgaW5kZXggPSAwO1xuICAgICAgICBmb3IgKHZhciBrIGluIGV4cHJWYWx1ZSkge1xuICAgICAgICAgICAgaWYgKCF0cmVlc1tpbmRleF0pIHtcbiAgICAgICAgICAgICAgICB0cmVlc1tpbmRleF0gPSBwYXJzZXIuY3JlYXRlVHJlZShjb25maWcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0cmVlc1tpbmRleF0ucmVzdG9yZUZyb21EYXJrKCk7XG4gICAgICAgICAgICB0cmVlc1tpbmRleF0uc2V0RGlydHlDaGVja2VyKHBhcnNlci5kaXJ0eUNoZWNrZXIpO1xuXG4gICAgICAgICAgICB2YXIgbG9jYWwgPSB7XG4gICAgICAgICAgICAgICAga2V5OiBrLFxuICAgICAgICAgICAgICAgIGluZGV4OiBpbmRleFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGxvY2FsW2l0ZW1WYXJpYWJsZU5hbWVdID0gZXhwclZhbHVlW2tdO1xuXG4gICAgICAgICAgICB0cmVlc1tpbmRleF0ucm9vdFNjb3BlLnNldFBhcmVudChzY29wZU1vZGVsKTtcbiAgICAgICAgICAgIHNjb3BlTW9kZWwuYWRkQ2hpbGQodHJlZXNbaW5kZXhdLnJvb3RTY29wZSk7XG5cbiAgICAgICAgICAgIHRyZWVzW2luZGV4XS5zZXREYXRhKGxvY2FsKTtcblxuICAgICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgfVxuXG4gICAgICAgIHBhcnNlci5kb21VcGRhdGVyLmFkZFRhc2tGbih0YXNrSWQsIHV0aWxzLmJpbmQoZnVuY3Rpb24gKHRyZWVzLCBpbmRleCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IGluZGV4LCBpbCA9IHRyZWVzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0cmVlc1tpXS5nb0RhcmsoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgbnVsbCwgdHJlZXMsIGluZGV4KSk7XG4gICAgfTtcbn1cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdnRwbC9zcmMvcGFyc2Vycy9Gb3JEaXJlY3RpdmVQYXJzZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAxOVxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDRcbiAqKi8iLCIvKipcbiAqIEBmaWxlIGZvcuaMh+S7pOS4reeUqOWIsOeahFxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbnZhciBUcmVlID0gcmVxdWlyZSgnLi9UcmVlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVHJlZS5leHRlbmRzKFxuICAgIHtcbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIGlmICghb3B0aW9ucy5jb25maWdcbiAgICAgICAgICAgICAgICB8fCAhb3B0aW9ucy5kb21VcGRhdGVyXG4gICAgICAgICAgICAgICAgfHwgIW9wdGlvbnMuZXhwckNhbGN1bGF0ZXJcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignd3JvbmcgYXJndW1lbnRzJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIFRyZWUucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgICAkbmFtZTogJ0ZvclRyZWUnXG4gICAgfVxuKTtcblxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL3NyYy90cmVlcy9Gb3JUcmVlLmpzXG4gKiogbW9kdWxlIGlkID0gMjBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0XG4gKiovIiwiLyoqXG4gKiBAZmlsZSDlop7lvLrkuIDkuIt2dHBs5Lit55qEaWbmjIfku6RcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG52YXIgSWZEaXJlY3RpdmVQYXJzZXIgPSByZXF1aXJlKCd2dHBsL3NyYy9wYXJzZXJzL0lmRGlyZWN0aXZlUGFyc2VyJyk7XG52YXIgVHJlZSA9IHJlcXVpcmUoJ3Z0cGwvc3JjL3RyZWVzL1RyZWUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBJZkRpcmVjdGl2ZVBhcnNlci5leHRlbmRzKFxuICAgIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICog57uZaWbmjIfku6TmiYDnrqHnkIbnmoTmiYDmnInoioLngrnorr7nva5jc3PnsbtcbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBjbGFzc0xpc3QgY3Nz57G75pWw57uEXG4gICAgICAgICAqL1xuICAgICAgICBzZXRDc3NDbGFzczogZnVuY3Rpb24gKGNsYXNzTGlzdCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlsID0gdGhpcy5icmFuY2hlcy5sZW5ndGg7IGkgPCBpbDsgKytpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGJyYW5jaCA9IHRoaXMuYnJhbmNoZXNbaV07XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGpsID0gYnJhbmNoLmxlbmd0aDsgaiA8IGpsOyArK2opIHtcbiAgICAgICAgICAgICAgICAgICAgYnJhbmNoW2pdLnBhcnNlci5zZXRBdHRyKCdjbGFzcycsIGNsYXNzTGlzdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHNldEF0dHI6IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKG5hbWUgPT09ICdjbGFzcycpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldENzc0NsYXNzKHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgICAkbmFtZTogJ0lmRGlyZWN0aXZlUGFyc2VyJ1xuICAgIH1cbik7XG5cblRyZWUucmVnaXN0ZVBhcnNlcihtb2R1bGUuZXhwb3J0cyk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Zjb21wb25lbnQvc3JjL0lmRGlyZWN0aXZlUGFyc2VyLmpzXG4gKiogbW9kdWxlIGlkID0gMjFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0XG4gKiovIiwiLyoqXG4gKiBAZmlsZSBpZiDmjIfku6RcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG52YXIgRGlyZWN0aXZlUGFyc2VyID0gcmVxdWlyZSgnLi9EaXJlY3RpdmVQYXJzZXInKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG52YXIgVHJlZSA9IHJlcXVpcmUoJy4uL3RyZWVzL1RyZWUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBEaXJlY3RpdmVQYXJzZXIuZXh0ZW5kcyhcbiAgICB7XG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgICBEaXJlY3RpdmVQYXJzZXIucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgICAgICAgICAgdGhpcy5zdGFydE5vZGUgPSBvcHRpb25zLnN0YXJ0Tm9kZTtcbiAgICAgICAgICAgIHRoaXMuZW5kTm9kZSA9IG9wdGlvbnMuZW5kTm9kZTtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnID0gb3B0aW9ucy5jb25maWc7XG5cbiAgICAgICAgICAgIHRoaXMuZXhwcnMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuZXhwckZucyA9IHt9O1xuXG4gICAgICAgICAgICB0aGlzLmhhbmRsZUJyYW5jaGVzVGFza0lkID0gdGhpcy5kb21VcGRhdGVyLmdlbmVyYXRlVGFza0lkKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY29sbGVjdEV4cHJzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYnJhbmNoZXMgPSBbXTtcbiAgICAgICAgICAgIHZhciBicmFuY2hJbmRleCA9IC0xO1xuXG4gICAgICAgICAgICB1dGlscy50cmF2ZXJzZU5vZGVzKHRoaXMuc3RhcnROb2RlLCB0aGlzLmVuZE5vZGUsIGZ1bmN0aW9uIChjdXJOb2RlKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5vZGVUeXBlID0gZ2V0SWZOb2RlVHlwZShjdXJOb2RlLCB0aGlzLmNvbmZpZyk7XG5cbiAgICAgICAgICAgICAgICBpZiAobm9kZVR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0RW5kTm9kZShjdXJOb2RlLCBicmFuY2hlcywgYnJhbmNoSW5kZXgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGJyYW5jaEluZGV4Kys7XG4gICAgICAgICAgICAgICAgICAgIGJyYW5jaGVzW2JyYW5jaEluZGV4XSA9IGJyYW5jaGVzW2JyYW5jaEluZGV4XSB8fCB7fTtcblxuICAgICAgICAgICAgICAgICAgICAvLyDmmK8gaWYg6IqC54K55oiW6ICFIGVsaWYg6IqC54K577yM5pCc6ZuG6KGo6L6+5byPXG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlVHlwZSA8IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBleHByID0gY3VyTm9kZS5ub2RlVmFsdWUucmVwbGFjZSh0aGlzLmNvbmZpZy5nZXRBbGxJZlJlZ0V4cCgpLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmV4cHJzLnB1c2goZXhwcik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5leHByRm5zW2V4cHJdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5leHByRm5zW2V4cHJdID0gdXRpbHMuY3JlYXRlRXhwckZuKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZy5nZXRFeHByUmVnRXhwKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cHIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXhwckNhbGN1bGF0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKG5vZGVUeXBlID09PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhc0Vsc2VCcmFuY2ggPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWJyYW5jaGVzW2JyYW5jaEluZGV4XS5zdGFydE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyYW5jaGVzW2JyYW5jaEluZGV4XS5zdGFydE5vZGUgPSBjdXJOb2RlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY3VyTm9kZSA9IGN1ck5vZGUubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgaWYgKCFjdXJOb2RlIHx8IGN1ck5vZGUgPT09IHRoaXMuZW5kTm9kZSkge1xuICAgICAgICAgICAgICAgICAgICBzZXRFbmROb2RlKGN1ck5vZGUsIGJyYW5jaGVzLCBicmFuY2hJbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgICAgICB0aGlzLmJyYW5jaGVzID0gYnJhbmNoZXM7XG4gICAgICAgICAgICByZXR1cm4gYnJhbmNoZXM7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHNldEVuZE5vZGUoY3VyTm9kZSwgYnJhbmNoZXMsIGJyYW5jaEluZGV4KSB7XG4gICAgICAgICAgICAgICAgaWYgKGJyYW5jaEluZGV4ICsgMSAmJiBicmFuY2hlc1ticmFuY2hJbmRleF0uc3RhcnROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyYW5jaGVzW2JyYW5jaEluZGV4XS5lbmROb2RlID0gY3VyTm9kZS5wcmV2aW91c1NpYmxpbmc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIG9uQ2hhbmdlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZXhwcnMgPSB0aGlzLmV4cHJzO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlsID0gZXhwcnMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBleHByID0gZXhwcnNbaV07XG4gICAgICAgICAgICAgICAgdmFyIGV4cHJWYWx1ZSA9IHRoaXMuZXhwckZuc1tleHByXSh0aGlzLnNjb3BlTW9kZWwpO1xuICAgICAgICAgICAgICAgIGlmIChleHByVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kb21VcGRhdGVyLmFkZFRhc2tGbihcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlQnJhbmNoZXNUYXNrSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB1dGlscy5iaW5kKGhhbmRsZUJyYW5jaGVzLCBudWxsLCB0aGlzLmJyYW5jaGVzLCBpKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNFbHNlQnJhbmNoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kb21VcGRhdGVyLmFkZFRhc2tGbihcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVCcmFuY2hlc1Rhc2tJZCxcbiAgICAgICAgICAgICAgICAgICAgdXRpbHMuYmluZChoYW5kbGVCcmFuY2hlcywgbnVsbCwgdGhpcy5icmFuY2hlcywgaSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0Tm9kZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmVuZE5vZGUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5jb25maWcgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5leHBycyA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmV4cHJGbnMgPSBudWxsO1xuXG4gICAgICAgICAgICBEaXJlY3RpdmVQYXJzZXIucHJvdG90eXBlLmRlc3Ryb3kuY2FsbCh0aGlzKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgICBpc1Byb3Blck5vZGU6IGZ1bmN0aW9uIChub2RlLCBjb25maWcpIHtcbiAgICAgICAgICAgIHJldHVybiBnZXRJZk5vZGVUeXBlKG5vZGUsIGNvbmZpZykgPT09IDE7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZmluZEVuZE5vZGU6IGZ1bmN0aW9uIChpZlN0YXJ0Tm9kZSwgY29uZmlnKSB7XG4gICAgICAgICAgICB2YXIgY3VyTm9kZSA9IGlmU3RhcnROb2RlO1xuICAgICAgICAgICAgd2hpbGUgKChjdXJOb2RlID0gY3VyTm9kZS5uZXh0U2libGluZykpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNJZkVuZE5vZGUoY3VyTm9kZSwgY29uZmlnKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3VyTm9kZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0Tm9FbmROb2RlRXJyb3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoJ3RoZSBpZiBkaXJlY3RpdmUgaXMgbm90IHByb3Blcmx5IGVuZGVkIScpO1xuICAgICAgICB9LFxuXG4gICAgICAgICRuYW1lOiAnSWZEaXJlY3RpdmVQYXJzZXInXG4gICAgfVxuKTtcblxuVHJlZS5yZWdpc3RlUGFyc2VyKG1vZHVsZS5leHBvcnRzKTtcblxuZnVuY3Rpb24gaGFuZGxlQnJhbmNoZXMoYnJhbmNoZXMsIHNob3dJbmRleCkge1xuICAgIHV0aWxzLmVhY2goYnJhbmNoZXMsIGZ1bmN0aW9uIChicmFuY2gsIGopIHtcbiAgICAgICAgdmFyIGZuID0gaiA9PT0gc2hvd0luZGV4ID8gJ3Jlc3RvcmVGcm9tRGFyaycgOiAnZ29EYXJrJztcbiAgICAgICAgdXRpbHMuZWFjaChicmFuY2gsIGZ1bmN0aW9uIChwYXJzZXJPYmopIHtcbiAgICAgICAgICAgIHBhcnNlck9iai5wYXJzZXJbZm5dKCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBpc0lmRW5kTm9kZShub2RlLCBjb25maWcpIHtcbiAgICByZXR1cm4gZ2V0SWZOb2RlVHlwZShub2RlLCBjb25maWcpID09PSA0O1xufVxuXG5mdW5jdGlvbiBnZXRJZk5vZGVUeXBlKG5vZGUsIGNvbmZpZykge1xuICAgIGlmIChub2RlLm5vZGVUeXBlICE9PSA4KSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLmlmUHJlZml4UmVnRXhwLnRlc3Qobm9kZS5ub2RlVmFsdWUpKSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgIH1cblxuICAgIGlmIChjb25maWcuZWxpZlByZWZpeFJlZ0V4cC50ZXN0KG5vZGUubm9kZVZhbHVlKSkge1xuICAgICAgICByZXR1cm4gMjtcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLmVsc2VQcmVmaXhSZWdFeHAudGVzdChub2RlLm5vZGVWYWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIDM7XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5pZkVuZFByZWZpeFJlZ0V4cC50ZXN0KG5vZGUubm9kZVZhbHVlKSkge1xuICAgICAgICByZXR1cm4gNDtcbiAgICB9XG59XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Z0cGwvc3JjL3BhcnNlcnMvSWZEaXJlY3RpdmVQYXJzZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAyMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDRcbiAqKi8iLCIvKipcbiAqIEBmaWxlIOe7hOS7tuino+aekOWZqFxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbnZhciBFdmVudEV4cHJQYXJzZXIgPSByZXF1aXJlKCd2dHBsL3NyYy9wYXJzZXJzL0V2ZW50RXhwclBhcnNlcicpO1xudmFyIFRyZWUgPSByZXF1aXJlKCd2dHBsL3NyYy90cmVlcy9UcmVlJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCd2dHBsL3NyYy91dGlscycpO1xudmFyIENvbXBvbmVudFRyZWUgPSByZXF1aXJlKCcuL0NvbXBvbmVudFRyZWUnKTtcbnZhciBDb21wb25lbnRDaGlsZHJlbiA9IHJlcXVpcmUoJy4vQ29tcG9uZW50Q2hpbGRyZW4nKTtcbnZhciBDb21wb25lbnRNYW5hZ2VyID0gcmVxdWlyZSgnLi9Db21wb25lbnRNYW5hZ2VyJyk7XG52YXIgRG9tVXBkYXRlciA9IHJlcXVpcmUoJ3Z0cGwvc3JjL0RvbVVwZGF0ZXInKTtcblxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEV4cHJQYXJzZXIuZXh0ZW5kcyhcbiAgICB7XG5cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIEV2ZW50RXhwclBhcnNlci5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRNYW5hZ2VyID0gdGhpcy50cmVlLmdldFRyZWVWYXIoJ2NvbXBvbmVudE1hbmFnZXInKTtcbiAgICAgICAgICAgIHRoaXMuaXNDb21wb25lbnQgPSB0aGlzLm5vZGUubm9kZVR5cGUgPT09IDFcbiAgICAgICAgICAgICAgICAmJiB0aGlzLm5vZGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ3VpLScpID09PSAwO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5pc0NvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIHZhciBjb21wb25lbnROYW1lID0gdXRpbHMubGluZTJjYW1lbCh0aGlzLm5vZGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJ3VpJywgJycpKTtcblxuICAgICAgICAgICAgICAgIHZhciBDb21wb25lbnRDbGFzcyA9IHRoaXMuY29tcG9uZW50TWFuYWdlci5nZXRDbGFzcyhjb21wb25lbnROYW1lKTtcbiAgICAgICAgICAgICAgICBpZiAoIUNvbXBvbmVudENsYXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigndGhlIGNvbXBvbmVudCBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCBpcyBub3QgcmVnaXN0ZWQhJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIOe7hOS7tuacrOi6q+WwseW6lOivpeacieeahGNzc+exu+WQjVxuICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50T3JpZ2luQ3NzQ2xhc3NMaXN0ID0gQ29tcG9uZW50TWFuYWdlci5nZXRDc3NDbGFzc05hbWUoQ29tcG9uZW50Q2xhc3MpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnQgPSBuZXcgQ29tcG9uZW50Q2xhc3MoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudC5wYXJzZXIgPSB0aGlzO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5tb3VudChvcHRpb25zLnRyZWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGNvbGxlY3RFeHByczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbGxlY3RDb21wb25lbnRFeHBycygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgRXZlbnRFeHByUGFyc2VyLnByb3RvdHlwZS5jb2xsZWN0RXhwcnMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBtb3VudDogZnVuY3Rpb24gKHBhcmVudFRyZWUpIHtcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50LmNvbXBvbmVudFdpbGxNb3VudCgpO1xuXG4gICAgICAgICAgICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBkaXYuaW5uZXJIVE1MID0gJzwhLS0gJyArIHRoaXMubm9kZS50YWdOYW1lICsgJyAtLT4nXG4gICAgICAgICAgICAgICAgKyB0aGlzLmNvbXBvbmVudC50cGxcbiAgICAgICAgICAgICAgICArICc8IS0tIC8nICsgdGhpcy5ub2RlLnRhZ05hbWUgKyAnIC0tPic7XG4gICAgICAgICAgICB2YXIgc3RhcnROb2RlID0gZGl2LmZpcnN0Q2hpbGQ7XG4gICAgICAgICAgICB2YXIgZW5kTm9kZSA9IGRpdi5sYXN0Q2hpbGQ7XG5cbiAgICAgICAgICAgIHRoaXMuc3RhcnROb2RlID0gc3RhcnROb2RlO1xuICAgICAgICAgICAgdGhpcy5lbmROb2RlID0gZW5kTm9kZTtcblxuICAgICAgICAgICAgLy8g57uE5Lu255qE5L2c55So5Z+f5piv5ZKM5aSW6YOo55qE5L2c55So5Z+f6ZqU5byA55qEXG4gICAgICAgICAgICB0aGlzLnRyZWUgPSBuZXcgQ29tcG9uZW50VHJlZSh7XG4gICAgICAgICAgICAgICAgc3RhcnROb2RlOiBzdGFydE5vZGUsXG4gICAgICAgICAgICAgICAgZW5kTm9kZTogZW5kTm9kZSxcbiAgICAgICAgICAgICAgICBjb25maWc6IHBhcmVudFRyZWUuY29uZmlnLFxuICAgICAgICAgICAgICAgIGRvbVVwZGF0ZXI6IHBhcmVudFRyZWUuZG9tVXBkYXRlcixcbiAgICAgICAgICAgICAgICBleHByQ2FsY3VsYXRlcjogcGFyZW50VHJlZS5leHByQ2FsY3VsYXRlcixcblxuICAgICAgICAgICAgICAgIC8vIGNvbXBvbmVudENoaWxkcmVu5LiN6IO95Lyg57uZ5a2Q57qn57uE5Lu25qCR77yM5Y+v5Lul5Lyg57uZ5a2Q57qnZm9y5qCR44CCXG4gICAgICAgICAgICAgICAgY29tcG9uZW50Q2hpbGRyZW46IG5ldyBDb21wb25lbnRDaGlsZHJlbihcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLmZpcnN0Q2hpbGQsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS5sYXN0Q2hpbGQsXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudFRyZWUucm9vdFNjb3BlXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMudHJlZS5zZXRQYXJlbnQocGFyZW50VHJlZSk7XG4gICAgICAgICAgICB0aGlzLnRyZWUuZ2V0VHJlZVZhcignY29tcG9uZW50TWFuYWdlcicsIHRydWUpXG4gICAgICAgICAgICAgICAgLnNldFBhcmVudChwYXJlbnRUcmVlLmdldFRyZWVWYXIoJ2NvbXBvbmVudE1hbmFnZXInKSk7XG5cbiAgICAgICAgICAgIHRoaXMudHJlZS5yZWdpc3RlQ29tcG9uZW50cyh0aGlzLmNvbXBvbmVudC5jb21wb25lbnRDbGFzc2VzKTtcblxuICAgICAgICAgICAgaW5zZXJ0Q29tcG9uZW50Tm9kZXModGhpcy5ub2RlLCBzdGFydE5vZGUsIGVuZE5vZGUpO1xuXG4gICAgICAgICAgICB0aGlzLnRyZWUudHJhdmVyc2UoKTtcblxuICAgICAgICAgICAgLy8g5oqK57uE5Lu26IqC54K55pS+5YiwIERPTSDmoJHkuK3ljrtcbiAgICAgICAgICAgIGZ1bmN0aW9uIGluc2VydENvbXBvbmVudE5vZGVzKGNvbXBvbmVudE5vZGUsIHN0YXJ0Tm9kZSwgZW5kTm9kZSkge1xuICAgICAgICAgICAgICAgIHZhciBwYXJlbnROb2RlID0gY29tcG9uZW50Tm9kZS5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgIHV0aWxzLnRyYXZlcnNlTm9kZXMoXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0Tm9kZSxcbiAgICAgICAgICAgICAgICAgICAgZW5kTm9kZSxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGN1ck5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGN1ck5vZGUsIGNvbXBvbmVudE5vZGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlLnJlbW92ZUNoaWxkKGNvbXBvbmVudE5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDorr7nva7lvZPliY3oioLngrnmiJbogIXnu4Tku7bnmoTlsZ7mgKdcbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSDlsZ7mgKflkI1cbiAgICAgICAgICogQHBhcmFtIHsqfSB2YWx1ZSDlsZ7mgKflgLxcbiAgICAgICAgICovXG4gICAgICAgIHNldEF0dHI6IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKG5hbWUgPT09ICdyZWYnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kJHJlZiA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuaXNDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAobmFtZSA9PT0gJ2NsYXNzJykge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMuY29tcG9uZW50T3JpZ2luQ3NzQ2xhc3NMaXN0LmNvbmNhdChEb21VcGRhdGVyLmdldENsYXNzTGlzdCh2YWx1ZSkpO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IHRoaXMudHJlZS50cmVlLmxlbmd0aDsgaSA8IGlsOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwYXJzZXJPYmogPSB0aGlzLnRyZWUudHJlZVtpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlck9iai5wYXJzZXIuc2V0QXR0ciAmJiBwYXJzZXJPYmoucGFyc2VyLnNldEF0dHIoJ2NsYXNzJywgRG9tVXBkYXRlci5nZXRDbGFzc0xpc3QodmFsdWUpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBzY29wZSA9IHRoaXMudHJlZS5yb290U2NvcGU7XG4gICAgICAgICAgICAgICAgc2NvcGUuc2V0KG5hbWUsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIEV2ZW50RXhwclBhcnNlci5wcm90b3R5cGUuc2V0QXR0ci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5blsZ7mgKdcbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IG5hbWUg5bGe5oCn5ZCNXG4gICAgICAgICAqIEByZXR1cm4geyp9ICAgICAg5bGe5oCn5YC8XG4gICAgICAgICAqL1xuICAgICAgICBnZXRBdHRyOiBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50cmVlLnJvb3RTY29wZS5nZXQobmFtZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBFdmVudEV4cHJQYXJzZXIucHJvdG90eXBlLmdldEF0dHIodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBjb2xsZWN0Q29tcG9uZW50RXhwcnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjdXJOb2RlID0gdGhpcy5ub2RlO1xuXG4gICAgICAgICAgICB2YXIgYXR0cmlidXRlcyA9IGN1ck5vZGUuYXR0cmlidXRlcztcbiAgICAgICAgICAgIC8vIOaQnOmbhuS4jeWQq+acieihqOi+vuW8j+eahOWxnuaAp++8jOeEtuWQjuWcqOe7hOS7tuexu+WIm+W7uuWlveS5i+WQjuiuvue9rui/m+e7hOS7tlxuICAgICAgICAgICAgdGhpcy5zZXRMaXRlcmFsQXR0cnNGbnMgPSBbXTtcblxuICAgICAgICAgICAgLy8g5piv5ZCm5a2Y5ZyoY3Nz57G75ZCN55qE6K6+572u5Ye95pWwXG4gICAgICAgICAgICB2YXIgaGFzQ2xhc3MgPSBmYWxzZTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IGF0dHJpYnV0ZXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBhdHRyID0gYXR0cmlidXRlc1tpXTtcbiAgICAgICAgICAgICAgICBoYXNDbGFzcyA9IGF0dHIubm9kZU5hbWUgPT09ICdjbGFzcy1saXN0JztcblxuICAgICAgICAgICAgICAgIHZhciBleHByID0gYXR0ci5ub2RlVmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY29uZmlnLmdldEV4cHJSZWdFeHAoKS50ZXN0KGV4cHIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXhwcnMucHVzaChleHByKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmV4cHJGbnNbZXhwcl0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByYXdFeHByID0gZ2V0UmF3RXhwcihleHByLCB0aGlzLmNvbmZpZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmV4cHJDYWxjdWxhdGVyLmNyZWF0ZUV4cHJGbihyYXdFeHByKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXhwckZuc1tleHByXSA9IHV0aWxzLmJpbmQoY2FsY3VsYXRlRXhwciwgbnVsbCwgcmF3RXhwciwgdGhpcy5leHByQ2FsY3VsYXRlcik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlRm5zW2V4cHJdID0gdGhpcy51cGRhdGVGbnNbZXhwcl0gfHwgW107XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUZuc1tleHByXS5wdXNoKHV0aWxzLmJpbmQoc2V0QXR0ckZuLCB0aGlzLCBhdHRyLm5vZGVOYW1lKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0TGl0ZXJhbEF0dHJzRm5zLnB1c2goXG4gICAgICAgICAgICAgICAgICAgICAgICB1dGlscy5iaW5kKHNldEF0dHJGbiwgdGhpcywgYXR0ci5ub2RlTmFtZSwgYXR0ci5ub2RlVmFsdWUsIHRydWUpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWhhc0NsYXNzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRMaXRlcmFsQXR0cnNGbnMucHVzaChcbiAgICAgICAgICAgICAgICAgICAgdXRpbHMuYmluZChzZXRBdHRyRm4sIHRoaXMsICdjbGFzcycsIFtdKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOiuvue9rue7hOS7tuWxnuaAp+OAglxuICAgICAgICAgICAgICog55Sx5LqOSFRNTOagh+etvuS4reS4jeiDveWGmempvOWzsOW9ouW8j+eahOWxnuaAp+WQje+8jFxuICAgICAgICAgICAgICog5omA5Lul5q2k5aSE5Lya5bCG5Lit5qiq57q/5b2i5byP55qE5bGe5oCn6L2s5o2i5oiQ6am85bOw5b2i5byP44CCXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQGlubmVyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAgICAgIOWxnuaAp+WQjVxuICAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlICAgICDlsZ7mgKflgLxcbiAgICAgICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNMaXRlcmFsIOaYr+WQpuaYr+W4uOmHj+WxnuaAp1xuICAgICAgICAgICAgICogQHBhcmFtIHtDb21wb25lbnR9IGNvbXBvbmVudCDnu4Tku7ZcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZnVuY3Rpb24gc2V0QXR0ckZuKG5hbWUsIHZhbHVlLCBpc0xpdGVyYWwpIHtcbiAgICAgICAgICAgICAgICBuYW1lID0gdXRpbHMubGluZTJjYW1lbChuYW1lKTtcbiAgICAgICAgICAgICAgICBpZiAobmFtZSA9PT0gJ2NsYXNzJykge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMuY29tcG9uZW50T3JpZ2luQ3NzQ2xhc3NMaXN0LmNvbmNhdChEb21VcGRhdGVyLmdldENsYXNzTGlzdCh2YWx1ZSkpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNMaXRlcmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudE9yaWdpbkNzc0NsYXNzTGlzdCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuc2V0QXR0cihuYW1lLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZUV4cHIocmF3RXhwciwgZXhwckNhbGN1bGF0ZXIsIHNjb3BlTW9kZWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZXhwckNhbGN1bGF0ZXIuY2FsY3VsYXRlKHJhd0V4cHIsIGZhbHNlLCBzY29wZU1vZGVsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0UmF3RXhwcihleHByLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZXhwci5yZXBsYWNlKGNvbmZpZy5nZXRFeHByUmVnRXhwKCksIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFyZ3VtZW50c1sxXTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6I635Y+W5byA5aeL6IqC54K5XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICogQGluaGVyaXREb2NcbiAgICAgICAgICogQHJldHVybiB7Tm9kZX1cbiAgICAgICAgICovXG4gICAgICAgIGdldFN0YXJ0Tm9kZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zdGFydE5vZGU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBFdmVudEV4cHJQYXJzZXIucHJvdG90eXBlLmdldFN0YXJ0Tm9kZS5jYWxsKHRoaXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5bnu5PmnZ/oioLngrlcbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKiBAaW5oZXJpdERvY1xuICAgICAgICAgKiBAcmV0dXJuIHtOb2RlfVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0RW5kTm9kZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5lbmROb2RlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gRXZlbnRFeHByUGFyc2VyLnByb3RvdHlwZS5nZXRFbmROb2RlLmNhbGwodGhpcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0U2NvcGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuc2NvcGVNb2RlbCA9IHRoaXMudHJlZS5yb290U2NvcGU7XG4gICAgICAgICAgICBFdmVudEV4cHJQYXJzZXIucHJvdG90eXBlLnNldFNjb3BlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmlzQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlsID0gdGhpcy5zZXRMaXRlcmFsQXR0cnNGbnMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldExpdGVyYWxBdHRyc0Zuc1tpXSh0aGlzLmNvbXBvbmVudCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnQuY29tcG9uZW50RGlkTW91bnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBnZXRTY29wZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudHJlZS5yb290U2NvcGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gc2NvcGVNb2RlbOmHjOmdoueahOWAvOWPkeeUn+S6huWPmOWMllxuICAgICAgICBvbkNoYW5nZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNHb0RhcmspIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmlzQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgdmFyIGV4cHJzID0gdGhpcy5leHBycztcbiAgICAgICAgICAgICAgICB2YXIgZXhwck9sZFZhbHVlcyA9IHRoaXMuZXhwck9sZFZhbHVlcztcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaWwgPSBleHBycy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBleHByID0gZXhwcnNbaV07XG4gICAgICAgICAgICAgICAgICAgIHZhciBleHByVmFsdWUgPSB0aGlzLmV4cHJGbnNbZXhwcl0odGhpcy5zY29wZU1vZGVsKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kaXJ0eUNoZWNrKGV4cHIsIGV4cHJWYWx1ZSwgZXhwck9sZFZhbHVlc1tleHByXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB1cGRhdGVGbnMgPSB0aGlzLnVwZGF0ZUZuc1tleHByXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwLCBqbCA9IHVwZGF0ZUZucy5sZW5ndGg7IGogPCBqbDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlRm5zW2pdKGV4cHJWYWx1ZSwgdGhpcy5jb21wb25lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgZXhwck9sZFZhbHVlc1tleHByXSA9IGV4cHJWYWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBFdmVudEV4cHJQYXJzZXIucHJvdG90eXBlLm9uQ2hhbmdlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ29EYXJrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudHMgJiYgdGhpcy5jb21wb25lbnQuZ29EYXJrKCk7XG4gICAgICAgICAgICBFdmVudEV4cHJQYXJzZXIucHJvdG90eXBlLmdvRGFyay5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlc3RvcmVGcm9tRGFyazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRzICYmIHRoaXMuY29tcG9uZW50LnJlc3RvcmVGcm9tRGFyaygpO1xuICAgICAgICAgICAgRXZlbnRFeHByUGFyc2VyLnByb3RvdHlwZS5yZXN0b3JlRnJvbURhcmsuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICByZWY6IGZ1bmN0aW9uIChyZWYpIHtcbiAgICAgICAgICAgIHZhciBwYXJzZXJUcmVlID0gdGhpcy50cmVlLnRyZWU7XG5cbiAgICAgICAgICAgIHZhciByZXQ7XG4gICAgICAgICAgICB0aGlzLndhbGsocGFyc2VyVHJlZSwgZnVuY3Rpb24gKHBhcnNlcikge1xuICAgICAgICAgICAgICAgIGlmIChwYXJzZXIuaXNDb21wb25lbnQgJiYgcGFyc2VyLiQkcmVmID09PSByZWYpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcGFyc2VyLmNvbXBvbmVudDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9LFxuXG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50LmNvbXBvbmVudFdpbGxVbm1vdW50KCk7XG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudC5kZXN0cm95KCk7XG4gICAgICAgICAgICBFdmVudEV4cHJQYXJzZXIucHJvdG90eXBlLmRlc3Ryb3kuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6YGN5Y6GcGFyc2VyVHJlZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAcGFyYW0gIHtUcmVlfSBwYXJzZXJUcmVlIOagkVxuICAgICAgICAgKiBAcGFyYW0gIHtmdW5jdGlvbihQYXJzZXIpOmJvb2xlYW59IGl0ZXJhdGVyRm4g6L+t5Luj5Ye95pWwXG4gICAgICAgICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAgICAgICAqL1xuICAgICAgICB3YWxrOiBmdW5jdGlvbiAocGFyc2VyVHJlZSwgaXRlcmF0ZXJGbikge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlsID0gcGFyc2VyVHJlZS5sZW5ndGg7IGkgPCBpbDsgKytpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhcnNlck9iaiA9IHBhcnNlclRyZWVbaV07XG5cbiAgICAgICAgICAgICAgICAvLyDpkojlr7lpZuaMh+S7pOeahOaDheWGtVxuICAgICAgICAgICAgICAgIGlmICh1dGlscy5pc0FycmF5KHBhcnNlck9iaikpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMud2FsayhwYXJzZXJPYmosIGl0ZXJhdGVyRm4pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyDpkojlr7lmb3LmjIfku6TnmoTmg4XlhrVcbiAgICAgICAgICAgICAgICBpZiAodXRpbHMuaXNBcnJheShwYXJzZXJPYmoudHJlZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwLCBqbCA9IHBhcnNlck9iai50cmVlcy5sZW5ndGg7IGogPCBqbDsgKytqKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy53YWxrKHBhcnNlck9iai50cmVlc1tqXS50cmVlLCBpdGVyYXRlckZuKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChpdGVyYXRlckZuKHBhcnNlck9iai5wYXJzZXIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChwYXJzZXJPYmouY2hpbGRyZW4gJiYgcGFyc2VyT2JqLmNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy53YWxrKHBhcnNlck9iai5jaGlsZHJlbiwgaXRlcmF0ZXJGbikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICAgICRuYW1lOiAnQ29tcG9uZW50UGFyc2VyJ1xuICAgIH1cbik7XG5cblRyZWUucmVnaXN0ZVBhcnNlcihtb2R1bGUuZXhwb3J0cyk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Zjb21wb25lbnQvc3JjL0NvbXBvbmVudFBhcnNlci5qc1xuICoqIG1vZHVsZSBpZCA9IDIzXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNFxuICoqLyIsIi8qKlxuICogQGZpbGUg5aSE55CG5LqG5LqL5Lu255qEIEV4cHJQYXJzZXJcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG52YXIgRXhwclBhcnNlciA9IHJlcXVpcmUoJy4vRXhwclBhcnNlcicpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcbnZhciBUcmVlID0gcmVxdWlyZSgnLi4vdHJlZXMvVHJlZScpO1xudmFyIFNjb3BlTW9kZWwgPSByZXF1aXJlKCcuLi9TY29wZU1vZGVsJyk7XG52YXIgRG9tVXBkYXRlciA9IHJlcXVpcmUoJy4uL0RvbVVwZGF0ZXInKTtcblxubW9kdWxlLmV4cG9ydHMgPSBFeHByUGFyc2VyLmV4dGVuZHMoXG4gICAge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDliJ3lp4vljJZcbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKi9cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgRXhwclBhcnNlci5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgICAgICAgICB0aGlzLmV2ZW50cyA9IHt9O1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmt7vliqDooajovr7lvI9cbiAgICAgICAgICpcbiAgICAgICAgICogQGluaGVyaXRcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKiBAcGFyYW0ge0F0dHJ9IGF0dHIg5aaC5p6c5b2T5YmN5piv5YWD57Sg6IqC54K577yM5YiZ6KaB5Lyg5YWl6YGN5Y6G5Yiw55qE5bGe5oCn77yMXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgICDmiYDku6VhdHRy5a2Y5Zyo5LiO5ZCm5piv5Yik5pat5b2T5YmN5YWD57Sg5piv5ZCm5piv5paH5pys6IqC54K555qE5LiA5Liq5L6d5o2uXG4gICAgICAgICAqIEByZXR1cm4ge3VuZGVmaW5lZH1cbiAgICAgICAgICovXG4gICAgICAgIGFkZEV4cHI6IGZ1bmN0aW9uIChhdHRyKSB7XG4gICAgICAgICAgICBpZiAoIWF0dHIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gRXhwclBhcnNlci5wcm90b3R5cGUuYWRkRXhwci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZXZlbnROYW1lID0gZ2V0RXZlbnROYW1lKGF0dHIubmFtZSwgdGhpcy5jb25maWcpO1xuICAgICAgICAgICAgaWYgKCFldmVudE5hbWUgJiYgRG9tVXBkYXRlci5pc0V2ZW50TmFtZShhdHRyLm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgZXZlbnROYW1lID0gYXR0ci5uYW1lLnJlcGxhY2UoJ29uJywgJycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGV2ZW50TmFtZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbmZpZy5nZXRFeHByUmVnRXhwKCkudGVzdChhdHRyLnZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdID0gYXR0ci52YWx1ZTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgZXhwciA9IGF0dHIudmFsdWUucmVwbGFjZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29uZmlnLmdldEV4cHJSZWdFeHAoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXJndW1lbnRzWzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmV4cHJDYWxjdWxhdGVyLmNyZWF0ZUV4cHJGbihleHByLCB0cnVlKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuXG4gICAgICAgICAgICAgICAgICAgIERvbVVwZGF0ZXIuc2V0QXR0cih0aGlzLm5vZGUsICdvbicgKyBldmVudE5hbWUsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxvY2FsU2NvcGUgPSBuZXcgU2NvcGVNb2RlbCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxTY29wZS5zZXQoJ2V2ZW50JywgZXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxTY29wZS5zZXRQYXJlbnQobWUuZ2V0U2NvcGUoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZS5leHByQ2FsY3VsYXRlci5jYWxjdWxhdGUoZXhwciwgdHJ1ZSwgbG9jYWxTY29wZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIEV4cHJQYXJzZXIucHJvdG90eXBlLmFkZEV4cHIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6ZSA5q+BXG4gICAgICAgICAqXG4gICAgICAgICAqIEBpbmhlcml0XG4gICAgICAgICAqIEBwdWJsaWNcbiAgICAgICAgICovXG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHV0aWxzLmVhY2godGhpcy5ldmVudHMsIGZ1bmN0aW9uIChhdHRyVmFsdWUsIGV2ZW50TmFtZSkge1xuICAgICAgICAgICAgICAgIERvbVVwZGF0ZXIuc2V0QXR0cih0aGlzLm5vZGUsICdvbicgKyBldmVudE5hbWUpO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgICAgICB0aGlzLmV2ZW50cyA9IG51bGw7XG5cbiAgICAgICAgICAgIEV4cHJQYXJzZXIucHJvdG90eXBlLmRlc3Ryb3kuYXBwbHkodGhpcyk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgJG5hbWU6ICdFdmVudEV4cHJQYXJzZXInXG4gICAgfVxuKTtcblxuVHJlZS5yZWdpc3RlUGFyc2VyKG1vZHVsZS5leHBvcnRzKTtcblxuXG5mdW5jdGlvbiBnZXRFdmVudE5hbWUoYXR0ck5hbWUsIGNvbmZpZykge1xuICAgIGlmIChhdHRyTmFtZS5pbmRleE9mKGNvbmZpZy5ldmVudFByZWZpeCArICctJykgPT09IC0xKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZXR1cm4gYXR0ck5hbWUucmVwbGFjZShjb25maWcuZXZlbnRQcmVmaXggKyAnLScsICcnKTtcbn1cblxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL3NyYy9wYXJzZXJzL0V2ZW50RXhwclBhcnNlci5qc1xuICoqIG1vZHVsZSBpZCA9IDI0XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNFxuICoqLyIsIi8qKlxuICogQGZpbGUg6KGo6L6+5byP6Kej5p6Q5Zmo77yM5LiA5Liq5paH5pys6IqC54K55oiW6ICF5YWD57Sg6IqC54K55a+55bqU5LiA5Liq6KGo6L6+5byP6Kej5p6Q5Zmo5a6e5L6LXG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20pXG4gKi9cblxudmFyIFBhcnNlciA9IHJlcXVpcmUoJy4vUGFyc2VyJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xudmFyIFRyZWUgPSByZXF1aXJlKCcuLi90cmVlcy9UcmVlJyk7XG52YXIgRG9tVXBkYXRlciA9IHJlcXVpcmUoJy4uL0RvbVVwZGF0ZXInKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQYXJzZXIuZXh0ZW5kcyhcbiAgICB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWIneWni+WMllxuICAgICAgICAgKlxuICAgICAgICAgKiBAaW5oZXJpdERvY1xuICAgICAgICAgKiBAcGFyYW0gIHtPYmplY3R9IG9wdGlvbnMg5Y+C5pWwXG4gICAgICAgICAqIEBwYXJhbSAge05vZGV9IG9wdGlvbnMubm9kZSBET03oioLngrlcbiAgICAgICAgICovXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgICBQYXJzZXIucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgICAgICAgICAgdGhpcy5ub2RlID0gb3B0aW9ucy5ub2RlO1xuXG4gICAgICAgICAgICB0aGlzLmV4cHJzID0gW107XG4gICAgICAgICAgICB0aGlzLmV4cHJGbnMgPSB7fTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRm5zID0ge307XG4gICAgICAgICAgICAvLyDmgaLlpI3ljp/osoznmoTlh73mlbBcbiAgICAgICAgICAgIHRoaXMucmVzdG9yZUZucyA9IHt9O1xuICAgICAgICAgICAgdGhpcy5leHByT2xkVmFsdWVzID0ge307XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRE9N6IqC54K55bGe5oCn5LiO5pu05paw5bGe5oCn55qE5Lu75YqhaWTnmoTmmKDlsIRcbiAgICAgICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRoaXMuYXR0clRvRG9tVGFza0lkTWFwID0ge307XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOaQnOmbhui/h+eoi1xuICAgICAgICAgKlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IOi/lOWbnuW4g+WwlOWAvFxuICAgICAgICAgKi9cbiAgICAgICAgY29sbGVjdEV4cHJzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgY3VyTm9kZSA9IHRoaXMubm9kZTtcblxuICAgICAgICAgICAgLy8g5paH5pys6IqC54K5XG4gICAgICAgICAgICBpZiAoY3VyTm9kZS5ub2RlVHlwZSA9PT0gMykge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkRXhwcigpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDlhYPntKDoioLngrlcbiAgICAgICAgICAgIGlmIChjdXJOb2RlLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSBjdXJOb2RlLmF0dHJpYnV0ZXM7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlsID0gYXR0cmlidXRlcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkRXhwcihhdHRyaWJ1dGVzW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog5re75Yqg6KGo6L6+5byPXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICogQHBhcmFtIHtBdHRyfSBhdHRyIOWmguaenOW9k+WJjeaYr+WFg+e0oOiKgueCue+8jOWImeimgeS8oOWFpemBjeWOhuWIsOeahOWxnuaAp++8jFxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAg5omA5LulYXR0cuWtmOWcqOS4juWQpuaYr+WIpOaWreW9k+WJjeWFg+e0oOaYr+WQpuaYr+aWh+acrOiKgueCueeahOS4gOS4quS+neaNrlxuICAgICAgICAgKi9cbiAgICAgICAgYWRkRXhwcjogZnVuY3Rpb24gKGF0dHIpIHtcbiAgICAgICAgICAgIHZhciBleHByID0gYXR0ciA/IGF0dHIudmFsdWUgOiB0aGlzLm5vZGUubm9kZVZhbHVlO1xuICAgICAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5nZXRFeHByUmVnRXhwKCkudGVzdChleHByKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFkZEV4cHIoXG4gICAgICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgICAgICBleHByLFxuICAgICAgICAgICAgICAgIGF0dHJcbiAgICAgICAgICAgICAgICAgICAgPyBjcmVhdGVBdHRyVXBkYXRlRm4odGhpcy5nZXRUYXNrSWQoYXR0ci5uYW1lKSwgdGhpcy5ub2RlLCBhdHRyLm5hbWUsIHRoaXMuZG9tVXBkYXRlcilcbiAgICAgICAgICAgICAgICAgICAgOiAoZnVuY3Rpb24gKG1lLCBjdXJOb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGFza0lkID0gbWUuZG9tVXBkYXRlci5nZW5lcmF0ZVRhc2tJZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChleHByVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZS5kb21VcGRhdGVyLmFkZFRhc2tGbihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFza0lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1dGlscy5iaW5kKGZ1bmN0aW9uIChjdXJOb2RlLCBleHByVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1ck5vZGUubm9kZVZhbHVlID0gZXhwclZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBudWxsLCBjdXJOb2RlLCBleHByVmFsdWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH0pKHRoaXMsIHRoaXMubm9kZSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHRoaXMucmVzdG9yZUZuc1tleHByXSA9IHRoaXMucmVzdG9yZUZuc1tleHByXSB8fCBbXTtcbiAgICAgICAgICAgIGlmIChhdHRyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXN0b3JlRm5zW2V4cHJdLnB1c2godXRpbHMuYmluZChmdW5jdGlvbiAoY3VyTm9kZSwgYXR0ck5hbWUsIGF0dHJWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBjdXJOb2RlLnNldEF0dHJpYnV0ZShhdHRyTmFtZSwgYXR0clZhbHVlKTtcbiAgICAgICAgICAgICAgICB9LCBudWxsLCB0aGlzLm5vZGUsIGF0dHIubmFtZSwgYXR0ci52YWx1ZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXN0b3JlRm5zW2V4cHJdLnB1c2godXRpbHMuYmluZChmdW5jdGlvbiAoY3VyTm9kZSwgbm9kZVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGN1ck5vZGUubm9kZVZhbHVlID0gbm9kZVZhbHVlO1xuICAgICAgICAgICAgICAgIH0sIG51bGwsIHRoaXMubm9kZSwgdGhpcy5ub2RlLm5vZGVWYWx1ZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5blvIDlp4voioLngrlcbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKiBAaW5oZXJpdERvY1xuICAgICAgICAgKiBAcmV0dXJuIHtOb2RlfVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0U3RhcnROb2RlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ub2RlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5bnu5PmnZ/oioLngrlcbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKiBAaW5oZXJpdERvY1xuICAgICAgICAgKiBAcmV0dXJuIHtOb2RlfVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0RW5kTm9kZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubm9kZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6ZSA5q+BXG4gICAgICAgICAqXG4gICAgICAgICAqIEBpbmhlcml0RG9jXG4gICAgICAgICAqL1xuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB1dGlscy5lYWNoKHRoaXMuZXhwcnMsIGZ1bmN0aW9uIChleHByKSB7XG4gICAgICAgICAgICAgICAgdXRpbHMuZWFjaCh0aGlzLnJlc3RvcmVGbnNbZXhwcl0sIGZ1bmN0aW9uIChyZXN0b3JlRm4pIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdG9yZUZuKCk7XG4gICAgICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICAgICAgdGhpcy5ub2RlID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuZXhwcnMgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5leHByRm5zID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRm5zID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuZXhwck9sZFZhbHVlcyA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLnJlc3RvcmVGbnMgPSBudWxsO1xuXG4gICAgICAgICAgICBQYXJzZXIucHJvdG90eXBlLmRlc3Ryb3kuY2FsbCh0aGlzKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6IqC54K54oCc6ZqQ6JeP4oCd6LW35p2lXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwdWJsaWNcbiAgICAgICAgICovXG4gICAgICAgIGdvRGFyazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdXRpbHMuZ29EYXJrKHRoaXMubm9kZSk7XG4gICAgICAgICAgICB0aGlzLmlzR29EYXJrID0gdHJ1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog5ZyobW9kZWzlj5HnlJ/mlLnlj5jnmoTml7blgJnorqHnrpfkuIDkuIvooajovr7lvI/nmoTlgLwtPuiEj+ajgOa1iy0+5pu05paw55WM6Z2i44CCXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICovXG4gICAgICAgIG9uQ2hhbmdlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0dvRGFyaykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGV4cHJzID0gdGhpcy5leHBycztcbiAgICAgICAgICAgIHZhciBleHByT2xkVmFsdWVzID0gdGhpcy5leHByT2xkVmFsdWVzO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlsID0gZXhwcnMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBleHByID0gZXhwcnNbaV07XG4gICAgICAgICAgICAgICAgdmFyIGV4cHJWYWx1ZSA9IHRoaXMuZXhwckZuc1tleHByXSh0aGlzLnNjb3BlTW9kZWwpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZGlydHlDaGVjayhleHByLCBleHByVmFsdWUsIGV4cHJPbGRWYWx1ZXNbZXhwcl0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB1cGRhdGVGbnMgPSB0aGlzLnVwZGF0ZUZuc1tleHByXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGpsID0gdXBkYXRlRm5zLmxlbmd0aDsgaiA8IGpsOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZUZuc1tqXShleHByVmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZXhwck9sZFZhbHVlc1tleHByXSA9IGV4cHJWYWx1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgUGFyc2VyLnByb3RvdHlwZS5vbkNoYW5nZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDoioLngrnigJzmmL7npLrigJ3lh7rmnaVcbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKi9cbiAgICAgICAgcmVzdG9yZUZyb21EYXJrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB1dGlscy5yZXN0b3JlRnJvbURhcmsodGhpcy5ub2RlKTtcbiAgICAgICAgICAgIHRoaXMuaXNHb0RhcmsgPSBmYWxzZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog5qC55o2uRE9N6IqC54K555qE5bGe5oCn5ZCN5a2X5ou/5Yiw5LiA5Liq5Lu75YqhaWTjgIJcbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IGF0dHJOYW1lIOWxnuaAp+WQjeWtl1xuICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgIOS7u+WKoWlkXG4gICAgICAgICAqL1xuICAgICAgICBnZXRUYXNrSWQ6IGZ1bmN0aW9uIChhdHRyTmFtZSkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmF0dHJUb0RvbVRhc2tJZE1hcFthdHRyTmFtZV0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLmF0dHJUb0RvbVRhc2tJZE1hcFthdHRyTmFtZV0gPSB0aGlzLmRvbVVwZGF0ZXIuZ2VuZXJhdGVUYXNrSWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmF0dHJUb0RvbVRhc2tJZE1hcFthdHRyTmFtZV07XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiuvue9ruW9k+WJjeiKgueCueeahOWxnuaAp1xuICAgICAgICAgKlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIOWxnuaAp+WQjVxuICAgICAgICAgKiBAcGFyYW0geyp9IHZhbHVlIOWxnuaAp+WAvFxuICAgICAgICAgKi9cbiAgICAgICAgc2V0QXR0cjogZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgdGFza0lkID0gdGhpcy5nZXRUYXNrSWQoKTtcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLmRvbVVwZGF0ZXIuYWRkVGFza0ZuKHRhc2tJZCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIERvbVVwZGF0ZXIuc2V0QXR0cihtZS5ub2RlLCBuYW1lLCB2YWx1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6I635Y+W5bGe5oCnXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwdWJsaWNcbiAgICAgICAgICogQHBhcmFtICB7c3RyaW5nfSBuYW1lIOWxnuaAp+WQjVxuICAgICAgICAgKiBAcmV0dXJuIHsqfSAgICAgIOWxnuaAp+WAvFxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0QXR0cjogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiBEb21VcGRhdGVyLmdldEF0dHIodGhpcy5ub2RlLCBuYW1lKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDliKTmlq3oioLngrnmmK/lkKbmmK/lupTor6XnlLHlvZPliY3lpITnkIblmajmnaXlpITnkIZcbiAgICAgICAgICpcbiAgICAgICAgICogQHN0YXRpY1xuICAgICAgICAgKiBAcGFyYW0gIHtOb2RlfSAgbm9kZSDoioLngrlcbiAgICAgICAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICAgICAgICovXG4gICAgICAgIGlzUHJvcGVyTm9kZTogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBub2RlLm5vZGVUeXBlID09PSAxIHx8IG5vZGUubm9kZVR5cGUgPT09IDM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJG5hbWU6ICdFeHByUGFyc2VyJ1xuICAgIH1cbik7XG5cblRyZWUucmVnaXN0ZVBhcnNlcihtb2R1bGUuZXhwb3J0cyk7XG5cbi8qKlxuICog5Yib5bu6RE9N6IqC54K55bGe5oCn5pu05paw5Ye95pWwXG4gKlxuICogQGlubmVyXG4gKiBAcGFyYW0ge251bWJlcn0gdGFza0lkIGRvbeS7u+WKoWlkXG4gKiBAcGFyYW0gIHtOb2RlfSBub2RlICAgIERPTeS4reeahOiKgueCuVxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUg6KaB5pu05paw55qE5bGe5oCn5ZCNXG4gKiBAcGFyYW0gIHtEb21VcGRhdGVyfSBkb21VcGRhdGVyIERPTeabtOaWsOWZqFxuICogQHJldHVybiB7ZnVuY3Rpb24oT2JqZWN0KX0gICAgICDmm7TmlrDlh73mlbBcbiAqL1xuZnVuY3Rpb24gY3JlYXRlQXR0clVwZGF0ZUZuKHRhc2tJZCwgbm9kZSwgbmFtZSwgZG9tVXBkYXRlcikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZXhwclZhbHVlKSB7XG4gICAgICAgIGRvbVVwZGF0ZXIuYWRkVGFza0ZuKFxuICAgICAgICAgICAgdGFza0lkLFxuICAgICAgICAgICAgdXRpbHMuYmluZChmdW5jdGlvbiAobm9kZSwgbmFtZSwgZXhwclZhbHVlKSB7XG4gICAgICAgICAgICAgICAgRG9tVXBkYXRlci5zZXRBdHRyKG5vZGUsIG5hbWUsIGV4cHJWYWx1ZSk7XG4gICAgICAgICAgICB9LCBudWxsLCBub2RlLCBuYW1lLCBleHByVmFsdWUpXG4gICAgICAgICk7XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gYWRkRXhwcihwYXJzZXIsIGV4cHIsIHVwZGF0ZUZuKSB7XG4gICAgcGFyc2VyLmV4cHJzLnB1c2goZXhwcik7XG4gICAgaWYgKCFwYXJzZXIuZXhwckZuc1tleHByXSkge1xuICAgICAgICBwYXJzZXIuZXhwckZuc1tleHByXSA9IGNyZWF0ZUV4cHJGbihwYXJzZXIsIGV4cHIpO1xuICAgIH1cbiAgICBwYXJzZXIudXBkYXRlRm5zW2V4cHJdID0gcGFyc2VyLnVwZGF0ZUZuc1tleHByXSB8fCBbXTtcbiAgICBwYXJzZXIudXBkYXRlRm5zW2V4cHJdLnB1c2godXBkYXRlRm4pO1xufVxuXG4vKipcbiAqIOWIm+W7uuagueaNrnNjb3BlTW9kZWzorqHnrpfooajovr7lvI/lgLznmoTlh73mlbBcbiAqXG4gKiBAaW5uZXJcbiAqIEBwYXJhbSAge1BhcnNlcn0gcGFyc2VyIOino+aekOWZqOWunuS+i1xuICogQHBhcmFtICB7c3RyaW5nfSBleHByICAg5ZCr5pyJ6KGo6L6+5byP55qE5a2X56ym5LiyXG4gKiBAcmV0dXJuIHtmdW5jdGlvbihTY29wZSk6Kn1cbiAqL1xuZnVuY3Rpb24gY3JlYXRlRXhwckZuKHBhcnNlciwgZXhwcikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoc2NvcGVNb2RlbCkge1xuICAgICAgICAvLyDmraTlpITopoHliIbkuKTnp43mg4XlhrXvvJpcbiAgICAgICAgLy8gMeOAgWV4cHLlubbkuI3mmK/nuq/mraPnmoTooajovr7lvI/vvIzlpoJgPT0ke25hbWV9PT1g44CCXG4gICAgICAgIC8vIDLjgIFleHBy5piv57qv5q2j55qE6KGo6L6+5byP77yM5aaCYCR7bmFtZX1g44CCXG4gICAgICAgIC8vIOWvueS6juS4jee6r+ato+ihqOi+vuW8j+eahOaDheWGte+8jOatpOWkhOeahOi/lOWbnuWAvOiCr+WumuaYr+Wtl+espuS4su+8m1xuICAgICAgICAvLyDogIzlr7nkuo7nuq/mraPnmoTooajovr7lvI/vvIzmraTlpITlsLHkuI3opoHlsIblhbbovazmjaLmiJDlrZfnrKbkuLLlvaLlvI/kuobjgIJcblxuICAgICAgICB2YXIgcmVnRXhwID0gcGFyc2VyLmNvbmZpZy5nZXRFeHByUmVnRXhwKCk7XG5cbiAgICAgICAgdmFyIHBvc3NpYmxlRXhwckNvdW50ID0gZXhwci5tYXRjaChuZXcgUmVnRXhwKHV0aWxzLnJlZ0V4cEVuY29kZShwYXJzZXIuY29uZmlnLmV4cHJQcmVmaXgpLCAnZycpKTtcbiAgICAgICAgcG9zc2libGVFeHByQ291bnQgPSBwb3NzaWJsZUV4cHJDb3VudCA/IHBvc3NpYmxlRXhwckNvdW50Lmxlbmd0aCA6IDA7XG5cbiAgICAgICAgLy8g5LiN57qv5q2jXG4gICAgICAgIGlmIChwb3NzaWJsZUV4cHJDb3VudCAhPT0gMSB8fCBleHByLnJlcGxhY2UocmVnRXhwLCAnJykpIHtcbiAgICAgICAgICAgIHJldHVybiBleHByLnJlcGxhY2UocmVnRXhwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcGFyc2VyLmV4cHJDYWxjdWxhdGVyLmNyZWF0ZUV4cHJGbihhcmd1bWVudHNbMV0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZXIuZXhwckNhbGN1bGF0ZXIuY2FsY3VsYXRlKGFyZ3VtZW50c1sxXSwgZmFsc2UsIHNjb3BlTW9kZWwpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDnuq/mraNcbiAgICAgICAgdmFyIHB1cmVFeHByID0gZXhwci5zbGljZShwYXJzZXIuY29uZmlnLmV4cHJQcmVmaXgubGVuZ3RoLCAtcGFyc2VyLmNvbmZpZy5leHByU3VmZml4Lmxlbmd0aCk7XG4gICAgICAgIHBhcnNlci5leHByQ2FsY3VsYXRlci5jcmVhdGVFeHByRm4ocHVyZUV4cHIpO1xuICAgICAgICByZXR1cm4gcGFyc2VyLmV4cHJDYWxjdWxhdGVyLmNhbGN1bGF0ZShwdXJlRXhwciwgZmFsc2UsIHNjb3BlTW9kZWwpO1xuICAgIH07XG59XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Z0cGwvc3JjL3BhcnNlcnMvRXhwclBhcnNlci5qc1xuICoqIG1vZHVsZSBpZCA9IDI1XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNFxuICoqLyIsInZhciBUcmVlID0gcmVxdWlyZSgndnRwbC9zcmMvdHJlZXMvVHJlZScpO1xudmFyIEV2ZW50ID0gcmVxdWlyZSgndnRwbC9zcmMvRXZlbnQnKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJ3Z0cGwvc3JjL3V0aWxzJyk7XG52YXIgQ29tcG9uZW50TWFuYWdlciA9IHJlcXVpcmUoJy4vQ29tcG9uZW50TWFuYWdlcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRyZWUuZXh0ZW5kcyh7XG5cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICBUcmVlLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgdGhpcy5jb21wb25lbnRFdmVudCA9IG5ldyBFdmVudCgpO1xuICAgICAgICBpZiAob3B0aW9ucy5jb21wb25lbnRDaGlsZHJlbikge1xuICAgICAgICAgICAgdGhpcy5zZXRUcmVlVmFyKCdjb21wb25lbnRDaGlsZHJlbicsIG9wdGlvbnMuY29tcG9uZW50Q2hpbGRyZW4pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNvbXBvbmVudE1hbmFnZXIgPSBuZXcgQ29tcG9uZW50TWFuYWdlcigpO1xuICAgICAgICB0aGlzLnNldFRyZWVWYXIoJ2NvbXBvbmVudE1hbmFnZXInLCBjb21wb25lbnRNYW5hZ2VyKTtcbiAgICB9LFxuXG4gICAgc2V0UGFyZW50OiBmdW5jdGlvbiAocGFyZW50VHJlZSkge1xuICAgICAgICBUcmVlLnByb3RvdHlwZS5zZXRQYXJlbnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgICAgICBwYXJlbnRUcmVlLnJvb3RTY29wZS5hZGRDaGlsZCh0aGlzLnJvb3RTY29wZSk7XG4gICAgICAgIHRoaXMucm9vdFNjb3BlLnNldFBhcmVudChwYXJlbnRUcmVlLnJvb3RTY29wZSk7XG4gICAgfSxcblxuICAgIGNyZWF0ZVBhcnNlcjogZnVuY3Rpb24gKFBhcnNlckNsYXNzLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBpbnN0YW5jZSA9IFRyZWUucHJvdG90eXBlLmNyZWF0ZVBhcnNlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog5rOo5YaM57uE5Lu257G7XG4gICAgICog6K6+572u57uR5a6a5Zyo5qCR5LiK6Z2i55qE6aKd5aSW5Y+Y6YeP44CC6L+Z5Lqb5Y+Y6YeP5pyJ5aaC5LiL54m55oCn77yaXG4gICAgICogMeOAgeaXoOazleimhueblu+8m1xuICAgICAqIDLjgIHlnKjojrflj5Z0cmVlVmFyc+S4iumdouafkOS4quWPmOmHj+eahOaXtuWAme+8jOWmguaenOW9k+WJjeagkeWPluWHuuadpeaYr3VuZGVmaW5lZO+8jOmCo+S5iOWwseS8muWIsOeItue6p+agkeeahHRyZWVWYXJz5LiK5Y675om+77yM5Lul5q2k57G75o6o44CCXG4gICAgICpcbiAgICAgKiBAcHVibGljXG4gICAgICogQHBhcmFtICB7TWFwLjxzdHJpbmcsIENvbXBvbmVudD59IGNvbXBvbmVudENsYXNzZXMg57uE5Lu25ZCN5ZKM57uE5Lu257G755qE5pig5bCEXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgIOWPmOmHj+WQjVxuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUg5Y+Y6YeP5YC8XG4gICAgICovXG4gICAgcmVnaXN0ZUNvbXBvbmVudHM6IGZ1bmN0aW9uIChjb21wb25lbnRDbGFzc2VzKSB7XG4gICAgICAgIGlmICghdXRpbHMuaXNBcnJheShjb21wb25lbnRDbGFzc2VzKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNvbXBvbmVudE1hbmFnZXIgPSB0aGlzLmdldFRyZWVWYXIoJ2NvbXBvbmVudE1hbmFnZXInKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgaWwgPSBjb21wb25lbnRDbGFzc2VzLmxlbmd0aDsgaSA8IGlsOyArK2kpIHtcbiAgICAgICAgICAgIHZhciBjb21wb25lbnRDbGFzcyA9IGNvbXBvbmVudENsYXNzZXNbaV07XG4gICAgICAgICAgICBjb21wb25lbnRNYW5hZ2VyLnJlZ2lzdGUoY29tcG9uZW50Q2xhc3MpO1xuICAgICAgICB9XG4gICAgfVxufSwge1xuICAgICRuYW1lOiAnQ29tcG9uZW50VHJlZSdcbn0pO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92Y29tcG9uZW50L3NyYy9Db21wb25lbnRUcmVlLmpzXG4gKiogbW9kdWxlIGlkID0gMjZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0XG4gKiovIiwiLyoqXG4gKiBAZmlsZSDnu4Tku7bnrqHnkIbjgIJDb21wb25lbnRNYW5hZ2Vy5Lmf5piv5pyJ5bGC57qn5YWz57O755qE77yMXG4gKiAgICAgICBUcmVl5LiL6Z2i55qEQ29tcG9uZW50TWFuYWdlcuazqOWGjOi/meS4qlRyZWXlrp7kvovnlKjliLDnmoRDb21wb25lbnTvvIxcbiAqICAgICAgIOiAjOWcqENvbXBvbmVudOS4reS5n+WPr+S7peazqOWGjOatpENvbXBvbmVudOeahHRwbOS4reWwhuS8muS9v+eUqOWIsOeahENvbXBvbmVudOOAglxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJ3Z0cGwvc3JjL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIENvbXBvbmVudE1hbmFnZXIoKSB7XG4gICAgdGhpcy5jb21wb25lbnRzID0ge307XG59XG5cbi8qKlxuICog5rOo5YaM57uE5Lu244CCXG4gKlxuICogQHB1YmxpY1xuICogQHBhcmFtICB7Q29uc3RydWN0b3J9IENvbXBvbmVudENsYXNzIOe7hOS7tuexu1xuICogQHBhcmFtICB7c3RyaW5nPX0gbmFtZSAgICAgICAgICAg57uE5Lu25ZCN77yM5Y+v6YCJXG4gKi9cbkNvbXBvbmVudE1hbmFnZXIucHJvdG90eXBlLnJlZ2lzdGUgPSBmdW5jdGlvbiAoQ29tcG9uZW50Q2xhc3MpIHtcbiAgICB2YXIgbmFtZSA9IENvbXBvbmVudENsYXNzLiRuYW1lO1xuICAgIHRoaXMuY29tcG9uZW50c1tuYW1lXSA9IENvbXBvbmVudENsYXNzO1xuICAgIHRoaXMubW91bnRTdHlsZShDb21wb25lbnRDbGFzcyk7XG59O1xuXG4vKipcbiAqIOagueaNruWQjeWtl+iOt+WPlue7hOS7tuexu+OAguWcqOaooeadv+ino+aekOeahOi/h+eoi+S4reS8muiwg+eUqOi/meS4quaWueazleOAglxuICpcbiAqIEBwdWJsaWNcbiAqIEBwYXJhbSAge3N0cmluZ30gbmFtZSDnu4Tku7blkI1cbiAqIEByZXR1cm4ge0NvbXBvbmVudENsYXNzfSAg57uE5Lu257G7XG4gKi9cbkNvbXBvbmVudE1hbmFnZXIucHJvdG90eXBlLmdldENsYXNzID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB2YXIgY29tcG9uZW50ID0gdGhpcy5jb21wb25lbnRzW25hbWVdO1xuICAgIGlmIChjb21wb25lbnQpIHtcbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgICAgY29tcG9uZW50ID0gdGhpcy5wYXJlbnQuZ2V0Q2xhc3MobmFtZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbXBvbmVudDtcbn07XG5cbi8qKlxuICog6K6+572u54i257qn57uE5Lu2566h55CG5ZmoXG4gKlxuICogQHB1YmxpY1xuICogQHBhcmFtIHtDb21wb25lbnRNYW5nZXJ9IGNvbXBvbmVudE1hbmFnZXIg57uE5Lu2566h55CG5ZmoXG4gKi9cbkNvbXBvbmVudE1hbmFnZXIucHJvdG90eXBlLnNldFBhcmVudCA9IGZ1bmN0aW9uIChjb21wb25lbnRNYW5hZ2VyKSB7XG4gICAgdGhpcy5wYXJlbnQgPSBjb21wb25lbnRNYW5hZ2VyO1xufTtcblxuLyoqXG4gKiDlsIbnu4Tku7bnmoTmoLflvI/mjILovb3kuIrljrtcbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHvnu4Tku7bnsbt9IENvbXBvbmVudENsYXNzIOe7hOS7tuexu1xuICovXG5Db21wb25lbnRNYW5hZ2VyLnByb3RvdHlwZS5tb3VudFN0eWxlID0gZnVuY3Rpb24gKENvbXBvbmVudENsYXNzKSB7XG4gICAgdmFyIHN0eWxlTm9kZUlkID0gJ2NvbXBvbmVudC0nICsgQ29tcG9uZW50Q2xhc3MuJG5hbWU7XG5cbiAgICAvLyDliKTmlq3kuIDkuIvvvIzpgb/lhY3ph43lpI3mt7vliqBjc3NcbiAgICBpZiAoIWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHN0eWxlTm9kZUlkKSkge1xuICAgICAgICB2YXIgc3R5bGUgPSBDb21wb25lbnRDbGFzcy5nZXRTdHlsZSgpO1xuICAgICAgICBpZiAoc3R5bGUpIHtcbiAgICAgICAgICAgIHZhciBzdHlsZU5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICAgICAgc3R5bGVOb2RlLnNldEF0dHJpYnV0ZSgnaWQnLCBzdHlsZU5vZGVJZCk7XG4gICAgICAgICAgICBzdHlsZU5vZGUuaW5uZXJIVE1MID0gc3R5bGUucmVwbGFjZShcbiAgICAgICAgICAgICAgICAvI3Jvb3QjL2csXG4gICAgICAgICAgICAgICAgJy4nICsgQ29tcG9uZW50TWFuYWdlci5nZXRDc3NDbGFzc05hbWUoQ29tcG9uZW50Q2xhc3MpLmpvaW4oJy4nKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVOb2RlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIOWwhueItuexu+eahGNzc+agt+W8j+S5n+WKoOS4iuWOu+OAgueItuexu+W+iOWPr+iDveayoeazqOWGjO+8jOWmguaenOatpOWkhOS4jeWKoOS4iuWOu++8jOagt+W8j+WPr+iDveWwseS8mue8uuS4gOWdl+OAglxuICAgIGlmIChDb21wb25lbnRDbGFzcy4kbmFtZSAhPT0gJ0NvbXBvbmVudCcpIHtcbiAgICAgICAgdGhpcy5tb3VudFN0eWxlKENvbXBvbmVudENsYXNzLiRzdXBlckNsYXNzKTtcbiAgICB9XG59O1xuXG4vKipcbiAqIOiOt+WPlue7hOS7tueahGNzc+exu+WQjeOAguinhOWImeaYr+agueaNrue7p+aJv+WFs+ezu++8jOi/m+ihjOexu+WQjeaLvOaOpe+8jOS7juiAjOS9v+WtkOe7hOS7tuexu+eahGNzc+WFt+acieabtOmrmOS8mOWFiOe6p+OAglxuICpcbiAqIEBzdGF0aWNcbiAqIEBwYXJhbSB7Q29uc3RydWN0b3J9IENvbXBvbmVudENsYXNzIOe7hOS7tuexu1xuICogQHJldHVybiB7QXJyYXkuPHN0cmluZz59IOWQiOaIkOexu+WQjeaVsOe7hFxuICovXG5Db21wb25lbnRNYW5hZ2VyLmdldENzc0NsYXNzTmFtZSA9IGZ1bmN0aW9uIChDb21wb25lbnRDbGFzcykge1xuICAgIHZhciBuYW1lID0gW107XG4gICAgZm9yICh2YXIgY3VyQ2xzID0gQ29tcG9uZW50Q2xhc3M7IGN1ckNsczsgY3VyQ2xzID0gY3VyQ2xzLiRzdXBlckNsYXNzKSB7XG4gICAgICAgIG5hbWUucHVzaCh1dGlscy5jYW1lbDJsaW5lKGN1ckNscy4kbmFtZSkpO1xuXG4gICAgICAgIC8vIOacgOWkmuWIsOe7hOS7tuWfuuexu1xuICAgICAgICBpZiAoY3VyQ2xzLiRuYW1lID09PSAnQ29tcG9uZW50Jykge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5hbWU7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gQ29tcG9uZW50TWFuYWdlcjtcblxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92Y29tcG9uZW50L3NyYy9Db21wb25lbnRNYW5hZ2VyLmpzXG4gKiogbW9kdWxlIGlkID0gMjdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0XG4gKiovIiwiLyoqXG4gKiBAZmlsZSDnu4Tku7bnmoQgPCEtLSBjaGlsZHJlbiAtLT4g5a6e5L6L77yM6K6w5b2V55u45YWz5L+h5oGv77yM5pa55L6/5ZCO57utIENoaWxkcmVuRGlyZWN0aXZlUGFyc2VyIOino+aekFxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJ3Z0cGwvc3JjL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIENvbXBvbmVudENoaWxkcmVuKHN0YXJ0Tm9kZSwgZW5kTm9kZSwgc2NvcGUsIGNvbXBvbmVudCkge1xuICAgIHRoaXMuZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaWYgKCFzdGFydE5vZGUgfHwgIWVuZE5vZGUpIHtcbiAgICAgICAgdGhpcy5kaXYuaW5uZXJIVE1MID0gJyc7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB1dGlscy50cmF2ZXJzZU5vZGVzKFxuICAgICAgICAgICAgc3RhcnROb2RlLFxuICAgICAgICAgICAgZW5kTm9kZSxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChjdXJOb2RlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kaXYuYXBwZW5kQ2hpbGQoY3VyTm9kZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGhpc1xuICAgICAgICApO1xuICAgIH1cblxuICAgIHRoaXMuc2NvcGUgPSBzY29wZTtcbiAgICB0aGlzLmNvbXBvbmVudCA9IGNvbXBvbmVudDtcbn1cblxuQ29tcG9uZW50Q2hpbGRyZW4ucHJvdG90eXBlLmdldFRwbEh0bWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGl2LmlubmVySFRNTDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ29tcG9uZW50Q2hpbGRyZW47XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Zjb21wb25lbnQvc3JjL0NvbXBvbmVudENoaWxkcmVuLmpzXG4gKiogbW9kdWxlIGlkID0gMjhcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0XG4gKiovIiwicmVxdWlyZSgnLi9zcmMvcGFyc2Vycy9TY29wZURpcmVjdGl2ZVBhcnNlcicpO1xuXG52YXIgYW1kRXhwb3J0cyA9IHtcbiAgICBDb25maWc6IHJlcXVpcmUoJy4vc3JjL0NvbmZpZycpLFxuICAgIFRyZWU6IHJlcXVpcmUoJy4vc3JjL3RyZWVzL1RyZWUnKSxcbiAgICBEaXJ0eUNoZWNrZXI6IHJlcXVpcmUoJy4vc3JjL0RpcnR5Q2hlY2tlcicpLFxuICAgIFBhcnNlcjogcmVxdWlyZSgnLi9zcmMvcGFyc2Vycy9QYXJzZXInKSxcbiAgICBGb3JEaXJlY3RpdmVQYXJzZXI6IHJlcXVpcmUoJy4vc3JjL3BhcnNlcnMvRm9yRGlyZWN0aXZlUGFyc2VyJyksXG4gICAgSWZEaXJlY3RpdmVQYXJzZXI6IHJlcXVpcmUoJy4vc3JjL3BhcnNlcnMvSWZEaXJlY3RpdmVQYXJzZXInKSxcbiAgICBFdmVudEV4cHJQYXJzZXI6IHJlcXVpcmUoJy4vc3JjL3BhcnNlcnMvRXZlbnRFeHByUGFyc2VyJyksXG4gICAgRXhwclBhcnNlcjogcmVxdWlyZSgnLi9zcmMvcGFyc2Vycy9FeHByUGFyc2VyJyksXG4gICAgRXhwckNhbGN1bGF0ZXI6IHJlcXVpcmUoJy4vc3JjL0V4cHJDYWxjdWxhdGVyJyksXG4gICAgVmFyRGlyZWN0aXZlUGFyc2VyOiByZXF1aXJlKCcuL3NyYy9wYXJzZXJzL1ZhckRpcmVjdGl2ZVBhcnNlcicpLFxuICAgIGluaGVyaXQ6IHJlcXVpcmUoJy4vc3JjL2luaGVyaXQnKSxcbiAgICB1dGlsczogcmVxdWlyZSgnLi9zcmMvdXRpbHMnKSxcbiAgICBEb21VcGRhdGVyOiByZXF1aXJlKCcuL3NyYy9Eb21VcGRhdGVyJyksXG4gICAgU2NvcGVNb2RlbDogcmVxdWlyZSgnLi9zcmMvU2NvcGVNb2RlbCcpXG59O1xuZGVmaW5lKGZ1bmN0aW9uIChyZXF1aXJlLCBleHBvcnRzLCBtb2R1bGUpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGFtZEV4cG9ydHM7XG59KTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdnRwbC9tYWluLmpzXG4gKiogbW9kdWxlIGlkID0gMjlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0XG4gKiovIiwiLyoqXG4gKiBAZmlsZSBzY29wZSBkaXJlY3RpdmUgcGFyc2VyXG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20pXG4gKi9cblxudmFyIERpcmVjdGl2ZVBhcnNlciA9IHJlcXVpcmUoJy4vRGlyZWN0aXZlUGFyc2VyJyk7XG52YXIgU2NvcGVNb2RlbCA9IHJlcXVpcmUoJy4uL1Njb3BlTW9kZWwnKTtcbnZhciBUcmVlID0gcmVxdWlyZSgnLi4vdHJlZXMvVHJlZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERpcmVjdGl2ZVBhcnNlci5leHRlbmRzKFxuICAgIHtcbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIERpcmVjdGl2ZVBhcnNlci5wcm90b3R5cGUuaW5pdGlhbGl6ZS5jYWxsKHRoaXMsIG9wdGlvbnMpO1xuXG4gICAgICAgICAgICB0aGlzLnN0YXJ0Tm9kZSA9IG9wdGlvbnMuc3RhcnROb2RlO1xuICAgICAgICAgICAgdGhpcy5lbmROb2RlID0gb3B0aW9ucy5lbmROb2RlO1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMudHJlZS5nZXRUcmVlVmFyKCdzY29wZXMnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMudHJlZS5zZXRUcmVlVmFyKCdzY29wZXMnLCB7fSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0U2NvcGU6IGZ1bmN0aW9uIChzY29wZU1vZGVsKSB7XG4gICAgICAgICAgICB0aGlzLnNjb3BlTW9kZWwuc2V0UGFyZW50KHNjb3BlTW9kZWwpO1xuICAgICAgICAgICAgc2NvcGVNb2RlbC5hZGRDaGlsZCh0aGlzLnNjb3BlTW9kZWwpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNvbGxlY3RFeHByczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHNjb3BlTmFtZSA9IHRoaXMuc3RhcnROb2RlLm5vZGVWYWx1ZVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXHMrL2csICcnKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKHRoaXMuY29uZmlnLnNjb3BlTmFtZSArICc6JywgJycpO1xuICAgICAgICAgICAgaWYgKHNjb3BlTmFtZSkge1xuICAgICAgICAgICAgICAgIHZhciBzY29wZXMgPSB0aGlzLnRyZWUuZ2V0VHJlZVZhcignc2NvcGVzJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5zY29wZU1vZGVsID0gbmV3IFNjb3BlTW9kZWwoKTtcbiAgICAgICAgICAgICAgICBzY29wZXNbc2NvcGVOYW1lXSA9IHNjb3Blc1tzY29wZU5hbWVdIHx8IFtdO1xuICAgICAgICAgICAgICAgIHNjb3Blc1tzY29wZU5hbWVdLnB1c2godGhpcy5zY29wZU1vZGVsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0Tm9kZTogdGhpcy5zdGFydE5vZGUubmV4dFNpYmxpbmcsXG4gICAgICAgICAgICAgICAgICAgIGVuZE5vZGU6IHRoaXMuZW5kTm9kZS5wcmV2aW91c1NpYmxpbmdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICAgIGlzUHJvcGVyTm9kZTogZnVuY3Rpb24gKG5vZGUsIGNvbmZpZykge1xuICAgICAgICAgICAgcmV0dXJuIERpcmVjdGl2ZVBhcnNlci5pc1Byb3Blck5vZGUobm9kZSwgY29uZmlnKVxuICAgICAgICAgICAgICAgICYmIG5vZGUubm9kZVZhbHVlLnJlcGxhY2UoL1xccysvLCAnJykuaW5kZXhPZihjb25maWcuc2NvcGVOYW1lICsgJzonKSA9PT0gMDtcbiAgICAgICAgfSxcblxuICAgICAgICBmaW5kRW5kTm9kZTogZnVuY3Rpb24gKHN0YXJ0Tm9kZSwgY29uZmlnKSB7XG4gICAgICAgICAgICB2YXIgY3VyTm9kZSA9IHN0YXJ0Tm9kZTtcbiAgICAgICAgICAgIHdoaWxlICgoY3VyTm9kZSA9IGN1ck5vZGUubmV4dFNpYmxpbmcpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzRW5kTm9kZShjdXJOb2RlLCBjb25maWcpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjdXJOb2RlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBnZXROb0VuZE5vZGVFcnJvcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcigndGhlIHNjb3BlIGRpcmVjdGl2ZSBpcyBub3QgcHJvcGVybHkgZW5kZWQhJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJG5hbWU6ICdTY29wZURpcmVjdGl2ZVBhcnNlcidcbiAgICB9XG4pO1xuXG5UcmVlLnJlZ2lzdGVQYXJzZXIobW9kdWxlLmV4cG9ydHMpO1xuXG5mdW5jdGlvbiBpc0VuZE5vZGUobm9kZSwgY29uZmlnKSB7XG4gICAgcmV0dXJuIG5vZGUubm9kZVR5cGUgPT09IDhcbiAgICAgICAgJiYgbm9kZS5ub2RlVmFsdWUucmVwbGFjZSgvXFxzKy9nLCAnJykgPT09IGNvbmZpZy5zY29wZUVuZE5hbWU7XG59XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Z0cGwvc3JjL3BhcnNlcnMvU2NvcGVEaXJlY3RpdmVQYXJzZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAzMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDRcbiAqKi8iLCIvKipcbiAqIEBmaWxlIOmFjee9rlxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbmZ1bmN0aW9uIENvbmZpZygpIHtcbiAgICB0aGlzLmV4cHJQcmVmaXggPSAnJHsnO1xuICAgIHRoaXMuZXhwclN1ZmZpeCA9ICd9JztcblxuICAgIHRoaXMuaWZOYW1lID0gJ2lmJztcbiAgICB0aGlzLmVsaWZOYW1lID0gJ2VsaWYnO1xuICAgIHRoaXMuZWxzZU5hbWUgPSAnZWxzZSc7XG4gICAgdGhpcy5pZkVuZE5hbWUgPSAnL2lmJztcblxuICAgIHRoaXMuaWZQcmVmaXhSZWdFeHAgPSAvXlxccyppZjpcXHMqLztcbiAgICB0aGlzLmVsaWZQcmVmaXhSZWdFeHAgPSAvXlxccyplbGlmOlxccyovO1xuICAgIHRoaXMuZWxzZVByZWZpeFJlZ0V4cCA9IC9eXFxzKmVsc2VcXHMqLztcbiAgICB0aGlzLmlmRW5kUHJlZml4UmVnRXhwID0gL15cXHMqXFwvaWZcXHMqLztcblxuICAgIHRoaXMuZm9yTmFtZSA9ICdmb3InO1xuICAgIHRoaXMuZm9yRW5kTmFtZSA9ICcvZm9yJztcblxuICAgIHRoaXMuZm9yUHJlZml4UmVnRXhwID0gL15cXHMqZm9yOlxccyovO1xuICAgIHRoaXMuZm9yRW5kUHJlZml4UmVnRXhwID0gL15cXHMqXFwvZm9yXFxzKi87XG5cbiAgICB0aGlzLmV2ZW50UHJlZml4ID0gJ2V2ZW50JztcblxuICAgIHRoaXMudmFyTmFtZSA9ICd2YXInO1xuXG4gICAgdGhpcy5zY29wZU5hbWUgPSAnc2NvcGUnO1xuICAgIHRoaXMuc2NvcGVFbmROYW1lID0gJy9zY29wZSc7XG59XG5cbkNvbmZpZy5wcm90b3R5cGUuc2V0RXhwclByZWZpeCA9IGZ1bmN0aW9uIChwcmVmaXgpIHtcbiAgICB0aGlzLmV4cHJQcmVmaXggPSBwcmVmaXg7XG59O1xuXG5Db25maWcucHJvdG90eXBlLnNldEV4cHJTdWZmaXggPSBmdW5jdGlvbiAoc3VmZml4KSB7XG4gICAgdGhpcy5leHByU3VmZml4ID0gc3VmZml4O1xufTtcblxuQ29uZmlnLnByb3RvdHlwZS5nZXRFeHByUmVnRXhwID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5leHByUmVnRXhwKSB7XG4gICAgICAgIHRoaXMuZXhwclJlZ0V4cCA9IG5ldyBSZWdFeHAocmVnRXhwRW5jb2RlKHRoaXMuZXhwclByZWZpeCkgKyAnKC4rPyknICsgcmVnRXhwRW5jb2RlKHRoaXMuZXhwclN1ZmZpeCksICdnJyk7XG4gICAgfVxuICAgIHRoaXMuZXhwclJlZ0V4cC5sYXN0SW5kZXggPSAwO1xuICAgIHJldHVybiB0aGlzLmV4cHJSZWdFeHA7XG59O1xuXG5Db25maWcucHJvdG90eXBlLmdldEFsbElmUmVnRXhwID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5hbGxJZlJlZ0V4cCkge1xuICAgICAgICB0aGlzLmFsbElmUmVnRXhwID0gbmV3IFJlZ0V4cCgnXFxcXHMqKCdcbiAgICAgICAgICAgICsgdGhpcy5pZk5hbWUgKyAnfCdcbiAgICAgICAgICAgICsgdGhpcy5lbGlmTmFtZSArICd8J1xuICAgICAgICAgICAgKyB0aGlzLmVsc2VOYW1lICsgJ3wnXG4gICAgICAgICAgICArIHRoaXMuaWZFbmROYW1lICsgJyk6XFxcXHMqJywgJ2cnKTtcbiAgICB9XG4gICAgdGhpcy5hbGxJZlJlZ0V4cC5sYXN0SW5kZXggPSAwO1xuICAgIHJldHVybiB0aGlzLmFsbElmUmVnRXhwO1xufTtcblxuQ29uZmlnLnByb3RvdHlwZS5zZXRJZk5hbWUgPSBmdW5jdGlvbiAoaWZOYW1lKSB7XG4gICAgdGhpcy5pZk5hbWUgPSBpZk5hbWU7XG4gICAgdGhpcy5pZlByZWZpeFJlZ0V4cCA9IG5ldyBSZWdFeHAoJ15cXFxccyonICsgaWZOYW1lICsgJzpcXFxccyonKTtcbn07XG5cbkNvbmZpZy5wcm90b3R5cGUuc2V0RWxpZk5hbWUgPSBmdW5jdGlvbiAoZWxpZk5hbWUpIHtcbiAgICB0aGlzLmVsaWZOYW1lID0gZWxpZk5hbWU7XG4gICAgdGhpcy5lbGlmUHJlZml4UmVnRXhwID0gbmV3IFJlZ0V4cCgnXlxcXFxzKicgKyBlbGlmTmFtZSArICc6XFxcXHMqJyk7XG59O1xuXG5Db25maWcucHJvdG90eXBlLnNldEVsc2VOYW1lID0gZnVuY3Rpb24gKGVsc2VOYW1lKSB7XG4gICAgdGhpcy5lbHNlTmFtZSA9IGVsc2VOYW1lO1xuICAgIHRoaXMuZWxzZVByZWZpeFJlZ0V4cCA9IG5ldyBSZWdFeHAoJ15cXFxccyonICsgZWxzZU5hbWUgKyAnXFxcXHMqJyk7XG59O1xuXG5Db25maWcucHJvdG90eXBlLnNldElmRW5kTmFtZSA9IGZ1bmN0aW9uIChpZkVuZE5hbWUpIHtcbiAgICB0aGlzLmlmRW5kTmFtZSA9IGlmRW5kTmFtZTtcbiAgICB0aGlzLmlmRW5kUHJlZml4UmVnRXhwID0gbmV3IFJlZ0V4cCgnXlxcXFxzKicgKyBpZkVuZE5hbWUgKyAnXFxcXHMqJyk7XG59O1xuXG5Db25maWcucHJvdG90eXBlLnNldEZvck5hbWUgPSBmdW5jdGlvbiAoZm9yTmFtZSkge1xuICAgIHRoaXMuZm9yTmFtZSA9IGZvck5hbWU7XG4gICAgdGhpcy5mb3JQcmVmaXhSZWdFeHAgPSBuZXcgUmVnRXhwKCdeXFxcXHMqJyArIGZvck5hbWUgKyAnOlxcXFxzKicpO1xufTtcblxuQ29uZmlnLnByb3RvdHlwZS5zZXRGb3JFbmROYW1lID0gZnVuY3Rpb24gKGZvckVuZE5hbWUpIHtcbiAgICB0aGlzLmZvckVuZE5hbWUgPSBmb3JFbmROYW1lO1xuICAgIHRoaXMuZm9yRW5kUHJlZml4UmVnRXhwID0gbmV3IFJlZ0V4cCgnXlxcXFxzKicgKyBmb3JFbmROYW1lICsgJ1xcXFxzKicpO1xufTtcblxuQ29uZmlnLnByb3RvdHlwZS5nZXRGb3JFeHByc1JlZ0V4cCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuZm9yRXhwcnNSZWdFeHApIHtcbiAgICAgICAgdGhpcy5mb3JFeHByc1JlZ0V4cCA9IG5ldyBSZWdFeHAoJ1xcXFxzKidcbiAgICAgICAgICAgICsgdGhpcy5mb3JOYW1lXG4gICAgICAgICAgICArICc6XFxcXHMqJ1xuICAgICAgICAgICAgKyByZWdFeHBFbmNvZGUodGhpcy5leHByUHJlZml4KVxuICAgICAgICAgICAgKyAnKFteJyArIHJlZ0V4cEVuY29kZSh0aGlzLmV4cHJTdWZmaXgpXG4gICAgICAgICAgICArICddKyknICsgcmVnRXhwRW5jb2RlKHRoaXMuZXhwclN1ZmZpeCkpO1xuICAgIH1cbiAgICB0aGlzLmZvckV4cHJzUmVnRXhwLmxhc3RJbmRleCA9IDA7XG4gICAgcmV0dXJuIHRoaXMuZm9yRXhwcnNSZWdFeHA7XG59O1xuXG5Db25maWcucHJvdG90eXBlLmdldEZvckl0ZW1WYWx1ZU5hbWVSZWdFeHAgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLmZvckl0ZW1WYWx1ZU5hbWVSZWdFeHApIHtcbiAgICAgICAgdGhpcy5mb3JJdGVtVmFsdWVOYW1lUmVnRXhwID0gbmV3IFJlZ0V4cChcbiAgICAgICAgICAgICdhc1xcXFxzKicgKyByZWdFeHBFbmNvZGUodGhpcy5leHByUHJlZml4KVxuICAgICAgICAgICAgKyAnKFteJyArIHJlZ0V4cEVuY29kZSh0aGlzLmV4cHJTdWZmaXgpICsgJ10rKSdcbiAgICAgICAgICAgICsgcmVnRXhwRW5jb2RlKHRoaXMuZXhwclN1ZmZpeClcbiAgICAgICAgKTtcbiAgICB9XG4gICAgdGhpcy5mb3JJdGVtVmFsdWVOYW1lUmVnRXhwLmxhc3RJbmRleCA9IDA7XG4gICAgcmV0dXJuIHRoaXMuZm9ySXRlbVZhbHVlTmFtZVJlZ0V4cDtcbn07XG5cbkNvbmZpZy5wcm90b3R5cGUuc2V0RXZlbnRQcmVmaXggPSBmdW5jdGlvbiAocHJlZml4KSB7XG4gICAgdGhpcy5ldmVudFByZWZpeCA9IHByZWZpeDtcbn07XG5cbkNvbmZpZy5wcm90b3R5cGUuc2V0VmFyTmFtZSA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhpcy52YXJOYW1lID0gbmFtZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ29uZmlnO1xuXG5mdW5jdGlvbiByZWdFeHBFbmNvZGUoc3RyKSB7XG4gICAgcmV0dXJuICdcXFxcJyArIHN0ci5zcGxpdCgnJykuam9pbignXFxcXCcpO1xufVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL3NyYy9Db25maWcuanNcbiAqKiBtb2R1bGUgaWQgPSAzMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDRcbiAqKi8iLCIvKipcbiAqIEBmaWxlIOiEj+ajgOa1i+WZqFxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbmZ1bmN0aW9uIERpcnR5Q2hlY2tlcigpIHtcbiAgICB0aGlzLmNoZWNrZXJzID0ge307XG59XG5cbkRpcnR5Q2hlY2tlci5wcm90b3R5cGUuc2V0Q2hlY2tlciA9IGZ1bmN0aW9uIChleHByLCBjaGVja2VyRm4pIHtcbiAgICB0aGlzLmNoZWNrZXJzW2V4cHJdID0gY2hlY2tlckZuO1xufTtcblxuRGlydHlDaGVja2VyLnByb3RvdHlwZS5nZXRDaGVja2VyID0gZnVuY3Rpb24gKGV4cHIpIHtcbiAgICByZXR1cm4gdGhpcy5jaGVja2Vyc1tleHByXTtcbn07XG5cbkRpcnR5Q2hlY2tlci5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmNoZWNrZXJzID0gbnVsbDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRGlydHlDaGVja2VyO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL3NyYy9EaXJ0eUNoZWNrZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAzMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDRcbiAqKi8iLCIvKipcbiAqIEBmaWxlIOWPmOmHj+WumuS5ieaMh+S7pOino+aekOWZqFxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbnZhciBEaXJlY3RpdmVQYXJzZXIgPSByZXF1aXJlKCcuL0RpcmVjdGl2ZVBhcnNlcicpO1xudmFyIFRyZWUgPSByZXF1aXJlKCcuLi90cmVlcy9UcmVlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGlyZWN0aXZlUGFyc2VyLmV4dGVuZHMoXG4gICAge1xuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgRGlyZWN0aXZlUGFyc2VyLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgICAgIHRoaXMubm9kZSA9IG9wdGlvbnMubm9kZTtcbiAgICAgICAgfSxcblxuICAgICAgICBjb2xsZWN0RXhwcnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBleHByID0gdGhpcy5ub2RlLm5vZGVWYWx1ZS5yZXBsYWNlKHRoaXMuY29uZmlnLnZhck5hbWUgKyAnOicsICcnKTtcbiAgICAgICAgICAgIHRoaXMuZXhwckNhbGN1bGF0ZXIuY3JlYXRlRXhwckZuKGV4cHIpO1xuXG4gICAgICAgICAgICB2YXIgbGVmdFZhbHVlTmFtZSA9IGV4cHIubWF0Y2goL1xccyouKyg/PVxcPSkvKVswXS5yZXBsYWNlKC9cXHMrL2csICcnKTtcblxuICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMuZXhwckZuID0gZnVuY3Rpb24gKHNjb3BlTW9kZWwpIHtcbiAgICAgICAgICAgICAgICB2YXIgb2xkVmFsdWUgPSBzY29wZU1vZGVsLmdldChsZWZ0VmFsdWVOYW1lKTtcbiAgICAgICAgICAgICAgICB2YXIgbmV3VmFsdWUgPSBtZS5leHByQ2FsY3VsYXRlci5jYWxjdWxhdGUoZXhwciwgZmFsc2UsIHNjb3BlTW9kZWwpO1xuICAgICAgICAgICAgICAgIGlmIChvbGRWYWx1ZSAhPT0gbmV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGVNb2RlbC5zZXQobGVmdFZhbHVlTmFtZSwgbmV3VmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0U2NvcGU6IGZ1bmN0aW9uIChzY29wZU1vZGVsKSB7XG4gICAgICAgICAgICBEaXJlY3RpdmVQYXJzZXIucHJvdG90eXBlLnNldFNjb3BlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB0aGlzLmV4cHJGbih0aGlzLnNjb3BlTW9kZWwpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5blvIDlp4voioLngrlcbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKiBAaW5oZXJpdERvY1xuICAgICAgICAgKiBAcmV0dXJuIHtOb2RlfVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0U3RhcnROb2RlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ub2RlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5bnu5PmnZ/oioLngrlcbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKiBAaW5oZXJpdERvY1xuICAgICAgICAgKiBAcmV0dXJuIHtOb2RlfVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0RW5kTm9kZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubm9kZTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgICBpc1Byb3Blck5vZGU6IGZ1bmN0aW9uIChub2RlLCBjb25maWcpIHtcbiAgICAgICAgICAgIHJldHVybiBub2RlLm5vZGVUeXBlID09PSA4XG4gICAgICAgICAgICAgICAgJiYgbm9kZS5ub2RlVmFsdWUucmVwbGFjZSgvXlxccysvLCAnJykuaW5kZXhPZihjb25maWcudmFyTmFtZSArICc6JykgPT09IDA7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJG5hbWU6ICdWYXJEaXJlY3RpdmVQYXJzZXInXG4gICAgfVxuKTtcblxuVHJlZS5yZWdpc3RlUGFyc2VyKG1vZHVsZS5leHBvcnRzKTtcblxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL3NyYy9wYXJzZXJzL1ZhckRpcmVjdGl2ZVBhcnNlci5qc1xuICoqIG1vZHVsZSBpZCA9IDMzXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNFxuICoqLyIsIi8qKlxuICogQGZpbGUg57uE5Lu25Z+657G7XG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20pXG4gKi9cblxudmFyIEJhc2UgPSByZXF1aXJlKCd2dHBsL3NyYy9CYXNlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZS5leHRlbmRzKFxuICAgIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICog57uE5Lu25Yid5aeL5YyWXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICovXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHt9LFxuXG4gICAgICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiAoKSB7fSxcblxuICAgICAgICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uICgpIHt9LFxuXG4gICAgICAgIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiAoKSB7fSxcblxuICAgICAgICByZWY6IGZ1bmN0aW9uIChyZWYpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlci5yZWYocmVmKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog57uE5Lu25qih5p2/44CC5a2Q57G75Y+v5Lul6KaG55uW6L+Z5Liq5bGe5oCn44CCXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIHRwbDogJycsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOmUgOavgVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqL1xuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmJlZm9yZURlc3Ryb3koKTtcblxuICAgICAgICAgICAgdGhpcy5hZnRlckRlc3Ryb3koKTtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXREYXRhOiBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMucGFyc2VyLnNldEF0dHIobmFtZSwgdmFsdWUpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldERhdGE6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZXIuZ2V0QXR0cihuYW1lKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5bmoLflvI/lrZfnrKbkuLLjgIJcbiAgICAgICAgICpcbiAgICAgICAgICogQHN0YXRpY1xuICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IOagt+W8j+Wtl+espuS4slxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0U3R5bGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfSxcblxuICAgICAgICAkbmFtZTogJ0NvbXBvbmVudCdcbiAgICB9XG4pO1xuXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Zjb21wb25lbnQvc3JjL0NvbXBvbmVudC5qc1xuICoqIG1vZHVsZSBpZCA9IDM0XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gXCI8YnV0dG9uIGNsYXNzPVxcXCIke2NsYXNzfVxcXCIgZXZlbnQtY2xpY2s9XFxcIiR7b25DbGljayhldmVudCl9XFxcIj5cXG4gICAgPCEtLSBjaGlsZHJlbiAtLT5cXG48L2J1dHRvbj5cIjtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL0J1dHRvbi9CdXR0b24udHBsLmh0bWxcbiAqKiBtb2R1bGUgaWQgPSAzNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgNFxuICoqLyIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSgpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLmJ1dHRvbixcXG4uYnV0dG9uOmFjdGl2ZSB7XFxuICBiYWNrZ3JvdW5kOiAjZjZmNmY2O1xcbiAgaGVpZ2h0OiAzMHB4O1xcbiAgb3V0bGluZTogbm9uZTtcXG4gIGJvcmRlcjogbm9uZTtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuLmJ1dHRvbjpob3ZlciB7XFxuICBvcGFjaXR5OiAuODtcXG59XFxuLmJ1dHRvbjphY3RpdmUge1xcbiAgb3BhY2l0eTogMTtcXG59XFxuLmJ1dHRvbi5za2luLXByaW1hcnkge1xcbiAgYmFja2dyb3VuZDogIzcwY2NjMDtcXG4gIGNvbG9yOiAjZmZmO1xcbn1cXG4uYnV0dG9uLnNraW4tc3VjY2VzcyB7XFxuICBiYWNrZ3JvdW5kOiAjODBkZGExO1xcbiAgY29sb3I6ICNmZmY7XFxufVxcbi5idXR0b24uc2tpbi1pbmZvIHtcXG4gIGJhY2tncm91bmQ6ICM2YmQ1ZWM7XFxuICBjb2xvcjogI2ZmZjtcXG59XFxuLmJ1dHRvbi5za2luLXdhcm5pbmcge1xcbiAgYmFja2dyb3VuZDogI2Y5YWQ0MjtcXG4gIGNvbG9yOiAjZmZmO1xcbn1cXG4uYnV0dG9uLnNraW4tZGFuZ2VyIHtcXG4gIGJhY2tncm91bmQ6ICNmMTZjNmM7XFxuICBjb2xvcjogI2ZmZjtcXG59XFxuLmJ1dHRvbi5za2luLWxpbmsge1xcbiAgY29sb3I6ICM3MGNjYzA7XFxuICBiYWNrZ3JvdW5kOiBub25lO1xcbn1cXG5cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL0J1dHRvbi9CdXR0b24ubGVzc1xuICoqIG1vZHVsZSBpZCA9IDM2XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSA0XG4gKiovIiwiLypcclxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxyXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcclxuKi9cclxuLy8gY3NzIGJhc2UgY29kZSwgaW5qZWN0ZWQgYnkgdGhlIGNzcy1sb2FkZXJcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgbGlzdCA9IFtdO1xyXG5cclxuXHQvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXHJcblx0bGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xyXG5cdFx0dmFyIHJlc3VsdCA9IFtdO1xyXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGl0ZW0gPSB0aGlzW2ldO1xyXG5cdFx0XHRpZihpdGVtWzJdKSB7XHJcblx0XHRcdFx0cmVzdWx0LnB1c2goXCJAbWVkaWEgXCIgKyBpdGVtWzJdICsgXCJ7XCIgKyBpdGVtWzFdICsgXCJ9XCIpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJlc3VsdC5wdXNoKGl0ZW1bMV0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0LmpvaW4oXCJcIik7XHJcblx0fTtcclxuXHJcblx0Ly8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcclxuXHRsaXN0LmkgPSBmdW5jdGlvbihtb2R1bGVzLCBtZWRpYVF1ZXJ5KSB7XHJcblx0XHRpZih0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIilcclxuXHRcdFx0bW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgXCJcIl1dO1xyXG5cdFx0dmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcclxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBpZCA9IHRoaXNbaV1bMF07XHJcblx0XHRcdGlmKHR5cGVvZiBpZCA9PT0gXCJudW1iZXJcIilcclxuXHRcdFx0XHRhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XHJcblx0XHR9XHJcblx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBpdGVtID0gbW9kdWxlc1tpXTtcclxuXHRcdFx0Ly8gc2tpcCBhbHJlYWR5IGltcG9ydGVkIG1vZHVsZVxyXG5cdFx0XHQvLyB0aGlzIGltcGxlbWVudGF0aW9uIGlzIG5vdCAxMDAlIHBlcmZlY3QgZm9yIHdlaXJkIG1lZGlhIHF1ZXJ5IGNvbWJpbmF0aW9uc1xyXG5cdFx0XHQvLyAgd2hlbiBhIG1vZHVsZSBpcyBpbXBvcnRlZCBtdWx0aXBsZSB0aW1lcyB3aXRoIGRpZmZlcmVudCBtZWRpYSBxdWVyaWVzLlxyXG5cdFx0XHQvLyAgSSBob3BlIHRoaXMgd2lsbCBuZXZlciBvY2N1ciAoSGV5IHRoaXMgd2F5IHdlIGhhdmUgc21hbGxlciBidW5kbGVzKVxyXG5cdFx0XHRpZih0eXBlb2YgaXRlbVswXSAhPT0gXCJudW1iZXJcIiB8fCAhYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xyXG5cdFx0XHRcdGlmKG1lZGlhUXVlcnkgJiYgIWl0ZW1bMl0pIHtcclxuXHRcdFx0XHRcdGl0ZW1bMl0gPSBtZWRpYVF1ZXJ5O1xyXG5cdFx0XHRcdH0gZWxzZSBpZihtZWRpYVF1ZXJ5KSB7XHJcblx0XHRcdFx0XHRpdGVtWzJdID0gXCIoXCIgKyBpdGVtWzJdICsgXCIpIGFuZCAoXCIgKyBtZWRpYVF1ZXJ5ICsgXCIpXCI7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGxpc3QucHVzaChpdGVtKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH07XHJcblx0cmV0dXJuIGxpc3Q7XHJcbn07XHJcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9+L2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXG4gKiogbW9kdWxlIGlkID0gMzdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0XG4gKiovIiwiLyoqXG4gKiBAZmlsZSDkuIvmi4nlkb3ku6Toj5zljZVcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSwgaHR0cHM6Ly9naXRodWIuY29tL3lpYnV5aXNoZW5nKVxuICovXG5cbnZhciBDb250cm9sID0gcmVxdWlyZSgnLi4vQ29udHJvbCcpO1xudmFyIEJ1dHRvbiA9IHJlcXVpcmUoJy4uL0J1dHRvbi9CdXR0b24nKTtcbnZhciBMYXllciA9IHJlcXVpcmUoJy4uL0xheWVyL0xheWVyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ29udHJvbC5leHRlbmRzKFxuICAgIHtcbiAgICAgICAgdHBsOiByZXF1aXJlKCcuL0NvbW1hbmRNZW51LnRwbC5odG1sJyksXG4gICAgICAgIGNvbXBvbmVudENsYXNzZXM6IFtCdXR0b24sIExheWVyXSxcblxuICAgICAgICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgICAgIHZhciBsYXllciA9IG1lLnJlZignbGF5ZXInKTtcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgICAgICAgdG9nZ2xlTGF5ZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxheWVyLmlzU2hvdygpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXllci5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXllci5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG9uT3V0Q2xpY2s6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgICAgICBsYXllci5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBvbkl0ZW1DbGljazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBsYXllci5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvbkl0ZW1TZWxlY3RlZCA9IG1lLmdldERhdGEoJ29uSXRlbVNlbGVjdGVkJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvbkl0ZW1TZWxlY3RlZCBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkl0ZW1TZWxlY3RlZC5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgJG5hbWU6ICdDb21tYW5kTWVudScsXG4gICAgICAgIGdldFN0eWxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVxdWlyZSgnLi9Db21tYW5kTWVudS5sZXNzJylbMF1bMV07XG4gICAgICAgIH1cbiAgICB9XG4pO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9Db21tYW5kTWVudS9Db21tYW5kTWVudS5qc1xuICoqIG1vZHVsZSBpZCA9IDM5XG4gKiogbW9kdWxlIGNodW5rcyA9IDFcbiAqKi8iLCIvKipcbiAqIEBmaWxlIOW8ueWxglxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tLCBodHRwczovL2dpdGh1Yi5jb20veWlidXlpc2hlbmcpXG4gKi9cblxudmFyIENvbnRyb2wgPSByZXF1aXJlKCcuLi9Db250cm9sJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ29udHJvbC5leHRlbmRzKFxuICAgIHtcbiAgICAgICAgdHBsOiByZXF1aXJlKCcuL0xheWVyLnRwbC5odG1sJyksXG5cbiAgICAgICAgc2hvdzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGNsYXNzTGlzdCA9IHRoaXMuZ2V0RGF0YSgnY2xhc3MnLCBbXSk7XG4gICAgICAgICAgICBjbGFzc0xpc3QucHVzaCgnc2hvdycpO1xuICAgICAgICAgICAgdGhpcy5zZXREYXRhKCdjbGFzcycsIGNsYXNzTGlzdCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaGlkZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5zZXREYXRhKFxuICAgICAgICAgICAgICAgICdjbGFzcycsXG4gICAgICAgICAgICAgICAgdGhpcy5nZXREYXRhKCdjbGFzcycsIFtdKS5maWx0ZXIoZnVuY3Rpb24gKGtsYXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBrbGFzcyAhPT0gJ3Nob3cnO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzU2hvdzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGNsYXNzTGlzdCA9IHRoaXMuZ2V0RGF0YSgnY2xhc3MnLCBbXSk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaWwgPSBjbGFzc0xpc3QubGVuZ3RoOyBpIDwgaWw7ICsraSkge1xuICAgICAgICAgICAgICAgIGlmIChjbGFzc0xpc3RbaV0gPT09ICdzaG93Jykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgJG5hbWU6ICdMYXllcicsXG4gICAgICAgIGdldFN0eWxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVxdWlyZSgnLi9MYXllci5sZXNzJylbMF1bMV07XG4gICAgICAgIH1cbiAgICB9XG4pO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9MYXllci9MYXllci5qc1xuICoqIG1vZHVsZSBpZCA9IDQwXG4gKiogbW9kdWxlIGNodW5rcyA9IDFcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IFwiPGRpdiBvbmNsaWNrPVxcXCIke29uQ2xpY2soZXZlbnQpfVxcXCI+PCEtLSBjaGlsZHJlbiAtLT48L2Rpdj5cXG5cIjtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL0xheWVyL0xheWVyLnRwbC5odG1sXG4gKiogbW9kdWxlIGlkID0gNDFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMVxuICoqLyIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSgpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLmxheWVyIHtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIGRpc3BsYXk6IG5vbmU7XFxufVxcbi5sYXllci5zaG93IHtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbn1cXG5cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL0xheWVyL0xheWVyLmxlc3NcbiAqKiBtb2R1bGUgaWQgPSA0MlxuICoqIG1vZHVsZSBjaHVua3MgPSAxXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxkaXYgZXZlbnQtb3V0Y2xpY2s9XFxcIiR7b25PdXRDbGljayhldmVudCl9XFxcIj5cXG4gICAgPHVpLWJ1dHRvbiBjbGFzcz1cXFwic2tpbi1wcmltYXJ5XFxcIlxcbiAgICAgICAgb24tY2xpY2s9XFxcIiR7dG9nZ2xlTGF5ZXJ9XFxcIj5cXG4gICAgICAgICR7dGl0bGV9XFxuICAgICAgICA8c3BhbiBjbGFzcz1cXFwidHJpYW5nbGUtZG93blxcXCI+PC9zcGFuPlxcbiAgICA8L3VpLWJ1dHRvbj5cXG4gICAgPHVpLWxheWVyIHJlZj1cXFwibGF5ZXJcXFwiIG9uLW91dC1jbGljaz1cXFwiJHtvdXRDbGlja31cXFwiPlxcbiAgICAgICAgPCEtLSBmb3I6ICR7aXRlbXN9IGFzICR7aXRlbX0gLS0+XFxuICAgICAgICAgICAgPHAgb25jbGljaz1cXFwiJHtvbkl0ZW1DbGljayhldmVudCwgaXRlbSl9XFxcIj4ke2l0ZW0ubGFiZWx9PC9wPlxcbiAgICAgICAgPCEtLSAvZm9yIC0tPlxcbiAgICA8L3VpLWxheWVyPlxcbjwvZGl2PlxcblwiO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvQ29tbWFuZE1lbnUvQ29tbWFuZE1lbnUudHBsLmh0bWxcbiAqKiBtb2R1bGUgaWQgPSA0M1xuICoqIG1vZHVsZSBjaHVua3MgPSAxXG4gKiovIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIuY29tbWFuZC1tZW51IHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG59XFxuLmNvbW1hbmQtbWVudSAudHJpYW5nbGUtZG93biB7XFxuICBib3JkZXI6IDAgc29saWQgdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItdG9wLXdpZHRoOiA2cHg7XFxuICBib3JkZXItbGVmdC13aWR0aDogNXB4O1xcbiAgYm9yZGVyLXJpZ2h0LXdpZHRoOiA1cHg7XFxuICBib3JkZXItdG9wLWNvbG9yOiAjZmZmO1xcbiAgd2lkdGg6IDA7XFxuICBoZWlnaHQ6IDA7XFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICB0b3A6IC0xcHg7XFxufVxcbi5jb21tYW5kLW1lbnUgLmxheWVyIHtcXG4gIGJhY2tncm91bmQ6ICNlYmViZWI7XFxufVxcbi5jb21tYW5kLW1lbnUgLmxheWVyIHAge1xcbiAgd2lkdGg6IDEwMHB4O1xcbiAgcGFkZGluZzogNXB4O1xcbiAgbGluZS1oZWlnaHQ6IDEuNTtcXG4gIG1hcmdpbjogMDtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuLmNvbW1hbmQtbWVudSAubGF5ZXIgcDpob3ZlciB7XFxuICBiYWNrZ3JvdW5kOiAjZmVmOGU5O1xcbn1cXG5cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL0NvbW1hbmRNZW51L0NvbW1hbmRNZW51Lmxlc3NcbiAqKiBtb2R1bGUgaWQgPSA0NFxuICoqIG1vZHVsZSBjaHVua3MgPSAxXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBcIjwhLS0gdmFyOiBpdGVtcyA9IFt7bGFiZWw6ICflvKDkuIknfSwge2xhYmVsOiAn5p2O5ZubJ30sIHtsYWJlbDogJ+eOi+S6lCd9XSAtLT5cXG48dWktY29tbWFuZC1tZW51IHRpdGxlPVxcXCIke3RpdGxlfVxcXCIgaXRlbXM9XFxcIiR7aXRlbXN9XFxcIiBvbi1pdGVtLXNlbGVjdGVkPVxcXCIke29uSXRlbVNlbGVjdGVkfVxcXCI+PC91aS1jb21tYW5kLW1lbnU+XFxuXCI7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3Rlc3QvQ29tbWFuZE1lbnUudHBsLmh0bWxcbiAqKiBtb2R1bGUgaWQgPSA0NVxuICoqIG1vZHVsZSBjaHVua3MgPSAxXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==