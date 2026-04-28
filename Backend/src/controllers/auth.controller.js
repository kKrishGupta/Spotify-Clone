  const userModel = require('../models/user.model');
  const jwt = require('jsonwebtoken');
  const bcrypt = require('bcryptjs');
  const asyncHandler = require('../utils/asyncHandler');
  
  async function registerUser(req,res){
    console.log("routes hit");
    const {username, email, password, role = "user"} = req.body;
    const isUserAlreadyExist = await userModel.findOne({
      $or:[
        {username},
        {email}
      ]
    })
    if(isUserAlreadyExist){
      return res.status(409).json({message:"User already exists"})
    }

    const hash = await bcrypt.hash(password,10); 

    const user = await userModel.create({
      username,email,password: hash,role
    });
    const token = jwt.sign({
      id: user._id,
      role: user.role,
    },process.env.JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "lax",
    });
    res.status(201).json({
      message: "user registered successfully",
      user:{
        id: user._id,
        username: user.username,
        email: user.email,
        role:user.role
      }
    })

  }
  // async function loginUser (req,res){
  //   const {username, email,password} = req.body;
  //   const user = await userModel.findOne({
  //     $or:[
  //       {username},
  //       {email}
  //     ]
  //   })
  //   if(!user){
  //     return res.status(401).json({message: "Invalid credentials"});
  //   }

  //   const isPasswordValid = await bcrypt.compare(password,user.password);

  //   if(!isPasswordValid){
  //     return res.status(401).json({message: "Invalid credentials"});
  //   }
  //   const token = jwt.sign({
  //     id:user._id,
  //     role: user.role,
  //   },process.env.JWT_SECRET);

  //   res.cookie("token" , token);
  //   res.status(200).json({
  //     message: "User logged in successfully",
  //     user:{
  //       id:user._id,
  //       username : user.username,
  //       email:user.email,
  //       role:user.role,
  //     }
  //   })
  // }

  async function loginUser(req, res) {
  const { username, email, password } = req.body;

  const query = [];

  if (username) query.push({ username });
  if (email) query.push({ email });

  const user = await userModel.findOne({ $or: query });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET
  );

  res.cookie("token", token, {
  httpOnly: true,
  secure: false, // true in production (HTTPS)
  sameSite: "lax",
});

  res.status(200).json({
    message: "User logged in successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
}

  async function logoutUser(req,res){
    res.clearCookie("token")
    res.status(200).json({message:"user logged out successfully"});
  }
 
 async function getCurrentUser(req, res) {
  res.status(200).json({
    user: req.user,
  });
}

 module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser
};