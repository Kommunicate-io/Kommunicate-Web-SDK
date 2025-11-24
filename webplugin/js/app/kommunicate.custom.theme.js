var kommunicateCommons = new KommunicateCommons();

function KmCustomTheme() {
    var _this = this;
    var WIDGET_SETTINGS;
    var DEFAULT_BACKGROUND_COLOR = '#5F46F8';
    var DEFAULT_SECONDARY_BACKGROUND_COLOR = '#EFEFEF';
    var DEFAULT_ACCENT_RGB = '95, 70, 248';

    _this.init = function (optns) {
        WIDGET_SETTINGS = optns.widgetSettings;
        WIDGET_SETTINGS && _this.changeColorTheme();
        _this.fillSvgsTheme();
    };

    _this.KmCustomImageIcon = function (widgetImageLink) {
        return '<img src=' + widgetImageLink + ' alt="AI Agent Chat"></img>';
    };

    _this.createCustomClasses = function (classSettings) {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = classSettings;
        document.getElementsByTagName('head')[0].appendChild(style);
    };

    _this.customSideboxWidget = function () {
        var primaryColor = DEFAULT_BACKGROUND_COLOR;
        var secondaryColor = DEFAULT_SECONDARY_BACKGROUND_COLOR;
        if (kommunicateCommons.isObject(WIDGET_SETTINGS)) {
            primaryColor =
                WIDGET_SETTINGS && WIDGET_SETTINGS.primaryColor
                    ? WIDGET_SETTINGS.primaryColor
                    : DEFAULT_BACKGROUND_COLOR;
            secondaryColor =
                WIDGET_SETTINGS && WIDGET_SETTINGS.secondaryColor
                    ? WIDGET_SETTINGS.secondaryColor
                    : DEFAULT_SECONDARY_BACKGROUND_COLOR;
            var squareIcon =
                kommunicate._globals.iconShape == 'square' ? 'km-square-chat-icon' : null;
            // .km-custom-color-widget is className
            // background : '#fffff' is class style attribute
            var kmCustomWidgetCustomCSS =
                '.km-custom-widget-background-color { background: ' +
                primaryColor +
                ' !important; color: ' +
                getAccessibleTextColor(primaryColor) +
                ' !important;} ' +
                '.km-custom-widget-background-color-secondary { background: ' +
                secondaryColor +
                ' !important;} ' +
                '.km-custom-widget-border-color { border-color: ' +
                primaryColor +
                ' !important;} ' +
                '.km-custom-widget-text-color { color: ' +
                primaryColor +
                ' !important;} ' +
                '.km-custom-widget-fill { fill: ' +
                primaryColor +
                ' !important;} ' +
                '.km-custom-widget-stroke { stroke: ' +
                primaryColor +
                ' !important;}' +
                '.active-feedback svg path{ fill: ' +
                primaryColor +
                ' !important;}';
            // Pass all classes you want to create in a single array.
            _this.createCustomClasses(kmCustomWidgetCustomCSS);
        } else {
            var kmChatWidgetBackgroundColor =
                '.km-chat-widget-background-color { background: ' +
                primaryColor +
                ' !important' +
                '}';
            _this.createCustomClasses(kmChatWidgetBackgroundColor);
        }
        return (
            '<div id="launcher-svg-container" class="km-chat-icon-sidebox km-custom-widget-background-color km-chat-widget-background-color ' +
            squareIcon +
            '" >' +
            _this.returnCustomWidget() +
            '</div>'
        );
    };

    _this.returnCustomWidget = function () {
        if (kommunicateCommons.isObject(WIDGET_SETTINGS) && WIDGET_SETTINGS.iconIndex) {
            if (WIDGET_SETTINGS.iconIndex === 'image') {
                return _this.KmCustomImageIcon(WIDGET_SETTINGS.widgetImageLink);
            } else {
                // NOTE : We're sending icondIndex as integer value from kommunicate
                return KommunicateConstants.CUSTOM_WIDGETS_SVG[WIDGET_SETTINGS.iconIndex];
            }
        } else {
            return KommunicateConstants.CUSTOM_WIDGETS_SVG[1]; // DEFAULT ICON
        }
    };

    function setAccentCssVariables(primaryColor) {
        if (!primaryColor) {
            return;
        }
        var root = document.documentElement;
        var rgbArray = normalizeColorToRgb(primaryColor);
        var rgb = (rgbArray && rgbArray.join(', ')) || DEFAULT_ACCENT_RGB;
        root.style.setProperty('--km-accent', primaryColor);
        root.style.setProperty('--km-accent-rgb', rgb);
        var contrastColor = getAccessibleTextColor(primaryColor);
        root.style.setProperty('--km-accent-contrast', contrastColor);
    }

    _this.changeColorTheme = function () {
        // #0A090C
        var primaryColor =
            (WIDGET_SETTINGS && WIDGET_SETTINGS.primaryColor) || DEFAULT_BACKGROUND_COLOR;
        if (!primaryColor) {
            return;
        }
        var messageBoxTop = document.getElementsByClassName('mck-box-top');
        const businessHourBox = document.getElementById('km-business-hour-box');
        if (businessHourBox) {
            businessHourBox.style.backgroundColor = primaryColor;
        }
        for (var i = 0; i < messageBoxTop.length; i++) {
            messageBoxTop[i].style.backgroundColor = primaryColor;
        }
        setAccentCssVariables(primaryColor);
    };

    _this.fillSvgsTheme = function () {
        var primaryColor =
            (WIDGET_SETTINGS && WIDGET_SETTINGS.primaryColor) || DEFAULT_BACKGROUND_COLOR;
        document.querySelectorAll('path[data-custom-fill]').forEach(function (path) {
            path.setAttribute('fill', primaryColor);
        });
    };

    function getAccessibleTextColor(color) {
        var rgb = normalizeColorToRgb(color);
        if (!rgb) {
            return '#ffffff';
        }
        var luminance = calculateLuminance(rgb[0], rgb[1], rgb[2]);
        return luminance <= 0.179 ? '#ffffff' : '#000000';
    }

    function normalizeColorToRgb(color) {
        if (!color || typeof color !== 'string') {
            return null;
        }
        var hex = color.trim();
        if (hex.startsWith('#')) {
            var clean = hex.replace('#', '');
            if (clean.length === 3) {
                clean = clean
                    .split('')
                    .map(function (c) {
                        return c + c;
                    })
                    .join('');
            }
            if (clean.length !== 6) {
                return null;
            }
            var r = parseInt(clean.substring(0, 2), 16);
            var g = parseInt(clean.substring(2, 4), 16);
            var b = parseInt(clean.substring(4, 6), 16);
            if (
                [r, g, b].some(function (v) {
                    return isNaN(v);
                })
            ) {
                return null;
            }
            return [r, g, b];
        }
        var rgbMatch = color
            .replace(/\s+/g, '')
            .match(/^rgb\\((\\d{1,3}),(\\d{1,3}),(\\d{1,3})\\)$/i);
        if (rgbMatch) {
            return [Number(rgbMatch[1]), Number(rgbMatch[2]), Number(rgbMatch[3])];
        }
        return null;
    }

    function calculateLuminance(r, g, b) {
        var toLinear = function (c) {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        };
        var lr = toLinear(r);
        var lg = toLinear(g);
        var lb = toLinear(b);
        return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
    }
}
