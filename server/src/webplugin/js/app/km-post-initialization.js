/**
 * This file responsible for the all operations being performed after chat plugin initialized.
 * eg. subscribing the events etc.
 * this file use Kommunicate Object. Put this file after kommunicate.js while combining. 
 */

Kommunicate.postPluginInitialization = function (err, data) {
    // hiding away message when new message received from agents.
    $applozic.fn.applozic('subscribeToEvents', {
        onMessageReceived: function (obj) {
            //message received
            var message = obj && obj.message;
            var isValidMetadata = message.metadata && (message.metadata.category != 'HIDDEN' && message.metadata.hide != "true");
            var isSentByBot = isValidMetadata && message.metadata && message.metadata.skipBot == "true";
            if (!message.metadata || (isValidMetadata)) {
                KommunicateUI.hideAwayMessage();
            }
        }
    });
    // get the third party settings 
    // 1: for helpDocs
    KommunicateKB.init(Kommunicate.getBaseUrl());
    var helpdocsAccessKey = KommunicateUtils.getDataFromKmSession("HELPDOCS_KEY");
    if (helpdocsAccessKey == null || helpdocsAccessKey == "") {
        Kommunicate.client.getThirdPartySettings({ appId: data.appId, type: 1 }, function (err, settings) {
            if (err) {
                console.log("err : ", err);
                return;
            }
            if (settings && settings.code == "SUCCESS") {
                var helpdocsKey = settings.message.find(function (item) {
                    return item.type == KommunicateConstants.THIRD_PARTY_APPLICATION.HELPDOCS;
                });

                if (helpdocsKey) {
                    helpdocsAccessKey = helpdocsKey.accessKey;
                    KommunicateUtils.storeDataIntoKmSession("HELPDOCS_KEY", helpdocsKey.accessKey);
                } else {
                    KommunicateUtils.storeDataIntoKmSession("HELPDOCS_KEY", "null");
                }
                Kommunicate.helpdocsInitialization(data, helpdocsAccessKey);
            }
        });
    } else {
        Kommunicate.helpdocsInitialization(data, helpdocsAccessKey);
    }
}

//faq plugin
Kommunicate.helpdocsInitialization = function (data, helpdocsKey) {
    if (helpdocsKey == "null") {
        helpdocsKey = null;
    }
    KommunicateKB.getArticles({
        data: { appId: data.appId, query: '', helpdocsAccessKey: helpdocsKey }, 
        success: function (response) {
            if (response.data && response.data.length > 0 && $applozic(".km-kb-container").hasClass("n-vis")) {
                $applozic(".km-kb-container").removeClass('n-vis').addClass('vis');
            }
            $applozic.each(response.data, function (i, faq) {
                $applozic("#km-faqdiv").append('<li class="km-faq-list" data-source="' + faq.source + '" data-articleId="' + faq.articleId + '"><a class="km-faqdisplay"> <div><div class="km-faqimage"></div></div> <div class="km-faqanchor">' + faq.title + '</div></a></li>');
            });
            KommunicateUI.faqEvents(data, helpdocsKey);
        }, error: function () { }
    });
}


   
