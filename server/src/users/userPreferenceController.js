const userPreferenceService = require("./userPreferenceService");
const logger = require('../utils/logger');

exports.createUserPreference = (req, res) =>{
  logger.info("request received to create user preference : ", req.body);
  return Promise.resolve(userPreferenceService.createUserPreference(req.body)).then(data => {
    logger.info("Sending response success");
    return res.status(200).json({ message: "SUCCESS" });
  }).catch(err => {
    logger.error("error while creating user preference :", err);
    return res.status(500).json({ code: "INTERNAL_SERVER_ERROR", message: "Something went wrong" });
  })
};

exports.deleteUserPreference = (req, res) =>{
  logger.info("request received to delte user preference : ", req.body);
  return Promise.resolve(userPreferenceService.deleteUserPreference(req.body)).then(data => {
    logger.info("Sending response success");
    return res.status(200).json({ message: "SUCCESS" });
  }).catch(err => {
    logger.error("error while deleting user preference :", err);
    return res.status(500).json({ code: "INTERNAL_SERVER_ERROR", message: "Something went wrong" });
  })
};

exports.updateUserPreference = (req, res) =>{
  logger.info("request received to update user preference : ", req.body);
  return Promise.resolve(userPreferenceService.updateUserPreference(req.body)).then(data => {
    logger.info("Sending response success");
    data = data ? data : [];
    return res.status(200).json({ message: "SUCCESS" });
  }).catch(err => {
    logger.error("error while creating user preference :", err);
    return res.status(500).json({ code: "INTERNAL_SERVER_ERROR", message: "Something went wrong" });
  })
};


exports.getUserPreference = (req, res) =>{
  logger.info("request received to update user preference : ", req.body);
  return Promise.resolve(userPreferenceService.getUserPreference(req.body)).then(data => {
    logger.info("Sending response success");
    data = data ? data : [];
    return res.status(200).json({ message: "SUCCESS", data:data });
  }).catch(err => {
    logger.error("error while creating user preference :", err);
    return res.status(500).json({ code: "INTERNAL_SERVER_ERROR", message: "Something went wrong" });
  })
};