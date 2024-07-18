class KmCookieStorage extends KmStorage {
    constructor() {
        super();
    }

    /* There is no need to decode the cookie because we are not encoding the cookie */
    getCookie = (cname, skipPrefix, isOld) => {
        let cookiePrefix = this.getCookiePrefix();
        const ca = document.cookie.split(';');
        let name = skipPrefix ? cname : cookiePrefix + cname;

        if (!isOld) {
            name += '-' + this.appId + '=';
        } else {
            name += '=';
        }
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return '';
    };

    setCookie = (cookie) => {
        const { name, path, secure, domain } = this.getCookieParams(cookie);
        const value = cookie.value;

        let cookieExpiry = new Date('2038-01-19 04:14:07').toUTCString();

        if (cookie.expiresInDays) {
            const today = new Date();
            cookieExpiry = new Date(
                today.setDate(today.getDate() + cookie.expiresInDays)
            ).toUTCString();
        }

        document.cookie = `${name}=${value};expires=${cookieExpiry};path=${path}${
            secure ? ';secure' : ''
        }${domain ? `;domain=${domain}` : ''};samesite=strict`;
    };

    deleteCookie = (cookie, isOld) => {
        const { name, path, secure, domain } = this.getCookieParams(
            cookie,
            isOld
        );
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=${path}${
            secure ? ';secure' : ''
        }${domain ? `;domain=${domain}` : ''}`;
    };

    getCookiePrefix = () => {
        const appOptions =
            appOptionInstance.getPropertyDataFromSession('appOptions') ||
            applozic._globals;
        let cookiePrefix = KommunicateUtils.getSubDomain();
        if (appOptions && appOptions.domainKey) {
            cookiePrefix = appOptions.domainKey;
        }
        return cookiePrefix + '_';
    };

    isHttpsEnabledConnection = () => {
        return parent.window.location.protocol == 'https:';
    };

    deleteUserCookiesOnLogout = () =>
        Object.values(KommunicateConstants.COOKIES).forEach((cookie) => {
            this.deleteCookie({ name: cookie, domain: MCK_COOKIE_DOMAIN });
        });

    getCookieParams = (cookie, isDelete = false) => {
        let cookiePrefix = this.getCookiePrefix();
        let name =
            cookie && cookie.skipPrefix
                ? cookie.name
                : cookiePrefix + cookie.name;

        if (!isDelete) {
            name += '-' + this.appId;
        }

        const path = cookie.path || '/';
        const secure =
            typeof cookie.secure === 'undefined'
                ? this.isHttpsEnabledConnection()
                : cookie.secure;
        const domain = cookie.domain;

        return { name, path, secure, domain };
    };
}

const kmCookieStorage = new KmCookieStorage();
