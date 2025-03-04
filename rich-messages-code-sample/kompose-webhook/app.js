global['__basedir'] = __dirname;
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const cors = require('cors');

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

function startApp() {
    app.listen(port, function () {
        console.log('Express server listening on port : ' + port);
    });
}

app.post('/welcome', function (req, res) {
    console.log('Req body: ', req.body);
    const response = getWelcomeMessage(req.body);
    return res.status(200).send(response);
});

startApp();

app.use((err, req, res, next) => {
    console.log('executing error handler', err);
    return res.status(500).send(err);
});

const getWelcomeMessage = (payload) => {
    const userName = payload.metadata.KM_CHAT_CONTEXT.name || 'There';

    // if user name is coming in context, use that, else put just `There`
    const message = `Hey ${userName}, How may i help you today`;

    return [
        {
            platform: 'kommunicate',
            message: message,
            metadata: {
                contentType: '300',
                templateId: '6',
                payload: [
                    {
                        title: 'Just Browsing!',
                        message: 'Just Browsing!',
                    },
                    {
                        title: 'Book a Demo',
                        message: 'Book a Demo',
                    },
                    {
                        title: 'Talk to Human',
                        message: 'Talk to Human',
                    },
                ],
            },
        },
    ];
};

module.exports = app;
