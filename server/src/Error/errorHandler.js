const {ERROR} = require('./error');

/**
 * 
 * @param {Object} req Http request
 * @param {Object} res Http request
 * @param {Object} error error object
 */
const errorHandler = async function (req, res, error) {
    console.log(`error for api: ${req.originalUrl} error: ${error} `);
    let kommunicateError = ERROR.INTERNAL_SERVER_ERROR
    if (error && ERROR[error.code]) {
        kommunicateError = ERROR[error.code];
    }
    return res.status(kommunicateError.status).json({ code: kommunicateError.code, message: kommunicateError.message });
}
exports.errorHandler = errorHandler;