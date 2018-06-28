$(document).ready(function() {


    $(".km-group-search").on('click', function(e) {
        $("#km-customers-cell-link").trigger('click');
    });

    $("#km-user-info-close").on('click', function(e) {
        e.preventDefault();
        // $kmApplozic("#km-user-info-tab").removeClass('vis').addClass('n-vis');
        $kmApplozic(".km-container").removeClass('km-panel-3');
        $kmApplozic('.km-emoji-menu').removeClass('km-panel-3');
        $kmApplozic('body').removeClass('km-panel-3');
    });

    $("#kommunicate-panel-tabs li a").on('click', function(e) {
        var $this = $(this);
        $("#kommunicate-panel-tabs li").toggleClass('active');
        $("#kommunicate-panel-body .km-panel-cell").removeClass('vis').addClass('n-vis');
        $("#" + $this.data('tab')).removeClass('n-vis').addClass('vis');

        if ($this.data('tab') == "km-customers-cell") {
            $(".km-contact-search").trigger('click');
        }
    });

    $(document).on('click', '#km-new-group', function(event) {
        // $('.km-user-info-tab').removeClass("vis").addClass('n-vis');
    });
    $(document).on('click', '#km-group-tab-title', function(event) {
        var tabId = $('#km-group-tab-title').attr('data-km-id');
        group = kmGroupUtils.getGroup(tabId);
		var keys = Object.keys(group.users);	
		keys.every((userId, index) => {
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
    $(document).on('click', '.km-group-member-list li, #km-tab-info-individual', function (event) {
        $("#km-user-name-sec .km-user-title").html("");
        $("#km-user-info-list .email").html("");
        $("#km-user-info-icon-box .km-user-icon img").attr('src', "");

        var contactId = $(this).data('km-id');
        if (typeof contactId == "undefined" || typeof contactId == "") {
            contactId = $("#km-msg-to").val();
        }
        getContactDetail(contactId);
        
    });

    function getContactDetail(contactId){
        $kmApplozic("#km-sidebar-display-name").html("");
        $kmApplozic("#km-sidebar-user-email").html("");
        var userSession = JSON.parse(localStorage.getItem('KM_USER_SESSION'));
        $kmApplozic.fn.applozic("getUserDetail", {"userIds": [contactId], callback: function(response) { 
            var user = response.data[0];
            resetCustomerInfoArea();     
            var ul = document.getElementById("km-user-info-list");
           
            for (key in user.metadata) {
                var li = document.createElement("li");
                var div1 = document.createElement('div');
                var div2 = document.createElement('div');
                div1.appendChild(document.createTextNode(key +":"));
                div2.appendChild(document.createTextNode(user.metadata[key]));
                li.setAttribute("class","customli");
                div1.setAttribute("class","km-userinfo-keydiv");
                div2.setAttribute("class","km-userinfo-valuediv");
                // li.appendChild(div1);
                // li.appendChild(div2);
                // ul.appendChild(li);
                }
                    if (typeof user !== "undefined") {
                        if(!$kmApplozic.isEmptyObject(user.metadata) ){
                            var userMetadata = user.metadata;
                            // delete userMetadata.kmClearbitData;
                            if(!$kmApplozic.isEmptyObject(userMetadata)){
                                $kmApplozic("#km-sidebar-user-info-wrapper").removeClass('n-vis').addClass('vis');
                                $kmApplozic.map( userMetadata, function( value, key ) {
                                    try{
                                        value= JSON.parse(userMetadata[key]);
                                        
                                    }catch(e){
                                    
                                    }
                                    if (typeof value == 'object') {
                                        switch (key) {
                                            case 'KM_PSEUDO_USER':
                                                if (!value.hidden || value.pseudoName && user.roleType === 3) {
                                                    $("#pseudo-name-icon").addClass("vis").removeClass("n-vis");
                                                }
                                            break;
                                            case 'kmClearbitData':
                                                displayCustInfo(value);
                                            break;
                                    } 
                                    
                                       
                                    }else if (typeof  value =='string'){
                                        $kmApplozic("#km-user-info-metadata-wrapper").append('<p class="km-user-info-metadata"><span class="km-user-info-meatadata-key">'+key+'</span>' + " : " +'<span class="km-user-info-meatadata-value">'+value+'</span></p>');
                                    }
                                    
                                });

                            }
                        }

                        $("#km-user-name-sec .km-user-title").html(user.userName);
                        if (user.email) {
                            $("#km-user-info-list .email").html(user.email);                       
                        } else {
                            $("#km-user-info-list .email").html(user.userId);
                        }
                        //$("#km-user-info-icon-box .km-user-icon img").attr('src', contact.imageLink);
                        var imageLink = $kmApplozic.fn.applozic("getContactImage", user);
                        imageLink=imageLink.replace('km-alpha-contact-image','km-alpha-group-contact-image').replace('km-contact-icon','km-group-contact-icon');
                        $("#km-group-info-tab .km-group-contact-icon").html(imageLink);
                        $kmApplozic("#km-sidebar-display-name").html(user.displayName || user.userId)
                        $kmApplozic("#km-sidebar-user-email").html(user.email)
                        if (typeof user.email !== "undefined" && user.metadata && !user.metadata.kmClearbitData) {
                            userSession.clearbitKey && clearbit(user.email, user.userId);
                           
                        }
                    }
                }
        });
    }

	$(".side-nav li a").click(function() {
		var $this = $(this);
        if ($this.parent().hasClass('active')) {
            return;
        }
        var tab = $this.data('tab');
        $(".side-nav li").removeClass('active');
        $this.parent().addClass('active');
        $(".tabs").removeClass('show').addClass('hide');
        $("#tab-" + tab).removeClass('hide').addClass('show');
	});

});

function resetCustomerInfoArea(){
    $("#km-user-info-list .km-clearbit-field").html('');
    $("#km-user-info-list .km-cl-icon-wrapper").addClass('n-vis');
    $("#km-user-info-list .km-clearbit-logo-wrapper").addClass('n-vis');
    $("#km-user-info-list .km-clearbit-divider").addClass('n-vis');
    $("#km-user-info-list .km-clearbit-link").attr('href', '');
    $("#km-sidebar-user-info-wrapper").removeClass('vis').addClass('n-vis');
    $("#km-user-info-metadata-wrapper").children('p').remove();

}

