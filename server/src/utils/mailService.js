const nodemailer = require("nodemailer");
const emailConfig = require("../../conf/emailConfig");
const fileService = require("../utils/fileService");
const config = require("../../conf/config");
const kommunicateLogoUrl =config.getProperties().urls.hostUrl+"/img/logo1.png";
const facebookLogoUrl = config.getProperties().urls.hostUrl+"/img/facebook-round32.png";
const twitterLogourl = config.getProperties().urls.hostUrl + "/img/twitter-round32.png";
const kmWebsiteLogoUrl = config.getProperties().urls.kmWebsiteUrl+"/assets/resources/images/km-logo-new.png";
const kmWebsiteLogoIconUrl = config.getProperties().urls.kmWebsiteUrl+"/assets/resources/images/km-logo-icon.png";
const path = require("path");
    
function getNodeMailer(product){
    return nodemailer.createTransport({
        host: emailConfig.getProperties().hostUrl,
        port: emailConfig.getProperties().port,
        secure: false, // true for 465, false for other ports
        auth: {
            user: emailConfig.getProperties().auth[product].userName, // generated ethereal user
            pass: emailConfig.getProperties().auth[product].password  // generated ethereal password
        }
    });
}

let mailTransporter = {
    applozic: getNodeMailer('applozic'),
    kommunicate: getNodeMailer('kommunicate'),
    null: getNodeMailer('kommunicate'), 
    getTransporter: function(product) {
        return this[product || "kommunicate"];
    }
};

exports.sendPasswordResetMail = (mailOptions)=>{
  console.log("sending mail to user", mailOptions.to);
  /*let mailOptions = {
        from: '"Suraj" <srjkhanduri@gmail.com>', // sender address
        to: 'suraj@applozic.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'hey there', // plain text body
        html: '<b>Hello world?</b>' // html body
    };*/
    return new Promise(function(resolve, reject){
        mailTransporter.getTransporter(mailOptions.product).sendMail(mailOptions, (error, info) => {
            if (error) {
                return reject(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            return resolve({code:"SUCCESS"});
        });
    });
   
}

exports.sendMail= (options)=>{
    let template="";
    options.templateReplacement = options.templateReplacement || {};

    //Todo: set this according to product
    options.templateReplacement[":KommunicateLogoUrl"] = kommunicateLogoUrl;
    options.templateReplacement[":facebookLogoUrl"] = facebookLogoUrl;
    options.templateReplacement[":twitterLogourl"] = twitterLogourl;
    options.templateReplacement[":kmWebsiteLogoUrl"] = kmWebsiteLogoUrl;
    options.templateReplacement[":kmWebsiteLogoIconUrl"] = kmWebsiteLogoIconUrl;

    return fileService.readFile(options.templatePath,"utf8").then(rawTemplate=>{
        if(options.templateReplacement){
            template= rawTemplate.replace(new RegExp(Object.keys(options.templateReplacement).join("|"),"gi"),function(matched){
            console.log("matched: ",matched, "replaced with: ",options.templateReplacement[matched]);
            return options.templateReplacement[matched];
          });
        }else{
            template = rawTemplate;
        }
        return new Promise(function(resolve, reject){
            const mailOptions = {
                                    to:options.to,
                                    cc:options.cc,
                                    bcc:options.bcc,
                                    from:options.from,
                                    subject:options.subject,
                                    product: options.product
                                };
            if (options.sendAsText) {
                mailOptions.text = template
            } else {
                mailOptions.html = template
            }
          
            mailTransporter.getTransporter(options.product).sendMail(mailOptions, (error, info) => {
                if (error) {
                    return reject(error);
                }
                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        
                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                return resolve({code:"SUCCESS"});
            });
        });
    })

}

const generateHTMLTemplate = (options) => {
    let template = "";
    return fileService.readFile(options.templatePath, "utf8").then(rawTemplate => {
        if (options.templateReplacement) {
            template = rawTemplate.replace(new RegExp(Object.keys(options.templateReplacement).join("|"), "gi"), function (matched) {
                console.log("matched: ", matched, "replaced with: ", options.templateReplacement[matched]);
                return options.templateReplacement[matched];
            });
        }
        return template;
    });
}
exports.generateHTMLTemplate = generateHTMLTemplate;



/*let mailOptions = {
  to:"srjkhanduri@gmail.com",
  from:"Devashish From Kommunicate <support@kommunicate.io>",
  subject:"Welcome to Kommunicate!",
  templatePath: path.join(__dirname,"../mail/welcomeMailTemplate.html")
}
sendMail(mailOptions);*/