const feedbackRouter = require("express").Router();
const { errorHandler } = require("../Error/errorHandler");
const validate = require("express-validation");
const requestValidator = require("./feedbackValidator");
const feedbackService = require("./feedbackService");



feedbackRouter.post(
    "/",
    validate(requestValidator.createFeedValidation),
    (req, res) => {
        return feedbackService
            .createOrUpdateFeedBack(req.body)
            .then(result => {
                return res.status(200).json({ code: "SUCCESS", data: result });
            })
            .catch(error => {
                return errorHandler(req, res, error);
            });
    }
);

feedbackRouter.get(
    "/:groupId",
    validate(requestValidator.getFeedValidation),
    (req, res) => {
        let groupId = req.params.groupId;
        return feedbackService
            .getFeedback(groupId)
            .then(result => {
                return res.status(200).json({ code: "SUCCESS", data: result });
            })
            .catch(error => {
                return errorHandler(req, res, error);
            });
    }
);

feedbackRouter.delete(
    "/:groupId",
    validate(requestValidator.getFeedValidation),
    (req, res) => {
        let groupId = req.params.groupId;
        return feedbackService
            .deleteFeedback(groupId)
            .then(result => {
                return res.status(200).json({ code: "SUCCESS", message: "deleted" });
            })
            .catch(error => {
                return errorHandler(req, res, error);
            });
    }
);


exports.feedbackRouter = feedbackRouter;
