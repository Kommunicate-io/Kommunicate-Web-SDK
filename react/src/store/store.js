import { createStore, applyMiddleware, compose } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import logger from 'redux-logger'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import rootReducer from '../reducers/index'
import { getConfig } from '../config/config';

export let store;
export let persistor;
export let pReducer;

// const enableDevTools = false;
const enableDevTools =getConfig().enableDevTools
const persistConfig = {
    key: 'root',
    storage: storage,
    stateReconciler: autoMergeLevel2,
    whitelist: ['login']
};

// pReducer = persistReducer(persistConfig, rootReducer);
pReducer = persistReducer(persistConfig, rootReducer);
if(enableDevTools) {
    // redux dev tool extension for chrome 
    const composeEnhancers =
        typeof window === 'object' &&
            window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
            window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
            }) : compose;
    const enhancer = composeEnhancers(
        applyMiddleware(logger),
    );
    
    store = createStore(pReducer, enhancer);
    // persistor = persistStore(store);

} else {
    // pReducer = persistReducer(persistConfig, rootReducer);
    store = createStore(pReducer);
    // persistor = persistStore(store);
}
persistor = persistStore(store);
