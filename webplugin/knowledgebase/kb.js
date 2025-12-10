(function (window) {
    'use strict';
    function define_KommunicateKB() {
        var KommunicateKB = {};
        var KM_API_URL = 'https://api.kommunicate.io';
        var KB_SEARCH_URL = '/kb/search?appId=:appId';
        var KB_URL =
            '/kb?categoryName=:categoryName&applicationId=:appId&status=published&type=faq';
        var SOURCES = { kommunicate: 'KOMMUNICATE' };
        var SEARCH_ELASTIC = '/kb/_search';

        function toggleModernFaqTab(show) {
            if (!kommunicateCommons.isModernLayoutEnabled()) {
                return;
            }
            show
                ? kommunicateCommons.show('.km-bottom-tab[data-tab="faqs"]')
                : kommunicateCommons.hide('.km-bottom-tab[data-tab="faqs"]');
        }

        function hideFAQBtn() {
            kommunicateCommons.hide('.km-option-faq');
            toggleModernFaqTab(false);
            kommunicate._globals.hasArticles = false;
        }

        //KommunicateKB.init("https://api.kommunicate.io");
        KommunicateKB.init = function (url) {
            KM_API_URL = url;
        };
        KommunicateKB.getCategories = function (options) {
            var appId = options.data.appId;
            var API_BASE_URL = options.data.baseUrl;
            var url = API_BASE_URL + '/kb/category?applicationId=' + appId + '&status=published';
            var response = new Object();
            try {
                KMCommonUtils.ajax({
                    url: url,
                    type: 'get',
                    success: function (data) {
                        response.status = 'success';
                        response.data = data.data || [];
                        if (options.success) {
                            response.data.length === 0 && hideFAQBtn();
                            options.success(response);
                        }
                        return;
                    },
                    error: function (xhr, desc, err) {
                        response.status = 'error';
                        if (options.error) {
                            options.error(response);
                        }
                    },
                });
            } catch (error) {
                options.error(error);
            }
        };

        KommunicateKB.getArticles = function (options) {
            try {
                var articles = [];
                KommunicateKB.getFaqs({
                    data: options.data,
                    success: function (response) {
                        if (
                            !response ||
                            !response.data ||
                            !response.data.length // if data is an empty array
                        ) {
                            //hide the dropdown faq also
                            hideFAQBtn();
                            return null;
                        }

                        kommunicate._globals.hasArticles = true;
                        toggleModernFaqTab(true);
                        for (var i = 0; i < response.data.length; i++) {
                            var article = response.data[i];
                            articles.push({
                                articleId: article.id,
                                title: article.name,
                                description: article.content,
                                status: article.status,
                                body: article.content,
                                source: SOURCES.kommunicate,
                            });
                        }
                        if (options.success) {
                            var res = new Object();
                            res.status = 'success';
                            res.data = articles;
                            options.success(res);
                        }
                    },
                    error: function (err) {
                        if (typeof options.error === 'function') {
                            options.error(err);
                        }
                    },
                });
            } catch (e) {
                options.error(e);
            }
        };

        KommunicateKB.getArticle = function (options) {
            KommunicateKB.getFaq({
                data: options.data,
                success: function (response) {
                    var faq = response.data.data[0];

                    var article = {
                        articleId: faq.id,
                        title: faq.name,
                        description: faq.content,
                        body: faq.content,
                        status: faq.status,
                        source: SOURCES.kommunicate,
                    };

                    if (options.success) {
                        var res = new Object();
                        res.status = 'success';
                        res.data = article;
                        options.success(res);
                    }
                },
                error: function (e) {
                    options.error(e);
                },
            });
        };

        //KommunicateKB.getFaqs({data: {appId: 'kommunicate-support', query: 'apns'}, success: function(response) {console.log(response);}, error: function() {}});
        KommunicateKB.getFaqs = function (options) {
            var url = KM_API_URL + KB_SEARCH_URL.replace(':appId', options.data.appId);
            if (options.data.query) {
                url = url + '&query=' + encodeURIComponent(options.data.categoryName);
            } else if (options.data.categoryName) {
                url =
                    KM_API_URL +
                    KB_URL.replace(':appId', options.data.appId).replace(
                        ':categoryName',
                        encodeURIComponent(options.data.categoryName)
                    );
            }

            //Todo: if query is present then call machine learning server to get answer ids.
            //curl -H "Content-Type: application/json" -d '{ "text":"how to setup notification", "appId":"kommunicate-support" }' https://machine.kommunicate.io/queries.json

            var response = new Object();
            KMCommonUtils.ajax({
                url: url,
                async: typeof options.async !== 'undefined' ? options.async : true,
                type: 'get',
                success: function (data) {
                    response.status = 'success';
                    response.data = data.data;
                    if (options.success) {
                        options.success(response);
                    }
                    return;
                },
                error: function (xhr, desc, err) {
                    response.status = 'error';
                    if (options.error) {
                        options.error(response);
                    }
                },
            });
        };

        KommunicateKB.searchFaqs = function (options) {
            var data = {
                query: {
                    bool: {
                        must: {
                            multi_match: {
                                query: options.data.query,
                                type: 'phrase_prefix',
                                fields: ['content', 'name'],
                            },
                        },
                        filter: {
                            bool: {
                                must: [
                                    {
                                        term: {
                                            'applicationId.keyword': options.data.appId,
                                        },
                                    },
                                    {
                                        term: {
                                            'type.keyword': 'faq',
                                        },
                                    },
                                    {
                                        term: {
                                            deleted: false,
                                        },
                                    },
                                    {
                                        term: {
                                            'status.keyword': 'published',
                                        },
                                    },
                                ],
                            },
                        },
                    },
                },
            };
            var url = KM_API_URL + SEARCH_ELASTIC;

            var response = new Object();
            KMCommonUtils.ajax({
                url: url,
                async: typeof options.async !== 'undefined' ? options.async : true,
                type: 'post',
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function (data) {
                    response.status = 'success';
                    response.data = data.data;
                    if (options.success) {
                        options.success(response);
                    }
                    return;
                },
                error: function (xhr, desc, err) {
                    response.status = 'error';
                    if (options.error) {
                        options.error(response);
                    }
                },
            });
        };

        //KommunicateKB.getFaq({data: {appId: 'kommunicate-support', articleId: 1}, success: function(response) {console.log(response);}, error: function() {}});
        //Note: server side not supported yet
        KommunicateKB.getFaq = function (options) {
            var response = new Object();

            var url = KM_API_URL + KB_SEARCH_URL.replace(':appId', options.data.appId);
            if (options.data && options.data.articleId) {
                url += '&articleId=' + options.data.articleId;
            }

            KMCommonUtils.ajax({
                url: url,
                async: typeof options.async !== 'undefined' ? options.async : true,
                type: 'get',
                success: function (data) {
                    response.status = 'success';
                    response.data = data;
                    if (options.success) {
                        options.success(response);
                    }
                    return;
                },
                error: function (xhr, desc, err) {
                    response.status = 'error';
                    if (options.error) {
                        options.error(response);
                    }
                },
            });
        };

        return KommunicateKB;
    }
    //define globally if it doesn't already exist
    if (typeof KommunicateKB === 'undefined') {
        window.KommunicateKB = define_KommunicateKB();
    } else {
        console.log('KommunicateKB already defined.');
    }
})(window);
