$(document).ready(function() {


    $kmApplozic(".km-group-search").on('click', function(e) {
        $kmApplozic("#km-customers-cell-link").trigger('click');
    });

    $kmApplozic("#km-user-info-close").on('click', function(e) {
        e.preventDefault();
        // $kmApplozic("#km-user-info-tab").removeClass('vis').addClass('n-vis');
        $kmApplozic(".km-container").removeClass('km-panel-3');
        $kmApplozic('.km-emoji-menu').removeClass('km-panel-3');
        $kmApplozic('body').removeClass('km-panel-3');
    });

    $kmApplozic("#kommunicate-panel-tabs li a").on('click', function(e) {
        var $this = $kmApplozic(this);
        $kmApplozic("#kommunicate-panel-tabs li").toggleClass('active');
        $kmApplozic("#kommunicate-panel-body .km-panel-cell").removeClass('vis').addClass('n-vis');
        $kmApplozic("#" + $this.data('tab')).removeClass('n-vis').addClass('vis');

        if ($this.data('tab') == "km-customers-cell") {
            $kmApplozic(".km-contact-search").trigger('click');
        }
    });

    $kmApplozic(document).on('click', '#km-new-group', function(event) {
        // $kmApplozic('.km-user-info-tab').removeClass("vis").addClass('n-vis');
    });
    $kmApplozic(document).on('click', '#km-group-tab-title', function(event) {
        var tabId = $kmApplozic('#km-group-tab-title').attr('data-km-id');
        group = kmGroupUtils.getGroup(tabId);
		var keys = Object.keys(group.users);	
		keys.every(function(userId, index) {
			var user = group.users[userId];
			if(user.role == 3){
                getContactDetail(userId)
				return false;
			}
			else {
				return true;
			}
		})			
        
    });
    $kmApplozic(document).on('click', '.km-group-member-list li, #km-tab-info-individual', function (event) {
        //$kmApplozic("#km-user-name-sec .km-user-title").html("");
        //$kmApplozic("#km-user-info-list .email").html("");
        //$kmApplozic("#km-user-info-icon-box .km-user-icon img").attr('src', "");

        var contactId = $kmApplozic(this).data('km-id');
        if (typeof contactId == "undefined" || typeof contactId == "") {
            contactId = $kmApplozic("#km-msg-to").val();
        }
        getContactDetail(contactId);
        
    });

    function getContactDetail(contactId){
        //resetCustomerInfoTab();
        var userSession = JSON.parse(localStorage.getItem('KM_USER_SESSION'));
            $kmApplozic.fn.applozic("fetchContacts", {
                "roleNameList": ["USER"],
                "userId": encodeURIComponent(contactId),
                'callback': function(response) {
            var user = response.response.users[0];
            kmEvents.triggerCustomEvent("_userDetailUpdate", { 'data': { 'data': user } });
            return;
            resetClearbitInfoAndUserInfo();
            var lastSeenAtText ="";
            if(user&& user.connected){
                lastSeenAtText = KM_LABELS["online.now"];
                $kmApplozic(".km-lastseen").addClass("km-lastseen-online");
            } 
            else if(user && user.lastSeenAtTime) {
                // This code will convert millisecond into date and time string 
                $kmApplozic.fn.applozic("getLastSeenAtStatus",{"lastseenTime":user.lastSeenAtTime, "dateFormat":"fullYearDateFormat",callback:function(resp){
                    //This code will remove last seen on from above string 
                    lastSeenAtText = resp.includes(KM_LABELS["last.seen.on"])?resp.split(KM_LABELS["last.seen.on"]):resp.split(KM_LABELS["last.seen"]);
                    $kmApplozic(".km-lastseen").removeClass("km-lastseen-online");
                }});
            }  
            $kmApplozic(".km-lastseen").html(lastSeenAtText);
            if(user && user.messagePxy && user.messagePxy.createdAtTime) {
                 // This code will convert millisecond into date and time string 
                $kmApplozic.fn.applozic("getLastSeenAtStatus",{"lastseenTime":user.messagePxy.createdAtTime,"dateFormat":"fullYearDateFormat",callback:function(resp){
                      //This code will remove last seen on from above string 
                    if (resp.includes("Last seen on ")) {
                        $kmApplozic(".km-lastMessageAtTime").html(resp.split("Last seen on "));
                    }
                   else{
                        $kmApplozic(".km-lastMessageAtTime").html(resp.split("Last seen "));
                    }
                }});
            }      
            var ul = document.getElementById("km-user-info-list");
            
                    if (typeof user !== "undefined") {
                        if(!$kmApplozic.isEmptyObject(user.metadata) ){
                            var userMetadata = user.metadata;
                            // delete userMetadata.kmClearbitData;
                            if(!$kmApplozic.isEmptyObject(userMetadata)){
                                $kmApplozic.map( userMetadata, function( value, key ) {
                                    try{
                                        value= JSON.parse(userMetadata[key]);
                                        
                                    }catch(e){
                                    
                                    }
                                    if (typeof value == 'object') {
                                        switch (key) {
                                            case 'KM_PSEUDO_USER':
                                                if (value.hidden != "true" || value.pseudoName == "true" && user.roleType === 3) {
                                                    $kmApplozic("#pseudo-name-icon").addClass("vis").removeClass("n-vis");
                                                }
                                                $kmApplozic("#km-clearbit-title-panel, .km-user-info-inner, #km-sidebar-user-info-wrapper").addClass("n-vis").removeClass("vis");
                                            break;
                                            case 'kmClearbitData':
                                                $kmApplozic("#km-clearbit-title-panel, .km-user-info-inner").addClass("vis").removeClass("n-vis");
                                                if($kmApplozic("#km-user-info-metadata-wrapper").text().length == 0) {
                                                    $kmApplozic("#km-sidebar-user-info-wrapper").addClass("n-vis").removeClass("vis");
                                                } else {
                                                    $kmApplozic("#km-sidebar-user-info-wrapper").addClass("vis").removeClass("n-vis");
                                                }
                                                displayCustInfo(value);
                                            break;
                                            default :
                                                $kmApplozic("#km-sidebar-user-info-wrapper").addClass("vis").removeClass("n-vis");
                                    } 
                                    
                                       
                                    }else if (value && key){
                                        $kmApplozic("#km-sidebar-user-info-wrapper").addClass("vis").removeClass("n-vis");
                                        $kmApplozic("#km-user-info-metadata-wrapper").append('<p class="km-user-info-metadata"><span class="km-user-info-meatadata-key">'+key+'</span><span class="km-user-info-meatadata-value">'+value+'</span></p>');
                                    }
                                    
                                });

                            }
                        }
                        $kmApplozic("#km-user-name-sec .km-user-title").html(user.userName);    
                        $kmApplozic("#km-sidebar-userId").html(user.userId);                       
                        var imageLink = $kmApplozic.fn.applozic("getContactImage", user);
                        imageLink=imageLink.replace('km-alpha-contact-image','km-alpha-group-contact-image').replace('km-contact-icon','km-group-contact-icon');
                        $kmApplozic("#km-group-info-tab .km-group-contact-icon").html(imageLink);
                        $kmApplozic("#km-sidebar-display-name").html(user.displayName || user.userId)
                        $kmApplozic("#km-sidebar-display-name-edit").html(user.displayName || user.userId)
                        
                            $kmApplozic(".km-display-email-number-wrapper div p:first-child").addClass("vis").removeClass("n-vis");

                        var emailtext = typeof user.email !== 'undefined' ? (user.email) : "";
                        if (typeof user.email !== 'undefined') {
                            $kmApplozic("#km-sidebar-user-email").removeClass("km-sidebar-user-emailnotfound").addClass("km-sidebar-user-email");
                        } else {
                            $kmApplozic("#km-sidebar-user-email").removeClass("km-sidebar-user-email").addClass("km-sidebar-user-emailnotfound");
                        }
                        $kmApplozic("#km-sidebar-user-email").html(emailtext).removeClass("n-vis").addClass("vis");
                        $kmApplozic("#km-sidebar-user-email-edit").html(emailtext);
                        $kmApplozic("#km-email-submit").removeClass("vis").addClass("n-vis");


                        var phone = typeof user.phoneNumber !== 'undefined' ? (user.phoneNumber) : "";
                        if (typeof user.phoneNumber !== 'undefined') {
                            $kmApplozic("#km-sidebar-user-number").removeClass("km-sidebar-user-numbernotfound").addClass("km-sidebar-user-number");
                        } else {
                            $kmApplozic("#km-user-info-list .email").html(user.email); 
                            $kmApplozic("#km-sidebar-user-number").removeClass("km-sidebar-user-number").addClass("km-sidebar-user-numbernotfound");
                        }
                        $kmApplozic("#km-phone-submit").removeClass("vis").addClass("n-vis");
                        $kmApplozic("#km-sidebar-user-number").html(phone).removeClass("n-vis").addClass("vis");
                        $kmApplozic("#km-sidebar-user-number-edit").html(phone);

                        
                        if (typeof user.email !== "undefined" && user.metadata && !user.metadata.kmClearbitData) {
                            userSession.clearbitKey && clearbit(user.email, user.userId);
                           
                        }
                    }
                }
        });
    }

	$kmApplozic(".side-nav li a").click(function() {
		var $this = $kmApplozic(this);
        if ($this.parent().hasClass('active')) {
            return;
        }
        var tab = $this.data('tab');
        $kmApplozic(".side-nav li").removeClass('active');
        $this.parent().addClass('active');
        $kmApplozic(".tabs").removeClass('show').addClass('hide');
        $kmApplozic("#tab-" + tab).removeClass('hide').addClass('show');
	});

});

function resetClearbitInfoAndUserInfo(){
    // $kmApplozic("#km-user-info-list .km-clearbit-field").html('');
    // $kmApplozic("#km-user-info-list .km-cl-icon-wrapper").addClass('n-vis');
    // $kmApplozic("#km-user-info-list .km-clearbit-logo-wrapper").addClass('n-vis');
    // $kmApplozic("#km-user-info-list .km-clearbit-divider").addClass('n-vis');
    // $kmApplozic("#km-user-info-list .km-clearbit-link").attr('href', '');
    // $kmApplozic("#km-sidebar-user-info-wrapper").removeClass('vis').addClass('n-vis');
    // $kmApplozic("#km-user-info-metadata-wrapper").children('p').remove();

}
function resetCustomerInfoTab() {
    // $kmApplozic("#km-sidebar-display-name").html("");
    // $kmApplozic("#km-sidebar-user-email").html("");
}


