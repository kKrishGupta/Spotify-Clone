const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
  uri:{
    type: String,
    required:true
  },
  title:{
    type:String,
    required: true
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  genre:{
    type: String,
    default: "Unknown"
  },
  plays:{
    type: Number,
    default: 0
  },
  likes:{
    type: Number,
    default: 0
  },
  status:{
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  source:{
    type: String,
    enum: ['upload', 'api'],
    default: 'upload'
  }
},{timestamps:true});

const musicModel = mongoose.model("music" , musicSchema);
module.exports = musicModel;