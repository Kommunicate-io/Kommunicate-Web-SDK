/**
 * Add all Kommunicate UI Manipulation in this file.
 * 
 */
KommunicateUI={
    CONSTS:{

    },
    populateAwayMessage:function(err,message){
        var isCnversationWindowNotActive = $applozic("#mck-tab-individual").hasClass('n-vis');
        if(!err && message.code =="SUCCESS" &&message.data.length>0 &&!isCnversationWindowNotActive){
            // supporting only one away message for now. 
            awayMessage =message.data[0].message;
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
    
   faqEvents:function (data, helpdocsKey) {
    var mcktimer;
    $applozic(d).on("click", ".mck-sidebox-launcher", function () {
        KommunicateUI.showChat();
    });

    $applozic(d).on("click", "#mck-msg-preview", function () {
        KommunicateUI.showChat();
    });
    $applozic(d).on("click", ".km-faq-list", function () {
        $applozic('#km-faqanswer').empty();
        var articleId = $(this).attr('data-articleid');
        var source = $(this).attr('data-source');
        KommunicateKB.getArticle({
            data: { appId: data.appId, articleId: articleId, source: source, helpdocsAccessKey: helpdocsKey }, success: function (response) {
                if ($applozic("#km-faqanswer .km-faqanswer-list").length == 0) {
                    $applozic("#km-faqanswer").append('<div class="km-faqanswer-list km-faqanswerscroll"><div class="km-faqquestion">' + response.data.title + '</div> <div class="km-faqanchor km-faqanswer">' + response.data.body + '</div></div>');
                    $applozic('.mck-faq-inner').removeClass("vis").addClass("n-vis");
                    $applozic('.km-faqanswer').removeClass("n-vis").addClass("vis");
                    $applozic('.km-faqsearch').removeClass("vis").addClass("n-vis");
                    $applozic('#mck-no-conversations').removeClass("vis").addClass("n-vis");
                    $applozic('.mck-sidebox-ft').removeClass("vis").addClass("n-vis");

                }
            }
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
            $applozic('.km-faqheader').removeClass("n-vis").addClass("vis");
            $applozic('.km-faqback').removeClass("n-vis").addClass("vis");
            $applozic('.km-faqsearch').removeClass("n-vis").addClass("vis");
            $applozic('#km-faqdiv').removeClass("n-vis").addClass("vis");
            $applozic('#mck-no-conversations').removeClass("vis").addClass("n-vis");
            $applozic('.mck-sidebox-ft').removeClass("vis").addClass("n-vis");
            $applozic('#mck-away-msg-box').removeClass("vis").addClass("n-vis");
            $applozic('#mck-msg-form').removeClass("vis").addClass("n-vis");
            $applozic('#mck-tab-individual').removeClass("vis").addClass("n-vis");

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

   
    $applozic(d).on("click", "#mck-conversation-back-btn", function () {
        if($applozic('.km-kb-container').hasClass('vis')){
            $applozic('.km-faqback').removeClass('vis').addClass('n-vis');
            $applozic('.km-faq').removeClass('n-vis').addClass('vis');
            $applozic('#mck-tab-conversation').removeClass('n-vis').addClass('vis');
            $applozic('#mck-conversation-title').removeClass('n-vis').addClass('vis');
            $applozic('#mck-no-conversations').removeClass('vis').addClass('n-vis');
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
            $applozic('.km-faqheader').removeClass("vis").addClass("n-vis");
            // $applozic('.km-faqback').removeClass("vis").addClass("n-vis");
            $applozic('.km-faqsearch').removeClass("vis").addClass("n-vis");
            $applozic('#mck-tab-conversation').removeClass("n-vis").addClass("vis");
        }

    });
},

showChat :function () {
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
    if($applozic('.mck-message-inner').hasClass('vis')){
       $applozic('.km-faqheader').removeClass("vis").addClass("n-vis");
       $applozic('#mck-conversation-title').removeClass("n-vis").addClass("vis");
       $applozic('#mck-away-msg-box').removeClass("vis").addClass("n-vis");
    }
}
  
}