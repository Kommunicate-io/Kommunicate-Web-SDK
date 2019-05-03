/**
 * Add all Kommunicate UI Manipulation in this file.
 * 
 */
var kommunicateCommons = new KommunicateCommons();
KommunicateUI={
    awayMessageInfo : {},
    awayMessageScroll : true,
    leadCollectionEnabledOnAwayMessage: false,
    welcomeMessageEnabled : false,
    leadCollectionEnabledOnWelcomeMessage:false,
    anonymousUser:false,
    faqSVGImage: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><circle class="km-custom-widget-fill" cx="12" cy="12" r="12" fill="#5553B7" fill-rule="nonzero" opacity=".654"/><g transform="translate(6.545 5.818)"><polygon fill="#FFF" points=".033 2.236 .033 12.057 10.732 12.057 10.732 .02 3.324 .02"/><rect class="km-custom-widget-fill" width="6.433" height="1" x="2.144" y="5.468" fill="#5553B7" fill-rule="nonzero" opacity=".65" rx=".5"/><rect class="km-custom-widget-fill" width="4.289" height="1" x="2.144" y="8.095" fill="#5553B7" fill-rule="nonzero" opacity=".65" rx=".5"/><polygon class="km-custom-widget-fill" fill="#5553B7" points="2.656 .563 3.384 2.487 1.162 3.439" opacity=".65" transform="rotate(26 2.273 2.001)"/></g></g></svg>',
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
        let template = $applozic(".mck-attachment-"+key)[0];
        let thumbnailUrl = template && template.dataset && template.dataset.thumbnailurl;
        thumbnailUrl && $applozic(".mck-attachment-"+key+" .file-preview-link").attr("data-url",thumbnailUrl);
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
        var attachment;
        var template = document.querySelector(".mck-message-inner.mck-group-inner");
        template && key && (attachment = template.querySelector(".mck-attachment-"+key));
        if (attachment) {
            attachment.setAttribute("data-filemetakey", file_meta.blobKey);
            attachment.setAttribute("data-filename", file_meta.name);
            attachment.setAttribute("data-fileurl", file_meta.thumbnailUrl || file_meta.fileMeta.thumbnailUrl);
            attachment.setAttribute("data-filesize", file_meta.size);
            attachment.setAttribute("data-filetype", file_meta.contentType ||file_meta.fileMeta.contentType);
        }
    },
    updateAttachmentStopUploadStatus: function(key, status) {
        let template = document.querySelector(".mck-message-inner.mck-group-inner");
        let attachment = template && template.querySelector(".mck-attachment-"+key);
        attachment && attachment.setAttribute("data-stopupload", status);
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
                    $applozic("#km-faqanswer").append('<div class="km-faqanswer-list km-faqanswerscroll ql-snow"><div class="km-faqquestion">' + response.data.title + '</div> <div class="km-faqanchor km-faqanswer ql-editor">' + response.data.body + '</div></div>');
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
        MCK_MAINTAIN_ACTIVE_CONVERSATION_STATE && KommunicateUtils.removeItemFromLocalStorage("mckActiveConversationInfo");
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
    $applozic("#km-faq-search-input").keyup(function (e) {
        var searchQuery = e.target.value;
        if(searchQuery.length > 0) {
            $applozic(".km-clear-faq-search-icon").addClass("vis").removeClass("n-vis");
        } else {
            $applozic(".km-clear-faq-search-icon").addClass("n-vis").removeClass("vis");
        }
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
                    
                    $applozic('#km-faq-list-container').empty();
                    $applozic.each(response.data, function (i, faq) {
                        $applozic("#km-faq-list-container").append('<li class="km-faq-list" data-source="' + faq.source + '" data-articleId="' + faq.articleId + '"><a class="km-faqdisplay"> <div class="km-faqimage">' + KommunicateUI.faqSVGImage + '</div><div class="km-faqanchor">' + faq.title + '</div></a></li>');
                    });                    
                    
                }, error: function () { }
            });
        }, 500);
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

                    $applozic('#km-faq-list-container').empty();
                    $applozic.each(response.data, function (i, faq) {
                        $applozic("#km-faq-list-container").append('<li class="km-faq-list" data-source="' + faq.source + '" data-articleId="' + faq.articleId + '"><a class="km-faqdisplay"> <div class="km-faqimage">' + KommunicateUI.faqSVGImage + '</div> <div class="km-faqanchor ">' + faq.title + '</div></a></li>');
                    });
                    
                }, error: function () { }
            });
        }
    });

    $applozic(d).on("click", ".km-clear-faq-search-icon", function() {
        $applozic("#km-faq-search-input").val("");
        $applozic(".km-clear-faq-search-icon").addClass("n-vis").removeClass("vis");
        // this is being used to simulate an Enter Key Press on the search input.
        var e = jQuery.Event("keyup");
        e.which = 13; 
        $applozic("#km-faq-search-input").trigger(e);      
    });
   
    $applozic(d).on("click", "#mck-conversation-back-btn", function () {
        $applozic('.km-contact-input-container').removeClass("vis").addClass("n-vis");
        MCK_MAINTAIN_ACTIVE_CONVERSATION_STATE && KommunicateUtils.removeItemFromLocalStorage("mckActiveConversationInfo");
        KommunicateUI.awayMessageScroll = true;
        KommunicateUI.hideAwayMessage();
        KommunicateUI.hideLeadCollectionTemplate();
        if (MCK_EVENT_HISTORY.length >= 2) {
            if (MCK_EVENT_HISTORY[MCK_EVENT_HISTORY.length - 2] == "km-faq-list") {
                KommunicateUI.showHeader();
                $applozic('#km-faqdiv').removeClass("n-vis").addClass("vis");
                $applozic('#km-faqanswer').removeClass("vis").addClass("n-vis");
                $applozic(".km-no-results-found-container").addClass("n-vis").removeClass("vis");
                $applozic('#km-contact-search-input-box').removeClass("n-vis").addClass("vis");
                $applozic("#mck-msg-new").attr("disabled", false);
                $applozic('.km-contact-input-container').removeClass("n-vis").addClass("vis");
                MCK_EVENT_HISTORY.splice(MCK_EVENT_HISTORY.length - 1, 1);
                return;
            } else if (typeof (MCK_EVENT_HISTORY[MCK_EVENT_HISTORY.length - 2]) == "object") {
                $applozic('.mck-conversation ').removeClass("n-vis").addClass("vis");
                $applozic('#mck-tab-conversation').removeClass("n-vis").addClass("vis");
                $applozic('#km-faqdiv').removeClass("vis").addClass("n-vis");
                $applozic(".km-no-results-found-container").addClass("n-vis").removeClass("vis");
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
            $applozic(".km-no-results-found-container").addClass("n-vis").removeClass("vis");
            $applozic('#km-contact-search-input-box').removeClass("vis").addClass("n-vis");
            $applozic(".km-talk-to-human-div").addClass("n-vis").removeClass("vis");
            $applozic('#km-faq').removeClass("n-vis").addClass("vis");
            $applozic("#mck-msg-new").attr("disabled", false);
            $applozic('.mck-agent-status-text').removeClass("vis").addClass("n-vis");
            $applozic('.mck-agent-image-container').removeClass("vis").addClass("n-vis");
            $applozic(".mck-agent-image-container .mck-agent-status-indicator").removeClass("vis").addClass("n-vis");
            document.getElementById("mck-tab-title").textContent = "";
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
    kommunicateCommons.setWidgetStateOpen(true);
    $applozic('.faq-common').removeClass("vis").addClass("n-vis");
    $applozic('.mck-conversation').removeClass("n-vis").addClass("vis");
    $applozic('#km-faq').removeClass("n-vis").addClass("vis");
    $applozic("#mck-msg-new").attr("disabled", false);
    if ($applozic("#mck-message-cell .mck-message-inner div[name='message']").length === 0 && isFirstLaunch == true) {
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
        !kommunicateCommons.checkIfDeviceIsHandheld() && $applozic('#mck-text-box').focus();
},
setAvailabilityStatus : function (status){
    $applozic('.mck-agent-image-container').removeClass("n-vis").addClass("vis");
    $applozic(".mck-agent-image-container .mck-agent-status-indicator").removeClass("mck-status--online").removeClass("mck-status--offline").removeClass("mck-status--away").removeClass("n-vis").addClass("vis mck-status--" + status);
    $applozic("#mck-agent-status-text").text(MCK_LABELS[status]).addClass("vis").removeClass("n-vis");
},
showClosedConversationBanner  : function(isConversationClosed){
    var messageText = MCK_LABELS["closed.conversation.message"];
    var conversationStatusDiv = document.getElementById("mck-conversation-status-box");
    if (isConversationClosed){
        conversationStatusDiv && (conversationStatusDiv.innerHTML= messageText);
        kommunicateCommons.modifyClassList( {id : ["mck-sidebox-ft"]}, "mck-closed-conv-banner");
        kommunicateCommons.modifyClassList( {id : ["mck-conversation-status-box"]}, "vis", "n-vis");
    }
    else {
        kommunicateCommons.modifyClassList( {id : ["mck-sidebox-ft"]},"","mck-closed-conv-banner");
        kommunicateCommons.modifyClassList( {id : ["mck-conversation-status-box"]}, "n-vis", "vis");
    } 
},
handleAttachmentIconVisibility : function(enableAttachment, msg, groupReloaded) {
    if (!groupReloaded && typeof msg.metadata === "object" && msg.metadata.KM_ENABLE_ATTACHMENT) {
        msg.metadata.KM_ENABLE_ATTACHMENT == "true" && kommunicateCommons.modifyClassList( {id : ["mck-attachfile-box","mck-file-up"]}, "vis", "n-vis");
        msg.metadata.KM_ENABLE_ATTACHMENT == "false" && kommunicateCommons.modifyClassList( {id : ["mck-attachfile-box","mck-file-up"]}, "n-vis", "vis");
    } else if (groupReloaded && enableAttachment) {
        enableAttachment == "true" && kommunicateCommons.modifyClassList( {id : ["mck-attachfile-box","mck-file-up"]}, "vis", "n-vis");
        enableAttachment == "false" && kommunicateCommons.modifyClassList( {id : ["mck-attachfile-box","mck-file-up"]}, "n-vis", "vis");
    }
}

}