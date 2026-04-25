const musicModel = require("../models/music.models");
const jwt = require("jsonwebtoken");
const {uploadFile} = require("../service/storage.service");
const albumModel = require("../models/album.model");
const asyncHandler = require("../utils/asyncHandler");

const createMusic = asyncHandler(async (req, res) => {
    const {title, genre} = req.body;
    if(!req.file){
      return res.status(400).json({message: "Music file is required"});
    }
    const file = req.file;
    const result = await uploadFile(file.buffer.toString('base64'));

    const music = await musicModel.create({
      uri: result.url,
      title,
      genre,
      artist :req.user.id,
      source: 'upload',
      status: 'pending',
    })
    res.status(201).json({
      message:"Music created successfully",
      music:{
        id:music._id,
        uri: music.uri,
        title: music.title,
        artist: music.artist,
        genre: music.genre,
        source: music.source,
        status: music.status,
      }
    })
});

const createAlbum = asyncHandler(async (req, res) => {
    const { title, musicIds } = req.body;
    const album = await albumModel.create({
      title,
      artist: req.user.id,
      musics: musicIds
    })
    res.status(201).json({
      message:"Album created Successfully!!",
      album:{
        id: album._id,
        title: album.title,
        artist : album.artist,
        musics: album.musics,
      }
    })
});


const getAllMusics = asyncHandler(async (req, res) => {
  const musics = await musicModel.find({status: 'approved'}).populate("artist","username email").sort({createdAt: -1});

  res.status(200).json({
    message:"Musics fetched successfully",
    musics: musics
  })
});

const incrementPlay = asyncHandler(async (req, res) => {
  const{id} = req.params;
  const music = await musicModel.findByIdAndUpdate(id, {$inc: {plays: 1}}, {new: true});
  res.status(200).json({
    message:"Play count incremented successfully",
    music: music
  })
});

const likeSong = asyncHandler(async (req, res) => {
  const {id} = req.params;
  const music = await musicModel.findByIdAndUpdate(id, {$inc: {likes: 1}}, {new: true});
  
  res.status(200).json({
    message:"Like count incremented successfully",
    music: music
  })
});


async function getAllAlbums(req,res){
  const albums = await albumModel.find().select("title artist").populate("artist","username email").populate("musics");
  res.status(200).json({
    message:"Albums fetched Successfully",
    albums : albums
  })
}

async function getAlbumById(req,res){
  const albumId = req.params.albumId;
  const album = await albumModel.findById(albumId).populate("artist", "username email").populate("musics");
  return res.status(200).json({
    message:"Album fetched successfully",
    album : album,
})
}

const getMusicByGenre = asyncHandler(async (req, res) => {
  const { genre } = req.query;

  const musics = await musicModel.find({
    genre,
    status: "approved"
  });

  res.status(200).json(musics);
});
module.exports = {createMusic, createAlbum,getAllMusics,getAllAlbums,getAlbumById,getMusicByGenre, incrementPlay, likeSong};