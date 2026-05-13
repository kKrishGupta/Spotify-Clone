const ImageKit =
  require("imagekit");

const AppError =
  require("../utils/AppError");

const logger =
  require("../config/logger");

let imageKitClient;

/* =========================================
   🚀 GET IMAGEKIT CLIENT
========================================= */

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

    if (
      !imageKitClient
    ) {

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

/* =========================================
   🚀 PROVIDER TIMEOUT
========================================= */

const withTimeout =
  (
    promise,
    ms = 30000
  ) => {

    return Promise.race([

      promise,

      new Promise(
        (
          _,
          reject
        ) =>

          setTimeout(
            () =>

              reject(
                new Error(
                  "Upload timeout"
                )
              ),

            ms
          )
      ),
    ]);
  };

/* =========================================
   🚀 UPLOAD FILE
========================================= */

const uploadFile =
  async (
    file,
    options = {}
  ) => {

    if (!file) {

      throw new AppError(
        "File is required",
        400
      );
    }

    const fileName =
      options.fileName ||

      `music_${Date.now()}`;

    const folder =
      options.folder ||
      "/spotify_clone";

    const retries =
      Number(
        process.env
          .UPLOAD_RETRIES || 3
      );

    let lastError;

    /* =====================================
       🔁 RETRY SYSTEM
    ===================================== */

    for (
      let attempt = 1;
      attempt <= retries;
      attempt++
    ) {

      try {

        logger.info({
          message:
            "Uploading file to ImageKit",

          attempt,

          fileName,
        });

        const startedAt =
          Date.now();

        const result =
          await withTimeout(

            getImageKitClient()
              .upload({

                file,

                fileName,

                folder,
              }),

            30000
          );

        logger.info({
          message:
            "File uploaded successfully",

          fileId:
            result.fileId,

          url:
            result.url,

          uploadDurationMs:
            Date.now() -
            startedAt,

          attempt,
        });

        return result;

      } catch (err) {

        lastError =
          err;

        logger.warn({
          message:
            "ImageKit upload attempt failed",

          attempt,

          fileName,

          error:
            err.message,
        });

        // ⏳ Exponential delay
        await new Promise(
          (
            resolve
          ) =>

            setTimeout(
              resolve,

              attempt *
                2000
            )
        );
      }
    }

    /* =====================================
       ❌ FINAL FAILURE
    ===================================== */

    logger.error({
      message:
        "ImageKit upload failed permanently",

      fileName,

      error:
        lastError?.message,
    });

    throw new AppError(
      `File upload failed: ${lastError?.message}`,
      500
    );
  };

module.exports = {
  uploadFile,
};