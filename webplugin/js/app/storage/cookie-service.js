class KmCookieStorage extends KmStorage {
    constructor() {
        super();
    }

    getCookie = (cname, skipPrefix, isOld) => {
        var cookiePrefix = this.getCookiePrefix();
        var name = skipPrefix ? cname : cookiePrefix + cname;
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');

        if (!isOld) {
            name += '-' + this.appId + '=';
        } else {
            name += '=';
        }
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return '';
    };
    /* Method to set cookies*/
    setCookie = (cookie) => {
        var cookiePrefix = this.getCookiePrefix();
        var name =
            cookie && cookie.skipPrefix
                ? cookie.name
                : cookiePrefix + cookie.name;

        var value = cookie.value;
        var path = '/';
        var secure =
            typeof cookie.secure == 'undefined'
                ? this.isHttpsEnabledConnection()
                : cookie.secure;

        var cookieExpiry = new Date('2038-01-19 04:14:07').toUTCString();
        var isChrome =
            navigator.userAgent.indexOf('Chrome') != -1 &&
            navigator.vendor.indexOf('Google') != -1;
        var domain = cookie.domain;
        if (cookie.path) {
            path = cookie.path;
        }
        if (cookie.expiresInDays) {
            var today = new Date();
            cookieExpiry = new Date(
                today.setDate(today.getDate() + cookie.expiresInDays)
            ).toUTCString();
        }
        name += '-' + this.appId;
        document.cookie =
            name +
            '=' +
            value +
            ';' +
            'expires=' +
            cookieExpiry +
            ';path=' +
            path +
            (secure ? ';secure' : '') +
            (domain ? ';domain=' + domain : '') +
            ';samesite=strict';
    };
    getCookiePrefix = () => {
        const appOptions =
            kmSessionStorage.getDataFromKmSession('appOptions') ||
            applozic._globals;
        const cookiePrefix = KommunicateUtils.getSubDomain();
        if (appOptions && appOptions.domainKey) {
            cookiePrefix = appOptions.domainKey;
        }
        return cookiePrefix + '_';
    };
    isHttpsEnabledConnection = () => {
        return parent.window.location.protocol == 'https:';
    };
    deleteCookie = (cookie, isOld) => {
        var cookiePrefix = this.getCookiePrefix();
        var name =
            cookie && cookie.skipPrefix
                ? cookie.name
                : cookiePrefix + cookie.name;

        if (!isOld) {
            name += '-' + this.appId;
        }
        var value = '';
        var path = cookie.path || '/';
        var secure =
            typeof cookie.secure == 'undefined'
                ? this.isHttpsEnabledConnection()
                : cookie.secure;
        var domain = cookie.domain;
        document.cookie =
            name +
            '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=' +
            path +
            (secure ? ';secure' : '') +
            (domain ? ';domain=' + domain : '');
    };

    deleteUserCookiesOnLogout = function () {
        Object.values(KommunicateConstants.COOKIES).forEach((cookie) => {
            this.deleteCookie({ name: cookie, domain: MCK_COOKIE_DOMAIN });
        });
    };
}

const kmCookieStorage = new KmCookieStorage();
