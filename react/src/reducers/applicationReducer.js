const initialState = {
  appSettings: null,

};
const applicationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SAVE_APP_SETTINGS':
      return {
        ...state,
        appSettings: Object.assign({}, action.payload)
      }
    default:
      return state
  }
}

export default applicationReducer
