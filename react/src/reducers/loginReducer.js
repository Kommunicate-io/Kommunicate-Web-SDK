const initialState = {
  userInfo: null,
  logInStatus: false
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
    default:
      return state
  }
}

export default loginReducer
