alter table users add column user_key varchar(36);

alter table business_hours change `day` opening_day enum('SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THRUSDAY','FRIDAY','SATURDAY') DEFAULT NULL;

alter table business_hours add column  `closing_day`  enum('SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THRUSDAY','FRIDAY','SATURDAY') DEFAULT NULL AFTER `open_time`;


ALTER TABLE business_hours MODIFY COLUMN  `day_local_tz` enum('SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY') COLLATE utf8mb4_unicode_ci DEFAULT NULL;
ALTER TABLE business_hours MODIFY COLUMN  `opening_day` enum('SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY') COLLATE utf8mb4_unicode_ci DEFAULT NULL;
ALTER TABLE business_hours MODIFY COLUMN `closing_day` enum('SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY') COLLATE utf8mb4_unicode_ci DEFAULT NULL;

alter table customers add column role varchar(50), add column industry varchar(50), add column contact_no varchar(20);

alter table auto_suggests add user_name varchar(50);
alter table auto_suggests add application_id varchar(200);

alter table users add column role varchar(50), add column industry varchar(50), add column contact_no varchar(20), add column company_name varchar(20), add column company_size varchar(20);

alter table users add column availability_status int DEFAULT 1;

INSERT INTO in_app_events (`name`, `description`, `category`, `created_at`, `updated_at`) VALUES ('KM-001', 'conversation started/new msg in existing conversation by anonymous user while agent is offline', '1', NOW(), NOW());
INSERT INTO in_app_events (`name`, `description`, `category`, `created_at`, `updated_at`) VALUES ('KM-002', 'conversation started/new msg in existing conversation by known user while agent is offline', '1', NOW(), NOW());
INSERT INTO in_app_events (`name`, `description`, `category`, `created_at`, `updated_at`) VALUES ('KM-003', 'conversation started by anonymous user while agent is online', '1', NOW(), NOW());
INSERT INTO in_app_events (`name`, `description`, `category`, `created_at`, `updated_at`) VALUES ('KM-004', 'conversation started by known user while agent is online', '1', NOW(), NOW());
/*added column in customers, "active_campaign_id" KM-485 */
alter table customers add column active_campaign_id int
alter table in_app_msgs add column sequence int;
alter table in_app_msgs add column created_by int;

alter table in_app_msgs add column metadata json;
alter table in_app_msgs add column category int;

alter table users add column bot_availability_status int DEFAULT 1;

alter table customers add column agent_routing int default 0;

alter  table auto_suggests modify column `content` LONGTEXT;
alter  table auto_suggests modify column `name` TEXT;

alter table auto_suggests add column `status`  enum('draft', 'published') collate utf8mb4_unicode_ci default null;
alter table auto_suggests add column `type`  enum('faq', 'shortcut') collate utf8mb4_unicode_ci default null;

alter table customers add column billing_cus_id varchar(50);

alter table customers add column subscription varchar(50) NOT NULL DEFAULT 'startup';

alter table conversations add column metadata json;

alter table kommunicate_test.conversations add column close_at datetime;

alter table kommunicate_test.customers add column `login_type`  enum('email', 'oauth') collate utf8mb4_unicode_ci default null;
