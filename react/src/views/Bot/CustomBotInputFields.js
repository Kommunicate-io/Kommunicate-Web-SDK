import React, { Component } from 'react'
import styled, { withTheme } from 'styled-components'
import { BotIntegrationInputFieldsContainer} from './BotStyle'
function CustomBotInputFields(props) {
    return (
        <BotIntegrationInputFieldsContainer>
            <p className="input-field-title">Webhook URL:</p>
            <input type="text" id="bot-integration-input-field-1" placeholder="Enter webhook URL"
                value ={props.webhookUrl}  onChange={(e) => {props.customBotIntegrationInputValue(e, "webhookUrl")}}
            />
            <p className="input-field-title">Request Header (optional):</p>
            <label htmlFor="bot-integration-input-field-2">Key:</label>
            <input type="text" id="bot-integration-input-field-2" placeholder="Enter Header Key (optional)"
                value = {props.customBotKey} onChange={(e) => {props.customBotIntegrationInputValue(e, "customBotKey")}}
            />
            <label className="bot-integration-input-field-3-label" htmlFor="bot-integration-input-field-3">Value:</label>
            <input type="text" id="bot-integration-input-field-3" placeholder="Enter Header Value (optional)"
                value ={props.customBotValue} onChange={(e) => {props.customBotIntegrationInputValue(e, "customBotValue")}}
            />
        </BotIntegrationInputFieldsContainer>
    )
}
export default CustomBotInputFields
