$(document).ready(function() {
  var $chat_form = $('#chat-form');
  var $chat_submit = $('#chat-submit');
  var $chat_relauncher = $('#chat-relauncher');
  var $chat_response = $('#chat-response');
  var $chat_postlaunch = $('#chat-post-launch');

  $chat_relauncher.on('click', function() {
    window.location = '/login.html';
  });

});

var autoSuggestions = {};

function initAutoSuggestions() {

  for(autoSuggest in autoSuggestions){
    $('#km-text-box').atwho({
      at: `/${autoSuggest}`,
      insertTpl: '${content}',
      displayTpl: '<li>${name} <small>${content}</small></li>',
      data: autoSuggestions[autoSuggest]
    })  
  }
  
}


  var $userId = "";
  var $appKey = "applozic-sample-app";
  var $contactNumber = "";
  var $password = "";
  function logout(){
    $kmApplozic.fn.applozic("logout");
  }

  function chatLogin() {
    var userId = localStorage.getItem('loggedinUser'); //"debug2";
    var appId = localStorage.getItem('applicationId'); // "applozic-sample-app";
    var userPassword = localStorage.getItem('password'); // "debug2";
    var userContactNumber = "";
    var topicBoxEnabled = true;
    var applozicBaseUrl = (window.location.origin=="http://localhost:3000"||window.location.origin=="https://dashboard-test.kommunicate.io")?"https://apps-test.applozic.com":"https://chat.kommunicate.io";
    console.log("base url",applozicBaseUrl);
    /*var displayName = '';
    displayName = '${param.displayName}';*/
    if (typeof userId === "undefined" || userId == null) {
      return;
    }

    if (userId == 'applozic' || userId == 'applozic-premium') {
        $("#km-individual-tab-title .km-tab-title").click(function () {
            clearbit($(this).text());
        });
    }

    function onInitialize(data) {
      if (data.status == 'success') {
        // write your logic exectute after plugin initialize.
        $("#login-modal").mckModal('hide');
        $('#chat').css('display', 'none');
        $('#chat-box-div').css('display', 'block');
        initAutoSuggestions();
        $("#li-chat a").trigger('click');
        window.Aside.loadAgents();
      }
    }
    //var loginId =localStorage.isAdmin=="true"?"agent":userId;
    //var uPassword = localStorage.isAdmin=="true"?"agent":userPassword;
    $kmApplozic.fn.applozic({
      baseUrl: applozicBaseUrl,
      notificationIconLink:
          'https://www.applozic.com/resources/images/applozic_icon.png',
      notificationSoundLink: 'https://api.kommunicate.io/plugin/audio/notification_tone.mp3',
      userId: userId,
      appId: appId,
      //appId: 'applozic-sample-app',
      // email:'userEmail',
      accessToken: userPassword,
      desktopNotification: true,
      swNotification: true,
      messageBubbleAvator: true,
      olStatus: true,
      onInit: onInitialize,
      onTabClicked : function(tabDetail) {
             //window.location="/conversations";
             window.appHistory.replace('/conversations');
  					 if(typeof tabDetail === 'object') {
  					        console.log(tabDetail.tabId  + " " + tabDetail.isGroup);
                    if (tabDetail.isGroup) {
                      window.$kmApplozic("#km-toolbar").removeClass('n-vis').addClass('vis');
                      window.Aside.initConversation(tabDetail.tabId);
                    } else {
                      window.$kmApplozic("#km-toolbar").addClass('n-vis').removeClass('vis');
                    }
  					 }
					 },
      locShare: true,
      googleApiKey: 'AIzaSyCrBIGg8X4OnG4raKqqIC3tpSIPWE-bhwI',
      launchOnUnreadMessage: true,
      topicBox: topicBoxEnabled,
      authenticationTypeId: 1,
      initAutoSuggestions : initAutoSuggestions
      // topicDetail: function(topicId) {}
    });
    return false;
  //});
  }

function clearbit(email) {
    //Authorization: Bearer sk_8235cd13e90bd6b84260902b98c64aba
    //https://person-stream.clearbit.com/v2/combined/find?email=alex@alexmaccaw.com
    $.ajax({
        url: 'https://person-stream.clearbit.com/v2/combined/find?email=' + email,
        type: 'GET',
        headers: {
            "Authorization":"Bearer sk_8235cd13e90bd6b84260902b98c64aba"
        },
        success: function(response) {
            console.log(response);
            var person = response.person;
            var company = response.company;
            var info = "";
            if (typeof person !== "undefined" && person != null && person != "null") {
                info = person.bio + " " + person.location;
                $("#cust-info .bio").html(person.bio + " " + person.location);
                var employment = person.employment;
                if (typeof employment !== "undefined" && employment != null && employment != "null") {
                    info = info + " " + person.employment.title;
                    $("#cust-info .title").html(person.employment.title);
                }
                var linkedin = person.linkedin;
                if (typeof linkedin !== "undefined" && linkedin != null && linkedin != "null") {
                    info = info + " " + linkedin.handle;
                    $("#cust-info .linkedin").attr('href','https://linkedin.com/' + linkedin.handle);
                }
            }
            if (typeof company !== "undefined" && company != null && company != "null") {
                info = info + " " + company.domain;
                $("#cust-info .domain").attr('href', company.domain);
            }
            console.log(info);
        }
    });

}

function getSuggestions(_urlAutoSuggest) {

  fetch(_urlAutoSuggest)
    .then(res => res.json())
    .then(response => {
      autoSuggestions_data = response.data;
      return autoSuggestions_data;
    })
    .then(autoSuggestions_data => {
      console.log(autoSuggestions_data)
      console.log(localStorage.getItem("applicationKey"))
      autoSuggestions = autoSuggestions_data.reduce((prev, curr) => {
          if(curr.category in prev){
            prev[curr.category].push({name:curr.name, content:curr.content})
          }else{
            prev[curr.category] = [{name:curr.name, content:curr.content}]
          }
        return prev;
      }, {});
      let categories = Object.keys(autoSuggestions);
      initAutoSuggestions()
    })
    .catch(err => {console.log("Error in getting auto suggestions")});
}
