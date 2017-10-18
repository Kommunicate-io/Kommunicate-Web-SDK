alter table users add column user_key varchar(36);

alter table business_hours change `day` opening_day enum('SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THRUSDAY','FRIDAY','SATURDAY') DEFAULT NULL;

alter table business_hours add column  `closing_day`  enum('SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THRUSDAY','FRIDAY','SATURDAY') DEFAULT NULL AFTER `open_time`;


ALTER TABLE business_hours MODIFY COLUMN  `day_local_tz` enum('SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY') COLLATE utf8mb4_unicode_ci DEFAULT NULL;
ALTER TABLE business_hours MODIFY COLUMN  `opening_day` enum('SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY') COLLATE utf8mb4_unicode_ci DEFAULT NULL;
ALTER TABLE business_hours MODIFY COLUMN `closing_day` enum('SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY') COLLATE utf8mb4_unicode_ci DEFAULT NULL;

alter table customers add column role varchar(50), add column industry varchar(50), add column contact_no varchar(20);

INSERT INTO auto_suggests (`category`, `name`, `content`) VALUES ('android', 'Github', 'https://github.com/Applozic/Applozic-Android-SDK');
INSERT INTO auto_suggests (`category`, `name`, `content`) VALUES ('android', 'Push Notification', 'https://www.applozic.com/docs/android-chat-sdk.html#step-4-push-notification-setup');
INSERT INTO auto_suggests (`category`, `name`, `content`) VALUES ('ios', 'Github', 'Let me forward your request to the tech team');
INSERT INTO auto_suggests (`category`, `name`, `content`) VALUES ('ios', 'Objective-C', 'Let me forward your request to the tech team');
INSERT INTO auto_suggests (`category`, `name`, `content`) VALUES ('ios', 'Swift', 'Let me forward your request to the tech team');
INSERT INTO auto_suggests (`category`, `name`, `content`) VALUES ('ios', 'Push Notification', 'Let me forward your request to the tech team');
INSERT INTO auto_suggests (`category`, `name`, `content`) VALUES ('web', 'Github', 'Let me forward your request to the tech team');
INSERT INTO auto_suggests (`category`, `name`, `content`) VALUES ('web', 'Sidebox Layout Plugin', 'Let me forward your request to the tech team');
INSERT INTO auto_suggests (`category`, `name`, `content`) VALUES ('web', 'Full Layout plugin', 'Let me forward your request to the tech team');
INSERT INTO auto_suggests (`category`, `name`, `content`) VALUES ('price', 'Its free only for development and testing', 'Let me forward your request to the tech team');
INSERT INTO auto_suggests (`category`, `name`, `content`) VALUES ('price', 'Link', 'Let me forward your request to the tech team');
INSERT INTO auto_suggests (`category`, `name`, `content`) VALUES ('greetings', 'Unknown User', 'Let me forward your request to the tech team');
INSERT INTO auto_suggests (`category`, `name`, `content`) VALUES ('greetings', 'Unknown User', 'Let me forward your request to the tech team');
INSERT INTO auto_suggests (`category`, `name`, `content`) VALUES ('docs', 'Android Docs', 'Let me forward your request to the tech team');
INSERT INTO auto_suggests (`category`, `name`, `content`) VALUES ('docs', 'iOS Docs', 'Let me forward your request to the tech team');
INSERT INTO auto_suggests (`category`, `name`, `content`) VALUES ('docs', 'Web Docs', 'Let me forward your request to the tech team');
INSERT INTO auto_suggests (`category`, `name`, `content`) VALUES ('docs', 'PhoneGap Docs', 'Let me forward your request to the tech team');
INSERT INTO auto_suggests (`category`, `name`, `content`) VALUES ('docs', 'Platform APIs', 'Let me forward your request to the tech team');
INSERT INTO auto_suggests (`category`, `name`, `content`) VALUES ('docs', 'Configuration', 'Let me forward your request to the tech team');
INSERT INTO auto_suggests (`category`, `name`, `content`) VALUES ('check', 'Tech team', 'Let me forward your request to the tech team');
INSERT INTO auto_suggests (`category`, `name`, `content`) VALUES ('check', 'Forward request', 'Let me forward your request to the tech team');
