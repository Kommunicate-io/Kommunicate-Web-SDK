const configEnv = {
  "development": {
    "port": "3030",
    "urls": {
      "applozicBaseUrl": "https://apps-test.applozic.com",
      "kommunicateBaseUrl": "https://api-test.kommunicate.io",
      "botPlatformApi": "https://bots-test.kommunicate.io",
      "hostUrl": "http://localhost:3030"
    },
    "pluginProperties": {
      "pseudoNameEnabled": true
    },
    "thirdPartyIntegration": {
      "sentry": {
          "dsn": "https://96d4622a4b27476f9544833f8bf6e4f7@sentry.io/1729405",
          "enabled": false
      },
      "aws": {
         "cdnUrl": "https://cdn-test.kommunicate.io",
         "bucket": "cdn-kommunicate"
      }
    }
  },
  "test": {
    "port": "3030",
    "urls": {
      "applozicBaseUrl": "https://apps-test.applozic.com",
      "kommunicateBaseUrl": "https://api-test.kommunicate.io",
      "botPlatformApi": "https://bots-test.kommunicate.io",
      "hostUrl": "https://widget-test.kommunicate.io"
    },
    "pluginProperties": {
      "pseudoNameEnabled": true
    },
    "thirdPartyIntegration": {
      "sentry": {
          "dsn": "https://96d4622a4b27476f9544833f8bf6e4f7@sentry.io/1729405",
          "enabled": true
      },
      "aws": {
         "cdnUrl": "https://cdn-test.kommunicate.io",
         "bucket": "cdn-kommunicate"
      }
    }
  },
  "staging": {
    "port": "3031",
    "urls": {
      "applozicBaseUrl": "https://apps-test.applozic.com",
      "kommunicateBaseUrl": "https://api-staging.kommunicate.io",
      "botPlatformApi": "https://bots-test.kommunicate.io",
      "hostUrl": "https://widget-staging.kommunicate.io"
    },
    "pluginProperties": {
      "pseudoNameEnabled": true
    },
    "thirdPartyIntegration": {
      "sentry": {
          "dsn": "https://96d4622a4b27476f9544833f8bf6e4f7@sentry.io/1729405",
          "enabled": true
      },
      "aws": {
         "cdnUrl": "https://cdn-test.kommunicate.io",
         "bucket": "cdn-kommunicate"
      }
    }
  },
  "prod": {
    "port": "3030",
    "urls": {
      "applozicBaseUrl": "https://chat.kommunicate.io",
      "kommunicateBaseUrl": "https://api.kommunicate.io",
      "botPlatformApi": "https://bots.kommunicate.io",
      "hostUrl": "https://widget.kommunicate.io"
    },
    "pluginProperties": {
      "pseudoNameEnabled": true
    },
    "thirdPartyIntegration": {
      "sentry": {
          "dsn": "https://9f71614ef8184d0cab00074555dad9a7@sentry.io/1321911",
          "enabled": false
      },
      "aws": {
         "cdnUrl": "https://cdn.kommunicate.io",
         "bucket": "kommunicate-cdn"
      }
    }
  },
  "prod_ca": {
    "port": "3030",
    "urls": {
      "applozicBaseUrl": "https://chat-ca.kommunicate.io",
      "kommunicateBaseUrl": "https://api-ca.kommunicate.io",
      "hostUrl": "https://widget-ca.kommunicate.io"
    },
    "pluginProperties": {
      "pseudoNameEnabled": true
    },
    "thirdPartyIntegration": {
      "sentry": {
          "dsn": "https://9f71614ef8184d0cab00074555dad9a7@sentry.io/1321911",
          "enabled": false
      },
      "aws": {
         "cdnUrl": "https://cdn.kommunicate.io",
         "bucket": "kommunicate-cdn"
      }
    }
  },
  
  "prod_in": {
    "port": "3030",
    "urls": {
      "applozicBaseUrl": "https://chat-in.kommunicate.io",
      "kommunicateBaseUrl": "https://api-in.kommunicate.io",
      "botPlatformApi": "https://bots-in.kommunicate.io",
      "hostUrl": "https://widget-in.kommunicate.io"
    },
    "pluginProperties": {
      "pseudoNameEnabled": true
    },
    "thirdPartyIntegration": {
      "sentry": {
          "dsn": "https://9f71614ef8184d0cab00074555dad9a7@sentry.io/1321911",
          "enabled": false
      },
      "aws": {
         "cdnUrl": "https://cdn.kommunicate.io",
         "bucket": "kommunicate-cdn"
      }
    }
  },
    "prod_ire": {
    "port": "3030",
    "urls": {
      "applozicBaseUrl": "https://chat-ire.kommunicate.io",
      "kommunicateBaseUrl": "https://api-ire.kommunicate.io",
      "hostUrl": "https://widget-ire.kommunicate.io"
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
