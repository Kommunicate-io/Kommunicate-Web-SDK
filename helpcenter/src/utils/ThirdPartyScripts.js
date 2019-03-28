import React, { Component } from 'react'

export class ThirdPartyScripts extends Component {
    
  

    componentDidMount = () => {

        let TRACKING_NUMBERS = {};
        if (window.location.host === 'answers.kommunicate.io') {

            TRACKING_NUMBERS = {
                heap: '1798605182',
                fb: '282023555639912'
            }
        } else if (window.location.host === 'answers.applozic.com') {
            TRACKING_NUMBERS = {
                heap: '329668642',
                fb: '601795446665318'
            }
        }

        if(window.location.host === 'answers.kommunicate.io' || window.location.host === 'answers.applozic.com'){
            var trackcmp_email = '';
            var trackcmp = document.createElement("script");
            trackcmp.async = true;
            trackcmp.type = 'text/javascript';
            trackcmp.src = '//trackcmp.net/visit?actid=66105982&e=' + encodeURIComponent(trackcmp_email) + '&r=' + encodeURIComponent(document.referrer) + '&u=' + encodeURIComponent(window.location.href);
            var trackcmp_s = document.getElementsByTagName("script");
            if (trackcmp_s.length) {
                trackcmp_s[0].parentNode.appendChild(trackcmp);
            } else {
                var trackcmp_h = document.getElementsByTagName("head");
                trackcmp_h.length && trackcmp_h[0].appendChild(trackcmp);
            }
    
    
            var QUERYSTRING = 'test',
                CURRENTURL = window.location.href;
            if (CURRENTURL.indexOf(QUERYSTRING) != -1) {
                //No Heap Analytics code here
                console.log("No Heap Analytics code here");
            } else {
                window.heap = window.heap || [], heap.load = function (e, t) {
                    window.heap.appid = e, window.heap.config = t = t || {};
                    var r = t.forceSSL || "https:" === document.location.protocol,
                        a = document.createElement("script");
                    a.type = "text/javascript", a.async = !0, a.src = (r ? "https:" : "http:") + "//cdn.heapanalytics.com/js/heap-" + e + ".js";
                    var n = document.getElementsByTagName("script")[0];
                    n.parentNode.insertBefore(a, n);
                    for (var o = function (e) {
                            return function () {
                                heap.push([e].concat(Array.prototype.slice.call(arguments, 0)))
                            }
                        }, p = ["addEventProperties", "addUserProperties", "clearEventProperties", "identify", "removeEventProperty", "setEventProperties", "track", "unsetEventProperty"], c = 0; c < p.length; c++)
                        heap[p[c]] = o(p[c])
                };
                heap.load(TRACKING_NUMBERS.heap);
            }
    
            ! function (f, b, e, v, n, t, s) {
                if (f.fbq) return;
                n = f.fbq = function () {
                    n.callMethod ?
                        n.callMethod.apply(n, arguments) : n.queue.push(arguments)
                };
                if (!f._fbq) f._fbq = n;
                n.push = n;
                n.loaded = !0;
                n.version = '2.0';
                n.queue = [];
                t = b.createElement(e);
                t.async = !0;
                t.src = v;
                s = b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t, s)
            }(window, document, 'script',
                'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', TRACKING_NUMBERS.fb);
            fbq('track', 'PageView');
    
        }

    }
    
  render() {
    return (
        <div>
        </div>
    )
  }
}
