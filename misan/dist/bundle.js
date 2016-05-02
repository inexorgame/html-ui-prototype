webpackJsonp([0,1],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';
	
	__webpack_require__(15);
	
	__webpack_require__(16);
	
	__webpack_require__(17);
	
	riot.mount('*');
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Riot v2.3.18, @license MIT */
	
	;(function(window, undefined) {
	  'use strict';
	var riot = { version: 'v2.3.18', settings: {} },
	  // be aware, internal usage
	  // ATTENTION: prefix the global dynamic variables with `__`
	
	  // counter to give a unique id to all the Tag instances
	  __uid = 0,
	  // tags instances cache
	  __virtualDom = [],
	  // tags implementation cache
	  __tagImpl = {},
	
	  /**
	   * Const
	   */
	  GLOBAL_MIXIN = '__global_mixin',
	
	  // riot specific prefixes
	  RIOT_PREFIX = 'riot-',
	  RIOT_TAG = RIOT_PREFIX + 'tag',
	  RIOT_TAG_IS = 'data-is',
	
	  // for typeof == '' comparisons
	  T_STRING = 'string',
	  T_OBJECT = 'object',
	  T_UNDEF  = 'undefined',
	  T_FUNCTION = 'function',
	  // special native tags that cannot be treated like the others
	  SPECIAL_TAGS_REGEX = /^(?:t(?:body|head|foot|[rhd])|caption|col(?:group)?|opt(?:ion|group))$/,
	  RESERVED_WORDS_BLACKLIST = ['_item', '_id', '_parent', 'update', 'root', 'mount', 'unmount', 'mixin', 'isMounted', 'isLoop', 'tags', 'parent', 'opts', 'trigger', 'on', 'off', 'one'],
	
	  // version# for IE 8-11, 0 for others
	  IE_VERSION = (window && window.document || {}).documentMode | 0,
	
	  // detect firefox to fix #1374
	  FIREFOX = window && !!window.InstallTrigger
	/* istanbul ignore next */
	riot.observable = function(el) {
	
	  /**
	   * Extend the original object or create a new empty one
	   * @type { Object }
	   */
	
	  el = el || {}
	
	  /**
	   * Private variables and methods
	   */
	  var callbacks = {},
	    slice = Array.prototype.slice,
	    onEachEvent = function(e, fn) { e.replace(/\S+/g, fn) }
	
	  // extend the object adding the observable methods
	  Object.defineProperties(el, {
	    /**
	     * Listen to the given space separated list of `events` and execute the `callback` each time an event is triggered.
	     * @param  { String } events - events ids
	     * @param  { Function } fn - callback function
	     * @returns { Object } el
	     */
	    on: {
	      value: function(events, fn) {
	        if (typeof fn != 'function')  return el
	
	        onEachEvent(events, function(name, pos) {
	          (callbacks[name] = callbacks[name] || []).push(fn)
	          fn.typed = pos > 0
	        })
	
	        return el
	      },
	      enumerable: false,
	      writable: false,
	      configurable: false
	    },
	
	    /**
	     * Removes the given space separated list of `events` listeners
	     * @param   { String } events - events ids
	     * @param   { Function } fn - callback function
	     * @returns { Object } el
	     */
	    off: {
	      value: function(events, fn) {
	        if (events == '*' && !fn) callbacks = {}
	        else {
	          onEachEvent(events, function(name) {
	            if (fn) {
	              var arr = callbacks[name]
	              for (var i = 0, cb; cb = arr && arr[i]; ++i) {
	                if (cb == fn) arr.splice(i--, 1)
	              }
	            } else delete callbacks[name]
	          })
	        }
	        return el
	      },
	      enumerable: false,
	      writable: false,
	      configurable: false
	    },
	
	    /**
	     * Listen to the given space separated list of `events` and execute the `callback` at most once
	     * @param   { String } events - events ids
	     * @param   { Function } fn - callback function
	     * @returns { Object } el
	     */
	    one: {
	      value: function(events, fn) {
	        function on() {
	          el.off(events, on)
	          fn.apply(el, arguments)
	        }
	        return el.on(events, on)
	      },
	      enumerable: false,
	      writable: false,
	      configurable: false
	    },
	
	    /**
	     * Execute all callback functions that listen to the given space separated list of `events`
	     * @param   { String } events - events ids
	     * @returns { Object } el
	     */
	    trigger: {
	      value: function(events) {
	
	        // getting the arguments
	        var arglen = arguments.length - 1,
	          args = new Array(arglen),
	          fns
	
	        for (var i = 0; i < arglen; i++) {
	          args[i] = arguments[i + 1] // skip first argument
	        }
	
	        onEachEvent(events, function(name) {
	
	          fns = slice.call(callbacks[name] || [], 0)
	
	          for (var i = 0, fn; fn = fns[i]; ++i) {
	            if (fn.busy) return
	            fn.busy = 1
	            fn.apply(el, fn.typed ? [name].concat(args) : args)
	            if (fns[i] !== fn) { i-- }
	            fn.busy = 0
	          }
	
	          if (callbacks['*'] && name != '*')
	            el.trigger.apply(el, ['*', name].concat(args))
	
	        })
	
	        return el
	      },
	      enumerable: false,
	      writable: false,
	      configurable: false
	    }
	  })
	
	  return el
	
	}
	/* istanbul ignore next */
	;(function(riot) {
	
	/**
	 * Simple client-side router
	 * @module riot-route
	 */
	
	
	var RE_ORIGIN = /^.+?\/\/+[^\/]+/,
	  EVENT_LISTENER = 'EventListener',
	  REMOVE_EVENT_LISTENER = 'remove' + EVENT_LISTENER,
	  ADD_EVENT_LISTENER = 'add' + EVENT_LISTENER,
	  HAS_ATTRIBUTE = 'hasAttribute',
	  REPLACE = 'replace',
	  POPSTATE = 'popstate',
	  HASHCHANGE = 'hashchange',
	  TRIGGER = 'trigger',
	  MAX_EMIT_STACK_LEVEL = 3,
	  win = typeof window != 'undefined' && window,
	  doc = typeof document != 'undefined' && document,
	  hist = win && history,
	  loc = win && (hist.location || win.location), // see html5-history-api
	  prot = Router.prototype, // to minify more
	  clickEvent = doc && doc.ontouchstart ? 'touchstart' : 'click',
	  started = false,
	  central = riot.observable(),
	  routeFound = false,
	  debouncedEmit,
	  base, current, parser, secondParser, emitStack = [], emitStackLevel = 0
	
	/**
	 * Default parser. You can replace it via router.parser method.
	 * @param {string} path - current path (normalized)
	 * @returns {array} array
	 */
	function DEFAULT_PARSER(path) {
	  return path.split(/[/?#]/)
	}
	
	/**
	 * Default parser (second). You can replace it via router.parser method.
	 * @param {string} path - current path (normalized)
	 * @param {string} filter - filter string (normalized)
	 * @returns {array} array
	 */
	function DEFAULT_SECOND_PARSER(path, filter) {
	  var re = new RegExp('^' + filter[REPLACE](/\*/g, '([^/?#]+?)')[REPLACE](/\.\./, '.*') + '$'),
	    args = path.match(re)
	
	  if (args) return args.slice(1)
	}
	
	/**
	 * Simple/cheap debounce implementation
	 * @param   {function} fn - callback
	 * @param   {number} delay - delay in seconds
	 * @returns {function} debounced function
	 */
	function debounce(fn, delay) {
	  var t
	  return function () {
	    clearTimeout(t)
	    t = setTimeout(fn, delay)
	  }
	}
	
	/**
	 * Set the window listeners to trigger the routes
	 * @param {boolean} autoExec - see route.start
	 */
	function start(autoExec) {
	  debouncedEmit = debounce(emit, 1)
	  win[ADD_EVENT_LISTENER](POPSTATE, debouncedEmit)
	  win[ADD_EVENT_LISTENER](HASHCHANGE, debouncedEmit)
	  doc[ADD_EVENT_LISTENER](clickEvent, click)
	  if (autoExec) emit(true)
	}
	
	/**
	 * Router class
	 */
	function Router() {
	  this.$ = []
	  riot.observable(this) // make it observable
	  central.on('stop', this.s.bind(this))
	  central.on('emit', this.e.bind(this))
	}
	
	function normalize(path) {
	  return path[REPLACE](/^\/|\/$/, '')
	}
	
	function isString(str) {
	  return typeof str == 'string'
	}
	
	/**
	 * Get the part after domain name
	 * @param {string} href - fullpath
	 * @returns {string} path from root
	 */
	function getPathFromRoot(href) {
	  return (href || loc.href)[REPLACE](RE_ORIGIN, '')
	}
	
	/**
	 * Get the part after base
	 * @param {string} href - fullpath
	 * @returns {string} path from base
	 */
	function getPathFromBase(href) {
	  return base[0] == '#'
	    ? (href || loc.href || '').split(base)[1] || ''
	    : (loc ? getPathFromRoot(href) : href || '')[REPLACE](base, '')
	}
	
	function emit(force) {
	  // the stack is needed for redirections
	  var isRoot = emitStackLevel == 0
	  if (MAX_EMIT_STACK_LEVEL <= emitStackLevel) return
	
	  emitStackLevel++
	  emitStack.push(function() {
	    var path = getPathFromBase()
	    if (force || path != current) {
	      central[TRIGGER]('emit', path)
	      current = path
	    }
	  })
	  if (isRoot) {
	    while (emitStack.length) {
	      emitStack[0]()
	      emitStack.shift()
	    }
	    emitStackLevel = 0
	  }
	}
	
	function click(e) {
	  if (
	    e.which != 1 // not left click
	    || e.metaKey || e.ctrlKey || e.shiftKey // or meta keys
	    || e.defaultPrevented // or default prevented
	  ) return
	
	  var el = e.target
	  while (el && el.nodeName != 'A') el = el.parentNode
	
	  if (
	    !el || el.nodeName != 'A' // not A tag
	    || el[HAS_ATTRIBUTE]('download') // has download attr
	    || !el[HAS_ATTRIBUTE]('href') // has no href attr
	    || el.target && el.target != '_self' // another window or frame
	    || el.href.indexOf(loc.href.match(RE_ORIGIN)[0]) == -1 // cross origin
	  ) return
	
	  if (el.href != loc.href) {
	    if (
	      el.href.split('#')[0] == loc.href.split('#')[0] // internal jump
	      || base != '#' && getPathFromRoot(el.href).indexOf(base) !== 0 // outside of base
	      || !go(getPathFromBase(el.href), el.title || doc.title) // route not found
	    ) return
	  }
	
	  e.preventDefault()
	}
	
	/**
	 * Go to the path
	 * @param {string} path - destination path
	 * @param {string} title - page title
	 * @param {boolean} shouldReplace - use replaceState or pushState
	 * @returns {boolean} - route not found flag
	 */
	function go(path, title, shouldReplace) {
	  if (hist) { // if a browser
	    path = base + normalize(path)
	    title = title || doc.title
	    // browsers ignores the second parameter `title`
	    shouldReplace
	      ? hist.replaceState(null, title, path)
	      : hist.pushState(null, title, path)
	    // so we need to set it manually
	    doc.title = title
	    routeFound = false
	    emit()
	    return routeFound
	  }
	
	  // Server-side usage: directly execute handlers for the path
	  return central[TRIGGER]('emit', getPathFromBase(path))
	}
	
	/**
	 * Go to path or set action
	 * a single string:                go there
	 * two strings:                    go there with setting a title
	 * two strings and boolean:        replace history with setting a title
	 * a single function:              set an action on the default route
	 * a string/RegExp and a function: set an action on the route
	 * @param {(string|function)} first - path / action / filter
	 * @param {(string|RegExp|function)} second - title / action
	 * @param {boolean} third - replace flag
	 */
	prot.m = function(first, second, third) {
	  if (isString(first) && (!second || isString(second))) go(first, second, third || false)
	  else if (second) this.r(first, second)
	  else this.r('@', first)
	}
	
	/**
	 * Stop routing
	 */
	prot.s = function() {
	  this.off('*')
	  this.$ = []
	}
	
	/**
	 * Emit
	 * @param {string} path - path
	 */
	prot.e = function(path) {
	  this.$.concat('@').some(function(filter) {
	    var args = (filter == '@' ? parser : secondParser)(normalize(path), normalize(filter))
	    if (typeof args != 'undefined') {
	      this[TRIGGER].apply(null, [filter].concat(args))
	      return routeFound = true // exit from loop
	    }
	  }, this)
	}
	
	/**
	 * Register route
	 * @param {string} filter - filter for matching to url
	 * @param {function} action - action to register
	 */
	prot.r = function(filter, action) {
	  if (filter != '@') {
	    filter = '/' + normalize(filter)
	    this.$.push(filter)
	  }
	  this.on(filter, action)
	}
	
	var mainRouter = new Router()
	var route = mainRouter.m.bind(mainRouter)
	
	/**
	 * Create a sub router
	 * @returns {function} the method of a new Router object
	 */
	route.create = function() {
	  var newSubRouter = new Router()
	  // assign sub-router's main method
	  var router = newSubRouter.m.bind(newSubRouter)
	  // stop only this sub-router
	  router.stop = newSubRouter.s.bind(newSubRouter)
	  return router
	}
	
	/**
	 * Set the base of url
	 * @param {(str|RegExp)} arg - a new base or '#' or '#!'
	 */
	route.base = function(arg) {
	  base = arg || '#'
	  current = getPathFromBase() // recalculate current path
	}
	
	/** Exec routing right now **/
	route.exec = function() {
	  emit(true)
	}
	
	/**
	 * Replace the default router to yours
	 * @param {function} fn - your parser function
	 * @param {function} fn2 - your secondParser function
	 */
	route.parser = function(fn, fn2) {
	  if (!fn && !fn2) {
	    // reset parser for testing...
	    parser = DEFAULT_PARSER
	    secondParser = DEFAULT_SECOND_PARSER
	  }
	  if (fn) parser = fn
	  if (fn2) secondParser = fn2
	}
	
	/**
	 * Helper function to get url query as an object
	 * @returns {object} parsed query
	 */
	route.query = function() {
	  var q = {}
	  var href = loc.href || current
	  href[REPLACE](/[?&](.+?)=([^&]*)/g, function(_, k, v) { q[k] = v })
	  return q
	}
	
	/** Stop routing **/
	route.stop = function () {
	  if (started) {
	    if (win) {
	      win[REMOVE_EVENT_LISTENER](POPSTATE, debouncedEmit)
	      win[REMOVE_EVENT_LISTENER](HASHCHANGE, debouncedEmit)
	      doc[REMOVE_EVENT_LISTENER](clickEvent, click)
	    }
	    central[TRIGGER]('stop')
	    started = false
	  }
	}
	
	/**
	 * Start routing
	 * @param {boolean} autoExec - automatically exec after starting if true
	 */
	route.start = function (autoExec) {
	  if (!started) {
	    if (win) {
	      if (document.readyState == 'complete') start(autoExec)
	      // the timeout is needed to solve
	      // a weird safari bug https://github.com/riot/route/issues/33
	      else win[ADD_EVENT_LISTENER]('load', function() {
	        setTimeout(function() { start(autoExec) }, 1)
	      })
	    }
	    started = true
	  }
	}
	
	/** Prepare the router **/
	route.base()
	route.parser()
	
	riot.route = route
	})(riot)
	/* istanbul ignore next */
	
	/**
	 * The riot template engine
	 * @version v2.3.22
	 */
	
	/**
	 * riot.util.brackets
	 *
	 * - `brackets    ` - Returns a string or regex based on its parameter
	 * - `brackets.set` - Change the current riot brackets
	 *
	 * @module
	 */
	
	var brackets = (function (UNDEF) {
	
	  var
	    REGLOB = 'g',
	
	    R_MLCOMMS = /\/\*[^*]*\*+(?:[^*\/][^*]*\*+)*\//g,
	
	    R_STRINGS = /"[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'/g,
	
	    S_QBLOCKS = R_STRINGS.source + '|' +
	      /(?:\breturn\s+|(?:[$\w\)\]]|\+\+|--)\s*(\/)(?![*\/]))/.source + '|' +
	      /\/(?=[^*\/])[^[\/\\]*(?:(?:\[(?:\\.|[^\]\\]*)*\]|\\.)[^[\/\\]*)*?(\/)[gim]*/.source,
	
	    FINDBRACES = {
	      '(': RegExp('([()])|'   + S_QBLOCKS, REGLOB),
	      '[': RegExp('([[\\]])|' + S_QBLOCKS, REGLOB),
	      '{': RegExp('([{}])|'   + S_QBLOCKS, REGLOB)
	    },
	
	    DEFAULT = '{ }'
	
	  var _pairs = [
	    '{', '}',
	    '{', '}',
	    /{[^}]*}/,
	    /\\([{}])/g,
	    /\\({)|{/g,
	    RegExp('\\\\(})|([[({])|(})|' + S_QBLOCKS, REGLOB),
	    DEFAULT,
	    /^\s*{\^?\s*([$\w]+)(?:\s*,\s*(\S+))?\s+in\s+(\S.*)\s*}/,
	    /(^|[^\\]){=[\S\s]*?}/
	  ]
	
	  var
	    cachedBrackets = UNDEF,
	    _regex,
	    _cache = [],
	    _settings
	
	  function _loopback (re) { return re }
	
	  function _rewrite (re, bp) {
	    if (!bp) bp = _cache
	    return new RegExp(
	      re.source.replace(/{/g, bp[2]).replace(/}/g, bp[3]), re.global ? REGLOB : ''
	    )
	  }
	
	  function _create (pair) {
	    if (pair === DEFAULT) return _pairs
	
	    var arr = pair.split(' ')
	
	    if (arr.length !== 2 || /[\x00-\x1F<>a-zA-Z0-9'",;\\]/.test(pair)) {
	      throw new Error('Unsupported brackets "' + pair + '"')
	    }
	    arr = arr.concat(pair.replace(/(?=[[\]()*+?.^$|])/g, '\\').split(' '))
	
	    arr[4] = _rewrite(arr[1].length > 1 ? /{[\S\s]*?}/ : _pairs[4], arr)
	    arr[5] = _rewrite(pair.length > 3 ? /\\({|})/g : _pairs[5], arr)
	    arr[6] = _rewrite(_pairs[6], arr)
	    arr[7] = RegExp('\\\\(' + arr[3] + ')|([[({])|(' + arr[3] + ')|' + S_QBLOCKS, REGLOB)
	    arr[8] = pair
	    return arr
	  }
	
	  function _brackets (reOrIdx) {
	    return reOrIdx instanceof RegExp ? _regex(reOrIdx) : _cache[reOrIdx]
	  }
	
	  _brackets.split = function split (str, tmpl, _bp) {
	    // istanbul ignore next: _bp is for the compiler
	    if (!_bp) _bp = _cache
	
	    var
	      parts = [],
	      match,
	      isexpr,
	      start,
	      pos,
	      re = _bp[6]
	
	    isexpr = start = re.lastIndex = 0
	
	    while ((match = re.exec(str))) {
	
	      pos = match.index
	
	      if (isexpr) {
	
	        if (match[2]) {
	          re.lastIndex = skipBraces(str, match[2], re.lastIndex)
	          continue
	        }
	        if (!match[3]) {
	          continue
	        }
	      }
	
	      if (!match[1]) {
	        unescapeStr(str.slice(start, pos))
	        start = re.lastIndex
	        re = _bp[6 + (isexpr ^= 1)]
	        re.lastIndex = start
	      }
	    }
	
	    if (str && start < str.length) {
	      unescapeStr(str.slice(start))
	    }
	
	    return parts
	
	    function unescapeStr (s) {
	      if (tmpl || isexpr) {
	        parts.push(s && s.replace(_bp[5], '$1'))
	      } else {
	        parts.push(s)
	      }
	    }
	
	    function skipBraces (s, ch, ix) {
	      var
	        match,
	        recch = FINDBRACES[ch]
	
	      recch.lastIndex = ix
	      ix = 1
	      while ((match = recch.exec(s))) {
	        if (match[1] &&
	          !(match[1] === ch ? ++ix : --ix)) break
	      }
	      return ix ? s.length : recch.lastIndex
	    }
	  }
	
	  _brackets.hasExpr = function hasExpr (str) {
	    return _cache[4].test(str)
	  }
	
	  _brackets.loopKeys = function loopKeys (expr) {
	    var m = expr.match(_cache[9])
	
	    return m
	      ? { key: m[1], pos: m[2], val: _cache[0] + m[3].trim() + _cache[1] }
	      : { val: expr.trim() }
	  }
	
	  _brackets.array = function array (pair) {
	    return pair ? _create(pair) : _cache
	  }
	
	  function _reset (pair) {
	    if ((pair || (pair = DEFAULT)) !== _cache[8]) {
	      _cache = _create(pair)
	      _regex = pair === DEFAULT ? _loopback : _rewrite
	      _cache[9] = _regex(_pairs[9])
	    }
	    cachedBrackets = pair
	  }
	
	  function _setSettings (o) {
	    var b
	
	    o = o || {}
	    b = o.brackets
	    Object.defineProperty(o, 'brackets', {
	      set: _reset,
	      get: function () { return cachedBrackets },
	      enumerable: true
	    })
	    _settings = o
	    _reset(b)
	  }
	
	  Object.defineProperty(_brackets, 'settings', {
	    set: _setSettings,
	    get: function () { return _settings }
	  })
	
	  /* istanbul ignore next: in the browser riot is always in the scope */
	  _brackets.settings = typeof riot !== 'undefined' && riot.settings || {}
	  _brackets.set = _reset
	
	  _brackets.R_STRINGS = R_STRINGS
	  _brackets.R_MLCOMMS = R_MLCOMMS
	  _brackets.S_QBLOCKS = S_QBLOCKS
	
	  return _brackets
	
	})()
	
	/**
	 * @module tmpl
	 *
	 * tmpl          - Root function, returns the template value, render with data
	 * tmpl.hasExpr  - Test the existence of a expression inside a string
	 * tmpl.loopKeys - Get the keys for an 'each' loop (used by `_each`)
	 */
	
	var tmpl = (function () {
	
	  var _cache = {}
	
	  function _tmpl (str, data) {
	    if (!str) return str
	
	    return (_cache[str] || (_cache[str] = _create(str))).call(data, _logErr)
	  }
	
	  _tmpl.haveRaw = brackets.hasRaw
	
	  _tmpl.hasExpr = brackets.hasExpr
	
	  _tmpl.loopKeys = brackets.loopKeys
	
	  _tmpl.errorHandler = null
	
	  function _logErr (err, ctx) {
	
	    if (_tmpl.errorHandler) {
	
	      err.riotData = {
	        tagName: ctx && ctx.root && ctx.root.tagName,
	        _riot_id: ctx && ctx._riot_id  //eslint-disable-line camelcase
	      }
	      _tmpl.errorHandler(err)
	    }
	  }
	
	  function _create (str) {
	    var expr = _getTmpl(str)
	
	    if (expr.slice(0, 11) !== 'try{return ') expr = 'return ' + expr
	
	    return new Function('E', expr + ';')    //eslint-disable-line no-new-func
	  }
	
	  var
	    CH_IDEXPR = '\u2057',
	    RE_CSNAME = /^(?:(-?[_A-Za-z\xA0-\xFF][-\w\xA0-\xFF]*)|\u2057(\d+)~):/,
	    RE_QBLOCK = RegExp(brackets.S_QBLOCKS, 'g'),
	    RE_DQUOTE = /\u2057/g,
	    RE_QBMARK = /\u2057(\d+)~/g
	
	  function _getTmpl (str) {
	    var
	      qstr = [],
	      expr,
	      parts = brackets.split(str.replace(RE_DQUOTE, '"'), 1)
	
	    if (parts.length > 2 || parts[0]) {
	      var i, j, list = []
	
	      for (i = j = 0; i < parts.length; ++i) {
	
	        expr = parts[i]
	
	        if (expr && (expr = i & 1
	
	            ? _parseExpr(expr, 1, qstr)
	
	            : '"' + expr
	                .replace(/\\/g, '\\\\')
	                .replace(/\r\n?|\n/g, '\\n')
	                .replace(/"/g, '\\"') +
	              '"'
	
	          )) list[j++] = expr
	
	      }
	
	      expr = j < 2 ? list[0]
	           : '[' + list.join(',') + '].join("")'
	
	    } else {
	
	      expr = _parseExpr(parts[1], 0, qstr)
	    }
	
	    if (qstr[0]) {
	      expr = expr.replace(RE_QBMARK, function (_, pos) {
	        return qstr[pos]
	          .replace(/\r/g, '\\r')
	          .replace(/\n/g, '\\n')
	      })
	    }
	    return expr
	  }
	
	  var
	    RE_BREND = {
	      '(': /[()]/g,
	      '[': /[[\]]/g,
	      '{': /[{}]/g
	    }
	
	  function _parseExpr (expr, asText, qstr) {
	
	    expr = expr
	          .replace(RE_QBLOCK, function (s, div) {
	            return s.length > 2 && !div ? CH_IDEXPR + (qstr.push(s) - 1) + '~' : s
	          })
	          .replace(/\s+/g, ' ').trim()
	          .replace(/\ ?([[\({},?\.:])\ ?/g, '$1')
	
	    if (expr) {
	      var
	        list = [],
	        cnt = 0,
	        match
	
	      while (expr &&
	            (match = expr.match(RE_CSNAME)) &&
	            !match.index
	        ) {
	        var
	          key,
	          jsb,
	          re = /,|([[{(])|$/g
	
	        expr = RegExp.rightContext
	        key  = match[2] ? qstr[match[2]].slice(1, -1).trim().replace(/\s+/g, ' ') : match[1]
	
	        while (jsb = (match = re.exec(expr))[1]) skipBraces(jsb, re)
	
	        jsb  = expr.slice(0, match.index)
	        expr = RegExp.rightContext
	
	        list[cnt++] = _wrapExpr(jsb, 1, key)
	      }
	
	      expr = !cnt ? _wrapExpr(expr, asText)
	           : cnt > 1 ? '[' + list.join(',') + '].join(" ").trim()' : list[0]
	    }
	    return expr
	
	    function skipBraces (ch, re) {
	      var
	        mm,
	        lv = 1,
	        ir = RE_BREND[ch]
	
	      ir.lastIndex = re.lastIndex
	      while (mm = ir.exec(expr)) {
	        if (mm[0] === ch) ++lv
	        else if (!--lv) break
	      }
	      re.lastIndex = lv ? expr.length : ir.lastIndex
	    }
	  }
	
	  // istanbul ignore next: not both
	  var // eslint-disable-next-line max-len
	    JS_CONTEXT = '"in this?this:' + (typeof window !== 'object' ? 'global' : 'window') + ').',
	    JS_VARNAME = /[,{][$\w]+:|(^ *|[^$\w\.])(?!(?:typeof|true|false|null|undefined|in|instanceof|is(?:Finite|NaN)|void|NaN|new|Date|RegExp|Math)(?![$\w]))([$_A-Za-z][$\w]*)/g,
	    JS_NOPROPS = /^(?=(\.[$\w]+))\1(?:[^.[(]|$)/
	
	  function _wrapExpr (expr, asText, key) {
	    var tb
	
	    expr = expr.replace(JS_VARNAME, function (match, p, mvar, pos, s) {
	      if (mvar) {
	        pos = tb ? 0 : pos + match.length
	
	        if (mvar !== 'this' && mvar !== 'global' && mvar !== 'window') {
	          match = p + '("' + mvar + JS_CONTEXT + mvar
	          if (pos) tb = (s = s[pos]) === '.' || s === '(' || s === '['
	        } else if (pos) {
	          tb = !JS_NOPROPS.test(s.slice(pos))
	        }
	      }
	      return match
	    })
	
	    if (tb) {
	      expr = 'try{return ' + expr + '}catch(e){E(e,this)}'
	    }
	
	    if (key) {
	
	      expr = (tb
	          ? 'function(){' + expr + '}.call(this)' : '(' + expr + ')'
	        ) + '?"' + key + '":""'
	
	    } else if (asText) {
	
	      expr = 'function(v){' + (tb
	          ? expr.replace('return ', 'v=') : 'v=(' + expr + ')'
	        ) + ';return v||v===0?v:""}.call(this)'
	    }
	
	    return expr
	  }
	
	  // istanbul ignore next: compatibility fix for beta versions
	  _tmpl.parse = function (s) { return s }
	
	  _tmpl.version = brackets.version = 'v2.3.22'
	
	  return _tmpl
	
	})()
	
	/*
	  lib/browser/tag/mkdom.js
	
	  Includes hacks needed for the Internet Explorer version 9 and below
	  See: http://kangax.github.io/compat-table/es5/#ie8
	       http://codeplanet.io/dropping-ie8/
	*/
	var mkdom = (function _mkdom() {
	  var
	    reHasYield  = /<yield\b/i,
	    reYieldAll  = /<yield\s*(?:\/>|>([\S\s]*?)<\/yield\s*>)/ig,
	    reYieldSrc  = /<yield\s+to=['"]([^'">]*)['"]\s*>([\S\s]*?)<\/yield\s*>/ig,
	    reYieldDest = /<yield\s+from=['"]?([-\w]+)['"]?\s*(?:\/>|>([\S\s]*?)<\/yield\s*>)/ig
	  var
	    rootEls = { tr: 'tbody', th: 'tr', td: 'tr', col: 'colgroup' },
	    tblTags = IE_VERSION && IE_VERSION < 10
	      ? SPECIAL_TAGS_REGEX : /^(?:t(?:body|head|foot|[rhd])|caption|col(?:group)?)$/
	
	  /**
	   * Creates a DOM element to wrap the given content. Normally an `DIV`, but can be
	   * also a `TABLE`, `SELECT`, `TBODY`, `TR`, or `COLGROUP` element.
	   *
	   * @param   {string} templ  - The template coming from the custom tag definition
	   * @param   {string} [html] - HTML content that comes from the DOM element where you
	   *           will mount the tag, mostly the original tag in the page
	   * @returns {HTMLElement} DOM element with _templ_ merged through `YIELD` with the _html_.
	   */
	  function _mkdom(templ, html) {
	    var
	      match   = templ && templ.match(/^\s*<([-\w]+)/),
	      tagName = match && match[1].toLowerCase(),
	      el = mkEl('div')
	
	    // replace all the yield tags with the tag inner html
	    templ = replaceYield(templ, html)
	
	    /* istanbul ignore next */
	    if (tblTags.test(tagName))
	      el = specialTags(el, templ, tagName)
	    else
	      el.innerHTML = templ
	
	    el.stub = true
	
	    return el
	  }
	
	  /*
	    Creates the root element for table or select child elements:
	    tr/th/td/thead/tfoot/tbody/caption/col/colgroup/option/optgroup
	  */
	  function specialTags(el, templ, tagName) {
	    var
	      select = tagName[0] === 'o',
	      parent = select ? 'select>' : 'table>'
	
	    // trim() is important here, this ensures we don't have artifacts,
	    // so we can check if we have only one element inside the parent
	    el.innerHTML = '<' + parent + templ.trim() + '</' + parent
	    parent = el.firstChild
	
	    // returns the immediate parent if tr/th/td/col is the only element, if not
	    // returns the whole tree, as this can include additional elements
	    if (select) {
	      parent.selectedIndex = -1  // for IE9, compatible w/current riot behavior
	    } else {
	      // avoids insertion of cointainer inside container (ex: tbody inside tbody)
	      var tname = rootEls[tagName]
	      if (tname && parent.childElementCount === 1) parent = $(tname, parent)
	    }
	    return parent
	  }
	
	  /*
	    Replace the yield tag from any tag template with the innerHTML of the
	    original tag in the page
	  */
	  function replaceYield(templ, html) {
	    // do nothing if no yield
	    if (!reHasYield.test(templ)) return templ
	
	    // be careful with #1343 - string on the source having `$1`
	    var src = {}
	
	    html = html && html.replace(reYieldSrc, function (_, ref, text) {
	      src[ref] = src[ref] || text   // preserve first definition
	      return ''
	    }).trim()
	
	    return templ
	      .replace(reYieldDest, function (_, ref, def) {  // yield with from - to attrs
	        return src[ref] || def || ''
	      })
	      .replace(reYieldAll, function (_, def) {        // yield without any "from"
	        return html || def || ''
	      })
	  }
	
	  return _mkdom
	
	})()
	
	/**
	 * Convert the item looped into an object used to extend the child tag properties
	 * @param   { Object } expr - object containing the keys used to extend the children tags
	 * @param   { * } key - value to assign to the new object returned
	 * @param   { * } val - value containing the position of the item in the array
	 * @returns { Object } - new object containing the values of the original item
	 *
	 * The variables 'key' and 'val' are arbitrary.
	 * They depend on the collection type looped (Array, Object)
	 * and on the expression used on the each tag
	 *
	 */
	function mkitem(expr, key, val) {
	  var item = {}
	  item[expr.key] = key
	  if (expr.pos) item[expr.pos] = val
	  return item
	}
	
	/**
	 * Unmount the redundant tags
	 * @param   { Array } items - array containing the current items to loop
	 * @param   { Array } tags - array containing all the children tags
	 */
	function unmountRedundant(items, tags) {
	
	  var i = tags.length,
	    j = items.length,
	    t
	
	  while (i > j) {
	    t = tags[--i]
	    tags.splice(i, 1)
	    t.unmount()
	  }
	}
	
	/**
	 * Move the nested custom tags in non custom loop tags
	 * @param   { Object } child - non custom loop tag
	 * @param   { Number } i - current position of the loop tag
	 */
	function moveNestedTags(child, i) {
	  Object.keys(child.tags).forEach(function(tagName) {
	    var tag = child.tags[tagName]
	    if (isArray(tag))
	      each(tag, function (t) {
	        moveChildTag(t, tagName, i)
	      })
	    else
	      moveChildTag(tag, tagName, i)
	  })
	}
	
	/**
	 * Adds the elements for a virtual tag
	 * @param { Tag } tag - the tag whose root's children will be inserted or appended
	 * @param { Node } src - the node that will do the inserting or appending
	 * @param { Tag } target - only if inserting, insert before this tag's first child
	 */
	function addVirtual(tag, src, target) {
	  var el = tag._root, sib
	  tag._virts = []
	  while (el) {
	    sib = el.nextSibling
	    if (target)
	      src.insertBefore(el, target._root)
	    else
	      src.appendChild(el)
	
	    tag._virts.push(el) // hold for unmounting
	    el = sib
	  }
	}
	
	/**
	 * Move virtual tag and all child nodes
	 * @param { Tag } tag - first child reference used to start move
	 * @param { Node } src  - the node that will do the inserting
	 * @param { Tag } target - insert before this tag's first child
	 * @param { Number } len - how many child nodes to move
	 */
	function moveVirtual(tag, src, target, len) {
	  var el = tag._root, sib, i = 0
	  for (; i < len; i++) {
	    sib = el.nextSibling
	    src.insertBefore(el, target._root)
	    el = sib
	  }
	}
	
	
	/**
	 * Manage tags having the 'each'
	 * @param   { Object } dom - DOM node we need to loop
	 * @param   { Tag } parent - parent tag instance where the dom node is contained
	 * @param   { String } expr - string contained in the 'each' attribute
	 */
	function _each(dom, parent, expr) {
	
	  // remove the each property from the original tag
	  remAttr(dom, 'each')
	
	  var mustReorder = typeof getAttr(dom, 'no-reorder') !== T_STRING || remAttr(dom, 'no-reorder'),
	    tagName = getTagName(dom),
	    impl = __tagImpl[tagName] || { tmpl: dom.outerHTML },
	    useRoot = SPECIAL_TAGS_REGEX.test(tagName),
	    root = dom.parentNode,
	    ref = document.createTextNode(''),
	    child = getTag(dom),
	    isOption = tagName.toLowerCase() === 'option', // the option tags must be treated differently
	    tags = [],
	    oldItems = [],
	    hasKeys,
	    isVirtual = dom.tagName == 'VIRTUAL'
	
	  // parse the each expression
	  expr = tmpl.loopKeys(expr)
	
	  // insert a marked where the loop tags will be injected
	  root.insertBefore(ref, dom)
	
	  // clean template code
	  parent.one('before-mount', function () {
	
	    // remove the original DOM node
	    dom.parentNode.removeChild(dom)
	    if (root.stub) root = parent.root
	
	  }).on('update', function () {
	    // get the new items collection
	    var items = tmpl(expr.val, parent),
	      // create a fragment to hold the new DOM nodes to inject in the parent tag
	      frag = document.createDocumentFragment()
	
	    // object loop. any changes cause full redraw
	    if (!isArray(items)) {
	      hasKeys = items || false
	      items = hasKeys ?
	        Object.keys(items).map(function (key) {
	          return mkitem(expr, key, items[key])
	        }) : []
	    }
	
	    // loop all the new items
	    var i = 0,
	      itemsLength = items.length
	
	    for (; i < itemsLength; i++) {
	      // reorder only if the items are objects
	      var
	        item = items[i],
	        _mustReorder = mustReorder && item instanceof Object && !hasKeys,
	        oldPos = oldItems.indexOf(item),
	        pos = ~oldPos && _mustReorder ? oldPos : i,
	        // does a tag exist in this position?
	        tag = tags[pos]
	
	      item = !hasKeys && expr.key ? mkitem(expr, item, i) : item
	
	      // new tag
	      if (
	        !_mustReorder && !tag // with no-reorder we just update the old tags
	        ||
	        _mustReorder && !~oldPos || !tag // by default we always try to reorder the DOM elements
	      ) {
	
	        tag = new Tag(impl, {
	          parent: parent,
	          isLoop: true,
	          hasImpl: !!__tagImpl[tagName],
	          root: useRoot ? root : dom.cloneNode(),
	          item: item
	        }, dom.innerHTML)
	
	        tag.mount()
	
	        if (isVirtual) tag._root = tag.root.firstChild // save reference for further moves or inserts
	        // this tag must be appended
	        if (i == tags.length || !tags[i]) { // fix 1581
	          if (isVirtual)
	            addVirtual(tag, frag)
	          else frag.appendChild(tag.root)
	        }
	        // this tag must be insert
	        else {
	          if (isVirtual)
	            addVirtual(tag, root, tags[i])
	          else root.insertBefore(tag.root, tags[i].root) // #1374 some browsers reset selected here
	          oldItems.splice(i, 0, item)
	        }
	
	        tags.splice(i, 0, tag)
	        pos = i // handled here so no move
	      } else tag.update(item, true)
	
	      // reorder the tag if it's not located in its previous position
	      if (
	        pos !== i && _mustReorder &&
	        tags[i] // fix 1581 unable to reproduce it in a test!
	      ) {
	        // update the DOM
	        if (isVirtual)
	          moveVirtual(tag, root, tags[i], dom.childNodes.length)
	        else root.insertBefore(tag.root, tags[i].root)
	        // update the position attribute if it exists
	        if (expr.pos)
	          tag[expr.pos] = i
	        // move the old tag instance
	        tags.splice(i, 0, tags.splice(pos, 1)[0])
	        // move the old item
	        oldItems.splice(i, 0, oldItems.splice(pos, 1)[0])
	        // if the loop tags are not custom
	        // we need to move all their custom tags into the right position
	        if (!child && tag.tags) moveNestedTags(tag, i)
	      }
	
	      // cache the original item to use it in the events bound to this node
	      // and its children
	      tag._item = item
	      // cache the real parent tag internally
	      defineProperty(tag, '_parent', parent)
	    }
	
	    // remove the redundant tags
	    unmountRedundant(items, tags)
	
	    // insert the new nodes
	    if (isOption) {
	      root.appendChild(frag)
	
	      // #1374 FireFox bug in <option selected={expression}>
	      if (FIREFOX && !root.multiple) {
	        for (var n = 0; n < root.length; n++) {
	          if (root[n].__riot1374) {
	            root.selectedIndex = n  // clear other options
	            delete root[n].__riot1374
	            break
	          }
	        }
	      }
	    }
	    else root.insertBefore(frag, ref)
	
	    // set the 'tags' property of the parent tag
	    // if child is 'undefined' it means that we don't need to set this property
	    // for example:
	    // we don't need store the `myTag.tags['div']` property if we are looping a div tag
	    // but we need to track the `myTag.tags['child']` property looping a custom child node named `child`
	    if (child) parent.tags[tagName] = tags
	
	    // clone the items array
	    oldItems = items.slice()
	
	  })
	
	}
	/**
	 * Object that will be used to inject and manage the css of every tag instance
	 */
	var styleManager = (function(_riot) {
	
	  if (!window) return { // skip injection on the server
	    add: function () {},
	    inject: function () {}
	  }
	
	  var styleNode = (function () {
	    // create a new style element with the correct type
	    var newNode = mkEl('style')
	    setAttr(newNode, 'type', 'text/css')
	
	    // replace any user node or insert the new one into the head
	    var userNode = $('style[type=riot]')
	    if (userNode) {
	      if (userNode.id) newNode.id = userNode.id
	      userNode.parentNode.replaceChild(newNode, userNode)
	    }
	    else document.getElementsByTagName('head')[0].appendChild(newNode)
	
	    return newNode
	  })()
	
	  // Create cache and shortcut to the correct property
	  var cssTextProp = styleNode.styleSheet,
	    stylesToInject = ''
	
	  // Expose the style node in a non-modificable property
	  Object.defineProperty(_riot, 'styleNode', {
	    value: styleNode,
	    writable: true
	  })
	
	  /**
	   * Public api
	   */
	  return {
	    /**
	     * Save a tag style to be later injected into DOM
	     * @param   { String } css [description]
	     */
	    add: function(css) {
	      stylesToInject += css
	    },
	    /**
	     * Inject all previously saved tag styles into DOM
	     * innerHTML seems slow: http://jsperf.com/riot-insert-style
	     */
	    inject: function() {
	      if (stylesToInject) {
	        if (cssTextProp) cssTextProp.cssText += stylesToInject
	        else styleNode.innerHTML += stylesToInject
	        stylesToInject = ''
	      }
	    }
	  }
	
	})(riot)
	
	
	function parseNamedElements(root, tag, childTags, forceParsingNamed) {
	
	  walk(root, function(dom) {
	    if (dom.nodeType == 1) {
	      dom.isLoop = dom.isLoop ||
	                  (dom.parentNode && dom.parentNode.isLoop || getAttr(dom, 'each'))
	                    ? 1 : 0
	
	      // custom child tag
	      if (childTags) {
	        var child = getTag(dom)
	
	        if (child && !dom.isLoop)
	          childTags.push(initChildTag(child, {root: dom, parent: tag}, dom.innerHTML, tag))
	      }
	
	      if (!dom.isLoop || forceParsingNamed)
	        setNamed(dom, tag, [])
	    }
	
	  })
	
	}
	
	function parseExpressions(root, tag, expressions) {
	
	  function addExpr(dom, val, extra) {
	    if (tmpl.hasExpr(val)) {
	      expressions.push(extend({ dom: dom, expr: val }, extra))
	    }
	  }
	
	  walk(root, function(dom) {
	    var type = dom.nodeType,
	      attr
	
	    // text node
	    if (type == 3 && dom.parentNode.tagName != 'STYLE') addExpr(dom, dom.nodeValue)
	    if (type != 1) return
	
	    /* element */
	
	    // loop
	    attr = getAttr(dom, 'each')
	
	    if (attr) { _each(dom, tag, attr); return false }
	
	    // attribute expressions
	    each(dom.attributes, function(attr) {
	      var name = attr.name,
	        bool = name.split('__')[1]
	
	      addExpr(dom, attr.value, { attr: bool || name, bool: bool })
	      if (bool) { remAttr(dom, name); return false }
	
	    })
	
	    // skip custom tags
	    if (getTag(dom)) return false
	
	  })
	
	}
	function Tag(impl, conf, innerHTML) {
	
	  var self = riot.observable(this),
	    opts = inherit(conf.opts) || {},
	    parent = conf.parent,
	    isLoop = conf.isLoop,
	    hasImpl = conf.hasImpl,
	    item = cleanUpData(conf.item),
	    expressions = [],
	    childTags = [],
	    root = conf.root,
	    tagName = root.tagName.toLowerCase(),
	    attr = {},
	    propsInSyncWithParent = [],
	    dom
	
	  // only call unmount if we have a valid __tagImpl (has name property)
	  if (impl.name && root._tag) root._tag.unmount(true)
	
	  // not yet mounted
	  this.isMounted = false
	  root.isLoop = isLoop
	
	  // keep a reference to the tag just created
	  // so we will be able to mount this tag multiple times
	  root._tag = this
	
	  // create a unique id to this tag
	  // it could be handy to use it also to improve the virtual dom rendering speed
	  defineProperty(this, '_riot_id', ++__uid) // base 1 allows test !t._riot_id
	
	  extend(this, { parent: parent, root: root, opts: opts, tags: {} }, item)
	
	  // grab attributes
	  each(root.attributes, function(el) {
	    var val = el.value
	    // remember attributes with expressions only
	    if (tmpl.hasExpr(val)) attr[el.name] = val
	  })
	
	  dom = mkdom(impl.tmpl, innerHTML)
	
	  // options
	  function updateOpts() {
	    var ctx = hasImpl && isLoop ? self : parent || self
	
	    // update opts from current DOM attributes
	    each(root.attributes, function(el) {
	      var val = el.value
	      opts[toCamel(el.name)] = tmpl.hasExpr(val) ? tmpl(val, ctx) : val
	    })
	    // recover those with expressions
	    each(Object.keys(attr), function(name) {
	      opts[toCamel(name)] = tmpl(attr[name], ctx)
	    })
	  }
	
	  function normalizeData(data) {
	    for (var key in item) {
	      if (typeof self[key] !== T_UNDEF && isWritable(self, key))
	        self[key] = data[key]
	    }
	  }
	
	  function inheritFromParent () {
	    if (!self.parent || !isLoop) return
	    each(Object.keys(self.parent), function(k) {
	      // some properties must be always in sync with the parent tag
	      var mustSync = !contains(RESERVED_WORDS_BLACKLIST, k) && contains(propsInSyncWithParent, k)
	      if (typeof self[k] === T_UNDEF || mustSync) {
	        // track the property to keep in sync
	        // so we can keep it updated
	        if (!mustSync) propsInSyncWithParent.push(k)
	        self[k] = self.parent[k]
	      }
	    })
	  }
	
	  /**
	   * Update the tag expressions and options
	   * @param   { * }  data - data we want to use to extend the tag properties
	   * @param   { Boolean } isInherited - is this update coming from a parent tag?
	   * @returns { self }
	   */
	  defineProperty(this, 'update', function(data, isInherited) {
	
	    // make sure the data passed will not override
	    // the component core methods
	    data = cleanUpData(data)
	    // inherit properties from the parent
	    inheritFromParent()
	    // normalize the tag properties in case an item object was initially passed
	    if (data && isObject(item)) {
	      normalizeData(data)
	      item = data
	    }
	    extend(self, data)
	    updateOpts()
	    self.trigger('update', data)
	    update(expressions, self)
	
	    // the updated event will be triggered
	    // once the DOM will be ready and all the re-flows are completed
	    // this is useful if you want to get the "real" root properties
	    // 4 ex: root.offsetWidth ...
	    if (isInherited && self.parent)
	      // closes #1599
	      self.parent.one('updated', function() { self.trigger('updated') })
	    else rAF(function() { self.trigger('updated') })
	
	    return this
	  })
	
	  defineProperty(this, 'mixin', function() {
	    each(arguments, function(mix) {
	      var instance
	
	      mix = typeof mix === T_STRING ? riot.mixin(mix) : mix
	
	      // check if the mixin is a function
	      if (isFunction(mix)) {
	        // create the new mixin instance
	        instance = new mix()
	        // save the prototype to loop it afterwards
	        mix = mix.prototype
	      } else instance = mix
	
	      // loop the keys in the function prototype or the all object keys
	      each(Object.getOwnPropertyNames(mix), function(key) {
	        // bind methods to self
	        if (key != 'init')
	          self[key] = isFunction(instance[key]) ?
	                        instance[key].bind(self) :
	                        instance[key]
	      })
	
	      // init method will be called automatically
	      if (instance.init) instance.init.bind(self)()
	    })
	    return this
	  })
	
	  defineProperty(this, 'mount', function() {
	
	    updateOpts()
	
	    // add global mixin
	    var globalMixin = riot.mixin(GLOBAL_MIXIN)
	    if (globalMixin) self.mixin(globalMixin)
	
	    // initialiation
	    if (impl.fn) impl.fn.call(self, opts)
	
	    // parse layout after init. fn may calculate args for nested custom tags
	    parseExpressions(dom, self, expressions)
	
	    // mount the child tags
	    toggle(true)
	
	    // update the root adding custom attributes coming from the compiler
	    // it fixes also #1087
	    if (impl.attrs)
	      walkAttributes(impl.attrs, function (k, v) { setAttr(root, k, v) })
	    if (impl.attrs || hasImpl)
	      parseExpressions(self.root, self, expressions)
	
	    if (!self.parent || isLoop) self.update(item)
	
	    // internal use only, fixes #403
	    self.trigger('before-mount')
	
	    if (isLoop && !hasImpl) {
	      // update the root attribute for the looped elements
	      root = dom.firstChild
	    } else {
	      while (dom.firstChild) root.appendChild(dom.firstChild)
	      if (root.stub) root = parent.root
	    }
	
	    defineProperty(self, 'root', root)
	
	    // parse the named dom nodes in the looped child
	    // adding them to the parent as well
	    if (isLoop)
	      parseNamedElements(self.root, self.parent, null, true)
	
	    // if it's not a child tag we can trigger its mount event
	    if (!self.parent || self.parent.isMounted) {
	      self.isMounted = true
	      self.trigger('mount')
	    }
	    // otherwise we need to wait that the parent event gets triggered
	    else self.parent.one('mount', function() {
	      // avoid to trigger the `mount` event for the tags
	      // not visible included in an if statement
	      if (!isInStub(self.root)) {
	        self.parent.isMounted = self.isMounted = true
	        self.trigger('mount')
	      }
	    })
	  })
	
	
	  defineProperty(this, 'unmount', function(keepRootTag) {
	    var el = root,
	      p = el.parentNode,
	      ptag,
	      tagIndex = __virtualDom.indexOf(self)
	
	    self.trigger('before-unmount')
	
	    // remove this tag instance from the global virtualDom variable
	    if (~tagIndex)
	      __virtualDom.splice(tagIndex, 1)
	
	    if (p) {
	
	      if (parent) {
	        ptag = getImmediateCustomParentTag(parent)
	        // remove this tag from the parent tags object
	        // if there are multiple nested tags with same name..
	        // remove this element form the array
	        if (isArray(ptag.tags[tagName]))
	          each(ptag.tags[tagName], function(tag, i) {
	            if (tag._riot_id == self._riot_id)
	              ptag.tags[tagName].splice(i, 1)
	          })
	        else
	          // otherwise just delete the tag instance
	          ptag.tags[tagName] = undefined
	      }
	
	      else
	        while (el.firstChild) el.removeChild(el.firstChild)
	
	      if (!keepRootTag)
	        p.removeChild(el)
	      else {
	        // the riot-tag and the data-is attributes aren't needed anymore, remove them
	        remAttr(p, RIOT_TAG_IS)
	        remAttr(p, RIOT_TAG) // this will be removed in riot 3.0.0
	      }
	
	    }
	
	    if (this._virts) {
	      each(this._virts, function(v) {
	        if (v.parentNode) v.parentNode.removeChild(v)
	      })
	    }
	
	    self.trigger('unmount')
	    toggle()
	    self.off('*')
	    self.isMounted = false
	    delete root._tag
	
	  })
	
	  // proxy function to bind updates
	  // dispatched from a parent tag
	  function onChildUpdate(data) { self.update(data, true) }
	
	  function toggle(isMount) {
	
	    // mount/unmount children
	    each(childTags, function(child) { child[isMount ? 'mount' : 'unmount']() })
	
	    // listen/unlisten parent (events flow one way from parent to children)
	    if (!parent) return
	    var evt = isMount ? 'on' : 'off'
	
	    // the loop tags will be always in sync with the parent automatically
	    if (isLoop)
	      parent[evt]('unmount', self.unmount)
	    else {
	      parent[evt]('update', onChildUpdate)[evt]('unmount', self.unmount)
	    }
	  }
	
	
	  // named elements available for fn
	  parseNamedElements(dom, this, childTags)
	
	}
	/**
	 * Attach an event to a DOM node
	 * @param { String } name - event name
	 * @param { Function } handler - event callback
	 * @param { Object } dom - dom node
	 * @param { Tag } tag - tag instance
	 */
	function setEventHandler(name, handler, dom, tag) {
	
	  dom[name] = function(e) {
	
	    var ptag = tag._parent,
	      item = tag._item,
	      el
	
	    if (!item)
	      while (ptag && !item) {
	        item = ptag._item
	        ptag = ptag._parent
	      }
	
	    // cross browser event fix
	    e = e || window.event
	
	    // override the event properties
	    if (isWritable(e, 'currentTarget')) e.currentTarget = dom
	    if (isWritable(e, 'target')) e.target = e.srcElement
	    if (isWritable(e, 'which')) e.which = e.charCode || e.keyCode
	
	    e.item = item
	
	    // prevent default behaviour (by default)
	    if (handler.call(tag, e) !== true && !/radio|check/.test(dom.type)) {
	      if (e.preventDefault) e.preventDefault()
	      e.returnValue = false
	    }
	
	    if (!e.preventUpdate) {
	      el = item ? getImmediateCustomParentTag(ptag) : tag
	      el.update()
	    }
	
	  }
	
	}
	
	
	/**
	 * Insert a DOM node replacing another one (used by if- attribute)
	 * @param   { Object } root - parent node
	 * @param   { Object } node - node replaced
	 * @param   { Object } before - node added
	 */
	function insertTo(root, node, before) {
	  if (!root) return
	  root.insertBefore(before, node)
	  root.removeChild(node)
	}
	
	/**
	 * Update the expressions in a Tag instance
	 * @param   { Array } expressions - expression that must be re evaluated
	 * @param   { Tag } tag - tag instance
	 */
	function update(expressions, tag) {
	
	  each(expressions, function(expr, i) {
	
	    var dom = expr.dom,
	      attrName = expr.attr,
	      value = tmpl(expr.expr, tag),
	      parent = expr.dom.parentNode
	
	    if (expr.bool) {
	      value = !!value
	    } else if (value == null) {
	      value = ''
	    }
	
	    // #1638: regression of #1612, update the dom only if the value of the
	    // expression was changed
	    if (expr.value === value) {
	      return
	    }
	    expr.value = value
	
	    // textarea and text nodes has no attribute name
	    if (!attrName) {
	      // about #815 w/o replace: the browser converts the value to a string,
	      // the comparison by "==" does too, but not in the server
	      value += ''
	      // test for parent avoids error with invalid assignment to nodeValue
	      if (parent) {
	        if (parent.tagName === 'TEXTAREA') {
	          parent.value = value                    // #1113
	          if (!IE_VERSION) dom.nodeValue = value  // #1625 IE throws here, nodeValue
	        }                                         // will be available on 'updated'
	        else dom.nodeValue = value
	      }
	      return
	    }
	
	    // ~~#1612: look for changes in dom.value when updating the value~~
	    if (attrName === 'value') {
	      dom.value = value
	      return
	    }
	
	    // remove original attribute
	    remAttr(dom, attrName)
	
	    // event handler
	    if (isFunction(value)) {
	      setEventHandler(attrName, value, dom, tag)
	
	    // if- conditional
	    } else if (attrName == 'if') {
	      var stub = expr.stub,
	        add = function() { insertTo(stub.parentNode, stub, dom) },
	        remove = function() { insertTo(dom.parentNode, dom, stub) }
	
	      // add to DOM
	      if (value) {
	        if (stub) {
	          add()
	          dom.inStub = false
	          // avoid to trigger the mount event if the tags is not visible yet
	          // maybe we can optimize this avoiding to mount the tag at all
	          if (!isInStub(dom)) {
	            walk(dom, function(el) {
	              if (el._tag && !el._tag.isMounted)
	                el._tag.isMounted = !!el._tag.trigger('mount')
	            })
	          }
	        }
	      // remove from DOM
	      } else {
	        stub = expr.stub = stub || document.createTextNode('')
	        // if the parentNode is defined we can easily replace the tag
	        if (dom.parentNode)
	          remove()
	        // otherwise we need to wait the updated event
	        else (tag.parent || tag).one('updated', remove)
	
	        dom.inStub = true
	      }
	    // show / hide
	    } else if (attrName === 'show') {
	      dom.style.display = value ? '' : 'none'
	
	    } else if (attrName === 'hide') {
	      dom.style.display = value ? 'none' : ''
	
	    } else if (expr.bool) {
	      dom[attrName] = value
	      if (value) setAttr(dom, attrName, attrName)
	      if (FIREFOX && attrName === 'selected' && dom.tagName === 'OPTION') {
	        dom.__riot1374 = value   // #1374
	      }
	
	    } else if (value === 0 || value && typeof value !== T_OBJECT) {
	      // <img src="{ expr }">
	      if (startsWith(attrName, RIOT_PREFIX) && attrName != RIOT_TAG) {
	        attrName = attrName.slice(RIOT_PREFIX.length)
	      }
	      setAttr(dom, attrName, value)
	    }
	
	  })
	
	}
	/**
	 * Specialized function for looping an array-like collection with `each={}`
	 * @param   { Array } els - collection of items
	 * @param   {Function} fn - callback function
	 * @returns { Array } the array looped
	 */
	function each(els, fn) {
	  var len = els ? els.length : 0
	
	  for (var i = 0, el; i < len; i++) {
	    el = els[i]
	    // return false -> current item was removed by fn during the loop
	    if (el != null && fn(el, i) === false) i--
	  }
	  return els
	}
	
	/**
	 * Detect if the argument passed is a function
	 * @param   { * } v - whatever you want to pass to this function
	 * @returns { Boolean } -
	 */
	function isFunction(v) {
	  return typeof v === T_FUNCTION || false   // avoid IE problems
	}
	
	/**
	 * Detect if the argument passed is an object, exclude null.
	 * NOTE: Use isObject(x) && !isArray(x) to excludes arrays.
	 * @param   { * } v - whatever you want to pass to this function
	 * @returns { Boolean } -
	 */
	function isObject(v) {
	  return v && typeof v === T_OBJECT         // typeof null is 'object'
	}
	
	/**
	 * Remove any DOM attribute from a node
	 * @param   { Object } dom - DOM node we want to update
	 * @param   { String } name - name of the property we want to remove
	 */
	function remAttr(dom, name) {
	  dom.removeAttribute(name)
	}
	
	/**
	 * Convert a string containing dashes to camel case
	 * @param   { String } string - input string
	 * @returns { String } my-string -> myString
	 */
	function toCamel(string) {
	  return string.replace(/-(\w)/g, function(_, c) {
	    return c.toUpperCase()
	  })
	}
	
	/**
	 * Get the value of any DOM attribute on a node
	 * @param   { Object } dom - DOM node we want to parse
	 * @param   { String } name - name of the attribute we want to get
	 * @returns { String | undefined } name of the node attribute whether it exists
	 */
	function getAttr(dom, name) {
	  return dom.getAttribute(name)
	}
	
	/**
	 * Set any DOM attribute
	 * @param { Object } dom - DOM node we want to update
	 * @param { String } name - name of the property we want to set
	 * @param { String } val - value of the property we want to set
	 */
	function setAttr(dom, name, val) {
	  dom.setAttribute(name, val)
	}
	
	/**
	 * Detect the tag implementation by a DOM node
	 * @param   { Object } dom - DOM node we need to parse to get its tag implementation
	 * @returns { Object } it returns an object containing the implementation of a custom tag (template and boot function)
	 */
	function getTag(dom) {
	  return dom.tagName && __tagImpl[getAttr(dom, RIOT_TAG_IS) ||
	    getAttr(dom, RIOT_TAG) || dom.tagName.toLowerCase()]
	}
	/**
	 * Add a child tag to its parent into the `tags` object
	 * @param   { Object } tag - child tag instance
	 * @param   { String } tagName - key where the new tag will be stored
	 * @param   { Object } parent - tag instance where the new child tag will be included
	 */
	function addChildTag(tag, tagName, parent) {
	  var cachedTag = parent.tags[tagName]
	
	  // if there are multiple children tags having the same name
	  if (cachedTag) {
	    // if the parent tags property is not yet an array
	    // create it adding the first cached tag
	    if (!isArray(cachedTag))
	      // don't add the same tag twice
	      if (cachedTag !== tag)
	        parent.tags[tagName] = [cachedTag]
	    // add the new nested tag to the array
	    if (!contains(parent.tags[tagName], tag))
	      parent.tags[tagName].push(tag)
	  } else {
	    parent.tags[tagName] = tag
	  }
	}
	
	/**
	 * Move the position of a custom tag in its parent tag
	 * @param   { Object } tag - child tag instance
	 * @param   { String } tagName - key where the tag was stored
	 * @param   { Number } newPos - index where the new tag will be stored
	 */
	function moveChildTag(tag, tagName, newPos) {
	  var parent = tag.parent,
	    tags
	  // no parent no move
	  if (!parent) return
	
	  tags = parent.tags[tagName]
	
	  if (isArray(tags))
	    tags.splice(newPos, 0, tags.splice(tags.indexOf(tag), 1)[0])
	  else addChildTag(tag, tagName, parent)
	}
	
	/**
	 * Create a new child tag including it correctly into its parent
	 * @param   { Object } child - child tag implementation
	 * @param   { Object } opts - tag options containing the DOM node where the tag will be mounted
	 * @param   { String } innerHTML - inner html of the child node
	 * @param   { Object } parent - instance of the parent tag including the child custom tag
	 * @returns { Object } instance of the new child tag just created
	 */
	function initChildTag(child, opts, innerHTML, parent) {
	  var tag = new Tag(child, opts, innerHTML),
	    tagName = getTagName(opts.root),
	    ptag = getImmediateCustomParentTag(parent)
	  // fix for the parent attribute in the looped elements
	  tag.parent = ptag
	  // store the real parent tag
	  // in some cases this could be different from the custom parent tag
	  // for example in nested loops
	  tag._parent = parent
	
	  // add this tag to the custom parent tag
	  addChildTag(tag, tagName, ptag)
	  // and also to the real parent tag
	  if (ptag !== parent)
	    addChildTag(tag, tagName, parent)
	  // empty the child node once we got its template
	  // to avoid that its children get compiled multiple times
	  opts.root.innerHTML = ''
	
	  return tag
	}
	
	/**
	 * Loop backward all the parents tree to detect the first custom parent tag
	 * @param   { Object } tag - a Tag instance
	 * @returns { Object } the instance of the first custom parent tag found
	 */
	function getImmediateCustomParentTag(tag) {
	  var ptag = tag
	  while (!getTag(ptag.root)) {
	    if (!ptag.parent) break
	    ptag = ptag.parent
	  }
	  return ptag
	}
	
	/**
	 * Helper function to set an immutable property
	 * @param   { Object } el - object where the new property will be set
	 * @param   { String } key - object key where the new property will be stored
	 * @param   { * } value - value of the new property
	* @param   { Object } options - set the propery overriding the default options
	 * @returns { Object } - the initial object
	 */
	function defineProperty(el, key, value, options) {
	  Object.defineProperty(el, key, extend({
	    value: value,
	    enumerable: false,
	    writable: false,
	    configurable: true
	  }, options))
	  return el
	}
	
	/**
	 * Get the tag name of any DOM node
	 * @param   { Object } dom - DOM node we want to parse
	 * @returns { String } name to identify this dom node in riot
	 */
	function getTagName(dom) {
	  var child = getTag(dom),
	    namedTag = getAttr(dom, 'name'),
	    tagName = namedTag && !tmpl.hasExpr(namedTag) ?
	                namedTag :
	              child ? child.name : dom.tagName.toLowerCase()
	
	  return tagName
	}
	
	/**
	 * Extend any object with other properties
	 * @param   { Object } src - source object
	 * @returns { Object } the resulting extended object
	 *
	 * var obj = { foo: 'baz' }
	 * extend(obj, {bar: 'bar', foo: 'bar'})
	 * console.log(obj) => {bar: 'bar', foo: 'bar'}
	 *
	 */
	function extend(src) {
	  var obj, args = arguments
	  for (var i = 1; i < args.length; ++i) {
	    if (obj = args[i]) {
	      for (var key in obj) {
	        // check if this property of the source object could be overridden
	        if (isWritable(src, key))
	          src[key] = obj[key]
	      }
	    }
	  }
	  return src
	}
	
	/**
	 * Check whether an array contains an item
	 * @param   { Array } arr - target array
	 * @param   { * } item - item to test
	 * @returns { Boolean } Does 'arr' contain 'item'?
	 */
	function contains(arr, item) {
	  return ~arr.indexOf(item)
	}
	
	/**
	 * Check whether an object is a kind of array
	 * @param   { * } a - anything
	 * @returns {Boolean} is 'a' an array?
	 */
	function isArray(a) { return Array.isArray(a) || a instanceof Array }
	
	/**
	 * Detect whether a property of an object could be overridden
	 * @param   { Object }  obj - source object
	 * @param   { String }  key - object property
	 * @returns { Boolean } is this property writable?
	 */
	function isWritable(obj, key) {
	  var props = Object.getOwnPropertyDescriptor(obj, key)
	  return typeof obj[key] === T_UNDEF || props && props.writable
	}
	
	
	/**
	 * With this function we avoid that the internal Tag methods get overridden
	 * @param   { Object } data - options we want to use to extend the tag instance
	 * @returns { Object } clean object without containing the riot internal reserved words
	 */
	function cleanUpData(data) {
	  if (!(data instanceof Tag) && !(data && typeof data.trigger == T_FUNCTION))
	    return data
	
	  var o = {}
	  for (var key in data) {
	    if (!contains(RESERVED_WORDS_BLACKLIST, key))
	      o[key] = data[key]
	  }
	  return o
	}
	
	/**
	 * Walk down recursively all the children tags starting dom node
	 * @param   { Object }   dom - starting node where we will start the recursion
	 * @param   { Function } fn - callback to transform the child node just found
	 */
	function walk(dom, fn) {
	  if (dom) {
	    // stop the recursion
	    if (fn(dom) === false) return
	    else {
	      dom = dom.firstChild
	
	      while (dom) {
	        walk(dom, fn)
	        dom = dom.nextSibling
	      }
	    }
	  }
	}
	
	/**
	 * Minimize risk: only zero or one _space_ between attr & value
	 * @param   { String }   html - html string we want to parse
	 * @param   { Function } fn - callback function to apply on any attribute found
	 */
	function walkAttributes(html, fn) {
	  var m,
	    re = /([-\w]+) ?= ?(?:"([^"]*)|'([^']*)|({[^}]*}))/g
	
	  while (m = re.exec(html)) {
	    fn(m[1].toLowerCase(), m[2] || m[3] || m[4])
	  }
	}
	
	/**
	 * Check whether a DOM node is in stub mode, useful for the riot 'if' directive
	 * @param   { Object }  dom - DOM node we want to parse
	 * @returns { Boolean } -
	 */
	function isInStub(dom) {
	  while (dom) {
	    if (dom.inStub) return true
	    dom = dom.parentNode
	  }
	  return false
	}
	
	/**
	 * Create a generic DOM node
	 * @param   { String } name - name of the DOM node we want to create
	 * @returns { Object } DOM node just created
	 */
	function mkEl(name) {
	  return document.createElement(name)
	}
	
	/**
	 * Shorter and fast way to select multiple nodes in the DOM
	 * @param   { String } selector - DOM selector
	 * @param   { Object } ctx - DOM node where the targets of our search will is located
	 * @returns { Object } dom nodes found
	 */
	function $$(selector, ctx) {
	  return (ctx || document).querySelectorAll(selector)
	}
	
	/**
	 * Shorter and fast way to select a single node in the DOM
	 * @param   { String } selector - unique dom selector
	 * @param   { Object } ctx - DOM node where the target of our search will is located
	 * @returns { Object } dom node found
	 */
	function $(selector, ctx) {
	  return (ctx || document).querySelector(selector)
	}
	
	/**
	 * Simple object prototypal inheritance
	 * @param   { Object } parent - parent object
	 * @returns { Object } child instance
	 */
	function inherit(parent) {
	  function Child() {}
	  Child.prototype = parent
	  return new Child()
	}
	
	/**
	 * Get the name property needed to identify a DOM node in riot
	 * @param   { Object } dom - DOM node we need to parse
	 * @returns { String | undefined } give us back a string to identify this dom node
	 */
	function getNamedKey(dom) {
	  return getAttr(dom, 'id') || getAttr(dom, 'name')
	}
	
	/**
	 * Set the named properties of a tag element
	 * @param { Object } dom - DOM node we need to parse
	 * @param { Object } parent - tag instance where the named dom element will be eventually added
	 * @param { Array } keys - list of all the tag instance properties
	 */
	function setNamed(dom, parent, keys) {
	  // get the key value we want to add to the tag instance
	  var key = getNamedKey(dom),
	    isArr,
	    // add the node detected to a tag instance using the named property
	    add = function(value) {
	      // avoid to override the tag properties already set
	      if (contains(keys, key)) return
	      // check whether this value is an array
	      isArr = isArray(value)
	      // if the key was never set
	      if (!value)
	        // set it once on the tag instance
	        parent[key] = dom
	      // if it was an array and not yet set
	      else if (!isArr || isArr && !contains(value, dom)) {
	        // add the dom node into the array
	        if (isArr)
	          value.push(dom)
	        else
	          parent[key] = [value, dom]
	      }
	    }
	
	  // skip the elements with no named properties
	  if (!key) return
	
	  // check whether this key has been already evaluated
	  if (tmpl.hasExpr(key))
	    // wait the first updated event only once
	    parent.one('mount', function() {
	      key = getNamedKey(dom)
	      add(parent[key])
	    })
	  else
	    add(parent[key])
	
	}
	
	/**
	 * Faster String startsWith alternative
	 * @param   { String } src - source string
	 * @param   { String } str - test string
	 * @returns { Boolean } -
	 */
	function startsWith(src, str) {
	  return src.slice(0, str.length) === str
	}
	
	/**
	 * requestAnimationFrame function
	 * Adapted from https://gist.github.com/paulirish/1579671, license MIT
	 */
	var rAF = (function (w) {
	  var raf = w.requestAnimationFrame    ||
	            w.mozRequestAnimationFrame || w.webkitRequestAnimationFrame
	
	  if (!raf || /iP(ad|hone|od).*OS 6/.test(w.navigator.userAgent)) {  // buggy iOS6
	    var lastTime = 0
	
	    raf = function (cb) {
	      var nowtime = Date.now(), timeout = Math.max(16 - (nowtime - lastTime), 0)
	      setTimeout(function () { cb(lastTime = nowtime + timeout) }, timeout)
	    }
	  }
	  return raf
	
	})(window || {})
	
	/**
	 * Mount a tag creating new Tag instance
	 * @param   { Object } root - dom node where the tag will be mounted
	 * @param   { String } tagName - name of the riot tag we want to mount
	 * @param   { Object } opts - options to pass to the Tag instance
	 * @returns { Tag } a new Tag instance
	 */
	function mountTo(root, tagName, opts) {
	  var tag = __tagImpl[tagName],
	    // cache the inner HTML to fix #855
	    innerHTML = root._innerHTML = root._innerHTML || root.innerHTML
	
	  // clear the inner html
	  root.innerHTML = ''
	
	  if (tag && root) tag = new Tag(tag, { root: root, opts: opts }, innerHTML)
	
	  if (tag && tag.mount) {
	    tag.mount()
	    // add this tag to the virtualDom variable
	    if (!contains(__virtualDom, tag)) __virtualDom.push(tag)
	  }
	
	  return tag
	}
	/**
	 * Riot public api
	 */
	
	// share methods for other riot parts, e.g. compiler
	riot.util = { brackets: brackets, tmpl: tmpl }
	
	/**
	 * Create a mixin that could be globally shared across all the tags
	 */
	riot.mixin = (function() {
	  var mixins = {}
	
	  /**
	   * Create/Return a mixin by its name
	   * @param   { String } name - mixin name (global mixin if missing)
	   * @param   { Object } mixin - mixin logic
	   * @returns { Object } the mixin logic
	   */
	  return function(name, mixin) {
	    if (isObject(name)) {
	      mixin = name
	      mixins[GLOBAL_MIXIN] = extend(mixins[GLOBAL_MIXIN] || {}, mixin)
	      return
	    }
	
	    if (!mixin) return mixins[name]
	    mixins[name] = mixin
	  }
	
	})()
	
	/**
	 * Create a new riot tag implementation
	 * @param   { String }   name - name/id of the new riot tag
	 * @param   { String }   html - tag template
	 * @param   { String }   css - custom tag css
	 * @param   { String }   attrs - root tag attributes
	 * @param   { Function } fn - user function
	 * @returns { String } name/id of the tag just created
	 */
	riot.tag = function(name, html, css, attrs, fn) {
	  if (isFunction(attrs)) {
	    fn = attrs
	    if (/^[\w\-]+\s?=/.test(css)) {
	      attrs = css
	      css = ''
	    } else attrs = ''
	  }
	  if (css) {
	    if (isFunction(css)) fn = css
	    else styleManager.add(css)
	  }
	  name = name.toLowerCase()
	  __tagImpl[name] = { name: name, tmpl: html, attrs: attrs, fn: fn }
	  return name
	}
	
	/**
	 * Create a new riot tag implementation (for use by the compiler)
	 * @param   { String }   name - name/id of the new riot tag
	 * @param   { String }   html - tag template
	 * @param   { String }   css - custom tag css
	 * @param   { String }   attrs - root tag attributes
	 * @param   { Function } fn - user function
	 * @returns { String } name/id of the tag just created
	 */
	riot.tag2 = function(name, html, css, attrs, fn) {
	  if (css) styleManager.add(css)
	  //if (bpair) riot.settings.brackets = bpair
	  __tagImpl[name] = { name: name, tmpl: html, attrs: attrs, fn: fn }
	  return name
	}
	
	/**
	 * Mount a tag using a specific tag implementation
	 * @param   { String } selector - tag DOM selector
	 * @param   { String } tagName - tag implementation name
	 * @param   { Object } opts - tag logic
	 * @returns { Array } new tags instances
	 */
	riot.mount = function(selector, tagName, opts) {
	
	  var els,
	    allTags,
	    tags = []
	
	  // helper functions
	
	  function addRiotTags(arr) {
	    var list = ''
	    each(arr, function (e) {
	      if (!/[^-\w]/.test(e)) {
	        e = e.trim().toLowerCase()
	        list += ',[' + RIOT_TAG_IS + '="' + e + '"],[' + RIOT_TAG + '="' + e + '"]'
	      }
	    })
	    return list
	  }
	
	  function selectAllTags() {
	    var keys = Object.keys(__tagImpl)
	    return keys + addRiotTags(keys)
	  }
	
	  function pushTags(root) {
	    if (root.tagName) {
	      var riotTag = getAttr(root, RIOT_TAG_IS) || getAttr(root, RIOT_TAG)
	
	      // have tagName? force riot-tag to be the same
	      if (tagName && riotTag !== tagName) {
	        riotTag = tagName
	        setAttr(root, RIOT_TAG_IS, tagName)
	        setAttr(root, RIOT_TAG, tagName) // this will be removed in riot 3.0.0
	      }
	      var tag = mountTo(root, riotTag || root.tagName.toLowerCase(), opts)
	
	      if (tag) tags.push(tag)
	    } else if (root.length) {
	      each(root, pushTags)   // assume nodeList
	    }
	  }
	
	  // ----- mount code -----
	
	  // inject styles into DOM
	  styleManager.inject()
	
	  if (isObject(tagName)) {
	    opts = tagName
	    tagName = 0
	  }
	
	  // crawl the DOM to find the tag
	  if (typeof selector === T_STRING) {
	    if (selector === '*')
	      // select all the tags registered
	      // and also the tags found with the riot-tag attribute set
	      selector = allTags = selectAllTags()
	    else
	      // or just the ones named like the selector
	      selector += addRiotTags(selector.split(/, */))
	
	    // make sure to pass always a selector
	    // to the querySelectorAll function
	    els = selector ? $$(selector) : []
	  }
	  else
	    // probably you have passed already a tag or a NodeList
	    els = selector
	
	  // select all the registered and mount them inside their root elements
	  if (tagName === '*') {
	    // get all custom tags
	    tagName = allTags || selectAllTags()
	    // if the root els it's just a single tag
	    if (els.tagName)
	      els = $$(tagName, els)
	    else {
	      // select all the children for all the different root elements
	      var nodeList = []
	      each(els, function (_el) {
	        nodeList.push($$(tagName, _el))
	      })
	      els = nodeList
	    }
	    // get rid of the tagName
	    tagName = 0
	  }
	
	  pushTags(els)
	
	  return tags
	}
	
	/**
	 * Update all the tags instances created
	 * @returns { Array } all the tags instances
	 */
	riot.update = function() {
	  return each(__virtualDom, function(tag) {
	    tag.update()
	  })
	}
	
	/**
	 * Export the Virtual DOM
	 */
	riot.vdom = __virtualDom
	
	/**
	 * Export the Tag constructor
	 */
	riot.Tag = Tag
	  // support CommonJS, AMD & browser
	  /* istanbul ignore next */
	  if (typeof exports === T_OBJECT)
	    module.exports = riot
	  else if ("function" === T_FUNCTION && typeof __webpack_require__(14) !== T_UNDEF)
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return riot }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
	  else
	    window.riot = riot
	
	})(typeof window != 'undefined' ? window : void 0);


/***/ },
/* 14 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;
	
	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {riot.tag2('app', '<video class="background-video" src="assets/inexor.mp4" autoplay loop></video> <main layout="row"> <navigation flex="15"></navigation> <section flex="85" class="ui" flex-offset="15"> <h1>{title}</h1> <div> <div layout="row" layout-align="space-between"> <div layout="column" class="name"> <span>Misan</span> <span>mX</span> </div> <img class="avatar" src="" alt=""> </div> <div layout="row"> <div class="last server"> <h5>Last maps:</h5> <div layout="row" layout-wrap> <div layout-align="center center" layout="column" class="map" each="{map in maps}"> {map} </div> </div> </div> <img src="" alt=""> </div> </div> </section> </main>', '', '', function(opts) {
	
	
	    this.maps = [
	        'km',
	        'xenon',
	        'tempest',
	        'igcstuff',
	        'letters',
	        'mxhq',
	        'naziraid',
	    ]
	
	    this.title = 'Player'
	
	    this.on('mount', () => {
	
	        riot.route.start(true)
	        riot.route((name) => {
	            this.title = name
	            this.update()
	
	        })
	    })
	
	});
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {riot.tag2('navigation', '<nav> <ul layout="column"> <li onclick="{select}" flex-end="{item.order==\'end\'}" each="{item in items}"> <i class="fa fa-{item.icon}"></i>{item.title} </li> </ul> </nav>', '', '', function(opts) {
	    this.items = [
	        {
	            icon: 'gamepad',
	            title: 'Player'
	        },
	        {
	            icon: 'server',
	            title: 'Server'
	        },
	        {
	            icon: 'cubes',
	            title: 'Content'
	        },
	        {
	            icon: 'trophy',
	            title: 'Game'
	        },
	        {
	            icon: 'cogs',
	            title: 'Settings',
	            order: 'end'
	        },
	    ]
	
	    this.select = function(e) {
	        riot.route(e.item.item.title)
	    }.bind(this)
	});
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(18);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(21)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/less-loader/index.js!./main.less", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/less-loader/index.js!./main.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(19)();
	// imports
	exports.push([module.id, "@import url(https://fonts.googleapis.com/css?family=Coming+Soon);", ""]);
	
	// module
	exports.push([module.id, "/* ========================================\n    VENDOR\n   ======================================== */\n/*\n *  Responsive attributes\n *\n *  References:\n *  1) https://scotch.io/tutorials/a-visual-guide-to-css3-flexbox-properties#flex\n *  2) https://css-tricks.com/almanac/properties/f/flex/\n *  3) https://css-tricks.com/snippets/css/a-guide-to-flexbox/\n *  4) https://github.com/philipwalton/flexbugs#3-min-height-on-a-flex-container-wont-apply-to-its-flex-items\n *  5) http://godban.com.ua/projects/flexgrid\n *\n */\n/*\n * move them into layouts_for_breakpoint to have them\n * generated\n * for our use case, offsets and layout-align is not\n * needed for the website - thus generating less CSS.\n */\n[flex-end] {\n  margin-top: auto;\n}\n[flex-offset=\"0\"] {\n  margin-left: 0%;\n}\n[flex-offset=\"5\"] {\n  margin-left: 5%;\n}\n[flex-offset=\"10\"] {\n  margin-left: 10%;\n}\n[flex-offset=\"15\"] {\n  margin-left: 15%;\n}\n[flex-offset=\"20\"] {\n  margin-left: 20%;\n}\n[flex-offset=\"25\"] {\n  margin-left: 25%;\n}\n[flex-offset=\"30\"] {\n  margin-left: 30%;\n}\n[flex-offset=\"35\"] {\n  margin-left: 35%;\n}\n[flex-offset=\"40\"] {\n  margin-left: 40%;\n}\n[flex-offset=\"45\"] {\n  margin-left: 45%;\n}\n[flex-offset=\"50\"] {\n  margin-left: 50%;\n}\n[flex-offset=\"55\"] {\n  margin-left: 55%;\n}\n[flex-offset=\"60\"] {\n  margin-left: 60%;\n}\n[flex-offset=\"65\"] {\n  margin-left: 65%;\n}\n[flex-offset=\"70\"] {\n  margin-left: 70%;\n}\n[flex-offset=\"75\"] {\n  margin-left: 75%;\n}\n[flex-offset=\"80\"] {\n  margin-left: 80%;\n}\n[flex-offset=\"85\"] {\n  margin-left: 85%;\n}\n[flex-offset=\"90\"] {\n  margin-left: 90%;\n}\n[flex-offset=\"95\"] {\n  margin-left: 95%;\n}\n[flex-offset=\"33\"] {\n  margin-left: calc(33.33333333%);\n}\n[flex-offset=\"66\"] {\n  margin-left: calc(66.66666667%);\n}\n[layout-align],\n[layout-align=\"start stretch\"] {\n  justify-content: flex-start;\n  align-content: stretch;\n  align-items: stretch;\n}\n[layout-align=\"start\"],\n[layout-align=\"start start\"],\n[layout-align=\"start center\"],\n[layout-align=\"start end\"],\n[layout-align=\"start stretch\"] {\n  justify-content: flex-start;\n}\n[layout-align=\"center\"],\n[layout-align=\"center start\"],\n[layout-align=\"center center\"],\n[layout-align=\"center end\"],\n[layout-align=\"center stretch\"] {\n  justify-content: center;\n}\n[layout-align=\"end\"],\n[layout-align=\"end center\"],\n[layout-align=\"end start\"],\n[layout-align=\"end end\"],\n[layout-align=\"end stretch\"] {\n  justify-content: flex-end;\n}\n[layout-align=\"space-around\"],\n[layout-align=\"space-around center\"],\n[layout-align=\"space-around start\"],\n[layout-align=\"space-around end\"],\n[layout-align=\"space-around stretch\"] {\n  justify-content: space-around;\n}\n[layout-align=\"space-between\"],\n[layout-align=\"space-between center\"],\n[layout-align=\"space-between start\"],\n[layout-align=\"space-between end\"],\n[layout-align=\"space-between stretch\"] {\n  justify-content: space-between;\n}\n[layout-align=\"start start\"],\n[layout-align=\"center start\"],\n[layout-align=\"end start\"],\n[layout-align=\"space-between start\"],\n[layout-align=\"space-around start\"] {\n  align-items: flex-start;\n  align-content: flex-start;\n}\n[layout-align=\"start center\"],\n[layout-align=\"center center\"],\n[layout-align=\"end center\"],\n[layout-align=\"space-between center\"],\n[layout-align=\"space-around center\"] {\n  align-items: center;\n  align-content: center;\n  max-width: 100%;\n}\n[layout-align=\"start center\"] > *,\n[layout-align=\"center center\"] > *,\n[layout-align=\"end center\"] > *,\n[layout-align=\"space-between center\"] > *,\n[layout-align=\"space-around center\"] > * {\n  max-width: 100%;\n}\n[layout-align=\"start end\"],\n[layout-align=\"center end\"],\n[layout-align=\"end end\"],\n[layout-align=\"space-between end\"],\n[layout-align=\"space-around end\"] {\n  align-items: flex-end;\n  align-content: flex-end;\n}\n[layout-align=\"start stretch\"],\n[layout-align=\"center stretch\"],\n[layout-align=\"end stretch\"],\n[layout-align=\"space-between stretch\"],\n[layout-align=\"space-around stretch\"] {\n  align-items: stretch;\n  align-content: stretch;\n}\n/*\n *  Apply Mixins to create Layout/Flexbox styles\n *\n */\n[layout-padding] > [flex-sm],\n[layout-padding] > [flex-lt-md] {\n  padding: 0.5em;\n}\n[layout-padding],\n[layout-padding] > [flex],\n[layout-padding] > [flex-gt-sm],\n[layout-padding] > [flex-md],\n[layout-padding] > [flex-lt-lg] {\n  padding: 1em;\n}\n[layout-padding] > [flex-gt-md],\n[layout-padding] > [flex-lg] {\n  padding: 2em;\n}\n[layout-margin] > [flex-sm],\n[layout-margin] > [flex-lt-md] {\n  margin: 0.5em;\n}\n[layout-margin],\n[layout-margin] > [flex],\n[layout-margin] > [flex-gt-sm],\n[layout-margin] > [flex-md],\n[layout-margin] > [flex-lt-lg] {\n  margin: 1em;\n}\n[layout-margin] > [flex-gt-md],\n[layout-margin] > [flex-lg] {\n  margin: 2em;\n}\n[layout-wrap] {\n  flex-wrap: wrap;\n}\n[layout-nowrap] {\n  flex-wrap: nowrap;\n}\n[layout-fill] {\n  margin: 0;\n  width: 100%;\n  min-height: 100%;\n  height: 100%;\n}\n[flex-order=\"0\"] {\n  order: 0;\n}\n[flex-order=\"1\"] {\n  order: 1;\n}\n[flex-order=\"2\"] {\n  order: 2;\n}\n[flex-order=\"3\"] {\n  order: 3;\n}\n[flex-order=\"4\"] {\n  order: 4;\n}\n[flex-order=\"5\"] {\n  order: 5;\n}\n[flex-order=\"6\"] {\n  order: 6;\n}\n[flex-order=\"7\"] {\n  order: 7;\n}\n[flex-order=\"8\"] {\n  order: 8;\n}\n[flex-order=\"9\"] {\n  order: 9;\n}\n[flex-order=\"10\"] {\n  order: 10;\n}\n[flex-order=\"11\"] {\n  order: 11;\n}\n[flex-order=\"12\"] {\n  order: 12;\n}\n[flex-order=\"13\"] {\n  order: 13;\n}\n[flex-order=\"14\"] {\n  order: 14;\n}\n[flex-order=\"15\"] {\n  order: 15;\n}\n[flex-order=\"16\"] {\n  order: 16;\n}\n[flex-order=\"17\"] {\n  order: 17;\n}\n[flex-order=\"18\"] {\n  order: 18;\n}\n[flex-order=\"19\"] {\n  order: 19;\n}\n[flex-order=\"20\"] {\n  order: 20;\n}\n[flex] {\n  flex: 1;\n}\n[flex-grow] {\n  flex: 1 1 100%;\n  box-sizing: border-box;\n}\n[flex-initial] {\n  flex: 0 1 auto;\n  box-sizing: border-box;\n}\n[flex-auto] {\n  flex: 1 1 auto;\n  box-sizing: border-box;\n}\n[flex-none] {\n  flex: 0 0 auto;\n  box-sizing: border-box;\n}\n[flex],\n[layout=\"row\"] > [flex],\n[layout=\"row\"] > [flex] {\n  max-height: 100%;\n}\n[layout=\"column\"] > [flex],\n[layout=\"column\"] > [flex] {\n  max-width: 100%;\n}\n[flex=\"5\"] {\n  flex: 1 1 5%;\n  max-width: 5%;\n}\n[layout=\"row\"] > [flex=\"5\"],\n[layout=\"row\"] > [flex=\"5\"] {\n  flex: 1 1 5%;\n  max-width: 5%;\n}\n[layout=\"column\"] > [flex=\"5\"],\n[layout=\"column\"] > [flex=\"5\"] {\n  flex: 1 1 5%;\n  max-height: 5%;\n}\n[flex=\"10\"] {\n  flex: 1 1 10%;\n  max-width: 10%;\n}\n[layout=\"row\"] > [flex=\"10\"],\n[layout=\"row\"] > [flex=\"10\"] {\n  flex: 1 1 10%;\n  max-width: 10%;\n}\n[layout=\"column\"] > [flex=\"10\"],\n[layout=\"column\"] > [flex=\"10\"] {\n  flex: 1 1 10%;\n  max-height: 10%;\n}\n[flex=\"15\"] {\n  flex: 1 1 15%;\n  max-width: 15%;\n}\n[layout=\"row\"] > [flex=\"15\"],\n[layout=\"row\"] > [flex=\"15\"] {\n  flex: 1 1 15%;\n  max-width: 15%;\n}\n[layout=\"column\"] > [flex=\"15\"],\n[layout=\"column\"] > [flex=\"15\"] {\n  flex: 1 1 15%;\n  max-height: 15%;\n}\n[flex=\"20\"] {\n  flex: 1 1 20%;\n  max-width: 20%;\n}\n[layout=\"row\"] > [flex=\"20\"],\n[layout=\"row\"] > [flex=\"20\"] {\n  flex: 1 1 20%;\n  max-width: 20%;\n}\n[layout=\"column\"] > [flex=\"20\"],\n[layout=\"column\"] > [flex=\"20\"] {\n  flex: 1 1 20%;\n  max-height: 20%;\n}\n[flex=\"25\"] {\n  flex: 1 1 25%;\n  max-width: 25%;\n}\n[layout=\"row\"] > [flex=\"25\"],\n[layout=\"row\"] > [flex=\"25\"] {\n  flex: 1 1 25%;\n  max-width: 25%;\n}\n[layout=\"column\"] > [flex=\"25\"],\n[layout=\"column\"] > [flex=\"25\"] {\n  flex: 1 1 25%;\n  max-height: 25%;\n}\n[flex=\"30\"] {\n  flex: 1 1 30%;\n  max-width: 30%;\n}\n[layout=\"row\"] > [flex=\"30\"],\n[layout=\"row\"] > [flex=\"30\"] {\n  flex: 1 1 30%;\n  max-width: 30%;\n}\n[layout=\"column\"] > [flex=\"30\"],\n[layout=\"column\"] > [flex=\"30\"] {\n  flex: 1 1 30%;\n  max-height: 30%;\n}\n[flex=\"35\"] {\n  flex: 1 1 35%;\n  max-width: 35%;\n}\n[layout=\"row\"] > [flex=\"35\"],\n[layout=\"row\"] > [flex=\"35\"] {\n  flex: 1 1 35%;\n  max-width: 35%;\n}\n[layout=\"column\"] > [flex=\"35\"],\n[layout=\"column\"] > [flex=\"35\"] {\n  flex: 1 1 35%;\n  max-height: 35%;\n}\n[flex=\"40\"] {\n  flex: 1 1 40%;\n  max-width: 40%;\n}\n[layout=\"row\"] > [flex=\"40\"],\n[layout=\"row\"] > [flex=\"40\"] {\n  flex: 1 1 40%;\n  max-width: 40%;\n}\n[layout=\"column\"] > [flex=\"40\"],\n[layout=\"column\"] > [flex=\"40\"] {\n  flex: 1 1 40%;\n  max-height: 40%;\n}\n[flex=\"45\"] {\n  flex: 1 1 45%;\n  max-width: 45%;\n}\n[layout=\"row\"] > [flex=\"45\"],\n[layout=\"row\"] > [flex=\"45\"] {\n  flex: 1 1 45%;\n  max-width: 45%;\n}\n[layout=\"column\"] > [flex=\"45\"],\n[layout=\"column\"] > [flex=\"45\"] {\n  flex: 1 1 45%;\n  max-height: 45%;\n}\n[flex=\"50\"] {\n  flex: 1 1 50%;\n  max-width: 50%;\n}\n[layout=\"row\"] > [flex=\"50\"],\n[layout=\"row\"] > [flex=\"50\"] {\n  flex: 1 1 50%;\n  max-width: 50%;\n}\n[layout=\"column\"] > [flex=\"50\"],\n[layout=\"column\"] > [flex=\"50\"] {\n  flex: 1 1 50%;\n  max-height: 50%;\n}\n[flex=\"55\"] {\n  flex: 1 1 55%;\n  max-width: 55%;\n}\n[layout=\"row\"] > [flex=\"55\"],\n[layout=\"row\"] > [flex=\"55\"] {\n  flex: 1 1 55%;\n  max-width: 55%;\n}\n[layout=\"column\"] > [flex=\"55\"],\n[layout=\"column\"] > [flex=\"55\"] {\n  flex: 1 1 55%;\n  max-height: 55%;\n}\n[flex=\"60\"] {\n  flex: 1 1 60%;\n  max-width: 60%;\n}\n[layout=\"row\"] > [flex=\"60\"],\n[layout=\"row\"] > [flex=\"60\"] {\n  flex: 1 1 60%;\n  max-width: 60%;\n}\n[layout=\"column\"] > [flex=\"60\"],\n[layout=\"column\"] > [flex=\"60\"] {\n  flex: 1 1 60%;\n  max-height: 60%;\n}\n[flex=\"65\"] {\n  flex: 1 1 65%;\n  max-width: 65%;\n}\n[layout=\"row\"] > [flex=\"65\"],\n[layout=\"row\"] > [flex=\"65\"] {\n  flex: 1 1 65%;\n  max-width: 65%;\n}\n[layout=\"column\"] > [flex=\"65\"],\n[layout=\"column\"] > [flex=\"65\"] {\n  flex: 1 1 65%;\n  max-height: 65%;\n}\n[flex=\"70\"] {\n  flex: 1 1 70%;\n  max-width: 70%;\n}\n[layout=\"row\"] > [flex=\"70\"],\n[layout=\"row\"] > [flex=\"70\"] {\n  flex: 1 1 70%;\n  max-width: 70%;\n}\n[layout=\"column\"] > [flex=\"70\"],\n[layout=\"column\"] > [flex=\"70\"] {\n  flex: 1 1 70%;\n  max-height: 70%;\n}\n[flex=\"75\"] {\n  flex: 1 1 75%;\n  max-width: 75%;\n}\n[layout=\"row\"] > [flex=\"75\"],\n[layout=\"row\"] > [flex=\"75\"] {\n  flex: 1 1 75%;\n  max-width: 75%;\n}\n[layout=\"column\"] > [flex=\"75\"],\n[layout=\"column\"] > [flex=\"75\"] {\n  flex: 1 1 75%;\n  max-height: 75%;\n}\n[flex=\"80\"] {\n  flex: 1 1 80%;\n  max-width: 80%;\n}\n[layout=\"row\"] > [flex=\"80\"],\n[layout=\"row\"] > [flex=\"80\"] {\n  flex: 1 1 80%;\n  max-width: 80%;\n}\n[layout=\"column\"] > [flex=\"80\"],\n[layout=\"column\"] > [flex=\"80\"] {\n  flex: 1 1 80%;\n  max-height: 80%;\n}\n[flex=\"85\"] {\n  flex: 1 1 85%;\n  max-width: 85%;\n}\n[layout=\"row\"] > [flex=\"85\"],\n[layout=\"row\"] > [flex=\"85\"] {\n  flex: 1 1 85%;\n  max-width: 85%;\n}\n[layout=\"column\"] > [flex=\"85\"],\n[layout=\"column\"] > [flex=\"85\"] {\n  flex: 1 1 85%;\n  max-height: 85%;\n}\n[flex=\"90\"] {\n  flex: 1 1 90%;\n  max-width: 90%;\n}\n[layout=\"row\"] > [flex=\"90\"],\n[layout=\"row\"] > [flex=\"90\"] {\n  flex: 1 1 90%;\n  max-width: 90%;\n}\n[layout=\"column\"] > [flex=\"90\"],\n[layout=\"column\"] > [flex=\"90\"] {\n  flex: 1 1 90%;\n  max-height: 90%;\n}\n[flex=\"95\"] {\n  flex: 1 1 95%;\n  max-width: 95%;\n}\n[layout=\"row\"] > [flex=\"95\"],\n[layout=\"row\"] > [flex=\"95\"] {\n  flex: 1 1 95%;\n  max-width: 95%;\n}\n[layout=\"column\"] > [flex=\"95\"],\n[layout=\"column\"] > [flex=\"95\"] {\n  flex: 1 1 95%;\n  max-height: 95%;\n}\n[flex=\"100\"] {\n  flex: 1 1 100%;\n  max-width: 100%;\n}\n[layout=\"row\"] > [flex=\"100\"],\n[layout=\"row\"] > [flex=\"100\"] {\n  flex: 1 1 100%;\n  max-width: 100%;\n}\n[layout=\"column\"] > [flex=\"100\"],\n[layout=\"column\"] > [flex=\"100\"] {\n  flex: 1 1 100%;\n  max-height: 100%;\n}\n[layout=\"row\"] > [flex=\"33\"],\n[layout=\"row\"] > [flex=\"33\"],\n[layout=\"row\"] > [flex=\"33\"],\n[layout=\"row\"] > [flex=\"33\"] {\n  flex: 1 1 33.33%;\n  max-width: 33.33%;\n}\n[layout=\"row\"] > [flex=\"66\"],\n[layout=\"row\"] > [flex=\"66\"],\n[layout=\"row\"] > [flex=\"66\"],\n[layout=\"row\"] > [flex=\"66\"] {\n  flex: 1 1 66.66%;\n  max-width: 66.66%;\n}\n[layout=\"column\"] > [flex=\"33\"],\n[layout=\"column\"] > [flex=\"33\"],\n[layout=\"column\"] > [flex=\"33\"],\n[layout=\"column\"] > [flex=\"33\"] {\n  flex: 1 1 33.33%;\n  max-height: 33.33%;\n}\n[layout=\"column\"] > [flex=\"66\"],\n[layout=\"column\"] > [flex=\"66\"],\n[layout=\"column\"] > [flex=\"66\"],\n[layout=\"column\"] > [flex=\"66\"] {\n  flex: 1 1 66.66%;\n  max-height: 66.66%;\n}\n[layout] {\n  display: flex;\n  flex-wrap: wrap;\n}\n[layout=\"column\"] {\n  flex-direction: column;\n}\n[layout=\"row\"] {\n  flex-direction: row;\n}\n/**\n * `hide-gt-sm show-gt-lg` should hide from 600px to 1200px\n * `show-md hide-gt-sm` should show from 0px to 960px and hide at >960px\n * `hide-gt-md show-gt-sm` should show everywhere (show overrides hide)`\n *  hide means hide everywhere\n */\n@media (max-width: 599px) {\n  [hide]:not([show-gt-xs]):not([show-sm]):not([show]),\n  [hide-gt-xs]:not([show-gt-xs]):not([show-sm]):not([show]) {\n    display: none;\n  }\n  [hide-sm]:not([show-gt-xs]):not([show-sm]):not([show]) {\n    display: none;\n  }\n  [flex-order-sm=\"0\"] {\n    order: 0;\n  }\n  [flex-order-sm=\"1\"] {\n    order: 1;\n  }\n  [flex-order-sm=\"2\"] {\n    order: 2;\n  }\n  [flex-order-sm=\"3\"] {\n    order: 3;\n  }\n  [flex-order-sm=\"4\"] {\n    order: 4;\n  }\n  [flex-order-sm=\"5\"] {\n    order: 5;\n  }\n  [flex-order-sm=\"6\"] {\n    order: 6;\n  }\n  [flex-order-sm=\"7\"] {\n    order: 7;\n  }\n  [flex-order-sm=\"8\"] {\n    order: 8;\n  }\n  [flex-order-sm=\"9\"] {\n    order: 9;\n  }\n  [flex-order-sm=\"10\"] {\n    order: 10;\n  }\n  [flex-order-sm=\"11\"] {\n    order: 11;\n  }\n  [flex-order-sm=\"12\"] {\n    order: 12;\n  }\n  [flex-order-sm=\"13\"] {\n    order: 13;\n  }\n  [flex-order-sm=\"14\"] {\n    order: 14;\n  }\n  [flex-order-sm=\"15\"] {\n    order: 15;\n  }\n  [flex-order-sm=\"16\"] {\n    order: 16;\n  }\n  [flex-order-sm=\"17\"] {\n    order: 17;\n  }\n  [flex-order-sm=\"18\"] {\n    order: 18;\n  }\n  [flex-order-sm=\"19\"] {\n    order: 19;\n  }\n  [flex-order-sm=\"20\"] {\n    order: 20;\n  }\n  [flex-sm] {\n    flex: 1;\n  }\n  [flex-sm-grow] {\n    flex: 1 1 100%;\n    box-sizing: border-box;\n  }\n  [flex-sm-initial] {\n    flex: 0 1 auto;\n    box-sizing: border-box;\n  }\n  [flex-sm-auto] {\n    flex: 1 1 auto;\n    box-sizing: border-box;\n  }\n  [flex-sm-none] {\n    flex: 0 0 auto;\n    box-sizing: border-box;\n  }\n  [flex-sm],\n  [layout=\"row\"] > [flex-sm],\n  [layout-sm=\"row\"] > [flex-sm] {\n    max-height: 100%;\n  }\n  [layout-sm=\"column\"] > [flex-sm],\n  [layout=\"column\"] > [flex-sm] {\n    max-width: 100%;\n  }\n  [flex-sm=\"5\"] {\n    flex: 1 1 5%;\n    max-width: 5%;\n  }\n  [layout=\"row\"] > [flex-sm=\"5\"],\n  [layout-sm=\"row\"] > [flex-sm=\"5\"] {\n    flex: 1 1 5%;\n    max-width: 5%;\n  }\n  [layout=\"column\"] > [flex-sm=\"5\"],\n  [layout-sm=\"column\"] > [flex-sm=\"5\"] {\n    flex: 1 1 5%;\n    max-height: 5%;\n  }\n  [flex-sm=\"10\"] {\n    flex: 1 1 10%;\n    max-width: 10%;\n  }\n  [layout=\"row\"] > [flex-sm=\"10\"],\n  [layout-sm=\"row\"] > [flex-sm=\"10\"] {\n    flex: 1 1 10%;\n    max-width: 10%;\n  }\n  [layout=\"column\"] > [flex-sm=\"10\"],\n  [layout-sm=\"column\"] > [flex-sm=\"10\"] {\n    flex: 1 1 10%;\n    max-height: 10%;\n  }\n  [flex-sm=\"15\"] {\n    flex: 1 1 15%;\n    max-width: 15%;\n  }\n  [layout=\"row\"] > [flex-sm=\"15\"],\n  [layout-sm=\"row\"] > [flex-sm=\"15\"] {\n    flex: 1 1 15%;\n    max-width: 15%;\n  }\n  [layout=\"column\"] > [flex-sm=\"15\"],\n  [layout-sm=\"column\"] > [flex-sm=\"15\"] {\n    flex: 1 1 15%;\n    max-height: 15%;\n  }\n  [flex-sm=\"20\"] {\n    flex: 1 1 20%;\n    max-width: 20%;\n  }\n  [layout=\"row\"] > [flex-sm=\"20\"],\n  [layout-sm=\"row\"] > [flex-sm=\"20\"] {\n    flex: 1 1 20%;\n    max-width: 20%;\n  }\n  [layout=\"column\"] > [flex-sm=\"20\"],\n  [layout-sm=\"column\"] > [flex-sm=\"20\"] {\n    flex: 1 1 20%;\n    max-height: 20%;\n  }\n  [flex-sm=\"25\"] {\n    flex: 1 1 25%;\n    max-width: 25%;\n  }\n  [layout=\"row\"] > [flex-sm=\"25\"],\n  [layout-sm=\"row\"] > [flex-sm=\"25\"] {\n    flex: 1 1 25%;\n    max-width: 25%;\n  }\n  [layout=\"column\"] > [flex-sm=\"25\"],\n  [layout-sm=\"column\"] > [flex-sm=\"25\"] {\n    flex: 1 1 25%;\n    max-height: 25%;\n  }\n  [flex-sm=\"30\"] {\n    flex: 1 1 30%;\n    max-width: 30%;\n  }\n  [layout=\"row\"] > [flex-sm=\"30\"],\n  [layout-sm=\"row\"] > [flex-sm=\"30\"] {\n    flex: 1 1 30%;\n    max-width: 30%;\n  }\n  [layout=\"column\"] > [flex-sm=\"30\"],\n  [layout-sm=\"column\"] > [flex-sm=\"30\"] {\n    flex: 1 1 30%;\n    max-height: 30%;\n  }\n  [flex-sm=\"35\"] {\n    flex: 1 1 35%;\n    max-width: 35%;\n  }\n  [layout=\"row\"] > [flex-sm=\"35\"],\n  [layout-sm=\"row\"] > [flex-sm=\"35\"] {\n    flex: 1 1 35%;\n    max-width: 35%;\n  }\n  [layout=\"column\"] > [flex-sm=\"35\"],\n  [layout-sm=\"column\"] > [flex-sm=\"35\"] {\n    flex: 1 1 35%;\n    max-height: 35%;\n  }\n  [flex-sm=\"40\"] {\n    flex: 1 1 40%;\n    max-width: 40%;\n  }\n  [layout=\"row\"] > [flex-sm=\"40\"],\n  [layout-sm=\"row\"] > [flex-sm=\"40\"] {\n    flex: 1 1 40%;\n    max-width: 40%;\n  }\n  [layout=\"column\"] > [flex-sm=\"40\"],\n  [layout-sm=\"column\"] > [flex-sm=\"40\"] {\n    flex: 1 1 40%;\n    max-height: 40%;\n  }\n  [flex-sm=\"45\"] {\n    flex: 1 1 45%;\n    max-width: 45%;\n  }\n  [layout=\"row\"] > [flex-sm=\"45\"],\n  [layout-sm=\"row\"] > [flex-sm=\"45\"] {\n    flex: 1 1 45%;\n    max-width: 45%;\n  }\n  [layout=\"column\"] > [flex-sm=\"45\"],\n  [layout-sm=\"column\"] > [flex-sm=\"45\"] {\n    flex: 1 1 45%;\n    max-height: 45%;\n  }\n  [flex-sm=\"50\"] {\n    flex: 1 1 50%;\n    max-width: 50%;\n  }\n  [layout=\"row\"] > [flex-sm=\"50\"],\n  [layout-sm=\"row\"] > [flex-sm=\"50\"] {\n    flex: 1 1 50%;\n    max-width: 50%;\n  }\n  [layout=\"column\"] > [flex-sm=\"50\"],\n  [layout-sm=\"column\"] > [flex-sm=\"50\"] {\n    flex: 1 1 50%;\n    max-height: 50%;\n  }\n  [flex-sm=\"55\"] {\n    flex: 1 1 55%;\n    max-width: 55%;\n  }\n  [layout=\"row\"] > [flex-sm=\"55\"],\n  [layout-sm=\"row\"] > [flex-sm=\"55\"] {\n    flex: 1 1 55%;\n    max-width: 55%;\n  }\n  [layout=\"column\"] > [flex-sm=\"55\"],\n  [layout-sm=\"column\"] > [flex-sm=\"55\"] {\n    flex: 1 1 55%;\n    max-height: 55%;\n  }\n  [flex-sm=\"60\"] {\n    flex: 1 1 60%;\n    max-width: 60%;\n  }\n  [layout=\"row\"] > [flex-sm=\"60\"],\n  [layout-sm=\"row\"] > [flex-sm=\"60\"] {\n    flex: 1 1 60%;\n    max-width: 60%;\n  }\n  [layout=\"column\"] > [flex-sm=\"60\"],\n  [layout-sm=\"column\"] > [flex-sm=\"60\"] {\n    flex: 1 1 60%;\n    max-height: 60%;\n  }\n  [flex-sm=\"65\"] {\n    flex: 1 1 65%;\n    max-width: 65%;\n  }\n  [layout=\"row\"] > [flex-sm=\"65\"],\n  [layout-sm=\"row\"] > [flex-sm=\"65\"] {\n    flex: 1 1 65%;\n    max-width: 65%;\n  }\n  [layout=\"column\"] > [flex-sm=\"65\"],\n  [layout-sm=\"column\"] > [flex-sm=\"65\"] {\n    flex: 1 1 65%;\n    max-height: 65%;\n  }\n  [flex-sm=\"70\"] {\n    flex: 1 1 70%;\n    max-width: 70%;\n  }\n  [layout=\"row\"] > [flex-sm=\"70\"],\n  [layout-sm=\"row\"] > [flex-sm=\"70\"] {\n    flex: 1 1 70%;\n    max-width: 70%;\n  }\n  [layout=\"column\"] > [flex-sm=\"70\"],\n  [layout-sm=\"column\"] > [flex-sm=\"70\"] {\n    flex: 1 1 70%;\n    max-height: 70%;\n  }\n  [flex-sm=\"75\"] {\n    flex: 1 1 75%;\n    max-width: 75%;\n  }\n  [layout=\"row\"] > [flex-sm=\"75\"],\n  [layout-sm=\"row\"] > [flex-sm=\"75\"] {\n    flex: 1 1 75%;\n    max-width: 75%;\n  }\n  [layout=\"column\"] > [flex-sm=\"75\"],\n  [layout-sm=\"column\"] > [flex-sm=\"75\"] {\n    flex: 1 1 75%;\n    max-height: 75%;\n  }\n  [flex-sm=\"80\"] {\n    flex: 1 1 80%;\n    max-width: 80%;\n  }\n  [layout=\"row\"] > [flex-sm=\"80\"],\n  [layout-sm=\"row\"] > [flex-sm=\"80\"] {\n    flex: 1 1 80%;\n    max-width: 80%;\n  }\n  [layout=\"column\"] > [flex-sm=\"80\"],\n  [layout-sm=\"column\"] > [flex-sm=\"80\"] {\n    flex: 1 1 80%;\n    max-height: 80%;\n  }\n  [flex-sm=\"85\"] {\n    flex: 1 1 85%;\n    max-width: 85%;\n  }\n  [layout=\"row\"] > [flex-sm=\"85\"],\n  [layout-sm=\"row\"] > [flex-sm=\"85\"] {\n    flex: 1 1 85%;\n    max-width: 85%;\n  }\n  [layout=\"column\"] > [flex-sm=\"85\"],\n  [layout-sm=\"column\"] > [flex-sm=\"85\"] {\n    flex: 1 1 85%;\n    max-height: 85%;\n  }\n  [flex-sm=\"90\"] {\n    flex: 1 1 90%;\n    max-width: 90%;\n  }\n  [layout=\"row\"] > [flex-sm=\"90\"],\n  [layout-sm=\"row\"] > [flex-sm=\"90\"] {\n    flex: 1 1 90%;\n    max-width: 90%;\n  }\n  [layout=\"column\"] > [flex-sm=\"90\"],\n  [layout-sm=\"column\"] > [flex-sm=\"90\"] {\n    flex: 1 1 90%;\n    max-height: 90%;\n  }\n  [flex-sm=\"95\"] {\n    flex: 1 1 95%;\n    max-width: 95%;\n  }\n  [layout=\"row\"] > [flex-sm=\"95\"],\n  [layout-sm=\"row\"] > [flex-sm=\"95\"] {\n    flex: 1 1 95%;\n    max-width: 95%;\n  }\n  [layout=\"column\"] > [flex-sm=\"95\"],\n  [layout-sm=\"column\"] > [flex-sm=\"95\"] {\n    flex: 1 1 95%;\n    max-height: 95%;\n  }\n  [flex-sm=\"100\"] {\n    flex: 1 1 100%;\n    max-width: 100%;\n  }\n  [layout=\"row\"] > [flex-sm=\"100\"],\n  [layout-sm=\"row\"] > [flex-sm=\"100\"] {\n    flex: 1 1 100%;\n    max-width: 100%;\n  }\n  [layout=\"column\"] > [flex-sm=\"100\"],\n  [layout-sm=\"column\"] > [flex-sm=\"100\"] {\n    flex: 1 1 100%;\n    max-height: 100%;\n  }\n  [layout=\"row\"] > [flex-sm=\"33\"],\n  [layout=\"row\"] > [flex-sm=\"33\"],\n  [layout-sm=\"row\"] > [flex-sm=\"33\"],\n  [layout-sm=\"row\"] > [flex-sm=\"33\"] {\n    flex: 1 1 33.33%;\n    max-width: 33.33%;\n  }\n  [layout=\"row\"] > [flex-sm=\"66\"],\n  [layout=\"row\"] > [flex-sm=\"66\"],\n  [layout-sm=\"row\"] > [flex-sm=\"66\"],\n  [layout-sm=\"row\"] > [flex-sm=\"66\"] {\n    flex: 1 1 66.66%;\n    max-width: 66.66%;\n  }\n  [layout=\"column\"] > [flex-sm=\"33\"],\n  [layout=\"column\"] > [flex-sm=\"33\"],\n  [layout-sm=\"column\"] > [flex-sm=\"33\"],\n  [layout-sm=\"column\"] > [flex-sm=\"33\"] {\n    flex: 1 1 33.33%;\n    max-height: 33.33%;\n  }\n  [layout=\"column\"] > [flex-sm=\"66\"],\n  [layout=\"column\"] > [flex-sm=\"66\"],\n  [layout-sm=\"column\"] > [flex-sm=\"66\"],\n  [layout-sm=\"column\"] > [flex-sm=\"66\"] {\n    flex: 1 1 66.66%;\n    max-height: 66.66%;\n  }\n  [layout-sm] {\n    display: flex;\n  }\n  [layout-sm=\"column\"] {\n    flex-direction: column;\n  }\n  [layout-sm=\"row\"] {\n    flex-direction: row;\n  }\n}\n@media (min-width: 600px) {\n  [flex-order-gt-sm=\"0\"] {\n    order: 0;\n  }\n  [flex-order-gt-sm=\"1\"] {\n    order: 1;\n  }\n  [flex-order-gt-sm=\"2\"] {\n    order: 2;\n  }\n  [flex-order-gt-sm=\"3\"] {\n    order: 3;\n  }\n  [flex-order-gt-sm=\"4\"] {\n    order: 4;\n  }\n  [flex-order-gt-sm=\"5\"] {\n    order: 5;\n  }\n  [flex-order-gt-sm=\"6\"] {\n    order: 6;\n  }\n  [flex-order-gt-sm=\"7\"] {\n    order: 7;\n  }\n  [flex-order-gt-sm=\"8\"] {\n    order: 8;\n  }\n  [flex-order-gt-sm=\"9\"] {\n    order: 9;\n  }\n  [flex-order-gt-sm=\"10\"] {\n    order: 10;\n  }\n  [flex-order-gt-sm=\"11\"] {\n    order: 11;\n  }\n  [flex-order-gt-sm=\"12\"] {\n    order: 12;\n  }\n  [flex-order-gt-sm=\"13\"] {\n    order: 13;\n  }\n  [flex-order-gt-sm=\"14\"] {\n    order: 14;\n  }\n  [flex-order-gt-sm=\"15\"] {\n    order: 15;\n  }\n  [flex-order-gt-sm=\"16\"] {\n    order: 16;\n  }\n  [flex-order-gt-sm=\"17\"] {\n    order: 17;\n  }\n  [flex-order-gt-sm=\"18\"] {\n    order: 18;\n  }\n  [flex-order-gt-sm=\"19\"] {\n    order: 19;\n  }\n  [flex-order-gt-sm=\"20\"] {\n    order: 20;\n  }\n  [flex-gt-sm] {\n    flex: 1;\n  }\n  [flex-gt-sm-grow] {\n    flex: 1 1 100%;\n    box-sizing: border-box;\n  }\n  [flex-gt-sm-initial] {\n    flex: 0 1 auto;\n    box-sizing: border-box;\n  }\n  [flex-gt-sm-auto] {\n    flex: 1 1 auto;\n    box-sizing: border-box;\n  }\n  [flex-gt-sm-none] {\n    flex: 0 0 auto;\n    box-sizing: border-box;\n  }\n  [flex-gt-sm],\n  [layout=\"row\"] > [flex-gt-sm],\n  [layout-gt-sm=\"row\"] > [flex-gt-sm] {\n    max-height: 100%;\n  }\n  [layout-gt-sm=\"column\"] > [flex-gt-sm],\n  [layout=\"column\"] > [flex-gt-sm] {\n    max-width: 100%;\n  }\n  [flex-gt-sm=\"5\"] {\n    flex: 1 1 5%;\n    max-width: 5%;\n  }\n  [layout=\"row\"] > [flex-gt-sm=\"5\"],\n  [layout-gt-sm=\"row\"] > [flex-gt-sm=\"5\"] {\n    flex: 1 1 5%;\n    max-width: 5%;\n  }\n  [layout=\"column\"] > [flex-gt-sm=\"5\"],\n  [layout-gt-sm=\"column\"] > [flex-gt-sm=\"5\"] {\n    flex: 1 1 5%;\n    max-height: 5%;\n  }\n  [flex-gt-sm=\"10\"] {\n    flex: 1 1 10%;\n    max-width: 10%;\n  }\n  [layout=\"row\"] > [flex-gt-sm=\"10\"],\n  [layout-gt-sm=\"row\"] > [flex-gt-sm=\"10\"] {\n    flex: 1 1 10%;\n    max-width: 10%;\n  }\n  [layout=\"column\"] > [flex-gt-sm=\"10\"],\n  [layout-gt-sm=\"column\"] > [flex-gt-sm=\"10\"] {\n    flex: 1 1 10%;\n    max-height: 10%;\n  }\n  [flex-gt-sm=\"15\"] {\n    flex: 1 1 15%;\n    max-width: 15%;\n  }\n  [layout=\"row\"] > [flex-gt-sm=\"15\"],\n  [layout-gt-sm=\"row\"] > [flex-gt-sm=\"15\"] {\n    flex: 1 1 15%;\n    max-width: 15%;\n  }\n  [layout=\"column\"] > [flex-gt-sm=\"15\"],\n  [layout-gt-sm=\"column\"] > [flex-gt-sm=\"15\"] {\n    flex: 1 1 15%;\n    max-height: 15%;\n  }\n  [flex-gt-sm=\"20\"] {\n    flex: 1 1 20%;\n    max-width: 20%;\n  }\n  [layout=\"row\"] > [flex-gt-sm=\"20\"],\n  [layout-gt-sm=\"row\"] > [flex-gt-sm=\"20\"] {\n    flex: 1 1 20%;\n    max-width: 20%;\n  }\n  [layout=\"column\"] > [flex-gt-sm=\"20\"],\n  [layout-gt-sm=\"column\"] > [flex-gt-sm=\"20\"] {\n    flex: 1 1 20%;\n    max-height: 20%;\n  }\n  [flex-gt-sm=\"25\"] {\n    flex: 1 1 25%;\n    max-width: 25%;\n  }\n  [layout=\"row\"] > [flex-gt-sm=\"25\"],\n  [layout-gt-sm=\"row\"] > [flex-gt-sm=\"25\"] {\n    flex: 1 1 25%;\n    max-width: 25%;\n  }\n  [layout=\"column\"] > [flex-gt-sm=\"25\"],\n  [layout-gt-sm=\"column\"] > [flex-gt-sm=\"25\"] {\n    flex: 1 1 25%;\n    max-height: 25%;\n  }\n  [flex-gt-sm=\"30\"] {\n    flex: 1 1 30%;\n    max-width: 30%;\n  }\n  [layout=\"row\"] > [flex-gt-sm=\"30\"],\n  [layout-gt-sm=\"row\"] > [flex-gt-sm=\"30\"] {\n    flex: 1 1 30%;\n    max-width: 30%;\n  }\n  [layout=\"column\"] > [flex-gt-sm=\"30\"],\n  [layout-gt-sm=\"column\"] > [flex-gt-sm=\"30\"] {\n    flex: 1 1 30%;\n    max-height: 30%;\n  }\n  [flex-gt-sm=\"35\"] {\n    flex: 1 1 35%;\n    max-width: 35%;\n  }\n  [layout=\"row\"] > [flex-gt-sm=\"35\"],\n  [layout-gt-sm=\"row\"] > [flex-gt-sm=\"35\"] {\n    flex: 1 1 35%;\n    max-width: 35%;\n  }\n  [layout=\"column\"] > [flex-gt-sm=\"35\"],\n  [layout-gt-sm=\"column\"] > [flex-gt-sm=\"35\"] {\n    flex: 1 1 35%;\n    max-height: 35%;\n  }\n  [flex-gt-sm=\"40\"] {\n    flex: 1 1 40%;\n    max-width: 40%;\n  }\n  [layout=\"row\"] > [flex-gt-sm=\"40\"],\n  [layout-gt-sm=\"row\"] > [flex-gt-sm=\"40\"] {\n    flex: 1 1 40%;\n    max-width: 40%;\n  }\n  [layout=\"column\"] > [flex-gt-sm=\"40\"],\n  [layout-gt-sm=\"column\"] > [flex-gt-sm=\"40\"] {\n    flex: 1 1 40%;\n    max-height: 40%;\n  }\n  [flex-gt-sm=\"45\"] {\n    flex: 1 1 45%;\n    max-width: 45%;\n  }\n  [layout=\"row\"] > [flex-gt-sm=\"45\"],\n  [layout-gt-sm=\"row\"] > [flex-gt-sm=\"45\"] {\n    flex: 1 1 45%;\n    max-width: 45%;\n  }\n  [layout=\"column\"] > [flex-gt-sm=\"45\"],\n  [layout-gt-sm=\"column\"] > [flex-gt-sm=\"45\"] {\n    flex: 1 1 45%;\n    max-height: 45%;\n  }\n  [flex-gt-sm=\"50\"] {\n    flex: 1 1 50%;\n    max-width: 50%;\n  }\n  [layout=\"row\"] > [flex-gt-sm=\"50\"],\n  [layout-gt-sm=\"row\"] > [flex-gt-sm=\"50\"] {\n    flex: 1 1 50%;\n    max-width: 50%;\n  }\n  [layout=\"column\"] > [flex-gt-sm=\"50\"],\n  [layout-gt-sm=\"column\"] > [flex-gt-sm=\"50\"] {\n    flex: 1 1 50%;\n    max-height: 50%;\n  }\n  [flex-gt-sm=\"55\"] {\n    flex: 1 1 55%;\n    max-width: 55%;\n  }\n  [layout=\"row\"] > [flex-gt-sm=\"55\"],\n  [layout-gt-sm=\"row\"] > [flex-gt-sm=\"55\"] {\n    flex: 1 1 55%;\n    max-width: 55%;\n  }\n  [layout=\"column\"] > [flex-gt-sm=\"55\"],\n  [layout-gt-sm=\"column\"] > [flex-gt-sm=\"55\"] {\n    flex: 1 1 55%;\n    max-height: 55%;\n  }\n  [flex-gt-sm=\"60\"] {\n    flex: 1 1 60%;\n    max-width: 60%;\n  }\n  [layout=\"row\"] > [flex-gt-sm=\"60\"],\n  [layout-gt-sm=\"row\"] > [flex-gt-sm=\"60\"] {\n    flex: 1 1 60%;\n    max-width: 60%;\n  }\n  [layout=\"column\"] > [flex-gt-sm=\"60\"],\n  [layout-gt-sm=\"column\"] > [flex-gt-sm=\"60\"] {\n    flex: 1 1 60%;\n    max-height: 60%;\n  }\n  [flex-gt-sm=\"65\"] {\n    flex: 1 1 65%;\n    max-width: 65%;\n  }\n  [layout=\"row\"] > [flex-gt-sm=\"65\"],\n  [layout-gt-sm=\"row\"] > [flex-gt-sm=\"65\"] {\n    flex: 1 1 65%;\n    max-width: 65%;\n  }\n  [layout=\"column\"] > [flex-gt-sm=\"65\"],\n  [layout-gt-sm=\"column\"] > [flex-gt-sm=\"65\"] {\n    flex: 1 1 65%;\n    max-height: 65%;\n  }\n  [flex-gt-sm=\"70\"] {\n    flex: 1 1 70%;\n    max-width: 70%;\n  }\n  [layout=\"row\"] > [flex-gt-sm=\"70\"],\n  [layout-gt-sm=\"row\"] > [flex-gt-sm=\"70\"] {\n    flex: 1 1 70%;\n    max-width: 70%;\n  }\n  [layout=\"column\"] > [flex-gt-sm=\"70\"],\n  [layout-gt-sm=\"column\"] > [flex-gt-sm=\"70\"] {\n    flex: 1 1 70%;\n    max-height: 70%;\n  }\n  [flex-gt-sm=\"75\"] {\n    flex: 1 1 75%;\n    max-width: 75%;\n  }\n  [layout=\"row\"] > [flex-gt-sm=\"75\"],\n  [layout-gt-sm=\"row\"] > [flex-gt-sm=\"75\"] {\n    flex: 1 1 75%;\n    max-width: 75%;\n  }\n  [layout=\"column\"] > [flex-gt-sm=\"75\"],\n  [layout-gt-sm=\"column\"] > [flex-gt-sm=\"75\"] {\n    flex: 1 1 75%;\n    max-height: 75%;\n  }\n  [flex-gt-sm=\"80\"] {\n    flex: 1 1 80%;\n    max-width: 80%;\n  }\n  [layout=\"row\"] > [flex-gt-sm=\"80\"],\n  [layout-gt-sm=\"row\"] > [flex-gt-sm=\"80\"] {\n    flex: 1 1 80%;\n    max-width: 80%;\n  }\n  [layout=\"column\"] > [flex-gt-sm=\"80\"],\n  [layout-gt-sm=\"column\"] > [flex-gt-sm=\"80\"] {\n    flex: 1 1 80%;\n    max-height: 80%;\n  }\n  [flex-gt-sm=\"85\"] {\n    flex: 1 1 85%;\n    max-width: 85%;\n  }\n  [layout=\"row\"] > [flex-gt-sm=\"85\"],\n  [layout-gt-sm=\"row\"] > [flex-gt-sm=\"85\"] {\n    flex: 1 1 85%;\n    max-width: 85%;\n  }\n  [layout=\"column\"] > [flex-gt-sm=\"85\"],\n  [layout-gt-sm=\"column\"] > [flex-gt-sm=\"85\"] {\n    flex: 1 1 85%;\n    max-height: 85%;\n  }\n  [flex-gt-sm=\"90\"] {\n    flex: 1 1 90%;\n    max-width: 90%;\n  }\n  [layout=\"row\"] > [flex-gt-sm=\"90\"],\n  [layout-gt-sm=\"row\"] > [flex-gt-sm=\"90\"] {\n    flex: 1 1 90%;\n    max-width: 90%;\n  }\n  [layout=\"column\"] > [flex-gt-sm=\"90\"],\n  [layout-gt-sm=\"column\"] > [flex-gt-sm=\"90\"] {\n    flex: 1 1 90%;\n    max-height: 90%;\n  }\n  [flex-gt-sm=\"95\"] {\n    flex: 1 1 95%;\n    max-width: 95%;\n  }\n  [layout=\"row\"] > [flex-gt-sm=\"95\"],\n  [layout-gt-sm=\"row\"] > [flex-gt-sm=\"95\"] {\n    flex: 1 1 95%;\n    max-width: 95%;\n  }\n  [layout=\"column\"] > [flex-gt-sm=\"95\"],\n  [layout-gt-sm=\"column\"] > [flex-gt-sm=\"95\"] {\n    flex: 1 1 95%;\n    max-height: 95%;\n  }\n  [flex-gt-sm=\"100\"] {\n    flex: 1 1 100%;\n    max-width: 100%;\n  }\n  [layout=\"row\"] > [flex-gt-sm=\"100\"],\n  [layout-gt-sm=\"row\"] > [flex-gt-sm=\"100\"] {\n    flex: 1 1 100%;\n    max-width: 100%;\n  }\n  [layout=\"column\"] > [flex-gt-sm=\"100\"],\n  [layout-gt-sm=\"column\"] > [flex-gt-sm=\"100\"] {\n    flex: 1 1 100%;\n    max-height: 100%;\n  }\n  [layout=\"row\"] > [flex-gt-sm=\"33\"],\n  [layout=\"row\"] > [flex-gt-sm=\"33\"],\n  [layout-gt-sm=\"row\"] > [flex-gt-sm=\"33\"],\n  [layout-gt-sm=\"row\"] > [flex-gt-sm=\"33\"] {\n    flex: 1 1 33.33%;\n    max-width: 33.33%;\n  }\n  [layout=\"row\"] > [flex-gt-sm=\"66\"],\n  [layout=\"row\"] > [flex-gt-sm=\"66\"],\n  [layout-gt-sm=\"row\"] > [flex-gt-sm=\"66\"],\n  [layout-gt-sm=\"row\"] > [flex-gt-sm=\"66\"] {\n    flex: 1 1 66.66%;\n    max-width: 66.66%;\n  }\n  [layout=\"column\"] > [flex-gt-sm=\"33\"],\n  [layout=\"column\"] > [flex-gt-sm=\"33\"],\n  [layout-gt-sm=\"column\"] > [flex-gt-sm=\"33\"],\n  [layout-gt-sm=\"column\"] > [flex-gt-sm=\"33\"] {\n    flex: 1 1 33.33%;\n    max-height: 33.33%;\n  }\n  [layout=\"column\"] > [flex-gt-sm=\"66\"],\n  [layout=\"column\"] > [flex-gt-sm=\"66\"],\n  [layout-gt-sm=\"column\"] > [flex-gt-sm=\"66\"],\n  [layout-gt-sm=\"column\"] > [flex-gt-sm=\"66\"] {\n    flex: 1 1 66.66%;\n    max-height: 66.66%;\n  }\n  [layout-gt-sm] {\n    display: flex;\n  }\n  [layout-gt-sm=\"column\"] {\n    flex-direction: column;\n  }\n  [layout-gt-sm=\"row\"] {\n    flex-direction: row;\n  }\n}\n@media (min-width: 600px) and (max-width: 959px) {\n  [hide]:not([show-gt-xs]):not([show-gt-sm]):not([show-md]):not([show]),\n  [hide-gt-xs]:not([show-gt-xs]):not([show-gt-sm]):not([show-md]):not([show]),\n  [hide-gt-sm]:not([show-gt-xs]):not([show-gt-sm]):not([show-md]):not([show]) {\n    display: none;\n  }\n  [hide-md]:not([show-md]):not([show]) {\n    display: none;\n  }\n  [flex-order-md=\"0\"] {\n    order: 0;\n  }\n  [flex-order-md=\"1\"] {\n    order: 1;\n  }\n  [flex-order-md=\"2\"] {\n    order: 2;\n  }\n  [flex-order-md=\"3\"] {\n    order: 3;\n  }\n  [flex-order-md=\"4\"] {\n    order: 4;\n  }\n  [flex-order-md=\"5\"] {\n    order: 5;\n  }\n  [flex-order-md=\"6\"] {\n    order: 6;\n  }\n  [flex-order-md=\"7\"] {\n    order: 7;\n  }\n  [flex-order-md=\"8\"] {\n    order: 8;\n  }\n  [flex-order-md=\"9\"] {\n    order: 9;\n  }\n  [flex-order-md=\"10\"] {\n    order: 10;\n  }\n  [flex-order-md=\"11\"] {\n    order: 11;\n  }\n  [flex-order-md=\"12\"] {\n    order: 12;\n  }\n  [flex-order-md=\"13\"] {\n    order: 13;\n  }\n  [flex-order-md=\"14\"] {\n    order: 14;\n  }\n  [flex-order-md=\"15\"] {\n    order: 15;\n  }\n  [flex-order-md=\"16\"] {\n    order: 16;\n  }\n  [flex-order-md=\"17\"] {\n    order: 17;\n  }\n  [flex-order-md=\"18\"] {\n    order: 18;\n  }\n  [flex-order-md=\"19\"] {\n    order: 19;\n  }\n  [flex-order-md=\"20\"] {\n    order: 20;\n  }\n  [flex-md] {\n    flex: 1;\n  }\n  [flex-md-grow] {\n    flex: 1 1 100%;\n    box-sizing: border-box;\n  }\n  [flex-md-initial] {\n    flex: 0 1 auto;\n    box-sizing: border-box;\n  }\n  [flex-md-auto] {\n    flex: 1 1 auto;\n    box-sizing: border-box;\n  }\n  [flex-md-none] {\n    flex: 0 0 auto;\n    box-sizing: border-box;\n  }\n  [flex-md],\n  [layout=\"row\"] > [flex-md],\n  [layout-md=\"row\"] > [flex-md] {\n    max-height: 100%;\n  }\n  [layout-md=\"column\"] > [flex-md],\n  [layout=\"column\"] > [flex-md] {\n    max-width: 100%;\n  }\n  [flex-md=\"5\"] {\n    flex: 1 1 5%;\n    max-width: 5%;\n  }\n  [layout=\"row\"] > [flex-md=\"5\"],\n  [layout-md=\"row\"] > [flex-md=\"5\"] {\n    flex: 1 1 5%;\n    max-width: 5%;\n  }\n  [layout=\"column\"] > [flex-md=\"5\"],\n  [layout-md=\"column\"] > [flex-md=\"5\"] {\n    flex: 1 1 5%;\n    max-height: 5%;\n  }\n  [flex-md=\"10\"] {\n    flex: 1 1 10%;\n    max-width: 10%;\n  }\n  [layout=\"row\"] > [flex-md=\"10\"],\n  [layout-md=\"row\"] > [flex-md=\"10\"] {\n    flex: 1 1 10%;\n    max-width: 10%;\n  }\n  [layout=\"column\"] > [flex-md=\"10\"],\n  [layout-md=\"column\"] > [flex-md=\"10\"] {\n    flex: 1 1 10%;\n    max-height: 10%;\n  }\n  [flex-md=\"15\"] {\n    flex: 1 1 15%;\n    max-width: 15%;\n  }\n  [layout=\"row\"] > [flex-md=\"15\"],\n  [layout-md=\"row\"] > [flex-md=\"15\"] {\n    flex: 1 1 15%;\n    max-width: 15%;\n  }\n  [layout=\"column\"] > [flex-md=\"15\"],\n  [layout-md=\"column\"] > [flex-md=\"15\"] {\n    flex: 1 1 15%;\n    max-height: 15%;\n  }\n  [flex-md=\"20\"] {\n    flex: 1 1 20%;\n    max-width: 20%;\n  }\n  [layout=\"row\"] > [flex-md=\"20\"],\n  [layout-md=\"row\"] > [flex-md=\"20\"] {\n    flex: 1 1 20%;\n    max-width: 20%;\n  }\n  [layout=\"column\"] > [flex-md=\"20\"],\n  [layout-md=\"column\"] > [flex-md=\"20\"] {\n    flex: 1 1 20%;\n    max-height: 20%;\n  }\n  [flex-md=\"25\"] {\n    flex: 1 1 25%;\n    max-width: 25%;\n  }\n  [layout=\"row\"] > [flex-md=\"25\"],\n  [layout-md=\"row\"] > [flex-md=\"25\"] {\n    flex: 1 1 25%;\n    max-width: 25%;\n  }\n  [layout=\"column\"] > [flex-md=\"25\"],\n  [layout-md=\"column\"] > [flex-md=\"25\"] {\n    flex: 1 1 25%;\n    max-height: 25%;\n  }\n  [flex-md=\"30\"] {\n    flex: 1 1 30%;\n    max-width: 30%;\n  }\n  [layout=\"row\"] > [flex-md=\"30\"],\n  [layout-md=\"row\"] > [flex-md=\"30\"] {\n    flex: 1 1 30%;\n    max-width: 30%;\n  }\n  [layout=\"column\"] > [flex-md=\"30\"],\n  [layout-md=\"column\"] > [flex-md=\"30\"] {\n    flex: 1 1 30%;\n    max-height: 30%;\n  }\n  [flex-md=\"35\"] {\n    flex: 1 1 35%;\n    max-width: 35%;\n  }\n  [layout=\"row\"] > [flex-md=\"35\"],\n  [layout-md=\"row\"] > [flex-md=\"35\"] {\n    flex: 1 1 35%;\n    max-width: 35%;\n  }\n  [layout=\"column\"] > [flex-md=\"35\"],\n  [layout-md=\"column\"] > [flex-md=\"35\"] {\n    flex: 1 1 35%;\n    max-height: 35%;\n  }\n  [flex-md=\"40\"] {\n    flex: 1 1 40%;\n    max-width: 40%;\n  }\n  [layout=\"row\"] > [flex-md=\"40\"],\n  [layout-md=\"row\"] > [flex-md=\"40\"] {\n    flex: 1 1 40%;\n    max-width: 40%;\n  }\n  [layout=\"column\"] > [flex-md=\"40\"],\n  [layout-md=\"column\"] > [flex-md=\"40\"] {\n    flex: 1 1 40%;\n    max-height: 40%;\n  }\n  [flex-md=\"45\"] {\n    flex: 1 1 45%;\n    max-width: 45%;\n  }\n  [layout=\"row\"] > [flex-md=\"45\"],\n  [layout-md=\"row\"] > [flex-md=\"45\"] {\n    flex: 1 1 45%;\n    max-width: 45%;\n  }\n  [layout=\"column\"] > [flex-md=\"45\"],\n  [layout-md=\"column\"] > [flex-md=\"45\"] {\n    flex: 1 1 45%;\n    max-height: 45%;\n  }\n  [flex-md=\"50\"] {\n    flex: 1 1 50%;\n    max-width: 50%;\n  }\n  [layout=\"row\"] > [flex-md=\"50\"],\n  [layout-md=\"row\"] > [flex-md=\"50\"] {\n    flex: 1 1 50%;\n    max-width: 50%;\n  }\n  [layout=\"column\"] > [flex-md=\"50\"],\n  [layout-md=\"column\"] > [flex-md=\"50\"] {\n    flex: 1 1 50%;\n    max-height: 50%;\n  }\n  [flex-md=\"55\"] {\n    flex: 1 1 55%;\n    max-width: 55%;\n  }\n  [layout=\"row\"] > [flex-md=\"55\"],\n  [layout-md=\"row\"] > [flex-md=\"55\"] {\n    flex: 1 1 55%;\n    max-width: 55%;\n  }\n  [layout=\"column\"] > [flex-md=\"55\"],\n  [layout-md=\"column\"] > [flex-md=\"55\"] {\n    flex: 1 1 55%;\n    max-height: 55%;\n  }\n  [flex-md=\"60\"] {\n    flex: 1 1 60%;\n    max-width: 60%;\n  }\n  [layout=\"row\"] > [flex-md=\"60\"],\n  [layout-md=\"row\"] > [flex-md=\"60\"] {\n    flex: 1 1 60%;\n    max-width: 60%;\n  }\n  [layout=\"column\"] > [flex-md=\"60\"],\n  [layout-md=\"column\"] > [flex-md=\"60\"] {\n    flex: 1 1 60%;\n    max-height: 60%;\n  }\n  [flex-md=\"65\"] {\n    flex: 1 1 65%;\n    max-width: 65%;\n  }\n  [layout=\"row\"] > [flex-md=\"65\"],\n  [layout-md=\"row\"] > [flex-md=\"65\"] {\n    flex: 1 1 65%;\n    max-width: 65%;\n  }\n  [layout=\"column\"] > [flex-md=\"65\"],\n  [layout-md=\"column\"] > [flex-md=\"65\"] {\n    flex: 1 1 65%;\n    max-height: 65%;\n  }\n  [flex-md=\"70\"] {\n    flex: 1 1 70%;\n    max-width: 70%;\n  }\n  [layout=\"row\"] > [flex-md=\"70\"],\n  [layout-md=\"row\"] > [flex-md=\"70\"] {\n    flex: 1 1 70%;\n    max-width: 70%;\n  }\n  [layout=\"column\"] > [flex-md=\"70\"],\n  [layout-md=\"column\"] > [flex-md=\"70\"] {\n    flex: 1 1 70%;\n    max-height: 70%;\n  }\n  [flex-md=\"75\"] {\n    flex: 1 1 75%;\n    max-width: 75%;\n  }\n  [layout=\"row\"] > [flex-md=\"75\"],\n  [layout-md=\"row\"] > [flex-md=\"75\"] {\n    flex: 1 1 75%;\n    max-width: 75%;\n  }\n  [layout=\"column\"] > [flex-md=\"75\"],\n  [layout-md=\"column\"] > [flex-md=\"75\"] {\n    flex: 1 1 75%;\n    max-height: 75%;\n  }\n  [flex-md=\"80\"] {\n    flex: 1 1 80%;\n    max-width: 80%;\n  }\n  [layout=\"row\"] > [flex-md=\"80\"],\n  [layout-md=\"row\"] > [flex-md=\"80\"] {\n    flex: 1 1 80%;\n    max-width: 80%;\n  }\n  [layout=\"column\"] > [flex-md=\"80\"],\n  [layout-md=\"column\"] > [flex-md=\"80\"] {\n    flex: 1 1 80%;\n    max-height: 80%;\n  }\n  [flex-md=\"85\"] {\n    flex: 1 1 85%;\n    max-width: 85%;\n  }\n  [layout=\"row\"] > [flex-md=\"85\"],\n  [layout-md=\"row\"] > [flex-md=\"85\"] {\n    flex: 1 1 85%;\n    max-width: 85%;\n  }\n  [layout=\"column\"] > [flex-md=\"85\"],\n  [layout-md=\"column\"] > [flex-md=\"85\"] {\n    flex: 1 1 85%;\n    max-height: 85%;\n  }\n  [flex-md=\"90\"] {\n    flex: 1 1 90%;\n    max-width: 90%;\n  }\n  [layout=\"row\"] > [flex-md=\"90\"],\n  [layout-md=\"row\"] > [flex-md=\"90\"] {\n    flex: 1 1 90%;\n    max-width: 90%;\n  }\n  [layout=\"column\"] > [flex-md=\"90\"],\n  [layout-md=\"column\"] > [flex-md=\"90\"] {\n    flex: 1 1 90%;\n    max-height: 90%;\n  }\n  [flex-md=\"95\"] {\n    flex: 1 1 95%;\n    max-width: 95%;\n  }\n  [layout=\"row\"] > [flex-md=\"95\"],\n  [layout-md=\"row\"] > [flex-md=\"95\"] {\n    flex: 1 1 95%;\n    max-width: 95%;\n  }\n  [layout=\"column\"] > [flex-md=\"95\"],\n  [layout-md=\"column\"] > [flex-md=\"95\"] {\n    flex: 1 1 95%;\n    max-height: 95%;\n  }\n  [flex-md=\"100\"] {\n    flex: 1 1 100%;\n    max-width: 100%;\n  }\n  [layout=\"row\"] > [flex-md=\"100\"],\n  [layout-md=\"row\"] > [flex-md=\"100\"] {\n    flex: 1 1 100%;\n    max-width: 100%;\n  }\n  [layout=\"column\"] > [flex-md=\"100\"],\n  [layout-md=\"column\"] > [flex-md=\"100\"] {\n    flex: 1 1 100%;\n    max-height: 100%;\n  }\n  [layout=\"row\"] > [flex-md=\"33\"],\n  [layout=\"row\"] > [flex-md=\"33\"],\n  [layout-md=\"row\"] > [flex-md=\"33\"],\n  [layout-md=\"row\"] > [flex-md=\"33\"] {\n    flex: 1 1 33.33%;\n    max-width: 33.33%;\n  }\n  [layout=\"row\"] > [flex-md=\"66\"],\n  [layout=\"row\"] > [flex-md=\"66\"],\n  [layout-md=\"row\"] > [flex-md=\"66\"],\n  [layout-md=\"row\"] > [flex-md=\"66\"] {\n    flex: 1 1 66.66%;\n    max-width: 66.66%;\n  }\n  [layout=\"column\"] > [flex-md=\"33\"],\n  [layout=\"column\"] > [flex-md=\"33\"],\n  [layout-md=\"column\"] > [flex-md=\"33\"],\n  [layout-md=\"column\"] > [flex-md=\"33\"] {\n    flex: 1 1 33.33%;\n    max-height: 33.33%;\n  }\n  [layout=\"column\"] > [flex-md=\"66\"],\n  [layout=\"column\"] > [flex-md=\"66\"],\n  [layout-md=\"column\"] > [flex-md=\"66\"],\n  [layout-md=\"column\"] > [flex-md=\"66\"] {\n    flex: 1 1 66.66%;\n    max-height: 66.66%;\n  }\n  [layout-md] {\n    display: flex;\n  }\n  [layout-md=\"column\"] {\n    flex-direction: column;\n  }\n  [layout-md=\"row\"] {\n    flex-direction: row;\n  }\n}\n@media (min-width: 960px) {\n  [flex-order-gt-md=\"0\"] {\n    order: 0;\n  }\n  [flex-order-gt-md=\"1\"] {\n    order: 1;\n  }\n  [flex-order-gt-md=\"2\"] {\n    order: 2;\n  }\n  [flex-order-gt-md=\"3\"] {\n    order: 3;\n  }\n  [flex-order-gt-md=\"4\"] {\n    order: 4;\n  }\n  [flex-order-gt-md=\"5\"] {\n    order: 5;\n  }\n  [flex-order-gt-md=\"6\"] {\n    order: 6;\n  }\n  [flex-order-gt-md=\"7\"] {\n    order: 7;\n  }\n  [flex-order-gt-md=\"8\"] {\n    order: 8;\n  }\n  [flex-order-gt-md=\"9\"] {\n    order: 9;\n  }\n  [flex-order-gt-md=\"10\"] {\n    order: 10;\n  }\n  [flex-order-gt-md=\"11\"] {\n    order: 11;\n  }\n  [flex-order-gt-md=\"12\"] {\n    order: 12;\n  }\n  [flex-order-gt-md=\"13\"] {\n    order: 13;\n  }\n  [flex-order-gt-md=\"14\"] {\n    order: 14;\n  }\n  [flex-order-gt-md=\"15\"] {\n    order: 15;\n  }\n  [flex-order-gt-md=\"16\"] {\n    order: 16;\n  }\n  [flex-order-gt-md=\"17\"] {\n    order: 17;\n  }\n  [flex-order-gt-md=\"18\"] {\n    order: 18;\n  }\n  [flex-order-gt-md=\"19\"] {\n    order: 19;\n  }\n  [flex-order-gt-md=\"20\"] {\n    order: 20;\n  }\n  [flex-gt-md] {\n    flex: 1;\n  }\n  [flex-gt-md-grow] {\n    flex: 1 1 100%;\n    box-sizing: border-box;\n  }\n  [flex-gt-md-initial] {\n    flex: 0 1 auto;\n    box-sizing: border-box;\n  }\n  [flex-gt-md-auto] {\n    flex: 1 1 auto;\n    box-sizing: border-box;\n  }\n  [flex-gt-md-none] {\n    flex: 0 0 auto;\n    box-sizing: border-box;\n  }\n  [flex-gt-md],\n  [layout=\"row\"] > [flex-gt-md],\n  [layout-gt-md=\"row\"] > [flex-gt-md] {\n    max-height: 100%;\n  }\n  [layout-gt-md=\"column\"] > [flex-gt-md],\n  [layout=\"column\"] > [flex-gt-md] {\n    max-width: 100%;\n  }\n  [flex-gt-md=\"5\"] {\n    flex: 1 1 5%;\n    max-width: 5%;\n  }\n  [layout=\"row\"] > [flex-gt-md=\"5\"],\n  [layout-gt-md=\"row\"] > [flex-gt-md=\"5\"] {\n    flex: 1 1 5%;\n    max-width: 5%;\n  }\n  [layout=\"column\"] > [flex-gt-md=\"5\"],\n  [layout-gt-md=\"column\"] > [flex-gt-md=\"5\"] {\n    flex: 1 1 5%;\n    max-height: 5%;\n  }\n  [flex-gt-md=\"10\"] {\n    flex: 1 1 10%;\n    max-width: 10%;\n  }\n  [layout=\"row\"] > [flex-gt-md=\"10\"],\n  [layout-gt-md=\"row\"] > [flex-gt-md=\"10\"] {\n    flex: 1 1 10%;\n    max-width: 10%;\n  }\n  [layout=\"column\"] > [flex-gt-md=\"10\"],\n  [layout-gt-md=\"column\"] > [flex-gt-md=\"10\"] {\n    flex: 1 1 10%;\n    max-height: 10%;\n  }\n  [flex-gt-md=\"15\"] {\n    flex: 1 1 15%;\n    max-width: 15%;\n  }\n  [layout=\"row\"] > [flex-gt-md=\"15\"],\n  [layout-gt-md=\"row\"] > [flex-gt-md=\"15\"] {\n    flex: 1 1 15%;\n    max-width: 15%;\n  }\n  [layout=\"column\"] > [flex-gt-md=\"15\"],\n  [layout-gt-md=\"column\"] > [flex-gt-md=\"15\"] {\n    flex: 1 1 15%;\n    max-height: 15%;\n  }\n  [flex-gt-md=\"20\"] {\n    flex: 1 1 20%;\n    max-width: 20%;\n  }\n  [layout=\"row\"] > [flex-gt-md=\"20\"],\n  [layout-gt-md=\"row\"] > [flex-gt-md=\"20\"] {\n    flex: 1 1 20%;\n    max-width: 20%;\n  }\n  [layout=\"column\"] > [flex-gt-md=\"20\"],\n  [layout-gt-md=\"column\"] > [flex-gt-md=\"20\"] {\n    flex: 1 1 20%;\n    max-height: 20%;\n  }\n  [flex-gt-md=\"25\"] {\n    flex: 1 1 25%;\n    max-width: 25%;\n  }\n  [layout=\"row\"] > [flex-gt-md=\"25\"],\n  [layout-gt-md=\"row\"] > [flex-gt-md=\"25\"] {\n    flex: 1 1 25%;\n    max-width: 25%;\n  }\n  [layout=\"column\"] > [flex-gt-md=\"25\"],\n  [layout-gt-md=\"column\"] > [flex-gt-md=\"25\"] {\n    flex: 1 1 25%;\n    max-height: 25%;\n  }\n  [flex-gt-md=\"30\"] {\n    flex: 1 1 30%;\n    max-width: 30%;\n  }\n  [layout=\"row\"] > [flex-gt-md=\"30\"],\n  [layout-gt-md=\"row\"] > [flex-gt-md=\"30\"] {\n    flex: 1 1 30%;\n    max-width: 30%;\n  }\n  [layout=\"column\"] > [flex-gt-md=\"30\"],\n  [layout-gt-md=\"column\"] > [flex-gt-md=\"30\"] {\n    flex: 1 1 30%;\n    max-height: 30%;\n  }\n  [flex-gt-md=\"35\"] {\n    flex: 1 1 35%;\n    max-width: 35%;\n  }\n  [layout=\"row\"] > [flex-gt-md=\"35\"],\n  [layout-gt-md=\"row\"] > [flex-gt-md=\"35\"] {\n    flex: 1 1 35%;\n    max-width: 35%;\n  }\n  [layout=\"column\"] > [flex-gt-md=\"35\"],\n  [layout-gt-md=\"column\"] > [flex-gt-md=\"35\"] {\n    flex: 1 1 35%;\n    max-height: 35%;\n  }\n  [flex-gt-md=\"40\"] {\n    flex: 1 1 40%;\n    max-width: 40%;\n  }\n  [layout=\"row\"] > [flex-gt-md=\"40\"],\n  [layout-gt-md=\"row\"] > [flex-gt-md=\"40\"] {\n    flex: 1 1 40%;\n    max-width: 40%;\n  }\n  [layout=\"column\"] > [flex-gt-md=\"40\"],\n  [layout-gt-md=\"column\"] > [flex-gt-md=\"40\"] {\n    flex: 1 1 40%;\n    max-height: 40%;\n  }\n  [flex-gt-md=\"45\"] {\n    flex: 1 1 45%;\n    max-width: 45%;\n  }\n  [layout=\"row\"] > [flex-gt-md=\"45\"],\n  [layout-gt-md=\"row\"] > [flex-gt-md=\"45\"] {\n    flex: 1 1 45%;\n    max-width: 45%;\n  }\n  [layout=\"column\"] > [flex-gt-md=\"45\"],\n  [layout-gt-md=\"column\"] > [flex-gt-md=\"45\"] {\n    flex: 1 1 45%;\n    max-height: 45%;\n  }\n  [flex-gt-md=\"50\"] {\n    flex: 1 1 50%;\n    max-width: 50%;\n  }\n  [layout=\"row\"] > [flex-gt-md=\"50\"],\n  [layout-gt-md=\"row\"] > [flex-gt-md=\"50\"] {\n    flex: 1 1 50%;\n    max-width: 50%;\n  }\n  [layout=\"column\"] > [flex-gt-md=\"50\"],\n  [layout-gt-md=\"column\"] > [flex-gt-md=\"50\"] {\n    flex: 1 1 50%;\n    max-height: 50%;\n  }\n  [flex-gt-md=\"55\"] {\n    flex: 1 1 55%;\n    max-width: 55%;\n  }\n  [layout=\"row\"] > [flex-gt-md=\"55\"],\n  [layout-gt-md=\"row\"] > [flex-gt-md=\"55\"] {\n    flex: 1 1 55%;\n    max-width: 55%;\n  }\n  [layout=\"column\"] > [flex-gt-md=\"55\"],\n  [layout-gt-md=\"column\"] > [flex-gt-md=\"55\"] {\n    flex: 1 1 55%;\n    max-height: 55%;\n  }\n  [flex-gt-md=\"60\"] {\n    flex: 1 1 60%;\n    max-width: 60%;\n  }\n  [layout=\"row\"] > [flex-gt-md=\"60\"],\n  [layout-gt-md=\"row\"] > [flex-gt-md=\"60\"] {\n    flex: 1 1 60%;\n    max-width: 60%;\n  }\n  [layout=\"column\"] > [flex-gt-md=\"60\"],\n  [layout-gt-md=\"column\"] > [flex-gt-md=\"60\"] {\n    flex: 1 1 60%;\n    max-height: 60%;\n  }\n  [flex-gt-md=\"65\"] {\n    flex: 1 1 65%;\n    max-width: 65%;\n  }\n  [layout=\"row\"] > [flex-gt-md=\"65\"],\n  [layout-gt-md=\"row\"] > [flex-gt-md=\"65\"] {\n    flex: 1 1 65%;\n    max-width: 65%;\n  }\n  [layout=\"column\"] > [flex-gt-md=\"65\"],\n  [layout-gt-md=\"column\"] > [flex-gt-md=\"65\"] {\n    flex: 1 1 65%;\n    max-height: 65%;\n  }\n  [flex-gt-md=\"70\"] {\n    flex: 1 1 70%;\n    max-width: 70%;\n  }\n  [layout=\"row\"] > [flex-gt-md=\"70\"],\n  [layout-gt-md=\"row\"] > [flex-gt-md=\"70\"] {\n    flex: 1 1 70%;\n    max-width: 70%;\n  }\n  [layout=\"column\"] > [flex-gt-md=\"70\"],\n  [layout-gt-md=\"column\"] > [flex-gt-md=\"70\"] {\n    flex: 1 1 70%;\n    max-height: 70%;\n  }\n  [flex-gt-md=\"75\"] {\n    flex: 1 1 75%;\n    max-width: 75%;\n  }\n  [layout=\"row\"] > [flex-gt-md=\"75\"],\n  [layout-gt-md=\"row\"] > [flex-gt-md=\"75\"] {\n    flex: 1 1 75%;\n    max-width: 75%;\n  }\n  [layout=\"column\"] > [flex-gt-md=\"75\"],\n  [layout-gt-md=\"column\"] > [flex-gt-md=\"75\"] {\n    flex: 1 1 75%;\n    max-height: 75%;\n  }\n  [flex-gt-md=\"80\"] {\n    flex: 1 1 80%;\n    max-width: 80%;\n  }\n  [layout=\"row\"] > [flex-gt-md=\"80\"],\n  [layout-gt-md=\"row\"] > [flex-gt-md=\"80\"] {\n    flex: 1 1 80%;\n    max-width: 80%;\n  }\n  [layout=\"column\"] > [flex-gt-md=\"80\"],\n  [layout-gt-md=\"column\"] > [flex-gt-md=\"80\"] {\n    flex: 1 1 80%;\n    max-height: 80%;\n  }\n  [flex-gt-md=\"85\"] {\n    flex: 1 1 85%;\n    max-width: 85%;\n  }\n  [layout=\"row\"] > [flex-gt-md=\"85\"],\n  [layout-gt-md=\"row\"] > [flex-gt-md=\"85\"] {\n    flex: 1 1 85%;\n    max-width: 85%;\n  }\n  [layout=\"column\"] > [flex-gt-md=\"85\"],\n  [layout-gt-md=\"column\"] > [flex-gt-md=\"85\"] {\n    flex: 1 1 85%;\n    max-height: 85%;\n  }\n  [flex-gt-md=\"90\"] {\n    flex: 1 1 90%;\n    max-width: 90%;\n  }\n  [layout=\"row\"] > [flex-gt-md=\"90\"],\n  [layout-gt-md=\"row\"] > [flex-gt-md=\"90\"] {\n    flex: 1 1 90%;\n    max-width: 90%;\n  }\n  [layout=\"column\"] > [flex-gt-md=\"90\"],\n  [layout-gt-md=\"column\"] > [flex-gt-md=\"90\"] {\n    flex: 1 1 90%;\n    max-height: 90%;\n  }\n  [flex-gt-md=\"95\"] {\n    flex: 1 1 95%;\n    max-width: 95%;\n  }\n  [layout=\"row\"] > [flex-gt-md=\"95\"],\n  [layout-gt-md=\"row\"] > [flex-gt-md=\"95\"] {\n    flex: 1 1 95%;\n    max-width: 95%;\n  }\n  [layout=\"column\"] > [flex-gt-md=\"95\"],\n  [layout-gt-md=\"column\"] > [flex-gt-md=\"95\"] {\n    flex: 1 1 95%;\n    max-height: 95%;\n  }\n  [flex-gt-md=\"100\"] {\n    flex: 1 1 100%;\n    max-width: 100%;\n  }\n  [layout=\"row\"] > [flex-gt-md=\"100\"],\n  [layout-gt-md=\"row\"] > [flex-gt-md=\"100\"] {\n    flex: 1 1 100%;\n    max-width: 100%;\n  }\n  [layout=\"column\"] > [flex-gt-md=\"100\"],\n  [layout-gt-md=\"column\"] > [flex-gt-md=\"100\"] {\n    flex: 1 1 100%;\n    max-height: 100%;\n  }\n  [layout=\"row\"] > [flex-gt-md=\"33\"],\n  [layout=\"row\"] > [flex-gt-md=\"33\"],\n  [layout-gt-md=\"row\"] > [flex-gt-md=\"33\"],\n  [layout-gt-md=\"row\"] > [flex-gt-md=\"33\"] {\n    flex: 1 1 33.33%;\n    max-width: 33.33%;\n  }\n  [layout=\"row\"] > [flex-gt-md=\"66\"],\n  [layout=\"row\"] > [flex-gt-md=\"66\"],\n  [layout-gt-md=\"row\"] > [flex-gt-md=\"66\"],\n  [layout-gt-md=\"row\"] > [flex-gt-md=\"66\"] {\n    flex: 1 1 66.66%;\n    max-width: 66.66%;\n  }\n  [layout=\"column\"] > [flex-gt-md=\"33\"],\n  [layout=\"column\"] > [flex-gt-md=\"33\"],\n  [layout-gt-md=\"column\"] > [flex-gt-md=\"33\"],\n  [layout-gt-md=\"column\"] > [flex-gt-md=\"33\"] {\n    flex: 1 1 33.33%;\n    max-height: 33.33%;\n  }\n  [layout=\"column\"] > [flex-gt-md=\"66\"],\n  [layout=\"column\"] > [flex-gt-md=\"66\"],\n  [layout-gt-md=\"column\"] > [flex-gt-md=\"66\"],\n  [layout-gt-md=\"column\"] > [flex-gt-md=\"66\"] {\n    flex: 1 1 66.66%;\n    max-height: 66.66%;\n  }\n  [layout-gt-md] {\n    display: flex;\n  }\n  [layout-gt-md=\"column\"] {\n    flex-direction: column;\n  }\n  [layout-gt-md=\"row\"] {\n    flex-direction: row;\n  }\n}\n@media (min-width: 960px) and (max-width: 1199px) {\n  [hide]:not([show-gt-xs]):not([show-gt-sm]):not([show-gt-md]):not([show-lg]):not([show]),\n  [hide-gt-xs]:not([show-gt-xs]):not([show-gt-sm]):not([show-gt-md]):not([show-lg]):not([show]),\n  [hide-gt-sm]:not([show-gt-xs]):not([show-gt-sm]):not([show-gt-md]):not([show-lg]):not([show]),\n  [hide-gt-md]:not([show-gt-xs]):not([show-gt-sm]):not([show-gt-md]):not([show-lg]):not([show]) {\n    display: none;\n  }\n  [hide-lg]:not([show-lg]):not([show]) {\n    display: none;\n  }\n  [flex-order-lg=\"0\"] {\n    order: 0;\n  }\n  [flex-order-lg=\"1\"] {\n    order: 1;\n  }\n  [flex-order-lg=\"2\"] {\n    order: 2;\n  }\n  [flex-order-lg=\"3\"] {\n    order: 3;\n  }\n  [flex-order-lg=\"4\"] {\n    order: 4;\n  }\n  [flex-order-lg=\"5\"] {\n    order: 5;\n  }\n  [flex-order-lg=\"6\"] {\n    order: 6;\n  }\n  [flex-order-lg=\"7\"] {\n    order: 7;\n  }\n  [flex-order-lg=\"8\"] {\n    order: 8;\n  }\n  [flex-order-lg=\"9\"] {\n    order: 9;\n  }\n  [flex-order-lg=\"10\"] {\n    order: 10;\n  }\n  [flex-order-lg=\"11\"] {\n    order: 11;\n  }\n  [flex-order-lg=\"12\"] {\n    order: 12;\n  }\n  [flex-order-lg=\"13\"] {\n    order: 13;\n  }\n  [flex-order-lg=\"14\"] {\n    order: 14;\n  }\n  [flex-order-lg=\"15\"] {\n    order: 15;\n  }\n  [flex-order-lg=\"16\"] {\n    order: 16;\n  }\n  [flex-order-lg=\"17\"] {\n    order: 17;\n  }\n  [flex-order-lg=\"18\"] {\n    order: 18;\n  }\n  [flex-order-lg=\"19\"] {\n    order: 19;\n  }\n  [flex-order-lg=\"20\"] {\n    order: 20;\n  }\n  [flex-lg] {\n    flex: 1;\n  }\n  [flex-lg-grow] {\n    flex: 1 1 100%;\n    box-sizing: border-box;\n  }\n  [flex-lg-initial] {\n    flex: 0 1 auto;\n    box-sizing: border-box;\n  }\n  [flex-lg-auto] {\n    flex: 1 1 auto;\n    box-sizing: border-box;\n  }\n  [flex-lg-none] {\n    flex: 0 0 auto;\n    box-sizing: border-box;\n  }\n  [flex-lg],\n  [layout=\"row\"] > [flex-lg],\n  [layout-lg=\"row\"] > [flex-lg] {\n    max-height: 100%;\n  }\n  [layout-lg=\"column\"] > [flex-lg],\n  [layout=\"column\"] > [flex-lg] {\n    max-width: 100%;\n  }\n  [flex-lg=\"5\"] {\n    flex: 1 1 5%;\n    max-width: 5%;\n  }\n  [layout=\"row\"] > [flex-lg=\"5\"],\n  [layout-lg=\"row\"] > [flex-lg=\"5\"] {\n    flex: 1 1 5%;\n    max-width: 5%;\n  }\n  [layout=\"column\"] > [flex-lg=\"5\"],\n  [layout-lg=\"column\"] > [flex-lg=\"5\"] {\n    flex: 1 1 5%;\n    max-height: 5%;\n  }\n  [flex-lg=\"10\"] {\n    flex: 1 1 10%;\n    max-width: 10%;\n  }\n  [layout=\"row\"] > [flex-lg=\"10\"],\n  [layout-lg=\"row\"] > [flex-lg=\"10\"] {\n    flex: 1 1 10%;\n    max-width: 10%;\n  }\n  [layout=\"column\"] > [flex-lg=\"10\"],\n  [layout-lg=\"column\"] > [flex-lg=\"10\"] {\n    flex: 1 1 10%;\n    max-height: 10%;\n  }\n  [flex-lg=\"15\"] {\n    flex: 1 1 15%;\n    max-width: 15%;\n  }\n  [layout=\"row\"] > [flex-lg=\"15\"],\n  [layout-lg=\"row\"] > [flex-lg=\"15\"] {\n    flex: 1 1 15%;\n    max-width: 15%;\n  }\n  [layout=\"column\"] > [flex-lg=\"15\"],\n  [layout-lg=\"column\"] > [flex-lg=\"15\"] {\n    flex: 1 1 15%;\n    max-height: 15%;\n  }\n  [flex-lg=\"20\"] {\n    flex: 1 1 20%;\n    max-width: 20%;\n  }\n  [layout=\"row\"] > [flex-lg=\"20\"],\n  [layout-lg=\"row\"] > [flex-lg=\"20\"] {\n    flex: 1 1 20%;\n    max-width: 20%;\n  }\n  [layout=\"column\"] > [flex-lg=\"20\"],\n  [layout-lg=\"column\"] > [flex-lg=\"20\"] {\n    flex: 1 1 20%;\n    max-height: 20%;\n  }\n  [flex-lg=\"25\"] {\n    flex: 1 1 25%;\n    max-width: 25%;\n  }\n  [layout=\"row\"] > [flex-lg=\"25\"],\n  [layout-lg=\"row\"] > [flex-lg=\"25\"] {\n    flex: 1 1 25%;\n    max-width: 25%;\n  }\n  [layout=\"column\"] > [flex-lg=\"25\"],\n  [layout-lg=\"column\"] > [flex-lg=\"25\"] {\n    flex: 1 1 25%;\n    max-height: 25%;\n  }\n  [flex-lg=\"30\"] {\n    flex: 1 1 30%;\n    max-width: 30%;\n  }\n  [layout=\"row\"] > [flex-lg=\"30\"],\n  [layout-lg=\"row\"] > [flex-lg=\"30\"] {\n    flex: 1 1 30%;\n    max-width: 30%;\n  }\n  [layout=\"column\"] > [flex-lg=\"30\"],\n  [layout-lg=\"column\"] > [flex-lg=\"30\"] {\n    flex: 1 1 30%;\n    max-height: 30%;\n  }\n  [flex-lg=\"35\"] {\n    flex: 1 1 35%;\n    max-width: 35%;\n  }\n  [layout=\"row\"] > [flex-lg=\"35\"],\n  [layout-lg=\"row\"] > [flex-lg=\"35\"] {\n    flex: 1 1 35%;\n    max-width: 35%;\n  }\n  [layout=\"column\"] > [flex-lg=\"35\"],\n  [layout-lg=\"column\"] > [flex-lg=\"35\"] {\n    flex: 1 1 35%;\n    max-height: 35%;\n  }\n  [flex-lg=\"40\"] {\n    flex: 1 1 40%;\n    max-width: 40%;\n  }\n  [layout=\"row\"] > [flex-lg=\"40\"],\n  [layout-lg=\"row\"] > [flex-lg=\"40\"] {\n    flex: 1 1 40%;\n    max-width: 40%;\n  }\n  [layout=\"column\"] > [flex-lg=\"40\"],\n  [layout-lg=\"column\"] > [flex-lg=\"40\"] {\n    flex: 1 1 40%;\n    max-height: 40%;\n  }\n  [flex-lg=\"45\"] {\n    flex: 1 1 45%;\n    max-width: 45%;\n  }\n  [layout=\"row\"] > [flex-lg=\"45\"],\n  [layout-lg=\"row\"] > [flex-lg=\"45\"] {\n    flex: 1 1 45%;\n    max-width: 45%;\n  }\n  [layout=\"column\"] > [flex-lg=\"45\"],\n  [layout-lg=\"column\"] > [flex-lg=\"45\"] {\n    flex: 1 1 45%;\n    max-height: 45%;\n  }\n  [flex-lg=\"50\"] {\n    flex: 1 1 50%;\n    max-width: 50%;\n  }\n  [layout=\"row\"] > [flex-lg=\"50\"],\n  [layout-lg=\"row\"] > [flex-lg=\"50\"] {\n    flex: 1 1 50%;\n    max-width: 50%;\n  }\n  [layout=\"column\"] > [flex-lg=\"50\"],\n  [layout-lg=\"column\"] > [flex-lg=\"50\"] {\n    flex: 1 1 50%;\n    max-height: 50%;\n  }\n  [flex-lg=\"55\"] {\n    flex: 1 1 55%;\n    max-width: 55%;\n  }\n  [layout=\"row\"] > [flex-lg=\"55\"],\n  [layout-lg=\"row\"] > [flex-lg=\"55\"] {\n    flex: 1 1 55%;\n    max-width: 55%;\n  }\n  [layout=\"column\"] > [flex-lg=\"55\"],\n  [layout-lg=\"column\"] > [flex-lg=\"55\"] {\n    flex: 1 1 55%;\n    max-height: 55%;\n  }\n  [flex-lg=\"60\"] {\n    flex: 1 1 60%;\n    max-width: 60%;\n  }\n  [layout=\"row\"] > [flex-lg=\"60\"],\n  [layout-lg=\"row\"] > [flex-lg=\"60\"] {\n    flex: 1 1 60%;\n    max-width: 60%;\n  }\n  [layout=\"column\"] > [flex-lg=\"60\"],\n  [layout-lg=\"column\"] > [flex-lg=\"60\"] {\n    flex: 1 1 60%;\n    max-height: 60%;\n  }\n  [flex-lg=\"65\"] {\n    flex: 1 1 65%;\n    max-width: 65%;\n  }\n  [layout=\"row\"] > [flex-lg=\"65\"],\n  [layout-lg=\"row\"] > [flex-lg=\"65\"] {\n    flex: 1 1 65%;\n    max-width: 65%;\n  }\n  [layout=\"column\"] > [flex-lg=\"65\"],\n  [layout-lg=\"column\"] > [flex-lg=\"65\"] {\n    flex: 1 1 65%;\n    max-height: 65%;\n  }\n  [flex-lg=\"70\"] {\n    flex: 1 1 70%;\n    max-width: 70%;\n  }\n  [layout=\"row\"] > [flex-lg=\"70\"],\n  [layout-lg=\"row\"] > [flex-lg=\"70\"] {\n    flex: 1 1 70%;\n    max-width: 70%;\n  }\n  [layout=\"column\"] > [flex-lg=\"70\"],\n  [layout-lg=\"column\"] > [flex-lg=\"70\"] {\n    flex: 1 1 70%;\n    max-height: 70%;\n  }\n  [flex-lg=\"75\"] {\n    flex: 1 1 75%;\n    max-width: 75%;\n  }\n  [layout=\"row\"] > [flex-lg=\"75\"],\n  [layout-lg=\"row\"] > [flex-lg=\"75\"] {\n    flex: 1 1 75%;\n    max-width: 75%;\n  }\n  [layout=\"column\"] > [flex-lg=\"75\"],\n  [layout-lg=\"column\"] > [flex-lg=\"75\"] {\n    flex: 1 1 75%;\n    max-height: 75%;\n  }\n  [flex-lg=\"80\"] {\n    flex: 1 1 80%;\n    max-width: 80%;\n  }\n  [layout=\"row\"] > [flex-lg=\"80\"],\n  [layout-lg=\"row\"] > [flex-lg=\"80\"] {\n    flex: 1 1 80%;\n    max-width: 80%;\n  }\n  [layout=\"column\"] > [flex-lg=\"80\"],\n  [layout-lg=\"column\"] > [flex-lg=\"80\"] {\n    flex: 1 1 80%;\n    max-height: 80%;\n  }\n  [flex-lg=\"85\"] {\n    flex: 1 1 85%;\n    max-width: 85%;\n  }\n  [layout=\"row\"] > [flex-lg=\"85\"],\n  [layout-lg=\"row\"] > [flex-lg=\"85\"] {\n    flex: 1 1 85%;\n    max-width: 85%;\n  }\n  [layout=\"column\"] > [flex-lg=\"85\"],\n  [layout-lg=\"column\"] > [flex-lg=\"85\"] {\n    flex: 1 1 85%;\n    max-height: 85%;\n  }\n  [flex-lg=\"90\"] {\n    flex: 1 1 90%;\n    max-width: 90%;\n  }\n  [layout=\"row\"] > [flex-lg=\"90\"],\n  [layout-lg=\"row\"] > [flex-lg=\"90\"] {\n    flex: 1 1 90%;\n    max-width: 90%;\n  }\n  [layout=\"column\"] > [flex-lg=\"90\"],\n  [layout-lg=\"column\"] > [flex-lg=\"90\"] {\n    flex: 1 1 90%;\n    max-height: 90%;\n  }\n  [flex-lg=\"95\"] {\n    flex: 1 1 95%;\n    max-width: 95%;\n  }\n  [layout=\"row\"] > [flex-lg=\"95\"],\n  [layout-lg=\"row\"] > [flex-lg=\"95\"] {\n    flex: 1 1 95%;\n    max-width: 95%;\n  }\n  [layout=\"column\"] > [flex-lg=\"95\"],\n  [layout-lg=\"column\"] > [flex-lg=\"95\"] {\n    flex: 1 1 95%;\n    max-height: 95%;\n  }\n  [flex-lg=\"100\"] {\n    flex: 1 1 100%;\n    max-width: 100%;\n  }\n  [layout=\"row\"] > [flex-lg=\"100\"],\n  [layout-lg=\"row\"] > [flex-lg=\"100\"] {\n    flex: 1 1 100%;\n    max-width: 100%;\n  }\n  [layout=\"column\"] > [flex-lg=\"100\"],\n  [layout-lg=\"column\"] > [flex-lg=\"100\"] {\n    flex: 1 1 100%;\n    max-height: 100%;\n  }\n  [layout=\"row\"] > [flex-lg=\"33\"],\n  [layout=\"row\"] > [flex-lg=\"33\"],\n  [layout-lg=\"row\"] > [flex-lg=\"33\"],\n  [layout-lg=\"row\"] > [flex-lg=\"33\"] {\n    flex: 1 1 33.33%;\n    max-width: 33.33%;\n  }\n  [layout=\"row\"] > [flex-lg=\"66\"],\n  [layout=\"row\"] > [flex-lg=\"66\"],\n  [layout-lg=\"row\"] > [flex-lg=\"66\"],\n  [layout-lg=\"row\"] > [flex-lg=\"66\"] {\n    flex: 1 1 66.66%;\n    max-width: 66.66%;\n  }\n  [layout=\"column\"] > [flex-lg=\"33\"],\n  [layout=\"column\"] > [flex-lg=\"33\"],\n  [layout-lg=\"column\"] > [flex-lg=\"33\"],\n  [layout-lg=\"column\"] > [flex-lg=\"33\"] {\n    flex: 1 1 33.33%;\n    max-height: 33.33%;\n  }\n  [layout=\"column\"] > [flex-lg=\"66\"],\n  [layout=\"column\"] > [flex-lg=\"66\"],\n  [layout-lg=\"column\"] > [flex-lg=\"66\"],\n  [layout-lg=\"column\"] > [flex-lg=\"66\"] {\n    flex: 1 1 66.66%;\n    max-height: 66.66%;\n  }\n  [layout-lg] {\n    display: flex;\n  }\n  [layout-lg=\"column\"] {\n    flex-direction: column;\n  }\n  [layout-lg=\"row\"] {\n    flex-direction: row;\n  }\n}\n@media (min-width: 1200px) {\n  [flex-order-gt-lg=\"0\"] {\n    order: 0;\n  }\n  [flex-order-gt-lg=\"1\"] {\n    order: 1;\n  }\n  [flex-order-gt-lg=\"2\"] {\n    order: 2;\n  }\n  [flex-order-gt-lg=\"3\"] {\n    order: 3;\n  }\n  [flex-order-gt-lg=\"4\"] {\n    order: 4;\n  }\n  [flex-order-gt-lg=\"5\"] {\n    order: 5;\n  }\n  [flex-order-gt-lg=\"6\"] {\n    order: 6;\n  }\n  [flex-order-gt-lg=\"7\"] {\n    order: 7;\n  }\n  [flex-order-gt-lg=\"8\"] {\n    order: 8;\n  }\n  [flex-order-gt-lg=\"9\"] {\n    order: 9;\n  }\n  [flex-order-gt-lg=\"10\"] {\n    order: 10;\n  }\n  [flex-order-gt-lg=\"11\"] {\n    order: 11;\n  }\n  [flex-order-gt-lg=\"12\"] {\n    order: 12;\n  }\n  [flex-order-gt-lg=\"13\"] {\n    order: 13;\n  }\n  [flex-order-gt-lg=\"14\"] {\n    order: 14;\n  }\n  [flex-order-gt-lg=\"15\"] {\n    order: 15;\n  }\n  [flex-order-gt-lg=\"16\"] {\n    order: 16;\n  }\n  [flex-order-gt-lg=\"17\"] {\n    order: 17;\n  }\n  [flex-order-gt-lg=\"18\"] {\n    order: 18;\n  }\n  [flex-order-gt-lg=\"19\"] {\n    order: 19;\n  }\n  [flex-order-gt-lg=\"20\"] {\n    order: 20;\n  }\n  [flex-gt-lg] {\n    flex: 1;\n  }\n  [flex-gt-lg-grow] {\n    flex: 1 1 100%;\n    box-sizing: border-box;\n  }\n  [flex-gt-lg-initial] {\n    flex: 0 1 auto;\n    box-sizing: border-box;\n  }\n  [flex-gt-lg-auto] {\n    flex: 1 1 auto;\n    box-sizing: border-box;\n  }\n  [flex-gt-lg-none] {\n    flex: 0 0 auto;\n    box-sizing: border-box;\n  }\n  [flex-gt-lg],\n  [layout=\"row\"] > [flex-gt-lg],\n  [layout-gt-lg=\"row\"] > [flex-gt-lg] {\n    max-height: 100%;\n  }\n  [layout-gt-lg=\"column\"] > [flex-gt-lg],\n  [layout=\"column\"] > [flex-gt-lg] {\n    max-width: 100%;\n  }\n  [flex-gt-lg=\"5\"] {\n    flex: 1 1 5%;\n    max-width: 5%;\n  }\n  [layout=\"row\"] > [flex-gt-lg=\"5\"],\n  [layout-gt-lg=\"row\"] > [flex-gt-lg=\"5\"] {\n    flex: 1 1 5%;\n    max-width: 5%;\n  }\n  [layout=\"column\"] > [flex-gt-lg=\"5\"],\n  [layout-gt-lg=\"column\"] > [flex-gt-lg=\"5\"] {\n    flex: 1 1 5%;\n    max-height: 5%;\n  }\n  [flex-gt-lg=\"10\"] {\n    flex: 1 1 10%;\n    max-width: 10%;\n  }\n  [layout=\"row\"] > [flex-gt-lg=\"10\"],\n  [layout-gt-lg=\"row\"] > [flex-gt-lg=\"10\"] {\n    flex: 1 1 10%;\n    max-width: 10%;\n  }\n  [layout=\"column\"] > [flex-gt-lg=\"10\"],\n  [layout-gt-lg=\"column\"] > [flex-gt-lg=\"10\"] {\n    flex: 1 1 10%;\n    max-height: 10%;\n  }\n  [flex-gt-lg=\"15\"] {\n    flex: 1 1 15%;\n    max-width: 15%;\n  }\n  [layout=\"row\"] > [flex-gt-lg=\"15\"],\n  [layout-gt-lg=\"row\"] > [flex-gt-lg=\"15\"] {\n    flex: 1 1 15%;\n    max-width: 15%;\n  }\n  [layout=\"column\"] > [flex-gt-lg=\"15\"],\n  [layout-gt-lg=\"column\"] > [flex-gt-lg=\"15\"] {\n    flex: 1 1 15%;\n    max-height: 15%;\n  }\n  [flex-gt-lg=\"20\"] {\n    flex: 1 1 20%;\n    max-width: 20%;\n  }\n  [layout=\"row\"] > [flex-gt-lg=\"20\"],\n  [layout-gt-lg=\"row\"] > [flex-gt-lg=\"20\"] {\n    flex: 1 1 20%;\n    max-width: 20%;\n  }\n  [layout=\"column\"] > [flex-gt-lg=\"20\"],\n  [layout-gt-lg=\"column\"] > [flex-gt-lg=\"20\"] {\n    flex: 1 1 20%;\n    max-height: 20%;\n  }\n  [flex-gt-lg=\"25\"] {\n    flex: 1 1 25%;\n    max-width: 25%;\n  }\n  [layout=\"row\"] > [flex-gt-lg=\"25\"],\n  [layout-gt-lg=\"row\"] > [flex-gt-lg=\"25\"] {\n    flex: 1 1 25%;\n    max-width: 25%;\n  }\n  [layout=\"column\"] > [flex-gt-lg=\"25\"],\n  [layout-gt-lg=\"column\"] > [flex-gt-lg=\"25\"] {\n    flex: 1 1 25%;\n    max-height: 25%;\n  }\n  [flex-gt-lg=\"30\"] {\n    flex: 1 1 30%;\n    max-width: 30%;\n  }\n  [layout=\"row\"] > [flex-gt-lg=\"30\"],\n  [layout-gt-lg=\"row\"] > [flex-gt-lg=\"30\"] {\n    flex: 1 1 30%;\n    max-width: 30%;\n  }\n  [layout=\"column\"] > [flex-gt-lg=\"30\"],\n  [layout-gt-lg=\"column\"] > [flex-gt-lg=\"30\"] {\n    flex: 1 1 30%;\n    max-height: 30%;\n  }\n  [flex-gt-lg=\"35\"] {\n    flex: 1 1 35%;\n    max-width: 35%;\n  }\n  [layout=\"row\"] > [flex-gt-lg=\"35\"],\n  [layout-gt-lg=\"row\"] > [flex-gt-lg=\"35\"] {\n    flex: 1 1 35%;\n    max-width: 35%;\n  }\n  [layout=\"column\"] > [flex-gt-lg=\"35\"],\n  [layout-gt-lg=\"column\"] > [flex-gt-lg=\"35\"] {\n    flex: 1 1 35%;\n    max-height: 35%;\n  }\n  [flex-gt-lg=\"40\"] {\n    flex: 1 1 40%;\n    max-width: 40%;\n  }\n  [layout=\"row\"] > [flex-gt-lg=\"40\"],\n  [layout-gt-lg=\"row\"] > [flex-gt-lg=\"40\"] {\n    flex: 1 1 40%;\n    max-width: 40%;\n  }\n  [layout=\"column\"] > [flex-gt-lg=\"40\"],\n  [layout-gt-lg=\"column\"] > [flex-gt-lg=\"40\"] {\n    flex: 1 1 40%;\n    max-height: 40%;\n  }\n  [flex-gt-lg=\"45\"] {\n    flex: 1 1 45%;\n    max-width: 45%;\n  }\n  [layout=\"row\"] > [flex-gt-lg=\"45\"],\n  [layout-gt-lg=\"row\"] > [flex-gt-lg=\"45\"] {\n    flex: 1 1 45%;\n    max-width: 45%;\n  }\n  [layout=\"column\"] > [flex-gt-lg=\"45\"],\n  [layout-gt-lg=\"column\"] > [flex-gt-lg=\"45\"] {\n    flex: 1 1 45%;\n    max-height: 45%;\n  }\n  [flex-gt-lg=\"50\"] {\n    flex: 1 1 50%;\n    max-width: 50%;\n  }\n  [layout=\"row\"] > [flex-gt-lg=\"50\"],\n  [layout-gt-lg=\"row\"] > [flex-gt-lg=\"50\"] {\n    flex: 1 1 50%;\n    max-width: 50%;\n  }\n  [layout=\"column\"] > [flex-gt-lg=\"50\"],\n  [layout-gt-lg=\"column\"] > [flex-gt-lg=\"50\"] {\n    flex: 1 1 50%;\n    max-height: 50%;\n  }\n  [flex-gt-lg=\"55\"] {\n    flex: 1 1 55%;\n    max-width: 55%;\n  }\n  [layout=\"row\"] > [flex-gt-lg=\"55\"],\n  [layout-gt-lg=\"row\"] > [flex-gt-lg=\"55\"] {\n    flex: 1 1 55%;\n    max-width: 55%;\n  }\n  [layout=\"column\"] > [flex-gt-lg=\"55\"],\n  [layout-gt-lg=\"column\"] > [flex-gt-lg=\"55\"] {\n    flex: 1 1 55%;\n    max-height: 55%;\n  }\n  [flex-gt-lg=\"60\"] {\n    flex: 1 1 60%;\n    max-width: 60%;\n  }\n  [layout=\"row\"] > [flex-gt-lg=\"60\"],\n  [layout-gt-lg=\"row\"] > [flex-gt-lg=\"60\"] {\n    flex: 1 1 60%;\n    max-width: 60%;\n  }\n  [layout=\"column\"] > [flex-gt-lg=\"60\"],\n  [layout-gt-lg=\"column\"] > [flex-gt-lg=\"60\"] {\n    flex: 1 1 60%;\n    max-height: 60%;\n  }\n  [flex-gt-lg=\"65\"] {\n    flex: 1 1 65%;\n    max-width: 65%;\n  }\n  [layout=\"row\"] > [flex-gt-lg=\"65\"],\n  [layout-gt-lg=\"row\"] > [flex-gt-lg=\"65\"] {\n    flex: 1 1 65%;\n    max-width: 65%;\n  }\n  [layout=\"column\"] > [flex-gt-lg=\"65\"],\n  [layout-gt-lg=\"column\"] > [flex-gt-lg=\"65\"] {\n    flex: 1 1 65%;\n    max-height: 65%;\n  }\n  [flex-gt-lg=\"70\"] {\n    flex: 1 1 70%;\n    max-width: 70%;\n  }\n  [layout=\"row\"] > [flex-gt-lg=\"70\"],\n  [layout-gt-lg=\"row\"] > [flex-gt-lg=\"70\"] {\n    flex: 1 1 70%;\n    max-width: 70%;\n  }\n  [layout=\"column\"] > [flex-gt-lg=\"70\"],\n  [layout-gt-lg=\"column\"] > [flex-gt-lg=\"70\"] {\n    flex: 1 1 70%;\n    max-height: 70%;\n  }\n  [flex-gt-lg=\"75\"] {\n    flex: 1 1 75%;\n    max-width: 75%;\n  }\n  [layout=\"row\"] > [flex-gt-lg=\"75\"],\n  [layout-gt-lg=\"row\"] > [flex-gt-lg=\"75\"] {\n    flex: 1 1 75%;\n    max-width: 75%;\n  }\n  [layout=\"column\"] > [flex-gt-lg=\"75\"],\n  [layout-gt-lg=\"column\"] > [flex-gt-lg=\"75\"] {\n    flex: 1 1 75%;\n    max-height: 75%;\n  }\n  [flex-gt-lg=\"80\"] {\n    flex: 1 1 80%;\n    max-width: 80%;\n  }\n  [layout=\"row\"] > [flex-gt-lg=\"80\"],\n  [layout-gt-lg=\"row\"] > [flex-gt-lg=\"80\"] {\n    flex: 1 1 80%;\n    max-width: 80%;\n  }\n  [layout=\"column\"] > [flex-gt-lg=\"80\"],\n  [layout-gt-lg=\"column\"] > [flex-gt-lg=\"80\"] {\n    flex: 1 1 80%;\n    max-height: 80%;\n  }\n  [flex-gt-lg=\"85\"] {\n    flex: 1 1 85%;\n    max-width: 85%;\n  }\n  [layout=\"row\"] > [flex-gt-lg=\"85\"],\n  [layout-gt-lg=\"row\"] > [flex-gt-lg=\"85\"] {\n    flex: 1 1 85%;\n    max-width: 85%;\n  }\n  [layout=\"column\"] > [flex-gt-lg=\"85\"],\n  [layout-gt-lg=\"column\"] > [flex-gt-lg=\"85\"] {\n    flex: 1 1 85%;\n    max-height: 85%;\n  }\n  [flex-gt-lg=\"90\"] {\n    flex: 1 1 90%;\n    max-width: 90%;\n  }\n  [layout=\"row\"] > [flex-gt-lg=\"90\"],\n  [layout-gt-lg=\"row\"] > [flex-gt-lg=\"90\"] {\n    flex: 1 1 90%;\n    max-width: 90%;\n  }\n  [layout=\"column\"] > [flex-gt-lg=\"90\"],\n  [layout-gt-lg=\"column\"] > [flex-gt-lg=\"90\"] {\n    flex: 1 1 90%;\n    max-height: 90%;\n  }\n  [flex-gt-lg=\"95\"] {\n    flex: 1 1 95%;\n    max-width: 95%;\n  }\n  [layout=\"row\"] > [flex-gt-lg=\"95\"],\n  [layout-gt-lg=\"row\"] > [flex-gt-lg=\"95\"] {\n    flex: 1 1 95%;\n    max-width: 95%;\n  }\n  [layout=\"column\"] > [flex-gt-lg=\"95\"],\n  [layout-gt-lg=\"column\"] > [flex-gt-lg=\"95\"] {\n    flex: 1 1 95%;\n    max-height: 95%;\n  }\n  [flex-gt-lg=\"100\"] {\n    flex: 1 1 100%;\n    max-width: 100%;\n  }\n  [layout=\"row\"] > [flex-gt-lg=\"100\"],\n  [layout-gt-lg=\"row\"] > [flex-gt-lg=\"100\"] {\n    flex: 1 1 100%;\n    max-width: 100%;\n  }\n  [layout=\"column\"] > [flex-gt-lg=\"100\"],\n  [layout-gt-lg=\"column\"] > [flex-gt-lg=\"100\"] {\n    flex: 1 1 100%;\n    max-height: 100%;\n  }\n  [layout=\"row\"] > [flex-gt-lg=\"33\"],\n  [layout=\"row\"] > [flex-gt-lg=\"33\"],\n  [layout-gt-lg=\"row\"] > [flex-gt-lg=\"33\"],\n  [layout-gt-lg=\"row\"] > [flex-gt-lg=\"33\"] {\n    flex: 1 1 33.33%;\n    max-width: 33.33%;\n  }\n  [layout=\"row\"] > [flex-gt-lg=\"66\"],\n  [layout=\"row\"] > [flex-gt-lg=\"66\"],\n  [layout-gt-lg=\"row\"] > [flex-gt-lg=\"66\"],\n  [layout-gt-lg=\"row\"] > [flex-gt-lg=\"66\"] {\n    flex: 1 1 66.66%;\n    max-width: 66.66%;\n  }\n  [layout=\"column\"] > [flex-gt-lg=\"33\"],\n  [layout=\"column\"] > [flex-gt-lg=\"33\"],\n  [layout-gt-lg=\"column\"] > [flex-gt-lg=\"33\"],\n  [layout-gt-lg=\"column\"] > [flex-gt-lg=\"33\"] {\n    flex: 1 1 33.33%;\n    max-height: 33.33%;\n  }\n  [layout=\"column\"] > [flex-gt-lg=\"66\"],\n  [layout=\"column\"] > [flex-gt-lg=\"66\"],\n  [layout-gt-lg=\"column\"] > [flex-gt-lg=\"66\"],\n  [layout-gt-lg=\"column\"] > [flex-gt-lg=\"66\"] {\n    flex: 1 1 66.66%;\n    max-height: 66.66%;\n  }\n  [layout-gt-lg] {\n    display: flex;\n  }\n  [layout-gt-lg=\"column\"] {\n    flex-direction: column;\n  }\n  [layout-gt-lg=\"row\"] {\n    flex-direction: row;\n  }\n  [hide]:not([show-gt-xs]):not([show-gt-sm]):not([show-gt-md]):not([show-gt-lg]):not([show]),\n  [hide-gt-xs]:not([show-gt-xs]):not([show-gt-sm]):not([show-gt-md]):not([show-gt-lg]):not([show]),\n  [hide-gt-sm]:not([show-gt-xs]):not([show-gt-sm]):not([show-gt-md]):not([show-gt-lg]):not([show]),\n  [hide-gt-md]:not([show-gt-xs]):not([show-gt-sm]):not([show-gt-md]):not([show-gt-lg]):not([show]),\n  [hide-gt-lg]:not([show-gt-xs]):not([show-gt-sm]):not([show-gt-md]):not([show-gt-lg]):not([show]) {\n    display: none;\n  }\n}\n/* ========================================\n    CUSTOM\n   ======================================== */\n/*  ========================================\n    COLORS\n    ======================================== */\n/*  ========================================\n    FONTS\n    ======================================== */\n/*  ========================================\n    BREAKPOINTS\n    ======================================== */\n/*  ========================================\n    Z-INDEXES\n    ======================================== */\n/*  ========================================\n    DURATIONS\n    ======================================== */\n/*  ========================================\n    DURATIONS\n    ======================================== */\n/* ========================================\nMIXINS\n* General Use Mixins to ease up reoccuring styles\n* No Components!\n======================================== */\n@keyframes lsd-background {\n  0% {\n    background: #bf6a40;\n  }\n  25% {\n    background: #55bf40;\n  }\n  50% {\n    background: #4095bf;\n  }\n  75% {\n    background: #aa40bf;\n  }\n  100% {\n    background: #bf6a40;\n  }\n}\n@keyframes lsd-border {\n  0% {\n    border-color: #bf6a40;\n  }\n  25% {\n    border-color: #55bf40;\n  }\n  50% {\n    border-color: #4095bf;\n  }\n  75% {\n    border-color: #aa40bf;\n  }\n  100% {\n    border-color: #bf6a40;\n  }\n}\n@keyframes scale-pulse {\n  0% {\n    transform: scale(1);\n  }\n  100% {\n    transform: scale(1.5);\n  }\n}\n/* ========================================\nBUTTON COMPONENT\n* Defines a full-width colorful container\n*\n* @size: small|medium|large|custom(e.g.:5%)\n* @indent: small|medium|large|custom(e.g.:5%)\n* @color: color\n======================================== */\n.button.outline {\n  display: inline-block;\n  user-select: none;\n  width: auto;\n  margin-top: 1em;\n  border-radius: .1em;\n  font-size: 1em;\n  cursor: pointer;\n  line-height: 1;\n  text-transform: uppercase;\n  transition: all 0.33s ease;\n  font-family: 'Coming Soon', cursive;\n  background-color: transparent;\n  color: #fafafa;\n  border: 1px solid #fafafa;\n}\n.button.outline:hover {\n  background-color: #fafafa;\n  color: #539fc6;\n}\n.button.reverse {\n  display: inline-block;\n  user-select: none;\n  width: auto;\n  margin-top: 1em;\n  border-radius: .1em;\n  font-size: 1em;\n  cursor: pointer;\n  line-height: 1;\n  text-transform: uppercase;\n  transition: all 0.33s ease;\n  font-family: 'Coming Soon', cursive;\n  background-color: transparent;\n  color: #539fc6;\n  border: 1px solid #539fc6;\n}\n.button.reverse:hover {\n  color: #fafafa;\n  background-color: #539fc6;\n}\n/* ========================================\nCARD COMPONENT\n* Defines a rectangular area, used for a specific kind of content\n* containing a title, description and actions (buttons/icons)\n* a card is often used together with grid systems to evenly\n* distribute related content.\n* Cards contain little and scannable content to quickly get to the desired\n* full content. Thus, a description should contain not more than 140 letters\n*\n* @type\n======================================== */\nnav {\n  position: relative;\n}\nnav .toggle-navigation {\n  display: none;\n}\nnav ul {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  display: block;\n}\n@media screen and (min-width: 960px) {\n  nav ul {\n    display: flex;\n  }\n}\nnav li {\n  display: block;\n}\nnav li a {\n  display: inline-block;\n  font-family: 'Coming Soon', cursive;\n  text-transform: uppercase;\n  color: #050505;\n  margin: 0 0 0 2em;\n  margin-top: 0 !important;\n  line-height: 3em;\n}\nnav li a:hover {\n  color: #050505;\n}\n@media screen and (max-width: 960px) {\n  nav {\n    display: block;\n    width: 100%;\n  }\n  nav li {\n    border-top: 1px solid rgba(5, 5, 5, 0.15);\n    width: 100%;\n  }\n  nav li a {\n    display: block;\n    margin-left: 0;\n    line-height: 2.5em;\n    width: 100%;\n  }\n}\n@media screen and (max-width: 960px) {\n  nav ul {\n    display: none;\n  }\n  nav.active ul {\n    display: block;\n  }\n  nav .toggle-navigation {\n    display: block;\n    position: absolute;\n    right: 0;\n    font-size: 2.5em;\n    top: -1.25em;\n    cursor: pointer;\n  }\n}\n/* ========================================\nSTRIPE COMPONENT\n* Defines a full-width colorful container\n*\n* @padding: small|medium|large|custom(e.g.:5%)\n* @width: small|medium|large|custom(e.g.:300)\n* this value is substracted from the current breakpoint\n* @color: color\n======================================== */\n/* ========================================\nBASE\n* Contains HTML default elements (b,i,u,table...)\n* Does not contain classes, ids\n* Can implement mixins\n======================================== */\n* {\n  box-sizing: border-box;\n}\n::-webkit-scrollbar {\n  width: .5em;\n}\n::-webkit-scrollbar-thumb {\n  background: rgba(250, 250, 250, 0.5);\n  border-radius: 1em;\n}\n::-webkit-scrollbar-track {\n  background: rgba(5, 5, 5, 0.5);\n  border-radius: 1em;\n}\n/*  ========================================\n    BLOCK ELEMENTS\n    ======================================== */\nbody,\nhtml {\n  background-color: #050505;\n  overflow: hidden;\n  min-width: 320px;\n  font-family: 'Coming Soon', cursive;\n  font-weight: normal;\n  font-size: 16px;\n  line-height: 1.5em;\n  color: #fafafa;\n  margin: 0;\n  padding: 0;\n  height: 100%;\n  width: 100%;\n}\ntable {\n  margin: 1em 0 2em 0;\n  border-spacing: 0;\n  width: 100%;\n}\ntable thead {\n  background: #ededed;\n}\ntable th {\n  font-family: 'Coming Soon', cursive, sans-serif;\n  font-weight: normal;\n  text-align: left;\n  background: #ededed;\n  vertical-align: top;\n}\ntable tr th,\ntable tr td {\n  vertical-align: top;\n  padding: .75em .75em .25em .5em;\n  border-bottom: 1px solid #e0e0e0;\n}\n/*  ========================================\n    TEXTUAL/CONTENT ELEMENTS\n    ======================================== */\nhr {\n  margin: 1em 0;\n  border: none;\n  width: 100%;\n  height: .1rem;\n  background-color: #858585;\n}\np {\n  padding: 0;\n  margin: 1em 0;\n  line-height: 1.5em;\n  word-wrap: break-word;\n}\np:first-child {\n  margin-top: 0;\n}\np:last-child {\n  margin-bottom: 0;\n}\na {\n  position: relative;\n  transition: all 0.33s ease;\n  color: #66c653;\n  text-decoration: none;\n  cursor: pointer;\n  outline: 0;\n}\na:hover {\n  color: #66c653;\n}\na img {\n  border: none;\n  outline: none;\n}\na p,\na span {\n  cursor: pointer;\n}\nimg {\n  max-width: 100%;\n  height: auto;\n}\nul {\n  list-style: square;\n}\nul,\nol {\n  padding: 0 0 0 1em;\n  margin-bottom: 0;\n}\nol {\n  list-style-type: decimal;\n}\nol ol {\n  list-style-type: lower-alpha;\n}\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  margin: 0;\n  margin: 1em 0;\n  line-height: 1.25em;\n  text-transform: uppercase;\n  font-family: 'Coming Soon', cursive;\n  font-weight: 400;\n}\nb,\nstrong {\n  font-weight: normal;\n  font-family: 'Coming Soon', cursive, sans-serif;\n}\nh1 {\n  color: #66c653;\n}\nh2 {\n  font-size: 1.5em;\n}\nh3,\nh3 a {\n  font-size: 1.15em;\n  color: #66c653;\n}\nh4 {\n  font-size: 1rem;\n  font-family: 'Coming Soon', cursive, sans-serif;\n  color: #66c653;\n}\n/*  ========================================\n    FORM ELEMENTS\n    ======================================== */\nfieldset {\n  margin: 0;\n  padding: 0;\n  border: 0;\n}\n/* ========================================\nLAYOUT\n* The Layout contains a set of configurations\n* Other than assigning classes to your markup, you assign your style to your html.\n* should contain very basic theming\n======================================== */\n* {\n  box-sizing: border-box;\n  transition: all 0.33s ease;\n}\n.background-video {\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: 100%;\n  width: 100%;\n  object-fit: cover;\n  z-index: 1000;\n  pointer-events: none;\n  -webkit-filter: blur(0.5em);\n}\n.map {\n  width: 100px;\n  height: 100px;\n  margin: 5px;\n  background-color: #539fc6;\n  border: 1px solid black;\n}\napp,\nnavigation {\n  display: block;\n  height: 100%;\n  width: 100%;\n}\nnav {\n  height: 100%;\n  padding: 1em;\n  background: rgba(5, 5, 5, 0.5);\n}\nnav ul {\n  height: 100%;\n}\nnav ul li {\n  display: inline-block;\n  user-select: none;\n  width: auto;\n  margin-top: 1em;\n  border-radius: .1em;\n  font-size: 1em;\n  cursor: pointer;\n  line-height: 1;\n  text-transform: uppercase;\n  transition: all 0.33s ease;\n  font-family: 'Coming Soon', cursive;\n  background-color: #539fc6;\n  color: #fafafa;\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  padding: .5em;\n  margin: 1em 0;\n}\nnav ul li:hover {\n  box-sizing: border-box;\n  animation-name: lsd-background;\n  animation-duration: 3s;\n  animation-iteration-count: infinite;\n  color: #fafafa;\n}\nnav ul li:hover .fa {\n  transform: scale(1.5);\n  animation: 1s scale-pulse infinite;\n  animation-direction: alternate;\n}\nmain {\n  width: 100%;\n  height: 100%;\n  z-index: 2000;\n  position: relative;\n}\nh1 {\n  -webkit-mask: url(" + __webpack_require__(20) + ");\n  -webkit-mask-size: 10em;\n  -webkit-mask-repeat: no-repeat;\n  background: red;\n  color: #fafafa;\n  animation: lsd-background 10s infinite;\n  padding: 2em 4em;\n  height: 5em;\n  margin: 1.5em 0 2em 15%;\n  width: 100%;\n}\nsection.ui {\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: 100%;\n  width: 100%;\n}\nsection.ui > div {\n  background: rgba(5, 5, 5, 0.5);\n  width: 70%;\n  height: 60%;\n  margin-left: 15%;\n  overflow-y: scroll;\n  padding: 2em;\n}\nul.breadcrumbs {\n  padding: 0;\n  margin: 0;\n  display: flex;\n}\nul.breadcrumbs li {\n  margin: 0;\n  list-style: none;\n  max-width: 20em;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n}\nul.breadcrumbs li:not(:last-child):after {\n  content: \">\";\n  padding: 0 .25em;\n}\na.button {\n  display: inline-block;\n  user-select: none;\n  width: auto;\n  margin-top: 1em;\n  border-radius: .1em;\n  font-size: 1em;\n  cursor: pointer;\n  line-height: 1;\n  text-transform: uppercase;\n  transition: all 0.33s ease;\n  font-family: 'Coming Soon', cursive;\n  background-color: #539fc6;\n  color: #fafafa;\n}\na.button:hover {\n  box-sizing: border-box;\n  animation-name: lsd-background;\n  animation-duration: 3s;\n  animation-iteration-count: infinite;\n  color: #fafafa;\n}\n.content {\n  padding: 2em 0;\n  background-color: #fafafa;\n  width: 100%;\n  padding-top: large;\n  padding-bottom: large;\n  padding-top: 4em;\n  padding-bottom: 4em;\n}\n.content > * {\n  margin: 0 auto;\n}\n@media screen and (max-width: 600px) {\n  .content > * {\n    padding-left: 5%;\n    padding-right: 5%;\n  }\n}\n@media screen and (min-width: 600px) {\n  .content > * {\n    width: 599.33333333px;\n  }\n}\n@media screen and (min-width: 960px) {\n  .content > * {\n    width: 959px;\n  }\n}\n@media screen and (min-width: 1200px) {\n  .content > * {\n    width: 1198px;\n  }\n}\n.content footer {\n  margin-top: 4em;\n}\n.content.article article header {\n  margin-bottom: 4em;\n}\n.content.article article > div h1,\n.content.article article > div h2,\n.content.article article > div h3,\n.content.article article > div h4 {\n  color: #66c653;\n}\n.content.article article > div h1 span,\n.content.article article > div h2 span,\n.content.article article > div h3 span,\n.content.article article > div h4 span {\n  display: block;\n  font-family: 'Coming Soon', cursive, sans-serif;\n}\n.content.article article > div h1 span:after,\n.content.article article > div h2 span:after,\n.content.article article > div h3 span:after,\n.content.article article > div h4 span:after {\n  display: none;\n}\n.content.article article > div ul,\n.content.article article > div ol {\n  padding-left: 1.5em;\n}\n.content.article article > div ul {\n  list-style: square;\n}\n.content.article article > div ul.toc-indentation {\n  list-style: square !important;\n}\n.content.article article > div ol {\n  list-style: decimal;\n}\n.content.article article > div img:not(.inline-image) {\n  margin: 1em 0;\n  display: block;\n  border-radius: .25em;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);\n  transition: all 0.33s ease-in-out;\n}\n.content.article article > div ul img:not(.inline-image),\n.content.article article > div ol img:not(.inline-image) {\n  margin: .75em 0 1.25em 0;\n}\n.content.article article > div img {\n  width: auto;\n  display: block;\n}\n.content.article article > div table img {\n  width: auto;\n  height: auto;\n  margin: 0;\n}\n.content.article article > div img[align=center] {\n  display: block;\n  margin: 0 auto;\n}\n.content.article article > div img[align=left] {\n  float: left;\n  margin: 5px 4em 4em 0;\n  max-width: 40%;\n}\n.content.article article > div img[align=right] {\n  float: right;\n  margin: 5px 0 4em 4em;\n  max-width: 40%;\n}\n.content.article article > div img.emoticon {\n  margin: 0;\n  display: inline-block;\n}\n.content.article article > div p em {\n  font-style: italic;\n}\n.content.article article > div blockquote {\n  margin: 1em 0 1.8em 0;\n  padding: 0 0 0 2em;\n  border-left: 0.1em solid #66c653;\n}\n.content.article article > div blockquote p:first-child,\n.content.article article > div blockquote p:last-child {\n  padding: 0;\n}\n.content.article article > div p > a.button {\n  display: inline-block;\n  user-select: none;\n  width: auto;\n  margin-top: 1em;\n  border-radius: .1em;\n  font-size: 1em;\n  cursor: pointer;\n  line-height: 1;\n  text-transform: uppercase;\n  transition: all 0.33s ease;\n  font-family: 'Coming Soon', cursive;\n  background-color: transparent;\n  color: #539fc6;\n  border: 1px solid #539fc6;\n}\n.content.article article > div p > a.button:hover {\n  color: #fafafa;\n  background-color: #539fc6;\n}\n.content.article article > div ul.toc-indentation,\n.content.article article > div ol.toc-indentation {\n  margin-left: 2em !important;\n}\n.content.article article > div .panel {\n  padding: 1em 1em 1em 1.5em;\n  margin: 0 0;\n  background-color: #fafafa;\n}\n.content.article article > div .panel.hs-cta-panel {\n  margin: 1.5em 0;\n}\n.content.article article > div .panel.hs-cta-panel .panelContent {\n  padding: .75em 2em;\n}\n.content.article article > div .panel .panelContent {\n  padding: 2.5em;\n}\n.content.article article > div .panel .panelContent p > strong:first-child {\n  display: block;\n  font-family: 'Coming Soon', cursive, sans serif;\n  font-weight: normal;\n  font-size: 1.2em;\n  line-height: 1.8em;\n  text-transform: uppercase;\n  color: #66c653;\n}\n.content.article article > div .panel .panelContent img[align=right] {\n  width: 25%;\n}\n.content.article article > div .panel :after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n.content.article article > div .panel:not(.subtle) a {\n  display: inline-block;\n  user-select: none;\n  width: auto;\n  margin-top: 1em;\n  border-radius: .1em;\n  font-size: 1em;\n  cursor: pointer;\n  line-height: 1;\n  text-transform: uppercase;\n  transition: all 0.33s ease;\n  font-family: 'Coming Soon', cursive;\n  background-color: #539fc6;\n  color: #fafafa;\n}\n.content.article article > div .panel:not(.subtle) a:hover {\n  box-sizing: border-box;\n  animation-name: lsd-background;\n  animation-duration: 3s;\n  animation-iteration-count: infinite;\n  color: #fafafa;\n}\n.content.article article > div .panel.code {\n  padding: 0 0 1em;\n}\n.content.article article > div .panel.code pre {\n  margin: 0;\n  font-size: .8em;\n  line-height: 1.2em;\n  overflow: auto;\n  padding: 1em;\n  border: 1px solid rgba(5, 5, 5, 0.5);\n  border-radius: .25em;\n}\n.content.article article > div ol li .admonition,\n.content.article article > div ul li .admonition {\n  margin-top: 0;\n}\n.content.article article > div .refresh-macro,\n.content.article article > div .refresh-issues-bottom {\n  display: none;\n}\n", ""]);
	
	// exports


/***/ },
/* 19 */
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
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "783be4b39aba844ce0565e1e0de3ddec.svg";

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
]);
//# sourceMappingURL=bundle.js.map