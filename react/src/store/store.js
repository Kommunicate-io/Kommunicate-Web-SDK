import { createStore, applyMiddleware  } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import logger from 'redux-logger'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import rootReducer from '../reducers/index'
import { getConfig } from '../config/config';

export let store;
export let persistor;
export let pReducer;

const enableDevTools =getConfig().enableDevTools
const persistConfig = {
    key: 'root',
    storage: storage,
    stateReconciler: autoMergeLevel2
};

const pReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(pReducer, enhancer);
export const persistor = persistStore(store);
