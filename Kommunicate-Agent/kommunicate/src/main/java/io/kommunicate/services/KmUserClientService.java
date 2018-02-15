package io.kommunicate.services;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.media.AudioAttributes;
import android.media.RingtoneManager;
import android.os.Build;
import android.support.annotation.RequiresApi;
import android.text.TextUtils;

import com.applozic.mobicomkit.ApplozicClient;
import com.applozic.mobicomkit.api.HttpRequestUtils;
import com.applozic.mobicomkit.api.MobiComKitConstants;
import com.applozic.mobicomkit.api.account.register.RegisterUserClientService;
import com.applozic.mobicomkit.api.account.register.RegistrationResponse;
import com.applozic.mobicomkit.api.account.user.MobiComUserPreference;
import com.applozic.mobicomkit.api.account.user.User;
import com.applozic.mobicomkit.api.account.user.UserClientService;
import com.applozic.mobicomkit.api.conversation.ApplozicMqttIntentService;
import com.applozic.mobicomkit.api.conversation.ConversationIntentService;
import com.applozic.mobicomkit.contact.AppContactService;
import com.applozic.mobicomkit.exception.InvalidApplicationException;
import com.applozic.mobicomkit.exception.UnAuthoriseException;
import com.applozic.mobicommons.commons.core.utils.Utils;
import com.applozic.mobicommons.people.contact.Contact;
import com.google.gson.Gson;

import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.net.ConnectException;
import java.net.URLEncoder;
import java.util.List;
import java.util.TimeZone;

import io.kommunicate.users.KMUser;
import io.kommunicate.users.KmAgent;

/**
 * Created by ashish on 30/01/18.
 */

public class KmUserClientService extends UserClientService {

    private static final String USER_LIST_FILTER_URL = "/rest/ws/user/v3/filter?startIndex=";
    private static final String USER_LOGIN_API = "/login";
    private static final String USER_SIGNUP_API = "/customers?preSignUp=";
    private static final String KM_PROD_BASE_URL = "https://api.kommunicate.io";
    private static final String KM_TEST_BASE_URL = "http://api-test.kommunicate.io";
    private static final String KM_APP_LIST_BASE_URL = "https://chat.kommunicate.io";
    private static final String GET_APPLICATION_LIST = "/rest/ws/user/getlist";
    private static final String USER_PASSWORD_RESET = "/users/password-reset";
    private HttpRequestUtils httpRequestUtils;
    private static final String TAG = "KmUserClientService";
    private static final String INVALID_APP_ID = "INVALID_APPLICATIONID";

    public KmUserClientService(Context context) {
        super(context);
        httpRequestUtils = new HttpRequestUtils(context);
    }

    private String getUserListFilterUrl() {
        return getBaseUrl() + USER_LIST_FILTER_URL;
    }

    private String getKmBaseUrl() {
        if (getBaseUrl().contains("apps.applozic")) {
            return KM_PROD_BASE_URL;
        }
        return KM_TEST_BASE_URL;
    }

    private String getApplicationListUrl() {
        return getBaseUrl() + GET_APPLICATION_LIST;
    }

    private String getLoginUserUrl() {
        return getKmBaseUrl() + USER_LOGIN_API;
    }

    public String getUserListFilter(List<String> roleList, int startIndex, int pageSize) {
        StringBuilder urlBuilder = new StringBuilder(getUserListFilterUrl());

        urlBuilder.append(startIndex);
        urlBuilder.append("&pageSize=");
        urlBuilder.append(pageSize);

        if (roleList != null && !roleList.isEmpty()) {
            for (String role : roleList) {
                urlBuilder.append("&");
                urlBuilder.append("roleNameList=");
                urlBuilder.append(role);
            }
        }

        return httpRequestUtils.getResponse(urlBuilder.toString(), "application/json", "application/json");
    }

    public String getApplicationList(String userId, boolean isEmailId) {
        if (TextUtils.isEmpty(userId)) {
            return null;
        }
        try {
            String url = getApplicationListUrl() + "?roleNameList=APPLICATION_WEB_ADMIN&" + (isEmailId ? "emailId=" : "userId=") + userId;
            return httpRequestUtils.getResponse(url, "application/json", "application/json");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public String resetUserPassword(String userId, String appKey) {
        if (userId == null || appKey == null) {
            return null;
        }

        String url = getKmBaseUrl() + USER_PASSWORD_RESET;

        try {
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("userId", userId);
            jsonObject.put("applicationId", appKey);

            return httpRequestUtils.postJsonToServer(url, jsonObject.toString());
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public RegistrationResponse loginKmUser(KMUser user) throws Exception {
        if (user == null) {
            return null;
        }

        user.setDeviceType(Short.valueOf("1"));
        user.setPrefContactAPI(Short.valueOf("2"));
        user.setTimezone(TimeZone.getDefault().getID());
        user.setEnableEncryption(user.isEnableEncryption());
        user.setRoleType(User.RoleType.AGENT.getValue());
        user.setRoleName(User.RoleName.APPLICATION_WEB_ADMIN.getValue());


        MobiComUserPreference mobiComUserPreference = MobiComUserPreference.getInstance(context);

        Gson gson = new Gson();
        user.setAppVersionCode(MOBICOMKIT_VERSION_CODE);
        user.setApplicationId(getApplicationKey(context));
        user.setRegistrationId(mobiComUserPreference.getDeviceRegistrationId());

        if (getAppModuleName(context) != null) {
            user.setAppModuleName(getAppModuleName(context));
        }

        Utils.printLog(context, TAG, "Net status" + Utils.isInternetAvailable(context.getApplicationContext()));

        if (!Utils.isInternetAvailable(context.getApplicationContext())) {
            throw new ConnectException("No Internet Connection");
        }

//        Log.i(TAG, "App Id is: " + getApplicationKey(context));
        Utils.printLog(context, TAG, "Registration json " + gson.toJson(user));
        Utils.printLog(context, TAG, "Login url : " + getKmBaseUrl() + USER_LOGIN_API);
        String response = httpRequestUtils.postJsonToServer(getKmBaseUrl() + USER_LOGIN_API, gson.toJson(user));

        Utils.printLog(context, TAG, "Registration response is: " + response);

        if (TextUtils.isEmpty(response) || response.contains("<html")) {
            throw new Exception("503 Service Unavailable");
//            return null;
        }
        if (response.contains(INVALID_APP_ID)) {
            throw new InvalidApplicationException("Invalid Application Id");
        }
        final RegistrationResponse registrationResponse = gson.fromJson(response, RegistrationResponse.class);

        if (registrationResponse.isPasswordInvalid()) {
            throw new UnAuthoriseException("Invalid uername/password");

        }
        Utils.printLog(context, "Registration response ", "is " + registrationResponse);
        if (registrationResponse.getNotificationResponse() != null) {
            Utils.printLog(context, "Registration response ", "" + registrationResponse.getNotificationResponse());
        }
        mobiComUserPreference.setEncryptionKey(registrationResponse.getEncryptionKey());
        mobiComUserPreference.enableEncryption(user.isEnableEncryption());
        mobiComUserPreference.setCountryCode(user.getCountryCode());
        mobiComUserPreference.setUserId(user.getUserId());
        mobiComUserPreference.setContactNumber(user.getContactNumber());
        mobiComUserPreference.setEmailVerified(user.isEmailVerified());
        mobiComUserPreference.setDisplayName(user.getDisplayName());
        mobiComUserPreference.setMqttBrokerUrl(registrationResponse.getBrokerUrl());
        mobiComUserPreference.setDeviceKeyString(registrationResponse.getDeviceKey());
        mobiComUserPreference.setEmailIdValue(user.getEmail());
        mobiComUserPreference.setImageLink(user.getImageLink());
        mobiComUserPreference.setSuUserKeyString(registrationResponse.getUserKey());
        mobiComUserPreference.setLastSyncTimeForMetadataUpdate(String.valueOf(registrationResponse.getCurrentTimeStamp()));
        mobiComUserPreference.setLastSyncTime(String.valueOf(registrationResponse.getCurrentTimeStamp()));
        mobiComUserPreference.setLastSeenAtSyncTime(String.valueOf(registrationResponse.getCurrentTimeStamp()));
        mobiComUserPreference.setChannelSyncTime(String.valueOf(registrationResponse.getCurrentTimeStamp()));
        mobiComUserPreference.setUserBlockSyncTime("10000");
        mobiComUserPreference.setPassword(user.getPassword());
        mobiComUserPreference.setPricingPackage(registrationResponse.getPricingPackage());
        mobiComUserPreference.setAuthenticationType(String.valueOf(user.getAuthenticationTypeId()));
        mobiComUserPreference.setUserRoleType(user.getRoleType());
        if (user.getUserTypeId() != null) {
            mobiComUserPreference.setUserTypeId(String.valueOf(user.getUserTypeId()));
        }
        if (!TextUtils.isEmpty(user.getNotificationSoundFilePath())) {
            mobiComUserPreference.setNotificationSoundFilePath(user.getNotificationSoundFilePath());
        }
        Contact contact = new Contact();
        contact.setUserId(user.getUserId());
        contact.setFullName(registrationResponse.getDisplayName());
        contact.setImageURL(registrationResponse.getImageLink());
        contact.setContactNumber(registrationResponse.getContactNumber());
        if (user.getUserTypeId() != null) {
            contact.setUserTypeId(user.getUserTypeId());
        }
        contact.setRoleType(user.getRoleType());
        contact.setMetadata(user.getMetadata());
        contact.setStatus(registrationResponse.getStatusMessage());
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            createNotificationChannel(context);
        }
        contact.processContactNumbers(context);
        new AppContactService(context).upsert(contact);


        Intent conversationIntentService = new Intent(context, ConversationIntentService.class);
        conversationIntentService.putExtra(ConversationIntentService.SYNC, false);
        ConversationIntentService.enqueueWork(context, conversationIntentService);


        Intent mutedUserListService = new Intent(context, ConversationIntentService.class);
        mutedUserListService.putExtra(ConversationIntentService.MUTED_USER_LIST_SYNC, true);
        ConversationIntentService.enqueueWork(context, mutedUserListService);

        Intent intent = new Intent(context, ApplozicMqttIntentService.class);
        intent.putExtra(ApplozicMqttIntentService.CONNECTED_PUBLISH, true);
        ApplozicMqttIntentService.enqueueWork(context, intent);

        return registrationResponse;
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    void createNotificationChannel(Context context) {
        NotificationManager mNotificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        CharSequence name = MobiComKitConstants.PUSH_NOTIFICATION_NAME;
        ;
        int importance = NotificationManager.IMPORTANCE_HIGH;
        if (mNotificationManager.getNotificationChannel(MobiComKitConstants.AL_PUSH_NOTIFICATION) == null) {
            NotificationChannel mChannel = new NotificationChannel(MobiComKitConstants.AL_PUSH_NOTIFICATION, name, importance);
            mChannel.enableLights(true);
            mChannel.setLightColor(Color.GREEN);
            if (ApplozicClient.getInstance(context).isUnreadCountBadgeEnabled()) {
                mChannel.setShowBadge(true);
            } else {
                mChannel.setShowBadge(false);
            }
            if (ApplozicClient.getInstance(context).getVibrationOnNotification()) {
                mChannel.enableVibration(true);
                mChannel.setVibrationPattern(new long[]{100, 200, 300, 400, 500, 400, 300, 200, 400});
            }
            AudioAttributes audioAttributes = new AudioAttributes.Builder()
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .setUsage(AudioAttributes.USAGE_NOTIFICATION_RINGTONE).build();
            mChannel.setSound(RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION), audioAttributes);
            mNotificationManager.createNotificationChannel(mChannel);

        }
    }
}
