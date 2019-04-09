
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.pluralize(null);
const faqCategory = new Schema({
    applicationId: {
        type: String
    },
    name: {
        type: String
    },
    type: {
        type: Number
    },
    articleCount: {
        type: Number
    },
    deleted: { 
        type: Boolean, 
        default: false
    },
});
faqCategory.methods.toJSON = function () {
    var obj = this.toObject();
    obj.id =obj._id;
    delete obj._id;
    delete obj.__v;
    return obj;
} 

exports.faqCategoryModel = mongoose.model('faqCategory', faqCategory)