/*!
 * Cube v3.1.14-beta.3
 */
(function (globalObject, CubeName) {
  function emptyFn() {} //empty fn

  function d(a, b) {
    if (1 === arguments.length) return j(a);
    Cube.css(j(a), b, a)
    return a
  }

  function e(a) {
    return function (b, c, d) {
      if (2 === arguments.length && 'function' === typeof c) {
        d = c
        c = null
        Cube.use(b, a, d)
      } else {
        Cube.use(b, a, function (a) {
          a = Cube.css(a, c, b),
            d && d(a)
        })
      }
    }
  }

  function f(a) {
    var b = a.indexOf ? a.indexOf(":") : 0;
    return 0 < b ? q[a.substr(0, b)] + a.substr(b + 1) : ''
  }

  function g(a) {
    for (var maxLength = a.length, i = 0; i < maxLength; i++) {
      var b = a[i]
      if (-1 === b.indexOf(":")) {
        if (0 === b.indexOf('./')) {
          a[i] = b.substr(1)
        } else if ('/' !== b[0]) {
          a[i] = '/' + b
        }
      }
    }
    return a
  }

  function h() {
    if (D.length) return false;
    for (var a in A) {
      if (A.hasOwnProperty(a)) {
        return false;
      }
    }
    return true
  }

  function i(a, ref) {
    //a 模块 list
    //b ref
    'string' === typeof a && (a = [a]);
    if (initState) {
      a.forEach(function (a) {
        if (!modules[a]) {
          var c = document.createElement('script');
          c.type = 'text/javascript'
          c.async = 'true'
          c.charset = charset
          c.onerror = () => {
            l(a, [], () => {
              console.error(`load module: ${a} failed.`)
            })
          };
          var d = f(a),
            e = d || r + a,
            g = [];
          version && g.push(version)
          debug && (g.push('m'), g.push('ref=' + ref))
          c.src = g.length ? e + '?' + g.join('&') : e
          document.querySelector('head').appendChild(c)
          modules[a] = {
            exports: {},
            loaded: false,
            fired: false
          }
          A[a] = true
        }
      })
      return h() && k()
    } else {
      return void D.push([a, ref])
    }

  }

  function j(moduleName) {
    function c() {
      var c = modules[moduleName];
      if (!c) throw new Error('Cube Error: Cannot find module \'' + moduleName + '\'');
      if (c.fired) {
        c.fired = true
        c.exports = c.fn.apply(global, [c, c.exports, d, e(moduleName), x, global])
      }
      return c.exports;
    }
    if (strict) return c();
    try {
      return c()
    } catch (a) {
      console.error(a)
      return {}
    }
  }

  function k() {
    var a, b;
    for (a in w) {
      if (w.hasOwnProperty(a)) {
        b = a.split(',')
        b.forEach(function (b) {
          var c = 0;
          j(b)
          w[a].forEach(function (a) {
            var d = a(modules[b].exports);
            d && c++
          })
          w[a].length === c && delete w[a]
        })
      }
    }

  }

  function Cube(moduleName, moduleList, callback) {
    // moduleName
    // 依赖名字
    // callback
    modules[moduleName] || (modules[moduleName] = { //初始化
      exports: {},
      loaded: false,
      fired: false
    });
    var d = modules[moduleName];
    d.fn = callback
    d.loaded = true
    delete A[moduleName]
    i(moduleList, moduleName)
  }
  var version,
    r = '',
    q = {},
    charset = 'utf-8',
    strict = true,
    debug = true,
    w = {},
    x = {
      env: {
        NODE_ENV: 'production'
      }
    },
    global = void 0,
    modules = {},
    A = {},
    initState = false,
    D = [];
  Cube.toString = function () {
    return 'Cube:v3.1.14-beta.3'
  }
  Cube.init = function (config) {
    config.base && '/' !== config.base && (r = config.base.replace(/\/$/, ''))
    if (config.remoteBase) {
      for (var b in config.remoteBase) {
        config.remoteBase.hasOwnProperty(b) && (q[b] = config.remoteBase[b].replace(/\/$/, ''));
      }
    }

    config.charset && (charset = config.charset)
    config.version && (version = config.version)
    void 0 !== config.debug && (debug = config.debug)
    void 0 !== config.strict && (strict = config.strict)
    config.env && (x.env.NODE_ENV = config.env)
    config.global && (global = config.global)
    initState = true;
    while (D.length) {
      var c = D.shift();
      i(c[0], c[1])
    }
    return this
  }
  Cube.use = function (moduleName, d, e, f) {
    /*
      b  moduleName
      d  calback
      e  
      f  
      c 空函数
    */
    if (!moduleName) {
      throw new Error('Cube.use(moduleName) moduleName is undefined!');
    } else {
      if ('function' === typeof d) {
        f = e,
          e = d,
          d = undefined
      }

      d || (d = 'Cube.use')
      e = e || emptyFn

      'string' === typeof moduleName && (moduleName = [moduleName]) // 路径转化

      f || (moduleName = g(moduleName))

      w[moduleName] || (w[moduleName] = [])

      w[moduleName].push(function () {
          var c = [],
            d = moduleName.length,
            f = false;
          return function (b) {
            if (!f) {
              c.push(b)
              if (c.length === d) {
                f = true,
                  e.apply(global, c);
                return true
              }
            }
          }
        }()),
        i(moduleName, d);
      return this
    }
  }
  Cube.register = function (moduleName, exportObject) {
    if (modules[moduleName]) {
      console.error('Cube Error: Module \'' + moduleName + '\' already registered')
    } else {
      modules[moduleName] = {
        exports: exportObject,
        fn: emptyFn,
        loaded: true,
        fired: true
      }
      return this
    }
  };
  var F = {};
  Cube.css = function (cssText, ns, mod) {
    if (cssText) {
      var d = mod + '@' + ns;
      if (!F[d]) {
        F[d] = true
        if (ns) {
          cssText = cssText.replace(/([^};]+)(\{[^}]+\})/g, function (a, c, d) {
            var e = c.split(',').map(function (a) {
              return ns + ' ' + a.trim()
            });
            return e.join(',') + d
          })
        }
        var e = document.createElement('style');
        e.setAttribute('type', 'text/css')
        e.setAttribute('mod', mod)
        ns && e.setAttribute('ns', ns)
        document.querySelector('head').appendChild(e)
        e.innerHTML = cssText
        return cssText;
      }
    }
  }
  Cube.debug = function () {
    if (window.localStorage && window.addEventListener) {
      localStorage.cube = 'debug'
      location.reload()
    } else {
      console.error('Cube Error: Cannot debug, your browser does not support localStorage or addEventListener')
    }
  }
  Cube.cache = function () {
    var unloaded = {};
    var unfired = {};
    for (var a in modules) {
      if (modules.hasOwnProperty(a)) {
        var b = modules[a]
        b.loaded || (unloaded[a] = b)
        b.fired || (unfired[a] = b)
      }
    }
    console.info('modules:', modules)
    console.info('unloaded:', unloaded)
    console.info('unfired:', unfired)
  }
  if (window.localStorage && 'debug' === localStorage.cube) {
    debug = true
    window.addEventListener('load', Cube.cache)
  }
  CubeName = CubeName || 'Cube'
  globalObject[CubeName] = Cube
  if (globalObject[CubeName]) {
    console.error('Cube Error: window.' + CubeName + ' already in using, replace the last "null" param in cube.js')
  } else {
    globalObject[CubeName] = Cube
  }

  var currentScript = document.currentScript;
  if (currentScript) {
    var dataset = currentScript.dataset;
    if (dataset.base) {
      Cube.init(dataset)
      Cube.use(dataset.main || 'index.js', function (a) {
        a.run && a.run()
      })
    }
  }
})(window, null);
