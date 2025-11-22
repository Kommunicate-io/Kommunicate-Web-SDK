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
    KommunicateUI.initFaq();
    KommunicateUI.faqAppData = data;

    if (primaryCTA && primaryCTA !== 'FAQ') {
        kommunicateCommons.show('.km-kb-container');
        kommunicateCommons.hide('#km-faq');
    }
    if (kommunicate?._globals?.faqCategory) {
        categoryName = kommunicate._globals.faqCategory;
        Kommunicate.getFaqList(data, categoryName);
    } else {
        KommunicateUI.ensureFaqCategoriesLoaded(data);
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
                kommunicateCommons.show('.km-kb-container');
                KommunicateUI.adjustConversationTitleHeadingWidth(kommunicate._globals.popupWidget);
            }

            // hide the dropdown faq button if no articles there
            if (response.data.length === 0) {
                kommunicateCommons.hide('.km-option-faq');
            }

            response.data.length
                ? $applozic.each(response.data, function (i, faq) {
                      var title = faq && faq.title && kommunicateCommons.formatHtmlTag(faq.title);
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
        },
        error: function () {},
    });
};
Kommunicate.getFaqCategories = function (data) {
    KommunicateKB.getCategories({
        data: { appId: data.appId, baseUrl: Kommunicate.getBaseUrl() },
        success: function (response) {
            KommunicateUI.faqCategoryRequestPending = false;
            KommunicateUI.faqCategoriesReady = true;
            var initializeFAQ = false;
            var articleLabel =
                (window.MCK_LABELS && MCK_LABELS['modern.faq.category.article']) || 'article';
            var articlesLabel =
                (window.MCK_LABELS && MCK_LABELS['modern.faq.category.articles']) || 'articles';
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
                var safeCategoryName = kommunicateCommons.formatHtmlTag(categoryName);
                var safeCategoryDescription = kommunicateCommons.formatHtmlTag(categoryDescription);
                var articleCount = Number(category.articleCount) || 0;
                var articleCountLabel = articleCount
                    ? articleCount +
                      ' ' +
                      (articleCount === 1 ? articleLabel : articlesLabel || articleLabel + 's')
                    : '';
                var safeCategoryNameAttr = kommunicateCommons.encodeCategoryNameForAttribute(
                    categoryName
                );
                $applozic('.km-faq-category-list-container').append(
                    '<div class="km-faq-category-card" data-category-name="' +
                        safeCategoryNameAttr +
                        '">' +
                        '<div class="km-faq-category-card-content">' +
                        '<div class="km-faq-category-card-title-row">' +
                        '<div class="km-faq-category-card-title km-custom-widget-text-color">' +
                        safeCategoryName +
                        '</div>' +
                        (articleCountLabel
                            ? '<span class="km-faq-category-card-count">' +
                              articleCountLabel +
                              '</span>'
                            : '') +
                        '</div>' +
                        '<div class="km-faq-category-card-body">' +
                        safeCategoryDescription +
                        '</div>' +
                        '</div>' +
                        '</div>'
                );
            });

            if ($applozic('.km-kb-container').hasClass('n-vis') && initializeFAQ) {
                kommunicateCommons.show('.km-kb-container');
                KommunicateUI.adjustConversationTitleHeadingWidth(kommunicate._globals.popupWidget);
                KommunicateUI.setFAQButtonText();
            }
        },
        error: function () {
            KommunicateUI.faqCategoryRequestPending = false;
        },
    });
};
