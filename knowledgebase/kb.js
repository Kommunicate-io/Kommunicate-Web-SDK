(function (window) {
    'use strict';
    function define_KommunicateKB() {
        var KommunicateKB = {};
        var KM_API_URL = "https://api.kommunicate.io";
        var KB_URL = "/autosuggest/message/:appId?criteria=type&value=faq";
        var appId;
        var helpdocsKey;

        //KommunicateKB.init("https://api.kommunicate.io", "kommunicate-support", "cgIRxXkKSsyBYPTlPg4veC5kxvuKL9cC4Ip9UEao");
        KommunicateKB.init = function (url, applicationId, helpdocsToken) {
            KM_API_URL = url;
            appId = applicationId;
            helpdocsKey = helpdocsToken;
            if(helpdocsKey) {
                Helpdocs.init(helpdocsKey);
            }
            KB_URL = KB_URL.replace(":appId", appId);
        }

        KommunicateKB.getArticles = function(options) {
            var articles = {};
            KommunicateKB.getFaqs({data: options.data, success: function(response) {
                console.log(response);
                //Todo: convert to article format.

                if (helpdocsKey) {
                    Helpdocs.getArticles({data: options.data, success:function(response) {
                            console.log(response);
                            //Todo: convert to article format.
                        }, error: function(error) {

                        }
                    });
                }

            }, error: function() {

            }});

        }

        //KommunicateKB.getArticles({data: {query: 'apns'}, success: function(response) {console.log(response);}, error: function() {}});
        KommunicateKB.getFaqs = function (options) {
            var url = KM_API_URL + KB_URL;
            if (options.data.query) {
                url = url + "&query=" + options.data.query;
            }

            var response = new Object();
            KMCommonUtils.ajax({
                url: url,
                async: (typeof options.async !== 'undefined') ? options.async : true,
                type: 'get',
                success: function (data) {
                    response.status = "success";
                    response.data = data.data;
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

        //KommunicateKB.getArticle({data: {articleId: 'tuqx5g5kq5'}, success: function(response) {console.log(response);}, error: function() {}});
        KommunicateKB.getFaq = function (options) {
            var response = new Object();
            KMCommonUtils.ajax({
                url: KM_API_URL + KB_URL + "&articleId=" + options.data.articleId,
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

        return KommunicateKB;
    }
    //define globally if it doesn't already exist
    if (typeof (KommunicateKB) === 'undefined') {
        window.KommunicateKB = define_KommunicateKB();
    }
    else {
        console.log("KommunicateKB already defined.");
    }
})(window);