const mongoose = require('mongoose');
const activitySchema = new mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  }, 
  song:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "music",
    required: true
  },
  action:{
    type: String,
    enum: ['play', 'like',"upload"],
    required: true
  }
},{timestamps:true});

module.exports = mongoose.model("activity", activitySchema);