const config = require('../../conf/config.js')
const logger = require('../utils/logger');

var AWS = require('aws-sdk');
var accessKeyId=config.getProperties().s3Access.accessKeyId;
var secretAccessKey=config.getProperties().s3Access.secretAccessKey;
var region=config.getProperties().s3Access.region;
AWS.config.update({accessKeyId: accessKeyId, secretAccessKey: secretAccessKey, region: region});
var s3 = new AWS.S3();

const checkIfBucketExists = () => {
	console.log("checkIfBucketExists", s3);
	s3.headBucket({Bucket: "kommunicate"}, function(err, data) {
   		if (err) {
      		console.log("Error", err);
      		if(err.code === 'NotFound') {
				return false;
      		} else{
				logger.info("Error different from NotFound");
      			return false;
      		}
   		} else {
      		console.log(data);
      		return true;
   		}
	}); 
}

const createBucket = () => {
	logger.info("createBucket");
	// Call S3 to create the bucket
	s3.createBucket({Bucket:'kommunicate'}, function(err, data) {
	   if (err) {
		logger.info("Error", err);
	   } else {
		logger.info("Success", data.Location);
	   }
	});
}

const uploadImageToS3 = (imageFile) => {
	logger.info("uploadImageToS3");

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
		logger.info('File Error', err);
	});

	uploadParams.Body = fileStream;
	uploadParams.Key = "profile_pic/" + new Date().getTime()+imageFile.originalname;
	var uploadPromise = s3.upload(uploadParams).promise()
	return uploadPromise
		.then(data => ({code: 'SUCCESSFUL_UPLOAD_TO_S3', profileImageUrl: data.Location}))
		.catch(err => ({code: 'FAILED_TO_UPLOAD_TO_S3', message:'failed to upload to s3'}))
}

exports.uploadImageToS3 = (imageFile) => {
	logger.info("uploadImageToS3");
	logger.info(imageFile.originalname);

	if (checkIfBucketExists) {
		return uploadImageToS3(imageFile)
	} else {
		logger.info('Bucket do not exist') 
	}
}