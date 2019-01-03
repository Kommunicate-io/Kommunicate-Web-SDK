const agileService= require('../agileCrm/agileService');
const applozicClient = require('../utils/applozicClient');
const logger = require('../utils/logger');
const USER_CONSTANTS = require("../users/constants.js");

const userService = require("../users/userService");
const integryService = require("../thirdpartyintegrations/integry/integryService");


/* eslint-disable */
exports.processUserCreatedEvent=(user)=>{
    logger.info('processing user created event', user);
    
        if(user.roleName != USER_CONSTANTS.APPLOZIC_USER_ROLE_TYPE.USER.name){
                logger.info('user identified as agent or bot. skipping record..'); 
                return;
        }
        return Promise.all([processUserCreatedEventInKommunicate(user)
        .catch(e=>{
            logger.error("error while processing user event in kommunicate");
        }),integryService.sendUserEventToIntegry("USER_CREATED",user)
        .catch(e=>{
            logger.error("error while craeting user in Integry",e);
        })
        ]).then(([kmResult,IntegryResult])=>{
            logger.info("user created event processed successfully");
        }).catch(e=>{
            logger.error("error while processing user event",e);
        })
    }

    const  processUserCreatedEventInKommunicate = (user)=>{
        return agileService.createContact(null, user).then(data=>{
            if(!data){
                logger.info(" customer not integrated with agile crm, skipping");
                return;
            }
             let userToBeUpdated = {
                 userId :user.userId,
                 metadata:{"KM_AGILE_CRM":JSON.stringify({"contactId": data.id,"hidden":true})}
             } 
            return applozicClient.updateApplozicClient("bot","bot", user.applicationId, userToBeUpdated,null,true).then(data=>{
                 logger.info("agile crm id is updated into user metadata");
             })
         }).catch(e=>{
             logger.error("error whle creating contact in agilecrm", e);
         })
    }

exports.processUserUpdatedEvent= (user)=>{
    logger.info("processing user updated event.....",user);
   let agileCrm = user.metadata && user.metadata.KM_AGILE_CRM && JSON.parse(user.metadata.KM_AGILE_CRM);
    if(user.roleName != USER_CONSTANTS.APPLOZIC_USER_ROLE_TYPE.USER.name){
        logger.info('user identified as agent or bot. skipping record..'); 
        return;
    }

        let contactId =  agileCrm && agileCrm.contactId;
    if(contactId && user.applicationId){
        logger.info("updating agilecrmId ",contactId);
        user.metadata.KM_AGILE_CRM = agileCrm;
        agileService.updateContact(null,contactId, user).then(data=>{
            if(!data){
                logger.info(" customer not integrated with agile crm, skipping update user event...");
            }
            logger.info("updated successfully");

        }).catch(e=>{
            logger.error("error while updating contact id", contactId);           
        })
        integryService.sendUserEventToIntegry("USER_UPDATED",user)
    }else{
        logger.info("adding contact in agilecrm");
        processUserCreatedEventInKommunicate(user);
        integryService.sendUserEventToIntegry("USER_CREATED",user)
    }
}
