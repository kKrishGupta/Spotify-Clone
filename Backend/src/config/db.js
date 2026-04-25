const mongoose = require('mongoose');
const { MONGO_URI } = require('./env');
async function connectDB(){
  try{
    await  mongoose.connect(MONGO_URI);
    console.log('DataBase connect successfully');
  }catch(err){
    console.error('Database connection error' , err);
  }
}
module.exports = connectDB;