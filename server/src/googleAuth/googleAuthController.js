const axios =require("axios");
const CryptoJS = require ('crypto-js');
const querystring = require('querystring');
const userService = require('../users/userService');
const logger = require('../utils/logger');
const config = require("../../conf/config");
const loginService = require("../login/loginService");
const CLIENT_ID = '660706316085-tt8berusqqdekmo22rdea2mc17bq17kp.apps.googleusercontent.com';
const CLIENT_SECRET = 'tugOu4lqIziB5tSA_i7qhYkE';

const GOOGLE_REDIRECT_URL = config.getProperties().urls.hostUrl + '/google/authCode';
let KOMMUNICATE_REDIRECT_URL, APPLOZIC_REDIRECT_URL, KOMMUNICATE_LOGIN_URL, APPLOZIC_LOGIN_URL;
const GOOGLE_PLUS_PROFILE_URL = 'https://www.googleapis.com/plus/v1/people/me';
const APP_LIST_URL = config.getProperties().urls.baseUrl + "/rest/ws/user/getlist?roleNameList=APPLICATION_WEB_ADMIN";

const getToken = (authCode) => {
	logger.info("getToken")
	var params = {
		code: authCode,
		client_id: CLIENT_ID,
		client_secret: CLIENT_SECRET,
		redirect_uri: GOOGLE_REDIRECT_URL,
		grant_type: 'authorization_code'
	};
	return axios.post('https://www.googleapis.com/oauth2/v4/token', querystring.stringify(params)).then((response)=> {
			logger.info("refresh_token");
			logger.info(response.data);
	  		let access_token = response.data.access_token
	  		let authorization = 'Bearer ' + access_token
			const headers = {
	  			Authorization : authorization
	  		}  		
	  		return axios.get(GOOGLE_PLUS_PROFILE_URL, { headers: headers })
  	});
}

exports.authCode = (req, res) => {

	let LOGIN_URL;
	let REDIRECT_URL;
	let authCode = req.query.code;
	let user = {}
	let numOfApp = 1
	let email = null
	let name = null
	let oauthState = req.query.state;
	let key = config.getProperties().kommunicateCryptoKey;
	let bytes  = CryptoJS.AES.decrypt(oauthState.toString(), key);
	let decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
	let referrer = decryptedData.referrer;
	let product = decryptedData.product;
	let process = decryptedData.process;
	let dashboardHostUrl = decryptedData.dashboardUrl;
	KOMMUNICATE_REDIRECT_URL = (dashboardHostUrl || config.getProperties().urls.dashboardHostUrl) + '/signup';
	APPLOZIC_REDIRECT_URL = (dashboardHostUrl || config.getProperties().urls.applozicDashboardHostUrl) + '/signup';
	KOMMUNICATE_LOGIN_URL = (dashboardHostUrl || config.getProperties().urls.dashboardHostUrl) + '/login';
	APPLOZIC_LOGIN_URL = (dashboardHostUrl || config.getProperties().urls.applozicDashboardHostUrl) + '/login';

	if (product === "applozic"){
		LOGIN_URL = APPLOZIC_LOGIN_URL;
		REDIRECT_URL = APPLOZIC_REDIRECT_URL;
	}
	else {
		LOGIN_URL = KOMMUNICATE_LOGIN_URL;
		REDIRECT_URL = KOMMUNICATE_REDIRECT_URL;
	}
	logger.info(process);

	getToken(authCode).then(response => {
		logger.info(response.data);
		email = response.data.emails[0].value ? response.data.emails[0].value : null;
		name = response.data.displayName ? response.data.displayName : null;

		return Promise.resolve(userService.getUserByName(email))
	}).then( (_user) => {
		logger.info(1)
		if (_user) {
			logger.info("Already exists");
			// After successful OAuth, if user exists in the kommunicate db log in.
			user = _user
			// return Promise.resolve(getUserInfoByEmail({email: email, applicationId: customer.applicationId}))
			return Promise.resolve(checkNumberOfApps(email))
		} else {
			logger.info("Doesn't exists");
			// After successful OAuth, if user doesn't exist in kommunicate db allow sign up.
			res.redirect(REDIRECT_URL + '?googleSignUp=true&email=' + email + '&name=' + name )
			throw 'Ignore this error. It is present to by pass the promise chain'
		}
	}).then( _numOfApp => {
		logger.info(2);
		logger.info(_numOfApp);
		logger.info(user.loginType);
		if(user.loginType === 'oauth'){
			logger.info("oauth oauth oauth oauth oauth oauth oauth oauth")
			res.redirect(LOGIN_URL + "?googleLogin=true&email=" + email + "&loginType=" + user.loginType + "&numOfApp=" + _numOfApp+"&referrer="+referrer)
			throw 'Ignore this error. It is present to by pass the promise chain'
		} else if(user.loginType === 'email' || user.loginType === null) {
			logger.info("email email email email email email email email")
			if(_numOfApp > 1){
				res.redirect(LOGIN_URL + "?googleLogin=true&email=" + email + "&loginType=oauth&numOfApp=" + _numOfApp+"&referrer="+referrer)
				throw 'Ignore this error. It is present to by pass the promise chain'
			} else {
				const loginDetails = {
					userName: user.userName,
					password: user.accessToken,
					applicationId: user.applicationId
				}
				return Promise.resolve(loginService.login(loginDetails))
			}
		}
	}).then( result => {
	    logger.info(result);
	    let applicationId = result.application.applicationId
	    let userData = {
			numOfApp: numOfApp,
			applicationId: applicationId,
	    }
	    res.redirect(LOGIN_URL + "?googleLogin=true&email=" + email + "&loginType=" + user.loginType +  "&" + querystring.stringify(userData))
	}).catch(err => {
		logger.info(err)
	})
}

const checkNumberOfApps = (email) => {
	logger.info(email)
	let GET_APP_LIST_URL = APP_LIST_URL + "&emailId=" + encodeURIComponent(email)
	let numOfApp = 1
	return  axios.get(GET_APP_LIST_URL)
		.then(function(response){
			logger.info("response",response);
			if (response.status=200 && response.data!=="Invalid userId or EmailId") {
				numOfApp = Object.keys(response.data).length;
				logger.info("Number of apps is " + numOfApp);
			} else {
				logger.info("Error while getting application list, status : ",response.status);
			}
			return numOfApp
	   }
	).catch(err => {
		logger.info("googleOAuthController checkNumberOfApps ")
		logger.info(err);
	})
}
