/**
 * Add all Kommunicate UI Manipulation in this file.
 * 
 */
KommunicateUI={
    awayMessageInfo : {},
    isLeadCollectionEnabled: false,
    CONSTS:{

    },
    populateAwayMessage:function(err,message){
        var isCnversationWindowNotActive = $applozic("#mck-tab-individual").hasClass('n-vis');
        if(!err && message.code =="SUCCESS" &&message.data.messageList.length>0 &&!isCnversationWindowNotActive){
            // supporting only one away message for now.
            // KommunicateUI.awayMessageStatus = true;
            // KommunicateUI.leadCollectionStatus = message.data.collectEmail;
            KommunicateUI.isLeadCollectionEnabled = message.data.collectEmail;
            KommunicateUI.awayMessageInfo["isEnabled"] = true;
            KommunicateUI.awayMessageInfo["eventId"] = message.data.messageList[0].eventId;
            awayMessage =message.data.messageList[0].message;
            $applozic("#mck-away-msg").html(awayMessage);
            $applozic("#mck-away-msg-box").removeClass("n-vis").addClass("vis");     
        }else{
            $applozic("#mck-away-msg-box").removeClass("vis").addClass("n-vis");
        }
    },
    hideAwayMessage:function(){
        // $applozic("#mck-away-msg").html("");
        $applozic("#mck-away-msg-box").removeClass("vis").addClass("n-vis");
    },

    displayLeadCollectionTemplate: function (messageList) {
        let countMsg = 0;
        if (messageList && messageList.length) {
            let countMsg = 0;
            for (var i = 0; i < messageList.length; i++) {

                if (messageList[i].type == 5) {
                    countMsg++;
                    if (countMsg == 2) { break; }
                }
            }
            if (countMsg == 1) {
                if (KommunicateUI.isLeadCollectionEnabled && KommunicateUI.awayMessageInfo.isEnabled && 
                    KommunicateUI.awayMessageInfo.eventId == 1) {
                    this.populateLeadCollectionTemplate();
                    this.hideAwayMessage();
                }
            }
            else {
               this.hideLeadCollectionTemplate();
            }

        } else if (messageList == null) {
            this.populateLeadCollectionTemplate();
            this.hideAwayMessage();
        }
    },
    populateLeadCollectionTemplate:function() {
        $applozic("#mck-email-collection-box").removeClass("n-vis").addClass("vis");
        $applozic("#mck-btn-attach-box").removeClass("vis").addClass("n-vis");
        $applozic("#mck-text-box").blur();  
        $applozic('#mck-text-box').attr('data-text', "Your email ID");
    },
    hideLeadCollectionTemplate:function(){
        $applozic("#mck-email-collection-box").removeClass("vis").addClass("n-vis");
        $applozic("#mck-email-error-alert-box").removeClass("vis").addClass("n-vis");
        $applozic("#mck-btn-attach-box").removeClass("n-vis").addClass("vis");
        $applozic('#mck-text-box').attr('data-text', "Type your message...");
    },
    validateEmail: function (sendMsg) {
        var mailformat = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;

        if (sendMsg.match(mailformat)) {
            $applozic("#mck-email-error-alert-box").removeClass("vis").addClass("n-vis");
            this.hideLeadCollectionTemplate();
            $applozic("#mck-away-msg-box").removeClass("n-vis").addClass("vis");
            window.$applozic.fn.applozic("updateUser",{data: {'email': sendMsg}});
            return true;
        } else {
            $applozic("#mck-email-error-alert-box").removeClass("n-vis").addClass("vis");
            $applozic("#mck-email-collection-box").removeClass("vis").addClass("n-vis");
            return false;
        }
    },
    
   faqEvents:function (data, helpdocsKey) {
    var mcktimer;

    $applozic(d).on("click", "#mck-msg-preview, #mck-msg-preview-visual-indicator .mck-msg-preview-visual-indicator-text", function () {
        KommunicateUI.showChat();
    });

    // On Click of Individual List Items their respective answers will show.
    $applozic(d).on("click", ".km-faq-list", function () {
        $applozic('#km-faqanswer').empty();
        MCK_EVENT_HISTORY[MCK_EVENT_HISTORY.length-1] !== "km-faq-answer-list" && MCK_EVENT_HISTORY.push("km-faq-answer-list");
        var articleId = $(this).attr('data-articleid');
        var source = $(this).attr('data-source');
        KommunicateKB.getArticle({
            data: { appId: data.appId, articleId: articleId, source: source, helpdocsAccessKey: helpdocsKey }, success: function (response) {
                if ($applozic("#km-faqanswer .km-faqanswer-list").length == 0) {
                    $applozic("#km-faqanswer").append('<div class="km-faqanswer-list km-faqanswerscroll"><div class="km-faqquestion">' + response.data.title + '</div> <div class="km-faqanchor km-faqanswer">' + response.data.body + '</div></div>');
                    $applozic('#km-contact-search-input-box').removeClass("vis").addClass("n-vis");
                    $applozic('#km-faqdiv').removeClass("vis").addClass("n-vis");
                    $applozic('#km-faqanswer').removeClass("n-vis").addClass("vis");
                    $applozic('#mck-tab-individual').removeClass("n-vis").addClass("vis");
                    $applozic('#mck-tab-conversation').removeClass("vis").addClass("n-vis");
                    $applozic('#mck-no-conversations').removeClass("vis").addClass("n-vis");

                }
            }
            , error: function () { }
        });
        $applozic('.km-contact-input-container').removeClass("vis").addClass("n-vis");
    });

    // On Click of FAQ button the FAQ List will open.
    $applozic(d).on("click", "#km-faq", function () {
        KommunicateUI.showHeader();
        MCK_EVENT_HISTORY[MCK_EVENT_HISTORY.length-1] !== "km-faq-list" && MCK_EVENT_HISTORY.push("km-faq-list");
        $applozic('#km-contact-search-input-box').removeClass("n-vis").addClass("vis");
        $applozic('#km-faq').removeClass("vis").addClass("n-vis");
        $applozic('#mck-no-conversations').removeClass("vis").addClass("n-vis");
        $applozic('.faq-common').removeClass("n-vis").addClass("vis");
        $applozic('.mck-conversation ').removeClass("vis").addClass("n-vis");
        $applozic('#km-faqdiv').removeClass("n-vis").addClass("vis");
        $applozic('.mck-conversation-back-btn').removeClass("n-vis").addClass("vis");
        $applozic("#mck-tab-title").html("FAQ").removeClass('n-vis').addClass('vis');
        $applozic("#mck-away-msg-box").addClass("n-vis").removeClass("vis");
        $applozic("#mck-sidebox-ft").addClass("n-vis").removeClass("vis");
        $applozic("#mck-contacts-content").addClass("n-vis").removeClass("vis");
        $applozic("#mck-msg-new").attr("disabled", false);
        $applozic('.km-contact-input-container').removeClass("n-vis").addClass("vis");
        $applozic("#mck-conversation-back-btn").removeClass("km-visibility-hidden").addClass('vis-table');
    });

    $applozic(d).on("click", "#km-faqanswer a", function (e) {
        e.preventDefault();
        window.open(e.target.href);
    });
    $applozic("#km-faq-search-input").keydown(function (e) {
        clearTimeout(mcktimer);
        mcktimer = setTimeout(function validate() {
            KommunicateKB.getArticles({
                data:

                    { appId: data.appId, query: document.getElementById("km-faq-search-input").value, helpdocsAccessKey: helpdocsKey }
                , success: function (response) {
                    if (response.data && response.data.length === 0 && $applozic(".km-no-results-found-container").hasClass("n-vis")) {
                        $applozic(".km-no-results-found-container").addClass("vis").removeClass("n-vis");
                        $applozic(".km-talk-to-human-div p").text("We are here to help.");
                        $applozic(".km-talk-to-human-div").addClass("vis").removeClass("n-vis");
                    } else {
                        $applozic(".km-no-results-found-container").addClass("n-vis").removeClass("vis");
                        $applozic(".km-talk-to-human-div p").text("Looking for something else? ");
                        $applozic(".km-talk-to-human-div").addClass("vis").removeClass("n-vis");
                    }
                    
                    $applozic('#km-faqdiv').empty();
                    $applozic.each(response.data, function (i, faq) {
                        $applozic("#km-faqdiv").append('<li class="km-faq-list" data-source="' + faq.source + '" data-articleId="' + faq.articleId + '"><a class="km-faqdisplay"> <div><div class="km-faqimage"></div></div> <div class="km-faqanchor">' + faq.title + '</div></a></li>');
                    });                    
                    
                }, error: function () { }
            });
        }, 2000);
        if (e.which == 32 || e.which == 13) {
            KommunicateKB.getArticles({
                data:
                    { appId: data.appId, query: document.getElementById("km-faq-search-input").value, helpdocsAccessKey: helpdocsKey }
                , success: function (response) {
                    if (response.data && response.data.length === 0 && $applozic(".km-no-results-found-container").hasClass("n-vis")) {
                        $applozic(".km-no-results-found-container").addClass("vis").removeClass("n-vis");
                        $applozic(".km-talk-to-human-div p").text("We are here to help. ");
                        $applozic(".km-talk-to-human-div").addClass("vis").removeClass("n-vis");
                    } else {
                        $applozic(".km-no-results-found-container").addClass("n-vis").removeClass("vis");
                        $applozic(".km-talk-to-human-div p").text("Looking for something else? ");
                        $applozic(".km-talk-to-human-div").addClass("vis").removeClass("n-vis");
                    }

                    $applozic('#km-faqdiv').empty();
                    $applozic.each(response.data, function (i, faq) {
                        $applozic("#km-faqdiv").append('<li class="km-faq-list" data-source="' + faq.source + '" data-articleId="' + faq.articleId + '"><a class="km-faqdisplay"> <div><span class="km-faqimage"/ ></span> <div class="km-faqanchor ">' + faq.title + '</div></a></li>');
                    });
                    
                }, error: function () { }
            });
        }
    });

   
    $applozic(d).on("click", "#mck-conversation-back-btn", function () {
        $applozic('.km-contact-input-container').removeClass("vis").addClass("n-vis");
        if (MCK_EVENT_HISTORY.length >= 2) {
            if (MCK_EVENT_HISTORY[MCK_EVENT_HISTORY.length - 2] == "km-faq-list") {
                KommunicateUI.showHeader();
                $applozic('#km-faqdiv').removeClass("n-vis").addClass("vis");
                $applozic('#km-faqanswer').removeClass("vis").addClass("n-vis");
                $applozic('#km-contact-search-input-box').removeClass("n-vis").addClass("vis");
                $applozic("#mck-msg-new").attr("disabled", false);
                $applozic('.km-contact-input-container').removeClass("n-vis").addClass("vis");
                MCK_EVENT_HISTORY.splice(MCK_EVENT_HISTORY.length - 1, 1);
                return;
            } else if (typeof (MCK_EVENT_HISTORY[MCK_EVENT_HISTORY.length - 2]) == "object") {
                $applozic('.mck-conversation ').removeClass("n-vis").addClass("vis");
                $applozic('#mck-tab-conversation').removeClass("n-vis").addClass("vis");
                $applozic('#km-faqdiv').removeClass("vis").addClass("n-vis");
                $applozic('#km-faqanswer').removeClass("vis").addClass("n-vis");
                $applozic('#km-contact-search-input-box').removeClass("vis").addClass("n-vis");
                $applozic('#km-faq').removeClass("n-vis").addClass("vis");
                let elem = MCK_EVENT_HISTORY[MCK_EVENT_HISTORY.length - 2];
                $applozic.fn.applozic("openChat", elem);
                MCK_EVENT_HISTORY.splice(MCK_EVENT_HISTORY.length - 1, 1);
                KommunicateUI.activateTypingField();
                return;
            } else {
                $applozic('#km-faq').removeClass("n-vis").addClass("vis");
                $applozic("#mck-msg-new").attr("disabled", false);
                MCK_EVENT_HISTORY.splice(MCK_EVENT_HISTORY.length - 1, 1);
                MCK_EVENT_HISTORY.length = 0 ;
                return;
            }
        } else {
            $applozic('.mck-conversation ').removeClass("n-vis").addClass("vis");
            $applozic('#km-faqdiv').removeClass("vis").addClass("n-vis");
            $applozic('#km-faqanswer').removeClass("vis").addClass("n-vis");
            $applozic('#km-contact-search-input-box').removeClass("vis").addClass("n-vis");
            $applozic('#km-faq').removeClass("n-vis").addClass("vis");
            $applozic("#mck-msg-new").attr("disabled", false);
            MCK_EVENT_HISTORY.length = 0 ;
            return;
        }
    });
},
hideFaq:function(){  
    $applozic('#km-contact-search-input-box').removeClass("vis").addClass("n-vis");
    $applozic('.km-faqdiv').removeClass("vis").addClass("n-vis");
    $applozic("#mck-msg-new").attr("disabled", false);
},

showChat :function () {

    $applozic('.faq-common').removeClass("vis").addClass("n-vis");
    $applozic('.mck-conversation').removeClass("n-vis").addClass("vis");
    $applozic('#km-faq').removeClass("n-vis").addClass("vis");
    $applozic("#mck-msg-new").attr("disabled", false);
    if ($applozic("#mck-message-cell .mck-message-inner div[name='message']").length === 0 && isFirstLaunch == true) {
        $applozic("#mck-conversation-back-btn").addClass("km-visibility-hidden");
        isFirstLaunch = false;
    }else{
        $applozic("#mck-conversation-back-btn").removeClass("km-visibility-hidden");
    }
    
    if($applozic('#mck-tab-conversation').hasClass('vis')){
    }
},
showHeader :function(){
    $applozic('#mck-tab-individual').removeClass("n-vis").addClass("vis");
    $applozic('#mck-tab-conversation').removeClass("vis").addClass("n-vis");
    $applozic("#mck-msg-new").attr("disabled", false);
},

sendFaqQueryAsMsg: function(groupId){
    var messageInput = $applozic("#km-faq-search-input").val();
    var msgTemplate = 'Hi, I have a query regarding \n' + '"' + messageInput +'"' + '\n\n Can you help me out?';
    if(messageInput !== ""){
        var messagePxy = {
            "groupId": groupId,
            "type": 5,
            "contentType": 0,
            "message": msgTemplate
        };
        // Kommunicate.sendMessage(messagePxy);
        $applozic.fn.applozic('sendGroupMessage', messagePxy); 
    } else {
        return;
    }
},
activateTypingField: function(){
        $applozic('#mck-text-box').focus();
}
  
}