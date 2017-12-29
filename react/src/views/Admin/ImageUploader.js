import React, { Component } from 'react';
import { sendProfileImage, updateApplozicUser, patchUserInfo } from '../../utils/kommunicateClient'
import Notification from '../model/Notification';
import './Admin.css';
import AvatarEditor from 'react-avatar-editor'
import Modal from 'react-modal';
import { getResource, get } from '../../config/config.js'
import CommonUtils from '../../utils/CommonUtils';


class ImageUploader extends Component {

  static defaultProps = {
    updateProfilePicUrl: function (url) {
      //default

    },updateProfileImgUrl: function (url){

    }
    
  }

  constructor(props, defaultProps) {
    super(props, defaultProps);
    this.state = {
      imageFile: localStorage.getItem("imageLink") == null ? getResource().defaultImageUrl : localStorage.getItem("imageLink"),
      file : getResource().defaultImageUrl,
      scale: 1.2,
      canvas: '',
      imageUrl: ''
    }
    this.handleScale = this.handleScale.bind(this);
    this.onClickSave = this.onClickSave.bind(this);
    this.dataURItoBlob = this.dataURItoBlob.bind(this);
    this.handleRemoveImage = this.handleRemoveImage.bind(this);
  }
  invokeImageUpload = (e) => {
    e.preventDefault()

    let hiddenImageInputElem = document.getElementById("hidden-image-input-element");

    if (hiddenImageInputElem) {
      hiddenImageInputElem.click()
    }
  };
  handleImageFiles = (e) => {
    var file_name = document.getElementById("hidden-image-input-element").value;
    var file_extn = file_name.split('.').pop().toLowerCase();
    console.log(file_name)
    console.log(file_extn)
    e.preventDefault()
    const files = e.target.files;
    const file = files[0];
    this.setState({ imageFile: file })
    console.log(file)
    let imageTypeRegex = /^image\//

    //let thumbnail = document.getElementById("thumbnail")

    if (file && imageTypeRegex.test(file.type)) {

      // while (thumbnail.hasChildNodes()) {
      //   thumbnail.removeChild(thumbnail.firstChild)
      //}

      if (file.size <= 5000000) {

        let img = document.createElement("img")
        img.height = 90
        img.width = 60
        img.classList.add("obj")
        img.file = file

        //thumbnail.appendChild(img)

        let reader = new FileReader()
        reader.onload = (function (aImg) { return function (e) { aImg.src = e.target.result; }; })(img);
        reader.readAsDataURL(file)

      } else if (file.size > 5000000) {
        Notification.info("Size exceeds 5MB")
        return
      }
    }
  }
  cropMethod = (e) => {
    e.preventDefault()
    if (document.getElementById("hidden-image-input-element").value != "") {
       var _this = this;
      return Promise.resolve(_this.onClickSave()).then(res => {
        _this.uploadImageToS3()
      })
         .catch(err => {
       console.log(err);
      
      })

    }
    else {
      Notification.info("Upload a Photo")
      return
    }



  }

  uploadImageToS3 = () => {
    //e.preventDefault()  
    let blob = this.dataURItoBlob(this.state.canvas)
    console.log(blob)
    //this.dataURItoBlob(this.state.canvas)
    // let thumbnail = document.getElementById("thumbnail")
    let imageTypeRegex = /^image\//
    //let file = this.state.imageFile
    let file = blob
    let imageUrl = ''
    if (file) {
      sendProfileImage(file, `${localStorage.getItem("applicationId")}-${CommonUtils.getUserSession().userName}.${file.name.split('.').pop()}`)
        .then(response => {
          console.log(response)
          if (response.data.code === "SUCCESSFUL_UPLOAD_TO_S3") {
            localStorage.setItem("imageLink", response.data.profileImageUrl)
            imageUrl = response.data.profileImageUrl
            updateApplozicUser({ imageLink: response.data.profileImageUrl })
              .then(response => {
                console.log(response);
                this.props.updateProfilePicUrl(imageUrl);
                this.props.updateProfileImgUrl(imageUrl);
                Notification.info("Successfully uploaded..")
                this.props.handleClose();
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
    this.setState({
      scale: event.target.value / 100
    })
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
    let blob = new Blob([ia], { type: 'image/jpeg' });
    let file = new File([blob], "image.jpg");
    return file
    console.log(file)


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
        localStorage.setItem("imageLink", this.state.imageUrl);
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
              image={this.state.imageFile}
              /* width={300}
               height={300}
               border={60}*/
              borderRadius={130}
              color={[255, 255, 255, 0.6]} // RGBA
              scale={this.state.scale}
              rotate={0}
            />

            </div>
            <div className="range-slider"><i className="icon-picture zoom-icon-left"></i>
              <input type="range" className="slider-input" min="100" max="500" step="50" onChange={this.handleScale} /><i className="icon-picture zoom-icon-right"></i>
            </div>
            <div className="modal-btn-group">
              <button className="upload-img-button" autoFocus={false} id="upload-img-button" onClick={this.invokeImageUpload}>Upload Photo</button>
              <button className="remove-img-button" autoFocus={false} id="remove-img-button" onClick={this.handleRemoveImage}>Remove Photo</button>
            </div>

            {/* <button type="submit" autoFocus={true} className="btn btn-sm btn-danger"  onClick={this.cropMethod}> Save Image</button> */}
          </div>

          <input type="file" accept="image/*" className="form-control user-dp-input" id="hidden-image-input-element" name="file" onChange={this.handleImageFiles} />
          <div className="row">
            <div className="col-md-12">
              <div className="modal-footer-button">
                <button type="submit" autoFocus={false} className="btn btn-sm" id="cancel-button" onClick={this.props.handleClose}> Cancel</button>
                <button type="submit" autoFocus={false} className="btn btn-sm" id="image-input-button" onClick={this.cropMethod}>Save</button>

              </div>
            </div>
          </div>
        </div>


      </form>
    )
  }
}


export default ImageUploader

