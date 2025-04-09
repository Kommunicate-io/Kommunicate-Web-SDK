exports.handler = async (event) => {
    const response = {
        sessionAttributes: event.sessionAttributes,
        dialogAction: {
            type: 'Close',
            fulfillmentState: 'Fulfilled',
            message: {
                contentType: 'CustomPayload',
                content: JSON.stringify(getFormResponse()),
            },
        },
    };
    console.log('Sending response: ', response);
    return response;
};

const getFormResponse = () => {
    return {
        message: 'Form',
        platform: 'kommunicate',
        metadata: {
            contentType: '300',
            templateId: '12',
            payload: [
                {
                    type: 'text',
                    data: {
                        label: 'Name',
                        placeholder: 'Enter your name',
                        validation: {
                            regex: '[A-Za-z0-9]',
                            errorText: 'Field is mandatory',
                        },
                    },
                },
                {
                    type: 'text',
                    data: {
                        label: 'Email New 3',
                        placeholder: 'Enter your email',
                        validation: {
                            regex:
                                '^(([^<>()\\[\\]\\.;:\\s@"]+(\\.[^<>()[\\]\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$',
                            errorText: 'Invalid Email',
                        },
                    },
                },
                {
                    type: 'submit',
                    data: {
                        action: {
                            message: 'Form was submitted successfully!',
                            requestType: 'json',
                            formAction: '<URL>',
                        },
                        type: 'submit',
                        name: 'Submit',
                    },
                },
            ],
        },
    };
};
