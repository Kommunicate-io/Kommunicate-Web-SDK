/**
 * Use this file as a standalone program to publish data to rabbitmq.  
 * do not use this file in project.
 */

const amqp = require('amqplib');
let amqpConn = null;


let queue = "integrations.contact.created";
let counter  =0;
let NUMBER_OF_ATTEMPTS = 1;
let MESSAGE_PER_ATTEMPT = 10
const amqpProperties = {
    protocol: 'amqp',
    "host":"localhost",
    "username":"test",
    "password":"test",
    heartbeat: '40',

};

// uncomment this to publish data in test.

// const amqpProperties = {
//     protocol: 'amqp',
//     "hostname":"apps-test.applozic.com",
//     "username":"applozic",
//     "password":"@ppl0zic",
//     heartbeat: '40',

// };

    
amqp.connect(amqpProperties).then((conn) => {
    console.info('[AMQP] connection initilized...');
   
    conn.on('error', function(e) {
        console.error('[AMQP] error in connection', e);
    });
    conn.on('close', function(e) {
        console.error('[AMQP] connection closed: ', e);
        console.info('[AMQP] Tryig to reconnect to rabbitmq...');
       // setTimeout(initializeEventsConsumers, 30000); // reconnect after 30 sec.
    });
    /** *
     * get the number of registered events,
     * create a channel for each event and register a consumer for each event
     */
    amqpConn = conn;
    
        registerConsumerForEvent();
    });


    const registerConsumerForEvent = (event) => {
        console.info('[AMQP] creating consumer for event', event);
        amqpConn.createChannel().then((channel) => {
           
            channel.on('error', function(err) {
                console.error('[AMQP] channel error', err);
            });
            channel.on('close', function() {
                console.info('[AMQP] channel closed');
            });
            channel.assertQueue(queue).then(ok=>{
                console.info('[AMQP] queue aserted', ok);
                setInterval(function(){publish(channel)},3000);
                //publish(channel)

               
            }).catch(err=>{
                // close connection on error
                closeOnError(err);
            });
        }).catch((err) => {
            console.error('[AMQP] error while creating a channel  ', err);
            closeOnError(err);
        });
    };
    
    const closeOnError=(err)=>{
        if (!err) return false;
        amqpConn&& amqpConn.close();
        console.info('[AMQP] closing connection due to error', err);
        return true;
    }

    let publish = (channel)=>{
        counter=0;
       //while (true){
           while (counter<MESSAGE_PER_ATTEMPT){
            counter++;
            let data  = getUserData(); 
            console.log("## user published", data);
            channel.sendToQueue(queue, Buffer.from(data));
            
        }
        NUMBER_OF_ATTEMPTS ++;
    }
    const getUserData= ()=>{
        let data ={}
        data.userId = "user--"+counter;
        data.name = new Date().getTime();
        data.address =  "weougweitufwoefuwfwxer";
        data.temp ="djhksfgsuyfgryufgeruog";
        data.roleName = "USER";
        data.applicationId = "1de42a6e4a0caadad66e22f694e693750";
        data.displayName = "Rabbit"
        return JSON.stringify(data);
    }