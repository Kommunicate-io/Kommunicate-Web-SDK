import axios from 'axios';
import {getEnvironment, config} from '../config/config-env';

var env = getEnvironment();
var kmApiUrl = config[env].baseurl.kommunicateAPI;

export const CommonUtils = {
    getUrlParameter: function(search, name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(search);
        return results === null ? '' : decodeURIComponent(results[1]);
    },

    getAllFaq : (appID)=>{
        let queryUrl = kmApiUrl+"kb/search?appId="+appID, faqList;
        return (axios.get(queryUrl, 
            { 'headers': { 'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8" } } 
            )).then(response =>{
                faqList = response.data.data;
                return faqList;
            }
            ).catch(err =>{
                console.log(err)
            })

    },

    searchFaq : (appID, searchQuery)=>{
        searchQuery.replace(" ","-");
        let queryUrl = kmApiUrl+"kb/search?appId="+appID+"&query="+searchQuery, faqList;
        return (axios.get(queryUrl 
            )).then(response =>{
                faqList = response;
                return faqList.data;
            }
            ).catch(err =>{
                console.log(err)
            })

    }
}