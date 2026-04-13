const musicModel = require("../models/music.models");
const jwt = require("jsonwebtoken");
const {uploadFile} = require("../service/storage.service");
async function createMusic(req,res){
    const token = req.cookies.token;
    if(!token){
      return res.status(401).json({
        message:"Unauthorized"
      });   
    } 
    try{
     const decoded =  jwt.verify(token,process.env.JWT_SECRET)
     if(decoded.role !== "artist"){
      return res.status(403).json({message: "You don't have access to create a music"})
     }



    }catch(err){
        return res.status(401).json({message:"Unauthorized"});
    }

    const {title} = req.body;
    const file = req.file;
    const result = await uploadFile(file.buffer.toString('base64'));

    const music = await musicModel.create({
      uri: result.url,
      title,
      artist : decoded.io
    })
    res.status(201).json({
      message:"Music created successfully",
      music:{
        if:music._id,
        uri: music.uri,
        title: music.title,
        artist: music.artist,
      }
    })
};

module.exports = {createMusic};