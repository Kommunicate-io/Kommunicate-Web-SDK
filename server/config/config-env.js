const configEnv = {
  "development": {
    "port": "3030",
    "urls": {
      "applozicBaseUrl": "https://apps-test.applozic.com",
      "kommunicateBaseUrl": "https://api-test.kommunicate.io",
      "hostUrl": "http://localhost:3030"
    },
    "pluginProperties": {
      "pseudoNameEnabled": true
    },
    "thirdPartyIntegration": {
      "sentry": {
        "plugin": {
          "dsn": "https://a7fe0d3754264f649630801e7349da27@sentry.io/1324243",
          "enable": false
        },
        "server": {
          "dsn": "https://93e611ec9efc4ce396769bdbbff587d2@sentry.io/1325823",
          "enable": false
        }
      }
    }
  },
  "test": {
    "port": "3032",
    "urls": {
      "applozicBaseUrl": "https://apps-test.applozic.com",
      "kommunicateBaseUrl": "https://api-test.kommunicate.io",
      "hostUrl": "https://plugin-test.kommunicate.io"
    },
    "pluginProperties": {
      "pseudoNameEnabled": true
    },
    "thirdPartyIntegration": {
      "sentry": {
        "plugin": {
          "dsn": "https://a7fe0d3754264f649630801e7349da27@sentry.io/1324243",
          "enable": true
        },
        "server": {
          "dsn": "https://93e611ec9efc4ce396769bdbbff587d2@sentry.io/1325823",
          "enable": false
        }
      }
    }
  },
  "staging": {
    "port": "3033",
    "urls": {
      "applozicBaseUrl": "https://apps-test.applozic.com",
      "kommunicateBaseUrl": "https://api-staging.kommunicate.io",
      "hostUrl": "https://plugin-staging.kommunicate.io"
    },
    "pluginProperties": {
      "pseudoNameEnabled": true
    },
    "thirdPartyIntegration": {
      "sentry": {
        "plugin": {
          "dsn": "https://a7fe0d3754264f649630801e7349da27@sentry.io/1324243",
          "enable": true
        },
        "server": {
          "dsn": "https://93e611ec9efc4ce396769bdbbff587d2@sentry.io/1325823",
          "enable": false
        }
      }
    }
  },
  "prod": {
    "port": "3032",
    "urls": {
      "applozicBaseUrl": "https://chat.kommunicate.io",
      "kommunicateBaseUrl": "https://api.kommunicate.io",
      "hostUrl": "https://plugin.kommunicate.io"
    },
    "pluginProperties": {
      "pseudoNameEnabled": true
    },
    "thirdPartyIntegration": {
      "sentry": {
        "plugin": {
          "dsn": "https://a7fe0d3754264f649630801e7349da27@sentry.io/1324243",
          "enable": true
        },
        "server": {
          "dsn": "https://93e611ec9efc4ce396769bdbbff587d2@sentry.io/1325823",
          "enable": true
        }
      }
    }
  },
  "prod_ca": {
    "port": "3031",
    "urls": {
      "applozicBaseUrl": "https://chat-ca.kommunicate.io",
      "kommunicateBaseUrl": "https://api-ca.kommunicate.io",
      "hostUrl": "https://plugin-ca.kommunicate.io"
    },
    "pluginProperties": {
      "pseudoNameEnabled": true
    },
    "thirdPartyIntegration": {
      "sentry": {
        "plugin": {
          "dsn": "https://a7fe0d3754264f649630801e7349da27@sentry.io/1324243",
          "enable": true
        },
        "server": {
          "dsn": "https://93e611ec9efc4ce396769bdbbff587d2@sentry.io/1325823",
          "enable": true
        }
      }
    }
  },
  "commonResources": {
    // add common resources for all environments below
  }

}

const getEnvId = function () {
  return process.env.NODE_ENV || "development";
};

const config = configEnv[getEnvId()];

module.exports = config;
module.exports.getEnvId = getEnvId;