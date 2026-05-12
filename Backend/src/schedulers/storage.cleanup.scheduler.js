const cron =
  require("node-cron");

const fs =
  require("fs/promises");

const path =
  require("path");

const logger =
  require("../config/logger");

cron.schedule(
  "0 3 * * *",

  async () => {

    try {

      const tempDir =
        path.join(
          "uploads",
          "temp"
        );

      const files =
        await fs.readdir(
          tempDir
        );

      const now =
        Date.now();

      for (const file of files) {

        const filePath =
          path.join(
            tempDir,
            file
          );

        const stat =
          await fs.stat(
            filePath
          );

        const age =
          now -
          stat.mtimeMs;

        if (
          age >
          24 *
            60 *
            60 *
            1000
        ) {

          await fs.rm(
            filePath,
            {
              recursive:
                true,

              force: true,
            }
          );
        }
      }

      logger.info({
        message:
          "Storage cleanup completed",
      });

    } catch (err) {

      logger.error({
        message:
          "Storage cleanup failed",

        error:
          err.message,
      });
    }
  }
);