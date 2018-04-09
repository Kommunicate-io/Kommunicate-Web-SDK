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
	getToken(authCode).then(response => {
		logger.info(response.data);
		const email = response.data.emails[0].value;

		Promise.all([registrationService.getCustomerByUserName(email),userService.getUserByName(email)]).then(([customer,user])=>{
			if (customer || user) {
				// After successful OAuth, if user exists in the kommunicate db log in.
				Promise.resolve(getUserInfoByEmail({email: email, applicationId: customer.applicationId})).then( data => {
					logger.info(data);
					res.redirect(KOMMUNICATE_LOGIN_URL + "?googleLogin=true&email=" + email)
				}).catch(err => {
					logger.info("Failed!!!");
				})
			} else {
				// After successful OAuth, if user doesn't exist in kommunicate db allow sign up.
				res.redirect(REDIRECT_URL + '?googleSignUp=true&email=' + email + '&name=' + response.data.displayName )
			}
		}).catch(err => {
			logger.info("registrationService.getCustomerByUserName OR userService.getUserByName FAILED!!!")
      	})
	})
}
