const axios =require("axios");
const querystring = require('querystring');
const registrationService = require("../register/registrationService");
const userService = require('../users/userService');
const logger = require('../utils/logger');
const config = require("../../conf/config");
const loginService = require("../login/loginService");

const CLIENT_ID = '155543752810-134ol27bfs1k48tkhampktj80hitjh10.apps.googleusercontent.com'
const CLIENT_SECRET = '67BmE4D4qPn9PfglGn27pAmX'

const GOOGLE_REDIRECT_URL = config.getProperties().urls.hostUrl + '/google/authCode'
const REDIRECT_URL = config.getProperties().urls.dashboardHostUrl + '/signup'
const APPLOZIC_CLIENT_URL = config.getProperties().urls.applozicHostUrl+"/rest/ws/user/data?";
const KOMMUNICATE_LOGIN_URL = config.getProperties().urls.dashboardHostUrl + '/login'

const GOOGLE_PLUS_PROFILE_URL = 'https://www.googleapis.com/plus/v1/people/me';

const integrationSettingService = require('../../src/thirdPartyIntegration/integrationSettingService');
const CLEARBIT = require('../application/utils').INTEGRATION_PLATFORMS.CLEARBIT;

const APP_LIST_URL = config.getProperties().urls.baseUrl + "/rest/ws/user/getlist?roleNameList=APPLICATION_WEB_ADMIN";

const getUserInfoByEmail = (options) => {
	let APPLOZIC_CLIENT_URL_GET_USER_INFO = APPLOZIC_CLIENT_URL;
	APPLOZIC_CLIENT_URL_GET_USER_INFO += "email=" + options.email + "&applicationId=" + options.applicationId;
	logger.info(APPLOZIC_CLIENT_URL_GET_USER_INFO);
	return axios.get(APPLOZIC_CLIENT_URL_GET_USER_INFO).then( response => {
		let status = response.data&&response.data.status;
		logger.info(response.data)
		if (status=="success") {
			return response.data;
		} else if (status=="error" && response.data.errorResponse[0].errorCode=="AL-U-01") {
			return null;
		} else {
			logger.info("error",response);
			logger.info("error while fetching user deatil by email");
		}
	})
}


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

	let authCode = req.query.code;
	let user = {}
	let customer = {}
	let numOfApp = 1
	let email = null
	let name = null

	getToken(authCode).then(response => {
		logger.info(response.data);
		email = response.data.emails[0].value ? response.data.emails[0].value : null;
		name = response.data.displayName ? response.data.displayName : null;

		return Promise.all([customerService.getCustomerByUserName(email),userService.getUserByName(email)])
	}).then( ([_customer,_user] ) => {
		logger.info(1)
		if (_customer || _user) {
			logger.info("Already exists");
			// After successful OAuth, if user exists in the kommunicate db log in.
			user = _user
			customer = _customer.dataValues
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
			res.redirect(KOMMUNICATE_LOGIN_URL + "?googleLogin=true&email=" + email + "&loginType=" + user.loginType + "&numOfApp=" + _numOfApp)
			throw 'Ignore this error. It is present to by pass the promise chain'
		} else if(user.loginType === 'email' || user.loginType === null) {
			logger.info("email email email email email email email email")
			if(_numOfApp > 1){
				res.redirect(KOMMUNICATE_LOGIN_URL + "?googleLogin=true&email=" + email + "&loginType=" + user.loginType + "&numOfApp=" + _numOfApp)
				throw 'Ignore this error. It is present to by pass the promise chain'
			} else {
				const loginDetails = {
					userName: user.userName,
					password: user.accessToken,
					applicationId: customer.applicationId
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
	    res.redirect(KOMMUNICATE_LOGIN_URL + "?googleLogin=true&email=" + email + "&loginType=" + user.loginType +  "&" + querystring.stringify(userData))
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
