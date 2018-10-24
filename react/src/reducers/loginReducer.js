const initialState = {
  userInfo: null
};
const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SAVE_USER_INFO':
      return {
        ...state,
        userInfo: Object.assign({}, action.payload)
      }
    default:
      return state
  }
}

export default loginReducer
