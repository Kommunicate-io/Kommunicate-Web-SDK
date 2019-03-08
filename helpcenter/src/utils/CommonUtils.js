import axios from 'axios';
import {getEnvironment, config} from '../config/config-env';
import {url} from '../config/Url'

const env = getEnvironment(),
      kmApiUrl = config[env].baseurl.kommunicateAPI,
      kmWebUrl = config[env].kommunicateWebsiteUrl;

export const CommonUtils = {
        getUrlParameter: function (search, name) {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
            var results = regex.exec(search);
            return results === null ? '' : decodeURIComponent(results[1]);
        },

        getAllFaq: (userappId) => {
            let searchQuery = {
                    appId: userappId
                },
                headers = {
                    'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8"
                },
                queryUrl = kmApiUrl + url["kommunicateApi"].search,
                faqList;
            return (axios({
                method: 'get',
                url: queryUrl,
                headers: headers,
                params: searchQuery
            })).then(response => {
                faqList = response.data.data;
                return faqList;
            }).catch(err => {
                console.log(err)
            })

        },

        searchFaq: (appId, searchQuery) => {
            searchQuery.replace(" ", "-");
            let queryUrl = kmApiUrl + url["kommunicateApi"].search,
                faqList,
                params = {
                    appId: appId,
                    query: searchQuery
                }
            return (axios.get(queryUrl, {
                'params': params
            })).then(response => {
                faqList = response;
                return faqList.data;
            }).catch(err => {
                console.log(err)
            })

        },

        getSelectedFaq: (appId, searchQuery) => {
            let queryUrl = kmApiUrl + url["kommunicateApi"].search+'/'+searchQuery+'/'+appId , faqList;
            return (axios.get(queryUrl)).then(response => {
                faqList = response;
                return faqList.data;
            }).catch(err => {
                console.log(err)
            })

        },
        getAppSettings: () => {
            let queryUrl = kmApiUrl + url["kommunicateApi"].appSettingsDomain;
            return (axios.get(queryUrl)).then(response => {
                return response;
            }).catch(err => {
                console.log(err)
            })

        },

        getEnvironment: () => {
            return env;
        },

        getKommunicateWebsiteUrl: () => {
            return kmWebUrl;
        },

        setItemInLocalStorage: function(key,value){
            if(key){
                localStorage.setItem(key, JSON.stringify(value)); 
            }
        },

        getItemFromLocalStorage: function(key){
            if(key){
                let data =  localStorage.getItem(key); 
                try{
                    data=  JSON.parse(data); 
                }catch(e){
                    // its string
                }
                return data;
            }
        },
        
        removeItemFromLocalStorage : function(key){
            if(key){
                localStorage.removeItem(key);
            }
        },
        formatFaqQuery : function(query){
            return query.replace(/[^a-zA-Z ]/g, "").replace(/ /g,"-");
        },

        getHostNameFromUrl : function(){
            return window.location.hostname;
        }
}