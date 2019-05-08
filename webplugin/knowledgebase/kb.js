(function (window) {
    'use strict';
    function define_KommunicateKB() {
        var KommunicateKB = {};
        var KM_API_URL = "https://api.kommunicate.io";
        var KB_URL = "/kb/search?appId=:appId";
        var SOURCES = {kommunicate : 'KOMMUNICATE', helpdocs: 'HELPDOCS'};

        //KommunicateKB.init("https://api.kommunicate.io");
        KommunicateKB.init = function (url) {
            KM_API_URL = url;
        }

        //KommunicateKB.getArticles({data: {appId: 'kommunicate-support', query: 'fcm', helpdocsAccessKey: 'cgIRxXkKSsyBYPTlPg4veC5kxvuKL9cC4Ip9UEao'}, success: function(response) {console.log(response);}, error: function() {}});
        KommunicateKB.getArticles = function(options) {
            try{
            var articles = [];
            KommunicateKB.getFaqs({data: options.data, success: function(response) {
                for (var i = 0; i < response.data.length; i++){
                    var article = response.data[i];
                    articles.push({
                        articleId: article.id,
                        title: article.name,
                        description: article.content, 
                        status: article.status,
                        body: article.content,
                        source: SOURCES.kommunicate
                    });
                }

                if (options.data.helpdocsAccessKey) {
                    Helpdocs.getArticles({data: options.data, success:function(response) {
                            var data = response.data;
                            for (var i = 0; i < data.articles.length; i++){
                                var article = data.articles[i];
                                if(article.is_published === true){
                                articles.push({
                                    articleId: article.article_id,
                                    title: article.title,
                                    description: article.description, 
                                    body: article.description,
                                    url: article.url,
                                    source: SOURCES.helpdocs
                                });
                            }
                        }

                            if (options.success) {
                                var res = new Object();
                                res.status = "success";
                                res.data = articles;
                                options.success(res);
                            }
                        }, error: function(error) {
                            if(articles.length && options.success){
                                var res = new Object();
                                res.status = "success";
                                res.data = articles;
                                options.success(res);
                            }else if(options.error){
                            options.error(error);
                            }
                            
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

            }, error: function(err) {
                if(typeof options.error ==='function' ){
                    options.error(err);
                }
                
            }});
        }catch(e){
            options.error(e);
            }
        }

        //KommunicateKB.getArticle({data: {appId: 'kommunicate-support', articleId: 'tuqx5g5kq5', source: 'HELPDOCS', helpdocsAccessKey: 'cgIRxXkKSsyBYPTlPg4veC5kxvuKL9cC4Ip9UEao'}, success: function(response) {console.log(response);}, error: function() {}});
        KommunicateKB.getArticle = function (options) {
            if (options.data.source == SOURCES.helpdocs) {
                Helpdocs.getArticle({data: options.data, success: function(response) {
                    var article = response.data.article;
                    var article = {
                        articleId: article.article_id,
                        title: article.title,
                        description: article.description, 
                        body: article.body,
                        url: article.url,
                        source: SOURCES.helpdocs
                    };

                    if (options.success) {
                        var res = new Object();
                        res.status = "success";
                        res.data = article;
                        options.success(res);
                    }
                }, error: function(e) {
                    options.error(e);
                }
                });
            } else {
                KommunicateKB.getFaq({data: options.data, success: function(response) {
                    var faq = response.data.data[0];
                    
                    var article = {
                        articleId: faq.id,
                        title: faq.name,
                        description: faq.content, 
                        body: faq.content,
                        status: faq.status,
                        source: SOURCES.kommunicate
                    };

                    if (options.success) {
                        var res = new Object();
                        res.status = "success";
                        res.data = article;
                        options.success(res);
                    }
                }, error: function(e) {
                    options.error(e);
                }
            });
            }
        }

        //KommunicateKB.getFaqs({data: {appId: 'kommunicate-support', query: 'apns'}, success: function(response) {console.log(response);}, error: function() {}});
        KommunicateKB.getFaqs = function (options) {
            var url = KM_API_URL + KB_URL.replace(":appId", options.data.appId);
            if (options.data.query) {
                url = url + "&query=" + options.data.query;
            }

            //Todo: if query is present then call machine learning server to get answer ids.
            //curl -H "Content-Type: application/json" -d '{ "text":"how to setup notification", "appId":"kommunicate-support" }' https://machine.kommunicate.io/queries.json

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

        //KommunicateKB.getFaq({data: {appId: 'kommunicate-support', articleId: 1}, success: function(response) {console.log(response);}, error: function() {}});
        //Note: server side not supported yet
        KommunicateKB.getFaq = function (options) {
            var response = new Object();

            let url = KM_API_URL + KB_URL.replace(":appId", options.data.appId);
            if(options.data && options.data.articleId){
                url += "&articleId=" + options.data.articleId;
            }

            KMCommonUtils.ajax({
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