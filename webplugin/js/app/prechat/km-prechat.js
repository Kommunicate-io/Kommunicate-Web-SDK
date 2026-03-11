var KMPreChat = (function () {
    'use strict';

    function attachPasswordToggle(container, input, labels) {
        if (!container || !input || input.type !== 'password') {
            return;
        }
        if (container.querySelector('.km-password-toggle')) {
            return;
        }
        container.classList.add('km-password-field');

        var inputWrapper = document.createElement('div');
        inputWrapper.className = 'km-password-input';
        if (input.parentNode) {
            input.parentNode.insertBefore(inputWrapper, input);
            inputWrapper.appendChild(input);
        } else {
            inputWrapper.appendChild(input);
            container.appendChild(inputWrapper);
        }

        var toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'km-password-toggle';
        var showLabel = (labels && labels.showPassword) || 'Show password';
        var hideLabel = (labels && labels.hidePassword) || 'Hide password';
        toggle.setAttribute('aria-label', showLabel);
        toggle.innerHTML =
            '<span class="km-eye-on" aria-hidden="true">' +
            '<svg viewBox="0 0 24 24" width="16" height="16" focusable="false">' +
            '<path d="M12 5C6.5 5 2 12 2 12s4.5 7 10 7 10-7 10-7-4.5-7-10-7zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"></path>' +
            '</svg>' +
            '</span>' +
            '<span class="km-eye-off" aria-hidden="true">' +
            '<svg viewBox="0 0 24 24" width="16" height="16" focusable="false">' +
            '<path d="M4.27 3L3 4.27l3.3 3.3C4.16 9.2 2 12 2 12s4.5 7 10 7c2.02 0 3.86-.6 5.45-1.55L19.73 20 21 18.73 4.27 3zM12 17c-3.3 0-6.2-3.1-7.45-5 0 0 1.48-2.07 3.8-3.55l1.46 1.46A4 4 0 0 0 12 16a3.96 3.96 0 0 0 2.09-.62l1.45 1.45A7.8 7.8 0 0 1 12 17zm0-10a3.96 3.96 0 0 1 3.54 2.2l-1.12 1.12A2.5 2.5 0 0 0 12 9.5c-.3 0-.6.05-.86.16L9.72 8.24A3.96 3.96 0 0 1 12 7z"></path>' +
            '</svg>' +
            '</span>';

        toggle.addEventListener('click', function () {
            var isVisible = input.type === 'text';
            input.type = isVisible ? 'password' : 'text';
            container.classList.toggle('is-visible', !isVisible);
            toggle.setAttribute('aria-label', isVisible ? showLabel : hideLabel);
        });
        inputWrapper.appendChild(toggle);
    }

    function attach(target, deps) {
        if (!target || !deps) {
            return;
        }
        if (!Array.isArray(deps.KM_PRELEAD_COLLECTION)) {
            deps.KM_PRELEAD_COLLECTION = [];
        }
        if (!Array.isArray(deps.KM_ASK_USER_DETAILS)) {
            deps.KM_ASK_USER_DETAILS = [];
        }
        var $applozic = deps.$applozic;
        var kommunicateCommons = deps.kommunicateCommons;
        var mckMessageService = deps.mckMessageService;
        var mckUtils = deps.mckUtils;

        function getLeadCollectionLabel(key, fallback) {
            if (!key) {
                return fallback || '';
            }
            var leadLabels =
                deps.MCK_LABELS && deps.MCK_LABELS['lead.collection']
                    ? deps.MCK_LABELS['lead.collection']
                    : null;
            if (leadLabels && leadLabels[key]) {
                return leadLabels[key];
            }
            if (deps.MCK_LABELS) {
                var flatKey = 'lead.collection.' + key;
                if (deps.MCK_LABELS[flatKey]) {
                    return deps.MCK_LABELS[flatKey];
                }
            }
            return fallback || '';
        }

        var syncPreLeadCollectionFromOptions = function () {
            var options = deps.appOptions || {};
            var collectionSource =
                options.preLeadCollection ||
                (options.appSettings &&
                    options.appSettings.collectLead &&
                    options.appSettings.leadCollection);
            if (Array.isArray(collectionSource) && collectionSource.length) {
                deps.KM_PRELEAD_COLLECTION.length = 0;
                Array.prototype.push.apply(deps.KM_PRELEAD_COLLECTION, collectionSource);
            } else {
                deps.KM_PRELEAD_COLLECTION.length = 0;
            }
            if (Array.isArray(options.askUserDetails) && options.askUserDetails.length) {
                deps.KM_ASK_USER_DETAILS.length = 0;
                Array.prototype.push.apply(deps.KM_ASK_USER_DETAILS, options.askUserDetails);
            } else {
                deps.KM_ASK_USER_DETAILS.length = 0;
            }
        };

        target.getPreLeadDataForAskUserDetail = function () {
            if (!Array.isArray(deps.KM_ASK_USER_DETAILS)) {
                deps.KM_ASK_USER_DETAILS = [];
            }
            var LEAD_COLLECTION_LABEL = deps.MCK_LABELS['lead.collection'] || {};
            var KM_USER_DETAIL_TYPE_MAP = {
                email: 'email',
                phone: 'number',
            };
            var preLeadCollection = deps.KM_PRELEAD_COLLECTION;
            if (deps.KM_ASK_USER_DETAILS && preLeadCollection.length === 0) {
                for (var i = 0; i < deps.KM_ASK_USER_DETAILS.length; i++) {
                    var obj = {};
                    obj.field = deps.KM_ASK_USER_DETAILS[i];
                    obj.type = KM_USER_DETAIL_TYPE_MAP[deps.KM_ASK_USER_DETAILS[i]] || 'text';
                    obj.placeholder =
                        LEAD_COLLECTION_LABEL[deps.KM_ASK_USER_DETAILS[i]] ||
                        getLeadCollectionLabel(deps.KM_ASK_USER_DETAILS[i], '');
                    obj.required = true;
                    deps.KM_PRELEAD_COLLECTION.push(obj);
                }
            }
        };

        target.loginInputKeyup = function (input) {
            input.addEventListener('keyup', function (event) {
                var targetEl = event.target;
                var isClassExist = targetEl.classList.contains('km-login-error');
                if (isClassExist) {
                    input.classList.remove('km-login-error');
                    targetEl.nextElementSibling &&
                        (targetEl.nextElementSibling.style.display = 'none');
                }
            });
        };

        target.createPreChatLabel = function (leadCollection, inputId) {
            var kmLabelDiv = document.createElement('div');
            kmLabelDiv.setAttribute('class', 'km-form-label-container');
            var fieldName = leadCollection.field;
            var requiredSVG =
                '<svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.74006 5.18182L2.83807 3.45597L1.3892 4.40625L0.869318 3.50284L2.41619 2.72727L0.869318 1.9517L1.3892 1.0483L2.83807 1.99858L2.74006 0.272727H3.77557L3.68182 1.99858L5.13068 1.0483L5.65057 1.9517L4.09943 2.72727L5.65057 3.50284L5.13068 4.40625L3.68182 3.45597L3.77557 5.18182H2.74006Z" fill="#D64242"/></svg>';
            var label =
                "<label class='km-form-label km-tertiary-title' for='" +
                inputId +
                "'>" +
                fieldName +
                (leadCollection.required ? ' ' + requiredSVG : '') +
                '</label>';
            kmLabelDiv.innerHTML = label;
            return kmLabelDiv;
        };

        target.createInputContainer = function (id) {
            var kmChatInputDiv = document.createElement('div');
            kmChatInputDiv.setAttribute('id', id + '-container');
            kmChatInputDiv.setAttribute('class', 'km-form-group km-form-group-container');
            return kmChatInputDiv;
        };

        target.createInputField = function (preLeadCollection) {
            var rawField = (preLeadCollection.field || '').toString();
            var normalizedField = rawField.toLowerCase().replace(/\s+/g, '');
            var localizedUserId = (deps.MCK_LABELS['form.label.userId'] || '')
                .toString()
                .toLowerCase()
                .replace(/\s+/g, '');
            var localizedPassword = getLeadCollectionLabel('password', '')
                .toString()
                .toLowerCase()
                .replace(/\s+/g, '');
            var isUserIdField =
                normalizedField === 'userid' ||
                (localizedUserId && normalizedField === localizedUserId);
            var isPasswordField =
                normalizedField === 'password' ||
                (localizedPassword && normalizedField === localizedPassword) ||
                preLeadCollection.type === 'password';
            var forcedId = preLeadCollection.id || preLeadCollection.inputId;
            if (
                !forcedId &&
                typeof preLeadCollection.name === 'string' &&
                preLeadCollection.name.indexOf('km-') === 0
            ) {
                forcedId = preLeadCollection.name;
            }
            var inputId =
                forcedId ||
                (isUserIdField
                    ? 'km-userId'
                    : isPasswordField
                    ? 'km-password'
                    : 'km-' + rawField.toLowerCase().replace(' ', '-'));

            var kmChatInputDiv = target.createInputContainer(inputId);
            var kmLabelDiv = target.createPreChatLabel(preLeadCollection, inputId);

            var kmChatInput = document.createElement(preLeadCollection.element || 'input');
            var preLeadCollectionClass =
                'km-form-control ' +
                (preLeadCollection.element === 'textarea'
                    ? 'mck-preleadcollection-textarea'
                    : 'km-input-width');
            kmChatInput.setAttribute('class', preLeadCollectionClass);

            kmChatInput.setAttribute('id', inputId);
            var inputName =
                preLeadCollection.name && preLeadCollection.name.indexOf('km-') === 0
                    ? preLeadCollection.name
                    : inputId;
            kmChatInput.setAttribute('name', inputName);
            if (preLeadCollection.required) {
                kmChatInput.setAttribute('required', preLeadCollection.required);
            }
            if (
                preLeadCollection.element === 'select' &&
                preLeadCollection.options &&
                mckMessageService.checkArray(preLeadCollection.options)
            ) {
                kmChatInput = target.createSelectFieldDropdown(
                    preLeadCollection.options,
                    kmChatInput
                );
            } else {
                kmChatInput.setAttribute('type', preLeadCollection.type || 'text');
                kmChatInput.setAttribute('placeholder', preLeadCollection.placeholder || '');
                kmChatInput.setAttribute('aria-label', preLeadCollection.field);
                if (preLeadCollection.type === 'email') {
                    kmChatInput.setAttribute('pattern', '^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$');
                    kmChatInput.setAttribute('title', '');
                    kmChatInput.setAttribute(
                        'oninvalid',
                        "setCustomValidity('" +
                            getLeadCollectionLabel(
                                'errorEmail',
                                'Please enter a valid email address'
                            ) +
                            "')"
                    );
                    kmChatInput.setAttribute('oninput', "setCustomValidity('')");
                }
            }
            $applozic(kmChatInputDiv).append(kmLabelDiv, kmChatInput);
            if (isPasswordField) {
                attachPasswordToggle(
                    kmChatInputDiv,
                    kmChatInput,
                    deps.MCK_LABELS['lead.collection'] || {}
                );
            }
            return kmChatInputDiv;
        };

        target.addLeadCollectionInputDiv = function () {
            if (!Array.isArray(deps.KM_PRELEAD_COLLECTION)) {
                deps.KM_PRELEAD_COLLECTION = [];
            }
            if (!Array.isArray(deps.KM_ASK_USER_DETAILS)) {
                deps.KM_ASK_USER_DETAILS = [];
            }
            if (!deps.KM_PRELEAD_COLLECTION.length) {
                syncPreLeadCollectionFromOptions();
            }
            deps.KM_ASK_USER_DETAILS.length && target.getPreLeadDataForAskUserDetail();
            if (
                typeof deps.MCK_AUTHENTICATION_TYPE_ID !== 'undefined' &&
                deps.MCK_AUTHENTICATION_TYPE_ID > 0
            ) {
                var hasUserId = deps.KM_PRELEAD_COLLECTION.some(function (item) {
                    return (
                        item &&
                        typeof item.field === 'string' &&
                        item.field.toLowerCase().replace(/\s+/g, '') === 'userid'
                    );
                });
                var hasPassword = deps.KM_PRELEAD_COLLECTION.some(function (item) {
                    return (
                        item &&
                        typeof item.field === 'string' &&
                        item.field.toLowerCase().replace(/\s+/g, '') === 'password'
                    );
                });
                var leadLabels = deps.MCK_LABELS['lead.collection'] || {};
                if (!hasUserId) {
                    deps.KM_PRELEAD_COLLECTION.push({
                        id: 'km-userId',
                        name: 'km-userId',
                        field: leadLabels.userId || 'User ID',
                        type: 'text',
                        placeholder: leadLabels.userId || 'User ID',
                        required: true,
                    });
                }
                if (!hasPassword) {
                    deps.KM_PRELEAD_COLLECTION.push({
                        id: 'km-password',
                        name: 'km-password',
                        field:
                            leadLabels.password || getLeadCollectionLabel('password', 'Password'),
                        type: 'password',
                        placeholder:
                            leadLabels.password || getLeadCollectionLabel('password', 'Password'),
                        required: true,
                    });
                }
            }
            var enableCountryCode = false;
            for (var i = 0; i < deps.KM_PRELEAD_COLLECTION.length; i++) {
                var dataToCollect = deps.KM_PRELEAD_COLLECTION[i];
                if (dataToCollect.field.toLowerCase() === 'phone') {
                    enableCountryCode = dataToCollect.enableCountryCode;
                }
                var kmInputField = target.createInputField(dataToCollect);
                $applozic('.km-last-child').append(kmInputField);
            }
            target.addPhoneNumberValidation(enableCountryCode);
            target.addPreChatInlineValidation();
        };

        target.addPhoneNumberValidation = function (enableCountryCode) {
            var phoneField = document.getElementById('km-phone');
            if (phoneField !== null && enableCountryCode) {
                phoneField.type = 'tel';
                phoneField.classList.add('phone-with-code');
                deps.setIntlTelInstance(
                    window.intlTelInput(phoneField, {
                        containerClass: 'km-intl-container  km-input-width',
                        separateDialCode: true,
                        initialCountry: 'auto',
                        geoIpLookup: target.geoIpLookupFunction,
                        loadUtils: function () {
                            return import(window.MCK_STATICPATH + '/lib/js/intl-tel-utils.js');
                        },
                        formatAsYouType: false,
                        strictMode: false,
                        useFullscreenPopup: false,
                        dropdownContainer: phoneField.closest('.km-form-group') || document.body,
                    })
                );
                phoneField.addEventListener('keydown', target.phoneNumberValidation);
            }
        };

        target.geoIpLookupFunction = function (callback) {
            if (!mckUtils || typeof mckUtils.ajax !== 'function') {
                callback('us');
                return;
            }
            mckUtils.ajax({
                url: 'https://ipapi.co/json',
                success: function (data) {
                    callback(data.country_code);
                },
                error: function () {
                    callback('us');
                },
            });
        };

        target.phoneNumberValidation = function (e) {
            e.target.value = e.target.value.match(/^([0-9]{0,15})/)[0];
        };

        target.addPreChatInlineValidation = function () {
            var errorNode = document.getElementById('km-error-chat-login');
            var emailField = document.getElementById('km-email');
            var phoneField = document.getElementById('km-phone');

            var setError = function (message) {
                if (!errorNode) {
                    return;
                }
                if (!kommunicateCommons || typeof kommunicateCommons.show !== 'function') {
                    errorNode.textContent = message || '';
                    if (message) {
                        errorNode.classList.remove('hide', 'n-vis');
                        errorNode.classList.add('show', 'vis');
                    } else {
                        errorNode.classList.remove('show', 'vis');
                        errorNode.classList.add('hide', 'n-vis');
                    }
                    return;
                }
                if (message) {
                    errorNode.classList.remove('hide', 'show');
                    errorNode.textContent = message;
                    kommunicateCommons.show(errorNode);
                } else {
                    errorNode.classList.remove('show');
                    errorNode.classList.add('hide');
                    errorNode.textContent = '';
                    kommunicateCommons.hide(errorNode);
                }
            };

            if (emailField) {
                var emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/;
                var handleEmailValidation = function () {
                    var value = (emailField.value || '').toLowerCase();
                    if (!value) {
                        setError('');
                        return;
                    }
                    if (!emailRegex.test(value)) {
                        setError(
                            getLeadCollectionLabel(
                                'errorEmail',
                                'Please enter a valid email address'
                            )
                        );
                    } else {
                        setError('');
                    }
                };
                emailField.addEventListener('input', handleEmailValidation);
                emailField.addEventListener('blur', handleEmailValidation);
            }

            if (phoneField) {
                var handlePhoneValidation = function () {
                    var value = phoneField.value || '';
                    if (!value) {
                        setError('');
                        return;
                    }
                    var isValid = true;
                    var intlInstance = deps.getIntlTelInstance();
                    if (intlInstance) {
                        isValid = intlInstance.isValidNumber();
                    } else {
                        var digitsOnly = value.replace(/\\D/g, '');
                        isValid = digitsOnly.length >= 7 && digitsOnly.length <= 15;
                    }
                    if (!isValid) {
                        setError(
                            getLeadCollectionLabel(
                                'commonErrorMsg',
                                'Please enter a valid phone number'
                            )
                        );
                    } else {
                        setError('');
                    }
                };
                phoneField.addEventListener('input', handlePhoneValidation);
                phoneField.addEventListener('blur', handlePhoneValidation);
            }
        };

        target.createSelectFieldDropdown = function (options, selectElement) {
            var dropDownOption = document.createElement('option');
            dropDownOption.setAttribute('value', '');
            dropDownOption.textContent =
                getLeadCollectionLabel('option', '') +
                ' ' +
                selectElement.getAttribute('name').toLowerCase().split('-')[1];
            selectElement.appendChild(dropDownOption);
            options.forEach(function (element) {
                if (kommunicateCommons.isObject(element)) {
                    dropDownOption = document.createElement('option');
                    dropDownOption.setAttribute('value', element.value);
                    dropDownOption.textContent =
                        element.value.charAt(0).toUpperCase() + element.value.slice(1);
                    selectElement.appendChild(dropDownOption);
                } else {
                    console.error('Expected object inside options array but got ' + typeof element);
                }
            });
            return selectElement;
        };

        target.setLeadCollectionLabels = function () {
            var LEAD_COLLECTION_LABEL = deps.MCK_LABELS['lead.collection'] || {};
            var submitLogin = document.getElementById('km-submit-chat-login');
            var leadCollectionHeading = document.getElementById('km-lead-collection-heading');
            var tabTitle = document.getElementById('km-tab-title');
            if (submitLogin) {
                var submitLabel = getLeadCollectionLabel('submit', LEAD_COLLECTION_LABEL.submit);
                submitLogin.innerHTML = submitLabel;
                submitLogin.setAttribute('aria-label', submitLabel);
                submitLogin.classList.remove('n-vis');
                submitLogin.removeAttribute('disabled');
            }
            if (leadCollectionHeading) {
                var headingText = deps.appOptions.headingFromWidget
                    ? getLeadCollectionLabel('heading', LEAD_COLLECTION_LABEL.heading)
                    : deps.appOptions.appSettings.chatWidget.preChatGreetingMsg || '';
                leadCollectionHeading.innerHTML = headingText;
                leadCollectionHeading.setAttribute('aria-label', headingText);
            }
            if (tabTitle) {
                var titleLabel = getLeadCollectionLabel('title', LEAD_COLLECTION_LABEL.title);
                tabTitle.innerHTML = titleLabel;
                tabTitle.setAttribute('aria-label', titleLabel);
            }
        };

        target.addPasswordField = function (data) {
            var inputId = 'km-password';
            var kmChatInputDiv = target.createInputContainer(inputId);
            var emailContainer = document.getElementById('km-email-container');
            var isPassField = document.getElementById('km-password');
            var submitBtn = document.getElementById('km-submit-chat-login');
            var errorContainer = document.querySelector(
                '#km-password-container .km-login-form-error'
            );
            var errorMessage =
                (data && data.errorMessage) ||
                getLeadCollectionLabel(
                    'errorText',
                    (deps.MCK_LABELS['lead.collection'] || {}).errorText || ''
                );
            var passwordLabel = getLeadCollectionLabel(
                'password',
                (deps.MCK_LABELS['lead.collection'] || {}).password || 'Password'
            );
            var labelAttribute = {
                field: passwordLabel,
                required: data.required,
            };
            var kmLabelDiv = target.createPreChatLabel(labelAttribute, inputId);
            if (emailContainer) {
                if (isPassField == null) {
                    var passwordField = document.createElement('input');
                    var errorDiv = document.createElement('div');
                    errorDiv.className = 'km-login-form-error km-error-container';
                    errorDiv.innerHTML =
                        '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 12 12" fill="none">' +
                        '<path d="M6 1C3.24 1 1 3.24 1 6C1 8.76 3.24 11 6 11C8.76 11 11 8.76 11 6C11 3.24 8.76 1 6 1ZM6 8.5C5.725 8.5 5.5 8.275 5.5 8V6C5.5 5.725 5.725 5.5 6 5.5C6.275 5.5 6.5 5.725 6.5 6V8C6.5 8.275 6.275 8.5 6 8.5ZM6.5 4.5H5.5V3.5H6.5V4.5Z" fill="#D64242"/>' +
                        '</svg>';
                    var errorText = document.createElement('p');
                    errorText.className = 'km-error-msg';
                    errorText.textContent = errorMessage;
                    errorDiv.appendChild(errorText);

                    for (var key in data) {
                        passwordField.setAttribute(key, data[key]);
                    }
                    passwordField.onblur = target.loginInputKeyup(passwordField);
                    $applozic(kmChatInputDiv).append(kmLabelDiv, passwordField, errorDiv);
                    attachPasswordToggle(
                        kmChatInputDiv,
                        passwordField,
                        deps.MCK_LABELS['lead.collection'] || {}
                    );
                    $applozic(kmChatInputDiv).insertAfter(emailContainer);
                } else if (isPassField) {
                    if (errorContainer) {
                        errorContainer.style.display = 'flex';
                        isPassField.classList.add('km-login-error');
                        var errorLabel = errorContainer.querySelector('.km-error-msg');
                        errorLabel && (errorLabel.textContent = errorMessage);
                    }
                }
            }
            if (submitBtn) {
                submitBtn.removeAttribute('disabled');
                submitBtn.classList.remove('n-vis');
                submitBtn.innerText =
                    getLeadCollectionLabel(
                        'submit',
                        (deps.MCK_LABELS['lead.collection'] || {}).submit || ''
                    ) || '';
            }
        };
    }

    return {
        attach: attach,
    };
})();
