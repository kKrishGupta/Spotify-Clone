const nodemailer = require("nodemailer");

// 🔥 TRANSPORTER (keep yours — it's solid)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 50,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 20000,
});

// 🔍 VERIFY CONNECTION
transporter.verify((error) => {
  if (error) {
    console.error("❌ Email server error:", error.message);
  } else {
    console.log("✅ Email server ready");
  }
});


// 🎨 UNIVERSAL EMAIL TEMPLATE
const buildTemplate = ({ title, subtitle, code }) => {
  return `
  <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:40px;">
    <div style="max-width:500px;margin:auto;background:#ffffff;border-radius:10px;padding:30px;text-align:center;">
      
      <h1 style="color:#1db954;margin-bottom:10px;">🎵 Music App</h1>
      <h2 style="color:#333;">${title}</h2>
      <p style="color:#666;">${subtitle}</p>

      <div style="
        margin:20px 0;
        padding:15px;
        font-size:28px;
        letter-spacing:6px;
        font-weight:bold;
        color:#1db954;
        background:#f1f1f1;
        border-radius:8px;
      ">
        ${code}
      </div>

      <p style="color:#888;font-size:14px;">
        This OTP is valid for <b>10 minutes</b>.
      </p>

      <hr style="margin:20px 0;" />

      <p style="font-size:12px;color:#aaa;">
        If you didn’t request this, you can safely ignore this email.
      </p>

    </div>
  </div>
  `;
};


// 📧 SEND EMAIL VERIFICATION OTP
const sendVerificationEmail = async (email, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"Music App" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verify your email",
      html: buildTemplate({
        title: "Verify Your Email",
        subtitle: "Enter this OTP to verify your account",
        code: otp,
      }),
    });

    console.log("📧 Verification email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw new Error("Email sending failed");
  }
};


// 📧 SEND LOGIN OTP
const sendLoginOtpEmail = async (email, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"Music App" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Login OTP",
      html: buildTemplate({
        title: "Login to Your Account",
        subtitle: "Use this OTP to login securely",
        code: otp,
      }),
    });

    console.log("📧 Login OTP sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Login OTP failed:", error.message);
    throw new Error("Login OTP failed");
  }
};


module.exports = {
  sendVerificationEmail,
  sendLoginOtpEmail,
};