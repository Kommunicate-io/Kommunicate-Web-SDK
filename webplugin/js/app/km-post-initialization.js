/**
 * This file responsible for the all operations being performed after chat plugin initialized.
 * eg. subscribing the events etc.
 * this file use Kommunicate Object. Put this file after kommunicate.js while combining.
 */

Kommunicate.postPluginInitialization = function (err, data) {
    Kommunicate.initilizeEventListners();
    // hiding away message when new message received from agents.
        $applozic.fn.applozic('subscribeToEvents', Kommunicate.ApplozicEvents);
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
                var helpdocsKey = settings.message.filter(function (item) {
                    return item.type == KommunicateConstants.THIRD_PARTY_APPLICATION.HELPDOCS;
                })[0];

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
    var activeConversationInfo = Kommunicate.getActiveConversation();
    
    activeConversationInfo && typeof data != "undefined" && (data.appId == activeConversationInfo.appId) && (MCK_MAINTAIN_ACTIVE_CONVERSATION_STATE && Kommunicate.openConversation(activeConversationInfo.groupId));
    
    activeConversationInfo && typeof data != "undefined" && (data.appId != activeConversationInfo.appId) && (KommunicateUtils.removeItemFromLocalStorage("mckActiveConversationInfo"));

}

//faq plugin
Kommunicate.helpdocsInitialization = function (data, helpdocsKey) {
    var faqSVGImage = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><circle class="km-custom-widget-fill" cx="12" cy="12" r="12" fill="#5553B7" fill-rule="nonzero" opacity=".654"/><g transform="translate(6.545 5.818)"><polygon fill="#FFF" points=".033 2.236 .033 12.057 10.732 12.057 10.732 .02 3.324 .02"/><rect class="km-custom-widget-fill" width="6.433" height="1" x="2.144" y="5.468" fill="#5553B7" fill-rule="nonzero" opacity=".65" rx=".5"/><rect class="km-custom-widget-fill" width="4.289" height="1" x="2.144" y="8.095" fill="#5553B7" fill-rule="nonzero" opacity=".65" rx=".5"/><polygon class="km-custom-widget-fill" fill="#5553B7" points="2.656 .563 3.384 2.487 1.162 3.439" opacity=".65" transform="rotate(26 2.273 2.001)"/></g></g></svg>';
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
                $applozic("#km-faq-list-container").append('<li class="km-faq-list" data-source="' + faq.source + '" data-articleId="' + faq.articleId + '"><a class="km-faqdisplay"><div class="km-faqimage">' + faqSVGImage + '</div> <div class="km-faqanchor">' + faq.title + '</div></a></li>');
            });
            KommunicateUI.faqEvents(data, helpdocsKey);
        }, error: function () { }
    });

}
Kommunicate.getActiveConversation = function () {
    return KommunicateUtils.getItemFromLocalStorage("mckActiveConversationInfo");
}
