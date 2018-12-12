
import { combineReducers } from 'redux'
import loginReducer from './loginReducer'
import applicationReducer from './applicationReducer'
import signUpReducer from './signUpReducer'
import storage from 'redux-persist/lib/storage'

const appReducer = combineReducers({
    login:loginReducer,
    application:applicationReducer,
    signUp:signUpReducer
})
export const rootReducer = (state, action) => {
    if (action.type === 'RESET_STORE') {
        state = undefined
    }
    return appReducer(state, action)
}
export default rootReducer;
