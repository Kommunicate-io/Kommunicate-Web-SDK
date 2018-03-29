(function (window) {
    'use strict';
    function define_Helpdocs() {
        var Helpdocs = {};
        var HELPDOCS_URL = "https://api.helpdocs.io";
        var helpdocsKey;

        Helpdocs.init = function (key) {
            helpdocsKey = key;
        }

        //Helpdocs.getArticles({data: {query: 'apns'}, success: function(response) {console.log(response);}, error: function() {}});
        Helpdocs.getArticles = function (options) {
            var url = HELPDOCS_URL + "/v1/article?key=" + helpdocsKey;
            if (options.data.query) {
                url = HELPDOCS_URL + "/v1/search?key=" + helpdocsKey + "&query=" + options.data.query;
            }

            var response = new Object();
            Helpdocs.ajax({
                url: url,
                async: (typeof options.async !== 'undefined') ? options.async : true,
                type: 'get',
                success: function (data) {
                    response.status = "success";
                    response.data = data;
                    if (options.success) {
                        options.success(response);
                    }
                    return;
                },
                error: function (xhr, desc, err) {
                    response.status = "error";
                    if (options.error) {
                        options.error(response);
                    }
                }
            });
        }

        //Helpdocs.getArticle({data: {articleId: 'tuqx5g5kq5'}, success: function(response) {console.log(response);}, error: function() {}});
        Helpdocs.getArticle = function (options) {
            var response = new Object();
            Helpdocs.ajax({
                url: HELPDOCS_URL + "/v1/article/" + options.data.articleId + "?key=" + helpdocsKey,
                async: (typeof options.async !== 'undefined') ? options.async : true,
                type: 'get',
                success: function (data) {
                    response.status = "success";
                    response.data = data;
                    if (options.success) {
                        options.success(response);
                    }
                    return;
                },
                error: function (xhr, desc, err) {
                    response.status = "error";
                    if (options.error) {
                        options.error(response);
                    }
                }
            });
        }

        Helpdocs.ajax = function (options) {
            function extend() {
                for (var i = 1; i < arguments.length; i++)
                    for (var key in arguments[i])
                        if (arguments[i].hasOwnProperty(key))
                            arguments[0][key] = arguments[i][key];
                return arguments[0];
            }

            var reqOptions = extend({}, {}, options);
            console.log(options);

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

            console.log("request.open");
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

        return Helpdocs;
    }
    //define globally if it doesn't already exist
    if (typeof (Helpdocs) === 'undefined') {
        window.Helpdocs = define_Helpdocs();
    }
    else {
        console.log("Helpdocs already defined.");
    }
})(window);