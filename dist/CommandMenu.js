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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYWYzODg3NTUxYjhlN2MzZDMzNzEiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9Db21tYW5kTWVudS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvQnV0dG9uL0J1dHRvbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvQ29udHJvbC5qcyIsIndlYnBhY2s6Ly8vLi4vdmNvbXBvbmVudC9zcmMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi4vdmNvbXBvbmVudC9zcmMvQ2hpbGRyZW5EaXJlY3RpdmVQYXJzZXIuanMiLCJ3ZWJwYWNrOi8vLy4uL3Z0cGwvc3JjL3BhcnNlcnMvRGlyZWN0aXZlUGFyc2VyLmpzIiwid2VicGFjazovLy8uLi92dHBsL3NyYy9wYXJzZXJzL1BhcnNlci5qcyIsIndlYnBhY2s6Ly8vLi4vdnRwbC9zcmMvQmFzZS5qcyIsIndlYnBhY2s6Ly8vLi4vdnRwbC9zcmMvaW5oZXJpdC5qcyIsIndlYnBhY2s6Ly8vLi4vdnRwbC9zcmMvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4uL3Zjb21wb25lbnQvc3JjL0NoaWxkcmVuVHJlZS5qcyIsIndlYnBhY2s6Ly8vLi4vdnRwbC9zcmMvdHJlZXMvVHJlZS5qcyIsIndlYnBhY2s6Ly8vLi4vdnRwbC9zcmMvRXhwckNhbGN1bGF0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4uL3Z0cGwvc3JjL0RvbVVwZGF0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4uL3Z0cGwvc3JjL2xvZy5qcyIsIndlYnBhY2s6Ly8vLi4vdnRwbC9zcmMvU2NvcGVNb2RlbC5qcyIsIndlYnBhY2s6Ly8vLi4vdnRwbC9zcmMvRXZlbnQuanMiLCJ3ZWJwYWNrOi8vLy4uL3Zjb21wb25lbnQvc3JjL0ZvckRpcmVjdGl2ZVBhcnNlci5qcyIsIndlYnBhY2s6Ly8vLi4vdnRwbC9zcmMvcGFyc2Vycy9Gb3JEaXJlY3RpdmVQYXJzZXIuanMiLCJ3ZWJwYWNrOi8vLy4uL3Z0cGwvc3JjL3RyZWVzL0ZvclRyZWUuanMiLCJ3ZWJwYWNrOi8vLy4uL3Zjb21wb25lbnQvc3JjL0lmRGlyZWN0aXZlUGFyc2VyLmpzIiwid2VicGFjazovLy8uLi92dHBsL3NyYy9wYXJzZXJzL0lmRGlyZWN0aXZlUGFyc2VyLmpzIiwid2VicGFjazovLy8uLi92Y29tcG9uZW50L3NyYy9Db21wb25lbnRQYXJzZXIuanMiLCJ3ZWJwYWNrOi8vLy4uL3Z0cGwvc3JjL3BhcnNlcnMvRXZlbnRFeHByUGFyc2VyLmpzIiwid2VicGFjazovLy8uLi92dHBsL3NyYy9wYXJzZXJzL0V4cHJQYXJzZXIuanMiLCJ3ZWJwYWNrOi8vLy4uL3Zjb21wb25lbnQvc3JjL0NvbXBvbmVudFRyZWUuanMiLCJ3ZWJwYWNrOi8vLy4uL3Zjb21wb25lbnQvc3JjL0NvbXBvbmVudE1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4uL3Zjb21wb25lbnQvc3JjL0NvbXBvbmVudENoaWxkcmVuLmpzIiwid2VicGFjazovLy8uLi92dHBsL21haW4uanMiLCJ3ZWJwYWNrOi8vLy4uL3Z0cGwvc3JjL3BhcnNlcnMvU2NvcGVEaXJlY3RpdmVQYXJzZXIuanMiLCJ3ZWJwYWNrOi8vLy4uL3Z0cGwvc3JjL0NvbmZpZy5qcyIsIndlYnBhY2s6Ly8vLi4vdnRwbC9zcmMvRGlydHlDaGVja2VyLmpzIiwid2VicGFjazovLy8uLi92dHBsL3NyYy9wYXJzZXJzL1ZhckRpcmVjdGl2ZVBhcnNlci5qcyIsIndlYnBhY2s6Ly8vLi4vdmNvbXBvbmVudC9zcmMvQ29tcG9uZW50LmpzIiwid2VicGFjazovLy8uL3NyYy9CdXR0b24vQnV0dG9uLnRwbC5odG1sIiwid2VicGFjazovLy8uL3NyYy9CdXR0b24vQnV0dG9uLmxlc3MiLCJ3ZWJwYWNrOi8vLy4vfi9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvQ29tbWFuZE1lbnUvQ29tbWFuZE1lbnUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0xheWVyL0xheWVyLmpzIiwid2VicGFjazovLy8uL3NyYy9MYXllci9MYXllci50cGwuaHRtbCIsIndlYnBhY2s6Ly8vLi9zcmMvTGF5ZXIvTGF5ZXIubGVzcyIsIndlYnBhY2s6Ly8vLi9zcmMvQ29tbWFuZE1lbnUvQ29tbWFuZE1lbnUudHBsLmh0bWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL0NvbW1hbmRNZW51L0NvbW1hbmRNZW51Lmxlc3MiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9Db21tYW5kTWVudS50cGwuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ3RDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFnQyxrQkFBa0I7QUFDbEQ7QUFDQSxjQUFhO0FBQ2I7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7Ozs7Ozs7OztBQzlCQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDbEJBOztBQUVBLGlEQUFnRCxHQUFHLGlCQUFpQjs7Ozs7OztBQ0ZwRTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7Ozs7Ozs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEwQyxRQUFRO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUMxTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRzs7Ozs7O0FDUkE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7Ozs7Ozs7QUNwREE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQy9DQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0RBQW1ELFFBQVE7QUFDM0Q7QUFDQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDJDQUEwQyxRQUFRO0FBQ2xEO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxjQUFhO0FBQ2I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0EsY0FBYTs7QUFFYjtBQUNBO0FBQ0EsY0FBYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQWtELFFBQVE7QUFDMUQ7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBOzs7Ozs7O0FDcktBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBbUIsZUFBZTtBQUNsQztBQUNBO0FBQ0EsdURBQXNELFFBQVE7QUFDOUQ7QUFDQSxvREFBbUQsUUFBUTtBQUMzRDtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTs7QUFFYjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQSwrQ0FBOEMsUUFBUTtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1QsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3ZLQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7O0FBRWI7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFtQixPQUFPO0FBQzFCLG9CQUFtQixFQUFFO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsZ0VBQStELFFBQVE7QUFDdkU7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFvQixPQUFPO0FBQzNCLHFCQUFvQixFQUFFO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxVQUFTOztBQUVUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvREFBbUQsUUFBUTtBQUMz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QzdDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTs7Ozs7Ozs7QUMxR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OzttQ0MvQkE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQzs7Ozs7OztBQ3BCRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLGtEQUFpRDtBQUNqRDtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQSxVQUFTOztBQUVUO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQzFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDBCQUF5QjtBQUN6Qix5QkFBd0I7O0FBRXhCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7O0FDaElBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBOztBQUVBOzs7Ozs7OztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBa0M7O0FB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QUFvQixHQUFHLGdDQUFnQyx3QkFBd0IsR0FBRzs7QUFFaGpCOzs7Ozs7O0FDUEEsdUNBQXNDLFlBQVksR0FBRyxZQUFZLEdBQUcsWUFBWSxrQ0FBa0MsTUFBTSxhQUFhLE1BQU0sd0JBQXdCLGVBQWUseUIiLCJmaWxlIjoiQ29tbWFuZE1lbnUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIGFmMzg4NzU1MWI4ZTdjM2QzMzcxXG4gKiovIiwidmFyIENvbW1hbmRNZW51ID0gcmVxdWlyZSgnLi4vc3JjL0NvbW1hbmRNZW51L0NvbW1hbmRNZW51Jyk7XG52YXIgdmNvbXBvbmVudCA9IHJlcXVpcmUoJ3Zjb21wb25lbnQnKTtcblxudmFyIE1haW4gPSB2Y29tcG9uZW50LkNvbXBvbmVudC5leHRlbmRzKFxuICAgIHtcbiAgICAgICAgdHBsOiByZXF1aXJlKCcuL0NvbW1hbmRNZW51LnRwbC5odG1sJyksXG4gICAgICAgIGNvbXBvbmVudENsYXNzZXM6IFtDb21tYW5kTWVudV0sXG4gICAgICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJ+ivt+mAieaLqScsXG4gICAgICAgICAgICAgICAgb25JdGVtU2VsZWN0ZWQ6IGZ1bmN0aW9uIChldmVudCwgaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICBtZS5zZXREYXRhKHt0aXRsZTogaXRlbS5sYWJlbH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICAgICRuYW1lOiAnTWFpbidcbiAgICB9XG4pO1xuXG52YXIgbWFpbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluJyk7XG52Y29tcG9uZW50Lm1vdW50KFxuICAgIHtcbiAgICAgICAgY29uZmlnOiBuZXcgdmNvbXBvbmVudC5Db25maWcoKSxcbiAgICAgICAgc3RhcnROb2RlOiBtYWluLFxuICAgICAgICBlbmROb2RlOiBtYWluXG4gICAgfSxcbiAgICBbTWFpbl1cbik7XG5cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi90ZXN0L0NvbW1hbmRNZW51LmpzXG4gKiogbW9kdWxlIGlkID0gMFxuICoqIG1vZHVsZSBjaHVua3MgPSAxXG4gKiovIiwiLyoqXG4gKiBAZmlsZSDmjInpkq7mjqfku7ZcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSwgaHR0cHM6Ly9naXRodWIuY29tL3lpYnV5aXNoZW5nKVxuICovXG5cbnZhciBDb250cm9sID0gcmVxdWlyZSgnLi4vQ29udHJvbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbnRyb2wuZXh0ZW5kcyhcbiAgICB7XG4gICAgICAgIHRwbDogcmVxdWlyZSgnLi9CdXR0b24udHBsLmh0bWwnKVxuICAgIH0sXG4gICAge1xuICAgICAgICAkbmFtZTogJ0J1dHRvbicsXG5cbiAgICAgICAgZ2V0U3R5bGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiByZXF1aXJlKCcuL0J1dHRvbi5sZXNzJylbMF1bMV07XG4gICAgICAgIH1cbiAgICB9XG4pO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9CdXR0b24vQnV0dG9uLmpzXG4gKiogbW9kdWxlIGlkID0gMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMlxuICoqLyIsInZhciB2Y29tcG9uZW50ID0gcmVxdWlyZSgndmNvbXBvbmVudCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHZjb21wb25lbnQuQ29tcG9uZW50LmV4dGVuZHMoe30sIHskbmFtZTogJ0NvbnRyb2wnfSk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL0NvbnRyb2wuanNcbiAqKiBtb2R1bGUgaWQgPSAzXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyXG4gKiovIiwicmVxdWlyZSgnLi9DaGlsZHJlbkRpcmVjdGl2ZVBhcnNlcicpO1xucmVxdWlyZSgnLi9Gb3JEaXJlY3RpdmVQYXJzZXInKTtcbnJlcXVpcmUoJy4vSWZEaXJlY3RpdmVQYXJzZXInKTtcbnJlcXVpcmUoJy4vQ29tcG9uZW50UGFyc2VyJyk7XG5cbnZhciBDb21wb25lbnRUcmVlID0gcmVxdWlyZSgnLi9Db21wb25lbnRUcmVlJyk7XG52YXIgZG9tRGF0YUJpbmQgPSByZXF1aXJlKCd2dHBsJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIENvbXBvbmVudDogcmVxdWlyZSgnLi9Db21wb25lbnQnKSxcbiAgICBtb3VudDogZnVuY3Rpb24gKG9wdGlvbnMsIENvbXBvbmVudENsYXNzZXMpIHtcbiAgICAgICAgdmFyIHRyZWUgPSBuZXcgQ29tcG9uZW50VHJlZShvcHRpb25zKTtcbiAgICAgICAgdHJlZS5yZWdpc3RlQ29tcG9uZW50cyhDb21wb25lbnRDbGFzc2VzKTtcbiAgICAgICAgdHJlZS50cmF2ZXJzZSgpO1xuICAgICAgICByZXR1cm4gdHJlZTtcbiAgICB9LFxuICAgIENvbmZpZzogZG9tRGF0YUJpbmQuQ29uZmlnXG59O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92Y29tcG9uZW50L3NyYy9tYWluLmpzXG4gKiogbW9kdWxlIGlkID0gNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMlxuICoqLyIsIi8qKlxuICogQGZpbGUgY2hpbGRyZW4g5oyH5LukIDwhLS0gY2hpbGRyZW4gLS0+IO+8jOWPquaciee7hOS7tuS4reaJjeS8muWtmOWcqOivpeaMh+S7pFxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbnZhciBEaXJlY3RpdmVQYXJzZXIgPSByZXF1aXJlKCd2dHBsL3NyYy9wYXJzZXJzL0RpcmVjdGl2ZVBhcnNlcicpO1xudmFyIENoaWxkcmVuVHJlZSA9IHJlcXVpcmUoJy4vQ2hpbGRyZW5UcmVlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGlyZWN0aXZlUGFyc2VyLmV4dGVuZHMoXG4gICAge1xuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgRGlyZWN0aXZlUGFyc2VyLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgICAgIHRoaXMubm9kZSA9IG9wdGlvbnMubm9kZTtcbiAgICAgICAgfSxcblxuICAgICAgICBjb2xsZWN0RXhwcnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjb21wb25lbnRDaGlsZHJlbiA9IHRoaXMudHJlZS5nZXRUcmVlVmFyKCdjb21wb25lbnRDaGlsZHJlbicsIHRydWUpO1xuICAgICAgICAgICAgaWYgKCFjb21wb25lbnRDaGlsZHJlbikge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgZGl2LmlubmVySFRNTCA9IGNvbXBvbmVudENoaWxkcmVuLmdldFRwbEh0bWwoKTtcblxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlblRyZWUgPSBuZXcgQ2hpbGRyZW5UcmVlKHtcbiAgICAgICAgICAgICAgICBzdGFydE5vZGU6IGRpdi5maXJzdENoaWxkLFxuICAgICAgICAgICAgICAgIGVuZE5vZGU6IGRpdi5sYXN0Q2hpbGQsXG4gICAgICAgICAgICAgICAgY29uZmlnOiB0aGlzLnRyZWUuY29uZmlnLFxuICAgICAgICAgICAgICAgIGRvbVVwZGF0ZXI6IHRoaXMudHJlZS5kb21VcGRhdGVyLFxuICAgICAgICAgICAgICAgIGV4cHJDYWxjdWxhdGVyOiB0aGlzLnRyZWUuZXhwckNhbGN1bGF0ZXJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlblRyZWUuc2V0UGFyZW50KHRoaXMudHJlZSk7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuVHJlZS50cmF2ZXJzZSgpO1xuXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuVHJlZS5yb290U2NvcGUuc2V0UGFyZW50KGNvbXBvbmVudENoaWxkcmVuLnNjb3BlKTtcbiAgICAgICAgICAgIGNvbXBvbmVudENoaWxkcmVuLnNjb3BlLmFkZENoaWxkKHRoaXMuY2hpbGRyZW5UcmVlLnJvb3RTY29wZSk7XG5cbiAgICAgICAgICAgIHdoaWxlIChkaXYuY2hpbGROb2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZGl2LmNoaWxkTm9kZXNbMF0sIHRoaXMubm9kZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5blvIDlp4voioLngrlcbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKiBAaW5oZXJpdERvY1xuICAgICAgICAgKiBAcmV0dXJuIHtOb2RlfVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0U3RhcnROb2RlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuY2hpbGRyZW5UcmVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubm9kZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuVHJlZS5zdGFydE5vZGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiOt+WPlue7k+adn+iKgueCuVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICAqIEBpbmhlcml0RG9jXG4gICAgICAgICAqIEByZXR1cm4ge05vZGV9XG4gICAgICAgICAqL1xuICAgICAgICBnZXRFbmROb2RlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ub2RlO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5UcmVlLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgdGhpcy5ub2RlID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5UcmVlID0gbnVsbDtcblxuICAgICAgICAgICAgRGlyZWN0aXZlUGFyc2VyLnByb3RvdHlwZS5kZXN0cm95LmFwcGx5KHRoaXMpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICAgIGlzUHJvcGVyTm9kZTogZnVuY3Rpb24gKG5vZGUsIGNvbmZpZykge1xuICAgICAgICAgICAgcmV0dXJuIG5vZGUubm9kZVR5cGUgPT09IDhcbiAgICAgICAgICAgICAgICAmJiBub2RlLm5vZGVWYWx1ZS5yZXBsYWNlKC9cXHMvZywgJycpID09PSAnY2hpbGRyZW4nO1xuICAgICAgICB9LFxuXG4gICAgICAgICRuYW1lOiAnQ2hpbGRyZW5EaXJlY3RpdmVQYXJzZXInXG4gICAgfVxuKTtcblxuQ2hpbGRyZW5UcmVlLnJlZ2lzdGVQYXJzZXIobW9kdWxlLmV4cG9ydHMpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92Y29tcG9uZW50L3NyYy9DaGlsZHJlbkRpcmVjdGl2ZVBhcnNlci5qc1xuICoqIG1vZHVsZSBpZCA9IDVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDJcbiAqKi8iLCIvKipcbiAqIEBmaWxlIOaMh+S7pOino+aekOWZqOaKveixoeexu+OAguaMh+S7pOiKgueCueS4gOWumuaYr+azqOmHiuiKgueCuVxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbnZhciBQYXJzZXIgPSByZXF1aXJlKCcuL1BhcnNlcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBhcnNlci5leHRlbmRzKFxuICAgIHt9LFxuICAgIHtcbiAgICAgICAgaXNQcm9wZXJOb2RlOiBmdW5jdGlvbiAobm9kZSwgY29uZmlnKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5ub2RlVHlwZSA9PT0gODtcbiAgICAgICAgfSxcbiAgICAgICAgJG5hbWU6ICdEaXJlY3RpdmVQYXJzZXInXG4gICAgfVxuKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdnRwbC9zcmMvcGFyc2Vycy9EaXJlY3RpdmVQYXJzZXIuanNcbiAqKiBtb2R1bGUgaWQgPSA2XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyXG4gKiovIiwiLyoqXG4gKiBAZmlsZSDop6PmnpDlmajnmoTmir3osaHln7rnsbtcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG4vKipcbiAqIOaehOmAoOWHveaVsFxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMg6YWN572u5Y+C5pWw77yM5LiA6Iis5Y+v6IO95Lya5pyJ5aaC5LiL5YaF5a6577yaXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnROb2RlOiAuLi4sXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kTm9kZTogLi4uLFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGU6IC4uLixcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IC4uLlxuICogICAgICAgICAgICAgICAgICAgICAgICAgfVxuICogICAgICAgICAgICAgICAgICAgICAgICAg5YW35L2T5piv5ZWl5Y+v5Lul5Y+C5Yqg5YW35L2T55qE5a2Q57G7XG4gKi9cblxudmFyIEJhc2UgPSByZXF1aXJlKCcuLi9CYXNlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IEJhc2UuZXh0ZW5kcyhcbiAgICB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWIneWni+WMllxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIOadpeiHquS6juaehOmAoOWHveaVsFxuICAgICAgICAgKi9cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMuZXhwckNhbGN1bGF0ZXIgPSBvcHRpb25zLmV4cHJDYWxjdWxhdGVyO1xuICAgICAgICAgICAgdGhpcy5jb25maWcgPSBvcHRpb25zLmNvbmZpZztcbiAgICAgICAgICAgIHRoaXMuZG9tVXBkYXRlciA9IG9wdGlvbnMuZG9tVXBkYXRlcjtcbiAgICAgICAgICAgIHRoaXMudHJlZSA9IG9wdGlvbnMudHJlZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog57uR5a6ac2NvcGUgbW9kZWxcbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAcGFyYW0ge1Njb3BlTW9kZWx9IHNjb3BlTW9kZWwgc2NvcGUgbW9kZWxcbiAgICAgICAgICovXG4gICAgICAgIHNldFNjb3BlOiBmdW5jdGlvbiAoc2NvcGVNb2RlbCkge1xuICAgICAgICAgICAgdGhpcy5zY29wZU1vZGVsID0gc2NvcGVNb2RlbDtcblxuICAgICAgICAgICAgdGhpcy5zY29wZU1vZGVsLm9uKCdjaGFuZ2UnLCB0aGlzLm9uQ2hhbmdlLCB0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuc2NvcGVNb2RlbC5vbigncGFyZW50Y2hhbmdlJywgdGhpcy5vbkNoYW5nZSwgdGhpcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIG1vZGVsIOWPkeeUn+WPmOWMlueahOWbnuiwg+WHveaVsFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICAqL1xuICAgICAgICBvbkNoYW5nZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5kb21VcGRhdGVyLmV4ZWN1dGUoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6I635Y+Wc2NvcGUgbW9kZWxcbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAcmV0dXJuIHtTY29wZU1vZGVsfSBzY29wZSBtb2RlbOWvueixoVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0U2NvcGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNjb3BlTW9kZWw7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWQkXNjb3BlIG1vZGVs6YeM6Z2i6K6+572u5pWw5o2uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwdWJsaWNcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEg6KaB6K6+572u55qE5pWw5o2uXG4gICAgICAgICAqL1xuICAgICAgICBzZXREYXRhOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgdGhpcy5zY29wZU1vZGVsLnNldChkYXRhKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6ZqQ6JeP5b2T5YmNcGFyc2Vy5a6e5L6L55u45YWz55qE6IqC54K544CC5YW35L2T5a2Q57G75a6e546wXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwdWJsaWNcbiAgICAgICAgICogQGFic3RyYWN0XG4gICAgICAgICAqL1xuICAgICAgICBnb0Rhcms6IGZ1bmN0aW9uICgpIHt9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmmL7npLrnm7jlhbPlhYPntKBcbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAYWJzdHJhY3RcbiAgICAgICAgICovXG4gICAgICAgIHJlc3RvcmVGcm9tRGFyazogZnVuY3Rpb24gKCkge30sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiOt+WPluino+aekOWZqOW9k+WJjeeKtuaAgeS4i+eahOW8gOWni0RPTeiKgueCueOAglxuICAgICAgICAgKlxuICAgICAgICAgKiDnlLHkuo7mnInnmoTop6PmnpDlmajkvJrlsIbkuYvliY3nmoToioLngrnnp7vpmaTmjonvvIzpgqPkuYjlsLHkvJrlr7npgY3ljobluKbmnaXlvbHlk43kuobvvIxcbiAgICAgICAgICog5omA5Lul5q2k5aSE5o+Q5L6b5Lik5Liq6I635Y+W5byA5aeL6IqC54K55ZKM57uT5p2f6IqC54K555qE5pa55rOV44CCXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwdWJsaWNcbiAgICAgICAgICogQHJldHVybiB7Tm9kZX0gRE9N6IqC54K55a+56LGhXG4gICAgICAgICAqL1xuICAgICAgICBnZXRTdGFydE5vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN0YXJ0Tm9kZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6I635Y+W6Kej5p6Q5Zmo5b2T5YmN54q25oCB5LiL55qE57uT5p2fRE9N6IqC54K5XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwdWJsaWNcbiAgICAgICAgICogQHJldHVybiB7Tm9kZX0g6IqC54K55a+56LGhXG4gICAgICAgICAqL1xuICAgICAgICBnZXRFbmROb2RlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lbmROb2RlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDmkJzpm4booajovr7lvI/vvIznlJ/miJDooajovr7lvI/lh73mlbDlkowgRE9NIOabtOaWsOWHveaVsOOAguWFt+S9k+WtkOexu+WunueOsFxuICAgICAgICAgKlxuICAgICAgICAgKiBAYWJzdHJhY3RcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKi9cbiAgICAgICAgY29sbGVjdEV4cHJzOiBmdW5jdGlvbiAoKSB7fSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6ISP5qOA5rWL44CC6buY6K6k5Lya5L2/55So5YWo562J5Yik5pat44CCXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwdWJsaWNcbiAgICAgICAgICogQHBhcmFtICB7c3RyaW5nfSBleHByICAgICAgICAg6KaB5qOA5p+l55qE6KGo6L6+5byPXG4gICAgICAgICAqIEBwYXJhbSAgeyp9IGV4cHJWYWx1ZSAgICDooajovr7lvI/lvZPliY3orqHnrpflh7rmnaXnmoTlgLxcbiAgICAgICAgICogQHBhcmFtICB7Kn0gZXhwck9sZFZhbHVlIOihqOi+vuW8j+S4iuS4gOasoeiuoeeul+WHuuadpeeahOWAvFxuICAgICAgICAgKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgICAgICAg5Lik5qyh55qE5YC85piv5ZCm55u45ZCMXG4gICAgICAgICAqL1xuICAgICAgICBkaXJ0eUNoZWNrOiBmdW5jdGlvbiAoZXhwciwgZXhwclZhbHVlLCBleHByT2xkVmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBkaXJ0eUNoZWNrZXJGbiA9IHRoaXMuZGlydHlDaGVja2VyID8gdGhpcy5kaXJ0eUNoZWNrZXIuZ2V0Q2hlY2tlcihleHByKSA6IG51bGw7XG4gICAgICAgICAgICByZXR1cm4gKGRpcnR5Q2hlY2tlckZuICYmIGRpcnR5Q2hlY2tlckZuKGV4cHIsIGV4cHJWYWx1ZSwgZXhwck9sZFZhbHVlKSlcbiAgICAgICAgICAgICAgICAgICAgfHwgKCFkaXJ0eUNoZWNrZXJGbiAmJiBleHByVmFsdWUgIT09IGV4cHJPbGRWYWx1ZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiuvue9ruiEj+ajgOa1i+WZqFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqIEBwYXJhbSB7RGlydHlDaGVja2VyfSBkaXJ0eUNoZWNrZXIg6ISP5qOA5rWL5ZmoXG4gICAgICAgICAqL1xuICAgICAgICBzZXREaXJ0eUNoZWNrZXI6IGZ1bmN0aW9uIChkaXJ0eUNoZWNrZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZGlydHlDaGVja2VyID0gZGlydHlDaGVja2VyO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDplIDmr4Hop6PmnpDlmajvvIzlsIbnlYzpnaLmgaLlpI3miJDljp/moLdcbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKi9cbiAgICAgICAgZGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5leHByQ2FsY3VsYXRlciA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmNvbmZpZyA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmRvbVVwZGF0ZXIgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy50cmVlID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuZGlydHlDaGVja2VyID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgICAkbmFtZTogJ1BhcnNlcidcbiAgICB9XG4pO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL3NyYy9wYXJzZXJzL1BhcnNlci5qc1xuICoqIG1vZHVsZSBpZCA9IDdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDJcbiAqKi8iLCIvKipcbiAqIEBmaWxlIOaJgOacieexu+eahOWfuuexu1xuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbnZhciBpbmhlcml0ID0gcmVxdWlyZSgnLi9pbmhlcml0Jyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIEJhc2UoKSB7XG4gICAgdGhpcy5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59XG5cbkJhc2UucHJvdG90eXBlLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoKSB7fTtcblxuLyoqXG4gKiDnu6fmib9cbiAqXG4gKiBAc3RhdGljXG4gKiBAcGFyYW0gIHtPYmplY3R9IHByb3BzICAgICAgIOaZrumAmuWxnuaAp1xuICogQHBhcmFtICB7T2JqZWN0fSBzdGF0aWNQcm9wcyDpnZnmgIHlsZ7mgKdcbiAqIEByZXR1cm4ge0NsYXNzfSAgICAgICAgICAgICDlrZDnsbtcbiAqL1xuQmFzZS5leHRlbmRzID0gZnVuY3Rpb24gKHByb3BzLCBzdGF0aWNQcm9wcykge1xuICAgIC8vIOavj+S4quexu+mDveW/hemhu+acieS4gOS4quWQjeWtl1xuICAgIGlmICghc3RhdGljUHJvcHMgfHwgIXN0YXRpY1Byb3BzLiRuYW1lKSB7XG4gICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcignZWFjaCBjbGFzcyBtdXN0IGhhdmUgYSBgJG5hbWVgLicpO1xuICAgIH1cblxuICAgIHZhciBiYXNlQ2xzID0gdGhpcztcblxuICAgIHZhciBjbHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGJhc2VDbHMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICAgIHV0aWxzLmV4dGVuZChjbHMucHJvdG90eXBlLCBwcm9wcyk7XG4gICAgdXRpbHMuZXh0ZW5kKGNscywgc3RhdGljUHJvcHMpO1xuXG4gICAgLy8g6K6w5b2V5LiA5LiL54i257G7XG4gICAgY2xzLiRzdXBlckNsYXNzID0gYmFzZUNscztcblxuICAgIHJldHVybiBpbmhlcml0KGNscywgYmFzZUNscyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhc2U7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Z0cGwvc3JjL0Jhc2UuanNcbiAqKiBtb2R1bGUgaWQgPSA4XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyXG4gKiovIiwiLyoqXG4gKiBAZmlsZSDnu6fmib9cbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG5mdW5jdGlvbiBpbmhlcml0KENoaWxkQ2xhc3MsIFBhcmVudENsYXNzKSB7XG4gICAgZnVuY3Rpb24gQ2xzKCkge31cblxuICAgIENscy5wcm90b3R5cGUgPSBQYXJlbnRDbGFzcy5wcm90b3R5cGU7XG4gICAgdmFyIGNoaWxkUHJvdG8gPSBDaGlsZENsYXNzLnByb3RvdHlwZTtcbiAgICBDaGlsZENsYXNzLnByb3RvdHlwZSA9IG5ldyBDbHMoKTtcbiAgICBDaGlsZENsYXNzLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IENoaWxkQ2xhc3M7XG5cbiAgICB2YXIga2V5O1xuICAgIGZvciAoa2V5IGluIGNoaWxkUHJvdG8pIHtcbiAgICAgICAgQ2hpbGRDbGFzcy5wcm90b3R5cGVba2V5XSA9IGNoaWxkUHJvdG9ba2V5XTtcbiAgICB9XG5cbiAgICAvLyDnu6fmib/pnZnmgIHlsZ7mgKdcbiAgICBmb3IgKGtleSBpbiBQYXJlbnRDbGFzcykge1xuICAgICAgICBpZiAoUGFyZW50Q2xhc3MuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgaWYgKENoaWxkQ2xhc3Nba2V5XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgQ2hpbGRDbGFzc1trZXldID0gUGFyZW50Q2xhc3Nba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBDaGlsZENsYXNzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluaGVyaXQ7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Z0cGwvc3JjL2luaGVyaXQuanNcbiAqKiBtb2R1bGUgaWQgPSA5XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyXG4gKiovIiwiLyoqXG4gKiBAZmlsZSDkuIDloIbpobnnm67ph4zpnaLluLjnlKjnmoTmlrnms5VcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG5leHBvcnRzLnNsaWNlID0gZnVuY3Rpb24gKGFyciwgc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcnIsIHN0YXJ0LCBlbmQpO1xufTtcblxuZXhwb3J0cy5nb0RhcmsgPSBmdW5jdGlvbiAobm9kZSkge1xuICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgIG5vZGUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB9XG4gICAgZWxzZSBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMykge1xuICAgICAgICBub2RlLl9fdGV4dF9fID0gbm9kZS5ub2RlVmFsdWU7XG4gICAgICAgIG5vZGUubm9kZVZhbHVlID0gJyc7XG4gICAgfVxufTtcblxuZXhwb3J0cy5yZXN0b3JlRnJvbURhcmsgPSBmdW5jdGlvbiAobm9kZSkge1xuICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgIG5vZGUuc3R5bGUuZGlzcGxheSA9IG51bGw7XG4gICAgfVxuICAgIGVsc2UgaWYgKG5vZGUubm9kZVR5cGUgPT09IDMpIHtcbiAgICAgICAgaWYgKG5vZGUuX190ZXh0X18gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgbm9kZS5ub2RlVmFsdWUgPSBub2RlLl9fdGV4dF9fO1xuICAgICAgICAgICAgbm9kZS5fX3RleHRfXyA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmV4cG9ydHMuY3JlYXRlRXhwckZuID0gZnVuY3Rpb24gKGV4cHJSZWdFeHAsIGV4cHIsIGV4cHJDYWxjdWxhdGVyKSB7XG4gICAgZXhwciA9IGV4cHIucmVwbGFjZShleHByUmVnRXhwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBhcmd1bWVudHNbMV07XG4gICAgfSk7XG4gICAgZXhwckNhbGN1bGF0ZXIuY3JlYXRlRXhwckZuKGV4cHIpO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChzY29wZU1vZGVsKSB7XG4gICAgICAgIHJldHVybiBleHByQ2FsY3VsYXRlci5jYWxjdWxhdGUoZXhwciwgZmFsc2UsIHNjb3BlTW9kZWwpO1xuICAgIH07XG59O1xuXG4vKipcbiAqIOi2hee6p+eugOWNleeahCBleHRlbmQg77yM5Zug5Li65pys5bqT5a+5IGV4dGVuZCDmsqHpgqPpq5jnmoTopoHmsYLvvIxcbiAqIOetieWIsOacieimgeaxgueahOaXtuWAmeWGjeWujOWWhOOAglxuICpcbiAqIEBpbm5lclxuICogQHBhcmFtICB7T2JqZWN0fSB0YXJnZXQg55uu5qCH5a+56LGhXG4gKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgICDmnIDnu4jlkIjlubblkI7nmoTlr7nosaFcbiAqL1xuZXhwb3J0cy5leHRlbmQgPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgdmFyIHNyY3MgPSBleHBvcnRzLnNsaWNlKGFyZ3VtZW50cywgMSk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGlsID0gc3Jjcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICAgIC8qIGVzbGludC1kaXNhYmxlIGd1YXJkLWZvci1pbiAqL1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gc3Jjc1tpXSkge1xuICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSBzcmNzW2ldW2tleV07XG4gICAgICAgIH1cbiAgICAgICAgLyogZXNsaW50LWVuYWJsZSBndWFyZC1mb3ItaW4gKi9cbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldDtcbn07XG5cbmV4cG9ydHMudHJhdmVyc2VOb0NoYW5nZU5vZGVzID0gZnVuY3Rpb24gKHN0YXJ0Tm9kZSwgZW5kTm9kZSwgbm9kZUZuLCBjb250ZXh0KSB7XG4gICAgZm9yICh2YXIgY3VyTm9kZSA9IHN0YXJ0Tm9kZTtcbiAgICAgICAgY3VyTm9kZSAmJiBjdXJOb2RlICE9PSBlbmROb2RlO1xuICAgICAgICBjdXJOb2RlID0gY3VyTm9kZS5uZXh0U2libGluZ1xuICAgICkge1xuICAgICAgICBpZiAobm9kZUZuLmNhbGwoY29udGV4dCwgY3VyTm9kZSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5vZGVGbi5jYWxsKGNvbnRleHQsIGVuZE5vZGUpO1xufTtcblxuZXhwb3J0cy50cmF2ZXJzZU5vZGVzID0gZnVuY3Rpb24gKHN0YXJ0Tm9kZSwgZW5kTm9kZSwgbm9kZUZuLCBjb250ZXh0KSB7XG4gICAgdmFyIG5vZGVzID0gW107XG4gICAgZm9yICh2YXIgY3VyTm9kZSA9IHN0YXJ0Tm9kZTtcbiAgICAgICAgY3VyTm9kZSAmJiBjdXJOb2RlICE9PSBlbmROb2RlO1xuICAgICAgICBjdXJOb2RlID0gY3VyTm9kZS5uZXh0U2libGluZ1xuICAgICkge1xuICAgICAgICBub2Rlcy5wdXNoKGN1ck5vZGUpO1xuICAgIH1cblxuICAgIG5vZGVzLnB1c2goZW5kTm9kZSk7XG5cbiAgICBleHBvcnRzLmVhY2gobm9kZXMsIG5vZGVGbiwgY29udGV4dCk7XG59O1xuXG5leHBvcnRzLmVhY2ggPSBmdW5jdGlvbiAoYXJyLCBmbiwgY29udGV4dCkge1xuICAgIGlmIChleHBvcnRzLmlzQXJyYXkoYXJyKSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgaWwgPSBhcnIubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgICAgICAgaWYgKGZuLmNhbGwoY29udGV4dCwgYXJyW2ldLCBpLCBhcnIpKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIGFyciA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgZm9yICh2YXIgayBpbiBhcnIpIHtcbiAgICAgICAgICAgIGlmIChmbi5jYWxsKGNvbnRleHQsIGFycltrXSwgaywgYXJyKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcblxuZnVuY3Rpb24gaXNDbGFzcyhvYmosIGNsc05hbWUpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0ICcgKyBjbHNOYW1lICsgJ10nO1xufVxuXG5leHBvcnRzLmlzQXJyYXkgPSBmdW5jdGlvbiAoYXJyKSB7XG4gICAgcmV0dXJuIGlzQ2xhc3MoYXJyLCAnQXJyYXknKTtcbn07XG5cbmV4cG9ydHMuaXNOdW1iZXIgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgcmV0dXJuIGlzQ2xhc3Mob2JqLCAnTnVtYmVyJyk7XG59O1xuXG5leHBvcnRzLmlzRnVuY3Rpb24gPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgcmV0dXJuIGlzQ2xhc3Mob2JqLCAnRnVuY3Rpb24nKTtcbn07XG5cbi8qKlxuICog5piv5ZCm5piv5LiA5Liq57qv5a+56LGh77yM5ruh6Laz5aaC5LiL5p2h5Lu277yaXG4gKlxuICogMeOAgemZpOS6huWGhee9ruWxnuaAp+S5i+Wklu+8jOayoeacieWFtuS7lue7p+aJv+WxnuaAp++8m1xuICogMuOAgWNvbnN0cnVjdG9yIOaYryBPYmplY3RcbiAqXG4gKiBAcGFyYW0ge0FueX0gb2JqIOW+heWIpOaWreeahOWPmOmHj1xuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0cy5pc1B1cmVPYmplY3QgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgaWYgKCFpc0NsYXNzKG9iaiwgJ09iamVjdCcpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBrIGluIG9iaikge1xuICAgICAgICBpZiAoIW9iai5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG59O1xuXG5leHBvcnRzLmlzQ2xhc3MgPSBpc0NsYXNzO1xuXG5leHBvcnRzLmJpbmQgPSBmdW5jdGlvbiAoZm4sIHRoaXNBcmcpIHtcbiAgICBpZiAoIWV4cG9ydHMuaXNGdW5jdGlvbihmbikpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBiaW5kID0gRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQgfHwgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgdmFyIG9iaiA9IGFyZ3MubGVuZ3RoID4gMCA/IGFyZ3NbMF0gOiB1bmRlZmluZWQ7XG4gICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgdG90YWxBcmdzID0gQXJyYXkucHJvdG90eXBlLmNvbmNhdC5hcHBseShBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmdzLCAxKSwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIHJldHVybiBtZS5hcHBseShvYmosIHRvdGFsQXJncyk7XG4gICAgICAgIH07XG4gICAgfTtcbiAgICByZXR1cm4gYmluZC5hcHBseShmbiwgW3RoaXNBcmddLmNvbmNhdChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpKSk7XG59O1xuXG5leHBvcnRzLmlzU3ViQ2xhc3NPZiA9IGZ1bmN0aW9uIChTdWJDbGFzcywgU3VwZXJDbGFzcykge1xuICAgIHJldHVybiBTdWJDbGFzcy5wcm90b3R5cGUgaW5zdGFuY2VvZiBTdXBlckNsYXNzO1xufTtcblxuLyoqXG4gKiDlr7nkvKDlhaXnmoTlrZfnrKbkuLLov5vooYzliJvlu7rmraPliJnooajovr7lvI/kuYvliY3nmoTovazkuYnvvIzpmLLmraLlrZfnrKbkuLLkuK3nmoTkuIDkupvlrZfnrKbmiJDkuLrlhbPplK7lrZfjgIJcbiAqXG4gKiBAcGFyYW0gIHtzdHJpbmd9IHN0ciDlvoXovazkuYnnmoTlrZfnrKbkuLJcbiAqIEByZXR1cm4ge3N0cmluZ30gICAgIOi9rOS5ieS5i+WQjueahOWtl+espuS4slxuICovXG5leHBvcnRzLnJlZ0V4cEVuY29kZSA9IGZ1bmN0aW9uIHJlZ0V4cEVuY29kZShzdHIpIHtcbiAgICByZXR1cm4gJ1xcXFwnICsgc3RyLnNwbGl0KCcnKS5qb2luKCdcXFxcJyk7XG59O1xuXG5leHBvcnRzLnhociA9IGZ1bmN0aW9uIChvcHRpb25zLCBsb2FkRm4sIGVycm9yRm4pIHtcbiAgICBvcHRpb25zID0gZXhwb3J0cy5leHRlbmQoe1xuICAgICAgICBtZXRob2Q6ICdHRVQnXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgeGhyLm9uZXJyb3IgPSBlcnJvckZuO1xuICAgIHhoci5vbmxvYWQgPSBsb2FkRm47XG4gICAgeGhyLm9wZW4ob3B0aW9ucy5tZXRob2QsIG9wdGlvbnMudXJsLCB0cnVlKTtcbiAgICBzZXRIZWFkZXJzKG9wdGlvbnMuaGVhZGVycywgeGhyKTtcbiAgICB4aHIuc2VuZChvcHRpb25zLmJvZHkpO1xufTtcblxuLyoqXG4gKiDlsIblrZfnrKbkuLLkuK3nmoTpqbzls7Dlkb3lkI3mlrnlvI/mlLnkuLrnn63mqKrnur/nmoTlvaLlvI9cbiAqXG4gKiBAcHVibGljXG4gKiBAcGFyYW0gIHtzdHJpbmd9IHN0ciDopoHovazmjaLnmoTlrZfnrKbkuLJcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0cy5jYW1lbDJsaW5lID0gZnVuY3Rpb24gKHN0cikge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvW0EtWl0vZywgZnVuY3Rpb24gKG1hdGNoZWQsIGluZGV4KSB7XG4gICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIG1hdGNoZWQudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJy0nICsgbWF0Y2hlZC50b0xvd2VyQ2FzZSgpO1xuICAgIH0pO1xufTtcblxuLyoqXG4gKiDlsIblrZfnrKbkuLLkuK3nmoTnn63mqKrnur/lkb3lkI3mlrnlvI/mlLnkuLrpqbzls7DnmoTlvaLlvI9cbiAqXG4gKiBAcHVibGljXG4gKiBAcGFyYW0gIHtzdHJpbmd9IHN0ciDopoHovazmjaLnmoTlrZfnrKbkuLJcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0cy5saW5lMmNhbWVsID0gZnVuY3Rpb24gKHN0cikge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvLVthLXpdL2csIGZ1bmN0aW9uIChtYXRjaGVkKSB7XG4gICAgICAgIHJldHVybiBtYXRjaGVkWzFdLnRvVXBwZXJDYXNlKCk7XG4gICAgfSk7XG59O1xuXG5leHBvcnRzLmRpc3RpbmN0QXJyID0gZnVuY3Rpb24gKGFyciwgaGFzaEZuKSB7XG4gICAgaGFzaEZuID0gZXhwb3J0cy5pc0Z1bmN0aW9uKGhhc2hGbikgPyBoYXNoRm4gOiBmdW5jdGlvbiAoZWxlbSkge1xuICAgICAgICByZXR1cm4gU3RyaW5nKGVsZW0pO1xuICAgIH07XG4gICAgdmFyIG9iaiA9IHt9O1xuICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IGFyci5sZW5ndGg7IGkgPCBpbDsgKytpKSB7XG4gICAgICAgIG9ialtoYXNoRm4oYXJyW2ldKV0gPSBhcnJbaV07XG4gICAgfVxuXG4gICAgdmFyIHJldCA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgICAgaWYgKCFvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXQucHVzaChvYmpba2V5XSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldDtcbn07XG5cblxuZnVuY3Rpb24gc2V0SGVhZGVycyhoZWFkZXJzLCB4aHIpIHtcbiAgICBpZiAoIWhlYWRlcnMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAodmFyIGsgaW4gaGVhZGVycykge1xuICAgICAgICBpZiAoIWhlYWRlcnMuaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGssIGhlYWRlcnNba10pO1xuICAgIH1cbn1cblxuXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Z0cGwvc3JjL3V0aWxzLmpzXG4gKiogbW9kdWxlIGlkID0gMTBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDJcbiAqKi8iLCIvKipcbiAqIEBmaWxlIOWtkOagkVxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbnZhciBUcmVlID0gcmVxdWlyZSgndnRwbC9zcmMvdHJlZXMvVHJlZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRyZWUuZXh0ZW5kcyhcbiAgICB7XG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgICBpZiAoIW9wdGlvbnMuY29uZmlnXG4gICAgICAgICAgICAgICAgfHwgIW9wdGlvbnMuZG9tVXBkYXRlclxuICAgICAgICAgICAgICAgIHx8ICFvcHRpb25zLmV4cHJDYWxjdWxhdGVyXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3dyb25nIGFyZ3VtZW50cycpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBvcHRpb25zLmNvbXBvbmVudENoaWxkcmVuID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgZGVsZXRlIG9wdGlvbnMuY29tcG9uZW50Q2hpbGRyZW47XG5cbiAgICAgICAgICAgIFRyZWUucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgICAkbmFtZTogJ0NoaWxkcmVuVHJlZSdcbiAgICB9XG4pO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92Y29tcG9uZW50L3NyYy9DaGlsZHJlblRyZWUuanNcbiAqKiBtb2R1bGUgaWQgPSAxMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMlxuICoqLyIsIi8qKlxuICogQGZpbGUg5pyA57uI55qE5qCRXG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20pXG4gKi9cblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcbnZhciBFeHByQ2FsY3VsYXRlciA9IHJlcXVpcmUoJy4uL0V4cHJDYWxjdWxhdGVyJyk7XG52YXIgRG9tVXBkYXRlciA9IHJlcXVpcmUoJy4uL0RvbVVwZGF0ZXInKTtcbnZhciBTY29wZU1vZGVsID0gcmVxdWlyZSgnLi4vU2NvcGVNb2RlbCcpO1xudmFyIEJhc2UgPSByZXF1aXJlKCcuLi9CYXNlJyk7XG5cbnZhciBQYXJzZXJDbGFzc2VzID0gW107XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZS5leHRlbmRzKFxuICAgIHtcbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIEJhc2UucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgICAgICAgICAgdGhpcy5zdGFydE5vZGUgPSBvcHRpb25zLnN0YXJ0Tm9kZTtcbiAgICAgICAgICAgIHRoaXMuZW5kTm9kZSA9IG9wdGlvbnMuZW5kTm9kZTtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnID0gb3B0aW9ucy5jb25maWc7XG5cbiAgICAgICAgICAgIHRoaXMuZXhwckNhbGN1bGF0ZXIgPSBvcHRpb25zLmV4cHJDYWxjdWxhdGVyIHx8IG5ldyBFeHByQ2FsY3VsYXRlcigpO1xuICAgICAgICAgICAgdGhpcy5kb21VcGRhdGVyID0gb3B0aW9ucy5kb21VcGRhdGVyIHx8IG5ldyBEb21VcGRhdGVyKCk7XG4gICAgICAgICAgICB0aGlzLmRpcnR5Q2hlY2tlciA9IG9wdGlvbnMuZGlydHlDaGVja2VyO1xuXG4gICAgICAgICAgICB0aGlzLnRyZWUgPSBbXTtcbiAgICAgICAgICAgIHRoaXMudHJlZVZhcnMgPSB7fTtcblxuICAgICAgICAgICAgdGhpcy5yb290U2NvcGUgPSBuZXcgU2NvcGVNb2RlbCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDorr7nva7nu5HlrprlnKjmoJHkuIrpnaLnmoTpop3lpJblj5jph4/jgILov5nkupvlj5jph4/mnInlpoLkuIvnibnmgKfvvJpcbiAgICAgICAgICogMeOAgeaXoOazleimhueblu+8m1xuICAgICAgICAgKiAy44CB5Zyo6I635Y+WdHJlZVZhcnPkuIrpnaLmn5DkuKrlj5jph4/nmoTml7blgJnvvIzlpoLmnpzlvZPliY3moJHlj5blh7rmnaXmmK91bmRlZmluZWTvvIzpgqPkuYjlsLHkvJrliLDniLbnuqfmoJHnmoR0cmVlVmFyc+S4iuWOu+aJvu+8jOS7peatpOexu+aOqOOAglxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lICDlj5jph4/lkI1cbiAgICAgICAgICogQHBhcmFtIHsqfSB2YWx1ZSDlj5jph4/lgLxcbiAgICAgICAgICogQHJldHVybiB7Ym9vbGVhbn0g5piv5ZCm6K6+572u5oiQ5YqfXG4gICAgICAgICAqL1xuICAgICAgICBzZXRUcmVlVmFyOiBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnRyZWVWYXJzW25hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnRyZWVWYXJzW25hbWVdID0gdmFsdWU7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICB1bnNldFRyZWVWYXI6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICB0aGlzLnRyZWVWYXJzW25hbWVdID0gdW5kZWZpbmVkO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5bnu5HlrprliLDmoJHkuIrnmoTpop3lpJblj5jph49cbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IG5hbWUgICAgICAgICAgICAgICAgICDlj5jph4/lkI1cbiAgICAgICAgICogQHBhcmFtICB7Ym9vbGVhbj19IHNob3VsZE5vdEZpbmRJblBhcmVudCDlpoLmnpzlnKjlvZPliY3moJHkuK3msqHmib7liLDvvIzmmK/lkKbliLDniLbnuqfmoJHkuK3ljrvmib7jgIJcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRydWXlsLHku6PooajkuI3ljrvvvIxmYWxzZeWwseS7o+ihqOimgeWOu1xuICAgICAgICAgKiBAcmV0dXJuIHsqfVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0VHJlZVZhcjogZnVuY3Rpb24gKG5hbWUsIHNob3VsZE5vdEZpbmRJblBhcmVudCkge1xuICAgICAgICAgICAgdmFyIHZhbCA9IHRoaXMudHJlZVZhcnNbbmFtZV07XG4gICAgICAgICAgICBpZiAoIXNob3VsZE5vdEZpbmRJblBhcmVudFxuICAgICAgICAgICAgICAgICYmIHZhbCA9PT0gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgJiYgdGhpcy4kcGFyZW50ICE9PSB1bmRlZmluZWRcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHZhbCA9IHRoaXMuJHBhcmVudC5nZXRUcmVlVmFyKG5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRQYXJlbnQ6IGZ1bmN0aW9uIChwYXJlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuJHBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXRTY29wZUJ5TmFtZTogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgIHZhciBzY29wZXMgPSB0aGlzLmdldFRyZWVWYXIoJ3Njb3BlcycpO1xuICAgICAgICAgICAgaWYgKCFzY29wZXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2NvcGVzW25hbWVdO1xuICAgICAgICB9LFxuXG4gICAgICAgIHRyYXZlcnNlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB3YWxrRG9tKHRoaXMsIHRoaXMuc3RhcnROb2RlLCB0aGlzLmVuZE5vZGUsIHRoaXMudHJlZSwgdGhpcy5yb290U2NvcGUpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldERhdGE6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICBkYXRhID0gZGF0YSB8fCB7fTtcbiAgICAgICAgICAgIHRoaXMucm9vdFNjb3BlLnNldChkYXRhKTtcbiAgICAgICAgfSxcblxuICAgICAgICBnb0Rhcms6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHV0aWxzLnRyYXZlcnNlTm9DaGFuZ2VOb2Rlcyh0aGlzLnN0YXJ0Tm9kZSwgdGhpcy5lbmROb2RlLCBmdW5jdGlvbiAoY3VyTm9kZSkge1xuICAgICAgICAgICAgICAgIGlmIChjdXJOb2RlLm5vZGVUeXBlID09PSAxIHx8IGN1ck5vZGUubm9kZVR5cGUgPT09IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgdXRpbHMuZ29EYXJrKGN1ck5vZGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlc3RvcmVGcm9tRGFyazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdXRpbHMudHJhdmVyc2VOb0NoYW5nZU5vZGVzKHRoaXMuc3RhcnROb2RlLCB0aGlzLmVuZE5vZGUsIGZ1bmN0aW9uIChjdXJOb2RlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGN1ck5vZGUubm9kZVR5cGUgPT09IDEgfHwgY3VyTm9kZS5ub2RlVHlwZSA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICB1dGlscy5yZXN0b3JlRnJvbURhcmsoY3VyTm9kZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0RGlydHlDaGVja2VyOiBmdW5jdGlvbiAoZGlydHlDaGVja2VyKSB7XG4gICAgICAgICAgICB0aGlzLmRpcnR5Q2hlY2tlciA9IGRpcnR5Q2hlY2tlcjtcbiAgICAgICAgfSxcblxuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB3YWxrKHRoaXMudHJlZSk7XG5cbiAgICAgICAgICAgIHRoaXMuc3RhcnROb2RlID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuZW5kTm9kZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmNvbmZpZyA9IG51bGw7XG5cbiAgICAgICAgICAgIHRoaXMuZXhwckNhbGN1bGF0ZXIuZGVzdHJveSgpO1xuICAgICAgICAgICAgdGhpcy5leHByQ2FsY3VsYXRlciA9IG51bGw7XG5cbiAgICAgICAgICAgIHRoaXMuZG9tVXBkYXRlci5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLmRvbVVwZGF0ZXIgPSBudWxsO1xuXG4gICAgICAgICAgICB0aGlzLnRyZWUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy50cmVlVmFycyA9IG51bGw7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmRpcnR5Q2hlY2tlcikge1xuICAgICAgICAgICAgICAgIHRoaXMuZGlydHlDaGVja2VyLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRpcnR5Q2hlY2tlciA9IG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHdhbGsocGFyc2VyT2Jqcykge1xuICAgICAgICAgICAgICAgIHV0aWxzLmVhY2gocGFyc2VyT2JqcywgZnVuY3Rpb24gKGN1clBhcnNlck9iaikge1xuICAgICAgICAgICAgICAgICAgICBjdXJQYXJzZXJPYmoucGFyc2VyLmRlc3Ryb3koKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VyUGFyc2VyT2JqLmNoaWxkcmVuICYmIGN1clBhcnNlck9iai5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdhbGsoY3VyUGFyc2VyT2JqLmNoaWxkcmVuKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDliJvlu7rop6PmnpDlmajlrp7kvovvvIzlhbbov5Tlm57lgLznmoTnu5PmnoTkuLrvvJpcbiAgICAgICAgICoge1xuICAgICAgICAgKiAgICAgcGFyc2VyOiAuLi4sXG4gICAgICAgICAqICAgICBjb2xsZWN0UmVzdWx0OiAuLi5cbiAgICAgICAgICogfVxuICAgICAgICAgKlxuICAgICAgICAgKiDov5Tlm57lgLzlrZjlnKjlpoLkuIvlh6Dnp43mg4XlhrXvvJpcbiAgICAgICAgICpcbiAgICAgICAgICogMeOAgeWmguaenCBwYXJzZXIg5bGe5oCn5a2Y5Zyo5LiUIGNvbGxlY3RSZXN1bHQg5Li6IHRydWUg77yM5YiZ6K+05piO5b2T5YmN6Kej5p6Q5Zmo6Kej5p6Q5LqG5omA5pyJ55u45bqU55qE6IqC54K577yI5YyF5ous6LW35q2i6IqC54K56Ze055qE6IqC54K544CB5b2T5YmN6IqC54K55ZKM5a2Q5a2Z6IqC54K577yJ77ybXG4gICAgICAgICAqIDLjgIHnm7TmjqXov5Tlm57lgYflgLzmiJbogIUgcGFyc2VyIOS4jeWtmOWcqO+8jOivtOaYjuayoeacieWkhOeQhuS7u+S9leiKgueCue+8jOW9k+WJjeiKgueCueS4jeWxnuS6juW9k+WJjeino+aekOWZqOWkhOeQhu+8m1xuICAgICAgICAgKiAz44CBcGFyc2VyIOWtmOWcqOS4lCBjb2xsZWN0UmVzdWx0IOS4uuaVsOe7hO+8jOe7k+aehOWmguS4i++8mlxuICAgICAgICAgKiAgICAgW1xuICAgICAgICAgKiAgICAgICAgIHtcbiAgICAgICAgICogICAgICAgICAgICAgc3RhcnROb2RlOiBOb2RlLjwuLi4+LFxuICAgICAgICAgKiAgICAgICAgICAgICBlbmROb2RlOiBOb2RlLjwuLi4+XG4gICAgICAgICAqICAgICAgICAgfVxuICAgICAgICAgKiAgICAgXVxuICAgICAgICAgKlxuICAgICAgICAgKiAg5YiZ6K+05piO5b2T5YmN5piv5bim5pyJ5b6I5aSa5YiG5pSv55qE6IqC54K577yM6KaB5L6d5qyh6Kej5p6Q5pWw57uE5Lit5q+P5Liq5YWD57Sg5oyH5a6a55qE6IqC54K56IyD5Zu044CCXG4gICAgICAgICAqICDogIzkuJTvvIzor6Xop6PmnpDlmajlr7nlupTnmoQgc2V0RGF0YSgpIOaWueazleWwhuS8mui/lOWbnuaVtOaVsO+8jOaMh+aYjuS9v+eUqOWTquS4gOS4quWIhuaUr+eahOiKgueCueOAglxuICAgICAgICAgKlxuICAgICAgICAgKiBAaW5uZXJcbiAgICAgICAgICogQHBhcmFtIHtDb25zdHJ1Y3Rvcn0gUGFyc2VyQ2xhc3MgcGFyc2VyIOexu1xuICAgICAgICAgKiBAcGFyYW0gIHtPYmplY3R9IG9wdGlvbnMg5Yid5aeL5YyW5Y+C5pWwXG4gICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICDov5Tlm57lgLxcbiAgICAgICAgICovXG4gICAgICAgIGNyZWF0ZVBhcnNlcjogZnVuY3Rpb24gKFBhcnNlckNsYXNzLCBvcHRpb25zKSB7XG4gICAgICAgICAgICB2YXIgc3RhcnROb2RlID0gb3B0aW9ucy5zdGFydE5vZGUgfHwgb3B0aW9ucy5ub2RlO1xuICAgICAgICAgICAgaWYgKCFQYXJzZXJDbGFzcy5pc1Byb3Blck5vZGUoc3RhcnROb2RlLCBvcHRpb25zLmNvbmZpZykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBlbmROb2RlO1xuICAgICAgICAgICAgaWYgKFBhcnNlckNsYXNzLmZpbmRFbmROb2RlKSB7XG4gICAgICAgICAgICAgICAgZW5kTm9kZSA9IFBhcnNlckNsYXNzLmZpbmRFbmROb2RlKHN0YXJ0Tm9kZSwgb3B0aW9ucy5jb25maWcpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFlbmROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IFBhcnNlckNsYXNzLmdldE5vRW5kTm9kZUVycm9yKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGVuZE5vZGUucGFyZW50Tm9kZSAhPT0gc3RhcnROb2RlLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd0aGUgcmVsYXRpb25zaGlwIGJldHdlZW4gc3RhcnQgbm9kZSBhbmQgZW5kIG5vZGUgaXMgbm90IGJyb3RoZXJob29kIScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHBhcnNlciA9IG5ldyBQYXJzZXJDbGFzcyh1dGlscy5leHRlbmQob3B0aW9ucywge1xuICAgICAgICAgICAgICAgIGVuZE5vZGU6IGVuZE5vZGVcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBwYXJzZXI6IHBhcnNlcixcbiAgICAgICAgICAgICAgICBlbmROb2RlOiBlbmROb2RlIHx8IG9wdGlvbnMubm9kZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgICAvKipcbiAgICAgICAgICog5rOo5YaM5LiA5LiL6Kej5p6Q5Zmo57G744CCXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSAge0NvbnN0cnVjdG9yfSBQYXJzZXJDbGFzcyDop6PmnpDlmajnsbtcbiAgICAgICAgICovXG4gICAgICAgIHJlZ2lzdGVQYXJzZXI6IGZ1bmN0aW9uIChQYXJzZXJDbGFzcykge1xuICAgICAgICAgICAgdmFyIGlzRXhpdHNDaGlsZENsYXNzID0gZmFsc2U7XG4gICAgICAgICAgICB1dGlscy5lYWNoKFBhcnNlckNsYXNzZXMsIGZ1bmN0aW9uIChQQywgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICBpZiAodXRpbHMuaXNTdWJDbGFzc09mKFBDLCBQYXJzZXJDbGFzcykpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNFeGl0c0NoaWxkQ2xhc3MgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICh1dGlscy5pc1N1YkNsYXNzT2YoUGFyc2VyQ2xhc3MsIFBDKSkge1xuICAgICAgICAgICAgICAgICAgICBQYXJzZXJDbGFzc2VzW2luZGV4XSA9IFBhcnNlckNsYXNzO1xuICAgICAgICAgICAgICAgICAgICBpc0V4aXRzQ2hpbGRDbGFzcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzRXhpdHNDaGlsZENsYXNzO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICghaXNFeGl0c0NoaWxkQ2xhc3MpIHtcbiAgICAgICAgICAgICAgICBQYXJzZXJDbGFzc2VzLnB1c2goUGFyc2VyQ2xhc3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgICRuYW1lOiAnVHJlZSdcbiAgICB9XG4pO1xuXG5cbmZ1bmN0aW9uIHdhbGtEb20odHJlZSwgc3RhcnROb2RlLCBlbmROb2RlLCBjb250YWluZXIsIHNjb3BlTW9kZWwpIHtcbiAgICBpZiAoc3RhcnROb2RlID09PSBlbmROb2RlKSB7XG4gICAgICAgIGFkZChzdGFydE5vZGUpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yICh2YXIgY3VyTm9kZSA9IHN0YXJ0Tm9kZTsgY3VyTm9kZTspIHtcbiAgICAgICAgY3VyTm9kZSA9IGFkZChjdXJOb2RlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGQoY3VyTm9kZSkge1xuICAgICAgICBpZiAoIWN1ck5vZGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICAgICAgc3RhcnROb2RlOiBjdXJOb2RlLFxuICAgICAgICAgICAgbm9kZTogY3VyTm9kZSxcbiAgICAgICAgICAgIGNvbmZpZzogdHJlZS5jb25maWcsXG4gICAgICAgICAgICBleHByQ2FsY3VsYXRlcjogdHJlZS5leHByQ2FsY3VsYXRlcixcbiAgICAgICAgICAgIGRvbVVwZGF0ZXI6IHRyZWUuZG9tVXBkYXRlcixcbiAgICAgICAgICAgIHRyZWU6IHRyZWVcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgcGFyc2VyT2JqO1xuXG4gICAgICAgIHV0aWxzLmVhY2goUGFyc2VyQ2xhc3NlcywgZnVuY3Rpb24gKFBhcnNlckNsYXNzKSB7XG4gICAgICAgICAgICBwYXJzZXJPYmogPSB0cmVlLmNyZWF0ZVBhcnNlcihQYXJzZXJDbGFzcywgb3B0aW9ucyk7XG4gICAgICAgICAgICBpZiAoIXBhcnNlck9iaiB8fCAhcGFyc2VyT2JqLnBhcnNlcikge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBhcnNlck9iai5jb2xsZWN0UmVzdWx0ID0gcGFyc2VyT2JqLnBhcnNlci5jb2xsZWN0RXhwcnMoKTtcblxuICAgICAgICAgICAgcGFyc2VyT2JqLnBhcnNlci5zZXRTY29wZShzY29wZU1vZGVsKTtcblxuICAgICAgICAgICAgaWYgKHV0aWxzLmlzQXJyYXkocGFyc2VyT2JqLmNvbGxlY3RSZXN1bHQpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGJyYW5jaGVzID0gcGFyc2VyT2JqLmNvbGxlY3RSZXN1bHQ7XG4gICAgICAgICAgICAgICAgY29udGFpbmVyLnB1c2goe3BhcnNlcjogcGFyc2VyT2JqLnBhcnNlciwgY2hpbGRyZW46IGJyYW5jaGVzfSk7XG4gICAgICAgICAgICAgICAgdXRpbHMuZWFjaChicmFuY2hlcywgZnVuY3Rpb24gKGJyYW5jaCwgaSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWJyYW5jaC5zdGFydE5vZGUgfHwgIWJyYW5jaC5lbmROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgY29uID0gW107XG4gICAgICAgICAgICAgICAgICAgIHdhbGtEb20odHJlZSwgYnJhbmNoLnN0YXJ0Tm9kZSwgYnJhbmNoLmVuZE5vZGUsIGNvbiwgcGFyc2VyT2JqLnBhcnNlci5nZXRTY29wZSgpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJhbmNoZXNbaV0gPSBjb247XG4gICAgICAgICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICAgICAgICBpZiAocGFyc2VyT2JqLmVuZE5vZGUgIT09IGVuZE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VyTm9kZSA9IHBhcnNlck9iai5wYXJzZXIuZ2V0RW5kTm9kZSgpLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY3VyTm9kZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbiA9IFtdO1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5wdXNoKHtwYXJzZXI6IHBhcnNlck9iai5wYXJzZXIsIGNoaWxkcmVuOiBjb259KTtcbiAgICAgICAgICAgICAgICBpZiAoY3VyTm9kZS5ub2RlVHlwZSA9PT0gMSAmJiBjdXJOb2RlLmNoaWxkTm9kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHdhbGtEb20odHJlZSwgY3VyTm9kZS5maXJzdENoaWxkLCBjdXJOb2RlLmxhc3RDaGlsZCwgY29uLCBwYXJzZXJPYmoucGFyc2VyLmdldFNjb3BlKCkpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChjdXJOb2RlICE9PSBlbmROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIGN1ck5vZGUgPSBwYXJzZXJPYmoucGFyc2VyLmdldEVuZE5vZGUoKS5uZXh0U2libGluZztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGN1ck5vZGUgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIGlmICghcGFyc2VyT2JqKSB7XG4gICAgICAgICAgICBjdXJOb2RlID0gY3VyTm9kZS5uZXh0U2libGluZztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjdXJOb2RlO1xuICAgIH1cbn1cblxuXG5cblxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL3NyYy90cmVlcy9UcmVlLmpzXG4gKiogbW9kdWxlIGlkID0gMTJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDJcbiAqKi8iLCJ2YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIEV4cHJDYWxjdWxhdGVyKCkge1xuICAgIHRoaXMuZm5zID0ge307XG5cbiAgICB0aGlzLmV4cHJOYW1lTWFwID0ge307XG4gICAgdGhpcy5leHByTmFtZVJlZ0V4cCA9IC9cXC4/XFwkPyhbYS16fEEtWl0rfChbYS16fEEtWl0rWzAtOV0rW2EtenxBLVpdKikpL2c7XG59XG5cbkV4cHJDYWxjdWxhdGVyLnByb3RvdHlwZS5jcmVhdGVFeHByRm4gPSBmdW5jdGlvbiAoZXhwciwgYXZvaWRSZXR1cm4pIHtcbiAgICBpZiAoZXhwciA9PT0gJ2tsYXNzJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2BrbGFzc2AgaXMgdGhlIHByZXNlcnZlZCB3b3JkIGZvciBgY2xhc3NgJyk7XG4gICAgfVxuICAgIC8vIOWvuWV4cHI9J2NsYXNzJ+i/m+ihjOS4i+i9rOaNolxuICAgIGlmIChleHByID09PSAnY2xhc3MnKSB7XG4gICAgICAgIGV4cHIgPSAna2xhc3MnO1xuICAgIH1cblxuICAgIGF2b2lkUmV0dXJuID0gISFhdm9pZFJldHVybjtcbiAgICB0aGlzLmZuc1tleHByXSA9IHRoaXMuZm5zW2V4cHJdIHx8IHt9O1xuICAgIGlmICh0aGlzLmZuc1tleHByXVthdm9pZFJldHVybl0pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBwYXJhbXMgPSBnZXRWYXJpYWJsZU5hbWVzRnJvbUV4cHIodGhpcywgZXhwcik7XG4gICAgdmFyIGZuID0gbmV3IEZ1bmN0aW9uKHBhcmFtcywgKGF2b2lkUmV0dXJuID8gJycgOiAncmV0dXJuICcpICsgZXhwcik7XG5cbiAgICB0aGlzLmZuc1tleHByXVthdm9pZFJldHVybl0gPSB7XG4gICAgICAgIHBhcmFtTmFtZXM6IHBhcmFtcyxcbiAgICAgICAgZm46IGZuXG4gICAgfTtcbn07XG5cbkV4cHJDYWxjdWxhdGVyLnByb3RvdHlwZS5jYWxjdWxhdGUgPSBmdW5jdGlvbiAoZXhwciwgYXZvaWRSZXR1cm4sIHNjb3BlTW9kZWwpIHtcbiAgICAvLyDlr7lleHByPSdjbGFzcyfov5vooYzkuIvovazmjaJcbiAgICBpZiAoZXhwciA9PT0gJ2NsYXNzJykge1xuICAgICAgICBleHByID0gJ2tsYXNzJztcbiAgICB9XG5cbiAgICB2YXIgZm5PYmogPSB0aGlzLmZuc1tleHByXVthdm9pZFJldHVybl07XG4gICAgaWYgKCFmbk9iaikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIHN1Y2ggZXhwcmVzc2lvbiBmdW5jdGlvbiBjcmVhdGVkIScpO1xuICAgIH1cblxuICAgIHZhciBmbkFyZ3MgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMCwgaWwgPSBmbk9iai5wYXJhbU5hbWVzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgICAgdmFyIHBhcmFtID0gZm5PYmoucGFyYW1OYW1lc1tpXTtcbiAgICAgICAgdmFyIHZhbHVlID0gc2NvcGVNb2RlbC5nZXQocGFyYW0pO1xuICAgICAgICBmbkFyZ3MucHVzaCh2YWx1ZSA9PT0gdW5kZWZpbmVkID8gJycgOiB2YWx1ZSk7XG4gICAgfVxuXG4gICAgdmFyIHJlc3VsdDtcbiAgICB0cnkge1xuICAgICAgICByZXN1bHQgPSBmbk9iai5mbi5hcHBseShudWxsLCBmbkFyZ3MpO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICByZXN1bHQgPSAnJztcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbkV4cHJDYWxjdWxhdGVyLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZm5zID0gbnVsbDtcbiAgICB0aGlzLmV4cHJOYW1lTWFwID0gbnVsbDtcbiAgICB0aGlzLmV4cHJOYW1lUmVnRXhwID0gbnVsbDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRXhwckNhbGN1bGF0ZXI7XG5cbi8qKlxuICog5LuO6KGo6L6+5byP5Lit5oq956a75Ye65Y+Y6YeP5ZCNXG4gKlxuICogQGlubmVyXG4gKiBAcGFyYW0ge0V4cHJDYWxjdWxhdGVyfSBtZSDlr7nlupTlrp7kvotcbiAqIEBwYXJhbSAge3N0cmluZ30gZXhwciDooajovr7lvI/lrZfnrKbkuLLvvIznsbvkvLzkuo4gYCR7bmFtZX1gIOS4reeahCBuYW1lXG4gKiBAcmV0dXJuIHtBcnJheS48c3RyaW5nPn0gICAgICDlj5jph4/lkI3mlbDnu4RcbiAqL1xuZnVuY3Rpb24gZ2V0VmFyaWFibGVOYW1lc0Zyb21FeHByKG1lLCBleHByKSB7XG4gICAgaWYgKG1lLmV4cHJOYW1lTWFwW2V4cHJdKSB7XG4gICAgICAgIHJldHVybiBtZS5leHByTmFtZU1hcFtleHByXTtcbiAgICB9XG5cbiAgICB2YXIgcmVnID0gL1tcXCR8X3xhLXp8QS1aXXsxfSg/OlthLXp8QS1afDAtOXxcXCR8X10qKS9nO1xuXG4gICAgZm9yICh2YXIgbmFtZXMgPSB7fSwgbmFtZSA9IHJlZy5leGVjKGV4cHIpOyBuYW1lOyBuYW1lID0gcmVnLmV4ZWMoZXhwcikpIHtcbiAgICAgICAgdmFyIHJlc3RTdHIgPSBleHByLnNsaWNlKG5hbWUuaW5kZXggKyBuYW1lWzBdLmxlbmd0aCk7XG5cbiAgICAgICAgLy8g5piv5bem5YC8XG4gICAgICAgIGlmICgvXlxccyo9KD8hPSkvLnRlc3QocmVzdFN0cikpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g5Y+Y6YeP5ZCN5YmN6Z2i5piv5ZCm5a2Y5ZyoIGAuYCDvvIzmiJbogIXlj5jph4/lkI3mmK/lkKbkvY3kuo7lvJXlj7flhoXpg6hcbiAgICAgICAgaWYgKG5hbWUuaW5kZXhcbiAgICAgICAgICAgICYmIChleHByW25hbWUuaW5kZXggLSAxXSA9PT0gJy4nXG4gICAgICAgICAgICAgICAgfHwgaXNJblF1b3RlKFxuICAgICAgICAgICAgICAgICAgICAgICAgZXhwci5zbGljZSgwLCBuYW1lLmluZGV4KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3RTdHJcbiAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgICkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBuYW1lc1tuYW1lWzBdXSA9IHRydWU7XG4gICAgfVxuXG4gICAgdmFyIHJldCA9IFtdO1xuICAgIHV0aWxzLmVhY2gobmFtZXMsIGZ1bmN0aW9uIChpc09rLCBuYW1lKSB7XG4gICAgICAgIGlmIChpc09rKSB7XG4gICAgICAgICAgICByZXQucHVzaChuYW1lKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIG1lLmV4cHJOYW1lTWFwW2V4cHJdID0gcmV0O1xuXG4gICAgcmV0dXJuIHJldDtcblxuICAgIGZ1bmN0aW9uIGlzSW5RdW90ZShwcmVTdHIsIHJlc3RTdHIpIHtcbiAgICAgICAgaWYgKChwcmVTdHIubGFzdEluZGV4T2YoJ1xcJycpICsgMSAmJiByZXN0U3RyLmluZGV4T2YoJ1xcJycpICsgMSlcbiAgICAgICAgICAgIHx8IChwcmVTdHIubGFzdEluZGV4T2YoJ1wiJykgKyAxICYmIHJlc3RTdHIuaW5kZXhPZignXCInKSArIDEpXG4gICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Z0cGwvc3JjL0V4cHJDYWxjdWxhdGVyLmpzXG4gKiogbW9kdWxlIGlkID0gMTNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDJcbiAqKi8iLCIvKipcbiAqIEBmaWxlIERPTSDmm7TmlrDlmahcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG52YXIgbG9nID0gcmVxdWlyZSgnLi9sb2cnKTtcblxudmFyIGV2ZW50TGlzdCA9ICgnYmx1ciBmb2N1cyBmb2N1c2luIGZvY3Vzb3V0IGxvYWQgcmVzaXplIHNjcm9sbCB1bmxvYWQgY2xpY2sgZGJsY2xpY2sgJ1xuICAgICsgJ21vdXNlZG93biBtb3VzZXVwIG1vdXNlbW92ZSBtb3VzZW92ZXIgbW91c2VvdXQgbW91c2VlbnRlciBtb3VzZWxlYXZlICdcbiAgICArICdjaGFuZ2Ugc2VsZWN0IHN1Ym1pdCBrZXlkb3duIGtleXByZXNzIGtleXVwIGVycm9yIGNvbnRleHRtZW51Jykuc3BsaXQoJyAnKTtcblxuZnVuY3Rpb24gRG9tVXBkYXRlcigpIHtcbiAgICB0aGlzLnRhc2tzID0ge307XG4gICAgdGhpcy5pc0V4ZWN1dGluZyA9IGZhbHNlO1xuICAgIHRoaXMuZG9uZUZucyA9IFtdO1xufVxuXG52YXIgY291bnRlciA9IDA7XG5Eb21VcGRhdGVyLnByb3RvdHlwZS5nZW5lcmF0ZVRhc2tJZCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gY291bnRlcisrO1xufTtcblxuRG9tVXBkYXRlci5wcm90b3R5cGUuYWRkVGFza0ZuID0gZnVuY3Rpb24gKHRhc2tJZCwgdGFza0ZuKSB7XG4gICAgdGhpcy50YXNrc1t0YXNrSWRdID0gdGFza0ZuO1xufTtcblxuRG9tVXBkYXRlci5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnRhc2tzID0gbnVsbDtcbn07XG5cbkRvbVVwZGF0ZXIucHJvdG90eXBlLmV4ZWN1dGUgPSBmdW5jdGlvbiAoZG9uZUZuKSB7XG4gICAgaWYgKHV0aWxzLmlzRnVuY3Rpb24oZG9uZUZuKSkge1xuICAgICAgICB0aGlzLmRvbmVGbnMucHVzaChkb25lRm4pO1xuICAgIH1cblxuICAgIHZhciBtZSA9IHRoaXM7XG4gICAgaWYgKCF0aGlzLmlzRXhlY3V0aW5nKSB7XG4gICAgICAgIHRoaXMuaXNFeGVjdXRpbmcgPSB0cnVlO1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdXRpbHMuZWFjaChtZS50YXNrcywgZnVuY3Rpb24gKHRhc2tGbikge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHRhc2tGbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICBsb2cud2FybihlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIG1lLnRhc2tzID0ge307XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQodXRpbHMuYmluZChmdW5jdGlvbiAoZG9uZUZucykge1xuICAgICAgICAgICAgICAgIHV0aWxzLmVhY2goZG9uZUZucywgZnVuY3Rpb24gKGRvbmVGbikge1xuICAgICAgICAgICAgICAgICAgICBkb25lRm4oKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sIG51bGwsIG1lLmRvbmVGbnMpKTtcbiAgICAgICAgICAgIG1lLmRvbmVGbnMgPSBbXTtcblxuICAgICAgICAgICAgbWUuaXNFeGVjdXRpbmcgPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxuLyoqXG4gKiDnu5nmjIflrppET03oioLngrnnmoTmjIflrprlsZ7mgKforr7nva7lgLxcbiAqXG4gKiBUT0RPOiDlrozlloRcbiAqXG4gKiBAc3RhdGljXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgIERPTeiKgueCuVxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgIOiKgueCueWxnuaAp+WQjVxuICogQHBhcmFtIHtPYmplY3R9IHZhbHVlIOiKgueCueWxnuaAp+WAvFxuICogQHJldHVybiB7Kn1cbiAqL1xuRG9tVXBkYXRlci5zZXRBdHRyID0gZnVuY3Rpb24gKG5vZGUsIG5hbWUsIHZhbHVlKSB7XG4gICAgLy8g55uu5YmN5LuF5aSE55CG5YWD57Sg6IqC54K577yM5Lul5ZCO5piv5ZCm5aSE55CG5YW25LuW57G75Z6L55qE6IqC54K577yM5Lul5ZCO5YaN6K+0XG4gICAgaWYgKG5vZGUubm9kZVR5cGUgIT09IDEpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChuYW1lID09PSAnc3R5bGUnICYmIHV0aWxzLmlzUHVyZU9iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIERvbVVwZGF0ZXIuc2V0U3R5bGUobm9kZSwgdmFsdWUpO1xuICAgIH1cblxuICAgIGlmIChuYW1lID09PSAnY2xhc3MnKSB7XG4gICAgICAgIHJldHVybiBEb21VcGRhdGVyLnNldENsYXNzKG5vZGUsIHZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAoRG9tVXBkYXRlci5pc0V2ZW50TmFtZShuYW1lKSkge1xuICAgICAgICByZXR1cm4gRG9tVXBkYXRlci5zZXRFdmVudChub2RlLCBuYW1lLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgLy8g5aSW6YOo54K55Ye75LqL5Lu2XG4gICAgaWYgKG5hbWUgPT09ICdvbm91dGNsaWNrJykge1xuICAgICAgICByZXR1cm4gRG9tVXBkYXRlci5zZXRPdXRDbGljayhub2RlLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgbm9kZS5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xufTtcblxuRG9tVXBkYXRlci5zZXRPdXRDbGljayA9IGZ1bmN0aW9uIChub2RlLCBjYWxsYmFjaykge1xuICAgIGlmICghdXRpbHMuaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQgPSBldmVudCB8fCB3aW5kb3cuZXZlbnQ7XG5cbiAgICAgICAgaWYgKG5vZGUgIT09IGV2ZW50LnRhcmdldCAmJiAhbm9kZS5jb250YWlucyhldmVudC50YXJnZXQpKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhldmVudCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cbkRvbVVwZGF0ZXIuc2V0RXZlbnQgPSBmdW5jdGlvbiAobm9kZSwgbmFtZSwgdmFsdWUpIHtcbiAgICBpZiAodXRpbHMuaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgICAgbm9kZVtuYW1lXSA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgZXZlbnQgPSBldmVudCB8fCB3aW5kb3cuZXZlbnQ7XG4gICAgICAgICAgICB2YWx1ZShldmVudCk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBub2RlW25hbWVdID0gbnVsbDtcbiAgICB9XG59O1xuXG5Eb21VcGRhdGVyLnNldENsYXNzID0gZnVuY3Rpb24gKG5vZGUsIGtsYXNzKSB7XG4gICAgaWYgKCFrbGFzcykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbm9kZS5jbGFzc05hbWUgPSBEb21VcGRhdGVyLmdldENsYXNzTGlzdChrbGFzcykuam9pbignICcpO1xufTtcblxuRG9tVXBkYXRlci5zZXRTdHlsZSA9IGZ1bmN0aW9uIChub2RlLCBzdHlsZU9iaikge1xuICAgIGZvciAodmFyIGsgaW4gc3R5bGVPYmopIHtcbiAgICAgICAgbm9kZS5zdHlsZVtrXSA9IHN0eWxlT2JqW2tdO1xuICAgIH1cbn07XG5cbi8qKlxuICog6I635Y+W5YWD57Sg6IqC54K555qE5bGe5oCn5YC8XG4gKlxuICogQHN0YXRpY1xuICogQHBhcmFtIHtOb2RlfSBub2RlIGRvbeiKgueCuVxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUg5bGe5oCn5ZCNXG4gKiBAcmV0dXJuIHsqfSDlsZ7mgKflgLxcbiAqL1xuRG9tVXBkYXRlci5nZXRBdHRyID0gZnVuY3Rpb24gKG5vZGUsIG5hbWUpIHtcbiAgICBpZiAobmFtZSA9PT0gJ2NsYXNzJykge1xuICAgICAgICByZXR1cm4gRG9tVXBkYXRlci5nZXRDbGFzc0xpc3Qobm9kZS5jbGFzc05hbWUpO1xuICAgIH1cbiAgICByZXR1cm4gbm9kZS5nZXRBdHRyaWJ1dGUobm9kZSk7XG59O1xuXG5Eb21VcGRhdGVyLmdldENsYXNzTGlzdCA9IGZ1bmN0aW9uIChrbGFzcykge1xuICAgIHZhciBrbGFzc2VzID0gW107XG4gICAgaWYgKHV0aWxzLmlzQ2xhc3Moa2xhc3MsICdTdHJpbmcnKSkge1xuICAgICAgICBrbGFzc2VzID0ga2xhc3Muc3BsaXQoJyAnKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodXRpbHMuaXNQdXJlT2JqZWN0KGtsYXNzKSkge1xuICAgICAgICBmb3IgKHZhciBrIGluIGtsYXNzKSB7XG4gICAgICAgICAgICBpZiAoa2xhc3Nba10pIHtcbiAgICAgICAgICAgICAgICBrbGFzc2VzLnB1c2goa2xhc3Nba10pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKHV0aWxzLmlzQXJyYXkoa2xhc3MpKSB7XG4gICAgICAgIGtsYXNzZXMgPSBrbGFzcztcbiAgICB9XG5cbiAgICByZXR1cm4gdXRpbHMuZGlzdGluY3RBcnIoa2xhc3Nlcyk7XG59O1xuXG5Eb21VcGRhdGVyLmlzRXZlbnROYW1lID0gZnVuY3Rpb24gKHN0cikge1xuICAgIGlmIChzdHIuaW5kZXhPZignb24nKSAhPT0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHN0ciA9IHN0ci5zbGljZSgyKTtcbiAgICBmb3IgKHZhciBpID0gMCwgaWwgPSBldmVudExpc3QubGVuZ3RoOyBpIDwgaWw7ICsraSkge1xuICAgICAgICBpZiAoc3RyID09PSBldmVudExpc3RbaV0pIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEb21VcGRhdGVyO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL3NyYy9Eb21VcGRhdGVyLmpzXG4gKiogbW9kdWxlIGlkID0gMTRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDJcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICB3YXJuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghY29uc29sZSB8fCAhY29uc29sZS53YXJuKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLndhcm4uYXBwbHkoY29uc29sZSwgYXJndW1lbnRzKTtcbiAgICB9XG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdnRwbC9zcmMvbG9nLmpzXG4gKiogbW9kdWxlIGlkID0gMTVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDJcbiAqKi8iLCJ2YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG52YXIgRXZlbnQgPSByZXF1aXJlKCcuL0V2ZW50Jyk7XG52YXIgaW5oZXJpdCA9IHJlcXVpcmUoJy4vaW5oZXJpdCcpO1xuXG5mdW5jdGlvbiBTY29wZU1vZGVsKCkge1xuICAgIEV2ZW50LmNhbGwodGhpcyk7XG5cbiAgICB0aGlzLnN0b3JlID0ge307XG4gICAgdGhpcy5wYXJlbnQ7XG4gICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xufVxuXG5TY29wZU1vZGVsLnByb3RvdHlwZS5zZXRQYXJlbnQgPSBmdW5jdGlvbiAocGFyZW50KSB7XG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG59O1xuXG5TY29wZU1vZGVsLnByb3RvdHlwZS5hZGRDaGlsZCA9IGZ1bmN0aW9uIChjaGlsZCkge1xuICAgIHRoaXMuY2hpbGRyZW4ucHVzaChjaGlsZCk7XG59O1xuXG5TY29wZU1vZGVsLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgICBpZiAodXRpbHMuaXNDbGFzcyhuYW1lLCAnU3RyaW5nJykpIHtcbiAgICAgICAgdGhpcy5zdG9yZVtuYW1lXSA9IHZhbHVlO1xuICAgICAgICBjaGFuZ2UodGhpcyk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHV0aWxzLmlzUHVyZU9iamVjdChuYW1lKSkge1xuICAgICAgICB1dGlscy5leHRlbmQodGhpcy5zdG9yZSwgbmFtZSk7XG4gICAgICAgIGNoYW5nZSh0aGlzKTtcbiAgICB9XG59O1xuXG5TY29wZU1vZGVsLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSB8fCBuYW1lID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RvcmU7XG4gICAgfVxuXG4gICAgaWYgKG5hbWUgaW4gdGhpcy5zdG9yZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdG9yZVtuYW1lXTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmdldChuYW1lKTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGluaGVyaXQoU2NvcGVNb2RlbCwgRXZlbnQpO1xuXG5mdW5jdGlvbiBjaGFuZ2UobWUpIHtcbiAgICBtZS50cmlnZ2VyKCdjaGFuZ2UnLCBtZSk7XG4gICAgdXRpbHMuZWFjaChtZS5jaGlsZHJlbiwgZnVuY3Rpb24gKHNjb3BlKSB7XG4gICAgICAgIHNjb3BlLnRyaWdnZXIoJ3BhcmVudGNoYW5nZScsIG1lKTtcbiAgICB9KTtcbn1cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdnRwbC9zcmMvU2NvcGVNb2RlbC5qc1xuICoqIG1vZHVsZSBpZCA9IDE2XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyXG4gKiovIiwidmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG5mdW5jdGlvbiBFdmVudCgpIHtcbiAgICB0aGlzLmV2bnRzID0ge307XG59XG5cbkV2ZW50LnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uIChldmVudE5hbWUsIGZuLCBjb250ZXh0KSB7XG4gICAgaWYgKCF1dGlscy5pc0Z1bmN0aW9uKGZuKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5ldm50c1tldmVudE5hbWVdID0gdGhpcy5ldm50c1tldmVudE5hbWVdIHx8IFtdO1xuXG4gICAgdGhpcy5ldm50c1tldmVudE5hbWVdLnB1c2goe1xuICAgICAgICBmbjogZm4sXG4gICAgICAgIGNvbnRleHQ6IGNvbnRleHRcbiAgICB9KTtcbn07XG5cbkV2ZW50LnByb3RvdHlwZS50cmlnZ2VyID0gZnVuY3Rpb24gKGV2ZW50TmFtZSkge1xuICAgIHZhciBmbk9ianMgPSB0aGlzLmV2bnRzW2V2ZW50TmFtZV07XG4gICAgaWYgKGZuT2JqcyAmJiBmbk9ianMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBhcmdzID0gdXRpbHMuc2xpY2UoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgdXRpbHMuZWFjaChmbk9ianMsIGZ1bmN0aW9uIChmbk9iaikge1xuICAgICAgICAgICAgZm5PYmouZm4uYXBwbHkoZm5PYmouY29udGV4dCwgYXJncyk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cbkV2ZW50LnByb3RvdHlwZS5vZmYgPSBmdW5jdGlvbiAoZXZlbnROYW1lLCBmbikge1xuICAgIGlmICghZm4pIHtcbiAgICAgICAgdGhpcy5ldm50c1tldmVudE5hbWVdID0gbnVsbDtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBmbk9ianMgPSB0aGlzLmV2bnRzW2V2ZW50TmFtZV07XG4gICAgaWYgKGZuT2JqcyAmJiBmbk9ianMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBuZXdGbk9ianMgPSBbXTtcbiAgICAgICAgdXRpbHMuZWFjaChmbk9ianMsIGZ1bmN0aW9uIChmbk9iaikge1xuICAgICAgICAgICAgaWYgKGZuICE9PSBmbk9iai5mbikge1xuICAgICAgICAgICAgICAgIG5ld0ZuT2Jqcy5wdXNoKGZuT2JqKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZXZudHNbZXZlbnROYW1lXSA9IG5ld0ZuT2JqcztcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL3NyYy9FdmVudC5qc1xuICoqIG1vZHVsZSBpZCA9IDE3XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyXG4gKiovIiwiLyoqXG4gKiBAZmlsZSDlop7lvLpmb3LmjIfku6RcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG52YXIgRm9yRGlyZWN0aXZlUGFyc2VyID0gcmVxdWlyZSgndnRwbC9zcmMvcGFyc2Vycy9Gb3JEaXJlY3RpdmVQYXJzZXInKTtcbnZhciBGb3JUcmVlID0gcmVxdWlyZSgndnRwbC9zcmMvdHJlZXMvRm9yVHJlZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZvckRpcmVjdGl2ZVBhcnNlci5leHRlbmRzKFxuICAgIHtcbiAgICAgICAgc2V0Q3NzQ2xhc3M6IGZ1bmN0aW9uIChjbGFzc0xpc3QpIHtcbiAgICAgICAgICAgIHRoaXMuJCRjbGFzc0xpc3QgPSBjbGFzc0xpc3Q7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaWwgPSB0aGlzLnRyZWVzLmxlbmd0aDsgaSA8IGlsOyArK2kpIHtcbiAgICAgICAgICAgICAgICB2YXIgdHJlZSA9IHRoaXMudHJlZXNbaV07XG4gICAgICAgICAgICAgICAgc2V0Q2xhc3Nlcyh0cmVlLCBjbGFzc0xpc3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGNyZWF0ZVRyZWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB0cmVlID0gRm9yRGlyZWN0aXZlUGFyc2VyLnByb3RvdHlwZS5jcmVhdGVUcmVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICBzZXRDbGFzc2VzKHRyZWUsIHRoaXMuJCRjbGFzc0xpc3QpO1xuICAgICAgICAgICAgcmV0dXJuIHRyZWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0QXR0cjogZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAobmFtZSA9PT0gJ2NsYXNzJykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0Q3NzQ2xhc3ModmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICAgICRuYW1lOiAnRm9yRGlyZWN0aXZlUGFyc2VyJ1xuICAgIH1cbik7XG5cbmZ1bmN0aW9uIHNldENsYXNzZXModHJlZSwgY2xhc3NMaXN0KSB7XG4gICAgZm9yICh2YXIgaiA9IDAsIGpsID0gdHJlZS50cmVlLmxlbmd0aDsgaiA8IGpsOyArK2opIHtcbiAgICAgICAgdHJlZS50cmVlW2pdLnBhcnNlci5zZXRBdHRyKCdjbGFzcycsIGNsYXNzTGlzdCk7XG4gICAgfVxufVxuXG5Gb3JUcmVlLnJlZ2lzdGVQYXJzZXIobW9kdWxlLmV4cG9ydHMpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92Y29tcG9uZW50L3NyYy9Gb3JEaXJlY3RpdmVQYXJzZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAxOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMlxuICoqLyIsIi8qKlxuICogQGZpbGUgZm9yIOaMh+S7pFxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbnZhciBEaXJlY3RpdmVQYXJzZXIgPSByZXF1aXJlKCcuL0RpcmVjdGl2ZVBhcnNlcicpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcbnZhciBGb3JUcmVlID0gcmVxdWlyZSgnLi4vdHJlZXMvRm9yVHJlZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERpcmVjdGl2ZVBhcnNlci5leHRlbmRzKFxuICAgIHtcblxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgRGlyZWN0aXZlUGFyc2VyLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgICAgIHRoaXMuc3RhcnROb2RlID0gb3B0aW9ucy5zdGFydE5vZGU7XG4gICAgICAgICAgICB0aGlzLmVuZE5vZGUgPSBvcHRpb25zLmVuZE5vZGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY29sbGVjdEV4cHJzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGFydE5vZGUubmV4dFNpYmxpbmcgPT09IHRoaXMuZW5kTm9kZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHRwbFNlZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgdXRpbHMudHJhdmVyc2VOb2Rlcyh0aGlzLnN0YXJ0Tm9kZSwgdGhpcy5lbmROb2RlLCBmdW5jdGlvbiAoY3VyTm9kZSkge1xuICAgICAgICAgICAgICAgIGlmIChjdXJOb2RlID09PSB0aGlzLnN0YXJ0Tm9kZSB8fCBjdXJOb2RlID09PSB0aGlzLmVuZE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRwbFNlZy5hcHBlbmRDaGlsZChjdXJOb2RlKTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICAgICAgdGhpcy50cGxTZWcgPSB0cGxTZWc7XG5cbiAgICAgICAgICAgIHRoaXMuZXhwciA9IHRoaXMuc3RhcnROb2RlLm5vZGVWYWx1ZS5tYXRjaCh0aGlzLmNvbmZpZy5nZXRGb3JFeHByc1JlZ0V4cCgpKVsxXTtcbiAgICAgICAgICAgIHRoaXMuZXhwckZuID0gdXRpbHMuY3JlYXRlRXhwckZuKHRoaXMuY29uZmlnLmdldEV4cHJSZWdFeHAoKSwgdGhpcy5leHByLCB0aGlzLmV4cHJDYWxjdWxhdGVyKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRm4gPSBjcmVhdGVVcGRhdGVGbihcbiAgICAgICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnROb2RlLm5leHRTaWJsaW5nLFxuICAgICAgICAgICAgICAgIHRoaXMuZW5kTm9kZS5wcmV2aW91c1NpYmxpbmcsXG4gICAgICAgICAgICAgICAgdGhpcy5jb25maWcsXG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydE5vZGUubm9kZVZhbHVlXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICBvbkNoYW5nZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmV4cHIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBleHByVmFsdWUgPSB0aGlzLmV4cHJGbih0aGlzLnNjb3BlTW9kZWwpO1xuICAgICAgICAgICAgaWYgKHRoaXMuZGlydHlDaGVjayh0aGlzLmV4cHIsIGV4cHJWYWx1ZSwgdGhpcy5leHByT2xkVmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVGbihleHByVmFsdWUsIHRoaXMuc2NvcGVNb2RlbCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZXhwck9sZFZhbHVlID0gZXhwclZhbHVlO1xuXG4gICAgICAgICAgICBEaXJlY3RpdmVQYXJzZXIucHJvdG90eXBlLm9uQ2hhbmdlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdXRpbHMudHJhdmVyc2VOb2Rlcyh0aGlzLnRwbFNlZy5maXJzdENoaWxkLCB0aGlzLnRwbFNlZy5sYXN0Q2hpbGQsIGZ1bmN0aW9uIChjdXJOb2RlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbmROb2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGN1ck5vZGUsIHRoaXMuZW5kTm9kZSk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICAgICAgdXRpbHMuZWFjaCh0aGlzLnRyZWVzLCBmdW5jdGlvbiAodHJlZSkge1xuICAgICAgICAgICAgICAgIHRyZWUuZGVzdHJveSgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMudHBsU2VnID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuZXhwciA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmV4cHJGbiA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUZuID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuc3RhcnROb2RlID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuZW5kTm9kZSA9IG51bGw7XG4gICAgICAgICAgICBEaXJlY3RpdmVQYXJzZXIucHJvdG90eXBlLmRlc3Ryb3kuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBjcmVhdGVUcmVlOiBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgICAgICAgICB2YXIgcGFyc2VyID0gdGhpcztcbiAgICAgICAgICAgIHZhciBjb3B5U2VnID0gcGFyc2VyLnRwbFNlZy5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgICB2YXIgc3RhcnROb2RlID0gY29weVNlZy5maXJzdENoaWxkO1xuICAgICAgICAgICAgdmFyIGVuZE5vZGUgPSBjb3B5U2VnLmxhc3RDaGlsZDtcbiAgICAgICAgICAgIHV0aWxzLnRyYXZlcnNlTm9kZXMoc3RhcnROb2RlLCBlbmROb2RlLCBmdW5jdGlvbiAoY3VyTm9kZSkge1xuICAgICAgICAgICAgICAgIHBhcnNlci5lbmROb2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGN1ck5vZGUsIHBhcnNlci5lbmROb2RlKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgdHJlZSA9IG5ldyBGb3JUcmVlKHtcbiAgICAgICAgICAgICAgICBzdGFydE5vZGU6IHN0YXJ0Tm9kZSxcbiAgICAgICAgICAgICAgICBlbmROb2RlOiBlbmROb2RlLFxuICAgICAgICAgICAgICAgIGNvbmZpZzogY29uZmlnLFxuICAgICAgICAgICAgICAgIGRvbVVwZGF0ZXI6IHBhcnNlci50cmVlLmRvbVVwZGF0ZXIsXG4gICAgICAgICAgICAgICAgZXhwckNhbGN1bGF0ZXI6IHBhcnNlci50cmVlLmV4cHJDYWxjdWxhdGVyXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRyZWUuc2V0UGFyZW50KHBhcnNlci50cmVlKTtcbiAgICAgICAgICAgIHRyZWUudHJhdmVyc2UoKTtcbiAgICAgICAgICAgIHJldHVybiB0cmVlO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICAgIGlzUHJvcGVyTm9kZTogZnVuY3Rpb24gKG5vZGUsIGNvbmZpZykge1xuICAgICAgICAgICAgcmV0dXJuIERpcmVjdGl2ZVBhcnNlci5pc1Byb3Blck5vZGUobm9kZSwgY29uZmlnKVxuICAgICAgICAgICAgICAgICYmIGNvbmZpZy5mb3JQcmVmaXhSZWdFeHAudGVzdChub2RlLm5vZGVWYWx1ZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZmluZEVuZE5vZGU6IGZ1bmN0aW9uIChmb3JTdGFydE5vZGUsIGNvbmZpZykge1xuICAgICAgICAgICAgdmFyIGN1ck5vZGUgPSBmb3JTdGFydE5vZGU7XG4gICAgICAgICAgICB3aGlsZSAoKGN1ck5vZGUgPSBjdXJOb2RlLm5leHRTaWJsaW5nKSkge1xuICAgICAgICAgICAgICAgIGlmIChpc0ZvckVuZE5vZGUoY3VyTm9kZSwgY29uZmlnKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3VyTm9kZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0Tm9FbmROb2RlRXJyb3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoJ3RoZSBgZm9yYCBkaXJlY3RpdmUgaXMgbm90IHByb3Blcmx5IGVuZGVkIScpO1xuICAgICAgICB9LFxuXG4gICAgICAgICRuYW1lOiAnRm9yRGlyZWN0aXZlUGFyc2VyJ1xuICAgIH1cbik7XG5cbkZvclRyZWUucmVnaXN0ZVBhcnNlcihtb2R1bGUuZXhwb3J0cyk7XG5cbmZ1bmN0aW9uIGlzRm9yRW5kTm9kZShub2RlLCBjb25maWcpIHtcbiAgICByZXR1cm4gbm9kZS5ub2RlVHlwZSA9PT0gOCAmJiBjb25maWcuZm9yRW5kUHJlZml4UmVnRXhwLnRlc3Qobm9kZS5ub2RlVmFsdWUpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVVcGRhdGVGbihwYXJzZXIsIHN0YXJ0Tm9kZSwgZW5kTm9kZSwgY29uZmlnLCBmdWxsRXhwcikge1xuICAgIHZhciB0cmVlcyA9IFtdO1xuICAgIHBhcnNlci50cmVlcyA9IHRyZWVzO1xuICAgIHZhciBpdGVtVmFyaWFibGVOYW1lID0gZnVsbEV4cHIubWF0Y2gocGFyc2VyLmNvbmZpZy5nZXRGb3JJdGVtVmFsdWVOYW1lUmVnRXhwKCkpWzFdO1xuICAgIHZhciB0YXNrSWQgPSBwYXJzZXIuZG9tVXBkYXRlci5nZW5lcmF0ZVRhc2tJZCgpO1xuICAgIHJldHVybiBmdW5jdGlvbiAoZXhwclZhbHVlLCBzY29wZU1vZGVsKSB7XG4gICAgICAgIHZhciBpbmRleCA9IDA7XG4gICAgICAgIGZvciAodmFyIGsgaW4gZXhwclZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoIXRyZWVzW2luZGV4XSkge1xuICAgICAgICAgICAgICAgIHRyZWVzW2luZGV4XSA9IHBhcnNlci5jcmVhdGVUcmVlKGNvbmZpZyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRyZWVzW2luZGV4XS5yZXN0b3JlRnJvbURhcmsoKTtcbiAgICAgICAgICAgIHRyZWVzW2luZGV4XS5zZXREaXJ0eUNoZWNrZXIocGFyc2VyLmRpcnR5Q2hlY2tlcik7XG5cbiAgICAgICAgICAgIHZhciBsb2NhbCA9IHtcbiAgICAgICAgICAgICAgICBrZXk6IGssXG4gICAgICAgICAgICAgICAgaW5kZXg6IGluZGV4XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbG9jYWxbaXRlbVZhcmlhYmxlTmFtZV0gPSBleHByVmFsdWVba107XG5cbiAgICAgICAgICAgIHRyZWVzW2luZGV4XS5yb290U2NvcGUuc2V0UGFyZW50KHNjb3BlTW9kZWwpO1xuICAgICAgICAgICAgc2NvcGVNb2RlbC5hZGRDaGlsZCh0cmVlc1tpbmRleF0ucm9vdFNjb3BlKTtcblxuICAgICAgICAgICAgdHJlZXNbaW5kZXhdLnNldERhdGEobG9jYWwpO1xuXG4gICAgICAgICAgICBpbmRleCsrO1xuICAgICAgICB9XG5cbiAgICAgICAgcGFyc2VyLmRvbVVwZGF0ZXIuYWRkVGFza0ZuKHRhc2tJZCwgdXRpbHMuYmluZChmdW5jdGlvbiAodHJlZXMsIGluZGV4KSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gaW5kZXgsIGlsID0gdHJlZXMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgICAgICAgICAgIHRyZWVzW2ldLmdvRGFyaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCBudWxsLCB0cmVlcywgaW5kZXgpKTtcbiAgICB9O1xufVxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL3NyYy9wYXJzZXJzL0ZvckRpcmVjdGl2ZVBhcnNlci5qc1xuICoqIG1vZHVsZSBpZCA9IDE5XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyXG4gKiovIiwiLyoqXG4gKiBAZmlsZSBmb3LmjIfku6TkuK3nlKjliLDnmoRcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG52YXIgVHJlZSA9IHJlcXVpcmUoJy4vVHJlZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRyZWUuZXh0ZW5kcyhcbiAgICB7XG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgICBpZiAoIW9wdGlvbnMuY29uZmlnXG4gICAgICAgICAgICAgICAgfHwgIW9wdGlvbnMuZG9tVXBkYXRlclxuICAgICAgICAgICAgICAgIHx8ICFvcHRpb25zLmV4cHJDYWxjdWxhdGVyXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3dyb25nIGFyZ3VtZW50cycpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBUcmVlLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgJG5hbWU6ICdGb3JUcmVlJ1xuICAgIH1cbik7XG5cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdnRwbC9zcmMvdHJlZXMvRm9yVHJlZS5qc1xuICoqIG1vZHVsZSBpZCA9IDIwXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyXG4gKiovIiwiLyoqXG4gKiBAZmlsZSDlop7lvLrkuIDkuIt2dHBs5Lit55qEaWbmjIfku6RcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG52YXIgSWZEaXJlY3RpdmVQYXJzZXIgPSByZXF1aXJlKCd2dHBsL3NyYy9wYXJzZXJzL0lmRGlyZWN0aXZlUGFyc2VyJyk7XG52YXIgVHJlZSA9IHJlcXVpcmUoJ3Z0cGwvc3JjL3RyZWVzL1RyZWUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBJZkRpcmVjdGl2ZVBhcnNlci5leHRlbmRzKFxuICAgIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICog57uZaWbmjIfku6TmiYDnrqHnkIbnmoTmiYDmnInoioLngrnorr7nva5jc3PnsbtcbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBjbGFzc0xpc3QgY3Nz57G75pWw57uEXG4gICAgICAgICAqL1xuICAgICAgICBzZXRDc3NDbGFzczogZnVuY3Rpb24gKGNsYXNzTGlzdCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlsID0gdGhpcy5icmFuY2hlcy5sZW5ndGg7IGkgPCBpbDsgKytpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGJyYW5jaCA9IHRoaXMuYnJhbmNoZXNbaV07XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGpsID0gYnJhbmNoLmxlbmd0aDsgaiA+IGpsOyArK2opIHtcbiAgICAgICAgICAgICAgICAgICAgYnJhbmNoLnNldENzc0NsYXNzKGNsYXNzTGlzdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHNldEF0dHI6IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKG5hbWUgPT09ICdjbGFzcycpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldENzc0NsYXNzKHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgICAkbmFtZTogJ0lmRGlyZWN0aXZlUGFyc2VyJ1xuICAgIH1cbik7XG5cblRyZWUucmVnaXN0ZVBhcnNlcihtb2R1bGUuZXhwb3J0cyk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Zjb21wb25lbnQvc3JjL0lmRGlyZWN0aXZlUGFyc2VyLmpzXG4gKiogbW9kdWxlIGlkID0gMjFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDJcbiAqKi8iLCIvKipcbiAqIEBmaWxlIGlmIOaMh+S7pFxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbnZhciBEaXJlY3RpdmVQYXJzZXIgPSByZXF1aXJlKCcuL0RpcmVjdGl2ZVBhcnNlcicpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcbnZhciBUcmVlID0gcmVxdWlyZSgnLi4vdHJlZXMvVHJlZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERpcmVjdGl2ZVBhcnNlci5leHRlbmRzKFxuICAgIHtcbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIERpcmVjdGl2ZVBhcnNlci5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgICAgICAgICB0aGlzLnN0YXJ0Tm9kZSA9IG9wdGlvbnMuc3RhcnROb2RlO1xuICAgICAgICAgICAgdGhpcy5lbmROb2RlID0gb3B0aW9ucy5lbmROb2RlO1xuICAgICAgICAgICAgdGhpcy5jb25maWcgPSBvcHRpb25zLmNvbmZpZztcblxuICAgICAgICAgICAgdGhpcy5leHBycyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5leHByRm5zID0ge307XG5cbiAgICAgICAgICAgIHRoaXMuaGFuZGxlQnJhbmNoZXNUYXNrSWQgPSB0aGlzLmRvbVVwZGF0ZXIuZ2VuZXJhdGVUYXNrSWQoKTtcbiAgICAgICAgfSxcblxuICAgICAgICBjb2xsZWN0RXhwcnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBicmFuY2hlcyA9IFtdO1xuICAgICAgICAgICAgdmFyIGJyYW5jaEluZGV4ID0gLTE7XG5cbiAgICAgICAgICAgIHV0aWxzLnRyYXZlcnNlTm9kZXModGhpcy5zdGFydE5vZGUsIHRoaXMuZW5kTm9kZSwgZnVuY3Rpb24gKGN1ck5vZGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgbm9kZVR5cGUgPSBnZXRJZk5vZGVUeXBlKGN1ck5vZGUsIHRoaXMuY29uZmlnKTtcblxuICAgICAgICAgICAgICAgIGlmIChub2RlVHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBzZXRFbmROb2RlKGN1ck5vZGUsIGJyYW5jaGVzLCBicmFuY2hJbmRleCk7XG5cbiAgICAgICAgICAgICAgICAgICAgYnJhbmNoSW5kZXgrKztcbiAgICAgICAgICAgICAgICAgICAgYnJhbmNoZXNbYnJhbmNoSW5kZXhdID0gYnJhbmNoZXNbYnJhbmNoSW5kZXhdIHx8IHt9O1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIOaYryBpZiDoioLngrnmiJbogIUgZWxpZiDoioLngrnvvIzmkJzpm4booajovr7lvI9cbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGVUeXBlIDwgMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGV4cHIgPSBjdXJOb2RlLm5vZGVWYWx1ZS5yZXBsYWNlKHRoaXMuY29uZmlnLmdldEFsbElmUmVnRXhwKCksICcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXhwcnMucHVzaChleHByKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmV4cHJGbnNbZXhwcl0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmV4cHJGbnNbZXhwcl0gPSB1dGlscy5jcmVhdGVFeHByRm4oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29uZmlnLmdldEV4cHJSZWdFeHAoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5leHByQ2FsY3VsYXRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAobm9kZVR5cGUgPT09IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFzRWxzZUJyYW5jaCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghYnJhbmNoZXNbYnJhbmNoSW5kZXhdLnN0YXJ0Tm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJhbmNoZXNbYnJhbmNoSW5kZXhdLnN0YXJ0Tm9kZSA9IGN1ck5vZGU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjdXJOb2RlID0gY3VyTm9kZS5uZXh0U2libGluZztcbiAgICAgICAgICAgICAgICBpZiAoIWN1ck5vZGUgfHwgY3VyTm9kZSA9PT0gdGhpcy5lbmROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldEVuZE5vZGUoY3VyTm9kZSwgYnJhbmNoZXMsIGJyYW5jaEluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICAgIHRoaXMuYnJhbmNoZXMgPSBicmFuY2hlcztcbiAgICAgICAgICAgIHJldHVybiBicmFuY2hlcztcblxuICAgICAgICAgICAgZnVuY3Rpb24gc2V0RW5kTm9kZShjdXJOb2RlLCBicmFuY2hlcywgYnJhbmNoSW5kZXgpIHtcbiAgICAgICAgICAgICAgICBpZiAoYnJhbmNoSW5kZXggKyAxICYmIGJyYW5jaGVzW2JyYW5jaEluZGV4XS5zdGFydE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJhbmNoZXNbYnJhbmNoSW5kZXhdLmVuZE5vZGUgPSBjdXJOb2RlLnByZXZpb3VzU2libGluZztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgb25DaGFuZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBleHBycyA9IHRoaXMuZXhwcnM7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaWwgPSBleHBycy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGV4cHIgPSBleHByc1tpXTtcbiAgICAgICAgICAgICAgICB2YXIgZXhwclZhbHVlID0gdGhpcy5leHByRm5zW2V4cHJdKHRoaXMuc2NvcGVNb2RlbCk7XG4gICAgICAgICAgICAgICAgaWYgKGV4cHJWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRvbVVwZGF0ZXIuYWRkVGFza0ZuKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVCcmFuY2hlc1Rhc2tJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHV0aWxzLmJpbmQoaGFuZGxlQnJhbmNoZXMsIG51bGwsIHRoaXMuYnJhbmNoZXMsIGkpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmhhc0Vsc2VCcmFuY2gpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRvbVVwZGF0ZXIuYWRkVGFza0ZuKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZUJyYW5jaGVzVGFza0lkLFxuICAgICAgICAgICAgICAgICAgICB1dGlscy5iaW5kKGhhbmRsZUJyYW5jaGVzLCBudWxsLCB0aGlzLmJyYW5jaGVzLCBpKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnROb2RlID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuZW5kTm9kZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmNvbmZpZyA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmV4cHJzID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuZXhwckZucyA9IG51bGw7XG5cbiAgICAgICAgICAgIERpcmVjdGl2ZVBhcnNlci5wcm90b3R5cGUuZGVzdHJveS5jYWxsKHRoaXMpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICAgIGlzUHJvcGVyTm9kZTogZnVuY3Rpb24gKG5vZGUsIGNvbmZpZykge1xuICAgICAgICAgICAgcmV0dXJuIGdldElmTm9kZVR5cGUobm9kZSwgY29uZmlnKSA9PT0gMTtcbiAgICAgICAgfSxcblxuICAgICAgICBmaW5kRW5kTm9kZTogZnVuY3Rpb24gKGlmU3RhcnROb2RlLCBjb25maWcpIHtcbiAgICAgICAgICAgIHZhciBjdXJOb2RlID0gaWZTdGFydE5vZGU7XG4gICAgICAgICAgICB3aGlsZSAoKGN1ck5vZGUgPSBjdXJOb2RlLm5leHRTaWJsaW5nKSkge1xuICAgICAgICAgICAgICAgIGlmIChpc0lmRW5kTm9kZShjdXJOb2RlLCBjb25maWcpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjdXJOb2RlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBnZXROb0VuZE5vZGVFcnJvcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcigndGhlIGlmIGRpcmVjdGl2ZSBpcyBub3QgcHJvcGVybHkgZW5kZWQhJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJG5hbWU6ICdJZkRpcmVjdGl2ZVBhcnNlcidcbiAgICB9XG4pO1xuXG5UcmVlLnJlZ2lzdGVQYXJzZXIobW9kdWxlLmV4cG9ydHMpO1xuXG5mdW5jdGlvbiBoYW5kbGVCcmFuY2hlcyhicmFuY2hlcywgc2hvd0luZGV4KSB7XG4gICAgdXRpbHMuZWFjaChicmFuY2hlcywgZnVuY3Rpb24gKGJyYW5jaCwgaikge1xuICAgICAgICB2YXIgZm4gPSBqID09PSBzaG93SW5kZXggPyAncmVzdG9yZUZyb21EYXJrJyA6ICdnb0RhcmsnO1xuICAgICAgICB1dGlscy5lYWNoKGJyYW5jaCwgZnVuY3Rpb24gKHBhcnNlck9iaikge1xuICAgICAgICAgICAgcGFyc2VyT2JqLnBhcnNlcltmbl0oKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGlzSWZFbmROb2RlKG5vZGUsIGNvbmZpZykge1xuICAgIHJldHVybiBnZXRJZk5vZGVUeXBlKG5vZGUsIGNvbmZpZykgPT09IDQ7XG59XG5cbmZ1bmN0aW9uIGdldElmTm9kZVR5cGUobm9kZSwgY29uZmlnKSB7XG4gICAgaWYgKG5vZGUubm9kZVR5cGUgIT09IDgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChjb25maWcuaWZQcmVmaXhSZWdFeHAudGVzdChub2RlLm5vZGVWYWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5lbGlmUHJlZml4UmVnRXhwLnRlc3Qobm9kZS5ub2RlVmFsdWUpKSB7XG4gICAgICAgIHJldHVybiAyO1xuICAgIH1cblxuICAgIGlmIChjb25maWcuZWxzZVByZWZpeFJlZ0V4cC50ZXN0KG5vZGUubm9kZVZhbHVlKSkge1xuICAgICAgICByZXR1cm4gMztcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLmlmRW5kUHJlZml4UmVnRXhwLnRlc3Qobm9kZS5ub2RlVmFsdWUpKSB7XG4gICAgICAgIHJldHVybiA0O1xuICAgIH1cbn1cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdnRwbC9zcmMvcGFyc2Vycy9JZkRpcmVjdGl2ZVBhcnNlci5qc1xuICoqIG1vZHVsZSBpZCA9IDIyXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyXG4gKiovIiwiLyoqXG4gKiBAZmlsZSDnu4Tku7bop6PmnpDlmahcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG52YXIgRXZlbnRFeHByUGFyc2VyID0gcmVxdWlyZSgndnRwbC9zcmMvcGFyc2Vycy9FdmVudEV4cHJQYXJzZXInKTtcbnZhciBUcmVlID0gcmVxdWlyZSgndnRwbC9zcmMvdHJlZXMvVHJlZScpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgndnRwbC9zcmMvdXRpbHMnKTtcbnZhciBDb21wb25lbnRUcmVlID0gcmVxdWlyZSgnLi9Db21wb25lbnRUcmVlJyk7XG52YXIgQ29tcG9uZW50Q2hpbGRyZW4gPSByZXF1aXJlKCcuL0NvbXBvbmVudENoaWxkcmVuJyk7XG52YXIgQ29tcG9uZW50TWFuYWdlciA9IHJlcXVpcmUoJy4vQ29tcG9uZW50TWFuYWdlcicpO1xudmFyIERvbVVwZGF0ZXIgPSByZXF1aXJlKCd2dHBsL3NyYy9Eb21VcGRhdGVyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFeHByUGFyc2VyLmV4dGVuZHMoXG4gICAge1xuXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgICBFdmVudEV4cHJQYXJzZXIucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50TWFuYWdlciA9IHRoaXMudHJlZS5nZXRUcmVlVmFyKCdjb21wb25lbnRNYW5hZ2VyJyk7XG4gICAgICAgICAgICB0aGlzLmlzQ29tcG9uZW50ID0gdGhpcy5ub2RlLm5vZGVUeXBlID09PSAxXG4gICAgICAgICAgICAgICAgJiYgdGhpcy5ub2RlLnRhZ05hbWUudG9Mb3dlckNhc2UoKS5pbmRleE9mKCd1aS0nKSA9PT0gMDtcblxuICAgICAgICAgICAgaWYgKHRoaXMuaXNDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgY29tcG9uZW50TmFtZSA9IHV0aWxzLmxpbmUyY2FtZWwodGhpcy5ub2RlLnRhZ05hbWUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCd1aScsICcnKSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgQ29tcG9uZW50Q2xhc3MgPSB0aGlzLmNvbXBvbmVudE1hbmFnZXIuZ2V0Q2xhc3MoY29tcG9uZW50TmFtZSk7XG4gICAgICAgICAgICAgICAgaWYgKCFDb21wb25lbnRDbGFzcykge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3RoZSBjb21wb25lbnQgYCcgKyBjb21wb25lbnROYW1lICsgJ2AgaXMgbm90IHJlZ2lzdGVkIScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyDnu4Tku7bmnKzouqvlsLHlupTor6XmnInnmoRjc3PnsbvlkI1cbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudE9yaWdpbkNzc0NsYXNzTGlzdCA9IENvbXBvbmVudE1hbmFnZXIuZ2V0Q3NzQ2xhc3NOYW1lKENvbXBvbmVudENsYXNzKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50ID0gbmV3IENvbXBvbmVudENsYXNzKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnQucGFyc2VyID0gdGhpcztcblxuICAgICAgICAgICAgICAgIHRoaXMubW91bnQob3B0aW9ucy50cmVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBjb2xsZWN0RXhwcnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb2xsZWN0Q29tcG9uZW50RXhwcnMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIEV2ZW50RXhwclBhcnNlci5wcm90b3R5cGUuY29sbGVjdEV4cHJzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgbW91bnQ6IGZ1bmN0aW9uIChwYXJlbnRUcmVlKSB7XG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudC5jb21wb25lbnRXaWxsTW91bnQoKTtcblxuICAgICAgICAgICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgZGl2LmlubmVySFRNTCA9IHRoaXMuY29tcG9uZW50LnRwbDtcbiAgICAgICAgICAgIHZhciBzdGFydE5vZGUgPSBkaXYuZmlyc3RDaGlsZDtcbiAgICAgICAgICAgIHZhciBlbmROb2RlID0gZGl2Lmxhc3RDaGlsZDtcblxuICAgICAgICAgICAgdGhpcy5zdGFydE5vZGUgPSBzdGFydE5vZGU7XG4gICAgICAgICAgICB0aGlzLmVuZE5vZGUgPSBlbmROb2RlO1xuXG4gICAgICAgICAgICAvLyDnu4Tku7bnmoTkvZznlKjln5/mmK/lkozlpJbpg6jnmoTkvZznlKjln5/pmpTlvIDnmoRcbiAgICAgICAgICAgIHRoaXMudHJlZSA9IG5ldyBDb21wb25lbnRUcmVlKHtcbiAgICAgICAgICAgICAgICBzdGFydE5vZGU6IHN0YXJ0Tm9kZSxcbiAgICAgICAgICAgICAgICBlbmROb2RlOiBlbmROb2RlLFxuICAgICAgICAgICAgICAgIGNvbmZpZzogcGFyZW50VHJlZS5jb25maWcsXG4gICAgICAgICAgICAgICAgZG9tVXBkYXRlcjogcGFyZW50VHJlZS5kb21VcGRhdGVyLFxuICAgICAgICAgICAgICAgIGV4cHJDYWxjdWxhdGVyOiBwYXJlbnRUcmVlLmV4cHJDYWxjdWxhdGVyLFxuXG4gICAgICAgICAgICAgICAgLy8gY29tcG9uZW50Q2hpbGRyZW7kuI3og73kvKDnu5nlrZDnuqfnu4Tku7bmoJHvvIzlj6/ku6XkvKDnu5nlrZDnuqdmb3LmoJHjgIJcbiAgICAgICAgICAgICAgICBjb21wb25lbnRDaGlsZHJlbjogbmV3IENvbXBvbmVudENoaWxkcmVuKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUuZmlyc3RDaGlsZCxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLmxhc3RDaGlsZCxcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50VHJlZS5yb290U2NvcGVcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy50cmVlLnNldFBhcmVudChwYXJlbnRUcmVlKTtcblxuICAgICAgICAgICAgdGhpcy50cmVlLnJlZ2lzdGVDb21wb25lbnRzKHRoaXMuY29tcG9uZW50LmNvbXBvbmVudENsYXNzZXMpO1xuXG4gICAgICAgICAgICBpbnNlcnRDb21wb25lbnROb2Rlcyh0aGlzLm5vZGUsIHN0YXJ0Tm9kZSwgZW5kTm9kZSk7XG5cbiAgICAgICAgICAgIHRoaXMudHJlZS50cmF2ZXJzZSgpO1xuXG4gICAgICAgICAgICAvLyDmiornu4Tku7boioLngrnmlL7liLAgRE9NIOagkeS4reWOu1xuICAgICAgICAgICAgZnVuY3Rpb24gaW5zZXJ0Q29tcG9uZW50Tm9kZXMoY29tcG9uZW50Tm9kZSwgc3RhcnROb2RlLCBlbmROb2RlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhcmVudE5vZGUgPSBjb21wb25lbnROb2RlLnBhcmVudE5vZGU7XG4gICAgICAgICAgICAgICAgdXRpbHMudHJhdmVyc2VOb2RlcyhcbiAgICAgICAgICAgICAgICAgICAgc3RhcnROb2RlLFxuICAgICAgICAgICAgICAgICAgICBlbmROb2RlLFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoY3VyTm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoY3VyTm9kZSwgY29tcG9uZW50Tm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoY29tcG9uZW50Tm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiuvue9ruW9k+WJjeiKgueCueaIluiAhee7hOS7tueahOWxnuaAp1xuICAgICAgICAgKlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIOWxnuaAp+WQjVxuICAgICAgICAgKiBAcGFyYW0geyp9IHZhbHVlIOWxnuaAp+WAvFxuICAgICAgICAgKi9cbiAgICAgICAgc2V0QXR0cjogZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAobmFtZSA9PT0gJ3JlZicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLiQkcmVmID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5pc0NvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIGlmIChuYW1lID09PSAnY2xhc3MnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdGhpcy5jb21wb25lbnRPcmlnaW5Dc3NDbGFzc0xpc3QuY29uY2F0KERvbVVwZGF0ZXIuZ2V0Q2xhc3NMaXN0KHZhbHVlKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlsID0gdGhpcy50cmVlLnRyZWUubGVuZ3RoOyBpIDwgaWw7ICsraSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBhcnNlck9iaiA9IHRoaXMudHJlZS50cmVlW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VyT2JqLnBhcnNlci5zZXRBdHRyICYmIHBhcnNlck9iai5wYXJzZXIuc2V0QXR0cignY2xhc3MnLCBEb21VcGRhdGVyLmdldENsYXNzTGlzdCh2YWx1ZSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIHNjb3BlID0gdGhpcy50cmVlLnJvb3RTY29wZTtcbiAgICAgICAgICAgICAgICBzY29wZS5zZXQobmFtZSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgRXZlbnRFeHByUGFyc2VyLnByb3RvdHlwZS5zZXRBdHRyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiOt+WPluWxnuaAp1xuICAgICAgICAgKlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqIEBwYXJhbSAge3N0cmluZ30gbmFtZSDlsZ7mgKflkI1cbiAgICAgICAgICogQHJldHVybiB7Kn0gICAgICDlsZ7mgKflgLxcbiAgICAgICAgICovXG4gICAgICAgIGdldEF0dHI6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0NvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnRyZWUucm9vdFNjb3BlLmdldChuYW1lKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIEV2ZW50RXhwclBhcnNlci5wcm90b3R5cGUuZ2V0QXR0cih0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNvbGxlY3RDb21wb25lbnRFeHByczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGN1ck5vZGUgPSB0aGlzLm5vZGU7XG5cbiAgICAgICAgICAgIHZhciBhdHRyaWJ1dGVzID0gY3VyTm9kZS5hdHRyaWJ1dGVzO1xuICAgICAgICAgICAgLy8g5pCc6ZuG5LiN5ZCr5pyJ6KGo6L6+5byP55qE5bGe5oCn77yM54S25ZCO5Zyo57uE5Lu257G75Yib5bu65aW95LmL5ZCO6K6+572u6L+b57uE5Lu2XG4gICAgICAgICAgICB0aGlzLnNldExpdGVyYWxBdHRyc0ZucyA9IFtdO1xuXG4gICAgICAgICAgICAvLyDmmK/lkKblrZjlnKhjc3PnsbvlkI3nmoTorr7nva7lh73mlbBcbiAgICAgICAgICAgIHZhciBoYXNDbGFzcyA9IGZhbHNlO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlsID0gYXR0cmlidXRlcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGF0dHIgPSBhdHRyaWJ1dGVzW2ldO1xuICAgICAgICAgICAgICAgIGhhc0NsYXNzID0gYXR0ci5ub2RlTmFtZSA9PT0gJ2NsYXNzLWxpc3QnO1xuXG4gICAgICAgICAgICAgICAgdmFyIGV4cHIgPSBhdHRyLm5vZGVWYWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25maWcuZ2V0RXhwclJlZ0V4cCgpLnRlc3QoZXhwcikpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5leHBycy5wdXNoKGV4cHIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZXhwckZuc1tleHByXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJhd0V4cHIgPSBnZXRSYXdFeHByKGV4cHIsIHRoaXMuY29uZmlnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXhwckNhbGN1bGF0ZXIuY3JlYXRlRXhwckZuKHJhd0V4cHIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5leHByRm5zW2V4cHJdID0gdXRpbHMuYmluZChjYWxjdWxhdGVFeHByLCBudWxsLCByYXdFeHByLCB0aGlzLmV4cHJDYWxjdWxhdGVyKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVGbnNbZXhwcl0gPSB0aGlzLnVwZGF0ZUZuc1tleHByXSB8fCBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlRm5zW2V4cHJdLnB1c2godXRpbHMuYmluZChzZXRBdHRyRm4sIHRoaXMsIGF0dHIubm9kZU5hbWUpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRMaXRlcmFsQXR0cnNGbnMucHVzaChcbiAgICAgICAgICAgICAgICAgICAgICAgIHV0aWxzLmJpbmQoc2V0QXR0ckZuLCB0aGlzLCBhdHRyLm5vZGVOYW1lLCBhdHRyLm5vZGVWYWx1ZSwgdHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghaGFzQ2xhc3MpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldExpdGVyYWxBdHRyc0Zucy5wdXNoKFxuICAgICAgICAgICAgICAgICAgICB1dGlscy5iaW5kKHNldEF0dHJGbiwgdGhpcywgJ2NsYXNzJywgW10pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog6K6+572u57uE5Lu25bGe5oCn44CCXG4gICAgICAgICAgICAgKiDnlLHkuo5IVE1M5qCH562+5Lit5LiN6IO95YaZ6am85bOw5b2i5byP55qE5bGe5oCn5ZCN77yMXG4gICAgICAgICAgICAgKiDmiYDku6XmraTlpITkvJrlsIbkuK3mqKrnur/lvaLlvI/nmoTlsZ7mgKfovazmjaLmiJDpqbzls7DlvaLlvI/jgIJcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAaW5uZXJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lICAgICAg5bGe5oCn5ZCNXG4gICAgICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgICAgIOWxnuaAp+WAvFxuICAgICAgICAgICAgICogQHBhcmFtIHtib29sZWFufSBpc0xpdGVyYWwg5piv5ZCm5piv5bi46YeP5bGe5oCnXG4gICAgICAgICAgICAgKiBAcGFyYW0ge0NvbXBvbmVudH0gY29tcG9uZW50IOe7hOS7tlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBmdW5jdGlvbiBzZXRBdHRyRm4obmFtZSwgdmFsdWUsIGlzTGl0ZXJhbCkge1xuICAgICAgICAgICAgICAgIG5hbWUgPSB1dGlscy5saW5lMmNhbWVsKG5hbWUpO1xuICAgICAgICAgICAgICAgIGlmIChuYW1lID09PSAnY2xhc3MnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdGhpcy5jb21wb25lbnRPcmlnaW5Dc3NDbGFzc0xpc3QuY29uY2F0KERvbVVwZGF0ZXIuZ2V0Q2xhc3NMaXN0KHZhbHVlKSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0xpdGVyYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50T3JpZ2luQ3NzQ2xhc3NMaXN0ID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRBdHRyKG5hbWUsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gY2FsY3VsYXRlRXhwcihyYXdFeHByLCBleHByQ2FsY3VsYXRlciwgc2NvcGVNb2RlbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBleHByQ2FsY3VsYXRlci5jYWxjdWxhdGUocmF3RXhwciwgZmFsc2UsIHNjb3BlTW9kZWwpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRSYXdFeHByKGV4cHIsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgIHJldHVybiBleHByLnJlcGxhY2UoY29uZmlnLmdldEV4cHJSZWdFeHAoKSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXJndW1lbnRzWzFdO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5blvIDlp4voioLngrlcbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKiBAaW5oZXJpdERvY1xuICAgICAgICAgKiBAcmV0dXJuIHtOb2RlfVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0U3RhcnROb2RlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0NvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnN0YXJ0Tm9kZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIEV2ZW50RXhwclBhcnNlci5wcm90b3R5cGUuZ2V0U3RhcnROb2RlLmNhbGwodGhpcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiOt+WPlue7k+adn+iKgueCuVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICAqIEBpbmhlcml0RG9jXG4gICAgICAgICAqIEByZXR1cm4ge05vZGV9XG4gICAgICAgICAqL1xuICAgICAgICBnZXRFbmROb2RlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0NvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmVuZE5vZGU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBFdmVudEV4cHJQYXJzZXIucHJvdG90eXBlLmdldEVuZE5vZGUuY2FsbCh0aGlzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRTY29wZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5zY29wZU1vZGVsID0gdGhpcy50cmVlLnJvb3RTY29wZTtcbiAgICAgICAgICAgIEV2ZW50RXhwclBhcnNlci5wcm90b3R5cGUuc2V0U2NvcGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuaXNDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaWwgPSB0aGlzLnNldExpdGVyYWxBdHRyc0Zucy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0TGl0ZXJhbEF0dHJzRm5zW2ldKHRoaXMuY29tcG9uZW50KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudC5jb21wb25lbnREaWRNb3VudCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGdldFNjb3BlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50cmVlLnJvb3RTY29wZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBzY29wZU1vZGVs6YeM6Z2i55qE5YC85Y+R55Sf5LqG5Y+Y5YyWXG4gICAgICAgIG9uQ2hhbmdlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0dvRGFyaykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuaXNDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgZXhwcnMgPSB0aGlzLmV4cHJzO1xuICAgICAgICAgICAgICAgIHZhciBleHByT2xkVmFsdWVzID0gdGhpcy5leHByT2xkVmFsdWVzO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IGV4cHJzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGV4cHIgPSBleHByc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGV4cHJWYWx1ZSA9IHRoaXMuZXhwckZuc1tleHByXSh0aGlzLnNjb3BlTW9kZWwpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmRpcnR5Q2hlY2soZXhwciwgZXhwclZhbHVlLCBleHByT2xkVmFsdWVzW2V4cHJdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHVwZGF0ZUZucyA9IHRoaXMudXBkYXRlRm5zW2V4cHJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGpsID0gdXBkYXRlRm5zLmxlbmd0aDsgaiA8IGpsOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVGbnNbal0oZXhwclZhbHVlLCB0aGlzLmNvbXBvbmVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBleHByT2xkVmFsdWVzW2V4cHJdID0gZXhwclZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIEV2ZW50RXhwclBhcnNlci5wcm90b3R5cGUub25DaGFuZ2UuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBnb0Rhcms6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50cyAmJiB0aGlzLmNvbXBvbmVudC5nb0RhcmsoKTtcbiAgICAgICAgICAgIEV2ZW50RXhwclBhcnNlci5wcm90b3R5cGUuZ29EYXJrLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVzdG9yZUZyb21EYXJrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudHMgJiYgdGhpcy5jb21wb25lbnQucmVzdG9yZUZyb21EYXJrKCk7XG4gICAgICAgICAgICBFdmVudEV4cHJQYXJzZXIucHJvdG90eXBlLnJlc3RvcmVGcm9tRGFyay5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlZjogZnVuY3Rpb24gKHJlZikge1xuICAgICAgICAgICAgdmFyIHBhcnNlclRyZWUgPSB0aGlzLnRyZWUudHJlZTtcblxuICAgICAgICAgICAgdmFyIHJldDtcbiAgICAgICAgICAgIHRoaXMud2FsayhwYXJzZXJUcmVlLCBmdW5jdGlvbiAocGFyc2VyKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhcnNlci5pc0NvbXBvbmVudCAmJiBwYXJzZXIuJCRyZWYgPT09IHJlZikge1xuICAgICAgICAgICAgICAgICAgICByZXQgPSBwYXJzZXIuY29tcG9uZW50O1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5jb21wb25lbnQuY29tcG9uZW50V2lsbFVubW91bnQoKTtcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50LmRlc3Ryb3koKTtcbiAgICAgICAgICAgIEV2ZW50RXhwclBhcnNlci5wcm90b3R5cGUuZGVzdHJveS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDpgY3ljoZwYXJzZXJUcmVlXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqIEBwYXJhbSAge1RyZWV9IHBhcnNlclRyZWUg5qCRXG4gICAgICAgICAqIEBwYXJhbSAge2Z1bmN0aW9uKFBhcnNlcik6Ym9vbGVhbn0gaXRlcmF0ZXJGbiDov63ku6Plh73mlbBcbiAgICAgICAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICAgICAgICovXG4gICAgICAgIHdhbGs6IGZ1bmN0aW9uIChwYXJzZXJUcmVlLCBpdGVyYXRlckZuKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaWwgPSBwYXJzZXJUcmVlLmxlbmd0aDsgaSA8IGlsOyArK2kpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFyc2VyT2JqID0gcGFyc2VyVHJlZVtpXTtcblxuICAgICAgICAgICAgICAgIC8vIOmSiOWvuWlm5oyH5Luk55qE5oOF5Ya1XG4gICAgICAgICAgICAgICAgaWYgKHV0aWxzLmlzQXJyYXkocGFyc2VyT2JqKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy53YWxrKHBhcnNlck9iaiwgaXRlcmF0ZXJGbikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIOmSiOWvuWZvcuaMh+S7pOeahOaDheWGtVxuICAgICAgICAgICAgICAgIGlmICh1dGlscy5pc0FycmF5KHBhcnNlck9iai50cmVlcykpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGpsID0gcGFyc2VyT2JqLnRyZWVzLmxlbmd0aDsgaiA8IGpsOyArK2opIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLndhbGsocGFyc2VyT2JqLnRyZWVzW2pdLnRyZWUsIGl0ZXJhdGVyRm4pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGl0ZXJhdGVyRm4ocGFyc2VyT2JqLnBhcnNlcikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHBhcnNlck9iai5jaGlsZHJlbiAmJiBwYXJzZXJPYmouY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLndhbGsocGFyc2VyT2JqLmNoaWxkcmVuLCBpdGVyYXRlckZuKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgJG5hbWU6ICdDb21wb25lbnRQYXJzZXInXG4gICAgfVxuKTtcblxuVHJlZS5yZWdpc3RlUGFyc2VyKG1vZHVsZS5leHBvcnRzKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdmNvbXBvbmVudC9zcmMvQ29tcG9uZW50UGFyc2VyLmpzXG4gKiogbW9kdWxlIGlkID0gMjNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDJcbiAqKi8iLCIvKipcbiAqIEBmaWxlIOWkhOeQhuS6huS6i+S7tueahCBFeHByUGFyc2VyXG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20pXG4gKi9cblxudmFyIEV4cHJQYXJzZXIgPSByZXF1aXJlKCcuL0V4cHJQYXJzZXInKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG52YXIgVHJlZSA9IHJlcXVpcmUoJy4uL3RyZWVzL1RyZWUnKTtcbnZhciBTY29wZU1vZGVsID0gcmVxdWlyZSgnLi4vU2NvcGVNb2RlbCcpO1xudmFyIERvbVVwZGF0ZXIgPSByZXF1aXJlKCcuLi9Eb21VcGRhdGVyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gRXhwclBhcnNlci5leHRlbmRzKFxuICAgIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICog5Yid5aeL5YyWXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICovXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIEV4cHJQYXJzZXIucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgICAgICAgICAgdGhpcy5ldmVudHMgPSB7fTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog5re75Yqg6KGo6L6+5byPXG4gICAgICAgICAqXG4gICAgICAgICAqIEBpbmhlcml0XG4gICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICogQHBhcmFtIHtBdHRyfSBhdHRyIOWmguaenOW9k+WJjeaYr+WFg+e0oOiKgueCue+8jOWImeimgeS8oOWFpemBjeWOhuWIsOeahOWxnuaAp++8jFxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAg5omA5LulYXR0cuWtmOWcqOS4juWQpuaYr+WIpOaWreW9k+WJjeWFg+e0oOaYr+WQpuaYr+aWh+acrOiKgueCueeahOS4gOS4quS+neaNrlxuICAgICAgICAgKiBAcmV0dXJuIHt1bmRlZmluZWR9XG4gICAgICAgICAqL1xuICAgICAgICBhZGRFeHByOiBmdW5jdGlvbiAoYXR0cikge1xuICAgICAgICAgICAgaWYgKCFhdHRyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEV4cHJQYXJzZXIucHJvdG90eXBlLmFkZEV4cHIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGV2ZW50TmFtZSA9IGdldEV2ZW50TmFtZShhdHRyLm5hbWUsIHRoaXMuY29uZmlnKTtcbiAgICAgICAgICAgIGlmICghZXZlbnROYW1lICYmIERvbVVwZGF0ZXIuaXNFdmVudE5hbWUoYXR0ci5uYW1lKSkge1xuICAgICAgICAgICAgICAgIGV2ZW50TmFtZSA9IGF0dHIubmFtZS5yZXBsYWNlKCdvbicsICcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChldmVudE5hbWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25maWcuZ2V0RXhwclJlZ0V4cCgpLnRlc3QoYXR0ci52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudHNbZXZlbnROYW1lXSA9IGF0dHIudmFsdWU7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGV4cHIgPSBhdHRyLnZhbHVlLnJlcGxhY2UoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZy5nZXRFeHByUmVnRXhwKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFyZ3VtZW50c1sxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5leHByQ2FsY3VsYXRlci5jcmVhdGVFeHByRm4oZXhwciwgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcblxuICAgICAgICAgICAgICAgICAgICBEb21VcGRhdGVyLnNldEF0dHIodGhpcy5ub2RlLCAnb24nICsgZXZlbnROYW1lLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsb2NhbFNjb3BlID0gbmV3IFNjb3BlTW9kZWwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsU2NvcGUuc2V0KCdldmVudCcsIGV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsU2NvcGUuc2V0UGFyZW50KG1lLmdldFNjb3BlKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWUuZXhwckNhbGN1bGF0ZXIuY2FsY3VsYXRlKGV4cHIsIHRydWUsIGxvY2FsU2NvcGUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBFeHByUGFyc2VyLnByb3RvdHlwZS5hZGRFeHByLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOmUgOavgVxuICAgICAgICAgKlxuICAgICAgICAgKiBAaW5oZXJpdFxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqL1xuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB1dGlscy5lYWNoKHRoaXMuZXZlbnRzLCBmdW5jdGlvbiAoYXR0clZhbHVlLCBldmVudE5hbWUpIHtcbiAgICAgICAgICAgICAgICBEb21VcGRhdGVyLnNldEF0dHIodGhpcy5ub2RlLCAnb24nICsgZXZlbnROYW1lKTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5ldmVudHMgPSBudWxsO1xuXG4gICAgICAgICAgICBFeHByUGFyc2VyLnByb3RvdHlwZS5kZXN0cm95LmFwcGx5KHRoaXMpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICAgICRuYW1lOiAnRXZlbnRFeHByUGFyc2VyJ1xuICAgIH1cbik7XG5cblRyZWUucmVnaXN0ZVBhcnNlcihtb2R1bGUuZXhwb3J0cyk7XG5cblxuZnVuY3Rpb24gZ2V0RXZlbnROYW1lKGF0dHJOYW1lLCBjb25maWcpIHtcbiAgICBpZiAoYXR0ck5hbWUuaW5kZXhPZihjb25maWcuZXZlbnRQcmVmaXggKyAnLScpID09PSAtMSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcmV0dXJuIGF0dHJOYW1lLnJlcGxhY2UoY29uZmlnLmV2ZW50UHJlZml4ICsgJy0nLCAnJyk7XG59XG5cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdnRwbC9zcmMvcGFyc2Vycy9FdmVudEV4cHJQYXJzZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAyNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMlxuICoqLyIsIi8qKlxuICogQGZpbGUg6KGo6L6+5byP6Kej5p6Q5Zmo77yM5LiA5Liq5paH5pys6IqC54K55oiW6ICF5YWD57Sg6IqC54K55a+55bqU5LiA5Liq6KGo6L6+5byP6Kej5p6Q5Zmo5a6e5L6LXG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20pXG4gKi9cblxudmFyIFBhcnNlciA9IHJlcXVpcmUoJy4vUGFyc2VyJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xudmFyIFRyZWUgPSByZXF1aXJlKCcuLi90cmVlcy9UcmVlJyk7XG52YXIgRG9tVXBkYXRlciA9IHJlcXVpcmUoJy4uL0RvbVVwZGF0ZXInKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQYXJzZXIuZXh0ZW5kcyhcbiAgICB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOWIneWni+WMllxuICAgICAgICAgKlxuICAgICAgICAgKiBAaW5oZXJpdERvY1xuICAgICAgICAgKiBAcGFyYW0gIHtPYmplY3R9IG9wdGlvbnMg5Y+C5pWwXG4gICAgICAgICAqIEBwYXJhbSAge05vZGV9IG9wdGlvbnMubm9kZSBET03oioLngrlcbiAgICAgICAgICovXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgICBQYXJzZXIucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgICAgICAgICAgdGhpcy5ub2RlID0gb3B0aW9ucy5ub2RlO1xuXG4gICAgICAgICAgICB0aGlzLmV4cHJzID0gW107XG4gICAgICAgICAgICB0aGlzLmV4cHJGbnMgPSB7fTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRm5zID0ge307XG4gICAgICAgICAgICAvLyDmgaLlpI3ljp/osoznmoTlh73mlbBcbiAgICAgICAgICAgIHRoaXMucmVzdG9yZUZucyA9IHt9O1xuICAgICAgICAgICAgdGhpcy5leHByT2xkVmFsdWVzID0ge307XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRE9N6IqC54K55bGe5oCn5LiO5pu05paw5bGe5oCn55qE5Lu75YqhaWTnmoTmmKDlsIRcbiAgICAgICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRoaXMuYXR0clRvRG9tVGFza0lkTWFwID0ge307XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOaQnOmbhui/h+eoi1xuICAgICAgICAgKlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IOi/lOWbnuW4g+WwlOWAvFxuICAgICAgICAgKi9cbiAgICAgICAgY29sbGVjdEV4cHJzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgY3VyTm9kZSA9IHRoaXMubm9kZTtcblxuICAgICAgICAgICAgLy8g5paH5pys6IqC54K5XG4gICAgICAgICAgICBpZiAoY3VyTm9kZS5ub2RlVHlwZSA9PT0gMykge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkRXhwcigpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDlhYPntKDoioLngrlcbiAgICAgICAgICAgIGlmIChjdXJOb2RlLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSBjdXJOb2RlLmF0dHJpYnV0ZXM7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlsID0gYXR0cmlidXRlcy5sZW5ndGg7IGkgPCBpbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkRXhwcihhdHRyaWJ1dGVzW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog5re75Yqg6KGo6L6+5byPXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICogQHBhcmFtIHtBdHRyfSBhdHRyIOWmguaenOW9k+WJjeaYr+WFg+e0oOiKgueCue+8jOWImeimgeS8oOWFpemBjeWOhuWIsOeahOWxnuaAp++8jFxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAg5omA5LulYXR0cuWtmOWcqOS4juWQpuaYr+WIpOaWreW9k+WJjeWFg+e0oOaYr+WQpuaYr+aWh+acrOiKgueCueeahOS4gOS4quS+neaNrlxuICAgICAgICAgKi9cbiAgICAgICAgYWRkRXhwcjogZnVuY3Rpb24gKGF0dHIpIHtcbiAgICAgICAgICAgIHZhciBleHByID0gYXR0ciA/IGF0dHIudmFsdWUgOiB0aGlzLm5vZGUubm9kZVZhbHVlO1xuICAgICAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5nZXRFeHByUmVnRXhwKCkudGVzdChleHByKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFkZEV4cHIoXG4gICAgICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgICAgICBleHByLFxuICAgICAgICAgICAgICAgIGF0dHJcbiAgICAgICAgICAgICAgICAgICAgPyBjcmVhdGVBdHRyVXBkYXRlRm4odGhpcy5nZXRUYXNrSWQoYXR0ci5uYW1lKSwgdGhpcy5ub2RlLCBhdHRyLm5hbWUsIHRoaXMuZG9tVXBkYXRlcilcbiAgICAgICAgICAgICAgICAgICAgOiAoZnVuY3Rpb24gKG1lLCBjdXJOb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGFza0lkID0gbWUuZG9tVXBkYXRlci5nZW5lcmF0ZVRhc2tJZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChleHByVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZS5kb21VcGRhdGVyLmFkZFRhc2tGbihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFza0lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1dGlscy5iaW5kKGZ1bmN0aW9uIChjdXJOb2RlLCBleHByVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1ck5vZGUubm9kZVZhbHVlID0gZXhwclZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBudWxsLCBjdXJOb2RlLCBleHByVmFsdWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH0pKHRoaXMsIHRoaXMubm9kZSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHRoaXMucmVzdG9yZUZuc1tleHByXSA9IHRoaXMucmVzdG9yZUZuc1tleHByXSB8fCBbXTtcbiAgICAgICAgICAgIGlmIChhdHRyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXN0b3JlRm5zW2V4cHJdLnB1c2godXRpbHMuYmluZChmdW5jdGlvbiAoY3VyTm9kZSwgYXR0ck5hbWUsIGF0dHJWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBjdXJOb2RlLnNldEF0dHJpYnV0ZShhdHRyTmFtZSwgYXR0clZhbHVlKTtcbiAgICAgICAgICAgICAgICB9LCBudWxsLCB0aGlzLm5vZGUsIGF0dHIubmFtZSwgYXR0ci52YWx1ZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXN0b3JlRm5zW2V4cHJdLnB1c2godXRpbHMuYmluZChmdW5jdGlvbiAoY3VyTm9kZSwgbm9kZVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGN1ck5vZGUubm9kZVZhbHVlID0gbm9kZVZhbHVlO1xuICAgICAgICAgICAgICAgIH0sIG51bGwsIHRoaXMubm9kZSwgdGhpcy5ub2RlLm5vZGVWYWx1ZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5blvIDlp4voioLngrlcbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKiBAaW5oZXJpdERvY1xuICAgICAgICAgKiBAcmV0dXJuIHtOb2RlfVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0U3RhcnROb2RlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ub2RlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5bnu5PmnZ/oioLngrlcbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKiBAaW5oZXJpdERvY1xuICAgICAgICAgKiBAcmV0dXJuIHtOb2RlfVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0RW5kTm9kZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubm9kZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6ZSA5q+BXG4gICAgICAgICAqXG4gICAgICAgICAqIEBpbmhlcml0RG9jXG4gICAgICAgICAqL1xuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB1dGlscy5lYWNoKHRoaXMuZXhwcnMsIGZ1bmN0aW9uIChleHByKSB7XG4gICAgICAgICAgICAgICAgdXRpbHMuZWFjaCh0aGlzLnJlc3RvcmVGbnNbZXhwcl0sIGZ1bmN0aW9uIChyZXN0b3JlRm4pIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdG9yZUZuKCk7XG4gICAgICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICAgICAgdGhpcy5ub2RlID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuZXhwcnMgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5leHByRm5zID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRm5zID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuZXhwck9sZFZhbHVlcyA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLnJlc3RvcmVGbnMgPSBudWxsO1xuXG4gICAgICAgICAgICBQYXJzZXIucHJvdG90eXBlLmRlc3Ryb3kuY2FsbCh0aGlzKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6IqC54K54oCc6ZqQ6JeP4oCd6LW35p2lXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwdWJsaWNcbiAgICAgICAgICovXG4gICAgICAgIGdvRGFyazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdXRpbHMuZ29EYXJrKHRoaXMubm9kZSk7XG4gICAgICAgICAgICB0aGlzLmlzR29EYXJrID0gdHJ1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog5ZyobW9kZWzlj5HnlJ/mlLnlj5jnmoTml7blgJnorqHnrpfkuIDkuIvooajovr7lvI/nmoTlgLwtPuiEj+ajgOa1iy0+5pu05paw55WM6Z2i44CCXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgICovXG4gICAgICAgIG9uQ2hhbmdlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0dvRGFyaykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGV4cHJzID0gdGhpcy5leHBycztcbiAgICAgICAgICAgIHZhciBleHByT2xkVmFsdWVzID0gdGhpcy5leHByT2xkVmFsdWVzO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlsID0gZXhwcnMubGVuZ3RoOyBpIDwgaWw7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBleHByID0gZXhwcnNbaV07XG4gICAgICAgICAgICAgICAgdmFyIGV4cHJWYWx1ZSA9IHRoaXMuZXhwckZuc1tleHByXSh0aGlzLnNjb3BlTW9kZWwpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZGlydHlDaGVjayhleHByLCBleHByVmFsdWUsIGV4cHJPbGRWYWx1ZXNbZXhwcl0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB1cGRhdGVGbnMgPSB0aGlzLnVwZGF0ZUZuc1tleHByXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGpsID0gdXBkYXRlRm5zLmxlbmd0aDsgaiA8IGpsOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZUZuc1tqXShleHByVmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZXhwck9sZFZhbHVlc1tleHByXSA9IGV4cHJWYWx1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgUGFyc2VyLnByb3RvdHlwZS5vbkNoYW5nZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDoioLngrnigJzmmL7npLrigJ3lh7rmnaVcbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKi9cbiAgICAgICAgcmVzdG9yZUZyb21EYXJrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB1dGlscy5yZXN0b3JlRnJvbURhcmsodGhpcy5ub2RlKTtcbiAgICAgICAgICAgIHRoaXMuaXNHb0RhcmsgPSBmYWxzZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog5qC55o2uRE9N6IqC54K555qE5bGe5oCn5ZCN5a2X5ou/5Yiw5LiA5Liq5Lu75YqhaWTjgIJcbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IGF0dHJOYW1lIOWxnuaAp+WQjeWtl1xuICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgIOS7u+WKoWlkXG4gICAgICAgICAqL1xuICAgICAgICBnZXRUYXNrSWQ6IGZ1bmN0aW9uIChhdHRyTmFtZSkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmF0dHJUb0RvbVRhc2tJZE1hcFthdHRyTmFtZV0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLmF0dHJUb0RvbVRhc2tJZE1hcFthdHRyTmFtZV0gPSB0aGlzLmRvbVVwZGF0ZXIuZ2VuZXJhdGVUYXNrSWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmF0dHJUb0RvbVRhc2tJZE1hcFthdHRyTmFtZV07XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiuvue9ruW9k+WJjeiKgueCueeahOWxnuaAp1xuICAgICAgICAgKlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIOWxnuaAp+WQjVxuICAgICAgICAgKiBAcGFyYW0geyp9IHZhbHVlIOWxnuaAp+WAvFxuICAgICAgICAgKi9cbiAgICAgICAgc2V0QXR0cjogZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgdGFza0lkID0gdGhpcy5nZXRUYXNrSWQoKTtcbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLmRvbVVwZGF0ZXIuYWRkVGFza0ZuKHRhc2tJZCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIERvbVVwZGF0ZXIuc2V0QXR0cihtZS5ub2RlLCBuYW1lLCB2YWx1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6I635Y+W5bGe5oCnXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwdWJsaWNcbiAgICAgICAgICogQHBhcmFtICB7c3RyaW5nfSBuYW1lIOWxnuaAp+WQjVxuICAgICAgICAgKiBAcmV0dXJuIHsqfSAgICAgIOWxnuaAp+WAvFxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0QXR0cjogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiBEb21VcGRhdGVyLmdldEF0dHIodGhpcy5ub2RlLCBuYW1lKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDliKTmlq3oioLngrnmmK/lkKbmmK/lupTor6XnlLHlvZPliY3lpITnkIblmajmnaXlpITnkIZcbiAgICAgICAgICpcbiAgICAgICAgICogQHN0YXRpY1xuICAgICAgICAgKiBAcGFyYW0gIHtOb2RlfSAgbm9kZSDoioLngrlcbiAgICAgICAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICAgICAgICovXG4gICAgICAgIGlzUHJvcGVyTm9kZTogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBub2RlLm5vZGVUeXBlID09PSAxIHx8IG5vZGUubm9kZVR5cGUgPT09IDM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJG5hbWU6ICdFeHByUGFyc2VyJ1xuICAgIH1cbik7XG5cblRyZWUucmVnaXN0ZVBhcnNlcihtb2R1bGUuZXhwb3J0cyk7XG5cbi8qKlxuICog5Yib5bu6RE9N6IqC54K55bGe5oCn5pu05paw5Ye95pWwXG4gKlxuICogQGlubmVyXG4gKiBAcGFyYW0ge251bWJlcn0gdGFza0lkIGRvbeS7u+WKoWlkXG4gKiBAcGFyYW0gIHtOb2RlfSBub2RlICAgIERPTeS4reeahOiKgueCuVxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUg6KaB5pu05paw55qE5bGe5oCn5ZCNXG4gKiBAcGFyYW0gIHtEb21VcGRhdGVyfSBkb21VcGRhdGVyIERPTeabtOaWsOWZqFxuICogQHJldHVybiB7ZnVuY3Rpb24oT2JqZWN0KX0gICAgICDmm7TmlrDlh73mlbBcbiAqL1xuZnVuY3Rpb24gY3JlYXRlQXR0clVwZGF0ZUZuKHRhc2tJZCwgbm9kZSwgbmFtZSwgZG9tVXBkYXRlcikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZXhwclZhbHVlKSB7XG4gICAgICAgIGRvbVVwZGF0ZXIuYWRkVGFza0ZuKFxuICAgICAgICAgICAgdGFza0lkLFxuICAgICAgICAgICAgdXRpbHMuYmluZChmdW5jdGlvbiAobm9kZSwgbmFtZSwgZXhwclZhbHVlKSB7XG4gICAgICAgICAgICAgICAgRG9tVXBkYXRlci5zZXRBdHRyKG5vZGUsIG5hbWUsIGV4cHJWYWx1ZSk7XG4gICAgICAgICAgICB9LCBudWxsLCBub2RlLCBuYW1lLCBleHByVmFsdWUpXG4gICAgICAgICk7XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gYWRkRXhwcihwYXJzZXIsIGV4cHIsIHVwZGF0ZUZuKSB7XG4gICAgcGFyc2VyLmV4cHJzLnB1c2goZXhwcik7XG4gICAgaWYgKCFwYXJzZXIuZXhwckZuc1tleHByXSkge1xuICAgICAgICBwYXJzZXIuZXhwckZuc1tleHByXSA9IGNyZWF0ZUV4cHJGbihwYXJzZXIsIGV4cHIpO1xuICAgIH1cbiAgICBwYXJzZXIudXBkYXRlRm5zW2V4cHJdID0gcGFyc2VyLnVwZGF0ZUZuc1tleHByXSB8fCBbXTtcbiAgICBwYXJzZXIudXBkYXRlRm5zW2V4cHJdLnB1c2godXBkYXRlRm4pO1xufVxuXG4vKipcbiAqIOWIm+W7uuagueaNrnNjb3BlTW9kZWzorqHnrpfooajovr7lvI/lgLznmoTlh73mlbBcbiAqXG4gKiBAaW5uZXJcbiAqIEBwYXJhbSAge1BhcnNlcn0gcGFyc2VyIOino+aekOWZqOWunuS+i1xuICogQHBhcmFtICB7c3RyaW5nfSBleHByICAg5ZCr5pyJ6KGo6L6+5byP55qE5a2X56ym5LiyXG4gKiBAcmV0dXJuIHtmdW5jdGlvbihTY29wZSk6Kn1cbiAqL1xuZnVuY3Rpb24gY3JlYXRlRXhwckZuKHBhcnNlciwgZXhwcikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoc2NvcGVNb2RlbCkge1xuICAgICAgICAvLyDmraTlpITopoHliIbkuKTnp43mg4XlhrXvvJpcbiAgICAgICAgLy8gMeOAgWV4cHLlubbkuI3mmK/nuq/mraPnmoTooajovr7lvI/vvIzlpoJgPT0ke25hbWV9PT1g44CCXG4gICAgICAgIC8vIDLjgIFleHBy5piv57qv5q2j55qE6KGo6L6+5byP77yM5aaCYCR7bmFtZX1g44CCXG4gICAgICAgIC8vIOWvueS6juS4jee6r+ato+ihqOi+vuW8j+eahOaDheWGte+8jOatpOWkhOeahOi/lOWbnuWAvOiCr+WumuaYr+Wtl+espuS4su+8m1xuICAgICAgICAvLyDogIzlr7nkuo7nuq/mraPnmoTooajovr7lvI/vvIzmraTlpITlsLHkuI3opoHlsIblhbbovazmjaLmiJDlrZfnrKbkuLLlvaLlvI/kuobjgIJcblxuICAgICAgICB2YXIgcmVnRXhwID0gcGFyc2VyLmNvbmZpZy5nZXRFeHByUmVnRXhwKCk7XG5cbiAgICAgICAgdmFyIHBvc3NpYmxlRXhwckNvdW50ID0gZXhwci5tYXRjaChuZXcgUmVnRXhwKHV0aWxzLnJlZ0V4cEVuY29kZShwYXJzZXIuY29uZmlnLmV4cHJQcmVmaXgpLCAnZycpKTtcbiAgICAgICAgcG9zc2libGVFeHByQ291bnQgPSBwb3NzaWJsZUV4cHJDb3VudCA/IHBvc3NpYmxlRXhwckNvdW50Lmxlbmd0aCA6IDA7XG5cbiAgICAgICAgLy8g5LiN57qv5q2jXG4gICAgICAgIGlmIChwb3NzaWJsZUV4cHJDb3VudCAhPT0gMSB8fCBleHByLnJlcGxhY2UocmVnRXhwLCAnJykpIHtcbiAgICAgICAgICAgIHJldHVybiBleHByLnJlcGxhY2UocmVnRXhwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcGFyc2VyLmV4cHJDYWxjdWxhdGVyLmNyZWF0ZUV4cHJGbihhcmd1bWVudHNbMV0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZXIuZXhwckNhbGN1bGF0ZXIuY2FsY3VsYXRlKGFyZ3VtZW50c1sxXSwgZmFsc2UsIHNjb3BlTW9kZWwpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDnuq/mraNcbiAgICAgICAgdmFyIHB1cmVFeHByID0gZXhwci5zbGljZShwYXJzZXIuY29uZmlnLmV4cHJQcmVmaXgubGVuZ3RoLCAtcGFyc2VyLmNvbmZpZy5leHByU3VmZml4Lmxlbmd0aCk7XG4gICAgICAgIHBhcnNlci5leHByQ2FsY3VsYXRlci5jcmVhdGVFeHByRm4ocHVyZUV4cHIpO1xuICAgICAgICByZXR1cm4gcGFyc2VyLmV4cHJDYWxjdWxhdGVyLmNhbGN1bGF0ZShwdXJlRXhwciwgZmFsc2UsIHNjb3BlTW9kZWwpO1xuICAgIH07XG59XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Z0cGwvc3JjL3BhcnNlcnMvRXhwclBhcnNlci5qc1xuICoqIG1vZHVsZSBpZCA9IDI1XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyXG4gKiovIiwidmFyIFRyZWUgPSByZXF1aXJlKCd2dHBsL3NyYy90cmVlcy9UcmVlJyk7XG52YXIgRXZlbnQgPSByZXF1aXJlKCd2dHBsL3NyYy9FdmVudCcpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgndnRwbC9zcmMvdXRpbHMnKTtcbnZhciBDb21wb25lbnRNYW5hZ2VyID0gcmVxdWlyZSgnLi9Db21wb25lbnRNYW5hZ2VyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVHJlZS5leHRlbmRzKHtcblxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIFRyZWUucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgICAgICB0aGlzLmNvbXBvbmVudEV2ZW50ID0gbmV3IEV2ZW50KCk7XG4gICAgICAgIGlmIChvcHRpb25zLmNvbXBvbmVudENoaWxkcmVuKSB7XG4gICAgICAgICAgICB0aGlzLnNldFRyZWVWYXIoJ2NvbXBvbmVudENoaWxkcmVuJywgb3B0aW9ucy5jb21wb25lbnRDaGlsZHJlbik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY29tcG9uZW50TWFuYWdlciA9IG5ldyBDb21wb25lbnRNYW5hZ2VyKCk7XG4gICAgICAgIGNvbXBvbmVudE1hbmFnZXIuc2V0UGFyZW50KHRoaXMuZ2V0VHJlZVZhcignY29tcG9uZW50TWFuYWdlcicpKTtcbiAgICAgICAgdGhpcy5zZXRUcmVlVmFyKCdjb21wb25lbnRNYW5hZ2VyJywgY29tcG9uZW50TWFuYWdlcik7XG4gICAgfSxcblxuICAgIHNldFBhcmVudDogZnVuY3Rpb24gKHBhcmVudFRyZWUpIHtcbiAgICAgICAgVHJlZS5wcm90b3R5cGUuc2V0UGFyZW50LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgcGFyZW50VHJlZS5yb290U2NvcGUuYWRkQ2hpbGQodGhpcy5yb290U2NvcGUpO1xuICAgICAgICB0aGlzLnJvb3RTY29wZS5zZXRQYXJlbnQocGFyZW50VHJlZS5yb290U2NvcGUpO1xuICAgIH0sXG5cbiAgICBjcmVhdGVQYXJzZXI6IGZ1bmN0aW9uIChQYXJzZXJDbGFzcywgb3B0aW9ucykge1xuICAgICAgICB2YXIgaW5zdGFuY2UgPSBUcmVlLnByb3RvdHlwZS5jcmVhdGVQYXJzZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOazqOWGjOe7hOS7tuexu1xuICAgICAqIOiuvue9rue7keWumuWcqOagkeS4iumdoueahOmineWkluWPmOmHj+OAgui/meS6m+WPmOmHj+acieWmguS4i+eJueaAp++8mlxuICAgICAqIDHjgIHml6Dms5Xopobnm5bvvJtcbiAgICAgKiAy44CB5Zyo6I635Y+WdHJlZVZhcnPkuIrpnaLmn5DkuKrlj5jph4/nmoTml7blgJnvvIzlpoLmnpzlvZPliY3moJHlj5blh7rmnaXmmK91bmRlZmluZWTvvIzpgqPkuYjlsLHkvJrliLDniLbnuqfmoJHnmoR0cmVlVmFyc+S4iuWOu+aJvu+8jOS7peatpOexu+aOqOOAglxuICAgICAqXG4gICAgICogQHB1YmxpY1xuICAgICAqIEBwYXJhbSAge01hcC48c3RyaW5nLCBDb21wb25lbnQ+fSBjb21wb25lbnRDbGFzc2VzIOe7hOS7tuWQjeWSjOe7hOS7tuexu+eahOaYoOWwhFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lICDlj5jph4/lkI1cbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIOWPmOmHj+WAvFxuICAgICAqL1xuICAgIHJlZ2lzdGVDb21wb25lbnRzOiBmdW5jdGlvbiAoY29tcG9uZW50Q2xhc3Nlcykge1xuICAgICAgICBpZiAoIXV0aWxzLmlzQXJyYXkoY29tcG9uZW50Q2xhc3NlcykpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjb21wb25lbnRNYW5hZ2VyID0gdGhpcy5nZXRUcmVlVmFyKCdjb21wb25lbnRNYW5hZ2VyJyk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlsID0gY29tcG9uZW50Q2xhc3Nlcy5sZW5ndGg7IGkgPCBpbDsgKytpKSB7XG4gICAgICAgICAgICB2YXIgY29tcG9uZW50Q2xhc3MgPSBjb21wb25lbnRDbGFzc2VzW2ldO1xuICAgICAgICAgICAgY29tcG9uZW50TWFuYWdlci5yZWdpc3RlKGNvbXBvbmVudENsYXNzKTtcbiAgICAgICAgfVxuICAgIH1cbn0sIHtcbiAgICAkbmFtZTogJ0NvbXBvbmVudFRyZWUnXG59KTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdmNvbXBvbmVudC9zcmMvQ29tcG9uZW50VHJlZS5qc1xuICoqIG1vZHVsZSBpZCA9IDI2XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyXG4gKiovIiwiLyoqXG4gKiBAZmlsZSDnu4Tku7bnrqHnkIbjgIJDb21wb25lbnRNYW5hZ2Vy5Lmf5piv5pyJ5bGC57qn5YWz57O755qE77yMXG4gKiAgICAgICBUcmVl5LiL6Z2i55qEQ29tcG9uZW50TWFuYWdlcuazqOWGjOi/meS4qlRyZWXlrp7kvovnlKjliLDnmoRDb21wb25lbnTvvIxcbiAqICAgICAgIOiAjOWcqENvbXBvbmVudOS4reS5n+WPr+S7peazqOWGjOatpENvbXBvbmVudOeahHRwbOS4reWwhuS8muS9v+eUqOWIsOeahENvbXBvbmVudOOAglxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJ3Z0cGwvc3JjL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIENvbXBvbmVudE1hbmFnZXIoKSB7XG4gICAgdGhpcy5jb21wb25lbnRzID0ge307XG59XG5cbi8qKlxuICog5rOo5YaM57uE5Lu244CCXG4gKlxuICogQHB1YmxpY1xuICogQHBhcmFtICB7Q29uc3RydWN0b3J9IENvbXBvbmVudENsYXNzIOe7hOS7tuexu1xuICogQHBhcmFtICB7c3RyaW5nPX0gbmFtZSAgICAgICAgICAg57uE5Lu25ZCN77yM5Y+v6YCJXG4gKi9cbkNvbXBvbmVudE1hbmFnZXIucHJvdG90eXBlLnJlZ2lzdGUgPSBmdW5jdGlvbiAoQ29tcG9uZW50Q2xhc3MpIHtcbiAgICB2YXIgbmFtZSA9IENvbXBvbmVudENsYXNzLiRuYW1lO1xuICAgIHRoaXMuY29tcG9uZW50c1tuYW1lXSA9IENvbXBvbmVudENsYXNzO1xuICAgIHRoaXMubW91bnRTdHlsZShDb21wb25lbnRDbGFzcyk7XG59O1xuXG4vKipcbiAqIOagueaNruWQjeWtl+iOt+WPlue7hOS7tuexu+OAguWcqOaooeadv+ino+aekOeahOi/h+eoi+S4reS8muiwg+eUqOi/meS4quaWueazleOAglxuICpcbiAqIEBwdWJsaWNcbiAqIEBwYXJhbSAge3N0cmluZ30gbmFtZSDnu4Tku7blkI1cbiAqIEByZXR1cm4ge0NvbXBvbmVudENsYXNzfSAg57uE5Lu257G7XG4gKi9cbkNvbXBvbmVudE1hbmFnZXIucHJvdG90eXBlLmdldENsYXNzID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB2YXIgY29tcG9uZW50ID0gdGhpcy5jb21wb25lbnRzW25hbWVdO1xuICAgIGlmIChjb21wb25lbnQpIHtcbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgICAgY29tcG9uZW50ID0gdGhpcy5wYXJlbnQuZ2V0Q2xhc3MobmFtZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbXBvbmVudDtcbn07XG5cbi8qKlxuICog6K6+572u54i257qn57uE5Lu2566h55CG5ZmoXG4gKlxuICogQHB1YmxpY1xuICogQHBhcmFtIHtDb21wb25lbnRNYW5nZXJ9IGNvbXBvbmVudE1hbmFnZXIg57uE5Lu2566h55CG5ZmoXG4gKi9cbkNvbXBvbmVudE1hbmFnZXIucHJvdG90eXBlLnNldFBhcmVudCA9IGZ1bmN0aW9uIChjb21wb25lbnRNYW5hZ2VyKSB7XG4gICAgdGhpcy5wYXJlbnQgPSBjb21wb25lbnRNYW5hZ2VyO1xufTtcblxuLyoqXG4gKiDlsIbnu4Tku7bnmoTmoLflvI/mjILovb3kuIrljrtcbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHvnu4Tku7bnsbt9IENvbXBvbmVudENsYXNzIOe7hOS7tuexu1xuICovXG5Db21wb25lbnRNYW5hZ2VyLnByb3RvdHlwZS5tb3VudFN0eWxlID0gZnVuY3Rpb24gKENvbXBvbmVudENsYXNzKSB7XG4gICAgdmFyIHN0eWxlTm9kZUlkID0gJ2NvbXBvbmVudC0nICsgQ29tcG9uZW50Q2xhc3MuJG5hbWU7XG5cbiAgICAvLyDliKTmlq3kuIDkuIvvvIzpgb/lhY3ph43lpI3mt7vliqBjc3NcbiAgICBpZiAoIWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHN0eWxlTm9kZUlkKSkge1xuICAgICAgICB2YXIgc3R5bGUgPSBDb21wb25lbnRDbGFzcy5nZXRTdHlsZSgpO1xuICAgICAgICBpZiAoc3R5bGUpIHtcbiAgICAgICAgICAgIHZhciBzdHlsZU5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICAgICAgc3R5bGVOb2RlLnNldEF0dHJpYnV0ZSgnaWQnLCBzdHlsZU5vZGVJZCk7XG4gICAgICAgICAgICBzdHlsZU5vZGUuaW5uZXJIVE1MID0gc3R5bGUucmVwbGFjZShcbiAgICAgICAgICAgICAgICAvI3Jvb3QjL2csXG4gICAgICAgICAgICAgICAgJy4nICsgQ29tcG9uZW50TWFuYWdlci5nZXRDc3NDbGFzc05hbWUoQ29tcG9uZW50Q2xhc3MpLmpvaW4oJy4nKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVOb2RlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIOWwhueItuexu+eahGNzc+agt+W8j+S5n+WKoOS4iuWOu+OAgueItuexu+W+iOWPr+iDveayoeazqOWGjO+8jOWmguaenOatpOWkhOS4jeWKoOS4iuWOu++8jOagt+W8j+WPr+iDveWwseS8mue8uuS4gOWdl+OAglxuICAgIGlmIChDb21wb25lbnRDbGFzcy4kbmFtZSAhPT0gJ0NvbXBvbmVudCcpIHtcbiAgICAgICAgdGhpcy5tb3VudFN0eWxlKENvbXBvbmVudENsYXNzLiRzdXBlckNsYXNzKTtcbiAgICB9XG59O1xuXG4vKipcbiAqIOiOt+WPlue7hOS7tueahGNzc+exu+WQjeOAguinhOWImeaYr+agueaNrue7p+aJv+WFs+ezu++8jOi/m+ihjOexu+WQjeaLvOaOpe+8jOS7juiAjOS9v+WtkOe7hOS7tuexu+eahGNzc+WFt+acieabtOmrmOS8mOWFiOe6p+OAglxuICpcbiAqIEBzdGF0aWNcbiAqIEBwYXJhbSB7Q29uc3RydWN0b3J9IENvbXBvbmVudENsYXNzIOe7hOS7tuexu1xuICogQHJldHVybiB7QXJyYXkuPHN0cmluZz59IOWQiOaIkOexu+WQjeaVsOe7hFxuICovXG5Db21wb25lbnRNYW5hZ2VyLmdldENzc0NsYXNzTmFtZSA9IGZ1bmN0aW9uIChDb21wb25lbnRDbGFzcykge1xuICAgIHZhciBuYW1lID0gW107XG4gICAgZm9yICh2YXIgY3VyQ2xzID0gQ29tcG9uZW50Q2xhc3M7IGN1ckNsczsgY3VyQ2xzID0gY3VyQ2xzLiRzdXBlckNsYXNzKSB7XG4gICAgICAgIG5hbWUucHVzaCh1dGlscy5jYW1lbDJsaW5lKGN1ckNscy4kbmFtZSkpO1xuXG4gICAgICAgIC8vIOacgOWkmuWIsOe7hOS7tuWfuuexu1xuICAgICAgICBpZiAoY3VyQ2xzLiRuYW1lID09PSAnQ29tcG9uZW50Jykge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5hbWU7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gQ29tcG9uZW50TWFuYWdlcjtcblxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92Y29tcG9uZW50L3NyYy9Db21wb25lbnRNYW5hZ2VyLmpzXG4gKiogbW9kdWxlIGlkID0gMjdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDJcbiAqKi8iLCIvKipcbiAqIEBmaWxlIOe7hOS7tueahCA8IS0tIGNoaWxkcmVuIC0tPiDlrp7kvovvvIzorrDlvZXnm7jlhbPkv6Hmga/vvIzmlrnkvr/lkI7nu60gQ2hpbGRyZW5EaXJlY3RpdmVQYXJzZXIg6Kej5p6QXG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20pXG4gKi9cblxudmFyIHV0aWxzID0gcmVxdWlyZSgndnRwbC9zcmMvdXRpbHMnKTtcblxuZnVuY3Rpb24gQ29tcG9uZW50Q2hpbGRyZW4oc3RhcnROb2RlLCBlbmROb2RlLCBzY29wZSwgY29tcG9uZW50KSB7XG4gICAgdGhpcy5kaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBpZiAoIXN0YXJ0Tm9kZSB8fCAhZW5kTm9kZSkge1xuICAgICAgICB0aGlzLmRpdi5pbm5lckhUTUwgPSAnJztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHV0aWxzLnRyYXZlcnNlTm9kZXMoXG4gICAgICAgICAgICBzdGFydE5vZGUsXG4gICAgICAgICAgICBlbmROb2RlLFxuICAgICAgICAgICAgZnVuY3Rpb24gKGN1ck5vZGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRpdi5hcHBlbmRDaGlsZChjdXJOb2RlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0aGlzXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgdGhpcy5zY29wZSA9IHNjb3BlO1xuICAgIHRoaXMuY29tcG9uZW50ID0gY29tcG9uZW50O1xufVxuXG5Db21wb25lbnRDaGlsZHJlbi5wcm90b3R5cGUuZ2V0VHBsSHRtbCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5kaXYuaW5uZXJIVE1MO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb21wb25lbnRDaGlsZHJlbjtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdmNvbXBvbmVudC9zcmMvQ29tcG9uZW50Q2hpbGRyZW4uanNcbiAqKiBtb2R1bGUgaWQgPSAyOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMlxuICoqLyIsInJlcXVpcmUoJy4vc3JjL3BhcnNlcnMvU2NvcGVEaXJlY3RpdmVQYXJzZXInKTtcblxudmFyIGFtZEV4cG9ydHMgPSB7XG4gICAgQ29uZmlnOiByZXF1aXJlKCcuL3NyYy9Db25maWcnKSxcbiAgICBUcmVlOiByZXF1aXJlKCcuL3NyYy90cmVlcy9UcmVlJyksXG4gICAgRGlydHlDaGVja2VyOiByZXF1aXJlKCcuL3NyYy9EaXJ0eUNoZWNrZXInKSxcbiAgICBQYXJzZXI6IHJlcXVpcmUoJy4vc3JjL3BhcnNlcnMvUGFyc2VyJyksXG4gICAgRm9yRGlyZWN0aXZlUGFyc2VyOiByZXF1aXJlKCcuL3NyYy9wYXJzZXJzL0ZvckRpcmVjdGl2ZVBhcnNlcicpLFxuICAgIElmRGlyZWN0aXZlUGFyc2VyOiByZXF1aXJlKCcuL3NyYy9wYXJzZXJzL0lmRGlyZWN0aXZlUGFyc2VyJyksXG4gICAgRXZlbnRFeHByUGFyc2VyOiByZXF1aXJlKCcuL3NyYy9wYXJzZXJzL0V2ZW50RXhwclBhcnNlcicpLFxuICAgIEV4cHJQYXJzZXI6IHJlcXVpcmUoJy4vc3JjL3BhcnNlcnMvRXhwclBhcnNlcicpLFxuICAgIEV4cHJDYWxjdWxhdGVyOiByZXF1aXJlKCcuL3NyYy9FeHByQ2FsY3VsYXRlcicpLFxuICAgIFZhckRpcmVjdGl2ZVBhcnNlcjogcmVxdWlyZSgnLi9zcmMvcGFyc2Vycy9WYXJEaXJlY3RpdmVQYXJzZXInKSxcbiAgICBpbmhlcml0OiByZXF1aXJlKCcuL3NyYy9pbmhlcml0JyksXG4gICAgdXRpbHM6IHJlcXVpcmUoJy4vc3JjL3V0aWxzJyksXG4gICAgRG9tVXBkYXRlcjogcmVxdWlyZSgnLi9zcmMvRG9tVXBkYXRlcicpLFxuICAgIFNjb3BlTW9kZWw6IHJlcXVpcmUoJy4vc3JjL1Njb3BlTW9kZWwnKVxufTtcbmRlZmluZShmdW5jdGlvbiAocmVxdWlyZSwgZXhwb3J0cywgbW9kdWxlKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBhbWRFeHBvcnRzO1xufSk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Z0cGwvbWFpbi5qc1xuICoqIG1vZHVsZSBpZCA9IDI5XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyXG4gKiovIiwiLyoqXG4gKiBAZmlsZSBzY29wZSBkaXJlY3RpdmUgcGFyc2VyXG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20pXG4gKi9cblxudmFyIERpcmVjdGl2ZVBhcnNlciA9IHJlcXVpcmUoJy4vRGlyZWN0aXZlUGFyc2VyJyk7XG52YXIgU2NvcGVNb2RlbCA9IHJlcXVpcmUoJy4uL1Njb3BlTW9kZWwnKTtcbnZhciBUcmVlID0gcmVxdWlyZSgnLi4vdHJlZXMvVHJlZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERpcmVjdGl2ZVBhcnNlci5leHRlbmRzKFxuICAgIHtcbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIERpcmVjdGl2ZVBhcnNlci5wcm90b3R5cGUuaW5pdGlhbGl6ZS5jYWxsKHRoaXMsIG9wdGlvbnMpO1xuXG4gICAgICAgICAgICB0aGlzLnN0YXJ0Tm9kZSA9IG9wdGlvbnMuc3RhcnROb2RlO1xuICAgICAgICAgICAgdGhpcy5lbmROb2RlID0gb3B0aW9ucy5lbmROb2RlO1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMudHJlZS5nZXRUcmVlVmFyKCdzY29wZXMnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMudHJlZS5zZXRUcmVlVmFyKCdzY29wZXMnLCB7fSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0U2NvcGU6IGZ1bmN0aW9uIChzY29wZU1vZGVsKSB7XG4gICAgICAgICAgICB0aGlzLnNjb3BlTW9kZWwuc2V0UGFyZW50KHNjb3BlTW9kZWwpO1xuICAgICAgICAgICAgc2NvcGVNb2RlbC5hZGRDaGlsZCh0aGlzLnNjb3BlTW9kZWwpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNvbGxlY3RFeHByczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHNjb3BlTmFtZSA9IHRoaXMuc3RhcnROb2RlLm5vZGVWYWx1ZVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXHMrL2csICcnKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKHRoaXMuY29uZmlnLnNjb3BlTmFtZSArICc6JywgJycpO1xuICAgICAgICAgICAgaWYgKHNjb3BlTmFtZSkge1xuICAgICAgICAgICAgICAgIHZhciBzY29wZXMgPSB0aGlzLnRyZWUuZ2V0VHJlZVZhcignc2NvcGVzJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5zY29wZU1vZGVsID0gbmV3IFNjb3BlTW9kZWwoKTtcbiAgICAgICAgICAgICAgICBzY29wZXNbc2NvcGVOYW1lXSA9IHNjb3Blc1tzY29wZU5hbWVdIHx8IFtdO1xuICAgICAgICAgICAgICAgIHNjb3Blc1tzY29wZU5hbWVdLnB1c2godGhpcy5zY29wZU1vZGVsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0Tm9kZTogdGhpcy5zdGFydE5vZGUubmV4dFNpYmxpbmcsXG4gICAgICAgICAgICAgICAgICAgIGVuZE5vZGU6IHRoaXMuZW5kTm9kZS5wcmV2aW91c1NpYmxpbmdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICAgIGlzUHJvcGVyTm9kZTogZnVuY3Rpb24gKG5vZGUsIGNvbmZpZykge1xuICAgICAgICAgICAgcmV0dXJuIERpcmVjdGl2ZVBhcnNlci5pc1Byb3Blck5vZGUobm9kZSwgY29uZmlnKVxuICAgICAgICAgICAgICAgICYmIG5vZGUubm9kZVZhbHVlLnJlcGxhY2UoL1xccysvLCAnJykuaW5kZXhPZihjb25maWcuc2NvcGVOYW1lICsgJzonKSA9PT0gMDtcbiAgICAgICAgfSxcblxuICAgICAgICBmaW5kRW5kTm9kZTogZnVuY3Rpb24gKHN0YXJ0Tm9kZSwgY29uZmlnKSB7XG4gICAgICAgICAgICB2YXIgY3VyTm9kZSA9IHN0YXJ0Tm9kZTtcbiAgICAgICAgICAgIHdoaWxlICgoY3VyTm9kZSA9IGN1ck5vZGUubmV4dFNpYmxpbmcpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzRW5kTm9kZShjdXJOb2RlLCBjb25maWcpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjdXJOb2RlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBnZXROb0VuZE5vZGVFcnJvcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcigndGhlIHNjb3BlIGRpcmVjdGl2ZSBpcyBub3QgcHJvcGVybHkgZW5kZWQhJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJG5hbWU6ICdTY29wZURpcmVjdGl2ZVBhcnNlcidcbiAgICB9XG4pO1xuXG5UcmVlLnJlZ2lzdGVQYXJzZXIobW9kdWxlLmV4cG9ydHMpO1xuXG5mdW5jdGlvbiBpc0VuZE5vZGUobm9kZSwgY29uZmlnKSB7XG4gICAgcmV0dXJuIG5vZGUubm9kZVR5cGUgPT09IDhcbiAgICAgICAgJiYgbm9kZS5ub2RlVmFsdWUucmVwbGFjZSgvXFxzKy9nLCAnJykgPT09IGNvbmZpZy5zY29wZUVuZE5hbWU7XG59XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Z0cGwvc3JjL3BhcnNlcnMvU2NvcGVEaXJlY3RpdmVQYXJzZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAzMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMlxuICoqLyIsIi8qKlxuICogQGZpbGUg6YWN572uXG4gKiBAYXV0aG9yIHlpYnV5aXNoZW5nKHlpYnV5aXNoZW5nQDE2My5jb20pXG4gKi9cblxuZnVuY3Rpb24gQ29uZmlnKCkge1xuICAgIHRoaXMuZXhwclByZWZpeCA9ICckeyc7XG4gICAgdGhpcy5leHByU3VmZml4ID0gJ30nO1xuXG4gICAgdGhpcy5pZk5hbWUgPSAnaWYnO1xuICAgIHRoaXMuZWxpZk5hbWUgPSAnZWxpZic7XG4gICAgdGhpcy5lbHNlTmFtZSA9ICdlbHNlJztcbiAgICB0aGlzLmlmRW5kTmFtZSA9ICcvaWYnO1xuXG4gICAgdGhpcy5pZlByZWZpeFJlZ0V4cCA9IC9eXFxzKmlmOlxccyovO1xuICAgIHRoaXMuZWxpZlByZWZpeFJlZ0V4cCA9IC9eXFxzKmVsaWY6XFxzKi87XG4gICAgdGhpcy5lbHNlUHJlZml4UmVnRXhwID0gL15cXHMqZWxzZVxccyovO1xuICAgIHRoaXMuaWZFbmRQcmVmaXhSZWdFeHAgPSAvXlxccypcXC9pZlxccyovO1xuXG4gICAgdGhpcy5mb3JOYW1lID0gJ2Zvcic7XG4gICAgdGhpcy5mb3JFbmROYW1lID0gJy9mb3InO1xuXG4gICAgdGhpcy5mb3JQcmVmaXhSZWdFeHAgPSAvXlxccypmb3I6XFxzKi87XG4gICAgdGhpcy5mb3JFbmRQcmVmaXhSZWdFeHAgPSAvXlxccypcXC9mb3JcXHMqLztcblxuICAgIHRoaXMuZXZlbnRQcmVmaXggPSAnZXZlbnQnO1xuXG4gICAgdGhpcy52YXJOYW1lID0gJ3Zhcic7XG5cbiAgICB0aGlzLnNjb3BlTmFtZSA9ICdzY29wZSc7XG4gICAgdGhpcy5zY29wZUVuZE5hbWUgPSAnL3Njb3BlJztcbn1cblxuQ29uZmlnLnByb3RvdHlwZS5zZXRFeHByUHJlZml4ID0gZnVuY3Rpb24gKHByZWZpeCkge1xuICAgIHRoaXMuZXhwclByZWZpeCA9IHByZWZpeDtcbn07XG5cbkNvbmZpZy5wcm90b3R5cGUuc2V0RXhwclN1ZmZpeCA9IGZ1bmN0aW9uIChzdWZmaXgpIHtcbiAgICB0aGlzLmV4cHJTdWZmaXggPSBzdWZmaXg7XG59O1xuXG5Db25maWcucHJvdG90eXBlLmdldEV4cHJSZWdFeHAgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLmV4cHJSZWdFeHApIHtcbiAgICAgICAgdGhpcy5leHByUmVnRXhwID0gbmV3IFJlZ0V4cChyZWdFeHBFbmNvZGUodGhpcy5leHByUHJlZml4KSArICcoLis/KScgKyByZWdFeHBFbmNvZGUodGhpcy5leHByU3VmZml4KSwgJ2cnKTtcbiAgICB9XG4gICAgdGhpcy5leHByUmVnRXhwLmxhc3RJbmRleCA9IDA7XG4gICAgcmV0dXJuIHRoaXMuZXhwclJlZ0V4cDtcbn07XG5cbkNvbmZpZy5wcm90b3R5cGUuZ2V0QWxsSWZSZWdFeHAgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLmFsbElmUmVnRXhwKSB7XG4gICAgICAgIHRoaXMuYWxsSWZSZWdFeHAgPSBuZXcgUmVnRXhwKCdcXFxccyooJ1xuICAgICAgICAgICAgKyB0aGlzLmlmTmFtZSArICd8J1xuICAgICAgICAgICAgKyB0aGlzLmVsaWZOYW1lICsgJ3wnXG4gICAgICAgICAgICArIHRoaXMuZWxzZU5hbWUgKyAnfCdcbiAgICAgICAgICAgICsgdGhpcy5pZkVuZE5hbWUgKyAnKTpcXFxccyonLCAnZycpO1xuICAgIH1cbiAgICB0aGlzLmFsbElmUmVnRXhwLmxhc3RJbmRleCA9IDA7XG4gICAgcmV0dXJuIHRoaXMuYWxsSWZSZWdFeHA7XG59O1xuXG5Db25maWcucHJvdG90eXBlLnNldElmTmFtZSA9IGZ1bmN0aW9uIChpZk5hbWUpIHtcbiAgICB0aGlzLmlmTmFtZSA9IGlmTmFtZTtcbiAgICB0aGlzLmlmUHJlZml4UmVnRXhwID0gbmV3IFJlZ0V4cCgnXlxcXFxzKicgKyBpZk5hbWUgKyAnOlxcXFxzKicpO1xufTtcblxuQ29uZmlnLnByb3RvdHlwZS5zZXRFbGlmTmFtZSA9IGZ1bmN0aW9uIChlbGlmTmFtZSkge1xuICAgIHRoaXMuZWxpZk5hbWUgPSBlbGlmTmFtZTtcbiAgICB0aGlzLmVsaWZQcmVmaXhSZWdFeHAgPSBuZXcgUmVnRXhwKCdeXFxcXHMqJyArIGVsaWZOYW1lICsgJzpcXFxccyonKTtcbn07XG5cbkNvbmZpZy5wcm90b3R5cGUuc2V0RWxzZU5hbWUgPSBmdW5jdGlvbiAoZWxzZU5hbWUpIHtcbiAgICB0aGlzLmVsc2VOYW1lID0gZWxzZU5hbWU7XG4gICAgdGhpcy5lbHNlUHJlZml4UmVnRXhwID0gbmV3IFJlZ0V4cCgnXlxcXFxzKicgKyBlbHNlTmFtZSArICdcXFxccyonKTtcbn07XG5cbkNvbmZpZy5wcm90b3R5cGUuc2V0SWZFbmROYW1lID0gZnVuY3Rpb24gKGlmRW5kTmFtZSkge1xuICAgIHRoaXMuaWZFbmROYW1lID0gaWZFbmROYW1lO1xuICAgIHRoaXMuaWZFbmRQcmVmaXhSZWdFeHAgPSBuZXcgUmVnRXhwKCdeXFxcXHMqJyArIGlmRW5kTmFtZSArICdcXFxccyonKTtcbn07XG5cbkNvbmZpZy5wcm90b3R5cGUuc2V0Rm9yTmFtZSA9IGZ1bmN0aW9uIChmb3JOYW1lKSB7XG4gICAgdGhpcy5mb3JOYW1lID0gZm9yTmFtZTtcbiAgICB0aGlzLmZvclByZWZpeFJlZ0V4cCA9IG5ldyBSZWdFeHAoJ15cXFxccyonICsgZm9yTmFtZSArICc6XFxcXHMqJyk7XG59O1xuXG5Db25maWcucHJvdG90eXBlLnNldEZvckVuZE5hbWUgPSBmdW5jdGlvbiAoZm9yRW5kTmFtZSkge1xuICAgIHRoaXMuZm9yRW5kTmFtZSA9IGZvckVuZE5hbWU7XG4gICAgdGhpcy5mb3JFbmRQcmVmaXhSZWdFeHAgPSBuZXcgUmVnRXhwKCdeXFxcXHMqJyArIGZvckVuZE5hbWUgKyAnXFxcXHMqJyk7XG59O1xuXG5Db25maWcucHJvdG90eXBlLmdldEZvckV4cHJzUmVnRXhwID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5mb3JFeHByc1JlZ0V4cCkge1xuICAgICAgICB0aGlzLmZvckV4cHJzUmVnRXhwID0gbmV3IFJlZ0V4cCgnXFxcXHMqJ1xuICAgICAgICAgICAgKyB0aGlzLmZvck5hbWVcbiAgICAgICAgICAgICsgJzpcXFxccyonXG4gICAgICAgICAgICArIHJlZ0V4cEVuY29kZSh0aGlzLmV4cHJQcmVmaXgpXG4gICAgICAgICAgICArICcoW14nICsgcmVnRXhwRW5jb2RlKHRoaXMuZXhwclN1ZmZpeClcbiAgICAgICAgICAgICsgJ10rKScgKyByZWdFeHBFbmNvZGUodGhpcy5leHByU3VmZml4KSk7XG4gICAgfVxuICAgIHRoaXMuZm9yRXhwcnNSZWdFeHAubGFzdEluZGV4ID0gMDtcbiAgICByZXR1cm4gdGhpcy5mb3JFeHByc1JlZ0V4cDtcbn07XG5cbkNvbmZpZy5wcm90b3R5cGUuZ2V0Rm9ySXRlbVZhbHVlTmFtZVJlZ0V4cCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuZm9ySXRlbVZhbHVlTmFtZVJlZ0V4cCkge1xuICAgICAgICB0aGlzLmZvckl0ZW1WYWx1ZU5hbWVSZWdFeHAgPSBuZXcgUmVnRXhwKFxuICAgICAgICAgICAgJ2FzXFxcXHMqJyArIHJlZ0V4cEVuY29kZSh0aGlzLmV4cHJQcmVmaXgpXG4gICAgICAgICAgICArICcoW14nICsgcmVnRXhwRW5jb2RlKHRoaXMuZXhwclN1ZmZpeCkgKyAnXSspJ1xuICAgICAgICAgICAgKyByZWdFeHBFbmNvZGUodGhpcy5leHByU3VmZml4KVxuICAgICAgICApO1xuICAgIH1cbiAgICB0aGlzLmZvckl0ZW1WYWx1ZU5hbWVSZWdFeHAubGFzdEluZGV4ID0gMDtcbiAgICByZXR1cm4gdGhpcy5mb3JJdGVtVmFsdWVOYW1lUmVnRXhwO1xufTtcblxuQ29uZmlnLnByb3RvdHlwZS5zZXRFdmVudFByZWZpeCA9IGZ1bmN0aW9uIChwcmVmaXgpIHtcbiAgICB0aGlzLmV2ZW50UHJlZml4ID0gcHJlZml4O1xufTtcblxuQ29uZmlnLnByb3RvdHlwZS5zZXRWYXJOYW1lID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aGlzLnZhck5hbWUgPSBuYW1lO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb25maWc7XG5cbmZ1bmN0aW9uIHJlZ0V4cEVuY29kZShzdHIpIHtcbiAgICByZXR1cm4gJ1xcXFwnICsgc3RyLnNwbGl0KCcnKS5qb2luKCdcXFxcJyk7XG59XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4uL3Z0cGwvc3JjL0NvbmZpZy5qc1xuICoqIG1vZHVsZSBpZCA9IDMxXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyXG4gKiovIiwiLyoqXG4gKiBAZmlsZSDohI/mo4DmtYvlmahcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG5mdW5jdGlvbiBEaXJ0eUNoZWNrZXIoKSB7XG4gICAgdGhpcy5jaGVja2VycyA9IHt9O1xufVxuXG5EaXJ0eUNoZWNrZXIucHJvdG90eXBlLnNldENoZWNrZXIgPSBmdW5jdGlvbiAoZXhwciwgY2hlY2tlckZuKSB7XG4gICAgdGhpcy5jaGVja2Vyc1tleHByXSA9IGNoZWNrZXJGbjtcbn07XG5cbkRpcnR5Q2hlY2tlci5wcm90b3R5cGUuZ2V0Q2hlY2tlciA9IGZ1bmN0aW9uIChleHByKSB7XG4gICAgcmV0dXJuIHRoaXMuY2hlY2tlcnNbZXhwcl07XG59O1xuXG5EaXJ0eUNoZWNrZXIucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5jaGVja2VycyA9IG51bGw7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERpcnR5Q2hlY2tlcjtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdnRwbC9zcmMvRGlydHlDaGVja2VyLmpzXG4gKiogbW9kdWxlIGlkID0gMzJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDJcbiAqKi8iLCIvKipcbiAqIEBmaWxlIOWPmOmHj+WumuS5ieaMh+S7pOino+aekOWZqFxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tKVxuICovXG5cbnZhciBEaXJlY3RpdmVQYXJzZXIgPSByZXF1aXJlKCcuL0RpcmVjdGl2ZVBhcnNlcicpO1xudmFyIFRyZWUgPSByZXF1aXJlKCcuLi90cmVlcy9UcmVlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGlyZWN0aXZlUGFyc2VyLmV4dGVuZHMoXG4gICAge1xuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgRGlyZWN0aXZlUGFyc2VyLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgICAgIHRoaXMubm9kZSA9IG9wdGlvbnMubm9kZTtcbiAgICAgICAgfSxcblxuICAgICAgICBjb2xsZWN0RXhwcnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBleHByID0gdGhpcy5ub2RlLm5vZGVWYWx1ZS5yZXBsYWNlKHRoaXMuY29uZmlnLnZhck5hbWUgKyAnOicsICcnKTtcbiAgICAgICAgICAgIHRoaXMuZXhwckNhbGN1bGF0ZXIuY3JlYXRlRXhwckZuKGV4cHIpO1xuXG4gICAgICAgICAgICB2YXIgbGVmdFZhbHVlTmFtZSA9IGV4cHIubWF0Y2goL1xccyouKyg/PVxcPSkvKVswXS5yZXBsYWNlKC9cXHMrL2csICcnKTtcblxuICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMuZXhwckZuID0gZnVuY3Rpb24gKHNjb3BlTW9kZWwpIHtcbiAgICAgICAgICAgICAgICB2YXIgb2xkVmFsdWUgPSBzY29wZU1vZGVsLmdldChsZWZ0VmFsdWVOYW1lKTtcbiAgICAgICAgICAgICAgICB2YXIgbmV3VmFsdWUgPSBtZS5leHByQ2FsY3VsYXRlci5jYWxjdWxhdGUoZXhwciwgZmFsc2UsIHNjb3BlTW9kZWwpO1xuICAgICAgICAgICAgICAgIGlmIChvbGRWYWx1ZSAhPT0gbmV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcGVNb2RlbC5zZXQobGVmdFZhbHVlTmFtZSwgbmV3VmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0U2NvcGU6IGZ1bmN0aW9uIChzY29wZU1vZGVsKSB7XG4gICAgICAgICAgICBEaXJlY3RpdmVQYXJzZXIucHJvdG90eXBlLnNldFNjb3BlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB0aGlzLmV4cHJGbih0aGlzLnNjb3BlTW9kZWwpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5blvIDlp4voioLngrlcbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKiBAaW5oZXJpdERvY1xuICAgICAgICAgKiBAcmV0dXJuIHtOb2RlfVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0U3RhcnROb2RlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ub2RlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDojrflj5bnu5PmnZ/oioLngrlcbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKiBAaW5oZXJpdERvY1xuICAgICAgICAgKiBAcmV0dXJuIHtOb2RlfVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0RW5kTm9kZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubm9kZTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgICBpc1Byb3Blck5vZGU6IGZ1bmN0aW9uIChub2RlLCBjb25maWcpIHtcbiAgICAgICAgICAgIHJldHVybiBub2RlLm5vZGVUeXBlID09PSA4XG4gICAgICAgICAgICAgICAgJiYgbm9kZS5ub2RlVmFsdWUucmVwbGFjZSgvXlxccysvLCAnJykuaW5kZXhPZihjb25maWcudmFyTmFtZSArICc6JykgPT09IDA7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJG5hbWU6ICdWYXJEaXJlY3RpdmVQYXJzZXInXG4gICAgfVxuKTtcblxuVHJlZS5yZWdpc3RlUGFyc2VyKG1vZHVsZS5leHBvcnRzKTtcblxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuLi92dHBsL3NyYy9wYXJzZXJzL1ZhckRpcmVjdGl2ZVBhcnNlci5qc1xuICoqIG1vZHVsZSBpZCA9IDMzXG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyXG4gKiovIiwiLyoqXG4gKiBAZmlsZSDnu4Tku7bln7rnsbtcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSlcbiAqL1xuXG52YXIgQmFzZSA9IHJlcXVpcmUoJ3Z0cGwvc3JjL0Jhc2UnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYXNlLmV4dGVuZHMoXG4gICAge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDnu4Tku7bliJ3lp4vljJZcbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKi9cbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge30sXG5cbiAgICAgICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uICgpIHt9LFxuXG4gICAgICAgIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24gKCkge30sXG5cbiAgICAgICAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uICgpIHt9LFxuXG4gICAgICAgIHJlZjogZnVuY3Rpb24gKHJlZikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VyLnJlZihyZWYpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDnu4Tku7bmqKHmnb/jgILlrZDnsbvlj6/ku6Xopobnm5bov5nkuKrlsZ7mgKfjgIJcbiAgICAgICAgICpcbiAgICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgdHBsOiAnJyxcblxuICAgICAgICAvKipcbiAgICAgICAgICog6ZSA5q+BXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwdWJsaWNcbiAgICAgICAgICovXG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuYmVmb3JlRGVzdHJveSgpO1xuXG4gICAgICAgICAgICB0aGlzLmFmdGVyRGVzdHJveSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldERhdGE6IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5wYXJzZXIuc2V0QXR0cihuYW1lLCB2YWx1ZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0RGF0YTogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlci5nZXRBdHRyKG5hbWUpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOiOt+WPluagt+W8j+Wtl+espuS4suOAglxuICAgICAgICAgKlxuICAgICAgICAgKiBAc3RhdGljXG4gICAgICAgICAqIEByZXR1cm4ge3N0cmluZ30g5qC35byP5a2X56ym5LiyXG4gICAgICAgICAqL1xuICAgICAgICBnZXRTdHlsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9LFxuXG4gICAgICAgICRuYW1lOiAnQ29tcG9uZW50J1xuICAgIH1cbik7XG5cblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi4vdmNvbXBvbmVudC9zcmMvQ29tcG9uZW50LmpzXG4gKiogbW9kdWxlIGlkID0gMzRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDJcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IFwiPGJ1dHRvbiBjbGFzcz1cXFwiJHtjbGFzc31cXFwiIGV2ZW50LWNsaWNrPVxcXCIke29uQ2xpY2soZXZlbnQpfVxcXCI+XFxuICAgIDwhLS0gY2hpbGRyZW4gLS0+XFxuPC9idXR0b24+XCI7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9CdXR0b24vQnV0dG9uLnRwbC5odG1sXG4gKiogbW9kdWxlIGlkID0gMzVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMCAxIDJcbiAqKi8iLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikoKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIi5idXR0b24sXFxuLmJ1dHRvbjphY3RpdmUge1xcbiAgYmFja2dyb3VuZDogI2Y2ZjZmNjtcXG4gIGhlaWdodDogMzBweDtcXG4gIG91dGxpbmU6IG5vbmU7XFxuICBib3JkZXI6IG5vbmU7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcbi5idXR0b246aG92ZXIge1xcbiAgb3BhY2l0eTogLjg7XFxufVxcbi5idXR0b246YWN0aXZlIHtcXG4gIG9wYWNpdHk6IDE7XFxufVxcbi5idXR0b24uc2tpbi1wcmltYXJ5IHtcXG4gIGJhY2tncm91bmQ6ICM3MGNjYzA7XFxuICBjb2xvcjogI2ZmZjtcXG59XFxuLmJ1dHRvbi5za2luLXN1Y2Nlc3Mge1xcbiAgYmFja2dyb3VuZDogIzgwZGRhMTtcXG4gIGNvbG9yOiAjZmZmO1xcbn1cXG4uYnV0dG9uLnNraW4taW5mbyB7XFxuICBiYWNrZ3JvdW5kOiAjNmJkNWVjO1xcbiAgY29sb3I6ICNmZmY7XFxufVxcbi5idXR0b24uc2tpbi13YXJuaW5nIHtcXG4gIGJhY2tncm91bmQ6ICNmOWFkNDI7XFxuICBjb2xvcjogI2ZmZjtcXG59XFxuLmJ1dHRvbi5za2luLWRhbmdlciB7XFxuICBiYWNrZ3JvdW5kOiAjZjE2YzZjO1xcbiAgY29sb3I6ICNmZmY7XFxufVxcbi5idXR0b24uc2tpbi1saW5rIHtcXG4gIGNvbG9yOiAjNzBjY2MwO1xcbiAgYmFja2dyb3VuZDogbm9uZTtcXG59XFxuXCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9CdXR0b24vQnV0dG9uLmxlc3NcbiAqKiBtb2R1bGUgaWQgPSAzNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwIDEgMlxuICoqLyIsIi8qXHJcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcclxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXHJcbiovXHJcbi8vIGNzcyBiYXNlIGNvZGUsIGluamVjdGVkIGJ5IHRoZSBjc3MtbG9hZGVyXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIGxpc3QgPSBbXTtcclxuXHJcblx0Ly8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xyXG5cdGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcclxuXHRcdHZhciByZXN1bHQgPSBbXTtcclxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBpdGVtID0gdGhpc1tpXTtcclxuXHRcdFx0aWYoaXRlbVsyXSkge1xyXG5cdFx0XHRcdHJlc3VsdC5wdXNoKFwiQG1lZGlhIFwiICsgaXRlbVsyXSArIFwie1wiICsgaXRlbVsxXSArIFwifVwiKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXN1bHQucHVzaChpdGVtWzFdKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc3VsdC5qb2luKFwiXCIpO1xyXG5cdH07XHJcblxyXG5cdC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XHJcblx0bGlzdC5pID0gZnVuY3Rpb24obW9kdWxlcywgbWVkaWFRdWVyeSkge1xyXG5cdFx0aWYodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpXHJcblx0XHRcdG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIFwiXCJdXTtcclxuXHRcdHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XHJcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgaWQgPSB0aGlzW2ldWzBdO1xyXG5cdFx0XHRpZih0eXBlb2YgaWQgPT09IFwibnVtYmVyXCIpXHJcblx0XHRcdFx0YWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0Zm9yKGkgPSAwOyBpIDwgbW9kdWxlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgaXRlbSA9IG1vZHVsZXNbaV07XHJcblx0XHRcdC8vIHNraXAgYWxyZWFkeSBpbXBvcnRlZCBtb2R1bGVcclxuXHRcdFx0Ly8gdGhpcyBpbXBsZW1lbnRhdGlvbiBpcyBub3QgMTAwJSBwZXJmZWN0IGZvciB3ZWlyZCBtZWRpYSBxdWVyeSBjb21iaW5hdGlvbnNcclxuXHRcdFx0Ly8gIHdoZW4gYSBtb2R1bGUgaXMgaW1wb3J0ZWQgbXVsdGlwbGUgdGltZXMgd2l0aCBkaWZmZXJlbnQgbWVkaWEgcXVlcmllcy5cclxuXHRcdFx0Ly8gIEkgaG9wZSB0aGlzIHdpbGwgbmV2ZXIgb2NjdXIgKEhleSB0aGlzIHdheSB3ZSBoYXZlIHNtYWxsZXIgYnVuZGxlcylcclxuXHRcdFx0aWYodHlwZW9mIGl0ZW1bMF0gIT09IFwibnVtYmVyXCIgfHwgIWFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcclxuXHRcdFx0XHRpZihtZWRpYVF1ZXJ5ICYmICFpdGVtWzJdKSB7XHJcblx0XHRcdFx0XHRpdGVtWzJdID0gbWVkaWFRdWVyeTtcclxuXHRcdFx0XHR9IGVsc2UgaWYobWVkaWFRdWVyeSkge1xyXG5cdFx0XHRcdFx0aXRlbVsyXSA9IFwiKFwiICsgaXRlbVsyXSArIFwiKSBhbmQgKFwiICsgbWVkaWFRdWVyeSArIFwiKVwiO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRsaXN0LnB1c2goaXRlbSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9O1xyXG5cdHJldHVybiBsaXN0O1xyXG59O1xyXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vfi9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1xuICoqIG1vZHVsZSBpZCA9IDM3XG4gKiogbW9kdWxlIGNodW5rcyA9IDAgMSAyXG4gKiovIiwiLyoqXG4gKiBAZmlsZSDkuIvmi4nlkb3ku6Toj5zljZVcbiAqIEBhdXRob3IgeWlidXlpc2hlbmcoeWlidXlpc2hlbmdAMTYzLmNvbSwgaHR0cHM6Ly9naXRodWIuY29tL3lpYnV5aXNoZW5nKVxuICovXG5cbnZhciBDb250cm9sID0gcmVxdWlyZSgnLi4vQ29udHJvbCcpO1xudmFyIEJ1dHRvbiA9IHJlcXVpcmUoJy4uL0J1dHRvbi9CdXR0b24nKTtcbnZhciBMYXllciA9IHJlcXVpcmUoJy4uL0xheWVyL0xheWVyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ29udHJvbC5leHRlbmRzKFxuICAgIHtcbiAgICAgICAgdHBsOiByZXF1aXJlKCcuL0NvbW1hbmRNZW51LnRwbC5odG1sJyksXG4gICAgICAgIGNvbXBvbmVudENsYXNzZXM6IFtCdXR0b24sIExheWVyXSxcblxuICAgICAgICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcbiAgICAgICAgICAgIHZhciBsYXllciA9IG1lLnJlZignbGF5ZXInKTtcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgICAgICAgdG9nZ2xlTGF5ZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxheWVyLmlzU2hvdygpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXllci5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXllci5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG9uT3V0Q2xpY2s6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgICAgICBsYXllci5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBvbkl0ZW1DbGljazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBsYXllci5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvbkl0ZW1TZWxlY3RlZCA9IG1lLmdldERhdGEoJ29uSXRlbVNlbGVjdGVkJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvbkl0ZW1TZWxlY3RlZCBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkl0ZW1TZWxlY3RlZC5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgJG5hbWU6ICdDb21tYW5kTWVudScsXG4gICAgICAgIGdldFN0eWxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVxdWlyZSgnLi9Db21tYW5kTWVudS5sZXNzJylbMF1bMV07XG4gICAgICAgIH1cbiAgICB9XG4pO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9Db21tYW5kTWVudS9Db21tYW5kTWVudS5qc1xuICoqIG1vZHVsZSBpZCA9IDM5XG4gKiogbW9kdWxlIGNodW5rcyA9IDFcbiAqKi8iLCIvKipcbiAqIEBmaWxlIOW8ueWxglxuICogQGF1dGhvciB5aWJ1eWlzaGVuZyh5aWJ1eWlzaGVuZ0AxNjMuY29tLCBodHRwczovL2dpdGh1Yi5jb20veWlidXlpc2hlbmcpXG4gKi9cblxudmFyIENvbnRyb2wgPSByZXF1aXJlKCcuLi9Db250cm9sJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ29udHJvbC5leHRlbmRzKFxuICAgIHtcbiAgICAgICAgdHBsOiByZXF1aXJlKCcuL0xheWVyLnRwbC5odG1sJyksXG5cbiAgICAgICAgc2hvdzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGNsYXNzTGlzdCA9IHRoaXMuZ2V0RGF0YSgnY2xhc3MnLCBbXSk7XG4gICAgICAgICAgICBjbGFzc0xpc3QucHVzaCgnc2hvdycpO1xuICAgICAgICAgICAgdGhpcy5zZXREYXRhKCdjbGFzcycsIGNsYXNzTGlzdCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaGlkZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5zZXREYXRhKFxuICAgICAgICAgICAgICAgICdjbGFzcycsXG4gICAgICAgICAgICAgICAgdGhpcy5nZXREYXRhKCdjbGFzcycsIFtdKS5maWx0ZXIoZnVuY3Rpb24gKGtsYXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBrbGFzcyAhPT0gJ3Nob3cnO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzU2hvdzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGNsYXNzTGlzdCA9IHRoaXMuZ2V0RGF0YSgnY2xhc3MnLCBbXSk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaWwgPSBjbGFzc0xpc3QubGVuZ3RoOyBpIDwgaWw7ICsraSkge1xuICAgICAgICAgICAgICAgIGlmIChjbGFzc0xpc3RbaV0gPT09ICdzaG93Jykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgJG5hbWU6ICdMYXllcicsXG4gICAgICAgIGdldFN0eWxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVxdWlyZSgnLi9MYXllci5sZXNzJylbMF1bMV07XG4gICAgICAgIH1cbiAgICB9XG4pO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9MYXllci9MYXllci5qc1xuICoqIG1vZHVsZSBpZCA9IDQwXG4gKiogbW9kdWxlIGNodW5rcyA9IDFcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IFwiPGRpdiBvbmNsaWNrPVxcXCIke29uQ2xpY2soZXZlbnQpfVxcXCI+PCEtLSBjaGlsZHJlbiAtLT48L2Rpdj5cXG5cIjtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL0xheWVyL0xheWVyLnRwbC5odG1sXG4gKiogbW9kdWxlIGlkID0gNDFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMVxuICoqLyIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSgpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLmxheWVyIHtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIGRpc3BsYXk6IG5vbmU7XFxufVxcbi5sYXllci5zaG93IHtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbn1cXG5cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL0xheWVyL0xheWVyLmxlc3NcbiAqKiBtb2R1bGUgaWQgPSA0MlxuICoqIG1vZHVsZSBjaHVua3MgPSAxXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxkaXYgZXZlbnQtb3V0Y2xpY2s9XFxcIiR7b25PdXRDbGljayhldmVudCl9XFxcIj5cXG4gICAgPHVpLWJ1dHRvbiBjbGFzcz1cXFwic2tpbi1wcmltYXJ5XFxcIlxcbiAgICAgICAgb24tY2xpY2s9XFxcIiR7dG9nZ2xlTGF5ZXJ9XFxcIj5cXG4gICAgICAgICR7dGl0bGV9XFxuICAgICAgICA8c3BhbiBjbGFzcz1cXFwidHJpYW5nbGUtZG93blxcXCI+PC9zcGFuPlxcbiAgICA8L3VpLWJ1dHRvbj5cXG4gICAgPHVpLWxheWVyIHJlZj1cXFwibGF5ZXJcXFwiIG9uLW91dC1jbGljaz1cXFwiJHtvdXRDbGlja31cXFwiPlxcbiAgICAgICAgPCEtLSBmb3I6ICR7aXRlbXN9IGFzICR7aXRlbX0gLS0+XFxuICAgICAgICAgICAgPHAgb25jbGljaz1cXFwiJHtvbkl0ZW1DbGljayhldmVudCwgaXRlbSl9XFxcIj4ke2l0ZW0ubGFiZWx9PC9wPlxcbiAgICAgICAgPCEtLSAvZm9yIC0tPlxcbiAgICA8L3VpLWxheWVyPlxcbjwvZGl2PlxcblwiO1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvQ29tbWFuZE1lbnUvQ29tbWFuZE1lbnUudHBsLmh0bWxcbiAqKiBtb2R1bGUgaWQgPSA0M1xuICoqIG1vZHVsZSBjaHVua3MgPSAxXG4gKiovIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIuY29tbWFuZC1tZW51IHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG59XFxuLmNvbW1hbmQtbWVudSAudHJpYW5nbGUtZG93biB7XFxuICBib3JkZXI6IDAgc29saWQgdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItdG9wLXdpZHRoOiA2cHg7XFxuICBib3JkZXItbGVmdC13aWR0aDogNXB4O1xcbiAgYm9yZGVyLXJpZ2h0LXdpZHRoOiA1cHg7XFxuICBib3JkZXItdG9wLWNvbG9yOiAjZmZmO1xcbiAgd2lkdGg6IDA7XFxuICBoZWlnaHQ6IDA7XFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICB0b3A6IC0xcHg7XFxufVxcbi5jb21tYW5kLW1lbnUgLmxheWVyIHtcXG4gIGJhY2tncm91bmQ6ICNlYmViZWI7XFxufVxcbi5jb21tYW5kLW1lbnUgLmxheWVyIHAge1xcbiAgd2lkdGg6IDEwMHB4O1xcbiAgcGFkZGluZzogNXB4O1xcbiAgbGluZS1oZWlnaHQ6IDEuNTtcXG4gIG1hcmdpbjogMDtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuLmNvbW1hbmQtbWVudSAubGF5ZXIgcDpob3ZlciB7XFxuICBiYWNrZ3JvdW5kOiAjZmVmOGU5O1xcbn1cXG5cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL0NvbW1hbmRNZW51L0NvbW1hbmRNZW51Lmxlc3NcbiAqKiBtb2R1bGUgaWQgPSA0NFxuICoqIG1vZHVsZSBjaHVua3MgPSAxXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBcIjwhLS0gdmFyOiBpdGVtcyA9IFt7bGFiZWw6ICflvKDkuIknfSwge2xhYmVsOiAn5p2O5ZubJ30sIHtsYWJlbDogJ+eOi+S6lCd9XSAtLT5cXG48dWktY29tbWFuZC1tZW51IHRpdGxlPVxcXCIke3RpdGxlfVxcXCIgaXRlbXM9XFxcIiR7aXRlbXN9XFxcIiBvbi1pdGVtLXNlbGVjdGVkPVxcXCIke29uSXRlbVNlbGVjdGVkfVxcXCI+PC91aS1jb21tYW5kLW1lbnU+XFxuXCI7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3Rlc3QvQ29tbWFuZE1lbnUudHBsLmh0bWxcbiAqKiBtb2R1bGUgaWQgPSA0NVxuICoqIG1vZHVsZSBjaHVua3MgPSAxXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==