const zendesk = require('../../conf/config').getCommonProperties().zendesk;
const axios = require("axios");
const fileService = require('../utils/fileService');
const fs = require('fs');

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
const getTicket = (id, settings) => {
  let url = zendesk.getTicketUrl.replace('[subdomain]', settings.domain).replace('[id]', id);
  let auth = "Basic " + new Buffer(settings.accessKey + "/token:" + settings.accessToken).toString('base64');
  return Promise.resolve(axios.get(url, {
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
const uploadAttachment = (id, file, settings) => {
  let url = zendesk.uploadAttachmentsUrl.replace('[subdomain]', settings.domain) + file.originalname;
  let auth = "Basic " + new Buffer(settings.accessKey + "/token:" + settings.accessToken).toString('base64');
  var fileStream = fs.createReadStream(file.path);
  fileStream.on('error', function (err) {
    logger.info('File Error', err);
  });
  return Promise.resolve(axios.post(url, fileStream, {
    headers: {
      "Content-Type": "application/binary",
      "Authorization": auth
    }
  })).then(response => {
    fileService.deleteFile(file.path);
    console.log("response from zendesk", response);
    let ticket = {
      "ticket": {
        "comment": { "body": "see attachments.", "uploads": [response.data.upload.token] }
      }
    }
    if (id && id != "") {
      return updateTicket(id, ticket, settings);
    }
    return { data: response.data.upload.token };
  }).catch(err => {
    console.log('error  ', err)
    throw err;
  })
}

module.exports = {
  createZendeskTicket: createZendeskTicket,
  updateTicket: updateTicket,
  getTicket: getTicket,
  uploadAttachment: uploadAttachment
}