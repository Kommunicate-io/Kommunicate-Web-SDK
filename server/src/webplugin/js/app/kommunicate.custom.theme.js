var kmCustomTheme = new KmCustomTheme();

function KmCustomTheme() {
    var _this = this;
    var WIDGET_SETTINGS;
    var DEFAULT_BACKGROUND_COLOR = "linear-gradient(to right, #3a3c80 0%,#3d3e83 6%,#53549d 34%,#5858A0 61%,#5858a2 72%,#53549d 80%,#3d3e83 96%,#3a3c80 100%)";

    _this.init = function (optns) {
        WIDGET_SETTINGS = optns.widgetSettings;
        WIDGET_SETTINGS && _this.changeColorTheme();
    };

    _this.KmCustomImageIcon = function (widgetImageLink) {
        return '<img src=' + widgetImageLink + '></img>'
    };

    _this.createCustomClasses = function (classSettings) {
        // Make create custom classes compatible for creating multiple classes in one call.
        for (var i = 0; i < classSettings.length; i++) {
            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = classSettings[i];
            document.getElementsByTagName('head')[0].appendChild(style);
        }
    };

    _this.customSideboxWidget = function () {
        var primaryColor = DEFAULT_BACKGROUND_COLOR;
        if(WIDGET_SETTINGS){
            primaryColor = (WIDGET_SETTINGS && WIDGET_SETTINGS.primaryColor) ? WIDGET_SETTINGS.primaryColor : DEFAULT_BACKGROUND_COLOR;
            // .km-custom-color-widget is className
            // background : '#fffff' is class style attribute
            var kmCustomWidgetBackgroundColor = '.km-custom-widget-background-color { background: ' + primaryColor + " !important" + '}';
            var kmCustomWidgetBorderColor = '.km-custom-widget-border-color { border-color: ' + primaryColor + " !important" + '}';
            var kmCustomWidgetTextColor = '.km-custom-widget-text-color { color: ' + primaryColor + " !important" + ';}';

            // Pass all classes you want to create in a single array.
            _this.createCustomClasses([kmCustomWidgetBackgroundColor, kmCustomWidgetBorderColor, kmCustomWidgetTextColor]);
        }
        else {
            var kmChatWidgetBackgroundColor = '.km-chat-widget-background-color { background: ' + primaryColor + " !important" + '}';
            _this.createCustomClasses([kmChatWidgetBackgroundColor]);
        }
        return '<div id="launcher-svg-container" class="km-chat-icon-sidebox km-custom-widget-background-color km-chat-widget-background-color">' +
            _this.reutrnCutomWidget() +
            '</div>'

    };

    _this.reutrnCutomWidget = function () {
        if (WIDGET_SETTINGS !== null) {
            switch (WIDGET_SETTINGS.iconIndex) {
                case 1:
                    return KommunicateConstants.CUSTOM_WIDGETS_SVG.KmDefaultIcon;
                    break;
                case 2:
                    return KommunicateConstants.CUSTOM_WIDGETS_SVG.KmCustomIcon1;
                    break;
                case 3:
                    return KommunicateConstants.CUSTOM_WIDGETS_SVG.KmCustomIcon2;
                    break;
                case 4:
                    return KommunicateConstants.CUSTOM_WIDGETS_SVG.KmCustomIcon3;
                    break;
                case 'image':
                    return _this.KmCustomImageIcon(WIDGET_SETTINGS.widgetImageLink);
                    break;
                default:
                    return KommunicateConstants.CUSTOM_WIDGETS_SVG.KmDefaultIcon;
            }
        } else {
            return KommunicateConstants.CUSTOM_WIDGETS_SVG.KmDefaultIcon;
        }

    };
    
    _this.changeColorTheme = function () {
        // #0A090C
        var MCK_BOX_TOP = document.getElementsByClassName("mck-box-top")
        for (var i = 0; i < MCK_BOX_TOP.length; i++) {
            MCK_BOX_TOP[i].style.backgroundColor = WIDGET_SETTINGS.primaryColor;
        };
    };
}
