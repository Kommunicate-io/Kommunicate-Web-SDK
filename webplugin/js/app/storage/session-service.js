class KmSessionStorage extends KmStorage {
    constructor(sessionKey) {
        super(sessionKey);
        return this.addProxy.call(this);
    }

    removeKmSession = () => sessionStorage.removeItem(this.userSessionKey);

    getKmSession = () => this.getStorageData(sessionStorage);

    getDataFromKmSession = (key) => {
        const session = this.getStorageData(sessionStorage);
        return session[key] || '';
    };

    storeDataIntoKmSession = (key, data) => {
        const session = this.getStorageData(sessionStorage);
        session[key] = data;

        sessionStorage.setItem(this.userSessionKey, JSON.stringify(session));
    };

    deleteDataFromKmSession = (key) => {
        const session = this.getStorageData(sessionStorage);
        delete session[key];

        sessionStorage.setItem(this.userSessionKey, JSON.stringify(session));
    };

    getAppHeaders = () => {
        const data = this.getStorageData(sessionStorage, true);
        return data
            ? JSON.parse(
                  mckUtils.checkIfB64Encoded(data)
                      ? mckUtils.b64DecodeUnicode(data)
                      : data
              )
            : {};
    };
}

const kmSessionStorage = new KmSessionStorage();
