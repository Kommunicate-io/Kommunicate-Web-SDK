// Below added function are accessible in mck-sidebox-1.0.js but are not exposed globally.

function KommunicateCommons() {
    var _this = this;
    var CUSTOMER_CREATED_AT;
    var USE_BRANDING;
    var WIDGET_SETTINGS;

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

};
