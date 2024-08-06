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

    deletePropertyDataFromSession  = (key) => {
        const session = this.getStorageData(sessionStorage);
        delete session[key];

        sessionStorage.setItem(this.userSessionKey, JSON.stringify(session));
    };
}

const appOptionSession = new KmSessionStorage();
