const mongoose = require('mongoose');
const config = require('../../conf/config').getProperties();  

class Database {
  constructor() {
    this._connect()
  }
_connect() {
     return mongoose.connect(`${config.mongoDbUrl}`,{
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false
    })
       .then((res) => {
         console.log('Database connection successful')
         return res;
       })
       .catch(err => {
         console.error('Database connection error')
         return;
       })
  }
}
module.exports = new Database()