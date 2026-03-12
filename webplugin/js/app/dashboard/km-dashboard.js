var KMDashboard = (function () {
    'use strict';

    function normalizeDashboardSourceValue(value) {
        if (typeof value === 'undefined' || value === null) {
            return '';
        }
        return String(value).trim().toUpperCase();
    }

    function resolveDashboardMetadata(options) {
        var metadata = options && options.metadata ? options.metadata : null;
        if (typeof metadata === 'string' && metadata.trim()) {
            try {
                metadata = JSON.parse(metadata);
            } catch (error) {
                metadata = null;
            }
        }
        return metadata && typeof metadata === 'object' ? metadata : null;
    }

    function isDashboardWidget(options) {
        var resolvedOptions = options || {};
        var metadata = resolveDashboardMetadata(resolvedOptions);
        var sourceValue =
            (metadata &&
                (metadata.KM_SOURCE ||
                    metadata.km_source ||
                    metadata.kmSource ||
                    metadata.source)) ||
            resolvedOptions.KM_SOURCE ||
            resolvedOptions.km_source ||
            resolvedOptions.source ||
            '';
        if (!sourceValue && resolvedOptions.widgetSettings) {
            var widgetMetadata = resolveDashboardMetadata(resolvedOptions.widgetSettings);
            sourceValue =
                (widgetMetadata &&
                    (widgetMetadata.KM_SOURCE ||
                        widgetMetadata.km_source ||
                        widgetMetadata.kmSource ||
                        widgetMetadata.source)) ||
                sourceValue;
        }
        if (!sourceValue && resolvedOptions.appSettings) {
            var appSettingsMetadata = resolveDashboardMetadata(resolvedOptions.appSettings);
            sourceValue =
                (appSettingsMetadata &&
                    (appSettingsMetadata.KM_SOURCE ||
                        appSettingsMetadata.km_source ||
                        appSettingsMetadata.kmSource ||
                        appSettingsMetadata.source)) ||
                sourceValue;
        }
        var normalizedSource = normalizeDashboardSourceValue(sourceValue);
        return normalizedSource.indexOf('DASHBOARD') !== -1;
    }

    function attach(target, deps) {
        if (!target) {
            return;
        }
        target.isDashboardWidget = function (options) {
            var resolvedOptions = options || (deps && deps.appOptions) || {};
            return isDashboardWidget(resolvedOptions);
        };
    }

    return {
        attach: attach,
        isDashboardWidget: isDashboardWidget,
    };
})();
