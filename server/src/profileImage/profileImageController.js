const uploadProfileImageService = require('./profileImageService')
var path = require("path");
var fs = require('fs');
exports.uploadImageToS3 = (req, res) => {

	if(!req.file){
		res.status(403).json({
			code: 'FAILED_TO_UPLOAD_TO_S3',
			message: 'Image file missing in the request'
		})
	}

	uploadProfileImageService.uploadImageToS3(req.file)
	.then(response => {
		console.log(response) 
		
		if(response.code === 'SUCCESSFUL_UPLOAD_TO_S3'){
			res.status(200).json({
				code: response.code,
				message:'Successfully uploaded',
				profileImageUrl: response.profileImageUrl
			})
		} else if(response.code === 'FAILED_TO_UPLOAD_TO_S3') {
			res.status(500).json({
				code: 'FAILED_TO_UPLOAD_TO_S3',
				message:'Failed to upload'
			})	
		}
		var filePath=path.join(__dirname,'../../../uploads/'+req.file.filename)
		fs.unlink(filePath);
	}).catch(err=>{
		console.log('uploading error',err)
	});

}