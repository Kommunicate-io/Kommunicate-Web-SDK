var $original;
var oModal = "";
if (typeof jQuery !== 'undefined') {
    $original = jQuery.noConflict(true);
    $ = $original;
    jQuery = $original;
    if (typeof $.fn.modal === 'function') {
        oModal = $.fn.modal.noConflict(true);
        $.fn.modal = oModal;
        jQuery.fn.modal = oModal;
    }
}

var applozicSideBox = new ApplozicSidebox();
applozicSideBox.load();
function ApplozicSidebox() {
	var googleApiKey = (typeof applozic._globals !== 'undefined' && applozic._globals.googleApiKey)?(applozic._globals.googleApiKey):"AIzaSyCrBIGg8X4OnG4raKqqIC3tpSIPWE-bhwI";
    var mck_style_loader = [ {
            "name": "mck-combined", "url": MCK_STATICPATH + "/lib/css/mck-combined.min.css"
    }, {
            "name": "mck-sidebox", "url": MCK_STATICPATH + "/css/app/mck-sidebox-1.0.css"
    },{
   	 	"name": "km-login-model", "url": MCK_STATICPATH + "/css/app/km-login-model.css"
   } ];
    var mck_script_loader1 = [ {
            "name": "widget", "url": MCK_STATICPATH + "/lib/js/mck-ui-widget.min.js"
    }, {
            "name": "plugins", "url": MCK_STATICPATH + "/lib/js/mck-ui-plugins.min.js"
    }, {
            "name": "socket", "url": MCK_STATICPATH + "/lib/js/mck-socket.min.js"
    }, {
            "name": "socket", "url": MCK_STATICPATH + "/lib/js/mqttws31.js"
    }, {
            "name": "maps", "url": "https://maps.google.com/maps/api/js?key="+googleApiKey+"&libraries=places"
    }, {
            "name": "emojis", "url": MCK_STATICPATH + "/lib/js/mck-emojis.min.js"
    }, {
            "name": "video_howler", "url": "https://cdnjs.cloudflare.com/ajax/libs/howler/2.0.2/howler.min.js"

    },{
        "name": "slick", "url": MCK_STATICPATH + "/lib/js/mck-slick.min.js"
    }, {
           "name": "video_ringtone", "url": MCK_STATICPATH + "/js/app/mck-ringtone-service.js"

    }, {
            "name": "mck-common", "url": MCK_STATICPATH + "/js/app/mck-common-1.0.js"
    },{
           "name": "aes", "url": MCK_STATICPATH + "/lib/js/aes.js"
    } ,{
    		"name":"cookie","url" : MCK_STATICPATH+"/lib/js/js.cookie.js"
    }];
    var mck_script_loader2 = [ {
            "name": "locationpicker", "url": MCK_STATICPATH + "/lib/js/locationpicker.jquery.min.js"
    } ];
   var mck_videocall = [ {
        "name": "video_videocall", "url": MCK_STATICPATH + "/js/app/videocall.js"

    }, {
          "name": "video_twilio", "url": MCK_STATICPATH + "/js/app/twilio-video.js"
    } ];
    this.load = function() {
        try {
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = MCK_STATICPATH + "/lib/js/jquery-3.2.1.min.js";
            if (script.readyState) { // IE
                script.onreadystatechange = function() {
                    if (script.readyState === "loaded" || script.readyState === "complete") {
                        script.onreadystatechange = null;
                        mckinitPlugin();
                    }
                };
            } else { // Others
                script.onload = function() {
                    mckinitPlugin();
                };
            }
            head.appendChild(script);
        } catch (e) {
            
            console.log("Plugin loading error. Refresh page.");
            if (typeof MCK_ONINIT === 'function') {
                MCK_ONINIT("error");
            }
            return false;
        }
    };
    function mckinitPlugin() {
        if (!$original && typeof jQuery !== 'undefined') {
            $original = jQuery.noConflict(true);
            $ = $original;
            jQuery = $original;
            if (typeof $.fn.modal === 'function') {
                oModal = $.fn.modal.noConflict(true);
                $.fn.modal = oModal;
                jQuery.fn.modal = oModal;
            }
        }
        try {
            $.each(mck_style_loader, function(i, data) {
                mckLoadStyle(data.url);
            });
            $.ajax({
                    url: MCK_STATICPATH + '/template/mck-sidebox.html', crossDomain: true, success: function(data) {
                        data = data.replace(/MCK_STATICPATH/g, MCK_STATICPATH);
                        $("body").append(data);
                        mckInitPluginScript();
                    }
            });
        } catch (e) {
            console.log("Plugin loading error. Refresh page.");
            if (typeof MCK_ONINIT === 'function') {
                MCK_ONINIT("error");
            }
            return false;
        }
    }
    function mckLoadStyle(url) {
        var head = document.getElementsByTagName('head')[0];
        var style = document.createElement('link');
        style.type = 'text/css';
        style.rel = "stylesheet";
        style.href = url;
        head.appendChild(style);
    }
    function mckLoadScript(url, callback) {
        try {
            var body = document.getElementsByTagName('body')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
            if (callback) {
                if (script.readyState) { // IE
                    script.onreadystatechange = function() {
                        if (script.readyState === "loaded" || script.readyState === "complete") {
                            script.onreadystatechange = null;
                            callback();
                        }
                    };
                } else { // Others
                    script.onload = function() {
                        callback();
                    };
                }
            }
            body.appendChild(script);
        } catch (e) {
            console.log("Plugin loading error. Refresh page.");
            if (typeof MCK_ONINIT === 'function') {
                MCK_ONINIT("error");
            }
            return false;
        }
    }
    function mckInitPluginScript() {
        try {
        	if(applozic.PRODUCT_ID =='kommunicate'){
       		 applozic._globals.locShare = ((applozic._globals.locShare)=== false) ? false : true;
       		 applozic._globals.googleApiKey= (applozic._globals.googleApiKey)?applozic._globals.googleApiKey :"AIzaSyCrBIGg8X4OnG4raKqqIC3tpSIPWE-bhwI";
       	 }
            $.each(mck_script_loader1, function(i, data) {
                if (data.name === "mck-common") {
                    try {
                       var options = applozic._globals;
                        if (typeof options !== 'undefined' && options.locShare === true) {
                            mckLoadScript(data.url, mckLoadScript2);
                        } else {
                            mckLoadScript(data.url, mckLoadAppScript);
                        }
                    } catch (e) {
                        mckLoadScript(data.url, mckLoadAppScript);
                    }
                } else if (data.name === "maps") {
                    try {
                        var options = applozic._globals;
                        if (typeof options !== 'undefined') {
                            if (options.googleMapScriptLoaded) {
                                return true;
                            }
                            if (options.googleApiKey) {
                                var url = data.url + "&key=" + options.googleApiKey;
                                mckLoadScript(url);
                            }
                        } else {
                            mckLoadScript(data.url);
                        }
                    } catch (e) {
                        mckLoadScript(data.url);
                    }
                } else {
                    mckLoadScript(data.url);
                }
            });
             if (typeof applozic._globals !== 'undefined'&& applozic._globals.video === true) {
                          $.each(mck_videocall, function(i, data) {
                          mckLoadScript(data.url);
                 });
               }
        } catch (e) {
            console.log("Plugin loading error. Refresh page.");
            if (typeof MCK_ONINIT === 'function') {
                MCK_ONINIT("error");
            }
            return false;
        }
    }
    function mckLoadScript2() {
        try {
            $.each(mck_script_loader2, function(i, data) {
                if (data.name === "locationpicker") {
                    mckLoadScript(data.url, mckLoadAppScript);
                }
            });
        } catch (e) {
            console.log("Plugin loading error. Refresh page.");
            if (typeof MCK_ONINIT === 'function') {
                MCK_ONINIT("error");
            }
            return false;
        }
    }
    function mckLoadAppScript() {
        try {
            var body = document.getElementsByTagName('body')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = MCK_STATICPATH + "/js/app/kommunicate-plugin-0.1.min.js";
            //script.src = MCK_STATICPATH + "/js/app/mck-sidebox-1.0.js";
            if (script.readyState) { // IE
                script.onreadystatechange = function() {
                    if (script.readyState === "loaded" || script.readyState === "complete") {
                        script.onreadystatechange = null;
                        mckInitSidebox();
                    }
                };
            } else { // Others
                script.onload = function() {
                    mckInitSidebox();
                };
            }
            body.appendChild(script);
        } catch (e) {
            console.log("Plugin loading error. Refresh page.");
            if (typeof MCK_ONINIT === 'function') {
                MCK_ONINIT("error");
            }
            return false;
        }
    }
    function mckInitSidebox() {
        try {
            var options = applozic._globals;
            if(applozic.PRODUCT_ID =='kommunicate'){
            	if(options.isAnonymousChat && !options.userId){
               		 if (Cookies.get("kommunicate-id")) {
               			options.userId = Cookies.get("kommunicate-id");
               		}
               		else {
               			options.userId = getRandomId();
               			Cookies.set("kommunicate-id", options.userId);
               		}

            	}else{
            		// ask for email id;
            	}
            }
            if (typeof options !== 'undefined') {
                options.ojq = $original;
                options.obsm = oModal;

                $applozic.fn.applozic(options);
            }
        } catch (e) {
            console.log(e);
            console.log("Plugin loading error. Refresh page.",e);
            if (typeof MCK_ONINIT === 'function') {
                MCK_ONINIT("error");
            }
            return false;
        }
    }
    function getRandomId() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 32; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }
}
