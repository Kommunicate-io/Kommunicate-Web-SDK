import React, { Component } from 'react'
import styled, { withTheme } from 'styled-components'
import { BotIntegrationInputFieldsContainer} from './BotStyle'
function CustomBotInputFields(props) {
    return (
        <BotIntegrationInputFieldsContainer>
            <p className="input-field-title">{props.inputFields.field1.label}:</p>
            <input type="text" id="bot-integration-input-field-1" placeholder={props.inputFields.field1.placeHolder}
                onChange={props.InputField1Value}
            />
            <p className="input-field-title">{props.inputFields.title}</p>
            <label htmlFor="bot-integration-input-field-2">{props.inputFields.field2.label}:</label>
            <input type="text" id="bot-integration-input-field-2" placeholder={props.inputFields.field2.placeHolder}
                onChange={props.InputField2Value}
            />
            <label className="bot-integration-input-field-3-label" htmlFor="bot-integration-input-field-3">{props.inputFields.field3.label}:</label>
            <input type="text" id="bot-integration-input-field-3" placeholder={props.inputFields.field3.placeHolder}
                onChange={props.InputField3Value}
            />
        </BotIntegrationInputFieldsContainer>
    )
}
export default CustomBotInputFields
