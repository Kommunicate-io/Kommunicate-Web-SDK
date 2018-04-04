! function(e) {
    function t(a) {
        if (n[a]) return n[a].exports;
        var i = n[a] = {
            i: a,
            l: !1,
            exports: {}
        };
        return e[a].call(i.exports, i, i.exports, t), i.l = !0, i.exports
    }
    var n = {};
    t.m = e, t.c = n, t.d = function(e, n, a) {
        t.o(e, n) || Object.defineProperty(e, n, {
            configurable: !1,
            enumerable: !0,
            get: a
        })
    }, t.n = function(e) {
        var n = e && e.__esModule ? function() {
            return e.default
        } : function() {
            return e
        };
        return t.d(n, "a", n), n
    }, t.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }, t.p = "/", t(t.s = 11)
}([function(e, t, n) {
    "use strict";

    function a(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }
    var i = n(1),
        r = n(4),
        o = n(12),
        c = n(13),
        u = n(7),
        s = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var a = t[n];
                    a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                }
            }
            return function(t, n, a) {
                return n && e(t.prototype, n), a && e(t, a), t
            }
        }(),
        l = function() {
            function e() {
                a(this, e)
            }
            return s(e, [{
                key: "showError",
                value: function(e) {
                    var t = window.document.getElementById(r.a.CB_ERROR);
                    window.document.getElementById(r.a.CB_PLACE_HOLDER).style.display = "none", t.innerHTML = e, t.style.display = "block"
                }
            }], [{
                key: "getDomain",
                value: function() {
                    var e = this.getCbInstance();
                    return e.domain ? e.domain : window.isDev ? o.a.DEV_DOMAIN.replace("${site}", e.site) : o.a.PROD_DOMAIN.replace("${site}", e.site)
                }
            }, {
                key: "getCbInstance",
                value: function() {
                    var e = document.getElementById(r.a.CONTAINER);
                    return e && e.cbInstance
                }
            }, {
                key: "createContainer",
                value: function() {
                    var e = window.document.createElement("div");
                    return e.id = r.a.CONTAINER, this.setCssStyle(e, "container"), document.body.insertBefore(e, null), e
                }
            }, {
                key: "setCssStyle",
                value: function(e, t) {
                    Object.keys(c.a[t]).forEach(function(n) {
                        if (c.a[t][n] instanceof Array) {
                            c.a[t][n].forEach(function(t) {
                                return e.style[n] = t
                            })
                        } else e.style[n] = c.a[t][n]
                    })
                }
            }, {
                key: "isMobileOrTablet",
                value: function() {
                    var e = !1;
                    return function(t) {
                        (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(t) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0, 4))) && (e = !0)
                    }(navigator.userAgent || navigator.vendor || window.opera), e && navigator.userAgent.match(/iPhone/i) && (navigator.userAgent.match(/FBMD/i) || navigator.userAgent.match(/Instagram/i)) && (e = !1), e
                }
            }, {
                key: "sendLog",
                value: function(t) {
                    try {
                        var n = document.getElementById(r.a.UTILITY_FRAME),
                            a = {};
                        a.key = u.a.LOGGING, Object.keys(t.timeLogs).forEach(function(e) {
                            a[e] = t.timeLogs[e]
                        }), t.type == i.a.CHECKOUT && (a[u.a.HP_URL] = t.url), n.contentWindow.postMessage(a, e.getDomain())
                    } catch (e) {}
                }
            }]), e
        }();
    t.a = l
}, function(e, t, n) {
    "use strict";
    n.d(t, "a", function() {
        return a
    }), n.d(t, "b", function() {
        return i
    });
    var a;
    ! function(e) {
        e[e.CHECKOUT = 0] = "CHECKOUT", e[e.PORTAL = 1] = "PORTAL"
    }(a || (a = {}));
    var i;
    ! function(e) {
        e[e.AUTH_INTITIATED = 0] = "AUTH_INTITIATED", e[e.AUTHENTICATED = 1] = "AUTHENTICATED"
    }(i || (i = {}))
}, function(e, t, n) {
    "use strict";
    var a = n(14),
        i = n(0),
        r = {};
    Object.keys(a.a).forEach(function(e) {
        r[e.toLowerCase()] = function(t, n) {
            var r = i.a.getDomain(),
                o = "function" == typeof a.a[e] ? a.a[e](t) : a.a[e],
                c = r + o;
            return t && (Object.keys(t).length > 0 && (c += "?"), Object.keys(t).forEach(function(e) {
                c += e + "=" + t[e] + "&"
            })), c
        }
    }), t.a = r
}, function(e, t, n) {
    "use strict";
    n.d(t, "a", function() {
        return a
    }), n.d(t, "f", function() {
        return i
    }), n.d(t, "l", function() {
        return r
    }), n.d(t, "e", function() {
        return o
    }), n.d(t, "d", function() {
        return c
    }), n.d(t, "g", function() {
        return u
    }), n.d(t, "c", function() {
        return s
    }), n.d(t, "h", function() {
        return l
    }), n.d(t, "j", function() {
        return d
    }), n.d(t, "i", function() {
        return f
    }), n.d(t, "b", function() {
        return h
    }), n.d(t, "k", function() {
        return p
    });
    var a = "afterUrlFetch",
        i = "loaded",
        r = "success",
        o = "error",
        c = "close",
        u = "visit",
        s = "step",
        l = "paymentSourceAdd",
        d = "paymentSourceUpdate",
        f = "paymentSourceRemove",
        h = [a, i, r, o, "afterAuthSet", c, s, l, d, f],
        p = [i, c, o, u, f, l, d]
}, function(e, t, n) {
    "use strict";

    function a(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }
    var i = function e() {
        a(this, e)
    };
    t.a = i, i.UTILITY_FRAME = "cb-utility-frame", i.CONTAINER = "cb-container", i.CB_FRAME = "cb-frame", i.CB_LOADER = "cb-loader", i.CB_LOADER_HEADER = "cb-loader-header", i.CB_HEADER_LOGO = "cb-header-logo", i.CB_ERROR = "cb-error", i.CB_LOADING_BAR = "cb-loading-bar", i.CB_MODAL_CLOSE = "cb-modal-close", i.CB_PLACE_HOLDER = "cb-placeholder"
}, function(e, t, n) {
    "use strict";

    function a(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }
    var i = n(1),
        r = n(7),
        o = n(2),
        c = n(4),
        u = n(3),
        s = n(0),
        l = n(8),
        d = n(15),
        f = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e
        } : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        },
        h = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var a = t[n];
                    a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                }
            }
            return function(t, n, a) {
                return n && e(t.prototype, n), a && e(t, a), t
            }
        }(),
        p = function() {
            function e() {
                a(this, e)
            }
            return h(e, null, [{
                key: "init",
                value: function() {
                    this.isBusy = !1, this.manager = s.a.isMobileOrTablet() ? new d.a : new l.a, this.manager.init(), this.loadStyle()
                }
            }, {
                key: "showPage",
                value: function() {
                    this.page.timeLogs[r.a.AFTER_LOAD] = Date.now(), this.manager.show(), s.a.sendLog(this.page)
                }
            }, {
                key: "loadStyle",
                value: function() {
                    var e = document.getElementById(c.a.UTILITY_FRAME);
                    e || (e = l.a.createHiddenIFrame(c.a.UTILITY_FRAME)), e.src = o.a.connector()
                }
            }, {
                key: "submit",
                value: function(e) {
                    if ("window" == this.manager.type) {
                        var t = this.manager;
                        t.window && t.window.closed && this.reset()
                    }
                    this.isBusy && e.callbacks.error && e.callbacks.error("Already another checkout is in progress"), this._submit(e), this.process()
                }
            }, {
                key: "process",
                value: function() {
                    this.manager.showLoader(), this._process(), this.queued = !1
                }
            }, {
                key: "reset",
                value: function() {
                    this.manager.close(), this.page = void 0, this.isBusy = !1
                }
            }, {
                key: "_submit",
                value: function(e) {
                    this.page = e, this.isBusy = !0
                }
            }, {
                key: "_process",
                value: function() {
                    this.page.type == i.a.CHECKOUT ? this._processCheckout() : this._processPortal()
                }
            }, {
                key: "_processCheckout",
                value: function() {
                    var e = this;
                    if (this.page.urlFetcher) {
                        this.page.timeLogs[r.a.BEFORE_SEND] = Date.now();
                        var t = this.page.urlFetcher().then(function(t) {
                            e.page.callbacks[u.a] && e.page.callbacks[u.a](t), e.page.timeLogs[r.a.AFTER_URL_FETCH] = Date.now(), t ? (e.page.url = t.url, e.manager.open(t.url, "Checkout Page")) : e.manager.close()
                        });
                        t.catch && t.catch(function(t) {
                            e.manager.close(), e.page.callbacks[u.e] && e.page.callbacks[u.e](t)
                        })
                    } else this.page.url && this.manager.open(this.page.url, "Checkout Page")
                }
            }, {
                key: "_processPortal",
                value: function() {
                    var e = s.a.getCbInstance();
                    this.page.timeLogs[r.a.BEFORE_SEND] = Date.now(), e.needsSsoAuthentication(this.page.type) && !e.authenticated ? this._wrapSso(this.page.name) : this.manager.open(this.page.url, "Checkout Page")
                }
            }, {
                key: "_wrapSso",
                value: function(e) {
                    var t = s.a.getCbInstance();
                    t.authHandler.state = i.b.AUTH_INTITIATED;
                    var n = this;
                    t.authHandler.ssoTokenFetcher ? t.authHandler.ssoTokenFetcher().then(function(t) {
                        n.page.timeLogs[r.a.AFTER_SSO] = Date.now(), n.manager.open(o.a.authentication({
                            token: t.token,
                            forward: e
                        }), "Billing Portal")
                    }).catch(function(e) {
                        n.manager.close(), n.page.callbacks[u.e] && n.page.callbacks[u.e](e)
                    }) : t.authHandler.ssoToken && ("object" == f(t.authHandler.ssoToken) ? n.manager.open(o.a.authentication({
                        token: t.authHandler.ssoToken.token,
                        forward: e
                    }), "Billing Portal") : n.manager.open(o.a.authentication({
                        token: t.authHandler.ssoToken,
                        forward: e
                    }), "Billing Portal"))
                }
            }]), e
        }();
    t.a = p
}, function(e, t, n) {
    "use strict";

    function a(e, t) {
        if (e.dataset) return e.dataset[t];
        var n = t.replace(/([A-Z])/g, function(e) {
            return "-" + e.toLowerCase()
        });
        return e.getAttribute("data-" + n)
    }

    function i(e) {
        if (e.dataset) return Object.keys(e.dataset);
        for (var t = e.attributes.length, n = [], a = 0; a < t; a++) {
            var i = e.attributes[a];
            if (i && i.name && /^data-\w[\w\-]*$/.test(i.name)) {
                var r = i.name;
                n.push(r.substr(5).replace(/-./g, function(e) {
                    return e.charAt(1).toUpperCase()
                }))
            }
        }
        return n
    }
    t.a = a, t.b = i, "function" != typeof Object.assign && (Object.assign = function(e, t) {
        if (null == e) throw new TypeError("Cannot convert undefined or null to object");
        for (var n = Object(e), a = 1; a < arguments.length; a++) {
            var i = arguments[a];
            if (null != i)
                for (var r in i) Object.prototype.hasOwnProperty.call(i, r) && (n[r] = i[r])
        }
        return n
    }), String.prototype.startsWith || (String.prototype.startsWith = function(e, t) {
        return this.substr(!t || t < 0 ? 0 : +t, e.length) === e
    })
}, function(e, t, n) {
    "use strict";

    function a(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }
    var i = function e() {
        a(this, e)
    };
    t.a = i, i.LOGGING = "cb.logging", i.HP_URL = "hp_url", i.BEFORE_SEND = "beforeSend", i.AFTER_LOAD = "afterLoad", i.AFTER_URL_FETCH = "afterUrlFetch", i.AFTER_SSO = "afterSso"
}, function(e, t, n) {
    "use strict";

    function a(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }
    var i = n(0),
        r = n(4),
        o = n(2),
        c = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var a = t[n];
                    a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                }
            }
            return function(t, n, a) {
                return n && e(t.prototype, n), a && e(t, a), t
            }
        }(),
        u = {},
        s = function() {
            function e() {
                a(this, e), this.bodySettings = {}
            }
            return c(e, [{
                key: "init",
                value: function() {
                    this.addStyleTag(), this.attachIframeAndLoader(), this.type = "frame"
                }
            }, {
                key: "showLoader",
                value: function() {
                    var e = window.document.getElementById(r.a.CONTAINER),
                        t = window.document.getElementById(r.a.CB_HEADER_LOGO),
                        n = window.document.getElementById(r.a.CB_LOADING_BAR);
                    e.style.background = "rgba(0,0,0,.702)", e.style.display = "block";
                    var a = i.a.getCbInstance().styleConfig;
                    a.image && t.setAttribute("src", a.image), a.color && (n.style.background = a.color);
                    var o = window.document.getElementById(r.a.CB_LOADER),
                        c = window.innerHeight;
                    document.body.clientWidth < 480 ? i.a.setCssStyle(o, "loader_container_mobile") : (i.a.setCssStyle(o, "loader_container_web"), c - 480 > 20 && (o.style.marginTop = (c - 480) / 2 + "px")), o.style.visibility = "visible";
                    var u = document.querySelectorAll(".cb-placeholder")[0];
                    if ("undefined" != typeof getComputedStyle && u) {
                        var s = window.getComputedStyle(u, null);
                        if (s && "rgb(244, 245, 249)" == s.getPropertyValue("background-color"))
                            for (var l = document.querySelectorAll("#cb-placeholder > div"), d = l.length - 1; d >= 0; d--) l[d].style.animationDelay = .1 * d + "s";
                        else this.createKeyFrameAnimation()
                    }
                }
            }, {
                key: "open",
                value: function(e, t) {
                    var n = window.document.getElementById(r.a.CB_FRAME);
                    n.style.display = "block", n.src = e, n.title = t, this.bodySettings.overflow = document.body.style.overflow, document.body.style.overflow = "hidden"
                }
            }, {
                key: "close",
                value: function() {
                    window.document.getElementById(r.a.CONTAINER).style.display = "none";
                    var e = window.document.getElementById(r.a.CB_FRAME);
                    e.src = "", e.style.display = "none", e.style.visibility = "hidden", document.body.style.overflow = this.bodySettings.overflow
                }
            }, {
                key: "show",
                value: function() {
                    var e = window.document.getElementById(r.a.CB_FRAME),
                        t = (window.document.getElementById(r.a.CONTAINER), window.document.getElementById(r.a.CB_LOADER)),
                        n = window.document.getElementById(r.a.CB_LOADING_BAR);
                    t.style.boxShadow = "none", e.style.visibility = "visible", window.setTimeout(function() {
                        t.style.visibility = "hidden", n.style.visibility = "hidden", clearTimeout(u.timeOut1), clearTimeout(u.timeOut2), clearTimeout(u.timeOut3)
                    }, 1e3)
                }
            }, {
                key: "createKeyFrameAnimation",
                value: function() {
                    var e = document.getElementById("cb-loading-bar");
                    e.style.transform = "translateX(-100%)";
                    ! function t() {
                        u.timeOut1 = window.setTimeout(function() {
                            e.style.transform = "translateX(0%)", e.style.visibility = "visible"
                        }, 500), u.timeOut2 = window.setTimeout(function() {
                            e.style.transform = "translateX(100%)", e.style.visibility = "hidden"
                        }, 1e3), u.timeOut3 = window.setTimeout(function() {
                            e.style.transform = "translateX(-100%)", e.style.visibility = "hidden", t()
                        }, 1500)
                    }()
                }
            }, {
                key: "addStyleTag",
                value: function() {
                    var e = document.createElement("link");
                    e.setAttribute("rel", "stylesheet"), e.setAttribute("href", o.a.animation_styles()), e.setAttribute("type", "text/css"), document.getElementsByTagName("head")[0].appendChild(e)
                }
            }, {
                key: "attachIframeAndLoader",
                value: function() {
                    var e = document.getElementById(r.a.CONTAINER),
                        t = this.createIframe(),
                        n = this.createLoader();
                    e.insertBefore(n, null), e.insertBefore(t, null)
                }
            }, {
                key: "createIframe",
                value: function() {
                    var e = window.document.createElement("iframe");
                    return e.id = r.a.CB_FRAME, i.a.setCssStyle(e, "iframe"), e
                }
            }, {
                key: "createLoader",
                value: function() {
                    var e = window.document.createElement("div");
                    e.id = r.a.CB_LOADER, i.a.setCssStyle(e, "loader_container");
                    var t = window.document.createElement("div");
                    i.a.setCssStyle(t, "loader_wrapper");
                    var n = this.createHeader(),
                        a = this.createContent(),
                        o = this.createLoadingBar(),
                        c = this.createCloseButton();
                    return t.appendChild(n), t.appendChild(o), t.appendChild(a), t.appendChild(c), e.appendChild(t), e
                }
            }, {
                key: "createHeader",
                value: function() {
                    var e = window.document.createElement("div");
                    e.id = r.a.CB_LOADER_HEADER, i.a.setCssStyle(e, "loader_header");
                    var t = window.document.createElement("img");
                    return t.id = r.a.CB_HEADER_LOGO, i.a.setCssStyle(t, "loader_header_img"), e.appendChild(t), e
                }
            }, {
                key: "createContent",
                value: function() {
                    var e = window.document.createElement("div");
                    i.a.setCssStyle(e, "loader_content");
                    var t = window.document.createElement("div");
                    t.setAttribute("class", "cb-placeholder"), t.id = "cb-placeholder";
                    var n = window.document.createElement("div");
                    i.a.setCssStyle(n, "placeholder_md"), n.setAttribute("class", "wavering"), i.a.setCssStyle(n, "wavering");
                    var a = window.document.createElement("div");
                    i.a.setCssStyle(a, "placeholder_lg"), a.setAttribute("class", "wavering"), i.a.setCssStyle(a, "wavering");
                    var o = window.document.createElement("div");
                    i.a.setCssStyle(o, "placeholder_sm"), o.setAttribute("class", "wavering"), i.a.setCssStyle(o, "wavering"), t.appendChild(n), t.appendChild(a), t.appendChild(o), t.appendChild(o.cloneNode()), t.appendChild(o.cloneNode());
                    var c = window.document.createElement("div");
                    return c.id = r.a.CB_ERROR, i.a.setCssStyle(c, "cb_error"), e.appendChild(t), e.appendChild(c), e
                }
            }, {
                key: "createLoadingBar",
                value: function() {
                    var e = window.document.createElement("div");
                    return e.id = r.a.CB_LOADING_BAR, i.a.setCssStyle(e, "loading_bar"), e
                }
            }, {
                key: "createCloseButton",
                value: function() {
                    var e = this,
                        t = window.document.createElement("div");
                    return t.innerHTML = "&#215;", t.id = r.a.CB_MODAL_CLOSE, i.a.setCssStyle(t, "loading_close"), t[window.addEventListener ? "addEventListener" : "attachEvent"]("click", function() {
                        return e.close()
                    }), t
                }
            }], [{
                key: "createHiddenIFrame",
                value: function(e) {
                    var t = window.document.createElement("iframe");
                    return t.id = e, i.a.setCssStyle(t, "iframe_hidden"), window.document.getElementById(r.a.CONTAINER).insertBefore(t, null), t
                }
            }]), e
        }();
    t.a = s
}, function(e, t, n) {
    "use strict";

    function a(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }
    var i = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var a = t[n];
                    a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                }
            }
            return function(t, n, a) {
                return n && e(t.prototype, n), a && e(t, a), t
            }
        }(),
        r = function() {
            function e() {
                a(this, e)
            }
            return i(e, null, [{
                key: "notTrue",
                value: function(e, t) {
                    if (!e()) throw new Error(t)
                }
            }]), e
        }();
    t.a = r
}, function(e, t, n) {
    "use strict";

    function a(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }
    var i = n(1),
        r = n(20),
        o = n(3),
        c = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var a = t[n];
                    a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                }
            }
            return function(t, n, a) {
                return n && e(t.prototype, n), a && e(t, a), t
            }
        }(),
        u = function() {
            function e(t, n) {
                a(this, e), this.type = t, this.callbacks = {}, this.timeLogs = {}, this.init(n)
            }
            return c(e, [{
                key: "init",
                value: function(e) {
                    var t = this;
                    "function" == typeof e.hostedPage ? this.urlFetcher = e.hostedPage : e.hostedPageUrl ? this.url = e.hostedPageUrl : this.url = e.url;
                    var n = r.a.getDefaultCallbackDefns(this.type);
                    this.getAvailableCallbackKeys().forEach(function(t) {
                        e[t] && (n[t] || (n[t] = []), n[t].push(e[t]))
                    }), Object.keys(n).forEach(function(e) {
                        t.callbacks[e] = t.constructCallbackDefn(n[e])
                    })
                }
            }, {
                key: "constructCallbackDefn",
                value: function(e) {
                    return function() {
                        var t = arguments;
                        e.forEach(function(e) {
                            e.apply(void 0, t)
                        })
                    }
                }
            }, {
                key: "getAvailableCallbackKeys",
                value: function() {
                    switch (this.type) {
                        case i.a.CHECKOUT:
                            return o.b;
                        case i.a.PORTAL:
                            return o.k;
                        default:
                            throw new Error("Page Type not supported")
                    }
                }
            }]), e
        }();
    t.a = u
}, function(e, t, n) {
    "use strict";

    function a(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var i = n(0),
        r = n(5),
        o = n(16),
        c = n(24),
        u = n(26),
        s = n(6),
        l = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var a = t[n];
                    a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                }
            }
            return function(t, n, a) {
                return n && e(t.prototype, n), a && e(t, a), t
            }
        }(),
        d = function() {
            function e() {
                a(this, e)
            }
            return l(e, null, [{
                key: "init",
                value: function(e) {
                    if (this.inited) return this.getInstance();
                    var t = new o.a(e);
                    return Object(u.a)(), Object(c.a)(), r.a.init(), this.inited = !0, t
                }
            }, {
                key: "getInstance",
                value: function() {
                    if (this.inited) return i.a.getCbInstance();
                    throw new Error("Instance not created")
                }
            }, {
                key: "registerAgain",
                value: function() {
                    Object(u.a)()
                }
            }]), e
        }();
    if (!window.Chargebee) {
        window.Chargebee = d;
        var f = document.getElementsByTagName("script");
        [].forEach.call(f, function(e) {
            if (Object(s.a)(e, "cbSite")) {
                var t = Object(s.a)(e, "cbGaEnabled"),
                    n = Object(s.a)(e, "cbFbqEnabled");
                ! function() {
                    //------kommunicate.io-------//
                    //Hack to check click on chargebee-init in order to support in react
                    //document.addEventListener("DOMContentLoaded", function() {
                    document.addEventListener('click',function(event){
                        if(event.target && event.target.id == 'chargebee-init'){
                            var a = d.init({
                                site: Object(s.a)(e, "cbSite"),
                                domain: Object(s.a)(e, "cbDomain"),
                                enableGATracking: !!t,
                                enableFBQTracking: !!n
                            })

                            //----Kommunicate.io-----//
                            var r = a.createChargebeePortal();
                            document.addEventListener('click',function(event){
                                if(event.target && event.target.getAttribute('data-cb-type') == 'portal'){
                                    i = event.target;
                                    i.cbPortal = r, i.addEventListener("click", function(e) {
                                        i.cbPortal.open(), e.preventDefault(), e.stopPropagation()
                                    })
                                }
                            })
                            //----Kommunicate.io-----//

                        /* i = document.querySelector("[data-cb-type=portal]");
                            if (i) {
                                var r = a.createChargebeePortal();
                                i.cbPortal = r, i.addEventListener("click", function(e) {
                                    i.cbPortal.open(), e.preventDefault(), e.stopPropagation()
                                })
                            } */
                        }
                    })
                }()
            }
        })
    }
}, function(e, t, n) {
    "use strict";

    function a(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }
    var i = function e() {
        a(this, e)
    };
    t.a = i, i.PROD_DOMAIN = "https://${site}.chargebee.com", i.DEV_DOMAIN = "http://${site}.localcb.in:8080"
}, function(e, t, n) {
    "use strict";
    t.a = {
        container: {
            position: "fixed",
            right: "0",
            bottom: "0",
            left: "0",
            top: "0",
            "z-index": "2147483647",
            display: "none",
            "-webkit-overflow-scrolling": "touch",
            "overflow-y": "scroll"
        },
        iframe: {
            width: "100%",
            height: "100%",
            zIndex: 999999,
            visibility: "hidden",
            position: "relative",
            border: "0"
        },
        iframe_hidden: {
            width: "0",
            height: "0",
            visibility: "hidden"
        },
        loader_container: {
            zIndex: 99999,
            visibility: "hidden",
            trnasition: "all 0.5s ease",
            background: "#f4f5f9",
            position: "absolute",
            left: "0",
            right: "0",
            boxShadow: "0 2px 9px 0 rgba(0, 0, 0, 0.1), 0 20px 30px 1px rgba(0, 0, 0, 0.15), 0 40px 40px 1px rgba(0, 0, 0, 0.15)"
        },
        loader_wrapper: {
            overflow: "hidden"
        },
        loader_container_mobile: {
            height: "100%",
            width: "100%"
        },
        loader_container_web: {
            width: "400px",
            height: "480px",
            margin: "20px auto"
        },
        loader_header: {
            padding: "12px 40px",
            background: "#fff",
            boxShadow: "0 1px 2px 0 rgba(0,0,0,.1)",
            textAlign: "center",
            minHeight: "64px",
            boxSizing: "border-box"
        },
        loader_header_img: {
            maxHeight: "40px",
            maxWidth: "240px",
            minHeight: "40px",
            verticalAlign: "middle",
            width: "auto",
            marginTop: "3px",
            marginBottom: "3px"
        },
        loading_bar: {
            height: "2px",
            background: "#48e79a",
            transitionDuration: "0.5s",
            transitionTimingFunction: "ease-in-out",
            visibility: "hidden"
        },
        loader_content: {
            padding: "24px 36px"
        },
        placeholder_sm: {
            height: "10px",
            width: "150px",
            background: "rgb(238,238,238)",
            backgroundSize: "400px 104px",
            marginBottom: "10px"
        },
        placeholder_md: {
            height: "20px",
            width: "100px",
            background: "rgb(238,238,238)",
            backgroundSize: "400px 104px",
            marginBottom: "10px"
        },
        placeholder_lg: {
            height: "40px",
            width: "200px",
            background: "rgb(238,238,238)",
            backgroundSize: "400px 104px",
            marginBottom: "10px"
        },
        wavering: {
            background: ["#f6f7f8", "-webkit-gradient(linear, left top, right top, color-stop(8%, #eeeeee ), color-stop(18%, #dddddd ), color-stop(33%, #eeeeee ))", "-webkit-linear-gradient(left, #eeeeee 8%, #dddddd 18%, #eeeeee 33%)", "linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%)"],
            backgroundSize: "800px 104px"
        },
        cb_error: {
            fontSize: "18px",
            lineHeight: "27px",
            color: "#F83030",
            textAlign: "center",
            display: "none"
        },
        loading_close: {
            position: "absolute",
            background: "#393941",
            height: "24px",
            width: "24px",
            borderRadius: "50%",
            right: "-12px",
            top: "-12px",
            fontSize: "20px",
            color: "rgba(255, 255, 255, 0.7)",
            textAlign: "center",
            cursor: "pointer",
            display: "table",
            "font-weight": "400",
            lineHeight: "24px"
        }
    }
}, function(e, t, n) {
    "use strict";

    function a(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }
    var i = function e() {
        a(this, e)
    };
    t.a = i, i.AUTHENTICATION = "/portal/v2/authenticate", i.LOADER = "/assets/hp_v3/iframe_views/loader.html", i.PORTAL_HOME = "/portal/v2/home", i.PORTAL_LOGOUT = "/portal/v2/logout", i.CONNECTOR = "/hosted_pages/iframe_connector", i.ANIMATION_STYLES = "/assets/hp_v3/iframe_views/animation.css", i.PLAN_SPECIFIC_HOSTED_PAGE = function(e) {
        var t = e.planId;
        return delete e.planId, "/hosted_pages/plans/" + t
    }
}, function(e, t, n) {
    "use strict";

    function a(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }
    var i = n(2),
        r = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var a = t[n];
                    a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                }
            }
            return function(t, n, a) {
                return n && e(t.prototype, n), a && e(t, a), t
            }
        }(),
        o = function() {
            function e() {
                a(this, e)
            }
            return r(e, [{
                key: "init",
                value: function() {
                    this.type = "window"
                }
            }, {
                key: "showLoader",
                value: function() {
                    !this.window || this.window.closed ? this.window = window.open(i.a.loader(), "cb-pages") : this.window.location.href = i.a.loader()
                }
            }, {
                key: "open",
                value: function(e, t) {
                    this.window.location.href = e
                }
            }, {
                key: "close",
                value: function() {
                    this.window.close()
                }
            }, {
                key: "show",
                value: function() {}
            }]), e
        }();
    t.a = o
}, function(e, t, n) {
    "use strict";

    function a(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }
    var i = n(17),
        r = n(5),
        o = n(1),
        c = n(0),
        u = n(19),
        s = n(10),
        l = n(23),
        d = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var a = t[n];
                    a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                }
            }
            return function(t, n, a) {
                return n && e(t.prototype, n), a && e(t, a), t
            }
        }(),
        f = function() {
            function e(t) {
                if (a(this, e), this.styleConfig = {}, this.site = t.site, !this.site) throw new Error("Site name is not set");
                this.domain = t.domain, this.enableGATracking = t.enableGATracking, this.enableFBQTracking = t.enableFBQTracking, c.a.createContainer().cbInstance = this, this.authHandler = new u.a(this), this.cart = new i.a, t.portalSession && this.setPortalSession(t.portalSession)
            }
            return d(e, [{
                key: "setPortalSession",
                value: function(e) {
                    "function" == typeof e ? this.authHandler.setSsoTokenFetcher(e) : this.authHandler.setSsoToken(e)
                }
            }, {
                key: "openCheckout",
                value: function(e) {
                    if (e.hostedPage || e.hostedPageUrl || e.url) {
                        var t = new s.a(o.a.CHECKOUT, e);
                        r.a.submit(t)
                    } else this.cart.proceedToCheckout()
                }
            }, {
                key: "createChargebeePortal",
                value: function() {
                    return new l.a(this)
                }
            }, {
                key: "needsSsoAuthentication",
                value: function(e) {
                    return e == o.a.PORTAL && (!!this.authHandler.ssoToken || !!this.authHandler.ssoTokenFetcher)
                }
            }, {
                key: "logout",
                value: function() {
                    this.authHandler.logout()
                }
            }, {
                key: "closeAll",
                value: function() {
                    r.a.reset()
                }
            }, {
                key: "setStyle",
                value: function(e) {
                    this.styleConfig.image = e.image_url, this.styleConfig.color = e.color
                }
            }, {
                key: "getCart",
                value: function() {
                    return this.cart
                }
            }, {
                key: "getProduct",
                value: function(e) {
                    return e.cbProduct
                }
            }, {
                key: "setPortalCallbacks",
                value: function(e) {
                    this.portalCallbacks = e
                }
            }, {
                key: "setCheckoutCallbacks",
                value: function(e) {
                    this.checkoutCallbacks = e
                }
            }]), e
        }();
    t.a = f
}, function(e, t, n) {
    "use strict";

    function a(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }
    var i = n(0),
        r = n(9),
        o = n(2),
        c = n(18),
        u = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var a = t[n];
                    a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                }
            }
            return function(t, n, a) {
                return n && e(t.prototype, n), a && e(t, a), t
            }
        }(),
        s = function() {
            function e() {
                a(this, e), this.products = [], this.shippingAddress = {}, this.customer = {
                    billing_address: {}
                }, this.callbacks = {}
            }
            return u(e, [{
                key: "addItem",
                value: function(e) {
                    var t = this;
                    return r.a.notTrue(function() {
                        return 0 == t.products.length || t.products.some(function(t) {
                            return t.planId != e.planId
                        })
                    }, "Only one product with the same plan id can be present"), this.products.push(e), this
                }
            }, {
                key: "replaceProduct",
                value: function(e) {
                    return this.products = [e], this
                }
            }, {
                key: "fetchItem",
                value: function(e) {
                    return this.products.filter(function(t) {
                        return t.planId == e
                    })[0]
                }
            }, {
                key: "removeItem",
                value: function(e) {
                    var t = this.products.indexOf(e)[0];
                    return t && this.products.splice(t, 1), this
                }
            }, {
                key: "calculateEstimate",
                value: function() {
                    return null
                }
            }, {
                key: "setShippingAddress",
                value: function(e) {
                    return this.shippingAddress = e, this
                }
            }, {
                key: "setCustomer",
                value: function(e) {
                    return this.customer = e, this
                }
            }, {
                key: "proceedToCheckout",
                value: function() {
                    var e = this;
                    r.a.notTrue(function() {
                        return e.products.length > 0
                    }, "Atleast one product should be present");
                    var t = i.a.getCbInstance(),
                        n = {};
                    "function" == typeof t.checkoutCallbacks && Object.assign(n, t.checkoutCallbacks(this)), Object.assign(n, this.callbacks), t.openCheckout(Object.assign({
                        hostedPageUrl: this.generateUrl()
                    }, n))
                }
            }, {
                key: "generateUrl",
                value: function() {
                    var t = {},
                        n = this.products[0];
                    return t.planId = n.planId, n.planQuantity && (t["subscription[plan_quantity]"] = n.planQuantity), Object.assign(t, c.a.flattenMulti(n.addons, "addons")), Object.assign(t, c.a.flatten(e.customerWithoutBillingAddress(this.customer), "customer")), Object.assign(t, c.a.flatten(this.customer.billing_address, "billing_address")), Object.assign(t, c.a.flatten(this.shippingAddress, "shipping_address")), Object.assign(t, c.a.flatten(n.data, "subscription")), o.a.plan_specific_hosted_page(t)
                }
            }], [{
                key: "customerWithoutBillingAddress",
                value: function(e) {
                    return Object.keys(e).reduce(function(t, n) {
                        return "billing_address" != n && (t[n] = e[n]), t
                    }, {})
                }
            }]), e
        }();
    t.a = s
}, function(e, t, n) {
    "use strict";

    function a(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }
    var i = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var a = t[n];
                    a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                }
            }
            return function(t, n, a) {
                return n && e(t.prototype, n), a && e(t, a), t
            }
        }(),
        r = function() {
            function e() {
                a(this, e)
            }
            return i(e, null, [{
                key: "flattenMulti",
                value: function(e, t) {
                    return e ? e.reduce(function(e, n, a) {
                        return Object.keys(n).filter(function(e) {
                            return ["id", "quantity"].indexOf(e) > -1
                        }).forEach(function(i) {
                            e[t + "[" + i + "][" + a + "]"] = n[i]
                        }), e
                    }, {}) : {}
                }
            }, {
                key: "flatten",
                value: function(e, t) {
                    return e ? Object.keys(e).reduce(function(n, a) {
                        return e[a] && (n[t + "[" + a + "]"] = e[a]), n
                    }, {}) : {}
                }
            }]), e
        }();
    t.a = r
}, function(e, t, n) {
    "use strict";

    function a(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }
    var i = n(8),
        r = n(4),
        o = n(2),
        c = n(1),
        u = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var a = t[n];
                    a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                }
            }
            return function(t, n, a) {
                return n && e(t.prototype, n), a && e(t, a), t
            }
        }(),
        s = function() {
            function e(t) {
                a(this, e), this.cbInstance = t
            }
            return u(e, [{
                key: "setSsoToken",
                value: function(e) {
                    this.ssoToken = e
                }
            }, {
                key: "setSsoTokenFetcher",
                value: function(e) {
                    this.ssoTokenFetcher = e
                }
            }, {
                key: "logout",
                value: function() {
                    var e = document.getElementById(r.a.UTILITY_FRAME);
                    e || (e = i.a.createHiddenIFrame(r.a.UTILITY_FRAME)), e.src = o.a.portal_logout(), this.reset()
                }
            }, {
                key: "close",
                value: function(e) {
                    this.state = c.b.AUTHENTICATED, this.cbInstance.authenticated = !0
                }
            }, {
                key: "reset",
                value: function() {
                    this.state = void 0, this.cbInstance.authenticated = !1
                }
            }]), e
        }();
    t.a = s
}, function(e, t, n) {
    "use strict";

    function a(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }
    var i = n(21),
        r = n(22),
        o = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var a = t[n];
                    a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                }
            }
            return function(t, n, a) {
                return n && e(t.prototype, n), a && e(t, a), t
            }
        }(),
        c = function() {
            function e() {
                a(this, e)
            }
            return o(e, null, [{
                key: "getDefaultCallbackDefns",
                value: function(e) {
                    var t = {};
                    return this.mergeCallbackDefns(t, i.a.get(e)), this.mergeCallbackDefns(t, r.a.get(e)), t
                }
            }, {
                key: "mergeCallbackDefns",
                value: function(e, t) {
                    return Object.keys(t).forEach(function(n) {
                        e[n] || (e[n] = []), e[n].push(t[n])
                    }), e
                }
            }]), e
        }();
    t.a = c
}, function(e, t, n) {
    "use strict";

    function a(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }

    function i(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[t] = n, e
    }
    var r, o, c = n(3),
        u = n(1),
        s = n(0),
        l = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var a = t[n];
                    a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                }
            }
            return function(t, n, a) {
                return n && e(t.prototype, n), a && e(t, a), t
            }
        }(),
        d = {
            BEGIN_CHECKOUT: {
                action: "begin_checkout",
                category: "ecommerce"
            },
            LEAD: {
                action: "generate_lead",
                category: "engagement"
            },
            PURCHASE: {
                action: "purchase",
                category: "ecommerce"
            }
        };
    ! function(e) {
        e.TRANSACTION_ID = "transaction_id", e.VALUE = "value", e.CURRENCY = "currency"
    }(o || (o = {}));
    var f = (r = {}, i(r, c.f, function() {
            p(d.BEGIN_CHECKOUT)
        }), i(r, c.c, function(e) {
            b("cb-checkout", e)
        }), i(r, c.l, function(e, t) {
            var n = t && t.invoice;
            if (n) {
                var a = {};
                a[o.TRANSACTION_ID] = e, a[o.VALUE] = n && n.formatted_total, a[o.CURRENCY] = n && n.currency_code, p(d.PURCHASE, a)
            } else p(d.LEAD)
        }), r),
        h = i({}, c.g, function(e) {
            b("cb-portal", e)
        }),
        p = function(e, t) {
            window.gtag ? t ? window.gtag("event", e.action, t) : window.gtag("event", e.action) : window.ga && window.ga("send", "event", e.category, e.action)
        },
        b = function(e, t) {
            window.gtag ? window.gtag("event", t, {
                event_category: e
            }) : window.ga && window.ga("send", "event", e, t)
        },
        y = function() {
            function e() {
                a(this, e)
            }
            return l(e, null, [{
                key: "get",
                value: function(e) {
                    return s.a.getCbInstance().enableGATracking && window.ga ? e == u.a.CHECKOUT ? f : h : {}
                }
            }]), e
        }();
    t.a = y
}, function(e, t, n) {
    "use strict";

    function a(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }

    function i(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[t] = n, e
    }
    var r, o, c = n(3),
        u = n(1),
        s = n(0),
        l = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var a = t[n];
                    a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                }
            }
            return function(t, n, a) {
                return n && e(t.prototype, n), a && e(t, a), t
            }
        }();
    ! function(e) {
        e.INITIATE_CHECKOUT = "InitiateCheckout", e.LEAD = "Lead", e.PURCHASE = "Purchase"
    }(o || (o = {}));
    var d;
    ! function(e) {
        e.VALUE = "value", e.CURRENCY = "currency"
    }(d || (d = {}));
    var f = (r = {}, i(r, c.f, function() {
            window.fbq && window.fbq("track", o.INITIATE_CHECKOUT)
        }), i(r, c.l, function(e, t) {
            var n = t && t.invoice;
            if (n) {
                var a = {};
                a[d.VALUE] = n && n.formatted_total, a[d.CURRENCY] = n && n.currency_code, h(o.PURCHASE, a)
            } else h(o.LEAD)
        }), r),
        h = function(e, t) {
            window.fbq && (t ? window.fbq("track", e, t) : window.fbq("track", e))
        },
        p = function() {
            function e() {
                a(this, e)
            }
            return l(e, null, [{
                key: "get",
                value: function(e) {
                    return e == u.a.CHECKOUT && s.a.getCbInstance().enableFBQTracking && window.fbq ? f : {}
                }
            }]), e
        }();
    t.a = p
}, function(e, t, n) {
    "use strict";

    function a(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }
    var i = n(5),
        r = n(2),
        o = n(10),
        c = n(1),
        u = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var a = t[n];
                    a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                }
            }
            return function(t, n, a) {
                return n && e(t.prototype, n), a && e(t, a), t
            }
        }(),
        s = function() {
            function e(t) {
                a(this, e), this.callbacks = {}, this.cbInstance = t
            }
            return u(e, [{
                key: "open",
                value: function() {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                    if (!e.pageType) {
                        e.url = r.a.portal_home(), Object.assign(e, this.cbInstance.portalCallbacks), Object.assign(e, this.callbacks);
                        var t = new o.a(c.a.PORTAL, e);
                        t.name = "home", i.a.submit(t)
                    }
                }
            }]), e
        }();
    t.a = s
}, function(e, t, n) {
    "use strict";
    var a = n(3),
        i = n(1),
        r = n(0),
        o = n(5),
        c = n(25),
        u = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e
        } : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        },
        s = window.addEventListener ? "addEventListener" : "attachEvent",
        l = window[s],
        d = "attachEvent" == s ? "onmessage" : "message",
        f = function(e) {
            var t = r.a.getCbInstance();
            if (e.origin == r.a.getDomain() && t) {
                if (e.data == c.a.CLOSE && (o.a.page.callbacks[a.d] && o.a.page.callbacks[a.d](), o.a.reset()), e.data == c.a.SUCCESS && o.a.page.callbacks[a.l] && o.a.page.callbacks[a.l](), e.data == c.a.ERROR && (o.a.page.callbacks[a.e] && o.a.page.callbacks[a.e](), o.a.reset()), e.data == c.a.UNAUTHENTICATED && t.authHandler.reset(), e.data == c.a.PAYMENT_SOURCE_REMOVE && o.a.page.callbacks[a.i] && o.a.page.callbacks[a.i](), e.data == c.a.LOADED) {
                    o.a.showPage();
                    window.document.getElementById("cb-frame");
                    o.a.page.callbacks[a.f] && o.a.page.callbacks[a.f]()
                }
                "object" == u(e.data) && (e.data.key == c.a.PAGE_VISITED && (o.a.page.type == i.a.CHECKOUT && o.a.page.callbacks[a.c] && o.a.page.callbacks[a.c](e.data.value), o.a.page.type == i.a.PORTAL && o.a.page.callbacks[a.g] && o.a.page.callbacks[a.g](e.data.value)), e.data.key == c.a.SUCCESS && (o.a.page.callbacks[a.l] && o.a.page.callbacks[a.l](e.data.value, e.data.data), e.data.redirectUrl && window.setTimeout(function() {
                    return window.location.href = e.data.redirectUrl
                }, 1e3)), e.data.key == c.a.PAYMENT_SOURCE_ADD && o.a.page.callbacks[a.h] && o.a.page.callbacks[a.h](e.data.status), e.data.key == c.a.PAYMENT_SOURCE_UPDATE && o.a.page.callbacks[a.j] && o.a.page.callbacks[a.j](e.data.status), e.data.key == c.a.AUTHENTITCATED && t.authHandler.close(e.data.value), e.data.key == c.a.STYLE_CONFIG && t.setStyle(e.data))
            }
        };
    t.a = function() {
        l(d, function(e) {
            try {
                f(e)
            } catch (e) {
                console.log(e)
            }
        }, !1)
    }
}, function(e, t, n) {
    "use strict";

    function a(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }
    var i = function e() {
        a(this, e)
    };
    t.a = i, i.CLOSE = "cb.close", i.SUCCESS = "cb.success", i.ERROR = "cb.error", i.UNAUTHENTICATED = "cb.unauthenticated", i.AUTHENTITCATED = "cb.authenticated", i.LOADED = "cb.loaded", i.STYLE_CONFIG = "cb.style_config", i.PAGE_VISITED = "cb.page_visited", i.PAYMENT_SOURCE_ADD = "cb.payment_source.add", i.PAYMENT_SOURCE_UPDATE = "cb.payment_source.update", i.PAYMENT_SOURCE_REMOVE = "cb.payment_source.remove"
}, function(e, t, n) {
    "use strict";
    var a = n(6),
        i = n(0),
        r = n(27);
    t.a = function() {

        //------kommunicate------//
        t = i.a.getCbInstance().getCart();
        document.addEventListener('click',function(event){
            if(event.target && event.target.getAttribute('data-cb-type') == 'checkout'){                
               // [].forEach.call(e, function(e) {
                    var e = event.target;
                    var n = r.a.createProductFromElement(e);
                    e.cbProduct = n, Object(a.a)(e, "cbDisableBinding") || e.addEventListener("click", function(e) {
                        t.replaceProduct(n), t.proceedToCheckout(), e.preventDefault(), e.stopPropagation()
                    })
               // })
            }
         })
        //------kommunicate------//

        /*
        var e = document.querySelectorAll("[data-cb-type=checkout]"),
            t = i.a.getCbInstance().getCart();
        [].forEach.call(e, function(e) {
            var n = r.a.createProductFromElement(e);
            e.cbProduct = n, Object(a.a)(e, "cbDisableBinding") || e.addEventListener("click", function(e) {
                t.replaceProduct(n), t.proceedToCheckout(), e.preventDefault(), e.stopPropagation()
            })
        })*/
    }
}, function(e, t, n) {
    "use strict";

    function a(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }
    var i = n(9),
        r = n(28),
        o = n(29),
        c = n(6),
        u = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var a = t[n];
                    a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                }
            }
            return function(t, n, a) {
                return n && e(t.prototype, n), a && e(t, a), t
            }
        }(),
        s = function() {
            function e(t, n) {
                a(this, e), this.addons = [], this.planId = t, this.planQuantity = n
            }
            return u(e, [{
                key: "incrementPlanQuantity",
                value: function() {
                    var e = this;
                    return i.a.notTrue(function() {
                        return !!e.planId
                    }, "PlanId should be present"), this.planQuantity || (this.planQuantity = 0), this.planQuantity += 1, this
                }
            }, {
                key: "decrementPlanQuantity",
                value: function() {
                    return this.planQuantity > 0 && (this.planQuantity -= 1), this
                }
            }, {
                key: "addAddon",
                value: function(e) {
                    var t = this;
                    return "string" == typeof e && (e = new r.a(e)), i.a.notTrue(function() {
                        return 0 == t.addons.length || t.addons.some(function(t) {
                            return t.id != e.id
                        })
                    }, "Only one addon with the same id can be present"), this.addons.push(e), this
                }
            }, {
                key: "removeAddon",
                value: function(e) {
                    var t;
                    "string" != typeof e && (t = e.id);
                    var n = this.addons.indexOf(t);
                    return n > -1 && this.addons.splice(n, 1), this
                }
            }, {
                key: "addCoupon",
                value: function(e) {
                    return this.data.coupon = e, this
                }
            }, {
                key: "removeCoupon",
                value: function() {
                    return this.data.coupon = void 0, this
                }
            }, {
                key: "incrementAddonQty",
                value: function(e) {
                    var t = this.addons.filter(function(t) {
                        return t.id == e
                    })[0];
                    return i.a.notTrue(function() {
                        return !!t
                    }, "No addon with the given id is present"), t.incrementQuantity(), this
                }
            }, {
                key: "decrementAddonQty",
                value: function(e) {
                    var t = this.addons.filter(function(t) {
                        return t.id == e
                    })[0];
                    return i.a.notTrue(function() {
                        return !!t
                    }, "No addon with the given id is present"), t.decrementQuantity(), this
                }
            }, {
                key: "fillAddons",
                value: function(e) {
                    var t = this;
                    if (Object.keys(e).length > 0) {
                        var n = {};
                        Object.keys(e).forEach(function(a) {
                            var i = a.match(/addons\[(.*)\]\[(.*)\]/) && a.match(/addons\[(.*)\]\[(.*)\]/).slice(1);
                            i && 2 == i.length && (n[i[1]] || (n[i[1]] = new r.a, t.addons.push(n[i[1]])), n[i[1]][i[0]] = e[a])
                        }), this.addons.length > 0 && i.a.notTrue(function() {
                            return t.addons.every(function(e) {
                                return !!e.id
                            })
                        }, "Id should be present for all addons"), this.addons.forEach(function(e) {
                            e.quantity && (e.quantity = parseInt("" + e.quantity))
                        })
                    }
                }
            }, {
                key: "fillSubscriptionCustomFields",
                value: function(e) {
                    this.data = o.a.transformToObject("subscription", e)
                }
            }], [{
                key: "createProductFromElement",
                value: function(t) {
                    var n = Object(c.a)(t, "cbPlanId");
                    i.a.notTrue(function() {
                        return null != n
                    }, "Plan Id cannot be null");
                    var a = new e(n),
                        r = o.a.fetchBasedOnResource(t),
                        u = Object(c.a)(t, "cbPlanQuantity");
                    return u && (a.planQuantity = parseInt(u)), a.fillAddons(r.addons), a.fillSubscriptionCustomFields(r), a
                }
            }]), e
        }();
    t.a = s
}, function(e, t, n) {
    "use strict";

    function a(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }
    var i = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var a = t[n];
                    a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                }
            }
            return function(t, n, a) {
                return n && e(t.prototype, n), a && e(t, a), t
            }
        }(),
        r = function() {
            function e(t) {
                a(this, e), this.id = t
            }
            return i(e, [{
                key: "incrementQuantity",
                value: function() {
                    return this.quantity || (this.quantity = 0), this.quantity += 1, this
                }
            }, {
                key: "decrementQuantity",
                value: function() {
                    return this.quantity > 0 && (this.quantity -= 1), this
                }
            }]), e
        }();
    t.a = r
}, function(e, t, n) {
    "use strict";

    function a(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }
    var i = n(6),
        r = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var a = t[n];
                    a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                }
            }
            return function(t, n, a) {
                return n && e(t.prototype, n), a && e(t, a), t
            }
        }(),
        o = function() {
            function e() {
                a(this, e)
            }
            return r(e, null, [{
                key: "fillCustomer",
                value: function(e) {}
            }, {
                key: "fetchBasedOnResource",
                value: function(e) {
                    var t = this,
                        n = {
                            addons: {},
                            customer: {},
                            billing_address: {},
                            shipping_address: {},
                            subscription: {}
                        };
                    return Object(i.b)(e).forEach(function(a) {
                        a.startsWith("cbAddons") ? n.addons[t.t(a)] = Object(i.a)(e, a) : a.startsWith("cbSubscription") && (n.subscription[t.t(a)] = Object(i.a)(e, a))
                    }), n
                }
            }, {
                key: "t",
                value: function(e) {
                    var t = e.replace(/([A-Z])/g, function(e) {
                        return "_" + e.toLowerCase()
                    }).replace("cb_", "");
                    if (t.match(/(.*)_(.*)_(.*)/)) {
                        var n = t.match(/(.*)_(.*)_(.*)/);
                        return n[1] + "[" + n[2] + "][" + n[3] + "]"
                    }
                    return t
                }
            }, {
                key: "transformToObject",
                value: function(e, t) {
                    switch (e) {
                        case "customer":
                        case "billing_address":
                        case "shipping_address":
                        case "subscription":
                            return this._transform(e, t);
                        default:
                            throw new Error("Type not implemented")
                    }
                }
            }, {
                key: "_transform",
                value: function(e, t) {
                    var n = this;
                    return t[e] && Object.keys(t[e]).reduce(function(a, i) {
                        return a[n.stripKeyFromResource(e, i)] = t[e][i], a
                    }, {})
                }
            }, {
                key: "stripKeyFromResource",
                value: function(e, t) {
                    var n = new RegExp(e + "\\[(.*)\\]");
                    return t.match(n) && t.match(n).slice(1)
                }
            }]), e
        }();
    t.a = o
}]);
//# sourceMappingURL=bundle.js.map