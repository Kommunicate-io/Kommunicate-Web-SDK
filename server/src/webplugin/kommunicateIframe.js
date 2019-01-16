var MCK_CONTEXTPATH = ":MCK_CONTEXTPATH";
// iframe class
var kmCustomIframe =   
    '.kommunicate-custom-iframe { ' +
    '   max-height: calc(100% - 30px)!important;' +
    '   border: none;' +
    '   position: fixed;' +
    '   z-index: 2243000;' +
    '   bottom: 30px;' +
    '   right: 30px;' +
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
    ' } \n';

createCustomClasses(kmCustomIframe);              
// Add class to document

function createCustomClasses(classSettings) {
    // Create custom classes 
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = classSettings;
    document.getElementsByTagName('head')[0].appendChild(style);
};

function addKommunicatePluginToIframe() {
    // Add kommunicate plugin in iframe
    var kommunicateIframe = window.document.getElementById("kommunicate-widget-iframe");
    var iframeDocument = kommunicateIframe.contentDocument || kommunicateIframe.contentWindow.document;
    var kommunicateScript = iframeDocument.createElement("script");
    kommunicateScript.type = "text/javascript";
    kommunicateScript.async = true;
    kommunicateScript.src = MCK_CONTEXTPATH + "/kommunicate.app?version=v2";
    iframeDocument.body.appendChild(kommunicateScript);
};

// Create element iframe for kommunicate widget
var kommunicateIframe = document.createElement("iframe");
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
