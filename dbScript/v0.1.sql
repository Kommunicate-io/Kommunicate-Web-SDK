alter table users add column user_key varchar(36);

alter table business_hours change `day` opening_day enum('SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THRUSDAY','FRIDAY','SATURDAY') DEFAULT NULL;

alter table business_hours add column  `closing_day`  enum('SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THRUSDAY','FRIDAY','SATURDAY') DEFAULT NULL AFTER `open_time`;


ALTER TABLE business_hours MODIFY COLUMN  `day_local_tz` enum('SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY') COLLATE utf8mb4_unicode_ci DEFAULT NULL;
ALTER TABLE business_hours MODIFY COLUMN  `opening_day` enum('SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY') COLLATE utf8mb4_unicode_ci DEFAULT NULL;
ALTER TABLE business_hours MODIFY COLUMN `closing_day` enum('SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY') COLLATE utf8mb4_unicode_ci DEFAULT NULL;

alter table customers add column role varchar(50), add column industry varchar(50), add column contact_no varchar(20);

INSERT INTO auto_suggests (`category`, `name`, `content`) VALUES ('android', 'Github', 'https://github.com/Applozic/Applozic-Android-SDK');
INSERT INTO auto_suggests (`category`, `name`, `content`) VALUES ('android', 'Push Notification', 'https://www.applozic.com/docs/android-chat-sdk.html#step-4-push-notification-setup');
INSERT INTO auto_suggests (`category`, `name`, `content`) VALUES ('ios', 'Github', 'https://github.com/Applozic/Applozic-iOS-SDK/');
INSERT INTO auto_suggests (`category`, `name`, `content`) VALUES ('ios', 'Objective-C', 'https://www.applozic.com/docs/ios-chat-sdk.html#objective-c');
INSERT INTO auto_suggests (`category`, `name`, `content`) VALUES ('ios', 'Swift', 'https://www.applozic.com/docs/ios-chat-sdk.html#swift');
INSERT INTO auto_suggests (`category`, `name`, `content`) VALUES ('ios', 'Push Notification', 'https://www.applozic.com/docs/android-chat-sdk.html#step-4-push-notification-setup');
INSERT INTO auto_suggests (`category`, `name`, `content`) VALUES ('web', 'Github', 'https://github.com/Applozic/Applozic-Web-Plugin/');
INSERT INTO auto_suggests (`category`, `name`, `content`) VALUES ('web', 'Sidebox Layout Plugin', 'https://www.applozic.com/docs/web-chat-plugin.html#sidebox-layout');
INSERT INTO auto_suggests (`category`, `name`, `content`) VALUES ('web', 'Full Layout Plugin', 'https://www.applozic.com/docs/web-chat-plugin.html#full-view-layout');
INSERT INTO auto_suggests (`category`, `name`, `content`) VALUES ('price', 'Its free only for development and testing', 'Let me forward your request to the tech team');
INSERT INTO auto_suggests (`category`, `name`, `content`) VALUES ('price', 'Link', 'https://www.applozic.com/price.html');
INSERT INTO auto_suggests (`category`, `name`, `content`) VALUES ('greetings', 'Unknown User', 'Hi, may I know your name and company');
INSERT INTO auto_suggests (`category`, `name`, `content`) VALUES ('greetings', 'Unknown User', 'May I know your company name');
INSERT INTO auto_suggests (`category`, `name`, `content`) VALUES ('docs', 'Android Docs', 'https://www.applozic.com/docs/android-chat-sdk.html#overview');
INSERT INTO auto_suggests (`category`, `name`, `content`) VALUES ('docs', 'iOS Docs', 'https://www.applozic.com/docs/ios-chat-sdk.html#overview');
INSERT INTO auto_suggests (`category`, `name`, `content`) VALUES ('docs', 'Web Docs', 'https://www.applozic.com/docs/web-chat-plugin.html#overview');
INSERT INTO auto_suggests (`category`, `name`, `content`) VALUES ('docs', 'PhoneGap Docs', 'https://www.applozic.com/docs/phonegap-chat-plugin.html');
INSERT INTO auto_suggests (`category`, `name`, `content`) VALUES ('docs', 'Platform APIs', 'https://www.applozic.com/docs/platform-api-chat.html');
INSERT INTO auto_suggests (`category`, `name`, `content`) VALUES ('docs', 'Configuration', 'https://www.applozic.com/docs/configuration.html');
INSERT INTO auto_suggests (`category`, `name`, `content`) VALUES ('check', 'Tech team', 'Let me check with the tech team');
INSERT INTO auto_suggests (`category`, `name`, `content`) VALUES ('check', 'Forward request', 'Let me forward your request to the tech team');
