import { combineReducers } from 'redux'
import reducerA from './reducerA'
import loginReducer from './loginReducer'
export default combineReducers({
    reducerA,
    loginReducer,

})