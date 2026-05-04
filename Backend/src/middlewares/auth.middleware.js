const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
// 🔐 PROTECT ROUTE
const protect = async (req, res, next) => {
  const accessToken = req.cookies?.accessToken;

  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET
    );
    req.user = decoded;
    return next();
  } catch {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Session expired" });
    }

    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
      );

      const user = await userModel.findById(decoded.id);

      if (!user || user.refreshToken !== refreshToken) {
        return res.status(403).json({ message: "Invalid session" });
      }

      const newAccessToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      req.user = { id: user._id, role: user.role };

      return next();
    } catch {
      return res.status(401).json({ message: "Session expired" });
    }
  }
};

// 🔐 ROLE-BASED AUTH
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden - Access denied",
      });
    }
    next();
  };
};

module.exports = {
  protect,
  authorize,
};