const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const logger = require("../config/logger");

// 🔐 PROTECT ROUTE
const protect = async (
  req,
  res,
  next
) => {
  try {
    // Get access token from cookies
    const accessToken =
      req.cookies?.accessToken;

    // ❌ No access token
    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required",
      });
    }

    try {
      // ✅ Verify access token
      const decoded = jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_SECRET
      );

      req.user = {
        id: decoded.id,
        role: decoded.role,
      };

      return next();
    } catch (err) {
      logger.warn({
        message:
          "Access token verification failed",
        error: err.message,
      });

      // 🔄 Try refresh token flow
      const refreshToken =
        req.cookies?.refreshToken;

      // ❌ No refresh token
      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message:
            "Session expired",
        });
      }

      try {
        // ✅ Verify refresh token
        const decoded = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET
        );

        // ✅ Find user
        const user =
          await userModel.findById(
            decoded.id
          );

        // ❌ Invalid session
        if (
          !user ||
          user.refreshToken !==
            refreshToken
        ) {
          res.clearCookie(
            "accessToken"
          );

          res.clearCookie(
            "refreshToken"
          );

          return res.status(403).json({
            success: false,
            message:
              "Invalid session",
          });
        }

        // ✅ Generate new access token
        const newAccessToken =
          jwt.sign(
            {
              id: user._id,
              role: user.role,
            },
            process.env
              .JWT_ACCESS_SECRET,
            {
              expiresIn:
                process.env
                  .JWT_EXPIRES_IN ||
                "15m",
            }
          );

        // ✅ Set new cookie
        res.cookie(
          "accessToken",
          newAccessToken,
          {
            httpOnly: true,

            secure:
              process.env.NODE_ENV ===
              "production",

            sameSite:
              process.env.NODE_ENV ===
              "production"
                ? "none"
                : "strict",

            maxAge:
              15 *
              60 *
              1000,
          }
        );

        // ✅ Attach user
        req.user = {
          id: user._id,
          role: user.role,
        };

        logger.info({
          message:
            "Access token refreshed successfully",
          userId: user._id,
        });

        return next();
      } catch (err) {
        logger.error({
          message:
            "Refresh token verification failed",
          error: err.message,
        });

        // ❌ Clear invalid cookies
        res.clearCookie(
          "accessToken"
        );

        res.clearCookie(
          "refreshToken"
        );

        return res.status(401).json({
          success: false,
          message:
            "Session expired",
        });
      }
    }
  } catch (err) {
    logger.error({
      message:
        "Authentication middleware error",
      error: err.message,
    });

    return res.status(500).json({
      success: false,
      message:
        "Internal server error",
    });
  }
};

// 🔐 ROLE-BASED AUTHORIZATION
const authorize =
  (...roles) => {
    return (
      req,
      res,
      next
    ) => {
      try {
        // ❌ No user found
        if (!req.user) {
          return res.status(401).json({
            success: false,
            message:
              "Unauthorized",
          });
        }

        // ❌ Role not allowed
        if (
          !roles.includes(
            req.user.role
          )
        ) {
          return res.status(403).json({
            success: false,
            message:
              "Forbidden - Access denied",
          });
        }

        next();
      } catch (err) {
        logger.error({
          message:
            "Authorization middleware failed",
          error: err.message,
        });

        return res.status(500).json({
          success: false,
          message:
            "Internal server error",
        });
      }
    };
  };

module.exports = {
  protect,
  authorize,
};