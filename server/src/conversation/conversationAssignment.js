const db = require("../models");
const { CONVERSATION_STATUS, CONVERSATION_STATUS_ARRAY, GROUP_INFO } = require('./conversationUtils');
const applozicClient = require("../utils/applozicClient");
const userService = require("../users/userService");
const registrationService = require("../register/registrationService");
const customerService = require('../customer/customerService');
const config = require('../../conf/config.js')
const logger = require('../utils/logger');
const Sequelize = require("sequelize");

/***
 * converation assignment
 */

 const conversationAssignment = () => {

 }