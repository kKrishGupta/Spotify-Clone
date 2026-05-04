const axios = require("axios");

let cachedUrl = null;
let lastFetch = 0;

const getNgrokUrl = async () => {
  // Cache (10 sec)
  if (cachedUrl && Date.now() - lastFetch < 10000) {
    return cachedUrl;
  }

  try {
    const res = await axios.get("http://127.0.0.1:4040/api/tunnels");

    if (!res.data.tunnels || res.data.tunnels.length === 0) {
      throw new Error("No ngrok tunnels found");
    }

    const httpsTunnel = res.data.tunnels.find(t => t.proto === "https");
    const url = httpsTunnel?.public_url || res.data.tunnels[0].public_url;

    cachedUrl = url;
    lastFetch = Date.now();

    console.log("🌐 Ngrok URL:", url);

    return url;

  } catch (err) {
    console.warn("⚠️ Ngrok not running. Using BASE_URL fallback");

    // ✅ IMPORTANT fallback
    return process.env.BASE_URL || `http://localhost:${process.env.PORT}`;
  }
};

module.exports = { getNgrokUrl };