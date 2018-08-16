function ApplozicCameraService() {
  
    var _this = this;

    var pictureSource;   // picture source
    var destinationType; // sets the format of returned value 

    _this.setPictureSource = function(source) {
      _this.pictureSource = source;
    }

    _this.setDestinationType = function(type) {
      _this.destinationType = type;
    }

    // Called when a photo is successfully retrieved
    //
    _this.onPhotoDataSuccess = function(imageData) {
      // Get image handle
      //
      var smallImage = document.getElementById('smallImage');
      // Unhide image elements
      //
      smallImage.style.display = 'block';
      // Show the captured photo
      // The inline CSS rules are used to resize the image
      //
      smallImage.src = "data:image/jpeg;base64," + imageData;
    }
    
    // Called when a photo is successfully retrieved
    //
    _this.onPhotoFileSuccess = function(imageData) {
      // Get image handle
      console.log(JSON.stringify(imageData));
      
      // Get image handle
      //
      var smallImage = document.getElementById('smallImage');
      // Unhide image elements
      //
      smallImage.style.display = 'block';
      // Show the captured photo
      // The inline CSS rules are used to resize the image
      //
      smallImage.src = imageData;
    }
    // Called when a photo is successfully retrieved
    //

    _this.onPhotoURISuccess = function(imageURI) {
      // Uncomment to view the image file URI 
      // console.log(imageURI);
      // Get image handle
      //
      var largeImage = document.getElementById('largeImage');
      // Unhide image elements
      //
      largeImage.style.display = 'block';
      // Show the captured photo
      // The inline CSS rules are used to resize the image
      //
      largeImage.src = imageURI;
    }
    
    // A button will call this function
    //
    _this.capturePhotoWithData = function() {
      // Take picture using device camera and retrieve image as base64-encoded string
      navigator.camera.getPicture(_this.onPhotoDataSuccess, _this.onFail, { quality: 50 });
    }

    _this.capturePhotoWithFile = function() {
        navigator.camera.getPicture(_this.onPhotoFileSuccess, _this.onFail, { quality: 50, destinationType: Camera.DestinationType.FILE_URI });
    }
    
    // A button will call this function
    //
    _this.getPhoto = function(source) {
      // Retrieve image file location from specified source
      navigator.camera.getPicture(_this.onPhotoURISuccess, _this.onFail, { quality: 50, 
        destinationType: destinationType.FILE_URI,
        sourceType: source });
    }

    // Called if something bad happens.
    // 
    _this.onFail = function(message) {
      alert('Failed because: ' + message);
    }

}