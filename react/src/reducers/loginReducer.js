const initialState = {
  userInfo: null,
  logInStatus: false,
  loginVia: null
};
const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SAVE_USER_INFO':
      return {
        ...state,
        userInfo: Object.assign({}, action.payload)
      }
    case 'UPDATE_LOGIN_STATUS':
      return {
        ...state,
        logInStatus: action.payload

      }
    case 'LOGIN_VIA':
      return {
        ... state,
        loginVia: action.payload
      }
    default:
      return state
  }
}

export default loginReducer
