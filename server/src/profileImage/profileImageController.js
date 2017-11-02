const uploadProfileImageService = require('./profileImageService')

exports.uploadImageToS3 = (req, res) => {

	console.log(req)
	console.log("Here is the file")
	console.log(req.file)
	// console.log(req.file.originalname)

	// console.log(uploadProfileImageService.uploadImageToS3(req.file));

	uploadProfileImageService.uploadImageToS3(req.file)
	.then(response => {
		console.log(response) 
		if(response.code === 'SUCCESSFUL_UPLOAD_TO_S3'){
			res.status(200).json({
				code: response.code,
				message:'Successfully uploaded to s3',
				profileImageUrl: response.profileImageUrl
			})
		} else if(response.code === 'FAILED_TO_UPLOAD_TO_S3') {
			res.status(500).json({
				code: 'FAILED_TO_UPLOAD_TO_S3',
				message:'Failed to upload to s3'
			})	
		}
	});

	// res.status(200).json({code:"uploadProfileImageController"})
}