(function (window) {
    'use strict';
    function define_KMCommonUtils() {
        var KMCommonUtils = {};

        KMCommonUtils.ajax = function (options) {
            function extend() {
                for (var i = 1; i < arguments.length; i++)
                    for (var key in arguments[i])
                        if (arguments[i].hasOwnProperty(key))
                            arguments[0][key] = arguments[i][key];
                return arguments[0];
            }

            var reqOptions = extend({}, {}, options);

            var request = new XMLHttpRequest();
            var responsedata;
            var asyn = true;
            var cttype;
            if (typeof reqOptions.async !== 'undefined' || options.async) {
                asyn = reqOptions.async;
            }

            var typ = reqOptions.type.toUpperCase();

            if (typ === 'GET' && typeof reqOptions.data !== "undefined") {
                reqOptions.url = reqOptions.url + "?" + reqOptions.data;
            }

            request.open(typ, reqOptions.url, asyn);
            if (typ === 'POST' || typ === 'GET') {
                if (typeof reqOptions.contentType === 'undefined') {
                    cttype = 'application/x-www-form-urlencoded; charset=UTF-8';
                } else {
                    cttype = reqOptions.contentType;
                }
                request.setRequestHeader('Content-Type', cttype);
            }

            if (typeof reqOptions.data === 'undefined') {
                request.send();
            } else {
                request.send(reqOptions.data);
            }

            request.onreadystatechange = function () {
                if (request.readyState === XMLHttpRequest.DONE) {
                    if (request.status === 200) {
                        //success
                        var contType = request.getResponseHeader("Content-Type");
                        if (typeof contType === "undefined" || contType === "null" || contType === null) {
                            contType = "";
                        }

                        if (contType.toLowerCase().indexOf("text/html") != -1) {
                            responsedata = request.responseXML;
                        } else if (contType.toLowerCase().indexOf("application/json") != -1) {
                            responsedata = JSON.parse(request.responseText);
                        } else {
                            responsedata = request.responseText;
                        }
                        reqOptions.success(responsedata);
                    } else {
                        //error
                        reqOptions.error(responsedata);
                    }
                }
            };
        }

        return KMCommonUtils;
    }
    //define globally if it doesn't already exist
    if (typeof (KMCommonUtils) === 'undefined') {
        window.KMCommonUtils = define_KMCommonUtils();
    }
    else {
        console.log("KMCommonUtils already defined.");
    }
})(window);