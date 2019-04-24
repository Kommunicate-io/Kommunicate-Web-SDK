const mongoose = require("mongoose");
const mongoosastic = require("mongoosastic");
const stringUtils = require("underscore.string");
const Schema = mongoose.Schema;
const {COLLECTIONS} = require("../mongodb/collections");
const config = require('../../conf/config').getProperties();
var crypto = require('crypto');
const hashGenerator = require("./hashGenerator");

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
        es_indexed: true,
        es_type: 'completion',
        es_index_analyzer: 'simple',
        es_search_analyzer: 'simple',
        es_payloads: true
    },
    content: { 
        type: String, 
        es_type: 'completion',
        es_index_analyzer: 'simple',
        es_search_analyzer: 'simple',
        es_payloads: true, 
        es_indexed: true 
    },
    categoryType: {
        type: Number,
    },
    deleted: { 
        type: Boolean, 
        default: false,
        es_type: "boolean",
        es_indexed: true,
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
        this.key = hashGenerator.generateHash(question);
    }
    next();
});
KnowledgeBase.pre('updateOne', function (next) {
    this._update.updated_at = new Date().getTime();
    let question = this._update.name ? this._update.name.trim() : null;
    if (!stringUtils.isBlank(question)) {
        this._update.key = hashGenerator.generateHash(question);
    }
    next();
});

KnowledgeBase.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.key;
    delete obj._id;
    return obj;
}
/**
 * configuration for esClient
 *  
 */
KnowledgeBase.plugin(mongoosastic, {
    hosts: [config.esClientUrl],
    index: COLLECTIONS.KNOWLEDGE_BASE2.toLowerCase(),
    type: "_doc",
    bulk: {
        delay: 30 * 60 * 1000, //30 min
        size: 10,
        batch: 50
    },
    indexAutomatically:true
});

const KnowledgeBaseModel = mongoose.model(COLLECTIONS.KNOWLEDGE_BASE2, KnowledgeBase);
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