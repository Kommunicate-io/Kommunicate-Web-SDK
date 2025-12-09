var kommunicateCommons = new KommunicateCommons();

function KmCustomTheme() {
    var _this = this;
    var WIDGET_SETTINGS;
    var DEFAULT_BACKGROUND_COLOR = '#5F46F8';
    var DEFAULT_SECONDARY_BACKGROUND_COLOR = '#EFEFEF';
    var DEFAULT_ACCENT_RGB = '95, 70, 248';
    var DEFAULT_LINK_COLOR = '#1866d1';
    var DEFAULT_LINK_HOVER_COLOR = '#0d3e9c';
    var DEFAULT_FAQ_ICON_COLOR = DEFAULT_BACKGROUND_COLOR;
    var DEFAULT_SURFACE_BACKGROUND_COLOR = '#ffffff';
    var DEFAULT_BORDER_ACCENT = '#5f46f8';
    var DEFAULT_THEME_VARIABLES = {
        '--km-accent': DEFAULT_BACKGROUND_COLOR,
        '--km-accent-rgb': DEFAULT_ACCENT_RGB,
        '--km-widget-header-background': DEFAULT_BACKGROUND_COLOR,
        '--km-on-primary': '#ffffff',
        '--km-on-primary-link': '#ffffff',
        '--km-accent-text': 'var(--km-font-title-color, #1c2043)',
        '--km-custom-widget-background-color': DEFAULT_BACKGROUND_COLOR,
        '--km-custom-widget-contrast-color': '#ffffff',
        '--km-custom-widget-border-color': DEFAULT_BACKGROUND_COLOR,
        '--km-custom-widget-fill-color': DEFAULT_BACKGROUND_COLOR,
        '--km-custom-widget-stroke-color': DEFAULT_BACKGROUND_COLOR,
        '--km-custom-widget-secondary-background-color': DEFAULT_SECONDARY_BACKGROUND_COLOR,
        '--km-accent-border-color': DEFAULT_BORDER_ACCENT,
        '--km-launcher-icon-fill': '#ffffff',
        '--km-msg-link-color': 'var(--km-link-color, ' + DEFAULT_LINK_COLOR + ')',
        '--km-msg-link-color-hover': 'var(--km-link-color-hover, ' + DEFAULT_LINK_HOVER_COLOR + ')',
        '--km-faq-icon-fill-color': DEFAULT_FAQ_ICON_COLOR,
    };
    // Keep the legacy widgetSettings keys mapped alongside the newer ones so older integrations continue to work.
    // When multiple aliases resolve to the same CSS variable, the merge order decides which value wins.
    var THEME_VARIABLE_ALIASES = {
        primaryColor: '--km-accent',
        primaryColorRgb: '--km-accent-rgb',
        chatHeaderBackground: '--km-widget-header-background',
        onPrimary: '--km-on-primary',
        onPrimaryLink: '--km-on-primary-link',
        accentText: '--km-accent-text',
        chatWidgetFill: '--km-custom-widget-fill-color',
        chatWidgetStroke: '--km-custom-widget-stroke-color',
        chatWidgetSecondaryBackground: '--km-custom-widget-secondary-background-color',
        widgetBackgroundColor: '--km-custom-widget-background-color',
        widgetBorderColor: '--km-custom-widget-border-color',
        widgetTextColor: '--km-custom-widget-contrast-color',
    };
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
                '.km-custom-widget-background-color { background: var(--km-custom-widget-background-color, ' +
                primaryColor +
                ') !important; color: var(--km-on-primary, var(--km-custom-widget-contrast-color, ' +
                contrastColor +
                ')) !important;} ' +
                '.km-custom-widget-background-color-secondary { background: var(--km-custom-widget-secondary-background-color, ' +
                secondaryColor +
                ') !important;} ' +
                '.km-custom-widget-border-color { border-color: var(--km-custom-widget-border-color, ' +
                primaryColor +
                ') !important;} ' +
                '.km-custom-widget-fill { fill: var(--km-custom-widget-fill-color, ' +
                primaryColor +
                ') !important;} ' +
                '.km-custom-widget-stroke { stroke: var(--km-custom-widget-stroke-color, ' +
                primaryColor +
                ') !important;}' +
                '.active-feedback svg path{ fill: var(--km-custom-widget-fill-color, ' +
                primaryColor +
                ') !important;}';
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
        var rgbArray = normalizeColorToRgb(primaryColor);
        var rgb = (rgbArray && rgbArray.join(', ')) || DEFAULT_ACCENT_RGB;
        var contrastColor = getAccessibleTextColor(primaryColor);
        var computedVars = {
            '--km-accent': primaryColor,
            '--km-accent-rgb': rgb,
            '--km-widget-header-background': primaryColor,
            '--km-on-primary': contrastColor,
            '--km-on-primary-link': contrastColor,
            '--km-custom-widget-background-color': primaryColor,
            '--km-custom-widget-contrast-color': contrastColor,
            '--km-custom-widget-border-color': primaryColor,
            '--km-launcher-icon-fill': contrastColor,
            '--km-custom-widget-fill-color': primaryColor,
            '--km-custom-widget-stroke-color': primaryColor,
            '--km-accent-text': contrastColor,
        };
        var borderColor = getContrastSafeColor(DEFAULT_BORDER_ACCENT, primaryColor, contrastColor);
        computedVars['--km-accent-border-color'] = borderColor;
        var linkColorVars = getLinkColorCssVars(primaryColor, contrastColor);
        Object.assign(computedVars, linkColorVars);
        var faqIconVars = getFaqIconCssVars(DEFAULT_SURFACE_BACKGROUND_COLOR, contrastColor);
        Object.assign(computedVars, faqIconVars);
        applyThemeVariables(computedVars);
        var root = typeof document !== 'undefined' ? document.documentElement : null;
        var onPrimaryColor = contrastColor;
        if (
            root &&
            typeof window !== 'undefined' &&
            window.getComputedStyle &&
            window.getComputedStyle(root)
        ) {
            var cssOnPrimary = window.getComputedStyle(root).getPropertyValue('--km-on-primary');
            if (cssOnPrimary && cssOnPrimary.trim()) {
                onPrimaryColor = cssOnPrimary.trim();
            }
        }
        applyConversationTitleTextColor(onPrimaryColor);
    }

    function getCustomThemeVariables() {
        if (!kommunicateCommons.isObject(WIDGET_SETTINGS)) {
            return {};
        }
        // Precedence: later sources are allowed to override earlier ones (theme < themeVariables < customThemeVariables < themeVars).
        var overrideSources = [
            WIDGET_SETTINGS.theme,
            WIDGET_SETTINGS.themeVariables,
            WIDGET_SETTINGS.customThemeVariables,
            WIDGET_SETTINGS.themeVars,
        ];
        var overrides = {};
        overrideSources.forEach(function (source) {
            if (kommunicateCommons.isObject(source)) {
                Object.keys(source).forEach(function (key) {
                    var resolvedKey = THEME_VARIABLE_ALIASES[key] || key;
                    overrides[resolvedKey] = source[key];
                });
            }
        });
        return overrides;
    }

    function applyThemeVariables(additionalVars) {
        var root = document.documentElement;
        if (!root) {
            return;
        }
        var customVars = getCustomThemeVariables();
        var mergedVars = Object.assign(
            {},
            DEFAULT_THEME_VARIABLES,
            additionalVars || {},
            customVars
        );
        Object.keys(mergedVars).forEach(function (name) {
            var value = mergedVars[name];
            if (value != null) {
                root.style.setProperty(name, value);
            }
        });
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

        var luminance = calculateLuminance(rgb[0], rgb[1], rgb[2]);
        var contrastWhite = calculateContrastRatio(luminance, 1);
        var contrastBlack = calculateContrastRatio(luminance, 0);
        if (contrastWhite >= contrastBlack && contrastWhite >= 4.5) {
            return '#ffffff';
        }
        if (contrastBlack >= 4.5) {
            return '#000000';
        }
        return contrastWhite >= contrastBlack ? '#ffffff' : '#000000';
    }

    function calculateContrastRatio(lumA, lumB) {
        var light = Math.max(lumA, lumB);
        var dark = Math.min(lumA, lumB);
        return (light + 0.05) / (dark + 0.05);
    }

    function getLinkColorCssVars(backgroundColor, contrastColor) {
        var fallbackColor = contrastColor || '#ffffff';
        return {
            '--km-msg-link-color': getContrastSafeColor(
                DEFAULT_LINK_COLOR,
                backgroundColor,
                fallbackColor
            ),
            '--km-msg-link-color-hover': getContrastSafeColor(
                DEFAULT_LINK_HOVER_COLOR,
                backgroundColor,
                fallbackColor
            ),
        };
    }

    function getFaqIconCssVars(backgroundColor, contrastColor) {
        var fallbackColor = contrastColor || '#ffffff';
        return {
            '--km-faq-icon-fill-color': getContrastSafeColor(
                DEFAULT_FAQ_ICON_COLOR,
                backgroundColor,
                fallbackColor
            ),
        };
    }

    function getContrastSafeColor(preferredColor, backgroundColor, fallbackColor) {
        var preferredRgb = normalizeColorToRgb(preferredColor);
        var backgroundRgb = normalizeColorToRgb(backgroundColor);
        if (preferredRgb && backgroundRgb) {
            var preferredLum = calculateLuminance(
                preferredRgb[0],
                preferredRgb[1],
                preferredRgb[2]
            );
            var backgroundLum = calculateLuminance(
                backgroundRgb[0],
                backgroundRgb[1],
                backgroundRgb[2]
            );
            if (calculateContrastRatio(backgroundLum, preferredLum) >= 4.5) {
                return preferredColor;
            }
        }
        return fallbackColor;
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
