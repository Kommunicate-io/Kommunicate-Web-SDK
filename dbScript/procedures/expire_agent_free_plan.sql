DELIMITER $$
DROP PROCEDURE IF EXISTS `expire_agent_in_free_plan`$$

CREATE PROCEDURE `expire_agent_in_free_plan`(IN db_schema VARCHAR(255))

BEGIN
DECLARE var_done INT;
DECLARE var_application_id VARCHAR(150);
DECLARE var_status_column_exists INT DEFAULT 0;
DECLARE var_avaibility_status_column_exists INT DEFAULT 0;
DECLARE cursor_customer CURSOR FOR SELECT a.application_id  FROM customers c JOIN applications a ON c.id = a.customer_id WHERE c.subscription = 'startup' AND c.created_at < (NOW() - INTERVAL 31 day);
DECLARE CONTINUE HANDLER FOR NOT FOUND SET var_done = 1;


-- checking if the record already exists
SET var_status_column_exists = (SELECT  COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=db_schema AND TABLE_NAME='users' AND COLUMN_NAME= 'status');
SET var_avaibility_status_column_exists = (SELECT  COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=db_schema AND TABLE_NAME='users' AND COLUMN_NAME= 'availability_status');

 
OPEN cursor_customer;
	customer_loop:loop
		FETCH cursor_customer INTO var_application_id;
		IF var_done THEN
			CLOSE cursor_customer;
			LEAVE customer_loop;
		END IF;
       -- fetching agent list for application
	    SELECT GROUP_CONCAT(`id`) FROM (SELECT id  FROM users where type =1 and application_id = var_application_id limit 100 offset 1 ) as ids INTO @var_user_id_list;
		IF @var_user_id_list IS NULL THEN 
		ITERATE customer_loop;
		ELSE
		IF var_status_column_exists = 1 THEN 
			SET @stmt = CONCAT('UPDATE users SET  `status` = 2 WHERE id IN (',@var_user_id_list,') ');
			PREPARE stmt FROM @stmt;
			EXECUTE stmt;
			DEALLOCATE PREPARE stmt;
        END IF;
        IF var_avaibility_status_column_exists= 1 THEN
			SET @stmt = CONCAT('UPDATE users SET  `availability_status` = 2 WHERE id IN (',@var_user_id_list,') ');
			PREPARE stmt FROM @stmt;
			EXECUTE stmt;
			DEALLOCATE PREPARE stmt;
        END IF;
	END IF;
	END LOOP customer_loop;

END$$ 
DELIMITER ;

--  call  expire_agent_in_free_plan('kommunicate_test');