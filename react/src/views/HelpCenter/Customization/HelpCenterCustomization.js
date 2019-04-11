import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import Modal from 'react-modal';
import {getAppSetting, updateAppSetting, uploadImageToS3} from '../../../utils/kommunicateClient';
import { SettingsHeader } from '../../../components/SettingsComponent/SettingsComponents';
import ColorPicker from '../../../components/ColorPicker/ColorPicker';
import Button from '../../../components/Buttons/Button';
import Notification from '../../model/Notification';
import ImageUploader from '../../Admin/ImageUploader';
import { UploadIcon } from '../../../assets/svg/svgs';
import CommonUtils from '../../../utils/CommonUtils';
import MultiEmail from "../../MultiEmail/MultiEmail";

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
            currentUploader: ""
        }
    }

    componentDidMount = () => {
        this.getHelpcenterSetting();
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
                    favicon: helpcenterSettings.favicon
                });
            }
        }).catch(err => {
            console.log(err);
        });
    }

    handleColorPickerChange = (changedColor) => {
        this.setState({ helpcenterColor: changedColor.hex });
    }

    handleInputChange = (e) => {
        let id = e.target.id,
            value = e.target.value;
        
        if(id === "headline-text") {
            this.setState({
                headlineText: value
            });
        } else if(id === "homepage-title") {
            this.setState({
                homepageTitle: value
            });
        } else {
            this.setState({
                customDomain: value
            });
        }
    }

    saveCustomizationChanges = () => {
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
            }
        }).catch( err => {
            Notification.error("Could not update Helpcenter customization settings. Please try again after some time.");
            console.log(err);
        })
    }

    validateFileType = (e) => {
        var fileName = e.target ? e.target.value : e;
        var idxDot = fileName.lastIndexOf(".") + 1;
        var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
        if (extFile=="jpg" || extFile=="jpeg" || extFile=="png"){
            console.log(extFile, idxDot, fileName);
        }else{
            alert("Only jpg/jpeg and png files are allowed!");
        }   
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
    })

    let hiddenImageInputElem = document.getElementById("hidden-image-input-element");

    if (hiddenImageInputElem) {
      hiddenImageInputElem.click();
    }
  };

    handleImageFiles = (e) => {
        e.preventDefault();
        const files = e.target.files;
        const file = files[0];
        this.setState({ fileObject: file })
        console.log(file)
        let imageTypeRegex = /^image\//
        if (file && imageTypeRegex.test(file.type)) {
          if (file.size <= 5000000) {
    
            let img = document.createElement("img")
            img.height = 90
            img.width = 60
            img.classList.add("obj")
            img.file = file;
    
            let reader = new FileReader()
            reader.onload = (function (aImg) { return function (e) { aImg.src = e.target.result; }; })(img);
            reader.readAsDataURL(file);
    
            this.openModal();
    
          } else if (file.size > 5000000) {
            Notification.info("Size exceeds 5MB")
            return
          }
        }
      }

    getImageBlob = (img) => {
        uploadImageToS3(img, `${CommonUtils.getUserSession().application.applicationId}-${CommonUtils.getUserSession().userName}.${img.name}`).then(response => {
            if(response.status === 200 && response.data.code === "SUCCESSFUL_UPLOAD_TO_S3") {
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
        })
        console.log(img);
    }

    render() {
        return (
            <Container className="animated fadeIn">
                <div className="km-heading-wrapper">
					<SettingsHeader  />
                </div>

                <ColumnsContainer>

                    <Columns>
                        <SectionTitle>Appearance</SectionTitle>

                        <ColorPicker className="helpcenter-color-picker" heading="Primary Color" disableAlpha={true} color={this.state.helpcenterColor} onChange={this.handleColorPickerChange} />

                        <InputGroup id="headline-text" heading="Headline Text" tooltip="Max. 30 characters" placeholder="Hi, how can we help you?" value={this.state.headlineText} onChange={this.handleInputChange} />

                       
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
                                        <InfoContainer data-rh-at="right" data-tip="Shortcut icon, Website icon, <br />Tab icon, URL icon, or Bookmark icon" data-effect="solid" data-place="right" data-html={true}> 
                                            <InfoIcon>i</InfoIcon>
                                        </InfoContainer>
                                    </FaviconDescriptionHeading>
                                    <FaviconDescriptionSubHeading>Recommended Ratio: 1:1 <br />ICO or PNG</FaviconDescriptionSubHeading>
                                </FaviconDescription>
                            </FaviconUploadContainer>
                        </ImageUploadContainer>

                        <input type="file" accept="image/png, image/ico" className="form-control user-dp-input" id="hidden-image-input-element" name="file" onChange={this.handleImageFiles} />



                        <Modal
                            isOpen={this.state.modalIsOpen}
                            ariaHideApp={false}
                            onRequestClose={this.closeModal}
                            style={customStyles} 
                            >
                            <div>
                                <ImageUploader
                                    allowZoomOut={true}
                                    profileImageUploader={false}
                                    handleImageFiles={this.handleImageFiles}
                                    invokeImageUpload={this.invokeImageUpload}
                                    uploadImageToS3={this.uploadImageToS3}
                                    handleClose={this.closeModal}
                                    fileObject={this.state.fileObject}
                                    hideLoader={this.hideLoader}
                                    imageData={this.getImageBlob}
                                />
                            </div>
                        </Modal>


                        <SectionTitle>Settings</SectionTitle>

                        <InputGroup id="homepage-title" heading="Homepage Title" tooltip="Max. 60 characters. <br> Will be displayed in a web browser's window title bar." placeholder="Kommunicate Helpcenter" value={this.state.homepageTitle} onChange={this.handleInputChange} />

                        <InputGroup id="custom-domain" heading="Custom Domain" placeholder="helpcenter.<your-domain>.com" value={this.state.customDomain} onChange={this.handleInputChange} />

                        <SendInstructionsContainer>
                            <MultiEmail template="INSTALLATION_INSTRUCTIONS" titleText="Mail instructions to tech team for sub domain setup" />
                        </SendInstructionsContainer>

                        <div>
                            <Button onClick={this.saveCustomizationChanges}>Save changes</Button>
                        </div>
                        
                    </Columns>
                    <Columns>
                        <LivePreviewContainer>
                            <LivePreview>
                                <LivePreviewHeader bgColor={this.state.helpcenterColor}>
                                    <LivePreviewHeading>
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
                

                <ReactTooltip />
            </Container>
        )
    }
}

const InputGroup = (props) => {
    return ( 
        <InputGroupContainer>
            <LabelContainer>
                <Label htmlFor={props.id}>{props.heading}</Label> 
                { props.tooltip && <InfoContainer data-rh-at="right" data-tip={props.tooltip} data-effect="solid" data-place="right" data-html={true}> 
                    <InfoIcon>i</InfoIcon>
                </InfoContainer> }
            </LabelContainer> 
            <Input id={props.id} className="input" type="text" value={props.value} onChange={props.onChange} placeholder={props.placeholder} />
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
    font-weight: 500;
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
`;

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
const InfoIcon = styled.div`
    width: 15px;
    height: 15px;
    font-size: 12px;
    line-height: 15px;
    border-radius: 50%;
    margin: 0 auto;
    color: #fff;
    background-color: #4a4a4a;
    font-style: italic;
    font-family: serif;
    padding-right: 2px;
`;

// Image Upload Section
const Image = styled.img`
    max-width: 180px;
`;
const ImageUploadContainer = styled(ColumnsContainer)``;
const LogoUploadContainer = styled.div`
    padding-right: 25px;
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
const FaviconDescriptionSubHeading = styled(LogoDescriptionSubHeading)``;


// Live Preview Section Design
const LivePreviewContainer = styled.div``;
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
    color: #ffffff;
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
    & .multi-email-install-link {
        display: block;
        margin: -15px 0 25px 0;
    }
    & .flex-center {
        justify-content: flex-start;
    }
    & .multiple-email-container {
        width: 53%;
        max-width: 320px;
    }
`;




const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      overflow: 'hidden',
      height: '450px',
      width: '600px'
  
    }
};

export default HelpCenterCustomization;