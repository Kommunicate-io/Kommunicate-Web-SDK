import { createStore, applyMiddleware, compose  } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import logger from 'redux-logger'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import rootReducer from '../reducers/index'

const persistConfig = {
 key: 'root',
 storage: storage,
 stateReconciler: autoMergeLevel2 
};

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    }) : compose;

const enhancer = composeEnhancers(
  applyMiddleware(logger),
);

const pReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(pReducer, enhancer);
export const persistor = persistStore(store);