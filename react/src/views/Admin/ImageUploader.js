import React, { Component } from 'react';
import { sendProfileImage, updateApplozicUser } from '../../utils/kommunicateClient'
import Notification from '../model/Notification';


class ImageUploader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      imageFile: undefined
    }
  }

  invokeImageUpload = (e) => {
    e.preventDefault()

    let hiddenImageInputElem = document.getElementById("hidden-image-input-element");

    if (hiddenImageInputElem) {
      hiddenImageInputElem.click()
    }
  }

  handleImageFiles = (e) => {
    e.preventDefault()

    const files = e.target.files;
    const file = files[0];

    this.setState({ imageFile: file })

    console.log(file)

    let imageTypeRegex = /^image\//

    let thumbnail = document.getElementById("thumbnail")

    if (file && imageTypeRegex.test(file.type)) {

      while (thumbnail.hasChildNodes()) {
        thumbnail.removeChild(thumbnail.firstChild)
      }

      if (file.size <= 5000000) {
        let img = document.createElement("img")
        img.height = 90
        img.width = 60
        img.classList.add("obj")
        img.file = file

        thumbnail.appendChild(img)

        let reader = new FileReader()
        reader.onload = (function (aImg) { return function (e) { aImg.src = e.target.result; }; })(img);
        reader.readAsDataURL(file)

      } else if (file.size > 5000000) {
        Notification.info("Size exceeds 5MB")
        return
      }
    }
  }

  uploadImageToS3 = (e) => {
    e.preventDefault()
    let thumbnail = document.getElementById("thumbnail")
    let imageTypeRegex = /^image\//
    let file = this.state.imageFile
    let imageUrl=''
    if (thumbnail.hasChildNodes() && file && imageTypeRegex.test(file.type)) {
      sendProfileImage(file, `${localStorage.getItem("applicationId")}-${localStorage.getItem("loggedinUser")}.${file.name.split('.').pop()}`)
        .then(response => {
          console.log(response)
          if (response.data.code === "SUCCESSFUL_UPLOAD_TO_S3") {
            imageUrl = response.data.profileImageUrl
            updateApplozicUser({ imageLink: response.data.profileImageUrl })
              .then(response => {
                console.log(response); this.props.updateProfilePicUrl(imageUrl);
                localStorage.setItem("imageLink", imageUrl);
                Notification.info(response.data.message)
              }
              )
              .catch(err => { console.log(err) 
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

  render() {
    return (
      <div className="card">
        <div className="card-header">
          <strong>Set Profile Image</strong>
        </div>
        <div className="card-block">
          <div className="form-group row">
            <label className="col-md-3 form-control-label" htmlFor="email-input">Profile Image</label>
            <div className="col-md-9">
              <input type="file" accept="image/*" className="form-control" id="hidden-image-input-element" name="file" onChange={this.handleImageFiles} style={{ display: "none" }} />
              <div>
                <span>Please select a file less than 5MB</span>
              </div>
              <div id="thumbnail">
              </div>
            </div>
          </div>
        </div>
        <div className="card-footer">
          <button type="submit" className="btn btn-sm btn-primary" id="image-input-button" onClick={this.invokeImageUpload}><i className="icon-picture"></i> Select Image</button>
          <button type="submit" className="btn btn-sm btn-danger" id="image-input-button" onClick={this.uploadImageToS3}><i className="icon-cloud-upload"></i> Upload Image</button>
        </div>
      </div>
    )
  }
}
export default ImageUploader

