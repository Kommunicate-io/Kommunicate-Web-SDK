/*eslint-disable*/
const userEventProcessor = require('./userEventProcessor');
const config = require('../../conf');
const logger = require('../utils/logger');

const amqp = require('amqplib');
let amqpConn = null;
const amqpProperties = {
    protocol: 'amqp',
    hostname: config.rabbitmq.host,
    username: config.rabbitmq.userName,
    password: config.rabbitmq.password,
    heartbeat: '40',

};

const initializeEventsConsumers = function() {
    amqp.connect(amqpProperties).then((conn) => {
        logger.info('[AMQP] connection initilized...');
       
        conn.on('error', function(e) {
            logger.error('[AMQP] error in connection', e);
        });
        conn.on('close', function(e) {
            logger.error('[AMQP] connection closed: ', e);
            logger.info('[AMQP] Tryig to reconnect to rabbitmq...');
            setTimeout(initializeEventsConsumers, 30000); // reconnect after 30 minute
        });
        /** *
         * get the number of registered events,
         * create a channel for each event and register a consumer for each event
         */
        amqpConn = conn;
        Object.keys(registeredEvents).map((event, index) => {
            registerConsumerForEvent(event);
        });
    }).catch((e) => {
        logger.error('[AMQP] error while connecting with rabbitmq ', e);
        logger.info('[AMQP] reconecting....');
       if (!amqpConn){
        setTimeout(initializeEventsConsumers,30000); // reconnect after 30 sec
       }
    });
};


const registerConsumerForEvent = (event) => {
    logger.info('[AMQP] creating consumer for event', event);
    amqpConn.createChannel().then((channel) => {
        let queue = registeredEvents[event].queueName;
        channel.on('error', function(err) {
            logger.error('[AMQP] channel error', err);
        });
        channel.on('close', function() {
            logger.info('[AMQP] channel closed');
        });
        channel.assertQueue(queue).then(ok=>{
            logger.info('[AMQP] queue aserted', ok);
            channel.consume(queue, processMessage, {
                noAck: false,
            });
            logger.info('[AMQP] Consumer started..',event);
        }).catch(err=>{
            // close connection on error
            closeOnError(err);
        });

        function processMessage(msg) {
            if (msg && msg.content) {
                logger.info('msg received in queue ', queue);
                try {
                    let data = Buffer.from(msg.content).toString();
                    data = JSON.parse(data);
                    Promise.resolve().then(registeredEvents[event].handler(data)).catch((e) => {
                        logger.info(' error while processing event', e);
                    });
                } catch (e) {
                    logger.info(' data is received as string, skipping.......', e);
                }
            }
            // send acknowledgemwnt
            channel.ack(msg);
        }
    }).catch((err) => {
        logger.error('[AMQP] error while creating a channel  ', err);
        closeOnError(err);
    });
};

const closeOnError=(err)=>{
    if (!err) return false;
    amqpConn&& amqpConn.close();
    logger.info('[AMQP] closing connection due to error', err);
    return true;
}

const registeredEvents = {
    // mapping for event_type and handler for it.
    'user_created': {
        queueName: 'integrations.contact.created',
        handler: userEventProcessor.processUserCreatedEvent,
    },
    'user_updated': {
        queueName: 'integrations.contact.updated',
        handler: userEventProcessor.processUserUpdatedEvent,
    },
};
exports.initializeEventsConsumers = initializeEventsConsumers;
