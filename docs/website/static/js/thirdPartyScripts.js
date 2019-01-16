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

/* ===== Komunicate Support Chat Script starts here ===== */
(function(d, m) {
    let o = {
        "appId": "kommunicate-support",
        "isAnonymousChat": true
    };
    let s = document.createElement("script");
    s.type = "text/javascript";
    s.async = true;
    s.src = 'https://api.kommunicate.io/v2/kommunicate.app';
    let h = document.getElementsByTagName("head")[0];
    h.appendChild(s);
    window.kommunicate = m;
    m._globals = o;
}
)(document, window.kommunicate || {});
/* ===== Komunicate Support Chat Script ends here ===== */

/* ===== Script to scroll the sidebar automatically to make the active link come into view starts here ===== */
document.addEventListener('DOMContentLoaded', function() {
    // Find the active nav item in the sidebar
    const item = document.getElementsByClassName('navListItemActive')[0];
    if (!item) { return; }
    const bounding = item.getBoundingClientRect();
    if (
      bounding.top >= 0 &&
      bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    ) {
      // Already visible.  Do nothing.
    } else {
      // Not visible.  Scroll sidebar.
      item.scrollIntoView({block: 'center', inline: 'nearest'});
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
  });
/* ===== The above scroll script ends here ===== */

/* ===== ScrollSpy for Table of Contents ===== */
// Inspired by ScrollSpy as in e.g. Bootstrap
(function() {
    const OFFSET = 10;
    let timer;
    let headingsCache;
    const findHeadings = () => headingsCache ? headingsCache :
        document.querySelectorAll('.toc-headings > li > a');
    const onScroll = () => {
        if (timer) {  // throttle
            return;
        }
        timer = setTimeout(() => {
            timer = null;
            let found = false;
            const headings = findHeadings();
            for (let i = 0; i < headings.length; i++) {
                // if !found and i is the last element, highlight the last
                let current = !found;
                if (!found && i < headings.length - 1) {
                    const next = headings[i + 1].href.split('#')[1];
                    const nextHeader = document.getElementById(next);
                    const top = nextHeader.getBoundingClientRect().top;
                    // The following tests whether top + scrollTop
                    // (the top of the header) is greater than scrollTop
                    // (where scrollTop = window.pageYOffset, the top of
                    // the window), with OFFSET pixels of slop.
                    current = top > OFFSET;
                }
                if (current) {
                    found = true;
                    headings[i].className = "active";
                } else {
                    headings[i].className = "";
                }
            }
        }, 100);
    };
    document.addEventListener('scroll', onScroll);
    document.addEventListener('resize', onScroll);
    document.addEventListener('DOMContentLoaded', () => {
        // Cache the headings once the page has fully loaded.
        headingsCache = findHeadings();
        onScroll();
    });
})();
/* ===== ScrollSpy for Table of Contents ends here ===== */
