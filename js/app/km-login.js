
function kmLogin(options) {
  //Function to initialize plugin

  $applozic.fn
    .applozic({
      baseUrl:'https://apps.applozic.com',
      userId : options.userId, //TODO: replace with actual userId
      userName : options.userName,    //TODO: replace with actual userName
      appId : options.appId,  //TODO: replace with actual appId
      // onInit : onInitialize, //callback function execute on plugin initialize
      desktopNotification : true
    });

    // var contactjson = {"contacts": [{"userId": "user1", "displayName": "Devashish", "imageLink": "https://www.applozic.com/resources/images/applozic_icon.png"}, {"userId": "user2", "displayName": "Adarsh", "imageLink": "https://www.applozic.com/resources/images/applozic_icon.png"}, {"userId": "user3", "displayName": "Shanki", "imageLink": "https://www.applozic.com/resources/images/applozic_icon.png"}]};
    // To load contact list use below function and pass contacts json in format shown above in variable 'contactjson'.
    // $applozic.fn.applozic('loadContacts', contactjson);

};
