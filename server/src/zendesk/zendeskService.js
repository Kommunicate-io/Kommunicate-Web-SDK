const zendesk = require('../../conf/config').getCommonProperties().zendesk;
const axios = require("axios");

const createZendeskTicket = (ticket, settings) => {
  let url = zendesk.createTicketUrl.replace('[subdomain]', settings.domain);  
  let auth = "Basic " + new Buffer(settings.accessKey + "/token:" + settings.accessToken).toString('base64');

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

const updateTicket = (id, ticket, settings) => {
  let url = zendesk.updateTicketUrl.replace('[subdomain]', settings.domain).replace('[id]', id);
  let auth = "Basic " + new Buffer(settings.accessKey + "/token:" + settings.accessToken).toString('base64');
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

module.exports = {
  createZendeskTicket: createZendeskTicket,
  updateTicket: updateTicket
}