/*!
* classie - class helper functions
* from bonzo https://github.com/ded/bonzo
*
* classie.has( elem, 'my-class' ) -> true/false
* classie.add( elem, 'my-new-class' )
* classie.remove( elem, 'my-unwanted-class' )
* classie.toggle( elem, 'my-class' )
*/

/*jshint browser: true, strict: true, undef: true */
/*global define: false */

( function( window ) {

'use strict';

// class helper functions from bonzo https://github.com/ded/bonzo

function classReg( className ) {
return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
}

// classList support for class management
// altho to be fair, the api sucks because it won't accept multiple classes at once
var hasClass, addClass, removeClass;

if ( 'classList' in document.documentElement ) {
hasClass = function( elem, c ) {
return elem.classList.contains( c );
};
addClass = function( elem, c ) {
elem.classList.add( c );
};
removeClass = function( elem, c ) {
elem.classList.remove( c );
};
}
else {
hasClass = function( elem, c ) {
return classReg( c ).test( elem.className );
};
addClass = function( elem, c ) {
if ( !hasClass( elem, c ) ) {
  elem.className = elem.className + ' ' + c;
}
};
removeClass = function( elem, c ) {
elem.className = elem.className.replace( classReg( c ), ' ' );
};
}

function toggleClass( elem, c ) {
var fn = hasClass( elem, c ) ? removeClass : addClass;
fn( elem, c );
}

var classie = {
// full names
hasClass: hasClass,
addClass: addClass,
removeClass: removeClass,
toggleClass: toggleClass,
// short names
has: hasClass,
add: addClass,
remove: removeClass,
toggle: toggleClass
};

// transport
if ( typeof define === 'function' && define.amd ) {
// AMD
define( classie );
} else {
// browser global
window.classie = classie;
}

})( window );

(function() {
      // trim polyfill : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
      if (!String.prototype.trim) {
        (function() {
          // Make sure we trim BOM and NBSP
          var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
          String.prototype.trim = function() {
            return this.replace(rtrim, '');
          };
        })();
      }

      [].slice.call( document.querySelectorAll( 'input.input__field' ) ).forEach( function( inputEl ) {
        // in case the input is already filled..
        if( inputEl.value.trim() !== '' ) {
          classie.add( inputEl.parentNode, 'input--filled' );
        }

        // events:
        inputEl.addEventListener( 'focus', onInputFocus );
        inputEl.addEventListener( 'blur', onInputBlur );
      } );

      function onInputFocus( ev ) {
        classie.add( ev.target.parentNode, 'input--filled' );
      }

      function onInputBlur( ev ) {
        if( ev.target.value.trim() === '' ) {
          classie.remove( ev.target.parentNode, 'input--filled' );
        }
      }
    })();

$(document).ready(function(){
  //SignUp Form Variables
    var $userNameRegister = $("#userNameRegister"),
      $userPasswordRegister = $("#userPasswordRegister"),
      $userIdRegister = $("#userIdRegister"),
      $registerSubmit = $("#register-submit"),
      $register_form = $("#signup-form"),
      $response_error_signup2 = $("#error-message-div-signup2"),
      //SignIn Form Variables
      $userIdSignin = $("#userIdSignin"),
      $userPasswordSignin = $("#userPasswordSignin"),
      $signinSubmit = $("#signin-submit"),
      $signin_form = $("#signin-form"),
      $response_error_signin = $("#error-message-div-signin"),
      $response_error_signin2 = $("#error-message-div-signin2"),
      //Forgot Password Form Variables
      $userIdForgotPassword = $("#userIdForgotPassword"),
      $forgetPasswordSubmit = $("#forgot-password-submit"),
      $forgotPassword_form = $("#forgot-password-form"),
      $response_frgtPass = $("#success-message-div-forgotpass"),
      $response_error_frgtPass = $("#error-message-div-forgotpass"),
      $response_error_frgtPass2 = $("#error-message-div-forgotpass2"),
      $setup_response = $("#setup-response"),
      $setup_spinner = $("#setup-spinner");
     $("#userRegisterAppId").val(window.location.href.split("appId/")[1]);
      var appId = $("#userRegisterAppId").val();
      console.log(appId);
    //Signup Form AJAX Call
    $register_form.submit(function(e) {
      $registerSubmit.attr('disabled', true);
      $registerSubmit.html('Submitting..');

      var user = new Object();
      user.userName = $("#userNameRegister").val();
      user.userId = $("#userIdRegister").val();
      user.password = $("#userPasswordRegister").val();
      user.applicationId = 'applozic2de64d50463586b9568467a1df9d21102';
      user.authenticationTypeId = 1;
      var inviteduser =new Object();
      inviteduser.userName = user.userName;
      inviteduser.applicationId = appId;
      inviteduser.email = user.userId;
      inviteduser.password = user.password;
      inviteduser.type = 1
      if(appId){
      var usercreate =$.ajax({
        contentType: "application/json",
        dataType: "json",
        url: "http://api-test.kommunicate.io/users",
        method: "POST",
        data: JSON.stringify(inviteduser),
        success: function(data) {
        console.log("success");
        localStorage.setItem("applicationId", applicationKey);
        window.location = "http://dashboard-test.kommunicate.io/#/dashboard";
        }
          });
        } else {
      var request = $.ajax({
        contentType: "application/json",
        dataType: "json",
        url: "https://apps-test.applozic.com/rest/ws/register/client",
        method: "POST",
        data: JSON.stringify(user),
        success: function(data) {
          $registerSubmit.attr('disabled', false);
          $registerSubmit.html('Submit');
          if (data.message != "PASSWORD_INVALID") {
            $register_form[0].reset();
// Checking if the user is registering for the first time
            if (data.message === "REGISTERED.WITHOUTREGISTRATIONID") {
              // console.log(data.message);
            var registeredSuccessfully = $.ajax({
              contentType: "application/json",
              dataType: "json",
              url: "https://apps-test.applozic.com/rest/ws/application/add",
              method: "POST",
              data: JSON.stringify({
                "name": user.userId
              }),
              headers: {
                "Apz-Token": "Basic c3VyYWpAYXBwbG96aWMuY29tOjEyMzQ1Njc4OTA="
              },
              success: function(data) {
                if (data.status != "error") {
                  // console.log(data);
                  // var data1 = data.data1;
                  var applicationKey = data.applicationId;
                  // console.log(applicationKey);
                  localStorage.setItem("applicationId", applicationKey);
                  window.location = "http://dashboard-test.kommunicate.io/#/dashboard";
                }
                // else {
                //   $("#error-message-div").removeClass('hide').addClass('show');
                // }
              },
              error: function(data, status) {
                console.log(data, status);
              }
            });
          }
          // checking if user already exist in the database
          else if (data.message === "UPDATED") {
            $("#error-message-div").removeClass('hide').addClass('show');
          }
          } else {
            console.log("There was an error registering", data.message, data);
          }
        },
        error: function(data, status) {

          // console.log(data);
          $response_error_signup2.removeClass('hide').addClass('show');
        }
      });
    }
      return false;
    });

    //Login Form AJAX Call
    $signin_form.submit(function(e) {
      $signinSubmit.attr('disabled', true);
      $signinSubmit.html('Submitting..');

      var user = new Object();
      // user.userName = $("#userIdSignin").val();
      user.userId = $("#userIdSignin").val();
      user.password = $("#userPasswordSignin").val();
      user.applicationId = 'applozic2de64d50463586b9568467a1df9d21102';
      user.authenticationTypeId = 1;

      // console.log("UserId before AJAX call", user.userId);

      var request = $.ajax({
        contentType: "application/json",
        dataType: "json",
        url: "https://apps-test.applozic.com/rest/ws/register/client",
        type: "post",
        data: JSON.stringify(user),
        success: function(data, status) {
          // console.log(data);
          $signinSubmit.attr('disabled', false);
          $signinSubmit.html('Sign in');

          if (data.message === "REGISTERED.WITHOUTREGISTRATIONID") {
            var signupRequest = $.ajax({
              contentType: "application/json",
              dataType: "json",
              url: "https://apps-test.applozic.com/rest/ws/register/client",
              method: "POST",
              data: JSON.stringify(user),
              success: function(data) {
                $registerSubmit.attr('disabled', false);
                $registerSubmit.html('Submit');
                if (data.message != "PASSWORD_INVALID") {
                  $signin_form[0].reset();
                  // console.log("User Registered Successfully");
                  // console.log(user);
                  // console.log("userId",user.userId);
                  var registeredSuccessfully = $.ajax({
                    contentType: "application/json",
                    dataType: "json",
                    url: "https://apps-test.applozic.com/rest/ws/application/add",
                    method: "POST",
                    data: JSON.stringify({
                      "name": user.userId
                    }),
                    headers: {
                      "Apz-Token": "Basic c3VyYWpAYXBwbG96aWMuY29tOjEyMzQ1Njc4OTA="
                    },
                    success: function(data) {
                        // console.log("inside success",data);
                      if (data.status != "error") {
                        // console.log("inside success if",data);
                        // var data1 = data.data1;
                        var applicationKey = data.applicationId;

                        localStorage.setItem("applicationId", applicationKey);
                        window.location = "http://dashboard-test.kommunicate.io/#/dashboard";
                      } else {
                        $("#error-message-div").removeClass('hide').addClass('show');
                      }
                    },
                    error: function(data, status) {
                      console.log(data, status);
                    }
                  });
                } else {

                  console.log("There was an error registering", data.message, data);
                }
              },
              error: function(data, status) {

                // console.log(data);
                $response_error_signin.removeClass('hide').addClass('show');
              }
            });

          } else if (data.message === "PASSWORD_INVALID") {
            $("#error-message-div-signin").removeClass('hide').addClass('show');

          } else if (data.message === "UPDATED") {
            var data1 = data.data1;
            var applicationKey = data.applicationId;
            localStorage.setItem("applicationId", applicationKey);
            location.assign("http://dashboard-test.kommunicate.io/#/dashboard");
          }
        },
        error: function(data, status) {
          // console.log(data, status);
          $response_error_signin.removeClass('hide').addClass('show');
        }
      });
      return false;
    });

    //Forgot Password AJAX Call
    $forgotPassword_form.submit(function (e) {
      $forgetPasswordSubmit.attr('disabled', true);
      $forgetPasswordSubmit.html('Submitting...');

     var userId = $("#userIdForgotPassword").val();

      var request = $.ajax({
          url: "https://apps-test.applozic.com/frgt/password.page?frgtPassId="+userId,
          type: "post",
          success: function (data) {
              $forgetPasswordSubmit.attr('disabled', false);
              $forgetPasswordSubmit.html('Submit');
              if (data === "success") {
                // console.log("Success If condition");
                  $response_frgtPass.removeClass('hide').addClass('show');
                  $forgotPassword_form.addClass('hide');

              } else {
                // console.log("Else condition");
                  $response_error_frgtPass.removeClass('hide').addClass('show');

              }
          },
          error: function (data, status) {
            // console.log("Error AJAX", data, status);
              $forgetPasswordSubmit.attr('disabled', false);
              $forgetPasswordSubmit.html('Submit');
              $response_error_frgtPass2.removeClass('hide').addClass('show');
          }
      });
      return false;
  });
});
