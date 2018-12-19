// Below added function are accessible in mck-sidebox-1.0.js but are not exposed globally.

var kommunicateCommonFunction = new KommunicateCommonFunction();

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
        if (data && data.pricingPackage && data.pricingPackage === KommunicateConstants.PRICING_PACKAGE.STARTUP) {
            return true;
        } else {
            return false;
        }
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
        var isKommunicateAccountExpired = kommunicateCommonFunction.isKommunicatePlanExpired(data);
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
};
