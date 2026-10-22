(function () {
    'use strict';

    const noop = () => {};

    const defaultLogger = (...args) => {
        if (typeof console !== 'undefined' && typeof console.warn === 'function') {
            console.warn(...args);
        }
    };

    const safeFn = (fn, fallback) => (typeof fn === 'function' ? fn : fallback);

    const MAP_VIEW_PATH = '/map-view.html';
    const MSG_READY = 'km-map:ready';
    const MSG_INIT = 'km-map:init';
    const MSG_SET_LOCATION = 'km-map:set-location';
    const MSG_LOCATION_CHANGED = 'km-map:location-changed';
    const MSG_RESIZE = 'km-map:resize';

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
        let hasInitLocationShare = false;
        let mapIframe = null;
        let mapIframeReady = false;

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

        // The map and its address/autocomplete UI live entirely inside the
        // map-view.html iframe (same origin as the widget, so its Google Maps
        // requests can be HTTP-referrer-restricted). The plain input below is
        // only a non-JS fallback; hide it once the iframe takes over.
        const hideNativeAddressInput = () => {
            const formGroup = $mckLocAddress.closest('.mck-form-group');
            if (formGroup && formGroup.length) {
                kommunicateCommons.hide ? kommunicateCommons.hide(formGroup) : formGroup.hide();
            } else {
                $mckLocAddress.hide();
            }
        };

        const ensureMapIframe = () => {
            if (mapIframe) {
                return mapIframe;
            }
            const baseUrl =
                typeof windowRef.MCK_CONTEXTPATH === 'string' ? windowRef.MCK_CONTEXTPATH : '';
            const iframe = document.createElement('iframe');
            iframe.src = baseUrl + MAP_VIEW_PATH;
            iframe.title = 'Share location';
            iframe.setAttribute('frameborder', '0');
            iframe.style.cssText = 'width:100%;height:100%;border:0;display:block;';

            const mapContentEl = $mckMapContent[0];
            if (!mapContentEl) {
                logger('mck-map-integration: #mck-map-content not found in DOM.');
                return null;
            }
            mapContentEl.innerHTML = '';
            mapContentEl.appendChild(iframe);
            hideNativeAddressInput();

            mapIframe = iframe;
            mapIframeReady = false;
            windowRef.addEventListener('message', handleMapMessage);
            return iframe;
        };

        const postToMap = (type, payload) => {
            if (!mapIframe || !mapIframeReady || !mapIframe.contentWindow) {
                return;
            }
            mapIframe.contentWindow.postMessage(Object.assign({ type }, payload), '*');
        };

        const handleMapMessage = (event) => {
            if (!mapIframe || event.source !== mapIframe.contentWindow) {
                return;
            }
            const data = event.data || {};
            if (data.type === MSG_READY) {
                mapIframeReady = true;
                const initial = getStoredLocation();
                postToMap(MSG_INIT, { lat: initial.lat, lng: initial.lng });
                return;
            }
            if (data.type === MSG_LOCATION_CHANGED) {
                applyLocationChange({ lat: data.lat, lng: data.lng }, data.address);
            }
        };

        const applyLocationChange = (latLng, address) => {
            const target = updateStoredLocation(latLng);
            $mckLocLat.val(target.lat);
            $mckLocLon.val(target.lng);
            $mckLocLat.trigger('change');
            $mckLocLon.trigger('change');
            if (typeof address === 'string') {
                $mckLocAddress.val(address);
            }
            return target;
        };

        layout.init = () => {
            const config = getMapConfig();
            if (config.isLocShare) {
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
                applyLocationChange(coords);
            }
            layout.openMapBox();
        };

        layout.onErrorCurrLocation = () => {
            applyLocationChange({
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
            applyLocationChange(coords);
            postToMap(MSG_SET_LOCATION, coords);
        };

        layout.openMapBox = () => {
            ensureMapIframe();
            const initialLatLng = getStoredLocation();
            postToMap(MSG_INIT, { lat: initialLatLng.lat, lng: initialLatLng.lng });

            $mckLocBox.off('shown.bs.mck-box', handleLocModalShown);
            $mckLocBox.on('shown.bs.mck-box', handleLocModalShown);
            $mckLocBox.attr('aria-hidden', 'false');
            $mckLocBox.mckModal();
        };

        const handleLocModalShown = () => {
            $mckLocBox.off('shown.bs.mck-box', handleLocModalShown);
            postToMap(MSG_RESIZE, {});
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
