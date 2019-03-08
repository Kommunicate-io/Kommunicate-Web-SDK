const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {COLLECTIONS} = require("../mongodb/collections");

const CounterSchema = new Schema({
    _id:{type:String, required: true},
    sequence_value:{type:Number}
})
const Counter = mongoose.model(COLLECTIONS.COUNTER, CounterSchema);

exports.getNextCount = (collectionName, fieldName) => {
    return Counter.findOneAndUpdate({ _id: collectionName + "_" + fieldName }, { $inc: { sequence_value: 1 } }).then(counter=>{
        return counter.sequence_value;
    });
}