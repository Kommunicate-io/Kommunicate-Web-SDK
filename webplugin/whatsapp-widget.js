(function (window, document) {
    'use strict';

    var STYLE_ID = 'kommunicate-whatsapp-widget-style';
    var LAUNCHER_ID = 'km-whatsapp-launcher';
    var DEFAULT_API_URL = 'https://apps.kommunicate.io';

    function escapeHtml(value) {
        return String(value).replace(/[&<>'"]/g, function (character) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;',
            }[character];
        });
    }

    function getWhatsAppUrl(number) {
        var digits = String(number || '').replace(/\D/g, '');
        return digits ? 'https://wa.me/' + digits : '';
    }

    function addStyles() {
        if (document.getElementById(STYLE_ID)) {
            return;
        }
        var style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent =
            '#km-whatsapp-launcher{position:fixed;z-index:2243001;min-width:220px;height:56px;padding:0 24px;border-radius:30px;display:flex;align-items:center;justify-content:center;background:#25d366;color:#fff;text-decoration:none;box-shadow:0 2px 5px 1px rgba(107,104,104,.5);box-sizing:border-box;font:600 16px/1 Arial,sans-serif}#km-whatsapp-launcher:hover,#km-whatsapp-launcher:focus{color:#fff;text-decoration:none}#km-whatsapp-launcher .km-whatsapp-launcher-icon{width:26px;height:26px;display:flex;flex:0 0 auto}#km-whatsapp-launcher .km-whatsapp-launcher-label{margin-left:10px;white-space:nowrap}#km-whatsapp-launcher .km-whatsapp-launcher-icon svg{width:100%;height:100%;fill:currentColor}@media only screen and (max-width:600px){#km-whatsapp-launcher{max-width:calc(100vw - 20px)}}';
        document.head.appendChild(style);
    }

    function render(settings, onError) {
        var chatWidget = settings.chatWidget || settings;
        var url = getWhatsAppUrl(chatWidget.whatsappNumber);
        var launcher = document.getElementById(LAUNCHER_ID);
        if (launcher) {
            launcher.remove();
        }
        if (!chatWidget.showWhatsAppOnWidget || !url) {
            onError('WhatsApp is disabled or no WhatsApp number is saved for this App ID.');
            return;
        }

        addStyles();
        var label = escapeHtml(chatWidget.whatsappLabel || 'Chat on WhatsApp');
        launcher = document.createElement('a');
        launcher.id = LAUNCHER_ID;
        launcher.href = url;
        launcher.target = '_blank';
        launcher.rel = 'noopener noreferrer';
        launcher.setAttribute('aria-label', label);
        launcher.title = label;
        launcher.innerHTML =
            '<span class="km-whatsapp-launcher-icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.5 0 .2 5.3.2 11.9c0 2.1.5 4.1 1.6 5.9L.1 24l6.3-1.6a11.9 11.9 0 0 0 5.7 1.4h.1c6.5 0 11.8-5.3 11.8-11.9 0-3.2-1.2-6.2-3.5-8.4Zm-8.4 18.3h-.1a9.9 9.9 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.7-.2-.4a9.9 9.9 0 0 1-1.5-5.2c0-5.5 4.4-9.9 9.9-9.9 2.6 0 5.1 1 7 2.9a9.8 9.8 0 0 1 2.9 7c0 5.5-4.5 9.9-9.9 9.9Zm5.4-7.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.2l-.9 1.1c-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.2.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.2-.6-.4Z"/></svg></span><span class="km-whatsapp-launcher-label">' +
            label +
            '</span>';
        document.body.appendChild(launcher);
        var customPosition = chatWidget.whatsappCustomPosition || {};
        var horizontalPosition = chatWidget.whatsappPosition === 'left' ? 'left' : 'right';
        var oppositePosition = horizontalPosition === 'left' ? 'right' : 'left';
        var horizontalOffset = customPosition[horizontalPosition];
        launcher.style.bottom =
            (customPosition.bottom == null || customPosition.bottom === ''
                ? 20
                : customPosition.bottom) + 'px';
        launcher.style[horizontalPosition] =
            (horizontalOffset == null || horizontalOffset === '' ? 20 : horizontalOffset) + 'px';
        launcher.style[oppositePosition] = 'auto';
    }

    function load(options) {
        var request = new XMLHttpRequest();
        var apiUrl = (options.apiUrl || DEFAULT_API_URL).replace(/\/$/, '');
        request.open(
            'GET',
            apiUrl + '/users/v3/chat/plugin/settings?appId=' + encodeURIComponent(options.appId),
            true
        );
        request.onload = function () {
            if (request.status >= 200 && request.status < 300) {
                try {
                    var payload = JSON.parse(request.responseText);
                    render(payload.response || payload, options.onError);
                } catch (error) {
                    options.onError('WhatsApp settings response is invalid.');
                    console.error(error);
                }
                return;
            }
            options.onError('WhatsApp settings request failed with status ' + request.status + '.');
            console.error('Kommunicate WhatsApp settings request failed:', request.status);
        };
        request.onerror = function () {
            options.onError('WhatsApp settings request could not be completed.');
            console.error('Kommunicate WhatsApp settings request could not be completed.');
        };
        request.send();
    }

    window.KommunicateWhatsApp = {
        init: function (options) {
            options = options || {};
            options.onError = options.onError || function () {};
            if (!options.appId) {
                throw new Error('KommunicateWhatsApp.init requires an appId.');
            }
            if (options.settings) {
                render(options.settings, options.onError);
                return;
            }
            load(options);
        },
        destroy: function () {
            var launcher = document.getElementById(LAUNCHER_ID);
            launcher && launcher.remove();
        },
    };
})(window, document);
