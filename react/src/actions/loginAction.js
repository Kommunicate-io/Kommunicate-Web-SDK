const saveUserInfo = (payload) => ({
  type: 'SAVE_USER_INFO',
  payload
});
const updateLogInStatus = (payload) => ({
  type:'UPDATE_LOGIN_STATUS',
  payload
});
export {
  saveUserInfo,
  updateLogInStatus
}
