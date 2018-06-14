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
        $applozic("#mck-away-msg").html("");
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
                }
            }
            else {
               this.hideLeadCollectionTemplate();       
            }

        } else if (messageList == null) {
            this.populateLeadCollectionTemplate();
        }
    },
    populateLeadCollectionTemplate:function() {
        $applozic("#mck-email-collection-box").removeClass("n-vis").addClass("vis");
        $applozic("#mck-btn-attach-box").removeClass("vis").addClass("n-vis");
        $applozic("#mck-btn-smiley-box").removeClass("vis").addClass("n-vis");
        $applozic("#mck-text-box").blur();  
        $applozic('#mck-text-box').attr('data-text', "Your email ID");
    },
    hideLeadCollectionTemplate:function(){
        $applozic("#mck-email-collection-box").removeClass("vis").addClass("n-vis");
        $applozic("#mck-email-error-alert-box").removeClass("vis").addClass("n-vis");
        $applozic("#mck-btn-attach-box").removeClass("n-vis").addClass("vis");
        $applozic("#mck-btn-smiley-box").removeClass("n-vis").addClass("vis");
        $applozic('#mck-text-box').attr('data-text', "Enter your message here...");
    },
    validateEmail: function (sendMsg) {
        var mailformat = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (sendMsg.match(mailformat)) {
            $applozic("#mck-email-error-alert-box").removeClass("vis").addClass("n-vis");
            this.hideLeadCollectionTemplate();
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

    $applozic(d).on("click", "#mck-msg-preview", function () {
        KommunicateUI.showChat();
    });

    // On Click of Individual List Items their respective answers will show.
    $applozic(d).on("click", ".km-faq-list", function () {
        $applozic('#km-faqanswer').empty();
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
    });

    // On Click of FAQ button the FAQ List will open.
    $applozic(d).on("click", "#km-faq", function () {
        KommunicateUI.showHeader();
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
        if($applozic('.km-kb-container').hasClass('vis')){
            if ($applozic('#km-faqanswer').hasClass('vis')) {
                KommunicateUI.showHeader();
                $applozic('#km-faqdiv').removeClass("n-vis").addClass("vis");
                $applozic('#km-faqanswer').removeClass("vis").addClass("n-vis");
                $applozic('#km-contact-search-input-box').removeClass("n-vis").addClass("vis");
                return;
            }
            if($applozic('#km-faqdiv').hasClass('vis')){
                $applozic('#mck-tab-individual').removeClass("vis").addClass("n-vis");
                $applozic('#mck-tab-conversation').removeClass("n-vis").addClass("vis");
                $applozic('.faq-common').removeClass("vis").addClass("n-vis");
                $applozic('.mck-conversation ').removeClass("n-vis").addClass("vis");
                $applozic('#km-faq').removeClass("n-vis").addClass("vis");
                $applozic(".km-talk-to-human-div").addClass("n-vis").removeClass("vis");
                return;
            }
            if($applozic('.mck-conversation').hasClass('vis')){
                $applozic('#km-faq').removeClass("n-vis").addClass("vis");
                return;
            }
        }
    });
},

showChat :function () {
    $applozic('.faq-common').removeClass("vis").addClass("n-vis");
    $applozic('.mck-conversation ').removeClass("n-vis").addClass("vis");
    $applozic('#km-faq').removeClass("n-vis").addClass("vis");
    if($applozic('#mck-tab-conversation').hasClass('vis')){
    }
   
},
showHeader :function(){
    $applozic('#mck-tab-individual').removeClass("n-vis").addClass("vis");
    $applozic('#mck-tab-conversation').removeClass("vis").addClass("n-vis");
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
}
  
}