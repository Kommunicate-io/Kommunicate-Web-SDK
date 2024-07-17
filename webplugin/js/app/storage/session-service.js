class KmSessionStorage extends KmStorage {
    constructor() {
        super();
        return this.addProxy.call(this);
    }

    removeKmSession = () => sessionStorage.removeItem(this.userSessionKey);

    getKmSession = () => this.getStorageData(sessionStorage);

    getDataFromKmSession = (key) => this.getStorageData(sessionStorage);

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
}

const kmSessionStorage = new KmSessionStorage();
