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
            if (!message.metadata || (isValidMetadata && !isSentByBot)) {
                KommunicateUI.hideAwayMessage();
            }
        }
    });
    // get the third party settings 
    // 1: for helpDocs
    KommunicateKB.init(Kommunicate.getBaseUrl());
    if (KommunicateUtils.getDataFromKmSession("HELPDOCS_KEY")) {
        var helpdocKey = KommunicateUtils.getDataFromKmSession("HELPDOCS_KEY");
        Kommunicate.helpdocsInitialization(data, helpdocKey);
    } else {
        Kommunicate.client.getThirdPartySettings({ appId: data.appId, type: 1 }, function (err, settings) {
            if (err) {
                console.log("err : ", err);
                return;
            }
            console.log("data : ", settings);
            if (settings && settings.code == "SUCCESS") {
                var helpdocsKey = settings.message.find(function (item) {
                    return item.type == KommunicateConstants.THIRD_PARTY_APPLICATION.HELPDOCS;
                });

                helpdocsKey && KommunicateUtils.storeDataIntoKmSession("HELPDOCS_KEY", helpdocsKey.accessKey);
                helpdocsKey && Kommunicate.helpdocsInitialization(data, helpdocsKey.accessKey);


            }
        })
    }

}

//faq plugin
Kommunicate.helpdocsInitialization = function (data,helpdocsKey){
   
if (helpdocsKey) {
    KommunicateKB.getArticles({
        data:

            { appId: data.appId, query: '', helpdocsAccessKey: helpdocsKey }
        , success: function (response) {
            $applozic.each(response.data, function (i, faq) {       
                $applozic("#km-faqdiv").append('<li class="km-faq-list" data-source="' + faq.source + '" data-articleId="' + faq.articleId + '"><a class="km-faqdisplay"> <div><div class="km-faqimage"></div></div> <div class="km-faqanchor">' + faq.title + '</div></a></li>');
            });
            Kommunicate.faqEvents(data,helpdocsKey);
        }, error: function () { }
    });
}
}

// faq releated events

Kommunicate.faqEvents= function (data,helpdocsKey){
    var mcktimer; 
    $applozic(d).on("click", ".mck-sidebox-launcher", function () {
        Kommunicate.showChat();
    });
   
    $applozic(d).on("click", "#mck-msg-preview", function () {
        Kommunicate.showChat();
    });
    $applozic(d).on("click", ".km-faq-list", function () {
        $applozic('#km-faqanswer').empty();
        var articleId = $(this).attr('data-articleid');
        var source = $(this).attr('data-source');
        KommunicateKB.getArticle({
            data: { appId: data.appId, articleId: articleId, source: source, helpdocsAccessKey: helpdocsKey }, success: function (response) {
                if ($applozic("#km-faqanswer .km-faqanswer-list").length == 0) { 
                $applozic("#km-faqanswer").append('<div class="km-faqanswer-list"><div class="km-faqquestion">' + response.data.title + '</div> <div class="km-faqanchor km-faqanswer">' + response.data.body + '</div></div>');
                $applozic('.mck-faq-inner').removeClass("vis").addClass("n-vis");
                $applozic('.km-faqanswer').removeClass("n-vis").addClass("vis");
                $applozic('.km-faqsearch').removeClass("vis").addClass("n-vis");
                $applozic('#mck-no-conversations').removeClass("vis").addClass("n-vis");
                $applozic('.mck-sidebox-ft').removeClass("vis").addClass("n-vis");

            }}
            , error: function () { }
        });
    });
    $applozic(d).on("click", "#km-faq", function () {
        if (document.getElementById("km-faqdiv").hasChildNodes()) {
            $applozic('.mck-message-inner').removeClass("vis").addClass("n-vis");
            $applozic('#mck-conversation-title').removeClass("vis").addClass("n-vis");
            $applozic('#mck-contacts-content').removeClass("vis").addClass("n-vis");
            $applozic('#km-faq').removeClass("vis").addClass("n-vis");
            $applozic('.mck-faq-inner').removeClass("n-vis").addClass("vis");
            $applozic('.km-faqback').removeClass("n-vis").addClass("vis");
            $applozic('.km-faqtitle').removeClass("n-vis").addClass("vis");
            $applozic('.km-faqsearch').removeClass("n-vis").addClass("vis");
            $applozic('#km-faqdiv').removeClass("n-vis").addClass("vis");
            $applozic('#mck-no-conversations').removeClass("vis").addClass("n-vis");
            $applozic('.mck-sidebox-ft').removeClass("vis").addClass("n-vis");
        } else {
            $applozic('#km-faqdiv').removeClass("vis").addClass("n-vis");
        }

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
                    $applozic('#km-faqdiv').empty();
                    $applozic.each(response.data, function (i, faq) {
                        $applozic("#km-faqdiv").append('<li class="km-faq-list" data-source="' + faq.source + '" data-articleId="' + faq.articleId + '"><a class="km-faqdisplay"> <div><span class="km-faqimage"/ ></span> <div class="km-faqanchor ">' + faq.title + '</div></a></li>');
                    });
                }, error: function () { }
            });
        }
    });



    $applozic(d).on("click", ".km-faqback", function () {
        if ($applozic('#km-faqanswer').hasClass('vis')) {
            $applozic('.mck-faq-inner').removeClass("n-vis").addClass("vis");
            $applozic('#km-faqanswer').removeClass("vis").addClass("n-vis");
            $applozic('.km-faqsearch').removeClass("n-vis").addClass("vis");
        }
        else {
            $applozic('.mck-message-inner').removeClass("n-vis").addClass("vis");
            $applozic('#mck-conversation-title').removeClass("n-vis").addClass("vis");
            $applozic('#mck-contacts-content').removeClass("n-vis").addClass("vis");
            $applozic('#km-faq').removeClass("n-vis").addClass("vis");
            $applozic('.mck-faq-inner').removeClass("vis").addClass("n-vis");
            $applozic('.km-faqback').removeClass("vis").addClass("n-vis");
            $applozic('.km-faqtitle').removeClass("vis").addClass("n-vis");
            $applozic('.km-faqsearch').removeClass("vis").addClass("n-vis");
        }

    });
}

Kommunicate.showChat = function(){
    if ($applozic('#km-faqdiv').hasClass('vis')) {
        $applozic('#km-faqdiv').removeClass("vis").addClass("n-vis");
        $applozic('.mck-message-inner').removeClass("n-vis").addClass("vis");
        $applozic('#km-contact-search-input-box').removeClass("vis").addClass("n-vis");
        $applozic('#mck-no-conversations').removeClass("vis").addClass("n-vis");
    }
   
    if ($applozic('#km-faqanswer').hasClass('vis')) {
        $applozic('.mck-message-inner').removeClass("n-vis").addClass("vis");
        $applozic('#km-faqanswer').removeClass("vis").addClass("n-vis");
        $applozic('#km-contact-search-input-box').removeClass("vis").addClass("n-vis");
        $applozic('#mck-no-conversations').removeClass("vis").addClass("n-vis");
    }
}