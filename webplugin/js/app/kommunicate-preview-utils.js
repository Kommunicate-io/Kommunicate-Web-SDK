(function (root) {
    'use strict';

    var PREVIEW_ALLOWED_SCHEMES = ['https'];
    var PREVIEW_BLOCKED_HOSTNAMES = ['localhost'];
    var PREVIEW_BLOCKED_HOSTNAME_SUFFIXES = [];

    var globalContext =
        root ||
        (typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : {});

    function resolveGlobals() {
        return (
            globalContext.Kommunicate?._globals ||
            globalContext.kommunicate?._globals ||
            globalContext.applozic?._globals ||
            {}
        );
    }

    function normalizeHostname(hostname) {
        if (!hostname || typeof hostname !== 'string') {
            return '';
        }
        return hostname.toLowerCase().replace(/\.$/, '');
    }

    function stringStartsWith(value, prefix) {
        if (typeof value !== 'string' || typeof prefix !== 'string') {
            return false;
        }
        return typeof value.startsWith === 'function'
            ? value.startsWith(prefix)
            : value.indexOf(prefix) === 0;
    }

    function parsePreviewUrl(candidate) {
        if (!candidate) {
            return null;
        }
        var trimmedCandidate = typeof candidate === 'string' ? candidate.trim() : '';
        if (!trimmedCandidate || stringStartsWith(trimmedCandidate, '//')) {
            return null;
        }
        if (typeof globalContext.URL === 'function') {
            try {
                return new globalContext.URL(trimmedCandidate);
            } catch (error) {
                return null;
            }
        }
        if (typeof globalContext.document === 'undefined') {
            return null;
        }
        var anchor = globalContext.document.createElement('a');
        anchor.href = trimmedCandidate;
        var protocol = anchor.protocol || '';
        var scheme = protocol.replace(':', '').toLowerCase();
        if (!scheme || PREVIEW_ALLOWED_SCHEMES.indexOf(scheme) === -1) {
            return null;
        }
        var hostOrOrigin = anchor.hostname || anchor.origin;
        if (!hostOrOrigin) {
            return null;
        }
        return anchor;
    }

    function isIpv4Host(hostname) {
        var segments = String(hostname || '').split('.');
        if (segments.length !== 4) {
            return null;
        }
        var normalized = [];
        for (var i = 0; i < 4; i++) {
            var segment = parseInt(segments[i], 10);
            if (isNaN(segment) || segment < 0 || segment > 255) {
                return null;
            }
            normalized.push(segment);
        }
        return normalized;
    }

    function isIpv4Blocked(hostname) {
        var segments = isIpv4Host(hostname);
        if (!segments) {
            return false;
        }
        var first = segments[0];
        var second = segments[1];
        if (first === 10) return true;
        if (first === 127) return true;
        if (first === 169 && second === 254) return true;
        if (first === 172 && second >= 16 && second <= 31) return true;
        if (first === 192 && second === 168) return true;
        if (first === 0 && second === 0 && segments[2] === 0 && segments[3] === 0) return true;
        if (first === 100 && second >= 64 && second <= 127) return true;
        if (first === 198 && (second === 18 || second === 19)) return true;
        return false;
    }

    function isIpv6Blocked(hostname) {
        if (!hostname) {
            return false;
        }
        var normalizedHostname = hostname;
        if (
            normalizedHostname[0] === '[' &&
            normalizedHostname[normalizedHostname.length - 1] === ']'
        ) {
            normalizedHostname = normalizedHostname.slice(1, -1);
        }
        if (normalizedHostname.indexOf(':') === -1) {
            return false;
        }
        var normalized = normalizedHostname.toLowerCase();
        return (
            normalized === '::1' ||
            normalized === '0:0:0:0:0:0:0:1' ||
            stringStartsWith(normalized, 'fe80:') ||
            stringStartsWith(normalized, 'fc00:') ||
            stringStartsWith(normalized, 'fd00:')
        );
    }

    function isSchemeAllowed(protocol) {
        if (!protocol) {
            return false;
        }
        var scheme = protocol.replace(':', '').toLowerCase();
        return PREVIEW_ALLOWED_SCHEMES.indexOf(scheme) !== -1;
    }

    function stringEndsWith(value, suffix) {
        if (typeof value !== 'string' || typeof suffix !== 'string') {
            return false;
        }
        if (typeof value.endsWith === 'function') {
            return value.endsWith(suffix);
        }
        if (suffix.length > value.length) {
            return false;
        }
        return value.lastIndexOf(suffix) === value.length - suffix.length;
    }

    function isHostnameBlocked(hostname) {
        var normalized = normalizeHostname(hostname);
        if (!normalized) {
            return true;
        }
        if (PREVIEW_BLOCKED_HOSTNAMES.indexOf(normalized) !== -1) {
            return true;
        }
        for (var idx = 0; idx < PREVIEW_BLOCKED_HOSTNAME_SUFFIXES.length; idx++) {
            if (stringEndsWith(normalized, PREVIEW_BLOCKED_HOSTNAME_SUFFIXES[idx])) {
                return true;
            }
        }
        return isIpv4Blocked(normalized) || isIpv6Blocked(normalized);
    }

    function shouldBlockPreview() {
        var globals = resolveGlobals();
        var chatWidget = globals.appSettings?.chatWidget;
        if (!chatWidget) {
            return false;
        }
        return chatWidget.blockUrlPreview === true || chatWidget.disableLinkPreview === true;
    }

    function isUrlBlockedForPreview(url) {
        var parsedUrl = parsePreviewUrl(url);
        if (!parsedUrl) {
            return true;
        }
        if (!isSchemeAllowed(parsedUrl.protocol)) {
            return true;
        }
        return isHostnameBlocked(parsedUrl.hostname);
    }

    var previewUtils = {
        shouldBlockPreview: shouldBlockPreview,
        isUrlBlockedForPreview: isUrlBlockedForPreview,
        isHostnameBlocked: isHostnameBlocked,
        parsePreviewUrl: parsePreviewUrl,
    };

    globalContext.KommunicatePreviewUtils = globalContext.KommunicatePreviewUtils || previewUtils;

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = globalContext.KommunicatePreviewUtils;
    }
})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : {});
