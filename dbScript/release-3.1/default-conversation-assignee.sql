-- KM-1655 Setting up default agent
DELIMITER $$
DROP PROCEDURE IF EXISTS `seed_default_assignee_in_app_setting`$$

CREATE PROCEDURE `seed_default_assignee_in_app_setting`(IN db_schema VARCHAR(255))

BEGIN
DECLARE var_done INT;
DECLARE var_application_id VARCHAR(150);
DECLARE var_con_assignee_column_exists INT DEFAULT 0;
DECLARE var_user_name VARCHAR(255);

DECLARE cursor_user_detail CURSOR FOR SELECT  application_id, user_name FROM users  WHERE `type`=3 AND  deleted_at IS NULL AND application_id IS NOT NULL;

DECLARE CONTINUE HANDLER FOR NOT FOUND SET var_done = 1;

SET var_con_assignee_column_exists = (SELECT  COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=db_schema AND TABLE_NAME='app_settings' AND COLUMN_NAME= 'default_conversation_assignee');
 
OPEN cursor_user_detail;
	cusor_user_loop:LOOP
		FETCH cursor_user_detail INTO var_application_id, var_user_name;
		IF var_done THEN
			CLOSE cursor_user_detail;
			LEAVE cusor_user_loop;
		END IF;
        
	IF var_con_assignee_column_exists = 1 THEN 
		SET @stmt =  (CONCAT('UPDATE `app_settings` SET `default_conversation_assignee`=\'{\"0\": \"', var_user_name,'\", \"1\": \"',var_user_name,'\"}\' WHERE application_id ="',var_application_id,'"'));
        PREPARE stmt FROM @stmt;
			EXECUTE stmt;
			DEALLOCATE PREPARE stmt;
        END IF;
	END LOOP cusor_user_loop;

END$$ 
DELIMITER ;
-- for prod change "kommunicate-test" to "kommunicate"
call  seed_default_assignee_in_app_setting('kommunicate_test');