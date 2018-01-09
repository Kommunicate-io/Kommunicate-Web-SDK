var QUERYSTRINGTEST = '-test',
QUERYSTRINGLOCAL = 'localhost',
CURRENTURL = window.location.href;
if((CURRENTURL.indexOf(QUERYSTRINGTEST) != -1) || (CURRENTURL.indexOf(QUERYSTRINGLOCAL) != -1)) {
  //No Heap Analytics code here
  console.log("No heap analytics will run on Localhost or Test");
}
else {
      window.heap=window.heap||[],heap.load=function(e,t){window.heap.appid=e,window.heap.config=t=t||{};var r=t.forceSSL||"https:"===document.location.protocol,a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src=(r?"https:":"http:")+"//cdn.heapanalytics.com/js/heap-"+e+".js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(a,n);for(var o=function(e){return function(){heap.push([e].concat(Array.prototype.slice.call(arguments,0)))}},p=["addEventProperties","addUserProperties","clearEventProperties","identify","removeEventProperty","setEventProperties","track","unsetEventProperty"],c=0;c<p.length;c++)heap[p[c]]=o(p[c])};
      heap.load("2382892731");
}

