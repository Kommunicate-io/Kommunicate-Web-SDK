const initialState = {
  kmOnBoarding: false,
  closeOnBoardingModalPermanently:false
};
const signUpReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_KM_ON_BOARDING_STATUS':
      return {
        ...state,
        kmOnBoarding: action.payload
      }
    case 'UPDATE_KM_ON_BOARDING_MODAL_STATUS':
      return {
        ...state,
        closeOnBoardingModalPermanently: action.payload
      }
    default:
      return state
  }
}

export default signUpReducer
