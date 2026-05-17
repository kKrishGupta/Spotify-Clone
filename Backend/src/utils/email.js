const nodemailer =
  require("nodemailer");

const logger =
  require("../config/logger");

/* =========================================
   🚀 SMTP TRANSPORTER
========================================= */

const transporter =
  nodemailer.createTransport({

    host:
      process.env.EMAIL_HOST ||
      "smtp.gmail.com",

    port:
      Number(
        process.env.EMAIL_PORT
      ) || 587,

    secure: false,

    auth: {

      user:
        process.env.EMAIL_USER,

      pass:
        process.env.EMAIL_PASS,
    },

    tls: {
      rejectUnauthorized:
        false,
    },
  });

/* =========================================
   🚀 VERIFY SMTP
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

/* =========================================
   🎨 UNIVERSAL EMAIL TEMPLATE
========================================= */

const buildTemplate = ({
  title,
  subtitle,
  code,
}) => {

  return `
  <!DOCTYPE html>
  <html>

  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />

    <title>${title}</title>
  </head>

  <body style="
    margin:0;
    padding:0;
    background:#0f172a;
    font-family:
      Inter,
      Arial,
      sans-serif;
  ">

    <!-- OUTER WRAPPER -->
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
      style="
        background:
          linear-gradient(
            135deg,
            #0f172a 0%,
            #111827 40%,
            #020617 100%
          );
        padding:40px 20px;
      "
    >
      <tr>
        <td align="center">

          <!-- MAIN CARD -->
          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="
              max-width:620px;
              background:#ffffff;
              border-radius:28px;
              overflow:hidden;
              box-shadow:
                0 20px 60px rgba(0,0,0,0.45);
            "
          >

            <!-- HERO SECTION -->
            <tr>
              <td
                align="center"
                style="
                  padding:55px 40px;
                  background:
                    linear-gradient(
                      135deg,
                      #1db954 0%,
                      #16a34a 100%
                    );
                  position:relative;
                "
              >

                <div style="
                  width:82px;
                  height:82px;
                  border-radius:50%;
                  background:rgba(255,255,255,0.15);
                  display:flex;
                  align-items:center;
                  justify-content:center;
                  margin:0 auto 22px auto;
                  font-size:38px;
                  color:#ffffff;
                  backdrop-filter:blur(10px);
                ">
                  🎵
                </div>

                <h1 style="
                  margin:0;
                  color:#ffffff;
                  font-size:34px;
                  font-weight:800;
                  letter-spacing:-1px;
                ">
                  Music Intelligence
                </h1>

                <p style="
                  margin-top:14px;
                  margin-bottom:0;
                  color:rgba(255,255,255,0.88);
                  font-size:16px;
                  line-height:1.6;
                  max-width:440px;
                ">
                  AI-powered music platform with
                  realtime streaming,
                  intelligent recommendations,
                  and secure authentication.
                </p>

              </td>
            </tr>

            <!-- CONTENT -->
            <tr>
              <td style="
                padding:50px 42px;
              ">

                <h2 style="
                  margin:0 0 18px 0;
                  color:#0f172a;
                  font-size:30px;
                  font-weight:800;
                  letter-spacing:-0.5px;
                ">
                  ${title}
                </h2>

                <p style="
                  margin:0;
                  color:#475569;
                  font-size:16px;
                  line-height:1.8;
                ">
                  ${subtitle}
                </p>

                <!-- OTP BLOCK -->
                <div style="
                  margin:42px 0;
                  text-align:center;
                ">

                  <div style="
                    display:inline-block;
                    background:
                      linear-gradient(
                        135deg,
                        #f8fafc 0%,
                        #e2e8f0 100%
                      );
                    border:1px solid #e2e8f0;
                    border-radius:24px;
                    padding:28px 38px;
                    box-shadow:
                      inset 0 1px 0 rgba(255,255,255,0.7),
                      0 8px 25px rgba(15,23,42,0.08);
                  ">

                    <div style="
                      color:#64748b;
                      font-size:13px;
                      font-weight:700;
                      letter-spacing:2px;
                      text-transform:uppercase;
                      margin-bottom:16px;
                    ">
                      One Time Password
                    </div>

                    <div style="
                      font-size:42px;
                      font-weight:900;
                      letter-spacing:12px;
                      color:#1db954;
                      line-height:1;
                    ">
                      ${code}
                    </div>

                  </div>

                </div>

                <!-- SECURITY INFO -->
                <table
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  style="
                    background:#f8fafc;
                    border-radius:20px;
                    padding:22px;
                    border:1px solid #e2e8f0;
                  "
                >

                  <tr>

                    <td
                      width="42"
                      valign="top"
                    >
                      <div style="
                        width:42px;
                        height:42px;
                        border-radius:12px;
                        background:#dcfce7;
                        text-align:center;
                        line-height:42px;
                        font-size:20px;
                      ">
                        🔐
                      </div>
                    </td>

                    <td
                      valign="top"
                      style="
                        padding-left:16px;
                      "
                    >

                      <div style="
                        font-size:15px;
                        font-weight:700;
                        color:#0f172a;
                        margin-bottom:8px;
                      ">
                        Secure Authentication
                      </div>

                      <div style="
                        color:#64748b;
                        font-size:14px;
                        line-height:1.7;
                      ">
                        This OTP expires in
                        <strong>
                          10 minutes
                        </strong>
                        and can only be used once.
                        Never share this code with anyone.
                      </div>

                    </td>

                  </tr>

                </table>

                <!-- DIVIDER -->
                <div style="
                  height:1px;
                  background:#e2e8f0;
                  margin:42px 0 28px 0;
                "></div>

                <!-- FOOTER -->
                <p style="
                  margin:0;
                  color:#94a3b8;
                  font-size:13px;
                  line-height:1.8;
                  text-align:center;
                ">
                  If you didn’t request this email,
                  you can safely ignore it.
                  <br /><br />
                  © ${new Date().getFullYear()}
                  Music Intelligence Platform.
                  All rights reserved.
                </p>

              </td>
            </tr>

          </table>

          <!-- BOTTOM TEXT -->
          <div style="
            margin-top:22px;
            color:rgba(255,255,255,0.5);
            font-size:12px;
            text-align:center;
            line-height:1.8;
          ">
            Built with scalable realtime infrastructure,
            AI recommendation systems,
            and enterprise-grade security.
          </div>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
};

/* =========================================
   🚀 GENERIC EMAIL SENDER
========================================= */
const sendMail =
  async ({
    to,
    subject,
    html,
  }) => {

    try {

      const info =
        await transporter.sendMail({

          from:
            process.env.MAIL_FROM,

          to,

          subject,

          html,
        });

      logger.info({
        message:
          "Email sent successfully",

        messageId:
          info.messageId,

        to,
      });

      console.log(
        "📧 Email sent:",
        info.messageId
      );

      return {
        success: true,

        messageId:
          info.messageId,
      };

    } catch (error) {

      logger.error({
        message:
          "Email sending failed",

        error:
          error.message,
      });

      console.error(
        "❌ SMTP error:",
        error
      );

      throw new Error(
        error.message ||
        "Email sending failed"
      );
    }
  };

/* =========================================
   📧 EMAIL VERIFICATION
========================================= */

const sendVerificationEmail =
  async (
    email,
    otp
  ) => {

    return await sendMail({

      to: email,

      subject:
        "Verify your email",

      html:
        buildTemplate({

          title:
            "Verify Your Email",

          subtitle:
            "Enter this OTP to verify your account",

          code:
            otp,
        }),
    });
  };

/* =========================================
   🔐 LOGIN OTP EMAIL
========================================= */

const sendLoginOtpEmail =
  async (
    email,
    otp
  ) => {

    return await sendMail({

      to: email,

      subject:
        "Login OTP",

      html:
        buildTemplate({

          title:
            "Login to Your Account",

          subtitle:
            "Use this OTP to login securely",

          code:
            otp,
        }),
    });
  };

module.exports = {
  sendMail,
  sendVerificationEmail,
  sendLoginOtpEmail,
};