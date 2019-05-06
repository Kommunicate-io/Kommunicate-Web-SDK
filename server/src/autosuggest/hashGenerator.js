var crypto = require("crypto");
const stringUtils = require("underscore.string");

const generateHash = message => {
    if (stringUtils.isBlank(message)) {
        return null;
    }
    message = message.trim();
    message = message.replace(/[\W_]+/g, "");
    return crypto
        .createHash("md5")
        .update(message)
        .digest("hex");
};

module.exports = { generateHash };
