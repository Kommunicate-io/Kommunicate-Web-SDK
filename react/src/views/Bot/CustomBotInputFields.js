import React, { Component } from 'react'
import styled, { withTheme } from 'styled-components'

const CustomBotInputFieldsContainer = styled.div`
    & > .input-field-title {
        font-size: 17px;
        letter-spacing: 0.3px;
        color: #616366;
        margin-top: 18.5px;
    }
    & > #input-bot-integration-webhook-url {
        width: 99%;
    }
    & > #input-bot-integration-key , #input-bot-integration-value {
        width: 41%;
    }
    & input {
        height: 40px;
        padding: 16px;
    }
    & input::placeholder  {
        font-size: 14px;
        color: #cacaca;
    }
    & label {
        font-size: 15px;
        letter-spacing: 0.3px;
        color: #616366;
        margin-right:6px;
    }
    & > .input-bot-integration-value-label {
        margin-left: 20px;
    }
`;

function CustomBotInputFields(props) {
    return (
        <CustomBotInputFieldsContainer>
            <p className="input-field-title">Webhook URL</p>
            <input type="text" id="input-bot-integration-webhook-url" placeholder="Enter webhook URL"
                onChange={props.customBotWebHookUrl}
            />
            <p className="input-field-title">Request Header (optional):</p>
            <label htmlFor="input-bot-integration-key">key</label>
            <input type="text" id="input-bot-integration-key" placeholder="Enter Header Key (optional)"
                onChange={props.customBotKey}
            />
            <label className="input-bot-integration-value-label" htmlFor="input-bot-integration-value">value</label>
            <input type="text" id="input-bot-integration-value" placeholder="Enter Header Value (optional)"
                onChange={props.customBotValue}
            />
        </CustomBotInputFieldsContainer>
    )
}
export default CustomBotInputFields
// class CustomBotInputFields extends Component {

//     constructor(props) {
//         super(props);
//         this.state = {
            

//         }
        
//     }  
//     componentDidMount() {

//     }
//     render() {
//         return (
//             <CustomBotInputFieldsContainer>
//                 <p className="input-field-title">Webhook URL</p>
//                 <input type="text" id="input-bot-integration-webhook-url" placeholder="Enter webhook URL"
//                     onChange={this.props.customBotWebHookUrl} 
//                     />
//                 <p className="input-field-title">Request Header (optional):</p>
//                 <label htmlFor="input-bot-integration-key">key</label>
//                 <input type="text" id="input-bot-integration-key" placeholder="Enter Header Key (optional)"
//                     onChange={this.props.customBotKey}
//                     />
//                 <label className="input-bot-integration-value-label" htmlFor="input-bot-integration-value">value</label>
//                 <input type="text" id="input-bot-integration-value" placeholder="Enter Header Value (optional)"
//                     onChange={this.props.customBotValue}
//                      />
//             </CustomBotInputFieldsContainer>
//         )
//     }
// }

// export default CustomBotInputFields
