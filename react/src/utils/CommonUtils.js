import { getResource } from '../config/config.js'
import moment from 'moment';

const CommonUtils = {
    setUserSession: function(userSession) {
        userSession.isAdmin = userSession.isAdmin | false;
        userSession.imageLink = (typeof userSession.imageLink === "undefined") ? (userSession.applozicUser.imageLink?userSession.applozicUser.imageLink: getResource().defaultImageUrl) : userSession.imageLink;
        localStorage.setItem('KM_USER_SESSION', JSON.stringify(userSession));
    },
    getUserSession: function() {
        return JSON.parse(localStorage.getItem('KM_USER_SESSION'));
    },
    updateAvailabilityStatus: function(available) {
        let userSession = CommonUtils.getUserSession();
        userSession.availabilityStatus = available;
        CommonUtils.setUserSession(userSession);
    },
    getUrlParameter: function(search, name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(search);
        return results === null ? '' : decodeURIComponent(results[1]);
    },
    getCookie :function(cname){
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },
    /* Method to set cookies*/
    setCookie: function(cname, cvalue, exdays,domain) {
        var d = new Date();
        var cookieMaxExpirationdate= "2038-01-19 04:14:07";
        var expires = "expires="+ new Date(cookieMaxExpirationdate).toUTCString();
        let cookie = cname + "=" + cvalue + ";" + expires;
        cookie=  domain?cookie+";domain="+domain:cookie;
        cookie += ";path=/";
        document.cookie =  cookie;
    },
    deleteCookie:function(name){
            document.cookie = name +'=; Path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    },
    getDisplayName: function(user) {
        if (user.displayName) {
          return user.displayName;
        } else if (user.email) {
          return user.email;
        }
        return user.userId
      },
    getDomain:function() {
        var hostName = window.location.hostname;
        var domain = hostName;

        if (hostName != null) {
            var parts = hostName.split('.').reverse();

            if (parts != null && parts.length > 1) {
                domain = "."+parts[1] + '.' + parts[0];
            }
        }

        return domain;
    },
    setApplicationIds: function(appID) {
        localStorage.setItem('KM_USER_SESSION_APP_IDS', JSON.stringify(appID));
    },
    getApplicationIds: function() {
        return JSON.parse(localStorage.getItem('KM_USER_SESSION_APP_IDS'));
    },
    getDaysCount: function() {
        var now = new Date();
        var trialStarted = new Date(CommonUtils.getUserSession().application.createdAtTime);
        var timeDiff = now.getTime() - trialStarted.getTime();
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return diffDays;
    },
    isStartupPlan: function() {
        return typeof CommonUtils.getUserSession().subscription === 'undefined' || CommonUtils.getUserSession().subscription == '' || CommonUtils.getUserSession().subscription == '0' || CommonUtils.getUserSession().subscription === "startup";
    },
    isTrialPlan: function() {
        return CommonUtils.getDaysCount() < 31 && CommonUtils.isStartupPlan();
    },
    lastSeenTime(lastSeenAtTime) {
      var lastSeen;
      var minInTwoDays = 2880;
      var date = new Date(lastSeenAtTime);
      var currentDate = new Date();
      var diff = Math.abs(currentDate - date);
      var minutes = Math.floor((diff / 1000) / 60);
      if (minutes < minInTwoDays) {
        if (minutes < 60) {
          lastSeen = moment.unix(lastSeenAtTime / 1000).fromNow();
        } else {
          var hour = Math.floor(minutes / 60)
          lastSeen = hour + " hrs ago";
        }
      } else {
        lastSeen = moment.unix(lastSeenAtTime / 1000).format("DD MMMM YYYY");
      }
      return lastSeen;
    }

}

export default CommonUtils;
