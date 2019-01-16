const axios = require('axios');
const config = require('../../conf/config').getProperties();
const { cardObj } = require('./metabaseObjConstant');
var authKey = null;


/***************** Metabase authentication ******************/

const authenticate = () => {
    return axios.post(config.metabase.domainUrl + "/api/session", { username: config.metabase.userName, password: config.metabase.password }).then(response => {
        console.log('response: ', response.data.id)
        authKey = response.data.id
        return { "X-Metabase-Session": response.data.id };
    }).catch(err => {
        authKey = null;
        return null;
    })
}
const getAuthHeader = () => {
    if (authKey) return { "X-Metabase-Session": authKey };
    return authenticate();
};

/************* metabase read or update apis *****************/

const getCardById = async (cardId) => {
    let url = config.metabase.domainUrl + "/api/card/" + cardId;
    let headers = await getAuthHeader();
    return axios.get(url, { headers: headers }).then(response => {
        return response.data;
    }).catch(err => {
        if (error.response.status === 401) {
            authKey = null
        } else if (error.response.status === 500) {
            throw new Error("session expire")
        }
        console.log(`error while fetching metabase card: ${err}`)
    });
}

const updateCard = async (cardId, newQuery) => {
    let card = Object.assign({}, cardObj)
    card.dataset_query.native.query = newQuery;
    let url = config.metabase.domainUrl + "/api/card/" + cardId;
    let headers = await getAuthHeader();
    return axios.put(url, card, { headers: headers }).then(response => {
        return response.data;
    }).catch(error => {
        if (error.response.status === 401) {
            authKey = null
        } else if (error.response.status === 500) {
            throw new Error("session expire")
        }
        console.log(`error while updating metabase card: ${error}`);
        return;
    });
}

/**
 * @param {Integer} cardId metabase card id
 * @param {*} updateQuery new query that we want to update into card.
 * method will return result for updateQuery
 */

const getResultSet = async (cardId, updateQuery) => {
    let headers = await getAuthHeader();
    let card = await updateCard(cardId, updateQuery);
    let url = config.metabase.domainUrl + "/api/card/" + cardId + "/query/json";
    return axios.post(url, {}, { headers: headers }).then(response => {
        return response.data;
    }).catch(error => {
        if (error.response.status === 401) {
            authKey = null
        } else if (error.response.status === 500) {
            throw new Error("session expire")
        }
        console.log(`error while fetching result set: ${error}`)
        throw error;
    });
}
exports.getResultSet = getResultSet;
