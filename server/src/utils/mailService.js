const nodemailer = require("nodemailer");
const emailConfig = require("../../conf/emailConfig");
const fileService = require("../utils/fileService");
const path = require("path");
let passwordResetMailTransporter = nodemailer.createTransport({
        host: emailConfig.getProperties().hostUrl,
        port: emailConfig.getProperties().port,
        secure: false, // true for 465, false for other ports
        auth: {
            user: emailConfig.getProperties().auth.userName, // generated ethereal user
            pass: emailConfig.getProperties().auth.password  // generated ethereal password
        }
    });

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
        passwordResetMailTransporter.sendMail(mailOptions, (error, info) => {
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
            const mailOptions = {to:options.to,
                                 cc:options.cc,
                                bcc:options.bcc,
                                from:options.from,
                                subject:options.subject,
                                html:template};
    
            passwordResetMailTransporter.sendMail(mailOptions, (error, info) => {
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




/*let mailOptions = {
  to:"srjkhanduri@gmail.com",
  from:"Devashish From Kommunicate <support@kommunicate.io>",
  subject:"Welcome to Kommunicate!",
  templatePath: path.join(__dirname,"../mail/welcomeMailTemplate.html")
}
sendMail(mailOptions);*/