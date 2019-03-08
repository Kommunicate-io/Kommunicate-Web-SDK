import axios from 'axios';
import { getEnvironment, config } from '../config/config-env';
import url from '../config/Url';

const ENV = getEnvironment(),
    KM_API_URL = config[ENV].baseurl.kommunicateAPI;

export const HelpcenterClient = {

    getAllFaq: (userappId) => {
        let searchQuery = {
                appId: userappId
            },
            headers = {
                'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8"
            },
            queryUrl = KM_API_URL + url.kommunicateApi.SEARCH;
        return (axios({
            method: 'get',
            url: queryUrl,
            headers: headers,
            params: searchQuery
        })).then(response => {
            return response.data.data;
        }).catch(err => {
            console.log(err)
        })

    },

    searchFaq: (appId, searchQuery) => {
        searchQuery.replace(" ", "-");
        let queryUrl = KM_API_URL + url.kommunicateApi.SEARCH,
            params = {
                appId: appId,
                query: searchQuery
            }
        return (axios.get(queryUrl, {
            'params': params
        })).then(response => {
            return response.data;
        }).catch(err => {
            console.log(err)
        })

    },

    getSelectedFaq: (appId, searchQuery) => {
        let queryUrl = KM_API_URL + url.kommunicateApi.SEARCH + searchQuery + '/' + appId;
        return (axios.get(queryUrl)).then(response => {
            return response.data;
        }).catch(err => {
            console.log(err)
        })

    },
    getAppSettings: () => {
        let queryUrl = KM_API_URL + url.kommunicateApi.APP_SETTINGS_DOMAIN;
        return (axios.get(queryUrl)).then(response => {
            return response;
        }).catch(err => {
            console.log(err)
        })

    }
}
