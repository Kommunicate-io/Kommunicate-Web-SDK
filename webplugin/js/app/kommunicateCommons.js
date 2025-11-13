// Below added function are accessible in mck-sidebox-1.0.js but are not exposed globally.

function KommunicateCommons() {
    var _this = this;
    var CUSTOMER_CREATED_AT;
    var USE_BRANDING;
    var WIDGET_SETTINGS;
    KommunicateCommons.CONNECT_SOCKET_ON_WIDGET_CLICK;
    KommunicateCommons.IS_WIDGET_OPEN = false;
    _this.init = function (optns) {
        CUSTOMER_CREATED_AT = optns.customerCreatedAt;
        USE_BRANDING = typeof optns.useBranding == 'boolean' ? optns.useBranding : true;
        WIDGET_SETTINGS = optns.widgetSettings;
        KommunicateCommons.CONNECT_SOCKET_ON_WIDGET_CLICK = true;
    };

    _this.getDesignLayoutName = function () {
        var layoutFromGlobals =
            (Kommunicate &&
                Kommunicate._globals &&
                (Kommunicate._globals.designLayoutName ||
                    (Kommunicate._globals.appSettings &&
                        (Kommunicate._globals.appSettings.designLayoutName ||
                            Kommunicate._globals.appSettings.chatWidget?.designLayoutName)))) ||
            null;
        return (
            layoutFromGlobals ||
            (KommunicateConstants.DESIGN_LAYOUTS && KommunicateConstants.DESIGN_LAYOUTS.MODERN) ||
            'modern'
        );
    };

    _this.isModernLayoutEnabled = function () {
        return (
            _this.getDesignLayoutName() ===
            ((KommunicateConstants.DESIGN_LAYOUTS && KommunicateConstants.DESIGN_LAYOUTS.MODERN) ||
                'modern')
        );
    };

    _this.isTrialPlan = function (pricingPackage) {
        var isTrialPlan = false;
        if (pricingPackage === KommunicateConstants.PRICING_PACKAGE.TRIAL) {
            KommunicateCommons.CONNECT_SOCKET_ON_WIDGET_CLICK = true; // remove this line if same thing is removed from mck-sidebox-1.0.js
            isTrialPlan = true;
        }
        return isTrialPlan;
    };

    _this.isStartupPlan = function (data) {
        return (
            data &&
            data.pricingPackage &&
            data.pricingPackage === KommunicateConstants.PRICING_PACKAGE.STARTUP
        );
    };
    _this.isEnterprisePlan = function (data) {
        try {
            const isExpired = _this.isKommunicatePlanExpired(data);
            if (isExpired) {
                return false;
            }

            return KommunicateConstants.BUSINESS_HOURS_PLANS.has(
                Kommunicate._globals.appSettings.currentActivatedPlan
            );
        } catch (error) {
            console.debug('Error in finding plan: ', error);
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

    _this.showPoweredBy = function (data) {
        var isKommunicateAccountExpired = _this.isKommunicatePlanExpired(data);
        // Preference given to use  paramater useBranding as some customers might be passing this parameter
        if (!USE_BRANDING) {
            return false;
        }
        // If account gets expired after startup plan, it will automatically add poweredBy until he purchases growth / enterprise plan
        else if (isKommunicateAccountExpired) {
            return true;
        } else if (
            kommunicateCommons.isObject(WIDGET_SETTINGS) &&
            typeof WIDGET_SETTINGS.showPoweredBy !== 'undefined'
        ) {
            return WIDGET_SETTINGS.showPoweredBy;
        } else if (
            data &&
            data.pricingPackage &&
            (data.pricingPackage == KommunicateConstants.PRICING_PACKAGE.ENTERPRISE_MONTHLY ||
                data.pricingPackage == KommunicateConstants.PRICING_PACKAGE.ENTERPRISE_YEARLY)
        ) {
            return false;
        } else {
            return true;
        }
    };

    _this.classListChanger = function (elem, add, remove) {
        add && elem.classList.add(add);
        remove && elem.classList.remove(remove);
    };
    /* use this method instead of jquery method to manipulate classes. for eg to display [vis] or hide [n-vis] an element
       addClass and removeClass to be passed as strings in the case of no classes pass "" elem will always be passed as an object
       array of strings containing IDs or Classes on which the classes need to be manipulated infromt of respective object property*/

    _this.modifyClassList = function (elem, addClass, removeClass, useQuerySelector = false) {
        const idList = elem.id,
            classList = elem.class,
            list = [];

        idList &&
            idList.forEach(function (id) {
                document.getElementById(id) && list.push(document.getElementById(id));
            });

        classList &&
            classList.forEach(function (className) {
                const el = useQuerySelector
                    ? document.querySelectorAll(className)
                    : document.getElementsByClassName(className);

                for (let i = 0; i < el.length; i++) {
                    el && list.push(el[i]);
                }
            });

        list.forEach(function (node) {
            _this.classListChanger(node, addClass, removeClass);
        });
    };

    function changeVisibility(elements, addClass, removeClass) {
        (Array.isArray(elements) ? elements : [elements]).forEach(function (element) {
            var elems = typeof element === 'string' ? document.querySelectorAll(element) : element;
            if (!elems) return;
            (elems instanceof Element ? [elems] : Array.from(elems)).forEach(function (el) {
                if (!el || !el.classList) return;
                el.classList.remove(removeClass);
                el.classList.add(addClass);
            });
        });
    }

    _this.show = function () {
        changeVisibility(Array.from(arguments), 'vis', 'n-vis');
    };

    _this.hide = function () {
        changeVisibility(Array.from(arguments), 'n-vis', 'vis');
    };

    _this.setMessagePxyRecipient = function (messagePxy) {
        if (typeof window.$applozic !== 'function') {
            return;
        }

        var $ = window.$applozic;
        var $mck_msg_inner = $('#mck-message-cell .mck-message-inner');
        var $mck_msg_to = $('#mck-msg-to');

        if (!$mck_msg_inner || !$mck_msg_inner.length || !$mck_msg_to || !$mck_msg_to.length) {
            return;
        }

        var isgroupVal =
            typeof $mck_msg_inner.data === 'function' ? $mck_msg_inner.data('isgroup') : undefined;
        var isGroup = false;
        if (typeof isgroupVal !== 'undefined') {
            var normalized = String(isgroupVal).toLowerCase();
            isGroup =
                normalized === 'true' ||
                normalized === '1' ||
                isgroupVal === true ||
                isgroupVal === 1;
        }

        if (isGroup) {
            if (typeof $mck_msg_to.val === 'function') {
                messagePxy.groupId = $mck_msg_to.val();
            }
        } else {
            if (typeof $mck_msg_to.val === 'function') {
                messagePxy.to = $mck_msg_to.val();
            }
        }
    };

    /* Reason behind adding this is that typeof o == 'object' returns true incase of array also, by using this we can find out that value
     value passed is just a object or not. */
    _this.isObject = function (object) {
        if (!object) return false;
        return typeof object == 'object' && object.constructor == Object;
    };
    _this.isMessageContainsUrl = function (message) {
        if (!message) return false;
        var extractedUrl = message.match(/(https?:\/\/[^\s]+)/i);
        return extractedUrl && KommunicateUtils.isURL(extractedUrl[0]) ? extractedUrl[0] : false;
    };
    _this.getTimeOrDate = function (createdAtTime) {
        var labels = MCK_LABELS['time.stamp'];
        var secondsPast = Math.max(0, (Date.now() - new Date(createdAtTime).getTime()) / 1000);
        var seconds = Math.floor(secondsPast);
        if (seconds < 60) {
            return seconds + ' ' + (seconds <= 1 ? labels['sec.ago'] : labels['secs.ago']);
        }
        var minutes = Math.floor(seconds / 60);
        if (minutes < 60) {
            return minutes + ' ' + (minutes <= 1 ? labels['min.ago'] : labels['mins.ago']);
        }
        var hours = Math.floor(minutes / 60);
        if (hours <= 48) {
            return hours + ' ' + (hours <= 1 ? labels['hr.ago'] : labels['hrs.ago']);
        }
        var timeStamp = new Date(createdAtTime);
        var day = timeStamp.getDate();
        var month = timeStamp
            .toDateString()
            .match(/ [a-zA-Z]*/)[0]
            .replace(' ', '');
        var year =
            timeStamp.getFullYear() == new Date().getFullYear()
                ? ''
                : ' ' + timeStamp.getFullYear();
        return day + ' ' + month + year;
    };

    _this.setWidgetStateOpen = function (isWidgetOpen) {
        if (KommunicateCommons.IS_WIDGET_OPEN === isWidgetOpen) return; // return if same value is already assigned to IS_WIDGET_OPEN.
        KommunicateCommons.IS_WIDGET_OPEN = isWidgetOpen;
        if (IS_SOCKET_CONNECTED) {
            window.Applozic.SOCKET_DISCONNECT_PROCEDURE.stop();
        } else {
            KommunicateCommons.CONNECT_SOCKET_ON_WIDGET_CLICK && isWidgetOpen
                ? $applozic.fn.applozic('initializeSocketConnection', false)
                : window.Applozic.SOCKET_DISCONNECT_PROCEDURE.DISCONNECTED &&
                  isWidgetOpen &&
                  window.Applozic.ALSocket.checkConnected(true);
        }
    };

    _this.isWidgetOpen = function () {
        return KommunicateCommons.IS_WIDGET_OPEN;
    };

    _this.checkIfDeviceIsHandheld = function () {
        // Guard for SSR/non-browser environments
        if (typeof window === 'undefined' || typeof navigator === 'undefined') {
            return false;
        }

        // 1) Chromium UA-Client Hints
        var uaData = navigator.userAgentData;
        if (uaData && typeof uaData.mobile === 'boolean') {
            return uaData.mobile;
        }

        // Acquire UA string once after environment checks
        var ua = navigator.userAgent || navigator.vendor || window.opera || '';

        // 2) iPadOS 13+ reports as Mac; detect via touch points
        if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) {
            return true;
        }

        // 3) User-Agent fallback for phones and tablets
        var isPhone = /Android.*Mobile|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua);
        var isTablet = /iPad|Android(?!.*Mobile)/i.test(ua);
        if (isPhone || isTablet) {
            return true;
        }

        // 4) Coarse pointer as last resort
        if (
            typeof window.matchMedia === 'function' &&
            window.matchMedia('(pointer: coarse)').matches
        ) {
            return true;
        }

        return false;
    };

    _this.removeHtmlTag = function (html) {
        var temporalDivElement = document.createElement('div');
        temporalDivElement.innerHTML = html;
        return temporalDivElement.textContent || temporalDivElement.innerText || '';
    };
    _this.formatHtmlTag = function (html) {
        return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };
    _this.isConversationClosedByBot = function () {
        if (CURRENT_GROUP_DATA.groupMembers && Array.isArray(CURRENT_GROUP_DATA.groupMembers)) {
            var filtered = CURRENT_GROUP_DATA.groupMembers.filter(function (member) {
                return member.userId == CURRENT_GROUP_DATA.lastMessagingMember;
            });
            return (
                filtered[0] && filtered[0].role == KommunicateConstants.APPLOZIC_USER_ROLE_TYPE.BOT
            );
        } else {
            return false;
        }
    };

    _this.getRatingSmilies = function (rating) {
        return KommunicateConstants.RATINGS_SVG[rating];
    };

    _this.getDefaultAvatarImageSvg = function () {
        return KommunicateConstants.DEFAULT_AVATAR_IMAGE;
    };

    _this.getFeedback = function (tabId, onSuccessCallback) {
        mckUtils.ajax({
            headers: {
                'x-authorization': window.Applozic.ALApiService.AUTH_TOKEN,
            },
            type: 'GET',
            url: Kommunicate.getBaseUrl() + '/rest/ws/feedback/v2/' + tabId,
            contentType: 'application/json',
            success: onSuccessCallback,
            error: function (err) {
                console.log('Error fetching feedback', err);
            },
        });
    };

    _this.debounce = function (func, wait, immediate) {
        var timeout;
        return function () {
            var context = this,
                args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };
}
