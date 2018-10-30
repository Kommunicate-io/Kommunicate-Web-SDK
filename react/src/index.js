import ReactDOM from 'react-dom'
import { render } from 'react-dom'
import React from 'react'
import App from './components/App'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './reducers'
import logger from 'redux-logger'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './store/store';
// const store = createStore(rootReducer, applyMiddleware(logger))
ReactDOM.render(
  <Provider store={store}> 
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);