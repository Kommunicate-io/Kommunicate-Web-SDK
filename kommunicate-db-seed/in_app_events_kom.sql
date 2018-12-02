/*
-- Query: select * from in_app_events
LIMIT 0, 1000

-- Date: 2018-08-29 16:42
*/
INSERT INTO `in_app_events` (`Id`,`name`,`description`,`category`,`created_at`,`updated_at`,`deleted_at`) VALUES (1,'KM-001','conversation started/new msg in existing conversation by anonymous user while agent is offline',1,'2018-01-02 07:44:10','2018-01-02 07:44:10',NULL);
INSERT INTO `in_app_events` (`Id`,`name`,`description`,`category`,`created_at`,`updated_at`,`deleted_at`) VALUES (2,'KM-002','conversation started/new msg in existing conversation by known user while agent is offline',1,'2018-01-02 07:44:11','2018-01-02 07:44:11',NULL);
INSERT INTO `in_app_events` (`Id`,`name`,`description`,`category`,`created_at`,`updated_at`,`deleted_at`) VALUES (3,'KM-003','conversation started by anonymous user while agent is online',1,'2018-01-02 07:44:11','2018-01-02 07:44:11',NULL);
INSERT INTO `in_app_events` (`Id`,`name`,`description`,`category`,`created_at`,`updated_at`,`deleted_at`) VALUES (4,'KM-004','conversation started by known user while agent is online',1,'2018-01-02 07:44:12','2018-01-02 07:44:12',NULL);
