import { getResource, getConfig, getCommonResource } from '../config/config.js'
import {THIRD_PARTY_LOGIN, KM_RELEASE_VERSION, KM_PLAN_LENGTH, MONTH_NAMES} from '../utils/Constant';
import { KommunicateLogoSvg, ApplozicLogo } from '../assets/svg/svgs_common.js';
import CryptoJS from 'crypto-js';

export const PRODUCTS = {
    'applozic': {
        title: 'Applozic',
        logo: ApplozicLogo
    }, 
    'kommunicate': {
        title: 'Kommunicate',
        logo: KommunicateLogoSvg
    }
};

const CommonUtils = {
    setUserSession: function(userSession) {
        userSession.isAdmin = userSession.isAdmin | false;
        userSession.imageLink = userSession.imageLink ||(userSession.applozicUser&&userSession.applozicUser.imageLink?userSession.applozicUser.imageLink: getResource().defaultImageUrl);
        if(userSession.password) {
            delete userSession.password;
        }
        CommonUtils.setItemInLocalStorage('KM_USER_SESSION', userSession);
    },
    getUserSession: function() {
        return CommonUtils.getItemFromLocalStorage("KM_USER_SESSION");
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
        // user.displayName.trim() -> this will check whether string is not just whitespace
        if (user.displayName && user.displayName.trim()) {
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
        CommonUtils.setItemInLocalStorage('KM_USER_SESSION_APP_IDS', appID);
    },
    getApplicationIds: function() {
        return CommonUtils.getItemFromLocalStorage("KM_USER_SESSION_APP_IDS");
    },
    getDaysCount: function() {
        var now = new Date();
        var trialStarted = new Date(CommonUtils.getUserSession().application.createdAtTime);
        var timeDiff = now.getTime() - trialStarted.getTime();
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return diffDays;
    },
    isStartupPlan: function() {
        return typeof CommonUtils.getUserSession().subscription === 'undefined' || CommonUtils.getUserSession().subscription == '' || CommonUtils.getUserSession().subscription == '0' || CommonUtils.getUserSession().subscription === "startup" || CommonUtils.getUserSession().subscription === 'applozic';
    },
    isEnterprisePlan: function() {
        return typeof CommonUtils.getUserSession().subscription != 'undefined' && CommonUtils.getUserSession().subscription.indexOf("enterprise") != -1;
    },
    isApplozicTrialPlan: function() {
        return CommonUtils.getUserSession().application.pricingPackage == 0;
    },
    isTrialPlan: function() {
        return CommonUtils.getDaysCount() < (CommonUtils.maxDaysAsPerPlan() + 1) && ((CommonUtils.isKommunicateDashboard() && CommonUtils.isStartupPlan()) || (CommonUtils.isProductApplozic() && CommonUtils.isApplozicTrialPlan()));
    },
    isExpiredPlan: function() {
        return (CommonUtils.getDaysCount() > CommonUtils.maxDaysAsPerPlan() && (CommonUtils.isKommunicateDashboard() && CommonUtils.isStartupPlan() || CommonUtils.isProductApplozic() && CommonUtils.isApplozicTrialPlan())) ;
    },
    // Below a specific date is mentioned because before 20th March 2019 we were giving 30 days trial and after that we will start 14 days trial.
    isOldPlan: function() {
        return new Date(CommonUtils.getUserSession().application.createdAtTime) < new Date(KOMMUNICATE_CONSTANTS.RELEASE_DATE);
    },
    maxDaysAsPerPlan: function() {
        if(CommonUtils.isKommunicateDashboard()){
            return CommonUtils.isOldPlan() ? KM_PLAN_LENGTH.OLD : KM_PLAN_LENGTH.NEW;
        }
        else {
            return KM_PLAN_LENGTH.OLD;
        }
    },
    hasFeatureAccess: function() {
        return CommonUtils.isTrialPlan() || !CommonUtils.isStartupPlan();
    },
    getApplicationExpiryDate () {
        var applicationCreatedAt = CommonUtils.getUserSession().applicationCreatedAt ;
        var planLength = CommonUtils.maxDaysAsPerPlan();
        if (applicationCreatedAt) {
            applicationCreatedAt = new Date(CommonUtils.getUserSession().applicationCreatedAt).getTime();
            var applicationExpiryDate = applicationCreatedAt += 1000 * 60 * 60 * 24 * planLength;
            applicationExpiryDate = new Date(applicationExpiryDate);
            return applicationExpiryDate
        }     
    },
    getFormatedExpiryDate() {
        let applicationExpiryDate = CommonUtils.getApplicationExpiryDate();
        if (applicationExpiryDate) {
            let DD = applicationExpiryDate.getDate();
            let MM = MONTH_NAMES[applicationExpiryDate.getMonth()];
            var YY = applicationExpiryDate.getFullYear();
            applicationExpiryDate = DD + ' ' + MM + ', ' + YY;
        }
        return applicationExpiryDate;
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
    updateKommunicateVersion: function() {
        CommonUtils.setItemInLocalStorage("kommunicateVersion",KM_RELEASE_VERSION)
    }, 
    isLatestKmVersionOnLocalStorage: function(){
        var kmSessionReleaseVersion =CommonUtils.getItemFromLocalStorage("kommunicateVersion")
        return (kmSessionReleaseVersion && (KM_RELEASE_VERSION == kmSessionReleaseVersion))
    },
    triggerCustomEvent: function(eventName, options) {
        options = typeof options != 'object' ? options : {}
        options.bubbles = options.bubbles || true;
        options.cancelable = options.cancelable || true;
        if (navigator.userAgent.indexOf('MSIE') !== -1 ||
        navigator.appVersion.indexOf('Trident/') > 0) {
            /* Microsoft Internet Explorer detected in. */
            var evt = document.createEvent('Event');
            evt.initEvent(eventName, options.bubbles, options.cancelable);
            window.dispatchEvent(evt);
        } else {
            //Custom event trigger
            window.dispatchEvent(new CustomEvent(eventName, {
                detail: options.data || {},
                bubbles: options.bubbles || true,
                cancelable: options.cancelable || true
            }));
        }	         
    },
    getUserStatus:function() {
        let userSession = CommonUtils.getUserSession();
        return typeof userSession.availabilityStatus != "undefined" ? userSession.availabilityStatus : userSession.status;
    },
    updateUserStatus:function(status) {
        let userSession = CommonUtils.getUserSession();
        userSession.availabilityStatus ? userSession.availabilityStatus = status : userSession.status = status;
        CommonUtils.setUserSession(userSession);
    },
    updateUserSession : function(data,){
        if(typeof data =='object'){
            let userSession = CommonUtils.getUserSession()||{};
           for (const key in data) {
               if (data.hasOwnProperty(key)) {
                   const element = data[key];
                   userSession[key] = data[key];
               }
           }

            CommonUtils.setUserSession(userSession);
        }
    },
    isInternetExplorerOrEdge: function() {
        return ((navigator.userAgent.indexOf('MSIE') !== -1 ||
        navigator.appVersion.indexOf('Trident/') > 0) || (window.navigator.userAgent.indexOf("Edge") > -1));
    },
    getProduct: function() {
        let userSession = this.getUserSession();
        if (CommonUtils.getUrlParameter(window.location.href, 'product')) {
            return CommonUtils.getUrlParameter(window.location.href, 'product');
        } else if(userSession) {
            if (userSession.application.pricingPackage >= 100) {
                return "kommunicate";
            } else {
                return getConfig().brand ? getConfig().brand : "applozic";
            }
        }

        return getConfig().brand ? getConfig().brand : "kommunicate";
    },
    getProductName: function() {
        return this.getProduct() == "applozic" ? "Applozic":"Kommunicate";
    },
    hasApplozicAccess: function() {
        let userSession = this.getUserSession();
        if (userSession) {
            return userSession.application.pricingPackage < 100 || userSession.application.pricingPackage >= 200;
        }
        return this.isProductApplozic();
    },
    isProductApplozic: function() {
        return this.getProduct() == "applozic";
    },
    isKommunicateDashboard: function() {
        return this.getProduct() == "kommunicate";
    },
    isApplicationAdmin: function(userSession){
        userSession = userSession ? userSession : this.getUserSession()
        return userSession.roleName === 'APPLICATION_ADMIN';
    },
    // below function when called will set cursor to end of the input string
    setCursorAtTheEndOfInputString: function (el)  {
        if(el.childNodes.length !== 0 ){ 
          el.focus();
          if (typeof window.getSelection != "undefined" &&
          typeof document.createRange != "undefined") {
          var range = document.createRange();
          range.selectNodeContents(el);
          range.collapse(false);
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
          } else if (typeof document.body.createTextRange != "undefined") {
          var textRange = document.body.createTextRange();
          textRange.moveToElementText(el);
          textRange.collapse(false);
          textRange.select();
          }
        } else {
          return false;
        }
    },
    removeSpecialCharacters: function (value) {
        return value.replace(/[^A-Z0-9]+/ig, "-").toLowerCase();
    },
    isThirdPartyLogin: function (loginVia) {
        return THIRD_PARTY_LOGIN.some(function (el) {
            return el === loginVia;
        });
    },
    getContactImageByAlphabet: function(name) {
        var displayName = name;
        var name = displayName.charAt(0).toUpperCase();
        var className = "alpha_user";

        if (typeof name !== "string" || typeof name === 'undefined' || name === "") {
            className = "km-icon-user km-alpha-user";
            return [name, className];
        }
        var first_alpha = name.charAt(0);
        var letters = /^[a-zA-Z0-9]+$/;
        if (first_alpha.match(letters)) {
            first_alpha = "alpha_" + first_alpha.toUpperCase();
            return [name, first_alpha];
        }
        else {
            return [name, className];
        }
    },isObject: function(object) {
        if (!object) return false;
        return typeof object == 'object' && object.constructor == Object;
    },
    hasJsonStructure: function (value) {
        if (typeof value !== 'string') return false;
        try {
            const result = JSON.parse(value);
            return Object.prototype.toString.call(result) === '[object Object]'
                || Array.isArray(result);
        } catch (err) {
            return false;
        }
    },
    updateRoutingRulesInStorage: function (options) {
        // update in session
        let userSession = CommonUtils.getUserSession();
        userSession.routingState = options.routingRuleForAgents;
        CommonUtils.setUserSession(userSession);
        // up[date in storage 
        var appSettings = kmUtils.getItemFromLocalStorage("KM_APP_SETTINGS") || {};
        appSettings.agentRouting = options.routingRuleForAgents;
        kmUtils.setItemInLocalStorage("KM_APP_SETTINGS", appSettings);
    },
    encryptDataUsingCrypto: function (data) {
		return CryptoJS.AES.encrypt(JSON.stringify(data), getCommonResource().kommunicateCryptoKey);

    },
    removeHtmlTag: function(html) {
        let temporalDivElement = document.createElement("div");
        temporalDivElement.innerHTML = html;
        return temporalDivElement.textContent || temporalDivElement.innerText || "";
    }
}

export default CommonUtils;
