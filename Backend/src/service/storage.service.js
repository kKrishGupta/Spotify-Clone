const ImageKit =
  require("imagekit");

const AppError =
  require("../utils/AppError");

const logger =
  require("../utils/logger");

let imageKitClient;

const getImageKitClient =
  () => {
    if (
      !process.env
        .IMAGEKIT_PUBLIC_KEY ||
      !process.env
        .IMAGEKIT_PRIVATE_KEY ||
      !process.env
        .IMAGEKIT_URL_ENDPOINT
    ) {
      throw new AppError(
        "ImageKit configuration missing",
        503
      );
    }

    if (!imageKitClient) {
      imageKitClient =
        new ImageKit({
          publicKey:
            process.env
              .IMAGEKIT_PUBLIC_KEY,

          privateKey:
            process.env
              .IMAGEKIT_PRIVATE_KEY,

          urlEndpoint:
            process.env
              .IMAGEKIT_URL_ENDPOINT,
        });
    }

    return imageKitClient;
  };

const uploadFile =
  async (
    file,
    options = {}
  ) => {
    try {
      const result =
        await Promise.race([
          getImageKitClient().upload(
            {
              file,

              fileName:
                options.fileName ||
                `music_${Date.now()}`,

              folder:
                options.folder ||
                "/spotify_clone",
            }
          ),

          new Promise(
            (_, reject) =>
              setTimeout(
                () =>
                  reject(
                    new Error(
                      "Upload timeout"
                    )
                  ),
                15000
              )
          ),
        ]);

      logger.info({
        message:
          "File uploaded successfully",

        fileId:
          result.fileId,
      });

      return result;
    } catch (err) {
      logger.error({
        message:
          "ImageKit upload failed",

        error:
          err.message,
      });

      throw new AppError(
        "File upload failed",
        500
      );
    }
  };

module.exports = {
  uploadFile,
};