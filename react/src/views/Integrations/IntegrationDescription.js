import React, { Component } from 'react';
import './IntegrationDescription.css';
import DeleteIcon from '../../components/DeleteIcon/DeleteIcon';
import { createAndUpdateThirdPArtyIntegration, deleteThirdPartyByIntegrationType } from '../../utils/kommunicateClient'
import { thirdPartyList } from './ThirdPartyList'
import Notification from '../model/Notification';
import CommonUtils from '../../utils/CommonUtils';

class IntegrationDescription extends Component {

    constructor(props) {
        super(props);
        this.state = {
            accessKey: "",
            accessToken: "",
            subdoamin: "",
            email: "",
            activeModal: this.props.activeModal,
            thirdPartyList: this.props.thirdPartyList,
            helpdocsKeys: this.props.helpdocsKeys,
            zendeskKeys: this.props.zendeskKeys,
            clearbitKeys: this.props.clearbitKeys,
            agilecrmKeys: this.props.agilecrmKeys,
            deleteStatement: false
        }

    }
    componentDidMount() {
        switch (this.state.activeModal) {
            case 'helpdocs':
                this.state.helpdocsKeys &&
                this.setState({
                    accessKey: this.state.helpdocsKeys.accessKey,
                })
                break;
            case 'zendesk':
                this.state.zendeskKeys &&
                this.setState({
                    email: this.state.zendeskKeys.accessKey,
                    accessToken: this.state.zendeskKeys.accessToken,
                    subdoamin: this.state.zendeskKeys.domain
                })
                break;
            case 'clearbit':
            this.state.clearbitKeys &&    
            this.setState({
                    accessKey: this.state.clearbitKeys.accessKey,
                })
                break;
            case 'agilecrm':
            this.state.agilecrmKeys &&
                this.setState({
                    email: this.state.agilecrmKeys.accessKey,
                    accessKey: this.state.agilecrmKeys.accessToken,
                    subdoamin: this.state.agilecrmKeys.domain
                })
        }


    }
    showDeleteStatement = () => { // "You want to Delete" Statement
        switch (this.state.activeModal) {
            case 'helpdocs':
            case 'clearbit':
                if (this.state.accessKey !== "") {
                    this.setState({
                        deleteStatement: !this.state.deleteStatement
                    })
                }
                else {
                    Notification.info("Nothing to delete !")
                }

                break;
            case 'zendesk':
                if (this.state.email !== "" && this.state.accessToken !== "" && this.state.subdoamin !== "") {
                    this.setState({
                        deleteStatement: !this.state.deleteStatement
                    })
                }
                else {
                    Notification.info("Nothing to delete !")
                }
                break;
            case 'agilecrm':
                if (this.state.email !== "" && this.state.accessKey !== "" && this.state.subdoamin !== "") {
                    this.setState({
                        deleteStatement: !this.state.deleteStatement
                    })
                }
                else {
                    Notification.info("Nothing to delete !")
                }

        }

    }


    validateIntegrationInput = () => {
        switch (this.state.activeModal) {
            case 'helpdocs':
            case 'clearbit':
                if (this.state.accessKey !== "") {

                    this.createandUpdateThirdPartyIntegration();
                }
                else {
                    Notification.info("API Key is mandtory")
                }

                break;
            case 'zendesk':
                if (this.state.email !== "" && this.state.accessToken !== "" && this.state.subdoamin !== "") {

                    this.createandUpdateThirdPartyIntegration();
                }
                else {
                    Notification.info("All fields are mandatory");
                }
                break;
            case 'agilecrm':
                if (this.state.email !== "" && this.state.accessKey !== "" && this.state.subdoamin !== "") {

                    this.createandUpdateThirdPartyIntegration();
                }
                else {
                    Notification.info("All fields are mandatory")
                }

        }


    }
    createandUpdateThirdPartyIntegration = () => {
        let accessKey = (this.state.activeModal === "zendesk" || this.state.activeModal === "agilecrm") ? this.state.email : this.state.accessKey;

        switch (this.state.activeModal) {
            case 'helpdocs':
            case 'clearbit':
                var keys = {
                    "accessKey": accessKey, //API Key
                    "accessToken": "",
                    "domain": ""
                }
                break;
            case 'zendesk':
                var keys = {
                    "accessKey": accessKey,// Email
                    "accessToken": this.state.accessToken, // Access Token
                    "domain": this.state.subdoamin //SubDomain
                }
                break;
            case 'agilecrm':
                var keys = {
                    "accessKey": accessKey, // Email
                    "accessToken": this.state.accessKey, // API key
                    "domain": this.state.subdoamin // SubDomain
                }

        }

        let integrationType = thirdPartyList[this.state.activeModal].integrationType
        createAndUpdateThirdPArtyIntegration(keys, integrationType)
            .then(response => {
                // console.log(response)
                if (response.status === 200 && response.data.code === "SUCCESS") {
                    if (integrationType == 3) {
                        let userSession = CommonUtils.getUserSession();
                        userSession.clearbitKey = this.state.accessKey;
                        CommonUtils.setUserSession(userSession)
                    }
                    Notification.info(thirdPartyList[this.state.activeModal].name + " integrated Successfully")
                    this.props.handleCloseModal();
                    this.props.getThirdPartyList();

                } else {
                    Notification.info("There was a problem while integrating" + thirdPartyList[this.state.activeModal].name);
                    this.props.handleCloseModal();
                }
                return response;
            })
            .catch(err => {
                console.log(err)
            })
    }

    deleteThirdPartyValidation = () => {
        if (this.state.activeModal == 'zendesk') {
            if (this.state.email !== "" && this.state.accessToken !== "" && this.state.subdoamin !== "") {
                this.deleteThirdPartyIntegration();
            }
            else {
                this.props.handleCloseModal();
            }
        }
        else {
            if (this.state.accessKey !== "") {
                this.deleteThirdPartyIntegration();
            }
            else {
                this.props.handleCloseModal();
            }
        }


    }

    deleteThirdPartyIntegration = () => {
        let integrationType = thirdPartyList[this.state.activeModal].integrationType
        deleteThirdPartyByIntegrationType(integrationType)
            .then(response => {
                // console.log(response)
                if (response.status === 200 && response.data.code === "SUCCESS") {
                    Notification.info(thirdPartyList[this.state.activeModal].name + " integration deleted");
                    this.props.handleCloseModal();
                    this.props.getThirdPartyList();
                } else {
                    Notification.info("There was problem in deleting the " + thirdPartyList[this.state.activeModal].name + " integration");
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    render() {
        //alert(this.state.activeModal);
        return <div className="integration-description-wrapper">
            <div className="integration-title-section">
                <h4 className="integration-description-title"><span><img src={thirdPartyList[this.state.activeModal].logo} className="integration-description-logo" /></span>
                    Integrating {thirdPartyList[this.state.activeModal].name} with Kommunicate</h4>
                <div className="title-divider"></div>
            </div>    

            {/* Discount Banner */}
            {this.props.hideHelpdocsOfferBanner === true ? " " : thirdPartyList[this.state.activeModal].discountCouponBanner}

            <div className="integration-instruction-set">
                <p className="instructions-title">Instructions</p>

                {thirdPartyList[this.state.activeModal].instructions.map((item, index) => (
                    <p key={index} className="integration-instructions">{index + 1}. {item} </p>
                ))}
                <br />
                <span className="integration-api-support">Need more help? Go to
            <a target="_blank" className="integration-api-support-link" href={thirdPartyList[this.state.activeModal].docsLink}> {thirdPartyList[this.state.activeModal].name} Docs</a></span>
            </div>
            <div className="token-input-wrapper">
                {thirdPartyList[this.state.activeModal].key !== "zendesk" &&
                    <p className="token-title">API Key:
            <input data-integration-type={thirdPartyList[this.state.activeModal].key} type="text" name="integration-token" className="integration-token-input" value={this.state.accessKey}
                            onChange={(e) => {
                                let apiKey = this.state.accessKey;
                                apiKey = e.target.value;
                                this.setState({ accessKey: apiKey.trim() })
                            }} />
                    </p>
                }
                {(thirdPartyList[this.state.activeModal].key === "zendesk" || thirdPartyList[this.state.activeModal].key === "agilecrm") &&
                    <p className="token-title">Email:
            <input type="text" id="integration-token" className="zendesk-email-input" value={this.state.email}
                            onChange={(e) => {
                                let email = this.state.email;
                                email = e.target.value;
                                this.setState({ email: email.trim() })
                            }} />
                    </p>
                }
                {thirdPartyList[this.state.activeModal].key === "zendesk" &&
                    <p className="token-title">Access Token:
            <input type="text" id="integration-token" className="zendesk-access-token-input" value={this.state.accessToken}
                            onChange={(e) => {
                                let accessToken = this.state.accessToken;
                                accessToken = e.target.value;
                                this.setState({ accessToken: accessToken.trim() })
                            }} />
                    </p>
                }
                {(thirdPartyList[this.state.activeModal].key === "zendesk" || thirdPartyList[this.state.activeModal].key === "agilecrm") &&
                    <p className="token-title">Subdomain:
            <span className="zendesk-domain-https">https://</span>
                        <input type="text" id="integration-token" className="zendesk-subdoamin-input" value={this.state.subdoamin}
                            onChange={(e) => {
                                let subdomain = this.state.subdoamin;
                                subdomain = e.target.value;
                                this.setState({ subdoamin: subdomain.trim() })
                            }} />

                        <span className="zendesk-domain"> {thirdPartyList[this.state.activeModal].domain} </span>
                    </p>
                }
            </div>
            {this.state.deleteStatement == false &&
                <div className="row zendesk-integration-save-delete-wrapper">
                    <div className="integration-trash-icon"> <DeleteIcon handleOnClick={this.showDeleteStatement} /></div>
                    <div className="zendesk-integration-save-btn">
                        <button className="km-button km-button--primary save-integrate-btn" onClick={this.validateIntegrationInput}>Save and Integrate</button>
                    </div>
                </div>
            }
            {this.state.deleteStatement == true &&
                <div className="row delete-confirmation-wrapper">
                    <div className="delete-question">Do you want to delete {thirdPartyList[this.state.activeModal].name} integration ?</div>
                    <div className="yes-or-no-btn-wrapper">
                        <button className="km-button km-button--secondary delete-integration-btn" onClick={this.deleteThirdPartyValidation} >Yes, Delete</button>
                        <button className="km-button km-button--primary save-integrate-btn no-integration-btn" onClick={this.showDeleteStatement}>No</button>
                    </div>
                </div>
            }

        </div>

    }
}

export default IntegrationDescription;