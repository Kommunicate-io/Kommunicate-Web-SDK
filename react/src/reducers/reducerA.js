const initialState = {
  isHidden: false,
  applicationInfo: null,
  // userInfo:null 
};
const reducerA = (state = initialState, action) => { //function it will accepts state and action
  switch (action.type) { //action.type what task to be done action have type and payload
    case 'HIDE_BANNER':
      return {
        ...state,
        isHidden: true
      }
    case 'APPLICATION_INFO':
      return {
        ...state,
        applicationInfo: action.payload
      }
    // case 'USER_INFO':
    //   return {
    //     ...state,
    //     userInfo: action.payload
    //   }      
    
    default:
      return state
  }
}

export default reducerA
