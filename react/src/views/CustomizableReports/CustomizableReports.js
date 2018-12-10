import React, { Component } from 'react';
import styled, { withTheme } from 'styled-components';
import Modal from 'react-modal';
import Select from 'react-select';
import Notification from '../../views/model/Notification';
import Button from '../../components/Buttons/Button';
import CloseButton from '../../components/Modal/CloseButton';
import CommonUtils from '../../utils/CommonUtils';
import { ConfirmationTick, CustomizableReportsImage } from '../../assets/svg/svgs';
import { callSendEmailAPI } from '../../utils/kommunicateClient';


const modalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '600px',
        overflow: 'unset',
    }
};

const Container = styled.div`
    margin: 25px auto;
    border-radius: 4px;
    border: solid 1px #e1dbdb;
    background-color: #ffffff; 
    padding: 20px;
`;

const FlexContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
`;

const TextContainer = styled.div`

`;
const ImageContainer = styled.div`

`;

const Heading = styled.h3`
    font-size: 24px;
    font-weight: normal;
    line-height: 1.21;
    letter-spacing: 0.9px;
    color: #000000;
`;

const Description = styled.p`
    font-size: 16px;
    letter-spacing: 0.6px;
    color: #88878b;
    
`;

const ButtonLink = styled(Button)`
    text-transform: uppercase;
    font-weight: bold;
    padding-left: 0px;
`;

const ModalHeading = styled.h4`

`;

const Hr = styled.hr`
    margin: 15px -20px;
`;

const ModalDescription = styled.div`

    margin: 10px auto;

    .Select.customizable-reports-select {
        display: inline-block;
        vertical-align: middle;
        min-width: 100px;
        margin: 0 10px;
        position: relative;
        z-index: 100;
    }
    .Select-placeholder, .Select--single > .Select-control .Select-value {
        line-height: 24px;
    }
    .Select-input {
        height: 24px;
    }
    .Select-control {
        border: none;
        border-bottom: 1px solid #ccc;
        border-radius: 0;
        height: 25px;
    }
`;

const TextArea = styled.textarea`
    resize: none;
    border-radius: 4px;
    border: solid 1px #e1dbdb;
    width: 100%;
    font-size: 14px;
    outline: 0;
    background: transparent;
    margin: 10px auto;
    padding: 10px;

    &:focus {
        border: solid 1px ${props => props.theme.primary};
        outline: 0;
    }
`;

const ModalButtons = styled.div`
    text-align: right;
    margin-top: 60px;

    & button:last-child {
        margin-left: 15px;
    }
`;

const RequirementForm = styled.div`
    
`;

const RequirementSubmitted = styled.div`
    text-align: center;

    & svg {
        width: 85px;
        height: 85px;
        margin: 40px auto 25px;

    }
`;

const reportsDuration = [
    {value: 1, label: "Daily"},
    {value: 7, label: "Weekly"},
    {value: 30, label: "Monthly"}
];

class CustomizableReports extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isModalOpen: false,
            textAreaValue: "",
            selectedReportsDuration: reportsDuration[1],
            isRequirementSubmitted: false
        }
    };

    openModal = () => {
        this.setState({
            isModalOpen: true
        });
    }

    closeModal = () => {
        this.setState({
            isModalOpen: false
        });
    }

    onAfterOpenModal = () => {
        this.setState({
            isRequirementSubmitted: false
        });
    }

    submitRequirement = () => {
        if(this.state.textAreaValue.trim().length > 0){

            let options = {
                templateName: "CUSTOM_REPORTS_REQUIREMENT",
                customReportsDescription: this.state.textAreaValue,
                customReportsDuration: this.state.selectedReportsDuration.label,
                subject: "Custom Reports Requirement"
            }
  
            callSendEmailAPI(options).then(response => {
                if(response.status ==  200 && response.data.code == "SUCCESS") {
                    Notification.success("Custom reports request submitted successfully");
                    this.setState({textAreaValue: '', isRequirementSubmitted: true})
                }
            });
        } else if(this.state.textAreaValue.trim().length < 1 ) {
            Notification.info("Please enter the text");
        }
    }

    render() {
        return (
            <Container>
                <FlexContainer>
                    <TextContainer>
                        <Heading>Looking for some advanced reporting?</Heading>
                        <Description>Let us know what you want and we will deliver it straight to your email</Description>
                        <ButtonLink link onClick={this.openModal}>Request Custom Reports</ButtonLink>
                    </TextContainer>
                    <ImageContainer>
                        <CustomizableReportsImage />
                    </ImageContainer>
                </FlexContainer>


                <Modal isOpen={this.state.isModalOpen} onRequestClose={this.closeModal} onAfterOpen={this.onAfterOpenModal} style={modalStyles} shouldCloseOnOverlayClick={true} ariaHideApp={false}>
                    <RequirementForm hidden={this.state.isRequirementSubmitted}>
                        <ModalHeading>Custom reports requirement</ModalHeading>
                        <Hr />
                        <ModalDescription>Please explain your reports requirement. You may ask for multiple requirements. Include as much details as tou can and out team will go through them.</ModalDescription>
                        
                        <TextArea rows="5" placeholder="Example: I want a cumulative and individual average response time for all my agents" value={this.state.textAreaValue} onChange={(e) => {
                            this.setState({
                                textAreaValue: e.target.value
                            })
                        }} />

                        <ModalDescription>We will send you a 
                            <Select className="customizable-reports-select"
                                clearable={false}
                                searchable={false}
                                value={this.state.selectedReportsDuration}
                                onChange={selectedReportsDuration => {
                                    this.setState({
                                        selectedReportsDuration
                                    });
                                }}
                                options={reportsDuration}  /> 
                            automated report according to your requirements at {CommonUtils.getUserSession().email}
                        </ModalDescription>

                        <ModalButtons>
                            <Button secondary onClick={this.closeModal}>Cancel</Button>
                            <Button primary onClick={this.submitRequirement}>Submit Requirement</Button>
                        </ModalButtons>
                    </RequirementForm>

                    <RequirementSubmitted hidden={!this.state.isRequirementSubmitted}>
                        <ConfirmationTick />
                        <ModalHeading>We have received your custom reports requirement</ModalHeading>
                        <ModalDescription>Our team will go through your requirements and will be in touch with you soon</ModalDescription>
                        <ModalButtons>
                            <Button primary onClick={this.closeModal}>Okay</Button>
                        </ModalButtons>
                    </RequirementSubmitted>

                    <CloseButton onClick={this.closeModal}/>
                </Modal>

            </Container>
        );
    }
}

export default withTheme(CustomizableReports);