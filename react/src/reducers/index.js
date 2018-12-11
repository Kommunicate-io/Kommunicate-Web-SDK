import { combineReducers } from 'redux'
import loginReducer from './loginReducer'
import applicationReducer from './applicationReducer'
import signUpReducer from './signUpReducer'

export default combineReducers({
    login:loginReducer,
    application:applicationReducer,
    signUp:signUpReducer
})