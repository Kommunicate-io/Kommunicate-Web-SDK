$(document).ready(function(){
    var $kmSignupUserId = $("#km-signup-userId"),
        $kmSignupUserPassword = $("#km-signup-userPassword"),
        $kmSignupForm = $("#km-signup-form"),
        $kmSignupSubmitBtn = $("#km-signup-form-submit"),
        $kmErrorMessage1 = $("#km-form-error1"),
        $kmErrorMessage2 = $("#km-form-error2"),
        $kmLoginNextBtn = $("#km-login-next-btn"),
        $kmLoginPassNextBtn = $("#km-login-pass-next-btn"),
        $kmLoginBackBtn = $("#km-login-back-btn"),
        $kmForgotPassBtn = $("#km-forgot-pass-btn"),
        $queryString = 'test',
        $currentUrl = window.location.href,
        $DashboardApiUrl, $DashboardApplozicApiUrl, $DashboardUrl,
        // $mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        $mailformat = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,10}$/;
    
        if($currentUrl.indexOf($queryString) != -1) {
            $DashboardApiUrl = "https://api-test.kommunicate.io";
            $DashboardApplozicApiUrl = "https://apps-test.applozic.com";
            $DashboardUrl = "https://dashboard-test.kommunicate.com";
        } else {
            $DashboardApiUrl = "https://api.kommunicate.io";
            $DashboardApplozicApiUrl = "https://chat.kommunicate.io";
            $DashboardUrl = "https://dashboard.kommunicate.io";
        }
    

/* ***** Signup Form AJAX Call ***** */
        $kmSignupForm.submit(function(e) {
//            $kmSignupSubmitBtn.attr('disabled', true);
            
            var user = new Object();
            user.userName = $("#km-signup-userId").val();
            user.password = $("#km-signup-userPassword").val();
            
            var userCreate = $.ajax({
               url: $DashboardApiUrl + "/customers",
                // url: "https://api-test.kommunicate.io/customers",
                type: "post",
                contentType: "application/json",
                data: JSON.stringify(user),
                
                success: function(data) {
                    if(data.code == "SUCCESS") {
                        console.log("SUCCESS", data);
                        window.location = $DashboardUrl + "/setUpPage";
                    } else if(data.code == "USER_ALREADY_EXISTS") {
                        console.log("User Already Exist", data);
                        $kmErrorMessage1.html("User already exist. Please login.");
                        $kmErrorMessage1.removeClass('hidden-vis').addClass('shown-vis');
                    } else {
                        
                    }
                },
                error: function(data) {
                    // console.log("Unable to Process your request at the moment", data);
                    $kmErrorMessage1.html("Unable to process your request. Please try again later.");
                    $kmErrorMessage1.removeClass('hidden-vis').addClass('shown-vis');
                }
            });
            return false;
        });
    
/* ******* Login Form AJAX Call ******** */
        $kmLoginNextBtn.click(function() {
            
              if($("#km-login-userId").val() == "") {
                $kmErrorMessage1.html("Email Id is required. <br><br>").removeClass('hidden-vis').addClass('shown-vis');
                window.setTimeout("$('#km-form-error1').removeClass('shown-vis').addClass('hidden-vis')", 3000);
              } else if(!$("#km-login-userId").val().match($mailformat)) {
                $kmErrorMessage1.html("Please enter a valid email address. <br><br>").removeClass('hidden-vis').addClass('shown-vis');
                window.setTimeout("$('#km-form-error1').removeClass('shown-vis').addClass('hidden-vis')", 3000);
              }  else {
                var loginId = $("#km-login-userId").val().replace('@', '%40').replace('+', '%2B');
                var loginIdOriginal = $("#km-login-userId").val();           
            // console.log(loginId);
            // console.log(loginIdOriginal);

            var userLogin = $.ajax({
                url: $DashboardApplozicApiUrl + "/rest/ws/user/getlist?userId=" + loginId +"&roleNameList=APPLICATION_WEB_ADMIN",
                type: "get",
                contentType: "application/json",
                success: function(data) {
                    var numOfApp=Object.keys(data).length;
                        // console.log(numOfApp);
                        var applicationIds=Object.keys(data)[0];
                        // console.log(applicationIds);

                    if(numOfApp < 1) {
                        // console.log("User not found", data);
                        $kmErrorMessage1.html("User not found. Please Sign Up.<br><br>");
                        $kmErrorMessage1.removeClass('hidden-vis').addClass('shown-vis');
                        window.setTimeout("$('#km-form-error1').removeClass('shown-vis').addClass('hidden-vis')", 3000);

                    } else if(numOfApp === 1) {
                        // console.log("User Found", data);  
                        $(".km-login-div .signup-heading").html("Password");
                        $(".km-login-div .signup-sub-heading").html("Enter password to continue");
                        $(".password-form-group").removeClass('hide').addClass('show');
                        $(".email-form-group").addClass('hide').removeClass('show');
                        $kmLoginBackBtn.addClass('show').removeClass('hide');
                        $kmLoginNextBtn.addClass('hide').removeClass('show');
                        $kmLoginPassNextBtn.addClass('show').removeClass('hide');
                        $("#km-login-userPassword").focus();
                        $(".forgot-password-link").addClass('show').removeClass('hide');
                        
                        $kmLoginBackBtn.click(function() {
                            $(".password-form-group").removeClass('show').addClass('hide');
                            $(".email-form-group").addClass('show').removeClass('hide');
                            $(".km-login-div .signup-heading").html("Login");
                            $(".km-login-div .signup-sub-heading").html("Sign in to your account");
                            $kmLoginBackBtn.addClass('hide').removeClass('show');
                            $kmLoginNextBtn.addClass('show').removeClass('hide');
                            $kmLoginPassNextBtn.addClass('hide').removeClass('show');
                            $(".forgot-password-link").addClass('hide').removeClass('show');
                            $("#km-login-userId").focus();
                            $("#km-login-userId").val("");
                            
                        });

                        $kmLoginPassNextBtn.click(function() {

                            if($("#km-login-userPassword").val() == "") {
                                $kmErrorMessage1.html("Password is required. <br><br>").removeClass('hidden-vis').addClass('shown-vis');
                                window.setTimeout("$('#km-form-error1').removeClass('shown-vis').addClass('hidden-vis')", 3000);
                            } else if($("#km-login-userPassword").length < 6) {
                                $kmErrorMessage1.html("Password must be minimum of 6 characters. <br><br>").removeClass('hidden-vis').addClass('shown-vis');
                                window.setTimeout("$('#km-form-error1').removeClass('shown-vis').addClass('hidden-vis')", 3000);
                            } else {
                            // console.log("Password's Next Button Clicked.");
                            var $loginUserPassword = $("#km-login-userPassword").val();
                            var loginUserDetails = new Object();
                            loginUserDetails.userName = loginIdOriginal;
                            loginUserDetails.password = $loginUserPassword;
                            loginUserDetails.applicationId = applicationIds;
                            
                            var userLogins = $.ajax({
                                url: $DashboardApiUrl + "/login",
                                type: "post",
                                contentType: "application/json",
                                data: JSON.stringify(loginUserDetails),
                                success: function(data) {
                                    if(data.code == "INVALID_CREDENTIALS") {
                                        // console.log(data, data.code);
                                        $kmErrorMessage1.html("Entered password is incorrect.<br><br>");
                                        $kmErrorMessage1.removeClass('hidden-vis').addClass('shown-vis');
                                    } else {
                                        $kmLoginPassNextBtn.attr('disabled', true);
                                        // console.log("Login Successful", data);
                                        window.location = $DashboardUrl + "/dashboard";
                                    }
                                },
                                error: function(data) {
                                    // console.log(data);
                                    $kmErrorMessage1.html("Unable to process your request please try again later.");
                                        $kmErrorMessage1.removeClass('hidden-vis').addClass('shown-vis');
                                }
                            });
                        }
                        });
                    }
                },
                error: function(data) {
                    // console.log("Unable to Process your request at the moment", data);
                    $kmErrorMessage1.html("Unable to process your request. Please try again later.");
                    $kmErrorMessage1.removeClass('hidden-vis').addClass('shown-vis');
                }
            });
        }
    });
    
    
    /* *********** Forgot Password AJAX Call *********** */
    $kmForgotPassBtn.click(function() {

        if($("#km-forgot-pass-userId").val() == "") {
            $kmErrorMessage2.html("Email Id is required. <br><br>").removeClass('hidden-vis').addClass('shown-vis');
            window.setTimeout("$('#km-form-error2').removeClass('shown-vis').addClass('hidden-vis')", 3000);
          } else if(!$("#km-forgot-pass-userId").val().match($mailformat)) {
            $kmErrorMessage2.html("Please enter a valid email address. <br><br>").removeClass('hidden-vis').addClass('shown-vis');
            window.setTimeout("$('#km-form-error2').removeClass('shown-vis').addClass('hidden-vis')", 3000);
          }  else {
            var loginId = $("#km-forgot-pass-userId").val().replace('@', '%40').replace('+', '%2B');
            var loginIdOriginal = $("#km-forgot-pass-userId").val();

        var forgotPassword = $.ajax({
            url: $DashboardApplozicApiUrl + "/rest/ws/user/getlist?userId=" + loginId +"&roleNameList=APPLICATION_WEB_ADMIN",
            type: "get",
            contentType: "application/json",
            success: function(data) {
                var numOfApp=Object.keys(data).length;
                console.log(numOfApp);
                var applicationIds=Object.keys(data)[0];
                console.log(applicationIds);

                if(numOfApp < 1) {
                    console.log("User not found", data);
                    $kmErrorMessage2.html("User not found. Please Sign Up.<br><br>");
                    $kmErrorMessage2.removeClass('hidden-vis').addClass('shown-vis');
                    window.setTimeout("$('#km-form-error2').removeClass('shown-vis').addClass('hidden-vis')", 3000);

                } else if(numOfApp === 1) {
                    var frgtPassObj = new Object();
                    frgtPassObj.userName = loginIdOriginal;
                    frgtPassObj.applicationId = applicationIds; 
                    var userLogins = $.ajax({
                        url: $DashboardApiUrl + "/users/password-reset",
                        type: "post",
                        contentType: "application/json",
                        data: JSON.stringify(frgtPassObj),
                        success: function(data) {
                            if(data.code == "SUCCESS") {
                                
                                console.log("Password Reset Link Sent Successfully", data);
                                $(".forgot-pass-form-group").addClass('hide').removeClass('show');
                                $("#frgt-successful-message-div").removeClass('hide').addClass('show');
                                $(".km-forgot-password-div .signup-heading").removeClass('show').addClass('hide');
                                $(".km-forgot-password-div .signup-sub-heading").removeClass('show').addClass('hide');
                                $(".forgot-button-form-group").removeClass('show').addClass('hide');
                                $kmErrorMessage2.removeClass('show').addClass('hide');
                            } else {
                                console.log(data.code, data);
                                $kmErrorMessage2.html("There is some problem with your request.<br><br>");
                                $kmErrorMessage2.removeClass('hidden-vis').addClass('shown-vis');
                            }
                        },
                        error: function(data) {
                            console.log(data);
                            $kmErrorMessage2.html("Unable to process your request please try again later.");
                            $kmErrorMessage2.removeClass('hidden-vis').addClass('shown-vis');
                        }
                    });
                }
            },
            error: function(data) {
                console.log(data);
                $kmErrorMessage2.html("Unable to process your request please try again later.");
                $kmErrorMessage2.removeClass('hidden-vis').addClass('shown-vis');
            }
            });
        }
    });
});
