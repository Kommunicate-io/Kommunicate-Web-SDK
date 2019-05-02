import React, { Component } from 'react';
import styled, { withTheme } from 'styled-components';
import ReactTooltip from 'react-tooltip';
import copy from 'copy-to-clipboard';
import tinycolor from 'tinycolor2';
import CreatableSelect from "react-select/lib/Creatable";
import isURL from 'validator/lib/isURL';
import isEmail from "validator/lib/isEmail";
import Modal from '../../../components/Modal/Modal';
import {getAppSetting, updateAppSetting, uploadImageToS3, notifyThatEmailIsSent} from '../../../utils/kommunicateClient';
import { SettingsHeader } from '../../../components/SettingsComponent/SettingsComponents';
import ColorPicker from '../../../components/ColorPicker/ColorPicker';
import Button from '../../../components/Buttons/Button';
import Notification from '../../model/Notification';
import ImageUploader from '../../Admin/ImageUploader';
import { UploadIcon, MoreInfoLinkSvg, CopyIcon, ConfirmationTick, InfoIcon, ErrorIcon } from '../../../assets/svg/svgs';
import CommonUtils from '../../../utils/CommonUtils';
import { getConfig } from '../../../config/config';
import {SetUpYourDomainContainer, DomainTable, SetUpCompleteContainer} from '../../../views/Company/companyStyle';
import AnalyticsTracking from '../../../utils/AnalyticsTracking';



const components = {
    DropdownIndicator: null
};

const createOption = label => ({
    label,
    value: label
});

const colourStyles = {
    control: styles => ({ ...styles }),

     multiValue: (styles, { data }) => {
        return {
            ...styles,
            borderRadius: '3px'
        };
    },
    input: (styles, {data}) => ({
        ...styles,
        transition: 'none',
        fontSize: '16px'

     }),
    multiValueLabel: (styles, { data }) => ({
        ...styles,
        color: data.color,
        fontSize: '100%'
    })
};


class HelpCenterCustomization extends Component {
    constructor(props) {
        super(props);
        this.state = {
            helpcenterColor: "#5553B7",
            headlineText: "",
            homepageTitle: "",
            customDomain: "",
            logo: "",
            favicon: "",
            modalIsOpen: false,
            hideLoader:true,
            fileObject: {},
            currentUploader: "logo",
            disablePreviewButton: true,
            toggleCustomDomainModal: false,
            inputValue: "",
            value: [],
            emailSubmitted: false,
            changesMade: false,
            errorText: ""
        }
    }

    componentDidMount = () => {
        this.getHelpcenterSetting();
    }

    handleSelectChange = (value, meta) => {
        this.setState({ value });
    };

    handleSelectInputChange = (inputValue, action) => {
        if (action.action !== "input-blur" && action.action !== "menu-close") {
            this.setState({ inputValue });
        }
    };

    handleSelectKeyDown = event => {
        const { inputValue } = this.state;
        if (!inputValue) return;
        switch (event.keyCode) {
            case 9: // TAB
            case 13: // ENTER
            case 32: // SPACE
            case 188: // COMMA
                event.preventDefault();
                this.createValidOption();
         }
    };

    handleSelectCreate = (e) => {
        this.createValidOption();
    }

    createValidOption = () => {
        const { inputValue, value } = this.state;
        if (!inputValue) return;
        if(isEmail(this.state.inputValue)) {
            this.setState({
                inputValue: "",
                value: [...value, createOption(inputValue)]
            });
            console.log(this.state.value)
        } else {
            Notification.error("Please enter a valid email address.");
        }
    }

    getHelpcenterSetting = () => {
        getAppSetting().then(response => {
            if(response.status == 200 && response.data.response && response.data.response.helpCenter) { 
                let helpcenterSettings = response.data.response.helpCenter;
                this.setState({
                    helpcenterColor: helpcenterSettings.color,
                    headlineText: helpcenterSettings.heading,
                    homepageTitle: helpcenterSettings.title,
                    customDomain: helpcenterSettings.domain,
                    logo: helpcenterSettings.logo,
                    favicon: helpcenterSettings.favicon,
                    disablePreviewButton: false
                });
            }
        }).catch(err => {
            console.log(err);
        });
    }

    handleColorPickerChange = (changedColor) => {
        this.setState({ 
            helpcenterColor: changedColor.hex,
            changesMade: true
        });
    }

    handleInputChange = (e) => {
        let name = e.target.name,
            value = e.target.value;
        
        this.setState({
            [name]: value,
            changesMade: true
        })
    }

    saveCustomizationChanges = () => {
        if(this.state.customDomain !== "" && !isURL(this.state.customDomain)) { 
            this.setState({
                errorText: "Please enter a valid URL."
            });
            return false;
        } else {
            this.setState({
                errorText: ""
            });
        }
        let data = {
            "helpCenter": {
                "color": this.state.helpcenterColor,
                "domain": this.state.customDomain,
                "favicon": this.state.favicon,
                "heading": this.state.headlineText,
                "logo": this.state.logo,
                "title": this.state.homepageTitle,
            }
        }
        updateAppSetting(data).then(response => {
            if(response.status == 200 && response.data.code == "SUCCESS") {
                Notification.success("Helpcenter customization settings updated successfully");
                AnalyticsTracking.acEventTrigger('helpcenterCustomization');
                this.setState({
                    disablePreviewButton: false,
                    changesMade: false
                })
            }
        }).catch( err => {
            Notification.error("Could not update Helpcenter customization settings. Please try again after some time.");
            console.log(err);
        })
    }

    openModal = () => {
        this.setState({ modalIsOpen: true });
    }
    
    closeModal = () => {
        this.setState({ 
            modalIsOpen: false,
            hideLoader : false 
        });
    }

    hideLoader = () =>{
        this.setState({ hideLoader:true });
    }
    
    invokeImageUpload = (e, currentUploader) => {
        e.preventDefault();
        this.setState({
            currentUploader: currentUploader
        });
        let hiddenImageInputElem = document.getElementById("hidden-image-input-element");
        hiddenImageInputElem && hiddenImageInputElem.click();
    };

    handleImageFiles = (e) => {
        e.preventDefault();
        const fileSizeLimit = 5000000;
        const files = e.target.files;
        const file = files[0];
        this.setState({ fileObject: file })
        console.log(file)
        let imageTypeRegex = /^image\//
        if (file && imageTypeRegex.test(file.type)) {
          if (file.size <= fileSizeLimit) {
    
            let img = document.createElement("img")
            img.height = 90
            img.width = 60
            img.classList.add("obj")
            img.file = file;
    
            let reader = new FileReader()
            reader.onload = (function (aImg) { return function (e) { aImg.src = e.target.result; }; })(img);
            reader.readAsDataURL(file);
    
            this.openModal();
    
          } else if (file.size > fileSizeLimit) {
            Notification.info("Size exceeds 5MB")
            return
          }
        }
      }

    getImageBlob = (img) => {
        var imageName = `${CommonUtils.getUserSession().application.applicationId}-${CommonUtils.getUserSession().userName}-${this.state.currentUploader}.${img.name}`;
        uploadImageToS3(img, imageName).then(response => {
            if(response.status === 200 && response.data.code === "SUCCESSFUL_UPLOAD_TO_S3") {
                this.setState({
                    changesMade: true
                })
                if(this.state.currentUploader === "logo") {
                    this.setState({
                        logo: response.data.profileImageUrl
                    });
                } else {
                    this.setState({
                        favicon: response.data.profileImageUrl
                    });
                }
                Notification.success(response.data.message);
            }
            console.log(response);
        }).catch(error => {
            console.log(error);
            Notification.error("Error while uploading image. Please try again after some time.");
        })
    }

    getColorBrightness = (colorCode) => {
        return tinycolor(colorCode).getBrightness()
    }

    limitText = (limitField, limitCount, limitNum) => {
        if (limitField.value.length > limitNum) {
            limitField.value = limitField.value.substring(0, limitNum);
        } else {
            limitCount.value = limitNum - limitField.value.length;
        }
    }

    openHelpcenterPreview = () => {
        let appId = CommonUtils.getUserSession().application.applicationId;
        let url = getConfig().helpcenterUrl + '?appId=' + appId;
        window.open(url, '_blank');
    }

    toggleCustomDomainModal = (showEmailSubmitted) => {
        this.setState({
            customDomainModal: !this.state.customDomainModal,
            emailSubmitted: !showEmailSubmitted 
        });
    }

    copyToClipboard = () => {
        copy("helpcenter-proxy.kommunicate.io");
        Notification.success("Domain value copied");
    }

    sendEmail = () => {
        let emailIds = [];
        if(this.state.value.length < 1) {
            Notification.error("Please enter an email id.");
            return false;
        }
        for(var i=0; i<this.state.value.length; i++) {
            emailIds.push(this.state.value[i].value);
        }
        notifyThatEmailIsSent({
            to: emailIds,
            templateName: "CUSTOM_DOMAIN_SETUP_INSTRUCTION"
        }).then(response => {
            if(response && response.status === 200 && response.data.code === "SUCCESS") {
                AnalyticsTracking.acEventTrigger("customDomainHelpcenter");
                this.setState({
                    emailSubmitted: true,
                    value: [],
                    inputValue: ""
                });
            } 
        });
    }

    render() {

        let primaryColorBrightness = this.getColorBrightness(this.state.helpcenterColor), textColor;
        textColor = primaryColorBrightness > 150 ? '#4a4a4a' : '#fff';

        return (
            <Container className="animated fadeIn">
                <div className="km-heading-wrapper">
					<SettingsHeader  />
                </div>
                
                <ColumnsContainer>

                    <Columns>
                        <SectionTitle>Appearance</SectionTitle>

                        <ColorPicker className="helpcenter-color-picker" heading="Primary Color" disableAlpha={true} color={this.state.helpcenterColor} onChange={this.handleColorPickerChange} />

                        <InputGroup id="headline-text" heading="Headline Text" tooltip="Max. 30 characters" placeholder="Hi, how can we help you?" name="headlineText" value={this.state.headlineText} onChange={this.handleInputChange} charCount={this.state.headlineText.length + "/30"} maxLength="30" />

                       
                       <ComponentHeading>Branding</ComponentHeading>
                        <ImageUploadContainer>
                            <LogoUploadContainer>
                                <LogoUpload onClick={(e) =>{ this.invokeImageUpload(e, "logo")}}>
                                    
                                    {this.state.logo ? <Image src={this.state.logo} /> : <UploadIcon />}
                                </LogoUpload>
                                <LogoDescription>
                                    <LogoDescriptionHeading>Logo</LogoDescriptionHeading>
                                    <LogoDescriptionSubHeading>Recommended Ratio: 1:2 <br />PNG</LogoDescriptionSubHeading>
                                </LogoDescription>
                            </LogoUploadContainer>
                            <FaviconUploadContainer>
                                <FaviconUpload onClick={(e) => { this.invokeImageUpload(e, "favicon") }}>
                                    {this.state.favicon ? <Image src={this.state.favicon} /> : <UploadIcon />}
                                </FaviconUpload>
                                <FaviconDescription>
                                    <FaviconDescriptionHeading>Favicon
                                        <InfoIcon style={{marginLeft: "5px"}} data-rh-at="right" data-tip="Shortcut icon, Website icon, <br />Tab icon, URL icon, or Bookmark icon" data-effect="solid" data-place="right" data-html={true} />
                                    </FaviconDescriptionHeading>
                                    <FaviconDescriptionSubHeading>Recommended Ratio: 1:1 <br />ICO or PNG</FaviconDescriptionSubHeading>
                                </FaviconDescription>
                            </FaviconUploadContainer>
                        </ImageUploadContainer>

                        <input type="file" accept="image/png, image/x-icon" className="form-control user-dp-input" id="hidden-image-input-element" name="file" onChange={this.handleImageFiles} />



                        <Modal
                            isOpen={this.state.modalIsOpen}
                            heading={"Choose " + this.state.currentUploader}
                            onRequestClose={this.closeModal}
                            >
                            <div>
                                <ImageUploader
                                    allowZoomOut={true}
                                    width={avatarEditorConfig[this.state.currentUploader].width}
                                    height={avatarEditorConfig[this.state.currentUploader].height}
                                    borderRadius={0}
                                    profileImageUploader={false}
                                    handleImageFiles={this.handleImageFiles}
                                    invokeImageUpload={this.invokeImageUpload}
                                    uploadImageToS3={this.uploadImageToS3}
                                    handleClose={this.closeModal}
                                    fileObject={this.state.fileObject}
                                    hideLoader={this.hideLoader}
                                    imageData={this.getImageBlob}
                                    color={[0, 0, 0, 0.3]}
                                />
                            </div>
                        </Modal>


                        <SectionTitle>Settings</SectionTitle>

                        <InputGroup id="homepage-title" heading="Homepage Title" tooltip="Max. 60 characters. <br> Will be displayed in a web browser's window title bar." placeholder="Kommunicate Helpcenter" name="homepageTitle" value={this.state.homepageTitle} onChange={this.handleInputChange} charCount={this.state.homepageTitle.length + "/60"}  maxLength="60" />

                        <InputGroup id="custom-domain" heading="Custom Domain" placeholder="helpcenter.<your-domain>.com" name="customDomain" value={this.state.customDomain} onChange={this.handleInputChange} error={this.state.errorText !== ""} errorText={this.state.errorText} />

                        <SendInstructionsContainer>
                            <Button link secondary onClick={this.toggleCustomDomainModal} style={{paddingLeft: "0", marginBottom: "10px"}}>Mail instructions to tech team for sub domain setup</Button>
                        </SendInstructionsContainer>

                        <ButtonGroup>
                            <Button onClick={this.saveCustomizationChanges}  disabled={!this.state.changesMade}>Save changes</Button>
                            <Button secondary onClick={this.openHelpcenterPreview} disabled={this.state.disablePreviewButton}>Preview <MoreInfoLinkSvg color={this.props.theme.primary} /></Button>
                        </ButtonGroup>
                        
                    </Columns>
                    <Columns>
                        <LivePreviewContainer>
                            <LivePreview>
                                <LivePreviewHeader bgColor={this.state.helpcenterColor}>
                                    <LivePreviewHeading color={textColor}>
                                        { this.state.headlineText ? this.state.headlineText : "Hi, how can we help you?" }
                                    </LivePreviewHeading>
                                    <LivePreviewSearchField />
                                </LivePreviewHeader>
                                <LivePreviewContent>
                                    <ContentBox />
                                    <ContentBox />
                                </LivePreviewContent>
                            </LivePreview>
                        </LivePreviewContainer>
                    </Columns>
                </ColumnsContainer>
                

                <Modal isOpen={this.state.customDomainModal} heading={this.state.emailSubmitted ? "": "Domain Setup Instructions"} onRequestClose={() => this.toggleCustomDomainModal(false)} width="700px" >                    
                    {this.state.emailSubmitted ? 
                        <SetUpCompleteContainer>
                            <ConfirmationTick />
                            <h5>Mail sent successfully!</h5>
                            <p>Follow the Domain setup instructions sent on your email</p>
                        </SetUpCompleteContainer> :
                        <SetUpYourDomainContainer >
                            <ol>
                                <li>Login to your<strong> domain administration panel </strong>and find <strong>DNS records management panel</strong> for the domain: <span>abcdefgh.com</span> </li>
                                <li>Then add new records</li>
                            </ol>
                            <DomainTable>
                                <tbody>
                                    <tr>
                                        <th>Type</th>
                                        <th>Name</th>
                                        <th>Value</th>
                                        <th></th>
                                    </tr>
                                    <tr>
                                        <td>CNAME</td>
                                        <td>{this.state.customDomain || "helpcenter.<your-domain>.com"}</td>
                                        <td>helpcenter-proxy.kommunicate.io</td>
                                        <td><span onClick = {this.copyToClipboard}><CopyIcon/> Copy</span></td>
                                    </tr>
                                </tbody>
                            </DomainTable>
                            <p>If you have any problems with the setup, please contact your domain admin support team. They will be able to help you out</p>
                            <ModalSeperator/>
                            <SetupInstructionText>Send these instructions to:</SetupInstructionText>
                            <CreatableSelect
                                className={'multi-email-input-field'}
                                components={components}
                                inputValue={this.state.inputValue}
                                isClearable={false}
                                isMulti={true}
                                menuIsOpen={false}
                                blurInputOnSelect={false} 
                                closeMenuOnSelect={false}
                                onChange={this.handleSelectChange}
                                onInputChange={this.handleSelectInputChange}
                                onKeyDown={this.handleSelectKeyDown}
                                onBlur={this.handleSelectCreate}
                                placeholder="Enter email ID here"
                                value={this.state.value}
                                styles={colourStyles}
                            />
                            <P>Tip: You can enter multiple email IDs separated by space</P>
                        </SetUpYourDomainContainer>
                    }

                    <ButtonGroup style={{textAlign:"right"}}>
                            <Button onClick={() => this.toggleCustomDomainModal(false)} secondary>Cancel</Button> <Button disabled={!this.state.value.length} onClick={this.sendEmail}>Send Instructions</Button>
                    </ButtonGroup>
                </Modal>

                <ReactTooltip />
            </Container>
        )
    }
}

const InputGroup = (props) => {
    return ( 
        <InputGroupContainer>
            <LabelContainer>
                <LabelWrapper>
                    <Label htmlFor={props.id}>{props.heading}</Label> 
                    { props.tooltip && <InfoIcon data-rh-at="right" data-tip={props.tooltip} data-effect="solid" data-place="right" data-html={true} /> }
                </LabelWrapper>
                <CharCount>{props.charCount}</CharCount>
            </LabelContainer> 
            <Input id={props.id} className="input" type="text" name={props.name} value={props.value} onChange={props.onChange} placeholder={props.placeholder} {...props} />
            {props.error && <ErrorFieldContainer>
                <ErrorIcon />
                <ErrorText>{props.errorText}</ErrorText>
            </ErrorFieldContainer>}
        </InputGroupContainer>
    )
}

//Styles
const Container = styled.div`
    margin-bottom: 50px;

    & .chrome-picker input, & .chrome-picker input + span {
        font-family: 'Roboto', sans-serif;
    }
    & .chrome-picker {
        border-radius: 4px !important;
    }
    & .helpcenter-color-picker {
        margin-top: 20px;
    }
`;
const ColumnsContainer = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-wrap: wrap;
`;
const Columns = styled.div`
    padding: 0 15px;
    flex: 1;
`;
const SectionTitle = styled.h3`
    font-size: 20px;
    letter-spacing: 1.4px;
    color: #9b9b9b;
`;
const InputGroupContainer = styled.div`
    margin: 20px 0;
`;
const Label = styled.label`
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0.6px;
    color: #4a4a4a;
    margin: 0 5px 0 0;
`;
const Input = styled.input`
    max-width: 450px;
    padding: 7px 10px 7px;
`;

const LabelContainer = styled(ColumnsContainer)`
    align-items: center;
    justify-content: space-between;
    max-width: 450px;
`;
const LabelWrapper = styled(ColumnsContainer)`
    align-items: center;
`;
const CharCount = styled.div``;

const ComponentHeading = styled(Label)`
    display: block;
`;
const InfoContainer = styled.div`
    width: 15px;
    height: 15px;
    cursor: help;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1px;
`;
const ErrorFieldContainer = styled(ColumnsContainer)`
    align-items: center;

    & svg {
        width: 14px;
        height: 14px;
    }
`;
const ErrorText = styled.p`
    margin: 0 0 0 5px;
    color: #ED1C24;
`;

// Image Upload Section
const Image = styled.img`
    max-width: 180px;
`;
const ImageUploadContainer = styled(ColumnsContainer)``;
const LogoUploadContainer = styled.div`
    padding-right: 45px;
`;
const LogoUpload = styled.div`
    width: 192px;
    height: 96px;
    border-radius: 4px;
    border: solid 1px #bfbfbf;
    background-color: #efefef;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    overflow: hidden;
`;
const LogoDescription = styled.div`
    margin-top: 5px;
`;
const FaviconUploadContainer = styled(LogoUploadContainer)``;
const FaviconUpload = styled(LogoUpload)`
    width: 48px; 
    height: 48px; 
    ${Image} {
        max-width: 38px;
    }
`;
const FaviconDescription = styled(LogoDescription)``;
const LogoDescriptionHeading = styled.div`
    font-size: 14px;
    color: #4a4a4a;
    font-weight: 500;
`;
const LogoDescriptionSubHeading = styled(LogoDescriptionHeading)`
    color: #7e7e7e;
    font-weight: 400;
`;
const FaviconDescriptionHeading = styled(LogoDescriptionHeading)`
    display: flex;
    align-items: center;
    ${InfoContainer} {
        margin-left: 5px;
    }
`;

const ModalSeperator = styled.hr`
    border: dashed .3px #d8d8d8;
    margin: 30px 0;
`;

const SetupInstructionText = styled.p`
  font-size: 16px;
  line-height: 1.25;
  color: #49494a;
`;

const FaviconDescriptionSubHeading = styled(LogoDescriptionSubHeading)``;


// Live Preview Section Design
const LivePreviewContainer = styled.div`
    max-width: 550px;
    margin-top: 60px;
`;
const LivePreview = styled.div`
    border-radius: 6px;
    background-color: #ffffff;
    box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.36);
    overflow: hidden;
`;
const LivePreviewHeader = styled.div`
    text-align: center;
    background-color: ${props => props.bgColor};
    height: 100%;
    max-height: 150px;
    padding: 32px;
`;
const LivePreviewHeading = styled.div`
    font-size: 22px;
    font-weight: 500;
    letter-spacing: 1.5px;
    color: ${props => props.color};
`;
const LivePreviewSearchField = styled.div`
    border-radius: 4px;
    background-color: #ffffff;
    width: 100%;
    max-width: 400px;
    margin: 20px auto;
    height: 25px;
`;
const LivePreviewContent = styled.div`
    background-color: #ffffff;
`;
const ContentBox = styled(LivePreviewSearchField)`
    height: 60px;
    background-color: #efefef;
`;
const SendInstructionsContainer = styled.div`
    margin-top: -10px;
`;
const ButtonGroup = styled.div`
    & button:last-child {
        margin-left: 15px;
        &:disabled svg path {
            stroke: #BBBBBB;
        }
    }
`;
const P = styled.p`
   &&&{
        margin: 10px 0 10px 2px;
        margin-bottom: 35px;
   }
`;

const avatarEditorConfig = {
    "logo": {
        width: 200,
        height: 100
    },
    "favicon": {
        width: 200,
        height: 200
    }
}

export default withTheme(HelpCenterCustomization);