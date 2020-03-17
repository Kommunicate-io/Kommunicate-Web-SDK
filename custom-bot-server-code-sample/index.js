const express = require("express");
const bodyParser = require("body-parser");

const port = process.argv[2];
const app = express();

app.use(bodyParser.json());
app.listen(port, function(){
    console.log("The server is running on port: " +  port);
});

app.post("/",(req,res) => {
    //You can get user’s query from the request object and send it to your bot for further processing. 
    //When you get the response send it back to Kommunicate in response object. the request timeout is 30 sec.
    console.log(req.body); 

    //you can create the response dynamically using data from your db / custom-bot / etc..
    //please note the format of the response. You can find more info about the format here: https://docs.kommunicate.io/docs/bot-custom-integration
    let response = [{
        "message": "A message can be simple as a plain text" 
    }, {
        "message": "A message can be a rich message containing metadata",
        "metadata": {
        "contentType": "300",
            "templateId": "6",
            "payload": [{
                "title": "Suggested Reply button 1",
                "message": "Suggested Reply button 1",
            }, {
                "title": "Suggested Reply button 2",
                "message": "Suggested Reply button 2" 
            }]
        }
    }];
    res.status(200).send(response);
})


