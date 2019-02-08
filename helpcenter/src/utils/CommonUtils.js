import axios from 'axios';
import {getEnvironment, config} from '../config/config-env';
import {url} from '../config/Url'

var env = getEnvironment();
const kmApiUrl = config[env].baseurl.kommunicateAPI;

export const CommonUtils = {
    getUrlParameter: function(search, name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(search);
        return results === null ? '' : decodeURIComponent(results[1]);
    },

    getAllFaq : (userAppID)=>{
        let searchQuery = {appId:userAppID},
            headers = {
                'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8" 
            },
            queryUrl = kmApiUrl+url["kommunicateApi"].search, faqList;
        return (axios({
            method : 'get',
            url: queryUrl,
            headers: headers,
            params: searchQuery
        })).then(response =>{
                faqList = response.data.data;
                return faqList;
            }
            ).catch(err =>{
                console.log(err)
            })

    },

    searchFaq : (appID, searchQuery)=>{
        searchQuery.replace(" ","-");
        let queryUrl = kmApiUrl+url["kommunicateApi"].search, faqList,
        params =  {
            appId: appID,
            query:searchQuery
        }
        return (axios.get(queryUrl,
            {'params':params } 
            )).then(response =>{
                faqList = response;
                return faqList.data;
            }
            ).catch(err =>{
                console.log(err)
            })

    }
}