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
        localStorage.setItem(this.userSessionKey, JSON.stringify(session));
    };

    setItemToLocalStorage = (key, data) => {
        const session = this.getStorageData(localStorage);
        session[key] = data;
        localStorage.setItem(this.userSessionKey, JSON.stringify(session));
    };

    setLocalStorage = (item) => {
        if (!item || !item.name) {
            return;
        }
        const payload = {
            value: item.value,
            expiresAt: item.expiresInDays
                ? Date.now() + item.expiresInDays * 24 * 60 * 60 * 1000
                : null,
        };
        localStorage.setItem(item.name, JSON.stringify(payload));
    };

    getLocalStorage = (key) => {
        const stored = localStorage.getItem(key);
        if (!stored) {
            return '';
        }
        try {
            const payload = JSON.parse(stored);
            if (payload && typeof payload === 'object' && 'expiresAt' in payload) {
                if (payload.expiresAt && Date.now() > payload.expiresAt) {
                    localStorage.removeItem(key);
                    return '';
                }
                return payload.value || '';
            }
        } catch (e) {
            return stored;
        }
        return stored;
    };

    deleteLocalStorage = (key) => {
        localStorage.removeItem(key);
    };

    deleteUserCookiesOnLogout = () => {
        const appInstanceCount = appOptionSession.getAppInstanceCount();

        if (this.storageSuffix && appInstanceCount > 1) {
            console.debug("Not deleting cookies as it's a multi user session", appInstanceCount);
            return;
        }

        Object.values(KommunicateConstants.COOKIES).forEach((cookie) => {
            this.deleteLocalStorage(cookie);
        });
    };
}

const kmLocalStorage = new KmLocalStorage();
