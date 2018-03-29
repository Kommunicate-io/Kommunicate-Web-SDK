const axios =require("axios");
var querystring = require('querystring');

const CLIENT_ID = '155543752810-134ol27bfs1k48tkhampktj80hitjh10.apps.googleusercontent.com'
const CLIENT_SECRET = '67BmE4D4qPn9PfglGn27pAmX'
const GOOGLE_REDIRECT_URL = 'http://localhost:3999/google/authCode'
const REDIRECT_URL = 'http://localhost:3000/signup'
const G_PLUS_PROFILE_URL = 'https://www.googleapis.com/plus/v1/people/me';

const getToken = (authCode) => {
	var params = {
		code: authCode,
		client_id: CLIENT_ID,
		client_secret: CLIENT_SECRET,
		redirect_uri: GOOGLE_REDIRECT_URL,
		grant_type: 'authorization_code'
	};
	return axios.post('https://www.googleapis.com/oauth2/v4/token', querystring.stringify(params)).then((response)=> {
		console.log(response.data)
  		let access_token = response.data.access_token
  		let authorization = 'Bearer ' + access_token
		const headers = {
  			Authorization : authorization
  		}  		
  		return axios.get(G_PLUS_PROFILE_URL, { headers: headers })
  	});
}

exports.authCode = (req, res) => {
	let authCode = req.query.code;
	getToken(authCode).then(response => {
		console.log(response.data)
		res.redirect(REDIRECT_URL + '?googleSignIn=true&email=' + response.data.emails[0].value + '&name=' + response.data.displayName )
	})
}