window.applozic = window.applozic || {};
//var MCK_CONTEXTPATH = "${pageContext.request.scheme}://${pageContext.request.serverName}:${pageContext.request.serverPort}${contextPath}";
//var MCK_STATICPATH = "${pluginStaticPath}";
var MCK_CONTEXTPATH = ":MCK_CONTEXTPATH";
var MCK_STATICPATH =":MCK_STATICPATH";
var MCK_ONINIT = "";
//window.applozic.PRODUCT_ID= "${productId}"?"${productId}":"applozic-chat";
window.applozic.PRODUCT_ID =":PRODUCT_ID";
// $.getScript(MCK_STATICPATH + '/sidebox/js/app/mck-app.js');
var options = applozic._globals;
if (typeof options !== 'undefined') {
  MCK_ONINIT = options.onInit;
}
window.addEventListener('error', function(e) {
  if (typeof(e.target.src) !== 'undefined' && e.target.src.indexOf('sidebox') !== -1 && typeof MCK_ONINIT === 'function') {
    console.log("Plugin loading error. Refresh page.");
    MCK_ONINIT("error");
  }
}, true);
var imported = document.createElement('script');
imported.src = MCK_STATICPATH + '/js/app/mck-app.js';
document.head.appendChild(imported);
