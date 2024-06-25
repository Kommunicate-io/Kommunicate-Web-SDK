/**
 * This file responsible for the all operations being performed after chat plugin initialized.
 * eg. subscribing the events etc.
 * this file use Kommunicate Object. Put this file after kommunicate.js while combining.
 */

Kommunicate.postPluginInitialization = function (err, data) {
    // get the third party settings
    KommunicateKB.init(Kommunicate.getBaseUrl());
    var categoryName;
    var primaryCTA = kommunicate?._globals?.primaryCTA;

    if (primaryCTA && primaryCTA !== 'FAQ') {
        $applozic('.km-kb-container').removeClass('n-vis').addClass('vis');
        $applozic('#km-faq').addClass('n-vis').removeClass('vis');
    }
    if (kommunicate?._globals?.faqCategory) {
        categoryName = kommunicate._globals.faqCategory;
        Kommunicate.getFaqList(data, categoryName);
    } else {
        Kommunicate.getFaqCategories(data);
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

            // hide the dropdown faq button if no articles there
            if (response.data.length === 0) {
                $applozic('.km-option-faq')
                    .removeClass('vis')
                    .addClass('n-vis');
            }

            response.data.length
                ? $applozic.each(response.data, function (i, faq) {
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
                  })
                : KommunicateUI.faqEmptyState();

            kommunicate &&
                kommunicate._globals &&
                kommunicate._globals.faqCategory &&
                KommunicateUI.initFaq();
        },
        error: function () {},
    });
};
Kommunicate.getFaqCategories = function (data) {
    KommunicateKB.getCategories({
        data: { appId: data.appId, baseUrl: Kommunicate.getBaseUrl() },
        success: function (response) {
            var initializeFAQ = false;
            if (response.data && response.data.length == 1) {
                // if only 1 category is present then no need to show the category.
                kommunicate &&
                    kommunicate._globals &&
                    (kommunicate._globals.faqCategory = response.data[0].name);
                Kommunicate.getFaqList(data, response.data[0].name);
                return;
            }
            $applozic.each(response.data, function (i, category) {
                if (
                    !category ||
                    !category.articleCount ||
                    !category.name ||
                    !category.description
                ) {
                    return;
                }
                initializeFAQ = true;
                var categoryName = category.name;
                var categoryDescription = category.description;
                $applozic('#km-faq-category-list-container').append(
                    '<div class="km-faq-category-card km-custom-widget-border-color" data-category-name="' +
                        categoryName.replace(/ /g, '-') +
                        '">' +
                        '<div class="km-faq-category-card-title km-custom-widget-text-color">' +
                        categoryName +
                        '</div>' +
                        '<div class="km-faq-category-card-body">' +
                        categoryDescription +
                        '</div> </div>'
                );
            });

            if (
                $applozic('.km-kb-container').hasClass('n-vis') &&
                initializeFAQ
            ) {
                $applozic('.km-kb-container')
                    .removeClass('n-vis')
                    .addClass('vis');
                KommunicateUI.adjustConversationTitleHeadingWidth(
                    kommunicate._globals.popupWidget
                );
                KommunicateUI.setFAQButtonText();
            }
            initializeFAQ && KommunicateUI.initFaq();
        },
        error: function () {},
    });
};
