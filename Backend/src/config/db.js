const mongoose = require('mongoose');
async function connectDB(){
  try{
    await  mongoose.connect(process.env.MONGO_URI);
    console.log('DataBase connect successfully');
  }catch(err){
    console.error('Database connection error' , err);
  }
}
module.exports = connectDB;