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

alter table customers add column `login_type`  enum('email', 'oauth') collate utf8mb4_unicode_ci default null;

alter table customers drop column login_type;

alter table users add column `login_type`  enum('email', 'oauth') collate utf8mb4_unicode_ci default null;

alter table conversations add application_id varchar(50) default null after id;

ALTER TABLE `conversations` CHANGE COLUMN `participent_user_id` `participant_user_id` VARCHAR(255) NOT NULL ;
/*added column in customers, "bot_routing" KM-1070 */
alter table customers add  column bot_routing tinyint(1)  default 0;

/** INSERT/MIGRATE DATA INTO APPLICATION TABLE*/
INSERT INTO applications(customer_id,application_id,created_at, updated_at) select c.id, a.application_id, c.created_at, c.updated_at from customers c join application a on c.id=a.customer_id;

alter table users add column application_id varchar(150);

/* seed application Id to user table*/
update users u join customers c on c.id= u.customer_id set u.application_id= c.application_id;

alter table users drop customer_id;

alter table customers drop application_id;

ALTER TABLE customers ADD UNIQUE INDEX `email_UNIQUE` (`email` ASC);

ALTER TABLE customers ADD UNIQUE INDEX `user_name_UNIQUE` (`user_name` ASC);

ALTER TABLE customers DROP INDEX  IDX_USER_NAME_APP_KEY;

ALTER TABLE users ADD INDEX `IDX_USER_NAME_APP_KEY` (`user_name` ASC, `application_id` ASC);

alter table in_app_msgs add column application_id varchar(50);

insert into app_settings(application_id, created_at, updated_at) select application_id, created_at, updated_at from applications;

update in_app_msgs  m join customers c on c.id= m.customer_id set m.application_id=c.application_id;

alter table in_app_msgs drop customer_id;

alter table users
add role_type tinyint(2)  default 1;

SET SQL_SAFE_UPDATES=0;
update users set role_type=0  where  type='3';
SET SQL_SAFE_UPDATES=1;


-- 23-july-2018

-- create table if not exists team_invitation(id char(36) NOT NULL ,
-- status tinyint(2),
-- invited_by varchar(50),
-- PRIMARY KEY (id)
-- );
alter table users add column email_subscription tinyint default 1;
-- modified column name availability_status to status, ticket KM-1308
alter table users change availability_status  status INTEGER;

/*KM-1319*/

alter table customers drop `password`,drop `apz_token`;
alter table users drop `authorization`, drop `apz_token`, drop 'role', drop `industry`, drop `company_name`, drop `company_size`;

/* KM-1318*/
-- script to add agent_routing and bot_routing in app_settings
ALTER TABLE app_settings
ADD agent_routing int(11);

ALTER TABLE app_settings
ADD bot_routing tinyint(1);

/*Script to migrate data from customer bot_routing and agent_routing to app_setting*/
update app_settings a join applications app on a.application_id=app.application_id join customers c on app.customer_id=c.id
set a.bot_routing=c.bot_routing ,a.agent_routing =c.agent_routing
where
a.application_id in (select app.application_id from applications app where app.customer_id=c.id)

-- script to drop agent_routing and bot_routing from customer table
-- data migration script must be applied before drop column
ALTER TABLE customers
DROP COLUMN agent_routing;

ALTER TABLE customers
DROP COLUMN bot_routing;

alter table applications add column status tinyint default 1;

/*
KM-1489 Chat widget color and launcher icon setting
When executed this script will add widget_theme column in app_setings table (kommunicate_test DB) with data-type JSON.
*/
ALTER TABLE `app_settings` ADD COLUMN `widget_theme` JSON

/*
KM-1503 :Collect email in welcome message
*/
alter table app_settings add  column collect_email_welcome tinyint(1)  default 0;
alter table app_settings change collect_email collect_email_away tinyint(1);


--------------------------- Launch 2.2 - Reduce Friction--------------------------

    -- KM-1642: Bot to stop reply once its assigned to agent.

ALTER TABLE app_settings ADD COLUMN `remove_bot_on_agent_handoff` TINYINT(1) DEFAULT 0 COMMENT 'if enabled, all bots will be removed from conversation when conversation assigned to agent';


--------------------------- Release-3.1 ------------------------

   -- KM-1655: Setting up default agent

alter table app_settings add  column default_conversation_assignee JSON NULL DEFAULT NULL;
ALTER TABLE app_settings CHANGE COLUMN agent_routing `agent_routing` INT(11) NULL DEFAULT 0 ;

--------------------------- Release-3.3 ------------------------
alter table app_settings add  column conversation_close_time INTEGER DEFAULT 0;

ALTER TABLE `users`
ADD INDEX `applicationId_type_deletedAt_idx` (`application_id` ASC, `type` ASC, `deleted_at` DESC);

ALTER TABLE `app_settings`
ADD INDEX `applicationId_deletedAt_idx` (`application_id` ASC, `deleted_at` DESC);

ALTER TABLE `applications`
ADD INDEX `application_id_idx` (`application_id`);

--------------------------- Release-3.4 ------------------------


ALTER TABLE app_settings ADD COLUMN domain_url VARCHAR(255) DEFAULT Null;



--------------------------- Release-3.5 ------------------------


CREATE TABLE user_preferences (
    id INTEGER NOT NULL AUTO_INCREMENT,
    user_id INTEGER NOT NULL,
    preference_id INTEGER NOT NULL,
    value VARCHAR(200) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    PRIMARY KEY(id),
    FOREIGN KEY(preference_id) REFERENCES preference(id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE user_preferences ADD UNIQUE INDEX(user_id, preference_id);

CREATE TABLE preference (
    id INTEGER NOT NULL  AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL UNIQUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    PRIMARY KEY(id)
);


ALTER TABLE app_settings ADD COLUMN popup_template_key TINYINT DEFAULT NULL;

CREATE TABLE chat_popup_messages (
    id INTEGER NOT NULL AUTO_INCREMENT,
    app_setting_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    url VARCHAR(300) NOT NULL,
    delay INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY(id),
    UNIQUE KEY(app_setting_id, url)
);
-- script to add UNIQUE constraint for application_id

ALTER TABLE app_settings
ADD UNIQUE (application_id);

-- script to add loadInitialStateConversation column
ALTER TABLE app_settings
ADD load_initial_state_conversation tinyint(1) default 0;

-- 5 march 2019 --
ALTER TABLE `app_settings` ADD COLUMN `help_center` JSON

ALTER TABLE `app_settings` ADD COLUMN `support_mails` JSON

-- 10 march 2019 --

ALTER TABLE `app_settings`
ADD COLUMN `lead_collection` JSON,
ADD COLUMN `lead_type` INTEGER,
ADD COLUMN `collect_lead` BOOLEAN DEFAULT 0;

-- script to migrate data from collect_email_welcome  and collect_email_away to lead_collection --
UPDATE app_settings
SET lead_type = (
    case when collect_email_welcome = 1 then 0 when collect_email_away = 1 then 1 end)


UPDATE app_settings
SET collect_lead = 1 where collect_email_welcome = 1  and collect_email_away = 1;


-- 22 march 2019
ALTER TABLE `app_settings` ADD COLUMN `collect_feedback` BOOLEAN DEFAULT 0;

-- 28 March 2019 --

ALTER TABLE `in_app_msgs`
ADD COLUMN `language_code` char(5);

ALTER TABLE app_subscriptions MODIFY COLUMN trigger_url  VARCHAR(250) NOT null;

---------------------------Release- 4.2 ------------------------
-- KM-1790:Implementation - onboarding flow for Kommunicate --

CREATE TABLE IF NOT EXISTS onboarding (
    id INT(11) NOT NULL AUTO_INCREMENT,
    application_id VARCHAR(150) NOT NULL,
	step_id INTEGER DEFAULT NULL,
	completed BOOLEAN DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    PRIMARY KEY(id)
);


db.getCollection('knowledgebase_copy').update({id:{ $gt: 0 }},{$set:{"categoryType" : 0}},{multi:true ,upsert:false})

db.getCollection('counter').insert({"_id" : "faqCategory_type",  "sequence_value" : 1})


-- KM-2171 : For multiple applications - check for password in the first step --
CREATE TABLE IF NOT EXISTS authentication (
    id INT(11) NOT NULL AUTO_INCREMENT,
	user_name VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL, 
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    PRIMARY KEY(id)
); 
ALTER TABLE users ADD COLUMN authentication_id int(11) not null;


-- -------- May 6, 2019 ------------
alter table app_settings add column transcript tinyint(1) default 0;
ALTER TABLE third_party_settings ADD COLUMN automatic_forward_to_thirdparty BOOLEAN ;

