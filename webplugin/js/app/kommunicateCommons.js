// Below added function are accessible in mck-sidebox-1.0.js but are not exposed globally.

function KommunicateCommons() {
    var _this = this;
    var CUSTOMER_CREATED_AT;
    var USE_BRANDING;
    var WIDGET_SETTINGS;
    KommunicateCommons.IS_WIDGET_OPEN = false;

    _this.init = function (optns) {
        CUSTOMER_CREATED_AT = optns.customerCreatedAt;
        USE_BRANDING = typeof optns.useBranding  == 'boolean'? optns.useBranding : true;
        WIDGET_SETTINGS = optns.widgetSettings;
    };

    _this.isStartupPlan = function (data) {
        return (data && data.pricingPackage && data.pricingPackage === KommunicateConstants.PRICING_PACKAGE.STARTUP)
    };

    _this.isKommunicatePlanExpired = function (data) {
        return _this.getDaysCount() > 31 && _this.isStartupPlan(data);
    };

    _this.getDaysCount = function () {
        var now = new Date();
        var trialStarted = new Date(CUSTOMER_CREATED_AT);
        var timeDiff = now.getTime() - trialStarted.getTime();
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return diffDays;
    };

    _this.showPoweredBy = function(data){
        var isKommunicateAccountExpired = _this.isKommunicatePlanExpired(data);
        // Preference given to use  paramater useBranding as some customers might be passing this parameter
        if(!USE_BRANDING){
            return false;
        }
        // If account gets expired after startup plan, it will automatically add poweredBy until he purchases growth / enterprise plan
        else if(isKommunicateAccountExpired){
            return true;
        }
        else if(kommunicateCommons.isObject(WIDGET_SETTINGS) && typeof WIDGET_SETTINGS.showPoweredBy !== "undefined"){
            return WIDGET_SETTINGS.showPoweredBy;
        }
        else if (data  &&  data.pricingPackage  && (data.pricingPackage == KommunicateConstants.PRICING_PACKAGE.ENTERPRISE_MONTHLY || data.pricingPackage == KommunicateConstants.PRICING_PACKAGE.ENTERPRISE_YEARLY)){
            return false
        }
        else {
            return true;
        } 
    };

    _this.classListChanger = function(elem, add, remove){
        add && elem.classList.add(add); 
        remove && elem.classList.remove(remove); 
    }
    /* use this method instead of jquery method to manipulate classes. for eg to display [vis] or hide [n-vis] an element
       addClass and removeClass to be passed as strings in the case of no classes pass "" elem will always be passed as an object
       array of strings containing IDs or Classes on which the classes need to be manipulated infromt of respective object property*/

    _this.modifyClassList = function(elem, addClass, removeClass){ 
            var idList = elem.id,
                classList = elem.class , list=[];
            idList && idList.forEach(function(id){
                document.getElementById(id)&&list.push(document.getElementById(id));
            })
            classList && classList.forEach(function(className){
				var el = document.getElementsByClassName(className);
                for(var i=0; i<=el.length-1; i++){
					el && list.push(el[i]);
					}
            })
            list.forEach(function(node){
             _this.classListChanger(node,addClass,removeClass);
            })
        
    };

    /* Reason behind adding this is that typeof o == 'object' returns true incase of array also, by using this we can find out that value
     value passed is just a object or not. */
    _this.isObject = function(object) {
        if (!object) return false;
        return typeof object == 'object' && object.constructor == Object;
    };

    _this.getTimeOrDate = function (createdAtTime) {
        var timeStamp = new Date(createdAtTime);
        var currentTime = new Date(),
            secondsPast = Math.max(0,(currentTime.getTime() - timeStamp.getTime() ) / 1000);
        if(secondsPast < 60){
            return (parseInt(secondsPast)<=1) ? parseInt(secondsPast) + ' sec ago' : parseInt(secondsPast) + ' secs ago';
        }
        if(secondsPast < 3600){
            return (parseInt(secondsPast/60)<=1) ? parseInt(secondsPast/60)  + ' min ago' : parseInt(secondsPast/60) + ' mins ago';
        }
        if(secondsPast <= 172800){
            return (parseInt(secondsPast/3600)<=1) ? parseInt(secondsPast/3600) + ' hr ago' : parseInt(secondsPast/3600) + ' hrs ago';
        }
        if(secondsPast > 172800){
              day = timeStamp.getDate();
              month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ","");
              year = timeStamp.getFullYear() == currentTime.getFullYear() ? "" :  " "+timeStamp.getFullYear();
              return day + " " + month + year;
        }
    };

    _this.setWidgetStateOpen = function(isWidgetOpen){
        KommunicateCommons.IS_WIDGET_OPEN = isWidgetOpen;
    };

    _this.isWidgetOpen = function(){
        return KommunicateCommons.IS_WIDGET_OPEN;
    };

    _this.checkIfDeviceIsHandheld = function() {
        var check = false;
        (function (deviceInfo) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(deviceInfo) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(deviceInfo.substr(0, 4))) {
                check = true;
            }
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
      };

    _this.removeHtmlTag = function(html){
        let temporalDivElement = document.createElement("div");
        temporalDivElement.innerHTML = html;
        return temporalDivElement.textContent || temporalDivElement.innerText || "";
    }  
    _this.isConversationClosedByBot = function(){
        var filtered = CURRENT_GROUP_DATA.groupMembers.filter(function(member){
            return member.userId == CURRENT_GROUP_DATA.lastMessagingMember
        });
        return filtered[0] && filtered[0].role == 2

    }  

    _this.getRatingSmilies = function(rating){
        switch (rating) {
            case 1:
                return '<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35"><g fill="none" fill-rule="evenodd"><path fill="#FFCC4D" d="M34.966 17.483c0 9.655-7.828 17.483-17.483 17.483C7.828 34.966 0 27.138 0 17.483 0 7.828 7.828 0 17.483 0c9.655 0 17.483 7.828 17.483 17.483"/> <path fill="#6F543A" d="M24.753 26.592c-.044-.173-1.134-4.253-7.27-4.253-6.137 0-7.227 4.08-7.27 4.253-.054.211.042.43.23.539.19.107.427.075.582-.075.018-.019 1.898-1.803 6.458-1.803 4.56 0 6.44 1.784 6.457 1.803a.49.49 0 0 0 .58.077.486.486 0 0 0 .233-.54M14.083 13.112c0 1.879-1.086 3.4-2.428 3.4-1.34 0-2.428-1.521-2.428-3.4 0-1.877 1.087-3.4 2.428-3.4 1.342 0 2.428 1.523 2.428 3.4M26.763 13.112c0 1.879-1.087 3.4-2.428 3.4s-2.428-1.521-2.428-3.4c0-1.877 1.087-3.4 2.428-3.4s2.428 1.523 2.428 3.4"/></g></svg>'
            case 5:
                return '<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35"><g fill="none" fill-rule="evenodd"><circle cx="17.497" cy="17.497" r="17.497" fill="#FFCC4D"/><g fill="#6F543A" transform="translate(8.089 8.713)"> <circle cx="4.411" cy="2.787" r="2.5"/><circle cx="14.411" cy="2.787" r="2.5"/><path d="M1.499 15.287h16.825c.783 0 .783-1 0-1H1.499c-.783 0-.783 1 0 1z"/></g></g></svg>';
            case 10:
                return '<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35"> <g fill="none" fill-rule="evenodd"><path fill="#FFCC4D" d="M34.932 17.466c0 9.646-7.82 17.466-17.466 17.466S0 27.112 0 17.466 7.82 0 17.466 0s17.466 7.82 17.466 17.466"/><path fill="#6F543A" d="M17.466 20.377c-3.516 0-5.848-.41-8.733-.97-.659-.128-1.94 0-1.94 1.94 0 3.881 4.458 8.733 10.673 8.733 6.214 0 10.674-4.852 10.674-8.733 0-1.94-1.282-2.069-1.941-1.94-2.885.56-5.218.97-8.733.97"/><path fill="#FFF" d="M8.733 21.347s2.91.97 8.733.97c5.822 0 8.733-.97 8.733-.97s-1.94 3.881-8.733 3.881c-6.792 0-8.733-3.88-8.733-3.88"/><path fill="#6F543A" d="M14.07 13.1c0 1.876-1.086 3.396-2.426 3.396s-2.426-1.52-2.426-3.397c0-1.875 1.086-3.396 2.426-3.396s2.426 1.52 2.426 3.396M26.737 13.1c0 1.876-1.086 3.396-2.426 3.396s-2.426-1.52-2.426-3.397c0-1.875 1.086-3.396 2.426-3.396s2.426 1.52 2.426 3.396"/></g></svg>'
            default:
                console.log('unknown rating');
        } 
    }
};
