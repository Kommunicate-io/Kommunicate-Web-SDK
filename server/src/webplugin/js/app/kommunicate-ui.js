/**
 * Add all Kommunicate UI Manipulation in this file.
 * 
 */
KommunicateUI={
    CONSTS:{

    },
    populateAwayMessage:function(err,message){
        var isCnversationWindowNotActive = $applozic("#mck-tab-individual").hasClass('n-vis');
        if(!err && message.code =="SUCCESS" &&message.data.length>0 &&!isCnversationWindowNotActive){
            // supporting only one away message for now. 
            awayMessage =message.data[0].message;
            $applozic("#mck-away-msg").html(awayMessage);
            $applozic("#mck-away-msg-box").removeClass("n-vis").addClass("vis");
        }else{
            $applozic("#mck-away-msg-box").removeClass("vis").addClass("n-vis");
        }
    },
    hideAwayMessage:function(){
        $applozic("#mck-away-msg").html("");
        $applozic("#mck-away-msg-box").removeClass("vis").addClass("n-vis");
    }  
}