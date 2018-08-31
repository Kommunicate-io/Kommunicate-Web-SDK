/* ========= Active Camapign Script starts here ========= */
// Set to false if opt-in required
var trackByDefault = true;

function acEnableTracking() {
    var expiration = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30);
    document.cookie = "ac_enable_tracking=1; expires= " + expiration + "; path=/";
    acTrackVisit();
}

function acTrackVisit() {
    var trackcmp_email = '';
    var trackcmp = document.createElement("script");
    trackcmp.async = true;
    trackcmp.type = 'text/javascript';
    trackcmp.src = '//trackcmp.net/visit?actid=66105982&e='+encodeURIComponent(trackcmp_email)+'&r='+encodeURIComponent(document.referrer)+'&u='+encodeURIComponent(window.location.href);
    var trackcmp_s = document.getElementsByTagName("script");
    if (trackcmp_s.length) {
        trackcmp_s[0].parentNode.appendChild(trackcmp);
    } else {
        var trackcmp_h = document.getElementsByTagName("head");
        trackcmp_h.length && trackcmp_h[0].appendChild(trackcmp);
    }
}

if (trackByDefault || /(^|; )ac_enable_tracking=([^;]+)/.test(document.cookie)) {
    acEnableTracking();
}
/* ========= Active Camapign Script ends here ========= */

/* ========= Profitwell Script starts here ========= */
    (function(i,s,o,g,r,a,m){i['ProfitWellObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m);
        })(window,document,'script','https://dna8twue3dlxq.cloudfront.net/js/profitwell.js','profitwell');
    profitwell('auth_token', '71e77c6a8d59f50233d1705120049bf1'); // Your unique Profitwell public API token
    profitwell('user_email', '');
/* ========= Profitwell Script ends here ========= */