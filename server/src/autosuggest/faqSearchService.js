const { KnowledgeBaseModel } = require('./knowledgeBase')

exports.searchQuery = (query) => {
    return new Promise((resolve, reject) => {
        KnowledgeBaseModel.search({ query_string: { "query": query } }, { hydrate: true }, function (err, results) {
            if (err) {
                return reject({})
            }
            console.log("res: ", results, "results.hits.hits: ", results.hits.hits)
            return resolve(results.hits.hits);
        });
    })
}
exports.searchRawQuery = (esQuery) => {
    return new Promise((resolve, reject) => {
        KnowledgeBaseModel.esSearch(esQuery,
            {
                hydrate: true,
                size: 30,
                hydrateOptions: { select: 'name content referenceId id' }
            },
            function (err, results) {
                if (err) {
                    return reject(err)
                }
                console.log("results.hits.hits: ", results.hits.hits)
                return resolve(results.hits.hits);
            });
    })
}