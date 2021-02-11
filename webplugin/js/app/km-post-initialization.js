/**
 * This file responsible for the all operations being performed after chat plugin initialized.
 * eg. subscribing the events etc.
 * this file use Kommunicate Object. Put this file after kommunicate.js while combining.
 */

Kommunicate.postPluginInitialization = function (err, data) {
    // get the third party settings
    KommunicateKB.init(Kommunicate.getBaseUrl());
    Kommunicate.getFaqList(data);
};

//faq plugin
Kommunicate.getFaqList = function (data) {
    KommunicateKB.getArticles({
        data: { appId: data.appId, query: "" },
        success: function (response) {
            if (
                response.data &&
                response.data.length > 0 &&
                $applozic(".km-kb-container").hasClass("n-vis")
            ) {
                $applozic(".km-kb-container")
                    .removeClass("n-vis")
                    .addClass("vis");
                KommunicateUI.adjustConversationTitleHeadingWidth(
                    kommunicate._globals.popupWidget
                );
            }
            $applozic.each(response.data, function (i, faq) {
                var title =
                    faq &&
                    faq.title &&
                    kommunicateCommons.formatHtmlTag(faq.title);
                $applozic("#km-faq-list-container").append(
                    '<li class="km-faq-list" aria-disabled="false" role="button" tabindex="0" data-source="' +
                        faq.source +
                        '" data-articleId="' +
                        faq.articleId +
                        '"><a class="km-faqdisplay"><div class="km-faqimage">' +
                        KommunicateUI.faqSVGImage +
                        '</div> <div class="km-faqanchor">' +
                        title +
                        "</div></a></li>"
                );
            });
            KommunicateUI.faqEvents(data);
        },
        error: function () {},
    });
};
