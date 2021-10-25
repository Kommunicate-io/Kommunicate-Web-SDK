const configEnv = {
    development: {
        port: '3030',
        urls: {
            applozicBaseUrl: 'https://chat-test.kommunicate.io',
            kommunicateBaseUrl: 'https://api-test.kommunicate.io',
            botPlatformApi: 'https://bots-test.kommunicate.io',
            hostUrl: 'http://localhost:3030',
            dashboardUrl: 'https://dashboard-test.kommunicate.io',
        },
        pluginProperties: {
            pseudoNameEnabled: true,
        },
        thirdPartyIntegration: {
            sentry: {
                dsn:
                    'https://b1187d11fbdc4632b29259b258dd9053@o418176.ingest.sentry.io/5338197',
                enabled: false,
            },
            aws: {
                cdnUrl: 'https://cdn-test.kommunicate.io',
                bucket: 'km-test-cdn',
            },
        },
    },
    test: {
        port: '3030',
        urls: {
            applozicBaseUrl: 'https://chat-test.kommunicate.io',
            kommunicateBaseUrl: 'https://api-test.kommunicate.io',
            botPlatformApi: 'https://bots-test.kommunicate.io',
            hostUrl: 'https://widget-test.kommunicate.io',
            dashboardUrl: 'https://dashboard-test.kommunicate.io',
        },
        pluginProperties: {
            pseudoNameEnabled: true,
        },
        thirdPartyIntegration: {
            sentry: {
                dsn:
                    'https://b1187d11fbdc4632b29259b258dd9053@o418176.ingest.sentry.io/5338197',
                enabled: true,
            },
            aws: {
                cdnUrl: 'https://cdn-test.kommunicate.io',
                bucket: 'km-test-cdn',
            },
        },
    },
    staging: {
        port: '3031',
        urls: {
            applozicBaseUrl: 'https://chat-test.kommunicate.io',
            kommunicateBaseUrl: 'https://api-staging.kommunicate.io',
            botPlatformApi: 'https://bots-test.kommunicate.io',
            hostUrl: 'https://widget-staging.kommunicate.io',
            dashboardUrl: 'https://dashboard-staging.kommunicate.io',
        },
        pluginProperties: {
            pseudoNameEnabled: true,
        },
        thirdPartyIntegration: {
            sentry: {
                dsn:
                    'https://b1187d11fbdc4632b29259b258dd9053@o418176.ingest.sentry.io/5338197',
                enabled: true,
            },
            aws: {
                cdnUrl: 'https://cdn-test.kommunicate.io',
                bucket: 'km-test-cdn',
            },
        },
    },
    prod: {
        port: '3030',
        urls: {
            applozicBaseUrl: 'https://chat.kommunicate.io',
            kommunicateBaseUrl: 'https://api.kommunicate.io',
            botPlatformApi: 'https://bots.kommunicate.io',
            hostUrl: 'https://widget.kommunicate.io',
            dashboardUrl: 'https://dashboard.kommunicate.io',
        },
        pluginProperties: {
            pseudoNameEnabled: true,
        },
        thirdPartyIntegration: {
            sentry: {
                dsn:
                    'https://9f71614ef8184d0cab00074555dad9a7@sentry.io/1321911',
                enabled: false,
            },
            aws: {
                cdnUrl: 'https://cdn.kommunicate.io',
                bucket: 'km-prod-cdn',
            },
        },
    },
    prod_ca: {
        port: '3030',
        urls: {
            applozicBaseUrl: 'https://chat-ca.kommunicate.io',
            kommunicateBaseUrl: 'https://api-ca.kommunicate.io',
            hostUrl: 'https://widget-ca.kommunicate.io',
            dashboardUrl: 'https://dashboard-ca.kommunicate.io',
        },
        pluginProperties: {
            pseudoNameEnabled: true,
        },
        thirdPartyIntegration: {
            sentry: {
                dsn:
                    'https://9f71614ef8184d0cab00074555dad9a7@sentry.io/1321911',
                enabled: false,
            },
            aws: {
                cdnUrl: 'https://cdn.kommunicate.io',
                bucket: 'km-prod-cdn',
            },
        },
    },

    prod_in: {
        port: '3030',
        urls: {
            applozicBaseUrl: 'https://chat-in.kommunicate.io',
            kommunicateBaseUrl: 'https://api-in.kommunicate.io',
            botPlatformApi: 'https://bots-in.kommunicate.io',
            hostUrl: 'https://widget-in.kommunicate.io',
            dashboardUrl: 'https://dashboard-in.kommunicate.io',
        },
        pluginProperties: {
            pseudoNameEnabled: true,
        },
        thirdPartyIntegration: {
            sentry: {
                dsn:
                    'https://9f71614ef8184d0cab00074555dad9a7@sentry.io/1321911',
                enabled: false,
            },
            aws: {
                cdnUrl: 'https://cdn.kommunicate.io',
                bucket: 'km-prod-cdn',
            },
        },
    },
    prod_ire: {
        port: '3030',
        urls: {
            applozicBaseUrl: 'https://chat-ire.kommunicate.io',
            kommunicateBaseUrl: 'https://api-ire.kommunicate.io',
            hostUrl: 'https://widget-ire.kommunicate.io',
            dashboardUrl: 'https://dashboard-ire.kommunicate.io',
        },
        pluginProperties: {
            pseudoNameEnabled: true,
        },
        thirdPartyIntegration: {
            sentry: {
                plugin: {
                    dsn:
                        'https://a7fe0d3754264f649630801e7349da27@sentry.io/1324243',
                    enable: false,
                },
                server: {
                    dsn:
                        'https://93e611ec9efc4ce396769bdbbff587d2@sentry.io/1325823',
                    enable: true,
                },
            },
        },
    },
    prod_enterprise: {
        port: '3033',
        urls: {
            applozicBaseUrl: 'https://chat.kommunicate.io',
            kommunicateBaseUrl: 'https://api-enterprise.kommunicate.io',
            botPlatformApi: 'https://bots.kommunicate.io',
            hostUrl: 'https://widget-enterprise.kommunicate.io',
            dashboardUrl: 'https://dashboard-enterprise.kommunicate.io',
        },
        pluginProperties: {
            pseudoNameEnabled: true,
        },
        thirdPartyIntegration: {
            sentry: {
                dsn:
                    'https://9f71614ef8184d0cab00074555dad9a7@sentry.io/1321911',
                enabled: false,
            },
            aws: {
                cdnUrl: 'https://cdn.kommunicate.io',
                bucket: 'km-prod-cdn',
            },
        },
    },
    prod_beta: {
        port: '3034',
        urls: {
            applozicBaseUrl: 'https://chat.kommunicate.io',
            kommunicateBaseUrl: 'https://api.kommunicate.io',
            botPlatformApi: 'https://bots.kommunicate.io',
            hostUrl: 'https://widget-beta.kommunicate.io',
            dashboardUrl: 'https://dashboard-beta.kommunicate.io',
        },
        pluginProperties: {
            pseudoNameEnabled: true,
        },
        thirdPartyIntegration: {
            sentry: {
                dsn:
                    'https://9f71614ef8184d0cab00074555dad9a7@sentry.io/1321911',
                enabled: false,
            },
            aws: {
                cdnUrl: 'https://cdn.kommunicate.io',
                bucket: 'km-prod-cdn',
            },
        },
    },
    commonResources: {
        // add common resources for all environments below
    },
};

const getEnvId = function () {
    return process.env.NODE_ENV || 'development';
};

const config = configEnv[getEnvId()];

module.exports = config;
module.exports.getEnvId = getEnvId;
