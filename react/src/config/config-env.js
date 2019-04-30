export default {
    "development":{
    "baseurl": {
        "applozicAPI": "https://apps-test.applozic.com",
        "kommunicateAPI": "https://api-test.kommunicate.io",
        "botPlatformAPI": "https://bots-test.applozic.com"
    },
    "kommunicateDashboardUrl": "https://dashboard-test.kommunicate.io",
    "kommunicateWebsiteUrl": "https://test.kommunicate.io",
    "applozicWebsiteUrl": "https://test.applozic.com",
    "helpcenterUrl": "https://helpcenter-test.kommunicate.io",
    "adminDetails": {
        "kommunicateParentKey": "applozic2de64d50463586b9568467a1df9d21102",
        "kommunicateParentAppName": "suraj",
        "kommunicateAdminId": "suraj@applozic.com",
        "kommunicateAdminPassword": "1234567890",
        "kommunicateAdminApzToken": "c3VyYWpAYXBwbG96aWMuY29tOjEyMzQ1Njc4OTA="
    },
    "resources": {
        "defaultImageUrl": "/img/avatars/default.png",
    },
    "services":{
        'baseurl':"https://kong-api.applozic.com"
    },
    "thirdPartyIntegration":{
        'sentry' :{
            //Sentry:error tracking platform
            'enable': false,
            'dsn': "https://2bb347bba0df43d3933fe9b80021e948@sentry.io/1324242"
        },
        'analytics' : {
            'enable': false
        },
        'integry': {
            'enabled': true
        },
        'noticeable': {
            'accessToken': "HZtim7bdyESbHo1opoc4",
            'projectId': "9e7IrkNtr4EfHhBkp6Hg"
        }
    },
    'enableDevTools':true,
    "applozic": {
        'stripe': 'pk_test_fTj5uBW3Noxymz532VJFmItj'
    },
    "loadBalancerDnsValue": "dashboard-proxy-test.kommunicate.io"
},

"test" : {

    "baseurl": {
        "applozicAPI": "https://apps-test.applozic.com",
        "kommunicateAPI": "https://api-test.kommunicate.io",
        "botPlatformAPI": "https://bots-test.applozic.com"
    },
    "kommunicateDashboardUrl": "https://dashboard-test.kommunicate.io",
    "kommunicateWebsiteUrl": "https://test.kommunicate.io",
    "applozicWebsiteUrl": "https://test.applozic.com",
    "helpcenterUrl": "https://helpcenter-test.kommunicate.io",
    "adminDetails": {
        "kommunicateParentKey": "applozic2de64d50463586b9568467a1df9d21102",
        "kommunicateParentAppName": "suraj",
        "kommunicateAdminId": "suraj@applozic.com",
        "kommunicateAdminPassword": "1234567890",
        "kommunicateAdminApzToken": "c3VyYWpAYXBwbG96aWMuY29tOjEyMzQ1Njc4OTA="
    },
    "resources": {
        "defaultImageUrl": "/img/avatars/default.png"
    },
    "services":{
        'baseurl':"https://kong-api.applozic.com"
    },
    "thirdPartyIntegration":{
        'sentry' :{
            //Sentry:error tracking platform
            'enable': true,
            'dsn': "https://2bb347bba0df43d3933fe9b80021e948@sentry.io/1324242"
        },
        'analytics' : {
            'enable': false
        },
        'integry': {
            'enabled': true
        },
        'noticeable': {
            'accessToken': "HZtim7bdyESbHo1opoc4",
            'projectId': "9e7IrkNtr4EfHhBkp6Hg"
        }
    },
    'enableDevTools':true,
    "applozic": {
        'stripe': 'pk_test_fTj5uBW3Noxymz532VJFmItj'
},
    "loadBalancerDnsValue": "dashboard-proxy-test.kommunicate.io"
},
    
"staging" : {

    "baseurl": {
        "applozicAPI": "https://apps-test.applozic.com",
        "kommunicateAPI": "https://api-staging.kommunicate.io",
        "botPlatformAPI": "https://bots-staging.applozic.com"
    },
    "kommunicateDashboardUrl": "https://dashboard-staging.kommunicate.io",
    "kommunicateWebsiteUrl": "https://test.kommunicate.io",
    "applozicWebsiteUrl": "https://test.applozic.com",
    "helpcenterUrl": "https://helpcenter-test.kommunicate.io",
    "adminDetails": {
        "kommunicateParentKey": "applozic2de64d50463586b9568467a1df9d21102",
        "kommunicateParentAppName": "suraj",
        "kommunicateAdminId": "suraj@applozic.com",
        "kommunicateAdminPassword": "1234567890",
        "kommunicateAdminApzToken": "c3VyYWpAYXBwbG96aWMuY29tOjEyMzQ1Njc4OTA="
    },
    "resources": {
        "defaultImageUrl": "/img/avatars/default.png"
    },
    "services":{
        'baseurl':"https://kong-api.applozic.com"
    },
    "thirdPartyIntegration":{
        'sentry' :{
            //Sentry:error tracking platform
            'enable': false,
            'dsn': "https://2bb347bba0df43d3933fe9b80021e948@sentry.io/1324242"
        },
        'analytics' : {
            'enable': false
        },
        'integry': {
            'enabled': true
        },
        'noticeable': {
            'accessToken': "HZtim7bdyESbHo1opoc4",
            'projectId': "9e7IrkNtr4EfHhBkp6Hg"
        }
    },
    'enableDevTools':true,
    "applozic": {
        'stripe': 'pk_test_fTj5uBW3Noxymz532VJFmItj'
    },
    "loadBalancerDnsValue": "dashboard-proxy-test.kommunicate.io"
},
    
 "prod" :{

    "baseurl": {

        "applozicAPI": "https://chat.kommunicate.io",
        "kommunicateAPI": "https://api.kommunicate.io",
        "botPlatformAPI":"https://bots.applozic.com"

    },
    "kommunicateDashboardUrl": "https://dashboard.kommunicate.io",
    "kommunicateWebsiteUrl": "https://www.kommunicate.io",
    "applozicWebsiteUrl": "https://www.applozic.com",
    "helpcenterUrl": "https://helpcenter.kommunicate.io",
    "adminDetails":{
        "kommunicateParentKey": "applozic1a93cb1a2320be20d1e15353c3524c72d",
        "kommunicateAdminId": "techdisrupt@applozic.com",
        "kommunicateAdminPassword": "techdisrupt",
        "kommunicateAdminApzToken": "dGVjaGRpc3J1cHRAYXBwbG96aWMuY29tOnRlY2hkaXNydXB0"
      },
    "resources": {
        "defaultImageUrl": "/img/avatars/default.png"
    },
    "services":{
        'baseurl':"https://services.kommunicate.io"
    },
    "thirdPartyIntegration":{
        'sentry' :{
            //Sentry:error tracking platform
            'enable': true,
            'dsn': "https://dcf240024fff420794ba240526b2c223@sentry.io/1324431"
        },
        'analytics' : {
            'enable': true
        },
        'integry': {
            'enabled': true
        },
        'noticeable': {
            'accessToken': "nSoxbruxKBWyRDraIQND",
            'projectId': "lwxQBJuL2eWfCJkZ6py0"
        }
    },
    'enableDevTools':false,
    "applozic": {
        'stripe': 'pk_live_AKXOn0EVITgKlLDM3KduJjp1'
    },
    "loadBalancerDnsValue": "dashboard-proxy.kommunicate.io"
},
    
"prod_ca" :{
   "baseurl": {
       "applozicAPI": "https://chat-ca.kommunicate.io",
       "kommunicateAPI": "https://api-ca.kommunicate.io",
       "botPlatformAPI":"https://bot-ca.kommunicate.io",
       "komunicateSupportUrl": "https://chat.kommunicate.io"
   },
   "kommunicateDashboardUrl": "https://dashboard-ca.kommunicate.io",
   "kommunicateWebsiteUrl": "https://www.kommunicate.io",
   "applozicWebsiteUrl": "https://www.applozic.com",
   "helpcenterUrl": "https://helpcenter-ca.kommunicate.io",
   "adminDetails":{
       "kommunicateParentKey": "applozic1a93cb1a2320be20d1e15353c3524c72d",
       "kommunicateAdminId": "techdisrupt@applozic.com",
       "kommunicateAdminPassword": "techdisrupt",
       "kommunicateAdminApzToken": "dGVjaGRpc3J1cHRAYXBwbG96aWMuY29tOnRlY2hkaXNydXB0"
     },
   "resources": {
       "defaultImageUrl": "/img/avatars/default.png"
   },
   "services":{
       'baseurl':"https://services.kommunicate.io"
   },
   "thirdPartyIntegration":{
    'sentry' :{
        //Sentry:error tracking platform
        'enable': true,
        'dsn': "https://dcf240024fff420794ba240526b2c223@sentry.io/1324431"
    },
    'analytics' : {
        'enable': true
    },
    'integry': {
        'enabled': true
    },
    'noticeable': {
        'accessToken': "nSoxbruxKBWyRDraIQND",
        'projectId': "lwxQBJuL2eWfCJkZ6py0"
    }
  },
    'enableDevTools': false,
    "applozic": {
        'stripe': 'pk_live_AKXOn0EVITgKlLDM3KduJjp1'
    },
    "loadBalancerDnsValue": "dashboard-proxy-ca.kommunicate.io"
},
 
"prod_mzadqatar" :{
   "baseurl": {
       "applozicAPI": "https://mzadqatar.applozic.com",
       "kommunicateAPI": "https://api-mzadqatar.applozic.com",
       "botPlatformAPI":"https://bot-mzadqatar.applozic.com",
        "komunicateSupportUrl": "https://chat.kommunicate.io"
   },
   "kommunicateDashboardUrl": "https://dashboard-mzadqatar.applozic.com",
   "kommunicateWebsiteUrl": "https://www.kommunicate.io",
   "helpcenterUrl": "https://helpcenter.kommunicate.io",
   "adminDetails":{
       "kommunicateParentKey": "applozic1a93cb1a2320be20d1e15353c3524c72d",
       "kommunicateAdminId": "techdisrupt@applozic.com",
       "kommunicateAdminPassword": "techdisrupt",
       "kommunicateAdminApzToken": "dGVjaGRpc3J1cHRAYXBwbG96aWMuY29tOnRlY2hkaXNydXB0"
     },
   "resources": {
       "defaultImageUrl": "/img/avatars/default.png"
   },
   "services":{
       'baseurl':"https://services.kommunicate.io"
   },
   "thirdPartyIntegration":{
    'sentry' :{
        //Sentry:error tracking platform
        'enable': true,
        'dsn': "https://dcf240024fff420794ba240526b2c223@sentry.io/1324431"
    },
    'analytics' : {
        'enable': true
    },
    'integry': {
        'enabled': true
    },
    'noticeable': {
        'accessToken': "nSoxbruxKBWyRDraIQND",
        'projectId': "lwxQBJuL2eWfCJkZ6py0"
    }
       
   },
   'enableDevTools':false,
   "applozic": {
        'stripe': 'pk_test_fTj5uBW3Noxymz532VJFmItj'
    },

 },
 "commonResources":{
    "docsLink" : {
        applozic:{
          web: 'https://docs.applozic.com/docs/web-javascript-overview',
          installation:'https://docs.applozic.com/docs/web-javascript-chat-plugin#section-adding-sidebox-chat-ui-plugin-to-your-website',
          android:'https://docs.applozic.com/docs/android-chat-sdk',
          ios:"https://docs.applozic.com/docs/ios-chat-sdk#section-automated-installation-using-cocoapods",
          cordova:"https://docs.applozic.com/docs/ionic-phonegap-cordova-chat-sdk",
          nativeScript:"https://docs.applozic.com/docs/nativescript-installation",
          reactNative:"https://docs.applozic.com/docs/react-native-chat-sdk",
        },
        kommunicate:{
          installation:"https://docs.kommunicate.io/docs/web-installation.html",
          android:"https://docs.kommunicate.io/docs/android-installation.html",
          ios:"https://docs.kommunicate.io/docs/ios-installation.html",
          cordova:"https://docs.kommunicate.io/docs/cordova-installation.html",
          wordpress:"http://www.kommunicate.io/blog/how-to-add-live-chat-plugin-in-wordpress-websites-b449f0f5e12f/",
          wix:"http://www.kommunicate.io/blog/how-to-integrate-live-chat-plugin-in-wix-websites-469f155ab314/",
          squareSpace:"https://www.kommunicate.io/blog/squarespace-live-chat-software-for-website/"
        }
    },
    "kommunicateCryptoKey": "&h+!~%_1`ye;N,RH5M.H}hQ~A_7u@9vMOR4>:mFA#{kx!my^VaY$[1d/kX}=z;$",

 }
    
}
