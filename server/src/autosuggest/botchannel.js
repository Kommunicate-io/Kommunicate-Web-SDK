const  axios = require('axios');
const request = require('request');
const customerservice = require('../customer/customerService');

exports.insertFaq = (data) =>
{
  var customer = customerservice.getCustomerById(data['applicationId'])
  var appkey = customer.companyName
  console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" + appkey)
  data['applicationKey'] ='kommunicate-support'
  /*
  return promise.resolve(axios.post('https://localhost:5001/faqdata', data)).then(
    console.log("HYPERTEST:" + "")
  )
  .catch(err => err);
*/

request.post(
    'http://localhost:5001/faqdata',
    { json:data },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body)
        }
    }
);
}
