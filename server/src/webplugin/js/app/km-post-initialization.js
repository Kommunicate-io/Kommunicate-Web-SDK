/**
 * This file responsible for the all operations being performed after chat plugin initialized.
 * eg. subscribing the events etc.
 * this file use Kommunicate Object. Put this file after kommunicate.js while combining. 
 */

Kommunicate.postPluginInitialization= function(err,data){
    // hiding away message when new message received from agents.
    $applozic.fn.applozic('subscribeToEvents', {
        onMessageReceived: function (obj) {
            //message received
            var message = obj&&obj.message;
            var isValidMetadata =message.metadata&& (message.metadata.category != 'HIDDEN' &&message.metadata.hide!="true");
            var isSentByBot = isValidMetadata&&message.metadata&&message.metadata.skipBot=="true";
        if(!message.metadata|| (isValidMetadata && !isSentByBot)){
        KommunicateUI.hideAwayMessage();
        }
  }
});
// get the third party settings 
// 1: for helpDocs
/*Kommunicate.client.getThirdPartySettings({appId:data.appId,type:1},function(err,settings){
    if(err){
        console.log("err : ", err);
        return;
    }
    console.log("data : ",settings);
    if(settings && settings.code =="SUCCESS"){
        var helpdocsKey = settings.message.find(function(item){
            return item.type==KommunicateConstants.THIRD_PARTY_APPLICATION.HELPDOCS;
        });
       // KommunicateKB.init(Kommunicate.getBaseUrl());
       // KommunicateKB.getArticles({data: {appId: settings.appId, query: 'fcm', helpdocsAccessKey: 'cgIRxXkKSsyBYPTlPg4veC5kxvuKL9cC4Ip9UEao'}, success: function(response) {console.log(response);}, error: function() {}});
       KommunicateUtils.storeDataIntoKmSession("HELPDOCS_KEY",helpdocsKey)
       console.log("helodocs key",KommunicateUtils.getDataFromKmSession('HELPDOCS_KEY'));
    }
})*/

}
