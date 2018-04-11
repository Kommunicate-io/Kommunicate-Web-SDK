/* .
 Initilize all global variables used in kommunicate 
*/

KommunicateConstants={
    EVENT_IDS:{ WELCOME_MESSAGE: "3", AWAY_MESSAGE: { KNOWN: "1", ANONYMOUS: "2" } },
    THIRD_PARTY_APPLICATION:{HELPDOCS:"1"},
    KOMMUNICATE_SESSION_KEY:"kommunicate"
}

/**
 * Kommunicate stores all Exposed functions to user.
 * 
 */
Kommunicate = {};

/**
 * stores all UI manipulation
 */
KommunicateUI = {};


/**all  utilities*/
KommunicateUtils ={

getCookie :function(cname){
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
},
/* Method to set cookies*/
setCookie: function(cname, cvalue, exdays) {
    var d = new Date();
    var cookieMaxExpirationdate= "2038-01-19 04:14:07";
    var expires = "expires="+ new Date(cookieMaxExpirationdate).toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
},
getRandomId:function() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 32; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
},
getDataFromKmSession: function(key){
    var session = sessionStorage.getItem(KommunicateConstants.KOMMUNICATE_SESSION_KEY);
   return  session?JSON.parse(session)[key]:"";
},
storeDataIntoKmSession: function(key, data){
    var session = sessionStorage.getItem(KommunicateConstants.KOMMUNICATE_SESSION_KEY);
    session=  session?JSON.parse(session):{};
    session[key] = data;
    sessionStorage.setItem(KommunicateConstants.KOMMUNICATE_SESSION_KEY, JSON.stringify(session));

}
}