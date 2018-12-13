/**
 * Add all Kommunicate UI Manipulation in this file.
 * 
 */
KommunicateUI={
    awayMessageInfo : {},
    awayMessageScroll : true,
    leadCollectionEnabledOnAwayMessage: false,
    welcomeMessageEnabled : false,
    leadCollectionEnabledOnWelcomeMessage:false,
    anonymousUser:false,
    CONSTS:{

    },
    updateLeadCollectionStatus:function(err,message,data){
        KommunicateUI.awayMessageInfo = {};
        if(!err && (message.code =="SUCCESS" || message.code == "AGENTS_ONLINE")){
            KommunicateUI.leadCollectionEnabledOnAwayMessage = message.data.collectEmailOnAwayMessage;
            if(message.code != "AGENTS_ONLINE" && message.data.messageList.length > 0 ) {
                KommunicateUI.awayMessageInfo["eventId"] = message.data.messageList[0].eventId;
                KommunicateUI.awayMessageInfo["isEnabled"] = true;
            }
            KommunicateUI.leadCollectionEnabledOnWelcomeMessage = message.data.collectEmailOnWelcomeMessage;
            KommunicateUI.welcomeMessageEnabled = message.data.welcomeMessageEnabled;
            KommunicateUI.anonymousUser =message.data.anonymousUser;
            KommunicateUI.displayLeadCollectionTemplate(data);
        } 
    },
    populateAwayMessage:function(err,message){
        var conversationWindowNotActive = $applozic("#mck-tab-individual").hasClass('n-vis');
        var closedConversation = $applozic("#mck-conversation-status-box").hasClass('vis');
        if(!err && message.code =="SUCCESS" &&message.data.messageList.length>0 &&!conversationWindowNotActive && !closedConversation){ 
            awayMessage =message.data.messageList[0].message;
            $applozic("#mck-away-msg").html(awayMessage);
            $applozic("#mck-away-msg-box").removeClass("n-vis").addClass("vis");     
        } else {
            $applozic("#mck-away-msg-box").removeClass("vis").addClass("n-vis");
        }
        var messageBody = document.querySelectorAll(".mck-message-inner.mck-group-inner")[0];
        if(KommunicateUI.awayMessageScroll && messageBody) {
            messageBody.scrollTop = messageBody.scrollHeight;  
            KommunicateUI.awayMessageScroll = false;
        }
    },
    showAwayMessage: function() {
        var conversationWindowNotActive = $applozic("#mck-tab-individual").hasClass('n-vis');
        if(KommunicateUI.awayMessageInfo && KommunicateUI.awayMessageInfo.isEnabled && !conversationWindowNotActive) {
            $applozic("#mck-email-collection-box").removeClass("vis").addClass("n-vis");
            $applozic("#mck-away-msg-box").removeClass("n-vis").addClass("vis");
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
                if ((KommunicateUI.leadCollectionEnabledOnAwayMessage && KommunicateUI.awayMessageInfo.isEnabled && 
                    KommunicateUI.awayMessageInfo.eventId == 1)||(KommunicateUI.welcomeMessageEnabled && KommunicateUI.leadCollectionEnabledOnWelcomeMessage && KommunicateUI.anonymousUser)) {
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
    displayProgressMeter: function(key, uploadStatus) {
        $applozic(".progress-meter-"+key).removeClass("n-vis").addClass("vis");
        $applozic(".mck-attachment-"+key).next().removeClass("n-vis").addClass("vis");
        $applozic(".mck-attachment-"+key+" .mck-image-download").addClass("n-vis");
    },
    deleteProgressMeter: function(key, uploadStatus) {
        $applozic(".progress-meter-"+key).remove();
        uploadStatus && $applozic(".mck-attachment-"+key).next().removeClass("vis").addClass("n-vis");
    },
    displayUploadIconForAttachment: function(key, uploadStatus) {
        $applozic(".progress-meter-"+key+" .km-progress-upload-icon").removeClass("n-vis").addClass("vis");
        $applozic(".progress-meter-"+key+" .km-progress-stop-upload-icon").removeClass("vis").addClass("n-vis");
        Kommunicate.attachmentEventHandler.progressMeter(100,key);
        !uploadStatus && $applozic(".mck-attachment-"+key).next().removeClass("n-vis").addClass("vis");            

    },
    updateImageAttachmentPreview: function(fileMeta, key) {
        let thumbnailUrl = $applozic(".mck-attachment-"+key)[0].dataset.thumbnailurl;
        $applozic(".mck-attachment-"+key+" .file-preview-link").attr("data-url",thumbnailUrl);
    },
    hideFileBox: function (file,$file_box, $mck_file_upload) {
        if(file.type.indexOf("image/") != -1) {
            $file_box.removeClass('vis').addClass('n-vis');
            $mck_file_upload.attr("disabled", false);
        } else {
            $file_box.removeClass('n-vis').addClass('vis');
        }
    },
    updateAttachmentTemplate: function(file_meta,key){
        let template = document.querySelector(".mck-message-inner.mck-group-inner").querySelector(".mck-attachment-"+key);
        template.setAttribute("data-filemetakey", file_meta.blobKey);
        template.setAttribute("data-filename", file_meta.name);
        template.setAttribute("data-fileurl", file_meta.thumbnailUrl || file_meta.fileMeta.thumbnailUrl);
        template.setAttribute("data-filesize", file_meta.size);
        template.setAttribute("data-filetype", file_meta.contentType ||file_meta.fileMeta.contentType);
    },
    updateAttachmentStopUploadStatus: function(key, status) {
        let template = document.querySelector(".mck-message-inner.mck-group-inner").querySelector(".mck-attachment-"+key);
        template.setAttribute("data-stopupload", status);
    },
    getAttachmentStopUploadStatus: function (key) {
        var stopUpload = $applozic('.mck-attachment-'+key).attr('data-stopupload');
        stopUpload = stopUpload == "true" ? true : false;
        return stopUpload;
    },
    populateLeadCollectionTemplate:function() {
        KommunicateUI.hideAwayMessage();
        $applozic("#mck-email-collection-box").removeClass("n-vis").addClass("vis");
        $applozic("#mck-btn-attach-box").removeClass("vis").addClass("n-vis");
        $applozic("#mck-text-box").blur();  
        $applozic('#mck-text-box').attr('data-text', "Your email ID");
    },
    hideLeadCollectionTemplate:function(){
        $applozic("#mck-email-collection-box").removeClass("vis").addClass("n-vis");
        $applozic("#mck-email-error-alert-box").removeClass("vis").addClass("n-vis");
        $applozic("#mck-btn-attach-box").removeClass("n-vis").addClass("vis");
        $applozic('#mck-text-box').attr('data-text', MCK_LABELS['input.message']);
    },
    validateEmail: function (sendMsg) {
        var mailformat = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
        if (sendMsg.match(mailformat)) {
            $applozic("#mck-email-error-alert-box").removeClass("vis").addClass("n-vis");
            this.hideLeadCollectionTemplate();
            window.$applozic.fn.applozic("updateUser",{data: {'email': sendMsg}});
            // KommunicateUI.showAwayMessage();  lead collection feature improvement- [WIP]
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
                    $applozic('#km-faqanswer .km-faqanswer').linkify({
                        target: '_blank'
                    });
                }
            }
            , error: function () { }
        });
        $applozic('.km-contact-input-container').removeClass("vis").addClass("n-vis");
    });

    // On Click of FAQ button the FAQ List will open.
    $applozic(d).on("click", "#km-faq", function () {
        KommunicateUI.showHeader();
        KommunicateUI.awayMessageScroll = true;
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
        $applozic('.mck-agent-image-container').removeClass("vis").addClass("n-vis");
        $applozic('.mck-agent-status-text').removeClass("vis").addClass("n-vis");
        $applozic("#mck-tab-individual .mck-tab-link.mck-back-btn-container").removeClass("n-vis").addClass('vis-table');
        $applozic("#mck-tab-individual .mck-name-status-container.mck-box-title").removeClass("padding")
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
                        $applozic(".km-talk-to-human-div p").text(MCK_LABELS['looking.for.something.else']);
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
                        $applozic(".km-talk-to-human-div p").text(MCK_LABELS['looking.for.something.else']);
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
        KommunicateUI.awayMessageScroll = true;
        KommunicateUI.hideAwayMessage();
        KommunicateUI.hideLeadCollectionTemplate();
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
                $applozic(".km-talk-to-human-div").addClass("n-vis").removeClass("vis");
                $applozic('.mck-agent-image-container').removeClass("n-vis").addClass("vis");
                 $applozic('.mck-agent-status-text').removeClass("n-vis").addClass("vis");
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
            $applozic(".km-talk-to-human-div").addClass("n-vis").removeClass("vis");
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
hideMessagePreview: function(){
    $applozic("#mck-msg-preview-visual-indicator").removeClass('vis').addClass('n-vis');
    $applozic("#mck-msg-preview-visual-indicator .mck-msg-preview-visual-indicator-text").html('');
},

showChat :function () {

    $applozic('.faq-common').removeClass("vis").addClass("n-vis");
    $applozic('.mck-conversation').removeClass("n-vis").addClass("vis");
    $applozic('#km-faq').removeClass("n-vis").addClass("vis");
    $applozic("#mck-msg-new").attr("disabled", false);
    if ($applozic("#mck-message-cell .mck-message-inner div[name='message']").length === 0 && isFirstLaunch == true) {
        $applozic("#mck-tab-individual .mck-tab-link.mck-back-btn-container").addClass("n-vis");
        $applozic("#mck-tab-individual .mck-name-status-container.mck-box-title").addClass("padding")

        isFirstLaunch = false;
    }else{
        $applozic("#mck-tab-individual .mck-tab-link.mck-back-btn-container").removeClass("n-vis");
        $applozic("#mck-tab-individual .mck-name-status-container.mck-box-title").removeClass("padding")
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
},
showClosedConversationBanner  : function(){
var messageText = MCK_LABELS["closed.conversation.message"];
var messageFooterDiv= document.getElementById("mck-sidebox-ft");
var conversationStatusDiv = document.getElementById("mck-conversation-status-box");
conversationStatusDiv.innerHTML= messageText;
messageFooterDiv.classList.add("mck-closed-conv-banner");
conversationStatusDiv.classList.add("vis");
conversationStatusDiv.classList.remove("n-vis");

},
hideClosedConversationBanner : function(){
    var messageFooterDiv = document.getElementById("mck-sidebox-ft");
    var conversationStatusDiv = document.getElementById("mck-conversation-status-box");
    if(messageFooterDiv.classList.contains("mck-closed-conv-banner") ||conversationStatusDiv.classList.contains('vis') ){
    
    messageFooterDiv.classList.remove("mck-closed-conv-banner")
    conversationStatusDiv.classList.remove("vis");
    conversationStatusDiv.classList.add("n-vis");
    }
},
setAvailabilityStatus : function (status){
    $applozic(".mck-agent-image-container .mck-agent-status-indicator").removeClass("mck-status--online").removeClass("mck-status--offline").removeClass("mck-status--away").addClass("mck-status--" + status);
    $applozic("#mck-agent-status-text").text(MCK_LABELS[status]).addClass("vis").removeClass("n-vis");
}
  
}