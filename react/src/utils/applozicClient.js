import axios from 'axios';
import {getConfig} from '../config/config';
import CommonUtils from '../utils/CommonUtils';
import config from "../config/index";
import url from '../config/url';

const ApplozicClient ={

  commonHeaders: () => {
    let userSession = CommonUtils.getUserSession();
    return {
      'Content-Type': 'application/json',
      'Apz-AppId': userSession.application.applicationId,
      'Apz-Token': 'Basic ' + new Buffer(userSession.userName + ':' + userSession.accessToken).toString('base64'),
      'Apz-Product-App': true
    };
  },

    getUserInfoByEmail: (options)=>{
        let url = getConfig().applozicPlugin.applozicHosturl+"/rest/ws/user/data?email="+encodeURIComponent(options.email)+"&applicationId="+options.applicationId;
        return Promise.resolve(axios.get(url))
        .then(response=>{
            let status = response.data&&response.data.status;
            if(status=="success"){
             return response.data;
            }else if(status=="error" && response.data.errorResponse[0].errorCode=="AL-U-01"){
                return null;
            }else{
                console.log("error",response);
                throw new Error("error while fetching user detail by email");
            }
        })

    },
   createKommunicateSupportUser:function(user){
    return Promise.resolve(axios.post(getConfig().applozicPlugin.applozicHosturl+"/rest/ws/register/client",user )).then(response=>{
        let err = {};
        // console.log("Applozic server returned : ",response.status);
        if (response.status == 200) {
          if (response.data.message == "INVALID_PARAMETER") {
            console.log("INVALID_PARAMETER received from applozic Server");
            err.code = "INVALID_PARAMETER";
            throw err;
          } else if (response.data.message == "REGISTERED.WITHOUTREGISTRATIONID") {
            console.log("received status 200, user created successfully ");
            return response.data;
          } else if (response.data.message == "INVALID_APPLICATIONID") {
            console.log("invalid application Id");
            err.code = "NVALID_APPLICATIONID";
            throw err;
          } else if(response.data.message == "UPDATED"){
            console.log("user already exists in db userName : ", user.userName, "applicationId : ", user.applicationId);
            err.code = "USER_ALREADY_EXISTS";
            err.data = response.data;
            throw err;
          }else if(response.data.message == "PASSWORD_INVALID"){
            console.log("user already exists in db userName : ", user.userName, "applicationId : ", user.applicationId);
            err.code = "USER_ALREADY_EXISTS_PWD_INVALID";
            err.data = response.data;
            throw err;
          }
        } else {
          console.log("received error code  : ", response.status, "from applozic serevr");
          err.code = "APPLOZIC_ERROR";
          throw err;
        }
      }).catch(err=>{
        console.log(err);
        throw err;
      });
   },

updateUserDetail:function(data){
    var headers = ApplozicClient.commonHeaders();
    headers['Of-User-Id'] = data.ofUserId;
    var url = getConfig().applozicPlugin.updateApplozicUser;
  return Promise.resolve(axios({
    method: 'post',
    url: url,
    params: data.params,
    data: data.userDetails,
    headers: headers
  })).then(response => {
    if(data.userDetails.callback){
      data.userDetails.callback(data.userDetails);
    }else {
      return response;
    }
  }).catch(e => {
    console.log("error", e);
  });
},


   getUserListByCriteria:function(criteria,callback){
   let headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
      'Apz-AppId': criteria.applicationId,
      'Apz-Token': 'Basic ' + new Buffer(criteria.userName + ':' + criteria.accessToken).toString('base64'),
      'Apz-Product-App': !criteria.isAdmin,
    }
    var url = getConfig().applozicPlugin.fetchContactsUrl;
  
    return Promise.resolve(axios.get(url,{"headers":headers,"params": criteria.params||{}}))
      .then(response => {
        return typeof callback=="function"? callback(null, response.data):  response.data 
      }).catch(e=>{
        console.log("error",e);
       if( typeof callback=="function"){
         callback(e, null)
        }else{
          throw e;
        } 

      });
  },

  searchContact : (data) => {
    var API_HEADERS = ApplozicClient.commonHeaders();
    var url = getConfig().applozicPlugin.searchContact;
  
    return Promise.resolve(axios({
      method: 'GET',
      url: url,
      headers: API_HEADERS,
      params: data
    }))
      .then(response => {
        return response.data;
      })
  },

  fetchContactsFromApplozic : (data) => {
    var API_HEADERS = ApplozicClient.commonHeaders();
    var url = getConfig().applozicPlugin.fetchContactsUrl;
  
    return Promise.resolve(axios({
      method: 'get',
      url: url,
      headers: API_HEADERS,
      params: data
    }))
      .then(response => {
        // console.log("in response")
        // console.log(response)
        return response.data;
      })
  }, 
  
  getGroupFeed : (data) => {
    var API_HEADERS = ApplozicClient.commonHeaders();
    var url = getConfig().applozicPlugin.groupFeedUrl;
  
    return Promise.resolve(axios({
      method: 'get',
      url: url,
      headers: API_HEADERS,
      params: data
    }))
      .then(response => {
        return response.data;
      })
  }, 
  
  multipleGroupInfo : (data) => {
    var API_HEADERS = ApplozicClient.commonHeaders();
    var multipleGroup = {
      "groupIds": data 
    };
    var url = getConfig().applozicPlugin.multipleGroupInfo;
    
    return Promise.resolve(axios({
      method: 'post',
      url: url,
      headers: API_HEADERS,
      data: multipleGroup
    }))
      .then(response => {
        return response.data;
      })
    },

  // To login and validate user in Applozic Dashboard
  validateApplozicUser: function (auth) {
    let params = {
      loginId: auth.userName,
      loginPassword: auth.password,
      utm_source: null
    }
    let url = getConfig().applozicPlugin.applozicHosturl + '/signin/validate.page'
    return Promise.resolve(axios.post(url, {}, { "params": params }))
      .then(response => {
        return response;
      }).catch(error => {
        throw error;
      });
  },

  // To login the Applozic user into a particular application 
  getApplication: function (criteria, isAdminUser) {
    let url = getConfig().applozicPlugin.applozicHosturl + '/rest/ws/application/get'
    let headers = {
      'Content-Type': 'application/json',
        'Apz-AppId': criteria.applicationId,
        'Apz-Token': 'Basic ' + new Buffer(criteria.userName + ':' + criteria.accessToken).toString('base64'),
        'Apz-Product-App': !isAdminUser,
      }
    return Promise.resolve(axios.get(url, { "headers": headers, "params": { 'applicationId': criteria.applicationId } })).then(response => {
        return response;
      }).catch(error => {
        throw error;
      });
  },

  getMessageList: function (params, headers) {
    let url = getConfig().applozicPlugin.applozicHosturl+ '/rest/ws/message/filter'
    let query = {
      'startIndex': params.startIndex || 0,
      'appKey': params.appId,
      'orderBy': params.orderBy || 1,
      'startTime': params.startTime,
      'endTime': params.endTime
    }
    return Promise.resolve(axios.get(url, { "headers": headers, "params": query }))
      .then(response => {
        return response;
      }).catch(error => {
        throw error;
      });
  },

	// To fetch all the applications of the Applozic user
	getApplicationIdList: function(email) {
		const APP_LIST_URL = getConfig().applozicPlugin.applozicHosturl + "/rest/ws/user/getlist/v2.1?emailId=" + encodeURIComponent(email);
		return axios.get(APP_LIST_URL).then(response=> {
			if (response.status = 200 && response.data !== "Invalid userId or EmailId") {
			return response.data;
			}
			return "error";
		}
		).catch(err => {
			return "error";
		});
    },
    
    register: function(userId, password, captcha) {
        Promise.resolve(axios({
            method: 'post',
            url: getConfig().applozicPlugin.applozicHosturl + "/rest/ws/register/v2/account",
            data: "userId=" + encodeURIComponent(userId) + "&userPassword=" + password + "&g-recaptcha-response=" + captcha,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded' 
            }
        })).then(function (response) {
            console.log(response);
            if (response.status === 200 && response.data !== undefined) {
                return response;
            }
    
            if (response.status === 404 && response.data !== undefined) {
                console.log(response)
                return response;
            }
        });
    },

    applozicResetPassword: function(email) {
		const url = getConfig().applozicPlugin.applozicHosturl + "/frgt/password.page";
		let data = "frgtPassId=" + encodeURIComponent(email);
		return axios.post(url, data).then( response => {
			if(response.status === 200) {
				return response;	
			}
		}).catch( err => {
			return err;
		});
    },
    changeApplozicUserPassword: function(params){
      const url = getConfig().applozicPlugin.applozicHosturl +'/rest/ws/user/update/password'
      let headers = {
        'Content-Type': 'application/json',
        'Apz-AppId': params.applicationId,
        'Apz-Token': 'Basic ' + new Buffer(params.userName + ':' + params.accessToken).toString('base64'),
      }
      let data = {
        oldPassword:params.currPassword,
        newPassword:params.newPassword
      } 
      return axios.get(url, {"headers": headers, "params": data }).then( response => {
        if(response.status === 200) {
          return response;	
        }
      }).catch( err => {
        return err;
      });
    },
    getApplicationStats: function() {
      let userSession = CommonUtils.getUserSession();
      let headers = ApplozicClient.commonHeaders();
      const url = getConfig().applozicPlugin.applozicHosturl + '/rest/ws/stats/get?appKey=' + userSession.application.key;
      return Promise.resolve(axios.get(url, {"headers": headers})).then( response => {
        return response;
      }).catch( err => {
        return err;
      })
    },
    sendInvitation:function(email){
      const url = getConfig().applozicPlugin.applozicHosturl +'/rest/ws/v2/invite/dev';
      var userSession = CommonUtils.getUserSession();
      var headers = {
      'Apz-AppId': userSession.application.applicationId,
      'Apz-Token': 'Basic ' + new Buffer(userSession.userName + ':' + userSession.accessToken).toString('base64'),
      'Content-Type': 'application/json'
    }
      let data = {
        inviteEmails:email,
        applicationId:userSession.application.applicationId,
      } 
      return axios.post(url, {}, {"headers": headers, "params": data }).then( response => {
        if(response.status === 200) {
          return response;	
        }
      }).catch( err => {
        return err;
      });
    },
  uploadCertificate: function (params) {
    var data = new FormData();
    var certificateUploadUrl = getConfig().applozicPlugin.certificateUpload
    let headers = ApplozicClient.commonHeaders();
    data.append("file", params.file);
    return axios({
      "method": 'POST',
      "url": certificateUploadUrl,
      "data": data,
      "headers": headers
    }).then(response => {
      return response;
    })
  },
  getUserDetails : function (data) {
    let url = getConfig().applozicPlugin.userDetailUrl;
    let headers = ApplozicClient.commonHeaders();
    return axios({
      method: 'post',
      url:url,
      data: data,
      headers: headers}).then( response => {
        if(response.status == 200) {
          return response
        } 
      }).catch( err => {
        console.log("error while fetching user details", err)
        throw { message: err };
      });
  },

  subscribe: function(token, pricingPackage, quantity) {
    let userSession = CommonUtils.getUserSession();
    let data = "stripeToken=" + token.id + "&email=" + encodeURIComponent(token.email) + "&appKey=" + userSession.application.applicationId + 
    "&package=" + pricingPackage + "&payload=";

    return Promise.resolve(axios({
        method: 'post',
        url: getConfig().applozicPlugin.applozicHosturl + '/ws/payment/v2/subscription',
        data: data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded' 
        }
    })).then(function (response) {
        console.log(response);
        if (response.status === 200 && response.data !== undefined) {
            return response;
        }

        if (response.status === 404 && response.data !== undefined) {
            console.log(response)
            return response;
        }
    });
  },

  subscriptionDetail: function () {
    let userSession = CommonUtils.getUserSession();
    let appId = userSession.application.applicationId;
    let apiUrl = config.baseurl.applozicAPI + url.applozic.CUSTOMER_INFO;
    let params = {
      'applicationId': appId
    };
    let API_HEADERS = ApplozicClient.commonHeaders();
    delete API_HEADERS["Apz-Product-App"];

    return Promise.resolve(axios({
      method: 'get',
      url: apiUrl,
      params: params,
      headers: API_HEADERS
    })).then(response => {
      if(response.status === 200 && response.data !== undefined) {
        return response;
      }
    }).catch(err => {
      console.log(err);
    })
  },

  changeCard: function(token) {
    Promise.resolve(axios({
        method: 'post',
        url: getConfig().applozicPlugin.applozicHosturl + '/ws/payment/card/update',
        data: "stripeToken=" + token.id + "&appKey=" + CommonUtils.getUserSession().application.applicationId + "&payload=",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })).then(function (response) {
        console.log(response);
        if (response.status === 200 && response.data !== undefined) {
            return response;
        }

        if (response.status === 404 && response.data !== undefined) {
            console.log(response)
            return response;
        }
    });

  },
  getMessageGroups : (params, headers) => {
    var url = getConfig().applozicPlugin.getMessageList;
  
    return Promise.resolve(axios({
      method: 'get',
      url: url,
      headers: headers,
      params: params
    })).then(response => {
        return response;
    }).catch( err => {
      console.log(err);
    })
  },
  getAllGroupsAndMessages : (data) => {
    var API_HEADERS = ApplozicClient.commonHeaders();
    var apiUrl = config.baseurl.applozicAPI + url.applozic.GROUP_ALL;
  
    return Promise.resolve(axios({
      method: 'get',
      url: apiUrl,
      headers: API_HEADERS,
      params: data
    })).then(response => {
        return response;
    }).catch( err => {
      console.log(err);
    })
  },
  activateDeactivateUser: (params) => {
    var API_HEADERS = ApplozicClient.commonHeaders();
    var apiUrl = config.baseurl.applozicAPI + url.applozic.ACTIVATE_DEACTIVATE_USER;

    return Promise.resolve(axios({
      method: 'post',
      url: apiUrl,
      headers: API_HEADERS,
      params: params
    })).then( response => {
      return response;
    }).catch(err => {
      console.log(err);
    });
  },
  deleteUser: (params) => {
    var API_HEADERS = ApplozicClient.commonHeaders();
    var apiUrl = config.baseurl.applozicAPI + url.applozic.DELETE_USER;

    return Promise.resolve(axios({
      method: 'post',
      url: apiUrl,
      headers: API_HEADERS,
      params: params
    })).then( response => {
      return response;
    }).catch(err => {
      console.log(err);
    });
  }
}

export default ApplozicClient;


exports.SUBSCRIPTION_PACKAGES = {'-1': "Closed", 0: "Beta", 1: "Starter", 2: "Launch", 3: "Growth", 4: "Enterprise", 5: "SANDBOX", 6: "UNSUBSCRIBED", 
    7: "DISTRIBUTION_LAUNCH", 8: "DISTRIBUTION_GROWTH", 9: "DISTRIBUTION_ENTERPRISE1", 10: "DISTRIBUTION_ENTERPRISE2", 11: "LAUNCH_REVISE", 
    12: "GROWTH_REVISE", 13: "PRO", 14: "ENTERPRISE_REVISE", 15: "FREE"};

exports.SUB_PACKAGE_ARRAY = {0: 'launch_monthly', 1: 'launch_yearly', 2: 'growth_monthly', 3: 'growth_yearly', 4: 'enterprise_monthly', 5: 'enterprise_yearly', 7: "Starter_Monthly", 8: 'Starter_Yearly', 9: 'Starter_Quarterly'};

exports.SUBSCRIPTION_PERIOD = {0: "m", 1: "hy", 2: "y", 3: "qr", 4: ""};

exports.COUPONS = {1: '88800', 3: '358800',4:"149900"};

exports.AMOUNTS = {1: '4900', 2: '9900', 3: '39900', 11: '12900', 12: '19900', 13: '39900'};

exports.SUB_PLANS = {1: 'starter_monthly', 2: 'launch_monthly', 3: 'growth_monthly', 11: 'launch_monthly_revise', 12: 'growth_monthly_revise', 13: 'enterprise_monthly_revise'};

exports.PRICING_PLANS = {
    0: {
        amount: "119200",
        description: "Launch ($1192.00/y)",
        package: "27"
    },
    1: {
        amount: "32900",
        description: "Launch ($329.00/qr)",
        package: "26"
    },
    2: {
        amount: "12900",
        description: "Launch ($129.00/m)",
        package: "10"
    },
    3: {
        amount: "166800",
        description: "Growth ($1668.00/y)",
        package: "19"
    },
    4: {
        amount: "47700",
        description: "Growth ($477.00/qr)",
        package: "18"
    },
    5: {
        amount: "19900",
        description: "Growth ($199.00/m)",
        package: "12"
    },
    6: {
        amount: "418800",
        description: "Pro ($4188.00/y)",
        package: "22"
    },
    7: {
        amount: "119700",
        description: "Pro ($1197.00/qr)",
        package: "21"
    },
    8: {
        amount: "49900",
        description: "Pro ($499.00/m)",
        package: "20"
    },
    9: {
        amount: "149900",
        description: "Enterprise ($1499.00/m)",
        package: "10"
    }
};

