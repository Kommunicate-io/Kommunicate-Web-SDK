global["__basedir"] = __dirname;
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const cors = require("cors");

app.use(cors());


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));


function startApp() {
    app.listen(port, function() {
        console.log("Express server listening on port : " + port);
    });
}

app.post('/', function (req, res) {
    const response = [{
        "message": "This message can be generated from" 
    }];
    return res.status(200).send(response);
});


startApp();


app.use((err, req, res, next) => {
    console.log("executing error handler", err);
    return res.status(500).send(err);
});

module.exports = app;