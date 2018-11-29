import { combineReducers } from 'redux'
import loginReducer from './loginReducer'
import applicationReducer from './applicationReducer'

export default combineReducers({
    loginReducer,
    applicationReducer
})