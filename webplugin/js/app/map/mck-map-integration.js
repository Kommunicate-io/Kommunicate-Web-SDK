(function () {
    'use strict';

    const noop = () => {};

    const defaultLogger = (...args) => {
        if (typeof console !== 'undefined' && typeof console.warn === 'function') {
            console.warn(...args);
        }
    };

    const safeFn = (fn, fallback) => (typeof fn === 'function' ? fn : fallback);

    const createLayout = ({
        $applozic,
        kommunicateCommons = {},
        mckMapUtils,
        state = {},
        getMapConfig = () => ({}),
        logger = defaultLogger,
    } = {}) => {
        if (typeof $applozic !== 'function') {
            logger('MckMapLayout requires a valid $applozic instance.');
            return {
                init: noop,
                fileMenuReposition: noop,
                fileMenuToggle: noop,
                openMapBox: noop,
            };
        }

        const windowRef = window;
        const kmWidgetEvents = windowRef.kmWidgetEvents;
        const eventMapping = windowRef.eventMapping || {};
        const getLocation = safeFn(state.getLocation, () => ({
            lat: 0,
            lng: 0,
        }));
        const setLocation = safeFn(state.setLocation, noop);

        const layout = {};
        let geocoder = null;
        let currentAddress = '';
        let hasInitLocationShare = false;
        let mapInstance = null;
        let mapMarker = null;
        let AdvancedMarkerElement = null;
        let placeAutocompleteElement = null;
        let placeAutocompleteInput = null;
        let manualAddressHandlersBound = false;
        let isAddressSelectionFromAutocomplete = false;

        const $mckMyLoc = $applozic('#mck-my-loc');
        const $mckLocBox = $applozic('#mck-loc-box');
        const $mckLocLat = $applozic('#mck-loc-lat');
        const $mckLocLon = $applozic('#mck-loc-lon');
        const $mckBtnLoc = $applozic('#mck-btn-loc');
        const $mckFooter = $applozic('#mck-sidebox-ft');
        const $mckFileMenu = $applozic('#mck-file-menu');
        const $mckBtnAttach = $applozic('#mck-btn-attach');
        const $mckMapContent = $applozic('#mck-map-content');
        const $mckLocAddress = $applozic('#mck-loc-address');

        layout.init = () => {
            const config = getMapConfig();
            const googleMaps = window.google;
            if (config.isLocShare && googleMaps && typeof googleMaps.maps === 'object') {
                geocoder = geocoder || new googleMaps.maps.Geocoder();
                $mckBtnAttach.on('click', layout.fileMenuToggle);
                $mckBtnLoc.on('click', (event) => {
                    event.preventDefault();
                    if (
                        kmWidgetEvents &&
                        typeof kmWidgetEvents.eventTracking === 'function' &&
                        eventMapping.onLocationIconClick
                    ) {
                        kmWidgetEvents.eventTracking(eventMapping.onLocationIconClick);
                    }
                    if (hasInitLocationShare) {
                        $mckLocBox.attr('aria-hidden', 'false');
                        $mckLocBox.mckModal();
                        return;
                    }
                    if (mckMapUtils && typeof mckMapUtils.getCurrentLocation === 'function') {
                        mckMapUtils.getCurrentLocation(
                            layout.onGetCurrLocation,
                            layout.onErrorCurrLocation
                        );
                    } else {
                        layout.openMapBox();
                    }
                    hasInitLocationShare = true;
                });
            }

            $mckMyLoc.on('click', () => {
                if (mckMapUtils && typeof mckMapUtils.getCurrentLocation === 'function') {
                    mckMapUtils.getCurrentLocation(
                        layout.onGetMyCurrLocation,
                        layout.onErrorMyCurrLocation
                    );
                }
            });
        };

        layout.fileMenuReposition = () => {
            const offset = $mckFooter.offset();
            offset.bottom = windowRef.innerHeight - offset.top;
            $mckFileMenu.css({
                bottom: offset.bottom > 51 ? offset.bottom : 51,
                right: 0,
            });
        };

        layout.fileMenuToggle = () => {
            if ($mckBtnAttach.hasClass('on')) {
                $mckBtnAttach.removeClass('on');
                kommunicateCommons.hide && kommunicateCommons.hide($mckFileMenu);
                return;
            }
            layout.fileMenuReposition();
            $mckBtnAttach.addClass('on');
            kommunicateCommons.show && kommunicateCommons.show($mckFileMenu);
        };

        layout.onGetCurrLocation = (position) => {
            const coords = extractCoordinates(position);
            if (coords) {
                updateStoredLocation(coords);
            }
            layout.openMapBox();
        };

        layout.onErrorCurrLocation = () => {
            updateStoredLocation({
                lat: 46.15242437752303,
                lng: 2.7470703125,
            });
            layout.openMapBox();
        };

        layout.onErrorMyCurrLocation = (error) => {
            if (typeof windowRef.alert === 'function') {
                windowRef.alert(
                    `Unable to retrieve your location. ERROR(${error.code}): ${error.message}`
                );
            }
        };

        layout.onGetMyCurrLocation = (position) => {
            const coords = extractCoordinates(position);
            if (!coords) {
                return;
            }
            syncMarkerPosition(coords, {
                pan: true,
            });
            reverseGeocodeLatLng(coords);
        };

        layout.openMapBox = () => {
            const googleMaps = window.google;
            if (!googleMaps || !googleMaps.maps) {
                $mckLocBox.attr('aria-hidden', 'false');
                $mckLocBox.mckModal();
                return;
            }
            geocoder = geocoder || new googleMaps.maps.Geocoder();
            AdvancedMarkerElement =
                AdvancedMarkerElement || googleMaps.maps.marker?.AdvancedMarkerElement || null;

            const mapConfig = getMapConfig();
            const initialLatLng = getStoredLocation();

            if (!mapInstance) {
                initializeMap(initialLatLng, mapConfig, googleMaps);
                initializeAutocomplete(googleMaps);
                initializeAddressManualHandlers();
            } else {
                mapInstance.setCenter(initialLatLng);
                updateMarkerPosition(initialLatLng);
            }

            syncMarkerPosition(initialLatLng, {
                pan: false,
                address: currentAddress || getAddressFieldValue(),
            });

            if (!currentAddress) {
                reverseGeocodeLatLng(initialLatLng);
            }

            $mckLocBox.off('shown.bs.mck-box', handleLocModalShown);
            $mckLocBox.on('shown.bs.mck-box', handleLocModalShown);
            $mckLocBox.attr('aria-hidden', 'false');
            $mckLocBox.mckModal();
        };

        const handleLocModalShown = () => {
            $mckLocBox.off('shown.bs.mck-box', handleLocModalShown);
            const googleMaps = window.google;
            if (mapInstance && googleMaps?.maps?.event) {
                googleMaps.maps.event.trigger(mapInstance, 'resize');
                mapInstance.setCenter(getStoredLocation());
            }
        };

        const initializeMap = (latLng, mapConfig, googleMaps) => {
            const mapOptions = {
                center: latLng,
                zoom: 14,
                fullscreenControl: false,
                streetViewControl: false,
                mapTypeControl: false,
            };

            if (mapConfig.googleApiKey) {
                mapOptions.mapId = mapConfig.googleApiKey;
            }

            mapInstance = new googleMaps.maps.Map($mckMapContent[0], mapOptions);

            const handleDragEnd = (event) => {
                const position = getMarkerLatLng(event?.latLng);
                syncMarkerPosition(position, {
                    pan: true,
                });
                reverseGeocodeLatLng(position);
            };

            if (AdvancedMarkerElement) {
                mapMarker = new AdvancedMarkerElement({
                    map: mapInstance,
                    position: latLng,
                    gmpDraggable: true,
                });
                mapMarker.addListener('dragend', handleDragEnd);
            } else {
                mapMarker = new googleMaps.maps.Marker({
                    map: mapInstance,
                    position: latLng,
                    draggable: true,
                });
                mapMarker.addListener('dragend', handleDragEnd);
            }

            mapInstance.addListener('click', (event) => {
                syncMarkerPosition(event.latLng, {
                    pan: true,
                });
                reverseGeocodeLatLng(event.latLng);
            });
        };

        const initializeAutocomplete = (googleMaps) => {
            if (
                placeAutocompleteElement ||
                !$mckLocAddress.length ||
                !googleMaps?.maps?.places?.PlaceAutocompleteElement ||
                !mapInstance
            ) {
                return;
            }

            try {
                placeAutocompleteElement = new googleMaps.maps.places.PlaceAutocompleteElement();
            } catch (error) {
                logger('PlaceAutocompleteElement init error', error);
                placeAutocompleteElement = null;
                return;
            }

            const originalInput = $mckLocAddress[0];
            if (!originalInput?.parentNode) {
                placeAutocompleteElement = null;
                return;
            }

            placeAutocompleteElement.id = 'mck-loc-address-autocomplete';
            placeAutocompleteElement.className = originalInput.className || '';
            placeAutocompleteElement.placeholder = originalInput.getAttribute('placeholder') || '';
            placeAutocompleteElement.setAttribute(
                'aria-label',
                originalInput.getAttribute('aria-label') || 'Enter a location'
            );
            if (originalInput.value) {
                placeAutocompleteElement.value = originalInput.value;
            }

            originalInput.parentNode.insertBefore(placeAutocompleteElement, originalInput);
            $mckLocAddress.hide();
            ensurePlaceAutocompleteInput();
            placeAutocompleteElement.addEventListener(
                'gmp-select',
                handlePlaceAutocompleteSelection
            );
        };

        const handlePlaceAutocompleteSelection = (event) => {
            const prediction = event?.placePrediction;
            if (!prediction || typeof prediction.toPlace !== 'function') {
                return;
            }

            const place = prediction.toPlace();
            isAddressSelectionFromAutocomplete = true;
            place
                .fetchFields({
                    fields: ['location', 'formattedAddress', 'displayName'],
                })
                .then(() => {
                    if (!place.location) {
                        return;
                    }
                    const formatted =
                        place.formattedAddress || place.displayName || currentAddress || '';
                    syncMarkerPosition(place.location, {
                        pan: true,
                        address: formatted,
                    });
                })
                .catch((error) => {
                    logger('PlaceAutocompleteElement selection error', error);
                })
                .finally(() => {
                    setTimeout(() => {
                        isAddressSelectionFromAutocomplete = false;
                    }, 0);
                });
        };

        const initializeAddressManualHandlers = () => {
            if (manualAddressHandlersBound) {
                return;
            }
            const manualTarget =
                placeAutocompleteElement || ensurePlaceAutocompleteInput() || $mckLocAddress[0];
            if (!manualTarget) {
                return;
            }
            manualAddressHandlersBound = true;
            manualTarget.addEventListener('keydown', handleManualAddressKeyDown, true);
            manualTarget.addEventListener('blur', handleManualAddressBlur, true);
        };

        const handleManualAddressKeyDown = (event) => {
            if (event.key !== 'Enter' && event.keyCode !== 13) {
                return;
            }
            event.preventDefault();
            const address = (getAddressFieldValue() || '').trim();
            if (address) {
                geocodeAddress(address);
            }
        };

        const handleManualAddressBlur = () => {
            if (isAddressSelectionFromAutocomplete) {
                return;
            }
            const address = (getAddressFieldValue() || '').trim();
            if (address && address !== currentAddress) {
                geocodeAddress(address);
            }
        };

        const ensurePlaceAutocompleteInput = () => {
            if (!placeAutocompleteElement?.querySelector) {
                placeAutocompleteInput = null;
                return null;
            }
            if (!placeAutocompleteInput || !placeAutocompleteInput.isConnected) {
                placeAutocompleteInput = placeAutocompleteElement.querySelector('input');
            }
            return placeAutocompleteInput;
        };

        const getAddressFieldValue = () => {
            if (typeof placeAutocompleteElement?.value === 'string') {
                return placeAutocompleteElement.value;
            }
            const input = ensurePlaceAutocompleteInput();
            if (typeof input?.value === 'string') {
                return input.value;
            }
            return ($mckLocAddress.val() || '').toString();
        };

        const setAddressFieldValue = (address) => {
            const value = address || '';
            $mckLocAddress.val(value);
            if (placeAutocompleteElement) {
                if ('value' in placeAutocompleteElement) {
                    placeAutocompleteElement.value = value;
                } else if (typeof placeAutocompleteElement.setAttribute === 'function') {
                    placeAutocompleteElement.setAttribute('value', value);
                }
            }
            const input = ensurePlaceAutocompleteInput();
            if (input && typeof input.value !== 'undefined') {
                input.value = value;
            }
        };

        const getMarkerLatLng = (fallbackLatLng) => {
            if (fallbackLatLng) {
                return fallbackLatLng;
            }
            if (!mapMarker) {
                return null;
            }
            if (typeof mapMarker.getPosition === 'function') {
                return mapMarker.getPosition();
            }
            return mapMarker.position || null;
        };

        const updateMarkerPosition = (target) => {
            if (!mapMarker || !target) {
                return;
            }
            if (typeof mapMarker.setPosition === 'function') {
                mapMarker.setPosition(target);
            } else {
                mapMarker.position = target;
            }
        };

        const geocodeAddress = (address) => {
            if (!geocoder || !address) {
                return;
            }
            geocoder.geocode(
                {
                    address,
                },
                (results, status) => {
                    if (status !== 'OK' || !Array.isArray(results) || !results.length) {
                        return;
                    }
                    const result = results[0];
                    syncMarkerPosition(result.geometry.location, {
                        pan: true,
                        address: result.formatted_address,
                    });
                }
            );
        };

        const reverseGeocodeLatLng = (latLng) => {
            if (!geocoder || !latLng) {
                return;
            }
            const target = toPlainLatLng(latLng);
            geocoder.geocode(
                {
                    location: target,
                },
                (results, status) => {
                    if (status !== 'OK' || !Array.isArray(results) || !results.length) {
                        return;
                    }
                    currentAddress = results[0].formatted_address;
                    setAddressFieldValue(currentAddress);
                }
            );
        };

        const syncMarkerPosition = (latLng, options) => {
            if (!latLng) {
                return;
            }
            const target = updateStoredLocation(latLng);
            $mckLocLat.val(target.lat);
            $mckLocLon.val(target.lng);
            $mckLocLat.trigger('change');
            $mckLocLon.trigger('change');

            if (options && Object.prototype.hasOwnProperty.call(options, 'address')) {
                currentAddress = options.address || '';
                setAddressFieldValue(currentAddress);
            } else if (currentAddress) {
                setAddressFieldValue(currentAddress);
            } else {
                setAddressFieldValue(formatLatLng(target));
            }

            updateMarkerPosition(target);

            if (mapInstance && (!options || options.pan !== false)) {
                mapInstance.panTo(target);
            }
        };

        const updateStoredLocation = (latLng) => {
            const target = toPlainLatLng(latLng);
            setLocation(target);
            return target;
        };

        const getStoredLocation = () => toPlainLatLng(getLocation());

        const toPlainLatLng = (latLng) => {
            if (!latLng) {
                return {
                    lat: 0,
                    lng: 0,
                };
            }
            const lat = typeof latLng.lat === 'function' ? latLng.lat() : latLng.lat;
            const lng = typeof latLng.lng === 'function' ? latLng.lng() : latLng.lng;
            return {
                lat: Number.isFinite(Number(lat)) ? parseFloat(lat) : 0,
                lng: Number.isFinite(Number(lng)) ? parseFloat(lng) : 0,
            };
        };

        const formatLatLng = (latLng) => {
            const latNum = Number(latLng.lat);
            const lngNum = Number(latLng.lng);
            if (!Number.isFinite(latNum) || !Number.isFinite(lngNum)) {
                return '';
            }
            return `${latNum.toFixed(6)}, ${lngNum.toFixed(6)}`;
        };

        const extractCoordinates = (position) => {
            if (!position?.coords) {
                return null;
            }
            const { latitude, longitude } = position.coords;
            return {
                lat: latitude,
                lng: longitude,
            };
        };

        return layout;
    };

    const createService = ({
        $applozic,
        kommunicateCommons = {},
        mckMapUtils,
        mckMessageService,
        getTopicDetailMap = () => ({}),
    } = {}) => {
        if (typeof $applozic !== 'function') {
            return {};
        }

        const windowRef = window;

        const MckMapService = function () {
            const $mckMsgSbmt = $applozic('#mck-msg-sbmt');
            const $mckLocSubmit = $applozic('#mck-loc-submit');
            const $mckLocBox = $applozic('#mck-loc-box');
            const $mckMsgError = $applozic('#mck-msg-error');
            const $mckResponseText = $applozic('#mck_response_text');
            const $mckMsgInner = $applozic('#mck-message-cell .mck-message-inner');

            $mckLocSubmit.on('click', () => {
                if (!mckMapUtils || typeof mckMapUtils.getSelectedLocation !== 'function') {
                    return;
                }

                const messagePxy = {
                    type: 5,
                    contentType: 2,
                    message: windowRef.JSON.stringify(mckMapUtils.getSelectedLocation()),
                };

                const conversationId = $mckMsgInner.data('mck-conversationid');
                const topicId = $mckMsgInner.data('mck-topicid');

                if (conversationId) {
                    messagePxy.conversationId = conversationId;
                } else if (topicId) {
                    const topicDetail = getTopicDetailMap()[topicId];
                    const conversationPxy = {
                        topicId,
                    };
                    if (typeof topicDetail === 'object') {
                        conversationPxy.topicDetail = windowRef.JSON.stringify(topicDetail);
                    }
                    messagePxy.conversationPxy = conversationPxy;
                }

                if (typeof kommunicateCommons.setMessagePxyRecipient === 'function') {
                    kommunicateCommons.setMessagePxyRecipient(messagePxy);
                }
                $mckMsgSbmt.attr('disabled', true);
                kommunicateCommons.hide && kommunicateCommons.hide('#mck-msg-error');
                $mckMsgError.html('');
                $mckResponseText.html('');
                kommunicateCommons.hide && kommunicateCommons.hide('#mck-msg-response');
                mckMessageService?.sendMessage(messagePxy);
                $mckLocBox.attr('aria-hidden', 'true');
                $mckLocBox.mckModal('hide');
            });
        };

        return new MckMapService();
    };

    window.KommunicateMapFactory = {
        createLayout,
        createService,
    };
})();
