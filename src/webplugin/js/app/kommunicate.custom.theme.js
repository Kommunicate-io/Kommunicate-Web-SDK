var kommunicateCommons = new KommunicateCommons();

function KmCustomTheme() {
    var _this = this;
    var WIDGET_SETTINGS;
    var DEFAULT_BACKGROUND_COLOR = "#5553B7";

    _this.init = function (optns) {
        WIDGET_SETTINGS = optns.widgetSettings;
        WIDGET_SETTINGS && _this.changeColorTheme();
    };

    _this.KmCustomImageIcon = function (widgetImageLink) {
        return '<img src=' + widgetImageLink + '></img>'
    };

    _this.createCustomClasses = function (classSettings) {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = classSettings;
        document.getElementsByTagName('head')[0].appendChild(style);
    };

    _this.customSideboxWidget = function () {
        var primaryColor = DEFAULT_BACKGROUND_COLOR;
        if(kommunicateCommons.isObject(WIDGET_SETTINGS)){
            primaryColor = (WIDGET_SETTINGS && WIDGET_SETTINGS.primaryColor) ? WIDGET_SETTINGS.primaryColor : DEFAULT_BACKGROUND_COLOR;
            // .km-custom-color-widget is className
            // background : '#fffff' is class style attribute
            var kmCustomWidgetCustomCSS = '.km-custom-widget-background-color { background: ' + primaryColor + ' !important;} '+
            '.km-custom-widget-border-color { border-color: ' + primaryColor + ' !important;} '+
            '.km-custom-widget-text-color { color: ' + primaryColor + ' !important;} '+
            '.km-custom-widget-fill { fill: ' + primaryColor + ' !important;} '+
            '.km-custom-widget-stroke { stroke: ' + primaryColor + ' !important;} ';

            // Pass all classes you want to create in a single array.
            _this.createCustomClasses(kmCustomWidgetCustomCSS);
        }
        else {
            var kmChatWidgetBackgroundColor = '.km-chat-widget-background-color { background: ' + primaryColor + " !important" + '}';
            _this.createCustomClasses(kmChatWidgetBackgroundColor);
        }
        return '<div id="launcher-svg-container" class="km-chat-icon-sidebox km-custom-widget-background-color km-chat-widget-background-color">' +
            _this.returnCustomWidget() +
            '</div>'

    };

    _this.returnCustomWidget = function () {
        if (kommunicateCommons.isObject(WIDGET_SETTINGS)) {
            if ( WIDGET_SETTINGS.iconIndex === "image"){
                return _this.KmCustomImageIcon(WIDGET_SETTINGS.widgetImageLink);
            }
            else {
            // NOTE : We're sending icondIndex as integer value from kommunicate    
                return KommunicateConstants.CUSTOM_WIDGETS_SVG[WIDGET_SETTINGS.iconIndex];
            };
        } else {
            return KommunicateConstants.CUSTOM_WIDGETS_SVG[1]; // DEFAULT ICON
        }

    };
    
    _this.changeColorTheme = function () {
        // #0A090C
        var messageBoxTop = document.getElementsByClassName("mck-box-top")
        for (var i = 0; i < messageBoxTop.length; i++) {
            messageBoxTop[i].style.backgroundColor = WIDGET_SETTINGS.primaryColor;
        };
    };
}
