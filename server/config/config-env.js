{
  "development": {
    "port": "3030",
    "urls": {
      "applozicBaseUrl": "https://chat-test.kommunicate.io",
      "kommunicateBaseUrl": "https://api-test.kommunicate.io",
      "botPlatformApi": "https://bots-test.kommunicate.io",
      "hostUrl": "http://localhost:3030",
      "dashboardUrl": "https://dashboard-test.kommunicate.io"
    },
    "pluginProperties": {
      "pseudoNameEnabled": true
    },
    "thirdPartyIntegration": {
      "sentry": {
        "dsn": "https://b1187d11fbdc4632b29259b258dd9053@o418176.ingest.sentry.io/5338197",
        "enabled": false
      },
      "aws": {
        "cdnUrl": "https://cdn-test.kommunicate.io",
        "bucket": "kom-test-cdn"
      }
    }
  },
  "test": {
    "port": "3030",
    "urls": {
      "applozicBaseUrl": "https://chat-test.kommunicate.io",
      "kommunicateBaseUrl": "https://api-test.kommunicate.io",
      "botPlatformApi": "https://bots-test.kommunicate.io",
      "hostUrl": "https://widget-test.kommunicate.io",
      "dashboardUrl": "https://dashboard-test.kommunicate.io"
    },
    "pluginProperties": {
      "pseudoNameEnabled": true
    },
    "thirdPartyIntegration": {
      "sentry": {
        "dsn": "https://b1187d11fbdc4632b29259b258dd9053@o418176.ingest.sentry.io/5338197",
        "enabled": true
      },
      "aws": {
        "cdnUrl": "https://cdn-test.kommunicate.io",
        "bucket": "kom-test-cdn"
      }
    }
  },
  "release": {
    "port": "3031",
    "urls": {
      "applozicBaseUrl": "https://chat-gcp.kommunicate.io/",
      "kommunicateBaseUrl": "https://api-server-prod-dot-km-prod-us.uk.r.appspot.com/",
      "botPlatformApi": "https://bot-server-prod-dot-km-prod-us.uk.r.appspot.com/",
      "hostUrl": "https://km-prod.web.app/",
      "dashboardUrl": "https://dashboard-release.kommunicate.io"
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
        "bucket": "kom-prod-cdn"
      }
    }
  },
  "prod": {
    "port": "3030",
    "urls": {
      "applozicBaseUrl": "https://chat.kommunicate.io",
      "kommunicateBaseUrl": "https://api.kommunicate.io",
      "botPlatformApi": "https://bots.kommunicate.io",
      "hostUrl": "https://widget.kommunicate.io",
      "dashboardUrl": "https://dashboard.kommunicate.io"
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
        "bucket": "kom-prod-cdn"
      }
    }
  },
  "prod_cn": {
    "port": "3030",
    "urls": {
      "applozicBaseUrl": "https://chat-cn.kommunicate.io",
      "kommunicateBaseUrl": "https://api-cn.kommunicate.io",
      "hostUrl": "https://widget-cn.kommunicate.io",
      "dashboardUrl": "https://dashboard-cn.kommunicate.io"
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
        "bucket": "kom-prod-cdn"
      }
    }
  }
}
