const mongoose = require("mongoose");
const mongoosastic = require("../mongoosastic/lib/mongoosastic");
const stringUtils = require("underscore.string");
const Schema = mongoose.Schema;
var crypto = require('crypto');
mongoose.pluralize(null);

const KnowledgeBase = new Schema({
    status: { type: String, lowercase: true },
    type: { type: String, lowercase: true },
    category: { type: String, lowercase: true },
    referenceId: { type: Number },
    applicationId: { type: String, es_indexed: true },
    userName: { type: String },
    key: { type: String },
    name: { type: String, es_indexed: true },
    content: { type: String, es_indexed: true },
    deleted: { type: String, default: false },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() }
});
KnowledgeBase.pre('save', async function (next) {
    let question = this.name ? this.name.trim() : null;
    if (!stringUtils.isBlank(question)) {
        question = question.replace(/\?/g, '');
        this.key = crypto.createHash('md5').update(question).digest('hex');
    }
    next();
});

KnowledgeBase.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.key;
    delete obj._id;
    return obj;
}
KnowledgeBase.plugin(mongoosastic, {
    hosts: ["https://search-test-elastic-search-znmhne4j4ysxfsyvcfltyckjve.us-east-1.es.amazonaws.com/"],
    index: 'knowledgebase_copy'
});

const KnowledgeBaseModel = mongoose.model("knowledgebase_copy", KnowledgeBase);
var stream = KnowledgeBaseModel.synchronize()
var count = 0;

stream.on('data', function (err, doc) {
    count++;
});
stream.on('close', function () {
    console.log('indexed ' + count + ' documents!');
});
stream.on('error', function (err) {
    console.log("migration error", err);
});

KnowledgeBaseModel.createMapping(function (err, mapping) {
    if (err) {
        console.log('error creating mapping (you can safely ignore this)');
        console.log(err);
    } else {
        console.log('mapping created!');
        console.log(mapping);
    }
});


exports.KnowledgeBaseModel = KnowledgeBaseModel;