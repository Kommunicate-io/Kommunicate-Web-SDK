window.applozic = window.kommunicate || {};
//var MCK_CONTEXTPATH = "${pageContext.request.scheme}://${pageContext.request.serverName}:${pageContext.request.serverPort}${contextPath}";
//var MCK_STATICPATH = "${pluginStaticPath}";
var MCK_CONTEXTPATH = ":MCK_CONTEXTPATH";
var MCK_STATICPATH =":MCK_STATICPATH";
var MCK_ONINIT = "";
var KM_PLUGIN_SETTINGS=JSON.parse(':PLUGIN_SETTINGS');
const MCK_THIRD_PARTY_INTEGRATION =JSON.parse(':MCK_THIRD_PARTY_INTEGRATION');
//window.applozic.PRODUCT_ID= "${productId}"?"${productId}":"applozic-chat";
window.applozic.PRODUCT_ID =":PRODUCT_ID";
// $.getScript(MCK_STATICPATH + '/sidebox/js/app/mck-app.js');
var options={};
var options = applozic._globals;
options.isAnonymousChat =options.isAnonymousChat;
if (typeof options !== 'undefined') {
  MCK_ONINIT = options.onInit;
}
window.addEventListener('error', function(e) {
  let sentryConfig = MCK_THIRD_PARTY_INTEGRATION.sentry.plugin;
  sentryConfig.enable && Sentry.withScope((scope) => {
    scope.setTag("applicationId", options.appId);
    scope.setTag("userId", options.userId);
    scope.setUser({
      id: options.appId,
    });
    Sentry.captureException(e);
  });
  if (typeof(e.target.src) !== 'undefined' && e.target.src.indexOf('sidebox') !== -1 && typeof MCK_ONINIT === 'function') {
    console.log("Plugin loading error. Refresh page.");
    MCK_ONINIT("error");
  }
}, true);
var imported = document.createElement('script');
imported.src = MCK_STATICPATH + '/js/app/mck-app.js';
imported.crossOrigin = "anonymous";
document.head.appendChild(imported);
