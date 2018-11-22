import axios from 'axios';
import {getConfig} from '../config/config';
import CommonUtils from '../utils/CommonUtils';

const ApplozicClient ={

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
        console.log("Applozic server returned : ",response.status);
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

updateUserDetail:function(params){
  let userSession = CommonUtils.getUserSession();
  let headers = {
    'Content-Type': 'application/json',
      'Apz-AppId': userSession.applicationId,
      'Apz-Token': 'Basic ' + new Buffer(userSession.userName + ':' + userSession.accessToken).toString('base64'),
      'Of-User-Id':params.ofUserId
    }
    var url = getConfig().applozicPlugin.updateApplozicUser+'?allowNull=true';
   
  return Promise.resolve(axios({
    method: 'post',
    url: url,
    data: params.userDetails,
    headers: headers
  })).then(response => {
    if(params.userDetails.callback){
      params.userDetails.callback(params.userDetails);
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
    let userSession = CommonUtils.getUserSession();
    var API_HEADERS = {
      'Content-Type': 'application/json',
      'Apz-AppId': userSession.application.applicationId,
      'Apz-Token': 'Basic ' + new Buffer(userSession.userName + ':' + userSession.accessToken).toString('base64'),
      'Apz-Product-App': 'true',
    }
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
    let userSession = CommonUtils.getUserSession();
    var API_HEADERS = {
      'Content-Type': 'application/json',
      'Apz-AppId': userSession.application.applicationId,
      'Apz-Token': 'Basic ' + new Buffer(userSession.userName + ':' + userSession.accessToken).toString('base64'),
      'Apz-Product-App': 'true',
    }
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
    let userSession = CommonUtils.getUserSession();
    var API_HEADERS = {
      'Content-Type': 'application/json',
      'Apz-AppId': userSession.application.applicationId,
      'Apz-Token': 'Basic ' + new Buffer(userSession.userName + ':' + userSession.accessToken).toString('base64'),
      'Apz-Product-App': 'true',
    }
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
    let userSession = CommonUtils.getUserSession();
    var API_HEADERS = {
      'Apz-AppId': userSession.application.applicationId,
      'Apz-Token': 'Basic ' + new Buffer(userSession.userName + ':' + userSession.accessToken).toString('base64'),
      'Apz-Product-App': 'true',
      'Content-Type': 'application/json;charset=UTF-8'
    }
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

  getApplication: function (criteria, isAdminUser) {
    let url = getConfig().applozicPlugin.applozicHosturl + '/rest/ws/application/get'
    let headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
        'Apz-AppId': criteria.applicationId,
        'Apz-Token': 'Basic ' + new Buffer(criteria.userName + ':' + criteria.accessToken).toString('base64'),
        'Apz-Product-App': !isAdminUser,
      }
    return Promise.resolve(axios.get(url, { "headers": headers, "params": { 'applicationId': criteria.applicationId } }))
      .then(response => {
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
  }
}

export default ApplozicClient;
