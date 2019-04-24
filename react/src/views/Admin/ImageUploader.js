import React, { Component } from 'react';
import { sendProfileImage, updateApplozicUser, patchUserInfo } from '../../utils/kommunicateClient'
import Notification from '../model/Notification';
import './Admin.css';
import AvatarEditor from 'react-avatar-editor'
import Button from '../../components/Buttons/Button';
import { getResource, get } from '../../config/config.js'
import CommonUtils from '../../utils/CommonUtils';



class ImageUploader extends Component {

  static defaultProps = {
    updateProfilePicUrl: function (url) {},
    updateProfileImgUrl: function (url) {}
  }

  constructor(props, defaultProps) {
    super(props, defaultProps);
    this.state = {
      imageFile: CommonUtils.getUserSession().imageLink,
      file : getResource().defaultImageUrl,
      scale: 1,
      canvas: '',
      imageUrl: '',
      fileObjectProp: this.props.fileObject
    }
    this.handleScale = this.handleScale.bind(this);
    this.onClickSave = this.onClickSave.bind(this);
    this.dataURItoBlob = this.dataURItoBlob.bind(this);
    this.handleRemoveImage = this.handleRemoveImage.bind(this);
  }

  cropMethod = (e) => {
    e.preventDefault()    
    if (document.getElementById("hidden-image-input-element").value != "") {
       var _this = this;
      return Promise.resolve(_this.onClickSave()).then(res => {
        if(!this.props.profileImageUploader) {
          let blob = _this.dataURItoBlob(_this.state.canvas)
          _this.props.imageData(blob);
        } else {
          _this.uploadImageToS3()
        }
        
        _this.props.handleClose()
      }).catch(err => {
       console.log(err);
      })
    }
    else {
      Notification.info("Upload a Photo")
      return
    }
  }

  uploadImageToS3 = () => {
    let blob = this.dataURItoBlob(this.state.canvas)

    let file = blob;
    let fileName = `${CommonUtils.getUserSession().application.applicationId}-${CommonUtils.getUserSession().userName}.${file.name}`;
    let imageUrl = '';
    if (file) {
      sendProfileImage(file, fileName)
        .then(response => {
          console.log(response)
          if (response.data.code === "SUCCESSFUL_UPLOAD_TO_S3") {
            let userSession = CommonUtils.getUserSession();
            userSession.imageLink = response.data.profileImageUrl;
            CommonUtils.setUserSession(userSession);

            imageUrl = response.data.profileImageUrl
            updateApplozicUser({ imageLink: response.data.profileImageUrl })
              .then(response => {
                console.log(response);
                this.props.updateProfilePicUrl(imageUrl);
                this.props.updateProfileImgUrl(imageUrl);
                Notification.info("Successfully uploaded..")
                this.props.hideLoader();
              }

              )
              .catch(err => {
                console.log(err)
                Notification.info("Error in uploading image")
              })
          } else if (response.data.code === "FAILED_TO_UPLOAD_TO_S3") {
            Notification.info(response.data.message)
          }
        })
        .catch(err => {
          console.log(err)
          Notification.info("Error in uploading image")
        })
    } else {
      Notification.info("No file to upload")
    }
  }

  handleScale(event) {
    const scale = parseFloat(event.target.value)
    this.setState({ scale });
  }

  dataURItoBlob(dataURI) {

    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    let byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    //Old Code
    //write the ArrayBuffer to a blob, and you're done
    //var bb = new BlobBuilder();
    //bb.append(ab);
    //return bb.getBlob(mimeString);

    //New Code
    // return new Blob([this.state.ab], {type:this.state.mimeString});
    let file;
    let blob = new Blob([ia], { type: 'image/jpeg' });
    if(CommonUtils.isInternetExplorerOrEdge()) {
      blob.name = "image.jpg";
      blob.lastModifiedDate = new Date();
      return blob;
    } else {
      file = new File([blob], "image.jpg");
      return file;
    }
  }


  onClickSave = () => {
    //e.preventDefault()
    //let img = this.editor.getImage().toDataURL();
    //let rect = this.editor.getCroppingRect();
    if (this.editor) {
      // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
      // drawn on another canvas, or added to the DOM.
      this.setState({
        canvas: this.editor.getImageScaledToCanvas().toDataURL()
      })
      
     return '';
    }
    
  }
  handleRemoveImage = (e) => {
    e.preventDefault();
    this.setState({
      imageUrl: get('prod').kommunicateDashboardUrl+getResource().defaultImageUrl,
    })
   let dpUrl = { imageLink: get('prod').kommunicateDashboardUrl+getResource().defaultImageUrl }
    updateApplozicUser(dpUrl)
      .then(response => {
        console.log(response);
        this.props.updateProfilePicUrl(this.state.imageUrl);
        this.props.updateProfileImgUrl(this.state.imageUrl)
        let userSession = CommonUtils.getUserSession();
        userSession.imageLink = this.state.imageUrl;
        CommonUtils.setUserSession(userSession);
        Notification.info("Display Photo Removed..");
        this.props.handleClose();
      }
      )
  }
  setEditorRef = (editor) => this.editor = editor

  render() {
    return (
      <form>
        <div className="modal-wrapper">
          <div className="image-editor-container">
            <div className="avatar-editor"> 
              {/* Cropped Image
                      <img src={this.state.canvas} className="hidden-copped-img"/> 
                      */}
            <AvatarEditor
              ref={this.setEditorRef}
              image={this.state.fileObjectProp}
              width={this.props.width}
              height={this.props.height}
              // border={60}
              borderRadius={this.props.borderRadius}
              color={this.props.color} // RGBA
              scale={this.state.scale}
              rotate={0}
            />

            </div>
            
            {/* <div className="modal-btn-group">
              <button className="upload-img-button" autoFocus={false} id="upload-img-button" onClick={this.invokeImageUpload}>Upload Photo</button>
              <button className="remove-img-button" autoFocus={false} id="remove-img-button" onClick={this.handleRemoveImage}>Remove Photo</button>
            </div> */}

          </div>

          <div className="row">
            <div className="col-md-12 flexi flexi-jc-sb">
            <div className="range-slider">
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z"/></svg>
              </span>
              <input 
                type="range" 
                className="slider-input" 
                min={this.props.allowZoomOut ? '0.1' : '1'}
                max="2"
                step="0.01"
                defaultValue="1"
                onChange={this.handleScale} 
              />
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z"/></svg>
              </span>
            </div>
              <div className="modal-footer-button">
                <Button secondary type="submit" autoFocus={false} onClick={()=>{this.props.handleClose(), this.props.hideLoader()}}> Cancel</Button>
                <Button primary type="submit" autoFocus={false} className="m-left" onClick={this.cropMethod}>Save changes</Button>
              </div>
            </div>
          </div>
        </div>


      </form>
    )
  }
}


export default ImageUploader

