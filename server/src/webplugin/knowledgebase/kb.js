(function (window) {
    'use strict';
    function define_KommunicateKB() {
        var KommunicateKB = {};
        var KM_API_URL = "https://api.kommunicate.io";
        var KB_URL = "/autosuggest/message/:appId?criteria=type&value=faq";
        var appId;
        var helpdocsKey;
        var SOURCES = {kommunicate : 'KOMMUNICATE', helpdocs: 'HELPDOCS'};

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
            var articles = [];
            KommunicateKB.getFaqs({data: options.data, success: function(response) {
                for (var i = 0; i < response.data.length; i++){
                    var article = response.data[i];
                    articles.push({
                        articleId: article.id,
                        title: article.name,
                        description: article.content, 
                        status: article.status,
                        source: SOURCES.kommunicate
                    });
                }

                if (helpdocsKey) {
                    Helpdocs.getArticles({data: options.data, success:function(response) {
                            var data = response.data;
                            for (var i = 0; i < data.articles.length; i++){
                                var article = data.articles[i];

                                articles.push({
                                    articleId: article.article_id,
                                    title: article.title,
                                    description: article.description, 
                                    url: article.url,
                                    source: SOURCES.helpdocs
                                });
                            }

                            if (options.success) {
                                var res = new Object();
                                res.status = "success";
                                res.data = articles;
                                options.success(res);
                            }
                        }, error: function(error) {

                        }
                    });
                } else {
                    if (options.success) {
                        var res = new Object();
                        res.status = "success";
                        res.data = articles;
                        options.success(res);
                    }
                }

            }, error: function() {

            }});
        }

        //KommunicateKB.getArticle({data: {articleId: 'tuqx5g5kq5'}, success: function(response) {console.log(response);}, error: function() {}});
        KommunicateKB.getArticle = function (options) {
            if (options.data.source == SOURCES.helpdocs) {
                Helpdocs.getArticle({data: options.data, success: function(response) {
                    var article = response.data.article;
                    var article = {
                        articleId: article.article_id,
                        title: article.title,
                        description: article.description, 
                        url: article.url,
                        source: SOURCES.helpdocs
                    };

                    if (options.success) {
                        var res = new Object();
                        res.status = "success";
                        res.data = article;
                        options.success(res);
                    }
                }, error: function() {

                }
                });
            } else {
                //Not supported yet
            }
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