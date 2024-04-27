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
        USE_BRANDING =
            typeof optns.useBranding == 'boolean' ? optns.useBranding : true;
        WIDGET_SETTINGS = optns.widgetSettings;
        KommunicateCommons.CONNECT_SOCKET_ON_WIDGET_CLICK =
            optns.connectSocketOnWidgetClick || false;
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
            (data.pricingPackage ==
                KommunicateConstants.PRICING_PACKAGE.ENTERPRISE_MONTHLY ||
                data.pricingPackage ==
                    KommunicateConstants.PRICING_PACKAGE.ENTERPRISE_YEARLY)
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

    _this.modifyClassList = function (elem, addClass, removeClass) {
        var idList = elem.id,
            classList = elem.class,
            list = [];
        idList &&
            idList.forEach(function (id) {
                document.getElementById(id) &&
                    list.push(document.getElementById(id));
            });
        classList &&
            classList.forEach(function (className) {
                var el = document.getElementsByClassName(className);
                for (var i = 0; i <= el.length - 1; i++) {
                    el && list.push(el[i]);
                }
            });
        list.forEach(function (node) {
            _this.classListChanger(node, addClass, removeClass);
        });
    };

    /* Reason behind adding this is that typeof o == 'object' returns true incase of array also, by using this we can find out that value
     value passed is just a object or not. */
    _this.isObject = function (object) {
        if (!object) return false;
        return typeof object == 'object' && object.constructor == Object;
    };
    _this.isUrlValid = function (url) {
        if (!url) return false;
        return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
            url
        );
    };
    _this.isMessageContainsUrl = function (message) {
        var urlReg = new RegExp(
            '([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?([^ ])+'
        );
        var extractedUrl = message ? message.match(urlReg) : '';
        return message && extractedUrl
            ? this.isUrlValid(extractedUrl[0])
                ? extractedUrl[0]
                : false
            : false;
    };
    _this.getTimeOrDate = function (createdAtTime) {
        var timeStampLabels = MCK_LABELS['time.stamp'];
        var timeStamp = new Date(createdAtTime);
        var currentTime = new Date(),
            secondsPast = Math.max(
                0,
                (currentTime.getTime() - timeStamp.getTime()) / 1000
            );
        if (secondsPast < 60) {
            return (
                parseInt(secondsPast) +
                ' ' +
                (parseInt(secondsPast) <= 1
                    ? timeStampLabels['sec.ago']
                    : timeStampLabels['secs.ago'])
            );
        }
        if (secondsPast < 3600) {
            return (
                parseInt(secondsPast / 60) +
                ' ' +
                (parseInt(secondsPast / 60) <= 1
                    ? timeStampLabels['min.ago']
                    : timeStampLabels['mins.ago'])
            );
        }
        if (secondsPast <= 172800) {
            return (
                parseInt(secondsPast / 3600) +
                ' ' +
                (parseInt(secondsPast / 3600) <= 1
                    ? timeStampLabels['hr.ago']
                    : timeStampLabels['hrs.ago'])
            );
        }
        if (secondsPast > 172800) {
            day = timeStamp.getDate();
            month = timeStamp
                .toDateString()
                .match(/ [a-zA-Z]*/)[0]
                .replace(' ', '');
            year =
                timeStamp.getFullYear() == currentTime.getFullYear()
                    ? ''
                    : ' ' + timeStamp.getFullYear();
            return day + ' ' + month + year;
        }
    };

    _this.setWidgetStateOpen = function (isWidgetOpen) {
        if (KommunicateCommons.IS_WIDGET_OPEN === isWidgetOpen) return; // return if same value is already assigned to IS_WIDGET_OPEN.
        KommunicateCommons.IS_WIDGET_OPEN = isWidgetOpen;
        if (IS_SOCKET_CONNECTED) {
            window.Applozic.SOCKET_DISCONNECT_PROCEDURE.stop();
        } else {
            KommunicateCommons.CONNECT_SOCKET_ON_WIDGET_CLICK
                ? $applozic.fn.applozic('initializeSocketConnection', false)
                : window.Applozic.SOCKET_DISCONNECT_PROCEDURE.DISCONNECTED &&
                  window.Applozic.ALSocket.checkConnected(true);
        }
    };

    _this.isWidgetOpen = function () {
        return KommunicateCommons.IS_WIDGET_OPEN;
    };

    _this.checkIfDeviceIsHandheld = function () {
        var check = false;
        (function (deviceInfo) {
            if (
                /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
                    deviceInfo
                ) ||
                /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                    deviceInfo.substr(0, 4)
                )
            ) {
                check = true;
            }
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    };

    _this.removeHtmlTag = function (html) {
        var temporalDivElement = document.createElement('div');
        temporalDivElement.innerHTML = html;
        return (
            temporalDivElement.textContent || temporalDivElement.innerText || ''
        );
    };
    _this.formatHtmlTag = function (html) {
        return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };
    _this.isConversationClosedByBot = function () {
        if (
            CURRENT_GROUP_DATA.groupMembers &&
            Array.isArray(CURRENT_GROUP_DATA.groupMembers)
        ) {
            var filtered = CURRENT_GROUP_DATA.groupMembers.filter(function (
                member
            ) {
                return member.userId == CURRENT_GROUP_DATA.lastMessagingMember;
            });
            return (
                filtered[0] &&
                filtered[0].role ==
                    KommunicateConstants.APPLOZIC_USER_ROLE_TYPE.BOT
            );
        } else {
            return false;
        }
    };

    _this.getRatingSmilies = function (rating) {
        return KommunicateConstants.RATINGS_SVG[rating];
    };

    _this.generateStarSvgs = function (rating) {
        const ratingSVGs = Array.from(
            { length: rating },
            () => KommunicateConstants.STAR_SVG
        );
        return ratingSVGs.join('');
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
            global: false,
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
