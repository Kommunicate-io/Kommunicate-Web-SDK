const getThirdPartyIntegrationContext = (config) => {
    const THIRD_PARTY_INTEGRATION = (config && config.thirdPartyIntegration) || {};
    const { sentry, ...MCK_THIRD_PARTY_INTEGRATION_WITHOUT_SENTRY } = THIRD_PARTY_INTEGRATION;
    const MCK_THIRD_PARTY_INTEGRATION =
        sentry && sentry.enabled === false
            ? MCK_THIRD_PARTY_INTEGRATION_WITHOUT_SENTRY
            : THIRD_PARTY_INTEGRATION;

    return {
        THIRD_PARTY_INTEGRATION,
        MCK_THIRD_PARTY_INTEGRATION,
        sentryCfg: sentry || null,
    };
};

module.exports = {
    getThirdPartyIntegrationContext,
};
