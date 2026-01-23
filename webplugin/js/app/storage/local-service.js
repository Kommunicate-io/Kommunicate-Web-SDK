class KmLocalStorage extends KmStorage {
    constructor() {
        super();
        return this.addProxy.call(this);
    }

    safeGetItem = (key) => {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            return null;
        }
    };

    safeSetItem = (key, value) => {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            // Ignore storage write failures to avoid breaking flows.
        }
    };

    safeRemoveItem = (key) => {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            // Ignore storage removal failures to avoid breaking flows.
        }
    };

    getItemFromLocalStorage = (key) => {
        const session = this.getStorageData(localStorage);
        return session[key] || '';
    };

    removeItemFromLocalStorage = (key) => {
        const session = this.getStorageData(localStorage);

        delete session[key];
        this.safeSetItem(this.userSessionKey, JSON.stringify(session));
    };

    setItemToLocalStorage = (key, data) => {
        const session = this.getStorageData(localStorage);
        session[key] = data;
        this.safeSetItem(this.userSessionKey, JSON.stringify(session));
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
        this.safeSetItem(item.name, JSON.stringify(payload));
    };

    getLocalStorage = (key) => {
        const stored = this.safeGetItem(key);
        if (!stored) {
            return '';
        }
        try {
            const payload = JSON.parse(stored);
            if (payload && typeof payload === 'object' && 'expiresAt' in payload) {
                if (payload.expiresAt && Date.now() > payload.expiresAt) {
                    this.safeRemoveItem(key);
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
        this.safeRemoveItem(key);
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
