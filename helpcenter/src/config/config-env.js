export const config = {
    "development": {
        "baseurl": {    
            "kommunicateAPI": "https://api-test.kommunicate.io",
        },
        "kommunicateDashboardUrl": "https://dashboard-test.kommunicate.io",
        "kommunicateWebsiteUrl": "https://test.kommunicate.io",
        "applozicWebsiteUrl": "https://test.applozic.com",
    },
    "test": {
        "baseurl": {
            "kommunicateAPI": "https://api-test.kommunicate.io",
        },
        "kommunicateDashboardUrl": "https://dashboard-test.kommunicate.io",
        "kommunicateWebsiteUrl": "https://test.kommunicate.io",
        "applozicWebsiteUrl": "https://test.applozic.com",
    },
    "production": {
        "baseurl": {
            "kommunicateAPI": "https://api.kommunicate.io",
        },
        "kommunicateDashboardUrl": "https://dashboard.kommunicate.io",
        "kommunicateWebsiteUrl": "https://www.kommunicate.io",
        "applozicWebsiteUrl": "https://www.applozic.com",
    }
}


export function getEnvironment() {
    const env = process.env.NODE_ENV || 'development';
    return env;
}