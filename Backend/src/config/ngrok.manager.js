const ngrok = require("@ngrok/ngrok"); // 🔥 ADD THIS
let publicUrl = null;

const startNgrok = async () => {
  try {
    const listener = await ngrok.connect({
      addr: process.env.PORT || 3000,
      authtoken: process.env.NGROK_AUTHTOKEN,
    });

    publicUrl = listener.url();

    console.log("🌍 Ngrok URL:", publicUrl);

    return publicUrl;
  } catch (err) {
    console.error("Ngrok failed:", err.message);
    return null;
  }
};

const getBaseUrl = () => {
  if (!publicUrl) {
    throw new Error("Ngrok not initialized yet");
  }
  return publicUrl;
};

module.exports = { startNgrok, getBaseUrl };