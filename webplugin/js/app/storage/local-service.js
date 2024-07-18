class KmLocalStorage extends KmStorage {
    constructor() {
        super();
        return this.addProxy.call(this);
    }

    getItemFromLocalStorage = (key) => {
        const session = this.getStorageData(localStorage);
        return session[key] || '';
    };

    removeItemFromLocalStorage = (key) => {
        const session = this.getStorageData(localStorage);

        delete session[key];
        localStorage.setItem(this.storageKey, JSON.stringify(session));
    };

    setItemToLocalStorage = (key, data) => {
        const session = this.getStorageData(localStorage);

        session[key] = data;
        localStorage.setItem(this.storageKey, JSON.stringify(session));
    };
}

const kmLocalStorage = new KmLocalStorage();
