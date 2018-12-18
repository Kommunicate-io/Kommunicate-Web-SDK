const HazelcastClient = require('hazelcast-client').Client;
const Config = require('hazelcast-client').Config;
let clientConfig = new Config.ClientConfig();
const config = require("../../conf/config.js");

clientConfig.networkConfig.addresses = [{host: config.getProperties().cache.hazelCache.url, port: config.getProperties().cache.hazelCache.port}];
clientConfig.groupConfig.name="dev";
clientConfig.groupConfig.password="dev";
let client =null;
const logger = require("../utils/logger");


 exports.initializeClient= ()=>{
     // dont throw exception even if not connected to hazel cache.
    return HazelcastClient.newHazelcastClient(clientConfig).then(hazelcastClient=>{
        console.log("connected to hazel cache client at address",config.getProperties().cache.hazelCache.url );
        client = hazelcastClient;
        return hazelcastClient;
    }).catch(err=>{
        console.log("err while initializing hazelCache client",err);
        return null;
    });
};

exports.getClientInstanse = ()=> {
    // cache client is initized while server start up, returning cache client;
    return client;
};

exports.getDataFromMap= (mapPrefix,key)=> {
    if(client) {
        return Promise.resolve(client.getMap(mapPrefix)).then(map=> {
            return map.get(key);
        });
    }else{
        logger.info("cache client is null, returning null");
        return Promise.resolve(null);
    }
};

exports.setDataIntoMap= (mapPrefix,key,value,expiryTime)=> {
    if(client) {
        return Promise.resolve(client.getMap(mapPrefix)).then(map=> {
            return map.put(key,value).then(oldValue=> {
                console.log( mapPrefix," updated for Key ",key ,"new value :",value," old value :", oldValue);
                return oldValue;
            });
        });
    }else{
        return null;
    };
};

exports.deleteDataFromMap=(mapPrefix,key)=>{
    if(client) {
        return Promise.resolve(client.getMap(mapPrefix)).then(map=> {
            return map.delete(key).then(data=> {
                console.log( "data from cache", data);
                return data;
            });
        }).catch(e=>{
            logger.info("error while deleting data from cache",e );
        });
    }else{
        return null;
    };

}
