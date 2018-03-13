const zendesk = require('../utils/test').zendeskConfig;
const axios =require("axios");

const createZendeskTicket = (ticket) => {
  let url = zendesk.createTicketUrl.replace('[subdomain]', 'applozic'); //replace with customer's subdomain for zendesk 
  let auth = "Basic " + new Buffer(zendesk.email + ":" + zendesk.password).toString('base64');

  return Promise.resolve(axios.post(url, ticket, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": auth
    }
  })).then(response => {
    console.log("response from zendesk", response);
    return response;
  }).catch(err => {
    console.log('error  ', err)
    throw err;
  })

}

const updateTicket = (id, ticket)=>{
  let url = zendesk.updateTicketUrl.replace('[subdomain]', 'applozic').replace('[id]', id);
  let auth = "Basic " + new Buffer(zendesk.email + ":" + zendesk.password).toString('base64');
  return Promise.resolve(axios.put(url, ticket, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": auth
    }
  })).then(response => {
    console.log("response from zendesk", response);
    return response;
  }).catch(err => {
    console.log('error  ', err)
    throw err;
  })

}

module.exports={
  createZendeskTicket:createZendeskTicket,
  updateTicket:updateTicket
}