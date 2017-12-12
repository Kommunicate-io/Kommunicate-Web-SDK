
const config ={
  prod: {
      port: 3999,
      db: {
        url: "mysql://dbauser:db@pr0ddb@applozicdbserver.celtixdshllg.us-east-1.rds.amazonaws.com:3306/kommunicate",
        options: {
          pool: {
            threadPoolMax: 5,
            threadPoolMin: 0,
            idle: 10000,
          },
        },
      },
      urls: {
        getApplicationDetail: "https://chat.kommunicate.io/rest/ws/application/get?applicationId=:applicationId",
        createApplozicClient: "https://chat.kommunicate.io/rest/ws/register/client",
        createApplication: "https://chat.kommunicate.io/rest/ws/application/add",
        groupInfoUrl: "https://chat.kommunicate.io/rest/ws/group/v2/info?groupId=:groupId",
        createGroup:"https://chat.kommunicate.io/rest/ws/group/v2.1/create",
        createBotUrl: "https://bots.applozic.com/bot",
        sendMessageUrl: "https://chat.kommunicate.io/rest/ws/message/v2/send",
        hostUrl: "https://api.kommunicate.io",
        updatePasswordPage : "http://dashboard.kommunicate.io/password/update?code=:code",
        passwordResetUrl : "https://chat.kommunicate.io/rest/ws/user/update/password?oldPassword=:oldPassword&newPassword=:newPassword",
        dashboardHostUrl:"https://dashboard.kommunicate.io",
        applozicHostUrl : "https://chat.kommunicate.io"

      },
      cache: {
        hazelCache: {
          url: "172.31.19.168",
          port: "5701",
          user: "dev",
          password: "dev"
        }
      },
      mailProvider:{
        accessKey:"support@kommunicate.io", 
        accessPassword:"knowledge123", 
        serviceEmail:"noreply@kommunicate.io",
        serviceProvider:"2" 
      },
      kommunicateParentKey: "applozic1a93cb1a2320be20d1e15353c3524c72d",
      kommunicateAdminId: "techdisrupt@applozic.com",
      kommunicateAdminPassword: "techdisrupt",
      // kommunicateAdminApzToken:"ZGV2YXNoaXNoQGFwcGxvemljLmNvbTprbm93bGVkZ2UxMjM=",
      kommunicateAdminApzToken: "dGVjaGRpc3J1cHRAYXBwbG96aWMuY29tOnRlY2hkaXNydXB0",
      KommonicateGCMKey: "AAAAeoKIKqc:APA91bGSCu3nUKOV3q0xpBmDl_f5VOfGhx-HI5TpnbefA3GzigMZf8Mp0ALz_WlWL3DZMM4ZzjC6z9CG-9fPwqoovcBgzCjgjXCG1Ktjwl2Q-a4XdfOjpNOaiLftUEi_9nzrE4c8jOaB",
      defaultOffhoursMessage: "Thanks for your message. will call you back in our business hours.",
      // this property define how often Off business hours notification will be sent to user. value in minute
      offBussinessHoursMessageInterval: 5,

  },
  test: {
    port: 3999,
    db: {
      url: "mysql://testdbauser:db@u$er2o16@test-db.cz881axbtufc.ap-southeast-1.rds.amazonaws.com:3306/kommunicate_test",
      options: {
        pool: {
          threadPoolMax: 5,
          threadPoolMin: 0,
          idle: 10000,
        },
      },
    },
    urls: {
      getApplicationDetail: "https://apps-test.applozic.com/rest/ws/application/get?applicationId=:applicationId",
      createApplozicClient: "https://apps-test.applozic.com/rest/ws/register/client",
      createApplication: "https://apps-test.applozic.com/rest/ws/application/add",
      groupInfoUrl: "https://apps-test.applozic.com/rest/ws/group/v2/info?groupId=:groupId",
      createGroup:"https://apps-test.applozic.com/rest/ws/group/v2.1/create",
      createBotUrl: "https://bots-test.applozic.com/bot",
      sendMessageUrl: "https://apps-test.applozic.com/rest/ws/message/v2/send",
      hostUrl: "https://api-test.kommunicate.io",
      updatePasswordPage : "https://dashboard-test.kommunicate.io/password/update?code=:code",
      passwordResetUrl : "https://apps-test.applozic.com/rest/ws/user/update/password?oldPassword=:oldPassword&newPassword=:newPassword",
      dashboardHostUrl:"https://dashboard-test.kommunicate.io",
      applozicHostUrl : "https://apps-test.applozic.com"
      
    },cache: {
      hazelCache: {
        url: "172.31.16.80",
        port: "5701",
        user: "dev",
        password: "dev"
      }
    },
    mailProvider:{
      accessKey:"support@kommunicate.io", 
      accessPassword:"knowledge123", 
      serviceEmail:"noreply@kommunicate.io",
      serviceProvider:"2" 
    },
    kommunicateParentKey: "applozic2de64d50463586b9568467a1df9d21102",
    kommunicateAdminId: "suraj@applozic.com",
    kommunicateAdminPassword: "1234567890",
    // kommunicateAdminApzToken:"ZGV2YXNoaXNoQGFwcGxvemljLmNvbTprbm93bGVkZ2UxMjM=",
    kommunicateAdminApzToken: "c3VyYWpAYXBwbG96aWMuY29tOjEyMzQ1Njc4OTA=",
    KommonicateGCMKey: "AAAAeoKIKqc:APA91bGSCu3nUKOV3q0xpBmDl_f5VOfGhx-HI5TpnbefA3GzigMZf8Mp0ALz_WlWL3DZMM4ZzjC6z9CG-9fPwqoovcBgzCjgjXCG1Ktjwl2Q-a4XdfOjpNOaiLftUEi_9nzrE4c8jOaB",
    defaultOffhoursMessage: "Thanks for your message. will call you back in our business hours.",
    // this property define how often Off business hours notification will be sent to user. value in minute
    offBussinessHoursMessageInterval: 1,
  },
  default: {
    port: 3999,
    db: {
      //url: "mysql://root:@localhost:3306/kommunicate_test",
      url: "mysql://testdbauser:db@u$er2o16@test-db.cz881axbtufc.ap-southeast-1.rds.amazonaws.com:3306/kommunicate_test",
      options: {
        pool: {
          threadPoolMax: 5,
          threadPoolMin: 0,
          idle: 10000,
        },
      },
    },
    urls: {
      getApplicationDetail: "https://apps-test.applozic.com/rest/ws/application/get?applicationId=:applicationId",
      createApplozicClient: "https://apps-test.applozic.com/rest/ws/register/client",
      createApplication: "https://apps-test.applozic.com/rest/ws/application/add",
      groupInfoUrl: "https://apps-test.applozic.com/rest/ws/group/v2/info?groupId=:groupId",
      createGroup:"https://apps-test.applozic.com/rest/ws/group/v2.1/create",
      createBotUrl: "http://dashboard-test.applozic.com:5454/bot",
      sendMessageUrl: "https://apps-test.applozic.com/rest/ws/message/v2/send",
      hostUrl: "http://localhost:3999",
      updatePasswordPage : "http://localhost:3000/password/update?code=:code",
      passwordResetUrl : "https://apps-test.applozic.com/rest/ws/user/update/password?oldPassword=:oldPassword&newPassword=:newPassword",
      dashboardHostUrl:"http://localhost:3000",
      applozicHostUrl : "https://apps-test.applozic.com"
      
    },cache: {
      hazelCache: {
        url: "localhost",
        port: "5701",
        user: "dev",
        password: "dev"
      }
    },
    mailProvider:{
      accessKey:"support@kommunicate.io", 
      accessPassword:"knowledge123", 
      serviceEmail:"noreply@kommunicate.io",
      serviceProvider:"2" 
    },
    kommunicateParentKey: "applozic2de64d50463586b9568467a1df9d21102",
    kommunicateParentAppName: "suraj",
    kommunicateAdminId: "suraj@applozic.com",
    kommunicateAdminPassword: "1234567890",
    kommunicateAdminApzToken: "ZGV2YXNoaXNoQGFwcGxvemljLmNvbTprbm93bGVkZ2UxMjM=",
    KommonicateGCMKey: "AAAAeoKIKqc:APA91bGSCu3nUKOV3q0xpBmDl_f5VOfGhx-HI5TpnbefA3GzigMZf8Mp0ALz_WlWL3DZMM4ZzjC6z9CG-9fPwqoovcBgzCjgjXCG1Ktjwl2Q-a4XdfOjpNOaiLftUEi_9nzrE4c8jOaB",
    defaultOffhoursMessage: "Thanks for your message. will call you back in our business hours.",
    // this property define how often Off business hours notification will be sent to user. value in minute
    offBussinessHoursMessageInterval: 1,

  },
  dashboard: {
      port: 3999,
      db: {
        url: "mysql://dbauser:db@pr0ddb@applozicdbserver.celtixdshllg.us-east-1.rds.amazonaws.com:3306/kommunicate",
        options: {
          pool: {
            threadPoolMax: 5,
            threadPoolMin: 0,
            idle: 10000,
          },
        },
      },
      urls: {
        getApplicationDetail: "https://dashboard.applozic.com/rest/ws/application/get?applicationId=:applicationId",
        createApplozicClient: "https://dashboard.applozic.com/rest/ws/register/client",
        createApplication: "https://dashboard.applozic.com/rest/ws/application/add",
        groupInfoUrl: "https://dashboard.applozic.com/rest/ws/group/v2/info?groupId=:groupId",
        createBotUrl: "http://topioslibraries.com/bot",
        sendMessageUrl: "https://dashboard.applozic.com/rest/ws/message/v2/send",
        hostUrl: "https://api.kommunicate.io",
        updatePasswordPage : "http://dashboard.kommunicate.io/password/update?code=:code",
        passwordResetUrl : "https://dashboard.applozic.com/rest/ws/user/update/password?oldPassword=:oldPassword&newPassword=:newPassword",
        dashboardHostUrl:"https://dashboard.kommunicate.io",
        applozicHostUrl : "https://dashboard.applozic.com"

      },
      cache: {
        hazelCache: {
          url: "172.31.19.168",
          port: "5701",
          user: "dev",
          password: "dev"
        }
      },
      mailProvider:{
        accessKey:"support@kommunicate.io", 
        accessPassword:"knowledge123", 
        serviceEmail:"noreply@kommunicate.io",
        serviceProvider:"2" 
      },
      kommunicateParentKey: "applozic1a93cb1a2320be20d1e15353c3524c72d",
      kommunicateAdminId: "techdisrupt@applozic.com",
      kommunicateAdminPassword: "techdisrupt",
      // kommunicateAdminApzToken:"ZGV2YXNoaXNoQGFwcGxvemljLmNvbTprbm93bGVkZ2UxMjM=",
      kommunicateAdminApzToken: "dGVjaGRpc3J1cHRAYXBwbG96aWMuY29tOnRlY2hkaXNydXB0",
      KommonicateGCMKey: "AAAAeoKIKqc:APA91bGSCu3nUKOV3q0xpBmDl_f5VOfGhx-HI5TpnbefA3GzigMZf8Mp0ALz_WlWL3DZMM4ZzjC6z9CG-9fPwqoovcBgzCjgjXCG1Ktjwl2Q-a4XdfOjpNOaiLftUEi_9nzrE4c8jOaB",
      defaultOffhoursMessage: "Thanks for your message. will call you back in our business hours.",
      // this property define how often Off business hours notification will be sent to user. value in minute
      offBussinessHoursMessageInterval: 5,

  },
  commonProperties: {
    applicationWebhooks:[
      {type: 1, url: "", notifyVia: "0", fallbackTime: 300},/*type: 1-undelivered 2-unread*/
      {type: 2, url: "", notifyVia: "0", fallbackTime: 300}
      ],

    companyDetail:{
      companyLogo: 'https://kommunicate.s3.ap-south-1.amazonaws.com/profile_pic/applozic-sample-app-videocall-1.png',
      companyAddress: 'Stanford Financial Square, 2600 El Camino Real, Suite 415, Palo Alto &nbsp;&bull;&nbsp;  CA  &nbsp;&bull;&nbsp; 94306',
      websiteUrl:'https://www.kommunicate.io/'
    },
    groupMetadata:{
      ADD_MEMBER_MESSAGE:":adminName added :userName",
      CREATE_GROUP_MESSAGE:"",
      DELETED_GROUP_MESSAGE:":adminName deleted Conversation",
      GROUP_ICON_CHANGE_MESSAGE:"Conversation icon changed",
      GROUP_LEFT_MESSAGE:":userName left",
      GROUP_META_DATA_UPDATED_MESSAGE:"",
      GROUP_NAME_CHANGE_MESSAGE:"Conversation name changed to :groupName",
      GROUP_USER_ROLE_UPDATED_MESSAGE:":userName is :role now",
      HIDE:"true",
      JOIN_MEMBER_MESSAGE:":userName joined",
      REMOVE_MEMBER_MESSAGE:":adminName removed :userName"
    }
}
};
exports.getProperties = function() {
  let envId = getEnvId()?getEnvId():"default";
  return config[envId];
};
exports.getCommonProperties = function() {
  return config["commonProperties"];
};
const getEnvId= function() {
  return process.env.NODE_ENV ||"default";
};

exports.getEnvId = getEnvId;