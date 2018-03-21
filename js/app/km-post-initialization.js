/**
 * This file responsible for the all operations being performed after chat plugin initialized.
 * eg. subscribing the events etc.
 * this file use Kommunicate Object. Put this file after kommunicate.js while combining. 
 */

Kommunicate.postPluginInitialization= function(){
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
}
