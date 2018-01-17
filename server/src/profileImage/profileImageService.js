var AWS = require('aws-sdk')

var s3 = new AWS.S3({
	accessKeyId: 'AKIAJ7QAZU7R2GPBCXGQ',
	secretAccessKey: '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', 
	region: 'ap-south-1'
});

const checkIfBucketExists = () => {
	console.log("checkIfBucketExists");
	s3.headBucket({Bucket: "kommunicate"}, function(err, data) {
   		if (err) {
      		console.log("Error", err);
      		if(err.code === 'NotFound') {
				return false;
      		} else{
      			console.log("Error different from NotFound");
      			return false;
      		}
   		} else {
      		console.log(data);
      		return true;
   		}
	}); 
}

const createBucket = () => {
	console.log("createBucket");
	// Call S3 to create the bucket
	s3.createBucket({Bucket:'kommunicate'}, function(err, data) {
	   if (err) {
	      console.log("Error", err);
	   } else {
	      console.log("Success", data.Location);
	   }
	});
}

const uploadImageToS3 = (imageFile) => {
	console.log("uploadImageToS3");

	// call S3 to retrieve upload file to specified bucket
	var uploadParams = {
		ACL: 'public-read',
		Bucket: 'kommunicate',
		Key: '',
		Body: ''
	};

	var fs = require('fs');
	var fileStream = fs.createReadStream(imageFile.path);
	fileStream.on('error', function(err) {
	  console.log('File Error', err);
	});

	uploadParams.Body = fileStream;
	uploadParams.Key = "profile_pic/" + new Date().getTime()+imageFile.originalname;
	var uploadPromise = s3.upload(uploadParams).promise()
	return uploadPromise
		.then(data => ({code: 'SUCCESSFUL_UPLOAD_TO_S3', profileImageUrl: data.Location}))
		.catch(err => ({code: 'FAILED_TO_UPLOAD_TO_S3', message:'failed to upload to s3'}))
}

exports.uploadImageToS3 = (imageFile) => {
	console.log("uploadImageToS3");
	console.log(imageFile.originalname);

	if (checkIfBucketExists) {
		return uploadImageToS3(imageFile)
	} else {
		console.log('Bucket do not exist') 
	}
}