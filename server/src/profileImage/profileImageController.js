// const uploadProfileImageService = require('./uploadProfileImageService')

exports.uploadImageToS3 = (req, res) => {

	console.log(req)

	res.status(200).json({code:"uploadProfileImageController"})
}