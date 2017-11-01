// var AWS = require('aws-sdk')

// var s3 = new AWS.S3({
// 	accessKeyId: 'AKIAIWQE377PPIAEXITQ',
// 	secretAccessKey: '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', 
// 	region: 'ap-south-1'
// });

// const checkIfBucketExists = () => {
// 	console.log("checkIfBucketExists");
// 	s3.headBucket({Bucket: "kommunicate"}, function(err, data) {
//    		if (err) {
//       		console.log("Error", err);
//       		if(err.code === 'NotFound') {
// 				return false;
//       		} else{
//       			console.log("Error different from NotFound");
//       		}
//    		} else {
//       		console.log(data);
//       		return true;
//    		}
// 	}); 
// }

// const createBucket = () => {
// 	console.log("createBucket");
// 	// Call S3 to create the bucket
// 	s3.createBucket({Bucket:'kommunicate'}, function(err, data) {
// 	   if (err) {
// 	      console.log("Error", err);
// 	   } else {
// 	      console.log("Success", data.Location);
// 	   }
// 	});
// }

// const uploadImageToS3 = (imageFile) => {
// 	console.log("uploadImageToS3");
// 	// call S3 to retrieve upload file to specified bucket
// 	var uploadParams = {Bucket: 'kommunicate', Key: '', Body: ''};
// 	var file = imageFile

// 	// call S3 to retrieve upload file to specified bucket
// 	var fs = require('fs');

// 	var fileStream = fs.createReadStream(file);
// 	fileStream.on('error', function(err) {
// 	  console.log('File Error', err);
// 	});
// 	uploadParams.Body = fileStream;
// 	var path = require('path');
// 	uploadParams.Key = "profile_pic/" + path.basename(file);
// 	// call S3 to retrieve upload file to specified bucket
// 	s3.upload (uploadParams, function (err, data) {
// 	  if (err) {
// 	    console.log("Error", err);
// 	  } if (data) {
// 	    console.log("Upload Success", data.Location);
// 	  }
// 	});
// }

// exports.uploadProfileImage = (imageFile) => {
// 	console.log("uploadProfileImage");

// 	if (checkIfBucketExists) {
// 		uploadImageToS3(imageFile)
// 	} else {

// 	}

// }