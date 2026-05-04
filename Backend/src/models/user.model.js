const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email:{
    type: String,
    required: true,
    unique : true
  },
  password:{
    type: String,
    required: true,
  },
  role:{
    type: String,
    enum : ['user' , 'artist','admin'],
    default:'user',
  },

  avatar: String,

  followers:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:"user"
    }
  ],
  following:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:"user"
    }
  ],
  likedSongs:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:"music"
    }
  ],

  // 🔐 Refresh token (store hashed ideally)
  refreshToken: {
    type: String,
    default: null,
  },

  // 🔐 EMAIL VERIFICATION (NEW)
  isVerified: {
    type: Boolean,
    default: false,
  },

emailOtp: {
  type: String,
  default: null,
},

emailOtpExpires: {
  type: Date,
  default: null,
},

loginOtp: {
  type: String,
  default: null,
},

loginOtpExpires: {
  type: Date,
  default: null,
},

otpAttempts: {
  type: Number,
  default: 0,
},

otpLastSentAt: {
  type: Date,
  default: null,
},

},{timestamps:true});

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;