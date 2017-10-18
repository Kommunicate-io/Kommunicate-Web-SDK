$(document).ready(function() {

    $("#login-modal").mckModal('show');

    $(".mck-group-search").on('click', function(e) {
        $("#mck-customers-cell-link").trigger('click');
    });

    $("#mck-user-info-close").on('click', function(e) {
        e.preventDefault();
        $applozic("#mck-user-info-tab").removeClass('vis').addClass('n-vis');
        $applozic(".mck-container").removeClass('mck-panel-3');
        $applozic('.emoji-menu').removeClass('mck-panel-3');
        $applozic('body').removeClass('mck-panel-3');
    });

    $("#kommunicate-panel-tabs li a").on('click', function(e) {
        var $this = $(this);
        $("#kommunicate-panel-tabs li").toggleClass('active');
        $("#kommunicate-panel-body .mck-panel-cell").removeClass('vis').addClass('n-vis');
        $("#" + $this.data('tab')).removeClass('n-vis').addClass('vis');

        if ($this.data('tab') == "mck-customers-cell") {
            $(".mck-contact-search").trigger('click');
        }
    });

    $(document).on('click', '#mck-new-group', function(event) {
        $('.mck-user-info-tab').removeClass("vis").addClass('n-vis');
    });

    $(document).on('click', '.mck-group-member-list li, #mck-tab-info-individual', function (event) {
        $('.mck-group-info-tab').removeClass("vis").addClass('n-vis');
        if ($('.mck-user-info-tab').hasClass('n-vis')) {
          $applozic('body').removeClass('mck-panel-3').addClass('mck-panel-3');
          $applozic('.emoji-menu').removeClass('mck-panel-3').addClass('mck-panel-3');
          $applozic(".mck-container").removeClass('mck-panel-3').addClass('mck-panel-3');
        } else {
          $applozic('body').removeClass('mck-panel-3');
          $applozic('.emoji-menu').removeClass('mck-panel-3');
          $applozic(".mck-container").removeClass('mck-panel-3');
        }

        $('.mck-user-info-tab').toggleClass("n-vis").toggleClass('vis');

        $("#mck-user-name-sec .mck-user-title").html("");
        $("#mck-user-info-list .email").html("");
        $("#mck-user-info-icon-box .mck-user-icon img").attr('src', "");

        var contactId = $(this).data('mck-id');
        if (typeof contactId == "undefined" || typeof contactId == "") {
            contactId = $("#mck-msg-to").val();
        }
        $applozic.fn.applozic("getContactDetail", {"userId": contactId, callback: function(user) {
                    console.log(user);
                    if (typeof user !== "undefined") {
                        $("#mck-user-name-sec .mck-user-title").html(user.userName);
                        $("#mck-user-info-list .email").html(user.email);
                        //$("#mck-user-info-icon-box .mck-user-icon img").attr('src', contact.imageLink);
                        var imageLink = $applozic.fn.applozic("getContactImage", user);
                        $("#mck-user-info-icon-box .mck-user-icon").html(imageLink);

                        if (typeof user.email !== "undefined") {
                            clearbit(user.email);
                        }
                    }
                }
            });
    });

	$(".side-nav li a").click(function() {
		var $this = $(this);
        if ($this.parent().hasClass('active')) {
            return;
        }
        var tab = $this.data('tab');
        console.log(tab);
        $(".side-nav li").removeClass('active');
        $this.parent().addClass('active');
        $(".tabs").removeClass('show').addClass('hide');
        $("#tab-" + tab).removeClass('hide').addClass('show');
	});

});

function clearbit(email) {
    //Authorization: Bearer sk_8235cd13e90bd6b84260902b98c64aba
    //https://person-stream.clearbit.com/v2/combined/find?email=alex@alexmaccaw.com

    //sk_1c765b25f7e53c661ae995b148cb7863
    //sk_6aadb3d2a8cb824acc0334f7da36c2ee

    $("#mck-user-info-list .bio, #mck-user-info-list .title, #mck-user-info-list .domain").html("");
    $("#mck-user-info-list .linkedin").attr("href", "");

    $.ajax({
        url: 'https://person-stream.clearbit.com/v2/combined/find?email=' + email,
        type: 'GET',
        headers: {
            "Authorization":"Bearer sk_6aadb3d2a8cb824acc0334f7da36c2ee"
        },
        success: function(response) {
            console.log(response);
            var person = response.person;
            var company = response.company;
            var info = "";
            if (typeof person !== "undefined" && person != null && person != "null") {
                info = person.bio + " " + person.location;
                $("#mck-user-info-list .bio").html(person.bio + " " + person.location);
                var employment = person.employment;
                if (typeof employment !== "undefined" && employment != null && employment != "null") {
                    info = info + " " + person.employment.title;
                    $("#mck-user-info-list .title").html(person.employment.title);
                }
                var linkedin = person.linkedin;
                if (typeof linkedin !== "undefined" && linkedin != null && linkedin != "null") {
                    info = info + " " + linkedin.handle;
                    $("#mck-user-info-list .linkedin").attr('href','https://linkedin.com/' + linkedin.handle);
                }
            }
            if (typeof company !== "undefined" && company != null && company != "null") {
                info = info + " " + company.domain;
                $("#mck-user-info-list .domain").attr('href', company.domain);
            }
            console.log(info);
        }
    });

}
