const nodemailer =
  require("nodemailer");

const logger =
  require("./logger");

/* =========================================
   🚀 GMAIL SMTP TRANSPORT
========================================= */

const transporter =
  nodemailer.createTransport({

    host:
      process.env.EMAIL_HOST,

    port:
      Number(
        process.env.EMAIL_PORT
      ),

    secure: false,

    auth: {

      user:
        process.env.EMAIL_USER,

      pass:
        process.env.EMAIL_PASS,
    },
  });

/* =========================================
   🚀 VERIFY CONNECTION
========================================= */

transporter.verify(
  (
    err,
    success
  ) => {

    if (err) {

      logger.error({
        message:
          "SMTP connection failed",

        error:
          err.message,
      });

    } else {

      logger.info({
        message:
          "SMTP server ready",
      });
    }
  }
);

module.exports =
  transporter;