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
