import CommonUtils from '../utils/CommonUtils';
import * as Sentry from '@sentry/browser'


export const setTag = (scope) => {
    try {
        let userSession = CommonUtils.getUserSession();
        scope.setTag("applicationId", userSession.application.applicationId);
        scope.setTag("userId", userSession.userName);
        scope.setUser({
            id: userSession.application.applicationId,
            username: userSession.userName
        });
    } catch (error) {
        Sentry.captureException(error);
    }

}
