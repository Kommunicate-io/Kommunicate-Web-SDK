import React, { Component } from 'react';
import { thirdPartyList } from './km-thirdparty-list'
import Notification from '../../views/model/Notification'
import classes from './Aside.css';
import { getZendeskIntegrationTicket, createZendeskIntegrationTicket, updateZendeskIntegrationTicket } from '../../utils/kommunicateClient'



class ModalContent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            groupId: window.$kmApplozic(".left .person.active").data('km-id'),
            activeModal: this.props.activeModal,
            thirdPartyList: this.props.thirdPartyList,
            deleteStatement: false,
            title: "",
            note: "",
            id: "",
            groupInfo:null
        }
        this.insertTicketIdIntoGroupInfo = this.insertTicketIdIntoGroupInfo.bind(this);
    }

    componentWillMount() {
        let that=this
       window.$kmApplozic.fn.applozic("getGroup", {
            'groupId': this.state.groupId, 'callback': function (group) {
                if (group) {
                    that.setState({groupInfo : group})
                }
            }
        });
    }
    insertTicketIdIntoGroupInfo(ticketId, groupId) {
        var group = window.KM_GROUP_MAP[groupId];
        if (group) {
            group.metadata.KM_ZENDESK_TICKET_ID = ticketId;
            window.KM_GROUP_MAP[groupId] = group;
            window.kmEvents.triggerCustomEvent("group-update", { data: { data: group } });
        }
    }

    componentDidMount() {
        this.getZendeskTicket()
    }
    getZendeskTicket = () => {
        if (this.state.groupInfo.metadata.KM_ZENDESK_TICKET_ID) {
            return Promise.resolve(getZendeskIntegrationTicket(this.state.groupInfo.metadata.KM_ZENDESK_TICKET_ID)).then(response => {
                this.setState({
                    title: response.data.data.ticket.subject,
                    note: response.data.data.ticket.description,
                    id: response.data.data.ticket.id
                })

            }).catch(err => {
                console.log("error while fetching zendesk ticket", err);
            })
        }
    }
    handleCreateAndUpdate = () => {
        if (this.state.id != "") {
            this.updateZendeskIntegrationTicket();
        } else {
            this.createZendeskTicket();
        }
    }
    createZendeskTicket = () => {
        let data = {
            "ticket": {
                "subject": this.state.title,
                "comment": { "body": this.state.note }
            }
        }
        if (this.state.note != "" && this.state.title != "") {
            createZendeskIntegrationTicket(data, this.state.groupId)
                .then(response => {
                    if (response.status === 200 && response.data.code === "SUCCESS") {
                        this.insertTicketIdIntoGroupInfo(response.data.data.ticket.id, this.state.groupId)
                        Notification.info(thirdPartyList[this.state.activeModal].name + " ticket created")
                        this.props.handleCloseModal();


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
        else {
            Notification.info("All fields are mandatory")
            this.props.handleCloseModal();
        }

    }
    updateZendeskIntegrationTicket = () => {
        var ticketId = this.state.groupInfo.metadata.KM_ZENDESK_TICKET_ID;
        let data = {
            "ticket": {
                // "status": "pending",
                "comment": { "body": this.state.note }
            }
        }
        if (this.state.note != "" && this.state.title != "") {
            updateZendeskIntegrationTicket(data, ticketId)
                .then(response => {
                    console.log(response)
                    if (response.status === 200 && response.data.code === "SUCCESS") {
                        Notification.info(thirdPartyList[this.state.activeModal].name + " ticket updated")
                        this.props.handleCloseModal();


                    } else {
                        Notification.info("There was a problem while integrating" + thirdPartyList[this.state.activeModal].name);
                        this.props.handleCloseModal();
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
        else {
            Notification.info("All fields are mandatory")
            this.props.handleCloseModal();
        }
    }

    render() {
        return <div>
            <h4 className="conversation-integration-modal-title"><span><img src={thirdPartyList[this.state.activeModal].logo} className="conversation-integration-description-logo" /></span>
                Forwarding to {thirdPartyList[this.state.activeModal].name}</h4>
            <div className="conversation-integration-title-divider"></div>
            <p className="integration-conversation-title">Conversation title:
                <input type="text" className="integration-conversation-title-input" value={this.state.title}
                    onChange={(e) => {
                        let title = e.target.value
                        this.setState({ title: title })
                    }} />
            </p>
            <div className="integration-conversation-note-wrapper">
                <span className="integration-conversation-note">Add a note:</span>
                <textarea rows="5" cols="52" className="integration-conversation-note-msg-text-area"
                    value={this.state.note}
                    onChange={(e) => {
                        let note = e.target.value
                        this.setState({ note: note })
                    }}>
                </textarea>
            </div>
            <div className="create-ticket-btn-wrapper">
                <button className="km-button km-button--primary create-ticket-btn" onClick={this.handleCreateAndUpdate}>Create {thirdPartyList[this.state.activeModal].name} ticket</button>
            </div>
        </div>

    }
}

export default ModalContent;