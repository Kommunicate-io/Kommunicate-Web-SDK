const mongoose = require("mongoose");
const mongoosastic = require("mongoosastic");//../mongoosastic/lib/
const stringUtils = require("underscore.string");
const Schema = mongoose.Schema;
const {COLLECTIONS} = require("../mongodb/collections");
const config = require('../../conf/config').getProperties();
var crypto = require('crypto');
mongoose.pluralize(null);

const KnowledgeBase = new Schema({
    id:{
        type:Number,
        unique:true
    },
    status: {
        type: String, 
        lowercase: true, 
        es_type:'text',
        es_indexed: true,
        es_index_analyzer:'keyword'
    },
    type: { 
        type: String, 
        lowercase: true, 
        es_type:'text',
        es_indexed: true,
        es_index_analyzer:'keyword'
    },
    category: { 
        type: String, 
        lowercase: true, 
        es_type:'text',
        es_indexed: true,
        es_index_analyzer:'keyword' 
    },
    referenceId: { 
        type: Number, 
        es_type:'integer',
        es_indexed: true,
        es_index_analyzer:'keyword'
    },
    applicationId: { 
        type: String, 
        es_type:'text', 
        es_indexed: true,
        es_index_analyzer:'keyword'
    },
    userName: { 
        type: String 
    },
    key: { 
        type: String, 
        es_type:'text'
    },
    name: { 
        type: String, 
        es_type:'text', 
        es_indexed: true 
    },
    content: { 
        type: String, 
        es_type:'text', 
        es_indexed: true 
    },
    deleted: { 
        type: String, 
        default: false,
        es_indexed: true,
        es_index_analyzer:'keyword'
    },
    created_at: { 
        type: Number, 
        default: new Date().getTime(), 
        es_type:'date'
    },
    updated_at: { 
        type: Number, 
        default: new Date().getTime(), 
        es_type:'date' 
    }
});
KnowledgeBase.pre('save', function (next) {
    let question = this.name ? this.name.trim() : null;
    if (!stringUtils.isBlank(question)) {
        question = question.replace(/\?/g, '');
        this.key = crypto.createHash('md5').update(question).digest('hex');
    }
    next();
});
KnowledgeBase.pre('updateOne', function (next) {
    this._update.updated_at = new Date().getTime();
    let question = this.name ? this.name.trim() : null;
    if (!stringUtils.isBlank(question)) {
        question = question.replace(/\?/g, '');
        this._update.key = crypto.createHash('md5').update(question).digest('hex');
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
    hosts: [config.esClientUrl],
    index: COLLECTIONS.KNOWLEDGE_BASE,
    type:"_doc"
});

const KnowledgeBaseModel = mongoose.model(COLLECTIONS.KNOWLEDGE_BASE, KnowledgeBase);
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