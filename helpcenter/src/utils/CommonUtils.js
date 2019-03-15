import {getEnvironment, config} from '../config/config-env';

const env = getEnvironment(),
      kmWebUrl = config[env].kommunicateWebsiteUrl;

export const CommonUtils = {
    getUrlParameter: function (search, name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(search);
        return results === null ? '' : decodeURIComponent(results[1]);
    },

    getEnvironment: () => {
        return env;
    },

    getKommunicateWebsiteUrl: () => {
        return kmWebUrl;
    },

    setItemInLocalStorage: function (key, value) {
        if (key) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    },

    getItemFromLocalStorage: function (key) {
        if (key) {
            let data = localStorage.getItem(key);
            try {
                data = JSON.parse(data);
            } catch (e) {
                // its string
            }
            return data;
        }
    },

    removeItemFromLocalStorage: function (key) {
        if (key) {
            localStorage.removeItem(key);
        }
    },

    formatFaqQuery: function (query) {
        return query.replace(/[/]/g,'-').replace(/ /g,"-").replace('?','');
    },

    getHostNameFromUrl: function () {
        return window.location.hostname;
    }
}