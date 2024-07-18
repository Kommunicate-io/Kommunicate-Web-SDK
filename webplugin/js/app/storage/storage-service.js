class KmStorage {
    constructor(key) {
        this.appId = applozic._globals.appId;
        this.storageKey = `${
            key || KommunicateConstants.KOMMUNICATE_SESSION_KEY
        }-${this.appId}`;
    }

    isSessionStorageAvailable = function () {
        try {
            return typeof w.sessionStorage !== 'undefined';
        } catch (e) {
            return false;
        }
    };

    getStorageData = (storage, notParse) => {
        // this.migrateKmSession();

        const session = storage.getItem(this.storageKey);
        if (notParse) return session || {};

        return session ? JSON.parse(session) : {};
    };

    migrateKmSession = () => {
        // a session with old key exists then migrate to new format
        const oldData = sessionStorage.getItem(
            KommunicateConstants.KOMMUNICATE_SESSION_KEY
        );

        if (oldData) {
            sessionStorage.setItem(this.storageKey, oldData);
            sessionStorage.removeItem(
                KommunicateConstants.KOMMUNICATE_SESSION_KEY
            );
        }
    };

    addProxy() {
        return new Proxy(this, {
            get: (target, prop) => {
                if (
                    typeof target[prop] === 'function' &&
                    prop !== 'isSessionStorageAvailable'
                ) {
                    return function () {
                        if (target.isSessionStorageAvailable()) {
                            return target[prop].apply(target, arguments);
                        }
                    };
                }
                return target[prop];
            },
        });
    }
}

const kmStorage = new KmStorage();
