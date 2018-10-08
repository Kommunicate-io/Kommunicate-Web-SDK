const initialState = {
    userInfo: {test:"Redux"} 
  };
  const loginReducer = (state = initialState, action) => { //function it will accepts state and action
    switch (action.type) { //action.type what task to be done action have type and payload
      case 'SAVE_USER_INFO':
        // return {
        //   ...state,
        //   userInfo: Object.assign({}, action.payload) 
        // }  
        return Object.assign({}, state, {userInfo: action.payload })  
      default:
        return state
    }
  }
  
  export default loginReducer
  