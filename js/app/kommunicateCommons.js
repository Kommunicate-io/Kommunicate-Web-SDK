// Below added function are accessible in mck-sidebox-1.0.js but are not exposed globally.

function KommunicateCommonFunction() {
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
        else if(WIDGET_SETTINGS && typeof WIDGET_SETTINGS.showPoweredBy !== "undefined"){
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
       addClass and removeClass to be passed as strings in the case of no classes pass "" elem will always be passed as an 
       array or strings containing IDs or Classes on which the classes need to be manipulated */

    _this.modifyClassList = function(elem, addClass, removeClass){ 
        elem.forEach(function(item){
            if(document.getElementById(item) !== null ){
                _this.classListChanger(document.getElementById(item),addClass,removeClass);
            }
        else{
            var list = document.getElementsByClassName(item);
                list.forEach(function(node){
                this.classListChanger(node,addClass,removeClass);
                })
            }
        })

        
    }


};
