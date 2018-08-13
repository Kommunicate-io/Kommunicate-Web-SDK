/* eslint-disable */
var  config = require("../../conf/config.js");
const mongoClient = require("mongodb").MongoClient;
const mongoURL = config.getProperties().mongoDbUrl;
const mongoConfig = config.mongoConfig;
const logger = require("../utils/logger");

const DEFAULT_SCHEMA ="kommunicate";
let db =null;

const getDb = (dbUrl, callback) => {
    return new Promise((resolve,reject)=>{
        if (db) {
            logger.info("returning cached db object");
            return typeof callback == 'function'? callback(null, db) :  resolve(db);
        } else {
            logger.info("crerating a new connection to db..");
            mongoClient.connect(dbUrl, mongoConfig).then((dbObj)=>{
                logger.info("connected to dbsuccessfully");
                db = dbObj;
                return typeof callback == 'function'? callback(null,db):resolve(db);
            }).catch(err=>{
                logger.info("error while connecting to db..",err);
                return typeof callback == 'function'? callback(err):reject(err);
            });
        
        }

    })
    
}
exports.getDb =getDb;

/**
 * return a next value for a autoincremented filed.
 * @param {String} collectionName collection name where document belongs 
 * @param {fieldName} fieldName attribute name for which auto incremented value needed. 
 */
exports.getNextSequence = (collectionName,fieldName)=>{
    logger.info("fetching next sequence for: ",fieldName," in: ",collectionName); 
    return new Promise((resolve,reject)=>{
        getDb(mongoURL,(err,client)=>{
            if(err){
                logger.info("error while connecting to db: "+mongoURL,err);
                return reject(err);
            }else{
                var db = client.db(DEFAULT_SCHEMA);
                return db.collection("counter").findOneAndUpdate(
                    {_id: collectionName+"_"+fieldName },
                    {$inc:{sequence_value:1}},
                    {returnOriginal:false}).then(sequenceDocument=>{
                        return resolve(sequenceDocument.value.sequence_value);
                    });
                 
            }
    
        });
      
    });
}

/**
 * this method insert a record in mongo db and return a promise.
 * @param {string} collectionName
 * @param {object} document 
 */
exports.insertOne =(collectionName, document)=>{
    //console.log("db",db);
    logger.info("inserting new record in collection", collectionName); 
    return new Promise((resolve,reject)=>{
        getDb(mongoURL,(err,client)=>{
            if(err){
                logger.info("error while connecting to db: "+mongoURL,err);
                return reject(err);
            }else{
                var db = client.db(DEFAULT_SCHEMA);
                db.collection(collectionName).insertOne(document).then(result=>{
                    logger.info(" record created successfully ");
                    return resolve(result.ops[0]);
                });
            }
    
        });
        
    });
		
}
/**
 * perform a free text search on faq collection.
 * display the result in sorted by matching score. priority is given to the title.
 * @param {Object }options
 * @param {string }options.appId
 * @param {String} options.text
 * @param {String} options.collectionName
 * 
 */
exports.searchFAQ=(options)=>{
    logger.info("searching faq in mongo db");
    return new Promise((resolve,reject)=>{
        getDb(mongoURL,(err,client)=>{
            if(err){
                logger.info("error while connecting to db: "+mongoURL,err);
                return reject(err);
            }else{
                var db = client.db(DEFAULT_SCHEMA);
                db.collection(options.collectionName).aggregate([{$match:{$text: { $search: options.text },applicationId:options.appId,status:"published",type:"faq"}},
                    { $sort: { score: { $meta: "textScore" } } },
                    {$project:{name:1,content:1,referenceId:1,id:1,_id:0}}
                ],function(err,result){
                    if (err)return reject(err);
                    logger.info(" got data from db ");
                    return resolve(result?result.toArray():[]);
                });
            }
    
        });
        
    });

}

/**
 * excute the given query on the given collection. if no query is passed it will return all documents in the given collection;
 * @param {object} options
 * @param {string} options.collectionName
 * @param {object} options.query
 * @param {object} options.options
 */
 exports.find= (options)=>{
    return new Promise((resolve,reject)=>{
        logger.info("fetching records from collection "+options.collectionName);
        getDb(mongoURL).then(client=>{
            var db = client.db(DEFAULT_SCHEMA);
            return db.collection(options.collectionName).find(options.query,options.options).toArray(function(err,data){
                if(err){
                    return reject(err);
                }
                logger.info("fetchec data from db");
                return resolve(data);

            })
        })
      
    })
}

    /**
     * this method updates a document selected by selector.
     * @param {object} options
     * @param {string} options.collectionName, selector, update, options
     * @param {Object} options.criteria  criteria to update a object  
     * @param {Object} options.update   values to be updated
     * @param {Object} options.options  options
     */
   exports.updateOne = (options)=>{
        return new Promise((resolve,reject)=>{
            if (!options.collectionName) {
                return reject(new Error("collection name can't be null"));
              } else {
                getDb(mongoURL, function(err, client) {
                  if (err) {
                    logger.info("error while connecting to db: " + mongoURL, err);
                    return reject(err);
                  } else {
                    var db = client.db(DEFAULT_SCHEMA);
                    db.collection(options.collectionName).updateOne(options.criteria, { $set: options.update }, options.options,(err,updateResult)=>{
                        return err? reject(err):resolve(updateResult.result);
                    });
                  }
                });
              }

        });
       
    }
      /**
     * this method updates a document selected by selector.
     * @param {object} options
     * @param {string} options.collectionName, selector, update, options
     * @param {Object} options.criteria  criteria to update a object 
     */ 

    exports.deleteOne=(options)=>{
        return new Promise((resolve,reject)=>{
            if (!options.collectionName) {
                return reject(new Error("collection name can't be null"));
              } else {
                getDb(mongoURL, function(err, client) {
                  if (err) {
                    logger.info("error while connecting to db: " + mongoURL, err);
                    return reject(err);
                  } else {
                    var db = client.db(DEFAULT_SCHEMA);
                    db.collection(options.collectionName).deleteOne(options.criteria,(err,deleteResult)=>{
                        return err? reject(err):resolve(deleteResult);
                    });
                  }
                });
              }

        });

    }
