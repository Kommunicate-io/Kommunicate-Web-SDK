
const path = require("path");

const logfilePath = path.join(__dirname,"../../logs/km-server.log");
const winston = require('winston');
const { format } = require('logform');
//winston.emitErrs = true;
const logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            //level: 'info',
            handleExceptions: true,
            json: false,
            colorize: true,
            timestamp:function () {
             
                return (new Date()).toISOString();
            }
        }),
        new winston.transports.File({
            level: 'info',
            filename: logfilePath,
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false,
            timestamp:function () {
                return (new Date()).toISOString();
            }
        })
    ],
    exitOnError: false,
    format: format.combine(
        format.splat(),
        format.simple()
      )

});

module.exports = logger;
module.exports.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};



//testing
//logger.info("this is info",{"object":"valve"},"string");
//logger.error("this is info",{"object":"valve"},"string");
//logger.debug("this is info",{"object":"valve"},"string");
