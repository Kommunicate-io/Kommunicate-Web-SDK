var kmCustomTheme = new KmCustomTheme();

function KmCustomTheme() {
    var _this = this;
    var WIDGET_SETTINGS;
    var DEFAULT_BACKGROUND_COLOR = "linear-gradient(to right, #3a3c80 0%,#3d3e83 6%,#53549d 34%,#5858A0 61%,#5858a2 72%,#53549d 80%,#3d3e83 96%,#3a3c80 100%)";

    _this.init = function (optns) {
        WIDGET_SETTINGS = optns.widgetSettings;
        WIDGET_SETTINGS && _this.changeColorTheme();
    };

    _this.KmDefaultIcon = function () {
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 20">' +
            '<path fill="#FFF" d="M21.25 18.48V7.31a7.3 7.3 0 0 0-7.3-7.3H7.31a7.3 7.3 0 1 0 0 14.6h7.2s.58.04.93.17c.34.12.71.42.71.42l4.44 3.66s.4.34.55.27c.15-.07.11-.65.11-.65zM7.51 8.8c0 .49-.42.88-.95.88-.52 0-.95-.4-.95-.88V5.67c0-.49.43-.88.95-.88.53 0 .95.4.95.88V8.8zm4.07 1.48c0 .49-.43.88-.95.88s-.95-.39-.95-.88v-6.1c0-.48.43-.88.95-.88s.95.4.95.88v6.1zm4.06-1.48c0 .49-.42.88-.95.88-.52 0-.94-.4-.94-.88V5.67c0-.49.42-.88.94-.88.53 0 .95.4.95.88V8.8z"/>' +
            '</svg>';
    };

    _this.KmCustomIcon1 = function () {
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 18">' +
            '<path fill="#FFF" d="M3.35 18a.48.48 0 0 1-.44-.3.47.47 0 0 1 .1-.5c.53-.53 1.49-1.82 2.12-3.21C1.95 12.61 0 10.19 0 7.58 0 3.4 4.93 0 11 0s11 3.4 11 7.58-4.93 7.58-11 7.58c-.4 0-.78-.02-1.16-.05A8.63 8.63 0 0 1 3.34 18z"/>' +
            '</svg>';
    };

    _this.KmCustomIcon2 = function () {
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 17">' +
            '<path fill="#FFF" d="M17.98 3.22h-6.65V1.64C11.33.78 10.64.1 9.78.1H1.56C.69.09 0 .78 0 1.64v7.67c0 .2.11.38.27.49a.61.61 0 0 0 .29.07c.08 0 .2-.03.26-.07l1.67-.96h1.47v4.65a2.03 2.03 0 0 0 2.02 2.02h10.7l2.5 1.42a.6.6 0 0 0 .26.07c.1 0 .2-.02.3-.07.17-.09.26-.29.26-.49V5.22c0-1.09-.91-2-2.02-2zm-14.02 2v2.51h-1.6c-.1 0-.2.03-.27.07l-.98.56V1.64c0-.24.2-.44.45-.44h8.22c.24 0 .44.2.44.44v1.58H5.96a2 2 0 0 0-2 2zM18.89 15.5l-1.78-1.02a.6.6 0 0 0-.27-.07H5.96a.92.92 0 0 1-.92-.91V5.22c0-.49.4-.9.92-.9h12.02c.49 0 .9.4.9.9V15.5z"/>' +
            '</svg>';
    };

    _this.KmCustomIcon3 = function () {
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 17">' +
            '<path fill="#FFF" d="M17.63 16.5a.37.37 0 0 0 .37-.38V.74a.38.38 0 0 0-.38-.37H.38A.38.38 0 0 0 0 .74v12c0 .2.17.38.38.38h12.5l4.52 3.3a.37.37 0 0 0 .23.08z"/>' +
            '</svg>';
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
                    return _this.KmDefaultIcon();
                    break;
                case 2:
                    return _this.KmCustomIcon1();
                    break;
                case 3:
                    return _this.KmCustomIcon2();
                    break;
                case 4:
                    return _this.KmCustomIcon3();
                    break;
                case 'image':
                    return _this.KmCustomImageIcon(WIDGET_SETTINGS.widgetImageLink);
                    break;
                default:
                    return _this.KmDefaultIcon();
            }
        } else {
            return _this.KmDefaultIcon();
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
