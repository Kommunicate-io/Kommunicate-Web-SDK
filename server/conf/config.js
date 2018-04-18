
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
      mongoDbUrl:"mongodb://applozicdba:applozicdba@ec2-52-204-49-118.compute-1.amazonaws.com:27017/kommunicate?authSource=admin",
      urls: {
        baseUrl: "https://chat.kommunicate.io",
        getApplicationDetail: "https://chat.kommunicate.io/rest/ws/application/get?applicationId=:applicationId",
        createApplozicClient: "https://chat.kommunicate.io/rest/ws/register/client",
        createApplication: "https://chat.kommunicate.io/rest/ws/application/add",
        groupInfoUrl: "https://chat.kommunicate.io/rest/ws/group/v2/info?groupId=:groupId",
        addMemberIntoConversation:'https://chat.kommunicate.io/rest/ws/group/add/users?role=:role',
        createGroup:"https://chat.kommunicate.io/rest/ws/group/v2.1/create",
        createBotUrl: "https://bots.applozic.com/bot",
        sendMessageUrl: "https://chat.kommunicate.io/rest/ws/message/v2/send",
        hostUrl: "https://api.kommunicate.io",
        kmWebsiteUrl: "https://www.kommunicate.io",
        updatePasswordPage : "http://dashboard.kommunicate.io/password/update?code=:code",
        passwordResetUrl : "https://chat.kommunicate.io/rest/ws/user/update/password?oldPassword=:oldPassword&newPassword=:newPassword",
        dashboardHostUrl:"https://dashboard.kommunicate.io",
        applozicHostUrl : "https://chat.kommunicate.io",
        getUserInfo: "https://chat.kommunicate.io/rest/ws/user/v2/detail"
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
        accessKey:"AKIAIDIQARZR6CEWS57Q", 
        accessPassword:"AqnvC1bnGjsnYBh5yXLMQF90WpAmEld5yyZezI4vtQiO", 
        serviceEmail:"support@kommunicatemail.io",
        serviceProvider:"2" 
      },
      s3Access: {
        accessKeyId: 'AKIAJ7QAZU7R2GPBCXGQ',
        secretAccessKey: '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',
        region: 'ap-south-1'
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
      activeCampaignApiKey:"79c8255584cf52a2e8c91f9ef92b7afdbde9c4cd97288797e300659032e14aa3247a638e",
      activeCampaignEnabled: true,
      pipeDriveEnable:true,
      chargebeeSite: "kommunicate",
      chargebeeApiKey: "live_TY45sFsefggFLWQCxIgI5m3rzIK5yWpQ"
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
    mongoDbUrl:"mongodb://applozicdba:applozicdba@ec2-52-221-219-110.ap-southeast-1.compute.amazonaws.com:27017/kommunicate?authSource=admin",
    urls: {
      baseUrl: "https://apps-test.applozic.com",
      getApplicationDetail: "https://apps-test.applozic.com/rest/ws/application/get?applicationId=:applicationId",
      createApplozicClient: "https://apps-test.applozic.com/rest/ws/register/client",
      createApplication: "https://apps-test.applozic.com/rest/ws/application/add",
      groupInfoUrl: "https://apps-test.applozic.com/rest/ws/group/v2/info?groupId=:groupId",
      addMemberIntoConversation:'https://apps-test.applozic.com/rest/ws/group/add/users?role=:role',
      createGroup:"https://apps-test.applozic.com/rest/ws/group/v2.1/create",
      createBotUrl: "https://bots-test.applozic.com/bot",
      sendMessageUrl: "https://apps-test.applozic.com/rest/ws/message/v2/send",
      hostUrl: "https://api-test.kommunicate.io",
      kmWebsiteUrl: "https://test.kommunicate.io",
      updatePasswordPage : "https://dashboard-test.kommunicate.io/password/update?code=:code",
      passwordResetUrl : "https://apps-test.applozic.com/rest/ws/user/update/password?oldPassword=:oldPassword&newPassword=:newPassword",
      dashboardHostUrl:"https://dashboard-test.kommunicate.io",
      applozicHostUrl : "https://apps-test.applozic.com",
      getUserInfo: "https://apps-test.applozic.com/rest/ws/user/v2/detail"
      
    },cache: {
      hazelCache: {
        url: "172.31.16.80",
        port: "5701",
        user: "dev",
        password: "dev"
      }
    },
    mailProvider:{
      accessKey:"AKIAIDIQARZR6CEWS57Q", 
      accessPassword:"AqnvC1bnGjsnYBh5yXLMQF90WpAmEld5yyZezI4vtQiO", 
      serviceEmail:"support@kommunicatemail.io",
      serviceProvider:"2" 
    },
    s3Access: {
      accessKeyId: 'AKIAI67YDIHOPJVDVQHA',
      secretAccessKey: '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',
      region: 'ap-south-1'
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
    activeCampaignApiKey:"79c8255584cf52a2e8c91f9ef92b7afdbde9c4cd97288797e300659032e14aa3247a638e",
    activeCampaignEnabled: false,
    pipeDriveEnable:false,
    chargebeeSite: "kommunicate-test",
    chargebeeApiKey: "test_ukpEZOUpHPfEHVOlHMQvIQl98jRbaKFa"
  },
  default: {
    port: 3999,
    db: {
      // url: "mysql://admin:adm1n2ol6@localhost:3306/kommunicate_test",
      // url: "mysql://root:password@localhost:3306/kommunicate_test",
      url: "mysql://testdbauser:db@u$er2o16@test-db.cz881axbtufc.ap-southeast-1.rds.amazonaws.com:3306/kommunicate_test",
      options: {
        pool: {
          threadPoolMax: 5,
          threadPoolMin: 0,
          idle: 10000,
        },
      },
    },
    mongoDbUrl:"mongodb://applozicdba:applozicdba@ec2-52-221-219-110.ap-southeast-1.compute.amazonaws.com:27017/kommunicate?authSource=admin",
    urls: {
      baseUrl: "https://apps-test.applozic.com",
      getApplicationDetail: "https://apps-test.applozic.com/rest/ws/application/get?applicationId=:applicationId",
      createApplozicClient: "https://apps-test.applozic.com/rest/ws/register/client",
      createApplication: "https://apps-test.applozic.com/rest/ws/application/add",
      groupInfoUrl: "https://apps-test.applozic.com/rest/ws/group/v2/info?groupId=:groupId",
      addMemberIntoConversation:'https://apps-test.applozic.com/rest/ws/group/add/users?role=:role',
      createGroup:"https://apps-test.applozic.com/rest/ws/group/v2.1/create",
      createBotUrl: "http://dashboard-test.applozic.com:5454/bot",
      sendMessageUrl: "https://apps-test.applozic.com/rest/ws/message/v2/send",
      hostUrl: "http://localhost:3999",
      kmWebsiteUrl: "https://test.kommunicate.io",
      updatePasswordPage : "http://localhost:3000/password/update?code=:code",
      passwordResetUrl : "https://apps-test.applozic.com/rest/ws/user/update/password?oldPassword=:oldPassword&newPassword=:newPassword",
      dashboardHostUrl:"http://localhost:3000",
      applozicHostUrl : "https://apps-test.applozic.com",
      getUserInfo: "https://apps-test.applozic.com/rest/ws/user/v2/detail"
    },cache: {
      hazelCache: {
        url: "localhost",
        port: "5701",
        user: "dev",
        password: "dev"
      }
    },
    mailProvider:{
      accessKey:"AKIAIDIQARZR6CEWS57Q", 
      accessPassword:"AqnvC1bnGjsnYBh5yXLMQF90WpAmEld5yyZezI4vtQiO", 
      serviceEmail:"support@kommunicatemail.io",
      serviceProvider:"2" 
    },
    s3Access: {
      accessKeyId: 'AKIAI67YDIHOPJVDVQHA',
      secretAccessKey: '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',
      region: 'ap-south-1'
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
    activeCampaignApiKey:"79c8255584cf52a2e8c91f9ef92b7afdbde9c4cd97288797e300659032e14aa3247a638e",
    activeCampaignEnabled: false,
    pipeDriveEnable:false,
    chargebeeSite: "kommunicate-test",
    chargebeeApiKey: "test_ukpEZOUpHPfEHVOlHMQvIQl98jRbaKFa"
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
        baseUrl: "https://chat.kommunicate.io",
        getApplicationDetail: "https://dashboard.applozic.com/rest/ws/application/get?applicationId=:applicationId",
        createApplozicClient: "https://dashboard.applozic.com/rest/ws/register/client",
        createApplication: "https://dashboard.applozic.com/rest/ws/application/add",
        groupInfoUrl: "https://dashboard.applozic.com/rest/ws/group/v2/info?groupId=:groupId",
        addMemberIntoConversation:'https://dashboard.applozic.com/rest/ws/group/add/users?role=:role',
        createGroup:"https://dashboard.applozic.com/rest/ws/group/v2.1/create",
        createBotUrl: "http://topioslibraries.com/bot",
        sendMessageUrl: "https://dashboard.applozic.com/rest/ws/message/v2/send",
        hostUrl: "https://api.kommunicate.io",
        kmWebsiteUrl: "https://www.kommunicate.io",
        updatePasswordPage : "http://dashboard.kommunicate.io/password/update?code=:code",
        passwordResetUrl : "https://dashboard.applozic.com/rest/ws/user/update/password?oldPassword=:oldPassword&newPassword=:newPassword",
        dashboardHostUrl:"https://dashboard.kommunicate.io",
        applozicHostUrl : "https://dashboard.applozic.com",
        getUserInfo: "https://dashboard.applozic.com/rest/ws/user/v2/detail"

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
        accessKey:"AKIAIDIQARZR6CEWS57Q", 
        accessPassword:"AqnvC1bnGjsnYBh5yXLMQF90WpAmEld5yyZezI4vtQiO", 
        serviceEmail:"support@kommunicatemail.io",
        serviceProvider:"2" 
      },
      s3Access: {
        accessKeyId: 'AKIAJ7QAZU7R2GPBCXGQ',
        secretAccessKey: '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',
        region: 'ap-south-1'
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
      activeCampaignApiKey:"79c8255584cf52a2e8c91f9ef92b7afdbde9c4cd97288797e300659032e14aa3247a638e",
      activeCampaignEnabled: false,
      pipeDriveEnable:true,

  },
  commonProperties: {
    applicationWebhooks:[
      {type: 1, url: "", notifyVia: "0", fallbackTime: 300},/*type: 1-undelivered 2-unread*/
      {type: 2, url: "", notifyVia: "0", fallbackTime: 300}
      ],

    companyDetail:{
      companyLogo: 'https://dashboard.kommunicate.io/img/logo02.png',
      companyAddress: 'Stanford Financial Square, 2600 El Camino Real, Suite 415, Palo Alto &nbsp;&bull;&nbsp;  CA  &nbsp;&bull;&nbsp; 94306',
      websiteUrl:'https://www.kommunicate.io/'
    },
    groupMetadata:{
      ADD_MEMBER_MESSAGE:"",
      CREATE_GROUP_MESSAGE:"Conversation started",
      DELETED_GROUP_MESSAGE:"",
      GROUP_LEFT_MESSAGE:"",
      GROUP_META_DATA_UPDATED_MESSAGE:"",
      GROUP_NAME_CHANGE_MESSAGE:"",
      GROUP_USER_ROLE_UPDATED_MESSAGE:"",
      HIDE:"true",
      JOIN_MEMBER_MESSAGE:"",
      REMOVE_MEMBER_MESSAGE:""
    },
    kommunicatePricingPackage:101,
    zendesk:{
    getTicketUrl:"https://[subdomain].zendesk.com/api/v2/tickets/[id].json",
    createTicketUrl:'https://[subdomain].zendesk.com/api/v2/tickets.json',
    updateTicketUrl:"https://[subdomain].zendesk.com/api/v2/tickets/[id].json",
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