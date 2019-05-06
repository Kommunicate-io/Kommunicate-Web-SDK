(function (window) {
    'use strict';
    function define_Helpdocs() {
        var Helpdocs = {};
        var HELPDOCS_URL = "https://api.helpdocs.io";

        //Helpdocs.getArticles({data: {helpdocsAccessKey: '', query: 'apns'}, success: function(response) {console.log(response);}, error: function() {}});
        Helpdocs.getArticles = function (options) {
            var url = HELPDOCS_URL + "/v1/article?key=" + options.data.helpdocsAccessKey;
            if (options.data.query) {
                url = HELPDOCS_URL + "/v1/search?key=" + options.data.helpdocsAccessKey + "&query=" + options.data.query;
            }

            var response = new Object();
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

        //Helpdocs.getArticle({data: {articleId: 'tuqx5g5kq5'}, success: function(response) {console.log(response);}, error: function() {}});
        Helpdocs.getArticle = function (options) {
            var response = new Object();
            KMCommonUtils.ajax({
                url: HELPDOCS_URL + "/v1/article/" + options.data.articleId + "?key=" + options.data.helpdocsAccessKey,
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