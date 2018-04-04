const axios =require("axios");
var querystring = require('querystring');
const registrationService = require("../register/registrationService");
const userService = require('../users/userService');
const logger = require('../utils/logger');
const config = require("../../conf/config");

const CLIENT_ID = '155543752810-134ol27bfs1k48tkhampktj80hitjh10.apps.googleusercontent.com'
const CLIENT_SECRET = '67BmE4D4qPn9PfglGn27pAmX'

const GOOGLE_REDIRECT_URL = config.getProperties().urls.hostUrl + '/google/authCode'
const REDIRECT_URL = config.getProperties().urls.dashboardHostUrl + '/signup'

const GOOGLE_PLUS_PROFILE_URL = 'https://www.googleapis.com/plus/v1/people/me';

const getToken = (authCode) => {
	logger.info(GOOGLE_REDIRECT_URL)
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
		logger.info(response.data)
		
		logger.info(REDIRECT_URL)
		
		let userName = response.data.emails[0].value;

		Promise.all([registrationService.getCustomerByUserName(userName),userService.getUserByName(userName)]).then(([customer,user])=>{
      		logger.info("got the user from db",user);
      		if(customer || user){
        		res.redirect(REDIRECT_URL + '?googleSignUp=false&message="USER_ALREADY_EXISTS"')
      		}else{
      			res.redirect(REDIRECT_URL + '?googleSignUp=true&email=' + userName + '&name=' + response.data.displayName )	
      		}
      	}).catch(err => {

      	})

	})
}
