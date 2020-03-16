const express = require("express");
const bodyParser = require("body-parser");

const port = process.argv[2];
const app = express();

app.use(bodyParser.json());
app.listen(port, function(){
    console.log("The server is running on port: " +  port);
});

app.post("/",(req,res) => {
    console.log(req.body); //request body contains the user message and other data from Kommunicate. More here : https://docs.kommunicate.io/docs/bot-custom-integration#integrating-with-custom-bot-platform

    //the response to be sent back to Kommunicate 
    //you can create this response dynamically using data from your db / custom-bot / etc..
    //please note the format of the response. You can find more info about the format here: https://docs.kommunicate.io/docs/bot-custom-integration
    let botResponse = [{
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
    res.status(200).send(botResponse);
})


