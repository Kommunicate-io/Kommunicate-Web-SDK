/**
 * Offline ticket form: shown instead of starting a chat when the team is unavailable.
 * Configured in Dashboard > Settings > Offline Ticket Form (appSettings.chatWidget.offlineTicketForm).
 * Kommunicate-Server creates the ticket conversation and emails it (POST /rest/ws/offline-ticket),
 * authenticated with the visitor's chat token.
 */
var KmOfflineTicketForm = (function () {
    var PANEL_ID = 'km-offline-ticket-panel';
    var SUBMIT_URL = '/rest/ws/offline-ticket';
    var AGENTS_ONLINE_URL = '/rest/ws/offline-ticket/agents-online';
    var EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // replies go to the visitor's email, so it is always collected
    var LOCKED_FIELD_KEYS = ['email'];
    var MULTI_LINE_TYPE = 'textarea';
    var SHOW_WHEN = {
        OUTSIDE_BUSINESS_HOURS: 'OUTSIDE_BUSINESS_HOURS',
        AGENTS_OFFLINE: 'AGENTS_OFFLINE',
    };

    function request(type, path, data) {
        return new Promise(function (resolve, reject) {
            window.$applozic.ajax({
                type: type,
                url: Kommunicate.getBaseUrl() + path,
                headers: { 'x-authorization': window.Applozic.ALApiService.AUTH_TOKEN },
                contentType: 'application/json',
                data: data ? JSON.stringify(data) : undefined,
                global: false,
                success: resolve,
                error: reject,
            });
        });
    }

    // Builds elements with textContent only: labels and texts come from settings/visitors.
    function createElement(tag, attributes, text) {
        var element = document.createElement(tag);
        Object.keys(attributes || {}).forEach(function (name) {
            element.setAttribute(name, attributes[name]);
        });
        if (text) {
            element.textContent = text;
        }
        return element;
    }

    function getVisibleFields(form) {
        return (form.fields || []).filter(function (field) {
            return field.enabled !== false || LOCKED_FIELD_KEYS.indexOf(field.key) !== -1;
        });
    }

    function isRequired(field) {
        return field.required || LOCKED_FIELD_KEYS.indexOf(field.key) !== -1;
    }

    /**
     * @param {Object} form offlineTicketForm settings
     * @param {Function} isOutsideBusinessHours resolves true when the conversation's team is closed
     * @returns {Promise<boolean>} whether the ticket form should replace the chat
     */
    function shouldShow(form, isOutsideBusinessHours) {
        if (!form || !form.enabled) {
            return Promise.resolve(false);
        }
        var checkHours = form.showWhen !== SHOW_WHEN.AGENTS_OFFLINE;
        var checkAgents = form.showWhen !== SHOW_WHEN.OUTSIDE_BUSINESS_HOURS;
        return Promise.all([
            checkHours ? isOutsideBusinessHours() : false,
            checkAgents
                ? request('GET', AGENTS_ONLINE_URL).then(function (response) {
                      return !(response && response.data && response.data.agentsOnline);
                  })
                : false,
        ]).then(function (results) {
            return results[0] || results[1];
        });
    }

    function close() {
        var panel = document.getElementById(PANEL_ID);
        panel && panel.parentNode.removeChild(panel);
    }

    // The widget lives in an about:blank iframe; the ticket should record the host page.
    function getPageUrl() {
        try {
            var url = window.parent.location.href;
            return /^https?:/.test(url) ? url : '';
        } catch (e) {
            return '';
        }
    }

    function renderField(field) {
        var id = 'km-offline-ticket-' + field.key;
        var wrapper = createElement('div', { class: 'km-offline-ticket-field' });
        var label = createElement('label', { for: id }, field.label);
        if (isRequired(field)) {
            label.appendChild(createElement('span', { 'aria-hidden': 'true' }, ' *'));
        }
        var input = createElement(field.type === 'textarea' ? 'textarea' : 'input', {
            id: id,
            name: field.key,
            // same limits as Kommunicate-Server
            maxlength: field.type === MULTI_LINE_TYPE ? '5000' : '500',
        });
        if (field.type !== 'textarea') {
            input.setAttribute(
                'type',
                field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'
            );
        } else {
            input.setAttribute('rows', '4');
        }
        isRequired(field) && input.setAttribute('aria-required', 'true');
        var error = createElement('div', {
            class: 'km-offline-ticket-error',
            id: id + '-error',
            role: 'alert',
        });
        input.setAttribute('aria-describedby', error.id);
        wrapper.appendChild(label);
        wrapper.appendChild(input);
        wrapper.appendChild(error);
        return wrapper;
    }

    function validate(panel, fields, labels) {
        var values = {};
        var firstInvalid = null;
        fields.forEach(function (field) {
            var input = panel.querySelector('[name="' + field.key + '"]');
            var error = document.getElementById(input.id + '-error');
            var value = input.value.trim();
            var message = '';
            if (isRequired(field) && !value) {
                message = labels.required;
            } else if (field.key === 'email' && !EMAIL_REGEX.test(value)) {
                message = labels.invalidEmail;
            }
            error.textContent = message;
            input.setAttribute('aria-invalid', message ? 'true' : 'false');
            if (message && !firstInvalid) {
                firstInvalid = input;
            }
            values[field.key] = value;
        });
        firstInvalid && firstInvalid.focus();
        return firstInvalid ? null : values;
    }

    function showSuccess(body, form, labels, dismiss) {
        body.innerHTML = '';
        body.appendChild(
            createElement(
                'div',
                { class: 'km-offline-ticket-success', role: 'status' },
                form.successMessage
            )
        );
        var closeButton = createElement(
            'button',
            { type: 'button', class: 'km-offline-ticket-submit' },
            labels.close
        );
        closeButton.addEventListener('click', dismiss);
        body.appendChild(closeButton);
        closeButton.focus();
    }

    /**
     * Renders the form as a bottom sheet over the conversation screen, in place of the chat box.
     * The widget header (back/close) stays usable above it.
     * @param {Object} form offlineTicketForm settings
     * @param {Object} labels MCK_LABELS['offline.ticket']
     * @param {Function} onSubmitted called with the submitted values (e.g. to update the user)
     * @param {Function} [onDismiss] called after the visitor closes the form
     */
    function open(form, labels, onSubmitted, onDismiss) {
        close();
        var dismiss = function () {
            close();
            onDismiss && onDismiss();
        };
        var container = document.getElementById('mck-sidebox-content');
        var fields = getVisibleFields(form);
        var panel = createElement('div', { id: PANEL_ID, class: 'km-offline-ticket-panel' });
        // starts below the header, whose height depends on the widget layout
        panel.style.top = container.querySelector('.mck-box-top').offsetHeight + 'px';
        var sheet = createElement('form', {
            'class': 'km-offline-ticket-sheet',
            'novalidate': 'true',
            'aria-labelledby': 'km-offline-ticket-heading',
        });
        sheet.appendChild(
            createElement('div', { 'class': 'km-offline-ticket-handle', 'aria-hidden': 'true' })
        );
        var body = createElement('div', { class: 'km-offline-ticket-body' });
        body.appendChild(
            createElement(
                'h2',
                { id: 'km-offline-ticket-heading', class: 'km-offline-ticket-heading' },
                form.heading
            )
        );
        form.description &&
            body.appendChild(
                createElement('p', { class: 'km-offline-ticket-description' }, form.description)
            );
        fields.forEach(function (field) {
            body.appendChild(renderField(field));
        });
        var formError = createElement('div', { class: 'km-offline-ticket-error', role: 'alert' });
        var submit = createElement(
            'button',
            { type: 'submit', class: 'km-offline-ticket-submit' },
            labels.submit
        );
        body.appendChild(formError);
        body.appendChild(submit);
        sheet.appendChild(body);
        sheet.addEventListener('submit', function (event) {
            event.preventDefault();
            var values = validate(panel, fields, labels);
            if (!values) {
                return;
            }
            submit.setAttribute('disabled', 'true');
            submit.textContent = labels.sending;
            formError.textContent = '';
            request('POST', SUBMIT_URL, { values: values, pageUrl: getPageUrl() })
                .then(function () {
                    onSubmitted && onSubmitted(values);
                    showSuccess(body, form, labels, dismiss);
                })
                .catch(function (xhr) {
                    var code = xhr && xhr.responseJSON && xhr.responseJSON.code;
                    formError.textContent =
                        code === 'OFFLINE_TICKET_RATE_LIMITED' ? labels.rateLimited : labels.error;
                    submit.removeAttribute('disabled');
                    submit.textContent = labels.submit;
                });
        });
        panel.appendChild(sheet);
        container.appendChild(panel);
        var firstInput = panel.querySelector('input, textarea');
        firstInput && firstInput.focus();
    }

    return { shouldShow: shouldShow, open: open, close: close };
})();
