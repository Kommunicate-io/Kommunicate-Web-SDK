/**
 * This file responsible for the all operations being performed after chat plugin initialized.
 * eg. subscribing the events etc.
 * this file use Kommunicate Object. Put this file after kommunicate.js while combining.
 */

Kommunicate.postPluginInitialization = function (err, data) {
    // get the third party settings
    KommunicateKB.init(Kommunicate.getBaseUrl());
    var categoryName;
    if (kommunicate && kommunicate._globals && kommunicate._globals.faqCategory) {
        categoryName = kommunicate._globals.faqCategory;
        Kommunicate.getFaqList(data, categoryName);
    }else{
        Kommunicate.getFaqCategories(data)
    }
};

//faq plugin
Kommunicate.getFaqList = function (data, categoryName) {
    KommunicateKB.getArticles({
        data: { appId: data.appId, query: '', categoryName: categoryName },
        success: function (response) {
            if (
                response.data &&
                response.data.length > 0 &&
                $applozic('.km-kb-container').hasClass('n-vis')
            ) {
                $applozic('.km-kb-container')
                    .removeClass('n-vis')
                    .addClass('vis');
                KommunicateUI.adjustConversationTitleHeadingWidth(
                    kommunicate._globals.popupWidget
                );
            }
            $applozic.each(response.data, function (i, faq) {
                var title =
                    faq &&
                    faq.title &&
                    kommunicateCommons.formatHtmlTag(faq.title);
                $applozic('#km-faq-list-container').append(
                    '<li class="km-faq-list" aria-disabled="false" role="button" tabindex="0" data-source="' +
                    faq.source +
                    '" data-articleId="' +
                    faq.articleId +
                    '"><a class="km-faqdisplay"><div class="km-faqimage">' +
                    KommunicateUI.faqSVGImage +
                    '</div> <div class="km-faqanchor">' +
                    title +
                    '</div></a></li>'
                );
            });

            kommunicate && kommunicate._globals && kommunicate._globals.faqCategory && KommunicateUI.initFaq()
            KommunicateUI.faqEvents(data);
        },
        error: function () { },
    });
};
Kommunicate.getFaqCategories = function(data){
    KommunicateKB.getCategories({
        data: {appId: data.appId, baseUrl: Kommunicate.getBaseUrl()},
        success: function (response) {
            if (
                response.data &&
                response.data.length > 0 &&
                $applozic('.km-kb-container').hasClass('n-vis')
            ) {
                $applozic('.km-kb-container')
                    .removeClass('n-vis')
                    .addClass('vis');
                KommunicateUI.adjustConversationTitleHeadingWidth(
                    kommunicate._globals.popupWidget
                );
            }
            $applozic.each(response.data, function (i, category) {
                var categoryName = category && category.name;
                var categoryDescription = category && category.description;
                $applozic('#km-faq-category-list-container').append(
                    '<div class="km-faq-category-card" data-category-name="'+ categoryName.replaceAll(" ", "-")
                    +'">'+
                    '<div class="km-faq-category-card-title">' +
                    categoryName + 
                    '</div>' + 
                    '<div class="km-faq-category-card-body">' +
                    categoryDescription + 
                    '</div> </div>'
                );
            });
            KommunicateUI.initFaq()
        },
        error: function () { },
    })
}