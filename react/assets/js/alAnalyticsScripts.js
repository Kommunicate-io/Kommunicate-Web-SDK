var QUERYSTRINGTEST = '-test',
QUERYSTRINGLOCAL = 'localhost',
CURRENTURL = window.location.href;

/* Heap Analytics and Google Analytics Script Starts Here */
if((CURRENTURL.indexOf(QUERYSTRINGTEST) != -1) || (CURRENTURL.indexOf(QUERYSTRINGLOCAL) != -1)){
    console.log("Heap Analytics and Google analytics code will not run on Localhost or Test Environment.");
} else {
    /* Heap Analytics Script */
    window.heap=window.heap||[],heap.load=function(e,t){window.heap.appid=e,window.heap.config=t=t||{};var r=t.forceSSL||"https:"===document.location.protocol,a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src=(r?"https:":"http:")+"//cdn.heapanalytics.com/js/heap-"+e+".js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(a,n);for(var o=function(e){return function(){heap.push([e].concat(Array.prototype.slice.call(arguments,0)))}},p=["addEventProperties","addUserProperties","clearEventProperties","identify","resetIdentity","removeEventProperty","setEventProperties","track","unsetEventProperty"],c=0;c<p.length;c++)heap[p[c]]=o(p[c])};
    heap.load("329668642");

    /* Google Analytics Script */
    var ga = document.createElement("script");
    ga.async = true;
    ga.type = 'text/javascript';
    ga.src = 'https://www.googletagmanager.com/gtag/js?id=UA-65628441-1';
    var ga_h = document.getElementsByTagName("head");
    ga_h.length && ga_h[0].appendChild(ga);
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'UA-65628441-1');


    /* Google Tag Manager Script */
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-MHX5FK');

    //<!-- Start Visual Website Optimizer Asynchronous Code -->
    var _vwo_code=(function(){
    var account_id=345346,
    settings_tolerance=2000,
    library_tolerance=2500,
    use_existing_jquery=false,
    /* DO NOT EDIT BELOW THIS LINE */
    f=false,d=document;return{use_existing_jquery:function(){return use_existing_jquery;},library_tolerance:function(){return library_tolerance;},finish:function(){if(!f){f=true;var a=d.getElementById('_vis_opt_path_hides');if(a)a.parentNode.removeChild(a);}},finished:function(){return f;},load:function(a){var b=d.createElement('script');b.src=a;b.type='text/javascript';b.innerText;b.onerror=function(){_vwo_code.finish();};d.getElementsByTagName('head')[0].appendChild(b);},init:function(){settings_timer=setTimeout('_vwo_code.finish()',settings_tolerance);var a=d.createElement('style'),b='body{opacity:0 !important;filter:alpha(opacity=0) !important;background:none !important;}',h=d.getElementsByTagName('head')[0];a.setAttribute('id','_vis_opt_path_hides');a.setAttribute('type','text/css');if(a.styleSheet)a.styleSheet.cssText=b;else a.appendChild(d.createTextNode(b));h.appendChild(a);this.load('//dev.visualwebsiteoptimizer.com/j.php?a='+account_id+'&u='+encodeURIComponent(d.URL)+'&r='+Math.random());return settings_timer;}};}());_vwo_settings_timer=_vwo_code.init();
    //<!-- End Visual Website Optimizer Asynchronous Code -->

}

/* Heap Analytics and Google Analytics Script Starts Here */