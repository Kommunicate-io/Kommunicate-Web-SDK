window.applozic = window.kommunicate || {};
//var MCK_CONTEXTPATH = "${pageContext.request.scheme}://${pageContext.request.serverName}:${pageContext.request.serverPort}${contextPath}";
//var MCK_STATICPATH = "${pluginStaticPath}";
var MCK_CONTEXTPATH = ":MCK_CONTEXTPATH";
var MCK_STATICPATH =":MCK_STATICPATH";
var MCK_ONINIT = "";
var KM_PLUGIN_SETTINGS=JSON.parse(':PLUGIN_SETTINGS');
var MCK_PLUGIN_VERSION = ":MCK_PLUGIN_VERSION";
var MCK_THIRD_PARTY_INTEGRATION =JSON.parse(':MCK_THIRD_PARTY_INTEGRATION');
//window.applozic.PRODUCT_ID= "${productId}"?"${productId}":"applozic-chat";
window.applozic.PRODUCT_ID =":PRODUCT_ID";
// $.getScript(MCK_STATICPATH + '/sidebox/js/app/mck-app.js');
var options={};
var options = applozic._globals;
options.isAnonymousChat =options.isAnonymousChat;
options.KM_VER = MCK_PLUGIN_VERSION; 
if (typeof options !== 'undefined') {
  MCK_ONINIT = options.onInit;
}
window.addEventListener('error', function(e) {
  let sentryConfig = MCK_THIRD_PARTY_INTEGRATION.sentry.plugin;
  sentryConfig.enable && typeof Sentry != "undefined" && Sentry.withScope(function (scope) {
    scope.setTag("applicationId", options.appId);
    scope.setTag("userId", options.userId);
    scope.setUser({
      id: options.appId
    });
    Sentry.captureException(e);
  });
  if (typeof(e.target.src) !== 'undefined' && e.target.src.indexOf('sidebox') !== -1 && typeof MCK_ONINIT === 'function') {
    console.log("Plugin loading error. Refresh page.");
    MCK_ONINIT("error");
  }
}, true);
var imported = document.createElement('script');
imported.src = MCK_APP_JS;
imported.crossOrigin = "anonymous";
document.head.appendChild(imported);
addFullviewImageModal();

function addFullviewImageModal () {
  var modalHtml =
    '<span id="km-fullscreen-image-modal-close" class="km-fullscreen-image-modal-close">&times;</span>' +
    '<img class="km-fullscreen-image-modal-content" id="km-fullscreen-image-modal-content">' +
    '<div id="km-fullscreen-image-modal-caption"></div>';

  var addFullviewImageModalCss = 
          /* The Modal (background) */
          '.km-fullscreen-image-modal {' +
          ' display: none; ' + /* Hidden by default */
          ' position: fixed;' + /* Stay in place */
          ' z-index: 100000000;' + /* Sit on top */
          ' padding-top: 100px;' + /* Location of the box */
          ' left: 0;' +
          ' top: 0;' +
          ' width: 100%;' + /* Full width */
          ' height: 100%;' + /* Full height */
          ' overflow: auto;' + /* Enable scroll if needed */
          ' background-color: rgb(0,0,0);' + /* Fallback color */
          ' background-color: rgba(0,0,0,0.9);' + /* Black w/ opacity */
          '}  \n ' +

          /* Modal Content (image) */
          '.km-fullscreen-image-modal-content {' +
          ' margin: auto;' +
          ' display: block;' +
          ' width: 80%;' +
          ' max-width: 700px;' +
          '}  \n ' +

          /* Caption of Modal Image */
          '#km-fullscreen-image-modal-caption {' +
          ' margin: auto;' +
          ' display: block;' +
          ' width: 80%;' +
          ' max-width: 700px;' +
          ' text-align: center;' +
          ' color: #ccc;' +
          ' padding: 10px 0;' +
          ' height: 150px;' +
          '}  \n ' +

          /* Add Animation */
          '.km-fullscreen-image-modal-content, #caption {' +
          ' -webkit-animation-name: zoom;' +
          ' -webkit-animation-duration: 0.6s;' +
          ' animation-name: zoom;' +
          ' animation-duration: 0.6s;' +
          '}  \n ' +

          '@-webkit-keyframes zoom {' +
          ' from {-webkit-transform:scale(0)}' +
          ' to {-webkit-transform:scale(1)}' +
          '}  \n ' +

          '@keyframes zoom {' +
          ' from {transform:scale(0)}' +
          ' to {transform:scale(1)}' +
          '}  \n ' +

          /* The Close Button */
          '.km-fullscreen-image-modal-close {' +
          ' position: absolute;' +
          ' top: 15px;' +
          ' right: 35px;' +
          ' color: #f1f1f1;' +
          ' font-size: 40px;' +
          ' font-weight: bold;' +
          ' transition: 0.3s;' +
          '}  \n ' +

          '.km-fullscreen-image-modal-close:hover,.km-fullscreen-image-modal-close:focus {' +
          '  color: #bbb;' +
          '  text-decoration: none;' +
          '  cursor: pointer;' +
          '}  \n ' +

          /* 100% Image Width on Smaller Screens */
          '@media only screen and (max-width: 700px){' +
          ' .km-fullscreen-image-modal-content {' +
          '   width: 100%;' +
          ' }' +
          '}  \n ';

      // Append HTML of image fullview viewer modal to body of html page
      var fullscreenModal = parent.document.createElement('div');
      fullscreenModal.setAttribute("id", "km-fullscreen-image-modal");
      fullscreenModal.setAttribute("class", "km-fullscreen-image-modal");
      fullscreenModal.innerHTML = modalHtml;
      parent.document.body.appendChild(fullscreenModal);

       // Append CSS of image fullview viewer modal to body of html page
      var style = parent.document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = addFullviewImageModalCss;
      parent.document.getElementsByTagName('head')[0].appendChild(style);

}