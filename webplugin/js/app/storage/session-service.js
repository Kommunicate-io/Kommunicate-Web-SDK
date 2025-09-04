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

    setAppInstanceCount = () => {
        sessionStorage.setItem(
            'kmAppInstanceCount',
            (parseInt(sessionStorage.getItem('kmAppInstanceCount') || '0') + 1).toString()
        );
    };

    getAppInstanceCount = () => {
        return parseInt(sessionStorage.getItem('kmAppInstanceCount') || 0);
    };

    removeAppInstanceCount = (clear) => {
        const count = parseInt(sessionStorage.getItem('kmAppInstanceCount') || '0');
        if (count > 1 && !clear) {
            sessionStorage.setItem('kmAppInstanceCount', (count - 1).toString());
        } else {
            sessionStorage.removeItem('kmAppInstanceCount');
        }
    };
}

const appOptionSession = new KmSessionStorage();
