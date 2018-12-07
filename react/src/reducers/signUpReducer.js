const initialState = {
  kmOnBoarding: false
};
const signUpReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_KM_ON_BOARDING_STATUS':
      return {
        ...state,
        kmOnBoarding: action.payload
      }
    default:
      return state
  }
}

export default signUpReducer
