const CommonUtils = {
    setUserSession: function(userSession) {
        userSession.isAdmin = userSession.isAdmin | false;
        localStorage.setItem('KM_USER_SESSION', JSON.stringify(userSession));
    },
    getUserSession: function() {
        return JSON.parse(localStorage.getItem('KM_USER_SESSION'));
    },
    updateAvailabilityStatus: function(available) {
        let userSession = CommonUtils.getUserSession();
        userSession.availability_status = available;
        CommonUtils.setUserSession(userSession);
    },
    getUrlParameter: function(search, name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
      }
}

export default CommonUtils;
