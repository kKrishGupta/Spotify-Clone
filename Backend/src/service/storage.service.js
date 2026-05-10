const { ImageKit } = require("@imagekit/nodejs");
const AppError = require("../utils/AppError");

let imageKitClient;

const getImageKitClient = () => {
  if (!process.env.IMAGEKIT_PRIVATE_KEY) {
    throw new AppError("Storage provider is not configured", 503);
  }

  if (!imageKitClient) {
    imageKitClient = new ImageKit({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    });
  }

  return imageKitClient;
};

async function uploadFile(file, options = {}) {
  const result = await getImageKitClient().files.upload({
    file,
    fileName: options.fileName || `music_${Date.now()}`,
    folder: options.folder || "spotify_clone",
  });

  return result;
}

module.exports = { uploadFile };
