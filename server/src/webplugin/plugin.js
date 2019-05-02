var MCK_CONTEXTPATH = ":MCK_CONTEXTPATH";
var MCK_STATICPATH = ":MCK_STATICPATH";
var MCK_ONINIT = "";
var KM_PLUGIN_SETTINGS = JSON.parse(':PLUGIN_SETTINGS');
var MCK_PLUGIN_VERSION = ":MCK_PLUGIN_VERSION";
var MCK_THIRD_PARTY_INTEGRATION = JSON.parse(':MCK_THIRD_PARTY_INTEGRATION');
var PRODUCT_ID = ":PRODUCT_ID";


// iframe class
var kmCustomIframe =   
    '.kommunicate-custom-iframe { ' +
    '   max-height: calc(100% - 30px)!important;' +
    '   border: none;' +
    '   position: fixed;' +
    '   z-index: 2243000;' +
    '   bottom: 10px;' +
    '   right: 20px;' +
    '   height: 75px;' +
    '   width: 75px;' +
    '} \n ' +
    '@media only screen and (max-width:600px) { .kommunicate-iframe-enable-media-query {' +
    '   right: 0px;' +
    '   bottom: 0px;' +
    '   top: 0;' +
    '   left: 0;' +
    '   border-radius: 0px;' +
    '   height: 100% !important;' +
    '   width: 100% !important;' +
    '   max-height: 100% !important;' +
    '} } \n' + 
    '.km-iframe-closed{ '+
    '    height: 75px; '+
    '    width:  75px; '+
    '    box-shadow: none!important; '+
    '}\n' + 
    '.km-iframe-notification{ '+
    '    height:80px; '+ 
    '} \n '+
    '.km-iframe-dimension-no-popup{' +
    '    height: 600px;' +
    '    width: 390px; ' +
    '    box-shadow: 0 1.5rem 2rem rgba(0,0,0,.3)' +
    '} \n ' +
    '.km-iframe-dimension-with-popup{ '+
    '    height: 700px; '+
    '    width: 442px; '+
    '} \n '

isV1Script() ? addKommunicatePluginToIframe() : appendIframe();

function appendIframe() {
  createKommunicateIframe();
  createCustomClasses(kmCustomIframe); // Add class to document
};

function isV1Script() {
  return MCK_PLUGIN_VERSION === "v1";
};

function createCustomClasses(classSettings) {
  // Create custom classes 
  var style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = classSettings;
  document.getElementsByTagName('head')[0].appendChild(style);
};

// Create element iframe for kommunicate widget
function createKommunicateIframe() {
  var kommunicateIframe = document.createElement("iframe");
  kommunicateIframe.setAttribute("style", "overflow:hidden;"); // to fix scrollbars appearing before the chat widget loads on slow connections
  kommunicateIframe.setAttribute("scrolling", "no"); // to fix scrollbars appearing before the chat widget loads on slow connections
  kommunicateIframe.setAttribute("id", "kommunicate-widget-iframe");
  kommunicateIframe.setAttribute("class", "kommunicate-custom-iframe");
  kommunicateIframe.setAttribute('data-protocol', window.location.protocol);
  kommunicateIframe.setAttribute('data-url', window.location.href);
  document.body.appendChild(kommunicateIframe);
  var iframeDocument = kommunicateIframe.contentDocument || kommunicateIframe.contentWindow.document;
  kommunicateIframe.contentWindow.kommunicate = window.kommunicate;

  if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
    // Do Firefox-related activities
    var testClick = window.document.getElementById("kommunicate-widget-iframe");
    testClick.onload = function () {
      addKommunicatePluginToIframe();
    };
  } else {
    window.setTimeout(function () {
      addKommunicatePluginToIframe();
    }, 500);
  }
};

function addKommunicatePluginToIframe() {
  // Add kommunicate plugin inside iframe
  var addableWindow, addableDocument;
  if (isV1Script()) {
    addableWindow = window;
    addableDocument = document;
  } else {
    var kommunicateIframe = window.document.getElementById("kommunicate-widget-iframe");
    var iframeDocument = kommunicateIframe.contentDocument || kommunicateIframe.contentWindow.document;
    addableWindow = kommunicateIframe.contentWindow;
    addableDocument = iframeDocument;
  }

  addableWindow.applozic = (isV1Script() ? addableWindow.kommunicate : kommunicateIframe.contentWindow.kommunicate) || {};
  addableWindow.MCK_CONTEXTPATH = MCK_CONTEXTPATH;
  addableWindow.MCK_STATICPATH = MCK_STATICPATH;
  addableWindow.MCK_ONINIT = "";
  addableWindow.KM_PLUGIN_SETTINGS = KM_PLUGIN_SETTINGS;
  addableWindow.MCK_PLUGIN_VERSION = MCK_PLUGIN_VERSION;
  addableWindow.MCK_THIRD_PARTY_INTEGRATION = MCK_THIRD_PARTY_INTEGRATION;
  addableWindow.applozic.PRODUCT_ID = PRODUCT_ID;
  var options = {};
  var options = addableWindow.applozic._globals;
  options.isAnonymousChat = options.isAnonymousChat;
  options.KM_VER = MCK_PLUGIN_VERSION;
  if (typeof options !== 'undefined') {
    addableWindow.MCK_ONINIT = options.onInit;
  }
  addableWindow.addEventListener('error', function (e) {
    let sentryConfig = MCK_THIRD_PARTY_INTEGRATION.sentry.plugin;
    sentryConfig.enable && typeof Sentry != "undefined" && Sentry.withScope(function (scope) {
      scope.setTag("applicationId", options.appId);
      scope.setTag("userId", options.userId);
      scope.setUser({
        id: options.appId
      });
      Sentry.captureException(e);
    });
    if (typeof (e.target.src) !== 'undefined' && e.target.src.indexOf('sidebox') !== -1 && typeof MCK_ONINIT === 'function') {
      console.log("Plugin loading error. Refresh page.");
      MCK_ONINIT("error");
    }
  }, true);
  var imported = addableDocument.createElement('script');
  imported.src = MCK_APP_JS;
  imported.crossOrigin = "anonymous";
  addableDocument.head.appendChild(imported);
  addFullviewImageModal();
};

/*
                            <!-- ======================================= -->
                            <!-- |       New image full view modal     | -->
                            <!-- ======================================= -->
*/

//<----------------------------CODE BEGINS HERE---------------------------->
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

};
//<----------------------------CODE ENDS HERE---------------------------->