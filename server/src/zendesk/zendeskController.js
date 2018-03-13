const zendeskService = require('./zendeskService');



exports.createZendeskTicket = (req, res) =>{
    let ticket= req.body;
    zendeskService.createZendeskTicket(ticket).then(response=>{
        console.log("response from zendesk", response);
        res.status(200).json({code:"SUCCESS",data:response.data});
    }).catch(err=>{
        console.log('error while creating ticket', err);
        res.status(500).json({code:"ERROR",message:"ticket creation error"});
    })

}

exports.updateZendeskTicket = (req, res) => {
    let id = req.params.id;
    let ticket = req.body;
    zendeskService.updateTicket(id, ticket).then(response => {
        console.log("response from zendesk", response);
        if (response.statusText && response.statusText == "OK") {
            res.status(200).json({ code: "SUCCESS", data: response.data });
        } else {
            res.status(response.status).json({ code: "ERROR", message: response })
        }

    }).catch(err => {
        console.log('error while updating ticket', err);
        res.status(err.response.status).json({ code: "ERROR", message: err.message });
    })

}