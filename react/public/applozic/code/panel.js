$(document).ready(function() {

    $("#login-modal").mckModal('show');

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
        // // $('.km-group-info-tab').removeClass("vis").addClass('n-vis');
        // if ($('.km-user-info-tab').hasClass('n-vis')) {
        //   $kmApplozic('body').removeClass('km-panel-3').addClass('km-panel-3');
        //   $kmApplozic('.km-emoji-menu').removeClass('km-panel-3').addClass('km-panel-3');
        //   $kmApplozic(".km-container").removeClass('km-panel-3').addClass('km-panel-3');
        // } else {
        //   $kmApplozic('body').removeClass('km-panel-3');
        //   $kmApplozic('.km-emoji-menu').removeClass('km-panel-3');
        //   $kmApplozic(".km-container").removeClass('km-panel-3');
        // }

        // $('.km-user-info-tab').toggleClass("n-vis").toggleClass('vis');
        $("#km-user-name-sec .km-user-title").html("");
        $("#km-user-info-list .email").html("");
        $("#km-user-info-icon-box .km-user-icon img").attr('src', "");

        var contactId = $(this).data('km-id');
        if (typeof contactId == "undefined" || typeof contactId == "") {
            contactId = $("#km-msg-to").val();
        }
        getContactDetail(contactId)
        
    });

    function getContactDetail(contactId){

        $kmApplozic.fn.applozic("getContactDetail", {"userId": contactId, callback: function(user) {   
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
                        $("#km-sidebar-display-name").html(user.displayNAme || user.userId)
                        if (typeof user.email !== "undefined") {
                            if(user.metadata && user.metadata.kmClearbitData){
                                var clearbitData=JSON.parse(user.metadata.kmClearbitData)
                                displayCustInfo(clearbitData)
                            }else {
                            clearbit(user.email, user.userId);
                            //activeCampaign(user.email);
                            }
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
    // $("#km-user-info-list .bio, #km-user-info-list .title").html("");
    // $("#km-user-info-list .domain-url").attr("href", "");
    // $("#km-user-info-list .domain-url").text('');
    // $("#km-user-info-list .linkedin").attr("href", "");
    // $("#km-user-info-list .linkedin").text('');
    // $("#km-user-info-list .bio, #km-user-info-list .title, #km-user-info-list .domain, #km-user-info-list .profile-linkedin").addClass('n-vis');
    // $(".customli").remove();
    // $("#km-group-tab-title").attr('data-km-id',"");
    $("#km-user-info-list .km-clearbit-field").html('');
    $("#km-user-info-list .km-cl-icon-wrapper").addClass('n-vis');
    $("#km-user-info-list .km-clearbit-logo-wrapper").addClass('n-vis');
    $("#km-user-info-list .km-clearbit-divider").addClass('n-vis');
    $("#km-user-info-list .km-clearbit-link").attr('href', '');
}

// function clearbit(email, userId) {
//     //Authorization: Bearer sk_8235cd13e90bd6b84260902b98c64aba
//     //https://person-stream.clearbit.com/v2/combined/find?email=alex@alexmaccaw.com

//     //sk_1c765b25f7e53c661ae995b148cb7863
//     //sk_6aadb3d2a8cb824acc0334f7da36c2ee

//     $.ajax({
//         url: 'https://person-stream.clearbit.com/v2/combined/find?email=' + email,
//         type: 'GET',
//         headers: {
//             "Authorization": "Bearer sk_6aadb3d2a8cb824acc0334f7da36c2ee"
//         },
//         success: function (response) {
//             displayCustomerInfo(response)
//             var metadata = JSON.stringify(response);
//             var obj = JSON.parse(metadata)
//             var user = { 'userId': userId, 'metadata': { 'kmClearbitData': JSON.stringify(response) } }
//             window.Aside.updateApplozicUser(user);

//         }
//     });

// }

// function displayCustomerInfo(clearbitData) {
//     var person = clearbitData.person;
//     var company = clearbitData.company;
//     var info = "";
//     if (typeof person !== "undefined" && person != null && person != "null") {
//         info = person.bio + " " + person.location;
//         $("#km-user-info-list .bio").html(person.bio !== null ? person.bio : '' + " " + person.location !== null ? person.location : '');
//         $("#km-user-info-list .bio").removeClass('n-vis');
//         var employment = person.employment;
//         if (typeof employment !== "undefined" && employment != null && employment != "null") {
//             info = info + " " + person.employment.title;
//             $("#km-user-info-list .title").html(person.employment.title);
//             $("#km-user-info-list .title").removeClass('n-vis');
//         }
//         var linkedin = person.linkedin;
//         if (typeof linkedin !== "undefined" && linkedin != null && linkedin != "null") {
//             info = info + " " + linkedin.handle;
//             $("#km-user-info-list .linkedin").attr('href', 'https://linkedin.com/' + linkedin.handle);
//             $("#km-user-info-list .profile-linkedin").removeClass('n-vis');
//             $("#km-user-info-list .linkedin").text('https://linkedin.com/'+ linkedin.handle);
//         }
//     }
//     if (typeof company !== "undefined" && company != null && company != "null") {
//         info = info + " " + company.domain;
//         $("#km-user-info-list .domain").removeClass('n-vis');
//         $("#km-user-info-list .domain-url").attr('href', 'https://www.'+company.domain);
//         $("#km-user-info-list .domain-url").text('https://www.'+company.domain);
        
//     }
// }
