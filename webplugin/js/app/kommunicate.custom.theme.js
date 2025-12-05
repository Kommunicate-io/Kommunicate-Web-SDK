var kommunicateCommons = new KommunicateCommons();

function KmCustomTheme() {
    var _this = this;
    var WIDGET_SETTINGS;
    var DEFAULT_BACKGROUND_COLOR = '#5F46F8';
    var DEFAULT_SECONDARY_BACKGROUND_COLOR = '#EFEFEF';
    var DEFAULT_ACCENT_RGB = '95, 70, 248';
    var canvasColorParserContext;

    _this.init = function (optns) {
        WIDGET_SETTINGS = optns.widgetSettings;
        WIDGET_SETTINGS && _this.changeColorTheme();
        _this.fillSvgsTheme();
    };

    _this.KmCustomImageIcon = function (widgetImageLink) {
        return '<img src=' + widgetImageLink + ' alt="Chat with us"></img>';
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
        var squareIcon = '';
        if (kommunicateCommons.isObject(WIDGET_SETTINGS)) {
            primaryColor =
                WIDGET_SETTINGS && WIDGET_SETTINGS.primaryColor
                    ? WIDGET_SETTINGS.primaryColor
                    : DEFAULT_BACKGROUND_COLOR;
            secondaryColor =
                WIDGET_SETTINGS && WIDGET_SETTINGS.secondaryColor
                    ? WIDGET_SETTINGS.secondaryColor
                    : DEFAULT_SECONDARY_BACKGROUND_COLOR;
            squareIcon = kommunicate._globals.iconShape == 'square' ? 'km-square-chat-icon' : null;
            // .km-custom-color-widget is className
            // background : '#fffff' is class style attribute
            var contrastColor = getAccessibleTextColor(primaryColor);
            var kmCustomWidgetCustomCSS =
                '.km-custom-widget-background-color { background: ' +
                primaryColor +
                ' !important; color: ' +
                contrastColor +
                ' !important;} ' +
                '.km-custom-widget-background-color-secondary { background: ' +
                secondaryColor +
                ' !important;} ' +
                '.km-custom-widget-border-color { border-color: ' +
                primaryColor +
                ' !important;} ' +
                '.km-custom-widget-text-color { color: ' +
                contrastColor +
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
            '<div id="launcher-svg-container" class="km-chat-icon-sidebox km-custom-widget-background-color km-chat-widget-background-color' +
            (squareIcon ? ' ' + squareIcon : '') +
            ' mck-default-launcher-icon" >' +
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
        var contrastRgbArray = normalizeColorToRgb(contrastColor);
        var contrastRgb = (contrastRgbArray && contrastRgbArray.join(', ')) || '255, 255, 255';
        root.style.setProperty('--km-accent-contrast-rgb', contrastRgb);
        root.style.setProperty('--km-widget-header-background', primaryColor);
        root.style.setProperty('--km-widget-header-text', contrastColor);
        applyConversationTitleTextColor(contrastColor);
    }

    function applyConversationTitleTextColor(color) {
        if (!color || typeof document === 'undefined') {
            return;
        }
        ['mck-conversation-title', 'mck-tab-title'].forEach(function (id) {
            var title = document.getElementById(id);
            if (title) {
                title.style.color = color;
            }
        });
        var iconSelectors = [
            '.km-talk-to-human-div .talk-to-human-link',
            '#talk-to-human-link',
            '#mck-conversation-back-btn',
            '.mck-conversation-tab-link',
            '#km-talk-to-human',
            '.km-option-talk-to-human',
            '.mck-box-close',
            '.mck-close-sidebox',
            '.mck-minimize-icon',
            '.mck-close-btn',
            '.mck-agent-status-text',
        ];
        iconSelectors.forEach(function (selector) {
            var elements = document.querySelectorAll(selector);
            for (var i = 0; i < elements.length; i++) {
                elements[i].style.color = color;
            }
        });
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

        var brightness = calculatePerceivedBrightness(rgb[0], rgb[1], rgb[2]);
        if (brightness < 150) {
            return '#ffffff';
        }
        if (brightness > 220) {
            return '#000000';
        }

        var luminance = calculateLuminance(rgb[0], rgb[1], rgb[2]);
        var contrastWhite = calculateContrastRatio(luminance, 1);
        var contrastBlack = calculateContrastRatio(luminance, 0);
        return contrastWhite >= contrastBlack ? '#ffffff' : '#000000';
    }

    function calculatePerceivedBrightness(r, g, b) {
        return (r * 299 + g * 587 + b * 114) / 1000;
    }

    function calculateContrastRatio(lumA, lumB) {
        var light = Math.max(lumA, lumB);
        var dark = Math.min(lumA, lumB);
        return (light + 0.05) / (dark + 0.05);
    }

    function normalizeColorToRgb(color) {
        if (!color || typeof color !== 'string') {
            return null;
        }
        var trimmedColor = color.trim();
        if (trimmedColor.startsWith('#')) {
            var clean = trimmedColor.replace('#', '');
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
            var rHex = parseInt(clean.substring(0, 2), 16);
            var gHex = parseInt(clean.substring(2, 4), 16);
            var bHex = parseInt(clean.substring(4, 6), 16);
            if (
                [rHex, gHex, bHex].some(function (v) {
                    return isNaN(v);
                })
            ) {
                return null;
            }
            return [rHex, gHex, bHex];
        }
        var rgbMatch = trimmedColor
            .replace(/\s+/g, '')
            .match(/^rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)$/i);
        if (rgbMatch) {
            var r = Number(rgbMatch[1]);
            var g = Number(rgbMatch[2]);
            var b = Number(rgbMatch[3]);
            var inRange = [r, g, b].every(function (v) {
                return !isNaN(v) && v >= 0 && v <= 255;
            });
            return inRange ? [r, g, b] : null;
        }
        return parseCssColorToRgb(trimmedColor);
    }

    // Canvas parsing translates color names and other CSS values into RGB when needed.
    function parseCssColorToRgb(color) {
        if (typeof document === 'undefined' || !document.createElement) {
            return null;
        }
        if (!canvasColorParserContext) {
            var canvas = document.createElement('canvas');
            if (!canvas || !canvas.getContext) {
                return null;
            }
            canvasColorParserContext = canvas.getContext('2d');
        }
        if (!canvasColorParserContext) {
            return null;
        }
        try {
            canvasColorParserContext.fillStyle = '#000000';
            canvasColorParserContext.fillStyle = color;
            var computedColor = canvasColorParserContext.fillStyle;
            if (typeof computedColor !== 'string') {
                return null;
            }
            var rgbMatch = computedColor.match(/^rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})/i);
            if (rgbMatch) {
                return [Number(rgbMatch[1]), Number(rgbMatch[2]), Number(rgbMatch[3])];
            }
            var hexMatch = computedColor.match(/^#([0-9a-f]{6})$/i);
            if (hexMatch) {
                return [
                    parseInt(hexMatch[1].substring(0, 2), 16),
                    parseInt(hexMatch[1].substring(2, 4), 16),
                    parseInt(hexMatch[1].substring(4, 6), 16),
                ];
            }
        } catch (e) {
            return null;
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
