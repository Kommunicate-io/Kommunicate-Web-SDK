class KmSessionStorage extends KmStorage {
    constructor(sessionKey) {
        super(sessionKey);
        return this.addProxy.call(this);
    }

    getSessionData = () => {
        return this.getStorageData(sessionStorage);
    };

    // Retrieve a specific property from session data
    getPropertyDataFromSession = (key) => {
        const session = this.getStorageData(sessionStorage);
        return session[key] || '';
    };

    setSessionData = (key, data) => {
        const session = this.getStorageData(sessionStorage);
        session[key] = data;

        sessionStorage.setItem(this.userSessionKey, JSON.stringify(session));
    };

    deleteSessionData = () => sessionStorage.removeItem(this.userSessionKey);

    deletePropertyDataFromSession = (key) => {
        const session = this.getStorageData(sessionStorage);
        delete session[key];

        sessionStorage.setItem(this.userSessionKey, JSON.stringify(session));
    };

    getAppInstanceCountKey = () => {
        const appId = applozic._globals.appId;

        return `kmAppInstanceCount-${appId}`;
    };

    setAppInstanceCount = () => {
        const key = this.getAppInstanceCountKey();
        sessionStorage.setItem(key, (parseInt(sessionStorage.getItem(key) || '0') + 1).toString());
    };

    getAppInstanceCount = () => {
        return parseInt(sessionStorage.getItem(this.getAppInstanceCountKey()) || 0);
    };

    removeAppInstanceCount = (clear) => {
        const key = this.getAppInstanceCountKey();
        const count = parseInt(sessionStorage.getItem(key) || '0');
        if (count > 1 && !clear) {
            sessionStorage.setItem(key, (count - 1).toString());
        } else {
            sessionStorage.removeItem(key);
        }
    };
}

const appOptionSession = new KmSessionStorage();
