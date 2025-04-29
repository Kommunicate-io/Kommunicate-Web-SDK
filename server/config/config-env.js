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
                nameSpace: '0494b01c401dbac92222bf85f41e26a0',
                dsn:
                    'https://0494b01c401dbac92222bf85f41e26a0@o4508295387480064.ingest.us.sentry.io/4508295388790784',
                PROJECT: 'test-widget',
                ORG: 'kommunicateio',
                PROJECT: 'widget-test',
                AUTH_TOKEN:
                    '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',
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
                nameSpace: '0494b01c401dbac92222bf85f41e26a0',
                dsn:
                    'https://0494b01c401dbac92222bf85f41e26a0@o4508295387480064.ingest.us.sentry.io/4508295388790784',
                enabled: true,
                PROJECT: 'test-widget',
                ORG: 'km-test',
                AUTH_TOKEN:
                    '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',
            },
            aws: {
                cdnUrl: 'https://cdn-test.kommunicate.io',
                bucket: 'kom-test-cdn',
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
                nameSpace: '0494b01c401dbac92222bf85f41e26a0',
                dsn:
                    'https://0494b01c401dbac92222bf85f41e26a0@o4508295387480064.ingest.us.sentry.io/4508295388790784',
                PROJECT: 'test-widget',
                ORG: 'kommunicateio',
                PROJECT: 'widget-test',
                AUTH_TOKEN:
                    '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',
                enabled: false,
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
                nameSpace: '0494b01c401dbac92222bf85f41e26a0',
                dsn:
                    'https://0494b01c401dbac92222bf85f41e26a0@o4508295387480064.ingest.us.sentry.io/4508295388790784',
                PROJECT: 'widget-test',
                ORG: 'kommunicateio',
                AUTH_TOKEN:
                    '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',
                enabled: false,
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
                nameSpace: '9f71614ef8184d0cab00074555dad9a7',
                dsn: 'https://9f71614ef8184d0cab00074555dad9a7@sentry.io/1321911',
                enabled: true,
                AUTH_TOKEN:
                    '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',
                PROJECT: 'chat-widget',
                ORG: 'applozic',
            },
            aws: {
                cdnUrl: 'https://cdn.kommunicate.io',
                bucket: 'kom-prod-cdn',
            },
        },
    },
    prod_agenticfirst: {
        port: '3030',
        urls: {
            applozicBaseUrl: 'https://chat.kommunicate.io',
            kommunicateBaseUrl: 'https://api.kommunicate.io',
            botPlatformApi: 'https://bots.kommunicate.io',
            hostUrl: 'https://widget.agenticfirst.ai',
            dashboardUrl: 'https://dashboard.kommunicate.io',
        },
        pluginProperties: {
            pseudoNameEnabled: true,
        },
        thirdPartyIntegration: {
            sentry: {
                nameSpace: '9f71614ef8184d0cab00074555dad9a7',
                dsn: 'https://9f71614ef8184d0cab00074555dad9a7@sentry.io/1321911',
                enabled: true,
                AUTH_TOKEN:
                    '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',
                PROJECT: 'chat-widget',
                ORG: 'applozic',
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
                nameSpace: '9f71614ef8184d0cab00074555dad9a7',
                dsn: 'https://9f71614ef8184d0cab00074555dad9a7@sentry.io/1321911',
                enabled: true,
                AUTH_TOKEN:
                    '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',
                PROJECT: 'chat-widget',
                ORG: 'applozic',
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
                nameSpace: '9f71614ef8184d0cab00074555dad9a7',
                dsn: 'https://9f71614ef8184d0cab00074555dad9a7@sentry.io/1321911',
                enabled: true,
                AUTH_TOKEN:
                    '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',
                PROJECT: 'chat-widget',
                ORG: 'applozic',
            },
            aws: {
                cdnUrl: 'https://cdn.kommunicate.io',
                bucket: 'kom-prod-cdn',
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
                    nameSpace: '9f71614ef8184d0cab00074555dad9a7',
                    dsn: 'https://9f71614ef8184d0cab00074555dad9a7@sentry.io/1321911',
                    enabled: true,
                    AUTH_TOKEN:
                        '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',
                    PROJECT: 'chat-widget',
                    ORG: 'applozic',
                },
                server: {
                    dsn: 'https://93e611ec9efc4ce396769bdbbff587d2@sentry.io/1325823',
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
                nameSpace: '9f71614ef8184d0cab00074555dad9a7',
                dsn: 'https://9f71614ef8184d0cab00074555dad9a7@sentry.io/1321911',
                enabled: true,
                AUTH_TOKEN:
                    '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',
                PROJECT: 'chat-widget',
                ORG: 'applozic',
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
            dashboardUrl: 'https://dashboard-beta.kommunicate.io',
        },
        pluginProperties: {
            pseudoNameEnabled: true,
        },
        thirdPartyIntegration: {
            sentry: {
                nameSpace: '9f71614ef8184d0cab00074555dad9a7',
                dsn: 'https://9f71614ef8184d0cab00074555dad9a7@sentry.io/1321911',
                enabled: true,
                AUTH_TOKEN:
                    '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',
                PROJECT: 'chat-widget',
                ORG: 'applozic',
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
