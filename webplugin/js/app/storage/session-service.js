class KmSessionStorage extends KmStorage {
    constructor(sessionKey) {
        super(sessionKey);
        return this.addProxy.call(this);
    }

    getSessionData = () => {
        switch (this.storageKey) {
            case `${KommunicateConstants.SESSION_KEYS.CHAT_HEADERS}-${this.appId}`:
                const data = this.getStorageData(sessionStorage, true);

                return JSON.stringify(data) !== '{}'
                    ? JSON.parse(
                          mckUtils.checkIfB64Encoded(data)
                              ? mckUtils.b64DecodeUnicode(data)
                              : data
                      )
                    : {};
            case `${KommunicateConstants.SESSION_KEYS.LATEST_MESSAGE}-${this.appId}`:
                const sessionData = this.getStorageData(sessionStorage);
                console.log('get the latest message', sessionData);
                return JSON.stringify(sessionData) !== '{}'
                    ? sessionData
                    : null;

            default:
                return this.getStorageData(sessionStorage);
        }
    };

    // Retrieve a specific property from session data
    getPropertyDataFromSession = (key) => {
        const session = this.getStorageData(sessionStorage);
        return session[key] || '';
    };

    setSessionData = (data) => {
        switch (this.storageKey) {
            case `${KommunicateConstants.SESSION_KEYS.CHAT_HEADERS}-${this.appId}`:
                const encryptData = mckUtils.b64EncodeUnicode(
                    JSON.stringify(data)
                );

                sessionStorage.setItem(this.storageKey, encryptData);
                return;

            case `${KommunicateConstants.SESSION_KEYS.LATEST_MESSAGE}-${this.appId}`:
                let mckLocalMessageArray = this.getSessionData();
                console.log('adding the latest message', mckLocalMessageArray);

                if (mckLocalMessageArray !== null) {
                    mckLocalMessageArray = mckLocalMessageArray.concat(data);
                } else {
                    mckLocalMessageArray = data;
                }

                sessionStorage.setItem(
                    this.storageKey,
                    JSON.stringify(mckLocalMessageArray)
                );
                return;

            default:
                sessionStorage.setItem(this.storageKey, JSON.stringify(data));
        }
    };

    setPropertyDataIntoSession = (key, data) => {
        const session = this.getStorageData(sessionStorage);
        session[key] = data;

        sessionStorage.setItem(this.storageKey, JSON.stringify(session));
    };

    // delete the data from session value(Object)
    deletePropertyDataFromSession = (key) => {
        const session = this.getStorageData(sessionStorage);
        delete session[key];

        typeof sessionStorage !== 'undefined' &&
            sessionStorage.setItem(this.storageKey, JSON.stringify(session));
    };

    // delete the session key from session storage
    deleteSessionData = (key) => {
        console.log('deleteSessionData', this.storageKey);
        sessionStorage.removeItem(key || this.storageKey);
    };
}

const appOptionInstance = new KmSessionStorage();
const chatHeaderInstance = new KmSessionStorage(
    KommunicateConstants.SESSION_KEYS.CHAT_HEADERS
);
const latestMessageInstance = new KmSessionStorage(
    KommunicateConstants.SESSION_KEYS.LATEST_MESSAGE
);
