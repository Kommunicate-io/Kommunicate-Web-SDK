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
            '<svg viewBox="0 0 24 24" width="16" height="16" focusable="false" aria-hidden="true">' +
            '<use xlink:href="#icon-67" href="#icon-67"></use>' +
            '</svg>' +
            '</span>' +
            '<span class="km-eye-off" aria-hidden="true">' +
            '<svg viewBox="0 0 24 24" width="16" height="16" focusable="false" aria-hidden="true">' +
            '<use xlink:href="#icon-68" href="#icon-68"></use>' +
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

        target.getLeadCollectionLabel = getLeadCollectionLabel;

        target.isPreLeadCollectionEnabled = function () {
            return (
                (Array.isArray(deps.KM_ASK_USER_DETAILS) &&
                    deps.KM_ASK_USER_DETAILS.length !== 0) ||
                (Array.isArray(deps.KM_PRELEAD_COLLECTION) &&
                    deps.KM_PRELEAD_COLLECTION.length !== 0)
            );
        };

        target.updateAuthSubmitButton = function (submitLabel) {
            var submitBtn = document.getElementById('km-submit-chat-login');
            if (!submitBtn) {
                return;
            }
            submitBtn.innerHTML = submitLabel || '';
            submitBtn.setAttribute('aria-label', submitLabel || '');
            kommunicateCommons.show(submitBtn);
            submitBtn.removeAttribute('disabled');
        };

        function localizeChatLoginModal(modal) {
            if (!modal || !deps.MCK_LABELS) {
                return;
            }
            var closeBtn = modal.querySelector('#km-modal-close');
            var closeLabel = deps.MCK_LABELS['close'];
            if (closeBtn && closeLabel) {
                closeBtn.setAttribute('aria-label', closeLabel);
            }
            var userIdLabel = modal.querySelector('#km-label-user-id');
            var userIdText = deps.MCK_LABELS['form.label.userId'];
            if (userIdLabel && userIdText) {
                userIdLabel.textContent = userIdText;
            }
            var submitBtn = modal.querySelector('#km-submit-chat-login');
            var submitText = getLeadCollectionLabel(
                'submit',
                (deps.MCK_LABELS['lead.collection'] || {}).submit || ''
            );
            if (submitBtn && submitText) {
                submitBtn.textContent = submitText;
                submitBtn.setAttribute('aria-label', submitText);
            }
        }

        target.ensureChatLoginModalExists = function () {
            var existingModal = document.getElementById('km-chat-login-modal');
            if (existingModal) {
                localizeChatLoginModal(existingModal);
                return existingModal;
            }
            return null;
        };

        target.ensureAuthFailureFormFields = function (config) {
            config = config || {};
            var showUserIdField = config.showUserIdField !== false;
            if (target.isPreLeadCollectionEnabled()) {
                return;
            }
            target.resetPreChatLoginError && target.resetPreChatLoginError();
            var form = document.getElementById('km-form-chat-login');
            if (!form) {
                return;
            }
            var askUserDetailsContainer = form.querySelector('.mck-askuserdetail-inputdiv');
            if (!askUserDetailsContainer) {
                return;
            }
            var userIdInput = document.getElementById('km-userId');
            if (userIdInput) {
                toggleField(userIdInput, true);
                userIdInput.setAttribute('type', 'text');
                userIdInput.required = Boolean(showUserIdField);
                var userIdLabel = deps.MCK_LABELS['form.label.userId'];
                userIdInput.setAttribute('placeholder', userIdLabel);
                userIdInput.setAttribute('aria-label', userIdLabel);
                var userIdLabelNode = document.getElementById('km-label-user-id');
                if (userIdLabelNode) {
                    var requiredSvg =
                        '<svg width="6" height="6" viewBox="0 0 6 6" focusable="false" aria-hidden="true">' +
                        '<use xlink:href="#icon-69" href="#icon-69"></use>' +
                        '</svg>';
                    userIdLabelNode.textContent = userIdLabel;
                    userIdLabelNode.classList.remove('sr-only');
                    userIdLabelNode.classList.add('km-form-label', 'km-tertiary-title');
                    if (userIdInput.hasAttribute('required')) {
                        userIdLabelNode.innerHTML = userIdLabel + ' ' + requiredSvg;
                    }
                    if (
                        !userIdLabelNode.parentElement.classList.contains('km-form-label-container')
                    ) {
                        var labelContainer = document.createElement('div');
                        labelContainer.className = 'km-form-label-container';
                        userIdLabelNode.parentElement.insertBefore(labelContainer, userIdLabelNode);
                        labelContainer.appendChild(userIdLabelNode);
                    }
                    if (!showUserIdField) {
                        toggleField(userIdInput, false);
                        userIdLabelNode.classList.add('sr-only');
                    } else {
                        toggleField(userIdInput, true);
                        userIdLabelNode.classList.remove('sr-only');
                    }
                }
            }
            target.updateAuthSubmitButton(target.getLeadCollectionLabel('submit', ''));
            if (!document.getElementById('km-password')) {
                var passwordLabel =
                    target.getLeadCollectionLabel('password', '') ||
                    (deps.MCK_LABELS['lead.collection'] || {}).password ||
                    (deps.MCK_LABELS && deps.MCK_LABELS['lead.collection.password']) ||
                    'Password';
                askUserDetailsContainer.appendChild(
                    target.createInputField({
                        field: passwordLabel,
                        type: 'password',
                        placeholder: passwordLabel,
                        required: true,
                        id: 'km-password',
                        name: 'km-password',
                    })
                );
            }
        };

        target.reopenAuthModal = function (options) {
            options = options || { skipConversationLaunch: true };
            deps.ensureWidgetIframeVisible();
            deps.openWidgetForAuthError(options);
            var kmChatLoginModal = document.getElementById('km-chat-login-modal');
            kommunicateCommons.show('#km-chat-login-modal');
            kommunicateCommons.setDialogVisibility(
                kmChatLoginModal,
                true,
                deps.loginModalFocusFallbacks || []
            );
            return kmChatLoginModal;
        };

        target.clearStoredAuthState = function (options) {
            options = options || {};
            deps.clearPersistedAuthState();
            if (options.deleteCookies) {
                deps.kmLocalStorage.deleteUserCookiesOnLogout();
            }
            if (options.clearHeaders) {
                deps.clearAppHeaders();
            }
            if (options.clearTokens) {
                deps.clearAuthTokens();
            }
        };

        target.clearAuthSessionState = function () {
            target.clearStoredAuthState({
                deleteCookies: true,
                clearHeaders: true,
                clearTokens: true,
            });
        };

        target.resolvePreLeadErrorMessage = function () {
            return getLeadCollectionLabel('invalidPasswordMessage', '');
        };

        target.showPreChatLoginError = function (message) {
            var resolvedMessage = message || getLeadCollectionLabel('invalidPasswordMessage', '');
            target.reopenAuthModal({
                skipConversationLaunch: false,
            });
            var loginErrorNode = document.getElementById('km-error-chat-login');
            if (loginErrorNode) {
                loginErrorNode.textContent = resolvedMessage || '';
                kommunicateCommons.show(loginErrorNode);
                loginErrorNode.style.display = '';
            }
            target.updateAuthSubmitButton(
                getLeadCollectionLabel('submit', (deps.MCK_LABELS['lead.collection'] || {}).submit)
            );
        };

        target.resetPreChatLoginError = function () {
            var loginErrorNode = document.getElementById('km-error-chat-login');
            if (loginErrorNode) {
                loginErrorNode.textContent = '';
                kommunicateCommons.hide(loginErrorNode);
            }
        };

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

        target.createPreChatLabel = function (leadCollection, inputId) {
            var kmLabelDiv = document.createElement('div');
            kmLabelDiv.setAttribute('class', 'km-form-label-container');
            var fieldName = leadCollection.field;
            var requiredSVG =
                '<svg width="6" height="6" viewBox="0 0 6 6" focusable="false" aria-hidden="true">' +
                '<use xlink:href="#icon-69" href="#icon-69"></use>' +
                '</svg>';
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

        function toggleField(input, show) {
            if (!input) {
                return;
            }
            var container = input.closest('.km-form-group');
            if (show) {
                kommunicateCommons.show(input);
                container && kommunicateCommons.show(container);
            } else {
                kommunicateCommons.hide(input);
                container && kommunicateCommons.hide(container);
            }
        }

        target.createInputField = function (preLeadCollection) {
            var rawField = (preLeadCollection.field || '').toString();
            var normalizedField = rawField.toLowerCase().replace(/\s+/g, '');
            var localizedUserId = ((deps.MCK_LABELS && deps.MCK_LABELS['form.label.userId']) || '')
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
                kmChatInput.setAttribute('aria-required', 'true');
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
                if (
                    preLeadCollection.validation &&
                    preLeadCollection.validation.regex &&
                    (preLeadCollection.element || 'input') !== 'select'
                ) {
                    kmChatInput.setAttribute(
                        'data-validation-regex',
                        preLeadCollection.validation.regex
                    );
                    kmChatInput.setAttribute(
                        'data-validation-error-text',
                        preLeadCollection.validation.errorText || ''
                    );
                }
                if (preLeadCollection.type === 'email') {
                    kmChatInput.setAttribute('pattern', '^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$');
                    kmChatInput.setAttribute('title', '');
                    kmChatInput.setAttribute(
                        'oninvalid',
                        "setCustomValidity('" + getLeadCollectionLabel('errorEmail', '') + "')"
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
            if (!deps.KM_PRELEAD_COLLECTION.length) {
                syncPreLeadCollectionFromOptions();
            }
            deps.KM_ASK_USER_DETAILS.length && target.getPreLeadDataForAskUserDetail();
            var authTypeId =
                typeof deps.getAuthenticationTypeId === 'function'
                    ? deps.getAuthenticationTypeId()
                    : deps.MCK_AUTHENTICATION_TYPE_ID;
            var leadLabels = deps.MCK_LABELS['lead.collection'] || {};
            var isPreLeadEnabled = target.isPreLeadCollectionEnabled();
            var normalizedUserIdLabel = (
                (deps.MCK_LABELS && deps.MCK_LABELS['form.label.userId']) ||
                ''
            )
                .toString()
                .toLowerCase()
                .replace(/\s+/g, '');
            var normalizedLeadUserIdLabel = (leadLabels.userId || '')
                .toString()
                .toLowerCase()
                .replace(/\s+/g, '');
            var isUserIdField = function (item) {
                if (!item) {
                    return false;
                }
                var fieldName = (item.field || '').toString().toLowerCase().replace(/\s+/g, '');
                return (
                    item.id === 'km-userId' ||
                    item.name === 'km-userId' ||
                    fieldName === 'userid' ||
                    (normalizedUserIdLabel && fieldName === normalizedUserIdLabel) ||
                    (normalizedLeadUserIdLabel && fieldName === normalizedLeadUserIdLabel)
                );
            };
            var allowTemplateUserId = authTypeId > 0 && !isPreLeadEnabled;
            var allowUserIdInPreLead =
                isPreLeadEnabled &&
                deps.KM_PRELEAD_COLLECTION.some(function (item) {
                    return isUserIdField(item);
                });
            var useTemplateUserId = false;
            if (allowTemplateUserId) {
                var userIdInput = document.getElementById('km-userId');
                if (userIdInput) {
                    var labelText =
                        (deps.MCK_LABELS && deps.MCK_LABELS['form.label.userId']) || 'User ID';
                    var userIdConfig = null;
                    for (var idx = 0; idx < deps.KM_PRELEAD_COLLECTION.length; idx++) {
                        var candidate = deps.KM_PRELEAD_COLLECTION[idx];
                        var candidateField = ((candidate && candidate.field) || '')
                            .toString()
                            .toLowerCase()
                            .replace(/\s+/g, '');
                        if (candidateField === 'userid') {
                            userIdConfig = candidate;
                            break;
                        }
                    }
                    if (userIdConfig) {
                        labelText = userIdConfig.field || labelText;
                    }
                    toggleField(userIdInput, true);
                    userIdInput.classList.remove('n-vis');
                    userIdInput.setAttribute('type', (userIdConfig && userIdConfig.type) || 'text');
                    userIdInput.required = !(
                        userIdConfig &&
                        typeof userIdConfig.required !== 'undefined' &&
                        !userIdConfig.required
                    );
                    userIdInput.setAttribute(
                        'placeholder',
                        (userIdConfig && userIdConfig.placeholder) || labelText
                    );
                    userIdInput.setAttribute('aria-label', labelText);
                    var userIdLabelNode = document.getElementById('km-label-user-id');
                    if (userIdLabelNode) {
                        userIdLabelNode.textContent = labelText;
                        userIdLabelNode.classList.remove('sr-only');
                        userIdLabelNode.classList.add('km-form-label', 'km-tertiary-title');
                    }
                    useTemplateUserId = true;
                }
            } else {
                var fallbackUserIdInput = document.getElementById('km-userId');
                if (fallbackUserIdInput) {
                    toggleField(fallbackUserIdInput, false);
                    fallbackUserIdInput.removeAttribute('required');
                    var fallbackLabel = document.getElementById('km-label-user-id');
                    if (fallbackLabel) {
                        fallbackLabel.classList.add('sr-only');
                    }
                }
            }
            if (allowTemplateUserId) {
                var hasUserId = deps.KM_PRELEAD_COLLECTION.some(function (item) {
                    return isUserIdField(item);
                });
                var hasPassword = deps.KM_PRELEAD_COLLECTION.some(function (item) {
                    return (
                        item &&
                        typeof item.field === 'string' &&
                        item.field.toLowerCase().replace(/\s+/g, '') === 'password'
                    );
                });
                if (!hasUserId && !useTemplateUserId) {
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
                var fieldName = ((dataToCollect && dataToCollect.field) || '').toString();
                if (fieldName.toLowerCase() === 'phone') {
                    enableCountryCode = dataToCollect.enableCountryCode;
                }
                if (isUserIdField(dataToCollect) && !allowUserIdInPreLead) {
                    continue;
                }
                if (useTemplateUserId && isUserIdField(dataToCollect)) {
                    continue;
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

        var setPreChatError = function (message) {
            var errorNode = document.getElementById('km-error-chat-login');
            if (!errorNode) {
                return;
            }
            if (message) {
                errorNode.textContent = message;
                kommunicateCommons.show(errorNode);
            } else {
                errorNode.textContent = '';
                kommunicateCommons.hide(errorNode);
            }
        };

        var getPreChatInputValue = function (field) {
            var tagName = (field.tagName || '').toLowerCase();
            if (tagName === 'select') {
                return field.value || '';
            }
            return (field.value || '').trim();
        };

        var isPreChatFieldVisible = function (field) {
            if (!field || field.disabled || field.classList.contains('n-vis')) {
                return false;
            }
            return !(field.closest && field.closest('.n-vis'));
        };

        var validatePhoneNumberField = function (fieldValue) {
            var intlInstance = deps.getIntlTelInstance();
            if (intlInstance) {
                return intlInstance.isValidNumber();
            }
            var digitsOnly = fieldValue.replace(/\D/g, '');
            return digitsOnly.length >= 7 && digitsOnly.length <= 15;
        };

        var getPreChatFieldValidationError = function (field) {
            var fieldValue = getPreChatInputValue(field);
            if (field.hasAttribute('required') && !fieldValue) {
                return getLeadCollectionLabel('commonErrorMsg', '');
            }

            var fieldType = (field.getAttribute('type') || '').toLowerCase();
            if (fieldType === 'email' && fieldValue && !KommunicateUI.isValidEmail(fieldValue)) {
                return getLeadCollectionLabel('errorEmail', '');
            }

            var validationRegex = field.getAttribute('data-validation-regex');
            if (validationRegex && fieldValue) {
                var regex = null;
                try {
                    regex = new RegExp(validationRegex);
                } catch (e) {
                    regex = null;
                }
                if (regex && !regex.test(fieldValue)) {
                    return (
                        field.getAttribute('data-validation-error-text') ||
                        getLeadCollectionLabel('commonErrorMsg', '')
                    );
                }
            }

            if (field.id === 'km-phone' && fieldValue && !validationRegex) {
                if (!validatePhoneNumberField(fieldValue)) {
                    return getLeadCollectionLabel('commonErrorMsg', '');
                }
            }
            return '';
        };

        target.validatePreChatForm = function () {
            var form = document.getElementById('km-form-chat-login');
            if (!form) {
                return true;
            }
            var fields = form.querySelectorAll('.km-form-control');
            for (var i = 0; i < fields.length; i++) {
                var field = fields[i];
                if (!isPreChatFieldVisible(field)) {
                    continue;
                }
                var errorMessage = getPreChatFieldValidationError(field);
                if (errorMessage) {
                    setPreChatError(errorMessage);
                    return false;
                }
            }
            setPreChatError('');
            return true;
        };

        target.addPreChatInlineValidation = function () {
            var form = document.getElementById('km-form-chat-login');
            var submitBtn = document.getElementById('km-submit-chat-login');
            var formSubmitted = false;
            var formFields = form ? form.querySelectorAll('.km-form-control') : [];

            for (var i = 0; i < formFields.length; i++) {
                formFields[i].addEventListener('input', function () {
                    if (formSubmitted) {
                        target.validatePreChatForm();
                    }
                });
                formFields[i].addEventListener('blur', function () {
                    if (formSubmitted) {
                        target.validatePreChatForm();
                    }
                });
            }

            if (submitBtn) {
                submitBtn.addEventListener('click', function () {
                    formSubmitted = true;
                    target.validatePreChatForm();
                });
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
                target.updateAuthSubmitButton(
                    getLeadCollectionLabel('submit', LEAD_COLLECTION_LABEL.submit)
                );
            }
            if (leadCollectionHeading) {
                var headingText = deps.appOptions.headingFromWidget
                    ? getLeadCollectionLabel('heading', LEAD_COLLECTION_LABEL.heading)
                    : (deps.appOptions.appSettings &&
                          deps.appOptions.appSettings.chatWidget &&
                          deps.appOptions.appSettings.chatWidget.preChatGreetingMsg) ||
                      '';
                leadCollectionHeading.innerHTML = headingText;
                leadCollectionHeading.setAttribute('aria-label', headingText);
            }
            if (tabTitle) {
                var titleLabel = getLeadCollectionLabel('title', LEAD_COLLECTION_LABEL.title);
                tabTitle.innerHTML = titleLabel;
                tabTitle.setAttribute('aria-label', titleLabel);
            }
        };
    }

    return {
        attach: attach,
    };
})();
