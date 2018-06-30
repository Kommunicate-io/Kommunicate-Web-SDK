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

  var userSession = JSON.parse(localStorage.getItem('KM_USER_SESSION'));
  var appId = userSession.application.applicationId;

  for(autoSuggest in autoSuggestions){
    $('#km-text-box').atwho({
      at: `/${autoSuggest}`,
      insertTpl: '${content}',
      displayTpl: '<li data-suggestionId="${suggestionId}">${name} <small>${content}</small></li>',
      data: autoSuggestions[autoSuggest],
      callbacks: {
        beforeInsert: function(value, $li, e) {
          var machineInput = {"text": $(".active-chat .km-msg-left .km-msg-content div").last().html(), "appId": appId, "label": $li.attr('data-suggestionId')};
          $('#km-text-box').data("metadata", encodeURIComponent(JSON.stringify(machineInput)));
          return value;
        },
        beforeReposition: function(offset) {
          return offset;
        },
        afterMatchFailed: function(at, el) {

        }
      }  
    });
  }
}


  var $userId = "";
  var $appKey = "applozic-sample-app";
  var $contactNumber = "";
  var $password = "";
  var logout = function(){
    $kmApplozic.fn.applozic("logout");
  }

  var chatLogin = function () {
    var userSession = JSON.parse(localStorage.getItem('KM_USER_SESSION'));
    var userId = userSession.userName;
    var appId = userSession.application.applicationId;
    var userPassword = userSession.password;
    var userContactNumber = "";
    var topicBoxEnabled = true;
    var applozicBaseUrl = (window.location.origin=="http://localhost:3000"||window.location.origin=="https://dashboard-test.kommunicate.io")?"https://apps-test.applozic.com":"https://chat.kommunicate.io";
    /*var displayName = '';
    displayName = '${param.displayName}';*/
    if (typeof userId === "undefined" || userId == null) {
      return;
    }

    if (userId == 'applozic' || userId == 'applozic-premium') {
        $("#km-individual-tab-title .km-tab-title").click(function () {
            clearbit($(this).text());
            //activeCampaign($(this).text());
        });
    }

    function onInitialize(data) {
      if (data.status == 'success') {
        // write your logic exectute after plugin initialize.
        $('#chat').css('display', 'none');
        $('#chat-box-div').css('display', 'block');
        initAutoSuggestions();
        //$("#li-chat a").trigger('click');
        // window.Aside.loadAgents();
        window.Aside.loadBots();
      }
    }

    $kmApplozic.fn.applozic({
      baseUrl: applozicBaseUrl,
      notificationIconLink:
          'https://dashboard.kommunicate.io/favicon.ico',
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
      autoTypeSearchEnabled :false,
      // awsS3Server :true,
      onInit: onInitialize,
      onTabClicked : function(tabDetail) {
            var $mck_group_info_btn = $kmApplozic(".km-group-info-btn");
            $mck_group_info_btn.trigger('click');

            window.$kmApplozic("#km-contact-list .person").removeClass('prev-selection');

            window.appHistory.replace('/conversations');

  					if(typeof tabDetail === 'object') {
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
  
function activeCampaign(email) {
  $.ajax({
    url: 'https://applozic.api-us1.com/admin/api.php?api_action=contact_view&api_key=aa87aefccdb0f33344e88fc6c8764df8512427a3a84fc0431c3fed9691dab83cac9394b3&api_output=json&id=autoforosyurii@gmail.com',
    type: 'GET',
    success: function(response) {
    }
  });
}
function clearbit(email, userId) {
    
    //Todo: clear all fields
    var userSession = JSON.parse(localStorage.getItem('KM_USER_SESSION'));
        //Authorization: Bearer sk_8235cd13e90bd6b84260902b98c64aba
        //https://person-stream.clearbit.com/v2/combined/find?email=alex@alexmaccaw.com
      $.ajax({
        url: 'https://person-stream.clearbit.com/v2/combined/find?email=' + email,
        type: 'GET',
        headers: {
            // "Authorization":"Bearer sk_8235cd13e90bd6b84260902b98c64aba"
            "Authorization":"Bearer "+userSession.clearbitKey
        },
        success: function(response) {
          displayCustInfo(response)
          var user={'userId':userId,'metadata': {'kmClearbitData' : JSON.stringify(response)}}
          window.Aside.updateApplozicUser(user);
        }
      });
}

function displayCustInfo(clearbitData) {
  var person = clearbitData.person;
  var company = clearbitData.company;
  var info = "";
  var userInfo = {};
  if (typeof person !== "undefined" && person != null && person != "null") {
    $("#km-user-info-list #bio").html(person.bio !== null ? person.bio : '');
    $("#km-user-info-list #bio").removeClass('n-vis');
    $('#km-user-info-list #full-name').html(person.name.fullName !== null ? person.name.fullName : '');
    $('#km-user-info-list #domain').html(person.site !== null ? person.site : '');
    $("#km-user-info-list #domain-link").attr('href', person.site !== null ? person.site : '');
    $("#km-user-info-list #domain-icon").removeClass('n-vis');
    if(person.location !== null){
      $('#km-user-info-list #location').html(person.location !== null ? person.location : '');
      $("#km-user-info-list #location-icon").removeClass('n-vis');
    }  
    var linkedin = person.linkedin;
    if (typeof linkedin.handle !== "undefined" && linkedin.handle != null && linkedin.handle != "null") {
        info = info + " " + linkedin.handle;
        $("#km-user-info-list #linkedin").attr('href', 'https://linkedin.com/' + linkedin.handle);
        $("#km-user-info-list #km-cl-ln-icon-box").removeClass('n-vis');
    }
    var facebook = person.facebook;
    if (typeof facebook.handle !== "undefined" && facebook.handle != null && facebook.handle != "null") {
        $("#km-user-info-list #facebook").attr('href', 'https://facebook.com/' + facebook.handle);
        $("#km-user-info-list #km-cl-fb-icon-box").removeClass('n-vis');
    }
    var twitter = person.twitter;
    if (typeof twitter.handle !== "undefined" && twitter.handle != null && twitter.handle != "null") {
        $("#km-user-info-list #twitter").attr('href', 'https://twitter.com/' + twitter.handle);
        $("#km-user-info-list #km-cl-tw-icon-box").removeClass('n-vis');
    }
    
   
}
if (typeof company !== "undefined" && company != null && company != "null") {
    info = info + " " + company.domain;
    if(person != null ){
      if(person.site == null){
        $("#km-user-info-list #domain-link").attr('href', 'http://www.'+company.domain);
        $("#km-user-info-list #domain").text('http://www.'+company.domain);
        $("#km-user-info-list #domain-icon").removeClass('n-vis');
      }
    }
    else {
      $("#km-user-info-list #domain-link").attr('href', 'http://www.'+company.domain);
      $("#km-user-info-list #domain").text('http://www.'+company.domain);
      $("#km-user-info-list #domain-icon").removeClass('n-vis');
    }
   
    if(company.category.industry !== null || company.foundedYear !== null || company.description !== null) {
      $('#km-user-info-list #industry').html(company.category.industry !== null ? 
        '<span class="clearbit-industry-details">Industry</span>'+ company.category.industry : '');
      $('#km-user-info-list #foundedYear').html(company.foundedYear !== null ? 
        '<span class="clearbit-industry-details">Founded</span>'+company.foundedYear : '');
    }
    if(typeof company.description != "undefined" && company.description != null && company.description != "null") {
      if (company.description.length >  100) {
       var description = company.description.substr(0, 100) + '...';
       $('#km-user-info-list #description').html(description !== null ? description : '');
      }
      else {
        $('#km-user-info-list #description').html(company.description !== null ? dcompany.description : '');
      }
    }
    var crunchbase = company.crunchbase;
    if (typeof crunchbase.handle !== "undefined" && crunchbase.handle != null && crunchbase.handle != "null") {
        $("#km-user-info-list #crunchbase").attr('href', 'https://crunchbase.com/' + crunchbase.handle);
        $("#km-user-info-list #km-cl-cb-icon-box").removeClass('n-vis');    
    }
}
if(person != null){
  if(person.name.fullName !== null || person.domain !== null || person.location !== null || person.bio !== null){
    $("#km-user-info-list #divider-1").removeClass('n-vis');
  }
  if(facebook.handle != null || linkedin.handle != null || twitter.handle != null ){
    $("#km-user-info-list #divider-2").removeClass('n-vis');
  }
}
else if (company != null) {
  if (company.category.industry !== null ||company.foundedYear !== null || company.description !== null){
    $("#km-user-info-list #divider-1").removeClass('n-vis');
  }
  if (crunchbase.handle != null) {
    $("#km-user-info-list #divider-2").removeClass('n-vis');
  }
}
}

var getSuggestions = function(_urlAutoSuggest) {

  fetch(_urlAutoSuggest)
    .then(res => res.json())
    .then(response => {
      autoSuggestions_data = response.data;
      return autoSuggestions_data;
    })
    .then(autoSuggestions_data => {
      autoSuggestions = autoSuggestions_data.reduce((prev, curr) => {
          if(curr.category in prev){
            prev[curr.category].push({suggestionId: curr.id, name:curr.name, content:curr.content})
          }else{
            prev[curr.category] = [{suggestionId: curr.id, name:curr.name, content:curr.content}]
          }
        return prev;
      }, {});
      let categories = Object.keys(autoSuggestions);
      initAutoSuggestions()
    })
    .catch(err => {console.log("Error in getting auto suggestions")});
}
