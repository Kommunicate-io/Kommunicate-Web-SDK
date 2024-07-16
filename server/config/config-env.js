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
                bucket: 'kom-test-cdn',
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
                bucket: 'kom-test-cdn',
            },
        },
    },
    release: {
        port: '3031',
        urls: {
            applozicBaseUrl: 'https://chat-release.kommunicate.io',
            kommunicateBaseUrl: 'https://api-release.kommunicate.io',
            botPlatformApi: 'https://bots-release.kommunicate.io',
            hostUrl: 'https://widget-release.kommunicate.io',
            dashboardUrl: 'https://dashboard-master.kommunicate.io',
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
                bucket: 'kom-test-cdn',
            },
        },
    },
    
    release: {
        port: '3031',
        urls: {
            applozicBaseUrl: 'https://chat-test.kommunicate.io',
            kommunicateBaseUrl: 'https://api-test.kommunicate.io',
            botPlatformApi: 'https://bots-test.kommunicate.io',
            hostUrl: 'https://widget-release.kommunicate.io',
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
                bucket: 'kom-test-cdn',
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
                enabled: true,
            },
            aws: {
                cdnUrl: 'https://cdn.kommunicate.io',
                bucket: 'kom-prod-cdn',
            },
        },
    },
    prod_cn: {
        port: '3030',
        urls: {
            applozicBaseUrl: 'https://chat-cn.kommunicate.io',
            kommunicateBaseUrl: 'https://api-cn.kommunicate.io',
            hostUrl: 'https://widget-cn.kommunicate.io',
            dashboardUrl: 'https://dashboard-cn.kommunicate.io',
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
                bucket: 'kom-prod-cdn',
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
                bucket: 'kom-prod-cdn',
            },
        },
    },
    
    prod_eu: {
        port: '3030',
        urls: {
            applozicBaseUrl: 'https://chat-eu.kommunicate.io',
            kommunicateBaseUrl: 'https://api-eu.kommunicate.io',
            botPlatformApi: 'https://bots-eu.kommunicate.io',
            hostUrl: 'https://widget-eu.kommunicate.io',
            dashboardUrl: 'https://dashboard-eu.kommunicate.io',
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
                bucket: 'kom-prod-cdn',
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
                bucket: 'kom-prod-cdn',
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
            dashboardUrl: 'https://beta.kommunicate.io',
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
                bucket: 'kom-prod-cdn',
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
